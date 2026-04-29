# Distributed Decision-Making and Span of Control in Complex Situations

## The Multi-Thread Problem

Real-world expert decision-making rarely involves a single decision problem. The fireground commander is simultaneously managing the fire suppression effort, the rescue of civilians, the safety of firefighters, resource allocation across multiple units, and communication with dispatch. The tank platoon leader is managing multiple vehicles, monitoring terrain, anticipating enemy action, and maintaining communication with higher command. The paramedic is triaging multiple patients while coordinating with the hospital and managing team members.

Klein and MacGregor do not develop a formal theory of distributed decision-making, but their case data reveals important structural principles about how experts manage multiple simultaneous situational threads. These principles have direct implications for multi-agent orchestration systems.

---

## Span of Control as a Cognitive Limit

The most explicit principle emerges from Chief McW's response to the tanker fire when the storm sewer explodes. His immediate recognition: "This new aspect of the situation would exceed his span of control." His response: call for additional command resources and explicitly delegate the sewer problem to the incoming Chief, retaining personal focus on the tanker.

This is not just a practical resource-allocation decision. It is a **metacognitive act** — a recognition that the current decision-maker cannot maintain adequate situational awareness across two independent situational threads simultaneously, and that attempting to do so would degrade performance on both.

The span of control concept implies:
1. There is a maximum number of active situational models a decision-maker can maintain simultaneously
2. Operating near or above this limit degrades situational awareness quality (less frequent monitoring, less sensitive to disconfirming cues, slower SA-Shift detection)
3. The appropriate response when approaching the limit is not to reduce monitoring frequency on all threads but to delegate complete threads to other decision-makers

### Implications for Multi-Agent Architecture
Agent systems have their own version of span of control — determined by available context length, attention mechanisms, working memory capacity, and update frequency. A single agent attempting to maintain situational awareness across too many active problems will exhibit the same degradation pattern as an overloaded human commander: slower updates, reduced sensitivity to disconfirming cues, and SA-Shift failure.

Multi-agent orchestration should explicitly model span of control:
- Each agent should track the number of active situational models it is maintaining
- As this count approaches the agent's capacity, it should request delegation of complete sub-problems to other agents rather than accepting further degradation
- The orchestrator should be aware of each agent's current load and allocate new problems accordingly

---

## Parallel vs. Sequential Situational Awareness

Klein and MacGregor's SAR structure implies that situational awareness for a single problem is maintained as a continuously updated model. But how do expert decision-makers handle multiple simultaneous problems?

The CDM data suggests experts do not attempt to maintain all situational models at the same level of fidelity simultaneously. Instead, they apply a prioritization mechanism:

- **Active attention**: The highest-priority situational thread receives continuous monitoring and rapid response
- **Periodic monitoring**: Lower-priority threads are checked at intervals, with updates processed when attention cycles back
- **Background alerting**: Some threads are monitored only for high-salience signals (significant changes) rather than routine updates

This is analogous to interrupt-driven vs. polling-based monitoring architectures. The expert is running a polling loop across multiple situational models, but with variable polling frequencies determined by current priority assessment.

### Implications for Agent Monitoring Architecture
A single agent managing multiple situational threads should implement differential monitoring:
- High-priority threads: continuous monitoring, immediate response to new information
- Medium-priority threads: periodic polling, updates processed when priority resources are available
- Background threads: alert-driven monitoring (only signal on significant changes)

Priority should be dynamic — a thread that was low-priority can become high-priority based on new information. The system needs to detect priority-escalation signals and reallocate monitoring resources accordingly.

---

## The Coordination Without Central Control Problem

The CDM study of tank platoon leaders and wildland firefighting reveals a particularly important coordination challenge: multiple decision-makers must act coherently without real-time central coordination. The wildland firefighting case explicitly involves "distributed decision making" (Taynor, Klein, & Thordsen, 1987) where communication disruptions were themselves operationally significant.

The key mechanism for coordination without central control is **shared situational awareness**: all decision-makers have sufficiently aligned situational models that their independent decisions are mutually consistent. This is not guaranteed — it is achieved through explicit communication of situational updates, shared training that produces compatible prototype libraries, and established norms about what situations require coordination versus what can be handled independently.

