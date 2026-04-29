---
name: the-cambridge-handbook-of-expertise-and
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  mutationPolicy: skip
  tags:
  - imported
  - needs-review
  provenance:
    kind: imported
    source: legacy-recovery
---
# SKILL: Expert Knowledge Elicitation and Representation

license: Apache-2.0
## Metadata
- **Name**: expert-knowledge-elicitation
- **Source**: *Eliciting and Representing the Knowledge of Experts* (Hoffman & Lintern)
- **Domain**: Knowledge engineering, cognitive systems, organizational learning
- **Triggers**: 
  - Designing systems that require expert-level decision-making
  - Capturing knowledge from retiring or departing experts
  - Understanding why documented procedures fail in practice
  - Building human-agent collaborative systems
  - Analyzing expert performance for training or automation
  - Investigating failures in complex sociotechnical systems

## When to Use This Skill

Load this skill when facing:

- **The Documentation Gap**: Official procedures exist but systems still fail; need to understand "true work"
- **Knowledge Preservation**: Critical expertise at risk due to turnover, retirement, or organizational change
- **Intelligent System Design**: Building agents/tools that must reason like domain experts
- **Performance Analysis**: Understanding why experts succeed where novices fail
- **Collaboration Design**: Creating effective human-agent or human-human knowledge sharing
- **Training Development**: Need to teach not just facts but expert reasoning strategies
- **Failure Investigation**: System failures despite procedure compliance; need deeper understanding

**Anti-use cases**: Simple procedural tasks, well-documented routine work, contexts where expertise doesn't exist yet (pure innovation vs. refined practice)

## Core Mental Models

### 1. The Three-Level Architecture

Expert knowledge exists at three distinct levels, each requiring different methods and serving different purposes:

**Level 1: Work Domain Structure** (What the world contains)
- Functional relationships, constraints, physical laws governing the domain
- Example: In power grid management—electrical physics, grid topology, load dynamics
- Captured via: Work Domain Analysis, abstraction-decomposition matrices
- Purpose: Understanding task constraints, enabling principled reasoning about domain

**Level 2: Conceptual Knowledge** (What experts know about the domain)
- Domain concepts, categories, relationships, mental models
- Example: "Load shedding," "cascade failure," "frequency stability"—expert terminology and concept networks
- Captured via: Concept mapping, card sorting, structured interviews
- Purpose: Shared vocabulary, semantic understanding, knowledge organization

**Level 3: Reasoning Strategies** (How experts think through problems)
- Decision-making heuristics, perceptual cues, problem-solving strategies
- Example: "When frequency drops below X and Y is rising, consider Z before standard procedure"
- Captured via: Critical Decision Method, think-aloud protocols, case studies
- Purpose: Adaptive intelligence, handling non-routine situations, expert-level performance

**Critical insight**: Most failed systems conflate these levels—they capture concepts (L2) but miss reasoning strategies (L3), or document procedures without understanding functional constraints (L1). Effective systems require all three.

### 2. Scaffolding Over Extraction

The "tacit knowledge problem" is a methodological failure, not a fundamental barrier:

**The myth**: Experts possess inexpressible, unconscious knowledge that resists articulation
**The reality**: Poor elicitation methods fail to provide adequate cognitive scaffolding

**Effective scaffolding principles**:
- Ground discussion in concrete cases, not abstract generalizations
- Use visual/spatial representations (concept maps, diagrams) to externalize thinking
- Multi-pass retrospection: revisit the same case with different analytical lenses
- Collaborative discovery stance: "Let's figure this out together" not "Tell me what you know"
- Challenge and probing: respectful questioning that surfaces unstated assumptions

**Diagnostic marker**: When experts say "I've never thought about it this way, but..." you've achieved good scaffolding—they're discovering their own knowledge through the elicitation process.

### 3. The Gold Is Not in the Documents

Critical expertise exists outside official procedures—adaptive heuristics, workarounds, "naughty" departures:

**Why procedures miss expertise**:
- Written for liability/compliance, not actual practice
- Cannot anticipate all contextual variations experts handle
- Experts develop efficient shortcuts through experience
- Productive rule-bending represents evolved wisdom, not negligence

**What's missing from documentation**:
- Perceptual cues that trigger strategy selection
- Context-dependent trade-offs and judgment calls
- Workarounds for known system/process limitations
- Pattern recognition shortcuts ("smells like X situation")
- Metacognitive awareness ("this is where novices typically err")

**Implication for system design**: Systems built only from documented procedures will be brittle, inefficient, and miss the actual intelligence that makes work succeed.

### 4. Differential Utility, Not Differential Access

Methods differ in what they're *useful for*, not what knowledge types they can "access":

**Failed hypothesis**: Different methods tap different knowledge types (declarative vs. procedural, conscious vs. unconscious)
**Validated finding**: All methods can elicit all knowledge types given sufficient effort, but efficiency and naturalness differ dramatically

**Method-to-purpose matching**:
- **Critical Decision Method**: Excellent for reasoning strategies, decision cues, uncertainty handling
- **Concept Mapping**: Efficient for domain knowledge structure, terminology, relationships
- **Work Domain Analysis**: Superior for functional constraints, system relationships, goal hierarchies
- **Simulated Tasks**: Good for procedural knowledge, revealing implicit assumptions through errors
- **Contrasting Cases**: Effective for discrimination criteria, category boundaries

**Selection principle**: Match method to project goals and expert's natural articulation style, not to assumed "knowledge type."

### 5. Knowledge Elicitation as Ongoing Practice

Shift from one-time extraction project to continuous organizational capability:

**Traditional model** (limited): KE as discrete phase in system development—identify need → extract knowledge → build system → done

**Mature model** (sustainable): KE as ongoing practice integrated into organizational culture:
- Regular capture sessions integrated into project retrospectives
- Mentoring relationships structured around knowledge articulation
- Collaborative concept maps as living organizational knowledge bases
- Post-incident CDM sessions for continuous learning
- Lightweight capture tools embedded in normal workflow

**Organizational contexts requiring ongoing KE**:
- Distributed expertise (knowledge scattered across specialists)
- Rare-event domains (limited learning opportunities)
- High-turnover environments (continuous knowledge loss risk)
- Rapid domain evolution (expertise constantly updating)
- Safety-critical systems (failure lessons must be captured and shared)

## Decision Frameworks

### When selecting elicitation methods:

**IF** you need to understand expert reasoning during challenging decisions  
**THEN** use Critical Decision Method with concrete past incidents  
**BECAUSE** abstract hypotheticals miss context-dependent factors experts actually use

**IF** building shared vocabulary or knowledge bases  
**THEN** start with concept mapping sessions  
**BECAUSE** visual representation scaffolds articulation and reveals organizational knowledge gaps

**IF** designing systems for complex domains with multiple goals  
**THEN** conduct Work Domain Analysis first  
**BECAUSE** understanding functional structure prevents brittle procedural automation

**IF** experts struggle to articulate knowledge in interviews  
**THEN** switch to case-based or simulation methods  
**BECAUSE** performance reveals knowledge that introspection misses

**IF** documented procedures exist but systems still fail  
**THEN** investigate the gap between "work-as-imagined" and "work-as-done"  
**BECAUSE** critical adaptive expertise lives in undocumented practice

### When designing intelligent systems:

**IF** the system must handle non-routine situations  
**THEN** capture Level 3 reasoning strategies, not just Level 2 concepts  
**BECAUSE** brittle rule-following fails when conditions change

**IF** building human-agent collaboration  
**THEN** design bidirectional scaffolding interfaces  
**BECAUSE** collaboration is knowledge co-construction, not information transfer

**IF** experts will work alongside the system  
**THEN** capture expert perceptual cues and decision triggers  
**BECAUSE** agents need to understand what experts monitor and why

