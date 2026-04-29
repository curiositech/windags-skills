# Product Truth and Governance

Use this before claims, pricing, consent UX, support, admin, content
governance, changelogs, product metrics, or final launch review.

## Claims Ledger

Every public claim should have an owner and proof:

- performance claims
- security and privacy claims
- AI capability claims
- customer, press, or partner references
- compliance claims
- pricing, savings, ROI, and benchmark claims
- uptime or reliability claims
- accessibility claims
- sustainability claims

Record:

- exact copy
- source or evidence
- page/route
- owner
- review date
- expiration or update cadence
- risk if wrong

If proof is missing, weaken the claim or remove it. Do not invent logos,
testimonials, numbers, awards, certifications, or press.

## Product Decision Records

For major decisions, keep short records:

- problem
- user group affected
- alternatives considered
- decision
- tradeoffs
- evidence
- date
- owner
- revisit trigger

Use decision records for brand direction, typography, color, IA, pricing,
auth, privacy, analytics, AI behavior, and destructive cleanup in existing
repos.

## Consent and Autonomy

Consent and preference UX must not rely on manipulation:

- optional tracking is separate from essential operation
- decline is as easy as accept
- withdrawal is available later
- settings explain consequences plainly
- no preselected non-essential tracking
- no punishment for privacy-preserving choices unless a feature truly cannot
  work without the data
- no confusing button hierarchy or forced detours

Consent screens are product UI and need Storybook states, accessibility checks,
and mobile review.

## Support and Trust Surfaces

Most production apps need a visible support path:

- contact or help page
- support email/form
- security contact for sensitive products
- status or incident page for operational products
- refund/cancellation path for paid products
- account deletion and data export path when applicable
- changelog or release notes when behavior changes matter

The more sensitive the product, the more explicit the trust surfaces should be.

## Admin and Internal Tools

Admin surfaces are production surfaces:

- role-based access
- audit logs
- destructive action confirmation
- impersonation controls when present
- search and filtering that do not leak unauthorized data
- export controls
- rate limits
- safe defaults
- Storybook or test coverage for critical controls

Never leave admin UX as unstyled "internal only" code when it can affect user
data or business operations.

## Pricing and Billing Truth

For monetized apps:

- pricing page matches checkout
- limits, overages, refunds, trials, renewals, and cancellation are explicit
- tax, currency, and regional limitations are not hidden
- plan comparison is honest
- invoices and receipts are available where expected
- failed payment and downgrade states are designed
- entitlement checks are server-enforced and tested

Do not let marketing copy promise behavior the billing code cannot enforce.

## Content Governance

Create a content inventory:

- route or content item
- owner
- target reader
- source references
- last reviewed
- update trigger
- SEO intent
- legal/compliance sensitivity
- diagrams/visuals
- internal links

For blogs and editorial pages, define a real angle and update cadence. Thin
content damages the product even when the UI looks good.

## Metrics Governance

Tie metrics to decisions:

- what question the metric answers
- what decision it informs
- how it can be gamed
- what privacy risk it creates
- what metric balances it
- who reviews it

Avoid dashboards full of vanity metrics. A perfect web app measures product
truth, not merely activity.

## Final Truth Review

Before launch, ask:

- What would embarrass the product if a domain expert read it?
- What claim would be hard to defend in writing?
- What flow depends on ideal data or perfect user behavior?
- What operational promise has no owner?
- What legal/privacy/security text does not match implementation?
- What hidden admin or support action can harm users?
- What metric could cause the team to make a worse product?

The answer becomes work or an explicit risk, not a footnote.
