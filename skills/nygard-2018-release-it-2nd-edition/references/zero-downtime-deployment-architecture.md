# Zero-Downtime Deployment as an Architectural Requirement

## The Central Claim: Deployment Is a Feature, Not an Operations Task

> "We treat deployment as a feature."

> "Between the time a developer commits code to the repository and the time it runs in production, code is a pure liability. Undeployed code is unfinished inventory."

This document explains why deployment must be designed into software architecture from day one, not bolted on later. The case studies show the cost of treating deployment as an afterthought: $100K deployment ceremonies, 24-hour outages, and systems that cannot evolve.

---

## The Canonical Failure: The Godot Deployment

### The 24-Hour Ceremony

**Setup**: Major retailer's deployment process (Chapter 12, pp. 236-239):

- **Duration**: 24 hours (6 p.m. Friday → 6 p.m. Saturday)
- **Personnel**: 40+ people across 4 locations
- **Cost**: ~$100K per deployment (labor + risk)
- **Playbook**: Hundreds of steps tracked in "Lamport time" vs. wall clock time
- **Process**:
  - 3 p.m. Friday: Go/no-go meeting
  - 6 p.m.: Begin deployment
  - 1-3 a.m.: UAT (User Acceptance Testing) window
  - 5 a.m.: If passed UAT, continue; if failed, roll back
  - 6 p.m. Saturday: Complete

**Frequency**: 4-6 times per year (quarterly releases)

**The Failed Deployment**:

> "In the end, our deployment failed UAT. Some feature had passed QA because the data in the QA environment didn't match production. Production had extra content that included some JavaScript to rewrite part of a page from a third party and it didn't work with the new page structure."

**Outcome**: Rollback at 5 a.m., reschedule for two days later. Entire deployment army mobilized again.

### The Root Cause: Architecture Prevented Incremental Deployment

**Why 24 hours?**

The system could not be deployed incrementally. The deployment was atomic: **all or nothing.**

**Coupling Issues**:
1. **Schema Changes**: Database schema changes required downtime (ALTER TABLE locks table)
2. **Protocol Changes**: New app code incompatible with old app code (breaking API changes between layers)
3. **Session State**: In-memory session state lost when servers restarted
4. **Configuration Management**: 500+ integration points, all configured in QA-specific files, needed manual translation to production values

**Why Infrequent?**

> "Few releases per year → uniqueness → more pain → discourages more frequent releases (vicious cycle)."

Each deployment was unique (different features, different schema changes). Playbook had to be rewritten each time. No standardization, no automation.

### The Insight: Systems That Can't Be Deployed Safely Can't Evolve

> "The right response is to reduce the effort needed, remove people from the process, and make the whole thing more automated and standardized."

But automation isn't enough. The system's **architecture** prevented safe deployment. No amount of process improvement could fix it.

**Architectural Prerequisites for Zero-Downtime Deployment**:

1. Schema changes must be backward-compatible
2. Protocol changes must support version negotiation
3. Session state must be externalizable or recoverable
4. Configuration must be injected, not embedded
5. Health checks must enable gradual traffic shifting

---

## The Architectural Patterns for Deployment

### Pattern 1: Schema Expansion and Contraction

**Problem**: Adding a column or splitting a table requires locking the table (in traditional RDBMS), causing downtime.

**Solution**: Three-phase deployment (pp. 250-252)

#### Phase 1: Expansion (Before Code Deployment)

Add new schema elements *without removing old ones*.

**Example: Split Table A into A (keys) + B (attributes)**

```sql
-- Phase 1: Add new table, keep old table
CREATE TABLE item_attributes (
    item_id INT PRIMARY KEY,
    color VARCHAR(50),
    size VARCHAR(20),
    weight DECIMAL(10,2)
);

-- Add triggers to keep old and new in sync
CREATE TRIGGER after_item_insert
AFTER INSERT ON items
FOR EACH ROW
BEGIN
    INSERT INTO item_attributes (item_id, color, size, weight)
    VALUES (NEW.item_id, NEW.color, NEW.size, NEW.weight);
END;

CREATE TRIGGER after_item_update
AFTER UPDATE ON items
FOR EACH ROW
BEGIN
    UPDATE item_attributes
    SET color = NEW.color, size = NEW.size, weight = NEW.weight
    WHERE item_id = NEW.item_id;
END;

-- Similar triggers for DELETE
```

