# Uncertainty and Confidence in Agent Decision-Making: When to Act vs. When to Reason

## The Confidence-Based Switching Heuristic

One of ReAct's most practically significant contributions is demonstrating when to use internal reasoning vs. external action based on confidence measures. The paper proposes two switching heuristics:

**CoT-SC → ReAct**: "When the majority answer among n CoT-SC samples occurs less than n/2 times (i.e. internal knowledge might not support the task confidently), back off to ReAct."

This uses self-consistency as a proxy for confidence. If you sample 21 reasoning traces and 15 give answer A while 6 give other answers, the 71% agreement suggests high confidence. If answers are split 8-7-6 across three options, the 38% maximum agreement suggests low confidence—the model's internal knowledge doesn't reliably support any answer.

Low confidence triggers switching from pure internal reasoning to grounded external interaction. The logic: when uncertain, gather more information before committing to an answer.

**ReAct → CoT-SC**: "When ReAct fails to return an answer within given steps, back off to CoT-SC."

This addresses ReAct's failure mode: when external knowledge sources are insufficient (searches return nothing, APIs are unavailable, information doesn't exist), the agent can get stuck. After a threshold number of unsuccessful retrieval attempts, fall back to making the best inference from internal knowledge.

The combined approaches (Table 1) outperform either alone, and Figure 2 shows they're especially effective with few samples—reaching CoT-SC performance with 21 samples using only 3-5 samples when combined with ReAct.

## Measuring Uncertainty in Agent Systems

The self-consistency approach (sampling multiple reasoning traces and checking agreement) is one way to estimate uncertainty. Other approaches agent systems should consider:

**1. Token-level probability scores**: Language models assign probabilities to generated tokens. Low probability on key claims suggests uncertainty. If the model generates "The capital is Paris" with token probabilities [0.95, 0.92, 0.88, 0.97], that's high confidence. If it generates "The population is 2.8 million" with [0.62, 0.45, 0.58, 0.71, 0.39], that's low confidence—the model is uncertain about each number.

**2. Semantic consistency across rephrasings**: Ask the same question multiple ways. If answers are consistent ("capital of France" = "France's capital city" = "main city of France"), confidence is high. If answers vary, confidence is low.

**3. Consistency between reasoning and answer**: If the reasoning trace supports a different answer than the final answer given, that's a red flag. Example: Reasoning says "1844 < 1989, so Arthur's Magazine came first" but answer is "First for Women"—inconsistency suggests low confidence or reasoning error.

**4. Presence of hedging language**: When models are uncertain, they hedge: "It seems likely that...", "Probably...", "Based on common patterns...". Confident statements are more direct: "The answer is X." Detecting hedging language in reasoning traces signals uncertainty.

**5. Factual specificity**: Specific facts ("founded in 1844") suggest higher confidence than vague statements ("founded in the mid-19th century"). Vagueness may indicate the model is uncertain about precise details.

For agent systems, these signals should influence routing decisions: high-confidence tasks can proceed with internal reasoning, low-confidence tasks should invoke external verification.

## The Cost-Benefit Analysis of External Grounding

External grounding (ReAct) has costs that internal reasoning (CoT) doesn't:

**Latency**: API calls take time. Wikipedia searches, database queries, web scraping—each adds milliseconds to seconds. For time-sensitive tasks, this matters.

**API costs**: Many external data sources charge per call. GPT-4 API calls, specialized data APIs, paid research databases—costs accumulate with heavy use.

**Rate limits**: External services limit request rates. An agent making thousands of queries might hit rate limits, forcing delays or failures.

**Reliability**: External services have uptime < 100%. Network issues, API outages, service degradation—all can cause external grounding to fail when internal reasoning would have succeeded.

**Error rates**: External sources aren't perfectly reliable. Wikipedia can have errors, databases can have stale data, search results can be misleading. While generally more reliable than model hallucination, external sources aren't ground truth.

These costs must be weighed against benefits:

**Factual grounding**: ReAct reduces hallucination to near-zero (0% in the study vs. 56% for CoT).

**Up-to-date information**: External sources provide current data; model knowledge is frozen at training time.

**Verifiability**: External sources can be audited; internal reasoning cannot.

**Domain coverage**: External sources may cover rare facts or specialized domains not well-represented in training data.

The optimal decision depends on task characteristics:

| Task Type | Best Approach | Rationale |
|-----------|---------------|-----------|
| Current events | External (ReAct) | Model knowledge is outdated |
| Mathematical reasoning | Internal (CoT) | No external source needed, pure logic |
| Rare/specialized facts | External (ReAct) | Unlikely to be in training data reliably |
| Common knowledge | Internal (CoT) | Well-represented in training, faster |
| High-stakes decisions | External (ReAct) | Need verifiability and accuracy |
| Time-sensitive queries | Internal (CoT) | Latency matters more than perfect accuracy |
| Logical deduction | Internal (CoT) | External sources don't help with inference |
| Fact verification | External (ReAct) | Purpose is to check facts against sources |

## Uncertainty as a First-Class Signal in Orchestration

For DAG-based agent orchestration, uncertainty should be a first-class signal that affects routing:

**1. Confidence thresholds for routing**: Skills should return not just answers but confidence scores. Downstream routing decisions use these scores:
```
if confidence > 0.8:
    return answer directly
elif confidence > 0.5:
    validate with external source
else:
    escalate to human review or gather more information
```

