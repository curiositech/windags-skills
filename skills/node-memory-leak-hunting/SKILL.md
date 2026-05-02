---
name: node-memory-leak-hunting
description: 'Use when a Node.js process is growing memory unbounded in production, hits OOM, restarts on schedule, or shows monotonic RSS in Grafana. Triggers: heap snapshot diff (Comparison mode in Chrome DevTools), v8.writeHeapSnapshot, --heapsnapshot-signal=SIGUSR2, clinic doctor / clinic heap, Allocation sampling vs Allocation instrumentation timeline, --max-old-space-size, retainers / dominators, EventEmitter listener leak, closures over big objects, Buffer.allocUnsafe, intern caches that never evict. NOT for CPU profiling (use clinic doctor for the smoke signal then a CPU-specific skill), Go pprof, browser-side memory leaks, or worker_threads-only debugging.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - nodejs
  - memory
  - heap
  - performance
  - debugging
  - v8
---

# Node.js Memory Leak Hunting

A leak in Node.js is "RSS goes up, never comes down." V8 garbage-collects what it can prove is unreachable; a leak means *something is still reachable that you didn't expect*. The single most powerful tool, recommended by the Node.js diagnostics docs and the practitioner field, is the **two-snapshot diff** in Chrome DevTools' Memory tab. ([Node.js — *Using Heap Snapshot*][node-heap-snapshot])

The compressed playbook:

```
1. Confirm the leak (Grafana shows monotonic RSS over hours).
2. Snapshot before load.
3. Drive load that exercises the suspect path.
4. Snapshot after.
5. Open both in DevTools → Memory tab → Comparison mode.
6. Sort by "Delta" desc. The retained, growing constructor at the top is your leak.
```

