---
license: Apache-2.0
name: sobriety-app-design
description: Expert in designing AI-powered sobriety and recovery applications with trauma-informed UX. Covers sobriety counters, milestone celebrations, daily check-in flows, mood/craving tracking, meeting finders, sponsor communication, emergency crisis buttons, and ethical gamification. Activate on 'recovery app design', 'sobriety app UX', 'sobriety counter design', 'recovery app features', 'craving tracker UI', 'meeting finder UX', 'crisis button design', 'recovery milestones', 'sober app wireframe', 'trauma-informed app design'. NOT for clinical treatment protocols (use modern-drug-rehab-computer), active crisis intervention (call 988), or general mobile UX without recovery context (use mobile-ux-optimizer).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Recovery & Wellness
  tags:
    - sobriety
    - recovery-app
    - trauma-informed-design
    - UX
    - mobile-health
    - gamification
    - crisis-resources
    - accessibility
  pairs-with:
    - skill: sobriety-tools-guardian
      reason: Performance optimization for recovery apps where speed saves lives
    - skill: recovery-app-onboarding
      reason: First-time user experience and progressive disclosure for recovery apps
    - skill: adhd-design-expert
      reason: Executive function-friendly design patterns that many people in recovery need
    - skill: design-justice
      reason: Equitable, non-exploitative design that serves vulnerable populations
category: Recovery & Wellness
tags:
  - sobriety
  - app-design
  - recovery
  - ux
  - mobile
---

# Sobriety App Design

Design AI-powered sobriety and recovery applications that feel safe, non-judgmental, and empowering. This skill covers the specific UX patterns, features, and design philosophy that make recovery apps genuinely useful rather than clinical, preachy, or abandoned after three days.

## When to Use

**Use for:**
- Designing sobriety counters, check-in flows, and milestone systems
- Building craving/mood tracking interfaces
- Designing meeting finders and sponsor communication features
- Placing and designing emergency/crisis access points
- Implementing ethical gamification for recovery engagement
- Reviewing recovery app designs for trauma-informed compliance
- Building AI-assisted features (journaling prompts, pattern detection, check-in analysis)

**Do NOT use for:**
- Clinical treatment protocol design -- use `modern-drug-rehab-computer`
- Active crisis intervention -- call 988 or SAMHSA helpline 1-800-662-4357
- General mobile UX without recovery context -- use `mobile-ux-optimizer`
- Onboarding-specific flows -- use `recovery-app-onboarding`

## The Retention Problem and Why Recovery Apps Are Different

Most wellness apps lose 77% of daily active users within three days. Only 4% of mental health app users are still active after 15 days. Recovery apps must break this pattern because disengagement is not merely "churn" -- it can mean someone lost a lifeline.

### Why Wellness Apps Fail (and How Recovery Apps Must Differ)

```
WELLNESS APP FAILURE MODES          RECOVERY APP RESPONSE
─────────────────────────────────── ───────────────────────────────────
Burdensome onboarding               Value before signup (meeting finder
                                     works without an account)

Hidden costs / upsells               Crisis features are ALWAYS free.
                                     Never paywall the safety plan.

Generic content                      Personalized to substance, program,
                                     and stage of recovery

Guilt-based re-engagement            "We're here when you're ready"
("You missed 3 days!")               not "You broke your streak!"

Engagement metrics over outcomes     Measure sobriety milestones,
                                     crisis calls made, meetings found

The "Success Paradox" -- users       Recovery is lifelong. The app
quit when they feel better           evolves WITH the user's stage.
```

### The Core Design Principle

Recovery apps succeed when they become part of the person's recovery infrastructure -- as essential as their sponsor's number, their home group, and their therapist. That means the app must be **useful in crisis, meaningful in stability, and invisible when not needed**.

## Trauma-Informed Design Framework

SAMHSA defines six principles of trauma-informed care. Every screen, interaction, and notification in a recovery app must honor them:

### 1. Safety
- Calming color palettes (soft blues, greens, warm neutrals -- never stark clinical white)
- No sudden modal popups or alerts. Transitions are gentle.
- Content warnings before potentially triggering material
- The app NEVER displays substance imagery or romanticizing content

### 2. Trustworthiness and Transparency
- Explicit privacy messaging: "Your data stays on your device unless you choose to share"
- No surprise data collection. Permissions requested contextually with plain-language reasons.
- Clear explanation of what AI does with journal entries or check-in data
- Honest about limitations: "This app supports your recovery. It does not replace your treatment team."

### 3. Peer Support
- Community features connect people at similar stages (I Am Sober model: milestone-based feeds)
- Moderation that protects without silencing
- Anonymous participation options

### 4. Collaboration and Mutuality
- Users control their own data, milestones, and what they share
- Sponsor/accountability partner features are opt-in, never mandatory
- AI suggestions are framed as options, not prescriptions

