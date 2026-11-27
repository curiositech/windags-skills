# Payments, Banking, and Tax for Small Sellers (US-focused, verified July 2026)

Not legal or tax advice — numbers verified against primary sources as of July 2026; confirm with a CPA before relying on them.

## "Just starting? Do exactly this"

1. Get a free EIN at irs.gov/ein — keeps your SSN off business paperwork (Stripe will still verify your personal identity with SSN; that's normal KYC).
2. Open free business checking: **Novo** or **Bluevine** (both accept sole proprietors; **Mercury does NOT** — it requires incorporation). Route all store money through it.
3. If the store name isn't your legal name, register a **DBA** first — the bank needs it.
4. Use **hosted checkout** (Stripe Checkout/Elements, Square, Shopify Payments) → PCI **SAQ A**, near-zero compliance work. Never build a custom card form.
5. Register for a sales tax permit in your **home state only**; collect there from day one. Ignore other states until ~$100k of sales into one of them.
6. On Etsy/eBay/Amazon, marketplace facilitator laws mean **they** collect and remit sales tax; your own storefront is your responsibility.
7. Set aside **25–30% of profit** for income + self-employment tax; pay quarterly estimates (1040-ES) if you'll owe $1,000+.
8. Publish policy pages: Shipping, Refund/Return, Terms, Privacy. Honor the FTC 30-day shipping rule.
9. Escape hatch: a **merchant of record** (Paddle, Lemon Squeezy) becomes the legal seller and handles ALL sales tax/VAT for ~5%+50¢ — best for digital goods.

## Processor onboarding as an individual / sole proprietor

- **Stripe**: business type "Individual/Sole Proprietor." EIN optional; SSN/ITIN used for personal identity verification regardless (last-4 at onboarding; full SSN required at $500k lifetime volume). Personal checking works for payouts **if the account-holder name matches**; no debit cards/wallets as payout targets. New accounts get an initial payout hold; then daily/weekly/monthly schedule. Stripe never forces incorporation.
- **Square**: sole props onboard directly. In-person 2.6%+10¢, online 2.9%+30¢, no monthly fee.
- **PayPal**: ~2.29%–3.49%+49¢ depending on product; $20 chargebacks.
- **Shopify Payments**: sole props fine; needs matching legal/bank details + 2FA; ~2.9%+30¢ on Basic; $15 chargebacks.

## Banking

A sole prop can legally use personal checking, but a separate account protects deductions, audit posture, and any future liability shield. Novo ($0/mo, tax "Reserves" envelopes, Stripe/Shopify integrations, no cash deposits), Bluevine ($0/mo, interest-bearing, accepts cash), credit unions for cash-heavy/local. All fintechs FDIC-insured via partner banks.

## Income tax (the numbers that keep changing)

- **1099-K: reverted to $20,000 AND 200 transactions** (both required) by OBBBA, signed July 4, 2025, retroactive to 2022. The "$600 rule" and the interim $5,000 (2024) / $2,500 (2025) thresholds are DEAD. Income is taxable whether or not a 1099-K arrives; some states have lower thresholds.
- 1099-NEC/MISC threshold rises $600 → **$2,000 for tax year 2026** (indexed after).
- **Self-employment tax: 15.3%** on 92.35% of net profit; deduct half of it. $400 of net profit triggers a filing requirement. Schedule C + Schedule SE.
- Quarterly estimates due ~Apr 15 / Jun 15 / Sep 15 / Jan 15 if you'll owe $1,000+.
- Hobby vs business: IRS 9-factor profit-motive test (Treas. Reg. §1.183-2). Hobby = no expense deductions.

## Sales tax

- **Home state = physical nexus**: register and collect from day one.
- **Economic nexus** elsewhere: typically $100k/year into that state (CA/TX/NY: $500k). The 200-transaction prong is being dropped state by state (AK 2025, UT Jul 2025, IL Jan 2026) — a tiny seller usually only collects home-state.
- **Marketplace facilitator laws**: all 46 sales-tax states + DC make Amazon/eBay/Etsy collect and remit for marketplace sales. Your own-site sales stay yours.
- Software: **Stripe Tax** 0.5%/txn no-code ($0.50/txn API), Tax Complete $90/mo for registration+filing; **TaxJar** $39–99/mo + AutoFile $50–55/filing (2026 price hike); **Avalara** quote-only, $1000s/yr — overkill under ~$5M.

## Merchant of record

MoR = legal seller: remits sales tax/VAT/GST in 200+ jurisdictions, absorbs chargeback liability, pays you net. Best for digital/SaaS. **Paddle** flat 5%+50¢ all-in, deepest tax coverage, but manual approval (3–7 days, rejects pre-revenue) and bans physical goods/services. **Lemon Squeezy** 5%+50¢ headline but add-ons stack (+1.5% international, +1.5% PayPal, payout fees) → 10–18% effective; Stripe-owned since Jul 2024, support degraded; Stripe **Managed Payments** is the successor. International reality: EU/UK VAT has no de-minimis for digital sales; Canada GST at CAD $30k; Australia at AUD $75k — MoR is the standard way a solo seller avoids all of it.

## Chargebacks & PCI

- **Stripe (since June 17, 2025)**: $15 dispute fee always; contesting adds $15 (refunded if you win) — losing a contested dispute costs $30. Cheapest prevention: refund fast before it becomes a dispute ($0). Chargeback Protection 0.4%/txn covers fraud only.
- **PCI**: hosted checkout (Stripe Checkout/Elements iframes) → **SAQ A**. PCI 4.0.1 (Mar 31, 2025) added 6.4.3 script inventory + 11.6.1 tamper detection; full-redirect sellers mark 11.6.1 N/A. Custom card forms → SAQ D — never do this.

## Policy pages / FTC

16 CFR Part 435 (Mail/Internet Order Rule): ship within the advertised window or 30 days, measured at shipment; delays require notice + cancel/refund rights; refunds must be prompt. Penalties ~$40k+/violation. Publish Shipping, Refund/Return, Terms, Privacy (CCPA/CPRA make privacy effectively mandatory) + real contact info.

## Temporal traps
1. The 1099-K "$600 rule" is dead — $20k AND 200 txns (OBBBA, Jul 2025, retroactive).
2. "Always dispute chargebacks, it's a flat $15" — wrong since Jun 2025; losing costs $30.
3. "SAQ A means literally nothing to do" — 6.4.3/11.6.1 apply since Mar 2025.
4. Mercury no longer serves sole proprietors — old "best free banking" lists are wrong.
5. 200-transaction nexus prongs are vanishing state by state.
6. TaxJar AutoFile ~doubled to $50–55/filing in 2026.

## Sources
[IRS 1099-K/OBBBA FAQ](https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000) · [IRS SE tax](https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes) · [Stripe verification requirements](https://docs.stripe.com/connect/required-verification-information) · [Sales Tax Institute nexus chart](https://www.salestaxinstitute.com/resources/economic-nexus-state-guide) · [Avalara facilitator guide](https://www.avalara.com/us/en/learn/guides/state-by-state-guide-to-marketplace-facilitator-laws.html) · [Stripe PCI guide](https://stripe.com/guides/pci-compliance) · [FTC Mail Order Rule](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule)
