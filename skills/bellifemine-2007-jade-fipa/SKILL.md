---
license: Apache-2.0
name: bellifemine-2007-jade-fipa
description: JADE platform for building FIPA-compliant multi-agent systems with standardized agent communication
category: Research & Academic
tags:
  - jade
  - fipa
  - agents
  - middleware
  - multi-agent-platform
---

# SKILL: Developing Multi-Agent Systems with JADE

## Decision Points

### Ontology-First vs Behavior-First Agent Design
```
IF agents built by different teams/languages need semantic interoperability
  → START with ontology definition (concepts, predicates, actions)
  → THEN implement behaviors that use ontology
  → Example: Commerce ontology with PurchaseOrder, Price concepts

ELSE IF rapid prototyping single-team system
  → START with behavior implementation (protocols, workflows)
  → ADD ontology later when integration needed
  → Example: Internal workflow automation
```

### Protocol Selection for Task Coordination
```
IF task requires competitive selection among multiple candidates
  → Contract Net Protocol
  → Coordinator announces CFP, agents bid, select winner
  
ELSE IF task is conditional future execution
  → Request-When Protocol  
  → "Execute X when condition Y becomes true"
  
ELSE IF task requires ongoing data subscription
  → Subscribe Protocol
  → Register for updates, receive INFORMs until unsubscribe
  
ELSE IF simple synchronous request-response
  → Request Protocol
  → AGREE/REFUSE followed by INFORM/FAILURE
```

### Resource-Constrained Protocol Composition
```
IF mobile/edge agents with limited battery/connectivity
  → Use split-container architecture
  → Lightweight front-end + stateful back-end + mediator
  
ELSE IF high-throughput server environment  
  → Direct peer-to-peer protocols
  → No mediation overhead needed

IF timeout budget < 5 seconds
  → Avoid nested Contract Net (too many round trips)
  → Use direct Request with pre-cached service discovery
  
ELSE IF timeout budget > 30 seconds
  → Safe to use Contract Net → Request composition
  → Full negotiation + execution workflow
```

### Agent Architecture Patterns
```
IF agent needs standard FIPA semantics only
  → Extend SemanticAgent
  → Declare Capability (actions, beliefs)
  → Get QUERY/INFORM/SUBSCRIBE for free via SIPs
  
ELSE IF custom message interpretation required
  → Override specific SIPs (Semantic Interpretation Principles)
  → Keep default SIPs where possible
  
ELSE IF complex workflow coordination needed
  → Compose behaviors: Sequential/Parallel/FSM
  → Use protocol templates as building blocks
```

## Failure Modes

### **Byzantine Agent Behavior**
**Symptoms**: Agent accepts REQUEST (sends AGREE) but never responds with INFORM/FAILURE, or sends semantically invalid responses
**Detection**: `if (timeoutExpired && lastReceived == AGREE) { /* Byzantine behavior detected */ }`
**Diagnosis**: Agent implementation bug or malicious behavior - violating FIPA protocol contract
**Fix**: Implement timeout handling with explicit FAILURE generation, blacklist unreliable agents, add protocol validation layers

### **Schema Bloat in Ontology Evolution** 
**Symptoms**: Ontology grows to 500+ concepts, agents spend seconds parsing/reasoning about messages
**Detection**: `if (ontology.getConcepts().size() > threshold || messageParsingTime > 100ms)`
**Diagnosis**: Monolithic ontology without modular decomposition
**Fix**: Split into domain-specific sub-ontologies, use ontology import/composition, implement lazy concept loading

### **Cascade Failure in Sequential Workflows**
**Symptoms**: Single agent failure brings down entire multi-step workflow, no partial progress recovery
**Detection**: `if (behavior instanceof SequentialBehaviour && childFailureCount > 0)`
**Diagnosis**: No failure isolation between workflow steps
**Fix**: Replace SequentialBehaviour with FSMBehaviour for explicit error states, add compensating actions for partial rollback

### **Message Queue Overflow Under Load**
**Symptoms**: OutOfMemoryError in message delivery subsystem, agents stop receiving messages
**Detection**: Monitor `containerMessageQueueSize > maxThreshold`
**Diagnosis**: Producer/consumer rate mismatch, no backpressure mechanism
**Fix**: Set message TTL, implement priority queues, add flow control at protocol level

### **Directory Facilitator Bottleneck**
**Symptoms**: Service discovery taking >5 seconds, DF becomes single point of failure
**Detection**: `if (dfSearchTime > threshold || dfRequestCount > maxConcurrent)`
**Diagnosis**: Centralized service registry pattern under high load
**Fix**: Implement distributed DF federation, cache service advertisements locally, use gossip-based discovery

