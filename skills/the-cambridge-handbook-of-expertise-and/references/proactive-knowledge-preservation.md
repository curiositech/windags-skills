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