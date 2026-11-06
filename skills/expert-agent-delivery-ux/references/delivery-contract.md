# Delivery contract and failure cases

A user-facing task follows one durable identity across its inbox entry, preview, conversation, review, and release receipt. The owner can delegate execution or checks. The assignment stays with that specialist until an explicit, recorded transfer.

## Minimum contract

| Record | Required fields | User sees |
|---|---|---|
| Assignment | Task ID, project ID, specialist owner, outcome, audience, promised deliverable, acceptance criteria, constraints | “Iris will deliver a tested, private portfolio preview for prospective clients.” |
| Mandate | Allowed data and actions, permitted destinations and environments, whether writes or external effects are permitted, limits and expiry, authority record | “Can work in this draft. Ask before publishing or contacting anyone.” |
| Checkpoint | Task ID, monotonically ordered event ID, previous and current state, revision if any, event time, evidence reference, next actor | “Preview built. Checking the contact flow.” |
| Review bundle | Immutable revision, accessible preview or diff, checks and evidence, open issues, recommendation, available actions | “Ready for review · Version 3. See what changed.” |
| Effect approval | Task ID, revision, environment and destination, exact effect, approver or policy, issuance and expiry, event or idempotency ID | “Publish version 3 to example.com” and its consequences |
| Verification | Revision, destination, check and criteria, verifier identity or service, status, timestamp, evidence locator | “Published to example.com. The live page and contact confirmation were verified.” |
| Recovery | Original effect ID, reversible or compensating operation and dependencies, recovered scope, follow-up verification | “Restored the previous website. Two messages had already been sent.” |

Authorization and task status are durable. A local browser, chat transcript, typing animation, or a notification can present that state but should never create a success state on its own. Persist the task and its latest readable checkpoint before sending an update. Order or deduplicate updates by task and event ID. Treat artefact diffing, readback, and authorization enforcement as separate concerns from the UI.

## Example assignment

**User request.** “Build my portfolio and make it work on a phone. I want future clients to be able to contact me.”

**Specialist mandate.** Iris owns a working portfolio site and contact flow. Iris may use the approved biography, photos, and project descriptions, select the layout and implementation, and use synthetic contact data in a private preview. Publication and connecting an inbox require separate authority. Iris chooses an implementation and provides an editable deliverable. Ask the user for their preferred reply address only when it is needed to connect real submissions. Continue private testing with a disposable test target meanwhile.

**Private review bundle.** Version 3 includes the homepage, project view, and contact form. A stable preview and “What changed” lead the review. Acceptance evidence covers a narrow phone layout and wide layout, keyboard focus and error recovery, form success and failure with synthetic data, and actual destinations for all agreed links. Show the capture or measured result alongside each check. A checker independent of the producing agent runs acceptance against the immutable revision. If that verifier is unavailable, show which evidence came from the producer and mark independent verification pending.

**Review choices.** “Preview version 3”, “Request changes”, or “Publish version 3 to example.com”. The authenticated confirmation shows destination, visibility, and the connected contact address. If approval is given, perform the bound effect, then have the verifier read back the target revision and check the live happy path using test data. A site that responds but serves a different revision remains unverified.

**Mobile reentry.** The push says “Portfolio preview ready for review” with no private project or contact data. It opens the exact task and revision after sign-in. Review starts with a usable preview, key differences, and a single clear action. If the review revision was superseded, explain that and offer to inspect the new revision. A user with push disabled can find the same item in the in-app task inbox.

## Failure cases

| When | Behave this way |
|---|---|
| User tries to edit a version under review | Preserve the reviewed version. Start or identify a new revision, display material differences, and invalidate stale authorization for that effect. |
| New access is needed or authority expired while paused | Stop at the permitted boundary. Explain which asset or operation is blocked and give one request with a reason and scope. Revalidate on resume and continue the permitted work if it can be completed independently. |
| Pause or cancel arrives during an in-flight effect | Show “Stopping” while reconciling. Look up the effect by idempotency key and show exactly what happened. Offer compensation where supported. |
| A provider times out while an effect may already have succeeded | Show “Outcome being checked”. Read back the effect before retrying. If certainty remains unavailable, expose the check and escalation path before another attempt. |
| Preview passes but a live check fails | Keep the target and failure visible. Show whether a prior version can be restored. Verify the target again after recovery. |
| User asks for rollback after the effect has left the system | Separate local restoration from external reversal. State the remaining consequences and present only supported actions. |
| Specialist changes while work is paused | Show the transfer with the previous checkpoint and outstanding decision. Revalidate grants if they were tied to the earlier specialist or task scope. |
| Reviewer and publisher are different people | Preserve approval history and distinguish the reviewer’s recommendation from the effect authorizer’s grant. Show what is waiting on each role. |
| Device is offline or a notification has gone stale | Open the safe read-only context, distinguish cached from current status, refresh once available, and recheck permissions and revision before enabling consequential actions. |

## Acceptance drill

1. Start from a plain-language mandate and leave during a long task. Return on another device. Identify the owner, current checkpoint, and pending decision without opening logs.
2. Receive a stale “ready” link after a revision change. Verify it cannot approve the new version, a different destination, or a materially different effect.
3. Pause or cancel during a simulated timeout. Verify no duplicate effect on retry and that the interface distinguishes pending, performed, and recovered effects.
4. Deliver with one check unavailable and one failing. Verify that check outcomes and a safe next action remain visible. Re-run against the exact final revision before marking it verified.
5. Repeat with keyboard-only, screen reader, 200% text, reduced motion, and push denied. Preserve reading order and a viable in-app decision path. Test meaningful changes to task state without flooding announcements.
