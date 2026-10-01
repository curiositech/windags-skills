# Legibility: Measuring Text on Glass

Glass changes the background under every label as content scrolls, so a single contrast
number from a design tool is meaningless. Measure the pixels that are actually behind the
text, across the backdrops it will see.

## Thresholds

| Text | Minimum | Source |
|---|---|---|
| Body/labels (up to 17 pt regular, or < 24 px / < 18.66 px bold on web) | 4.5:1 | HIG Accessibility, WCAG 2.2 SC 1.4.3 |
| Large text (≥ 18 pt, or ≥ 14 pt bold; web ≥ 24 px or ≥ 18.66 px bold) | 3:1 | WCAG 1.4.3 |
| Icons, glyphs, focus indicators, control boundaries | 3:1 | WCAG 1.4.11 |

Use the **5th percentile** of per-pixel contrast across the region (p5), not the mean. A
mean of 7:1 can hide a bright specular streak where the label vanishes. House gate: p5 ≥
threshold; also report min and the fraction of pixels below threshold.

The operator's own UI rule still applies: no body or caption text below 14 px on glass
(12 px only for bold uppercase tracked eyebrow labels). Small text on glass fails first.

## Method

1. **Capture the backdrop without the text.** Best: render the screen with the label hidden
   (`visibility: hidden` on the text node only; or a debug flag in the app) so you sample
   true glass pixels. Acceptable: capture with text and let the checker exclude pixels near
   the text colour.
2. **Capture worst cases.** Top of scroll (resting state), the brightest and the busiest
   content you can find scrolled under the bar, light and dark appearance, Reduce
   Transparency on and off.
3. **Describe regions** in JSON (CSS px or device px, with a scale) with the text colour
   and size class.
4. **Run** `scripts/glass_contrast_check.py`.

```bash
python3 scripts/glass_contrast_check.py shot.png --regions regions.json --scale 2
python3 scripts/glass_contrast_check.py shot.png --regions regions.json --json > report.json
# Design-time simulation on a raw backdrop (no glass rendered yet):
python3 scripts/glass_contrast_check.py backdrop.png --regions regions.json \
    --simulate-blur 8 --simulate-dim 0.35 --simulate-tint "255,255,255,0.08"
```

Regions file (`templates/contrast-regions.sample.json`):

```json
{
  "regions": [
    {"id": "tab-label-home", "x": 24, "y": 780, "w": 64, "h": 18,
     "text_color": "#1d1d1f", "large": false},
    {"id": "play-glyph", "x": 180, "y": 700, "w": 32, "h": 32,
     "text_color": "#ffffff", "kind": "glyph"}
  ]
}
```

If `text_color` is omitted, the checker tries both black and white and reports which one
passes (useful for adaptive labels: it tells you which way the flip must go).

Exit code is 1 if any region fails, so it can gate CI on screenshot tests.

## Fixes, in order of preference

1. Use the system's adaptive monochrome labels (they flip with the backdrop).
2. Regular instead of clear.
3. Scroll edge effect (automatic or hard) under the bar.
4. Dimming layer (35% black over bright media; up to 50-60% under Reduce Transparency).
5. Heavier weight / larger size for the label.
6. Move colourful content away from the resting position under the bar.

Never: a second glass layer, or a blur so heavy the backdrop becomes mud.
