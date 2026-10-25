# Color theory for product-palette decisions

Read this when selecting a hue architecture, explaining a palette, or diagnosing a
combination that looks coherent as swatches but fails in the product. It is a
selected working reference, not a complete history or theory of color.

Historical theories provide useful questions; perceptual models provide coordinates;
rendered product evidence decides whether a proposed relationship works.
The numerical recipes and audit thresholds below are design heuristics unless a
source is explicitly attached to the claim. They are not aesthetic laws.

## Start with three different questions

1. **Identity:** Which hues should people recognize as this product's signature?
2. **Function:** Which colors communicate states, hierarchy, categories, and data?
3. **Expression:** Which additional hues belong in illustration, campaigns, and motion?

A focused identity can support an expansive product palette. Start with one or two
recognizable brand families when appropriate, then distribute other hues across
semantic states, charts, editorial surfaces, and artwork. Do not make every control
compete for identity merely to demonstrate hue coverage.

Judge the palette at both scales: the complete product may span the wheel while a
single screen uses a restrained subset. Repeated lightness, chroma, neutral undertones,
and application rules can connect distant hues.

## Theory translated into decisions

The first seven rows adapt Itten's contrast categories into product questions.
Definitions follow his own list in *The Art of Color*; the decisions are this skill's
application of that framework. [Itten](https://studylib.net/doc/26180869/the-art-of-color)

| Lens | Useful distinction | Product decision or experiment |
|---|---|---|
| Hue contrast | Distinct hues create differentiation. | Reserve the clearest hue differences for meaningful categories and focal elements. |
| Light–dark contrast | Value relationships organize a composition. | Check hierarchy in grayscale before adding more hues. |
| Cold–warm contrast | Relative temperature changes a pairing's character. | Compare a warm focal accent on cooler surfaces and the reverse. |
| Complementary contrast | Opposed hues create a strong relationship within the chosen wheel. | Use unequal prominence; test the pair at actual component sizes. |
| Simultaneous contrast | Surroundings alter a color's apparent character. | Compare one token against canvas, card, selection, and overlay backgrounds. |
| Saturation contrast | Intense and subdued colors affect each other. | Give focal actions more chroma than supporting fills when the concept calls for it. |
| Extension | Relative colored areas change the composition. | Test a small accent, large panel, and full-bleed field separately. |
| Chevreul: juxtaposition | Neighboring colors can alter apparent hue and tone. | Inspect seams, borders, and repeated rows in context. [Chevreul](https://www.gutenberg.org/cache/epub/76939/pg76939-images.html) |
| Chevreul: successive contrast | Prior viewing can affect the next color judgment. | Revisit a candidate after looking away from saturated reference imagery. [Chevreul](https://www.gutenberg.org/cache/epub/76939/pg76939-images.html) |
| Albers: interaction | A fixed color can appear different in different arrangements. | Make paired context studies before declaring a token universally balanced. [Albers Foundation](https://www.albersfoundation.org/alberses/teaching/interaction-of-color) |
| Munsell: three attributes | Hue, value, and chroma describe different dimensions. | Diagnose whether a clash concerns hue, lightness, or intensity before changing all three. [Munsell](https://www.gutenberg.org/cache/epub/26054/pg26054-images.html) |

### Preserve the Itten terminology distinction

Itten's own seven-category list includes **simultaneous contrast**. Getty's Bauhaus
exhibition page instead lists **analogous** in that position. Retain that source
disagreement; do not silently substitute one term for the other.
[Itten's list](https://studylib.net/doc/26180869/the-art-of-color),
[Getty's account](https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/).

For this skill, **analogous** means a scheme using neighboring hue families;
**simultaneous contrast** means a change in appearance caused by surrounding colors.
They answer different design questions. Historical claims that the eye demands a
particular complement do not establish a modern neurological or usability rule.

### Vision explains constraints, not a universal harmony formula

Human color processing includes comparisons between cone signals. Perceptual
red–green/blue–yellow descriptions and physiological opponent responses are related
but are not interchangeable coordinate systems; the tutorial explicitly distinguishes
them. Do not derive product hue angles from a simplified opponent-channel story.
[Shevell and Martin](https://pmc.ncbi.nlm.nih.gov/articles/PMC6022826/).

Adaptation also makes viewing history relevant. Experiments with changing color
stimuli show that afterimages depend on the adaptation sequence. The product-level
inference is to compare themes and large colored fields over time, then return to a
neutral reference; it is not to calculate a guaranteed pleasing afterimage complement.
[Alzeer et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9546419/).

## Name the wheel before using its angles

| System | What its arrangement represents | Consequence |
|---|---|---|
| Traditional RYB artist wheel | A pedagogical arrangement around red, yellow, and blue, used by Itten. | Its familiar opposite pairs belong to that arrangement. [Itten](https://studylib.net/doc/26180869/the-art-of-color) |
| RGB/HSL wheel | Hue derived from RGB geometry; CSS HSL belongs to sRGB. | Equal angle steps can look very unequal. [CSS Color 4](https://www.w3.org/TR/css-color-4/#the-hsl-notation) |
| Munsell hue circuit | A color-order system organizing hue separately from value and chroma. | A Munsell hue designation is not an HSL or OKLCH angle. [Munsell](https://www.gutenberg.org/cache/epub/26054/pg26054-images.html) |
| OKLCH wheel | Polar coordinates of the Oklab a/b plane. | Record angles as OKLCH; do not transplant named RYB complements numerically. [Ottosson](https://bottosson.github.io/posts/oklab/) |

A 180° rotation means an opposite in that coordinate system. It need not describe
pigment neutralization, an additive-light complement, or a physiological afterimage.
Convert actual colors between spaces; never copy the hue number across spaces.

## Choose the model for the job

| Model | Useful role | Limit to remember |
|---|---|---|
| HSL/HSV | Familiar RGB editing and legacy inputs. | Their lightness/value and saturation are not perceptually even; HSL hue spacing is uneven. [CSS Color 4](https://www.w3.org/TR/css-color-4/#the-hsl-notation) |
| CIELAB / CIELCH | Established colorimetry and interchange. | CIELCH has hue-curvature and uniformity problems, notably among blues. [CSS Color 4](https://www.w3.org/TR/css-color-4/#lab-colors) |
| Oklab / OKLCH | Default here for palette construction, ramps, and inspecting L/C/h independently. | Perceptually motivated approximation; neither coordinates nor equal steps certify aesthetic quality. [Ottosson](https://bottosson.github.io/posts/oklab/) |
| CAM16 / CAM16-UCS | Appearance modeling and color differences with explicit viewing assumptions. | Appearance-model inputs and a uniform-space representation serve different operations; retain viewing conditions. [Li et al.](https://onlinelibrary.wiley.com/doi/10.1002/col.22131) |
| HCT | Material-compatible color generation. | Combines CAM16 hue/chroma with CIELAB L* tone; its numbers are not OKLCH numbers. [Material source](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/hct/hct.ts) |

Oklab uses D65; OKLCH is its cylindrical form. Use numeric `L` in 0–1, numeric `C`,
and hue degrees consistently in working files. Oklab and OKLCH encode the same colors
with different coordinates, not different gamuts. [Ottosson](https://bottosson.github.io/posts/oklab/).

The destination gamut limits available chroma by lightness and hue. Inspect the
rendered, gamut-mapped result in the intended output space; a mathematically valid
OKLCH color need not fit sRGB. Reducing chroma is a useful gamut-mapping strategy,
but clipping and mapping can change the intended relationships.
[CSS Color 4](https://www.w3.org/TR/css-color-4/#gamut-mapping).

Equal OKLCH L does not prove equal text contrast against a background. Treat
accessibility calculations and component verification as separate acceptance work.

## Harmony families: starting geometry, then composition

Use `wrap(x) = ((x % 360) + 360) % 360`; every angle below is **OKLCH hue**.
Let `h` be a product-specific anchor chosen from the brief, research, and artwork.
These are search starting points adapted from familiar scheme families, not exact
translations of Itten's RYB constructions or empirically guaranteed optima.

| Family | Starting hue angles | Where to explore it | Main risk |
|---|---|---|---|
| Monochromatic | `h` | Strong core identity with variation in L/C. | Richness and category separation must come from other dimensions. |
| Analogous | `h−30, h, h+30` | Related brand accents or a coherent illustration passage. | Nearby colors may become indistinguishable in small marks. |
| Complementary | `h, h+180` | A focal counterpoint or campaign pairing. | Equal area and high chroma can overwhelm hierarchy. |
| Split complementary | `h, h+150, h+210` | A distinctive anchor plus two counterpoints. | The two supporting hues may compete or resemble status roles. |
| Triadic | `h, h+120, h+240` | A wider editorial or categorical starting set. | Equal spacing does not imply equal visual weight. |
| Rectangular tetradic | `h, h+d, h+180, h+d+180`; try `d=45–75` | Two related pairs for an extended system. | Four equally forceful accents can fragment the product. |
| Square tetradic | `h, h+90, h+180, h+270` | Broad exploration for art or categories. | Mechanical symmetry can produce an undifferentiated rainbow. |
| Accented analogous | `h−25, h, h+25`, plus `h+180` | A cohesive family with one surprising accent. | The distant accent may dominate every application. |

After the first render, move angles freely, change L/C independently, and remove
unused colors. A successful palette may have deliberately irregular hue intervals.
Schemes are ways to generate candidates, not reasons to accept them.

Research distinguishes liking a pair, judging that it belongs together, and liking a
foreground color against its background. In Schloss and Palmer's experiments these
judgments diverged; hue similarity and lightness contrast contributed differently.
Consequently, ask both “does this belong?” and “does this make the intended thing
stand out?” rather than treating one harmony score as the product's quality score.
[Schloss and Palmer](https://pubmed.ncbi.nlm.nih.gov/21264737/).

## Compose with area, chroma, and lightness

A swatch strip gives every color the same area. A product does not. Review these
three compositions before choosing the winner:

- **Quiet workspace:** large restrained surfaces, legible typography, a recurring
  brand action, and occasional semantic accents.
- **Expressive landing page:** larger colored fields and artwork, with a clear
  focal CTA and controlled reading surfaces.
- **Dense data view:** colors assigned by data meaning, with labels and other
  encodings retaining identification when hues are difficult to distinguish.

Use a rough prominence ledger: for each color record visible area, chroma, contrast
against its neighbors, repetition, and task importance. This is a design checklist,
not a validated formula; do not multiply these values into a scientific-looking score.

When several colors shout, first reduce the area or chroma of supporting colors,
then reconsider their hues. When everything feels flat, increase differentiation at
the intended focal point. Reassess in both themes rather than copying the same C
values between light and dark surfaces.

Ratios such as 60/30/10 can structure an experiment, but they are not universal
product rules. Itten's extension studies concern relative colored areas; his specific
historical proportional prescriptions do not establish fixed UI percentages.
[Itten](https://studylib.net/doc/26180869/the-art-of-color).

## Audit the full wheel without making every screen a rainbow

The goal is a deliberate extended vocabulary across the product, with local restraint.
Perform this audit on candidate families, then repeat on actual rendered applications.

1. **Inventory roles:** core brand, neutral undertones, interaction, status, categorical
   data, sequential/diverging data, illustration, marketing, and editorial surfaces.
2. **Separate structural coverage from decorative coverage:** list actual functional
   assignments and optional art assignments. A gradient passing through a hue is not
   evidence that the product has a usable token family there.
3. **Measure anchors:** normalize each chosen family's hue into `[0,360)`. Inspect
   representative midtones; nearly neutral tokens do not establish useful hue coverage.
4. **Draw twelve diagnostic sectors:** `[0,30)`, `[30,60)`, …, `[330,360)`. Attach
   each usable family and its role. These equal sectors are bookkeeping, not claims
   about perceptually equal color names or beauty.
5. **Compute circular gaps:** sort unique anchors, append the first plus 360, and
   calculate adjacent differences. Report the largest gap and where it lies.
6. **Interpret, then revise:** a gap above roughly 60° is a prompt to investigate
   when rich wheel coverage is requested, not an automatic failure. Fill it through
   a plausible role, shift existing families, or document why it is intentionally open.
7. **Check usable distinction:** compare neighboring families at small sizes and in
   both themes. Count distinguishable applications, not just different numeric angles.
8. **Check local hierarchy:** show representative screens with the real expected
   mix of colors. Broad system coverage must coexist with a clear focal structure.

Use this report shape; select the actual roles from the product rather than filling
all twelve sectors just to complete a table:

| Sector / circular gap | Existing family and purpose | Needed extension | Where it may appear | Decision |
|---|---|---|---|---|
| Numeric angle range | Named role + representative L/C/h | A role-driven candidate or none | Specific screen, chart, or art system | Keep / adjust / intentionally open |

A brand centered on a cool family might gain warm coverage through warnings and
campaign art, green coverage through success states, and further distinct families
through a real categorical-data requirement. These assignments are examples: domain
conventions, existing category meanings, and audience expectations take priority.

Do not distort an ordered data scale into a hue wheel just to fill missing sectors.
Do not turn decoration into false status signals. Use artwork to explore remaining
hues only when that artwork has a genuine product or communication purpose.

## Emotional meaning: make a hypothesis and test it

Avoid formulas such as “blue causes trust” or “red means urgency everywhere.” A study
across 30 nations found shared color–emotion association patterns alongside effects
of linguistic and geographic proximity. Association evidence does not prove that a
UI hue causes a particular feeling, conversion lift, or brand perception.
[Jonauskaite et al.](https://pubmed.ncbi.nlm.nih.gov/32900287/).

Record the intended association, audience, domain, locale, and conflicting meanings.
Then test the palette with actual copy, typography, imagery, tasks, and cultural
review. Explain a bespoke choice through that evidence and its functional role.

## Source bibliography and provenance

All sources retrieved **2026-10-25**. Links identify the source of the claim;
application recipes above are original practical synthesis. Historical works are
read as historical frameworks rather than current physiological findings.

- **Itten, Johannes.** *The Art of Color* (1961; revised edition 1973), sections on
  the seven contrasts, hue circle, harmony, and composition. [Text reproduction](https://studylib.net/doc/26180869/the-art-of-color).
- **Getty Research Institute.** *Bauhaus: Color* (institutional historical account).
  [Exhibition page](https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/form_color/color/). Used to disclose the terminology disagreement.
- **Chevreul, M. E.** *The Laws of Contrast of Colour*, John Spanton translation,
  1861; original French work 1839. [Digitized primary text](https://www.gutenberg.org/cache/epub/76939/pg76939-images.html).
- **Josef & Anni Albers Foundation.** *Interaction of Color*, including Albers's
  account of his teaching method. [Foundation source](https://www.albersfoundation.org/alberses/teaching/interaction-of-color).
- **Munsell, A. H.** *A Color Notation*, second edition, 1907.
  [Digitized primary text](https://www.gutenberg.org/cache/epub/26054/pg26054-images.html).
- **Shevell, S. K., and Martin, P. R.** “Color opponency: tutorial” (2017).
  [Author manuscript](https://pmc.ncbi.nlm.nih.gov/articles/PMC6022826/); DOI 10.1364/JOSAA.34.001099.
- **Alzeer et al.** “After-image formation by adaptation to dynamic color gradients”
  (online 2022; issue 2023). [Research paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC9546419/).
- **W3C CSS Working Group.** *CSS Color Module Level 4*, Candidate Recommendation
  Draft, 22 October 2026; sections 7, 9, and 14. [Specification](https://www.w3.org/TR/2026/CRD-css-color-4-20261022/).
- **Ottosson, Björn.** “A perceptual color space for image processing” (2020;
  introduction updated 2025). [Oklab author's derivation](https://bottosson.github.io/posts/oklab/).
- **Li et al.** “Comprehensive color solutions: CAM16, CAT16, and CAM16-UCS” (2017).
  [Original research](https://onlinelibrary.wiley.com/doi/10.1002/col.22131).
- **Material Foundation.** Material Color Utilities, `typescript/hct/hct.ts`.
  [Maintainer source](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/hct/hct.ts).
- **Schloss, K. B., and Palmer, S. E.** “Aesthetic response to color combinations:
  preference, harmony, and similarity” (2011). [Research abstract](https://pubmed.ncbi.nlm.nih.gov/21264737/).
- **Jonauskaite et al.** “Universal Patterns in Color-Emotion Associations Are Further
  Shaped by Linguistic and Geographic Proximity” (2020). [Research abstract](https://pubmed.ncbi.nlm.nih.gov/32900287/).
