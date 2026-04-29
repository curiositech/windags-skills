---
license: Apache-2.0
name: political-philosophy-of-computation
description: |
  Applies political philosophy frameworks (Hobbes, Locke, Rousseau, Rawls, Sen, Ostrom) to software architecture decisions -- authority models, resource allocation, capability assignment, and commons governance. NOT FOR general philosophy courses, ethics of AI alignment, trolley problems, or moral philosophy of consciousness.
metadata:
  category: Architecture & Design
  tags:
  - political-philosophy
  - software-architecture
  - resource-allocation
  - governance-models
  - capability-assignment
---

# SKILL.md -- Political Philosophy of Computation

license: Apache-2.0
```yaml
metadata:
  name: political-philosophy-of-computation
  version: 1.0
  description: >
    Decision frameworks for analyzing software systems through the lens of political
    philosophy. Maps Hobbes (centralized sovereign), Locke (limited authority with
    natural rights), Rousseau (general will / consensus), Rawls (veil of ignorance
    for capability assignment), Sen (impossibility of Paretian liberal), and Ostrom
    (polycentric commons governance) onto real architecture decisions. NOT FOR general
    philosophy courses, ethics of AI alignment, trolley problems, or moral philosophy
    of consciousness. This skill is strictly about systems design.
  activation_triggers:
    - deciding between centralized vs. distributed authority in a system
    - designing capability/permission assignment for agents or services
    - evaluating whether advisory vs. enforced resource claims are correct
    - reasoning about commons governance for shared resources (ports, files, locks)
    - questioning whether a coordinator violates agents' autonomy or efficiency
    - analyzing deadlock between individual preference and collective allocation
    - designing systems where participants have private information about their needs
    - choosing between enforcement, convention, and consent for coordination
```

---

## When to Use This Skill

| Situation | Why Political Philosophy Applies |
|-----------|----------------------------------|
| Designing a centralized coordinator for agents | Hobbes: you are building a Leviathan -- understand the tradeoffs |
| Agents need rights the system cannot override | Locke: natural rights precede the system; some capabilities are inalienable |
| Consensus protocol for shared decisions | Rousseau: general will vs. will of all -- aggregation is not consensus |
| Assigning capabilities without knowing who uses them | Rawls: veil of ignorance produces fair allocation under uncertainty |
| Enforced allocation conflicts with private preferences | Sen: the Paretian Liberal impossibility -- you cannot have both |
| Managing shared resources without central authority | Ostrom: polycentric governance with graduated sanctions |
| Advisory claims vs. enforced locks | This is the Locke-Hobbes spectrum in one design decision |
| Agents defect from conventions | Hobbes explains why; Ostrom explains what to do about it |

---

## The Six Thinkers, Operationalized

### 1. Hobbes -- The Leviathan (Centralized Sovereign)

**Core claim**: Without a central authority with absolute enforcement power, agents exist in a "war of all against all." Rational self-interest leads to defection.

**In systems terms**: A single coordinator process that allocates all resources, resolves all conflicts, and enforces all contracts. Agents surrender autonomy in exchange for order.

**When Hobbesian design is correct**:
- Resource conflicts are frequent and expensive (database write locks)
- Agents cannot be trusted (untrusted multi-tenant systems)
- Correctness requires global serialization (distributed transactions)

**When Hobbesian design fails**:
- The sovereign becomes a bottleneck (single point of failure)
- Agents have legitimate private information the sovereign cannot access
- The system must scale beyond what one coordinator can manage

### 2. Locke -- Limited Authority with Natural Rights

**Core claim**: Authority is legitimate only by consent, and some rights (life, liberty, property) precede the social contract. Government exists to protect these rights, not to override them.

**In systems terms**: A coordinator exists but its power is bounded. Agents retain capabilities the system cannot revoke. The system's legitimacy derives from the agents' consent to participate.

**When Lockean design is correct**:
- Agents have capabilities that should survive system restarts
- Some operations must be allowed even when the coordinator is down
- The system serves agents (not the reverse)

**Lockean pattern in practice**: Advisory file claims. The system tracks who intends to edit what, but does not prevent an agent from editing a file another agent claimed. The claim is a property right declared by the agent; the system's role is to make these declarations visible, not to enforce exclusion.

### 3. Rousseau -- The General Will

**Core claim**: Legitimate authority comes from the general will (volonte generale) -- not the sum of individual preferences (volonte de tous), but the collectively rational outcome that each would choose if they could see the whole picture.

