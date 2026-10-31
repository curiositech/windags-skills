# Sustainability, I18n, Inclusion

Use this before locale, language, bidirectional text, inclusive UX,
low-bandwidth support, sustainability, or AI/resource-footprint decisions.

## Current Anchors

Verify before citing:

- WCAG 2.2 W3C Recommendation.
  https://www.w3.org/TR/WCAG22/
- W3C Internationalization best practices.
  https://www.w3.org/International/
- W3C Web Sustainability Guidelines draft note.
  https://www.w3.org/TR/web-sustainability-guidelines/
- W3C Design Tokens Community Group 2025.10 stable format.
  https://www.designtokens.org/TR/2025.10/format/

## Internationalization Baseline

Even single-language apps should avoid blocking later localization:

- set document language
- use semantic dates, times, numbers, units, currencies, and plurals
- avoid concatenated translated strings
- allow text expansion and contraction
- test long words and narrow viewports
- avoid layout assumptions tied to English word length
- keep icons culturally legible or label them
- use locale-aware sorting and formatting when data is user-facing
- store times with time-zone intent clear
- avoid flags as language selectors unless they represent regions, not
  languages

For multi-language apps, plan routing, metadata, canonical/hreflang behavior,
search indexing, localized OG images, translated legal pages, and support
coverage before launch.

## Bidirectional and Writing-System Risk

If users can enter names, messages, addresses, titles, or rich text:

- preserve Unicode safely
- test right-to-left scripts
- test mixed-direction inline content
- avoid truncation that hides important endings
- keep form labels and errors correctly associated
- verify tables and numeric columns in RTL contexts
- avoid assumptions about first/last name, address format, phone format, or
  alphabetical ordering

Bidirectional support is not just mirroring the layout.

## Inclusive UX

Design for real variance:

- keyboard, pointer, touch, screen reader, zoom, and reduced-motion use
- cognitive load and memory demands
- plain-language critical instructions
- resilient form errors and recovery
- inclusive imagery and examples
- non-color status indicators
- non-audio-only alerts
- safe defaults for interruption and notifications
- practical target sizes for mobile
- low-literacy and low-bandwidth situations when market-relevant

Do not add decorative friction under the name of delight. Sophistication should
make the app easier to use, not harder to decode.

## Sustainability

Use sustainability as a measurable product-quality axis:

- reduce JavaScript and hydration cost
- optimize images with correct dimensions, formats, and lazy loading
- limit custom font weights, subsets, and blocking loads
- avoid wasteful animation, polling, prefetching, video, and autoplay
- cache intentionally
- prefer static or server-rendered routes when appropriate
- remove unused client libraries and duplicate design systems
- keep analytics and replay sampling proportionate
- support low-data or degraded modes when the audience benefits
- choose infrastructure regions and providers deliberately when measurable

Do not make sustainability claims without evidence. Record payload budgets,
hosting assumptions, and measurement methods.

## AI Resource Footprint

AI features can dominate cost, latency, and energy:

- cache deterministic outputs where allowed
- use smaller models for bounded tasks
- cap retries and tool loops
- stream only when it helps user comprehension
- provide user-visible cancellation
- fall back gracefully when provider cost or latency spikes
- measure token, latency, and success rate by feature
- avoid AI for tasks that deterministic code handles better

The best AI interaction is sometimes no AI interaction.

## Design Tokens and Inclusion

Token systems should encode inclusive requirements:

- contrast roles, not just colors
- focus-ring size and contrast
- target-size roles
- motion duration and reduced-motion variants
- density modes
- typography roles for readability and data density
- locale-sensitive spacing and layout exceptions where needed
- chart palettes with non-color encodings

If accessibility and i18n exceptions are page-local hacks, the design system is
not yet the system.

## Evidence to Record

- supported locales and explicit exclusions
- language/metadata strategy
- text expansion and RTL screenshots when relevant
- inclusive UX review
- low-bandwidth or low-power decisions
- payload and font budgets
- sustainability measurement method
- AI resource policy when applicable
