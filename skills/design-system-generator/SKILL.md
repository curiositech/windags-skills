---
license: Apache-2.0
name: design-system-generator
description: Generates production-ready design tokens from natural language descriptions. Outputs Tailwind configs, CSS custom properties, and DTCG W3C tokens from 24 trends + 31 AI-ready styles with 2800+ component examples.
allowed-tools: Read,Write,Bash,Glob
category: Design & Creative
tags:
  - design-system
  - tokens
  - tailwind
  - css
  - dtcg
pairs-with:
  - skill: vibe-matcher
    reason: Clarify emotional direction before generating tokens
  - skill: web-design-expert
    reason: Implement generated tokens in actual designs
  - skill: color-theory-palette-harmony-expert
    reason: Deep-dive on color choices within generated palette
  - skill: component-template-generator
    reason: Generate component code using these tokens
  - skill: design-system-documenter
    reason: Document generated tokens for team adoption
---

# Design System Generator

Transform natural language descriptions into production-ready design tokens. Powered by 24 design trends, 31 AI-ready styles, and 2,800+ component examples.

## DECISION POINTS

### 1. Confidence Threshold Rules
```
If trend match confidence >= 80%:
  → Generate immediately with primary trend

If confidence 60-79%:
  → Show top 2 matches, ask user to choose
  → Example: "Swiss-modern (65%) vs. Hyperminimalism (62%) - which feels right?"

If confidence < 60%:
  → Use vibe-matcher skill first for emotional clarity
  → Re-run trend matching with vibe context
```

### 2. Multi-Trend Disambiguation
```
If 2+ trends score within 10% of each other:
  ├─ Business/professional context?
  │   → Prefer: swiss-modern, hyperminimalism, dark-mode
  ├─ Creative/agency context?
  │   → Prefer: neobrutalism, maximalism, experimental-navigation
  ├─ Tech/developer context?
  │   → Prefer: terminal-aesthetic, glassmorphism, web3-crypto
  └─ Consumer app context?
      → Prefer: claymorphism, botanical-organic, gamified-design
```

### 3. Output Format Selection
```
If user mentions specific framework:
  ├─ "Next.js", "React", "Vite" → generate-tailwind.ts
  ├─ "Vue", "Angular", "vanilla" → generate-css-vars.ts
  └─ "Figma", "Style Dictionary" → generate-tokens.ts (DTCG)

If no framework mentioned:
  → Ask: "What's your tech stack?" or generate all three formats
```

### 4. Accessibility Requirements
```
If trend has accessibility warnings (glassmorphism, claymorphism):
  → Generate standard tokens first
  → Run contrast checker
  → If violations found:
      ├─ Adjust color values to meet WCAG AA
      ├─ Document overrides in comments
      └─ Warn user about visual changes
```

### 5. Scope Determination
```
If user mentions theming:
  ├─ "dark mode" → Generate with --scope=.dark
  ├─ "multiple brands" → Generate with --scope=[data-theme="name"]
  └─ "component library" → Use :root scope (default)

If existing design system mentioned:
  → Generate with theme.extend structure only
```

## FAILURE MODES

### 1. **Wrong Color Direction** (Vibrant when user wanted muted)
**Detection**: User says "too bright", "too colorful", "more subtle"
**Symptoms**: High saturation values, neon/electric colors in conservative context
**Fix**: Re-run with lower-energy trend (swiss-modern instead of neobrutalism)
```bash
# Wrong
npx ts-node generate-tailwind.ts neobrutalism  # Generates #FF5252, #00E676

# Fixed  
npx ts-node generate-tailwind.ts swiss-modern  # Generates #374151, #6B7280
```

### 2. **Compilation Chaos** (Generated tokens break build)
**Detection**: Tailwind purge warnings, CSS custom property undefined errors
**Symptoms**: Missing quotes in font names, invalid CSS values, circular references
**Fix**: Validate output before deployment
```bash
# Check Tailwind compilation
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch

# Check CSS syntax
npx stylelint tokens.css
```

### 3. **Contrast Violation** (Accessibility failure in production)
**Detection**: Lighthouse audit < 90, WAVE tool errors
**Symptoms**: Text invisible on backgrounds, pale borders, low-contrast buttons
**Fix**: Run contrast audit before finalizing
```bash
# Audit generated tokens
npx ts-node scripts/check-contrast.ts swiss-modern
# → Warning: text-gray-400 on bg-white = 2.1:1 (needs 4.5:1)
```