When shared situational awareness fails — when different decision-makers have incompatible situational models — their independent decisions will conflict even when each is acting reasonably given their own model. The paramedic and the hospital may be acting optimally by their respective assessments while producing an incoherent outcome because their assessments differ.

### Implications for Multi-Agent Coordination
Multi-agent systems face the same challenge: independent agents with locally rational decision processes may produce globally incoherent outputs if their situational models diverge. Solutions must address the root cause (shared situational awareness) not just the symptom (conflicting outputs).

Key mechanisms:
1. **Situational model broadcast**: When one agent's situational model updates significantly, it should broadcast the update to agents whose decisions depend on that model
2. **SA-Shift synchronization**: When one agent detects an SA-Shift, all agents working on dependent sub-problems should receive notification and assess whether their own models need revision
3. **Consistency monitoring**: A meta-level agent or monitoring process should check for contradiction between the active situational models of different agents and flag when they diverge beyond acceptable bounds
4. **Shared prototype libraries**: Agents operating in the same domain should share the same prototype library, ensuring that they classify situations consistently even when making independent decisions

---

## Expertise Transfer and Hierarchical Coordination

Klein and MacGregor's analysis of command decisions reveals an important hierarchical pattern: expert commanders not only make decisions but recognize when a situation exceeds their authority level or expertise level and escalate appropriately.

The decision to escalate is itself an expert decision — and one that novices often get wrong in both directions. Novices sometimes escalate when they should handle a situation themselves (lack of confidence), and sometimes fail to escalate when the situation genuinely requires higher-level authority or expertise (overconfidence or inadequate SA-Shift detection).

The CDM probe "what specific training or experience was necessary to make this decision?" and "how might a less experienced officer have behaved differently?" are specifically designed to surface the escalation decision criteria — the indicators that tell an expert "this is beyond me."

### Implications for Agent Escalation Design
Agent escalation decisions should be governed by the same factors:
- **Prototype library coverage**: If no prototype in the agent's knowledge base has adequate confidence, escalate
- **Action queue depth**: If the action queue is exhausted (all options tried and failed), escalate
- **Situational model confidence**: If situation assessment confidence is below threshold, escalate rather than act on a poorly founded assessment
- **Span of control**: If the number of active situational threads exceeds capacity, escalate (delegate) the lowest-priority threads
- **Irreversibility**: If the action under consideration is irreversible and significant, escalate for verification even if the agent has adequate confidence

These escalation triggers should be explicit design parameters, not emergent behaviors. The system architect should specify the thresholds and the agent should monitor against them.

---

## The Situation Assessment Record as a Coordination Interface

One of the most practically valuable products of the CDM is the Situation Assessment Record — a structured representation of the current situational model, including active cues, current goals, and decision points. Klein and MacGregor develop this primarily for research purposes, but its value as a **coordination interface** in multi-agent systems is significant.

If each agent maintains and shares a SAR for its active situational threads, the orchestrating system gains:
- Visibility into each agent's current situational understanding
- Early detection of diverging situational models (before they produce conflicting outputs)
- A structured basis for coordination decisions (which agent handles which sub-problem)
- A record for post-hoc analysis when things go wrong

The SAR is a natural API for agent-to-agent situational handoff — when one agent delegates a situational thread to another, the SAR provides the initial situational context the receiving agent needs to continue seamlessly.

---

## The Desired Data Probe and Information Architecture

The CDM probe "what information would you have wanted but didn't have?" is among the most practically valuable for system design. In the command-and-control study, this probe revealed the critical value of knowing enemy location more precisely and knowing the location of friendly forces. In the fireground study, it revealed the importance of building construction data at the point of response.

These "desired but unavailable" information elements define the **information architecture** of expert decision-making — the data streams that expert performance depends on, even when they are not currently present in the environment. Building better sensor networks, information systems, or agent capabilities to provide this information directly addresses the bottlenecks in expert performance.

For agent systems, this analysis translates into: what inputs does the agent need but currently cannot access? What sensors, APIs, or data streams would most improve the quality of situation assessment? These are higher-value investments than improving the reasoning architecture operating on inadequate inputs.