---
license: Apache-2.0
name: performance-profiler
description: |
  Profiles runtime performance of Node.js, Python, and Go applications. Identifies rendering bottlenecks in React/Next.js, analyzes bundle size and tree-shaking effectiveness, measures API response times and database query performance, and detects memory leaks. Produces actionable optimization recommendations with estimated impact. Activate on: 'slow API', 'performance issue', 'bundle too large', 'memory leak', 'rendering slow', 'profile application', 'optimize performance', 'high latency', 'GC pressure'. NOT for: load testing at scale (use site-reliability-engineer), CI pipeline speed (use ci-cache-optimizer), algorithmic complexity analysis only (use code-architecture).
category: Code Quality & Testing
tags:
  - performance
  - profiling
  - optimization
  - bundle-size
  - memory
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: observability-apm-expert
    reason: APM provides production telemetry that informs profiling targets
  - skill: react-performance-optimizer
    reason: React-specific rendering optimizations after profiling identifies component bottlenecks
  - skill: site-reliability-engineer
    reason: SRE owns production performance SLOs that profiling helps meet
  - skill: data-pipeline-engineer
    reason: Database query optimization often requires pipeline-level understanding
---

# Performance Profiler

Measures, diagnoses, and optimizes application performance across the full stack. This skill does not guess -- it profiles first, then recommends changes with estimated impact.

## Activation Triggers

**Activate on:** "slow API", "performance issue", "bundle too large", "memory leak", "rendering slow", "profile application", "optimize performance", "high latency", "GC pressure", "p99 latency", "TTFB too high", "LCP regression", "why is this slow"

**NOT for:** Load testing at scale --> `site-reliability-engineer` | CI pipeline speed --> `ci-cache-optimizer` | Algorithmic theory --> `code-architecture` | React-only optimization --> `react-performance-optimizer`

## Core Capabilities

- Profile Node.js applications with V8 CPU profiler and heap snapshots
- Profile Python applications with cProfile, py-spy, and memory_profiler
- Profile Go applications with pprof (CPU, memory, goroutine, block)
- Analyze React/Next.js rendering performance (component render counts, reconciliation cost)
- Measure and optimize JavaScript bundle size and tree-shaking
- Identify slow database queries and suggest index/query optimizations
- Detect memory leaks through heap snapshot comparison
- Measure API endpoint response times with percentile breakdowns
- Estimate optimization impact before implementing changes

## The Profiling Protocol

Never optimize without profiling first. Intuition about performance bottlenecks is wrong more often than right. The protocol is:

1. **Measure** -- establish a baseline with numbers
2. **Identify** -- find the actual bottleneck (not the suspected one)
3. **Hypothesize** -- propose a specific fix with estimated impact
4. **Implement** -- make the change
5. **Verify** -- measure again, confirm improvement, check for regressions elsewhere

Skip any step and you risk wasting time on non-bottlenecks or introducing regressions.

## Node.js Profiling

### CPU Profiling

```bash
# Generate a CPU profile (V8 built-in)
node --prof app.js
# Process the output
node --prof-process isolate-*.log > profile.txt

# Clinic.js for visual profiles
npx clinic doctor -- node app.js
npx clinic flame -- node app.js
npx clinic bubbleprof -- node app.js

# 0x for flamegraph (lightweight alternative)
npx 0x app.js
```

**Reading a flamegraph:**
- Width = time spent (wider = slower)
- Height = call depth (taller = deeper call stack)
- Look for wide plateaus -- those are the bottlenecks
- Ignore thin spikes -- they are fast even if deep

### Memory Profiling

```bash
# Heap snapshot via Chrome DevTools
node --inspect app.js
# Connect Chrome DevTools, take heap snapshots, compare

# Programmatic heap dump
node -e "
const v8 = require('v8');
const fs = require('fs');
const snapshotStream = v8.writeHeapSnapshot();
console.log('Heap snapshot written to', snapshotStream);
"

# Track memory over time
node --max-old-space-size=512 --trace-gc app.js 2>&1 | grep -E "Mark-sweep|Scavenge"
```

