---
license: BSL-1.1
name: dag-skills-matcher
description: Matches natural language task descriptions to appropriate skills using semantic similarity, ranks candidates by fit and performance history, and maintains the skill catalog. Use when assigning skills to DAG nodes, searching for the right skill for a task, ranking competing skills, or browsing the skill catalog. Activate on "find skill", "match skill", "which skill", "skill for this task", "skill catalog", "rank skills", "best skill". NOT for executing DAGs (use dag-runtime), creating skills (use skill-architect), or grading skills (use skill-grader).
allowed-tools: Read,Grep,Glob
metadata:
  category: DAG Framework
  tags:
    - dag
    - skills
    - matcher
    - find-skill
    - match-skill
category: Agent & Orchestration
tags:
  - dag
  - skill-matching
  - routing
  - selection
  - registry
---

# DAG Skills Matcher

Matches tasks to skills, ranks candidates, and maintains the skill catalog.

## Decision Points

### When to Retry vs. Escalate
```
task_description → extract_intent()
├─ fit_score ≥ 0.5 for top candidate?
│  ├─ YES → check NOT clauses
│  │  ├─ passes → assign skill
│  │  └─ fails → try next candidate
│  └─ NO → retry with broader search terms
│     └─ still no fit_score ≥ 0.5?
│        └─ escalate to skill-architect (new skill needed)
```

### Search Strategy Selection
```
task_complexity = count(technical_terms, domain_words, constraints)
├─ complexity ≤ 3 → keyword_search_only
├─ 4-8 → keyword + semantic_similarity
└─ >8 → full_pipeline (keyword + semantic + domain_tags + thompson)
```

### Ranking Threshold Decision
```
candidate_count → ranking_strategy
├─ 1-2 candidates → simple fit_score ranking
├─ 3-5 candidates → weighted: fit(0.5) + elo(0.3) + cost(0.2)
└─ >5 candidates → full scoring with thompson sampling
```

### Cost vs. Quality Trade-off
```
task_priority + budget_constraints → selection_criteria
├─ high_priority + unlimited_budget → maximize fit_score + elo
├─ medium_priority → balanced scoring (default weights)
└─ low_priority + cost_sensitive → weight cost(0.5) + fit(0.3) + elo(0.2)
```

## Failure Modes

### Schema Drift
**Symptoms**: fit_scores consistently < 0.3, many "skill not found" escalations
**Detection**: If >20% of searches in 24h escalate to skill-architect
**Fix**: Update skill descriptions with recent task language patterns

### Thompson Exploitation Lock-in
**Symptoms**: Same 2-3 skills always selected, no skill performance comparison data
**Detection**: If top skill selection rate > 80% for any domain over 100 tasks
**Fix**: Increase Thompson sampling beta parameter by 10%, force exploration

### NOT-Clause Bypass
**Symptoms**: Skills assigned to incompatible tasks, high downstream failure rates
**Detection**: If downstream acceptance_rate < 0.7 for any skill
**Fix**: Strengthen NOT-clause checking, add regex patterns for exclusion terms

### Semantic Similarity False Positives
**Symptoms**: Skills matched on superficial word similarity, not actual capability
**Detection**: If fit_score > 0.7 but downstream acceptance_rate < 0.5
**Fix**: Add domain-specific negative embeddings, weight keyword matching higher

### Cost Optimization Trap
**Symptoms**: Always selecting cheapest skills, degrading output quality
**Detection**: If avg_cost_per_use drops >30% while acceptance_rate drops >15%
**Fix**: Set minimum fit_score threshold (0.5), reject candidates below threshold regardless of cost

## Worked Examples

### Example 1: Python ML Classification Task
**Task**: "Build a scikit-learn classifier for customer churn prediction with hyperparameter tuning"

**Process**:
1. Extract intent: ML classification + scikit-learn + hyperparameter tuning
2. Search yields: `sklearn-tuner` (fit=0.85, elo=1750), `automl-skill` (fit=0.72, elo=1820), `python-ml-basic` (fit=0.65, elo=1680)
3. Apply decision tree: >5 candidates → full scoring
4. Scores: sklearn-tuner: 0.85×0.4 + 0.72×0.3 + 0.8×0.3 = 0.796, automl-skill: 0.766
5. Check NOT clauses: sklearn-tuner NOT clause says "not for deep learning" ✓ (this is classical ML)
6. **Decision**: Assign sklearn-tuner

**Novice miss**: Would pick automl-skill due to higher Elo, missing that sklearn-tuner is more specifically matched
**Expert catch**: Recognizes hyperparameter tuning keyword strongly favors sklearn-tuner despite slightly lower Elo

### Example 2: Ambiguous Code Review Request
**Task**: "Review this code for issues"

**Process**:
1. Extract intent: code review (but no language specified)
2. fit_score for all code-review skills < 0.5 (too vague)
3. Apply decision tree: fit_score < 0.5 → retry with broader search
4. Broader search finds: `code-review-general` (fit=0.55)
5. Still marginal fit → escalate to skill-architect
6. **Decision**: Create task-specific code review skill

**Expert insight**: Recognizes that vague tasks need either clarification or new specialized skills

## Quality Gates

- [ ] Top candidate has fit_score ≥ 0.5
- [ ] Selected skill's NOT clauses don't match task requirements
- [ ] Composite score > 0.6 OR task explicitly escalated to skill-architect
- [ ] Search found at least 1 candidate (not empty result set)
- [ ] If multiple candidates with score difference < 0.1, thompson sampling was applied
- [ ] Cost per use is within budget constraints (if specified)
- [ ] Selected skill's domain tags overlap with extracted task domain
- [ ] Downstream acceptance rate for selected skill > 0.6 (historical data)
- [ ] Search took < 2 seconds (performance gate)
- [ ] Match reasoning is logged for skill improvement feedback

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- Creating new skills → use `skill-architect` instead
- Grading skill quality or performance → use `skill-grader` instead
- Actually executing the matched skill → use `dag-runtime` instead
- Modifying skill parameters or configs → use `skill-configurator` instead
- Handling skill versioning or deployment → use `skill-lifecycle-manager` instead

**Domain boundaries**:
- For skill marketplace operations → use `skill-marketplace` instead
- For skill analytics and reporting → use `skill-analytics` instead
- For cross-agent skill sharing → use `skill-federation` instead