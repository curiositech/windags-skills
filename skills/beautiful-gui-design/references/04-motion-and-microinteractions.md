# Motion & Micro-Interactions Reference

## Introduction

Motion is not animation. Motion is communication—feedback on state, guidance through hierarchy, reassurance during waits, and affordance signaling on interactive elements. Bad motion breaks trust (feels slow or glitchy); good motion is *felt*, not watched. This document specifies duration tokens, easing curves, spring parameters, anti-patterns, and quality gates for ship-ready motion in modern interfaces.

---

## Decision Points

### 1. **Duration Tokens: Pick the Right Moment**

Your motion baseline is **100–300ms**, calibrated to cognitive load and information density:

| Duration | Use Case | Rationale |
|----------|----------|-----------|
| **100ms** | Micro-feedback: button press ripple, icon swap, checkbox toggle, switch flip | Felt as *instant* but perceptible; under human flicker threshold (~150ms) |
| **150ms** | Local spatial transitions: panel slide, modal appear, tooltip fade-in, inline error shake | Sweet spot for "quick acknowledgment" without feeling laggy |
| **200ms** | Medium navigation: page transition, list reflow, drawer open, menu cascade | Cognitive arc to track change; enough time to parse new content |
| **300ms** | Full-screen transitions: deep navigation, significant layout shift, hero banner reveal | Prevents disorientation; must stay under 400ms or feels sluggish |

**Never exceed 500ms for repeated interactions** (e.g., hover states); users feel blocked. For unknown-duration waits (network I/O), use indeterminate spinners—never fake progress bars.

### 2. **Easing Curves: Direction Matters**

**Principle:** Acceleration mirrors physics. Exits deceive by easing in early; entries gain momentum easing out late.

#### Standard Curves (Material 3, Apple HIG)

```css
/* Material 3 (Google Design) */
--ease-standard: cubic-bezier(0.2, 0, 0.8, 1);       /* versatile, balanced */
--ease-emphasized: cubic-bezier(0.3, 0, 0.8, 0.15);  /* snappier, entrance focus */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);       /* ease-out: decelerating arrival */
--ease-accelerate: cubic-bezier(0.3, 0, 1, 1);       /* ease-in: accelerating departure */

/* Apple HIG (iOS/macOS) */
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);       /* symmetric, formal */
```

#### Application Rules

- **Entrance (appearing, opening, focusing):** `ease-out` or `emphasized` → feels *snappy, intentional*
  ```css
  .modal {
    animation: slideUp 200ms cubic-bezier(0, 0, 0.2, 1) forwards;
  }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } }
  ```

- **Exit (closing, disappearing, unfocusing):** `ease-in` or `accelerate` → feels *resolved, dismissed*
  ```css
  .tooltip {
    animation: fadeOut 150ms cubic-bezier(0.3, 0, 1, 1) forwards;
  }
  @keyframes fadeOut { to { opacity: 0; } }
  ```

- **Continuous loops (spinners, breathing):** `ease-in-out` or `standard` → feels *stable, cyclical*
  ```css
  .spinner {
    animation: rotate 2s cubic-bezier(0.4, 0.2, 0.6, 0.8) infinite;
  }
  ```

**Never use `linear`** for UI motion. Linear feels *robotic* and violates real-world inertia. (Exception: progress bar fill *amount*, not the bar container itself.)

### 3. **Spring vs. Tween: Personality & Budget**

| Type | Easing | Snap | Energy | CPU | Best For |
|------|--------|------|--------|-----|----------|
| **Tween** (cubic-bezier) | Predefined curve | Precise, fixed duration | Predictable, settled | Low | Micro (≤200ms), navigation, formal interactions |
| **Spring** | Damped oscillation | Overshoots ≈5–15%, settles naturally | Playful, elastic energy | Moderate | Drag-to-dismiss, gestures, playful feedback, scroll momentum |

**Spring physics params** (Framer Motion convention):
```javascript
// Natural, slightly bouncy (iOS-like)
{ stiffness: 300, damping: 30, mass: 1 }  // ~350ms settle, 8% overshoot

// Snappy, less bounce (Android Material)
{ stiffness: 500, damping: 50, mass: 1 }  // ~200ms settle, 2% overshoot

// Slime (playful, draggy feedback)
{ stiffness: 100, damping: 15, mass: 1 }  // ~800ms settle, 25% overshoot
```

