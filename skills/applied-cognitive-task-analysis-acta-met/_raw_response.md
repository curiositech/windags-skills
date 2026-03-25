## BOOK IDENTITY

**Title**: Applied Cognitive Task Analysis (ACTA) Methodology  
**Author**: Laura G. Militello, Robert J. B. Hutton, Rebecca M. Pliske, Betsy J. Knight, Gary Klein, Josephine Randel  
**Core Question**: How can we systematically extract and represent the cognitive expertise of skilled practitioners in ways that enable training design, without requiring years of specialized research training?

**Irreplaceable Contribution**: This work is unique in bridging the "translation gap" between academic cognitive science research and operational training development. Most cognitive task analysis methods require extensive training, consume significant time, and produce outputs difficult for non-researchers to interpret. ACTA demonstrates that rigorous cognitive elicitation can be streamlined, standardized, and taught to practitioners in 6 hours while maintaining validity. The book reveals that the bottleneck in intelligent systems isn't lack of sophisticated methods—it's lack of *usable* methods. It shows how making something 70% as comprehensive but 10x as accessible creates far more value than optimizing academic rigor. This pragmatic epistemology of "good enough to be useful" is rarely documented with such methodological care.

---

## KEY IDEAS

1. **The Expertise-Documentation Gap**: Complex tasks increasingly require cognitive skills (judgment, pattern recognition, situation awareness) rather than procedural execution. Traditional behavioral task analysis captures what experts *do* but misses *how they think*—the experience-based knowledge that distinguishes expert from novice performance. This gap means critical cognitive skills are either taught idiosyncratically through "sea stories" or not taught at all.

2. **Structured Flexibility Paradox**: Effective knowledge elicitation requires enough structure to be teachable and reliable, yet enough flexibility to follow expert thinking. ACTA resolves this through tiered techniques: Task Diagram provides overview structure, Knowledge Audit systematically probes expertise categories, Simulation Interview follows contextual reasoning. The interviewer must understand *what they're searching for* (expertise patterns) without rigidly prescribing *what they'll find*.

3. **Context Dependency of Expertise**: Experts don't store knowledge as abstract rules—they recognize patterns in context, simulate futures based on similar pasts, and notice meaningful deviations from typicality. Elicitation methods must therefore ground cognitive processes in specific incidents and scenarios, not abstract questioning. The simulation interview's power comes from triggering situated cognition rather than forcing decontextualized articulation.

4. **Reliability Through Cognitive Categories**: The Knowledge Audit achieves consistency not through rigid protocols but by organizing probes around fundamental expertise dimensions: perceptual skills (noticing), past/future (mental simulation), big picture (situation awareness), tricks of trade (heuristics), improvising, self-monitoring, anomaly detection. These categories, derived from expertise research, act as search structures that different interviewers can apply to different domains.

5. **The Representation Problem**: Raw interview data is overwhelming and opaque. The Cognitive Demands Table transforms transcripts into actionable training insights by forcing analysts to identify: what's difficult, why it's difficult for novices, and what cues/strategies experts use. This representation makes expertise *portable*—other designers can create training without attending the original interviews. The representation is the deliverable, not the interview itself.

---

## REFERENCE DOCUMENTS

### FILE: extracting-expertise-through-structured-probes.md

```markdown
# Extracting Expertise Through Structured Probes: The Knowledge Audit Approach

## The Central Challenge

Expert knowledge is largely tacit, built through years of pattern recognition and situated problem-solving. When asked to explain their expertise, experts typically respond with procedures ("I check the readings") or vague generalities ("You develop a feel for it"). The Knowledge Audit addresses this through a systematic framework for probing different dimensions of expertise, grounded in decades of cognitive research but simplified for practitioner use.

## The Six Fundamental Dimensions of Expertise

The ACTA framework identifies six cognitive capabilities that distinguish expert from novice performance across domains:

**Perceptual Skills** - Experts detect cues and patterns that novices cannot see. A fireground commander notices "the color and movement of smoke" providing instant information about fire location, intensity, and building structural integrity. An electronic warfare supervisor hears subtle differences in radar signal characteristics. These aren't learned as facts—they're learned through exposure to hundreds of variations until patterns become salient.

The probe: "Have you had experiences where part of a situation just 'popped' out at you; where you noticed things going on that others didn't catch?"

**Past and Future (Mental Simulation)** - Experts can "story-build"—reconstructing how a situation arose and projecting how it will evolve. This enables proactive intervention before problems develop. A commander arriving mid-incident can reconstruct the fire's progression from damage patterns and current conditions, then anticipate structural collapse before visual warning signs appear.

The probe: "Is there a time when you walked into the middle of a situation and knew exactly how things got there and where it was headed?"

**Big Picture (Situation Awareness)** - Novices focus on individual elements. Experts simultaneously track multiple interrelated factors and understand how they interact. The fireground commander maintains awareness of water supply, building type, occupancy status, weather conditions, crew locations, and changing fire behavior—integrating these into a coherent assessment that guides all decisions.

The probe: "Can you give me an example of what is important about the Big Picture for this task? What are the major elements you have to know and keep track of?"

**Tricks of the Trade (Efficient Heuristics)** - Experts develop shortcuts that aren't taught formally but emerge from experience. These aren't corner-cutting—they're optimizations that accomplish more with less. A mechanic develops a diagnostic sequence that eliminates 80% of possible causes with three quick checks. An EW operator develops a verification routine that catches equipment errors.

The probe: "When you do this task, are there ways of working smart or accomplishing more with less that you have found especially useful?"

**Opportunities and Improvising** - Experts recognize when standard procedures won't work and when situations offer opportunities beyond the standard playbook. They're comfortable adapting based on situational specifics rather than rigidly following protocols.

The probe: "Can you think of an example when you have improvised in this task or noticed an opportunity to do something better?"

**Self-Monitoring and Adjustment** - Experts notice when their own performance is degrading (fatigue, stress, distraction) and adjust accordingly. They also catch their own errors before they cascade into larger problems.

The probe: "Can you think of a time when you realized that you would need to change the way you were performing in order to get the job done?"

## The Three-Column Structure

For each expertise dimension, the Knowledge Audit elicits three types of information:

1. **Example** - A specific incident where this aspect of expertise was critical
2. **Why Difficult** - What makes this hard for less experienced personnel
3. **Cues and Strategies** - What information the expert attends to and how they use it

This structure forces concreteness (the example), surfaces the novice-expert gap (why difficult), and makes expertise portable (cues and strategies can be taught).

## Application to Agent System Design

### For Intelligent Routing Systems

When designing systems that route complex problems to appropriate specialists, the Knowledge Audit framework reveals:

- **What cues** indicate problem complexity level (perceptual skills dimension)
- **What context** must be preserved when escalating (big picture dimension)
- **What rapid checks** can eliminate 80% of false paths (tricks of trade dimension)

A routing agent that only knows "if problem type X, route to specialist Y" misses the expertise of pattern recognition: "This *looks like* X but has three indicators that it's actually a subtle variant requiring different handling."

### For Decomposition Systems

Task decomposition by intelligent agents often fails because it doesn't capture the "why difficult" and "cues/strategies" dimensions. Decomposing a task into subtasks (what ACTA's Task Diagram does at surface level) is necessary but insufficient.

The Knowledge Audit reveals:
- Which subtasks require expertise vs. which are procedural
- What makes expert subtask execution different from novice execution
- What cues trigger transitions between subtasks or modifications to the plan

An agent system decomposing "diagnose network failure" needs to know that "check log files" is different for an expert (who knows what patterns signal specific failure modes) versus a novice (who reads logs linearly).

### For Training Simulators and Synthetic Scenarios

The simulation interview provides the structure for what makes a scenario "challenging" rather than merely complicated. Graduate students with no domain experience, after learning ACTA, generated training materials rated by domain experts as 70%+ important and 90%+ accurate.

For agent systems that generate training scenarios or test cases:
- **Past/Future probes** reveal what temporal reasoning the scenario must test
- **Big picture probes** identify what elements must be present simultaneously
- **Potential errors** (from simulation interview) define what the scenario should surface

### For Human-AI Collaboration Interfaces

The "Equipment Difficulties" optional probe ("Have there been times when the equipment pointed in one direction, but your own judgment told you to do something else?") directly addresses AI system design.

Experts don't blindly trust instruments or automation. The Knowledge Audit surfaces:
- When experts override system recommendations
- What cues they use to assess system reliability in-context
- How they verify or doubt automated outputs

This is critical for designing AI systems that will be adopted: the system must surface information that supports expert skepticism rather than demanding blind trust.

## Boundary Conditions

**When This Approach Fails:**

1. **Truly novel domains** - If genuine experts don't exist (new technology, unprecedented situations), there's no expertise to extract

2. **Purely procedural tasks** - If expert and novice performance is identical when following procedures, cognitive task analysis adds no value

3. **Individual difference domains** - If the "right answer" varies by expert with no reconcilable differences (purely subjective judgment), the framework reveals disagreement but can't resolve it

4. **Tacit-perceptual extremes** - Some expertise (wine tasting, art authentication) may be so perceptual that experts cannot articulate cues even with structured probing

**When Alternative Approaches Are Better:**

- **Team coordination tasks** - ACTA was designed for individual expertise. Team Cognitive Task Analysis requires different methods (information flow analysis, shared mental models)

- **Detailed mental model mapping** - If you need comprehensive causal models of expert reasoning (for building expert systems), more intensive methods like conceptual graph analysis are warranted

- **Real-time protocol analysis** - If you need moment-by-moment reasoning during task execution, think-aloud protocols provide different data

## Implementation Insights

The evaluation study revealed that successful knowledge elicitation depends on:

1. **Understanding what you're looking for** - Interviewers who understood expertise dimensions (from the introductory material on cognition) were dramatically more effective than those who just learned the probes

2. **Following expert tangents purposefully** - The probes provide structure, but experts often reveal critical information through stories that don't directly answer the question. Skilled interviewers recognized valuable tangents.

3. **Pushing past surface responses** - First responses are often procedural. The interviewer must probe: "What makes that tricky?" "How would you know?" "What would trip up someone new?"

4. **Writing for later understanding** - Interview notes must capture enough context that someone who wasn't present can understand what was meant. The Cognitive Demands Table representation forces this discipline.

The finding that graduate students with minimal training could produce valid training materials demonstrates that the bottleneck isn't method sophistication—it's having a learnable structure that directs attention to expertise dimensions that matter.

## For Multi-Agent Orchestration

In systems where multiple AI agents collaborate to solve problems:

- **The Knowledge Audit framework defines capability types** - An agent with "perceptual skills" can recognize patterns; one with "mental simulation" can project futures; one with "tricks of trade" can apply heuristics efficiently

- **The "why difficult" column identifies bottlenecks** - Where novices struggle indicates where agent assistance is most valuable

- **The cues/strategies column defines information requirements** - What experts attend to defines what information must be available to agents at decision points

A sophisticated orchestration system might route tasks based not just on domain (firefighting, software debugging) but on cognitive demand type: Does this problem require pattern recognition? Mental simulation? Handling of anomalies? Different agent capabilities or different information contexts might be optimal.
```

