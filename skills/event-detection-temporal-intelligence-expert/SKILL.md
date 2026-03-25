---
license: Apache-2.0
name: event-detection-temporal-intelligence-expert
description: Expert in temporal event detection, spatio-temporal clustering (ST-DBSCAN), and photo context understanding. Use for detecting photo events, clustering by time/location, shareability prediction, place recognition, event significance scoring, and life event detection. Activate on 'event detection', 'temporal clustering', 'ST-DBSCAN', 'spatio-temporal', 'shareability prediction', 'place recognition', 'life events', 'photo events', 'temporal diversity'. NOT for individual photo aesthetic quality (use photo-composition-critic), color palette analysis (use color-theory-palette-harmony-expert), face recognition implementation (use photo-content-recognition-curation-expert), or basic EXIF timestamp extraction.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob,mcp__firecrawl__firecrawl_search,WebFetch
category: AI & Machine Learning
tags:
  - event-detection
  - temporal
  - intelligence
  - pattern-recognition
  - real-time
pairs-with:
  - skill: photo-content-recognition-curation-expert
    reason: Content + temporal understanding
  - skill: wedding-immortalist
    reason: Event detection for wedding albums
---

# Event Detection & Temporal Intelligence Expert

Expert in detecting meaningful events from photo collections using spatio-temporal clustering, significance scoring, and intelligent photo selection.

## DECISION POINTS

### ST-DBSCAN vs DeepDBSCAN Algorithm Selection

```
Photo corpus analysis needed?
├─ Have GPS + timestamps?
│   ├─ Same location, different activities detected? ──── DeepDBSCAN
│   │   └─ Cost tolerance: High accuracy > speed ─────── Add CLIP embeddings
│   └─ Simple time/location grouping sufficient? ────── ST-DBSCAN
│
├─ Timestamps only (no GPS)?
│   ├─ Visual similarity important? ───────────────── Temporal + CLIP clustering  
│   └─ Pure time-based events? ────────────────────── Temporal binning
│
└─ Need hierarchical events (vacation > daily > moments)?
    └─ Multi-level ST-DBSCAN cascade ─────────────────── Expanding ε thresholds
```

### Parameter Selection Matrix

| Event Type | ε_spatial | ε_temporal | min_pts | Use Case |
|------------|-----------|------------|---------|----------|
| **Indoor party** | 50m | 4hr | 5 | Home gatherings |
| **Wedding** | 200m | 8hr | 8 | Venue + reception |
| **City tour** | 5km | 12hr | 3 | Tourism, exploration |
| **Multi-day trip** | 50km | 72hr | 10 | Vacation clustering |
| **Conference** | 1km | 24hr | 6 | Business events |

### Event Significance Threshold Decision

```
Computed significance score?
├─ Score ≥ 0.8? ──────── Life event candidate (birth, wedding, graduation)
├─ Score ≥ 0.6? ──────── Major memorable event  
├─ Score ≥ 0.4? ──────── Significant social gathering
├─ Score ≥ 0.2? ──────── Minor event worth keeping
└─ Score < 0.2? ──────── Daily routine, consider filtering
```

## FAILURE MODES

### Over-Clustering Syndrome
**Symptoms:** Every few photos become separate "events"; 50+ micro-events from one vacation
**Detection Rule:** If >30% of events contain <5 photos AND duration <2 hours
**Diagnosis:** ε parameters too restrictive, treating natural breaks as separate events
**Fix:** Increase ε_temporal (2hr → 6hr) or use hierarchical clustering with larger top-level ε

### Under-Clustering Collapse  
**Symptoms:** Wedding ceremony + reception next day grouped as single event
**Detection Rule:** If single event spans >24hr AND contains >200 photos AND location changes >5km
**Diagnosis:** ε parameters too permissive, merging distinct occasions
**Fix:** Reduce ε_temporal (12hr → 6hr) OR add location change detection as break condition

### GPS Noise Contamination
**Symptoms:** Indoor event scattered across 10km radius; bathroom photos 500m from venue
**Detection Rule:** If event location std_dev >2x expected venue size AND contains <20% outdoor photos
**Diagnosis:** GPS drift/reflection causing false spatial spread
**Fix:** Apply GPS smoothing filter OR increase min_pts to require more spatial consensus

