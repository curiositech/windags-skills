---
name: mediator-expertise-live-interview-meli
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  provenance:
    kind: legacy-recovered
    owners:
    - some-claude-skills
---
# SKILL.md: Mediator Expertise Live Interview (MELI) — Tacit Knowledge Elicitation

license: Apache-2.0
```yaml
name: tacit-expertise-elicitation
version: 1.0
author: Based on Barbara Wilson PhD, "Mediator Expertise Live Interview (MELI)"
description: >
  Systematic methods for eliciting, making visible, and transferring tacit
  practitioner expertise — especially knowledge that resists explicit articulation,
  lives below conscious awareness, and is lost when experts retire or move on.
activation_triggers:
  - "how do experts actually decide"
  - "tacit knowledge"
  - "knowledge transfer"
  - "expertise elicitation"
  - "capturing institutional knowledge"
  - "what experts know but can't say"
  - "deliberate practice"
  - "communities of practice"
  - "cognitive task analysis"
  - "expert interview design"
  - "practitioner knowledge"
  - "elicitive methodology"
  - "reflective practice"
  - "professional learning"
  - "knowledge management"
```

---

## When to Use This Skill

Load this skill when you encounter problems involving:

- **Knowledge capture before it disappears** — a senior practitioner is retiring, a team is dispersing, an organization needs to preserve what its best people actually do (not what they say they do)
- **Training design that needs to go deeper than procedure** — formal curricula aren't producing competent practitioners; something is being missed
- **Interview or research design** — you need to extract authentic expert judgment rather than rehearsed narratives or self-serving accounts
- **AI/agent training on expert behavior** — you're trying to model or replicate expert decision-making and need the real cognitive process, not the official story
- **Diagnosing why professional communities fail to learn** — a field or organization keeps re-learning the same lessons; knowledge isn't flowing where it should
- **Cross-cultural or cross-context knowledge transfer** — applying expertise from one domain or culture to another without destroying what makes it work
- **Evaluating claimed expertise** — you need to distinguish genuine practitioner knowledge from credential-based authority or borrowed competence

