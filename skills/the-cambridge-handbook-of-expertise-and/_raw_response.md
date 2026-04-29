## BOOK IDENTITY

**Title**: Eliciting and Representing the Knowledge of Experts

**Author**: Robert R. Hoffman & Gavan Lintern

**Core Question**: How can we systematically extract, represent, and preserve the knowledge and reasoning strategies of domain experts to build effective intelligent systems and maintain organizational capability?

**Irreplaceable Contribution**: This chapter uniquely bridges the historical evolution from AI expert systems through cognitive task analysis to modern knowledge management, providing battle-tested methodological guidance grounded in decades of empirical work. Unlike purely theoretical treatments, it reveals the practical realities of knowledge elicitation—what actually works, what fails, and why. The authors' distinction between knowledge of domain concepts, models of reasoning, and functional analysis of work domains provides a tripartite framework unavailable elsewhere. Most critically, it exposes the gap between documented procedures and "true work"—the adaptive, undocumented heuristics experts actually use.

## KEY IDEAS

1. **The Three Representations Problem**: Expert knowledge must be captured at three distinct levels—domain structure (what the world contains), practitioner knowledge (what experts know about the domain), and reasoning strategies (how experts think through problems). Each requires different elicitation methods and serves different design purposes. Conflating these leads to brittle systems.

2. **Effective Scaffolding Over Tacit Knowledge**: The "tacit knowledge" problem is largely a myth—the real issue is whether elicitation procedures provide sufficient scaffolding for experts to articulate what they know. Good methods create collaborative discovery contexts where experts routinely say "I've never thought about it this way, but..." The bottleneck isn't inexpressible knowledge; it's inadequate elicitation technique.

3. **The Gold Is Not in the Documents**: Experts possess crucial knowledge that never appears in standard operating procedures—adaptive heuristics, workarounds, pattern-recognition shortcuts, and "naughty" departures from official processes. These departures aren't negligence; they're the primary source of robust, efficient work practices. Systems designed only from documentation miss the actual expertise.

4. **Differential Utility, Not Differential Access**: Different methods don't access different "kinds" of knowledge (the differential access hypothesis failed empirically), but they do have different strengths. The Critical Decision Method excels at eliciting reasoning strategies and perceptual cues. Concept Mapping efficiently captures domain knowledge structures. Work Domain Analysis maps functional constraints. Method selection should match project goals, not assumed knowledge types.

5. **Knowledge Elicitation as Ongoing Organizational Practice**: KE isn't a one-time extraction for system building but an ongoing cultural practice for knowledge preservation, sharing, and creation. Organizations facing expert retirement, downsizing, or rare-event expertise need systematic capture processes integrated into normal work—not burdensome additional tasks but natural extensions of collaboration and mentoring.

## REFERENCE DOCUMENTS

### FILE: three-level-knowledge-architecture.md

```markdown
# The Three-Level Architecture for Expert Knowledge Representation

## Core Principle

When building intelligent agent systems, a fundamental error is treating "expert knowledge" as monolithic. Hoffman and Lintern's empirical work across domains—from weather forecasting to nuclear power plant operation—reveals that effective knowledge capture requires distinguishing three distinct levels of representation, each serving different purposes in system design.

## The Three Levels

### Level 1: Work Domain Structure (Functional Constraints)

This level represents the objective structure of the work environment—physical laws, organizational purposes, resource flows, causal relationships—independent of any particular worker or procedure. It answers: "What are the constraints and affordances of this domain?"

**Example from weather forecasting**: The physics of atmospheric convection, organizational mandate to issue forecasts within specific timeframes, available data sources (satellite, radar, weather balloons), geographical constraints of the forecast region.

**Elicitation approach**: Primarily document analysis supplemented by expert verification. Work Domain Analysis using Abstraction-Decomposition matrices captures this effectively.

**Use in agent systems**: Defines the possibility space for agent actions, establishes hard constraints, informs world modeling.

### Level 2: Practitioner Knowledge (Domain Concepts and Relations)

This level captures what experts know about domain entities, their properties, relationships, categories, and principles. It's conceptual knowledge—the semantic network in the expert's head. It answers: "What concepts does an expert have, and how are they related?"

**Example from weather forecasting**: "Cold fronts in the Gulf Coast region typically move southeast, bringing thunderstorms in summer but clear weather in winter. The sea breeze can stall a weak front. Frontal passage is indicated by wind shift, pressure rise, and temperature drop."

**Elicitation approach**: Concept Mapping proves most efficient, yielding 1-2 informative propositions per task minute. Structured interviews and domain concept sorting tasks also work well.

**Use in agent systems**: Builds semantic knowledge bases, informs natural language understanding, supports explanation generation, defines ontologies.

### Level 3: Reasoning Strategies (Decision-Making and Problem-Solving)

This level captures how experts actually think through problems—their decision strategies, perceptual cues they monitor, options they consider, metacognitive awareness, and problem-solving heuristics. It answers: "How does an expert reason in this domain?"

**Example from firefighting** (Table 12.2): "This is going to be a tough fire... It is 70 degrees now and it is going to get hotter [cue leading to anticipation of heat exhaustion]. The first truck, I would go ahead and have them open the roof up [action]. I am assuming engine 2 will probably be there in a second [anticipation]. I don't know how long the supply lay line is, but it appears we are probably going to need more water than one supply line is going to give us [cue-deliberation]. So I would keep in mind, unless we can check the fire fairly rapidly, consider laying another supply line [contingency planning]."

**Elicitation approach**: The Critical Decision Method—multi-pass retrospection on challenging cases using probe questions ("What were you seeing?" "What might someone else have done?"). Also: think-aloud protocols, tough case analysis.

**Use in agent systems**: Informs decision-making algorithms, guides attention mechanisms, supports strategy selection, enables adaptive behavior.

## Why This Matters for Agent Orchestration

**The Integration Problem**: Early expert systems failed partly because they conflated these levels. Procedural if-then rules tried to capture both domain structure AND reasoning strategies AND conceptual knowledge, resulting in brittle, opaque systems. Modern agent architectures must maintain these distinctions.

**For WinDAG-style systems**: 
- **World models** draw primarily on Level 1 (domain structure)
- **Skill libraries and knowledge bases** draw on Level 2 (conceptual knowledge)  
- **Planning and decision modules** draw on Level 3 (reasoning strategies)
- **Orchestration logic** must understand which level a particular skill or query addresses

**Practical implication**: When an agent struggles with a task, diagnosis requires asking: Is this a world model problem (Level 1—we don't understand the domain constraints)? A knowledge problem (Level 2—we lack key concepts or relations)? Or a reasoning problem (Level 3—we have the knowledge but don't know how to apply it)?

## The Activity Overlay Technique

Hoffman's weather forecasting work (Figures 12.2-12.3) demonstrates a powerful integration technique: Build the Level 1 domain structure, then overlay Level 3 reasoning trajectories showing how experts navigate through the abstraction-decomposition space. This reveals:

- Which domain elements experts actually attend to (vs. which exist in principle)
- The temporal sequence of information seeking
- Opportunistic problem-solving patterns
- Where experts spend cognitive effort

For multi-agent systems, this overlay technique can reveal:
- Natural decomposition boundaries (where expert attention shifts suggest subtask boundaries)
- Information dependencies (expert A needs output from expert B at this decision point)
- Coordination requirements (multiple experts examining same domain element suggests need for shared context)

## Boundary Conditions

**When the distinction blurs**: In highly proceduralized domains (assembly line work, routine clerical tasks), Level 3 reasoning may be minimal—experts mostly follow Level 1 constraints with Level 2 knowledge. The three-level distinction is most valuable in knowledge-intensive, judgment-heavy domains.

**When you need all three**: Any agent system attempting to replace or augment expert judgment needs all three levels. A system providing only Level 2 (knowledge lookup) fails when novel situations require reasoning. A system with only Level 3 (reasoning rules) fails when domain structure changes.

**Resource allocation**: In time-constrained projects, prioritize Level 3 (reasoning) elicitation—it's the hardest to reconstruct from other sources and the most critical for handling novel situations. Level 1 can often be extracted from documentation; Level 2 from textbooks and training materials. But Level 3—how experts actually think—exists primarily in experts' heads.

## Implications for Skill Design

When designing skills for an agent system:

- **Foundational skills** (data retrieval, calculation) primarily need Level 1 and Level 2
- **Judgment skills** (evaluation, assessment, diagnosis) critically need Level 3
- **Coordination skills** (orchestration, delegation) need all three levels properly distinguished

The architecture should make explicit which level(s) each skill draws upon, enabling meta-reasoning about gaps and appropriate skill composition.
```

