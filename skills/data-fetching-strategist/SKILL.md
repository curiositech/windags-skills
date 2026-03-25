---
license: Apache-2.0
name: data-fetching-strategist
description: "Architect data fetching with TanStack Query v5, SWR, optimistic updates, prefetching, and cache invalidation strategies. Activate on: React Query, SWR, optimistic updates, cache invalidation, prefetching, stale-while-revalidate, infinite queries. NOT for: REST API design (use api-architect), database queries (use database skills), GraphQL schema (use graphql-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Frontend & UI
tags:
  - tanstack-query
  - data-fetching
  - caching
  - optimistic-updates
  - prefetching
pairs-with:
  - skill: react-performance-optimizer
    reason: Smart caching and prefetching directly improve perceived performance
  - skill: react-server-components-expert
    reason: RSC changes data fetching patterns -- server fetch vs. client query decisions
---

# Data Fetching Strategist

## Decision Points

### 1. Library Selection: TanStack Query vs SWR vs Manual

```
Data Complexity?
├─ Simple GET requests, minimal caching needs
│  └─ Use SWR: lighter bundle, simpler API
├─ Complex mutations, optimistic updates, prefetching
│  └─ Use TanStack Query v5: full-featured
└─ Static data, build-time fetching
   └─ Use manual fetch in RSC/getStaticProps
```

### 2. Cache Strategy Configuration

```
Data Freshness Requirements?
├─ Real-time (user notifications, live chat)
│  ├─ staleTime: 0, refetchInterval: 5000
│  └─ Consider WebSocket instead
├─ Frequent updates (user profiles, dashboards)
│  └─ staleTime: 30000 (30s), gcTime: 300000 (5m)
├─ Occasional updates (product catalogs, articles)
│  └─ staleTime: 300000 (5m), gcTime: 600000 (10m)
└─ Static data (countries, categories)
   └─ staleTime: Infinity, gcTime: Infinity
```

### 3. Mutation Error Recovery

```
Mutation Failed?
├─ Network error (offline, timeout)
│  ├─ Show "offline" indicator
│  ├─ Queue mutation for retry when online
│  └─ Keep optimistic update visible
├─ Validation error (400, 422)
│  ├─ Rollback optimistic update immediately
│  ├─ Show field-level errors
│  └─ Focus first error field
├─ Authorization error (401, 403)
│  ├─ Rollback optimistic update
│  ├─ Clear auth tokens
│  └─ Redirect to login
└─ Server error (500, 503)
   ├─ Rollback optimistic update
   ├─ Show generic error message
   └─ Auto-retry up to 3 times
```

### 4. Query Key Design

```
Invalidation Scope Needed?
├─ Invalidate all related data (user updates profile)
│  └─ Hierarchical: ['users', userId, 'profile']
│     └─ Allows: invalidateQueries(['users', userId])
├─ Invalidate specific subset (filter changes)
│  └─ Include filters: ['products', 'list', { category, sort }]
│     └─ Allows: invalidateQueries(['products', 'list'])
└─ Never invalidate together
   └─ Separate top-level: ['analytics'], ['notifications']
```

### 5. Prefetching Triggers

```
Navigation Pattern?
├─ Mouse-driven (hover to preview)
│  └─ prefetchQuery on onMouseEnter + onFocus
├─ Swipe/touch interface
│  └─ prefetchQuery on visible list items (intersection observer)
├─ Predictable flow (multi-step form)
│  └─ prefetchQuery on current step completion
└─ Route-based preloading
   └─ prefetchQuery in route loader/middleware
```

## Failure Modes

### 1. Race Condition Chaos
**Symptoms**: UI shows wrong data after rapid clicks, mutations overwrite each other
**Detection**: User clicks fast → sees data flicker → final state doesn't match last action
**Fix**: 
```typescript
// Cancel in-flight queries before optimistic update
onMutate: async (variables) => {
  await queryClient.cancelQueries({ queryKey });
  const previous = queryClient.getQueryData(queryKey);
  queryClient.setQueryData(queryKey, optimisticUpdate);
  return { previous };
}
```

### 2. Stale Data Corruption
**Symptoms**: User sees old data mixed with new, inconsistent states across components
**Detection**: Related data shows different timestamps, user reports "data doesn't match"
**Fix**: Invalidate query hierarchies, not individual queries:
```typescript
// Wrong: only invalidates specific filter
invalidateQueries(['products', 'list', filters]);
// Right: invalidates all product lists
invalidateQueries(['products', 'list']);
```

### 3. Memory Leak Mountain
**Symptoms**: Browser memory grows continuously, tabs become unresponsive
**Detection**: DevTools shows growing query cache, gcTime set too high or Infinity everywhere
**Fix**: Configure appropriate garbage collection:
```typescript
gcTime: 5 * 60 * 1000,  // 5 minutes, not Infinity
```

