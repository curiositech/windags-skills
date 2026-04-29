---
license: Apache-2.0
name: proverif-tamarin-protocol-modeling
description: Formal protocol verification with ProVerif and Tamarin Prover for multi-agent coordination systems. Use when modeling secrecy properties (escrow opacity, session note confidentiality), replay resistance (token dismissal finality, backup-restore attacks), delegation chain correctness, or append-only log integrity in applied pi calculus. Use when deciding between ProVerif and Tamarin for a given property. Use when extending existing .pv models (e.g., harbor_card_v3_delegation.pv) with new security queries. NOT for general cryptography tutorials, TLS certificate management, key management operations (rotation, storage, HSM integration), or smart contract verification (use Solidity-specific tools).
---

# ProVerif / Tamarin Protocol Modeling

Prove it symbolically or admit you are guessing. The Dolev-Yao attacker controls the network. Your job is to define what that attacker cannot do, then ask the prover to confirm.

## When to Use

- Verifying that session notes remain opaque to agents without the Harbor Card
- Proving that dismissed tokens cannot re-enter the system (replay resistance)
- Modeling delegation chains (v3 Harbor Cards) and checking capability attenuation
- Analyzing whether an append-only log provides non-repudiation under Dolev-Yao
- Deciding whether a property needs ProVerif (unbounded sessions) or Tamarin (stateful protocols)
- Investigating ProVerif non-termination on complex equational theories

**NOT for:** General cryptography tutorials. TLS certificate management. Key management operations (rotation, storage, HSM integration). Smart contract verification.

## Decision Tree: ProVerif or Tamarin?

```
START: What security property are you verifying?
|
+-- Is the property TRACE-BASED (something bad never happens)?
|   |
|   +-- Does the protocol have MUTABLE GLOBAL STATE?
|   |   |
|   |   +-- YES (e.g., revocation lists, monotonic counters, mutable DB)
|   |   |   -> USE TAMARIN
|   |   |   Reason: ProVerif's applied pi calculus has no native mutable state.
|   |   |   You can fake it with private channels, but state-space explosion
|   |   |   causes non-termination on >3 state transitions.
|   |   |
|   |   +-- NO (stateless message-passing, signature checks, encryptions)
|   |       -> USE PROVERIF
|   |       Reason: Faster, automatic, handles unbounded sessions natively.
|   |
|   +-- Does the protocol require EXACT ORDERING of events?
|       |
|       +-- YES (e.g., "revoke MUST happen before re-issue")
|       |   -> USE TAMARIN
|       |   Reason: Tamarin's multiset rewriting preserves causal ordering.
|       |   ProVerif's over-approximation may yield false attacks on ordering.
|       |
|       +-- NO (ordering is implicit in message dependencies)
|           -> USE PROVERIF
|
+-- Is the property EQUIVALENCE-BASED (two processes look the same)?
|   |
|   +-- Is it OBSERVATIONAL EQUIVALENCE (full bisimulation)?
|   |   -> USE PROVERIF (diff-equivalence mode)
|   |   Reason: ProVerif's observational equivalence is automated.
|   |   Tamarin requires manual bisimulation proofs (painful).
|   |
|   +-- Is it DIFF-EQUIVALENCE (specific term indistinguishability)?
|       -> USE PROVERIF
|       Reason: ProVerif's biprocess syntax (choice[a,b]) is purpose-built.
|
+-- Do you need COMPUTATIONAL SOUNDNESS guarantees?
    |
    +-- YES (need to argue about actual crypto, not just symbolic)
    |   -> Use ProVerif FIRST for symbolic proof, THEN apply a
    |      computational soundness result (Abadi-Rogaway, Backes-Pfitzmann-Waidner).
    |   Caveat: Soundness results require IND-CCA2 encryption and
    |   EUF-CMA signatures. If your protocol uses non-standard primitives,
    |   the symbolic proof does NOT imply computational security.
    |
    +-- NO (symbolic security is sufficient for design validation)
        -> ProVerif or Tamarin per the above criteria.
```

