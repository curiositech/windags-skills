# Quality Gates

Use this for implementation review, CI, release readiness, and adversarial
audits.

## Visual Decision Review

For existing dirty repos or major design changes, large edits are blocked until
the user has seen and accepted a visual decision review:

- before screenshots for desktop and mobile
- proposed design direction and token system
- typography, color, spacing, radius, and density decisions
- route and component impact map
- preserve/normalize/replace/defer decisions
- execution slices and likely session count
- risks and rollback points

Record acceptance in the on-disk plan. If the user asks to skip this gate, note
that explicitly and narrow the scope.

## Accessibility

Baseline:

- WCAG 2.2 AA hard gate.
- AAA contrast targets where feasible: 7:1 normal text, 4.5:1 large text.
- 3:1 minimum for focus indicators, non-text UI, and meaningful graphics.
- Keyboard access for every interactive element.
- No keyboard traps.
- Visible focus that is not hidden by sticky chrome.
- Accessible names and descriptions for controls.
- Semantic HTML before ARIA.
- Reduced-motion support for animation.
- Touch targets that are practical on mobile.

Automation is not enough. Pair axe/Storybook checks with keyboard testing,
screen-reader spot checks, and focus-order review.

## Performance

Core Web Vitals targets at p75, segmented mobile and desktop:

- LCP <= 2.5s
- INP <= 200ms
- CLS <= 0.1

Also set budgets for:

- route JavaScript
- CSS
- image bytes and dimensions
- font files and preload strategy
- hydration cost
- server response time
- interaction latency for core flows

Prefer server rendering, static generation, islands, route-level splitting, and
lazy loading when they reduce real user cost.

## Storybook and Tests

Required for component systems:

- Storybook configured.
- Stories for every state in the component contract.
- Accessibility addon or Vitest/browser tests with failing CI behavior for
  serious components.
- Interaction tests for menus, dialogs, tabs, forms, command palettes, and data
  tables.
- Visual regression for critical components and templates.

Application tests should include:

- route rendering
- data loading and errors
- form validation
- auth/permission states
- server actions or API routes
- analytics and observability events where important

## Observability

Use Sentry or an equivalent platform when the app is more than a static toy:

- client, server, and edge/runtime initialization where applicable
- release and environment tags
- source maps
- error boundary or global error capture
- tracing sample policy
- replay sample policy with privacy defaults
- structured logs or breadcrumbs for critical flows
- verified test event before launch

Never enable broad PII capture without a deliberate privacy review.

## Security and Privacy

Required for production apps:

- threat model for assets, actors, trust boundaries, and abuse cases
- auth/session/cookie model reviewed
- authorization tests for protected data and admin actions
- validation and output-encoding strategy
- CSRF posture for cookie-authenticated writes
- dependency and third-party script review
- secure headers reviewed: CSP, HSTS, content type, referrer, permissions,
  cross-origin isolation where relevant, and private-cache behavior
- secrets not committed and not exposed in client bundles
- privacy data map: collection, purpose, retention, processor, consent or
  opt-out, deletion/export path, and observability capture
- AI-risk register if generative or agentic AI is present

Use OWASP ASVS for precise requirement mapping when the app handles money,
health, education, identity, children, regulated data, enterprise data, or
agentic actions.

## Reliability and Recovery

Record:

- SLOs or support-hour expectations
- critical loading, error, retry, empty, stale, and degraded states
- queue/job idempotency where applicable
- migration and rollback plan
- backup and restore procedure for data-bearing products
- incident contact, status path, and user communication path
- provider outage behavior for auth, payment, email, storage, AI, and analytics

Backup claims require a restore test or an explicit untested-risk entry.

## Operations and Release

Before launch:

- environment matrix exists for local, preview, staging, and production
- analytics event taxonomy is named, typed, privacy-classified, and owned
- dashboards exist for product success, error rates, Core Web Vitals, auth or
  billing failures, critical jobs, and release health where relevant
- release checklist records build id, migrations, feature flags, evidence, and
  rollback
- runbooks exist for failed deploy, elevated errors, provider outage, data
  restore, and security intake
- CI blocks regressions in typecheck, tests, Storybook, accessibility, bundle,
  build, security/dependency, and the audit script

## I18n, Inclusion, Sustainability

Required decisions:

- document language and locale formatting strategy
- explicit supported locales and unsupported-locale fallback
- text expansion, long-word, zoom, mobile, and narrow-width review
- bidirectional text review when user content or target markets require it
- inclusive imagery, names, address, unit, time-zone, and currency assumptions
- payload, font, image, polling, replay, and AI-resource budgets
- low-bandwidth, low-data, or low-power behavior when audience or market calls
  for it
- no sustainability claims without measurement evidence

## PWA

If PWA is in scope:

- HTTPS
- valid manifest linked from every installable page
- name, short_name, start_url, scope, display, theme/background color
- icons at 192 and 512 plus maskable icon where appropriate
- offline fallback or explicit online-only behavior
- service-worker update strategy
- installability test
- app shell does not hide browser escape routes for external links

## SEO and Metadata

- Unique title and description per route.
- Canonical URL.
- sitemap and robots.
- Open Graph and Twitter/social metadata.
- Absolute OG image URLs with dimensions and alt where supported.
- Per-page OG images for important pages.
- Structured data where applicable.
- Heading hierarchy and readable content.
- Indexing rules match the launch plan.

## Release Evidence

Before claiming done, record:

- commands run and results
- unresolved risks
- screenshots reviewed on desktop and mobile
- audit script output
- accessibility evidence
- performance evidence
- Storybook/test evidence
- content/SEO/legal evidence

If a gate cannot run, say which one and why.
