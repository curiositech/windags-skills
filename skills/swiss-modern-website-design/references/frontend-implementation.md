# Frontend Implementation

This file translates Swiss-modern direction into frontend decisions.

## Implementation Order

1. define tokens
2. define layout containers and columns
3. define type scale and semantic text styles
4. define section primitives
5. define component variants
6. only then refine accent, imagery, and motion

## CSS Variable Guidance

Recommended core token groups:
- color
- type
- spacing
- layout widths
- radii
- shadows

Swiss-modern defaults typically mean:
- small radii or none
- minimal shadow inventory
- exact spacing tokens
- a narrow color set

Use `templates/swiss-modern-tokens.css` as the default baseline.

## Tailwind Guidance

When adapting an existing Tailwind codebase:
- collapse arbitrary spacing values into a smaller system
- reduce ad hoc max-width classes
- normalize border radius usage
- normalize font stacks
- remove decorative shadow variants that duplicate meaning

Useful refactor questions:
- How many font families are actually in use?
- How many unique border-radius values exist?
- Are section widths consistent?
- Is accent color used structurally or decoratively?

## React / Component Guidance

### Good component stack
- `PageShell`
- `Section`
- `Grid`
- `Eyebrow`
- `DisplayHeading`
- `BodyCopy`
- `Rule`
- `MetricRow`

These primitives usually outperform highly bespoke marketing components.

### Props should encode structure, not novelty
Prefer:
- `columns`
- `density`
- `emphasis`
- `align`

Avoid:
- `variant="superFancy"`
- `glow`
- `glass`
- `funMode`

## Motion Guidance

Use only a few patterns:
- fade and slight translate on section reveal
- disciplined hover state for links and buttons
- small state transitions in dashboards or forms

Avoid:
- parallax hero theatrics
- elastic overshoot motion
- floating decorative particles

## Refactor Heuristics For Existing Sites

### If the site feels generic SaaS
- simplify palette
- increase type authority
- reduce card reliance
- add stronger width and column discipline

### If the site feels too empty
- strengthen alignment contrast
- tighten micro spacing
- add rules, captions, metadata, or proof structures
- do not solve emptiness with arbitrary decorations

### If the site feels too cold
- warm the paper tone slightly
- use more intentional image placement
- improve copy precision
- introduce one decisive accent

## Implementation Checklist

- One primary font stack
- One clear display style
- One accent family
- Minimal radius inventory
- Minimal shadow inventory
- Repeated section widths
- Measured responsive collapse
- Strong text contrast

## Suggested Output Pattern

When answering a user request with this skill, structure the response like this:
1. stylistic fit statement
2. layout system
3. typography system
4. palette and accent rules
5. component rules
6. responsive behavior
7. implementation notes
8. risks and anti-patterns

That order preserves Swiss-modern logic in the response itself.
