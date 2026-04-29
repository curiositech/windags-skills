# Failure Modes of Resource-Bounded Reasoning: What Can Go Wrong and Why

## The Taxonomy of Failure

Most frameworks for rational agency identify success: the agent achieves its goals. Bratman, Israel, and Pollack's framework is distinctive in identifying *six different failure modes* that arise specifically from resource-boundedness. These aren't implementation bugs — they're *inherent to bounded rationality* and cannot be fully eliminated, only managed.

The paper's taxonomy (Table 1, p. 16) describes situations involving incompatible options. Extended, we can identify systematic failure patterns:

## Category 1: Excessive Deliberation (The Cautious Failures)

### Failure Mode 1: Deliberation That Leads to Insignificant Changes (Situation 2b)

**Description**: "Rosie discovers that the existing CRT is repairable... Her deliberation results in a decision to repair rather than replace. And, indeed, repairing is a slightly better option. However, instead of deliberating, Rosie could have simply gone ahead with her intention to replace the CRT, and proceeded more quickly to her next task" (p. 17).

**What went wrong**: The override mechanism triggered when it shouldn't have. The deliberation cost exceeded the benefit gained from choosing the better option.

**Why it's insidious**: The agent made a locally optimal decision (repair is better than replace) but a globally suboptimal one (deliberation + repair is worse than just replacing).

**Diagnostic**: Track deliberation time vs. benefit gained from plan changes. If you see many cases where deliberation takes 10 minutes to gain a 2-minute improvement, your override mechanism is too sensitive.

**For agent systems**: This manifests as "analysis paralysis." An agent spends 5 minutes choosing between libraries that differ by 3% performance, or deliberates extensively about variable naming, or reconsiders its testing strategy when the difference is negligible.

**Fix**: Raise override thresholds for low-stakes decisions. If estimated benefit < N * deliberation_cost, don't override.

### Failure Mode 2: Deliberation That Confirms Original Plan (Situation 3)

**Description**: "Replacing the CRT is the superior option... Hence, when Rosie reconsiders, she decides not to change her prior intention, but instead to go ahead and replace the CRT. Here again Rosie is cautious, and her caution doesn't pay" (p. 18).

**What went wrong**: The override mechanism triggered, deliberation occurred, and the conclusion was "do what I was already planning to do." Pure wasted computation.

**Why it's worse than Situation 2b**: At least in 2b, the agent got *something* from deliberation (a marginally better option). Here, the agent gets *nothing* — it spends resources to confirm what it already knew.

**Diagnostic**: Track deliberations that don't result in plan changes. If deliberation frequently (>30%?) results in confirming the original plan, your override mechanism is triggering on false alarms.

**For agent systems**: An agent reconsiders its implementation approach, spends time evaluating alternatives, and concludes "my original approach was best." This happens when override rules are too coarse — they detect potential problems that aren't actual problems.

**Fix**: Add preconditions to override rules. Don't just check "new option has property X," check "new option has property X *and* property X wasn't already satisfied by current plan."

### Common Cause: Overly Sensitive Override Mechanism

Both Situations 2b and 3 stem from overriding too frequently: "If the agent is overly sensitive, willing to reconsider her plans in response to every unanticipated event, then her plans will not serve sufficiently to limit the number of options about which she must deliberate" (p. 16).

The paper is explicit: **even a well-designed agent will sometimes end up in these situations**. The goal is not to eliminate them but to minimize their frequency relative to productive deliberation (Situation 1).

## Category 2: Missed Opportunities (The Bold Failures)

### Failure Mode 3: Missing Worthwhile Improvements (Situation 4a)

**Description**: "Had Rosie reconsidered, she would have found the new CRT to be slightly superior... the deliberation is relatively easy and does not interfere in any serious way with Rosie's other activities. In this case, then, Rosie's boldness doesn't pay" (p. 18).

**What went wrong**: The override mechanism didn't trigger when it should have. A better option was available, checking would have been cheap, but the agent didn't check.

**Why it happens**: Override thresholds are too high, or override conditions are too narrow, so opportunities that should be recognized aren't.

**Diagnostic**: This is hard to detect automatically because the agent never knows about the missed opportunity. It requires external observation: "Why didn't the agent consider X, which was clearly better?"

