# Color & Theming: Semantic Tokens, Accessible Contrast, and Multimode Systems

## Intro

Raw hex colors in components are **the root of evil**. They break at 2am when design changes; they fail accessibility audits; they can't support light+dark modes without component rewrites. This document covers building a **semantic color token system** that scales from web to native, enforces WCAG compliance mathematically, and eliminates designer/developer friction through perceptually-uniform color ramps.

The core principle: **tokens describe intent (primary, surface, error, success), not hex values.** The token resolves to the right color for the current theme, contrast context, and user preference.

---

## Decision Points

### 1. **Perceptual Uniformity: OKLCH vs HSL vs sRGB**

**The Problem:** sRGB linear interpolation is a lie. A ramp of `#ff0000` → `#0000ff` looks like it camps in black mud near the center. HSL lightness is mathematically honest but visually uneven.

**The Fix:** Use **OKLCH** (Oklab chroma hue) for all color math:
- `oklch(70% 0.2 200)` = lightness 70%, chroma (saturation-ish) 0.2, hue 200°
- Perceptually uniform: stepping by equal lightness deltas gives equal visual steps
- Native support: CSS `color: oklch(...)`, no transpiler required
- Works in all modern browsers (2024+); fallback to sRGB with `@supports`

**Comparison:**
```
sRGB linear fade #FF4444 → #4444FF:
  Step 4 (40%) looks black — chroma collapses in the middle

OKLCH fade oklch(60% 0.15 350) → oklch(60% 0.15 250):
  All steps feel equally saturated; hue rotates smoothly
```

**Use HSL only for:** quick prototyping, legacy browsers (fallback), or when you need to shift hue in existing systems.

---

### 2. **Building a Semantic Ramp (Not a "Palette")**

**Standard mistake:** Dumping 50 hex colors into a design tool and calling it a system.

**Right way:** Start with **one neutral + one accent**. Derive the ramp algorithmically.

**Example — Radix Colors / Material 3 approach:**

```
Gray Ramp (neutral surface):
  50:  oklch(99%  0.002 250)  ← nearly white
  100: oklch(97%  0.004 250)
  200: oklch(93%  0.006 250)
  300: oklch(88%  0.008 250)
  400: oklch(76%  0.010 250)
  500: oklch(64%  0.012 250)  ← mid-tone
  600: oklch(52%  0.010 250)
  700: oklch(39%  0.008 250)
  800: oklch(26%  0.006 250)
  900: oklch(12%  0.004 250)  ← nearly black
  950: oklch(5%   0.002 250)

Blue Accent Ramp (primary intent):
  50:  oklch(97%  0.05  260)
  100: oklch(94%  0.10  260)
  200: oklch(87%  0.16  260)
  300: oklch(80%  0.20  260)  ← soft interactive
  400: oklch(72%  0.22  260)
  500: oklch(65%  0.24  260)  ← standard button
  600: oklch(55%  0.22  260)  ← hover
  700: oklch(45%  0.20  260)  ← pressed
  800: oklch(33%  0.18  260)  ← strong state
  900: oklch(20%  0.15  260)
```

**Tokens from ramp:**

```css
/* Semantic tokens derived from ramps */
:root {
  --color-surface:        oklch(99% 0.002 250);  /* Gray 50 */
  --color-surface-subtle: oklch(97% 0.004 250);  /* Gray 100 */
  --color-border:         oklch(88% 0.008 250);  /* Gray 300 */
  --color-text-primary:   oklch(12% 0.004 250);  /* Gray 900 */
  --color-text-secondary: oklch(39% 0.008 250);  /* Gray 700 */
  --color-text-disabled:  oklch(64% 0.012 250);  /* Gray 500 */
  
  --color-primary:        oklch(65% 0.24 260);   /* Blue 500 */
  --color-primary-hover:  oklch(55% 0.22 260);   /* Blue 600 */
  --color-primary-active: oklch(45% 0.20 260);   /* Blue 700 */
  
  --color-error:          oklch(65% 0.24 30);    /* Red 500 */
  --color-error-light:    oklch(87% 0.16 30);    /* Red 200 */
  --color-success:        oklch(65% 0.20 140);   /* Green 500 */
  --color-success-light:  oklch(87% 0.14 140);
  --color-warning:        oklch(70% 0.22 60);    /* Amber 500 */
  
  --color-focus-ring:     oklch(65% 0.24 260);   /* Blue 500, 3px, 2px offset */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface:        oklch(12% 0.004 250);   /* Gray 950 */
    --color-surface-subtle: oklch(26% 0.006 250);   /* Gray 800 */
    --color-border:         oklch(52% 0.010 250);   /* Gray 600 */
    --color-text-primary:   oklch(99% 0.002 250);   /* Gray 50 */
    --color-text-secondary: oklch(88% 0.008 250);   /* Gray 300 */
    
    --color-primary:        oklch(72% 0.22 260);    /* Blue 400 */
    --color-primary-hover:  oklch(80% 0.20 260);    /* Blue 300 */
    --color-primary-active: oklch(87% 0.16 260);    /* Blue 200 */
    
    --color-error:          oklch(72% 0.22 30);
    --color-success:        oklch(72% 0.18 140);
    --color-warning:        oklch(75% 0.20 60);
  }
}
```

