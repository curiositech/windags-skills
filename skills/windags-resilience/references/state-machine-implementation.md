# State Machine Implementation

Resilience state manager requirements:
- Validate transitions explicitly.
- Emit events for checkpoint creation, resume, skip propagation, and abort.
- Keep wave and phase identifiers in state to support partial recovery.
- Snapshot only durable state, not transient model-client handles.
