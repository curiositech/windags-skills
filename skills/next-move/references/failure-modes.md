# Failure Modes

A predicted DAG can fail in many ways. This file enumerates them, names the early signal, and gives the fix. When `/next-move` produces output that feels off, walk this list before re-running blindly.

## How to Use This File

1. Locate the symptom in the leftmost column.
2. Confirm by checking the "Detection" column.
3. Apply the fix — it's almost always cheaper than a full restart.

If the symptom isn't on this list, it may be a genuinely new failure mode. Record it in the triple's `notes` field so the gap detector can pick it up.

## Failure Mode Catalog

### F1 — Ambiguous Next Move

- **Symptom**: Sensemaker confidence stays under 0.6 even after the halt-gate clarification round.
- **Detection**: Two pipeline runs in a row both flag low confidence.
- **Likely cause**: The conversation summary is too thin or contradictory.
- **Fix**: Halt and ask the user to narrow scope explicitly. See `halt-gate-discipline.md`.
- **Anti-fix**: Lowering the confidence threshold "just for this run."

### F2 — Wrong Topology Promised

- **Symptom**: Plan claims swarm/blackboard/team-loop runtime support.
- **Detection**: `topology` is non-DAG/workflow but the presentation language says "executing as <topology>" without "projection."
- **Fix**: Apply `runtime-honesty.md`. Add `topologyReason`. Update presentation language.
- **Anti-fix**: Silently downgrading topology to `dag` without telling the user.

### F3 — Generic Node Prompts

- **Symptom**: A node's prompt is just `<skill body> + <task description>` with no role boundaries, contracts, or escalation paths.
- **Detection**: Node prompt has no input contract, no output contract, no equipped-skills section.
- **Fix**: Rebuild from `prompts/execution-node.md` and `references/skillful-node-execution.md`.
- **Anti-fix**: Adding more skill body content to compensate for missing structure.

### F4 — Hidden Gate

- **Symptom**: Plan mentions "review by user" or "approval needed" in prose but no actual gate node exists.
- **Detection**: Node `role_description` contains words like "review," "approve," "decide" but the runtime won't pause.
- **Fix**: Convert into a real human-gate node. Use the `human-gate-designer` skill.
- **Anti-fix**: Trusting that the agent will "stop and ask."

### F5 — Structure Drift

- **Symptom**: Downstream node fails or produces nonsense because it expected JSON but got essay.
- **Detection**: `output_contract` says "JSON with fields A, B, C" but the upstream agent wasn't told to produce JSON.
- **Fix**: Make `output_contract` explicit in the upstream node's prompt. Equip `output-contract-enforcer` if necessary. Add a validation step.
- **Anti-fix**: Adding parsing tolerance downstream — push the contract upstream.

### F6 — Dead Visualization

- **Symptom**: Execution starts; user sees nothing happening.
- **Detection**: No live WinDAGs UI, no ASCII fallback, no status updates streaming.
- **Fix**: Open the live UI before execution. If unavailable, render an explicit ASCII DAG and stream wave transitions to stdout.
- **Anti-fix**: Telling the user to "wait."

### F7 — MCP Unavailable

- **Symptom**: Skill Selector returns wrong/sparse candidates.
- **Detection**: `breakdown` field on results shows only `bm25:` (no `t2v:`, `ce:`, or `knn:`). MCP errored out.
- **Fix**: Fall back through the cascade gracefully — `references/skill-narrowing-cascade.md` documents what's possible at each degraded stage. Surface the degradation to the user.
- **Anti-fix**: Pretending nothing is wrong; producing a confident plan from BM25-only matches.

### F8 — Phantom Skill

- **Symptom**: Plan references a `skill_id` that doesn't exist in the catalog.
- **Detection**: Validation step rejects the prediction because `skill_id` isn't in `loadAvailableSkills()`.
- **Likely cause**: LLM hallucinated a skill name from the conversation context.
- **Fix**: Re-run Skill Selector with explicit constraint: only IDs from the supplied shortlist. Validate before saving the triple.
- **Anti-fix**: Auto-creating a stub skill to satisfy the reference.

### F9 — Cycle in DAG

- **Symptom**: Topological sort fails. `dependsOn` graph has a cycle.
- **Detection**: `validatePredictedDAG()` returns success but DAG executor errors at wave-computation time.
- **Likely cause**: Decomposer produced two nodes that each list the other as a dependency.
- **Fix**: The Synthesizer should already check for cycles. If one slipped through, re-run Decomposer with explicit "avoid mutual dependencies" instruction.
- **Anti-fix**: Manually breaking one edge — that hides a Decomposer bug.

