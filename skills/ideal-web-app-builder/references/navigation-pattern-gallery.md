# Navigation Pattern Gallery

Load when selecting header/footer inspiration. Sources checked 2026-10-25.
Use this alongside `references/navigation-and-wayfinding.md`; the gallery does
not replace its behavior, content, performance or verification contract.

These are real component titles and URLs, not recommendations to install them.
Observations use public first-party descriptions and exposed usage code. Some
full component sources require a free account; none of the examples below was
interactively audited in this research. Author claims of responsiveness,
theme support or accessibility remain unverified until tested in the target app.
Recheck current source, dependencies and license before copying code.

## Header references from 21st.dev

| Verified example | Useful idea | Adoption limit and checks |
| --- | --- | --- |
| [Tubelight Navbar — Ayushmaan Singh](https://21st.dev/@ayushmxxn/components/tubelight-navbar), published 2025-01-05 | Named URL/icon entries and a clear animated active indicator; description advertises mobile icons, desktop text, light/dark support | Keep unfamiliar route labels visible on mobile. Glow alone cannot identify current location. Verify accessible names, real-route selection, reduced motion and contrast. Avoid adding frosted/glow noise beside expressive art. |
| [Navbar Menu — Manu Arora](https://21st.dev/@manuarora700/components/navbar-menu), published 2024-12-03 | Grouped service links and product summaries in a larger panel | Public description emphasizes hover; usage positions a fixed max-width menu. Add click/keyboard access and a genuine narrow layout. A small studio's four core routes rarely need a product-card megamenu. |
| [Navbar with Dropdowns — Shadcnblocks.com](https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-navbar1), published 2025-01-27 | Centralized logo/menu/mobile-extra content model, desktop dropdown and mobile slide-in | Replace sample destinations and auth pair with the target app's real jobs. Test dialog focus, Escape/return, panel scroll, long labels, theme and touch. A responsive description is not test evidence. |
| [Header 3 — Efferd](https://21st.dev/@efferd/components/header-3), published 2025-10-15 | Deliberate closed/expanded mobile states; description identifies drawer and nested menus | Public demo only instantiates Header; behavioral internals are not exposed. Use nested groups only when the route inventory needs them. Evaluate blur contrast, keyboard, motion and large-text states. |
| [Resizable Navbar — Manu Arora](https://21st.dev/@manuarora700/components/resizable-navbar), published 2025-06-22 | Separate NavBody/MobileNav, explicit open state, closing on link selection | Demo states the component is fixed. Shrinking/floating bars require anchor offsets, no layout jump, whole-word brand, stable targets and 200% text checks. Prefer stable positioning if resizing offers no user benefit. |

## Footer references from 21st.dev

| Verified example | Useful idea | Adoption limit and checks |
| --- | --- | --- |
| [Footer — Efferd](https://21st.dev/@efferd/components/footer), published 2025-08-23 | Responsive navigation groups, social and legal layers in the description | Drop demo spotlight/dot wrappers unless justified. Use real routes/social destinations, theme-safe contrast, predictable narrow group order and practical targets. |
| [Footer 7 — Shadcnblocks.com](https://21st.dev/@shadcnblockscom/components/footer-7), published 2025-05-20 | Logo, menu, social, copyright and legal provide the practical footer inventory | Public usage renders Footer7 without exposing behavior. Verify semantics, long content, keyboard and themes. Do not invent legal or social pages to populate it. |
| [Footer — nevsky118](https://21st.dev/@nevsky118/components/footer), published 2025-01-29 | API centralizes logo, brandName, labelled socialLinks, mainLinks, legalLinks and copyright | A larger inventory needs labelled groups rather than one mainLinks strip. Replace example domains/copyright; labels in the API do not prove rendered accessibility. |
| [Minimal Footer — Efferd](https://21st.dev/@efferd/components/minimal-footer), published 2025-09-12 | Restrained company/resources/social structure fits a small site | Public demo imports Lenis and starts a requestAnimationFrame loop without visible cleanup; the displayed dependency list names only lucide-react. Separate component from demo wrapper. Avoid importing a scrolling engine merely to obtain a footer. |
| [Motion Footer — Hossain Jahed](https://21st.dev/@jahed/components/motion-footer), published 2026-03-30 | An expressive transition can signal completion | Description combines GSAP curtain reveal, magnetic button, marquee, glow, grid and giant type. Treat as a deliberate high-cost option. Prove keyboard reachability, touch/static fallback, reduced motion, short viewport, print and payload; reject spectacle that buries useful links. |

A component's publication date dates the catalog entry, not a security audit or
release guarantee. Avoid copying popularity counters into lasting guidance.

## Current first-party product references

The following observations came from current public markup/content, not an
interactive mobile study. Borrow the organizing principle; scale to the actual
inventory and preserve the target brand.

| Source | Observed pattern | Useful principle and limit |
| --- | --- | --- |
| [Linear](https://linear.app/) | Product/Resources groups plus direct commercial/help routes; labelled Product, Features and Company footer groups | Distinguish primary orientation from deep catalog routes. Its feature inventory does not justify an equally dense small-company menu. |
| [Vercel](https://vercel.com/) | Grouped Products/Resources, direct enterprise/pricing, footer Company and Legal & Trust | Keep utilities discoverable. Do not copy enterprise density or unearned status/trust claims. |
| [Framer](https://www.framer.com/) | Platform/Solutions/Resources lead; extensive labelled footer categories | Group diverse jobs; do not reproduce its enormous sitemap when a small inventory needs three groups. |
| [Stripe](https://stripe.com/) | Products/Solutions/Developers/Resources, pricing/sign-in; distinct Contact sales and Get support | Separate acquisition and customer support. Research fetch redirected to the Japan locale; do not generalize its financial content or regional offer. |
| [Apple](https://www.apple.com/) | Named product families, Support and search | Literal predictable labels reduce interpretation. Desktop catalog density is not a mobile layout recipe. |

## Platform references and source-access limits

- [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
  and [modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  establish different behavior contracts. Examples remain illustrative and need
  assistive-technology verification.
- [web.dev navigation](https://web.dev/learn/html/navigation/) and
  [responsive UI patterns](https://web.dev/learn/design/ui-patterns/) discuss
  landmarks, predictable order and the discovery cost of hidden/overflow links.
- Apple [tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
  and [sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
  were checked using Apple's linked Markdown variants when its HTML required
  JavaScript. Both record 2026-06-08 guidance updates. The tab/toolbar distinction
  separates destinations from commands; do not port a web footer into native UI.
- [Android adaptive navigation](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)
  provides current Material 3 implementation guidance and window/posture-based
  adaptation. The Material component landing pages required JavaScript during
  this research; no unsupported detailed claims were inferred from them.

## Record a selection, not a mood board

For each candidate record source URL/date, observed structure, source-access
limits, audience/platform fit, what to adopt, what to reject, dependency/license
checks, and the target app's keyboard/touch/theme/zoom/performance results.
Explain why the chosen shell makes real destinations easier to find. A polished
preview or fashionable animation is not evidence of that outcome.
