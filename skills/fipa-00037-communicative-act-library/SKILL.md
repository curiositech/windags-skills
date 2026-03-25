---
license: Apache-2.0
name: fipa-00037-communicative-act-library
description: FIPA standard library of communicative acts (speech acts) for agent-to-agent messaging semantics
category: Research & Academic
tags:
  - fipa
  - agents
  - communication
  - speech-acts
  - standards
---

# SKILL.md: FIPA Communicative Act Library

```yaml
name: fipa-communicative-acts
version: 1.0.0
description: >
  Formal semantics and design patterns for multi-agent communication,
  grounded in the FIPA Communicative Act Library specification. Applies
  to agent coordination, protocol design, message routing, and failure handling.
activation_triggers:
  - designing communication protocols between AI agents
  - building multi-agent systems or agent orchestration layers
  - debugging coordination failures between agents
  - designing fallback or error-signaling behavior for agents
  - reasoning about what agents should "say" to each other and why
  - questions about autonomy, commitment, and compliance in agent networks
  - event-driven or subscription-based agent coordination
  - federated or multi-hop agent routing problems
```

---

## When to Use This Skill

Load this skill when the problem involves **agents coordinating with other agents** — not just calling tools or APIs, but situations where you need to decide *what kind of message* to send, design protocols, or handle autonomous agent coordination failures.

---

## DECISION POINTS

### Primary Act Selection Decision Tree

```
What is the sender's knowledge state about the content?
├── I KNOW P is true + want receiver to know it
│   ├── Receiver doesn't know P → inform(P)
│   └── Unsure if receiver knows P → inform-if(P)
├── I DON'T KNOW if P is true + need to find out
│   ├── Want yes/no answer → query-if(P)
│   └── Want specific referent → query-ref(description)
├── I WANT an action performed + receiver is autonomous
│   ├── Direct request → request(action)
│   ├── Need agreement first → propose(action) 
│   └── Conditional execution → request-when(condition, action)
└── RESPONDING to incoming message
    ├── Cannot process → not-understood(original-message)
    ├── Won't comply → refuse(requested-action, reason)
    ├── Tried but failed → failure(attempted-action, reason)
    ├── Agreeing to proposal → accept-proposal(proposal)
    └── Declining proposal → reject-proposal(proposal, reason)
```

### Federation Routing Decision Tree

```
Is the target agent directly reachable?
├── YES → Send communicative act directly
└── NO → Choose routing strategy:
    ├── Know specific intermediary → proxy(target-agent, message)
    ├── Broadcast to group → propagate(filter-criteria, message)
    └── Store for later → Use subscription/request-whenever pattern

Does this need guaranteed delivery?
├── YES → Require explicit confirm or inform-done responses
└── NO → Send and continue (fire-and-forget acceptable)
```

### Error Handling Strategy Decision Tree

```
Received unexpected response or timeout?
├── got not-understood → Rephrase with simpler terms or different act
├── got refuse → 
│   ├── Capability issue → Find different agent or modify request
│   └── Context issue → Wait for better conditions or negotiate
├── got failure → Retry with same agent or escalate to different approach
├── got nothing (timeout) →
│   ├── < 30s → Retry once
│   ├── 30s-2min → Send cancel, try different agent
│   └── > 2min → Declare coordination failure, escalate
└── got malformed response → Send not-understood, request clarification
```

---

## FAILURE MODES

### 1. "Command Confusion" Anti-Pattern
**Symptom**: Agent sends `request(action)` and assumes action will happen without confirmation
**Detection Rule**: If you see coordination logic that doesn't handle `refuse` or `failure` responses, this is command confusion
**Fix**: Always design request-response pairs: `request(action)` → expect (`inform-done` | `refuse` | `failure`)

### 2. "Silent Drop" Anti-Pattern  
**Symptom**: Agent receives message it cannot process and ignores it silently
**Detection Rule**: If error logs show "unknown message type" without sending `not-understood` response, this is silent drop
**Fix**: Emit `not-understood(original-message)` for any unparseable communicative act before continuing

### 3. "Ontology Overconfidence" Anti-Pattern
**Symptom**: Agent sends `inform(P)` when actually uncertain about P's truth value
**Detection Rule**: If you see `inform` being sent with confidence < 0.8 or from unverified sources, this is ontology overconfidence  
**Fix**: Use `inform-if(P)` to acknowledge uncertainty, or `query-if` to gather more information first

