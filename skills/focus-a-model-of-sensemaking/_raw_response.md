## BOOK IDENTITY

**Title**: FOCUS: A Model of Sensemaking (Technical Report 1200)

**Author**: Winston R. Sieck, Gary Klein, Deborah A. Peluso, Jennifer L. Smith, and Danyele Harris-Thompson (Klein Associates, Inc.)

**Core Question**: How do people—especially experts—develop, maintain, and revise their understanding of complex, ambiguous situations when confronted with conflicting information, surprises, or anomalies?

**Irreplaceable Contribution**: This research provides the only comprehensive cognitive model—the Data/Frame Model—that explicitly describes sensemaking as a dynamic, reciprocal interaction between incoming data and interpretive frames. Unlike models focused on situation awareness as a state, this work unpacks sensemaking as an active *process* involving six distinct functions (Elaborating, Questioning, Preserving, Comparing, Seeking, Re-framing). Most uniquely, it reveals that experts don't use fundamentally different strategies than novices—they use fragmentary mental models and maintain stricter separation between sensemaking and decision-making. This challenges the assumption that expertise training should focus on teaching "expert thinking patterns" and instead suggests building richer knowledge structures and questioning disciplines.

## KEY IDEAS (3-5 sentences each)

1. **Sensemaking is Fitting Data Into Frames and Frames Around Data**: Understanding emerges from a reciprocal relationship where frames (mental models, stories, schemas) guide which data we notice and how we interpret it, while data challenges, confirms, or forces revision of frames. This is not a linear information-processing sequence but a continuous, interactive loop. The frame provides context, defines relevance, filters noise, and describes relationships—it is the "story" that makes data meaningful.

2. **Expert Superiority Comes From Knowledge Structures, Not Sensemaking Strategies**: Experts and novices follow essentially the same sensemaking processes (both elaborate frames, question anomalies, etc.), but experts possess richer fragmentary mental models (FMMs)—localized cause-effect connections, patterns, and rules-of-thumb that can be rapidly assembled "just-in-time." Experts also maintain tighter cognitive control, completing their sensemaking before moving to decision-making, whereas novices intermix these processes. Training should focus on building domain knowledge and metacognitive discipline rather than teaching generic cognitive strategies.

3. **Fragmentary Mental Models Trump Comprehensive Understanding**: The research challenges the assumption that experts maintain comprehensive, coherent mental models of complex systems. Instead, experts rely on collections of fragmentary mental models—local causal connections, pattern-cue associations, rules, and principles—that they construct into situational understanding as needed. This has profound implications for AI agent systems: rather than trying to build complete world models, systems should maintain libraries of contextual patterns and causal fragments that can be dynamically assembled.

4. **Six Sensemaking Functions Handle Frame-Data Tensions**: The Data/Frame Model identifies six distinct activities for managing the relationship between frames and data: Elaborating (extending the frame with new inferences), Questioning (detecting anomalies and violated expectations), Preserving (explaining away inconsistencies, sometimes harmfully), Comparing (testing alternative frames), Seeking (searching for an initial frame when none fits), and Re-framing (establishing new anchors and reinterpreting data). Effective sensemaking requires knowing when to engage each function and avoiding fixation in Preserving.

5. **Expert Questioning Strategies Focus on Assumptions, Not Just Data**: When confronted with anomalies, experts are more likely to ask high-quality questions that challenge fundamental assumptions in their frames rather than simply seeking more information. In the experiments, experts asked questions like "Who actually makes this decision?" (challenging the assumption about agency) and "Why would this happen?" (seeking causal explanations) at 3-4 times the rate of novices. This "critical questioning" skill—knowing what to question, not just that one should question—is trainable and domain-specific.

---

## REFERENCE DOCUMENTS

### FILE: data-frame-reciprocity-in-agent-systems.md

```markdown
# Data-Frame Reciprocity: Why AI Agents Need Interactive Sensemaking Models

## The Central Insight

"Sensemaking is the process of fitting data into a frame, and fitting a frame around the data" (p. 3). This deceptively simple statement encapsulates a profound challenge for intelligent agent systems: understanding is not constructed by processing data through a fixed interpretive structure, nor by passively allowing data to generate interpretations. Instead, understanding emerges through continuous, reciprocal interaction between what we observe and how we interpret what we observe.

The FOCUS research, conducted over three years with Information Operations specialists, intelligence analysts, and other domain experts, reveals that "the frame and the data work in concert to generate an explanation" (p. vi). A frame—whether we call it a mental model, schema, story, or hypothesis—serves multiple functions simultaneously:

- **Defines elements**: What counts as a meaningful entity in the situation
- **Assigns significance**: Which elements matter and which are noise  
- **Describes relationships**: How elements connect causally, temporally, or functionally
- **Filters perception**: What data to seek and what to ignore
- **Reflects context**: Not just the data itself, but its meaning in a specific situation

Critically, "there is no primitive data" (p. 8)—cues are not predefined but depend on the conceptual frame being used. A spike in network traffic means nothing until interpreted through frames about normal operations, potential attacks, system maintenance, or user behavior patterns.

## Implications for Agent Architecture

Most current agent systems treat interpretation as a one-way process: data → processing → understanding. This misses the essential reciprocity. When an agent encounters the text "Governor met with adversaries multiple times," what this *means* depends entirely on which frame the agent is using:

- **Frame A (Bridge-Building)**: Meeting with adversaries is pragmatic diplomacy, expected behavior for someone trying to unite factions
- **Frame B (Naive Actor)**: Meeting with adversaries is an innocent mistake, not understanding U.S. policy implications  
- **Frame C (Hostile Actor)**: Meeting with adversaries is evidence of anti-U.S. allegiance

The same data element has radically different significance depending on the active frame. More importantly, each frame directs attention to *different additional data*: Frame A leads you to look for other reconciliation efforts; Frame C leads you to look for financial ties to enemy groups.

For multi-agent orchestration systems, this means:

**1. Agents need explicit frame representations**: Not just probability distributions over hypotheses, but structured representations that encode what matters, what connects to what, and what would constitute confirmatory vs. disconfirmatory evidence within that frame.

**2. Frame selection must be queryable and revisable**: When Agent A hands off to Agent B, the handoff must include not just "here's what I found" but "here's the frame I was using to interpret it, and here's why I selected that frame."

**3. Data collection strategies should be frame-dependent**: An agent operating in Frame A should seek different data than an agent in Frame C. Current systems often separate "gather information" from "interpret information" as if they were independent processes. They are not.

**4. Anomaly detection requires frame-expectancy pairing**: The research emphasizes that sensemaking is often triggered by "some anomaly or uncertainty that contradicts our typical expectations or interpretations" (p. 9). An agent cannot detect anomalies without having frames that generate expectations. A system that just pattern-matches without frame-based expectation generation will miss critical surprises.

## Boundary Conditions and Caveats

The Data/Frame Model describes *deliberate* sensemaking—conscious, effortful attempts to understand ambiguous situations. The researchers are explicit: "Sensemaking is a deliberate and conscious process" (p. 3). This is not about routine recognition or automatic processing.

This means the model applies when:
- The situation is ambiguous or contains conflicting information
- Current understanding is inadequate or under challenge  
- Stakes are high enough to warrant explicit reasoning
- The agent has time for reflective analysis

It does *not* apply to:
- Well-rehearsed pattern recognition (expert firefighters recognizing standard structural fires)
- Routine execution of known procedures
- Real-time reactive control where millisecond responses are required

For agent systems, this suggests a two-tier architecture: fast, pattern-based responses for routine situations, but engagement of full Data/Frame sensemaking when:
- Confidence scores drop below threshold
- Multiple conflicting interpretations emerge
- Stakeholder agents disagree on situation assessment  
- Novel situation types are encountered

## The Anchoring Mechanism

One of the model's most actionable insights: "One to two key data elements serve as anchors" that "affect the frame that is adopted, and that frame guides information seeking" (p. 8). Initial anchors exert disproportionate influence on frame selection.

This has major implications for agent initialization and handoffs:

**Problem**: If the first agent in a chain selects poor anchors, downstream agents inherit a biased frame that's hard to escape.

**Mitigation strategies**:
- Explicitly mark which data elements are serving as anchors
- Require agents to justify why particular data deserve anchor status  
- Create "anchor audit" checkpoints where alternative anchors are deliberately tested
- In high-stakes situations, run parallel agent chains with forced different anchors

The Afghan Governor scenario illustrates this perfectly: Those who anchored on "officially supports current government" + "no military background" + "no financial support to adversaries" ended up in Frame A or B (pragmatic or naive). Those who anchored on "met with adversaries multiple times" ended up in Frame C (hostile actor). Same data set, different anchors, radically different understanding.

## Designing for Frame-Data Reciprocity

Practical design patterns for agent systems:

**Pattern 1: Explicit Frame Tracking**
Every agent maintains a frame stack showing: current active frame, alternative frames under consideration, confidence in current frame, key expectations generated by frame, and data that would disconfirm frame.

**Pattern 2: Frame-Driven Query Generation**  
When an agent needs more information, it generates queries *from the frame*: "Given Frame A, what should I expect to see? What would distinguish Frame A from Frame B?" Rather than generic "get me more data about X."

**Pattern 3: Frame Handoff Protocol**
When orchestrating between agents:
```
Agent 1 → Agent 2 handoff includes:
- Data collected
- Frame(s) used to interpret that data
- Anchors that led to frame selection  
- Confidence in frame adequacy
- Known anomalies not yet resolved
- Alternative frames considered but not adopted (and why)
```

**Pattern 4: Anti-Fixation Forcing Functions**
Periodically force frame comparison even when current frame seems adequate. The research shows "preserving the frame" through "explaining away discrepancies" is a major failure mode (p. 4). Build in scheduled frame challenges.

## What Makes This Different From Existing Approaches

Most AI reasoning systems use:
- **Bayesian updating**: Evidence incrementally adjusts probability distributions
- **Logic-based inference**: Rules fire when conditions match
- **Neural pattern matching**: Learned mappings from inputs to outputs

The Data/Frame Model is fundamentally different because it treats the *selection and revision of the interpretive structure itself* as the primary cognitive work. You're not just updating probabilities within a model—you're selecting, elaborating, questioning, and replacing the model itself.

This is closest to abductive reasoning or "inference to best explanation," but more dynamic—frames are not static explanatory hypotheses but active filters and generators that reshape what counts as data.

For AI agent systems that must operate in truly novel, ambiguous domains (not just complex but well-structured domains like chess), this frame-centric view is essential. When you cannot rely on comprehensive training data, agents must be able to rapidly construct, test, and revise interpretive frames using fragmentary knowledge.

## Measuring Sensemaking Quality

The research suggests several metrics for evaluating agent sensemaking:

**Frame Adequacy Indicators:**
- Number of data elements explained by current frame
- Number of anomalies / unexplained elements  
- Consistency of predictions generated by frame
- Discriminability from alternative frames

**Process Quality Indicators:**
- Proportion of time in Elaborating vs. Questioning vs. Comparing
- Frequency of challenging key assumptions (expert marker)
- Time separation between sensemaking and decision-making
- Number of alternative frames explicitly considered

**Failure Mode Indicators:**
- Evidence of "knowledge shields" (explaining away contradictions)
- Early closure on single frame without comparison
- Mixing sensemaking and decision-making activities
- Failure to question negative evidence (in the Afghan case, experts questioned "met with adversaries" evidence 77% of the time vs. 45% for laypeople)

These are not metrics you can extract from confidence scores alone—they require instrumenting the agent's cognitive process itself.
```

