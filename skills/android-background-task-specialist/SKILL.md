---
license: Apache-2.0
name: android-background-task-specialist
description: "Android background task specialist for WorkManager, Foreground Services, Doze mode, and battery optimization. Activate on: WorkManager, background task Android, Foreground Service, Doze mode, battery optimization, periodic work, background sync Android, JobScheduler. NOT for: iOS background tasks (use swiftui-data-flow-expert), React Native background (use mobile-offline-sync-architect), UI architecture (use jetpack-compose-navigation-expert)."
allowed-tools: Read,Write,Edit,Bash(gradle:*,adb:*)
category: Mobile Development
tags:
  - android
  - background-tasks
  - workmanager
  - battery
pairs-with:
  - skill: jetpack-compose-navigation-expert
    reason: ViewModels and UI layer coordinate with background task results
  - skill: mobile-offline-sync-architect
    reason: Background sync is a key offline-first pattern on Android
---

# Android Background Task Specialist

Expert in Android background execution with WorkManager, Foreground Services, Doze mode handling, and battery-efficient processing.

## Activation Triggers

**Activate on:** "WorkManager", "background task Android", "Foreground Service", "Doze mode", "battery optimization", "periodic work", "background sync", "JobScheduler", "background processing Android"

**NOT for:** iOS background tasks → `swiftui-data-flow-expert` | React Native background → `mobile-offline-sync-architect` | UI architecture → `jetpack-compose-navigation-expert`

## Quick Start

1. **Choose the right API** — WorkManager for deferrable work, Foreground Service for user-visible ongoing tasks, coroutines for short async work
2. **Define workers** — extend `CoroutineWorker` with suspend functions for clean async code
3. **Configure constraints** — network type, battery level, storage requirements
4. **Handle Doze and App Standby** — use WorkManager (not AlarmManager) for Doze-compatible scheduling
5. **Test with adb** — force Doze mode and verify work executes when constraints are met

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Deferrable Work** | WorkManager 2.10, OneTimeWorkRequest, PeriodicWorkRequest |
| **Foreground** | Foreground Service types (dataSync, location, mediaPlayback, shortService) |
| **Constraints** | NetworkType, BatteryNotLow, StorageNotLow, DeviceIdle |
| **Chaining** | WorkContinuation, parallel chains, unique work policies |
| **Testing** | TestWorkerBuilder, TestListenableWorkerBuilder, WorkManagerTestInitHelper |

## Architecture Patterns

### WorkManager Decision Tree

```
Is the task user-initiated and needs to complete?
  ├─ YES → Is it short (< 10 min)?
  │   ├─ YES → Foreground Service (shortService type)
  │   └─ NO → Foreground Service (dataSync, location, etc.)
  │
  └─ NO → Is it deferrable?
      ├─ YES → WorkManager
      │   ├─ One-time? → OneTimeWorkRequest
      │   └─ Periodic? → PeriodicWorkRequest (min 15 min interval)
      │
      └─ NO → Is it while app is visible?
          ├─ YES → CoroutineScope (viewModelScope or lifecycleScope)
          └─ NO → You probably need WorkManager anyway
```

### CoroutineWorker with Retry and Progress

```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val syncRepository: SyncRepository,
    private val notificationHelper: NotificationHelper,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        // Report progress for UI observation
        setProgress(workDataOf("progress" to 0))

        return try {
            val pendingItems = syncRepository.getPendingChanges()

            pendingItems.forEachIndexed { index, item ->
                syncRepository.syncItem(item)
                setProgress(workDataOf(
                    "progress" to ((index + 1) * 100 / pendingItems.size)
                ))
            }

            Result.success(workDataOf("synced" to pendingItems.size))
        } catch (e: IOException) {
            if (runAttemptCount < 3) {
                Result.retry()  // Exponential backoff by default
            } else {
                Result.failure(workDataOf("error" to e.message))
            }
        }
    }

    override suspend fun getForegroundInfo(): ForegroundInfo {
        return ForegroundInfo(
            NOTIFICATION_ID,
            notificationHelper.createSyncNotification()
        )
    }
}
```

### Scheduling with Constraints and Chaining

```kotlin
// Schedule periodic sync every 1 hour (minimum 15 min)
val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(1, TimeUnit.HOURS)
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .setRequiresBatteryNotLow(true)
            .build()
    )
    .setBackoffCriteria(
        BackoffPolicy.EXPONENTIAL,
        WorkRequest.MIN_BACKOFF_MILLIS,
        TimeUnit.MILLISECONDS
    )
    .addTag("sync")
    .build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "periodic-sync",
    ExistingPeriodicWorkPolicy.KEEP,  // Don't restart if already scheduled
    syncRequest
)

// Chain: download → process → upload (sequential)
WorkManager.getInstance(context)
    .beginWith(downloadWork)
    .then(processWork)
    .then(uploadWork)
    .enqueue()
```

## Anti-Patterns

1. **AlarmManager for deferrable work** — AlarmManager alarms are not Doze-compatible and drain battery. Use WorkManager which respects Doze, App Standby, and battery saver.
2. **Background Service without foreground notification** — Android 12+ kills background services. Use Foreground Service with proper type declaration or WorkManager.
3. **PeriodicWork under 15 minutes** — WorkManager enforces a minimum 15-minute interval. For more frequent work, use Foreground Service or coroutine with lifecycle awareness.
4. **Not declaring foreground service type** — Android 14+ requires explicit `foregroundServiceType` in manifest. Omitting it causes `SecurityException`.
5. **Ignoring work observation** — starting work but not showing progress to users. Observe `WorkInfo` via `getWorkInfoByIdLiveData()` or `getWorkInfoByIdFlow()` to update UI.

## Quality Checklist

```
[ ] WorkManager used for deferrable background tasks (not AlarmManager)
[ ] Foreground Service declared with correct type in AndroidManifest
[ ] Constraints configured (network, battery, storage)
[ ] Retry policy with backoff for transient failures
[ ] Unique work policy set for periodic/one-time work
[ ] Work progress observable from UI
[ ] Doze mode tested via adb: `adb shell dumpsys deviceidle force-idle`
[ ] Battery optimization tested: `adb shell am set-inactive <package> true`
[ ] Workers tested with TestWorkerBuilder
[ ] Notification channels created for foreground service notifications
[ ] Work chains handle partial failure gracefully
[ ] Background work respects user's battery saver preference
```
