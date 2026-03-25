---
license: Apache-2.0
name: causal-reasoning-klein
description: Expert causal reasoning and mental model construction for diagnosis and prediction in complex domains
category: Cognitive Science & Decision Making
tags:
  - causal-reasoning
  - mental-models
  - expertise
  - diagnosis
  - ndm
---

# SKILL.md — Causal Reasoning in the Wild (Klein & Hoffman)

license: Apache-2.0
---

## Metadata

```yaml
name: causal-reasoning-klein
description: >
  Skill for naturalistic causal reasoning — diagnosing why things happened,
  attributing causes under uncertainty, building explanatory frames, and
  deciding when to stop analyzing and start acting. Based on Klein & Hoffman's
  empirical taxonomy of how experts actually reason about causality in messy,
  real-world domains.
activation_triggers:
  - "why did this happen"
  - "what caused this failure"
  - "root cause analysis"
  - "debugging / post-mortem / incident review"
  - "causal attribution"
  - "explain this outcome"
  - "what went wrong"
  - "how do we prevent this"
  - "diagnosis / diagnosing"
  - "what's the real reason"
  - "multiple possible causes"
  - "I can't find the cause"
version: 1.0
source: >
  Klein, G. & Hoffman, R. — "Causal Reasoning: Initial Report of a
  Naturalistic Study of Causal Inferences"
```

---

## When to Use This Skill

Load this skill when:

- **Diagnosing failures** — a system, process, decision, or outcome went wrong and you need to explain why
- **Causal attribution is contested** — multiple competing explanations exist and you need a framework for evaluating them
- **The "obvious" cause feels too simple** — someone is reaching for a single root cause in a situation that is clearly complex
- **You're designing diagnostic agents** — building an agent or orchestration system that must investigate and explain failures
- **Closure is hard** — analysis keeps expanding and you need principled criteria for when to stop
- **Explanation type matters** — you need to choose *how* to explain something, not just *what* to explain
- **Post-mortems or retrospectives** — organizational, technical, or strategic failure reviews
- **Experts disagree about cause** — different framings produce different cause-sets and you need to understand why

Do **not** primarily rely on this skill for:
- Pure statistical causal inference (use Judea Pearl / do-calculus frameworks instead)
- Formal fault tree analysis with known component failure rates
- Situations where full information is available and the cause is unambiguous

---

## Core Mental Models

### 1. Five Explanation Types — Form Shapes What Gets Found

Real-world causal reasoning uses five structurally different explanation forms. The form chosen is not neutral — it determines what counts as a "relevant cause" to search for.

| Type | What it looks like | Domain bias |
|---|---|---|
| **Event** | "X happened, which caused Y" — counterfactual, reversible | Sports, military decisions |
| **Abstraction** | "This is an instance of pattern P" — category-based | Law, medicine, science |
| **Condition** | "The environment made this inevitable" — structural | Policy, safety analysis |
| **List** | "Factors A, B, C contributed" — enumeration without mechanism | Journalism, early diagnosis |
| **Story** | "A complex interaction of X, Y, Z unfolded over time" — mechanistic narrative | Economics, complex failures |

**Why it matters**: An agent using only event-type reasoning in a systemic failure will miss structural conditions. An agent defaulting to list-type reasoning will enumerate causes without modeling how they interact.

---

### 2. The Reciprocal Model — Frames and Causes Co-Construct Each Other

The search for causes and the construction of an explanatory frame happen **simultaneously**, not sequentially. The frame determines what counts as a relevant cause; the causes found reshape the frame.

```
[Candidate Causes] ←→ [Explanatory Frame]
        ↑                       ↑
        └─── each reshapes the other in real time ───┘
```

**Critical implication**: If you start with the wrong frame, you will systematically miss causes that don't fit it — not because you're careless, but because the frame defines the search space. Changing the frame isn't "trying harder"; it's accessing a different set of candidate causes entirely.

---

### 3. Three Attribution Criteria — Propensity, Reversibility, Covariation

These are the workhorses of causal judgment. They operate independently and can produce conflicting verdicts:

- **Propensity**: Could this plausibly lead to that? (mechanism, plausibility)
- **Reversibility (Mutability)**: Would removing this cause eliminate the effect? (counterfactual test)
- **Covariation**: Do cause and effect travel together statistically? (correlation, pattern)

**The watch-factory problem**: Context can flip all three verdicts simultaneously. A cause that passes all three criteria in isolation may fail all three in a different systemic context. Always apply all three; always ask whether context reverses the verdict.

---

### 4. The Reductive Tendency — Necessary Trap

Humans systematically compress dynamic, nonlinear, simultaneous causality into linear, sequential chains. This is both:

- **Cognitively necessary** — you cannot act on a fully simultaneous multi-causal model
- **Epistemically dangerous** — the compression creates fiction that becomes invisible

