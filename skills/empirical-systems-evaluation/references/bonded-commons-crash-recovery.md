# Bonded Commons Crash Recovery Experiment

Use this worked example when you need a full comparative study design for crash recovery or salvage behavior.

## Research Question

"Does the Bonded Commons salvage protocol recover agent work faster and with higher fidelity than round-robin reassignment after random agent crashes?"

## Experimental Setup

- System under test: Bonded Commons with salvage, session notes, and file claims
- Tier A baseline: round-robin reassignment with full task description but no session context
- Tier B baseline: random reassignment with no context transfer

## Variables

| Variable | Type | Values |
|---|---|---|
| Coordination protocol | Independent | Bonded Commons, Round-Robin, Random |
| Crash timing | Independent | Uniform random, 10-80% task completion |
| Number of agents | Fixed | 8 |
| Scenarios | Fixed | 20 human-designed coordination tasks |
| Salvage latency (ms) | Dependent, automated | Time from crash to first valid output |
| Recovery fidelity (1-5) | Dependent, human-rated | Quality of recovered work vs pre-crash |
| Task completion rate | Dependent, automated | Proportion of tasks completed successfully |

## Scenario Design

- 5 simple scenarios: single-file edit, clear specification
- 10 moderate scenarios: multi-file change with some ambiguity
- 5 complex scenarios: cross-system coordination with architectural decisions

Each scenario has a gold-standard completion for fidelity comparison.

## Crash Injection Protocol

For each scenario x protocol combination:

1. Start 8 agents on the task.
2. At a uniformly random time between 10% and 80% completion, kill 1 agent with `SIGKILL`.
3. Measure time until the system detects the crash and reassigns work.
4. Measure time until the replacement agent produces first valid output.
5. Let the system run to completion or 10-minute timeout.
6. Collect the final output for human evaluation.

## Sample Size Justification

- 20 scenarios x 3 protocols = 60 experimental units per metric
- 5 repetitions per scenario-protocol pair = 300 total runs, 100 per condition
- Power analysis for `d = 0.5`, `alpha = 0.05`, `power = 0.80` requires 64 per group, so 100 per group is comfortably above floor
- Human evaluation: 20 scenarios x 3 protocols x 3 raters = 180 ratings

## Human Evaluation Setup

- 3 raters with multi-agent systems experience
- Blinded condition labels (`Output A/B/C`)
- Each rater scores all 60 outputs
- Rubric: the 1-5 fidelity scale from the main skill
- Pilot calibration on 5 practice outputs before the full run
- Require average `kappa >= 0.60` to proceed

## Analysis Plan

Primary metrics, Bonferroni-corrected (`alpha = 0.025`):

1. Salvage latency: Kruskal-Wallis across 3 conditions, then Dunn's post-hoc with Holm correction if significant
2. Recovery fidelity: Kruskal-Wallis on median rater scores, then Dunn's post-hoc with Holm correction if significant

Secondary metrics, exploratory:

3. Task completion rate: Chi-squared test on proportions
4. Latency by difficulty stratum: descriptive only

For all comparisons:

- report BCa bootstrapped 95% CIs with `B = 10,000`
- report Cohen's `d` or rank-biserial `r`
- report effect-size confidence intervals

## Expected Reporting Shape

```text
Salvage Latency (ms), median [IQR], 95% CI:
  Bonded Commons:   340 [280, 410]  CI [310, 370]
  Round-Robin:      890 [720, 1100] CI [810, 970]
  Random:          1450 [1100, 2200] CI [1280, 1620]

Kruskal-Wallis: H(2) = 87.3, p < 0.001
Post-hoc (Dunn's, Holm-corrected):
  BC vs RR:   z = -6.2, p < 0.001, r = 0.62 [0.48, 0.74]
  BC vs Rand: z = -8.9, p < 0.001, r = 0.83 [0.71, 0.92]
  RR vs Rand: z = -3.1, p = 0.002, r = 0.31 [0.12, 0.49]
```

## Threats to Validity

- Internal: crash timing is bounded to 10-80%, so edge cases near 0% and 95%+ completion are unmeasured
- External: 8 agents on one machine does not imply 50+ agents in distributed deployment
- Construct: recovery fidelity is a proxy for user satisfaction, not a perfect substitute
- Statistical: 20 curated scenarios may not represent the full production task distribution
