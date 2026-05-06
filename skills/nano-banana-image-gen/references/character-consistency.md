# Character Consistency

Generating the same person across multiple scenes is what character consistency means. Three layered techniques in order of impact.

## Technique 1: Words + reference (always do this)

Describing the character in text *and* attaching a reference dramatically outperforms either alone. The text primes the model; the image grounds it.

**Bad** — image only:
```
[attach character_sheet.png]
"Generate a portrait of the character in a coffee shop."
```

**Good** — words + image:
```
[attach character_sheet.png]
"Reference image 1 is the CHARACTER SHEET — a young Latino man in a teal
hoodie with dark curly hair, brown eyes, light beard stubble.

Generate a portrait where: he sits in a coffee shop near a sunny window,
looking up from a notebook with a thoughtful expression."
```

The text fields you should always include:
- **Ethnicity / skin tone** (when relevant; describe physically, not as a label)
- **Hair color and style**
- **Eye color**
- **Distinguishing features** (scar, beard, glasses, tattoo)
- **Default outfit** (if it carries across scenes)
- **Approximate age**

## Technique 2: Iterative re-feeding

For sequential generations of the same character, attach **both** the original character sheet *and* the most recent successful generation. Each round tightens identity.

```
Turn 1:
  refs = [character_sheet.png]
  prompt = "Generate scene A..."
  output = scene_a.png

Turn 2:
  refs = [character_sheet.png, scene_a.png]
  prompt = "Reference image 1 is the CANONICAL CHARACTER SHEET.
            Reference image 2 is the previous successful scene — use the
            same face, mood, and rendering character.
            Generate scene B..."
  output = scene_b.png

Turn 3:
  refs = [character_sheet.png, scene_b.png]
  prompt = "..."
```

Always keep the original sheet as ref 1 — drift compounds otherwise. The previous-gen ref locks in subtle properties that the original sheet didn't fully convey.

## Technique 3: Annotated / captioned references

Nano Banana reads text inside reference images. Adding labels to a character sheet (e.g., a 3-panel sheet labeled `front`, `side`, `back`, with smaller annotations like `teal hoodie`, `dark curly hair`, `brown eyes`) measurably improves fidelity.

If you have a clean character illustration, you can add labels in any image editor before passing it as a reference. The labels do *not* appear in generated outputs — the model uses them as prompt augmentation, not as elements to render.

## Multi-character consistency

For two named characters in one scene:

```
Reference image 1 is CHARACTER A — [physical description, distinguishing
features].
Reference image 2 is CHARACTER B — [physical description, distinguishing
features].

Generate a scene where: A and B [interact] in [setting].

Both characters retain their distinctive [hair / clothing / build] from
their reference sheets. They are clearly different people.
```

Nano Banana 2 supports up to 4 characters; Pro supports 5–6 high-fidelity objects (characters count as objects). For more characters than that, generate in passes and composite, or use iterative re-feeding.

## When character consistency fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Face changes scene-to-scene | Image-only refs, no text description | Add Technique 1 |
| Subtle drift over many generations | No re-feeding | Add Technique 2 |
| Wrong ethnicity / wrong hair / wrong age | Sheet ambiguous on these | Use Technique 3 — annotate the sheet |
| Generated person looks "generic Asian/Hispanic/etc" | Model defaulting to stereotypes | Describe ethnicity *physically* (skin tone, features) rather than by label |
| Outfit shifts between scenes | Wardrobe not anchored | Add a separate `WARDROBE REFERENCE` |

## Failure mode: 2.5-flash and complex characters

`gemini-2.5-flash-image` is documented as the weakest model for character consistency. For any project where the same person appears 3+ times, default to `gemini-3-pro-image-preview`. The cost difference is dwarfed by the regeneration loop you'd otherwise pay.