**Key**: At this point, both old schema and new schema exist. Triggers keep them synchronized. Old code writes to `items`, triggers propagate to `item_attributes`. New code can write to `item_attributes`, triggers propagate to `items`.

#### Phase 2: Rollout (Deploy New Code Gradually)

Deploy new code instances that use new schema (`item_attributes`). Old code instances still use old schema (`items`). Both work simultaneously because triggers keep data synchronized.

**Rolling deployment**:
- Instance 1-10: Old code (uses `items`)
- Instance 11-20: New code (uses `item_attributes`)
- Gradually shift traffic from old to new (via load balancer health checks)

#### Phase 3: Contraction (After Rollout Complete)

Once 100% of instances are running new code, remove old schema:

```sql
DROP TRIGGER after_item_insert;
DROP TRIGGER after_item_update;
DROP TRIGGER after_item_delete;

ALTER TABLE items DROP COLUMN color;
ALTER TABLE items DROP COLUMN size;
ALTER TABLE items DROP COLUMN weight;
```

**Result**: Zero downtime. At all times, either old or new code works correctly.

### Why This Pattern Requires Application Participation

> "We can enlist the application to help with its own deployment. That way, the application can smooth over the things that normally cause us to take downtime for deployments: schema changes and protocol versions."

The application must:
- Handle both old and new schemas during transition
- Use triggers or application-level logic to synchronize
- Not assume schema is static

**Operations can't do this alone**—it requires design decisions at development time.

---

### Pattern 2: Trickle-Then-Batch Migration for NoSQL

**Problem**: Large data migrations (e.g., document format change in MongoDB) can't run in downtime window.

**Solution** (pp. 254-255): Lazy migration + batch cleanup

#### Step 1: Deploy New Code with Translation Layer

```javascript
function getUser(userId) {
    let doc = db.users.findOne({_id: userId});
    
    if (doc.version === 1) {
        // Old format: {name: "John Doe"}
        // Translate to new format: {firstName: "John", lastName: "Doe"}
        let [firstName, lastName] = doc.name.split(' ');
        doc.firstName = firstName;
        doc.lastName = lastName;
        doc.version = 2;
        
        // Save in new format
        db.users.updateOne({_id: userId}, {$set: doc});
    }
    
    return doc;  // Always returns new format
}
```

**Effect**: Most-accessed documents migrate as they're touched. Latency cost is spread across many requests (each user's first request after deployment does the migration, subsequent requests use new format).

#### Step 2: Batch Migration (Months Later)

After most traffic has migrated hot documents, run batch job for cold documents:

```javascript
db.users.find({version: 1}).forEach(doc => {
    let [firstName, lastName] = doc.name.split(' ');
    db.users.updateOne(
        {_id: doc._id},
        {$set: {firstName, lastName, version: 2}, $unset: {name: ""}}
    );
});
```

**Why wait months?** Proves the translation logic in production before batch-applying it. If translation has bugs, only hot documents affected, easier to roll back.

#### Step 3: Remove Translation Code

Once all documents migrated (verified via query: `db.users.find({version: 1}).count() === 0`), remove translation code in next release.

**Benefits**:
- Zero downtime
- Gradual rollout (low risk)
- Can pause/resume batch migration
- Proves migration logic before applying to all data

---

### Pattern 3: Protocol Versioning and Negotiation

**Problem**: Service A calls Service B. B's API changes (adds required field, changes validation rules). A and B can't be deployed simultaneously.

**Solution**: Versioned APIs + backward compatibility (Chapter 14)

#### Postel's Robustness Principle

> "Be conservative in what you do, be liberal in what you accept from others."

**Applied to APIs**:
- **Service (provider)**: Accept old request formats, return format caller understands
- **Client (consumer)**: Send new optional fields, tolerate missing optional fields in response

#### Example: Loan Application API

**V1 API**:
```json
POST /applications
{
  "borrower": {"name": "John Doe", "ssn": "123-45-6789"},
  "amount": 50000,
  "term": 360
}
```

**V2 Requirements** (breaking changes):
- Split borrower concept (borrower + co-borrower)
- Add country-specific fields (country, tax_id_type)

**Wrong Approach**: Deploy V2, reject all V1 requests. **Result**: All old clients break.

**Right Approach**: Support both V1 and V2 simultaneously.

**Implementation**:

```javascript
// V1 endpoint (kept for backward compatibility)
app.post('/v1/applications', (req, res) => {
    let v1Request = req.body;
    
    // Convert V1 to internal V2 format
    let v2Request = {
        borrower: {
            name: v1Request.borrower.name,
            ssn: v1Request.borrower.ssn,
            country: "US",  // Default
            tax_id_type: "SSN"
        },
        co_borrower: null,  // Not in V1
        amount: v1Request.amount,
        term: v1Request.term
    };
    
    // Process using V2 business logic
    let v2Response = processApplication(v2Request);
    
    // Convert V2 response back to V1 format
    let v1Response = {
        application_id: v2Response.application_id,
        status: v2Response.status
        // Omit new V2 fields that V1 clients don't understand
    };
    
    res.json(v1Response);
});

// V2 endpoint (new clients)
app.post('/v2/applications', (req, res) => {
    let v2Request = req.body;
    let v2Response = processApplication(v2Request);
    res.json(v2Response);
});
```

**Key**: Business logic only understands V2. API layer translates V1 ↔ V2. Old clients work without modification.

#### When Can You Deprecate V1?

> "Once the service is public, a new version cannot reject requests that would've been accepted before. Anything else is a breaking change."

**Process**:
1. Deploy V2 alongside V1 (both active)
2. Monitor V1 usage (log every V1 request)
3. Contact V1 clients, encourage upgrade to V2
4. Once V1 usage <1% and declining, announce deprecation date (e.g., 6 months)
5. After deprecation date, V1 returns HTTP 410 Gone (not 404)
6. Eventually remove V1 code

**Timeline**: Expect 1-2 years to fully deprecate old API version for public services.

---

### Pattern 4: Feature Toggles for Gradual Rollout

**Problem**: New feature is high-risk (major UI change, new algorithm). Want to deploy code but not activate for all users.

**Solution**: Feature toggle (aka feature flag)

**Implementation**:

```java
@RestController
public class CheckoutController {
    @Autowired
    private FeatureToggleService toggles;
    
    @PostMapping("/checkout")
    public Response checkout(User user, Cart cart) {
        if (toggles.isEnabled("new_payment_flow", user)) {
            return newPaymentFlow(user, cart);  // V2
        } else {
            return oldPaymentFlow(user, cart);  // V1
        }
    }
}
```

**FeatureToggleService**:
```java
public class FeatureToggleService {
    public boolean isEnabled(String featureName, User user) {
        // Gradual rollout strategies:
        
        // 1. Canary: 5% of users
        if (user.hashCode() % 100 < 5) return true;
        
        // 2. Internal users only
        if (user.isEmployee()) return true;
        
        // 3. Specific user IDs (VIP beta testers)
        if (betaTesterIds.contains(user.id)) return true;
        
        // 4. Configuration-based (ops can toggle)
        return config.getBoolean("features." + featureName + ".enabled");
    }
}
```

**Rollout Plan**:
1. Week 1: Internal employees only (100 users)
2. Week 2: 1% of users (10,000 users)
3. Week 3: 10% of users (100,000 users)
4. Week 4: 50% of users (500,000 users)
5. Week 5: 100% of users (1M users)

**Monitoring**: Track error rate, latency, conversion rate for new vs. old flow. If new flow has higher error rate, dial back to 1%.

**Benefit**: Deploy code once, control activation separately. If new flow has problems, disable it without redeploying.

---

### Pattern 5: Health Checks for Traffic Management

**Problem**: During rolling deployment, load balancer needs to know when new instance is ready to receive traffic.

**Solution**: Health check endpoint (pp. 200-202)

**Implementation**:

```java
@RestController
public class HealthCheckController {
    @Autowired
    private DatabaseConnectionPool dbPool;
    
    @Autowired
    private CacheClient cache;
    
    @GetMapping("/health")
    public ResponseEntity<HealthStatus> health() {
        HealthStatus status = new HealthStatus();
        
        // Check database connectivity
        if (dbPool.getActiveConnections() == 0) {
            status.addIssue("database", "No active connections");
        }
        
        // Check cache connectivity
        if (!cache.isConnected()) {
            status.addIssue("cache", "Cache unreachable");
        }
        
        // Check application state
        if (!applicationInitialized) {
            status.addIssue("initialization", "Still warming up");
        }
        
        // Return appropriate HTTP status
        if (status.hasIssues()) {
            return ResponseEntity.status(503).body(status);  // Service Unavailable
        } else {
            return ResponseEntity.ok(status);
        }
    }
}
```

**Health Status Response**:
```json
{
  "status": "healthy",
  "version": "2.3.1",
  "host": "10.0.1.42",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "circuit_breakers": {
      "payment_gateway": "open",
      "inventory_service": "closed"
    }
  }
}
```

