---
license: Apache-2.0
name: photo-content-recognition-curation-expert
description: Expert in photo content recognition, intelligent curation, and quality filtering. Specializes in face/animal/place recognition, perceptual hashing for de-duplication, screenshot/meme detection, burst photo selection, and quick indexing strategies. Activate on 'face recognition', 'face clustering', 'perceptual hash', 'near-duplicate', 'burst photo', 'screenshot detection', 'photo curation', 'photo indexing', 'NSFW detection', 'pet recognition', 'DINOHash', 'HDBSCAN faces'. NOT for GPS-based location clustering (use event-detection-temporal-intelligence-expert), color palette extraction (use color-theory-palette-harmony-expert), semantic image-text matching (use clip-aware-embeddings), or video analysis/frame extraction.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob,mcp__firecrawl__firecrawl_search,WebFetch
category: AI & Machine Learning
tags:
  - content-recognition
  - photo
  - curation
  - computer-vision
  - tagging
pairs-with:
  - skill: event-detection-temporal-intelligence-expert
    reason: Temporal context for photos
  - skill: wedding-immortalist
    reason: Curate wedding photo collections
---

# Photo Content Recognition & Curation Expert

Expert in photo content analysis and intelligent curation. Combines classical computer vision with modern deep learning for comprehensive photo analysis.

## Decision Points

```
PHOTO LIBRARY SIZE?
├─ <1K photos → Single-pass processing
│   ├─ dHash for duplicates (fastest)
│   └─ Agglomerative clustering (known thresholds)
├─ 1K-10K photos → Optimized pipeline
│   ├─ pHash → DINOHash hybrid
│   └─ HDBSCAN if variance in cluster sizes >3x
└─ >10K photos → Batch processing
    ├─ GPU batching (batch_size=32)
    └─ Incremental updates only

CLUSTERING ALGORITHM CHOICE?
├─ Face variance known? → Agglomerative (threshold=0.4, 0.6)
├─ Unknown distribution? → HDBSCAN (auto-threshold)
└─ Real-time additions? → Incremental clustering

DUPLICATE DETECTION ROBUSTNESS?
├─ Exact duplicates only? → dHash (Hamming ≤3)
├─ Brightness/contrast edits? → pHash (Hamming ≤5)
├─ Heavy crops/compression? → DINOHash (Hamming ≤10)
└─ Production system? → Hybrid (pHash→DINOHash)

BURST PHOTO SELECTION?
├─ Face quality available? → Weight faces 35%, sharpness 30%
├─ No faces detected? → Weight sharpness 50%, aesthetics 30%
└─ Action photos? → Weight sharpness 60%, exposure 25%

CONTENT FILTERING CONFIDENCE?
├─ Screenshot confidence >0.6? → Filter out
├─ NSFW confidence >0.8? → Filter out  
├─ Face confidence <0.9? → Exclude from clustering
└─ Pet confidence <0.7? → Manual review
```

## Failure Modes

### 1. Too Many Face Clusters (Symptom: 100+ clusters for 1000 photos)

**Root Cause:** Clustering threshold too strict, splitting same person into multiple clusters
**Detection Rule:** If clusters/unique_people ratio > 2.0, threshold too conservative
**Fix:** 
- Increase distance threshold from 0.4 to 0.6
- Run second-pass merging with relaxed threshold
- Verify with manual spot-check of 5 random cluster pairs

### 2. False Duplicate Detection (Symptom: Different people flagged as duplicates)

**Root Cause:** Perceptual hash threshold too loose, faces in similar poses triggering matches
**Detection Rule:** If duplicate groups contain faces with cosine distance >0.7, hash threshold too aggressive
**Fix:**
- Tighten Hamming threshold from 10 to 5 bits
- Add face verification step: extract face embeddings from "duplicates"
- If face similarity <0.5, not duplicates

### 3. Burst Selection Missing Best Frame (Symptom: Blurry photos selected over sharp ones)

**Root Cause:** Face quality override masking sharpness issues when faces poorly detected
**Detection Rule:** If selected burst frame Laplacian variance <500 while other frames >1000
**Fix:**
- Cap face quality bonus at 20% total score
- Add face detection confidence check (>0.9 required for face bonus)
- Fallback to pure sharpness if no high-confidence faces

### 4. Screenshot False Negatives (Symptom: UI screenshots in final curated set)

**Root Cause:** Single-signal detection missing edge cases (dark mode, custom UI)
**Detection Rule:** If photos contain perfect rectangles + high text density but confidence <0.6
**Fix:**
- Lower combined threshold from 0.6 to 0.5 for multi-signal hits
- Add aspect ratio check for common device screens (16:9, 19.5:9, 4:3)
- OCR confidence boost for text >20% coverage

### 5. Memory Explosion on Large Libraries (Symptom: >16GB RAM usage on 10K photos)

**Root Cause:** Loading all images into memory simultaneously instead of streaming
**Detection Rule:** If memory usage >2GB per 1000 photos, batch size too large
**Fix:**
- Reduce batch size from 64 to 16 images
- Implement lazy loading with generators
- Cache only embeddings/hashes, not raw images

## Worked Examples

### Example 1: 500-Photo Family Library Curation

**Scenario:** Family vacation photos (500 images), many bursts and similar poses, want top 100 for sharing.

**Step 1 - Library Analysis:**
- Photo count: 500 → Use pHash→DINOHash hybrid
- Face variance unknown → HDBSCAN clustering
- Mix of portraits/landscapes → Multi-criteria burst selection

