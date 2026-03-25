---
license: Apache-2.0
name: face-recognition-system-builder
description: "Build face recognition systems with InsightFace, ArcFace, enrollment pipelines, HDBSCAN clustering, and privacy-compliant architecture. Activate on: face recognition, face enrollment, face clustering, identity verification, facial search. NOT for: general object detection (computer-vision-pipeline), emotion analysis (ai-engineer)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - face-recognition
  - insightface
  - arcface
  - biometrics
  - privacy
pairs-with:
  - skill: computer-vision-pipeline
    reason: Face detection is a specialization of the general CV pipeline
  - skill: video-frame-extraction-analysis
    reason: Face recognition on video requires keyframe extraction first
  - skill: data-pipeline-engineer
    reason: Large-scale enrollment and batch processing need pipeline orchestration
---

# Face Recognition System Builder

Build production face recognition systems with InsightFace/ArcFace for enrollment, verification, identification, and clustering with privacy-compliant architecture.

## Decision Points

### Model Selection Decision Tree
```
Requirements Analysis:
├── Latency < 50ms per face?
│   ├── YES: Use buffalo_sc (lightweight, 0.7 accuracy)
│   └── NO: Continue to accuracy analysis
├── Accuracy > 95% required?
│   ├── YES: Use AdaFace (premium accuracy, 200ms latency)
│   └── NO: Use buffalo_l (balanced, 100ms latency)
└── Mobile/Edge deployment?
    ├── YES: buffalo_sc or custom quantized model
    └── NO: buffalo_l or AdaFace
```

### Threshold Tuning Heuristic
| Use Case | FAR Target | FRR Target | Threshold Range | Validation |
|----------|------------|------------|-----------------|------------|
| Security/Access Control | <0.1% | 1-5% | 0.55-0.65 | Test on impostor pairs |
| Photo Organization | 2-5% | <1% | 0.35-0.45 | Test on family albums |
| Investigation/Forensics | <0.01% | 10-20% | 0.65-0.75 | Test on mugshot datasets |
| Social Media Tagging | 5-10% | <2% | 0.30-0.40 | Test on casual photos |

### Enrollment Quality Decision
```
Per photo assessment:
├── Face detected with confidence > 0.7?
│   ├── NO: Reject photo, request new one
│   └── YES: Continue
├── Face size > 80px AND < 50% of image?
│   ├── NO: Reject (too small or too close)
│   └── YES: Continue
├── Pose deviation < 30 degrees (yaw/pitch)?
│   ├── NO: Flag as "supplementary only"
│   └── YES: Mark as "primary reference"
└── Final decision:
    ├── 3+ primary references: Complete enrollment
    ├── 1-2 primary + 2+ supplementary: Proceed with warning
    └── <3 total valid: Require additional photos
```

## Failure Modes

### 1. Pose/Lighting Degradation
**Detection**: Similarity scores dropping consistently below historical baseline (>10% decrease)
**Symptoms**: Good enrollments start failing verification, complaints of "system doesn't recognize me"
**Diagnosis**: Environmental conditions changed (new lighting, camera angle, seasonal changes)
**Fix**: 
- Re-tune threshold based on recent data
- Add current condition photos to existing enrollments
- Implement adaptive threshold based on lighting detection

### 2. Enrollment Contamination
**Detection**: New enrollment has unusually high similarity (>0.8) to existing different identity
**Symptoms**: False positive identifications, "system thinks I'm someone else"
**Diagnosis**: Multiple people enrolled under same identity, or identity mixup during enrollment
**Fix**:
- Audit enrollment: manually review all photos for consistency
- Split contaminated enrollment into separate identities
- Re-enroll with verified identity documentation

### 3. Threshold Drift Over Time
**Detection**: FAR/FRR metrics shifting >2% from baseline over 30-day periods
**Symptoms**: Gradual increase in false accepts OR false rejects system-wide
**Diagnosis**: Population demographics changing, or model degradation on new data patterns
**Fix**:
- Weekly threshold validation on held-out test set
- Retrain similarity calibration monthly
- Implement per-demographic threshold adjustments

### 4. Quality Gate Bypass
**Detection**: Average enrollment quality score dropping while new enrollments increase
**Symptoms**: Poor recognition accuracy for recently enrolled users
**Diagnosis**: Operators bypassing quality checks to meet enrollment quotas
**Fix**:
- Implement hard technical blocks on low-quality enrollments
- Separate enrollment approval from quality assessment
- Add post-enrollment validation testing

