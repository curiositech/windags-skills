---
license: Apache-2.0
name: audio-transcription-pipeline
description: 'Build audio transcription pipelines with Whisper, Deepgram, and AssemblyAI including speaker diarization and real-time streaming. Activate on: transcription, speech-to-text, diarization, audio processing, meeting transcripts. NOT for: text-to-speech synthesis (voice-audio-engineer), music generation (ai-engineer).'
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: Video & Audio
tags:
  - transcription
  - speech-to-text
  - whisper
  - diarization
  - audio
pairs-with:
  - skill: voice-audio-engineer
    reason: Audio engineer handles TTS and audio processing; this skill handles STT
  - skill: video-frame-extraction-analysis
    reason: Transcription syncs with video frames for multimedia indexing
  - skill: data-pipeline-engineer
    reason: Large-scale batch transcription needs pipeline orchestration
---

# Audio Transcription Pipeline

Build production speech-to-text pipelines with Whisper, Deepgram, and AssemblyAI for batch and real-time transcription with speaker diarization.

## Decision Points

### Engine Selection Decision Tree
```
If requirements include:
├─ Real-time streaming required?
│  ├─ Yes: Use Deepgram Nova-3 WebSocket (fastest)
│  └─ No: Continue to accuracy requirements
├─ Highest accuracy needed + have GPU?
│  ├─ Yes: Use Whisper large-v3 with faster-whisper
│  └─ No: Continue to cost analysis
├─ Budget < $0.0059/min AND have compute?
│  ├─ Yes: Use local Whisper
│  └─ No: Use AssemblyAI Universal-2 (best API diarization)
```

### Batch vs Stream Processing
```
If audio characteristics:
├─ Duration > 30 minutes?
│  ├─ Yes: Use batch with chunking (split at silence)
│  └─ No: Continue to latency check
├─ Need results in < 10 seconds?
│  ├─ Yes: Use streaming (Deepgram/Whisper.cpp)
│  └─ No: Use batch for better accuracy
```

### VAD (Voice Activity Detection) Usage
```
If content type:
├─ Live conversation/meeting?
│  ├─ Yes: Enable VAD (saves 40-60% compute on silence)
│  └─ No: Continue to content check
├─ Lecture/presentation with pauses?
│  ├─ Yes: Use conservative VAD (min_silence_duration_ms: 1000)
│  └─ No: Skip VAD for dense speech (audiobooks, etc.)
```

### Model Selection by Domain
```
If language/accent:
├─ Non-English or heavy accent?
│  ├─ Yes: Use Whisper large-v3 (best multilingual)
│  └─ No: Continue to speed check
├─ Need < 1 second latency?
│  ├─ Yes: Use Deepgram Nova-3 streaming
│  └─ No: Use AssemblyAI for business/medical terminology
```

## Failure Modes

### Hallucination on Silence
**Detection**: Transcripts show repeated phrases during quiet sections or phantom music descriptions
**Diagnosis**: VAD disabled or threshold too low, model generating text from background noise
**Fix**: Enable VAD with `min_silence_duration_ms: 500`, use `--no_speech_threshold 0.6` in Whisper

### Diarization Collapse at >10 Speakers
**Detection**: All speakers labeled as "Speaker 1" after 10-15 minutes, or random speaker switching mid-sentence
**Diagnosis**: Speaker embedding model saturated, overlap confusion in crowded audio
**Fix**: Pre-segment by silence, use AssemblyAI dual_channel if stereo, limit to 8 active speakers max

### Timestamp Sync Drift with Video
**Detection**: Subtitles appear 2-5 seconds before/after corresponding video frames
**Diagnosis**: Audio preprocessing changed duration, or VAD removed segments without timestamp adjustment
**Fix**: Use `--preserve_timing` in preprocessing, sync with original audio timecode, validate against known speech events

