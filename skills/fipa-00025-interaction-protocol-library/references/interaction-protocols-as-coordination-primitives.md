# Interaction Protocols as Coordination Primitives: Designing Agent Conversations Explicitly

## The Core Insight

In any system where multiple agents must coordinate to accomplish a task, the *pattern of their conversation* is as important as the capability of each individual agent. The FIPA Interaction Protocol Library Specification (XC00025E) formalizes a profound design principle: **ongoing conversations between agents fall into typical patterns, and those patterns should be treated as first-class design artifacts**.

The document states: "Ongoing conversations between agents often fall into typical patterns. In such cases, certain message sequences are expected, and, at any point in the conversation, other messages are expected to follow. These typical patterns of message exchange are called interaction protocols." (Section 2.1)

This is not a trivial observation. Most agent systems — and most modern AI orchestration frameworks — treat agent-to-agent communication as an afterthought, leaving the structure of conversation implicit in code, prompt engineering, or emergent behavior. The FIPA approach says: make the conversation structure explicit, name it, specify it formally, and treat it as a reusable library artifact.

## Why This Matters for Agent Orchestration Systems

In a WinDAG-style system with 180+ skills, agents are constantly in conversation: one agent requests a subtask, another proposes an approach, a third accepts or rejects, a fourth confirms completion or reports failure. If these conversations are not governed by explicit protocols, several failure modes emerge:

- **Ambiguity about conversation state**: An agent doesn't know whether a silence means "thinking," "failed," or "done."
- **Incompatible assumptions**: Agent A expects a `propose` message before proceeding; Agent B assumes permission is implied by the initial `request`.
- **No shared vocabulary for failure**: When something goes wrong, there's no agreed way to signal *what kind* of wrong it is (refusal vs. inability vs. misunderstanding).
- **Non-reusable coordination logic**: Every new multi-agent workflow has to reinvent its own turn-taking, escalation, and confirmation patterns.

The FIPA approach solves all of these by pre-specifying protocols that both agents agree to follow. Once you name a conversation pattern — "this is a ContractNet interaction" — both sides know exactly what messages to expect, in what order, and what each message means for the state of the conversation.

## The Two Design Philosophies

The FIPA specification makes an important architectural choice explicit, one that every agent system designer must confront:

> "A designer of agent systems has the choice to make the agents sufficiently aware of the meanings of the messages and the goals, beliefs and other mental attitudes the agent possesses, and that the agent's planning process causes such IPs to arise spontaneously from the agents' choices. This, however, places a heavy burden of capability and complexity on the agent implementation, though it is not an uncommon choice in the agent community at large. An alternative, and very pragmatic, view is to pre-specify the IPs, so that a simpler agent implementation can nevertheless engage in meaningful conversation with other agents, simply by carefully following the known IP." (Section 2.1)

This is a fundamental tradeoff:

**Philosophy A — Emergent Coordination**: Give each agent a rich enough internal model that correct coordination protocols *emerge* from the agents' rational goal-pursuit. This is theoretically elegant but practically expensive. Every agent must be sophisticated enough to independently reason about the communicative context. Interoperability between agents from different systems is fragile because it depends on their internal models being compatible.

**Philosophy B — Pre-specified Protocols**: Define conversation patterns ahead of time. Agents don't need to reason about *why* the pattern works — they just follow it. A simple agent can participate in a sophisticated negotiation by pattern-matching on message types and following the prescribed responses.

For a WinDAG system, the lesson is clear: **use pre-specified protocols wherever the coordination pattern is predictable and reusable, and reserve emergent coordination for genuinely novel situations**. The overhead of specifying protocols is paid once; the overhead of emergent coordination is paid every time.

## The ContractNet Protocol as an Archetype

The FIPA ContractNet Protocol is the canonical example of an interaction protocol done right. Its structure is:

1. **Initiator** broadcasts a `cfp` (call for proposals) with an action description and preconditions, subject to a deadline
2. **Participants** respond with:
   - `refuse` (cannot or will not participate)
   - `not-understood` (don't understand the request)
   - `propose` (here is my proposed approach and its preconditions)
3. **Initiator** evaluates proposals and sends:
   - `reject-proposal` (to proposals not selected)
   - `accept-proposal` (to the chosen proposal)
4. **Participant** (whose proposal was accepted) executes and responds with:
   - `inform` (task completed successfully)
   - `failure` (task failed, with reason)

What makes this powerful is that every state in the conversation is named, every transition is specified, and every message type has a defined semantic. An agent implementing this protocol knows exactly what state it's in at every moment, exactly what messages are valid next, and exactly what it must do with each incoming message.

For WinDAG skill orchestration, this pattern maps directly to: skill invocation (`cfp`), capability assessment (`propose`/`refuse`), skill selection (`accept-proposal`/`reject-proposal`), and result reporting (`inform`/`failure`). Any orchestration system that has these message types and follows this pattern is implementing ContractNet, whether or not it names it.

## Naming Protocols Enables Reasoning About Systems

There is a meta-benefit to naming protocols that goes beyond the protocol itself. When both agents agree they are running "ContractNet," a third-party observer — a monitor, a debugger, a supervisor agent — can reason about the system's state just by observing message types. It knows that an `accept-proposal` must have been preceded by a `propose`, that a `failure` message means execution was attempted, and that if a deadline passes with no `inform` or `failure`, something has gone wrong.

This observability is only possible because the protocol is named and specified. In an ad hoc communication system, the same information might be embedded in unstructured message content, invisible to any automated reasoning system.

## Practical Implications for WinDAG Design

1. **Build a protocol library alongside your skill library.** For every recurring coordination pattern in your system — task delegation, result verification, escalation, parallel subtask coordination — name the protocol and specify its message sequence.

2. **Make conversation state visible in agent context.** Each agent in a conversation should know which protocol it's running and what state it's in. This allows recovery from partial failures and enables monitoring.

3. **Separate protocol compliance from interoperability.** Following a named protocol is necessary but not sufficient for two agents to fully interoperate. Additional agreements about exception handling, timeouts, and out-of-sequence messages are required. (See: the companion document on protocol limits.)

4. **Use protocol names as routing hints.** When an orchestrator receives a message, the protocol name (`conversation-id` in FIPA ACL) is often the most efficient routing key. You don't need to parse message content to know what kind of conversation is happening.

5. **Design new protocols by composing existing ones.** The FIPA library's nested and parameterized protocol mechanisms allow complex protocols to be built from simpler ones. A multi-step workflow can be specified as a sequence of ContractNet sub-protocols, each handling one phase of the work.

## What This Teaches That Is Hard to Learn Elsewhere

Most frameworks for multi-agent systems focus on individual agent capabilities — what each agent can do. The FIPA IP Library focuses on the *space between agents* — the structure of their interactions. This is the rarer and harder insight: that the coordination layer deserves as much engineering attention as the capability layer. A system of highly capable agents with poorly designed coordination protocols will underperform a system of simpler agents with well-designed protocols. The protocol *is* architecture.