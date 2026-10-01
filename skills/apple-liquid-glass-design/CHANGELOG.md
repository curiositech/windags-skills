# Apple Liquid Glass Design — Changelog

## 2026-10-01
- Created. Decision trees for glass-or-not and web route; ten non-negotiable rules; failure
  catalogue LG001-LG017 with detection rules; quality gates.
- References: when-to-use, material anatomy, shape/concentricity, motion, accessibility
  fallbacks (native and web, including Safari's missing `prefers-reduced-transparency`),
  legibility, SwiftUI and UIKit/AppKit recipes verified against developer.apple.com docs
  JSON, web decision tree, GPU post-process (WGSL + GLSL + dual Kawase), ybouane/liquidglass
  route, CSS route (Backdrop Root, Chromium-only SVG lens), platform timeline through the
  27 releases, sources.
- Scripts: `glass_contrast_check.py` (stdlib PNG decode, per-pixel WCAG stats, blur/dim/tint
  simulation, self-test) and `audit_glass_spec.py` (rule audit, optional jsonschema, self-test).
- Schema, sample spec, sample contrast regions (tough.trade clay-map capture), CSS tokens.
- Worked examples: map HUD jitter over a 144 Hz WebGPU canvas, native media controls,
  marketing nav bar.
- `agents/openai.yaml` and `agents/glass-reviewer.md`.
