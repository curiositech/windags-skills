---
license: Apache-2.0
name: expo-workflow-expert
description: "Expo managed workflow expert for EAS Build, Submit, Update, config plugins, and custom dev clients. Activate on: Expo project, EAS Build, EAS Update, config plugin, expo-dev-client, Expo Router, Expo SDK 52, app.json configuration. NOT for: bare React Native (use react-native-architect), native module authoring (use react-native-architect), Flutter (use flutter-bloc-state-manager)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - expo
  - react-native
  - eas
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: Expo builds on React Native; this skill handles the Expo-specific layer
  - skill: app-store-submission-automator
    reason: EAS Submit handles store submission that this skill configures
---

# Expo Workflow Expert

Expert in the Expo managed workflow including EAS Build/Submit/Update, config plugins, custom dev clients, and Expo Router.

## Activation Triggers

**Activate on:** "Expo project", "EAS Build", "EAS Submit", "EAS Update", "config plugin", "expo-dev-client", "Expo Router", "Expo SDK 52", "app.json config", "expo prebuild"

**NOT for:** Bare React Native → `react-native-architect` | Native module authoring → `react-native-architect` | Flutter → `flutter-bloc-state-manager`

## Quick Start

1. **Create project** — `npx create-expo-app@latest my-app`
2. **Configure app.json** — set bundle IDs, versioning, splash screen, icons
3. **Set up EAS** — `npx eas init` and configure `eas.json` for build profiles
4. **Add Expo Router** — file-based routing with typed routes
5. **Create dev client** — `npx eas build --profile development` for custom native builds

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Build** | EAS Build, local builds (`npx expo run:ios/android`), prebuild |
| **Updates** | EAS Update (OTA), update groups, channels, rollbacks |
| **Submit** | EAS Submit to App Store Connect and Google Play Console |
| **Routing** | Expo Router 4, file-based routing, API routes, typed routes |
| **Config** | Config plugins, app.json/app.config.ts, Expo Modules API |

## Architecture Patterns

### EAS Build Profile Configuration

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "team@example.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "internal"
      }
    }
  }
}
```

### EAS Update Strategy (OTA Updates)

```
Production Channel:
  ├─ Branch: production
  ├─ Update: JS-only changes ship instantly (no binary rebuild)
  └─ Rollback: `eas update:rollback --channel production`

Preview Channel:
  ├─ Branch: staging
  ├─ Internal testers get latest changes
  └─ QA before promoting to production

Flow:
  Code change → Is it JS-only?
    ├─ YES → eas update --channel production --message "fix: ..."
    │        (Users get update in < 1 minute, no store review)
    └─ NO (native change) → eas build + eas submit
                            (Full store review cycle)
```

### Config Plugin for Native Customization

```typescript
// plugins/withCustomSplash.ts
import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withCustomSplash: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (modConfig) => {
    const mainApplication = modConfig.modResults.manifest.application?.[0];
    if (mainApplication) {
      // Add custom meta-data to AndroidManifest.xml
      mainApplication['meta-data'] = mainApplication['meta-data'] || [];
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'expo.modules.splashscreen.SplashScreenImageResizeMode',
          'android:value': 'contain',
        },
      });
    }
    return modConfig;
  });
};

export default withCustomSplash;

// app.config.ts — use the plugin
export default {
  plugins: [
    './plugins/withCustomSplash',
    ['expo-camera', { cameraPermission: 'Allow camera for scanning' }],
  ],
};
```

## Anti-Patterns

1. **Ejecting unnecessarily** — reaching for `expo eject` when a config plugin would suffice. Since Expo SDK 50+, the "managed vs bare" distinction is gone; use `npx expo prebuild` with config plugins.
2. **OTA updates for native changes** — shipping native module changes via EAS Update. Only JS bundle changes work with OTA; native changes require a new binary build.
3. **Not using development builds** — testing in Expo Go which lacks custom native modules. Create a development build (`expo-dev-client`) for full-fidelity testing.
4. **Hardcoded app.json** — static config when dynamic values are needed. Use `app.config.ts` for environment-specific bundle IDs, API URLs, and feature flags.
5. **Skipping update channels** — publishing all updates to one channel. Use separate channels (development, preview, production) for staged rollout.

## Quality Checklist

```
[ ] app.config.ts used (not static app.json) for dynamic configuration
[ ] EAS Build configured with development, preview, and production profiles
[ ] EAS Update channels match build profiles
[ ] Development build created (not relying on Expo Go)
[ ] Config plugins used for native customization (no manual native edits)
[ ] Expo Router with typed routes enabled
[ ] Auto-increment build numbers in production profile
[ ] EAS Submit configured for both App Store and Google Play
[ ] OTA updates tested with preview channel before production
[ ] Rollback procedure documented and tested
[ ] Bundle size monitored (expo-optimize for image compression)
[ ] Expo SDK on latest stable version
```
