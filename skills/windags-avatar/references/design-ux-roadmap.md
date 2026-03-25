# WinDAGs V3 — UX Design Roadmap

**Document type**: Design Specification and Sprint Plan
**Author**: UX Design Lead
**Source**: Phase 6 Final Synthesis (Constitution Part 3, Practitioner Guide Parts 1-2, Phase 5 Review Brief)
**Status**: Ratified for Phase 1 Implementation
**Date**: 2026-03-01

---

## Purpose and Scope

This roadmap resolves every blocking UX concern raised in the Phase 5 reviews by the PM, Design Lead, and Psychologist. It specifies concrete design decisions — not guidelines or directions — for the ten areas the review board identified as blocking Phase 1 implementation. Each section closes a named blocking item.

The document is organized as follows: the ten design sections (sections 1-10) provide specification detail; the sprint plan (section 10) provides the sequencing.

---

## 1. First-Run Experience Design

**Blocking item**: PM — "blank problem space problem" — users arrive without a problem in mind.

### 1.1 The Problem This Solves

A new user who has never used WinDAGs faces an empty input field and no mental model for what kinds of problems are appropriate. Worse, they do not know what a completed DAG looks like, so they cannot set expectations. This leads to underpowered first attempts ("make it work with data") and early drop-off.

The solution has three parts: a pre-loaded demonstration, a problem type picker, and a structured onboarding flow.

### 1.2 Pre-Loaded Demonstration DAG

On first launch, before the user types anything, the visualization pane is not empty. It shows a completed demonstration DAG — a finished "Build a REST API for a todo app" execution with all nodes in DONE state (green). The user can:

- Click any node to see its output (a real LLM-generated artifact)
- Hover nodes to see quality margin tooltips
- Toggle between Graph, Timeline, Hierarchy, and Detail modes
- Switch the disclosure level from L1 to L2 to L3

This demonstration is pre-executed and shipped with the installer. No API key is required to explore it. The CLI command `windags demo` loads it immediately.

The demonstration teaches three things by showing, not telling:
1. What a completed DAG looks like (visual vocabulary)
2. That the system produces real artifacts, not summaries
3. That quality is always measured and visible

The demo DAG is not interactive — it does not re-execute. The user is invited to run their first real DAG once they have explored it. A persistent banner reads: "This is a demo. Run your own problem above."

### 1.3 Problem Type Picker

Below the problem input field, a problem type picker presents five domain tiles. These are not categories — they are starting points that configure the Decomposer's meta-skill for Pass 1.

```
┌─────────────────────────────────────────────────────────────────┐
│  What kind of problem are you working on?                       │
│                                                                 │
│  [ Software ]  [ Data & Analysis ]  [ Writing ]  [ Research ]  │
│  [ DevOps  ]                              [ I'll describe it ]  │
└─────────────────────────────────────────────────────────────────┘
```

Selecting a tile does two things:
1. Pre-populates the domain selector (filters the template library)
2. Shows 3 example problem statements from that domain, clickable to paste into the input field

The "I'll describe it" option skips the picker entirely and routes through the Sensemaker with no meta-skill pre-selection.

### 1.4 Onboarding Flow

First-time users (detected by absence of a local config file) see a three-screen onboarding sequence before reaching the main interface.

**Screen 1 — What WinDAGs Does (30 seconds)**

A single-paragraph explanation and a 15-second animation showing a problem statement transforming into a DAG, executing, and producing output. No technical terms. Copy: "WinDAGs breaks your problem into steps, runs them in parallel, checks the results, and gets smarter every time."

One button: "Show me the demo."

**Screen 2 — The Demo (2-3 minutes)**

The pre-loaded demonstration DAG (section 1.2) with a guided tour overlay. Four tooltip callouts, triggered in sequence by "Next" clicks:

1. Point at a DONE node: "Each box is a task. This one finished successfully."
2. Point at the quality score: "Every task is graded. This one scored 0.87 out of 1.0."
3. Point at the Envelope score: "This shows how smoothly it ran, not just whether it passed."
4. Point at the cost ticker: "Total cost for this execution: $0.064."

After the tour: "Ready to run your own?"

**Screen 3 — API Key Setup (60-90 seconds)**

Simple form: API key field, provider auto-detected, one validation call that costs $0.001 to confirm the key works. On success: "You're ready. Try one of these problems, or describe your own."

Shows three pre-written example problems from different domains as clickable cards.

After the user runs their first real execution, the onboarding state is marked complete and the onboarding overlays are permanently hidden.

---

## 2. Pre-Execution State Design

**Blocking item**: Design Lead — "design pre-execution/onboarding state (what users see before first DAG)."

### 2.1 The Three Pre-Execution Phases

The pre-execution screen is not a blank waiting state. It is an active display that narrates what the system is doing during the 2-5 seconds between problem submission and wave 1 starting. The screen passes through three phases.

