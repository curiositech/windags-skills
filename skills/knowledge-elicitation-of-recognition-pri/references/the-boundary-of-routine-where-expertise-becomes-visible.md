# The Boundary of Routine: Where Expertise Becomes Visible and Transferable

## The Fundamental Observation

Klein and MacGregor make an observation that is simple to state but has profound consequences for how we think about knowledge extraction, agent training, and system design: **expertise becomes visible only at the boundary between routine and novel problems**.

"We feel that it is at the boundary between routine and novel where expertise is stretched far enough to become visible" (p. 14).

Understanding why this is true, and what it implies, is one of the most important lessons in this work.

## The Three Zones of Performance

Consider a spectrum of problem difficulty for any domain:

**Routine problems** are handled by virtually everyone with basic training. The actions are automatic, the rules are explicit, the knowledge is widely shared. Studying expert performance on routine problems tells you what the training manual already contains. The expert doesn't think differently from a competent novice on these problems — they just execute faster and more smoothly.

**Novel problems** are ones where even experts have no prior experience. These problems reveal reasoning abilities, general intelligence, and problem-solving strategies that are independent of domain content. They are valuable for studying general cognition but tell you nothing about what makes someone an expert in *this* domain, because by definition the expert lacks the relevant experience.

**Non-routine problems** — the space between these extremes — are problems that occur infrequently enough that most practitioners lack the experience to handle them well, but that experts have encountered before (or whose components experts have encountered before in analogous form). These are precisely the problems where expertise makes the decisive difference. And they are the only problems that can make tacit expertise visible.

This is the CDM's sampling strategy stated as a theoretical principle: to extract expertise, you must study the cases where expertise was essential.

## What Happens at the Boundary

When an expert encounters a non-routine problem, something specific happens cognitively that doesn't happen in routine cases: the automatic recognition fails, or partially fails, and the expert must engage more consciously with the situation. The tacit knowledge becomes partially visible — not fully explicit, but accessible enough to probe.

Klein and MacGregor distinguish the mechanisms:

In routine cases, "the knowledge has become automatic and unconscious" (p. 13). There is nothing to elicit. The expert does the right thing without knowing why, because the knowing has been compiled into direct sensorimotor response.

In novel cases, "by definition the subject is a novice" with respect to the content (p. 13). There is no domain expertise to elicit.

In non-routine cases, the expert's knowledge is "stretched far enough to become visible" — the recognition is effortful, the causal factors require active consideration, the option selection requires some deliberation. At this level, the expert can talk about what they noticed, why they interpreted it as they did, what options they considered, and why they chose what they chose. The knowledge is accessible enough to extract.

## Why This Matters for Knowledge Base Construction

The practical implication for knowledge base construction is direct: **your elicitation methodology must target non-routine cases, not routine ones**.

If you build a knowledge base by asking experts to describe standard procedures, you get a knowledge base that duplicates the training manual. It will handle routine cases adequately — but so would any competent practitioner following the manual. It will fail on non-routine cases, which are precisely the cases where you most need the expertise.

The CDM's incident selection criteria reflect this principle explicitly. Interviewers are instructed to look for incidents where:
- "Experience was important, where someone with less experience would have possibly been unable to be effective" (p. 21)
- Risk to life was present
- Non-standard operations were employed
- Mistakes were made (especially valuable for surfacing tacit knowledge about what can go wrong)
- The incident was "exceptional in some way"

Errors are specifically noted as "good sources of data about the uses of knowledge" (p. 22). A mistake at a non-routine case reveals the boundary of the expert's competence and the failure modes of their recognition patterns — information that is extremely valuable for building robust systems.

## The Typicality Dimension in Expert Knowledge

Klein and MacGregor connect their empirical observation about the boundary of routine to the cognitive science concept of *prototypicality* (Rosch & Mervis, 1973, cited on p. 19). Experts develop rich prototype structures for the situations they encounter — mental representations of what "typical" instances of each situation type look like, feel like, and call for.

The action queue in the RPD model is ordered by *typicality*: the most typical response to the recognized situation type is tried first. "This is quite efficient, since in most cases the most typical reaction will be the one called for" (p. 19).

At the boundary of routine, the prototypicality of the current situation is uncertain. The expert must work harder to classify the situation, because it doesn't clearly fit any known type. This is where the RPD model's A-3 level operates: serial evaluation of options, with possible modification or rejection. And this is where expertise becomes visible.

## Transfer of Expertise: Teaching at the Level of Cases

One of the most important practical applications Klein and MacGregor draw from this analysis is for training design. Traditional training (Instructional Systems Design, or ISD) builds competence from the bottom up, teaching component skills and assuming that expertise will emerge from their aggregation. Klein and MacGregor argue that this approach fails at the upper levels:

"Expert skills are difficult to decompose according to an ISD format, performance requirements for testing and evaluation are extremely difficult to define, and learning objectives are difficult to specify. The phenomenological nature of expert performance requires that a different tack be taken to bridging the gap between the well-schooled novice and the well-experienced expert" (p. 39).

