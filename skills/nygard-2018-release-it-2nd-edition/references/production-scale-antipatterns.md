# Antipatterns That Only Appear at Production Scale

## The Central Paradox: Testing Cannot Reveal These Problems

> "You get bitten by Scaling Effects when you move from small one-to-one development and test environments to full-sized production environments."

> "This type of defect cannot be tested out; it must be designed out."

Development and QA environments are **deliberately scaled down**:
- QA: 2 servers per tier (web, app, database)
- Production: 50 servers per tier
- Ratio: 1:25

**Why this matters**: Antipatterns that scale nonlinearly (O(n²), O(n log n)) are invisible at QA scale but catastrophic at production scale.

This document catalogs the seven scaling antipatterns with mechanical explanations of why they only appear at scale.

---

## Antipattern 1: Point-to-Point Communication (O(n²) Scaling)

### The Mechanism

> "The total number of connections goes up as the square of the number of instances."

**Setup**: Each server instance maintains direct connections to every other instance.

**At QA scale (2 instances)**:
- Instance A → Instance B: 1 connection
- Instance B → Instance A: 1 connection
- Total: 2 connections (manageable)

**At production scale (50 instances)**:
- Each instance connects to 49 others: 49 connections per instance
- Total: 50 × 49 = 2,450 connections
- **Each connection consumes**: file descriptor, socket buffer (8-16KB read + 8-16KB write), memory for TCP state machine, CPU for keepalive packets

**Result**: Connection table explosion, memory exhaustion, CPU spent on connection management rather than work.

**Real Example: Cluster Manager**

Early versions of application servers (JBoss, WebLogic) used fully-connected cluster topologies:
- Each instance had list of all other instances
- Heartbeat messages sent to every peer every 5 seconds
- Session replication required opening connection to every peer

**At 10 instances**: 90 connections, 18 heartbeats/second per instance (manageable)  
**At 50 instances**: 2,450 connections, 490 heartbeats/second per instance (**CPU maxed out on heartbeats alone**)

### Defense: Hub-and-Spoke or Mesh-Free Topologies

**Solution 1: Message Broker (Hub-and-Spoke)**
```
Instances → Message Broker (RabbitMQ, Kafka) ← Instances
```
- N instances = N connections (to broker)
- Broker handles fan-out/fan-in
- Scales linearly (O(n))

**Solution 2: Loose Clustering (No Direct Connections)**
- Instances don't know about each other
- Service discovery (DNS, Consul, ZooKeeper) provides "who's available?"
- Caller picks one instance at random, makes request
- No persistent connections, no heartbeats

**Solution 3: Gossip Protocol (Probabilistic Mesh)**
- Each instance talks to a fixed number of random peers (e.g., 3)
- Information spreads logarithmically: O(log n) hops to reach all nodes
- Total connections: 3n (linear)

### Critical Distinction

> "Be sure to distinguish between point-to-point inside a service versus point-to-point between services."

**Inside a service**: Load balancer distributes requests; instances don't talk to each other. **Safe.**

**Between services**: If Service A (50 instances) calls Service B (50 instances) via direct connection, you get 2,500 potential connection pairs. **Dangerous.**

---

## Antipattern 2: Shared Resources Become Bottlenecks

### The Mechanism

> "When the shared resource gets overloaded, it'll become a bottleneck limiting capacity."

**Setup**: Multiple application servers share a single resource (database, cache, lock manager, session store).

**At QA scale (2 app servers, 1 database)**:
- 2 × 40 threads = 80 concurrent queries
- Database handles 80 queries easily (< 10% utilization)

**At production scale (50 app servers, 1 database)**:
- 50 × 40 threads = 2,000 concurrent queries
- Database at 100% CPU, query latency spikes from 5ms → 500ms
- **Cascading failure**: slow database → slow app servers → timeouts → retries → more load on database → collapse

**Real Example: Lock Manager**

Commerce site with pessimistic locking on inventory (to prevent overselling):
- QA: 2 app servers, few concurrent orders
- Production: 50 app servers, Black Friday flash sale

**Failure**:
- Popular item (limited quantity) being ordered by 5,000 users simultaneously
- Every order attempts to acquire write lock on that item's inventory row
- Lock manager (Oracle, shared across all app servers) serializes access: **only one thread at a time can hold lock**
- 4,999 threads blocked waiting for lock
- Lock manager's CPU at 100% managing lock queue
- **Site hangs for 30 minutes** until flash sale ends

