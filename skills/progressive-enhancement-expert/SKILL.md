---
license: Apache-2.0
name: progressive-enhancement-expert
description: "Build offline-first web apps with Service Workers, Workbox, background sync, and progressive enhancement strategies. Activate on: offline support, service worker caching, background sync, app shell, cache strategies, precaching. NOT for: native app packaging (use tauri-expert), general PWA manifest/install (use pwa-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - service-workers
  - offline-first
  - workbox
  - background-sync
  - progressive-enhancement
pairs-with:
  - skill: pwa-expert
    reason: PWA expert handles manifest/install; this skill handles the offline/caching runtime
  - skill: data-fetching-strategist
    reason: Cache invalidation strategies must coordinate between SW cache and query cache
---

# Progressive Enhancement Expert

Build resilient, offline-capable web applications using Service Workers, Workbox, background sync, and progressive enhancement -- apps that work without JavaScript and improve with it.

## Activation Triggers

**Activate on**: offline-first architecture, service worker caching strategies, Workbox configuration, background sync for queued mutations, app shell pattern, cache-first vs. network-first decisions, precaching static assets.

**NOT for**: native desktop/mobile packaging -- use tauri-expert or React Native skills. PWA manifest, install prompts, and display modes -- use pwa-expert. General client-side caching with React Query -- use data-fetching-strategist.

## Quick Start

1. **Choose your approach** -- Workbox (recommended for production) or hand-written Service Worker (for learning/control).
2. **Implement the app shell** -- cache the HTML shell, CSS, and JS so the app loads instantly offline.
3. **Define cache strategies** -- precache static assets (build output), runtime cache API responses with stale-while-revalidate.
4. **Handle offline mutations** -- queue form submissions and API writes with Background Sync.
5. **Show connectivity status** -- inform users when they are offline and when queued actions sync.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Service Worker Toolkit | Workbox 7+, `workbox-webpack-plugin`, `@serwist/next` | Precaching, runtime caching, routing |
| Caching Strategies | CacheFirst, NetworkFirst, StaleWhileRevalidate | Per-route/resource strategy selection |
| Background Sync | Workbox Background Sync, `SyncManager` API | Queue failed requests, replay on reconnect |
| App Shell | Precached HTML/CSS/JS, navigation preload | Instant load, offline-capable shell |
| Offline UI | `navigator.onLine`, `online`/`offline` events | Connectivity banners, offline indicators |
| Progressive Forms | HTML forms with Server Actions, JS enhancement | Works without JS, enhanced with JS |

## Architecture Patterns

### Pattern 1: Workbox Configuration with Serwist (Next.js)

```typescript
// next.config.ts
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
});

export default withSerwist({
  // ... rest of Next.js config
});
```

```typescript
// app/sw.ts
import { defaultCache } from '@serwist/next/worker';
import { Serwist } from 'serwist';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,  // auto-generated build manifest
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    // API responses: network-first with 24h cache fallback
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
        networkTimeoutSeconds: 3,  // fall back to cache after 3s
      },
    },
    // Images: cache-first (rarely change)
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 604800 }, // 7 days
      },
    },
  ],
});

serwist.addEventListeners();
```

### Pattern 2: Background Sync for Offline Mutations

```typescript
// sw.ts -- register background sync queue
import { BackgroundSyncPlugin } from 'workbox-background-sync';

const bgSyncPlugin = new BackgroundSyncPlugin('mutation-queue', {
  maxRetentionTime: 24 * 60,  // retry for up to 24 hours
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
      } catch (error) {
        await queue.unshiftRequest(entry); // put it back
        throw error; // triggers retry
      }
    }
  },
});

// Route POST/PUT/DELETE through the sync queue
registerRoute(
  ({ request }) => request.method !== 'GET' && request.url.includes('/api/'),
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
);
```

```typescript
// Client-side: queue-aware form submission
async function submitForm(data: FormData) {
  try {
    const res = await fetch('/api/submit', { method: 'POST', body: data });
    if (!res.ok) throw new Error('Submit failed');
    return { status: 'sent' };
  } catch {
    // Service Worker BackgroundSync will retry when online
    return { status: 'queued' };
  }
}
```

### Caching Strategy Decision Tree

```
  ┌─ What are you caching? ────────────────────────────┐
  │                                                     │
  │  Static build assets (JS/CSS bundles)?              │
  │  └─> Precache at install (immutable, hashed names)  │
  │                                                     │
  │  Images and fonts?                                  │
  │  └─> CacheFirst (rarely change, save bandwidth)     │
  │                                                     │
  │  API data (user content, listings)?                 │
  │  └─> StaleWhileRevalidate (show cached, update bg)  │
  │                                                     │
  │  Auth tokens, real-time data?                       │
  │  └─> NetworkOnly (never serve stale auth)           │
  │                                                     │
  │  HTML pages?                                        │
  │  └─> NetworkFirst with cache fallback               │
  │      (fresh content preferred, offline capable)      │
  └─────────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **Cache-first for API data** -- serves stale data indefinitely. Users see outdated content without realizing it. Use StaleWhileRevalidate or NetworkFirst for API responses.
2. **No cache versioning** -- old cached assets persist across deployments. Use hashed filenames for static assets and clear old caches in the `activate` event.
3. **Ignoring the offline fallback page** -- when NetworkFirst fails offline for an uncached page, users see the browser's offline dinosaur. Always precache an `/offline` fallback page.
4. **`skipWaiting()` without user notification** -- silently activating a new SW mid-session can break in-progress work if the API contract changed. Show an "Update available" toast and let users choose when to refresh.
5. **Queueing GET requests in BackgroundSync** -- Background Sync is for mutations (POST/PUT/DELETE). GET requests should use cache strategies, not sync queues.

## Quality Checklist

- [ ] App shell (HTML, CSS, critical JS) loads offline within 1 second
- [ ] Static assets precached with hashed filenames at SW install
- [ ] API responses cached with appropriate strategy (NetworkFirst or StaleWhileRevalidate)
- [ ] Offline fallback page precached and served when navigation fails
- [ ] POST/PUT/DELETE mutations queued via BackgroundSync when offline
- [ ] Connectivity status shown to user (`navigator.onLine` + event listeners)
- [ ] Queued mutation count shown when offline ("3 changes pending sync")
- [ ] New SW version notifies user with "Update available" toast
- [ ] Old caches cleaned up in `activate` event
- [ ] Forms work without JavaScript (progressive enhancement via `<form action>`)
- [ ] Cache storage size monitored (no unbounded growth)
