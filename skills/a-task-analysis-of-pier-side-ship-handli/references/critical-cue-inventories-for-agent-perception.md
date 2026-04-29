# Critical Cue Inventories: Documenting the Perceptual Vocabulary of Expert Performance

## The Problem That CCIs Solve

Every complex task involves decision points. At each decision point, some condition must be assessed before the correct method can be selected. The GOMS model names these conditions — "if slight headway," "if moored on port side," "if rate determined too slow" — but it does not specify how to *perceive* these conditions from available signals.

This is the gap that Critical Cue Inventories (CCIs) fill. A CCI is a structured inventory of:
- **What specific signals the expert attends to** at each decision point
- **How those signals appear** (what they look like, sound like, feel like)
- **What condition the signal indicates** (what the expert infers from the signal)
- **Why that signal is useful** (why it is reliable, what alternatives exist)

Grassi's thesis produces fifteen CCIs covering all major decision phases of pier-side ship-handling. They represent some of the most practically valuable content in the document, because they decode what expert experience actually encodes.

## Anatomy of a CCI: Environmental Assessment

The most fundamental CCI in the thesis covers environmental assessment — what the conning officer observes to determine wind direction, current direction, and their magnitudes before deciding on a maneuvering strategy.

| CUE | DESCRIPTION |
|---|---|
| State of water in channel | The conning officer looks at white caps or ripples. Direction of flow indicates wind direction. Calm water indicates absence of strong wind. |
| Pennants/Flags | Direction the flag blows indicates true wind direction. Sound of flapping indicates magnitude — "quick, succinct whipping noises usually indicate a strong wind." |
| Buoys | A buoy normally floats upright. Strong wind or current causes it to lean. The direction of its wake indicates current direction. |
| Fenders | Freely floating fenders indicate ship is being "set off" the pier. Extremely pinched fenders indicate being "set on." |
| Mooring Lines | Very taut lines indicate ship being set off pier. Very slack/dipping lines indicate ship being set on to pier. |
| Wind bird | Direction it points = direction wind is blowing from. Rate of propeller spin = magnitude of wind. |

What makes this table powerful is not its content per se — any navy manual covers this. What makes it powerful is **the cognitive function each cue serves**. Each entry explains not just what the expert observes but *what decision the observation enables*.

Notice also the redundancy: six separate signals for essentially two quantities (wind direction/magnitude and current direction/magnitude). This is not belt-and-suspenders overcaution. Each signal has different reliability profiles in different conditions (flags are useless in still air, buoys are useless in open water with no obstacles). An expert automatically triangulates across available signals; the CCI makes this triangulation explicit.

## Anatomy of a CCI: Motion Assessment

The most frequently recurring CCI in the thesis covers assessment of ship's movement and position — how the conning officer determines whether the ship is moving toward or away from the pier, and at what rate.

| CUE | DESCRIPTION |
|---|---|
| Change in separation between ship and pier | Conning officer watches the space between ship edge and pier edge. Larger space = moving away. Smaller space = moving toward. |
| Rate of swing of bow and stern | For bow: watch the "bull nose" opening — rate at which water or fixed objects pass by. For stern: watch the corner of the stern moving through the water. |
| Forward/aft motion of a fixed point on the pier | Select a fixed point (crate, paint mark). If it appears to drift forward, ship is moving aft. If it appears to drift backward, ship is moving forward. |

The third cue — relative motion of a fixed point — is particularly elegant. It converts absolute motion of the ship (hard to perceive from aboard the ship) into relative motion of a stationary object (very easy to perceive). The expert does not assess "ship is moving at X knots" — they assess "that box appears to drift toward me," which is functionally equivalent but perceptually far more accessible.

This is a general principle: **experts convert hard-to-perceive quantities into easier-to-perceive proxies**. A CCI makes these proxy mappings explicit, allowing the system to replicate the detection without replicating the years of experience that taught the expert which proxies to use.

## Anatomy of a CCI: Execution Verification

One CCI that might initially seem like operational detail reveals a deep architectural principle: the CCI for verifying that an engine order was actually executed.

| CUE | DESCRIPTION |
|---|---|
| Churning of water at stern | Propellers turning causes millions of tiny bubbles to surface. Visible as smoothing/turbulence at stern. |
| Plume of smoke exiting smoke stack | Additional smoke indicates engines accelerating. |
| Sound of engines accelerating | Distinctive revving sound, best heard from bridge wing. |
| Hear bell of EOT acknowledgment | EOT bell signals engineering plant has acknowledged and is executing the order. |