**Load Balancer Configuration**:
```yaml
health_check:
  path: /health
  interval: 10s
  timeout: 5s
  healthy_threshold: 2    # 2 consecutive successes → healthy
  unhealthy_threshold: 3  # 3 consecutive failures → unhealthy
```

**Deployment Flow**:

1. Deploy new instance (version 2.3.1)
2. Instance starts, health check returns 503 (still initializing)
3. Load balancer doesn't send traffic (instance marked unhealthy)
4. After 30 seconds, initialization complete, health check returns 200
5. After 2 consecutive successes (20 seconds), load balancer marks instance healthy
6. Load balancer starts sending traffic (gradual ramp-up: 1%, 5%, 10%, ...)
7. If new instance's error rate spikes, health check can return 503, load balancer stops sending traffic

**Result**: New code doesn't receive traffic until it's ready. If it fails after receiving traffic, load balancer automatically removes it from pool.

---

## The Launch Crash Case Study: Why Architecture Matters

### Setup (Chapter 15, pp. 275-288)

**Project**:
- 3-year greenfield rewrite of entire commerce platform
- 300+ person team
- 1 month of load testing (target: 25,000 concurrent sessions)
- First load test: crashed at 1,200 sessions
- After 3 months tuning: achieved 12,000 sessions
- Marketing revised launch target to 12,000 sessions

**Launch Day**:
- 9:05 a.m.: 10,000 sessions (within target)
- 9:10 a.m.: 50,000 sessions (4× target)
- 9:30 a.m.: 250,000 sessions (20× target)
- **Total crash**

### Why Load Testing Failed to Predict Failure

> "None of the load-testing scripts tried hitting the same URL, without using cookies, 100 times per second...All the test scripts obeyed the rules."

**Load tests simulated well-behaved users**:
- Accepted cookies
- Followed links sequentially
- Searched, browsed, added to cart, checked out (realistic user journey)

**Real traffic included**:
1. **Search engine crawlers**: Re-fetching old URLs (site had been redesigned, URLs changed). Each 404 created a session.
2. **Session ID in query params**: Security team mandated session IDs in URLs instead of cookies (to prevent session fixation). Search engines crawled pages, each with different session ID → 10 sessions/second per engine.
3. **Bots and scrapers**: ~12 high-volume price comparison bots. None handled cookies properly. One rotating-IP scraper created 50 sessions/second.
4. **Random weird stuff**: Navy base machines making repeated requests without user agents.

**Session Replication Disaster**:

Sessions replicated for failover (via serialization to backup server). Sessions contained:
- User ID, shopping cart (up to 500 items), search results (500 items), browse history

**At 250,000 sessions**:
- Average session size: 50KB (due to overstuffing)
- Total memory: 250K × 50KB = 12.5GB (across 100 servers = 125MB per server)
- **But**: Replication overhead consumed 80% of CPU
- Servers couldn't keep up; replication queue backed up
- GC thrashing (heap 95% full) → stop-the-world pauses
- **Session failover disabled** (ops decision to restore service)

### The Architectural Failures

1. **No Session Size Limits**: Shopping cart stuffed into session (should have been in database)
2. **No Session Count Limits**: No limit on sessions per IP (scrapers created unlimited sessions)
3. **No Bot Detection**: No CAPTCHA, no rate limiting, no robots.txt enforcement
4. **Synchronous Session Replication**: Replication blocking request threads (should have been async)
5. **No Deployment Rollback Plan**: Once deployed, couldn't roll back (schema changes, data migrations already applied)

### The Fixes (Temporary and Permanent)

**Immediate (Day 1)**:
1. CDN gateway page: require cookie support, throttle new sessions, block IPs
2. Static home page instead of personalized (killed personalization feature)
3. Block scrapers via legal action (short-lived, bots returned with new IPs)
4. Rolling restarts every 4 hours (because session memory leak; lasted a *decade*, became permanent)
5. Disable session failover (meant checkout failures = lost orders)

**Permanent (Next 2 Years)**:
1. Session size limits (25KB max; larger data moved to database)
2. Bot detection (CAPTCHA after 3 failed cookie checks)
3. Rate limiting (max 10 sessions per IP per minute)
4. Async session replication (queued, batched)
5. Health-check-based load shedding (when server overloaded, return HTTP 503)

**Result**: Two years later, system handled 4× original launch traffic on fewer servers. But reputation damage was done; CEO replaced.

