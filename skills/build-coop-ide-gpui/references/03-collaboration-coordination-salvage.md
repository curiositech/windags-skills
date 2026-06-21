# Collaboration, Coordination & Salvage — the heart of the M×N IDE

This is the capstone's load-bearing chapter. The motion (`rust-gpui-motion`), the shaders (`gpui-shaders`), the audio (`sound-design-and-audio`), and the visual system (`beautiful-gui-design`) are how the harbor *feels*. **This is how the harbor is *true*:** how two humans and five agents edit one file without lying to each other, and how a dead agent's half-finished refactor survives its own process.

Everything below composes the sibling Rust skills as dependencies — when you animate a claim band, you are calling `rust-gpui-motion`; when you render an agent's presence cursor, you are calling `beautiful-gui-design`'s semantic-token discipline. This chapter owns the *data model and protocol* underneath them.

The thesis, quoted from the battle plan (`docs/strategy/harbor-editor-battle-plan.md:11`):

> "We win by making the CRDT *governable*: take the one genuinely-missing primitive (a fast Rust collaborative buffer) off the shelf — Loro v1.13.x — bind its awareness layer to PD claims so a claim *is* a presence range the guard can refuse to merge across, and treat every editing actor (human OR agent) as a first-class Loro replica keyed to its PD identity."

Hold those four clauses. They are the four sections of this doc: **co-equal replicas**, **presence-as-claims**, **the daemon as collab server**, and **salvage**. The CRDT merges bytes; the daemon governs intent; the harbor card decides who may write at all.

---

## 1. The actor model — every participant is a co-equal Loro replica

### The non-negotiable: humans and agents are the same *kind* of thing

The battle plan's sharpest line (`harbor-editor-battle-plan.md:65`):

> "Humans and agents are **co-equal Loro replicas**, distinguished only by PeerID provenance and the capability set on their harbor card — never by being a different *kind* of participant (Zed's flaw)."

This is the structural break from Zed, where "agents are **tools on a human's session** — thin identity, no provenance, no attestation, no salvage when the process drops" (`:23`). In the harbor, an agent is not a feature *of* a human's editor. It is a **peer** with its own PeerID, its own cursor, its own claimed range, its own op-log, and its own row in the daemon's session table. It renders identically to a human in the Quay — the interaction model already treats every running agent as "a clickable card flying its ICS signal flag" (`harbor-interaction-model.md:5`).

### The identity binding: PD identity → Loro PeerID

A **Loro PeerID** is a 64-bit replica identifier that Loro stamps on every op so concurrent inserts order deterministically (Lamport clocks) and authorship is attributable. The harbor *mints* that PeerID from the PD identity rather than letting it be random:

| Actor | PD identity | PeerID source |
|---|---|---|
| Human operator | OS user (`pd whoami`) | hash(os_user) |
| Dispatched agent | `project:stack:context` (e.g. `port-daddy:editor:p3`) | hash(identity) |

From the plan (`:42`): "Every actor gets a stable Loro **PeerID minted from its PD identity** (OS user for humans, `project:stack:context` for agents); Lamport clocks order concurrent inserts so attribution and merge are correct under conflict."

This binding is **load-bearing and fragile** — the plan flags it as a named risk (`:97`): "Loro-replica↔PD-identity binding must survive reconnect/salvage; a mismatch corrupts authorship/audit. Needs a clean identity↔replica contract." See §4 — salvage replays a *dead* replica's ops, so the PeerID must outlive the process that created it. **The PeerID is derived, never generated**, so the same identity reconnecting (or a successor inheriting a corpse's work) lands on the same replica lineage.

### Decision Point — one `LoroDoc` per file, one `LoroText` inside it

```rust
// editor.rs (new) — the Buffer wraps one LoroDoc per open file.
struct Buffer {
    doc:  LoroDoc,          // the whole-file CRDT
    text: LoroText,         // the editable rope inside it
    me:   PeerId,           // minted from `pd whoami` / the dispatch identity
}
```

