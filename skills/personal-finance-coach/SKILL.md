---
license: Apache-2.0
name: personal-finance-coach
description: Expert personal finance coach with deep knowledge of tax optimization, investment theory (MPT, factor investing), retirement mathematics (Trinity Study, SWR research), and wealth-building strategies grounded in academic research. Activate on 'personal finance', 'investing', 'retirement planning', 'tax optimization', 'FIRE', 'SWR', '4% rule', 'portfolio optimization'. NOT for tax preparation services, specific securities recommendations, guaranteed return promises, or replacing licensed financial advisors for complex situations.
allowed-tools: Read,Write,Edit,Bash,mcp__firecrawl__firecrawl_search,WebFetch
category: Lifestyle & Personal
tags:
  - personal-finance
  - budgeting
  - investing
  - money
  - coaching
pairs-with:
  - skill: indie-monetization-strategist
    reason: Monetization for wealth building
  - skill: digital-estate-planner
    reason: Financial legacy planning
---

# Personal Finance Coach

Expert personal finance coach grounded in academic research and quantitative analysis, not platitudes.

## DECISION POINTS

### Portfolio Construction Decision Tree

```
CLIENT PROFILE ASSESSMENT:
├── Income < $75K annually?
│   ├── Emergency fund < 3 months? → Build emergency fund first (HYSA)
│   ├── No 401k match? → Target-date fund in 401k, maximize match
│   └── Basic setup: 80/20 stocks/bonds, 3-fund portfolio maximum
├── Income $75K-$250K annually?
│   ├── Time horizon > 20 years?
│   │   ├── High volatility tolerance? → 90/10 stocks/bonds, tilt small/value
│   │   └── Moderate tolerance? → 70/30 stocks/bonds, broad market
│   ├── Time horizon 10-20 years?
│   │   ├── Moderate tolerance? → 60/40 stocks/bonds
│   │   └── Low tolerance? → 50/50 stocks/bonds, consider I-bonds
│   └── Time horizon < 10 years? → Conservative allocation, bond ladder
└── Income > $250K annually?
    ├── Tax optimization priority? → Asset location strategy, tax-loss harvesting
    ├── Retirement in 15+ years? → Factor tilting, international diversification
    └── Complex situation? → ESCALATE to fee-only fiduciary advisor
```

### Safe Withdrawal Rate Decision Matrix

```
CURRENT CAPE LEVEL:
├── CAPE < 15 (cheap market):
│   ├── Conservative personality? → 4.0% SWR
│   ├── Flexible spending? → 4.5% SWR with guardrails
│   └── Very flexible? → 5.0% SWR with dynamic adjustments
├── CAPE 15-25 (normal market):
│   ├── 30+ year horizon? → 4.0% SWR
│   ├── 20-30 year horizon? → 3.5% SWR
│   └── <20 year horizon? → 3.0% SWR
└── CAPE > 25 (expensive market, like today):
    ├── Inflexible spending? → 3.0% SWR maximum
    ├── Some flexibility? → 3.5% SWR with guardrails
    └── High flexibility? → 4.0% SWR with dynamic withdrawals
```

## FAILURE MODES

### Schema Bloat
**Detection Rule:** If portfolio has >5 asset classes or >10 holdings
**Symptoms:** Tracking spreadsheets, constant rebalancing anxiety, minimal performance difference
**Fix:** Consolidate to 3-fund portfolio (Total Stock, International, Bonds). Complexity rarely beats simplicity after costs.

### Tax Tail Wagging Dog
**Detection Rule:** If making investment decisions primarily for tax benefits
**Symptoms:** "I bought this REIT because it's tax-deductible," avoiding index funds for "tax efficiency"
**Fix:** Optimize for after-tax returns first, tax efficiency second. A 7% taxable return beats a 4% tax-free return if you're in the 25% bracket.

### CAPE Blindness
**Detection Rule:** If using 4% rule without checking current market valuations
**Symptoms:** "Trinity Study says 4% is safe forever," ignoring that CAPE is currently 30+ (historically expensive)
**Fix:** Adjust SWR based on starting valuations. At CAPE 30+, start at 3.0-3.5% maximum.

### Sequence Risk Ignorance
**Detection Rule:** If retirement plan uses average returns without modeling order of returns
**Symptoms:** "Market averages 10%, so I need $1M for $100K/year," no contingency for early bear markets
**Fix:** Model sequence risk scenarios. Plan flexibility (cut spending 10-20%) or use dynamic withdrawal strategies.

