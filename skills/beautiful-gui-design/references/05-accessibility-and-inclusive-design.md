# Accessibility & Inclusive Design: WCAG 2.2 AA Essentials

## Quick Take

True accessibility is a design discipline, not a retrofit. Semantic HTML + keyboard operability + perceivable contrast + meaningful labels = the foundation. ARIA bridges gaps *only* where native semantics cannot. Never remove focus indicators without replacement. Test with actual assistive technology (VoiceOver, NVDA, TalkBack), not just automated checkers.

---

## Decision Points

### 1. Semantic HTML First, ARIA Second
- **Principle**: A `<button>` beats a `<div role="button">` 100% of the time.
- **Why**: Native elements ship with keyboard behavior, focus management, announcements, and mobile semantics.
- **Rule**: Use semantic elements (`<button>`, `<input>`, `<nav>`, `<main>`, `<dialog>`, `<label>`) before adding `role=""` or `aria-*` attributes.
- **Cost of violation**: Screen reader users hear "region" instead of "navigation"; keyboard users cannot tab or space-activate; mobile assistive tech fails silently.

### 2. Keyboard Operability is Non-Negotiable
- **Expect**: Every interactive element operable via Tab, Shift+Tab, Enter/Space, arrow keys, Escape (for modals/popovers).
- **Focus order**: Must match visual/logical flow; no `tabindex > 0` except rare fixed-position persistent controls.
- **Visible focus indicator**: Minimum 2px, 3:1 contrast against background (WCAG 2.2 SC 2.4.11). Never `outline: none` without replacement.
- **Spec**: WCAG 2.2 SC 2.1.1 (Keyboard) + SC 2.4.3 (Focus Order) + SC 2.4.7 (Visible Focus).

### 3. Color is Never the Only Signal
- **Anti-pattern**: "Click the red button to confirm" or error states signaled by red text alone.
- **Fix**: Pair color with icon (✕ for error), text label ("Error:"), or border style (solid vs. dashed).
- **Contrast floor**: 4.5:1 for text / 3:1 for large text (18pt+) or graphics (WCAG 2.2 SC 1.4.3 + SC 1.4.11).
- **Link detection**: Links must be distinguishable from body text by *more* than color (underline, bold, icon, background).

### 4. Touch Targets & Spacing
- **iOS**: 44×44 points (Apple HIG; also ~130 pixels on 3× Retina).
- **Android**: 48dp minimum (Material Design).
- **WCAG 2.2 SC 2.5.5 (Target Size)**: 24×24 CSS pixels minimum; 48×48 for most controls, 44×44 acceptable if other spacing/contrast mitigation.
- **Spacing rule**: If buttons are 24×24, separate them by ≥8px to prevent accidental taps.
- **Do not ignore**: Finger size ≈10mm; tremor, arthritis, motor impairments expand minimum.

### 5. Focus Management & Modal Traps
- **Opening a modal**: Move focus to the first interactive element (or `.focus()` on a header).
- **Modal trap**: Keyboard focus must cycle *within* the modal only; Tab+Enter from last element → first element (not the page behind).
- **Closing**: Escape key closes; focus returns to the trigger element.
- **Implementation**: Use `<dialog>` (native) or `role="dialog"` + `aria-modal="true"` + programmatic focus trap.

### 6. Live Regions for Dynamic Content
- **Use case**: Toast notifications, real-time search results, data table updates.
- **Technique**: `role="status"` (alert-like, non-intrusive) or `role="alert"` (urgent, interrupts SR).
- **`aria-live="polite"` (default)** waits for SR to finish; `aria-live="assertive"` interrupts.
- **Combine with `aria-atomic="true"`** to announce whole region, not diffs.
- **Never overuse**: Live regions for static content bloat the experience.

### 7. Form Labels & Error Messaging
- **Association**: `<label for="input-id">` + `<input id="input-id">` — explicit, accessible in all browsers.
- **Placeholder ≠ label**: Placeholders vanish on focus; use labels + optional placeholder for UX hint.
- **Error messaging**: 
  - Associate error text via `aria-describedby="error-msg"`.
  - Include error icon + color + text ("Email is invalid. Use name@domain.com.").
  - Announce errors at form submission (trap focus, `role="alert"` on error summary, or `aria-live="assertive"` on first field).
