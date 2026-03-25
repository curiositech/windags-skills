## BOOK IDENTITY
**Title**: Naturalistic Decision Making
**Author**: Gary Klein
**Core Question**: How do experienced decision makers actually make decisions under real-world conditions (time pressure, uncertainty, high stakes, vague goals, unstable conditions) rather than in controlled laboratory settings?
**Irreplaceable Contribution**: Klein demonstrates that expert decision-makers don't compare options systematically—they use pattern recognition to rapidly categorize situations and mental simulation to evaluate single courses of action. This challenges 40+ years of decision theory and reveals that "satisficing" (finding the first workable option) is not a cognitive limitation but an adaptive strategy. The Recognition-Primed Decision (RPD) model shows how intuition (pattern matching) and analysis (mental simulation) blend together in real expertise.

## KEY IDEAS

1. **Experience as Pattern Repertoire**: Expert decision makers don't generate and compare option sets. Instead, they use experience to build repertoires of patterns (schemas/prototypes) that describe causal factors, highlight relevant cues, provide expectancies, identify plausible goals, and suggest typical reactions. When situations match learned patterns, experts can make extremely rapid, high-quality decisions without explicit comparison.

2. **Mental Simulation as Evaluation**: Experts evaluate courses of action through mental simulation—imagining how an action would play out in the current context—rather than comparing multiple options on evaluation dimensions. If the simulated action works, they proceed; if it almost works, they adapt it; if not, they move to less typical options until finding something satisfactory.

3. **The Satisficing Strategy is Optimal for Real-World Conditions**: Herbert Simon's concept of satisficing—accepting the first workable option rather than finding the "best"—is not a cognitive shortcut but an adaptation to conditions where problems grow exponentially (like fires) and speed is survival. The quest for optimal solutions assumes stable conditions that rarely exist in practice.

4. **The Gap Between Laboratory and Field**: Traditional decision research studied optimal choices in well-structured, controlled settings and documented how people deviated from these standards. But it couldn't explain what people actually did or why their "suboptimal" strategies often worked. Field research reveals that formal decision tools are "cumbersome and irrelevant" to real work and don't improve decision quality in practice.

5. **Intuition-Analysis Blend (System 1/System 2 Integration)**: The RPD model integrates fast, unconscious pattern matching (System 1) with slow, deliberate mental simulation (System 2). Pure pattern matching would be too risky (flawed pattern matches); pure analysis would be too slow (conditions deteriorate). Expert decision-making requires both simultaneously.

## REFERENCE DOCUMENTS

### FILE: pattern-matching-as-primary-decision-mechanism.md
```markdown
# Pattern Matching as the Primary Decision Mechanism in Expert Systems

## Core Insight

The Recognition-Primed Decision (RPD) model fundamentally reframes how intelligent systems should approach decision-making. Rather than generating multiple options and comparing them systematically—the approach assumed by traditional decision theory and most current AI architectures—expert decision makers "use their experience in the form of a repertoire of patterns" (Klein, 1989). These patterns are not simple templates but rich knowledge structures that simultaneously:

1. Describe primary causal factors operating in the situation
2. Highlight the most relevant cues
3. Provide expectancies about what will happen next
4. Identify plausible goals
5. Suggest typical types of reactions

Klein's research with fireground commanders revealed that 80-90% of decisions followed the RPD strategy: "When people need to make a decision they can quickly match the situation to the patterns they have learned. If they find a clear match, they can carry out the most typical course of action."

## Implications for Agent System Design

**Current State Problem**: Most multi-agent orchestration systems treat decision-making as option generation followed by evaluation. An agent facing a complex problem will decompose it into subtasks, generate multiple approaches, score them against criteria, and select the highest-scoring option. This mirrors the classical decision theory approach that Klein's research shows experts don't actually use.

**Pattern-Based Alternative**: An agent system designed around RPD principles would:

1. **Build Pattern Libraries Through Experience**: Rather than starting fresh with each problem, agents should accumulate case libraries where each case captures: the situation context, the cues that mattered, what was expected, what actually happened, and what action was taken. This is closer to case-based reasoning but richer—patterns aren't just similar past situations but compressed expertise.

2. **Match First, Generate Second**: When encountering a problem, the first step isn't "what are all possible approaches?" but "what pattern does this match?" The pattern match immediately suggests a course of action without requiring explicit option generation.

3. **Use Generation as Fallback**: Only when no clear pattern match exists should the system fall back to generative problem-solving. Klein notes that his fireground commanders sought more information or reassessed the situation when it wasn't familiar—they didn't immediately start generating novel solutions.

## Boundary Conditions and Failure Modes

Klein is explicit that this approach depends on experience: "The NDM movement shifted our conception of human decision making from a domain-independent general approach to a knowledge-based approach exemplified by decision makers who had substantial experience."

**When Pattern Matching Fails**:
- **Novel Situations**: When agents encounter truly unprecedented problems, pattern libraries provide no match. The system needs clear signals that it's operating outside known patterns.
- **Surface Similarity Traps**: Patterns might match on superficial features while differing on critical dimensions. Klein's solution is mental simulation (covered in another document), but agents need mechanisms to detect false pattern matches.
- **Pattern Interference**: Multiple partially-matching patterns can create confusion. Human experts have implicit weighting; agent systems need explicit conflict resolution.

**The Novice Problem**: Klein's research focused on experienced decision-makers. A new agent with no accumulated patterns can't use RPD effectively. This suggests a developmental trajectory: early in deployment, agents must use more deliberative, analytical approaches; as they accumulate experience, they can shift toward pattern-based decisions.

## Design Principles for Pattern-Based Agent Systems

1. **Pattern Representation Must Be Rich**: Simple key-value pairs or feature vectors won't suffice. Patterns must capture causal relationships, temporal dynamics, expectancies, and action affordances. Consider knowledge graph representations where nodes are situation elements and edges encode relationships, typical sequences, and outcome expectations.

2. **Similarity Metrics Need Context**: Two situations might be similar on features but different in what matters. Pattern matching requires understanding which dimensions are critical for this decision type. This suggests meta-patterns: patterns about which patterns apply when.

3. **Pattern Libraries Should Be Shareable**: Klein studied individual experts, but in multi-agent systems, patterns learned by one agent should be available to others (with appropriate context about when they apply). This is organizational learning at the system level.

4. **Confidence Calibration**: Pattern matches vary in strength. A weak match might trigger mental simulation (evaluation); a strong match might proceed directly to action. Agents need calibrated confidence in pattern matches.

## Evidence and Validation

Klein's critical finding: "Klein, Wolf, Militello, and Zsambok (1995) found that chess players were not randomly generating moves that they would then evaluate. Rather, the first moves that occurred to them were much better than would be expected by chance." 

This supports the prediction "that for experienced decision makers, the first option they consider is usually satisfactory." For agent systems, this suggests that if pattern matching is working correctly, the first suggested action should have high success probability. If agents frequently reject their first pattern-matched suggestion, either the patterns are inadequate or the matching mechanism is flawed.

## What Makes This Distinctive

Most AI decision-making research focuses on search, optimization, and systematic comparison. Even case-based reasoning typically retrieves cases to inform deliberative analysis. Klein shows that **pattern matching can be the complete decision mechanism**—not a preprocessing step before "real" decision-making but the decision itself. The pattern doesn't just narrow the search space; it specifies the action.

This is uncomfortable for systems that want explainability. "Why did you take that action?" "Because the situation matched Pattern 47" feels less rigorous than "I evaluated 12 options on 8 criteria and this scored highest." But Klein's research suggests the latter is not how expertise actually works. Agent systems may need to embrace pattern-based decisions while developing separate mechanisms for explaining pattern content and match quality.

## Integration with Task Decomposition

For complex problems requiring decomposition, pattern matching operates at multiple levels:
- **Situation Categorization**: "This is a database performance problem" (high-level pattern)
- **Approach Selection**: "For this type of DB problem, we profile queries first" (strategy pattern)
- **Tactic Execution**: "Slow query patterns suggest missing indexes" (tactical pattern)

Each level uses pattern matching to avoid exhaustive search of possibility spaces. The system rapidly navigates from problem to solution through a cascade of pattern recognitions rather than a single monolithic decision.
```

### FILE: mental-simulation-evaluation-without-comparison.md
```markdown
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
```

