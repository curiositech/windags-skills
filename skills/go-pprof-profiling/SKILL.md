---
name: go-pprof-profiling
description: 'Use when CPU usage is high, memory grows unboundedly, goroutines leak, mutex contention shows in traces, or escape analysis suggests excess heap allocation. Triggers: net/http/pprof endpoint exposure, go tool pprof analysis, flamegraph generation, allocs vs inuse_space heap profiles, runtime/trace event timeline, mutex profiling, block profiling, goroutine dumps, GC pressure measurement. NOT for non-Go languages, distributed tracing (use OpenTelemetry skill), or production telemetry pipelines.'
category: AI & Machine Learning
tags:
  - golang
  - performance
  - profiling
  - pprof
  - flamegraph
  - debugging
---

# Go pprof Profiling

Go's pprof is the best built-in profiler in any mainstream language. The trick is knowing which profile to grab and how to read its output. CPU profile says where time goes; heap profile says where allocations happen; trace says when things happen.

## When to use

- High CPU under steady load, no obvious culprit.
- Memory growing without bound (a leak, or just an under-sized cache).
- Goroutine count climbing — something isn't returning.
- Mutex contention showing in `runtime.lock_*`.
- Latency spikes correlated with GC pauses.

## Core capabilities

### Expose pprof in a server

```go
import (
    "net/http"
    _ "net/http/pprof" // registers handlers on default mux
)

func main() {
    go func() { _ = http.ListenAndServe("localhost:6060", nil) }()
    // ... rest of app on a different port ...
}
```

The blank import wires `/debug/pprof/*` onto the default mux. **Bind to localhost** in production — never expose pprof publicly.

For services already using their own mux:

```go
import "net/http/pprof"

mux.HandleFunc("/debug/pprof/", pprof.Index)
mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
```

### CPU profile

```bash
# Capture 30s at the URL.
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# Or save first.
curl -o /tmp/cpu.prof http://localhost:6060/debug/pprof/profile?seconds=30
go tool pprof /tmp/cpu.prof
```

In the interactive prompt:

```
(pprof) top              # top 10 by self time
(pprof) top -cum         # by cumulative time (function + descendants)
(pprof) list FuncName    # source-annotated profile of a function
(pprof) web              # opens SVG in browser
(pprof) tree -focus=Foo  # subtree under Foo
```

For flamegraphs:

```bash
go tool pprof -http=:8080 /tmp/cpu.prof
# Then visit localhost:8080, switch to "Flame Graph" view.
```

### Heap profile

```bash
go tool pprof http://localhost:6060/debug/pprof/heap

# Two profile types:
# inuse_space: bytes currently allocated (default)
# alloc_space: total bytes allocated since process start
go tool pprof -alloc_space http://localhost:6060/debug/pprof/heap
```

Use `inuse_space` to find leaks; use `alloc_space` to find allocation churn that's pressuring the GC.

### Goroutine dump

```bash
curl http://localhost:6060/debug/pprof/goroutine?debug=2 > /tmp/goroutines.txt
```

`debug=2` gives full stack traces with the locking state. Search for goroutines stuck in:
- `chan receive` — waiting on a channel that never sends.
- `semacquire` — mutex held by another goroutine.
- `select` — none of the cases ready.
- `IO wait` — waiting on a syscall (often fine, sometimes a leak).

Count by stack signature to find dominant patterns:

```bash
grep -oE "^goroutine [0-9]+ \[.+\]" /tmp/goroutines.txt | sort | uniq -c | sort -rn
```

### Block + mutex profiling

```go
import "runtime"

func init() {
    runtime.SetBlockProfileRate(1)   // sample every blocking event
    runtime.SetMutexProfileFraction(1) // sample every mutex contention
}
```

Then:

```bash
go tool pprof http://localhost:6060/debug/pprof/block
go tool pprof http://localhost:6060/debug/pprof/mutex
```

Both come off "1 in N" sampling — `1` means every event. Set higher (e.g., 100) in production to reduce overhead.

### Execution trace

```bash
curl -o /tmp/trace.out http://localhost:6060/debug/pprof/trace?seconds=5
go tool trace /tmp/trace.out
```

The trace UI shows the full timeline of goroutines, GC, syscalls, and network I/O. Use this when "the latency went up but pprof shows nothing weird" — the trace shows you the *when*.