**Why QA Didn't Catch It**: QA never had 5,000 concurrent orders on the same item.

### The Scalable Answer

> "The most scalable architecture is the shared-nothing architecture. Each server operates independently, without need for coordination or calls to any centralized services."

**Shared-Nothing Examples**:
- Each server has local cache (no central cache)
- Each server has independent database (sharded by user ID or region)
- No distributed locks; use optimistic concurrency (versioning, compare-and-swap)

**Trade-Off**: Shared-nothing sacrifices consistency (eventual consistency, conflict resolution) for availability and partition tolerance (CAP theorem).

### When You Can't Avoid Shared Resources

**Mitigation Strategies**:

1. **Scale the Shared Resource Horizontally**
   - Database: read replicas (eventual consistency acceptable for most reads)
   - Cache: partition cache into shards (Memcached, Redis Cluster)
   - Lock manager: use distributed lock service (ZooKeeper, etcd) with quorum

2. **Bulkhead Access to Shared Resource**
   - Reserve connection pool capacity for critical operations
   - Example: 40 connections total, 10 reserved for checkout, 30 for general browsing
   - If browsing floods connection pool, checkout still works

3. **Rate Limit Requests to Shared Resource**
   - Token bucket or leaky bucket algorithm
   - Each app server gets quota (e.g., 100 requests/second to database)
   - Excess requests fail fast (HTTP 429) instead of queueing indefinitely

---

## Antipattern 3: Unbalanced Capacities

### The Mechanism

> "The front end always has the ability to overwhelm the back end, because their capacities are not balanced."

**Setup**:
- Front-end tier: 50 servers × 200 threads/server = 10,000 concurrent requests
- Back-end tier: 10 servers × 40 threads/server = 400 concurrent requests

**Ratio**: 25:1 front-end capacity to back-end capacity.

**Normal Operation**: Front-end at 10% utilization (1,000 active requests), back-end at 25% utilization (100 active requests). **Balanced.**

**Marketing Campaign**: "Free shipping today only!" drives 4× traffic spike.

**Result**:
- Front-end at 40% utilization (4,000 active requests)
- Back-end at **100% utilization** (400 active requests, queue backing up)
- **Front-end threads start timing out** because back-end is slow
- Timeouts trigger retries → **additional load on back-end**
- Back-end collapses, front-end cascade fails

**Why QA Didn't Catch It**:

> "In production, the ratio could be ten to one or worse."

QA environments typically have 1:1 or 2:1 ratios (2 front-end servers, 1 back-end server). The ratio problem is invisible.

### Real Example: Thanksgiving Black Friday (Chapter 6 Case Study)

**Setup**:
- 100 front-end servers (3,000 request threads)
- Scheduling service: 4 servers normally, but:
  - 2 servers down for holiday maintenance
  - 1 server malfunctioning
  - **1 server left, capacity for 25 concurrent requests**

**Ratio**: 3,000:25 = **120:1** front-end to back-end.

**Timeline**:
- 20 minutes in: SiteScope (synthetic monitoring) fails; all health checks red
- Front-end threads blocked waiting for scheduling service
- Scheduling service at 100% CPU, unable to respond
- **Loss rate**: ~$1 million/hour

**Recovery** (from teaching notes):
- Used Perl script to set scheduling connection pool max to 0 (stopped new requests)
- Restarted that specific pool (not entire servers)
- Returned to 250ms response time and green health checks within 90 seconds
- Later, script allowed ops to dial pool max up/down based on load

**Key Insight**: The fix wasn't "add more scheduling servers" (took days to provision). The fix was **admission control**: refuse work you can't complete.

### Defense Patterns

1. **Capacity Planning with Realistic Ratios**
   - Don't use 1:1 ratios in QA
   - Model production topology: if prod has 10:1 ratio, QA should have 5:1 minimum

2. **Load Testing with Realistic Traffic Mix**
   - Don't just test "X users doing checkout"
   - Test: 80% browsing, 15% searching, 5% checkout (realistic proportions)
   - Expensive operations (checkout, scheduling) consume more back-end capacity per request

3. **Admission Control (Back Pressure)**
   - Back-end advertises "I can accept X requests/second"
   - Front-end respects limit: if back-end says "50 req/s max", front-end sends ≤ 50
   - Excess requests rejected immediately (HTTP 503) instead of queueing

4. **Bulkhead Critical Paths**
   - Reserve back-end capacity for high-value transactions
   - Example: 40 threads total, 30 for general requests, 10 reserved for checkout
   - Browsing can't starve checkout

