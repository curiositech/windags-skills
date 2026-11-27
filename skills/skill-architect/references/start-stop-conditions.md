# Start and stop conditions

Use these checks when a skill can take action, change a file, hand work to another agent, or claim a result. Put a short **Start when** and **Stop when** block in the skill body. State the task, required inputs, authority, the observable op that matters, what qualifies as evidence, and where to resume. A review-only skill may need only a sentence in each block.

| Decision | What to write |
| --- | --- |
| Start | The state or task that calls for the workflow and the evidence that makes its prerequisites true. Name the first check and a likely reason to choose another workflow. |
| Continue or recover | The expected observation and the suspicious absence, wrong scope, or stale result that changes the next action. Read the underlying artifact or switch to a permitted independent check. |
| Complete | The current artifact and observed invariant that close the task. Say what equivalent evidence is acceptable when tools, labels, or paths change. |
| Handoff | The artifact, required fields, provenance and freshness, recipient, and acceptance check. Name any evidence the recipient must revalidate upon input changes. |
| Blocked | The missing permission, resource, or evidence, what was verified, and the actionable condition for resuming. Keep verified partial output identifiable. |

The conditions become machine-enforced only when the host checks them at the relevant tool or schema boundary. Keep the body checks in portable Markdown and add structured metadata only where the target host documents and parses it.

## Worked example

An invoice skill reviews changes to cancellation. An earlier report shows all tests green, while the current revision no longer demonstrates that the original ledger entry is retained.

- **Start when** the change touches invoice cancellation behavior. Resolve the current revision and identify the original ledger entry and the correction it should produce.
- **Stop when** a current test or equivalent run shows that removing the original entry was attempted and refused and that cancellation has the expected effect. If the required evidence cannot be found or produced, report the missing check and the revision examined.
- **`holds_when`** — a current result establishes the attempted mutation and its refusal on the original entry. A test with a different name or location can qualify.
- **`breaks_when`** — the harness skipped the attempt, ran against another revision, or checked a fixture that bypasses the real persistence path.
- **`negative_cues`** — there is no refusal event or equivalent assertion in the trace, although the summary is green.
- **`tool_biases`** — the test summary counts completed tests and has no knowledge of the cancelled invoice invariant. Inspect the specific assertion, fixture and receipt.

Give the agent a green stale report and see if it asks for current evidence. Give it a renamed equivalent test and see if it accepts the evidence. Compare the full skill, a version with only the happy path, and the smallest condition that remedies the failure while holding tools and fixtures fixed.

For the original proposal and examples of challenging a tool result, see [The Legibility Trap](https://curiositech.ai/writings/the-legibility-trap) and the [technical companion](https://github.com/curiositech/harbord-dev/blob/9f3e30ef/docs/writings/the-legibility-trap/technical-notes.md#the-dog-that-didnt-bark-belongs-in-the-skill). For how to make the comparison, see [evaluation evidence](skill-evaluation-evidence.md).
