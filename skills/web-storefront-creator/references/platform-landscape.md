# Storefront Platform Landscape (verified July 2026)

Scope: solo operator / tiny team, ~1–200 SKUs, existing custom React/Tailwind site. The central question is always: add "buy" without discarding the custom frontend.

## Default picks by business type

| You sell… | Default route | Why |
|---|---|---|
| Digital downloads/licenses, global | Lemon Squeezy or Paddle (SaaS); Gumroad/Payhip (creators) | Merchant of record handles VAT/GST — you never register abroad |
| Handmade physical, custom site, dev-comfortable | Stripe Checkout (few SKUs) or Snipcart/Foxy (real cart) | Keep the React site; add payments only |
| Physical, $0/month, non-technical operator | Square Online free, or Ecwid free (5 products) | Only true $0/mo options |
| Physical, scaling, custom frontend | Shopify Basic $39 + Storefront API | Best ecosystem; keep React UI |
| 1–20 items, lowest total fees | Stripe Payment Links / Embedded Checkout | No monthly, no platform cut |
| Print-on-demand merch | Printful/Printify + Big Cartel or Shopify | POD fulfills; Big Cartel 0% fee |
| Services/consulting | Stripe or Square | MoR platforms (Paddle) BAN services |

## Decision matrix (fees verified mid-2026 — re-check live pricing pages before committing)

| Option | Monthly | Platform take | Processing | Tax handled? | Keeps React site? |
|---|---|---|---|---|---|
| Stripe Checkout/Links/Embedded | $0 | 0% | 2.9%+30¢ US | Calc only (Stripe Tax 0.5%/txn) — YOU file | Yes |
| Snipcart | $0 dev; $20/mo if sales<$1k, else 2% | 2% gross | +gateway (~5% real total) | Calc only | Yes (data-attributes) |
| Foxy.io | tiered | 1%, capped 35¢/25¢ per txn | +gateway | Calc only | Yes |
| Ecwid (Lightspeed) | Free (5 physical products) → paid | 0% | +gateway | Auto on higher tiers | Widget embed |
| Lemon Squeezy | $0 | 5%+50¢ all-in | included | FULL MoR | Yes |
| Paddle | $0 | 5%+50¢ all-in | included | FULL MoR | Yes — but physical goods & services BANNED; approval gate 3–7 days |
| Gumroad | $0 | 10%+50¢ + 2.9%+30¢ ≈ 13% | — | FULL MoR (since Jan 2025) | Overlay only |
| Payhip | Free/$29/$99 | 5%/2%/0% | +gateway | EU+UK VAT only (NOT full MoR) | Embed |
| Shopify Starter | $5 | 5%/sale even with Shopify Payments | +2.9%+30¢ | Shopify Tax | Buy Button only |
| Shopify Basic | $39 ($29 annual) | 0% with Shopify Payments | 2.9%+30¢ | Shopify Tax | Yes via Storefront API |
| Square Online | Free → $49/$149 | 0% | 3.3%+30¢ free tier | Auto | Subdomain/embed |
| Squarespace | $16–$99 | 2% on Basic; 0% Core+ | 2.9%+30¢ | Auto | No (hosted) |
| Wix | Core $29+ required to sell | 0% | ~2.9%+30¢ | Auto (Business+) | No (hosted) |
| BigCommerce | $29–$399 | 0% all plans | processor only | Auto | Yes (headless-capable) |
| Medusa.js / Saleor / Vendure (self-host) | infra ~$2.4–7.2k/yr | 0% | your gateway | you wire it | Yes |
| Swell / Commerce Layer (managed headless) | plan | plan | your gateway | integrations | Yes |
| Big Cartel | Free ≤5 products | 0% | Stripe/PayPal direct | basic | No (hosted) |

## Category notes

**Stripe (payments-only DIY).** 2.9%+30¢ US; intl cards +1.5%, FX +1%, disputes $15. Payment Links now cover subscriptions, trials, upsells, custom domains, quantities — sufficient alone for 1–20 SKUs. Embedded Checkout = Stripe-hosted iframe inside your page (the sweet spot for custom sites). Stripe is NOT a merchant of record: Stripe Tax only calculates; you register and file yourself. Stripe Managed Payments (5%+50¢, MoR inside Stripe, public preview 2026) is closing that gap.

**Embeddable carts.** Snipcart: products as HTML data-attributes; real cost ≈5% including gateway. Foxy: cheaper at volume (1% capped). Ecwid: for non-technical operators; free tier cut to 5 physical products (Sept 2024), no digital on free.

**Merchant of record.** The escape hatch from all sales tax/VAT: platform is the legal seller. Lemon Squeezy was acquired by Stripe (July 2024) — support degraded in 2025; watch Stripe Managed Payments as its successor. Paddle: flat 5%+50¢, best B2B VAT handling, but SaaS/software/games only — physical goods and pure services prohibited, and pre-revenue applications get rejected. Gumroad went full MoR Jan 1 2025 but costs ~13% effective. Payhip is cheap but only handles EU/UK VAT — not a full MoR.

**Hosted platforms.** Shopify Starter ($5) replaced Shopify Lite — 5% fee makes it only for social/link selling. Shopify Basic + Storefront API is the "real store, custom React front" play. Square Online is the only true $0/mo full store. BigCommerce silently force-upgrades your plan at revenue thresholds.

**Headless/open-source.** Honest take: self-hosting Medusa/Saleor/Vendure is over-engineering at <200 SKUs (3-yr TCO $36k–144k counting your time). If you want custom-front + real commerce backend, use Shopify Storefront API or managed headless (Swell). Hydrogen was rebuilt as a framework-agnostic toolkit (React Router v7 + Vite); `@shopify/hydrogen-react` works standalone in plain Next.js.

## Temporal traps (old advice now wrong)

1. Lemon Squeezy is Stripe-owned (Jul 2024); Stripe Managed Payments is the successor MoR.
2. Gumroad became full MoR Jan 1 2025 — "Gumroad doesn't handle VAT" is false now.
3. Shopify Lite/Buy Button ($9) is dead → Starter $5 with 5% transaction fee.
4. Hydrogen is no longer Remix-only; legacy JS Buy SDK superseded.
5. Wix replatformed 2025: must be on Core $29+ to sell at all.
6. Squarespace raised US prices July 2026; Basic still carries a 2% platform fee.
7. Ecwid free tier: 10 → 5 products (Sept 2024), physical only.
8. Etsy Pattern is abandonware — treat as deprecated, build nothing on it.
9. Paddle bans physical goods AND services; budget 1–2 weeks approval.
10. Fees stack: cart/MoR percentages sit ON TOP of processing unless explicitly all-inclusive (only Paddle, Lemon Squeezy, Stripe Managed Payments bundle it).

## Sources
[Stripe pricing](https://stripe.com/pricing) · [Snipcart pricing](https://snipcart.com/pricing) · [Foxy pricing](https://www.foxy.io/pricing/) · [Paddle acceptable use](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle) · [Shopify pricing](https://www.shopify.com/pricing) · [Hydrogen docs](https://shopify.dev/docs/api/hydrogen/latest) · [Medusa vs Saleor vs Vendure](https://u11d.com/blog/medusa-js-vs-saleor-vs-vendure-capabilities-compared-in-2025/)
