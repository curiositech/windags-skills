---
license: Apache-2.0
name: ux-friction-analyzer
description: Comprehensive UX analysis using cognitive psychology, ADHD-friendly design, Gestalt principles, and flow state engineering. Specializes in friction audits, user journey simulation, cognitive load optimization, and Fitts' Law application. Activate on "analyze UX", "friction audit", "user journey", "ADHD-friendly", "optimize flow", "reduce cognitive load", "UX audit", "conversion optimization". NOT for visual design execution (use web-design-expert), A/B testing implementation (use frontend-developer), or accessibility compliance auditing (use accessibility-auditor).
allowed-tools: Read,Write,Edit,WebFetch
category: Design & Creative
tags:
  - ux
  - accessibility
  - cognitive-load
  - adhd-friendly
  - user-research
pairs-with:
  - skill: web-design-expert
    reason: Implement UX recommendations
  - skill: adhd-design-expert
    reason: Deep neurodivergent design patterns
  - skill: frontend-developer
    reason: Technical implementation of UX fixes
---

# UX Friction Analyzer

A comprehensive skill for analyzing and optimizing user experience through cognitive psychology, ADHD-friendly design, and flow state engineering.

## Decision Points

Use this decision matrix when conflicting ADHD principles and cognitive load types collide:

### Cognitive Load vs ADHD Principle Conflicts

| Situation | If High Intrinsic Load | If High Extraneous Load | If High Germane Load |
|-----------|----------------------|------------------------|-------------------|
| **Progressive Disclosure vs Information Need** | Hide advanced features; show essentials only | Remove ALL decorative elements; show task steps linearly | Group related info; use expandable sections |
| **Context Preservation vs Working Memory** | Auto-save every keystroke; show current state banner | Clear all non-essential UI; focus on one input field | Save drafts; provide "where you left off" panels |
| **Chunked Progress vs Task Flow** | Break into micro-tasks (1-2 min each) | Show progress bar; hide future steps completely | Use card-based UI; each card = one concept |
| **Predictable Navigation vs Personalization** | Keep identical layout always; disable customization | Use breadcrumbs; limit to 3-level hierarchy max | Offer simple/advanced modes; user chooses complexity |

### Primary Decision Tree

```
User arrives → What's their cognitive state?

├─ FOCUSED & ENERGETIC
│  ├─ Goal: Complete complex task
│  │  → Use power-user shortcuts + batch operations
│  └─ Goal: Explore/learn
│     → Show advanced features + guided tour
│
├─ DISTRACTED/MULTITASKING  
│  ├─ On mobile
│  │  → Single-column layout + floating action button
│  └─ On desktop
│     → Minimize chrome + auto-save everything
│
├─ OVERWHELMED/ANXIOUS
│  ├─ First-time user
│  │  → Wizard flow + success celebrations
│  └─ Returning user hitting error
│     → Clear error recovery + undo options
│
└─ TIME-PRESSURED/URGENT
   ├─ Regular task
   │  → Smart defaults + keyboard shortcuts
   └─ Crisis situation
      → Emergency mode UI + direct contact options
```

### Friction vs Feature Trade-offs

When feature requests conflict with friction reduction:

- **If feature adds >2 seconds to primary flow**: Defer to advanced mode
- **If feature requires >4 mental chunks**: Break into wizard steps  
- **If feature serves <20% of users**: Hide behind "More options"
- **If feature needs learning curve**: Provide in-context help only

## Failure Modes

### 1. Overwhelm Cascade
**Detection Rule**: If user abandons before completing first meaningful action
- **Symptom**: High bounce rate on landing page, users don't scroll
- **Diagnosis**: Too many choices presented simultaneously
- **Fix**: Progressive disclosure - show only 1-2 primary actions initially

### 2. Context Switch Death Spiral  
**Detection Rule**: If user takes >23 minutes to complete familiar 5-minute task
- **Symptom**: Users losing place repeatedly, restarting workflows
- **Diagnosis**: Interface doesn't preserve context across interruptions
- **Fix**: Add "Continue where you left off" persistent banner

### 3. Invisible Progress Paralysis
**Detection Rule**: If users repeatedly ask "Is this working?" during long operations
- **Symptom**: Users refresh page during background processing
- **Diagnosis**: No feedback on system state or progress
- **Fix**: Real-time progress indicators + time estimates

### 4. Micro-Friction Accumulation
**Detection Rule**: If completion rates drop >15% despite no major UX changes
- **Symptom**: Users complete individual steps but abandon before final step
- **Diagnosis**: Small frictions compound into abandonment
- **Fix**: Remove one minor friction point per week systematically

### 5. Expert User Imprisonment
**Detection Rule**: If power users complain about "dumbed down" interface
- **Symptom**: Feature requests for keyboard shortcuts, batch operations
- **Diagnosis**: Optimized for beginners, frustrated experts
- **Fix**: Adaptive UI that reveals complexity based on user behavior

## Worked Examples

### Example 1: E-commerce Checkout for ADHD User

**Scenario**: User with ADHD purchasing laptop accessories, gets distracted mid-checkout

**Current Flow Analysis**:
```
0:00  User adds items to cart (3 items)
      └─ Cart shows: Item list, recommendations, promo codes, shipping calculator

0:30  Clicks "Checkout" → Redirected to shipping form
      └─ Form has 12 fields, required fields marked with *
      
1:45  Phone notification interrupts
      └─ User checks notification, returns to checkout
      
2:30  User confused - form partially filled but unclear what's complete
      └─ Starts over, re-enters shipping address
      
4:00  Gets to payment step → Credit card form asks for billing address
      └─ User forgot if billing = shipping, sees no indication
      
6:15  Completes payment → "Processing..." with spinning wheel
      └─ No time estimate, user worries something broke
      
7:30  Success page → Generic "Order complete" message
      └─ User unsure what happens next, when items ship
```