- **Autocomplete**: Use `<input autocomplete="email">`, `autocomplete="password"` to assist password managers and SR users.

### 8. Reduced Motion & Transparency
- **Prefers reduced motion**: Respect `prefers-reduced-motion: reduce` (SC 2.3.3).
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important; }
  }
  ```
- **Reduced transparency**: `prefers-reduced-transparency: reduce` for users with low vision.
- **Do not autoplay**: Video, audio, carousels. Offer manual controls.

### 9. Text Sizing & Zoom
- **Body text minimum**: 14px (per skill house rules); 16px preferred for mobile.
- **Never** `user-scalable=no` or `maximum-scale=1` in viewport meta tag.
- **Dynamic Type** (iOS) and responsive text scale (Android): Use `rem` units pegged to `:root` font-size.
- **Responsive**: 14–16px on mobile, scale up to 18px on desktop.

### 10. Screen Reader Labels & Hidden Content
- **`aria-label`**: For icon-only buttons: `<button aria-label="Close menu">✕</button>`.
- **`aria-labelledby`**: Link visual label to interactive element: `<h2 id="modal-title">Confirm</h2><button aria-labelledby="modal-title">OK</button>`.
- **Hidden from SR**: `aria-hidden="true"` for decorative elements, `<span class="sr-only">` for text visible only to SR.
- **SR-only CSS pattern**:
  ```css
  .sr-only { position: absolute; width: 1px; height: 1px; 
             overflow: hidden; clip: rect(0, 0, 0, 0); }
  ```

---

## Anti-Patterns & Failure Modes

### ❌ Removed Focus Outline (No Replacement)
**Symptom**: Keyboard user cannot see where they are; focus appears to vanish.  
**Detection rule**: `outline: none` without `:focus-visible { outline: ... }` or `:focus { box-shadow: ... }`.  
**Fix**: Provide a clear focus style:
```css
button:focus-visible { 
  outline: 3px solid #0066cc; 
  outline-offset: 2px; 
}
```
Or use box-shadow for subtle designs:
```css
button:focus-visible { box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.25); }
```

### ❌ Color-Only Error Indication
**Symptom**: Red text disappears for colorblind users; no other signal that field is invalid.  
**Detection rule**: Error state has color but no icon, text label, or border style change.  
**Fix**: 
```html
<div class="form-group">
  <label for="email">Email</label>
  <input id="email" aria-describedby="email-error" />
  <div id="email-error" role="alert">
    ✗ Invalid email format
  </div>
</div>
```
```css
.form-group [aria-describedby] { border: 2px solid #cc0000; }
```

### ❌ Missing `<label>` Association (Relying on Proximity)
**Symptom**: Checkbox / radio label not clickable; SR user doesn't know what field is for.  
**Detection rule**: `<input>` and text are siblings with no `for` / `id` binding, or label is outside a `<label>` tag.  
**Fix**:
```html
<!-- Bad -->
<input type="checkbox"> Remember me

<!-- Good -->
<input id="remember" type="checkbox">
<label for="remember">Remember me</label>
```

### ❌ `<div>` or `<span>` as Button (Missing Keyboard Behavior)
**Symptom**: Click works; Tab doesn't; Spacebar does nothing; SR announces "image" or generic "region".  
**Detection rule**: Interactive element is not `<button>`, `<a>`, `<input>`, or does not have `role="button"` + `tabindex="0"` + KeyDown listener.  
**Fix**:
```html
<!-- Bad -->
<div onclick="doThing()">Click me</div>

<!-- Good -->
<button onclick="doThing()">Click me</button>
```

### ❌ Empty Icon Buttons (No Accessible Label)
**Symptom**: Screen reader announces "button" with no action hint; sighted user guesses from icon.  
**Detection rule**: `<button>` has only an `<img>` or SVG with no alt text / aria-label / hidden text.  
**Fix**:
```html
<button aria-label="Search">
  <svg viewBox="0 0 24 24"><!-- magnifying glass --></svg>
</button>
```

### ❌ Modal Without Focus Trap or Escape
**Symptom**: Keyboard user tabs behind modal; Escape does nothing; focus not restored on close.  
**Detection rule**: Modal is `display: none/block`; no `role="dialog"` + `aria-modal="true"`; no focus trap logic; no Escape listener.  
**Fix**:
```html
<dialog id="modal" aria-modal="true">
  <button onclick="this.closest('dialog').close()">Close (Esc)</button>
  <!-- content -->
</dialog>
```
```js
document.getElementById('modal').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') this.close();
});
```

### ❌ Contrast Failure (Text vs. Background)
**Symptom**: Light gray text on white background; unreadable to low-vision users.  
**Detection rule**: Text contrast < 4.5:1 (small) or < 3:1 (large/graphics). Test with axe / WAVE / Stark contrast plugin.  
**Fix**: Increase darkness of text or reduce lightness of background.
```css
/* Bad: #999 on #fff = 4.47:1, borderline */
color: #999; 

