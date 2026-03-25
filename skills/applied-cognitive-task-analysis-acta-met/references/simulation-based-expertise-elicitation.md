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