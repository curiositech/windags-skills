# Selection Functions: Where Agent Policy Lives

## The Key Architectural Insight

One of the most practically important contributions of AgentSpeak(L) is its
explicit separation of **what an agent knows how to do** (the plan library P)
from **how an agent decides what to do** (the selection functions SE, SO, SI).

This separation is architecturally profound. It means that the agent's behavioral
*repertoire* and the agent's *decision-making strategy* are independent, replaceable
components. You can change an agent's strategy without changing its skills. You can
reuse an agent's skills with a different strategy. You can analyze the strategy
independently of the skills and vice versa.

Most real-world orchestration systems violate this separation catastrophically —
routing logic, priority decisions, and skill invocations are entangled in monolithic
decision procedures that cannot be analyzed, replaced, or tuned independently.

---

## The Three Selection Functions

**SE: Event Selection**

SE selects which event to process from the pending event set E. The event set can
contain multiple pending events simultaneously — new environmental observations,
internally generated sub-goals from executing intentions, external requests. SE
determines the agent's *attention* — what it focuses on next.

Different SE policies produce radically different agent behaviors:

- **FIFO**: Process events in arrival order. Fair, predictable, but potentially
  slow to respond to urgent events.
- **Priority queue**: Process highest-priority events first. Responsive to urgency
  but can starve low-priority events.
- **Recency-based**: Process most recently arrived events first. Responsive but
  can abandon long-running tasks.
- **Type-based**: Process certain event types (e.g., failure events, belief updates)
  before goal events. Implements meta-level priorities.
- **Deadline-aware**: Process events closest to their deadline first. Appropriate
  for real-time systems.

The choice of SE determines whether the agent is primarily **reactive** (handles
new observations quickly) or **deliberative** (completes current intentions before
attending to new inputs). Neither is universally correct — the right SE depends on
the domain.

**SO: Option Selection**

SO selects which applicable plan to commit to when multiple plans are applicable
for a given event. This is the agent's *strategic* selection — given that it must
respond to this event, which approach should it take?

Different SO policies:

- **First-match**: Select the first applicable plan in library order. Simple,
  deterministic, depends on library structure.
- **Random**: Select randomly among applicable plans. Useful for exploration or
  stochastic domains.
- **Utility-weighted**: Assign utilities to plans (expected cost, risk, resource
  consumption); select the highest-utility applicable plan.
- **Meta-plan**: Use a specialized meta-level plan that evaluates applicable plans
  and selects the best. Enables context-sensitive strategy selection beyond what
  context conditions capture.
- **Learning-based**: Use past execution history to estimate plan success probability;
  select accordingly.

SO is where the agent's *wisdom* lives — its ability to choose not just applicable
strategies but *good* strategies given the current situation. A naive SO (first-match)
makes an otherwise brilliant plan library useless; a sophisticated SO can compensate
for an incomplete plan library by making good guesses.

**SI: Intention Selection**

SI selects which active intention to advance in each interpreter cycle. An agent
can have multiple active intentions simultaneously — multiple top-level goals it
is pursuing in parallel. SI determines which one gets computational resources in
each cycle.

Different SI policies:

- **Round-robin**: Advance each intention in turn. Fair, predictable, gives
  each intention equal throughput.
- **Priority-based**: Advance the highest-priority active intention. Ensures
  critical intentions complete faster.
- **Shortest-remaining**: Advance the intention closest to completion. Minimizes
  mean completion time.
- **Dependency-aware**: Advance intentions that are not blocked on sub-goals;
  skip blocked intentions. Prevents wasted cycles.
- **Context-sensitive**: Advance intentions whose next step is feasible given
  current beliefs; skip intentions whose next action is currently impossible.

SI determines the agent's *multitasking behavior* — how it interleaves concurrent
commitments. In real-time systems, SI is crucial: a delayed-intention that should
have been advanced three cycles ago may cause the agent to miss a deadline.

---

## Selection Functions as Replaceable Policy Modules

The architectural importance of making selection functions explicit and replaceable
cannot be overstated. Consider what this enables:

**1. Separate development**: Plan library authors focus on *what to do* in each
situation. Policy designers focus on *how to prioritize* and *how to choose*. These
are genuinely different skills requiring different expertise.

**2. Domain adaptation**: The same plan library (same behavioral knowledge) can be
deployed with different selection policies for different deployment contexts. A
medical diagnosis agent with urgent vs. non-urgent cases might use different SE
policies in ICU vs. outpatient settings.

**3. Empirical tuning**: Selection functions can be tuned based on observed
performance without modifying plans. Track which SO choices led to successful
intention completions; train a policy accordingly.

**4. Formal analysis**: The formal properties of an agent — liveness (intentions
eventually complete), safety (certain actions never taken), fairness (all intentions
eventually advance) — depend critically on the selection function policies. You can
prove these properties for specific selection function implementations.

