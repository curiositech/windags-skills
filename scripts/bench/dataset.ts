/**
 * WinDAGs benchmark dataset.
 *
 * 50 hand-curated engineering prompts. Each prompt names a category and the
 * skill ID a senior engineer would actually reach for — the cascade's job is
 * to land on that skill (or a strict superset) when given the prompt.
 *
 * The reference skill is *not* used to bias scoring of the agent's final
 * answer. It's used to measure cascade hit-rate (how often the cascade's top-K
 * contains the reference) as a separate signal alongside output quality.
 */

export type Category =
  | "graphql-rest-apis"
  | "postgres-perf"
  | "stripe-payments"
  | "auth-oauth"
  | "k8s-ops"
  | "frontend"
  | "ml-pipelines"
  | "build-deploy"
  | "observability"
  | "data-pipelines";

export type BenchPrompt = {
  id: string;
  category: Category;
  prompt: string;
  /** Skill ID an experienced engineer would reach for; used for cascade hit-rate only. */
  referenceSkill: string;
  /** Optional second skill that would also be acceptable. */
  acceptableSkills?: string[];
};

// Reference skills are real IDs from /skills/. Cascade hit-rate measures how
// often the retrieval cascade returns the reference (or any acceptable skill)
// in its top-K. When the catalog has no specialist for a topic (e.g. only one
// payments skill covers all of pay-001..005), we accept that the same skill
// will be the reference for multiple prompts — the eval signal then comes from
// the judge comparing arm outputs, not from cascade differentiation.
export const DATASET: BenchPrompt[] = [
  // ── GraphQL / REST APIs ──────────────────────────────────────────────────
  { id: "api-001", category: "graphql-rest-apis",
    prompt: "Design a paginated GraphQL endpoint for our search results that won't fall over at scale.",
    referenceSkill: "graphql-server-architect",
    acceptableSkills: ["api-architect", "rest-api-design"] },
  { id: "api-002", category: "graphql-rest-apis",
    prompt: "Add rate limiting to our public REST API. Free tier is 100 req/min, pro is 1000.",
    referenceSkill: "api-rate-limiting-throttling-expert",
    acceptableSkills: ["api-gateway-reverse-proxy-expert"] },
  { id: "api-003", category: "graphql-rest-apis",
    prompt: "We want to version our REST API without breaking existing v1 clients. What's the play?",
    referenceSkill: "api-versioning-backward-compatibility",
    acceptableSkills: ["rest-api-design", "api-architect"] },
  { id: "api-004", category: "graphql-rest-apis",
    prompt: "The N+1 problem on our /orders endpoint is killing us. We're loading customer + line items per row.",
    referenceSkill: "graphql-server-architect",
    acceptableSkills: ["api-architect", "postgresql-optimization"] },
  { id: "api-005", category: "graphql-rest-apis",
    prompt: "Set up GraphQL field-level authorization so admins see all fields and customers see only their own.",
    referenceSkill: "graphql-server-architect",
    acceptableSkills: ["oauth-oidc-implementer"] },

  // ── Postgres performance ─────────────────────────────────────────────────
  { id: "pg-001", category: "postgres-perf",
    prompt: "Our pg_stat_statements shows a query taking 12 seconds on a 50M-row table. EXPLAIN says Seq Scan.",
    referenceSkill: "postgresql-optimization" },
  { id: "pg-002", category: "postgres-perf",
    prompt: "Set up Postgres connection pooling correctly. We're hitting max_connections under bursty load.",
    referenceSkill: "database-connection-pool-manager",
    acceptableSkills: ["postgresql-optimization"] },
  { id: "pg-003", category: "postgres-perf",
    prompt: "Add a NOT NULL column to a 50M-row prod table without locking writes for 20 minutes.",
    referenceSkill: "database-migration-planner",
    acceptableSkills: ["data-migration-specialist", "drizzle-migrations", "database-migration-manager"] },
  { id: "pg-004", category: "postgres-perf",
    prompt: "Failover plan for our Postgres primary if AZ goes down. We have a hot standby in another AZ.",
    referenceSkill: "postgresql-optimization",
    acceptableSkills: ["database-design-patterns"] },
  { id: "pg-005", category: "postgres-perf",
    prompt: "Implement soft delete on our users table without breaking the existing GDPR-deletion path.",
    referenceSkill: "database-design-patterns",
    acceptableSkills: ["postgresql-optimization"] },

  // ── Stripe / payments (catalog has only one payments skill) ──────────────
  { id: "pay-001", category: "stripe-payments",
    prompt: "Stripe webhook receiver in Node. Verify signatures, handle replays, idempotent.",
    referenceSkill: "mobile-payment-integration-specialist" },
  { id: "pay-002", category: "stripe-payments",
    prompt: "Build a subscription upgrade flow with proration. Customer goes from $20/mo to $50/mo mid-cycle.",
    referenceSkill: "mobile-payment-integration-specialist" },
  { id: "pay-003", category: "stripe-payments",
    prompt: "Refund a card payment partially via Stripe and reflect it in our orders table.",
    referenceSkill: "mobile-payment-integration-specialist" },
  { id: "pay-004", category: "stripe-payments",
    prompt: "Switch from manual invoice payment collection to Stripe automatic. We have 200 active subs.",
    referenceSkill: "mobile-payment-integration-specialist" },
  { id: "pay-005", category: "stripe-payments",
    prompt: "Customer's payment failed 3 times in a row. What's the dunning flow we should set up?",
    referenceSkill: "mobile-payment-integration-specialist" },

  // ── Auth / OAuth ─────────────────────────────────────────────────────────
  { id: "auth-001", category: "auth-oauth",
    prompt: "Refresh the OAuth access token transparently before it expires. Currently users get 401s mid-session.",
    referenceSkill: "oauth-oidc-implementer",
    acceptableSkills: ["modern-auth-2026"] },
  { id: "auth-002", category: "auth-oauth",
    prompt: "Add Google OAuth to our existing email/password app without forcing existing users to migrate.",
    referenceSkill: "oauth-oidc-implementer",
    acceptableSkills: ["modern-auth-2026"] },
  { id: "auth-003", category: "auth-oauth",
    prompt: "Rotate JWT signing keys without invalidating all currently-issued tokens.",
    referenceSkill: "modern-auth-2026",
    acceptableSkills: ["oauth-oidc-implementer"] },
  { id: "auth-004", category: "auth-oauth",
    prompt: "Implement passwordless email magic-link login. Tokens single-use, 15-minute TTL.",
    referenceSkill: "modern-auth-2026",
    acceptableSkills: ["oauth-oidc-implementer"] },
  { id: "auth-005", category: "auth-oauth",
    prompt: "Add SAML SSO for enterprise customers alongside our existing OAuth.",
    referenceSkill: "modern-auth-2026",
    acceptableSkills: ["oauth-oidc-implementer"] },

  // ── k8s / ops (one general k8s skill covers the catalog) ─────────────────
  { id: "k8s-001", category: "k8s-ops",
    prompt: "Pod is OOMKilling on Node 16-Alpine. Memory looks fine in the container but the kernel disagrees.",
    referenceSkill: "kubernetes-deployment-automation",
    acceptableSkills: ["docker-containerization"] },
  { id: "k8s-002", category: "k8s-ops",
    prompt: "Set up a HorizontalPodAutoscaler that scales on a custom Prometheus metric (queue depth).",
    referenceSkill: "kubernetes-deployment-automation",
    acceptableSkills: ["kubernetes-manifest-generator"] },
  { id: "k8s-003", category: "k8s-ops",
    prompt: "Zero-downtime rollout of a new image version with readiness probes and PodDisruptionBudget.",
    referenceSkill: "kubernetes-deployment-automation",
    acceptableSkills: ["kubernetes-manifest-generator"] },
  { id: "k8s-004", category: "k8s-ops",
    prompt: "Sidecar pattern for log shipping. Don't let the sidecar's failure crash the app container.",
    referenceSkill: "kubernetes-deployment-automation",
    acceptableSkills: ["kubernetes-manifest-generator", "logging-observability"] },
  { id: "k8s-005", category: "k8s-ops",
    prompt: "Limit container egress to a specific list of CIDRs using NetworkPolicy.",
    referenceSkill: "kubernetes-deployment-automation",
    acceptableSkills: ["kubernetes-manifest-generator"] },

  // ── Frontend ─────────────────────────────────────────────────────────────
  { id: "fe-001", category: "frontend",
    prompt: "React form with 30 fields is rerendering on every keystroke. Profiler shows full tree updates.",
    referenceSkill: "react-performance-optimizer",
    acceptableSkills: ["react-hook-composer"] },
  { id: "fe-002", category: "frontend",
    prompt: "Implement infinite scroll on a list of 10k items without blowing the DOM.",
    referenceSkill: "virtualization-specialist",
    acceptableSkills: ["react-performance-optimizer"] },
  { id: "fe-003", category: "frontend",
    prompt: "Optimistic updates for our chat UI. Network is unreliable so we need rollback on failure.",
    referenceSkill: "react-hook-composer",
    acceptableSkills: ["react-performance-optimizer", "frontend-architect"] },
  { id: "fe-004", category: "frontend",
    prompt: "Server-side rendering with React Server Components. Hydration is throwing mismatch warnings.",
    referenceSkill: "react-server-components-expert",
    acceptableSkills: ["nextjs-app-router-expert"] },
  { id: "fe-005", category: "frontend",
    prompt: "Image-heavy page is failing Core Web Vitals on LCP. We're already using next/image.",
    referenceSkill: "react-performance-optimizer",
    acceptableSkills: ["frontend-architect", "nextjs-app-router-expert"] },

  // ── ML pipelines ─────────────────────────────────────────────────────────
  { id: "ml-001", category: "ml-pipelines",
    prompt: "Embedding pipeline for 10M product descriptions. Throughput, retries, idempotency.",
    referenceSkill: "rag-document-ingestion-pipeline",
    acceptableSkills: ["multimodal-embedding-generator"] },
  { id: "ml-002", category: "ml-pipelines",
    prompt: "Vector search over 1M docs with hybrid keyword + semantic. Currently using only embeddings.",
    referenceSkill: "rag-document-ingestion-pipeline",
    acceptableSkills: ["clip-aware-embeddings", "vector-database-migration-tool"] },
  { id: "ml-003", category: "ml-pipelines",
    prompt: "Detect data drift in our churn model's input features and alert when distribution shifts.",
    referenceSkill: "llm-evaluation-harness",
    acceptableSkills: ["llm-as-judge-zheng-2023", "observability-apm-expert"] },
  { id: "ml-004", category: "ml-pipelines",
    prompt: "A/B test two ranking models in production with bandits to minimize regret on the worse arm.",
    referenceSkill: "llm-evaluation-harness",
    acceptableSkills: ["llm-router"] },
  { id: "ml-005", category: "ml-pipelines",
    prompt: "Fine-tune a small LLM on customer support tickets. We have 50k labeled examples.",
    referenceSkill: "ai-engineer",
    acceptableSkills: ["llm-cost-optimizer", "llm-router"] },

  // ── Build / deploy ───────────────────────────────────────────────────────
  { id: "build-001", category: "build-deploy",
    prompt: "Speed up our Next.js production build. Currently 8 minutes on CI.",
    referenceSkill: "nextjs-app-router-expert",
    acceptableSkills: ["build-verification-expert", "ci-cache-optimizer"] },
  { id: "build-002", category: "build-deploy",
    prompt: "Set up a monorepo with pnpm workspaces and turborepo. We have 6 packages.",
    referenceSkill: "monorepo-management" },
  { id: "build-003", category: "build-deploy",
    prompt: "Cache npm dependencies in CI properly. Cache keys are missing lockfile changes.",
    referenceSkill: "ci-cache-optimizer",
    acceptableSkills: ["github-actions-pipeline-builder"] },
  { id: "build-004", category: "build-deploy",
    prompt: "Cloudflare Pages deploy keeps timing out on the build step. 50k blog post pages.",
    referenceSkill: "cloudflare-pages-cicd",
    acceptableSkills: ["cloudflare-worker-dev"] },
  { id: "build-005", category: "build-deploy",
    prompt: "Roll back a Vercel deploy that's serving stale data. Need to do it from CI.",
    referenceSkill: "vercel-deployment",
    acceptableSkills: ["github-actions-pipeline-builder"] },

  // ── Observability ────────────────────────────────────────────────────────
  { id: "obs-001", category: "observability",
    prompt: "Distributed tracing across our 8 microservices. Currently each one logs separately.",
    referenceSkill: "observability-apm-expert",
    acceptableSkills: ["logging-observability"] },
  { id: "obs-002", category: "observability",
    prompt: "Structured logging in Go. We're using log.Printf and the SRE team is annoyed.",
    referenceSkill: "logging-observability",
    acceptableSkills: ["observability-apm-expert"] },
  { id: "obs-003", category: "observability",
    prompt: "Set up SLOs for our checkout API (p95 latency, error rate) and alert on burn rate.",
    referenceSkill: "observability-apm-expert",
    acceptableSkills: ["logging-observability"] },
  { id: "obs-004", category: "observability",
    prompt: "Sentry is overwhelming us with the same error 50k times. Group and rate-limit.",
    referenceSkill: "observability-apm-expert",
    acceptableSkills: ["logging-observability"] },
  { id: "obs-005", category: "observability",
    prompt: "Prometheus cardinality is exploding because of high-cardinality labels (user_id).",
    referenceSkill: "observability-apm-expert",
    acceptableSkills: ["logging-observability"] },

  // ── Data pipelines ──────────────────────────────────────────────────────
  { id: "data-001", category: "data-pipelines",
    prompt: "Backfill 6 months of historical events into our warehouse without blocking the live ingestion.",
    referenceSkill: "data-warehouse-optimizer",
    acceptableSkills: ["streaming-pipeline-architect", "airflow-dag-orchestrator"] },
  { id: "data-002", category: "data-pipelines",
    prompt: "Schema migration on a Kafka topic. Producers and consumers need to roll independently.",
    referenceSkill: "streaming-pipeline-architect",
    acceptableSkills: ["data-warehouse-optimizer"] },
  { id: "data-003", category: "data-pipelines",
    prompt: "Airflow DAG with 200 tasks is hitting the scheduler. Some tasks take 5 hours.",
    referenceSkill: "airflow-dag-orchestrator" },
  { id: "data-004", category: "data-pipelines",
    prompt: "dbt models are taking 90 minutes to run. Most of the time is in 3 incremental tables.",
    referenceSkill: "dbt-analytics-engineer",
    acceptableSkills: ["data-warehouse-optimizer"] },
  { id: "data-005", category: "data-pipelines",
    prompt: "Stream-process click events into our data lake with exactly-once semantics.",
    referenceSkill: "streaming-pipeline-architect",
    acceptableSkills: ["data-warehouse-optimizer"] },
];

if (DATASET.length !== 50) {
  throw new Error(`expected 50 prompts, got ${DATASET.length}`);
}
