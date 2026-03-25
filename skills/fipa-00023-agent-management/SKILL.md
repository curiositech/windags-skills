---
license: Apache-2.0
name: fipa-00023-agent-management
description: FIPA standard for agent platform management including lifecycle, directory, and communication services
category: Research & Academic
tags:
  - fipa
  - agents
  - standards
  - agent-management
  - interoperability
---

# SKILL.md — FIPA Agent Management: Multi-Agent Infrastructure Patterns

```yaml
metadata:
  name: fipa-agent-management
  version: XC00023H
  description: >
    Canonical patterns for naming, registering, lifecycling, and managing
    autonomous agents in multi-agent systems. Derived from the FIPA Agent
    Management Specification — the normative standard for interoperable
    agent infrastructure.
  activation_triggers:
    - designing multi-agent orchestration systems
    - implementing agent discovery or capability routing
    - building skill registries or service directories
    - handling agent failures or retry logic in distributed systems
    - designing agent identity, addressing, or transport layers
    - modeling agent state or lifecycle transitions
    - building federated or hierarchical agent platforms
```

## Decision Points

### Core Architecture Choice
```
IF building single-organization agent platform (< 50 agents):
  ├─ Use single AMS + single DF
  ├─ Direct resolution of AIDs to transport addresses
  └─ Flat capability search across all agents

ELSE IF building multi-organization/federated system:
  ├─ Use federated DF architecture
  ├─ Each organization runs own AMS/DF pair
  ├─ DFs register with parent/peer DFs
  └─ Search propagates with max-depth bounds
```

### Agent Discovery Strategy
```
IF agent needs specific capability:
  ├─ Query local DF first with service description
  ├─ IF no results AND federated topology exists:
  │   └─ Propagate search to federated DFs (depth ≤ 3)
  └─ ELSE IF no results in flat topology:
      └─ Return "capability not available" (don't retry)

IF agent joins platform:
  ├─ Register with AMS first (establish identity + lifecycle state)
  ├─ THEN register capabilities with DF
  └─ Registration order matters: existence before capabilities
```

### Failure Recovery Logic
```
IF receive typed FIPA exception:
  ├─ unsupported/unrecognised → route to different agent type
  ├─ missing/malformed → fix request parameters, retry once
  ├─ unauthorised → escalate to platform admin
  ├─ not-registered → agent reference stale, re-discover via DF
  ├─ already-registered → idempotent operation, continue
  └─ internal-error → exponential backoff retry (max 3 attempts)

ELSE IF receive non-FIPA error or timeout:
  ├─ Mark agent as Unknown in AMS
  ├─ Trigger platform-level health check
  └─ Do not retry until health restored
```

### Lifecycle State Transitions
```
IF need to send request to agent:
  ├─ Query AMS for current lifecycle state
  ├─ IF state = Active: send immediately
  ├─ IF state = Waiting: send with acknowledgment protocol
  ├─ IF state = Suspended: queue or route to alternative
  └─ IF state = Unknown/Transit: wait for state resolution

IF agent reports failure/becomes unresponsive:
  ├─ AMS transitions agent to Unknown state
  ├─ DF keeps capability registrations (for recovery)
  ├─ Platform stops routing new requests to agent
  └─ Initiate recovery protocol (restart/reregister)
```

## Failure Modes

### 🚫 **Endpoint Conflation** 
**Symptoms**: Direct calls to `http://agent.host:8080`, hard-coded URLs in routing logic, broken references when agents move  
**Detection Rule**: If you store transport addresses as permanent identifiers, you have this anti-pattern  
**Fix**: Store AIDs only; resolve transport addresses via AMS at invocation time

### 🚫 **Registry Collapse**
**Symptoms**: Single table/store tracking both agent existence and capabilities, lifecycle changes break service discovery  
**Detection Rule**: If updating agent state requires touching capability records, you've collapsed the registries  
**Fix**: Separate AMS (white pages) from DF (yellow pages); independent update operations

### 🚫 **Blind Retry Loops**
**Symptoms**: Generic error handling that retries all failures identically, no differentiation between temporary vs permanent failures  
**Detection Rule**: If your retry logic doesn't branch on failure type, you're in blind retry  
**Fix**: Parse FIPA exception types; different recovery strategies per exception class