**IF** domain knowledge evolves rapidly  
**THEN** build continuous learning mechanisms, not static deployment  
**BECAUSE** one-time capture creates frozen knowledge that decays

### When facing organizational knowledge challenges:

**IF** critical expert is retiring  
**THEN** conduct CDM sessions on their most challenging past cases  
**BECAUSE** difficult cases reveal strategic knowledge that routine work doesn't

**IF** team needs shared understanding  
**THEN** create collaborative concept maps, not individual interviews  
**BECAUSE** shared artifact construction reveals and resolves conceptual conflicts

**IF** investigating system failure  
**THEN** use multi-pass retrospection with involved practitioners  
**BECAUSE** single-pass incident reports miss evolving understanding and contextual factors

**IF** knowledge exists across distributed specialists  
**THEN** use contrasting cases to elicit discrimination criteria  
**BECAUSE** specialists best articulate expertise by comparing domains

## Reference Documentation

| File | When to Load | Contents |
|------|-------------|----------|
| `three-level-knowledge-architecture.md` | Designing knowledge representation schemas; deciding what to capture; structuring knowledge bases | Detailed explanation of domain structure vs. conceptual knowledge vs. reasoning strategies; why conflating levels causes system brittleness; mapping methods to levels |
| `scaffolding-over-extraction.md` | Elicitation sessions producing shallow results; experts saying "I just know"; designing interview protocols | Why "tacit knowledge" is methodological failure; principles of effective cognitive scaffolding; collaborative discovery techniques; diagnostic markers of good scaffolding |
| `the-gold-not-in-documents.md` | Systems failing despite procedure compliance; understanding expert workarounds; investigating work-as-done vs. work-as-imagined | Why critical expertise doesn't appear in documentation; types of undocumented knowledge; methods for surfacing adaptive practices; handling "naughty" but productive rule-bending |
| `differential-utility-method-selection.md` | Choosing elicitation methods; comparing method trade-offs; planning elicitation strategy | Why differential access hypothesis failed; utility-based method selection; strengths/weaknesses of CDM, concept mapping, WDA, simulations; matching methods to goals |
| `expertise-beyond-procedures.md` | Designing training; understanding expert vs. novice performance; building systems that support expertise | The procedure paradox; what experts know that procedures don't capture; perceptual learning and cue recognition; contextual adaptation strategies |
| `proactive-knowledge-preservation.md` | Building organizational KE capability; knowledge management strategy; addressing expert turnover; learning from rare events | Shifting from project-based to ongoing practice; integrating KE into workflow; lightweight capture mechanisms; building living knowledge bases; organizational adoption strategies |
| `elicitation-as-collaborative-discovery.md` | Designing elicitation sessions; training knowledge engineers; understanding interviewer-expert dynamics | Paradigm shift from extraction to co-construction; collaborative session design; role of respectful challenge; knowledge creation during elicitation; expert-as-partner principles |

## Anti-Patterns

**1. Checklist Reductionism**
- **Mistake**: Reducing expert knowledge to simple checklists or decision trees
- **Why harmful**: Misses context-dependent judgment, adaptive strategies, exception handling
- **Reality**: Experts use checklists as memory aids within rich strategic understanding
- **Detection**: System handles routine cases but fails on edge cases experts routinely manage

**2. The Documentation Delusion**
- **Mistake**: Assuming critical knowledge exists in procedures, manuals, or documentation
- **Why harmful**: Misses adaptive heuristics, workarounds, and contextual judgment that make work succeed
- **Reality**: Documentation captures work-as-imagined; expertise lives in work-as-done
- **Detection**: Complaints that "the system doesn't understand how we really work"

**3. Single-Method Monogamy**
- **Mistake**: Using only interviews, or only observation, or only documentation review
- **Why harmful**: No single method captures all three knowledge levels effectively
- **Reality**: Comprehensive understanding requires methodological triangulation
- **Detection**: Knowledge base has gaps (rich concepts but no reasoning strategies, or procedures without functional understanding)