---

## Antipattern 4: Dogpile (Synchronized Demand Surge)

### The Mechanism

> "When a bunch of servers impose this transient load all at once."

**Setup**: All servers perform the same initialization task simultaneously.

**Examples**:
1. **Cron Jobs at Midnight**: 50 servers all run hourly report generation at :00 mark
2. **Cache Expiration**: 50 servers all fetch same data after cache expires (TTL expires at exactly same time)
3. **Power-On Surge**: Data center loses power, 1,000 servers reboot simultaneously, all attempt to populate caches from database

**Result**: Synchronized demand surge on shared resource (database, external API) creates **transient overload** that looks like DDoS attack.

### Real Example: Power Grid Analogy

> "After blackout, circuit breaker trips from inrush demand. Millions of air conditioners and refrigerators coming online simultaneously. Synchronized surge of current exceeds available generation. Lights out again."

**Software Analog**: After scheduled maintenance (database restart), 50 app servers all attempt to reconnect simultaneously:
- 50 × 40 threads = 2,000 connection attempts in < 1 second
- Database connection listener queue depth = 100 (default)
- **1,900 connection attempts rejected or timeout**
- Rejected apps retry immediately → **positive feedback loop**
- Database never recovers until someone manually stops app servers and restarts them in waves

### Real Example: Cache Warm-Up After Deployment

**Setup**: 50 app servers, each caches 10,000 most popular items on startup.

**Normal Operation**: App servers restarted one at a time (rolling deployment), cache warm-up spreads over 25 minutes (30 seconds per server × 50). Database sees steady 10,000 queries every 30 seconds. **Manageable.**

**After Outage** (all servers down, all restart simultaneously):
- 50 servers × 10,000 items = **500,000 queries in first 10 seconds**
- Database query queue fills, response time spikes from 5ms → 30,000ms
- App server boot process times out waiting for cache population
- Servers fail health check, load balancer marks them down
- **Entire site down for 20 minutes** until manual intervention (ops staff restart servers in waves)

### Defense: Random Clock Slew

> "Use random clock slew to diffuse the demand. Don't set all your cron jobs for midnight."

**Solution**:
```python
import random
import time

def cron_with_jitter(task_function, interval_seconds):
    while True:
        jitter = random.uniform(0, interval_seconds * 0.1)  # 10% jitter
        time.sleep(interval_seconds + jitter)
        task_function()
```

**Result**: If interval is 1 hour (3,600 seconds), jitter spreads execution across 360-second window (6 minutes). 50 servers now execute over 6 minutes instead of same second.

**Other Jitter Applications**:
- Cache TTL: `ttl = 3600 + random.randint(0, 360)`
- Retry backoff: `time.sleep(2**attempt + random.random())`
- Health check intervals: `check_every = 30 + random.randint(0, 5)`

---

## Antipattern 5: Force Multiplier (Automation Amplifies Failures)

### The Mechanism

> "Automation has no judgment. When it goes wrong, it tends to do so really, really quickly. By the time a human perceives the problem, it's a question of recovery rather than intervention."

**Setup**: Automation observes system state, decides action, executes at scale.

**Failure Mode**: Automation observes **incorrect state** (partial data, corrupted metrics, network partition), makes **wrong decision**, executes **at 100× human speed**.

### Real Example: AWS S3 Outage (Feb 28, 2017)

> "An authorized S3 team member using an established playbook executed a command which was intended to remove a small number of servers for one of the S3 subsystems that is used by the S3 billing process. Unfortunately, one of the inputs to the command was entered incorrectly and a larger set of servers was removed than intended."

**What Happened**:
- Command: `remove_capacity subsystem=billing count=5`
- **Typo**: `remove_capacity subsystem=billing count=500` (or misconfigured target filter)
- Tool executed immediately: **shut down 500 servers in < 10 seconds**
- S3 subsystem lost quorum, couldn't serve requests
- Tens of thousands of companies affected
- Recovery: 2 hours for S3, many more hours for dependents

**Key Framing**:

> "This is not a case of humans failing the system. It's a case of the system failing humans. The administrative tools and playbooks allowed this error to happen. They amplified a minor error into enormous consequences."

**AWS's Response**:
> "We have modified this tool to remove capacity more slowly and added safeguards to prevent capacity from being removed when it will take any subsystem below its minimum required capacity level."

