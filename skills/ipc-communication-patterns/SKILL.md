---
license: Apache-2.0
name: ipc-communication-patterns
description: |
  Comprehensive reference for inter-process communication mechanisms -- every way processes can talk on a computer. Covers sockets (TCP, UDP, Unix domain), WebSockets, SSE, pipes (named/anonymous), shared memory (mmap, shm_open), message queues, signals, D-Bus, XPC (macOS), gRPC, REST, stdin/stdout, file-based coordination, and clipboard. Performance benchmarks, platform availability, and code examples for each. Special focus on which IPC works best for AI agent coordination. Activate on: "IPC", "inter-process communication", "process communication", "how do I talk between processes", "Unix socket vs TCP", "shared memory", "named pipe", "WebSocket vs SSE", "gRPC vs REST", "agent coordination IPC", "XPC service", "message passing", "stdout pipe", "D-Bus", "mmap". NOT for: distributed systems design (use distributed-systems), network protocol design (use networking), message queue infrastructure like Kafka (use data-pipeline-engineer).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Systems & Infrastructure
  tags:
    - ipc
    - sockets
    - pipes
    - shared-memory
    - websocket
    - grpc
    - unix-domain-socket
    - xpc
    - sse
    - message-queue
  pairs-with:
    - skill: agent-interchange-formats
      reason: Defines data formats that ride on top of IPC channels
    - skill: daemon-development
      reason: Daemons are the primary consumers of IPC mechanisms
    - skill: multi-agent-coordination
      reason: Agent coordination requires choosing the right IPC for the job
    - skill: websocket-streaming
      reason: WebSocket is a specialized IPC with its own streaming patterns
category: Backend & Infrastructure
tags:
  - ipc
  - inter-process
  - communication
  - message-passing
  - patterns
---

# IPC Communication Patterns

Every way processes can communicate on a computer. This skill provides decision trees for selecting IPC mechanisms, failure diagnostics, and implementation patterns for AI agent coordination.

## Decision Points

### Primary IPC Selection Tree

```
Are processes related (parent-child)?
├── YES
│   ├── Need bidirectional? 
│   │   ├── YES → Unix Domain Socket (same machine) | TCP (may cross machines)
│   │   └── NO → Anonymous Pipe (stdin/stdout)
│   └── Simple one-way → Anonymous Pipe
│
└── NO (unrelated processes)
    ├── Same machine only?
    │   ├── YES
    │   │   ├── High throughput (>1GB/s) → Shared Memory + coordination
    │   │   ├── Low latency (<10us) → Unix Domain Socket
    │   │   ├── Typed RPC needed → gRPC over Unix Socket
    │   │   └── Simple messages → Named Pipe | Unix Domain Socket
    │   │
    │   └── NO (cross-machine capable)
    │       ├── Web-compatible → WebSocket | SSE | REST
    │       ├── Streaming data → gRPC streaming | WebSocket
    │       ├── Request-reply → REST/HTTP | gRPC unary
    │       └── Fire-and-forget → UDP
    │
    └── Browser client involved?
        ├── Server → Client only → SSE
        ├── Bidirectional → WebSocket  
        └── Request-reply → REST/HTTP
```

### Performance-Driven Selection

```
If latency requirement:
├── <1us → Shared Memory (lock-free ring buffer)
├── <10us → Unix Domain Socket | Shared Memory (with locks)
├── <100us → TCP loopback | gRPC
└── <1ms → REST/HTTP acceptable

If throughput requirement:
├── >10GB/s → Shared Memory only option
├── >5GB/s → Unix Domain Socket
├── >1GB/s → TCP | gRPC
└── <1GB/s → Any mechanism works
```

### Agent Architecture Decision Matrix

```
Agent Communication Pattern → Recommended IPC

Parent spawns child agents:
├── Simple task execution → stdin/stdout pipe
├── Progress reporting needed → Unix Domain Socket
└── Web UI monitoring → stdin/stdout + SSE to browser

Orchestrator + independent agents:
├── Same machine → Unix Domain Socket
├── May scale across machines → gRPC | WebSocket
└── Simple coordination → Named Pipe

Long-running agent services:
├── macOS → XPC Service
├── Linux desktop → D-Bus
└── Cross-platform → Unix Domain Socket | TCP
```

## Failure Modes

### Pipe Buffer Deadlock
**Detection**: Process hangs when writing to stdin while child's stdout buffer is full
**Symptoms**: `write()` blocks indefinitely, process unresponsive, strace shows blocking on pipe write
**Root cause**: Both stdin and stdout buffers full (~64KB Linux, ~16KB macOS), neither process can proceed
**Fix**: Use async I/O to drain stdout while writing stdin, or separate threads for read/write operations
```bash
# Detect: strace shows blocked write to pipe
strace -p <pid> | grep -E 'write.*PIPE|read.*PIPE'
```

### Unix Socket Permission Denied
**Detection**: `EACCES` error on `connect()`, "Permission denied" in logs
**Symptoms**: Client process cannot connect to Unix domain socket, socket file exists with wrong permissions
**Root cause**: Socket file permissions too restrictive, or client running as different user
**Fix**: Set socket permissions to 0666 for multi-user access, or 0600 + proper ownership
```bash
# Fix socket permissions
chmod 666 /tmp/agent.sock
# Or set ownership
chown user:group /tmp/agent.sock
```

