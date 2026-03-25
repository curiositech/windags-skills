# Life Cycle States as Coordination Contracts: Making Agent Unavailability First-Class

## The Problem: Agents Don't Just Start and Stop

In theoretical discussions of multi-agent systems, agents exist or they don't. They're "on" or "off." But real agent systems—especially those coordinating complex tasks—need to handle a richer reality:

- Agents pause temporarily (waiting for external input)
- Agents suspend (intentionally going dormant while remaining registered)
- Agents migrate (moving from one platform to another)
- Agents crash (unintentionally becoming unavailable)
- Agents shut down gracefully (cleaning up before termination)

The FIPA specification (section 5.1) solves this by making **agent life cycle state a first-class coordination primitive**. State isn't just internal bookkeeping—it's a **contract about how the infrastructure should handle messages** sent to that agent.

## The State Machine

Figure 2 in the specification shows seven states:

1. **Initiated**: Agent created but not yet executing
2. **Active**: Agent running and processing messages normally
3. **Suspended**: Agent paused by external request (typically AMS)
4. **Waiting**: Agent paused by its own choice
5. **Transit**: Agent is migrating between platforms
6. **Unknown**: Agent's state cannot be determined
7. **(Terminal)**: Agent has been destroyed or quit

Transitions between states are controlled by specific actions:

- **Create/Invoke** → Initiated → Active
- **Suspend** → Suspended (can be reversed with **Resume**)
- **Wait** → Waiting (can be reversed with **Wake Up**)
- **Move** → Transit (completed with **Execute** on destination platform)
- **Quit/Destroy** → Terminal

The critical insight: **Each state defines a message handling contract with the Message Transport Service (MTS).**

## Message Handling Contracts by State

From section 5.1:

### Active State