**Memory leak detection pattern:**
1. Take heap snapshot at time T0 (baseline)
2. Run the suspected leaking operation N times
3. Force GC: `global.gc()` (requires `--expose-gc`)
4. Take heap snapshot at T1
5. Compare T0 vs T1 in DevTools: sort by "Alloc. Size" delta
6. Objects that grew between snapshots without being collected are likely leaks

**Common Node.js memory leaks:**
- Event listeners not removed (`emitter.on` without corresponding `off`)
- Closures capturing large objects in long-lived callbacks
- Unbounded caches (Map/Object growing without eviction)
- Streams not properly destroyed on error
- Global variables accumulating per-request data

### Event Loop Profiling

```bash
# Detect event loop blocking
npx clinic doctor -- node app.js
# Look for event loop delay spikes > 100ms

# Programmatic monitoring
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => {
  console.log(`p50: ${(h.percentile(50) / 1e6).toFixed(1)}ms, p99: ${(h.percentile(99) / 1e6).toFixed(1)}ms`);
  h.reset();
}, 5000);
```

Event loop delay > 50ms at p99 means synchronous work is blocking. Common culprits: JSON.parse on large payloads, synchronous file I/O, CPU-intensive computation, regex backtracking.

## Python Profiling

### CPU Profiling

```bash
# cProfile (built-in, low overhead)
python -m cProfile -s cumulative app.py

# py-spy (sampling profiler, attaches to running process)
py-spy record -o profile.svg -- python app.py
py-spy top --pid <PID>  # live view, no restart needed

# line_profiler for function-level detail
# Add @profile decorator to functions of interest
kernprof -l -v app.py
```

### Memory Profiling

```bash
# memory_profiler for line-by-line memory usage
# Add @profile decorator to suspect functions
python -m memory_profiler app.py

# tracemalloc (built-in, tracks allocations)
python -c "
import tracemalloc
tracemalloc.start()
# ... run your code ...
snapshot = tracemalloc.take_snapshot()
for stat in snapshot.statistics('lineno')[:10]:
    print(stat)
"

# objgraph for reference tracking
python -c "
import objgraph
objgraph.show_most_common_types(limit=20)
objgraph.show_growth()
"
```

### Django/Flask Request Profiling

```bash
# Django: django-silk for per-request profiling
# Add to INSTALLED_APPS and MIDDLEWARE, then visit /silk/

# Flask: flask-profiler or Werkzeug profiler middleware
# app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[30])

# General: py-spy against running server
py-spy record -o profile.svg --pid $(pgrep -f "gunicorn")
```

## Go Profiling

```bash
# CPU profile
go test -cpuprofile cpu.prof -bench .
go tool pprof cpu.prof

# Memory profile
go test -memprofile mem.prof -bench .
go tool pprof mem.prof

# HTTP pprof (add to running server)
# import _ "net/http/pprof"
# then: go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# Goroutine profile (detect goroutine leaks)
go tool pprof http://localhost:6060/debug/pprof/goroutine

# Block profile (detect lock contention)
# runtime.SetBlockProfileRate(1) in code
go tool pprof http://localhost:6060/debug/pprof/block
```

**Go-specific patterns:**
- Goroutine leak: goroutine count grows monotonically. Check `runtime.NumGoroutine()` over time.
- Excessive allocation: `go test -benchmem` shows allocs/op. Target zero-alloc hot paths.
- Lock contention: block profile shows time spent waiting on mutexes. Consider `sync.RWMutex` or lock-free alternatives.

## React / Next.js Performance

### Component Rendering

```javascript
// React DevTools Profiler (browser extension)
// Record → identify components re-rendering unnecessarily

// Why Did You Render (development only)
// npm install @welldone-software/why-did-you-render
import React from 'react';
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { trackAllPureComponents: true });
}
```

