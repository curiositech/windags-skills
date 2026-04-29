# Phase Orchestration Resilience

Phase boundaries are the safest checkpoint locations.

Guidelines:
- Persist outputs after each phase, not only at the end of the run.
- Preserve accumulated outputs when a later phase fails.
- Resume from the earliest invalidated phase instead of restarting the run.
- Treat aborts and operator cancellations differently from failures.