### FILE: scaffolding-over-extraction.md

```markdown
# Knowledge Elicitation as Scaffolded Collaboration, Not Extraction

## The Failed Extraction Metaphor

Early expert systems work was haunted by the "knowledge extraction" metaphor—the idea that expert knowledge exists as a fixed commodity inside experts' heads, waiting to be mined, extracted, or downloaded. This metaphor shaped methodology ("knowledge acquisition tools"), defined problems ("the knowledge acquisition bottleneck"), and ultimately contributed to system failures.

Hoffman and Lintern document the empirical death of this metaphor and its replacement with a more accurate model: **knowledge elicitation as scaffolded collaborative discovery**.

## What Actually Happens in Successful Elicitation

From the chapter (p. 216): "In Concept-Mapping interviews with domain experts, experience shows that almost every time the expert will reach a point in making a Concept Map where s/he will say something like, 'Well, I've never really thought about that, or thought about it in this way, but now that you mention it...' and what follows will be a clear specification on some procedure, strategy, or aspect of subdomain knowledge that had not been articulated up to that point."

This reveals the core truth: **Knowledge isn't extracted; it's constructed in the moment of elicitation through a collaborative process between expert and elicitor.**

## The Tacit Knowledge Red Herring

The persistent claim that expert knowledge is "tacit" (inexpressible through verbal report) has been used to:
- Justify avoiding human experts ("they can't tell us what they know")
- Promote machine learning ("we'll learn from their behavior instead")
- Excuse poor elicitation results ("the knowledge must be tacit")

Hoffman and Lintern's position, backed by decades of empirical work: **"It has never been demonstrated that there exists such a thing as 'knowledge that cannot be verbalized in principle'" (p. 216).**

The real issue isn't tacit knowledge but **inadequate scaffolding**. When elicitation fails, it's usually because:

1. **Insufficient structure**: Unstructured interviews ("tell me what you know") provide no cognitive hooks for the expert to organize their knowledge
2. **Wrong granularity**: Questions too abstract ("describe your general approach") or too specific ("what's the third step?") miss the natural grain of expertise
3. **Missing context**: Without concrete cases or situations, experts struggle to activate relevant knowledge
4. **Poor collaboration**: The elicitor lacks domain understanding to recognize when something important has been said

## What Makes Effective Scaffolding

### Cognitive Support Structures

**Concrete cases as anchors**: The Critical Decision Method leverages experts' detailed episodic memory for challenging cases. Rather than asking "How do you handle X in general?", it asks "Walk me through that tough case from last month." The specificity activates rich, contextualized knowledge.

**Visual externalization**: Concept Mapping provides spatial scaffolding—experts can see the emerging structure, recognize gaps ("oh, but I also need to mention..."), and refine relationships. The external representation serves as working memory extension.

**Systematic probing**: CDM probe questions ("What were you seeing?" "What were you thinking?" "What else could you have done?") provide retrieval cues that structured questioning can't match. They guide attention without prescribing content.

**Incremental building**: Multi-pass methods allow experts to start with gross structure, then refine. First pass: major concepts and relationships. Second pass: add detail, qualifications, exceptions. This matches how experts naturally organize knowledge—from general principles to specific nuances.

### Collaborative Intelligence

The elicitation process combines two types of expertise:

**Expert A (domain practitioner)**: Deep knowledge of the domain, pattern recognition, intuitive sense of what matters, but may lack meta-cognitive awareness of their own reasoning or ability to organize knowledge for others.

**Expert B (cognitive engineer)**: Understanding of knowledge representation, ability to recognize different knowledge types, skill at framing questions and probes, but lacks domain knowledge.

Successful elicitation emerges from this complementary partnership. As Hoffman notes (p. 218): "There is no substitute for the skill of the elicitor (e.g., in framing alternative suggestions and wordings)."

## Implications for Agent Systems

### For Knowledge Acquisition in AI Systems

**Traditional ML approach**: Avoid humans, learn from behavioral data, treat human knowledge as inaccessible.

**Scaffolded approach**: Design interfaces and processes that support humans in articulating what they know, treating knowledge construction as a collaborative human-AI activity.

**Example application**: Rather than having AI agents try to infer debugging strategies purely from code repositories, create scaffolded interfaces where expert debuggers construct knowledge models while solving real problems. The scaffolding might include:
- Visual representation of debugging process flows
- Prompts about decision points ("What made you check that module?")
- Automatic capture of reasoning traces with expert annotation
- Collaborative refinement where AI suggests patterns and expert validates/corrects

### For Agent-to-Agent Knowledge Sharing

When one agent needs expertise from another agent (or from a human expert), the interaction protocol should provide scaffolding:

**Poor**: Generic query ("Agent B, what do you know about X?")

**Better**: Structured query with context ("Agent B, in situation Y, when I observe signals Z, what should I consider?")

**Best**: Case-based, multi-pass elicitation where requesting agent provides concrete scenario, receiving agent walks through reasoning, requesting agent probes key decision points, iterative refinement of shared understanding.

### For Human-Agent Collaboration

When human experts interact with agent systems, the interface should scaffold knowledge transfer in both directions:

**Human → Agent**: Provide concept mapping tools, case-based explanation interfaces, decision replay with annotation capabilities. Make it easy for experts to show their thinking, not just their conclusions.

**Agent → Human**: When agents explain their reasoning, use scaffolded revelation—start with high-level strategy, allow human to probe deeper ("why that branch?" "what alternatives did you consider?"), provide concrete examples, support comparison with human reasoning patterns.

## The Practice of Scaffolded Elicitation

The chapter emphasizes (p. 218): "No matter how much detail is provided about the conduct of a knowledge-elicitation procedure, there is no substitute for practice."

Becoming an "expert apprentice" requires:
- Experience across multiple domains (to recognize patterns in expertise itself)
- Skill at rapid bootstrapping (efficiently learning enough to ask good questions)
- Sensitivity to individual differences (adapting to expert's cognitive style)
- Building trust and rapport (experts share more when comfortable)
- Recognizing significance (knowing when something important has been said)

**For agent system development**: We should treat cognitive task analysis as a core skill, not an occasional activity. Teams building intelligent systems need dedicated "expert apprentices" who specialize in eliciting and representing expert knowledge—not as a one-time project phase but as ongoing organizational capability.

## Boundary Conditions and Failure Modes

**When scaffolding fails**: 
- Expert lacks insight into their own reasoning (rare but exists)
- Domain knowledge is genuinely perceptual-motor (expert can demonstrate but not verbalize)
- Organizational barriers prevent honest disclosure (expert fears job loss, regulatory consequences)
- Insufficient time for iterative refinement (pressure for quick results)

**When to avoid verbal elicitation**:
- Skill is primarily physical (though even here, strategic knowledge can be elicited)
- Rapid, automatic perceptual judgments (supplement with contrived tasks that slow down processing)
- Knowledge truly is just behavioral patterns with no conceptual structure (rare in professional domains)

**Signs you need better scaffolding**:
- Expert frequently says "I don't know" or "I just know"
- Knowledge descriptions stay abstract and generic
- Expert can't provide concrete examples
- Elicited knowledge fails validation with other experts
- Resulting representations don't help domain novices

The key insight: When elicitation struggles, the first hypothesis should be "inadequate scaffolding," not "tacit knowledge."
```

### FILE: the-gold-not-in-documents.md