**Decision Points Hit**:
- **Distracted/Multitasking** + **Time-pressured** → Should use auto-save + progress preservation
- **High Extraneous Load** (too many form fields) → Should chunk into steps
- **Context Switch** event → Need re-orientation support

**Optimized Flow**:
```
0:00  User adds items to cart
      └─ Cart shows: Item list only, single "Secure Checkout" button (44px tall)

0:15  Checkout → Single step: "Where should we ship this?"
      └─ Address form only, with "Use my saved address" option
      └─ Auto-save on every keystroke
      
1:30  Phone interrupts → User leaves page

2:00  User returns → Banner: "Continue your checkout - we saved your progress"
      └─ Address pre-filled, "Next: Payment" button ready
      
2:15  Payment step → "Same billing address?" with Yes (default) / No toggle
      └─ Credit card form with visual validation (green checkmarks)
      
3:00  Submit → "Processing payment..." with progress bar
      └─ "This usually takes 10-15 seconds"
      
3:15  Success → "Order #12345 confirmed! Ships Tuesday, arrives Friday"
      └─ "Track your order" button + calendar reminder option
```

**Key Changes**:
- Reduced 12 form fields to 3 focused steps
- Added auto-save and progress restoration
- Provided time estimates for all wait states
- Used recognition over recall for billing address

### Example 2: Software Dashboard Friction Audit

**Scenario**: SaaS analytics dashboard used by marketing teams

**Journey Simulation**:
```
User Intent: Create weekly report for executive team
Cognitive State: Time-pressured (due in 30 minutes)
Experience Level: Intermediate (uses tool monthly)

FRICTION AUDIT:
0:00  Lands on dashboard → 47 different widgets/charts visible
      FRICTION: Overwhelm Cascade - too many data points
      COGNITIVE LOAD: High extraneous
      
0:45  Looking for "Create Report" function → Finds it in hamburger menu
      FRICTION: Hidden primary action
      TIME LOSS: 45 seconds of hunting
      
1:30  Report builder opens → 23 chart type options in dropdown
      FRICTION: Too many choices for time-pressured user
      DECISION NEEDED: Past reports were always bar charts + line graphs
      
3:00  Selects data sources → Interface shows all 47 available sources
      FRICTION: No smart filtering based on user's team/role
      TIME LOSS: 90 seconds scrolling through irrelevant options
      
5:30  Starts building first chart → No template from last week's report
      FRICTION: No learning from user patterns
      CONTEXT SWITCH RISK: User might leave to find last week's report
      
8:00  Chart renders slowly (12 seconds) → No progress indication
      FRICTION: Invisible Progress Paralysis
      USER ANXIETY: "Is it broken? Should I refresh?"
      
15:00 Report preview → Executive template not applied automatically
       FRICTION: Micro-friction accumulation
       EXPERT USER ISSUE: No keyboard shortcuts for power users
```

**Optimization Decisions**:
- **Overwhelmed + Time-pressured** → Use smart defaults + recent templates
- **High Extraneous Load** → Filter options by user role/past behavior
- **Expert User** + **Familiar task** → Provide power-user shortcuts

## Quality Gates

Before considering a UX friction audit complete, verify:

**Quantitative Metrics:**
- [ ] Task completion time reduced by ≥25% from baseline
- [ ] Error rate decreased to ≤5% for primary user flows
- [ ] Cognitive load score ≤6/10 (measured via NASA-TLX or user interviews)
- [ ] Time-to-first-value ≤60 seconds for new users
- [ ] Context switch recovery time ≤90 seconds

**User Experience Validation:**
- [ ] 3+ real users completed full journey without assistance
- [ ] Zero critical accessibility violations (WCAG AA compliance)
- [ ] Mobile touch targets ≥44px for all interactive elements
- [ ] Page load times ≤3 seconds for all critical path pages

**Design System Compliance:**
- [ ] All ADHD-friendly patterns implemented (auto-save, progress indicators, calm UI)
- [ ] Fitts' Law violations eliminated (button sizing, placement)
- [ ] Working memory limits respected (≤4 simultaneous UI elements requiring attention)
- [ ] Every user action has clear feedback within 0.1 seconds
- [ ] Error states include specific recovery instructions, not generic messages

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **Visual design execution** → Use [web-design-expert] instead
  - Creating mockups, choosing colors, typography decisions
  - Pixel-perfect layout implementation

- **A/B testing setup or statistical analysis** → Use [frontend-developer] + [data-analyst] instead
  - Test implementation, traffic splitting, conversion tracking
  - Statistical significance calculations, test result interpretation

- **Accessibility compliance auditing** → Use [accessibility-auditor] instead
  - WCAG checklist verification, screen reader testing
  - Legal compliance documentation, remediation prioritization

- **Technical performance optimization** → Use [frontend-developer] instead
  - Code optimization, bundle splitting, caching strategies
  - Database query optimization, API response times

- **User research methodology** → Use [user-researcher] instead
  - Interview guide creation, survey design, usability testing protocols
  - Qualitative data analysis, persona development from research

**Boundary Decision Rule**: If the task requires specialized domain expertise beyond UX psychology and cognitive principles, delegate to the appropriate specialist skill.