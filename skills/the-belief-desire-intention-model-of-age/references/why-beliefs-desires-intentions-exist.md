# Why Beliefs, Desires, and Intentions Must Exist as Separate Components

## The Architectural Necessity Argument

Most treatments of the BDI model begin with philosophy—Bratman's theory of practical reasoning, folk psychology, or logical semantics. This is backwards. The profound insight in Georgeff's panel response is that beliefs, desires, intentions, and plans are not philosophical preferences but computational necessities. Any system meeting specific operational constraints must implement these components, regardless of whether it calls them by these names or acknowledges their existence.

## The Four Constraints That Force BDI Architecture

Georgeff identifies four constraints that together necessitate the BDI architecture:

1. **Dynamic environments**: The world changes while the system operates
2. **Local/partial information**: The system cannot perceive everything
3. **Resource bounds**: Computation and memory are finite
4. **Real-time requirements**: Decisions must be made within time constraints

Each constraint individually forces specific architectural features. Together, they necessitate the full BDI structure.

### Why Beliefs Must Exist

**The computational problem**: In a dynamic environment with partial observability, the system faces two information loss mechanisms:
- Events outside the perceptual sphere occur but aren't directly sensed
- Past events that were perceived are no longer in the present sensory stream

**The necessity**: Without some memory of past perceptions and inferences about unobserved states, the system must either (a) limit action to purely reactive responses to current stimuli, or (b) repeatedly re-sense or re-compute the same information.

Georgeff: "Beliefs are essential because the world is dynamic (past events need therefore to be remembered), and the system only has a local view of the world (events outside its sphere of perception need to be remembered). Moreover, as the system is resource bounded, it is desirable to cache important information rather than recompute it from base perceptual data."

**For agent systems**: This means every agent, regardless of architecture, must maintain some form of state that represents:
- Previously perceived facts that remain relevant
- Inferences about parts of the world not directly observable
- Cached computations that would be expensive to regenerate

The computational representation doesn't matter—relational database, key-value store, neural network activations, or logical predicates. What matters is that this component exists as a distinct, queryable, updatable structure. Systems that claim to be "purely reactive" either (a) are actually maintaining hidden state in the environment itself, (b) have extremely limited capabilities, or (c) are operating in environments so information-rich that the perceptual stream contains all necessary state.

### Why Desires/Goals Must Exist

**The computational problem**: How does a system recover from failures or exploit unexpected opportunities?

Conventional software is **task-oriented**: it executes procedures without representing why those procedures are being executed. When a called function fails, control returns to the caller, but the system has no automatic mechanism to:
- Understand what the failed task was trying to achieve
- Generate alternative approaches to achieve the same end
- Recognize when an alternative opportunity makes the original task unnecessary

**The necessity**: Georgeff provides the concrete example: "the reason we can recover from a missed train or unexpected flat tyre is that we know where we are (through our Beliefs) and we remember to where we want to get (through our Goals)."

**For agent systems**: Goal-explicit representation enables:

1. **Automatic failure recovery**: When a plan step fails, the system can search for alternative means to the same end without programmer-specified exception handlers for every possible failure mode.