```markdown
# The Gold Is Not in the Documents: Undocumented Expertise and "True Work"

## The Documentation Illusion

Organizations naturally assume their critical knowledge is documented: procedures manuals, training materials, technical specifications, best practice guides, standard operating procedures (SOPs). When building intelligent systems, the tempting shortcut is to mine these documents—they're readily available, don't require expert time, and seem authoritative.

Hoffman and Lintern deliver a foundational finding from empirical cognitive task analysis: **"The gold is not in the documents" (p. 215).**

More precisely: Documents capture authorized procedures, idealized workflows, and explicit declarative knowledge. They systematically miss the adaptive expertise that makes work actually function.

## What Documents Miss

### Adaptive Heuristics

From weather forecasting (p. 215): An expert predicted fog lifting by counting floor levels visible in downtown buildings. "If I cannot see the 10th floor by 10 AM, pilots will not be able to take off until after lunchtime."

This heuristic:
- Works reliably in local conditions
- Integrates visual observation with temporal patterns
- Requires no instruments
- Will never appear in formal meteorological procedures

**Why it's undocumented**: It's location-specific, depends on tacit perceptual skill, and isn't the "authorized" method (which involves dewpoint spreads and visibility meters).

### Productive Workarounds

The chapter notes (p. 215): "Many observations have been made of how engineers in process control bend rules and deviate from mandated procedures so that they can do their jobs more effectively."

These departures from authorized procedures represent **discovery of the "true work"—cognitive work independent of particular technologies, governed only by domain constraints and human cognitive constraints** (p. 215).

**Critical insight**: "The adaptive process that generates the departures is not only inevitable but is also a primary source of efficient and robust work procedures" (Lintern, 2003, cited p. 215).

Organizations often view procedural deviations as:
- Negligence or shortcuts
- Training failures
- Discipline problems
- Causes of accidents (especially post-accident)

The cognitive engineering perspective: These departures are **expertise in action**—experts adapting to local conditions, handling cases the procedure writers never imagined, finding more efficient paths through complex spaces.

### Context-Sensitive Strategies

Experts develop strategies tuned to:
- Local resource constraints (this particular team, these tools)
- Organizational realities (actual vs. ideal information flows)
- Individual capabilities (leveraging particular strengths)
- Environmental specifics (this geography, this equipment vintage)

Documents capture the generic, idealized case. Experts know the situated particulars.

### Informal Collaboration Patterns

Work Domain Analysis and ethnographic studies reveal:
- Who actually consults whom (vs. org chart)
- Information flows that bypass formal channels
- Tacit coordination mechanisms
- Community-of-practice knowledge sharing

These patterns represent **organizational intelligence** that functions despite, not because of, formal structure.

## Why Documentation Systematically Fails

### The Normative Bias

Documents describe how work **should** be done according to:
- Safety regulations
- Efficiency theories
- Legal requirements
- Management preferences

They rarely describe how work **is actually** done by effective practitioners.

### The Stable World Assumption

Procedures assume:
- Predictable situations
- Available resources
- Functioning equipment
- Sufficient time
- Clear goals

Reality involves:
- Novel combinations
- Resource constraints
- Equipment quirks
- Time pressure
- Competing priorities

Experts navigate this messy reality. Documents describe the tidy version.

### The Articulation Problem

Much expertise develops through extended practice and becomes **compiled knowledge**—patterns recognized directly without conscious decomposition. Experts may not spontaneously articulate this knowledge even when documenting their own procedures.

Example: An expert debugger might write "Check for null pointer errors" without articulating the perceptual patterns that direct attention to likely locations, or the strategic knowledge about when null pointer errors are probable vs. improbable given symptom patterns.

### The Static Medium Problem

Documents freeze knowledge at creation time. Expert knowledge evolves through:
- Experience with new cases
- Tool evolution
- Environmental changes
- Community learning

By the time procedures are officially updated, experts have moved on.

## Implications for Intelligent Agent Systems

### For System Requirements

**Poor approach**: Mine existing documentation for requirements and training data.

**Better approach**: Treat documentation as starting point, then conduct cognitive task analysis to uncover actual expertise.

**Best approach**: Build systems that capture expertise continuously as work happens, treating documentation as one input among many.

### For Agent Skill Libraries

When defining skills for agents, distinguish:

**Procedural skills** (from documentation): Standard, routine, legally mandated procedures that don't require judgment.

**Adaptive skills** (from expertise elicitation): Strategies for handling non-routine cases, workarounds for common obstacles, heuristics for quick assessment.

**Example in code review**:
- Procedural: "Check that all functions have documentation comments" (from style guide)
- Adaptive: "When class names suggest design pattern usage, verify the pattern is correctly implemented" (from expert reviewer heuristic)

The adaptive skills are where intelligence lives, and they're rarely documented.

### For Agent Learning and Refinement

**Observation without understanding fails**: Machine learning from behavioral logs misses the reasoning behind expert actions. An expert's workaround might look identical to a novice's error in behavior logs, but the intentions and understanding differ fundamentally.

**Scaffolded capture during work**: Rather than learning purely from behavior, provide mechanisms for experts to annotate their reasoning as they work:
- Lightweight voice notes explaining non-obvious decisions
- Quick tagging of "unusual situation" cases
- Collaborative post-mortems on challenging cases
- Periodic concept-mapping sessions to organize accumulated insights

### For Multi-Agent Coordination

When multiple agents must collaborate, they need access to:

**Formal protocols**: Who has authority, standard communication patterns, resource allocation rules (from documentation)

**Informal coordination strategies**: Who actually knows what, reliable vs. unreliable information sources, productive shortcuts, coordination breakdowns to avoid (from expertise elicitation)

**Example**: A project management agent consulting documentation learns the official approval workflow (three signatures required). Consulting expert project managers learns that "for urgent decisions under $10K, go to Alice directly—she has delegation authority that's not in the docs, and Bob's approval is just rubber-stamp."

## Discovering Undocumented Expertise

### Signals to Look For

1. **Performance gaps**: Expert practitioners achieve better outcomes than procedure-following novices, despite similar training and tools.

2. **Workaround prevalence**: Frequent deviations from standard procedures, often shared informally among experienced practitioners.

3. **Tribal knowledge**: "Everyone knows to..." statements that don't appear in official documentation.

4. **Tool mismatches**: Tools designed for documented procedures aren't used as intended by experts.

5. **Onboarding struggles**: New employees find documented procedures insufficient for actual work.

### Elicitation Strategies

**Critical incident technique**: Have experts recount challenging cases where they deviated from standard procedures—what triggered the deviation, what they did instead, why it worked.

**Workspace observation**: Watch experts work, noting:
- Information sources they actually consult
- Tools they use vs. ignore
- Communication patterns
- Physical artifacts and arrangements

**Comparison studies**: Compare documented procedure with expert performance in same situation, probing differences.

**"Teach me your shortcuts"**: Explicitly ask experts for their private heuristics, workarounds, and efficiency tricks.

## Ethical and Organizational Considerations

### The Workaround Dilemma

Exposing productive workarounds can lead to:
- Management crackdown ("That's not authorized!")
- Procedure rigidification ("Now everyone must follow the manual")
- Expert vulnerability ("You're not following procedures")

**Responsible approach**: 
- Frame discoveries as "opportunities for procedure improvement"
- Protect expert anonymity when documenting sensitive workarounds
- Work with management to legitimize productive departures
- Distinguish safety-critical procedures (must follow) from efficiency procedures (can adapt)

### Organizational Learning

Organizations that capture undocumented expertise gain:
- **Resilience**: Knowledge preserved when experts leave
- **Training**: Novices learn actual vs. idealized procedures
- **Innovation**: Workarounds suggest process improvements
- **Distributed expertise**: Best practices spread beyond individuals

But this requires cultural shift:
- Deviation ≠ negligence
- Expertise ≠ just following procedures
- Documentation = ongoing learning, not static snapshot

## Boundary Conditions

**When documents ARE sufficient**:
- Highly proceduralized domains with little judgment (assembly line, data entry)
- Legally mandated procedures that must not vary (pharmaceutical manufacturing, financial auditing in some aspects)
- Safety-critical procedures where deviation is genuinely dangerous

**When undocumented expertise matters most**:
- High-consequence, low-frequency events (experts deal with rare situations procedures don't cover)
- Rapidly evolving domains (procedures lag behind reality)
- Ill-structured problems requiring judgment
- Resource-constrained environments requiring efficiency hacks

## For WinDAG-Style Systems

**Knowledge source priority**:
1. Direct expertise elicitation (CDM, Concept Mapping, ethnography)
2. Document analysis (SOPs, manuals, training materials)
3. Behavioral observation and log mining
4. Automated knowledge acquisition tools

**Skill development cycle**:
1. Bootstrap from documentation
2. Validate with expert observation
3. Capture undocumented heuristics through scaffolded elicitation
4. Test on edge cases where documented procedures fail
5. Iterate based on expert feedback

**The key principle**: Treat documents as hypothesis generators, not ground truth. The real expertise emerges through elicitation, observation, and collaborative knowledge construction with practitioners.
```

### FILE: differential-utility-method-selection.md