The plan (`:42`): "Each open file = one `LoroDoc` holding a `LoroText`." Do not put many files in one doc — claim granularity, snapshot granularity, and salvage granularity are all per-file. A whole-repo doc would make a single agent's death dirty *every* file's recovery.

### The authorship gutter is the proof, from day one

`gpui-shaders` and `beautiful-gui-design` paint the gutter; this chapter mandates *what* it encodes. The plan's P1 exit criterion (`:118`): "a single human edits one local file backed by Loro, undo works, **the gutter shows authorship**. This is the editor core." And the rationale (`:116`): the per-PeerID authorship gutter "is the visible proof that 'agent vs human' is a first-class buffer concept from day one."

Render it with `rust-gpui-motion`'s color-only discipline: each span tinted by its PeerID's semantic token, never animated per-keystroke. A span authored by `port-daddy:editor:p3` and a span typed by the operator are the *same widget* with a different tone — exactly the co-equality the model demands.

#### Anti-Pattern — the agent sidebar
- **Symptom:** Agent edits land in a separate panel, a diff preview, or a "suggestions" tray the human approves into the buffer.
- **Detection:** The agent's ops do not flow through the same `LoroText` the human types into; there is an `apply_agent_suggestion()` path distinct from `local_insert()`.
- **Fix:** One buffer, two (or N) replicas. The agent's keystrokes are Loro ops authored to its PeerID, merged conflict-free into the same rope, visible in the same gutter. The *only* thing that gates an agent differently from a human is its **capability card** (§3) and its **claim** (§2) — never a separate write path. A sidebar is Zed's model; refuse it.

---

## 2. Presence-as-claims — a claim is an awareness range the guard refuses to merge across

### Why CRDT presence alone is a lie

A CRDT guarantees bytes converge. It says **nothing** about whether the converged bytes are *correct*. The plan, twice (`:11`, `:21`):

> "a CRDT guarantees bytes merge, never that *intent* agrees."
> "CRDT auto-merge hides **logical conflict**: 'merges cleanly' ≠ 'merges correctly.' No claim, lock, or intent primitive exists in Zed."

Two agents can each insert a perfectly-mergeable line into the same function and produce a function that compiles and is semantically contradictory. Loro will merge them silently and report success. That silent success *is the bug*. The harbor's answer is to put a governance layer **above** the CRDT.

### The bridge object: a claim rides in Loro Awareness

Loro ships an `Awareness` / `EphemeralStore` layer (timestamp-LWW, lossy-OK) for cursors and selections. The PD twist (`:44`):

> "Loro `EphemeralStore` (timestamp-LWW) + `Awareness` carry cursor/selection/viewport **and the PD twist: the actor's current claim as an awareness range** — the bridge object."

So presence is not just "here is my cursor." Presence is **"here is the range I have claimed, labeled with who I am and what I intend."** When agent A claims `parse_header`'s line range, that claim lands in `Awareness` as a colored, labeled band — "agent A — parse_header" — visible to *every* replica (`:70`). This satisfies the empirical finding the plan cites (`:44`, arXiv-2509.11826): agent activity must be "visible to ALL collaborators."

```
The bridge:  PD claim  ──mirror──▶  Loro Awareness range  ──render──▶  colored band in the gutter
                 │                                                          │
          durable, queryable                                       glanceable, ambient
        (daemon claims table)                                  (the operator's attention radar)
```

The fast ephemeral lane is **mirrored, debounced, into the daemon's durable claims table** (`:44`) so a transient cursor becomes queryable history that survives reconnect. Two lanes, one truth: ephemeral for 60fps cursor glide (`rust-gpui-motion`'s domain), durable for the audit trail and the commit gate.

### The wedge: predict the conflict *before a byte is written*

This is the differentiator the plan calls #2 (`:28`):