### FILE: simulation-based-expertise-elicitation.md

```markdown
# Simulation-Based Expertise Elicitation: Triggering Situated Cognition

## The Context Problem in Knowledge Elicitation

When you ask an expert "How do you diagnose network failures?", you typically get either vague generalities ("I check the usual suspects") or procedural checklists that describe novice behavior, not expert judgment. This occurs because expertise is *situated*—it operates in context, triggered by specific cues and situations.

The Simulation Interview solves this by presenting a challenging scenario and asking the expert to walk through their reasoning as if they were handling it in real-time. This triggers the situated cognitive processes that experts actually use, rather than their abstract theories about their work.

## The Five-Column Structure

The Simulation Interview organizes expert reasoning into five dimensions:

**Events/Decisions** - Major turning points or segments in the scenario. These aren't detailed play-by-play accounts but rather the 3-6 critical moments where judgment was required. An electronic warfare scenario might include: "Detected unknown signal," "Classified as threat," "Decided not to jam immediately."

**Actions** - What the expert would do at this moment. Importantly, this includes decisions NOT to act, which are often invisible in behavioral observation but represent critical judgment.

**Situation Assessment** - What the expert thinks is happening and why. This surfaces the expert's mental model—the story they're telling themselves about the situation. A fireground commander might assess: "This is a commercial building with lightweight construction, fire has been burning 20+ minutes, high collapse risk."

**Critical Cues** - What specific information led to this assessment and these actions. This is where tacit knowledge becomes explicit. The commander's assessment is based on: "No flames visible but heavy smoke from eaves (attic fire), sagging roofline, unusual creaking sounds, the age and construction type from pre-plans."

**Potential Errors** - What mistakes a novice would likely make in this situation. This surfaces the novice-expert gap directly. "A novice would ventilate the attic to release smoke, which would feed oxygen to the fire and accelerate structural collapse."

## Why Scenarios Work When Abstract Questions Fail

**Concreteness grounds reasoning** - Instead of "How do you assess situations?", the expert faces "What's happening HERE?" The specific details of the scenario constrain the response to actual judgment processes rather than theoretical procedures.

**Cues become visible** - In abstract discussion, experts don't think to mention that they noticed the roofline sagging. In a scenario, when asked "What made you think the building might collapse?", the perceptual cues that triggered the assessment become reportable.

**Decision points emerge naturally** - The expert segments the scenario into meaningful chunks that reflect their cognitive organization of the problem, not the analyst's predetermined categories.

**Alternative reasoning surfaces** - Asking "Are there alternative interpretations?" or "What else might you have done?" reveals the decision space the expert was navigating, showing what they considered and rejected.

## Fidelity Is Surprisingly Unimportant

A key finding: Paper-and-pencil scenarios worked as well as high-fidelity simulations. An electronic warfare simulation was a written description of sensor readings and tactical positions. Firefighting scenarios used simple diagrams and text descriptions.

Why low fidelity suffices:
- The goal is eliciting reasoning, not measuring performance
- High fidelity can distract the expert with irrelevant details
- Text scenarios force verbalization of what would normally be automatic perception
- The expert's expertise fills in the details anyway—they imagine realistic situations

This has major implications for agent system development: you don't need expensive simulation infrastructure to extract expertise. A well-crafted written scenario that presents a challenging situation with ambiguous cues is sufficient.

## Application to Agent System Design

### Scenario-Based Agent Testing

The simulation interview structure provides a direct template for testing agent reasoning:

1. Present the agent with a challenging scenario (not just edge cases, but situations requiring judgment)
2. Capture the agent's "actions" (what it decides to do)
3. Extract the agent's "situation assessment" (its model of what's happening)
4. Identify what "critical cues" it's attending to (what features drove its reasoning)
5. Compare to expert reasoning to identify where agent assessment diverges

This reveals whether the agent is making decisions for the "right reasons" (attending to expert-relevant cues) or getting correct answers through spurious correlations.

### Generating Synthetic Training Data

The "potential errors" column directly generates negative examples for training:

- Expert says: "Novice would ventilate the attic immediately"
- This becomes a training example where the model should strongly prefer NOT ventilating given the collapse indicators present

- Expert says: "Inexperienced EW would classify this as friendly based solely on signal frequency"
- This becomes a training example where additional cues (bearing, signal characteristics, tactical context) must override the frequency-based classification

Current ML systems often lack negative examples showing plausible-but-wrong reasoning. Expert identification of novice errors provides exactly this.

### Designing Explanation Systems

When an AI system must explain its reasoning, the five-column structure provides the explanation template:

- "Here's the situation as I assess it" (situation assessment)
- "I'm basing this on" (critical cues)
- "So I recommend" (actions)
- "An alternative approach would be X, but that risks Y" (addresses alternative reasoning)
- "A common mistake would be Z because..." (potential errors, showing what the system is avoiding)

This matches how experts explain decisions to less-experienced colleagues—not by reciting procedures, but by articulating situation assessment and cue interpretation.

### Multi-Agent Coordination

In systems where multiple agents handle different aspects of a complex problem, the simulation interview reveals coordination requirements:

**Information handoffs** - When the expert's "situation assessment" at one decision point depends on information from earlier events, this indicates what must be communicated between agents handling different phases.

**Decision dependencies** - When actions at one stage constrain options at later stages (e.g., "Because I committed crews to the north side, I need mutual aid for the south side"), this reveals sequential dependencies in agent planning.

**Uncertainty propagation** - When the expert says "I would do X if my earlier assessment was correct, otherwise Y," this shows how agents must maintain probabilistic assessments through multi-step reasoning.

## The "Scenario from Hell" Optional Probe

One optional probe in the Knowledge Audit asks: "If you were going to give someone a scenario to teach them humility—that this is a tough job—what would you put into that scenario?"

This elicits the characteristics that make problems *hard*, not just complicated:

- Multiple conflicting cues (sensor A says X, sensor B says Y)
- Time pressure combined with high stakes
- Missing information that's usually available
- Equipment malfunctions that require override
- Situations where standard procedures would fail

For agent system testing, these "scenarios from hell" define the evaluation frontier—the cases where systems trained on typical data will fail without deeper reasoning capabilities.

## Boundary Conditions and Limitations

**When Simulation Interview Fails:**

1. **Routine, well-proceduralized tasks** - If expert and novice do the same thing, the simulation reveals nothing

2. **Experts disagree fundamentally** - If different experts make incompatible assessments of the same scenario (not just different tactics, but different readings of the situation), the method surfaces disagreement but doesn't resolve it

3. **Heavily team-dependent tasks** - Individual simulation interviews don't capture coordination, information flow, and shared situation awareness in team settings

**When It Works Best:**

1. **Judgment-intensive tasks** - Where the same observable situation can be interpreted multiple ways
2. **High uncertainty** - Where information is incomplete or ambiguous
3. **Time pressure** - Where experts use shortcuts and heuristics that aren't in procedures
4. **Consequence-laden decisions** - Where getting it wrong matters enough that experts have learned to be careful

## Implementation Insights from Evaluation

The study found that graduate students could conduct effective simulation interviews after 6 hours of training, but several factors predicted success:

**Scenario selection** - Scenarios that were too simple yielded procedural responses. Scenarios that were too complex overwhelmed the interview structure. The sweet spot: scenarios where 3-5 major judgment points occur, each with meaningful alternatives.

**Managing expert critique** - Experts often want to critique the scenario's realism rather than engage with it. Successful interviewers acknowledged the critique would be valuable later, but first worked through the scenario as presented.

**Probing for cues** - When experts said "I would do X," weak interviewers accepted that and moved on. Strong interviewers probed: "What made you decide X rather than Y?" or "What would you be looking for to confirm that decision?"

**Recognizing when assessment shifts** - Experts often update their situation assessment as the scenario unfolds. Recognizing these moments ("Wait, now I think something different is happening") and marking them as new "events" captured cognitive turning points.

## For Agent Orchestration

In multi-agent systems deciding how to decompose and route complex problems:

**The event/decision structure reveals natural problem segmentation** - Where experts identified major decisions indicates where problems naturally break into chunks that could be handled by different agents or different reasoning approaches.

**Critical cues define information requirements** - What information the expert needed at each decision point defines what an agent handling that stage must have access to—either through direct sensing or through handoff from previous agents.

**Situation assessment reveals abstraction layers** - When experts interpret low-level cues into higher-level assessments ("dead space, addon floor, poor materials" → "faulty construction, building may collapse"), this shows how agents must build abstractions from raw data.

A sophisticated orchestration system might:
1. Present a problem to a "situation assessment" agent
2. Route to different "action planning" agents based on the assessed situation type
3. Have "cue verification" agents check whether critical indicators support the assessment
4. Consult "error checking" agents that know common mistakes for this situation type

This mirrors how experts think through scenarios, and the simulation interview structure reveals exactly this reasoning architecture.
```

