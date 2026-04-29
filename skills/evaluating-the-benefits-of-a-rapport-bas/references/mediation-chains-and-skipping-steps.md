# Mediation Chains and the Danger of Skipping Steps: Lessons from the Rapport-Cooperation-Disclosure Model

## The Core Structural Finding

The structural equation model in Brimbal et al. (2021) reveals something that is intuitively obvious in retrospect but systematically violated in practice: the pathway from intervention to outcome passes through necessary intermediate states, and attempts to shortcut those intermediate states don't accelerate the process — they break it.

The specific mediation chain established in the paper is:

**Rapport Tactics → Perceived Rapport → Cooperation → Disclosure**

Each arrow represents a causal relationship. Each node represents a state that must be achieved before the next state becomes accessible. The paper is explicit about this: "rapport and trust-building tactics are less likely to directly influence information disclosure; instead, such tactics influence a subject's willingness to cooperate with an interviewer's questioning" (p. 57).

This means: if you try to skip from "rapport tactics" to "disclosure" without passing through "perceived rapport" and "cooperation," you will fail. Not because rapport tactics are weak, but because disclosure is downstream of cooperation, which is downstream of perceived rapport, which is the only thing rapport tactics directly create.

## The Mathematical Structure of Indirect Effects

The paper's structural equation model quantifies this mediation chain with specific path coefficients. Looking at Figure 4:

- Training → Evidence-Based Tactics: β = .88
- Evidence-Based Tactics → Perceived Rapport: β = .17
- Perceived Rapport → Cooperation: β = .87
- Cooperation → Disclosure: β = .29

The indirect effect of training on disclosure passes through all four steps. The total indirect effect (b = .28, p = .07, 95% CI [-.02, .57]) did not reach conventional statistical significance, while each individual step in the chain was significant.

The authors note: "The multiplicative derivation of indirect effects, particularly those involving multiple mediations, will necessarily lead to small observed effects" (p. 63). This is a mathematical fact: if each step has a modest effect, the product of multiple modest effects is a very small effect on the final outcome.

This has a profound implication for agent system design: **long causal chains are inherently fragile**. Each step introduces attenuation and uncertainty. A system that requires four sequential steps to produce an outcome, where each step has an 80% success rate, has only a 40.96% end-to-end success rate. The steps are not independent, so the calculation isn't exactly this simple, but the principle holds: long causal chains require each step to be highly reliable to produce reliable end-to-end outcomes.

## Why Practitioners Try to Skip Steps

In the accusatorial context, practitioners believe they are shortcutting to the outcome (confession/disclosure) by bypassing the intermediate steps (rapport, cooperation). The intuition is: why invest in relationship-building when you can go directly to the information?

The answer, empirically, is that you can't go directly to the information. The information is gated behind cooperation, which is gated behind perceived rapport. These gates cannot be bypassed — they can only be forced, and forcing them generates false outputs (false confessions, contaminated information) rather than true outputs.

But the practitioner feedback system doesn't reveal this. When an accusatorial interviewer forces a confession, they observe output — and output feels like success. They don't observe that the output is false (often). They don't observe the information that wasn't disclosed because the counterpart was managing resistance. They observe a reduced cycle time (no need to spend time building rapport) and apparent success (confession obtained). The anecdotal feedback system is precisely designed to reward step-skipping, even when step-skipping is producing inferior or false outputs.

## Step-Skipping in Agent Systems

Agent systems face analogous step-skipping temptations and analogous failure modes:

**Example 1: Skipping Task Decomposition**

A complex task is assigned to an agent. The correct path is:
1. Understand the full scope and constraints of the task
2. Decompose into tractable sub-tasks
3. Identify dependencies and sequencing requirements
4. Execute sub-tasks in appropriate order
5. Integrate outputs
6. Verify integration

Skipping to step 4 (execute) without steps 1-3 produces output that looks like progress but may be solving the wrong sub-problems, in the wrong order, without accounting for dependency constraints. The output is confident and concrete — it looks like success — but the end-to-end result fails.

**Example 2: Skipping Verification**

A research task requires:
1. Query sources
2. Evaluate source reliability
3. Synthesize compatible information
4. Identify contradictions
5. Resolve contradictions
6. Generate summary with appropriate uncertainty

Skipping steps 2-5 produces a fast summary that looks authoritative but may contain unresolved contradictions, unreliable sources, or false synthesis. The output is clean and confident — the markers of apparent success — but the underlying quality is poor.

**Example 3: Skipping Rapport in Multi-Agent Coordination**

In a multi-agent system where Agent A needs information from Agent B:
1. A establishes that B has the relevant information
2. A signals the purpose and context of the request to B
3. B assesses the request as legitimate and within its authorized output scope
4. B generates the relevant output
5. A receives and processes the output

