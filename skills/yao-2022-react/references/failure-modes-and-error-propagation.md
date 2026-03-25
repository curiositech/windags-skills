# Failure Modes and Error Propagation: What ReAct Reveals About Complex System Failures

## The Three Failure Categories: A Taxonomy for Agent Systems

The ReAct paper's systematic failure analysis (Table 2) provides a taxonomy that every agent system should monitor. Across 50 randomly sampled trajectories from HotpotQA, the authors identify:

**Reasoning errors (47% of ReAct failures)**: Wrong reasoning traces, including failing to recover from repetitive steps. The model gets stuck in loops, reasoning "Now I need to do X" but then repeating action Y, unable to recognize the loop.

**Search result errors (23% of ReAct failures)**: The search returns empty or doesn't contain useful information. The environment fails to provide the grounding needed for reasoning to proceed.

**Hallucination (0% of ReAct failures, 56% of CoT failures)**: Generating plausible but false information. CoT's dominant failure mode—more than half of its errors—is making up facts that aren't in its training data or misremembering details.

**Label ambiguity (29% of ReAct failures, 28% of CoT failures)**: The prediction is arguably correct but doesn't match the label precisely (e.g., predicting "Israeli" when the label is "Israel-American").

This taxonomy is crucial because **different failure modes require different interventions**. Hallucination requires grounding in external sources. Reasoning errors require better action selection or loop detection. Search errors require better environment design. Label ambiguity requires better evaluation metrics.

## Hallucination: The Failure Mode That Grounding Eliminates

The most striking finding: ReAct reduces hallucination to virtually zero (0% of failures) while CoT suffers 56% hallucination failure rate and 14% false positive rate vs ReAct's 6%.

Why? CoT relies entirely on internal knowledge. When asked "What was the first year a scientific journal published by an organization located in the Bronx was published?", CoT reasons: "Let's think step by step. The first year a scientific journal published by an organization located in the Bronx was published was 1916." This sounds authoritative but is wrong (correct answer: 1909). The model is generating plausible facts from distributional patterns in training data, not retrieving verified information.

ReAct forces external grounding. Every fact claim must be supported by an observation from Wikipedia. If the model wants to claim Nikolaj Coster-Waldau worked with Fox, it must first search for him and observe: "He appeared in the 2009 Fox television film Virtuality." The reasoning then explicitly references this observation: "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company."

This is **provenance tracking**—every fact has a source. For agent systems, this suggests:

1. **Require external evidence for factual claims**: Don't let agents make assertions without grounding. Design workflows where factual statements must cite observations.

2. **Log observation-reasoning chains**: Store not just "what did the agent claim" but "what observation supports this claim." This enables post-hoc verification and debugging.

3. **Distinguish internal reasoning from external facts**: Make it clear in agent outputs what's derived from model knowledge (logical deduction, commonsense inference) vs external sources (API responses, database queries).

4. **Use grounding for high-stakes decisions**: When accuracy matters—security audits, compliance checks, financial decisions—force interaction with authoritative sources rather than relying on model memory.

## Reasoning Loops: The Cascading Failure of Lost Context

Reasoning errors manifest primarily as repetitive action loops where "the model repetitively generates the previous thoughts and actions." The agent loses track of what it's already tried and fails to reason about "what the proper next action to take and jump out of the loop."

Example failure pattern from ALFWorld Act-only trajectory:
```
> take knife 1 from countertop 2
You pick up the knife 1 from the countertop 2.
> clean knife 1 with sinkbasin 1
Nothing happens.
> go to countertop 3
...
> take knife 2 from countertop 3
Nothing happens.
> go to countertop 2
...
> take knife 1 from countertop 2
Nothing happens.  # Already holding it!
> clean knife 1 with sinkbasin 1
Nothing happens.  # Not at sinkbasin!
[Repeats indefinitely]
```

The agent doesn't recognize it's already holding knife 1, so it tries to take it again. It doesn't recognize it's not at the sinkbasin, so cleaning fails. Without reasoning traces to maintain context, the agent has no memory of subgoal progress or failure causes.

ReAct addresses this through explicit progress tracking: "Now I take a knife (1). Next, I need to go to sinkbasin (1) and clean it." This thought makes the subgoal explicit. When the model generates the next action, it can reason: "I've already taken the knife. The current subgoal is to go to sinkbasin. Therefore, the next action should be navigation, not another take command."

For agent systems, this suggests:

**1. Detect repetition as a failure signal**: If an agent performs the same action multiple times with identical failures, intervention is needed. The system has lost its strategic thread.

**2. Maintain explicit state in reasoning**: Don't just track action history—track "subgoals completed," "subgoals active," "attempts failed." Make this state visible in the reasoning context.

**3. Force reflection on failure**: When an action fails, require the agent to reason about *why* before trying again. "Action X failed. This might be because [enumerate possibilities]. I should try [alternative approach]."

**4. Implement loop-breaking heuristics**: After N repetitions or failures, escalate to a different reasoning strategy, or prompt for human input.

## Search Errors: When Environment Quality Limits Agent Performance

23% of ReAct failures come from "search returns empty or does not contain useful information." This is distinct from reasoning failures—the agent's strategy is sound, but the environment doesn't provide the grounding needed to proceed.

