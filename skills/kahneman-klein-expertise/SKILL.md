---
license: Apache-2.0
name: kahneman-klein-expertise
description: Integration of Kahneman's heuristics research with Klein's expertise studies on intuitive decision-making
category: Cognitive Science & Decision Making
tags:
  - expertise
  - intuition
  - decision-making
  - heuristics
  - kahneman
---

# SKILL.md — Conditions for Intuitive Expertise (Kahneman & Klein)

license: Apache-2.0
```yaml
name: kahneman-klein-expertise
version: 1.0
description: >
  A unified framework for diagnosing when intuitive or expert judgment can be
  trusted versus when it produces confident noise — and how to architect
  decision systems accordingly. Based on Kahneman & Klein's synthesis of
  Naturalistic Decision Making and Heuristics & Biases traditions.
activation_triggers:
  - questions about when to trust agent confidence scores or outputs
  - designing orchestration logic for multi-agent systems
  - evaluating whether a domain warrants algorithmic vs. judgment-based approaches
  - debugging overconfident agent behavior in low-signal environments
  - task decomposition architecture decisions
  - building feedback loops for agent learning and validation
  - assessing whether expertise claimed by a system or human is genuine
  - calibration, uncertainty quantification, or epistemic humility requirements
  - post-mortem or pre-mortem failure analysis of agent decisions
```

---

## When to Use This Skill

Load this skill when facing questions like:

- **"Should I trust this output?"** — especially when the output feels coherent and confident
- **"Which agent/tool/approach should handle this task?"** — routing decisions in orchestrators
- **"Why is this agent confidently wrong?"** — diagnosing systematic failure modes
- **"How do we build expertise into this system?"** — engineering reliable pattern recognition
- **"Is this domain one where practice improves performance?"** — feedback loop auditing
- **"How should we decompose this task?"** — fractured expertise risks in decomposition
- **"When should an agent escalate vs. proceed autonomously?"** — boundary detection

This skill is **not** needed for pure implementation tasks with clear right answers, standard debugging of code syntax, or well-specified problems with deterministic solutions.

---

## Core Mental Models

### 1. Intuition Is Pattern Recognition, Not Magic

Simon's definition: *"The situation has provided a cue; this cue has given the expert access to information stored in memory, and the information provides the answer."*

Intuition is compressed pattern matching across many prior encounters — the same process as recognizing a familiar face, scaled to thousands of domain-specific examples. This means:
- Intuition can be **engineered**: identify the valid cues, build reliable recognizers
- Intuition can **fail systematically**: when cues are absent, misleading, or outside training distribution
- An agent's "confident feel" about an output is a pattern-match signal, not a truth signal

**Practical implication**: When an agent produces a fluent, coherent output, ask *what cues triggered this pattern match* — not *how confident does this feel*.

---

### 2. Two Necessary Conditions for Genuine Expertise

Both must be present for expertise to be real:

| Condition | What it means | What happens when absent |
|-----------|---------------|--------------------------|
| **Environment Validity** | Domain contains stable, learnable regularities — cues reliably predict outcomes | Practice produces confident noise, not skill |
| **Learning Opportunity** | Adequate feedback loops: timely, accurate, uncorrupted | No skill develops even in high-validity domains |

This is the **master diagnostic**. Before trusting any expert judgment (human or agent), classify the environment first.

**Valid environments**: Chess, fire behavior, medical diagnosis from imaging, mechanical fault detection  
**Low-validity environments**: Long-term political forecasting, stock selection, many "soft" predictions about complex social systems

---

### 3. Confidence Is an Internal Consistency Signal, Not an Accuracy Signal

This is the most operationally dangerous finding in the paper.

Subjective confidence tracks *how coherent the available information feels* — not *whether the judgment is correct*. A compelling, internally consistent answer from an agent (or human expert) can be precisely wrong, with no internal marker distinguishing the correct intuition from the heuristic-generated error.

**Corollary**: Systems that use their own confidence scores to gate output quality are replicating this exact failure mode. High confidence in a low-validity environment is a warning sign, not reassurance.

---

### 4. Expertise Is Fractionated, Not Global

Genuine skill in one sub-task does not transfer to structurally adjacent sub-tasks. A professional skilled at evaluating commercial prospects of firms (valid, trackable, feedback-rich) has no demonstrated skill at predicting whether a stock is underpriced (low-validity, confounded feedback).