### Language Auto-Detection Failure
**Detection**: English words transcribed as gibberish when speaker has accent, or code-switching ignored
**Diagnosis**: Model locked to wrong language in first 30 seconds, or multilingual content confused classifier
**Fix**: Force language with `language="en"` for accented English, use `task="translate"` for non-English to English

### Memory Overflow on Long Files
**Detection**: OOM crashes on files >45 minutes, or sudden quality drops after 30 minutes
**Diagnosis**: Model keeping full context window, GPU VRAM exhausted
**Fix**: Chunk at 25-minute boundaries with 30-second overlap, use `--without_timestamps` for RAM efficiency

## Worked Examples

### Complete Meeting Transcription Walkthrough

**Scenario**: 90-minute board meeting, 6 speakers, need accurate speaker identification and timestamps for minutes

**Input Analysis**:
- 90 minutes → requires chunking
- 6 speakers → within diarization limits  
- Business context → use AssemblyAI for terminology

**Decision Path**:
1. Duration > 30 min → batch processing required
2. Speaker count = 6 → diarization feasible  
3. Business domain → AssemblyAI Universal-2 chosen
4. High accuracy needed → enable speaker labels + smart formatting

**Implementation**:
```python
# Step 1: Preprocess (expert catches: normalize audio levels)
ffmpeg -i meeting.mp4 -ar 16000 -ac 1 -filter:a "volume=0.8" meeting_clean.wav

# Step 2: Chunk with overlap (novice would process whole file)
from pydub import AudioSegment
audio = AudioSegment.from_wav("meeting_clean.wav")
chunks = []
for i in range(0, len(audio), 25*60*1000):  # 25min chunks
    chunk = audio[i:i+27*60*1000]  # 27min with 2min overlap
    chunks.append(chunk)

# Step 3: Transcribe with diarization
results = []
for chunk in chunks:
    response = assemblyai_client.transcribe(
        chunk, speaker_labels=True, auto_punctuation=True,
        dual_channel=False, speaker_labels_max=8
    )
    results.append(response.get_paragraphs())

# Step 4: Merge overlapping segments (expert step novice misses)
merged = merge_overlapping_transcripts(results, overlap_seconds=120)
```

**Expert vs Novice**:
- **Novice**: Processes 90-min file directly → OOM crash or poor accuracy
- **Expert**: Chunks with overlap, validates speaker consistency across chunks, normalizes audio first

## Quality Gates

- [ ] WER (Word Error Rate) < 5% on test sample with known ground truth
- [ ] Speaker accuracy > 90% (correct speaker ID for each utterance when ground truth available)  
- [ ] Real-time latency < 2 seconds end-to-end for streaming implementations
- [ ] SRT/VTT files pass validation (proper timestamps, no overlapping segments)
- [ ] Audio preprocessing completed: 16kHz mono WAV/FLAC format confirmed
- [ ] VAD parameters tuned: < 10% false positive silence detection on sample
- [ ] Memory usage < 8GB for files up to 2 hours (chunking working properly)
- [ ] API error handling tested: handles timeouts, retries, and quota exceeded
- [ ] Diarization speaker count matches expected (±1 speaker tolerance)
- [ ] Output timestamps align with original audio within 100ms accuracy

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- Text-to-speech synthesis → Use `voice-audio-engineer` instead
- Music transcription or lyric extraction → Use `ai-engineer` for music AI models  
- Audio classification without transcription → Use `ai-engineer` for audio classification
- Real-time translation (transcribe + translate) → Combine with `language-translator` skill
- Voice biometrics or speaker identification → Use `ai-engineer` for speaker recognition models
- Audio quality enhancement or noise reduction → Use `voice-audio-engineer` for audio processing

**Delegate when**:
- Need custom wake word detection → `voice-audio-engineer` 
- Require audio fingerprinting → `data-pipeline-engineer`
- Building voice assistants → `voice-audio-engineer` + `conversation-designer`
- Processing >10,000 hours → `data-pipeline-engineer` for orchestration