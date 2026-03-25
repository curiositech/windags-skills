---
license: Apache-2.0
name: wellness-app-engagement
description: Designs ethical engagement systems for wellness apps — onboarding, habit loops, streaks, re-engagement, and push strategy that serve user health over retention metrics. Grounded in BJ Fogg's Behavior Model, Self-Determination Theory, and the Hook Model applied responsibly. Activate on 'wellness app', 'health app engagement', 'habit formation', 'onboarding flow', 'streak system', 'push notification strategy', 'user retention wellness', 'ethical gamification', 'lapsed user re-engagement', 'daily engagement loop'.
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Product & UX
  tags:
    - wellness
    - engagement
    - onboarding
    - habit-formation
    - retention
    - behavioral-science
    - ethical-design
    - push-notifications
  pairs-with:
    - skill: recovery-app-onboarding
      reason: Shared onboarding patterns for sensitive health contexts
    - skill: adhd-design-expert
      reason: Overlapping need for dopamine-aware, forgiving design
    - skill: ux-friction-analyzer
      reason: Identify and remove friction in engagement loops
    - skill: sobriety-app-design
      reason: Ethical engagement is critical when users are vulnerable
    - skill: mobile-ux-optimizer
      reason: Wellness apps live on mobile — performance is retention
category: Recovery & Wellness
tags:
  - wellness
  - engagement
  - retention
  - app
  - health
---

# Wellness App Engagement Design

Expert in designing engagement systems for wellness apps that serve user health outcomes over vanity metrics. Combines behavioral science with ethical design to create genuine value, not addiction.

## DECISION POINTS

### User Type Classification (First Open)

```
User Intent Assessment:
├─ NEW USER (first download)
│  ├─ High motivation + specific problem → Direct to solution (skip long onboarding)
│  ├─ High motivation + exploring → Quick tour with immediate micro-win
│  └─ Low motivation + browsing → Single action + value demonstration
├─ RETURNING USER (7-30 days inactive)
│  ├─ Left during onboarding → Fresh start option + simplified flow
│  ├─ Completed setup but stopped → Show what's new + adjust goals option
│  └─ Had active streak → Welcome back warmly, don't mention gap
└─ LAPSED USER (30+ days inactive)
   ├─ Had high engagement → Show lifetime stats + "pick up where you left off"
   ├─ Had low engagement → Treat as new user with better onboarding
   └─ Churned during trial → Address specific pain point that caused exit
```

### Notification Cadence Logic

```
Daily Notification Decision Tree:
├─ User set preferred time?
│  ├─ YES → Send at their time ± 30 min window
│  └─ NO → Use historical pattern or default to 9am
├─ User active in last 24 hours?
│  ├─ YES → Skip daily reminder, send milestone/insight instead
│  └─ NO → Send gentle invitation to return
├─ Inactive 3+ days?
│  ├─ First gap → One "we miss you" message with value
│  ├─ Multiple gaps → Weekly digest only
│  └─ 14+ days → Stop all engagement notifications
└─ User disabled notifications?
   └─ Respect choice. Use in-app messaging only.
```

### Content Personalization Fork

```
Session Recommendation Engine:
├─ Time of Day:
│  ├─ Morning (5-10am) → Energizing/intention-setting content
│  ├─ Midday (11am-3pm) → Quick reset sessions (3-5 min)
│  ├─ Evening (4-8pm) → Transition/unwinding content
│  └─ Night (9pm+) → Sleep-focused only
├─ User's Current State:
│  ├─ Mood check = good → Growth/challenge content
│  ├─ Mood check = neutral → Maintenance content
│  ├─ Mood check = poor → Comfort/basic content
│  └─ No mood data → Default to user's most-completed content type
└─ Usage Pattern:
   ├─ Daily user → Introduce variety/advanced content
   ├─ Weekly user → Focus on consistency/habit-building
   └─ Sporadic user → Keep sessions tiny, celebrate all returns
```

## FAILURE MODES

### 1. Guilt Machine Syndrome
**Symptoms:** Declining mood scores after notifications, users disabling alerts, negative app reviews mentioning "pressure"
**Diagnosis:** Your engagement system triggers shame instead of motivation
**Fix:** Audit all copy for obligation language. Replace "You missed..." with "When you're ready..." Reframe streaks as accumulation, not loss prevention.

### 2. Onboarding Overwhelm
**Symptoms:** 60%+ drop-off in first session, users never completing setup, support tickets asking "how do I just start?"
**Diagnosis:** Cognitive overload from showing too much too fast
**Fix:** Implement progressive disclosure. Show only ONE feature at a time. Deliver micro-win before asking for ANY commitment. Test with 3-screen limit.

### 3. Vanity Metric Optimization
**Symptoms:** High DAU but users report no benefit, time-in-app increasing but satisfaction decreasing
**Diagnosis:** Optimizing for engagement metrics instead of health outcomes
**Fix:** Switch primary KPI to outcome achievement rate. Survey users on actual life improvement. Shorten sessions if completion drops below 80%.

### 4. Dark Pattern Notifications
**Symptoms:** High notification open rates but immediate app closes, users mentioning "anxiety" from alerts
**Diagnosis:** Using fear/guilt to drive opens instead of providing value
**Fix:** Test notification copy with therapist review. Remove all loss-framing. Lead with value: "Your 3-min calm break is ready" not "Don't lose your streak!"