**Key insight:** The ramp is **read-only**. Tokens reference it. If a designer says "make the button 10% darker," you adjust the token value (e.g., Blue 600 → Blue 700), not the component.

---

### 3. **WCAG Contrast Math: The Hard Numbers**

**Standards:**
- **AA Normal text:** 4.5:1 (14px+)
- **AA Large text:** 3:1 (18px+ bold or 24px+)
- **AA UI components & borders:** 3:1
- **AAA:** 7:1 (rarely required; overkill for product)

**How to calculate:**
```
Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
where L = relative luminance of sRGB

L = 0.2126 × R + 0.7152 × G + 0.0722 × B
(where R, G, B are normalized to [0, 1] and gamma-corrected)
```

**Practical tools:**
- **WCAG Contrast Checker (WebAIM):** paste hex colors, get ratio
- **Accessible Colors (deque.com):** see pass/fail matrix
- **CSS calc-check:** `contrast()` function in CSS (experimental) or JS libraries (polished, chroma.js)

**Real example — Material 3:**

```
Dark mode button (Blue 400 on Gray 950):
  Blue 400   oklch(72% 0.22 260) → sRGB #4F5DFF → luminance 0.31
  Gray 950   oklch(5% 0.002 250) → sRGB #0F0F1A → luminance 0.002
  
  Contrast = (0.31 + 0.05) / (0.002 + 0.05) = 7.0:1 ✓ AAA
  
Light mode button (Blue 600 on Gray 50):
  Blue 600   oklch(55% 0.22 260) → sRGB #1C47DB → luminance 0.16
  Gray 50    oklch(99% 0.002 250) → sRGB #FBFBFF → luminance 0.99
  
  Contrast = (0.99 + 0.05) / (0.16 + 0.05) = 4.8:1 ✓ AA
```

**Verification workflow:**
1. **Automated:** Axe, Lighthouse, Pa11y in CI
2. **Manual:** Chrome DevTools → Inspect → Accessibility pane → check contrast
3. **Edge cases:** Check on actual devices (phone screens are different); test with colorblind simulators (Sim Daltonism, Coblis)

---

### 4. **Light + Dark Mode: Not Inversion, Symmetry**

**Common failure:** "Just invert the hex" or "use 100% - lightness."

**The right model:**
- **Light mode:** text dark, background light, accents saturated
- **Dark mode:** text light, background dark, accents *desaturated slightly* (high saturation + low lightness = muddy)

**Dark mode gotchas:**
- Don't use pure black (`#000000`) as background; use dark gray (`oklch(5% 0.002 250)`) to prevent OLED burn-in and reduce eye strain
- Accents must be *lighter* in dark mode to maintain 3-4.5:1 contrast on dark surfaces
- Borders should be *lighter* in dark mode (not inverted)

**Token reflection:**

```css
/* Light mode (default) */
:root {
  --color-surface:        oklch(99% 0.002 250);
  --color-text-primary:   oklch(12% 0.004 250);
  --color-primary:        oklch(65% 0.24 260);  /* saturated */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface:        oklch(5% 0.002 250);   /* dark gray, not black */
    --color-text-primary:   oklch(99% 0.002 250);
    --color-primary:        oklch(72% 0.22 260);   /* lightened, chroma reduced */
  }
}
```

