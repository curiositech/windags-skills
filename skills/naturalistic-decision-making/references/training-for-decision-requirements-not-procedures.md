# Training for Decision Requirements, Not Procedures: Cognitive Preparation

## The Traditional Training Failure

Klein notes: "Unfortunately, the training methods and decision support systems developed in accord with the formal standards did not improve decision quality and did not get adopted in field settings."

Why? Traditional training focused on procedures: "When X happens, do Y." But real-world decision-making requires adaptive judgment: recognizing situation types, forming expectancies, evaluating through mental simulation, adapting when expectancies violate.

Klein's work with the TADMUS (Tactical Decision Making Under Stress) program revealed effective training approaches: "These include methods for providing stress inoculation along with approaches for individual and team decision training" (Cannon-Bowers & Salas, 1998).

## Decision Requirements vs. Procedures

**Procedural Training**:
- Here are the steps to follow
- Memorize the sequence
- Execute when situation matches trigger

**Decision Requirements Training**:
- Here are the types of situations you'll face
- Here are the cues that distinguish them
- Here's how to recognize when your assessment is wrong
- Here's how to adapt when plans fail

The difference: procedures tell you what to do; decision requirements prepare you to figure out what to do.

## Application to Agent Systems

Most AI agent systems are programmed with procedures: "When error type X occurs, run diagnostic Y, then apply fix Z." This is brittle—only works when situations exactly match training scenarios.

Klein's approach suggests training agents through:

### 1. Scenario-Based Experience Accumulation

Rather than encoding procedures, expose agents to diverse scenarios and let them build pattern libraries:

**Poor Approach**: "If connection timeout, increase pool size"

**Better Approach**: 
- Present 50 scenarios involving connection issues
- Let agent diagnose each (with feedback)
- Agent builds patterns:
  - "Connection timeout + pool at max + CPU normal → Pool too small"
  - "Connection timeout + pool at max + CPU high → Database overloaded"
  - "Connection timeout + pool below max + network latency → Network issue"

The agent learns to distinguish situation types rather than applying universal procedures.

### 2. Cue Recognition Training

Klein emphasizes that experts know what cues matter. Training should develop this:

**Exercise**: Present agents with complex scenarios and ask "what are the three most diagnostic pieces of information?"

- If agent focuses on irrelevant details → Provide feedback on what actually mattered
- If agent identifies key cues → Reinforce and explain why these cues are diagnostic

Over many scenarios, agent learns: in situation type X, cues A, B, C are diagnostic; in situation type Y, cues D, E, F matter.

### 3. Expectancy Training

Klein's RPD model depends on forming accurate expectancies: "If this is situation type X and I take action Y, outcome Z should happen."

**Training Approach**: After agent proposes action, ask "What do you expect to happen?"

- Force agent to articulate predictions
- Execute action
- Compare actual outcome to prediction
- If mismatch → Explore why expectations were wrong

This builds calibrated mental simulation: agent learns what outcomes actually follow from actions in different contexts.

### 4. Stress Inoculation

Klein mentions stress inoculation from TADMUS. For agents, this means training under resource constraints:

- Time pressure (must decide in X seconds)
- Information scarcity (some diagnostic information unavailable)
- High stakes (simulated consequences of failure)
- Ambiguity (situation cues partially match multiple patterns)

Agents that train only in ideal conditions (complete information, ample time, clear situation categories) will fail in real deployments.

## Cognitive Task Analysis for Agent Training

Klein's work on cognitive task analysis (Crandall, Klein, & Hoffman, 2006) provides methods for extracting expert decision-making knowledge. Applied to agent training:

**Interview Expert Agents/Humans**:
- What situations do you encounter frequently?
- What cues indicate each situation type?
- What actions work for each type?
- What expectancies help you monitor progress?
- What makes situations difficult to assess?

From these interviews, build:
- Situation taxonomy (comprehensive categorization)
- Cue lists (what indicates each category)
- Pattern templates (situation → action mappings)
- Difficulty factors (what makes assessment hard)

Use this knowledge to design training scenarios targeting difficult distinctions and common assessment errors.

## Training vs. Programming