/* Good: #666 on #fff = 7:1 */
color: #666;
```

### ❌ Autoplay Video / Audio
**Symptom**: User clicks page, loud video plays unexpectedly; SR user skips page entirely; cognitive load spike.  
**Detection rule**: `<video autoplay>` or audio starts on page load.  
**Fix**:
```html
<!-- Good: User controls, no autoplay -->
<video controls>
  <source src="video.mp4" type="video/mp4">
</video>
```

### ❌ Missing Form Field Error Recovery
**Symptom**: User submits form; errors appear scattered; focus not moved; user doesn't know where to fix.  
**Detection rule**: Form submission fails; no `aria-live` alert; focus stays at submit button.  
**Fix**:
```html
<div id="error-summary" role="alert" aria-live="assertive">
  <h2>Please fix 2 errors:</h2>
  <ul>
    <li><a href="#email">Email is invalid</a></li>
    <li><a href="#password">Password too short</a></li>
  </ul>
</div>
```

---

## Worked Example: Inaccessible → Accessible Modal

### Before (Inaccessible)
```html
<div class="modal" onclick="closeModal()">
  <div class="modal-content">
    <span class="close">×</span>
    <h2>Confirm Action</h2>
    <p style="color: red;">This action cannot be undone.</p>
    <button style="background: red; color: red;">Cancel</button>
    <button style="background: green;">OK</button>
  </div>
</div>
```
**Problems**:
- `<div>` modal; no `role="dialog"` or `aria-modal`.
- Close icon `×` is `<span>`, not keyboard-operable.
- Red warning text with no icon; color-blind users miss it.
- Button colors are not distinct from text (red-on-red fail).
- No focus trap; Tab escapes; no Escape to close.
- No focus restoration.

### After (Accessible)
```html
<dialog id="confirm-modal" aria-labelledby="modal-title">
  <div class="modal-content">
    <button 
      class="modal-close" 
      aria-label="Close dialog"
      onclick="document.getElementById('confirm-modal').close()">
      ✕
    </button>
    
    <h2 id="modal-title">Confirm Action</h2>
    <div role="alert" class="warning">
      <span aria-hidden="true">⚠</span>
      <strong>This action cannot be undone.</strong>
    </div>
    
    <div class="modal-buttons">
      <button class="btn-secondary" onclick="document.getElementById('confirm-modal').close()">
        Cancel
      </button>
      <button class="btn-primary" onclick="handleConfirm()">
        OK
      </button>
    </div>
  </div>
</dialog>

<style>
dialog[open] { display: block; }
.warning { 
  border-left: 4px solid #cc6600; 
  padding: 1rem; 
  background: #fff5f0; 
}
.btn-secondary, .btn-primary { 
  min-width: 120px; 
  padding: 12px 24px; 
  border: 2px solid; 
  font-size: 16px;
}
.btn-secondary { 
  background: white; 
  color: #333;
  border-color: #ccc;
}
.btn-primary { 
  background: #0066cc; 
  color: white;
  border-color: transparent;
}
button:focus-visible { 
  outline: 3px solid #ff9800; 
  outline-offset: 2px; 
}
</style>