**In systems terms**: Consensus protocols, leader election, quorum-based decisions. The system's behavior reflects what all agents would agree to if they had full information, even if no individual agent has it.

**When Rousseauian design is correct**:
- Decisions affect all agents equally (schema migrations, protocol upgrades)
- No single agent should have veto power
- The system must evolve its own rules (self-governance)

**Warning**: Rousseau's general will is notoriously hard to implement. Most "consensus" systems actually implement majority rule (volonte de tous), which Rousseau explicitly distinguishes from the general will. If your consensus protocol can produce outcomes that harm a minority, it is not implementing the general will.

### 4. Rawls -- Veil of Ignorance for Capability Assignment

**Core claim**: Just principles are those chosen behind a "veil of ignorance" -- where you do not know which position in the system you will occupy. This produces the maximin rule: design for the worst-off position, because you might be in it.

**In systems terms**: When assigning capabilities, ports, resources, or priorities, design the allocation as if you do not know which agent you will be. This prevents designs that privilege one agent class at another's expense.

**The maximin rule for systems**: The worst-case agent experience should be as good as possible. Do not optimize average throughput if it means some agents starve.

**Rawlsian questions**:
- "If I were the agent that gets the worst port assignment, would I accept this system?"
- "If I were the agent that loses a lock race, is the fallback acceptable?"
- "Does the system treat all agents as interchangeable behind the veil, or does it encode class distinctions?"

### 5. Sen -- The Impossibility of a Paretian Liberal

**Core claim**: It is impossible to simultaneously satisfy (a) Pareto efficiency (if everyone prefers X to Y, choose X) and (b) individual liberalism (each person is decisive over at least one personal choice). When private preferences conflict with social allocation, one must yield.

**In systems terms**: You cannot build a system that both (a) respects every agent's private preferences about its own domain and (b) guarantees globally Pareto-optimal allocation. Enforced allocation overrides private information; voluntary allocation may be globally suboptimal.

**This is the deepest result for distributed systems**. It is why advisory claims (Lockean) and enforced locks (Hobbesian) are genuinely different architectures, not just different "strictness levels."

**Sen's impossibility in practice**:
- Agent A prefers port 3000 (because its config expects it)
- Agent B prefers port 3000 (because its tests hardcode it)
- The "Pareto" move is to give it to whoever values it more -- but neither agent can credibly reveal its true valuation
- Enforcing an assignment (Hobbesian) overrides private information
- Advisory claims (Lockean) may lead to conflict
- There is no mechanism that satisfies both Pareto and liberalism

### 6. Ostrom -- Polycentric Commons Governance

**Core claim**: Commons need not be governed by either private property (Locke) or central authority (Hobbes). Successful commons governance uses: clearly defined boundaries, proportional costs/benefits, collective-choice arrangements, monitoring, graduated sanctions, conflict resolution mechanisms, and nested enterprises.

**In systems terms**: Shared resources (ports, files, channels, locks) can be governed by layered, overlapping, self-organizing institutions rather than a single authority. Agents participate in governance, sanctions escalate gradually, and the system is polycentric (multiple overlapping authorities).

**Ostrom's 8 design principles for computational commons**:

| Principle | System Analog |
|-----------|---------------|
| Clearly defined boundaries | Who can claim? What is claimable? |
| Proportional costs/benefits | Agents that use more resources contribute more metadata |
| Collective-choice arrangements | Agents affected by rules participate in changing them |
| Monitoring | Activity logs, heartbeats, health checks |
| Graduated sanctions | Warning, then timeout, then eviction |
| Conflict resolution | Salvage queue, advisory claims, explicit negotiation |
| Minimal recognition of rights | The system does not override agents' self-organization |
| Nested enterprises | Project-level governance nested in system-level governance |

---

## Decision Tree 1: Is This System Hobbesian, Lockean, or Ostromian?

