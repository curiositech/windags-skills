# Commitment Strategies: Calibrating Persistence to Environment Volatility

## The Core Trade-Off (Wooldridge's Framing)

Wooldridge identifies the central tension in goal-directed autonomous systems:

> "We are thus presented with a dilemma:
> - an agent that does not stop to reconsider its intentions sufficiently often will continue attempting to achieve its intentions even after it is clear that they cannot be achieved, or that there is no longer any reason for achieving them;
> - an agent that constantly reconsiders its intentions may spend insufficient time actually working to achieve them, and hence runs the risk of never actually achieving them."

This isn't just a performance question ("how often to replan?"). It's about **rational agency under uncertainty**: when do you **persist** with a goal despite setbacks, and when do you **abandon** it?

The resolution: **Commitment strategies must be calibrated to environment change rates.** There is no universal "best" level of boldness or caution—only context-dependent optimality.

## The Willie Robot Parable (Three Commitment Models)

Wooldridge presents a thought experiment (pp. 76-77): Customer asks robot Willie to bring a beer.

### Model A: No Commitment (Premature Abandonment)
- Willie accepts task, starts retrieving beer
- After 20 minutes, Willie "decides to do something else" and abandons task
- Customer: angry at lack of persistence

**Failure mode**: Agent treats all goals as suggestions, not commitments. Never invests enough effort to succeed on hard tasks.

### Model C: Over-Commitment (Blind Persistence)
- Willie accepts task, retrieves beer, starts returning
- Midway, customer says "never mind, I don't want it anymore"
- Willie delivers beer anyway (commitment only drops when "fulfilled or impossible")
- Customer throws beer away
- Willie interprets this as "goal not yet fulfilled" (beer isn't in customer's hand in drinkable state)
- Willie retrieves bottle from trash, tries again
- Customer smashes bottle to make goal impossible
- Only then does Willie drop commitment

**Failure mode**: Agent is deaf to cancellation signals. Confuses literal goal satisfaction with goal relevance. Wastes resources pursuing goals whose justification is gone.

### Correct Model: Context-Sensitive Commitment
- Willie drops commitment when:
  1. **Fulfilled**: Beer delivered and accepted
  2. **Impossible**: Bottle smashed, or physical obstacles make delivery infeasible
  3. **Cancelled**: Customer explicitly revokes the request

**Key insight**: Goal abandonment must distinguish **achievement** (goal reached), **infeasibility** (goal unreachable), and **motivation loss** (goal no longer wanted).

## Cohen-Levesque Formalization (Persistent Goals)

Wooldridge introduces the **persistent goal** construct (from Cohen & Levesque, 1990):

An agent i has a persistent goal of p if:
1. It has a goal that p **eventually becomes true**, and believes p is **not currently true**
2. Before it drops the goal:
   - The agent believes the goal has been **satisfied** (p is now true), OR
   - The agent believes the goal will **never** be satisfied (p is impossible)

**Notation**:
```
(P-Goal i p) = (Goal i (Eventually p)) ∧ (Bel i ¬p) ∧
               Until(
                 (Bel i p) ∨ (Bel i ◻¬p),  // drop conditions
                 (Goal i (Eventually p))    // maintained goal
               )
```

**Critical property**: The goal **persists** until evidence (belief update) shows it's achieved or unachievable. It doesn't drop due to external events the agent doesn't observe, and it doesn't drop arbitrarily.

**Intention defined recursively**:

> "(Int i a) = (P-Goal i [Done i (Bel i (Happens a))?; a])"

"I intend to do action a" means "I have a persistent goal that: I come to believe I'm about to do a, then actually do it."

This captures: Intention is **commitment to bringing about a believed future state** through action.

## The Kinny & Georgeff Experiments (Empirical Validation)

Wooldridge cites experiments (pp. 79-80) that **empirically demonstrate** the environment-strategy coupling:

**Setup**:
- Two agent types:
  - **Bold**: Never reconsiders intentions until plan exhausted
  - **Cautious**: Reconsiders after every action
- Environment dynamics parameterized: **rate of change** = (agent loop speed) / (world change speed)
- Metric: Fraction of intentions successfully achieved

**Results**:

