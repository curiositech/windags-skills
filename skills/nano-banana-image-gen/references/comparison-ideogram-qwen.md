# Nano Banana vs Ideogram V3 vs Qwen (M4 Max)

A pragmatic decision guide for choosing among the three image-generation tools commonly used in this workspace.

## At a glance

| Need | Use |
|---|---|
| One-shot 16:9 editorial hero with strict style adherence to a single character ref | **Ideogram V3** |
| Iterative editing / refinement / "now make it daytime" | **Nano Banana Pro** |
| Character + style refs in one shot, cinematic editorial style | **Nano Banana Pro** |
| Multi-image fusion (4+ references) | **Nano Banana 2** |
| Fast, free, local generation; pixel art; rapid iteration | **Qwen** (v0.6.0 on M4 Max) |
| Bulk thumbnails, scratch images, exploration | Nano Banana (2.5-flash) or Qwen |
| Accurate text rendering inside the image | **Nano Banana Pro** |
| Suppressing in-image text reliably | **Nano Banana Pro** or Ideogram |

## Ideogram V3 — strengths

- `style_type=FICTION` + `character_reference_images` is purpose-built for character-consistent illustrations
- Honors `aspect_ratio` parameter natively
- Supports a real `negative_prompt` parameter (suppresses text/labels reliably)
- Excellent first-pass quality on graphic-novel and editorial styles
- Stable, predictable API; no preview-feature churn

## Ideogram V3 — weaknesses

- Single-shot only; no conversational refinement
- No multi-image composition beyond character + style flag
- Closed weights, no local option
- Per-image cost similar to Nano Banana 2

## Nano Banana Pro — strengths

- Multi-image composition with 5–6 high-fidelity references
- Iterative editing in conversation form
- Studio quality with reliable text rendering and suppression
- Reasoning core handles complex layouts (multi-character scenes, branded assets)

## Nano Banana Pro — weaknesses

- Preview API surface; subject to change
- More expensive than 2.5-flash and Ideogram-TURBO
- No native `negative_prompt` (positive framing only)
- Style drift more likely than Ideogram on single-reference inputs

## Qwen on M4 Max — strengths

- Free, local, no API
- Lightning LoRA produces 4-step generations in ~1 minute
- Excellent for pixel-art and stylized illustrations
- No data leaves the machine

## Qwen on M4 Max — weaknesses

- v0.6.0 only — newer versions are broken on MPS (per `~/.claude/QWEN_IMAGE_GUIDE.md`)
- Cannot run multiple processes in parallel (will crash the machine)
- Weaker than cloud models on photorealism and complex character consistency
- No real reference-image conditioning out of the box

## Decision tree

```
Need character consistency across scenes?
├─ Yes → Need iterative editing or multi-image fusion?
│       ├─ Yes → Nano Banana Pro
│       └─ No  → Ideogram V3 (single-shot is its sweet spot)
└─ No  → Is it production work?
        ├─ Yes → Style critical?
        │       ├─ Yes → Ideogram V3 or Pro
        │       └─ No  → Nano Banana 2.5-flash (cheapest)
        └─ No  → Qwen (free, local)
```

## Workflow recommendations for jbuds4life heroes

**Default pipeline** (per existing scripts):

1. Generate via Ideogram V3 with `style_type=FICTION` + character ref
2. Convert PNG to webp via `cwebp -q 85`
3. Place at `next-app/public/images/blog/{slug}-hero.webp`

**When to switch to Nano Banana Pro**:

- The hero needs precise text on a sign/poster/screen
- The hero is a multi-character scene with complex blocking
- You want to iterate on a generated image rather than re-roll
- You're composing 3+ references (character + outfit + environment)

**When to use Qwen**:

- Pixel-art diagrams for blog inline illustrations
- Rapid exploration before committing to a paid generation
- Offline / no-API-budget scenarios
