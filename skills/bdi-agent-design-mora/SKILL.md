---
license: Apache-2.0
name: bdi-agent-design-mora
description: Design patterns for BDI agents using the MORA methodology for practical multi-agent system development
category: Research & Academic
tags:
  - bdi
  - agents
  - design-patterns
  - mora
  - architecture
---

# BDI Agent Design (Móra et al.)

**Skill ID**: `bdi-agent-design-mora`  
**Version**: 1.0  
**Author**: Based on "BDI Models and Systems: Reducing the Gap" by Móra, Lopes, Viccari, and Coelho  
**Activation Triggers**: BDI architecture, agent systems, intention reasoning, belief-desire-intention, operational semantics, agent deliberation, commitment mechanisms, rational agents

## Description

Design and implement rational agent systems using the Beliefs-Desires-Intentions (BDI) paradigm with executable semantics. This skill bridges the theory-practice gap by using Extended Logic Programming with paraconsistent semantics as both formal specification AND reasoning engine.

## Decision Points

### Core Architecture Choice
```
IF building theoretical specification OR formal verification required
├─ Use axiomatic modal/temporal BDI logics (Cohen & Levesque, Rao & Georgeff)
└─ Accept theory-implementation gap

IF building executable agent system
├─ Use Extended Logic Programming with operational semantics
└─ Formal specification IS the reasoning engine
```

### Intention Revision Triggers
```
IF action completes/fails
├─ Remove completed intentions from commitment set
├─ Check if failure makes other intentions impossible
└─ Filter satisfied desires from candidate pool

IF deadline reached
├─ Remove expired intentions
├─ Re-evaluate previously delayed desires
└─ Trigger replanning for dependent actions

IF belief-intention contradiction detected
├─ IF abduction can find missing preconditions → revise beliefs
└─ IF intention truly impossible → abandon intention

IF higher-priority desire becomes feasible
├─ IF conflicts with current intentions → trigger deliberation
└─ IF compatible → adopt without disrupting commitments

IF no trigger condition met
└─ Maintain current intentions (commitment persistence)
```

### Negation Strategy Selection
```
IF representing "agent actively believes/desires X is false"
└─ Use explicit negation: ¬P

IF querying "is there evidence for X?"
└─ Use negation-by-failure: not P

IF detecting conflicts between mental states
├─ Need explicit negation for: desire(P) ∧ desire(¬P)
└─ Negation-by-failure cannot detect this contradiction
```

### Conflict Resolution Approach
```
IF desires directly contradict (P ∧ ¬P)
├─ Apply priority ordering
└─ Keep higher-priority desire, remove lower

IF desires have incompatible resource requirements
├─ Use abduction to test joint feasibility
├─ IF multiple consistent subsets exist → apply maximality preference
└─ IF no consistent subset → escalate to user/higher-level goal

IF paraconsistent contradiction detected
├─ Trigger minimal revision procedure
├─ Restore consistency through preference-guided removal
└─ Use contradiction as deliberation input, not error condition
```

## Failure Modes

### **Modal Logic Without Proof Procedures**
**Detection**: Elegant BDI specifications exist but implementation uses ad-hoc Java/Python data structures with no resemblance to specification
**Root Cause**: Choosing specification formalisms that cannot execute
**Fix**: Use formalisms where specification IS executable (Extended Logic Programming) or commit to mechanized modal logic with runtime theorem proving

### **Negation Conflation**
**Detection**: System uses only `not P` for both "unknown" and "actively false"; cannot represent negative intentions like "intend NOT to interrupt user"
**Root Cause**: Treating negation-by-failure as sufficient for all negative information
**Fix**: Use explicit negation `¬P` for affirmative negative knowledge; reserve `not P` for closed-world queries

### **Perpetual Re-deliberation**
**Detection**: Agent recalculates optimal intentions every cycle; never executes plans longer than one decision cycle; high CPU usage in deliberation
**Root Cause**: No commitment mechanism; treating all desires as immediate commands
**Fix**: Implement trigger-based revision with explicit commitment constraints; intentions persist between triggers

### **Contradiction Crashes**
**Detection**: System enters undefined state or throws exceptions when desires conflict; requires pre-filtering desires for consistency
**Root Cause**: Classical logic semantics where contradictions make everything provable
**Fix**: Use paraconsistent semantics (WFSX) where contradictions are detectable signals triggering deliberation

### **Combinatorial Preference Explosion**
**Detection**: System generates all possible consistent desire subsets then applies preference; exponential slowdown with desire set size
**Root Cause**: Treating preference as post-processing filter rather than search guidance
**Fix**: Integrate preference into revision procedure; guide search toward preferred revisions without enumerating all possibilities

## Worked Examples

### Example 1: Belief-Intention Contradiction Resolution

**Scenario**: Household robot intends to `serve_coffee` but discovers `coffee_maker_broken`.

```prolog
% Initial state
belief(coffee_maker_broken).
intention(serve_coffee).
action_precondition(serve_coffee, working_coffee_maker).

% Contradiction detection (paraconsistent semantics)
contradiction :- 
    intention(serve_coffee),
    belief(coffee_maker_broken),
    action_precondition(serve_coffee, working_coffee_maker),
    not belief(working_coffee_maker).

% Abductive feasibility check
missing_precondition(X) :-
    intention(A),
    action_precondition(A, X),
    not belief(X),
    not belief(¬X).

% Revision options:
% Option 1: Abandon intention
revised_intentions_1([]) :- contradiction.

% Option 2: Abductive belief revision (find alternative)
revised_beliefs_2([belief(use_instant_coffee), belief(working_instant_dispenser)]) :-
    contradiction,
    alternative_action(serve_coffee, use_instant_coffee),
    abducible(working_instant_dispenser).
```

