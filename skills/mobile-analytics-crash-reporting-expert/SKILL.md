---
license: Apache-2.0
name: mobile-analytics-crash-reporting-expert
description: "Mobile analytics and crash reporting expert for Firebase, Sentry, Mixpanel, custom events, and crash symbolication. Activate on: mobile analytics, crash reporting, Firebase Analytics, Sentry mobile, Mixpanel, event tracking, crash symbolication, dSYM upload, ProGuard mapping, session replay. NOT for: server-side logging (use log-aggregation-architect), web analytics (use frontend-architect), A/B testing (use environment-config-manager)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - analytics
  - crash-reporting
  - sentry
  - firebase
pairs-with:
  - skill: logging-observability
    reason: Mobile observability extends the broader logging and observability strategy
  - skill: app-store-submission-automator
    reason: Crash-free rate metrics impact app store ranking
---

# Mobile Analytics & Crash Reporting Expert

Expert in mobile analytics instrumentation, crash reporting with symbolication, and actionable event tracking across iOS and Android.

## Decision Points

### Stack Selection Decision Tree

```
High crash volume (>1000/day) OR complex error debugging needed?
├─ YES: Choose Sentry
│   ├─ Need user sessions? → Add Sentry Session Replay
│   └─ Enterprise budget? → Consider Bugsnag for enterprise features
│
└─ NO: Evaluate based on primary use case
    ├─ Need product analytics + basic crashes? → Firebase (free tier generous)
    ├─ Advanced funnel analysis required? → Mixpanel + Crashlytics
    └─ Real-time user behavior insights? → Amplitude + Sentry

Budget considerations:
├─ <$50/month: Firebase Analytics + Crashlytics
├─ $50-500/month: Sentry Team + basic product analytics
└─ $500+/month: Full stack (Sentry + Mixpanel/Amplitude)
```

### Sample Rate Tuning

```
Production traffic volume:
├─ <1K daily sessions:
│   ├─ Crash sampling: 100%
│   ├─ Transaction tracing: 50%
│   └─ Session replay: 25%
│
├─ 1K-10K daily sessions:
│   ├─ Crash sampling: 100%
│   ├─ Transaction tracing: 20%
│   └─ Session replay: 10%
│
└─ >10K daily sessions:
    ├─ Crash sampling: 100% (never sample crashes)
    ├─ Transaction tracing: 5-10%
    └─ Session replay: 1-5%

Cost optimization triggers:
├─ Monthly bill >$200 → Reduce transaction sampling by 50%
├─ Storage quota exceeded → Lower session replay rate
└─ Performance impact detected → Disable replay in low-memory scenarios
```

### Error Volume Handling

```
Incoming crash rate assessment:
├─ <0.1% of sessions → Normal monitoring, weekly review
├─ 0.1-1% of sessions → Daily triage, investigate top 3 crashes
├─ 1-5% of sessions → Emergency mode: stop releases, hotfix priority
└─ >5% of sessions → App store removal risk, immediate rollback

Symbolication status check:
├─ Symbolicated within 5 minutes → Continue normal flow
├─ Pending 5-30 minutes → Check CI upload job status
└─ Missing after 30 minutes → Manual dSYM/mapping upload required
```

## Failure Modes

### 1. "Symbol Upload Amnesia"
**Detection:** Stack traces show memory addresses (0x1a2b3c4d) instead of function names
**Diagnosis:** dSYM/ProGuard mapping upload failed or incomplete
**Fix:** 
- Check CI upload job logs for failures
- Manually upload: `sentry-cli upload-dif --org X --project Y ./dSYMs/`
- Verify upload: `sentry-cli releases files <version> list`

### 2. "PII Leak Catastrophe" 
**Detection:** Analytics events contain email addresses, phone numbers, or names in Sentry dashboard
**Diagnosis:** Missing or broken data scrubbing rules
**Fix:**
- Implement `beforeSend` hook to strip sensitive fields
- Add server-side data scrubbing rules in Sentry settings
- Audit recent events and purge PII data

### 3. "Development Data Pollution"
**Detection:** Sentry shows crashes from simulator/emulator or local dev builds
**Diagnosis:** Analytics initialized in development environment
**Fix:**
- Gate initialization: `if (!__DEV__) Sentry.init(...)`
- Use separate dev DSN or disable entirely
- Filter development events in dashboard

### 4. "Crash Rate Blindness"
**Detection:** No alerts triggered despite user complaints about app crashes
**Diagnosis:** Missing crash-free rate monitoring or misconfigured thresholds
**Fix:**
- Set up Sentry alert rule: crash-free rate drops below 99.5%
- Configure daily/weekly crash summary reports
- Add crash-free rate to primary dashboard