### 5. Privacy Compliance Drift
**Detection**: Embedding storage growing faster than enrollment count, or missing consent records
**Symptoms**: Legal compliance audit failures, data retention violations
**Diagnosis**: Raw images stored without consent, or embeddings not properly deleted
**Fix**:
- Automated compliance scanning: consent tracking, embedding lifecycle
- Purge process for embeddings without valid consent
- Convert raw image storage to embedding-only with consent re-confirmation

## Worked Examples

### Example 1: Masked Face at 0.3m Distance

**Scenario**: COVID-era access control, masks required, camera mounted at door (0.3m typical distance)

**Decision Process**:
1. **Model Selection**: buffalo_l chosen (balance accuracy vs speed for real-time)
2. **Threshold Analysis**: Security use case → target FAR <0.1%, initial threshold 0.55
3. **Masked Face Testing**: 
   - Standard threshold: 40% FRR (too many false rejects)
   - Masked-specific threshold: 0.45 → 15% FRR, 0.2% FAR (acceptable)
4. **Implementation**: Mask detection → route to specialized threshold

**Novice would miss**: Using same threshold for masked/unmasked faces, not testing on representative masked dataset
**Expert catches**: Separate calibration needed, eye region weighting more important, enrollment should include masked photos

**Final Configuration**:
```python
def adaptive_verify(embedding1, embedding2, mask_detected=False):
    threshold = 0.45 if mask_detected else 0.55
    similarity = np.dot(embedding1, embedding2)
    return similarity > threshold
```

### Example 2: Enrollment with 1 Poor-Quality Photo

**Scenario**: Employee self-enrollment via mobile app, submits 3 photos: 1 excellent frontal, 1 slight profile, 1 blurry/dark

**Decision Process**:
1. **Quality Assessment**:
   - Photo 1: 0.95 confidence, 150px face, frontal pose → PRIMARY
   - Photo 2: 0.85 confidence, 120px face, 20° yaw → SUPPLEMENTARY  
   - Photo 3: 0.65 confidence, 90px face, poor lighting → REJECT
2. **Enrollment Decision**: Only 1 primary + 1 supplementary = insufficient for robust enrollment
3. **User Feedback**: "Please submit 1 more clear, well-lit frontal photo"
4. **Fallback**: Store partial enrollment as "pending", allow manual review override for urgent cases

**Trade-off Decision**: Reject enrollment (high quality standard) vs Accept with warning (user convenience)
**Chosen**: Reject with guidance - better user experience long-term than poor recognition accuracy

**Recovery Process**:
- Clear photo guidelines with examples
- Real-time quality feedback during capture
- Manual review queue for edge cases
- Temporary PIN-based access while enrollment pending

## Quality Gates

- [ ] Face detection confidence >0.7 AND face size >80px for all enrolled photos
- [ ] Minimum 3 photos per identity with pose variation <30° for primary references  
- [ ] Similarity threshold validated on representative test set with documented FAR/FRR
- [ ] Demographic bias tested: <5% accuracy difference across age/gender/ethnicity groups
- [ ] Enrollment rejection rate <20% (too high indicates unrealistic quality standards)
- [ ] Average enrollment-to-first-successful-recognition time <24 hours
- [ ] Privacy audit: all stored embeddings have valid consent records
- [ ] Deletion capability tested: embedding removal within 24 hours of request
- [ ] Performance benchmark: <100ms average recognition latency at production scale
- [ ] Failure graceful degradation: uncertain matches flagged, not auto-decided

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- General object detection or image classification → Use `computer-vision-pipeline`
- Facial emotion, expression, or attribute analysis → Use `ai-engineer` 
- Face generation, deepfakes, or synthetic face creation → Use specialized generative AI skills
- Real-time video streaming face recognition → Use `video-frame-extraction-analysis` first
- Large-scale batch processing (>10K faces) → Use `data-pipeline-engineer` for orchestration

**Delegate when you encounter**:
- Performance optimization beyond model selection → `system-performance-optimizer`
- Complex database design for vector storage → `database-architect`
- Legal/compliance requirements analysis → Domain expert consultation
- Custom model training or fine-tuning → `machine-learning-engineer`