**For agent systems**: Invoking a skill for a task *adjacent but structurally different* from the task that built the skill replicates this fractionation error at scale. The agent has no internal alarm for this boundary crossing — the patterns feel similar.

**Key question**: *Does this agent's training distribution actually include this specific task structure — or just tasks that feel similar?*

---

### 5. Match Decision Mechanism to Environment Type

| Environment | Best approach |
|-------------|--------------|
| High-validity, rich tacit cues, pattern-rich | Expert judgment / trained pattern recognizer |
| Low-validity, noisy, sparse feedback history | Algorithm / ensemble / structured rule |
| Medium-validity, time pressure, incomplete info | RPD model (recognize → simulate → validate) |
| Unknown validity | Default to algorithmic with human review |

Algorithms outperform humans specifically in low-validity noisy environments. Humans (and trained agents) outperform algorithms specifically when tacit cues exist that formal models cannot capture. **Neither is universally superior.**

---

## Decision Frameworks

### Environment Classification (Run First)

```
Is the domain one where regularities exist AND feedback is available?
├── YES → High-validity environment
│   └── Expert judgment / pattern recognition appropriate
│   └── Load: references/validity-environment-and-agent-trust.md
├── PARTIAL → Degraded-validity environment  
│   └── Hybrid: algorithm for base rate, judgment for anomaly detection
│   └── Suppress raw confidence scores; require justification
└── NO → Low-validity environment
    └── Algorithm or structured ensemble; suppress confidence signals
    └── Load: references/overconfidence-and-the-illusion-of-validity.md
```

### Routing: Algorithm vs. Expert Judgment

```
IF environment is low-validity AND outcomes are high-stakes
  → Use actuarial/algorithmic approach; resist "clinical override"
  
IF environment has tacit cues that resist formalization (e.g., expert detects
   something "off" with no articulable reason)
  → Trust expert anomaly detection; investigate before proceeding
  
IF expert confidence is HIGH but feedback loops are known to be corrupted
  → Treat confidence as contraindicated; flag for review
  
IF the task is adjacent to a high-skill domain but structurally different
  → Apply fractionation check; do not inherit confidence from adjacent domain
```
→ Load `references/algorithms-vs-intuition-routing-framework.md` for full matrix

### Confidence Calibration Check

```
Before trusting a confident output:
1. What environment type is this? (validity classification)
2. What cues triggered this confidence? (articulable or tacit?)
3. Are feedback loops for this domain known to be clean?
4. Is this task within the demonstrated competence boundary?
5. Does confidence feel driven by coherence or by evidence?

IF any answer is unfavorable → downgrade trust; require validation
```
→ Load `references/overconfidence-and-the-illusion-of-validity.md`

### Boundary Detection (When Not to Trust Yourself)

```
IF the task structure is novel relative to training distribution
  → Flag; do not proceed with full autonomy
  
IF the agent cannot articulate the cues driving its judgment
  AND the environment is not demonstrably high-validity
  → Escalate or apply System 2 validation
  
IF the agent has been consistently right in similar contexts
  → Check for automation bias in human supervisors; do not suppress oversight
```
→ Load `references/the-boundary-problem-knowing-when-not-to-trust-yourself.md`

### RPD Model for Time-Pressured Decisions

When environment is medium-validity and time pressure is real:
```
1. RECOGNIZE: Does this situation match a known pattern?
   └── NO → Slow down; do not simulate; gather more information
   └── YES → Proceed to step 2
   
2. SIMULATE: Run mental simulation of the recognized action
   └── Does it work? → Execute
   └── Problem detected? → Modify and re-simulate (not: search for optimal)
   └── Cannot resolve? → Escalate or switch to deliberate analysis
   
Key: Satisficing (first workable option) is correct when delay cost > marginal
     optimization benefit. Optimizing when satisficing is warranted wastes
     resources and can introduce second-guessing errors.
```
→ Load `references/recognition-primed-decision-making-for-agents.md`

---

## Reference Files