### 5. Subscription Bait-and-Switch
**Symptoms:** High trial-to-paid conversion but immediate cancellations, reviews mentioning "trapped" or "deceived"
**Diagnosis:** Paywalling features users relied on during free trial
**Fix:** Design free tier with genuine long-term value. Premium should add depth, not remove basics. Never paywall features shown in onboarding.

## WORKED EXAMPLES

### Example 1: Meditation App - Lapsed User Re-engagement

**Scenario:** Sarah used a meditation app daily for 3 weeks, then stopped for 12 days. She opens the app again.

**Novice approach:** Show "0-day streak" prominently, list missed sessions, ask "What happened?"

**Expert approach:**
1. **Welcome screen:** "Good to see you, Sarah! ✨"
2. **Stats reframe:** Show "Total sessions: 23" and "Longest practice run: 21 days" (both positive)
3. **Fresh start option:** "Want to adjust your daily goal?" (gives autonomy back)
4. **Tiny re-entry:** Offer 1-minute session, not the 10-minute one she used to do
5. **Celebrate return:** "Day 1 of your new practice journey" (reframes as beginning, not failure recovery)

**Decision points navigated:**
- User type: Returning user with previous high engagement → Show lifetime value
- Content selection: Give smallest possible win to rebuild confidence
- Messaging tone: Growth-focused, never mention the gap

**Trade-offs shown:** Could push her back to 10-minute sessions faster, but risking another dropout vs. patient rebuilding that creates sustainable habit.

### Example 2: Fitness App - Low Motivation User Onboarding

**Scenario:** Mike downloads a fitness app but selects "just exploring" and "haven't exercised in months" during intake.

**Novice approach:** Show full workout library, suggest 30-minute beginner routine, ask for fitness goals.

**Expert approach:**
1. **Immediate micro-win:** "Let's try one thing right now: 10 jumping jacks"
2. **Celebration:** "Nice! You just moved your body. That's what matters."
3. **Tiny commitment:** "Want to do just ONE thing tomorrow? Even 30 seconds counts."
4. **Autonomy preservation:** Show 5 options (jumping jacks, wall pushups, walking in place, stretching, dancing)
5. **Progress redefinition:** Track "movement sessions" not "workouts"

**Decision points navigated:**
- Motivation level: Low → Make ability barrier tiny, don't rely on motivation
- User goals: Vague → Help them discover preferences through micro-experiments
- Notification timing: Ask when they usually have 1 free minute, not when they'll "work out"

**Trade-offs shown:** Slower progression vs. sustainable engagement. Could lose him with bigger initial asks, but tiny wins compound into lasting behavior change.

### Example 3: Recovery App - High-Stakes Re-engagement

**Scenario:** Jamie used a sobriety tracking app for 45 days, relapsed, stayed away from app for 8 days, now wants to restart.

**Novice approach:** Reset day counter to 0, show "start over" messaging, ask about the relapse.

**Expert approach:**
1. **Non-judgmental return:** "Welcome back. You're here, and that's what matters."
2. **Reframe progress:** "45 days of strength still count. Recovery isn't erased."
3. **New metric introduction:** "You've opened this app 53 times. Each time took courage."
4. **Immediate support:** "Today's focus: one hour at a time. You've got this."
5. **Community connection:** "12 people in your group are starting fresh today too"

**Decision points navigated:**
- User state: Vulnerable after setback → Lead with compassion, not metrics
- Progress tracking: Don't erase previous achievement, reframe relationship to "streak"
- Support level: High need → Immediate community connection and crisis resources
- Messaging: Recovery-informed language that doesn't trigger shame spirals

**Trade-offs shown:** Could emphasize "starting over" motivation, but risking shame-induced abandonment vs. building on existing strengths and resilience.

## QUALITY GATES

Pre-launch completion checklist:

- [ ] SDT validation: Users can set their own goals, choose session types, and customize schedules (autonomy preserved)
- [ ] Fogg model check: Smallest possible action takes under 60 seconds and requires no decisions (ability barrier lowered)
- [ ] Notification audit: All push copy reviewed by mental health professional, no guilt/fear language present
- [ ] Streak system ethics: Calendar view shows patterns, not just consecutive days; no loss-framing in UI
- [ ] Onboarding delivers micro-win within first 3 screens before asking for any commitment
- [ ] Lapsed user flow tested: Returning after 7+ days shows welcome, not punishment
- [ ] Free tier provides genuine long-term value, premium adds depth without removing basics
- [ ] Outcome metrics defined: Primary KPI measures user health improvement, not just engagement
- [ ] Dark pattern scan complete: No subscription traps, fake urgency, or shame-based retention tactics
- [ ] Crisis resource integration: High-distress responses trigger support resources, not just content
- [ ] Data privacy locked: Health/mood data never used for targeting or shared with third parties

## NOT-FOR BOUNDARIES

**This skill is NOT for:**
- Social media engagement optimization → Use `social-media-growth` instead
- E-commerce conversion funnels → Use `conversion-optimization` instead  
- General app onboarding without health context → Use `mobile-onboarding-flow` instead
- Gaming/entertainment app retention → Use `game-engagement-design` instead
- Productivity apps without wellness angle → Use `productivity-app-design` instead

**Delegate when:**
- User mentions crisis/suicide ideation → Escalate to `crisis-intervention-design`
- App targets children under 13 → Use `child-safe-app-design`
- Medical device integration required → Use `healthtech-compliance-expert`
- Complex addiction recovery features → Pair with `addiction-recovery-expert`