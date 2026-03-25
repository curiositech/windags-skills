# Stages of Expertise Acquisition: What They Mean for Agent Capability Design

## The Expertise Spectrum

One of the most important contributions of the cognitive systems engineering research community is a detailed, empirically grounded account of how expertise develops — and what distinguishes different levels of proficiency. This account, synthesized from research by Chi, Glaser, and Farr (1988), Ericsson and Smith (1991), Hoffman (1992), and Shanteau (1992), among others, has profound implications for how AI agent systems should be designed, evaluated, and deployed.

The central finding: expertise is not a binary property (expert vs. non-expert) but a continuous dimension with qualitatively different performance characteristics at each stage. The progression from novice to expert involves not just accumulation of more knowledge but fundamental reorganization of how knowledge is structured and applied.

## The Stages of Proficiency

The classic model (drawing on Dreyfus and Dreyfus, and developed through cognitive research) identifies five stages, though the boundaries are continuous rather than sharp:

**Novice**: Performance is governed by explicit rules applied to explicit features. The novice learns "if you see X, do Y" and applies these rules literally, without contextual interpretation. Performance is slow, requires conscious attention, and is brittle in the face of novel conditions. The novice needs rules because they lack the situational knowledge to exercise judgment.

**Advanced Beginner**: Performance remains rule-governed but rules become more sophisticated, incorporating aspects of situational context. The advanced beginner begins to recognize patterns that don't fit the simple rules and starts building a library of "maxims" — contextual rules that apply in specific types of situations.

**Competent**: The competent performer has enough situational knowledge to set goals and plan hierarchically. Performance becomes more efficient as some processes become automatic. The competent performer feels responsible for outcomes in a way the novice does not — which is both motivating and stressful, because the competent performer sees the complexity of what can go wrong.

**Proficient**: Situations are perceived holistically rather than as collections of features. The proficient performer "sees" what type of situation they are in and responds appropriately, with deliberate decision-making reserved for the choice of action rather than the reading of the situation. This is the beginning of the pattern recognition that Klein's RPD model describes.

**Expert**: Performance is largely intuitive — the expert acts, often without being able to articulate why, because the action was directly triggered by a rich situational recognition. Explicit rule-following feels laborious and unnatural. The expert has extensive experience across many cases, has developed a rich taxonomy of situation types with associated responses, and can reliably distinguish when a situation is "one of those" (calling for a standard approach) from when it is genuinely novel (calling for deliberate reasoning).

Shanteau (1992) adds an important nuance: expertise is domain-specific. Someone who is an expert in one domain is a novice in another. And the conditions under which expertise is possible vary: domains where feedback is reliable, where the environment is relatively stable, and where there are many opportunities for practice and error correction are those where genuine expertise can develop. Domains where feedback is delayed, ambiguous, or rare tend to produce practitioners who believe they are expert but actually remain at competent or proficient levels.

## Differences in Knowledge Structure

The difference between novice and expert is not just "more rules" — it is a fundamental difference in how knowledge is organized.

**Novices** represent problems in terms of their surface features — the literal elements that are present. A novice chess player sees "a bishop on square d5." A novice programmer sees "a for loop with a counter variable."

**Experts** represent problems in terms of their deep structure — the underlying principles and relationships that determine what is important. The expert chess player sees "a strong outpost that controls the center and threatens a knight fork." The expert programmer sees "a linear scan that could be replaced by a hash lookup to improve asymptotic complexity."

This difference in representation has cascading effects on everything:
- Experts notice different things (the deep-structure features rather than the surface features)
- Experts group information differently (into meaningful chunks rather than individual elements)
- Experts retrieve information differently (by deep structure patterns, so that seeing one feature activates a whole cluster of associated knowledge)
- Experts generate solutions differently (by recognizing the situation type and retrieving associated solutions rather than constructing solutions from scratch)

The knowledge reorganization from novice to expert representation typically requires extensive experience with many cases across the full range of variability in the domain. It cannot be shortcut by teaching principles alone — the reorganization requires something like supervised practice with feedback.

## What This Means for Agent System Design

### Agents Exist at Different Proficiency Levels — and Should Know It

Not all agents in a system have the same level of competence in a given domain. Some have been trained on extensive case libraries with rich feedback; others have minimal relevant training. Agent systems should represent and reason about the proficiency levels of their components, and route tasks accordingly.

A task that requires expert pattern recognition (identifying subtle anomalies in complex data, making nuanced judgment calls about ambiguous evidence) should be routed to agents with demonstrated competence in that specific domain — not to agents that are generally capable but lack domain-specific training.

More importantly: agents should have accurate models of their own proficiency level. An agent that believes it is expert when it is actually novice is more dangerous than an agent that knows it is novice. Self-awareness about proficiency limits should drive escalation behavior: when an agent encounters a situation that exceeds its competence level, it should recognize this and escalate rather than generating a confident but unreliable output.

### Design Skills with Stage-Appropriate Support

A single skill interface that works identically for novice-level and expert-level use cases will do neither well. Skills should be designed with different support modes:

- **Novice mode**: More explicit scaffolding, step-by-step guidance, with checks that ensure the basic conditions for the action are met before proceeding
- **Expert mode**: Fast, direct invocation with minimal overhead, trusting that the calling agent has made the appropriate situational assessment

The skill interface should enable callers to specify which mode they need, or the skill should be able to infer from context which mode is appropriate.

### Case Libraries as the Primary Knowledge Representation

