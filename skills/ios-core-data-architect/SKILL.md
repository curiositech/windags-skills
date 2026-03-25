---
license: Apache-2.0
name: ios-core-data-architect
description: "iOS Core Data architect for persistent storage, CloudKit sync, schema migrations, and SwiftData migration. Activate on: Core Data, NSManagedObject, CloudKit sync, Core Data migration, NSFetchedResultsController, NSPersistentContainer, SwiftData migration path. NOT for: SwiftUI state management (use swiftui-data-flow-expert), server databases (use data-pipeline-engineer), SQLite direct (use mobile-offline-sync-architect)."
allowed-tools: Read,Write,Edit,Bash(swift:*,xcodebuild:*)
category: Mobile Development
tags:
  - core-data
  - ios
  - cloudkit
  - persistence
pairs-with:
  - skill: swiftui-data-flow-expert
    reason: SwiftUI views consume Core Data/SwiftData models
  - skill: mobile-offline-sync-architect
    reason: Core Data + CloudKit is an offline sync solution
---

# iOS Core Data Architect

Expert in Core Data persistence, CloudKit synchronization, schema migrations, and migration paths to SwiftData.

## Activation Triggers

**Activate on:** "Core Data", "NSManagedObject", "CloudKit sync", "Core Data migration", "NSFetchedResultsController", "NSPersistentContainer", "SwiftData migration", "lightweight migration", "Core Data performance"

**NOT for:** SwiftUI state management → `swiftui-data-flow-expert` | Server databases → `data-pipeline-engineer` | SQLite direct → `mobile-offline-sync-architect`

## Quick Start

1. **Assess project state** — new project? Use SwiftData. Existing Core Data? Evaluate migration vs coexistence.
2. **Design data model** — entities, relationships, fetch indexes in the .xcdatamodeld editor
3. **Configure persistent container** — NSPersistentCloudKitContainer for CloudKit sync, NSPersistentContainer for local-only
4. **Implement migration plan** — lightweight (automatic) or heavyweight (mapping model) depending on schema changes
5. **Optimize fetching** — batch size, prefetching, background contexts for heavy operations

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Persistence** | NSPersistentContainer, NSManagedObjectContext, WAL mode |
| **CloudKit** | NSPersistentCloudKitContainer, CKRecord zone, conflict resolution |
| **Migrations** | Lightweight migration, mapping models, progressive migration |
| **Performance** | NSBatchInsertRequest, NSBatchDeleteRequest, faulting, prefetch |
| **SwiftData** | Coexistence with Core Data, migration path, @Model from NSManagedObject |

## Architecture Patterns

### Core Data Stack Setup with CloudKit

```swift
class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentCloudKitContainer

    init(inMemory: Bool = false) {
        container = NSPersistentCloudKitContainer(name: "MyApp")

        guard let description = container.persistentStoreDescriptions.first else {
            fatalError("No store description")
        }

        if inMemory {
            description.url = URL(fileURLWithPath: "/dev/null")
        }

        // CloudKit configuration
        description.cloudKitContainerOptions = NSPersistentCloudKitContainerOptions(
            containerIdentifier: "iCloud.com.example.myapp"
        )

        // Enable remote change notifications
        description.setOption(true as NSNumber,
            forKey: NSPersistentStoreRemoteChangeNotificationPostOptionKey)

        // Enable persistent history tracking
        description.setOption(true as NSNumber,
            forKey: NSPersistentHistoryTrackingKey)

        container.loadPersistentStores { _, error in
            if let error { fatalError("Store failed: \(error)") }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }

    // Background context for heavy operations
    func newBackgroundContext() -> NSManagedObjectContext {
        let context = container.newBackgroundContext()
        context.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
        return context
    }
}
```

### Progressive Migration Strategy

```
Version 1 → Version 2 (add optional column):
  └─ Lightweight migration (automatic)

Version 2 → Version 3 (rename attribute):
  └─ Mapping model required (heavyweight)

Version 3 → Version 4 (split entity):
  └─ Custom migration with NSEntityMigrationPolicy

Strategy: Progressive migration chain
  v1 → v2 → v3 → v4 (each step is a known migration)
  NOT: v1 → v4 directly (complex, error-prone)

Code:
  for migration in migrationChain {
    try coordinator.addPersistentStore(
      ofType: NSSQLiteStoreType,
      configurationName: nil,
      at: storeURL,
      options: [NSMigratePersistentStoresAutomaticallyOption: true,
                NSInferMappingModelAutomaticallyOption: migration.isLightweight]
    )
  }
```

### SwiftData Coexistence (Migration Path)

```swift
// Phase 1: Core Data and SwiftData side-by-side
// Share the same SQLite store file
let schema = Schema([NewEntity.self])   // SwiftData models
let config = ModelConfiguration(
    url: existingCoreDataStoreURL       // Same store as Core Data
)
let container = try ModelContainer(for: schema, configurations: [config])

// Phase 2: Gradually move entities from Core Data to SwiftData
// - New entities: @Model (SwiftData)
// - Existing entities: NSManagedObject (Core Data)
// - Read from both, write to SwiftData for new data

// Phase 3: Full migration
// - Convert all NSManagedObject subclasses to @Model
// - Remove .xcdatamodeld file
// - Use ModelContainer exclusively
```

## Anti-Patterns

1. **Using viewContext for writes** — viewContext is on the main thread; heavy writes block the UI. Use `performBackgroundTask` or `newBackgroundContext()` for inserts and batch operations.
2. **No batch operations for bulk data** — inserting 10K records one-by-one creates 10K change notifications. Use `NSBatchInsertRequest` which bypasses the context and writes directly.
3. **Ignoring faulting** — accessing all properties of all objects in a list. Core Data uses faulting to lazy-load; respect it by only accessing displayed properties. Set `fetchBatchSize`.
4. **Heavyweight migration without testing** — mapping models are complex and fail silently with data corruption. Test every migration path against real production data copies.
5. **Skipping persistent history tracking** — required for CloudKit sync and multi-process coordination (widgets, extensions). Always enable `NSPersistentHistoryTrackingKey`.

## Quality Checklist

```
[ ] Persistent container configured correctly (CloudKit or local)
[ ] viewContext used only for reads; background context for writes
[ ] NSBatchInsertRequest used for bulk operations
[ ] Fetch requests have fetchBatchSize set (typically 20-50)
[ ] Migration plan documented for each model version
[ ] Lightweight migration tested between all adjacent versions
[ ] CloudKit sync tested (if applicable) with conflict resolution
[ ] Persistent history tracking enabled
[ ] NSFetchedResultsController used for table/list data sources
[ ] Background context mergePolicy set explicitly
[ ] Unit tests use in-memory store for speed
[ ] SwiftData migration path documented for future transition
```