### FILE: cognitive-demands-table-as-integration-tool.md

```markdown
# The Cognitive Demands Table: From Raw Data to Actionable Insight

## The Representation Problem

Cognitive Task Analysis interviews generate vast amounts of qualitative data—stories, examples, cues, strategies, observations. A typical ACTA session with one expert produces 10-15 pages of notes. After interviewing 3-5 experts, you have 50-75 pages of rich but overwhelming information.

The Cognitive Demands Table solves a critical problem that stymies most knowledge management efforts: transforming raw interview data into a representation that non-experts can use to make design decisions. It's a forcing function that compels the analyst to identify patterns, reconcile differences, and extract actionable insights.

## The Four-Column Structure

**Difficult Cognitive Element** - What aspect of the task requires expertise? This must be specific enough to be meaningful but general enough to appear across multiple interviews. Bad: "The job is hard." Good: "Knowing where to search after an explosion in an office building."

**Why Difficult?** - What makes this hard for someone without experience? This surfaces the novice-expert gap explicitly. For "knowing where to search": "Novices may not be trained in dealing with explosions. Other training suggests you should start at the source and work outward. Not everyone knows about Material Safety Data Sheets that contain critical information."

**Common Errors** - What mistakes do less-experienced people make? For searching after explosion: "Novice would be likely to start at the source of the explosion. Starting at the source is a rule of thumb for most other kinds of incidents."

**Cues and Strategies Used** - What information do experts attend to, and how do they use it? For explosion search: "Start where you are most likely to find victims, keeping in mind safety considerations. Refer to Material Safety Data Sheets to determine where dangerous chemicals are likely to be. Consider the type of structure and where victims are likely to be. Consider the likelihood of further explosions."

## Why This Structure Works

**Forces synthesis across interviews** - If you interviewed three fireground commanders and they each told different stories about explosions, the Cognitive Demands Table requires finding the common cognitive challenge: assessing where victims are likely to be given incomplete information and safety constraints.

**Makes tacit knowledge explicit** - Experts don't say "I use Material Safety Data Sheets to determine chemical locations." They say "Check the MSDS." The analyst must infer why this matters (determines dangerous chemical locations) and when novices would miss it (not everyone knows these exist).

**Separates domain content from cognitive skill** - The "difficult cognitive element" might be "diagnosing intermittent network failures." The "why difficult" is often a cognitive reason applicable across domains: "The failure isn't present when you're looking for it, requiring mental reconstruction from traces it left behind."

**Provides design guidance directly** - Each row in the table implies training or system design interventions:
- Train the cognitive skill (how experts do it differently)
- Surface the critical cues (make them more visible)
- Alert to common errors (warnings or checks)
- Provide expert strategies as heuristics (decision support)

## Application to Agent System Design

### Skill Inventory for Agent Capabilities

Each row in a Cognitive Demands Table defines a capability that an agent might need:

**Difficult Element**: "Determining whether a building is likely to collapse"

This becomes a capability spec:
- **Inputs required**: Building age/type, fire duration, weather conditions, visible damage, sounds
- **Reasoning type**: Pattern recognition + causal modeling
- **Output**: Probability estimate + confidence + key indicators
- **Failure mode**: False negatives (missing subtle cues) or false positives (over-reacting to minor issues)

**Common Errors** column defines test cases - the agent should NOT make these mistakes that novices make.

**Cues and Strategies** column defines feature importance - these are the inputs the agent should weight heavily.

### Decomposition and Routing Logic

The Cognitive Demands Table reveals which aspects of a task require which types of reasoning:

**Pattern recognition tasks** (cues column emphasizes perceptual signals):
- "Heavy smoke from eaves indicates attic fire"
- "Rhythmic slapping sound indicates uneven tire wear"
- Route to perception-specialized agents or neural pattern matchers

**Causal reasoning tasks** (why difficult involves understanding mechanisms):
- "Ventilating the attic draws fire upward through pipes and electrical system"
- "This wear pattern indicates front-end alignment problem"
- Route to causal model-based reasoners or simulation engines

**Heuristic/optimization tasks** (strategies column lists shortcuts):
- "Start search where victims most likely, considering safety"
- "These three checks eliminate 80% of possible causes"
- Route to constraint satisfaction or planning agents

**Knowledge-intensive tasks** (why difficult mentions information novices don't have):
- "Novices don't know about Material Safety Data Sheets"
- "Requires knowing typical failure signatures for this equipment type"
- Route to knowledge base lookup or retrieval-augmented generation

### Training Data Generation

Each row in the Cognitive Demands Table implies training examples:

**For the "searching after explosion" row:**

Positive examples:
- Expert started search in office areas despite explosion source being in storage area (victims more likely in offices)
- Expert checked MSDS before entering (identified chemical hazards)

Negative examples (from Common Errors column):
- Started at explosion source despite low victim probability
- Proceeded without checking MSDS and encountered unexpected hazards

The "why difficult" column often suggests hard negatives—examples that look right to novices but are wrong:
- Starting at source works for most fires (correct in other contexts)
- But starting at source is wrong when explosion + chemicals involved

This type of contrastive data (what's right in context A but wrong in context B) is exactly what current ML systems struggle with.

### Explanation Generation

When an AI system must explain its reasoning to users, the Cognitive Demands Table structure provides the explanation template:

User asks: "Why are you recommending searching the offices first instead of starting at the explosion site?"

Agent explains:
1. **Cognitive element**: "Determining search priority after explosion requires balancing victim likelihood with safety"
2. **Why standard approach fails**: "The usual rule of starting at the source works for typical fires but is dangerous after explosions with chemical involvement"
3. **Cues I'm using**: "MSDS indicates hazardous chemicals in storage area near explosion source. Office areas have higher occupancy during business hours"
4. **Strategy**: "Search where victims are most likely while maintaining crew safety. Check MSDS to identify hazard locations"

This explanation structure—what makes this hard, why standard approaches fail, what I'm noticing, and what strategy I'm applying—matches how experts explain decisions to learners.

### Error Detection and Recovery

The "Common Errors" column defines anti-patterns that the system should detect:

**In agent self-monitoring**:
- Agent detects it's about to "start at the explosion source"
- Checks whether this matches the common error pattern
- Verifies whether the conditions that make this an error are present (chemicals, explosion vs. fire)

**In human-AI collaboration**:
- System detects user is about to make a common novice error
- Provides warning: "Starting at the explosion source is appropriate for most fires, but with chemical involvement and explosion, searching high-occupancy areas first while verifying chemical locations is safer"

**In multi-agent coordination**:
- Agent A proposes action that agent B recognizes as a common error for the current situation type
- Agent B explains why this is typically wrong in this context
- Agents negotiate alternative approach based on expert strategies

## Handling Expert Disagreement

In the evaluation study, sometimes different experts gave conflicting advice. The Cognitive Demands Table surfaces this explicitly:

**Difficult Element**: "Diagnosing network failure with intermittent symptoms"

**Cues and Strategies**:
- Expert A: "Check logs chronologically to find when issue first appeared"
- Expert B: "Sample logs at multiple time points to find pattern"
- Expert C: "Start with most recent logs and work backward until finding last normal state"

Rather than hiding disagreement, the table shows alternative strategies exist. For agent systems, this suggests:

1. **Multiple strategies should be available** (agent can select based on context)
2. **Strategy selection becomes a meta-task** (when to use which approach)
3. **Evaluation metrics should allow multiple valid solutions** (don't assume single ground truth)

## The Consolidation Challenge

Creating a Cognitive Demands Table from multiple interviews requires reconciling:

**Different levels of abstraction**:
- Expert A: "Look at the smoke"
- Expert B: "Notice color, volume, movement, and pressure of smoke"
- Analyst must decide: Are these the same element at different detail levels, or different elements?

**Different terminology**:
- Fireground Commander: "Do a size-up"
- Navy instructor: "Establish situation awareness"
- Same cognitive element, different professional language

**Different emphases based on experience**:
- Very experienced expert: "Trust your gut feeling that something's off"
- Recently experienced expert: "Systematically check these five indicators"
- Both describe valid expertise but at different developmental stages

The analyst must use judgment to synthesize these into coherent cognitive demands. This is why the evaluation study had SME raters assess the output—to verify that analyst synthesis preserved validity.

## Boundary Conditions

**When Cognitive Demands Tables Work Well:**

1. **Multiple interviews completed** - Patterns emerge when you have 3-5+ experts describing similar challenges
2. **Focused task scope** - Tables work for specific tasks (signal threat analysis, size-up), not entire job roles
3. **Clear novice-expert performance gap** - If novices and experts do the same thing, nothing to capture
4. **Analyst has domain familiarization** - Not expertise, but enough orientation to understand what experts are describing

**When They Fail or Need Modification:**

1. **Highly team-dependent tasks** - Table captures individual cognition; team coordination requires different representation (information flow diagrams, shared mental model maps)

2. **Perceptual skills dominant** - When expertise is "I can hear the difference" and expert can't articulate cues, strategies column stays thin

3. **Highly proceduralized with rare exceptions** - If 95% of task is checklist + 5% expert judgment, table may contain only 1-2 rows

## For Multi-Agent Orchestration Systems

The Cognitive Demands Table directly translates to agent orchestration architecture:

**Each row becomes a skill/capability that some agent must provide**:
```
CognitiveSkill: "DetermineCollapseRisk"
Difficulty: ["VisualCuesSubtle", "RequiresCausalModel", "TimeConstrained"]
Inputs: ["BuildingAge", "FireDuration", "VisibleDamage", "AuditorySignals"]
CommonErrors: ["OverrelyOnVisualOnly", "IgnoreAuditoryCues", "MissDeadspaceSignificance"]
ExpertStrategies: ["IntegrateMultipleCueSources", "MentallySimulateStructuralPhysics", "CompareToTypicalVsAtypical"]
RequiredAgentCapabilities: ["PatternRecognition", "CausalReasoning", "UncertaintyHandling"]
```

**"Why Difficult" column suggests where agent assistance is most valuable**:
- "Novices don't know X" → Provide knowledge augmentation
- "Hard to notice Y" → Provide perceptual highlighting
- "Requires tracking Z simultaneously" → Provide memory/attention support

**"Common Errors" column defines safety checks**:
- Before executing high-stakes actions, verify not falling into known error patterns
- "You're about to start at explosion source. Are you sure this isn't the chemical explosion case?"

**"Cues and Strategies" column defines required context**:
- What information must be available for this cognitive skill to work?
- What computation must be performed to make cues accessible?

The table becomes both a requirements document (what capabilities the system needs) and an architecture diagram (how capabilities relate to tasks).
```