The alternative they propose is direct case-based transfer: building a "data base" of expert solutions to non-routine cases, including "not only the actions that the expert took in a given situation, but also the rationale behind the actions and the mental deliberations involved in assessment and choice" (p. 40).

This is essentially what the CDM produces: a library of annotated cases, each containing a narrative of the incident, a timeline, a situation assessment record, and a decision point analysis. This library can serve as the basis for:
- Training programs that develop novice expertise by exposure to annotated expert cases
- Knowledge bases for decision support systems that need to handle non-routine situations
- Evaluation frameworks for testing whether new practitioners can recognize and handle boundary cases

## The Case as the Unit of Expertise

This teaching points to a fundamental insight about the structure of expertise: **expertise is case-based, not rule-based**. The expert's knowledge is not primarily a set of general rules applied to situations. It is a library of cases — annotated instances of how specific situations were recognized and handled — that serves as the basis for analogical reasoning and pattern recognition.

When a commander tells their story of the tanker truck fire (Appendix B), they are not reciting rules. They are reconstructing a complex situated event in which specific cues (the column of black smoke at an unexpected location, the tanker lying on its side split lengthwise, the second tanker 50 feet away) activated specific situational understandings (partial relief that the tanker isn't split in half, concern about saddle tank explosions, need for foam) which drove specific actions (correction of dispatch location, call for rescue, call for foam units, establishment of protective water streams, direction to check abandoned cars for occupants).

No rule set captures this. The case captures it — with enough context, cues, and rationale that someone who reads it carefully can begin to understand what expert fireground command actually looks like.

## Implications for Agent System Design

### 1. Case Libraries as the Primary Knowledge Representation
Agent systems that need to handle non-routine situations should be built around case libraries, not just rule sets. Each case should contain: the situation description, the cues that were critical, the situation type recognized, the options considered, the selection rationale, and the outcome. This structure supports analogical reasoning ("this looks like case X, which was handled by doing Y") and can be extended as new cases are encountered.

### 2. Sample Non-Routine Cases Deliberately
When collecting training data, evaluation examples, or few-shot prompts, deliberately oversample non-routine cases relative to their frequency. Routine cases are already handled adequately by baseline models; non-routine cases are where the knowledge investment pays off. The skill in building an agent knowledge base is finding the right non-routine cases, not just collecting large volumes of routine ones.

### 3. Annotate Cases with Decision Rationale, Not Just Outcomes
A case database that records only outcomes (X happened, and the action was Y) is far less valuable than one that records the decision rationale (the expert noticed cue A and B, classified the situation as type T, expected consequence C, and chose action Y because it addresses T and avoids the failure mode F). The rationale is what makes the case useful for generalization.

### 4. Detect When You're at the Boundary
Agents should have mechanisms for detecting when a current situation falls outside the well-covered region of their case library — when they're at or beyond the boundary of their experience. This is the moment when the agent should:
- Flag uncertainty explicitly
- Seek additional information
- Consider escalating to a higher-capability agent or human expert
- Be more conservative in action selection

### 5. Errors as Training Data
Klein and MacGregor explicitly note that errors are "good sources of data about the uses of knowledge" (p. 22). In agent systems, failure cases should be analyzed as carefully as success cases — ideally more carefully. Failure cases reveal the boundaries of the current knowledge base and the specific situations where the agent's recognition patterns fail.

### 6. The Analogue Probe as a Design Pattern
One of the CDM's most powerful probes is the analogue probe: "Pick the most similar/helpful case. Describe the differences" (Table 2, p. 26). This probe surfaces the expert's pattern-matching and analogical reasoning. Agent systems should implement an analogous mechanism: before acting, retrieve the most similar case from the case library and explicitly identify how the current situation differs. The differences are the places where the analogy may break down and the standard response may need modification.

## Boundary Conditions on This Teaching

The emphasis on non-routine cases applies most strongly in domains where:
- Expertise develops through accumulated experience with varied situations
- Situations can be classified into types with characteristic features
- The most valuable knowledge is perceptual/recognitional rather than analytical

In domains where expertise is primarily analytical (mathematics, formal logic, algorithm design), the routine/non-routine distinction may be less important — the expert's advantage may come from analytical power that is accessible at all difficulty levels.

In domains where non-routine cases are extremely rare and high-stakes (nuclear reactor failures, aircraft system malfunctions), the challenge of collecting adequate case libraries may be severe, and simulation-based methods may be necessary to generate the non-routine cases needed for training.

## Summary

The boundary of routine is where expertise lives. This is the fundamental sampling insight of Klein and MacGregor's work. Routine cases tell you what the training manual already contains. Novel cases tell you nothing domain-specific. Only non-routine cases — where experience made a decisive difference — reveal the tacit knowledge that constitutes genuine expertise. For agent system design, this means: build case libraries around non-routine events; annotate cases with decision rationale, not just outcomes; detect when the current situation falls outside the covered region; and treat errors and failures as the most informative training data available.