### 4. Network Storm Syndrome  
**Symptoms**: Hundreds of identical requests, poor performance, API rate limits hit
**Detection**: Network tab shows duplicate requests, staleTime: 0 in all queries
**Fix**: Set appropriate staleness thresholds:
```typescript
staleTime: 30 * 1000,  // 30 seconds minimum
```

### 5. Optimistic Illusion
**Symptoms**: UI shows success but data never actually saved, users lose work
**Detection**: Optimistic update stays after page refresh, server never received mutation
**Fix**: Always implement rollback and settled states:
```typescript
onError: (error, variables, context) => {
  queryClient.setQueryData(queryKey, context.previous);
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey });
}
```

## Worked Example

**Scenario**: E-commerce product page with review system requiring optimistic updates and prefetching.

**Step 1**: Analyze requirements
- Product details: changes rarely (staleTime: 5m)  
- Reviews: moderate updates (staleTime: 30s)
- User actions: add review needs instant feedback

**Step 2**: Design query key hierarchy
```typescript
const queryKeys = {
  products: {
    all: ['products'],
    detail: (id: string) => ['products', 'detail', id],
    reviews: (productId: string) => ['products', productId, 'reviews'],
  }
};
```

**Step 3**: Configure queries with appropriate staleness
```typescript
// Product query - data changes infrequently  
const { data: product } = useQuery({
  queryKey: queryKeys.products.detail(productId),
  queryFn: () => fetchProduct(productId),
  staleTime: 5 * 60 * 1000,  // 5 minutes
});

// Reviews query - more dynamic
const { data: reviews } = useQuery({
  queryKey: queryKeys.products.reviews(productId),
  queryFn: () => fetchReviews(productId),
  staleTime: 30 * 1000,  // 30 seconds
});
```

**Step 4**: Implement optimistic review addition
```typescript
const addReviewMutation = useMutation({
  mutationFn: (review: NewReview) => 
    fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review)
    }),
  
  onMutate: async (newReview) => {
    await queryClient.cancelQueries({ 
      queryKey: queryKeys.products.reviews(productId) 
    });
    
    const previousReviews = queryClient.getQueryData(
      queryKeys.products.reviews(productId)
    );
    
    // Add optimistic review with pending ID
    const optimisticReview = {
      id: `temp-${Date.now()}`,
      ...newReview,
      createdAt: new Date().toISOString()
    };
    
    queryClient.setQueryData(
      queryKeys.products.reviews(productId), 
      (old: Review[]) => [optimisticReview, ...old]
    );
    
    return { previousReviews };
  },
  
  onError: (error, newReview, context) => {
    queryClient.setQueryData(
      queryKeys.products.reviews(productId),
      context.previousReviews
    );
  },
  
  onSettled: () => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.products.reviews(productId) 
    });
  }
});
```

**Step 5**: Add prefetching for related products
```typescript
const PrefetchLink = ({ productId, children }) => {
  const queryClient = useQueryClient();
  
  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(productId),
      queryFn: () => fetchProduct(productId),
      staleTime: 30_000,
    });
  };
  
  return (
    <Link 
      href={`/products/${productId}`}
      onMouseEnter={prefetchProduct}
      onFocus={prefetchProduct}
    >
      {children}
    </Link>
  );
};
```

**Expert catches vs Novice misses**:
- Expert: Cancels queries before optimistic update to prevent races
- Novice: Skips cancellation, gets data flickering
- Expert: Uses hierarchical query keys for granular invalidation  
- Novice: Flat keys require invalidating everything
- Expert: Sets different staleness per data type
- Novice: Uses default staleTime: 0, causes network storm

## Quality Gates

- [ ] QueryClient configured with appropriate default staleTime (>0)
- [ ] Query key factory exports hierarchical key structure  
- [ ] All mutations implement onMutate optimistic updates
- [ ] All mutations implement onError rollback with previous state
- [ ] All mutations implement onSettled for consistency refetch
- [ ] Prefetching configured on hover/focus for navigation links
- [ ] staleTime varies by data type (real-time: 0, static: 5m+)
- [ ] gcTime configured appropriately (not Infinity everywhere)
- [ ] No manual useEffect + fetch patterns (use useQuery instead)
- [ ] ReactQueryDevtools enabled in development environment
- [ ] Error boundaries handle query errors (throwOnError: true)
- [ ] Infinite queries use cursor pagination, not offset-based

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **API endpoint design** → Use `api-architect` instead
- **Database query optimization** → Use database-specific skills  
- **GraphQL schema design** → Use `graphql-expert` instead
- **Server-side data fetching in RSC** → Use `react-server-components-expert`
- **WebSocket real-time connections** → Use `websocket-integration-expert`
- **State management for UI state** → Use `react-state-management` instead

**Delegation rules**:
- For REST API structure: hand off to `api-architect` 
- For server components: hand off to `react-server-components-expert`
- For real-time features: hand off to `websocket-integration-expert`