Traditional view: Agent capabilities are programmed (code) or trained (machine learning parameters). Klein suggests a middle ground:

**Pattern Library as Trainable Knowledge**:
- Not hardcoded (too brittle)
- Not purely learned from raw data (too opaque)
- Structured knowledge representation shaped by experience

Training is experience accumulation that builds and refines pattern libraries. This is different from both procedural programming and statistical learning.

## Transfer Learning Through Pattern Abstraction

Klein notes experts develop patterns through repeated exposure. But agents can accelerate this through deliberate abstraction:

After solving problem P with solution S in context C:
1. What about this situation made solution S appropriate?
2. What are the essential features vs. incidental details?
3. In what other contexts would S likely work?
4. What modifications would S need for related contexts?

This deliberate reflection builds transferable patterns rather than narrow case memories.

## Team Training for Multi-Agent Systems

Klein references team decision training. For multi-agent systems:

**Cross-Training**: Agent A trained on Agent B's typical patterns
- Enables prediction of other agents' actions
- Facilitates proactive coordination
- Builds shared mental models

**Coordination Scenario Training**: Multiple agents face problems requiring coordination
- Not just individual decision quality but team coherence
- Practice handoffs, conflict resolution, mutual monitoring
- Build compatible situation assessments

**Perturbation Training**: Introduce unexpected changes during team exercises
- One agent fails mid-task
- Situation changes rapidly
- Information contradicts expectations
- Forces adaptive coordination

## Assessment-Based Training Design

Rather than covering all possible procedures, focus training on decision requirements:

**Core Decision Requirements** (from Klein's work):
1. **Situation Assessment**: Recognize situation types from cues
2. **Expectancy Formation**: Predict outcomes of actions
3. **Option Evaluation**: Mental simulation of proposed actions
4. **Adaptation**: Modify plans when expectancies violate
5. **Uncertainty Management**: Act effectively despite incomplete information

Training scenarios should target these requirements:

- **Assessment Training**: Ambiguous situations requiring cue-based discrimination
- **Expectancy Training**: Actions with non-obvious outcomes requiring prediction
- **Simulation Training**: Complex contexts where mental simulation reveals flaws
- **Adaptation Training**: Plans that require mid-execution modification
- **Uncertainty Training**: Decisions with incomplete information

## Feedback Mechanisms

Klein's research showed experts learn from expectancy violations. Agent training should emphasize:

**Immediate Outcome Feedback**: After agent acts, show actual vs. expected outcomes
- Correct expectancy → Reinforce pattern
- Violated expectancy → Trigger reassessment and pattern refinement

**Delayed Consequence Feedback**: Show longer-term impacts of decisions
- Agent chose quick fix that caused later problems → Learn to simulate longer horizons
- Agent chose robust solution that prevented future issues → Reinforce thorough analysis

**Comparative Feedback**: Show what would have happened with alternative actions
- Agent chose action A; outcome was B
- If agent had chosen action C, outcome would have been D
- Helps calibrate action selection

## Measuring Training Effectiveness

Klein's validation approach: Do trained decision-makers show characteristic expert patterns?

**For Agents, Measure**:
1. **Pattern Match Quality**: Do agent's situation assessments align with expert assessments?
2. **Expectancy Accuracy**: Do agent's predictions match actual outcomes?
3. **Decision Speed**: Can agent make rapid decisions on familiar situations?
4. **Adaptation Success**: When expectancies violate, does agent successfully reassess?
5. **Transfer**: Do learned patterns apply to novel but related situations?

If agents show these characteristics, training is working. If not, training approach needs revision.

## What Makes This Distinctive

Klein's insight: **Decision-making expertise is about building rich mental models of situation types, not memorizing procedures**. Training should develop this situation awareness and adaptive judgment, not rote execution.

For agent systems, this means: don't just program agents with procedures; expose them to rich scenarios that build pattern libraries. Effective "training" for agents is experience accumulation plus reflective abstraction, not procedure encoding or parameter optimization alone.

This challenges both traditional software engineering (write comprehensive procedures) and modern machine learning (optimize loss functions on datasets). Klein suggests a middle path: structured knowledge representations (patterns) refined through situated experience.