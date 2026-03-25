# History-Sensitivity, Shared State, and the Limits of Functional Computation

## The Problem Pure Functions Cannot Solve

The most commercially popular AI agent frameworks lean heavily on functional patterns: stateless tools, pure transformations, reproducible outputs. This is appealing for its simplicity. Agha's analysis reveals precisely when this approach fails and what to do instead.

The core issue is **history-sensitivity**:

> "Functions are history insensitive. This can be a problem when modeling the behavior of systems that can change their behavior over time." (p. 11, citing Backus 78)

A pure function, given the same inputs, always produces the same output. This is excellent for computability analysis, parallelization, and testing. But many real-world computational entities are not pure functions — their behavior depends on their history.

Agha's turnstile example: a turnstile with a counter is not a function of "turn" → number. It is a function of ("turn", previous count) → (new count). The counter's **state** must be maintained between calls.

## The Bank Account: The Canonical History-Sensitive Object

The bank account example runs through the entire thesis as the canonical history-sensitive shared object:

- A bank account's response to "withdraw $100" depends on its current balance
- Its current balance depends on every deposit and withdrawal in its history
- Multiple concurrent users may attempt to access the account simultaneously
- The account must remain consistent across all concurrent accesses

This is completely inexpressible as a pure function. In functional languages with cyclic feedback structures (Henderson's workaround), you can simulate history sensitivity, but the simulation has a critical flaw:
> "A bank account written as a function which returns a partly delayed expression will have returned an argument purely local to the caller. This means that such a bank account cannot be shared between different users (or even between the bank manager and the account owner!)." (p. 93-94)

Functional approaches give each user their own private copy of the account. There is no shared object that everyone updates and queries. This is not a bank account — it is the simulation of a bank account for one user.

## The Actor Solution: Encapsulated Mutable State

Actors solve this by combining two features:
1. **Total information hiding**: No direct access to state variables; all interaction through messages
2. **Replacement behavior**: The actor's "state" is encoded in its behavior parameters, updated with each message