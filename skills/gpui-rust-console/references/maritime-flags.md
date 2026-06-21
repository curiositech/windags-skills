# ICS Maritime Flags & the OKLCH Theme

> Source: `core/pd-console/src/maritime.rs` and `core/pd-console/src/theme.rs`. The
> Python ports `scripts/flag_resolve.py` and `scripts/oklch_to_srgb.py` are byte-faithful
> to these and their selftests pin the load-bearing mappings.

## Why maritime flags at all

The console borrows the International Code of Signals (ICS) single-letter flag alphabet as
its at-a-glance agent-status glyph. Each `Flag` carries **three** strings plus a color:
its real ICS meaning (the maritime sentence), its Port Daddy meaning (what it signals
about an agent), and the rendered letter. The semantic mapping is deliberate — `Foxtrot`
("I am disabled; communicate with me") maps to **HITL gate active**, because a disabled
vessel asking you to communicate is exactly an agent waiting on operator input. `Juliett`
("on fire with dangerous cargo") maps to **agent in crisis / runaway**. These pairings are
the expertise; do not reassign them casually.

## The mapping is two layers, and they must stay coherent

`maritime.rs` has two functions that must agree:

1. `flag_for_state(state: &str) -> Flag` — canonical agent-state string → `Flag`. The
   catch-all arm is `_ => Flag::Mike` (idle). `scripts/flag_resolve.py::STATE_TO_FLAG`
   mirrors this exactly, including the Mike fallback.
2. `Flag::ics_meaning()` / `Flag::pd_meaning()` / `Flag::letter()` / `Flag::bg_rgb()` —
   per-flag facets.

When you add a state, you touch (1). When you add a *flag*, you touch (2) and the badge
color table. **The selftest in `flag_resolve.py` will fail if any flag is missing a
facet** (mirrors `maritime.rs::all_states_map_to_flags`), and it pins
`awaiting-human → Foxtrot` and `mayday → Juliett` (mirrors the two named Rust tests).
Run it before committing a maritime change:

```bash
python3 scripts/flag_resolve.py --selftest
echo '{"kind":"request","version":"1","command":"flag.resolve","payload":{"states":["hitl","mayday","totally-unknown"]}}' \
  | python3 scripts/flag_resolve.py
```

## Badge colors are bucketed by meaning, not per-flag

`Flag::bg_rgb()` buckets flags into five semantic color groups (green=affirmative/healthy,
amber=request/idle/warning, red=blocked/emergency, blue=course-change/inform,
magenta=needs-pilot), with a gray default. This keeps the badge wall readable: a glance
shows "lots of red" without reading letters. The badges are raw `0xRRGGBB` sRGB (not
OKLCH) because they are fixed signal colors, not theme tokens — they should NOT shift with
the theme. That asymmetry is intentional: **theme chrome = OKLCH tokens; signal flags =
fixed sRGB.**

## FlagBadge is a `RenderOnce` element

`FlagBadge` (`#[derive(IntoElement)] + impl RenderOnce`) paints a 32×20px rounded block,
centered bold letter at `px(12.0)`, white-ish text (`0xf9fafb`). `FlagBadge::for_state(s)`
is the one-call constructor panes use. Because it is `RenderOnce` it holds no state and
is rebuilt each paint — correct for a pure glyph.

## The OKLCH theme (`theme.rs`)

The console chrome is authored in **OKLCH** — perceptually uniform, so status hues share
matched chroma and the light/dark derivation stays harmonious. `Oklch::to_srgb8()` is the
standard Björn Ottosson conversion (OKLCH → OKLab → LMS → linear sRGB → gamma sRGB),
packed `0xRRGGBB`. There is **no hex in the theme** — every token is an `Oklch::new(l, c, h)`.

The locked `DARK` theme (operator-decided 2026-06-05): warm-neutral surfaces (hue 80°),
near-white ink, **one** amber accent (`l=0.80, c=0.105, h=78°`), and status tones at
their semantic hue angles (engaged=blue 248°, gated/conflicted=red 25°, landed=green
150°). Typography: `General Sans` (UI chrome), `IBM Plex Mono` (code/values).

`scripts/oklch_to_srgb.py` ports `to_srgb8()` faithfully so you can preview a token's hex
without `cargo build`. Its selftest reproduces the three invariants `theme.rs::tests`
asserts: ink is bright in all channels, bg is dark, accent is warm (R ≥ G ≥ B). Use it
when adding a status tone:

```bash
echo '{"kind":"request","version":"1","command":"oklch.to_srgb","payload":{"l":0.74,"c":0.085,"h":248.0}}' \
  | python3 scripts/oklch_to_srgb.py   # -> the "engaged" blue hex
```

## Tone → color, in one place

A pane emits `Block::Chip { tone: Tone::Gated }` — never a color. The renderer calls
`Tone::color(&theme)` (`pane.rs`), which maps the `Tone` enum to a `theme.rs` OKLCH token,
then `to_srgb8()` for GPUI. This single indirection is why retheming is free and why "no
hardcoded colors inline" is a hard rule, not a style nit.
