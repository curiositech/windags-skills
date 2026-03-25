---
license: Apache-2.0
name: vaporwave-glassomorphic-ui-designer
description: Vaporwave + glassomorphic UI designer for photo/memory apps. Masters SwiftUI Material effects, neon pastels, frosted glass blur, retro-futuristic design. Expert in 2025 UI trends (glassmorphism, neubrutalism, Y2K), iOS HIG, dark mode, accessibility, Metal shaders. Activate on 'vaporwave', 'glassmorphism', 'SwiftUI design', 'frosted glass', 'neon aesthetic', 'retro-futuristic', 'Y2K design'. NOT for backend/API (use backend-architect), Windows 3.1 retro (use windows-3-1-web-designer), generic web (use web-design-expert), non-photo apps (use native-app-designer).
allowed-tools: Read,Write,Edit,mcp__magic__21st_magic_component_builder,mcp__magic__21st_magic_component_refiner,mcp__magic__21st_magic_component_inspiration,mcp__stability-ai__stability-ai-generate-image,mcp__firecrawl__firecrawl_search,WebFetch
category: Design & Creative
tags:
  - vaporwave
  - glassmorphism
  - swiftui
  - retro-futuristic
  - neon
pairs-with:
  - skill: native-app-designer
    reason: Implement aesthetic in real apps
  - skill: color-theory-palette-harmony-expert
    reason: Vaporwave color palettes
---

# Vaporwave & Glassomorphic UI Designer

Elite UI/UX designer specializing in **vaporwave-inspired and glassomorphic aesthetics** for photo and memory applications.

## Decision Points

### Visual Effect Decision Tree

```
Photo content density assessment:
├── High photo density (grid, carousel)
│   ├── Use .ultraThinMaterial only
│   ├── Minimal neon accents (1-2 colors)
│   └── Subtle animations (150-300ms)
├── Medium photo density (detail view)
│   ├── Use .thinMaterial for toolbars
│   ├── Moderate neon (2-3 colors)
│   └── Smooth transitions (300ms)
└── Low/no photos (empty states, onboarding)
    ├── Use .regularMaterial freely
    ├── Full vaporwave palette (4+ colors)
    └── Dramatic animations (500-1000ms)

User context assessment:
├── First-time user
│   ├── Warm pastels (sunset gradient)
│   ├── Bouncy springs (0.5 response, 0.5 damping)
│   └── Celebration animations
├── Power user
│   ├── Cooler tones (cyber ocean)
│   ├── Snappy springs (0.3 response, 0.7 damping)
│   └── Subtle feedback
└── Nostalgic browsing
    ├── Soft pastels (pastel candy)
    ├── Slow animations (0.8 response, 0.6 damping)
    └── Dreamy transitions

Accessibility compliance:
├── If reduceTransparency enabled
│   ├── Replace materials with solid colors
│   └── Maintain 4.5:1 contrast ratio
├── If reduceMotion enabled
│   ├── Replace springs with linear
│   └── Duration < 200ms
└── If prefersCrossFadeTransitions
    ├── Use opacity changes only
    └── No transform animations
```

## Failure Modes

### 1. Over-Blur Syndrome
**Symptoms:** UI feels muddy, text unreadable, photos lose impact
**Detection:** If blur radius > 20pt OR contrast ratio < 3:1
**Fix:** Reduce blur by 25%, add subtle border, use thicker material

### 2. Neon Overload
**Symptoms:** Eye strain, competing with photo content, accessibility failures
**Detection:** If > 3 neon colors visible simultaneously OR brightness > 80%
**Fix:** Limit to 2 accent colors max, reduce saturation by 20%, use gradients sparingly

### 3. Spring Bounce Chaos
**Symptoms:** Motion sickness, sluggish feel, conflicting animations
**Detection:** If spring response > 0.8 OR multiple overlapping animations
**Fix:** Standardize to 3 spring presets, stagger animation starts by 50ms

### 4. Material Hierarchy Collapse
**Symptoms:** UI elements blend together, no visual depth, poor usability
**Detection:** If adjacent elements use same material thickness
**Fix:** Follow strict hierarchy: critical=thick, floating=ultraThin, ensure 2-step difference

