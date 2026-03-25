# Sensemaking-Decision-Making Separation: Why Experts Keep These Processes Distinct

## The Core Finding

One of the most striking findings from the Year 3 experiments was that "experts exhibit a stronger delineation between sensemaking and decision-making processes" (p. 10). While novices tended to intermix understanding the situation and formulating responses, experts maintained disciplined separation: first making sense of what's happening, *then* deciding what to do.

This separation was quantified in Experiment 1: researchers coded each utterance as either sensemaking-related (inference, inquiry, interpretation) or decision-making-related (proposing actions, evaluating options). They then computed the temporal ordering—did all sensemaking come before decision-making, or were they interleaved?

The experts showed a mean separation score of 13.18, while novices scored only 3.75 (p. 15). This means experts completed substantially more sensemaking before shifting to action planning, whereas novices jumped back and forth between "what's happening?" and "what should we do?"

Moreover, experts devoted proportionally less overall time to sensemaking relative to decision-making (68% vs. 78% for novices, p. 14), but this was because their sensemaking was more efficient and complete—they built adequate understanding faster, then shifted decisively to action planning.

## Why Separation Matters

The separation between sensemaking and decision-making is not merely procedural tidiness. It reflects deep functional advantages:

**1. Frame Stability During Analysis**
When you're simultaneously trying to understand a situation *and* formulate responses, you create circular reasoning: "This action makes sense given interpretation A, so interpretation A must be correct." The cognitive stance of sensemaking—"What's really going on here?"—conflicts with the cognitive stance of decision-making—"What should I do about it?"

By keeping them separate, experts avoid premature commitment. They explore alternative interpretations without the pressure of needing an actionable answer immediately.

**2. Decision Quality Depends on Understanding Quality**  
If your understanding is flawed, your decisions will be flawed—but you won't necessarily see the connection if you've intermixed the processes. As one researcher noted about the novices' tendency to jump to action: their responses showed "abstract understanding" rather than "functional understanding"—they saw events as "a connected series of events that needed to be untangled, but without a clear consideration of ways to influence the situation" (p. 3).

Experts, by contrast, built "functional understanding"—their sensemaking was explicitly framed in terms of "IO actions and means to advance SFOR agenda" (p. 3). But they only got to those actions *after* establishing what the situation actually was.

**3. Metacognitive Monitoring**
The separation creates a natural checkpoint: "Do I adequately understand this situation?" If sensemaking and decision-making are blurred, you lose this checkpoint. You might forge ahead with actions based on incomplete understanding without realizing the foundation is shaky.

**4. Communication and Coordination**
In multi-agent or team contexts, separated processes enable clearer handoffs: "Here's our situation assessment" followed by "Here are recommended actions given that assessment." If these are mixed, downstream agents can't tell which parts are understanding vs. recommendations, making it harder to challenge or build on the analysis.

## Observable Markers of Separation

The research identified specific behavioral markers that indicate separation:

**Strong Separation (Expert Pattern):**
- Extended periods of pure sensemaking activity (questioning, inferring, connecting) before any mention of actions
- Explicit transitions: "Okay, so if that's what's happening, then we should..."  
- Revisiting sensemaking when new data emerges, even after moving to decision-making
- Cavetting actions with confidence in understanding: "If interpretation X is correct, then action Y; but we should verify..."

**Weak Separation (Novice Pattern):**
- Rapid jumping between interpretation and action suggestions
- Action proposals used as evidence for interpretations ("We should do X, which confirms that Y is happening")
- Treating decision-making as part of sensemaking ("One way to understand this is to...")
- Difficulty returning to sensemaking once actions are under discussion

## Implications for Agent Orchestration

In a multi-agent DAG system, this finding suggests several architectural principles:

### Pattern 1: Explicit Sensemaking-Decision Phases

Agents should have explicit operational modes:

**Sensemaking Mode:**
- Goal: Develop adequate situational understanding
- Outputs: Frame representations, confidence assessments, identified anomalies, information needs
- Prohibited: Action recommendations, solution proposals, optimization decisions

**Decision-Making Mode:**  
- Goal: Formulate effective responses given current understanding
- Inputs: Situation assessment from sensemaking phase
- Outputs: Action plans, recommendations, resource allocation decisions
- Permitted: Returning to sensemaking mode if understanding proves inadequate