## Decision Tree: Modeling Append-Only Logs

Port Daddy's session notes are immutable (append-only, never edited or deleted). Modeling this in applied pi calculus:

```
START: What log property do you need?
|
+-- INTEGRITY (log entries cannot be forged)
|   -> Model as signed entries: fun log_entry(bitstring, bitstring): bitstring.
|      Each entry includes sign(hash(prev_entry, content), daemon_sk).
|      Query: attacker cannot produce valid log_entry without daemon_sk.
|
+-- COMPLETENESS (no entries can be deleted/hidden)
|   -> Model as hash chain: fun chain(bitstring, bitstring): bitstring.
|      Verifier checks that chain is contiguous.
|      WARNING: ProVerif cannot prove "nothing is missing" directly.
|      Model as: if attacker presents partial chain, verifier rejects.
|
+-- CONFIDENTIALITY (entries opaque without key)
|   -> Model as encrypted log: fun senc(bitstring, bitstring): bitstring.
|      Key is derived from Harbor Card.
|      Query: attacker(log_content) should return "not attacker(...)".
|
+-- ORDERING (entry A provably precedes entry B)
    -> USE TAMARIN (ProVerif loses ordering in over-approximation).
       Model with Tamarin's Fr(~n) for fresh nonces in sequence.
```

## Open Problem 1: Escrow Secrecy

**Goal:** Session notes are opaque to any agent that does not hold the relevant Harbor Card. An attacker who observes the network (Dolev-Yao) cannot learn note contents.

**Context:** ADR-0018 identifies the backup/restore attack (Section 2) as HIGH severity. The current v3 delegation model (`harbor_card_v3_delegation.pv`) proves delegation chain correctness but does NOT verify that session note contents remain secret.

**Extension to harbor_card_v3_delegation.pv:**

```proverif
(* --- ADD TO harbor_card_v3_delegation.pv --- *)

(* Symmetric encryption for session note escrow *)
fun senc(bitstring, bitstring): bitstring.
reduc forall m: bitstring, k: bitstring; sdec(senc(m, k), k) = m.

(* Key derivation from Harbor Card token *)
fun derive_note_key(bitstring, bitstring): bitstring.

(* The secret we want to protect *)
free session_note_content: bitstring [private].

(* Secrecy query: attacker cannot learn session_note_content *)
query attacker(session_note_content).

(* Agent writes a session note, encrypted under key derived from its token *)
let AgentWriteNote(agent_token: bitstring, token_sig: bitstring) =
  let base_token(=daemon_id, a: id, =harbor_id, cap: capability) = agent_token in
  if check_sign(agent_token, pk(daemon_sk), token_sig) = true then
    let note_key = derive_note_key(agent_token, token_sig) in
    let encrypted_note = senc(session_note_content, note_key) in
    (* Note goes to append-only log, visible on public channel *)
    out(c, encrypted_note).

(* Agent with valid token reads a session note *)
let AgentReadNote(agent_token: bitstring, token_sig: bitstring) =
  let base_token(=daemon_id, a: id, =harbor_id, cap: capability) = agent_token in
  if check_sign(agent_token, pk(daemon_sk), token_sig) = true then
    in(c, enc_note: bitstring);
    let note_key = derive_note_key(agent_token, token_sig) in
    let content = sdec(enc_note, note_key) in
    0. (* Agent now has content; ProVerif checks it cannot leak *)

(* MAIN: add to existing process composition *)
(* Replace the final process block with: *)
(*
process
  new sk_a: skey;
  let pk_a = pk(sk_a) in
  out(c, pk_a);
  new id_a: id;
  new id_b: id;
  new cap_root: capability;
  (
    (!Daemon(id_a, cap_root)) |
    (!AgentA(id_a, sk_a, id_b, cap_root)) |
    (!Harbor(pk_a)) |
    (!AgentWriteNote(...)) |
    (!AgentReadNote(...))
  )
*)
```

**Expected result:** `RESULT not attacker(session_note_content[]) is true.`

