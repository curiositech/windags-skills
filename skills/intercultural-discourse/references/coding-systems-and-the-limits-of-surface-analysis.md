# Coding Systems and the Limits of Surface Analysis

## Why Coding Systems Are Necessary and Insufficient

Coding spoken discourse — assigning systematic labels to utterances so that patterns can be identified across large amounts of data — is one of the foundational tools of conversation analysis. Without coding, long stretches of transcript yield impressions but not patterns. With coding, patterns become visible, comparable, and arguable.

But coding systems are approximations. They operate at the surface level of discourse — capturing what was said and what function it served — without directly accessing what was meant, understood, or felt. Adamson's extensive engagement with three different coding systems (Sinclair and Coulthard 1975/1992; Tsui 1994; Francis and Hunston 1992) reveals both the power and the systematic limitations of surface-level coding.

## The Three-Rank System

Adamson adopts a three-rank coding approach:

**Exchange level** (Tsui 1994): Codes the function of utterances within Initiation-Response-Feedback exchange sequences. Initiations are categorized by type (eliciting, requestive, directive, informative) and subtype (elicit: inform, elicit: confirm, elicit: clarify, etc.). Responses are coded as positive (R+ve), negative (R-ve), or temporization (when the speaker cannot respond). Feedback is coded as endorsing, acknowledging, turn-passing, or concession.

**Move level** (Francis and Hunston 1992): Codes the functional role of utterances as framing, opening, answering, eliciting, informing, acknowledging, directing, or behaving moves. These provide more information about what a turn is doing within the exchange structure.

**Act level** (Francis and Hunston 1992): Codes the functional microstructure of utterances — 32 possible acts including "informative" (i), "comment" (com), "qualify" (qu), "inquiry" (inq), "neutral proposal" (n.pr), "marked proposal" (m.pr), "acknowledge" (acknow), "endorse" (end), "reformulate" (ref), and many others.

## What the Coding System Reveals

The coding system's greatest strength is enabling **cross-interview pattern detection**. By standardizing the representation of utterances, Adamson can observe:

- That questions became proportionally more open (inq acts) in the second half of interviews relative to the first
- That question 4's extended topic structure produced I-R-I-R strings without Feedback moves
- That certain question topics generated more breakdown sequences than others
- That interviewee responses to closed questions (n.pr acts) sometimes produced extended elaborations (i to com act transitions) that closed questions are not designed to invite

Without coding, these patterns would be invisible in the mass of transcript data. The coding makes the patterns *visible* and *arguable* — not merely impressionistic.

## What the Coding System Misses

Adamson is equally candid about the coding system's failures:

**The move rank is mostly redundant:**
> "Moves were generally seen to be slightly redundant in the ten interviews under analysis as their codings tended to overlap with the information carried at the exchange and act ranks... there would also exist the inevitable large amount of redundancy." (p. 200–201)

The information value of three ranks proved to be concentrated at the exchange and act levels. The move rank added bureaucratic overhead without proportionate insight.

**R+ve and R-ve are too coarse:**
The positive/negative response dichotomy fails to capture:
- The difference between genuine comprehension and face-saving compliance
- The difference between linguistic difficulty and conceptual difficulty in producing a response
- The difference between a response that follows the topic and one that subtly redirects it

> "The taxonomies... do not provide a code which shows whether a response exhibits some linguistic or conceptual difficulty." (p. 158)

**The missing code for hidden breakdown:**
As discussed in the companion document on hidden breakdown, there is no code for "apparent compliance masking non-comprehension" — a gap that produces systematic bias in intercultural settings.

**Completion of interviewee's utterance:**
When the interviewer completes an interviewee's word mid-utterance (because the interviewee cannot find the word), this can only be coded as "Ii:report" — a weak and inaccurate representation of what happened.

> "A new code is required for such instances." (p. 176)

**Illocutionary intent versus perlocutionary uptake:**
Standard coding captures what was done with an utterance from the receiving end (perlocutionary uptake). It does not capture what the speaker intended to do (illocutionary intent). When these diverge — as they routinely do in face-sensitive contexts — the coding is accurate about surface behavior but misleading about underlying communication.

## The Act Level as the Most Valuable Rank

