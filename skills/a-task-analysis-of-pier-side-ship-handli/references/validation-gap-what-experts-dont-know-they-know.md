# The Validation Gap: What Initial Models Miss and Why It Matters

## The Tugboat Revelation

The most practically important finding in Grassi's thesis is buried in a single paragraph about the validation process. It deserves to be extracted and examined in full:

> "Throughout the entire validation process there was only one discrepancy that was considered significant enough to warrant changes to the GOMS model. The discrepancy was over the use of tugboats. The initial GOMS model was originally constructed under the assumption that no tugs would be available and that the conning officer would have to use only the ship in getting underway or mooring to a pier. Therefore, the initial GOMS model did not reflect any procedures concerning the use of tugboats. However, all of the participants opted to use tugboats. Thus, they all found that the model would not be accurate if it did not provide procedures for using a tug. In fact, all of the participants agreed that, due to the severe consequences of damaging the ship, it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat. Therefore the model was changed to reflect using the assistance of a tugboat." (p. 50)

This is stunning. The initial model — built by a surface warfare officer with extensive ship-driving experience, reviewing actual Commanding Officers' Standing Orders and navy training documents — completely omitted tugboats. Every validation participant used them. Every participant agreed they were nearly mandatory. The initial model was not wrong in its logic; it was wrong in its fundamental assumptions about what actors exist in the system.

## Why This Happens

The expert who built the initial model knew about tugboats. The model was not built by someone who had never seen a tug. The expert had worked with tugs extensively. But when constructing a "generic" model without specific constraints, the expert defaulted to the most theoretically minimal case — no tug, just the ship — because tugs are *externally provided resources*, not intrinsic to the conning officer's cognitive task.

This reveals a systematic cognitive bias in single-expert knowledge elicitation: **experts naturally model the core of their domain and underspecify the supporting infrastructure**. The conning officer's expertise is ship-handling; tugs are external coordination. The expert thinks "I can explain how I drive the ship" and builds a model of ship-driving. The tug is something that *happens* in the environment; it's not something the expert cognitively owns.

But in practice, the tug is not optional infrastructure. It is a load-bearing element of virtually every pier-side evolution.

## The General Pattern

This is not unique to ship-handling. Every complex domain has its equivalent of the missing tug:

**Software development**: Initial task models of "write a feature" built by developers often omit: code review processes, deployment pipelines, monitoring and alerting setup, documentation updates, dependency management, backward compatibility consideration. These are "infrastructure" that developers experience as external to the act of coding — but all of them are necessary components of actually shipping the feature.

**Security auditing**: Initial models built by security experts often omit: communication of findings to stakeholders, prioritization based on business context, remediation guidance at the right specificity level, false positive triaging. The expert's expertise is in finding vulnerabilities; the surrounding process is "someone else's job."

**Data analysis**: Initial models often omit: data cleaning and validation, uncertainty quantification, communicating confidence intervals to decision-makers, handling missing data, verifying that analysis assumptions hold for the specific dataset.

The missing elements share common properties:
- They are *coordination* or *context* elements, not *core* elements
- The expert experiences them as given in their normal practice, making them invisible
- They are critical to success in real-world deployment
- They are supplied by systems or people external to the expert's primary role

## The CDM Solution: Probe Questions Toward What Wasn't Said

The Critical Decision Method addresses this gap through structured probe questioning. The CDM's multi-pass structure is specifically designed to surface what was omitted from initial accounts:

**First pass**: Expert recounts the task freely — captures what the expert consciously owns as "their" task.

**Second pass**: Interviewer identifies decision points and probes each — "at this moment, what did you do? Why? What did you notice just before?" — surfaces the first layer of tacit knowledge.

**Third pass**: Probe questions focus on counterfactuals — "what if X had been different? What if Y wasn't available?" — surfaces assumptions the expert didn't know they were making.

The tugboat gap would have been caught on the third pass: "What if no tug was available? How would you proceed?" This question makes visible an assumption that was invisible in the first two passes — the assumption that a tug *would* be available.

For agent system development, the equivalent is a structured challenge process during capability specification:
- "What external resources does this capability assume?"
- "What would happen if [resource X] were unavailable?"
- "What coordination with other systems happens in the background that we haven't modeled?"
- "What does this look like in the 10% of cases that don't match the 'standard' scenario?"

## Multiple Independent Validators Are Not Optional

