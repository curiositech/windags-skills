# Conversation Management: Concurrency, State, and the Challenge of Multiple Simultaneous Dialogues

## The Multi-Conversation Reality

In any realistic agent system, agents are not engaged in one conversation at a time. An orchestrating agent may be simultaneously managing a code-generation subtask with Agent A, waiting for a research result from Agent B, negotiating resource allocation with Agent C, and monitoring a long-running process via Agent D. Each of these is a separate *conversation* — a distinct instance of a protocol, with its own state, its own participants, and its own trajectory through the protocol's state space.

The FIPA specification addresses this directly:

> "Note that, by their nature, agents can engage in multiple dialogues, perhaps with different agents, simultaneously. The term conversation is used to denote any particular instance of such a dialogue. Thus, the agent may be concurrently engaged in multiple conversations, with different agents, within different IPs. The remarks in this section, which refer to the receipt of messages under the control of a given IP, refer only to a particular conversation." (Section 2.1)

This passage introduces the `conversation` as the fundamental unit of managed interaction — not the message, not the protocol, not the agent, but the specific *instance* of a protocol between specific agents at a specific time. The same two agents may be concurrently engaged in multiple conversations (perhaps one about task A and another about task B), and those conversations must be tracked independently.

## Conversation Identity and Routing

The practical implication is immediate: every message in a multi-agent system must carry a conversation identifier that allows the receiving agent to associate it with the correct conversational state. Without this, an agent receiving a `propose` message cannot know whether it is a response to the `cfp` it sent about task A or task B.

This is not just an implementation concern — it is a correctness concern. If message routing is ambiguous, agents may update the wrong conversational state, apply protocol logic from one conversation to the state of another, or fail to recognize when a conversation has terminated. These are subtle, hard-to-debug failures that arise specifically from the concurrent multi-conversation nature of agent systems.

The FIPA specification's insistence that protocol remarks "refer only to a particular conversation" is a design mandate: **every protocol operation is scoped to a conversation, and conversations must be explicitly tracked**.

## Protocol State as Shared Context

Within a conversation, the protocol defines the *state space* — the set of states the conversation can be in, and the valid transitions between them. At any point in a ContractNet conversation, the state might be:

- `AWAITING_PROPOSALS` — cfp has been sent, waiting for proposals or refusals
- `EVALUATING_PROPOSALS` — deadline has passed, evaluating received proposals
- `AWAITING_EXECUTION` — accept-proposal has been sent, waiting for inform or failure
- `COMPLETED` — inform received, conversation over
- `FAILED` — failure received, conversation over

Both the Initiator and the Participants in the conversation share an understanding of this state space. When either side sends a message, it is making a transition in this shared state machine. This shared understanding is what makes protocol-based coordination work — not that the agents have identical internal representations, but that they agree on the conversational state and on what messages are valid in each state.

For WinDAG orchestration, this suggests that **every orchestrated task should have an explicit conversational state machine**, not just a "task in progress / task done" binary. The conversational state machine should reflect the protocol being used, and the orchestrator should be able to query the current state of any active conversation.

## Threads of Interaction: Processing State Within Conversations

Within a single conversation, an agent's processing may itself be parallelized. AUML's "thread of interaction" concept captures this:

> "The thread of interaction shows the period during which an AgentRole is performing some task as a reaction to an incoming message. It represents only the duration of the action in time, but not the control relationship between the sender of the message and the receiver." (Section 3.2.4.1)

A critical note: "Note we do not mean a physical thread in this context. The specification is independent of the implementation using threads or other mechanisms." (Section 3.2.4.1)

This separation between the *conceptual* thread of interaction (a period of active processing in response to a message) and the *physical* implementation (which may or may not use OS threads) is important. The conceptual thread is a protocol-level concept — it says "this agent is currently processing message X and will continue until it can send a response." The physical implementation is a separate concern.

For WinDAG, this means that "skill is active" is a protocol-level state, not just an implementation state. An agent should be able to report, in protocol terms, which conversations it currently has active threads in — this is information that the orchestrator can use for load estimation, scheduling, and routing.

## Parallel Branching in Conversations

