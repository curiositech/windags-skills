# Message Performatives and Interaction Patterns: The Grammar of Agent Communication

## Communication Is Not Just Data Transfer

When two programs exchange data, the exchange is symmetrical: bytes go from A to B, meaning is inferred from the content. When two agents communicate, the exchange is *performative*: the message is not just information but an *act*. Sending a `request` is asking someone to do something. Sending a `refuse` is declining to do something. Sending an `agree` is making a commitment.

FIPA's communication model, visible throughout the Agent Management Specification and its referenced interaction protocols, is built on speech act theory: every message is a performative that carries both semantic content and a *communicative act* type that specifies what the sender is *doing* with the message.

The communicative act types visible in the FIPA Agent Management Specification:
- **`request`**: "I want you to do this action"
- **`agree`**: "I commit to attempting this action"
- **`refuse`**: "I will not attempt this action, here is why"
- **`inform`**: "I am telling you this fact is true"
- **`failure`**: "I attempted the action but it failed, here is why"
- **`not-understood`**: "I cannot interpret what you sent"

Each of these is a different kind of *act*, not just a different kind of data. The distinction matters because agents need to reason not just about what is communicated but about *what kind of thing is being communicated*.

## The FIPA-Request Interaction Protocol

The specification repeatedly references the FIPA-Request interaction protocol ([FIPA00026]). The agent management examples in Annex A all follow this protocol. It is worth examining its structure carefully because it is the most important pattern in multi-agent coordination.

The FIPA-Request protocol specifies a temporal sequence:

```
Initiator            Participant
    |----request------->|
    |<---agree OR-------|
    |    refuse         |
    |                   |
(if agree:)            |
    |<---inform done----|
    |    OR failure     |
```

Every message carries the full context in its `:content` field. The `agree` echoes the original action. The `inform done` or `failure` wraps the original action. This makes every message self-describing: you don't need out-of-band context to understand a `failure` message because the `failure` contains the action that failed.

This protocol pattern has critical properties:
1. **Two-phase commitment**: The agent explicitly commits before executing (agree), so the requester knows whether to expect completion
2. **Explicit rejection before any side effects**: `refuse` happens before the action is attempted, ensuring clean state
3. **Failure notification includes context**: `failure` wraps the original action, enabling the requester to diagnose without stored state
4. **Protocol label on every message**: The `:protocol FIPA-Request` label lets both parties identify which protocol is in play, enabling proper state machine tracking

## Message Anatomy: The Envelope and the Content

Every FIPA message has an outer envelope (header) and inner content. The Annex A examples make this structure explicit:

```
(request                           ← Communicative act type
  :sender (agent-identifier ...)   ← Who sent this
  :receiver (set (...))            ← Who should receive this
  :language FIPA-SL0               ← What language the content is in
  :protocol FIPA-Request           ← What interaction protocol this is part of
  :ontology FIPA-Agent-Management  ← What ontology the content uses
  :content                         ← The actual semantic content
    (action                        ← What action is being requested
      (agent-identifier ...)       ← Who should perform the action
      (register ...)))             ← The specific action and its arguments
```

The separation of envelope from content is important:
- The envelope is about *communication logistics*: who, to whom, in what language, with what protocol
- The content is about *semantics*: what is actually being requested/reported/refused

This enables processing at different layers: an MTS can route based on the envelope without understanding the content. An AMS can parse the content type (register, deregister, modify) without caring about the specific arguments. A service handler can process the specific arguments without re-parsing the envelope.

## Ontology and Language as Shared Context Declarations

Every FIPA message declares both its content language (`:language FIPA-SL0`) and its ontology (`:ontology FIPA-Agent-Management`). These are not metadata — they are prerequisites for correct interpretation.

The content language specifies the syntax: how to parse the content field. FIPA-SL0 is a subset of the Semantic Language, with specific rules for constants, sets, sequences, and functional terms.

The ontology specifies the semantics: what the terms in the content mean. "register" means something different in the `FIPA-Agent-Management` ontology than it might mean in a `meeting-scheduler` ontology. The `:ontology` declaration tells the receiver which vocabulary to use for interpretation.

By making both explicit in every message, FIPA ensures that receivers always have the context they need to correctly interpret content — and that the `not-understood` exception with `unrecognised-value` or `unsupported-value` can be meaningfully specific about what part of the shared context is missing.

## The Self-Describing Message Pattern

One of the distinctive features of the FIPA message format is that messages are *self-describing*: the `agree`, `inform done`, and `failure` messages each contain (or reference) the original action that was agreed to, completed, or failed. This is visible in every Annex A example.

In Example 1, the AMS sends `agree` containing:
```
(action ... (register (ams-agent-description ... :state active)))
```
This is the original action echoed back. Why? Because in a distributed system with concurrent interactions, the requester may have multiple outstanding requests simultaneously. By echoing the original action, the response is unambiguously connected to the request — even without shared state or explicit correlation IDs.

The `inform done` then uses the `done` predicate wrapping the same action:
```
(done (action ... (register (ams-agent-description ...))))
```

This is a completed-action declaration: "the action (described here) is done." The receiver doesn't need to look up what action was being referred to — it's right there in the message.

For WinDAGs, this self-describing pattern is valuable for long-running orchestrations where the orchestrator needs to match completion notifications to pending task steps. Rather than relying on correlation IDs stored externally, the completion message carries enough context to be matched by content alone.

## The `propose` Failure: Wrong Performative

Example 7 in Annex A shows a subtle but important failure mode: `dummy` sends a `propose` performative to do a `deregister`. The DF returns `not-understood` with `unsupported-act propose`.

