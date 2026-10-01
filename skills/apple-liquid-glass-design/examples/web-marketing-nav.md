# Worked Example: Glass Nav Bar on a Marketing Page (CSS Route)

Task: a product landing page with a full-bleed hero photo, long scrolling sections, and a
floating top nav (logo, four links, a "Get started" button). Wants "the new Apple look".

## Route choice

Backdrop is ordinary DOM (images, text), not a canvas → CSS route. One floating element →
no need for the library. Refraction is a nice-to-have → SVG lens on Chromium only, applied
to the small "Get started" capsule, not the full-width bar.

## Markup and styles

```html
<nav class="glass glass--panel site-nav" aria-label="Primary">
  <a class="logo" href="/">Acme</a>
  <ul class="links"> ... four text links ... </ul>
  <a class="glass--prominent cta" href="/start">Get started</a>   <!-- fill on glass, not a second glass -->
</nav>
<button class="solid-toggle" aria-pressed="false">Reduce transparency</button>
```

```css
@import "glass-tokens.css";
.site-nav {
  position: fixed; inset: 12px 16px auto; z-index: 10;
  display: flex; align-items: center; gap: 24px; padding: 8px 8px 8px 20px;
  --glass-radius-container: 28px; --glass-inset: 8px;
}
.cta { border-radius: var(--glass-radius-inner); padding: 10px 18px; }  /* 28 - 8 = 20 */
.links a { color: var(--glass-label); font-size: 1rem; font-weight: 500; }
```

```js
const root = document.documentElement;
const saved = localStorage.getItem('glass');
if (saved) root.dataset.glass = saved;
else if (matchMedia('(prefers-contrast: more)').matches) root.dataset.glass = 'solid';
document.querySelector('.solid-toggle').addEventListener('click', (e) => {
  const solid = root.dataset.glass !== 'solid';
  root.dataset.glass = solid ? 'solid' : '';
  e.currentTarget.setAttribute('aria-pressed', String(solid));
  localStorage.setItem('glass', solid ? 'solid' : '');
});
```

## Traps avoided

- Hero section fades in with `opacity` on a wrapper that also contains the nav → Backdrop
  Root → the nav blurs nothing. The nav is a sibling of the animated wrapper.
- The CTA is a tinted fill inside the glass bar, not a second `backdrop-filter`.
- Only one tinted element on the page chrome.
- Links are 16 px, weight 500; the light-mode label is near-black, not mid-grey.

## Verification

1. Screenshots with the nav over: the hero's brightest area (sky), a dark section, a section
   with body text scrolled under it.
2. Hide nav text (`.site-nav * { visibility: hidden }` in a debug stylesheet), capture again,
   run `glass_contrast_check.py` with `text_color` per link. Gate p5 >= 4.5.
3. DevTools → Rendering → emulate `prefers-contrast: more`, `prefers-reduced-transparency`,
   `prefers-reduced-motion`; and test the in-app toggle in Safari.
4. Performance: one region over static DOM; scroll at 120 Hz with the Performance panel open;
   no long compositor frames.
