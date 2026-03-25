---
name: component-template-generator
license: Apache-2.0
description: Generates starter component code using design tokens. Creates React/Vue/Svelte components with proper token usage, variants, and accessibility built in.
allowed-tools: Read,Write,Glob
metadata:
  category: Development
  pairs-with:
    - skill: design-system-generator
      reason: Uses generated tokens in component code
    - skill: frontend-developer
      reason: Implement and customize generated components
    - skill: design-system-documenter
      reason: Document generated components
  tags:
    - components
    - react
    - vue
    - svelte
    - templates
category: Frontend & UI
tags:
  - components
  - templates
  - code-generation
  - scaffolding
  - react
---

# Component Template Generator

Create production-ready component code that properly uses your design tokens. Generates React, Vue, or Svelte components with variants, accessibility, and token integration.

## DECISION POINTS

### Framework Selection Tree

```
Component request → Framework choice:
├── React requested or TypeScript heavy → React + TypeScript
│   ├── Has Tailwind tokens → React + Tailwind template
│   └── Has CSS variables → React + CSS Modules template
├── Vue requested or composition API mentioned → Vue 3 + Composition API
│   ├── Has Tailwind tokens → Vue + Tailwind template
│   └── Has CSS variables → Vue + CSS Variables template
├── Svelte requested or lightweight mentioned → Svelte template
└── No framework specified → Default to React + TypeScript
```

### Component Complexity Decision

```
Component type → Template complexity:
├── Simple (Button, Badge, Input) → Single file template
│   ├── <5 props → Basic variant system
│   └── 5+ props → Props interface + defaults
├── Composite (Card, Dialog, Accordion) → Multi-part template
│   ├── Has children slots → Compound component pattern
│   └── State management needed → Hook/composable pattern
├── Interactive (Dropdown, Tabs, Toggle) → Full template + logic
│   └── Always include → Keyboard handlers + ARIA
└── Layout (Container, Grid, Stack) → Responsive template
    └── Always include → Breakpoint variants
```

### Variant System Selection

```
Number of variants → Implementation:
├── 2-3 variants → Simple string union + className mapping
├── 4-8 variants → Object-based variant system
├── 8+ variants → Compound variants (size × color × state)
└── Complex states → Separate state management hook
```

## FAILURE MODES

### Hardcoded Colors Anti-Pattern
- **Symptom**: Generated code contains hex values or RGB colors instead of token names
- **Detection**: If you see `#FF0000`, `rgb(255,0,0)`, or `red-500` instead of `brutal-red`
- **Fix**: Replace with semantic token names from design system: `bg-brand-primary`, `text-error-500`

### Missing ARIA Anti-Pattern  
- **Symptom**: Interactive components lack proper accessibility attributes
- **Detection**: If button has no `aria-label`, dialog missing `aria-modal`, or form input without `aria-describedby`
- **Fix**: Add required ARIA attributes: `role`, `aria-label`, `aria-expanded`, `aria-describedby`

### Variant Collision Anti-Pattern
- **Symptom**: Multiple variant props can create conflicting styles
- **Detection**: If `variant="primary" ghost={true}` or size conflicts create broken layouts
- **Fix**: Use single variant prop with union types: `variant: 'primary' | 'ghost' | 'primary-ghost'`

### Framework Pattern Violation
- **Symptom**: Generated code doesn't follow framework conventions
- **Detection**: React without forwardRef for DOM elements, Vue without proper reactive declarations, Svelte without proper binding
- **Fix**: Apply framework-specific patterns: React forwardRef, Vue computed/reactive, Svelte stores

### Schema Bloat Anti-Pattern
- **Symptom**: Component props interface becomes unwieldy with 15+ properties
- **Detection**: Props interface longer than 10 lines or requires scrolling
- **Fix**: Break into logical groups: `variant`, `size`, `appearance`, plus spread native element props

## WORKED EXAMPLES

### Complete Button Generation Walkthrough

**Input**: Generate neobrutalism Button for React + Tailwind with primary/secondary variants

**Decision Process**:
1. Framework → React (specified) + TypeScript (best practice)
2. Has Tailwind → Use Tailwind template
3. Component type → Simple (Button)
4. Variants → 2 variants → Simple string union
5. Trend → Neobrutalism → Add brutal shadows + transforms

**Generated Output**:
```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base neobrutalism styles
          'border-3 border-brutal-black font-display font-bold uppercase',
          'shadow-brutal transition-all duration-100',
          'hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5',
          'active:shadow-brutal-active active:translate-x-0.5 active:translate-y-0.5',
          
          // Focus accessibility
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brutal-blue',
          
          // Variants using tokens
          variant === 'primary' && 'bg-brutal-red text-white',
          variant === 'secondary' && 'bg-brutal-yellow text-brutal-black',
          
          // Sizes
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-base',
          size === 'lg' && 'px-6 py-3 text-lg',
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Expert Catches vs Novice Misses**:
- ✅ Expert: Uses `forwardRef` for DOM ref forwarding
- ❌ Novice: Forgets ref forwarding, breaking form libraries
- ✅ Expert: Spreads native button props with `...props`
- ❌ Novice: Hardcodes limited prop interface
- ✅ Expert: Uses semantic token names (`brutal-red`)
- ❌ Novice: Uses hardcoded colors (`bg-red-500`)

## QUALITY GATES

- [ ] All interactive components have focus-visible states defined
- [ ] Color variants use semantic token names, not hardcoded values
- [ ] Components forward refs when wrapping DOM elements
- [ ] Props interface extends appropriate HTML element props
- [ ] ARIA attributes present for interactive/complex components
- [ ] TypeScript interfaces exported for props and component refs
- [ ] Framework-specific patterns followed (React hooks, Vue composition, Svelte stores)
- [ ] Responsive design implemented via breakpoint tokens
- [ ] All variants tested in combination (no style conflicts)
- [ ] Component includes displayName for debugging

## NOT-FOR BOUNDARIES

**Do NOT use this skill for**:
- **Complete UI libraries** → Use shadcn/ui, Chakra UI, or similar pre-built systems
- **Token generation only** → Use `design-system-generator` skill instead
- **Component documentation** → Use `design-system-documenter` skill for Storybook/docs
- **Custom styling existing components** → Modify components directly, don't regenerate
- **Complex application logic** → Generate UI templates only, not business logic
- **Animation libraries** → Use Framer Motion, React Spring, or CSS animation libraries

**Delegate to other skills**:
- For design tokens → `design-system-generator`
- For component docs → `design-system-documenter`  
- For complete applications → `frontend-developer`
- For testing → `test-driven-developer`