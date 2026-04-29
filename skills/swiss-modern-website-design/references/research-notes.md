# Research Notes

These notes capture the source-backed logic behind the skill so the guidance remains anchored in design history and durable web primitives instead of drifting into trend language.

## Named Sources

- Cooper Hewitt on Swiss Style traits such as sans-serif typography, asymmetry, grid use, and photography: `https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/`
- MoMA on Helvetica as neutral, modern, and universal: `https://www.moma.org/calendar/exhibitions/38`
- Niggli on `Grid Systems` and Emil Ruder's `Typography` as standard literature: `https://niggli.ch/en/collections/typografie?page=2`
- Smashing Magazine on grids beyond generic twelve-column symmetry and on Swiss-style lessons: `https://www.smashingmagazine.com/2019/07/inspired-design-decisions-pressing-matters/`
- web.dev typography guidance: `https://web.dev/learn/design/typography`
- web.dev CSS Grid guide: `https://web.dev/learn/css/grid`
- MDN CSS Grid overview: `https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout`
- MDN subgrid guide: `https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid`
- MDN `clamp()` reference: `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp`
- MDN `aspect-ratio` guide: `https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_sizing/Aspect_ratios`
- MDN `object-fit` reference: `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit`
- MDN `prefers-reduced-motion` reference: `https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion`

## Durable Conclusions

### 1. Swiss modern is a system, not generic minimalism
The traits that persist across historical sources are:
- typography-led hierarchy
- visible grid order
- asymmetrical but disciplined composition
- reduction in service of communication

This is why the skill emphasizes structure before styling.

### 2. Native web layout primitives are the strongest translation layer
Modern CSS gives direct equivalents for Swiss-modern logic:
- CSS Grid and subgrid for macro alignment
- `ch`-based or `max-inline-size` measures for text blocks
- `clamp()` for fluid but constrained type scaling
- `aspect-ratio` and `object-fit` for disciplined image framing

This is why the skill privileges layout primitives over decorative components.

### 3. Readability remains first-class
Contemporary web typography guidance still supports:
- obviously readable body sizing
- line-height roughly in the mid-`1.4` to `1.6` range
- controlled measure instead of full-width paragraphs

That aligns with the historical Swiss emphasis on typographic order.

### 4. The most common modern failure is premium unreadability
Teams often misread restraint as:
- faint gray text
- oversized whitespace with weak hierarchy
- blur-heavy surfaces
- cards and chrome doing the work instead of type and alignment

The audit and critique sections of this skill are there to catch that drift.

## Why This Skill Emphasizes Audits And Templates

The style usually fails through local exceptions:
- too many tokens
- too many one-off spacing values
- too many component-level visual ideas

That is why this skill includes:
- an audit script for existing codebases
- a brief validator
- a skill-bundle validator
- starter templates for tokens and layout
