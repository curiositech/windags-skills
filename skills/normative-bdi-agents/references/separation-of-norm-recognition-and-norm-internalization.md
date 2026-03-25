# Separation of Norm Recognition and Norm Internalization

## The Fundamental Distinction

The normative BDI architecture introduces a critical separation: **recognizing that a norm exists** versus **adopting that norm into your behavior**.

This seemingly simple distinction has profound implications for agent design:

**Norm Recognition** (stored in Abstract Norm Base - ANB):
- The agent detects that a norm is "in force" in its environment
- The norm is treated as factual knowledge about the world
- No commitment to follow the norm yet
- Equivalent to knowing "it is illegal to speed" without deciding whether you'll obey

**Norm Internalization** (stored in Norm Instance Base - NIB, impacts Desire-set):
- The agent adopts the norm into its decision-making
- The norm becomes part of the agent's motivational structure
- Active commitment to satisfy/respect the norm
- Equivalent to deciding "I will not speed because it's illegal and dangerous"

The paper states: "At this point the agent is simply storing an abstract norm which it detected to be in-force in its environment; it has not yet adhered to it!" (p.5)

## Why This Separation Matters

**Deliberative Norm Adoption**:

Without separation, agents face a dilemma:
- Ignore environmental norms → appear antisocial, fail to coordinate
- Auto-adopt all norms → paralysis when norms conflict, loss of autonomy

With separation, agents can:
- Be *aware* of all environmental norms (recognition)
- *Selectively internalize* norms based on consistency checking and consequence analysis
- Maintain a record of norms they're choosing not to follow (and why)

**Transparency and Accountability**:

The ANB serves as a record of norms the agent knew about but chose not to follow. This is critical for:
- Post-hoc explanation: "Why did you violate norm X?" → "I recognized X (in ANB) but didn't internalize it because consequence analysis showed Y was worse"
- Auditing: External observers can examine ANB vs. NIB to see which environmental norms the agent is respecting vs. ignoring
- Debugging: Developers can identify when agents fail to recognize norms (missing from ANB) vs. recognizing but rejecting them (in ANB but not NIB)

**Temporal Flexibility**:

Norms may become active or expire based on conditions. The separation allows:
- ANB stores abstract norms with activation/expiration conditions
- NIB stores instantiated norms that are currently active
- Agent can internalize "if situation X, then obligation Y" without immediately activating Y
- When situation X becomes true, the norm instantiates from ANB to NIB

Example: "In case of fire, evacuate the building" stays in ANB until fire is detected, then instantiates in NIB.

## The Two-Stage Process

**Stage 1: Norm Recognition → ANB**

The agent observes its environment and detects normative signals:
- Direct communication from authority: "You are obligated to do X"
- Observation of sanctions: Seeing others punished for action Y suggests prohibition
- Social learning: Observing consistent patterns of behavior suggests norms
- Explicit norm broadcasts: In the paper's implementation, trusted authorities send norm messages

The agent creates an abstract norm representation:
```
⟨Modality, ActivationCondition, ExpirationCondition, Content, Sanction, Reward⟩
```

This is stored in ANB as factual knowledge about environmental expectations, not as a commitment.

**Stage 2: Norm Instantiation & Internalization → NIB**

When the activation condition becomes true (or immediately if no condition specified):

1. **Instantiation**: Ground all variables in the abstract norm using current belief-set
   - Abstract: ⟨O, hungry(x), fed(x), feed(robot, x)⟩
   - Instance: ⟨O, hungry(Travis), fed(Travis), feed(R781, Travis)⟩

2. **Consistency Check**: Evaluate whether the instantiated norm conflicts with:
   - Existing norms in NIB
   - Current intentions in I
   - Use three-tier consistency classification (strong inconsistent, weak consistent, strong consistent)

3. **Conflict Resolution** (if needed): If consistency check fails:
   - Generate maximal non-conflicting subsets
   - Evaluate consequences of each subset
   - Choose subset with least-bad worst consequence

4. **Internalization Decision**:
   - If adopted: Add to NIB, update desire-set D with norm content
   - If rejected: Keep in ANB only, optionally record rejection reason

## Architectural Implementation