### 4. "Protocol Explosion" Anti-Pattern
**Symptom**: Creating specialized acts like `urgent-notify` or `status-update` instead of composing from primitives
**Detection Rule**: If you see custom message types that aren't grounded in B/U/I mental state changes, this is protocol explosion
**Fix**: Decompose into primitives - `urgent-notify(P)` becomes `inform(P) + priority-flag`, `status-update` becomes `inform(current-status)`

### 5. "Timeout Guessing" Anti-Pattern
**Symptom**: Using arbitrary timeout values (like 5 seconds) without considering act semantics
**Detection Rule**: If timeout logic doesn't vary by communicative act complexity, this is timeout guessing
**Fix**: Scale timeouts by act type - `query-ref`: 10-30s, `request(complex-action)`: 1-5min, `inform`: 5-10s

---

## WORKED EXAMPLES

### Example 1: Federated Information Gathering
**Scenario**: Agent A needs to find "latest weather data for San Francisco" but doesn't know which agent has it.

**Novice approach**: Broadcast `query-ref("weather data for San Francisco")` to all known agents
**Expert reasoning**: 
1. Check ability vs. context relevance - do I have authority to query everyone?
2. Use propagate pattern with filter: `propagate(has-capability("weather-data"), query-ref("SF weather"))`
3. Handle responses: collect all `inform-ref` responses, handle `not-understood` by refining query
4. Timeout after 30s, send `cancel` to any still-processing agents

**Key expert insight**: Propagate with filtering scales better than broadcast, and explicit cancellation prevents resource waste.

### Example 2: Refusal Handling in Task Delegation
**Scenario**: Agent A requests Agent B to `process_document(large_file.pdf)`, Agent B responds with `refuse(process_document, "file too large")`

**Novice approach**: Retry with same request or give up
**Expert reasoning**:
1. Parse refusal reason - "file too large" indicates capability boundary, not context issue
2. Decision tree: capability issue → find different agent OR modify request
3. Try `request(process_document_chunks(split(large_file.pdf, 10MB)))`
4. If that also fails, escalate to agent with higher processing limits

**Key expert insight**: `refuse` contains structured information about WHY coordination failed, enabling systematic recovery strategies.

### Example 3: Timeout Recovery with Mental State Tracking
**Scenario**: Agent A sends `request(calculate_route(complex_params))` to Agent B, no response after 90 seconds

**Novice approach**: Assume failure, try different agent
**Expert reasoning**:
1. Check timeout threshold - route calculation should complete in 30-60s, so 90s indicates problem
2. Send `cancel(calculate_route)` to Agent B to clean up resources
3. Update mental model: B might be overloaded or stuck
4. Try Agent C with `request(calculate_route(complex_params))`, but add timeout metadata
5. If Agent C also delays, simplify params: `request(calculate_route(simplified_params))`

**Key expert insight**: Explicit cancellation preserves agent resource management, and timeout patterns inform request modification strategies.

---

## QUALITY GATES

Protocol validation checklist - mark complete when all conditions are verifiable:

- [ ] Every `request` has defined response paths for `inform-done`, `refuse`, and `failure`
- [ ] All agents can emit `not-understood` for unparseable messages
- [ ] Mental state preconditions are satisfied before sending each act (sender believes what they claim to believe)
- [ ] Timeout thresholds are set based on act complexity: `inform` 5-10s, `query` 10-30s, `request` 30s-5min
- [ ] Routing strategy chosen: direct, proxy, or propagate with appropriate filtering criteria
- [ ] Error escalation paths defined for each failure mode (refuse → find different agent, failure → retry logic)
- [ ] Federation endpoints can handle `cancel` messages for long-running operations
- [ ] Protocol uses composition of primitives rather than custom act types
- [ ] Belief/uncertainty/intention states remain consistent across message sequences
- [ ] Context-relevance vs. ability preconditions distinguished in refusal handling

---

## NOT-FOR BOUNDARIES

This skill should NOT be used for:

- **Single-agent tool calling**: Use function/API calling patterns instead
- **Deterministic service integration**: For REST APIs, database queries, or guaranteed-response services, use standard integration patterns
- **Human-agent conversation**: For natural language dialog, use conversational AI frameworks instead of formal communicative acts
- **Real-time streaming**: For high-frequency data streams, use event streaming protocols; FIPA acts are for coordination, not data transfer
- **Internal agent reasoning**: For agent's private mental state updates, use internal reasoning frameworks

**Delegate to other skills**:
- For API integration: use `[api-integration-patterns]`
- For conversation design: use `[dialog-management]`  
- For streaming data: use `[event-driven-architecture]`
- For internal reasoning: use `[cognitive-architecture]`