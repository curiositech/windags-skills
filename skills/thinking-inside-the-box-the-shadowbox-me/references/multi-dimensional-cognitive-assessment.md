# Multi-Dimensional Cognitive Assessment: Why Different Box Types Reveal Different Aspects of Expertise

## Beyond Single-Dimensional Evaluation

Most training and assessment methods focus on a single dimension: Did you make the right decision? Did you get the right answer? Did you choose the correct action?

The ShadowBox method takes a radically different approach: it assesses multiple dimensions of expert cognition separately. Klein et al. describe several box types:

- **Attention box**: "Enter any information they want to remember"
- **Action Priority box**: "Prioritize these in order of importance and enter the top three"
- **Information box**: "Enter one query...one type of information they would like to have"
- **Anticipation box**: "What is likely to happen in the next 15 minutes"
- **Assessment box**: "Different possible explanations of what is happening"
- **Monitoring box**: "Which cues should be watched most carefully"

Each box type probes a different cognitive skill. Expertise isn't unitary—it's multidimensional. Someone might be excellent at recognizing what to pay attention to but weak at anticipating how situations will develop. Someone else might be good at generating hypotheses but poor at prioritizing actions.

By separating these dimensions, the ShadowBox method enables:
1. **Targeted diagnosis**: Which cognitive skills need development?
2. **Dimensional learning**: Improve specific aspects of expert thinking
3. **Cognitive skill profiles**: Understand expertise as a multi-dimensional pattern, not a single score

This multidimensional approach is fundamental to how the method develops expertise.

## The Cognitive Dimensions of Expert Decision-Making

Why these specific dimensions? They map to core cognitive processes in expert decision-making as identified through decades of naturalistic decision-making research:

**Situation Assessment (Attention Box)**
What features of the situation do you notice and encode as important? Experts notice different things than novices—not just more things, but *different* things. The attention box reveals what someone considers salient.

**Action Prioritization (Action Priority Box)**  
Given multiple possible actions, which do you do first, second, third? Experts prioritize differently than novices, often based on subtle cues about criticality, urgency, irreversibility, or leverage. The action priority box reveals prioritization logic.

**Information Seeking (Information Box)**
What don't you know that you need to know? Experts are metacognitively aware of their knowledge gaps and know what questions would most reduce uncertainty. The information box reveals metacognitive sophistication.

**Mental Simulation (Anticipation Box)**
What do you expect to happen? Experts run mental simulations forward in time, using pattern recognition to anticipate how situations will develop. The anticipation box reveals whether someone thinks dynamically or statically.

**Hypothesis Generation (Assessment Box)**
What might explain what you're seeing? Experts generate diagnostic hypotheses efficiently, considering multiple explanations while avoiding fixation. The assessment box reveals hypothesis generation and evaluation processes.

**Attention Management Over Time (Monitoring Box)**
What should you keep watching as the situation evolves? Experts know which cues indicate things going well vs. badly and allocate attention accordingly. The monitoring box reveals dynamic attention management.

These aren't arbitrary—they're the constituent skills of expert decision-making in complex, dynamic environments.

## Why Multidimensional Assessment Matters for Agent Training

For AI agents, collapsing assessment to single-dimensional metrics (accuracy, reward, success rate) obscures where the agent is failing and why.

Consider a debugging agent that succeeds 60% of the time. That number tells us very little:
- Does it attend to the right information but generate poor hypotheses?
- Does it generate good hypotheses but prioritize testing them poorly?
- Does it monitor the right indicators but fail to anticipate side effects?

Multidimensional assessment would reveal:
- **Attention dimension**: Does agent encode relevant error details? (Compare to expert attention patterns)
- **Hypothesis dimension**: Does agent generate plausible root causes? (Compare to expert hypothesis sets)
- **Priority dimension**: Does agent test hypotheses in effective order? (Compare to expert testing priorities)
- **Anticipation dimension**: Does agent anticipate fix side effects? (Compare to expert anticipation patterns)
- **Monitoring dimension**: Does agent track the right indicators after applying fix? (Compare to expert monitoring strategies)

This diagnostic precision enables targeted improvement. If the agent is strong on attention and hypothesis generation but weak on prioritization, training can focus specifically on prioritization logic.

## Implementing Multi-Dimensional Calibration for WinDAGs Agents

For a multi-agent orchestration system, each dimension can be calibrated independently:

### Orchestration Agent Dimensions

**Decomposition Dimension**: How do you break this complex task into subgoals?
```
Agent response: [Task decomposition structure]
Expert calibration: [Expert panel decompositions]
Divergence: "Expert panel identified subgoal X which you missed; experts' rationale: this subgoal is critical because..."
```

**Skill Assignment Dimension**: Which skills should handle which subgoals?
```
Agent response: [Skill assignments]
Expert calibration: [Expert panel assignments]
Divergence: "Experts assigned Skill A to this subgoal, you assigned Skill B; experts' rationale: Skill A is better suited because..."
```

**Dependency Dimension**: Which subgoals must complete before others can start?
```
Agent response: [Dependency graph]
Expert calibration: [Expert panel dependencies]
Divergence: "Experts identified dependency between X and Y that you missed; rationale: Y requires output from X to proceed..."
```

**Risk Dimension**: What could go wrong with this plan?
```
Agent response: [Top 3 risks]
Expert calibration: [Expert panel risk assessments]
Divergence: "Experts flagged risk R that you didn't mention; rationale: this risk is critical because..."
```

Each dimension is calibrated separately, building a profile of the orchestration agent's strengths and weaknesses across cognitive dimensions.

### Execution Agent Dimensions (for specific skills)

**For a Code Review Agent:**

**Attention Dimension**: What areas of code do you flag for careful review?
```
Agent: [Identified areas]
Expert: [Expert panel identified areas]
Calibration: Coverage overlap, false positives, false negatives
```

**Risk Assessment Dimension**: What's the most serious issue in this PR?
```
Agent: [Highest priority issue]
Expert: [Expert panel highest priorities]
Calibration: Agreement on severity ranking
```

**Evidence Dimension**: What evidence supports your finding?
```
Agent: [Cited evidence]
Expert: [Expert evidence patterns]
Calibration: Quality of evidence citation, grounding in code specifics
```

**For a System Design Agent:**

**Constraint Dimension**: What constraints most shape this design?
```
Agent: [Top 3 constraints]
Expert: [Expert panel constraints]
Calibration: Match on constraint identification
```

**Trade-off Dimension**: What's the critical design trade-off?
```
Agent: [Identified trade-off]
Expert: [Expert panel trade-offs]
Calibration: Match on trade-off recognition
```

**Failure Mode Dimension**: What could cause this design to fail?
```
Agent: [Failure scenarios]
Expert: [Expert panel failure scenarios]
Calibration: Coverage of critical failure modes
```

## Temporal Dynamics: Different Dimensions at Different Stages

The ShadowBox method distributes different box types across different decision points in a scenario. Not every dimension is assessed at every moment—the dimensions invoked match what's cognitively relevant at that stage.