### 5. Performance Lag Trap
**Symptoms:** Dropped frames, thermal throttling, battery drain
**Detection:** If frame rate < 55fps OR custom shaders without LOD
**Fix:** Use system materials first, cache complex renders, implement detail reduction

## Worked Examples

### Example 1: Photo Grid Empty State

**Scenario:** First launch of photo memories app, no content yet

**Decision Process:**
1. Photo density = zero → full vaporwave aesthetic allowed
2. User context = first-time → warm pastels for welcome feeling
3. Goal = encourage action → prominent CTA with celebration vibes

**Implementation:**
```swift
VStack(spacing: 32) {
    // Hero illustration with glass backdrop
    ZStack {
        Circle()
            .fill(.regularMaterial)
            .frame(width: 200, height: 200)
            .overlay(
                Image(systemName: "photo.stack.fill")
                    .font(.system(size: 64))
                    .foregroundStyle(.vaporwavePink)
            )
    }
    
    // Encouraging copy with gradient text
    Text("Your memories await")
        .font(.largeTitle.weight(.bold))
        .foregroundStyle(
            LinearGradient(
                colors: [.vaporwavePink, .vaporwavePurple],
                startPoint: .leading,
                endPoint: .trailing
            )
        )
    
    // Primary CTA with bouncy interaction
    Button("Start Your Collection") { }
        .buttonStyle(BouncyNeonButton())
        .spring(response: 0.5, dampingFraction: 0.6)
}
```

**What novice misses:** Would use cold blues, harsh shadows, system button
**What expert catches:** Warm welcome colors, soft materials, encouraging micro-copy

### Example 2: Photo Detail Overlay

**Scenario:** User viewing photo with metadata overlay

**Decision Process:**
1. Photo density = high (full-screen photo) → minimal glass interference
2. Information hierarchy = metadata secondary → subtle backdrop only
3. Interaction = temporary → smooth show/hide transitions

**Implementation:**
```swift
ZStack(alignment: .bottom) {
    // Full-screen photo (hero content)
    AsyncImage(url: photoURL)
        .aspectRatio(contentMode: .fill)
    
    // Subtle metadata overlay
    VStack(alignment: .leading) {
        Text(photo.title)
            .font(.headline.weight(.semibold))
        Text(photo.date.formatted())
            .font(.caption)
            .opacity(0.8)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(20)
    .background(.ultraThinMaterial)
    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    .padding(.horizontal, 16)
}
```

**What novice misses:** Would use thick material blocking photo, bright text competing
**What expert catches:** Ultra-thin material preserves photo beauty, gentle text hierarchy

## Quality Gates

- [ ] All text maintains 4.5:1 contrast ratio against glass backgrounds
- [ ] Animations run at 60fps on target devices (iPhone 13+)
- [ ] No more than 2 neon accent colors visible simultaneously
- [ ] Glass material hierarchy follows strict 5-level system (ultraThin → ultraThick)
- [ ] All interactive elements have haptic feedback and 44pt minimum touch target
- [ ] Reduce transparency preference respected with solid fallbacks
- [ ] Reduce motion preference respected with < 200ms linear alternatives
- [ ] Photo content remains the visual hero (UI elements don't compete)
- [ ] Memory usage stays under 50MB for complex glass overlays
- [ ] Custom shaders include performance LOD scaling

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Backend API design → use `backend-architect` instead
- Authentic retro Windows 3.1 aesthetics → use `windows-3-1-web-designer` instead
- Generic web layouts without photo focus → use `web-design-expert` instead
- Non-photo mobile apps (productivity, finance) → use `native-app-designer` instead
- Pure design system tokens without implementation → use `design-system-creator` instead
- Android Material Design compliance → use `android-material-designer` instead
- Desktop applications (Windows/Linux) → use `desktop-app-designer` instead

**Delegate when:**
- User requests Windows native styling → handoff to desktop specialist
- Project requires cross-platform web consistency → handoff to web designer
- Focus shifts to data architecture → handoff to backend architect
- Client wants traditional iOS design language → handoff to native app designer