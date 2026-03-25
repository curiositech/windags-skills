---
license: Apache-2.0
name: hero-section-design
description: Designs the first screen visitors see — the hero section. Layout patterns (split, centered, asymmetric, full-bleed), navbar design, headline typography, CTAs, background treatments (gradients, video, particles, 3D), scroll cues, and above-the-fold conversion strategy. Activate on 'hero section', 'landing page hero', 'above the fold', 'first impression', 'homepage header', 'navbar design', 'hero layout', 'landing page design'. NOT for full multi-page site architecture (use web-design-expert), not for SEO content strategy (use seo-visibility-expert).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Design & UX
  tags:
    - hero
    - landing-page
    - above-the-fold
    - cta
    - conversion
    - navbar
    - typography
    - layout
  pairs-with:
    - skill: web-design-expert
      reason: Hero sets visual tone that the rest of the site must continue
    - skill: typography-expert
      reason: Hero typography is the single highest-impact type decision on the site
    - skill: seo-visibility-expert
      reason: Hero headline and structure directly affect SEO and Core Web Vitals
category: Design & Creative
tags:
  - hero-section
  - landing-page
  - web-design
  - cta
  - visual
---

# Hero Section Design

Designs the first screen users see on a website — the hero section. You have 2-4 seconds to communicate who you are, what you do, and why the visitor should stay. Every pixel above the fold is a conversion decision.

## Decision Points

### Layout Pattern Decision Tree
```
What's the primary goal?
├── Brand awareness/memorability → Full-bleed visual hero
├── Product clarity/demonstration → Split hero (copy left, visual right)
├── Feature showcase/comparison → Centered hero with feature grid below
└── Authority/credibility building → Editorial/asymmetric hero

Is there a strong product visual?
├── Yes (app screenshots, dashboard, demo) → Split hero
└── No (API, service, abstract concept) → Centered hero

What's the target audience?
├── Developers/technical → Centered, minimal (Linear/Vercel style)
├── Business/enterprise → Split with professional visuals
├── Consumer/lifestyle → Full-bleed with lifestyle imagery
└── Creative/design → Editorial/asymmetric layout

Content complexity?
├── Simple value prop (1 line) → Full-bleed or centered
├── Medium (headline + subtitle) → Split or centered
└── Complex (multiple benefits) → Split with structured copy
```

### CTA Strategy Decision Tree
```
What's the business model?
├── Freemium/trial → "Start Free" + "See Demo"
├── Sales-led → "Talk to Sales" + "View Pricing"
├── Direct purchase → "Buy Now" + "Learn More"
└── Lead generation → "Get Quote" + "Case Studies"

User intent level?
├── High intent (searched brand name) → Direct CTA only
├── Medium intent (problem-aware) → Primary + secondary CTA
└── Low intent (discovery) → Soft CTA + value-focused copy
```

## Failure Modes

### 1. Carousel Confusion
**Symptom:** Hero content rotates automatically, bounce rate >70%
**Diagnosis:** Users cannot process rotating messages; decision paralysis occurs
**Fix:** Replace with single strongest message; use static hero with one clear value prop

### 2. CTA Below the Fold
**Symptom:** Low conversion rate despite high traffic; mobile CTA requires scrolling
**Diagnosis:** Primary action not visible on initial page load
**Fix:** Reduce hero height or move CTA up; ensure visibility at 375px mobile width

### 3. Unclear Value Proposition
**Symptom:** High bounce rate, low engagement time, confused user feedback
**Diagnosis:** Headline describes what you are, not what you do for users
**Fix:** Lead with outcome/benefit; "Ship 10x faster" not "DevOps platform"

### 4. Poor Visual Hierarchy
**Symptom:** Users miss key information, low CTA click-through (<2%)
**Diagnosis:** All text elements same visual weight; no clear reading order
**Fix:** Scale headline 2-3x larger than body text; use color/weight to guide eye

### 5. Performance Bottleneck
**Symptom:** High bounce rate on mobile; slow LCP scores >3 seconds
**Diagnosis:** Oversized hero assets block critical rendering path
**Fix:** Optimize images (WebP/AVIF), lazy-load non-critical assets, preload hero image

## Worked Examples

### Example: SaaS Product Hero (Split Layout)
**Scenario:** Building hero for a code review tool targeting developer teams

**Step 1: Layout Decision**
- Goal: Product demonstration ✓
- Strong visual: Yes (code diff screenshots) ✓
- Audience: Developers ✓
- Decision: Split hero with product visual

**Step 2: Copy Strategy**
```
Headline: "Ship code faster with confidence" (outcome-focused)
Subtitle: "Automated code review that catches bugs before your users do" (specific benefit)
Primary CTA: "Start Free Trial" (freemium model)
Secondary CTA: "See How It Works" (demo for hesitant users)
```

**Step 3: Visual Treatment**
- Left: Copy + CTAs (40% width)
- Right: Animated code diff demo (60% width)
- Background: Subtle dot pattern for developer aesthetic

**Step 4: Mobile Adaptation**
- Stack: Copy on top, visual below
- Headline scales from 3rem to 2.25rem
- CTA buttons stack vertically with 1rem gap

**Expert vs Novice:**
- Novice: Uses generic "Learn More" CTA
- Expert: Uses "See How It Works" (implies visual demonstration)
- Novice: Headline "Code Review Tool for Teams"
- Expert: Headline "Ship code faster with confidence" (user outcome)

## Quality Gates

- [ ] Primary CTA visible without scrolling on 375px mobile width
- [ ] Headline communicates value proposition in ≤10 words
- [ ] Hero loads with LCP ≤2.5 seconds (test with throttling)
- [ ] Text contrast ratio ≥4.5:1 against any background
- [ ] Mobile layout stacks cleanly without horizontal scroll
- [ ] Social proof element present (logos, metrics, or testimonial)
- [ ] Single clear message (no rotating content or multiple value props)
- [ ] CTA click-through rate ≥2% (measure after 1 week)
- [ ] prefers-reduced-motion respected for animations
- [ ] Hero image uses appropriate loading priority (eager/high)

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Full website architecture → use **web-design-expert**
- SEO content strategy → use **seo-visibility-expert**
- Blog post layouts → use **web-design-expert**
- E-commerce product pages → use **ecommerce-conversion-expert**
- Multi-step onboarding flows → use **user-experience-expert**
- Brand identity/logo design → use **brand-design-expert**

**Delegate instead when:**
- Client needs entire site redesign → **web-design-expert**
- Focus is on search ranking optimization → **seo-visibility-expert**
- Hero is part of complex user journey → **user-experience-expert**