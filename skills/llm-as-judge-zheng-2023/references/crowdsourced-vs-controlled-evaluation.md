# Two Modes of Ground Truth: Lessons from Controlled Expert vs. Crowdsourced Evaluation

## The Evaluation Ground Truth Problem

Every automated evaluation system faces a fundamental question: what is it calibrating against? The answer shapes everything — what biases get detected, what capabilities get measured, and what failures get missed.

The Zheng et al. paper introduces and validates two distinct approaches to ground truth collection, and their comparison illuminates principles that extend far beyond LLM evaluation into any complex system that needs to know how well it's performing.

---

## MT-Bench: Controlled Expert Evaluation

**Design**: 80 carefully crafted multi-turn questions across 8 categories (writing, roleplay, extraction, reasoning, math, coding, STEM, humanities). Human evaluators are primarily graduate students (expert-level). Each evaluator judges at least 20 random questions. Approximately 3,000 expert votes total.

**What "controlled" means here**:
- Questions are pre-designed to be challenging and differentiating
- Evaluators are screened for expertise
- The interface shows identical information to all evaluators
- Tie-breaking procedure is standardized (humans are shown GPT-4's judgment when they deviate)
- Categories are balanced to prevent domain-specific bias

**What MT-Bench can measure**:
- Performance on specific capability dimensions (math, coding, reasoning separately)
- Multi-turn instruction following
- Fine-grained differences between models on challenging tasks
- Category-wise strength profiles

**What MT-Bench cannot measure**:
- Real user intent distribution (the 80 questions may not match what users actually ask)
- Long-tail use cases and edge cases
- Natural variation in user phrasing and conversational style
- Models' behavior under adversarial or unexpected queries

**The expert labeler finding**: When human experts disagree with GPT-4, showing them GPT-4's reasoning causes them to find it "reasonable" in 75% of cases and to change their vote in 34% of cases. This bidirectional calibration — GPT-4 updating toward humans, humans updating toward GPT-4 — suggests that neither is definitively "correct" in ambiguous cases. The agreement ceiling (~81%) reflects the irreducible variance of subjective quality judgment.

---

## Chatbot Arena: Crowdsourced Wild Evaluation

**Design**: Users interact with two anonymous models simultaneously, asking any question of their choice. After the interaction, they vote for the preferred model. Model identities revealed after voting. No pre-defined questions. Approximately 30,000 votes over one month from 2,114 unique IPs.

**What "crowdsourced" means here**:
- Questions come from actual user intent, not researcher design
- Evaluators are self-selected (interested users, not screened experts)
- No control over question difficulty, category distribution, or evaluator quality
- The diversity is a feature, not a bug — it reflects real usage patterns

**What Chatbot Arena can measure**:
- Overall user preference in real deployment conditions
- Performance across the actual distribution of user queries
- Robustness to natural variation in question phrasing
- Long-tail performance (the tail of the query distribution matters for real products)

**What Chatbot Arena cannot measure**:
- Category-specific performance (STEM vs. writing vs. coding)
- Performance on specific challenging tasks
- Fine-grained capability differences (hard to isolate with random question distribution)
- Any evaluation within a bounded capability domain

**The complementarity in practice**: The paper shows that both benchmarks produce consistent model rankings at a coarse level (GPT-4 > GPT-3.5 > Claude > Vicuna-13B > ...) but diverge in fine-grained comparative analysis. MT-Bench's second turn shows that "proprietary models like Claude and GPT-3.5 are more preferred by humans compared to the first turn, meaning that a multi-turn benchmark can better differentiate some advanced abilities of models." Chatbot Arena would be unlikely to isolate this multi-turn effect cleanly.

---

## The Sampling Strategy for Crowdsourced Data

When using crowdsourced data for automated evaluation validation, the researchers sample 3,000 single-turn votes from 30,000 arena votes. Key decisions in this sampling:

1. **Single-turn only**: Multi-turn arena conversations introduce confounds (earlier turn quality affects later turn ratings). Isolating single turns makes the evaluation cleaner.

2. **Random sampling**: No cherry-picking. The full distribution of user queries is represented, including easy questions (where all models do well) and hard questions (where they diverge).

3. **Coverage of model pairs**: The sample covers all model pairs supported at the time, ensuring that the evaluation tests a range of quality gaps and capability profiles.

**For agent system evaluation**: When building a crowdsourced evaluation pipeline for WinDAGs agents, these design choices matter:
- Sample interactions randomly, not from "interesting" cases (selection bias)
- Include easy tasks alongside hard tasks (the full distribution)
- Ensure sufficient coverage of each agent being evaluated (minimum sample per agent)
- Consider separating single-turn from multi-turn evaluation for cleaner analysis

---

## The Agreement Statistics: What They Mean

The paper defines agreement carefully:

> "The agreement between two types of judges [is] the probability of randomly selected individuals (but not identical) of each type agreeing on a randomly selected question."

This is *not* the probability that the judge gets the "right" answer — it's the probability of concordance between two sources of judgment. The distinction matters:

- Human-human agreement: ~81% (non-tied votes)
- GPT-4 pairwise vs. human: ~85% (non-tied votes, sometimes exceeding human-human)
- GPT-4 single vs. human: ~84-85%

The paper notes that GPT-4's agreement with humans *sometimes exceeds* the human-human agreement baseline. This happens because GPT-4 is compared against any single human, while human-human agreement measures any two humans. GPT-4 may be closer to the *median* human judgment than any individual human is.

**Important caveat**: "Human-majority" vs. human agreement is higher (~90%) than individual human vs. individual human (~81%). GPT-4's 85% agreement is closer to the individual-human baseline than the human-majority baseline. There is still a gap between GPT-4 and the consensus.

---

## Implications for Multi-Agent System Evaluation

### The Dual Benchmark Principle

Any serious agent evaluation infrastructure should maintain two parallel tracks:

**Track 1 — Controlled benchmark**: Curated questions covering system's intended task domain, evaluated by expert reviewers or high-quality judge agents. Used for: regression testing, capability profiles, fine-grained analysis.

**Track 2 — Deployed interaction sampling**: Random samples from actual production interactions, evaluated by LLM judge. Used for: real-world preference monitoring, detecting distribution shift, identifying unexpected failure modes.

These tracks answer different questions. Track 1 answers "how good is the agent at X?" Track 2 answers "are users happy with the agent?"

### The Evaluation Escalation Pattern

Based on the agreement gradient finding (higher agreement for clearer quality gaps), evaluation resources should be allocated proportionally to uncertainty:

```
Level 1: Automated evaluation (fast, cheap) 
  → Confidence threshold met → Done
  → Confidence threshold not met → Escalate

Level 2: Automated evaluation with mitigation 
  (position swap + reference-guided + CoT)
  → Confidence threshold met → Done  
  → Still uncertain → Escalate

Level 3: Human expert review (slow, expensive)
  → Expensive, reserved for close calls and high-stakes decisions
```

The insight from the paper is that Level 1 is reliable when the quality gap is large. Escalation is needed only when it's close. This means most evaluations never reach Level 3.

### Detecting Evaluation System Drift

The Chatbot Arena model provides a blueprint for continuous evaluation calibration. Key features that make it drift-resistant:
1. Anonymous evaluation (users don't know which model they're rating, preventing reputation bias)
2. Continuous data collection (not a one-time benchmark)
3. Crowdsourced diversity (resistant to narrow optimization)
4. Model-agnostic design (new models can be added without redesigning the benchmark)

For production WinDAGs systems: implement periodic anonymized comparisons between agent versions, routing agent outputs to human evaluators without identifying the source agent. This prevents the evaluation system from becoming a target for narrow optimization.