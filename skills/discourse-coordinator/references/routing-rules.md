# Routing Rules: Discourse Coordinator Reference

This document is the authoritative orchestration guide for the `discourse-coordinator` skill. Load it when making complex routing decisions, handling edge cases, or designing multi-skill sequences.

---

## 1. Decision Tree: Full Routing Logic

### Entry Point: What is the user's primary goal?

```
User Request
│
├── ANALYZE something already said/written
│   ├── Single text/response → Quick Analysis Pattern
│   │   1. discourse-elision-analyzer
│   │   2. logical-fallacy-detector
│   │   3. bad-faith-rhetoric-detector (if manipulation suspected)
│   │   4. Summarize
│   │
│   └── Multi-turn conversation → Full Conversation Audit
│       1. toulmin-argument-analysis on each distinct argument
│       2. logical-fallacy-detector across all turns
│       3. bad-faith-rhetoric-detector for patterns across turns
│       4. discourse-elision-analyzer on suspicious gaps
│       5. Produce structured report
│
├── UNDERSTAND a topic, position, or person's view
│   ├── User wants to understand their own assumptions
│   │   → socratic-questioning (self-directed)
│   │
│   ├── User wants to understand an opposing view
│   │   1. steel-man-argument (build the strongest version)
│   │   2. socratic-questioning (generate questions to deepen understanding)
│   │
│   └── User wants to understand the structure of an argument
│       → toulmin-argument-analysis
│
├── PERSUADE (convince someone of a position)
│   ├── Live conversation → Coaching Overlay
│   │   1. toulmin-argument-analysis (structure user's position)
│   │   2. steel-man-argument (anticipate opposition)
│   │   3. logical-fallacy-detector (pre-check reasoning)
│   │   4. Monitor turns; coach in real time
│   │
│   └── Written/prepared argument
│       → Speech Prep Pipeline (see SKILL.md)
│
├── FACILITATE a dialogue
│   ├── Both parties cooperative → productive-discourse-facilitator
│   ├── Conflict present → Hot Topic Protocol (see SKILL.md)
│   └── One party uncooperative → bad-faith-rhetoric-detector + coaching
│
└── PREPARE a speech/essay/debate position
    → Speech Prep Pipeline (see SKILL.md)
```

---

## 2. Threshold Definitions

### Conversation Temperature Scale

**Calm** (Baseline):
- Measured language; no urgency markers
- Questions are open and curious
- Parties acknowledge each other's points
- Turn length is proportionate to complexity

**Warm** (Monitor more closely):
- Slightly increased frequency of "I" statements
- One or more unanswered questions persisting across 2 turns
- Minor dismissiveness: "obviously," "as I already said," "that's not the point"
- Turn length starting to diverge (one party writing much more/less)

**Heated** (Shift toward Guide role):
- Raised-stakes language: "always," "never," "you always do this," "this is exactly the problem"
- Explicit expressions of frustration or dismissal
- Repetition: same point restated without modification
- Questions becoming rhetorical rather than genuine
- Shortened turns by one party (withdrawal) OR aggressive lengthening (flooding)
- Ultimatum language: "if you can't understand this, then..." or "I'm done discussing..."

**Crisis** (Activate productive-discourse-facilitator immediately):
- Direct personal attacks or character accusations
- Explicit threats (to relationship, professional standing, legal action)
- One party refusing to continue or threatening exit
- Complete breakdown of turn-taking norms
- Distress signals: expressions of being overwhelmed, unsafe, or targeted

### Elision Threshold
Trigger `discourse-elision-analyzer` when:
- A response is 3x+ longer than the question that prompted it AND does not directly address the question
- A specific named argument, fact, or question has not been acknowledged after 2 turns
- A party pivots to a new topic immediately after a pointed question without any bridging acknowledgment
- A response contains only process objections (e.g., "you're asking this the wrong way") without substantive engagement

