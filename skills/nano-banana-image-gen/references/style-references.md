# Style References

Style references are about **visual language** — how the image is rendered. They are mechanically separate from character references, even if both happen to be illustrations.

## The dual-reference pattern

To match an existing illustrated style while preserving a specific character, attach **two** references with explicit roles:

- **Ref 1: CHARACTER** — face, build, clothing to preserve
- **Ref 2: STYLE TEMPLATE** — rendering, palette, lighting, composition to match

```
Reference image 1 is the CHARACTER SHEET — preserve the man's face,
build, hair, and teal hoodie exactly.

Reference image 2 is the STYLE TEMPLATE — match its graphic-novel rendering
character, warm leather-and-amber palette, atmospheric lighting, and
cinematic 16:9 composition.

Generate a new scene where: [scenario].
```

This is the documented pattern. **Single-reference style transfer drifts** — the model can't tell which features are "the character" and which are "the style", and it produces a confused composite.

## Why single-ref style transfer fails

Empirical: passing one graphic-novel character sheet to 2.5-flash with the prompt "match this style and put the character at a desk" produced 16-bit pixel art. The model interpreted the sheet's stylization as license to reinterpret aesthetics.

With dual references, the model has a clear signal: ref 1 is the *what*, ref 2 is the *how*.

## Three-reference pattern (Pro and Nano Banana 2)

For more control, add a third reference for environment or lighting:

```
Reference image 1: CHARACTER SHEET (preserve appearance).
Reference image 2: STYLE TEMPLATE (match rendering and palette).
Reference image 3: LIGHTING REFERENCE (match light direction, color
temperature, and shadow density from this photograph).

Generate a new scene where: [scenario].
```

Limit: Pro handles 5–6 high-fidelity objects; Nano Banana 2 handles up to 14 reference objects. Keep one role per reference — overlapping roles (two style templates) confuse the model.

## Style-only transfer (no specific character)

Verbatim from the Google guide:

> Recreate the content of the provided photograph in the artistic style of Vincent van Gogh's *Starry Night*.

Or with two image refs:

> Reference image 1 is the CONTENT — preserve subject, composition, and pose.
> Reference image 2 is the STYLE TEMPLATE — apply its rendering technique,
> color palette, and texture to the content.

This is essentially neural style transfer through the reference channel.

## Named styles vs reference images

Named styles ("Studio Ghibli", "Moebius", "1980s anime") work but are imprecise — the model averages many examples. For consistent project work, always pair with a reference image of the actual style you want.

| Specification | Reliability | Use when |
|---|---|---|
| Named style only | Low | Quick exploration, brainstorming |
| Reference image only | Medium | Style is unique / not well-known |
| Named style + reference image | High | Production work |
| Two style references in agreement | Highest | Critical work, expensive to redo |

## Matching an existing project's style

If the project already has successful illustrations (e.g., a blog with several published heroes), use one of them as the STYLE TEMPLATE for new generations. This is the most reliable way to keep a series visually coherent.

In `jbuds4life`:
```
Reference image 1: experiments/blog-image-styles/character-sheets/alex-v3-sheet.png
                   (CHARACTER)
Reference image 2: next-app/public/images/blog/meth-executive-function-trap-hero.webp
                   (STYLE TEMPLATE — proven graphic-novel hero in this project)
```

Don't use a low-quality or off-style image as the style reference. The model matches whatever you give it, including its flaws.

## When the style still drifts

If after dual-ref the model still drifts:

1. **Strengthen the role labels.** "Reference image 2 is the STYLE TEMPLATE — match it precisely. The rendering character of this image is the rendering character of the output."
2. **Add concrete adjectives.** Don't just say "match its style" — describe what the style *is*: "warm earth-tone palette, soft cel-shading with subtle texture, atmospheric depth via color rather than detail."
3. **Upgrade to Pro.** 2.5-flash is documented as drift-prone on style adherence; Pro is significantly more stable.
4. **Reduce scene complexity.** A simpler scene gives the style head-room to express itself. Cluttered scenes force compromise.
