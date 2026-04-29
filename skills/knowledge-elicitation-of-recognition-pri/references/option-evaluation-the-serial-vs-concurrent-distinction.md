# Serial vs. Concurrent Option Evaluation: Why the Architecture of Decision-Making Matters

## The Fundamental Fork in Decision Architecture

When a decision must be made, there are two fundamentally different architectural approaches to evaluating options:

**Concurrent evaluation (the normative model)**: Generate all relevant options. Simultaneously evaluate each against a common set of criteria. Select the option with the highest overall score. This is the architecture implicit in decision analysis, multi-attribute utility theory, and most formal decision support systems.

**Serial evaluation (the descriptive model)**: Generate one option. Test it for feasibility via mental simulation. Either implement it, modify it, or reject it and generate the next most appropriate option. Never compare two options simultaneously.

Klein and MacGregor's research establishes that expert decision-makers under naturalistic conditions almost universally use the serial approach — not because they lack the cognitive capacity for concurrent evaluation, but because serial evaluation is better suited to the conditions they face.

---

## Why Concurrent Evaluation Fails in Practice

### Time Incompatibility
Concurrent evaluation requires holding multiple options in working memory simultaneously while applying evaluation criteria to each. Under time pressure, this creates demands that exceed available cognitive resources.

"Studies have shown that analytic decision strategies are not effective when there is less than one minute to respond (Howell, 1984; Zakay & Wooler, 1984; Rouse, 1978). And these studies were performed with tasks that were well-defined and clearly amenable to analytical decision strategies."

Real-world command decisions often require responses in seconds. The concurrent evaluation architecture simply cannot execute at operational tempo.

### Information Incompleteness
Concurrent evaluation requires commensurable information about all options across all evaluation dimensions. In naturalistic settings, information is partial, ambiguous, and sequentially revealed. You cannot simultaneously evaluate five options when you don't yet know what the full set of relevant dimensions is or what the values of the current situation's parameters are.

### The Spurious Completeness Problem
Concurrent evaluation implicitly assumes the set of options generated is complete. But "people are very poor at generating complete sets of options" (Gettys & Fisher, 1979). If the correct option is not in the generated set, concurrent evaluation among the wrong options cannot produce the right answer.

---

## Why Serial Evaluation Works

### It Always Produces an Action
The serial approach keeps an action primed at every moment. The first option in the action queue is always ready for immediate implementation if the situation demands it. This is critical in time-pressured environments — the expert always has an answer, even if time for evaluation is zero.

"Descriptively, the RPD model makes available to the decision maker a course of action at every point."

### It Leverages Prototype Knowledge to Order the Queue
The action queue is not randomly ordered. The most contextually appropriate action for the recognized situation type is at the top of the queue. This is not arbitrary — it reflects the accumulated experience of previous incidents in which this situation type was encountered. The best available action is tried first.

### It Uses Mental Simulation as a Feasibility Filter
Rather than comparing Option A vs. Option B on abstract criteria, serial evaluation asks a single concrete question: "If I imagine implementing this option in the current situation, does it produce the desired outcome without generating unacceptable side effects?"

This question can be answered without knowing anything about other options. It requires only a sufficiently accurate causal model of the current situation — which the expert has, by virtue of correct situation assessment.

### It Supports Option Modification
A key capability that concurrent evaluation misses: the ability to modify a nearly adequate option into an adequate one. If Option A is 80% right but has a specific problem, the expert can modify it to remove the problem rather than abandoning it entirely. "The favored option may be implemented, or it may be modified to fit the needs of the current situation."

This is essentially a local search in option space, guided by the mental simulation. It is more efficient than regenerating from scratch and more flexible than rigid option-list evaluation.

---

## The Action Queue Structure

The action queue is not explicitly constructed at decision time. It exists as a property of the prototype match. Each recognized situation type carries an associated ordering of applicable actions, roughly prioritized by:
- Typical effectiveness for this situation type
- Resource requirements (simpler actions first)
- Reversibility (more reversible actions may be preferred when situation uncertainty is high)

This implicit queue structure is one of the things an experienced expert has that a novice does not. The novice either has no action queue (and must reason from scratch) or has a shallow one (with few options, biased toward recently trained procedures).

The CDM's Decision Point Analysis explicitly maps this structure: for each decision point in an incident, it characterizes what options were in the queue, which was selected, how it was evaluated, and what alternatives were available but not tried.

---

## Implications for Agent System Architecture

### 1. Implement Action Queues, Not Option Comparison
Agent systems that select actions by scoring all options against evaluation criteria are implementing the concurrent evaluation architecture that expert humans abandon. A more naturalistic and operationally effective architecture:

1. **Recognize the situation type** (highest-confidence prototype match)
2. **Retrieve the associated action queue** (ordered list of applicable actions for this prototype)
3. **Validate the top action** via simulation (does causal model predict success?)
4. **If valid, implement**; if not, try next action; if top action needs modification, modify and re-validate

This architecture is faster, requires less working memory, and is more graceful under uncertainty.

### 2. Mental Simulation as a Validation Primitive
The agent system needs a simulation capability — a forward model that can predict the outcome of a proposed action given the current situational model. This is different from a planning module. It is not asked to find the best action; it is asked only whether a specific proposed action will succeed given the current situation.

This simulation can be implemented as:
- A causal model of the domain (explicit dynamics representation)
- A learned forward model (trained to predict action outcomes given situational features)
- A case-based retrieval (what happened in similar situations when this action was tried?)

### 3. Separate Action Queue Depth from Action Selection Confidence
These are different quantities:
- **Action queue depth**: How many validated options exist for this situation type?
- **Action selection confidence**: How confident is the system that the selected action will work?

Queue depth should influence escalation decisions: a shallow queue means the system is near the boundary of its knowledge and should seek help. Selection confidence should influence action commitment level: low confidence warrants more frequent monitoring and a lower threshold for aborting the action if the situation evolves unexpectedly.

### 4. Implement Option Modification, Not Just Option Selection
The ability to modify a nearly-adequate option is a key feature of expert serial evaluation. Agent systems should support:
- Identifying which specific aspect of a candidate action makes it infeasible
- Generating modified versions that address the specific infeasibility
- Re-validating the modified option via simulation

This is more powerful than simply moving to the next option in the queue, because it can produce solutions for situations that no queued option perfectly fits.

### 5. Preserve the "Action Always Available" Property
At any moment, the agent system should have a best-current-action ready for immediate execution. This is not the same as having a final decision — it is a fallback that allows action even if deeper evaluation is interrupted. Under extreme time pressure, the system executes the current best action; under normal conditions, it may evaluate further before committing.

This property mirrors the RPD model's key operational advantage: there is always a course of action available, even if time for deliberation is zero.

---

## When Concurrent Evaluation Is Appropriate

Klein and MacGregor's framework is not absolutist. Concurrent evaluation is appropriate when:

- **Time permits**: If there is substantial time before action is required, comparing options explicitly may produce better decisions than serial evaluation
- **Options are commensurable**: If all options can be meaningfully evaluated on the same criteria
- **Situation assessment uncertainty is low**: If the expert is confident about the situation type, they can afford to compare options because they know the evaluation criteria
- **The decision is irreversible and high-stakes**: When an error cannot be corrected, additional deliberation is warranted even if it is slow

The key design principle is that concurrent evaluation should be an available mode for agent systems — one that is triggered when conditions warrant it — rather than the default mode that the system always uses regardless of time pressure and situational certainty.