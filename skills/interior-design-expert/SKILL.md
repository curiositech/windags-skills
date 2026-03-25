---
license: Apache-2.0
name: interior-design-expert
description: Expert interior designer with deep knowledge of space planning, color theory (Munsell, NCS), lighting design (IES standards), furniture proportions, and AI-assisted visualization. Use for room layout optimization, lighting calculations, color palette selection for interiors, furniture placement, style consultation. Activate on "interior design", "room layout", "lighting design", "furniture placement", "space planning", "Munsell color". NOT for exterior/landscape design, architectural structure, web/UI design (use web-design-expert), brand color theory (use color-theory-palette-harmony-expert), or building codes/permits.
allowed-tools: Read,Write,Edit,mcp__stability-ai__stability-ai-generate-image
category: Design & Creative
tags:
  - interior
  - lighting
  - furniture
  - space-planning
  - color
pairs-with:
  - skill: color-theory-palette-harmony-expert
    reason: Color decisions for interiors
  - skill: fancy-yard-landscaper
    reason: Indoor-outdoor cohesion
---

# Interior Design Expert

Expert interior designer combining classical training with computational design tools and AI-assisted visualization.

## DECISION POINTS

### Style Selection Decision Tree
```
INPUT: Room dimensions, natural light, budget, lifestyle
├── Small room (<15m²) + Limited natural light
│   └── Scandinavian: White walls, light wood, maximize reflection
├── Large room (>30m²) + High budget
│   ├── Traditional decor style → Mid-Century Modern: Statement pieces, rich materials
│   └── Minimal lifestyle → Japandi: Low furniture, earth tones, negative space
├── Medium room + Family with children
│   └── Transitional: Durable fabrics, rounded corners, washable surfaces
└── Any size + Bold personality
    └── Maximalist: Curated collections, pattern mixing, rich color layers
```

### Lighting Layer Priority Matrix
```
ROOM TYPE → PRIORITY ORDER
Living Room: Ambient (recessed) → Accent (table lamps) → Task (reading light)
Kitchen: Task (under-cabinet) → Ambient (pendant) → Accent (art lighting)
Bedroom: Ambient (soft ceiling) → Task (bedside) → Accent (mood lighting)
Home Office: Task (desk lamp) → Ambient (overhead) → Accent (wall wash)

BUDGET CONSTRAINTS:
High budget: All three layers + smart controls
Medium budget: Ambient + Task, manual controls  
Low budget: Focus on Task lighting, supplement with floor lamps
```

### Color Palette Decision Flow
```
1. Assess natural light:
   ├── North-facing → Warm undertones (avoid cool grays)
   ├── South-facing → Can handle cool tones
   └── East/West → Test at different times

2. Room function priority:
   ├── Sleep/relax → Low chroma, warm colors (Munsell value 6-8)
   ├── Work/focus → Mid-chroma, balanced temperature (value 5-7)
   └── Entertain → Higher chroma acceptable (value 4-9)

3. Size perception needs:
   ├── Make larger → Light values (7-9), cool hues
   └── Make cozier → Mid values (4-6), warm hues
```

## FAILURE MODES

### Rubber Stamp Trendy: Following Pinterest Without Context
**Detection Rule**: If all furniture matches a single trending aesthetic without considering room constraints
**Symptoms**: Mid-Century pieces crammed in Victorian house, Scandinavian all-white in dark north-facing room
**Fix**: Analyze actual conditions first: room proportions, light quality, architectural style, lifestyle needs

### Lighting Desert: Single Overhead Syndrome  
**Detection Rule**: If room has only one central light source
**Symptoms**: Harsh shadows on faces, can't read comfortably, no ambiance control
**Fix**: Layer lighting - add table lamps for ambient, task lighting for activities, dimmers for flexibility

### Scale Blindness: Furniture Size Mismatch
**Detection Rule**: If furniture clearances are <450mm or sectional blocks 50%+ of room circulation
**Symptoms**: Can't walk around furniture, room feels cramped despite adequate square footage
**Fix**: Map circulation paths first (900-1200mm primary), then size furniture to remaining space

### Paint Roulette: Color Selection Without Testing
**Detection Rule**: If paint colors chosen from tiny swatches or computer screens only
**Symptoms**: Color looks completely different once painted, clashes with lighting, regret and repainting costs
**Fix**: Test large samples (60x60cm minimum) in YOUR lighting conditions for 48+ hours