### Escape analysis

Allocations on the heap are slower (GC pressure). Compile with:

```bash
go build -gcflags='-m=2' ./... 2>&1 | grep -E 'escapes|moved to heap'
```

Common heap-escape causes:
- Returning a pointer to a local.
- Storing a value through an interface (allocates).
- Closures capturing variables by reference.
- `append` to a slice that grows beyond its capacity.

For a hot path, prefer struct values, pre-sized slices, and `sync.Pool` for object reuse:

```go
var bufPool = sync.Pool{
    New: func() any { return new(bytes.Buffer) },
}

func formatLog(record Record) string {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() { buf.Reset(); bufPool.Put(buf) }()
    // ... use buf ...
    return buf.String()  // String() copies — safe to return after Put
}
```

### GC tuning

```
GOGC=100   # default; collect when heap is 2x post-GC size
GOGC=200   # reduce GC frequency; trades memory for CPU
GOMEMLIMIT=2GiB  # soft memory limit (1.19+); GC works harder near it
```

`GOMEMLIMIT` is the better knob in containers — it makes the GC respect the cgroup limit instead of OOMKilling.

```go
import "runtime/debug"

debug.SetGCPercent(200)              // change at runtime
debug.SetMemoryLimit(2 << 30)        // 2 GiB
```

## Anti-patterns

### Reading pprof output without `-cum`

**Symptom:** `top` shows runtime functions; you can't find your hot path.
**Diagnosis:** Self time is dominated by leaf runtime functions (mallocgc, schedule).
**Fix:** Use `top -cum` for cumulative time or open the flamegraph.

### Profiling without representative load

**Symptom:** Profile shows initialization code; the actual hot path doesn't appear.
**Diagnosis:** Captured during startup or with no traffic.
**Fix:** Always profile under realistic load. Use `?seconds=30` and run a load test for the duration.

### Goroutine leak from forgotten cancellation

**Symptom:** Goroutine count climbs over hours; eventually `runtime: goroutine stack exceeds`.
**Diagnosis:** A goroutine reads from a channel with no sender, or is blocked in select with no default.
**Fix:** Pass a `context.Context`; `select` on `ctx.Done()` so cancellation propagates. Tools: `kubectl/curl` the goroutine endpoint and grep.

### Heap profile without distinguishing inuse vs alloc

**Symptom:** "We're allocating tons" but heap stays flat.
**Diagnosis:** alloc_space shows churn (allocate-then-free); inuse_space shows actual residency.
**Fix:** For leaks, `inuse_space`. For GC pressure, `alloc_space`. Different problems, different profiles.

### Exposing pprof publicly

**Symptom:** Stack traces leak via pprof endpoints; CPU profiling DoS-able.
**Diagnosis:** pprof bound to 0.0.0.0 in production.
**Fix:** Bind to localhost or a private interface; require auth on the proxy that exposes it.

### `sync.Pool` misuse

**Symptom:** Pool added; allocations didn't drop.
**Diagnosis:** Forgot to `Put` after use, or used pooled objects after `Put`.
**Fix:** `defer pool.Put(x)` immediately after Get. Reset state before Put. Don't hold a reference past Put.

## Quality gates

- [ ] pprof endpoints exposed in every long-running service, bound to localhost.
- [ ] CPU profile captured during peak hour, reviewed weekly.
- [ ] Heap inuse profile in monitoring; alert on growth >2x baseline.
- [ ] Goroutine count alert at 10x normal.
- [ ] `GOMEMLIMIT` set in container deployments.
- [ ] Mutex/block profiles enabled in staging at rate 100; reviewed before deploy of mutex-heavy changes.
- [ ] `sync.Pool` used for objects allocated >1000 times/sec on the hot path.
- [ ] Escape analysis run on hot-path functions; allocations justified or eliminated.

## NOT for

- **Non-Go languages** — different profilers (Python: py-spy, Java: async-profiler).
- **Distributed tracing** — pprof is process-local; cross-service latency is a different shape. → `opentelemetry-instrumentation`.
- **APM products** (Datadog, New Relic) — they consume pprof but their UI is product-specific.
- **Embedded Go** with cut-down runtime — pprof may not be available.
