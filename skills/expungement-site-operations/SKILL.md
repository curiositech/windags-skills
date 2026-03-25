---
license: Apache-2.0
name: expungement-site-operations
description: Operationalizing an expungement website — user intake flows, document generation pipelines, court filing integrations, payment processing, state-by-state workflow variations, customer support for sensitive populations, and the handoff between automated systems and human legal review. Activate on 'expungement operations', 'legal tech SaaS', 'court filing integration', 'document automation pipeline', 'expungement business', 'legal service workflow', 'multi-state legal operations'. NOT for expungement law itself (use national-expungement-expert), web design (use legal-tech-web-design), or legal document drafting (use recovery-app-legal-terms).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Legal Tech & Operations
  tags:
    - expungement
    - legal-tech
    - saas-operations
    - document-automation
    - court-filing
    - multi-state
  pairs-with:
    - skill: national-expungement-expert
      reason: Substantive expungement law that drives eligibility logic and form requirements
    - skill: legal-tech-web-design
      reason: Frontend design patterns for intake flows and dashboards
    - skill: document-generation-pdf
      reason: PDF generation for court-ready petition documents
    - skill: remote-legal-hiring
      reason: Staffing decisions for multi-state legal document preparation
category: Legal & Compliance
tags:
  - expungement
  - operations
  - legal-tech
  - website
  - automation
---

# Expungement Site Operations

Building and operating the full tech stack for legal services that help people clear criminal records — from user intake through petition filing and record verification.

## DECISION POINTS

### Document Platform Selection Matrix

**Volume < 100 petitions/month:**
→ If budget < $500/mo AND team has no dev capacity: Use Afterpattern ($79-299/mo)
→ If budget < $1000/mo AND need court form templates: Use Gavel ($99-399/mo)
→ If nonprofit/legal aid: Use Afterpattern with nonprofit discount

**Volume 100-500 petitions/month:**
→ If < 5 states AND simple forms: Use Gavel with custom integrations
→ If > 5 states OR complex logic needed: Build custom PDF generation
→ If enterprise compliance required: Use HotDocs with API integration

**Volume > 500 petitions/month:**
→ Always build custom document generation pipeline
→ If scaling rapidly: Hybrid approach (Gavel for complex states, custom for simple)

### Payment Fraud Escalation Triggers

**Auto-approve if:**
→ Payment amount < $300 AND known device fingerprint AND US billing address

**Flag for review if:**
→ Payment > $1000 OR international card OR VPN detected OR velocity > 3 payments/hour

**Auto-decline if:**
→ Card from blocked BIN list OR billing zip mismatch > 200 miles from IP OR previous chargeback

**Escalate to attorney if:**
→ User claims identity theft on own record OR payment disputes eligibility determination

### Attorney Review Assignment Logic

**Auto-assign based on:**
→ If CA case: Assign to CA-barred attorney with lowest current caseload
→ If felony OR multi-count: Assign to senior attorney (2+ years expungement experience)
→ If standard misdemeanor: Round-robin to any licensed attorney in that state
→ If holiday/weekend: Queue for next business day unless expedite fee paid

### State Expansion Prioritization

**Tier 1 (Launch immediately):**
→ If Clean Slate law exists AND e-filing available AND > 100k criminal records: Launch within 90 days
→ Examples: PA, NJ, MI, CT

**Tier 2 (Launch within 6 months):**
→ If large population AND straightforward petition process: CA, TX, FL, NY
→ Skip if no e-filing AND county-by-county variations > 50 different form sets

**Tier 3 (Launch only if strategic):**
→ Small states with simple processes for market completeness
→ Complex states only if revenue potential > $100k annually

## FAILURE MODES

### Schema Bloat Anti-Pattern
**Symptoms:** Intake form has > 40 fields, completion rate < 60%, users abandoning mid-flow
**Detection Rule:** If form completion time > 15 minutes OR completion rate drops below 70%
**Fix:** Split intake into progressive disclosure: basic info → eligibility check → detailed info only if eligible