```
START: Does a single process have exclusive authority over resource allocation?
  |
  +-- YES --> Does it enforce allocation (agents cannot override)?
  |     |
  |     +-- YES --> HOBBESIAN (Leviathan)
  |     |     Risks: single point of failure, bottleneck, ignores private info
  |     |     Mitigate: health checks, failover, graceful degradation
  |     |
  |     +-- NO --> Does it track declarations but allow override?
  |           |
  |           +-- YES --> LOCKEAN (limited authority + natural rights)
  |           |     Risks: conflict when agents override, no enforcement
  |           |     Mitigate: conflict detection, notification, convention
  |           |
  |           +-- NO --> It is a REGISTRY, not an authority
  |                 Consider: do you need authority at all?
  |
  +-- NO --> Are there multiple overlapping authorities?
        |
        +-- YES --> Do they have graduated sanctions and monitoring?
        |     |
        |     +-- YES --> OSTROMIAN (polycentric commons)
        |     |     This is the most resilient model for shared resources
        |     |
        |     +-- NO --> ANARCHY (uncoordinated)
        |           This will degrade. Add Ostrom's monitoring + sanctions.
        |
        +-- NO --> Is there NO coordination at all?
              |
              +-- YES --> HOBBESIAN STATE OF NATURE
              |     "War of all against all" -- port conflicts, file clobbering
              |     You need governance. Choose your model.
              |
              +-- NO --> Identify the implicit coordination mechanism
                    It exists but is invisible. Make it explicit.
```

---

## Decision Tree 2: Does This Design Violate Sen's Impossibility?

```
START: Does the system allocate a shared resource?
  |
  +-- NO --> Sen's impossibility does not apply. Stop here.
  |
  +-- YES --> Do agents have private preferences about allocation?
        |
        +-- NO --> Pareto + enforcement is fine. Allocate optimally.
        |
        +-- YES --> Can agents credibly reveal their true preferences?
              |
              +-- YES --> Use mechanism design (auctions, VCG).
              |     Sen's impossibility is avoided by preference revelation.
              |
              +-- NO --> YOU ARE IN SEN'S IMPOSSIBILITY ZONE.
                    |
                    Choose one:
                    |
                    +-- Sacrifice Pareto (accept suboptimal allocation)
                    |     --> LOCKEAN advisory claims
                    |     Agents keep autonomy; system accepts inefficiency
                    |
                    +-- Sacrifice Liberalism (override private preferences)
                    |     --> HOBBESIAN enforced allocation
                    |     System optimizes globally; agents lose autonomy
                    |
                    +-- Accept the impossibility and design for it
                          --> OSTROMIAN graduated governance
                          Advisory by default, escalate to enforcement on conflict
                          This is the pragmatic middle path.
```

---

## Decision Tree 3: What Does Rawls' Veil Mean for Capability Assignment?

```
START: You are assigning capabilities (ports, permissions, priorities) to agents.
  |
  +-- Do you know which agent is which at assignment time?
        |
        +-- YES --> You are NOT behind the veil.
        |     Risk: you will design for your preferred agent class.
        |     |
        |     Ask: "Would I accept this assignment if I were the worst-off agent?"
        |     |
        |     +-- YES --> Proceed, but document the class distinction.
        |     +-- NO --> Redesign. The maximin principle is violated.
        |
        +-- NO --> You ARE behind the veil. Good.
              |
              Apply maximin: design the system so the worst-case
              agent experience is as good as possible.
              |
              +-- Are all agents treated identically?
                    |
                    +-- YES --> RAWLSIAN JUSTICE (fair allocation)
                    |     Every agent gets the same base capabilities.
                    |     Differentiation is by need, not by class.
                    |
                    +-- NO --> Is the differentiation based on role, not identity?
                          |
                          +-- YES --> RAWLSIAN with difference principle
                          |     Unequal allocation is just IF it benefits the worst-off.
                          |     Example: giving a database agent more ports is just
                          |     if it enables the system to serve all agents better.
                          |
                          +-- NO --> UNJUST ALLOCATION
                                Redesign. No agent should be systematically disadvantaged
                                by identity rather than role.
```

---

## Worked Example: Port Daddy's Advisory Claims Through Sen's Impossibility

Port Daddy uses **advisory file claims**: an agent declares "I intend to edit `src/foo.ts`," and the system records this. But another agent CAN edit the same file -- the claim is not enforced. This is a deliberate design choice. Sen's impossibility explains why.

### Setup

- **Agent A** (registered as `myapp:api:auth`) claims `src/auth.ts`
- **Agent B** (registered as `myapp:api:middleware`) needs to edit `src/auth.ts` to add a middleware hook

### Applying Sen's Impossibility