### 2.2 Phase A: Sensemaker Analysis (0-1.5 seconds)

```
┌────────────────────────────────────────────────────────────────────────┐
│  WinDAGs                                            [Cost: $0.00] [■]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Your problem:                                                         │
│  "Build a CLI tool in TypeScript that converts CSV files to JSON..."   │
│                                                                        │
│  ┌──────────────────────────────────────────────┐                     │
│  │  Reading your problem...                      │                     │
│  │                                               │                     │
│  │  Identifying:    Unknown  ██████░░░░  62%     │                     │
│  │                  Data     ██████████  100%    │                     │
│  │                  Conditions ████░░░░  45%     │                     │
│  └──────────────────────────────────────────────┘                     │
│                                                                        │
│  The visualization will appear here when execution begins.            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

The three "Identifying" bars animate smoothly as the Sensemaker processes each dimension of the problem. This is not faked — the progress values are emitted by the Sensemaker's real parsing events over WebSocket.

If Clarity drops below 0.6 at this phase, the screen transitions to the HALT state (section 2.5) instead of continuing.

### 2.3 Phase B: Decomposition Plan Preview (1.5-3.5 seconds)

```
┌────────────────────────────────────────────────────────────────────────┐
│  WinDAGs                                            [Cost: $0.00] [■]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Problem understood: well-structured, software engineering             │
│  Matched template: cli-tool-builder                                    │
│                                                                        │
│  Building your plan...                                                 │
│                                                                        │
│  Wave 1: [design-cli-interface]                                        │
│  Wave 2: [csv-parser]  [type-coercion]  [yaml-config]  ← parallel     │
│  Wave 3: [integrate]  [write-tests]  (2 tasks to be planned later)    │
│                                                                        │
│  Estimated: ~$0.04-0.08   |   ~30-60 seconds                          │
│                                                                        │
│  [Run this plan]  [Modify plan]  [Start over]                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

This is the critical pre-execution screen. It shows the plan before any execution cost is incurred. The user can:

- Accept the plan (proceeds to wave 1)
- Modify the plan (opens the DAG editor pane, a power-user surface)
- Start over (returns to the problem input)

The "(2 tasks to be planned later)" annotation is important — it transparently communicates that vague nodes exist and will be expanded during execution.

The cost and duration estimates use the topology validation output from Pass 3.

### 2.4 Phase C: PreMortem Result (displayed during plan review, 0.5 seconds)

A single line appears under the plan:

- If clean: "No known failure patterns found for this problem type. Ready to run."
- If patterns found: "1 known risk: [risk description]. Proceed with awareness."

The risk line is color-coded: yellow for informational, orange for a warning that changes the recommended approach.

### 2.5 HALT State (when Clarity < 0.6)

If the Sensemaker halts, the screen shifts to a distinct HALT state with a calming visual treatment (no red alerts — this is a normal part of the workflow, not a failure):

```
┌────────────────────────────────────────────────────────────────────────┐
│  WinDAGs                                            [Cost: $0.00] [■]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  I need a bit more information before I can plan this.                 │
│                                                                        │
│  What you wrote:  "make the thing better"                              │
│                                                                        │
│  What's missing:                                                       │
│  • What is "the thing"? (a file, a function, a project?)              │
│  • What does "better" mean? (faster, cleaner, more correct?)          │
│  • What input do I have to work with?                                  │
│                                                                        │
│  Try rephrasing:  ________________________________________________    │
│                   [Run with this description]                          │
│                                                                        │
│  Or use a template:  [Browse templates]                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

The three bullet points are generated from the specific missing components identified by the Sensemaker's parsing (not a generic list). The rephrase field is pre-focused for immediate typing.

---

## 3. Post-Execution Retrospective View

**Blocking item**: Design Lead — "design post-execution retrospective view (where Looking Back results, quality vectors, and learning events appear)."

### 3.1 When It Appears

The retrospective view appears automatically when all waves complete and the Looking Back Q1/Q2 results are ready. It does not replace the DAG visualization — it opens as a right-side panel (350px wide, collapsible) alongside the completed graph.

### 3.2 Retrospective Panel Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Graph View (680px)                        │  Retrospective (350px)    [◀ Hide] │
│                                            │                                    │
│  [completed DAG visualization]             │  Execution Complete                │
│                                            │  42.3s  |  $0.064  |  10 nodes    │
│                                            │                                    │
│                                            │  ── Quality ────────────────────  │
│                                            │  Floor     ████████████ 10/10     │
│                                            │  Wall      ████████████ 10/10     │
│                                            │  Ceiling   ████████░░░░  0.85     │
│                                            │  Envelope  █████████░░░  0.93     │
│                                            │                 interpretation:    │
│                                            │                 CLEAN              │
│                                            │                                    │
│                                            │  ── What the system learned ─────  │
│                                            │  cli-architect Elo +5 (1407)       │
│                                            │  typescript-module Elo +5 (1394)   │
│                                            │  config-file-parser Elo +17 (1218) │
│                                            │     ↑ learning fast (competent)    │
│                                            │                                    │
│                                            │  ── Result check ────────────────  │
│                                            │  Contract satisfied: YES           │
│                                            │  Unstated assumptions: 2           │
│                                            │    • CSV delimiter assumed comma   │
│                                            │    • Config assumed in cwd         │
│                                            │                                    │
│                                            │  ── Near-misses ─────────────────  │
│                                            │  None detected                     │
│                                            │                                    │
│                                            │  ── Cost vs. estimate ───────────  │
│                                            │  Estimated: $0.04-0.08             │
│                                            │  Actual:    $0.064  (within range) │
│                                            │                                    │
│                                            │  [View full trace]  [Export]       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Asynchronous Q3/Q4 Results

Q3 ("Could a different topology have worked?") and Q4 ("Can this be generalized?") run asynchronously and do not block the retrospective panel from appearing. When they complete (typically 10-30 seconds after the main execution), a subtle notification appears at the bottom of the retrospective panel:

"Additional analysis ready. [View]"

Clicking View expands a section:

```
  ── Deeper analysis ──────────────────────────────────────────────────────────
  Alternative topology (Q3):
    The yaml-config and csv-parser nodes could have been run in Wave 1
    alongside design-cli. This would have saved ~4 seconds.
    (Deferred because config structure was uncertain before CLI design.)

  Generalization candidate (Q4): [none — needs 3+ similar executions]