The paper's implementation in Jade/Jadex maintains this separation through distinct data structures:

**ANB (XML-based storage)**:
```xml
<abstract-norms>
  <norm id="n1">
    <modality>obligation</modality>
    <activation>isHungry(Travis)</activation>
    <expiration>fed(Travis)</expiration>
    <content>feed(agent, Travis)</content>
  </norm>
</abstract-norms>
```

**NIB (Active norm instances)**:
```xml
<norm-instances>
  <active-norm id="n1_inst_001">
    <source>n1</source>
    <modality>obligation</modality>
    <content>feed(R781, Travis)</content>
    <timestamp-activated>T123</timestamp-activated>
  </active-norm>
</norm-instances>
```

**Desire-set (Jadex ADF)**:
```xml
<beliefs>
  <beliefset name="desires">
    <fact>isHealthy(Travis)</fact>
    <fact>feed(R781, Travis)</fact>  <!-- From internalized norm -->
  </beliefset>
</beliefs>
```

The separation is physical—different files, different schemas, different update cycles.

## Interaction with BDI Loop

The normative extension modifies the classic BDI loop to incorporate norm recognition and internalization:

```
1. Observe environment
   ↓
2. Update beliefs (brf function)
   ↓
3. Detect normative percepts → Add to ANB
   ↓
4. Check activation conditions for norms in ANB
   ↓
5. Instantiate activated norms (grounding)
   ↓
6. Consistency check (instantiated norm vs NIB + I)
   ↓
7. [If consistent] → Add to NIB, update desires
   [If inconsistent] → Conflict resolution, then decide adoption
   ↓
8. Generate intentions from desires (including internalized norms)
   ↓
9. Select plans
   ↓
10. Execute
```

The key is that norm recognition (step 3) happens *before* internalization (step 7), with deliberation in between.

## Application to Multi-Agent Orchestration

**Distributed Norm Environments**:

In a WinDAGs system with multiple coordinating agents:

**Scenario**: Different agents operate under different regulatory frameworks
- Agent A (medical domain): HIPAA norms about patient data
- Agent B (financial domain): PCI-DSS norms about payment data  
- Agent C (general purpose): Standard privacy norms

When agents collaborate on a task involving both patient and payment data:

1. **Recognition Phase**: Each agent recognizes norms from both domains
   - Agent A's ANB: [HIPAA norms] + [PCI-DSS norms] (recognized from Agent B's messages)
   - Agent B's ANB: [PCI-DSS norms] + [HIPAA norms] (recognized from Agent A's messages)

2. **Internalization Phase**: Each agent selectively internalizes
   - Agent A internalizes HIPAA (primary responsibility), evaluates PCI-DSS for consistency
   - Agent B internalizes PCI-DSS (primary responsibility), evaluates HIPAA for consistency
   - Both may internalize overlapping privacy norms (both domains require encryption)

3. **Coordination**: Agents communicate which norms they've internalized
   - Agent A: "I'm operating under HIPAA, cannot log unencrypted patient data"
   - Agent B: "I'm operating under PCI-DSS, cannot store CVV numbers"
   - Orchestrator: Routes subtasks respecting internalized norms of each agent

**Norm Propagation vs. Norm Suggestion**:

The separation enables different communication patterns:

**Broadcasting Recognition** (ANB-level): "I've detected that norm X is in-force in this environment"
- Lightweight, informational
- Recipients add to their ANB but decide independently whether to internalize
- Enables agents to build shared awareness without forced compliance

**Asserting Internalization** (NIB-level): "I am operating under norm Y, you must respect this in our interaction"
- Heavyweight, constraining
- Creates coordination requirements
- Recipients must check compatibility with their own internalized norms

**Skill-Specific Norms**:

Skills in WinDAGs can ship with "norm recommendations" (ANB-level):
```python
class DataProcessingSkill:
    recommended_norms = [
        AbstractNorm(
            modality="prohibition",
            content="log_PII(data) where contains_PII(data)",
            reason="Privacy best practice"
        )
    ]
    
    required_norms = [
        AbstractNorm(
            modality="obligation", 
            content="encrypt_at_rest(data)",
            reason="Compliance requirement"
        )
    ]
```