### FILE: experience-accumulation-expert-knowledge-architecture.md
```markdown
# Experience Accumulation: Architecture for Expert Knowledge Development

## The Central Challenge

Klein's research reveals a fundamental paradox for AI agent systems: **the strategies that make experts effective require extensive experience to develop**, yet agents must begin as novices.

"The NDM movement shifted our conception of human decision making from a domain-independent general approach to a knowledge-based approach exemplified by decision makers who had substantial experience."

Traditional AI attempts to bypass experience by embedding domain-independent reasoning algorithms that should work regardless of familiarity. Klein's research suggests this is backwards—domain expertise isn't a substitute for general intelligence; it's what intelligence actually is in practice.

## What "Experience" Actually Consists Of

Klein describes patterns as repertoires that include:
- Primary causal factors operating in situations
- Relevant cues (what to pay attention to)
- Expectancies (what should happen next)
- Plausible goals (what's achievable/appropriate)
- Typical reactions (what actions work)

This isn't abstract knowledge ("databases use indexes for fast queries") but contextualized, situated knowledge ("when slow query logs show sequential scans on large tables during peak traffic, adding indexes on the join columns usually resolves the issue, unless there's a lock contention problem").

**The difference**: Abstract knowledge requires extensive reasoning to apply; experiential knowledge directly suggests action.

## The Developmental Trajectory Problem

For human experts, Klein studied people with years of experience—firefighters, nurses, military commanders. An AI agent system deployed today doesn't have that luxury. This creates design requirements:

### 1. Explicit Novice Mode

Systems should recognize and signal when they're operating as novices vs. experts. A novice agent should:
- Use more deliberative, analytical decision strategies (explicitly comparing options)
- Seek more information before deciding
- Be more conservative (preferring safer, slower solutions)
- Document uncertainty explicitly
- Request human oversight more frequently

Klein notes that when his experts encountered unfamiliar situations, they "sought more information" or "reassessed the situation"—they didn't blindly apply patterns. Novice agents should operate perpetually in this cautious mode until experience accumulates.

### 2. Experience Capture Architecture

Every task execution should generate structured experience records:

**Minimum viable experience record**:
- **Situation Description**: What was the context? What were the observable features?
- **Cues That Mattered**: Which specific aspects of the situation drove the decision? (This requires attention tracking—what did the agent examine?)
- **Expectancies**: What did the agent predict would happen?
- **Action Taken**: What did the agent do? (Including adaptations/modifications)
- **Actual Outcome**: What actually happened? How did it compare to expectancies?
- **Success/Failure**: Did it achieve the goal? Why or why not?

Klein's emphasis on expectancy violations is critical: "Are expectancies violated?" This isn't just outcome tracking ("did it work?") but prediction tracking ("did it work for the reasons we thought?"). An agent might succeed by accident or fail despite correct reasoning—only comparing expectancies to outcomes reveals whether understanding is accurate.

### 3. Progressive Pattern Abstraction

Raw experience is too specific; expertise requires abstraction into patterns. But premature abstraction loses critical details. The system needs:

**Multi-level representation**:
- **Episodic Memory**: Specific cases with full context (what actually happened)
- **Pattern Library**: Abstracted regularities (what usually happens)
- **Meta-Patterns**: Patterns about when patterns apply (what makes situations similar)

**Abstraction mechanism**:
- After N similar experiences (where "similar" is defined by shared causal structure, not surface features), generate candidate patterns
- Patterns remain tentative until validated across diverse instances
- Pattern confidence should be visible—an agent should "know what it knows"

### 4. Cross-Agent Learning

Klein studied individual experts, but agent systems offer an advantage humans lack: shared experience. If Agent A debugs a database deadlock, Agent B should benefit from that experience without repeating the entire learning process.

**Challenges**:
- **Context Matters**: A solution that worked in one context might fail in another. Experience transfer requires context encoding.
- **Over-Generalization**: If every agent learns from every other agent's experience, the system might over-fit to patterns that aren't actually universal.
- **Credit Assignment**: When Agent B uses a pattern from Agent A and succeeds, is this validating evidence for the pattern? Or did it work for different reasons?

**Design Approach**:
- Experience records include context tags (technology stack, system scale, time constraints, etc.)
- Pattern libraries include applicability conditions
- When Agent B uses Agent A's pattern, this generates a validation case that updates confidence
- Patterns that work across diverse agents/contexts get promoted; patterns that fail get refined or deprecated

## The Speed-Accuracy Tradeoff Over Time

Klein's fireground commanders could make good decisions rapidly because they had extensive pattern libraries. Novice agents can't do this—they need more time for deliberative analysis. But agents should become faster as they gain experience.

**Measurable Progression**:
- **Novice**: High deliberation time, frequent option comparison, conservative choices
- **Intermediate**: Faster pattern matching, mental simulation on most decisions, occasional deliberation
- **Expert**: Rapid pattern matching on routine cases, mental simulation on complex cases, deliberation only on novel situations

The system should track these metrics per agent and per problem type. An agent that remains "novice speed" after 100 similar tasks isn't accumulating experience effectively—something is wrong with the learning architecture.

## Boundary Conditions: When Experience Misleads

Klein acknowledges that patterns can generate "flawed options"—this is why mental simulation is necessary. But experience-based systems have deeper failure modes:

### 1. Environment Shift
Patterns built from historical experience become obsolete when conditions change. A database optimization pattern that worked for MySQL 5.7 might fail on MySQL 8.0 due to query planner changes.

**Mitigation**: Experience records include temporal tags; patterns include "last validated" timestamps; agents preferentially use recently-validated patterns; old patterns get re-validated periodically.

### 2. Rare Events
Patterns reflect typical situations. By definition, rare events don't occur often enough to build strong patterns. Klein's fireground commanders developed expertise through repeated exposure—but what about events that happen once per decade?

**Mitigation**: For critical rare events (security breaches, data loss, system failures), use explicit analytical reasoning rather than pattern matching. The system should recognize "this is a low-frequency, high-stakes situation" and switch modes.

### 3. Superstitious Learning
An agent might develop patterns based on spurious correlations. If it happens to restart a service before debugging three times, and all three times the problem resolves, it might develop a "restart first" pattern—even if the restarts were coincidental.

**Mitigation**: Patterns require mechanistic explanations, not just statistical correlation. When building a pattern, the agent should articulate why this action leads to this outcome through causal reasoning, not just "it worked before."

## Implementation Strategy

For a multi-agent system like WinDAGs:

**Phase 1: Deliberative Baseline**
- All agents use analytical decision-making (option generation, explicit evaluation)
- Aggressive logging of all decision processes
- Human oversight on consequential decisions

**Phase 2: Pattern Identification**
- Offline analysis identifies recurring situation-action pairs
- Generate candidate patterns from clusters of similar experiences
- Human review of proposed patterns for sensibility

**Phase 3: Hybrid Operation**
- Agents attempt pattern matching first
- On strong matches, execute with mental simulation validation
- On weak matches, fall back to deliberative reasoning
- Continue logging all decisions and outcomes

**Phase 4: Expert Operation**
- Most routine tasks handled through pattern matching
- Deliberative reasoning reserved for novel situations
- Continuous background validation of pattern effectiveness
- Pattern libraries shared across agent instances

## What Makes This Distinctive

Most machine learning approaches treat experience as training data for statistical models. Klein's insight is that **experience creates structured knowledge—patterns—that directly suggest action**. This is closer to case-based reasoning but richer:

- Not just "retrieve similar case" but "recognize situation type"
- Not just "what happened last time?" but "what usually happens and why?"
- Not just similarity matching but causal understanding

The pattern libraries Klein describes aren't neural networks or probabilistic models; they're rich knowledge structures that blend observations, explanations, and action affordances. Current AI architectures don't have good representations for this kind of knowledge.
```

