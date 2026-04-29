# Typography And Grids

This file provides practical numbers and decisions for implementing Swiss-modern structure on the web.

## Typography

### Primary type behavior
- Use one dominant sans family.
- If a second family appears, it should usually support editorial contrast or technical metadata, not become a second design voice.
- Prefer weight contrast, size contrast, case contrast, and spacing contrast over family proliferation.

### Suggested scale behavior

This is a reliable starting point for product and marketing pages:

| Token | Desktop | Mobile | Notes |
|---|---:|---:|---|
| Display | 72-96px | 40-56px | Hero headlines only |
| H1 | 48-64px | 32-40px | Main page title |
| H2 | 32-40px | 24-30px | Section titles |
| H3 | 22-28px | 18-22px | Subsections |
| Body | 16-18px | 16-18px | Keep body readable, do not fetishize tiny text |
| Small | 12-14px | 12-14px | Labels, metadata, captions |

### Leading
- Body copy usually works around `1.45` to `1.6`.
- Tighter display type can sit around `0.9` to `1.1` depending on the face.
- Small labels often need more letter-spacing and slightly tighter leading than body text.

### Measure
- Dense reading layouts: roughly `60-75ch`
- Product/marketing body copy: roughly `45-65ch`
- Caption and metadata blocks: often narrower for contrast and rhythm

Do not let every paragraph run full-width inside broad content containers.

### Letter-spacing
- Use slight tracking on all-caps labels.
- Avoid gratuitous tracking on large headlines unless the typeface needs it.

## Grid Strategy

### Desktop defaults
- 12 columns for most marketing and content pages
- 6 or 8 columns for smaller product shells or more rigid editorial modules
- outer gutters matter as much as inner gutters

### Mobile defaults
- collapse to 2-column thinking, even if the implementation is single-column
- maintain margin discipline so the page still feels designed rather than merely stacked

### Example module logic
- Hero text spans 7 columns
- supporting proof spans 3 to 4 columns
- image or diagram spans 4 to 5 columns
- feature rows use repeated module widths, not ad hoc percentages

## Spacing Cadence

Use a repeatable step system. One practical option:

| Token | Value |
|---|---:|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 24px |
| 6 | 32px |
| 7 | 48px |
| 8 | 64px |
| 9 | 96px |
| 10 | 128px |

Swiss-modern work often feels better when:
- micro spacing stays tight and exact
- section spacing gets generous
- outer margins are slightly more generous than a generic design system would choose

## Section Composition

### Hero
- One typographic argument
- One supporting explanation
- One primary CTA
- Optional proof row or client marks aligned to the same grid

### Feature blocks
- Avoid random card mosaics unless they are aligned to a clear module rhythm
- A typographic left rail with structured right modules often works better than symmetrical cards

### Editorial sections
- Keep images, captions, and paragraphs aligned to a shared vertical rhythm
- Use rules and spacing to separate sections rather than decorative containers

## Responsive Rules

### Preserve hierarchy, not literal layout
When collapsing to tablet or mobile:
- keep headline contrast strong
- keep measure comfortable
- reduce column complexity
- maintain outer margins

### Avoid these mobile failures
- stacking everything to full width with no compositional contrast
- shrinking type too aggressively
- collapsing CTA and proof into visually identical blocks

## Accessibility Notes

- Swiss-modern restraint fails fast when contrast drops.
- Use dark-enough text on light surfaces.
- If using accent color on text, ensure the contrast is strong enough or restrict accent to larger type and UI indicators.
- Do not mistake faint type for sophistication.
