# Registry Patterns and Authorization: Ownership, Access Control, and the Trust Architecture of Agent Systems

## The Core Authorization Problem

When many agents share an infrastructure, two classes of conflict arise. The first is *accidental*: AgentA tries to modify AgentB's registration not maliciously, but because it made a logic error. The second is *intentional*: a malicious or malfunctioning agent tries to impersonate, disrupt, or hijack another agent's identity or capabilities.

FIPA's Agent Management Specification addresses both through a principled authorization model woven throughout the registry architecture. This model isn't a separate security layer bolted on — it is intrinsic to how the AMS, DF, and AID are designed.

## Ownership as a First-Class Concept

The `ams-agent-description` object includes an `:ownership` field (Section 6.1.5). Every agent registered with the AMS has an owner — "for example, based on organisational affiliation or human user ownership" (Section 2). This ownership field is the anchor for authorization decisions: operations on an agent's registration are permitted to the owner and to the AMS; they are refused to others.

The `service-description` object similarly includes an `:ownership` field (Section 6.1.3). Individual services can have different owners than the agent that offers them — enabling scenarios where an agent offers a portfolio of services on behalf of different principals, each service owned by a different organizational entity.

This ownership model has significant implications:
- An agent cannot be deleted by another agent of equal standing — only the AMS or the owner can initiate deletion
- An agent cannot have its registration modified by an unrelated third party — the DF will `refuse` with `unauthorised`
- The AMS maintains the authoritative ownership record, which the DF respects when processing modification requests

The Annex A dialogue (Example 6) demonstrates this in action: when `dummy` tries to modify `scheduler-agent`'s DF description, the DF responds with `(refuse ... (unauthorised))`. `dummy` has no ownership claim over `scheduler-agent`, so the modification is refused regardless of whether the modification itself would be valid.

## The AID Name as an Authorization Anchor

Beyond ownership, the AID name itself serves as an authorization mechanism. Section 4.2.1 specifies:

> "The AMS will check the validity of the passed agent description and, in particular, the local uniqueness of the agent name in the AID."

When an agent registers, the AMS verifies that no other agent already holds that name within the platform. This prevents name-squatting attacks where a malicious agent claims the identity of a well-known service agent.

Furthermore, Section 3 specifies that the `:name` parameter of an AID "can only be changed by the agent to whom the AID belongs." Other parameters are mutable by authorized parties, but the name is the agent's exclusive property. This makes the name a cryptographic-like anchor: once assigned, only the owner can change it (and the AMS validates that this is true).

## AMS as the Single Authority for Lifecycle

The authorization model creates a clear chain of authority for lifecycle management:

1. **The AMS is the sole authority for forceful termination** (Destroy transition). No other agent can kill another agent. This prevents denial-of-service attacks where one agent kills others.

2. **The AMS is the sole authority for platform access**. Only agents registered with the AMS can use the MTS. An agent that loses its AMS registration loses its ability to communicate entirely.

3. **The AMS controls registration validity**. When an agent attempts to register with the AMS, the AMS verifies the agent's description. Only if the AMS accepts the registration does the agent gain a valid AID and access to the platform.

4. **The AMS can forcibly terminate agents that ignore graceful quit requests**. Section 4.2.1: "An AMS can request that an agent performs a specific management function, such as quit (that is, terminate all execution on its AP) and has the authority to forcibly enforce the function if such a request is ignored."

This creates a tiered authority structure:
- AMS has absolute authority over the platform
- Agents have authority over their own registrations
- Third parties have read authority (search) but not write authority (modify/delete)

## The DF Authorization Model

The DF has a somewhat weaker authorization model than the AMS:

> "The DF may restrict access to information in its directory and will verify all access permissions for agents which attempt to inform it of agent state changes." (Section 4.1.1)

The DF *may* restrict access, but this is optional. By default, search queries are answered for all authorized agents without discrimination. The DF is "benign in the sense that it must provide the most current information about agents in its directory on a non-discriminatory basis to all authorised agents." (Section 4.1.1)

This non-discriminatory read access is important for system dynamics: any agent can discover any other agent's advertised capabilities. This enables emergent collaboration (AgentA discovers AgentB exists and can do X, forms a collaboration), but it also means capability advertisement is essentially public within the platform. Sensitive capabilities that should not be discoverable by all agents should either not be registered in the DF or should be registered in a restricted-access DF.

The critical authorization gate on the DF is *modification*: only the agent that registered a description (or an authorized party, like the AMS) can modify or delete it. Registration is self-service; modification and deletion are ownership-protected.

## Dynamic Registration and Trust

Section 5.2 introduces the concept of dynamic registration:

> "The agent explicitly registered with the AP, assuming that the AP both supports dynamic registration and is willing to register the new agent. Dynamic registration is where an agent which has a HAP wishes to register on another AP as a local agent."

Dynamic registration is explicitly conditional: "assuming that the AP both supports dynamic registration and is **willing** to register the new agent." The AMS has discretion to accept or reject dynamic registrations. This discretion is where trust decisions are made: should we allow this external agent, from this other platform, to participate in our platform?

The AP description (Section 6.1.6) includes a `:dynamic` flag indicating whether the platform supports dynamic registration at all. This is a platform-level policy decision, not an agent-level decision. Some platforms may be closed (`:dynamic false`) and only allow pre-configured agents.

## Application to WinDAGs Trust Architecture

### Skill Registration Authorization

