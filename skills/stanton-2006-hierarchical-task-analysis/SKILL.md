---
license: Apache-2.0
name: stanton-2006-hierarchical-task-analysis
description: Hierarchical Task Analysis methodology for decomposing complex tasks into structured subtask hierarchies
category: Cognitive Science & Decision Making
tags:
  - hta
  - task-analysis
  - hierarchical
  - methodology
  - human-factors
---

# Hierarchical Task Analysis (HTA) Skill

license: Apache-2.0
## Metadata
- **Skill Name**: Hierarchical Task Analysis
- **Source**: *Hierarchical Task Analysis: Developments, Applications and Extensions* by Neville A. Stanton
- **Domain**: Systems analysis, human factors, design methodology
- **Activation Triggers**: 
  - User mentions "task analysis," "goal decomposition," "system design," "error prediction"
  - Questions about breaking down complex work, designing training, or preventing failures
  - Requests for systematic analysis of human-system performance
  - Problems involving "how should this work?" vs. "how does this currently work?"

## When to Use This Skill

Load this skill when facing:

- **Complex system design challenges** where you need to understand what must be achieved before specifying how
- **Error-prone processes** requiring systematic identification of failure modes
- **Training design** where you need to specify what competence looks like
- **Interface design** where you need to understand information requirements at each decision point
- **Function allocation** decisions about what humans vs. automation should do
- **Team coordination** problems requiring clarity on who does what when
- **Over-specified processes** where procedures are bloated but performance still fails
- **"Why do people keep making this mistake?"** questions that suggest missing context or poor feedback
- **Analytical paralysis** where you can't decide what level of detail is sufficient

## Core Mental Models

### 1. Goal-Based vs. Task-Based Thinking
HTA describes **what the system must achieve** (goals), not what people currently do (tasks). A goal is measurable: "temperature maintained within 5°C of setpoint" not "operator monitors temperature." This distinction is profound:
- Goals are solution-neutral—multiple methods can achieve them
- Goals have success criteria—you can measure achievement
- Goals enable comparative analysis—current vs. proposed methods
- Goals reveal function—why this matters to the system

**The shift**: From "document what happens" to "specify what must be accomplished."

### 2. Plans as Coordination Intelligence
Plans are **control structures**, not sequences. They specify:
- **Conditions** for sub-goal activation (if X, then Y)
- **Contingencies** (if normal path blocked, alternative Z)
- **Parallel operations** (do A while monitoring B)
- **Exit criteria** (repeat until condition met)

Plans answer: "When does this matter? What triggers it? How do you know you're done?" They encode the contextual intelligence about goal relationships. Without plans, you just have a list. With plans, you have a control model.

### 3. The P×C Stopping Rule: Analytical Economy
Stop decomposing when **(Probability of inadequate performance) × (Cost of inadequate performance)** is acceptable. This principle:
- Directs analytical effort toward high-variance, high-consequence components
- Prevents over-specification of routine elements
- Maintains focus on system-critical goals
- Acknowledges that "adequate" is often sufficient

**The discipline**: Not "analyze everything to the same depth" but "analyze where failure matters most."

### 4. Three Governing Principles (The Theoretical Foundation)
1. **Operations are defined by goals measured in real terms** — not activities, but achievements with success criteria
2. **Operations decompose into sub-operations** — each with its own performance standard
3. **Relationships are hierarchical inclusion** — sub-goals contribute to superordinate goals; this is not mere temporal sequence

These principles prevent HTA from degenerating into procedural flowcharts. They maintain the discipline of goal-directed analysis.

### 5. HTA as Analytical Infrastructure
The sub-goal hierarchy is a **substrate for multiple analyses**, not an end product. Once you have the goal structure and plans:
- Add "information required" column → interface design
- Add "error modes" → SHERPA analysis
- Add "allocation" → human vs. automation decisions
- Add "training requirement" → curriculum design
- Add "coordination requirements" → team design

**The leverage**: Build the goal framework once, annotate it for many purposes.

## Decision Frameworks

### When analyzing a new system or process:

**IF** you're documenting how things currently work  
**THEN** you're probably doing task analysis, not HTA—shift to specifying what must be achieved