```

### 3.4 Monster-Barring Alerts

If any skill triggered the monster-barring detector during this execution, it appears as a distinct alert block in the retrospective panel:

```
  ── Skill health alert ───────────────────────────────────────────────────────
  config-file-parser may be shrinking instead of growing.
  Its "when NOT to use" list grew 62% recently, but its capabilities grew
  only 3%. This may mean the skill is excluding hard cases rather than
  solving them.
  [Review skill]  [Dismiss]
```

---

## 4. Wave Transition Animation Design

**Blocking item**: Design Lead — "vague node expansion creates jarring graph morphing — specify animation."

### 4.1 The Problem

When a vague node expands into a sub-DAG between waves, the graph structure changes. Without animation, this is an instantaneous jump that disorients the user — nodes appear and the graph reflows suddenly. The user loses their spatial reference.

### 4.2 Transition Specification

**Timing**:
- Total transition duration: 480ms
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad — fast start, gentle landing)
- No transition shorter than 320ms (perceptually jarring below that threshold)
- No transition longer than 600ms (feels sluggish for frequent users)

**Sequence**:

Phase 1 (0-80ms): The vague node signals expansion. It grows to 1.15x its normal size. A dashed border appears and pulses once. This telegraphs "something is about to happen here" before the graph changes.

Phase 2 (80-200ms): The vague node fades to 20% opacity while maintaining its position. Surrounding nodes begin sliding toward their new positions (the positions they will occupy after the expanded sub-nodes take space). This is a simultaneous, not sequential, slide.

Phase 3 (200-400ms): New nodes appear at the vague node's centroid. They start at 0 scale (invisible) and grow outward from the center point, each reaching full size by 400ms. Edges connecting the new nodes animate in as dashed lines growing from the source anchor point.

Phase 4 (400-480ms): The vague node disappears entirely (opacity 0, then removed from DOM). The dashed edges on new nodes become solid edges. The graph rests in its new configuration.

**Expand-in-place vs. create-below**:

Expand-in-place is used for vague nodes that expand to 3 or fewer sub-nodes. The sub-nodes occupy the approximate space the vague node held.

Create-below is used for vague nodes that expand to 4 or more sub-nodes. The sub-nodes appear below the vague node's position, which slides upward to make room. "Below" is relative to the execution direction (top-to-bottom graph layout is the default).

The reason: 4+ nodes cannot fit in the visual footprint of a single vague node without illegible compression. Placing them below preserves readability of existing nodes above.

**Visual continuity cues**:

A light connector line (1px, 40% opacity, gray) briefly persists between the former vague node's centroid and each new sub-node during Phase 3 and 4. This line is a memory trace that shows "these nodes came from here." It fades out at 600ms (after the main transition completes).

For wave completion (not vague node expansion), completed nodes darken by 15% over 200ms to recede visually, drawing attention to the active wave without removing completed nodes from view.

---

## 5. L1 Four-State Vocabulary Design

**Blocking item**: Psychologist — "collapse 9-color to 4-state vocabulary at L1."

### 5.1 Color Definitions

The four states must be distinguishable by users with deuteranopia (red-green colorblindness, 8% of male users), protanopia, and tritanopia. The specification uses hue + shape + animation together — no state relies on color alone.

| State | Primary Color | Hex | Secondary Cue | Animation |
|-------|--------------|-----|---------------|-----------|
| ACTIVE | Blue | `#1565C0` | Circular spinner on border | Pulse (opacity 70-100%, 1.2s cycle) |
| DONE | Teal-Green | `#00695C` | Checkmark icon inside node | None (static) |
| ATTENTION | Amber | `#E65100` | Diamond/warning icon inside node | Slow pulse-border (1.8s cycle) |
| PROBLEM | Red | `#B71C1C` | X icon inside node | None (static after failure) |

