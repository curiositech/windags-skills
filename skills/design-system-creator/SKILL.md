---
license: Apache-2.0
name: design-system-creator
description: Builds comprehensive design systems and design bibles with production-ready CSS. Expert in design tokens, component libraries, CSS architecture. Use for design system creation, token architecture, component documentation, style guide generation. Activate on "design system", "design tokens", "CSS architecture", "component library", "style guide", "design bible". NOT for typography deep-dives (use typography-expert), color theory mathematics (use color-theory-palette-harmony-expert), brand identity strategy (use web-design-expert), or actual UI implementation (use web-design-expert or native-app-designer).
allowed-tools: Read,Write,Edit,Glob,mcp__magic__21st_magic_component_builder,mcp__magic__21st_magic_component_refiner,mcp__stability-ai__stability-ai-generate-image,mcp__firecrawl__firecrawl_search
category: Design & Creative
tags:
  - design-system
  - tokens
  - components
  - css
  - style-guide
pairs-with:
  - skill: typography-expert
    reason: Typography decisions for the system
  - skill: color-theory-palette-harmony-expert
    reason: Color token architecture
---

# Design System Creator

Design systems architect specializing in comprehensive, scalable design system creation with three-tier token architecture.

## Decision Points

### Token Naming Conflicts Resolution
```
If brand token conflicts with semantic token:
  ├─ Brand name is descriptive (--color-sunset-orange)
  │  └─ Keep brand name, map to semantic: --color-primary: var(--color-sunset-orange)
  └─ Brand name is generic (--color-primary)
     └─ Rename brand to specific: --color-acme-primary, keep semantic --color-primary

If component token conflicts with semantic:
  ├─ Component is reusable pattern (--button-bg)
  │  └─ Keep component token, reference semantic: --button-bg: var(--color-primary)
  └─ Component is one-off usage
     └─ Use semantic directly: background: var(--color-primary)

If multiple teams contribute tokens:
  ├─ Core team tokens (spacing, typography)
  │  └─ Use unprefixed names: --space-4, --font-size-lg
  └─ Feature team tokens (component-specific)
     └─ Use team prefix: --commerce-product-card-shadow
```

### Component Documentation Depth
```
If component has < 3 variants:
  └─ Document: Purpose, Anatomy, States, Code example

If component has 3-8 variants:
  ├─ Complex interactions (forms, navigation)
  │  └─ Add: Responsive behavior, Accessibility guide, Usage guidelines
  └─ Simple variants (buttons, badges)
     └─ Add: Variant matrix table, Do/Don't examples

If component has > 8 variants:
  └─ Split into sub-components or reconsider if variants are actually needed
```

### CSS Architecture Choice
```
If existing codebase:
  ├─ < 50 components, no naming conflicts
  │  └─ Use BEM methodology with component-scoped files
  └─ > 50 components OR naming conflicts exist
     └─ Use ITCSS structure with strict naming conventions

If greenfield project:
  ├─ Small team (< 3 developers)
  │  └─ ITCSS with utility-first approach
  └─ Large team (> 3 developers)
     └─ ITCSS with component-scoped methodology
```

## Failure Modes

### Token Explosion
**Detection**: If you have > 12 spacing tokens or > 20 color tokens per theme
**Symptom**: Developers can't choose between similar options
**Fix**: Consolidate to max 8 spacing values, use semantic layer to reduce primitive exposure

### Semantic Layer Bypass
**Detection**: Components directly reference primitive tokens (--color-blue-500)
**Symptom**: Theming breaks, can't swap brands without touching every component
**Fix**: Audit all CSS, replace primitives with semantic tokens, add linting rules

### Documentation Drift
**Detection**: Design bible shows different values than actual CSS implementation
**Symptom**: Developers stop trusting documentation, inconsistencies multiply
**Fix**: Generate documentation from CSS comments or implement single source of truth

### Utility Class Abuse
**Detection**: HTML classes exceed 5-6 utility classes per element
**Symptom**: HTML becomes unreadable, design intent is lost in implementation
**Fix**: Create component classes for common patterns, limit utilities to tweaks

### Scale Breaking
**Detection**: Custom values appear outside the design token system (padding: 13px)
**Symptom**: Visual inconsistency, system erosion over time
**Fix**: If scale doesn't work, fix the scale—don't work around it

## Worked Example: Multi-Brand Token Refactor

**Scenario**: E-commerce platform needs to support 3 brands with shared components but different visual identity.

**Initial Assessment**:
- 47 existing components using hardcoded colors
- 2 brands already live, 3rd brand launch in 6 weeks
- Development team of 5, design team of 2

**Decision Process**:

1. **Token Architecture Decision**: Need three-tier system
   - Primitive: Raw brand colors (--acme-red-500, --beta-blue-600, --gamma-green-400)
   - Semantic: Intent-based (--color-primary, --color-secondary, --color-danger)
   - Component: Usage-specific (--button-primary-bg, --card-border-color)

2. **Migration Strategy Decision**: 
   - Audit shows 200+ color references, 40+ spacing values
   - Trade-off: Token explosion vs migration complexity
   - **Choice**: Start with semantic layer, gradually add component tokens for complex components

3. **Implementation**:
   ```css
   /* Brand A Theme */
   :root[data-brand="acme"] {
     --color-primary: var(--acme-red-500);
     --color-secondary: var(--acme-gray-600);
   }

   /* Brand B Theme */
   :root[data-brand="beta"] {
     --color-primary: var(--beta-blue-600);
     --color-secondary: var(--beta-slate-600);
   }

   /* Components use semantic tokens */
   .button--primary {
     background: var(--color-primary);
     color: var(--color-on-primary);
   }
   ```

4. **Validation**: Built 3 key pages in all brands, caught 12 contrast issues early

**Expert Insight**: Novice would try to solve with CSS-in-JS theming. Expert recognizes CSS custom properties provide better performance and simpler mental model.

**Result**: 6-week delivery met, 95% code reuse across brands, 0 critical bugs in production.

## Quality Gates

- [ ] All design tokens defined in three-tier architecture (primitive → semantic → component)
- [ ] Token architecture validated with 2+ themes/brands successfully applied
- [ ] 5+ core components documented with Purpose, Anatomy, Variants, States
- [ ] All components tested for WCAG AA compliance (color contrast, keyboard navigation)
- [ ] CSS organization follows ITCSS methodology with clear file structure
- [ ] Component examples exist in Storybook or equivalent living style guide
- [ ] Design bible includes visual examples, not just code snippets
- [ ] Naming conventions documented and followed consistently across all files
- [ ] Responsive behavior specified for components that change across breakpoints
- [ ] Token usage linting rules implemented to prevent primitive token abuse

## Not-For Boundaries

**Do NOT use this skill for:**

- **Typography pairing and selection** → Use `typography-expert` for font choices, reading hierarchy
- **Color theory and palette mathematics** → Use `color-theory-palette-harmony-expert` for color relationships
- **Brand identity and visual direction** → Use `web-design-expert` for logo, brand colors, visual personality
- **Component implementation code** → Use `web-design-expert` for React/Vue or `native-app-designer` for mobile
- **Icon design and creation** → Use `web-design-expert` for custom iconography
- **Motion design and animations** → Use `native-app-designer` for interaction design
- **Content strategy and UX writing** → Delegate to content specialists
- **User research and usability testing** → Delegate to UX researchers

**Delegation triggers:**
- "What colors should represent our brand?" → `color-theory-palette-harmony-expert`
- "How should this component animate?" → `native-app-designer`
- "What fonts work well together?" → `typography-expert`
- "Build this in React" → `web-design-expert`