---
license: Apache-2.0
category: Design & Creative
tags:
  - dark-mode
  - theming
  - design
  - accessibility
  - contrast
---

# Dark Mode Design Expert

Master dark mode UI design with atmospheric theming, WCAG accessibility, and cross-platform best practices. Specializes in weather/sky/ocean-inspired color systems that adapt to time of day and environmental conditions.

## Decision Points

### When Dark Mode is Right for the User

```
IF user environment = bright (outdoor/office) AND device ≠ OLED
  → Recommend light mode (better readability)

ELSE IF user environment = low light (evening/bedroom)
  → Activate dark mode (reduce eye strain)

ELSE IF device = OLED AND battery concern = high
  → Suggest dark mode (39-47% power savings at max brightness)

ELSE IF user has astigmatism flags (accessibility preference)
  → Default to light mode (dark text prevents halation)

ELSE
  → Respect system preference (prefers-color-scheme)
```

### Contrast Ratio Decision Tree

```
FOR text content:
  IF text size ≥ 24px (large text)
    → Target 4.5:1 minimum, 7:1 ideal
  ELSE IF body text
    → Target 7:1+ (AAA compliance)
  ELSE IF disabled/decorative
    → 3:1 acceptable

FOR interactive elements:
  IF primary action button
    → 4.5:1+ against background
  ELSE IF border/icon
    → 3:1+ minimum
```

### Elevation Method Selection

```
IF theme = light mode
  → Use box-shadow for elevation
  → Shadows = rgba(0,0,0,0.1-0.3)

ELSE IF theme = dark mode
  → Use lighter surface colors
  → Each level = base + 5-11% white overlay
  → NO shadows (invisible on dark)

ELSE IF theme = atmospheric (storm/night)
  → Use colored glow effects
  → box-shadow with theme accent color
```

### Color Adjustment Strategy

```
IF switching light → dark:
  IF color lightness > 70%
    → Increase saturation 10-20%
    → Reduce lightness to 40-60%
  
  IF color is brand primary
    → Use 400-level instead of 600-level
    → Test against dark background
  
  IF color is gray/neutral
    → Invert but avoid pure white/black
    → Use #f1f5f9 instead of #ffffff

ELSE IF switching dark → light:
  → Reverse above rules
  → Test readability on white background
```

## Failure Modes

