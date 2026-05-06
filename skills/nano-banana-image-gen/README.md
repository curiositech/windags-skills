# Nano Banana Image Gen

Generate images with Google's Nano Banana family (`gemini-2.5-flash-image`, `gemini-3.1-flash-image-preview`, `gemini-3-pro-image-preview`) using character sheets and style templates as references. Encodes the official `[Refs] + [Relationship] + [Scenario]` prompt formula, the role-labeling pattern, and the empirically validated traps (aspect-ratio config, negative prompts, single-ref style drift).

## Structure

```
nano-banana-image-gen/
├── SKILL.md                                  # Core process — keep <500 lines
├── CHANGELOG.md
├── README.md
├── scripts/
│   └── generate.py                           # Runnable: dual-ref, aspect ratio, fallback
└── references/
    ├── model-selection.md                    # 2.5-flash vs 3.1-flash vs 3-pro
    ├── prompt-formula.md                     # [Refs] + [Relationship] + [Scenario]
    ├── character-consistency.md              # Words+ref, iterative re-feeding, annotation
    ├── style-references.md                   # Dual-ref pattern, when to add a 3rd ref
    ├── troubleshooting.md                    # Square output, text artifacts, drift, key errors
    └── comparison-ideogram-qwen.md           # When to pick which tool
```

## Activation

Triggers when the user mentions: "nano banana", "gemini image", any `gemini-*-image*` model id, character consistency for image generation, style transfer with Gemini, multi-reference image composition.

Does NOT trigger for: Ideogram (use existing scripts), Qwen on Apple Silicon (see `~/.claude/QWEN_IMAGE_GUIDE.md`), generic prompt engineering, non-image Gemini calls.

## Quick start

```bash
# Single character reference, 16:9 hero
GEMINI_API_KEY=... python3 scripts/generate.py \
    --char path/to/character-sheet.png \
    --scene "He sits at a cluttered desk late at night..." \
    --aspect 16:9 \
    --out hero.png

# Dual reference (character + style template) — the recommended pattern
GEMINI_API_KEY=... python3 scripts/generate.py \
    --char path/to/character-sheet.png \
    --style path/to/successful-existing-hero.webp \
    --scene "..." \
    --aspect 16:9 \
    --out hero.png
```

The script defaults to Nano Banana Pro (`gemini-3-pro-image-preview`) and falls back to 2.5-flash on failure. See SKILL.md for the full process and decision points.