**Common React performance issues and fixes:**

| Problem | Detection | Fix | Impact |
|---------|-----------|-----|--------|
| Unnecessary re-renders | React Profiler shows renders without prop changes | `React.memo`, `useMemo`, `useCallback` | High |
| Large component trees | Profiler shows deep re-render cascades | Split components, lift state down | High |
| Expensive computations in render | Flamegraph shows CPU time in render | `useMemo` with correct deps | Medium |
| Context over-triggering | All consumers re-render on any context change | Split contexts by update frequency | High |
| Missing list keys or wrong keys | Warning in console + full list re-render | Stable, unique keys (not array index) | Medium |
| Unoptimized images | LCP regression, large layout shifts | `next/image` with proper sizing | High |

### Next.js Specific

```bash
# Analyze bundle with @next/bundle-analyzer
ANALYZE=true next build

# Check route segment sizes
next build  # Look at the "Size" and "First Load JS" columns

# Trace server-side rendering time
NEXT_OTEL_VERBOSE=1 next dev
```

**Next.js performance targets:**

| Metric | Good | Needs Work | Critical |
|--------|------|------------|----------|
| First Load JS (per route) | < 100 KB | 100-200 KB | > 200 KB |
| TTFB | < 200ms | 200-500ms | > 500ms |
| LCP | < 2.5s | 2.5-4.0s | > 4.0s |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |
| INP | < 200ms | 200-500ms | > 500ms |

## Bundle Size Analysis

```bash
# Webpack bundle analyzer
npx webpack-bundle-analyzer dist/stats.json

# Next.js specific
ANALYZE=true npx next build

# Vite: rollup-plugin-visualizer
# Add to vite.config.ts plugins array

# Source map explorer (works with any bundler)
npx source-map-explorer dist/**/*.js

# Check individual package sizes
npx bundlephobia <package-name>
# or use https://bundlephobia.com
```

**Bundle optimization checklist:**

1. **Tree-shaking verification**: Import `{ specific }` not `import *`. Check if dead code is actually eliminated.
2. **Dynamic imports**: `React.lazy()` or `next/dynamic` for routes and heavy components.
3. **Package alternatives**: Replace `moment` with `date-fns` (87 KB --> 12 KB tree-shaken). Replace `lodash` with `lodash-es` or individual imports.
4. **Duplicate packages**: Check for multiple versions of the same package in bundle. `npm ls <package>` to find duplicates.
5. **Polyfill audit**: Modern browsers do not need `core-js` for most features. Check `browserslist` config.
6. **Image formats**: WebP/AVIF instead of PNG/JPEG. Use `next/image` or `sharp` for optimization.

## Database Query Performance

### PostgreSQL

```sql
-- Find slow queries (requires pg_stat_statements)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Explain a slow query
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- unused indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find missing indexes (sequential scans on large tables)
SELECT relname, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 100 AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC;
```

### Query Optimization Decision Tree

```
Query slow?
├── Full table scan?
│   ├── Yes → Add index on WHERE/JOIN columns
│   └── No → Index exists but not used?
│       ├── Yes → Check selectivity, ANALYZE table, check data types match
│       └── No → Move to join analysis
├── Joining many tables?
│   ├── Yes → Check join order, ensure foreign keys indexed
│   └── No → Returning too many rows?
│       ├── Yes → Add LIMIT, implement pagination
│       └── No → Complex aggregation?
│           ├── Yes → Consider materialized view
│           └── No → Profile application-side processing
```

## API Response Time Measurement