### FILE: expertise-as-pattern-recognition-not-procedure.md

```markdown
# Expertise as Pattern Recognition, Not Procedure: Implications for Agent Design

## The Fundamental Insight

Traditional task analysis treats expertise as refined procedure—experts do the same things as novices but faster, more accurately, with fewer errors. ACTA research reveals this is wrong for complex cognitive tasks. Experts don't execute better procedures; they *see different problems*.

A fireground commander arrives at a scene and immediately knows "This is a commercial building with lightweight construction, fire has been burning 20+ minutes, high collapse risk." A novice sees a building with smoke. Same observable situation, radically different perception of what's happening.

This has profound implications for AI systems. If you model expertise as improved execution of known procedures, you build better automation. If you model expertise as different problem recognition, you build different intelligence.

## What Pattern Recognition Expertise Looks Like

**Perceiving Typicality** - Experts rapidly classify situations into categories that evoke appropriate responses. This isn't conscious deliberate categorization—it's perceptual. An electronic warfare supervisor hears a radar signal and immediately knows "That's an SA-6, probably land-based given the bearing and signal characteristics, non-threat currently but would be if we close to within 40 miles."

The expert isn't running through a decision tree. The signal pattern triggers recognition, which activates associated knowledge: threat capability, typical employment, range constraints, tactical implications.

**Seeing Distinctions** - Within a category, experts notice fine distinctions that matter functionally. Two building fires may both be "commercial structure fires," but the expert notices: "This one has a bowstring truss roof, that one has traditional framing." Bowstring truss collapse is rapid and catastrophic when heated; traditional framing provides more warning time. Identical surface appearance, critical functional distinction.

**Noticing Anomalies** - Experts detect when something expected is absent or something unexpected is present. An electronic warfare supervisor notices a radar is NOT detected in an area where intelligence reports indicated presence—potentially valuable information about enemy behavior. A novice would notice what's present but not what's missing.

**Mental Simulation** - Experts "see" how the current situation arose (story building about the past) and how it will evolve (mental simulation of futures). The fireground commander reconstructs: "Fire started in the storage area about 30 minutes ago based on the char patterns, spread through the common attic space, now in the office areas." And projects: "In about 10 minutes the roof will become unstable, need to evacuate crews before that."

This isn't procedure. It's pattern-based inference about temporal dynamics.

## Why This Matters for Agent Systems

### Current Approach: Procedure Optimization

Most AI systems model tasks as procedures to be executed:

```
if (condition_1):
    action_A()
