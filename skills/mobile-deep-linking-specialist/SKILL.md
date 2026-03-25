---
license: Apache-2.0
name: mobile-deep-linking-specialist
description: "Mobile deep linking specialist for Universal Links, App Links, deferred deep links, and attribution. Activate on: deep linking, Universal Links, App Links, deferred deep link, app attribution, URL scheme, branch.io, dynamic links, app clip. NOT for: web routing (use frontend-architect), push notification handling (use mobile-push-notification-expert), API URL design (use api-architect)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - deep-linking
  - universal-links
  - attribution
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: Deep linking integrates with navigation and app architecture
  - skill: mobile-push-notification-expert
    reason: Notifications frequently use deep links to navigate users to specific content
---

# Mobile Deep Linking Specialist

Expert in implementing deep linking across iOS and Android with Universal Links, App Links, deferred deep links, and attribution tracking.

## Decision Points

### Attribution Service Selection
```
Input: App requirements and constraints
├─ Simple link tracking + basic install attribution?
│  └─ YES → Use Branch.io (quick setup, free tier)
│  └─ NO → Continue
├─ Enterprise with complex attribution models?
│  └─ YES → Use Adjust or AppsFlyer (advanced features)
│  └─ NO → Continue
├─ Privacy-first, minimal data collection?
│  └─ YES → Custom solution with SKAdNetwork only
│  └─ NO → Use Branch.io
```

### Deferred Deep Link Method
```
Target Platform Analysis:
├─ iOS 14+ with ATT restrictions?
│  ├─ HIGH privacy users → Clipboard method (user consent required)
│  └─ LOW privacy users → Fingerprint method (limited accuracy)
├─ Android with Play Install Referrer API?
│  └─ Use Play Install Referrer (most reliable)
├─ Cross-platform consistency needed?
│  └─ Use Branch.io or Adjust SDK (abstracts platform differences)
```

### Link Handling Strategy
```
App State When Link Clicked:
├─ App not installed?
│  ├─ Marketing campaign → Smart app banner + deferred deep link
│  └─ User sharing → Direct app store link with custom params
├─ App installed but closed?
│  ├─ Universal/App Link configured → Direct app open
│  └─ No Universal Links → Custom URL scheme with fallback
├─ App running in background?
│  └─ Use Linking.addEventListener for immediate navigation
```

## Failure Modes

### 1. "iOS 14+ Attribution Blackhole"
- **Symptoms:** Links work but attribution shows zero installs/conversions after iOS 14.5
- **Diagnosis:** SKAdNetwork not configured or ATT opt-out rate high
- **Fix:** Implement SKAdNetwork 5.0 + privacy-preserving attribution model

### 2. "Android Deep Link Lag"
- **Symptoms:** Links open app but navigation takes 3-5 seconds to complete
- **Diagnosis:** App Links verification failed, falling back to intent filters
- **Fix:** Verify Digital Asset Links file and package/signature match

### 3. "Deferred Link Timeout"
- **Symptoms:** First-install users don't get routed to intended content
- **Diagnosis:** Clipboard method stale or fingerprint match failed
- **Fix:** Switch to SDK-based solution (Branch/Adjust) or extend clipboard TTL

### 4. "Universal Link Bypass"
- **Symptoms:** Links open mobile Safari instead of app on iOS
- **Diagnosis:** AASA file cached incorrectly or user disabled Universal Links
- **Fix:** Validate AASA with Apple tools + provide manual "Open in App" button

### 5. "Cold Start Navigation Race"
- **Symptoms:** Deep links work when app running but fail on fresh app launch
- **Diagnosis:** Navigation container not ready when URL processed
- **Fix:** Queue deep link in state, process after NavigationContainer mount

## Worked Examples

### E-commerce App with Product Deep Links

**Scenario:** User receives SMS link to product, app not installed

1. **Link Analysis:** `https://shop.example.com/product/nike-air-max`
   - Expert notices: Uses domain (good for Universal Links)
   - Novice misses: No UTM parameters for attribution tracking

2. **Attribution Choice Decision:**
   ```
   Requirements: Track SMS campaign performance + deferred deep links
   Privacy constraints: Moderate (e-commerce, some user tolerance)
   → Decision: Branch.io (good SMS attribution + easy deferred setup)
   ```

3. **Implementation Trade-offs:**
   - **High Attribution Granularity:** Custom fingerprinting + server-side tracking
     - Pro: Detailed conversion funnel, cross-device tracking
     - Con: Privacy concerns, iOS 14+ limitations, complex setup
   - **Privacy-First Approach:** SKAdNetwork only with campaign-level attribution
     - Pro: Privacy compliant, Apple-approved
     - Con: Limited granularity, 24-48h delay
   - **Selected:** Branch.io with SKAdNetwork fallback
     - Balanced approach: good attribution when possible, privacy compliance

4. **Setup Walkthrough:**
   ```typescript
   // 1. AASA file includes Branch domains
   "applinks": {
     "details": [{
       "appIDs": ["TEAMID.com.shop.example"],
       "components": [
         { "/": "/product/*" },
         { "/": "https://shop.app.link/*" }  // Branch domain
       ]
     }]
   }
   
   // 2. Navigation config with deferred handling
   const linking = {
     prefixes: ['https://shop.example.com', 'https://shop.app.link'],
     config: { screens: { Product: 'product/:id' } },
     async getInitialURL() {
       const branchData = await branch.getFirstReferringParams();
       if (branchData?.'+clicked_branch_link') {
         return `https://shop.example.com${branchData.$deeplink_path}`;
       }
       return await Linking.getInitialURL();
     }
   };
   ```

5. **Expert Optimization:** Pre-load product data during app install to reduce perceived navigation delay

## Quality Gates

- [ ] Universal Links open app directly from Safari, Messages, Mail
- [ ] App Links verified with `adb shell am start -W -a android.intent.action.VIEW -d "https://example.com/test"`
- [ ] Deferred deep links work: uninstall app, click link, reinstall, verify routing
- [ ] Cold start navigation: force-close app, click link, verify content loads correctly
- [ ] AASA file validates at https://search.developer.apple.com/appsearch-validation-tool
- [ ] Attribution tracking shows test conversion within expected time window
- [ ] Fallback web page loads for non-installed users with clear app download CTA
- [ ] Link routing works from email clients (Gmail, Outlook), SMS, social apps
- [ ] Navigation state persists through app backgrounding/foregrounding cycles
- [ ] Error handling graceful for malformed or expired deep links

## NOT-FOR Boundaries

- **Web routing between pages** → Use `frontend-architect` for SPA routing
- **Push notification payload handling** → Use `mobile-push-notification-expert` for notification processing
- **API endpoint URL design** → Use `api-architect` for REST/GraphQL URL structure
- **App Store Connect configuration** → Use `mobile-app-store-expert` for app submission settings
- **OAuth/authentication flows** → Use `auth-specialist` for login redirect handling