```bash
# Quick measurement with curl
curl -o /dev/null -s -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://api.example.com/endpoint

# Percentile measurement with hey (HTTP load generator)
hey -n 200 -c 10 https://api.example.com/endpoint

# Node.js: measure middleware/handler time
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration.toFixed(1)}ms`);
  });
  next();
});
```

**API response time targets:**

| Endpoint Type | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| Read (cached) | < 10ms | < 50ms | < 100ms |
| Read (DB) | < 50ms | < 200ms | < 500ms |
| Write (simple) | < 100ms | < 300ms | < 500ms |
| Write (complex) | < 500ms | < 1s | < 2s |
| Search/aggregate | < 200ms | < 1s | < 3s |

## Anti-Patterns

### 1. Premature Optimization

**Symptom**: Optimizing code that accounts for 0.1% of total execution time
**Why wrong**: Maximum possible improvement is 0.1%, time wasted
**Fix**: Profile first. Optimize the top bottleneck, re-profile, repeat. Amdahl's Law applies.

### 2. Micro-benchmarks in Isolation

**Symptom**: Benchmarking a single function in a loop, declaring it "fast enough"
**Why wrong**: Real performance depends on context -- cache behavior, GC pressure, concurrent load
**Fix**: Profile under realistic workloads. Use production-like data volumes.

### 3. Caching Without Measurement

**Symptom**: Adding Redis/Memcached to every slow endpoint
**Why wrong**: If the bottleneck is computation not data access, caching helps nothing. Cache invalidation adds complexity.
**Fix**: Measure whether the slow part is data fetching, computation, or serialization. Cache only if data fetching dominates.

### 4. Bundle Size Whack-a-Mole

**Symptom**: Removing one large dependency, adding another without checking
**Fix**: Track bundle size in CI. Set a budget. Fail the build if budget exceeded.

### 5. Ignoring GC Pressure

**Symptom**: Profiling shows fast execution but high p99 latency
**Why wrong**: GC pauses cause latency spikes invisible to CPU profiles
**Fix**: Monitor GC with `--trace-gc`. Reduce allocation rate in hot paths. Use object pooling for high-churn objects.

### 6. Optimizing Without a Budget

**Symptom**: "Make it faster" with no target
**Why wrong**: No definition of done, infinite yak-shaving
**Fix**: Set specific targets: "p99 < 200ms" or "bundle < 150KB". Stop when met.

## Decision Points

### When to optimize on the client vs the server

- **Client**: Rendering performance, bundle size, interaction latency, layout shifts
- **Server**: API response time, database queries, computation, memory usage
- **Both**: If TTFB is high (server) AND LCP is high (client), fix the server first -- client improvements are invisible behind slow TTFB

### When to use a profiler vs APM

- **Profiler** (this skill): Deep investigation of a known slow path. Local or staging.
- **APM** (observability-apm-expert): Broad monitoring to discover which paths are slow. Production.

Use APM to find the target, profiler to diagnose and fix it.

### When the bottleneck is external

If profiling shows most time spent waiting on a third-party API or external database:
- You cannot profile their internals
- Options: caching, request batching, parallel requests, circuit breaker, fallback
- Set aggressive timeouts so external slowness does not cascade

## Quality Checklist

```
[ ] Baseline performance measured with numbers (not "it feels slow")
[ ] Bottleneck identified through profiling (not guessing)
[ ] Optimization targets set with specific metrics and thresholds
[ ] Fix addresses the actual bottleneck, not a secondary concern
[ ] Performance measured after fix with same methodology as baseline
[ ] No regressions introduced in other areas (full test suite passes)
[ ] Memory profile shows no new leaks introduced
[ ] Bundle size delta documented if frontend changes made
[ ] Database query changes validated with EXPLAIN ANALYZE
[ ] Improvement quantified: "p99 reduced from 850ms to 120ms" not "faster"
[ ] Performance budget established for ongoing monitoring
[ ] Findings documented for future reference
```

---

**Covers**: CPU profiling | Memory leak detection | Bundle analysis | Database query optimization | API latency measurement | GC analysis | Rendering performance

**Use with**: observability-apm-expert (production monitoring) | react-performance-optimizer (React-specific fixes) | site-reliability-engineer (SLO enforcement) | ci-cache-optimizer (build performance)