2. **Opportunistic replanning**: If an unexpected event achieves a goal "for free" (the train we're rushing to catch gets delayed, giving us extra time), the system can recognize this and stop executing now-unnecessary actions.

3. **Intention drop**: When a goal becomes unachievable or irrelevant, the system can abandon all plans and subplans directed toward that goal, even if they're deeply nested in the execution stack.

The key insight: in dynamic environments, the reasons for actions change faster than the actions themselves complete. Goal-explicit representation lets the system reason about this semantic layer separately from the procedural layer.

### Why Intentions Must Exist (The Commitment Problem)

**The computational problem**: Given beliefs about the world and goals to achieve, when should the system:
- Generate a new plan?
- Continue executing the current plan?
- Modify the current plan?

**The false dichotomy**: Classical decision theory says "always replan for optimality." Conventional software says "never replan—commit to the plan forever." Both are computationally disastrous.

**The empirical proof**: Georgeff cites Kinny and Georgeff's experiment with simulated robots collecting points in a dynamic grid environment. The graph shows efficiency (y-axis) versus rate of environmental change (x-axis):

- **Cautious agent** (replans at every change, classical decision theory): Wastes computational resources constantly replanning. Efficiency tanks as change rate increases because it spends more time planning than acting.

- **Bold agent** (commits to plans, reconsiders only at crucial moments): Maintains higher efficiency across a wider range of change rates because it invests appropriate computational resources in planning versus execution.

- **Task-oriented agent** (commits forever, never shown but implied): Works when environments are static but fails catastrophically when change rate increases—cannot recover from failures or adapt to opportunities.

**The necessity**: "Neither classical decision theory nor conventional task-oriented approaches are appropriate—the system needs to commit to the plans and subgoals it adopts but must also be capable of reconsidering these at appropriate (crucial) moments."

Intentions are **committed plans**—plans the system has decided to execute and will continue executing unless specific reconsideration conditions are met. They represent a third computational state, distinct from:
- Beliefs (what is true)
- Desires (what outcomes are wanted)
- Plans (what procedures are known)

**For agent systems**: Intentions solve the commitment-reconsideration trade-off by:

1. **Filtering subsequent deliberation**: Once committed to an intention, the agent constrains which options it will consider next, avoiding the combinatorial explosion of reconsidering everything.

2. **Providing stability**: The agent can make multi-step plans that depend on earlier steps actually being completed, rather than being reconsidered at every moment.

3. **Enabling coordination**: In multi-agent systems, intentions can be communicated to others, who can then plan around them. This only works if intentions have some stability (are not instantly abandoned).

4. **Focusing computation**: Resource-bounded agents must allocate limited reasoning capacity. Intentions focus reasoning on refining and executing committed plans rather than endlessly exploring alternatives.

Computationally, intentions might be "executing threads" or "active procedures" or "focus-of-attention markers"—but they must exist as a distinct category that can be **interrupted upon specific conditions** while providing **commitment between interruptions**.

### Why Plans Must Exist Separately

**The computational problem**: If the system can generate plans from first principles (beliefs + goals → planning procedure → new plan), why cache plans at all?

**The necessity**: "For the same reasons the system needs to store its current Intentions (that is, because it is resource bound), it should also cache generic, parameterized Plans for use in future situations (rather than try to recreate every new plan from first principles)."

**For agent systems**: Cached plans (what BDI systems call "plan libraries") are:

1. **Compiled expertise**: Plans that worked in similar past situations, avoiding regenerating the same solution.
2. **Parameterized procedures**: Abstract plans instantiated with specific bindings for new situations.
3. **Efficiently indexed**: Organized by preconditions and goals for rapid retrieval.

This is why PRS-like systems have large plan libraries: they're not just representing "knowledge" but providing computational efficiency through caching.

## The Unified Argument

The four constraints (dynamic, partial, bounded, real-time) together create a system that must:

- **Remember** (beliefs) because it cannot constantly re-perceive or re-compute
- **Know why** (desires) because the world changes faster than plans complete
- **Commit strategically** (intentions) because optimal replanning is intractable but no replanning is brittle
- **Reuse solutions** (plans) because generating from scratch is too expensive

These aren't four independent features but a tightly integrated architecture where each component enables the others:

- Beliefs ground desires (goals must be about something in the world)
- Desires motivate intentions (commitments serve purposes)
- Intentions constrain belief updates (relevant belief changes are those that affect committed plans)
- Plans connect desires to intentions (achieving goals requires procedures)

## Implications for Agent System Design

### 1. Architectural Validation Test

Any proposed agent architecture can be evaluated by asking: where are beliefs, desires, intentions, and plans represented? If the answer is "they don't exist separately" or "they're mixed together," the architecture likely has fundamental limitations in dynamic, uncertain environments.

### 2. The "Stateless Agent" Myth

Some modern agent frameworks claim to be "stateless" or "purely reactive." Under Georgeff's analysis, these systems either:
- Are severely limited in capability (cannot plan beyond one step)
- Are hiding state in external storage (database, context, environment)
- Are not actually operating under the four constraints (operating in such information-rich environments that the current sensory/input stream contains all necessary state)

### 3. LLM-Based Agents and BDI

Modern LLM-based agents often lack explicit BDI structure:
- Beliefs are implicit in conversation history
- Desires are in prompts but not separately tracked
- Intentions don't exist—each call to the LLM potentially reconsiders everything
- Plans are generated but not cached in a reusable library

This explains common failure modes:
- **Context window limitations** force forgetting beliefs
- **Lack of goal persistence** means agents don't recover from failures or recognize when goals are achieved
- **No commitment** means thrashing between alternatives
- **Regenerating plans from scratch** wastes tokens and time

Adding explicit BDI structure to LLM-based agents means:
- Maintaining a separate, queryable belief store (not just conversation history)
- Tracking goals explicitly so they survive context window limitations
- Marking some plans as "committed intentions" that aren't reconsidered without explicit triggers
- Building a library of successful plans (with natural language descriptions) for reuse

### 4. Debugging Principles

When an agent system fails, BDI structure provides diagnostic categories:

- **Belief failures**: Wrong model of world state
- **Desire failures**: Wrong or conflicting goals
- **Intention failures**: Committed to wrong plan or failed to reconsider when should have
- **Plan failures**: Procedure doesn't achieve desired effect or has wrong preconditions

Without explicit separation, all failures look like "the system did the wrong thing."

### 5. The Crucial Moment Problem

Georgeff's argument proves intentions must exist but doesn't solve the central remaining problem: **when should intentions be reconsidered?**

The paper mentions "crucial moments" but doesn't define them precisely. This remains the key research question: what computational triggers should cause an agent to:
- Pause execution of current intentions
- Assess whether they remain valid
- Potentially replan

This is where different BDI implementations diverge and where domain expertise matters most.

## Boundary Conditions

### When BDI Structure Isn't Necessary

The architectural necessity argument depends on all four constraints holding:

1. **Static environments**: If nothing changes, task-oriented software works fine. No need for goal-explicit representation or strategic commitment.

2. **Perfect information**: If everything is observable, beliefs reduce to current sensory state. No need for inference or memory beyond immediate perception.

3. **Unlimited resources**: If computation is free, classical decision theory's "always replan" works. No need for strategic commitment.

4. **No time pressure**: If decisions can wait indefinitely, search through all possibilities becomes feasible. No need for commitment-based filtering.

Many traditional software applications operate under relaxed versions of these constraints, which is why conventional programming paradigms work for them.

### When BDI Structure Isn't Sufficient

BDI architecture is necessary but not sufficient for:

- **Learning**: BDI says nothing about how plans get into the plan library or how they improve
- **Social reasoning**: Basic BDI is single-agent; extensions needed for coordination, communication, negotiation
- **Continuous control**: BDI naturally handles discrete action selection; continuous control requires additional machinery
- **Probabilistic reasoning**: Basic BDI is symbolic; handling uncertainty requires extensions (probabilistic beliefs, utility-based desires)

## Conclusion

The profound contribution of Georgeff's argument is shifting BDI from philosophical preference to engineering necessity. Just as databases need transactions because of concurrency constraints, or distributed systems need consensus protocols because of network partitions, agents need beliefs-desires-intentions-plans because of dynamic-partial-bounded-realtime constraints.

This isn't about whether to use BDI. It's about recognizing that any system operating under these constraints is implementing BDI components whether it calls them that or not. The question is whether to make this structure explicit and well-engineered, or leave it implicit and tangled.

For WinDAG agent orchestration: every skill invocation, every task decomposition, every coordination decision happens under these four constraints. The system must maintain beliefs about task state, desires about outcomes, intentions about which DAG paths to execute, and plans about how skills compose. Making this structure explicit—rather than implicit in code or prompts—is the path to reliable, debuggable, adaptive agent systems.