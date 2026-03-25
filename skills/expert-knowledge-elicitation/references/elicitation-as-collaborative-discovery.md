# Knowledge Elicitation as Collaborative Discovery: Beyond Extraction to Co-Construction

## The Paradigm Shift

The history of knowledge elicitation methodology documents a profound conceptual evolution. Early expert systems work was dominated by an **extraction metaphor**: expert knowledge exists as a fixed resource in experts' heads, and the knowledge engineer's job is to extract, mine, or download it.

Hoffman and Lintern chart the empirical collapse of this metaphor and the emergence of a fundamentally different understanding: **knowledge elicitation as collaborative discovery and co-construction**.

## Why Extraction Metaphor Failed

### The Articulation Gap

The extraction metaphor assumes experts can straightforwardly articulate what they know. Reality proved more complex.

**Compiled knowledge**: With extensive practice, knowledge becomes automated and proceduralized. Experts perform complex reasoning without conscious awareness of intermediate steps. Not because the knowledge is mysteriously "tacit," but because it's become automatic.

**Contextual triggering**: Much expert knowledge is tied to situational contexts. Asked abstractly "What do you know about X?", experts struggle. But when presented with concrete cases, the same experts provide rich, detailed accounts.

**Implicit organization**: Experts organize knowledge effectively for their own use but may lack explicit meta-cognitive awareness of that organization. Asking "How is your knowledge structured?" yields little. Creating external representations collaboratively (e.g., Concept Maps) reveals structure the expert recognizes but hasn't previously articulated.

### The Construction Evidence

Multiple lines of evidence show knowledge is constructed during elicitation, not merely expressed:

**1. Novel articulation**: The chapter reports (p. 216): "In Concept-Mapping interviews with domain experts, experience shows that almost every time the expert will reach a point in making a Concept Map where s/he will say something like, 'Well, I've never really thought about that, or thought about it in this way, but now that you mention it...'"

This isn't retrieval of pre-existing representations—it's active construction prompted by the elicitation process.

**2. Collaborative refinement**: Experts frequently modify and correct initial statements as representations develop. The external representation (Concept Map, timeline, matrix) serves as cognitive scaffold allowing experts to see and improve their own thinking.

**3. Discovery of patterns**: Through elicitation, experts sometimes discover regularities in their own reasoning they hadn't consciously recognized. The process of articulation itself generates insights.

**4. Integration across experts**: When multiple experts contribute to knowledge models, the result often transcends what any individual expert knew—collective knowledge construction, not aggregation of individual extracts.

## The Transactional View

The chapter presents an alternative perspective (p. 204): "According to a transactional view, expert knowledge is created and maintained through collaborative and social processes, as well as through the perceptual and cognitive processes of the individual."

**Implications**:

**Knowledge isn't purely individual**: Expertise exists partly in the expert's head, but also in:
- Tools and artifacts they use
- Communication patterns and social networks
- Organizational practices and culture
- External representations (notes, diagrams, reference materials)

**Knowledge emerges through interaction**: The expert-elicitor collaboration creates knowledge that didn't exist in quite that form before:
- Expert's implicit understanding made explicit
- Tacit patterns recognized and named
- Individual insights integrated into coherent models
- Knowledge organized for new purposes (teaching, system building)

**Elicitation changes participants**: Both expert and elicitor develop new understanding through the process. It's not information transfer but mutual learning.

## Characteristics of Effective Collaboration

### Complementary Expertise

Successful elicitation combines two different types of expertise:

**Domain expert brings**:
- Deep knowledge of domain concepts and relationships
- Recognition of important patterns and cases
- Intuitive sense of what matters
- Decades of experience and case memory

**Cognitive engineer brings**:
- Understanding of knowledge representation formalisms
- Skill at recognizing different knowledge types (conceptual, procedural, strategic)
- Ability to design effective probes and questions
- Experience across multiple domains revealing cross-domain patterns

**The collaboration**: Neither could produce the result alone. Domain expert lacks meta-cognitive tools and representational frameworks. Cognitive engineer lacks domain understanding to recognize what's significant.

### Iterative Refinement

Effective elicitation isn't one-pass questioning but iterative cycles:

**First pass**: Broad overview, major concepts and relationships, general strategies.

**Second pass**: Refinement—add detail, qualify statements, recognize omissions, correct oversimplifications.

**Third pass**: Validation—test representations with cases, probe boundary conditions, explore exceptions.