### FILE: fragmentary-mental-models-for-agents.md

```markdown
# Fragmentary Mental Models: Building Agent Expertise Without Comprehensive World Models

## The Fundamental Challenge to Comprehensive Modeling

One of the FOCUS research's most profound contributions challenges a deeply held assumption in AI: that expertise requires comprehensive, coherent mental models. The researchers found that "developing a comprehensive mental model for a complex, open system is unrealistic" (p. vi). 

Even experts—in fact, *especially* experts—do not maintain complete, internally consistent representations of how their domains work. Instead, they rely on "fragments of local cause-effect connections, rules of thumb, patterns of cues, and other linkages and relationships between cues and information" (p. vi).

This finding emerged across three years of studying Information Operations officers, intelligence analysts, and domain experts in high-stakes, ambiguous environments. When researchers expected to find that experts possessed richer, more complete mental models than novices, they instead discovered something more nuanced: experts have *more fragments* and *better organized fragments*, but not fundamentally different kinds of cognitive structures.

## What Are Fragmentary Mental Models?

Fragmentary Mental Models (FMMs) are "local cause/effect connections" that are "evoked in order to create a 'just-in-time' mental model of a situation or phenomenon" (Table 7, p. 26). They include:

**Causal Fragments**: "If X happens, then Y tends to follow" without requiring understanding of the full causal chain or mechanisms involved. Example from the Kosovo case: "When bus security decreases → ridership drops" (without initially understanding *why*—whether due to student fear, parental decisions, or driver reluctance).

**Pattern-Cue Associations**: "When I see these cues together, it usually means this situation-type." The Afghan Governor case shows this: experienced IO officers recognized the pattern "minority tribe" + "no military background" + "pragmatic associations" as potentially indicating bridge-building behavior, even without a complete model of Afghan political dynamics.

**Rules of Thumb**: Domain-specific heuristics that work reliably in context. "In this culture, extended unexplained absences usually signal important events" proved useful even when the officer didn't know specifically what those events might be.

**Contingent Relationships**: "In situation-type A, factor X matters; in situation-type B, factor Y matters." These are context-dependent linkages rather than universal principles.

**Boundary Conditions**: Knowing when a fragment *doesn't* apply is as important as knowing when it does. Experts recognize "this is a Category-3-type problem, so my Category-1 fragments won't help."

The researchers emphasize that these FMMs "contribute to the frame that is constructed by the sensemaker, therefore guiding the selection and interpretation of data" (p. vi). They are not passive knowledge stores but active components of the sensemaking process.

## Why Fragments Beat Comprehensive Models

Several factors make FMMs superior to comprehensive models for complex, open systems:

**1. Acquisition Cost**: Learning a complete, correct model of Afghan political dynamics, Kosovar ethnic relations, or any complex socio-technical system would take years or decades. Experts can acquire useful FMMs much faster through direct experience with specific situations.

**2. Maintenance Burden**: Complex systems change. A comprehensive model requires constant updating across all components. FMMs can be updated locally—"I learned this rule-of-thumb doesn't work in winter conditions"—without reconstructing the entire knowledge structure.

**3. Transfer Flexibility**: The research notes that experts build "larger repertoires of FMMs" and "have a better understanding of how to link these to their current goals" (p. 9). Fragments can be recombined in novel ways for new situations, whereas comprehensive models are often situation-specific.

**4. Graceful Degradation**: When facing a situation partially outside their experience, experts can still apply relevant FMMs even if their comprehensive model would fail. The IO officer dealing with the Afghan Governor could use FMMs about tribal politics and authority dynamics even without a complete model of that specific province's power structure.

**5. Cognitive Load**: Maintaining and manipulating a comprehensive model in working memory is overwhelming. FMMs can be retrieved as needed: "just-in-time" construction rather than "just-in-case" maintenance.

## Implications for Agent System Design

This finding has radical implications for how we build intelligent agent systems:

### Anti-Pattern: Comprehensive World Modeling
Many AI architectures assume agents need complete, consistent world models—full ontologies, complete dependency graphs, comprehensive causal models. The FMM finding suggests this is not just impractical but cognitively incorrect: it's not how expert humans actually work.

**Why this fails:**
- Scales poorly to open-world domains  
- Requires impossible amounts of training data
- Brittle when encountering novel situations
- Cannot adapt quickly to domain changes

### Pattern: FMM Libraries + Just-In-Time Assembly

**Design Approach:**
Agents should maintain libraries of FMMs—modular knowledge fragments—that can be rapidly retrieved and assembled into situational frames as needed.

**Architecture Components:**

1. **FMM Repository**: Structured storage of fragments including:
   - Trigger conditions (when is this fragment relevant?)
   - Core content (the actual causal link, pattern, or rule)
   - Confidence/reliability metadata
   - Boundary conditions (when does this NOT apply?)
   - Source/provenance (learned from what experience?)

2. **Fragment Retrieval System**: Mechanisms for identifying relevant FMMs given current situation features. This is essentially a specialized search/ranking problem: "Given these situation cues, which fragments from my library are likely relevant?"

3. **Fragment Assembly Engine**: Processes that combine multiple FMMs into a coherent working frame. This includes:
   - Conflict resolution (when fragments suggest different things)
   - Gap identification (where do I need more fragments?)
   - Consistency checking (do these fragments cohere?)

4. **Fragment Learning System**: Mechanisms for acquiring new FMMs through experience:
   - When a prediction fails, extract a new fragment
   - When a new pattern emerges across cases, crystallize it
   - When an existing fragment proves unreliable, tag or modify it

### Example: Debugging Agent Using FMMs

Instead of trying to model all possible bug types comprehensively:

**FMM Library includes fragments like:**
- "Null pointer → check object initialization sequence" (causal fragment)
- "Performance degradation + memory alerts → likely memory leak pattern" (pattern-cue)  
- "In multi-threaded code, intermittent bugs often indicate race conditions" (rule of thumb)
- "Fresh regression after deployment → check configuration differences between environments" (contingent relationship)

**When agent encounters a bug:**
1. Extract situation features (symptoms, context, domain)
2. Retrieve relevant FMMs from library
3. Assemble into working hypothesis frame
4. Use frame to guide investigation (what to check next)
5. If frame proves inadequate, retrieve different FMMs and reassemble

**Key advantages:**
- Can handle novel bug types by recombining existing fragments
- Degrades gracefully when dealing with unfamiliar domains  
- Learns new fragments without reconstructing entire knowledge base
- Can explain reasoning by referencing specific fragments used

## Expert-Novice Differences: It's About Fragment Libraries

The research found that "experts do not differ from novices in their sensemaking strategies" (p. 4)—both groups used the same types of inference, sought connections between data, and followed similar processes. 

The key differences were:

**1. Fragment Repertoire Size**: "Experts have larger repertoires of FMMs" (p. 9). They've encountered more situations, extracted more patterns, and accumulated more rules-of-thumb. This means they have more potentially relevant fragments to retrieve in any given situation.

**2. Fragment Organization**: Experts "have a better understanding of how to link these [FMMs] to their current goals" (p. 9). Their fragments are better indexed—they can rapidly identify which fragments are relevant to the current problem type. Novices might possess some relevant fragments but fail to retrieve them at the right moment.

**3. Fragment Quality**: Expert fragments tend to be:
   - More reliable (tested across more cases)
   - Better calibrated (include more accurate boundary conditions)
   - More discriminating (help distinguish between similar situations)
   - More actionable (linked to effective interventions)

**4. Script Development**: "Experts develop scripts for action rather than route knowledge" (p. 9). Their FMMs are organized around *what to do* in situations, not just descriptive understanding. This is "functional sensemaking" vs. "abstract understanding" (p. 3).

## Training Implications: Building Fragment Libraries

If expertise is primarily about accumulating and organizing FMMs, then training should focus on fragment acquisition:

**Ineffective Approach**: 
- Teaching comprehensive theoretical models
- Classroom instruction on "how to think like an expert"  
- Generic problem-solving strategies

**Effective Approach**:
- **Case-based learning**: Expose learners to many specific situations where they must extract local patterns and rules
- **Pattern mining**: Explicitly ask "what rule-of-thumb did this case teach you?"
- **Fragment articulation**: Have experts describe their FMMs, not their comprehensive understanding
- **Boundary condition exploration**: For each fragment, explore when it doesn't apply  
- **Retrieval practice**: Give learners situations and ask "which fragments are relevant here?"

The Year 3 research developed scenario-based training materials exactly along these lines: "The simulations developed and used for data collection in Year 1 were revised...and annotated with the CTA data from LIWA experts to serve as a comparison case" (p. 5). Trainees worked through scenarios, then compared their sensemaking to expert fragments applied to the same scenario.

## Multi-Agent Systems: Fragment Sharing and Specialization

In a DAG-based orchestration system with 180+ skills, FMMs enable powerful patterns:

**Specialized Fragment Libraries**: Different agent types maintain different FMM libraries:
- Security agents: fragments about attack patterns, vulnerability conditions
- Performance agents: fragments about scaling bottlenecks, resource contention  
- Code quality agents: fragments about maintainability issues, technical debt patterns

**Fragment Exchange Protocol**: When agents collaborate, they can share relevant fragments:
```
Agent A: "I'm using the 'authentication-bypass via parameter tampering' fragment to interpret these logs"
Agent B: "That fragment applies here, but in this framework you should also consider the 'middleware validation layer' fragment"
```

**Meta-Learning Across Agents**: The orchestration system can identify when:
- A fragment proves useful across multiple agents → promote to shared library
- A fragment repeatedly fails → mark for revision or retirement  
- Fragment combinations emerge as particularly powerful → create compound fragments

**Graceful Uncertainty Handling**: When no agent has relevant fragments, the system can:
- Acknowledge the knowledge gap explicitly (rather than forcing a bad fit)
- Request human expert intervention to help build new fragments
- Engage in systematic exploration to derive new fragments from first principles

## Measuring Fragment Library Quality

For an agent system, fragment library quality can be measured:

**Coverage Metrics:**
- Proportion of encountered situations where relevant fragments exist
- Time to retrieve applicable fragments given situation features
- Number of situations requiring fragment creation vs. reuse

**Fragment Quality Metrics:**  
- Prediction accuracy when fragment is applied
- Rate of false positives (fragment suggested but inappropriate)  
- Boundary condition accuracy (fragment knows when NOT to apply)

**Library Organization Metrics:**
- Retrieval precision (relevant fragments found quickly)
- Retrieval recall (relevant fragments not missed)
- Conflict rate (how often do retrieved fragments contradict?)

## Boundary Conditions: When Comprehensive Models Matter

Despite the power of FMMs, there *are* domains where comprehensive models matter:

**Well-Defined Formal Systems**: In mathematics, logic, and certain engineering domains, comprehensive consistent models are both achievable and necessary. FMMs work in open-world, ill-structured domains with ambiguity and incomplete information.

**Safety-Critical Systems**: Where exhaustive analysis is required (aerospace, medical devices), comprehensive models may be mandated. Though even here, experts still use FMMs in diagnosis and troubleshooting.

**Complete Information Games**: Chess engines benefit from comprehensive evaluation functions and search trees precisely because the domain is completely specified. FMMs are for domains where complete specification is impossible.

For AI agent systems: Use comprehensive models where you have them (formal specifications, well-defined APIs, etc.), but build FMM-based sensemaking capabilities for everything else—the messy, ambiguous, real-world problems that constitute most of software development, debugging, and architecture work.

## The Deep Insight: Knowledge is Fragmentary By Nature

The researchers' final observation is philosophical: perhaps comprehensive mental models are not just impractical but conceptually wrong. In complex, open systems, there may be no "correct comprehensive model" to have. 

The world itself is fragmentary—composed of local regularities, contingent relationships, and context-dependent patterns. Expert cognition mirrors this structure not due to cognitive limitations, but because fragmentation is the actual nature of the territory being mapped.

For AI agents, this suggests: stop trying to build perfect world models. Build rich, well-organized fragment libraries instead. This is not a compromise with ideal rationality—it may be ideal rationality for the actual world we're operating in.
```