### 🚫 **State-Blind Invocation**
**Symptoms**: Sending requests without checking agent lifecycle state, timeouts on suspended agents  
**Detection Rule**: If you invoke agents without AMS state check, you're state-blind  
**Fix**: Query lifecycle state before invocation; handle each state appropriately

### 🚫 **Discovery Bottleneck**
**Symptoms**: Single central DF handling all capability queries, search latency increases with agent count  
**Detection Rule**: If all capability searches hit the same registry, you have a bottleneck  
**Fix**: Implement federated DF architecture with bounded search propagation

## Worked Examples

### Example 1: Federated Discovery Across Organizations

**Scenario**: Agent in Organization A needs text-translation capability, which exists in Organization B's platform.

**Step-by-step execution**:
1. Agent queries local DF: `QUERY-REF(service-type=translation, input-lang=en, output-lang=es)`
2. Local DF returns empty result set
3. Local DF has federated peer registered → propagate search with max-depth=2
4. Organization B's DF receives federated query, matches against registered translator agent
5. Result propagates back: `AID=translator@orgb.com, service-description=...`
6. Agent A resolves AID via Organization B's AMS → gets transport address
7. Agent A sends translation request with REQUEST performative

**Novice mistakes**: Querying Organization B directly, storing B's transport address permanently, not using AID resolution  
**Expert insights**: Federated search is bounded (prevents query storms), AID resolution happens at invocation time (handles agent migration), performative choice signals intent clearly

### Example 2: Agent Failure and Re-registration

**Scenario**: Active translation agent crashes mid-task, client needs to detect failure and recover.

**Step-by-step execution**:
1. Client sends REQUEST to translator agent → receives timeout (no response)
2. Client queries AMS for agent lifecycle state → returns "Active" (stale)
3. Platform health monitor detects agent unresponsive → AMS transitions to "Unknown"
4. Client retries request → receives `not-registered` exception from message transport
5. Client re-queries DF for translation capability → finds replacement agent
6. Original agent restarts, re-registers with AMS (Initiated → Active transition)
7. Original agent re-registers capabilities with DF
8. Subsequent capability queries return both translator agents

**Novice mistakes**: Infinite retry without state checking, assuming agent death means capability unavailable  
**Expert insights**: AMS state change is separate from DF re-registration, multiple agents can offer same capability, exception type determines recovery strategy

### Example 3: Multi-Protocol AID Update

**Scenario**: Agent platform adds MQTT transport alongside existing HTTP, agent needs to be reachable via both protocols.

**Step-by-step execution**:
1. Agent updates AMS registration: `AID=agent@platform.com, addresses=[http://host:8080/agent, mqtt://broker:1883/agent]`
2. AMS validates both transport addresses are reachable
3. Clients continue using same AID for agent reference
4. When client resolves AID → AMS returns both addresses, client chooses transport based on capability
5. HTTP clients continue working unchanged
6. New MQTT clients can connect using same agent identity

**Novice mistakes**: Creating separate agent identities per protocol, forcing all clients to update references  
**Expert insights**: Identity stability across transport changes, AID supports multiple addresses natively, transport choice happens at resolution time

## Quality Gates

- [ ] Agent identities are symbolic AIDs, not transport addresses
- [ ] AMS (white pages) and DF (yellow pages) are separate registration systems
- [ ] All agent-to-agent communication checks lifecycle state before invocation
- [ ] Error responses use FIPA exception taxonomy, not generic success/failure flags
- [ ] Capability searches support both local and federated discovery modes
- [ ] Agent registration follows correct sequence: AMS first, then DF
- [ ] Federation topology has explicit max-depth bounds on search propagation
- [ ] Lifecycle state transitions respect authority rules (AMS vs agent-initiated)
- [ ] Message performatives match communication intent (REQUEST vs INFORM vs QUERY)
- [ ] Recovery protocols distinguish between agent failure and capability unavailability

## Not-For Boundaries

**Do NOT use this skill for:**
- Individual agent reasoning or decision-making → Use [agent-cognition-patterns] instead
- Task decomposition within single agent → Use [task-planning-protocols] instead  
- Agent learning or adaptation strategies → Use [agent-learning-frameworks] instead
- User interface design for agent interactions → Use [human-agent-interaction] instead
- Business logic or domain-specific agent behaviors → Use domain-specific skills instead

**This skill covers infrastructure-level coordination only**: how agents find each other, communicate, and manage shared platform resources. For everything that happens *inside* an individual agent, delegate to other skills.