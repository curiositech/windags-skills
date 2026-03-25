# Cascading Failure Propagation Sequence

```mermaid
sequenceDiagram
    participant Client
    participant ServiceA
    participant ServiceB
    participant ServiceB_Pool as ServiceB<br/>(Thread Pool)
    participant Database

    rect rgb(200, 220, 255)
    Note over Client,Database: NORMAL OPERATION - All systems healthy
    Client->>ServiceA: Request
    ServiceA->>ServiceB: Call (with timeout & circuit breaker)
    ServiceB_Pool->>Database: Query (50ms)
    Database-->>ServiceB_Pool: Result
    ServiceB-->>ServiceA: Response (fast)
    ServiceA-->>Client: Response (200ms total)
    end

    rect rgb(255, 240, 200)
    Note over Client,Database: FAILURE INJECTION - ServiceB database slow
    Client->>ServiceA: Request
    ServiceA->>ServiceB: Call (with timeout & circuit breaker)
    ServiceB_Pool->>Database: Query (5000ms - SLOW!)
    Note over ServiceB_Pool: Threads blocked<br/>waiting for response
    </rect>

    rect rgb(255, 220, 220)
    Note over Client,Database: SCENARIO A: NO PROTECTIONS - Cascading Failure
    rect rgb(255, 200, 200)
    Note over ServiceB_Pool: All 20 threads blocked<br/>Pool exhausted ⚠️
    end
    Client->>ServiceA: Request (queues, no workers available)
    Client->>ServiceA: Request (queues)
    Client->>ServiceA: Request (queues - memory filling)
    ServiceA--xClient: Timeout / Crash
    Note over ServiceA,Client: TOTAL SYSTEM FAILURE<br/>Cascaded from ServiceB
    end

    rect rgb(220, 255, 220)
    Note over Client,Database: SCENARIO B: WITH TIMEOUT - Fail Fast
    rect rgb(200, 255, 200)
    Note over ServiceB_Pool: Thread times out after 1000ms<br/>Released back to pool ✓
    end
    ServiceB-->>ServiceA: Timeout Exception (fast fail)
    ServiceA->>ServiceA: Circuit breaker opens<br/>after N failures
    ServiceA-->>Client: Fallback response<br/>(cached data or degraded)
    Note over ServiceA,Client: PARTIAL DEGRADATION<br/>System survives
    end

    rect rgb(220, 255, 240)
    Note over Client,Database: SCENARIO C: WITH BULKHEAD - Failure Isolation
    rect rgb(200, 255, 230)
    Note over ServiceB_Pool: ServiceB uses dedicated<br/>bulkhead pool (5 threads)<br/>Other work unaffected
    end
    ServiceB_Pool->>Database: Query (5000ms - SLOW)
    Note over ServiceB_Pool: 5 bulkhead threads blocked
    Client->>ServiceA: Request to OTHER endpoint
    ServiceA->>ServiceA: Uses different pool<br/>Unaffected by ServiceB timeout
    ServiceA-->>Client: Response (fast)
    Note over ServiceA,Client: GRACEFUL DEGRADATION<br/>Isolated failure
    end
```