### Bad-Faith Threshold
Trigger `bad-faith-rhetoric-detector` when:
- The same deflection pattern appears 3+ times (gish gallop, strawman, topic change)
- A party makes claims about facts that are easily verifiable but presents them as unknowable
- Ad hominem attacks are used as the primary response to an argument
- There is consistent asymmetry: one party must justify everything; the other justifies nothing
- Motte-and-bailey detected: party retreats to a weaker claim when pressed, then returns to the stronger claim without acknowledgment

### Fallacy Accumulation Threshold
- 1–2 fallacies in a single response: note but do not interrupt; add to log
- 3+ fallacies in a single response: surface in coaching or analysis
- Same fallacy type recurring across 3+ turns: treat as a rhetorical pattern, not an error — may indicate bad faith or deeply entrenched cognitive bias

---

## 3. Mode Transition Procedures

### Transitioning Silent Analysis → Coaching Overlay

**Trigger conditions** (any one):
- User asks for feedback or guidance
- Heated temperature threshold reached
- 3+ unanswered core questions accumulated
- User appears to be losing ground and requests help

**Transition procedure**:
1. Inform the user you are shifting to Coaching Overlay mode
2. Provide a brief state summary: temperature, unanswered questions, patterns noted
3. Ask the user their goal (persuade, understand, de-escalate, win?)
4. Begin proactive coaching from next turn forward

**What NOT to do**: Do not shift to Coaching Overlay without informing the user. Silent mode means silent. Unexpected feedback can feel intrusive.

### Transitioning Coaching Overlay → Active Facilitator

**Trigger conditions** (all required):
- Both/all parties are present in the same conversation channel
- Conflict has reached Heated or Crisis temperature
- User (or all parties) consents to active facilitation

**Transition procedure**:
1. Explicitly announce the shift to all parties: "I'm going to take a more active role here, with everyone's permission."
2. State the purpose: reach shared understanding, not determine a winner
3. Establish brief ground rules via `productive-discourse-facilitator`:
   - One party speaks (or writes) at a time
   - Questions must be answered before new questions are introduced
   - Steelmanning required before challenging
4. Begin with Phase 0 of the Hot Topic Protocol

**What NOT to do**: Do not use Active Facilitator mode without consent from all parties. Unilateral facilitation creates a third adversary, not a mediator.

### Transitioning Active Facilitator → Deactivation

**When to close the facilitation loop**:
- Synthesis phase complete with documented shared ground
- One or more parties exit voluntarily after a cooling period
- Crisis resolved and parties choose to continue independently
- User requests return to Silent or Coaching mode

**Closing procedure**:
1. Summarize the conversation: what was established, what remains unresolved
2. Name any persistent disagreements precisely ("You disagree about X; you have tentative agreement on Y and Z")
3. Suggest next steps (continue later, seek human support, document the outcome)
4. Return to the mode the user specifies

---

## 4. Skill Conflict Resolution

The most common conflict: `bad-faith-rhetoric-detector` flags a move as manipulative while `steel-man-argument` finds a charitable interpretation. How to handle:

### Conflict Type A: Bad Faith vs. Charitable Interpretation

**Rule**: Default to the charitable interpretation in the first instance. Label as bad-faith only when:
- The pattern has repeated 3+ times, OR
- The charitable interpretation requires an implausible reading of the text, OR
- The speaker has already acknowledged the question/point they are now appearing to avoid

**Procedure**:
1. Offer the steelmanned version: "A charitable reading is that they mean X."
2. Flag the bad-faith pattern: "However, this is the third time they've pivoted away from the cost question."
3. Give the user both interpretations and let them decide how to respond.
4. In relationship-mode: weight heavily toward charitable. In debate-prep-mode: weight toward the critical reading.

### Conflict Type B: Multiple Critic Skills Flag the Same Turn

If `logical-fallacy-detector`, `bad-faith-rhetoric-detector`, and `discourse-elision-analyzer` all produce findings on the same turn:

**Priority order for reporting**:
1. Bad-faith patterns (highest priority — affect trust)
2. Elisions (second — affect the integrity of the exchange)
3. Fallacies (third — affect the quality of reasoning)

Report the top finding in detail; briefly note the others. Do not produce a wall of criticism — it overwhelms and often backfires.

### Conflict Type C: Builder vs. Critic on the Same Argument

When `toulmin-argument-analysis` structures an argument but `logical-fallacy-detector` finds a flaw in the resulting structure:

**Rule**: Fix first, build second. Never deliver an argument you know contains a fallacy unless the user explicitly wants to see the raw structure.

1. Note the flaw to the user
2. Offer a revised version of the argument that sidesteps the fallacy
3. If the argument cannot be restructured without abandoning its conclusion, say so — this is a valuable finding

### Conflict Type D: Guide vs. Builder Timing

When the conversation temperature is high (Heated or above) but the user is asking for persuasion support (Builder):

**Rule**: De-escalate before persuading. High-temperature persuasion attempts typically backfire and escalate further.

1. Invoke `productive-discourse-facilitator` to lower the temperature
2. Coach the user toward a de-escalating move first
3. Once temperature drops to Warm or below, engage Builder skills
4. Exception: in debate-prep-mode or formal debate contexts, temperature is irrelevant — proceed with Builder

---

## 5. Priority Ordering When Multiple Skills Could Apply

When two or more skills are equally applicable to a situation, apply this priority order:

1. **productive-discourse-facilitator** — safety and process always come first
2. **bad-faith-rhetoric-detector** — trust integrity is second priority
3. **discourse-elision-analyzer** — what's missing is often more important than what's said
4. **logical-fallacy-detector** — quality of reasoning
5. **steel-man-argument** — understanding the strongest position
6. **toulmin-argument-analysis** — structural clarity
7. **socratic-questioning** — exploration and inquiry
8. **forensic-speech-structure** — composition and delivery

This order applies when you must choose one skill due to context limits or when the user has asked for a "single most important insight."

---

## 6. Full Multi-Skill Orchestration Examples

### Example A: Analyzing a Political Debate Response

**Input**: A user pastes a 400-word response from a political candidate and asks "what's wrong with this?"

**Orchestration**:
1. `discourse-elision-analyzer` → finds the candidate never addressed the follow-up question about funding; pivoted to a related but distinct topic
2. `logical-fallacy-detector` → finds (a) appeal to authority (citing polls without methodology), (b) false dilemma (presents only two policy options when others exist)
3. `bad-faith-rhetoric-detector` → notes the elision pattern is consistent with a motte-and-bailey move: candidate retreated to an uncontroversial claim (we should help families) when pressed about a specific controversial policy

**Output format**:
- Lead with the bad-faith pattern (motte-and-bailey)
- Follow with the elision (unanswered question)
- Note the fallacies as supporting evidence for the pattern
- 5–7 bullet points total; offer to expand on any

---

### Example B: Coaching a User in a Workplace Conflict

**Context**: User is in a text conversation with a manager who has assigned blame for a failed project. User asks for coaching help.

**Orchestration**:
1. [Background] `toulmin-argument-analysis` on manager's position → claim: user is responsible; grounds: project missed deadline; warrant: user was project lead; rebuttal is absent
2. [Background] `logical-fallacy-detector` → finds post hoc reasoning (deadline missed → user at fault, ignores other causal factors)
3. [Background] `discourse-elision-analyzer` → manager has not mentioned the resource cuts that happened mid-project
4. [Coaching output] to user:
   - "The manager's argument has a gap: it ignores the resource cuts. Name that calmly and specifically."
   - "Don't deny responsibility entirely — that triggers defensiveness. Acknowledge your part, then add context."
   - "Suggest: 'I understand why the deadline miss reflects on my role. I also want to make sure we account for the scope changes in week 4 — can we review those together?'"
