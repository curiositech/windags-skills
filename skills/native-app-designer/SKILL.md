---
license: Apache-2.0
name: native-app-designer
description: Creates breathtaking iOS/Mac and web apps with organic, non-AI aesthetic. Expert in SwiftUI, React animations, physics-based motion, and human-crafted design. Use for iOS/Mac app UI, React/Vue animations, native-feel web apps, physics-based motion design. Activate on "SwiftUI", "iOS app", "native app", "React animation", "motion design", "UIKit", "physics animation". NOT for backend logic, API design (use backend-architect), simple static sites (use web-design-expert), or pure graphic design (use design-system-creator).
allowed-tools: Read,Write,Edit,Bash,mcp__magic__21st_magic_component_builder,mcp__magic__21st_magic_component_refiner,mcp__stability-ai__stability-ai-generate-image,mcp__firecrawl__firecrawl_search
category: Design & Creative
tags:
  - ios
  - swiftui
  - react
  - animations
  - motion
pairs-with:
  - skill: metal-shader-expert
    reason: GPU-accelerated visual effects
  - skill: vaporwave-glassomorphic-ui-designer
    reason: Aesthetic iOS design
---

# Native App Designer

Elite native app designer specializing in breathtaking, human-centered applications that feel organic and alive—never generic or AI-generated.

## Decision Points

### Content Type → Animation Timing Decision Tree

```
User Action Type:
├── Immediate Feedback (button press, tap)
│   ├── Success: 0.1s spring (response: 0.3, damping: 0.7)
│   └── Error: 0.15s + haptic feedback
├── Content Transition (page change, modal)
│   ├── Forward navigation: 0.25s slide-right
│   ├── Back navigation: 0.2s slide-left (faster return)
│   └── Modal present/dismiss: 0.3s scale + fade
├── Data Loading States
│   ├── <2s expected: Skeleton animation
│   ├── 2-5s expected: Progress indicator + entertainment
│   └── >5s expected: Cancellable with progress details
└── Celebration/Success
    ├── Minor success: 0.4s gentle bounce
    ├── Major success: 0.8s confetti + sound
    └── Achievement: 1.2s dramatic scale + particle effects
```

### User Mood → Visual Personality Selection

```
IF user context = "work/productivity"
  → Use Professional personality (crisp, confident, muted colors)
ELSE IF user context = "entertainment/social"
  → Use Playful personality (bouncy springs, warm colors)
ELSE IF user context = "wellness/meditation"
  → Use Natural personality (organic motion, earthy colors)
ELSE IF user context = "finance/serious"
  → Use Minimal personality (subtle motion, limited palette)
ELSE
  → Default to Vibrant personality (energetic, bold colors)
```

### Platform Constraints → Implementation Strategy

```
Target Platform:
├── iOS Native
│   ├── Use SwiftUI for iOS 14+ → spring animations, SF Symbols
│   ├── Use UIKit for iOS 13- → Core Animation, manual spring curves
│   └── Add haptic feedback for all key interactions
├── Web Progressive
│   ├── Use Framer Motion for React → physics-based animations
│   ├── Use GSAP for vanilla JS → 60fps performance
│   └── Implement reduced motion support
└── Cross-platform
    ├── Use Lottie for complex animations → After Effects export
    ├── Focus on transform/opacity → hardware acceleration
    └── Fallback to CSS transitions for low-end devices
```

## Failure Modes

### "Generic Card Syndrome"
**Detection**: If every component is a white/gray card with identical shadows and spacing
**Symptoms**: UI feels monotonous, looks AI-generated, lacks visual hierarchy
**Fix**: Mix component types (cards, lists, overlays, inline elements), vary corner radius (8px-24px), use purposeful asymmetry

### "Linear Animation Death"
**Detection**: If animations use `.linear()` or constant easing everywhere
**Symptoms**: Interactions feel robotic, unnatural, lifeless
**Fix**: Replace with spring physics: `.spring(response: 0.3-0.8, dampingFraction: 0.5-0.8)`, match animation personality to app context

### "Rainbow Vomit Overload"
**Detection**: If using >5 colors with no restraint or hierarchy
**Symptoms**: Overwhelming interface, no focal points, visual chaos
**Fix**: Limit to 3-4 colors max, use 60/30/10 rule (60% neutral, 30% primary, 10% accent), semantic color usage only

### "Animation Overload Syndrome"
**Detection**: If every element animates simultaneously or constantly
**Symptoms**: User can't focus, feels dizzy, performance issues
**Fix**: Animate max 2-3 elements per interaction, stagger timing by 50-100ms, use animation sparingly for feedback only

### "Inconsistent Spacing Chaos"
**Detection**: If margins/padding use random values (7px, 13px, 19px)
**Symptoms**: Interface feels unpolished, chaotic, amateur
**Fix**: Adopt 4pt or 8pt grid system (4, 8, 12, 16, 24, 32px), create spacing tokens, use systematic spacing scale