elif (condition_2):
    action_B()
else:
    action_C()
```

Even sophisticated machine learning often learns "given features X, Y, Z, the optimal action is A" as a complex function approximation.

This works when:
- The feature representation is given
- The action space is known
- The problem type is stable

This fails when experts are doing something fundamentally different: recognizing what kind of problem this is, which determines what features matter and what actions are even relevant.

### Pattern Recognition Approach: Situation Classification

Expert cognition looks more like:

```
recognized_pattern = perceive_situation_type(observations)
relevant_cues = pattern.salient_features()
expected_evolution = pattern.typical_trajectory()
anomalies = detect_deviations(observations, pattern.expectations())
action_options = pattern.appropriate_responses()
selected_action = evaluate_options_in_context(action_options, anomalies, expected_evolution)
```

The work is in perceiving what kind of situation this is, which then constrains everything else.

### Implications for Agent Architecture

**Multi-Stage Reasoning Pipelines**:

1. **Situation Assessment Agent**: Classifies the problem type based on pattern recognition
   - Trained on expert categorizations: "This is a Type-X problem because..."
   - Outputs situation type + confidence + key features that led to classification

2. **Knowledge Retrieval Agent**: Given situation type, retrieves relevant knowledge
   - What typically happens in Type-X problems?
   - What cues indicate subtypes or variations?
   - What are common errors in Type-X?

3. **Action Planning Agent**: Given situation type and knowledge, generates options
   - What strategies apply to Type-X?
   - How do the specific anomalies present modify typical approach?

4. **Evaluation Agent**: Mentally simulates candidate actions
   - If we do A, what's the expected evolution?
   - What could go wrong?
   - How does this compare to doing B instead?

This pipeline mirrors expert cognition revealed through ACTA interviews: recognize the situation, apply situation-appropriate knowledge, generate and evaluate options within that context.

### Training Pattern Recognition vs. Training Procedures

**Traditional approach**: 
- Training data: (state, action) pairs
- Loss: How different is agent action from expert action?
- Result: Agent learns to mimic expert actions

**Pattern recognition approach**:
- Training data: (situation description, expert classification, key features, expected evolution, potential pitfalls)
- Loss: How different is agent situation understanding from expert understanding?
- Result: Agent learns to see situations like experts

The insight: You can execute the "right action" in response to a situation you've misunderstood and still fail. Getting the situation recognition right is primary.

## The Recognition-Primed Decision Model

Klein's research (cited throughout ACTA materials) shows experts frequently use single-option decision making: they recognize the situation, which activates an appropriate response, they mentally simulate whether that response will work, and if yes, they execute it. If the mental simulation reveals problems, they modify the action or retrieve another pattern.

This is NOT:
- Generate all possible actions
- Evaluate each one systematically
- Select optimal

This IS:
- Recognize situation type
- Retrieve typical response
- Check if it'll work here
- Modify if needed

For agent systems, this suggests:

**Case-Based Reasoning Architecture**:
- Library of situation patterns (cases)
- Similarity matching to recognize current situation
- Retrieval of prototypical response from matched case
- Adaptation of response to current specifics
- Simulation/verification before execution

**When to Use Multiple-Option Evaluation**:
- When pattern recognition fails (no good match)
- When prototypical response simulation reveals serious problems
- When stakes are high enough to warrant systematic evaluation

Default mode: pattern-recognition + single-option evaluation  
Fallback mode: systematic multi-option comparison  
This matches expert behavior.

## Perceptual Chunks and Abstraction Layers

Experts perceive "meaningful chunks" rather than individual features. A novice firefighter sees: "smoke color, smoke volume, smoke movement, building age, building type, weather conditions..." as separate features to track.

An expert sees: "This building presentation" as a single perceptual unit that immediately suggests collapse risk, victim location likelihood, and appropriate tactics.

For agent systems:

**Raw Feature Layer**:
```
{smoke_color: "dark_gray", 
 smoke_volume: "moderate",
 building_age: "1970s",
 construction_type: "commercial",
 roof_type: "flat",
 fire_duration: "25min"}
```

**Expert Perceptual Layer**:
```
{situation_type: "commercial_prolonged_concealed",
 key_pattern: "long_burn_modern_construction",
 primary_concern: "collapse_risk_elevated",
 implied_constraints: ["evacuate_before_structural_failure", "defensive_tactics_likely"]}