The correct response is not to eliminate reduction but to **know which register you're in**:
- **Diagnostic mode**: resist reduction, hold complexity, use story-type explanation
- **Action mode**: embrace reduction, identify the actionable cause, achieve closure

Agents that operate only in one register will fail in the other.

---

### 5. Indeterminate Causation — The Norm, Not the Exception

In organizational, political, military, and economic domains, **there is no single true cause**. Multiple interacting partial causes are the rule. The quest for *the* root cause:

- Is an epistemological error
- Produces oversimplification
- Generates interventions that fix the named cause while leaving structural vulnerabilities intact

The correct output of causal reasoning in complex domains is a **partial-cause set** with explicit representation of uncertainty, not a single root cause with false precision.

---

## Decision Frameworks

### Which Explanation Type Should I Use?

```
IF the domain is competitive/event-driven AND reversibility is high
  → USE Event explanation (counterfactual framing)

IF you recognize a known failure pattern from prior cases
  → USE Abstraction explanation (pattern matching)

IF the failure was structurally overdetermined (would have happened anyway)
  → USE Condition explanation (enabling conditions framing)

IF causes are numerous, interactive, and mechanism is unclear
  → USE Story explanation (rich causal narrative)

IF you are at an early diagnostic stage with incomplete information
  → USE List explanation (enumeration) AS A TEMPORARY SCAFFOLD
  → Plan to upgrade to Story or Condition as information arrives
```

---

### Am I Using the Right Frame?

```
IF you've been searching for causes and keep finding nothing
  → The frame is probably wrong, not the search
  → Load: references/reciprocal-framing-and-causal-search.md
  → Deliberately adopt an alternative frame and restart

IF experts with different backgrounds disagree about cause
  → They are likely using different frames, not different evidence
  → Map which explanation type each expert is using
  → Look for the cause-set each frame is structurally incapable of seeing

IF the causal story feels too clean or too linear
  → You have over-reduced
  → Load: references/reductive-tendency-and-when-to-resist-it.md
  → Ask: what simultaneity and interaction have I compressed away?
```

---

### Evaluating a Candidate Cause

```
FOR each candidate cause, apply all three criteria:

  Propensity test:
    "Is there a plausible mechanism by which this could produce the effect?"
    IF no → weak candidate, but don't eliminate (unknown mechanisms exist)
    IF yes → proceed to reversibility

  Reversibility test:
    "If we remove this cause, does the effect go away?"
    IF no → this is an enabling condition, not a trigger cause
    IF yes → strong candidate
    IF unclear → the system may be overdetermined (effect has multiple sufficient causes)

  Covariation test:
    "Does this cause co-occur with this effect across cases?"
    IF no → likely spurious or context-specific
    IF yes → corroborating evidence (not proof)

  Context reversal check:
    "Does the systemic context flip any of these verdicts?"
    Load: references/three-causal-criteria-for-agent-diagnosis.md
```

---

### When to Stop Analyzing (Closure Decision)

```
IF stakes are low AND time pressure is high
  → Close early, use action-cause (the single most actionable cause)
  → Document that full causal story is unresolved

IF stakes are high AND time is available
  → Continue until Story-type explanation is coherent
  → Require that enabling conditions are identified, not just trigger causes

IF analysis keeps expanding without convergence
  → Check: are you holding multiple frames simultaneously?
  → Apply proportionality: closure depth must match decision stakes
  → Load: references/closure-decisions-and-the-action-understanding-tradeoff.md

IF you must act before understanding is complete
  → Design the action as a probe: what will this action reveal about cause?
  → Action-as-investigation is how experts close the analysis/action gap
```

---

### Designing a Diagnostic Agent or Orchestration

```
IF building parallel investigation agents
  → Deliberately assign DIFFERENT initial frames to each agent
  → Frame diversity is not inefficiency — it is the mechanism for finding
    causes that a single frame would miss

IF deciding when to commit an orchestrator to an output
  → Apply the closure criteria above
  → Require dual output: action-cause (for intervention) + causal story (for structure)

IF decomposing a complex failure into sub-investigations
  → Map to explanation type first
  → Story-type failures → decompose into parallel causal streams modeled jointly
  → Condition-type failures → decompose around structural features
  → NEVER decompose simultaneous processes as sequential (reductive trap)
  → Load: references/causal-stories-as-system-models.md
```

---

## Reference Table

Load these files **on demand** when the specific sub-problem arises. Do not load all at once.

