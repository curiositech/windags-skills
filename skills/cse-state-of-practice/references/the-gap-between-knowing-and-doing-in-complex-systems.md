# The Gap Between Knowing and Doing: Why Understanding a Problem Doesn't Solve It

## The Illusion of Sufficient Understanding

There is a seductive belief that drives much system design: if we understand a problem well enough, we can solve it. This belief is wrong in complex domains, and cognitive systems engineering research provides a detailed account of why.

The problem is not understanding. The problem is the gap between understanding and competent action — a gap that persists even when understanding is genuinely deep, and that creates characteristic failure modes in systems (both human and artificial) that have not adequately bridged it.

Hoffman, Klein, and Laughery (2002) observe this gap explicitly: even designers who are aware of the trap of building user-hostile systems "will still fall into it." Knowing that the trap exists does not prevent falling into it. This is not a statement about stupidity or carelessness — it is a statement about the structural properties of complex work.

## Forms of the Knowing-Doing Gap

The knowing-doing gap manifests in several distinct but related forms:

### Declarative-Procedural Gap

You can know, in the declarative sense, that "when approaching a system near its performance limit, you should back off and reconfigure before attempting to optimize" — and still fail to do this in practice, because the procedural knowledge of *how* to recognize "near its performance limit," *how* to "back off," and *when* the backing-off has been sufficient to attempt optimization is not given by the declarative principle.

In cognitive psychology, this distinction maps to the difference between knowing-that (declarative knowledge) and knowing-how (procedural knowledge). Instruction that teaches only declarative knowledge — principles, concepts, rules — leaves a large gap that experience must fill. The gap between the principle and its application is where expertise lives.

### Tacit-Explicit Gap

A large portion of expert knowledge is tacit — enacted in skilled performance but not available through introspection. This gap runs in a direction opposite to the declarative-procedural gap: it is not that you know the principle but cannot apply it, but that you *can* apply it without being able to articulate the principle.

For system design, the tacit-explicit gap creates a specific danger: designers build systems that support the explicit (articulable) part of expert knowledge while missing the tacit part. The system then fails at exactly the moments when tacit expertise would have made a difference — the subtle recognition of anomaly, the context-sensitive modulation of standard procedure, the intuitive override of an apparently valid rule.

### Comprehension-Application Gap

Even when someone fully understands a concept — can define it, apply it to canonical examples, explain its implications — they may fail to apply it in novel situations where the concept is relevant but not obviously so. This is sometimes called the "inert knowledge" problem: knowledge that is held in a form that cannot be activated in the situations where it is needed.

For agent systems, this manifests when an agent has access to relevant knowledge (in training, in retrieved documents, in its context) but fails to apply it because the connection between the current situation and the relevant knowledge is not explicit. The agent "knows" the relevant fact or principle but does not connect it to the current problem.

### Simulation-Reality Gap

Complex systems behave differently in deployment than in the designed and tested scenarios. This gap is not just a matter of testing coverage — it reflects a fundamental property of complex systems: their behavior in novel situations cannot be fully predicted from their behavior in tested situations, because the novel situations involve combinations and interactions that were not present in testing.

This gap is why "the road to user-hostile systems is paved with designers' user-centered intentions" — the designers understood the system, tested the system, and believed it was well-designed. The gap appeared between their understanding (developed in controlled conditions) and the system's actual behavior (in the variable, unpredictable real world).

## The Gap in Context-Sensitivity

One of the most practically important manifestations of the knowing-doing gap in complex work is the gap between knowing a rule and knowing when the rule applies.

Real expert knowledge is not just a collection of rules — it is a collection of contextually indexed rules: "this rule applies in this type of situation, and does not apply in that type of situation." The index is the crucial part. A novice who has learned the rule without learning the index will apply it in the wrong contexts. A system that encodes the rule without encoding the index will behave incorrectly in contexts where the rule doesn't apply.

Rasmussen's Skills-Rules-Knowledge (SRK) framework provides a useful lens here. At the rule-based level of performance, practitioners apply rules that map situations to responses. But the rule is only reliable if the situation recognition is correct. If the situation is misclassified — if a novel situation is erroneously classified as a familiar type — then the rule that fires is the wrong rule, and the response may be harmful.

This is one mechanism for the characteristic failures that cognitive systems engineering calls "rule-based mistakes": the rule was applied, the rule would have been correct for the situation it was designed for, but the situation turned out to be different from what the rule-applier believed. The error was in the situation recognition, not the rule application.

## The Gap in Agent Systems: Specific Manifestations

### Confident Application of Patterns in Novel Contexts

Language models and agent systems that have learned patterns from training data will apply those patterns in new contexts — sometimes correctly, sometimes not. The system cannot always distinguish between "this is a situation where the pattern I've learned applies" and "this is a superficially similar situation where the pattern does not apply." The system has the pattern (the declarative/procedural knowledge) but lacks the contextual indexing that would prevent misapplication.