```

The expert layer is not just aggregation of features—it's recognition of meaningful configuration that carries semantic freight (what this means, what it implies, what to be concerned about, what strategies apply).

Training agents to build this perceptual layer is different from training feature extractors. It requires:
- Expert-labeled exemplars of situation types
- Explanations of what makes Type-X different from Type-Y
- Consequences of misclassification (what goes wrong if you think it's X but it's Y)
- Boundary cases where classification is ambiguous

## Anomaly Detection as Signal

Standard ML: anomaly detection identifies outliers to be filtered or flagged as errors.

Expert cognition: anomalies are information. Something expected that didn't happen tells you something. Something unexpected that did happen tells you something.

The electronic warfare supervisor who notices a radar isn't detected where intel suggested it would be—this absence is valuable intelligence about enemy behavior or intel accuracy.

The fireground commander who hears silence when there should be ventilation fan noise—this tells them something has changed (equipment failure, communication breakdown, crew encountered problem).

For agent systems, this requires:

**Expectation Generation**:
- Based on recognized situation type, generate expectations about what should happen
- "If this is Type-X situation, we expect to see cues A, B, C"

**Deviation Monitoring**:
- Track what's actually observed against expectations
- Deviations are not noise—they're signals about situation understanding

**Belief Updating**:
- When expectations violated, update situation classification
- "I thought this was Type-X, but cue A is absent, so maybe it's actually Type-Y"
- Or: "This is Type-X but with complication Z, which means strategy needs modification"

## Boundary Conditions

**When Pattern Recognition Models Work**:

1. **Domain stability** - Patterns learned from past experience apply to future situations
2. **Rich training data** - Enough exemplars to learn meaningful situation categories
3. **Expert consensus** - Experts agree on situation classifications (even if they choose different actions)

**When They Break Down**:

1. **Novel situations** - When the current situation doesn't match any learned pattern, pattern recognition provides no leverage. System needs fallback to first-principles reasoning.

2. **Adversarial environments** - When the environment is actively trying to make its patterns unrecognizable (deceptive enemy tactics, adversarial examples in ML). Requires meta-level reasoning about pattern reliability.

3. **Rapidly changing domains** - When patterns from 6 months ago no longer apply (technology shift, regulatory change). Requires continuous learning and pattern library updating.

4. **Individual variation** - When different experts categorize situations differently based on training, background, or philosophy. No single "correct" pattern library exists.

## For Multi-Agent Orchestration

In systems where multiple specialized agents collaborate:

**Pattern Recognition as Coordination Mechanism**:

- **Situation Assessment Agent** classifies problem type and broadcasts classification
- Other agents subscribe to situation types they handle
- "This is a Type-X problem" routes work to agents specialized in Type-X
- Avoids brittle explicit routing rules—routing emerges from situation recognition

**Shared Situation Awareness**:

- Multiple agents must maintain compatible situation understanding
- If Agent A thinks "this is Type-X" and Agent B thinks "this is Type-Y," coordination fails
- Requires:
  - Shared situation classification vocabulary
  - Communication of key features that led to classification
  - Negotiation when agents disagree about situation type

**Hierarchical Pattern Recognition**:

- High-level agent recognizes coarse situation type: "This is a software debugging problem"
- Routes to debugging-specialized agents
- Those agents do finer pattern recognition: "This is a memory corruption issue"
- Routes to memory-specialized sub-agents
- Continues recursively until reaching agents that know relevant procedures

This mirrors how expert teams work: initial triage determines which specialists are needed, specialists do finer-grained assessment, work gets routed to appropriate skills.

The ACTA framework reveals expertise as pattern recognition. Agent systems that treat expertise as refined procedure will fail to capture how experts actually think. Systems that can recognize situations, retrieve pattern-based knowledge, and reason within recognized contexts will more closely approximate expert cognition.
```

### FILE: when-streamlined-methods-suffice.md

```markdown
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
```

### FILE: failure-modes-in-knowledge-elicitation.md

