# Nano Banana Image Gen — Changelog

## v1.0.0 (2026-05-05)

Initial release.

- Model selection guidance for Nano Banana (`gemini-2.5-flash-image`), Nano Banana 2 (`gemini-3.1-flash-image-preview`), and Nano Banana Pro (`gemini-3-pro-image-preview`)
- Documented the official `[References] + [Relationship] + [Scenario]` prompt formula
- Encoded four high-impact anti-patterns: aspect ratio in prompt, single-ref style transfer, negative prompts, 2.5-flash for character work
- Runnable `scripts/generate.py` with role-labeled dual-reference support, aspect-ratio config, positive-framing text suppression, and 2.5-flash fallback
- Reference deep-dives: model selection, prompt formula, character consistency, style references, troubleshooting, comparison with Ideogram V3 and Qwen
- Repo conventions for jbuds4life (character sheets, hero output paths, env var name)

Empirical findings encoded from initial testing in jbuds4life:

- 2.5-flash + single graphic-novel character sheet drifts to 16-bit pixel art
- 2.5-flash without `imageConfig.aspectRatio` produces square output regardless of prompt instructions
- Negative prompts ("no text") do not work in any Nano Banana model; positive framing is required
- Dual-reference (character + style) is the documented pattern for matching an existing illustrated style
