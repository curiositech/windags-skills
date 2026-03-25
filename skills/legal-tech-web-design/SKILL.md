---
---
license: Apache-2.0
name: legal-tech-web-design
description: Web design for legal technology products — trust signals, authority indicators, compliance UI patterns, multi-step wizard flows for legal processes, and accessibility for government/legal contexts. Activate on 'legal website design', 'trust signals', 'legal form UX', 'legal wizard flow', 'expungement UI', 'court filing interface', 'legal tech landing page'. NOT for general web design (use web-design-expert), design system tokens (use design-system-creator), or legal document content (use recovery-app-legal-terms).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - legal-tech
    - trust-signals
    - form-ux
    - accessibility
    - wizard-flow
    - compliance-ui
  pairs-with:
    - skill: web-design-expert
      reason: General visual design foundations that legal tech specializes on top of
    - skill: form-validation-architect
      reason: Complex legal form validation with jurisdiction-specific rules
    - skill: design-accessibility-auditor
      reason: WCAG AAA compliance required for government-adjacent legal tech
    - skill: national-expungement-expert
      reason: Domain knowledge for expungement-specific UI flows
category: Legal & Compliance
tags:
  - legal-tech
  - web-design
  - law-firm
  - ux
  - accessibility
---

# Legal Tech Web Design

Expert in designing trustworthy, accessible legal technology interfaces that convert vulnerable populations while meeting compliance requirements.

## Decision Points

### Trust Signal Placement Decision Tree

```
IF user bounce rate > 40% on landing page:
  ├─ IF time-on-page < 15 seconds:
  │   └─ Add Tier 1 trust signals above fold (attorney credentials, case count, security badges)
  └─ IF scroll depth < 30%:
      └─ Move primary CTA higher, add "Check eligibility in 2 minutes" micro-copy

IF wizard abandonment > 30% at step 3+:
  ├─ IF step contains sensitive info (SSN, criminal history):
  │   └─ Add privacy signals ("256-bit encrypted", "Not stored on our servers")
  └─ IF step has complex legal terms:
      └─ Add progressive disclosure tooltips with plain language

IF mobile conversion < 50% of desktop:
  ├─ IF forms are hard to complete on mobile:
  │   └─ Switch to single-question-per-screen pattern
  └─ IF trust signals invisible on mobile:
      └─ Condense attorney credentials into mobile-optimized badge
```

### Wizard Flow Architecture Decision Tree

```
IF user has < 5 minutes available:
  └─ Use eligibility pre-screen (2-4 questions) → save & resume for full intake

IF process has 7+ steps:
  ├─ IF linear flow:
  │   └─ Use vertical sidebar stepper with progress indicators
  └─ IF branching flow (multiple state requirements):
      └─ Use conditional reveal with state-specific paths

IF user needs to gather documents:
  ├─ IF documents are readily available:
  │   └─ Include upload in main flow
  └─ IF documents require court visits:
      └─ Separate "gather documents" step with guidance and email reminders
```

### Accessibility Compliance Decision Tree

```
IF serving government-adjacent function:
  └─ Implement WCAG 2.1 AA + Section 508 requirements

IF target population includes 13%+ Spanish speakers:
  ├─ IF budget allows full translation:
  │   └─ Translate entire flow with legal review
  └─ IF budget limited:
      └─ Translate landing page, eligibility check, and error messages

IF reading level test shows > 9th grade:
  └─ Rewrite content targeting 6th-8th grade level with legal accuracy review
```

## Failure Modes

### 1. Rubber Stamp Trust Signals
**Symptoms:** Generic trust badges, stock photos of gavels, template attorney credentials
**Detection Rule:** If trust signals look identical to other legal sites, they're not building genuine trust
**Fix Priority Order:**
1. Replace with real attorney photos and specific bar numbers
2. Add case-specific testimonials with details
3. Include recent press mentions or bar association partnerships

### 2. Desktop-Only Wizard Flow
**Symptoms:** 70%+ mobile traffic but <50% mobile conversion, horizontal scrolling on forms
**Detection Rule:** If mobile completion rate is less than 60% of desktop rate
**Fix Priority Order:**
1. Switch to single-question-per-screen on mobile
2. Optimize form fields for thumb navigation
3. Add save-and-resume functionality for document gathering

### 3. Jargon-First Information Architecture
**Symptoms:** High bounce rate on content pages, support tickets asking for basic definitions
**Detection Rule:** If reading level tests above 9th grade or tooltips are heavily used
**Fix Priority Order:**
1. Rewrite headers and primary content in plain language
2. Add tooltips for remaining legal terms
3. Test with actual target users (not lawyers)

### 4. Hidden Pricing Psychology
**Symptoms:** High cart abandonment at checkout, pricing page has highest bounce rate
**Detection Rule:** If pricing is behind a click or excludes mandatory fees
**Fix Priority Order:**
1. Display total cost including court fees on main pricing
2. Show payment plan options prominently
3. Add money-back guarantee with clear terms

