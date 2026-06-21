# Architecture & The Stack — The Whole-System View

This is the load-bearing wall of the capstone. Before you write motion, shaders, audio, or a single visual token, you must hold the *whole machine* in your head: **M autonomous agents and N humans editing the same files at the same time, as co-equal replicas, on a native Rust gpui shell, governed by a daemon that already exists.** Everything else in this skill — and the four sibling skills it composes — hangs off the four layers described here.

The spine is not negotiable, and it is not ours to invent. It is the **Harbor Editor battle plan** (`docs/strategy/harbor-editor-battle-plan.md`), whose thesis we quote because it is the entire reason this product is buildable at all:

> "We win by making the CRDT *governable*: take the one genuinely-missing primitive (a fast Rust collaborative buffer) off the shelf — Loro v1.13.x — bind its awareness layer to PD claims so a claim *is* a presence range the guard can refuse to merge across, and treat every editing actor (human OR agent) as a first-class Loro replica keyed to its PD identity." — battle plan §1

The buffer merges bytes; the daemon governs intent; the harbor card decides who may write the region at all. That sentence is the architecture. The rest of this doc unpacks it into four layers and a dependency map onto the sibling skills.

---

## 1. The four layers (top to bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — gpui SHELL                  pd-console (Zed's framework)    │
│  Workspace pane-tree · SurfaceKind::Editor · Quay/board/steer/HOP     │
│  the FACE. motion (sibling), shaders (sibling), audio (sibling),      │
│  visual system (sibling) all live HERE.                               │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — EDITOR CORE on a Rust CRDT       one LoroDoc per file      │
│  LoroText · PeerID minted from PD identity · EphemeralStore awareness │
│  · stable cursors · authorship gutter · tree-sitter on CRDT deltas    │
│  the TRUTH OF THE TEXT. conflict-free byte merge, per-replica authored│
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 3 — COORDINATION KERNEL              the daemon on :9876        │
│  claims (file/symbol/region) · POST /conflicts/predict · commit guard │
│  · salvage · Ed25519 harbor cards · immutable-note audit trail        │
│  the GOVERNANCE OF INTENT. the layer Zed does not have.               │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 4 — TRANSPORT per harbor topology    SyncTransport trait       │
│  Shared (daemon HTTP+SSE) · LAN (iroh QUIC/mDNS) · Remote (relay+E2E) │
│  the WATER the buffer floats in. editor never knows which.            │
└──────────────────────────────────────────────────────────────────────┘
```

The discipline that makes this tractable: **each layer reuses a named, already-shipped PD asset, and the only genuinely from-scratch cost is Layer 2's buffer.** Layers 1, 3, and 4 are assembly of parts that exist. Hold that line — a buffer without Layer 3's claims and salvage is, in the battle plan's words, "a Potemkin editor, not the product" (§6). Refuse it.

---

## 2. Layer 1 — the gpui shell (the FACE)

The shell is **pd-console**, the same gpui framework Zed ships on (native Rust on Metal). We do not build a window manager — one exists, it is GPUI-free, and it is exhaustively unit-tested.

**The pane tree is the spine.** `core/pd-console/src/mux.rs:1-15` states the contract: a `Workspace` is a tree of `Node::Leaf` / `Node::Split`, "deliberately **GPUI-free and dependency-free** so it compiles on the Linux CI gate and is exhaustively unit-testable." The operations you compose against — `split` (mux.rs:179), `swap_surface` (mux.rs:257), `bind_entity` (mux.rs:266), `resize` (mux.rs:280), `focus`/`focus_next` (mux.rs:229/247) — are all present and tested (`split_creates_two_panes` at mux.rs:417, `bind_entity_repoints_transcript` at mux.rs:494). **You add a leaf type, not a layout engine.**

**The editor is a new `SurfaceKind` variant.** The live enum at `mux.rs:33` has `AgentTranscript`, `Roadmap`, `FileTree`, `Fleet`, `Dispatch`, `Panel` — and *no `Editor`*. That absence is the confirmation that the editor surface is net-new (battle plan P0). The variant to add:

```rust
SurfaceKind::Editor { path: String, region: Option<(u32, u32)> }
```

It implements the existing object-safe `Pane`/`Surface` trait (`pane.rs:79`), which is already a *Surface*, not a read-only pane: it has `view()` (emits render-agnostic `Block`s), `mutate()` for daemon actions (`pane.rs:95`), `subscription()` to watch a live stream (`pane.rs:107`), and `on_stream()` to fold streamed frames (`pane.rs:114`). **One pane, two faces** (pane.rs:8): the gpui shell paints rich text; the ratatui TUI paints a read-only line-claim view of the *same doc*. This is load-bearing — it forces the editor's state to live in the buffer, not the renderer.

**The semantic `Tone` vocabulary is already the conflict-UX palette.** `pane.rs:16` defines `Tone::{Default, Accent, Engaged, Gated, Resting, Landed, Conflicted}` — color = MEANING, resolved to theme OKLCH by the renderer (pane.rs:27). When two actors reach for the same region, you do not invent a warning color: you paint the overlap band `Tone::Conflicted` and a claim chip `Tone::Gated`. The maritime design system did this work for you.

**The interaction model is the Harbor.** Per `docs/design/harbor-interaction-model.md`: a persistent left **Quay** (agent dock) is the spine; you "operate a roster of live ships," not navigate a tmux grid (§1). BOARD → STEER → DETACH → HOP. The same `bind_entity` that hops an agent transcript hops the editor's *follow target* — when you BOARD agent A, the editor can scroll-lock to A's claimed region and live-cursor. The editor surface is a citizen of the Quay model, not a parallel UI.

**Everything visual on this layer is a sibling skill** — see §6.

---

## 3. Layer 2 — the editor core on Loro (the TRUTH OF THE TEXT)

This is the one hard, from-scratch cost, and the doc is honest about it (battle plan §6): "GPUI text editing is not a public, documented widget the way Loro is a documented CRDT."

**The CRDT is Loro v1.13.x. The decision is made; here is why** (battle plan §3):

- **Fastest in 2026 benchmarks** (B4 trace, 260K-char doc): ~290ms apply vs Yjs 430 / Automerge 680; 68 kB encoded vs 160/250; 15 MB mem vs 28/41.
- **A documented, embeddable Rust crate** with first-class Rust + Swift + WASM APIs. Zed's CRDT is *internal, not a reusable library* — adopting it means reimplementing it. cola/diamond-types are text-only building blocks (no presence, no persistence). Loro ships `EphemeralStore`, `Awareness`, stable cursors (`get_cursor`/`get_cursor_pos`), rich-text marks, and the multiplexed Loro Protocol.
- **Lineage = Fugue + Eg-Walker** — same algorithmic class as Zed's, partition-tolerant.
- **Fallbacks named and rejected for now:** Yrs only if CodeMirror/Monaco bindings dominate; Automerge only if Git-like document history becomes a product feature.

**The data model:**

- **One `LoroDoc` per open file**, holding a `LoroText`.
- **Every actor is a Loro replica** with a stable **PeerID minted from its PD identity** — OS user for humans, `project:stack:context` for agents. Lamport clocks order concurrent inserts so attribution and merge are correct under conflict.
- **Presence rides `EphemeralStore` (timestamp-LWW) + `Awareness`**, carrying cursor/selection/viewport **and the PD twist: the actor's current claim as an awareness range** — this is *the bridge object* between Layer 2 and Layer 3. Agent presence renders **identically to human presence** (named replica, cursor, "editing region X"). That co-equality is the whole differentiator; a "different kind of participant" is Zed's flaw (battle plan §4).

**The CRDT model is co-equal replicas** — battle plan §4:

> "Humans and agents are **co-equal Loro replicas**, distinguished only by PeerID provenance and the capability set on their harbor card — never by being a different *kind* of participant."

**The visible proof of co-equality is the authorship gutter** (battle plan P1): each text span is colored by its PeerID. That is why "agent vs human" is a first-class *buffer* concept from day one, not a UI afterthought. tree-sitter re-parses incrementally on CRDT deltas for syntax highlighting.

**The binding risk you must respect:** wiring Loro's delta stream into gpui's entity/render model must do **viewport-diff rendering, not full re-layout per op** (battle plan §6). "Do not try to out-edit Zed on latency — win on coordination." This is where the `rust-gpui-motion` sibling's frame-budget law (§6 below) is not optional polish — it is correctness.

---

## 4. Layer 3 — the coordination kernel (the GOVERNANCE OF INTENT)

**This is the layer Zed does not have, and it is already built.** The daemon on `:9876` *is* the collab server — no new sync backend (battle plan §3). A CRDT guarantees bytes merge; it never guarantees that *intent* agrees. "merges cleanly" ≠ "merges correctly." Layer 3 governs the difference.

**Claims — a claim is a presence range the guard can refuse to merge across:**
- File claims: `POST /sessions/:id/files`, `GET /files/who-owns` (`routes/sessions.ts`).
- Symbol/region claims + **the wedge**: `POST /symbols/parse`, **`POST /conflicts/predict` (`routes/symbols.ts:216`)**. This surfaces contradictory plans on the same symbol *before a byte is written* — the thing CRDTs structurally cannot express.

**The commit guard** is the semantic gate Zed's auto-merge skips: `pd guard check --staged` refuses if an edited region's claim is held by another *live* actor. **HARD RULE (battle plan §4, MEMORY canon):** the guard's refusal message points ONLY to the correct action (request handoff) and **never names a bypass flag.** An agent takes whatever exit the error hands it; advertising `--no-verify` to an agent is handing it the override.

**Salvage — the headline differentiator.** A dead actor's op-log + claim persist to content-addressed `/blob` (`routes/blob.ts`) + immutable notes. `POST /recovery/request` surfaces "agent A left dirty work on parse_header (claim held, snapshot `blob:…`)"; a successor `POST /recovery/consume` replays A's ops onto the live doc, inherits the claim, and finishes — full provenance. "Zed loses this entirely" (battle plan §4, step 7). This is the demo that wins the category.

**Authz — capability-scoped, not trust-the-room.** Harbor enforcement envelopes (`PUT /harbors/:name/envelope`, dry-run `POST /harbors/:name/check`, `routes/harbors.ts`) backed by **signed Ed25519 cards** (`core/harbor-card-rs/src/lib.rs`, `HarborCardClaims{sub,harbor,cap[],iat,exp,jti}`, 218 LOC, Kani proof targets). An agent without a write-cap for `src/auth/*.rs` has its Loro ops **rejected at daemon ingress** — structural, not advisory. ADR-0053 DOM DADDY is the out-of-band ENFORCE path.

**The agent bridge is also here.** `agent.rs` (the conversation mux, "ON THE PD BUS, backend-agnostic, ADR-0046", agent.rs:1) gives 8 backends, a per-agent tube channel, and typed SSE `StreamEnvelope`s (agent.rs:119) — inline per-file agent chat + steering for free. Plus the **ACP+MCP bridge**: expose PD claims/guard/salvage/nudge to ACP agents so PD coordinates the agents Zed/JetBrains already host. We win the swarm even if our own editor lags.

**Agents reach all of this through agent-neutral MCP tools** (`claim_region`, `release_region`, `coordination_preflight`, `salvage`) — first-class, **never Claude-specific** (battle plan §4). This is a hard PD canon: build for every agent backend, not one.

---

## 5. Layer 4 — transport per harbor topology (the WATER)

The editor **never knows which water it is in.** Loro Protocol frames ride whichever transport the harbor resolves to, abstracted behind a `SyncTransport` trait — **but proven last.** The battle plan rejects a transport-first build order as "a timeline trap" (§5): the buffer is the risk, not the transport.

| Harbor | Transport | Status | Maturity honesty |
|---|---|---|---|
| **Shared** (default) | Host daemon authoritative for ledger + `/blob`; joiners over daemon HTTP+SSE | **Pure reuse** — exists today | Lowest friction. Ship first. |
| **LAN** | iroh 1.0 QUIC/mDNS for direct P2P doc+ephemeral sync; daemon tube SSE as coordination bus | **Net-new** — iroh appears nowhere in the codebase (verified) | Gated behind a topology phase, never the critical path. |
| **Remote** | Daemon over the partial relay (`lib/relay-client.ts`, `routes/relay.ts`); Loro's E2E-encrypted channel keeps buffer private — only ciphertext + signed claim metadata transit | **Partial** — ADR-0027/0049 mesh is design-plus-partial, *not* the full iroh-relay NAT-traversal stack | Symmetric-NAT falls back to a (self-hostable) relay hop. The "pure P2P everywhere" story must stay honest. |

The whole transport layer reuses the **existing tube pub/sub** as its default frame (`POST /msg/:channel`, `GET /msg/:channel/subscribe` SSE) — the exact plumbing `AgentTranscript` already folds via `on_stream()` (pane.rs:114). You are not building a network stack on day one; you are multiplexing Loro Protocol over a bus that already moves agent transcripts.

**Daemon-leanness is an architecture constraint, not a nicety** (battle plan §6): Zed's loudest complaint is AI/collab surfaces bloating the core and tanking perf. **Isolate the edit-sync channel from the coordination control plane** so editor load never regresses claim latency.

---

## 6. The dependency map onto the sibling skills

This capstone **composes** four sibling Rust/design skills. It does not re-derive what they own; it calls them by name and obeys their laws. Each maps to a specific layer.

```
                        ┌─────────────────────────────┐
                        │  CAPSTONE (this skill):      │
                        │  the whole-system architect  │
                        └──────────────┬──────────────┘
            ┌──────────────┬───────────┼───────────┬──────────────┐
            ▼              ▼           ▼           ▼              ▼
    beautiful-gui-    rust-gpui-   gpui-shaders  sound-design-  (battle plan
    design            motion       (sibling)     and-audio      = the spine,
    = visual system   = transitions = living-    = audio        not a skill)
    Layer 1 tokens    Layer 1+2     harbor viz    Layer 1
                      motion        Track B
```

**`beautiful-gui-design` — the VISUAL SYSTEM (Layer 1).** Owns hierarchy, color, type, spacing, the three-tier token model, light/dark, WCAG contrast, accessibility, component states. **Load-bearing, not polish:** the maritime OKLCH semantic tokens in `palette.rs`/`theme.rs` and the `Tone` enum (pane.rs:16) *are* this skill's three-tier model already realized. The conflict-band UX, the claim chips, the authorship-gutter colors all obey its rules: color is semantic tokens never raw hex, body ≥14px (the hard font-floor canon), every interactive control has default/hover/active/focus/disabled. The skill's "Invisible in Light Mode" and "Rainbow Vomit" anti-patterns gate every status color you add for M agents.

**`rust-gpui-motion` — the TRANSITIONS (Layer 1 + the Layer 2 binding).** Owns `with_animation`, easing, `BoxShadow`/glow, breathing dots, pane expand/zoom/slide, the no-transform constraint, and — critically for this capstone — **the frame-budget law.** Its rule "Frame budget is architecture, not polish" is exactly the Loro↔gpui binding constraint from Layer 2: a `.repeat()` re-renders the window forever and every re-render walks the whole tree, so the live-cursor pulse for N remote actors, the claim-band breathing, and the spawn→board transition must each be **one owner, scoped to the smallest leaf, viewport-diffed.** The skill's "layout animation in a hot render" anti-pattern is the literal failure mode of naively re-laying-out the editor per CRDT op. **You cannot ship the editor without obeying this skill.** Reduced-motion-first is also non-negotiable PD canon.

**`gpui-shaders` — the LIVING-HARBOR VIZ (Layer 1, Track B, isolated).** Owns the bespoke GPU surface for the presence/causal-thread overlay — the `pd-timeline-proto` Vello 0.3 + Parley + wgpu path (`core/pd-timeline-proto/src/{data,scene,main}.rs`) fed by `GET /activity/timeline`. This is where the M-agent swarm becomes *visible* as flowing causal threads, pixelated-wave harbor water, signal-flag wakes. **Polish, not load-bearing:** it stays **workspace-excluded with its own Cargo.lock** so heavy GPU deps never hit the Linux CI gate (battle plan §3; the FleetPopoverTests rot is the cautionary tale). The editor ships without it; the *demo* sings with it. `rust-gpui-motion` §5 ("Bespoke Graphics — Vello/wgpu") names this as the last-resort escape hatch — earn it, don't default to it.

**`sound-design-and-audio` — the AUDIO (Layer 1).** Owns the sonic layer: a claim granted, a conflict band appearing, an agent landing a commit, a salvage recovering a dead replica's work — each is an event that wants a restrained, accessible, mutable sound. **Polish, gated behind a preference, never the critical path.** Like motion, it must honor a reduced/off setting and never be the only channel carrying state (accessibility: sound complements the `Tone::Conflicted` band, never replaces it).

**The battle plan itself is the spine, not a sibling skill** — it is the architectural decision this whole capstone implements. Quote it; do not relitigate it.

---

## 7. Load-bearing vs polish (the honest cut)

When the multi-quarter scope (battle plan §6: "This is a multi-quarter build") forces a cut, cut in this order — polish first, spine last.

**LOAD-BEARING — the product is a lie without these:**
- Layer 2: the Loro buffer + per-PeerID authorship gutter (the one from-scratch cost; battle plan P1).
- Layer 3: region claims rendered as Loro awareness ranges + `POST /conflicts/predict` overlap detection + the commit guard (the wedge; battle plan P3).
- Layer 3: salvage — dead-replica op-log persistence + `recovery/consume` replay (the headline; battle plan P3.5).
- Layer 3: capability enforcement via Ed25519 cards at daemon ingress (battle plan P4).
- `rust-gpui-motion`'s frame-budget law (it is correctness, not motion).
- `beautiful-gui-design`'s token model + the 14px font-floor + reduced-motion (accessibility canon).

**POLISH — the demo wants these, the product survives without them:**
- `gpui-shaders` living-harbor Vello overlay (Track B, workspace-isolated).
- `sound-design-and-audio` event sonification (preference-gated).
- Layer 4 LAN (iroh) and Remote (relay) topologies — Shared-harbor reuse ships first; iroh/relay are gated behind the topology phase precisely so they never block the wedge.
- Recency float-up, flag-pulse, drag-to-retask (harbor-interaction-model §6, Phase 5 polish).

**The single anti-pattern that kills the project: shipping Layer 2 without Layer 3.** A conflict-free buffer where M agents and N humans silently auto-merge contradictory intent is *Zed's exact stopping point*. The battle plan's verdict (§6): "a buffer without claims/salvage is a Potemkin editor, not the product. Refuse it." The governance is the product. The buffer is just the substrate it governs.

---

## 8. Quality gates for the whole-system view

- [ ] Editor is a new `SurfaceKind::Editor { path, region }` variant impl'ing the existing `Pane`/`Surface` trait (pane.rs:79) — **not** a new window manager. The mux tree (mux.rs) is reused untouched.
- [ ] Every actor — human OR agent — is a Loro replica with a PeerID **minted from its PD identity**; no "different kind of participant."
- [ ] An actor's current claim rides Loro `Awareness` as a labeled range — the explicit bridge object between Layer 2 and Layer 3.
- [ ] Overlap is surfaced via `POST /conflicts/predict` on claim-acquire/region-enter (debounced — **not** per-keystroke; symbol parse per char is too slow) and painted `Tone::Conflicted`, never silently auto-merged.
- [ ] The commit guard's refusal names ONLY the correct action (request handoff), **never** a bypass flag.
- [ ] Salvage replay is property-tested for deterministic convergence, not demoed on a happy path.
- [ ] Out-of-claim ops are rejected at daemon ingress in ENFORCE mode (Ed25519 card cap check) — structural, not advisory.
- [ ] All agent-facing coordination is exposed as agent-neutral MCP tools, **never** Claude-specific.
- [ ] Loro→gpui rendering is viewport-diffed, obeying `rust-gpui-motion`'s frame-budget law; idle is 0 re-renders.
- [ ] The edit-sync channel is isolated from the coordination control plane (daemon stays lean; editor load never regresses claim latency).
- [ ] Heavy GPU viz (`gpui-shaders`/Vello) stays workspace-excluded with its own Cargo.lock; never on the Linux CI gate.
- [ ] Transport is abstracted behind `SyncTransport` from day one but Shared-harbor reuse ships first; iroh/relay gated behind the topology phase.

---

**Files that matter (all absolute):**
- `/Users/erichowens/coding/port-daddy/docs/strategy/harbor-editor-battle-plan.md` — the spine; quote it.
- `/Users/erichowens/coding/port-daddy/docs/design/harbor-interaction-model.md` — the Quay/board/steer/HOP model.
- `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/mux.rs` — `SurfaceKind` enum (mux.rs:33, no `Editor` yet), `Workspace` ops (split:179, swap_surface:257, bind_entity:266, resize:280).
- `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/pane.rs` — the `Pane`/`Surface` contract (:79), `Tone` enum (:16), `Block` primitives (:42), `SurfaceAction`/`Subscription` (:55/:67).
- `/Users/erichowens/coding/tmp/pd-console-mux/core/pd-console/src/agent.rs` — the 8-backend tube mux (:1), `StreamEnvelope` (:119).
- `/Users/erichowens/coding/port-daddy/routes/symbols.ts` — `POST /conflicts/predict` (the wedge).
- `/Users/erichowens/coding/port-daddy/routes/recovery.ts` — salvage (the headline).
- `/Users/erichowens/coding/port-daddy/routes/harbors.ts` + `/Users/erichowens/coding/port-daddy/core/harbor-card-rs/src/lib.rs` — Ed25519 capability enforcement.
- New: `/Users/erichowens/coding/port-daddy/core/pd-console/src/editor.rs` — the editor surface (P0).