```markdown
# Differential Utility: Selecting Knowledge Elicitation Methods for Purpose and Context

## The Death of Differential Access

Early knowledge elicitation methodology research pursued the "differential access hypothesis": the idea that different methods might access fundamentally different "types" of knowledge—with some methods uniquely suited to procedural knowledge, others to declarative knowledge, still others to strategic knowledge.

Hoffman and Lintern report the empirical verdict (p. 215): **"A strong version of the differential-access hypothesis has not held up well under scrutiny."** Studies by Shadbolt & Burton (1990) and Adelman (1989) found substantial overlap in knowledge elicited by different methods. "All of the available methods can say things about so-called declarative knowledge, so-called procedural knowledge, and so forth."

This finding might seem to make method selection arbitrary—if all methods access all knowledge types, why prefer one over another? The answer lies in **differential utility**: methods differ not in what they can access but in their **efficiency, applicability, and product form**.

## The Utility Framework

Methods vary along multiple dimensions relevant to project success:

### Efficiency (Yield per Time)

Hoffman's comparative studies (p. 204) measured "yield"—informative propositions elicited per total task time:

**Low efficiency (< 1 proposition/minute)**:
- Unstructured interviews
- Think-aloud problem solving with protocol analysis

**High efficiency (1-2 propositions/minute)**:
- Structured interviews
- Constrained processing tasks
- Tough case analysis
- Concept Mapping

**Practical implication**: For resource-constrained projects, efficiency matters enormously. Protocol analysis might be theoretically rigorous, but if it yields one proposition per two minutes while Concept Mapping yields two propositions per minute, the four-fold difference in productivity is decisive.

### Product Form (What You Actually Get)

Methods differ in their natural output representations:

**CDM produces**:
- Time-lined scenarios
- Decision typologies (recognition, rule-based, creative, etc.)
- Perceptual cues and patterns
- Information requirements for decisions
- Strategy descriptions with metacognitive elements
- "What-if" counterfactual reasoning

**Concept Mapping produces**:
- Semantic networks of domain concepts
- Hierarchical knowledge structures
- Propositions with explicit relationships
- Linked resources (documents, images, videos, other maps)
- Knowledge models that can serve as interfaces or training materials

**Work Domain Analysis produces**:
- Abstraction-Decomposition matrices showing functional structure
- Means-ends relationships across abstraction levels
- Activity overlays showing expert reasoning paths through domain space
- System-level context for individual expertise

### Applicability to Domain Characteristics

Some methods work better in particular domain contexts:

**CDM strengths**:
- Domains with high-consequence decisions
- Time-pressured environments
- Pattern recognition-heavy expertise
- Individual expert reasoning
- Dynamic, evolving situations

**Concept Mapping strengths**:
- Domains with rich conceptual structure
- Stable knowledge that benefits from systematic organization
- Need for knowledge sharing and training
- Building knowledge bases for intelligent systems
- Collaborative knowledge construction

**Work Domain Analysis strengths**:
- Complex sociotechnical systems
- Team coordination contexts
- Understanding system-level constraints
- Safety-critical domains requiring system-level perspective
- Organizational knowledge (not just individual expertise)

### Match to Project Goals

Different projects require different knowledge products:

**Goal: Build expert system knowledge base**
→ Concept Mapping provides structured knowledge in directly usable form

**Goal: Improve decision support for high-stakes decisions**
→ CDM reveals decision requirements and information needs

**Goal: Redesign workspace or interface**
→ Work Domain Analysis + activity overlays show how experts navigate information space

**Goal: Training curriculum development**
→ CDM case studies + Concept Maps of domain knowledge
→ Work Domain Analysis for understanding progression from novice to expert

**Goal: Knowledge preservation before expert retirement**
→ Multiple methods: Concept Mapping for organized knowledge, CDM for strategic reasoning, workspace analysis for situated practices

## Method Combination Strategies

The chapter's standing recommendation (p. 214): **"Any project involving expert knowledge elicitation should use more than one knowledge-elicitation method."**

### Strategic Combinations

**CDM + Concept Mapping**:
- Concept Mapping interviews trigger recall of challenging cases
- Use these cases for CDM incident selection
- CDM case studies become resources hyperlinked to Concept Maps
- Example: Weather forecasting project (Hoffman et al., 2000) used both, with CDM cases illustrating concepts in the STORM knowledge model

**Work Domain Analysis + CDM**:
- WDA identifies safety-significant situations
- CDM probes expert reasoning in those situations
- Example: Naikar & Saunders (2003) used WDA to isolate critical aviation incidents, then CDM interviews with involved personnel

**Document Analysis + Any Interview Method**:
- Documents bootstrap researcher into domain
- Interviews validate, correct, and extend documented knowledge
- Reveals gaps between documented procedures and actual practice

**Ethnography + Structured Methods**:
- Ethnographic observation identifies leverage points and interesting phenomena
- Structured methods (CDM, Concept Mapping) then drill into specific areas
- Observation provides context; structured methods provide depth

### Opportunistic Method Development

The chapter advocates "methodological opportunism" (p. 217)—being open to emerging needs and new method combinations.

**Example from weather forecasting**: Concept Mapping revealed practitioners were comfortable with "mental model" terminology. This led to development of a specialized mental model interview exploring how forecasters' conceptual models differed from computer models (Hoffman, Coffey, & Carnot, 2000).

**Principle**: Methods should serve project needs, not vice versa. When standard methods don't quite fit, adapt or invent, but ground innovations in empirical validation.

## Method Characteristics Matrix

| Method | Efficiency | Primary Product | Best For | Avoid When |
|--------|-----------|-----------------|----------|------------|
| Unstructured Interview | Low | Rapport, domain overview | Project initiation, exploration | Time-constrained, need structured knowledge |
| Structured Interview | High | Specific knowledge on pre-defined topics | Known domain, specific questions | Domain poorly understood |
| Think-Aloud Protocol | Low | Detailed reasoning trace | Research on reasoning processes | Production system building (too slow) |
| CDM | High | Decision strategies, cues, requirements | High-stakes decisions, strategy elicitation | Routine procedural work |
| Concept Mapping | Very High | Semantic networks, knowledge models | Knowledge bases, training materials, preservation | Purely procedural knowledge |
| Work Domain Analysis | Medium | Functional structure, system context | Sociotechnical systems, team coordination | Individual cognitive skills in isolation |
| Tough Cases | High | Boundary knowledge, rare expertise | Handling unusual situations, expert judgment | Routine operations only |
| Ethnography | Low | Contextual understanding, social patterns | Collaborative work, organizational knowledge | Time-constrained projects |

## Implications for Agent System Development

### For WinDAG Skills Requiring Different Knowledge Types

**Diagnostic skills** (debugging, troubleshooting, root cause analysis):
- Primary method: CDM to capture diagnostic strategies
- Support method: Concept Mapping for domain knowledge of failure modes
- Why: Diagnosis is fundamentally about strategic reasoning under uncertainty

**Knowledge retrieval skills** (documentation search, reference lookup):
- Primary method: Concept Mapping to structure domain knowledge
- Support method: Structured interviews about information needs
- Why: Retrieval is about semantic organization and relationships

**Planning skills** (task decomposition, project management, scheduling):
- Primary method: Work Domain Analysis for constraints and resources
- Support method: CDM for planning strategies in complex situations
- Why: Planning requires system-level understanding plus situated reasoning

**Coordination skills** (team formation, delegation, communication):
- Primary method: Ethnography + Social Interaction Analysis
- Support method: Work Domain Analysis for role structure
- Why: Coordination emerges from social and organizational context

### For Iterative System Development

**Phase 1 - Domain Understanding**:
- Document analysis (fast, cheap, provides overview)
- Unstructured expert interviews (build rapport, identify key issues)
- Ethnographic observation (understand context)

**Phase 2 - Knowledge Capture**:
- Concept Mapping (build semantic networks)
- CDM (capture strategic reasoning)
- Work Domain Analysis (map system structure)

**Phase 3 - Validation and Refinement**:
- Tough cases (test boundary conditions)
- Performance observation with think-aloud (validate implemented knowledge)
- Structured interviews targeting gaps

**Phase 4 - Ongoing Learning**:
- Incident analysis using CDM
- Periodic Concept Mapping sessions to capture evolution
- Workspace observation for practice changes

### For Multi-Agent Orchestration

Different agent types need knowledge elicited via different methods:

**Specialist agents** (narrow, deep expertise):
→ Concept Mapping captures domain knowledge
→ CDM captures when and how to apply specialized knowledge

**Coordinator agents** (orchestration, task decomposition):
→ Work Domain Analysis provides system-level understanding
→ Ethnography reveals actual collaboration patterns

**Meta-reasoning agents** (strategy selection, resource allocation):
→ CDM across multiple domains captures decision patterns
→ Cross-domain concept maps reveal strategic principles

**Learning agents** (adaptation, knowledge acquisition):
→ Multiple methods applied longitudinally show knowledge evolution
→ Comparison studies (expert vs. novice) reveal learning trajectories

## Practical Decision Framework

When starting a knowledge elicitation project, ask:

1. **What do we need to know?**
   - Domain concepts/knowledge → Concept Mapping
   - Reasoning/strategies → CDM  
   - System structure/constraints → Work Domain Analysis
   - Social/organizational patterns → Ethnography

2. **What are our constraints?**
   - Time-limited → High-efficiency methods (Concept Mapping, structured interviews)
   - Limited expert access → Methods maximizing yield per session
   - Distributed team → Methods supporting remote collaboration

3. **What will we build?**
   - Knowledge base → Concept Mapping
   - Decision support → CDM
   - Interface/workspace → Work Domain Analysis + ethnography
   - Training system → Multiple methods for complete picture

4. **What expertise do we have?**
   - Experienced cognitive engineers → More complex methods
   - Limited CTA experience → Start with structured interviews, Concept Mapping
   - Access to domain experts long-term → Iterative, multi-method approach

5. **What's our organizational context?**
   - Open culture → Ethnography works well
   - Sensitive domain → Structured methods with confidentiality
   - Distributed organization → Methods supporting remote elicitation

The key insight: **Method selection is a design decision, not a theoretical commitment.** Choose based on project goals, constraints, and domain characteristics, not on assumed superiority of particular methods.
```