1. **Is there a shared resource?** Yes -- `src/auth.ts`
2. **Do agents have private preferences?** Yes -- Agent A knows its planned changes; Agent B knows its planned changes. Neither can fully communicate the scope of its intent.
3. **Can agents credibly reveal preferences?** No. An agent cannot predict all the lines it will modify. File claims are coarse-grained declarations of intent, not fine-grained edit plans.
4. **We are in Sen's impossibility zone.**

### The Three Choices

**Choice 1: Sacrifice Pareto (accept suboptimal allocation)** -- This is what Port Daddy does. Advisory claims mean both agents can proceed. They may produce merge conflicts (suboptimal), but neither agent's autonomy is overridden. The system accepts that conflicts will happen and provides tooling to detect them (file claim overlap warnings, pub/sub notifications).

**Choice 2: Sacrifice Liberalism (enforce exclusive locks)** -- A Hobbesian design would reject Agent B's edit attempt. This prevents conflicts but overrides Agent B's private knowledge that its edit is compatible. The system cannot know this without understanding the semantics of both edits -- information it does not have.

**Choice 3: Ostromian graduated governance** -- Advisory by default, with escalation. Port Daddy implements this partially: claims are advisory, but `pd salvage` detects dead agents, and pub/sub channels broadcast "I am editing this file" messages. A full Ostromian implementation would add graduated sanctions: first a warning, then a mandatory merge review, then lock enforcement only after repeated conflicts.

### Why Port Daddy Chose Lockean-to-Ostromian

Sen's impossibility proves there is no mechanism that gives both Pareto-optimal allocation and individual agent autonomy when private preferences are involved. Port Daddy's CLAUDE.md explicitly states: "File claims are advisory (conflict detection, not enforcement)." This is a philosophically informed choice:

