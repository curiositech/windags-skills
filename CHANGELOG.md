# Changelog

All notable changes to windags-skills are documented here.

## [2.8.1] — 2026-04-30

### Fixed

**Homebrew formula now keeps skill symlinks alive across `brew upgrade`**

- Wrappers (`windags-mcp`, `windags-init`) now exec via `opt_libexec` (`/opt/homebrew/opt/windags/libexec/...`) instead of the versioned Cellar path. Symlinks created by `windags init` resolve through the stable opt path and survive every upgrade instead of becoming dangling.
- Added `post_install` to the formula. After every install or upgrade, Homebrew automatically re-runs `install.sh` so newly added skills get linked into `~/.claude/skills`, `~/.codex/skills`, and the AGENTS.md / Gemini pointer without the user having to remember `windags init`.

## [2.8.0] — 2026-04-30

### Added

**MCP server v0.5.0 — 5 new tools (4 → 9 total)**

- `windags_skill_search_batch` — run up to 20 cascade searches in one round-trip. Designed for DAG planners materializing N nodes at once instead of paying N MCP calls.
- `windags_skill_graft_batch` — same batching for graft. Per-task primary count capped at 3 to bound payload size; call `windags_skill_reference` for full reference contents when needed.
- `windags_node_requirements` — given skill IDs, return per-skill `allowed-tools`, `pairs-with`, suggested `model_tier`, and **provider-native** model IDs (e.g. `gpt-5.4-nano`, `llama-3.1-8b-instant`, `claude-haiku-4-5-20251001`). Fixes the bug where DAGs emitted abstract `"haiku"`/`"sonnet"` strings that 400'd on non-Anthropic providers.
- `windags_validate_dag` — schema-check a candidate `PredictedDAG` before saving. Returns clear field-path errors (`waves.0.nodes.0.id: Expected string, received number`) so a planner can self-correct mid-flight.
- `windags_estimate_cost` — char-based token + cost estimator. Per-node + total breakdown, calibrated to Claude tier pricing. Treat as planning-time order-of-magnitude, not a billing prediction.

**MCP server v0.4.0 — user-skills loader (earlier on this release line)**

- Scans `WINDAGS_USER_SKILLS_DIR`, `~/.claude/skills`, `./skills`, `./.windags/skills`. Embeds with the bundled MiniLM, caches keyed by content hash to `~/.windags/user-skills/cache.json`. User skills get a `user:` prefix so they don't collide with bundled IDs. Bundled + user are merged into a single semantic index — the cascade is corpus-agnostic.
- `ensureCatalogReady()` makes catalog construction lazy. Startup is instant; first search awaits the merge.
- `windags_skill_graft` and `windags_skill_reference` handle `user:` IDs end-to-end.
- Opt out with `WINDAGS_USER_SKILLS=off`.

**11 new skills (533 → 544)**

Gap-list closure plus dogfooding: see commit 72de043 for the full list.

### Infrastructure

- `.github/workflows/mcp-cascade.yml` — CI matrix (ubuntu/macos/windows × Node 20/22). Builds embeddings, runs smoke + telemetry + user-skills + MCP handshake tests. Caches Transformers.js model downloads across runs.
- `scripts/user-skills-smoke-test.mjs` — 8 passes (cache hit, edit detection, removal, env var pickup, body parsing).
- `scripts/mcp-handshake-test.mjs` — initialize + tools/list assertion that all 9 tools advertise correctly.

### Decided NOT to ship (yet)

- **`windags_topology_classify`** — was prototyped and pulled before release. Only the DAG topology has been proven end-to-end under real usage; exposing a classifier that recommends Team Loop / Swarm / Blackboard / Team Builder / Recurring / Workflow as production paths would oversell capability. When evidence accumulates that those topologies actually succeed, the tool can come back.

### Honesty note

- This release does not introduce, claim, or rely on Thompson sampling, multi-armed bandits, or Beta(α,β) updates for skill selection. Skills are heterogeneous, not fungible bandit arms. The actual mechanism is contextual retrieval + per-user attribution k-NN over a private triple store of (task, selected skills, accept/reject) — a re-ranking prior conditioned on similar past tasks, not an exploration policy.

---

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