### FILE: expertise-beyond-procedures.md

```markdown
# Expertise Beyond Procedures: The Gap Between Knowing and Doing in Complex Systems

## The Procedure Paradox

Organizations invest heavily in developing and documenting procedures: standard operating procedures (SOPs), best practices, work instructions, checklists, decision trees. The implicit model is straightforward: expert knowledge → written procedure → novice follows procedure → expert-level performance.

Hoffman and Lintern's empirical work across domains reveals this model fundamentally misunderstands expertise. **The gap between documented procedures and expert performance isn't a documentation problem—it's a fundamental feature of expertise in complex domains.**

## What Procedures Capture and What They Miss

### What Procedures Capture Well

**Routine sequences**: Step-by-step actions for predictable situations with clear start and end states. "To start the turbine: (1) Check fuel pressure. (2) Verify coolant flow. (3) Engage starter motor..."

**Mandatory constraints**: Safety requirements, legal obligations, regulatory compliance. These MUST be followed without variation.

**Decision criteria**: When conditions are clear and enumerable. "If pressure exceeds 50 PSI, close valve A. If pressure exceeds 75 PSI, close valve B and activate alarm."

**Declarative knowledge**: Facts, definitions, specifications. "Normal operating temperature: 150-180°F. Maximum safe temperature: 200°F."

### What Procedures Systematically Miss

**Perceptual expertise**: Pattern recognition that develops through extensive experience. The weather forecaster counting visible building floors to predict fog lifting (p. 215) exemplifies knowledge that can't be proceduralized—it requires perceptual calibration to local conditions, integration of subtle visual cues, and tacit understanding of temporal patterns.

**Adaptive heuristics**: Strategies that work in practice but violate idealized procedures. The chapter notes (p. 215) how process control engineers "bend rules and deviate from mandated procedures so that they can do their jobs more effectively." These departures aren't negligence—they're adaptive intelligence responding to real-world complexity.

**Contextual reasoning**: Understanding when procedures apply vs. when they need modification. Experts know not just the procedure but its boundary conditions, appropriate variations, and interaction with other procedures.

**Strategic knowledge**: How to approach novel situations, decompose complex problems, prioritize among competing goals. Procedures assume clear problem definition; experts operate when problems themselves are ill-defined.

**Metacognitive skills**: Monitoring one's own understanding, recognizing situations beyond one's competence, knowing when to seek help, adapting strategies based on feedback. These operate at a level above any specific procedure.

## The Compilation Process

A key finding from expertise research: with extensive practice, knowledge that initially required conscious procedural following becomes **compiled**—integrated into fluid, automatic performance.

**Implications for knowledge elicitation**: Experts may not spontaneously articulate compiled knowledge. When asked to describe their procedure for X, experts may provide:
- Overly simplified accounts (missing steps that have become automatic)
- Idealized accounts (what they were taught, not what they do)
- Post-hoc rationalizations (explaining behavior they don't consciously monitor)

This doesn't mean the knowledge is "tacit" or inexpressible. Rather, appropriate scaffolding is required. The CDM, for instance, asks experts to walk through specific cases, which activates episodic memory and reveals the actual reasoning that occurred—including steps and considerations absent from generic procedure descriptions.

## Types of Expert Knowledge Absent from Procedures

### 1. Exception Handling Knowledge

Procedures describe the nominal case. Experts possess rich knowledge of:
- Common failure modes and their signatures
- Cascading effects when components interact unexpectedly
- Workarounds for broken or unavailable resources
- Diagnostic reasoning for atypical situations

**Example**: A procedure might say "If error X occurs, restart system." An expert knows:
- Error X can result from five different root causes
- Three of those causes make restart ineffective or dangerous
- Distinguishing the causes requires checking Y and Z
- If root cause is A, a different intervention entirely is needed

### 2. Situation Assessment Knowledge

Procedures assume situations are pre-classified. Experts possess:
- Recognition of situation types, including rare and hybrid situations
- Cues indicating which procedure (if any) is appropriate
- Understanding of boundary cases where no standard procedure fits
- Ability to construct novel approaches for unprecedented situations

**Critical insight**: Much expertise lies in accurate situation assessment—applying the right procedure to the right situation. Procedure libraries assume situation identification is trivial; it rarely is.

### 3. Prioritization and Goal Management

Procedures typically address single goals in isolation. Real work involves:
- Multiple simultaneous goals with trade-offs
- Shifting priorities based on emerging information
- Resource constraints requiring strategic choices
- Balancing speed vs. thoroughness, safety vs. efficiency

Experts don't just follow procedures—they manage portfolios of goals and dynamically adjust strategies.

### 4. Tool and Environment Knowledge

Procedures describe ideal operations. Experts know:
- Quirks of specific equipment instances
- Workarounds for tool limitations
- How to extract information tools aren't designed to provide
- Environmental factors affecting procedure effectiveness

**Example from weather forecasting**: Computer models provide forecasts, but experts know which models work best in which situations, how to recognize model failure, and how to combine multiple models for robust predictions. This tool-specific meta-knowledge never appears in formal procedures.

### 5. Social and Organizational Intelligence

Work happens in organizational contexts. Experts understand:
- Who actually has needed information (vs. who formally should)
- Communication patterns and shortcuts
- Political constraints and opportunities
- Resource access strategies

Procedures describe formal organizational structure. Experts navigate actual organizational reality.

## Failure Modes: When Procedure-Following Fails

### Brittleness in Novel Situations

**Scenario**: Nuclear power plant operators face unprecedented combination of equipment failures. Procedures address each failure individually but not the combination. Procedure-following operators may apply contradictory interventions or miss critical interactions between failed systems.

**Expert difference**: Experts possess functional understanding of plant systems (captured by Work Domain Analysis) allowing principled reasoning when procedures don't apply.

### Efficiency-Safety Trade-offs

**Scenario**: Following all procedures strictly would make certain time-critical operations impossible. Operators must choose between procedure compliance and operational necessity.

**Expert difference**: Experts understand which procedures are safety-critical (must follow) vs. efficiency-oriented (can adapt), and how to safely deviate when necessary.

### Conflicting Goals and Procedures

**Scenario**: One procedure prioritizes equipment protection; another prioritizes production continuity. In certain states, both cannot be satisfied.

**Expert difference**: Experts recognize the conflict, understand underlying goals, and make principled trade-offs rather than mechanically following whichever procedure is consulted first.

### Context Shifts

**Scenario**: Procedure developed for situation A is applied to superficially similar situation B. The procedure produces harmful results in context B.

**Expert difference**: Experts recognize relevant contextual factors and avoid inappropriate procedure application.

## Implications for Intelligent Agent Systems

### For Skill Design in Multi-Agent Systems

**Procedural skills** are appropriate when:
- Situation clearly identifiable
- Steps well-defined and validated
- Conditions within bounds procedure was designed for
- Following procedure exactly is legally/safety required

**Example**: "Format date according to ISO 8601 standard"

**Strategic skills** are necessary when:
- Situation assessment required
- Trade-offs among competing goals
- Novel combinations of familiar elements
- Resources or tools differ from assumptions
- Time pressure or other constraints affect approach

**Example**: "Diagnose production database performance degradation"

**For WinDAG**: Distinguish skill types explicitly. Procedural skills can be implemented as rigid workflows. Strategic skills require richer knowledge models (captured via CDM and Concept Mapping), situation assessment capabilities, and meta-reasoning about skill applicability.

### For Orchestration and Task Decomposition

**Poor approach**: Treat complex tasks as procedure composition. "To review code: run linter, check style guide, verify tests, examine logic."

**Better approach**: Recognize that task decomposition itself requires expertise. High-level tasks like "code review" don't decompose mechanically—decomposition depends on:
- Code characteristics (new vs. refactor, critical vs. experimental)
- Review goals (security audit vs. maintainability check)
- Available expertise (what does reviewer know)
- Time constraints
- Organizational context

**Implication**: Orchestrator agents need knowledge models of task structure (from Work Domain Analysis) and strategic decomposition knowledge (from CDM) to make intelligent decomposition decisions rather than following fixed templates.

### For Agent Learning and Adaptation

**Learning from procedures alone produces brittle agents**: Agents trained only on documented procedures will fail in the same ways novices fail—applying procedures outside their appropriate context, missing boundary conditions, unable to handle novel situations.

**Learning from expert behavior without understanding fails differently**: Behavior logs show what experts did but not why, risking learning of surface patterns that break in new contexts.

**Better approach**: Combine procedure documentation with elicited expert knowledge:
1. Procedures as baseline for nominal cases
2. CDM to capture strategic reasoning and exception handling
3. Concept Mapping to build semantic models supporting transfer
4. Tough case analysis to identify boundary conditions
5. Ongoing learning from expert annotation of novel situations

### For Human-Agent Collaboration

**Procedure-following agents as tools**: In well-defined contexts, agents strictly following procedures can effectively augment human experts by:
- Handling routine cases, freeing experts for complex ones
- Providing procedure lookup and compliance checking
- Executing procedural steps reliably

**Strategic agents as colleagues**: For complex, judgment-heavy tasks, agents need:
- Situation assessment capabilities
- Strategic knowledge bases (from CDM)
- Ability to explain reasoning (enabled by explicit knowledge models)
- Meta-reasoning about own limitations
- Appropriate requests for human guidance

**Failure mode**: Agents with strategic pretensions but only procedural knowledge will either:
- Fail silently (applying procedures inappropriately)
- Fail loudly (constantly requesting human help)
- Fail dangerously (confident but wrong)

## Capturing Expertise Beyond Procedures

### Design Principles

**1. Assumption of incompleteness**: Treat procedures as starting point, never complete specification. Systematic search for gaps, exceptions, and undocumented knowledge.

**2. Scaffold compilation reversal**: Use methods (CDM, case-based probing) that help experts decompile automated knowledge back into articulable form.

**3. Capture adaptation**: Document not just what should be done but what experts actually do, including productive departures from procedures.

**4. Preserve context**: Link knowledge to situations, constraints, goals—not just abstract procedures.

**5. Honor organizational reality**: Capture informal knowledge sharing, actual communication patterns, workarounds that enable effective work.

### Practical Approaches

**For WinDAG skill development**:

1. **Bootstrap from procedures**: Start with documented SOPs to understand domain.

2. **Observe expert practice**: Watch experts work, noting deviations and adaptations.

3. **Conduct CDM interviews**: Have experts walk through challenging cases, revealing strategic knowledge and exception handling.

4. **Build concept maps**: Capture domain knowledge structure that supports reasoning.

5. **Analyze workspace**: Understand tools, resources, information flows, collaboration patterns.

6. **Test boundary cases**: Have experts work through scenarios at limits of documented procedures.

7. **Iterate with validation**: Test captured knowledge with other experts, refine based on feedback.

### Organizational Integration

**Knowledge preservation programs**: Rather than one-time elicitation, build ongoing practices:
- Regular case debriefs using CDM
- Collaborative concept mapping sessions
- Documentation of significant workarounds
- Expert annotation of unusual situations
- Mentoring relationships that make implicit knowledge explicit

**For organizations using WinDAG**: Treat agent knowledge bases as living systems requiring continuous expert input, not static repositories built once and deployed.

## Boundary Conditions

**When procedures ARE sufficient**:
- Highly routine, fully standardized work
- Safety-critical operations where deviation is genuinely dangerous
- Legal/regulatory contexts requiring strict compliance
- Simple tasks with minimal judgment component

**When expertise beyond procedures is critical**:
- High-consequence, low-frequency events
- Ill-structured problems requiring diagnosis and strategy
- Resource-constrained environments requiring adaptation
- Rapidly evolving domains where procedures lag reality
- Coordination-heavy work depending on social intelligence

The fundamental lesson: **In complex domains requiring judgment, expertise isn't just knowing procedures—it's knowing when and how to go beyond them.**
```

