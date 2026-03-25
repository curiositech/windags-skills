---
license: Apache-2.0
name: websocket-realtime-expert
description: "WebSockets, SSE, and real-time communication with Socket.io and native APIs. Activate on: WebSocket, real-time, SSE, Socket.io, live updates, push notifications, bidirectional, presence. NOT for: message queue infrastructure (use event-driven-architecture-expert), API gateway routing (use api-gateway-reverse-proxy-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - websocket
  - realtime
  - sse
  - socket-io
  - push
pairs-with:
  - skill: event-driven-architecture-expert
    reason: Backend events feed real-time channels
  - skill: cache-strategy-invalidation-expert
    reason: Cache invalidation triggers real-time updates
  - skill: api-gateway-reverse-proxy-expert
    reason: WebSocket upgrade handling at the gateway
---

# WebSocket & Real-Time Expert

Build reliable real-time communication systems using WebSockets, Server-Sent Events, and managed real-time services.

## Activation Triggers

**Activate on:** "WebSocket", "real-time", "SSE", "Socket.io", "live updates", "push notifications", "bidirectional", "presence", "live cursors", "collaborative editing"

**NOT for:** Message queue setup → `event-driven-architecture-expert` | Gateway WebSocket routing → `api-gateway-reverse-proxy-expert` | Streaming data pipelines → `streaming-pipeline-architect`

## Quick Start

1. **Choose protocol** — WebSocket for bidirectional, SSE for server-push, WebTransport for low-latency
2. **Plan reconnection** — exponential backoff with jitter, resume from last event ID
3. **Design message format** — typed JSON with `type` discriminator and monotonic sequence IDs
4. **Scale horizontally** — use Redis Pub/Sub or NATS as a broadcast backplane
5. **Handle presence** — heartbeat-based with configurable timeout (30s default)

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **WebSocket** | ws (Node), Socket.io 4.8+, uWebSockets.js |
| **SSE** | Native EventSource, @microsoft/fetch-event-source |
| **Managed** | Supabase Realtime, Ably, Pusher, PartyKit |
| **Scaling** | Redis Pub/Sub, NATS, @socket.io/redis-adapter |
| **Protocols** | WebSocket (RFC 6455), SSE, WebTransport (HTTP/3) |

## Architecture Patterns

### Scaled WebSocket with Redis Backplane

```
Client A ──ws──→ Server 1 ←──redis pub/sub──→ Server 2 ←──ws── Client B
                     │                             │
                     └─────── Redis Cluster ───────┘

Each server subscribes to channels. When Server 1 receives a message
for a room, it publishes to Redis. Server 2 picks it up and forwards
to its connected clients.
```

### SSE with Last-Event-ID Resume

```typescript
// Server: SSE endpoint with resume support
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const lastId = parseInt(req.headers['last-event-id'] || '0');
  // Replay missed events from store
  const missed = eventStore.since(lastId);
  missed.forEach(evt => {
    res.write(`id: ${evt.id}\nevent: ${evt.type}\ndata: ${JSON.stringify(evt.data)}\n\n`);
  });

  // Subscribe to new events
  const unsub = eventBus.subscribe(evt => {
    res.write(`id: ${evt.id}\nevent: ${evt.type}\ndata: ${JSON.stringify(evt.data)}\n\n`);
  });
  req.on('close', unsub);
});
```

### Presence with Heartbeat

```typescript
// Client sends heartbeat every 15s
const HEARTBEAT_INTERVAL = 15_000;
const PRESENCE_TIMEOUT = 45_000; // 3 missed heartbeats = offline

// Server tracks presence
const presence = new Map<string, { userId: string; lastSeen: number }>();

ws.on('message', (msg) => {
  const { type, userId } = JSON.parse(msg);
  if (type === 'heartbeat') {
    presence.set(userId, { userId, lastSeen: Date.now() });
  }
});

// Sweep stale presence every 10s
setInterval(() => {
  const cutoff = Date.now() - PRESENCE_TIMEOUT;
  for (const [id, p] of presence) {
    if (p.lastSeen < cutoff) {
      presence.delete(id);
      broadcast({ type: 'presence:leave', userId: id });
    }
  }
}, 10_000);
```

## Anti-Patterns

1. **No reconnection logic** — connections will drop; always implement reconnect with exponential backoff and jitter
2. **Polling disguised as real-time** — if you poll every 1s over WebSocket, just use SSE or actual polling
3. **Single server assumption** — WebSocket state is per-server; you need a pub/sub backplane for horizontal scaling
4. **Unbounded message buffers** — set max buffer size and drop/queue when clients are slow (backpressure)
5. **Missing heartbeat** — idle connections get killed by proxies and load balancers (typical timeout: 60s)

## Quality Checklist

- [ ] Reconnection with exponential backoff and jitter implemented
- [ ] Last-Event-ID or sequence-based resume for missed messages
- [ ] Heartbeat/ping-pong keeps connections alive (every 15-30s)
- [ ] Redis/NATS backplane for multi-server deployments
- [ ] Message schema versioned with `type` discriminator
- [ ] Backpressure handling for slow consumers
- [ ] Connection count monitoring with alerts
- [ ] Graceful degradation: SSE fallback if WebSocket blocked
- [ ] Authentication on connection (verify token before upgrade)
- [ ] Load tested: target connections per server validated