**5. Testing isolation**: Test the plan library with a known, simple selection
policy (first-match, round-robin). Test selection function policies with a known,
simple plan library. Problems in integration are then attributable to the interaction,
not to either component alone.

---

## Selection Functions in WinDAGs

Translating this to a DAG-based orchestration system with 180+ skills:

**SE equivalent: Task/Event Router**

The orchestrator receives events — user requests, tool outputs, error signals,
sub-agent completions. Which event gets processed next? This is SE. The router
should be an explicit, configurable component with a well-defined interface:
input is the current event queue and system state; output is the next event to
process.

Design considerations:
- Failure events should generally take priority over normal task events (safety)
- User-initiated events may take priority over internally generated events (responsiveness)
- Events with pending timeouts need deadline-aware priority
- Sub-goal completions that unblock other intentions should be processed promptly

**SO equivalent: Skill Selector**

Given a task type and current system state, which skill (among applicable skills)
should be invoked? This is SO. The skill selector should be an explicit component
separate from the skill library itself.

Design considerations:
- Skills with lower computational cost should be preferred when equivalently capable
- Skills with recent failures should be deprioritized temporarily
- Skills that produce outputs directly usable by subsequent pipeline steps should
  be preferred for intermediate tasks
- Meta-skill selection (using one skill to choose among others) is possible and
  powerful but expensive

**SI equivalent: Intention/Thread Scheduler**

The orchestrator may have multiple concurrent task threads active — multiple
user requests, multiple long-running sub-tasks. Which thread gets the next
computational resource allocation? This is SI.

Design considerations:
- Threads blocked on external tool calls should not consume scheduler resources
- Threads with user-visible latency implications should be prioritized
- Threads that have been waiting longest should eventually advance (starvation prevention)
- Threads executing non-interruptible skill invocations should complete current
  step before yielding

---

## The Meta-Level: Selection Functions Selecting Selection Functions

An important extension not fully developed in Rao's base formalism is the
possibility of **adaptive selection functions** — selection functions that change
their own behavior based on observed outcomes.

A meta-level SO, for example, might:
1. Maintain statistics on plan success rates per context type
2. Estimate probability of success for each applicable plan given current context
3. Select the plan with highest expected utility
4. Update statistics after execution

This is the agent learning its own selection policy from experience. The plan
library remains fixed; the selection function adapts. This is computationally
tractable (the selection function is lightweight compared to plan execution) and
empirically grounded (based on actual execution history).

The architectural insight: **learning and adaptation should be implemented in the
selection functions, not in the plans**. Plans encode domain knowledge, which
changes slowly. Selection functions encode policy, which can be adapted quickly.

---

## Failure Handling and Selection Function Interaction

An important but subtle interaction: what happens when SO selects a plan that
subsequently fails during execution? The selection function must be informed of
this failure and adjust accordingly.

There are two approaches:

**Backtracking SO**: When a plan fails, return control to SO to select a different
applicable plan for the same event. This makes failure recovery automatic and
transparent. The agent tries each applicable plan in sequence until one succeeds
or all are exhausted.

**Failure event generation**: When a plan fails, generate a failure event and add
it to E. SE processes this failure event; SO selects a recovery plan. This makes
failure handling explicit and allows specialized recovery plans.

The first approach is simpler and automatically robust. The second approach is more
flexible — failure recovery can be as sophisticated as any other agent behavior.

Most practical systems use a combination: backtracking within a plan family
(plans for the same event type) and failure events for cross-cutting recovery.

---

## Boundary Conditions

**When selection functions are insufficient**:

1. **Global optimization problems**: SE, SO, and SI are all local, greedy policies.
   They optimize the current decision without lookahead. Problems requiring global
   optimization (e.g., scheduling n intentions to minimize total completion time)
   require planning, not selection.

2. **Adversarial environments**: Selection functions that are deterministic can be
   exploited in adversarial settings. Randomized selection may be necessary.

3. **Resource-constrained systems**: Standard selection functions do not account for
   computational resource availability. In resource-constrained settings, SO must
   consider resource costs of each applicable plan, and SI must account for
   concurrent resource consumption across active intentions.

---

## Summary

Selection functions are the agent's policy layer:

1. **SE** controls attention — which events get processed and in what order
2. **SO** controls strategy — which applicable plan to commit to
3. **SI** controls multitasking — which active intention to advance

These functions should be:
- **Explicit**: named, documented, independently specified components
- **Replaceable**: pluggable policies with well-defined interfaces
- **Separate from plans**: behavioral knowledge and selection policy are distinct
- **Tunable**: adaptable based on observed performance without modifying plans
- **Formally analyzable**: agent properties (liveness, safety, fairness) depend on
  selection functions and should be provable from their specifications

In WinDAGs, the event router, skill selector, and thread scheduler are the concrete
manifestations of SE, SO, and SI respectively. They deserve as much design attention
as the skills themselves.