| File | Load When… |
|---|---|
| `references/five-forms-of-causal-explanation.md` | You need to identify which explanation type is being used, or choose the right type for a diagnosis task. Core taxonomy reference. |
| `references/reciprocal-framing-and-causal-search.md` | The search for causes is stalling or producing thin results. Reframing is needed. Frame/cause reciprocity must be explained or operationalized. |
| `references/three-causal-criteria-for-agent-diagnosis.md` | Evaluating specific candidate causes. Propensity, reversibility, or covariation criteria need detailed application. Context-reversal cases. |
| `references/reductive-tendency-and-when-to-resist-it.md` | The causal account feels too linear or simple. A system failure involved simultaneity or interaction that may have been compressed away. |
| `references/indeterminate-causation-and-partial-explanations.md` | Multiple causes are present and cannot be cleanly ranked. "Root cause" pressure is distorting the analysis. Need to represent partial causation. |
| `references/domain-expertise-and-causal-frame-selection.md` | An expert's causal judgment seems opaque or unjustified. Modeling why experts pick different frames than novices in the same situation. |
| `references/causal-stories-as-system-models.md` | The failure is complex, systemic, or organizational. A narrative causal model is needed. Designing an agent to reason about multi-stream interactions. |
| `references/closure-decisions-and-the-action-understanding-tradeoff.md` | Analysis must end and action must begin. Deciding proportional closure depth. Designing probe-actions. Orchestration commit decisions. |

---

## Anti-Patterns

These are the mistakes Klein & Hoffman's research most directly warns against:

**1. Root Cause Fundamentalism**
Treating "find the single root cause" as the goal of causal analysis. In complex domains, this produces a named cause that absorbs blame while leaving structural vulnerabilities intact. The right output is a partial-cause set with interaction structure.

**2. Frame Blindness**
Searching harder within a frame that isn't working, rather than changing the frame. When a search stalls, the failure is usually in the frame, not in the effort. Frame-switching is a first-class diagnostic move, not an admission of failure.

**3. Sequential Compression of Simultaneous Causation**
Describing processes that happen in parallel and interact as if they happened in sequence. This is the reductive tendency at its most dangerous — the narrative becomes plausible and the simultaneity that produced the failure becomes invisible.

**4. Explanation Type Mismatch**
Using event-type explanation for condition-caused failures (e.g., "if only the pilot had done X differently" when the system was structurally unsafe). Or using list-type explanation when a story-type account is needed to model interaction effects.

**5. Premature Closure Under Complexity**
Achieving closure at the action-cause level and treating it as complete understanding. Action-causes (the trigger to intervene on) are not the same as causal stories (the structural understanding needed to prevent recurrence). Both are needed; treating one as sufficient produces intervention that fixes nothing durable.

**6. Commentator Reasoning Applied to Participant Situations**
Analyzing expert decisions as if the expert had full information, no time pressure, and was not causally entangled in the situation. Commentator reasoning (post-hoc, reflective, unconstrained) is structurally different from participant reasoning (real-time, action-pressured, self-entangled). Applying the former standard to the latter situation produces unfair and useless diagnosis.

**7. Covariation Treated as Sufficient for Causation**
Statistical co-occurrence confirms a causal hypothesis but does not establish it. Propensity (mechanistic plausibility) and reversibility (counterfactual test) must also be applied. Covariation-only reasoning produces interventions that address correlates rather than causes.

---

## Shibboleths

*How to tell if someone has actually internalized this book vs. skimmed a summary:*

**They will spontaneously ask "which explanation type is this?"**
Someone who has read only the summary will say "there are five types of causal explanation." Someone who has internalized it will, when encountering a causal claim, immediately ask which type is being used — and notice when the type is wrong for the situation.

**They treat frame-switching as a first move, not a last resort.**
Naive readers conclude "try harder if the search fails." Internalized readers ask "is the frame the problem?" early and treat deliberate reframing as a normal diagnostic tool, not a sign of failure.

**They distinguish action-causes from causal stories without prompting.**
They will say something like: "We know what to fix right now, but we don't yet understand why the system was vulnerable — those are two different questions and we need both answers."

**They are suspicious of single-cause explanations in complex domains.**
Not because they oppose simplicity, but because they have a specific concept — indeterminate causation — that makes single-cause accounts in organizational or systemic contexts feel epistemologically naive, not just incomplete.

**They understand why experts and novices reach for different frames.**
They won't say "the expert is biased" or "the novice is naive." They will explain, mechanistically, which causal features each frame makes visible and which it occludes — and why an expert's frame reflects accumulated knowledge about which features are typically diagnostic in that domain.

**They use "propensity," "reversibility," and "covariation" as working vocabulary.**
And more importantly, they apply them independently — they know that a cause can satisfy one criterion and fail another, and they know that context can reverse verdicts they thought were settled.

**They think about closure as a design parameter, not a discovery.**
They don't ask "when will we know enough?" They ask "given the stakes, how deep should closure be, and what is the minimum causal story sufficient for proportionate action?"

---

*This skill indexes eight reference documents. Load them on demand as specific sub-problems arise. The skill itself is sufficient for most high-level causal reasoning tasks; the reference files provide working depth for complex cases.*