---
license: Apache-2.0
name: daemon-development
description: |
  Build daemon/background processes that start on boot, run continuously, and manage their own lifecycle. Covers macOS launchd (plist files, agents vs daemons), Linux systemd (unit files), Windows services, process supervision, logging, health checks, graceful shutdown, auto-restart, and AI-powered daemons that manage LLM API connections and rate limits. Activate on: "daemon", "background process", "launchd", "systemd", "service file", "plist", "launch agent", "launch daemon", "auto-start", "always running", "process supervisor", "pm2", "background service", "boot service", "AI daemon", "long-running process". NOT for: container orchestration (use devops-automator), cron jobs that run and exit (use task-scheduler), web server deployment (use backend-architect).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Infrastructure & DevOps
  tags:
    - daemon
    - launchd
    - systemd
    - background-process
    - process-supervision
    - lifecycle
    - devops
    - ai-daemon
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Always-on agents are daemons with AI-specific lifecycle needs
    - skill: devops-automator
      reason: Deployment and service management overlap
    - skill: background-job-orchestrator
      reason: Background jobs run inside daemon processes
category: Backend & Infrastructure
tags:
  - daemon
  - background-process
  - service
  - system-programming
  - linux
---

# Daemon Development

Build long-running background processes that start reliably, run continuously, recover from failures, and shut down gracefully. Expert-level daemon architecture across macOS launchd, Linux systemd, and AI-powered services.

## Decision Points

### 1. Platform-Specific Init System Choice
```
Platform Detected?
├─ macOS
│  ├─ Must run at boot (no user login): LaunchDaemon → /Library/LaunchDaemons/
│  ├─ User session required (GUI/files): LaunchAgent → ~/Library/LaunchAgents/
│  └─ System-wide user service: LaunchAgent → /Library/LaunchAgents/
├─ Linux
│  ├─ systemd available: systemd unit file → /etc/systemd/system/
│  ├─ Legacy SysV: init.d script (rare, avoid if possible)
│  └─ Container: s6 or built-in supervision
└─ Cross-platform dev
   ├─ Node.js app: pm2 for development, systemd/launchd for production
   └─ Other languages: Direct systemd/launchd implementation
```

### 2. Service Type Configuration
```
Daemon Startup Behavior?
├─ Simple process (doesn't fork)
│  ├─ systemd: Type=simple
│  └─ launchd: Standard plist (no special keys)
├─ Signals readiness when ready
│  ├─ systemd: Type=notify + sd_notify("READY=1")
│  └─ launchd: N/A (use health check instead)
├─ Forks child process (legacy)
│  ├─ systemd: Type=forking + PIDFile (avoid)
│  └─ launchd: Not supported (rewrite to not fork)
└─ Socket-activated
   ├─ systemd: Type=simple + [Socket] section
   └─ launchd: Sockets dict in plist
```

### 3. Restart Policy Design
```
Failure Recovery Strategy?
├─ Critical service (must always run)
│  ├─ systemd: Restart=always, RestartSec=5
│  └─ launchd: KeepAlive=true, ThrottleInterval=10
├─ Crash recovery only
│  ├─ systemd: Restart=on-failure
│  └─ launchd: KeepAlive={SuccessfulExit=false}
├─ Manual restart preferred
│  ├─ systemd: Restart=no
│  └─ launchd: KeepAlive=false
└─ Rate-limited restart
   ├─ systemd: StartLimitBurst=5, StartLimitIntervalSec=60
   └─ launchd: ThrottleInterval=30 (built-in)
```

### 4. AI Daemon Rate Limiting Strategy
```
LLM API Connection Pattern?
├─ Single provider, token bucket
│  ├─ Token estimation: prompt_tokens + max_completion_tokens
│  ├─ Bucket refill: tokens_per_minute from provider limits
│  └─ Overflow: Queue requests with priority
├─ Multi-provider failover
│  ├─ Circuit breaker per provider (3 failures = 30s timeout)
│  ├─ Rate limit per provider independently
│  └─ Failover order: primary → secondary → queue
├─ Streaming responses
│  ├─ Reserve tokens optimistically
│  ├─ Adjust on actual_tokens in real-time
│  └─ Handle mid-stream rate limits gracefully
└─ Batch processing
   ├─ Group similar requests to maximize throughput
   └─ Split large batches if they hit rate limits
```