**Jump to your fire:**
- "Is this actually a leak?" → [Confirm before chasing](#confirm-before-chasing)
- Take a heap snapshot in production → [Trigger snapshots safely](#trigger-snapshots-safely)
- Compare two snapshots → [The two-snapshot diff](#the-two-snapshot-diff)
- Find the retainer → [Retainers and dominators](#retainers-and-dominators)
- Live process is too hot to snapshot → [Sampling heap profiler](#sampling-heap-profiler)
- "I don't know what to look for" → [Common Node.js leak shapes](#common-nodejs-leak-shapes)
- Process keeps OOMing → [Crank the limit, but not before fixing](#crank-the-limit-but-not-before-fixing)

## When to use

- Production process RSS grows monotonically; restarts on schedule are masking it.
- OOM kills (`signal SIGKILL`, exit 137) on Kubernetes pods.
- p99 latency climbs as the process ages.
- Memory CI gate failing on a synthetic load run.

## Core capabilities

### Confirm before chasing

Heap pressure can look like a leak without being one. Before doing snapshot work, rule out the usual:

| Smell | Likely cause | Real fix |
|---|---|---|
| RSS climbs to a ceiling, then plateaus | V8 reaching `--max-old-space-size`. Not a leak. | Raise the limit; revisit if growth resumes |
| RSS climbs after each request, never falls | Genuine leak — proceed. | Heap snapshot diff |
| RSS climbs for an hour, then drops sharply | Deferred GC of a large old generation. Not a leak. | Watch over a longer window |
| RSS jumps on a recurring schedule (cron, batch job) | A periodic job allocating a lot transiently | Look at the job, not the long-lived state |
| RSS flat, but `heap_used` climbing | True leak; OS hasn't returned pages yet | Heap snapshot diff |

Wire `process.memoryUsage()` to your metrics exporter (`heap_used`, `heap_total`, `rss`, `external`, `arrayBuffers`). See `grafana-dashboard-builder` for the panel and alert.

### Trigger snapshots safely

In Node 12+, signal-based snapshots avoid the need for an admin endpoint:

```bash
node --heapsnapshot-signal=SIGUSR2 index.js
# Then from another shell:
kill -USR2 <pid>
# Snapshot written to ./Heap-<pid>-<timestamp>.heapsnapshot
```

([Node.js docs][node-heap-snapshot])

For programmatic capture (Node 11.13+), use `v8.writeHeapSnapshot()`:

```js
import { writeHeapSnapshot } from 'node:v8';
import { resolve } from 'node:path';

// Authenticated admin endpoint — minimal middleware.
app.post('/_admin/heapsnap', requireAdmin, (req, res) => {
  const path = resolve(`/tmp/heap-${process.pid}-${Date.now()}.heapsnapshot`);
  writeHeapSnapshot(path);    // Synchronous; pauses the process for ~seconds at multi-GB heaps.
  res.json({ path });
});
```

**Snapshots are big.** Multi-GB heaps produce multi-GB files. Practitioner pattern: write to a mounted S3 (or equivalent) volume rather than local disk. ([Halodoc — *Find & Fix Node.js Memory Leaks*][halodoc-leaks]) Snapshotting also pauses the event loop while V8 walks the heap; on a 4 GB heap expect a few seconds of pause. Consider taking the snapshot from a replica or canary, not the busy primary.

### The two-snapshot diff

The technique the Node.js docs spell out, paraphrased: ([node-heap-snapshot])

```
1. Let the process bootstrap completely.
2. Snapshot 1.
3. Drive the suspect path (curl loop, k6 script, real traffic).
4. Snapshot 2.
5. In Chrome DevTools → Memory tab, load both .heapsnapshot files.
6. Select snapshot 2; in the dropdown, choose "Comparison".
7. Sort by "Delta" descending. The constructor with a large positive #New
   AND a large positive #Delta — and zero #Deleted — is your leak candidate.
```

The Node.js docs frame it: *"Open the older snapshot first, then load the newer one. Switch the view from Summary to Comparison. Look for large positive deltas."* ([node-heap-snapshot])

A useful three-snapshot variant for slow leaks: snapshot, run load, snapshot, run *more* load, snapshot. Compare 1↔2 and 2↔3. The constructor that grows in both diffs is the leak. (One-shot diffs sometimes catch transient allocations that look like leaks but aren't retained after a few more GCs.)

### Retainers and dominators

Once you've found the leaking constructor, click into instances and read **Retainers** (bottom panel). Retainers are the chain of references keeping the object alive. Read up the chain:

```
MyHandler @ 0x1234
  └─ in [callbacks] of EventEmitter @ 0x5678
       └─ in [errorHandlers] of Server @ 0x9abc
            └─ in (closure) of express()
                 └─ in (Global) — the root
```

You're looking for the unexpected reference — the moment the chain becomes "oh, *that's* still holding it." Common shapes are in the next section.

The **Dominators** view answers a different question: "if this object went away, how much would I free?" Useful when one Map or array is hoarding a long tail of small objects.

### Sampling heap profiler

When the production process can't tolerate the pause of a full snapshot, the Allocation Sampling profiler is safe to leave on: ([Node.js — *Using Heap Profiler*][node-heap-profiler])

```bash
node --inspect index.js
```

In Chrome DevTools → Memory → **Allocation sampling** → Start. Statistically samples allocations by stack trace; low overhead, production-safe. ([node-heap-profiler]) Doesn't tell you what's *retained* (snapshots do that) but tells you *where* the allocation pressure is coming from.

For a programmatic, file-output equivalent, the `node --heap-prof` flag (V8 sampling heap profiler) writes a `.heapprofile` you can open in DevTools too:

```bash
node --heap-prof --heap-prof-interval=512000 index.js
```

(`--heap-prof-interval` is the average bytes between samples; default 512 KB.)

### Common Node.js leak shapes

These are the constructor names you'll typically see on top of the diff:

#### EventEmitter listener leak

```js
// Every request adds one. Never removed.
function handler(req, res) {
  emitter.on('event', () => res.send('ok'));   // accumulates per-request closures
}
```

**Symptom in heap diff:** explosive growth of `[ListenerNode]` / `Function` retained by an `EventEmitter`'s `_events` map. Often paired with the runtime warning *"MaxListenersExceededWarning"*.
**Fix:** `emitter.once`, or `removeListener` after handling. Better: don't subscribe per-request to a long-lived emitter.

#### Cache without bounds

```js
const cache = new Map();
function get(key) {
  if (cache.has(key)) return cache.get(key);
  const v = expensive(key);
  cache.set(key, v);   // Map grows forever.
  return v;
}
```

**Symptom in heap diff:** the leaking constructor IS your `Map` / `Object`, with `Distance` increasing by the count of unique keys.
**Fix:** an LRU with a hard cap (`lru-cache`), `WeakMap` if keys are objects you want GC'd when callers drop them.

#### Closure over a big object

```js
function load() {
  const big = readFileSync('big.json'); // 200 MB
  const small = JSON.parse(big).meta;   // tiny
  return () => small;                   // closure retains `big` AND `small`!
}
```

**Symptom:** `(closure)` in retainer chain pointing at a constructor that is far larger than what the function "needs."
**Fix:** narrow the closure: `function load() { const big = readFileSync('big.json'); const small = JSON.parse(big).meta; return makeFn(small); }` where `makeFn` is at module scope.

#### Buffer / ArrayBuffer growth

`process.memoryUsage().external` is climbing while `heap_used` is flat. V8 manages the heap; native buffers are tracked separately. Common cause: cached `Buffer`s or `ArrayBuffer`s held by user code.

**Fix:** find them via `Buffer` retainer, free explicitly when done. Check `Buffer.allocUnsafe` callers — fast, but easy to leak.

#### Global state added per-request

```js
// req.app.locals.metrics is global to the app.
app.use((req, res, next) => {
  app.locals.metrics.lastByPath ??= {};
  app.locals.metrics.lastByPath[req.path] = Date.now();   // grows per unique path
  next();
});
```

**Fix:** bound the size, or stop using `app.locals` as a database.

#### Promise chain holding context

A long-running Promise that captures large request state and never resolves is a slow leak that's hard to spot. Set timeouts on every external call.

### Crank the limit, but not before fixing

```bash
node --max-old-space-size=4096 index.js   # 4 GB old space (V8's tenured generation)
```

Useful when you legitimately need more headroom (large in-memory cache, big JSON parsing). Counter-productive when used to mask a leak — you just push the OOM out by a few hours. Always confirm with two-snapshot diff that growth is bounded before raising the ceiling.

### Tooling shortcuts

- `clinic doctor index.js` — runs your app under load, gives a "is it CPU? memory? event loop? I/O?" verdict before you commit to a deeper tool. ([dev.to — *Debugging Memory Leaks*][devto-debugging])
- `clinic heap` — focused heap profile.
- `node --inspect-brk=0.0.0.0:9229 index.js` + Chrome DevTools — full interactive debugger.
- `--report-on-fatalerror` — V8 writes a JSON diagnostic report on OOM crash.

## Anti-patterns

### Restarting on a cron to "fix" the leak

**Symptom:** PM2/Docker scheduled restart at 03:00 daily; nobody knows why.
**Diagnosis:** A leak was masked years ago; nobody ever debugged it.
**Fix:** Take a snapshot diff during the day. Find the actual leak. Restarts hide alerting and cause cold caches.

### Reading `heap_used` without `heap_total` and `rss`

**Symptom:** Dashboard shows flat `heap_used`, alerts never fire, but pods OOM.
**Diagnosis:** `heap_used` is what V8 has allocated *within* the heap. `rss` includes external buffers and code. `heap_total` is the cap V8 grew to.
**Fix:** Track all four (`heap_used`, `heap_total`, `rss`, `external`) plus `arrayBuffers` (Node 13+).

### Snapshot on the busy primary

**Symptom:** Snapshot triggers; primary pauses for 8s; uphouse 503s.
**Diagnosis:** `writeHeapSnapshot()` is synchronous and walks the entire heap.
**Fix:** Snapshot from a canary, or drain traffic from one pod, snapshot it, return it to rotation.

### Comparing snapshots without driving load between them

**Symptom:** Diff shows mostly noise (tiny deltas in `(string)`, `(closure)`).
**Diagnosis:** Without exercising the suspect path between snapshots, the diff is just GC variance.
**Fix:** Drive the suspect path with k6/curl/real traffic for several minutes between snapshots.

### Trusting the heap dump's source positions blindly

**Symptom:** Tracing the leak to a line in `node_modules/some-lib/dist/index.cjs:1`.
**Diagnosis:** Bundled / minified code; the position is meaningless.
**Fix:** `--enable-source-maps` to get the original source positions; or read the un-bundled package source.

### `--max-old-space-size` set on every Node process automatically

**Symptom:** Every container has 8 GB allocated, most use 200 MB.
**Diagnosis:** Default applied broadly to silence one rare OOM.
**Fix:** Set per-service based on measured working set + headroom (typically 1.5–2× p99). Different services need different limits.

## Quality gates

- [ ] **Test:** synthetic load test (k6, autocannon) drives the suspect path for ≥ 30 minutes; RSS curve flat at the end (or grows < 1% per hour).
- [ ] **Test:** memory-leak regression test asserts `process.memoryUsage().heapUsed` doesn't grow > N MB after running M iterations of the load.
- [ ] Metrics exporter publishes `heap_used`, `heap_total`, `rss`, `external`, `arrayBuffers`. Panel + alert in `grafana-dashboard-builder`.
- [ ] OOM-on-crash report enabled: `node --report-on-fatalerror index.js`; reports archived from CI / production.
- [ ] Heap snapshots can be triggered via `--heapsnapshot-signal=SIGUSR2` AND via authenticated admin endpoint (`v8.writeHeapSnapshot`).
- [ ] Source maps enabled (`--enable-source-maps`) so retainer chains point at real source.
- [ ] No scheduled restart hiding a leak (cron/PM2/Kubernetes liveness probe). If one exists, leak is investigated and either confirmed-fixed or documented.
- [ ] `--max-old-space-size` set deliberately per service, not as a global default.
- [ ] `lru-cache` (or equivalent) is used for any in-process cache; raw `Map`/`Object` caches reviewed for unbounded growth.
- [ ] Long-running event subscribers (`emitter.on`) audited; per-request subscription patterns replaced with `once` or removed.
- [ ] Buffer / ArrayBuffer hot paths reviewed; `external` memory tracked.
- [ ] OTel span around requests with `node.heap_used_after_ms` recorded for drift detection (see `opentelemetry-instrumentation`).

## NOT for

- **CPU profiling** — different tool. → clinic doctor for the smoke signal; then a CPU-specific tool / skill.
- **Go memory profiling** — different runtime. → `go-pprof-profiling`.
- **Browser memory leaks** — heap snapshots in Chrome work but the constructors and retainers are different. No dedicated skill yet.
- **Python memory leaks** — different runtime. No dedicated skill yet.
- **`worker_threads`-specific debugging** — overlapping but distinct.
- **Container memory limits / cgroups** — orchestration concern. → `kubernetes-debugging-runbook` for OOM-killed pods.

## Sources

- Node.js — *Using Heap Snapshot* (`v8.writeHeapSnapshot`, `--heapsnapshot-signal`, two-snapshot Comparison mode). [nodejs.org/learn/diagnostics/memory/using-heap-snapshot][node-heap-snapshot]
- Node.js — *Using Heap Profiler* (Allocation sampling vs Allocation instrumentation timeline; production safety). [nodejs.org/en/learn/diagnostics/memory/using-heap-profiler][node-heap-profiler]
- Node.js API — *v8 module*. [nodejs.org/api/v8.html][node-v8-api]
- Halodoc Engineering — *Find & Fix Node.js Memory Leaks with Heap Snapshots* (S3-volume snapshot pattern). [blogs.halodoc.io/fix-node-js-memory-leaks/][halodoc-leaks]
- DEV — *Debugging Memory Leaks in Node.js: heapdump, clinic.js, and v8-tools*. [dev.to/.../debugging-memory-leaks-in-nodejs][devto-debugging]
- Aleksandar Mirilovic — *How to find production memory leaks in Node.js applications?*. [medium.com/.../how-to-find-production-memory-leaks-in-node-js-applications][mirilovic-prod-leaks]

[node-heap-snapshot]: https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot
[node-heap-profiler]: https://nodejs.org/en/learn/diagnostics/memory/using-heap-profiler
[node-v8-api]: https://nodejs.org/api/v8.html
[halodoc-leaks]: https://blogs.halodoc.io/fix-node-js-memory-leaks/
[devto-debugging]: https://dev.to/crit3cal/debugging-memory-leaks-in-nodejs-a-complete-guide-to-heapdump-clinicjs-and-v8-tools-19b
[mirilovic-prod-leaks]: https://medium.com/@amirilovic/how-to-find-production-memory-leaks-in-node-js-applications-a1b363b4884f