### 5.2 Colorblind-Safe Verification

- ACTIVE vs DONE: Distinguishable in all three common colorblindness types because blue and teal-green differ in both hue and brightness. Also distinguished by the spinner animation (ACTIVE) vs static (DONE).
- DONE vs ATTENTION: Teal-green vs amber are perceptually distant even in deuteranopia simulations. Also distinguished by checkmark vs diamond icon.
- ATTENTION vs PROBLEM: Amber vs red are a challenge in protanopia. Resolved by the pulsing animation on ATTENTION vs static appearance of PROBLEM, and by the distinct diamond vs X iconography.
- ACTIVE vs PROBLEM: Blue vs red with spinner vs static. Clearly distinct under all colorblindness simulations.

All icons are 16px minimum size and use 2px stroke weight for visibility at small node sizes.

### 5.3 L2 Expansion of the 9-State Internal Model

When the user switches to L2 (or hovers on a node), the four states expand to show the internal nine-state model. Internal state names never appear at L1.

| L1 State | L2 Detail State | Visual Indicator at L2 |
|----------|----------------|------------------------|
| ACTIVE | pending | Node outline only, gray fill |
| ACTIVE | scheduled | Blue outline, no fill |
| ACTIVE | running | Blue fill, spinner animation |
| DONE | completed | Teal fill, checkmark |
| DONE | skipped | Teal outline, gray fill, strikethrough text |
| ATTENTION | paused (human gate) | Amber fill, diamond icon, pulse-border |
| ATTENTION | mutated | Amber fill, diamond icon, glow |
| PROBLEM | failed | Red fill, X icon |
| PROBLEM | retrying | Red fill, X icon, orange spin-border |

### 5.4 Commitment Level Encoding

Orthogonal to state, commitment level is encoded in the node border thickness:
- COMMITTED: 3px solid border
- TENTATIVE: 2px solid border
- EXPLORATORY: 1.5px dashed border

This communicates confidence without adding new colors. A DONE node with a dashed border tells the user the skill that succeeded here was in exploratory mode — worth noting.

---

## 6. Five Cognitive Load Spikes

**Blocking item**: Design Lead — "5 cognitive load spikes identified." The Design Lead named them: first novel execution, first mutation, first halt gate, human gate wait, multi-dimensional quality vector.

For each spike, this section specifies what the user sees, what information is presented at L1, and what is hidden behind progressive disclosure.

### 6.1 Spike 1: First Novel Execution

**When it occurs**: The user's first real DAG run after the demo.

**What the user sees at L1**:
- The pre-execution plan preview (section 2.3) with a brief callout: "This is your first run. The system is learning as it goes."
- During execution: the standard graph view with progress animation.
- After execution: the retrospective panel with a single additional callout pointing at the "What the system learned" section: "These skill ratings just updated because of your run."

**What is presented**:
- Total cost, total time, quality scores (four-layer summary)
- How many skills were updated (plain count, no Elo numbers at L1)

**What is hidden behind L2**:
- The Elo rating values and per-dimension scores
- K-factor values and developmental stage labels
- Thompson sampling parameters

**Interaction**: The L2 "What did the system learn?" section is surfaced as a clickable link in the retrospective panel with the label "What do these mean?" — linking to the explanation view.

### 6.2 Spike 2: First Mutation

**When it occurs**: A node fails and the system replans by mutating the DAG structure.

**What the user sees at L1**:
- The failed node turns PROBLEM state momentarily.
- A notification banner appears (amber, not red): "One step didn't work as planned. The system is trying a different approach."
- The ATTENTION node animates into view as the mutation is applied.
- After the mutated path completes: the banner changes to "Problem resolved. Continued with a different approach."

**What is presented**:
- Plain language: "Step X didn't work. The system rewrote that part of the plan."
- Whether the mutated approach succeeded or failed (DONE or PROBLEM state).

**What is hidden behind L2**:
- The failure classification (system layer, cognitive mechanism, decomposition level)
- The mutation strategy that was applied (auxiliary problem technique used)
- The escalation level that triggered the mutation

**Interaction**: The amber banner has a "What happened?" link that opens the L2 failure panel explaining the mutation in plain language: "This step failed because the output format didn't match what the next step needed. The system rewrote the step to fix the format."

### 6.3 Spike 3: First Halt Gate