Why does this exist? Because in a noisy, complex operational environment, the conning officer cannot assume that an order given was an order received and executed. The verbal order could have been misheard. The lee helmsman could have moved the telegraph to the wrong position. The engineering plant could be experiencing a casualty. The ship's response to engine orders could be delayed or absent for mechanical reasons.

The CCI operationalizes an implicit rule: **trust but verify, via multiple independent channels**. Visual (wake, smoke), auditory (engine sound, EOT bell), and mechanical (expected ship response) channels are all used to confirm execution. If any one channel suggests non-execution, the conning officer investigates and corrects.

For agent systems: this is the architecture of reliable action. Every consequential skill invocation should have an associated verification step, and that verification should use signals independent from the invocation channel. "The skill returned success" is one signal. The downstream effects of the skill's action are a second signal. Both should be checked.

## The Diagnostic Gap: What Experts Don't Mention First

The CDM validation process reveals a systematic pattern: **experts reliably omit their most deeply automatized cues in initial recollections**. These are not the cues they consciously use — these are the cues they can't not use, the ones so fundamental to perception that they've become invisible.

> "When experts were asked to first describe the task of getting a ship underway from a pier, they often failed to mention the perceptual cues that they used in making an initial assessment of the environmental effects on the ship. It was only after asking how he determined the current of the water that he began to explain his use of visual cues, such as wakes being made by the channel buoy, to make an assessment." (p. 22)

The expert used the buoy wake cue *every time*. But when asked "how do you get underway from a pier?" the buoy wake cue did not appear in the initial account — because it had been fully automatized below the threshold of conscious reflection.

This is a general property of expertise: the most reliable cues are the most invisible. Initial knowledge elicitation will systematically miss them. Probe questioning ("how did you know X?", "what did you notice just before you did Y?") and validation against multiple experts are required to surface them.

For agent system development: capability documentation built from a single expert's first-pass account will be systematically deficient in exactly the ways that matter most. The missing cues are the ones the expert uses *most reliably* — which means they are the load-bearing elements of the skill.

## CCI Structure for Agent Systems

In a WinDAGs context, a CCI-equivalent for any complex skill would document, for each decision node in the task graph:

```markdown
## Decision Point: [Name of condition that needs to be assessed]

### Purpose
What this assessment enables — which selection rule it feeds

### Primary Signals
| Signal | How to detect it | What it indicates | Reliability notes |
|---|---|---|---|
| [Signal 1] | [Detection method] | [What this indicates] | [When this is/isn't reliable] |
| [Signal 2] | ... | ... | ... |

### Proxy Signals
[Signals that stand in for harder-to-measure quantities]

### Redundancy Structure
[Which signals can substitute for which others if unavailable]

### Failure Modes
[Conditions under which signals are unreliable or absent]

### Verification Protocol
[How to confirm that the assessment is correct before acting]
```

This structure forces explicit documentation of:
1. The perceptual inputs required for each decision
2. The proxy relationships that make abstract states observable
3. The redundancy that makes assessment robust
4. The conditions under which assessment fails

Without this documentation, task graphs are incomplete — they reference conditions that no agent knows how to detect.

## Cross-Domain Application: CCIs Beyond Physical Tasks

The CCI concept applies far beyond physical ship-handling. Consider the "art" layer in:

**Code review**: What signals indicate that a codebase is structurally fragile? Experts "just know" — and that knowing resolves into specific signals: inconsistent naming conventions, God objects, commented-out code throughout, test files that mirror production file structure exactly (indicating copy-paste test writing), imports that suggest circular dependencies. A CCI for code quality assessment would make these signals explicit.

**Security auditing**: What signals indicate that an authentication implementation has fundamental flaws? Again, experts see these patterns tacitly. A CCI would catalog: direct string comparison of secrets, absence of timing-constant comparison functions, session tokens that contain user role information, password reset flows that accept user-supplied tokens.

**Architecture design**: What signals indicate that a proposed architecture will not scale? A CCI: synchronous calls across service boundaries where the callee may be unavailable, unbounded queues with no backpressure mechanism, shared mutable state across independently deployable components.

In each case, the CCI does not replace expert judgment — it makes the *vocabulary* of expert judgment explicit enough to be taught, validated, and implemented in agent systems.