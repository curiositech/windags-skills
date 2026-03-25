---
---
name: websocket-streaming
license: Apache-2.0
description: Implements real-time bidirectional communication between DAG execution engines and visualization dashboards via WebSocket. Covers connection management, typed event protocols, reconnection with backoff, and React hook integration. Activate on "WebSocket", "real-time updates", "live streaming", "execution events", "state streaming", "push notifications". NOT for HTTP REST APIs, server-sent events (SSE), or general networking.
allowed-tools: Read,Write,Edit,Bash
metadata:
  category: DevOps & Site Reliability
  tags:
    - websocket
    - streaming
    - real-time-updates
    - live-streaming
  pairs-with:
    - skill: reactflow-expert
      reason: WebSocket connections deliver live DAG state updates to ReactFlow visualization dashboards
    - skill: real-time-collaboration-engine
      reason: WebSocket transport powers the real-time communication layer for collaborative editing
    - skill: llm-streaming-response-handler
      reason: WebSocket is an alternative transport to SSE for bidirectional LLM streaming
category: Backend & Infrastructure
tags:
  - websocket
  - streaming
  - real-time
  - server-sent-events
  - data-flow
---

# WebSocket Streaming

Real-time bidirectional communication between DAG execution engines and dashboards via typed event protocols and connection state management.

---

## Decision Points

### Connection State Machine
```
CONNECTING → OPEN → CLOSING → CLOSED
    ↓         ↓         ↓         ↓
    wait    process   queue     reconnect
  
If connection === 'CONNECTING':
  - Buffer outgoing messages in memory queue
  - Show "connecting..." indicator
  - Timeout after 10s → retry with backoff

If connection === 'OPEN':
  - Send queued messages immediately
  - Process incoming events via typed dispatch
  - Send heartbeat every 30s

If connection === 'CLOSING':
  - Stop sending new messages
  - Finish processing in-flight events
  - Prepare for reconnection

If connection === 'CLOSED':
  - Calculate backoff: min(1000 * 2^attempt, 30000)ms
  - Increment reconnect attempt counter
  - Trigger reconnection after delay
```

### Event Type Routing
```
If event.type === 'node_state':
  - Update store.nodes[event.node_id].status
  - Trigger UI re-render for affected node
  - Log metrics if present

If event.type === 'cost_update':
  - Update budget display in header
  - Show warning if remaining < 20%
  - Log cost trajectory for analytics

If event.type === 'human_gate_waiting':
  - Show modal with gate presentation
  - Enable approval/rejection buttons
  - Start timeout countdown (default 5min)

If event.type === 'error':
  - Show error toast notification
  - Highlight affected node (if node_id present)
  - Log to error tracking service
```

### Message Buffering Strategy
```
If connectionState === 'OPEN' && bufferQueue.length === 0:
  - Send message immediately via ws.send()

If connectionState !== 'OPEN' && message.priority === 'high':
  - Add to front of bufferQueue
  - Limit high-priority queue to 50 messages

If connectionState !== 'OPEN' && message.priority === 'normal':
  - Add to back of bufferQueue
  - Drop oldest if queue > 200 messages

If connectionState becomes 'OPEN' && bufferQueue.length > 0:
  - Send all queued messages in order
  - Clear buffer queue
  - Resume normal operation
```

---

## Failure Modes

### **Connection Thrashing**
**Symptom**: Rapid connect/disconnect cycles, exponentially increasing CPU usage
**Detection**: If reconnect attempts > 5 in 60 seconds
**Fix**: Implement exponential backoff with max delay (30s), circuit breaker after 10 failures

### **Message Flooding**
**Symptom**: Dashboard becomes unresponsive, memory usage spikes, UI freezes
**Detection**: If incoming message rate > 100/second or buffer queue > 1000 messages
**Fix**: Implement message throttling, batch state updates, drop non-critical events

