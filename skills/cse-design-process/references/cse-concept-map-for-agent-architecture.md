# The CSE Concept Map: A Framework for Organizing Agent System Capabilities

## The Problem of Proliferating Labels

One of the paper's most practically useful contributions is its attempt to bring order to what Hoffman et al. (2002) called "acronym soup" — the proliferation of terms, frameworks, methods, and principles in the CSE field that use similar language to describe different things, or different language to describe similar things.

The authors identify four fundamental confusion sources, each of which has a direct analog in the proliferating landscape of AI agent system capabilities:

1. **Approaches are at different levels of abstraction.** Some are high-level frameworks (how to orient the entire design process), some are methods (specific procedures for gathering information), some are modeling techniques (how to represent cognitive structure), and some are design principles (guidelines for good practice). These categories are not mutually exclusive, but failing to distinguish between them creates confusion about what is being compared.

2. **Approaches come from different traditions with different emphases.** Decision-Centered Design prioritizes expert decision-making; Cognitive Work Analysis prioritizes constraint structure; Situation Awareness-Oriented Design prioritizes perceptual and attentional demands. Different questions drive different answers, even when the questions superficially look similar.

3. **Descriptions are typically pedagogical rather than accurate.** Sequential representations of inherently iterative processes make them more comprehensible but less truthful — and can actively mislead practitioners who take them too literally.

4. **Categories are not disjoint.** A method can be used within multiple frameworks; a principle can inform multiple methods. The landscape is genuinely overlapping, and any representation of it will be a simplification.

The concept map the paper offers is their response: a structured organization of CSE elements into four categories — Frameworks, Methods, Modeling Techniques, and Principles of Good Practice — that clarifies the level of abstraction and purpose of each element while acknowledging that any element can interact with elements in other categories.

## Translating the Concept Map to Agent System Architecture

For a WinDAGs-style multi-agent orchestration system with 180+ skills, the same organizational challenge exists — and the same four-category structure offers a useful organizing framework.

### Category 1: Frameworks (Orienting Philosophies)

In CSE, frameworks "guide the evolution of CSE theory and practice" and shape how methods are applied. They are not procedures — they are lenses that determine what questions are worth asking and what answers count as relevant.

For agent systems, the framework level includes:
- The philosophy of how complex problems should be decomposed (hierarchical? emergent? constraint-based?)
- The theory of how agents should coordinate (centralized orchestration? peer-to-peer negotiation? market mechanisms?)
- The stance on uncertainty (explicit Bayesian reasoning? confidence intervals? hard commitments?)
- The philosophy of failure (fail fast? graceful degradation? human escalation?)
- The theory of expertise (what does expert performance look like, and how should agents be designed relative to it?)

These frameworks are often implicit in system design. Making them explicit — the way the five CSE frameworks are made explicit in the paper — enables meaningful comparison and deliberate choice. A system designed under a "central orchestrator understands all" framework will behave very differently from one designed under a "agents are autonomous specialists that coordinate at interfaces" framework, and the failure modes of each will be characteristically different.

### Category 2: Methods (Procedures for Gathering Information)

In CSE, methods provide "strategies for eliciting and representing core constructs." The Critical Decision Method elicits knowledge through incident-based interviews. Document analysis and semi-structured interviews populate constraint representations. Each method is appropriate for different information needs and different contexts.

For agent systems, the methods level includes:
- Procedures for evaluating skill performance on domain-specific test cases
- Techniques for profiling agent behavior under novel or adversarial inputs
- Methods for analyzing failure modes in multi-agent coordination
- Protocols for knowledge elicitation from domain experts to inform skill design
- Evaluation frameworks for assessing system-level cognitive support (not just individual skill accuracy)

The paper's observation that "the investigator's theoretical stance, or originating community of practice, greatly influences the use of methods" applies here too: the same performance evaluation method will produce different information when applied by someone who believes the primary system goal is accuracy versus someone who believes it is appropriate uncertainty communication.

### Category 3: Modeling Techniques (Representations of Cognitive Structure)

In CSE, modeling techniques are "knowledge representation or work modeling methods intended to aid in mapping patterns or constraints." The abstraction-decomposition matrix represents domain structure at different levels of abstraction. Decision ladders represent the flow between situation assessment and action selection. COGNET models the cognitive aspects of task performance.

For agent systems, the modeling level includes:
- Task decomposition representations (what are the natural subtask boundaries for a given problem class?)
- Agent state models (what information does each agent need to maintain across a multi-step task?)
- Coordination protocols (what is the sequence of information exchange required for two agents to effectively handoff?)
- Uncertainty models (how should confidence be propagated through a multi-step reasoning chain?)
- Domain constraint models (what are the hard and soft constraints that any solution must satisfy?)