**When it occurs**: The Sensemaker halts because the problem statement is below the clarity threshold.

**What the user sees**: The HALT state (section 2.5). This is the pre-execution halt, not a mid-execution halt.

For a mid-execution halt (if a node cannot proceed due to insufficient context), the experience is:

**What is presented**:
- "One step needs more information to continue." (amber banner)
- The specific question the node cannot answer without more context
- Three suggested responses to click or a free-text field

**What is hidden behind L2**:
- Which quality dimension triggered the halt
- The clarity score that fell below threshold
- The Sensemaker's parsed understanding of the problem state

### 6.4 Spike 4: Human Gate Wait

Full specification is in Section 7. At the cognitive load spike level:

**What the user sees**:
- A modal overlay (cannot be dismissed without responding)
- Cognitive warmup: 2-sentence global context before the question
- The specific question with its gate classification badge (IRREVERSIBLE/QUALITY_CHECK/CALIBRATION)
- A timer showing remaining time before timeout
- Recommended action prominently displayed

**What is hidden behind L2**:
- The gate's position in the escalation ladder
- The cost-of-wrong-decision calculation
- The evaluator weight for human judgment at this gate

### 6.5 Spike 5: Multi-Dimensional Quality Vector

**When it occurs**: After any execution, when the user first encounters quality scores.

**What the user sees at L1**:
- A single number: aggregate quality (e.g., "0.87")
- A four-bar summary: Floor, Wall, Ceiling, Envelope — each shown as a filled bar

**What is hidden behind L2**:
- The QualityVector dimensions: accuracy, contract_compliance, process_quality, efficiency
- How each dimension is weighted
- The distinction between Stage 1 and Stage 2 evaluation channels
- The bias mitigations that were applied

**How L2 is surfaced**: A "Quality breakdown" link in the retrospective panel. The L2 view shows a radar chart of the four QualityVector dimensions with plain-language labels:

| Technical Name | L2 Label |
|---------------|----------|
| accuracy | How correct the content is |
| contract_compliance | Did it follow the spec exactly? |
| process_quality | Was the reasoning sound? |
| efficiency | Did it take a direct path? |

---

## 7. Human Gate UX

**Blocking items**: PM — "clarify Halt Gate UX"; Psychologist — "cognitive warmup at gate invocation, classify by irreversibility."

### 7.1 Gate Classification Badges

Every human gate displays one of three classification badges, visually prominent (top-right of the gate modal). The badge communicates what kind of decision this is before the user reads the question.

| Badge | Color | Meaning | Decision Weight |
|-------|-------|---------|-----------------|
| IRREVERSIBLE | Red background, white text | This action cannot be undone | Maximum care required |
| QUALITY CHECK | Amber background, white text | Approve or reject work product | Normal care |
| CALIBRATION | Blue background, white text | Confirm direction, validate approach | Light touch |

Max 1 IRREVERSIBLE gate per DAG execution. Max 2 QUALITY CHECK gates. Unlimited CALIBRATION gates, but they are batched when more than 3 occur (see section 7.4).

