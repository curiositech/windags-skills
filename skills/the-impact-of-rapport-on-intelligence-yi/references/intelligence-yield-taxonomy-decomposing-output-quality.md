# Intelligence Yield Taxonomy: Decomposing Output Quality Into Measurable Sub-Types

## The Problem with Monolithic Quality Metrics

When an AI agent system evaluates the quality of its outputs, it typically does so using a single aggregate metric: accuracy, completeness, user satisfaction, task completion. These monolithic metrics obscure what might be the most important analytical question: **which dimensions of quality are being achieved, which are being sacrificed, and which elicitation behaviors predict which quality dimensions?**

Nunan et al. (2020) offer a powerful methodological alternative: decomposing intelligence yield into a taxonomy of five distinct detail types, then correlating each type separately with each rapport component. The result reveals a granular, differentiated picture that the aggregate metric cannot show — and that turns out to have significant implications for both training and operational design.

## The Five Intelligence Yield Categories

The paper's intelligence yield coding scheme (adapted from Hope, Mullis, & Gabbert, 2013; Milne & Bull, 2002; Wessel et al., 2015) identifies five distinct types of information that a source may provide:

### 1. Surrounding Details
"Information about the setting (e.g. locations)"

Surrounding details answer the question: *where?* They establish the spatial and environmental context of the events being reported — the physical locations where activities took place, the settings that provide structural context for understanding what happened.

For intelligence purposes, surrounding details are critical for operational planning (targeting a specific location for surveillance), for verification (checking a location against other evidence), and for building a spatially coherent model of criminal activity.

### 2. Object Details
"Items that were discussed (e.g. a phone, drugs, money)"

Object details answer the question: *what?* They identify the artifacts involved in the events being reported — the tools, substances, commodities, documents, or instruments that featured in criminal activity.

Object details are often the most directly actionable intelligence: a specific phone model and number enables interception; a specific drug consignment size enables seizure planning; a specific sum of money enables financial investigation.

### 3. Person Details
"Information relating to people (e.g. names, person descriptions)"

Person details answer the question: *who?* They identify the individuals involved — names, descriptions, roles within criminal networks, relationships to other known persons.

Person details are the network layer of intelligence: they map the social structure of criminal activity, identify key nodes (principals, facilitators, intermediaries), and enable the linking of disparate pieces of information into a coherent picture of organizational structure.

### 4. Action Details
"Information about activities (e.g. criminal offences, driving)"

Action details answer the question: *what happened?* They describe behaviors, events, and processes — the actual activities that constitute criminal conduct.

Action details are the narrative backbone of intelligence — they describe *what is happening*, as distinct from where, what artifacts are involved, or who the actors are. They are the most complex to elicit because they require the source to construct a coherent account of dynamic events rather than simply naming static entities.

### 5. Temporal Details
"The time (e.g. dates, days, years)"

Temporal details answer the question: *when?* They place events on a timeline — specific dates, times of day, durations, sequences.

Temporal details are the chronological skeleton of intelligence. They are critical for establishing patterns (regular activity at a specific time), for operational timing (when to intercept an activity), and for chronological verification (do multiple sources agree on the timing of key events?).

## The Analytic Power of Decomposition: An Example

The paper provides an example that illustrates how this coding system works in practice:

"'around 9 pm (one temporal IY) she (one person IY) was driving (one action IY) a car (one object IY) and dealing (one action IY) drugs (one object IY) in London (one surrounding IY)'" (p. 10).

A single sentence — "around 9 pm she was driving a car and dealing drugs in London" — yields seven discrete intelligence units: one temporal, one person, two action, two object, one surrounding. This granular counting makes it possible to see the *structure* of what a source provides, not just its volume.

Moreover, it reveals what is *missing*. If a source consistently provides high volumes of person and object details but almost no temporal or action details, that suggests a specific elicitation gap: the source may know a great deal about the actors and artifacts but cannot reconstruct the timeline or the activity sequence. This might be a memory limitation, a gap in their direct observational access, or a sign that their knowledge is secondhand.

## The Differential Correlation Findings: What Predicts What

The paper's most analytically sophisticated contribution is the correlation analysis between rapport components and yield subtypes:

| | Surrounding | Object | Person | Action | Temporal | Overall |
|---|---|---|---|---|---|---|
| **Attention** | .64*** | .77*** | .76*** | .81*** | .60*** | .83*** |
| **Positivity** | .18 (NS) | .12 (NS) | .17 (NS) | .23* | .06 (NS) | .19 (NS) |
| **Coordination** | .12 (NS) | .18 (NS) | .18 (NS) | .24* | .23* | .21* |

The pattern that emerges is striking:

**Attention universally predicts all five yield types** — and predicts them all strongly. The weakest attention-yield correlation is temporal (r = .60), and even that is a strong effect. Attention's strongest prediction is action details (r = .81), which makes intuitive sense: action details require the most elaborate narrative construction, and they are elicited most effectively by active probing and engagement.

**Positivity is almost entirely unrelated to yield type-by-type** — the single exception being a weak correlation with action details (r = .23, p < .05). Even this correlation is weak and may reflect that the motivational and comfort-establishing function of positivity slightly helps sources produce action narratives, which require more cognitive and emotional investment.

**Coordination specifically predicts action and temporal details** — the two yield types that are most directly about *what happened and when*. This pattern is interpretable: action and temporal details form the narrative spine of an intelligence account. They require the source to reconstruct a coherent chronological sequence of events. Coordination behaviors — particularly process framing, appropriate pausing, and explicitly encouraging the source's account — create the structural conditions under which that sequence can be elicited without disruption or distortion.

## Why This Pattern Matters

The differential prediction pattern tells us something important about the *functional relationships* between rapport components and information types:

**Attention drives yield across all information types** because active processing, probing, and summarizing help the source retrieve any kind of information more completely and in greater detail.

**Coordination drives specifically narrative information** (action and temporal) because narrative construction is the most cognitively demanding retrieval task, and coordination behaviors provide the structural support that complex memory retrieval requires: a clear starting point, a shared goal, uninterrupted space for narrative unfolding, and appropriate pacing.

**Positivity does not strongly drive any specific information type** — reinforcing the interpretation that its function is *relational maintenance* rather than *information extraction*. It keeps the channel open; it does not help any particular kind of information flow through it.

## Designing Output Quality Taxonomies for Agent Systems

The intelligence yield taxonomy offers a methodological model for AI agent system design that is more broadly applicable than its specific intelligence context.

### The Core Principle: Decompose Your Output Into Typed Categories

For any agent capability that produces complex outputs, the question should be: **what are the structurally distinct types of content that constitute a complete, high-quality output?**

For a debugging agent:
- **Symptom details**: What is the observable failure?
- **Causal details**: What mechanism is producing the failure?
- **Context details**: What environmental conditions are present?
- **Action details**: What sequence of events led to the failure state?
- **Temporal details**: When did the failure first appear? Is it consistent or intermittent?
- **Fix details**: What changes would address the root cause?

For a research synthesis agent:
- **Claim details**: What factual assertions are established?
- **Source details**: What sources support each claim?
- **Confidence details**: What is the epistemic status of each claim?
- **Conflict details**: Where do sources disagree?
- **Gap details**: What is unknown or underresearched?
- **Implication details**: What follows from the established claims?

For a requirements elicitation agent:
- **Functional details**: What must the system do?
- **Constraint details**: What limitations apply?
- **User details**: Who will use the system and how?
- **Priority details**: What is most important?
- **Assumption details**: What beliefs are embedded in the requirements?
- **Risk details**: What could go wrong?

### Using the Taxonomy to Identify Elicitation Gaps

Once you have a typed output taxonomy, you can analyze your agent's outputs against it systematically. If the agent consistently produces high volumes of some output types but almost none of others, you have identified an elicitation gap.

For example: if a debugging agent reliably identifies symptoms and causal mechanisms but never produces temporal details (when did this start? is it consistent or intermittent?), you know that the agent's elicitation behaviors are not probing for temporal information. The fix is not to improve the agent's debugging capability in general — it is to add specific probing behaviors that target temporal information.

This is the operational value of the differential correlation finding: it allows you to trace output gaps back to specific behavioral deficits, rather than treating "insufficient output quality" as a homogeneous problem.

### Weighting the Taxonomy by Downstream Value

The paper implicitly treats all five yield types as equally valuable for counting purposes. In practice, different information types may have different downstream value depending on the operational context.

For an agent system, the taxonomy should be weighted by the downstream value of each output type in the specific context. This weighting then becomes a design input: allocate elicitation effort in proportion to the downstream value of each output type.

If action details (what happened) are most critical for your downstream processing, invest in coordination behaviors (which specifically predict action yield). If person details (who is involved) are most critical, invest in attention behaviors (which have the strongest correlation with person yield at r = .76).

### Temporal and Sequential Information: The Hardest to Extract

The paper's finding that coordination specifically predicts temporal yield suggests a general principle about sequential and temporal information: it is among the hardest to extract, requires the most structured elicitation support, and is most easily disrupted by poor elicitation practices (interruption, premature closure, inadequate pacing).

This is consistent with what is known about autobiographical memory: chronological reconstruction of event sequences is cognitively demanding, prone to error, and sensitive to elicitation conditions. Sources (human or artificial) often know *what* happened but struggle to reconstruct *when* it happened or *in what order*.

For agent systems that need to extract chronological or sequential information — debugging timelines, event sequences, causal chains — the design prescription is clear: invest in coordination behaviors, provide structured frameworks for temporal ordering (e.g., explicit timeline tools), and allow more time for reconstruction than for static information retrieval.

## The Mean Yield Distribution: What Gets Produced by Default

The paper reports mean yield across the five detail types:

| Detail Type | Mean (per call) | SD |
|-------------|-----------------|-----|
| Person | 26.89 | 21.87 |
| Action | 25.56 | 20.37 |
| Object | 14.48 | 12.95 |
| Surrounding | 11.74 | 12.74 |
| Temporal | 6.11 | 4.92 |

Person and action details dominate spontaneous output, while temporal details are produced least. This distribution reflects the structure of natural narrative — people naturally report *who* and *what happened*, and naturally provide less temporal precision.

This baseline distribution has an important implication for elicitation design: **the information types that are produced least by default are typically the ones that require the most active elicitation investment.** Temporal details won't be provided unless they are specifically probed for. Surrounding details (specific locations) require geographic probing. Object details require artifact-specific questioning.

For agent systems: **don't assume that users or upstream agents will spontaneously produce all output types in adequate quantities.** Analyze the baseline distribution of your system's outputs, identify which types are chronically underproduced, and build specific elicitation behaviors that target those gaps.

## Conclusion

The intelligence yield taxonomy is not a bureaucratic categorization exercise — it is an analytical tool that makes invisible structure visible. By decomposing output quality into typed categories and correlating each type with specific elicitation behaviors, the paper makes it possible to:

1. Diagnose specific output deficits (not just overall quality failures)
2. Trace deficits to specific behavioral gaps
3. Design targeted interventions that address specific information type shortfalls
4. Prioritize elicitation investment based on the downstream value of different output types

For AI agent systems, this methodology translates directly into a design practice: build typed output taxonomies for every complex output type your system produces, instrument the system to track output type frequencies, and correlate those frequencies with elicitation behavior frequencies. The result will be a behavioral improvement roadmap with specificity and empirical grounding that holistic quality metrics cannot provide.