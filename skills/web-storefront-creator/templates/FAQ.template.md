# {{STORE_NAME}} — Deep FAQ

The questions you'll actually have in month three. Dollar figures and thresholds
were verified {{DATE}}; anything tax- or fee-related decays — the "verify at" links
are the living truth. None of this is legal or tax advice.

## Money

**When do I get paid?**
{{PAYMENT_PROVIDER}} deposits to {{BANK_NAME}} (…{{LAST4}}) on a {{PAYOUT_SCHEDULE}}
schedule. Your first-ever payout is slower (7–14 days) — that's a standard
new-account hold, not a problem. Track every payout: {{PROVIDER_DASHBOARD_URL}}/payouts.

**What fees come out of each sale?**
{{FEE_SUMMARY}}. Worked example on {{EXAMPLE_PRODUCT}} at {{EXAMPLE_PRICE}}:
{{EXAMPLE_FEE_BREAKDOWN}} → you keep {{EXAMPLE_NET}}. International cards and
currency conversion add ~1.5% + 1%.

**Can this pay into my personal account?**
As a sole proprietor, yes — the account-holder name must match what you registered
with {{PAYMENT_PROVIDER}}. A separate (free) business checking account is still
strongly recommended: it keeps tax deductions clean and audit risk down. Novo and
Bluevine offer free business checking to sole props.

## Taxes

**Do I owe income tax on this?**
Yes, on profit, from the first dollar — whether or not any form arrives. Net profit
over $400/year also triggers ~15.3% self-employment tax. Rule of thumb: move
25–30% of profit into a separate savings bucket as it comes in, and pay quarterly
estimates (IRS Form 1040-ES) if you'll owe $1,000+ for the year.

**What's a 1099-K and will I get one?**
A form processors send you (and the IRS) summarizing your card volume. Current
federal threshold: **$20,000 AND 200 transactions** (reverted July 2025; the "$600
rule" you may have read about is dead). Some states use lower thresholds. Not
receiving one changes nothing about what you owe.
Verify: irs.gov/businesses/understanding-your-form-1099-k

**Do I collect sales tax?**
- Your own website: collect for **{{HOME_STATE}}** (you're registered: {{PERMIT_INFO}}).
  Other states only matter once you pass ~$100k of sales INTO one of them.
- Etsy/eBay/Amazon: the marketplace collects and remits for you by law.
- {{TAX_TOOL_NOTE, e.g. Stripe Tax is enabled and calculates automatically; filing
  is still yours — see dashboard.stripe.com/tax}}

## Orders, refunds, disputes

**A customer wants a refund.**
Refund promptly from {{PROVIDER_DASHBOARD_URL}}/payments → find the payment → Refund.
A refund costs nothing extra. Slow-walking it risks a chargeback, which costs $15
even if you win — a refund is almost always cheaper than a fight.

**A customer filed a chargeback ("dispute").**
You'll get an email + it appears at {{PROVIDER_DASHBOARD_URL}}/disputes. You have a
deadline (~7–21 days). Counter-evidence: tracking showing delivery, your policy
pages, any customer correspondence. Since June 2025 Stripe charges $15 per dispute
plus $15 more to contest (refunded if you win) — contest only when you have real
evidence, e.g. proof of delivery.

**A package is lost.**
Reship or refund — eat the cost, keep the customer. For orders over
{{INSURANCE_THRESHOLD}}, shipping insurance is worth it. Your legal floor: the FTC
rule requires shipping within your stated window (or 30 days) and prompt refunds
when you can't.

**How long do I legally have to ship?**
Whatever your product page/shipping policy states — or 30 days if unstated. If
you'll miss it, you must notify the buyer with a new date and offer a cancel/refund.

## The website & catalog

**The site shows the old price after I synced.**
Almost always cache. Hard-refresh (Cmd+Shift+R). Still wrong after
{{DEPLOY_TIME}}? {{CACHE_FIX_COMMAND_OR_NOTE}}.

**The sync printed an error.**
Errors stop the run cleanly — nothing half-applies. Read the message: it names the
file and line (usually a typo in catalog.json — a missing comma or quotes). Fix,
re-run `{{VALIDATE_COMMAND}}` until `0 errors`, then sync again. Re-running is
always safe: it's built to be idempotent (applying twice = applying once).

**What happens at zero stock?**
The site shows sold out and checkout blocks the item; the Google/Instagram feed
flips to out-of-stock at its next fetch. Note: {{PAYMENT_PROVIDER}} itself doesn't
know your stock — the catalog is the source of truth, so keep it current.

**Can I edit products from my phone / a spreadsheet?**
The catalog is a text file, so: {{EDIT_WORKFLOW_NOTE, e.g. yes via GitHub's web
editor — bookmark the file; validation runs automatically on save}}.

**How do I pause the store for vacation?**
{{VACATION_PROCEDURE, e.g. set every product's inventory to 0, or flip the site's
"vacation" banner setting; Etsy has Shop → Settings → Vacation Mode}}.

**What's selling? Where do I see totals?**
{{PROVIDER_DASHBOARD_URL}} home shows volume; /payments lists every sale with the
product name. Month-end: {{REPORTING_NOTE}}.

## Marketplaces & feeds

**How do Google and Instagram get my products?**
Your site publishes a product feed at {{FEED_URL}}; Google Merchant Center and Meta
Commerce Manager re-fetch it daily. New products appear within ~a day of syncing.
Instagram/Facebook shops link customers OUT to your site to pay (Meta removed
in-app checkout in 2025) — that's normal.

**A product got "disapproved" in Google Merchant Center.**
Open the product in Merchant Center; the reason is listed. Usual suspects: price
on site ≠ price in feed (sync, then wait a fetch cycle), missing shipping settings,
or image quality. Fix and request re-review.

**My Etsy listing and website stock disagree.**
{{CROSSLIST_SYNC_NOTE, e.g. Sellbrite syncs both within minutes; if they diverge,
trust the LOWER number and correct the other channel immediately}}.

## Disasters

**What if I lose access to {{PAYMENT_PROVIDER}} / the domain lapses / the host dies?**
- Credentials + 2FA backup codes live in {{PASSWORD_MANAGER}}.
- Domain renews {{RENEWAL_DATE}} at {{DOMAIN_REGISTRAR}} — auto-renew is ON; keep the card current.
- The catalog and the whole site are in git ({{REPO_URL}}) — the store can be
  rebuilt on any host from that repo in an afternoon.
- Payout bank changes: {{PROVIDER_DASHBOARD_URL}}/settings → payout details.

**Who do I call when it's beyond these docs?**
{{SUPPORT_CONTACT}} — expect {{SUPPORT_TERMS}}. For tax questions: a CPA, once a
year, is cheaper than the mistake.
