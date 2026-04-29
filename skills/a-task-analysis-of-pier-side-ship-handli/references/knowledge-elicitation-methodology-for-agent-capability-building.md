# Knowledge Elicitation Methodology: From Expert Performance to Agent Capability

## The Central Challenge

Building agent capabilities requires translating expert human performance into machine-executable specifications. This translation faces a fundamental obstacle that Grassi's thesis frames more clearly than most AI literature: experts have the knowledge, but they cannot always access it consciously. The knowledge is real — it reliably produces correct performance — but it is encoded in forms that resist direct verbal report.

> "One area of concern is with the experts themselves. Experts have implicit knowledge of how to perform a task, but they do not always have the explicit knowledge about how or why they perform the way they do." (p. 16)

This is not a problem of willingness or intelligence. It is a structural property of expertise: skills that have been highly practiced are compiled into fast, automatic, perceptual-motor routines that operate below the threshold of conscious access. The expert cannot introspect on them directly any more than you can introspect on how you balance while walking.

> "Knowledge elicitation methods should describe the function served by implicit knowledge in proficient task performance so that it should not appear that explicit knowledge is sufficient for proficient performance." (p. 16)

This is a critical epistemological point: if you only elicit explicit knowledge, you will produce a specification that appears complete but is systematically deficient. The deficiency is invisible because the expert doesn't know what they left out.

## The Critical Decision Method as Elicitation Architecture

The CDM provides a three-phase structure for progressively surfacing both explicit and implicit knowledge:

### Phase 1: Free Recall (Captures Explicit Knowledge)
The expert recounts the entire event without interruption. This captures what the expert consciously owns as "their" knowledge of the task — the science layer, the explicit procedures, the logical sequence.

This phase will produce:
- The major phases of the task
- The standard sequence of actions
- The explicit decision points that the expert is aware of
- The resources and tools the expert consciously uses

What it will miss:
- Deeply automatized cues and triggers
- Infrastructure and coordination that feels "external"
- Context-dependent variations that feel like obvious common sense
- Timing judgments and rate assessments

### Phase 2: Decision Point Probing (Surfaces Tacit Knowledge)
The interviewer retells the story and probes at each decision point: "What were you thinking here? What did you notice just before you did X? What would have been different if Y had happened?"

