# Desire Internalization as Norm Adoption Mechanism

## The Integration Point

The normative BDI framework faces a fundamental question: **When an agent decides to adopt a norm, which mental state should be updated?**

The options:
- **Beliefs**: Store norm as a fact about the world → Doesn't make the agent *follow* the norm, just know about it
- **Intentions**: Add norm directly to commitments → Bypasses deliberation, forces immediate action
- **Desires**: Add norm content to goals → Allows norm to participate in standard BDI deliberation

The paper proposes (p.7): "We propose that an agent updates only its desire-set; subsequently, this will impact the update of the other mental states in the next iterations of the execution loop."

This design choice has deep implications for how normative reasoning integrates with practical reasoning.

## Why Desires, Not Beliefs or Intentions?

**Beliefs are descriptive, not prescriptive**:

Beliefs represent how the world IS:
- "The mistress ordered me to love Travis" (belief)
- "It is forbidden to love humans" (belief about a prohibition)

These are facts, not motivations. Adding a norm to beliefs means the agent knows the norm exists but has no drive to satisfy it.

**Intentions are commitments, not deliberative**:

Intentions represent what the agent HAS DECIDED to pursue:
- Intentions are formed *after* deliberation
- Adding a norm directly to intentions bypasses plan selection, consistency checking, resource reasoning

If a norm maps directly to intention, the agent commits before evaluating whether satisfying the norm is possible, consistent with other intentions, or has acceptable consequences.

**Desires are motivational and deliberative**:

Desires represent what the agent WANTS to achieve:
- Desires participate in intention formation deliberation
- Multiple desires compete for limited resources
- Desires can conflict without causing inconsistency (the agent can want incompatible things)
- Desire-to-intention filtering is where practical reasoning happens

Adding a norm to desires means: "This norm creates a goal I should try to achieve, subject to practical constraints and deliberation about how to achieve it."

## The Internalization Process

**Full sequence from norm recognition to action**:

```
1. Norm recognized → Added to ANB (factual knowledge)
   ↓
2. Activation condition satisfied → Instantiated to NIB (active norm)
   ↓
3. Consistency check passed → Norm content added to Desire-set D
   ↓
4. Options generation → BDI generates possible plans to satisfy desires (including norm-derived desires)
   ↓
5. Intention formation → Select which desires to commit to (may include or exclude norm-desires)
   ↓
6. Plan selection → Choose plans to achieve committed intentions
   ↓
7. Execution → Perform actions
```

The norm enters the motivational system at step 3 (desires) but doesn't force action until steps 5-7 (after deliberation).

**What gets added to desires**: The *content* of the norm, not the norm itself:

- Norm: ⟨O, love(R781, Travis)⟩
- Added to desires: love(R781, Travis)

The obligation modality (O) affects *how strongly* the desire is pursued, but the desire-set itself contains the goal (love Travis), not the deontic wrapper (obligation to love).

This means norm-derived desires look the same as intrinsic desires to the intention formation mechanism—they compete on equal footing (unless weighted by modality).

## Modality and Desire Strength

The paper doesn't fully specify this, but the modality likely affects desire priority:

**Obligations** (O): High-priority desires
- Should be strongly weighted in intention formation
- Failure to satisfy incurs sanctions (from norm definition)
- Similar to "must have" requirements

**Prohibitions** (F): Negative desires (desires to avoid)
- Strong weight against actions with forbidden effects
- Can be modeled as desires for negated states: F(x) → desire(¬x)
- Violation incurs sanctions

**Permissions** (P): Weak positive desires or removal of prohibitions
- P(x) where F(x) previously held → Remove desire(¬x)
- Optional actions that are now allowed
- Lower weight than obligations

**Implementation approach**:

```python
def internalize_norm(norm_instance, desire_set):
    """
    Add norm content to desire-set with modality-appropriate weight
    """
    content = norm_instance.content
    modality = norm_instance.modality
    
    if modality == "obligation":
        desire_set.add(content, weight=HIGH_PRIORITY)
    elif modality == "prohibition":
        # Add desire for negated content
        negated = negate(content)
        desire_set.add(negated, weight=HIGH_PRIORITY)
    elif modality == "permission":
        # Remove conflicting prohibition if present
        desire_set.remove(negate(content), if_present=True)
        # Optionally add low-weight desire
        desire_set.add(content, weight=LOW_PRIORITY)
```

## Interaction with Pre-Existing Desires

Internalizing norms creates a **heterogeneous desire-set**:

**Sources of desires**:
1. **Intrinsic goals**: Programmed-in objectives (R781's desire for baby's health)
2. **Norm-derived desires**: Obligations/prohibitions from environment
3. **Instrumental desires**: Sub-goals derived from higher-level desires
4. **Social desires**: Goals adopted through communication/coordination

All compete for realization through the intention formation process.

**Conflict resolution happens at the desire level**:

When desires conflict:
- Option A: Explicitly detect conflicts during internalization, resolve before adding to D
- Option B: Allow conflicting desires in D, resolve during intention formation

The paper's approach leans toward Option B: "the agent should now take into account the updated normative state, which will become part of its cognitions" (p.7)—suggests desires can contain conflicts that are resolved later.

**Example**:

Initial desires: {isHealthy(Travis), ¬love(R781, Travis)}
After norm internalization: {isHealthy(Travis), ¬love(R781, Travis), love(R781, Travis)}

The desire-set now contains explicit contradiction: desire to not love AND desire to love.

**Resolution occurs during intention formation**:
- Generate options for each desire
- Recognize that satisfying both ¬love and love is impossible (maximal non-conflicting subset generation)
- Use consequence evaluation to choose which desire to commit to as intention
- Only the selected desire becomes an intention

This defers conflict resolution to the deliberation stage, where consequence reasoning is available.

## Advantages of Desire-Level Internalization

**1. Separation of concerns**:
- Norm adoption (internalization) is separate from commitment (intention formation)
- Agent can adopt a norm without immediately acting on it
- Allows resource reasoning: "I accept this obligation, but I can't pursue it right now"

**2. Participation in standard deliberation**:
- Norm-derived desires compete with other desires through normal BDI process
- No special-case handling for normative vs. non-normative goals
- Existing BDI deliberation strategies (utility-based, resource-based, deadline-based) automatically apply to norms

**3. Graceful overload handling**:
- If agent receives more obligations than it can satisfy, desire-level internalization allows prioritization
- Compare: intention-level internalization would create over-commitment immediately

**4. Enables norm-goal synergy detection**:
- When norm-derived desire aligns with intrinsic desire, both strengthen the same intention
- Example: Obligation to feed Travis + intrinsic desire for Travis's health → Strong intention to feed
- The agent can recognize when norms help rather than hinder

**5. Transparent decision-making**:
- Observer can inspect desire-set to see all goals (norm-derived and intrinsic)
- Can trace why certain intentions were formed: "This intention serves both my core goal and this obligation"

## Implementation in Jade/Jadex

The paper's implementation stores desires in Jadex's belief-set:

```xml
<beliefset name="desires">
  <fact>isHealthy(Travis)</fact>           <!-- Intrinsic -->
  <fact>feed(R781, Travis)</fact>          <!-- From internalized obligation -->
</beliefset>
```

**Updating desires from NIB**:

```java
public void internalize_active_norms() {
    // Get all active, internalized norms from NIB
    for (NormInstance norm : nib.getInternalized()) {
        if (norm.getModality() == Modality.OBLIGATION) {
            // Add content as high-priority desire
            beliefs.getBeliefSet("desires").addFact(norm.getContent());
        } else if (norm.getModality() == Modality.PROHIBITION) {
            // Add negated content as desire to avoid
            beliefs.getBeliefSet("desires").addFact(
                negate(norm.getContent())
            );
        }
    }
}
```

This update happens after consistency checking and conflict resolution, before the next deliberation cycle.

## Application to Multi-Agent Orchestration

**Orchestrator-level norm internalization**:

An orchestrator receives norms about task allocation:
- ⟨O, balance_load(agents)⟩ — Fairness norm
- ⟨O, minimize_latency(tasks)⟩ — Performance norm
- ⟨F, overload(agent_A)⟩ — Safety norm

After internalization, orchestrator's desires:
```
{
  complete_all_tasks,           // Intrinsic
  balance_load(agents),         // Norm-derived
  minimize_latency(tasks),      // Norm-derived  
  ¬overload(agent_A)            // Norm-derived
}
```

**Intention formation deliberation**:

Generate options:
- Option 1: Assign all tasks to fastest agent (agent_A) → Satisfies minimize_latency, violates balance_load and overload_prevention
- Option 2: Distribute tasks evenly → Satisfies balance_load, may violate minimize_latency  
- Option 3: Hybrid allocation with A taking more but not all → Partial satisfaction of multiple desires

Consequence evaluation determines which option has least-bad worst case.

**Desire-level flexibility**: Because norms are desires, not hard constraints, the orchestrator can make trade-offs:
- If minimize_latency has worst consequence when violated (SLA breach), prioritize it
- If overload has worst consequence when violated (system crash), prioritize it
- Balance_load may be sacrificed if both latency and safety are critical

This wouldn't be possible if norms were hard constraints at intention level.

**Agent-level norm internalization for skill execution**:

An agent executing a code generation skill receives norms:
- ⟨O, include_license_header⟩
- ⟨O, run_security_scan⟩
- ⟨F, commit_untested_code⟩

Agent's intrinsic desires:
```
{
  complete_code_task,
  meet_deadline
}
```

After internalization:
```
{
  complete_code_task,
  meet_deadline,
  include_license_header,
  run_security_scan,
  ¬commit_untested_code
}