**Mode Transition Logic:**
```
REMAIN in Sensemaking IF:
  - Frame confidence < threshold
  - Major anomalies unresolved  
  - Alternative frames not yet adequately compared
  - Key information gaps identified

TRANSITION to Decision-Making IF:
  - Frame confidence >= threshold
  - Critical questions answered sufficiently
  - Stakeholders agree on situation assessment
  - Time pressure demands action

RETURN to Sensemaking IF:
  - New data contradicts current frame
  - Decision analysis reveals understanding gaps  
  - Actions produce unexpected results
```

### Pattern 2: Sensemaking-Specialist Agents

In a 180+ skill system, some agents should be pure sensemaking specialists:

**Situation Assessment Agent:**
- Takes raw data from monitoring agents
- Constructs and compares frames  
- Identifies anomalies and information needs
- Produces formal situation assessment artifacts
- Does NOT recommend actions

**Downstream Planning Agents:**
- Take situation assessments as input
- Generate action options  
- Evaluate and optimize decisions
- Do NOT revise situation understanding (they request new assessment)

This separation at the agent level mirrors the cognitive separation in experts.

### Pattern 3: Sensemaking Artifacts as Explicit Handoffs

When Agent A completes sensemaking and passes to Agent B for decision-making, the handoff should include:

```
SENSEMAKING ASSESSMENT ARTIFACT:
  1. Primary Frame:
     - Description of situation type
     - Key entities and relationships
     - Causal model of what's driving events
  
  2. Confidence Metadata:
     - Overall confidence in frame (0-100%)
     - Which elements are certain vs. uncertain
     - What would increase confidence
  
  3. Alternative Frames Considered:
     - Other interpretations explored
     - Why they were rejected/deprioritized
     - What evidence would favor them
  
  4. Unresolved Issues:
     - Anomalies not yet explained  
     - Gaps in understanding
     - Conflicting data points
  
  5. Information Position:
     - What's known vs. unknown
     - Where additional data could be obtained
     - Queries that would be informative
```

This artifact serves as the "understanding foundation" that decision-making builds on—and it's separable, reviewable, and challengeable independently of any action recommendations.

### Anti-Pattern: Mixed Sensemaking-Decision Agents

**Problematic Design:**
Agent receives problem → immediately starts proposing solutions while simultaneously building understanding → outputs a mix of interpretations and recommendations

**Why This Fails:**
- Cannot achieve stable frame before committing to actions
- Recommendations contaminate situation assessment  
- Hard to audit: "Why did you recommend X?" "Because of situation Y." "Why is situation Y?" "Because X makes sense."
- Difficult to parallelize or distribute (everything is entangled)

**Rescue Strategy:**
If an agent must do both, enforce explicit phase separation internally:
```python
def handle_task(data):
    # Phase 1: Sensemaking (no action proposals allowed)
    situation = build_understanding(data)
    validate_frame_adequacy(situation)
    
    # Explicit checkpoint
    if not situation.confidence_adequate():
        return NeedMoreInfo(situation.gaps)
    
    # Phase 2: Decision-making (given fixed situation assessment)
    options = generate_options(situation)
    recommendation = evaluate_options(options, situation)
    
    return (situation, recommendation)  # Clearly separated outputs
```

## Training Implications: Teaching the Discipline of Separation

Since novices naturally intermix sensemaking and decision-making, this is a trainable skill:

**Exercise 1: Forced Separation Scenarios**
- Present complex, ambiguous scenario
- Trainee must produce written situation assessment *without any action recommendations*
- Only after assessment is complete, separately produce action recommendations
- Compare to expert assessments and discuss differences

**Exercise 2: Mode Violation Detection**
- Show transcripts of people working through scenarios
- Identify moments where sensemaking and decision-making are inappropriately mixed
- Explain why the mixing is problematic
- Rewrite the transcript with proper separation

**Exercise 3: Decision Audit**
- Trainee proposes actions for a scenario
- Instructor asks: "What's your situation assessment that supports this action?"
- If trainee cannot articulate clear, separate understanding, their action proposal is rejected
- Forces discipline of "understand first, decide second"

**Exercise 4: Checkpoint Practice**
- During scenario work, enforce explicit checkpoints:
  - "Stop—before proposing any actions, document your current understanding"
  - "Are you confident enough in this understanding to base decisions on it?"
  - "What would you need to know to be more confident?"
- Build the habit of metacognitive monitoring at phase transitions

## Special Case: Time Pressure and Degraded Separation