**Two Safeguards Added**:
1. **Throttling**: Remove capacity slowly (e.g., 10 servers/minute instead of 500/second)
2. **Guardrails**: Refuse to execute if action would drop capacity below minimum threshold

### Real Example: Reddit Autoscaling Cascade (Aug 2016)

**Setup**: Reddit uses autoscaler to add/remove EC2 instances based on load.

**Failure**:
1. Admins shut down autoscaler to upgrade ZooKeeper (configuration database)
2. Package management system restarted autoscaler mid-upgrade (race condition)
3. Autoscaler read **incomplete ZooKeeper data** (partial migration state)
4. Autoscaler decided environment was 1/10th its actual size
5. Autoscaler shut down **90% of servers in < 2 minutes**
6. Site down; ops manually restarted servers
7. All servers came up with empty caches → **dogpile on database** (see Antipattern 4)
8. Slow recovery until caches warmed

**Root Cause**: Conflicting "desired state" representations. Autoscaler relied on ZooKeeper to be consistent, but it wasn't during maintenance.

### The Control Plane Failure Pattern

> "The automation is not being used to simply enact the will of a human administrator. Rather, it's more like industrial robotics: the control plane senses the current state of the system, compares it to the desired state, and effects changes."

**The Problem**: Sensors can lie. If sensor reports "zero services available," is that true? Or is the sensor partitioned?

**Safeguard**:

> "If observations report that more than 80 percent of the system is unavailable, it's more likely to be a problem with the observer than the system."

**Implementation**:
```python
def autoscale_decision(observed_capacity, desired_capacity):
    if observed_capacity < desired_capacity * 0.2:
        log.error("Observed capacity suspiciously low; sensor may be faulty")
        return "HOLD"  # Don't scale down
    elif observed_capacity < desired_capacity * 0.8:
        return "SCALE_UP"
    elif observed_capacity > desired_capacity * 1.2:
        return "SCALE_DOWN"
    else:
        return "OK"
```

### Defense Patterns

1. **Rate Limiting (Governors)**
   - Limit speed of dangerous actions (shutdown, delete)
   - Example: "Can shut down at most 10% of fleet per minute"

2. **Confirmation Gates**
   - Require human confirmation for large-scale actions
   - Example: "Shutting down >50% of capacity requires approval"

3. **Hysteresis (Asymmetric Rates)**
   - Safe direction = fast; dangerous direction = slow
   - Example: "Scale up fast (30s), scale down slow (5 min)"

4. **Sanity Checks**
   - Cross-reference multiple data sources before acting
   - Example: "If ZooKeeper says 5 instances but load balancer says 50, trust load balancer"

5. **Dry-Run Mode**
   - Automation logs what it *would* do, doesn't execute
   - Human reviews logs, approves, then automation executes

---

## Antipattern 6: Slow Responses (Worse Than No Response)

### The Mechanism

> "Slow responses tend to propagate upward from layer to layer in a gradual form of cascading failure."

**Setup**: Lower layer (database, external API) responds slowly but doesn't timeout.

**Effect on Caller**:
- Caller's thread blocked longer (more resources consumed)
- Caller's timeout eventually fires (after 30s, 60s, or never if no timeout)
- **Queues back up** in caller because threads aren't retiring quickly

**User Behavior Amplification**:

> "Users waiting for pages frequently hit the Reload button, generating even more traffic to your already overloaded system."

**The Math**:
- Normal: 1,000 users, 100ms response time → 10 requests/second capacity needed
- Slow: 1,000 users, 10,000ms response time → 1,000 concurrent requests (100× resource consumption)
- Users reload after 10s → **2,000 concurrent requests** (each user has 2 in flight)

**Result**: System collapses under load that's only 2× normal user count but 200× resource consumption.

### Real Example: The Launch Crash (Black Monday Incident, p. 86-87)

**Setup**: Commerce server with 100+ load-balanced instances.

**Symptom**:
1. All instances using 100% CPU
2. Instances crash with HotSpot memory errors
3. Operations restarting instances as fast as possible but losing the race
4. Only 25% capacity available at any time

**Root Cause**:
- Message table for cache-flushing signals grew to **10+ million rows** (should have been ≤1,000)
- Each app server tried to "SELECT * FROM messages" without LIMIT clause (unbounded result set)
- Query took 5+ minutes, consumed 2GB memory per instance
- While query ran, all other threads blocked waiting for database connection from pool
- Instance exhausted memory, JVM crashed
- Next instance restarted, attempted same query → crash
- **Cascading restarts**

