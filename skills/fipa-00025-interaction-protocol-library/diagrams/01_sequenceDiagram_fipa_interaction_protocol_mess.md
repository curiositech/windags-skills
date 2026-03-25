# FIPA Interaction Protocol Message Flows

```mermaid
sequenceDiagram
    participant I as Initiator Agent
    participant P as Participant Agent
    
    Note over I,P: FIPA Request Protocol
    I->>P: request(action)
    activate P
    
    alt Agree to perform
        P->>I: agree(action)
        activate I
        
        alt Action succeeds
            P->>I: inform(done(action))
            deactivate I
            Note over I,P: Protocol Complete
        else Action fails
            P->>I: inform(failed(reason))
            deactivate I
            Note over I,P: Failure Reported
        end
    else Refuse request
        P->>I: refuse(action)
        deactivate P
        Note over I,P: Protocol Complete
    end
    
    deactivate P

    rect rgb(200, 230, 255)
    Note over I,P: FIPA Contract Net Protocol
    I->>P: cfp(task)
    activate P
    
    par Parallel Proposals
        P->>I: propose(bid1)
    and
        P->>I: propose(bid2)
    end
    
    deactivate P
    activate I
    
    I->>P: accept-proposal(bid1)
    deactivate I
    activate P
    
    alt Task execution succeeds
        P->>I: inform-done(result)
    else Task execution fails
        P->>I: failure(reason)
    end
    deactivate P
    end
    
    rect rgb(230, 200, 255)
    Note over I,P: FIPA Auction Protocol (English Auction)
    I->>P: cfp(initial_bid)
    activate P
    P->>I: bid(amount1)
    deactivate P
    activate I
    
    loop While higher bids possible
        I->>P: inform(current_bid)
        activate P
        alt Agent raises bid
            P->>I: bid(amount_higher)
            deactivate P
            activate I
        else Agent withdraws
            P->>I: refuse(bid)
            deactivate P
            break Auction ends for this agent
            end
        end
    end
    
    deactivate I
    I->>P: inform(auction-closed, winner)
    activate P
    deactivate P
    end
```
