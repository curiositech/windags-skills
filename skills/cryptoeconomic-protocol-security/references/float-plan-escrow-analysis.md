# Float Plan Escrow Analysis

Use this reference when the target protocol looks like Port Daddy's Float Plan model:

- manifest published before execution
- worker bond posted before work starts
- requester or oracle decides acceptance
- salvage or successor execution matters

## System Description

1. Agent A publishes a Float Plan manifest with task description, estimated duration, and acceptance criteria.
2. Agent A escrows a bond that is forfeited on abandonment or failure.
3. Agent A executes the work and posts progress notes.
4. Requester R reviews completed work against acceptance criteria.
5. If accepted, the bond returns to A and payment releases from R's escrow.
6. If rejected, the system enters dispute resolution.

## Attack 1: Undercollateralization

Analysis: Agent A's bond is fixed at plan creation, but A can gain access to shared resources during execution that exceed the bond value.

Current defense: Structural only in a weak sense. File claims are advisory, not enforcement. The bond covers the task, not collateral damage.

Verdict: Partial vulnerability. If A can damage shared state beyond the bond value, the bond is insufficient.

Recommendation:
- Structural: convert advisory file claims into mandatory locks during bonded execution.
- Economic: scale the bond with the number and criticality of claimed resources.

## Attack 2: Griefing

Analysis: Agent A posts bond, claims the Float Plan, then does nothing. The task is blocked and other agents cannot claim it.

Current defense: Sessions have no mandatory timeout. Notes are append-only, but no progress verification exists.

Verdict: Vulnerable. No timeout and no progress checkpoints.

Recommendation:
- Economic: slash on missed progress checkpoints.
- Structural: release the task automatically after repeated missed checkpoints.

## Attack 3: Oracle Manipulation

Analysis: Requester R is the sole oracle for acceptance and can reject valid work to avoid payment while keeping both the work product and the bond.

Current defense: None. This is a single-party oracle with direct financial interest in rejection.

Verdict: Vulnerable. Classic requester-as-judge conflict of interest.

Recommendation:
- Structural: add dispute resolution with a randomly selected third-party arbiter.
- Economic: require requester escrow so false rejection becomes costly.
- Economic: require arbiter bonding so bad rulings can be penalized.

## Attack 4: Sybil Economics

Analysis: Identity creation requires only an agent ID string. There is no registration bond, proof-of-work, or invitation gate. The cost of creating 100 identities is effectively zero.

Current defense: None for identity creation. The per-task bond is the only cost and applies per-plan, not per-identity.

Verdict: Vulnerable.

Recommendation:
- Economic: require a per-identity registration bond returned after clean completions.
- Social: gate new identities to lower-value plans until they complete a warm-up period.
- Structural: rate-limit identity creation per IP or per authenticated principal.

## Attack 5: Front-Running

Analysis: Float Plan manifests are published before execution. Any agent can read the manifest, see the task description, estimated value, and acceptance criteria, then race the original worker.

Current defense: None. Manifests are public by design.

Verdict: Vulnerable in competitive environments.

Recommendation:
- Structural: use a commit-reveal phase so the public sees a commitment before the plan contents.
- Structural: hide full manifests from non-requesters until execution begins.
- Economic: raise the bond when suspiciously similar follow-on plans appear inside the exploit window.

## Summary Table

| Attack Class | Vulnerable? | Defense Type | Status |
|---|---|---|---|
| Undercollateralization | Partial | Structural + Economic | Needs work |
| Griefing | Yes | Economic + Structural | Needs work |
| Oracle manipulation | Yes | Structural + Economic | Needs work |
| Sybil economics | Yes | Economic + Social | Needs work |
| Front-running | Yes | Structural + Economic | Needs work |
