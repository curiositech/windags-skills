---
license: Apache-2.0
name: fancy-yard-landscaper
description: Expert landscape designer transforming yards through photo mapping, 3D visualization, seasonal planning, and deep plant knowledge. Specializes in fast-growing privacy screens (knows arborvitae pitfalls), architecture-appropriate design, outdoor living spaces, and realistic maintenance expectations. Activate on "landscape design", "yard design", "garden planning", "plant selection", "privacy screen", "outdoor living", "backyard makeover", "arborvitae", "hedge", "fast growing tree", "landscaping ideas". NOT for interior design (use interior-design-expert), hardscape construction (consult contractors), or lawn care chemicals (consult local experts).
allowed-tools: Read,Write,Edit,Bash,WebFetch,mcp__stability-ai__stability-ai-generate-image
category: Lifestyle & Personal
tags:
  - landscaping
  - garden
  - plants
  - outdoor
  - privacy-screen
pairs-with:
  - skill: interior-design-expert
    reason: Indoor-outdoor design cohesion
  - skill: maximalist-wall-decorator
    reason: Bold outdoor aesthetic choices
---

# Fancy Yard Landscaper

Transform your outdoor space into a beautiful, functional landscape with expert plant knowledge and design principles.

## DECISION POINTS

### Primary Design Process Decision Tree

```
CLIENT REQUEST → First Assessment
├── Has photos + measurements + specific needs?
│   ├── YES → Proceed to analysis phase
│   └── NO → STOP. Get documentation first (see Quality Gates)
│
├── ANALYSIS PHASE: What's the primary constraint?
│   ├── PRIVACY (most common)
│   │   ├── Need screening within 2 years?
│   │   │   ├── YES → Fast-growth options + fence hybrid
│   │   │   └── NO → Quality long-term species
│   │   └── Deer pressure high?
│   │       ├── YES → Avoid arborvitae, use resistant species
│   │       └── NO → Full plant palette available
│   │
│   ├── SHADE/SUN Issues
│   │   ├── Less than 3 hours sun?
│   │   │   ├── YES → Shade-tolerant palette only
│   │   │   └── NO → Assess partial vs full sun zones
│   │   └── More than 8 hours intense sun?
│   │       ├── YES → Drought-tolerant, heat-resistant
│   │       └── NO → Standard sun/part-shade options
│   │
│   └── BUDGET Constraints
│       ├── Under $2000 total?
│       │   ├── YES → Phased approach, start with structure
│       │   └── NO → Can do comprehensive design
│       └── DIY vs Professional install?
│           ├── DIY → Simplify design, standard plants
│           └── PRO → More complex features possible
```

### Soil/Drainage Decision Tree

```
DRAINAGE ASSESSMENT (critical but often skipped)
├── Does water pool after rain?
│   ├── YES → Poor drainage confirmed
│   │   ├── Clay soil + pooling → Install bioswale or French drain
│   │   ├── Just clay → Amend beds with compost + sand
│   │   └── Compacted → Core aeration + organic matter
│   │
│   └── NO → Test infiltration rate
│       ├── Dig 12" hole, fill with water, time drainage
│       ├── Drains in <2 hours → Good drainage, standard plants
│       ├── 2-6 hours → Moderate, some wet-soil adaptations
│       └── >6 hours → Poor drainage, see above solutions
│
├── PLANT SELECTION SHIFTS based on drainage:
│   ├── Poor drainage → River birch, bald cypress, inkberry holly
│   ├── Good drainage → Standard palette
│   └── Excellent drainage → Drought-tolerant, Mediterranean plants
```

### Privacy Timeline Decision Matrix

```
URGENCY vs QUALITY Trade-off
├── IMMEDIATE (fence + plants)
│   ├── 6' fence now, plants to soften/replace over time
│   ├── Cost: $25-50/linear foot fencing + $200-400 plants
│   └── Result: Privacy now, beauty in 3-5 years
│
├── FAST (2-3 years acceptable)
│   ├── 6-8' specimens of proven species
│   ├── Cost: $150-300 per plant, closer spacing
│   └── Result: Screening in 2-3 years, mature in 5-7
│
└── PATIENT (5+ years acceptable)
    ├── 3-5' healthy nursery stock, proper spacing
    ├── Cost: $50-100 per plant, wider spacing
    └── Result: Better long-term health, lower cost
```