| Environment Dynamism | Bold Performance | Cautious Performance |
|---------------------|------------------|---------------------|
| Low (static) | ~70% success | ~60% success |
| High (rapid change) | ~20% success | ~60% success |

**Interpretation**:

- **Static environments punish reconsideration**: World doesn't change, so cautious agents waste cycles checking for changes that aren't happening
- **Dynamic environments punish stubbornness**: World changes faster than bold agents react; they pursue obsolete goals

**Key quote**:

> "Different environment types require different intention reconsideration and commitment strategies."

This falsifies the notion of a "universally rational" agent. **Rationality is environment-dependent**.

## Formalizing Reconsideration: The Optimal Policy

Wooldridge formalizes "optimal reconsideration" (p. 78):

> "The function reconsider(...) will be behaving optimally if, and only if, whenever it chooses to deliberate, the agent changes intentions."

**Intuition**: Don't waste time reconsidering unless you'll actually change your plan. Reconsideration has cost (deliberation cycles); it's only justified if it leads to a better plan.

**Formal criterion**:
```
Optimal(reconsider) ⟺ 
  ∀t. (reconsider() returns at time t) ⟹ (intention at t ≠ intention at t-1)
```

**Implication**: Agent must predict **"is the world likely to have changed enough that replanning is warranted?"** before actually replanning.

**Computational challenge**: This is a **meta-reasoning problem**—reasoning about whether to reason. Requires:
- Model of environment dynamics (how fast does it change?)
- Model of plan robustness (how sensitive is current plan to changes?)
- Model of replanning cost (how expensive is deliberation?)

Wooldridge doesn't solve this (it's AI-complete), but establishes the **theoretical criterion** for optimal meta-reasoning.

## Levels of Commitment (Behavioral Spectrum)

Wooldridge defines three commitment strategies (from Rao & Georgeff):

### 1. Blind Commitment
- **Never** reconsiders intentions
- Persists until goal is **achieved**
- **When optimal**: Static, deterministic environments where plans rarely fail
- **Failure mode**: Pursues infeasible goals indefinitely (Willie Model C)

### 2. Single-Minded Commitment
- Reconsiders intentions when:
  - Goal is achieved, OR
  - Goal becomes **impossible** (belief that goal is unreachable)
- **When optimal**: Environments where goals can become impossible, but motivations don't change
- **Failure mode**: Wastes effort on goals whose justification vanished (Willie Model C, partially)

### 3. Open-Minded Commitment
- Reconsiders intentions when:
  - Goal is achieved, OR
  - Goal is impossible, OR
  - **Motivation for goal is no longer present** (goal is cancelled, or preconditions for wanting it are false)
- **When optimal**: Dynamic environments with changing goals and priorities
- **Failure mode**: If reconsideration is too frequent, thrashes between goals (Willie Model A)

**Key insight**: These aren't discrete types—they're **points on a continuum** of reconsideration frequency. The optimal point depends on environment statistics.

## The Intention-Belief Asymmetry (Philosophical Foundation)

Wooldridge introduces a subtle logical constraint (p. 205):

**Intention-Belief Inconsistency** (irrational):
```
Intend(φ) ∧ Believe(¬φ)  // "I intend φ but believe it won't happen"
```
This is **nonsensical**. You can't rationally intend something you're certain will fail.

**Intention-Belief Incompleteness** (rational):
```
Intend(φ) ∧ ¬Believe(φ)  // "I intend φ but am uncertain whether I'll achieve it"
```
This is **OK**. You can commit to a goal without certainty of success.

**The asymmetry thesis**: You must believe success is **possible** (¬Believe(¬φ)), but not **guaranteed** (¬Believe(φ) is acceptable).

**Why this matters for commitment**:

Humans (and rational agents) commit to hard goals (write a book, learn a language, climb a mountain) **despite uncertainty**. We believe success is *possible*, which is enough to justify effort.

**For agent design**: Don't require agents to prove goals are achievable before committing. Require only that they:
- Believe the goal is **not provably impossible**
- Have a **plan** that could succeed if the environment cooperates

## Application to Complex Task Orchestration

### Scenario: 180-Skill DAG Execution