**Decision Process**:
1. Contradiction detected → trigger deliberation
2. Check abductive alternatives → instant coffee possible
3. Preference evaluation → satisfying desire preferred over abandoning
4. Result: Revise beliefs to include instant coffee option, maintain serve_coffee intention

**Novice Miss**: Would abandon intention immediately without checking alternatives
**Expert Catch**: Uses abduction to find feasible alternative means to same end

### Example 2: Competing Desire Deliberation

**Scenario**: Personal assistant agent with conflicting scheduling desires.

```prolog
% Competing desires
desire(schedule_meeting(client_A, 2pm)).
desire(¬schedule_meeting(client_A, 2pm)).  % Explicit negation - active aversion
desire(schedule_workout(2pm)).

% Priority information
priority(schedule_meeting(client_A, 2pm), 8).
priority(schedule_workout(2pm), 6).

% Resource constraints
conflicts(schedule_meeting(client_A, 2pm), schedule_workout(2pm)) :- 
    same_time_slot(2pm, 2pm).

% Revision procedure
deliberate_intentions(Result) :-
    find_contradictions(Conflicts),
    resolve_by_priority(Conflicts, Resolved),
    check_resource_conflicts(Resolved, Final),
    Result = Final.

% Paraconsistent detection
find_contradictions([(desire(P), desire(¬P)) | Rest]) :-
    desire(P), desire(¬P),
    find_contradictions(Rest).

% Priority-based resolution
resolve_by_priority([(desire(P), desire(¬P))], [desire(P)]) :-
    priority(P, X), priority(¬P, Y), X > Y.
```

**Decision Process**:
1. Explicit negation enables detecting desire(schedule_meeting) ∧ desire(¬schedule_meeting)
2. Priority resolution: schedule_meeting (priority 8) beats ¬schedule_meeting
3. Resource check: schedule_meeting conflicts with schedule_workout
4. Final: adopt schedule_meeting(client_A, 2pm), reject others

**Novice Miss**: Would use only negation-by-failure, missing the explicit aversion
**Expert Catch**: Recognizes explicit negative desires as different from mere absence

### Example 3: Commitment Persistence Under Temptation

**Scenario**: Study assistant maintains focus intention despite social media desires.

```prolog
% Committed intentions (established through previous deliberation)
committed_intention(study_mathematics, until(exam_complete)).
committed_intention(¬use_social_media, until(study_session_end)).

% New desires arise
desire(check_facebook).
desire(browse_instagram).

% Commitment constraint check
viable_intention(X) :-
    desire(X),
    \+ conflicts_with_commitment(X).

conflicts_with_commitment(X) :-
    committed_intention(¬X, Until),
    \+ condition_met(Until).

% No trigger conditions met
trigger_deliberation :-
    (action_completed(_) ; deadline_reached(_) ; impossibility_detected(_)).

% Result: No deliberation triggered, maintain commitments
current_intentions(Result) :-
    \+ trigger_deliberation,
    findall(I, committed_intention(I, _), Result).
```

**Decision Process**:
1. New desires arise but no trigger condition met
2. Commitment constraints block social media desires
3. Study intentions persist without re-evaluation
4. Result: maintain current commitments, ignore tempting desires

**Novice Miss**: Would re-evaluate all desires, breaking commitment
**Expert Catch**: Commitment means NOT reconsidering unless specific triggers fire

## Quality Gates

- [ ] Contradiction detection implemented using paraconsistent semantics (can detect P ∧ ¬P without system failure)
- [ ] Explicit negation distinguished from negation-by-failure (can represent both "actively false" and "unknown")  
- [ ] Commitment persistence mechanism prevents arbitrary re-deliberation (intentions persist unless trigger conditions met)
- [ ] Abductive feasibility checking available for intention adoption (can detect missing preconditions before commitment)
- [ ] Trigger conditions explicitly specified for deliberation (action completion, deadlines, impossibility, higher-priority opportunities)
- [ ] Preference ordering integrated into revision procedure (guides search, doesn't post-filter all options)
- [ ] Belief and intention representations unified in same logical framework (enables integrated consistency checking)
- [ ] Minimal revision procedures prefer smaller changes to mental state (stability over arbitrary change)
- [ ] Resource conflict detection prevents incompatible simultaneous intentions (time, physical, logical constraints)
- [ ] Deliberation termination criteria prevent infinite reconsideration loops (commitment or explicit failure)

## NOT-FOR Boundaries

**This skill is NOT for**:
- **Pure theorem proving systems**: For formal verification without execution, use modal BDI logics instead
- **Reactive architectures**: For stimulus-response systems without deliberation, use `reactive-agent-patterns` instead  
- **Multi-agent negotiation**: For inter-agent protocols and communication, use `agent-communication-protocols` instead
- **Machine learning integration**: For learning-based goal adaptation, use `reinforcement-learning-agents` instead
- **Real-time hard constraints**: For systems where deliberation latency is unacceptable, use `real-time-agent-scheduling` instead
- **Distributed consensus**: For coordinating intentions across multiple agents, use `distributed-agent-coordination` instead

**Delegate to other skills when**:
- Agent needs to learn new goals → `goal-learning-systems`
- Multiple agents must coordinate plans → `multi-agent-planning`  
- Environment is fully observable and deterministic → `classical-planning-agents`
- Real-time performance critical → `anytime-reasoning-agents`