### FILE: sensemaking-decision-making-separation.md

```markdown
# Sensemaking-Decision-Making Separation: Why Experts Keep These Processes Distinct

## The Core Finding

One of the most striking findings from the Year 3 experiments was that "experts exhibit a stronger delineation between sensemaking and decision-making processes" (p. 10). While novices tended to intermix understanding the situation and formulating responses, experts maintained disciplined separation: first making sense of what's happening, *then* deciding what to do.

This separation was quantified in Experiment 1: researchers coded each utterance as either sensemaking-related (inference, inquiry, interpretation) or decision-making-related (proposing actions, evaluating options). They then computed the temporal ordering—did all sensemaking come before decision-making, or were they interleaved?

The experts showed a mean separation score of 13.18, while novices scored only 3.75 (p. 15). This means experts completed substantially more sensemaking before shifting to action planning, whereas novices jumped back and forth between "what's happening?" and "what should we do?"

Moreover, experts devoted proportionally less overall time to sensemaking relative to decision-making (68% vs. 78% for novices, p. 14), but this was because their sensemaking was more efficient and complete—they built adequate understanding faster, then shifted decisively to action planning.

## Why Separation Matters

The separation between sensemaking and decision-making is not merely procedural tidiness. It reflects deep functional advantages:

**1. Frame Stability During Analysis**
When you're simultaneously trying to understand a situation *and* formulate responses, you create circular reasoning: "This action makes sense given interpretation A, so interpretation A must be correct." The cognitive stance of sensemaking—"What's really going on here?"—conflicts with the cognitive stance of decision-making—"What should I do about it?"

By keeping them separate, experts avoid premature commitment. They explore alternative interpretations without the pressure of needing an actionable answer immediately.

**2. Decision Quality Depends on Understanding Quality**  
If your understanding is flawed, your decisions will be flawed—but you won't necessarily see the connection if you've intermixed the processes. As one researcher noted about the novices' tendency to jump to action: their responses showed "abstract understanding" rather than "functional understanding"—they saw events as "a connected series of events that needed to be untangled, but without a clear consideration of ways to influence the situation" (p. 3).

Experts, by contrast, built "functional understanding"—their sensemaking was explicitly framed in terms of "IO actions and means to advance SFOR agenda" (p. 3). But they only got to those actions *after* establishing what the situation actually was.

**3. Metacognitive Monitoring**
The separation creates a natural checkpoint: "Do I adequately understand this situation?" If sensemaking and decision-making are blurred, you lose this checkpoint. You might forge ahead with actions based on incomplete understanding without realizing the foundation is shaky.

**4. Communication and Coordination**
In multi-agent or team contexts, separated processes enable clearer handoffs: "Here's our situation assessment" followed by "Here are recommended actions given that assessment." If these are mixed, downstream agents can't tell which parts are understanding vs. recommendations, making it harder to challenge or build on the analysis.

## Observable Markers of Separation

The research identified specific behavioral markers that indicate separation:

**Strong Separation (Expert Pattern):**
- Extended periods of pure sensemaking activity (questioning, inferring, connecting) before any mention of actions
- Explicit transitions: "Okay, so if that's what's happening, then we should..."  
- Revisiting sensemaking when new data emerges, even after moving to decision-making
- Cavetting actions with confidence in understanding: "If interpretation X is correct, then action Y; but we should verify..."

**Weak Separation (Novice Pattern):**
- Rapid jumping between interpretation and action suggestions
- Action proposals used as evidence for interpretations ("We should do X, which confirms that Y is happening")
- Treating decision-making as part of sensemaking ("One way to understand this is to...")
- Difficulty returning to sensemaking once actions are under discussion

## Implications for Agent Orchestration

In a multi-agent DAG system, this finding suggests several architectural principles:

### Pattern 1: Explicit Sensemaking-Decision Phases

Agents should have explicit operational modes:

**Sensemaking Mode:**
- Goal: Develop adequate situational understanding
- Outputs: Frame representations, confidence assessments, identified anomalies, information needs
- Prohibited: Action recommendations, solution proposals, optimization decisions

**Decision-Making Mode:**  
- Goal: Formulate effective responses given current understanding
- Inputs: Situation assessment from sensemaking phase
- Outputs: Action plans, recommendations, resource allocation decisions
- Permitted: Returning to sensemaking mode if understanding proves inadequate

**Mode Transition Logic:**
```
REMAIN in Sensemaking IF:
  - Frame confidence < threshold
  - Major anomalies unresolved  
  - Alternative frames not yet adequately compared
  - Key information gaps identified

TRANSITION to Decision-Making IF:
  - Frame confidence >= threshold
  - Critical questions answered sufficiently
  - Stakeholders agree on situation assessment
  - Time pressure demands action

RETURN to Sensemaking IF:
  - New data contradicts current frame
  - Decision analysis reveals understanding gaps  
  - Actions produce unexpected results
```

### Pattern 2: Sensemaking-Specialist Agents

In a 180+ skill system, some agents should be pure sensemaking specialists:

**Situation Assessment Agent:**
- Takes raw data from monitoring agents
- Constructs and compares frames  
- Identifies anomalies and information needs
- Produces formal situation assessment artifacts
- Does NOT recommend actions

**Downstream Planning Agents:**
- Take situation assessments as input
- Generate action options  
- Evaluate and optimize decisions
- Do NOT revise situation understanding (they request new assessment)

This separation at the agent level mirrors the cognitive separation in experts.

### Pattern 3: Sensemaking Artifacts as Explicit Handoffs

When Agent A completes sensemaking and passes to Agent B for decision-making, the handoff should include:

```
SENSEMAKING ASSESSMENT ARTIFACT:
  1. Primary Frame:
     - Description of situation type
     - Key entities and relationships
     - Causal model of what's driving events
  
  2. Confidence Metadata:
     - Overall confidence in frame (0-100%)
     - Which elements are certain vs. uncertain
     - What would increase confidence
  
  3. Alternative Frames Considered:
     - Other interpretations explored
     - Why they were rejected/deprioritized
     - What evidence would favor them
  
  4. Unresolved Issues:
     - Anomalies not yet explained  
     - Gaps in understanding
     - Conflicting data points
  
  5. Information Position:
     - What's known vs. unknown
     - Where additional data could be obtained
     - Queries that would be informative
```

This artifact serves as the "understanding foundation" that decision-making builds on—and it's separable, reviewable, and challengeable independently of any action recommendations.

### Anti-Pattern: Mixed Sensemaking-Decision Agents

**Problematic Design:**
Agent receives problem → immediately starts proposing solutions while simultaneously building understanding → outputs a mix of interpretations and recommendations

**Why This Fails:**
- Cannot achieve stable frame before committing to actions
- Recommendations contaminate situation assessment  
- Hard to audit: "Why did you recommend X?" "Because of situation Y." "Why is situation Y?" "Because X makes sense."
- Difficult to parallelize or distribute (everything is entangled)

**Rescue Strategy:**
If an agent must do both, enforce explicit phase separation internally:
```python
def handle_task(data):
    # Phase 1: Sensemaking (no action proposals allowed)
    situation = build_understanding(data)
    validate_frame_adequacy(situation)
    
    # Explicit checkpoint
    if not situation.confidence_adequate():
        return NeedMoreInfo(situation.gaps)
    
    # Phase 2: Decision-making (given fixed situation assessment)
    options = generate_options(situation)
    recommendation = evaluate_options(options, situation)
    
    return (situation, recommendation)  # Clearly separated outputs
```

## Training Implications: Teaching the Discipline of Separation

Since novices naturally intermix sensemaking and decision-making, this is a trainable skill:

**Exercise 1: Forced Separation Scenarios**
- Present complex, ambiguous scenario
- Trainee must produce written situation assessment *without any action recommendations*
- Only after assessment is complete, separately produce action recommendations
- Compare to expert assessments and discuss differences

**Exercise 2: Mode Violation Detection**
- Show transcripts of people working through scenarios
- Identify moments where sensemaking and decision-making are inappropriately mixed
- Explain why the mixing is problematic
- Rewrite the transcript with proper separation

**Exercise 3: Decision Audit**
- Trainee proposes actions for a scenario
- Instructor asks: "What's your situation assessment that supports this action?"
- If trainee cannot articulate clear, separate understanding, their action proposal is rejected
- Forces discipline of "understand first, decide second"

**Exercise 4: Checkpoint Practice**
- During scenario work, enforce explicit checkpoints:
  - "Stop—before proposing any actions, document your current understanding"
  - "Are you confident enough in this understanding to base decisions on it?"
  - "What would you need to know to be more confident?"
- Build the habit of metacognitive monitoring at phase transitions

## Special Case: Time Pressure and Degraded Separation

The research team notes that strong separation is characteristic of *deliberate* sensemaking—"conscious, effortful attempts to understand ambiguous situations" (p. 6). Under extreme time pressure, even experts may need to act before understanding is complete.

In such cases, experts exhibit "degraded gracefully" patterns:

**Instead of abandoning separation entirely:**
- Make explicit the understanding limitations: "We don't know X, but we must act now"
- Mark actions as provisional: "This assumes interpretation A; if we learn A is wrong, we'll need to pivot"
- Build monitoring into action plans: "Do Y, and watch for signal Z which would indicate our understanding was wrong"
- Maintain readiness to return to sensemaking: "As soon as we get data on X, stop and reassess"

**For agent systems under time constraints:**
- Don't eliminate sensemaking phase, *compress* it
- Make uncertainty explicit in outputs: "Acting on incomplete understanding, confidence 45%"
- Flag decisions as provisional: "This recommendation assumes Frame A; invalidate if Frame A disconfirmed"
- Include monitoring/sensing actions: "After taking action Y, observe Z to verify our understanding"

## Measuring Separation Quality

For an agent system, we can instrument separation quality:

**Temporal Metrics:**
- Time spent in pure sensemaking before first action proposal
- Number of mode switches between sensemaking and decision-making
- Ratio of sensemaking time to decision-making time
- Time between anomaly detection and return to sensemaking mode

**Content Metrics:**
- Proportion of utterances/actions that are sensemaking vs. decision-making
- Contamination rate: how often decision considerations appear in sensemaking
- Clarity of mode transitions: are phases explicitly marked?

**Quality Metrics:**
- Decision success rate given understanding quality
- Correlation between frame confidence and decision quality  
- Rate of needing to return to sensemaking after starting decision-making
- Stakeholder agreement on situation assessments (high agreement suggests adequate sensemaking)

## Philosophical Underpinning: Different Epistemic Stances

The sensemaking-decision separation reflects fundamentally different epistemic stances—different relationships to truth and action:

**Sensemaking Stance:** "What is true about this situation?"
- Goal: Accurate representation of reality  
- Success criterion: Understanding matches actual state of affairs
- Virtues: Open-mindedness, skepticism, consideration of alternatives
- Failure mode: Paralysis, over-analysis, refusal to commit

**Decision-Making Stance:** "What should I do about this?"
- Goal: Effective action given understanding
- Success criterion: Actions produce desired outcomes  
- Virtues: Decisiveness, commitment, optimization
- Failure mode: Premature closure, action bias, insufficient reflection

These stances pull in different directions. Maintaining them simultaneously creates cognitive dissonance. Experts navigate this by *sequencing* them: first commit to the sensemaking stance fully, then shift to the decision-making stance with that understanding as foundation.

For AI agents, we can implement this as architectural separation: different agent types or different processing phases with different objective functions. Don't ask the same agent to simultaneously maximize "understanding accuracy" and "action effectiveness"—these objectives can conflict.

## Connection to Other Sensemaking Functions

The sensemaking-decision separation interacts with the six sensemaking functions:

**During Pure Sensemaking:**
- Free to engage in extensive Frame Questioning without pressure to preserve a actionable frame
- Can fully Compare alternative frames without needing to pick one for immediate action
- Can Seek entirely new frames if current ones prove inadequate
- Can acknowledge "I don't understand this yet" without triggering action pressure

**During Decision-Making:**
- Frame is temporarily fixed (treated as given) to enable coherent planning
- If major anomaly detected during decision-making, explicitly return to sensemaking
- Actions can include "take action to improve understanding" (reconnaissance, information gathering)

The separation doesn't mean sensemaking stops forever once decision-making starts—it means the phases are explicitly managed rather than chaotically intermixed.

## The Bottom Line for Agent Systems

Expert performance in complex, ambiguous domains requires:
1. Adequate understanding before decisive action
2. Explicit separation between developing understanding and choosing actions
3. Metacognitive monitoring of understanding quality
4. Willingness to return to sensemaking when understanding proves inadequate

For AI agent orchestration systems, implement this through:
- Distinct sensemaking vs. decision-making agent roles
- Explicit phase transitions with quality gates  
- Sensemaking artifacts that are separate from action recommendations
- Monitoring that detects when understanding is inadequate for current decisions
- Training scenarios that enforce separation discipline

The goal is not merely mimicking expert behavior, but capturing the functional advantages that separation provides: stable frames for analysis, checkpoints on understanding adequacy, cleaner communication, and better decision quality.
```

