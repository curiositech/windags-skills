---
license: Apache-2.0
name: recovery-app-onboarding
description: Expert guidance for designing and implementing onboarding flows in recovery, wellness, and mental health applications. This skill should be used when building onboarding experiences, first-time user flows, feature discovery, or tutorial systems for apps serving vulnerable populations (addiction recovery, mental health, wellness). Activate on "onboarding", "first-time user", "tutorial", "feature tour", "welcome flow", "new user experience", "app introduction", "recovery app UX". NOT for general mobile UX (use mobile-ux-optimizer), marketing landing pages (use web-design-expert), or native app development (use iOS/Android skills).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
category: Recovery & Wellness
tags:
  - onboarding
  - recovery-app
  - ux
  - user-flow
  - engagement
---

# Recovery App Onboarding Excellence

Build compassionate, effective onboarding experiences for recovery and wellness applications that serve vulnerable populations with dignity and practical utility.

## Decision Points

Navigate onboarding design through these critical decision trees:

### User State Assessment
```
Is user in crisis?
├── YES → Skip to crisis resources immediately
│   └── Offer lightweight onboarding after crisis resolved
└── NO → Continue to value demonstration

User engagement level?
├── HIGH (opened app 3+ times) → Skip basic intro, show advanced features
├── MEDIUM (opened 1-2 times) → Standard onboarding flow
└── LOW (first time) → Value-first approach, minimal friction
```

### Stage Skipping Logic
```
User wants to skip current step?
├── Essential step (safety/crisis)?
│   ├── YES → Show "Quick Setup" alternative (30 sec version)
│   └── NO → Block skip, explain importance briefly
└── Optional step?
    ├── Mark as skipped, offer in-app discovery later
    └── Continue to next essential step

Has user completed any onboarding before?
├── YES → Jump to step after last completed
├── PARTIAL → Resume from last incomplete essential step
└── NO → Start from welcome
```

### Permission Request Timing
```
Feature requires permission?
├── Location for meetings → Show value first ("Find meetings near you"), then prime
├── Notifications for reminders → After user sets first goal/appointment
├── Camera for progress photos → Only when user opens that feature
└── Contacts for emergency → During safety planning (optional step)

User denied permission?
├── Offer alternative (ZIP search vs location)
├── Explain impact clearly ("You'll need to search manually")
└── Don't ask again for 30 days unless user initiates
```

## Failure Modes

### Rubber Stamp Onboarding
**Symptoms:** Users skip all steps rapidly, don't engage with core features
**Detection:** >80% skip rate OR completion time <2 minutes for full flow
**Fix:** Add micro-value demonstrations between steps, make skipping require explanation of alternatives

### Crisis User Overwhelm
**Symptoms:** High drop-off rate after welcome screen, users don't return
**Detection:** <24hr retention <40% AND no crisis resource access logged
**Fix:** Crisis detection questions on step 1, immediate resource access, defer non-essential onboarding

### Permission Wall Syndrome
**Symptoms:** Users grant no permissions, app functionality severely limited
**Detection:** Permission grant rate <30% AND feature usage <20% of potential
**Fix:** Contextual priming before each request, show specific value, provide fallback options

### Feature FOMO Overload
**Symptoms:** Users feel overwhelmed by feature list, abandon mid-flow
**Detection:** Drop-off spikes at feature showcase step (>40% exit rate)
**Fix:** Limit to 3 essential features only, use progressive disclosure for advanced features

### Privacy Anxiety Spiral
**Symptoms:** Users concerned about anonymity, don't create accounts
**Detection:** <50% account creation rate AND high exit at data entry steps
**Fix:** Lead with anonymity messaging, show data handling practices, offer guest mode

## Worked Example

**Scenario:** First-time user, evening access, appears stable (not crisis state)

### Expert Decision Path:
1. **Welcome Screen (15 sec):** "You're taking a brave step" + immediate crisis button placement
2. **Value Check:** Show meeting finder demo with fake data - "This is how you'd find meetings near you"
3. **Program Selection:** Multi-select friendly, includes "exploring/not sure" option
4. **Permission Prime:** "To show nearby meetings" → contextual location request
5. **Safety Net:** Optional emergency contact setup with clear skip option
6. **Feature Tour:** Only 3 cards (meetings, crisis, check-ins) with "discover more later"

### Novice Mistakes vs Expert Catches:
- **Novice:** Asks for all permissions upfront → **Expert:** Contextual priming per feature
- **Novice:** 8-step onboarding with every feature → **Expert:** 4 steps max, essential only
- **Novice:** Generic "Sign up to continue" → **Expert:** "Save your meeting search history"
- **Novice:** No crisis detection → **Expert:** Always available crisis button, evening time = higher risk awareness

### Decision Points Navigated:
- User state: Stable evening user → standard flow
- Permission timing: Location only after showing meeting value
- Feature showcase: Essential-only (meetings, crisis, check-ins)
- Account creation: After demonstrating value, positioned as "save progress"

## Quality Gates

**Onboarding completion criteria - all must pass:**

[ ] Crisis resources accessible from every onboarding screen
[ ] Entire flow completable in under 3 minutes
[ ] All steps skippable except crisis resource acknowledgment
[ ] Works offline after initial download
[ ] Screen reader announces step changes with aria-live
[ ] Touch targets minimum 44x44px on all interactive elements
[ ] Color contrast 4.5:1 ratio for all text under 18px
[ ] Completion time tracked and logged for optimization
[ ] Permission requests include contextual value explanation
[ ] Recovery program selection allows multiple choices
[ ] Emergency contact setup clearly marked optional
[ ] Feature discovery continues post-onboarding via tooltips
[ ] User can return to onboarding from settings
[ ] Progress persists across app sessions
[ ] Crisis path validation: can reach resources in <10 seconds from any step

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **General mobile app onboarding** → Use `mobile-ux-optimizer` instead
- **E-commerce checkout flows** → Use `conversion-optimization` instead  
- **SaaS product tours** → Use `product-onboarding` instead
- **Marketing landing page optimization** → Use `web-design-expert` instead
- **Native iOS/Android development** → Use platform-specific skills instead
- **Database schema for user data** → Use `supabase-admin` instead
- **User authentication implementation** → Use `auth-security` instead
- **Crisis intervention protocols** → Defer to licensed mental health professionals
- **Medical advice or treatment recommendations** → Require medical professional oversight

**Delegation patterns:**
- For conversion rate optimization → `web-design-expert`
- For accessibility compliance → `accessibility-expert` 
- For crisis resource content → Licensed mental health consultation required
- For HIPAA compliance → Legal and compliance team review required