### 5. Empowerment, Voice, and Choice
- Every screen has a skip or "not now" option
- Users choose their own recovery framework (12-step, SMART, Dharma, secular, hybrid)
- Customizable dashboards -- not everyone needs a sobriety counter front and center

### 6. Cultural Responsiveness
- Support for multiple recovery pathways without privileging any single approach
- Language options and culturally appropriate imagery
- Acknowledgment that addiction affects every community differently

## Core Feature Patterns

### 1. The Sobriety Counter

The counter is the heartbeat of most recovery apps. Design it carefully.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              ┌────────────────────┐                   │
│              │    127 days        │                   │
│              │  3 hours 42 min    │                   │
│              └────────────────────┘                   │
│                                                      │
│         ┌─────────┐  ┌─────────┐  ┌──────────┐      │
│         │ $3,810  │  │ 1,524   │  │  2,032   │      │
│         │  saved  │  │  hours  │  │ calories │      │
│         └─────────┘  └─────────┘  └──────────┘      │
│                                                      │
│  Next milestone: 6 months (53 days away)             │
│  ████████████████████████░░░░░░░░░  71%              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- The primary counter shows days prominently. Hours/minutes/seconds are secondary.
- Show tangible benefits: money saved, time reclaimed, health milestones
- Progress bar to next milestone creates forward momentum without pressure
- NEVER show a counter at zero with shame language. If someone resets: "Day 1 is still a victory. You chose to come back."
- Allow multiple counters (alcohol, nicotine, gambling -- people recover from more than one thing)
- Offer the option to HIDE the counter. Some people find it triggering or reductive.

### 2. Daily Check-In Flow

The check-in is the app's primary engagement loop. It must be completable in under 60 seconds.

```
┌──────────────────────────────────────────────────────┐
│  Good morning. How are you today?                    │
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ Hard │  │ Meh  │  │ Okay │  │ Good │  │Great │  │
│  │  1   │  │  2   │  │  3   │  │  4   │  │  5   │  │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  │
│                                                      │
│  Any cravings?  ○ None  ○ Mild  ○ Strong             │
│                                                      │
│  HALT check:                                         │
│  ☐ Hungry  ☐ Angry  ☐ Lonely  ☐ Tired               │
│                                                      │
│  [ Add a note (optional) _____________________ ]     │
│                                                      │
│           [ Submit Check-In ]                        │
│                                                      │
│  ─── or just tap your mood and go ───                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- One-tap minimum viable check-in (mood only). Everything else is optional.
- HALT (Hungry, Angry, Lonely, Tired) as quick toggles, not a multi-screen wizard
- Journal/notes expand inline, not on a separate screen
- Morning and evening check-ins are separate (different emotional context)
- Adaptive: if user checks "Strong craving," surface crisis resources immediately but gently
- Submit is optimistic (instant confirmation, sync in background)
- Never say "You missed yesterday's check-in." Instead: "Welcome back."

### 3. Mood and Craving Tracking

```
┌──────────────────────────────────────────────────────┐
│  YOUR WEEK                                           │
│                                                      │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun                   │
│   4    3    3    2    4    5    4     ← mood          │
│   0    1    0    2    0    0    0     ← cravings     │
│                                                      │
│  ┌──────────────────────────────────┐                │
│  │ Pattern detected:               │                │
│  │ Cravings tend to spike on days  │                │
│  │ when your mood drops below 3.   │                │
│  │ Thursday you were also Lonely.  │                │
│  │                                 │                │
│  │ Consider: reaching out to       │                │
│  │ someone before cravings build.  │                │
│  └──────────────────────────────────┘                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- Simple visualizations (bar charts, color-coded dots). No complex analytics.
- AI pattern detection surfaces insights, not lectures
- Language is observational: "Pattern detected" not "Warning: you're at risk"
- Historical data belongs to the user. Export always available.
- Never compare the user to "other users" or "average recovery paths"

### 4. Meeting Finder