5. `steel-man-argument` → help user anticipate manager's likely counter ("That's not an excuse, the deadline was set knowing the constraints") and prepare a response

---

### Example C: Facilitating a Family Conversation About Elder Care

**Context**: Adult siblings disagree about how to care for an aging parent. One wants in-home care; the other wants assisted living. Relationship-mode activated.

**Mode**: Active Facilitator (both parties present and consented)

**Orchestration**:
1. [Phase 0] `productive-discourse-facilitator` → establish that both parties love their parent and want what's best; that is shared ground. Frame: this is a hard decision with no wrong values, only different risk models.
2. [Phase 1] `steel-man-argument` → help Sibling A restate Sibling B's position: "You believe assisted living offers professional monitoring that reduces risk of a medical emergency going undetected — and you're worried in-home care can't provide that same safety net." Sibling B confirms.
3. `steel-man-argument` → help Sibling B restate Sibling A's position: "You believe your parent's dignity and psychological well-being depend on staying in familiar surroundings — and you think the emotional cost of moving outweighs the safety gain." Sibling A confirms.
4. [Phase 2] `socratic-questioning` → questions for both:
   - "What specific outcome are you most afraid of?"
   - "What would need to be true for you to feel comfortable with the other option?"
   - "Are there hybrid options (e.g., in-home care with a medical alert system and weekly nurse visits) you haven't fully explored?"
5. [Phase 3] Integrity check (light-touch in relationship-mode): no bad faith flagged; note one instance of catastrophizing ("they'll die alone") — gently name it without labeling it a fallacy
6. [Phase 4] `productive-discourse-facilitator` → identify shared ground (parent's safety + dignity), name remaining disagreement (acceptable risk level), propose next step (consult with parent's physician together before deciding)

---

### Example D: Debate Prep (Competitive)

**Context**: User is preparing for a formal debate. Motion: "This house believes that social media companies should be legally liable for algorithmic amplification of harmful content." User is proposing (in favor).

**Mode**: debate-prep-mode

**Orchestration**:
1. `toulmin-argument-analysis` → map user's raw arguments into structured claims:
   - Claim 1: Algorithmic amplification is a product decision, not neutral speech
   - Claim 2: Liability creates incentives for safer design
   - Claim 3: Existing harms are documentable and attributable
2. `logical-fallacy-detector` → review structure; flag: Claim 2 contains a slippery slope risk (liability could cause over-moderation); recommend rebuttal preemption
3. `steel-man-argument` → generate strongest opposition case:
   - "Liability will chill legitimate speech; platforms will over-remove content to avoid risk"
   - "Defining 'harmful' is a government overreach problem"
   - "Causation between algorithm and real-world harm is legally and empirically contestable"
4. `logical-fallacy-detector` → scan the steelmanned opposition case for weaknesses user can exploit in cross-examination
5. `forensic-speech-structure` → compose the opening statement: hook, thesis, three structured arguments (with Toulmin backing), pre-empted rebuttals, call to action
6. Final coaching: identify the two most dangerous opposition moves and prepare pithy responses for each

---

## 7. Mode-Specific Behavior Modifications

### Silent Analysis — Skill Behavior Adjustments
- `logical-fallacy-detector`: log findings but do not surface unless count ≥ 3 in one turn or same type recurs ≥ 3 times
- `bad-faith-rhetoric-detector`: log pattern occurrences; do not label until pattern threshold is met
- `discourse-elision-analyzer`: flag conspicuous gaps internally; surface only if user asks or if escalation is triggered
- All skills: run in background; no output visible to conversation participants