### Rubber Stamp Review Anti-Pattern  
**Symptoms:** Attorney review SLA always met but filing rejection rate > 5%
**Detection Rule:** If average review time < 3 minutes per case AND rejection rate increasing
**Fix:** Implement spot-check quality audits, add complexity-based time minimums, retrain attorneys

### Payment Plan Abandonment Anti-Pattern
**Symptoms:** 40%+ of payment plan users default after first payment
**Detection Rule:** If payment plan default rate > 25% within first 60 days
**Fix:** Require income verification, lower payment amounts, add SMS payment reminders

### State Rules Drift Anti-Pattern
**Symptoms:** Eligible users getting denied, ineligible users getting through, form rejections increasing
**Detection Rule:** If eligibility accuracy drops below 95% OR form acceptance rate below 97%
**Fix:** Quarterly rule audits, automated form validation, state law change monitoring

### Background Check Limbo Anti-Pattern
**Symptoms:** Users reporting records still showing up 6+ months after court order
**Detection Rule:** If post-order clearance rate < 80% at 90 days
**Fix:** Automated dispute letter generation, partnership with background check companies, proactive monitoring

## WORKED EXAMPLES

### Example 1: California Misdemeanor Case (Standard Path)

**User Input:**
- Name: Sarah Johnson, DOB: 1985-03-15, County: Los Angeles
- Offense: PC 484(a) Petty Theft, convicted 2019-05-20
- Sentence: 2 years probation, completed 2021-06-01

**Eligibility Engine Decision:**
```
Check CA PC 1203.4 requirements:
- Probation completed? YES (2021-06-01)
- State prison sentence? NO (probation only)  
- Current charges pending? NO
- Sex offense under PC 290? NO
Result: ELIGIBLE for PC 1203.4 expungement
```

**Document Generation Flow:**
1. System generates LA County Superior Court CR-180 form
2. Populates case number (auto-lookup from LA County records API)
3. Creates declaration under PC 1203.4(a)(1) - standard misdemeanor path
4. Generates proof of service (RA-010 form)

**Attorney Review (3 minutes):**
- Verifies probation completion date matches court records
- Confirms no disqualifying factors
- Reviews auto-generated legal arguments - standard template applies
- E-signs petition

**Filing & Outcome:**
- E-filed through LA County's CaseAnywhere system
- Filing fee: $150 (auto-collected via Stripe)
- Status: Granted without hearing (85% of LA County PC 1203.4 cases)
- Timeline: 14 days from payment to order

**What novice would miss:** Checking if case was originally a felony reduced to misdemeanor (different form required)
**What expert catches:** Verifies disposition code to ensure it was straight misdemeanor, not reduced felony

### Example 2: Pennsylvania Multi-Count Case (Complex Path)

**User Input:**
- Multiple arrests: DUI (2018), Retail Theft (2019), Possession (2020)
- Clean Slate already sealed possession charge automatically
- DUI ineligible (vehicle code exclusion)
- Retail theft petition-eligible

**Decision Tree Navigation:**
```
Check PA Clean Slate coverage:
- Possession charge: Auto-sealed (no action needed)
- DUI: Vehicle code violation (ineligible for expungement)
- Retail Theft: Grade M2, 5+ years old, petition-eligible

Result: Explain Clean Slate coverage, offer petition for retail theft only, 
        clarify DUI cannot be sealed
```

**Trade-off Analysis:**
- **Speed:** Could auto-approve retail theft petition (simple M2)
- **Cost:** Single charge = lower fee, but user needs education about DUI
- **Automation:** Mixed result requires human explanation, not just auto-approval