### FILE: expert-questioning-strategies.md

```markdown
# Expert Questioning Strategies: How Assumption-Challenging Drives Sensemaking

## The Critical Discovery

In Experiment 2b—the Kosovo Bus scenario—researchers found that experienced IO personnel were 3-4 times more likely than novices to ask certain critical questions when faced with an anomaly (p. 23):

- **"Why are the students not riding?"** (50% of experts vs. 10% of laypeople)
- **"Who actually decides?"** (50% of experts vs. 5% of laypeople)

These questions may seem almost trivially simple. They lack technical sophistication. They don't reference specialized IO concepts or frameworks. Yet they were *exactly* the questions needed to break through to accurate understanding.

The scenario: Bus ridership had dropped from 60-80 students per day to only 10 after security escorts were reduced. The obvious frame was "students don't feel safe" → solution is more visible security. But that frame was wrong. The actual issue: mothers weren't letting their college-age children ride, regardless of stated security measures.

The questions experts asked challenged fundamental assumptions:
- **"Why not ride?"** challenges the assumption that we understand the cause
- **"Who decides?"** challenges the assumption that students are the decision-makers

In contrast, novices and laypeople tended to accept the surface frame and elaborate within it: "Students say they don't feel secure → we need to demonstrate more security to students." They took the problem definition at face value.

## The Parallel to Scientific Reasoning

This finding closely parallels Dunbar's (1993, 1995) research on scientific discovery. Dunbar found that when scientists encountered unexpected results, the critical factor determining whether they made discoveries was *how they set their goals in response to anomaly*.

**Low-Discovery Group:** Maintained goal of finding evidence for original hypothesis; explained away inconsistent findings; rarely discovered actual mechanisms.

**High-Discovery Group:** Changed goal to "explain the cause of the unexpected finding"; treated anomalies as signals about hidden mechanisms; frequently discovered actual principles.

Similarly, the FOCUS research found experienced scientists were "much more willing to let go of their original hypothesis, and set a new goal of understanding the inconsistent findings" (p. 20). They also showed heightened sensitivity to control condition anomalies, treating them as opportunities to expose hidden mechanisms rather than mere validation checks.

The IO experts displayed the same pattern: when ridership dropped unexpectedly, they didn't double down on the existing frame ("demonstrate more security to students"). Instead, they shifted goals to "explain why this happened" and "challenge assumptions about decision-makers."

## Types of Expert Questions

Analysis of expert protocols across the three experiments reveals several categories of high-value questions:

### 1. Causal Explanation Questions
**Form:** "Why did X happen?" / "What caused Y?"

**Function:** Shifts focus from describing the anomaly to explaining its mechanism. Forces articulation of causal model.

**Example from data:** When experts saw the ridership drop, they asked "Why aren't they riding?" rather than accepting "they don't feel secure" as sufficient explanation.

**For agents:** When detecting anomalies, generate explicit "why" questions about root causes rather than surface correlations.

### 2. Assumption-Challenging Questions  
**Form:** "Who really...?" / "What if it's not X but Y?" / "Are we assuming Z?"

**Function:** Makes implicit assumptions explicit and tests them. Often reveals that a "fact" is actually an assumption.

**Example from data:** "Who decides?" challenged the assumption that college students make their own transportation decisions.

**For agents:** Maintain explicit representation of assumptions underlying current frame. When anomalies arise, systematically question assumptions.

### 3. Alternative Frame Questions
**Form:** "Could this be situation-type A instead of B?" / "What if we're looking at X wrong?"

**Function:** Generates alternative interpretive frames rather than elaborating current frame.

**Example from Afghan Governor:** Moving from "Is he anti-U.S.?" to "What if he's trying to build bridges with all factions?"

**For agents:** When confidence in current frame drops, generate alternative frame hypotheses rather than just seeking more data.

### 4. Evidence Quality Questions
**Form:** "How reliable is this data?" / "Who reported X and why?" / "What's the source chain?"

**Function:** Assesses data credibility rather than taking all inputs at face value.

**Example from data:** In Experiment 2a, field-experienced participants (77%) were significantly more likely than laypeople (45%) to question negative evidence about the Afghan Governor (p. 19).

**For agents:** Implement data quality assessment as part of sensemaking. Don't just process inputs; evaluate their reliability given source, chain of custody, potential biases.

### 5. Boundary-Condition Questions
**Form:** "When does this rule apply?" / "In what contexts is X true?" / "Are there exceptions?"

**Function:** Defines scope of current frame; identifies when it would/wouldn't apply.

**Example from data:** "The Major is also aware that the U.S. IO didn't have a way to think about how the Afghanis ought to be acting. For example, actions that Afghanis believe are completely innocuous are completely beyond the pale to the U.S." (Appendix A)

**For agents:** When applying fragmentary mental models, explicitly check boundary conditions: "Does this FMM apply in this context?"

### 6. Decision-Maker Identification Questions
**Form:** "Who actually makes this decision?" / "Whose interests matter here?" / "Who has agency?"

**Function:** Identifies actual locus of decision-making authority, which may differ from apparent or assumed decision-makers.

**Example from data:** The bus scenario breakthrough came from recognizing mothers, not students, were the actual decision-makers.

**For agents:** In human-centered systems, explicitly model decision authority and agency. Don't assume apparent actors are real decision-makers.

## What Makes Questions "High-Quality"

Not all questions are equally valuable. The research suggests high-quality questions share characteristics:

**1. Generativity:** They open up new lines of inquiry rather than narrowing to specific facts. "Why did this happen?" generates investigation directions; "What was the ridership on Thursday?" is a specific fact request.

**2. Frame-Challenging:** They question the interpretive structure, not just fill in details within it. "Who decides?" challenges the frame; "How many students felt unsafe?" elaborates within the frame.

**3. Assumption-Exposing:** They make implicit commitments explicit and testable. Often questions that couldn't be answered from available data ("Who actually decides?") force recognition of what was being assumed.

**4. Action-Relevant:** They connect to functional understanding—"If the answer is X, we'd do Y; if it's Z, we'd do W." Not mere intellectual curiosity.

**5. Appropriately General/Specific:** Experts varied question level strategically. Sometimes very general ("Why?"), sometimes domain-specific ("Who are the key decision-makers?"). The Afghan Governor scenario showed this range (p. 10).

## Training Question-Asking Skills

Since question quality distinguishes experts from novices, and questioning is a learnable skill, this is a clear training target:

### Scenario-Based Question Training

**Method:**
1. Present scenario with ambiguity or anomaly
2. Before allowing situation assessment, require: "Write 5 questions you would ask"
3. Compare to expert questions on same scenario
4. Discuss: What assumptions does each question challenge? What would answering it reveal?

**Example Exercise:**
```
Scenario: After deploying a new feature, user engagement dropped 40%.

Novice questions might be:
- "What was the engagement yesterday?"
- "How many users are active?"  
- "Is the server responding normally?"

Expert questions might be:
- "Why did engagement drop?" (causal)
- "Did it drop for all user segments or specific ones?" (boundary conditions)
- "Are users choosing not to engage or unable to engage?" (assumption about agency)
- "How reliable is the engagement metric—could this be measurement artifact?" (data quality)
- "What decision are users making differently now?" (decision-maker identification)
```

### Assumption-Articulation Training

**Method:**
1. Present situation assessment
2. Require: "List all assumptions underlying this assessment"
3. For each assumption: "How would you test it? What if it's wrong?"

This builds the habit of making implicit commitments explicit—the prerequisite for challenging them.

### Question-Upgrade Training

**Method:**
1. Trainee asks initial questions about scenario
2. For each question, facilitator asks: "What assumption does this question accept? How could you challenge that assumption?"
3. Trainee reformulates questions to challenge deeper assumptions

**Example:**
```
Initial: "How can we show students the buses are safe?"
→ Assumes: Students are the decision-makers; perception of safety is the issue
Upgraded: "Who decides whether someone rides the bus?"
→ Challenges: Decision-maker assumption