### FILE: proactive-knowledge-preservation.md

```markdown
# Knowledge Elicitation as Ongoing Organizational Practice

## The Traditional Model: One-Time Extraction

Historically, knowledge elicitation was conceived as a discrete project phase:
1. Identify need (build expert system, create training program)
2. Select experts
3. Conduct elicitation sessions
4. Build system or deliverable
5. Deploy and finish

This model treats knowledge as a fixed commodity to be extracted once and encoded permanently. Hoffman and Lintern document why this model fails and what should replace it.

## The Failures of One-Time Elicitation

### Knowledge Evolution

Expert knowledge isn't static. The chapter notes (p. 217): "Documents freeze knowledge at creation time. Expert knowledge evolves through: experience with new cases, tool evolution, environmental changes, community learning."

**Implication**: Systems built from one-time elicitation become obsolete as:
- Experts encounter new case types
- Technology changes
- Domain understanding advances
- Organizational practices evolve
- External environment shifts

**Example**: Weather forecasting knowledge models built before NEXRAD radar systems miss critical expertise about radar interpretation. Models built before ensemble forecasting methods lack strategic knowledge about combining multiple model outputs. A snapshot of 1990s expertise fails to capture 2020s practice.

### The Retirement Crisis

Multiple industries face simultaneous challenges (p. 217):
- Senior experts approaching retirement
- Downsizing leaving gaps in expertise pipeline
- "Boiled frog problem" (Hoffman & Hanes, 2003)—gradual erosion not noticed until crisis emerges
- Insufficient time to transfer decades of experience through traditional apprenticeship

**Case example from electric utilities** (p. 217): Turbine maintenance expert retires. Remaining staff have never performed certain repair procedures—rarely needed but critical when required. Twenty years of diagnostic experience and workaround knowledge walks out the door.

**Traditional response**: Panic-driven documentation projects—experts hastily writing procedures before retirement. Result: incomplete capture of tacit knowledge, no validation, no integration with organizational memory.

### High-Stakes, Low-Frequency Events

Certain expertise is invoked rarely but critically:
- Emergency response procedures
- Rare equipment failures
- Once-per-decade maintenance procedures
- Crisis management strategies

**Problem**: These situations may occur only once in an expert's career. Traditional "10,000 hours" of practice accumulates in other areas. The expertise isn't routine knowledge through repetition but crystallized learning from singular experiences.

**Failure mode**: Organizations don't recognize need for capture until after the crisis, when it's too late to elicit from involved experts who have retired or moved on.

## The Living Knowledge Model

### Continuous Capture as Cultural Practice

The chapter advocates (p. 217): "Instantiation of knowledge capture as part of an organizational culture entails many potential obstacles, such as management and personnel buy-in. It also raises many practical problems, not the least of which is how to incorporate a process of ongoing knowledge capture into the ordinary activities of the experts without burdening them with an additional task."

**Core principle**: Knowledge capture should be integrated into natural work processes, not added as separate burden.

**Mechanisms**:

**1. Routine case debriefs**: After significant events (whether successes or failures), brief structured debriefs using CDM-style probing:
- What made this case challenging?
- What cues indicated the situation type?
- What options were considered?
- What would you do differently?
- What should less experienced colleagues know about cases like this?

**2. Opportunistic documentation**: Make it easy for experts to capture insights in the moment:
- Voice recording tools for quick explanations
- Screen capture with annotation for interface-based work
- Quick "unusual situation" tagging in work logs
- Lightweight incident reporting focused on learning, not blame

**3. Collaborative knowledge modeling**: Regular (quarterly, semi-annual) sessions where experts collectively build/refine concept maps:
- Updates for new domain developments
- Corrections based on recent experience
- Integration of insights from recent challenging cases
- Expansion into previously undocumented areas

**4. Structured mentoring**: Formalize knowledge transfer with specific elicitation goals:
- Junior experts shadow seniors with explicit focus on decision rationale
- Seniors annotate their reasoning for trainees
- Case libraries built collaboratively
- Concept mapping sessions as teaching tool

**5. Technology-mediated capture**: 
- Expert annotation of automated logs ("Here's why I made that unusual choice")
- AI assistance in identifying significant decisions for explanation
- Collaborative platforms for knowledge sharing across distributed teams

### The Videotaping Example

The chapter describes (p. 217) a power utility capturing turbine refitting procedures on video. This work occurs roughly once per decade per plant. Without capture, expertise could be lost between occurrences.

**Key features of this approach**:
- Opportunistic: Captured during actual work, not simulated later
- Minimal disruption: Video crew, but work proceeds normally
- Expert-annotated: Not just filming procedures but capturing expert commentary
- Preserved in context: Shows actual equipment, actual conditions
- Forward-looking: Anticipates future need rather than reacting to crisis

**Generalization**: Any rare-but-critical activity should trigger capture protocols. Organizations should maintain a catalog of low-frequency high-stakes tasks and systematically capture expertise when these tasks occur.

### Knowledge Models as Living Documents

The STORM project (Figure 12.5, p. 212) demonstrates knowledge models as living repositories:
- 150+ concept maps about weather forecasting
- Hyperlinked resources (satellite imagery, model outputs, video explanations)
- Ongoing expansion (dozens more maps identified as needed)
- Multiple experts contributing
- Real-time data integration
- Serves as operational tool, not just archive

**Design principles**:
- **Modular**: Add new maps without restructuring entire model
- **Hyperlinked**: Easy navigation between related concepts
- **Multi-format**: Text, images, video, live data all integrated
- **Expert-accessible**: Experts can add/edit directly, not requiring technical intermediaries
- **Version-controlled**: Track evolution over time
- **Validated**: Multiple experts review and refine

## Implications for Intelligent Agent Systems

### For WinDAG Architecture

**Traditional architecture**: Static skill library, frozen knowledge bases, periodic manual updates.

**Living knowledge architecture**:
- Skills with versioned knowledge components
- Automatic integration of expert annotations
- Collaborative refinement interfaces
- Change tracking and impact analysis
- Graceful evolution without system-wide rebuilding

**Components needed**:

**1. Knowledge capture infrastructure**:
- Lightweight annotation tools for experts
- Case library with automatic CDM-style prompts
- Concept mapping interfaces accessible during work
- Integration with existing workflows

**2. Knowledge integration pipelines**:
- Expert contributions reviewed by domain and technical experts
- Validation against existing knowledge models
- Conflict resolution mechanisms
- Incremental skill updates

**3. Knowledge evolution tracking**:
- Version history for all knowledge components
- Attribution (who contributed what)
- Change impact analysis (which skills affected by knowledge update)
- Rollback capabilities

**4. Organizational memory**:
- Case libraries of challenging situations
- Expert decision rationales
- Workaround documentation
- Lessons learned from failures

### Agent as Knowledge Capture Partner

Rather than agents learning passively from behavior logs, design agents to actively participate in knowledge capture:

**Scenario**: Agent monitors expert performing task.

**Traditional**: Agent logs expert's actions for later machine learning.

**Active capture**: Agent asks questions:
- "I notice you chose X instead of Y. What factors influenced that decision?"
- "This situation differs from standard procedure Z. What made the difference?"
- "You checked A before B. Does sequence matter, or just both being done?"

**Result**: Expert articulates reasoning, agent captures explicit knowledge, annotation is lightweight (voice response to questions, not writing documentation).

### Distributed Expertise Integration

Modern organizations often have expertise distributed across:
- Geographic locations
- Organizational divisions
- Generations of practitioners
- Specialty areas

**Problem**: Local expertise doesn't propagate. The turbine expert in Plant A's knowledge doesn't reach Plant B until Plant B faces the same problem.

**WinDAG solution**: Agents as knowledge aggregators:
- Collect expertise from distributed sources
- Identify commonalities and variations
- Present integrated knowledge models
- Route questions to appropriate experts
- Facilitate expert-to-expert connection

**Example**: Agent notices expert A solved a problem using approach X. Agent asks expert B about similar problems. Expert B uses different approach Y. Agent facilitates comparison:
- Documents both approaches with context
- Identifies when each approach is preferable
- Creates comparative case studies
- Updates knowledge models with both strategies

### Proactive Knowledge Preservation

**Trigger**: Expert announces retirement in 6 months.

**Traditional response**: Panic, hasty documentation, incomplete capture.

**Systematic response** (leveraging ongoing capture culture):

**Month 1-2: Assessment**
- Review expert's case contributions over career
- Identify unique expertise areas
- Prioritize based on risk (rare, high-stakes, no redundancy)
- Schedule intensive elicitation sessions

**Month 3-4: Intensive capture**
- CDM sessions on significant cases from career
- Concept mapping of specialized domain areas
- Video capture of physical/perceptual skills
- Workspace analysis documenting tools and artifacts

**Month 5-6: Validation and transfer**
- Other experts review captured knowledge
- Training sessions with junior experts using new materials
- Expert refines and corrects representations
- Integration into organizational knowledge base

**Post-retirement**:
- Expert available (consultatively) for clarification
- Junior experts report gaps encountered
- Continuous refinement based on application

## Organizational Enablers

### Management Support

Knowledge capture as ongoing practice requires:
- Time allocation (experts aren't "wasting time" talking instead of working)
- Resource investment (tools, facilitation, infrastructure)
- Cultural shift (departure from "just do your job")
- Performance metrics that value knowledge contribution

### Incentive Alignment

**Anti-patterns that kill knowledge sharing**:
- Expert job security based on exclusive knowledge ("if I tell you, you replace me")
- Promotion based solely on deliverables, not knowledge contribution
- "Not invented here" culture discouraging cross-boundary learning
- Blame culture making honest error discussion dangerous

**Productive patterns**:
- Recognition for knowledge contribution
- Career paths valuing teaching and mentoring
- Collaborative performance metrics
- Psychological safety for discussing mistakes

### Technology Infrastructure

Ongoing knowledge capture requires:
- Low-friction capture tools (voice notes, quick tagging, screen recording)
- Collaborative platforms for knowledge building
- Integration with existing work systems (not separate "knowledge management" application)
- Search and retrieval making captured knowledge accessible
- Version control and change tracking

### Community of Practice

Knowledge capture works best as community activity:
- Regular knowledge-sharing sessions
- Expert forums for discussing challenging cases
- Collaborative concept mapping events
- Peer review of contributed knowledge
- Cross-training and job shadowing programs

## Metrics and Evaluation

How do you know ongoing knowledge capture is working?

**Leading indicators**:
- Frequency of expert contributions
- Breadth of participation (not just designated "knowledge champions")
- Integration with daily work (not seen as extra burden)
- Cross-referencing and building on others' contributions

**Lagging indicators**:
- Reduced time for onboarding new employees
- Successful handling of rare situations by less experienced staff
- Knowledge preservation before retirements
- Fewer repeated mistakes
- Faster problem resolution

**Warning signs**:
- Contribution concentrated in few individuals
- Captured knowledge not being used
- Experts view process as bureaucratic burden
- Management unsupportive of time investment

## Boundary Conditions

**When ongoing capture is most valuable**:
- Long expertise development time (years to decades)
- High consequences of knowledge loss
- Expertise distributed across individuals and locations
- Rapidly evolving domain (constant new learning)
- Demographics indicating coming retirements

**When less critical**:
- Highly standardized work with complete documentation
- Short expertise development cycle (weeks to months)
- Expertise easily transferable through formal training
- Stable domain with little evolution
- Young workforce with long retention

**Resource considerations**: Ongoing knowledge capture requires sustained organizational commitment. For small organizations or resource-constrained contexts, focus on:
- Highest-risk expertise (rare, critical, single expert)
- Opportunistic capture (when rare events occur)
- Minimal-burden methods (voice notes, existing collaboration tools)
- Leverage natural mentoring relationships

## The Big Picture

The shift from one-time extraction to ongoing practice represents a fundamental reconception of organizational learning. Knowledge isn't a commodity to be extracted and stored but a living capability to be cultivated and evolved.

For intelligent agent systems, this means:
- Agents as continuous learners, not static deployments
- Expert-agent collaboration as ongoing dialogue
- Knowledge models as living documents
- Organizations as learning systems with agents as integral participants

The goal isn't to replace experts with systems but to create sociotechnical ecosystems where expertise is preserved, shared, evolved, and amplified—with intelligent agents as enablers and partners in that continuous process.
```