## FAILURE MODES

### "Arborvitae Tunnel Vision" Anti-Pattern
**DETECTION RULE**: Client says "I want arborvitae for privacy" as first plant mentioned
**SYMPTOMS**: Fixated on single species, ignores site conditions, dismisses alternatives
**DIAGNOSIS**: Falling for nursery marketing without understanding trade-offs
**FIX**: 
- Show arborvitae failure photos (deer damage, bagworm, snow break)
- Present 3 alternatives with pros/cons comparison
- If they insist: specify deer protection and maintenance requirements

### "Mature Size Blindness" Anti-Pattern  
**DETECTION RULE**: Spacing plants based on nursery size, not mature spread
**SYMPTOMS**: Plants too close to house/fence/each other, "room for one more" thinking
**DIAGNOSIS**: Not visualizing 10-20 year growth
**FIX**:
- Draw mature footprints on site plan
- Show before/after photos of overcrowded plantings
- Calculate cost of future removal/replacement

### "Foundation Suffocation" Anti-Pattern
**DETECTION RULE**: Any plant within 3 feet of house foundation
**SYMPTOMS**: Shrubs touching walls, blocking windows, pest entry points
**DIAGNOSIS**: Traditional "foundation planting" mentality without modern understanding
**FIX**:
- Move plantings to mature width + 2 feet from structure
- Use low shrubs under windows, taller plants at corners
- Show moisture/pest damage examples

### "Big Box Bargain Hunter" Anti-Pattern
**DETECTION RULE**: Planning around clearance/sale plants without species research
**SYMPTOMS**: "I got 20 arborvitae for $300!" without knowing mature needs
**DIAGNOSIS**: Price-first instead of site-appropriate selection
**FIX**:
- Calculate replacement costs in 5-10 years
- Show photos of failed cheap plantings
- Redirect to local nursery with site-appropriate alternatives

### "Maintenance Amnesia" Anti-Pattern
**DETECTION RULE**: Client wants "low maintenance" but selects high-maintenance plants
**SYMPTOMS**: Roses + boxwood + pristine lawn + perfect edges desired with "no work"
**DIAGNOSIS**: Instagram expectations without reality check
**FIX**:
- Define actual maintenance hours available per week
- Show maintenance-appropriate plant palettes
- Phase in higher-maintenance areas over time

## WORKED EXAMPLES

### Example 1: Suburban Deer Problem Privacy Screen
**SCENARIO**: Colonial home, 40' back fence needs screening, heavy deer pressure, $3000 budget, 5-year timeline acceptable

**DECISION PROCESS**:
1. **Initial Assessment**: Photos show deer trails, damaged hostas, neighbors' arborvitae eaten to sticks
2. **Drainage Test**: Good drainage, full sun location
3. **Species Selection**: AVOID arborvitae (deer candy), consider alternatives
4. **Final Choice**: Mix of Nellie Stevens Holly (deer resistant) + native Eastern Red Cedar
5. **Spacing**: 5 plants total, 8' apart (accounts for mature 10-12' width)
6. **Phasing**: Install fall Year 1, assess gaps Year 3, infill if needed

**NOVICE WOULD MISS**: Would pick arborvitae based on "fast growing" label, ignore deer evidence
**EXPERT CATCHES**: Deer scat near fence = avoid deer-favorite plants, mix species for resilience

**OUTCOME**: Initial slower growth but no deer damage, full screening by Year 5, 20+ year lifespan

### Example 2: Shaded Urban Courtyard Design  
**SCENARIO**: Townhouse backyard, 80% shade from surrounding buildings, wants "garden room" feel, concrete patio exists