Initial: "What security measures do students want?"
→ Assumes: Security is the actual concern; students can articulate real needs
Upgraded: "Why did ridership drop—what changed in students' decision-making?"
→ Challenges: That we understand the cause; that security is the real issue
```

### Expert Question Libraries

Build searchable repositories of high-quality questions from expert protocols:

**Structure:**
- **Question Template:** "Who actually makes [decision X]?"
- **Assumption Challenged:** "Apparent decision-maker is actual decision-maker"
- **When Useful:** "Situations involving human behavior where decisions seem irrational given assumed decision-maker"
- **Example Application:** Kosovo bus scenario; teenagers making college attendance decisions
- **Follow-up Questions:** "What are decision-maker's actual concerns?" / "How do we access real decision-makers?"

Agents (or human trainees) can query this library when stuck: "I have an anomaly of type X, what questions would challenge my current frame?"

## Implementing Question-Generation in Agent Systems

### Pattern 1: Question-Generation Skill
Create a dedicated agent skill that takes: (current frame, observed anomaly, available data) → generates list of high-quality questions

**Implementation:**
```python
def generate_questions(frame, anomaly, data):
    questions = []
    
    # Causal explanation questions
    questions.append(f"Why did {anomaly} occur?")
    questions.append(f"What mechanisms could produce {anomaly}?")
    
    # Assumption-challenging questions  
    assumptions = extract_assumptions(frame)
    for assumption in assumptions:
        questions.append(f"What if {assumption} is incorrect?")
        questions.append(f"How could we test {assumption}?")
    
    # Alternative frame questions
    alternative_frames = get_candidate_frames(anomaly)
    for alt_frame in alternative_frames:
        questions.append(f"Could this be {alt_frame} instead?")
        questions.append(f"What would distinguish {frame} from {alt_frame}?")
    
    # Evidence quality questions
    for data_point in data:
        questions.append(f"How reliable is {data_point}?")
        questions.append(f"What are alternative explanations for {data_point}?")
    
    return prioritize_questions(questions)
```

### Pattern 2: Assumption Tracking
Frames should explicitly represent their assumptions, making them available for questioning:

**Frame Representation:**
```json
{
  "frame_id": "students_fear_unsafe_buses",
  "description": "Students won't ride because they perceive buses as unsafe",
  "assumptions": [
    {
      "id": "a1",
      "content": "Students are the primary decision-makers",
      "confidence": 0.8,
      "basis": "unstated_default"
    },
    {
      "id": "a2",
      "content": "Perception of safety drives behavior",
      "confidence": 0.7,
      "basis": "stated_reasons"
    }
  ],
  "predictions": [...],
  "questions_to_test": [
    "Who actually decides whether students ride?",
    "Are stated reasons (safety) the actual reasons?"
  ]
}
```

When anomaly detected, systematically challenge low-confidence assumptions.

### Pattern 3: Question-Answering Chain
Questions should trigger investigation chains:

```
Question: "Who actually decides whether students ride?"
  → Investigation: Interview students about decision process
    → Finding: "My mom won't let me"
      → Updated Frame: Parents are actual decision-makers
        → New Questions: "What are parents' concerns?" / "How do we reach parents?"
          → Investigation: Talk to parents...
```

Each question answered updates the frame and may generate new questions.

### Pattern 4: Meta-Questioning
When an agent is stuck (confidence low, multiple failures), a meta-question agent can suggest question strategies:

**Meta-Questions:**
- "What assumptions are you making about who has agency here?"
- "Have you questioned the quality of your primary data sources?"
- "What alternative situation-types could produce these observations?"  
- "What boundary conditions of your current frame might not hold?"

This is essentially what a Socratic facilitator does—asks questions about your questioning process.

## Measuring Question Quality in Agents

For agent systems, we can quantify question quality:

**Generativity Metric:** How many follow-up questions or investigations does answering this question enable? (More = higher generativity)

**Frame-Impact Metric:** If this question were answered, how much would it change frame confidence or frame selection? (More change = higher impact)

**Assumption-Exposure Metric:** How many implicit assumptions does this question make explicit? (More = better)

**Discriminatory Power:** How much does this question distinguish between competing frames? (Higher discrimination = better)

**Actionability:** Does answering this question clearly change action recommendations? (Clear connection = more actionable)

**Efficiency:** Can this question be answered with available resources, or would it require impractical effort?

The ideal question scores high on the first five metrics while remaining practically answerable.

## Boundary Conditions: When Questions Don't Help

The research is clear that questioning is part of *deliberate* sensemaking in *ambiguous* situations. Questions are less valuable when:

**Situation is Clear:** If high confidence frame adequately explains all data, extensive questioning is wasteful. Don't question for the sake of questioning.

**Time Pressure Extreme:** Under millisecond response requirements, there's no time for questioning. Act on best available frame, monitor results.

**Domain is Formal/Defined:** In well-specified domains (formal systems, closed-world games), the issue is computation and search, not frame-challenging questions.

**Questions Have Been Asked:** If you've already questioned key assumptions and found them sound, repeated questioning is unproductive. Move to decision-making.

For agents: implement question-generation as an invoked skill, not a constant background process. Trigger questioning when:
- Frame confidence drops below threshold
- Anomaly detected that current frame doesn't explain
- Stakeholder agents disagree on situation assessment
- Decision-making keeps failing despite repeated attempts

## Connection to Dunbar's Discovery Framework

The FOCUS findings on questioning align precisely with Dunbar's model of scientific discovery:

**Dunbar's Key Insight:** "People's goals determine when and how inconsistent evidence is used" (p. 20). When people maintain the goal of confirming their hypothesis, they explain away anomalies. When they shift to the goal of explaining anomalies, they make discoveries.

**FOCUS Extension:** Expert questioning strategies *operationalize* this goal shift. Asking "Why did the anomaly occur?" *is* the goal of explaining the anomaly. Asking "What if assumption X is wrong?" *is* the goal of questioning the frame rather than preserving it.

For agent systems: goal-setting (objective functions) should shift depending on sensemaking context:

**During Frame Elaboration:** Goal = "Extend current frame to explain more data"
**During Frame Questioning (after anomaly):** Goal = "Find best explanation for anomaly, including alternative frames"
**During Frame Comparison:** Goal = "Discriminate between competing frames"

The questioning strategies naturally follow from the goals. An agent optimizing "explain anomaly" will generate causal questions; an agent optimizing "discriminate frames" will generate distinguishing-evidence questions.

## The Deep Pattern: Questions Expose Hidden Structure

The most profound insight about expert questioning: high-quality questions reveal *what was hidden in the problem structure that your current frame missed*.

"Who decides?" revealed that the decision-making structure was different than assumed.
"Why did this happen?" revealed that the causal mechanism was different than assumed.
"How reliable is this evidence?" revealed that the data quality was different than assumed.

Expert questions are structure-probing tools. They're designed to expose mismatches between your frame's assumptions and actual reality.

For AI agents, this suggests: questions should be generated by *comparing frame structure to observed data structure*. Where they mismatch, generate questions that probe the mismatch.

Example:
```
Frame structure: "Student" → [decides] → "ride/not ride"
Observed data structure: "Student" + "Mother" → [both influence] → "ride/not ride"  
Mismatch: Frame has one decision-maker, data suggests two
Generated question: "Who actually makes this decision?"
```

This is a form of structural analogy—but between abstract frame structure and observed causal/decision structure in the world.

## Bottom Line for Agent Systems

Expert sensemaking relies heavily on high-quality questioning that:
1. Challenges assumptions rather than elaborating current frames
2. Seeks causal explanations rather than surface descriptions
3. Questions data quality and source reliability
4. Identifies actual decision-makers and loci of agency
5. Varies in specificity based on context
6. Generates actionable investigation paths

Implement in agent systems through:
- Explicit assumption tracking in frame representations  
- Question-generation skills triggered by anomalies
- Question-quality metrics to prioritize investigations
- Question libraries learned from expert protocols
- Meta-questioning capabilities when agents are stuck
- Goal-shifting from "confirm frame" to "explain anomaly" when appropriate

The goal is not to generate endless questions (paralysis by analysis) but to generate *the right questions*—those that expose hidden structure and challenge crucial assumptions at moments when the current frame has demonstrably failed.
```

### FILE: frame-elaboration-vs-frame-comparison.md

