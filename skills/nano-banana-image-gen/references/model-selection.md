# Model Selection

Three models share the Nano Banana family. Choosing wrong is the most common cause of bad output.

## The three models

| Model ID | Name | Status | Max refs | Strengths | Weaknesses |
|---|---|---|---|---|---|
| `gemini-3-pro-image-preview` | **Nano Banana Pro** | Preview | 5–6 high-fidelity objects | Reasoning core. Studio-quality. Precise text rendering (and reliable text suppression). Complex layouts. | Slowest, most expensive. Preview API surface. |
| `gemini-3.1-flash-image-preview` | Nano Banana 2 | Preview | 14 reference objects + 4 characters | High volume. Adds extreme aspect ratios (1:4, 4:1, 1:8, 8:1). Fast. | Less polished than Pro. |
| `gemini-2.5-flash-image` | Nano Banana | GA | 3 | Cheapest, fastest. Stable API. | Weakest character consistency. Drifts on style. Bad at suppressing in-image text. |

## Decision matrix

| Use case | Model |
|---|---|
| Editorial illustration with character + style references | **Nano Banana Pro** |
| Branded asset that must match an existing illustrated style | **Nano Banana Pro** |
| Multi-image composition with 4+ references | **Nano Banana 2** |
| Extreme aspect ratio (e.g., 1:4 banners, 4:1 strips) | **Nano Banana 2** |
| Bulk thumbnail generation, low-stakes scratch images | Nano Banana (2.5-flash) |
| Anything where unwanted in-image text would be a dealbreaker | **Nano Banana Pro** |
| Iterative editing (conversation-style refinement) | Pro or 2.5-flash; both support multi-turn |
| Cost-sensitive, no character consistency required | Nano Banana (2.5-flash) |

## Aspect ratios supported

All three: `1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9`

Nano Banana 2 only: `1:4, 4:1, 1:8, 8:1`

## Empirical notes from jbuds4life testing

- 2.5-flash with a single graphic-novel character sheet drifts to **16-bit pixel art** unless explicitly anchored by a second style-reference image.
- 2.5-flash with `responseModalities=["IMAGE"]` but no `imageConfig.aspectRatio` produces square output regardless of prompt instructions.
- 2.5-flash routinely renders text on screens/signs even with explicit "no text" instructions; positive framing helps but doesn't fix it. Pro suppresses text reliably.

## Cost vs Ideogram V3

Approximate per-image cost (as of mid-2026, may drift):

| Service | Cost | Notes |
|---|---|---|
| Nano Banana (2.5-flash) | ~$0.04 | Cheapest in family |
| Nano Banana 2 | ~$0.10 | Volume-friendly |
| Nano Banana Pro | ~$0.20–0.40 | Studio quality |
| Ideogram V3 (DEFAULT) | ~$0.08 | Different vendor; check current pricing |
| Ideogram V3 (TURBO) | ~$0.04 | Fast tier |

Verify current pricing in the [Gemini API pricing docs](https://ai.google.dev/pricing) before committing to a model in production code.
