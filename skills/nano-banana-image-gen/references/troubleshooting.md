# Troubleshooting

Failure modes observed in the wild, root causes, and fixes.

## "The output is square — I asked for 16:9"

**Cause**: Aspect ratio set in the prompt only. The model ignores prompt-level dimensions.

**Fix**: Set it in the generation config.

```python
# wrong
generationConfig = {"responseModalities": ["IMAGE"]}
prompt = "Generate a 16:9 wide editorial illustration of..."

# right
generationConfig = {
    "responseModalities": ["IMAGE"],
    "imageConfig": {"aspectRatio": "16:9"},
}
prompt = "Generate an editorial illustration of..."
```

The HTTP body field is `generationConfig.imageConfig.aspectRatio` (camelCase). In the Python SDK it's `types.GenerateContentConfig(image_config=types.ImageConfig(aspect_ratio="16:9"))`.

## "There's text on the screens / signs / posters even though I said no text"

**Cause**: Negative prompts ("no text", "no labels") don't work in Gemini's image head.

**Fix 1**: Positive framing — describe what *should* be on the surface.

```
# wrong
"...the laptop screens have no text and no captions..."

# right
"...the laptop screens display abstract glowing UI shapes, soft gradients,
and indistinct blurred forms with no readable typography..."
```

**Fix 2**: Use Nano Banana Pro (`gemini-3-pro-image-preview`). Its text-rendering architecture suppresses text reliably when instructed.

## "The style drifted — got pixel art / cartoon / 3D when I wanted graphic novel"

**Cause**: Single character-sheet reference with vague style instructions. The model treats the sheet as a mood board and may reinterpret the aesthetic.

**Fix**: Dual-reference pattern. Attach a *separate* image that is a successful piece in the target style, labeled as STYLE TEMPLATE. See `style-references.md`.

```
Reference image 1: CHARACTER SHEET (preserve appearance).
Reference image 2: STYLE TEMPLATE — match this image's rendering character,
                                    palette, and lighting.
Generate: [scene].
```

Also: avoid `gemini-2.5-flash-image` for strict style adherence. Pro is significantly more stable.

## "The character changed across multiple scenes"

**Cause**: Image-only references with no text description, or no iterative re-feeding between turns.

**Fix**: See `character-consistency.md`.

- Add textual description of the character in every prompt
- For multi-scene projects, attach the previous successful generation alongside the original sheet
- For 3+ scenes, default to Pro

## "Reference is portrait but I want 16:9 output"

**Cause**: Without explicit framing instructions, the model crops the reference content into a portrait region of a 16:9 frame, leaving awkward dead space.

**Fix**: Prompt the framing explicitly.

```
"Wide cinematic 16:9 composition. The character occupies the left third
of the frame. The desk and screens spread across the rest of the frame
horizontally."
```

## "API returned 'API_KEY_INVALID'"

**Causes**, in order of likelihood:

1. Key was issued in Google Cloud / Google Maps Platform, not Google AI Studio. The format is identical (`AIzaSy...`) but the services don't share keys.
2. Generative Language API not enabled on the Cloud project.
3. Key has HTTP referrer or IP restrictions blocking server-side calls.

**Fix**: Get a key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey). The free tier covers Nano Banana usage for development.

## "API returned 'No image in response'"

**Cause**: The model produced a text-only response, often because:

- Safety filters blocked the request (content moderation)
- `responseModalities` did not include `"IMAGE"`
- The model couldn't reconcile conflicting reference roles

**Fix**:

1. Check the text part of the response — the model often explains why it refused.
2. Verify `responseModalities: ["IMAGE"]` in `generationConfig`.
3. If two references contradict each other (e.g., two style templates with incompatible aesthetics), drop one.
4. Soften phrasing if safety-related.

## "The output looks like a 3D render even though I said graphic novel"

**Cause**: The 2.5-flash model has known weaknesses on rendering-style adherence; or the prompt over-specified physical detail.

**Fix**:

1. Move to Pro.
2. Attach a STYLE TEMPLATE reference (don't rely on words alone for style).
3. Reduce specificity of physical detail in the prompt — describe scene and mood, let the style template carry rendering character.

## "The model added captions / a title / a watermark"

**Cause**: Some prompts implicitly suggest signage. "Editorial illustration" can read as "magazine spread" which can read as "needs a headline".

**Fix**: Explicitly describe the canvas as imageless: "a single illustration with no border, no caption, no title, no chrome — only the scene fills the frame."

## "Hands look broken"

**Known limitation** of all current Nano Banana models. Mitigations:

- Avoid prominent hand close-ups when possible
- Describe hand position abstractly ("hands clasped on the desk", "fingers paused on the trackpad") rather than specific finger detail
- For critical hand shots, generate several variants and pick the best
- Pro is meaningfully better than 2.5-flash here, but not perfect

## "I get different results from identical inputs"

**Cause**: Image generation is non-deterministic by default.

**Fix**: There is no official `seed` parameter for Nano Banana yet (as of mid-2026). Iterate with multiple generations and pick the best, or use `gemini-3-pro-image-preview` which is more deterministic in practice than 2.5-flash.

## Validation checklist before reporting a problem

- [ ] `imageConfig.aspectRatio` set in `generationConfig`
- [ ] `responseModalities: ["IMAGE"]` set
- [ ] Each reference image labeled with a role in the prompt
- [ ] Aspect-ratio framing reinforced in the prompt
- [ ] Text suppression done via positive framing, not "no text"
- [ ] Using Pro (`gemini-3-pro-image-preview`) for character/style work
- [ ] API key from aistudio.google.com (not Cloud / Maps)