Despite the redundancy problems at the move level, the act level proves to be where most interpretive value concentrates. The acts provide enough granularity to distinguish:

- inq (open inquiry) vs. n.pr (neutral yes/no proposal) vs. m.pr (marked tag question) — enabling detection of the interviewer's shift toward more open questioning in later interviews
- i (informative) → com (comment) transitions — showing when interviewees elaborated beyond the minimum
- qu (qualify) — tentativeness in response
- ref (reformulate) — both participants' efforts to check shared understanding

> "Much more use was seen in the extra insights given in 'com' (comment), 'qu' (qualify), 'inq' (inquiry), 'n.pr' (neutral proposal), and 'm.pr' (marked proposal) acts." (p. 201)

## The Complementarity Problem

Even when two coding systems are designed to be complementary, they may produce occasional contradictions that must be resolved by interpretive judgment:

When Burin answers "About 5 years" to the question "How have you studied English before coming here?" — misinterpreting "how" as "how long" — the exchange-level coding gives R-ve (negative response, fails to comply with the initiation). But the move and act coding gives "informing" and "i" (informative) — because Burin is genuinely providing information. The utterance is simultaneously a positive information-provision and a failed response to the actual question.

No single code can capture both dimensions simultaneously. The analyst must hold both in mind, which requires judgment beyond what the coding system itself produces.

## Coding and Visual Transparency

A secondary but significant function of coding is enabling **visual transparency** — the ability to look across large stretches of data and see patterns at a glance. Adamson develops "exchange sequence" summaries that display the IRF flow across an entire interview, with "windows" showing act-level detail at notable points and dotted lines marking communicative breakdown sequences.

These visual representations serve as intermediate tools between the dense coded transcripts and the interpretive summaries. They allow cross-interview comparison that page-by-page reading cannot easily produce.

> "I have decided to summarise the exchange sequences (I R F and F2) in a manner which is visually capable of revealing patterns within individual interviews and between them." (p. 123)

The visual tool is not a substitute for interpretive analysis, but it makes patterns available to inspection before interpretation — allowing the analyst to notice before explaining.

## Application to Agent Systems

**Principle 1: Coding systems enable pattern detection; they don't constitute interpretation.** Automated labeling of discourse structure, intent classification, or sentiment analysis produces organized representations that make patterns visible. These representations are not themselves explanations — they require interpretive judgment to become insights.

**Principle 2: The most granular classification level usually contains the most information.** In Adamson's system, the act level — the most granular — proved most valuable. In NLP systems, subword-level or token-level representations often carry more information than sentence-level or document-level classifications. Design classification hierarchies with awareness of where information concentrates.

**Principle 3: Build in mechanisms for representing uncertainty and conflict.** When two classification systems produce incompatible outputs for the same datum (as with Burin's response), the conflict is more informative than either coding alone. Systems should flag conflicting classifications rather than forcing resolution.

**Principle 4: Coarse binary classifications hide important structure.** R+ve vs. R-ve is too coarse to be useful in many cases. Similarly, "positive" vs. "negative" sentiment, "compliant" vs. "non-compliant" behavior, or "on-topic" vs. "off-topic" response are often inadequate for the complexity of real interactions. Design classification schemes with enough granularity to distinguish the cases that matter.

**Principle 5: Visual representation serves pattern detection at scale.** When working with large amounts of processed data, visual summary formats that make patterns accessible without requiring line-by-line reading are a significant practical tool. Agent systems that produce intermediate visual summaries (dashboards, flow diagrams, anomaly maps) enable human oversight at a scale that detailed review cannot.

**Principle 6: Plan for the missing code.** Every coding system will encounter phenomena it cannot adequately represent. Building in a "none of the above / requires review" category, and treating the frequency of its use as a signal about system limitations, is essential practice.

## Boundary Conditions

Coding systems are most useful when:
- Data volume is large enough that unsystematized reading produces only impressions
- The phenomena of interest have sufficient regularity to be captured by formal categories
- The analyst has enough familiarity with the domain to interpret coded patterns accurately

Coding systems are least useful when:
- The most important phenomena are precisely those that resist categorization
- The coding process is so labor-intensive that it consumes resources better spent on interpretation
- Codes are treated as conclusions rather than as organization of data for interpretation