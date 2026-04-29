# Design System Contract

Use this before implementing UI. The product should feel like it was compiled
from one coherent system.

## Token Layers

Use a three-layer token model:

1. Source tokens: raw palette, typeface, spacing base, radius base, shadow,
   motion, z-index, and breakpoint values. Keep these in isolated token-source
   files or generated design-token artifacts.
2. Semantic aliases: `surface`, `text`, `muted`, `border`, `accent`, `danger`,
   `success`, `warning`, `focus`, `chart`, `brand`, and dark/high-contrast
   variants.
3. Component roles: `button.primary.bg`, `input.border`, `card.surface`,
   `nav.active`, `table.row.hover`, `chart.series.1`, and page-layout roles.

Tailwind v4 projects should map utility-generating tokens through `@theme` and
CSS cascade layers. Tailwind v3 projects should use `tailwind.config` and CSS
variables with the same source/semantic/component separation.

When a product needs design-tool interoperability, export source and semantic
tokens in the W3C Design Tokens Community Group 2025.10 JSON shape or record
why the project cannot. Platform files may be generated from that source, but
the source of truth must remain reviewable.

## Literal Rule

Production React components must not contain raw visual values:

- no hex, RGB, HSL, or OKLCH color literals
- no arbitrary Tailwind color classes
- no one-off pixel spacing or radius values
- no ad hoc box shadows, gradients, or font-size declarations

Allowed exceptions must live in token-source or generated platform files, not
inside product components. PWA manifests sometimes require literal color values;
generate those from tokens and document the exception.

## Spacing, Radius, Density

- Define an integral spacing base, usually 4px or 8px.
- Define density modes if the app needs both marketing pages and dashboards.
- Define radii as a named scale: `none`, `xs`, `sm`, `md`, `lg`, `pill`, and
  component-specific aliases. Cards should stay restrained unless the local
  design system explicitly wants a soft style.
- Define layout grids and container widths as tokens, not page-local guesses.

## Typography

- Select type for the domain, not because it is common. Paid fonts are allowed
  when the brand and license justify them.
- Use variable fonts when possible. Enable `font-optical-sizing: auto` for
  fonts with an optical-size axis.
- If manually setting `opsz`, bind it to type roles and verify at small,
  normal, large, and high-DPI screenshots. Do not viewport-scale font sizes.
- Define type roles in rem: display, title, heading, body, compact, caption,
  label, code, metric, and data-dense table.
- Use tabular numbers for dashboards, finance, tables, metrics, and timers.
- Keep letter spacing at zero unless the typeface documentation or brand
  direction proves a specific exception.

## Color System

Create harmony before coding. A strong system includes:

- a domain-appropriate palette strategy
- semantic aliases for light, dark, and high-contrast modes
- AAA text contrast targets where feasible: 7:1 normal text, 4.5:1 large text
- 3:1 minimum for focus indicators, non-text UI, and meaningful graphics
- status colors used only for status
- chart colors tested for contrast and color-vision deficiencies
- a focus color that works on every surface

Avoid one-note palettes. Avoid default purple gradients unless the research
proves they are strategically correct.

## Primitives and React Hierarchy

Default stack:

- Base primitives: semantic HTML only, in `primitives/` or the design-system
  package.
- Accessible behavior primitives: Radix UI or Headless UI for dialogs, menus,
  popovers, comboboxes, tabs, selects, sliders, tooltips, and disclosure.
- Design primitives: Button, Text, Heading, Field, IconButton, Surface, Stack,
  Grid, Cluster, Badge, Link, Separator.
- Composites: data table, nav shell, command menu, search, auth panels,
  dashboard widgets, cards, forms, blog cards, pricing, settings, toasts.
- Page assemblies: routes and screens composed from primitives and composites.

Vanilla HTML in page code is a smell unless it is static document structure.
Interactive controls belong in primitives or composites with stories and tests.

## Storybook Contract

Every component needs stories for applicable states:

- default
- hover and focus-visible
- active and selected
- disabled
- loading
- error and validation
- empty
- long content and overflow
- dark mode
- mobile/narrow
- reduced motion when animated

Stories are not demos only. They are component tests, design review surfaces,
and regression fixtures.
