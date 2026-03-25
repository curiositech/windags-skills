# Decomposition Rules as Generalized Task Knowledge: Beyond Example-Based Learning

## The Fundamental Problem with Examples

In-context learning (ICL) has been the dominant paradigm for adapting LLMs to specific tasks: provide a few carefully curated examples showing input-output pairs, and the model learns by analogy. The HyperTree Planning paper exposes a fundamental limitation of this approach that has profound implications for agent system design.

The problem isn't that examples don't work—they clearly do in many contexts. The problem is **brittleness arising from structural specificity**. When you provide an example of planning a 3-day trip from San Jose to Los Angeles, you're showing:
- Specific cities (SJ, LA)
- Specific duration (3 days)
- Specific constraint types (budget, preferences)
- Specific solution structure (Day 1: city A, Day 2: city B, etc.)

The model must simultaneously learn the general planning pattern AND abstract away from these specifics. The paper demonstrates this tension empirically: one-shot learning achieves only 4.4% success rate on TravelPlanner compared to 20.0% for HTP using the same backbone model (GPT-4o). The **4.5× performance gap represents the cost of structural abstraction failure**.

## What Makes Rules Different From Examples

Decomposition rules represent a categorically different form of knowledge. Consider the TravelPlanner rule:

```
[Plan] -> [Transportation][Accommodation][Attraction][Dining]
```

