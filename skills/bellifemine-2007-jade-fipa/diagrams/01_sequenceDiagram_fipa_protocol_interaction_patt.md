# FIPA Protocol Interaction Patterns

```mermaid
sequenceDiagram
    participant Initiator as Initiator Agent
    participant Participant as Participant Agent

    rect rgb(200, 220, 255)
    Note over Initiator,Participant: CONTRACT NET PROTOCOL
    Initiator->>Participant: CFP (Call For Proposal)
    Participant->>Initiator: PROPOSE (with bid/price)
    alt Proposal Accepted
        Initiator->>Participant: ACCEPT-PROPOSAL
        Participant->>Initiator: INFORM (execution complete)
    else Proposal Rejected
        Initiator->>Participant: REJECT-PROPOSAL
    end
    end

    rect rgb(220, 200, 255)
    Note over Initiator,Participant: REQUEST PROTOCOL
    Initiator->>Participant: REQUEST (execute action)
    alt Action Possible
        Participant->>Initiator: AGREE (commitment)
        Participant->>Initiator: INFORM-RESULT (action done)
    else Action Impossible
        Participant->>Initiator: REFUSE (explain reason)
    end
    end

    rect rgb(255, 220, 200)
    Note over Initiator,Participant: REQUEST-WHEN PROTOCOL
    Initiator->>Participant: REQUEST-WHEN (conditional action)
    Participant->>Initiator: AGREE (waiting for condition)
    Participant->>Initiator: INFORM (condition met, executing)
    Participant->>Initiator: INFORM-RESULT (action complete)
    end

    rect rgb(220, 255, 200)
    Note over Initiator,Participant: SUBSCRIBE PROTOCOL
    Initiator->>Participant: SUBSCRIBE (monitor state)
    Participant->>Initiator: AGREE (subscription active)
    loop State Change Events
        Participant->>Initiator: INFORM (state updated)
    end
    Initiator->>Participant: CANCEL (unsubscribe)
    Participant->>Initiator: INFORM (subscription ended)
    end
```