### FILE: decision-quality-vs-decision-speed-fire-grows-exponentially.md
```markdown
# Decision Quality vs. Decision Speed: When Problems Grow Exponentially

## The Central Insight

Klein's most practically important observation comes from a simple physical fact: "Because fires grow exponentially, the faster the commanders could react, the easier their job."

This fundamentally reframes the decision-making problem. Traditional decision theory treats time as a resource to be managed—you can invest more time for better decisions or save time accepting worse decisions. But Klein reveals that **time changes the problem itself**.

When a fire doubles in size every minute, spending 10 minutes to find the optimal response means facing a fire 1,024 times larger than if you'd acted immediately with a merely good response. The "optimal" solution to the original problem is irrelevant because you're now solving a different problem.

## Implications for Agent System Design

Most AI decision-making systems optimize for solution quality without modeling problem dynamics. An agent tasked with "fix this database performance issue" will analyze logs, generate hypotheses, evaluate options, and select the best approach. But while it analyzes:

- The database is getting slower (more queries queueing)
- Users are timing out and retrying (multiplying load)
- Other services depending on this database are failing
- Error logs are filling disk space
- Monitoring systems are generating alerts that humans must triage

The "best" solution identified after 10 minutes of analysis might be inferior to a "good enough" solution implemented in 30 seconds, because after 10 minutes you're solving a much harder problem.

## Modeling Problem Deterioration

**Core Design Requirement**: Agent systems need explicit models of how problems change over time when unaddressed.

### Problem Deterioration Categories

1. **Exponential Growth** (Klein's fire scenario)
   - System load cascades
   - Security breaches spread laterally
   - Memory leaks approach OOM conditions
   - Disk filling approaching capacity

2. **Opportunity Window Closure**
   - Debugging info expires (log rotation)
   - Error reproduction becomes impossible (state changes)
   - Human stakeholders become unavailable
   - Market conditions shift

3. **Context Complexity Increase**
   - More services begin failing (root cause obscured)
   - Multiple simultaneous incidents (attention splitting)
   - Cascading compensatory actions (original state unknown)

4. **Fixed Deadlines**
   - Deployment windows close
   - SLA violation thresholds approach
   - Regulatory reporting deadlines

**Implementation**: Each problem type in the agent system should have an associated deterioration model: `f(problem_severity, time_elapsed) → updated_problem_severity`. This function doesn't need perfect accuracy; even crude models ("this problem roughly doubles in severity every 5 minutes") enable rational speed-quality tradeoffs.

## The Satisficing Decision Rule

Herbert Simon's satisficing principle—accept the first satisfactory option rather than searching for the optimal one—makes mathematical sense when problems deteriorate:

**Expected Value Calculation**:
- Option A: 80% solution quality, available in 1 minute, problem severity = 1.0
- Option B: 95% solution quality, requires 10 minutes analysis, problem severity = 10.0

Even if Option B is "better" in a static context, Option A might have higher expected value:
- A: 0.8 × 1.0 = 0.8
- B: 0.95 × 10.0 = 9.5 (but you must solve a 10× harder problem)

This is oversimplified, but the principle holds: **deliberation cost isn't time; it's problem complexity growth**.

## Agent Decision Policies

### Policy 1: Urgency-Aware Search Depth

Rather than fixed planning horizons ("spend up to N seconds deciding"), agents should adjust search based on deterioration rate:

```
if problem_doubling_time < planning_time_per_option:
    # Problem grows faster than we can plan
    use pattern_matching_only()
elif problem_doubling_time < 3 * planning_time_per_option:
    # Limited time for analysis
    use mental_simulation_on_first_pattern_match()
else:
    # Problem stable enough for comparison
    use deliberative_option_comparison()
```

### Policy 2: Progressive Deepening with Interruption

Rather than committing to full analysis upfront:

1. Quick pattern match (1-5 seconds) → propose action
2. Begin mental simulation while monitoring problem severity
3. If problem severity crosses threshold during simulation → commit to current best option
4. If simulation completes → proceed with validated action

This is analogous to anytime algorithms in AI planning, but driven by external problem dynamics rather than fixed time budgets.

### Policy 3: Good Enough, Then Improve

Klein's fireground commanders often acted quickly then refined:
- Initial action: "Put water on the fire" (immediate, obvious)
- Subsequent actions: "Adjust stream angle, position crews, prevent spread" (optimizing)

For agents:
1. Immediate response: Pattern-matched action that addresses most urgent aspect
2. Monitor outcomes while planning: Did immediate action stabilize the situation?
3. If stabilized: Now invest time in thorough analysis and optimization
4. If not stabilized: Execute next pattern-matched action

This is "two-phase decision making": crisis response followed by optimization.

## Failure Mode: Premature Optimization

The inverse of Klein's insight is equally important: **when problems don't deteriorate, spending time on optimization is valuable**.

If an agent is designing a new system architecture (no existing system is failing), rushing to the first satisfactory solution wastes the opportunity for deliberation. Problem deterioration models prevent both under-thinking urgent issues and over-thinking stable ones.

**Design Principle**: Default to fast pattern-based decisions, but explicitly recognize "design" vs. "response" contexts and adjust accordingly.

## Multi-Agent Coordination Implications

In systems where multiple agents work on interconnected problems:

### Cascade Prevention

If Agent A is addressing a database issue while Agent B is addressing a dependent service issue, Agent A's deliberation time directly affects Agent B's problem complexity. 

**Coordination Mechanism**: Agents should publish:
- Current problem severity
- Deterioration rate
- Expected time to intervention
- Confidence in planned action

Agent B can then decide: "Should I wait for Agent A's fix to propagate, or act independently?" The decision depends on whether Agent B's problem is deteriorating faster than Agent A can address the root cause.

### Parallel Satisficing

When multiple agents could address different aspects of a problem:
- Don't wait for optimal task allocation
- Each agent picks a satisfactory subproblem based on pattern matching
- Coordinate to avoid duplication
- Refine allocation if initial division proves inefficient

This mirrors Klein's description of firefighting teams: multiple commanders don't optimize overall resource allocation before acting; they each address an aspect of the fire, coordinating to avoid gaps and overlap.

## Boundary Conditions: When Speed Isn't Critical

Klein's research focused on "limited time, uncertainty, high stakes, vague goals, and unstable conditions" (Orasanu & Connolly, 1993). These conditions demand speed. But not all agent tasks share these properties:

**Safe to Deliberate**:
- Architectural design decisions (no live system at risk)
- Code review (code isn't deployed yet)
- Capacity planning (projecting future needs)
- Research tasks (exploring possibilities)
- Documentation (improving clarity)

**Must Be Fast**:
- Incident response
- Performance degradation
- Security breaches
- Data corruption risks
- User-facing failures

The agent orchestration system should classify tasks along the urgency dimension and route them to different decision strategies accordingly. High-urgency tasks get pattern-matching agents with minimal deliberation; low-urgency tasks get analytical agents with extensive option comparison.

## Measuring Decision Speed vs. Quality

Klein's validation approach applies to agents: track whether quick pattern-based decisions actually achieve satisfactory outcomes.

**Metrics**:
- **Time to First Action**: How long from problem detection to initial response?
- **Problem Severity at Action Time**: How much did the problem grow during deliberation?
- **Action Success Rate**: Did pattern-matched actions resolve issues?
- **Revision Frequency**: How often did agents need to revise quick decisions?

If agents using pattern-based rapid decision-making show:
- Fast time to action
- Low problem severity at intervention
- High success rate
- Low revision frequency

Then the satisficing strategy is working. If revision frequency is high, patterns are inadequate and more deliberation is needed despite urgency.

## What Makes This Distinctive

Klein's contribution isn't just "faster is sometimes better" (obvious) but the precise mechanism: **problem dynamics change the solution space during deliberation**. This shifts the frame from "speed-accuracy tradeoff" to "static-problem assumption violation."

Most AI research assumes the problem definition is stable during planning. Real-world agent systems operate in environments where problems are active processes, not static puzzles. Architecture must account for this.

The metaphor of exponentially growing fire should be literal in agent design: every problem has a growth function, and decision strategies must incorporate it.
```

