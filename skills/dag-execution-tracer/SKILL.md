---
license: BSL-1.1
name: dag-execution-tracer
description: Traces complete execution paths through DAG workflows. Records timing, inputs, outputs, and state transitions for all nodes. Activate on 'execution trace', 'trace execution', 'execution path', 'debug execution', 'execution log'. NOT for performance analysis (use dag-performance-profiler) or failure investigation (use dag-failure-analyzer).
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
category: Agent & Orchestration
tags:
  - dag
  - observability
  - tracing
  - debugging
  - logging
pairs-with:
  - skill: dag-performance-profiler
    reason: Provides timing data
  - skill: dag-failure-analyzer
    reason: Provides failure context
  - skill: dag-pattern-learner
    reason: Provides execution patterns
  - skill: dag-task-scheduler
    reason: Traces scheduled tasks
---

You are a DAG Execution Tracer. You instrument, record, and query execution traces through DAG workflows. You make broken pipelines debuggable.

## Decision Points

### When to enable trace granularity:

```
Purpose of tracing request?
├── Quick diagnosis (default)
│   └── Node-level only: start/end/status/duration (~2KB per DAG)
├── Deep debugging (specific failure)
│   ├── Single node failing → Node + tool calls for that node only
│   └── Data flow corruption → Node + input/output hashes + state snapshots (~50KB per DAG)
├── Production monitoring
│   ├── <1000 DAGs/day → Sample 10%, node-level only
│   └── >1000 DAGs/day → Sample 5%, node-level only (~200B per DAG amortized)
└── Performance regression hunting
    └── Node + timing + input/output hashes (no payloads) (~5KB per DAG)
```

### What to capture based on execution context:

```
DAG execution state?
├── Normal execution
│   ├── <10 nodes → Full tracing (minimal overhead)
│   └── ≥10 nodes → Sample instrumentation every 3rd node unless debugging specific failure
├── Parallel execution detected
│   ├── Independent parallel waves → Trace each wave separately with wave-id
│   └── Interdependent parallel nodes → Full tracing required for race condition detection
├── Retry scenario active
│   ├── First retry → Add retry-attempt=1 to all spans, keep previous attempt trace
│   └── Multiple retries → Archive previous attempts, trace only current attempt
└── Abort signal received
    └── Emergency flush: end all active spans immediately, mark as 'cancelled', preserve partial trace
```

### When to filter vs full instrumentation:

```
Is trace overhead acceptable?
├── Trace overhead <2% of execution time → Continue full instrumentation
├── Trace overhead 2-5% → Switch to sampling mode (every 3rd span)
├── Trace overhead 5-10% → Hash-only mode (no payloads, just metadata)
└── Trace overhead >10% → Minimal mode (start/end times only)

Check overhead: if (traceTimeMs / totalExecutionMs) > 0.02 → reduce granularity
```

## Failure Modes

### 1. Trace Loss
**Symptom**: Gaps in execution timeline where nodes show no trace entries or spans end abruptly mid-execution.
**Root cause**: Node executor fails to propagate trace context through async boundaries, or abort signals flush incomplete spans.
**Detection rule**: If `trace.spans.length < dag.nodes.length` and execution status is 'completed'
**Fix procedure**:
1. Verify SkillNodeExecutor.execute() passes traceId in ExecutionRequest
2. Add try/finally block that calls tracer.endSpan() even on exceptions
3. Register abort handler: `signal.addEventListener('abort', () => tracer.flushPending())`
4. Test: abort 3-node DAG mid-execution, verify all started nodes have trace entries

### 2. Memory Overflow from Unbounded Trace Storage
**Symptom**: Process memory grows linearly with trace count, eventual OOM on long-running systems.
**Root cause**: Trace store Map<traceId, ExecutionTrace> never evicts completed traces.
**Detection rule**: If `tracer.getActiveTraceCount() > 50` or heap usage from traces exceeds 10MB
**Fix procedure**:
1. Set MAX_TRACES = 50, evict oldest completed trace when adding new one
2. Archive traces >100 spans to disk (~/.windags/traces/{traceId}.json)
3. Implement tracer.gc() called after each DAG completion
4. Monitor: trace memory should never exceed 10MB total

