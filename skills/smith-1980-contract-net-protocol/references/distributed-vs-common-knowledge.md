# Distributed Knowledge vs. Common Knowledge: Why the Distinction Matters for Agent Coordination

## The Two Modes of Collective Knowledge

The Big Brother Logic framework explicitly distinguishes two fundamentally different ways that knowledge can be "shared" among agents:

1. **Distributed Knowledge**: "camera a1 knows that camera a3 sees the intruder b OR camera a2 knows that camera a3 sees the intruder b (this is called distributed knowledge about a1 and a2 that camera a3 sees the intruder b)"

2. **Common Knowledge**: "camera a1 knows that camera a2 knows that camera a1 knows etc. that camera a3 sees the intruder b (this is called common knowledge about a1 and a2 that camera a3 sees the intruder b)"

In epistemic logic notation:
- Distributed knowledge: D{a1,a2}φ means "in the union of what a1 and a2 know, φ is true"
- Common knowledge: C{a1,a2}φ means "everyone in the group knows φ, knows that everyone knows φ, knows that everyone knows that everyone knows φ, ad infinitum"

This distinction is not academic pedantry—it represents fundamentally different coordination capabilities.

## Distributed Knowledge: Information Exists But Is Scattered

Distributed knowledge means that if you could pool all the agents' information, you would know φ, but no individual agent necessarily knows it, and critically, **the agents might not even know that collectively they have enough information.**

Example from the camera scenario:
- Camera a1 sees camera a3 pointing northeast
- Camera a2 sees the intruder in the northeast quadrant
- Neither a1 nor a2 individually knows "a3 sees the intruder"
- But D{a1,a2}(a3 sees intruder) is true

The knowledge exists in the *system* but not in any *agent*. To make use of distributed knowledge requires communication: a1 and a2 must share their observations, and one or both must perform the inference.

## Common Knowledge: Everyone Knows That Everyone Knows

Common knowledge is radically different. It means:
- Everyone knows φ
- Everyone knows that everyone knows φ  
- Everyone knows that everyone knows that everyone knows φ
- And so on, infinitely

This seems redundant—why does the infinite nesting matter? Because it enables *coordination without further communication*.

The classic example is the meeting point problem: if we both know we should meet at the station, but I don't know that you know that I know this, I can't be confident you'll show up. Common knowledge resolves this: if we both know, and both know that the other knows, and both know that the other knows we know, then we can each confidently predict the other's behavior.

In the camera scenario: if it's common knowledge among {a1, a2} that a3 sees the intruder, then:
- a1 knows a3 sees the intruder
- a2 knows a3 sees the intruder  
- a1 knows that a2 knows that a3 sees the intruder
- a2 knows that a1 knows that a3 sees the intruder
- a1 knows that a2 knows that a1 knows that a3 sees the intruder
- ... and so on

## How Common Knowledge Arises: Public Announcements

The authors implement "public announcements" as a mechanism for creating common knowledge. When a formula φ is publicly announced, "the current model M is replaced by the updated model M^φ that is the subgraph of M made up of the worlds u such that M, u |= φ."

This is profound: a public announcement doesn't just add information—it **eliminates possible worlds**. 

Before announcement: agents are uncertain which of many possible worlds is actual.
After public announcement of φ: all worlds where φ is false are eliminated from consideration.

Crucially, this happens *publicly*—all agents see the announcement, all agents see that all agents saw the announcement, and so forth. This creates common knowledge automatically.

In the demonstration interface: "After the positions of the cameras are fixed, the position of the ball is fixed and the hats are fixed, she can make public announcements of a property φ."

This transforms the epistemic state not by adding beliefs, but by restricting the possibility space commonly among all agents.

## Why This Matters for Multi-Agent Orchestration

**1. Different Coordination Strategies for Different Knowledge Types**

When knowledge is merely distributed:
- Agents must communicate explicitly
- A central coordinator must gather information
- Or agents must have protocols for information sharing
- Coordination is fragile to communication failures

When knowledge is common:
- Agents can coordinate without further messages
- Each agent can simulate other agents' reasoning
- Coordination is robust to communication limits
- But achieving common knowledge requires public communication

For WinDAGs: the orchestration system should distinguish between tasks that require gathering distributed knowledge (requires communication infrastructure) versus tasks that require common knowledge (requires broadcast/public communication mechanisms).

**2. The Cost of Achieving Common Knowledge**