```markdown
# Frame Elaboration vs. Frame Comparison: Managing Cognitive Commitment in Uncertain Situations

## The Central Tension

The Data/Frame Model describes six sensemaking functions, but three form a critical triangle that determines whether sensemaking succeeds or fails: **Elaborating**, **Preserving**, and **Comparing**.

**Elaborating the Frame** means extending your current interpretation to account for new data: inferring connections, filling in slots, making predictions, deepening your understanding *within* your current framework.

**Preserving the Frame** means protecting your current interpretation from contradictory evidence: explaining away anomalies, using knowledge shields, minimizing the importance of disconfirming data.

**Comparing Frames** means entertaining multiple alternative interpretations simultaneously: generating competing hypotheses, seeking discriminating evidence, sharpening distinctions between possibilities.

The research reveals a fundamental tension: **Elaborating is necessary for depth, but creates commitment that makes Comparison harder. Yet premature commitment via Preserving leads to fixation errors.**

The expert skill is knowing *when* to elaborate (build depth within a frame), *when* to compare (consider alternatives), and *when* preserving has become pathological fixation.

## Elaborating the Frame: Building Depth

Elaboration is the most common sensemaking activity in the experiments: 61-64% of sensemaking idea units (Table 4, p. 15). This is natural and appropriate—once you've selected a frame, you need to develop it:

**Elaboration Activities:**
- **Seeking data**: Looking for information relevant to the current frame
- **Inferring data**: Drawing logical conclusions from what's known
- **Extending the frame**: Adding detail and structure to the interpretation  
- **Filling slots**: Populating the frame's template with specific instances
- **Making predictions**: Deriving expectations from the frame's logic

**Example from Afghan Governor scenario:**
Initial frame: "Governor is pragmatic bridge-builder"
Elaborations:
- *Inference*: "He's meeting with adversaries *because* he wants to unify all factions"
- *Prediction*: "We should see him meeting with other groups too, not just adversaries"  
- *Slot-filling*: "The adversaries he's meeting are probably X and Y, who represent Z faction"
- *Extension*: "This fits with his minority tribe status—he *needs* broad coalition"

Each elaboration makes the frame richer, more specific, more actionable. This is essential—a frame that remains vague and underspecified doesn't support effective decision-making.

**The Value of Elaboration:**
1. Generates testable predictions
2. Identifies information needs
3. Reveals logical implications  
4. Connects disparate data points
5. Builds towards functional understanding (what to *do* given this situation)

The problem: **Elaboration increases psychological commitment to the frame.** As you invest cognitive effort building out an interpretation, you become increasingly reluctant to abandon it. The sunk cost is not just time but cognitive coherence—you've constructed a detailed story, and replacing it requires dismantling all that structure.

## Preserving the Frame: When Protection Becomes Fixation

**Preserving** emerges naturally from elaboration. As you develop a frame, you encounter data that doesn't quite fit. The preservation response: explain why the data is misleading, irrelevant, or compatible-after-all with your frame.

**Preservation Mechanisms:**
- **Knowledge shields**: Arguments used to dismiss disconfirming evidence ("That source is biased," "That's an outlier")
- **Explaining away**: Creative reinterpretation to make anomalies fit ("He disappeared for good reasons")
- **Distortion**: Subtly misremembering or reshaping data to align with frame
- **Minimization**: Treating significant contradictions as minor details

The researchers note: "Preserving a frame in the face of countervailing evidence... minimizing the importance of contradictory data" (Table 7, p. 25).

**When Preserving is Appropriate:**
Not all preservation is pathological. Sometimes data quality *is* poor, sources *are* biased, anomalies *are* minor perturbations. Expert judgment involves knowing when to dismiss noise.

The Afghan Governor case shows appropriate preservation: "Intel gave a range of reasons for why he could be out of town for weeks. But, because of pace of operations, the information doesn't figure into the Major's or most others' assessment" (Appendix A). The Major learned the governor had been out of town for extended periods before—legitimately explaining the disappearance.

**When Preserving Becomes Fixation:**
The line crosses when preservation becomes automatic rather than judged:
- Consistently dismissing contradictory evidence without investigation
- Unable to articulate what *would* disconfirm the frame
- Distorting data to fit rather than revising the frame
- Increasing defensive commitment as challenges mount

The model explicitly identifies "fixation errors" as a failure mode: "Reducing consideration of alternative frames or preserving a frame that should be discarded. Often, the process of preserving an inaccurate frame leads from one error to another" (Table 7, p. 25).

**The "Garden Path" Problem:**
Novices particularly fall into this: they select poor initial anchors, build elaborate frames from them, then preserve those frames through increasingly tortured explanations. "Novices tend to get trapped in the 'garden path' (relying on data/anchors that are inaccurate or are not diagnostic)" (Table 7, p. 25).

## Comparing Frames: The Antidote to Fixation

**Comparing** involves explicitly entertaining multiple alternative interpretations:

**Comparison Activities:**
- **Identifying alternative frames**: Generating competing hypotheses
- **Sharpening distinctions**: Clarifying how alternatives differ
- **Seeking distinguishing evidence**: Looking for data that would discriminate between frames
- **Simultaneous testing**: Evaluating multiple frames in parallel

In the experiments, comparison was rare: only 2-5% of sensemaking units (Table 4, p. 15). This is striking—even though comparison is the primary mechanism for escaping fixation, people rarely engage in it spontaneously.

**Example from Afghan Governor:**
Three frames in play:
- **Frame A**: Governor is pragmatic bridge-builder
- **Frame B**: Governor is naïve, doesn't understand U.S. sensitivities  
- **Frame C**: Governor is anti-U.S., covertly supporting adversaries

Comparison involves: 
- *Distinguishing predictions*: Frame C predicts financial support to adversaries; Frames A/B don't
- *Discriminating evidence*: "Does he meet with ALL factions or only adversaries?" distinguishes A from C
- *Critical questions*: "Would a pragmatic bridge-builder behave exactly this way?" tests A vs. B

The Major in the scenario *eventually* engaged in comparison, moving between camps, but only after accumulating significant evidence. Many others fixated in Frame C without seriously considering alternatives.

**Why Comparison is Rare:**
1. **Cognitive load**: Maintaining multiple frames simultaneously is mentally demanding
2. **Commitment**: Elaboration builds commitment that resists comparison
3. **Action pressure**: Decisions require picking one interpretation; comparison delays decision
4. **Confidence misalignment**: People become confident in frames (expert confidence 70-78%) even in ambiguous situations, reducing perceived need for comparison

**Why Comparison is Critical:**
1. **Escape fixation**: Only way out once you've committed to wrong frame
2. **Calibrate confidence**: Seeing viable alternatives should reduce over-confidence
3. **Identify discriminating data**: Comparison reveals what information would actually resolve uncertainty
4. **Insurance**: If primary frame fails, alternatives are readily available

## The Expert Pattern: Strategic Alternation

The research findings suggest experts don't avoid elaboration or always engage in comparison. Instead, they strategically alternate:

**Phase 1: Initial Exploration (Comparison Heavy)**
When first encountering ambiguous situation:
- Generate multiple plausible frames quickly
- Don't commit deeply to any single frame yet
- Seek data that discriminates between alternatives
- Explicitly note which frames remain viable

**Phase 2: Targeted Elaboration**
Once discriminating evidence narrows possibilities:
- Elaborate the most promising frame in depth
- Make predictions and identify information needs
- Build towards functional understanding
- *But* maintain explicit awareness of alternatives

**Phase 3: Comparison Upon Anomaly**
When anomalies challenge current frame:
- Don't immediately preserve (explain away)
- Return to comparison mode: "Could this be evidence for alternative frame?"
- Seek additional discriminating evidence
- Be willing to re-frame if alternative proves better

**Phase 4: Decisive Commitment**
Once adequate confidence achieved:
- Commit to single frame for decision-making purposes
- Elaborate deeply to support action planning
- Preserve *appropriately* against minor noise
- But maintain monitoring for major anomalies

This is very different from the novice pattern of:
1. Pick first plausible frame (often from poor anchors)
2. Elaborate extensively without considering alternatives
3. Preserve against all contradictions
4. Never seriously compare to alternative frames

## Implications for Agent Systems

### Pattern 1: Explicit Multi-Frame Tracking

Agents should maintain not just a "current best hypothesis" but an explicit set of viable frames:

```python
class SensemakingState:
    def __init__(self):
        self.candidate_frames = []  # All plausible interpretations
        self.active_frame = None    # Primary frame for elaboration
        self.elaboration_depth = {} # How much work invested in each frame
        self.discriminating_tests = []  # Data that would choose between frames
        
    def add_frame(self, frame, initial_confidence):
        """Add new candidate frame to consideration set"""
        self.candidate_frames.append({
            'frame': frame,
            'confidence': initial_confidence,
            'supporting_evidence': [],
            'contrary_evidence': [],
            'elaborations': []
        })
    
    def elaborate_active_frame(self, inference):
        """Extend current frame, but track investment"""
        self.active_frame['elaborations'].append(inference)
        self.elaboration_depth[self.active_frame['id']] += 1
        
    def compare_frames(self):
        """Explicitly evaluate alternatives"""
        for frame in self.candidate_frames:
            score = evaluate_frame(frame, available_data)
            frame['confidence'] = score
        
        # Check if active frame is still best
        if not is_best_frame(self.active_frame, self.candidate_frames):
            self.suggest_reframing()
```

### Pattern 2: Elaboration Budget

To prevent over-commitment, impose elaboration limits before forcing comparison:

```python
ELABORATION_BUDGET = 10  # Max elaborations before forced comparison

def sensemaking_loop(data):
    state = SensemakingState()
    
    # Generate initial candidate frames
    state.candidate_frames = generate_initial_frames(data)
    state.active_frame = select_best_frame(state.candidate_frames)
    
    while not adequate_confidence(state):
        # Elaborate active frame
        elaboration = infer_from_frame(state.active_frame, data)
        state.elaborate_active_frame(elaboration)
        
        # Forced comparison checkpoint
        if state.elaboration_depth[state.active_frame['id']] >= ELABORATION_BUDGET:
            state.compare_frames()
            
            # Check for anomalies
            if detected_anomaly(state.active_frame, data):
                state.compare_frames()  # Force comparison on anomaly
                
        # Possibly reframe
        if should_reframe(state):
            state.active_frame = select_new_active_frame(state.candidate_frames)
    
    return state.active_frame
```

### Pattern 3: Discriminating-Evidence Seeking

When multiple frames are viable, prioritize gathering data that distinguishes between them:

```python
def identify_discriminating_queries(candidate_frames):
    """Find questions that would choose between competing frames"""
    queries = []
    
    for frame_a, frame_b in itertools.combinations(candidate_frames, 2):
        # What do these frames predict differently?
        predictions_a = frame_a.generate_predictions()
        predictions_b = frame_b.generate_predictions()
        
        for pred_a in predictions_a:
            for pred_b in predictions_b:
                if contradicts(pred_a, pred_b):
                    query = generate_query_for(pred_a, pred_b)
                    queries.append({
                        'query': query,
                        'discriminates_between': [frame_a, frame_b],
                        'priority': high
                    })
    
    return queries
```

In the bus scenario, a discriminating query would be: "Are parents involved in the decision?" 
- If yes → activates "parental authority" frame
- If no → activates "student perception" frame

### Pattern 4: Preservation Audit

Monitor for pathological preservation patterns:

```python
def audit_preservation(frame, contrary_evidence_history):
    """Detect if frame is being inappropriately preserved"""
    
    # Count how many times contradictions were explained away
    preservation_count = len([e for e in contrary_evidence_history 
                              if e.resolution == 'explained_away'])
    
    # Calculate ratio of preservation to reframing
    preservation_ratio = preservation_count / len(contrary_evidence_history)
    
    if preservation_ratio > THRESHOLD:  # e.g., 0.7
        return Warning("Possible fixation: frame being preserved despite repeated contradictions")
    
    # Check if frame can articulate falsification conditions  
    if not frame.can_specify_disconfirming_evidence():
        return Warning("Frame may be unfalsifiable—no clear disconfirmation criterion")
    
    return OK
```

### Pattern 5: Comparison-Forcing Events

Certain triggers should force comparison even if agents are comfortable with current frame:

**Mandatory Comparison Triggers:**
- Major anomaly detected (prediction violated)
- Stakeholder agents disagree on situation assessment
- Elaboration budget exhausted
- Confidence drops below threshold
- Time checkpoint reached (periodic comparison)
- Multiple preservation events in short time

**Comparison Protocol:**
1. Suspend further elaboration of current frame
2. Retrieve or generate alternative frames
3. Evaluate all frames against current evidence
4. Identify discriminating tests
5. If current frame still best, resume elaboration; otherwise, reframe

## Training Implications

Since novices elaborate too readily and compare too rarely, training should:

**Exercise 1: Forced Alternatives**
- Present ambiguous scenario
- Require: "Generate at least 3 different interpretations"  
- Prohibit: Committing to one interpretation immediately
- Practice maintaining multiple frames in parallel

**Exercise 2: Premature Elaboration Detection**
- Show transcript of someone elaborating single frame extensively without considering alternatives
- Identify point where they should have paused to compare
- Explain: What alternative frames were available? What distinguishing evidence could have been sought?

**Exercise 3: Preservation vs. Reframing**
- Present frame + contradictory evidence
- Trainee proposes response
- If response is preservation, challenge: "How many times will you explain away contradictions before considering alternatives?"
- Practice: When is explanation legitimate vs. defensive preservation?

**Exercise 4: Comparison Discipline**
- Require periodic checkpoints: "Before elaborating further, compare this interpretation to at least one alternative"
- Build habit of asking: "What else could this be?" before deepening current frame

## Measuring Balance

For agent systems, we can measure elaboration-comparison balance:

**Elaboration Metrics:**
- Depth: Number of elaborations on current frame before comparison
- Breadth: Number of candidate frames under consideration
- Commitment: Cognitive investment in current frame (stored elaborations, predictions)

**Comparison Metrics:**
- Frequency: How often does comparison occur relative to elaboration?
- Trigger: Is comparison spontaneous or only after anomaly?
- Quality: Does comparison actually evaluate alternatives or just confirm current frame?

**Balance Indicators:**
- **Healthy**: Moderate elaboration depth (5-10 elaborations) followed by comparison; multiple frames tracked; comparison after anomalies
- **Over-elaboration**: Deep elaboration (20+) without comparison; single frame tracked; preservation dominates
- **Under-elaboration**: Constant comparison without building depth; frame-switching without adequate testing

**Adaptive Balance:**
Different situations warrant different balances:
- **High Ambiguity**: More comparison, less deep elaboration
- **Clear Strong Evidence**: More elaboration, less comparison
- **Time Pressure**: Some elaboration necessary for action, but maintain alternative awareness
- **High Stakes**: More comparison insurance against fixation errors

## Boundary Conditions

The elaboration-comparison tension applies specifically to:

**Deliberate sensemaking** in **ambiguous situations** with **multiple viable interpretations**.

It does *not* apply to:
- **Pattern recognition**: When situation clearly matches known type, elaborate within that type; comparison is wasteful
- **Routine tasks**: Well-practiced procedures don't need frame comparison
- **Formal domains**: When correct answer is derivable, compute it; don't maintain alternative frames
- **After adequate testing**: Once frames have been adequately compared and one clearly dominates, elaborate decisively

## The Deep Pattern: Managing Cognitive Commitment

The elaboration-comparison tension is fundamentally about **managing cognitive commitment** in uncertain environments:

**Commitment Too Early** → Fixation, resistance to reframing, explaining away contradictions, garden path errors

**Commitment Too Late** → Paralysis, inability to act, perpetual exploration, no functional understanding

**Expert Pattern** → Strategic alternation:
- Delay commitment during high ambiguity (comparison phase)
- Commit decisively once adequate discrimination (elaboration phase)
- Recommit quickly if major anomaly (comparison resumes)
- Final commitment for action (preserve appropriately against noise)

For AI agents, this suggests different operational modes with explicit transitions:

```
EXPLORATION MODE:
- Goal: Generate and evaluate alternative frames
- Strategy: Broad comparison, shallow elaboration
- Transition to ELABORATION when: Discriminating evidence narrows to 1-2 viable frames

