---
license: Apache-2.0
name: ai-video-production-master
description: Expert in script-to-video production pipelines for Apple Silicon Macs. Specializes in hybrid local/cloud workflows, LoRA training for character consistency, motion graphics generation, and artist commissioning. Activate on 'AI video production', 'script to video', 'video generation pipeline', 'character consistency', 'LoRA training', 'cloud GPU', 'motion graphics', 'Wan I2V', 'InVideo alternative'. NOT for real-time video editing, video compositing (use DaVinci/Premiere), audio production, or 3D modeling (use Blender/Maya).
allowed-tools: Read,Write,Edit,Bash(python:*,ffmpeg:*,npm:*),WebFetch,mcp__firecrawl__firecrawl_search
category: Video & Audio
tags:
  - video-production
  - ai
  - automation
  - content-creation
  - editing
pairs-with:
  - skill: sound-engineer
    reason: Audio for AI-generated videos
  - skill: voice-audio-engineer
    reason: Voice synthesis for narration
---

# AI Video Production Master

Expert in script-to-video production pipelines for Apple Silicon Macs. Specializes in hybrid local/cloud workflows, style consistency, and motion graphics generation.

## DECISION POINTS

### Method Selection Tree
```
Script Analysis:
├── Content Type = Educational/Corporate/Documentary
│   ├── Budget < $50/month → Stock Footage Assembly (InVideo-style)
│   └── Budget > $50/month → Stock + T2V Hybrid
├── Content Type = Creative/Artistic/Abstract
│   ├── Timeline < 2 days → Sora/Runway T2V
│   └── Timeline > 2 days → Custom I2V with LoRA training
└── Content Type = Brand/Character-focused
    ├── Existing assets available → I2V animation pipeline
    └── No assets → Commission artists → I2V pipeline

Quality vs. Cost Decision:
├── Professional deliverable needed
│   ├── Use Sora/Runway Gen-3 (premium T2V)
│   └── Commission custom artwork for I2V
├── Prototype/test content
│   ├── Use stock footage + free T2V models
│   └── Local ComfyUI I2V generation
└── High volume production
    ├── Cloud batch processing (Vast.ai)
    └── Automated stock footage workflows

Error Recovery Tree:
├── Quality fails at T2V generation
│   ├── Switch to stock footage + motion graphics overlay
│   └── Fallback to I2V with commissioned artwork
├── Cloud GPU timeout/failure
│   ├── Retry with different provider (Vast.ai → RunPod)
│   └── Switch to local processing with extended timeline
└── Style consistency breaks
    ├── Retrain LoRA with more reference images
    └── Use IPAdapter + consistent prompt structure
```

### Processing Location Decision Matrix
| Shot Count | Complexity | Budget | Recommendation |
|------------|------------|--------|----------------|
| 1-5 | Simple | Any | Local M4 Max |
| 6-20 | Medium | <$10 | Stock footage |
| 6-20 | High | >$10 | Cloud GPU batch |
| 20+ | Any | Any | Cloud GPU required |

## FAILURE MODES

### Blurry Motion Jitter
**Symptoms:** Inconsistent frame rates, stuttering motion, temporal artifacts
**Diagnosis:** Mismatched FPS settings or insufficient motion guidance
**Fix:** Set consistent 24fps pipeline, add motion strength controls, use higher guidance scale (7-9)
**Detection Rule:** If temporal consistency score < 0.7 or frame delta > 0.3, apply motion stabilization

### Character Consistency Drift
**Symptoms:** Character appearance changes between shots, style inconsistency
**Diagnosis:** Insufficient reference conditioning or LoRA overfitting
**Fix:** Retrain LoRA with 15-20 reference images, use IPAdapter for face consistency
**Detection Rule:** If character similarity score < 0.8 between consecutive shots, halt and retrain