Skipping step 2 (context/purpose signaling) causes B to assess the request without the context that would clarify its legitimacy, potentially leading to a refusal or a minimal response. Skipping step 3 (B's assessment) by forcing output through authority signals may produce an output that B would not have generated with full context — the equivalent of a false confession.

## Designing for Mediation Chains: The Architecture of Sequential Commitment

The lesson from the rapport-cooperation-disclosure chain is not to avoid long causal chains — sometimes they are unavoidable — but to design them explicitly and manage them appropriately. This means:

**1. Map the full mediation chain before execution**

For any complex task, identify the full sequence of intermediate states that must be achieved before the final outcome becomes accessible. Make each intermediate state explicit, measurable, and verifiable before proceeding to the next step.

In the rapport study context: don't proceed to information elicitation before verifying that perceived rapport and cooperation have been achieved. In agent system context: don't proceed to integration before verifying that each sub-component output is valid and compatible.

**2. Invest in reliability at each step, not just end-to-end outcome**

Because end-to-end reliability is the product of per-step reliabilities, improving any step in the chain improves end-to-end performance. But the marginal return on investment is highest for the weakest step (the most reliable step contributes less to the overall failure rate than the least reliable step).

The training study implicitly follows this logic: the largest training effect was on the most foundational step (productive questioning, d = 1.10), which is the step that underlies all others. Improving the foundation has multiplied effects downstream.

**3. Build in verification checkpoints between steps**

The paper describes interviewers using summaries — "offering back a concise, yet detailed, encapsulation of what the individual has said" (p. 57) — as transition devices between phases of the interview. This is not just politeness; it is a verification checkpoint. The summary gives the counterpart an opportunity to correct errors before the conversation proceeds based on those errors.

In agent system design, analogous checkpoints:
- After task decomposition: verify that the sub-task list covers the full scope and captures dependencies before beginning execution
- After each sub-agent output: verify that the output addresses the intended sub-task before using it as input to the next step
- After integration: verify that the integrated output is internally consistent before delivering it as final output

**4. Account for cascade failures**

In a mediation chain, failure at any step stops all downstream steps. Unlike additive processes (where a failure reduces the final output proportionally), mediation chains often exhibit threshold effects: below a certain level of rapport, cooperation doesn't occur at all; below a certain level of cooperation, disclosure doesn't occur at all.

This means that partial success at an intermediate step may produce zero output, not reduced output. Agent systems should be designed to detect these threshold failures and respond with step repair (retry the failed intermediate step with different tactics) rather than proceeding with degraded input.

## The Direct vs. Indirect Pathway Distinction

The paper distinguishes between tactics that operate through the rapport-cooperation-disclosure mediation chain (indirect pathway) and tactics like the Cognitive Interview's context reinstatement that operate through a direct pathway to increased disclosure without requiring high cooperation. Both pathways exist and both can be useful.

This distinction has direct implications for agent design:

**Direct pathway tactics** (context reinstatement, structured recall prompts, explicit framing of the information retrieval task) work even with low cooperation/rapport because they operate on memory and information organization directly.

**Indirect pathway tactics** (rapport building, trust signaling, autonomy support) work by first increasing the counterpart's willingness to engage, which then amplifies the effect of direct elicitation tactics.

The optimal strategy combines both: establish a sufficient rapport baseline (enough to prevent active resistance), then apply direct elicitation tactics that maximize the information yield from the available cooperation. Investing heavily in rapport-building with an already-cooperative counterpart yields diminishing returns; investing heavily in direct elicitation with a resistant counterpart gets blocked at the cooperation gate.

**For agent systems:**
- With cooperative sub-agents or systems: invest primarily in query structure quality (Layer 1 productive questioning, direct pathway)
- With resistant or constrained systems: invest first in establishing the cooperative relationship (Layers 2 and 3, indirect pathway), then apply structured queries
- Assess cooperation level as a diagnostic before choosing pathway

## The 17% and 9% Explained Variance: What the Model Doesn't Capture

The structural equation model explained 17% of variance in cooperation and 9% in disclosure. This leaves 83% and 91% unexplained. The paper acknowledges contextual factors beyond interviewer tactics as contributors: "contextual factors that are independent of an interviewer's tactics can influence the reporting of information by interview subjects" (p. 63).

This is a critical boundary condition for the entire framework: the rapport-cooperation-disclosure chain is *one* pathway among many that determine whether information is disclosed. It is a controllable pathway (because rapport tactics are trainable and deployable) but not a dominant one in variance terms.

For agent systems, this means: improving the rapport and cooperation pathway will help, but it will not be sufficient in isolation. The full picture of what determines information yield includes:
- The counterpart's actual knowledge (can't disclose what isn't known)
- Structural constraints on disclosure (can't disclose what is forbidden or technically impossible)
- The quality of the query structure (determines how much of the available willing cooperation is converted to actual disclosure)
- The counterpart's assessment of their own interests (rational self-protection)
- Contextual factors (environment, timing, framing of the overall interaction)

Optimizing the rapport pathway is valuable but should be pursued alongside, not instead of, attention to query structure quality and contextual factors.