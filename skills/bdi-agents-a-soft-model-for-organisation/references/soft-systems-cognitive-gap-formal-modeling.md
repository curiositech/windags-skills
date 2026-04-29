# The Cognitive Gap in Soft Systems: Why Organizational Models Need Internal Process Mechanisms

## The Problem: Models That Describe But Don't Explain How

Jenkins and Jarvis identify a fundamental limitation in Soft Systems Methodology (SSM) and specifically in Checkland and Holwell's POM (Processes for Organizational Meanings) model: **"One of the limitations of SSM in general and POM in particular is that they are often unable to model the processes that occur within the models themselves."**

This is a subtle but critical issue. POM successfully describes organizational dynamics:
- Individuals and groups perceive the world (through cognitive filters)
- They engage in discourse
- Discourse creates meanings
- Meanings lead to intentions
- Intentions lead to purposeful action

But POM doesn't tell us **how** discourse creates meanings, **how** meanings lead to intentions, or **how** intentions lead to actions. These are treated as black boxes with arrows between them. As the authors note: "This may well be because those processes often mirror the complex decision-making processes which occur within intelligent agents, and which have traditionally been viewed as difficult to model accurately within the 'soft' side of systems thinking."

## Why This Matters for AI Agent Systems

The gap between "what happens" and "how it happens" is the difference between:
- **Descriptive power**: We can describe what an organization did
- **Explanatory power**: We can explain why it did that
- **Predictive power**: We can predict what it will do next

For AI orchestration systems, this maps directly to the difference between:
- **System observability**: We can log what agents did
- **System interpretability**: We can explain why they did it
- **System predictability**: We can anticipate how they'll behave under new conditions

The paper's core insight is that **AI cognitive architectures like BDI can fill this gap**—they provide formal mechanisms for the internal processes that soft systems leave unmodeled.

## What Soft Systems Gets Right: Messiness and Subjectivity

Before dismissing soft systems as "too vague," it's crucial to understand what it captures that formal systems often miss. Jenkins and Jarvis emphasize Checkland's fundamental observation: **difficult problems "are 'soft': there is in fact no one system that properly describes the situation."**

Why? Because people are involved, and:
1. **Perception is filtered**: Everyone sees the world through "cognitive filters" (their beliefs, experiences, biases)
2. **The process changes the situation**: "The very process of doing systems analysis changes the situation, and thus the 'problem' that one is trying to solve"
3. **People learn and adapt**: The system being modeled is itself learning from being modeled

This is why SSM emphasizes **learning over solving**: "The response to this observation was to emphasise the role of SSM as a learning process."

For agent systems, this translates to:
- **No ground truth**: Multiple agents may have legitimately different interpretations of the same events
- **Observer effects**: Monitoring agents changes their behavior
- **Continuous adaptation**: The system you modeled yesterday isn't quite the system you have today

## The POM Model: Organization as Cognitive System

Let's examine POM's structure to understand what it captures and what it misses:

### Element 1: Individuals and Groups
These are the cognitive agents—people or collections of people. They have mental states (though POM doesn't formalize what those states are).

### Element 2: Perceived World  
Not reality itself, but reality *as filtered through cognitive lenses*. "These cognitive filters shape a person's worldview, or weltanschauung, which dictates how a person perceives reality."

This is profound: **the model explicitly rejects objective observation**. There is no "true state" that agents access—only subjective perceptions shaped by internal mental models.

### Element 3: Discourse
Where the messiness happens. Jenkins and Jarvis note that Checkland doesn't assume this is clean: "discourse doesn't just involve rational discourse, but also political battles, coercion, and persuasion."

Critically: **"It is not assumed that discourse will produce consensus."** Instead, discourse produces...

### Element 4: Created Meanings
These are "information and knowledge created through the process of discourse." Note: created, not discovered. Meaning doesn't exist independently—it emerges from social interaction.

### Element 5: Related Intentions and Accommodations
Here's where consensus-failure is managed: "even if complete agreement cannot be reached, a number of related intentions will be derived (or recognized), based upon the various and often conflicting interests of the individuals and groups involved. Furthermore, where their intentions are not aligned, accommodations may emerge which will permit continuing progress, in spite of the lack of true consensus."

This is organizationally realistic: groups don't wait for perfect agreement—they find ways to move forward despite disagreement through accommodations (compromises, workarounds, political settlements).

### Element 6: Purposeful Action
Actions taken based on intentions. These actions then "affect the perceived world," completing a feedback loop.

## The Gap: How Do We Get From 4 to 5 to 6?

The paper identifies the critical question: **"There is, somewhere in the system, a cognitive process that converts one to the other."**

- How do "created meanings" (knowledge, information) become "intentions" (commitments to act)?
- How do multiple conflicting intentions get transformed into actual actions?
- What happens when new meanings conflict with existing intentions?

POM has arrows but no mechanisms. This is the cognitive gap.

## Why BDI Can Fill This Gap

Jenkins and Jarvis argue that BDI (Beliefs, Desires, Intentions) provides the missing internal structure because:

1. **BDI is a cognitive model**: "BDI does fit the criteria for defining intelligent agents... BDI represents a model of cognition, being based on Bratman's work on human practical reasoning"

2. **BDI has formal semantics**: Unlike verbal descriptions, BDI has "a family of logics that formally describe its behaviour"

3. **BDI is practical**: It's "a mature agent architecture for modelling intelligent agents that are able to interact with their environments and each other in a meaningful way"

4. **BDI handles the right problems**: It models how resource-bound agents make decisions under uncertainty, coordinate with others, and act purposefully—exactly what organizations do

## Three Possible Mappings

The paper proposes three ways to inject BDI into POM:

### Mapping 1: Model Individuals and Groups as BDI Agents
Treat each person or cohesive group as a BDI agent with:
- **Beliefs**: Their perception of the world (Element 2, filtered)
- **Desires**: Their goals and preferences (emerge through discourse)
- **Intentions**: Their commitments to act (Element 5)

**Challenge**: Groups are complex. Three sub-cases:
1. Homogeneous groups (shared B/D/I) - can be treated as single agents
2. Groups that mirror POM structure - recursive problem
3. Heterogeneous groups - may not be coherently modelable as single agents

**Value**: High explanatory power (why did person X do Y?) but potentially high complexity (modeling many agents with interactions).

### Mapping 2: Model IT System Development as BDI Agent
The IT development process (Element 7 in POM) can be seen as:
- **Beliefs**: Professional knowledge about IT (Element 7.3)
- **Desires**: Requirements from the organization (Elements 4 & 5)
- **Intentions**: Decisions about appropriate IT (Element 7.2)
- **Actions**: Purchasing or building systems (Element 7.1)

**Challenge**: Where do desires come from? The paper's insight: **requirements ARE desires**. They're drawn from organizational "Created Meanings" and "Related Intentions."

**Value**: Much simpler than Mapping 1 (single agent, not many), directly relevant to IS practice, and creates a learning loop (actions inform beliefs).

### Mapping 3: Model Discourse-to-Action Pipeline as BDI Agent
Treat Elements 4-6 as one cognitive process:
- **Beliefs**: Created Meanings (Element 4)
- **Desires**: Emerge from Discourse (Element 3)  
- **Intentions**: Related Intentions and Accommodations (Element 5)
- **Actions**: Purposeful Action (Element 6)

**Challenge**: This requires adding desires as an explicit output of discourse, which isn't in original POM.

**Value**: Models the entire organizational decision-making process as cognitive, potentially enabling prediction of organizational behavior.

## The Critical Innovation: Desires From Discourse

Standard BDI treats desires as primitives—agents just have them. But the paper makes a crucial observation: **in organizational settings, desires emerge socially through discourse**.

"As individuals and groups enter into discourse, their own, individual, sets of desires merge together. What is produced is... a collection of related and unrelated desires."

This is not aggregation (combining existing desires) but **emergence** (creating new desires that didn't exist before). A group discussing how to improve system performance might collectively generate a desire for "observable reliability metrics" that no individual brought to the conversation.

For multi-agent systems, this suggests:
- **Desires aren't pre-programmed**: They should emerge from agent interaction
- **Desire formation is a process**: There should be explicit mechanisms for how agent interaction creates new goals
- **Desires can be contradictory**: The system should handle conflicting desires through accommodations, not resolution

## What This Enables: Explanatory and Predictive Power

Jenkins and Jarvis are explicit about the value proposition: "Should BDI be applied to POM in a meaningful way, it provides the additional advantages of being a practical, well-tested model with a rigorous formalised logical basis. As such, not only may it prove to be a model that can be readily applied within IS research, but, when combined with the formalised logical system, it may be able to serve a predictive role, being able to predict possible behaviours within an organisational setting."

This is the goal: **move from description to prediction** by formalizing the internal cognitive processes.

For AI agent orchestration, this means:
- **Predict coordination breakdowns**: Model each agent's B/D/I and predict where conflicts will emerge
- **Predict adaptation**: Model how new information (beliefs) will change agent behavior
- **Predict cascading effects**: Model how one agent's action affects other agents' beliefs and intentions

## The Peripheral Nature of Information Systems: A Humbling Insight

One of the paper's most important observations is often overlooked: **"The IS in this model is both created by and assists in the creation of the other elements... it enriches and supports these processes, but is not a key component."**

Even more bluntly: "If the IS was removed from the equation discourse could still occur, meanings could still be created, related intentions could still be derived and purposeful action could still be undertaken."

This is profound for AI system designers. The orchestration system, the decision support system, the intelligent agent—all are **peripheral prosthetics**, not central organs. They augment organizational cognition but don't replace it.

This suggests:
- **Design for augmentation, not replacement**: AI agents should enhance human/organizational decision-making, not try to supplant it
- **Expect workarounds**: Organizations will route around systems that constrain them
- **Focus on enrichment**: The value is in making discourse richer, meanings clearer, intentions more aligned—not in automating everything

## Boundary Conditions: When Does This Approach Fail?

### 1. Complexity Explosion
Modeling many agents with full B/D/I and their interactions quickly becomes intractable. The paper acknowledges this: "The question as to whether or not modelling the individuals and groups is informative is one that is somewhat more difficult to answer. This will depend on three factors: The difficulty of generating the model; The complexity of the model; The accuracy of the model."

**Implication**: Pick your level of modeling carefully. Don't model 50 individual agents when one organizational-level agent would suffice.

### 2. Rapidly Changing Contexts
Soft systems emphasize that analyzing the system changes it. A BDI model frozen in time may quickly become outdated as agents learn and adapt.

**Implication**: Models need update mechanisms. Beliefs should be dynamic, intentions should be revisable, and the model itself should be viewed as provisional.

### 3. Non-Cognitive Processes
Some organizational dynamics aren't cognitive—they're structural, resource-based, or purely mechanical. Not everything needs B/D/I modeling.

**Implication**: Use BDI for decision-making processes, not for everything. Data flow, resource allocation, and scheduling might be better modeled other ways.

### 4. Incommensurable Worldviews
When different agents have fundamentally incompatible cognitive filters, modeling their beliefs as different values in the same framework may be misleading. Sometimes worldviews aren't just different—they're incommensurable.

**Implication**: The model may need meta-level representation of "this agent and that agent literally can't understand each other's perspective."

## Practical Design Principles for Agent Systems

### 1. Make Cognitive States Explicit
Don't bury beliefs, desires, and intentions in code. Make them explicit, queryable data structures. An agent should be able to introspect and report: "My current belief is X, my desire is Y, my intention is Z."

### 2. Model Discourse as Process, Not Instantaneous
If desires emerge from agent interaction, that emergence should be observable. Create explicit "discourse" phases where agents exchange and create meanings before forming intentions.

### 3. Accommodate Disagreement, Don't Eliminate It
Build mechanisms for accommodations—ways to proceed despite conflicting intentions. Don't wait for consensus that may never come.

### 4. Track Belief Sources and Confidence
If beliefs are formed through filtered perception, track: Where did this belief come from? How confident are we? What could change it?

### 5. Make Intentions Revisable But Costly
Following the commitment model, intentions should be stable but not immutable. Define clear conditions for revision, and make revision visible (logged, announced to other agents).

### 6. Design for Augmentation, Not Automation
If the system is peripheral (per POM), design it to enhance human/organizational cognition, not replace it. Focus on enriching discourse, clarifying meanings, surfacing conflicts.

## The Deeper Lesson: Formalism and Messiness Can Coexist

The paper's most subtle contribution is demonstrating that **formal cognitive models and soft systems thinking aren't incompatible**—they're complementary.

Soft systems capture the reality that:
- Problems are messy and subjective
- Consensus is rare
- Politics matters
- Analysis changes what's being analyzed

Formal BDI provides:
- Precise mechanisms for cognitive processes
- Logical consistency checking
- Predictive capability
- Implementable architectures

The combination says: **Yes, organizational decision-making is messy, but the messiness follows patterns that can be formally modeled.**

For AI agent orchestration, this means:
- Don't oversimplify the mess—model conflict, accommodation, filtered perception
- Don't wallow in complexity—use formal structures to make the mess tractable
- Don't expect perfect rationality—expect bounded rationality with cognitive limits
- Don't eliminate subjectivity—model it explicitly as filtered beliefs

The gap between knowing and doing isn't just about execution—it's about bridging formal models that can predict and human realities that resist formalization. This paper shows one way to build that bridge: use BDI to model the cognitive internals while preserving soft systems' acknowledgment that the internals exist in a messy, social, political context.