# SKUs, Prices, and Inventory as Code (verified July 2026)

The architecture this skill ships: `catalog.json` in git is the single source of truth; idempotent scripts sync it outward to Stripe, the website, and marketplace feeds. Humans edit one file; machines fan it out.

## Load-bearing facts

1. **Stripe Prices are immutable.** Only `metadata`, `nickname`, `active`, `lookup_key` are editable after creation. To change an amount: create a new Price with `transfer_lookup_key=true` (atomically moves the stable handle), then archive the old one (`active=false`). Prices can never be deleted, only archived.
2. **`lookup_key` is your only stable price handle.** Code and checkout sessions resolve prices by lookup_key; never hardcode `price_xxx` IDs.
3. **Archiving a Price deactivates its Payment Links.** Links bind to the raw price ID, not the lookup_key — after any reprice, regenerate affected Payment Links (or create links with inline `price_data`, supported since API version 2025-07-30).
4. **Stripe has zero inventory awareness** — it will happily charge past sellout. Stock lives in your system; gate it at Checkout Session creation, use `expires_at` + the `checkout.session.expired` webhook to release reservations.
5. **SKU ≠ GTIN.** SKU is your internal, permanent, human-readable ID. GTIN/UPC is the GS1-registered global barcode, required by Google Shopping/Amazon/Walmart (or declare `identifier_exists=false` / get a GTIN exemption). Internal barcodes can be Code-128 of your own SKU — no GS1 membership needed until you sell into retail.

## SKU design

Scheme: `CATEGORY-STYLE-VARIANT` (broad → specific), e.g. `CNDL-LAV-8OZ`, `TSH-CLSC-RED-M`.

- Uppercase alphanumeric with dashes; 3–4 letter codes.
- Avoid homoglyphs (I/l/1, O/0) and characters that break Excel/ERPs (`/ $ @`); no leading zeros.
- One SKU per **real physical variant** (size×color you stock separately). Price tiers and promos are NOT variants.
- Never embed supplier codes or warehouse locations in the SKU — those change; SKUs don't.
- SKUs must match **exactly** (case, spelling) across every channel or cross-channel inventory sync breaks.
- Never reuse a retired SKU; set `active: false` instead of deleting (order history references it).

Platform variant models: Stripe has NO variant object (each variant = its own Product+Price, SKU in `metadata`). Shopify: Product → up to 100 ProductVariants, with SEPARATE `sku` and `barcode` (GTIN) fields — a variant missing a required GTIN silently drops out of Google Shopping feeds. Etsy: Listing → Inventory → `products[]` with up to 3 variations; **inventory updates are full-replacement** — send the entire `products[]` array or you silently delete the other variations.

## The sync pattern (what sync_stripe.py implements)

Declarative desired-state, Terraform-style: validate schema → fetch remote → **join on lookup_key/metadata.sku** (never positional or by ID) → diff → dry-run review gate → apply with deterministic idempotency keys → archive-not-delete. Every step re-runnable: remote writes are non-transactional, so a crashed run must be resumable by simply re-running.

- Idempotency-Key on every mutating POST (Stripe caches results 24h; same key + different params = error, so derive keys from content).
- Back off on 429/5xx.
- `--dry-run` is the default; `--apply` is explicit.
- Test-mode key first (`sk_test_`), always.

## Inventory (<200 SKUs, no platform backend)

- Stock lives in the catalog file (or SQLite if you outgrow it); the repo is truth.
- Decrement inside the `checkout.session.completed` webhook, in a transaction guarded by stored `event.id`s — **webhooks retry for ~48h and WILL deliver duplicates**; a non-idempotent handler double-decrements.
- Deduct at **order placement**, not fulfillment — otherwise the same unit oversells during pick-and-pack.
- Release reservations via `checkout.session.expired`.
- Reconcile periodically against Stripe payments (webhooks are best-effort); resolve disagreements to the LOWER count.
- Low-stock: nightly digest comparing quantity to `low_stock_threshold`.
- Multi-channel: keep a 5–10% safety buffer per channel (bigger for Amazon, which punishes oversell); never list 100% of stock everywhere.

## Discounts & price changes

- Stripe **Coupon** = the discount definition; **Promotion Code** = the customer-facing wrapper (expiry, redemption caps, minimum amount, first-time-only). If a parent Coupon expires or hits its cap, ALL child promotion codes go permanently dead — no reactivation.
- Sales: set `compare_at_cents` in the catalog for strike-through display; the actual charged price is `price_cents` (a reprice = new Stripe Price).
- One Price per currency; coupons take per-currency minimums.
- Scheduled price changes: cron the sync script; the catalog diff does the rest.

## Human editing UX options

| Option | Verdict |
|---|---|
| Edit catalog.json directly (with validate_catalog.py in CI/pre-commit) | Default. Simple, diffable, reviewable |
| Google Sheets → export → validate → JSON | Fine for a non-technical operator; the Sheet is an INPUT, never the system of record |
| Shopify + Matrixify | Only when you're on Shopify; file-based, not real-time |

## Sources
[Stripe: manage products and prices](https://docs.stripe.com/products-prices/manage-prices) · [Prices API](https://docs.stripe.com/api/prices) · [Managing limited inventory](https://docs.stripe.com/payments/checkout/managing-limited-inventory) · [Coupons & promotion codes](https://docs.stripe.com/billing/subscriptions/coupons) · [Stripe idempotency](https://stripe.com/blog/idempotency) · [Shopify ProductVariant](https://shopify.dev/docs/api/admin-rest/latest/resources/product-variant) · [Etsy listings tutorial](https://developer.etsy.com/documentation/tutorials/listings/)
