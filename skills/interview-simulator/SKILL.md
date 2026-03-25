---
name: interview-simulator
license: Apache-2.0
description: Designs and orchestrates a realistic interview simulation platform with voice AI, whiteboard evaluation, gaze-tracking proctoring, and mobile spaced repetition. Use for building mock interview infrastructure, configuring sessions, and adaptive difficulty. Activate on "interview simulator", "mock interview", "practice session", "voice mock". NOT for individual round-type coaching, resume writing, or prep timeline coordination.
allowed-tools: Read,Write,Edit,Bash,WebSearch,WebFetch
metadata:
  gated: true
  category: Career & Interview
  pairs-with:
    - skill: interview-loop-strategist
      reason: Upstream orchestrator -- strategist decides WHAT to practice, simulator executes HOW
    - skill: senior-coding-interview
      reason: Provides coding round content, problem archetypes, and scoring rubrics
    - skill: ml-system-design-interview
      reason: Provides ML design problems, whiteboard evaluation criteria, 7-stage framework
    - skill: anthropic-technical-deep-dive
      reason: Provides Anthropic-specific technical topics and opinion evaluation
    - skill: tech-presentation-interview
      reason: Provides presentation structure, Q&A stress testing, and audience calibration
    - skill: values-behavioral-interview
      reason: Provides behavioral story bank, follow-up ladder depth, STAR-L format
    - skill: hiring-manager-deep-dive
      reason: Provides HM round structure, scope-of-impact evaluation, leadership signals
  tags:
    - interview
    - simulator
    - voice
    - whiteboard
    - practice
category: Career & Interview
tags:
  - interview-prep
  - simulation
  - practice
  - mock-interviews
  - feedback
---

# Interview Simulator

Platform architecture and coaching system for realistic mock interview practice with adaptive difficulty, emotion-sensitive voice AI, and comprehensive performance tracking.

## Decision Points

### Difficulty Adjustment During Session

```
IF emotion_data.hesitation_rate > 70% FOR 2+ consecutive responses
├── AND current_difficulty >= 3
│   └── REDUCE difficulty by 1 level
│       └── Voice persona: "Let's back up to fundamentals"
│
├── ELSE current_difficulty < 5
│   └── MAINTAIN difficulty
│       └── Voice persona: "Take your time, think through this"
│
└── ELSE (hesitation at difficulty 1-2)
    └── PAUSE session for confidence building
        └── Offer: "Would you like a 2-minute break?"
```

```
IF technical_accuracy > 85% AND response_time < 60% of target
├── AND current_difficulty < 5
│   └── INCREASE difficulty by 1 level
│       └── Add follow-up: "Now optimize for X constraint"
│
└── AND current_difficulty = 5
    └── MAINTAIN but add adversarial prompts
        └── "What if the requirements changed to..."
```

### Round Type Selection

```
IF any dimension_score < 60 FOR last 3 sessions
├── SELECT lowest_scoring_round_type
│   └── Override user preference if different
│
ELIF no round_type practiced in last 7 days
├── SELECT oldest_unpracticed_round
│   └── Variety bonus for skills retention
│
ELSE
├── SELECT weakness_weighted_random()
│   └── 70% bias toward bottom 2 scores, 30% random
```

### Proctor Flag Response

```
IF gaze_off_screen > 5 seconds
├── IMMEDIATE: Voice AI pauses, asks "Everything okay?"
│   └── IF happens again within 10 minutes
│       └── FLAG session as "distracted practice"
│       └── Debrief includes focus recommendations
│
IF second_monitor_detection = true
├── IMMEDIATE: Session pause, warning overlay
│   └── "Real interview won't have external resources"
│   └── Options: [Continue with flag] [Reset clean]
│
IF note_taking_detected (hand tracking)
├── ALLOW in Training mode with flag
├── BLOCK in Simulation mode
    └── "Please close notes for realistic practice"
```

## Failure Modes

### 1. Overtraining Comfort Zone (Behavioral Looping)
**Symptoms:** >50% of sessions are same round type, plateau in target skill, false confidence in demo sessions
**Detection Rule:** IF session_history.last_10_sessions contains >7 of same round_type THEN flag "comfort_zone_looping"
**Fix:** Lock out preferred round type for 72 hours, force weakness-weighted selection, show heatmap of practice distribution

### 2. Emotion Detection False Positives (Technical Hesitation)
**Symptoms:** Difficulty drops during complex technical problems where thinking time is normal, candidate reports sessions feel too easy
**Detection Rule:** IF difficulty_reduction triggered AND problem_complexity = high AND response_quality > 75% THEN flag "false_positive_hesitation"
**Fix:** Calibrate hesitation baseline per round type, extend thinking time allowance for design problems from 30s to 90s, separate "thinking" from "struggling" in emotion model

### 3. Network Latency Ghost Sessions
**Symptoms:** Voice AI cuts out mid-question, session scoring incomplete, debrief missing transcript sections, user reports poor experience
**Detection Rule:** IF voice_stream_interruptions > 3 OR transcript_coverage < 80% THEN flag "network_degraded_session"
**Fix:** Implement local recording fallback, retry logic for API calls, session quality gate before scoring (reject if <80% data integrity), offline mode with sync-later

