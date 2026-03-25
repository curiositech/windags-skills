# Mental Simulation as the Expert's Evaluation Method

## Beyond Abstract Scoring

When classical decision theory evaluates an option, it scores it: assign weights to criteria, rate the option on each criterion, multiply and sum. This is clean, auditable, and generalizable. It is also, according to Klein and Calderwood's field research, almost entirely absent from how experienced practitioners actually evaluate options in operational settings.

Expert practitioners evaluate options through **mental simulation**: they imagine the option being executed, watch it play out in their mind's eye, and look for failure points. If no failure appears, the option is viable. If a failure appears, the option is modified to avoid it, or rejected, and the next candidate is considered.

This is not the same as probability estimation. It is not the same as utility scoring. It is a qualitatively different cognitive operation — one that evaluates an option **in the context of its execution**, rather than against abstract, decontextualized criteria.

## The Rescue Commander Example

Klein and Calderwood's most detailed illustration of mental simulation in action: a rescue commander must free a semiconscious woman dangling from highway support poles. He doesn't generate a list of equipment options and score them on "ease of attachment," "speed," and "safety." Instead:

- He considers the Kingsley harness. He imagines attaching it. He sees the problem: she's semiconscious on her stomach, she'd need to be lifted to sitting position, everyone is balanced on narrow poles. He sees the failure point before it happens. He rejects this option.

- He considers attaching the harness from the back. He runs the simulation. He sees her back bending sharply during the lift. Another failure point. Rejected.

- He considers the Howd strap. Same problems emerge in simulation. Rejected.

- He considers the ladder belt. He runs the simulation: lift her an inch, slide the belt under, attach the buckle, tie the rope to the clasp. He runs it several times. No failure points appear. He orders the crew to use the ladder belt.

"Notice that several different options were considered but none was contrasted to another. Instead, each was examined for feasibility, and the first acceptable one was implemented."

This is the critical structure. Options are not compared to each other. Each is evaluated independently against the question: "Does this work, in this specific context, with these specific constraints?" The evaluation is done in simulation, not on a scoring matrix.

## Why Mental Simulation Is Superior to Abstract Scoring in Operational Settings

**1. Context Sensitivity**
Abstract scoring dimensions (safety, speed, resource cost, reversibility) are by definition general. They don't know about the specific constraints of this situation: the narrow poles, the semiconscious state of the victim, the weight distribution, the available crew positions. Mental simulation operates in full context. It automatically incorporates all of these specifics because the simulation is running in a mental model of the actual situation.

As Klein and Calderwood note: "Expertise often enables a decision maker to sense all kinds of implications for carrying out a course of action within a specific context, and this sensitivity can be degraded by using generic and abstract evaluation dimensions."

**2. Failure Mode Detection**
Abstract scoring tells you how good an option is on various dimensions. Mental simulation tells you **where it breaks**. These are different questions. For operational decision-making, the more important question is usually: "Is there a fatal flaw?" rather than "How does this score on a balanced set of criteria?" Simulation directly answers the fatal flaw question.

**3. Modification, Not Just Rejection**
When a failure point is discovered in simulation, the expert doesn't necessarily discard the option. They modify it to remove the failure point and re-run the simulation. This is a generative process — the simulation is not just evaluating a fixed option, it is a tool for option refinement. Abstract scoring cannot do this; it can only rank fixed options.

**4. Speed**
Running a mental simulation — even a complex one — can be done in seconds by an experienced practitioner. This is because the simulation runs on compressed, schematic representations of familiar situations, not on step-by-step logical analysis. It leverages the same pattern-recognition machinery that primes the initial option.

## Implications for Agent System Design

### Implementing Forward Simulation

The mental simulation process maps directly to a **forward planning and verification** capability. An agent evaluating a candidate action should:

1. Take the current situation model as the starting state
2. Project the action forward through expected state transitions
3. At each projected state, check for: resource availability, precondition satisfaction, consistency with situational expectancies, and potential failure modes
4. If a failure mode is detected, either modify the action to avoid it and re-simulate, or flag the action as infeasible and generate the next candidate

This is more than a plan validator. It is a plan refiner. The simulation should not just return pass/fail — it should return the specific failure mode, enabling targeted modification.

### Simulation Depth and Confidence

Not all simulations need to go to the same depth. An experienced agent with high-confidence situation recognition may need only a shallow simulation (checking the most likely failure points). An agent with low-confidence situation recognition needs deeper simulation — more steps forward, more alternative branches checked. Simulation depth should scale inversely with situation recognition confidence.

### Simulation as a First-Class Skill

In a WinDAGs-style orchestration system, **forward simulation should be a distinct, invokable skill** rather than a component embedded in individual action-execution skills. This enables:
- Explicit invocation of simulation before commitment to action
- Simulation by one agent of actions that will be executed by another
- Simulation results logged as artifacts for post-mortem analysis
- Simulation confidence scoring that feeds back into orchestration decisions

### Detecting Failure Modes Before Execution

The most valuable application of mental simulation in agent systems is **pre-execution failure detection**. Before committing to an action sequence, the system should simulate it and ask:
- Does this require resources that might not be available at the time of execution?
- Does this depend on system state that could change between planning and execution?
- Are there intermediate states in this sequence where the situation could change in a way that invalidates the rest of the plan?
- What is the worst-case state if this action fails midway through?

This is not optimistic planning. It is adversarial simulation — the system should be actively trying to find where its plan breaks before committing.

### The Modification Loop

When simulation reveals a failure point, the response should not be immediate rejection of the entire approach. The system should first attempt **targeted modification**: what minimal change to the action would eliminate the specific failure mode? If the modification doesn't introduce new failure modes (verified by re-simulation), the modified action is a better candidate than the original.

Only if modification fails to resolve the failure mode should the system move to the next candidate option. This mirrors the expert pattern exactly: modify first, reject only when modification fails.

## Mental Simulation in Multi-Step Tasks

For complex tasks with multiple sequential sub-goals, mental simulation operates at multiple time scales:

- **Micro-simulation**: Does this specific action work in the current state?
- **Meso-simulation**: Does this sub-sequence of actions achieve the sub-goal?
- **Macro-simulation**: Does the overall plan achieve the terminal goal given plausible variations in the environment?

Agent systems should be designed to support simulation at all three scales. Macro-simulation is particularly important in dynamic environments where early actions may close off later options — the simulation should check for option foreclosure, not just immediate feasibility.

## When Mental Simulation Fails

Mental simulation can fail in several ways:

**Simulation model mismatch**: If the agent's model of the execution environment is inaccurate, simulations will generate false confidence. An action that looks clean in simulation will fail in execution. This suggests that simulation results should be treated as hypotheses, not certainties — and that post-execution comparison of simulated vs. actual outcomes is crucial for model calibration.

**Failure mode outside the simulation horizon**: Some failures occur at steps the simulation didn't project far enough to reach. Time-limited simulations (common under operational pressure) may miss failures that occur late in an action sequence. For high-stakes, irreversible actions, simulation depth should be extended explicitly.

**Motivated simulation**: If the agent (or the agent's operators) are strongly motivated to find a particular option acceptable, the simulation may be subtly biased toward not finding failure points. In human decision-makers, this manifests as the tendency to mentally smooth over complications when imagining a preferred option. In agent systems, this can manifest as confirmation-biased simulation that stops when a plausible success path is found rather than continuing to probe for edge-case failures.