### 7.2 Gate Modal Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                                          [IRREVERSIBLE]   3:45 ⏱    │
│                                                                      │
│  Context                                                             │
│  ──────────────────────────────────────────────────────────────────  │
│  You asked the system to migrate the user database from MySQL to     │
│  PostgreSQL. The plan has been verified and all tests pass locally.  │
│  This is the final step: applying the migration to production.       │
│                                                                      │
│  Your decision                                                       │
│  ──────────────────────────────────────────────────────────────────  │
│  Apply the migration to the production database?                     │
│                                                                      │
│  If you approve: The migration runs. This cannot be reversed         │
│  without a backup restore (estimated 45 minutes of downtime).        │
│                                                                      │
│  If you decline: The system stops here. Your local artifacts         │
│  are preserved. You can re-run with --dry-run to review again.       │
│                                                                      │
│  Recommended: APPROVE (all pre-checks passed)                        │
│                                                                      │
│  ──────────────────────────────────────────────────────────────────  │
│  [Approve]                                    [Decline]  [I need more information]
└──────────────────────────────────────────────────────────────────────┘
```

### 7.3 Cognitive Warmup Design

The "Context" block at the top of the gate modal is the cognitive warmup. It always precedes the question. It has two mandatory elements:

1. **Global context**: What is the overall task and where in the execution is the system?
   "You asked the system to migrate the user database from MySQL to PostgreSQL. The plan has been verified and all tests pass locally."

2. **Why this gate exists**: What decision point has been reached?
   "This is the final step: applying the migration to production."

The cognitive warmup is generated from the DAG's overall problem statement plus the node's position and purpose. It cannot be skipped. It ensures the user has reconstructed their mental model of the task before reading the specific question.

### 7.4 Timer and Timeout Behavior

The timer is displayed in the top-right corner of the gate modal, counting down from the configured timeout (default: 5 minutes for IRREVERSIBLE, 10 minutes for QUALITY_CHECK, 15 minutes for CALIBRATION).

At 60 seconds remaining: the timer turns amber and a gentle audio cue plays (optional, user-configurable).

At 0 seconds: the system applies the configured timeout behavior:

| Gate Type | Default Timeout Action | Override Options |
|-----------|----------------------|------------------|
| IRREVERSIBLE | Halt DAG, preserve all artifacts | Fail DAG / Extend timer |
| QUALITY CHECK | Proceed with "approved" (conservative) | Halt DAG / Extend timer |
| CALIBRATION | Proceed with best available judgment | Halt DAG |

The timeout action is communicated to the user before the timer expires: "If this times out, the system will [action]."

If a human gate times out and the DAG halts, the resumption path is: `windags resume <execution-id>`, which re-presents the gate with context reconstructed from the execution trace.

### 7.5 Complacency Break Mechanism

When a user's approval rate exceeds 95% over their last 20 gate responses, 1 in every 20 subsequent gates is silently replaced with a calibration case — a known-good or known-bad result that the system has evaluated independently.

The user is not told this is a calibration case during the gate interaction (disclosure during would bias the response). After the current execution completes, if the user responded incorrectly to a calibration case:

"You've been approving everything recently — which is great if everything is great. In this run, one of the review points had a known issue and was approved. Would you like to see which one?"

The tone is informational, not accusatory. The user retains full autonomy over all decisions. The complacency break is a data point, not a penalty.

---

## 8. Failure Explanation Layer

**Blocking item**: Design Lead — "translate 4D taxonomy to plain language."

The four-dimensional failure taxonomy (System Layer, Cognitive Mechanism, Decomposition Level, Protocol Level) is an internal classification system. Users never see these terms. For each failure type the system can detect, the following table specifies the exact L1 message shown to the user.

### 8.1 L1 Failure Messages by System Layer

| Internal Type | L1 Message |
|--------------|------------|
| crash | "This step encountered an unexpected error and stopped." |
| crash-recovery | "This step crashed but recovered automatically and tried again." |
| omission | "This step didn't produce a result. The system is trying a different approach." |
| byzantine | "This step produced an unexpected output format. Retrying with clearer instructions." |

### 8.2 L1 Failure Messages by Cognitive Mechanism (shown at L2 only, but in plain language)

| Internal Type | L2 Plain-Language Explanation |
|--------------|-------------------------------|
| misclassification | "The system misidentified what kind of problem this step was. It used the wrong approach and is correcting." |
| SA-shift | "Something earlier in the plan changed, and this step was working from outdated information." |
| queue_exhaustion | "This step ran out of attempts. The system needed to try too many alternatives." |
| articulation_gap | "The step's output didn't match what the next step expected, even though both were working correctly." |
| availability_bias | "The system defaulted to a familiar approach that wasn't right for this specific situation." |

### 8.3 L1 Failure Messages by Decomposition Level

| Internal Type | L1 Message |
|--------------|------------|
| granularity_mismatch | "This step was too big to execute reliably. The system is breaking it into smaller pieces." |
| semantic_gap | "This step expected information that earlier steps didn't produce. Replanning to fill the gap." |
| method_explosion | "This step required more sub-steps than expected. Restructuring the plan." |
| cascading_task_failure | "An earlier failure caused this step to receive incomplete input. Replanning from the affected point." |

### 8.4 Combined L1 Messages (Final Deliverable Failures)

When a final deliverable fails, the L1 message follows a single consistent template:

"The final result didn't [what it was supposed to do]. [One-sentence reason in plain language]. [What the system is doing about it or what the user should do.]"

Examples:

- "The final result didn't compile. The TypeScript code had a type error that the tests exposed. The system is fixing the type error and re-running the tests."
- "The final result didn't match your specification. The API was missing the authentication endpoint you described. The system is adding the missing endpoint."
- "The final result couldn't be verified. The quality check found the logic was correct but the documentation was incomplete. Review the documentation section before using."

### 8.5 L3 Full Classification

At L3, the full 4D classification is displayed in the node's failure detail panel:

```
Failure Classification (L3)
  System Layer:        omission
  Cognitive Mechanism: articulation_gap
  Decomposition Level: semantic_gap
  Protocol Level:      agent_level

  Escalation Response: L2 (structure diagnosis)
  Mutation Applied:    restate auxiliary problem
  Resolution:         RESOLVED (mutated node completed at quality 0.81)