This skill is **not** primarily about:
- General interview technique (though it informs it)
- Mediation practice specifically (Wilson's domain is the vehicle, not the destination)
- Performance management or HR processes

---

## Core Mental Models

### 1. The Waterline Model of Expertise
Expert knowledge is an iceberg. The visible portion — what practitioners can report when asked "what do you do?" — is the rehearsed, socially acceptable, politically safe account. The real expertise lives below: pattern recognition that happens before conscious processing, micro-decisions that are never narrated, contextual judgments that feel like intuition but are actually compressed experience. **The standard interview question ("what do you usually do?") retrieves only the surface.** The right key is situational re-evocation: "What did you do, right then, in that specific moment, and what made you do it?"

*Implication: Design every knowledge extraction effort around specific difficult moments, not general principles.*

### 2. Expertise ≠ Experience; Expertise = Deliberate Practice × Reflection × Context
Time in role is a necessary but not sufficient condition for expertise. The practitioner who has done the same thing unreflectively for twenty years has accumulated habit, not expertise. Wilson, drawing on Ericsson, insists that expertise requires: (a) deliberate practice that pushes against current capability limits, (b) reflective processing of that practice, and (c) approximately ten years of this cycle in a specific domain. Crucially, expertise is **practitioner-in-context** — it is not a portable property you can simply move to a new domain or environment.

*Implication: Don't confuse seniority with expertise. Don't assume expertise transfers across domains. Model the context, not just the person.*

### 3. The Political Economy of Knowledge Withholding
Professional communities are not neutral learning environments. They are competitive arenas where expertise is a scarce resource and knowledge transfer can feel like self-undermining. Continuing professional development gatherings — ostensibly sites of learning — are often contaminated by incentives to present curated success stories rather than revealing failures, uncertainties, and the actual texture of difficult decisions. Wilson calls this "learning inaction." The MELI methodology is specifically designed to **bypass these dynamics** by: using structured protocols that make curated self-presentation difficult, situating knowledge extraction within a community of practice (reducing competitive threat), and focusing on specific past moments (reducing the opportunity for image management).

*Implication: When knowledge transfer is failing, look for competitive dynamics before blaming individuals. Design extraction protocols that make withholding structurally harder.*

### 4. Recognition-Primed Decision-Making (Not Deliberate Calculation)
Experts under time pressure do not enumerate options and calculate expected value. They pattern-match against a rich library of prior situations, recognize the current situation as an instance of a known type, and act on the first option that clears their adequacy threshold. Klein's Recognition-Primed Decision model explains why experts often cannot explain their decisions in real time — the decision process is faster than narrative consciousness. **This means the "think-aloud" protocol produces a rationalization, not the actual decision process.** The MELI's structured re-evocation — conducted after the fact, using specific prompts that reconstruct sensory and contextual detail — can partially recover what happened.

*Implication: Don't ask experts to explain their reasoning in real time. Return to specific past moments. Reconstruct the scene before asking for the decision.*

### 5. Elicitive Over Prescriptive: Local Knowledge Beats Universal Frameworks
Lederach's discovery (via failed conflict resolution training in Central America) was that importing "universal" frameworks from dominant cultures into local contexts produces practitioners who cannot perform — because the framework doesn't fit the actual conditions and because the practitioners learn that their own embedded knowledge is inferior. Wilson generalizes: **knowledge transfer works when it draws out what is already present in a community, rather than importing what is absent.** The MELI insists on locally embedded experts, interviewed within their own community, producing knowledge directly applicable to the conditions those present actually face. Any other design produces an authority gap that undermines genuine learning.

*Implication: When designing knowledge transfer systems, start with what the target community already knows. Make that visible before importing external frameworks.*

---

## Decision Frameworks

### If you need to extract expert knowledge, ask:

| Situation | Guidance |
|-----------|----------|
| Expert can articulate clear principles | Suspect those are the rehearsed account. Probe with a specific difficult case. |
| Expert says "I just know" or "it's intuition" | This is tacit knowledge, not magic. Use situational re-evocation to approach it. Load `tacit-expertise-elicitation-protocol.md` |
| Expert has high credentials, questionable performance | Credentials certify training, not expertise. Look for evidence of deliberate practice over time in context. Load `expertise-is-not-experience-the-deliberate-practice-gap.md` |
| Knowledge transfer program isn't working | Check for structural/political barriers before redesigning content. Load `structural-barriers-to-knowledge-transfer.md` |
| Need to understand how an expert makes real-time decisions | Don't ask them during the decision. Use post-hoc structured interview. Load `decision-making-under-uncertainty-the-expert-pattern.md` |
| Practitioners are sharing war stories but not learning | The stories are curated. You need the uncurated version. Load `the-war-story-problem-authentic-vs-curated-knowledge.md` |
| Building or repairing a community of practice | Communities of practice have specific failure modes and design requirements. Load `communities-of-practice-as-knowledge-infrastructure.md` |
| Importing expertise from another domain or culture | High risk of context mismatch. Elicitive approach needed. Load `elicitive-methodology-local-over-universal-knowledge.md` |
| Ready to run an actual knowledge elicitation session | Use the structured four-pass protocol. Load `four-passes-framework-for-deep-cognitive-inquiry.md` |

### If diagnosing why expertise isn't being captured or transferred:

```
Is knowledge failing to be extracted FROM experts?
  → Is the interview design asking "what do you usually do?" (rehearsed) 
    or "what did you do in this specific case?" (real)?
  → Are experts being asked to explain in real time, or in structured retrospect?

Is knowledge failing to flow THROUGH the community?
  → Are there competitive incentives to withhold?
  → Is CPD/peer learning producing curated presentations rather than real cases?
  → Are senior practitioners retiring without knowledge capture?

Is knowledge failing to LAND in new practitioners?
  → Is the imported framework culturally/contextually mismatched?
  → Is local embedded knowledge being implicitly devalued?
  → Is training producing rule-followers rather than adaptive practitioners?
```

---

## Reference Files

Load these on demand when the relevant situation arises:

| File | When to Load |
|------|-------------|
| `tacit-expertise-elicitation-protocol.md` | Designing or running an interview to extract knowledge experts cannot easily verbalize; understanding why direct self-report fails; operationalizing situational re-evocation |
| `expertise-is-not-experience-the-deliberate-practice-gap.md` | Evaluating whether someone is genuinely expert vs. merely experienced; designing practitioner development programs; understanding why time-in-role doesn't guarantee expertise |
| `structural-barriers-to-knowledge-transfer.md` | Diagnosing why professional communities fail to learn from themselves; understanding competitive dynamics in CPD; analyzing "learning inaction" |
| `decision-making-under-uncertainty-the-expert-pattern.md` | Understanding how experts actually decide (recognition-primed, not calculative); designing systems that model expert judgment; interviewing experts about real-time decisions |
| `the-war-story-problem-authentic-vs-curated-knowledge.md` | Distinguishing authentic practitioner knowledge from curated retrospective accounts; designing protocols that bypass image management; getting to the uncurated story |
| `communities-of-practice-as-knowledge-infrastructure.md` | Building, repairing, or assessing a community of practice; understanding failure modes of professional learning communities; designing for genuine knowledge flow |
| `elicitive-methodology-local-over-universal-knowledge.md` | Cross-cultural knowledge transfer; importing external expertise into a local context; understanding why universal frameworks fail in specific contexts |
| `four-passes-framework-for-deep-cognitive-inquiry.md` | Running an actual MELI-style elicitation session; structuring deep inquiry that progressively builds toward tacit knowledge; interview facilitation design |

---

## Anti-Patterns

**What this book explicitly warns against:**

1. **"What do you usually do?"** — The single most common and most destructive question in expertise elicitation. It retrieves the practitioner's theory of their practice, not their practice. Always anchor to a specific past case.

2. **Conflating credentials with competence.** A certification tells you someone completed a training program. It says nothing about whether they can perform under real conditions. The MELI explicitly insists on eliciting expert practitioners, not merely certified ones.

3. **Asking experts to think aloud during performance.** Real-time verbalization changes the cognitive process being observed. Expert pattern-matching operates faster than narrative consciousness. Concurrent verbal reports are rationalizations, not data.

4. **Curated war stories as training material.** The war story told at a conference is designed for audience impact and self-presentation. It will have the crisis, the turn, the resolution. It will not have the moments of genuine uncertainty, the paths not taken, the partial failures. That's where the expertise lives.

5. **Treating expertise as portable.** Importing an expert into a new domain, organization, or cultural context and expecting the expertise to transfer intact ignores that expertise is practitioner-in-context. The context is part of the expertise.

6. **Designing CPD as performance rather than inquiry.** When continuing professional development is structured around presentations and showcases, competitive dynamics ensure that practitioners present success stories. Genuine learning requires psychological safety and structured protocols that make curated performance difficult.

7. **Assuming reflection happens after action.** The Schönian "reflection-on-action" model captures only one phase. Greenwood's critique: experts also engage in pre-action deliberation and in-action improvisation. An elicitation protocol that only asks "what did you learn afterward?" misses most of the cognitive work.

8. **Importing universal frameworks without eliciting local knowledge first.** The Lederach error: assuming that what works in one context (or what is theoretically "correct") can simply be installed in another. Local practitioners already have embedded knowledge. Fail to surface that first, and any imported framework will either fail or displace something valuable.

---

## Shibboleths

*How to tell if someone has genuinely internalized this book vs. merely read a summary:*

**They will not ask "what do experts do?" — they will ask "what did this specific expert do, in this specific moment, and what constrained their options at that instant."**

**They will be suspicious of smooth accounts.** When an expert's narrative has a clean arc — problem, analysis, solution — a MELI-trained thinker will probe for the mess underneath: what they considered and rejected, what they couldn't see at the time, where they were uncertain.

**They distinguish expertise from experience without being asked.** They will reflexively note that ten years in a role does not establish expertise, that the question is whether those ten years involved deliberate practice and reflection, and that the context in which expertise developed matters as much as the practitioner.

**They think structurally about why knowledge isn't flowing.** When a professional community seems stuck — repeating mistakes, failing to learn — they don't immediately blame individuals or content. They look for competitive dynamics, political incentives, and structural conditions that produce "learning inaction."

**They treat "I just know" as the beginning of inquiry, not its end.** Intuition is not magical. It is compressed pattern recognition. The response to "I just know" is "let's find the moment when you knew and reconstruct what you were perceiving."

**They are suspicious of universals.** When someone proposes a framework that should work "everywhere," they ask: whose knowledge was used to build it? What contexts were invisible in its construction? What local knowledge will it displace?

**They know the difference between reflection-on-action and reflection-in-action** — and they can articulate why Greenwood's critique of Schön matters: because it means elicitation needs to recover pre-action deliberation, not just post-hoc learning.

**They understand why you conduct the interview inside the community, not outside it.** The MELI's insistence on interviewing experts within their own community of practice is not logistical convenience — it is epistemological design. The community provides context, reduces competitive threat, and ensures that what is extracted is directly applicable to those present.

---

*Load reference files as needed. The waterline is deep. The key is the specific moment.*