**What this proves:** Under the Dolev-Yao model, an attacker who controls the network but does not possess a valid Harbor Card token (and its signature from the daemon) cannot derive the note encryption key and thus cannot read session notes.

**What this does NOT prove:** Resistance to backup/restore replay (see Open Problem 2). The Dolev-Yao model assumes monotonic state -- it has no concept of database rollback.

## Open Problem 2: Replay Resistance After Dismissal

**Goal:** Once a token is dismissed (revoked via `pd salvage dismiss` or session end), a captured copy of that token cannot be used to re-authenticate, even if the database is restored from backup.

**Why ProVerif alone is insufficient:** ProVerif models an unbounded number of sessions but assumes events are monotonic. The `Issued` event, once emitted, is permanent in the trace. There is no way to express "this event was un-emitted" (database rollback).

**Approach: Tamarin with mutable state**

```
/* Tamarin model sketch for replay resistance */
rule Issue_Token:
  [ Fr(~tok), !Pk(daemon, pk_d) ]
  --[ Issued(agent, harbor, ~tok) ]->
  [ Token(agent, harbor, ~tok), ActiveToken(~tok) ]

rule Dismiss_Token:
  [ ActiveToken(tok) ]
  --[ Dismissed(tok) ]->
  [ DismissedToken(tok) ]

rule Verify_Token:
  [ Token(agent, harbor, tok), ActiveToken(tok) ]
  --[ Accepted(agent, harbor, tok) ]->
  [ Token(agent, harbor, tok), ActiveToken(tok) ]

/* Replay after dismissal should be impossible */
lemma no_replay_after_dismiss:
  "All agent harbor tok #i #j #k.
    Dismissed(tok) @ #i & Accepted(agent, harbor, tok) @ #k & #i < #k
    ==> F"

/* The backup attack: restore ActiveToken after dismissal */
rule Backup_Restore_Attack:
  [ DismissedToken(tok) ]
  --[ Restored(tok) ]->
  [ ActiveToken(tok) ]  /* DB rollback re-activates */

/* With Backup_Restore_Attack enabled, no_replay_after_dismiss WILL FAIL.
   This is the formal proof that backup-restore breaks replay resistance.
   Mitigation: epoch counters (see below). */
```

**Mitigation model (epoch counters):**

```
/* Add global epoch that survives backup restore */
rule Increment_Epoch:
  [ Epoch(e) ] --[ EpochBump(e) ]-> [ Epoch(e + 1) ]

rule Issue_Token_Epoched:
  [ Fr(~tok), Epoch(e) ]
  --[ Issued(agent, harbor, ~tok, e) ]->
  [ Token(agent, harbor, ~tok, e), ActiveToken(~tok, e), Epoch(e) ]

rule Verify_Token_Epoched:
  [ Token(agent, harbor, tok, e_tok), ActiveToken(tok, e_tok), Epoch(e_cur) ]
  --[ Accepted(agent, harbor, tok), Eq(e_tok, e_cur) ]->
  [ Token(agent, harbor, tok, e_tok), ActiveToken(tok, e_tok), Epoch(e_cur) ]

/* Now backup-restore resets DB epoch but not the external epoch source.
   Restored tokens have stale epoch -> verification fails. */
```

**ADR-0018 reference:** This directly addresses Attack Vector 2 (Backup/Restore Attack) and the recommendation for "revocation epoch" in tokens (Immediate, v3.8.0).

## When Symbolic Security Implies Computational Security

A symbolic ProVerif proof implies computational security ONLY when:

1. **Encryption is IND-CCA2** (e.g., AES-GCM, ChaCha20-Poly1305). NOT IND-CPA alone.
2. **Signatures are EUF-CMA** (e.g., Ed25519, ECDSA). The Harbor Card uses Ed25519 -- this qualifies.
3. **Hash functions are collision-resistant** in the standard model.
4. **No algebraic interactions** between primitives (e.g., no encrypt-then-sign where the sign key and encrypt key are related).
5. **The protocol uses standard composition** (no custom combining of ciphertexts or signatures in non-standard ways).

