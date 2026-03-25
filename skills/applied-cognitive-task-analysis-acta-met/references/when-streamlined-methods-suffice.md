# When Streamlined Methods Suffice: The Pragmatic Epistemology of "Good Enough"

## The Comprehensiveness-Usability Tradeoff

Academic cognitive task analysis methods produce rich, comprehensive models of expertise: conceptual graphs mapping causal relationships, detailed protocol analyses of problem-solving moves, complex mental models showing interconnected knowledge structures. These require months of data collection, teams of trained researchers, and generate outputs primarily interpretable by other researchers.

ACTA demonstrates that for most practical applications, you don't need comprehensive—you need sufficient. Graduate students with 6 hours of training conducted interviews that yielded 93% cognitively relevant information, 90%+ experience-based knowledge, and training materials rated 70%+ important and 85-90%+ accurate by domain experts.

This isn't a compromise—it's recognizing that the bottleneck in applying cognitive science is not insufficient depth but insufficient accessibility.

## What Gets Lost in Streamlining

The evaluation study acknowledges but doesn't systematically measure what's sacrificed for usability:

**Causal model detail** - Intensive methods like Rasmussen's cognitive analysis or Gordon's conceptual graphs map detailed causal relationships. ACTA captures "experts use X to determine Y" but not the full causal chain of how X indicates Y through intermediate inferences.

**Decision alternative exploration** - Critical Decision Method protocol involves extensive probes about options considered and rejected. ACTA simulation interview asks about alternatives but less exhaustively.

**Temporal dynamics** - Detailed protocol analysis captures moment-by-moment reasoning evolution. ACTA captures major decision points but not fine-grained cognitive processes between them.