### FILE: elicitation-as-collaborative-discovery.md

```markdown
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
```

## SKILL ENRICHMENT

- **Task Decomposition Skills**: Apply Work Domain Analysis principles to understand functional constraints and abstraction levels when breaking down complex tasks. Use the three-level knowledge architecture (domain structure, knowledge, reasoning) to ensure decomposition captures not just what steps to execute but what knowledge enables strategy selection and what reasoning guides adaptation.

- **Code Review and Architecture Assessment**: Recognize the gap between documented standards and expert practice—look for productive workarounds and adaptive heuristics that indicate where formal patterns fail. Apply CDM-style probing when reviewing unusual design decisions: "What made this situation different? What alternatives were considered?" Build concept maps of architectural patterns and their relationships to improve shared understanding.

- **Debugging and Troubleshooting**: Leverage the three representational levels: domain structure (what can fail and how), conceptual knowledge (failure modes and signatures), and reasoning strategies (diagnostic processes). Use CDM techniques to capture expert debugging strategies—not just what was checked but why, what cues mattered, what alternatives were considered.

- **Security Auditing**: Recognize that documented security procedures miss adaptive attacker strategies and context-specific vulnerabilities. Elicit from security experts their pattern recognition for suspicious activity, strategic reasoning about attack vectors, and heuristics for risk assessment. Build living knowledge models of threat landscapes that evolve as new attacks emerge.