> "symbol/region claims sit *above* Loro; `POST /conflicts/predict` surfaces contradictory plans on the same symbol as a `Conflicted`-tone guard band **before a byte is written**. CRDTs cannot express this."

The route is real: `routes/symbols.ts:216` — `POST /conflicts/predict` takes `{ claimsA, claimsB }` (arrays of `{ filePath, symbolPath, type }`) and returns `{ count, blocking, warnings, info, conflicts }` (`symbols.ts:251`). The console renders `blocking > 0` as a `Tone::Conflicted` band. Note the existing tone vocabulary is *already in the gpui app*: `pane.rs:23` defines `Tone::Conflicted`, and `pane.rs:21` `Tone::Gated` — the exact two tones this chapter needs, already plumbed to OKLCH theme colors (`pane.rs:34`).

### Decision Point — when to predict (frame budget is correctness here)

The plan's risk note (`:95`): "predict on claim-acquire/region-enter, not per-keystroke (symbol parse per char is too slow). … over-warning trains actors to ignore the guard."

| Trigger | Predict? | Why |
|---|---|---|
| Actor acquires a claim | **Yes** | The moment intent is declared — cheapest, highest-signal. |
| Actor's cursor enters an unclaimed region near another's claim | **Yes (debounced)** | Pre-warn before the keystroke. |
| Every keystroke | **No** | Symbol-parse-per-char is too slow and trains the actor to ignore the band. |
| On `pd guard check --staged` (commit) | **Yes** | The final semantic gate (§3). |

### The co-edit walk (human H + agent A, one file)

Compressed from `harbor-editor-battle-plan.md:67-73`:

1. **Open.** Both H and A join the file's `LoroDoc` as replicas; the daemon mints/binds each PeerID to its PD identity.
2. **Claim before keystroke.** A is dispatched to refactor `parse_header`. It calls `POST /symbols/parse`, then claims the *symbol's line range* via `POST /sessions/A/files` — **region-scoped, not a whole-file lock**, so H can edit `render()` in the same file simultaneously. H claims via a UI affordance; A via the MCP tool `claim_region`.
3. **Predict.** The daemon runs `POST /conflicts/predict` against live claims. Overlap → the requester gets a `Conflicted`-tone band + a `pd nudge` to negotiate — **not** a silent merge. The harbor envelope is checked here; an actor lacking write-cap for the path is refused *before any op*.
4. **Edit.** Granted, the claim lands in Loro `Awareness` as a colored labeled range; edits flow as Loro ops over the tube; bytes merge conflict-free, each authored to its replica's PeerID.
5. **Who-wins on contention.** H tries to type **inside A's claimed range** → the Coordination Guard (the same guard that gates commits) intercepts, shows a `Tone::Gated` chip "claimed by agent A", and offers nudge or parley — never a silent merge. **Default rule: first granted, non-revoked claim wins**; the contender negotiates or moves.
6. **Commit gate.** `pd guard check --staged` refuses if an edited region's claim is held by another *live* actor — the semantic gate Zed's auto-merge skips (`:72`).
7. **Salvage** (§4) when a replica dies mid-edit.

#### Anti-Pattern — advertising the bypass in the guard message
- **Symptom:** The `Tone::Gated` chip reads "claimed by agent A (override with `--force`)" or the conflict band names `--no-verify`.
- **Detection:** Any agent-facing refusal string contains a bypass flag.
- **Fix:** Hard rule from the plan (`:71`): "The guard message points ONLY to the correct action (request handoff), never names a bypass flag." An agent takes whatever exit the error hands it — name the *correct* action (parley, nudge, pick another region), keep the bypass in `--help` for humans only. This is encoded in PD memory as a standing rule; do not regress it.

#### Anti-Pattern — whole-file locks masquerading as claims
- **Symptom:** Claiming `parse_header` blocks H from editing `render()` in the same file.
- **Detection:** The claim's granularity is the file path, not a `(start_line, end_line)` region.
- **Fix:** Region-scoped claims (`:68`). The whole point of presence-as-claims is *concurrent* edit of one file — a file lock throws that away and reduces you to single-driver, which is the model you are trying to beat.