### The Lesson: Architecture Determines Operational Cost

> "Your early decisions make the biggest impact on the eventual shape of your system. The earliest decisions you make can be the hardest ones to reverse later."

**The architectural decisions that caused the crash were made 2 years before launch**:
- Session replication strategy (synchronous)
- Session storage strategy (in-memory)
- Security strategy (session IDs in URLs)

**These could not be changed during the incident**—they were baked into the system.

**The ROI argument**: 
- Cost of designing session management correctly (async replication, DB-backed sessions, bot detection): ~$200K (6 months, 2 engineers)
- Cost of launch crash: ~$50M (lost revenue + reputation damage + 2 years of remediation)
- **ROI**: 250:1

---

## The Immutable Infrastructure Model

### The "Layers of Stucco" Problem

**Traditional Configuration Management (Chef, Puppet, Ansible)**:
- Start with base OS image
- Apply layer 1: security patches
- Apply layer 2: app server installation
- Apply layer 3: application deployment
- Apply layer 4: configuration updates

> "The 'layers of stucco' approach has two big challenges. First, it's easy for side effects to creep in that are the result of, but not described by, the recipes."

**Example of Hidden State**:

1. Chef recipe installs Package v12.04 (has post-install script that changes TCP tuning parameters)
2. Month later, Chef installs Package v12.08 (post-install script changes subset of original parameters)
3. **Result**: Machine has state that cannot be re-created by either recipe alone (history-dependent state)

**The Consequence**: Configuration drift. Two machines installed at different times, using "same" Chef recipes, have **different actual states**.

### The Immutable Alternative

> "The DevOps and cloud community say that it's more reliable to always start from a known base image, apply a fixed set of changes, and then never attempt to patch or update that machine. Instead, when a change is needed, create a new image starting from the base again."

**Process**:
1. Base image: Ubuntu 20.04 LTS (never changes)
2. Build pipeline creates new image:
   - Install security patches (as of today)
   - Install app server v2.3.1
   - Deploy application v1.2.3
   - **Bake into image** (AMI in AWS, snapshot in GCP)
3. Deploy image to production (replace old instances)
4. **Never SSH into production machines** to make changes

**Benefits**:
- Reproducible: Same image produces same machine
- Testable: Test exact image that goes to production
- Rollback: Keep old images, redeploy if needed

**Trade-Offs**:
- Slower iteration: Every change requires new image build (5-10 minutes)
- Less flexibility: Can't hot-patch production without redeploying

### The 12-Factor App Model (Configuration Injection)

> "When you design an application for containers, keep a few things in mind. First, the whole container image moves from environment to environment, so the image can't hold things like production database credentials."

**The 12 Factors** (summarized from pp. 161-163):

1. **Codebase**: One codebase per app, tracked in version control
2. **Dependencies**: Explicitly declared and isolated (package manifest)
3. **Config**: Store config in environment (not in code)
4. **Backing services**: Treat as attached resources (URL/credentials from env)
5. **Build, release, run**: Strict separation
6. **Processes**: Execute as stateless processes
7. **Port binding**: Export services via port binding (not rely on web server)
8. **Concurrency**: Scale out via process model (horizontal scaling)
9. **Disposability**: Fast startup, graceful shutdown
10. **Dev/prod parity**: Keep environments similar
11. **Logs**: Treat as event streams (stdout, not log files)
12. **Admin processes**: Run as one-off processes (not interactive shells)

**Application to Deployment**:

**Factor 3 (Config)**: Database credentials, API keys, feature flags **injected via environment variables**, not embedded in container image.

**Example**:
```dockerfile
# Dockerfile (baked into image)
FROM openjdk:11
COPY app.jar /app.jar
CMD ["java", "-jar", "/app.jar"]
```

**Environment variables (injected at runtime)**:
```yaml
# Kubernetes deployment
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: url
  - name: REDIS_URL
    value: "redis://cache.prod.svc.cluster.local:6379"
```

**Result**: Same container image runs in dev, staging, production. Only configuration differs.

---

## Transfer to Agent Systems (WinDAGs)

### Principle 1: Skills Must Support Gradual Rollout

**Application**: When a skill's implementation changes, don't update all instances simultaneously.

**Implementation**:
1. Deploy new skill version to 10% of agents (canary group)
2. Monitor error rate, latency, output correctness
3. If metrics acceptable, ramp to 50%, then 100%
4. If metrics degrade, roll back to old version

