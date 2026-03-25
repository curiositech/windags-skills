---
license: Apache-2.0
name: animation-system-architect
description: "Design performant animation systems with Framer Motion, GSAP, View Transitions API, and spring physics. Activate on: page transitions, micro-interactions, scroll animations, layout animations, spring physics. NOT for: CSS-only hover effects (use css-in-js-architect), video/canvas rendering (use creative-coding-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - animation
  - framer-motion
  - gsap
  - view-transitions
  - micro-interactions
pairs-with:
  - skill: web-design-expert
    reason: Animation enhances design intent -- motion should serve UX goals
  - skill: react-performance-optimizer
    reason: Animations must stay on compositor thread to maintain 60fps
---

# Animation System Architect

Build performant, accessible animation systems using Framer Motion, GSAP, the View Transitions API, and spring physics for fluid UI experiences.

## Activation Triggers

**Activate on**: page transitions, layout animations, scroll-triggered animations, micro-interactions, spring physics, `motion.div`, `gsap.to`, `View Transition API`, shared element transitions, staggered list animations.

**NOT for**: CSS-only hover/focus effects -- use css-in-js-architect. Canvas/WebGL rendering -- use creative-coding-expert. Lottie file playback -- use standard Lottie integration.

## Quick Start

1. **Choose your engine** -- Framer Motion for React declarative, GSAP for timeline-heavy or non-React, View Transitions API for cross-page navigation.
2. **Animate transforms and opacity only** -- these run on the compositor thread (GPU), avoiding layout thrashing.
3. **Use `will-change` sparingly** -- only on elements about to animate, remove after completion.
4. **Respect `prefers-reduced-motion`** -- disable or simplify all animations for users who request it.
5. **Profile with DevTools** -- Performance tab > check for layout shifts during animations.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Declarative React | Framer Motion 11+, `motion` components | Layout animations, `AnimatePresence`, variants |
| Timeline Animation | GSAP 3.12+, ScrollTrigger | Scroll-driven sequences, pinning, scrubbing |
| Page Transitions | View Transitions API, Next.js `useViewTransition` | Cross-page shared element transitions |
| Spring Physics | Framer Motion springs, `react-spring` | Natural easing, interruptible animations |
| Micro-interactions | CSS transitions + Framer Motion | Button feedback, hover states, loading indicators |
| Scroll-driven | CSS `animation-timeline: scroll()`, GSAP ScrollTrigger | Parallax, progress indicators, reveal on scroll |

## Architecture Patterns

### Pattern 1: Framer Motion Layout Animations

```typescript
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

function FilterableGrid({ items, filter }: Props) {
  const filtered = items.filter(item => item.category === filter);

  return (
    <LayoutGroup>
      <motion.div layout className="grid grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(item => (
            <motion.div
              key={item.id}
              layout                             // animate position changes
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
```

### Pattern 2: View Transitions API for Page Navigation

```typescript
// app/components/TransitionLink.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function TransitionLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }
    document.startViewTransition(() => {
      router.push(href);
    });
  }, [href, router]);

  return <a href={href} onClick={handleClick}>{children}</a>;
}
```

```css
/* Shared element transitions via view-transition-name */
.product-image {
  view-transition-name: product-hero;
}

::view-transition-old(product-hero) {
  animation: fade-and-scale 0.3s ease-out;
}
::view-transition-new(product-hero) {
  animation: fade-and-scale 0.3s ease-in reverse;
}
```

### Pattern 3: Reduced Motion Respect

```typescript
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      Content
    </motion.div>
  );
}
```

```
  ┌─ Animation Decision Tree ───────────────────────┐
  │                                                   │
  │  prefers-reduced-motion?                          │
  │  ├── YES → instant opacity fade only (no motion)  │
  │  └── NO  → full spring/transform animation        │
  │                                                   │
  │  What's animating?                                │
  │  ├── transform/opacity → GPU compositor (good)    │
  │  ├── width/height → layout thrash (avoid)         │
  │  └── box-shadow → paint-only (acceptable)         │
  └───────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **Animating `width`, `height`, `top`, `left`** -- triggers layout recalculation every frame. Use `transform: translate/scale` instead for 60fps.
2. **`will-change` on every element** -- promotes too many layers to GPU, increasing memory usage. Apply only to elements about to animate.
3. **Ignoring `prefers-reduced-motion`** -- motion-sensitive users experience nausea or seizures. Always check and respect this media query.
4. **Animation duration > 500ms for micro-interactions** -- makes the UI feel sluggish. Keep button/hover feedback under 200ms, page transitions under 400ms.
5. **Animating during scroll without `requestAnimationFrame` or ScrollTrigger** -- causes jank. Use GSAP ScrollTrigger or CSS `animation-timeline: scroll()` for scroll-driven animations.

## Quality Checklist

- [ ] All animations use `transform` and `opacity` (compositor-friendly properties)
- [ ] `prefers-reduced-motion` respected with `useReducedMotion` or CSS media query
- [ ] Micro-interactions under 200ms, page transitions under 400ms
- [ ] `AnimatePresence` used for mount/unmount animations
- [ ] Layout animations use Framer Motion `layout` prop (not manual position calc)
- [ ] `will-change` applied only during animation, removed after
- [ ] No jank in Chrome DevTools Performance panel (no long frames > 16ms)
- [ ] Animations are interruptible (spring physics, not fixed keyframes with `ease`)
- [ ] View Transitions API has fallback for unsupported browsers
- [ ] Scroll-driven animations use `animation-timeline` or ScrollTrigger (not scroll event listeners)