**Rule:** Use spring for *gesture-driven* motion (swipe, drag, fling); use tween for *system-triggered* motion (focus, error, notification).

### 4. **Purposeful Motion: The Four Pillars**

Motion earns its place only when it serves one of these:

1. **Orientation** — "Where did this come from / go to?"
   - Button → Menu: grow from button origin.
   - Page exit → Page enter: slide direction matches nav axis.
   
2. **Feedback** — "Did my input register?"
   - Tap: scale + opacity flicker (100–150ms).
   - Toggle: state symbol changes (checkbox ✓ appears, 150ms).
   - Loading: rotating spinner or skeleton pulse.

3. **Continuity** — "This object persists; I'm following it."
   - Shared-element transitions: single element morphs across screens.
   - Scroll anchoring: content shifts in place; anchor stays fixed.

4. **Hierarchy** — "What's important right now?"
   - Hero entrance animates first; supporting details cascade after.
   - Modals scale-grow from center (emphasis); panels slide from edge (navigation).

**Anti-rule:** Decoration motion (particles, parallax, bounciness-for-fun) kills performance and distracts. Remove if it doesn't map to one of the four.

---

## Micro-Interactions: Canonical Patterns

### Hover → Press → Active → Disabled

```css
/* Button lifecycle: 6 states × 3 transitions = 18 paths. Simplify. */

.btn {
  background: hsl(210, 90%, 50%);
  transition: background-color 150ms cubic-bezier(0.2, 0, 0.8, 1);
}

.btn:hover {
  background: hsl(210, 90%, 40%);  /* Lighten to indicate affordance */
}

.btn:active {
  background: hsl(210, 90%, 35%);  /* Pressed darkening */
  transform: scale(0.98);           /* Haptic analogue */
  transition-duration: 100ms;       /* Faster press-feel */
}

.btn:focus-visible {
  outline: 2px solid hsl(210, 90%, 50%);
  outline-offset: 2px;
  /* No motion needed; outline alone signals focus. */
}

.btn:disabled {
  opacity: 0.5;
  pointer-events: none;
  background: hsl(0, 0%, 80%);      /* Desaturate */
  transition: none;                 /* Snap off; no affordance */
}
```

### Toggle / Checkbox

```javascript
// Framer Motion example
<motion.div
  onClick={() => setChecked(!checked)}
  initial={{ opacity: 0.6 }}
  animate={{ opacity: checked ? 1 : 0.6 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  <motion.svg
    animate={{ rotate: checked ? 0 : 90, scale: checked ? 1 : 0.8 }}
    transition={{ duration: 0.15, type: "tween" }}
  >
    {checked && <path d="M3 10l4 4 8-8" />}
  </motion.svg>
</motion.div>
```
**Key:** Checkbox icon appears *and* spins in; label text color shifts (150ms, ease-out). Feels crisp and confirming.

### Loading States

```html
<!-- Known duration: progress bar + ETA -->
<div class="progress-container">
  <div class="progress-bar" style="width: 65%; animation: none;">
    <!-- No animation on the bar itself; width is authoritative -->
  </div>
  <span class="eta">~12s remaining</span>
</div>

<!-- Unknown duration: indeterminate spinner -->
<div class="spinner">
  <svg viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" style="animation: spin 2s linear infinite; stroke: currentColor;"></circle>
  </svg>
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinner { animation: spin 2s linear infinite; }
</style>
```

**Rule:** Use **indeterminate spinners for unknown waits** (API calls, file uploads). Use **progress bars only with a real denominator** (file size, item count). Fake progress feels insulting.

### Focus Ring (Keyboard Navigation)

```css
.interactive:focus-visible {
  outline: 2px solid hsl(210, 100%, 50%);
  outline-offset: 2px;
  /* No animation; instant is correct here. Focus is *not* a transition. */
}

/* Or animated glow variant (optional flourish): */
.interactive:focus-visible {
  box-shadow: 0 0 0 3px hsl(210, 100%, 50%, 0.3);
  animation: focusGlow 400ms ease-out;
}

@keyframes focusGlow {
  from { box-shadow: 0 0 0 0 hsl(210, 100%, 50%, 0.5); }
}
```

---

## Choreography & Staggering

