# Split-Container Architecture: Orchestrating Agents Across Unreliable and Resource-Constrained Environments

## The Heterogeneity Problem

Production multi-agent systems don't run on homogeneous clusters. They span:
- **Resource-rich servers** (multi-core, GB RAM, persistent storage)
- **Resource-constrained devices** (mobile phones, IoT sensors, edge devices)
- **Unreliable networks** (cellular with intermittent coverage, firewalls, NAT traversal)

Running full JADE containers on every device is impractical:
- A JADE main container requires ~10-50MB RAM
- Mobile devices have limited battery (maintaining network connections drains power)
- Firewalls block incoming connections (agents can't receive messages directly)

JADE's solution: **Split-container architecture** (JADE-LEAP: Lightweight Extensible Agent Platform). An agent is split into:
1. **Front-end**: Runs on constrained device, handles I/O, minimal state
2. **Back-end**: Runs on server, handles coordination, full agent logic
3. **Mediator**: Centralized discovery and reconnection service

## Architecture Overview

### Components

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Mobile    │         │   Mediator  │         │   Server    │
│   Device    │◄───────►│   (Gateway) │◄───────►│   Cluster   │
│  (Front-end)│         │             │         │  (Back-end) │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │ JICP connection       │                       │
      │ (can disconnect)      │                       │
      └───────────────────────┘                       │
                                                      │
                                                  Full JADE
                                                  container
```

**Key insight from the book**:

> "The mediator must be up and running on a host with a known, fixed and visible address before front-ends can be initiated on any mobile device."

The mediator is the **rendezvous point**. All discovery flows through it, but data flows directly between front-end and back-end once connected.

### Startup Sequence (Figure 8.5)

```
1. Front-end → Mediator: CREATE_MEDIATOR request via JICP
   - Includes device info (MSISDN if mobile, container name if known)

2. Mediator creates back-end instance on server
   - Instantiates agent class
   - Assigns container name (e.g., MSISDN-container if mobile)

3. Mediator passes connection to back-end
   - Back-end now has open socket to front-end

4. Back-end registers with main container
   - DF service available
   - Yellow pages updated

5. Mediator → Front-end: Response with:
   - Assigned container name
   - Platform name
   - Platform addresses (for direct communication if network allows)
```

**Critical design decision**: The mediator is **not in the data path** after connection. It only handles:
- Initial connection (CREATE_MEDIATOR)
- Reconnection after disconnect (CONNECT_MEDIATOR)
- Lookup table maintenance (container-name → back-end mapping)

### Reconnection After Disconnect (Figure 8.6)

Mobile devices frequently lose connectivity (out of coverage, airplane mode, battery death). The front-end reconnects:

```
1. Front-end detects disconnection
   - TCP connection closed or timeout on heartbeat

2. Front-end → Mediator: CONNECT_MEDIATOR + container-name
   - "I'm the agent that was using container-name X"

3. Mediator looks up back-end by container-name
   - Maintained in persistent table

4. Mediator passes new connection to existing back-end
   - Back-end resumes with same state

5. Back-end → Front-end: OK response
   - Front-end flushes buffered messages (sent while disconnected)
```

**Key feature**: The back-end **survives disconnection**. While the front-end is offline:
- Back-end continues to exist on server
- Messages destined for the agent are queued at back-end
- When front-end reconnects, queued messages are delivered

**For WinDAGs**: If a skill executor is running on an unreliable device (Lambda function, edge device), use split execution:
- **Front-end**: Stateless executor (receives tasks, returns results)
- **Back-end**: Stateful coordinator (tracks task history, handles retries)
- **Mediator**: Task registry (front-ends discover which back-end to connect to)

## Firewall Transparency

The book emphasizes a critical deployment advantage:

> "The only element accepting connections (i.e. embedding a server socket) is the mediator. Therefore, if the mediator, the main container, and other normal containers, if any, are running behind a firewall, the only requirement is to open the port used by the mediator to listen for incoming connections."

**Traditional distributed system** (peer-to-peer):
- Each agent must accept incoming connections
- N agents → N ports to open in firewall
- Firewall admin nightmare

**Split-container architecture**:
- Only mediator accepts connections (1 port)
- All devices connect outbound to mediator (no firewall rules needed for devices)
- Back-ends are behind firewall, never accept external connections

**Network topology**:

```
Internet                    Firewall               Internal Network
                                 ║
Mobile Device ────────────► Mediator ◄────────────► Back-end Container
                            (Port 1099)             (No inbound port)
```

**For WinDAGs**: If deploying across environments (cloud + on-prem, public + private):
- Deploy mediator in DMZ (one public IP, one port)
- Deploy skill executors behind firewall
- Executors connect outbound to mediator
- No VPN or complex routing needed

## BIFEDispatcher: Handling Device Constraints

The book reveals a non-obvious implementation detail:

> "The BIFEDispatcher keeps two sockets open (one for commands to back-end, one for responses from back-end) to work around device limitations (specifically Symbian phones that can't read/write on the same socket simultaneously)."

**Hardware constraint propagates to architecture**: Early Symbian phones had a broken TCP stack. The BIFEDispatcher (Back-end In Front-end Dispatcher) compensates:
- Socket A: Front-end → Back-end (commands)
- Socket B: Back-end → Front-end (responses)

**Alternative dispatcher** (for better devices):
- `FrontEndDispatcher`: Single socket (full-duplex)
- `HTTPFEDispatcher`: HTTP tunneling (for proxies that block non-HTTP)

**Lesson**: Don't assume uniform platform capabilities. Provide **pluggable transport adapters** that abstract device constraints.

**For WinDAGs**: If skills run on heterogeneous hardware (ARM, x86, GPU, TPU):
- Define abstract transport interface (send/receive)
- Implement device-specific transports (gRPC, HTTP/2, custom binary protocol)
- Let skills declare required transport ("I need full-duplex bidirectional streaming")
- Orchestrator selects compatible transport at runtime

## ConnectionListener: Observable Failure Events

The split-container architecture exposes **connection state transitions** to application logic:

```java
MicroRuntime.setConnectionListener(new ConnectionListener() {
    public void handleConnectionEvent(int code, Object info) {
        switch (code) {
            case BEFORE_CONNECTION:
                // About to connect: set up PDP context (mobile), pre-allocate resources
                break;

            case DISCONNECTED:
                // Lost connection: cache messages locally, notify user
                queueMessagesLocally();
                showUserAlert("Connection lost, working offline");
                break;

            case RECONNECTED:
                // Restored connection: flush cached messages
                flushLocalQueue();
                showUserAlert("Connection restored");
                break;

            case RECONNECTION_FAILURE:
                // Reconnection failed after retries: escalate
                log.error("Cannot reconnect to server");
                promptUserForManualRetry();
                break;

            case BE_NOT_FOUND:
                // Back-end was killed during disconnect: unrecoverable
                log.error("Server lost our state, must restart");
                resetAgent();
                break;

            case NOT_AUTHORIZED:
                // Authentication failed: don't retry indefinitely
                log.error("Authentication rejected");
                promptUserForCredentials();
                break;

            case CONNECTION_DROPPED:
                // Unexpected disconnect: likely network issue
                log.warning("Connection dropped unexpectedly");
                initiateReconnection();
                break;
        }
    }
});
```

**Why this matters**: The system doesn't pretend disconnections don't happen. Instead:
- Applications **observe** connection events
- Applications **decide** recovery strategy (retry, degrade, abort)
- Users are **informed** (not left in the dark when operations fail)

**For WinDAGs**: Expose similar events for skill execution:

```python
orchestrator.on_event(SKILL_UNAVAILABLE, lambda event:
    log.warning(f"Skill {event.skill_id} unreachable, trying fallback"))

orchestrator.on_event(EXECUTION_STALLED, lambda event:
    log.error(f"Skill {event.skill_id} not responding, timeout in {event.remaining}s"))

orchestrator.on_event(RESULT_UNDELIVERABLE, lambda event:
    log.warning(f"Skill {event.skill_id} completed but orchestrator unreachable"))
```

## Message Buffering During Disconnection

**Critical feature**: While disconnected, the front-end **buffers outgoing messages locally**:

```java
// Front-end code (pseudo)
public void send(ACLMessage msg) {
    if (connected) {
        dispatchToBackend(msg);
    } else {
        localBuffer.add(msg);  // Queue for later
    }
}

public void onReconnected() {
    for (ACLMessage msg : localBuffer) {
        dispatchToBackend(msg);
    }
    localBuffer.clear();
}
```

**Problem**: Local buffer can grow unbounded if disconnection is prolonged. The book doesn't specify overflow policy, but production systems need:
- **Maximum buffer size** (e.g., 1000 messages)
- **Overflow strategy**:
  - Drop oldest messages (FIFO eviction)
  - Drop low-priority messages first
  - Persist to disk if RAM exhausted
  - Alert user if critical messages can't be sent

**For WinDAGs**: Implement **persistent task queues** for orchestrator-to-skill communication:
- Use Kafka, RabbitMQ, or SQS with durable queues
- If skill is unavailable, messages wait in queue
- When skill comes online, process backlog
- Set **retention policy** (e.g., delete after 7 days if unprocessed)

## Minimization: Deployment-Time Code Reduction

JADE for mobile (MIDP/CLDC) requires aggressive code size reduction. The book describes a **minimization utility**:

```bash
java -cp ... jade.Boot minimizer -input jade.jar -output jade-min.jar -dlc app.dlc
```

The `.dlc` (Dynamically Loaded Classes) file specifies entry points:

```
# app.dlc
bookTrading.buyer.BookBuyerAgent
bookTrading.seller.BookSellerAgent
```

The minimizer:
1. Starts from entry points (agent classes)
2. Traces all reachable code (bytecode analysis)
3. Removes unreachable classes, methods, fields
4. Compresses bytecode (remove debug info, inline constants)

**Result**: 600KB JADE JAR → 150KB minimized JAR for MIDP.

**For WinDAGs**: If deploying to constrained environments (edge devices, serverless with size limits):
- Use **dead code elimination** (tree-shaking in JavaScript, ProGuard for Java, PyInstaller for Python)
- **Lazy loading**: Don't bundle all 180 skills in every deployment; load dynamically
- **Modular packaging**: Each skill is a separate artifact (Docker layer, Lambda function)

## MSISDN-Based Naming: Infrastructure as Identity

For mobile agents, the book suggests using **MSISDN** (phone number) as the agent's name:

```java
Properties pp = new Properties();
pp.setProperty(MicroRuntime.AGENTS_KEY, "%C-book-buyer:bookTrading.buyer.BookBuyerAgent");