## Worked Examples

### Example: Multi-Vendor Book Purchase with Failure Handling

**Scenario**: Agent needs to buy "JADE Programming Guide" at lowest price from multiple online sellers

**Decision Point Navigation**:
1. **Task Type**: Competitive selection among vendors → **Contract Net Protocol**
2. **Architecture**: Standard request-response needed → **Basic Agent + Request Protocol for execution**
3. **Failure Requirements**: Timeout budget 30 seconds, need graceful degradation → **Sequential workflow with timeout handling**

**Expert Implementation**:
```java
// Top level: Contract Net for vendor selection
ContractNetInitiator bookPurchaseNegotiation = new ContractNetInitiator(this, cfpMessage) {
    protected void handlePropose(ACLMessage propose, Vector acceptances) {
        // Expert: Evaluate proposals by price + delivery time + vendor reputation
        double score = calculateVendorScore(propose);
        if (score > bestScore) {
            bestScore = score;
            bestProposal = propose;
        }
    }
    
    protected void handleFailure(ACLMessage failure) {
        // Expert: Contract Net failure means no valid bids - try backup strategy
        addBehaviour(new FallbackBehavior(searchAmazonDirect()));
    }
};

// Execution level: Request Protocol for actual purchase  
RequestInitiator purchaseExecution = new RequestInitiator(this, purchaseMessage) {
    protected void handleInform(ACLMessage inform) {
        // Expert: Validate purchase confirmation against ontology
        if (validatePurchaseConfirmation(inform)) {
            logger.info("Purchase confirmed: " + inform.getContent());
        }
    }
    
    protected void handleFailure(ACLMessage failure) {
        // Expert: Payment failure - try next best vendor from Contract Net results
        retryWithNextVendor();
    }
};
```

**Novice Would Miss**:
- No timeout handling - would wait forever for responses
- No proposal evaluation logic - would accept first response  
- No backup strategy when Contract Net finds no bidders
- No validation of purchase confirmation semantics

**Expert Catches**:
- Explicit timeout in Contract Net CFP message
- Multi-criteria vendor scoring (price + delivery + reputation)
- Fallback behavior when no proposals received
- Ontology-based validation of purchase confirmation content
- Retry mechanism with next-best vendor on payment failure

## Quality Gates

- [ ] All agent interactions use FIPA-ACL performatives (REQUEST, INFORM, AGREE, REFUSE, FAILURE)
- [ ] Ontology coverage: All message content grounded in formal ontology with defined concepts and predicates  
- [ ] Protocol timeout budgets: Every blocking protocol interaction has explicit timeout (recommend 5-30 seconds)
- [ ] Message delivery guarantees: Persistent delivery enabled for critical workflows, TTL set for non-critical messages
- [ ] Failure path validation: Every protocol success path has corresponding REFUSE/FAILURE handling
- [ ] Behavior composition correctness: Sequential behaviors handle child failure propagation, Parallel behaviors have appropriate termination conditions
- [ ] Service discovery scalability: Directory Facilitator queries cached or federated for systems >50 agents
- [ ] Split-container deployment: Mobile/edge agents use lightweight front-end with server-side back-end for state persistence
- [ ] Semantic interpretation: Custom SIPs override only specific interpretation rules, preserving standard FIPA semantics elsewhere
- [ ] Protocol compliance testing: Agent behaviors tested against FIPA protocol state machines for conformance

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- Simple HTTP REST APIs → Use standard web service frameworks instead
- Batch processing pipelines → Use workflow engines like Apache Airflow instead  
- Real-time streaming data → Use event streaming platforms like Apache Kafka instead
- Single-machine concurrency → Use standard threading/async frameworks instead
- Database transactions → Use ACID database systems instead

**Delegation Guidelines**:
- For message queuing without agent semantics → Use `message-queue-architecture` skill instead
- For distributed system consensus → Use `distributed-consensus-algorithms` skill instead  
- For service mesh networking → Use `service-mesh-patterns` skill instead
- For event-driven architecture → Use `event-sourcing-cqrs` skill instead
- For microservices orchestration → Use `microservices-coordination` skill instead

**Core Trigger**: Use JADE when you need **semantic interoperability** between **autonomous components** that must **coordinate without central control** using **standardized protocols**. If any of these requirements is missing, simpler alternatives will be more appropriate.