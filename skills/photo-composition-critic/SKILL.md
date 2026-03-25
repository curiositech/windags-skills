---
license: Apache-2.0
name: photo-composition-critic
description: Expert photography composition critic grounded in graduate-level visual aesthetics education, computational aesthetics research (AVA, NIMA, LAION-Aesthetics, VisualQuality-R1), and professional image analysis with custom tooling. Use for image quality assessment, composition analysis, aesthetic scoring, photo critique. Activate on "photo critique", "composition analysis", "image aesthetics", "NIMA", "AVA dataset", "visual quality". NOT for photo editing/retouching (use native-app-designer), generating images (use Stability AI directly), or basic image processing (use clip-aware-embeddings).
allowed-tools: Read,Write,Edit,Bash,mcp__firecrawl__firecrawl_search
category: Design & Creative
tags:
  - photography
  - composition
  - aesthetics
  - nima
  - critique
pairs-with:
  - skill: color-theory-palette-harmony-expert
    reason: Color analysis of photos
  - skill: collage-layout-expert
    reason: Quality photos for collages
---

# Photo Composition Critic

Expert photography critic with deep grounding in graduate-level visual aesthetics, computational aesthetics research, and professional image analysis.

## DECISION POINTS

### Primary Analysis Path Selection

```
If PORTRAIT/PERSON as main subject:
  ├── First check: Eye sharpness and face visual weight
  ├── Assess: Pose dynamics and gesture flow
  └── Apply: Figure-ground separation priority

If LANDSCAPE/ARCHITECTURE:
  ├── First check: Horizon placement and visual weight balance
  ├── Assess: Depth layering (foreground/mid/background)
  └── Apply: Dynamic symmetry for structure analysis

If DOCUMENTARY/STREET:
  ├── First check: Decisive moment capture quality
  ├── Assess: Visual narrative clarity
  └── Apply: Gestalt principles for scene reading

If MACRO/DETAIL:
  ├── First check: Subject isolation and background management
  ├── Assess: Pattern and texture emphasis
  └── Apply: Color contrast analysis priority
```

### Framework Application Order

```
If high visual complexity (>5 main elements):
  └── Start with Gestalt → Visual Weight → Color → Dynamic Symmetry

If simple composition (≤3 main elements):
  └── Start with Dynamic Symmetry → Visual Weight → Color → Gestalt

If monochromatic/B&W:
  └── Skip color analysis → Focus on Value contrast → Arabesque flow

If strong geometric elements:
  └── Prioritize Dynamic Symmetry → Check rule of thirds as fallback
```

### ML Score Interpretation Strategy

```
If NIMA score ≥6.5 AND manual analysis finds major flaws:
  └── Flag as "technically proficient but conceptually weak"

If NIMA score <5.0 BUT strong artistic intent evident:
  └── Flag as "polarizing work - assess against genre standards"

If LAION aesthetic >0.7 AND color harmony is complex:
  └── This is likely intentional artistic choice, not error
```

## FAILURE MODES

### **Rule of Thirds Dogma**
- **Symptom**: Automatically placing subjects on intersection points regardless of visual weight
- **Detection**: If recommending thirds placement without analyzing visual balance first
- **Fix**: Analyze visual weight center first, then consider dynamic symmetry before defaulting to thirds

### **NIMA Score Worship**
- **Symptom**: Using ML scores as primary or only quality metric
- **Detection**: If citing NIMA/LAION scores without theoretical framework analysis
- **Fix**: Use ML scores as confirmation data, not primary assessment. Always lead with compositional analysis

### **Color Harmony Oversimplification**
- **Symptom**: Recommending monochromatic palettes for all "harmony" issues
- **Detection**: If suggesting color matching without considering Itten's 7 contrasts
- **Fix**: Identify specific contrast type needed (hue, value, temperature, etc.) before recommending changes

### **Genre Confusion**
- **Symptom**: Applying portraiture standards to documentary work or vice versa
- **Detection**: If critique doesn't acknowledge genre-specific quality indicators
- **Fix**: Establish genre context first, then apply appropriate assessment framework