In a system with 180+ skills executing a complex workflow:

- Some sub-goals are **deterministic** (data validation: input is valid or not)
- Some are **probabilistic** (external API call: might timeout, might succeed)
- Some are **dynamic** (user preferences might change mid-execution)

**Design question**: How bold should the orchestrator be?

**Answer (from Wooldridge's framework)**:

**Commitment should vary by sub-goal type**:

| Sub-Goal Type | Environment | Optimal Strategy | Implementation |
|--------------|-------------|------------------|----------------|
| Data validation | Static, deterministic | **Bold** (never reconsider) | Execute once; cache result |
| API call | Non-deterministic, semi-static | **Single-minded** (retry on failure, abandon if impossible) | Retry with exponential backoff; circuit-break after N failures |
| User preference check | Dynamic | **Open-minded** (reconsider if user signals change) | Subscribe to preference-change events; replan on notification |

**Key principle**: **Don't treat all skills uniformly**. Each sub-environment has different dynamics; tailor commitment accordingly.

### Example: Multi-Phase Approval Workflow

**Workflow**:
1. Validate request (deterministic)
2. Check budget (semi-deterministic: budget might be exhausted by concurrent requests)
3. Obtain manager approval (dynamic: manager might be unavailable, might change mind)
4. Execute transaction (non-deterministic: external system might fail)

**Commitment calibration**:

- **Phase 1 (Validation)**: Blind commitment. Once you decide input is valid, don't re-validate unless explicitly invalidated.
  
- **Phase 2 (Budget check)**: Single-minded. If budget is available, proceed; if exhausted, immediately fail (goal impossible). Don't retry unless budget is replenished (external event).

- **Phase 3 (Approval)**: Open-minded. If manager hasn't responded in T seconds, **reconsider**: "Is this still worth waiting for? Has priority changed?" If manager explicitly denies, abandon. If manager goes offline, escalate to alternate approver.

- **Phase 4 (Transaction)**: Single-minded with retries. If transaction fails due to transient error, retry. If it fails permanently (account closed), abandon.

**Orchestration logic**:
```python
def execute_workflow(request):
    # Phase 1: Bold (no reconsideration)
    if not validate(request):
        return Fail("Invalid request")
    
    # Phase 2: Single-minded (check once, fail fast on impossibility)
    if not check_budget():
        return Fail("Budget exhausted")
    
    # Phase 3: Open-minded (reconsider every 30 sec)
    approval = None
    while approval is None:
        approval = poll_manager_approval(timeout=30)
        if user_cancelled():  # motivation lost
            return Cancelled
        if manager_denied():  # impossible
            return Fail("Manager denied")
    
    # Phase 4: Single-minded with retries
    for attempt in range(MAX_RETRIES):
        result = execute_transaction()
        if result.success:
            return Success
        if result.permanent_failure:  # impossible
            return Fail(result.error)
        sleep(exponential_backoff(attempt))
    
    return Fail("Transaction failed after retries")
```

## Meta-Level Commitment: When to Replan vs. When to Persist

**The meta-question**: Given that a sub-goal has failed, should the orchestrator:
1. Retry the same skill
2. Try an alternative skill
3. Replan the entire workflow
4. Abandon the top-level goal

**Wooldridge's framework suggests**:

- **Retry** if: Failure is **transient** (timeout, network glitch) and environment hasn't changed
- **Alternative skill** if: Failure is **skill-specific** (this API is down, but alternate API might work) and goal is still achievable
- **Replan** if: Failure indicates **world has changed** (budget exhausted, requirements changed) such that current plan is obsolete
- **Abandon** if: Failure indicates **goal is impossible** (user account deleted, transaction limit exceeded) or **motivation is gone** (user cancelled request)

**Decision tree**:
```
Skill S failed with error E

Is E a transient failure? (timeout, rate limit, temporary unavailable)
  → YES: Retry S with backoff
  → NO: Continue

Is there an alternative skill S' that can achieve the same sub-goal?
  → YES: Try S'
  → NO: Continue

Has the world changed such that the current plan is invalid?
  (e.g., preconditions of downstream skills no longer hold)
  → YES: Replan (re-run decomposition with updated world model)
  → NO: Continue

Is the top-level goal still achievable? (ignoring current plan)
  → NO: Abandon goal, report failure
  → YES: Replan

Is the top-level goal still wanted? (motivation check)
  → NO: Cancel, report cancellation
  → YES: Replan
```

## The "Homer Lost the Log" Moment

Wooldridge includes a delightful example (pp. 80-81): **HOMER**, a simulated submarine robot with natural language understanding.

**Dialogue**:
```
USER: Turn away from your log.
HOMER: OK, I am turning.
[LOG IS MOVED WHILE HIDDEN]
USER: Turn around.
HOMER: I've lost the log!
```

**Why this matters**:

HOMER maintains a **world model** (beliefs about object locations). When it observes the log is missing, it:
1. Detects **belief-world mismatch** (I believed log was at X; it's not there)
2. Expresses **surprise** (affective state signaling model violation)
3. Implicitly drops the goal of "interacting with the log" (can't achieve what you can't find)

This is **open-minded commitment** in action:
- Goal was "turn toward log"
- Belief: "log is at location X"
- Observation: "log not at X"
- Inference: "log has moved or been removed"
- Decision: "goal may be impossible; report surprise"

**For multi-agent systems**: Agents should **signal surprise** when expectations are violated. This enables:
- Other agents to update their models (if HOMER reports surprise, maybe others also have stale beliefs)
- Human operators to intervene (surprise often indicates something important happened)
- Coordination layer to trigger replanning (world has changed in unexpected way)

## Commitment as Resource Allocation

An underappreciated insight: **Commitment is a scarce resource**.

When an agent commits to a goal:
- It allocates **time** (deliberation + execution)
- It allocates **memory** (tracking goal state, plans, progress)
- It allocates **opportunity cost** (can't pursue alternative goals simultaneously)

**Implication**: Systems with limited resources (compute, memory, time) must **ration commitments**.

**Practical constraint**: With 180 skills and complex workflows, you cannot commit to **all possible goals**. You must:

1. **Prioritize**: High-value goals get strong commitment (bold/single-minded); low-value goals get weak commitment (open-minded, quick abandonment)

2. **Defer**: Some goals are queued, not immediately committed (wait until resources free up)

3. **Preempt**: If a high-priority goal arrives, drop low-priority commitments to free resources

**Scheduling analogy**: This is **real-time scheduling with deadlines and priorities**. Commitment strategies are analogous to scheduling policies:

- **Bold** = fixed-priority, run-to-completion (once scheduled, never preempt)
- **Single-minded** = preemptive priority (preempt if goal becomes impossible)
- **Open-minded** = time-slicing with dynamic re-prioritization (frequently check if goal is still worth pursuing)

## Practical Takeaway: Adaptive Commitment Policies

For a deployed multi-agent orchestration system:

**Don't hardcode a single commitment strategy.** Instead:

1. **Profile environment dynamics per sub-domain**:
   - Log: (change frequency, failure rate, recovery time) for each skill type
   - Compute: average (change frequency) = # state changes / execution time

2. **Classify skills by environment volatility**:
   - **Static** (change frequency < 0.01 changes/sec): Data transformations, validations
   - **Semi-static** (0.01-1 changes/sec): Database queries, cached computations
   - **Dynamic** (1-10 changes/sec): External API calls, user interactions
   - **Hyper-dynamic** (>10 changes/sec): Real-time sensor processing, market data

3. **Map volatility to commitment strategy**:
   ```
   if volatility == "static":
       commitment = BOLD  # never reconsider
   elif volatility == "semi-static":
       commitment = SINGLE_MINDED  # reconsider on failure
   elif volatility == "dynamic":
       commitment = OPEN_MINDED  # reconsider every N seconds
   else:  # hyper-dynamic
       commitment = REACTIVE  # reconsider every cycle
   ```

4. **Monitor and adapt**:
   - Log: (commitment drops due to changed environment) vs. (commitment drops due to goal achieved)
   - If many drops due to changed environment → environment is more dynamic than estimated → increase reconsideration frequency

This implements **meta-learning**: the system learns optimal commitment strategies from experience, rather than relying on static design-time assumptions.