### Coaching Overlay — Skill Behavior Adjustments
- All skills: output directed to user only; use second-person coaching tone
- `steel-man-argument`: present as "here's how they might be thinking about this" rather than as criticism of user
- `logical-fallacy-detector`: when user's own argument contains a fallacy, present as a vulnerability ("they might push back by saying your analogy breaks down because...") rather than a correction
- `bad-faith-rhetoric-detector`: in relationship-mode, frame findings as "a pattern that can sometimes indicate..." rather than definitive labels
- `socratic-questioning`: offer 1–2 questions the user could ask, not a full Socratic dialogue

### Active Facilitator — Skill Behavior Adjustments
- `productive-discourse-facilitator`: takes the lead; all other skills serve it
- `bad-faith-rhetoric-detector`: surface findings to all parties, but frame as observations about patterns in the conversation, not accusations about a person's character
- `logical-fallacy-detector`: when flagging a fallacy in Active Facilitator mode, always offer the corrected version of the argument ("What I think you might mean is...") before naming the fallacy
- `steel-man-argument`: use as a structured exercise involving the party whose argument is being steelmanned — ask them to confirm the restatement
- `discourse-elision-analyzer`: name unanswered questions openly, but use process language: "I notice this question hasn't been addressed yet. Can we return to it?"

---

## 8. When to Recommend Human Support

The discourse-coordinator can improve conversations but cannot replace human expertise in situations requiring licensed professionals. Recommend human support when:

### Therapist / Counselor
- The conversation reveals signs of emotional distress, trauma responses, or mental health crises
- Relationship conflict has escalated to a point where one or both parties express feeling unsafe, worthless, or hopeless
- Patterns suggest abuse dynamics (systematic invalidation, emotional manipulation, control)
- A party asks for emotional support that goes beyond argument coaching
- Suggested language: "This conversation is touching on things that are important and sensitive. A therapist or counselor can offer support that I can't — this is a real option worth considering."

### Mediator (Professional)
- Legal rights or significant financial interests are at stake
- The parties are in or approaching litigation
- Power imbalances are extreme (employer/employee, landlord/tenant, parent/minor child)
- Prior attempts at facilitated dialogue have failed
- Suggested language: "A trained mediator can offer a structured process with legal standing that this conversation cannot. Given what's at stake, that might be the right next step."

### Lawyer
- Legal rights are being discussed without legal counsel
- A party is being asked to sign something, agree to terms, or waive rights
- Threats of legal action have been made by either party
- Suggested language: "Before you respond to this, it would be worth speaking with a lawyer — this conversation is starting to have legal dimensions."

### Crisis Resources
- Any expression of intent to harm self or others
- Immediate safety concerns
- Do not attempt to facilitate — immediately provide crisis resources (e.g., 988 Suicide and Crisis Lifeline in the US) and cease analytical output

---

## 9. Quick Reference: Skill Trigger Cheat Sheet

| Trigger Signal | Primary Skill | Notes |
|---|---|---|
| "What's the strongest version of their argument?" | `steel-man-argument` | |
| "Help me structure my argument" | `toulmin-argument-analysis` | |
| "Write/structure my speech" | `forensic-speech-structure` | Pair with toulmin first |
| "What questions should I ask?" | `socratic-questioning` | |
| "Help us have this conversation" | `productive-discourse-facilitator` | |
| "Is there a fallacy here?" | `logical-fallacy-detector` | |
| "Are they arguing in bad faith?" | `bad-faith-rhetoric-detector` | Apply threshold rules |
| "What aren't they saying?" | `discourse-elision-analyzer` | |
| Long response to short question | `discourse-elision-analyzer` | Auto-trigger |
| Conversation temperature: Heated+ | `productive-discourse-facilitator` | Shift to Guide role |
| Same question unanswered 3x | `bad-faith-rhetoric-detector` + `discourse-elision-analyzer` | |
| User preparing speech/debate | Speech Prep Pipeline | See SKILL.md |
| Active conflict, all parties present | Hot Topic Protocol | See SKILL.md |
| Personal relationship context | All skills in relationship-mode | Extra caution |

---

*End of routing-rules.md*
