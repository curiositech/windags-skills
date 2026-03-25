# Multi-Agent Coordination Through Commitments

## The Coordination Problem

Tambe's observation about multi-agent extensions reveals a critical limitation of basic BDI architecture: "the basic BDI model gives no archi
tectural consideration to explicitly multi-agent aspects of behaviour."

The single-agent BDI model addresses:
- How one agent reasons about its own beliefs, desires, intentions
- When one agent should commit to or reconsider its own plans
- How one agent recovers from failures in isolation

But multi-agent systems introduce fundamentally new challenges:
- How agents coordinate without central control
- How agents make commitments to each other
- How agents recover when coordinated plans fail
- How agents know what others are doing and planning

The extension from single-agent to multi-agent isn't just adding communication—it requires rethinking what commitments mean.

## Commitment as Coordination Mechanism

Tambe writes: "In multi-agent systems, intentions can be communicated to others, who can then plan around them. This only works if intentions have some stability (are not instantly abandoned)."

This reveals intentions playing a **second role** beyond their single-agent function:

### Single-Agent Role
- Filter options (focus reasoning)
- Provide stability (avoid thrashing)
- Enable multi-step plans (later steps depend on earlier commitments)

### Multi-Agent Role  
- Coordination substrate (others can depend on your commitments)
- Communication content (tell others what you'll do)
- Trust foundation (commitments have social meaning)

The multi-agent role imposes **stronger stability requirements**. In single-agent scenarios, you can reconsider intentions whenever locally rational. In multi-agent scenarios, premature intention abandonment breaks others' plans.

### Example: Cascading Failure from Broken Commitments

**Scenario**: Three agents building a report
- Agent A commits to data collection (by Tuesday)
- Agent B commits to analysis (by Thursday, depends on A's data)
- Agent C commits to visualization (by Friday, depends on B's analysis)

**Single-agent reasoning (A)**: "Data collection is harder than expected. I'll abandon this approach and try a different data source. Will take until Wednesday."

**Consequence**: A's local replanning breaks B's timeline, which breaks C's timeline. Report delivery fails, not because of capability limits but because of uncoordinated commitment changes.

**The problem**: A's commitment wasn't just to itself—it was implicitly to B and C. Unilateral reconsideration violated social commitment without renegotiation.

## Social vs. Internal Commitments

The solution requires distinguishing commitment types:

### Internal Commitments (Private Intentions)
- Agent's own planning choices
- Not communicated to others
- Can be reconsidered unilaterally based on local information
- Subject to single-agent commitment strategies (bold, cautious, etc.)

### Social Commitments (Public Intentions)
- Communicated to other agents
- Others may have planned around them
- Should not be reconsidered unilaterally
- Require explicit protocols for commitment change

**The key insight**: The same computational structure (intentions) serves different social roles depending on visibility.

### Implementation Pattern

```
Intention {
  plan: Plan
  goal: Goal
  commitment_level: {INTERNAL, ANNOUNCED, DEPENDED_UPON, CONTRACTED}
  dependent_agents: Set<AgentID>
  termination_conditions: TerminationPolicy
  social_reconsideration_policy: SocialPolicy
}

SocialPolicy {
  requires_notification: bool
  requires_permission: bool  
  requires_compensation: bool
  fallback_obligation: Option<Plan>
}
```

**Commitment levels**:

- **INTERNAL**: Private intention, reconsider freely
- **ANNOUNCED**: Communicated to others but no dependencies yet, reconsideration should notify
- **DEPENDED_UPON**: Others have planned around this, reconsideration requires negotiation  
- **CONTRACTED**: Formal agreement, reconsideration requires compensation or substitution

As commitments move up this hierarchy, reconsideration becomes more constrained—not for single-agent reasoning efficiency but for multi-agent coordination reliability.

## Protocols for Social Commitment Management

### 1. Commitment Announcement

Before others can depend on your intentions, they must know about them:

```
announce_commitment(agent_id, intention):
  message = {
    type: "COMMITMENT_ANNOUNCEMENT"
    agent: agent_id
    intention: {
      goal: intention.goal
      completion_time: estimate_completion(intention)
      confidence: estimate_probability_of_success(intention)
      preconditions: get_required_conditions(intention)
    }
  }
  broadcast(message, interested_agents)
  intention.commitment_level = ANNOUNCED
```

**Purpose**: Let others know what you'll do so they can:
- Avoid conflicts (not pursue incompatible goals)
- Identify synergies (coordinate complementary goals)
- Create dependencies (plan around your expected outcomes)

### 2. Dependency Declaration

When Agent B plans around Agent A's commitment:

```
declare_dependency(agent_b, agent_a, intention_a):
  message = {
    type: "DEPENDENCY_DECLARATION"
    from: agent_b
    on: agent_a
    intention_id: intention_a.id
    dependency_type: {REQUIRES_COMPLETION, REQUIRES_TIMING, REQUIRES_OUTCOME}
    impact_if_broken: estimate_impact()
  }
  send(message, agent_a)
  
  # Agent A updates its commitment
  agent_a.intentions[intention_id].commitment_level = DEPENDED_UPON
  agent_a.intentions[intention_id].dependent_agents.add(agent_b)
```

**Purpose**: Make dependencies explicit so Agent A knows:
- Others are counting on this commitment
- Unilateral reconsideration will cause problems
- Social renegotiation is required before changing plans

### 3. Commitment Renegotiation

When Agent A needs to reconsider a social commitment:

```
request_commitment_change(agent_a, intention):
  if intention.commitment_level < ANNOUNCED:
    # Internal commitment, reconsider freely
    reconsider(intention)
    return
  
  if intention.commitment_level == ANNOUNCED:
    # Notify others but don't need permission
    notify_commitment_change(intention, "Reconsidering announced intention")
    reconsider(intention)
    return
  
  if intention.commitment_level >= DEPENDED_UPON:
    # Must negotiate with dependent agents
    for dependent in intention.dependent_agents:
      request = {
        type: "COMMITMENT_CHANGE_REQUEST"
        intention: intention.id
        reason: explain_why_reconsidering()
        alternatives: [
          propose_alternative_1(),
          propose_alternative_2()
        ]
        compensation: offer_compensation()
      }
      send(request, dependent)
    
    # Wait for responses, negotiate
    responses = collect_responses(intention.dependent_agents)
    if all_agree(responses):
      reconsider(intention)
    else:
      resolve_conflicts(responses)
```

**Purpose**: Transform commitment changes from unilateral actions into negotiated agreements.

### 4. Commitment Monitoring

Agents monitor others' commitments they depend on:

```
monitor_dependencies(agent):
  for dependency in agent.dependencies:
    status = query_commitment_status(dependency.agent, dependency.intention)
    
    if status == ACHIEVED:
      # Dependency satisfied, proceed
      mark_precondition_satisfied(dependency)
    
    elif status == AT_RISK:
      # Commitment in trouble, prepare contingencies
      activate_backup_plan(dependency)
    
    elif status == BROKEN:
      # Commitment failed, replan
      handle_dependency_failure(dependency)
```

**Purpose**: Detect commitment failures early and respond proactively rather than being surprised by broken dependencies.

## Joint Intentions: Commitments to Shared Goals

The protocols above handle dependencies between independent goals. **Joint intentions** go further: multiple agents commit to a shared goal.

Tambe's STEAM system builds on Cohen and Levesque's joint intentions theory, and Grosz and Kraus's SharedPlans framework. Key principles:

### 1. Joint Commitment to Shared Goal

```
form_joint_intention(agents, shared_goal):
  joint_intention = {
    goal: shared_goal
    participants: agents
    individual_commitments: {}  # Each agent's part
    mutual_beliefs: {}          # What everyone knows everyone knows
    group_commitment_policy: {} # How group decides to reconsider
  }
  
  for agent in agents:
    individual_goal = agent.part_of(shared_goal)
    agent.commit_to(individual_goal, joint_intention)
    joint_intention.individual_commitments[agent] = individual_goal
```

**The social semantics**: Each agent commits not just to their individual part but to:
- The team achieving the overall goal
- Helping teammates if they struggle
- Monitoring team progress
- Notifying team of problems

### 2. Mutual Belief Maintenance

Joint intentions require **common ground**—what everyone knows everyone knows:

- Everyone knows the shared goal
- Everyone knows who's doing what part
- Everyone knows everyone knows this (recursive!)

Without common ground, agents might have different understandings of the joint plan, leading to coordination failures.

**Implementation**: Broadcast updates ensure common ground:

```
update_team_belief(joint_intention, new_fact):
  message = {
    type: "TEAM_BELIEF_UPDATE"
    joint_intention: joint_intention.id
    fact: new_fact
    known_by: [agent_id]  # Initiator
  }
  broadcast(message, joint_intention.participants)
  
  # Wait for acknowledgments to establish mutual belief
  acks = collect_acknowledgments(joint_intention.participants)
  if all_received(acks):
    establish_mutual_belief(new_fact)
```

### 3. Team-Oriented Commitment

Individual agents in joint intentions monitor:

- **Own task progress**: Am I on track?
- **Teammates' task progress**: Are they on track?
- **Overall goal status**: Are we collectively achieving the goal?

Commitment policies reflect team context:

```
reconsider_joint_intention(agent, joint_intention):
  # Stronger commitment than individual intentions
  if own_task_failed(agent, joint_intention):
    request_team_help()  # Before abandoning
  
  if teammate_task_failed(teammate, joint_intention):
    offer_help(teammate)  # Help before they fail
  
  if overall_goal_unachievable(joint_intention):
    propose_team_reconsideration()  # Abandon jointly
  
  # Never abandon unilaterally
```

**The principle**: Joint intentions require joint reconsideration. Individual agents don't drop out without team agreement.

## Coordination Without Communication: Intention Recognition

Not all coordination happens through explicit protocols. Agents can also coordinate by **recognizing each other's intentions** from observed behavior.

### Plan Recognition as Inverse Planning

Given observations of Agent A's actions, Agent B can infer:
- What goal is A pursuing?
- What plan is A executing?
- What will A likely do next?

This enables:
- **Predictive coordination**: B anticipates A's future actions
- **Complementary action**: B takes actions that help A achieve its goal
- **Conflict avoidance**: B avoids actions that would interfere with A's plan

### Intention-Based Prediction

Once Agent B recognizes Agent A's intention, prediction becomes easier:

- Intentions are stable (commitment), so A will likely continue the current plan
- Plans have typical structures (plan library), so B knows likely next steps
- Goal achievement is observable, so B knows when A will stop

**Example**: In autonomous vehicles, recognizing that another vehicle intends to merge allows predictive coordination: slow down to create space, rather than just reacting to each merge action.

### Implementation Pattern

```
recognize_intention(other_agent, observed_actions):
  # Hypothesis: what goals could these actions serve?
  possible_goals = infer_goals_from_actions(observed_actions)
  
  # Filter: which goals is other_agent likely pursuing?
  likely_goals = filter_by_agent_model(possible_goals, other_agent)
  
  # For each goal, what plans could achieve it?
  plan_hypotheses = []
  for goal in likely_goals:
    plans = find_plans_for_goal(goal)
    matching = [p for p in plans if consistent_with_observations(p, observed_actions)]
    plan_hypotheses.extend(matching)
  
  # Most likely intention
  best_hypothesis = rank_by_likelihood(plan_hypotheses)[0]
  
  return Intention {
    goal: best_hypothesis.goal
    plan: best_hypothesis.plan
    confidence: calculate_confidence(best_hypothesis, observed_actions)
  }
```

Once Agent B has a hypothesis about A's intention, it can:

```
coordinate_with_recognized_intention(agent_b, agent_a_intention):
  # Predict A's future actions
  predicted_actions = predict_future_actions(agent_a_intention)
  
  # Check for conflicts with own plans
  conflicts = find_conflicts(agent_b.intentions, predicted_actions)
  if conflicts:
    resolve_conflicts_proactively(conflicts)
  
  # Check for opportunities to help
  opportunities = find_helpful_actions(agent_b.capabilities, agent_a_intention)
  if opportunities and worthwhile(opportunities):
    incorporate_helpful_actions(agent_b.intentions, opportunities)
```

## Coordination Patterns

Different multi-agent scenarios require different coordination patterns:

### 1. Hierarchical Coordination (Master-Worker)

One agent (master) assigns subgoals to workers:

```
master_agent:
  goal: G
  decomposition: [G1, G2, G3]
  
  assign_task(worker_1, G1)
  assign_task(worker_2, G2)
  assign_task(worker_3, G3)
  
  monitor_progress([worker_1, worker_2, worker_3])
  aggregate_results()
```

**Commitment pattern**: Workers commit to assigned subgoals. Master commits to coordination and result aggregation.

**Advantages**: Clear responsibilities, simple protocol
**Disadvantages**: Central point of failure, master bottleneck

### 2. Peer Coordination (Negotiated Division of Labor)

Agents negotiate among themselves:

```
peer_agents: [A1, A2, A3]
shared_goal: G

negotiation_round:
  for agent in peer_agents:
    propose = agent.propose_contribution(G)
  
  allocation = negotiate_allocation([A1.propose, A2.propose, A3.propose])
  
  for agent in peer_agents:
    agent.commit_to(allocation[agent])
```

**Commitment pattern**: Agents jointly negotiate then individually commit.

**Advantages**: No central point of failure, flexible
**Disadvantages**: Negotiation overhead, potential conflicts

### 3. Opportunistic Coordination (Shared Attention)

Agents work independently but monitor for opportunities to help:

```
agent:
  own_intentions: [I1, I2]
  
  # Primary work
  execute(own_intentions)
  
  # Opportunistic monitoring
  for other_agent in nearby_agents:
    recognized_intention = recognize_intention(other_agent)
    if can_help_cheaply(recognized_intention):
      incorporate_helpful_action()
```

**Commitment pattern**: Primary commitment to own goals, secondary attention to helping others.

**Advantages**: Emergent cooperation without explicit coordination
**Disadvantages**: May miss opportunities requiring explicit coordination

### 4. Team-Based Coordination (Joint Intentions)

Agents form teams with shared goals:

```
team = form_team([A1, A2, A3], shared_goal=G)

team.establish_joint_intention(G)
team.allocate_roles()
team.monitor_team_progress()

for agent in team:
  agent.execute_role()
  agent.monitor_teammates()
  agent.help_struggling_teammates()
```

**Commitment pattern**: Joint commitment to shared goal, mutual support obligations.

**Advantages**: Strong coordination, robust to individual failures
**Disadvantages**: Overhead of team formation and maintenance

## Failure Modes in Multi-Agent Commitments

### 1. Unilateral Reconsideration (Breaking Social Commitments)

**Failure**: Agent reconsiders socially-committed intention without notification/negotiation

**Symptom**: Cascading failures as dependent agents' plans break

**Prevention**:
- Explicit commitment levels (social vs. internal)
- Protocols requiring negotiation before changing social commitments
- Monitoring for dependency violations

### 2. Commitment Rigidity (Can't Adapt to Changes)

**Failure**: Agents maintain commitments despite changed circumstances because coordination overhead is too high

**Symptom**: Inefficient or failing plans continue because renegotiation is harder than suffering through

**Prevention**:
- Lightweight reconsideration protocols
- Contingency clauses in commitment agreements
- Automatic triggers for renegotiation (if X happens, we'll reconsider)

### 3. Circular Dependencies (Coordination Deadlock)

**Failure**: Agent A waits for Agent B, who waits for Agent C, who waits for Agent A

**Symptom**: No agent can proceed, system deadlocked

**Prevention**:
- Dependency analysis before forming commitments
- Timeout mechanisms (if dependency not satisfied by time T, replan)
- Hierarchical commitment structures (prevent cycles)

### 4. Communication Failures (Lost Coordination Messages)

**Failure**: Commitment announcement, dependency declaration, or reconsideration request lost in transmission

**Symptom**: Agents have inconsistent views of commitments

**Prevention**:
- Acknowledgment protocols (ensure message receipt)
- Heartbeat monitoring (detect silent failures)
- Explicit synchronization points (verify consistent understanding)

### 5. Free Riding (Benefiting Without Contributing)

**Failure**: Agent benefits from team effort without contributing their share

**Symptom**: Joint intentions fail because some agents don't follow through

**Prevention**:
- Monitor individual contributions to joint intentions
- Reputation systems (track commitment reliability)
- Enforcement mechanisms (penalties for broken commitments)

## Implications for WinDAG Multi-Agent Orchestration

### 1. Explicit Social Commitment Infrastructure

DAG orchestration needs to distinguish:
- **Internal task planning**: Agent's private reasoning about how to execute assigned tasks
- **Announced capabilities**: Agent tells orchestrator what it can do (other agents can depend on this)
- **Committed tasks**: Agent has accepted task assignment (orchestrator can plan around this)
- **Joint tasks**: Multiple agents have accepted parts of shared goal (they monitor each other)

### 2. Dependency-Aware Scheduling

When orchestrator assigns tasks to agents:

```
assign_task(agent, task, dependencies):
  # Check if agent can commit to completion time
  agent_estimate = agent.estimate_completion(task, dependencies)
  
  # Check if dependencies are reliable
  dependency_reliability = check_dependency_reliability(dependencies)
  
  # If dependencies unreliable, provide alternatives or buffers
  if not dependency_reliability > threshold:
    provide_backup_dependencies(task)
  
  # Get commitment
  commitment = agent.commit_to_task(task, dependencies)
  commitment.commitment_level = DEPENDED_UPON
  
  # Notify dependent agents
  for dependent in find_dependent_tasks(task):
    notify_dependency(dependent.agent, commitment)
```

### 3. Coordination Protocol Selection

Different DAG structures need different coordination patterns:

- **Pipeline DAGs**: Hierarchical coordination (each agent waits for predecessor)
- **Parallel DAGs**: Peer coordination (agents negotiate resource allocation)
- **Collaborative DAGs**: Team-based coordination (agents share joint intention)

Orchestrator should select coordination protocol based on DAG topology.

### 4. Failure Recovery with Coordination Awareness

When a task fails:

```
handle_task_failure(failed_task):
  # Identify dependent tasks
  dependent_tasks = find_dependent_tasks(failed_task)
  
  # Notify dependent agents
  for task in dependent_tasks:
    notify_dependency_failure(task.agent, failed_task)
  
  # Renegotiate commitments
  for task in dependent_tasks:
    new_commitment = renegotiate_commitment(task.agent, failed_task)
    update_dag(task, new_commitment)
  
  # Find alternative for failed task
  alternative = find_alternative_task(failed_task)
  if alternative:
    reassign_task(alternative)
  else:
    escalate_failure(failed_task.goal)
```

This transforms orchestration failure from "restart DAG" to "renegotiate affected commitments."

## Conclusion: Commitments as Multi-Agent Glue

Single-agent BDI uses commitments for computational efficiency: commit to avoid thrashing, reconsider strategically to adapt.

Multi-agent BDI uses commitments for coordination: commit to enable others' planning, reconsider collaboratively to maintain consistency.

The same computational structure (intentions) serves both purposes, but multi-agent scenarios impose stronger stability requirements. Social commitments require:

1. **Explicit visibility**: Others must know your commitments
2. **Dependency tracking**: You must know who depends on your commitments
3. **Negotiated reconsideration**: You cannot unilaterally abandon commitments others depend on
4. **Mutual monitoring**: Joint intentions require monitoring team progress, not just individual progress

For DAG orchestration with multiple AI agents: the orchestrator must manage not just task execution but commitment relationships between agents. This transforms orchestration from scheduling (assign tasks, monitor completion) to coordination (establish commitments, track dependencies, facilitate renegotiation).

The BDI model's power in multi-agent settings comes from making commitments **first-class computational entities** that can be reasoned about, communicated, monitored, and renegotiated. This explicit representation is what enables flexible coordination without central control—agents coordinate by reasoning about each other's commitments, not by following centralized commands.