# Existing Repo Rehabilitation

Use this before editing an existing dirty website repo. The goal is to turn a
messy site into the ideal system without destroying user work or hiding taste
decisions inside code changes.

## Intake Before Edits

Do not start by refactoring. First record:

- git status, branch, remotes, recent commits, and untracked files
- package manager, framework, build commands, test commands, Storybook status
- current routes, layouts, components, primitives, tokens, CSS entrypoints, and
  content model
- hardcoded visual values, duplicate components, and arbitrary Tailwind values
- dependency health and primitive library usage
- auth/session, authorization, secure headers, secrets, and third-party script
  posture
- privacy/data collection, analytics, replay/logging, consent, and processor
  inventory
- release, rollback, environment, dashboard, and incident/runbook state
- locale, text expansion, RTL, inclusive UX, and sustainability/payload risk
- current mobile and desktop screenshots
- current failing tests, lint, typecheck, build, and audit script output
- user-owned dirty files that must be preserved

If a file is dirty before you touch it, treat it as user work. Work with it; do
not revert it unless explicitly asked.

## Visual Decision Review

Before broad execution, prepare a review artifact the user can understand
visually. This can be a markdown decision board, screenshots, Storybook,
Figma/Canva when available, or a local preview page.

Include:

- before screenshots for representative desktop and mobile routes
- current-state diagnosis with visible examples
- proposed design-system direction: tokens, typography, color, radius, density,
  components, and motion
- route impact map: preserve, refactor, rewrite, or defer
- component migration map: old component, new primitive/composite, owner, risk
- content/legal/SEO gaps
- security/privacy/reliability and release gaps
- i18n/inclusion/sustainability gaps
- execution slices and estimated sessions
- decisions requiring user approval

Do not bury design choices in code. If the change affects brand, information
architecture, typography, color, layout density, navigation, or content stance,
show it before executing.

## Preserve, Normalize, Replace

Classify each surface:

| Class | Meaning | Action |
|---|---|---|
| Preserve | Works and fits the target system | Keep, add stories/tests if missing |
| Normalize | Good behavior with style or token drift | Refactor onto tokens/primitives |
| Replace | Wrong abstraction, inaccessible, or blocks system goals | Rewrite behind stable API |
| Quarantine | Unknown, risky, or user-owned dirty work | Isolate and ask before touching |
| Defer | Valuable but not launch-blocking | Record in plan with reason |

## Execution Order

1. Stabilize: get the current build/test/storybook/audit truth.
2. Baseline visually: screenshots and user-visible flow inventory.
3. Create design-system contract and decision board.
4. Get user approval on direction and preserve/replace choices.
5. Create base token and primitive layer.
6. Normalize one vertical slice end to end.
7. Add or repair security, privacy, reliability, release, and analytics
   foundations.
8. Fan out bounded component/page/content/ops slices.
9. Re-run visual, a11y, performance, SEO, security, privacy, release, and
   regression gates.
10. Remove dead code only after replacement coverage is proven.

## Cheap Subagent Fanout

After approval, many cheaper subagents can execute in parallel when slices are
clear and disjoint. Good cheap-agent work:

- convert one component family to tokens
- add stories for a known component set
- replace raw Tailwind literals in a bounded directory
- write metadata for a known route list
- draft terms/privacy from an approved content model
- add tests around existing behavior
- collect screenshots or audit output
- add secure-header or metadata checks from an approved config
- add analytics event tests from an approved taxonomy
- localize obvious formatting through existing helpers

Do not assign cheap agents:

- brand direction
- final typography selection
- architecture tradeoffs
- broad repo cleanup
- destructive deletes
- user-owned dirty files without explicit scope
- final acceptance

Every cheap subagent needs:

- exact write set
- no-revert instruction
- budget/model ceiling
- acceptance checklist
- command gates to run
- handoff format
- coordination note or tuple

The lead agent integrates, resolves conflicts, runs final gates, and owns the
truthfulness of the final claim.

## Red Flags

- visual direction chosen after implementation
- no screenshot baseline
- no user approval on design direction
- “cleanup” touches many dirty files at once
- every subagent edits shared tokens
- no rollback point before component rewrites
- dead code deletion before route parity is proven
- green tests with unchanged broken UI