**IF** your analysis reads like a procedure manual  
**THEN** you've lost the goal-based perspective—reframe in terms of measurable achievements

**IF** you can't specify success criteria for a "sub-goal"  
**THEN** it's probably an activity description, not a goal—ask "what does this accomplish?"

### When deciding decomposition depth:

**IF** the sub-goal is routine and failure consequences are minor  
**THEN** stop—mark as "adequate" and move to higher-variance components

**IF** the sub-goal has high error variance OR high failure cost  
**THEN** continue decomposition until you understand failure modes

**IF** you're decomposing because "it feels incomplete"  
**THEN** you're probably over-analyzing—apply the P×C rule explicitly

**IF** subject matter experts say "anyone can do that part"  
**THEN** that's a signal to stop—focus on the non-obvious elements

### When writing plans:

**IF** your plan is just a sequence (do 1, then 2, then 3)  
**THEN** you're missing control logic—identify decision points and conditions

**IF** you can't specify what triggers each sub-goal  
**THEN** you don't understand the coordination—interview experts about context

**IF** the plan has no contingencies  
**THEN** you're describing the ideal case only—probe for "what if X goes wrong?"

**IF** experts disagree about the plan  
**THEN** you've found important variance—document both strategies and conditions for each

### When using HTA for downstream analysis:

**IF** designing training  
**THEN** focus on high P×C sub-goals and complex plan structures (→ load `hta-as-springboard-for-specialized-analysis.md`)

**IF** predicting errors  
**THEN** examine each sub-goal for failure modes and each plan for coordination breakdowns (→ load `failure-modes-and-error-variance.md`)

**IF** designing interfaces  
**THEN** identify information requirements at each plan decision point (→ load `the-gap-between-knowing-and-doing.md`)

**IF** allocating functions  
**THEN** examine which sub-goals require human judgment vs. algorithmic control

**IF** you're stuck choosing between abstraction levels  
**THEN** consider multiple parallel analyses at different levels (→ load `hierarchies-of-abstraction-enable-action.md`)

## Reference Documents

| Reference File | When to Load | Key Content |
|----------------|--------------|-------------|
| `goal-decomposition-as-problem-solving-substrate.md` | When you need to understand WHY goal-based analysis is fundamentally different from task description; when justifying HTA to stakeholders | The theoretical distinction between goals and activities; why solution-neutrality matters; how the same HTA supports multiple applications |
| `stopping-rule-and-analytical-economy.md` | When deciding how detailed your analysis should be; when facing scope creep; when stakeholders want "complete" documentation | The P×C rule explanation; practical guidance on stopping criteria; why "adequacy" is the right standard; handling analytical effort strategically |
| `plans-as-coordination-intelligence.md` | When writing plans; when sub-goals seem like a flat list; when analyzing decision-making or coordination | What plans actually are; how they encode control logic; examples of conditional, parallel, and iterative plans; why plans are where expertise lives |
| `hta-as-springboard-for-specialized-analysis.md` | When moving from HTA to training design, error prediction, or interface design; when HTA feels like "just documentation" | How to extend HTA with additional columns; examples of tabular annotations; the framework pattern that makes HTA valuable |
| `three-governing-principles-of-goal-based-systems.md` | When your analysis feels unprincipled; when teaching HTA; when someone challenges whether HTA is "theory" or just notation | The three principles; how they derive from control theory; why they prevent common degenerative patterns; theoretical grounding |
| `failure-modes-and-error-variance.md` | When designing for reliability; when analyzing incidents; when applying SHERPA or similar error prediction methods | How to identify error modes systematically; the relationship between goals and failure; error variance as a design driver |
| `the-gap-between-knowing-and-doing.md` | When designing interfaces, job aids, or information systems; when people "know what to do but don't do it" | Information requirements at each sub-goal; the distinction between knowledge and executable understanding; what information must be available when |
| `hierarchies-of-abstraction-enable-action.md` | When struggling with the "right" level of analysis; when different stakeholders need different views; when detail obscures comprehension | How abstraction level affects usefulness; the problem of completeness vs. comprehensibility; strategies for multi-level analysis |