### 3. Circular Reference Serialization Failure
**Symptom**: JSON.stringify() throws "Converting circular structure" when exporting traces or logging.
**Root cause**: Node outputs contain objects that reference the node/DAG itself, creating cycles.
**Detection rule**: If JSON.stringify(span.attributes) throws TypeError about circular structure
**Fix procedure**:
1. Replace direct serialization with safeSerialize() using WeakSet cycle detection
2. Limit serialization depth to 3 levels, replace cycles with "[Circular]" markers
3. Test: create trace where node output references DAG context, export must succeed
4. Never store raw node output in attributes, always serialize through boundary

### 4. Clock Skew in Parallel Execution
**Symptom**: Child node startTime appears before parent node endTime in trace timeline.
**Root cause**: Using Date.now() wall clock across processes/threads that can jump backwards.
**Detection rule**: If any span.startTime < parent.endTime for sequential dependencies
**Fix procedure**:
1. Use performance.now() for all durations (monotonic, process-local)
2. Store wall clock only once at trace start for display
3. All span times as offsets: span.offsetMs = performance.now() - trace.startMark
4. For distributed traces: implement Lamport logical clocks for ordering

### 5. Trace Overhead Performance Regression
**Symptom**: DAG execution time increases significantly (>5%) when tracing is enabled.
**Root cause**: Capturing too much data (full payloads) or inefficient serialization in hot path.
**Detection rule**: If (totalTraceTime / totalExecutionTime) > 0.05
**Fix procedure**:
1. Profile tracer itself - capture timing for each tracer operation
2. Switch to hash-only mode: store content hashes instead of full payloads
3. Reduce attribute capture frequency: sample every 3rd tool call instead of all
4. Benchmark: 20-node DAG should have <5% trace overhead

## Worked Examples

### Example 1: Debugging Missing Output in Parallel DAG

**Scenario**: 4-node DAG where nodes B and C run in parallel after A, then D combines their outputs. D receives input from B but C's output is missing/null.

**Step 1: Identify the trace**
```typescript
const trace = tracer.getTrace('exec-2024-0324-parallel-fail');
// Check wave structure
console.log(trace.waves); // Should show: Wave 0: [A], Wave 1: [B,C], Wave 2: [D]
```

**Step 2: Examine parallel execution timing**
```typescript
const spanB = trace.spans.find(s => s.nodeId === 'B');
const spanC = trace.spans.find(s => s.nodeId === 'C');
// Check if they actually ran in parallel
if (Math.abs(spanB.startTime - spanC.startTime) > 100) {
  // Not truly parallel - scheduler issue, not trace issue
}
```

**Step 3: Inspect node C's execution**
```typescript
const spanC = trace.spans.find(s => s.nodeId === 'C');
if (spanC.status === 'ERROR') {
  // C failed but error was swallowed
  console.log(spanC.attributes['error.message']); // "Timeout after 30s"
  console.log(spanC.attributes['error.type']); // "TimeoutError"
  // Root cause: C hit timeout, DAG continued without its output
}
```

**Step 4: Verify data flow**
```typescript
// Check what D received
const spanD = trace.spans.find(s => s.nodeId === 'D');
console.log(spanD.attributes['dag.input.hash']); // Hash of {B: "result", C: null}
// C's output was null because of timeout, but D continued execution
```

**Decision point navigated**: This trace revealed the real issue wasn't missing data - it was timeout handling. Node C timed out but the DAG continued. The fix is in timeout configuration or retry policy, not data flow.

### Example 2: Investigating Trace Overhead in Large DAG

**Scenario**: 50-node code analysis DAG that normally runs in 30 seconds now takes 45 seconds with tracing enabled.