In WinDAGs, the Orchestration Registry (AMS analog) should enforce:

1. **Unique skill identifiers**: No two skills can claim the same identifier. The registry validates this on registration.

2. **Ownership tracking**: Every skill is owned by a team, service account, or organizational unit. Only the owner (and the registry itself) can modify or delete a skill's registration.

3. **Forced deregistration authority**: The orchestration system must retain the ability to force-deregister any skill, regardless of the skill's cooperation. This is the Destroy equivalent — essential for removing compromised, malfunctioning, or deprecated skills.

4. **Dynamic registration policy**: The registry should have a configurable policy on whether external skills (from other WinDAGs deployments or third-party providers) can dynamically register. Production deployments may want `:dynamic false` (only pre-approved skills) while development environments want `:dynamic true` (rapid iteration).

### Preventing Capability Spoofing

One of the authorization concerns FIPA's model addresses is *capability spoofing*: an agent claiming to offer a capability it doesn't have (or more dangerously, claiming to be a well-known agent it isn't). In WinDAGs, this could manifest as a malicious skill registering as `code-review` and receiving sensitive code that it then exfiltrates.

Mitigations from the FIPA model:
- The Orchestration Registry validates skill identifiers for uniqueness at registration time
- Skill identity is anchored to the registering account (ownership) — you can't register as a skill you don't own
- The AMS's mandatory registration means every skill must be known to the registry before it can receive messages

Additional mitigations beyond FIPA:
- Cryptographic signing of skill registrations (the registry issues a capability certificate)
- Regular re-attestation (skills must periodically prove they still are what they claimed to be)
- Behavioral monitoring (skills whose behavior deviates significantly from their registered description get flagged)

### The Non-Discriminatory Search Principle and Its Implications

FIPA's principle that DF search results are non-discriminatory (all authorized agents get the same results) has an important implication for WinDAGs: skill discovery is effectively public within the system. Any orchestrator can discover any skill.

This is usually desirable — it's what enables dynamic capability composition. But for sensitive skills (e.g., skills with access to production databases, skills performing financial operations), you may want restricted visibility: only certain orchestrators should even know these skills exist.

The FIPA model addresses this by allowing multiple DFs with different access policies. WinDAGs could implement this as tiered skill directories:
- **Public directory**: All skills visible to all orchestrators
- **Restricted directory**: Sensitive skills visible only to orchestrators with appropriate clearance
- **Private directory**: Skills visible only to the owning team

The federated search mechanism allows an orchestrator to query both public and restricted directories in sequence, with the restricted directory performing authorization before returning results.

### Exception-Based Authorization Feedback

From Section 6.3.4, when an unauthorized operation is attempted, the response is:
```
(refuse ... (unauthorised))
```

This is clean and non-leaking: the `unauthorised` predicate doesn't tell the requester *why* they're unauthorized or what they would need to be authorized. It simply refuses. This prevents information leakage through authorization errors.

WinDAGs should follow the same principle: when an orchestrator attempts an operation on a skill it doesn't have permission to operate on, the response should be a clean `Refused: Unauthorized` — not "you need to be in group X" or "this skill is owned by team Y" (which would leak organizational structure).

## The Idempotency Problem: `already-registered`

Section 6.3.5 includes `already-registered` as a `failure` predicate (not a `refuse`). This is worth examining: why is duplicate registration a *failure* rather than a *refuse*?

Because the registration process involves the AMS saying `agree` (I'll try to register you) and then potentially discovering that the name is already taken. The AMS agreed to try, tried, and found a conflict. This is a runtime failure, not a message-level rejection. The distinction matters: the AMS already sent `agree`, meaning it thought the registration was valid at the point of agreement. The conflict was discovered during execution.

For WinDAGs, the `already-registered` pattern is extremely useful for idempotent skill registration: if a skill attempts to re-register on restart, the registry returns `failure: already-registered`. The skill can then either:
1. Treat this as success and proceed (the registration from last time is still valid)
2. Query its current registration state and update if needed (compare with the `modify` function)
3. Deregister and re-register fresh

The important thing is that the skill can distinguish "I'm already registered" from "my registration failed for some other reason." That distinction drives different recovery behaviors.

## Caveats

**Authorization without cryptography is weak**: FIPA's authorization model relies on the AMS trusting agents' claimed identities. In an open network where agents can be arbitrary software from untrusted sources, this is insufficient without cryptographic identity verification. FIPA explicitly notes that security details are outside its scope and recommends consulting companion security specifications.

**The single AMS is a trust concentration point**: Everything goes through one AMS per platform. If the AMS is compromised or makes incorrect authorization decisions, the entire platform is vulnerable. This is a known trade-off in centralized authority models.

**Ownership without accountability**: The `:ownership` field stores an owner identity, but FIPA doesn't specify how ownership is verified. Any agent can claim any ownership string. Real authorization systems need verifiable ownership claims (cryptographic keys, tokens, certificates).

## Summary

FIPA's authorization model weaves ownership into the registry objects themselves, gives the AMS absolute authority over lifecycle and platform access, and makes modification/deletion ownership-protected while keeping discovery broadly accessible. For WinDAGs: track ownership of every skill, require AMS-equivalent (Orchestration Registry) validation on all registrations, implement tiered directories for sensitive skills, use the exception taxonomy to provide clean authorization feedback without information leakage, and retain forceful-termination authority at the orchestration layer regardless of skill cooperation.