**2. Uncertainty-aware skill composition**: When composing skills in a DAG, high-uncertainty outputs from one skill trigger additional validation skills. A research skill that returns low-confidence findings might trigger a fact-checking skill or multiple-source verification.

**3. Adaptive sampling**: Use confidence to decide how many samples to generate. High-confidence tasks need only one reasoning trace. Low-confidence tasks benefit from multiple samples and self-consistency voting.

**4. Human-in-the-loop triggers**: Uncertainty above a threshold triggers human review. Rather than failing or guessing, the system signals "I'm uncertain about X, please advise."

**5. Cascading confidence**: In multi-step reasoning, track confidence at each step. If early steps have low confidence, downstream inferences inherit that uncertainty—don't make high-confidence final claims based on low-confidence premises.

## The Self-Consistency Paradox: When Agreement Doesn't Mean Correctness

Self-consistency is a useful confidence proxy but not perfect. The paper shows CoT-SC (self-consistency with 21 samples) significantly outperforms single-sample CoT, suggesting agreement correlates with correctness.

But there are failure modes:

**Consistent hallucination**: If the model's training data contains a widespread error, all samples might agree on the wrong answer. Self-consistency measures internal coherence, not external correctness.

**Mode collapse**: Sampling from a language model with temperature 0.7 introduces randomness, but the model might still have strong priors that dominate all samples. If 95% of probability mass is on answer A, all 21 samples will choose A even if it's wrong.

**Semantic variation**: Different phrasings of the same answer might be counted as disagreement. "Paris," "The capital is Paris," and "It's Paris" are the same answer but might not match exactly in self-consistency voting.

For agent systems, this suggests:

**1. Combine self-consistency with external validation**: Use agreement as an initial filter, but validate high-stakes or low-agreement answers externally.

**2. Semantic similarity, not exact match**: When checking consistency, use semantic similarity (embeddings, paraphrase detection) not string matching.

**3. Calibration**: Test whether self-consistency correlation with correctness holds on your domain. Some domains might need higher agreement thresholds than others.

**4. Diverse sampling**: Ensure sampling diversity by using higher temperature, different prompts, or different model initializations. Avoid mode collapse where all samples are near-identical.

## Graceful Degradation: Handling Irreducible Uncertainty

Sometimes uncertainty cannot be resolved. External sources have no information, multiple sources conflict, or the question is genuinely ambiguous.

ReAct demonstrates graceful degradation through the "NOT ENOUGH INFO" option in FEVER. When the model searches for information to verify a claim but finds insufficient evidence, it explicitly states this rather than guessing:

"The song peaked at number two on the Billboard Hot 100 in the United States, but not sure if it was in 2003." → Answer: NOT ENOUGH INFO

This is preferable to hallucinating a confident answer. For agent systems:

**1. Make "I don't know" a valid response**: Systems should be allowed to report insufficient information rather than forced to guess.

**2. Distinguish types of uncertainty**: 
   - "I don't have information" (retrievable externally)
   - "Information doesn't exist" (question is unanswerable)
   - "Information is conflicting" (sources disagree)
   - "Question is ambiguous" (needs clarification)

**3. Provide partial answers**: "I found X and Y but not Z" is more useful than refusing to answer because Z is missing.

**4. Suggest next steps**: "I couldn't find this information in Wikipedia, but it might be in specialized databases" guides users toward resolution.

## The Temperature-Confidence Relationship

The paper uses temperature 0.7 for CoT-SC sampling to get diversity. Temperature controls randomness in token selection:
- Temperature 0 (greedy): Always pick highest-probability token → deterministic, no diversity
- Temperature 1 (neutral): Sample from true distribution → moderate diversity
- Temperature >1 (high): Flatten distribution → high diversity, potentially incoherent

The temperature-confidence relationship:

**Low temperature (0-0.3)**: 
- Pros: More consistent, higher coherence, reflects model's strong beliefs
- Cons: No diversity for self-consistency, mode collapse

**Medium temperature (0.5-0.9)**:
- Pros: Good diversity for self-consistency while maintaining coherence
- Cons: Moderate randomness might introduce some inconsistency

**High temperature (>1)**:
- Pros: Maximum diversity, explores unlikely paths
- Cons: May generate incoherent or contradictory responses

For uncertainty estimation via self-consistency, medium temperature (0.6-0.8) is optimal. It provides diversity to measure agreement without sacrificing coherence.

## Transferable Principles for WinDAGs

1. **Use self-consistency as a confidence proxy**: Sample multiple reasoning traces, measure agreement as uncertainty signal.

2. **Route based on confidence**: High-confidence internal reasoning, low-confidence external grounding.

3. **Make uncertainty a first-class signal**: Skills should return confidence scores that affect downstream routing.

4. **Implement confidence thresholds**: Define levels that trigger different actions (proceed, validate, escalate).

5. **Allow "I don't know" responses**: Forcing guesses under uncertainty creates unreliable outputs.

6. **Combine multiple uncertainty signals**: Self-consistency, hedging language, specificity, reasoning-answer consistency.

7. **Balance costs and benefits**: External grounding has latency and cost; use it when accuracy justifies these costs.

8. **Calibrate for your domain**: Test whether uncertainty measures correlate with correctness in your specific tasks.