```

---

## 9. Progressive Disclosure Implementation

**Decision**: Constitution Part 3, ADR-028. This section operationalizes it.

### 9.1 Level 1 (L1): Overview — Default for All Users

**Accessible to**: All users. The default state of the application.

**What is visible**:
- DAG node states using the four-state vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM)
- Overall DAG progress as a fraction (e.g., "7 of 10 tasks complete")
- Cost ticker (live, updates with each node completion)
- Aggregate quality score (single number, 0.0-1.0)
- Wave progression indicator
- Estimated time remaining

**What is hidden**:
- Node internal states (pending/scheduled/running/etc.)
- Quality vector dimensions
- Skill names and Elo ratings
- Decomposition provenance
- Any terminology from BDI, HTN, or Thompson sampling
- Failure classification codes

**Navigation to L2**: Click any node. The node expands to its L2 detail panel. A "Press 1/2/3 to switch depth" hint appears on first expansion.

### 9.2 Level 2 (L2): Explanation — Power Users

**Accessible to**: Any user who clicks through or presses `2`.

**What is visible** (in addition to L1):
- Full nine-state node status with human-readable labels
- Quality vector dimensions with plain-language labels (see section 6.5)
- `layer2_summary` field — required natural-language explanation of what the node did and any decisions it made. Example: "The agent chose to implement error handling as a separate function rather than inline, which improves testability."
- Skill name used for the node (but not Elo ratings)
- Commitment level (plain text: "This skill is proven for this task type" / "The system will reconsider if quality drops" / "This is an experimental approach")
- Reasoning trace (collapsible, shows the node's step-by-step reasoning)
- Decomposition provenance ("This task was created from the software-project-scaffold pattern")

**What is hidden**:
- Thompson sampling alpha/beta values
- Elo rating numbers and dimensional breakdown
- BDI intention reconsideration logic
- Cognitive telemetry events
- Raw LLM call logs

**Navigation to L3**: From any L2 panel, a "Deep inspection" link or pressing `3`.

### 9.3 Level 3 (L3): Deep Inspection — Developers and Auditors

**Accessible to**: Users who explicitly navigate to L3.

**What is visible** (in addition to L1 and L2):
- Full TypeScript type dump for the node's ConcreteNode definition
- Thompson sampling parameters (alpha, beta, K-factor, developmental stage)
- Elo rating with per-dimension breakdown (accuracy, efficiency, reliability, cost, freshness)
- Cognitive telemetry events (recognition events, expectation events, surprise events)
- Raw LLM call logs with token counts and timing
- Circuit breaker state and history for assigned skill
- Full 4D failure classification (if applicable)
- Causal event trace (ordered log of every event that affected this node)
- DSPy compiled parameter state (Phase 3 only)

**What is hidden**: Nothing within the node scope.

**L3 is intentionally verbose**. It is designed for developers auditing system behavior, not for routine use. A "Back to overview" link is persistent and prominent.

### 9.4 Navigating Between Levels

Three interaction patterns support level switching:

1. **Keyboard**: `1`, `2`, `3` keys switch the active node's disclosure level. Displayed as a persistent hint in the toolbar during any node inspection.

2. **Click depth**: Clicking a node once opens L1 detail (same as L1 overview but for that node). Clicking the "Explain" button opens L2. Clicking "Deep inspect" opens L3.

3. **Global level**: A toolbar control sets the global disclosure level, which becomes the default for all new node openings in the current session. This is for developers who want L3 for everything, without clicking through for each node.

Level switching is non-destructive — the view is never regenerated from scratch. Switching from L3 to L1 collapses the view but the L3 data remains loaded and re-expands instantly.

---

## 10. Design Sprint Plan

**Blocking item**: PM — "5-minute Hello World needs engineering budget and user testing protocol"; CEO — "write critical path document."

### 10.1 Screen Priority Order

The screens are sequenced by the critical path to the 5-minute Hello World claim. The claim requires that a user can install, configure, and complete a real DAG in under 5 minutes. Every screen that blocks that path is in Phase 1A.

**Phase 1A (Weeks 1-2): Critical Path Screens**

These screens must exist for any user to complete Hello World.

1. **Installation and API key configuration** — The three-screen onboarding flow (section 1.4). Must be zero-friction. User testing success criterion: median time from `npm install -g windags` to "API key configured" under 90 seconds.

2. **Problem input and Sensemaker display** — The pre-execution Phase A screen (section 2.2). Must render the Sensemaker analysis animation within 200ms of submission.

3. **Plan preview** — The pre-execution Phase B screen (section 2.3). Must render the plan before any LLM execution cost is incurred. User testing success criterion: 90% of users understand what is about to run without reading documentation.

4. **Live execution graph** — The Graph mode L1 view with the four-state vocabulary (section 5). Must update in real time via WebSocket. Resilience overlay default-on.

5. **Retrospective panel** — The post-execution panel (section 3.2). Must appear within 2 seconds of DAG completion. Q1/Q2 results always shown immediately.

**Phase 1B (Weeks 3-4): Cognitive Load Mitigation Screens**

These screens prevent user abandonment after Hello World.

6. **First mutation notification** — The amber banner and "What happened?" link (section 6.2).

7. **HALT state** — The clarification screen for low-clarity problems (section 2.5).

8. **Human gate modal** — Full implementation with cognitive warmup, classification badges, and timer (section 7.2).

9. **L2 disclosure panels** — `layer2_summary` display, quality vector with plain-language labels, reasoning trace.

10. **Retrospective Q3/Q4 async notification** — The "Additional analysis ready" banner (section 3.3).

**Phase 1C (Weeks 5-6): Power-User and Demo Surfaces**

11. **Demo DAG with guided tour** — Pre-executed demonstration with four tooltip callouts (section 1.2).

12. **Problem type picker** — The five domain tiles with example problems (section 1.3).

13. **L3 disclosure panels** — Full technical inspection including Thompson parameters, Elo dimensional breakdown, and cognitive telemetry.

14. **Wave transition animations** — The 480ms expand-in-place / create-below animation system (section 4).

15. **Complacency break mechanism** — Post-execution calibration notification (section 7.5).

### 10.2 User Testing Protocol for the 5-Minute Hello World Claim

**Test design**: Unmoderated remote usability test using Maze or UserTesting.com. Participants recruited from the beta waitlist (self-selected, likely developer audience — appropriate for the target persona).

**Target n**: 20 participants for Phase 1A validation, 40 for Phase 1 release validation.

**Task script**:
"You have just heard about WinDAGs, an AI tool for complex tasks. Please install it and use it to solve this problem: [problem statement]. We will observe and time your session. Please think aloud as you work."

Problem statement for testing: "Write a Python function that finds all duplicate email addresses in a list."

This problem is chosen because:
- It is clear and specific (Sensemaker will not halt)
- It is completable in under 20 seconds of execution time
- It produces a verifiable output (participants can judge whether it solved their problem)

**Measurement points**:

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Time from install to first DAG submission | < 3 minutes | Session recording |
| Time from submission to first DAG completion | < 2 minutes | Execution logs |
| Total Hello World time | < 5 minutes | Session recording |
| Participant understands what happened | 80%+ | Post-task survey: "What did the system do?" open response |
| Participant confidence to run another DAG | 70%+ | Post-task Likert scale |
| Participant encounters critical confusion | < 20% | Moderator coding of think-aloud transcripts |

**Success criterion for launch**: All five targets met in the final round of testing before Phase 1 release.

**Failure handling**: If the 5-minute target is missed at the median (not just at outliers), investigate which of the three time segments (install, problem submission, execution wait) is the blocker. Each segment has a 2-minute budget. Scope reduction is not acceptable — the problem is the clock, not the feature set.

### 10.3 Screen Design Sequencing Within Each Phase

Each screen follows a four-step design process before handoff to engineering:

1. **Wireframe** (ASCII or Figma lo-fi): Layout and information hierarchy. Review with PM and Design Lead.
2. **Interaction spec**: Animation timings, state transitions, error states. Review with Design Lead.
3. **Prototype**: Figma hi-fi or React prototype with mock data. User test with 3-5 participants.
4. **Engineering handoff**: Component spec, WebSocket event map, accessibility requirements.

The fifteen screens are not designed in strict sequence. Screens 1-5 (Phase 1A) are designed in parallel across two designers in Weeks 1-2. Screens 6-10 (Phase 1B) begin design in Week 2, overlapping with Phase 1A engineering. This produces a two-week rolling handoff cadence throughout Phase 1.

### 10.4 Accessibility Baseline

All screens meet WCAG 2.1 AA as a minimum before engineering handoff. Specific requirements:

- Color-only information: None. Every color-coded state has a secondary cue (icon, animation, or text label).
- Focus management: Human gate modal traps focus until dismissed. All gate actions reachable by keyboard.
- Motion: All animations respect `prefers-reduced-motion`. When reduced-motion is set, state transitions are instantaneous. The 5-minute Hello World timing target is measured with reduced-motion disabled (full animations).
- Screen reader: Node states are announced as the state changes. "Node csv-parser: complete." Human gate appearance triggers an ARIA live region announcement.

### 10.5 Known Design Gaps (Deferred from Phase 1)

Two items raised in the reviews are intentionally deferred and not addressed in Phase 1:

1. **DAG authoring mode** — The Design Lead noted that users cannot modify the decomposition before running. This is a power-user surface that requires a full design sprint to do correctly. Deferred to Phase 2.

2. **Output export formats** — Markdown, PDF, GitHub PR, Notion/Confluence. The Phase 5.5 preservation audit flagged this as missing from V3. CLI output via `windags output last` is available. UI export beyond that is Phase 2.

These gaps are not blocking the 5-minute Hello World claim, which requires only that users can run a DAG and inspect the results. They will be addressed before Phase 2 release.

---

*End of WinDAGs V3 UX Design Roadmap. This document closes all blocking UX items from the Phase 5 review brief. Proceed to engineering handoff for Phase 1A screens.*