| File | Description | Load when... |
|------|-------------|--------------|
| `references/validity-environment-and-agent-trust.md` | Environment validity as the master variable — how to classify domains and what confidence levels are warranted | Classifying a new domain; deciding baseline trust for agent outputs |
| `references/recognition-primed-decision-making-for-agents.md` | The RPD model: how skilled agents make decisions without comparing options; satisficing vs. optimizing | Designing decision logic for time-pressured or medium-validity contexts |
| `references/fractured-expertise-and-domain-boundary-detection.md` | Why competence in one sub-task doesn't transfer; how to detect fractionation errors in agent skill invocation | Decomposing tasks; evaluating whether a skill applies to an adjacent task |
| `references/algorithms-vs-intuition-routing-framework.md` | Full routing matrix for when to use algorithmic vs. judgment-based approaches; the Meehl findings | Building orchestrator routing logic; deciding between structured and flexible approaches |
| `references/system1-system2-and-dual-mode-agent-architecture.md` | Dual-process architecture: fast pattern matching vs. slow deliberate reasoning; when to switch modes | Architecting agent reasoning pipelines; debugging speed/accuracy tradeoffs |
| `references/overconfidence-and-the-illusion-of-validity.md` | Why confidence and accuracy diverge; the internal consistency trap; how to detect and correct | Any context where high-confidence outputs need scrutiny; calibration work |
| `references/learning-from-tacit-knowledge-and-cognitive-task-analysis.md` | How to elicit and encode expert knowledge that cannot be articulated; cognitive task analysis methods | Building training data from expert behavior; capturing judgment that resists specification |
| `references/the-boundary-problem-knowing-when-not-to-trust-yourself.md` | How intelligent systems should recognize their own competence limits; asymmetry between overreach and underreach | Designing escalation logic; building self-monitoring into agents |
| `references/environment-types-and-decision-quality-reference.md` | Quick-reference card synthesizing environment typology and decision quality implications | Fast lookup during system design or review; summary card for the full framework |

---

## Anti-Patterns

These are the specific errors Kahneman and Klein document — and the ones most likely to recur in agent systems:

**1. Trusting confidence as accuracy**  
Using an agent's (or model's) expressed confidence as a proxy for correctness. Confidence measures internal coherence, not validity. High confidence in low-validity domains is the failure mode, not the exception.

**2. Wicked learning environments**  
Designing (or tolerating) feedback loops that are delayed, corrupted, or systematically misleading. This is worse than having no feedback — it produces *confident, systematic* errors rather than random ones. Auditing feedback loops is not optional.

**3. Fractionation by proximity**  
Invoking a skill for a task because it *feels similar* to tasks the skill was built on, without checking whether the underlying task structure is actually the same. Financial analysis ≠ stock prediction. Code review ≠ architecture evaluation.

**4. Automation bias in oversight**  
Human supervisors (or orchestrating agents) disengaging from review because the agent is usually right. The cases where usually-right agents fail are precisely the novel, high-stakes cases that most need oversight. Reliability breeds misplaced trust.

**5. The clinical override trap**  
Experts (or agents) overriding algorithmic outputs in low-validity domains based on "judgment." In environments where algorithms reliably outperform humans, the override degrades performance — regardless of how compelling the expert's reasoning feels.

**6. Treating expertise as global**  
Assuming that an agent or expert who is excellent at Task A has commensurate skill at adjacent Task B. Expertise is domain-specific down to the sub-task level. Prestige and track record in one area do not transfer.

**7. Skipping environment classification**  
Jumping directly to "should I trust this output?" without first asking "what kind of environment is this?" Environment type determines what trust is even possible — everything else is downstream of this.

---

## Shibboleths

How to tell if someone has actually internalized this framework vs. just read the summary:

**They get it if they say things like:**
- "Before we evaluate the output quality, what's the validity of this environment?"
- "High confidence here worries me more than low confidence — the feedback loops are garbage."
- "The skill works for X, but this task is structurally Y. That's fractionation."
- "We need to audit what the model is actually learning from, not just whether it performs well on held-out data."
- "The algorithm isn't smarter — it's just immune to the coherence trap in this particular noise regime."
- "Satisficing is the right call here. The cost of delay outweighs the benefit of finding something better."

**They're still at the summary level if they say things like:**
- "The model is 94% confident so we can probably trust it."
- "Our expert has 20 years of experience, so their judgment should override the model."
- "Intuition is unreliable — we should always use algorithms."
- "If it works in domain A, it should work in the similar domain B."
- "We'll know if it's working because the experts will tell us."

**The deepest tell**: Someone who has internalized this framework treats *environment classification as a prerequisite* to any confidence assessment — not as an afterthought. They ask "what kind of domain is this?" before "is this output right?" The question of mechanism (algorithm vs. judgment) is always downstream of the question of ecology (what kind of environment are we in?).

---

*Load `references/environment-types-and-decision-quality-reference.md` as a quick-reference companion to this skill for most practical applications.*