**Why Slow Response Made It Worse**:
- If query had timed out after 30s, instance would have recovered
- But query never timed out → instance hung for 5+ minutes before crashing
- During those 5 minutes, **load balancer still sent traffic** → queue backed up → crash even faster

### Root Causes of Slow Responses

1. **Memory Leaks → Garbage Collection Overhead**
   - Heap 90% full → GC runs constantly (stop-the-world pauses)
   - Application thread runs 10ms, then paused 200ms for GC
   - Response time degrades from 50ms → 2,000ms

2. **Resource Contention**
   - Database lock contention (write lock held too long)
   - File system lock (antivirus scanning files while app tries to read)
   - Network contention (shared 1Gbps link saturated)

3. **Inefficient Algorithms at Scale**
   - O(n²) algorithm fine with 100 items, catastrophic with 10,000
   - Example: nested loop over user list (10,000 users × 10,000 items = 100M operations)

### Defense Patterns

1. **Fail Fast**
   - Prefer fast failure over slow failure
   - Example: If database query queue >100, reject new queries immediately (HTTP 503)

2. **Timeouts Everywhere**
   - Set aggressive timeouts on all I/O (socket, HTTP, database, cache)
   - Example: 95th percentile response time + 50% margin = timeout value

3. **Load Shedding**
   - When response time exceeds SLA, start rejecting new work
   - Example: If average response time >1s, return HTTP 503 to 50% of new requests

4. **Circuit Breaker**
   - After N consecutive slow responses, stop calling that service
   - Return cached data or default value instead

---

## Antipattern 7: Unbounded Result Sets

### The Mechanism

> "The only sensible numbers are 'zero,' 'one,' and 'lots,' so unless your query selects exactly one row, it has the potential to return too many."

**Setup**: Database query with no LIMIT clause. Typically fine during development (small data sets).

**Production**: Data grows over time. Query that returned 100 rows last month returns 100,000 rows today.

**Effect**:
- Memory allocation for 100,000 objects (OOM exception)
- Serialization overhead (JSON encoding 100,000 rows)
- Network transmission (100MB response payload)
- **Caller consumes excessive memory**, possibly crashes

### Real Example: Black Monday Message Table (Full Detail)

**Schema**:
```sql
CREATE TABLE messages (
    message_id INT PRIMARY KEY,
    message_type VARCHAR(50),
    payload TEXT,
    created_at TIMESTAMP
);
```

**Intended Use**: App servers publish cache invalidation signals. Messages deleted after processing.

**Bug**: Deletion logic had race condition → messages accumulated instead of being deleted.

**Growth**: 10 million rows (should have been ≤1,000).

**Query**:
```sql
SELECT * FROM messages WHERE message_type = 'cache_invalidation';
```

**No LIMIT clause. No pagination.**

**Result**:
- JDBC driver fetches all 10 million rows into memory (default behavior)
- Each row ~1KB → **10GB memory consumption per app server**
- JVM heap size: 2GB
- **OutOfMemoryError**
- App server crashes
- Next server restarts, attempts same query → crash

**Cascade**: 100 servers crashing in sequence faster than ops could restart them.

**Fix (Immediate)**:
```sql
DELETE FROM messages WHERE created_at < NOW() - INTERVAL 1 DAY;
```

**Fix (Permanent)**:
```sql
SELECT * FROM messages WHERE message_type = 'cache_invalidation' LIMIT 1000;
```

### Power Law Distribution Risk

> "If you test with bell-curve distributed relationships, you would never expect to load an entity that has a million times more relationships than the average. But that's guaranteed to happen with a power law."

**Example: Social Network**

**Bell Curve Assumption**: Average user has 500 friends, standard deviation 100. QA tests with users having 300-700 friends.

**Power Law Reality**: 99% of users have <1,000 friends. 1% have >10,000. Top 0.01% have >1,000,000 (celebrities).

**Query**:
```sql
SELECT friend_id FROM friendships WHERE user_id = ?;
```

**Failure**:
- Fetch friends for Justin Bieber (70M followers)
- **70 million rows** returned
- 70M × 8 bytes (INT64) = 560MB just for friend IDs
- Add metadata (timestamps, mutual flags) → **5GB response**
- App server crashes

**QA Didn't Catch It**: QA database had synthetic users with 300-700 friends each (bell curve). No celebrity accounts.

### Defense Patterns

