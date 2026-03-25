---
license: Apache-2.0
name: win31-audio-design
description: Expert in Windows 3.1 era sound vocabulary for modern web/mobile apps. Creates satisfying retro UI sounds using CC-licensed 8-bit audio, Web Audio API, and haptic coordination. Activate on 'win31 sounds', 'retro audio', '90s sound effects', 'chimes', 'tada', 'ding', 'satisfying UI sounds'. NOT for modern flat UI sounds, voice synthesis, or music composition.
allowed-tools: Read,Write,Edit,Bash(ffmpeg:*,node:*,npm:*),mcp__ElevenLabs__text_to_sound_effects,WebFetch
category: Video & Audio
tags:
  - windows-31
  - retro-audio
  - sound-design
  - chiptune
  - 8-bit
pairs-with:
  - skill: windows-3-1-web-designer
    reason: Visual + audio Win31 experience
  - skill: sound-engineer
    reason: Advanced audio processing
  - skill: mobile-ux-optimizer
    reason: Mobile haptic-audio coordination
---

# Win31 Audio Design: Satisfying Retro Sound Vocabulary

Expert in creating authentic Windows 3.1 era sound experiences for modern web and mobile applications using CC-licensed alternatives that capture the satisfying, lo-fi essence of early 90s computing.

## Decision Points

### Sound Selection Tree
```
Input Type:
├── UI Feedback
│   ├── High frequency (>20/sec) → Single click (20ms, 800Hz)
│   ├── Medium frequency (5-20/sec) → Toggle chirp (100ms, sweep)
│   └── Low frequency (<5/sec) → Chime variation (400ms, harmonic)
│
├── System Events
│   ├── Success → TADA-style fanfare (1-2s, ascending chord)
│   ├── Error → DING-style alert (300ms, 880Hz + decay)
│   └── Navigation → RINGIN/OUT-style sweep (150ms, pitch slide)
│
└── Device Constraints
    ├── Mobile → Add haptic pairing + respect silent mode
    ├── Low bandwidth → Use procedural synthesis over samples
    └── Desktop → Full sample library + optional reverb
```

### Frequency/Sample Rate Selection
```
Sound Type → Sample Rate → Frequency Range:
├── Button clicks → 11kHz → 600-1200Hz
├── System alerts → 22kHz → 400-2000Hz
├── Musical elements → 22kHz → 200-4000Hz
└── Error/warning → 11kHz → 200-800Hz

Device Memory:
├── <100MB available → Procedural only
├── 100-500MB → Core samples + procedural fallbacks
└── >500MB → Full sample library
```

## Failure Modes

| Anti-Pattern | Detection Rule | Symptom | Fix |
|--------------|----------------|---------|-----|
| **Modern Clarity** | Sounds crisp at 48kHz+ | Too clean, loses retro charm | Downsample to 22kHz max, apply 8-bit quantization |
| **Cathedral Reverb** | Reverb tail >200ms | Sounds spacious, not desktop-like | Remove reverb or limit to <100ms room |
| **Frequency Bloat** | Energy below 200Hz or above 8kHz | Muddy bass or harsh highs | High-pass at 200Hz, low-pass at 6kHz |
| **Copyright Trap** | Using actual .WAV filenames | Legal risk, identical to Windows | Replace with CC-licensed alternatives only |
| **Sound Spam** | >3 sounds per second | User fatigue, cacophony | Limit to primary actions, add global toggle |

## Worked Examples

### Mobile Haptic-Audio Sync Example

**Scenario**: Creating a satisfying toggle switch with coordinated vibration and Win31-style sound

```typescript
// 1. Analyze requirements
const toggleRequirements = {
  duration: "100-150ms", // Fast enough to feel instant
  frequency: "sweep 600→1200Hz for ON, reverse for OFF",
  haptic: "light impact at sound start",
  timing: "audio and haptic must fire within 5ms"
};

// 2. Decision point: Procedural vs sample?
if (memoryConstraint < 50MB) {
  // Choose procedural synthesis
  function createToggleSound(isOn: boolean) {
    const ctx = audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Win31 characteristic: triangle wave (softer than sine)
    osc.type = 'triangle';
    
    // Frequency sweep decision
    const startFreq = isOn ? 600 : 1200;
    const endFreq = isOn ? 1200 : 600;
    
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);
    
    // Envelope: fast attack, medium decay
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    
    return { oscillator: osc, gainNode: gain };
  }
}

// 3. Timing coordination (critical for satisfaction)
async function playToggleWithHaptic(isOn: boolean) {
  const startTime = performance.now();
  
  // Fire simultaneously
  const [soundPromise, hapticPromise] = await Promise.allSettled([
    playToggleSound(isOn),
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  ]);
  
  const endTime = performance.now();
  
  // Quality check: timing must be tight
  if (endTime - startTime > 10) {
    console.warn('Haptic-audio sync exceeded 10ms threshold');
  }
}

// 4. What expert catches vs novice misses:
// Expert: Checks for silent mode before playing
// Expert: Uses exponential ramps (more natural than linear)
// Expert: Applies 8-bit quantization for authentic character
// Novice: Forgets to coordinate timing
// Novice: Uses default Web Audio sample rate (48kHz - too clean)
```

## Quality Gates

- [ ] All sounds limited to 22kHz sample rate or lower
- [ ] Frequency content stays within 200Hz-6kHz range
- [ ] No sound plays without user interaction (browser policy compliance)
- [ ] Global audio toggle implemented and functional
- [ ] Mobile builds include haptic coordination within 5ms timing
- [ ] All audio samples properly attributed with CC license info
- [ ] Sound levels stay between -24dB (UI) and -6dB (system events)
- [ ] Procedural fallbacks work when samples fail to load
- [ ] Silent mode respected on all mobile platforms
- [ ] Maximum sound duration under 2.5 seconds (prevents audio fatigue)

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Modern flat/material sound design → Use **sound-engineer** instead
- Voice synthesis or speech → Use **voice-audio-engineer** instead  
- Music composition or background tracks → Use DAW tools instead
- Film/video sound design → Use linear audio workflows instead
- Real-time audio effects (reverb, delay) → Use **audio-effects-specialist** instead
- Accessibility audio cues → Use **accessibility-expert** instead

**Delegate when:**
- Client wants spatial audio → **sound-engineer**
- Need advanced DSP → **audio-effects-specialist**
- Designing for hearing impaired → **accessibility-expert**
- Building music applications → **audio-programmer**

---

**Core Formula**: Win31 sounds = Simple + Bright + Lo-fi + Fast decay. Always pair audio with haptics on mobile. Never copy Microsoft sounds - create inspired CC-licensed alternatives.