**Subsequent passes**: Evolution—update based on new cases, integrate insights from other experts, adapt to domain changes.

**Example from CDM** (p. 209): Multi-pass retrospection where expert first tells the story of a challenging case, then successive probes explore decision points, perceptual cues, alternative options, counterfactuals, and general principles.

### External Representations as Cognitive Artifacts

A critical insight: External representations (Concept Maps, matrices, timelines) aren't just recording devices—they're active participants in knowledge construction.

**Concept Mapping example** (p. 211-213): As expert and elicitor collaboratively build a Concept Map:
- Expert sees emerging structure, recognizes gaps
- Visual relationships suggest connections expert hadn't consciously considered
- Hyperlinked resources trigger memories of relevant cases
- Spatial arrangement helps expert organize thinking
- Comparison with other maps reveals patterns

The representation itself scaffolds the expert's reasoning, making visible what was implicit and enabling reflection that wouldn't occur in purely verbal exchange.

### Psychological Safety and Trust

Knowledge construction requires experts to:
- Admit uncertainty ("I'm not sure about that")
- Revise statements ("Actually, that's not quite right")
- Reveal workarounds and rule violations
- Discuss errors and failures
- Acknowledge limits of their knowledge

This vulnerability requires **trust**:
- Non-judgmental attitude from elicitor
- Confidentiality when appropriate
- Recognition that goal is learning, not evaluation
- Respect for expert's knowledge and experience
- Genuine curiosity, not interrogation

The chapter emphasizes (p. 204): "Breaking the ice and establishing rapport" is essential, including sensitivity to experts' possible concerns about job security if their knowledge is captured.

## Implications for Intelligent Agent Systems

### Agent as Elicitation Partner

Rather than agents learning purely through observation or passive data collection, design agents to actively participate in knowledge construction with humans.

**Active learning dialogue**:

Traditional: Agent observes human actions, infers patterns.

Collaborative: Agent asks questions that scaffold human articulation:
- "I notice you chose X. What factors influenced that decision?"
- "How does this situation differ from [similar previous case]?"
- "You mentioned Z is important. Can you give an example of when it matters?"

**Co-construction of representations**:

Traditional: Human provides knowledge, AI systems engineers encode it.

Collaborative: Human and agent jointly build representations:
- Agent proposes structure, human refines
- Human provides examples, agent identifies patterns and asks for confirmation
- Interactive concept mapping where agent suggests relationships, human validates
- Agent highlights inconsistencies or gaps for human to address

**Mutual learning**:

Traditional: One-way transfer from human to agent.

Collaborative: Both improve understanding:
- Agent's questions prompt human meta-cognitive insight
- Human's corrections improve agent's models
- Agent's pattern recognition reveals regularities human hadn't noticed
- Human's contextual knowledge grounds agent's abstractions

### Multi-Agent Knowledge Construction

When multiple agents need to develop shared understanding (of task, domain, goals, constraints), collaborative elicitation principles apply to agent-agent interaction.

**Negotiated ontologies**: Rather than imposing fixed ontology, agents collaboratively construct shared conceptual framework:
- Agent A proposes conceptual structure
- Agent B identifies incompatibilities with its understanding
- Iterative refinement toward shared representation
- Retention of agent-specific perspectives where appropriate

**Case-based learning**: Agents share challenging cases and reasoning:
- Agent A describes situation it handled
- Agent B probes decision points (like CDM)
- Agents identify similarities/differences in their approaches
- Collective learning from distributed experience

**Collaborative knowledge model building**: Distributed agents contribute to shared knowledge models:
- Each agent adds expertise from its domain
- Cross-agent validation and refinement
- Integration reveals higher-level patterns
- Shared model becomes coordination resource

### Human-Agent Teams as Communities of Practice

The "transactional view" suggests workplace design goal (p. 204): "Promote development of a workplace in which knowledge is created, shared, and maintained via natural processes of communication, negotiation, and collaboration."

For human-agent teams:

**Agents as team members**: Not just tools but participants in knowledge creation:
- Agents observe team work and ask clarifying questions
- Agents contribute insights from their processing of data
- Agents help teams externalize and refine their strategies
- Agents serve as organizational memory, but memory that's questioned and updated

