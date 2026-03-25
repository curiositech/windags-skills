---
license: Apache-2.0
name: mobile-offline-sync-architect
description: "Mobile offline-first architecture with local databases, CRDT conflict resolution, and background sync. Activate on: offline sync, offline-first, local database, WatermelonDB, SQLite, CRDT, conflict resolution, background sync, mobile persistence. NOT for: server-side databases (use data-pipeline-engineer), web caching strategies (use pwa-architect), API design (use api-architect)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - offline
  - sync
  - sqlite
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: Offline sync is a core mobile architecture concern
  - skill: data-pipeline-engineer
    reason: Server-side data pipeline must support sync protocols
---

# Mobile Offline-Sync Architect

Expert in building offline-first mobile applications with local databases, conflict resolution, and reliable background synchronization.

## Activation Triggers

**Activate on:** "offline sync", "offline-first app", "local database mobile", "WatermelonDB", "SQLite sync", "CRDT conflict resolution", "background sync", "mobile data persistence", "op-sqlite"

**NOT for:** Server databases → `data-pipeline-engineer` | Web caching → `pwa-architect` | API design → `api-architect`

## Quick Start

1. **Choose local database** — op-sqlite (performance), WatermelonDB (React Native lazy loading), or Realm (object-oriented)
2. **Design sync schema** — add `updated_at`, `deleted_at`, `sync_status` columns to all synced tables
3. **Implement conflict resolution** — last-write-wins for simple cases, CRDT for collaborative editing
4. **Build sync engine** — pull-push protocol with delta sync (only changed records)
5. **Add background sync** — React Native Background Fetch or WorkManager for periodic sync

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Local DB** | op-sqlite, WatermelonDB, Realm, expo-sqlite |
| **Sync Protocols** | Delta sync, CRDT (Yjs, Automerge), operational transform |
| **Conflict Resolution** | Last-write-wins, merge functions, CRDT automatic merge |
| **Background Sync** | react-native-background-fetch, expo-background-fetch |
| **Platforms** | PowerSync, ElectricSQL, Replicache, custom sync engines |

## Architecture Patterns

### Offline-First Sync Architecture

```
┌─────────────────────────────────┐
│         Mobile App              │
│  ┌──────────┐  ┌─────────────┐ │
│  │  UI Layer │──│ Sync Engine │ │
│  └──────────┘  └──────┬──────┘ │
│                       │         │
│  ┌────────────────────┴───────┐ │
│  │     Local SQLite DB        │ │
│  │  (source of truth offline) │ │
│  └────────────────────────────┘ │
└────────────────┬────────────────┘
                 │  Background sync
                 │  (when online)
                 ▼
┌────────────────────────────────┐
│         Server                 │
│  ┌──────────┐  ┌────────────┐ │
│  │  Sync API │──│  Server DB │ │
│  │  /sync    │  │ (Postgres) │ │
│  └──────────┘  └────────────┘ │
└────────────────────────────────┘

Pull: GET /sync?since=<timestamp> → changed records
Push: POST /sync { changes: [...] } → conflicts
```

### Delta Sync Protocol

```typescript
interface SyncRequest {
  lastSyncTimestamp: string;
  changes: ChangeSet[];   // Local changes since last sync
}

interface ChangeSet {
  table: string;
  created: Record[];
  updated: Record[];
  deleted: { id: string; deleted_at: string }[];
}

interface SyncResponse {
  serverTimestamp: string;
  changes: ChangeSet[];   // Server changes since client's lastSync
  conflicts: Conflict[];  // Records changed on both sides
}

// Conflict resolution strategy
function resolveConflict(local: Record, server: Record): Record {
  // Strategy 1: Last-write-wins (simple, data loss possible)
  return local.updated_at > server.updated_at ? local : server;

  // Strategy 2: Field-level merge (no data loss for non-conflicting fields)
  // return mergeFields(local, server, base);

  // Strategy 3: CRDT (automatic, no conflicts by design)
  // return crdtMerge(local, server);
}
```

### WatermelonDB Sync Implementation

```typescript
import { synchronize } from '@nozbe/watermelondb/sync';

async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await api.get('/sync', {
        params: { since: lastPulledAt },
      });
      return {
        changes: response.data.changes,
        timestamp: response.data.serverTimestamp,
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      await api.post('/sync', { changes, lastPulledAt });
    },
    migrationsEnabledAtVersion: 1,
  });
}
```

## Anti-Patterns

1. **Online-first with offline cache** — treating offline as an afterthought. Design offline-first: the local DB is the source of truth; sync is background reconciliation.
2. **Full table sync** — downloading entire tables on every sync. Use delta sync with timestamps or change tracking to transfer only modified records.
3. **Ignoring conflict resolution** — assuming conflicts will not happen. Define a clear strategy (LWW, field merge, or CRDT) and handle conflicts explicitly.
4. **Sync on main thread** — blocking the UI during synchronization. Run sync in a background thread or process with progress callbacks.
5. **No offline indicator** — users do not know when they are offline. Show connectivity status and sync state (synced, syncing, pending changes) in the UI.

## Quality Checklist

```
[ ] Local database chosen and configured (op-sqlite, WatermelonDB, Realm)
[ ] Sync schema includes updated_at, deleted_at, sync_status columns
[ ] Delta sync protocol implemented (not full-table)
[ ] Conflict resolution strategy defined and tested
[ ] Background sync configured (periodic + on-reconnect)
[ ] Offline indicator visible in UI
[ ] Pending local changes count displayed
[ ] Sync errors handled gracefully (retry with exponential backoff)
[ ] Data integrity: no data loss during conflict resolution
[ ] Large dataset performance tested (10K+ records)
[ ] Soft deletes used (deleted_at, not hard DELETE)
[ ] Sync works after app kill and restart
```