### F10 — Wave Imbalance

- **Symptom**: One wave has 7+ parallel nodes while others have 1.
- **Detection**: Look at wave fan-out. If max(nodes per wave) > 3 × median, you have imbalance.
- **Likely cause**: Decomposer produced many independent leaf tasks without intermediate synthesis.
- **Fix**: Either accept (genuinely embarrassingly parallel) or add a synthesis node. The user's machine and rate limits matter — many parallel agents can OOM or get rate-limited.
- **Anti-fix**: Serializing the wave artificially. If they're independent, they should run in parallel.

### F11 — Cost Surprise

- **Symptom**: User accepts the plan; cost during execution is 3× the estimate.
- **Detection**: Per-node `estimated_cost_usd` is way under actual.
- **Likely cause**: Estimator assumed haiku tokens for sonnet runs; or didn't account for multi-turn tool use.
- **Fix**: Use `CostCalculator` from `packages/core/src/pricing/`. Always include cost gate (`onCostEstimate` in DAGExecutorOptions) so the user can re-confirm if the estimate moves.
- **Anti-fix**: Showing the estimate but not gating execution on it.

### F12 — Stale Context

- **Symptom**: Prediction references files that no longer exist or branches that were merged.
- **Detection**: `git_status` was captured 30+ minutes ago but the prediction is being executed now.
- **Likely cause**: Long delay between gather and execute (user walked away).
- **Fix**: Re-gather context if the gap exceeds 10 minutes. Cheap insurance.
- **Anti-fix**: Trusting that the world hasn't changed.

### F13 — Halt-Gate Bypass

- **Symptom**: Pipeline produced a confident-sounding plan but underlying signals were genuinely ambiguous.
- **Detection**: After execution, user reports the plan was for "the wrong thing." Triple shows confidence ≥ 0.7 despite multi-thread project signals.
- **Likely cause**: Confidence overconfidence — Sensemaker rationalized contradictions instead of flagging them.
- **Fix**: Tighten multi-thread detection in Sensemaker. Add a heuristic: if `recent_commits` topics differ from `modified_files` topics, force `halt_reason`.
- **Anti-fix**: Lowering the global confidence threshold.

### F14 — Skill-Selector Lock-in

- **Symptom**: Same prediction shape appears every time despite varying tasks.
- **Detection**: Last 5 triples all use the same primary skills regardless of context.
- **Likely cause**: Attribution k-NN has too few neighbors and is amplifying past choices. Or the cross-encoder is missing.
- **Fix**: Check `breakdown` field — if `knn:` is showing very high blend weights with few neighbors, lower the k-NN influence. Run `references/skill-narrowing-cascade.md` debugging.
- **Anti-fix**: Disabling attribution entirely — that loses useful signal.

### F15 — Empty PreMortem

- **Symptom**: PreMortem returns `risks: []` and `recommendation: 'PROCEED'` for a complex plan.
- **Detection**: Plan has 5+ nodes including approval gates and infrastructure changes, but PreMortem found no risks.
- **Likely cause**: PreMortem prompt isn't loading the plan context properly. The model sees only the title.
- **Fix**: Verify the PreMortem stage receives the full Synthesizer-pre-output (decomposition + skill matches), not just the title. Re-run PreMortem.
- **Anti-fix**: Trusting an empty PreMortem on a non-trivial plan.

## Triage Order

When a prediction looks wrong:
1. F1 (ambiguity) — check first; if it applies, halt and stop.
2. F8, F9 (validation failures) — these are pipeline bugs, not prediction quality issues.
3. F2, F4 (honesty / structure) — easy to fix in presentation layer.
4. F3, F5 (node-level) — fix the affected node, don't restart pipeline.
5. F7, F14 (retrieval) — investigate cascade health.
6. Everything else — record in triple, ask user to clarify.

## Quality Gate

Before presenting:
- [ ] No phantom skill IDs (validate against catalog).
- [ ] DAG has no cycles (`computeWaves()` succeeds).
- [ ] Topology and runtime topology are honest (see `runtime-honesty.md`).
- [ ] Approval/review nodes are real gates, not prose.
- [ ] PreMortem is non-empty for plans with 4+ nodes.
- [ ] Cost estimate covers all nodes including back-edges (workflow) or iterations (recurring).