### **Technical Fixation**
- **Symptom**: Focusing only on exposure/sharpness while ignoring compositional strength
- **Detection**: If more than 50% of critique is technical issues without aesthetic analysis
- **Fix**: Balance technical and aesthetic assessment - great composition can overcome minor technical flaws

## WORKED EXAMPLES

### Example 1: Portrait Analysis

**Initial Image**: Corporate headshot with subject centered, plain background, harsh lighting

**Step-by-step analysis**:
1. **Genre identification**: Professional portrait → Priority on face clarity and professional impression
2. **Visual weight assessment**: Subject's dark suit against light background = good figure-ground separation, but centered placement creates static composition
3. **Gestalt analysis**: Strong closure (complete figure), good similarity in clothing tones, but lack of continuity for eye movement
4. **Dynamic symmetry check**: Subject placement at geometric center misses both thirds and phi ratios
5. **Color evaluation**: Monochromatic blue-grey palette = professional but lacks warmth

**Expert catches that novice misses**: The lighting creates unflattering shadows under eyes, but the composition's static nature is the bigger issue. Moving subject to left third and angling body would create more dynamic energy.

**Recommendations**: 
- Reposition to left third for asymmetrical balance
- Add subtle warm accent in background or clothing
- Adjust lighting to create gentle directional flow

### Example 2: Landscape Critique

**Initial Image**: Mountain sunset with horizon at center, oversaturated colors

**Decision path navigation**:
1. **Framework selection**: Landscape → Start with dynamic symmetry analysis
2. **Horizon placement**: Dead center violates both visual weight and dynamic symmetry principles
3. **Color harmony assessment**: Extreme saturation suggests complex harmony type, but likely post-processing artifact
4. **Visual weight check**: Sky dominates due to warm colors and saturation, but equal space allocation fights this
5. **NIMA prediction**: Likely scores high (6.0+) due to sunset appeal, but compositionally weak

**Trade-off discussion**: 
- **Option A**: Lower horizon (bottom third) to emphasize dramatic sky
- **Option B**: Raise horizon (top third) to feature foreground elements
- **Option C**: Crop to panoramic format to resolve vertical balance issue

**Alternative approaches**: 
- Desaturate colors for more natural harmony
- Use graduated filter effect to balance sky exposure
- Consider B&W conversion to emphasize form over color

## QUALITY GATES

- [ ] Genre context established and appropriate framework selected
- [ ] At least 3 compositional frameworks analyzed (Visual Weight, Gestalt, Dynamic Symmetry, or Arabesque)
- [ ] Color harmony type identified and assessed against genre appropriateness
- [ ] ML scores (if available) interpreted with theoretical context, not used as primary metric
- [ ] Technical issues balanced with aesthetic analysis (neither ignored nor overemphasized)
- [ ] Specific, actionable recommendations provided for improvement
- [ ] Alternative approaches or crop options suggested when applicable
- [ ] Anti-patterns explicitly avoided (no rule-of-thirds dogma, genre confusion, etc.)
- [ ] Visual weight center identified and balanced against formal composition rules
- [ ] Failure modes checked: not falling into NIMA worship, color oversimplification, or technical fixation

## NOT-FOR BOUNDARIES

**Do NOT use this skill for**:
- **Photo editing/retouching** → Use `native-app-designer` instead
- **Generating new images** → Use Stability AI directly
- **Basic object detection** → Use `clip-aware-embeddings` instead
- **Creating photo collages** → Use `collage-layout-expert` instead
- **Simple image similarity comparison** → Use `clip-aware-embeddings` instead
- **Commercial photography pricing** → Defer to photography business expert
- **Camera settings recommendations** → Defer to technical photography expert
- **Copyright/legal image analysis** → Defer to legal expert

**Delegate when**:
- User needs actual photo manipulation tools
- Request involves generating rather than analyzing images
- Focus is on metadata/EXIF rather than aesthetic quality
- Request requires specialized technical camera knowledge beyond composition