### TCP Connection Refused Cascade
**Detection**: `ECONNREFUSED` errors, agents unable to reach orchestrator
**Symptoms**: Multiple agents fail simultaneously, orchestrator shows no incoming connections
**Root cause**: Orchestrator crashed/restarted, firewall blocking port, or port already in use
**Fix**: Implement exponential backoff retry, health checks, and port conflict detection
```typescript
// Detect port conflicts
const server = net.createServer();
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} already in use`);
  }
});
```

### Shared Memory Corruption
**Detection**: Garbage data reads, segfaults, inconsistent state between processes
**Symptoms**: Data races, torn reads/writes, process crashes with SIGSEGV
**Root cause**: Missing synchronization, incorrect memory barriers, or buffer overruns
**Fix**: Add proper atomics for flags, use futex/semaphore for critical sections
```c
// Fix: Use atomic operations
atomic_store(&shared->flag, 1);  // Not: shared->flag = 1;
```

### Signal Handler Race Condition
**Detection**: SIGTERM not handled cleanly, processes leave stale state
**Symptoms**: Lock files not cleaned up, connections not closed, zombie processes
**Root cause**: Signal handler interrupted critical section, or handler not async-signal-safe
**Fix**: Use self-pipe trick or signalfd (Linux) for safe signal handling
```c
// Fix: Only set flag in signal handler, do cleanup in main loop
volatile sig_atomic_t shutdown_requested = 0;
void sigterm_handler(int sig) { shutdown_requested = 1; }
```

## Worked Examples

### Multi-Agent Task Orchestration

**Scenario**: Orchestrator manages 5 agent processes, each running different AI models. Need bidirectional communication for task assignment and progress reporting.

**Decision process**:
1. **Communication pattern**: Bidirectional, structured messages
2. **Performance needs**: Low latency preferred, moderate throughput
3. **Platform**: Same machine initially, may scale later  
4. **Initial choice**: Unix Domain Socket for low latency
5. **Message format**: Newline-delimited JSON for simplicity

**Implementation walkthrough**:

```typescript
// 1. Create Unix domain socket server (orchestrator)
const SOCKET_PATH = '/tmp/windags-orchestrator.sock';
if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH); // Clean stale socket

const server = net.createServer((connection) => {
  const agentId = `agent-${Date.now()}`;
  agents.set(agentId, connection);
  
  let buffer = '';
  connection.on('data', (chunk) => {
    buffer += chunk.toString();
    
    // Process complete messages (newline-delimited)
    let newlineIdx;
    while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      
      try {
        const message = JSON.parse(line);
        handleAgentMessage(agentId, message);
      } catch (err) {
        console.error(`Invalid JSON from ${agentId}:`, err);
      }
    }
  });
  
  connection.on('close', () => agents.delete(agentId));
});

server.listen(SOCKET_PATH);
fs.chmodSync(SOCKET_PATH, 0o600); // Owner-only access

// 2. Agent connection pattern
function connectAgent(): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.connect(SOCKET_PATH);
    socket.on('connect', () => resolve(socket));
    socket.on('error', reject);
  });
}

// 3. Message sending with error handling
function sendMessage(socket: net.Socket, msg: object): Promise<void> {
  return new Promise((resolve, reject) => {
    const line = JSON.stringify(msg) + '\n';
    socket.write(line, (err) => err ? reject(err) : resolve());
  });
}
```

**Expert vs novice differences**:
- **Novice mistake**: Forget to clean up stale socket file on restart → EADDRINUSE error
- **Expert catches**: Always `unlink()` socket path before binding
- **Novice mistake**: Parse JSON on every data chunk → crashes on partial messages  
- **Expert catches**: Buffer incomplete messages, parse only complete lines
- **Novice mistake**: No error handling on `write()` → silent failures
- **Expert catches**: Promises/callbacks for write completion and error detection

## Quality Gates

- [ ] IPC mechanism matches communication pattern (unidirectional vs bidirectional)
- [ ] Message framing implemented for stream protocols (length-prefix or delimiter)
- [ ] SIGPIPE handler prevents process termination on broken connections
- [ ] Stale socket/pipe files cleaned up on process startup
- [ ] Connection errors handled with appropriate retry/backoff logic
- [ ] Buffer sizes configured for expected message volumes
- [ ] Permissions set correctly for multi-process access (socket files, shared memory)
- [ ] Graceful shutdown sequence: SIGTERM → cleanup → exit (with SIGKILL timeout)
- [ ] Deadlock potential analyzed for pipe-based communication
- [ ] Performance validated under realistic load (latency and throughput SLAs met)

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- **Distributed systems across machines** → Use `distributed-systems` skill instead
- **Message broker setup (Kafka, RabbitMQ)** → Use `data-pipeline-engineer` skill instead  
- **Database connection patterns** → Use database-specific skills instead
- **Network protocol design (custom wire formats)** → Use `networking` skill instead
- **HTTP API design patterns** → Use `api-design` skill instead

**Delegate to other skills when**:
- Client needs WebSocket streaming patterns → Use `websocket-streaming` skill
- Building daemon/service architecture → Use `daemon-development` skill  
- Coordinating multiple AI agents → Use `multi-agent-coordination` skill
- Designing data formats for IPC → Use `agent-interchange-formats` skill