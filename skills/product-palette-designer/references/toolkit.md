# Palette toolkit contract

The bundled Python 3 tool is deterministic and uses only the standard library.
It generates a candidate and measured opaque-color pairs. It cannot decide
whether a palette fits a product, looks harmonious, or meets all accessibility
criteria. Inspect the source and run its unit tests before adapting the algorithm.

## Run

From the skill root, check a spec without writing:

```bash
python3 scripts/palette.py examples/fieldnotes.palette.json --check
```

Export to an owned directory in the verified task worktree:

```bash
python3 scripts/palette.py examples/fieldnotes.palette.json --out /absolute/owned/palette-output
```

A failing audit returns nonzero. Fix input and pairs before exporting. Re-run
checks after every semantic change. The script does not edit a product repo,
install frameworks, call an AI service, or fetch a network dependency.

## JSON input

Use the finished [example spec](../examples/fieldnotes.palette.json). Fields:

| Field | Meaning |
|---|---|
| `name` | Human-readable product/proposal name. |
| `families` | Named family objects; lower-case kebab identifiers. |
| `families.<name>.h` | Finite hue in degrees, normalized modulo 360. |
| `families.<name>.c` | Nonnegative peak OKLCH chroma, subject to mapping. |
| `families.<name>.uses` | Nonempty list of explicit jobs for this family. |
| `themes.light`, `themes.dark` | Complete semantic maps; both appearances explicit. |
| Semantic value `tide.700` | Reference to generated family and shade. |
| Semantic value `$ring` | Alias to another semantic in the same appearance. |
| Semantic value `oklch(0.45 0.08 205)` | Exact opaque candidate, mapped if needed. |
| `pairs` | Explicit measured pairs in both appearances. |
| Pair `theme`, `fg`, `bg` | Appearance and semantic token identifiers. |
| Pair `min`, `purpose` | Numeric threshold and actual use/context explanation. |
| `coverage.maxGap` | Largest desired cyclic hue gap in degrees; design warning. |

Literal syntax uses normalized L in 0–1, nonnegative C, numeric hue and no alpha.
Use semantic literals for supplied anchors; the source spec preserves the
requested color while the report shows any mapped color. If an immutable anchor
is outside sRGB, retain its original as the source anchor and provide an explicit
sRGB functional counterpart; never conceal a mapping as exact preservation.
No CSS `var()`, hex, arbitrary expressions or opacity are accepted as spec values.
Native/hex values are **derived exports**, not authoring inputs for this tool.

Both themes must define the same semantic names, including optional extensions.
Alias cycles, unresolved names, missing required roles, malformed numbers,
invalid ranges and insufficient contrast are failures. The tool's extra semantic
roles are this bundle's convention; they do not claim shadcn supplies matching
success/warning/info or state components automatically.

The generated ramps contain steps 50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
950. In this version L follows `[.985,.96,.91,.85,.75,.65,.55,.45,.35,.25,.17]` and
C follows `[.08,.16,.32,.52,.80,1,.95,.80,.65,.48,.32]` times the family peak.
These are editable **design heuristics**, not standard values or scientific
harmony thresholds. The tool does not optimize hue drift or preserve arbitrary
brand anchors as a particular ramp step. Add explicit semantic literals or revise
the generator when the product requires custom ramp geometry.

## Color math and mapping

1. Convert OKLCH to Oklab using polar-to-Cartesian coordinates.
2. Convert Oklab to linear sRGB using the published Oklab transform.
3. If the result is outside sRGB, binary-search a lower C while holding L/h fixed.
   Only numerical epsilon excursions may be clipped at conversion boundaries.
4. Apply the sRGB transfer function for encoded RGB export. Retain float channels
   for calculations; byte/hex output is a quantized compatibility view.
5. Compute relative luminance from linear sRGB and contrast as
   `(lighter + .05) / (darker + .05)`. Compare unrounded values to the threshold.

Formula sources: [Ottosson's Oklab](https://bottosson.github.io/posts/oklab/),
[CSS Color 4 conversion examples](https://www.w3.org/TR/css-color-4/#color-conversion-code),
and [WCAG relative luminance](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance).
Sources checked 2026-10-25. The fixed-lightness chroma search is a deliberately
conservative export policy, **not** CSS Color 4 local-MINDE gamut mapping.

## Output contract

- `palette.json`: generated ramps and resolved themes, each with OKLCH values/CSS,
  normalized sRGB, RGB bytes and hex; requested colors and mapping flag; contrast
  rows, errors/warnings, hue coverage and mapping policy metadata.
- `tokens.css`: Tailwind v4 import, primitive `--color-<family>-<step>` theme values,
  semantic values in `:root`/`.dark`, semantic utility aliases in `@theme inline`,
  and a class-driven dark variant. Integrate into the project's existing stylesheet
  once; do not duplicate its imports or override non-color design decisions.
- `preview.html`: responsive offline review board with ramps and color-use
  examples in both appearances. Its plain CSS needs no Tailwind build. Samples
  illustrate tokens; they are not final logo, favicon, OG or native assets.

Generated JSON uses `ramps[family][step]` and `themes[appearance][token]` color
records. Each record includes `oklch`, `css`, `srgb`, `requestedOklch`, and `mapped`.
Treat `srgb.rgb` as encoded normalized sRGB, not linear channels and not Display
P3 coordinates. Select the appropriate target color space explicitly in native
assets. Re-run contrast against quantized or composited exports if they are used.

## Audit scope

The script requires the bundle's complete semantic set and checks surface/text
pairs plus focus/ring against the default surface. Add explicit pairs for other
surfaces, interaction states, input boundaries, chart marks and content overlays.
A checker cannot infer a component's actual font size or where it is rendered.
A `min: 3` row is accepted only for the explicit non-text tokens `focus`, `ring`,
`sidebar-ring`, `border`, `input`, `sidebar-border`, and `chart-1` through `chart-5`.
Other authored pairs and required surface/text pairs have a conservative 4.5
minimum. The tool does not model the 3:1 large-text exception; measure that valid
context separately with its actual size/weight. No pair result authorizes color-only
encoding or indistinguishable chart categories. Required auto-checks cannot be
bypassed with a lower pair value.

Coverage ignores effectively neutral families and measures the largest circular
gap among chromatic family anchor hues. Its warning is a design prompt, not an
accessibility requirement or a perceptual-uniformity score. Redundant low-chroma
swatches do not establish meaningful wheel coverage.

Not checked: alpha compositing; gradients and image backgrounds; P3/HDR paths;
all possible token combinations; native rendering or dynamic colors; focus area,
obscuration and interaction behavior; color-vision safety; export color profiles;
readability at actual font weight/size; semantic meaning; visual-direction approval.
Record those separately in the handoff and inspect the actual deliverables.
