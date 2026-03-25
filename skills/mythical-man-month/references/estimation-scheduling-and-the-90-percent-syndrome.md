# Estimation, Scheduling, and the 90% Syndrome: Why Software Is Always "Almost Done"

## The Iron Law: Optimism Is Not Strategy

Brooks opens the chapter on scheduling with a brutal truth: **"More software projects have gone awry for lack of calendar time than for all other causes combined."**

Why is time the dominant failure mode?

**Four structural causes:**

1. **Estimation techniques are poorly developed** and rest on an **unvoiced assumption which is quite untrue**: that all will go well.

2. **Estimation conflates effort with progress**, hiding the assumption that men and months are interchangeable (they aren't, as we've seen).

3. **Managers lack the courteous stubbornness** to defend their estimates against pressure.

4. **Schedule progress is poorly monitored**, so slippage becomes visible only when it's too late.

5. **The natural response to slippage is to add manpower**, which makes things worse (Brooks's Law).

Each of these is solvable, but only if we first confront the underlying problem: **all programmers are optimists.**

## The Psychology of Optimism

"All programmers are optimists. Perhaps this modern sorcery especially attracts those who believe in happy endings and fairy godmothers."

Brooks's analysis of why optimism is endemic:

**The medium is tractable**: "The programmer builds from pure thought-stuff: concepts and very flexible representations thereof." Unlike the engineer whose steel might bend or the architect whose materials might crack, **the programmer's medium has no physical constraints**. So we believe: "This time it will surely run."

**The fallacy**: "Because the medium is tractable, we expect few difficulties in implementation; hence our pervasive optimism. Because our ideas are faulty, we have bugs; hence our optimism is unjustified."

The problem is not stupidity—it's the intrinsic gap between **idealized mental models** and **actual implementations**.

Dorothy Sayers's stages of creation:
1. **Idea** (perfect, complete, outside time and space)
2. **Implementation** (where incompletenesses and inconsistencies become clear)
3. **Interaction** (where users reveal what you actually built)

**We estimate based on stage 1. We deliver based on stage 3.**

## The Data: How Bad Is It?

Brooks presents several data sources showing consistent patterns:

**Aron's Data (IBM):**
- **Very few interactions**: 10,000 instructions per man-year
- **Some interactions**: 5,000 instructions per man-year
- **Many interactions**: 1,500 instructions per man-year

(These don't include support and system test—they're just design and programming. Dilute by 2x for full cycle.)

**Harr's Data (Bell Labs, ESS):**
- **Control programs**: ~600 words per man-year
- **Language translators**: ~2,200 words per man-year

(These include writing, assembling, debugging. The productivity difference reflects problem complexity, not coder skill.)

**OS/360 Data (IBM):**
- **Control programs**: 600-800 debugged instructions per man-year
- **Language translators**: 2,000-3,000 instructions per man-year

(Include planning, coding, component test, system test, some support.)

**Portman's Data (ICL):**
- Teams were **missing schedules by about one-half** (everything took 2x as long as estimated)
- **Cause**: They assumed programmers would be programming full-time
- **Reality**: Programmers realized **only 50% of working week** as actual programming time
- Machine downtime, meetings, paperwork, sickness, personal time consumed the rest

**Key insight:** The **estimation error was entirely accounted for by unrealistic assumptions about available time**, not by misestimating task difficulty.

## Brooks's Estimating Rule of Thumb

Based on experience, Brooks proposes:
- **1/3 planning**
- **1/6 coding**
- **1/4 component test and early system test**
- **1/4 system test, all components in hand**

**This differs from conventional scheduling in three ways:**

1. **Planning is larger than normal** (and still barely enough for detailed, solid specs—not enough for research)

2. **Half the schedule is debugging** (much larger than normal)

3. **The easy part (coding) is only 1/6**

Brooks: "In examining conventionally scheduled projects, I have found that few allowed one-half of the projected schedule for testing, but that most did indeed spend half of the actual schedule for that purpose."

**The pattern:** Everyone is on schedule until system test. Then disaster.

**Why system test is uniquely bad:**

- **Delay comes at the end** → no warning until delivery date approaches
- **Cost-per-day is maximum** → project is fully staffed
- **Secondary costs are huge** → software is meant to support other business efforts (shipping hardware, operating facilities); delay cascades

"These secondary costs may far outweigh all others."

## The 90% Done Syndrome

The most insidious property of software is that progress is invisible and nonlinear.

**"Coding is 90% finished for half the total coding time."**

**"Debugging is 99% complete most of the time."**

Why? Because:
- **The last 10% of bugs take 50% of the time** (nonlinear convergence)
- **The last 10% of features require 50% of the integration work** (interface bugs are subtlest)
- **Measuring "percent complete" is nearly impossible** (lines of code written ≠ working system)

This creates the illusion of perpetual near-completion: "We're almost done, just a few more bugs to fix."

Brooks: "The last woe, and sometimes the last straw, is that the product over which one has labored so long appears to be obsolete upon (or before) completion."

## The Brutal Truth: Testing Takes Half the Time

Brooks's most controversial claim: **"Allow one-half of the schedule for testing."**

Why is this controversial? Because:
- It feels like an admission of incompetence
- It delays the "real work" (coding)
- It's hard to justify to stakeholders

Why is it necessary?
- **System bugs** (interface misunderstandings, integration failures) are qualitatively different from component bugs
- **Testing is debugging**, and debugging **does not have linear convergence**
- **Each bug fix has a 20-50% chance of introducing a new bug**

**The math:** If fixing a bug creates a new bug half the time, you don't converge quickly—you crawl.

## The Milestone Problem: Defining "Done"

Brooks: **"Milestones must be concrete, specific, measurable events, defined with knife-edge sharpness."**

**Bad milestones (fuzzy):**
- "Coding 90% complete"
- "Debugging 99% done"
- "Planning complete"

These can be declared "done" almost at will.

**Good milestones (sharp):**
- "Specifications signed by architects and implementers"
- "Source coding 100% complete, keypunched, entered into disk library"
- "Debugged version passes all test cases"

**Why sharp milestones matter:**

1. **They demark phases** (planning, coding, debugging) unambiguously
2. **They're verifiable** (no self-deception)
3. **They force honest status reporting**

Brooks: "If the milestone is fuzzy, the boss often understands a different report from that which the man gives."

**The service to the team:** Sharp milestones are not micromanagement—they're **clarity**. Fuzzy milestones are the real burden, because they create false hope and hidden slippage.

## The Data on Estimating Behavior

Brooks cites studies by King and Wilson showing:

1. **Estimates made and revised carefully every two weeks before an activity starts do not significantly change as the start time draws near**, no matter how wrong they ultimately turn out.

2. **During the activity, overestimates of duration come steadily down** as the activity proceeds (learning: "Oh, this is easier than I thought").

3. **Underestimates do not change significantly during the activity until about three weeks before scheduled completion** (denial: "We're still on track... we're still on track... OH NO").

**Implication:** People are bad at estimating, and they don't get better through wishful thinking. You need **external instrumentation** (milestones, metrics, test coverage) to reveal true status.

## The PERT Chart: Making Dependencies Visible

Brooks advocates **critical-path scheduling** (PERT charts) as essential:

**What it shows:**
- **Who waits for what** (dependencies)
- **What's on the critical path** (any slip here delays the end)
- **How much slack exists** (how much non-critical tasks can slip)

**Why it matters:**
- **Answers the excuse**: "The other piece is late anyway." (Maybe it's not on the critical path, so your slip still matters!)
- **Identifies hustle opportunities**: Where can we get ahead to create buffer?
- **Prevents invisible slippage**: Small slips compound; the chart makes this visible

**The preparation is the value:** "Laying out the network, identifying dependencies, and estimating legs all force a great deal of very specific planning very early in a project."

Brooks: "The first chart is always terrible, and one invents and invents in making the second one."

## Application to Agent Orchestration: Estimation Realities

For multi-agent systems, estimation problems are **worse than for traditional software** because:

**1. Non-determinism**
- LLM outputs vary across runs
- Probabilistic models don't guarantee behavior
- "Works 95% of the time" is not the same as "works deterministically"

**2. Latency Uncertainty**
- API calls to LLM providers have variable latency
- Rate limits, retries, and throttling add unpredictable delays
- External dependencies (web search, code execution) have their own latency profiles

**3. Token Budget Uncertainty**
- Input size varies (context depends on prior outputs)
- Output size varies (LLMs decide when to stop)
- Cost estimation requires assumptions about token consumption

**4. Failure Mode Complexity**
- LLM might refuse a task
- LLM might return malformed output
- LLM might hallucinate
- LLM might time out
- Each requires different recovery strategy (retry, escalate, abort, fallback)

**5. Interdependent Agents**
- Agent A's output quality affects Agent B's input quality
- Poor output from A → B takes longer, produces worse output → C fails
- Cascading degradation is hard to predict

**Estimating agent orchestration tasks requires:**

**A) Probabilistic Scheduling**
- Don't estimate "it will take 10 seconds"
- Estimate "p50 is 10 seconds, p95 is 30 seconds, p99 is 60 seconds"
- Schedule based on p95, not p50 (because failures are expensive)

**B) Token Budgets, Not Just Time**
- Track expected tokens per agent call
- Monitor actual tokens consumed
- Alert when budget exceeds estimate by >20%

