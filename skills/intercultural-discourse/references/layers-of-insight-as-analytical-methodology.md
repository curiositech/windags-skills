# Layers of Insight: Why One Framework Is Never Enough

## The Core Insight

In complex analytical situations, no single framework captures the full picture. John Adamson's thesis demonstrates this through a worked example: he codes research interviews using Tsui's (1994) IRF exchange system, supplements it with Francis and Hunston's (1992) moves and acts taxonomy, adds Thai cultural criteria, and carries forward contextual information from an entirely prior study. The result is not confusion but **depth** — each layer reveals something the others cannot.

The method is called "layers of insight" — a deliberately imprecise term that captures the non-mechanical, exploratory nature of the approach. Layers are placed over the data and removed at will. They are not applied in a fixed sequence; their deployment is "intentionally eclectic" (p. 135-136). The researcher moves between them in response to what the data is showing. This is not methodological looseness — it is appropriate responsiveness to complexity.

> "For Bakhtin's 'voices' to emerge or fluctuate throughout interviews and to avoid the limitations of viewing interview data from only the perspective of content... or talk-in-interaction... it is necessary to regard the tools as transparent 'layers of insight' to be placed over the coded transcripts and removed at will." (p. 134)

## What Each Layer Contributes

In Adamson's system, the layers are:

**Layer 1: IRF exchange coding (Tsui 1994)**
Identifies who is initiating, responding, and providing feedback. Reveals formal turn structure. Good at showing *what kind* of move is being made. Weak at explaining *why* it takes the form it does, or what is being suppressed.

**Layer 2: Moves and Acts (Francis and Hunston 1992)**
Provides finer-grained coding at the act level — distinguishing informative acts ('i'), comment acts ('com'), qualify acts ('qu'), neutral proposals ('n.pr'), marked proposals ('m.pr'). Especially valuable at the response and feedback stages where Tsui's taxonomy is underpowered. Creates "windows" into lower levels of the rank scale.

**Layer 3: Thai cultural criteria (Mulder 1996)**
Provides culturally-specific concepts (krengjai, bunkhun, sam ruam, khuna-decha continuum) that explain behavioral patterns invisible to the generic coding systems. A student who gives a short, accurate yes/no answer to an open question is not exhibiting "failure to expand" — they may be exhibiting a classroom-socialized form of merit-earning (bun). Without this layer, the behavior is misread.

**Layer 4: Learning strategies context**
Contextual data from the prior study — each student's educational background, language learning history, strategy awareness — carried forward to inform interpretation. A student from secondary school who shows sophisticated strategic awareness cannot be explained by the educational-background hypothesis alone; the contextual layer prevents the wrong inference.

**Layer 5: Field notes and non-verbal data**
Brackets in the transcript capturing facial expressions, pauses, hesitations, body language. Provides access to signals that are definitionally absent from verbal coding. Often the most important signals for detecting false comprehension or suppressed breakdown.

## Why Layers Must Be Used Together

The critical property of this approach is that the layers are **not redundant with each other** — they are *complementary at different levels of resolution*. As Adamson shows:

> "Individually, each rank scale description reveals insufficient information about the discourse. Together, the combined description of an initiation which seeks to confirm the previous utterance by means of a yes/no question is much more effective and approaches some form of cohesiveness as a three-part description." (p. 122)

But complementarity does not mean neat alignment. Sometimes layers conflict. A response coded as R+ve at the exchange level (positive, compliant) may be coded at the act level as 'qu' (qualify) — tentative. The cultural layer then suggests this is face-saving suppression of a breakdown request. Each conflict between layers is itself an analytical finding: it marks a location of interpretive complexity.

## The Dialogue Metaphor

Adamson borrows from Kvale (1996) the concept of entering into "dialogue" with the data. This means:
- Step back from the coded material periodically
- Ask standardized rhetorical questions that force perspective-shifting
- Allow the data to "speak back" through the tools rather than simply confirming pre-formed hypotheses

Example dialogue questions from the two-step methodology (p. 136-137):
- "How are this interviewee's language learning strategies different from those of the others?"
- "What is of note about the turn-taking behaviour of both participants?"
- "Is the 'voice' of the interviewee consistent throughout the interview? How about the interviewer's?"

These questions are not answered algorithmically — they are posed to force the analyst into a different angle of attention.

## Overlap and Redundancy Are Tolerable Costs

A key methodological honesty in this thesis: the layers overlap. The move rank coding often repeats information available at the exchange rank. This is explicitly acknowledged as a weakness:

> "Both chapter five addressing the methodology employed to ascertain learning strategies and chapter six addressing the turn-taking analysis... all... despite apparently presenting the reader with minor details, may influence turn-taking behaviour to some degree." (p. 17)

But Adamson's conclusion is that redundancy is a **tolerable cost** for the richer pattern recognition the multi-layer system enables. The danger of dropping a layer to eliminate redundancy is losing the one case where that layer provides the decisive interpretive insight. In practice, some layers are near-always useful; others are deployed selectively. Knowing which is which comes from experience with the data.

## Application to Agent Systems

For AI agent systems operating on complex analytical tasks:

**Use multiple, heterogeneous analytical frameworks simultaneously.** A code-review agent that only checks syntax misses semantic intent. One that only checks semantics misses performance implications. One that checks both still misses architectural patterns. Layering multiple frameworks is not duplication — it is the necessary condition for catching what any single framework cannot.

**Design layers to be selectively activatable.** Not all layers are needed for every task. The system should be able to invoke a "cultural context" layer (domain knowledge, organizational norms, stakeholder expectations) when behavioral patterns don't match formal expectations, without invoking it for every routine analysis.

**Treat layer conflicts as primary findings.** When two analytical frameworks give conflicting readings of the same artifact, that conflict is not an error to be resolved by defaulting to one framework. It is a signal that the artifact contains a genuine ambiguity requiring deeper investigation or human judgment.

**Build dialogue questions into the reasoning process.** Periodic meta-level questions ("What am I missing? Does this finding hold across all instances I've seen? What alternative explanation would also fit the evidence?") force perspective shifts that prevent premature closure.

**Accept redundancy as cost of coverage.** Some analytical passes will overlap. The alternative — dropping coverage to avoid redundancy — risks systematic blind spots in exactly the cases where coverage matters most.