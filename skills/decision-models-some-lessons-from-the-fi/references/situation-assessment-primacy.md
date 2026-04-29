# Situation Assessment as the Primary Task of Intelligent Agents

## The Inversion That Changes Everything

Klein and Calderwood's field research reveals an inversion that should restructure how we think about intelligent agent design. The classical model of decision-making places *choice* at the center — the hard problem is selecting between options. The field research shows that for proficient decision-makers, *choice is nearly automatic once situation assessment is complete*. The hard problem — where expertise actually lives, where errors actually occur, where time and effort are actually spent — is understanding what is happening.

As the authors state: "Perhaps the most important mismatch between naturalistic decision making and classical decision models is the fact that the primary effort is usually not the moment of choice but rather in situation assessment. Situation assessment means identifying and clarifying the current state of the world including goals and assumptions, which Gettys has called the 'predecision processes.'"

This is a fundamental reorientation. If situation assessment is primary, then:
- Agent architectures that are rich on option evaluation but thin on situation modeling are architecturally inverted
- Failures in agent performance should be analyzed first as situation assessment failures, not action selection failures
- Training, evaluation, and improvement efforts should target situation modeling before action generation

## What Situation Assessment Actually Is

Situation assessment is not simply "gathering data." It is an active process of constructing a coherent model of the current state that is rich enough to trigger appropriate action. Klein and Calderwood identify several components:

**1. Goal Identification**
What is actually being optimized here? In operational environments, goals are rarely isolated. The authors note: "In messy environments, goals are often interrelated in many different ways and it is dangerous to make simplifying assumptions in order to isolate goals to make the analysis work."

A fireground commander's goal is not simply "extinguish the fire" — it is "do the best job possible with the appropriate amount of resources, while preserving district coverage, preparing for possible escalation, and protecting personnel." An agent that strips this to a single objective will systematically make the wrong decisions, even if it optimizes that objective perfectly.

**2. Expectancy Monitoring**
Once a situation is classified, the expert generates *expectations* — predictions about what should happen next if the situation is what they think it is. These expectations become monitoring cues. If expectations are violated, the situation assessment is flagged for revision.

This is the mechanism by which experts catch misclassifications: not by re-examining the initial evidence, but by watching for the trajectory to diverge from what the recognized prototype predicts.

**3. Relevant Cue Identification**
Different situation types make different cues relevant. An expert doesn't process all available information equally — they know which signals matter for the situation they've recognized. This selective attention is itself a product of expertise: knowing what to look at.

**4. Assumption Tracking**
Situation assessment involves explicit and implicit assumptions about the state of the world. Expert decision-makers who are performing well can articulate these assumptions and recognize when new evidence should cause them to revise.

## The Cascade: Assessment Errors Propagate Through the Entire Decision Process

Because action selection is downstream of situation assessment, errors in assessment propagate forward with high fidelity. An agent that generates the right action for the wrong situation will fail — and it will fail in ways that look like "bad decisions" when they are actually "bad situation models."

Consider the structure of an RPD system:

```
[Incoming Signals] → [Situation Assessment] → [Situation Classification] 
     → [Action Generation] → [Mental Simulation] → [Action Execution]
```

An error at the Situation Assessment or Classification stage corrupts every subsequent step. The agent will:
- Generate actions appropriate to the *classified* situation, not the *actual* situation
- Run mental simulations against the *classified* situation's model
- Execute confidently, having "verified" the action against a wrong mental model

This is why situation assessment errors are so dangerous — they produce confident, well-reasoned, coherent wrong actions.

## How Military and Emergency Commanders Handle This

Klein and Calderwood survey several studies of command-and-control environments that all converge on the same finding. Kahan, Worley, and Stasz studying Army commanders found that "the commander's image of the current state of the battlefield and the desired state was more important than the generation and evaluation of alternative courses of action."

Anderson's analysis of the Cuban Missile Crisis is particularly striking: policy makers "spent much of their time trying to understand the dynamics of the situation and trying to anticipate how courses of action would play themselves out." Even in one of the highest-stakes decision environments in modern history, the primary cognitive work was understanding the situation, not selecting between options.

The SHOR model (Stimulus-Hypothesis-Option-Response) developed by Wohl for Navy command-and-control explicitly builds situation assessment in as a foundational stage, recognizing that option generation cannot begin until a plausible hypothesis about the current situation has been formed.

## Designing Agents That Prioritize Situation Assessment

### Principle 1: Make the Situation Model First-Class

Agents should maintain an explicit, inspectable, updateable model of the current situation. This is not just a collection of input variables — it is a structured representation that includes:
- Current state assessment (what is happening)
- Historical trajectory (what has been happening, and how we got here)
- Active goals and their inter-relationships
- Current assumptions and their confidence levels
- Active expectations (what should happen next if assessment is correct)
- Known unknowns (what information would change the assessment if available)

### Principle 2: Separate Assessment from Action Generation

Many agent architectures conflate situation processing with action selection. This creates systems that are opaque when they fail — you cannot tell whether the error was in understanding the situation or in choosing the response. Architectural separation allows:
- Independent auditing of situation models
- Targeted improvement of the most failure-prone component
- Human oversight of situation models before action is taken

### Principle 3: Build in Expectancy Violation Detection

Once a situation is classified and an action is taken, agents should actively monitor for whether the situation evolves as the classified prototype predicts. Significant deviations from expectation should trigger a reassessment cycle — not just a re-planning cycle.

The question is not just "did my action work?" but "is the situation still what I thought it was?"

### Principle 4: Treat Anomalies as Assessment Revision Triggers

Klein and Calderwood note that expert decision-makers watch for "mismatches" — signals that don't fit the current situation model. Rather than ignoring anomalies or averaging them into background noise, sophisticated agents should treat any significant anomaly as evidence against the current situation classification and trigger a reassessment.

This is one of the strongest discriminators between expert and novice performance in naturalistic settings: experts notice when something doesn't fit and revise their model; novices either miss the anomaly or explain it away.

### Principle 5: Invest in Situation Taxonomy Development

The quality of situation assessment depends on the richness of the prototype library against which current situations are matched. Agents should be designed to:
- Store past situations with full context (not just outcomes)
- Build and refine prototype abstractions across similar cases
- Track which situational features most reliably discriminate between similar prototypes
- Flag situations that don't match any known prototype (genuinely novel situations requiring deliberative rather than recognitional processing)

## The Practical Test

When an agent makes a bad decision, the diagnostic question is: **Was this an assessment failure or an action selection failure?**

- Assessment failure: The agent had an incorrect model of the situation, and the action was actually appropriate for the situation it *thought* it was in.
- Action selection failure: The agent correctly understood the situation but chose an action that was poorly suited to it.

Klein and Calderwood's research strongly suggests that the vast majority of operational failures will, on careful examination, reveal themselves to be assessment failures. This means that audit trails, debugging, and improvement efforts in agent systems should be structured to first reconstruct what the agent believed the situation to be — and only then examine whether the action was appropriate given that belief.