Creating common knowledge is expensive. In the physical camera system, announcements happen in the "communication phase" separately from the "initialization phase." This reflects a real constraint: you can't have common knowledge without common communication channels.

In distributed agent systems, achieving common knowledge might require:
- Broadcast messages (expensive in large systems)
- Acknowledged receipt (to ensure everyone knows everyone received)
- Multiple rounds (to build up nesting)

Or, as the paper models it, a single public announcement that all agents witness simultaneously.

The practical implication: don't create common knowledge unless coordination requires it. If distributed knowledge suffices, use cheaper point-to-point communication.

**3. Observable Observation Creates Common Knowledge**

Here's where the camera scenario becomes unique: when cameras can see each other, observation can create common knowledge without explicit communication.

If:
- a1 can see a2 and a3
- a2 can see a1 and a3  
- a3 is positioned so both a1 and a2 can see it looking at the ball

Then:
- a1 knows a3 sees the ball (by observing a3's orientation)
- a2 knows a3 sees the ball (same reason)
- a1 knows that a2 knows (because a1 can see a2 observing a3)
- a2 knows that a1 knows (because a2 can see a1 observing a3)

The mutual observability creates common knowledge without announcement. This is why the satisfiability problem is interesting: "turning the cameras so that a given property is satisfied" can mean arranging them so mutual observation creates the desired epistemic state.

**4. Nested Knowledge and Reasoning Depth**

The "etc." in "camera a1 knows that camera a2 knows that camera a1 knows etc." represents unbounded nesting. Computing whether such properties hold requires:

- Maintaining possible worlds for each agent
- For each world, maintaining what each agent knows (which worlds they consider possible)
- For each of those, what they know about what others know
- And so on

The model checking algorithm must "browse the inferred Kripke model on the fly." This is computationally intensive. The depth of nesting determines computational cost.

For agent systems: be explicit about required nesting depth. "A knows X" is cheap. "A knows that B knows X" is moderate. "It's common knowledge that X" is expensive because it's infinite nesting (though often computable via fixpoint algorithms).

## The Gap Between Distributed and Common Knowledge

The profound insight is that distributed knowledge and common knowledge are not just different in degree but in kind:

**Distributed knowledge** represents information that exists in the system but isn't actionable without aggregation. It's latent potential.

**Common knowledge** represents information that enables independent agents to coordinate as if they shared a single mind. It's actualized coordination capability.

Moving from distributed to common requires either:
- Public announcement (explicit communication to all)
- Mutual observation (implicit common access to the same evidence)
- Environmental facts that all can observe

The Big Brother Logic demonstrates the second mechanism: the geometric arrangement of cameras can create common knowledge through mutual observation. In software agent systems, we rely more on the first: broadcast messages or shared state.

## Boundary Conditions

**When Distributed Knowledge Suffices:**
- Information gathering tasks (one agent will aggregate)
- Sequential workflows (each agent only needs its predecessor's output)
- Hierarchical control (coordinator knows all)

**When Common Knowledge Is Required:**
- Simultaneous coordination (all must act together)
- Decentralized decision-making (no coordinator)
- Trust and commitment (must know others are committed)
- Protocol adherence (must know others follow the protocol)

**When Neither Is Sufficient:**
The authors note a limitation: "In order to being able to mix ontic and communicative actions, we plan to allow use revision instead of public announcement and belief instead of knowledge."

When actions change the world, knowledge can become outdated. Distributed and common *belief* with revision mechanisms are needed, not just knowledge. This is the difference between static epistemic logic and dynamic systems.

## Design Implications for Agent Orchestration

1. **Make the knowledge type explicit in task specifications**: Does this coordination problem require distributed knowledge (cheap) or common knowledge (expensive)?

2. **Provide infrastructure for both**: Point-to-point messaging for distributed knowledge, broadcast/publish mechanisms for common knowledge.

3. **Model the nesting depth required**: Simple knowledge, knowledge about knowledge, or full common knowledge (infinite nesting)?

4. **Consider observation-based common knowledge**: Can agents observe each other's observations or actions, creating common knowledge without explicit messaging?

5. **Distinguish knowledge from belief**: In dynamic environments, perfect knowledge is impossible. Belief revision mechanisms are needed.

The Big Brother Logic makes these distinctions concrete by implementing them in a physical system. The lesson for software agent systems is clear: don't treat all "shared information" as equivalent. The structure of knowledge-sharing determines what coordinations are possible.