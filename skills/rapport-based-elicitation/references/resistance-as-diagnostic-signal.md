# Resistance as a Diagnostic Signal: What a Source's Reluctance Reveals About the Interaction

## Reframing Resistance

In the accusatorial model, resistance from a source is treated as an obstacle to be 
overcome through escalating pressure. In the information-gathering model, resistance 
is treated as a signal — data about the current state of the interaction, the source's 
concerns, and the conditions that need to change before information will flow.

This reframing has profound implications for how an intelligent system should respond 
when it encounters reluctance, partial disclosure, or non-cooperation from any source 
it is querying.

Brimbal et al. (2021) design their entire experimental paradigm around a "semi-cooperative" 
subject who has genuine motivational reasons to manage information:

> "We then presented participants with the key information management: they could only 
> secure the deal if they provided their interviewer with a sufficient number of details 
> about the plot... However, participants were also cautioned that by providing too much 
> information to the interviewer, they themselves could be viewed as complicit... 
> Hence, with this concern in mind, participants were encouraged to provide as little 
> information as necessary." (p. 60)

This is the realistic scenario: sources rarely have a simple binary (cooperative vs. 
non-cooperative) relationship to information. They have *reasons* for the level of 
disclosure they offer, and those reasons are accessible to a skilled questioner.

The study's training explicitly included "a framework with which to understand and manage 
a subject's resistance" (p. 59) — not to overcome resistance by force, but to understand 
it and address its underlying causes.

---

## The Anatomy of Resistance

Resistance in investigative interviews (and by extension, in any information exchange) 
can arise from several distinct sources:

### 1. Uncertainty About Consequences
The source is unsure whether disclosure will hurt or help them. They don't know what 
the questioner will do with the information, whether promises will be honored, or whether 
partial disclosure will be worse than full disclosure or silence. This uncertainty 
produces *hedging* — calculated partial disclosure.

### 2. Distrust of the Questioner
The source doesn't believe the questioner is competent, honest, or aligned with their 
interests. Even if disclosure would be beneficial, the source won't act on that benefit 
if they don't trust the questioner to handle the information appropriately.

### 3. Concern for Third Parties
The source may be willing to expose themselves but not willing to expose others. 
The experimental scenario in the study explicitly builds this in — the subject is 
protecting a friend. This is a qualitatively different kind of resistance from 
self-protection.

### 4. Structural Constraint
The source cannot disclose because of an actual limitation — they were told not to, 
they don't know enough to be specific, or disclosure would create a genuine harm. 
This is not psychological resistance; no amount of rapport-building will address it.

### 5. Confusion About What's Being Asked
The source is non-cooperative because they don't understand the question, don't know 
what the questioner is looking for, or have a different model of relevance. The apparent 
resistance is actually a communication problem.

The critical point: **these five sources of resistance require qualitatively different 
responses**. Addressing distrust through evidence of the questioner's competence (Type 2) 
does nothing to resolve a structural constraint (Type 4). Offering reciprocity to 
address consequence uncertainty (Type 1) does nothing to help a confused source 
(Type 5) understand what's relevant.

The skilled questioner must diagnose the *type* of resistance before choosing a response.

---

## How Rapport-Based Tactics Address Different Types of Resistance