For example, in a firefighting scenario:
- **Decision Point 1 (arrival)**: Attention box (what do you notice?), Assessment box (what's happening?)
- **Decision Point 2 (strategy selection)**: Action Priority box (what do you do first?), Anticipation box (what will happen if you do that?)
- **Decision Point 3 (during execution)**: Monitoring box (what are you watching?), Information box (what else do you need to know?)

This temporal distribution recognizes that expert cognition has a time signature: different cognitive skills are engaged at different phases of a problem.

For agent systems, this suggests **stage-specific dimensional assessment**:

**Problem Understanding Phase**: Assess attention dimension, constraint identification, context parsing
**Solution Design Phase**: Assess decomposition dimension, skill selection, dependency management  
**Execution Phase**: Assess monitoring dimension, error detection, adaptation
**Review Phase**: Assess outcome assessment, learning extraction, knowledge updating

Different agents engaged at different workflow stages are calibrated on dimensions relevant to their phase.

## Creating Dimensional Profiles: Expertise as Pattern, Not Score

By assessing multiple dimensions separately, we can create cognitive skill profiles:

**Expert Pattern**: Strong across all dimensions
- Attention: High expert alignment
- Prioritization: High expert alignment
- Anticipation: High expert alignment
- Hypothesis generation: High expert alignment
- Monitoring: High expert alignment

**Specialist Pattern**: Strong in some dimensions, weaker in others
- Attention: High alignment (notices the right things)
- Hypothesis generation: High alignment (generates good explanations)
- Prioritization: Medium alignment (could improve action sequencing)
- Anticipation: Low alignment (doesn't forecast well)

**Novice Pattern**: Weak across most dimensions, strengths not yet differentiated

These profiles enable:
1. **Diagnostic clarity**: Exactly which cognitive skills need development
2. **Targeted training**: Focus learning on weak dimensions
3. **Role matching**: Assign agents to tasks matching their dimensional strengths
4. **Complementary teaming**: Pair agents with complementary dimensional profiles

For WinDAGs, this means:
- Track dimensional profiles for each agent instance
- Route tasks to agents with matching dimensional requirements
- Form agent teams with complementary dimensional strengths
- Provide dimensional-specific training scenarios

## Cross-Dimensional Dependencies and Skill Cascades

While dimensions are assessed separately, they're not independent. Performance in one dimension can affect performance in others:

**Attention → Everything Else**: If you don't notice the right information (attention dimension), you can't prioritize well, anticipate accurately, or generate relevant hypotheses. Poor attention cascades into poor performance across other dimensions.

**Hypothesis → Prioritization**: If you generate poor hypotheses about what's happening (assessment dimension), you'll prioritize actions poorly (action dimension). Hypothesis quality constrains action quality.

**Anticipation → Monitoring**: If you don't anticipate what might go wrong (anticipation dimension), you won't know what to monitor (monitoring dimension). Poor anticipation leads to poor attention management.

This suggests a skill development sequence:
1. **Foundation**: Attention dimension (learn to notice what experts notice)
2. **Interpretation**: Assessment dimension (learn to generate expert-like hypotheses)
3. **Action**: Priority dimension (learn to sequence actions like experts)
4. **Forward-looking**: Anticipation dimension (learn to forecast like experts)
5. **Sustained**: Monitoring dimension (learn to track over time like experts)

For agent training:
- Start with attention-focused scenarios (what do you encode?)
- Progress to assessment scenarios (what might be happening?)
- Advance to action scenarios (what do you do?)
- Extend to anticipation scenarios (what will happen?)
- Culminate with monitoring scenarios (what do you track?)

Mastery of earlier dimensions enables learning of later dimensions.

## Dimension-Specific Constraints and Box Design

Each dimension benefits from specific constraint designs:

**Attention Box**: "Enter any information you want to remember"
- Constraint: Limited space (1 inch)
- Forces: Selective encoding, prioritization of information
- Reveals: What someone considers salient

**Action Priority Box**: List of 5-7 possible actions
- Constraint: Must rank order and select top 3
- Forces: Explicit prioritization with rationale
- Reveals: Priority logic and sequencing judgment

**Information Box**: "Enter one query"
- Constraint: Exactly one question
- Forces: Identification of single most valuable information to reduce uncertainty
- Reveals: Metacognitive awareness, information value judgment

**Anticipation Box**: "What will happen in next 15 minutes"
- Constraint: Specific time window, brief description
- Forces: Concrete forecasting, not vague possibilities
- Reveals: Mental simulation capability, dynamic thinking

**Assessment Box**: "Answer yes/no to possible explanations"
- Constraint: Binary judgments on provided hypotheses
- Forces: Hypothesis evaluation, not just generation
- Reveals: Diagnostic reasoning, explanation assessment

Each constraint is tuned to the cognitive dimension being assessed.

For agents, dimension-specific output formats:

```python
# Attention Dimension
attention_output = {
    "encoded_observations": [
        {"observation": "...", "rationale": "...", "priority": 1},
        {"observation": "...", "rationale": "...", "priority": 2},
        {"observation": "...", "rationale": "...", "priority": 3}
    ],
    "max_items": 3,
    "time_budget": "2.5 minutes"
}

# Priority Dimension  
priority_output = {
    "available_actions": ["A", "B", "C", "D", "E"],
    "prioritized_actions": [
        {"action": "A", "rank": 1, "rationale": "..."},
        {"action": "C", "rank": 2, "rationale": "..."},
        {"action": "B", "rank": 3, "rationale": "..."}
    ],
    "top_n": 3
}

# Anticipation Dimension
anticipation_output = {
    "time_horizon": "15 minutes",
    "forecasts": [
        {"event": "...", "likelihood": "high", "impact": "..."},
        {"event": "...", "likelihood": "medium", "impact": "..."}
    ],
    "max_forecasts": 3
}
```

## Boundary Conditions: When Dimensional Separation Breaks Down

**1. Highly Interdependent Dimensions**
In some domains, dimensions are so tightly coupled that separate assessment is artificial. Attention and assessment may be inseparable—what you notice *is* your assessment.

Implication: Recognize when dimensions genuinely collapse. Don't force artificial separation if expert cognition is more holistic in that domain.

**2. Dimensional Overload**
Assessing too many dimensions at too many decision points creates excessive cognitive load, both for training and for calibration analysis.

Implication: Select dimensions strategically—focus on 2-3 dimensions per decision point, not all 6. Rotate which dimensions are assessed across scenarios.

**3. Domain-Specific Dimensions**
The ShadowBox dimensions emerged from emergency response domains (firefighting, police, military). Other domains may have different cognitive dimension structures.

Implication: Conduct domain-specific cognitive task analysis to identify relevant dimensions for each problem type. Don't assume same dimensions apply across all domains.

**4. Measurement Validity**
Just because you can define a dimension doesn't mean you can measure it validly. Some cognitive processes may not be accessible through the "write in a box" method.

Implication: Validate dimensional measures—do they predict performance? Do they capture what they claim to capture? Be willing to revise dimensional structure based on evidence.

## Practical Implementation for WinDAGs: Dimensional Calibration Architecture

**1. Dimension Registry**
Define standard cognitive dimensions for orchestration and execution:
```yaml
orchestration_dimensions:
  - decomposition: "How agent breaks complex tasks into subgoals"
  - skill_assignment: "Which skills agent assigns to subgoals"
  - dependency_management: "How agent structures task dependencies"
  - risk_identification: "What risks agent recognizes in plan"

execution_dimensions:
  - attention: "What agent encodes as important"
  - hypothesis_generation: "What explanations agent considers"
  - action_prioritization: "How agent sequences actions"
  - anticipation: "What agent forecasts will happen"
  - monitoring: "What agent tracks over time"
```

**2. Dimension-Specific Calibration Data**
For each dimension, collect expert exemplars:
```python
{
    "dimension": "attention",
    "scenario_id": "debug_scenario_001",
    "decision_point": 1,
    "expert_panel": [
        {
            "expert_id": "expert_A",
            "encoded_observations": ["error at line 347", "recent config change", "memory spike in logs"],
            "rationale": "Line 347 is where error surfaced; config change is recent and temporal match; memory spike suggests resource issue..."
        },
        # more experts
    ],
    "consensus_level": "high",
    "dimension_difficulty": "medium"
}
```

**3. Multi-Dimensional Agent Profiles**
Track agent performance across dimensions:
```python
agent_profile = {
    "agent_id": "orchestrator_agent_1",
    "dimensional_performance": {
        "decomposition": {
            "expert_alignment": 0.75,
            "trend": "improving",
            "training_scenarios_completed": 12
        },
        "skill_assignment": {
            "expert_alignment": 0.85,
            "trend": "stable",
            "training_scenarios_completed": 15
        },
        "risk_identification": {
            "expert_alignment": 0.60,
            "trend": "improving_slowly",
            "training_scenarios_completed": 8,
            "needs_attention": true
        }
    }
}
```

**4. Dimensional Training Recommendations**
Based on profiles, recommend training:
```python
if agent_profile["risk_identification"]["expert_alignment"] < 0.70:
    recommend_training(
        dimension="risk_identification",
        scenario_difficulty="medium",
        scenario_count=5,
        focus="recognizing non-obvious failure modes"
    )
```

## Conclusion: Expertise as Multi-Dimensional Pattern

The ShadowBox method's multi-dimensional assessment reveals a fundamental truth: **expertise isn't a single capability but a coordinated pattern of cognitive skills across multiple dimensions**.

For agent systems:
- Assess attention, prioritization, anticipation, hypothesis generation, and monitoring as separate dimensions
- Create dimensional profiles showing strengths and weaknesses
- Provide dimension-specific calibration comparing agent to expert patterns
- Design dimension-specific constraints (output formats, token budgets) that make each cognitive skill visible
- Track dimensional improvement over time
- Route tasks to agents with matching dimensional requirements
- Form teams with complementary dimensional strengths

When agents develop across multiple cognitive dimensions rather than being optimized for a single metric, they build expertise patterns closer to how human experts actually think—as flexible, multi-faceted reasoners who deploy different cognitive skills appropriately for different situations.