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