The paper makes an important methodological point about modeling techniques: "When used in a Cognitive Work Analysis context, the Critical Decision Method might be used to uncover constraints or map decision processes... rather than the expert decision process." The same method, used to populate different models, produces different artifacts that answer different design questions. The model drives the method's use.

For agent systems, this means: before designing how to evaluate agents, clarify what model the evaluation is populating. Are you building a model of individual skill capability? A model of coordination patterns? A model of domain constraint coverage? Each requires different evaluation methods.

### Category 4: Principles of Good Practice (Guidelines That Apply Across Contexts)

In CSE, principles are "widely applicable maxims" intended to guide design across frameworks. Woods's "Laws that Govern Cognitive Work" are one example; the First-Person Perspective principle is another. These are not procedures — they are heuristics, grounded in accumulated experience, that apply across many specific design contexts.

The paper identifies several principles that apply with particular force to agent system design:

**Visual Momentum (Woods, 1984):** The design principle that interface displays should maintain users' sense of context as they navigate between views — so that each new display is interpretable in terms of the previous display without cognitive reset cost. For agent systems: outputs produced by one skill and consumed by another should maintain semantic continuity — the receiving agent should be able to situate the incoming information in the context of what it already knows without having to perform a costly cognitive translation.

**Making Automated Systems Team Players (Christoffersen and Woods, 2002):** The principle that automation should behave as a legible, predictable, and monitorable participant in the joint cognitive system. For agent systems: each skill should be designed to make its state, confidence, reasoning, and failure modes visible to the orchestration layer — not just to produce outputs.

**Resilience Engineering (Woods and Hollnagel, 2006):** The principle that systems should be designed for graceful adaptation to unexpected conditions, not just optimal performance under anticipated conditions. For agent systems: the skill library should include explicit degradation pathways for cases that fall outside any skill's confident operating range.

**First-Person Perspective (Eggleston and Whitaker, 2002):** The principle that system interfaces should use the worker's own terminology and conceptual framework, not the designer's. For agent systems: the interface between the orchestration layer and human operators should be built around the domain vocabulary and problem-framing of the practitioners who consume the system's outputs — not the technical vocabulary of the system's designers.

## The Concept Map's Key Insight: Context Determines Application

The paper makes a subtle but important point about its concept map: "this concept map implies that any method could be applied within any framework. While this is technically true, history tells us that the investigator's theoretical stance, or originating community of practice, greatly influences the use of methods."

This means: a method is never purely objective. The same Critical Decision Method interview produces different information in the hands of a Decision-Centered Design practitioner than in the hands of a Cognitive Work Analysis practitioner — not because one is doing it wrong, but because the orienting framework shapes what questions are asked, what answers are noted as significant, and what representation is used to capture the findings.

For agent systems, the analogous insight is: a skill is never purely a function. The same skill invoked within different orchestration frameworks — centralized versus distributed, certainty-seeking versus uncertainty-tolerant, human-in-the-loop versus fully autonomous — produces different patterns of behavior, exploits different strengths, and exposes different failure modes. The skill doesn't change; the framework in which it is embedded determines whether its strengths are used and its weaknesses are compensated for.

This is why architectural decisions at the framework level matter more than individual skill optimization. A brilliant skill embedded in a poorly-designed orchestration framework will underperform. A mediocre skill embedded in an orchestration framework that complements its weaknesses and amplifies its strengths will outperform. The concept map's four-level structure helps keep this perspective: don't optimize methods and techniques without attending to the framework within which they operate.

## The Missing Level: Meta-Cognitive Awareness

The paper briefly surfaces a category that doesn't fit cleanly into the four-level structure: meta-cognitive awareness — the system's capacity to reflect on its own cognitive processes and limitations.

CSE's commitment to discovery over procedure implies a kind of meta-cognitive stance: the practitioner must maintain awareness not just of the domain being analyzed but of their own analytical approach and its limitations. This is why "errors are considered interesting openings for further inquiry" rather than failures to be corrected: the meta-cognitive awareness that an error implies a model mismatch is itself a capability that must be designed for.

For agent systems, meta-cognitive capability means:
- Agents that can assess the limits of their own expertise and signal when a problem falls outside their reliable operating range
- Orchestrators that can recognize when a decomposition strategy is failing and revise it
- Skills that can identify when their output confidence is not warranted by the information they had access to
- A system-level capacity to distinguish between "we solved this problem" and "we produced an answer to this problem" — the latter being achievable without the former

This is perhaps the hardest capability to build and the most important one to have for a system that aspires to handle genuinely novel and complex problems. The CSE concept map doesn't explicitly label it, but the entire CSE project is oriented around it.