The tugboat gap also illustrates why multiple independent validators are necessary. A single validator might not surface this issue if they happen to share the same background assumption. Five validators — all from different ships, different commands, different years of experience — unanimously agreed that tugs were nearly mandatory. The unanimity itself carries evidential weight that no single validator's opinion could.

This mirrors scientific replication: a finding from one experiment is a hypothesis. A finding that replicates across five independent experiments begins to constitute knowledge. For task models, validation by one subject matter expert produces a refined model. Validation by five independent experts with diverse experience begins to produce a reliable model.

The practical design implication for agent system capability development:

**One expert → initial specification** (expect omissions and expert-specific idiosyncrasies)
**Two to three experts → primary validation** (expect disagreements that illuminate decision space)
**Five or more experts → confidence in generality** (surfaced assumptions, found missing elements, characterized variability)

Shortcuts at this stage are not efficient. They produce capability specifications that work in demonstrations but fail in production when the scenarios diverge from the single expert's experience.

## What Multi-Expert Validation Reveals

The thesis methodology — five validators with defined selection criteria (twin/multi-screw ship experience, at least 10 pier-side evolutions, recently departed at-sea tour) — reveals several distinct categories of insight beyond the initial model:

**Category 1: Universal Omissions** (the tugboat gap)
Items every validator agreed were essential but the initial model omitted. These represent systematic blind spots in the initial model.

**Category 2: Alternative Methods**
Legitimate variations in how different experts perform the same task. Expert A always uses the jack staff for bearing; Expert B prefers landmarks. Both are correct; the selection rules differ based on individual mental models. The validated model should include both methods with appropriate selection rules.

**Category 3: Disagreements About Best Practice**
Areas where experts genuinely disagree — not just preference differences but substantive differences in judgment about what to do in specific situations. These should be documented as conditional selections with different conditions, not resolved by majority vote. The disagreement itself is important information about the task's difficulty.

**Category 4: Experience-Level Differentiation**
Methods that novices use and experts don't (scaffolded, step-by-step approaches) vs. methods that experts use that novices can't yet (integrated, rapid assessments that compress multiple steps). Both should be documented if the capability needs to serve users at different skill levels.

## The Validation Gap Applied to Agent System Capability Development

When building a new agent capability:

**Phase 1: Initial Specification**
- Work with the most knowledgeable available expert
- Use structured elicitation (GOMS-equivalent for procedures, CCI-equivalent for perceptual requirements)
- Explicitly flag all assumptions about available resources, context, and external coordination
- Document what the capability requires but doesn't provide

**Phase 2: Challenge the Assumptions**
- Systematically challenge every assumption: "what if X were unavailable?"
- Run the "what if no tug" questions for every assumed resource
- Identify the equivalent of "it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat" in the target domain

**Phase 3: Multi-Expert Validation**
- Present the specification to at least three independent experts with varying experience profiles
- Look specifically for unanimous disagreements (these are the tugboat-equivalent findings)
- Look for cases where every expert immediately does something the model doesn't account for

**Phase 4: Corner Case Elaboration**
- Run the validated model through the 10% of cases that don't fit the standard scenario
- Document which parts of the model hold and which require modification
- Build conditional branches for identified variations

**Phase 5: Live Validation**
- Test the capability in increasingly realistic conditions
- Compare agent behavior to expert behavior on the same scenarios
- Use disagreements between agent and expert as the primary source of capability improvement

The thesis demonstrates that even an experienced practitioner building a model of their own domain will produce an initial model with significant structural gaps. The validation process is not quality assurance — it is a necessary part of specification that cannot be shortcut.

## The Honest Assessment: What Any Single Model Captures

The thesis is admirably clear about the limits of its own product:

> "The resulting GOMS-like representations of the tasks used by a conning officer to get a ship safely underway from a pier and moored safely to a pier successfully represent the simple, generic scenario and in no way depicts every possible method that could have been utilized." (p. 114)

This is the right epistemic stance for any capability specification. Every model represents a specific scenario at a specific grain of detail. Claims about generality require validation across multiple scenarios. Claims about completeness require validation against independent experts who will surface the missing elements. The appropriate confidence level in any initial model is: "correct for the scenarios validated, incomplete for the range of real-world situations."

For agent system documentation, this means: capability reference documents should specify *what scenarios they were validated against*, not claim general validity. The scope of applicability is a critical piece of documentation.