This phase surfaces:
- The first layer of tacit knowledge (things the expert knows but didn't think to mention)
- The conditions that trigger different methods (the content of selection rules)
- The timing signals that indicate when to transition between phases
- The indicators that something is going wrong

### Phase 3: What-If Questioning (Surfaces Assumptions and Alternatives)
The interviewer poses counterfactual scenarios: "What if X were different? What if Y were unavailable? What if you noticed Z at this point instead?"

This phase surfaces:
- Assumptions the expert was making (the tugboat gap was found here)
- The range of methods available at each decision point (not just the one the expert used)
- The conditions that make the expert deviate from standard procedure
- The boundaries of the expert's strategy (what would cause them to abandon the approach entirely)

> "In addition to the probe questions, the elicitor poses various 'What if' questions to identify any inaccuracies, differences between experts and novices, and any alternative methods." (p. 22)

## The Model/Validation Sequence

Grassi's methodology follows a specific sequence that should be the template for agent capability development:

**Step 1: Build initial model from documents and one expert**
Review existing documentation (training manuals, standing orders, prior task analyses). Use one knowledgeable expert to elaborate what documentation doesn't cover. This produces an initial GOMS-like model.

**Step 2: Externalize the model**
Produce a written/diagrammed specification that can be reviewed independently. The externalization is critical — implicit models in one person's head cannot be validated.

**Step 3: Validate with multiple independent experts**
Use CDM process with each validator. Compare their account to the initial model. Look for:
- Anything the validator immediately does that the model doesn't include
- Any phase the validator finds implausible or incorrect
- Any method the validator uses that the model doesn't offer as an option

**Step 4: Reconcile discrepancies**
Distinguish between:
- **Universal discrepancies**: Every validator agrees the model is wrong. Fix these unconditionally.
- **Majority discrepancies**: Most validators agree; some don't. Investigate whether this is an experience-level artifact or a genuine alternative.
- **Individual variations**: Each validator has different preferences. Document as alternative methods with selection rules.

**Step 5: Validate the revision**
Bring the revised model back to validators and confirm the revisions correctly addressed their concerns.

## Criteria for Selecting Validators

The thesis takes participant selection seriously:

> "Careful consideration was taken in selecting the participants for the validation process... Therefore, it was determined that the participants must at least have the following criteria: 1) that they have experience with twin or multiple-screw ships, 2) that they have at least 10 experiences of getting a ship underway or mooring to a pier, and 3) that they have recently departed from an at-sea tour onboard an operational ship." (p. 47)

The criteria are not arbitrary. Each addresses a specific threat to validity:
- "Twin or multiple-screw ships": The model represents a twin-screw ship. Validators with single-screw experience would be validating against a different context.
- "At least 10 experiences": Sufficient experience to have developed robust expertise beyond the novice stage, but varied enough to have encountered multiple situations.
- "Recently departed at-sea tour": Current experience, not memory of practice from years ago that may have been superseded by evolving doctrine.

For agent capability validation, the equivalent criteria should address:
- Domain specificity: Validators whose experience matches the scope of the capability
- Experience depth: Validators with sufficient exposure to have developed genuine expertise
- Experience recency: Validators whose practice reflects current best practices, not historical ones
- Experience diversity: Validators from different contexts, tools, frameworks, or organizational cultures to surface context-specific assumptions

## Visual Aids and Physical Grounding

The thesis uses physical models (pier and ship built from foam core) as aids during the validation process:

> "A small model of a pier area and a ship were constructed out of 'foam core,' or poster board and brought to each of the knowledge elicitation phases. The model was used as a visual aid for the participants as they walked through the pier side evolution and was successful in helping them visualize the scenario." (p. 47-48)

This is not cosmetic. Complex, multi-step, spatially-embedded tasks are poorly served by purely verbal elicitation. When the expert can manipulate a physical representation of the situation, they are able to think through the task more concretely and comprehensively — because the physical model provides the perceptual cues that trigger the tacit knowledge.

The model also served a specific methodological function:
> "The model was advantageous in that it provided a quick and efficient way for the interviewer to reset the problem or stop the expert's account of the evolution at any given position of the ship." (p. 48)

The ability to freeze the scenario at a specific state — "let's talk about exactly this moment, when the ship is at this position relative to the pier" — is critical for probing specific decision points. Without the ability to freeze and revisit, the expert's narrative flows past critical moments before the interviewer can probe them.

For agent capability development: use scenario simulations, mockups, or concrete test cases as the substrate for knowledge elicitation. Abstract verbal discussion of "how would you handle X?" produces thinner knowledge than "here is X — walk me through exactly what you would do and why."

## Grain of Analysis and Appropriate Detail Level

One of GOMS's practical advantages is the ability to adjust the level of detail to match the purpose:

> "Depending on the desired level of detail needed from the task analysis, which Card, Moran, and Newell referred to as the 'grain of analysis,' the GOMS model can be composed having more or less detail." (p. 21)

The thesis demonstrates three grains:
- **Unit task level**: Sufficient for resource planning, task routing, and high-level sequencing
- **Functional task level**: Sufficient for training curriculum design and simulator scenario development
- **Detailed task level**: Required for implementing the actual capability or building an automated system that performs the task

For agent systems, the appropriate grain depends on the purpose:
- **Routing decisions** (should this task go to Agent A or Agent B?) → Unit task level
- **Capability documentation** (what can this skill do and when?) → Functional task level
- **Skill implementation** (how should this skill execute?) → Detailed task level

Specifying everything at the detailed level is expensive and often unnecessary. Specifying everything at the unit level is insufficient for implementation. The grain should match the decision being made.

## When This Methodology Is Hard to Apply

The CDM/GOMS methodology works best when:
- Experts perform the task regularly and recently
- The task has a physical or observable component (something happens in the world that can be pointed to)
- Tasks have identifiable decision points (moments where different actions could be taken)
- The population of experts is accessible and willing to participate

It is harder to apply when:
- Expertise is very rare or experts are inaccessible
- Tasks are highly abstract or entirely internal to the expert's cognition
- Tasks vary so much by context that a generic model is difficult to construct
- The knowledge is genuinely novel and no expert has established reliable practice

For agent systems operating in genuinely novel domains (new problem types, unusual task combinations, frontier capabilities), the CDM/GOMS approach requires modification: the "expert" may be an idealized reasoner rather than an existing practitioner, and the validation must use synthetic scenarios and theoretical analysis rather than experienced practitioners' accounts.

## Practical Template: Capability Development Interview Guide

For any WinDAGs skill development, the knowledge elicitation interview should follow this structure:

**Pre-interview**:
- Send the expert the scenario specification in advance
- Ask them to bring any notes, mental models, or reference materials they'd want access to during the task
- Explain that you want their real-world practice, not the textbook answer

**Phase 1 - Free Recall (15-20 minutes)**:
- "Walk me through how you'd perform [task] in [specified scenario]"
- Do not interrupt except to ask clarifying questions about what was just said
- Record everything; don't filter yet

**Phase 2 - Decision Point Probing (20-30 minutes)**:
- Replay the expert's account phase by phase
- At each action: "What did you notice just before you did that? What triggered that choice?"
- At each assessment: "How did you know that? What did you look at? What would a wrong answer look like?"
- At each selection: "Why that method rather than [alternative]?"

**Phase 3 - What-If Questioning (15-20 minutes)**:
- "What if [key resource] wasn't available?"
- "What if [common condition] was different?"
- "What would make you stop and start over?"
- "What could go wrong that would change your approach?"

**Post-interview**:
- Produce a written specification from the interview
- Return for a second session to walk through the specification with the expert
- Look explicitly for: "This is right but incomplete," "This is in the wrong order," "This doesn't handle [case]"

This methodology, applied to multiple experts with the selection criteria described above, produces capability specifications dramatically more complete and reliable than single-expert, single-session elicitation.