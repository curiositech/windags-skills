# Candidate-controlled mobile practice architecture

Design optional mobile drills, flash cards, story rehearsal, and session review. The app implements the candidate's practice contract; it does not assess employability, attention, emotion, integrity, or personality.

## Candidate controls before implementation

Confirm modalities, retained artifacts, feedback criteria, accessibility needs, time budget, and optional external providers. Text practice remains usable without a microphone, camera, cloud account, or notifications.

| Capability | Initial state | Candidate control |
| --- | --- | --- |
| Audio recording and transcription | Off | Start, pause, stop, select a segment, and choose whether to retain or process it. |
| Whiteboard/code retention | Off | Select an artifact and its retention purpose. |
| Remote processing or sync | Off | Approve the provider, destination, purpose, and specific artifacts before sending. |
| Practice reminders | Off | Select wording, times, frequency, and pause or disable them. |
| Analytics | Off | Opt in separately; practice artifacts are excluded. |

No camera capture, background-device inspection, biometric analysis, affect inference, or proctoring is part of this design.

## Architecture boundaries

| Layer | Responsibility |
| --- | --- |
| Practice screen | Candidate-selected prompt, timer, accessible input, and pause/end controls. |
| Local artifact store | Keep only selected text, code, drawings, recordings, and self-notes, with purpose and retention metadata. |
| Feedback adapter | Apply agreed observable criteria to approved artifacts; attach evidence pointers and limits. |
| Review screen | Separate observations from optional experiments; allow corrections and acceptance, editing, or rejection. |
| Reminder scheduler | Use candidate-approved practice priorities and available time. |
| Optional sync adapter | Enforce per-artifact authorization at queueing and again immediately before transmission. |

A mobile framework, local database, and speech provider are implementation choices. Choose them after confirming device support and the candidate's controls; provider availability does not authorize collection.

## Recall and rehearsal scheduling

A spaced-repetition algorithm may propose flash-card intervals from a recall rating the candidate enters. Display each proposal and allow an override. A missing rating is unknown, not failure.

Story rehearsal and round allocation use candidate-selected priorities. Do not derive them from automatic weakness rankings, composite interview scores, speech rate, silence, or inferred confidence.

Reminders reflect the next accepted block. For example: “You selected a 20-minute constraint-framing rehearsal for Thursday.” Do not instruct the candidate to clear their schedule or close other apps.

## Evidence-linked session review

Each finding records the artifact identifier and segment, the agreed criterion, a direct observation, and evidence status: supported, limited, or unavailable. A missing or corrupted transcript cannot support a negative finding.

Offer at most three strengths, three improvement experiments, and one next-session proposal. Do not aggregate them into a readiness score, percentile, pass/fail result, or hiring probability.

## Retention and sync lifecycle

1. Keep an unrecorded session ephemeral; recording consent is separate from export or cloud-processing consent.
2. Attach destination, purpose, and consent state to every retained artifact and queued operation.
3. Recheck consent before each send. Revocation cancels queued operations and prevents new sends.
4. Let the candidate review and remove local artifacts. Where remote removal is supported, request it and show confirmed removal separately from pending or unavailable removal.
5. Report sync errors without treating the artifact as uploaded. Do not log artifact contents.
6. Preserve the candidate's selected local work through a network failure without silently enabling remote sync later.

## Offline and accessibility behavior

Text, local timers, candidate-authored notes, and selected local playback can work offline. External speech or image services are optional. If unavailable, offer text or a candidate-selected local artifact without grading the missing modality.

Provide accessible controls, keyboard navigation where supported, adjustable timeboxes, and a text alternative to every audio or drawing task.

## Verification scenarios

Verify denied consent, revocation while queued, provider failure, partial transcript coverage, reminder opt-out, candidate overrides, and unavailable remote deletion. Each must preserve candidate control and make unavailable feedback or operations explicit.
