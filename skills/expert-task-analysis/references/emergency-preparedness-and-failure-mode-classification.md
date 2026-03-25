# Emergency Preparedness: Classifying Failure Modes Before They Occur

## The Restricted Maneuvering Doctrine as a Design Pattern

Naval operational doctrine includes a specific configuration called "Restricted Maneuvering" — a state the ship enters before pier-side evolutions, characterized by maximum redundancy in critical systems. The doctrine deserves careful attention because it embodies a design philosophy that translates directly to reliable agent system architecture.

> "Recognizing the fact that new SWOs were not receiving any ship-handling experience prior to reporting to their first command... [the system] requires additional stations to be manned that are normally not manned during standard operations." (p. 33-34)

The Restricted Maneuvering Doctrine does several things simultaneously:

**1. Brings all redundant systems online before they're needed**
> "Prior to getting underway or entering port, all available engines, generators, and steering units are put into operation." (p. 33)

Under normal conditions, redundant engines and steering units sit offline to save fuel and reduce maintenance. During restricted maneuvering, they come online *preemptively* — before any casualty has occurred — so that if a primary system fails, the backup is already running and ready to shift over, rather than cold and requiring startup time.

**2. Pre-positions personnel at emergency stations**
During restricted maneuvering, a qualified helmsman and conning officer are stationed in the after steering room — a backup control station — even though there's no current emergency. They are waiting for a casualty that may never happen.

**3. Changes the failure recovery time from minutes to seconds**
> "Under normal steaming operations, if a ship were to lose an engine or steering unit, it may take several minutes to get a back-up unit running and operational. However, during a restricted maneuvering situation, if a casualty does occur, the configuration of critical machinery allows stand-by units to be automatically shifted over to cover the loss of the primary units." (p. 33)

This is the key: the difference between minutes and seconds in recovery time, in a constrained environment where the ship's momentum will collide it with something if not corrected within seconds. The doctrine recognizes that certain failure modes require faster recovery than reactive startup time allows.

## Pre-Classification of Failure Modes

The thesis catalogs specific pier-side failure modes with their detection signatures and response protocols. This is not a wishlist — it is a pre-computed response plan for anticipated failure modes:

### Loss of Steering
> "This casualty is usually indicated by an alarm on the helm console sounding off and the indicator light to the steering unit in operation flashing on and off. Another indication is that the rudder does not respond to the action of the wheel being turned by the helmsman. The response of the conning officer is to immediately shift to the stand by steering unit. If the rudder still does not respond, an alarm is sounded in the after steering station... If after steering is still unable to control the rudder, the conning officer can use the engines and assisting tugboat to maintain the ship's position while the mechanics fix the problem. However, if it appears that the ship begins to drift towards other ships or shoal water, the conning officer can let go of the anchor to keep the ship from drifting into a hazard." (p. 34)

Notice the structure: **detection signatures → response hierarchy → fallback cascade**

- Detection: alarm AND indicator light AND rudder non-responsiveness (multiple channels)
- Response 1: shift to standby steering unit
- Response 2: if still no response, alarm to after steering for local control
- Response 3: if after steering unavailable, use engines + tug for position maintenance
- Response 4: if drift toward hazard imminent, drop anchor

This is a pre-planned decision tree for a specific failure mode. The conning officer has rehearsed this mentally (and through training exercises) before entering the pier area. When the failure occurs, the response is immediate and does not require improvisation.

### Loss of Propulsion
> "Since the speed of the ship is very slow during pier side evolutions, the only indication that the conning officer may have is the call from the Engineering Officer of the Watch (EOOW) reporting the casualty. In addition, with no water flow over the rudder the ship will rapidly lose its steering capability. Therefore, the only option the conning officer has is to use the assisting tug to hold the ship's position or let go the anchor." (p. 34-35)

This failure mode illustrates *cascading failure*: loss of propulsion leads rapidly to loss of steering (the rudder requires water flow to function). The response plan must account for the cascade, not just the initial failure.

### Loss of Gyrocompass
> "Although this is the primary means for monitoring the ship's heading, the conning officer must shift to using the magnetic compass, which is normally located next to the gyrocompass repeater." (p. 35)

The smallest of the failure modes — the backup is immediately available, always already positioned, and requires no complex switching. This is because this failure mode has been anticipated and its solution pre-engineered into the physical layout of the bridge.

## The Architecture of Pre-Planned Failure Response

The failure mode catalog reveals a consistent architecture:

**1. Anticipation**: Specific failure modes are identified before operations begin. The set of anticipated failures is finite and enumerated.

**2. Detection Specification**: For each failure mode, specific detection signals are identified. Some use a single clear signal (EOOW casualty report). Others use multiple corroborating signals (alarm + indicator light + non-responsiveness). High-consequence failures with subtle onset require multi-signal detection.

