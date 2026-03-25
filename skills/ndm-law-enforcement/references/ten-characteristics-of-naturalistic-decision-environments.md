# The Ten Characteristics of Naturalistic Decision Environments and Their Agent System Implications

## Why Lab Decision Theory Fails in the Field

Classical decision theory was built in laboratories. Participants had clearly defined choices, known outcome probabilities, and unlimited time to deliberate. The research produced elegant formal models of rational choice — and those models consistently failed to predict what expert decision-makers actually do in the field.

The NDM (Naturalistic Decision Making) paradigm emerged from this failure. NDM researchers went into the field — firegrounds, hospital trauma units, naval command centers, airline flight decks — and simply watched what expert decision-makers did under real conditions. What they found was a set of environmental characteristics that reliably distinguish real-world decision environments from laboratory simulations. These characteristics, taken together, explain why the strategies that work in the lab fail in the field, and why new cognitive strategies were needed.

Zimmerman (2006) synthesizes a set of ten characteristics identified across multiple NDM research programs that define what makes a situation a "naturalistic decision making situation" rather than a conventional decision problem:

1. Ill-defined goals and ill-structured tasks
2. Uncertainty, ambiguity, and missing data
3. Shifting and competing goals
4. Dynamic and continually changing conditions
5. Action feedback loops (real-time reactions to changed conditions)
6. Time pressure
7. High stakes (risk)
8. Multiple players (team factors)
9. Organizational goals and norms
10. Experienced decision makers

Not all ten need to be present for a situation to qualify as NDM. But the combination of several creates a qualitatively different decision environment — one that demands cognitive strategies that are invisible in laboratory settings.

## Characteristic-by-Characteristic Analysis

### 1. Ill-Defined Goals and Ill-Structured Tasks
"When a decision maker encounters a task with ambiguous or missing data, they cannot structure the goals or efficiently frame the task, which leads to uncertainty" (p. 7).

The decision-maker cannot know, at the outset, what "success" looks like because the task does not specify it clearly. The goal emerges through the decision process itself. In a police scenario: the goal shifts from "respond to kidnapping report" to "locate victim" to "negotiate with armed suspect" to "prevent casualty" — potentially all within minutes, each reframing what actions make sense.

**Agent implication**: Task framing is not given — it is discovered through execution. An agent that commits too early to a fixed task interpretation will become progressively misaligned with actual goals. Goal representation must remain malleable during execution.

### 2. Uncertainty, Ambiguity, and Missing Data
Lipshitz and Strauss (1997) classified uncertainty as:
- **Inadequate understanding**: The decision-maker doesn't know what's happening
- **Undifferentiated alternatives**: Options exist but can't be distinguished
- **Lack of information**: Key data is missing

They found that *subjective* uncertainty (inadequate understanding and undifferentiated alternatives) had more impact than *objective* lack of information. Understanding what you don't know is itself a cognitive achievement.

"Klein (1998) contends that once the inevitableness of uncertainty is accepted, decision makers can focus on the task of using the information that is available to reach effective decisions" (p. 7).

**Agent implication**: Uncertainty acknowledgment is not failure — it is a prerequisite for effective action under incomplete information. Systems that cannot represent or communicate their own uncertainty will make systematically overconfident decisions.

### 3. Shifting and Competing Goals
Goals compete within a timeframe (save the victim vs. arrest the perpetrator) and shift across time (contain the fire vs. retreat and save lives). Decision-makers must prioritize dynamically, not according to a fixed utility function.

**Agent implication**: Goal prioritization is a real-time process, not a preprocessing step. Multi-goal agent systems need mechanisms for detecting goal conflicts and adjusting priority weighting based on current conditions.

### 4. Dynamic and Continually Changing Conditions
"Unlike the stable, unchanging tasks presented in traditional decision making research, most real-world tasks change as they unfold... often... continuously, rapidly, and dramatically" (p. 8).

The firefighter whose plan is based on wind direction must revise when wind direction changes. The plan is not wrong — the world changed. The decision-maker must update, not just execute.

