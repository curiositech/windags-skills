---
license: Apache-2.0
name: mobile-ux-optimizer
description: Mobile-first UX optimization for touch interfaces, responsive layouts, and performance. Use for viewport handling, touch targets, gestures, mobile navigation. Activate on mobile, touch, responsive, dvh, viewport, safe area, hamburger menu. NOT for native app development (use React Native skills), desktop-only features, or general CSS (use Tailwind docs).
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
category: Mobile Development
tags:
  - mobile
  - ux
  - optimization
  - usability
  - interaction
---

# Mobile-First UX Optimization

Build touch-optimized, performant mobile experiences with proper viewport handling and responsive patterns.

## Decision Points

### Navigation Pattern Selection
```
IF screen width < 768px AND menu items > 4
  → Use bottom navigation (finger-reachable zone)
ELSE IF screen width < 768px AND menu items ≤ 4
  → Use fixed bottom tabs
ELSE IF complex gesture required (swipes, long-press)
  → Use slide-out drawer with hamburger trigger
ELSE
  → Use horizontal top navigation
```

### Breakpoint Logic
```
IF content type = text-heavy (articles, forms)
  → Mobile-first: 320px base, lg:768px split
ELSE IF content type = media-heavy (galleries, videos)
  → Mobile-first: 375px base, md:640px grid
ELSE IF dashboard/data-dense
  → Start tablet: 768px base, xl:1280px full layout
```

### Viewport Height Strategy
```
IF fullscreen experience (modals, hero sections)
  → Use 100dvh with 100vh fallback
ELSE IF fixed bottom nav present
  → Use calc(100dvh - 64px) or h-screen-safe utility
ELSE IF content scrolls
  → Use min-h-screen (normal document flow)
```

### Touch Target Sizing
```
IF interactive element (buttons, links, inputs)
  → Minimum 44x44px touch area
ELSE IF dense UI required (data tables, toolbars)
  → 40x40px with 4px spacing minimum
ELSE IF accessibility priority
  → 48x48px (WCAG AAA compliance)
```

## Failure Modes

### Gesture Not Registering
**Symptoms:** Swipes/taps don't trigger, users tap multiple times
**Diagnosis:** Touch area too small or event handlers missing
**Fix:** 
```tsx
// Add minimum touch area and prevent double-tap zoom
<button className="min-h-[44px] min-w-[44px] touch-manipulation">
```

### Layout Jumps on Scroll
**Symptoms:** Content shifts when mobile browser chrome shows/hides
**Diagnosis:** Using 100vh instead of dynamic viewport units
**Fix:**
```css
/* Replace 100vh with dynamic height */
.full-screen { height: 100dvh; }
```

### Notch/Safe Area Overlap
**Symptoms:** Content hidden behind iPhone notch or home indicator
**Diagnosis:** Missing safe area insets or viewport-fit=cover
**Fix:**
```html
<!-- Add viewport-fit=cover -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
```css
.header { padding-top: env(safe-area-inset-top, 0); }
```

### Scroll Lock Anti-Pattern
**Symptoms:** Page becomes unscrollable when modal/drawer opens
**Diagnosis:** Applying overflow:hidden to body without restoration
**Fix:**
```tsx
useEffect(() => {
  if (isOpen) document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, [isOpen]);
```

### Tiny Text Syndrome
**Symptoms:** Text unreadable on mobile, users pinch to zoom
**Diagnosis:** Fixed pixel sizes instead of relative units
**Fix:**
```css
/* Replace px with rem for scalable text */
font-size: 1rem; /* 16px base, scales with user preference */
```

## Worked Example

**Scenario:** Converting a desktop-first meeting list to mobile-optimized experience

### Step 1: Audit Current State
```tsx
// ❌ BEFORE: Desktop-first pain points
<div className="w-full max-w-4xl mx-auto px-4">
  <nav className="flex space-x-8 mb-8">
    <a href="/meetings">All Meetings</a>
    <a href="/my-meetings">My Meetings</a>
    <a href="/favorites">Favorites</a>
    <a href="/search">Search</a>
  </nav>
  <div className="grid grid-cols-3 gap-6">
    {meetings.map(m => <MeetingCard key={m.id} meeting={m} />)}
  </div>
</div>
```

**Expert catches:** Touch targets in nav are too small, 3-column grid will be cramped on mobile, no safe area handling.

**Novice misses:** Would just add responsive classes without considering touch zones or navigation patterns.

### Step 2: Apply Mobile-First Decision Tree
Following navigation pattern logic: 4 menu items on mobile → Use bottom navigation

### Step 3: Implement Mobile-Optimized Version
```tsx
// ✅ AFTER: Mobile-optimized
<div className="pb-safe"> {/* Safe area handling */}
  <div className="px-4 pb-16"> {/* Bottom nav clearance */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map(m => <MeetingCard key={m.id} meeting={m} />)}
    </div>
  </div>
  
  {/* Mobile: bottom nav, Desktop: hidden */}
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t pb-safe">
    <div className="flex justify-around">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} 
              className="flex flex-col items-center py-2 px-3 min-h-[56px] min-w-[64px]">
          <Icon className="w-6 h-6" />
          <span className="text-xs mt-1">{label}</span>
        </Link>
      ))}
    </div>
  </nav>
</div>
```

### Step 4: Validate Touch Targets
Using browser DevTools, verify each nav item is 56px+ tall with adequate finger spacing.

## Quality Gates

- [ ] Viewport meta tag includes `viewport-fit=cover` for safe area support
- [ ] All interactive elements meet 44x44px minimum touch target size
- [ ] Layout tested with `100dvh` - no content cut off by browser chrome
- [ ] Safe area audit complete: `pt-safe`/`pb-safe` applied to fixed elements
- [ ] Bottom navigation (if used) has `pb-safe` and doesn't block content
- [ ] Touch targets have 8px+ spacing between adjacent elements
- [ ] Responsive grid collapses appropriately: 1 col mobile, 2+ tablet/desktop
- [ ] All images use `sizes` attribute for proper mobile loading
- [ ] No horizontal scrolling at 320px viewport width
- [ ] Form inputs remain visible when virtual keyboard appears

## NOT-FOR Boundaries

**DO NOT use this skill for:**
- Native iOS/Android development → Use `react-native` or `swift-executor` instead
- PWA installation flows → Use `pwa-expert` skill for service workers and manifest
- Desktop-only applications → Standard responsive design patterns sufficient
- Complex animations → Use `framer-motion` or `animation-expert` skills
- General CSS debugging → Use `tailwind-expert` or standard CSS documentation

**Delegate to other skills when:**
- User reports native app crashes → `mobile-debugging` skill
- Need push notifications → `pwa-expert` skill
- Performance issues beyond mobile-specific → `performance-optimization` skill
- Accessibility beyond touch targets → `a11y-expert` skill