### 5. Graceful Shutdown Handling
```
SIGTERM Received?
├─ Web server daemon
│  ├─ 1. server.close() - stop accepting new connections
│  ├─ 2. Wait for active requests (timeout: TimeoutStopSec-5s)
│  ├─ 3. Close database connections
│  └─ 4. exit(0)
├─ Queue worker daemon
│  ├─ 1. Stop polling for new jobs
│  ├─ 2. Finish current job (timeout protection)
│  ├─ 3. Flush any pending state
│  └─ 4. exit(0)
├─ AI daemon
│  ├─ 1. Stop accepting new LLM requests
│  ├─ 2. Drain in-flight requests (respect provider timeouts)
│  ├─ 3. Save rate limit state to disk
│  └─ 4. Close provider connections, exit(0)
└─ Database/stateful daemon
   ├─ 1. Checkpoint/flush transactions
   ├─ 2. Close client connections gracefully
   ├─ 3. Release file locks
   └─ 4. exit(0)
```

## Failure Modes

### 1. **Restart Loop Death Spiral**
- **Symptoms**: High CPU usage, rapid log growth, service stuck in "activating" state
- **Diagnosis**: Daemon crashes immediately on startup, init system restarts too quickly
- **Detection**: `journalctl -u service` shows start/crash/start pattern every few seconds
- **Fix**: Add `RestartSec=10` (systemd) or `ThrottleInterval=15` (launchd), implement startup validation

### 2. **Zombie Process Accumulation**
- **Symptoms**: `ps aux` shows `<defunct>` processes, parent daemon still running but degraded
- **Diagnosis**: Daemon spawns child processes but doesn't reap them (missing SIGCHLD handler)
- **Detection**: `ps axo pid,ppid,stat,comm | grep Z` shows zombie children
- **Fix**: Install SIGCHLD handler with `wait()` or `waitpid()`, use `signal(SIGCHLD, SIG_IGN)` if children are fire-and-forget

### 3. **Connection Leak Cascade**
- **Symptoms**: "Too many open files" errors, service degrades over time, works fine after restart
- **Diagnosis**: File descriptors or network connections not closed properly
- **Detection**: `lsof -p <daemon_pid> | wc -l` grows continuously, eventual EMFILE errors
- **Fix**: Add connection pooling with max limits, implement proper cleanup in error paths, set `LimitNOFILE` in systemd

### 4. **Log Disk Explosion**
- **Symptoms**: Disk space alerts, daemon crashes with "No space left on device"
- **Diagnosis**: No log rotation configured, daemon writes unbounded logs
- **Detection**: Log files in GB range, df shows /var/log at 100% capacity
- **Fix**: Configure logrotate/newsyslog, use systemd journald with `SystemMaxUse`, add log level controls

### 5. **Rate Limit Thrash (AI Daemons)**
- **Symptoms**: High latency, request timeouts, alternating success/failure patterns
- **Diagnosis**: No backoff after rate limit hits, daemon hammers API repeatedly
- **Detection**: Provider API returns 429 errors, response times spike periodically
- **Fix**: Implement exponential backoff, parse Retry-After headers, circuit breaker per provider

## Worked Examples

### AI Daemon Case Study: LLM Rate Limit Management

**Scenario**: Building an AI daemon that processes user requests through OpenAI API, needs 99.9% uptime with graceful rate limit handling.

**1. Initial Architecture Decision**
```bash
# Decision: Multi-provider with circuit breakers
# Primary: OpenAI GPT-4, Secondary: Anthropic Claude, Tertiary: Local model

# systemd unit file choice
Type=notify  # Daemon signals when fully initialized
Restart=on-failure
RestartSec=10
```

**2. Rate Limiting Implementation**
```typescript
// Token bucket per provider (expert catches: different providers = different limits)
const rateLimiters = {
  openai: new TokenBucket({ tokensPerMinute: 40000, burstCapacity: 8000 }),
  anthropic: new TokenBucket({ tokensPerMinute: 25000, burstCapacity: 5000 }),
};

// Novice mistake: Request-based limiting
// Expert insight: LLM APIs are token-based, not request-based
async processRequest(req: LLMRequest) {
  const estimatedTokens = this.estimateTokens(req.prompt, req.maxTokens);
  await this.rateLimiters.openai.acquire(estimatedTokens);
  // ... proceed with API call
}
```