```
(not-understood
  :content
    (propose ...)
    (unsupported-act propose))
```

The DF can handle `request` performatives. It cannot handle `propose` — which in the FIPA protocol library means "I propose we do this" (a negotiation-oriented act), not "I request you do this" (a directive act). The action (deregister) is completely valid. The problem is the outer communicative act type is wrong.

This example teaches: the communicative act type is not a wrapper — it is load-bearing. Sending the right content with the wrong act type is a communication failure. The receiver's interpretation of the content depends on the act type: a `propose` to deregister is semantically different from a `request` to deregister.

For WinDAGs, this means: skill invocations must use the correct communicative act type for the intended interaction semantics. Sending a "task completion notification" as a request (which demands a response) versus an inform (which is a one-way notification) has very different implications for downstream protocol behavior.

## Interaction Protocol Multiplicity

While FIPA-Request is the primary protocol used in the Agent Management Specification, FIPA defines a library of interaction protocols ([FIPA00025]) for different coordination patterns. The DF description includes the `:protocol` field listing which protocols a registered agent supports. This implies that agents can choose the appropriate interaction pattern based on the task:

- **FIPA-Request**: "Do this for me, tell me when done"
- **FIPA-Query**: "Answer this question"
- **FIPA-Contract-Net**: "Who wants to bid on this task?"
- **FIPA-Subscribe**: "Notify me when this condition changes"
- **FIPA-Propose**: "I suggest we do this, do you agree?"

The fact that supported protocols are part of the DF registration means agents can discover not just *what* another agent can do, but *how* it prefers to be coordinated with.

## Application to WinDAGs Communication Design

### Performative Types for Skill Invocation

WinDAGs skill invocations should use distinct performative types:

- **`task-request`**: "Execute this task and report completion" (maps to FIPA-Request)
- **`capability-query`**: "Can you handle this type of task?" (maps to FIPA-Query)
- **`status-inform`**: "Here is the current status of this task" (one-way notification)
- **`result-inform`**: "Here is the result of the completed task" (final delivery)
- **`error-failure`**: "Task attempted but failed, here is why" (structured failure)
- **`cancellation-request`**: "Cancel the in-progress task" (lifecycle management)

Each of these requires different handling. Conflating them into a generic "message" creates ambiguity about what the receiver should do.

### Self-Describing Completions

Follow the FIPA pattern: task completion messages should include enough context to be matched to the original task request without external lookup. At minimum, include: task ID, original task description, completion status, result or error. This is more verbose than a bare "task X completed," but it eliminates the "I can't find the original request for this completion notification" problem.

### Protocol Labeling

Every message in WinDAGs should carry a `:protocol` label identifying which interaction protocol it belongs to. This enables the receiver to track the correct state machine for the conversation. Without protocol labels, a `failure` message is ambiguous: which of several in-flight interactions did this failure belong to?

### Language and Ontology Negotiation

When skills are registered in the DF (Skill Directory analog), they should declare what content languages and ontologies they understand. When an orchestrator needs to invoke a skill, it should select a shared language and ontology and declare it in the invocation message. If the skill returns `not-understood: unsupported-value` on the `:language` or `:ontology` field, the orchestrator should attempt translation to a supported representation.

This language/ontology negotiation is what makes skills truly interoperable across different orchestrators that may use different internal representations.

## The Not-Understood Pattern as a Self-Healing Mechanism

The `not-understood` exception is particularly valuable as a self-healing mechanism. When an agent receives a message it cannot interpret, it echoes the uninterpretable message back in the `not-understood` response:

```
(not-understood
  :content
    (propose ...)    ← The original message, verbatim
    (unsupported-act propose))  ← What was wrong
```

This echo serves multiple purposes:
1. The sender can see exactly what the receiver received (verifying transmission fidelity)
2. The sender knows the specific reason for the not-understood (unsupported-act vs. unrecognised-value)
3. The sender can correct and retry with the appropriate act type or content format

For WinDAGs, implementing this echo pattern in error responses helps with debugging: when an orchestrator receives a `not-understood` from a skill, it should be able to see exactly what it sent and exactly what part was problematic. This transforms debugging from "why did that fail?" to "oh, I sent the wrong message type" — a much more tractable question.

## Caveats

**Verbosity vs. efficiency**: The FIPA message format is verbose — full message echo in every response, full AID descriptions in every sender/receiver field. For high-throughput systems, this verbosity becomes a bottleneck. Performance-critical WinDAGs deployments may need a binary encoding of the same logical structure. The important thing is to preserve the semantic structure, not the FIPA-SL0 syntax specifically.

**Stateless message interpretation**: The self-describing message pattern works because each message is (mostly) interpretable standalone. But some interaction patterns inherently require state: you can't properly interpret an `agree` without knowing what was `request`ed. Implementations must maintain conversation state keyed by interaction ID.

**Protocol explosion**: FIPA's protocol library defines many interaction patterns. Using all of them creates a large vocabulary that all parties must implement. In practice, most WinDAGs interactions need only two or three protocols: synchronous request/response, asynchronous task submission, and status query. Start with the minimum set.

## Summary

FIPA's communication model is built on speech act theory: messages are performative acts, not just data transfers. The FIPA-Request interaction protocol provides a two-phase commitment pattern (agree then complete/fail) that separates rejection from failure. Messages are self-describing, carrying their own context for interpretation and matching. Ontology and language declarations in every message ensure shared interpretive context. The `not-understood` exception with echoed content enables self-healing communication. For WinDAGs: define distinct performative types for different interaction purposes, use the agree/complete split for long-running tasks, make completion messages self-describing, and implement `not-understood` with content echo as the error response for uninterpretable messages.