### Cost Overrun Spiral
**Symptoms:** Cloud GPU bills exceed budget by >200%, slow iteration cycles
**Diagnosis:** No cost monitoring or inefficient batch sizing
**Fix:** Set hard limits in cloud scripts, optimize batch sizes, use spot instances
**Detection Rule:** If cost-per-minute exceeds $0.50 or iteration time > 15min, switch to local processing

### Audio Desync Cascade
**Symptoms:** Lip sync drift, audio-visual timing mismatches
**Diagnosis:** Variable generation times affecting audio alignment
**Fix:** Generate all video first, then align audio in post with markers
**Detection Rule:** If audio offset > 200ms from video markers, re-align with FFmpeg

### Schema Bloat Paralysis
**Symptoms:** Too many generation options, analysis paralysis, project stalls
**Diagnosis:** Over-optimization without testing simple approaches first
**Fix:** Always start with stock footage proof-of-concept, iterate to complexity
**Detection Rule:** If project planning > 2 hours without generated content, default to stock footage

## WORKED EXAMPLES

### Educational Video: "Quantum Computing Explained"
**Input:** 3-minute script about quantum computing basics

**Decision Process:**
1. Content analysis: Educational → Stock footage recommended
2. Budget check: $30 budget → Use Pexels API + motion graphics
3. Shot breakdown: 12 shots needed
4. Quality target: Professional but not cinematic

**Execution:**
```bash
# Step 1: Generate shot list from script
python scripts/script_analyzer.py --script quantum_script.txt
# Output: 12 shots identified, 8 require stock footage, 4 need motion graphics

# Step 2: Source stock footage
python scripts/stock_video_generator.py --shots_file shots.json --style documentary
# Selected: Laboratory footage, abstract tech visuals, clean backgrounds

# Step 3: Generate motion graphics for complex concepts
python scripts/motion_graphics_generator.py --type data_viz --concept "quantum_states"
# Created: Animated diagrams for superposition, entanglement

# Step 4: Assembly and sync
python scripts/video_assembler.py --footage stock_clips/ --graphics motion/ --audio narration.wav
```

**Expert vs. Novice:**
- Expert: Checked audio levels before graphics generation, chose 16:9 format for platform compatibility
- Novice would miss: Consistent lighting in stock selection, proper motion graphic duration matching speech pace

**Final output:** 3:15 video, cost $0 (free stock), 45 minutes total production time

## QUALITY GATES

Video production complete when ALL conditions met:

- [ ] Frame rate consistent at 24fps across all segments
- [ ] Audio levels normalized between -23dB and -18dB LUFS
- [ ] Visual style maintains consistency (color grading, aspect ratio)
- [ ] Motion graphics sync with narration within 100ms tolerance
- [ ] Character/subject consistency score >0.8 across shots
- [ ] No temporal artifacts (flicker, jitter) in any 5-second segment
- [ ] Subtitle/caption timing aligned with audio peaks
- [ ] Export renders without errors in target resolution
- [ ] File size within platform limits (YouTube: <128GB, social: <4GB)
- [ ] Backup files stored with version control

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**

- **Real-time video editing** → Use DaVinci Resolve or Premiere Pro directly
- **Complex video effects/compositing** → Delegate to After Effects or `physics-rendering-expert` skill
- **Audio production beyond basic sync** → Use `sound-engineer` skill for mixing, mastering, sound design
- **3D modeling or complex animation** → Use Blender/Maya or `physics-rendering-expert` skill
- **Live streaming or broadcast** → Use OBS Studio or broadcast-specific tools
- **Color grading beyond basic correction** → Use professional colorist workflows
- **Motion tracking or match moving** → Use specialized tracking software
- **Multi-camera synchronization** → Use dedicated sync tools like PluralEyes

**Handoff triggers:**
- If project requires >20 layers of compositing → `physics-rendering-expert`
- If audio needs custom sound design → `sound-engineer` 
- If 3D elements need modeling → Blender specialist
- If real-time performance needed → Use native video editing software