```
┌──────────────────────────────────────────────────────┐
│  Find a Meeting                                      │
│                                                      │
│  ┌──────────────────────────────────┐                │
│  │ 📍 Near me  │  🔤 By ZIP code   │                │
│  └──────────────────────────────────┘                │
│                                                      │
│  Programs:  [AA] [NA] [SMART] [All]                  │
│  Format:    [In-Person] [Online] [Hybrid]            │
│  Time:      [Now] [Today] [This Week]                │
│                                                      │
│  ┌──────────────────────────────────────┐            │
│  │ Serenity Group          0.3 mi       │            │
│  │ AA Open Discussion     7:00 PM       │            │
│  │ First Baptist Church                 │            │
│  │ [ Directions ]  [ Save ]             │            │
│  ├──────────────────────────────────────┤            │
│  │ Recovery Dharma Online    NOW        │            │
│  │ Meditation Meeting       Zoom        │            │
│  │ [ Join ]  [ Save ]                   │            │
│  └──────────────────────────────────────┘            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- "Now" filter is critical -- someone searching at 2 AM needs what is open NOW
- Offline: saved meetings must be viewable without network (addresses, phone numbers)
- Include online meetings (Zoom links). Many people cannot attend in-person.
- Multi-program support without judgment (AA, NA, CMA, SMART, Recovery Dharma, Refuge Recovery, LifeRing, SOS)
- Distance shown in plain units, not coordinates
- Location permission requested contextually ("To find meetings near you...") with ZIP fallback

### 5. Crisis Access

**Non-negotiable: crisis resources must be reachable from every screen in two taps or fewer.**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌──────────────────────────────────────┐            │
│  │  NEED HELP RIGHT NOW?               │            │
│  │                                      │            │
│  │  [ Call 988 ]                        │            │
│  │  Suicide & Crisis Lifeline           │            │
│  │                                      │            │
│  │  [ Call 1-800-662-4357 ]             │            │
│  │  SAMHSA National Helpline (free)     │            │
│  │                                      │            │
│  │  [ Text HOME to 741741 ]             │            │
│  │  Crisis Text Line                    │            │
│  │                                      │            │
│  │  [ Call My Sponsor ]                 │            │
│  │  [sponsor name if saved]             │            │
│  │                                      │            │
│  │  [ My Safety Plan ]                  │            │
│  │                                      │            │
│  └──────────────────────────────────────┘            │
│                                                      │
│  You are not alone. Help is available now.           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- Persistent crisis button (FAB, nav bar item, or pull-down gesture) on every screen
- Phone numbers are tap-to-call. No copy-paste required.
- Works offline (numbers stored locally, safety plan cached)
- Sponsor contact is first among personal contacts
- No confirmation dialogs on crisis calls ("Are you sure?" -- YES, THEY ARE SURE)
- Calming but not patronizing language

### 6. Ethical Gamification

Gamification in recovery apps must motivate without manipulating. People in recovery are often hyper-aware of manipulation after years of their own addiction lying to them.

**DO:**
- Celebrate milestones (24 hours, 1 week, 30 days, 90 days, 6 months, 1 year, and beyond)
- Use milestone-based community cohorts (the I Am Sober model: people at similar stages)
- Offer optional daily pledges ("Today I choose sobriety") as commitment devices
- Track streaks gently (check-in streaks, gratitude streaks) with easy recovery from breaks
- Unlock features progressively (journaling prompts that mature with the user's recovery stage)

**DO NOT:**
- Shame streak breaks ("You lost your 30-day streak!" -- devastating for someone who relapsed)
- Use leaderboards that compare users' sobriety length
- Send punitive notifications ("You haven't checked in!")
- Gate crisis features behind engagement metrics
- Use dark patterns to prevent app deletion or account closure
- Award "points" for recovery. Sobriety is not a game.

### 7. Sponsor and Accountability Communication

```
┌──────────────────────────────────────────────────────┐
│  My Support Network                                  │
│                                                      │
│  ┌───────────────────────────┐                       │
│  │ Sponsor: Mike R.          │                       │
│  │ [ Call ]  [ Text ]        │                       │
│  │ Last check-in: Yesterday  │                       │
│  └───────────────────────────┘                       │
│                                                      │
│  ┌───────────────────────────┐                       │
│  │ Accountability: Sarah T.  │                       │
│  │ [ Call ]  [ Text ]        │                       │
│  │ Shared: Daily check-ins   │                       │
│  └───────────────────────────┘                       │
│                                                      │
│  [ + Add Support Person ]                            │
│                                                      │
│  ── Quick SOS ──                                     │
│  Send a pre-written message to your support          │
│  network with one tap: "I need to talk."             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**
- One-tap SOS messaging to support network
- Optional check-in sharing (user controls what the sponsor sees)
- Pre-written message templates for hard moments ("I'm having a tough day," "Can we talk?")
- Sponsor never gets automated alerts without explicit user consent
- No surveillance features disguised as accountability

## AI Feature Design Principles

### What AI Should Do in Recovery Apps

1. **Pattern Recognition**: Detect mood/craving correlations in check-in data and surface gentle observations
2. **Journaling Prompts**: Generate personalized, stage-appropriate reflection questions
3. **Meeting Recommendations**: Suggest meetings based on preferences, schedule, and location patterns
4. **Crisis Detection**: Identify concerning patterns (see sobriety-tools-guardian) and surface resources
5. **Milestone Messaging**: Generate personalized congratulations that reference the user's journey

