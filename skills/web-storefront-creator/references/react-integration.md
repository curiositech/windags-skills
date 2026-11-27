# Integrating Checkout into React + Tailwind + Radix/shadcn (verified July 2026)

Goal: the store looks like the site, not like a bolted-on widget, while card data never touches your DOM (SAQ-A PCI scope).

## Decision table

| Need | Pick |
|---|---|
| Few products, own product UI, minimal backend | Stripe **Embedded Checkout** (`ui_mode: 'embedded'`) — on your domain, iframe, SAQ-A |
| Full brand control of the payment form | Stripe **Payment Element** — full Appearance API; needs webhooks + return page |
| Real inventory/tax/fulfillment backend | Shopify **Cart API** (Storefront GraphQL) + `@shopify/hydrogen-react` → redirect to `cart.checkoutUrl` |
| Fastest embed, no server at all | **Snipcart** (data-attributes) or Shopify Buy Button |

## Stripe in React

Packages: `@stripe/react-stripe-js`, `@stripe/stripe-js`. All three modes (hosted redirect, Embedded Checkout, Payment Element) keep SAQ-A — card fields are Stripe-served iframes.

Embedded Checkout (the small-site sweet spot):

```jsx
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const fetchClientSecret = useCallback(() =>
  fetch("/api/create-checkout-session", { method: "POST" })
    .then(r => r.json()).then(d => d.clientSecret), []);

<EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
  <EmbeddedCheckout />
</EmbeddedCheckoutProvider>
```

Server side (secret key never leaves the server):

```js
stripe.checkout.sessions.create({
  ui_mode: "embedded", mode: "payment",
  line_items: [{ price: priceIdFromLookupKey, quantity: 1 }],
  automatic_tax: { enabled: true },
  return_url: `${DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
});
```

Resolve prices by `lookup_key` server-side (`GET /v1/prices?lookup_keys[]=sku`), never hardcode `price_xxx` IDs — see catalog-inventory.md.

### Theming: the token bridge

Iframes can't inherit your CSS. Resolve Tailwind/Radix tokens to concrete values at runtime and feed the Appearance API:

```js
const css = getComputedStyle(document.documentElement);
const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: resolveToHex(css.getPropertyValue("--primary")), // HEX ONLY — color vars reject rgba() and var()
    colorBackground: resolveToHex(css.getPropertyValue("--background")),
    fontFamily: css.getPropertyValue("--font-body") || "system-ui, sans-serif",
    fontSizeBase: "16px",       // <16px triggers iOS input zoom
    borderRadius: css.getPropertyValue("--radius") || "6px",
  },
  rules: { ".Input": { padding: "12px" }, ".Input:focus": { boxShadow: "0 0 0 2px var(--colorPrimary)" } },
};
```

Re-initialize on dark-mode toggle. Payment Element theming is JS-only; no external CSS reaches it.

## Shopify in React

**The Checkout API was permanently retired April 1, 2025.** Any tutorial using `checkoutCreate` is stale. The flow is: build a Cart via Storefront GraphQL → redirect to `cart.checkoutUrl`.

- `@shopify/hydrogen-react` is framework-agnostic (components/hooks + Storefront client, zero visual styles) and works in plain Next.js — you do NOT need Hydrogen/Oxygen/React Router.
- Auth: install the Headless sales channel; public token is client-safe, private token server-only. Header: `X-Shopify-Storefront-Access-Token`.
- `cartCreate` / `cartLinesAdd` (≤250 lines/call); persist `cart.id` in localStorage; expired carts re-query as `null` → recreate.
- GraphQL returns **HTTP 200 with `userErrors`** — always branch on `userErrors`, not just transport errors.

## Snipcart

One script + settings object; any element becomes purchasable via `data-item-*` attributes (`id, name, price, url, image` required — Snipcart crawls `url` to validate the price, which is its anti-tamper mechanism). Theme via CSS custom properties on `#snipcart`:

```css
#snipcart {
  --color-buttonPrimary: var(--primary);
  --bgColor-default: var(--background);
  --borderRadius-md: var(--radius);
}
```

Next.js App Router: import Snipcart's default CSS in `layout.tsx` (nothing renders without it); runtime theming in a client component after the `snipcart.ready` event.

## Cart state

- Platform-managed (Shopify Cart, Snipcart) or local. Local: Zustand + `persist` (localStorage).
- **Hydration**: localStorage is client-only → SSR renders an empty cart, client re-renders full → hydration error. Fix with `useSyncExternalStore` declaring a server snapshot (`() => 0`), not the mounted-boolean hack.
- Optimistic updates: React 19 `useOptimistic` for simple carts; TanStack Query mutation rollback (`onMutate` snapshot → `onError` restore → `onSettled` invalidate) for server-synced carts.
- Mount all cart widgets in `"use client"` components / `useEffect` — never in server components.

## Design blending (shadcn/Radix)

| Piece | Primitive |
|---|---|
| Product card | shadcn Card; Add-to-Cart in CardFooter |
| Variant selector | Radix ToggleGroup (keyboard nav, `aria-pressed`, disabled = out of stock) |
| Quantity stepper | ARIA `spinbutton` pattern (e.g. ReUI Number Field) — min/max/step, arrow keys |
| Price display | `Intl.NumberFormat` (or hydrogen-react `useMoney`); reserve width so variant switches don't shift layout |

## Product pages & SEO

- Catalog-as-code (JSON/MDX) → SSG/ISR beats client-side fetching for LCP and indexing.
- Set `metadataBase` in the root layout or OG images 404 in production.
- JSON-LD Product schema goes in a **native `<script type="application/ld+json">`** (not `next/script` — it's data, not a script). Escape `<` as `<` to prevent XSS.
- Readable slugs (`/shop/lavender-field-candle`), `next/image` with alt + reserved dimensions.

## Pitfalls

- **Webhooks (Next.js Route Handler)**: `const body = await req.text()` — parsing JSON first corrupts the Stripe signature. `export const runtime = 'nodejs'` (Edge breaks `constructEvent`). Dedupe on `event.id` (Stripe retries ~48h). On Cloudflare Workers use `constructEventAsync()` (Web Crypto).
- **CSP**: minimum for Stripe: `script-src 'self' js.stripe.com; frame-src js.stripe.com hooks.stripe.com; connect-src api.stripe.com`. Test Apple Pay/Google Pay — they add frames. `next/script` CSP nonces require dynamic rendering; SSG pages need hash-based CSP.
- **Keys**: only the publishable key gets `NEXT_PUBLIC_`; secret key + webhook secret are server-only; pin `apiVersion`.
- **PCI 4.0.1** (since Mar 31 2025): even on SAQ-A you owe Req 6.4.3 (script inventory on payment pages) and 11.6.1 (tamper detection; N/A for full redirects, applies to iframes). Any analytics script on the pay page is in scope.

## Sources
[Stripe Embedded Checkout](https://docs.stripe.com/checkout/embedded/quickstart) · [Appearance API](https://docs.stripe.com/elements/appearance-api) · [Shopify cart management](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage) · [hydrogen-react](https://www.npmjs.com/package/@shopify/hydrogen-react) · [Snipcart customization](https://docs.snipcart.com/v3/setup/customization) · [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