```markdown
# Failure Modes in Knowledge Elicitation: What This Book Teaches About Going Wrong

## The Nature of Elicitation Failures

Knowledge elicitation fails in predictable ways. ACTA's development and evaluation revealed systematic failure modes that agent systems face when attempting to learn from experts, extract knowledge from documentation, or construct reasoning from examples.

## Surface-Level Capture: Mistaking Procedure for Cognition

**The Failure Mode**: Interviewer asks expert "How do you diagnose network failures?" Expert responds "I check the logs, then I test connectivity, then I examine configuration." Interviewer records this as complete description of expertise.

**What's Missing**: The procedural description omits all cognitive work:
- How does the expert know WHICH log entries matter? (pattern recognition)
- What does "test connectivity" mean when tests give ambiguous results? (interpretation)
- What makes expert examine configuration versus hardware versus software? (situation assessment)

The evaluation study found novice interviewers often captured behavioral descriptions that were accurate but superficial. Even when trying to get cognitive information, without understanding what cognition looks like, they accepted procedural descriptions.

**For Agent Systems**: 

This is exactly how many agent capabilities are currently specified: "Agent will retrieve relevant documents, extract key information, and formulate response." But:
- How does agent determine document relevance? (What patterns indicate relevance?)
- What makes information "key"? (What distinguishes signal from noise?)
- What makes a response well-formulated? (What structure and content define quality?)

Without explicit attention to the cognitive dimensions, agent specifications describe behavior without capturing the intelligence that makes behavior effective.

**The ACTA Counter**: Knowledge Audit probes force attention to cognitive dimensions explicitly:
- "What do you notice that others might miss?" (perceptual skills)
- "How do you know something's wrong?" (anomaly detection)  
- "What makes this hard for novices?" (surfaces the tacit knowledge)

For agent design: Specifications must include not just "what the agent does" but "how the agent determines what to do"—the pattern recognition, situation assessment, and judgment processes.

## Expert Articulation Failure: The Curse of Automaticity

**The Failure Mode**: Experts perform skills so automatically that they cannot articulate them. Asked "How do you know the building is about to collapse?", expert responds "I just know" or "Years of experience."

**What's Happening**: Expert cognition has become proceduralized—the perceptual cues that trigger assessment happen below conscious awareness. The expert genuinely doesn't know how they know.

**The ACTA Counter**: 

Simulation Interview works around this by presenting a scenario and asking "What are you noticing HERE?" Rather than asking for abstract articulation of skill, the concrete situation triggers the automatic processes, which the expert can then report.

"What made you think the building might collapse in this scenario?"  
"I noticed the roofline sagging, heard those creaking sounds, and this type of construction typically fails suddenly after 20 minutes."

The specific context makes tacit cues reportable.

**For Agent Systems**:

When learning from expert demonstrations (imitation learning, inverse reinforcement learning), the same problem exists: expert behavior is observable, but the perceptual cues and assessments driving behavior are hidden.

Solution parallels ACTA: Don't just observe behavior, query about specific situations:
- What were you noticing at THIS moment?
- What made you choose THIS action rather than THAT one?
- What would have changed your mind?

This transforms passive observation into active interrogation of situated reasoning.

## Novice Perspective Bias: Asking the Wrong Questions

**The Failure Mode**: Interviewer asks questions that make sense from novice perspective but miss expert concerns.

Example: Interviewer asks firefighter "What's the first thing you do when you arrive?" Expert responds "Size up the situation." Interviewer asks "How long does that take?" Expert: "Maybe 30 seconds." Interviewer records: "Step 1: Size up situation (30 seconds)."

**What's Wrong**: The interviewer is thinking procedurally (what are the steps? how long do they take?). The expert is thinking cognitively (what information do I need to integrate? what patterns am I recognizing?).

Questions about duration and sequence miss the cognitive work of the size-up.

**The ACTA Counter**: Knowledge Audit categories are derived from expertise research, not task structure. This forces interviewer to ask about:
- Mental simulation (past and future)
- Situation awareness (big picture)
- Pattern recognition (noticing)

These categories reflect how experts actually think, not how task procedure is organized.

**For Agent Systems**:

When designing agent capabilities, starting from "what are the steps?" leads to procedural agents that can execute predefined sequences but not handle novel variations.

Starting from "what patterns must be recognized?" and "what judgments must be made?" leads to agents with cognitive capabilities that can be composed flexibly.

The architecture question isn't "what's the workflow?" but "what types of reasoning are required?" (pattern matching, causal inference, planning under uncertainty, etc.)

## Accepting Abstract Generalization: Missing the Concrete

**The Failure Mode**: Expert says "You need good situation awareness" or "Experience teaches you what to look for." Interviewer records this as a finding.

**What's Missing**: Abstract statements don't contain transferable knowledge. A novice reading "you need good situation awareness" gains nothing actionable.

**The ACTA Counter**: Force concreteness through examples:
- "Can you tell me about a specific time when your situation awareness made a difference?"
- "What specific things were you aware of in that situation?"
- "What would someone with poor situation awareness have missed?"

The example grounds the abstraction in observables that can be taught.

**For Agent Systems**:

When extracting knowledge from documents or experts, abstract statements are common: "The system should be robust" or "The agent should consider context."

These are placeholders, not specifications. System design requires operationalizing:
- What specific inputs constitute "context"?
- What specific behaviors demonstrate "robustness"?
- What specific failures should be prevented?

Agent development must push past abstraction to concrete: Given this input, what specifically should happen? When this type of situation occurs, what specifically should be considered?

## The Disagreement Problem: Treating Conflict as Noise

**The Failure Mode**: Three experts give different answers to the same question. Analyst averages them, picks the most common answer, or throws out "outliers."

**What's Really Happening**: 

Experts may disagree legitimately because:
- They have experience in different subdomains (different ship types, different building types)
- They use different strategies that are equally valid
- They emphasize different aspects based on what went wrong in their experience
- They're at different expertise levels (journeyman vs. master)

Treating this as noise loses valuable information.

**The ACTA Solution**: Cognitive Demands Table makes disagreement explicit. Rather than hiding it:

```
Cues and Strategies:
- Expert A: "Check logs chronologically"
- Expert B: "Sample logs at key intervals"  
- Expert C: "Start with most recent and work backward"
```

This shows alternative valid approaches rather than forcing false consensus.

**For Agent Systems**:

When learning from multiple experts or multiple demonstration datasets, disagreement is often treated as noise to be averaged out. This loses the information that:
- Multiple valid strategies exist
- Strategy selection depends on context
- Experts adapt approach based on situation specifics

Better approach: 
- Learn multiple strategies
- Learn meta-reasoning about when each applies
- Allow agent to switch strategies based on situation assessment

Multi-agent systems naturally fit this: different agents using different strategies, with meta-agent deciding which to invoke for current situation.

## Confusing Correlation with Understanding: The Surface Pattern Problem

**The Failure Mode**: System learns "when X occurs, do Y" from examples, without understanding WHY that works.

Classic example: Medical diagnosis system learned that patients with pneumonia should be sent home if they have asthma (because training data showed asthma patients had better outcomes). Reality: asthma patients went directly to ICU, received aggressive treatment, and thus had better outcomes. The system learned a spurious correlation and would have killed patients by sending them home.

**The ACTA Protection**: "Why Difficult" and "Common Errors" columns surface the causal reasoning:

```
Difficult Element: Determining collapse risk
Why Difficult: Visual cues are subtle; requires understanding how fire degrades structural members
Common Errors: Novices focus only on visible damage, missing the time-temperature relationship
Cues and Strategies: Integrate building age, construction type, fire duration, and current conditions
```

This makes explicit that the judgment isn't "if condition X then collapse risk high" but rather "understanding how fire affects this type of structure over this duration."

**For Agent Systems**:

Current ML systems excel at finding correlations but struggle with causal understanding. When agents must explain decisions or handle situations where correlations break down (distribution shift, adversarial input, novel contexts), correlation-based learning fails.

ACTA's emphasis on "why difficult" and expert reasoning process points toward:
- Extracting causal models from expert explanations
- Training agents on reasoning traces, not just input-output pairs
- Building agents that can articulate why a strategy works, not just that it works

For agent orchestration: A meta-agent deciding "should I route this to Agent A or Agent B?" needs to understand WHY each agent's approach works, so it can assess which applies to the current situation.

## The Interviewer Variability Problem: Method Reliability

**The Failure Mode**: Two interviewers talking to the same expert produce different results because they probe differently, interpret responses differently, or focus on different aspects.

**The ACTA Approach**: 

The evaluation study explicitly tested whether different interviewers using ACTA would generate similar information. Findings:

- All ACTA users identified the same major cognitive demand categories (situation analysis, information collection, planning)
- Specific examples varied (different stories from different experts)
- But types of cues, nature of difficulty, classes of errors were consistent

The structure provided by Knowledge Audit categories and Cognitive Demands Table format created sufficient standardization while allowing flexibility.

**For Agent Systems**:

When multiple developers build agent capabilities, consistency is critical:
- Different agents handling similar tasks should use compatible abstractions
- Coordination between agents requires shared vocabulary
- Meta-reasoning about agent capabilities requires comparable specifications

ACTA suggests: Provide structured framework for capability specification (analogous to Knowledge Audit categories) while allowing domain-specific instantiation (analogous to specific examples being different).

For instance: All "anomaly detection" capabilities might be specified with:
- What constitutes "normal" in this domain
- What patterns signal deviations  
- What false positives to avoid
- What false negatives are dangerous

This structure ensures different developers specify capabilities comparably, enabling integration.

## The Time Pressure Problem: Premature Conclusion

**The Failure Mode**: Constrained time leads analyst to stop after one or two interviews, drawing conclusions from insufficient data.

**What's Missed**: 

- First expert may emphasize idiosyncratic aspects
- Early patterns may not replicate with additional experts
- Boundary conditions only emerge across multiple cases
- Alternative strategies surface only when you see multiple approaches

**The ACTA Guidance**: Conduct 3-5 expert interviews before drawing training/design conclusions. The Cognitive Demands Table consolidation explicitly assumes multiple interviews.

**For Agent Systems**:

When extracting knowledge for agent capabilities, the temptation is to move from one good example to implementation:
- Read one thorough documentation
- Observe one expert demonstration
- Analyze one dataset

This creates brittle agents that:
- Don't handle variation
- Miss edge cases
- Apply strategies beyond their valid context

The discipline: Multiple examples BEFORE implementation. The variation across examples reveals:
- What's essential vs. incidental
- What strategies are robust vs. context-specific
- What assumptions underlie the approach

For orchestration: Don't build routing logic from single examples of "how this expert decomposed this problem." Sample across multiple experts and multiple problems to find patterns in decomposition.

## Lessons for Agent Orchestration Systems

**Failure Mode Recognition in Agent Systems**:

The failure modes in human knowledge elicitation have direct parallels in agent learning and specification:

1. **Surface-level capture** → Specifying agent behavior without specifying intelligence
   - Mitigation: Force explicit specification of pattern recognition, situation assessment, judgment processes

2. **Automaticity curse** → Learning from expert behavior without access to expert reasoning
   - Mitigation: Query-based learning, not just observation; "why this action?" probing

3. **Novice perspective bias** → Architecting agents around procedural flow instead of cognitive demands
   - Mitigation: Start from "what types of reasoning required?" not "what's the sequence?"

4. **Abstract placeholders** → Requirements like "agent should be robust" without operationalization
   - Mitigation: Push every abstraction to concrete: "robust against WHAT? measured HOW?"

5. **Disagreement as noise** → Averaging multiple strategies instead of preserving alternatives
   - Mitigation: Multi-strategy agents with meta-reasoning about strategy selection

6. **Spurious correlation** → Learning "when X do Y" without understanding why
   - Mitigation: Require explanations; test generalization; seek causal models

7. **Interviewer variability** → Different developers creating incompatible agent specs
   - Mitigation: Structured frameworks for capability specification

8. **Premature conclusion** → Building from single example
   - Mitigation: Require multiple cases before implementation

These aren't just human problems—they're fundamental challenges in extracting and encoding expertise. Agent systems face them just as much as human interviewers do. The methodological discipline ACTA imposed on human knowledge elicitation applies equally to agent development.
```

---

## SKILL ENRICHMENT

