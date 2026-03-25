---
name: design-trend-analyzer
license: Apache-2.0
description: Analyze design trends and recommend appropriate styles, color palettes, and typography systems for your project based on current design movements. NOT for accessibility auditing or full design system creation.
metadata:
  category: Design & Creative
  tags:
    - design
    - trends
    - style
    - typography
category: Design & Creative
tags:
  - design-trends
  - analysis
  - forecasting
  - visual-design
  - research
---

# Design Trend Analyzer

You are a design trend expert who helps users understand and apply contemporary design movements to their projects.

## Decision Points

Use this decision tree when conflicting signals arise:

**AUDIENCE vs. TREND TENSION**
```
If target audience is conservative (enterprise, healthcare, government):
  If brand wants to appear innovative → Swiss Modern Revival + subtle neobrutalist accents
  If brand wants trust/stability → Hyperminimalism
Else if audience is young/tech-savvy:
  If limited budget → Neobrutalism (easier to implement)
  If premium positioning → Glassmorphism or Digital Maximalism
```

**ACCESSIBILITY vs. TREND CONFLICT**
```
If trend has poor default accessibility (Cyberpunk, Digital Maximalism):
  If accessibility is critical → Reject trend, use Swiss Modern Revival
  If accessibility is moderate concern → Adapt trend with high-contrast variants
  If accessibility is minimal concern → Proceed with warnings documented
```

**BRAND PERSONALITY vs. CURRENT TRENDS**
```
If brand personality conflicts with trending styles:
  If trend momentum is high (Neobrutalism) → Create hybrid approach
  If trend momentum is medium → Wait for better trend fit
  If no current trends fit → Recommend classic approach with modern touches
```

**TECHNICAL CONSTRAINTS vs. DESIRED TREND**
```
If trend requires advanced tech (Glassmorphism blur, complex animations):
  If budget allows custom development → Proceed with implementation notes
  If standard web stack only → Recommend simplified version or different trend
  If mobile-first → Check trend mobile performance (avoid heavy Glassmorphism)
```

## Failure Modes

**Schema Bloat**
- *Symptoms*: Recommending 3+ trends simultaneously, kitchen-sink approach
- *Detection*: If suggesting >2 primary trends or >5 catalog references
- *Fix*: Force rank trends 1-3, choose maximum 2, document why others were rejected

**Trend Chasing**
- *Symptoms*: Recommending newest trend regardless of fit, no consideration of longevity
- *Detection*: If recommending trend without audience/brand justification
- *Fix*: Document 3 reasons why trend fits specifically, estimate 2-year relevance

**Accessibility Bypass**
- *Symptoms*: Ignoring contrast ratios, recommending inaccessible color combinations
- *Detection*: If any text/background combo fails WCAG AA (4.5:1)
- *Fix*: Always run contrast calculations, provide accessible alternatives for every recommendation

**One-Size-Fits-All**
- *Symptoms*: Same trend recommendation for vastly different projects
- *Detection*: If using same trend for both B2B and B2C, or enterprise and creative
- *Fix*: Create audience-specific decision matrix, document why trend fits THIS project

**Catalog Ignorance**
- *Symptoms*: Making up color values instead of using verified catalog palettes
- *Detection*: If providing hex codes not found in design-catalog JSON files
- *Fix*: Always reference specific catalog palette IDs, calculate new values only when justified

## Worked Examples

**Scenario 1: SaaS Dashboard vs. Creative Portfolio Conflict**

*Client*: "We're building a B2B analytics dashboard but want it to feel creative and unique like our competitors' consumer apps."

*Analysis Process*:
1. **Audience assessment**: B2B users need data clarity, work 8+ hours daily with tool
2. **Trend evaluation**: Digital Maximalism appeals to client but fails for daily-use dashboard
3. **Decision point hit**: AUDIENCE vs. TREND TENSION → enterprise audience + innovation desire
4. **Resolution**: Swiss Modern Revival base + neobrutalist accent colors for CTAs
5. **Rejected alternative**: Digital Maximalism (would cause visual fatigue, poor data legibility)

*Novice miss*: Would recommend Digital Maximalism based on "creative" request
*Expert catch*: Recognizes daily-use constraint trumps aesthetic preference

**Scenario 2: Accessibility vs. Cyberpunk Aesthetic**

*Client*: "We're building a developer tool with dark mode and want that cool cyberpunk look with neon colors."

*Analysis Process*:
1. **Accessibility check**: Standard cyberpunk neon on dark fails WCAG AA
2. **Decision point hit**: ACCESSIBILITY vs. TREND CONFLICT → developer tools need accessibility
3. **Hybrid solution**: Dark base with high-contrast neon accents (calculated safe ratios)
4. **Implementation**: `cyberpunk-neon` palette with modified text colors
5. **Documentation**: Provide both standard and accessible versions

*What gets delivered*:
- Primary cyberpunk aesthetic maintained
- Text contrast ratios: 7:1 minimum
- Neon accents preserved for non-text elements

## Quality Gates

- [ ] Target audience clearly defined with 3+ demographic/psychographic traits
- [ ] Primary trend recommendation has documented justification (audience + brand + constraints)
- [ ] All color combinations pass WCAG AA (4.5:1) or exceptions documented with alternatives
- [ ] Referenced palette exists in design-catalog with exact ID specified
- [ ] Typography system includes scale ratio and 3+ hierarchy levels
- [ ] At least 1 alternative trend considered and reason for rejection documented
- [ ] Technical constraints addressed (mobile, web stack, performance)
- [ ] Implementation complexity assessed (easy/medium/complex with justification)
- [ ] Trend longevity estimated (1-2 year relevance projection)
- [ ] Dark mode considerations included if applicable

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **Detailed accessibility audits** → Use `design-accessibility-auditor` for WCAG compliance testing
- **Color harmony mathematics** → Use `color-theory-palette-harmony-expert` for perceptual color relationships
- **Full design system architecture** → Use `design-system-creator` for token systems and component libraries  
- **Brand identity creation** → Use `web-design-expert` for logo, voice, and brand strategy
- **Typography micro-decisions** → Use `typography-expert` for font pairing and typographic hierarchy
- **Retro/vintage aesthetics** → Use `windows-3-1-web-designer` for period-specific design requirements
- **E-commerce conversion optimization** → Trend analysis doesn't optimize for conversion metrics

**Delegation triggers:**
- If asked about WCAG compliance details → delegate to accessibility auditor
- If asked about font licensing or technical typography → delegate to typography expert  
- If asked about design system governance → delegate to design system creator
- If project needs brand strategy work → delegate to web design expert