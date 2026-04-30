# WinDAGs Skill Portfolio — Gap Analysis

_Catalog snapshot 2026-04-30: 533 skills under `skills/`._

## 1. Coverage Map

### 1.1 Skills by Category (20 categories, 533 skills)

| Count | Category | Notes |
|---:|---|---|
| 78  | Agent & Orchestration | Heavy. Includes 40+ `dag-*`, plus FIPA, BDI, JADE, CSP. |
| 76  | _(no category)_ | 50+ research-paper restatements (Bratman 1988, Polya, Klein) plus meta-DAG glue. |
| 61  | Research & Academic | Cognitive science, naturalistic decision-making, expertise elicitation. |
| 46  | Design & Creative | Mostly era/aesthetic skills (vaporwave, neumorphic, win31, win95, retrofuturism, neobrutalist, gestalt, swiss-modern, collage, maximalist...). |
| 37  | Backend & Infrastructure | API/DB foundation reasonable; runtime gaps below. |
| 29  | Cognitive Science & Decision Making | Largely overlaps Research. |
| 27  | AI & Machine Learning | Strong on LLM ops, weak on classical ML / training. |
| 27  | DevOps & Infrastructure | Has Docker/k8s/Terraform/GH Actions at surface only. |
| 24  | Frontend & UI | React-heavy. No Tailwind, Astro, Svelte, Vue, Solid, htmx. |
| 22  | Code Quality & Testing | Solid for vibes/refactor; thin on test pyramid. |
| 17  | Mobile Development | Decent iOS/Android/RN/Flutter. |
| 17  | Data & Analytics | Has dbt + lakehouse but nothing on DuckDB, Parquet, Arrow, Spark. |
| 16  | Productivity & Meta | Skill-creator, port-daddy. |
| 14  | Lifestyle & Personal | ADHD, partner texting, finance — fine. |
| 10  | Content & Marketing | Reasonable. |
| 9   | Career & Interview | Reasonable. |
| 8   | Recovery & Wellness | Niche but cohesive. |
| 6   | Video & Audio | Thin. |
| 5   | Security | Very thin. No appsec basics. |
| 4   | Legal & Compliance | Niche (expungement). |

### 1.2 Tag Cluster Sub-Tally (1,205 unique tags across 533 skills)

| Tag | n | Reading |
|---|---:|---|
| `dag` | 40 | Self-referential. |
| `agents`/`agent`/`bdi`/`fipa`/`llm-agents` | 49 | Agent theory dominates. |
| `orchestration`/`coordination` | 23 | Agent-runtime concerns. |
| `web-design` | 11 | Almost entirely _aesthetic_, not mechanical. |
| `performance`/`optimization`/`caching` | 33 | Concentrated in agent runtime + react. |
| `accessibility`/`wcag` | 11 | Decent. |
| `database` | 5 | Postgres only — no Redis, SQLite, MySQL, sharding, query plans. |
| `python`/`golang`/`rust`/`typescript`/`java` | 0+0+1+1+0 | **No language deep-dive tags exist.** |

### 1.3 Takeaway

The catalog is bimodal: half **agent runtime + agent theory** (dag-*, BDI, FIPA, JADE, Klein, Polya, Bratman) and half **WinDAGs-internal scaffolding** (skill-coach, skill-grader, dag-feedback-synthesizer, windags-*). What's missing is the **mainstream working-developer middle**: Vite, Webpack, Tailwind, Redis, OpenTelemetry, Postgres EXPLAIN, GitHub Actions reusable workflows, Go pprof, Python asyncio, htmx. When a typical TypeScript or Python developer queries via MCP, the BM25 narrower has thin-to-empty pickings outside React/Next.js + agent-orchestration. That blunts the project's stated differentiator — "more skills, more specifically per task" — because specificity collapses outside the agent domain.

---

## 2. Gap List (ranked, verified non-duplicates)

