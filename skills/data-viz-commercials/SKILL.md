---
license: Apache-2.0
name: data-viz-commercials
description: 'Expert in turning data visualizations into compelling video and animation content for social media and marketing. Activate on: data commercial, animated chart, data storytelling video, chart animation, Remotion data video, Motion Canvas, Flourish animation, D3 animation, data viz social media, dashboard recording, data narrative video. NOT for: static data visualization (use data-viz-2025), general video editing (use video-processing-editing), full video production pipeline (use ai-video-production-master).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,ffmpeg:*,obs:*,remotion:*),Glob,Grep,WebSearch,WebFetch
metadata:
  category: Content & Creative
  tags:
    - data-visualization
    - video-production
    - animation
    - social-media
    - storytelling
    - remotion
    - motion-canvas
  pairs-with:
    - skill: data-viz-2025
      reason: Static chart design that feeds into animated versions
    - skill: video-processing-editing
      reason: Post-production editing, encoding, format conversion
    - skill: ai-video-production-master
      reason: Full production pipeline including narration and music
category: Data & Analytics
tags:
  - data-visualization
  - commercial
  - dashboards
  - storytelling
  - presentation
---

# Data Viz Commercials

Expert in turning data stories into compelling video and animation content — the intersection of data visualization, motion design, and narrative storytelling that makes data shareable on social media.

## Decision Points

### 1. Tool Selection by Requirements

```
IF need 100+ personalized videos from dataset
  → Use Remotion (React-based, data-driven)
ELSE IF need explainer with voice-over sync
  → Use Motion Canvas (TypeScript generators)
ELSE IF need bar chart race for social media quickly
  → Use Flourish (no-code, built-in templates)
ELSE IF recording existing dashboard
  → Use OBS Studio + screen capture
ELSE IF custom web interactive
  → Use D3 + GSAP
```

### 2. Narrative Structure Selection

```
IF audience = social media (Twitter/LinkedIn)
  → Hook (0-3s) → Insight (3-15s) → Proof (15-25s) → CTA (25-30s)
ELSE IF audience = presentation/explainer
  → Context (0-10s) → Problem (10-20s) → Data reveal (20-45s) → Solution (45-60s)
ELSE IF audience = educational
  → Question (0-5s) → Setup (5-15s) → Step-by-step reveal (15-50s) → Summary (50-60s)
```

### 3. Animation Timing Strategy

```
IF showing magnitude/comparison
  → Grow bars from zero (1-2s per group)
ELSE IF showing trend over time
  → Line drawing left-to-right (2-3s total path)
ELSE IF showing transformation
  → Morph transition (1-1.5s between states)
ELSE IF showing multiple categories
  → Cascade reveal (0.2s stagger between items)
```

### 4. Platform Optimization

```
IF target = Instagram/TikTok/YouTube Shorts
  → 9:16 aspect, <60s duration, mobile-first text sizing
ELSE IF target = Twitter/LinkedIn
  → 16:9 or 1:1 aspect, 30-90s duration, high contrast colors
ELSE IF target = presentations
  → 16:9 aspect, 60-300s duration, detailed annotations
```

## Failure Modes

| Anti-Pattern | Detection Rule | Diagnosis | Fix |
|--------------|----------------|-----------|-----|
| **Over-Animation Chaos** | If every element bounces/spins/zooms simultaneously | Too much motion competing for attention | Remove decorative animations; animate only to reveal data insights |
| **Unclear Data Arc** | If viewer asks "what am I supposed to see?" after 15 seconds | No narrative thread connecting charts | Apply Hook→Context→Insight→Proof→CTA structure; one insight per video |
| **Long Render Blocks** | If Remotion render takes >10min for 60s video | Inefficient frame calculations or complex animations | Profile with `npx remotion studio`; simplify interpolations; cache expensive computations |
| **Mobile Text Illegibility** | If text <24pt or thin fonts used | Optimized for desktop, fails on phone | Test on actual phone at 480p; use bold fonts; minimum 24pt size |
| **Audio-Visual Desync** | If narration doesn't match chart reveals | Timeline not planned with audio script | Storyboard frame-by-frame; use `waitFor()` in Motion Canvas; sync points every 5-10s |

## Worked Examples

### Example 1: When Remotion Beats Flourish

**Scenario**: Client needs 500 personalized "Year in Review" videos for enterprise customers, each showing their specific usage data.

**Decision Process**:
- Flourish: Would require manual upload of 500 datasets, individual exports
- Remotion: One template, batch render with JSON data per customer

**Remotion Implementation**:
```typescript
export const CustomerReview: React.FC<{data: CustomerData}> = ({data}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0f172a'}}>
      <Sequence from={0} durationInFrames={90}>
        <Txt fill="white" fontSize={60}>
          {data.companyName}'s 2025 Growth
        </Txt>
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <AnimatedCounter 
          from={0} 
          to={data.totalUsers} 
          suffix=" users added"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Batch Render**:
```bash
npx remotion render src/index.ts CustomerReview \
  --props-from-file=customers.json \
  --concurrency=4 \
  out/
```

**Result**: 500 videos rendered overnight vs. weeks of manual work. Engagement increased 340% vs. static PDFs.

### Example 2: When to Stop Animating and Use Static

**Scenario**: Complex financial dashboard with 12 charts showing quarterly performance.

**Novice Approach**: Animate all 12 charts in sequence (3+ minute video)
**Expert Decision**: Too much cognitive load; attention will drop after 30 seconds

**Solution**: 
1. Pick the ONE key insight (revenue growth acceleration in Q3)
2. Show only 3 supporting charts: trend line, comparison bars, breakdown pie
3. Make static dashboard available as follow-up resource

**Animation Strategy**:
- Chart 1: Revenue line drawing over time (reveal the acceleration)
- Chart 2: Q3 vs Q2 comparison bars (grow from zero to show magnitude)  
- Chart 3: Revenue source breakdown (cascade reveal by segment)

**Result**: 45-second focused video + static comprehensive report drove 85% more click-throughs than 3-minute version.

## Quality Gates

```
[ ] Audio-text sync verified (narration matches chart reveals within 0.5s)
[ ] Color contrast meets WCAG AA (4.5:1 ratio minimum for text)
[ ] Call-to-action text is legible at 480p on mobile device
[ ] Each scene duration is <3 seconds (maintains social media attention)
[ ] Data trends are visible when viewed at phone screen size
[ ] Animation serves comprehension (every motion reveals data insight)
[ ] Single clear narrative thread connects all charts
[ ] Data source, units, and timeframe are labeled
[ ] Background music does not overpower narration (≤-12dB relative)
[ ] Video file under 100MB for social media upload limits
[ ] Thumbnail frame compelling without playing video
[ ] Exported in platform-native aspect ratio (no black bars)
```

## NOT-FOR Boundaries

**This skill should NOT be used for:**
- Static data visualization → Use `data-viz-2025` instead
- General video editing and post-production → Use `video-processing-editing` instead  
- Full video production with AI narration/music → Use `ai-video-production-master` instead
- Interactive web-based data stories → Use `data-viz-2025` with D3 interactivity
- Live presentation software → Use presentation tools with this skill's storyboarding principles
- Long-form documentary content → Use `ai-video-production-master` for multi-chapter structure

**Delegate when:**
- Request involves >5 minutes of content (documentary territory)
- Need advanced video effects beyond data animation (motion graphics, 3D)
- Audio production is the primary focus (podcast-style content)
- Interactive exploration is more important than linear narrative