When multiple elements animate together, stagger their starts to guide the eye and avoid overwhelming the brain:

```javascript
// List item entrance stagger
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 200,
      ease: "easeOut",
      delay: i * 50,  // Each item 50ms after the previous
    }}
  >
    {item.content}
  </motion.div>
))}
```

**Stagger rule:** Max total delay ≤ 500ms. If a list has 10+ items, truncate stagger (only animate first 5 fully; remainder fade in without delay) or use intersection observers to stagger by viewport entry.

---

## Performance: 60fps/120fps & Compositor Only

### The Golden Rule: Transform + Opacity Only

These properties **skip layout recalculation** and run on the compositor thread:

```css
/* ✅ FAST: Runs at 60fps minimum, often 120fps */
.card {
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ❌ SLOW: Triggers layout thrash; 30fps or worse */
.card {
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from { left: -100px; opacity: 0; }           /* Position reflow */
  to { left: 0; opacity: 1; }
}
```

### Will-Change (Hint to Browser)

```css
.draggable {
  will-change: transform;  /* Tell browser to prepare for GPU layer */
}

.draggable.isDragging {
  transform: translate(var(--x), var(--y));
}
```

**Never use `will-change: all` or leave it on permanently.** Add only before animation starts; remove after.

---

## Anti-Patterns & Failure Modes

### 1. **Motion Fatigue** (Repeated Animations Pile Up)

**Symptom:** Hover states, focus rings, and list items all animate together; UI feels jittery and exhausting.

**Detection:** Screen record at 60fps. Count simultaneous animations. More than 3 concurrent eases = fatigue.

**Fix:** 
- Stagger list items (50–100ms deltas).
- Disable hover animations on touch devices (`@media (hover: none)`).
- Use `prefers-reduced-motion: reduce` to swap tween for instant.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. **Linear Easing on Movement** (Robotic, Unreal Feel)

**Symptom:** Motion feels *glassy*, lacking weight; users feel unsettled.

**Detection:** Compare to Material 3 or iOS native motion. If your motion feels "cheaper," easing is likely linear.

**Fix:**
```css
/* Before: linear (wrong) */
.modal {
  animation: slideUp 200ms linear;  /* Bad */
}

/* After: ease-out (correct) */
.modal {
  animation: slideUp 200ms cubic-bezier(0, 0, 0.2, 1);  /* Good */
}
```

### 3. **Overstayed Motion** (Duration > 400ms for Repeated Interactions)

**Symptom:** Users feel blocked; they stop interacting and wait for animation to finish.

**Detection:** Tap a toggle 5 times. Count the total wait. If > 2 seconds, duration is too long.

**Fix:** Shrink duration or use spring to settle naturally:
```javascript
// Before: 500ms tween (user waits, feels slow)
transition={{ duration: 500, ease: "easeOut" }}

// After: 200ms tween + spring (snaps, feels responsive)
transition={{ duration: 200, ease: "easeOut" }}
// OR
transition={{ type: "spring", stiffness: 500, damping: 50 }}
```

### 4. **Fake Progress** (Progress Bar Without Real Denominator)

**Symptom:** Progress bar fills to 90%, then sits for 30s while upload finishes. Users distrust the interface.

**Detection:** Screen record. Does the bar ever reach 100% before the task finishes?

**Fix:**
```javascript
// Before: fake progress (bad)
<div className="progress-bar" style={{ width: `${Math.min(elapsedTime / estimatedTime * 100, 90)}%` }} />

// After: indeterminate spinner (honest)
{uploadProgress.isKnown ? (
  <progress value={uploadProgress.done} max={uploadProgress.total} />
) : (
  <div className="spinner" />
)}
```

### 5. **Vestibular Overload** (Parallax, Scroll-Jacking, Excessive 3D Rotation)

**Symptom:** Users with motion sensitivity (vestibular disorder) feel dizzy, nauseous, or disoriented.

**Detection:** Apply `prefers-reduced-motion: reduce` in DevTools. Does the page still feel usable?

**Fix:**
```css
/* Before: aggressive parallax */
.hero {
  background-attachment: fixed;
  transform: translateY(scrollY * 0.5);  /* Parallax depth */
}

/* After: respect motion preference */
@media (prefers-reduced-motion: reduce) {
  .hero {
    background-attachment: scroll;       /* No parallax */
    transform: none;                      /* No scroll-link */
  }
}
```

