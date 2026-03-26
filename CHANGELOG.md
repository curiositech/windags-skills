# Changelog

All notable changes to windags-skills are documented here.

## [2.1.0] — 2026-03-25

### Added
- **Ink pipeline renderer** — live-updating terminal UI for /next-move context gathering (14 signals) and meta-DAG prediction (5 agents in 4 waves). Win31-themed box-drawing, animated spinners.
- **DAG mutation engine** — immutable transforms for pre-execution editing: swap_skill, change_tier, remove_node, add_node, change_commitment, move_to_wave. Validation + estimate recalculation.
- **Structured pre-execution editing** — "Modify" in /next-move presents multiselect node picker + mutation menu, applies changes to PredictedDAG, re-presents for Accept/Modify more/Reject.
- **Progress events** — PipelineProgressEmitter with typed events for context signals and meta-DAG agents. CLI subscribes for live Ink rendering.
- **Parallel BM25 skill search** — per-subtask MCP calls fan out in parallel after decomposition, feeding pre-narrowed candidates to skill-selector LLM.
- **Background context collection** — context gathering runs as background Agent while ANSI explainer renders in foreground.

### Changed
- /next-move SKILL.md restructured for background agent pattern + parallel skill search
- Pause/resume support at wave boundaries in DAGExecutor
- Rate limiting + budget caps (BudgetExceededError) in ProviderRouter

### Fixed
- Pre-existing Map iteration bug in verify-costs.ts
- Missing createDAGExecutor export from core barrel

## [2.0.0] — 2026-03-22

### Added
- 463+ agent skills across 19 categories
- /next-move prediction pipeline (5-agent meta-DAG)
- BM25 skill search via MCP server (zero external API keys)
- Thompson sampling for skill selection sharpening
- L3 structural audit infrastructure
- Evaluation pipeline: Floor, Wall, Envelope stages
- SkillQualityStore with Beta(alpha, beta) tracking
- CTA (Call to Action) upgrades for 100+ skills
- 8 argumentation skills (Lakatos, Polya, Toulmin, Socratic, etc.)

### Architecture
- Wave-based parallel execution via ProcessExecutor
- Worktree isolation for code generation
- Abort/cancellation with SIGTERM → SIGKILL propagation
- Confidence self-assessment prompt injection
- MutationLog (append-only Raft-equivalent for DAG execution)

## [1.0.0] — 2026-03-15

### Added
- Initial release
- Core skill catalog (~200 skills)
- Basic skill matching
- Triple store for prediction training data
- Win31 Control Center UI