### **State Desync After Reconnect**
**Symptom**: Dashboard shows wrong node statuses, missing execution progress
**Detection**: If timestamp gap > 30s between disconnect and reconnect
**Fix**: Send 'resync_request' on reconnect, server responds with full current state

### **Memory Leak on Connection Failure**
**Symptom**: Memory usage grows steadily, never decreases, eventual crash
**Detection**: If WebSocket reference count > 5 for single DAG, or buffer never clears
**Fix**: Properly close previous WebSocket before creating new one, clear event listeners

### **Silent Message Loss**
**Symptom**: Critical events (human gates, errors) never reach dashboard
**Detection**: If expected event doesn't arrive within timeout window
**Fix**: Implement message acknowledgment, server retries unacknowledged critical events

---

## Worked Examples

### Network Drop During Node Execution

**Scenario**: User is monitoring DAG execution. Network drops for 45 seconds during critical node processing. Connection recovers.

**Step 1 - Connection Loss Detection**:
```typescript
// WebSocket onclose event fires
ws.onclose = () => {
  setConnectionState('CLOSED');
  // Decision: Network issue or server restart?
  // → Try reconnect (could be temporary network)
  scheduleReconnect();
};
```

**Step 2 - Buffering Decision**:
```typescript
// User tries to send human decision during outage
const sendDecision = (decision) => {
  if (connectionState !== 'OPEN') {
    // Decision: Buffer or reject?
    // → Buffer high-priority messages (human decisions)
    bufferQueue.unshift({ 
      type: 'human_decision', 
      priority: 'high',
      timestamp: Date.now()
    });
    showToast("Decision queued - connection lost");
  }
};
```

**Step 3 - Reconnection with State Gap**:
```typescript
ws.onopen = () => {
  const disconnectDuration = Date.now() - lastDisconnectTime;
  
  if (disconnectDuration > 30000) {
    // Decision: Full resync or continue?
    // → 45s gap requires full resync
    ws.send(JSON.stringify({ type: 'resync_request', last_seen: lastEventTimestamp }));
    
    // Server responds with missed events + current state
    // Trade-off: Higher bandwidth but guaranteed consistency
  }
  
  // Send buffered messages
  flushBufferQueue();
};
```

**What novice misses**: Assumes reconnection means everything is fine, doesn't handle state gap
**What expert catches**: Calculates disconnect duration, requests resync for gaps > 30s, preserves critical user actions in buffer

---

## Quality Gates

- [ ] Connection establishes within 5 seconds of page load
- [ ] Connection remains stable for >5 minutes during normal operation
- [ ] No message loss during planned reconnection scenarios
- [ ] Memory usage stays <50MB even with 1000+ node events
- [ ] Exponential backoff delays: 1s, 2s, 4s, 8s, 16s, 30s (max)
- [ ] Critical events (human gates, errors) always reach dashboard within 2s
- [ ] UI shows connection status clearly (connecting/connected/disconnected)
- [ ] Buffered messages sent in correct order after reconnection
- [ ] WebSocket properly closed on component unmount (no leaks)
- [ ] Event handlers use exhaustive switch on message.type (TypeScript strict)

---

## Not-For Boundaries

**Don't use WebSocket streaming for**:
- **Simple status polling** → Use `polling-pattern-optimizer` with REST endpoints instead
- **File uploads/downloads** → Use `file-transfer-handler` with HTTP multipart instead  
- **Server-sent events only** → Use `sse-event-stream` for simpler one-way communication
- **Request-response APIs** → Use `api-architect` for traditional REST/GraphQL patterns
- **Database real-time queries** → Use `database-change-streams` for direct DB subscriptions
- **Authentication flows** → Use `auth-flow-manager` for login/logout/token refresh

**Delegate to other skills**:
- For message queuing/reliability → use `message-queue-architect`
- For load balancing WebSockets → use `websocket-load-balancer`
- For WebRTC peer connections → use `webrtc-connection-manager`