**Verify with:** macOS Night Shift, Windows Dark Mode, Android Dark Theme, iOS Dark Mode.

---

### 5. **State Colors: Systematic Derivation**

**States:** default, hover, active/pressed, disabled, focus, loading.

**Anti-pattern:** `--color-primary-hover: #hockeypokey` (picked by eye).

**Right way:**
```css
/* Derive from base token + lightness offset */
:root {
  --color-primary:        oklch(65% 0.24 260);    /* base */
  
  /* Web interactions */
  --color-primary-hover:  oklch(55% 0.22 260);    /* -10% L, chroma ≈ same */
  --color-primary-active: oklch(45% 0.20 260);    /* -20% L */
  --color-primary-focus:  oklch(65% 0.24 260);    /* same as base; drawn as ring */
  
  /* Disabled: desaturate + shift lightness toward surface */
  --color-primary-disabled: oklch(64% 0.12 250); 
    /* ~same lightness as text-secondary, zero hue intent */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:          oklch(72% 0.22 260);
    --color-primary-hover:    oklch(80% 0.20 260);   /* +8% L */
    --color-primary-active:   oklch(87% 0.16 260);   /* +15% L */
    --color-primary-disabled: oklch(52% 0.10 250);
  }
}
```

**Focus rings (WCAG 2.4.7):**
```css
button:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
  /* Contrast ≥ 3:1 between ring and adjacent colors */
}
```

Measure: outline color vs. both the button bg *and* the page bg.

---

### 6. **Data-Viz Colors vs. Chrome**

**Chrome (UI):** 8–12 colors max. Semantic (primary, error, success, warning, etc.). Reuse aggressively.

**Data-viz (charts, heatmaps):** 4–12 *distinct* colors, perceptually uniform, colorblind-safe.

**Never mix:** Don't use your error-red for a data series that isn't an error. Create separate semantic sets.

**Colorblind palette:** Use Okabe–Ito palette (8 colors, designed for accessibility) or Paul Tol's schemes (colorbrewer2.org). Test with Sim Daltonism.

```css
/* Chrome: 6 semantic colors */
--color-primary: oklch(65% 0.24 260);   /* blue */
--color-error:   oklch(65% 0.24 30);    /* red */
--color-success: oklch(65% 0.20 140);   /* green */
--color-warning: oklch(70% 0.22 60);    /* amber */
--color-info:    oklch(68% 0.20 200);   /* cyan */
--color-neutral: oklch(50% 0.10 250);   /* gray */

/* Data-viz: 8 distinct, accessible colors */
--dataviz-1: oklch(65% 0.20 30);    /* red */
--dataviz-2: oklch(65% 0.20 90);    /* yellow */
--dataviz-3: oklch(65% 0.20 140);   /* green */
--dataviz-4: oklch(65% 0.20 200);   /* cyan */
--dataviz-5: oklch(65% 0.22 260);   /* blue */
--dataviz-6: oklch(65% 0.20 300);   /* purple */
--dataviz-7: oklch(65% 0.18 25);    /* pink */
--dataviz-8: oklch(65% 0.10 250);   /* gray */
```

---

### 7. **Theming Architecture: CSS, Design Tokens, Native**

**Web layer:**
```html
<!-- Root theme in <html> -->
<html data-theme="light">
  <body>
    <button style="background: var(--color-primary); color: var(--color-text);">
      Sign Up
    </button>
  </body>
</html>
```

```css
/* CSS custom properties (cascade) */
:root {
  /* Light theme (default) */
  --color-surface: oklch(99% 0.002 250);
  --color-text: oklch(12% 0.004 250);
  --color-primary: oklch(65% 0.24 260);
}

/* Dark theme (prefers-color-scheme or data attribute) */
@media (prefers-color-scheme: dark),
       [data-theme="dark"] {
  :root {
    --color-surface: oklch(5% 0.002 250);
    --color-text: oklch(99% 0.002 250);
    --color-primary: oklch(72% 0.22 260);
  }
}

/* Component uses tokens */
button {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: 1px solid var(--color-border);
}

button:hover {
  background-color: var(--color-primary-hover);
}
```

**Design tokens (tool-agnostic):**

