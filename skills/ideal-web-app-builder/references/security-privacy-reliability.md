# Security, Privacy, Reliability

Use this before designing auth, data flows, security headers, privacy,
AI-enabled features, backups, incident paths, or production reliability.

## Current Anchors

Verify dates before quoting these in deliverables:

- OWASP ASVS latest stable: 5.0.0, released 2025-05-30.
  https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10 current release: 2025.
  https://owasp.org/Top10/2025/
- OWASP Secure Headers Project.
  https://owasp.org/www-project-secure-headers/
- W3C Privacy Principles Statement, 2025-05-15.
  https://www.w3.org/TR/privacy-principles/
- OWASP Top 10 for LLM Applications 2025 / GenAI Security Project.
  https://genai.owasp.org/llm-top-10/
- NIST AI RMF 1.0 and Generative AI Profile NIST AI 600-1.
  https://www.nist.gov/itl/ai-risk-management-framework

## Threat Model

For every production app, write a short threat model before implementation:

- assets: user data, credentials, billing state, admin actions, generated
  content, files, secrets, analytics, telemetry, logs
- actors: anonymous visitor, authenticated user, tenant admin, staff admin,
  integration partner, attacker, scraper, abusive user, compromised package,
  automation/agent
- trust boundaries: browser, edge, server, database, object storage, queues,
  third-party scripts, payments, email, analytics, AI providers
- abuse cases: account takeover, authorization bypass, scraping, prompt
  injection, cost exhaustion, spam, stored XSS, SSRF, webhook spoofing, data
  export, deletion, privilege escalation
- controls: auth, authorization, validation, rate limits, audit logs,
  containment, review queues, alerts, recovery

Do not accept "we use a framework" as a threat model.

## Security Baseline

Map high-risk work to OWASP ASVS identifiers when precision matters. For most
web apps, at minimum cover:

- authorization checks on every server-side data access path
- authenticated and unauthenticated route separation
- secure session cookies: `HttpOnly`, `Secure`, `SameSite`, scoped path/domain,
  sensible lifetime and rotation
- CSRF protection for cookie-authenticated state changes
- input validation at the boundary and output encoding at the sink
- safe file upload handling: size, type, scanning policy, storage isolation
- SSRF prevention for URL fetches, webhooks, imports, image proxies, and AI
  tools
- rate limits, quotas, bot controls, abuse logging, and account recovery
- secrets in environment or secret manager only; no committed credentials
- dependency audit plus a human review of risky third-party scripts
- admin/staff routes with stronger authentication and auditable actions
- migrations and scripts reviewed for destructive behavior

Security bugs in server actions, loaders, route handlers, and edge middleware
are product bugs. Test them.

## Secure Headers

Use the platform/framework header API, not scattered ad hoc route code.

Default candidates:

- `Content-Security-Policy`
- `Strict-Transport-Security` when HTTPS is universal
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- `Cross-Origin-Embedder-Policy` when isolation is required and compatible
- `Cache-Control` for private, authenticated, or sensitive responses

CSP must be tuned against the real app. Prefer nonces or hashes for scripts,
avoid broad `unsafe-inline` and `unsafe-eval`, and use report-only mode before
enforcement when the app has complex third-party scripts.

## Privacy Model

Create a data map:

- personal data collected
- sensitive data and contextual sensitivity
- purpose for each field
- legal/commercial basis or product need
- storage location and retention
- third-party processors
- user access, correction, deletion, export, and opt-out paths
- logs, traces, replays, screenshots, and support tools that may capture data

Apply data minimization by default. Optional analytics, marketing pixels,
session replay, and personalization must have a consent or opt-out model that
is as easy to reverse as it is to grant.

Avoid deceptive consent UX. A consent banner that pressures the user into
tracking is a product-quality failure even when it passes a narrow legal test.

## Observability Privacy

Before enabling replay, traces, or logs:

- classify fields that must be masked
- block password, token, secret, payment, health, school, precise location, and
  private-message capture
- sample by environment and route risk
- verify source maps are protected
- verify a test event without leaking sensitive payloads
- document who can access logs and replays

## Reliability and Recovery

Define reliability for the product shape:

- expected uptime or support hours
- SLOs for critical routes and jobs
- graceful loading, error, empty, offline, and stale states
- retry/backoff behavior
- queue/job idempotency
- migration and rollback plan
- backup frequency and retention
- restore test procedure
- incident contact and status path
- user communication templates for data loss, downtime, and security events

For data-bearing products, no launch claim is complete until backup and restore
are tested or explicitly excluded with risk accepted.

## AI and Agentic Features

If the app uses generative or agentic AI, add an AI-risk register:

- prompt injection and indirect prompt injection
- sensitive information disclosure to or from model providers
- insecure output handling before rendering, execution, or persistence
- excessive agency, tool permission, and irreversible actions
- overreliance and human escalation paths
- cost denial of service and quota exhaustion
- model/provider availability and degradation behavior
- content provenance, user disclosure, and audit logs
- evaluation set for harmful, wrong, unsafe, or manipulative outputs

AI output that becomes HTML, code, database mutations, emails, or tool calls is
untrusted input until validated.

## Evidence to Record

- threat model path
- data map path
- auth/authorization test list
- dependency audit and exceptions
- security header output or deployment config
- privacy/consent review
- observability masking evidence
- backup/restore result
- incident and rollback path
- AI-risk register if applicable