### 1. Pure Black Syndrome
**Symptoms:** Background is #000000, text is #ffffff, harsh contrast
**Detection:** Check if background HSL lightness = 0%
**Fix:** Replace with near-black (#0c1222, #121212) and off-white (#f1f5f9)

### 2. Shadow Invisibility
**Symptoms:** Cards have no elevation in dark mode, UI feels flat
**Detection:** box-shadow values unchanged between themes
**Fix:** Replace shadows with lighter surface colors in dark mode
```css
/* Wrong */
.card { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

/* Right */
:root.theme-dark .card { 
  background: var(--surface-elevated); 
  box-shadow: none; 
}
```

### 3. Color Inversion Laziness
**Symptoms:** Colors look washed out or invisible in dark mode
**Detection:** Same hex values used in both themes
**Fix:** Manually adjust each color for its new background context

### 4. Flash of Wrong Theme (FOWT)
**Symptoms:** Page loads light, then flashes to dark after 100-200ms
**Detection:** Theme change visible during page load
**Fix:** Inline blocking script in `<head>` before any CSS:
```html
<script>
(function(){
  if(localStorage.theme==='dark')
    document.documentElement.classList.add('theme-dark');
})();
</script>
```

### 5. System Preference Ignorance
**Symptoms:** App forces one theme regardless of user's OS setting
**Detection:** No `prefers-color-scheme` media queries
**Fix:** Default to system preference, allow manual override

## Worked Examples

### Example 1: Weather App Dashboard Theming

**Scenario:** Building a weather app that shows current conditions with background that matches the weather and time of day.

**User Context:** 
- Time: 8:30 PM (night)
- Weather: Clear skies
- Device: iPhone with OLED screen
- User preference: System (dark mode enabled)

**Decision Process:**
1. **Time-based atmosphere:** 8:30 PM → Night theme (deep blues, bioluminescent accents)
2. **Weather modifier:** Clear skies → No storm effects, use starry gradient
3. **Device optimization:** OLED → Prioritize true blacks for battery savings
4. **System preference:** Dark mode → Confirm night theme choice

**Implementation:**
```css
/* Night + Clear Weather */
:root.atmosphere-night-clear {
  --bg-primary: #0c1222;        /* Deep navy, not pure black */
  --bg-elevated: #1a1f3a;       /* Lighter for cards */
  --text-primary: #f1f5f9;      /* Off-white, not pure white */
  --accent: #22d3ee;            /* Cyan for bioluminescent feel */
  
  /* Starry effect */
  background-image: radial-gradient(
    circle at 20% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 50%
  );
}
```

**What novice would miss:**
- Using pure black (#000) causing OLED smearing
- Same accent color as light mode becoming invisible
- No elevation strategy for dark cards

**Expert catches:**
- Near-black with blue tint maintains atmosphere
- Brighter cyan accent maintains visibility
- Lighter surfaces create elevation without shadows

### Example 2: Dashboard with Accessibility Conflict

**Scenario:** Enterprise dashboard needs to support users with astigmatism (prefer light mode) and users with light sensitivity (prefer dark mode).

**Conflict:** Astigmatism users experience "halation" (text bleeding) in dark mode, while light-sensitive users get eye strain from light mode.

**Decision Process:**
1. **Detect accessibility preferences:** Check for `prefers-reduced-contrast` and user-set preferences
2. **Compromise solution:** Medium contrast theme that works for both groups
3. **Escape hatches:** Explicit high-contrast and extra-dark options

**Implementation:**
```css
/* Medium contrast theme */
:root.theme-accessible {
  --bg-primary: #1e293b;        /* Not too dark */
  --bg-elevated: #334155;       /* Clear hierarchy */
  --text-primary: #e2e8f0;      /* Not pure white */
  --contrast-ratio: 12:1;       /* Between 7:1 and 21:1 */
}

/* High contrast escape hatch */
:root.theme-high-contrast {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --contrast-ratio: 21:1;
}
```

**Expert considerations:**
- Provides theme options rather than forcing one choice
- Tests contrast ratios programmatically
- Offers escape hatches for extreme preferences

### Example 3: OLED Battery Optimization Conflict

**Scenario:** Mobile news app user reports poor battery life, but switching to dark mode makes article text harder to read.

**Analysis:**
- User is outdoors frequently (bright environment)
- OLED phone at 80%+ brightness most of the time
- Dark mode would save 35% battery but reduces readability

**Decision Process:**
1. **Environment detection:** Use ambient light sensor if available
2. **Adaptive brightness:** Auto-adjust contrast based on screen brightness
3. **Smart defaults:** Dark mode when brightness >70% AND environment is controlled

**Implementation:**
```css
/* Brightness-adaptive contrast */
:root.brightness-high {
  /* Higher contrast for outdoor reading */
  --text-primary: #000000;      /* Pure black for maximum contrast */
  --bg-primary: #ffffff;        /* Pure white background */
}

:root.brightness-low {
  /* Lower contrast for indoor comfort */
  --text-primary: #f1f5f9;
  --bg-primary: #0c1222;
}
```

**What novice would miss:**
- Assuming dark mode is always better for OLED
- Not considering reading environment
- Fixed contrast ratios regardless of brightness

**Expert solution:**
- Context-aware theming based on device state
- Battery vs. readability trade-offs clearly communicated
- User education about when each mode works best

## Quality Gates

- [ ] Primary text contrast ≥7:1 in both themes (AAA compliance)
- [ ] Interactive elements contrast ≥4.5:1 (AA compliance)
- [ ] Focus indicators clearly visible in both themes
- [ ] Elevation hierarchy works without shadows in dark mode
- [ ] No pure black (#000000) or pure white (#ffffff) backgrounds
- [ ] Color adjustments made for each theme (not simple inversion)
- [ ] System preference respected on first load (prefers-color-scheme)
- [ ] No flash of wrong theme during page load
- [ ] Theme preference persists across sessions
- [ ] OLED-optimized colors when device supports it

## NOT-FOR Boundaries

**This skill handles dark mode implementation. For other needs:**

- **Color palette creation** → Use `color-theory-palette-harmony-expert` instead
- **Typography in themes** → Use `typography-expert` for font selection and sizing  
- **Component library structure** → Use `design-system-creator` for broader architecture
- **Specific contrast auditing** → Use `color-contrast-auditor` for testing color pairs
- **Brand identity decisions** → Use `web-design-expert` for overall visual direction
- **Animation/interaction** → Use `frontend-expert` for theme transition animations

**Delegate when you see:**
- Requests to create entirely new color palettes from scratch
- Questions about font pairing or typography hierarchy
- Component architecture decisions beyond theming
- Specific WCAG audit requirements for compliance documentation
- Brand strategy or identity design questions