This is a direct analog of the rule-based mistakes that Rasmussen identified in human performance. The solution is not to remove the patterns — patterns are valuable. It is to build richer contextual recognition that limits pattern application to appropriate contexts.

### Capability Without Calibration

An agent system may have genuine capability — it can perform the task correctly in situations within its competence — while lacking calibration: an accurate model of when it is within its competence and when it is not. The knowing-doing gap here is: the system knows how to do X (in the right situations) but does not know when it is in a situation where it can reliably do X.

Well-calibrated systems express appropriate uncertainty when operating near their competence boundaries. Poorly calibrated systems express uniform confidence regardless of the actual difficulty or novelty of the situation. The knowing-doing gap in calibration produces the most dangerous failure mode: confident wrong answers.

### Planning Without Execution Knowledge

Orchestrating agents can develop sophisticated plans for complex tasks — plans that correctly identify the subtasks required, their dependencies, and the agents best suited to each. But generating a plan and executing a plan are different cognitive activities, and the knowing-doing gap can appear between them.

The plan represents the orchestrating agent's understanding of what needs to happen. The execution is performed by agents operating in their specific local contexts. The gap between the plan's assumptions and the actual conditions the executing agents encounter is the simulation-reality gap — and it is why plans always require interpretation and adaptation in execution.

This is not a failure of planning. It is a structural feature of the planning-execution relationship in complex systems. The appropriate design response is to treat plans as *communicative acts* that express intentions, not as *programs* that specify behavior. Executing agents should be equipped to interpret the intention, not just follow the specification.

## Bridging the Gap: Design Principles

### 1. Simulate Before You Specify

Simulation — whether mental simulation (as in the RPD model) or computational simulation (as in agent testing) — is the primary mechanism for bridging the comprehension-reality gap. By simulating behavior in specific scenarios before specifying it, designers discover mismatches between their understanding and the system's actual behavior in advance of deployment.

For agent systems: before deploying a new capability or coordination protocol, test it against a diverse set of specific scenarios — especially unusual, edge-case, and adversarial scenarios. The goal is not to confirm that the system works in normal conditions (it probably does) but to discover where the comprehension-reality gap appears.

### 2. Design for Competence Boundary Awareness

Agent capabilities should be designed with explicit models of their own competence boundaries — the conditions under which they can be expected to perform reliably, and the conditions under which their performance should be treated with skepticism.

This requires:
- Diverse evaluation against cases ranging from easy to very difficult
- Explicit tagging of situations that fall near or outside competence boundaries
- Escalation protocols for situations near competence boundaries
- Honest expression of uncertainty (not uniform confidence)

### 3. Invest in Contextual Indexing, Not Just Pattern Learning

The gap between knowing a pattern and knowing when to apply it is a contextual indexing problem. Agent systems should be designed to build rich contextual representations that limit pattern application to appropriate contexts. This requires training cases that include explicit contextual features, annotated with which patterns apply and which don't — not just with correct outputs.

### 4. Treat the Knowing-Doing Gap as a Design Problem, Not a Training Problem

It is tempting to respond to the knowing-doing gap by increasing training — more examples, more cases, more exposure. Training is valuable, but it addresses only part of the gap. The part that remains is structural: the mismatch between the representations in which knowledge is held and the representations required for action.

Structural solutions include:
- Redesigning the interface between knowledge and action (making relevant knowledge more readily applicable)
- Building explicit bridges from principles to specific situations (worked examples with detailed contextual annotation)
- Designing practice protocols that specifically target the gap (cases designed to reveal misapplication of rules in wrong contexts)

### 5. Maintain Epistemic Humility at System Level

The deepest response to the knowing-doing gap is epistemic humility: building systems that acknowledge what they don't know, that flag when they are operating in unfamiliar territory, and that treat confident action under genuine uncertainty as a design failure rather than a success.

This is harder to achieve than it sounds. Agent systems (like human experts) tend to be more confident than they should be. The organizational pressure to project confidence — because uncertain systems are harder to trust and sell — pushes against calibration. But a system that is well-calibrated is genuinely more trustworthy than a system that projects uniform confidence, because the former's uncertainty flags are informative and the latter's are not.

## The Meta-Lesson

The knowing-doing gap, in its broadest form, is this: building a system that demonstrates competence is not the same as building a system that can be relied on. Demonstrated competence in tested conditions is evidence of underlying capability, but it is not a guarantee of reliable performance in deployment conditions.

The gap between tested performance and deployment performance is the gap between the designer's understanding and the full variability of the real world. Closing this gap requires:
- Richer testing across more diverse and adversarial conditions
- Explicit modeling of competence boundaries
- Honest calibration of uncertainty
- Design for graceful degradation when conditions exceed tested ranges
- Ongoing monitoring and adaptation in deployment

This is not pessimism about agent systems — it is realism about complex systems. The payoff for taking this gap seriously is systems that actually work reliably in the messy, variable, surprising real world, rather than systems that work in demonstrations and disappoint in deployment.