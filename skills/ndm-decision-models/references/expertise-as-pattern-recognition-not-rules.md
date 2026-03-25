# Expertise as Pattern Recognition: Why Rules Alone Cannot Encode Domain Knowledge

## The Deceptive Transparency of Rules

Klein and Calderwood identify one of the most consequential illusions in the design of knowledge-based systems: rules look complete when they are not.

Consider a rule of the form: *If situation X, then do action Y.*

The consequent — *do Y* — seems like the hard part. It is the action, the output, the thing that happens in the world. Surely encoding the right actions is where expertise is captured?

The authors identify this as a fundamental misunderstanding: "One of the deceptive qualities of rules is that the consequent follows so naturally from the antecedent; it is not always readily apparent how much expertise is needed in order to recognize when the antecedent has occurred."

The expertise is not in *Y*. It is in recognizing that *X* is true.

A novice firefighter and an expert commander might both "know" the rule: *If a fire is spreading toward an unprotected exposure, redirect water to the exposure.* The novice fails not because they would apply the wrong action to this rule but because they don't reliably recognize when a fire's spread trajectory is threatening an exposure, which exposures are unprotected, or what combination of conditions constitutes the antecedent. The rule's antecedent — "situation X" — is a condensed pointer to a rich pattern-matching capability that only experience can develop.

## What Pattern Recognition Actually Consists Of

When an expert "recognizes" a situation, they are doing something far richer than checking a simple condition. Recognition in the RPD framework involves:

**Prototype Matching**: Does this situation resemble a known category of situations? The match is not exact — it is a similarity judgment across multiple dimensions simultaneously. The expert is asking "is this fundamentally *like* situations I've handled before?"

**Analogue Retrieval**: Does this situation remind me of a *specific prior case*? Analogical reasoning allows experts to transfer learning from one particular experience to a new, similar situation, even when the new situation doesn't exactly match any stored prototype.

**Expectancy Generation**: Once a situation is classified, the expert automatically generates predictions: what should happen next, what cues should be visible, what trajectory the situation should follow. These predictions become the monitoring framework for detecting whether the classification was correct.

**Goal Activation**: Recognition carries with it an implicit goal set appropriate to the situation type. The expert knows what they're trying to accomplish in this situation without needing to derive it from first principles.

**Action Priming**: Recognition pre-activates likely responses. The expert doesn't generate action candidates randomly from a pool — they generate them in order of appropriateness to the recognized situation type.

All of this happens rapidly, often below the threshold of conscious deliberation. This is why experts appear to "know" what to do without being able to fully articulate why. They are not accessing a rule set; they are pattern-matching against an experiential library that encodes the answer implicitly.

## The Novice-Expert Divide Is Primarily in Antecedent Recognition

The research surveyed by Klein and Calderwood consistently shows that novice-expert differences are concentrated in situation assessment — in the recognition of antecedent conditions — not in knowledge of appropriate responses.

Rasmussen's three-level taxonomy (sensorimotor, rule-based, knowledge-based) is useful here. Rule-based behavior is what RPD models as recognitional decision-making. The point is that moving from knowledge-based (slow, deliberative, uncertain) to rule-based (fast, pattern-triggered, confident) requires building up a library of recognized situation types against which current situations can be matched. This library is built through experience, not through study of rules.

This has profound implications for understanding where novice agents will fail:
- They will have the rules.
- They will know the actions.
- They will fail to trigger the right rules at the right times because they cannot reliably classify the situations they encounter.

And they will fail *confidently* — because once a (wrong) situation classification is made, the downstream rule application and action generation will proceed normally.

## How Experience Builds Pattern Libraries

The research suggests that expertise develops through a specific kind of experience that is not simply "doing the task many times." Expert pattern libraries are built through:

**Varied case exposure**: Seeing many different instances of similar situations, building up both prototype categories and their variations.

**Outcome feedback**: Understanding how situations evolved — what the trajectory was, what actions worked, what unexpectedly went wrong. Without outcome tracking, experience does not generate reliable patterns.

