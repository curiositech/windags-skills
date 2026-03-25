---
license: Apache-2.0
name: react-server-components-expert
description: "Next.js App Router RSC architecture, Server Actions, streaming SSR, and partial hydration. Activate on: 'use server', 'use client', server components, App Router, streaming, partial hydration, Server Actions. NOT for: Pages Router (use nextjs-pages-router), client-only SPAs (use react-performance-optimizer), API routes without UI (use api-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - react
  - next-js
  - server-components
  - streaming
  - app-router
pairs-with:
  - skill: react-performance-optimizer
    reason: RSC reduces client bundle but perf tuning still needed for interactive islands
  - skill: data-fetching-strategist
    reason: Server Components change data fetching patterns fundamentally
---

# React Server Components Expert

Architect Next.js App Router applications with Server Components, Server Actions, streaming SSR, and minimal client JavaScript.

## Activation Triggers

**Activate on**: `'use server'`, `'use client'` boundary decisions, App Router migration, streaming SSR, Server Actions for mutations, partial hydration strategy, RSC payload optimization.

**NOT for**: Next.js Pages Router (`getServerSideProps`/`getStaticProps`) -- use nextjs-pages-router. Client-only React SPAs -- use react-performance-optimizer. Pure API endpoints -- use api-architect.

## Quick Start

1. **Audit component tree** -- identify which components need interactivity (`'use client'`) vs. pure render (default Server Component).
2. **Push `'use client'` boundaries down** -- keep them as leaf nodes, never at layout level.
3. **Colocate data fetching** -- fetch directly in Server Components with `async/await`, no useEffect.
4. **Define Server Actions** -- `'use server'` functions for mutations, form submissions, revalidation.
5. **Enable streaming** -- use `loading.tsx` and `<Suspense>` for progressive page rendering.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Server Components | Next.js 14+, React 19 RSC | Zero-bundle server render, async components |
| Server Actions | `'use server'` functions | Form mutations, `revalidatePath`, `revalidateTag` |
| Streaming SSR | `<Suspense>`, `loading.tsx` | Progressive rendering, skeleton fallbacks |
| Partial Hydration | `'use client'` boundaries | Interactive islands in server-rendered pages |
| Caching | `fetch()` with `next.revalidate`, `unstable_cache` | ISR, on-demand revalidation, tag-based cache |
| Metadata | `generateMetadata()`, `generateStaticParams()` | Dynamic SEO, static path generation |

## Architecture Patterns

### Pattern 1: Client Boundary Placement

Push `'use client'` to the smallest interactive leaf. Never mark layouts or pages as client components.

```
app/
  layout.tsx          ← Server Component (shared shell, nav, metadata)
  page.tsx            ← Server Component (async data fetch)
  components/
    ProductGrid.tsx   ← Server Component (renders list)
    AddToCartBtn.tsx  ← 'use client' (onClick handler)
    SearchFilter.tsx  ← 'use client' (controlled input state)
    ProductCard.tsx   ← Server Component (static render)
```

```
                  ┌─ layout.tsx (SERVER) ────────────────────┐
                  │  ┌─ page.tsx (SERVER) ──────────────────┐│
                  │  │  ┌─ ProductGrid (SERVER) ──────────┐ ││
                  │  │  │  ProductCard (SERVER)            │ ││
                  │  │  │  AddToCartBtn (CLIENT) ← leaf   │ ││
                  │  │  └─────────────────────────────────┘ ││
                  │  │  SearchFilter (CLIENT) ← leaf        ││
                  │  └──────────────────────────────────────┘│
                  └──────────────────────────────────────────┘
```

### Pattern 2: Server Actions for Mutations

Replace API routes with colocated Server Actions for type-safe mutations.

```typescript
// app/products/[id]/page.tsx (Server Component)
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

async function addReview(formData: FormData) {
  'use server';
  const rating = Number(formData.get('rating'));
  const comment = String(formData.get('comment'));

  await db.review.create({ data: { rating, comment, productId } });
  revalidatePath(`/products/${productId}`);
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  return (
    <div>
      <h1>{product.name}</h1>
      <form action={addReview}>
        <input name="rating" type="number" min={1} max={5} />
        <textarea name="comment" />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
```

### Pattern 3: Streaming with Suspense Boundaries

Wrap slow data fetches in `<Suspense>` so the shell renders instantly.

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from './RevenueChart';
import { RecentOrders } from './RecentOrders';
import { SkeletonChart, SkeletonTable } from '@/components/skeletons';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Suspense fallback={<SkeletonChart />}>
        <RevenueChart />  {/* async Server Component, fetches own data */}
      </Suspense>
      <Suspense fallback={<SkeletonTable />}>
        <RecentOrders />  {/* async Server Component, fetches own data */}
      </Suspense>
    </div>
  );
}
```

## Anti-Patterns

1. **Marking layouts as `'use client'`** -- forces entire subtree to be client-rendered, destroying RSC benefits. Move interactive parts to child leaf components instead.
2. **Passing non-serializable props across the server/client boundary** -- functions, class instances, and Dates cannot cross the RSC wire. Pass primitives and plain objects; reconstruct on the client.
3. **Using `useEffect` for data fetching in Server Components** -- hooks do not exist in Server Components. Fetch with `async/await` at the component level.
4. **Over-fetching with a single Suspense boundary** -- one giant `<Suspense>` around the entire page defeats streaming. Use granular boundaries per data source.
5. **Ignoring cache revalidation** -- stale `fetch()` cache causes invisible bugs. Always set `next: { revalidate: N }` or use `revalidateTag`/`revalidatePath` after mutations.

## Quality Checklist

- [ ] No `'use client'` on layout or page files
- [ ] Interactive components are leaf nodes in the component tree
- [ ] All data fetching uses `async/await` in Server Components (no `useEffect`)
- [ ] Server Actions use `'use server'` directive and call `revalidatePath`/`revalidateTag`
- [ ] Each slow async component wrapped in its own `<Suspense>` with skeleton fallback
- [ ] `generateMetadata()` provides dynamic SEO for every page
- [ ] RSC payload size verified (no accidental large object serialization)
- [ ] Forms work with JavaScript disabled (progressive enhancement via Server Actions)
- [ ] `loading.tsx` exists for route segments with async data
- [ ] Bundle analyzer confirms client JS reduced vs. equivalent client-only app
