# Expertise as Pattern Recognition, Not Procedure: Implications for Agent Design

## The Fundamental Insight

Traditional task analysis treats expertise as refined procedure—experts do the same things as novices but faster, more accurately, with fewer errors. ACTA research reveals this is wrong for complex cognitive tasks. Experts don't execute better procedures; they *see different problems*.

A fireground commander arrives at a scene and immediately knows "This is a commercial building with lightweight construction, fire has been burning 20+ minutes, high collapse risk." A novice sees a building with smoke. Same observable situation, radically different perception of what's happening.

This has profound implications for AI systems. If you model expertise as improved execution of known procedures, you build better automation. If you model expertise as different problem recognition, you build different intelligence.

## What Pattern Recognition Expertise Looks Like

**Perceiving Typicality** - Experts rapidly classify situations into categories that evoke appropriate responses. This isn't conscious deliberate categorization—it's perceptual. An electronic warfare supervisor hears a radar signal and immediately knows "That's an SA-6, probably land-based given the bearing and signal characteristics, non-threat currently but would be if we close to within 40 miles."

The expert isn't running through a decision tree. The signal pattern triggers recognition, which activates associated knowledge: threat capability, typical employment, range constraints, tactical implications.

**Seeing Distinctions** - Within a category, experts notice fine distinctions that matter functionally. Two building fires may both be "commercial structure fires," but the expert notices: "This one has a bowstring truss roof, that one has traditional framing." Bowstring truss collapse is rapid and catastrophic when heated; traditional framing provides more warning time. Identical surface appearance, critical functional distinction.

**Noticing Anomalies** - Experts detect when something expected is absent or something unexpected is present. An electronic warfare supervisor notices a radar is NOT detected in an area where intelligence reports indicated presence—potentially valuable information about enemy behavior. A novice would notice what's present but not what's missing.

**Mental Simulation** - Experts "see" how the current situation arose (story building about the past) and how it will evolve (mental simulation of futures). The fireground commander reconstructs: "Fire started in the storage area about 30 minutes ago based on the char patterns, spread through the common attic space, now in the office areas." And projects: "In about 10 minutes the roof will become unstable, need to evacuate crews before that."

This isn't procedure. It's pattern-based inference about temporal dynamics.

## Why This Matters for Agent Systems

### Current Approach: Procedure Optimization

Most AI systems model tasks as procedures to be executed:

```
if (condition_1):
    action_A()
elif (condition_2):
    action_B()
else:
    action_C()
```

Even sophisticated machine learning often learns "given features X, Y, Z, the optimal action is A" as a complex function approximation.

This works when:
- The feature representation is given
- The action space is known
- The problem type is stable

This fails when experts are doing something fundamentally different: recognizing what kind of problem this is, which determines what features matter and what actions are even relevant.

### Pattern Recognition Approach: Situation Classification

Expert cognition looks more like:

```
recognized_pattern = perceive_situation_type(observations)
relevant_cues = pattern.salient_features()
expected_evolution = pattern.typical_trajectory()
anomalies = detect_deviations(observations, pattern.expectations())
action_options = pattern.appropriate_responses()
selected_action = evaluate_options_in_context(action_options, anomalies, expected_evolution)
```

The work is in perceiving what kind of situation this is, which then constrains everything else.

### Implications for Agent Architecture

**Multi-Stage Reasoning Pipelines**:

1. **Situation Assessment Agent**: Classifies the problem type based on pattern recognition
   - Trained on expert categorizations: "This is a Type-X problem because..."
   - Outputs situation type + confidence + key features that led to classification

2. **Knowledge Retrieval Agent**: Given situation type, retrieves relevant knowledge
   - What typically happens in Type-X problems?
   - What cues indicate subtypes or variations?
   - What are common errors in Type-X?

3. **Action Planning Agent**: Given situation type and knowledge, generates options
   - What strategies apply to Type-X?
   - How do the specific anomalies present modify typical approach?

4. **Evaluation Agent**: Mentally simulates candidate actions
   - If we do A, what's the expected evolution?
   - What could go wrong?
   - How does this compare to doing B instead?

This pipeline mirrors expert cognition revealed through ACTA interviews: recognize the situation, apply situation-appropriate knowledge, generate and evaluate options within that context.

### Training Pattern Recognition vs. Training Procedures

**Traditional approach**: 
- Training data: (state, action) pairs
- Loss: How different is agent action from expert action?
- Result: Agent learns to mimic expert actions

**Pattern recognition approach**:
- Training data: (situation description, expert classification, key features, expected evolution, potential pitfalls)
- Loss: How different is agent situation understanding from expert understanding?
- Result: Agent learns to see situations like experts

The insight: You can execute the "right action" in response to a situation you've misunderstood and still fail. Getting the situation recognition right is primary.

## The Recognition-Primed Decision Model

Klein's research (cited throughout ACTA materials) shows experts frequently use single-option decision making: they recognize the situation, which activates an appropriate response, they mentally simulate whether that response will work, and if yes, they execute it. If the mental simulation reveals problems, they modify the action or retrieve another pattern.

This is NOT:
- Generate all possible actions
- Evaluate each one systematically
- Select optimal

This IS:
- Recognize situation type
- Retrieve typical response
- Check if it'll work here
- Modify if needed