The research team notes that strong separation is characteristic of *deliberate* sensemaking—"conscious, effortful attempts to understand ambiguous situations" (p. 6). Under extreme time pressure, even experts may need to act before understanding is complete.

In such cases, experts exhibit "degraded gracefully" patterns:

**Instead of abandoning separation entirely:**
- Make explicit the understanding limitations: "We don't know X, but we must act now"
- Mark actions as provisional: "This assumes interpretation A; if we learn A is wrong, we'll need to pivot"
- Build monitoring into action plans: "Do Y, and watch for signal Z which would indicate our understanding was wrong"
- Maintain readiness to return to sensemaking: "As soon as we get data on X, stop and reassess"

**For agent systems under time constraints:**
- Don't eliminate sensemaking phase, *compress* it
- Make uncertainty explicit in outputs: "Acting on incomplete understanding, confidence 45%"
- Flag decisions as provisional: "This recommendation assumes Frame A; invalidate if Frame A disconfirmed"
- Include monitoring/sensing actions: "After taking action Y, observe Z to verify our understanding"

## Measuring Separation Quality

For an agent system, we can instrument separation quality:

**Temporal Metrics:**
- Time spent in pure sensemaking before first action proposal
- Number of mode switches between sensemaking and decision-making
- Ratio of sensemaking time to decision-making time
- Time between anomaly detection and return to sensemaking mode

**Content Metrics:**
- Proportion of utterances/actions that are sensemaking vs. decision-making
- Contamination rate: how often decision considerations appear in sensemaking
- Clarity of mode transitions: are phases explicitly marked?

**Quality Metrics:**
- Decision success rate given understanding quality
- Correlation between frame confidence and decision quality  
- Rate of needing to return to sensemaking after starting decision-making
- Stakeholder agreement on situation assessments (high agreement suggests adequate sensemaking)

## Philosophical Underpinning: Different Epistemic Stances

The sensemaking-decision separation reflects fundamentally different epistemic stances—different relationships to truth and action:

**Sensemaking Stance:** "What is true about this situation?"
- Goal: Accurate representation of reality  
- Success criterion: Understanding matches actual state of affairs
- Virtues: Open-mindedness, skepticism, consideration of alternatives
- Failure mode: Paralysis, over-analysis, refusal to commit

**Decision-Making Stance:** "What should I do about this?"
- Goal: Effective action given understanding
- Success criterion: Actions produce desired outcomes  
- Virtues: Decisiveness, commitment, optimization
- Failure mode: Premature closure, action bias, insufficient reflection

These stances pull in different directions. Maintaining them simultaneously creates cognitive dissonance. Experts navigate this by *sequencing* them: first commit to the sensemaking stance fully, then shift to the decision-making stance with that understanding as foundation.

For AI agents, we can implement this as architectural separation: different agent types or different processing phases with different objective functions. Don't ask the same agent to simultaneously maximize "understanding accuracy" and "action effectiveness"—these objectives can conflict.

## Connection to Other Sensemaking Functions

The sensemaking-decision separation interacts with the six sensemaking functions:

**During Pure Sensemaking:**
- Free to engage in extensive Frame Questioning without pressure to preserve a actionable frame
- Can fully Compare alternative frames without needing to pick one for immediate action
- Can Seek entirely new frames if current ones prove inadequate
- Can acknowledge "I don't understand this yet" without triggering action pressure

**During Decision-Making:**
- Frame is temporarily fixed (treated as given) to enable coherent planning
- If major anomaly detected during decision-making, explicitly return to sensemaking
- Actions can include "take action to improve understanding" (reconnaissance, information gathering)

The separation doesn't mean sensemaking stops forever once decision-making starts—it means the phases are explicitly managed rather than chaotically intermixed.

## The Bottom Line for Agent Systems

Expert performance in complex, ambiguous domains requires:
1. Adequate understanding before decisive action
2. Explicit separation between developing understanding and choosing actions
3. Metacognitive monitoring of understanding quality
4. Willingness to return to sensemaking when understanding proves inadequate

For AI agent orchestration systems, implement this through:
- Distinct sensemaking vs. decision-making agent roles
- Explicit phase transitions with quality gates  
- Sensemaking artifacts that are separate from action recommendations
- Monitoring that detects when understanding is inadequate for current decisions
- Training scenarios that enforce separation discipline

The goal is not merely mimicking expert behavior, but capturing the functional advantages that separation provides: stable frames for analysis, checkpoints on understanding adequacy, cleaner communication, and better decision quality.