# Operations and Release

Use this before launch planning, analytics, dashboards, SLOs, feature flags,
environments, migrations, rollback, runbooks, or release evidence.

## Current Anchors

Verify before citing:

- Core Web Vitals: LCP, INP, CLS with p75 thresholds for real users.
  https://web.dev/articles/defining-core-web-vitals-thresholds
- OpenTelemetry JavaScript instrumentation.
  https://opentelemetry.io/docs/languages/js/
- Next.js instrumentation convention when using App Router.
  https://nextjs.org/docs/app/guides/instrumentation
- OWASP Software Component Verification Standard for supply-chain posture.
  https://owasp.org/www-project-software-component-verification-standard/

## Environments

A real app needs named environments:

- local development
- preview per branch or pull request
- staging or preproduction with production-like config
- production

Record differences in:

- URLs and callback origins
- auth providers
- database and storage
- email/SMS/payment modes
- feature flags
- analytics and observability sampling
- robot indexing
- seed data and test accounts
- CSP and third-party scripts

Preview environments should be safe to share. Production credentials must not
be required for routine review.

## Analytics and Metrics

Define an event taxonomy before adding dashboards:

- product objective
- funnel or workflow stage
- event name
- trigger
- required and optional properties
- privacy classification
- owner
- dashboard or alert using it

Good analytics answer product questions without recording private content.
Avoid free-form event sprawl. Use stable names and typed properties.

Minimum dashboards for a production app:

- acquisition/conversion or primary workflow success
- activation/onboarding
- retention or repeat use where relevant
- errors and failed jobs
- Core Web Vitals and route performance
- auth, billing, or critical transaction failures
- abuse/rate-limit signals where relevant
- release health by version/environment

## SLOs and Alerts

Define service-level objectives for user-visible promises:

- route availability
- latency for core flows
- job completion time
- webhook processing
- error rate
- payment or auth success
- AI/provider success and fallback rate if applicable

Every alert needs:

- owner
- severity
- signal
- threshold
- notification path
- runbook
- expected user impact
- rollback or mitigation step

Do not alert on noise that nobody will act on.

## Release Engineering

Each release should have:

- branch or commit identifier
- version or build id
- environment target
- migration list
- feature flags changed
- test evidence
- visual evidence for affected surfaces
- observability test event
- rollback command or platform action
- release notes or changelog when users need them

Use canary, gradual rollout, or feature flags for risky behavior changes. A
flag is not a substitute for testing; it is a blast-radius control.

## CI Gates

Baseline gates:

- format or lint
- typecheck
- unit tests
- integration tests for server routes/actions/loaders
- e2e tests for critical flows
- Storybook build
- component interaction tests
- accessibility tests
- bundle budget
- audit script
- security/dependency audit
- production build

Add visual regression for design-system and route templates. Add smoke tests
against preview deployments when the platform supports it.

## Migrations and Data Changes

Before merging a migration:

- describe forward and rollback behavior
- verify it is idempotent where possible
- estimate runtime and lock risk
- test on representative data
- preserve user data
- define backup and restore point
- coordinate with application code release order

For irreversible migrations, require explicit risk acceptance and a tested
restore path.

## Runbooks

Write short runbooks for:

- failed deploy
- elevated error rate
- degraded third-party provider
- auth outage
- payment/webhook failure
- data import/export failure
- queue backlog
- security incident intake
- rollback
- restore from backup

Runbooks should contain concrete commands or dashboard links. "Investigate" is
not a runbook step.

## Dependency and Supply Chain

Record:

- package manager and lockfile status
- dependency audit command and result
- outdated critical packages
- packages with install scripts
- frontend third-party scripts and pixels
- transitive dependency exceptions
- license risk when commercial use matters
- update cadence and owner

Prefer fewer packages with clear ownership over fashionable dependency piles.

## Evidence to Record

- environment matrix
- analytics taxonomy
- dashboards
- SLOs and alerts
- release checklist
- CI output
- migration notes
- rollback proof
- runbook paths
- dependency audit result