**Agent implication**: The distinction between "plan generation" and "plan execution" is artificial in dynamic environments. Execution is continuous planning. Architecture should reflect this — treating the execution phase not as plan-following but as plan-following-with-monitoring.

### 5. Action Feedback Loops
"During dynamic events, individuals make decisions in order to change the situation while it is still in progress. Not all decisions are made with the intent to resolving the task, instead many decisions are made in order to clarify the situation or influence the task conditions in a positive manner" (p. 8).

Actions taken early in an event change the state space for subsequent decisions. This is not sequential decision-making — it is a loop where actions generate information that modifies assessments that generate new actions.

**Agent implication**: Action outcomes should explicitly update the agent's working model of the situation. This is different from just tracking task progress — it means that the result of taking action X provides evidence about the underlying state of the world, which should feed back into the next decision.

### 6. Time Pressure
"When decision makers have limited time to make decisions, they do not have opportunity to evaluate their action choice prior to acting. Time pressure can distort perceptions of events and alter subsequent outcome predictions" (p. 9).

Time pressure changes the cognitive strategies available. Extended deliberation becomes impossible; pattern recognition becomes the primary mode; the costs of over-analysis increase.

**Agent implication**: Agent systems must have explicit time budgets for deliberation. The cost of deliberation is not just computational — it is temporal, and in real-time systems, temporal costs compound. The satisficing framework (see separate document) is the appropriate response.

### 7. High Stakes
"The presence of time pressure and high stakes put severe constrictions on the decision process, making the cost of deliberation and choice evaluation prohibitively high compared to the costs of engaging in actions that may do little more than prevent the worst outcomes" (p. 9).

High stakes changes the decision-making objective. The goal shifts from maximizing expected value to avoiding the worst outcomes — a different mathematical objective that justifies different strategies.

**Agent implication**: Stakes-aware decision-making requires an explicit model of what constitutes a "worst outcome" in this domain. Systems should be designed to weight catastrophic failure avoidance differently from ordinary performance optimization.

### 8. Multiple Players
Team factors introduce coordination complexity, communication overhead, and distributed decision-making challenges. Individual decision-quality can be undermined by team dysfunction.

**Agent implication**: This characteristic maps directly onto multi-agent system design. The NDM literature on team factors covers shared mental models, shared situation awareness, communication protocols, and authority relationships — all directly relevant to agent orchestration.

### 9. Organizational Goals and Norms
"Police organizations, along with the judicial system and political organizations, can exert influence on the decisions made by police officers" (p. 10).

Decisions are not made in an organizational vacuum. Institutional constraints, norms, and accountability structures shape what options are considered and what risks are acceptable.

**Agent implication**: Agents operating in organizational contexts need representations of the constraints they operate within — not just task requirements but the institutional norms that bound acceptable actions. This is the alignment problem at the micro scale.

### 10. Experienced Decision Makers
NDM environments characteristically involve *experts* — people who have developed deep domain knowledge and sophisticated pattern recognition through extended experience.

"The more experienced the decision maker, the more apt they are to effectively handle decision making under uncertainty" (p. 7).

**Agent implication**: Expertise is not a property of intelligence in the abstract — it is a property of accumulated domain-specific experience. An agent's effectiveness in naturalistic environments is bounded by the richness of its domain experience representation.

## The Compound Effect

The ten characteristics interact multiplicatively rather than additively. Uncertainty alone is manageable. Time pressure alone is manageable. High stakes alone is manageable. But uncertainty + time pressure + high stakes + dynamic conditions + ill-defined goals + team coordination requirements creates a qualitatively different decision environment in which each characteristic exacerbates the others.

"The combination of these characteristics makes NDM situations easily identifiable and introduces unique contextual demands into the decision making situation" (p. 6-7).

For agent systems, this means that **evaluation in simplified environments systematically underestimates difficulty in operational environments**. A system that performs well on a task with two or three NDM characteristics may fail on the same task type when all ten are present.

This is a warning against benchmarking in controlled settings: the characteristics that drive real-world failure are precisely the ones that controlled benchmarks strip away.

## A Diagnostic Framework for Task Complexity

The ten characteristics can function as a diagnostic checklist for assessing task difficulty before deploying an agent system: