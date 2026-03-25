# Planning as Recursive Decomposition: Maintaining Coherence Across Time Scales

## The Coherence Problem

Language models can generate plausible moment-to-moment behavior, but without planning, agents sacrifice long-term coherence for local believability. The paper demonstrates this with a stark example: when prompted with Klaus's background and current time, the model suggests eating lunch at 12pm, then again at 12:30pm, and again at 1pm. "Optimizing for believability in the moment sacrifices believability over time" (p. 8-9).

This is the central challenge: how do agents maintain consistent behavior across hours and days when the language model only "sees" the immediate present through its context window?

**The solution**: Plans are future-oriented memory structures that constrain and guide behavior. Plans describe sequences of actions with locations, start times, and durations. They are stored in the memory stream, retrieved alongside observations and reflections, and used to condition moment-to-moment action generation.

With planning, Klaus's afternoon becomes coherent: "he has lunch at Hobbs Cafe while reading at 12pm, works on his research paper at the school library at 1pm, and takes a break for a walk in the park at 3pm" (p. 9).

## The Recursive Decomposition Architecture

The planning system operates **top-down**, creating increasingly detailed plans through recursive decomposition:

### Level 1: Daily Plan (Broad Strokes)

The agent generates a high-level plan for the full day, typically divided into 5-8 major chunks. The prompt provides:
- Agent's summary description (identity, traits, recent experiences)
- Previous day's summary
- Current date

**Example prompt structure**:
```
Name: Eddy Lin (age: 19)
Innate traits: friendly, outgoing, hospitable
[Summary of character and current situation]

On Tuesday February 12, Eddy 1) woke up and completed 
morning routine at 7:00 am, [...] 6) got ready to sleep 
around 10 pm.

Today is Wednesday February 13. Here is Eddy's plan 
today in broad strokes: 1)
```

**Generated output**:
1. Wake up and complete morning routine at 8:00 am
2. Go to Oak Hill College to take classes starting 10:00 am
3. [...]
5. Work on new music composition from 1:00 pm to 5:00 pm
6. Have dinner at 5:30 pm
7. Finish school assignments and go to bed by 11:00 pm

This high-level plan captures the day's structure without over-specifying details that may change.

### Level 2: Hourly Decomposition

The system recursively decomposes each high-level block into hour-long chunks. "Work on new music composition from 1:00 pm to 5:00 pm" becomes:
- 1:00 pm: Start by brainstorming ideas for the music composition
- 2:00 pm: Develop the melody and chord progressions
- 3:00 pm: Refine the composition structure and transitions
- 4:00 pm: Take a quick break and recharge before reviewing and polishing

### Level 3: Minute-Level Actions

Hour-long chunks are further decomposed into 5-15 minute actions:
- 4:00 pm: Grab a light snack (fruit, granola bar, or nuts)
- 4:05 pm: Take a short walk around workspace
- [...]
- 4:50 pm: Take a few minutes to clean up workspace

This creates a **three-level hierarchy**: day → hours → minutes, with each level providing structure for the level below.

## Why Recursive Decomposition Works

### 1. Hierarchical Commitment

