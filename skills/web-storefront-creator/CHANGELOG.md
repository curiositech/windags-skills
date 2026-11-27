# Changelog

## 2026-11-26

- Added observable stops for preview, sandbox and operator handoff, plus the storefront review checklist.
- Rebuilt Cinder & Pine as a responsive storefront with an original visual collection, filterable catalog and local bag.
- Added authored Tool2Vec requests and separate held-out routing cases.

## 1.0.0 — 2026-07-09

Initial release. Built from a five-track research sweep (platform landscape, React/Tailwind/Radix integration, payments/banking/tax, catalog/inventory systems, marketplace cross-listing), all facts verified against July 2026 sources.

- SKILL.md with route decision tree, 7 anti-patterns, shibboleths, bundle inventory
- Scripts (stdlib-only, all smoke-tested): validate_catalog, sync_stripe (idempotent, archive-and-create repricing), build_feed (Google/Meta), extract_site_style, render_storefront_preview
- Templates: catalog schema + worked example, operator README / deep FAQ / update playbook
- References: platform-landscape, react-integration, payments-banking-tax, catalog-inventory, marketplace-crosslisting, copywriting-product-pages, operator-handoff

Known decay points (re-verify on use): processor fees, 1099-K threshold, sales-tax nexus prongs, Google Merchant API migration (Content API dies 2026-08-18), Lemon Squeezy → Stripe Managed Payments transition.
