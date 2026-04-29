# Agent Orchestration

Use this when the work is larger than a small fix.

## Port Daddy

In Port Daddy repos:

1. Run `pd status`, `pd briefing`, and `pd salvage` if abandoned work might
   matter.
2. Start a session and leave a note describing scope.
3. Claim or lock files for overlapping edits.
4. Use tuples or notes for machine-readable coordination when the task spans
   multiple slices.
5. End with a handoff that records files changed, tests run, and remaining
   risks.

## Plan Discipline

The on-disk plan is the coordination source:

- Copy `templates/pessimistic-plan.md` into the target repo.
- Keep it pessimistic. Include research, design, content, implementation,
  testing, observability, PWA, launch, and cleanup.
- Update it after each completed slice.
- Do not delete deferred work. Move it to explicit later phases with reasons.
- If the user changes scope, update the plan before continuing.

## Sidecar Agents

Only launch subagents when the active environment and user authorization allow
it. Useful sidecars:

- Design archivist: visual database and pattern evidence.
- Competitive cartographer: positioning map and white space.
- Token auditor: scans CSS, Tailwind, components, stories, and generated files.
- Accessibility reviewer: keyboard, screen-reader, contrast, focus, motion.
- Performance reviewer: bundle, hydration, image, font, and Core Web Vitals.
- Content editor: legal pages, blog, SEO, editorial differentiation.
- Security/privacy reviewer: threat model, auth boundaries, headers, data map,
  consent, dependency risk, and AI-risk register.
- Operations reviewer: dashboards, analytics taxonomy, SLOs, release checklist,
  rollback, runbooks, and incident evidence.
- I18n/sustainability reviewer: language, locale formatting, text expansion,
  bidirectionality, inclusive UX, payload budgets, and resource footprint.
- Product-truth reviewer: claims ledger, pricing truth, support paths, admin
  risk, consent autonomy, and content governance.
- Adversarial auditor: tries to falsify "done".

## Cheap Execution Swarms

Use many cheaper subagents only after the user has approved the visual decision
review and the work has been decomposed into small, disjoint slices. Cheap
agents are for execution, inventory, test writing, story writing, literal
removal, route metadata, content drafts from an approved brief, screenshot
capture, and bounded component normalization.

Keep architecture, brand direction, final typography/color choices, destructive
cleanup, and final acceptance with the lead agent or a stronger reviewer. Do
not silently upgrade a cheap execution slice to an expensive model; ask or
record explicit approval when cost tier changes.

For each execution agent, specify:

- model or cost tier ceiling
- owned files or directory
- read-only context it may inspect
- exact behavior to preserve
- token and primitive rules
- tests or audit commands to run
- handoff format
- instruction not to revert other work

Give every sidecar:

- session identity
- purpose
- owned files or read-only scope
- expected output
- quality gates
- what not to touch

## Background and Event-Triggered Agents

Consider always-on or event-triggered agents when they reduce latency or catch
drift:

- file-change token drift scanner
- Storybook visual regression watcher
- accessibility watcher
- bundle budget watcher
- Sentry release verifier
- content freshness checker
- SEO metadata checker
- security header and dependency watcher
- analytics schema drift checker
- release health and rollback verifier
- localization text-overflow watcher
- sustainability budget watcher

Do not create unbounded spawn loops. Set budgets, singleton behavior, trigger
scope, and failure stop rules.

## Adversarial Review

Use `agents/adversarial-auditor.md` for independent review. The auditor should
lead with failures, not praise:

- raw visual literals
- inconsistent tokens
- inaccessible controls
- missing states
- mobile overlap
- false content
- weak legal pages
- missing observability
- missing security/privacy evidence
- missing backup, restore, rollback, or runbook evidence
- unsupported claims or pricing mismatch
- deceptive consent or autonomy-reducing UX
- i18n, inclusion, or sustainability blind spots
- missing Storybook stories
- missing tests
- performance risk
- fake completion claims