Agents commit strongly to high-level plans (the day's structure) while remaining flexible about low-level details (exact actions within each hour). This mirrors human planning: you know you'll "work on the project this afternoon" without knowing exactly which file you'll edit at 3:47 pm.

**Key insight**: Different time scales require different levels of specificity. Over-planning creates brittleness; under-planning creates incoherence.

### 2. Just-In-Time Detail Generation

The system only generates fine-grained plans for the near future. From a 4-hour block, it generates hour-level plans. As each hour approaches, it generates minute-level plans. This is computationally efficient and mirrors human cognition—we don't plan every minute of next week.

**Implementation note**: The paper states they "only generate the high-level plan in advance and then recursively decompose the near future into the moment-to-moment action plan just in time" (p. 21). This prevents accumulating stale low-level plans.

### 3. Memory Integration

Plans are stored in the memory stream alongside observations and reflections. When the retrieval function selects memories to condition the next action, plans are included. This means:
- Current actions are informed by planned intentions
- Observations can trigger replanning when they conflict with plans
- Reflections about goals influence plan generation

The plan is not separate from memory—it's a specialized type of future-oriented memory.

### 4. Location Grounding

Each plan item specifies not just *what* the agent will do but *where*. "For 180 minutes from 9am, February 12th, 2023, at Oak Hill College Dorm: Klaus Mueller's room: desk, read and take notes for research paper."

This grounding ensures:
- Physical coherence (agents don't teleport)
- Environmental awareness (choosing appropriate locations)
- Social coordination (agents can anticipate where others will be)

The paper describes an algorithm for traversing the environment tree to select appropriate locations, recursively choosing areas until reaching a leaf node (specific object in specific room).

## Reacting and Replanning: The Plan-Observation Loop

Plans are not rigid scripts—agents continuously monitor observations and decide whether to continue or react.

### The Reaction Decision

At each time step, the agent:
1. Perceives the environment (generates observations)
2. Retrieves relevant memories (including the current plan)
3. Prompts the language model: "Should [agent] react to the observation, and if so, what would be an appropriate reaction?"

**Example from paper**: John sees his son Eddy taking a walk in the garden. The context includes John's summary description and retrieved memories about Eddy (he's working on a music composition, he likes to walk when thinking about music).

**Output**: "John could consider asking Eddy about his music composition project."

**Key architectural decision**: The prompt includes not just the observation but also:
- Agent's summary (goals, personality)
- Relationship context (retrieved via query "What is [observer]'s relationship with [observed entity]?")
- Action context (retrieved via query "[Observed entity] is [action status]")

This grounds the reaction decision in the agent's identity, relationships, and understanding of the situation.

### Regenerating Plans

When an agent decides to react (or when observations significantly contradict the plan), the system regenerates the plan starting from the current moment. The old plan is not deleted—it remains in memory—but new plan items are generated that account for the reaction.

**Example**: If Eddy's father John initiates a conversation, Eddy's plan to "take a short walk" is interrupted. The system generates a new plan: "have a conversation with father about music composition," followed by revised plans for the rest of the hour.

This creates **dynamic replanning** where agents balance commitment to plans with flexibility to respond to circumstances.

### The Balance Between Commitment and Flexibility

Too much commitment: The agent becomes robotic, ignoring important environmental cues and social opportunities.

Too much flexibility: The agent becomes reactive and incoherent, with no sustained pursuit of goals.

The paper's architecture balances these through:
1. **Hierarchical plans** (easier to preserve high-level goals while adjusting low-level actions)
2. **Importance-weighted interruptions** (only react to significant observations)
3. **Plan regeneration from current time** (preserve future structure while adapting present)

## Failure Modes in Planning

The paper's end-to-end evaluation identifies planning failures:

### 1. Location Selection Drift

As agents learn about more locations, the action space for "where should I do X?" grows. Without strong constraints, agents choose implausible locations: "some agents chose less typical locations for their actions, potentially making their behavior less believable over time... agents opted to go [to the bar for lunch] instead for lunch, even though the bar was intended to be a get-together location for later in the day" (p. 14-15).

**Why this happens**: The retrieval function surfaces locations based on recency, importance, and relevance. If an agent recently heard about the bar and it's semantically relevant to "eating," it may be retrieved over the more appropriate cafe.

**Design implication**: Location affordances need explicit representation. The prompt should include constraints like "cafes are for daytime meals; bars are for evening socializing."

### 2. Temporal Constraint Violations

Agents sometimes plan actions at closed locations: "agents in Smallville may not realize that certain places are closed after a certain hour and still decide to enter them. For instance, the stores in Smallville all close around 5 pm, but occasionally, a few agents enter the store after 5 pm" (p. 15).

**Why this happens**: Store hours are implicit world knowledge, not explicitly represented in the environment state or agent memory.

**Design implication**: Time-dependent affordances should be part of the environment tree representation retrieved during planning.

### 3. Social Norm Misunderstanding

Agents misclassified what's appropriate in certain spaces: "the college dorm has a bathroom that can only be occupied by one person despite its name, but some agents assumed that the bathroom is for more than one person because dorm bathrooms tend to support multiple people concurrently and choose to enter it when another person is inside" (p. 15).

**Why this happens**: Language models encode statistical patterns from training data (dorm bathrooms are often multi-person). The specific constraint (this particular bathroom is single-person) is not clearly represented.

**Design implication**: Specific constraints should override general priors, possibly through explicit state descriptions like "one-person bathroom" rather than "dorm bathroom."

## Implications for Agent Orchestration Systems

### Task Decomposition in WinDAGs

The recursive decomposition pattern directly applies to complex task orchestration:

**Top-level goal**: "Implement a new authentication system"

**High-level decomposition** (day-level):
1. Research authentication best practices
2. Design system architecture
3. Implement core authentication logic
4. Add security tests
5. Integrate with existing codebase
6. Deploy and monitor

**Mid-level decomposition** (hour-level) for "Implement core authentication logic":
1. Set up token generation system
2. Implement token validation
3. Create user session management
4. Add error handling
5. Write unit tests

**Low-level decomposition** (minute-level) for "Set up token generation system":
1. Import cryptographic libraries
2. Define token structure
3. Implement signing function
4. Add expiration logic
5. Create token refresh mechanism

The key insight: **generate detail just-in-time**, not all at once. The system generates the full high-level plan, but only decomposes the currently-active high-level task into mid-level tasks, and only decomposes the currently-active mid-level task into concrete actions.

### Dynamic Replanning Under Constraints

When agents encounter obstacles (dependencies fail, requirements change, errors occur), the replanning mechanism applies:

1. **Observe the problem** (failed test, missing dependency)
2. **Retrieve context** (what was I trying to accomplish? what constraints exist?)
3. **Decide whether to replan** (is this a minor issue or a fundamental blocker?)
4. **Regenerate plan from current point** (preserve high-level goals, adjust low-level approach)

The paper's architecture suggests: **don't throw away the whole plan when something breaks—regenerate from the current moment while preserving future structure**.

### Multi-Agent Coordination Through Shared Plans

The paper demonstrates emergent coordination: Isabella plans a party, other agents plan to attend. This happens because:
1. Agents share information about plans through dialogue
2. When one agent hears about another's plan, they can incorporate it into their own planning
3. Multiple agents' plans converge on the same time and place

For orchestration systems, this suggests:
- Agents should be able to query others' plans ("what are you working on?")
- Plan visibility enables coordination without central control
- Conflicts (two agents need the same resource) can be detected by comparing plans

### The Cached Summary Optimization

The paper describes an important optimization (Appendix A): many prompts require a concise agent summary, so the system **caches** a synthesized summary updated periodically.

The cached summary includes:
- Core characteristics (retrieved via "[name]'s core characteristics")
- Current occupation (retrieved via "[name]'s current daily occupation")
- Self-assessment (retrieved via "[name]'s feeling about recent progress")

This is regenerated by prompting the language model to summarize retrieved memories, then the summary is stored and reused across many prompts.

**Design principle**: When information is used repeatedly in prompts, synthesize it once and cache it rather than regenerating each time. This is especially important for agent identity, which underlies almost every decision.

## Boundary Conditions: When Planning Fails

### Uncertainty and Incomplete Information

The paper's agents operate in a fully-observable simulation where plans can be made with confidence. Real-world agents face uncertainty:
- Will the API I depend on be available?
- Will the user provide the information I need?
- Will the assumptions I'm making hold true?

**Extension needed**: Plans should include **contingencies** ("if X fails, try Y") and **information-gathering actions** ("first check whether X is possible").

### Parallelism and Resource Contention

The paper's agents execute plans sequentially. Real systems need:
- Parallel execution of independent subgoals
- Resource awareness (can't allocate the same compute to two tasks)
- Dependency tracking (can't start task B until task A completes)

**Extension needed**: Plans should be represented as **DAGs** (directed acyclic graphs) of tasks with dependencies, not just linear sequences.

### Collaborative Planning

The paper shows emergent coordination but not explicit collaborative planning. When multiple agents work toward shared goals, they need:
- Joint plan generation (negotiating who does what)
- Plan synchronization (aligning timelines)
- Responsibility assignment (clear ownership of subtasks)

**Extension needed**: Prompts for plan generation should include context about other agents' plans and capabilities.

## The Deeper Insight on Temporal Abstraction

The recursive decomposition architecture embodies a fundamental principle: **coherent behavior across time requires hierarchical temporal representation**.

Humans don't plan at a single time scale—we have:
- Life plans (years): "I want to become a researcher"
- Project plans (months): "I'll finish this paper by April"
- Daily plans (day): "I'll work on the introduction this morning"
- Action plans (minutes): "First I'll review my notes, then outline the argument"

Each level provides structure and constraints for the level below. Each level operates at an appropriate granularity—we don't plan decades in 5-minute intervals, and we don't plan the next hour in year-long chunks.

The paper's contribution is showing this hierarchy can be implemented through:
1. **Top-down decomposition prompts** that break high-level goals into lower-level actions
2. **Just-in-time detail generation** that only expands the immediately relevant portions of the plan
3. **Memory integration** that treats plans as a special class of memory retrieved alongside observations and reflections
4. **Dynamic replanning** that preserves hierarchical structure while adapting to observations

For agent system designers, this suggests: **represent time hierarchically**, generate plans **top-down**, expand detail **just-in-time**, and **replan from the current moment** while preserving future structure.

Plans are not scripts to execute—they are memory structures that guide behavior while remaining open to revision. The art is in balancing commitment (maintaining coherence) with flexibility (responding to reality).