**For agent systems**: An agent misses that a new library version fixes a bug it's working around, or doesn't notice that a better API endpoint exists, or fails to recognize that a simpler implementation approach is possible.

**Fix**: This is the hardest failure to address because you must know about opportunities to encode rules for recognizing them. Strategies:
- Periodic background scans for improvements (when resources available)
- Learning from post-mortems (when better approach was found later)
- Explicit opportunity notifications (other agents or monitoring systems broadcast relevant changes)

### The Tradeoff Problem

"As we try to avoid caution that doesn't pay, we run an increased risk of boldness that doesn't pay. And, of course, the opposite is true as well: as we try to avoid boldness that doesn't pay, we run an increased risk of undesirable cautiousness" (p. 20).

This is fundamental: you cannot simultaneously minimize Situations 2b/3 (excessive caution) and Situation 4a (excessive boldness). Tightening override conditions reduces false positives (excessive deliberation) but increases false negatives (missed opportunities). Loosening conditions does the reverse.

The design challenge is finding the sweet spot for a particular domain and workload.

## Category 3: Premature Commitment Failures

### Failure Mode 4: Detailed Planning with Poor Information

The paper discusses this implicitly in its argument for partial plans: "highly detailed plans about the far future will often be of little use, the details not worth bothering about" (p. 9).

**What goes wrong**: The agent commits to detailed plans too early, before information needed for good decisions is available. When reality diverges from assumptions, detailed plans must be abandoned or heavily revised.

**Example**: An agent plans detailed implementation of authentication:
- Library L1, version 1.2.3
- Database schema with columns X, Y, Z
- Token expiration policy P
- Error handling strategy E

Then discovers during implementation:
- Library L1 has a critical bug in version 1.2.3
- Database already has a users table with different schema
- Security requirements mandate different expiration policy
- Existing error handling infrastructure doesn't support strategy E

The detailed plan was worthless. Worse, commitment to the detailed plan may have foreclosed better options that emerged later.

**For agent systems**: This manifests as "planning paralysis" followed by "replanning churn." The agent spends extensive time planning details, then spends more time revising the plan when assumptions are violated. Total time (planning + replanning) exceeds what would have been needed with a partial plan and just-in-time refinement.

**Fix**: Embrace structural partiality. Commit to high-level structure (goals and approaches) but defer details until:
- Information needed for good decisions becomes available
- Time pressure requires commitment (means-end coherence threatens)
- Execution reaches the point where details matter

## Category 4: Insufficient Monitoring Failures

### Failure Mode 5: Acting on Invalidated Plans

The paper notes: "What happens when the agent comes to believe that a prior plan of hers is no longer achievable?" (p. 14).

**What goes wrong**: The world changes in ways that invalidate plan assumptions, but the agent doesn't detect this and continues executing an invalid plan.

**Example**: An agent plans to "fetch data from API endpoint E." While the agent is executing earlier parts of its plan, endpoint E is deprecated and disabled. The agent attempts to fetch from E and fails.

**Why it happens**: Monitoring is expensive. Continuously checking all assumptions of all plans is computationally intractable. So agents monitor selectively or periodically — and can miss changes.

**For agent systems**: 
- Plans assume file F exists; F is deleted by another process
- Plans assume service S is available; S goes down
- Plans assume data format D; D changes

**Fix**: 
- **Precondition checking**: Before executing each step, verify critical preconditions
- **Error handling**: When execution fails, identify which assumptions were violated
- **Event-driven monitoring**: Subscribe to notifications about relevant changes
- **Periodic validation**: Periodically (low frequency) check that critical assumptions still hold

## Category 5: Coordination Failures

The paper doesn't extensively discuss multi-agent coordination failures, but they're implied by the consistency requirement.

### Failure Mode 6: Concurrent Modification Conflicts

**What goes wrong**: Multiple agents have plans that are individually consistent but collectively incompatible due to implicit assumptions about exclusivity.

**Example**: 
- Agent A plans: "Refactor module M"
- Agent B plans: "Add tests for module M"
- Both plans seem consistent (different activities, different outputs)
- But: A's refactoring changes interfaces that B's tests depend on
- B's tests fail because they're written against the old interface