### FILE: why-formal-decision-tools-fail-in-practice.md
```markdown
# Why Formal Decision Tools Fail in Practice: The Relevance Gap

## The Fundamental Observation

Klein opens his paper with a striking historical puzzle: by 1989, decision science had developed sophisticated formal models for optimal choice-making, and the heuristics-and-biases paradigm had thoroughly documented human deviations from these models. Yet: "Unfortunately, the training methods and decision support systems developed in accord with the formal standards did not improve decision quality and did not get adopted in field settings. People found these tools and methods cumbersome and irrelevant to the work they needed to do."

This is damning. Formal decision tools, designed by experts, based on rigorous mathematics, tested in experiments, failed in practice not because they were wrong but because they were **irrelevant**.

## Why Irrelevance Happens

### Mismatch 1: Static vs. Dynamic Problems

Formal decision models frame decisions as choices among known alternatives at a point in time. Decision trees, expected utility calculations, multi-attribute scoring—all assume:
- Options are enumerable before decision time
- Outcomes can be predicted probabilistically
- Utility functions are stable
- The choice point is discrete

But Klein's fireground commanders faced: "limited time, uncertainty, high stakes, vague goals, and unstable conditions." The fires changed as commanders decided. Goals shifted as new information emerged. Options that seemed viable became impossible as conditions evolved.

**For Agent Systems**: Formal decision tools assume you can freeze the world, enumerate possibilities, evaluate them, then unfreeze and act. But software systems are concurrent processes—other agents are acting, users are making requests, systems are degrading. Any decision tool requiring "stop the world" analysis is fundamentally mismatched to the domain.

### Mismatch 2: Option Generation vs. Situation Recognition

Formal models assume options are given or easily generated. Multi-criteria decision analysis starts with "here are your options, now evaluate them." But Klein found:

"People were not generating and comparing option sets. People were using prior experience to rapidly categorize situations."

The hard part isn't evaluating options; it's knowing what options make sense. A novice fireground commander could learn to score options on "speed of suppression," "crew safety," "water efficiency," but wouldn't know which strategies are even possible for a given fire configuration.

**For Agent Systems**: Providing agents with evaluation frameworks (scoring functions, optimization criteria) doesn't help if they don't know what to evaluate. The bottleneck is often "what should I even consider doing?" not "which of these options is best?"

Klein's pattern-based approach solves this: patterns suggest actions. The situation itself generates options rather than requiring exhaustive generation.

### Mismatch 3: Optimization vs. Satisficing in Resource-Constrained Settings

Formal models seek optimal solutions. Even when they incorporate computational complexity considerations, the goal remains "find the best solution tractable with available computation."

But Klein shows experts don't optimize; they satisfice: "looking for the first workable option rather than trying to find the best possible option." This isn't laziness or bounded rationality as a cognitive limitation—it's **adaptation to problems that deteriorate during deliberation**.

**For Agent Systems**: If an agent is built around "find the optimal solution, or at least the best solution you can find in time T," it's solving the wrong problem. The right problem is "find a satisfactory solution before problem severity grows beyond this threshold."

These are different optimization criteria. The first optimizes solution quality for fixed time; the second optimizes time for acceptable quality.

### Mismatch 4: Abstract Criteria vs. Situated Judgment

Formal decision models use domain-independent evaluation criteria. Cost-benefit analysis, expected value, risk-adjusted returns—these apply across contexts by design.

But Klein's experts made situated judgments. Fireground commanders didn't calculate expected casualties weighted by probability; they recognized "this is a defensive situation, pull crews back" based on pattern matching to similar fires.

**The Abstraction Gap**: Formal criteria require translating concrete situations into abstract dimensions, evaluating, then translating back to action. This translation is cognitively expensive and error-prone.

Klein's approach: patterns are already situated. They link situation types directly to action types without requiring abstraction to intermediate evaluation dimensions.

## Evidence of Failure

Klein notes that despite decades of decision training based on formal models, adoption remained poor: "People found these tools and methods cumbersome and irrelevant to the work they needed to do (Yates, Veinott, & Patalano, 2003)."

This is critical evidence. If formal tools worked, they'd be adopted despite being "cumbersome." The problem is irrelevance—they don't help with the actual decision problems people face.

**For Agent Systems**: This should make us skeptical of decision architectures built around formal evaluation frameworks. If human experts reject these tools, why would we expect AI agents to benefit from them?

Counterargument: Maybe AI agents can use formal tools more effectively than humans because computation is cheap. But Klein's point isn't about computational cost; it's about **problem structure mismatch**. If the formalism doesn't match the problem, more computation doesn't help.

## When Formal Tools Do Work

Klein doesn't claim formal analysis is never useful. The RPD model includes mental simulation—"the conscious, deliberate, and analytical part." But note the role: mental simulation evaluates pattern-matched options; it doesn't generate options or compare multiple alternatives systematically.

**Productive Role for Formal Analysis**:
1. **Validation**: After pattern matching suggests an action, analyze it formally to check for flaws
2. **Novelty**: When no patterns match (genuinely new situation), fall back to systematic analysis
3. **Design**: When problems are stable (not deteriorating), invest time in optimization
4. **Learning**: Post-hoc formal analysis of decisions to understand why they worked/failed

**Non-Productive Role**:
1. **Option Generation**: Formal search of option spaces when patterns already suggest actions
2. **Comparative Evaluation**: Scoring multiple options when mental simulation can validate the first
3. **Real-Time Decision Making**: Multi-criteria analysis during time-pressured response

## Design Implications for Agent Systems

### Anti-Pattern: "Smart" Decision Engines

Many AI agent architectures include sophisticated decision modules that score options, build decision trees, calculate expected utilities, etc. Klein's research suggests this is misplaced effort—not because it's wrong but because it solves a problem experts don't have.

**Better**: Pattern libraries + mental simulation + formal analysis for validation/edge cases.

### Anti-Pattern: Domain-Independent Decision Strategies

Trying to build agents that make good decisions across arbitrary domains through general-purpose reasoning is the "domain-independent general approach" Klein critiques. Experts aren't domain-independent; they're deeply domain-experienced.

**Better**: Build domain-specific pattern libraries. Accept that agent effectiveness depends on accumulated experience in specific domains.

### Anti-Pattern: Optimizing Internal Consistency

Formal decision models emphasize consistency—making sure your probability estimates sum to 1, your utility functions are transitive, your choices obey axioms. But Klein shows real experts violate these consistently and successfully.

**Better**: Optimize for outcome quality, not process consistency. If pattern-based decisions work empirically, don't reject them because they violate formal axioms.

## The Training Implication

Klein's observation that formal training methods don't improve decision quality has direct implications for agent "training" (learning):

**Failed Approach**: 
- Teach agents decision theory
- Train on toy problems with clear options and utilities
- Expect transfer to real-world decisions

**Successful Approach**:
- Expose agents to realistic problem scenarios
- Let them accumulate experience-based patterns
- Validate patterns through outcome tracking
- Refine patterns based on expectancy violations

This is closer to apprenticeship than classroom education—learning through situated practice rather than abstract principles.

## Boundary Conditions

Klein's critique applies to "limited time, uncertainty, high stakes, vague goals, and unstable conditions." Formal tools might work better when:
- **Ample Time**: Problems stable enough for thorough analysis
- **Low Uncertainty**: Outcomes predictable with high confidence  
- **Clear Goals**: Objectives well-defined and unambiguous
- **Stable Conditions**: Problem definition doesn't change during analysis

**For Agent Task Routing**: The orchestration system should recognize these conditions and route accordingly:
- High-pressure incident response → Pattern-based agents
- Architectural design decisions → Analytical agents with formal tools
- Code review → Hybrid (patterns for common issues, analysis for complex cases)

## What Makes This Distinctive

Many researchers have noted gaps between theory and practice. Klein's contribution is identifying the specific structural mismatch: formal models assume a choice problem among given options; real decision-making is a recognition problem followed by validation.

This isn't "people are irrational and ignore good advice." It's "formal models solve a different problem than the one experts face."

For agent systems, this means: don't start with decision theory and try to implement it; start with how expert humans actually decide and build architectures that support those processes. Formal tools are supplements, not foundations.
```

