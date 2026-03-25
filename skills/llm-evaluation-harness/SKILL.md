---
license: Apache-2.0
name: llm-evaluation-harness
description: "Build automated LLM evaluation pipelines with benchmarks, regression tests, RAGAS, and human eval workflows. Activate on: LLM evaluation, benchmark testing, eval pipeline, RAGAS, model regression tests. NOT for: traditional software testing (testing-expert), model training (ai-engineer)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - evaluation
  - benchmarks
  - ragas
  - llm-testing
  - regression
pairs-with:
  - skill: ai-engineer
    reason: Evaluation validates LLM application quality before deployment
  - skill: prompt-template-manager
    reason: A/B test results feed into prompt version promotion decisions
  - skill: fine-tuning-dataset-curator
    reason: Eval sets curated alongside training data measure fine-tune effectiveness
---

# LLM Evaluation Harness

Build automated evaluation pipelines for LLM applications with benchmarks, regression tests, RAG evaluation (RAGAS), and human eval workflows.

## Activation Triggers

**Activate on**: "evaluate LLM", "benchmark model", "regression test AI", "RAGAS evaluation", "eval pipeline", "LLM quality metrics", "compare model versions", "human evaluation workflow", "test AI responses"

**NOT for**: Traditional unit/integration testing (testing-expert), model training loops (ai-engineer), or prompt writing (prompt-engineer)

## Quick Start

1. **Define eval dimensions** — Correctness, faithfulness, relevance, coherence, safety. Pick the 2-3 that matter most for your use case.
2. **Build eval dataset** — 50-200 curated test cases with expected outputs or rubrics. Include edge cases and adversarial inputs.
3. **Choose eval methods** — LLM-as-judge for scalable scoring, exact-match for structured outputs, RAGAS for RAG systems, human eval for nuance.
4. **Automate in CI** — Run evals on every prompt change, model upgrade, or pipeline modification. Fail the build if scores regress.
5. **Track trends** — Store eval results over time. A 2% quality drop per release compounds into a 20% drop over 10 releases.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **RAG Evaluation** | RAGAS, DeepEval, custom | Faithfulness, answer relevance, context precision |
| **LLM-as-Judge** | Claude, GPT-4o, Llama 3.1 as evaluators | Rubric-based scoring with calibration |
| **Exact Match** | Regex, JSON schema validation, string match | For structured outputs: classification, extraction |
| **Human Eval** | Argilla, Label Studio, custom UI | Gold-standard quality, expensive, slow |
| **Benchmarks** | MMLU, HumanEval, custom domain benchmarks | Standardized comparison across models |
| **CI Integration** | GitHub Actions, pytest, Vitest | Eval-as-tests with pass/fail thresholds |

## Architecture Patterns

### Pattern 1: Multi-Method Evaluation Pipeline

```
Eval Dataset (N test cases)
    │
    ├──→ [Exact Match] ──→ Precision/Recall/F1 (for structured outputs)
    │
    ├──→ [LLM-as-Judge] ──→ Rubric scores 1-5 per dimension
    │        │
    │        └── Calibrate: run judge on 20 pre-scored examples first
    │
    ├──→ [RAGAS] ──→ Faithfulness, Answer Relevance, Context Precision
    │        │
    │        └── For RAG systems only; measures retrieval + generation quality
    │
    └──→ [Human Eval] ──→ Gold-standard labels (sample 10-20%)
             │
             └── Use for calibrating LLM-as-judge, not as primary method

All results ──→ [Score Aggregation] ──→ [Trend Tracker] ──→ [CI Gate]
```

```python
# LLM-as-judge evaluation
import json

JUDGE_RUBRIC = """
Score the following response on a scale of 1-5 for each dimension:

- **Correctness** (1-5): Is the information factually accurate?
- **Completeness** (1-5): Does it address all parts of the question?
- **Clarity** (1-5): Is it well-organized and easy to understand?

Question: {question}
Expected: {expected}
Response: {response}

Return JSON: {{"correctness": N, "completeness": N, "clarity": N, "reasoning": "..."}}
"""

async def evaluate_with_judge(test_cases: list[dict], model_output_fn) -> dict:
    results = []
    for case in test_cases:
        response = await model_output_fn(case["question"])
        judge_prompt = JUDGE_RUBRIC.format(
            question=case["question"],
            expected=case["expected"],
            response=response
        )
        scores = await llm_call(judge_prompt, model="claude-sonnet-4-20250514", temperature=0)
        results.append(json.loads(scores))

    # Aggregate
    return {
        dim: sum(r[dim] for r in results) / len(results)
        for dim in ["correctness", "completeness", "clarity"]
    }
```

### Pattern 2: RAG Evaluation with RAGAS

```
Test Case: (question, ground_truth, retrieved_contexts)
    │
    ├──→ Faithfulness: Is the answer supported by retrieved contexts?
    │    Score = (claims supported by context) / (total claims in answer)
    │
    ├──→ Answer Relevance: Does the answer address the question?
    │    Score = cosine_sim(question, generated_questions_from_answer)
    │
    ├──→ Context Precision: Are relevant contexts ranked higher?
    │    Score = weighted precision of relevant contexts in top-k
    │
    └──→ Context Recall: Were all ground-truth facts retrievable?
         Score = (ground_truth_claims in contexts) / (total ground_truth_claims)
```

```python
# RAGAS evaluation
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

eval_dataset = Dataset.from_dict({
    "question": questions,
    "answer": generated_answers,
    "contexts": retrieved_contexts,
    "ground_truth": expected_answers,
})

result = evaluate(eval_dataset, metrics=[
    faithfulness, answer_relevancy, context_precision
])
print(result)  # {'faithfulness': 0.87, 'answer_relevancy': 0.92, ...}
```

### Pattern 3: CI Regression Gate

```
On PR / prompt change:
    │
    ▼
[Run eval suite] ──→ scores
    │
    ▼
[Compare to baseline]
    ├── Score >= baseline - tolerance (2%) ──→ PASS (merge allowed)
    └── Score < baseline - tolerance        ──→ FAIL (block merge)
                                                  │
                                                  └── Report: which test cases regressed, by how much
```

## Anti-Patterns

1. **Evaluating without a baseline** — A score of 4.2/5 means nothing without knowing the previous score was 4.5. Always track baselines and trends.
2. **LLM-as-judge without calibration** — Judges have biases (verbosity preference, position bias). Calibrate on 20+ pre-scored examples and check inter-rater agreement.
3. **Too few test cases** — 10 test cases produce noisy metrics. Target 50+ for reliable averages, 200+ for statistical confidence on sub-dimensions.
4. **Evaluating only happy paths** — Include adversarial inputs, edge cases, ambiguous questions, and out-of-scope queries. The model should fail gracefully.
5. **Manual eval as the only method** — Human evaluation is expensive and slow. Use it to calibrate automated methods, then run automated evals in CI.

## Quality Checklist

- [ ] Eval dataset has 50+ test cases with expected outputs or rubrics
- [ ] Multiple eval dimensions defined (correctness, completeness, safety, etc.)
- [ ] LLM-as-judge calibrated against human scores (inter-rater agreement > 0.8)
- [ ] Baseline scores established and tracked over time
- [ ] Regression threshold defined (e.g., fail if any dimension drops > 2%)
- [ ] Edge cases and adversarial inputs included in eval dataset (minimum 20%)
- [ ] Eval runs automated in CI on every prompt/model/pipeline change
- [ ] Results stored with timestamps for trend analysis
- [ ] Human eval used for calibration, not as sole evaluation method
- [ ] RAGAS metrics used for RAG systems (faithfulness, relevance, precision)