The plans were consistent at abstract level (different domains) but inconsistent at detailed level (shared dependencies).

**For agent systems**: Classic concurrent modification problems:
- Two agents modify the same file
- Two agents allocate the same resource
- Two agents make assumptions about system state that become mutually inconsistent

**Fix**:
- **Lock-based coordination**: Agents acquire locks on resources before modifying
- **Version-based coordination**: Agents tag plans with version assumptions and fail fast if versions mismatch
- **Hierarchical coordination**: Agents coordinate at abstract level before refining plans
- **Transaction-based coordination**: Agents treat plan execution as transactions that can be rolled back

### Failure Mode 7: Starvation and Priority Inversion

**What goes wrong**: An agent's plans are consistently overridden or delayed by other agents' higher-priority plans, leading to starvation.

**Example**: 
- Agent A has low-priority task "write documentation"
- Agents B, C, D constantly have higher-priority tasks
- Agent A never executes because it's always preempted

**Why it's subtle**: Each individual preemption is rational (B's task is more important than A's). But the cumulative effect is that A's task never completes, even though it's still important.

**For agent systems**: Background maintenance tasks, optimization work, or technical debt reduction may be perpetually deferred in favor of feature work.

**Fix**:
- **Age-based priority boost**: Tasks increase in priority over time
- **Guaranteed time slices**: Each agent gets minimum percentage of resources
- **Explicit starvation detection**: Monitor task age and force execution of starved tasks

## Category 6: Meta-Level Failures

### Failure Mode 8: Expensive Meta-Reasoning

The paper warns: "It is essential that the filtering process be computationally efficient relative to deliberation itself" (p. 13).

**What goes wrong**: The mechanisms designed to reduce deliberation cost (filtering, override checking) themselves become expensive, negating their purpose.

**Example**: A compatibility filter that runs complex constraint satisfaction to check consistency. The filter takes longer than the deliberation it's meant to avoid.

**For agent systems**: Over-engineered meta-reasoning:
- Complex heuristics for skill selection that take longer than trying a skill
- Elaborate cost-benefit analysis of deliberation that costs more than the deliberation
- Sophisticated override mechanisms that require extensive computation

**Fix**:
- **Use simple, fast filters**: Prefer polynomial-time checks over NP-hard optimization
- **Use approximate filters**: Accept false positives/negatives for speed
- **Profile meta-reasoning**: Measure time spent in filtering, override checking, monitoring
- **Budget meta-reasoning**: Allocate fixed time/resource budget to meta-level processes

## The Impossibility Result

The paper's deepest insight is that **you cannot eliminate these failures**. Even in the idealized case mentioned in footnote 9 (p. 19), where an agent "is disposed to deliberate about an incompatible option when and only when that deliberation would lead to a worthwhile change," the agent would need to know the outcome of deliberation *before* deliberating — which is impossible.

The failures are not bugs; they're **inherent features of bounded rationality**. The goal is not perfection but acceptable failure rates:

- Keep Situations 2b, 3, 4a below some threshold (< 20% of deliberations?)
- Maximize Situations 1, 4 (productive deliberations and productive commitments)
- Accept Situation 4b (suboptimality when checking would cost more than benefit)

## Diagnostic Framework

For agent system designers, the paper provides a diagnostic framework:

**If agent is slow/inefficient**:
- Measure: How often does deliberation lead to plan changes?
- If rarely: Situations 2b, 3 are frequent (overly cautious)
- Fix: Tighten override conditions, raise thresholds

**If agent is making poor choices**:
- Measure: How often do post-mortems reveal better options were available?
- If often: Situation 4a is frequent (overly bold)
- Fix: Loosen override conditions, lower thresholds, add opportunity detection

**If agent is unstable/thrashing**:
- Measure: How often does the agent abandon plans?
- If very often: Plans aren't stable (override mechanism too sensitive)
- Fix: Plans aren't providing filtering function; dramatically raise override thresholds

**If agent is rigid/brittle**:
- Measure: How often do plans fail due to invalid assumptions?
- If often: Insufficient monitoring or insufficiently revisable plans
- Fix: Add monitoring, lower override thresholds for critical assumptions

The framework transforms vague "the agent isn't working well" into specific, measurable failure modes with targeted architectural interventions.