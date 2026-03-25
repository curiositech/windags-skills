# Protocol Limits and the Interoperability Gap: What Protocols Cannot Guarantee

## The Honest Admission at the Heart of the FIPA Specification

One of the most important passages in the FIPA Interaction Protocol Library Specification is not a technical definition — it is a warning. After specifying the interaction protocols in careful detail, the document states:

> "These IPs are not intended to cover every desirable interaction type. Individual IPs do not address a number of common real-world issues in agent interaction, such as exception handling, messages arriving out of sequence, dropped messages, timeouts, cancellation, etc. Rather, the IPs defined in this specification set should be viewed as interaction patterns, to be elaborated according to the context of the individual application. This strategy means that adhering to the stated IPs does not necessarily ensure interoperability; further agreement between agents about the issues above is required to ensure interoperability in all cases." (Section 2.1)

This is a remarkable admission for a standards document. It says: *compliance with our standard is not sufficient for your agents to actually work together*. The protocols define the happy-path structure of interactions. But real conversations between agents happen in environments where things go wrong, where timing is unpredictable, where one party may disappear mid-conversation, where the same message might arrive twice. The protocols are silent on all of this.

For any agent system designer — and especially for designers of WinDAG-style orchestration systems — this gap between *protocol compliance* and *genuine interoperability* is one of the most dangerous failure modes to underestimate.

## What the Protocols Cover: The Happy Path

The FIPA interaction protocols are genuinely excellent at specifying the normal flow of a conversation. The ContractNet protocol, for instance, specifies precisely:
- What messages an Initiator sends and when
- What responses are valid from a Participant
- What the Initiator does with each type of response
- Which terminal states are possible (success, failure, refusal)

Within the happy path — where all messages arrive in order, all agents remain available, all deadlines are respected, and all parties understand the messages — the protocols provide unambiguous guidance. An agent implementing ContractNet correctly will coordinate smoothly with any other agent implementing ContractNet correctly.

But the happy path is a fiction in real systems.

## The Six Unspecified Failure Modes

The FIPA specification explicitly names six categories of real-world issues that protocols do not address:

### 1. Exception Handling
What happens when an agent encounters an unexpected situation mid-protocol? Not "I can't do this task" (which is handled by `refuse` or `failure`), but "the protocol itself has entered an undefined state"? Standard IPs have no mechanism for signaling protocol-level exceptions.

### 2. Messages Arriving Out of Sequence
Networks are asynchronous. An `accept-proposal` might arrive after the agent has timed out and cancelled the protocol. A `failure` message might arrive after a `not-understood` message for the same conversation. The protocol specification tells you what order messages *should* arrive in — it says nothing about what to do when they don't.

### 3. Dropped Messages
The Initiator sends a `cfp` and waits. The Participant sends a `propose` and waits. Neither gets a response. Was the message dropped? Is the other party processing? Has the other party failed? The protocol has no heartbeat mechanism, no acknowledgment requirement, no way to distinguish "slow" from "absent."

### 4. Timeouts
The ContractNet protocol specifies a `deadline` parameter — the point after which proposals are no longer useful. But what happens when the deadline passes and the Initiator has received no proposals? What happens when an `accept-proposal` has been sent but no `inform` or `failure` arrives? The protocol is silent on timeout handling.

### 5. Cancellation
What if the Initiator, having sent an `accept-proposal`, decides mid-execution that it no longer needs the result? Can it cancel? The FIPA protocols do not specify a cancellation mechanism within an ongoing conversation. (FIPA does specify a separate Cancel meta-protocol, but it is not integrated into the base IPs as a first-class concern.)

### 6. Duplicate Messages
What if a message is delivered twice? Should the second delivery be treated as a new message (potentially triggering a second execution) or discarded as a duplicate? The protocols provide no guidance on idempotency or deduplication.

## The Interoperability Gap in Practice

