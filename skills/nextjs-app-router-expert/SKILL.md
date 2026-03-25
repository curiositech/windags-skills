---
license: Apache-2.0
name: nextjs-app-router-expert
version: 1.0.0
category: Frontend & UI
tags:
  - nextjs
  - react
  - app-router
  - rsc
  - server-components
  - full-stack
---

# Next.js App Router Expert

## Overview

Expert in Next.js 14/15 App Router architecture, React Server Components (RSC), Server Actions, and modern full-stack React development. Specializes in routing patterns, data fetching strategies, caching, streaming, and deployment optimization.

## Decision Points

### Route Pattern Selection
```
Is the UI requirement:
├── Simple nested layouts?
│   └── Use standard file-based routing (page.tsx, layout.tsx)
│       └── Check: Does each segment need its own loading/error states?
│           ├── Yes → Add loading.tsx/error.tsx per segment
│           └── No → Use parent boundaries only
├── Content that appears alongside main page?
│   └── Use parallel routes (@slot)
│       └── Check: Should content persist across navigation?
│           ├── Yes → Use default.tsx to maintain state
│           └── No → Let it unmount naturally
├── Modal/overlay that intercepts navigation?
│   └── Use intercepting routes (.)
│       └── Check: What's the fallback for direct access?
│           ├── Same content → Create both routes with shared component
│           └── Different UX → Create separate page implementations
└── Dynamic segments with complex patterns?
    └── Use catch-all routes ([...slug])
        └── Check: Are some segments optional?
            ├── Yes → Use [[...optional]] syntax
            └── No → Use [...required] syntax
```

### Data Fetching Strategy
```
What's the data freshness requirement:
├── Static at build time?
│   └── Use generateStaticParams() + fetch with force-cache
├── Fresh on every request?
│   └── Use fetch with no-store or dynamic functions
├── Cached with periodic updates?
│   └── Use fetch with revalidate: seconds
└── User-specific but cacheable?
    └── Use fetch with cache + cookies() to make dynamic
```

### Client/Server Component Boundary
```
Does the component need:
├── Browser APIs (localStorage, window)?
│   └── Use 'use client' at component level
├── Event handlers (onClick, onSubmit)?
│   └── Use 'use client' at component level
├── React hooks (useState, useEffect)?
│   └── Use 'use client' at component level
└── Only data fetching and rendering?
    └── Keep as Server Component
        └── Check: Do children need client features?
            ├── Yes → Pass server data as props to client children
            └── No → Keep entire tree as server components
```

## Failure Modes

### Hydration Mismatch Hell
**Symptoms**: Console errors "Text content did not match", layout shifts on page load
**Diagnosis**: Server-rendered HTML differs from client-rendered HTML
**Fix**: 
- Use suppressHydrationWarning for unavoidable mismatches (dates, random IDs)
- Move dynamic content to useEffect with loading states
- Use consistent data sources between server and client

### Client Boundary Creep
**Symptoms**: Large bundle sizes, slow initial page loads, excessive JavaScript
**Diagnosis**: 'use client' placed too high in component tree, pulling server logic to client
**Fix**:
- Move 'use client' to leaf components only
- Extract interactive parts into separate client components
- Pass server-computed data as props to client components

### Cache Invalidation Chaos
**Symptoms**: Stale data after mutations, users see outdated content
**Diagnosis**: Missing revalidatePath/revalidateTag after Server Actions
**Fix**:
- Add revalidatePath('/specific/path') after mutations
- Use tags with revalidateTag('posts') for related content
- Set appropriate cache headers for external APIs

### Waterfall Loading Paralysis
**Symptoms**: Slow page loads, sequential loading indicators, poor Core Web Vitals
**Diagnosis**: Sequential data fetching instead of parallel, no Suspense boundaries
**Fix**:
- Fetch data in parallel at component level, not in parent
- Wrap independent components in separate Suspense boundaries
- Use Promise.all() for related data that can load together

### Route Organization Nightmare
**Symptoms**: Confusing URLs, components in wrong places, hard to navigate codebase
**Diagnosis**: Mixing logical grouping with URL structure, missing route groups
**Fix**:
- Use (auth), (dashboard) route groups for organization without URL impact
- Colocate related components in route directories
- Use intercepting routes for modals, not separate modal directories

## Worked Examples

### E-commerce Product Page with Reviews
```typescript
// Decision: Product data is semi-static, reviews are dynamic
// Solution: ISR for product, streaming for reviews

// app/products/[id]/page.tsx
import { Suspense } from 'react';

// Static product data with 1-hour revalidation
async function getProduct(id: string) {
  const res = await fetch(`https://api.shop.com/products/${id}`, {
    next: { revalidate: 3600, tags: ['product'] }
  });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

// Dynamic reviews, always fresh
async function getReviews(id: string) {
  const res = await fetch(`https://api.shop.com/products/${id}/reviews`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Expert catches: Fetch product immediately, stream reviews
  // Novice misses: Would wait for all data before rendering
  
  const product = await getProduct(params.id);

  return (
    <main>
      <ProductDetails product={product} />
      <AddToCartForm productId={params.id} />
      
      {/* Stream reviews while showing product immediately */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection productId={params.id} />
      </Suspense>
    </main>
  );
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await getReviews(productId);
  return <Reviews data={reviews} />;
}

// Server Action for cart - expert includes optimistic update
async function addToCart(formData: FormData) {
  'use server';
  
  const productId = formData.get('productId') as string;
  // ... save to database
  
  revalidateTag('cart'); // Invalidate cart count
  redirect('/cart');
}
```

**Expert Decision Points Navigated**:
- Product data: Semi-static → ISR with 1-hour cache
- Reviews: Always fresh → no-store cache
- UX: Show product immediately → Suspense boundary around reviews
- Cart action: Needs cache invalidation → revalidateTag for cart count

## Quality Gates

- [ ] All async components are wrapped in Suspense or have loading.tsx
- [ ] Server Actions include revalidatePath/revalidateTag after mutations
- [ ] Client components use 'use client' at the lowest possible level
- [ ] Dynamic routes have proper error handling (try/catch, error.tsx)
- [ ] Metadata is generated for all public pages (SEO compliance)
- [ ] No hydration mismatches in browser console
- [ ] Bundle size stays under performance budget (check with @next/bundle-analyzer)
- [ ] All external data fetches have appropriate cache headers
- [ ] Form submissions work without JavaScript (progressive enhancement)
- [ ] Route groups are used for organization without affecting URLs

## NOT-FOR Boundaries

**Don't use this skill for**:
- Simple React SPA without SSR needs → Use `react-spa-development` instead
- Next.js Pages Router projects → Use `nextjs-pages-router` instead
- Complex state management across routes → Use `zustand-state-management` instead
- Real-time features requiring WebSockets → Use `websocket-integration` instead
- Complex authentication flows → Use `nextauth-integration` instead
- Database schema design → Use `postgresql-optimization` instead
- Advanced deployment configurations → Use `vercel-deployment` or `docker-deployment` instead

**Delegate to other skills when**:
- Performance optimization beyond Next.js → `react-performance-optimizer`
- Complex form validation → `react-hook-form-expert`
- Advanced TypeScript patterns → `typescript-advanced-patterns`