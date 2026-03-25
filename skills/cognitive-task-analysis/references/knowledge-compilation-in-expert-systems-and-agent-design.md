# From Knowledge Compilation to Agent Design: What Cognitive Architecture Tells Us About Building Systems That Work Like Experts

## The Central Insight from Cognitive Architecture

John Anderson's ACT-R cognitive architecture, the theoretical backbone of much of the CTA research Yates synthesizes, contains a finding that is immediately applicable to AI agent system design: **knowledge begins as slow, declarative, and conscious, and becomes fast, procedural, and automatic through practice.** This process — knowledge compilation — defines the trajectory of expertise.

Understanding this trajectory illuminates not just how human experts develop, but what it would take for an artificial system to genuinely replicate expert performance rather than merely simulate its surface characteristics.

"All that there is to intelligence is the simple accrual and tuning of many small units of knowledge that in total produce complex cognition. The whole is no more than the sum of its parts, but it has a lot of parts." (Anderson, 1996, p. 356, as cited in Yates, p. 32)

This is simultaneously a humbling and clarifying claim. Intelligence is not mysterious — it is the accumulation of many small knowledge units. But the sheer number of parts, and the way they interact and compile, creates the appearance of mystery.

## The Stages of Knowledge Compilation

Yates describes the knowledge compilation process in precise terms that map directly to agent system design:

**Stage 1: Declarative Knowledge Acquisition**
All knowledge is initially acquired in declarative form — as explicit facts, concepts, and propositions. A new medical intern learns: "Sepsis is indicated by fever, elevated WBC, and tachycardia." This is a proposition — a relation between arguments.

**Stage 2: Interpretive Application**
Initially, declarative knowledge is applied by consciously retrieving the relevant knowledge and "interpreting" it for each specific case. This is slow, effortful, and limited by working memory. The intern consciously walks through each criterion.

**Stage 3: Proceduralization**
With practice, "interpretive applications are gradually replaced with productions that perform the task directly" (p. 33). The intern no longer consciously retrieves the sepsis criteria — they directly recognize the pattern. The declarative rule has been replaced by a production that fires automatically.

**Stage 4: Composition**
Multiple productions are combined into single, faster productions. What was once a five-step sequence becomes one production. The expert's recognition of sepsis is instantaneous where the intern's was sequential.

**Stage 5: Automated Knowledge**
The fully compiled state. The expert's procedure "becomes fast and automatic" (p. 34). Speed is dramatically increased; conscious access is dramatically reduced; transfer to instruction becomes dramatically more difficult.

## The Implication for "Knowing vs. Doing" in Agent Systems

The knowledge compilation trajectory defines the gap between what an agent knows declaratively and what it can do procedurally. This gap is the deepest structural challenge in agent system design.

An agent that has been trained on text about a domain has, at best, Stage 1-2 knowledge. It has accumulated propositions about what experts do. When applied to a problem, it "interprets" those propositions for the specific case — like a first-year intern consciously checking each criterion. It has not gone through Stages 3-5 because it has not practiced the relevant procedures in the relevant contexts enough times for compilation to occur.

This is why agents that are highly knowledgeable (can accurately describe expert procedures) often perform differently than they appear they should when actually executing those procedures in novel contexts. Their knowledge is declarative; the task requires compiled procedural knowledge.

The implications for agent system design are significant:

### Design Principle 1: Distinguish Knowledge Acquisition from Skill Compilation
An agent can acquire declarative knowledge (facts, concepts, principles) through text-based training. But the compiled procedural knowledge that drives expert performance requires something analogous to deliberate practice — repeated exposure to varied instances of the relevant problem type, with feedback on performance.

For AI agents, this suggests that truly capable procedural performance requires training regimens specifically designed to compile procedural skills — not just exposure to declarative descriptions of procedures, but actual practice (simulated or real) of the procedures themselves, with performance feedback at each step.

### Design Principle 2: Represent Knowledge at the Right Level
One of the practical consequences of the compilation process is that the same domain knowledge exists at multiple levels of representation simultaneously:
- **Declarative level**: "Sepsis criteria include fever, elevated WBC, and tachycardia"
- **Procedural level**: IF [patient shows (temp > 38.5 AND WBC > 12000 AND HR > 100)] THEN flag for sepsis evaluation
- **Compiled level**: Instantaneous pattern recognition based on perceptual features that a novice would need to check explicitly

Agent systems should represent knowledge at the appropriate level for the task. Declarative knowledge is appropriate for retrieval and communication tasks. Procedural knowledge is appropriate for execution tasks. Compiled knowledge (where it can be approximated) is appropriate for time-pressured recognition tasks.