The gap between protocol compliance and genuine interoperability is precisely the gap covered by these six categories. Two agents that both correctly implement ContractNet will still fail to interoperate reliably if they have different assumptions about:
- How long to wait before timing out
- Whether to retry after a dropped message
- What to do with out-of-sequence messages (discard? queue? error?)
- Whether cancellation is possible and how to signal it
- How to handle duplicate deliveries

This is not a failure of the FIPA specification — it is an honest acknowledgment of the scope of the problem. The specification correctly identifies that these issues require "further agreement between agents about the issues above." This additional agreement is typically handled at the infrastructure layer (reliable message delivery, exactly-once semantics), the application layer (explicit timeout agreements), or through additional protocol extensions (cancel sub-protocols, acknowledgment messages).

## Implications for WinDAG Orchestration

### Protocols Are Necessary But Not Sufficient

When designing inter-agent coordination in WinDAGs, implementing a named protocol (ContractNet, Request, Subscribe) should be treated as the *floor* of coordination, not the ceiling. Every protocol invocation should be accompanied by explicit decisions about:

- **Timeout policy**: How long will the requesting agent wait? What action does it take on timeout?
- **Retry policy**: Under what conditions will a failed or dropped message be retried? How many times?
- **Cancellation policy**: Can the requester cancel a delegated task? What cleanup is required?
- **Idempotency requirements**: If a message is delivered twice, is the result the same?
- **Out-of-sequence handling**: Will the system enforce strict message ordering, or tolerate reordering?

These decisions should be documented alongside the protocol name, not left as implicit assumptions.

### The Danger of Assuming Compliance Equals Correctness

A WinDAG skill that correctly implements the ContractNet protocol — sending and receiving the right message types in the right order — can still be a source of system failures if it leaves the above questions unanswered. A skill that hangs waiting for a response to an `accept-proposal` that was never delivered, with no timeout, will block indefinitely. A skill that processes duplicate `cfp` messages will produce duplicate results, potentially causing conflicts downstream.

### Infrastructure Obligations

Some of the gap between protocol and interoperability can and should be closed at the infrastructure level rather than the application level:

- **Reliable delivery** (eliminating dropped messages) should be a transport-layer guarantee, not a protocol concern.
- **Exactly-once semantics** (eliminating duplicate processing) can be handled by message deduplication infrastructure.
- **Ordered delivery** within a conversation eliminates out-of-sequence issues.

Where these infrastructure guarantees are available, application-level protocols can be simpler. Where they are not available — in distributed systems, unreliable networks, or async processing pipelines — application-level protocols must be more defensive.

### Explicit Failure State Naming

One practical response to the interoperability gap is to explicitly name failure states in protocol designs. Instead of leaving timeout behavior undefined, specify it:

- `TIMEOUT_WAITING_FOR_PROPOSAL` — Initiator timed out before any Participant responded
- `TIMEOUT_WAITING_FOR_EXECUTION` — Participant accepted but did not report completion
- `CANCELLED_BY_INITIATOR` — Initiator cancelled an in-flight execution
- `DUPLICATE_REJECTED` — Message discarded as duplicate

When agents can explicitly communicate which failure state they are in, error handling becomes deterministic rather than speculative. This is the spirit of the FIPA approach extended to the failure modes the specification acknowledges but does not resolve.

## What Distinguishes Systems That Get This Right

Systems that successfully navigate the interoperability gap share a common characteristic: **they treat coordination correctness as a first-class concern alongside functional correctness**. A skill that produces the right output in isolation but fails to handle timeout, cancellation, or redelivery correctly is not a production-ready skill — it is a skill waiting to cause an incident.

The FIPA specification's honesty about protocol limits is a gift: it tells you exactly where to look for the hidden complexity in any multi-agent system. Every time you find yourself saying "but what happens if..." about a coordination scenario that isn't addressed by your protocol, you have found the interoperability gap. Name it. Specify it. Decide it. Document it. That is the work the protocols themselves cannot do for you.