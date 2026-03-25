---
license: Apache-2.0
name: video-frame-extraction-analysis
description: "Extract keyframes, detect scenes, and build CLIP-indexed temporal search over video content. Activate on: keyframe extraction, scene detection, video search, video indexing, temporal analysis. NOT for: video editing/rendering (video-processing-editing), video generation (ai-video-production-master)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - video-analysis
  - keyframe-extraction
  - scene-detection
  - clip-indexing
  - temporal-search
pairs-with:
  - skill: video-processing-editing
    reason: Video editor handles rendering; this skill handles analysis and indexing
  - skill: multimodal-embedding-generator
    reason: CLIP/SigLIP embeddings power visual search over extracted frames
  - skill: audio-transcription-pipeline
    reason: Transcription aligns with visual frames for multimodal video search
---

# Video Frame Extraction & Analysis

Extract keyframes, detect scene boundaries, and build CLIP-indexed temporal search systems for video content analysis and retrieval.

## Activation Triggers

**Activate on**: "keyframe extraction", "scene detection", "video search", "video indexing", "find frame in video", "temporal search", "video content analysis", "scene boundary detection", "CLIP video search"

**NOT for**: Video editing, trimming, or rendering (video-processing-editing), video generation from text/images (ai-video-production-master), or face recognition in video (face-recognition-system-builder)

## Quick Start

1. **Decode video** — Use ffmpeg or decord for efficient frame extraction. Never decode all frames; sample intelligently.
2. **Detect scenes** — PySceneDetect for cut detection, or embedding-based scene boundary detection for gradual transitions.
3. **Extract keyframes** — One representative frame per scene, plus additional frames at fixed intervals within long scenes.
4. **Embed frames** — Run CLIP/SigLIP on keyframes to generate searchable visual embeddings.
5. **Index and search** — Store embeddings with timestamps in a vector DB. Query with text ("a person opening a door") or image.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Frame Extraction** | ffmpeg, decord, OpenCV, PyAV | decord is fastest for random access |
| **Scene Detection** | PySceneDetect, TransNetV2 | Cut detection + gradual transition detection |
| **Visual Embedding** | CLIP, SigLIP, InternVideo2 | Per-frame or pooled-scene embeddings |
| **Temporal Search** | Vector DB + timestamp metadata | "Find the frame where X happens" |
| **Shot Analysis** | Shot type classification, motion estimation | Wide/medium/close-up, camera movement |
| **OCR on Frames** | PaddleOCR, EasyOCR, Tesseract | Extract text from slides, titles, signage |

## Architecture Patterns

### Pattern 1: Scene-Based Keyframe Pipeline

```
Video File ──→ [Scene Detector] ──→ [Keyframe Selector] ──→ [CLIP Embed] ──→ [Vector DB]
    │                │                      │                      │              │
  input         PySceneDetect          1 frame per scene      SigLIP-large    store with
  mp4/mkv       threshold=27           at scene midpoint      384-dim         timestamp
                detect cuts            + every 5 sec in                       + scene_id
                + transitions          long scenes (>30s)                     + metadata
```

```python
# Scene detection + keyframe extraction
from scenedetect import detect, ContentDetector
import decord
import numpy as np

def extract_keyframes(video_path: str) -> list[dict]:
    """Extract one keyframe per scene with timestamps."""
    # Step 1: Detect scene boundaries
    scene_list = detect(video_path, ContentDetector(threshold=27))

    # Step 2: Extract keyframe at midpoint of each scene
    vr = decord.VideoReader(video_path)
    fps = vr.get_avg_fps()
    keyframes = []

    for i, scene in enumerate(scene_list):
        start_frame = scene[0].get_frames()
        end_frame = scene[1].get_frames()
        mid_frame = (start_frame + end_frame) // 2

        frame = vr[mid_frame].asnumpy()  # RGB numpy array
        timestamp = mid_frame / fps

        keyframes.append({
            "frame": frame,
            "frame_index": mid_frame,
            "timestamp_sec": timestamp,
            "scene_index": i,
            "scene_duration": (end_frame - start_frame) / fps,
        })

        # For long scenes (>30s), add extra keyframes every 5 sec
        scene_dur = (end_frame - start_frame) / fps
        if scene_dur > 30:
            for t in np.arange(start_frame + int(5*fps), end_frame, int(5*fps)):
                extra = vr[int(t)].asnumpy()
                keyframes.append({
                    "frame": extra,
                    "frame_index": int(t),
                    "timestamp_sec": int(t) / fps,
                    "scene_index": i,
                    "scene_duration": scene_dur,
                })

    return keyframes
```

### Pattern 2: CLIP-Indexed Video Search

```
Indexing (offline):
  Video ──→ [Extract Keyframes] ──→ [SigLIP Embed] ──→ [Vector DB]
                                                            │
                                                     metadata per frame:
                                                     video_id, timestamp,
                                                     scene_id, thumbnail_path

Querying (online):
  Text: "person walking through rain" ──→ [SigLIP Text Embed] ──→ [Vector Search]
                                                                        │
                                                                  top-k frames
                                                                  with timestamps
                                                                        │
                                                                  "video_3.mp4 @ 01:23:45"
                                                                  "video_7.mp4 @ 00:45:12"
```

### Pattern 3: Multimodal Video Index

```
Video ──┬──→ [Keyframes] ──→ [CLIP Embed] ──→ [Visual Index]──┐
        │                                                       │
        ├──→ [Audio Track] ──→ [Whisper] ──→ [Text Embed] ──→ [Text Index]──┤──→ [Fusion Search]
        │                                                       │
        └──→ [Frame OCR] ──→ [Text Extract] ──→ [Text Embed]──┘

Fusion search: query hits all three indexes, reciprocal rank fusion combines results
  "Explain the sales chart" →
    Visual: frame with chart → timestamp 15:30
    Audio: "our Q3 numbers show..." → timestamp 15:28
    OCR: "Q3 Revenue: $4.2M" → timestamp 15:30
    Fused result: 15:28-15:35 segment with high confidence
```

## Anti-Patterns

1. **Extracting every frame** — A 1-hour video at 30fps is 108,000 frames. Embedding all of them is wasteful and slow. Use scene detection to select keyframes.
2. **Fixed-interval sampling without scene awareness** — Sampling every 5 seconds misses fast cuts and over-samples static scenes. Scene-based extraction is always better.
3. **Ignoring temporal context** — A single frame without a timestamp is useless for video search. Always store timestamps and scene boundaries as metadata.
4. **Using OpenCV VideoCapture for random access** — OpenCV decodes sequentially; seeking to frame 50,000 reads all prior frames. Use decord for O(1) random access.
5. **No thumbnail generation** — Search results need visual previews. Generate thumbnails alongside embeddings, stored as small JPEGs referenced by path in metadata.

## Quality Checklist

- [ ] Scene detection threshold tuned for content type (27-35 for cuts, lower for gradual)
- [ ] Keyframes extracted at scene midpoints (not boundaries, which may be transitional)
- [ ] Long scenes (>30s) have additional keyframes at regular intervals
- [ ] CLIP/SigLIP embeddings normalized before storage
- [ ] Timestamps stored as metadata on every vector (video_id + seconds)
- [ ] Thumbnails generated and stored alongside embeddings
- [ ] Text search via transcription aligned with visual frames
- [ ] Random access via decord or PyAV (not sequential OpenCV reads)
- [ ] Search results return video_id + timestamp + thumbnail + confidence score
- [ ] Pipeline handles multiple video formats (MP4, MKV, WebM, MOV)
