---
license: Apache-2.0
name: wedding-immortalist
description: Transform thousands of wedding photos and hours of footage into an immersive 3D Gaussian Splatting experience with theatre mode replay, face-clustered guest roster, and AI-curated best photos per person. Expert in 3DGS pipelines, face clustering, aesthetic scoring, and adaptive design matching the couple's wedding theme (disco, rustic, modern, LGBTQ+ celebrations). Activate on "wedding photos", "wedding video", "3D wedding", "Gaussian Splatting wedding", "wedding memory", "wedding immortalize", "face clustering wedding", "best wedding photos". NOT for general photo editing (use native-app-designer), non-wedding 3DGS (use drone-inspection-specialist), or event planning (not a wedding planner).
allowed-tools: Read,Write,Edit,Bash,Grep,Glob,WebFetch
category: Lifestyle & Personal
tags:
  - wedding
  - memorial
  - preservation
  - photography
  - storytelling
pairs-with:
  - skill: photo-content-recognition-curation-expert
    reason: Curate wedding photos
  - skill: event-detection-temporal-intelligence-expert
    reason: Detect wedding events
---

# Wedding Immortalist

Transform wedding photos and video into an eternal, immersive 3D experience. Create living memories that let couples and guests relive the magic forever.

## DECISION POINTS

### 1. Multi-Space Merge Strategy
```
Input: Multiple venue spaces detected (ceremony, reception, cocktail hour)
├── < 500 photos per space
│   └── Train unified scene (risk: quality loss, benefit: seamless navigation)
├── 500-1500 photos per space  
│   └── Train per-space with portal transitions (RECOMMENDED)
├── > 1500 photos per space
│   └── Split large spaces into sub-regions to avoid memory overflow
└── Mixed lighting conditions?
    ├── Yes → Separate indoor/outdoor scenes
    └── No → Can merge with lighting adaptation
```

### 2. Face Clustering Threshold Selection
```
Input: Face embedding similarity scores across all detected faces
├── Photo count < 1000
│   └── Conservative threshold (0.4): Prefer precision over recall
├── Photo count 1000-5000
│   └── Balanced threshold (0.3): Standard wedding size
├── Photo count > 5000
│   └── Aggressive threshold (0.25): Large weddings need looser matching
└── Professional + phone photos mixed?
    ├── Yes → Increase threshold by 0.05 (lighting/quality variance)
    └── No → Use base threshold
```

### 3. Theme Signal Conflict Resolution
```
Input: Competing aesthetic signals detected
├── Venue theme ≠ Decor theme
│   ├── Venue rustic, decor modern → Weight decor 70%, venue 30%
│   └── Venue formal, decor casual → Weight venue 60%, decor 40%
├── Multiple cultural traditions
│   └── Create fusion palette prioritizing couple's primary heritage
├── Seasonal vs. chosen colors
│   ├── Spring wedding with fall colors → Honor chosen colors
│   └── Christmas wedding ignoring season → Blend seasonal + chosen
└── Guest attire contradicts theme
    └── Ignore guest attire, focus on venue + intentional decor
```

### 4. Video Frame Extraction Rate
```
Input: Wedding video files with metadata
├── Handheld/phone video (high motion blur)
│   └── Extract 1 fps to reduce blur frames
├── Professional video (smooth)
│   └── Extract 2-3 fps for optimal overlap
├── Drone footage
│   └── Extract 1 fps (smooth motion, redundant frames)
├── Ceremony (mostly static)
│   └── Extract 1 fps, boost for processional/recessional
└── Reception/dancing (high motion)
    └── Extract 3 fps to capture movement variety
```

### 5. Space Skip Threshold Decision
```
Input: Reconstructed space quality metrics
├── < 50 images AND reconstruction error > 5.0 pixels
│   └── Skip space: insufficient coverage, warn user
├── 50-100 images AND error > 3.0 pixels
│   └── Include with quality warning, mark as "preview quality"
├── > 100 images AND error > 2.0 pixels
│   └── Retrain with adjusted parameters, likely lighting issues
└── Blurry photos > 40% of space images
    └── Skip space, request better photos from user
```

## FAILURE MODES

### 1. COLMAP Divergence Cascade
**Symptom**: Sparse reconstruction fails completely, no 3D points generated
**Detection Rule**: If COLMAP outputs < 100 3D points for > 200 input images
**Diagnosis**: Feature matching failure due to repetitive textures (white walls, flowers) or extreme lighting changes
**Fix**: 
- Re-extract features with lower max_image_size (1600px)
- Switch to sequential matcher instead of exhaustive
- Filter images by Laplacian variance > 150 to remove blur

### 2. Face-Cluster False Merge Explosion  
**Symptom**: Single cluster contains 3+ distinct people, especially bridesmaids in similar makeup
**Detection Rule**: If cluster size > 30 photos AND intra-cluster cosine distance variance > 0.15
**Diagnosis**: Similar makeup, lighting, or formal poses confusing embeddings
**Fix**:
- Reduce clustering threshold by 0.05
- Apply makeup-invariant embedding model (AdaFace instead of ArcFace)
- Manual split using user confirmation of cluster samples

### 3. Theme Signal Chaos
**Symptom**: UI colors clash horribly, typography doesn't match aesthetic
**Detection Rule**: If extracted color palette has > 8 dominant colors OR no single color > 15% dominance
**Diagnosis**: Too many competing signals from mixed lighting, decorations, clothing
**Fix**:
- Focus extraction on venue + decor photos only, ignore people
- Apply k-means clustering to consolidate palette to 4-5 colors
- Fallback to safe neutral palette with couple's stated preferences

