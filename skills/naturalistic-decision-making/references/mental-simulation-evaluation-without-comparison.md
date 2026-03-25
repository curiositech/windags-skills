# Mental Simulation: Evaluation Without Comparison

## The Core Mechanism

Klein discovered a puzzle at the heart of expert decision-making: "How can a person evaluate an option without comparing it with others?" The traditional answer would be "you can't"—evaluation implies comparison. But Klein's fireground commanders weren't comparing; they were imagining.

"We found that the fireground commanders we studied evaluated a course of action by using mental simulation to imagine how it would play out within the context of the current situation. If it would work, then the commanders could initiate the action. If it almost worked, they could try to adapt it or else consider other actions that were somewhat less typical, continuing until they found an option that felt comfortable."

This is **single-option evaluation through forward projection**: running a mental model of the situation forward in time with the proposed action inserted, observing whether the trajectory leads to success or failure.

## Why This Matters for Agent Systems

Most decision support systems and AI agents evaluate options through scoring functions: assign values to multiple options on various criteria, weight the criteria, sum to get a total score, pick the highest. This is the multi-attribute utility theory (MAUT) approach that dominated decision science for decades.

Klein shows this isn't how experts work. Mental simulation is fundamentally different:

1. **Dynamic vs. Static**: Scoring evaluates options at a point in time; simulation unfolds them through time, revealing how they interact with changing conditions.

2. **Contextual vs. Abstract**: Scoring uses general criteria; simulation embeds the action in the specific current situation with all its particulars and constraints.

3. **Qualitative vs. Quantitative**: Simulation asks "does this work or not?" rather than "how many points does this get?" The output is binary (satisfactory/unsatisfactory) with modification attempts, not a ranked list.

4. **Sequential vs. Parallel**: Options aren't evaluated simultaneously and compared; they're evaluated one at a time until an acceptable one is found.

## Implementation in Agent Architectures

**Agent Mental Simulation Requirements**:

For an agent to perform mental simulation, it needs:

1. **A Runnable World Model**: Not just facts about the domain but a model that can be executed forward in time. If an agent is debugging code, it needs a model of how code changes propagate to behavior changes. If optimizing infrastructure, it needs a model of how configuration changes affect performance.

2. **Ability to Inject Hypothetical Actions**: The model must accept "what if I do X?" as input and project consequences. This is different from prediction ("what will happen?") because it requires modeling the agent's own intervention.

3. **Success/Failure Recognition**: The agent must recognize whether simulated outcomes satisfy goals. Klein notes commanders continued "until they found an option that felt comfortable"—the agent needs termination criteria beyond pure optimization.

4. **Adaptation Mechanisms**: Klein emphasizes "if it almost worked, they could try to adapt it." Mental simulation isn't just accept/reject; it reveals where plans break and suggests modifications.

## The Satisficing Process

Herbert Simon's concept of satisficing—"looking for the first workable option rather than trying to find the best possible option"—is vindicated by Klein's research. But Klein shows why this is adaptive, not lazy:

"Because fires grow exponentially, the faster the commanders could react, the easier their job."

The cost of deliberation isn't fixed; it's dynamic. While the agent compares options, the problem is changing—often getting worse. In software systems: while an agent evaluates 10 different debugging approaches, the bug might be causing cascading failures. The "best" solution found after 10 minutes of analysis might be worse than a "good enough" solution implemented immediately.

**For Agent Systems**: Build explicit models of problem deterioration. How is this problem changing while we think about it? Is the database filling up? Is the user waiting? Is the security breach spreading? The urgency model should influence how many simulation cycles to run before committing to action.

## System 1/System 2 Integration

Klein explicitly connects RPD to dual-process theory: "Therefore, the RPD model is a blend of intuition and analysis. The pattern matching is the intuitive part, and the mental simulation is the conscious, deliberate, and analytical part."

This maps to Kahneman's System 1 (fast, unconscious) and System 2 (slow, deliberate). Klein's insight is that **expertise is not choosing between these systems but integrating them**:

- System 1 (pattern matching) generates the candidate action rapidly
- System 2 (mental simulation) validates it carefully
- If validation fails, System 1 generates the next candidate based on similarity to the failed option

**For Multi-Agent Systems**: Different agents or modules might specialize in different aspects:
- **Intuitive Agent**: Fast pattern matching, generates candidate solutions
- **Analytical Agent**: Detailed simulation, validates solutions
- **Adaptation Agent**: When simulation reveals failures, modifies proposals

But Klein's point is these aren't separate agents making separate decisions; they're integrated into a single decision process. The architecture should reflect this integration, not segregation.

## Boundary Conditions: When Mental Simulation Fails

Klein notes: "A purely intuitive strategy relying only on pattern matching would be too risky because sometimes the pattern matching generates flawed options."

**Known Failure Modes**:

1. **Inadequate World Models**: If the agent's model of how actions lead to outcomes is wrong, simulation will be misleading. This is the classic "garbage in, garbage out" problem but worse—confident errors based on flawed simulation.

2. **Computational Complexity**: Some systems are too complex to simulate quickly. Weather prediction, protein folding, complex system interactions—simulation might take longer than just trying the action.

3. **Rare Events**: Mental simulation tends to project typical trajectories. Experts struggle with low-probability, high-impact events ("black swans") because they don't naturally emerge from simulation.

4. **Novel Combinations**: Simulation works by chaining known causal relationships. Truly novel situations where familiar causal chains don't apply will mislead.

**Mitigation Strategies**:

- **Model Confidence**: Agents should track which parts of their world model are well-validated vs. speculative
- **Simulation Depth**: Adjust how far forward to simulate based on model confidence and urgency
- **Ensemble Simulation**: Run multiple simulations with slightly different assumptions to identify brittleness
- **Reality Checks**: After acting, compare actual outcomes to simulated expectations—this is how world models improve

## Expectancy Violation as a Signal

Klein's RPD model includes a critical feedback loop (see Figure 1 in the paper): "Are expectancies violated?" If the simulation predicted outcome X but reality produces Y, this triggers reassessment.

**For Agent Systems**: This is gold. Rather than treating prediction errors as mere metrics, treat them as signals that current patterns/models are inadequate. When an agent's mental simulation predicts success but execution fails, this should:

1. **Trigger immediate replanning**: The situation isn't what the agent thought
2. **Update pattern libraries**: This situation looked like Pattern X but behaved differently
3. **Refine world models**: The causal relationships encoded in the model need adjustment
4. **Possibly escalate**: If expectancy violations accumulate, the agent is operating beyond its competence

## Practical Design Pattern

For agent task execution:

```
1. Pattern Match → Identify situation type → Retrieve typical action
2. Mental Simulation → Project action forward in current context
3. Decision Point:
   - Simulation clearly succeeds → Execute action
   - Simulation almost succeeds → Adapt action, re-simulate
   - Simulation clearly fails → Retrieve next-most-typical action, go to step 2
   - No more patterns match → Fall back to analytical problem-solving
4. Execute action
5. Monitor for expectancy violations
6. If violation occurs → Reassess situation (back to step 1)
```

This is fundamentally different from "generate all options, score all options, pick highest score."

## Evidence Base

Klein's validation: "We tested the prediction from the RPD model that for experienced decision makers, the first option they consider is usually satisfactory. Klein, Wolf, Militello, and Zsambok (1995) found that chess players were not randomly generating moves that they would then evaluate. Rather, the first moves that occurred to them were much better than would be expected by chance."

For agent systems, if mental simulation frequently rejects pattern-matched suggestions, something is wrong—either patterns are poor or simulation is too conservative.