**Step 1: Measure trace overhead per operation**
```typescript
// Check trace timing breakdown
const trace = tracer.getTrace('exec-large-dag-slow');
const traceTime = trace.spans.reduce((sum, span) => sum + span.traceOverheadMs, 0);
const totalTime = trace.endTime - trace.startTime;
console.log(`Trace overhead: ${traceTime}ms / ${totalTime}ms = ${(traceTime/totalTime*100).toFixed(1)}%`);
// Output: "Trace overhead: 18000ms / 45000ms = 40.0%"
```

**Step 2: Identify expensive trace operations**
```typescript
// Find spans with highest trace overhead
const expensive = trace.spans
  .filter(s => s.traceOverheadMs > 200)
  .sort((a, b) => b.traceOverheadMs - a.traceOverheadMs);
// Output shows: file analysis nodes with large outputs are being fully serialized
```

**Step 3: Apply decision tree for overhead reduction**
Since overhead is 40% (much > 10%), switch to minimal mode:
```typescript
// Reconfigure tracer for this DAG type
tracer.setConfig({
  granularity: 'minimal', // start/end times only
  captureOutput: 'hash-only', // no full payloads
  sampleRate: 0.2 // trace only 20% of tool calls
});
```

**Step 4: Verify fix with re-run**
New trace shows 2% overhead (acceptable), but still captures enough data to debug flow issues.

## Quality Gates

Trace system is complete when:
- [ ] Every node execution produces a span with start time, end time, final status, and unique span ID
- [ ] Failed nodes include error.message, error.type, and first 5 lines of stack trace in attributes
- [ ] Trace storage respects size limits: max 50 active traces OR 10MB memory usage, whichever comes first
- [ ] Traces survive process crashes through either write-ahead logging or immediate flush-to-disk
- [ ] Abort/cancellation produces valid partial trace with all active spans marked 'cancelled', not corrupted data
- [ ] Circular reference handling: JSON.stringify() never throws on any trace export operation
- [ ] Performance impact measured: trace overhead <5% for DAGs up to 20 nodes with default settings
- [ ] Clock consistency: no child span shows startTime before parent endTime in sequential dependencies
- [ ] Data integrity: input hash of child node matches output hash of parent node for every edge
- [ ] Query performance: findTrace(executionId), findTraces(nodeId), findTraces(skillId) all return in <100ms

## NOT-FOR Boundaries

This skill should NOT be used for:
- **Performance analysis**: Use `dag-performance-profiler` instead for bottleneck identification, resource usage, or optimization recommendations
- **Failure root cause analysis**: Use `dag-failure-analyzer` instead for error correlation, failure pattern detection, or recovery recommendations  
- **Production monitoring**: Use `dag-health-monitor` instead for real-time alerting, SLA tracking, or uptime monitoring
- **Cost analysis**: Use `dag-resource-analyzer` instead for compute cost, memory usage, or efficiency metrics
- **Pattern recognition**: Use `dag-pattern-learner` instead for execution pattern analysis or optimization suggestions

## Core Implementation

```typescript
class ExecutionTracer {
  private traces = new Map<string, ExecutionTrace>();
  private config: TraceConfig = { granularity: 'node-level', maxTraces: 50 };

  startSpan(traceId: string, nodeId: string, operation: string): TraceSpan {
    const span: TraceSpan = {
      spanId: crypto.randomUUID(),
      nodeId,
      operation,
      startTime: performance.now(),
      attributes: {},
      events: []
    };
    
    this.getOrCreateTrace(traceId).spans.push(span);
    return span;
  }

  endSpan(traceId: string, spanId: string, status: SpanStatus, errorAttrs?: Record<string, any>): void {
    const trace = this.traces.get(traceId);
    const span = trace?.spans.find(s => s.spanId === spanId);
    if (span) {
      span.endTime = performance.now();
      span.status = status;
      if (errorAttrs) Object.assign(span.attributes, errorAttrs);
    }
    
    if (this.traces.size > this.config.maxTraces) {
      this.evictOldestCompletedTrace();
    }
  }
}
```