### FILE: situation-assessment-as-primary-cognitive-work.md
```markdown
# Situation Assessment as Primary Cognitive Work: Recognition Before Decision

## The Paradigm Shift

Traditional decision research focused on choice: given multiple options, how do people select among them? Klein reveals this focuses on the wrong stage: "The decision-making process was expanded to include a prior stage of perception and recognition of situations, as well as generation of appropriate responses, not just choice from among given options."

For Klein's fireground commanders, the hard cognitive work wasn't comparing strategies for fighting a fire—it was **recognizing what kind of fire they faced**. Once they recognized the situation type, the appropriate response often followed directly.

This inverts the traditional understanding: decision-making isn't primarily about choice; it's primarily about situation assessment. Choice only happens when assessment is ambiguous.

## What Situation Assessment Actually Involves

Klein describes how patterns encompass multiple dimensions simultaneously:
1. **Primary causal factors** operating in the situation
2. **Relevant cues** that indicate situation type
3. **Expectancies** about what will happen next
4. **Plausible goals** appropriate to this situation
5. **Typical types of reactions** that work here

Notice: all of this happens during situation assessment, before any "decision" in the traditional sense. By the time the fireground commander recognizes "this is a defensive fire," they already know:
- Why it's defensive (causal factors: too much heat, structural instability)
- What cues indicate this (smoke patterns, flame behavior, building construction)
- What to expect (potential collapse, spread to exposures)
- What's achievable (protect adjacent structures, not save this building)
- What to do (pull crews back, apply water from outside, cover exposures)

**The "decision" is just executing what the situation assessment suggests.**

## Implications for Agent Architecture

Most AI agent systems treat situation assessment as information gathering preliminary to the "real work" of decision-making. Klein shows this is backwards.

### Current Typical Flow:
1. Gather information
2. Generate options
3. Evaluate options (THE HARD PART)
4. Choose
5. Execute

### Recognition-Primed Flow:
1. **Assess situation** → Pattern match (THE HARD PART)
2. Retrieve associated action
3. Mental simulation (validation)
4. Execute (possibly with adaptation)

The cognitive load shifts from step 3 (evaluation) to step 1 (assessment). This has profound architectural implications.

## Cue Recognition: What to Pay Attention To

Klein emphasizes that patterns "highlight the most relevant cues." Experts don't gather all available information—they selectively attend to features diagnostic of situation type.

**For Agent Systems**: Rather than comprehensive information gathering ("get all logs, all metrics, all recent changes"), agents should use cue-directed search:

1. **Initial Quick Assessment**: Scan for high-level situation indicators
   - Error type (500 vs. 404 vs. timeout)
   - Scope (single user vs. all users)
   - System component (database, API, frontend)

2. **Pattern-Directed Deepening**: Based on initial match, gather specific cues
   - If pattern suggests "database connection exhaustion," check connection pool metrics
   - If pattern suggests "memory leak," check heap growth over time
   - If pattern suggests "cache invalidation issue," check cache hit rates

3. **Expectancy-Driven Validation**: Look for cues that should be present if pattern match is correct
   - Pattern: "Database deadlock" → Expect: multiple transactions waiting on locks
   - If expectancy violated → Reassess situation

This is fundamentally different from "gather all data, then analyze." It's hypothesis-driven information gathering, where the hypothesis comes from pattern matching, not exhaustive analysis.

## The Decision Ladder Concept

Klein references Rasmussen's (1983) decision ladder, which "permitted heuristic cutoff paths." The full ladder involves extensive information processing and evaluation, but experts take shortcuts—jumping directly from situation recognition to action without traversing all steps.

**For Agent Orchestration**: Don't force all decisions through the same pipeline. Instead:

- **Recognized situations**: Short path (pattern → simulation → action)
- **Ambiguous situations**: Medium path (pattern → comparison → simulation → action)
- **Novel situations**: Full path (information gathering → option generation → evaluation → simulation → action)

The orchestration system should route based on situation recognition confidence. High confidence → short path; low confidence → longer path.

## Expectancies as Active Predictions

Klein's model includes: "Are expectancies violated?" This isn't passive outcome observation; it's active prediction monitoring.

When a fireground commander recognizes a fire as Type X, they have specific expectations:
- Flame spread should follow this pattern
- Smoke should behave this way
- Water application should have this effect
- Structure should respond like this

If any expectancy is violated—smoke suddenly changes color, water has no effect, collapse happens sooner than expected—this triggers reassessment: "This isn't what I thought it was."

**For Agent Systems**: Situation assessment should generate explicit predictions:

```
Situation Assessment: "Database connection exhaustion"
Expectancies:
  - Connection pool metrics show 100% utilization
  - Application logs show connection timeout errors
  - New connections should take >30s to establish
  - Increasing pool size should resolve issue
  - CPU/memory on DB server should be normal (not root cause)

Action: Increase connection pool size
Monitoring: Check expectancies after action
  - Did new connections establish faster? 
  - Did timeout errors decrease?
  - Did pool utilization drop?
```

If expectancies aren't met, the situation assessment was wrong. This isn't "the solution failed"; it's "the diagnosis was incorrect." Reassess, don't retry.

## Ambiguous Situation Assessment

Klein's model includes: "Is the Situation Familiar? → No → Seek More Information → Reassess Situation."

Not all situations pattern-match clearly. Multiple partial matches, conflicting cues, missing expected features—these indicate assessment ambiguity.

**For Agent Systems**: Explicit confidence scoring on situation assessment:

- **High Confidence**: Clear pattern match, all key cues present, no conflicting indicators → Execute pattern-suggested action
- **Medium Confidence**: Partial match, some missing cues, or multiple competing patterns → Seek additional information, compare patterns, or request human input
- **Low Confidence**: No clear match, novel situation, or contradictory cues → Full analytical mode, possibly escalate to human

The key insight: **assess confidence in the assessment**, not just confidence in the action. If you're not sure what situation you're in, you can't be sure what action is appropriate.

## Situation Categories as Knowledge Structures

Patterns aren't simple templates; they're rich knowledge structures that integrate causal understanding, perceptual cues, temporal dynamics, and action affordances.

**Example: "Database Slow Query Problem" Pattern**

Causal Structure:
- Query execution exceeds timeout
- Caused by: missing indexes, outdated statistics, query plan regression, or lock contention

Perceptual Cues:
- Slow query logs show specific queries
- Execution time orders of magnitude above baseline
- EXPLAIN plans show sequential scans or inefficient joins

Temporal Dynamics:
- Often appears after schema changes or data growth
- May worsen gradually as data accumulates
- Can appear suddenly after ORM/library updates

Expectancies:
- Specific queries should be identifiable
- Adding indexes should reduce execution time
- Query optimizer should prefer new indexes

Action Affordances:
- Primary: Add indexes on frequently-scanned columns
- Secondary: Update table statistics
- Tertiary: Rewrite queries for efficiency
- Fallback: Increase timeouts (temporary workaround)

Context Boundaries:
- Assumes query is fundamentally reasonable
- Doesn't apply if problem is data volume (need partitioning)
- Doesn't apply if problem is lock contention (different pattern)

This rich structure can't be captured by simple key-value pairs or feature vectors. Agent knowledge representation needs to support this complexity.

## Assessment-First Task Decomposition

For complex multi-step problems, traditional decomposition focuses on goal breakdown: "To achieve X, I must do A, B, and C."

Klein's approach suggests assessment-first decomposition: "This is situation type Y, which typically requires addressing aspects P, Q, and R."

The difference: goal-driven decomposition is forward-looking (from desired end state to required steps); situation-driven decomposition is recognition-based (from current state type to typical interventions).

**For Multi-Agent Systems**: When a complex problem arrives:

1. **Master agent assesses overall situation**: "This is a system performance degradation problem affecting the API layer"
2. **Situation type suggests decomposition**: "Typically requires checking: database performance, cache effectiveness, API logic efficiency, network latency"
3. **Spawn specialized agents for each aspect**: Each sub-agent does its own situation assessment in its domain
4. **Integrate findings**: Sub-assessments combine to refine overall situation understanding
5. **Execute integrated response**: Based on refined assessment

This is different from: "Goal: Improve API performance. Subgoals: Optimize database, optimize caching, optimize logic, optimize network. Allocate agents to subgoals."

The assessment-first approach adapts to what the situation actually is, not what the goal structure implies.

## Boundary Conditions: When Assessment Fails

Situation assessment depends on matching current situations to previously-encountered patterns. Failure modes:

1. **True Novelty**: Genuinely new situation with no historical match
2. **Surface Similarity**: Current situation superficially resembles known pattern but differs in critical ways
3. **Multiple Overlapping Patterns**: Situation has features of several patterns with no clear best match
4. **Missing Diagnostic Cues**: Key information needed for pattern matching isn't available

**Mitigation**:
- **Novelty Detection**: Explicitly recognize when no good pattern match exists; escalate to analytical mode
- **Similarity Metrics**: Assess not just pattern match strength but also confidence in the match
- **Pattern Conflict Resolution**: When multiple patterns partially match, use differentiating cues to disambiguate
- **Information Seeking**: Patterns should specify which cues are diagnostic; actively gather those

## What Makes This Distinctive

Klein's core insight is that **situation recognition is not preliminary to decision-making; it is the primary decision-making act**. Once you know what situation you're in, the action often follows directly.

Most AI architectures treat perception/assessment as input processing and decision/planning as the core intelligence. Klein inverts this: pattern matching (assessment) is the expertise; action selection is often straightforward given correct assessment.

For agent systems, this means: invest in rich situation categorization (pattern libraries) more than sophisticated action selection algorithms. If agents correctly assess situations, action selection becomes simpler.
```