**Attorney Review Decision:**
- Reviews Clean Slate determination (correct)
- Explains why DUI cannot be sealed (ARD completion doesn't qualify)
- Proceeds with retail theft petition only
- Documents partial case resolution in notes

**Outcome:** User proceeds understanding limitations, saves money vs. paying for impossible DUI petition

### Example 3: Texas Seal vs. Expunge Confusion (Error Recovery)

**User Input:**
- Arrest 2015, charges dismissed
- Believes they need "expungement"
- Actually qualifies for nondisclosure (sealing) only

**Initial Error Path:**
- User selects "expungement" service tier ($799)
- Intake flow doesn't catch dismissed vs. convicted distinction
- Payment processed before eligibility review

**Error Detection:**
- Attorney review catches: dismissed charges = nondisclosure eligible, not expungement
- Texas expungement requires acquittal or case dismissal with prejudice
- This case: dismissal without prejudice = sealing only

**Recovery Decision Matrix:**
```
If user wants refund: Full refund, explain difference
If user wants to proceed: 
  - Convert to nondisclosure petition
  - Price adjustment ($799 to $599)
  - Credit difference to user account
If user wants both services:
  - Nondisclosure now, expungement later if re-arrested
  - Explain 2-step process, timeline
```

**Prevention Implementation:**
- Add TX-specific intake branching: "Were you convicted or were charges dismissed?"
- Modify pricing display: Show both options upfront for TX users
- Update eligibility engine with TX-specific dismissed charge logic

## QUALITY GATES

**Pre-Filing Validation Checklist:**
- [ ] User identity verified with government ID upload
- [ ] All required court case numbers obtained and validated
- [ ] State-specific waiting periods satisfied (auto-calculated from conviction/completion dates)
- [ ] Filing fees collected and held in trust account
- [ ] Licensed attorney in correct state assigned and review completed
- [ ] Generated documents pass automated validation (required fields, signature blocks, formatting)
- [ ] Court-specific e-filing requirements met (file formats, naming conventions, cover sheets)
- [ ] User communication preferences set (SMS, email, dashboard notifications)

**Document Accuracy Acceptance Criteria:**
- [ ] Petitioner name exactly matches court records (including middle names, suffixes)
- [ ] Case numbers valid and match jurisdiction (verified via court record lookup)
- [ ] Offense codes and descriptions match criminal code citations
- [ ] Disposition dates and sentence details accurate per court records
- [ ] Attorney signature block contains correct bar number and jurisdiction
- [ ] Filing attachments complete per local court rules (proof of service, supporting declarations)
- [ ] PDF accessibility compliance met (for courts requiring ADA compliance)
- [ ] File size under court limits (typically 10MB per document)

**Payment Processing Validation:**
- [ ] Payment amount matches quoted fee breakdown (attorney fees + court costs)
- [ ] Trust accounting separation maintained (client funds vs. operating funds)
- [ ] Payment plan terms clearly disclosed and user consent obtained
- [ ] Refund policy explained and acknowledged by user
- [ ] Court filing fees separately itemized and collected

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**

**Expungement Law Research** → Use `national-expungement-expert` instead
- Eligibility determinations requiring statute interpretation
- Case law research for novel legal arguments  
- State law change monitoring and analysis

**Website UI/UX Design** → Use `legal-tech-web-design` instead
- User interface design for intake forms
- Dashboard layout and user experience optimization
- Mobile-responsive design patterns

**Legal Document Drafting** → Use `recovery-app-legal-terms` instead
- Terms of service and privacy policy creation
- Attorney-client engagement agreements
- Liability limitation clauses

**Payment Gateway Technical Implementation** → Use `saas-architect` instead
- Stripe API integration code
- PCI compliance implementation
- Database schema for payment processing

**Attorney Hiring and Management** → Use `remote-legal-hiring` instead
- Recruiting attorneys licensed in specific states
- Attorney performance evaluation criteria
- Legal staff compensation structures

**General SaaS Operations** → Use `saas-architect` instead  
- Infrastructure scaling and deployment
- Database optimization and caching
- API design and rate limiting