<script>
const modal = document.getElementById('confirm-modal');
modal.addEventListener('close', () => {
  // Restore focus to trigger element
  document.activeElement.blur();
  triggerBtn.focus();
});
</script>
```
**Fixes**:
- Native `<dialog>` element; semantic modal.
- Close button is `<button>`; Tab-operable; `aria-label`.
- Warning has icon + border + strong text; accessible to all.
- Buttons have 3:1+ contrast, distinct visual styling, 44×44+ touch targets.
- `<dialog>` auto-traps focus; Escape closes natively.

---

## Testing Workflow

### Keyboard-Only Pass (No Mouse)
1. Unplug mouse or disable trackpad.
2. Navigate app using Tab, Shift+Tab, arrow keys, Enter/Space.
3. Expect: All interactive elements reachable; visible focus ring on every stop; modals trap focus; Escape closes.

### Screen Reader Pass
- **macOS**: VoiceOver (`Cmd+F5` in System Settings).
- **Windows**: NVDA (free, open-source).
- **Mobile**: TalkBack (Android), VoiceOver (iOS).
- **Check**: Form labels announced; button actions clear; error messages read; live regions updated; headings hierarchical (`<h1>` → `<h2>` → `<h3>`).

### Automated Scanning
- **axe DevTools** (Chrome / Firefox): Run on every page; fail if contrast < 4.5:1, focus outline missing, label unlinked.
- **WAVE** (WebAIM): Highlights errors, warnings, contrast.
- **Lighthouse** (Chrome DevTools): Accessibility audit; flags missing labels, low contrast, small touch targets.

### Contrast Verification
- **Polychrome** / **Stark** (design tool plugins): Check color pairs before dev.
- **WCAG Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Threshold**: 4.5:1 (AA, normal text); 3:1 (AA, large text ≥18pt or ≥14pt bold); 3:1 (graphics / UI components).

### Manual Low-Vision Simulation
- Chrome DevTools → Rendering → Emulate vision deficiencies (Protanopia, Deuteranopia, Achromatopsia, Tritanopia).
- Zoom to 200% and re-test layout, overflow, text wrapping.

---

## Quality Gates Checklist

- [ ] **Semantic HTML**: No `<div>` buttons; form fields have `<label>` + `id` binding; headings are `<h1>…<h6>`, not styled divs.
- [ ] **Keyboard Operability**: Tab order logical; all interactive elements Tab-reachable; modals trap focus; Escape closes overlays.
- [ ] **Focus Indicators**: Visible 2px+ outline or box-shadow; 3:1 contrast; no `outline: none` without replacement.
- [ ] **Form Accessibility**: Labels associated; error messages linked via `aria-describedby`; required fields marked; autocomplete hints present.
- [ ] **Color & Contrast**: Text ≥4.5:1 AA (≥3:1 large); icons / UI borders ≥3:1; color never sole indicator (pair with icon / text / pattern).
- [ ] **Touch Targets**: ≥44×44pt (iOS) / ≥48dp (Android) / ≥24px CSS (WCAG); 8px+ spacing between targets.
- [ ] **Motion & Animation**: `prefers-reduced-motion: reduce` respected; no autoplay video / audio; manual controls only.
- [ ] **Text & Zoom**: Minimum 14px body; 16px+ on mobile; `user-scalable` not disabled; responsive up to 200% zoom.
- [ ] **Screen Reader Labels**: Icon buttons have `aria-label`; regions labeled; live regions have `aria-live` / `aria-atomic`.
- [ ] **Reduced Transparency**: `prefers-reduced-transparency: reduce` honored; no 0.5 opacity critical content.
- [ ] **Dynamic Type (iOS)**: Text scales with system setting; layout doesn't break at accessibility text sizes.
- [ ] **Testing Passed**: Keyboard-only nav ✓; VoiceOver/NVDA ✓; axe scan (0 errors) ✓; contrast check ✓; zoom to 200% ✓.

---

## Further Reading
- **WCAG 2.2 Specification**: https://www.w3.org/WAI/WCAG22/quickref/
- **ARIA Authoring Practices Guide**: https://www.w3.org/WAI/ARIA/apg/
- **Apple Human Interface Guidelines — Accessibility**: https://developer.apple.com/design/human-interface-guidelines/accessibility
- **Material Design — Accessibility**: https://m3.material.io/foundations/accessible-design
- **WebAIM Articles**: https://webaim.org/articles/