### FILE: team-coordination-without-central-control.md
```markdown
# Team Coordination Without Central Control: Shared Mental Models

## The Distributed Decision Problem

While Klein's 2008 paper focuses on individual decision-making, he references the broader NDM literature on team cognition: "Macrocognitive functions are performed at the level of individuals. These functions are also performed by teams, as emphasized by Letsky, Warner, Fiore, Rosen, and Salas (2007), who build on NDM research on shared mental models and team knowledge."

This is directly relevant to multi-agent systems like WinDAGs: how do multiple agents coordinate to solve complex problems without requiring a central controller that understands everything?

## The Shared Mental Model Concept

A shared mental model is a common understanding among team members of:
- **The Situation**: What's happening and why
- **Goals**: What we're trying to achieve
- **Capabilities**: Who can do what
- **Procedures**: How we typically operate
- **Expectations**: What we predict will happen

Critically, shared mental models enable **implicit coordination**: team members coordinate effectively without extensive communication because they share understanding of how to respond to situations.

Klein's fireground commander example: multiple crews fighting different aspects of the same fire don't need constant radio communication to coordinate if they share mental models of:
- Fire behavior patterns (how fires spread)
- Tactical priorities (life safety first, then property protection)
- Role responsibilities (engine companies attack, truck companies ventilate)
- Standard procedures (how to signal problems)

**Each crew can make autonomous decisions that mesh with others' decisions because they're all working from shared understanding.**

## Application to Agent Coordination

Most multi-agent orchestration systems use explicit coordination:
- Central planner assigns tasks
- Agents report status updates
- Coordinator resolves conflicts
- Explicit communication of dependencies

This requires the coordinator to understand all task interdependencies—which doesn't scale to complex problems where no single agent can understand everything.

**Shared Mental Model Alternative**: Agents share understanding of:

1. **Problem Categories**: Common ontology for situation types
2. **Solution Patterns**: Standard approaches to recognized situations  
3. **Role Boundaries**: Which agent types handle which situation categories
4. **Interface Protocols**: How agents interact at boundaries
5. **Priority Rules**: How conflicts are resolved

With shared mental models, agents can coordinate through **mutual awareness** rather than explicit direction.

## Pattern Libraries as Shared Mental Models

Klein's patterns are individual knowledge structures, but in multi-agent systems, pattern libraries can serve as shared mental models:

**Shared Pattern Library Contains**:
- **Situation Categories**: All agents recognize "database connection exhaustion" the same way
- **Typical Responses**: All agents know "connection exhaustion → increase pool size, then investigate root cause"
- **Role Assignments**: Database specialist agents handle DB issues; API agents handle application-level issues
- **Handoff Protocols**: If API agent detects DB issue, hands off to DB agent with context
- **Success Criteria**: All agents recognize when an issue is resolved

When Agent A detects a database problem and hands off to Agent B, they don't need to explain everything if they share mental models. Agent B knows what "database connection exhaustion" means, what Agent A probably already tried, what Agent B should do next, and what outcomes indicate success.

## Implicit Coordination Mechanisms

### 1. Predictable Behavior Patterns

Klein's fireground commanders could predict other crews' actions because they shared understanding of fire behavior and standard tactics. If Crew A sees conditions X, they'll take action Y—Crew B knows this and plans accordingly.

**For Agents**: If all agents use shared pattern libraries:
- Agent A can predict Agent B's likely response to situation types
- Agent C can anticipate what information Agent B will need
- Agent D knows when Agent B is likely to need assistance

This enables **proactive coordination**: agents help each other before being asked, because they predict others' needs.

### 2. Expectancy Sharing

Klein emphasizes expectancy monitoring: "Are expectancies violated?" In team settings, expectancies can be shared:

- Agent A takes action expecting outcome X
- Agent B monitors for outcome X
- If Agent B sees outcome Y instead, Agent B alerts Agent A

Agents don't need to explicitly coordinate monitoring; they share understanding of what should happen and watch for deviations.

### 3. Autonomous Adaptation

When situations change, teams with shared mental models can adapt without centralized replanning:

- All agents detect the situation change
- All agents recognize the new situation type
- All agents know the new standard response
- All agents adjust their actions accordingly

No central coordinator needs to issue new orders; the shared mental model provides the adaptation logic.

## Boundary Negotiation

Klein's patterns include context boundaries: when does this pattern apply vs. not apply? In team settings, these boundaries define role handoffs:

**Example: Performance Problem Pattern**

Pattern: "Database Slow Query"
- Applies when: specific queries exceed timeout, database metrics otherwise normal
- Doesn't apply when: database CPU saturated (different pattern: "database overload")
- Boundary indicator: CPU utilization level

If API Agent detects slow queries and low DB CPU → Applies database slow query pattern → Handoff to DB Agent

If API Agent detects slow queries and high DB CPU → Applies database overload pattern → Handoff to Infrastructure Agent (may need vertical scaling)

The pattern's boundary conditions tell agents when they're at a handoff point and who to hand off to.

## Shared Situation Awareness

Traditional approach: all agents report status to central coordinator; coordinator builds global situation awareness; coordinator directs agents.

Shared mental model approach: all agents observe relevant aspects; agents build compatible local situation assessments; local assessments combine into emergent global awareness.

**Requirements**:
1. **Observable State**: Agents can monitor relevant system aspects
2. **Compatible Categories**: Agents use same situation taxonomy
3. **Update Broadcasting**: Agents share situation assessment changes
4. **Confidence Signaling**: Agents indicate assessment confidence

**When Agent A broadcasts**: "I assess this as 'database connection exhaustion' with 85% confidence"
**Other agents know**:
- What Agent A thinks is happening (situation category)
- How sure Agent A is (confidence level)
- What Agent A will likely do next (pattern-associated action)
- What they should watch for (expectancies from pattern)

No central coordinator needed to integrate; agents' shared understanding of "database connection exhaustion" enables coherent responses.

## Coordination Breakdown Signals

Klein's model includes: "Are expectancies violated? → Yes → Reassess Situation"

In team contexts, expectancy violations signal coordination problems:

**Agent A expects**: Agent B will complete task X by time T
**Agent B actually**: Still working on task X at time T+
**Signal**: Coordination assumption invalid

This could mean:
- Agent A misassessed the situation (task X harder than expected)
- Agent B encountered problems (unexpected complications)
- Agents had different mental models (mismatched expectations)

**Recovery**: Explicit communication to rebuild shared understanding. The shared mental model enables implicit coordination during normal operation; when expectancies violate, system falls back to explicit coordination to realign.

## Multi-Agent Learning

If agents share pattern libraries, one agent's experience can update all agents' mental models:

**Traditional**: Agent A solves problem P with solution S; Agent A's individual knowledge improves

**Shared Mental Model**: Agent A solves problem P with solution S; pattern library updated; all agents now know solution S for problem P

This is organizational learning: the system gets smarter from individual agent experiences because knowledge is shared.

**Requirements**:
- Pattern library is centrally accessible (or distributed with sync)
- Pattern updates include context (when pattern applies)
- Validation before promotion (pattern works across contexts)
- Confidence weighting (patterns with more validation more trusted)

## Failure Modes

### 1. Mental Model Divergence

If agents develop incompatible situation categories or different understandings of patterns, implicit coordination breaks down.

**Mitigation**: 
- Centralized pattern library (single source of truth)
- Validation that agents interpret patterns consistently
- Explicit synchronization points where agents confirm shared understanding

### 2. False Consensus

Agents might assume they share understanding when they don't. Agent A uses "database overload" to mean CPU saturation; Agent B uses it to mean connection exhaustion. They coordinate poorly despite thinking they're aligned.

**Mitigation**:
- Formal pattern definitions with explicit scope
- Pattern IDs/versions to ensure agents reference same definition
- Validation through expectancy monitoring (misaligned understanding → violated expectancies)

### 3. Incomplete Mental Models

Shared mental models require sufficient coverage. If agents encounter situations outside shared patterns, they can't coordinate implicitly.

**Mitigation**:
- Explicit signaling when agents operate outside shared patterns
- Fallback to explicit coordination for novel situations
- Continuous expansion of pattern library from experience

### 4. Over-Coordination

Agents might defer to each other when all assume someone else will handle the situation, or duplicate work when all assume others aren't handling it.

**Mitigation**:
- Patterns include responsibility assignment rules
- Agents announce action intentions
- Mutual monitoring with intervention if gaps appear

## Implementation Strategy

For WinDAG multi-agent system:

**Phase 1: Shared Taxonomy**
- Develop common situation category ontology
- Ensure all agents use same category labels
- Define clear category boundaries

**Phase 2: Shared Pattern Library**
- Centralized pattern storage
- Patterns include: situation cues, typical responses, role assignments, expectancies
- Version control for pattern definitions

**Phase 3: Implicit Coordination Mechanisms**
- Agents broadcast situation assessments
- Agents monitor for expectancy violations by other agents
- Agents predict others' needs based on shared patterns

**Phase 4: Explicit Fallback**
- When expectancies violate → explicit communication
- When situations don't match patterns → request coordination
- When conflicts detected → negotiate resolution

**Phase 5: Learning Integration**
- Individual agent experiences update shared library
- Validation across agents before pattern promotion
- Confidence weighting based on validation breadth

## What Makes This Distinctive

Klein's insight transfers to multi-agent systems: **coordination doesn't require central control if agents share understanding of situations and appropriate responses**. 

Most multi-agent architectures assume coordination requires explicit planning and communication. Klein shows that shared mental models (pattern libraries in our context) enable implicit coordination—agents make compatible autonomous decisions because they share understanding of how to respond to situation types.

This is more scalable (no coordination bottleneck), more robust (no single point of failure), and more adaptive (agents respond to local conditions using shared logic rather than waiting for central direction).
```