### 4. **Semantic Mismatch** (Token names don't match visual result)
**Detection**: Developer confusion, "primary" color isn't prominent
**Symptoms**: brutal-red is actually orange, glass-white is gray
**Fix**: Check trend mapping accuracy
```bash
# Verify semantic alignment
npx ts-node scripts/preview-tokens.ts neobrutalism
# Opens browser with all colors labeled
```

### 5. **Scope Pollution** (CSS variables leak across themes)
**Detection**: Theme switching doesn't work, colors persist incorrectly
**Symptoms**: Dark mode shows light colors, component themes interfere
**Fix**: Use explicit scoping
```css
/* Wrong - leaks to global */
:root { --color-primary: #FF0000; }

/* Fixed - scoped properly */
[data-theme="brand-a"] { --color-primary: #FF0000; }
[data-theme="brand-b"] { --color-primary: #00FF00; }
```

## WORKED EXAMPLES

### Scenario: SaaS Dashboard for Developer Tools

**Input**: "Clean dashboard for developers, needs to feel professional but not boring"

**Step 1: Trend Matching**
```bash
npx ts-node scripts/match-trend.ts "clean dashboard for developers professional"
```
Result: swiss-modern (78%), terminal-aesthetic (45%)

**Decision**: 78% confidence is good, but "not boring" suggests terminal-aesthetic could add personality. Check both.

**Step 2: Preview Both Options**
- Swiss-modern: #374151 grays, Helvetica fonts, subtle shadows
- Terminal-aesthetic: #00E676 greens, monospace, sharp edges

**Expert insight**: For developer tools, terminal-aesthetic creates better brand differentiation while maintaining professionalism.

**Step 3: Generate Tailwind Config**
```bash
npx ts-node generate-tailwind.ts terminal-aesthetic > tailwind.tokens.ts
```

**Step 4: Quality Check**
```typescript
// Generated output includes:
colors: {
  'terminal-green': '#00E676',
  'terminal-dark': '#0D1117', 
  'terminal-gray': '#21262D'
}
```

**Step 5: Accessibility Verification**
- terminal-green on terminal-dark = 7.2:1 ✅ (exceeds AAA)
- All text combinations pass WCAG AA

**Result**: Professional developer aesthetic with personality, fully accessible.

## QUALITY GATES

Pre-deployment checklist for generated tokens:

- [ ] **WCAG Contrast**: All text/background combinations ≥ 4.5:1 (AA) or ≥ 3:1 for large text
- [ ] **Tailwind Compilation**: `npx tailwindcss` builds without warnings or errors  
- [ ] **CSS Validation**: Custom properties have valid syntax (no missing semicolons, quotes)
- [ ] **Browser Compatibility**: Tokens render correctly in Chrome, Firefox, Safari latest versions
- [ ] **Semantic Accuracy**: Color names match visual appearance (red looks red, not orange)
- [ ] **Component Coverage**: Generated tokens support primary UI components (buttons, inputs, cards)
- [ ] **Theme Isolation**: Multiple themes don't interfere (test theme switching if applicable)
- [ ] **Font Loading**: Generated font families are available or have fallbacks
- [ ] **Performance**: CSS file size < 50KB, no unused custom properties
- [ ] **Documentation**: Token purpose and usage examples are clear to implementers

## NOT-FOR BOUNDARIES

❌ **DO NOT use for**:
- **Color exploration/mood boarding** → Use `vibe-matcher` skill instead
- **Existing design system refinement** → Use `design-system-documenter` for optimization
- **Component code generation** → Use `component-template-generator` with these tokens
- **Brand identity creation** → Use `color-theory-palette-harmony-expert` for strategic color work
- **Single token adjustments** → Just edit the values directly
- **Complex animation systems** → Use `web-design-expert` for motion design
- **Marketing site aesthetics** → This generates systematic tokens, not one-off visual styles

✅ **Perfect for**:
- New project foundation setup
- Converting design descriptions to code
- Standardizing ad-hoc color usage
- Cross-format token consistency (Tailwind + CSS vars + DTCG)

**Delegation Rules**:
- If user needs emotional/conceptual clarity → `vibe-matcher` first, then return here
- If user has existing system → `design-system-documenter` for analysis
- If user needs components, not tokens → `component-template-generator` with generated tokens
- If user needs color strategy → `color-theory-palette-harmony-expert` for theory, then return here