Use a format like **Design Tokens Format Module** (W3C draft) or Tokens Studio JSON:

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": "{color.blue.500}"
    },
    "primary-hover": {
      "$type": "color",
      "$value": "{color.blue.600}"
    }
  },
  "blue": {
    "500": {
      "$type": "color",
      "$value": "oklch(65% 0.24 260)"
    },
    "600": {
      "$type": "color",
      "$value": "oklch(55% 0.22 260)"
    }
  }
}
```

Export to: CSS, SCSS, TypeScript, JSON, Tailwind config.

**Native (iOS / Android):**

```swift
// SwiftUI (iOS)
let colorTokens = ColorTokens(
  primary: Color(red: 0.31, green: 0.37, blue: 1.0),  // oklch(65% 0.24 260) → sRGB
  primaryHover: Color(red: 0.11, green: 0.28, blue: 0.86),
  surface: Color(red: 0.99, green: 0.99, blue: 1.0)
)

Button("Sign Up") {
  // action
}
.background(colorTokens.primary)
.foregroundColor(.white)
```

**Sync strategy:** Share token JSON from a single source. Use code generators (Figma → Design Tokens Export, Tokens Studio → all platforms).

---

## Anti-Patterns / Failure Modes

### **1. "Invisible in Light Mode"**

**Symptom:** Button text or icon is invisible on button background (both light).

**Detection rule:** Use WCAG Contrast Checker. If ratio < 3:1, fail.

**Example:**
```
Background: oklch(95% 0.05 260) (light blue)
Text: oklch(90% 0.04 250) (light gray)
Contrast: ~1.2:1 → FAIL
```

**Fix:**
```
/* Option A: Darken text */
Text: oklch(40% 0.10 250) → contrast jumps to 6:1 ✓

/* Option B: Darken background */
Background: oklch(80% 0.15 260) → contrast 4.8:1 ✓