## Worked Examples

### Example 1: E-commerce Product Card Redesign

**Before**: Generic white card with linear transitions
```swift
// Anti-pattern: Generic, lifeless
VStack {
    AsyncImage(url: product.imageURL)
    Text(product.name)
    Text("$\(product.price)")
}
.background(.white)
.cornerRadius(8)
.shadow(radius: 2)
.animation(.linear(duration: 0.2)) // WRONG
```

**Decision Process**:
1. **Content Type**: Product showcase → needs visual appeal
2. **User Mood**: Shopping → playful/energetic personality  
3. **Platform**: iOS → use SwiftUI springs + haptics

**After**: Organic, delightful interaction
```swift
struct DelightfulProductCard: View {
    @State private var isPressed = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            AsyncImage(url: product.imageURL)
                .frame(height: 200)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .scaleEffect(isPressed ? 0.95 : 1.0)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.system(.title3, design: .rounded, weight: .bold))
                Text("$\(product.price)")
                    .font(.title2)
                    .foregroundStyle(.green)
            }
        }
        .padding(16)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isPressed)
        .onTapGesture {
            // Haptic feedback for premium feel
            let impact = UIImpactFeedbackGenerator(style: .medium)
            impact.impactOccurred()
        }
        .pressEvents {
            onPress: { isPressed = true }
            onRelease: { isPressed = false }
        }
    }
}
```

**Expert insights caught**: 
- Spring physics instead of linear timing
- Asymmetric spacing (12px, 4px) creates rhythm
- Material background feels premium vs flat white
- Haptic feedback adds polish
- Continuous corner radius feels more organic

### Example 2: Loading State Animation Strategy

**Decision Process**:
1. **Expected duration**: API call ~3 seconds → needs entertainment
2. **User context**: Banking app → professional personality
3. **Content type**: Financial data → build trust, not anxiety

**Implementation**:
```jsx
const ProfessionalLoader = ({ duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  
  // Smooth progress curve (not linear)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / (duration / 100)), 100));
    }, 100);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="progress-bar"
        style={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100 }}
      />
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Securing your data...
      </motion.p>
    </motion.div>
  );
};
```

**Trade-off Analysis**:
- Progress bar vs spinner: Progress shows control, builds trust
- Spring vs linear: Spring feels more natural, less robotic
- Copy choice: "Securing" emphasizes safety over speed
- Opacity pulse: Subtle life without being distracting

## Quality Gates

### Pre-Launch Validation Checklist

**Animation Quality**:
- [ ] All animations use spring physics or eased curves (no linear)
- [ ] Animation duration matches content importance (0.1s feedback, 0.3s transitions, 0.8s celebrations)
- [ ] Maximum 3 elements animate simultaneously per interaction
- [ ] Reduced motion is supported for accessibility
- [ ] 60fps performance maintained on target devices

**Visual Hierarchy**:
- [ ] Clear focal point on every screen (one primary action)
- [ ] Color usage follows semantic meaning (red=error, green=success)
- [ ] Typography has clear hierarchy (max 4 font sizes/weights)
- [ ] Spacing follows consistent grid system (4pt or 8pt)
- [ ] Interactive elements are minimum 44px touch targets

**Platform Integration**:
- [ ] iOS: Uses SF Symbols, system materials, supports Dynamic Type
- [ ] Web: Implements proper focus states, works with screen readers
- [ ] Cross-platform: Consistent brand feel across platforms
- [ ] Haptic feedback implemented for key iOS interactions
- [ ] Dark mode support with semantic colors

**Brand Consistency**:
- [ ] Personality choice is consistent across all interactions
- [ ] Color palette limited to 3-4 colors maximum
- [ ] Animation timing reflects brand character
- [ ] Micro-copy matches brand voice
- [ ] Empty/error states maintain brand personality

## Not-For Boundaries

**Do NOT use this skill for**:
- Backend API architecture → Use `backend-architect` instead
- Database schema design → Use `backend-architect` instead  
- SEO optimization → Use `web-design-expert` instead
- Brand identity creation → Use `design-system-creator` instead
- Accessibility-first design → Use `adhd-design-expert` instead
- Static marketing sites → Use `web-design-expert` instead
- Design system tokens → Use `design-system-creator` instead

**Delegate to other skills when**:
- User mentions "server", "database", "API endpoints" → `backend-architect`
- Focus is on accessibility, ADHD, cognitive load → `adhd-design-expert`  
- Need retro/vaporwave/glassmorphic aesthetic → `vaporwave-glassomorphic-ui-designer`
- Building component libraries without interface → `design-system-creator`
- GPU shaders, Metal, WebGL complexity → `metal-shader-expert`