---

## 3. The daemon IS the collab server — no new sync backend

### Reuse, don't rebuild

The single most important architecture decision (`harbor-editor-battle-plan.md:46`): "**the daemon IS the collab server (no new sync backend).**" The Fastify daemon on `:9876` already has every primitive a collab server needs. The Loro Protocol — Loro's multiplexed wire format carrying doc-ops + ephemeral cursors + awareness — rides the **existing tube pub/sub** that the gpui app already speaks.

The console's `agent.rs` already implements the tube: `tube_send` → `POST /msg/<channel>` (`agent.rs:306`), `tube_poll` → `GET /msg/<channel>?after=<cursor>` (`agent.rs:322`), and a live SSE subscription `subscribe_agent` that "spawns a tokio task that owns the [stream] and pumps `StreamEnvelope`s on an mpsc channel" (`agent.rs:381`). Stream frames are typed: `StreamKind::Status | Tube | Transcript | Other(..)` (`agent.rs:84`), parsed defensively so a malformed or unknown kind degrades to `Other` rather than crashing (`agent.rs:79`). **This is the exact plumbing the Loro Protocol folds into** — the plan (`:49`): "the exact plumbing the `AgentTranscript` surface already folds via `on_stream()`."

### The mapping — every collab need → an existing daemon primitive

| Collab need | Daemon primitive | Source |
|---|---|---|
| Doc-op delivery | Loro Protocol over tube SSE | `POST /msg/:channel`, `GET /msg/:channel/subscribe` |
| Ephemeral cursors / awareness | same tube, lossy lane | `EphemeralStore` frames |
| File claims | `POST /sessions/:id/files`, `GET /files/who-owns` | `routes/sessions.ts` |
| Symbol/region claims + conflict prediction | `POST /symbols/parse`, `POST /conflicts/predict` | `routes/symbols.ts:216` |
| Doc snapshots (durability) | content-addressed `/blob` | `routes/blob.ts` |
| Op-log + claim acquire/release (audit) | **immutable notes** | PD notes (append-only) |
| Authz per path/region | harbor envelopes + Ed25519 cards | `routes/harbors.ts`, `core/harbor-card-rs/src/lib.rs` |

The durability line (`:50`): "doc snapshots → content-addressed `/blob`; op-log deltas + claim acquire/release → immutable notes. **This is the salvage substrate.**" Notes are immutable by daemon contract — once written they cannot be edited or deleted — which is precisely what an audit trail and a replayable op-log require.

### Authz — capability-scoped, not trust-the-room

Zed's collab is "all-or-nothing filesystem trust" (`:30`). The harbor is capability-scoped via signed Ed25519 cards. `core/harbor-card-rs/src/lib.rs` defines `HarborCardClaims { sub, harbor, cap[], iat, exp, jti }` (`:52`, 218 LOC, Kani proof targets). The enforcement (`:52`):

> "An agent without a write-cap for `src/auth/*.rs` has its Loro ops **rejected at daemon ingress** — structural, not advisory."

Two modes:
- **ENFORCE** (governed harbors): the out-of-claim or out-of-cap Loro op is rejected at ingress. ADR-0053 DOM DADDY is the out-of-band enforcement path — the op never lands in any replica.
- **Advisory**: the band surfaces, the op lands with a note. For low-stakes / single-operator harbors.

#### Decision Point — keep the edit-sync channel off the coordination control plane

A named risk (`:99`): "Zed's loudest complaint is AI/collab surfaces bloating the core and tanking perf. **Isolate the edit-sync channel from the coordination control plane** so editor load never regresses claim latency." Run doc-ops on their own tube channel; run claims/guard/conflict-predict on the control plane. A burst of keystrokes from five agents must never starve a `conflicts/predict` call.

