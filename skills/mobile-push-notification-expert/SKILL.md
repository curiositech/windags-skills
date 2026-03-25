---
license: Apache-2.0
name: mobile-push-notification-expert
description: "Mobile push notification expert for FCM, APNs, deep linking, rich notifications, and notification channels. Activate on: push notifications, FCM setup, APNs configuration, notification channels, deep link from notification, rich notification, notification permissions, silent push. NOT for: in-app messaging (use react-native-architect), email notifications (use devops-automator), SMS (use api-architect)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - push-notifications
  - fcm
  - apns
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: Notifications are a core mobile feature requiring native integration
  - skill: mobile-deep-linking-specialist
    reason: Notifications often deep link into specific app screens
---

# Mobile Push Notification Expert

Expert in implementing push notifications across iOS and Android with FCM, APNs, rich content, and deep linking.

## Activation Triggers

**Activate on:** "push notifications", "FCM setup", "APNs configuration", "notification channels", "deep link notification", "rich notification", "notification permissions", "silent push", "notification grouping"

**NOT for:** In-app messaging → `react-native-architect` | Email notifications → `devops-automator` | SMS → `api-architect`

## Quick Start

1. **Configure platform credentials** — APNs key (iOS) and FCM server key (Android)
2. **Install notification library** — `@react-native-firebase/messaging` or `expo-notifications`
3. **Request permissions** — iOS requires explicit permission; Android 13+ requires POST_NOTIFICATIONS
4. **Register device token** — send token to backend on registration and refresh
5. **Handle notification tap** — deep link to the relevant screen based on notification data

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Services** | Firebase Cloud Messaging (FCM v1 API), APNs, Amazon SNS |
| **Libraries** | @react-native-firebase/messaging, expo-notifications, Notifee |
| **Rich Content** | Images, action buttons, custom sounds, notification extensions |
| **Channels** | Android notification channels, iOS categories, grouping |
| **Backend** | FCM v1 HTTP API, APNs HTTP/2, OneSignal, Knock |

## Architecture Patterns

### Notification Handling Flow

```
Backend sends push
  │
  ├─ App in FOREGROUND:
  │   ├─ onMessage handler fires
  │   ├─ Show in-app toast/banner (NOT system notification)
  │   └─ Update badge count
  │
  ├─ App in BACKGROUND:
  │   ├─ System shows notification
  │   ├─ onNotificationOpenedApp fires on tap
  │   └─ Navigate to deep link target
  │
  └─ App KILLED:
      ├─ System shows notification
      ├─ getInitialNotification on cold start
      └─ Navigate after app initialization
```

### FCM v1 API Payload Structure

```typescript
// Server-side: send notification via FCM v1 HTTP API
const message = {
  token: deviceToken,
  notification: {
    title: 'New Order #1234',
    body: 'Your order has been confirmed',
    image: 'https://cdn.example.com/order-confirmed.png',
  },
  data: {
    type: 'order_update',
    orderId: '1234',
    deepLink: 'myapp://orders/1234',
  },
  android: {
    priority: 'high',
    notification: {
      channelId: 'orders',
      clickAction: 'OPEN_ORDER',
      color: '#4A90D9',
    },
  },
  apns: {
    payload: {
      aps: {
        sound: 'order_confirmed.wav',
        badge: 1,
        'mutable-content': 1,     // Enable Notification Service Extension
        'thread-id': 'orders',    // Group notifications
      },
    },
  },
};
```

### Android Notification Channels

```typescript
import notifee, { AndroidImportance } from '@notifee/react-native';

// Create channels on app start (Android 8+)
async function createNotificationChannels() {
  await notifee.createChannelGroup({ id: 'general', name: 'General' });

  await notifee.createChannel({
    id: 'orders',
    name: 'Order Updates',
    groupId: 'general',
    importance: AndroidImportance.HIGH,
    sound: 'order_notification',
    vibration: true,
    lights: true,
    lightColor: '#4A90D9',
  });

  await notifee.createChannel({
    id: 'messages',
    name: 'Messages',
    groupId: 'general',
    importance: AndroidImportance.HIGH,
    sound: 'message_notification',
  });

  await notifee.createChannel({
    id: 'promotions',
    name: 'Promotions',
    groupId: 'general',
    importance: AndroidImportance.LOW,  // Users can customize
  });
}
```

## Anti-Patterns

1. **Sending notifications without permission** — Android 13+ requires runtime permission (`POST_NOTIFICATIONS`). Request it at a contextually appropriate moment, not on first launch.
2. **Data-only payloads for visible notifications** — data-only messages on iOS require background modes and do not show alerts. Use the `notification` field for visible content.
3. **Single notification channel** — all notifications at the same priority. Create separate channels (orders, messages, promotions) so users can customize per category.
4. **Not handling token refresh** — device tokens change on app reinstall, OS update, or token rotation. Listen for `onTokenRefresh` and update the backend.
5. **Ignoring notification grouping** — 10 individual notifications from the same app annoy users. Group by thread/topic on both iOS (`thread-id`) and Android (`group`).

## Quality Checklist

```
[ ] APNs key and FCM credentials configured
[ ] Permission requested at contextual moment (not first launch)
[ ] Device token registered and refresh handled
[ ] Foreground, background, and killed states all handled
[ ] Deep link navigation from notification tap
[ ] Android notification channels created per category
[ ] Rich notifications with images and action buttons
[ ] Notification grouping by topic/thread
[ ] Silent push for background data refresh
[ ] Badge count management (increment/clear)
[ ] Notification analytics tracked (delivered, opened, dismissed)
[ ] Token cleanup for uninstalled apps (periodic prune)
```