The Abadi-Rogaway theorem (2000) and Backes-Pfitzmann-Waidner framework provide the formal bridge. If your protocol satisfies these constraints, a ProVerif `RESULT true` is meaningful for real-world security.

**Port Daddy Harbor Cards:** The v2+ models use Ed25519 signatures (EUF-CMA) and do not use encryption in the token itself. The symbolic authentication proof (`Accepted ==> Issued`) transfers to the computational setting. The escrow secrecy extension (Open Problem 1) adds symmetric encryption -- ensure it uses IND-CCA2 (AES-GCM, not bare AES-CBC) for computational soundness to hold.

## Dolev-Yao Limitations Specific to Port Daddy

The Dolev-Yao threat model assumes:

| Assumption | What it covers | What it misses (ADR-0018 ref) |
|---|---|---|
| Perfect crypto | No brute force, no side channels | Clock manipulation (Attack 3) |
| Monotonic state | Events once emitted are permanent | Backup/restore replay (Attack 2) |
| Logical agents | Agents are identities, not processes | PID reuse / Ghost in Harbor (Attack 4) |
| Network control | Attacker intercepts all messages | Covert channels via timing/logs (Attack 5) |
| No resource limits | Unbounded computation | Token flooding DoS (Attack 1) |

**Consequence:** ProVerif proofs are necessary but NOT sufficient for Port Daddy security. They prove the protocol design is sound; they do not prove the implementation is safe. ADR-0018 is the companion document that addresses the gaps.

## Handling ProVerif Non-Termination

ProVerif may loop forever on certain inputs. Decision tree for diagnosis:

```
ProVerif has been running for > 5 minutes
|
+-- Are you using TABLES (insert/get)?
|   +-- YES -> Tables cause state-space explosion.
|       Fix: Replace tables with private channels for small state.
|       If state is large (>5 values), switch to Tamarin.
|
+-- Are you using PHASES?
|   +-- YES -> Phases with complex equational theories explode.
|       Fix: Minimize phase count. If >2 phases, refactor to
|       use events with ordering queries instead.
|
+-- Does your equational theory have CONVERGENCE issues?
|   +-- Check: Are reducs mutually recursive?
|       Fix: Simplify equational theory. Factor into independent
|       function sets. Remove unused reducs.
|
+-- Is the process REPLICATED (!) with complex internal branching?
|   +-- YES -> ProVerif explores all interleavings.
|       Fix: Add [precise] annotations on events.
|       Or: Bound the replication (!^n) for testing,
|       then remove bound for the real proof.
|
+-- LAST RESORT: Use -html output to see where ProVerif is stuck.
    proverif -html output_dir model.pv
    Examine the derivation tree for cycles.
```

## Failure Modes

### False Attack from Over-Approximation

**Symptom:** ProVerif reports `RESULT event(...) ==> event(...) is false` but the "attack trace" contains impossible message orderings (e.g., an agent receives a response before sending the request).

**Diagnosis:** ProVerif's resolution-based approach over-approximates: it considers message orderings that cannot happen in real executions. Check the attack trace for causal impossibilities.

