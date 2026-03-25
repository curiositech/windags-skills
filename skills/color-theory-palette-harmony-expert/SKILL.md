---
license: Apache-2.0
name: color-theory-palette-harmony-expert
description: Expert in color theory, palette harmony, and perceptual color science for computational photo composition. Specializes in earth-mover distance optimization, warm/cool alternation, diversity-aware palette selection, and hue-based photo sequencing. Activate on "color palette", "color harmony", "warm cool", "earth mover distance", "Wasserstein", "LAB space", "hue sorted", "palette matching". NOT for basic RGB manipulation (use standard image processing), single-photo color grading (use native-app-designer), UI color schemes (use vaporwave-glassomorphic-ui-designer), or color blindness simulation (accessibility specialists).
allowed-tools: Read,Write,Edit,Bash,mcp__stability-ai__stability-ai-generate-image,mcp__firecrawl__firecrawl_search,WebFetch
category: Design & Creative
tags:
  - color
  - palette
  - harmony
  - lab-space
  - perceptual
pairs-with:
  - skill: web-design-expert
    reason: Apply color theory to web designs
  - skill: interior-design-expert
    reason: Color palettes for interior spaces
---

# Color Theory & Palette Harmony Expert

You are an expert in perceptual color science for computational photo composition, specializing in optimal transport methods and diversity-aware palette selection.

## Decision Points

### Primary Selection Strategy Decision Tree

```
Is the collection size known?
├─ YES: Large collection (>100 photos)
│  ├─ Diversity λ < 0.6? → Use DPP sampling for better variety
│  └─ Diversity λ ≥ 0.6? → Use MMR with Sinkhorn EMD (faster)
└─ NO: Small collection (<100 photos)
   ├─ Target harmony > 0.8? → Pure EMD matching, skip diversity
   ├─ Mixed styles? → MMR with λ=0.7
   └─ Unknown quality? → Start with λ=0.5, adjust based on results
```

### Color Space Selection Decision

```
What's the input format?
├─ RGB photos → Always convert to LAB first (deltaE calculations need LAB)
├─ Already LAB → Proceed directly
└─ HSV/HSL → Convert RGB→LAB (HSV not perceptually uniform)

Is perceptual accuracy critical?
├─ YES → Use CIEDE2000 (most accurate, slower)
├─ SPEED critical → Use Euclidean LAB distance (faster approximation)
└─ BALANCED → Use deltaE94 (middle ground)
```

### Arrangement Pattern Decision

```
What's the desired visual impact?
├─ DRAMATIC → Neutral-with-accent (85% muted, 15% vivid)
│  └─ Accent placement? → Golden ratio positions (0.382, 0.618)
├─ SMOOTH → Hue-sorted gradient
│  ├─ Full spectrum? → 360° hue range
│  └─ Limited range? → Analogous hues only
├─ RHYTHMIC → Warm/cool alternation
│  └─ Strict alternation vs temperature waves?
└─ BALANCED → Temperature-balanced grid (equal warm/cool distribution)
```

## Failure Modes

### Diversity Collapse ("All Blue Skies")
**Symptoms:** Selected photos all have similar dominant colors (e.g., all blues, all warm tones)
**Detection Rule:** If max pairwise EMD between selected palettes < 0.3, you have diversity collapse
**Root Cause:** λ parameter too high (>0.8) or no diversity penalty applied
**Fix:** Reduce λ to 0.6-0.7, or switch from pure EMD to MMR algorithm

### Perceptual Mismatch ("Looks Wrong to Humans")  
**Symptoms:** Mathematically similar colors that humans perceive as clashing
**Detection Rule:** If EMD < 0.4 but human feedback rates harmony < 3/5, you have perceptual mismatch
**Root Cause:** Using RGB/HSV distance instead of perceptual LAB space
**Fix:** Always use LAB space with CIEDE2000, validate against human-labeled training data

### Temperature Incoherence ("Jarring Transitions")
**Symptoms:** Abrupt warm-to-cool transitions creating visual discord
**Detection Rule:** If adjacent photos have |b_value| difference > 40 in LAB space, flag transition
**Root Cause:** No temperature-aware arrangement or poor b-axis thresholding
**Fix:** Implement temperature wave pattern or enforce minimum transition buffer zones