### The Matchy Trap: Everything from Same Collection
**Detection Rule**: If all major furniture pieces share identical finish/style/era
**Symptoms**: Room feels like showroom floor, lacks personality and visual interest
**Fix**: Follow 60-30-10 rule - 60% neutral base, 30% coordinating elements, 10% accent colors/styles

## WORKED EXAMPLES

### Example 1: Small Studio Apartment Transformation
**Context**: 25m² studio, north-facing window, €3000 budget, young professional

**Step 1 - Space Analysis**: North light = warm color bias needed, single room = zones required
**Decision Point Applied**: Small room + limited light → Scandinavian approach with strategic zoning

**Step 2 - Layout Strategy**: 
- Circulation path mapped: entrance → kitchen → sleeping area (900mm width maintained)
- Zones defined: Sleep (corner), work (window), relax (center), cook (galley)

**Step 3 - Color Selection**:
- Base: White walls (Munsell N9) to maximize light reflection  
- Accent: Warm oak wood (10YR 7/6) to counter cool north light
- Pop: Soft blue textiles (5B 6/4) for calming contrast

**Step 4 - Lighting Layers**:
- Ambient: Track lighting with warm LED (2700K) 
- Task: Desk lamp for work zone, pendant over dining
- Accent: String lights for ambiance (budget constraint)

**Trade-off Analysis**: Chose multipurpose furniture over separate pieces (ottoman storage vs separate ottoman + storage cabinet) - less visual clutter but reduced specialized function.

### Example 2: Family Living Room with Lighting Challenges
**Context**: 40m² living room, low ceilings (2.4m), active family with toddler

**Step 1 - Constraint Analysis**: Low ceiling = no chandeliers, toddler = no sharp edges/fragile items
**Decision Point Applied**: Medium room + family → Transitional style with safety priorities

**Step 2 - Lighting Challenge**: Single central fixture created harsh shadows, couldn't read on sofa
**Failure Mode Avoided**: Lighting Desert - added three layers instead of upgrading single fixture

**Step 3 - Layer Implementation**:
- Ambient: Recessed LED (3000K, dimmer) replacing central fixture
- Task: Floor lamps beside reading chairs (swing-arm for flexibility)  
- Accent: LED strip behind TV, table lamps on consoles

**Step 4 - Safety Integration**: Rounded coffee table, wall-mounted TV, covered outlets, no floor lamps in toddler paths

**Trade-off Analysis**: Higher-quality fewer pieces vs more budget options - chose durable sofa in performance fabric over multiple cheaper furniture pieces.

## QUALITY GATES

- [ ] Circulation verified: All primary paths ≥900mm, secondary ≥600mm, no dead-end furniture arrangements
- [ ] Lighting layered: Minimum 2 layers present (ambient + task), all controlled independently  
- [ ] Color tested: Paint/major fabric samples tested in actual room lighting for 48+ hours minimum
- [ ] Scale proportions approved: Coffee table 40-50% of sofa length, rug extends under front furniture legs
- [ ] Visual weight balanced: No single quadrant contains >60% of visual mass (dark colors, large furniture)
- [ ] Function zones defined: Each activity has dedicated space and appropriate lighting/storage
- [ ] Electrical plan confirms: Sufficient outlets for lamps, no extension cords crossing walkways
- [ ] Budget allocation verified: 60% furniture, 25% lighting, 15% accessories/art maintained
- [ ] Style consistency: 60-30-10 rule applied (dominant style, secondary elements, accent pieces)
- [ ] Client sign-off: All major decisions (color, layout, key furniture) approved before implementation

## NOT-FOR BOUNDARIES

**Do NOT use interior-design-expert for:**

- **Exterior/landscape design** → Use fancy-yard-landscaper for outdoor spaces, garden design, hardscaping
- **Architectural structure changes** → Consult licensed architect for load-bearing walls, additions, major renovations  
- **Web/UI color schemes** → Use web-design-expert for digital interfaces, screen color theory
- **Brand/marketing color theory** → Use color-theory-palette-harmony-expert for logos, brand identity
- **Building codes/permits** → Consult local building department for electrical, plumbing, structural requirements
- **Detailed kitchen/bath cabinetry** → Use specialized kitchen designer for cabinet layouts, appliance integration
- **3D modeling implementation** → Use SketchUp directly for technical drawings, construction documents

**Delegate to other skills when:**
- Color questions involve brand identity → color-theory-palette-harmony-expert
- Outdoor space integration needed → fancy-yard-landscaper  
- Web interface color decisions → web-design-expert