**Technical Requirement**: Load balancer (or orchestration layer) must support:
- Version-aware routing (route 10% of tasks to v2, 90% to v1)
- Health checks per skill version
- Automatic rollback on health check failure

### Principle 2: Skill Schemas Must Be Backward-Compatible

**Application**: When a skill's input/output format changes, support both old and new formats during transition.

**Example**:

**Skill V1** (image resizer):
```json
Input:  {"image_url": "https://...", "size": "200x200"}
Output: {"resized_url": "https://...", "format": "jpeg"}
```

**Skill V2** (adds output format selection):
```json
Input:  {"image_url": "https://...", "size": "200x200", "output_format": "webp"}
Output: {"resized_url": "https://...", "format": "webp", "size_kb": 45}
```

**Backward Compatibility Strategy**:

```python
def resize_image_v2(request):
    # Accept V1 requests (missing output_format)
    image_url = request["image_url"]
    size = request["size"]
    output_format = request.get("output_format", "jpeg")  # Default to jpeg
    
    # Process
    resized_url, size_kb = resize(image_url, size, output_format)
    
    # Return V2 format (includes new field size_kb)
    # V1 callers ignore size_kb (Postel's Principle)
    return {
        "resized_url": resized_url,
        "format": output_format,
        "size_kb": size_kb
    }
```

**Result**: V1 callers continue to work (they ignore `size_kb`). V2 callers can use new field.

### Principle 3: Orchestration State Must Be Externalizable

**Application**: Task state (which skills have run, intermediate results) should not be stored in orchestrator process memory.

**Why**: If orchestrator restarts during deployment, in-flight tasks should not be lost.

**Implementation**:

**Bad (In-Memory State)**:
```python
class Orchestrator:
    def __init__(self):
        self.active_tasks = {}  # {task_id: TaskState}
    
    def execute_task(self, task_id):
        self.active_tasks[task_id] = TaskState(status="running")
        # Execute skills...
        self.active_tasks[task_id].status = "complete"
```

If orchestrator crashes, `active_tasks` is lost.

**Good (Externalized State)**:
```python
class Orchestrator:
    def __init__(self, state_store):
        self.state_store = state_store  # Redis, DynamoDB, etc.
    
    def execute_task(self, task_id):
        self.state_store.set(task_id, {"status": "running", "started_at": now()})
        # Execute skills...
        self.state_store.set(task_id, {"status": "complete", "completed_at": now()})
```

If orchestrator crashes:
1. New orchestrator instance starts
2. Reads state from `state_store`
3. Resumes in-flight tasks (idempotent skills can be retried)

### Principle 4: Feature Toggles for Experimental Task Decompositions

**Application**: When testing a new task decomposition strategy, don't force all tasks to use it.

**Example**:

**Current DAG** (image processing):
```
[Fetch] → [Resize] → [Tag] → [Store]
```

**Experimental DAG** (adds face detection):
```
[Fetch] → [Resize] → [Face Detect] → [Tag] → [Store]
```

**Feature Toggle**:
```python
def execute_image_task(task_id, config):
    if config.is_enabled("use_face_detection", task_id):
        return execute_dag_with_face_detection(task_id)
    else:
        return execute_dag_without_face_detection(task_id)
```

**Rollout**:
1. Week 1: Enable for internal tasks only (10 tasks/day)
2. Week 2: Enable for 1% of users (1,000 tasks/day)
3. Week 3: Enable for 10% of users (10,000 tasks/day)
4. Monitor: face detection accuracy, latency impact, cost increase
5. If acceptable, ramp to 100%; if not, disable and redesign

---

## Summary: The Complete Zero-Downtime Checklist

**For a system to support zero-downtime deployment, it must**:

1. **Schema changes are backward-compatible** (expansion, migration, contraction)
2. **Protocol versions coexist** (old and new APIs active simultaneously)
3. **Session state is externalizable** (not in process memory)
4. **Configuration is injected** (not baked into images)
5. **Health checks enable traffic management** (load balancer respects health status)
6. **Feature toggles enable gradual rollout** (deploy code, activate separately)
7. **Immutable infrastructure prevents drift** (replace instances, don't patch)
8. **Rollback is fast** (keep old images, redeploy if needed)

**If any of these are missing, deployment requires downtime** (or creates outage risk).

**The economic argument**: Designing for zero-downtime deployment costs 10-20% more upfront but reduces operational costs by 10× over the system's lifetime.

**For WinDAGs**: Apply the same principles to skill deployment, task orchestration state management, and gradual rollout of new task decomposition strategies.