- **Requirements Analysis**: Apply scaffolding principles when eliciting requirements from domain experts who struggle to articulate needs. Use concept mapping to help stakeholders externalize and organize their domain knowledge. Employ CDM-style case walkthroughs to uncover implicit requirements revealed only in concrete scenarios.

- **System Design and Architecture**: Work Domain Analysis provides powerful framework for understanding functional requirements at multiple abstraction levels. Map not just components but means-ends relationships showing how lower-level implementations serve higher-level goals. Overlay activity patterns showing how users actually navigate the system, not just theoretical workflows.

- **Testing Strategy Development**: Capture expert testers' strategic knowledge about where bugs hide, what combinations are risky, how to efficiently explore state spaces. Recognize that test plans document nominal cases; elicit from experts their knowledge of boundary conditions, interaction effects, and scenarios the spec writers didn't imagine.

- **Knowledge Management and Documentation**: Shift from static documentation to living knowledge models using ongoing elicitation practices. Implement opportunistic capture when rare but critical situations occur. Design documentation interfaces that support collaborative refinement, not just read-only consumption.

- **Technical Mentoring and Training**: Use concept mapping and CDM to make expert reasoning visible to learners. Scaffold novice articulation of their developing understanding. Recognize compiled expertise in senior practitioners and use elicitation methods to decompile it for teaching.

- **Agent Orchestration Meta-Skills**: Apply differential utility principle to agent coordination—different coordination patterns work for different task types and team compositions. Treat orchestration knowledge as expert knowledge requiring elicitation: when do you decompose vs. assign monolithically? When do you route to specialist vs. generalist? Build conceptual models of task structure to guide decomposition decisions.

## CROSS-DOMAIN CONNECTIONS

**Agent Orchestration**: The three-level architecture directly maps to orchestration requirements. Domain structure knowledge (Level 1) informs task decomposition and constraint recognition. Conceptual knowledge (Level 2) enables semantic understanding for routing and skill selection. Reasoning strategies (Level 3) guide adaptive orchestration when standard patterns don't fit. Orchestrators need Work Domain Analysis-style understanding of system functional structure plus CDM-captured strategic knowledge for handling non-routine coordination challenges.

**Task Decomposition**: Work Domain Analysis reveals natural decomposition boundaries through abstraction levels and means-ends relationships. The Abstraction-Decomposition matrix shows which subtasks serve which goals, enabling principled decomposition rather than arbitrary splitting. Activity overlays showing expert navigation patterns reveal effective decomposition strategies. Critical: decomposition itself requires strategic knowledge (Level 3)—how to decompose depends on task characteristics, resource constraints, and goals, not just task structure.

**Failure Prevention**: The "gold is not in documents" principle is crucial for safety-critical systems. Documented procedures miss adaptive practices experts use to maintain safety. Productive workarounds and rule-bending often represent evolved safety wisdom. Failure analysis should use CDM to capture expert reasoning during incidents—not just what happened but what was thought, what cues were missed or misinterpreted, what strategies might prevent recurrence. Build living knowledge models of failure modes and prevention strategies that evolve with organizational learning.

**Expert Decision-Making**: CDM specifically designed to capture expert decision-making under uncertainty, time pressure, and high stakes. Reveals perceptual cues experts monitor, decision types and strategies, information requirements, metacognitive awareness. For agent systems, this translates to: what information must be available for particular decisions, what patterns trigger which strategies, how to handle decision uncertainty, when to escalate to human expertise. Multi-pass retrospection protocol is directly applicable to building agent decision logic grounded in actual expert practice.

**Human-Agent Collaboration**: Scaffolding principles apply to human-agent interfaces. Poor interfaces force humans to articulate knowledge in agent-friendly but human-awkward forms. Better interfaces scaffold human articulation—concept mapping tools, case-based interaction, visual representations. Best: bidirectional scaffolding where agent helps human externalize knowledge and human helps agent contextualize its processing. Treat collaboration as knowledge co-construction, not information transfer. Agents as expert apprentices who learn by asking good questions, not just observing behavior.

**Distributed Intelligence**: Transactional view of knowledge—existing not just in individuals but in tools, artifacts, communication patterns, organizational practices—maps directly to multi-agent systems. System intelligence emerges from agent interactions, shared representations, and evolved coordination patterns, not just individual agent capabilities. Design for emergent collaborative intelligence: agents contribute to shared knowledge models, challenge each other's conclusions, integrate distributed perspectives, evolve collective understanding. Knowledge elicitation becomes knowledge sharing among human and artificial agents.

**Continuous Learning**: The shift from one-time elicitation to ongoing practice applies to agent systems. Agents should continuously learn from expert interactions, not just during initial training. Implement lightweight capture mechanisms: expert annotations of agent decisions, CDM-style questioning after challenging cases, collaborative concept map refinement. Build living knowledge bases that evolve with domain, not static deployments. Agents as organizational learning partners, not just deployed artifacts.

---

## BOOK IDENTITY REVISITED

**What Makes This Book Irreplaceable**: 

This chapter uniquely combines:
1. **Historical depth** showing evolution from AI expert systems through cognitive task analysis to modern knowledge management
2. **Methodological rigor** grounded in comparative empirical studies across decades
3. **Practical wisdom** from hundreds of actual projects across diverse domains (weather forecasting, nuclear power, aviation, medicine, etc.)
4. **Sophisticated epistemology** moving beyond naive extraction to collaborative co-construction view
5. **Actionable guidance** with specific methods (CDM, Concept Mapping, Work Domain Analysis) that actually work
6. **Systems thinking** connecting individual expertise to organizational learning and sociotechnical design

The irreplaceable contribution is showing that **expert knowledge elicitation is both possible and essential, but requires fundamentally different approaches than naive "just ask them" or "just watch them" methods**. The three-level architecture, the scaffolding principle, and the recognition of undocumented expertise provide frameworks unavailable anywhere else for thinking about how intelligent systems can actually acquire and use expert knowledge.

**Three Core Ideas to Remember**:

1. **Three-Level Architecture**: Expert knowledge must be captured at three distinct levels—domain structure, conceptual knowledge, and reasoning strategies—each requiring different methods and serving different purposes in system design.

2. **Scaffolding Over Extraction**: The "tacit knowledge" problem is really an inadequate scaffolding problem. Good elicitation methods provide cognitive supports (concrete cases, visual representations, systematic probes, iterative refinement) that enable experts to articulate what they know.

3. **The Gold Is Not in Documents**: Expert knowledge that makes work actually function—adaptive heuristics, productive workarounds, context-specific strategies, perceptual expertise—systematically fails to appear in documented procedures. Elicitation must go beyond documents to capture "true work" and the adaptive intelligence that handles real-world complexity.

These three ideas, properly understood and applied, fundamentally change how one builds intelligent systems—shifting from hoping to infer expertise from data to systematically constructing it through collaborative discovery with actual experts.