### 4. Proctor Calibration Drift
**Symptoms:** False flags for normal behavior, user disables proctoring due to oversensitivity, gaze tracking works poorly for specific users (glasses, lighting)
**Detection Rule:** IF proctor_flag_rate > 0.3 per session AND user_session_count > 5 THEN flag "proctor_oversensitive"
**Fix:** Per-user calibration phase (30-second normal gaze pattern recording), lighting condition adaptation, glasses detection with adjusted thresholds

### 5. Debrief Analysis Inflation
**Symptoms:** All session scores >80%, improvement suggestions too generic, user reports disconnect between debrief and actual performance
**Detection Rule:** IF average_session_score > 80 AND session_count > 10 AND difficulty_level unchanged THEN flag "score_inflation"
**Fix:** Recalibrate scoring rubric with harder baseline, cross-validate with round-specific skill scoring, add "compared to senior candidates" percentile context

## Worked Examples

### Example 1: ML Design Session with Difficulty Adjustment

**Setup:** User has 3 previous ML design sessions, scores: [65, 72, 68]. Starting difficulty: 3/5.

**Session Flow:**
```
00:00 Voice AI: "Let's design a recommendation system for a video platform. Start with the problem setup."
00:45 User: "Um... so we need to recommend videos... I guess we'd use collaborative filtering?"
      Emotion data: hesitation_rate=85%, confidence=30%
01:15 Orchestrator detects: high hesitation + low confidence = reduce difficulty
      Difficulty: 3 → 2, Voice persona shift to "supportive"
01:20 Voice AI: "Great start! Let's break this down step by step. What data do we have about users?"
02:30 User: [More confident response about user features]
      Emotion data: hesitation_rate=40%, confidence=70%
      Orchestrator: maintain difficulty=2, user finding footing
15:00 User demonstrates solid understanding at level 2
      Technical accuracy=80%, response time=good
15:30 Orchestrator: increase difficulty 2 → 3
15:45 Voice AI: "Now, how would you handle the cold start problem for new users?"
30:00 Session ends, user handled level 3 questions well
```

**Debrief Output:**
- Started at difficulty 3, adjusted to 2 due to initial hesitation, finished at 3
- Strength: Good recovery and adaptation to feedback
- Weakness: Initial problem setup needs practice (recommend system design fundamentals)
- Next session: Start at difficulty 3, focus on problem scoping

### Example 2: Network Latency Recovery

**Setup:** User in poor connectivity environment, voice stream unstable.

**Session Flow:**
```
00:00 Session starts normally
02:15 Voice stream cuts out mid-question
02:20 Orchestrator detects stream_interruption, activates fallback
02:25 Text overlay: "Voice connection unstable. Switching to text mode."
      Question continues in text, user types responses
15:30 Voice reconnects, quality test passed
15:35 Orchestrator: "Voice is back. Continuing with audio."
30:00 Session completes
```

**Quality Gate Check:**
- Transcript coverage: 75% (below 80% threshold)
- Flag: "network_degraded_session"
- Action: Offer session retry at no cost, debrief marked as "practice only"

### Example 3: Proctor False Positive Correction

**Setup:** User wears glasses, has second monitor for work (turned off during session).

**Session Flow:**
```
05:00 MediaPipe detects gaze deviation (actually lens reflection)
05:01 Proctor flags "off-screen gaze"
05:02 User continues normally
08:00 Another false flag (glasses adjustment)
08:01 System detects: flag_rate=2 in 8 minutes = high
08:05 Auto-calibration triggered: "We're detecting gaze issues. 
      Let's recalibrate for your setup. Look at the center of 
      your screen for 10 seconds."
08:15 New baseline established for this user
      Subsequent flags drop to normal levels
```

## Quality Gates

Session completion requires all checks to pass:

- [ ] Voice stream integrity >80% (no major dropouts)
- [ ] Transcript coverage >80% (enough content for evaluation)  
- [ ] Session duration within 10% of target (not cut short)
- [ ] At least 3 meaningful question-response exchanges
- [ ] Emotion data captured for >70% of user responses
- [ ] Whiteboard snapshots captured every 30s during active drawing (design rounds)
- [ ] Proctor calibration successful if first-time user
- [ ] No critical API failures (can fallback gracefully)
- [ ] User completed session normally (didn't force-quit)
- [ ] Debrief generation successful with specific feedback

## Not-For Boundaries

**This skill should NOT be used for:**
- **Individual round coaching:** For practicing specific round types, use the round-specific skills (senior-coding-interview, ml-system-design-interview, etc.)
- **Interview strategy/timeline:** For prep planning and round sequencing, use interview-loop-strategist instead
- **Resume/portfolio work:** For CV optimization, use cv-creator instead
- **Salary negotiation:** Different skill set, not interview simulation
- **Conference presentations:** Different audience and evaluation criteria than interviews
- **Academic exam proctoring:** This is for self-practice, not adversarial examination
- **Production hiring platform:** This is for candidate practice, not company interview infrastructure

**Delegate to other skills when:**
- User asks about specific technical topics → Use the relevant round-specific skill
- User wants to plan their overall prep strategy → Use interview-loop-strategist
- User needs help with career positioning → Use career-biographer or cv-creator