**3. Pre-Computed Response**: The response to each failure mode is determined before operations begin, not in the moment of crisis. The conning officer does not improvise during a steering casualty — they execute a pre-planned response that has been rehearsed.

**4. Fallback Cascade**: Responses are layered: try Response A, if that fails try Response B, if that fails try Response C. The fallback sequence terminates at a safe state (anchor deployment) that stops the situation from worsening even if it doesn't resolve the failure.

**5. Recovery Path Separation**: The immediate response (stop the bleeding) and the recovery path (fix the underlying problem) are separated. Loss of steering → shift to standby → position holding via engines/tug is the immediate response. "While mechanics fix the problem" is the recovery path. The conning officer owns the immediate response; engineers own the recovery.

## Cascading Failure Analysis

The loss-of-propulsion scenario illustrates why failure mode analysis must include cascade analysis. A ship loses propulsion. This is manageable at sea with room to maneuver. During pier-side evolution, the same failure rapidly produces:
- Propulsion loss → no water flow over rudder → steering loss
- Propulsion loss → ship still has momentum from prior movement → continues moving toward pier
- Propulsion loss → tug is the only control mechanism remaining → and the tug's line must already be attached

The cascade occurs within seconds. If the response plan only addresses "loss of propulsion" without anticipating the steering cascade, the conning officer will attempt to correct heading with the rudder (which no longer functions) and lose precious seconds before recognizing that the cascade has occurred.

Pre-planned responses for cascades require understanding *dependency chains*: what becomes unavailable when X fails? What becomes unavailable when that thing fails? The cascade analysis should trace at least two hops from each primary failure.

## Implications for Agent System Design

### Pre-Registration of Failure Modes

Agent systems operating in complex environments should pre-register anticipated failure modes before executing high-stakes operations. The registration includes:

```markdown
## Failure Mode: [Name]

### Detection Signatures
- Primary signal: [What indicates this failure has occurred]
- Secondary signals: [Corroborating signals]
- Cascade indicators: [Signals indicating cascade has begun]

### Response Protocol
1. [Immediate response — stop the bleeding]
2. [Fallback if response 1 unavailable]
3. [Fallback if response 2 unavailable]
4. [Safe-state fallback — anchor equivalent]

### Cascade Analysis
- What does this failure cause to fail subsequently?
- How quickly does the cascade occur?
- Does the cascade require different detection/response?

### Recovery Path
- Who is responsible for recovery?
- What is the agent's role during recovery?
- What monitoring is required during recovery?
```

### Pre-Warming Critical Fallbacks

The Restricted Maneuvering Doctrine's principle of bringing redundant systems online before they're needed applies directly to agent systems. For any operation where failure recovery time is critical:

- Secondary API connections should be authenticated and ready before the primary call is made
- Fallback skills should be loaded and warm, not cold
- Backup data sources should have recent cached reads, not stale or empty caches
- Alternative agent routes should be pre-validated, not hypothetically available

The cost of pre-warming is small compared to the cost of discovering a cold fallback when you need it.

### Distinguishing Fast-Onset from Slow-Onset Failures

Some failures manifest over seconds (steering loss cascade). Others manifest over minutes or hours (gradual data quality degradation). The response architecture is different:

**Fast-onset failures** require pre-computed responses executable without deliberation. The response must be immediately available, pre-rehearsed, and require minimal classification effort — because there is no time for classification effort.

**Slow-onset failures** allow monitoring-based detection and deliberative response planning. These can be addressed through monitoring loops with alerting thresholds and planned intervention protocols.

Agent systems should classify each potential failure mode by onset speed and design response architectures accordingly. Treating a fast-onset failure as if it has slow-onset response time available is a systematic architectural error.

### Separating Immediate Response from Recovery Path

The naval pattern — conning officer owns immediate response, engineers own recovery — prevents two failure modes:
1. The conning officer distracted from ship control by trying to fix the engine
2. The engineers trying to manage ship position rather than fix the engine

For agent orchestration: when a component fails, there should be a clear separation between:
- The orchestrator's job (maintain task progress with available resources, via fallback cascade)
- The failed component's recovery job (restore the component to availability)

Mixing these responsibilities produces confused, slow responses. Separating them produces clean, parallel responses.

## The Specific Cost of Not Pre-Planning

> "Although casualties rarely happen during these evolutions, the conning officer must be prepared to handle them in the event they do." (p. 34)

This sentence captures the cost-benefit of failure mode pre-planning precisely. Casualties rarely happen. Therefore the pre-planning overhead is mostly "wasted" in any given evolution. But the expected value calculation includes the magnitude of the consequence when the rare event occurs — and in a restricted maneuvering situation, an unplanned response to a steering casualty can result in catastrophic collision.

High-stakes agent operations — those where failures have severe, fast, irreversible consequences — require pre-planned failure responses regardless of the expected low probability of those failures. The probability threshold for pre-planning is set not by likelihood but by consequence magnitude and reversibility.