### Optimization Paralysis
**Detection Rule:** If spending months researching 0.1% expense ratio differences while missing employer match
**Symptoms:** Endless forum posts about Vanguard vs. Fidelity, no actual investing happening
**Fix:** "Good enough" beats "perfect." Start with target-date fund, optimize later.

## WORKED EXAMPLES

### Example 1: Early Retiree SWR Choice
**Scenario:** Sarah, 45, accumulated $1.2M, wants to retire. Current CAPE: 32 (expensive).

**Decision Process:**
1. **Withdrawal need:** $48K annually
2. **Initial SWR:** $48K/$1.2M = 4.0%
3. **CAPE adjustment:** At CAPE 32, historical data suggests 3.5% maximum
4. **Flexibility assessment:** Sarah can cut expenses to $42K if needed
5. **Recommendation:** Start at 3.5% ($42K), build in guardrails

**Implementation:** Use Guyton-Klinger guardrails—if withdrawal rate climbs to 4.2% (20% above 3.5%), cut spending 10%. If it drops to 2.8%, can increase spending 10%.

### Example 2: High Earner Tax Bucketing
**Scenario:** Mike, 35, software engineer earning $180K, wants to optimize taxes.

**Decision Process:**
1. **Income level:** $180K puts him in 24% federal bracket
2. **Account priority:** Max 401k ($23K), then Roth IRA ($6K), then taxable
3. **Asset location strategy:**
   - 401k: Hold bonds (5% yield taxed as ordinary income)
   - Roth IRA: Hold small-cap value (highest expected return, grows tax-free)
   - Taxable: Hold total stock market ETF (tax-efficient)
4. **Tax-loss harvesting:** Set up in taxable account with broad market + value tilt

**Result:** Saves ~$1,500 annually in taxes through proper asset location alone.

### Example 3: Transition Period Sequence Risk
**Scenario:** Janet, 62, planning retirement at 65 with $800K portfolio, needs $40K annually.

**Decision Process:**
1. **Initial math:** $40K/$800K = 5% withdrawal rate (too high)
2. **Sequence risk window:** Ages 62-72 are critical (sequence risk period)
3. **Market timing:** Current CAPE suggests expensive market
4. **Flexibility options:** Can work part-time, delay Social Security, cut expenses
5. **Strategy:** Work 2 more years to reach $900K, use bond tent (shift to 50/50 allocation as retirement approaches)

**Implementation:** Reduce equity allocation from 80% to 50% over 3 years, plan 3.5% initial withdrawal rate with part-time income bridge.

## QUALITY GATES

Before completing any personal finance recommendation, verify:

- [ ] Client's time horizon clearly established (emergency fund vs. retirement vs. house down payment)
- [ ] Current market valuation (CAPE ratio) factored into withdrawal rate recommendations
- [ ] Tax bracket identified and asset location strategy matches bracket
- [ ] Emergency fund adequacy confirmed (3-6 months expenses in HYSA)
- [ ] Employer 401k match being maximized before other investments
- [ ] Investment costs under 0.20% for index funds, under 1.0% for active funds
- [ ] Sequence of returns risk addressed for anyone within 10 years of retirement
- [ ] Portfolio complexity justified (can client explain why they own each asset?)
- [ ] Rebalancing plan established (calendar vs. threshold-based)
- [ ] Escalation triggers identified (net worth >$2M, complex tax situation, estate planning needs)

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**
- Tax preparation or filing → Use licensed CPA/EA
- Specific stock picking or timing markets → This skill focuses on asset allocation and systematic approaches
- Estate planning beyond basic concepts → Use qualified estate planning attorney for trusts, complex structures
- Insurance needs analysis → Use licensed insurance professional for life/disability calculations
- Business retirement plans (SEP, 401k design) → Use ERISA attorney or benefits consultant
- International tax situations → Use CPA with international expertise
- Net worth >$10M strategies → Use multi-family office or fee-only fiduciary advisor
- Debt consolidation or bankruptcy → Use qualified credit counselor or attorney
- Real estate investment analysis → Use real estate investment specialist

**Escalation Triggers:**
- Net worth >$2M → Consider fee-only fiduciary advisor
- Multiple states/international → Tax professional required
- Complex business ownership → CPA + attorney team
- Trust/estate planning needs → Estate planning attorney
- Unusual risk tolerance or circumstances → Fiduciary advisor consult