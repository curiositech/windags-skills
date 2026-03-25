# The Gap Between Knowing and Doing: How ReAct Bridges Internal Knowledge and External Action

## The Two Knowledge Sources: Internal Models vs External Environments

A fundamental insight from ReAct is that intelligent systems have access to two distinct knowledge sources, each with different properties:

**Internal knowledge (model parameters)**: Vast, rapidly accessible, enables reasoning about patterns and relationships. But it's static (frozen at training time), potentially outdated, and prone to hallucination. Chain-of-thought reasoning exemplifies pure internal knowledge use—the model generates answers from learned patterns without external verification.

**External knowledge (environments, APIs, databases)**: More limited in scope, requires actions to access, introduces latency. But it's grounded in reality, can be up-to-date, and provides verifiable facts. Action-based systems exemplify pure external knowledge use—the model queries databases or APIs to retrieve current information.

The gap between knowing and doing emerges when systems try to use only one knowledge source. Pure reasoning (CoT) "knows" vast amounts but hallucinates 14% of the time on HotpotQA success cases and fails 56% of the time due to hallucination overall. Pure acting (Act) can "do" by retrieving real information but lacks the strategic reasoning to know what to retrieve or how to synthesize information across multiple retrievals.

## Case Study: Outdated Knowledge and Temporal Grounding

Figure 4 provides a compelling example of the knowledge-action gap. The question: "How many rooms are in the hotel that is home to the Cirque du Soleil show Mystere?"

**CoT's approach** (pure internal knowledge):
"Let's think step by step. The hotel that is home to the Cirque du Soleil show Mystere is Treasure Island. Treasure Island has 2,885 rooms, so the answer is 2,885."

This is plausible and authoritative-sounding. But it's wrong. The correct answer is 2,884.

Why the error? Likely the model's training data contains outdated information. Hotels renovate, room counts change. The model "knows" a fact from its training distribution, but that fact is no longer current.

**Act's approach** (pure external knowledge):
Successfully searches for "Cirque du Soleil show Mystere" and "Treasure Island Hotel," retrieving up-to-date information. But fails to synthesize the final answer because it lacks the reasoning to connect "Mystere is held at Treasure Island" with "Treasure Island has X rooms" to answer "how many rooms."

**ReAct's approach** (combined internal and external knowledge):
1. Internal reasoning: "I need to search Cirque du Soleil show Mystere, find the hotel it is in, then find the number of rooms in the hotel."
2. External action: Search[Mystere Cirque du Soleil]
3. Observation: "Mystère... Held in a custom theatre at the Treasure Island Hotel and Casino..."
4. Internal reasoning: "Mystere is held in a custom theatre at the Treasure Island Hotel and Casino. So I need to search Treasure Island Hotel and Casino next and find the number of rooms in the hotel."
5. External action: Search[Treasure Island Hotel and Casino]
6. Observation: "Treasure Island Hotel and Casino... with 2,884 rooms and suites..."
7. Internal reasoning: "Treasure Island Hotel and Casino has 2,884 rooms and suites. So the answer is 2,884."

ReAct succeeds because it uses internal knowledge for *strategy* (what to search, how to decompose the question) and external knowledge for *facts* (current room count). Neither alone is sufficient—you need reasoning to guide action and action to ground reasoning.

## The Confidence-Based Switching Strategy

The paper proposes two heuristics for deciding when to use internal vs external knowledge:

**CoT-SC → ReAct**: "When the majority answer among n CoT-SC samples occurs less than n/2 times (i.e. internal knowledge might not support the task confidently), back off to ReAct."

This is a confidence-based routing decision. If self-consistency sampling shows high agreement (>50% of samples give the same answer), the model's internal knowledge is probably reliable. If agreement is low, internal knowledge is uncertain—switch to grounded external interaction.

**ReAct → CoT-SC**: "When ReAct fails to return an answer within given steps, back off to CoT-SC."

This addresses ReAct's limitation: when external knowledge is insufficient (searches fail, information is missing, environments are uninformative), fall back to internal reasoning.

The combined approaches (Table 1) outperform either alone:
- HotpotQA: ReAct alone (27.4), CoT-SC alone (33.4), ReAct→CoT-SC (35.1), CoT-SC→ReAct (34.2)
- FEVER: ReAct alone (60.9), CoT-SC alone (60.4), CoT-SC→ReAct (64.6), ReAct→CoT-SC (62.0)

The best method is task-dependent, but both hybrid approaches substantially outperform single-mode approaches, especially with few CoT-SC samples (Figure 2).

## What This Means for Agent Architectures

The confidence-switching strategy suggests a general pattern for agent systems:

**Route based on confidence and task characteristics**:
- High confidence + logical reasoning task → use internal knowledge (CoT)
- Low confidence + factual question → use external knowledge (ReAct)
- High stakes + factual claims → always use external grounding
- Time-sensitive information → always use external retrieval
- Complex synthesis → combine both

This isn't a fixed architecture but an adaptive routing decision. The system must assess:
1. **How confident is internal knowledge?** (via self-consistency, calibration, or uncertainty estimation)
2. **What does the task require?** (fact retrieval vs logical deduction vs synthesis)
3. **What are the stakes?** (exploratory vs high-consequence decisions)
4. **What's the cost of external interaction?** (latency, API costs, rate limits)

For WinDAGs orchestration, this suggests: **skills should declare their knowledge requirements and confidence levels**. A skill that needs current information should signal "requires external grounding." A skill that's uncertain about its answer should signal "low confidence, consider alternative approach."

