# Prompt Formula

The official Google prompting pattern for reference-grounded generation:

```
[Reference images] + [Relationship instruction] + [New scenario]
```

The **relationship instruction** is the load-bearing part. It tells the model what role each reference plays. Without it, the model partly absorbs and partly ignores each reference, producing inconsistent output.

## Worked example (verbatim from Google's guide)

> Using the attached napkin sketch as the **structure** and the attached fabric sample as the **texture** [References], **transform this into** a high-fidelity 3D armchair render [Relationship]. **Place it in** a sun-drenched, minimalist living room [New Scenario].

Notice: each reference gets a named role (`structure`, `texture`), then a verb that connects them (`transform`), then a fresh scenario (`place it in...`).

## Role labels we've validated

| Reference content | Role label to use | Effect |
|---|---|---|
| Character sheet (front/side/back of person) | `CHARACTER SHEET` | Preserve face, build, hair, clothing |
| Existing illustration in target style | `STYLE TEMPLATE` | Match rendering, palette, lighting, composition |
| Photograph of an environment | `ENVIRONMENT REFERENCE` | Match the setting/scene/architecture |
| Lighting reference (a moody photo) | `LIGHTING REFERENCE` | Match light direction, color temperature, shadows |
| Product shot | `PRODUCT REFERENCE` | Preserve exact product appearance |
| Outfit / garment | `WARDROBE REFERENCE` | Apply to the character |
| Pose reference (sketch or photo) | `POSE REFERENCE` | Use the pose, not the appearance |

You can invent role labels — the model adapts to natural language. The key is that each reference is *named* and the prompt says how it connects to the others.

## Template for editorial illustration

```
Reference image 1 is the CHARACTER SHEET — preserve [subject's]
[face, build, hair, clothing, distinguishing features].

Reference image 2 is the STYLE TEMPLATE — match its [rendering technique],
[color palette], [lighting], and [composition tendencies].

Generate a new scene where: [scenario in 1-3 sentences].

[Framing instructions — see "Aspect ratio framing" below].

[Text suppression — see "Suppressing text" below].
```

## Template for product placement

```
Reference image 1 is the PRODUCT — preserve its exact shape, color,
materials, and labeling.

Reference image 2 is the ENVIRONMENT — use as the setting and lighting
character.

Generate a single composite image where: the product sits naturally on
[surface] in the environment, lit consistently with the scene.

Wide cinematic 16:9 framing, product occupies the right third.
```

## Template for outfit transfer

Verbatim from the official guide:

> Take the blue floral dress from the first image and let the woman from the second image wear it.

Note the implicit role labels: "the blue floral dress from the first image" tells the model image 1 is the wardrobe reference; "the woman from the second image" tells it image 2 is the character. You can be implicit *or* explicit — explicit is more reliable.

## Aspect ratio framing

Aspect ratio goes in `imageConfig.aspectRatio`, but you should also reinforce framing in the prompt. The model otherwise tends to crop the reference content into the wrong region of the canvas.

| Aspect | Framing prompt addition |
|---|---|
| 16:9 / 21:9 | "Wide cinematic framing with the main subject placed off-center; the composition breathes horizontally." |
| 9:16 / 2:3 | "Tall vertical framing; the composition breathes vertically." |
| 1:1 | "Centered square composition." |
| 1:4 / 4:1 | "Extreme banner/strip framing; the subject occupies one short side; long axis fills with [environment]." |

## Suppressing text

There is no negative prompt. Always use positive framing.

**Bad** (does not work):
> No text, no labels, no captions, no watermarks.

**Good** (works):
> Any screens, signs, or surfaces in the scene display abstract glowing UI shapes and indistinct soft-blurred forms with no readable typography.

For posters/signs/billboards in the scene, describe the visual content of the surface positively: "the billboard shows a soft gradient sky", "the laptop screen displays a blurred photo of trees".

## Iterative refinement

Nano Banana supports multi-turn editing. Each turn is a new `generateContent` call where you include the previous output as a reference and ask for changes:

```
Reference image 1 is the PREVIOUS GENERATION.
Modify it as follows: [change description].
Keep everything else identical.
```

Pro and 2.5-flash both support this; Pro is dramatically more reliable for "keep everything else identical".

## Common prompt pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Reference attached without role label | Style drift, partial character match | Add explicit role label |
| Aspect ratio only in prompt | Square output | Move to `imageConfig.aspectRatio` |
| Negative prompt ("no text") | Text appears anyway | Positive framing |
| Vague style description ("graphic novel style") | Model invents an interpretation | Attach a STYLE TEMPLATE reference |
| Too many references with overlapping roles | Confused composite | One reference per role |
| Long flowery prose | Lower fidelity | Tight structured prompt — refs, roles, scene, framing, text |