This encodes several pieces of abstract knowledge:
1. **Structure**: A travel plan consists of four separable concerns
2. **Independence**: These concerns can be addressed in parallel (order doesn't matter for decomposition)
3. **Completeness**: These four categories cover the planning space for travel
4. **Abstraction**: This applies regardless of specific cities, durations, or constraints

Crucially, this rule contains **zero instance-specific information**. It works equally well for:
- 3-day trip, Houston → Nashville (2 cities)
- 7-day trip, Fort Lauderdale → 3 Georgia cities (4 cities)
- International multi-country tour (n cities)

The rule defines the **invariant structure** across all instances of the problem class. This is fundamentally different from an example, which shows one specific instantiation of that structure.

## The Rule Hierarchy: Multi-Level Decomposition Patterns

The sophistication of HTP's rule system becomes clear when examining the full hierarchy. For TravelPlanner:

**Level 1 - Domain Decomposition**:
```
[Plan] -> [Transportation][Accommodation][Attraction][Dining]
```

**Level 2 - Category Expansion**:
```
[Transportation] -> {{Specific segments of transportation}}
[Accommodation] -> {{Specific accommodation for each city}}
```

**Level 3 - Option Enumeration**:
```
[transportation from A to B] -> [Self-driving][Taxi][Flight]
```

**Level 4 - Constraint Application**:
```
[Self-driving] -> [availability][preference][cost][non-conflicting]
[Flight] -> [availability][preference][cost][non-conflicting]
```

This hierarchy encodes expert knowledge about travel planning: you first separate concerns (transportation vs. lodging vs. activities), then instantiate based on trip specifics (how many city-to-city segments?), then enumerate options for each instance (what transportation modes exist?), then evaluate each option against constraints (which ones are feasible and preferred?).

Critically, **rules at different levels activate based on context**. The Level 4 rules for evaluating flight options only become relevant once you've decomposed down to the specific segment level. This **conditional activation** based on reasoning state isn't possible with flat example-based learning.

## Divisibility as Meta-Knowledge

The concept of "divisible nodes" adds another layer of sophistication. The rule system doesn't just specify decompositions—it specifies **what CAN be decomposed**. From the TravelPlanner appendix:

**Divisible Nodes**:
```
[Plan]; [Transportation]; [Taxi]; [Self-driving]; [Flight]; 
[Accommodation]; [Attraction]; [Dining];
{{Specific segment of transportation}};
{{Specific accommodation for one city}};
{{Specific dining for one city}}
```

**Leaf Nodes (Indivisible)**:
```
[transportation availability]; [transportation preference]; 
[transportation cost]; [house rule]; [room type]; 
[accommodation cost]; [minimum stay]; [cuisine]; [dining cost];
{{specific attraction for one city}}
```

This meta-knowledge defines **recursion boundaries**. The system knows that `[Flight]` can be further decomposed into constraint checks, but `[transportation availability]` is an atomic task requiring direct knowledge lookup. This prevents infinite regress and signals when to shift from planning mode to execution mode.

For agent systems, this distinction is critical. Divisible nodes correspond to **strategic/tactical decisions** that benefit from further decomposition. Leaf nodes correspond to **operational actions** that should be executed directly. The rule system encodes the boundary between "thinking" and "doing."

## Rule Generalization vs. Example Matching

The paper provides empirical evidence that rules generalize better than examples through the comparison with HiAR-ICL (High-level Automated Reasoning Paradigm in In-Context Learning). HiAR-ICL attempts to abstract away from examples by providing "reasoning patterns formed by permutations of five fixed actions" rather than complete examples.

Results on TravelPlanner with GPT-4o:
- One-shot learning: 3.9% success
- HiAR-ICL: 6.7% success  
- HTP (rules): 20.0% success

HiAR-ICL's improvement over one-shot (1.7×) is dwarfed by HTP's improvement (5.1×). The paper explains why: "Due to the chain-like structure of the patterns, they cannot fully support the hierarchical thinking needed for planning."

This reveals a crucial insight: **the structure of the abstraction matters as much as abstraction itself**. HiAR-ICL abstracts from specific examples to patterns, but maintains a linear (chain-like) structure. HTP's rules enable hierarchical structure. The 3× performance gap between HiAR-ICL and HTP represents the value of **structural abstraction** beyond content abstraction.

## Domain-Specific vs. Domain-General Rules

An important subtlety: the rules shown are domain-specific (TravelPlanner rules differ from Blocksworld rules), but **within-domain generalization is complete**. The same TravelPlanner rules handle:
- Easy/medium/hard difficulty levels
- 3-day/5-day/7-day trip durations  
- 2-city to 4-city itineraries
- Different combinations of constraints

The paper demonstrates this through the results breakdown by trip duration (Figure 4): HTP maintains relatively consistent performance across 3-day (55-60%), 5-day (35-45%), and 7-day (25-35%) trips, while baseline methods show severe degradation (often dropping to 0% on 7-day trips).

This within-domain generalization is possible because the rules encode the **invariant structure of the problem class**, not instance-specific patterns. The question for agent system design: how do we identify these invariant structures?

## Rule Acquisition: The Bootstrap Problem

The paper doesn't deeply address how decomposition rules are initially created—they appear to be hand-crafted by domain experts. The TravelPlanner rules in Appendix E.1 are sophisticated, encoding nuanced understanding like:

```
[Transportation from A to B] -> [Self-driving][Taxi][Flight]
# The transportation mode for each segment can be choose from 
# self-driving, taxi, and flights.
```

This specifies not just the structure but the **semantic meaning** of the decomposition. Creating such rules requires understanding:
1. What the relevant option categories are (self-driving/taxi/flight, not just "transportation")
2. That these options are mutually exclusive alternatives (not parallel concerns)
3. The appropriate level of granularity (not decomposing further into "car color" or aggregating up to "get from A to B somehow")

For established domains like travel planning or blocksworld, expert knowledge exists. But for novel problems, rule acquisition becomes the bottleneck. The paper acknowledges this limitation: "The rules R must be defined for each task domain... creating these rules initially requires domain understanding."

This suggests a research direction for agent systems: **meta-learning of decomposition rules**. Could an LLM, given multiple examples of successful problem solutions, induce the underlying decomposition rules? This would combine the generalization power of rules with the flexibility of example-based learning.

## Rules as Coordination Mechanisms

Beyond individual agent reasoning, decomposition rules serve a crucial coordination function in multi-agent systems. When the rule specifies:

```
[Plan] -> [Transportation][Accommodation][Attraction][Dining]
```

This implicitly defines **agent assignments** or **skill invocations**. You can assign:
- Agent 1: Handle all Transportation sub-tasks
- Agent 2: Handle all Accommodation sub-tasks
- Agent 3: Handle Attraction and Dining sub-tasks

The rule structure ensures these agents work on **independent sub-problems** that don't require continuous synchronization. They only need to integrate results at the end, when combining branches into the final plan.

Compare this to approaches like MetaGPT or EvoAgent, which require manually defining agent personas and interaction protocols for each task. The paper shows EvoAgent achieves 8.9% success on TravelPlanner vs. HTP's 36.1% (4.06× improvement). The difference: EvoAgent's coordination is example-specific and must be redesigned for each problem instance, while HTP's coordination emerges naturally from the rule structure.

## Constraint Propagation Through Rules

The rule hierarchy also defines how constraints propagate through the reasoning process. Consider the TravelPlanner constraint "no self-driving":

**Top-level rule activation**: `[Plan] -> [Transportation][Accommodation][Attraction][Dining]` - constraint doesn't apply here

**Category expansion**: `[Transportation] -> {{Specific segments}}` - constraint propagates to all segments

**Option enumeration**: `[segment from A to B] -> [Self-driving][Taxi][Flight]` - constraint FILTERS this set, removing [Self-driving]

**Constraint evaluation**: Only `[Taxi]` and `[Flight]` branches are created and evaluated

This **hierarchical filtering** is more efficient than flat constraint checking. You don't evaluate self-driving availability and cost if the constraint has already eliminated self-driving as an option. The rule structure defines where in the hierarchy each constraint type applies.

For agent systems with 180+ skills, this has implications for skill routing and filtering. Rather than evaluating all skills for relevance to every sub-task, the decomposition rules can define **skill categories** that activate at different hierarchy levels. Transportation-related skills only activate in the Transportation branch; accommodation skills only in the Accommodation branch.

## Failure Modes: When Rules Break Down

The ablation study reveals what happens when the rule-based approach fails:

**Removing the division module** (which supports hierarchical decomposition using rules):
- TravelPlanner: 20.0% → 6.1% success (3.3× degradation)
- Blocksworld: 54.7% → 37.2% success (1.5× degradation)

This is the most severe degradation of any ablation, exceeding the impact of removing selection, decision, or self-guided planning modules. It demonstrates that **the rule-based hierarchical structure is the primary driver of performance**.

However, **rules can be inappropriate for the problem structure**. If a problem genuinely requires integrated reasoning across concerns (rather than separable decomposition), the rule-based approach may be counterproductive. The paper's focus on planning tasks, which naturally decompose into independent concerns, may overstate the general applicability.

Additionally, **rules can be incomplete or misspecified**. If the TravelPlanner rules omitted `[Dining]` as a decomposition category, the system would never consider restaurant selection. The quality of the rule set determines the ceiling of system performance, independent of model capability.

## Practical Implications for Agent Orchestration

For a system like WinDAGs with 180+ skills, the rule-based approach suggests:

**1. Skill Taxonomy as Decomposition Rules**: Organize skills into hierarchical categories that mirror problem structure. Rather than a flat list of 180 skills, create a rule structure like:

```
[Software Development Task] -> [Requirements][Architecture][Implementation][Testing]
[Implementation] -> [Frontend][Backend][Database][API]
[Backend] -> {{Specific services}}
[Service] -> [Design][Code][Review][Deploy]
```

Each level corresponds to different skill types, automatically routing sub-tasks to appropriate skill sets.

**2. Dynamic Rule Selection**: Rather than hand-coding rules for every possible task type, maintain a library of rule templates (planning rules, analysis rules, design rules, etc.) and have an orchestrator LLM select and instantiate the appropriate template based on the initial query.

**3. Rule Learning from Execution**: Track which decomposition patterns lead to successful task completion. Over time, learn which rules generalize and which need refinement. This converts the rule system from static to adaptive.

**4. Explicit Divisibility Markers**: Tag each skill with metadata indicating whether it's "divisible" (produces sub-tasks) or "atomic" (executes directly). This enables the orchestrator to automatically identify recursion boundaries without hard-coding them into the rule system.

**5. Constraint-Aware Rule Application**: Encode constraints not as post-hoc filters but as rule activation conditions. A "secure code review" constraint might alter which [Review] sub-branches are created, rather than filtering results after generation.

The core insight: **rules are not rigid constraints but flexible scaffolding**. They provide structure while allowing the specific instantiation to emerge from context. This is the key to combining generalization with specificity—the rules handle the former, the LLM handles the latter.