- Agents have private information about their edits (Sen's liberalism condition)
- The system cannot determine optimal allocation without this information (Sen's Pareto condition)
- Therefore: respect agent autonomy (Lockean), provide conflict detection (Ostromian monitoring), and accept that some conflicts will occur (sacrificing strict Pareto optimality)

The salvage system adds Ostromian monitoring: dead agents' claims are surfaced for living agents to evaluate and continue. This is graduated governance -- not enforcement, but structured visibility.

---

## Failure Modes

### Failure Mode 1: The Phantom Leviathan

**Symptom**: The system has no explicit coordinator, but one component has accumulated de facto authority over resource allocation through convention, caching, or being the first thing that starts.

**Diagnosis**: You have an implicit Hobbesian sovereign. It has all the downsides of central authority (bottleneck, single point of failure) with none of the upsides (explicit contract, health checks, failover).

**Fix**: Make the authority explicit. Either formalize it as a real coordinator with health checks and failover (conscious Hobbesianism), or decompose it into advisory roles (conscious Lockeanism). The worst outcome is an invisible sovereign that nobody monitors.

**Example**: A CI server that implicitly controls which branches can deploy. It was not designed as a sovereign, but it has become one. Make it explicit: add health checks, document its authority, and design for its failure.

### Failure Mode 2: Rousseau's Tyranny of Consensus

**Symptom**: Every decision requires full consensus. The system is slow, agents block waiting for agreement, and a single dissenter can halt progress. People mistake unanimity for the general will.

**Diagnosis**: You implemented volonte de tous (sum of individual wills) and required unanimity. Rousseau's general will is not "everyone agrees" -- it is "what everyone would agree to if they could see the whole picture." Requiring explicit unanimity in a system where agents have partial information produces deadlock, not justice.

**Fix**: Distinguish between (a) decisions that affect all agents equally (these need consensus or quorum) and (b) decisions that are primarily local with minor externalities (these need notification, not consent). Use Ostrom's collective-choice arrangements: affected agents participate, unaffected agents do not block.

**Example**: Schema migrations need quorum (all agents are affected). Port selection does not (only the claiming agent is primarily affected; others just need to know it is taken).

### Failure Mode 3: Rawlsian Blindness to Role

**Symptom**: All agents are treated identically, but some agents have genuinely different resource needs. The system is "fair" but inefficient -- database agents starve while idle monitoring agents sit on unused allocations.

**Diagnosis**: You applied the veil of ignorance too literally. Rawls' difference principle permits unequal allocation when it benefits the worst-off. Treating a database agent and a linter agent identically is not justice -- it is blindness to legitimate difference.

**Fix**: Differentiate by role, not by identity. The veil of ignorance means you do not know which specific agent you will be, but you can know what roles exist. Allocate more resources to roles that serve the collective (Rawls' difference principle), not to agents that happen to start first.

**Example**: Port Daddy's deterministic port hashing treats all agents equally behind the veil (same identity always gets the same port). But orchestration (`pd up`) can allocate more ports to services marked as `primary` -- differentiation by role, justified by the difference principle.

---

## Quality Gates

Before finalizing any architecture decision informed by this skill, verify:

| Gate | Question | Pass Criteria |
|------|----------|---------------|
| **Explicit authority model** | Can you name the governance model (Hobbesian/Lockean/Ostromian)? | Yes, and it is documented |
| **Sen's impossibility check** | Does the system allocate shared resources where agents have private preferences? | If yes: you have chosen which horn to sacrifice, and documented why |
| **Rawlsian veil test** | Would you accept this system's allocation if you were the worst-off agent? | Yes, or the inequality is justified by the difference principle |
| **Ostromian monitoring** | Are violations detected and sanctions graduated? | Advisory -> warning -> escalation, not binary allow/deny |
| **No phantom sovereign** | Is every authority explicit, monitored, and documented? | No component has accumulated de facto authority invisibly |
| **Rousseau distinction** | Do you distinguish consensus (general will) from unanimity (will of all)? | Quorum where needed; notification where sufficient |

---

## Anti-Patterns

### 1. Philosophy Shopping
**What it looks like**: Citing Rawls to justify one decision and Hobbes to justify the next, with no consistent framework across the system.

**Why it is wrong**: Each thinker's framework is internally consistent but incompatible with others at the foundational level. Hobbes says authority is absolute; Locke says it is limited; Ostrom says it is distributed. You cannot coherently apply all three to the same resource without acknowledging the contradictions.

**Fix**: Choose a primary governance model for each resource class. Document the choice and its tradeoffs. You may use different models for different resource classes (ports: Lockean; locks: Hobbesian; channels: Ostromian), but within each class, be consistent.

### 2. Premature Hobbesianism
**What it looks like**: Defaulting to enforced locks and central coordinators because "it is safer." Every shared resource gets a mutex.

**Why it is wrong**: Hobbes is the most expensive governance model. It requires a functioning sovereign (coordinator), monitoring, failover, and global serialization. Most shared resources do not need this. Sen's impossibility tells you that enforcement overrides private information -- and for most resources, agents know better than the coordinator what they need.

**Fix**: Start Lockean (advisory claims). Escalate to Ostromian (graduated sanctions) only when conflicts are observed. Escalate to Hobbesian (enforced locks) only for resources where conflict is catastrophic (database writes, financial transactions).

### 3. The Invisible Social Contract
**What it looks like**: The system depends on conventions that are not documented or enforced. "Everyone knows not to use port 3000." "We always merge feature branches before release branches."

**Why it is wrong**: Locke requires consent to the social contract; you cannot consent to rules you do not know. Invisible conventions are not a governance model -- they are an accident waiting to happen. New agents (or new developers) will violate conventions they were never told about.

**Fix**: Make every convention explicit. Either document it (Lockean -- agents consent by reading the docs) or enforce it (Hobbesian -- the system prevents violation). Ostrom's "clearly defined boundaries" principle requires that the rules of the commons be legible to all participants.

### 4. Confusing Pareto with Justice
**What it looks like**: Optimizing for global throughput or utilization and calling it "fair." The system maximizes total requests per second, but some agents consistently get worse response times.

**Why it is wrong**: Pareto optimality says nothing about distribution. A Pareto-optimal allocation can leave one agent with nothing, as long as you cannot improve that agent without hurting another. Rawls' maximin is the correction: optimize for the worst-off, not the aggregate.

**Fix**: Measure the worst-case agent experience, not just the average. If the worst-off agent's experience is unacceptable, the system is unjust regardless of aggregate performance.

---

## Quick Reference: Thinker to System Pattern

| Thinker | System Pattern | Example |
|---------|---------------|---------|
| Hobbes | Centralized coordinator with enforced allocation | Database lock manager |
| Locke | Advisory claims with documented natural rights | Port Daddy file claims |
| Rousseau | Quorum / consensus for collective decisions | Schema migration approval |
| Rawls | Capability assignment behind the veil | Deterministic port hashing |
| Sen | Acknowledging impossibility of Pareto + liberty | Advisory vs. enforced claims |
| Ostrom | Polycentric governance with graduated sanctions | Salvage queue + pub/sub + advisory claims |