When an agent instantiates this skill:
- Recommended norms → Add to ANB, agent decides whether to internalize
- Required norms → Must be internalized or skill activation fails

This allows skills to be opinionated about norms without forcing adoption.

## Failure Modes and Edge Cases

**Recognition Failure (Norm never enters ANB)**:

Agent remains unaware of environmental norms:
- Causes: Communication failure, lack of observation, insufficient learning
- Consequences: Agent appears antisocial, may face unexpected sanctions
- Mitigation: Active norm querying ("What are the rules here?"), observational learning

**Internalization Failure (Norm in ANB but never enters NIB)**:

Agent knows norm exists but never adopts it:
- Deliberate: Consequence analysis shows rejection is better → Acceptable if rational
- Accidental: Consistency check logic error → Bug, agent thinks it has conflict when it doesn't
- Resource-limited: Agent lacks capabilities to satisfy norm → Need to communicate incapability

**Over-Internalization (Everything in ANB immediately moves to NIB)**:

Agent adopts all recognized norms without deliberation:
- Reduces to reactive norm-following
- Loses benefits of the separation
- Leads to paralysis when norms conflict
- Mitigation: Always perform consistency check, never skip conflict resolution

**ANB-NIB Desynchronization**:

Norm expires from ANB (no longer in-force) but remains in NIB (agent still following it):
- Causes: Update propagation delay, agent doesn't monitor expiration conditions
- Consequences: Agent follows obsolete norms, may miss opportunities
- Mitigation: Periodic NIB validation against ANB, garbage collection of expired norms

**Conflicting Recognitions**:

Multiple authorities broadcast different norms about the same situation:
- Authority X: ⟨O, action(A)⟩
- Authority Y: ⟨F, action(A)⟩
- Both enter ANB, but only one can be internalized
- Resolution: Agent needs authority trust model or conflict resolution at recognition stage

## Connection to Human Ethical Reasoning

The recognition/internalization separation mirrors human moral psychology:

**Social Awareness**: Humans recognize societal norms without necessarily internalizing them:
- "I know society expects X, but I don't personally endorse X"
- Enables navigation of different cultural contexts without internal conflict
- Allows principled dissent (recognizing a law but choosing to violate it based on deeper values)

**Moral Development**: Children first recognize norms externally (parental rules), gradually internalizing some while rejecting others as they develop autonomous moral reasoning.

**Professional Ethics**: Professionals recognize multiple ethical frameworks:
- Legal norms (what the law requires)
- Professional norms (what the profession expects)
- Personal ethics (what I believe is right)
- These remain separated, consulted differently in different contexts

The ANB/NIB architecture formalizes this human capability in artificial agents.

## Distinctive Contribution

Most normative agent architectures collapse recognition and internalization:
- **Regimentation approaches**: Norms are hardcoded constraints → No recognition phase, immediate enforcement
- **Reactive norm-following**: Observe norm signal → Immediately incorporate into behavior
- **Game-theoretic approaches**: Norms as equilibrium strategies → No distinction between knowing a norm exists and following it

This paper's separation enables **reflective norm-following**: The agent can consider norms from a distance before committing to them. This is essential for:
1. Agents operating across multiple normative contexts (international, cross-organizational)
2. Agents that must sometimes violate norms for good reason (emergency response, ethical whistleblowing)
3. Agents that learn norms gradually and may initially misunderstand them (don't want to internalize until confident)
4. Agents that must explain their normative reasoning to humans (needs record of recognized-but-rejected norms)

The framework moves normative agents from *reactive compliance* to *deliberative ethical reasoning*.

## Open Questions

1. **Recognition completeness**: How can an agent be confident it has recognized all relevant environmental norms? Is there a discovery protocol?

2. **Internalization stability**: Once a norm is internalized, under what conditions should it be removed from NIB? Only when expired, or also when consequences change?

3. **Partial internalization**: Can an agent internalize a norm "partially" (follow it in some contexts but not others)? Or is internalization binary?

4. **Norm hierarchies**: Should ANB and NIB support hierarchical norms (general principles vs specific rules)? How does internalization work across levels?

5. **Learning from non-internalization**: If an agent recognizes a norm but doesn't internalize it, then faces negative consequences, how should it update its adoption criteria?