**3. Circuit Breaker Configuration**
```typescript
// Expert trade-off: Aggressive vs Conservative failover
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,     // Conservative: 5+ for stable APIs, 3 for flaky ones
  timeout: 30000,          // Aggressive: 15s, Conservative: 60s
  resetTimeout: 60000,     // How long to wait before retry
});

// Decision point: When to fail over?
if (error.status === 429) {
  // Rate limited: backoff on primary, don't fail over yet
  await this.exponentialBackoff(provider, error.retryAfter);
} else if (error.status >= 500) {
  // Server error: immediate failover to secondary
  this.circuitBreaker.recordFailure('openai');
}
```

**4. Graceful Shutdown Pattern**
```typescript
// Expert catches: Race conditions in shutdown
let shutdownInProgress = false;

process.on('SIGTERM', async () => {
  if (shutdownInProgress) return; // Idempotent shutdown
  shutdownInProgress = true;
  
  console.log('SIGTERM received, draining connections...');
  
  // 1. Stop accepting new requests
  server.close();
  
  // 2. Wait for in-flight requests (with timeout)
  const drainTimeout = setTimeout(() => {
    console.log('Drain timeout, force exit');
    process.exit(1);
  }, 25000); // systemd TimeoutStopSec=30, so exit by 25s
  
  await Promise.all([
    this.drainActiveRequests(),
    this.flushRateLimitState(), // Save token bucket state to disk
  ]);
  
  clearTimeout(drainTimeout);
  process.exit(0);
});
```

**5. Trade-offs and Decision Results**
- **Aggressive restart**: `RestartSec=5` for quick recovery vs `RestartSec=30` to avoid thrashing
- **Circuit breaker**: 3 failures for failover (catches transient issues) vs 5 failures (more stable)
- **Drain timeout**: 25s (safe margin) vs 29s (maximize request completion)
- **Result**: 99.95% uptime achieved, average failover time 2.3 seconds

## Quality Gates

- [ ] Boot test passes: Service starts automatically after system reboot
- [ ] Log rotation configured: Logs rotate daily/weekly, old logs purged, no disk space growth
- [ ] SIGTERM handling verified: Graceful shutdown completes within TimeoutStopSec
- [ ] Health endpoint responds: HTTP 200 with meaningful status (uptime, queue depth, dependencies)
- [ ] Restart backoff works: Service doesn't enter tight restart loop on immediate crash
- [ ] Resource limits enforced: Memory/CPU/file descriptor limits prevent resource exhaustion
- [ ] Non-root execution: Service runs as dedicated user with minimal privileges
- [ ] Config reload tested: SIGHUP reloads configuration without full restart
- [ ] Crash recovery verified: Process crash triggers automatic restart within RestartSec
- [ ] Security hardening applied: NoNewPrivileges, ProtectSystem, ReadWritePaths configured
- [ ] For AI daemons: Token-based rate limiting implemented with proper estimation
- [ ] For AI daemons: Provider failover works when primary returns 5xx errors

## Not-For Boundaries

**This skill is NOT for:**
- **Container orchestration**: For Kubernetes deployments, Docker Swarm, or container-specific supervision → use `devops-automator`
- **One-shot scheduled tasks**: For cron jobs that run and exit, periodic batch processing → use `task-scheduler` 
- **Web application deployment**: For nginx/Apache configuration, reverse proxy setup, SSL termination → use `backend-architect`
- **Queue worker frameworks**: For Sidekiq, Celery, Bull queues with built-in supervision → use `background-job-orchestrator`
- **Development process management**: For hot-reloading, file watching, development servers → use standard dev tooling (nodemon, cargo watch)
- **Database administration**: For MySQL/PostgreSQL service configuration → use `database-architect`

**Delegate to other skills when:**
- Building microservice architecture → `backend-architect` handles service mesh, load balancing
- Setting up CI/CD pipelines → `devops-automator` handles deployment automation
- Implementing job queues → `background-job-orchestrator` handles queue-specific patterns
- Creating always-on AI agents → `always-on-agent-architecture` handles AI-specific lifecycle needs