**Expectancy violation processing**: Moments where the situation evolved differently than expected are particularly valuable. These are the cases that refine the boundaries between situation types and update prototype templates.

**After-action reflection**: The post-hoc analysis of decisions — what did I think was happening, what was actually happening, where did my situation model diverge from reality — is where pattern refinement occurs.

For agent systems, these four mechanisms suggest a learning architecture:
1. Varied exposure to labeled situations (not just repeated exposure to typical cases)
2. Full trajectory tracking, not just immediate outcome recording
3. Specific attention to prediction failures as learning signals
4. Explicit comparison of the agent's situation model against ground truth, post-resolution

## The Case-Based Architecture: Building Machine Pattern Libraries

Klein and Calderwood explicitly point toward case-based reasoning as the appropriate architecture for supporting recognitional decision-making: "Prior cases could be stored in an analogy bank so that they could be retrieved individually, or there could be a means of retrieving and synthesizing several cases at once, to allow prototype matching."

A well-designed case library for an agent should store, for each past situation:
- The contextual features that characterized the situation at the time of decision
- The situation classification that was applied
- What expectations were generated from that classification
- Which expectations were confirmed and which were violated
- What action was taken and what the trajectory was
- The revised situation understanding, if the initial classification was wrong

This is richer than simple experience replay. It is structured to support both prototype abstraction (what do many similar cases share?) and individual case retrieval (does this remind me of a specific past case?).

## The Critical Role of Discriminating Features

Expertise in pattern recognition involves knowing not just what situations look like but which features most reliably discriminate between situation types that could easily be confused.

In fire behavior, for example, a fire's color, the behavior of smoke, the structural sounds of the building, the trajectory of heat spread — these are the discriminating features that distinguish situations that look similar but require different responses. Expert fireground commanders attend to exactly these features; novices attend to less diagnostic signals.

For agent systems, this points to a feature engineering challenge: **which features of incoming situations most reliably discriminate between situation types in the agent's domain?** These are the features that should receive highest attention and most careful processing. They are also the features that should be most prominently displayed to any human oversight system, since they are where the most consequential classifications are made.

## Encoding Expertise: What Goes Wrong

When organizations or developers try to encode expert knowledge into systems (expert systems, rule bases, decision trees), they typically:

1. **Capture the rules correctly** — experts can articulate what they do given a recognized situation
2. **Capture the antecedents incompletely** — experts cannot fully articulate how they recognize that they're in a given situation
3. **Create systems that work well in prototype situations** — cases that clearly match one situation type
4. **Create systems that fail at boundaries** — cases where situation types overlap, where familiar cues are absent, or where novel combinations occur

The result is a system that performs impressively in demonstrations (which naturally use clear prototype cases) and fails unexpectedly in deployment (where boundary cases are common).

The remedy is not to elicit better rules. It is to expose the system to the full distribution of cases, including ambiguous ones, near-misses between categories, and genuine anomalies — and to build situation assessment capabilities that can handle this distribution rather than just the clean prototype cases.

## Practical Implications for Agent Development

**For training agents**: Don't train primarily on clear-cut cases. Deliberately include ambiguous cases, near-misses between categories, and situations where the correct classification is counterintuitive. The hard cases are where expertise is built.

**For evaluating agents**: Don't evaluate on prototype cases. Evaluate on boundary cases — situations that genuinely fall between recognizable categories. This is where novice and expert agents diverge most dramatically.

**For designing agent architectures**: Build in the equivalent of Rasmussen's three levels. Let agents use fast pattern-matching (recognition) for situations that match known prototypes, and reserve slower deliberative processing for situations that are genuinely novel or anomalous. The switching mechanism — "am I in a familiar situation or an unfamiliar one?" — is itself a critical capability to build and test.

**For debugging agent failures**: When an agent makes a wrong decision, start by asking: "What did the agent think the situation was?" If the situation model was wrong, no amount of action-selection improvement will fix the underlying problem. The fix is in the antecedent recognition, not the rule.