Example: When searching for "Front Row" (a software program), the Wikipedia API returns "Could not find [Front Row]. Similar: ['Front Row Seats to Earth', 'Front Row Motorsports', 'Front Row (software)'...]" If the agent doesn't recognize "Front Row (software)" as the correct match and instead searches "Front Row software," it might eventually succeed—but it might also give up or search tangentially related terms.

The paper notes: "Non-informative search, which counts for 23% of the error cases, derails the model reasoning and gives it a hard time to recover and reformulate thoughts."

This highlights: **agent capability is bounded by environment quality**. No amount of clever reasoning can overcome APIs that return irrelevant data, databases with missing information, or tools with poor discoverability.

For agent systems, this suggests:

**1. Invest in environment design, not just agent intelligence**: A simple, reliable API with comprehensive coverage enables more agent success than a complex, unreliable API with sparse data.

**2. Design observations to be actionable**: Don't just return "not found"—return similar matches, suggestions, or explanatory context. The Wikipedia API's "Similar: [...]" feature enables recovery from failed searches.

**3. Provide feedback on search quality**: Let agents know when observations are low-confidence or incomplete. An observation "I found 3 results but none are highly relevant" is more useful than silently returning weak matches.

**4. Monitor environment errors separately from agent errors**: Track "how often do API calls fail" and "how often do API results contain the information agents need." These metrics reveal whether performance bottlenecks are agent-side or environment-side.

## Error Propagation: How Single Failures Cascade

A crucial observation: errors propagate differently in ReAct vs CoT due to their different grounding.

**CoT error propagation**: A single hallucinated fact can corrupt an entire reasoning chain. If the model incorrectly believes "Reign Over Me was made in 2010" (it was 2007), all subsequent reasoning based on this fact inherits the error. There's no mechanism to detect or correct the hallucination—the model doesn't know it's wrong.

**ReAct error propagation**: Errors can still propagate, but they're more constrained. If a search fails to find the right entity, subsequent reasoning is based on incomplete information—but at least the incompleteness is observable. The model sees "Could not find X" and can reason about how to proceed: try alternative search terms, make partial inferences, or report insufficient information.

The key difference: **observability of error state**. In CoT, errors are silent (hallucinations look like valid facts). In ReAct, errors are visible (failed searches, missing information, unexpected observations).

For agent systems, this suggests:

**1. Make error states observable**: When an action fails, don't hide it—make the failure visible to the reasoning process. "API returned 404" is more useful than silently returning empty results.

**2. Design for graceful degradation**: When information is incomplete, let agents reason about "what can I infer from partial information" rather than forcing them to pretend completeness.

**3. Use checkpoints in long reasoning chains**: Periodically verify key facts or assumptions before proceeding. In a multi-agent workflow, have downstream agents validate upstream claims rather than trusting them blindly.

**4. Log error propagation paths**: When a final answer is wrong, trace back through the reasoning-action chain to identify where the error originated. Was it a hallucination, a failed search, a reasoning mistake, or a label ambiguity?

## The Flexibility-Reliability Tradeoff

ReAct has more reasoning errors (47%) than CoT (16%) because "the structural constraint also reduces its flexibility in formulating reasoning steps." Forcing alternation between reasoning and acting constrains what reasoning can express.

CoT can engage in multi-step deductive chains: "If A then B. If B then C. Therefore if A then C." It can explore hypotheticals and counterfactuals. ReAct's reasoning must be tied to observations and action choices—it's more constrained.

The tradeoff: **structure increases reliability (reduces hallucination) but decreases flexibility (increases reasoning errors)**. Neither extreme is optimal. The best approach combines both:

- Use ReAct's structured reasoning-acting when grounding in facts is critical
- Use CoT's free reasoning when logical deduction matters and facts are established
- Switch between them based on task requirements and confidence

For agent systems, this suggests: **don't impose uniform reasoning structure across all tasks**. Some tasks need tight grounding (fact-checking, information retrieval), others need flexible reasoning (mathematical proof, creative synthesis). Design routing logic that selects the appropriate reasoning mode.

## Detecting Failure Before Completion: Early Warning Signals

The failure mode taxonomy suggests monitoring signals:

**For hallucination risk**: 
- Absence of cited observations supporting factual claims
- High confidence on rare facts or specific numbers
- Contradictions between internal reasoning and external observations

**For reasoning loop risk**:
- Repeated actions with identical failures
- Subgoals that remain active across multiple steps without progress
- Actions that don't align with stated current subgoal

**For search error risk**:
- Observations returning "not found" or empty results
- Low overlap between search terms and observation content
- Multiple search reformulations without improvement

**For error propagation risk**:
- Long reasoning chains without external validation
- Key facts established early that later reasoning depends on
- Branching points where errors could propagate to multiple downstream steps

Monitoring these signals enables early intervention before failures cascade to incorrect final answers.

## Transferable Principles for WinDAGs

1. **Classify failures by type** (hallucination, reasoning error, environment error, ambiguity) to guide intervention.
2. **Use external grounding to eliminate hallucination** in high-stakes decisions.
3. **Detect repetition loops as reasoning failures** and implement breaking mechanisms.
4. **Invest in environment quality** as much as agent intelligence—observations determine reasoning limits.
5. **Make error states observable** rather than hiding failures.
6. **Choose reasoning structure based on task needs**: grounded for facts, flexible for logic.
7. **Monitor early warning signals** for each failure mode to enable intervention before cascade.