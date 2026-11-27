# Marketplace Cross-Listing, Programmatically (verified July 2026)

The highest-leverage move: **one canonical Google Shopping-format feed** (build_feed.py generates it) unlocks Google free listings AND Meta catalogs — Meta modeled its spec on Google's and accepts Google Shopping XML directly. Transactional marketplaces (Etsy/eBay/Amazon) each have their own order/inventory lifecycle and need APIs or an aggregator; a feed alone can't drive them.

## Per-channel reality check

| Channel | API difficulty (solo) | Fees | Approval | Verdict |
|---|---|---|---|---|
| Google Merchant Center free listings | Low (host a feed) | $0 | none | **Do first** |
| Meta Shops (FB/IG) | Low (same feed) | $0 (ads separate) | domain verify, hours | **Do early** — but it's a link-out gallery now, NOT in-app checkout |
| Etsy Open API v3 | Medium | $0.20/listing + 6.5% + 3%+25¢ ≈ 10–11% all-in | Personal access ≈ instant (your own shop); Commercial ≈ 1wk–1mo | **Yes** for handmade/craft |
| eBay Sell APIs | Medium-high | ~13.25% + 30¢; 250 free listings/mo | free, immediate | Yes for reach; see API-lock trap |
| Amazon SP-API | High | $39.99/mo Pro + referral + GTIN costs | days–weeks (Pro, Brand Registry/GTIN exemption) | **Skip early**; revisit at scale |
| TikTok Shop | Medium-high | commission | Partner Center + sandbox | Optional; US stable since Jan 2026 (TikTok USDS deal closed) |
| Faire (wholesale B2B) | Low (curated, no real API) | 15% + $10 first-order fee; **Faire Direct = 0%** | days–2 weeks | Yes if wholesale-viable |

## Recommended architecture (three waves)

**Wave 1 — feeds, ~zero cost:** catalog.json → `build_feed.py` → host `/feed.xml` on your site → point Google Merchant Center (Data sources, scheduled fetch) and Meta Commerce Manager (Catalog → Data sources) at the same URL. Verify your domain in Meta Business Settings; every item needs a checkout URL on your own https domain.

**Wave 2 — marketplace selling via aggregator:** Sellbrite (free ≤30 orders/mo) or LitCommerce (~$29/mo) to list on Etsy + eBay. The aggregator handles OAuth, rate limits, inventory sync, and order aggregation — at solo scale this beats maintaining your own marketplace API integrations. Etsy first (cheapest fees, kindest to handmade), eBay second.

**Wave 3 — selective expansion:** Amazon only when volume justifies $39.99/mo + GTIN/Brand Registry work (GTIN exemption possible for unbranded goods, 10 products/request). TikTok Shop if your product suits discovery-driven video. Faire Direct (0% commission) for existing wholesale relationships.

**From day one of Wave 2:** central master inventory, per-channel safety buffers (5–10%, more for Amazon), webhook-first sync with ≤60s polling fallback, reconcile every 5–10 min to the LOWEST count.

## Channel gotchas

- **Meta killed native checkout (Aug–Sep 2025).** Shops are now discovery galleries linking out to your site. Commerce Manager Inbox is gone; only the Purchase pixel event survives. Add UTM tags to outbound links for attribution. Don't architect around in-app checkout.
- **Google Content API for Shopping shuts down Aug 18, 2026** (hard stop). Merchant API v1 is the replacement (v1beta sunset Feb 28, 2026). Feed-based (scheduled fetch / manual / Sheets) integrations are UNAFFECTED — another reason feeds beat APIs at this scale.
- **eBay Inventory-API listings are API-locked** — they cannot be edited in Seller Hub. Going API on eBay is an architectural commitment. Enable Out-of-Stock Control to keep zero-quantity listings alive.
- **Etsy inventory updates are full-replacement** (resend the whole `products[]` array); apps must handle 3 variations by June 1, 2026. Personal API access covers your own shop — you don't need the slow Commercial approval.
- **Etsy/eBay/Amazon collect sales tax for you** (marketplace facilitator laws); your own-site sales remain your responsibility.
- **Shopify Marketplace Connect dropped new Etsy connections in 2025** — don't plan Etsy through it.
- **Amazon retired legacy XML listing APIs (April 2025)** — the JSON Listings API is the only path.
- Feed items without a GTIN must declare `identifier_exists=false` or Google disapproves them.

## Aggregator quick table

| Tool | Pricing | Coverage | Note |
|---|---|---|---|
| Sellbrite (GoDaddy) | Free ≤30 orders/mo, then tiered | Amazon, eBay, Walmart, Etsy, Google | Platform-agnostic; strongest fulfillment |
| LitCommerce | ~$29–44/mo by listings/channels | 20+ marketplaces | Predictable pricing; widest reach |
| Shopify Marketplace Connect | Free ≤50 orders, then 1% capped $99/mo | Amazon, Walmart, Target+, eBay | Requires Shopify; no new Etsy |
| Vela | free/cheap | Etsy/eBay bulk editing | Editor, not a sync engine |
| Zentail | enterprise | many | Overkill solo |

## Sources
[Etsy API essentials](https://developers.etsy.com/documentation/essentials/rate-limits/) · [Etsy fees](https://help.etsy.com/hc/en-us/articles/360035902374) · [eBay Inventory API](https://developer.ebay.com/api-docs/sell/inventory/overview.html) · [Amazon SP-API registration](https://developer-docs.amazon.com/sp-api/docs/sp-api-registration-overview) · [Meta checkout phase-out](https://feedonomics.com/blog/meta-removing-native-checkout/) · [Meta catalog feed fields](https://www.facebook.com/business/help/1205792533104321) · [Content API sunset](https://www.producthero.com/post/google-is-sunsetting-the-content-api-for-shopping-what-you-need-to-know) · [TikTok Shop seller API](https://partner.tiktokshop.com/docv2/page/seller-api-overview) · [Faire fees](https://www.faire.com/how-faire-works) · [Feed spec comparison](https://productfeedspec.com/)