### 5. "Sample Rate Death Spiral"
**Detection:** Analytics bill spikes unexpectedly or performance degrades
**Diagnosis:** Sample rates too high for actual traffic volume
**Fix:**
- Reduce transaction sampling to 10% of current rate
- Lower session replay to 5% or disable temporarily
- Implement dynamic sampling based on user tier/feature flags

## Worked Examples

### Example 1: High Crash Volume Response (iOS Production App)

**Scenario:** iOS app crash-free rate drops from 99.6% to 97.2% over 24 hours

**Step 1 - Rapid Assessment:**
```
Check Sentry dashboard:
- 847 new crashes in last 24h (was 45 average)
- Top crash: EXC_BAD_ACCESS in PaymentViewController
- Affected: iOS 17.1+ users (67% of crash volume)
- Release: v2.1.4 (deployed 18 hours ago)
```

**Step 2 - Decision Tree Navigation:**
- Crash rate >1% → Emergency mode activated
- Symbolicated traces available → Continue investigation  
- Single method concentrated (PaymentViewController) → Code change likely cause

**Step 3 - Root Cause Analysis:**
```
Stack trace shows:
PaymentViewController.processPayment()
  └─ crashes on line 142: cardNumber.formatWithSpaces()
  
Git blame reveals: v2.1.4 added cardNumber nil check removal
"Optimization" introduced force unwrapping
```

**Step 4 - Immediate Actions:**
- Rollback v2.1.4 to v2.1.3 via App Store Connect
- Hotfix branch created with proper nil checking
- Alert stakeholders: "Payment crashes resolved, hotfix deploying in 2 hours"

**Expert vs. Novice:**
- **Novice:** Waits for crash reports to accumulate, manually investigates each crash
- **Expert:** Triggers emergency protocol at 1% threshold, immediately correlates with recent release

### Example 2: Symbolication Recovery Process

**Scenario:** React Native Android app showing obfuscated crash traces after R8 enabled

**Problem Detection:**
```
Sentry crash report shows:
com.example.a.b.c.a() (Unknown Source)
com.example.d.e.f.b() (Unknown Source)
Instead of readable class/method names
```

**Decision Process:**
- Symbolicated? NO → Check mapping upload
- R8 enabled recently? YES → ProGuard mapping issue
- CI job status? FAILED → Manual upload required

**Recovery Steps:**
```bash
# 1. Locate mapping file in build artifacts
find ./android/app/build -name "mapping.txt"

# 2. Upload mapping for specific release
sentry-cli upload-proguard \
  --org mycompany \
  --project mobile-app \
  --release 2.1.5 \
  ./android/app/build/outputs/mapping/release/mapping.txt

# 3. Verify upload
sentry-cli releases files 2.1.5 list | grep mapping.txt

# 4. Reprocess existing crashes
sentry-cli issues reprocess --query "release:2.1.5"
```

**Prevention Setup:**
- Add CI step to auto-upload mapping files
- Monitor symbolication status in Sentry webhook
- Set up alert for unsymbolicated crashes >10 per hour

## Quality Gates

Analytics Implementation Validation:

- [ ] Crash reporting initializes before any user code execution
- [ ] dSYM upload automated in iOS CI pipeline with verification step  
- [ ] ProGuard/R8 mapping upload automated in Android CI with success check
- [ ] Source maps uploaded for React Native releases with version tagging
- [ ] PII scrubbing verified: no email/phone/name fields in last 100 events
- [ ] Crash-free rate monitoring configured with 99.5% threshold alert
- [ ] Development builds excluded from production analytics data
- [ ] Event taxonomy documented with object_action naming convention
- [ ] Session replay enabled for error sessions only (not all sessions)
- [ ] Sample rates configured appropriately for current traffic volume
- [ ] Legal compliance verified: user consent obtained before tracking
- [ ] Performance impact measured: <50ms startup overhead
- [ ] Symbolication tested: can resolve production crashes to source lines
- [ ] Dashboard access granted to relevant team members with proper permissions

## NOT-FOR Boundaries

**This skill handles:** Mobile app analytics, crash reporting, symbolication, session tracking, conversion funnels

**Delegate elsewhere:**
- **Server-side logging/monitoring** → Use `log-aggregation-architect`
- **Web application analytics** → Use `frontend-architect` 
- **A/B testing frameworks** → Use `environment-config-manager`
- **App store optimization (ASO)** → Use `app-store-submission-automator`
- **Backend API performance monitoring** → Use `logging-observability`
- **Database query analytics** → Use `database-architect`
- **Infrastructure cost optimization** → Use `cloud-cost-optimizer`

**Boundary cases:**
- Mobile backend services logging → Split: mobile events stay here, server logs go to `log-aggregation-architect`
- React Native web builds → If primarily mobile app, handle here; if web-focused, delegate to `frontend-architect`