**Fix:** Add `[precise]` to event declarations. If still false, switch to Tamarin for that specific property (Tamarin's backward search respects causal ordering). The ProVerif proof for other properties remains valid.

### Non-Termination from State Encoding

**Symptom:** ProVerif runs indefinitely (>10 minutes) on a model with insert/get table operations or complex private-channel state passing.

**Diagnosis:** State-space explosion. Each table insert creates a new Horn clause that interacts with all existing clauses. With N state values and M transitions, complexity is O(N^M).

**Fix:** If state has fewer than 4 values, use private channels (`free state_chan: channel [private]`) with explicit read-write patterns. If state is larger, the model belongs in Tamarin where multiset rewriting handles state natively. Do not add `set preciseActions = true` as a band-aid -- it slows ProVerif further without fixing the root cause.

### Silent Scope Leak in Biprocess

**Symptom:** Observational equivalence query returns `false` but secrecy query on the same term returns `true`. Contradictory results.

**Diagnosis:** The biprocess (`choice[a,b]`) has a scope leak: one branch reveals information through a side channel (e.g., different message lengths, different error paths) that the secrecy query does not capture.

**Fix:** Ensure both branches of `choice` produce outputs of identical structure. Pad messages to equal length. Normalize error paths to produce the same observable behavior in both branches.

### Misplaced Event Causes Vacuous Truth

**Symptom:** ProVerif reports `RESULT event(Accepted(...)) ==> event(Issued(...)) is true` but you know the protocol is broken.

**Diagnosis:** The `Accepted` event is unreachable. If the event is never emitted in any trace, the implication is vacuously true. ProVerif does not warn about this.

**Fix:** Always pair authentication queries with reachability queries:
```proverif
(* Authentication *)
query a: id, h: id, cap: capability;
  event(Accepted(a, h, cap)) ==> event(Issued(a, h, cap)).

(* Reachability -- MUST also verify this *)
query a: id, h: id, cap: capability;
  event(Accepted(a, h, cap)).
(* Expected: RESULT event(Accepted(...)) is true (reachable) *)
```

If the reachability query returns `false`, your authentication proof is meaningless.

## Quality Gates

A protocol model is ready for review when:

- [ ] ProVerif returns `RESULT true` for ALL secrecy and authentication queries
- [ ] ALL authentication queries have a companion reachability query that returns `true`
- [ ] The model has been tested with `[precise]` annotations and results match
- [ ] Non-termination has been ruled out (ProVerif completes in <60 seconds for the model)
- [ ] If Tamarin is used for stateful properties, all lemmas verify with `--prove`
- [ ] The Dolev-Yao limitations table has been reviewed against ADR-0018 attack vectors
- [ ] Each gap between symbolic model and real system is documented with a mitigation
- [ ] The model file header documents which .pv version it extends and what queries were added
- [ ] Computational soundness requirements are stated (IND-CCA2, EUF-CMA) for any claim that symbolic security implies real security

## Anti-Patterns

### The Kitchen Sink Model

**Novice:** Puts every protocol feature into a single .pv file: key distribution, delegation, session management, note encryption, log integrity, and revocation. Runs ProVerif. Waits forever.

**Expert:** Factor the model into independent properties verified in separate files. `harbor_card_v1.pv` proves basic auth. `harbor_card_v2_asymmetric.pv` proves per-harbor keying. `harbor_card_v3_delegation.pv` proves delegation. A new `harbor_card_v4_escrow.pv` proves note secrecy. Composition theorems (Canetti's UC framework or manual argument) connect the pieces.

**Signal:** If your .pv file is >150 lines, you are probably modeling too much at once.

### Encoding State in ProVerif When You Need Tamarin

**Novice:** Uses `insert`/`get` tables or chains of private channels to model a revocation list in ProVerif. Model runs for 20 minutes, then reports a false attack.

**Expert:** Mutable global state (revocation lists, epoch counters, monotonic logs) is Tamarin's native domain. ProVerif's applied pi calculus is for stateless message-passing protocols. Use ProVerif for the message-level properties (secrecy, authentication), then use Tamarin for the state-transition properties (replay resistance, revocation finality).

### Trusting Vacuous Proofs

**Novice:** Gets `RESULT true` for authentication, celebrates, ships.

**Expert:** Checks reachability first. A query over an unreachable event is vacuously true and proves nothing. The most dangerous proof is one that is technically correct but semantically empty. Always verify that your security events are actually emitted in at least one honest execution.

### Ignoring the Computational Gap

**Novice:** "ProVerif says it's secure, so it's secure."

**Expert:** ProVerif proves security in the symbolic (Dolev-Yao) model. This transfers to computational security ONLY under specific conditions (IND-CCA2 encryption, EUF-CMA signatures, no algebraic interactions). If your implementation uses AES-CBC without authentication, or HMAC where the model assumes digital signatures, the symbolic proof is irrelevant to real-world security. State your cryptographic assumptions explicitly.
