# Insight Pathway Activation & Anchor Revision

```mermaid
stateDiagram-v2
    [*] --> ProblemEncounter
    
    ProblemEncounter --> AnomalyDetection: Encounter contradictory data
    ProblemEncounter --> PatternRecognition: Notice cross-domain similarity
    ProblemEncounter --> ImpasseRecognition: Hit genuine impasse
    
    %% CONTRADICTION PATHWAY
    AnomalyDetection --> KnowledgeShieldCheck{Explaining away<br/>the anomaly?}
    KnowledgeShieldCheck -->|Yes, treating as outlier| FalseStart1[Knowledge shield blocking insight]
    FalseStart1 --> ReframeTrigger1[Deliberately accept anomaly<br/>as most reliable data]
    ReframeTrigger1 --> AnomalyDetection
    
    KnowledgeShieldCheck -->|No, taking seriously| WeakAnchorID[Identify weakest anchor<br/>in current frame]
    WeakAnchorID --> AnchorRevision1[Revise entire frame<br/>around anomaly]
    AnchorRevision1 --> FrameRevisionComplete1[Contradiction Insight:<br/>Frame restructured]
    
    %% CONNECTION PATHWAY
    PatternRecognition --> BridgeSearch{Can pattern<br/>bridge domains?}
    BridgeSearch -->|No clear connection| FalseStart2[Pattern too distant]
    FalseStart2 --> ExploreMore[Gather more examples]
    ExploreMore --> PatternRecognition
    
    BridgeSearch -->|Yes, relationship found| BridgeAnchor[Create new anchor<br/>bridging both domains]
    BridgeAnchor --> FrameExpansion[Expand frame to<br/>encompass both cases]
    FrameExpansion --> FrameRevisionComplete2[Connection Insight:<br/>Frame broadened]
    
    %% DESPERATION PATHWAY
    ImpasseRecognition --> ImpasseValidation{Is this a<br/>genuine impasse?}
    ImpasseValidation -->|No, execution problem| FalseStart3[Problem definition likely correct]
    FalseStart3 --> ExecutionFocus[Focus on execution<br/>optimization instead]
    ExecutionFocus --> [*]
    
    ImpasseValidation -->|Yes, reframing needed| StrongAnchorExamine[Examine strong anchors<br/>blocking progress]
    StrongAnchorExamine --> AnchorReplacement[Replace flawed anchor<br/>with alternative assumption]
    AnchorReplacement --> ProblemReframing[Problem becomes tractable<br/>under new frame]
    ProblemReframing --> FrameRevisionComplete3[Desperation Insight:<br/>Anchor replaced]
    
    %% CONVERGENCE & COMPLETION
    FrameRevisionComplete1 --> ExpertiseValidation{Does expertise<br/>enable recognition?}
    FrameRevisionComplete2 --> ExpertiseValidation
    FrameRevisionComplete3 --> ExpertiseValidation
    
    ExpertiseValidation -->|Yes, domain knowledge required| InsightActivation[Insight activated:<br/>Frame restructured]
    ExpertiseValidation -->|No, novel configuration| InsightActivation
    
    InsightActivation --> GradualOrSudden{Insight mode:<br/>Gradual or sudden?}
    GradualOrSudden -->|Gradual| PatternAccumulation[Continue pattern<br/>tracking over time]
    PatternAccumulation --> InsightRecognition[Recognition threshold passed]
    
    GradualOrSudden -->|Sudden| AhaMoment[Accompaniment to<br/>restructuring]
    AhaMoment --> InsightRecognition
    
    InsightRecognition --> [*]
```
