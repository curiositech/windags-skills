# Exceptions as Ontology: Why Failure Taxonomies Enable Agent Reasoning

## The Problem with Opaque Failures

In most distributed systems, when something goes wrong, you get back an error code and a string message. The error code tells you very little: HTTP 400 (bad request) conflates dozens of different failure modes. The string message is human-readable but not machine-processable. An agent receiving a 400 error cannot distinguish between "you sent the wrong ontology," "you're not authorized," "that function doesn't exist," or "you sent too many arguments" — all of which require completely different remediation strategies.

FIPA's Agent Management Specification takes a radically different approach: failures are structured predicates in a formal ontology, not error codes. An exception is not an interruption to the normal flow — it is a typed, semantic assertion about *why* something failed, expressed in the same content language (FIPA-SL0) as normal messages.

> "Under some circumstances, an exception can be generated, for example, when an AID that has been already registered is re-registered. These exceptions are represented as predicates that become true." (Section 6.3)

## The Four Exception Classes

FIPA defines four top-level exception classes that structure the space of possible failures (Section 6.3.2):

### 1. `unsupported`
The communicative act and its content have been understood by the receiving agent, but it does not support that action. This is a capability gap — the receiver understood what was asked but cannot do it.

**Example**: Sending a `modify` request to an AMS that is configured as read-only. The AMS understood the request perfectly; it just doesn't support modification.

**Remediation**: Find a different agent that does support the function. Do not retry with the same agent.

### 2. `unrecognised`
The content has not been understood by the receiving agent. This is a parsing/interpretation failure — the receiver could not make sense of what was sent.

**Example**: Sending a message in an ontology the receiver hasn't loaded, or using a content language it doesn't speak.

**Remediation**: Check message format, ontology, and language compatibility. Re-send with a compatible representation.

### 3. `unexpected`
The content has been understood, but it includes something that was not expected in this context. This is a contextual error — the individual parts are recognized, but their combination or timing is wrong.

**Example**: Sending a parameter that is valid in isolation but not valid for this particular function call context (like sending `unexpected-argument` — a function argument that is present but not required).

**Remediation**: Re-examine the message construction logic. The sender made a logical error in assembling the message.

### 4. `missing`
The content has been understood, but something that was expected is absent. The inverse of `unexpected`.

**Example**: Sending a `register` request without including a mandatory AID parameter.

**Remediation**: Add the missing element and retry.

## Three Communicative Act Types for Exceptions

The exception classes are delivered through three different communicative acts, each with its own semantic implications (Section 6.3.1):

### `not-understood`
Used when the receiving agent cannot parse or interpret the incoming communicative act itself. The entire message is opaque to the receiver. This is the most fundamental failure — below the level of semantics.

The `not-understood` predicates (Section 6.3.3):
- `unsupported-act` (String): The receiver doesn't support this type of communicative act at all
- `unexpected-act` (String): The receiver supports the act type but it's out of context here
- `unsupported-value` (String): The receiver doesn't support the value of a specific message parameter
- `unrecognised-value` (String): The receiver can't parse the value of a specific message parameter

### `refuse`
Used when the request was understood but will not be processed — either because the receiver doesn't support it, doesn't have permission to allow it, or the message is logically ill-formed.

The `refuse` predicates (Section 6.3.4):
- `unauthorised`: You don't have permission
- `unsupported-function` (String): The function name is not supported
- `missing-argument` (String): A required function argument is absent
- `unexpected-argument` (String): An argument was provided that is not required
- `unexpected-argument-count`: Wrong number of arguments
- `missing-parameter` (String, String): A mandatory parameter within an argument is missing (object name + parameter name)
- `unexpected-parameter` (String, String): An unexpected parameter was present (function name + parameter name)
- `unrecognised-parameter-value` (String, String): The parameter value could not be recognised (object name + parameter name)

### `failure`
Used when the request was accepted (an `agree` was previously sent) but execution failed. This is a *runtime* failure, not a message-level failure. The request was valid; something went wrong during processing.

The `failure` predicates (Section 6.3.5):
- `already-registered`: Tried to register something that's already registered
- `not-registered`: Tried to operate on something that isn't registered
- `internal-error` (String): Something went wrong inside the receiver that isn't the sender's fault

## The Two-Phase Commit Pattern Hidden in the Exception Model

Notice the distinction between `refuse` and `failure`. The FIPA-Request protocol (referenced in Section 6.3) works as follows:

1. Sender sends `request`
2. Receiver sends `agree` (I will try to do this) OR `refuse` (I won't even try, here's why)
3. If `agree` was sent, receiver later sends `inform done` (success) OR `failure` (I tried and failed, here's why)

This is a *two-phase commit pattern* for agent interactions. The `refuse` happens before any state change is attempted. The `failure` happens after a state change was attempted and failed. This distinction matters enormously:

- `refuse` means: "Don't expect any side effects. The state hasn't changed. Retry with a corrected message or find a different agent."
- `failure` means: "A state change was attempted. The system may be in a partially-changed state. Before retrying, you should query the current state of the affected objects."

The Annex A dialogue examples make this explicit: the AMS sends `agree` then `inform done` on success (examples 2 and 4). If something went wrong after agreement, a `failure` would be sent instead of `inform done`.

## Exception Selection Logic: A Decision Tree

Section 6.3.1 specifies the exact rules for which communicative act to use:

1. If the communicative act itself is not understood → `not-understood`
2. If the requested action is not supported → `refuse`
3. If the action is supported but the sender is not authorized → `refuse`
4. If the action is supported and sender is authorized but the message is syntactically/semantically malformed → `refuse`
5. In all other cases → `agree`, then later either `inform done` or `failure`

This is a clean decision tree that separates four different things: comprehension failure, capability gap, authorization failure, message quality failure, and execution failure. Each requires a different response from the sender.

## Application to WinDAGs Error Handling

### Current Problem: Undifferentiated Failure

Most orchestration systems treat all skill invocation failures the same: log the error, possibly retry, possibly route to a fallback. This is inadequate because the correct response depends entirely on *why* it failed:

- If a skill returned `unsupported-function`, retrying is pointless — the skill genuinely cannot do this. Route to a different skill.
- If a skill returned `missing-parameter`, the orchestrator's message construction is wrong. Fix the orchestrator before retrying.
- If a skill returned `unauthorised`, there is an access control issue that needs human investigation.
- If a skill returned `failure: internal-error`, the skill may have left state half-changed. Query state before retrying.
- If a skill returned `failure: already-registered`, the operation was already done — treat as success.

### Implementing a FIPA-Inspired Exception Taxonomy in WinDAGs

Define a structured exception type for all skill invocation responses with the following hierarchy:

```
SkillException
├── NotUnderstood (message was opaque)
│   ├── UnsupportedAct (wrong message type entirely)
│   ├── UnrecognisedOntology (skill doesn't speak this schema)
│   └── UnrecognisedValue (specific field value not parseable)
├── Refused (request rejected before execution)
│   ├── Unauthorized (access control failure)
│   ├── UnsupportedFunction (skill doesn't have this capability)
│   ├── MissingArgument (required input not provided)
│   ├── UnexpectedArgument (provided input not expected)
│   └── MalformedParameter (argument structure is wrong)
└── Failed (execution attempted, something went wrong)
    ├── AlreadyDone (idempotent — treat as success)
    ├── NotFound (target of operation doesn't exist)
    └── InternalError (skill's fault, may have partial side effects)
```

### Retry Logic Per Exception Class

```
NotUnderstood:
  → Do NOT retry with same message
  → Check ontology/schema compatibility
  → If UnsupportedAct: wrong skill type entirely, find different skill
  → If UnrecognisedOntology: translate to supported ontology if possible

Refused:
  → Do NOT retry with same message (Unauthorized, UnsupportedFunction)
  → OR fix message and retry (MissingArgument, MalformedParameter)
  → Unauthorized: escalate to human or policy system
  → UnsupportedFunction: search DF for different skill with this capability

Failed:
  → QUERY STATE FIRST before retrying
  → AlreadyDone: treat as success, continue workflow
  → NotFound: check if pre-condition was satisfied
  → InternalError: check skill health, attempt once more, then escalate
```

### The Agree/Inform Split in WinDAGs

WinDAGs skill invocations should distinguish between:
- **Acknowledgment** ("I received your task and will process it"): fast, low-latency
- **Completion** ("I have finished processing your task"): asynchronous, may take time

This maps directly to FIPA's `agree` / `inform done` separation. The orchestrator should handle these as two distinct events. If it receives `agree` but never receives `inform done` within a timeout, that is different from never receiving `agree` at all:
- No `agree` → skill may not have received the message, retry delivery
- `agree` but no `inform done` → skill received the task but got stuck, investigate lifecycle state, potentially force-terminate and retry with new instance

## The Example from Annex A: Unauthorized Modification

Example 6 in Annex A shows a clean demonstration of the exception system: `dummy` tries to modify `scheduler-agent`'s DF registration, but `dummy` doesn't own `scheduler-agent`. The DF returns:

```
(refuse
  :content
    ((action ... (modify ...))
     (unauthorised)))
```

The `refuse` is paired with the original action in the content, so the receiver knows exactly which action was refused. The `unauthorised` predicate has no arguments because the reason is self-explanatory — this agent simply doesn't have permission.

Compare this to Example 7, where `dummy` sends a `propose` performative to do a `deregister`. The DF doesn't understand `propose`:

```
(not-understood
  :content
    (propose ...
     (unsupported-act propose)))
```

The `not-understood` wraps the entire original message and names the specific unsupported act. The receiver can see exactly what went wrong at the protocol level.

Both examples show that the exception carries enough information for the receiving agent to *programmatically diagnose and route* the failure — not just log it for human review.

## Caveats

**Exception richness has a cost**: Implementing the full FIPA exception taxonomy requires every skill to correctly categorize its failures. If skills return generic `internal-error` for everything, the taxonomy provides no benefit. The taxonomy's value is proportional to implementation discipline.

**Not all failures are agent-addressable**: Some failures (network partitions, hardware failures, resource exhaustion) don't fit cleanly into the FIPA exception model. The `internal-error` catch-all exists for these, but they often require infrastructure-level response rather than agent-level reasoning.

**The two-phase pattern adds latency**: Requiring `agree` before beginning work means an extra round-trip compared to fire-and-forget. For short, synchronous tasks, this overhead may not be worth it. For long-running, stateful tasks, the agree/failure distinction is essential.

## Summary

FIPA's exception taxonomy transforms failures from opaque events into structured, reasoning-amenable information. By categorizing failures along two axes — *when* the failure occurred (before or after agreement) and *why* it occurred (comprehension, capability, authorization, message quality, execution) — the taxonomy enables agents to make intelligent decisions about how to respond. WinDAGs should adopt this structure: define a rich exception type hierarchy, implement specific retry/escalation logic for each exception class, use the agree/completion split for long-running tasks, and treat `failure` (post-agree) as potentially involving partial state changes that must be queried before retrying.