**Step 2 - Duplicate Detection:**
```python
# Stage 1: Fast pHash filtering
pHash_duplicates = find_duplicates_phash(photos, threshold=5)
# Found 45 potential duplicate groups

# Stage 2: DINOHash verification  
verified_duplicates = []
for group in pHash_duplicates:
    dino_hashes = [compute_dinohash(img) for img in group]
    if hamming_distance(dino_hashes[0], dino_hashes[1]) <= 8:
        verified_duplicates.append(group)
# Verified 38 true duplicate groups
```

**Step 3 - Face Clustering Decision:**
- Extract face embeddings: 234 faces detected
- Check cluster size variance: max_size/min_size = 4.2 (>3x threshold)  
- Choose HDBSCAN over agglomerative

**Step 4 - Burst Selection Trade-offs:**
- Detected 12 burst sequences (3-8 photos each)
- Burst #3: 5 photos of kids playing
  - Frame 2: Highest sharpness (1850 Laplacian) but no faces detected
  - Frame 4: Lower sharpness (1200) but 2 clear faces, both smiling
  - **Decision:** Frame 4 selected (face quality 35% weight > sharpness 30%)

**Final Output:** 387 unique photos → 100 curated (top aesthetic + diversity)

### Example 2: Burst Selection Edge Case - Blurry + Exposed Face

**Scenario:** Wedding ceremony burst of 15 shots, bride's face overexposed in sharpest frames.

**Challenge:** Best technical shot (frame 8) has bride's face blown out by direct sunlight.

**Analysis Process:**
```python
# Frame 8: Sharpness winner but face quality fail
frame_8_metrics = {
    'sharpness': 2100,      # Highest in burst
    'face_quality': 0.2,    # Overexposed face detection
    'aesthetics': 0.75,     # Good composition 
    'exposure': 0.3         # Highlights clipped
}

# Frame 11: Balanced option
frame_11_metrics = {
    'sharpness': 1650,      # Still acceptable  
    'face_quality': 0.9,    # Clear face, good exposure
    'aesthetics': 0.8,      # Slightly better angle
    'exposure': 0.85        # Well exposed
}

# Weighted scoring:
frame_8_score = 2100*0.3 + 0.2*0.35 + 0.75*0.2 + 0.3*0.05 = 630 + 0.07 + 0.15 + 0.015 = 630.235
frame_11_score = 1650*0.3 + 0.9*0.35 + 0.8*0.2 + 0.85*0.05 = 495 + 0.315 + 0.16 + 0.0425 = 495.518
```

**Expert Insight:** Frame 11 selected despite lower sharpness because face quality penalty (-80%) outweighs sharpness advantage. Novice would pick frame 8 based on technical metrics alone.

## Quality Gates

**Photo Indexing Complete:**
- [ ] All EXIF metadata extracted and cached
- [ ] Perceptual hashes computed for 100% of images  
- [ ] Face embeddings extracted (confidence >0.9 only)
- [ ] CLIP embeddings generated for semantic search
- [ ] Index file saved and can be reloaded without errors

**Duplicate Detection Complete:**
- [ ] Hamming distance threshold validated (manual check 10 random pairs)
- [ ] Duplicate groups reviewed (no false positives in sample)
- [ ] Performance acceptable (<2 min per 1000 photos)
- [ ] Original files preserved (only flagging, not deleting)

**Face Clustering Complete:**
- [ ] Cluster count reasonable (max 1 cluster per 50 photos)
- [ ] No singleton clusters with confidence >0.95 faces
- [ ] Manual verification: 5 random clusters contain same person
- [ ] Noise properly classified (face confidence <0.9)

**Burst Selection Complete:**
- [ ] All burst sequences identified (timestamp gap <0.5s)
- [ ] One photo selected per burst (highest weighted score)
- [ ] Face quality bonus only applied when face confidence >0.9
- [ ] Manual spot-check: 3 burst selections look correct

**Content Filtering Complete:**
- [ ] Screenshot detection tested on known UI captures (>95% accuracy)  
- [ ] NSFW filter validated on test set (no false positives on family photos)
- [ ] Pet detection covers common animals (cat, dog, horse, bird)
- [ ] Confidence thresholds produce <5% manual review rate

## NOT-FOR Boundaries  

**This skill should NOT be used for:**

- **GPS-based location clustering** → Use `event-detection-temporal-intelligence-expert` instead
  - Reason: Requires temporal event modeling and GPS clustering algorithms
  
- **Color palette extraction and harmony** → Use `color-theory-palette-harmony-expert` instead  
  - Reason: Needs color theory knowledge and palette composition rules
  
- **Semantic image-text matching** → Use `clip-aware-embeddings` instead
  - Reason: Requires cross-modal understanding and text-image alignment
  
- **Video analysis or frame extraction** → Use video processing specialist instead
  - Reason: Different pipeline for temporal sequences and video codecs

- **Advanced photo editing** → Use image editing specialist instead
  - Reason: Focus is on analysis/curation, not pixel-level manipulation

- **3D scene reconstruction** → Use computer vision specialist instead
  - Reason: Requires stereo vision and depth estimation techniques

**Delegation Rules:**
- If task involves time/location → `event-detection-temporal-intelligence-expert`
- If task involves colors/aesthetics → `color-theory-palette-harmony-expert`  
- If task involves text matching → `clip-aware-embeddings`
- If task involves editing → Image editing specialist