### FILE: training-for-decision-requirements-not-procedures.md
```markdown
# Training for Decision Requirements, Not Procedures: Cognitive Preparation

## The Traditional Training Failure

Klein notes: "Unfortunately, the training methods and decision support systems developed in accord with the formal standards did not improve decision quality and did not get adopted in field settings."

Why? Traditional training focused on procedures: "When X happens, do Y." But real-world decision-making requires adaptive judgment: recognizing situation types, forming expectancies, evaluating through mental simulation, adapting when expectancies violate.

Klein's work with the TADMUS (Tactical Decision Making Under Stress) program revealed effective training approaches: "These include methods for providing stress inoculation along with approaches for individual and team decision training" (Cannon-Bowers & Salas, 1998).

## Decision Requirements vs. Procedures

**Procedural Training**:
- Here are the steps to follow
- Memorize the sequence
- Execute when situation matches trigger

**Decision Requirements Training**:
- Here are the types of situations you'll face
- Here are the cues that distinguish them
- Here's how to recognize when your assessment is wrong
- Here's how to adapt when plans fail

The difference: procedures tell you what to do; decision requirements prepare you to figure out what to do.

## Application to Agent Systems

Most AI agent systems are programmed with procedures: "When error type X occurs, run diagnostic Y, then apply fix Z." This is brittle—only works when situations exactly match training scenarios.

Klein's approach suggests training agents through:

### 1. Scenario-Based Experience Accumulation

Rather than encoding procedures, expose agents to diverse scenarios and let them build pattern libraries:

**Poor Approach**: "If connection timeout, increase pool size"

**Better Approach**: 
- Present 50 scenarios involving connection issues
- Let agent diagnose each (with feedback)
- Agent builds patterns:
  - "Connection timeout + pool at max + CPU normal → Pool too small"
  - "Connection timeout + pool at max + CPU high → Database overloaded"
  - "Connection timeout + pool below max + network latency → Network issue"

The agent learns to distinguish situation types rather than applying universal procedures.

### 2. Cue Recognition Training

Klein emphasizes that experts know what cues matter. Training should develop this:

**Exercise**: Present agents with complex scenarios and ask "what are the three most diagnostic pieces of information?"

- If agent focuses on irrelevant details → Provide feedback on what actually mattered
- If agent identifies key cues → Reinforce and explain why these cues are diagnostic

Over many scenarios, agent learns: in situation type X, cues A, B, C are diagnostic; in situation type Y, cues D, E, F matter.

### 3. Expectancy Training

Klein's RPD model depends on forming accurate expectancies: "If this is situation type X and I take action Y, outcome Z should happen."

**Training Approach**: After agent proposes action, ask "What do you expect to happen?"

- Force agent to articulate predictions
- Execute action
- Compare actual outcome to prediction
- If mismatch → Explore why expectations were wrong

This builds calibrated mental simulation: agent learns what outcomes actually follow from actions in different contexts.

### 4. Stress Inoculation

Klein mentions stress inoculation from TADMUS. For agents, this means training under resource constraints:

- Time pressure (must decide in X seconds)
- Information scarcity (some diagnostic information unavailable)
- High stakes (simulated consequences of failure)
- Ambiguity (situation cues partially match multiple patterns)

Agents that train only in ideal conditions (complete information, ample time, clear situation categories) will fail in real deployments.

## Cognitive Task Analysis for Agent Training

Klein's work on cognitive task analysis (Crandall, Klein, & Hoffman, 2006) provides methods for extracting expert decision-making knowledge. Applied to agent training:

**Interview Expert Agents/Humans**:
- What situations do you encounter frequently?
- What cues indicate each situation type?
- What actions work for each type?
- What expectancies help you monitor progress?
- What makes situations difficult to assess?

From these interviews, build:
- Situation taxonomy (comprehensive categorization)
- Cue lists (what indicates each category)
- Pattern templates (situation → action mappings)
- Difficulty factors (what makes assessment hard)

Use this knowledge to design training scenarios targeting difficult distinctions and common assessment errors.

## Training vs. Programming

Traditional view: Agent capabilities are programmed (code) or trained (machine learning parameters). Klein suggests a middle ground:

**Pattern Library as Trainable Knowledge**:
- Not hardcoded (too brittle)
- Not purely learned from raw data (too opaque)
- Structured knowledge representation shaped by experience

Training is experience accumulation that builds and refines pattern libraries. This is different from both procedural programming and statistical learning.

## Transfer Learning Through Pattern Abstraction

Klein notes experts develop patterns through repeated exposure. But agents can accelerate this through deliberate abstraction:

After solving problem P with solution S in context C:
1. What about this situation made solution S appropriate?
2. What are the essential features vs. incidental details?
3. In what other contexts would S likely work?
4. What modifications would S need for related contexts?

This deliberate reflection builds transferable patterns rather than narrow case memories.

## Team Training for Multi-Agent Systems

Klein references team decision training. For multi-agent systems:

**Cross-Training**: Agent A trained on Agent B's typical patterns
- Enables prediction of other agents' actions
- Facilitates proactive coordination
- Builds shared mental models

**Coordination Scenario Training**: Multiple agents face problems requiring coordination
- Not just individual decision quality but team coherence
- Practice handoffs, conflict resolution, mutual monitoring
- Build compatible situation assessments

**Perturbation Training**: Introduce unexpected changes during team exercises
- One agent fails mid-task
- Situation changes rapidly
- Information contradicts expectations
- Forces adaptive coordination

## Assessment-Based Training Design

Rather than covering all possible procedures, focus training on decision requirements:

**Core Decision Requirements** (from Klein's work):
1. **Situation Assessment**: Recognize situation types from cues
2. **Expectancy Formation**: Predict outcomes of actions
3. **Option Evaluation**: Mental simulation of proposed actions
4. **Adaptation**: Modify plans when expectancies violate
5. **Uncertainty Management**: Act effectively despite incomplete information

Training scenarios should target these requirements:

- **Assessment Training**: Ambiguous situations requiring cue-based discrimination
- **Expectancy Training**: Actions with non-obvious outcomes requiring prediction
- **Simulation Training**: Complex contexts where mental simulation reveals flaws
- **Adaptation Training**: Plans that require mid-execution modification
- **Uncertainty Training**: Decisions with incomplete information

## Feedback Mechanisms

Klein's research showed experts learn from expectancy violations. Agent training should emphasize:

**Immediate Outcome Feedback**: After agent acts, show actual vs. expected outcomes
- Correct expectancy → Reinforce pattern
- Violated expectancy → Trigger reassessment and pattern refinement

**Delayed Consequence Feedback**: Show longer-term impacts of decisions
- Agent chose quick fix that caused later problems → Learn to simulate longer horizons
- Agent chose robust solution that prevented future issues → Reinforce thorough analysis

**Comparative Feedback**: Show what would have happened with alternative actions
- Agent chose action A; outcome was B
- If agent had chosen action C, outcome would have been D
- Helps calibrate action selection

## Measuring Training Effectiveness

Klein's validation approach: Do trained decision-makers show characteristic expert patterns?

**For Agents, Measure**:
1. **Pattern Match Quality**: Do agent's situation assessments align with expert assessments?
2. **Expectancy Accuracy**: Do agent's predictions match actual outcomes?
3. **Decision Speed**: Can agent make rapid decisions on familiar situations?
4. **Adaptation Success**: When expectancies violate, does agent successfully reassess?
5. **Transfer**: Do learned patterns apply to novel but related situations?

If agents show these characteristics, training is working. If not, training approach needs revision.

## What Makes This Distinctive

Klein's insight: **Decision-making expertise is about building rich mental models of situation types, not memorizing procedures**. Training should develop this situation awareness and adaptive judgment, not rote execution.

For agent systems, this means: don't just program agents with procedures; expose them to rich scenarios that build pattern libraries. Effective "training" for agents is experience accumulation plus reflective abstraction, not procedure encoding or parameter optimization alone.

This challenges both traditional software engineering (write comprehensive procedures) and modern machine learning (optimize loss functions on datasets). Klein suggests a middle path: structured knowledge representations (patterns) refined through situated experience.
```

## SKILL ENRICHMENT

**Task Decomposition & Planning**:
Klein's recognition-primed decision model revolutionizes how agents should decompose complex problems. Rather than breaking problems down through logical goal-tree expansion, agents should first **assess the situation type** through pattern matching, which directly suggests decomposition strategies. A "database performance problem" pattern immediately suggests parallel investigation of query efficiency, index coverage, connection management, and resource utilization—not through forward reasoning but through pattern-associated knowledge. Skills improve by: (1) building pattern libraries linking situation types to effective decomposition strategies, (2) using situation assessment confidence to determine whether standard decomposition applies or novel analysis is needed, (3) tracking which decompositions work for which situation types to refine patterns.