**C) Failure Budget**
- Assume X% of agent calls will fail
- Plan for retries (2-3x time and cost)
- Have fallback paths (degraded output better than no output)

**D) Critical Path for Agent Chains**
- Map dependencies: Which agents must complete before others can start?
- Identify bottleneck agents (those on the critical path with high latency)
- Optimize or parallelize bottleneck agents

**E) Milestone Tracking**
- **Fuzzy**: "Agent chain is 90% debugged"
- **Sharp**: "Agent chain passes 50/50 test cases in test suite with <5% failure rate over 10 runs"

**F) Reality-Based Productivity**
- If you're using GPT-4, assume $X per task
- If you're using fine-tuned models, assume Y seconds per inference
- Don't assume "instant" or "free"—measure actual performance

## The Scheduling Trap: Adding Agents to Late Projects

Brooks's Law applies with special force to agent systems:

**If your agent orchestration is behind schedule, do NOT:**
- Add more agents to the DAG (increases coordination overhead)
- Increase parallelism without checking if the problem is parallelizable
- Add more handoffs between agents (each handoff is a failure point)

**Instead:**
- **Simplify the orchestration**: Can you remove agents? Combine steps?
- **Improve the bottleneck agent**: If one agent is slow, optimize it (better prompt, faster model, caching)
- **Reduce scope**: Can you defer features?
- **Extend the deadline**: Painful, but better than shipping garbage

## The Meta-Lesson: Honesty Over Optimism

Brooks's scheduling chapter is fundamentally about **the discipline of honest assessment**:

1. **Estimate pessimistically** (assume things will go wrong, because they will)
2. **Track ruthlessly** (sharp milestones, frequent checks)
3. **Report truthfully** (bad news early is better than disaster late)
4. **Resist pressure** (defend your estimates with "courteous stubbornness")
5. **Plan for slippage** (have buffer, quantize changes, version releases)

For agent systems, this means:
- **Instrument everything**: Log latency, token usage, failure rates
- **Dashboard key metrics**: p95 latency, cost per task, success rate
- **Review weekly**: Are actuals matching estimates? If not, why?
- **Don't hide problems**: If an agent is failing 20% of the time, say so early
- **Quantize improvements**: Don't tweak in production; test in staging, release in versions

The temptation is to believe "this time will be different." The data says: it won't. Plan accordingly.

Software is always "almost done" until it suddenly isn't. The only defense is measurement, milestones, and the courage to say "we're behind" when it's still recoverable.