### Design Principle 3: The Bottleneck Is Condition Specification
In the ACT-R framework, productions are IF-THEN structures where the IF specifies the conditions that trigger the production. The power of compiled expertise lies in the richness and precision of these condition specifications — the expert recognizes subtle combinations of features that novices do not notice.

For agent systems, this means that the quality of procedural knowledge is determined by the quality of its condition specifications. An agent that has IF-THEN rules with crude conditions (IF patient is unwell THEN alert physician) has primitive procedural knowledge. An agent with precise, multi-factor conditions (IF post-surgical patient who was afebrile at 6 hours develops specific fever trajectory AND specific wound changes AND specific pain report THEN specific protocol within specific time window) has richer procedural knowledge.

The practical challenge: precise condition specifications require exactly the kind of tacit, automated knowledge that is hardest to elicit from human experts. This is why Yates's entire dissertation is focused on the problem — and why the methods that best capture condition-action pairs (Process Tracing/Protocol Analysis, Think Aloud combined with retrospective analysis) are the most valuable for this purpose.

## The Memory Architecture: Working Memory as the Bottleneck

Anderson's ACT-R framework assigns a critical architectural role to working memory, which Yates discusses in terms of its limits. Miller (1956) estimated working memory capacity at seven (plus or minus two) chunks; Cowan (2000) estimated three (plus or minus one).

The compilation process is partly a working memory efficiency story: before compilation, each step of a procedure must pass through working memory, consuming its limited capacity. After compilation, the procedure runs without working memory load, freeing capacity for other cognitive operations.

For agent systems, this has a direct parallel in the management of context windows. An agent that must hold all relevant information in context (the analog to working memory) for every reasoning step is operating at the declarative level — slow, capacity-limited, and vulnerable to interference from irrelevant information. An agent with compiled skill modules that run without consuming context window capacity can handle more complex problems.

**Design implication**: Skills that are used frequently and whose execution is well-understood should be compiled into efficient, low-context-overhead implementations. The context window is the agent's working memory — it should not be consumed by procedures that can be automated.

## The Role of Deliberate Practice: What Human Expertise Research Implies

Ericsson, Krampe, and Tesch-Römer's (1993) deliberate practice framework is cited by Yates as the basis for expertise acquisition. Expertise is acquired "as a result of continuous and deliberate practice in solving problems in a domain" (p. 1-2). Not mere exposure — deliberate practice, with feedback, at the edge of current capability.

For AI agent systems, the analog to deliberate practice is:
1. **Targeted training on specific procedural skills** — not just general exposure to domain text
2. **Feedback at the level of specific decisions** — not just overall task success or failure
3. **Progressive difficulty** — exposure to increasingly complex and novel instances as basic patterns are mastered
4. **Explicit error analysis** — identifying which specific condition-action pairs failed and why

Current AI training approaches approximate some of these (reinforcement learning from human feedback, for instance, provides task-level feedback), but rarely provide the granular, step-level feedback required for the compilation of specific procedural skills. This is a gap between current training practice and what cognitive science implies would be necessary for genuine expertise compilation.

## The Expertise Gap Between Experts and Systems

Feldon (in press), cited by Yates, presents a "four-part framework to examine the process elements that shape expertise": (a) the role of knowledge, (b) the role of strategy, (c) the role of working memory, and (d) the role of skill automaticity (p. 82).

This framework implies that an artificial system claiming to replicate expert performance must achieve:
- **Knowledge**: A sufficiently complete and accurately structured representation of domain knowledge
- **Strategy**: Meta-cognitive processes for monitoring and controlling the application of knowledge
- **Working memory efficiency**: Ability to handle complex problems without being bottlenecked by the need to hold all relevant information explicitly
- **Skill automaticity**: The compiled, fast-executing procedural capabilities that allow experts to handle routine patterns without conscious effort

Most current agent systems are strong on knowledge (via large-scale training) and developing on strategy (via chain-of-thought and meta-prompting approaches). Working memory efficiency (context management) and skill automaticity (compiled procedural skills) remain significant challenges.

## Summary

Knowledge compilation — the process by which declarative knowledge becomes automated procedural knowledge through practice — defines the trajectory from novice to expert. It explains why experts can't accurately report their own knowledge, why behavioral observation misses the most important parts of expertise, and why systems trained on declarative descriptions of expert procedures perform differently than genuine experts. For agent system design, the compilation trajectory implies: distinguishing declarative from procedural knowledge in architecture, investing in procedural skill compilation through targeted practice rather than general exposure, managing context (working memory) efficiency as a first-class design concern, and setting realistic expectations about the gap between having knowledge about a domain and having the compiled procedural expertise that defines peak performance in that domain.