**Knowledge structure** - Some methods attempt to map how concepts relate in expert memory (semantic networks, concept maps). ACTA focuses on operational knowledge (what experts use) not structural knowledge (how it's organized mentally).

The critical question: For what applications does this lost detail matter?

## When Streamlined Methods Suffice

**Training Design** - To create effective training, you need:
- What cognitive skills are required (ACTA Knowledge Audit identifies these)
- What makes those skills hard for novices (Why Difficult column captures this)
- What cues experts use (Cues/Strategies column provides these)
- What errors to avoid (Common Errors column specifies these)

You don't need:
- Complete causal model of expert cognition
- Every possible decision alternative
- Moment-by-moment reasoning trace

The ACTA evaluation demonstrated that training materials based on streamlined elicitation were rated highly by experts. The lost detail apparently didn't prevent effective training development.

**System Requirements** - To design decision support systems, you need:
- What information experts require at decision points
- What assessments they make from that information
- What common failures occur without support

You don't need:
- Complete knowledge structure of expert memory
- Every nuance of how they weight information
- Comprehensive model of their uncertainty handling

**Initial Domain Familiarization** - When entering an unfamiliar domain to scope a project, you need:
- What parts of the task are cognitively complex
- Where expertise makes the most difference
- What would be valuable to support or train

You don't need:
- Deep understanding of expert reasoning
- Comprehensive task model

ACTA's Task Diagram explicitly serves this scoping function—get overview, identify complexity, focus deeper analysis.

**Rapid Iteration** - When you need multiple design-test cycles, you need:
- Fast elicitation (ACTA: 3 hours per expert)
- Quick analysis (Cognitive Demands Table: 4 hours to consolidate)
- Immediately actionable outputs

You can't afford:
- Months of data collection per iteration
- Complex analyses requiring researcher interpretation
- Outputs that need extensive translation to design implications

## When Comprehensive Methods Are Warranted

**Expert System Development** - If building a system intended to replicate expert reasoning, you need the causal models, decision logic, and knowledge structures that intensive methods provide. Streamlined methods won't give you enough to actually BE the expert.

**Research** - If goal is understanding human cognition (not building systems), comprehensive methods are appropriate. You're trying to discover new insights about expertise, not apply known insights.

**High-Stakes Unique Decisions** - If analyzing a one-time critical decision (accident investigation, high-consequence policy choice), the stakes warrant intensive analysis. You can't iterate, so you need comprehensive understanding.

**Novel Theoretical Territory** - When the domain is so different from studied cases that you don't know what matters, exploratory intensive methods are justified. ACTA assumes expertise fundamentals (pattern recognition, mental simulation, etc.) apply—if you're unsure that's true, you need deeper investigation.

**Training High-Consequence Rare Events** - If training for situations that occur infrequently but have massive consequences (nuclear power emergency response, aircraft carrier combat), the detail of how experts reason through scenarios justifies intensive methods. You can't afford gaps.

## Implications for Agent System Development

### Tiered Analysis Strategy

Agent systems might use ACTA-level analysis by default, escalating to intensive methods only when streamlined analysis proves insufficient:

1. **Initial scoping with Task Diagram** - Identify where cognition matters (not just where complexity exists)

2. **ACTA Knowledge Audit on high-priority elements** - For cognitive elements that matter most, conduct structured knowledge elicitation

3. **Rapid prototyping based on ACTA outputs** - Build initial agent capabilities from streamlined elicitation

4. **Identify failure modes** - Where does the agent fail despite training on ACTA-derived knowledge?

5. **Targeted intensive analysis** - For specific failure modes, conduct intensive cognitive task analysis to understand what's missing

This is vastly more efficient than comprehensive analysis upfront, most of which wouldn't inform design.

### The "Expert Consultant" Model

Rather than trying to build systems that replicate expert reasoning completely, build systems that consult expert-derived knowledge:

- System recognizes it's entering a situation type that ACTA analysis covered
- Retrieves relevant cues, strategies, common errors from Cognitive Demands Table
- Surfaces this as context for its reasoning or recommendations to user
- Doesn't claim to UNDERSTAND like the expert, but leverages expert knowledge

This requires only the level of detail ACTA provides: situation type recognition, relevant considerations, common pitfalls.

### Iteration Over Comprehensiveness

ACTA's efficiency enables rapid iteration:

- Build system from ACTA-derived knowledge
- Deploy in test environment
- Observe failures
- Conduct targeted ACTA with experts around specific failure modes
- Update system
- Repeat

This cycle can turn in weeks rather than months/years that comprehensive initial analysis would require. You learn where more detail is needed by discovering where streamlined detail was insufficient.

## The Usability Insight

The study's most striking finding: methodology usability matters MORE than methodology comprehensiveness for practical impact.

Comprehensive methods that require extensive training create a bottleneck: only a few specialists can apply them. Impact is limited by the number of researchers who can conduct the analysis.

Streamlined methods that can be taught in 6 hours create scalability: any instructional designer can apply them. Impact is limited only by the number of problems worth analyzing.

The multiplication factor matters more than the per-instance quality:

- 10 expert researchers doing 2 comprehensive analyses per year = 20 applications
- 1000 instructional designers doing 5 streamlined analyses per year = 5000 applications

Even if streamlined analysis captures only 70% of what comprehensive analysis would, 70% × 5000 = 3500 "comprehensive-equivalents" of impact versus 20 comprehensive analyses.

This is true for AI agent systems:

**Comprehensive approach**: Small team builds perfect models of expertise for a few critical domains

**Streamlined approach**: Many developers integrate expert-knowledge into hundreds of specialized agents using accessible frameworks

The streamlined approach enables "cognitive expertise everywhere" rather than "perfect cognitive modeling in a few places."

## Boundary Conditions

**When Streamlined Becomes Insufficient:**

1. **Accumulating error** - If agent makes decisions that chain together, small gaps in understanding compound. May need deeper model of expert reasoning to avoid cascading errors.

2. **Adversarial robustness** - If system must be robust to adversarial inputs (security, combat), surface-level expert knowledge may be gameable. Need deeper understanding of WHY expert strategies work.

3. **Transfer to novel situations** - If system must generalize far beyond training domain, shallow expert knowledge may not transfer. Need underlying principles that experts may not articulate in streamlined elicitation.

4. **Explanation requirements** - If system must explain not just WHAT experts do but WHY it works, streamlined methods may not capture necessary causal depth.

**Signals That More Depth Is Needed:**

- Experts reviewing ACTA-derived materials say "That's accurate but incomplete"
- System trained on ACTA data performs poorly on edge cases experts handle easily
- Multiple iteration cycles don't improve system performance
- Users don't trust system because explanations feel shallow

At that point, targeted intensive analysis of specific gaps is warranted.

## For Multi-Agent Orchestration

**Implications for orchestration architecture:**

**Start streamlined everywhere** - Use ACTA-level analysis to populate initial knowledge for all agent skills. This creates broad coverage quickly.

**Identify bottlenecks through operation** - Monitor which agent handoffs fail, which decisions are frequently incorrect, which explanations users question.

**Deepen selectively** - Conduct intensive analysis only for identified bottleneck capabilities. Most agent skills may never need more than ACTA-level knowledge.

**Maintain lightweight representation** - Even where deeper analysis is conducted, maintain ACTA-level Cognitive Demands Table as interface. Detailed models are internal to specific agents; shared representation stays simple.

This creates a system that's broadly knowledgeable (through streamlined elicitation) with pockets of deep expertise (through targeted intensive analysis), mirroring how organizations actually work.

## The Pragmatic Epistemology

ACTA embodies a philosophy: **The purpose of knowledge elicitation is not comprehensive understanding—it's sufficient understanding for a specific application.**

This shifts the question from "What do experts know?" to "What do we need to know about what experts know to accomplish our goal?"

For training design: What expert knowledge enables us to create effective instruction?  
For system design: What expert knowledge enables us to build useful support?  
For agent orchestration: What expert knowledge enables appropriate task decomposition and routing?

The answers don't require perfect cognitive models. They require:
- Identifying what makes tasks hard (knowledge audit / cognitive demands table)
- Understanding how experts approach those hard parts (cues, strategies, mental models)
- Knowing common failure modes (errors column)

This pragmatic epistemology is relevant beyond ACTA: Any agent capability could be specified at multiple levels of depth. The question is always: What level of depth suffices for the intended use?

Sophisticated agent systems will need meta-reasoning about knowledge depth: This task can be handled with shallow knowledge. That task requires deep causal models. This handoff requires only category-level understanding. That coordination requires detailed shared mental models.

ACTA demonstrates that for many applications, shallow-but-structured beats deep-but-inaccessible. Agent orchestration systems that can leverage "good enough" knowledge efficiently will scale better than systems that demand perfect knowledge everywhere.