### 4. Memory Overflow Death Spiral
**Symptom**: 3DGS training crashes, viewer freezes on load
**Detection Rule**: If trained .ply file > 2GB OR browser memory usage > 8GB
**Diagnosis**: Too many Gaussian points from over-densification or merged scenes
**Fix**:
- Split scene into smaller spatial regions
- Reduce densify_grad_threshold from 0.0002 to 0.0005
- Implement LOD (level-of-detail) rendering with quality presets

### 5. Guest Photo Desert
**Symptom**: Many face clusters have only 1-2 poor-quality photos
**Detection Rule**: If > 30% of clusters have < 3 photos OR average aesthetic score < 0.4
**Diagnosis**: Insufficient photo coverage or professional photographer focused only on couple
**Fix**:
- Request guest phone photos to fill gaps
- Lower aesthetic threshold for rare-appearance guests
- Generate "best available" galleries with quality disclaimers

## WORKED EXAMPLES

### Example 1: Large Disco Wedding (500 guests, 3000 photos)
**Scenario**: 1970s theme revival, disco balls, gold/orange/purple decor, mixed lighting (strobes + warm), professional + 50 guest phones

**Step-by-step walkthrough**:

1. **Initial Assessment**: 3000 photos, detect 4 spaces (ceremony, cocktail, reception, photo booth)
   - Decision Point 1 triggered: > 500 photos per space → train separately
   - Space distribution: ceremony (800), cocktail (400), reception (1500), photo booth (300)

2. **Theme Extraction**: 
   - Color analysis finds: gold (22%), burnt orange (18%), deep purple (15%), brown (12%)
   - Era signals: disco ball reflections, wide lapels in photos, platform shoes
   - Typography match: groovy script + bold sans serif
   - Decision Point 3: Theme signals align → proceed with disco aesthetic

3. **Face Clustering**:
   - 2847 faces detected across all photos
   - Decision Point 2: Large wedding + mixed photo sources → threshold 0.25 + 0.05 = 0.3
   - Result: 287 unique identities (realistic for 500-guest wedding)

4. **3DGS Training**:
   - Decision Point 4: Professional video → extract at 2 fps
   - Ceremony space training completes successfully
   - Reception space hits Decision Point 5: > 1500 images triggers sub-region split
   - Split reception into: dance floor, dining area, bar area

5. **Quality Gates Check**:
   - ✓ All spaces reconstructed with < 2.0 pixel error
   - ✓ Face clusters manually verified for couple + wedding party
   - ✓ Theatre mode markers placed at 12 key moments
   - ✓ UI theme matches gold/orange/purple palette
   - ✓ Guest galleries generated for 287 identities

**Expert catches vs. Novice misses**:
- **Expert**: Notices strobing lights will confuse COLMAP, filters those frames before processing
- **Novice**: Includes all frames, gets reconstruction failure, doesn't understand why
- **Expert**: Recognizes disco theme needs bold, groovy typography—not elegant script
- **Novice**: Applies generic wedding fonts, loses the personality

### Example 2: Intimate Rustic Ceremony (50 guests, 400 photos)
**Scenario**: Barn venue, earth tones, string lights, sage/cream decor, single professional photographer

**Key decision differences**:
- Small photo count triggers Decision Point 1: unified scene approach
- Conservative face clustering (0.4 threshold) due to limited photos per person
- Earth-tone palette extraction straightforward (no conflicts)
- Single lighting condition simplifies reconstruction

**Trade-off analysis**:
- **Benefit**: Seamless navigation, no portal breaks
- **Risk**: Lower overall quality due to unified training
- **Mitigation**: Accept risk for small venue—user experience more important

## QUALITY GATES

- [ ] All venue spaces reconstructed with COLMAP error < 3.0 pixels
- [ ] Face clustering achieves > 95% precision on couple + wedding party (verified manually)
- [ ] Theatre mode includes minimum 8 key moments with video/audio sync
- [ ] Color palette extraction yields cohesive 4-6 colors matching wedding aesthetic
- [ ] Best photo selection provides minimum 3 high-quality images per guest (where possible)
- [ ] Web viewer loads all scenes within 15 seconds on standard connection
- [ ] Guest roster correctly identifies minimum 90% of wedding party members
- [ ] UI theme visually matches extracted wedding aesthetic (validated by user)
- [ ] 3DGS file sizes total < 5GB for reasonable hosting/sharing
- [ ] All key moments playback smoothly without audio desync > 100ms

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**
- **General photo editing** → Use `native-app-designer` instead for basic editing, filters, adjustments
- **Non-wedding 3DGS projects** → Use `drone-inspection-specialist` for architectural/industrial 3D scanning
- **Wedding planning or vendor coordination** → This is not a wedding planner, only processes existing photos/video
- **Real-time event streaming** → Use dedicated streaming solutions for live broadcast
- **Professional photography instruction** → Use photography education skills for technique training
- **Video editing without 3D reconstruction** → Use standard video editing skills for traditional editing needs

**Delegate to other skills when:**
- User wants basic photo slideshow → `collage-layout-expert`
- Need color palette advice before wedding → `color-theory-palette-harmony-expert` 
- Want to improve individual photos → `photo-composition-critic`
- Need facial recognition for security → `face-detection-specialist`