### Agents reach all of this through agent-neutral MCP tools

The plan (`:75`): agents act "through agent-neutral MCP tools (`claim_region`, `release_region`, `coordination_preflight`, `salvage`) — first-class, **never Claude-specific**." This matches the standing PD rule that coordination primitives must serve *every* backend, not just Claude Code. The `port-daddy` MCP server already exposes `begin_session`, `claim_port`, `coordination_preflight`, `add_note`, `spawn_agent`, `run_sortie` — the editor tools extend that same surface.

#### Anti-Pattern — building a parallel WebSocket sync server
- **Symptom:** A new `collab-server.ts` with its own room management, its own auth, its own persistence.
- **Detection:** Doc-ops flow over a socket the daemon does not own; claims live in a different store than `routes/sessions.ts`.
- **Fix:** The daemon is the server. The tube is the transport. `/blob` is the snapshot store. Notes are the op-log. A parallel server duplicates auth, splits the audit trail, and forfeits salvage (which depends on the daemon's session table + notes). The plan's P2 reuses "tube pub/sub, `/blob`, immutable notes, `AgentTranscript` SSE plumbing" (`:85`) — all already shipped.

---

## 4. Salvage — a dead replica's op-log replays, its claim inherits

This is the headline. The plan (`:29`): "**Salvage** — a dead actor's op-log + claim persist to content-addressed `/blob` + immutable notes; `pd salvage` replays and inherits. Zed loses the work when the ACP process drops." And the wedge framing (`:11`): "**First place we beat Zed: the salvageable agent in a shared buffer** — kill an agent mid-edit and a successor replays its op-log, inherits its claim, and finishes with full provenance. That is structurally impossible in Zed's trust-the-room, cloud-only, ephemeral-session model."

### Why it's structurally impossible in Zed and trivial in the harbor

Zed's collaboration is session-scoped and ephemeral (`:22`): "Coordination is **ephemeral** — session-scoped, evaporates when the room closes." When an ACP agent process drops, its in-flight edits, its identity, and its intent all evaporate with the socket. There is no durable record of what it was doing or how far it got.

The harbor never had that fragility, because **the op-log and the claim were already persisted to the daemon as the edit happened** (§3). The agent dying changes nothing about the durability — its work is already in `/blob` (snapshot) + immutable notes (op-log delta) + the session table (claim). Salvage is just *reading what was already written* and handing it to a successor.

### The salvage walk (`harbor-editor-battle-plan.md:73`)

1. **Death.** Agent A's process dies mid-edit of `parse_header`.
2. **Persistence (already done).** A's claim + flushed op-log + scope note persist: `/blob` snapshot + session record + immutable note. No special death-handler — this was happening continuously.
3. **Surface.** `POST /recovery/request` surfaces "agent A left dirty work on parse_header (claim held, snapshot `blob:…`)". This rides the existing recovery route family — `routes/recovery.ts` already implements single-use, atomic, DB-enforced token consumption (`recovery.ts:5`, `:59`: "atomically consumes the token … enforces single-use at the DB layer" via `UPDATE WHERE consumed_at IS NULL RETURNING`).
4. **Consume.** A successor calls `POST /recovery/consume`, **replays A's ops onto the live doc**, **inherits A's claim**, and finishes — with full attribution. The MCP `salvage` tool is the agent-facing door.
5. **Provenance.** An immutable note records who-wrote-which-span, which card `jti` authorized it, which note justified the handoff.

The phasing folds salvage into the wedge demo (`:87`, P3.5): "Kill an agent mid-edit, recover the edit … `/recovery/consume` replays + inherits; immutable-note audit of who-wrote-which-span. **The headline demo.**"

### Decision Point — replay correctness is a property test, not a happy path

The sharpest risk in the whole plan (`:96`):

> "Replaying a dead replica's op-log onto a doc that advanced after its death must converge deterministically — needs **property tests on Loro op-replay ordering**, not a happy-path demo."

The scenario: A dies at op #40. H and agent B keep editing — the live doc advances to op #95. Now a successor replays A's ops #1–#40 onto that advanced doc. **Loro's CRDT guarantees the bytes converge** (Fugue + Eg-Walker lineage, `:39`), but you must prove:
- A's ops carry A's PeerID and Lamport timestamps, so they slot into the causal order *as if A had stayed alive* — authorship stays correct.
- Replaying is idempotent: a partially-flushed op-log replayed twice must not double-insert.
- The inherited claim's range maps onto the *post-advance* line numbers (H may have shifted them), or the successor re-derives the claim from the symbol, not raw lines.

The plan scaffolds this early — P1 builds a "Property-test harness scaffold for Loro op-replay convergence (the salvage-correctness foundation, even though salvage lands in P3.5)" (`:117`). Build the property test *before* the demo; a happy-path salvage that diverges under concurrent advance is worse than no salvage.

#### Quality Gate — salvage
- [ ] A's replayed ops are authored to A's PeerID, not the successor's — the gutter still shows A wrote that span.
- [ ] Replay is idempotent under double-consume attempts (the `consumed_at IS NULL RETURNING` guard at `recovery.ts` is the DB-level enforcement; the replay must match it).
- [ ] The inherited claim survives the line-number drift caused by edits that landed *after* A's death (re-derive from symbol, not absolute lines).
- [ ] Property test: for N random interleavings of {A's ops, post-death ops}, replay converges to the same doc the daemon snapshot would produce, with stable per-span authorship.
- [ ] The handoff is recorded in an immutable note: dead identity, successor identity, card `jti`, claimed range, snapshot `blob:` hash.

#### Anti-Pattern — salvage as "re-run the prompt"
- **Symptom:** "Recovery" means dispatching a fresh agent with the same task prompt and discarding A's partial work.
- **Detection:** No op-log replay; the successor starts from the pre-A doc state.
- **Fix:** That is not salvage — it is restart, and it throws away A's tokens, A's reasoning, and the convergence guarantee. Salvage *replays the actual ops* A flushed. The PD-memory rule applies: "Never delete — demote instead"; a dead agent's work is inherited, not discarded.

---

## 5. The M×N coordination model

The capstone's name is "Build an M-Agent + N-Human cooperative IDE." The coordination model is what makes M×N tractable instead of M×N pairwise chaos.

### Why pairwise doesn't scale, and claims do

With M agents and N humans all in one buffer, naïve pairwise conflict detection is O((M+N)²) per edit — every actor checking against every other. The harbor collapses this: **every actor checks against the *claim ledger*, not against every other actor.** A claim is a single declarative range in the daemon's table. Conflict prediction is "does my requested range overlap any *held* claim?" — O(held claims), not O(actors²). The `conflicts/predict` route takes two claim sets and returns overlaps (`symbols.ts:243`); the ledger is the shared blackboard every actor reads.

```
        N humans                         M agents
       (Quay cards)                    (Quay cards)
            │                               │
            └──────────┬────────────────────┘
                       ▼
            ┌───────────────────────┐
            │   the claim ledger    │   ← single source of intent-truth
            │  (daemon sessions +   │      (durable, queryable, immutable-noted)
            │   symbols + harbors)  │
            └───────────────────────┘
                       ▲
            every actor declares intent here BEFORE editing;
            conflict-predict runs against the ledger, not pairwise
```

The interaction model makes this *glanceable*: the Quay is "an ambient attention radar" (`harbor-interaction-model.md:34`) where cards "pulse when their flag flips to Foxtrot (needs-you) / Kilo (has-message)." A human conducts M agents by **recognition** (`:23`) — "the fleet is *always on screen* … every target is a *labeled click* … the flag badge tells you *which* agent needs you *before* you click anything." That is M×N coordination rendered as a roster you conduct, not a grid you address.

### The three harbor topologies

The buffer never knows which water it's in — the plan abstracts transport behind a `SyncTransport` trait (`:54`), and the same Loro Protocol frames ride whichever transport the harbor resolves to. The three topologies (`:55-57`):

| Topology | Transport | Authority | When |
|---|---|---|---|
| **Shared** (default, P3) | host daemon HTTP + SSE | host's daemon is authoritative for the claim/governance ledger + `/blob` | Lowest friction, pure reuse. Join-by-link, one daemon. |
| **LAN** (P4) | iroh 1.0 QUIC/mDNS direct P2P for doc+ephemeral; host daemon tube SSE for coordination | host daemon for governance, P2P for bytes | Office / same-network co-edit, self-hosted, no vendor cloud. |
| **Remote** (P5) | daemon on remote host over the relay (`lib/relay-client.ts`, `routes/relay.ts`); Loro E2E-encrypted doc channel | remote daemon; **only ciphertext + signed claim metadata transit the relay** | Distributed teams, air-gap-adjacent. Buffer contents never plaintext on the relay. |

**Build-order discipline (the plan's core correction, `:79`):** "the buffer is the risk, not the transport. Prove the editor + coordination over the daemon bus we already have; abstract topology behind `SyncTransport` from day one but defer iroh/relay until the wedge is demoed." iroh is **net-new — absent from the codebase today** (`:56`, verified); the relay is partial (`:57`, ADR-0027/0049 "design-plus-partial, not the full iroh-relay NAT-traversal stack"). So LAN and Remote are gated behind topology phases, never the critical path. **Shared is the default** because it is pure reuse — the host daemon you already run.

#### Anti-Pattern — transport-first build order
- **Symptom:** Sprint 1 builds iroh P2P / NAT traversal before a human can edit one local file.
- **Detection:** The roadmap front-loads networking; the Loro buffer is "later."
- **Fix:** The plan explicitly **rejects** Design C's transport-first order as "a timeline trap" (`:5`). The buffer (P1) is the only genuinely-from-scratch cost (`:93`). Prove it locally, then layer multiplayer over the existing tube (P2, pure reuse), then claims+salvage (P3/P3.5, the wedge), *then* topology (P4/P5). Honest scope: "iroh NAT traversal is not 100% — symmetric-NAT remote harbors fall back to a (self-hostable) relay hop; the 'pure P2P everywhere' story must be honest, not hidden" (`:98`).

---

## 6. How this composes the sibling skills

This chapter is the *substance*; the siblings make it *land*. The dependencies, by name:

| Sibling skill | What it owns in the collab UX | Where it plugs in |
|---|---|---|
| **rust-gpui-motion** | The claim band's appearance/dissolve, the presence-cursor glide, the flag-pulse on the Quay, the salvage "agent A left dirty work" card sliding in. **Color/opacity/layout-fraction only — never `transform`, never per-keystroke.** | §2 (claim band as `Tone::Conflicted`/`Tone::Gated`), §5 (Quay pulse via `with_animation` on opacity) |
| **gpui-shaders** | The authorship gutter's per-PeerID tinting; any bespoke causal-thread / presence-overlay surface (the Vello living-harbor viz, `:59`, workspace-excluded, off critical path). | §1 (authorship gutter), §5 (causal-thread overlay) |
| **sound-design-and-audio** | Optional auditory presence: a soft cue when an agent claims near your cursor, a distinct tone when a salvage surfaces. Honor reduced-motion's audio analog — never noisy. | §2 (claim-acquire cue), §4 (salvage-available cue) |
| **beautiful-gui-design** | The semantic-token discipline so "agent vs human" is one widget with a different tone; the OKLCH `Tone` → theme mapping (`pane.rs:27`); 14px-min text in the Quay composer (`harbor-interaction-model.md:134`); contrast across light/dark. | §1 (co-equal rendering), §2 (tone vocabulary), throughout |

The motion skill's frame-budget law is *coordination-critical here*, not cosmetic: a `.repeat()` claim-band animation left running for an off-screen file (`rust-gpui-motion` failure mode "`repeat()` that never stops re-rendering") will burn the frame budget that doc-op application needs. **Scope every presence animation to the smallest leaf view and pause it when the pane is idle or off-screen** — the same rule the motion skill enforces, now load-bearing for editor latency.

---

## 7. Quality Gates — collaboration, coordination & salvage

- [ ] **Co-equality:** an agent's edit and a human's edit flow through the *same* `LoroText`, authored to distinct PeerIDs minted from PD identities; no separate "agent suggestion" write path.
- [ ] **Presence-as-claims:** every claim appears as a labeled awareness range visible to all replicas *and* is mirrored to the durable claims table; ephemeral and durable lanes agree.
- [ ] **Predict-before-write:** `POST /conflicts/predict` runs on claim-acquire / region-enter (debounced), never per-keystroke; `blocking > 0` renders `Tone::Conflicted`.
- [ ] **Guard never advertises bypass:** every refusal string names only the correct action (handoff/parley/nudge); no `--force`/`--no-verify`/`--allow-*` in any agent-facing message.
- [ ] **Region, not file, granularity:** claiming one symbol does not lock the file; two actors edit adjacent regions concurrently.
- [ ] **Daemon is the server:** doc-ops ride the existing tube (`agent.rs` SSE plumbing); snapshots → `/blob`; op-log + claims → immutable notes. No parallel sync server.
- [ ] **Capability enforcement:** in ENFORCE mode, an op lacking a write-cap for its path is rejected at daemon ingress, structurally (Ed25519 card `cap[]` check), not advisory.
- [ ] **Edit-sync isolated from control plane:** a keystroke burst from M agents does not starve `conflicts/predict` latency.
- [ ] **Salvage replays, never restarts:** a dead replica's actual ops replay (authored to *its* PeerID), claim inherits, with a property test proving convergence under concurrent post-death advance.
- [ ] **Provenance:** every salvage and every cross-claim edit lands an immutable note (dead/successor identity, card `jti`, range, snapshot hash).
- [ ] **MCP parity:** `claim_region`, `release_region`, `coordination_preflight`, `salvage` are agent-neutral MCP tools — first-class for every backend, never Claude-specific.
- [ ] **Topology honesty:** Shared is the default (pure reuse); LAN/Remote are gated behind `SyncTransport` and never block the wedge; the "pure P2P" story discloses the relay fallback.

---

**Files that ground this chapter (all absolute):**
`/Users/erichowens/coding/port-daddy/docs/strategy/harbor-editor-battle-plan.md` (the thesis, §1–7), `/Users/erichowens/coding/port-daddy/docs/design/harbor-interaction-model.md` (the Quay / M×N-as-roster), `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/agent.rs` (tube + SSE collab transport: `tube_send`:306, `subscribe_agent`:381, `StreamKind`:84, `StreamEnvelope`:119), `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/pane.rs` (`Tone::Conflicted`/`Gated`:21-23, the `Surface` contract + `SurfaceAction::Interrupt`:56, `on_stream`:114), `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/mux.rs` (`SurfaceKind`:33, `AgentTranscript{agent_id}`:35), `/Users/erichowens/coding/port-daddy/routes/symbols.ts` (`POST /conflicts/predict`:216, response shape:251), `/Users/erichowens/coding/port-daddy/routes/recovery.ts` (single-use atomic salvage consume:66), `/Users/erichowens/coding/port-daddy/core/harbor-card-rs/src/lib.rs` (Ed25519 `HarborCardClaims{sub,harbor,cap[],iat,exp,jti}`). Sibling skills (dependencies): `rust-gpui-motion`, `gpui-shaders`, `sound-design-and-audio`, `beautiful-gui-design`.