### 6. **Animation on Layout Thrash** (Animating Width/Height/Left/Top)

**Symptom:** Smooth on desktop (4-core CPU), choppy on mobile (low CPU budget). Or, DevTools shows dropped frames.

**Detection:** Open DevTools Performance tab. Record animation. If "Layout" or "Recalculate Style" bars are tall, you're thrashing.

**Fix:**
```javascript
// Before: animate height (layout thrash)
<motion.div animate={{ height: open ? "auto" : 0 }} />

/* After: animate transform + clip-path (compositor only) */
<motion.div animate={{ scaleY: open ? 1 : 0 }} style={{ originY: 0 }} />
/* Or: */
<motion.div animate={{ clipPath: open ? "inset(0)" : "inset(100% 0 0 0)" }} />
```

---

## Worked Example: Toast Notification Lifecycle

### Requirements
- Appear when action succeeds (fast feedback).
- Dismiss after 4s or on click.
- Stagger multiple toasts.
- Respect `prefers-reduced-motion`.

### Implementation

```javascript
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Toast({ message, id, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, x: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.2,
        ease: "easeOut",
      }}
      onClick={() => onDismiss(id)}
      className="toast"
    >
      {message}
    </motion.div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    return id;
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast, i) => (
          <motion.div
            key={toast.id}
            layout
            layoutId={`toast-${i}`}
          >
            <Toast {...toast} onDismiss={dismissToast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### CSS

```css
.toast-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast {
  background: hsl(130, 80%, 50%);
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 14px;
  line-height: 1.4;
  will-change: transform, opacity;
}

.toast:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .toast {
    will-change: auto;
  }
}
```

### Breakdown
- **Entrance:** Slide up + fade in (200ms, ease-out). Feels snappy.
- **Exit:** Slide down + fade out (200ms, ease-out). Feels dismissive.
- **Auto-dismiss:** 4s timeout; respects user attention.
- **Layout animation:** Framer's `layout` prop auto-stagger when new toasts stack.
- **Accessibility:** `prefers-reduced-motion` swaps duration to ~1ms (instant feel, no motion sickness).

---

## Quality Gates Checklist

- [ ] **Duration token test:** Every repeated interaction (button press, toggle, focus) finishes in ≤200ms. Full-screen navigation ≤300ms.
- [ ] **Easing rule check:** Entrances use ease-out or emphasized. Exits use ease-in or accelerate. No linear easing on moving objects.
- [ ] **Compositor-only properties:** Animate only `transform` and `opacity`. Screen-record; DevTools Performance panel shows no "Layout" bars during animation.
- [ ] **Prefers-reduced-motion:** Toggle in DevTools. Page is still usable; motion is instant (duration ~0.01ms), not removed entirely.
- [ ] **Vestibular safety:** No parallax, scroll-jacking, or excessive 3D rotation without `prefers-reduced-motion` override.
- [ ] **Progress honesty:** Spinners used for unknown waits. Progress bars only with real byte/item counts. No fake ETA bumping.
- [ ] **Stagger strategy:** List animations stagger ≤50ms between items. Total stagger ≤500ms. No more than 3 concurrent animations per interaction.
- [ ] **Spring tuning:** If using spring physics, test on low-end device (iPhone 11 or older Android). Should settle in ≤500ms; max overshoot 15%.
- [ ] **Micro-interaction completeness:** Hover, press, active, focus-visible, disabled states all have defined transitions (or none, if intentional).
- [ ] **Performance budget:** Record on 4G mobile (Chrome throttling). Animation frame rate ≥50fps (aim for 60). No jank on repeated interactions.

---

## References

- **Material 3 Motion** (Google Design): https://m3.material.io/styles/motion/overview
- **Human Interface Guidelines—Animation** (Apple): https://developer.apple.com/design/human-interface-guidelines/motion
- **Framer Motion Spring Physics**: https://www.framer.com/motion/animation/#spring
- **CSS Easing Functions**: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function
- **prefers-reduced-motion**: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- **Web Vitals & Core Web Vitals**: https://web.dev/performance/

---

**Motion done right is invisible. Done wrong, it's all users see. Build for both the 60fps baseline and the edge case (low-end device, vestibular sensitivity, slow network). Measure, iterate, and ship.**
