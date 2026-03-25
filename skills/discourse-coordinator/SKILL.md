---
name: discourse-coordinator
description: "Meta-skill that orchestrates the discourse skill suite: routes between steel-man-argument, socratic-questioning, toulmin-argument-analysis, logical-fallacy-detector, bad-faith-rhetoric-detector, discourse-elision-analyzer, forensic-speech-structure, and productive-discourse-facilitator. Use when analyzing conversations, facilitating discourse, or operating as a dialogue copilot. Maintains mode (silent analysis, coaching overlay, active facilitator) and decides which skills to invoke based on conversation dynamics."
metadata:
  version: '1.0'
---

# Discourse Coordinator

## When to Use This Skill

Use this skill when:

- Operating as a **discourse copilot** across a multi-turn conversation
- A user needs **holistic discourse support** rather than a single specific skill
- **Analyzing** an ongoing or recorded conversation for quality, integrity, and dynamics
- **Facilitating** a dialogue between parties with different positions
- The user wants help **preparing** a persuasive speech, debate position, or written argument
- Conflict level in a conversation is rising and you need to decide how to intervene
- The user asks for "discourse analysis," "conversation coaching," or "dialogue support"

Do NOT use this skill when the user has a narrow, single-skill request (e.g., "find fallacies in this paragraph" → use `logical-fallacy-detector` directly).

---

## Four Cooperating Roles

The eight discourse skills are organized into four functional roles. This coordinator routes between them.

### Builder — Structures and Strengthens Arguments
| Skill | Purpose |
|---|---|
| `steel-man-argument` | Construct the strongest possible version of any position |
| `toulmin-argument-analysis` | Map claim → grounds → warrant → backing → qualifier → rebuttal |
| `forensic-speech-structure` | Compose and structure a speech or written argument for delivery |

### Guide — Shapes the Process of Dialogue
| Skill | Purpose |
|---|---|
| `socratic-questioning` | Drive inquiry-based exploration; surface assumptions |
| `productive-discourse-facilitator` | Set norms, manage turns, propose phase transitions |

### Critic — Inspects Quality and Integrity
| Skill | Purpose |
|---|---|
| `logical-fallacy-detector` | Identify formal and informal fallacies in reasoning |
| `bad-faith-rhetoric-detector` | Flag manipulation, deflection, and bad-faith moves |
| `discourse-elision-analyzer` | Detect what is conspicuously absent or avoided in a response |

### Coordinator — This Skill
Routes between roles based on goal, mode, and conversation state. Tracks patterns across turns and manages mode transitions.

---

## Three Operating Modes

### Mode 1: Silent Analysis (Default)
- Continuously evaluate each turn using **Critic** skills in the background
- Surface only minimal indicators (e.g., a single-line flag) unless the user explicitly asks for detail
- Track patterns across turns: escalation trajectory, repeated elisions, accumulating fallacy count
- Never interrupt the flow of conversation; log internally and report on request

**Activation**: Default on load. Also activated by phrases like "watch this conversation," "just observe," "monitor this."

### Mode 2: Coaching Overlay
- Provide **private feedback to the user only** — the other party does not see this
- Examples of coaching prompts:
  - "Your last turn dodged their core question about liability. Consider addressing it directly."
  - "Consider steelmanning their concern about X before pushing Y — it may reduce defensiveness."
  - "Their last three turns show a pattern: they've never engaged your cost argument. Flag it."
- Suggest small, targeted interventions via **Guide** skills
- Tone: supportive, non-judgmental, specific

**Activation**: User phrases like "coach me," "give me feedback," "help me respond," "what should I say."

### Mode 3: Active Facilitator
- All parties are **aware the agent is participating** as a third voice
- Uses `productive-discourse-facilitator` to establish ground rules and manage turn structure
- Proposes Structured Analytical Conversation (SAC) moves: restatements, clarifying questions, phase transitions
- Calls out patterns that undermine dialogue **openly** (e.g., "I notice this question has gone unanswered three times")
- Can introduce steelmanning rounds, inquiry phases, or synthesis prompts

**Activation**: User phrases like "facilitate this," "be the moderator," "help us have this conversation," or explicit consent from all parties.

---

## Routing Logic

Use these rules to decide which skill(s) to invoke for a given turn or request:

| Situation | Primary Route | Secondary Check |
|---|---|---|
| User's goal is to **persuade** | Builder skills | Critic (quality check) |
| User's goal is to **understand** | Guide skills | Critic (integrity check) |
| User's goal is to **analyze/evaluate** | Critic skills | — |
| **Conflict level rising** | Guide → `productive-discourse-facilitator` | Critic (monitoring) |
| Long response follows short pointed question | `discourse-elision-analyzer` | `logical-fallacy-detector` |
| Repeated non-engagement with a core point | `bad-faith-rhetoric-detector` | `discourse-elision-analyzer` |
| User preparing to speak or write | Builder → Critic | — |
| Emotional intensity high | `productive-discourse-facilitator` first | Builder after de-escalation |
| Argument structure unclear | `toulmin-argument-analysis` | — |
| User wants strongest form of opponent's view | `steel-man-argument` | — |
| Formal speech or debate prep | `forensic-speech-structure` | `steel-man-argument` for rebuttal prep |

For full decision trees, threshold definitions, and conflict-resolution between skills, see `references/routing-rules.md`.

---

## Orchestration Patterns

### Hot Topic Protocol (for active conflict)

Use when two or more parties are in active disagreement with rising stakes.

1. **Phase 0 – Setup**: Facilitator asks each side for a brief 2–3 sentence position statement. Run `toulmin-argument-analysis` privately to map each side's structure.
2. **Phase 1 – Mutual Steelman**: `steel-man-argument` helps each side restate the other's position at its strongest. The originating party must confirm the restatement is accurate before proceeding.
3. **Phase 2 – Inquiry**: `socratic-questioning` drives a round of mutual questions. Each party asks one genuine question; the other must answer directly before asking theirs.
4. **Phase 3 – Integrity Check**: `logical-fallacy-detector` and `bad-faith-rhetoric-detector` scan the full conversation neutrally; findings shared with all parties.
5. **Phase 4 – Synthesis**: `productive-discourse-facilitator` guides toward identifying any shared ground, naming remaining disagreements precisely, and proposing next steps.

### Quick Analysis (for a single turn or response)

Use when a user pastes a text and asks "what's wrong with this?" or "analyze this response."

1. Run `discourse-elision-analyzer` on the text — what is conspicuously absent?
2. Run `logical-fallacy-detector` on any arguments found
3. Summarize findings in 3–5 bullet points, ordered by significance

### Speech Prep Pipeline

Use when a user is preparing a speech, essay, or structured argument.

1. `toulmin-argument-analysis` — structure raw ideas into claim/grounds/warrant/rebuttal scaffold
2. `logical-fallacy-detector` — clean up reasoning; remove or repair weak inferences
3. `forensic-speech-structure` — compose the speech with appropriate structure (introduction, body, conclusion, transitions)
4. `steel-man-argument` — anticipate the strongest counterarguments; build refutation section

---

## State Tracking

Maintain this state across turns in a conversation:

- **Conversation temperature**: calm → warm → heated → crisis
- **Unanswered core questions**: running list; flag if a question goes unanswered for 3+ turns
- **Pattern accumulation**:
  - Elision count (how many times key topics have been avoided)
  - Fallacy count (types and frequency)
  - Bad-faith pattern count (types and frequency)
- **Mode**: current operating mode and what triggered any transitions
- **Phase** (in Hot Topic Protocol): which phase the conversation is in

Report state summary when asked or when escalating to a new mode.

---

## Sensitivity Settings

Adjust behavior based on the declared or inferred context:

**`relationship-mode`** (personal relationships, family, romantic partners):
- Extra caution with labeling; avoid "bad faith" as a definitive label — use "pattern that may indicate..."
- Validate emotional content before analytical content
- Emphasize understanding over winning
- Do not recommend confrontational moves

**`professional-mode`** (workplace, business negotiations, academic debate):
- More direct analysis; less emotional hedging
- Name patterns clearly and specifically
- Focus on argument structure and productive outcomes

**`debate-prep-mode`** (competitive debate, formal argumentation):
- Optimize for competitive strength; find every weakness in the opponent's case
- Less concern for relationship preservation; prioritize logical rigor
- Use `forensic-speech-structure` with competitive framing
- Aggressive use of `steel-man-argument` to anticipate and pre-empt

Set by user instruction or infer from context. Default: `professional-mode`.

---

## Reference Files

- **`references/routing-rules.md`** — Detailed decision trees, threshold definitions, mode-transition procedures, skill-conflict resolution, priority ordering, full orchestration examples, and guidance on when to refer to human support. Load this file when handling complex routing decisions or unfamiliar orchestration scenarios.