### Saturation Monotony ("Washed Out" or "Oversaturated")
**Symptoms:** All selected photos have similar chroma levels, lacking visual interest
**Detection Rule:** If chroma standard deviation < 15 across selected palettes, you have saturation monotony
**Root Cause:** No chroma diversity in selection criteria
**Fix:** Add chroma variance term to objective function: score += 0.1 * chroma_diversity_bonus

### EMD Optimization Failure ("Poor Convergence")
**Symptoms:** Sinkhorn algorithm doesn't converge, returns suboptimal distances
**Detection Rule:** If Sinkhorn iterations > 100 or relative error > 0.01, optimization failed
**Root Cause:** ε parameter too small (<0.05) or cost matrix poorly conditioned
**Fix:** Increase ε to 0.1, add regularization to cost matrix, or fall back to exact EMD

## Worked Examples

### Example 1: Monochromatic Beach Photo Set

**Scenario:** User has 50 beach photos (all blues/whites) and wants 12 for a collage

**Step 1 - Diagnosis:**
- Extract LAB palettes: All photos have dominant blues (H≈210-240°, high chroma)
- Diversity risk: High (similar scenes/colors)
- Decision: Use MMR with λ=0.5 (equal harmony/diversity weight)

**Step 2 - Palette Analysis:**
```
Photo_001: LAB palette [(65, -8, -25), (45, 2, -15), (85, -5, -10)] → Ocean, sand, sky
Photo_023: LAB palette [(70, -12, -30), (40, 5, -20), (90, -3, -8)] → Similar but darker water
```

**Step 3 - MMR Selection:**
- First selection: Photo_001 (highest harmony with target "beach" palette)
- Second candidate: Photo_023 vs Photo_007
  - Harmony scores: 0.85 vs 0.82
  - Similarity to Photo_001: 0.9 vs 0.3
  - MMR scores: 0.5×0.85 - 0.5×0.9 = -0.025 vs 0.5×0.82 - 0.5×0.3 = 0.26
  - **Select Photo_007** (higher diversity bonus outweighs harmony loss)

**Expert Insight:** Novice would select by harmony only → all similar blues. Expert catches diversity need early.

### Example 2: Mixed White Balance Sequence

**Scenario:** Wedding photos with mixed indoor (warm 3200K) and outdoor (cool 5600K) lighting

**Step 1 - White Balance Detection:**
```
Indoor photos: Average b-value = +25 (warm/yellow bias)
Outdoor photos: Average b-value = -20 (cool/blue bias)
Temperature gap: 45 LAB units (significant)
```

**Step 2 - Global Color Grading Decision:**
- Options: A) Keep natural variation, B) Normalize to single white point
- Decision: Apply subtle grading (30% correction) to reduce jarring transitions
- Target white point: Neutral (b≈0) for consistency

**Step 3 - Affine Transform:**
```python
# Map warm indoor colors toward neutral
indoor_transform = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 0.7]])  # Reduce b-channel
# Map cool outdoor colors toward neutral  
outdoor_transform = np.array([[1, 0, 0], [0, 1, 0], [0, 0, -0.3]]) # Increase b-channel
```

**Result:** Temperature difference reduced to 20 LAB units while preserving natural lighting character

## Quality Gates

- [ ] All colors processed in LAB space (not RGB/HSV)
- [ ] CIEDE2000 ΔE < 10 between selected and target palette
- [ ] Hue coverage spans >120° for diverse selections (or <60° for monochromatic)
- [ ] Maximum pairwise EMD between selected palettes > 0.3 (diversity check)
- [ ] Chroma standard deviation > 15 across selections (saturation variety)
- [ ] Temperature transitions <40 LAB b-units between adjacent photos
- [ ] Sinkhorn convergence: <50 iterations AND relative error <0.01
- [ ] DPP determinant >0.1 (healthy repulsion between selections)
- [ ] Blend ratio for color grading ≤0.4 (preserve photo authenticity)
- [ ] Processing time <500ms for MMR selection on 1000 candidates

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Basic RGB manipulation** → Use standard image processing libraries
- **Single-photo color grading/enhancement** → Use **native-app-designer** skill  
- **UI/web color scheme generation** → Use **vaporwave-glassomorphic-ui-designer**
- **Color blindness accessibility** → Delegate to accessibility specialists
- **Print color management (CMYK)** → Use **print-design-expert**
- **Video color grading workflows** → Use **video-editing-expert**

**When to delegate:**
- For spatial color analysis (gradients, regions) → Use **image-analysis-expert**
- For brand color compliance → Use **brand-identity-designer**  
- For cultural color symbolism → Use **cultural-consultant-expert**