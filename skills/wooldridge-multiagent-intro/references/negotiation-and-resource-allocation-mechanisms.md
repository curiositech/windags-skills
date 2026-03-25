# Negotiation, Resource Allocation, and Game-Theoretic Coordination

## The Shift from Benevolent to Self-Interested Agents

Wooldridge identifies a pivotal moment in multi-agent systems research:

**Rosenschein (1985)** in *"Deals Among Rational Agents"*:
- Coined the term **"benevolent agent"**
- Recognized that early distributed AI systems **implicitly assumed common interests** among agents
- Introduced **game theory** as the framework for analyzing agent interactions when interests conflict

**The fundamental reframing**:

- **Benevolent agents** (pre-1985 assumption): All agents share the same goals; coordination is pure problem-solving
- **Self-interested agents** (post-1985 reality): Agents have private goals that may conflict; coordination requires **negotiation** and **mechanism design**

This distinction splits MAS research into two tracks:
1. **Cooperative problem solving** (benevolent case): How to coordinate efficiently when all agents want the same outcome
2. **Negotiation and mechanism design** (self-interested case): How to coordinate when agents have conflicting preferences

**Transfer principle**: In a 180-skill orchestration system, treat skills as **self-interested** when they:
- Compete for limited resources (CPU, memory, API quotas)
- Have different quality/latency trade-offs
- Represent different organizational units (billing, compliance, operations) with distinct priorities

## Contract Net: The Canonical Negotiation Protocol

**Reid Smith (1977-1980)** introduced the **Contract Net Protocol** using an economic metaphor:

### Core Mechanism

1. **Task Announcement**: Manager broadcasts task description with eligibility criteria
   ```
   Task: "Solve optimization problem for region R"
   Eligibility: "Must have solver capability + available compute"
   Deadline: T
   ```

2. **Bidding**: Contractors evaluate their suitability and submit bids
   ```
   Bid from Contractor_A:
     Capability: "Can solve with accuracy 95%, time 10 min, cost $5"
     Availability: "Free now"
     Past performance: "Solved 23 similar tasks, avg quality 93%"
   ```

3. **Award**: Manager selects best contractor(s) based on multi-criteria evaluation
   ```
   Award to Contractor_A:
     Reason: "Lowest cost among bids meeting accuracy threshold"
     Contract terms: "Deliver by T, payment $5"
   ```

4. **Execution**: Awarded contractor(s) execute, may recursively subcontract
   ```
   Contractor_A:
     Subtask 1: "Preprocess data" → Subcontract to Contractor_C
     Subtask 2: "Run solver" → Execute locally
     Subtask 3: "Validate output" → Subcontract to Contractor_D
   ```

5. **Reporting**: Contractors report results; manager validates and pays
   ```
   Result from Contractor_A:
     Status: "Success"
     Output: [solution data]
     Actual metrics: "Accuracy 96%, time 9 min"
   ```

### Why This Is Coordination, Not Just Task Allocation

The Contract Net solves multiple coordination problems simultaneously:

1. **Information asymmetry**: Manager doesn't know contractors' capabilities; bidding **reveals** private information

2. **Load balancing**: Contractors with high load bid higher costs or decline; naturally distributes work

3. **Failure recovery**: If contractor fails, manager can **reopen bidding** with remaining contractors

4. **Recursive decomposition**: Contractors can themselves become managers for subtasks (hierarchical coordination)

### Transfer to Skill Orchestration

**Scenario**: Workflow requires "data validation" step; 3 skills can perform it:
- Skill_A: Fast (2 sec), low accuracy (90%), low CPU
- Skill_B: Medium (5 sec), high accuracy (98%), medium CPU
- Skill_C: Slow (10 sec), very high accuracy (99.9%), high CPU

**Contract Net protocol**:

```python
# Manager (orchestrator) announces task
task = {
    "type": "data_validation",
    "input": dataset,
    "min_accuracy": 95%,
    "deadline": now + 30 seconds
}
broadcast_task(task)

# Skills bid
bids = [
    Skill_A.bid(task),  # → None (accuracy < 95%, doesn't bid)
    Skill_B.bid(task),  # → {cost: 5, time: 5, accuracy: 98%}
    Skill_C.bid(task),  # → {cost: 10, time: 10, accuracy: 99.9%}
]

# Manager evaluates
winning_bid = min(bids, key=lambda b: b.cost if b.time < task.deadline else float('inf'))
# Skill_B wins (cheapest among eligible)

# Award contract
award_contract(Skill_B, task)
result = execute_with_monitoring(Skill_B, task)