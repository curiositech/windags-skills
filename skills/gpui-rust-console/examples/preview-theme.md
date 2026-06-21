# Example: Preview a new OKLCH status tone without compiling Rust

Goal: you want to add a `Stalled` status tone (a desaturated amber, distinct from the
warning amber) and see its hex before wiring it into `theme.rs`. Use the byte-faithful
port in `scripts/oklch_to_srgb.py`.

## 1. Sanity-check the port matches the locked theme

```bash
python3 skills/gpui-rust-console/scripts/oklch_to_srgb.py --selftest
```

Expected (the DARK tokens, with the same invariants `theme.rs::tests` asserts):

```json
{"kind":"response","version":"1","ok":true,"result":{"ok":true,"dark_theme":{
  "accent":{"hex":"...","rgb":[..]},"bg":{"hex":"...","rgb":[..]},"ink":{"hex":"...","rgb":[..]}}}}
```

If this fails, the port has drifted from `to_srgb8()` — fix the script before trusting it.

## 2. Preview your candidate tone

The locked accent is `l=0.80, c=0.105, h=78`. For a *stalled* amber, drop chroma and
lightness a touch — `l=0.66, c=0.045, h=78`:

```bash
echo '{"kind":"request","version":"1","command":"oklch.to_srgb","payload":{"l":0.66,"c":0.045,"h":78.0}}' \
  | python3 skills/gpui-rust-console/scripts/oklch_to_srgb.py
```

Returns `{"hex":"...","rgb":[r,g,b]}`. Compare it side by side with the existing tones by
passing the whole ramp:

```bash
echo '{"kind":"request","version":"1","command":"oklch.to_srgb","payload":{"colors":{
  "accent":{"l":0.80,"c":0.105,"h":78},
  "gated":{"l":0.72,"c":0.10,"h":25},
  "stalled":{"l":0.66,"c":0.045,"h":78}}}}' \
  | python3 skills/gpui-rust-console/scripts/oklch_to_srgb.py
```

## 3. Wire it in (the real change)

Once you like the value, the change is in OKLCH (never hex), in `theme.rs`:

- add `pub stalled: Oklch,` to `struct Theme`
- add `stalled: Oklch::new(0.66, 0.045, 78.0),` to `const DARK`
- add a `Tone::Stalled` variant in `pane.rs` and a match arm in `Tone::color`

Then `cargo test` — `theme.rs::oklch_converts_to_plausible_srgb` and your pane tests must
stay green.

## Why preview at all

`to_srgb8()` is a non-trivial gamma + matrix conversion; you cannot eyeball an OKLCH
triple's hex. The script lets you iterate on `(l, c, h)` in seconds instead of editing
Rust and waiting on a gpui build. The hex it prints is exactly what GPUI will paint,
because the math is the same.