### 5. Accessibility Theater
**Symptoms:** Passes automated tests but fails with real screen reader users
**Detection Rule:** If color contrast passes but content is still unclear to disabled users
**Fix Priority Order:**
1. Test with actual screen reader users
2. Ensure all form labels are visible (not placeholder-only)
3. Add aria-live regions for form validation feedback

## Worked Examples

### Example 1: Trauma-Informed Expungement Intake Flow

**Scenario:** Designing intake for someone with a 15-year-old misdemeanor DUI conviction

**Initial State:** User googled "clear DUI from record" → lands on service

**Expert Decision Process:**
1. **Landing Page Assessment:** User likely feels shame about past conviction
   - Place "No judgment here" messaging above fold
   - Use forward-looking imagery (person walking toward sunrise, not courthouse)
   - Lead with outcome: "Start Fresh" not "Expunge Your Record"

2. **Trust Signal Selection:** DUI users worry about employment background checks
   - Tier 1: "Licensed attorneys" + "12,400+ records cleared"
   - Add specific testimonial: "Got my DUI expunged after 8 years - finally got the job I wanted"
   - Include "Confidential process" badge near form entry

3. **Wizard Flow Design:**
   ```
   Step 1: State + Offense Type (DUI/misdemeanor) → Instant eligibility result
   Step 2: If eligible, collect basic info (name, contact)
   Step 3: Case details (court, date, disposition) with tooltips
   Step 4: Document upload with "I don't have my court records" option
   Step 5: Attorney review summary before payment
   ```

4. **Mobile Optimization:** DUI users often research on phones during work breaks
   - Single question per screen for sensitive info
   - Large input fields optimized for thumbs
   - Progress indicator shows "2 of 5 complete"

**Novice Would Miss:** Generic "check your eligibility" without addressing shame/fear
**Expert Catches:** DUI-specific emotional state requires different messaging than general criminal record

### Example 2: Multi-State Legal Service Landing Page

**Scenario:** Service operates in CA, TX, FL with different expungement laws per state

**Expert Decision Process:**
1. **State Detection Strategy:**
   - IP-based suggestion: "Looks like you're in Texas - check TX eligibility"
   - Manual override dropdown for users researching for others
   - State-specific trust signals (TX State Bar member, CA certified)

2. **Trust Signal Adaptation:**
   ```
   California → Emphasize Prop 47 reduction successes
   Texas → Highlight non-disclosure vs expungement distinction  
   Florida → Focus on sealing vs expungement options
   ```

3. **Wizard Branching Logic:**
   ```
   IF California AND offense_date > 2015:
     → Check Prop 47 automatic reduction first
   IF Texas AND misdemeanor:
     → Route to non-disclosure petition path
   IF Florida AND felony:
     → Route to sealing petition (expungement likely unavailable)
   ```

**Trade-off Analysis:**
- **Option A:** Single generic flow → simpler development, worse conversion
- **Option B:** Fully separate state sites → better SEO, 3x development cost
- **Chosen:** Shared infrastructure with state-specific content → 80% of conversion benefit, manageable development

**Alternative Approaches Considered:**
- Chatbot for state selection (rejected - adds friction for mobile users)
- Geofencing with no manual override (rejected - people research for family)

## Quality Gates

- [ ] Trust signals visible above fold without scrolling on mobile and desktop
- [ ] Attorney credentials include real names, bar numbers, and state licenses
- [ ] All pricing displays total cost including mandatory court filing fees
- [ ] Wizard flow supports save-and-resume with unique recovery link
- [ ] Every form field has visible label text (not placeholder-dependent)
- [ ] Legal terminology has plain-language tooltips on first use
- [ ] WCAG 2.1 AA compliance verified through automated and manual testing
- [ ] Mobile experience tested and optimized for 375px viewport width
- [ ] Page load performance under 3 seconds on simulated 3G connection
- [ ] Reading level verified at 8th grade or below for primary content
- [ ] Error messages written in plain language without legal jargon
- [ ] "This is not legal advice" disclaimer prominent and readable
- [ ] Spanish translation considered for markets with 13%+ Spanish speakers

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- General web design without legal context → Use **web-design-expert**
- Design system component architecture → Use **design-system-creator** 
- Actual legal document drafting → Use **recovery-app-legal-terms** or **national-expungement-expert**
- Complex data visualization → Use **data-visualization-expert**
- E-commerce without legal services → Use **conversion-optimization-expert**

**Delegate to other skills when:**
- Client needs logo design or brand identity → **brand-identity-designer**
- Complex form validation logic required → **form-validation-architect**
- Typography-specific deep dive needed → **typography-expert**
- SEO optimization is primary concern → **seo-content-strategist**