### Addressing Consequence Uncertainty (Type 1)
Conversational rapport tactics — particularly evocation ("drawing-out an individual's 
emotions and motivations") — allow the questioner to surface what the source is worried 
about. Once the concern is named, it can be addressed directly. Relational rapport tactics 
like reciprocity (offering something first) and self-disclosure (being transparent about 
the questioner's purposes and constraints) reduce consequence uncertainty by giving the 
source more information about what disclosure will lead to.

### Addressing Distrust (Type 2)
Relational rapport tactics directly address distrust: demonstrating competence through 
accurate verification of the source's self-concept, demonstrating alignment through 
similarity-highlighting, and demonstrating reliability through consistent behavior. 
Trust is built behaviorally over time, not asserted verbally.

### Addressing Third-Party Concern (Type 3)
This is the hardest type of resistance to address through rapport-building with the 
primary source, because the concern is not about the questioner-source relationship 
but about a third party who is absent. The conversational rapport tactic of acceptance 
(receiving without judgment) and evocation (surfacing the concern) can at least make 
the concern explicit, after which specific reassurances or framings may be offered.

### Addressing Structural Constraint (Type 4)
Rapport-building cannot address structural constraints, and attempting to push through 
them will damage the rapport that has been built. The correct response is to acknowledge 
the constraint, adapt the inquiry to what is available, and potentially revise the 
underlying question.

### Addressing Communication Confusion (Type 5)
Productive questioning tactics — particularly reflective listening, summaries, and 
the funnel structure — address this type. Providing a clear summary of what has been 
understood so far, and asking the source to correct or expand it, reveals misalignments 
in what the questioner is looking for vs. what the source understands them to be asking.

---

## The Study's Finding on Resistance-Related Training

Interestingly, after completing the training, the most common request for additional 
instruction was about resistance:

> "They overwhelmingly indicated that they wanted to know more about resistance (41.7%), 
> even though rapport and trust building tactics were aimed at overcoming resistance." 
> (p. 61)

This finding reveals something important: the investigators understood intellectually 
that rapport-building addresses resistance, but didn't yet have the practical confidence 
to apply this understanding when facing a genuinely resistant subject. The knowing-doing 
gap appears again, but now specifically in the context of resistance management.

This suggests that resistance is the hardest scenario for practitioners to trust 
evidence-based methods — the intuitive pull toward escalating pressure is strongest 
precisely when resistance is highest. This is the scenario where the default method 
fails most catastrophically and the evidence-based method is most necessary.

---

## Implications for Agent Systems

### Resistance as Information, Not Error
When an agent in a pipeline returns a low-quality, partial, or "I don't know" response, 
the orchestrating system should not immediately treat this as a failure to be retried 
with more pressure. It should treat it as a signal about the current state of the 
information exchange.

Diagnostic questions the system should ask:
- Is the responding agent uncertain (Type 1 analogue: uncertainty about whether its 
  answer is good enough)?
- Does the responding agent not trust the framing of the query (Type 2: is the question 
  poorly aligned with the agent's model of the problem)?
- Is the responding agent protecting downstream components from what it perceives as 
  a risky output (Type 3)?
- Is the responding agent genuinely unable to produce what's being asked (Type 4: 
  structural constraint)?
- Is the responding agent producing what it thinks is being asked, but has misunderstood 
  the query (Type 5)?

Each of these requires a different intervention. Re-sending the same query with higher 
urgency (the accusatorial escalation) addresses none of them.

### Designing for Resistance Diagnosis
Multi-agent systems should include mechanisms for agents to report their *state* 
(uncertainty, constraint, confusion) not just their *output*. This is the agent 
equivalent of the interviewee being able to say "I don't want to answer that because..." 
rather than simply providing an evasive response.

Systems that only accept outputs and not states will always misdiagnose resistance and 
will tend to apply escalating pressure — with the same contaminating effects documented 
in the interrogation literature.

### The Escalation Trap
The natural system response to resistance is escalation: add more context, add more 
constraints, add more verification requirements, query more sources to triangulate. 
Each of these can make the situation worse if the root cause is distrust or confusion, 
because each escalation signals that the original approach isn't working — which 
validates the source's distrust — and increases cognitive load, which worsens performance.

The evidence-based response to resistance is de-escalation plus diagnosis: reduce 
demands, acknowledge the difficulty, and create space for the source to reveal what 
is actually getting in the way.

---

## The Semi-Cooperative Baseline

The study's experimental design assumes semi-cooperative subjects — not maximally 
cooperative, not maximally resistant — because this is the realistic baseline for 
real-world information exchange. Fully cooperative sources don't require rapport-building; 
fully resistant sources may require escalation beyond what rapport alone can address.

The semi-cooperative case is the design center for intelligent information-gathering 
systems, because it is the case where the quality of the interaction determines the 
quality of the output. Both extremes (full cooperation, full resistance) are less 
dependent on technique. The middle range, where most real interactions live, is where 
evidence-based methods produce the most value.

---

## Summary Principle

> **Resistance is not an obstacle to information extraction — it is information about 
> why extraction is failing. Before escalating pressure, diagnose the type of resistance: 
> uncertainty, distrust, third-party concern, structural constraint, or communication 
> confusion. Each type requires a qualitatively different response. The escalatory 
> response (more pressure, more specificity, more constraints) is the worst available 
> choice for all types except structural constraint, and even there it does not help.**