1. **Always Use LIMIT**
   ```sql
   SELECT * FROM items WHERE category = ? LIMIT 100;
   ```
   Even if you "know" result set is small, add LIMIT as insurance.

2. **Pagination for Large Sets**
   ```sql
   SELECT * FROM items WHERE category = ? 
   ORDER BY item_id 
   LIMIT 100 OFFSET ?;
   ```
   Fetch 100 at a time, iterate if needed.

3. **Streaming APIs**
   Instead of loading all rows into memory, process row-by-row:
   ```java
   ResultSet rs = stmt.executeQuery("SELECT ...");
   while(rs.next()) {
       processRow(rs);  // Process one row at a time
   }
   ```

4. **Query Result Size Monitoring**
   Log warning if query returns >10,000 rows:
   ```java
   List results = query(sql);
   if(results.size() > 10000) {
       logger.warn("Large result set: {} rows for query {}", results.size(), sql);
   }
   ```

5. **Test with Production-Sized Data**
   Don't use 1,000-row test databases. Use anonymized production data (10M+ rows).

---

## The Hidden Scale Problem: Interconnected Antipatterns

These antipatterns don't occur in isolation—they **compound**:

**Example Cascade**:

1. **Unbalanced Capacities**: Front-end (10,000 threads) overwhelms back-end (400 threads)
2. **Slow Responses**: Back-end slows from 50ms → 5,000ms (100× slower)
3. **Blocked Threads**: Front-end threads blocked 100× longer
4. **Cascading Failures**: Front-end threads timeout, retry
5. **Dogpile**: Retries arrive simultaneously (because all threads timed out at same time)
6. **Force Multiplier**: Autoscaler sees "back-end unhealthy," shuts down instances, makes problem worse
7. **Unbounded Result Sets**: Slow back-end was trying to return 1M rows instead of 1,000

**Result**: Total system collapse from **combination** of antipatterns, each amplifying the others.

---

## Transfer to Agent Systems (WinDAGs)

### 1. Point-to-Point Between Skills

**Avoid**: Each skill maintaining direct connections to all other skills.

**Instead**: Skills communicate through orchestration layer (hub-and-spoke) or message broker (queue-based).

### 2. Shared Orchestration Resources

**Avoid**: Single global task queue that all skills read from.

**Instead**: Partition task queues by skill group (bulkheads). High-priority skills get dedicated queue.

### 3. Unbalanced Skill Capacities

**Avoid**: 100 skill instances for "validate input" but 5 instances for "call external API."

**Instead**: Capacity planning per skill based on:
- Expected request rate
- P99 response time
- Acceptable queue depth

**Formula**: `instances = (requests/sec × p99_latency_sec) / concurrency_per_instance × 1.5` (50% margin)

### 4. Synchronized Skill Initialization

**Avoid**: All skill instances starting simultaneously, fetching same configuration, warming same cache.

**Instead**: Stagger instance startup with random jitter (0-60 seconds).

### 5. Automation Amplifying Skill Failures

**Avoid**: Orchestrator auto-scaling skills based on queue depth without sanity checks.

**Instead**: 
- Rate-limit scaling decisions (max 10% capacity change per minute)
- Require confirmation for large-scale changes (>50% capacity)
- Cross-reference multiple metrics (queue depth + error rate + latency)

### 6. Skills Returning Slow Responses

**Avoid**: No timeout on skill execution, orchestrator waits indefinitely.

**Instead**:
- Set timeout per skill (e.g., 5× P99 latency)
- After timeout, cancel skill execution, log warning, return partial results or error

### 7. Skills Returning Unbounded Result Sets

**Avoid**: Skill query returns entire database table to orchestrator.

**Instead**:
- Enforce result size limits in skill contracts (e.g., "max 1,000 items per response")
- Use pagination for large result sets
- Skill returns summary + iterator handle, orchestrator fetches pages as needed

---

## Summary: The Scale Testing Mandate

> "Examine production versus QA environments to spot Scaling Effects."

**Key Principle**: These antipatterns are **design-time problems** that are **impossible to detect at QA scale**.

**Solution**: Either:
1. **Test at production scale** (expensive, cloud makes this feasible)
2. **Design them out** (use patterns that scale linearly by default)

**The book's argument**: Option 2 is more cost-effective. Build systems that scale linearly from day one. Then testing at small scale is sufficient.

**For WinDAGs**: Design skills, task queues, and orchestration to avoid O(n²) scaling, shared bottlenecks, and synchronized behavior. Then scale testing becomes easier.