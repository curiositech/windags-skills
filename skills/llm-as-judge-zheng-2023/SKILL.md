---
license: Apache-2.0
name: llm-as-judge-zheng-2023
description: Using LLMs as automated evaluators for comparing chatbot responses with Chatbot Arena methodology
category: Research & Academic
tags:
  - llm-evaluation
  - judging
  - alignment
  - chatbot-arena
  - benchmarks
---

# SKILL.md — LLM-as-a-Judge: Automated Evaluation System Design

license: Apache-2.0
```yaml
metadata:
  name: llm-as-a-judge
  version: 1.0
  source: "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., NeurIPS 2023)"
  description: >
    Empirically-grounded principles for designing automated evaluation systems
    where LLMs judge other LLMs. Covers bias taxonomy, mitigation patterns,
    judge selection, benchmark design, and failure mode prevention.
  activation_triggers:
    - "evaluation pipeline" OR "eval system" OR "quality assessment"
    - "LLM judge" OR "automated grading" OR "model comparison"
    - designing agent systems with routing, scoring, or selection components
    - "how do I know if output X is better than output Y"
    - building reward models, rankers, or preference systems
    - "position bias" OR "verbosity bias" OR "self-enhancement bias"
    - chatbot arena, MT-bench, or preference benchmarking discussions
    - any multi-agent system where one agent evaluates another's output
```

---

## When to Use This Skill

Load this skill when the task involves:

- **Building evaluation infrastructure**: Any pipeline where an LLM scores, ranks, routes, or selects between outputs from other LLMs
- **Multi-agent quality control**: A judge/critic agent reviews worker agent outputs before passing downstream
- **Benchmark or test set design**: Creating automated tests to compare model versions or configurations
- **Diagnosing evaluation failures**: Results from automated evals seem wrong, inconsistent, or gameable
- **Prompt engineering for judgment**: Writing system prompts or rubrics for LLM judges
- **Model selection decisions**: Choosing which LLM to use as a judge in a production system

**Do NOT use this skill** for: training ML models, RLHF pipeline implementation, or general prompt engineering unrelated to evaluation.

---

## Core Mental Models

### 1. Evaluation Reliability Is Non-Linear in Judge Capability

Small model quality improvements yield dramatic evaluation reliability gains — this relationship is not linear. GPT-4-class models achieve ~80%+ agreement with human judgments. GPT-3.5-class models introduce systematic distortions that corrupt rankings. Weaker still, and the judge is worse than useless — it adds confident noise.

**Implication**: Judge agent selection is not a cost-optimization decision. Assigning a weak model to evaluation roles corrupts the entire system's feedback loop. The judge must be at or above the capability level of the models it evaluates.

### 2. Four Named Biases Are Default Behaviors, Not Edge Cases

Without active mitigation, LLM judges exhibit four empirically-documented biases:

| Bias | Mechanism | Severity |
|------|-----------|----------|
| **Position bias** | Favors whichever response appears first (or second, by model) | Extreme — Claude-v1 only 23.8% consistent |
| **Verbosity bias** | Longer responses rated higher regardless of quality | Near-universal — 91.3% failure rate under attack |
| **Self-enhancement bias** | Models prefer their own outputs when judging | Measurable but model-dependent |
| **Reasoning contamination** | Judge's reasoning hijacked by the answer in context | Causes failures even when judge "knows" correct answer |

These are not failure modes to watch for — they are the *default* state of an uncorrected LLM judge.

### 3. Solving ≠ Judging (The Capability Transfer Gap)

A model that can correctly solve a problem does not reliably judge whether another solution to that problem is correct. GPT-4 can solve math problems but still rates incorrect answers as correct when those answers appear in context. The cognitive task of *generating* a correct answer and *evaluating* a presented answer are distinct capabilities that don't automatically co-transfer.

**Implication**: Never assume that a model's task performance predicts its judging performance on the same task class.

### 4. Benchmarks Are Complementary, Not Redundant