/* Option C: Flip the token reference (light bg → dark text) */
button {
  background: var(--color-primary-light);  /* oklch(87% 0.16 260) */
  color: var(--color-text-on-primary-light);  /* oklch(30% 0.05 260) */
}
```

---

### **2. "Rainbow Vomit"**

**Symptom:** Every UI element has a different color. User can't distinguish states (hover, error, focus) from intent (primary, info, warning).

**Detection rule:** Count unique colors in a 400×400px screenshot. If > 8, too many.

**Example failure:**
```css
.button-primary { background: #0066FF; }
.button-secondary { background: #00CC66; }
.button-tertiary { background: #FF6600; }
.input-focus { border-color: #FF00FF; }  /* random */
.error { color: #FF0000; }                /* different red */
.success { color: #00FF00; }              /* neon, different green */
.disabled { opacity: 0.4; }
/* Plus 20 more shades picked from a tool... */
```

**Fix:**
```css
/* Constraint: 1 primary, 1 accent, 1 error, 1 success, 1 warning, 1 neutral. Derive states from those. */
:root {
  --color-primary: oklch(65% 0.24 260);       /* blue */
  --color-error: oklch(65% 0.24 30);          /* red */
  --color-success: oklch(65% 0.20 140);       /* green */
  --color-warning: oklch(70% 0.22 60);        /* amber */
  --color-neutral: oklch(50% 0.10 250);       /* gray */
}

button { background: var(--color-primary); }
button:hover { background: oklch(55% 0.22 260); }  /* 10% darker */
button:active { background: oklch(45% 0.20 260); } /* 20% darker */

[role="alert"] { color: var(--color-error); }
[role="status"] { color: var(--color-success); }
```

---

### **3. "Inverted Dark Mode"**

**Symptom:** Dark mode is `filter: invert(100%)`. Saturation is blown out. Text on dark bg is high-contrast but fatiguing.

**Detection rule:** Run contrast checker on dark mode. If all ratios > 8:1, likely over-saturated.

**Example failure:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(99% 0.002 250);  /* WRONG: white */
    --color-primary: oklch(2% 0.24 260);    /* WRONG: near-black, saturated */
    --color-text: oklch(2% 0.002 250);      /* pure black text on white? No. */
  }
}
```

**Fix:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(5% 0.002 250);    /* dark gray */
    --color-primary: oklch(72% 0.22 260);    /* lighter, less saturated */
    --color-text: oklch(99% 0.002 250);      /* light gray (not white) */
  }
}
```

**Verify:** Dark mode on an OLED phone in a dark room. Text should be readable, not burning your retinas.

---

### **4. "Stateless Components"**

**Symptom:** Button has no hover state, or hover state is hardcoded hex instead of a token.

**Detection rule:** Hover over every interactive element. If nothing changes, or if it's unpredictable, fail.

**Example failure:**
```css
button {
  background-color: #0066FF;
}
button:hover {
  background-color: #0052CC;  /* random darkening, not token-based */
}
```

**Fix:**
```css
button {
  background-color: var(--color-primary);
}
button:hover {
  background-color: var(--color-primary-hover);
}

/* Token system derives the hover color; component only references it */
```

---

### **5. "No Focus Rings"**

**Symptom:** Tab through UI; elements disappear. Keyboard users can't navigate.

**Detection rule:** Use Tab key. Can you see focus ring on every interactive element?

**Fix:**
```css
button:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Verify contrast of ring vs. background */
input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary);
  /* Expand focus indicator beyond border */
}
```

---

### **6. "Hardcoded Hex in Components"**

**Symptom:** Colors are `background: #FF6B35` inside `.tsx` or `.jsx`. Theme change requires find-and-replace.

**Detection rule:** Grep: `style=".*#[A-F0-9]{6}"` or `background.*#`. Any match = fail.

**Example failure:**
```jsx
function Button() {
  return <button style={{ background: '#0066FF' }}>Click</button>;
}
```

**Fix:**
```jsx
function Button() {
  return (
    <button 
      style={{ background: 'var(--color-primary)' }}
      className="btn-primary"
    >
      Click
    </button>
  );
}

/* In CSS */
.btn-primary {
  background-color: var(--color-primary);
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
}
```

---

## Worked Example: From Flat Hex to Semantic Tokens

### **Before (Flat, Hard-Coded):**

```jsx
// components/Button.tsx
const Button = ({ variant = 'primary' }) => {
  const colorMap = {
    primary: '#0066FF',
    secondary: '#6C757D',
    danger: '#DC3545',
    success: '#28A745'
  };
  
  const styles = {
    backgroundColor: colorMap[variant],
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer'
  };
  
  return <button style={styles}>Click me</button>;
};
```

**Problems:**
- No dark mode.
- No hover/active states.
- Success color (#28A745) doesn't match error (#DC3545) saturation.
- Hardcoded white text fails contrast on light backgrounds.
- Can't adjust all buttons globally for brand change.

### **After (Semantic Token System):**

```css
/* tokens.css */
:root {
  /* Gray ramp */
  --gray-50:  oklch(99% 0.002 250);
  --gray-100: oklch(97% 0.004 250);
  --gray-300: oklch(88% 0.008 250);
  --gray-500: oklch(64% 0.012 250);
  --gray-700: oklch(39% 0.008 250);
  --gray-900: oklch(12% 0.004 250);
  
  /* Blue ramp (primary) */
  --blue-300: oklch(80% 0.20 260);
  --blue-500: oklch(65% 0.24 260);
  --blue-600: oklch(55% 0.22 260);
  --blue-700: oklch(45% 0.20 260);
  
  /* Red ramp (error) */
  --red-300: oklch(82% 0.18 30);
  --red-500: oklch(65% 0.24 30);
  --red-600: oklch(55% 0.22 30);
  
  /* Green ramp (success) */
  --green-300: oklch(82% 0.16 140);
  --green-500: oklch(65% 0.20 140);
  --green-600: oklch(55% 0.18 140);
  
  /* Semantic tokens */
  --color-primary:          var(--blue-500);
  --color-primary-hover:    var(--blue-600);
  --color-primary-active:   var(--blue-700);
  --color-primary-light:    var(--blue-300);
  
  --color-error:            var(--red-500);
  --color-error-hover:      var(--red-600);
  --color-error-light:      var(--red-300);
  
  --color-success:          var(--green-500);
  --color-success-hover:    var(--green-600);
  --color-success-light:    var(--green-300);
  
  --color-surface:          var(--gray-50);
  --color-surface-subtle:   var(--gray-100);
  --color-text-primary:     var(--gray-900);
  --color-text-secondary:   var(--gray-700);
  --color-text-on-primary:  var(--gray-50);
  --color-border:           var(--gray-300);
  
  --color-focus-ring:       var(--blue-500);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:          var(--blue-400);  /* lighter in dark */
    --color-primary-hover:    var(--blue-300);
    --color-primary-active:   var(--blue-200);
    --color-primary-light:    var(--blue-500);
    
    --color-surface:          var(--gray-950);
    --color-surface-subtle:   var(--gray-800);
    --color-text-primary:     var(--gray-50);
    --color-text-secondary:   var(--gray-300);
    --color-border:           var(--gray-600);
    
    --color-focus-ring:       var(--blue-300);
  }
}
```

```jsx
// components/Button.tsx (refactored)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', children }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};

export default Button;
```

```css
/* components/Button.css */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: 1px solid transparent;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-primary:active {
  background-color: var(--color-primary-active);
}

.btn-primary:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.btn-primary:disabled {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-danger {
  background-color: var(--color-error);
  color: var(--color-text-on-primary);
}

.btn-danger:hover {
  background-color: var(--color-error-hover);
}

.btn-success {
  background-color: var(--color-success);
  color: var(--color-text-on-primary);
}

.btn-success:hover {
  background-color: var(--color-success-hover);
}

.btn-secondary {
  background-color: var(--color-surface-subtle);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-surface);
}
```

**Outcome:**
- Light + dark modes supported automatically.
- Consistent hover/active/disabled states across all variants.
- One color system change updates all buttons.
- WCAG 4.5:1 contrast guaranteed by token design.
- New brand color? Change `--blue-500` in one place.

---

## Quality Gates

- [ ] **No hardcoded hex in components.** All colors reference CSS custom properties.
- [ ] **Semantic tokens defined for all states.** Default, hover, active, disabled, focus, loading.
- [ ] **Light + dark modes both tested.** Use `prefers-color-scheme: dark` + manual `[data-theme="dark"]` override.
- [ ] **WCAG contrast verified.** Body text 4.5:1, UI elements 3:1. Use WebAIM or automated tools.
- [ ] **Color ramp is perceptually uniform.** Use OKLCH; verify steps look equal by eye.
- [ ] **Focus rings visible and contrasting.** Tab through entire UI; outline ≥ 3px, offset ≥ 2px.
- [ ] **No colors in components.** Grep for `#[A-F0-9]{6}`, `rgb(`, `hsl(` in `.jsx/.tsx/.css`. Zero matches.
- [ ] **State colors derived systematically.** Hover = base – 10% L, active = base – 20% L (light mode); reversed or offset in dark mode.
- [ ] **Colorblind-safe.** Test with Okabe–Ito or Paul Tol palette. Sim Daltonism simulator.
- [ ] **Token JSON exportable.** Design Tokens Format Module or tool-specific format. Sync to code generators.
- [ ] **Disabled state is visually distinct.** Not just opacity; desaturate + shift hue toward neutral.
- [ ] **Data-viz palette separate from chrome.** 4–12 distinct, accessible colors for charts. Not reused for UI states.

---

## References & Tools

- **Radix Colors:** radix-ui.com/colors — production-grade ramps (perceptually uniform, both modes)
- **Material 3 Color System:** m3.material.io/styles/color — semantic intent model, accessible by design
- **Tailwind Palette:** tailwindcss.com/docs/customizing-colors — pre-built, extensible
- **OKLCH Picker:** oklch.dev — real-time OKLCH ↔ hex conversion
- **WebAIM Contrast Checker:** webaim.org/resources/contrastchecker
- **Accessible Colors (Deque):** accessible-colors.com — matrix of pass/fail combos
- **Okabe–Ito palette:** jfly.uni-koeln.de/color — 8-color set for colorblind accessibility
- **Paul Tol's Schemes:** https://personal.sron.nl/~pault/colourschemes.pdf — professional data-viz palettes
- **Sim Daltonism:** michelf.ca/projects/sim-daltonism — macOS app, real-time colorblind preview
- **Chroma.js:** chroma.js.org — color math, contrast calc, ramp generation
- **Polished:** polished.js.org — color utilities for JS (lighten, darken, saturate, etc.)
- **W3C Design Tokens Format Module:** w3c.github.io/design-tokens — token spec (draft)
- **Tokens Studio (Figma):** tokens.studio — design token management + code export

---