### Content-Blind Grouping
**Symptoms:** Empty venue setup photos grouped with ceremony; parking lot + wedding altar same event
**Detection Rule:** If visual diversity within event >0.8 cosine distance AND high location precision
**Diagnosis:** ST-DBSCAN without visual validation grouping unrelated content
**Fix:** Switch to DeepDBSCAN with ε_visual=0.4 OR post-filter by CLIP similarity

### Temporal Boundary Bleeding
**Symptoms:** Friday work photos grouped with Saturday family party; overnight events split at midnight
**Detection Rule:** If event crosses date boundary AND activity types differ >0.6 semantic distance
**Diagnosis:** Fixed temporal windows ignoring natural event boundaries
**Fix:** Use adaptive temporal windows OR detect activity changes as natural breaks

## WORKED EXAMPLES

### Example 1: Wedding Event Detection

**Input:** 847 photos from weekend wedding, GPS enabled
```python
photos = load_wedding_corpus("sarah_tom_wedding/")
# GPS range: Venue (40.7589, -73.9851) to Hotel (40.7505, -73.9934)  
# Time range: Fri 2pm - Sun 11am (45 hours)
```

**Decision Process:**
1. **Algorithm Choice:** Multiple venues + high importance → DeepDBSCAN
2. **Parameter Selection:** Wedding type → ε_spatial=200m, ε_temporal=8hr, min_pts=8
3. **Visual Threshold:** Diverse wedding activities → ε_visual=0.5

**Expert vs Novice Decisions:**
- **Novice miss:** Would use single ε_temporal=24hr, grouping rehearsal dinner with ceremony
- **Expert catch:** Detects natural breaks (rehearsal→ceremony→reception) using CLIP similarity drops

**Results:**
```
Event 1: Rehearsal Dinner (Fri 6pm-10pm, 34 photos)
Event 2: Getting Ready (Sat 10am-2pm, 89 photos) 
Event 3: Ceremony (Sat 2pm-4pm, 156 photos)
Event 4: Reception (Sat 5pm-11pm, 203 photos)
Noise: Travel/hotel photos (47 photos)
```

### Example 2: Parameter Trade-off Analysis

**Scenario:** 10,000 photo family corpus, computational budget constraints

**Trade-off Decision:**
- **ST-DBSCAN:** 2.1sec processing, 85% event accuracy, 12 false merges
- **DeepDBSCAN:** 47sec processing, 94% event accuracy, 3 false merges

**Decision Factors:**
- Real-time requirement? → ST-DBSCAN
- Batch processing + accuracy critical? → DeepDBSCAN  
- Hybrid: ST-DBSCAN with DeepDBSCAN refinement on high-significance events

**Expert Insight:** Cost/accuracy inflection point at ~5,000 photos where CLIP embedding overhead becomes worthwhile.

## QUALITY GATES

Event detection task complete when ALL conditions met:

- [ ] Every photo assigned to event cluster OR explicitly marked as noise (-1 label)
- [ ] No event spans >48 hours without explicit multi-day justification
- [ ] No single-photo events (unless min_pts=1 explicitly chosen for outlier detection)
- [ ] Event significance scores computed and >0.8 flagged for life event analysis
- [ ] GPS coordinate outliers (>3 std_dev from event centroid) investigated for noise
- [ ] Visual diversity within events <0.7 cosine distance (if using DeepDBSCAN)
- [ ] Temporal gaps >6 hours within events have activity continuity justification
- [ ] Parameter choices documented with rationale (indoor/outdoor, event type)
- [ ] Processing time <5sec per 1000 photos (performance requirement)
- [ ] Event hierarchy validated if multi-level clustering applied

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**

- **Individual photo quality assessment** → Use `photo-composition-critic` instead
- **Color scheme analysis for events** → Use `color-theory-palette-harmony-expert` instead  
- **Face recognition/clustering** → Use `photo-content-recognition-curation-expert` first, then apply event detection
- **EXIF timestamp extraction** → Basic file parsing, not event intelligence
- **Single photo context** → This skill requires photo collections (>10 photos minimum)
- **Real-time photo stream processing** → Designed for batch corpus analysis
- **Geographic route planning** → Use mapping services; this extracts events from completed trips
- **Social graph analysis** → This handles temporal/spatial clustering, not relationship mapping

**Delegation patterns:**
- For photo aesthetic quality within events → `photo-composition-critic`
- For face-based event grouping → First `photo-content-recognition-curation-expert`, then this skill
- For collage layout of detected events → `collage-layout-expert`
- For color harmony across event photos → `color-theory-palette-harmony-expert`