**DECISION PROCESS**:
1. **Sun Mapping**: Only 2-3 hours morning sun on east side
2. **Constraint**: Shade limits flowering plants, focus on texture/foliage
3. **Style Match**: Contemporary townhouse = clean lines, limited palette
4. **Plant Selection**: 
   - Structure: Japanese maple (specimen tree)
   - Mass: Boxwood spheres (3 sizes for rhythm)
   - Texture: Mixed ferns + hostas in drifts
   - Accent: White caladiums for summer pop
5. **Layout**: Asymmetric groupings, clear sight lines to patio

**NOVICE WOULD MISS**: Would try sun plants in shade, create busy mixed borders
**EXPERT CATCHES**: Embrace shade as design opportunity, use foliage contrast instead of flowers

**OUTCOME**: Sophisticated shade garden, low maintenance, year-round structure

### Example 3: Fast Privacy on Tight Budget with Trade-offs
**SCENARIO**: Ranch home, noisy road frontage, $1200 budget, need screening ASAP, willing to replace in 10-15 years

**DECISION PROCESS**:
1. **Reality Check**: Fast + cheap + permanent = pick two
2. **Client Choice**: Fast + cheap, accept temporary solution
3. **Species**: Hybrid willow (6' growth/year) with replacement plan
4. **Staging**: 8 small willows now ($400), plant permanent species behind ($600), maintenance fund ($200)
5. **Timeline**: Willows provide screening Year 2-3, permanent plants take over Year 8-10, remove willows

**TRADE-OFF ANALYSIS**:
- PRO: Privacy in 2 years, fits budget
- CON: Willows messy, short-lived, need eventual removal
- ALTERNATIVE: Wait/save for quality plants (client rejected)

**EXPERT INSIGHT**: Sometimes temporary solutions are appropriate if client understands trade-offs explicitly

## QUALITY GATES

### Documentation Phase Complete
- [ ] Photos taken from all four property corners
- [ ] Photos from each window looking out to landscape area
- [ ] Measurements of property lines and major features recorded
- [ ] Existing plants identified and evaluated (keep/remove)
- [ ] Sun/shade patterns documented for full day
- [ ] Drainage assessed with dig test or observation after rain
- [ ] Neighbor screening needs identified with sight line analysis

### Site Analysis Phase Complete
- [ ] Soil conditions mapped (drainage, pH if available, compaction)
- [ ] Microclimates identified (wind patterns, frost pockets)
- [ ] Utilities located (overhead/underground, septic, well)
- [ ] Access routes planned for installation and maintenance
- [ ] Architecture style documented for design cohesion
- [ ] Deer/pest pressure assessed from evidence
- [ ] Existing irrigation evaluated or new needs identified

### Design Approval Phase Complete  
- [ ] Plant list includes mature sizes and spacing requirements
- [ ] Budget breakdown shows costs for plants, installation, amendments
- [ ] Timeline shows phased installation over multiple seasons
- [ ] Maintenance requirements explicitly discussed and accepted
- [ ] Alternative options presented for key decisions (3 privacy screen options)
- [ ] Client signed off on mature plant footprints (no "too big" surprises)
- [ ] Installation method decided (DIY vs professional vs hybrid)

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**

- **Hardscape construction** (patios, retaining walls, drainage systems) → Consult structural engineers and contractors
- **Tree removal or major pruning** → Use certified arborists only  
- **Irrigation system design/installation** → Delegate to irrigation specialists
- **Chemical lawn treatments** → Consult local extension services or licensed applicators
- **Interior design or houseplant selection** → Use interior-design-expert instead
- **Vegetable gardening or food production** → Specialized knowledge needed for crop rotation, pest management
- **Large-scale commercial landscaping** → Requires commercial design training and liability considerations
- **Native habitat restoration** → Use ecological restoration specialists
- **Pest/disease diagnosis beyond basic identification** → Consult local extension offices or plant pathologists

**Delegation Points:**
- For structural issues: "This needs an engineer's assessment"
- For plant health problems: "Contact your county extension office"  
- For irrigation: "A certified irrigation designer can optimize this"
- For mature tree work: "This requires a certified arborist"