Capability benchmarks (MMLU-style: knowledge, reasoning under standardized conditions) and preference benchmarks (Chatbot Arena-style: human-judged open-ended quality) measure different things. A model can rank highly on one while underperforming on the other. Systems that route or evaluate based on a single benchmark type will systematically misevaluate certain model classes.

**Implication**: Any serious evaluation system needs both axes. Aggregate metrics can mask within-category variation that matters for routing decisions.

### 5. Ensemble Judgment Beats Individual Judgment

Human majority votes (~90% agreement with ground truth) outperform individual human raters (~81%). The same principle applies to LLM judges. A single judge evaluation is a noisy signal. Ensembled evaluations — either through multiple judge runs, position-swapped dual evaluation, or multi-judge panels — produce more reliable outputs.

**Implication**: Design evaluation components to output distributions or ensembled verdicts, not single-shot scores.

---

## Decision Frameworks

### Selecting a Judge Model

```
IF evaluation results will influence production decisions
  → Use GPT-4-class model minimum; validate against human agreement rate
  → Never use the same model family as the model being judged (self-enhancement)

IF you cannot afford GPT-4-class for every eval
  → Use strong judge for calibration samples; weaker judge for bulk screening
  → Measure agreement rate of cheap judge against strong judge on calibration set

IF judging outputs from a model stronger than your judge
  → Results are unreliable by default; explicitly flag this in system design
```

### Mitigating Specific Biases

```
IF evaluating pairwise comparisons (A vs B)
  → ALWAYS run both orderings (A,B) and (B,A) and check consistency
  → Inconsistent verdict = no verdict; require re-evaluation or human review

IF judging on tasks with objective correct answers (math, code, logic)
  → Use reference-guided judging: give judge the correct answer/solution
  → This reduces math grading failures from ~70% to ~15%
  → Add chain-of-thought pre-solving: require judge to solve before seeing responses

IF verbosity is a risk (open-ended generation tasks)
  → Explicitly instruct judge to ignore length; reward conciseness
  → Include rubric criterion: "Do not favor longer responses"
  → Adversarially test with repetitive list attack to verify resistance

IF judging a model with same family as judge
  → Add self-enhancement mitigation: use judge from different model family
  → Or: blind the judge to model identity (already standard, but verify)
```

### Designing Evaluation Infrastructure

```
IF building a new automated eval pipeline
  → Start with: What is my human agreement baseline? (measure it)
  → Instrument for: position consistency rate, length-score correlation
  → Include adversarial probes in test suite (position swap, repetitive list)

IF aggregate metrics look surprisingly flat between model versions
  → Disaggregate by task category — aggregate can mask within-category wins
  → Run direct pairwise comparison, not just score comparison

IF evaluation is being used for routing decisions in a multi-agent system
  → Treat judge as a component with a known reliability profile
  → Define acceptable consistency threshold before routing goes live
  → Build fallback path for low-confidence judge verdicts
```

### When to Trust vs. Escalate Automated Evaluation

```
IF position swap test yields consistent verdicts → moderate confidence
IF position swap test is inconsistent → discard verdict, escalate
IF judging math/code/logic without reference answer → low confidence; use reference
IF judging subjective quality (writing, tone) with strong model → reasonable confidence
IF task type is outside judge's training distribution → treat as unreliable
```

---

## Reference Files

Load these on demand based on the specific sub-problem being addressed:

| File | When to Load |
|------|-------------|
| `references/llm-judge-bias-taxonomy.md` | Need precise definitions, severity data, or detection methods for any of the four biases; designing bias audits |
| `references/judge-vs-solve-capability-gap.md` | Task involves math, code, or logic evaluation; debugging cases where a capable model still misjudges; understanding reasoning contamination |
| `references/benchmark-complementarity-evaluation-design.md` | Designing a benchmark suite; comparing models across task types; results from single benchmark seem misleading |
| `references/scalable-explainable-evaluation-architecture.md` | Building production evaluation pipelines; need explainability in judge outputs; scaling evaluation cost-effectively |
| `references/crowdsourced-vs-controlled-evaluation.md` | Deciding between expert annotation and crowdsourced judgment; designing human evaluation ground truth; understanding human agreement rates |
| `references/prompting-patterns-for-reliable-llm-judgment.md` | Writing judge system prompts; implementing position swap, reference-guided judging, or chain-of-thought mitigation; need validated prompt templates |
| `references/the-quality-gap-between-raw-capability-and-aligned-output.md` | Confused by MMLU vs. preference benchmark divergence; understanding what fine-tuning changes (and doesn't); selecting models for conversational quality |
| `references/failure-modes-in-automated-evaluation-systems.md` | Auditing an existing eval system; building adversarial test suite; system producing unexpected or gameable results; pre-launch evaluation checklist |

---

## Anti-Patterns

These are the mistakes this research specifically identifies and warns against:

**🚫 Treating evaluation as an afterthought**
Evaluation infrastructure requires the same design rigor as worker agents. A weak or biased judge corrupts the entire system's learning signal.

**🚫 Using weaker models as judges to save cost**
The cost of an unreliable judge is systematic corruption of rankings. The bias isn't random noise — it's directional, making worse outputs look better in predictable ways.

**🚫 Single-pass, single-order pairwise evaluation**
Running (A vs B) once and taking the verdict is known to be unreliable. Position bias alone makes this unacceptable. Always run both orderings.

**🚫 Assuming capability = judging ability**
"GPT-4 is smart, so it will be a good judge" is not sufficient reasoning. Judging is a distinct capability. Validate empirically against human agreement rates for your specific task types.

**🚫 Using a single aggregate benchmark to route decisions**
Aggregate scores mask category-level variation. A model that wins on aggregate math can still fail specific math subtypes that matter for your use case.

**🚫 Judging math/code without reference answers**
This is the most documented failure mode in the paper. Correct answers in context corrupt the judge's reasoning. Always use reference-guided judging for tasks with objective answers.

**🚫 Not instrumenting for bias**
If you aren't measuring position consistency rate and length-score correlation in your eval system, you don't know if it's working. These are required monitoring metrics, not optional.

**🚫 Treating human judgment as a perfect gold standard**
Individual human agreement is ~81%. The target is human majority judgment (~90%), not any individual rater. Design accordingly — ensemble human judgments just as you would ensemble LLM judgments.

---

## Shibboleths

*How to tell if someone has actually internalized this book vs. skimmed it:*

**They have internalized it if they:**
- Immediately ask "what's the position consistency rate?" when shown automated eval results
- Distinguish between "GPT-4 class" and "GPT-3.5 class" judge reliability as a binary-ish threshold, not a gradual slope
- Know that verbosity bias is near-universal (not rare) and design against it by default
- Describe the MMLU paradox without prompting: strong MMLU scores + weak chatbot arena performance is a known, documented pattern, not a mystery
- Treat reference-guided judging as the default for any math/code/logic task, not an advanced technique
- Talk about judge selection and worker agent selection as equally important architectural decisions
- When hearing "our eval shows X," their first question is "did you control for position and length?"
- Know that ensembling verdicts applies to LLM judges for the same reason it applies to human raters

**They haven't internalized it if they:**
- Say "we use GPT-4 as judge, so we're fine" without mentioning bias mitigation or validation
- Treat human evaluation as the unambiguous gold standard (rather than understanding it has its own noise characteristics)
- Design an eval pipeline with a single-ordering pairwise comparison
- Assume that a model good at math will automatically be good at grading math
- Use "our model scores higher on MMLU" as evidence of better conversational quality
- Talk about judge bias as "a known limitation to keep in mind" rather than something requiring active mitigation
- Think verbosity bias is something users introduce (deliberately writing longer answers) rather than a default judge behavior

---

*This skill covers the Zheng et al. NeurIPS 2023 paper as canonical reference. For adjacent topics — RLHF training, constitutional AI, reward model design — load separate skills.*