## The Provenance Problem: Tracking Knowledge Sources

A critical capability enabled by ReAct is **provenance tracking**—knowing where each fact comes from. In the Nikolaj Coster-Waldau example:

Claim: "Nikolaj Coster-Waldau worked with the Fox Broadcasting Company."

ReAct reasoning: "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company."

The quotation marks indicate this is not internal knowledge—it's quoted from an observation. A system could parse this to extract: 
- Claim: "worked with Fox Broadcasting Company"
- Evidence: "appeared in the 2009 Fox television film Virtuality"
- Source: Wikipedia search for "Nikolaj Coster-Waldau"

This enables several capabilities:

**Verification**: A human or another agent can check the source. Does Wikipedia actually say this? Is the inference valid?

**Updating**: If the source information changes, dependent conclusions can be invalidated and revised.

**Trust assessment**: Different sources have different reliability. Wikipedia is generally reliable but community-edited. Internal model knowledge might be outdated or hallucinated. APIs from authoritative sources (government databases, primary scientific literature) are highly trustworthy.

**Debugging**: When an answer is wrong, trace back through provenance to identify where the error originated. Was the source wrong? Was the extraction wrong? Was the reasoning wrong?

For agent systems, this suggests: **make provenance a first-class concept**. Every fact should carry metadata: source, retrieval time, confidence. Reasoning should explicitly cite sources, not just state conclusions.

## The Synthesis Challenge: Combining Multiple External Sources

ReAct demonstrates multi-hop reasoning that combines information from multiple external sources. The Colorado orogeny question requires:
1. Search "Colorado orogeny" → extract "eastern sector extends into High Plains"
2. Search "High Plains (United States)" → extract "rise in elevation from 1,800 to 7,000 ft"
3. Synthesize: "High Plains rise in elevation from 1,800 to 7,000 ft, so the answer is 1,800 to 7,000 ft."

This is non-trivial. The final answer doesn't appear in any single source—it requires connecting information across sources. Internal reasoning performs the synthesis: recognizing that "High Plains" from observation 1 should be the search target for step 2, and that the elevation range from observation 2 answers the original question about the area mentioned in observation 1.

Act alone struggles with this. It can retrieve both pieces of information but often fails to synthesize them. Without reasoning traces like "The eastern sector extends into High Plains. So I need to search High Plains and find its elevation range," the connection between observations is implicit and easily lost.

For agent systems, this suggests: **multi-source synthesis requires explicit reasoning about how sources relate**. Don't just accumulate observations—reason about what each observation contributes to the overall goal and how they connect.

## When Internal Knowledge Is Actually Better

The paper is careful to note that external grounding isn't always superior. CoT outperforms ReAct on HotpotQA (29.4 vs 27.4) despite ReAct's better grounding. Why?

1. **Reasoning flexibility**: CoT can formulate complex deductive chains without the structural constraint of alternating with actions.

2. **No search errors**: CoT doesn't fail due to uninformative or missing external information. It works entirely with internal knowledge, which is always "available."

3. **Efficiency**: CoT requires no external calls, reducing latency and cost.

The failure analysis clarifies the tradeoff: CoT has more hallucination errors but fewer reasoning errors. When the task requires complex logical reasoning over well-established facts, CoT's flexibility outweighs ReAct's grounding advantage.

This suggests: **use internal knowledge for deductive reasoning over established facts**. If the facts are reliably in the model's training data (mathematical axioms, common knowledge, logical relationships) and the task is primarily deductive, pure reasoning without external grounding can be more effective.

The key is knowing when facts are reliable. Temporal facts (current events, recent data), rare facts (specific numbers, obscure entities), and high-stakes facts (medical decisions, legal compliance) should always be grounded. Common knowledge and logical relationships can rely on internal knowledge.

## The Fine-Tuning Reversal: Learning to Bridge the Gap

An interesting finding: while ReAct underperforms CoT and Act in few-shot prompting with smaller models, it becomes the best method after fine-tuning with just 3,000 examples (Figure 3).

The paper's explanation: "teaching models to memorize (potentially hallucinated) knowledge facts" (CoT/Standard) is less generalizable than teaching "how to (reason and) act to access information" (Act/ReAct).

This reveals something fundamental: **the skill of bridging internal and external knowledge is more learnable and transferable than memorizing facts**. Once a model learns "when I need a fact, I should search for it; when I have facts, I should reason about them; when reasoning is uncertain, I should gather more information," this pattern generalizes across domains.

For agent systems, this suggests: **invest training resources in reasoning-acting patterns, not domain knowledge**. If you're building a medical agent, don't just fine-tune on medical facts (which will go out of date). Fine-tune on patterns like "search medical literature, extract relevant findings, reason about how they apply to this case." The pattern transfers; the facts don't.

## Transferable Principles for WinDAGs

1. **Route based on confidence and task requirements**: Internal knowledge for high-confidence deduction, external for facts and low-confidence scenarios.

2. **Track provenance for all facts**: Know what came from internal knowledge vs external sources.

3. **Design for multi-source synthesis**: Explicitly reason about how information from different sources connects.

4. **Use external grounding for temporal, rare, or high-stakes facts**: Don't trust model memory for anything that changes or matters critically.

5. **Enable confidence signaling**: Let agents declare when they're uncertain and need external validation.

6. **Learn reasoning-acting patterns, not facts**: Training should focus on *how to seek and use information*, not memorizing domain content.

7. **Make knowledge source transparent**: Users should see whether claims come from model knowledge or external verification.