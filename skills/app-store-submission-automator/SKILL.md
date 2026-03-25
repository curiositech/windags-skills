---
license: Apache-2.0
name: app-store-submission-automator
description: "App Store and Google Play submission automator with Fastlane, screenshot automation, metadata management, and TestFlight/internal testing. Activate on: app store submission, Fastlane, TestFlight, Google Play Console, screenshot automation, metadata management, app review, code signing, provisioning profiles. NOT for: CI/CD pipeline setup (use github-actions-pipeline-builder), app architecture (use react-native-architect), analytics (use mobile-analytics-crash-reporting-expert)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - app-store
  - fastlane
  - deployment
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: React Native apps are common Fastlane automation targets
  - skill: expo-workflow-expert
    reason: EAS Submit is the Expo-native alternative to Fastlane for store submission
---

# App Store Submission Automator

Expert in automating App Store and Google Play submissions with Fastlane, screenshot generation, metadata management, and review optimization.

## Decision Points

### When to Use Staged vs Full Rollout

```
IF first app version OR major feature changes:
  └── Use staged rollout: 10% → 50% → 100% over 7 days
      └── Monitor crash rates and user feedback at each stage
ELSE IF hotfix or minor update:
  └── IF critical security fix:
      └── Full rollout immediately
  ELSE:
      └── Use 50% → 100% over 2-3 days
```

### Certificate Renewal Decision Matrix

| Scenario | Days Until Expiry | Action |
|----------|------------------|---------|
| Distribution cert | < 30 days | Run `fastlane match nuke distribution`, then regenerate |
| Development cert | < 30 days | Run `fastlane match nuke development` |
| Provisioning profile | < 14 days | Run `match` with `force_for_new_devices: true` |
| Push cert | < 30 days | Regenerate in Apple Developer Portal, update server |

### Submission Type Selection

```
IF internal testing needed:
  ├── iOS: Use TestFlight external groups (up to 10,000 testers)
  └── Android: Use internal track (up to 100 testers)
ELSE IF public beta:
  ├── iOS: Use TestFlight public link
  └── Android: Use closed track with opt-in URL
ELSE IF production ready:
  ├── Check if all store requirements met (see Quality Gates)
  └── Use production/release track
```

## Failure Modes

**Match Credential Mismatch**
- *Symptom:* "No certificate found" or "Profile doesn't match certificate"
- *Diagnosis:* Git repo out of sync or team member generated certs manually
- *Fix:* Run `fastlane match nuke`, regenerate all certificates, commit to match repo

**App Review Rejection - Missing Info**
- *Symptom:* "We need additional information to review your app"
- *Diagnosis:* Missing demo credentials, contact info, or review notes
- *Fix:* Add demo_user.txt, demo_password.txt, and detailed notes.txt in fastlane/metadata/review_information/

**Build Timeout on Large Apps**
- *Symptom:* Fastlane times out during `build_app` step
- *Diagnosis:* App size > 2GB or complex build process
- *Fix:* Add `build_timeout: 7200` to build_app action, enable incremental builds

**Screenshot Generation Fails**
- *Symptom:* snapshot/screengrab produces blank or incorrect screenshots
- *Diagnosis:* UI tests not waiting for animations or using wrong simulators
- *Fix:* Add explicit waits in UI tests, verify simulator names match Snapfile device list

**Metadata Character Limit Exceeded**
- *Symptom:* Upload fails with "Description too long" error
- *Diagnosis:* Localized metadata exceeds platform limits (App Store: 4000 chars, Play Store: 4000 chars)
- *Fix:* Run `fastlane precheck` before submission, trim descriptions to platform limits

## Worked Example

**Scenario:** Setting up automated submission for a React Native app with iOS and Android targets

**Initial Assessment:**
- App has existing manual submission process
- Team of 4 developers needs shared code signing
- Requirement for staged rollouts and screenshot automation

**Step 1: Setup Decision**
```bash
# In project root
fastlane init
# Choose option 4 (Manual setup)
```

**Decision Point Hit:** Certificate management strategy
- **Novice choice:** Use Xcode automatic signing (fails in CI)
- **Expert choice:** Setup match for team-wide certificate sharing

**Step 2: Configure Match**
```ruby
# fastlane/Matchfile
git_url("https://github.com/company/certificates")
storage_mode("git")
type("appstore") # Also supports: development, adhoc
```

**Step 3: Create Lanes (Key Decision: Beta vs Production)**
```ruby
# fastlane/Fastfile
desc "TestFlight submission with build number increment"
lane :beta do
  setup_ci if ENV['CI']
  match(type: "appstore", readonly: true)
  
  # Decision: Always increment build, version only for releases
  increment_build_number(build_number: ENV['BUILD_NUMBER'])
  
  build_app(workspace: "ios/MyApp.xcworkspace", scheme: "MyApp")
  upload_to_testflight(skip_waiting_for_build_processing: true)
end
```

**Expert Insight:** Always use `skip_waiting_for_build_processing: true` in CI to avoid timeouts

**Step 4: Validation Before First Run**
- Run `fastlane precheck` to validate metadata
- Test on single device before full screenshot automation
- Verify CI environment has correct Xcode version

**Result:** Automated pipeline reducing submission time from 45 minutes to 8 minutes

## Quality Gates

Pre-submission checklist that must pass before running production lanes:

- [ ] `fastlane precheck` passes without warnings
- [ ] All required metadata files exist in fastlane/metadata/[locale]/
- [ ] Screenshots generated for all required device sizes (iPhone 6.9", 6.3", iPad 13")
- [ ] Version number incremented from previous release
- [ ] Build number is unique and higher than TestFlight latest
- [ ] Code signing certificates valid for >30 days
- [ ] Demo credentials provided in review_information/ (if app requires login)
- [ ] Staged rollout percentage configured (recommend starting at 10%)
- [ ] CI environment variables set: FASTLANE_USER, MATCH_PASSWORD, FASTLANE_SESSION
- [ ] All localizations complete for target markets
- [ ] App Icon and required assets present in correct formats

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **CI/CD Pipeline Setup** → Use `github-actions-pipeline-builder` instead
  - This skill assumes CI exists; doesn't create workflows/pipelines
  
- **App Architecture Decisions** → Use `react-native-architect` instead  
  - This skill handles deployment, not code structure or navigation

- **Analytics and Crash Reporting** → Use `mobile-analytics-crash-reporting-expert` instead
  - This skill focuses on store submission, not post-release monitoring

- **App Store Optimization (ASO)** → Use dedicated ASO specialist
  - This skill handles technical submission, not keyword optimization or conversion

- **Backend API Development** → Use `api-architect` instead
  - This skill assumes your app backend is ready for production

**When to delegate:**
- For build configuration issues → `react-native-architect`
- For CI/CD setup from scratch → `github-actions-pipeline-builder`  
- For app performance monitoring → `mobile-analytics-crash-reporting-expert`