**Debugging & Root Cause Analysis**:
Klein's emphasis on cue recognition and expectancy monitoring directly improves debugging. Expert debuggers don't exhaustively test hypotheses—they recognize bug patterns from diagnostic cues (error messages, stack traces, timing, affected components) and form expectancies about what they'll find. Skills improve by: (1) building libraries of bug situation patterns with associated diagnostic cues, (2) training agents to generate explicit expectancies ("if this is a deadlock, I expect to see these lock wait patterns in the logs"), (3) using expectancy violations as signals to reassess the bug category rather than just trying more fixes, (4) emphasizing rapid pattern-based diagnosis for familiar bugs while reserving analytical debugging for truly novel issues.

**Incident Response & System Recovery**:
Klein's research on time-pressured decisions is directly applicable to incident response where problems deteriorate exponentially. Skills improve by: (1) building explicit models of how different incident types worsen over time (database filling vs. memory leak vs. cascade failure have different deterioration curves), (2) implementing urgency-aware decision policies that adjust deliberation depth based on problem growth rate, (3) adopting two-phase response (immediate stabilization through pattern-matched action, then root cause analysis), (4) training agents to recognize when expectancies violate during incident response and rapidly pivot to reassessment rather than persisting with failing approaches.

**Code Review & Architecture Assessment**:
Klein's distinction between pattern-based rapid assessment and deliberate analytical evaluation applies to code review. Common issues (SQL injection vulnerability, memory leak pattern, race condition) should be recognized through pattern matching; novel architectural concerns require deliberative analysis. Skills improve by: (1) building pattern libraries of common code issues with diagnostic cues, (2) using pattern-based review for routine changes while reserving deep analysis for architectural changes or unfamiliar code, (3) generating explicit expectancies during review ("this caching approach should improve performance but might cause stale data issues") and validating through testing or monitoring.

**Security Auditing**:
Klein's cue recognition framework improves security assessment. Expert security analysts recognize vulnerability patterns from subtle cues rather than exhaustively checking everything. Skills improve by: (1) building vulnerability pattern libraries (SQL injection indicators, XSS vectors, authentication bypass patterns, privilege escalation paths), (2) training agents to identify diagnostic cues (user input handling, authentication checks, data validation), (3) using expectancy-driven validation ("if authentication is properly implemented, I expect to see these checks"), (4) recognizing when security posture doesn't match expected patterns and investigating anomalies.

**Performance Optimization**:
Klein's mental simulation approach applies to performance optimization. Rather than trying every optimization and measuring, experts simulate optimizations mentally: "If I add this index, these queries should speed up, but these writes might slow down." Skills improve by: (1) building performance pattern libraries (query optimization patterns, caching strategies, load distribution approaches), (2) training agents to simulate optimization impacts before implementing ("adding connection pooling should reduce connection overhead but might cause connection exhaustion under burst load"), (3) validating simulations against actual outcomes to refine performance models, (4) using expectancy violations to discover unexpected performance behaviors.

**Multi-Agent Coordination**:
Klein's work on shared mental models and team cognition directly improves multi-agent coordination. Skills improve by: (1) implementing shared pattern libraries so all agents recognize situations the same way, (2) enabling implicit coordination through shared understanding rather than requiring explicit task assignment for everything, (3) using expectancy sharing (Agent A expects Agent B to handle X; Agent B monitors whether X is handled), (4) recognizing coordination breakdown through expectancy violations and falling back to explicit communication.

## CROSS-DOMAIN CONNECTIONS

**Agent Orchestration**:
Klein fundamentally challenges traditional orchestration architecture. Most systems use central planners that decompose problems, evaluate options, and assign tasks. Klein shows experts don't work this way—they pattern match situations to retrieve appropriate responses. Implication: orchestration should route problems to specialist agents based on situation recognition, not decompose problems logically and allocate subtasks. The orchestrator's primary job is pattern matching (what kind of problem is this?) not planning (how do we solve it optimally?). This enables: faster routing, better specialist utilization, graceful degradation when novel situations arise (explicit fallback to analytical planning), and continuous improvement as pattern libraries expand from experience.

**Task Decomposition**:
Traditional AI approaches decompose problems through goal analysis: "To achieve X, I must accomplish Y and Z." Klein shows expert decision-makers decompose through situation recognition: "This is situation type Q, which typically requires addressing aspects R, S, and T." The difference is profound—situation-driven decomposition adapts to what the problem actually is, not what the goal structure implies. Implement by: (1) pattern libraries that associate situation types with typical sub-problems, (2) assessment-first decomposition where situation recognition drives problem breakdown, (3) parallel assessment where multiple specialist agents evaluate different aspects simultaneously, (4) integration through shared mental models rather than central coordination.

**Failure Prevention**:
Klein's emphasis on expectancy monitoring provides a powerful failure prevention mechanism. Rather than just detecting failure after it happens ("the action didn't work"), expectancy monitoring detects problems during execution ("this isn't unfolding as expected"). Implement by: (1) requiring agents to articulate explicit predictions before acting, (2) continuous monitoring of whether predictions hold, (3) treating expectancy violations as immediate signals to reassess rather than waiting for final failure, (4) building pattern libraries that include "what should I expect to see?" for different situation types and actions, (5) using accumulated expectancy violations to refine both patterns and world models.

**Expert Decision-Making Under Uncertainty**:
Klein's RPD model is explicitly designed for "limited time, uncertainty, high stakes, vague goals, and unstable conditions"—exactly the conditions many agent systems face. The key insight: expertise under uncertainty isn't about having more information or better probability estimates; it's about having rich pattern libraries that enable rapid, satisfactory decisions despite incomplete information. Implement by: (1) building pattern libraries from historical cases including uncertain contexts, (2) training agents to act on partial information when urgency demands it, (3) using mental simulation to validate pattern-matched actions even when information is incomplete, (4) monitoring expectancies to detect when uncertainty was misjudged, (5) explicit recognition of novelty (no pattern match) as a signal that uncertainty is higher than usual.

**Continuous Learning & Adaptation**:
Klein's framework provides a clear learning architecture: experience → patterns → refinement through expectancy validation. Unlike black-box machine learning, this creates transparent, auditable learning where pattern evolution can be understood and guided. Implement by: (1) structured experience capture from every agent action, (2) pattern abstraction from clusters of similar experiences, (3) confidence tracking per pattern based on validation breadth, (4) explicit expectancy comparison to refine pattern accuracy, (5) cross-agent learning where patterns discovered by one agent benefit the entire system, (6) human oversight of pattern library evolution to ensure learned patterns are sensible and safe.

---

## BOOK IDENTITY (Extended)

**What makes this book irreplaceable**:

Klein provides empirical grounding for how expertise actually works in high-stakes, time-pressured domains—not through laboratory experiments with artificial tasks, but through detailed study of real fireground commanders, pilots, nurses, and military leaders facing life-or-death decisions. This matters because: (1) it challenges 40+ years of decision theory based on laboratory tasks, (2) it validates satisficing and pattern matching as optimal strategies (not cognitive limitations), (3) it shows how intuition (pattern recognition) and analysis (mental simulation) integrate rather than conflict, (4) it demonstrates that expertise is domain-specific accumulated experience, not general reasoning ability. No other decision-making framework is as firmly grounded in real-world expertise under realistic conditions.

**The 3-5 ideas that capture the book's deepest contribution**:

1. **Pattern Recognition as Primary Decision Mechanism**: Experts don't generate and compare options—they recognize situation types from their experience repertoire, and the situation recognition directly suggests appropriate action. This makes rapid decision-making possible without sacrificing quality.

2. **Mental Simulation as Validation**: Experts evaluate single options by mentally simulating how they'll unfold in the current context, not by comparing multiple options on abstract criteria. This enables satisficing (first adequate option) while maintaining safety.

3. **Experience as Structured Knowledge**: Expertise consists of pattern libraries built from accumulated experience—not abstract principles or procedures, but rich knowledge structures linking situations, cues, expectancies, and actions. This explains why domain expertise is irreplaceable by general intelligence.

4. **Expectancy Monitoring as Error Detection**: Experts don't just act and check outcomes; they form predictions about what should happen and monitor continuously. Expectancy violations trigger reassessment before complete failure occurs. This is how adaptive expertise works.

5. **Time Changes the Problem**: In domains where problems deteriorate while you deliberate (fires, medical emergencies, system failures), the cost of deliberation isn't time—it's exponential problem growth. Satisficing is optimal because finding the "best" solution to a small problem is inferior to finding a "good enough" solution before it becomes a huge problem.