ELABORATION MODE:  
- Goal: Develop functional understanding within frame
- Strategy: Deep elaboration, appropriate preservation
- Transition to COMPARISON when: Major anomaly or confidence drops

COMPARISON MODE:
- Goal: Choose between competing frames  
- Strategy: Identify distinguishing evidence, test alternatives
- Transition to ELABORATION when: One frame clearly dominates

COMMITMENT MODE:
- Goal: Support decision-making with stable frame
- Strategy: Elaborate for action, preserve against minor noise
- Transition to COMPARISON when: Decisions repeatedly fail or major anomaly
```

The expert skill—and the agent architecture challenge—is knowing when to be in which mode, and executing clean transitions between them.
```

### FILE: sensemaking-triggers-and-anomaly-detection.md

```markdown
# Sensemaking Triggers and Anomaly Detection: When Does Deliberate Understanding Begin?

## The Initiation Problem

The FOCUS research makes a critical distinction: most cognition is *not* deliberate sensemaking. Pattern recognition, routine execution, and practiced skills run automatically. Sensemaking is "a deliberate and conscious process" (p. 3) that must be *triggered*—something must signal that automatic processing is inadequate and effortful understanding is needed.

The researchers found: "Sensemaking is often triggered by some anomaly or uncertainty that contradicts our typical expectations or interpretations" (p. 9). But this raises deep questions:

**How do you detect an anomaly without already having expectations?**
**How do you know when automatic processing has failed?**
**What makes something surprising enough to trigger deliberate sensemaking?**

These questions are critical for agent systems: if agents don't recognize when they need to engage in sensemaking, they'll apply routine procedures to non-routine situations—a recipe for brittle failure.

## What Constitutes an Anomaly?

The Data/Frame Model defines anomaly detection as part of the **Questioning the Frame** function: "Inconsistent data: One realizes that the data do not match the frame. Anomaly detection: Detection of a unique circumstance in a situation one normally encounters. Violated expectancies: Frames provide people with expectancies; when they are violated people begin to question the accuracy of the frame" (Table 7, p. 25).

This reveals the circular relationship: **Anomalies are frame-relative.** You cannot detect that something is anomalous without a frame that generates expectations. But sensemaking is needed to select and validate frames.

The solution to this circularity: **Humans always have some frame active, even if implicit or poorly specified.** You're never in a true "blank slate" state. When you encounter a situation, pattern-matching and associative processes rapidly activate potentially relevant frames based on surface features, past experiences, and contextual cues.

An anomaly occurs when: **Data activates conflicting frames, violates expectations of the active frame, or fails to fit any readily available frame.**

### Three Types of Anomaly

**Type 1: Expectation Violation**
Active frame generates specific prediction; observation contradicts prediction.

**Example from bus scenario:** 
Frame: "Reducing armored vehicles but adding guard and UAV surveillance maintains perceived security"
Expectation: "Ridership will drop slightly but remain substantial (50-60 students)"
Observation: "Ridership drops to 10 students"  
Anomaly: Massive violation of expectation triggers questioning

**Type 2: Frame Conflict**
Different frames are simultaneously activated by different data elements, yielding contradictory interpretations.

**Example from Afghan Governor:**
Frame A activated by: "supports current government," "no military background," "no financial support to adversaries"
Frame C activated by: "meeting with adversaries multiple times"
Conflict: Same person cannot be both "pro-U.S." and "anti-U.S."
Anomaly: The conflict itself triggers comparison and questioning

**Type 3: Frame Absence**  
No readily available frame seems to apply; situation feels unfamiliar or incoherent.

**Example from navigation study:**
Expected: "This intersection should have a Starbucks on the corner"  
Observed: "No Starbucks, unfamiliar businesses"
Frame: "I'm on X street" no longer makes sense
Anomaly: Realization "I'm lost"—current frame inadequate

### Gradations of Anomaly Strength

Not all anomalies trigger sensemaking equally:

**Weak Anomalies** (minor perturbations):
- Small expectation violations
- Explainable within current frame with modest adjustment
- Don't challenge core frame structure
- Often appropriately "preserved against" (dismissed as noise)

**Moderate Anomalies** (noticeable but ambiguous):
- Clearer expectation violations  
- Require explanation but multiple explanations possible
- May trigger questioning but not necessarily reframing
- Example: Governor disappears for 2-3 weeks (could be legitimate or suspicious)

**Strong Anomalies** (frame-breaking):
- Massive expectation violations
- Cannot be explained within current frame without distortion
- Multiple data points converge on contradiction
- Force frame comparison or reframing
- Example: Ridership drops from 60-80 to 10 students

The research notes that in navigational sensemaking, "corrupting the frame" occurs through anomalies: "managing corrupted cues and anchors" and "spreading corruption" where one misidentified landmark leads to others (p. 4).

## Detecting Anomalies: Human vs. Agent Mechanisms

### Human Anomaly Detection

Humans detect anomalies through:

**1. Automatic Surprise Detection**
Neurological surprise signals when predictions are violated—this is largely unconscious and immediate. You *feel* surprise before articulating what's surprising.

**2. Pattern Interruption**  
When automatic processing hits an obstacle—can't find next action, expected object isn't where it should be, routine breaks down—this interruption surfaces to conscious attention.

**3. Affective Signals**
Confusion, uncertainty, tension, or "something feels wrong" emotional responses flag that current understanding is inadequate.

**4. Explicit Monitoring**
Deliberate checking: "Is this going as expected?" Experts do this more than novices—they actively monitor for discrepancies.

**5. Social Signals**
Others' reactions ("Why would he do that?!") can alert you that your frame may be wrong.

### Agent Anomaly Detection

For agent systems, anomaly detection must be engineered:

**Mechanism 1: Expectation-Matching**

```python
class Frame:
    def generate_expectations(self, context):
        """Frame generates specific predictions given context"""
        return [
            Expectation("ridership will be 50-60 students", confidence=0.7),
            Expectation("bus drivers will be satisfied", confidence=0.6),
            # ...
        ]

def detect_anomalies(frame, observations):
    expectations = frame.generate_expectations(context)
    anomalies = []
    
    for exp in expectations:
        matching_obs = find_matching_observation(exp, observations)
        if matching_obs and contradicts(exp, matching_obs):
            severity = compute_violation_severity(exp, matching_obs)
            anomalies.append({
                'expectation': exp,
                'observation': matching_obs,
                'severity': severity
            })
    
    return anomalies
```

**Mechanism 2: Confidence Degradation**

```python
def monitor_confidence_trajectory(frame, data_sequence):
    """Track whether frame confidence is increasing or decreasing as data arrives"""
    confidence_history = []
    
    for data_point in data_sequence:
        updated_frame = update_frame_with_data(frame, data_point)
        confidence_history.append(updated_frame.confidence)
    
    # Anomaly if confidence drops significantly
    if confidence_history[-1] < confidence_history[0] - THRESHOLD:
        return Anomaly("Frame confidence degrading over time")
    
    # Anomaly if confidence oscillates wildly  
    if variance(confidence_history) > THRESHOLD:
        return Anomaly("Frame confidence unstable")
```

**Mechanism 3: Frame Competition**

```python
def detect_frame_competition(candidate_frames, data):
    """Multiple frames with similar confidence suggests ambiguous situation"""
    
    scores = [score_frame(frame, data) for frame in candidate_frames]
    
    # If multiple frames score similarly, we have unresolved ambiguity
    top_scores = sorted(scores, reverse=True)[:2]
    
    if top_scores[0] - top_scores[1] < DISCRIMINATION_THRESHOLD:
        return Anomaly("Multiple competing frames, cannot discriminate")
```

**Mechanism 4: Preservation Rate Monitoring**

```python
def monitor_preservation_rate(frame, data_history):
    """If frame is constantly explaining away data, it may be wrong"""
    
    contradictions_count = 0
    preserved_count = 0
    
    for data in data_history:
        if contradicts(frame, data):
            contradictions_count += 1
            if frame.explained_away(data):
                preserved_count += 1
    
    preservation_rate = preserved_count / contradictions_count if contradictions_count > 0 else 0
    
    if preservation_rate > THRESHOLD:  # e.g., 0.6
        return Anomaly("Frame being excessively preserved against contradictions")
```

**Mechanism 5: Downstream Failure Detection**

```python
def detect_decision_failures(decisions_based_on_frame):
    """If actions based on frame keep failing, frame may be wrong"""
    
    failure_rate = compute_failure_rate(decisions_based_on_frame)
    
    if failure_rate > THRESHOLD:
        return Anomaly("Decisions based on this frame repeatedly failing")
