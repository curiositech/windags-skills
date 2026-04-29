# Recovery Strategy Details

Recovery loop:
1. Classify failure: transient, deterministic, quota, dependency, or bad-plan.
2. Decide smallest safe resume point.
3. Rehydrate context from checkpoint plus bounded recent logs.
4. Escalate model or decomposition depth only when the failure class justifies it.
5. Record the retry reason and outcome for future tuning.