The research on expertise development makes clear that case-based knowledge is more powerful than rule-based knowledge for complex domains. Experts perform well not primarily because they know more rules but because they have experienced more cases and have developed richer situational recognition as a result.

Agent systems should therefore prioritize **case libraries** as a knowledge representation mechanism — not just for retrieval-augmented generation (finding similar past cases to inform current responses) but for *capability development*. Training on diverse, well-annotated cases with clear outcomes is the functional equivalent of the expert's accumulated experience.

The annotation matters enormously. Cases annotated only with "this is the correct answer" produce agents that can reproduce outputs in similar situations. Cases annotated with "here is the situation type this represents, here are the cues that indicate this type, here is why this approach was appropriate given those cues, here is what went wrong in a superficially similar case" produce agents with something closer to the expert's deep structure knowledge.

### Distinguish Domains Where Expertise Is Possible from Those Where It Isn't

Shanteau's warning about the conditions for genuine expertise development is critical for agent system design. Some domains do not support the development of real expertise — because feedback is too delayed, too ambiguous, or too rare. In these domains, experienced practitioners may be *more* confident than novices without being *more* accurate — the Dunning-Kruger effect in its deepest form.

For agent systems, this means: a skill trained extensively in a domain without reliable feedback signals may have high surface confidence but low actual reliability. Domain assessment should include evaluation of whether the domain conditions support genuine expertise development.

Domains where agent expertise is likely to be real:
- Code correctness (feedback is precise: code runs or doesn't, tests pass or fail)
- Mathematical computation (feedback is verifiable)
- Pattern matching against large, well-labeled datasets

Domains where agent "expertise" should be treated with significant skepticism:
- Long-term consequence prediction in complex social or economic systems
- Judgment about novel legal or ethical situations without established precedent
- Creative quality assessment in domains without established evaluation criteria

### The Deliberate Practice Implication

Ericsson's research on expertise development identifies *deliberate practice* as the key mechanism — not just experience, but experience with feedback, with increasing difficulty, and with explicit attention to areas of weakness. Mere repetition without deliberate practice does not produce expertise.

For agent systems, this has implications for how training, fine-tuning, and capability development should be designed:
- Training should include cases near the boundary of the agent's current competence (not just easy cases)
- Feedback should be precise and informative (not just "right/wrong" but "here is what was wrong about your approach and why")
- Difficult sub-skills should be practiced in isolation before being integrated into complex tasks

Agent systems that are trained only on easy cases, with minimal feedback, and without deliberate targeting of weakness areas will plateau at a competent level without reaching the proficient or expert level that complex, high-stakes deployment requires.

## The Role of Training Support and Performance Support

Cognitive systems engineering research distinguishes two important types of system support:

**Training support**: Support that helps practitioners develop competence over time. Training support is appropriate early in the skill development process. It should be explicit, scaffolded, and educational — it should help practitioners build the knowledge structures that will eventually enable expert performance.

**Performance support**: Support that enables practitioners to perform effectively *now*, without necessarily developing the underlying competence. Performance support is appropriate when the practitioner needs to act in the domain without time to develop expertise first.

The critical error is providing *performance support* when *training support* is what is needed — and vice versa. A practitioner who relies on performance support indefinitely will never develop genuine expertise, because the support removes the challenges that drive expertise development. But a system that only provides training support when a practitioner needs to act reliably *now* is imposing inappropriate cognitive load.

For agent systems, this distinction applies directly. Some skills should be designed to help the calling agent learn and develop its own capabilities over time (training support mode). Others should be designed to provide reliable performance on demand without requiring the caller to understand how the skill works (performance support mode). The two modes call for different designs, and conflating them produces systems that serve neither purpose well.

## The Expert-Novice Interface Problem

One underappreciated challenge in multi-agent systems: when an expert-level agent must coordinate with a novice-level agent, the communication can fail because they are operating with different representations of the problem.

The expert agent represents the situation in terms of deep structure ("this is a case of distributed locking failure under high concurrency"). The novice agent represents the same situation in terms of surface features ("the database is returning timeout errors"). These representations lead to different questions, different information requests, and different interpretations of the same data.

This is analogous to the expert-novice communication problems documented in human team research — where expert practitioners and novice trainees often talk past each other because they are not sharing the same representation of the situation.

For agent orchestration, this means:
- Communication protocols between agents should include representation-level metadata (not just the content of a message but the level of abstraction at which it is expressed)
- Agents should be able to modulate the level of abstraction in their output based on the receiving agent's proficiency level
- The orchestration layer should be aware of representation mismatches between coordinating agents and manage translations when necessary

## The Irreducibility of Experience

The deepest lesson from the expertise development literature is one that agent system designers often resist: there is no shortcut to experience. Expert performance cannot be achieved solely by providing a system with correct rules and procedures. The knowledge reorganization that underlies expert performance — the development of a rich library of situation types with associated cues, expectations, and responses — requires exposure to many cases across the full range of domain variability, with reliable feedback.

This is not a counsel of despair for agent systems — it is a design constraint that should be taken seriously. Agent systems cannot be expected to perform at expert level in domains where they have not had the equivalent of extensive, varied, feedback-rich experience. Systems deployed in such domains should:
- Reflect their actual (limited) proficiency in their confidence calibration
- Escalate to human judgment for cases near their competence boundary
- Include explicit mechanisms for accumulating case experience over time
- Be evaluated against realistic difficulty distributions, not just easy test cases

The road to expert-level agent performance runs through experience — carefully curated, extensively annotated, and honestly evaluated.