```

## What To Do When Anomaly Detected

Once an anomaly is detected, the model prescribes several possible responses:

### Response 1: Question the Frame (Moderate Anomaly)

Enter **Questioning** mode:
- Examine whether frame assumptions still hold
- Check data quality (could the anomaly be bad data?)
- Identify what would need to be true for both frame and data to be correct
- Generate questions that would resolve the contradiction

Example: Governor disappears for 2-3 weeks
- Question: "Is extended absence actually anomalous in this context?"
- Investigation: "Has he done this before?"  
- Result: Learning that extended absences are not uncommon → no frame change needed

### Response 2: Compare Frames (Strong Anomaly)

Enter **Comparison** mode:
- Retrieve or generate alternative frames
- Evaluate which frame better explains the data including the anomaly
- Seek discriminating evidence
- May result in switching to alternative frame

Example: Ridership drops from 60-80 to 10 students
- Alternative frames: Students fear violence / Parents restrict students / Bus drivers sabotaging
- Discriminating evidence: Interview students about decision process
- Result: Discovery that parents are decision-makers → reframe

### Response 3: Preserve the Frame (Weak Anomaly or High Confidence Frame)

Enter **Preserving** mode:
- Explain why anomaly is compatible with frame after all
- Discount anomaly as noise, outlier, or measurement error
- Adjust frame slightly to accommodate without major restructuring

Example: Minor ridership fluctuation
- Explanation: "Exams this week, so some students stayed home"
- Frame adjustment: "Expected ridership varies with academic calendar"
- No major frame change

**Critical:** This response is appropriate for genuinely minor anomalies, but becomes pathological fixation if applied to major anomalies.

### Response 4: Reframe (Overwhelming Anomaly)

Enter **Reframing** mode:
- Discard current frame
- Establish new anchors from data previously discarded or reinterpreted  
- Construct entirely new frame
- Recover previously discarded data that now has relevance

Example: Navigation case (from Year 1)
- Realize "I'm not on X Street at all, I'm on Y Street"
- Reinterpret landmarks: "That wasn't the Starbucks I thought, it's a different Starbucks"
- Construct new location frame from scratch

### Response 5: Seek a Frame (No Frame Available)

Enter **Seeking** mode:
- Situation is so novel no frame readily applies  
- Search memory for partially-matching patterns
- Build new frame from fragmentary mental models
- Identify anchors in the data and construct frame around them

Example: Entirely new system architecture or domain
- No existing frame for "How does this specific microservices mesh work?"
- Must build understanding from first principles and fragments  
- Identify key components as anchors and infer relationships

## Engineering Anomaly Sensitivity in Agents

A key challenge: agents must be neither too sensitive (constant false alarms, treating noise as anomalies) nor too insensitive (missing critical signals, fixating on wrong frames).

### Pattern 1: Adaptive Thresholds

Anomaly detection thresholds should adapt to:

**Domain Stability:**
- Stable, well-understood domains → higher thresholds (don't trigger on minor anomalies)
- Dynamic, novel domains → lower thresholds (be more sensitive to unexpected patterns)

**Stakes:**
- High-stakes decisions → lower thresholds (better to over-detect and investigate)
- Low-stakes routine → higher thresholds (false alarms are costlier than missing minor anomalies)

**Confidence:**
- High frame confidence → higher thresholds (take more to dislodge strong frame)
- Low frame confidence → lower thresholds (already uncertain, easy to trigger reexamination)

```python
def compute_anomaly_threshold(domain, stakes, frame_confidence):
    base_threshold = DEFAULT_ANOMALY_THRESHOLD
    
    if domain.stability < 0.5:  # Novel/unstable domain
        base_threshold *= 0.7  # More sensitive
    
    if stakes == HIGH:
        base_threshold *= 0.8  # More sensitive
    
    if frame_confidence < 0.6:
        base_threshold *= 0.9  # More sensitive
    
    return base_threshold
```

### Pattern 2: Multi-Signal Anomaly Detection

Don't rely on single signal. Anomalies are more credible when multiple indicators converge:

```python
def aggregate_anomaly_signals(frame, observations, context):
    signals = []
    
    # Signal 1: Expectation violations
    if expectation_violated(frame, observations):
        signals.append(('expectation_violation', severity_1))
    
    # Signal 2: Confidence degradation
    if confidence_decreasing(frame, observations):
        signals.append(('confidence_drop', severity_2))
    
    # Signal 3: Preservation rate
    if excessive_preservation(frame):
        signals.append(('over_preservation', severity_3))
    
    # Signal 4: Stakeholder disagreement  
    if other_agents_disagree(frame):
        signals.append(('disagreement', severity_4))
    
    # Signal 5: Downstream failures
    if decisions_failing(frame):
        signals.append(('decision_failure', severity_5))
    
    # Aggregate: anomaly is credible if multiple signals fire
    total_severity = sum(s[1] for s in signals)
    
    if len(signals) >= 2 and total_severity > THRESHOLD:
        return Anomaly(signals, total_severity)
```

### Pattern 3: Staged Anomaly Response

Don't immediately jump to reframing on first anomaly. Escalate response based on anomaly persistence:

```
Level 0: No anomaly → Continue elaborating frame
Level 1: Weak anomaly → Log it, continue monitoring
Level 2: Moderate anomaly → Question frame (investigate)  
Level 3: Strong anomaly → Compare alternative frames
Level 4: Overwhelming anomaly → Reframe entirely
```

```python
class AnomalyTracker:
    def __init__(self):
        self.anomaly_history = []
        
    def register_anomaly(self, anomaly):
        self.anomaly_history.append(anomaly)
        
    def recommend_response(self):
        recent = self.anomaly_history[-WINDOW:]  # Last N anomalies
        
        if len(recent) == 0:
            return "CONTINUE_ELABORATING"
        
        severity = max(a.severity for a in recent)
        frequency = len(recent)
        
        if severity < 0.3:
            return "LOG_AND_MONITOR"  
        elif severity < 0.6 and frequency < 3:
            return "QUESTION_FRAME"
        elif severity < 0.8 or frequency >= 3:
            return "COMPARE_FRAMES"
        else:
            return "REFRAME"
```

## Expert vs. Novice Anomaly Detection

The research suggests experts differ in anomaly detection:

**1. Experts Generate Richer Expectations**
More elaborated frames → more specific predictions → easier to detect violations

**2. Experts Monitor More Actively**
Deliberate checking: "Is this consistent with my understanding?" rather than passively waiting for surprise

**3. Experts Question Evidence Quality**
Before treating data as anomalous, check if data itself is anomalous (bad source, measurement error)

Example: "Experts were more likely to question the quality of the data, while novices tended to take them at face value" (p. 3)

In Experiment 2a, "Questioning of negative evidence did depend on experience level, with field experienced participants (77%) questioning significantly more than laypeople (45%)" (p. 19).

**4. Experts Detect Patterns in Anomalies**
Not just "this is weird" but "this type of weirdness suggests X underlying issue"

**5. Experts Calibrate Anomaly Seriousness**
Better at distinguishing minor noise from major frame-breaking events

### Training Anomaly Detection

**Exercise 1: Expectation Generation**
- Present scenario with active frame
- Require: "What specific events would you expect to see? What would be surprising?"
- Practice making frame expectations explicit (prerequisite for anomaly detection)

**Exercise 2: Anomaly Classification**
- Present scenario with various contradictory data points
- Require: "Classify each as: minor noise, moderate anomaly, major anomaly"
- Compare to expert classifications  
- Discuss: What makes an anomaly serious vs. dismissible?

**Exercise 3: Response Selection**
- Present anomaly of varying severity
- Require: "Should you preserve, question, compare, or reframe?"
- Practice matching response to anomaly type

**Exercise 4: False Alarm Analysis**
- Present cases where apparent anomalies were actually bad data
- Practice: Check data quality before concluding frame is wrong

## Anomaly Detection in Multi-Agent Systems

In orchestrated agent systems, anomaly detection can be distributed:

**Pattern 1: Specialist Anomaly Detectors**
Some agents specialize in monitoring for anomalies in specific dimensions:
- Performance anomaly detector (unexpected latency, failures)
- Security anomaly detector (unusual access patterns)
- Data quality anomaly detector (suspicious inputs, outliers)

**Pattern 2: Cross-Agent Disagreement as Anomaly Signal**
When multiple agents assessing the same situation produce different frames:
```python
def detect_frame_disagreement(agents, situation):
    frames = [agent.assess_situation(situation) for agent in agents]
    
    if len(set(frames)) > 1:  # Agents disagree on situation type
        return Anomaly("Cross-agent frame disagreement")
```

**Pattern 3: Hierarchical Anomaly Escalation**
Low-level agents detect local anomalies; if unresolved, escalate to higher-level sensemaking:
```
Code Agent detects: "This function behavior doesn't match specification"
  → If cannot resolve locally, escalate to Architecture Agent
Architecture Agent detects: "This component interaction doesn't match design"
  → If cannot resolve, escalate to System Understanding Agent  
```

**Pattern 4: Monitoring Loops**
Dedicated monitoring agents watch for decision failures:
```python
class DecisionMonitor:
    def observe_decision_outcome(self, decision, outcome):
        if outcome.failed():
            # Decision failed → frame that generated it may be wrong
            triggering_frame = decision.source_frame
            anomaly = Anomaly(f"Decision based on {triggering_frame} failed")
            request_frame_reexamination(triggering_frame, anomaly)
```

## Boundary Conditions: When Anomaly Detection Doesn't Apply

Anomaly detection presumes:
- **Expectations exist**: You have a frame generating predictions  
- **Observations available**: You receive data to compare against expectations
- **Non-deterministic domain**: There can be unexpected events (in fully deterministic, closed systems, "anomalies" are impossible by definition)

It does not apply to:
- **Initial contact with entirely novel situation**: No frame exists yet to generate expectations; you're in Seeking mode from the start
- **Routine execution of well-validated procedures**: Anomalies should be rare; if frequent, the procedure itself is wrong
- **Formal derivation**: In mathematics or logic, "anomalies" are contradictions indicating errors in reasoning, not surprising observations

## The Deep Pattern: Anomalies as Learning Signals

The most profound insight: anomalies are not merely problems to be solved or failures to be corrected. They are **learning signals**—indicators of where your current understanding is inadequate.

Organizations that suppress anomaly signals (blame people for "exceptions," pressure to explain everything within existing frames) destroy learning. Organizations that welcome anomalies, investigate them seriously, and update understanding accordingly develop expertise.

For agent systems: anomalies should trigger not just immediate frame adjustment but also:
- **Logging** for later analysis: "What patterns exist across anomalies?"
- **FMM extraction**: "What new fragmentary mental model did this anomaly teach us?"
- **Frame library updates**: "Should we add a new frame for this situation-type?"
- **Threshold calibration**: "Are we too sensitive or insensitive to this anomaly type?"

Build agents that treat anomalies as opportunities for learning, not merely obstacles to smooth operation. This is the difference between systems that degrade over time (as the world changes) and systems that improve through experience.

The expert pattern: "I don't understand this yet, and that's important information."
```

---

## SKILL ENRICHMENT

**Debugging Skills**: The Data/Frame Model directly applies—debugging is sensemaking under high ambiguity. Enrich debugging by: (1) Making candidate bug hypotheses (frames) explicit rather than implicit; (2) Teaching frame-questioning when fixes don't work (don't preserve bad hypotheses); (3) Training assumption-challenging questions like "Who/what actually controls this value?"; (4) Using FMM libraries of common bug patterns as starting frames; (5) Implementing staged anomaly response (don't immediately blame the first suspicious code—question, then compare).

**Code Review Skills**: Code review often surfaces anomalies ("Why is this structured this way?"). Enrich by: (1) Training reviewers to distinguish preservation ("It's probably fine") from legitimate questioning; (2) Encouraging assumption-challenging questions ("Does this assumption hold under load?"); (3) Building FMM libraries of architectural smells and anti-patterns; (4) Teaching separation between understanding intent (sensemaking) and evaluating implementation (decision-making); (5) Detecting when reviewer has fixated on wrong frame for what code is trying to do.

**Architecture Design Skills**: Architecture work requires extended sensemaking about system behavior under counterfactuals. Enrich by: (1) Making architectural frames (mental models of how system will behave) explicit and challengeable; (2) Forcing comparison of alternative architectural frames before committing; (3) Training architects to ask assumption-challenging questions about scalability, failure modes, user behavior; (4) Using FMM libraries of component interaction patterns; (5) Implementing elaboration budgets—don't over-commit to first architecture without comparing alternatives.

**Task Decomposition Skills**: Decomposition requires understanding problem structure before breaking it down—pure sensemaking. Enrich by: (1) Separating sensemaking phase (understand the task) from decision phase (choose decomposition strategy); (2) Teaching questioning of apparent task requirements ("Is this actually what's needed?"); (3) Using FMM libraries of common problem types and their natural decomposition patterns; (4) Training detection of when initial decomposition frame is wrong (subtasks fail or don't compose); (5) Encouraging comparison of alternative decomposition strategies before committing.

**Security