**Task Decomposition Skills**: ACTA's Task Diagram provides a principled approach to identifying which aspects of a task require sophisticated reasoning vs. can be handled procedurally. This directly improves how architects break complex work into agent-assignable chunks. The insight that decomposition should follow *cognitive demand* boundaries rather than just procedural steps transforms decomposition from "what are the phases?" to "where is judgment required?"

**Requirements Elicitation for AI Systems**: The Knowledge Audit framework offers a structured approach to extracting requirements for intelligent capabilities. Product managers and AI leads can use the six expertise dimensions to probe stakeholders: "Tell me about a time when pattern recognition was critical" surfaces different requirements than "What should the system do?" The three-column structure (example, why difficult, cues/strategies) translates directly to: use cases, edge cases, and implementation guidance.

**Code Review for Agent Systems**: Reviewers can apply ACTA-derived questions: Does this agent merely execute procedure or does it perform cognitive work? If cognitive, what patterns must it recognize? What situation assessment does it perform? What common errors does it prevent? Code that can't answer these questions is likely procedural automation masquerading as intelligence. The framework helps distinguish "this works on examples" from "this captures the expertise."

**Debugging Intelligent Systems**: When agents fail, ACTA provides diagnostic categories: Is this a pattern recognition failure (missed critical cues)? Situation assessment failure (wrong problem type classification)? Strategy selection failure (right assessment, wrong approach)? Error prevention failure (fell into known novice mistake)? This structured debugging reveals whether failure is in perception, reasoning, or execution.

**Training Material Development for AI Systems**: The Cognitive Demands Table structure directly generates training data requirements. Each row specifies: cognitive capability needed (difficult element), what makes it hard (why difficult), what the system should avoid (common errors), and what it should attend to (cues/strategies). This creates explicit specifications for what training examples must demonstrate.

**Architecture Design**: The distinction between expertise as procedure vs. expertise as pattern recognition fundamentally reshapes architecture. Systems built around recognition-primed decision making look different from systems built around procedural execution: they require situation classification layers, case-based retrieval, mental simulation capabilities. ACTA reveals when these architectural patterns are appropriate.

**Human-AI Collaboration Design**: The "Equipment Difficulties" probe (when experts override automation) and the self-monitoring dimension (when experts notice their own performance degrading) directly inform how to design AI systems that humans will trust and effectively collaborate with. Interfaces should surface information that supports expert skepticism rather than demanding blind trust. Systems should make their confidence and limitations explicit.

**Security Auditing**: The "Scenario from Hell" probe and "Common Errors" column identify attack surfaces: What situations would stress the system maximally? What mistakes do novice implementations make that adversaries could exploit? This provides structured approach to threat modeling for intelligent systems: enumerate the cognitive demands, identify failure modes for each, consider adversarial manipulation of those failure modes.

**Testing Strategy**: ACTA's simulation interview approach suggests testing architecture: Don't just test on random inputs; test on scenarios that stress specific cognitive capabilities. Generate test cases organized around: pattern recognition challenges (subtle cues), situation assessment challenges (ambiguous situations), strategy selection challenges (multiple valid approaches), error prevention (situations where novice approach would fail).

**Knowledge Base Construction**: The Cognitive Demands Table structure provides schema for organizing extracted expertise. Rather than unstructured documentation, organize around: tasks requiring expertise, what makes each difficult, common failures, expert strategies. This creates queryable knowledge bases where agents can retrieve relevant expertise based on problem characteristics.

**Prompt Engineering**: For LLM-based agents, the ACTA framework suggests prompt structures: "You are an expert who recognizes [pattern type]. In this situation, you notice [critical cues]. A novice would [common error]. Instead, you [expert strategy]." This embeds expertise dimensions into the prompt rather than hoping the model recovers them from training data.

**Multi-Agent Coordination Protocols**: The "Big Picture" expertise dimension (tracking multiple interrelated factors) suggests coordination requirements: What shared situation awareness must agents maintain? What handoff information is critical? When must agents synchronize their assessments? The framework reveals coordination needs by making explicit what experts track simultaneously.

---

## CROSS-DOMAIN CONNECTIONS

**Agent Orchestration**: The core insight that expertise is pattern recognition fundamentally changes orchestration architecture. Instead of "if problem type X, route to agent Y," orchestration becomes: "Classify situation type (pattern recognition), retrieve relevant strategies for that type, select appropriate agent(s) based on strategy requirements." The orchestrator itself needs cognitive capabilities (situation assessment, pattern recognition) not just routing logic. ACTA provides the framework for specifying what patterns the orchestrator must recognize and what information enables recognition.

**Task Decomposition**: Traditional decomposition follows procedural boundaries (authentication, then authorization, then processing). ACTA reveals decomposition should follow cognitive demand boundaries: which elements require expertise? What types of expertise (pattern recognition vs. causal reasoning vs. planning)? Decompose based on skill requirements, not procedure steps. A task requiring situation assessment + mental simulation + error checking might be decomposed into agents specialized in each cognitive capability, rather than agents specialized in procedural phases.

**Failure Prevention**: The "Common Errors" column directly enumerates failure modes, but more importantly, the "Why Difficult" column explains why failures occur. This enables proactive prevention: if novices fail because they "don't know what's typical," build systems that establish baselines. If they fail because they "focus on one element and miss the big picture," build systems that enforce multi-factor consideration. The framework converts observed failures into preventive architecture.

**Expert Decision-Making**: ACTA embodies recognition-primed decision making: recognize situation type → retrieve appropriate response → mentally simulate to verify → execute or adapt. This maps to agent architecture: situation classification → strategy retrieval → simulation/evaluation → action. The finding that experts use single-option evaluation (not exhaustive multi-option comparison) suggests agents should similarly default to pattern-based response with verification, escalating to exhaustive search only when pattern matching fails.

**Learning from Demonstration**: When agents learn from expert demonstrations, ACTA framework indicates what to extract: not just state-action pairs, but situation classifications, critical cues attended to, alternative strategies considered, errors avoided. This transforms imitation learning from "mimic expert actions" to "learn expert perception and judgment." The knowledge representation (Cognitive Demands Table) suggests features for representing demonstrations: what made this situation difficult? what cues mattered? what would have gone wrong?

**Explainable AI**: The three-column structure (example, why difficult, cues/strategies) provides explanation template: "I did X because [situation assessment]. I based this on [critical cues]. A common mistake would be Y because [novice gap]." This is how experts explain decisions to learners. Systems that can populate this template provide explanations that humans find natural and trustworthy.

**Robustness and Adaptation**: The perceptual expertise dimension (noticing subtle cues) and anomaly detection dimension (recognizing deviations) are critical for robust systems. An agent that only knows nominal cases can't handle distribution shift. An agent that recognizes "this looks like situation type X but has unusual characteristics" can adapt. The self-monitoring expertise dimension (noticing when performance is degrading) suggests agents need introspective capabilities: monitor confidence, recognize when reasoning is uncertain, adjust strategies when initial approach isn't working.

**Human-AI Teaming**: The finding that experts don't blindly trust equipment and the "Equipment Difficulties" probe reveal requirements for effective teaming: AI systems must make their reasoning transparent enough that human experts can spot when the AI is wrong. Interfaces should surface the cues the AI is using and the situation type it believes applies, allowing human override based on nuances the AI missed. Partnership requires epistemological humility—the system knows it doesn't know everything.

**Continuous Learning**: ACTA's emphasis on multiple experts revealing multiple valid strategies suggests agent learning shouldn't converge to single "optimal" policy. Maintain multiple strategies with meta-reasoning about applicability. When new situations reveal failures, don't just patch—conduct post-incident "cognitive task analysis" to understand what expertise was missing. The evaluation cycle mirrors agent improvement: deploy with ACTA-derived knowledge, monitor failures, conduct targeted knowledge extraction around failures, update capabilities, redeploy.