**Natural knowledge sharing**: Embed elicitation in workflow:
- After-action reviews where agent asks CDM-style probes
- Collaborative concept mapping during planning sessions
- Agent-prompted reflection ("This differs from usual pattern—what's different about this case?")
- Agent-facilitated expert-to-expert knowledge sharing

**Evolving shared understanding**: Team knowledge base as living, collaboratively maintained resource:
- Humans and agents both contribute
- Conflicts and inconsistencies drive dialogue
- Refinement through use and reflection
- Documentation of reasoning, not just conclusions

### Interface Design for Collaborative Elicitation

**Poor interface**: Form-filling, drop-down menus, rigid templates. Assumes knowledge pre-exists in easily decomposable form.

**Better interface**: Flexible representation tools allowing expert to structure knowledge naturally. Examples:
- Concept mapping tools
- Timeline builders for case walkthroughs
- Visual workflow editors
- Annotation interfaces for examples

**Best interface**: Intelligent scaffolding combining structure with flexibility:
- Agent proposes structure based on domain patterns
- Human accepts, modifies, or rejects
- Agent asks clarifying questions at appropriate points
- Representations update dynamically
- Easy movement between abstraction levels
- Comparison views showing multiple experts' models

## Practical Guidance

### Building Collaborative Capability

**For cognitive engineers**:

1. **Domain immersion**: Learn enough about domain to recognize significance, ask good questions, spot inconsistencies.

2. **Representational flexibility**: Master multiple representation formalisms (Concept Maps, timelines, matrices, decision trees) and match to domain and expert.

3. **Active listening**: Hear not just what expert says but implications, assumptions, gaps.

4. **Gentle probing**: Ask questions that scaffold without putting words in expert's mouth.

5. **Patience with iteration**: Accept that first articulation is rarely final; refinement is normal and necessary.

**For domain experts**:

1. **Meta-cognitive awareness**: Develop ability to reflect on own reasoning, not just execute it.

2. **Comfort with uncertainty**: Accept that you don't have to have complete answers immediately.

3. **Collaborative stance**: View elicitor as partner in discovery, not interrogator.

4. **Concrete grounding**: Use specific cases and examples rather than abstract descriptions.

5. **Iterative mindset**: Expect to revisit and refine, not "tell once and done."

### Designing Collaborative Elicitation Sessions

**Session structure**:

1. **Warm-up**: Establish rapport, explain process, address concerns.

2. **Initial exploration**: Broad overview, major concepts, general strategies.

3. **Concrete grounding**: Specific cases, examples, walkthroughs.

4. **Systematic probing**: Structured questions guided by method (CDM probes, concept relationship queries, etc.).

5. **Representation building**: Collaborative construction of external artifacts.

6. **Reflection and refinement**: Expert reviews representation, identifies gaps and errors.

7. **Planning next session**: Identify areas for deeper exploration.

**Multi-session strategy**:
- Session 1: Overview and initial concept mapping
- Session 2: CDM on challenging cases
- Session 3: Refinement and integration
- Session 4: Validation with test cases
- Ongoing: Periodic updates and extensions

### Evaluating Collaborative Success

**Good signs**:
- Expert has "aha" moments of self-insight
- Expert actively proposes additions and refinements
- Elicitor develops domain understanding
- Representations capture subtle distinctions expert recognizes as important
- Other experts validate and extend the models
- Knowledge proves useful in target application

**Warning signs**:
- Expert just answering questions without engagement
- Representations feel generic or textbook-like
- Expert can't provide concrete examples
- Other experts don't recognize the knowledge
- Results don't improve system performance or training outcomes

## Boundary Conditions

**When collaborative construction is most valuable**:
- Complex, knowledge-intensive domains
- Expertise developed over long periods
- Knowledge not fully articulated anywhere
- Multiple experts with varying perspectives
- Novel applications requiring knowledge transformation

**When simpler approaches suffice**:
- Well-documented routine procedures
- Simple skills with short learning curves
- Knowledge already explicitly organized
- Time-critical projects requiring quick capture
- Single, clear application with fixed requirements

**Resource considerations**:
- Collaborative elicitation requires skilled facilitators
- Multiple sessions needed for deep capture
- Both expert and elicitor time investment
- Tools and infrastructure for representation building
- Organizational support for iterative process

The fundamental insight: **Knowledge elicitation at its best isn't information extraction but collaborative knowledge construction**—a creative process bringing together complementary expertises to build representations that neither participant could produce alone, serving purposes neither initially envisioned completely.