A single conversation may itself involve parallel branches. When an Initiator sends a `cfp` to multiple Participants, it is not conducting separate conversations — it is conducting one conversation with one Initiator state and multiple Participant states. The AUML diagram shows this as a single message arrow with multiple receivers (using cardinality notation at the message endpoints).

The Initiator must track the set of responses across all Participants: how many proposals have arrived, how many refusals, whether the deadline has passed. This is state management within a single conversation — but it is state that spans multiple simultaneous sub-interactions.

AUML's AND/OR/XOR parallelism notation makes this explicit in protocol diagrams. When the Initiator's lifeline splits (AND parallelism at a heavy bar), it means the Initiator is simultaneously tracking multiple parallel branches of the conversation. The merging of those branches represents the synchronization point where the Initiator consolidates the collected responses and makes a selection decision.

## Nested Protocols and Conversation Scope

Nested protocols — sub-protocols that appear within a larger protocol — raise an important question about conversation scope: does a nested protocol constitute a separate conversation, or is it part of the same conversation?

The FIPA specification treats nested protocols as part of the same conversation. A nested protocol is "an abbreviation for a fixed (part of a) protocol" (Section 3.2.7) — it is a structuring mechanism, not a conversation boundary. The conversation ID that scopes the outer protocol also scopes all its nested sub-protocols.

Interleaved protocols, by contrast, represent *distinct* conversations that happen to be concurrent. A Broker engaged in a ContractNet with a Retailer and simultaneously in a Request protocol with a Wholesaler is running two separate conversations — each with its own state, each with its own conversation ID.

This distinction matters for WinDAG design: when should a complex workflow be structured as a single conversation with nested sub-protocols, and when should it be structured as multiple interleaved conversations?

The answer turns on *dependency*. If the sub-tasks are logically part of a single coordinated interaction — where the state of one sub-task directly affects the options available in another — they should be nested within a single conversation. If the sub-tasks are independent — where each is a self-contained interaction that happens to be concurrent — they should be separate conversations.

## The Lifecycle of a Conversation: Creation, Execution, and Termination

The AUML lifeline notation makes the lifecycle of each participant explicit:

> "The agent lifeline defines the time period when an agent exists... The lifeline starts when the agent of a given AgentRole is created and ends when it is destroyed." (Section 3.2.3.1)

For conversations, there is an analogous lifecycle:
- **Creation**: A conversation is created when an Initiator sends the first message of a protocol (e.g., `cfp`)
- **Execution**: The conversation proceeds through its state transitions as messages are exchanged
- **Termination**: The conversation ends when it reaches a terminal state (success, failure, refusal, timeout)

Terminated conversations should be cleaned up: their state can be archived (for audit or learning purposes), but it should no longer consume active resources. An orchestration system that fails to terminate conversations — leaving them in "limbo" states where neither party is sure whether the conversation is still active — will accumulate stale state and eventually fail.

## Practical Conversation Management for WinDAG

Based on the FIPA framework, a WinDAG conversation management system should:

1. **Assign a unique conversation ID to every protocol invocation.** This ID must travel with every message in the conversation and be used by all participants to route messages to the correct conversation state.

2. **Maintain an explicit state machine for each active conversation.** The state machine should reflect the protocol being used, and valid transitions should be enforced. An incoming message that would create an invalid transition should be logged and handled gracefully (possibly as an `out-of-sequence` error).

3. **Implement conversation timeouts.** Every active conversation should have an associated timeout. If the conversation does not reach a terminal state within the timeout, it should be explicitly terminated (with an appropriate error state) rather than left open indefinitely.

4. **Track the set of active conversations per agent.** An orchestrator should know, at any moment, which conversations each agent is participating in and in what state. This enables load balancing, prioritization, and health monitoring.

5. **Separate conversation state from agent state.** The state of a conversation (which protocol state it is in, which messages have been exchanged) is shared between participants and should be stored in a way that both parties can access. The internal state of an agent (its goals, beliefs, preferences) is private and should not be part of the conversation record.

6. **Design cleanup procedures for terminated conversations.** When a conversation terminates — whether successfully or through failure — the system should perform explicit cleanup: release any reserved resources, notify dependent processes, archive the conversation record, and remove the active conversation from the registry.

These practices transform conversation management from an implicit, ad hoc aspect of orchestration into an explicit, first-class concern — which is precisely what the FIPA specification argues it should be.