**4. Abstract Hypothetical Questioning**
- **Mistake**: Asking "What would you do if..." or "How do you generally handle X?"
- **Why harmful**: Produces textbook answers, not actual expertise; misses contextual factors
- **Reality**: Expert knowledge is case-based and context-dependent
- **Detection**: Experts give generic answers; knowledge doesn't match observed performance

**5. One-and-Done Extraction**
- **Mistake**: Treating KE as discrete project phase—capture once, then deploy
- **Why harmful**: Domain knowledge evolves; expertise develops; organizational memory decays
- **Reality**: Effective KE is ongoing organizational practice, not one-time event
- **Detection**: Deployed systems become increasingly disconnected from current practice

**6. The Tacit Knowledge Excuse**
- **Mistake**: Attributing elicitation failure to "unconscious/inexpressible knowledge"
- **Why harmful**: Blames fundamental barriers instead of methodological inadequacy
- **Reality**: Poor scaffolding, not tacit knowledge, causes most articulation failures
- **Detection**: Switching methods or improving scaffolding suddenly reveals "inexpressible" knowledge

**7. Conflating Knowledge Levels**
- **Mistake**: Not distinguishing domain structure, conceptual knowledge, and reasoning strategies
- **Why harmful**: Produces confused representations that serve no purpose well
- **Reality**: Each level requires different methods and supports different system capabilities
- **Detection**: Knowledge base contains mixed content types without clear organizational principle

## Shibboleths: Distinguishing Deep Understanding

### Someone has truly internalized this book if they:

**1. Immediately ask "Which level?"**
- When discussing knowledge capture, they instinctively distinguish: "Are we talking about domain structure, conceptual knowledge, or reasoning strategies?"
- They don't treat "expert knowledge" as monolithic

**2. Recognize productive rule-bending**
- They don't assume deviation from procedures indicates negligence
- They actively investigate workarounds as potential sources of evolved wisdom
- They understand "naughty" departures may be more intelligent than compliance

**3. Diagnose elicitation problems methodologically**
- When experts struggle to articulate, they change scaffolding, not blame tacit knowledge
- They say things like "Let's try grounding this in a specific case" or "Can we map this visually?"

**4. Match methods to purposes, not knowledge types**
- They don't say "We'll use CDM for procedural knowledge and interviews for declarative"
- They say "CDM for reasoning strategies, concept mapping for domain structure, WDA for functional constraints"

**5. Spot documentation gaps automatically**
- When reviewing procedures, they immediately ask "But what do experts actually do when X happens?"
- They assume documentation misses critical adaptive strategies

**6. Think in terms of continuous practice, not one-time extraction**
- They design ongoing capture mechanisms, not just project-based elicitation
- They integrate KE into normal organizational workflow

**7. Use the transactional view of knowledge**
- They look for knowledge in interactions, artifacts, tools, and practices—not just individual minds
- They design for emergent collective intelligence, not knowledge transfer

### Surface-level understanding reveals itself when someone:

- Treats all knowledge elicitation as "interviewing subject matter experts"
- Assumes documentation captures critical knowledge
- Blames "tacit knowledge" when elicitation produces shallow results
- Thinks procedures and expertise are the same thing
- Designs one-time extraction projects instead of ongoing capability
- Doesn't distinguish between knowing what the domain contains vs. how experts reason about it
- Believes a single method (usually interviews) can capture everything important

### The ultimate shibboleth:

**Deep understanding**: "We need to understand not just what experts know about power grids (L2 concepts), but also how the grid itself functions (L1 domain structure) and how experts reason when standard operating conditions break down (L3 strategies). We'll use WDA for functional relationships, concept mapping for terminology and models, and CDM on the blackout incident for decision-making under uncertainty. And we'll build this as ongoing practice, not one-time capture."

**Surface understanding**: "We should interview the senior engineers to document their knowledge of power grid operations, then build a knowledge base from the transcripts."

The difference is immediate, structural, and reveals whether someone grasps the fundamental architecture of expert knowledge or is still operating in the failed extraction paradigm.