## Anti-Patterns

### The Procedural List Masquerading as HTA
**Symptom**: Your "HTA" is just numbered steps with no goal statements or success criteria  
**Why it fails**: Loses solution-neutrality, can't support multiple applications, provides no basis for improvement  
**Antidote**: For each "step," ask "what does this achieve?" and "how would you know if it succeeded?"

### Over-Decomposition of Routine Elements
**Symptom**: Spending equal effort on high-variance critical sub-goals and routine trivial ones  
**Why it fails**: Wastes analytical effort, obscures what matters, creates maintenance burden  
**Antidote**: Apply P×C rule explicitly; mark adequate sub-goals and move on

### Plans as Afterthoughts
**Symptom**: Writing plans as "do 1, 2, 3" after building the hierarchy  
**Why it fails**: Misses the control intelligence; plans and goals should co-evolve  
**Antidote**: When decomposing a goal, immediately ask "under what conditions does each sub-goal matter?"

### Confusing Goals with Activities
**Symptom**: "Sub-goals" like "operator presses button" or "system displays screen"  
**Why it fails**: These describe implementation, not achievement; no success criteria  
**Antidote**: Reframe as "temperature setpoint updated" or "alarm condition communicated to operator"

### HTA as Documentation Rather Than Analysis
**Symptom**: Producing the hierarchy diagram and calling it done  
**Why it fails**: Misses the entire point—HTA is infrastructure for further analysis  
**Antidote**: Always ask "what decision does this HTA support?" and extend it for that purpose

### The Completion Fallacy
**Symptom**: Belief that HTA is "done" when every leaf node is equally detailed  
**Why it fails**: Completeness is not the goal; analytical economy is  
**Antidote**: Stopping is a principled decision, not a failure; document why you stopped at each node

### Ignoring Error Variance
**Symptom**: Analyzing to arbitrary depth without considering where failures actually occur  
**Why it fails**: Allocates effort uniformly rather than strategically  
**Antidote**: Gather empirical data or expert judgment about error frequency and consequences

## Shibboleths: Signs of Deep Understanding

### Surface-Level Understanding Says:
- "HTA is a way to document tasks"
- "The stopping rule is subjective"
- "Plans are just the sequence of steps"
- "HTA tells you what people do"
- "Good HTA is complete and detailed throughout"

### Deep Understanding Says:
- "HTA specifies goals with measurable success criteria—it's solution-neutral"
- "The P×C stopping rule is a principle of analytical economy—stop where failure doesn't matter enough to justify further analysis"
- "Plans encode control logic—they're the conditions and contingencies that trigger sub-goals, not just ordering"
- "HTA tells you what the system must achieve—current methods are just one possible solution"
- "Good HTA decomposes high-variance, high-consequence elements and marks low-criticality elements as adequate"

### Green Flags (They've Internalized It):
- Distinguishes sharply between goals and activities
- Immediately asks "how would you measure success?" when discussing sub-goals
- Recognizes that plans contain the expert knowledge about context
- Treats HTA as infrastructure and automatically thinks about what to annotate it with
- Uses P×C reasoning explicitly when deciding scope
- Sees hierarchical decomposition as enabling analysis, not as documentation structure
- Understands that sub-goals can be achieved by multiple methods (solution-neutrality)

### Red Flags (Superficial Application):
- Produces hierarchies that are just procedure manuals with indentation
- Can't explain when or why to stop decomposing
- Writes plans that are all "do 1, then 2, then 3" with no conditionals
- Treats HTA as a deliverable rather than an analytical tool
- Aims for "completeness" without considering what the analysis is for
- Can't distinguish between describing current practice and specifying required achievement
- Missing or trivial success criteria for goals

---

**Remember**: HTA is not notation—it's a theory of goal-directed performance grounded in control theory. The hierarchy describes what must be achieved. The plans describe how achievement is controlled. The P×C rule directs analytical effort. The three principles maintain discipline. The tabular extensions enable application-specific analysis. When you find yourself lost, return to the question: "What must be accomplished, and how will we know if it succeeded?"