### What AI Must NOT Do

1. **Diagnose**: Never say "You may be experiencing relapse" -- surface resources, not labels
2. **Prescribe**: Never recommend specific treatments, medications, or dosage changes
3. **Replace Human Connection**: AI supplements but never substitutes for sponsors, therapists, and peers
4. **Judge**: Never evaluate whether the user is "doing recovery right"
5. **Retain Sensitive Data Unnecessarily**: Journal entries and check-ins should be processable locally where possible

## Design System Recommendations

### Color Palette
```
Primary:      #2D6A6A (teal -- calm, trustworthy)
Secondary:    #7B9E6B (sage green -- growth, renewal)
Accent:       #D4A76A (warm gold -- milestone celebrations)
Background:   #FAF8F5 (warm off-white -- gentle, not clinical)
Text:         #2C2C2C (soft black -- readable without harshness)
Crisis:       #C75450 (muted red -- urgent but not alarming)
```

### Typography
- Headers: Rounded sans-serif (friendly, not clinical)
- Body: Highly readable at 16px minimum (many users are in low-light, late-night situations)
- Numbers (counters): Monospace or tabular figures for steady counting animation

### Interaction Design
- Haptic feedback on milestone celebrations (subtle, affirming)
- Gentle transitions (200-300ms ease-out, never jarring)
- Pull-to-refresh with encouraging micro-copy ("Refreshing your journey...")
- Dark mode as default option (many check-ins happen at night)

## Anti-Patterns

### The Clinical Trap
**Pattern**: Designing the app like a medical portal with sterile language and hospital aesthetics.
**Problem**: Users feel pathologized, not supported. "Patient" language triggers shame.
**Fix**: Warm, peer-voiced tone. "How are you feeling?" not "Rate your symptoms."

### The Preacher
**Pattern**: App lectures users about the dangers of substance use.
**Problem**: Every person in recovery already knows. Lecturing is condescending and drives disengagement.
**Fix**: Assume the user is competent and courageous. Provide tools, not sermons.

### The Guilt Machine
**Pattern**: Notifications that shame non-engagement ("You haven't logged in for 3 days!").
**Problem**: Shame is the number one relapse trigger. Guilt-based re-engagement is dangerous.
**Fix**: Warm re-engagement: "No pressure. We're here when you need us." Or simply say nothing.

### The Data Hoarder
**Pattern**: Collecting detailed substance use history, mental health data, and location without clear need.
**Problem**: People in recovery are (rightly) protective of their privacy. Data breaches in this domain are catastrophic.
**Fix**: Collect minimum viable data. Process locally when possible. Encrypt everything. Let users delete everything with one action.

### The Feature Creep
**Pattern**: Adding meditation, fitness tracking, meal planning, sleep tracking, and CBT exercises into one app.
**Problem**: Overwhelming. Recovery is already exhausting. A 47-feature app feels like another obligation.
**Fix**: Do 3-4 things exceptionally well. Meeting finder, check-ins, crisis access, sobriety counter. That is a complete app.

### Performative Inclusivity
**Pattern**: Supporting "all pathways" in marketing but designing exclusively around 12-step language and concepts.
**Problem**: Alienates SMART Recovery, Recovery Dharma, secular, medication-assisted, and harm reduction users.
**Fix**: Program-agnostic core with opt-in pathway customization. Test with diverse recovery communities.

## Quality Checklist

- [ ] Crisis resources (988, SAMHSA 1-800-662-4357) accessible from every screen in two taps or fewer
- [ ] Crisis features work offline (cached numbers, safety plan)
- [ ] No paywall on any safety-critical feature
- [ ] Check-in completable in under 60 seconds (one-tap minimum)
- [ ] Counter reset language is compassionate, never shaming
- [ ] Notifications never use guilt, shame, or fear
- [ ] AI features explain what they do with user data in plain language
- [ ] All personal data exportable and deletable by the user
- [ ] Supports multiple recovery programs without privileging any single approach
- [ ] Meets WCAG AA accessibility standards (contrast, touch targets, screen reader support)
- [ ] Dark mode available (late-night check-ins are common)
- [ ] Tested with people in actual recovery (not just UX researchers)
- [ ] Gamification motivates without manipulating -- no shame on streak breaks
- [ ] Sponsor/accountability features are opt-in with user-controlled sharing
- [ ] Meeting finder includes online options and works at 2 AM
- [ ] App does not display substance imagery anywhere
- [ ] Privacy policy is readable in under 5 minutes and written in plain language

---

**Design Philosophy**: A recovery app earns its place on someone's phone by being genuinely useful in the hardest moments of their life. Every design decision should be tested against one question: "Would this help someone at 2 AM who is considering using?" If the answer is not a clear yes, reconsider whether it belongs.