For agent systems, this suggests:

**Case-Based Reasoning Architecture**:
- Library of situation patterns (cases)
- Similarity matching to recognize current situation
- Retrieval of prototypical response from matched case
- Adaptation of response to current specifics
- Simulation/verification before execution

**When to Use Multiple-Option Evaluation**:
- When pattern recognition fails (no good match)
- When prototypical response simulation reveals serious problems
- When stakes are high enough to warrant systematic evaluation

Default mode: pattern-recognition + single-option evaluation  
Fallback mode: systematic multi-option comparison  
This matches expert behavior.

## Perceptual Chunks and Abstraction Layers

Experts perceive "meaningful chunks" rather than individual features. A novice firefighter sees: "smoke color, smoke volume, smoke movement, building age, building type, weather conditions..." as separate features to track.

An expert sees: "This building presentation" as a single perceptual unit that immediately suggests collapse risk, victim location likelihood, and appropriate tactics.

For agent systems:

**Raw Feature Layer**:
```
{smoke_color: "dark_gray", 
 smoke_volume: "moderate",
 building_age: "1970s",
 construction_type: "commercial",
 roof_type: "flat",
 fire_duration: "25min"}
```

**Expert Perceptual Layer**:
```
{situation_type: "commercial_prolonged_concealed",
 key_pattern: "long_burn_modern_construction",
 primary_concern: "collapse_risk_elevated",
 implied_constraints: ["evacuate_before_structural_failure", "defensive_tactics_likely"]}
```

The expert layer is not just aggregation of features—it's recognition of meaningful configuration that carries semantic freight (what this means, what it implies, what to be concerned about, what strategies apply).

Training agents to build this perceptual layer is different from training feature extractors. It requires:
- Expert-labeled exemplars of situation types
- Explanations of what makes Type-X different from Type-Y
- Consequences of misclassification (what goes wrong if you think it's X but it's Y)
- Boundary cases where classification is ambiguous

## Anomaly Detection as Signal

Standard ML: anomaly detection identifies outliers to be filtered or flagged as errors.

Expert cognition: anomalies are information. Something expected that didn't happen tells you something. Something unexpected that did happen tells you something.

The electronic warfare supervisor who notices a radar isn't detected where intel suggested it would be—this absence is valuable intelligence about enemy behavior or intel accuracy.

The fireground commander who hears silence when there should be ventilation fan noise—this tells them something has changed (equipment failure, communication breakdown, crew encountered problem).

For agent systems, this requires:

**Expectation Generation**:
- Based on recognized situation type, generate expectations about what should happen
- "If this is Type-X situation, we expect to see cues A, B, C"

**Deviation Monitoring**:
- Track what's actually observed against expectations
- Deviations are not noise—they're signals about situation understanding

**Belief Updating**:
- When expectations violated, update situation classification
- "I thought this was Type-X, but cue A is absent, so maybe it's actually Type-Y"
- Or: "This is Type-X but with complication Z, which means strategy needs modification"

## Boundary Conditions

**When Pattern Recognition Models Work**:

1. **Domain stability** - Patterns learned from past experience apply to future situations
2. **Rich training data** - Enough exemplars to learn meaningful situation categories
3. **Expert consensus** - Experts agree on situation classifications (even if they choose different actions)

**When They Break Down**:

1. **Novel situations** - When the current situation doesn't match any learned pattern, pattern recognition provides no leverage. System needs fallback to first-principles reasoning.

2. **Adversarial environments** - When the environment is actively trying to make its patterns unrecognizable (deceptive enemy tactics, adversarial examples in ML). Requires meta-level reasoning about pattern reliability.

3. **Rapidly changing domains** - When patterns from 6 months ago no longer apply (technology shift, regulatory change). Requires continuous learning and pattern library updating.

4. **Individual variation** - When different experts categorize situations differently based on training, background, or philosophy. No single "correct" pattern library exists.

## For Multi-Agent Orchestration

In systems where multiple specialized agents collaborate:

**Pattern Recognition as Coordination Mechanism**:

- **Situation Assessment Agent** classifies problem type and broadcasts classification
- Other agents subscribe to situation types they handle
- "This is a Type-X problem" routes work to agents specialized in Type-X
- Avoids brittle explicit routing rules—routing emerges from situation recognition

**Shared Situation Awareness**:

- Multiple agents must maintain compatible situation understanding
- If Agent A thinks "this is Type-X" and Agent B thinks "this is Type-Y," coordination fails
- Requires:
  - Shared situation classification vocabulary
  - Communication of key features that led to classification
  - Negotiation when agents disagree about situation type

**Hierarchical Pattern Recognition**:

- High-level agent recognizes coarse situation type: "This is a software debugging problem"
- Routes to debugging-specialized agents
- Those agents do finer pattern recognition: "This is a memory corruption issue"
- Routes to memory-specialized sub-agents
- Continues recursively until reaching agents that know relevant procedures

This mirrors how expert teams work: initial triage determines which specialists are needed, specialists do finer-grained assessment, work gets routed to appropriate skills.

The ACTA framework reveals expertise as pattern recognition. Agent systems that treat expertise as refined procedure will fail to capture how experts actually think. Systems that can recognize situations, retrieve pattern-based knowledge, and reason within recognized contexts will more closely approximate expert cognition.