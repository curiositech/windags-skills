# Candidate-controlled whiteboard practice

Build an accessible diagramming surface for a candidate-selected design rehearsal. Evaluate the chosen artifact against agreed criteria; do not evaluate the person or assume an ML role.

## Select the practice contract

Confirm the prompt, round type, duration, rubric, allowed materials, and whether any diagram should be retained. For general system design, let the candidate select constraints and observable criteria. Load ML-specific material only for an explicitly selected ML round.

Offer a typed outline or verbal description when drawing is inaccessible. A sparse diagram alone does not establish weak design reasoning.

## Canvas and artifact boundaries

A drawing library may provide shapes, labels, connectors, grouping, undo/redo, and local export. Keep unsaved work in the current session. Snapshots are candidate-selected artifacts, not automatic monitoring.

| Action | Required control |
| --- | --- |
| Retain a snapshot | Candidate selects the snapshot and its retention purpose. |
| Send an image to an external model | Separate approval of the artifact, provider, and processing purpose. |
| Mid-session feedback | Candidate opts in and can pause or decline prompts. |
| Change difficulty or timing | Candidate approves the proposed change. |
| Delete/export | Candidate selects retained artifacts and sees the operation's actual status. |

Do not capture the candidate, other applications, or a second monitor. Revoking external-processing consent prevents queued and future sends.

## Feedback protocol

Supply the evaluator only the approved snapshot or accessible alternative, selected prompt, agreed rubric, and any separately approved supporting transcript. Missing artifacts and unreadable labels are limits on evaluation.

For each finding, return a structure like this:

```json
{
  "criterion": "Describe the data flow under the selected constraints",
  "artifact_id": "candidate-selected-snapshot-2",
  "evidence_pointer": "The labelled arrow from API to queue",
  "observation": "The diagram identifies an asynchronous request path",
  "evidence_status": "supported",
  "limits": "The snapshot does not describe retry behavior",
  "proposed_experiment": "Optionally annotate one retry path next rehearsal",
  "candidate_approval": "pending"
}
```

Use `supported`, `limited`, or `unavailable` for evidence status. Do not infer spoken tradeoffs from an image, treat undrawn components as absent from the candidate's reasoning, or judge progress from elapsed time.

## Example observable criteria

Offer only criteria relevant to the selected problem:

- Labels and connections identify a request or data path.
- Annotations state candidate-selected capacity or latency constraints.
- A named alternative and its tradeoff appear in the approved artifact.
- A failure or recovery path is described where the candidate selected that concern.

These criteria describe the artifact. They do not produce weighted averages, overall scores, readiness ratings, personality findings, rankings, or hiring forecasts.

## Debrief and optional next step

Show evidence-linked findings and evaluation limits. Let the candidate correct the interpretation and accept, edit, or decline one next-practice proposal. Never auto-adapt the prompt from image quality, apparent engagement, drawing speed, or inferred affect.

## Verification scenarios

Exercise no-retention sessions, denied external processing, revocation before upload, an incomplete snapshot, an accessible text alternative, a network error, and a declined follow-up. Unavailable evidence remains unavailable; none of these cases generates a negative assessment of the candidate.