| # | Proposed Skill ID | One-line scope | Why a dev searches for it | Closest existing (partial) |
|---:|---|---|---|---|
| 1 | `vite-build-optimizer` | Vite config, HMR debugging, plugin authoring, code-splitting, build profiling. | Vite is the default bundler for new JS/TS projects; zero coverage today. | _none_ |
| 2 | `tailwind-v4-expert` | Tailwind v4 oxide engine, CSS-first config, theme tokens, container queries. | Tailwind ships in most new React/Next/Astro apps; v4 was a breaking redesign. | `css-in-js-architect` (orthogonal) |
| 3 | `postgres-explain-analyzer` | Read EXPLAIN ANALYZE, fix slow queries, index strategy, autovacuum tuning. | Daily backend reality; existing skill is shallow/generic. | `postgresql-optimization` |
| 4 | `redis-patterns-expert` | Caching, rate-limiting, leaderboards, streams, pub/sub, Lua scripts, eviction policies. | Redis is #2 datastore after Postgres; zero coverage. | `caching-strategies` (generic) |
| 5 | `opentelemetry-instrumentation` | OTel SDK setup (JS/Py/Go), spans, baggage, exporters, sampling, resource attributes. | OTel is the 2026 industry standard; no skill exists. | `observability-apm-expert` (vendor-agnostic, light) |
| 6 | `github-actions-matrix-patterns` | Reusable workflows, matrix strategy, conditional jobs, OIDC to AWS/GCP, action composition. | The existing builder is hello-world; matrix/reuse is where teams get stuck. | `github-actions-pipeline-builder` |
| 7 | `kubernetes-debugging-runbook` | `kubectl describe`, CrashLoopBackOff triage, OOMKilled, ImagePullBackOff, networking. | Existing k8s skills _generate_ manifests; nobody wrote one for **fixing** clusters. | `kubernetes-manifest-generator`, `kubernetes-deployment-automation` |
| 8 | `python-asyncio-pitfalls` | Event-loop debugging, blocking calls, asyncio.gather vs TaskGroup, cancellation, structured concurrency. | Massive Python user base; zero Python skills. | _none_ |
| 9 | `go-pprof-profiling` | CPU/heap/goroutine profiling, flamegraphs, mutex contention, escape analysis. | Go is mainstream backend; zero coverage. | `performance-profiling` (generic) |
| 10 | `rust-async-pitfalls` | Tokio runtimes, Send bounds, future lifetimes, blocking-in-async, channel patterns. | Catalog has Tauri/distribution but nothing on async correctness. | _none_ |
| 11 | `typescript-narrowing-expert` | Discriminated unions, control-flow analysis, `satisfies`, branded types, conditional types. | Most-asked TS question; existing skill is generic. | `typescript-advanced-patterns` |
| 12 | `duckdb-analytics` | DuckDB for local analytics, Parquet/Arrow ingestion, joining S3 data, replacing pandas. | Hot 2025-2026 tool; replaces Spark for many shops. | `dbt-analytics-engineer`, `lakehouse-architect` |
| 13 | `parquet-arrow-formats` | Columnar formats, schema evolution, predicate pushdown, partitioning, zstd compression. | Foundation of any modern data lake; not covered. | `lakehouse-architect` (architectural) |
| 14 | `astro-islands-architect` | Astro components, islands, SSR/SSG mix, content collections, integrations. | Astro is the default for content-heavy sites; zero coverage. | _none_ |
| 15 | `htmx-progressive-enhancement` | hx-* attributes, server-driven UI, swap strategies, OOB updates. | Counter-trend to SPA, real adoption; zero coverage. | `progressive-enhancement-expert` (philosophical, not htmx-specific) |
| 16 | `solidjs-fine-grained-reactivity` | Signals, stores, resources, contrast with React. | Adjacent to RSC hype cycle; zero coverage. | _none_ |
| 17 | `sqlite-wal-and-litestream` | WAL mode, busy-timeout, Litestream/LiteFS replication, embedded-DB patterns. | SQLite-on-the-edge is mainstream now (D1, Turso). | `cloudflare-worker-dev` (touches D1 lightly) |
| 18 | `terraform-module-design` | Module composition, registry, versioning, remote state, drift detection. | Existing terraform skills are generators; module _design_ is a separate discipline. | `terraform-iac-expert`, `terraform-module-builder` |
| 19 | `structured-logging-design` | JSON logs, correlation IDs, log levels, redaction, log volume cost control. | Concrete design patterns missing; existing skills are meta. | `logging-observability`, `log-aggregation-architect` |
| 20 | `grafana-dashboard-builder` | PromQL, Grafana panels, variables, alert rules, SLO dashboards. | Industry-default observability frontend; not covered. | `monitoring-stack-deployer` (deploys, doesn't build dashboards) |
| 21 | `nginx-and-caddy-config` | Reverse-proxy patterns, TLS termination, rate-limiting, websocket upgrade, static caching. | Universal web infra; zero coverage. | `api-gateway-reverse-proxy-expert` (agent-focused) |
| 22 | `dockerfile-build-cache-mastery` | BuildKit cache mounts, multi-arch, layer ordering, distroless, cosign. | Existing skill stops short of BuildKit & cache-mounts. | `docker-multi-stage-optimizer` |
| 23 | `feature-flag-rollout-strategist` | Flag taxonomies, kill switches, gradual rollouts, flag debt, A/B integration. | Universal SaaS practice; zero coverage. | _none_ |
| 24 | `webhook-receiver-design` | Idempotency, signature verification, retry handling, dead-letter queues, replay. | Every B2B integration; zero coverage. | `event-driven-architecture-expert` (broader) |
| 25 | `pnpm-workspace-monorepo` | pnpm workspaces, catalog protocol, hoisting, peer-dep resolution, turbo/nx integration. | This codebase _uses_ pnpm/turbo and has no skill on it. | `monorepo-management` (generic) |

**Honorable mentions** (real but ranked behind 25):
- `zod-schema-validation` — schema-first TS validation; only `form-validation-architect` exists.
- `playwright-component-testing` — distinct from existing e2e/screenshot skills.
- `core-web-vitals-debugging` — LCP/CLS/INP; no skill.
- `rate-limiter-algorithms` — token bucket, sliding window, Redis-backed; only API-level skill exists.
- `chaos-engineering-runbook` — failure injection patterns; no skill.

---

## 3. Anti-List (already strong — do NOT bloat)

| Domain | Why it's saturated |
|---|---|
| **DAG decomposition / orchestration** | 40+ `dag-*` skills + multiple decomposition papers. |
| **BDI / agent theory** | 12 BDI skills covering Rao-Georgeff, Bratman, normative extensions, etc. |
| **FIPA / agent comms protocols** | `fipa-00023`, `fipa-00025`, `fipa-00037`, `fipa-00086`, `bellifemine-2007-jade-fipa`, `agent-conversation-protocols`, `agent-interchange-formats`. |
| **Naturalistic decision making / cognitive task analysis** | 20+ skills (Klein 1998, RPD, CTA, GOMS, HTA, NDM, Kahneman-Klein, expertise elicitation). This is a research library, not a skill set. |
| **Era / aesthetic web design** | 14+ era cosplay skills (vaporwave, win31, win95, retrofuturism, neumorphic, neobrutalist, 2000s, gestalt, swiss-modern, collage, maximalist, etc.). |
| **Argumentation / discourse** | Lakatos, Toulmin, Socratic, steel-man, bad-faith-rhetoric-detector, logical-fallacy-detector, productive-discourse-facilitator, etc. |
| **WinDAGs internal meta-skills** | 30+ between `windags-*`, `skill-*`, `dag-*` plumbing, `skillful-*`. Adding more dilutes search. |
| **Recovery / sobriety vertical** | 12 cohesive skills cover this end-to-end. |
| **Knowledge distillation papers** | Four near-duplicates — should be **merged**, not extended. |

---

## 4. Methodology

A topic counts as a real gap if (a) a working developer would plausibly type a query about it in a normal week, (b) the topic is named after a concrete tool/technique with documentation a skill can ground in, and (c) no existing skill resolves with high specificity to that query. I excluded "academic flourish" gaps (yet another decision-theory paper) and "AI introduction educator" style fluff. Verification was a per-proposal grep of `skills/` for the slug stem and synonyms; where partial-coverage skills exist they are named so the next pass either deepens that skill or proposes a sibling rather than a duplicate. Coverage tallies came from parsing YAML frontmatter (`name`, `description`, `category`, `tags`) of all 533 SKILL.md files, plus targeted greps for ~80 mainstream tool names to verify absence rather than rely on the noisy 1,205-tag long tail.

---

## Top 5 Gap Clusters (executive summary)

- **Build tools are a black hole.** Zero coverage of Vite, Webpack, esbuild, Turbopack, Rollup, Parcel, SWC, Bun, Deno.
- **DB internals beyond Postgres are missing.** No Redis, SQLite/WAL, MySQL, Mongo, sharding, EXPLAIN-plan reading.
- **Modern frontend (non-React) is absent.** No Tailwind, Astro, htmx, Solid, Svelte, Vue, Qwik, Remix.
- **Observability is named, not specified.** No OpenTelemetry, no Grafana/PromQL, no structured-logging design, no SLO dashboards.
- **Language-specific deep dives are missing for the big four.** Zero Python/Go skills, one Rust skill that's about app distribution not async correctness, one TypeScript skill that's surface-level. Meanwhile 12 BDI papers and 4 near-duplicate knowledge-distillation surveys sit on the shelf.
