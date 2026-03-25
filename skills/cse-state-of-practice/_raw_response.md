## BOOK IDENTITY

**Title**: "The State of Cognitive Systems Engineering" (and associated corpus of cognitive systems engineering literature, ~2002 IEEE Intelligent Systems)
**Author**: Robert R. Hoffman, Gary Klein, K. Ronald Laughery (with references to the broader cognitive systems engineering research community including Woods, Vicente, Rasmussen, Hutchins, Suchman, and others)
**Core Question**: How do real experts actually think and decide in complex, uncertain, dynamic domains — and how should we build systems that support rather than fight human cognition?
**Irreplaceable Contribution**: This work sits at the exact intersection of cognitive science, human factors engineering, and AI design. It is irreplaceable because it refuses to model expertise as rule-following or information-processing in the abstract — instead it insists that genuine expertise is *situated*, *context-sensitive*, and *knowledge-driven in ways that resist decomposition into linear task sequences*. The literature this paper represents (Rasmussen, Klein, Woods, Vicente, Hutchins) collectively discovered that the gap between prescribed behavior and actual expert behavior is not noise to be filtered out — it IS the signal. What experts do when things go wrong, when systems fail, when context shifts unexpectedly — that is where real intelligence lives. No other body of work makes this case as rigorously, with such deep empirical grounding in real operational settings (aircraft cockpits, fire ground command, weather forecasting, nuclear power operations).

---

## KEY IDEAS (3-5 sentences each)

1. **The Invariant Task Sequence Fallacy**: Designers routinely decompose work into linear, prescribed sequences of steps, and then build systems that enforce those sequences. But real expert performance is not sequential — it is *context-sensitive, knowledge-driven selection among alternative paths to a goal*. When systems are built on the invariant sequence model, they become fragile the moment reality diverges from the designer's assumed scenario. The forecaster who loses the uplink to weather radar does not stop forecasting — knowledge creates alternative paths. Agent systems that plan as fixed pipelines will break exactly as these systems broke.

2. **Expertise as Pattern Recognition and Situation Assessment, Not Rule Application**: Klein's research on Naturalistic Decision Making showed that experienced decision-makers in time-pressured, high-stakes environments rarely generate options and compare them — instead they *recognize* situations as belonging to known types, simulate the first plausible action mentally, and act if the simulation succeeds. This is Recognition-Primed Decision (RPD). The implication for agent systems is profound: the right architecture for fast, competent decisions under uncertainty is not deliberative search — it is rich situational representation that enables rapid pattern matching followed by lightweight simulation.

3. **The Human-Centered Inversion**: Most technology development adapts humans to machines. Human-centered computing demands the inversion: machines should adapt to humans, amplifying cognitive strengths and compensating for cognitive limits. The parallel for agent systems is that the orchestration layer should adapt to the nature of the problem and the capabilities of available agents — not force problems into the shapes that the orchestration layer finds convenient. The system serves the task; the task does not serve the system.

4. **Cognitive Work Is Not What It Appears**: Surface observation of expert behavior systematically misleads. What looks like a simple linear action sequence is often a rich, knowledge-laden selection process operating beneath the surface. This means that behavioral decomposition of tasks — watching what experts do and encoding it — will miss the most important parts of expertise: the decisions not taken, the cues recognized, the situations reclassified before action. For agent systems, this implies that skill design cannot be based purely on input-output behavioral specification — the internal reasoning structure matters.

5. **The Gap Between Knowing and Doing Runs Both Ways**: It is well-known that people know things they cannot do (procedural vs. declarative knowledge gaps). Less recognized is the complementary gap: people *do* things they cannot articulate — tacit expertise that resists elicitation. Knowledge elicitation is therefore a specialized, methodologically demanding discipline, not a matter of simply asking experts to describe their work. For agent systems, this means that any attempt to encode expertise must use structured elicitation methods (Critical Decision Method, cognitive task analysis) rather than self-report or behavioral observation alone.

---

## REFERENCE DOCUMENTS

### FILE: invariant-task-fallacy-and-agent-pipelines.md
```markdown
# The Invariant Task Sequence Fallacy: Why Fixed Pipelines Fail Complex Work

## The Core Problem

One of the most dangerous and persistent mistakes in system design is also one of the most intuitive: decomposing complex work into a fixed, linear sequence of steps and then building a system that enforces that sequence. This approach — variously called "task analysis," "workflow design," or "process engineering" — has a history stretching back to the psychotechnics research of the late 1800s. It is seductive because it makes complexity legible. If you can write down the steps, you feel like you understand the work.

Cognitive systems engineering research accumulated across decades of fieldwork in aviation, nuclear power operations, firefighting, weather forecasting, military command, and medical care shows that this intuition is systematically and dangerously wrong.

The error is not that tasks are a bad concept. Tasks — as expressions of goals — are legitimate and useful. The error is treating the sequences observed in task performance as *invariant*: as if the same sequence of steps, executed in the same order, will always be the appropriate path to the goal. As Hoffman, Klein, and Laughery (2002) put it: "When regularly occurring sequences are regarded as invariant and therefore predefined, systems designed on this basis can run a substantial risk of being flawed. Specifically, you can expect them to lead to fragilities, hostilities, and automation surprises."

This is not a theoretical concern. Systems built on the invariant task model fail in predictable ways:

- **Fragility under novel conditions**: When the assumed context breaks down, the system has no resources to adapt. It was built for the assumed scenario, not for the real world's variability.
- **Hostility to practitioners**: Experts who understand the domain better than the system's designers are forced to fight the system to do their work correctly. They develop workarounds and local kludges that the system neither supports nor understands.
- **Automation surprises**: The system behaves unexpectedly when practitioners, accustomed to one mode, encounter a situation where the system's fixed logic produces an outcome they did not anticipate.

## What Experts Actually Do

The key insight from decades of cognitive field research is that expert performance is not sequential execution of prescribed steps — it is **context-sensitive, knowledge-driven selection among alternative paths to a goal**.

Hoffman and colleagues illustrate this with the weather forecaster: "Would loss of the uplink to the weather radar keep a forecaster from crafting a forecast? No, the forecaster can work around it because knowledge permits the creation of alternative paths to the goal."

This is not the exception — it is the norm. Expert performance in complex domains is characterized by:

1. **Continuous situation assessment**: Before acting, experts are constantly reading cues, assessing the current state of the world, and classifying the situation into a type that their experience has equipped them to handle.

2. **Goal-directed flexibility**: The goal is fixed; the path is negotiable. Experts maintain the goal under varying conditions by selecting from a repertoire of approaches, not by following a single prescribed route.

3. **Opportunistic action**: Experts exploit unexpected openings. If an opportunity arises that was not in the "plan," experts take it because they understand why the plan exists, not merely what the plan says.

4. **Graceful degradation**: When resources are lost, communication is disrupted, or conditions change dramatically, experts improvise using their understanding of the underlying domain — not their memory of the prescribed procedure.

Jens Rasmussen's foundational taxonomy (Skills, Rules, and Knowledge, 1983) identifies three levels of human performance:
- **Skill-based**: Highly practiced, automated sensorimotor behavior
- **Rule-based**: Familiar situations handled by recognized rules ("if this situation, then that response")
- **Knowledge-based**: Novel situations requiring deliberate reasoning from first principles

The critical insight is that real complex work moves *fluidly among all three levels*. A fixed linear task sequence assumes that all work is rule-based at best — it provides no support for knowledge-based reasoning when rules fail, and it actively interferes with skill-based performance by inserting unnecessary cognitive load.

## The Agent System Translation

For AI agent orchestration systems, the invariant task sequence fallacy manifests in the assumption that a complex problem can be solved by a fixed pipeline of agent invocations: Agent A → Agent B → Agent C → result. This works for well-understood, stable problems. It fails — in exactly the ways described above — when:

- **The problem is novel**: The standard pipeline was not designed for this specific combination of requirements.
- **A step fails or produces unexpected output**: Fixed pipelines have no mechanism for replanning.
- **Earlier steps generate information that changes the nature of later steps**: Sequential pipelines cannot backtrack or re-route based on mid-process discoveries.
- **The best path depends on context that wasn't known at planning time**: Fixed pipelines commit to a path before this information is available.

### What to Build Instead

The alternative is not chaos — it is **goal-driven flexible orchestration** backed by rich situational representation. Specifically:

**1. Separate goals from methods.** The orchestration layer should maintain explicit representations of *what is to be achieved*, not merely *what steps to execute*. When a step fails or produces unexpected results, the system can ask "given the current state, what alternative methods still serve the goal?" rather than halting with an error.

**2. Build in explicit situation assessment.** Before routing a task to an agent, the orchestration layer should have a mechanism for classifying the current situation: What type of problem is this? What conditions hold? What resources are available? This classification drives method selection, not the other way around.

**3. Design for replanning.** Complex tasks should be planned *incrementally*, with explicit checkpoints where the system re-evaluates whether the current plan still serves the goal given what has been learned so far. This is analogous to how expert forecasters continually update their situational model as new data arrives.

**4. Maintain alternative paths.** For any significant goal, the orchestration layer should know at least one alternative approach that can be invoked if the primary approach fails. This is not redundancy — it is the basic architecture of robust goal-directed behavior.

**5. Distinguish prescribed from adaptive behavior.** Some tasks genuinely are invariant sequences (certain verification procedures, certain formatting operations). Others are not. The system should know which is which, and apply fixed pipelines only where they are genuinely appropriate.

## When This Principle Applies Most Forcefully

The invariant task fallacy is most dangerous when:
- The problem domain is novel or variable
- Failure of one step genuinely changes the nature of the remaining work
- External context (data, user state, environmental conditions) changes during execution
- The "right" approach depends on information not available at planning time

It applies less forcefully when:
- The task is genuinely routine and well-understood
- The environment is stable and controlled
- Failure of any step is grounds for halting (rather than adapting)
- The cost of a wrong adaptation exceeds the cost of halting

## The Design Principle

**Do not build systems that know what to do. Build systems that know why — so they can figure out what to do when circumstances change.**

The what is brittle. The why is robust. A system that encodes "step 3 is always to call the summarization agent" will fail when step 2 produces output that doesn't need summarization. A system that encodes "the goal of this phase is to produce a compressed representation of the key findings suitable for downstream reasoning" can recognize when that goal is already met and skip the step, or when it needs a different kind of compression than summarization provides.

This is exactly what expertise is: knowing enough about *why* the standard procedure works that you can adapt it when conditions change. Building that understanding into agent systems is not a luxury — it is the difference between a system that works in demonstrations and a system that works in deployment.
```

### FILE: recognition-primed-decision-making-for-agents.md
```markdown
# Recognition-Primed Decision Making: How Experts Decide Fast and What It Means for Agent Design

## The Problem With Rational Choice Models

Classical decision theory — and much early AI — assumed that good decision-making follows a recognizable structure: enumerate options, evaluate each against criteria, select the best. This model is clean, tractable, and wrong in most real-world conditions.

Gary Klein's decades of fieldwork — with firefighters, military commanders, intensive care nurses, chess grandmasters, and many other expert practitioners — revealed a fundamentally different pattern. Published through the Naturalistic Decision Making (NDM) research program (Zsambok & Klein, 1997), this work shows that experienced decision-makers in time-pressured, high-stakes, dynamic environments rarely generate and compare options. Instead, they *recognize*.

Klein's Recognition-Primed Decision (RPD) model describes how this actually works:

1. **Situation recognition**: The expert reads the available cues and rapidly classifies the situation as belonging to a known type — a "this is one of those" moment. This classification activates a bundle of associated knowledge: what the situation typically involves, what goals are relevant, what actions have worked before, what outcomes to expect.

2. **Course of action generation**: Rather than generating multiple options to compare, the expert's recognition of the situation type makes a *single* course of action salient. This is not random — the action is the one that experience has associated with this situation type.

3. **Mental simulation**: Before acting, the expert runs a quick mental simulation: "If I do this, what happens?" This simulation is not exhaustive analysis — it is a rapid forward projection that checks whether the action will work given the specific details of the current situation.

4. **Action or revision**: If the simulation succeeds, the expert acts. If the simulation reveals a problem ("if I do X, that will cause Y which will make things worse"), the expert modifies the action and re-simulates. If no modification fixes the problem, the expert revisits the situation assessment — maybe this isn't the type of situation they thought it was.

The critical point is that comparison of options is *not the primary mechanism*. Options are generated one at a time, evaluated for adequacy (not optimality), and accepted or rejected. The cognitive work is in the recognition and simulation, not in the comparison.

## Why This Matters: Speed, Uncertainty, and Adequacy

The RPD model is not a description of lazy or careless thinking — it is a description of *efficient expertise*. Consider the constraints under which real decisions must often be made:

- **Time pressure**: A fire commander deciding whether to evacuate a burning building has seconds, not hours.
- **Uncertainty**: Information is incomplete, ambiguous, or actively misleading.
- **Dynamic conditions**: The situation is changing while the decision is being made.
- **High stakes**: Wrong decisions have serious consequences.

Under these conditions, exhaustive option comparison is not just impractical — it is counterproductive. By the time you have generated and evaluated all options, the situation has changed, and your analysis is stale. The expert's recognition-based approach is calibrated to the actual demands of the environment: fast, good-enough decisions that can be revised as new information arrives.

This connects to a deeper principle: **satisficing over optimizing**. Herbert Simon recognized decades ago that real intelligent agents do not optimize — they satisfice. They find a solution that is good enough given their goals and constraints, and they act on it. The RPD model shows exactly *how* experts satisfice: by recognizing situation types that come with pre-validated, experience-tested response patterns.

## The Knowledge Underneath Recognition

Recognition is not magic — it is the output of *compiled experience*. What distinguishes the expert from the novice is not superior reasoning capacity but a richer, more densely structured library of situation types and associated responses.

Klein's research found that expert firefighters and other practitioners build this library through extended experience with varied cases, particularly cases where outcomes were surprising or where initial assessments proved wrong. The most educationally potent experiences are not the routine cases — they are the "near-miss" cases where something unexpected happened and the practitioner had to revise their situation model.

This has a direct implication: the structure of expert knowledge is not propositional rules ("if X then do Y") but *cases with associated patterns of cues, goals, expectations, and actions*. The knowledge is organized around situations, not around abstract decision criteria.

Hutchins (1995) in *Cognition in the Wild* extends this by showing that much of this situational knowledge is not in individual heads — it is distributed across tools, artifacts, practices, and the social organization of the workplace. Expert performance is therefore often *distributed cognition*, not just individual cognition.

## Translating RPD to Agent System Design

The RPD model has several specific, actionable implications for how AI agent systems should handle decisions under uncertainty.

### 1. Invest in Situation Classification Before Action Selection

The RPD model says that the most critical cognitive step is not "what should I do?" but "what kind of situation is this?" Agent systems should have explicit mechanisms for situation assessment before routing to action-taking agents. This might look like:

- A **classifier agent** that reads the current context, the task description, available resources, and prior outputs, and labels the situation with a type or category
- A **context representation** that accumulates relevant cues as the task progresses
- A **situation history** that tracks how the situation has evolved, enabling pattern matching against past cases

Without explicit situation classification, agents jump to action based on surface features of the task specification — which is the novice pattern, not the expert pattern.

### 2. Implement Mental Simulation Before Commitment

Before committing to a significant action (calling an expensive API, making an irreversible change, generating output that will be used by downstream agents), an agent or the orchestration layer should perform a lightweight forward simulation: "If I do X, what is the likely state of the system afterward? Does that state serve the goal?"

This is not full planning — it is the expert's "quick mental check." It catches obvious mismatches between the proposed action and the actual situation without the overhead of exhaustive planning.

Concretely, this might look like a prompt to a reasoning agent: "Given the current task state [description], I am about to [action]. Walk through what happens next if I take this action. Does the outcome serve the goal [goal description]? If not, what should I do differently?"

### 3. Generate One Good Option, Not All Options

Agent systems that are asked to "consider all possible approaches" often produce unfocused, hedged output. The RPD model suggests an alternative: generate the *first plausible approach* based on situation recognition, simulate it, and refine. If the first approach fails simulation, generate the next plausible approach.

This is more efficient and often produces better results than asking for an exhaustive menu of options, because it forces the system to commit to a specific plan and test it, rather than producing vague generalizations about what might work.

### 4. Design for Revision, Not Just Decision

A key feature of RPD is that decision-making is not a one-shot event — it is a continuous process of assessment, action, feedback, and reassessment. Agent systems should be designed with this cycle in mind:

- Actions should produce *observable outputs* that allow the system to assess whether the situation has evolved as expected
- The system should have explicit mechanisms for detecting when actual outcomes diverge from simulated expectations
- When divergence is detected, the system should return to situation assessment, not simply retry the failed action

This is a loop, not a pipeline. The difference matters enormously.

### 5. Build Libraries of Situation Types

The expert's recognition ability depends on a rich library of cases. Agent systems can develop analogous resources:

- **Example repositories**: Solved cases with annotated situation types, actions taken, and outcomes
- **Pattern libraries**: Descriptions of recognizable situation types with associated successful approaches
- **Anti-pattern libraries**: Cases where a plausible-seeming approach failed, and why

These resources, retrievable at decision time, give the agent system the functional equivalent of the expert's compiled experience.

## Boundary Conditions: When RPD Doesn't Apply

The RPD model is not universal. It describes expert behavior in specific conditions:

- **When the practitioner has genuine expertise**: Novices do not recognize situation types reliably because they lack the experiential library. An agent system with limited training on a domain cannot use recognition-primed methods effectively — it will recognize the wrong type or fail to recognize the situation at all.

- **When the situation type is genuinely familiar**: RPD fails when the situation is truly novel — when it doesn't match any known type. In these cases, knowledge-based reasoning from first principles is required, and the RPD model correctly identifies this as a different mode.

- **When stakes are high enough to justify exhaustive analysis**: For decisions with catastrophic irreversible consequences, the time investment in thorough option comparison may be warranted even when it is slow.

- **When multiple stakeholders have different goals**: RPD assumes a single coherent goal structure. When different parties want different things, the recognition-based approach may prematurely close off options that serve legitimate competing interests.

## The Deeper Lesson

What the RPD model ultimately teaches is that **intelligence in complex domains is not primarily about reasoning power — it is about recognition and simulation ability**. The expert and the novice may have similar raw cognitive capacity. What differs is the richness of the expert's situational library and the quality of their forward simulation.

For agent systems, this means: investing in richer context representations, better situation classification, and lightweight forward simulation will improve decision quality more than investing in more exhaustive search or larger reasoning budgets. The bottleneck is not computational power — it is situational knowledge and the mechanisms for applying it rapidly.

Build agents that recognize before they reason, and simulate before they commit.
```

### FILE: the-knowledge-elicitation-problem.md
```markdown
# The Knowledge Elicitation Problem: Why Experts Can't Just Tell You What They Know

## The Fundamental Difficulty

There is a pervasive and costly assumption embedded in many attempts to build intelligent systems: that domain expertise can be captured by asking experts to describe what they do and encoding their answers. This assumption underlies early expert systems development, many training program designs, and most workflow documentation efforts.

The cognitive systems engineering research community, through decades of careful fieldwork, has demonstrated that this assumption is wrong in a way that is both subtle and consequential. The problem is not that experts are uncooperative or inarticulate. The problem is structural: **a significant portion of expert knowledge is tacit — it is enacted in practice but cannot be directly retrieved through introspection and self-report**.

Hoffman, Crandall, and Shadbolt (1998) document this in detail in their analysis of knowledge elicitation methodology. The core finding: when you ask experts to describe their decision-making process, they produce accounts that are systematically incomplete — not because they are withholding, but because they genuinely do not have introspective access to the most important parts of their own expertise.

What experts cannot easily report includes:
- The specific cues they attend to that trigger recognition of a situation type
- The expectations they form automatically upon situation recognition (and therefore what surprises them)
- The micro-adjustments they make in real-time during skilled performance
- The alternatives they implicitly ruled out before settling on their approach
- The "feel" of a situation that something is wrong before any specific anomaly is identifiable

What they *can* report — and will readily produce when asked — are the explicit, articulable aspects of their knowledge: the rules they consciously follow, the procedures they were trained in, the general principles they can state. These are real and useful, but they are not the most powerful parts of expertise.

## The Two Gaps

Understanding the knowledge elicitation problem requires distinguishing two related but different gaps:

**Gap 1: Knowing-Doing (Declarative-Procedural)**
People know things they cannot do. You can read every book on bicycle riding and still fall off when you first mount a bicycle. Declarative knowledge ("the bike tips left, lean right") does not automatically translate to procedural competence. This gap is widely recognized.

**Gap 2: Doing-Saying (Tacit-Explicit)**
People do things they cannot fully articulate. The expert bicycle rider cannot provide complete instructions that would allow a novice to ride — not because riding is mysterious, but because the relevant knowledge is encoded in motor programs and perceptual calibrations that are below the level of conscious access. This gap is less widely appreciated, and it is at least as important.

The second gap is what makes naive knowledge elicitation fail. When you ask the expert fire commander "how did you decide to evacuate that building?", you get an account of the decision that was constructed after the fact, filtered through the expert's theories about their own decision-making, and inevitably incomplete with respect to the cue recognition and tacit assessment that actually drove the decision. The account is not fabricated — it is the expert's honest attempt at introspection. But introspection is a lossy channel for capturing tacit knowledge.

## What Works: Methods That Circumvent Introspective Limits

The critical insight from cognitive task analysis research is that you can often elicit tacit knowledge *indirectly* — not by asking experts to describe their knowledge, but by constructing situations that *force the knowledge to manifest* in ways that can be observed and analyzed.

Hoffman and colleagues developed and analyzed a range of such methods. Among the most powerful:

**The Critical Decision Method (CDM)**: Instead of asking experts to describe their general approach, you ask them to recall specific challenging cases — incidents where something was difficult, unexpected, or where things could easily have gone wrong. Then you probe that specific case with structured questions: "What were you seeing at that point? What were you thinking about? What did you expect to happen next? Why did you do X rather than Y? Was there a moment when you knew it was going to be okay?" The specific incident serves as a scaffold that gives the expert's tacit knowledge something to attach to. The CDM reliably elicits more specific, cue-level knowledge than general "tell me how you do your job" interviews.

**Think-Aloud Protocols**: Having experts perform their actual work while simultaneously verbalizing their thinking. This captures real-time reasoning in a way that retrospective accounts cannot. The limitation is that verbalization itself disrupts performance for highly skilled, automated processes — the expert who thinks aloud while doing something highly skilled often performs worse, because the verbalization interferes with the automatic processes being studied.

**Structured Observation with Probing**: Observing expert performance and noting specific moments to probe later: "I noticed that at minute 3:47 you paused and looked at the upper left of the display before continuing. What were you looking at? What were you thinking?" This focuses the retrospective account on specific moments where tacit knowledge was likely operating.

**Comparative Case Analysis**: Presenting experts with pairs of cases that differ in one key feature and asking them to articulate the difference in their response. The comparison forces explication of distinctions that would remain implicit in single-case description.

**Simulation-Based Probing**: Presenting experts with simulated scenarios and asking not "what would you do?" but "what's wrong with this picture?" — exploiting the expert's automatic anomaly detection to surface the expectations and patterns they use without being able to directly report them.

## Implications for Agent Systems

### Skill Design Cannot Be Based on Self-Report

If you are building a specialized agent capability (a "skill") by encoding expert knowledge, you cannot rely solely on what experts say they do. You need methods that surface what they actually do — and the gap between these two is often where the most valuable knowledge lives.

This means:
- **Analyze cases, not principles**: Encode knowledge from specific solved problems, including the cues that triggered different approaches and the expectations that were confirmed or violated
- **Include anomaly cases**: The cases where something seemed wrong before it was identifiable, or where the expert reversed course midway, contain more tacit knowledge than the smoothly executed routine cases
- **Document non-decisions**: What did the expert consider and reject? The implicitly ruled-out options reveal the situational distinctions the expert makes but cannot easily articulate

### The Context Window Is Not Enough

A common assumption in LLM-based agent design is that providing the model with sufficient context ("here is the task, here is the relevant documentation, here are examples") will produce expert-level performance. The knowledge elicitation literature suggests this is insufficient.

The most powerful expert knowledge is not in the documentation — it was never written down because it couldn't be easily articulated. It lives in the patterns of cases, in the anomalies, in the "feel" of situations that something is off. To the extent that language models can capture this knowledge, it is because they were trained on *behavior traces* (code that was actually written, text that was actually produced) not on *descriptions of how to produce the behavior*.

This means that agent systems should prefer **few-shot examples drawn from actual expert performance** over **verbal descriptions of expert knowledge** as the primary mechanism for transmitting expertise.

### Build in Uncertainty About Own Knowledge

Expert systems and agent systems alike tend to project confidence that their outputs are correct. The knowledge elicitation literature warns that the most dangerous errors often occur at the boundary of tacit and explicit knowledge — where the system confidently applies a rule to a situation that the rule was not designed for, because the tacit knowledge that would flag the mismatch has not been encoded.

Agent systems should therefore have explicit mechanisms for:
- Flagging when a situation has features not well-covered by training cases
- Distinguishing between "I can produce an answer" and "I have reliable knowledge for this type of problem"
- Seeking confirmation from other agents or from humans when tacit-knowledge-dependent judgments are required

### Knowledge Preservation Is a Specialized Function

Hoffman and colleagues (1998) note that knowledge elicitation and preservation is itself a skilled activity, not simply a matter of documentation. Organizations routinely lose critical knowledge when experienced practitioners retire, because the tacit knowledge that made them effective was never systematically captured.

For agent systems, this implies that maintaining and improving skill representations is an ongoing, methodologically demanding process — not a one-time engineering task. There should be explicit feedback mechanisms that capture cases where agent performance was surprisingly good or surprisingly poor, and processes for analyzing those cases to update the underlying skill representations.

## Boundary Conditions

The tacit knowledge problem is most severe for:
- Skills that are highly practiced and automated
- Perceptual and diagnostic skills (pattern recognition from sensory data)
- Skills developed through experience with unusual cases rather than formal training
- Skills in domains where the vocabulary for describing fine distinctions is underdeveloped

It is less severe for:
- Knowledge that was originally taught through explicit instruction and remains consciously accessible
- Procedural knowledge for genuinely routine, invariant tasks
- Mathematical and logical reasoning, where the steps can be fully articulated
- Knowledge of principles rather than knowledge of specific situational patterns

The implication is not that all knowledge is tacit — it is that knowledge elicitation must use multiple methods, calibrated to the type of knowledge being sought, and must include methods that bypass introspective limits for the tacit portions.

## The Organizational Dimension

Hutchins (1995) adds a dimension that individual-focused knowledge elicitation often misses: much expert knowledge is *distributed across the social and material system*, not stored in any individual head. The knowledge of how to navigate a ship safely is not in any one navigator's head — it is distributed across the crew, the instruments, the charts, the communication protocols, and the physical arrangement of the bridge. When any of these components is changed (new instruments, crew rotation, updated charts), the system's effective knowledge changes in ways that cannot be captured by interviewing any individual.

For agent systems working in coordination, this means: the expertise of the multi-agent system as a whole may exceed or differ from the expertise of any individual agent, and characterizing the system's knowledge requires analyzing the *coordination patterns* and *shared representations*, not just the individual agent capabilities. This is a frontier that most current agent system design has not yet adequately addressed.
```

### FILE: automation-surprises-and-coordination-failure.md
```markdown
# Automation Surprises and Coordination Failure: When Human-Machine Systems Fracture

## The Automation Paradox

When automated systems are introduced to support human operators in complex domains, the explicit goal is to reduce error and cognitive load. The empirical finding, documented across aviation, nuclear power, process control, and medical care, is more complicated: automation can simultaneously make routine operations more reliable and make rare, high-stakes failures *more* catastrophic and surprising.

This paradox — thoroughly documented by Sarter, Woods, and Billings in their landmark analysis of "automation surprises" — arises from a structural feature of human-automation coordination that most system designers do not anticipate.

## What an Automation Surprise Is

An automation surprise occurs when an automated system does something that the human operator did not expect, could not predict, or does not understand. The human is working with a model of what the automation is doing and why — and that model is wrong in ways that become apparent only at a critical moment, typically when things are already going wrong.

Automation surprises are not bugs. The automation is usually doing exactly what it was designed to do. The problem is that the design was made without adequately considering how the human's understanding of the automation would evolve in practice — and specifically, how that understanding would fail in unusual situations.

Common failure patterns:

**Mode confusion**: Complex automation systems have multiple operational modes. The automation transitions between modes in response to conditions that the human may not have noticed. The human believes the system is in mode A and acts accordingly; the system is actually in mode B. The consequences can be severe. Multiple aircraft accidents have been attributed to mode confusion, where pilots believed the autopilot was maintaining altitude when it had actually transitioned to a different control mode.

**Transparency failure**: The automation takes actions without providing comprehensible explanations. The human knows *that* the system did something but not *why*. This prevents the human from assessing whether the action was appropriate or anticipating what will happen next.

**Authority gradient problems**: Modern automation systems often have significant authority — they can take consequential actions without human permission. When the system acts autonomously, the human's situational awareness degrades because they are no longer tracking what the system is doing. When manual intervention is suddenly required, the human has lost the thread.

**Clumsy automation**: The automation is designed to reduce workload in normal operations, but the way it does so increases workload (and error risk) in abnormal operations. The workload "saved" in routine situations is recovered with interest during emergencies.

## The Coordination Problem

Behind the automation surprise phenomenon lies a deeper problem: the *coordination* between the human operator and the automated system is fragile because the two parties have different, and often incompatible, representations of what is happening and what each is responsible for.

Hutchins (1995) frames this as a problem of *distributed cognition*: effective performance in complex systems requires that the relevant knowledge, goals, and situational awareness be appropriately distributed across the system's components. When one component (the automation) takes action based on its representation while the other component (the human) maintains a different representation, the system's distributed cognition has fractured. Effective coordination requires *shared* representations — a common understanding of the current state, the relevant goals, and who is responsible for what.

This connects to Rasmussen's analysis of how operators build and maintain "situation awareness" — the continuously updated mental model of the system's current state. Automation surprises occur when the operator's mental model diverges from the system's actual state without the operator knowing that divergence has occurred. This is not operator error in any simple sense — it is a predictable consequence of designing automation that acts without maintaining transparency about its state and intentions.

## The Joint Cognitive System View

The insight that cognitive systems engineering brings — and that separates it from simpler human factors approaches — is that the *system* is not just the machine. The system is the **joint cognitive system** comprising both the human operators and the automated components, working together to accomplish the mission.

This reframing has radical implications. When something goes wrong, the question is not "did the human fail?" or "did the machine fail?" — it is "how did the joint system fail?" And the answer is almost always: the failure was in the *coordination architecture* between the components, not in any single component.

This means:
- Designing the automated component without designing the coordination with the human is *always incomplete design*
- Evaluating automation performance without evaluating how it affects the human operator's situational awareness and decision-making is *always incomplete evaluation*
- Attributing accidents to "human error" while ignoring the automation design that created the conditions for that error is *always an incomplete analysis*

## The Agent System Translation

For AI agent orchestration systems, the automation surprise phenomenon is a direct and immediate concern. Multi-agent systems face all the same coordination problems that human-automation systems face — and in some ways more acute versions.

### The Mode Confusion Problem in Multi-Agent Systems

Agent systems with multiple operational modes — different planning strategies, different resource allocation policies, different error recovery approaches — can create coordination failures analogous to cockpit mode confusion.

An orchestrating agent may believe that a subordinate agent is operating in one mode (e.g., "conservative, fact-checked response generation") when the subordinate has actually shifted to a different mode (e.g., "fast generation without verification") due to latency constraints. The orchestrator routes work based on the expected mode; the actual behavior is different.

**Design response**: Make mode transitions explicit and observable. Any time an agent changes its operational mode (due to resource constraints, timeout thresholds, error conditions, or explicit instruction), this transition should be broadcast to coordinating agents with a clear description of what changed and what the implications are for the work in progress.

### The Transparency Problem in Agent Chains

When agent A produces output that is passed to agent B, agent B is typically unaware of *how* agent A produced that output — what sources it consulted, what uncertainties it had, what alternatives it considered and rejected. Agent B treats the output as a black-box input and proceeds.

This is precisely the transparency failure that creates automation surprises. Agent B's processing is based on a representation (agent A's output) that may have important properties — uncertainties, limitations, embedded assumptions — that are invisible to it.

**Design response**: Implement *transparency protocols* where agents accompany their outputs with metadata about how the output was produced, what its limitations are, and what downstream agents should be aware of. This is analogous to the "context passing" that experienced human teams do: "I'm handing this off to you; here's what I know, here's what I'm uncertain about, here's what I'd watch for."

### The Authority Gradient Problem in Agentic Systems

As agent systems become more capable of autonomous action, the question of authority becomes critical. An agent that can take consequential actions (send emails, modify databases, make purchases, execute code) has significant authority. If that authority is exercised without adequate coordination with the orchestrating system and ultimately with human oversight, the conditions for automation surprise are in place.

**Design response**: Implement explicit authority hierarchies with *legible checkpoints* — moments where the system pauses and makes its intended action transparent to the appropriate level of oversight before executing. The checkpoint should provide enough context that the oversight agent (or human) can genuinely assess the appropriateness of the action, not just rubber-stamp it.

### Situational Awareness in Multi-Agent Systems

The most important lesson from the automation surprise literature for agent systems: **every agent in a coordinating system needs an accurate model of what other agents are doing, what they are responsible for, and what mode they are in**. Without this, coordination is brittle and surprises are inevitable.

This is not just a matter of passing state information. It requires that agents actively maintain *models of other agents* — not just their outputs, but their current operational mode, their confidence level, their resource constraints, and any anomalous conditions they have detected.

An agent system that has no mechanism for agents to maintain models of their collaborators is one that has not adequately addressed the coordination problem. It will produce automation surprises.

## Designing Against Automation Surprise

The practical design principles that emerge from this literature:

1. **Make system state legible at all times**: Any agent that needs to coordinate with another should be able to query the current state of the coordination: what is each agent doing, what mode is each agent in, what has each agent produced, and what is each agent planning to do next.

2. **Require explanation with action**: Any significant action taken by an autonomous agent should be accompanied by an explanation of why the action was taken, what the expected outcome is, and what the agent will do if the outcome is not as expected.

3. **Design for graceful degradation**: When coordination fails — when an agent goes offline, produces unexpected output, or transitions to an unexpected mode — the remaining system should degrade gracefully rather than catastrophically. This requires designing the coordination protocols to be robust to individual component failures.

4. **Create appropriate authority structures**: Not every agent needs the same authority. Establishing explicit authority hierarchies, with clear escalation protocols for consequential actions, prevents the authority gradient failures that produce the worst automation surprises.

5. **Treat coordination design as primary, not secondary**: The interfaces *between* agents, the communication protocols, the shared state representations, and the handoff procedures are as important as the capabilities of any individual agent. Designing these as an afterthought guarantees coordination failure under stress.

## The Deepest Warning

Woods and Hollnagel (1987) articulate the ultimate warning: automation does not remove cognitive demands from the system — it *transforms and relocates* them. When you automate a task, the cognitive work that was being done by the human operator during that task does not disappear. It is either encoded in the automation's design (and therefore frozen in its assumptions), relocated to a different time or mode (requiring the operator to think about it differently), or lost (creating a latent vulnerability that will surface in unexpected conditions).

For agent systems: automating a coordination function does not eliminate the coordination challenge. It transforms it. If you automate the routing of tasks between agents, you have not solved the routing problem — you have encoded a solution to the routing problem as you understood it at design time, and created a system that will route incorrectly (without knowing it is routing incorrectly) whenever the real situation differs from your design assumptions. Understanding this is the beginning of designing systems that can be trusted.
```

### FILE: human-centered-inversion-for-agent-design.md
```markdown
# The Human-Centered Inversion: Building Systems That Serve Intelligence Rather Than Constrain It

## The Central Principle

The defining thesis of cognitive systems engineering is deceptively simple: machines should adapt to people, not the other way around. Hoffman, Klein, and Laughery (2002) state it directly: "Machines should adapt to people, not the other way around. Machines should empower people. The process of designing machines should leverage what we know about human cognitive, perceptual, and collaborative skills."

This is called the *human-centered inversion* — a deliberate reversal of the default design logic in which the system's constraints define what humans must do. The failure mode the inversion addresses is equally simply stated: "the road to user-hostile systems is paved with designers' user-centered intentions. Even smart, clever, well-intentioned people can build fragile, hostile devices that force the human to adapt and build local kludges and workarounds. Worse still, even if you are aware of this trap, you will still fall into it."

That last clause is the important one. This is not a problem solved by good intentions or even by awareness. It requires structural safeguards in the design process itself.

## Why Good Intentions Fail

How do well-intentioned designers build user-hostile systems? The cognitive systems engineering literature provides a detailed account.

**Designer-centered task analysis**: When designers analyze the work to be supported, they typically do so by observing or interviewing practitioners and then encoding what they see as a sequence of steps. The problem, as discussed throughout this literature, is that what designers observe is the *surface behavior* of experts — not the underlying knowledge, reasoning, and flexibility that makes that behavior effective. The system built to support the observed behavior supports only the surface — and when the expert needs to deviate from the observed pattern (which is often), the system actively blocks deviation.

**Feature-centered rather than goal-centered design**: Designers naturally think in terms of features — capabilities the system provides. But practitioners think in terms of goals — what they are trying to accomplish. Features that make perfect sense from a capability perspective can be deeply hostile from a goal perspective if they require practitioners to reorganize their work around the system's logic rather than the system supporting the practitioner's goal-directed activity.

**Optimization for demonstration, not deployment**: Systems are typically designed and evaluated in conditions that differ substantially from actual deployment — cleaner data, simpler scenarios, more time, less concurrent pressure. Features that work well in demonstration conditions may be deeply problematic under actual deployment conditions. Cognitive overload, brittle error handling, and awkward coordination patterns that are invisible in demos become catastrophic in operation.

**The expert blind spot**: As designers become more expert in the system they are building, they lose the ability to see the system as a novice or practitioner would see it. Features that are obvious to the designer (who knows why they are there and how they work) are mysterious or confusing to the practitioner (who just needs to accomplish a goal). This expert blind spot is universal and cannot be overcome by effort alone — it requires structured user research.

## What Human-Centered Actually Means

The cognitive systems engineering research community, particularly through Vicente's (1999) Cognitive Work Analysis framework, developed a substantive account of what "human-centered" means in practice. It is not merely "friendly" or "easy to use" — it is a specific set of design properties.

**Representational fit**: The information presented by the system should match the cognitive representations that practitioners actually use in their work. If experts think in terms of trends and relationships rather than absolute values, the display should show trends and relationships. If experts think in terms of system states rather than individual parameter values, the display should show system states. Mismatches between system representation and expert representation require constant cognitive translation — and cognitive translation is both slow and error-prone.

**Goal alignment**: The system's operations should be organized around practitioners' goals, not around the system's internal structure. If practitioners pursue goal A by taking actions in the sequence [1, 3, 7, 2], the system should support that sequence — even if the system's internal logic would prefer [1, 2, 3, 7]. The practitioner knows why they sequence actions as they do; the system designer usually does not.

**Support for knowledge-based reasoning**: Human-centered systems support practitioners not just in routine operation (where rules and skills suffice) but in novel situations that require knowledge-based reasoning from first principles. This means providing access to underlying system models and domain knowledge, not just interface widgets for common operations. When the unexpected happens, practitioners need to reason — and systems that only support scripted behavior will actively obstruct reasoning.

**Leverage of human strengths**: Humans are extraordinarily capable at certain things: pattern recognition in complex visual scenes, contextual judgment, ethical reasoning, creative problem-solving, and social coordination. Human-centered systems amplify these strengths rather than replacing them with inferior automated versions. The automated system does what automation does well; the human does what humans do well.

**Compensation for human limits**: Humans are reliably bad at certain things: maintaining vigilance over long periods, tracking large numbers of state variables simultaneously, performing arithmetic accurately under time pressure, and retrieving arbitrary items from memory. Human-centered systems compensate for these limits through appropriate automation and memory aids, reducing the demand on human cognitive capacity in areas where humans are inherently weak.

## The Inversion Applied to Agent Systems

The human-centered inversion translates directly to the design of AI agent systems, but with a crucial extension: in agent systems, the "users" of a system component include not just humans but also other agents. An agent that forces other agents to adapt to its constraints rather than adapting to their goals is *agent-hostile*, and will produce exactly the same failure modes that user-hostile systems produce.

### Every Agent Has Users

When designing a skill or specialized agent capability, the question "who uses this?" should be answered carefully. The users include:
- Human operators who may invoke the capability directly
- Orchestrating agents that route tasks to the capability
- Downstream agents that consume the capability's output

Each of these user types has different cognitive characteristics, different goal structures, and different representations of what they need. A capability designed only for one user type will often be hostile to the others.

**Example**: A data retrieval skill designed for direct human use might provide rich, formatted output with explanatory context — appropriate for human reading. But when invoked by an orchestrating agent that needs to parse the output and pass specific fields to a downstream agent, that rich formatting may be an obstacle. The orchestrating agent must translate — which is slow, error-prone, and represents exactly the human-centered failure mode applied to agents.

Design solution: capabilities should be able to modulate their output format based on the nature of the requester. Human-facing output prioritizes readability; agent-facing output prioritizes parseability and explicit structure.

### The Orchestration Layer Must Serve the Task, Not Vice Versa

The orchestration architecture — the system that routes tasks, allocates resources, and coordinates agents — should be designed to serve the *task's structure*, not to force tasks into the orchestration system's preferred structure.

If a complex task has a natural structure that involves iterative refinement with feedback loops, the orchestration should support iterative refinement with feedback loops — not force the task into a linear pipeline because pipelines are easier to manage. The Hoffman et al. warning applies directly: "systems designed on this basis can run a substantial risk of being flawed. Specifically, you can expect them to lead to fragilities, hostilities."

The pipeline-based orchestration system is the agent system equivalent of the user-hostile interface: it is designed for the convenience of the system builder, not for the requirements of the work.

### Transparency as Human-Centering

A specific dimension of human-centered design that is critical for agent systems: the system should be comprehensible to the humans who use and oversee it. This is not merely an aesthetic preference — it is a safety requirement.

When an agent system takes actions that are not comprehensible to human overseers, those overseers cannot effectively assess whether the actions are appropriate, cannot intervene when necessary, and cannot learn from the system's behavior to improve future oversight. The system becomes a black box, and black boxes are user-hostile in the deepest sense: they prevent the collaboration between human judgment and automated capability that is the goal of human-centered computing.

Transparency requirements for agent systems:
- The system's current state (what each agent is doing) should be visible to human overseers
- The system's reasoning (why it chose a particular approach) should be available on demand
- The system's uncertainty (where it is confident, where it is not) should be explicit
- The system's authority scope (what it can do autonomously, what requires human approval) should be clear and enforced

### Designing for the Expert Practitioner, Not the Average User

A subtle but important point from the cognitive systems engineering literature: human-centered design is not the same as lowest-common-denominator design. Systems designed for the average user are often hostile to expert practitioners who need to work quickly, use domain-specific vocabulary, and access advanced capabilities.

The human-centered approach recognizes that the appropriate design target depends on the user population and the nature of the work. For high-stakes complex work, the design should support expert performance — even if that means the system is harder to learn for novices, because the expert's capabilities are what the system must amplify to accomplish the mission.

For agent systems, this means: don't design skills and capabilities only for the orchestrating agent's convenience. Design them for the demands of the actual complex problems the system will face. An agent capability that is easy to invoke for simple cases but fails or degrades gracefully for complex cases is not human-centered — it is average-case-centered, which in high-stakes domains often means it fails exactly when it matters most.

## The Kludge Problem and Technical Debt

One of the most instructive observations in the cognitive systems engineering literature is the kludge phenomenon: when systems are user-hostile, practitioners do not stop working — they build workarounds. The forecaster whose system doesn't support a needed analysis builds a spreadsheet alongside the system. The pilot who finds the automation confusing develops personal strategies for managing it. The call center agent who finds the CRM hostile copies key information to a notepad.

These workarounds are not failures — they are demonstrations of the fundamental human cognitive capacity for adaptive goal-directed behavior. But they come with serious costs:
- The workarounds are invisible to the system, so the system cannot help with them
- The workarounds are often fragile and idiosyncratic — they work for the person who developed them but not reliably for others
- The workarounds create a hidden parallel "system" that is undocumented, unsupported, and prone to failure
- The burden of maintaining the workarounds falls on the practitioners who can least afford the extra cognitive load

For agent systems, the kludge problem manifests when agents develop implicit conventions to work around hostile interfaces — conventions that are not documented, not enforced, and not robust. When those conventions fail, the failure is often invisible until a critical moment. The design lesson: make the hostile interface the thing that is fixed, not the thing that practitioners adapt around.

## The Road Map

What does it take to actually build human-centered systems — or in the agent context, intelligence-centered systems?

Hoffman and colleagues identify several prerequisites:

1. **Deep understanding of the actual work**: Not the prescribed work, the actual work — including the workarounds, the local adaptations, the knowledge-based reasoning under unusual conditions. This requires cognitive field research, not just requirements gathering.

2. **Models of expert knowledge and reasoning**: Not just "what do users want?" but "how do experts think?" — what representations do they use, what cues do they attend to, what reasoning processes do they employ? These models should drive the design.

3. **Zero tolerance for user-hostile outcomes**: Hoffman et al. are explicit about this. Discovering that a design is hostile is not a reason to accept it with a note in the documentation. It is a reason to redesign. The organizational culture must support this standard.

4. **Refusal to accept short-term thinking**: Human-centered design takes more time and investment upfront than system-centered design. The savings come later — in reduced training costs, reduced error rates, reduced workaround maintenance, and better performance under stress. Organizations that optimize for short-term development costs will systematically underinvest in human-centered design and systematically overpay for the consequences.

The translation for agent systems is direct: understanding the actual demands of complex tasks (not just the specified requirements), modeling how expert reasoning approaches those demands, maintaining zero tolerance for agent-hostile interfaces, and making the investment in proper coordination design — even when it is easier to build a fragile pipeline and document its limitations.

The road to agent-hostile systems is paved with good intentions and short-term thinking. The road to effective intelligent systems runs through genuine understanding of the work and genuine commitment to serving it.
```

### FILE: expertise-acquisition-stages-for-agent-capability-design.md
```markdown
# Stages of Expertise Acquisition: What They Mean for Agent Capability Design

## The Expertise Spectrum

One of the most important contributions of the cognitive systems engineering research community is a detailed, empirically grounded account of how expertise develops — and what distinguishes different levels of proficiency. This account, synthesized from research by Chi, Glaser, and Farr (1988), Ericsson and Smith (1991), Hoffman (1992), and Shanteau (1992), among others, has profound implications for how AI agent systems should be designed, evaluated, and deployed.

The central finding: expertise is not a binary property (expert vs. non-expert) but a continuous dimension with qualitatively different performance characteristics at each stage. The progression from novice to expert involves not just accumulation of more knowledge but fundamental reorganization of how knowledge is structured and applied.

## The Stages of Proficiency

The classic model (drawing on Dreyfus and Dreyfus, and developed through cognitive research) identifies five stages, though the boundaries are continuous rather than sharp:

**Novice**: Performance is governed by explicit rules applied to explicit features. The novice learns "if you see X, do Y" and applies these rules literally, without contextual interpretation. Performance is slow, requires conscious attention, and is brittle in the face of novel conditions. The novice needs rules because they lack the situational knowledge to exercise judgment.

**Advanced Beginner**: Performance remains rule-governed but rules become more sophisticated, incorporating aspects of situational context. The advanced beginner begins to recognize patterns that don't fit the simple rules and starts building a library of "maxims" — contextual rules that apply in specific types of situations.

**Competent**: The competent performer has enough situational knowledge to set goals and plan hierarchically. Performance becomes more efficient as some processes become automatic. The competent performer feels responsible for outcomes in a way the novice does not — which is both motivating and stressful, because the competent performer sees the complexity of what can go wrong.

**Proficient**: Situations are perceived holistically rather than as collections of features. The proficient performer "sees" what type of situation they are in and responds appropriately, with deliberate decision-making reserved for the choice of action rather than the reading of the situation. This is the beginning of the pattern recognition that Klein's RPD model describes.

**Expert**: Performance is largely intuitive — the expert acts, often without being able to articulate why, because the action was directly triggered by a rich situational recognition. Explicit rule-following feels laborious and unnatural. The expert has extensive experience across many cases, has developed a rich taxonomy of situation types with associated responses, and can reliably distinguish when a situation is "one of those" (calling for a standard approach) from when it is genuinely novel (calling for deliberate reasoning).

Shanteau (1992) adds an important nuance: expertise is domain-specific. Someone who is an expert in one domain is a novice in another. And the conditions under which expertise is possible vary: domains where feedback is reliable, where the environment is relatively stable, and where there are many opportunities for practice and error correction are those where genuine expertise can develop. Domains where feedback is delayed, ambiguous, or rare tend to produce practitioners who believe they are expert but actually remain at competent or proficient levels.

## Differences in Knowledge Structure

The difference between novice and expert is not just "more rules" — it is a fundamental difference in how knowledge is organized.

**Novices** represent problems in terms of their surface features — the literal elements that are present. A novice chess player sees "a bishop on square d5." A novice programmer sees "a for loop with a counter variable."

**Experts** represent problems in terms of their deep structure — the underlying principles and relationships that determine what is important. The expert chess player sees "a strong outpost that controls the center and threatens a knight fork." The expert programmer sees "a linear scan that could be replaced by a hash lookup to improve asymptotic complexity."

This difference in representation has cascading effects on everything:
- Experts notice different things (the deep-structure features rather than the surface features)
- Experts group information differently (into meaningful chunks rather than individual elements)
- Experts retrieve information differently (by deep structure patterns, so that seeing one feature activates a whole cluster of associated knowledge)
- Experts generate solutions differently (by recognizing the situation type and retrieving associated solutions rather than constructing solutions from scratch)

The knowledge reorganization from novice to expert representation typically requires extensive experience with many cases across the full range of variability in the domain. It cannot be shortcut by teaching principles alone — the reorganization requires something like supervised practice with feedback.

## What This Means for Agent System Design

### Agents Exist at Different Proficiency Levels — and Should Know It

Not all agents in a system have the same level of competence in a given domain. Some have been trained on extensive case libraries with rich feedback; others have minimal relevant training. Agent systems should represent and reason about the proficiency levels of their components, and route tasks accordingly.

A task that requires expert pattern recognition (identifying subtle anomalies in complex data, making nuanced judgment calls about ambiguous evidence) should be routed to agents with demonstrated competence in that specific domain — not to agents that are generally capable but lack domain-specific training.

More importantly: agents should have accurate models of their own proficiency level. An agent that believes it is expert when it is actually novice is more dangerous than an agent that knows it is novice. Self-awareness about proficiency limits should drive escalation behavior: when an agent encounters a situation that exceeds its competence level, it should recognize this and escalate rather than generating a confident but unreliable output.

### Design Skills with Stage-Appropriate Support

A single skill interface that works identically for novice-level and expert-level use cases will do neither well. Skills should be designed with different support modes:

- **Novice mode**: More explicit scaffolding, step-by-step guidance, with checks that ensure the basic conditions for the action are met before proceeding
- **Expert mode**: Fast, direct invocation with minimal overhead, trusting that the calling agent has made the appropriate situational assessment

The skill interface should enable callers to specify which mode they need, or the skill should be able to infer from context which mode is appropriate.

### Case Libraries as the Primary Knowledge Representation

The research on expertise development makes clear that case-based knowledge is more powerful than rule-based knowledge for complex domains. Experts perform well not primarily because they know more rules but because they have experienced more cases and have developed richer situational recognition as a result.

Agent systems should therefore prioritize **case libraries** as a knowledge representation mechanism — not just for retrieval-augmented generation (finding similar past cases to inform current responses) but for *capability development*. Training on diverse, well-annotated cases with clear outcomes is the functional equivalent of the expert's accumulated experience.

The annotation matters enormously. Cases annotated only with "this is the correct answer" produce agents that can reproduce outputs in similar situations. Cases annotated with "here is the situation type this represents, here are the cues that indicate this type, here is why this approach was appropriate given those cues, here is what went wrong in a superficially similar case" produce agents with something closer to the expert's deep structure knowledge.

### Distinguish Domains Where Expertise Is Possible from Those Where It Isn't

Shanteau's warning about the conditions for genuine expertise development is critical for agent system design. Some domains do not support the development of real expertise — because feedback is too delayed, too ambiguous, or too rare. In these domains, experienced practitioners may be *more* confident than novices without being *more* accurate — the Dunning-Kruger effect in its deepest form.

For agent systems, this means: a skill trained extensively in a domain without reliable feedback signals may have high surface confidence but low actual reliability. Domain assessment should include evaluation of whether the domain conditions support genuine expertise development.

Domains where agent expertise is likely to be real:
- Code correctness (feedback is precise: code runs or doesn't, tests pass or fail)
- Mathematical computation (feedback is verifiable)
- Pattern matching against large, well-labeled datasets

Domains where agent "expertise" should be treated with significant skepticism:
- Long-term consequence prediction in complex social or economic systems
- Judgment about novel legal or ethical situations without established precedent
- Creative quality assessment in domains without established evaluation criteria

### The Deliberate Practice Implication

Ericsson's research on expertise development identifies *deliberate practice* as the key mechanism — not just experience, but experience with feedback, with increasing difficulty, and with explicit attention to areas of weakness. Mere repetition without deliberate practice does not produce expertise.

For agent systems, this has implications for how training, fine-tuning, and capability development should be designed:
- Training should include cases near the boundary of the agent's current competence (not just easy cases)
- Feedback should be precise and informative (not just "right/wrong" but "here is what was wrong about your approach and why")
- Difficult sub-skills should be practiced in isolation before being integrated into complex tasks

Agent systems that are trained only on easy cases, with minimal feedback, and without deliberate targeting of weakness areas will plateau at a competent level without reaching the proficient or expert level that complex, high-stakes deployment requires.

## The Role of Training Support and Performance Support

Cognitive systems engineering research distinguishes two important types of system support:

**Training support**: Support that helps practitioners develop competence over time. Training support is appropriate early in the skill development process. It should be explicit, scaffolded, and educational — it should help practitioners build the knowledge structures that will eventually enable expert performance.

**Performance support**: Support that enables practitioners to perform effectively *now*, without necessarily developing the underlying competence. Performance support is appropriate when the practitioner needs to act in the domain without time to develop expertise first.

The critical error is providing *performance support* when *training support* is what is needed — and vice versa. A practitioner who relies on performance support indefinitely will never develop genuine expertise, because the support removes the challenges that drive expertise development. But a system that only provides training support when a practitioner needs to act reliably *now* is imposing inappropriate cognitive load.

For agent systems, this distinction applies directly. Some skills should be designed to help the calling agent learn and develop its own capabilities over time (training support mode). Others should be designed to provide reliable performance on demand without requiring the caller to understand how the skill works (performance support mode). The two modes call for different designs, and conflating them produces systems that serve neither purpose well.

## The Expert-Novice Interface Problem

One underappreciated challenge in multi-agent systems: when an expert-level agent must coordinate with a novice-level agent, the communication can fail because they are operating with different representations of the problem.

The expert agent represents the situation in terms of deep structure ("this is a case of distributed locking failure under high concurrency"). The novice agent represents the same situation in terms of surface features ("the database is returning timeout errors"). These representations lead to different questions, different information requests, and different interpretations of the same data.

This is analogous to the expert-novice communication problems documented in human team research — where expert practitioners and novice trainees often talk past each other because they are not sharing the same representation of the situation.

For agent orchestration, this means:
- Communication protocols between agents should include representation-level metadata (not just the content of a message but the level of abstraction at which it is expressed)
- Agents should be able to modulate the level of abstraction in their output based on the receiving agent's proficiency level
- The orchestration layer should be aware of representation mismatches between coordinating agents and manage translations when necessary

## The Irreducibility of Experience

The deepest lesson from the expertise development literature is one that agent system designers often resist: there is no shortcut to experience. Expert performance cannot be achieved solely by providing a system with correct rules and procedures. The knowledge reorganization that underlies expert performance — the development of a rich library of situation types with associated cues, expectations, and responses — requires exposure to many cases across the full range of domain variability, with reliable feedback.

This is not a counsel of despair for agent systems — it is a design constraint that should be taken seriously. Agent systems cannot be expected to perform at expert level in domains where they have not had the equivalent of extensive, varied, feedback-rich experience. Systems deployed in such domains should:
- Reflect their actual (limited) proficiency in their confidence calibration
- Escalate to human judgment for cases near their competence boundary
- Include explicit mechanisms for accumulating case experience over time
- Be evaluated against realistic difficulty distributions, not just easy test cases

The road to expert-level agent performance runs through experience — carefully curated, extensively annotated, and honestly evaluated.
```

### FILE: situated-cognition-and-context-dependence.md
```markdown
# Situated Cognition: Why Context Is Not Optional Background

## The Standard Model and Its Failure

Classical cognitive science, and much early AI, operated with a model of cognition as symbol manipulation: the mind receives inputs, applies rules to those inputs (stored in memory), and generates outputs. In this model, context is a relatively minor factor — it provides the inputs, but the processing that matters happens in the isolated cognitive system.

Lucy Suchman's *Plans and Situated Actions* (1987), Jean Lave's *Cognition in Practice* (1988), and Edwin Hutchins' *Cognition in the Wild* (1995) demolished this model through careful empirical investigation of actual cognitive performance in actual settings. Their finding, replicated across many domains and methods, is that cognition is *situated* — irreducibly bound to the specific context in which it occurs, in ways that the standard model cannot capture.

This is not merely a theoretical point. It has direct, practical implications for how AI agent systems should be designed.

## What "Situated" Actually Means

Situated cognition means that intelligent behavior cannot be understood — and cannot be built — by abstracting away the specific context in which it occurs. The context is not background noise to be controlled out; it is *constitutive* of the intelligence.

Several specific claims follow from this:

**Intelligence is distributed across person and environment**: The expert navigator does not carry a complete mental model of the ship's position. The navigation computation is distributed across the navigator's knowledge, the instruments, the charts, the log, the communication with other crew members, and the physical structure of the bridge. Remove any of these components and the navigation system degrades — not because the individual navigator has lost knowledge, but because the distributed cognitive system has lost a component.

**Action is responsive to local conditions, not to plans**: Suchman's analysis showed that human action is organized *in response to circumstances* — it is not the execution of a pre-formed plan. Plans exist and are useful, but they are *resources for action* rather than *specifications of action*. When you are about to run a planned route and discover that the road is closed, you don't execute the plan — you use the plan's goal (reach the destination) to improvise an alternative path in response to the local condition (closed road). The plan enabled the action without determining it.

**Context provides resources that cognition exploits**: Experts routinely exploit environmental structure to reduce cognitive load. The chess player can think about positions by manipulating the pieces rather than carrying all possibilities in working memory. The programmer uses the code's structure on screen rather than maintaining a complete model internally. The navigator uses landmarks to orient rather than computing position from scratch. This exploitation of environmental structure is not cheating — it is fundamental to how intelligence actually operates.

**Categories are context-dependent**: What counts as an instance of a concept depends on the context. Lave showed that mathematical understanding is context-dependent in ways that formal mathematics education often misses: people who cannot solve arithmetic problems in test conditions can solve formally identical problems in everyday shopping contexts. The "knowledge" is not stored in an abstract form that transfers across contexts — it is organized around the contexts in which it was developed.

## The Implications for "Plans" and "Goals" in Agent Systems

Suchman's analysis of plans versus situated action is particularly important for agent system design. She argues that plans — representations of intended future action — are always incomplete specifications of behavior. The actual behavior always involves filling in the plan's gaps in response to the local situation.

This means that an agent system cannot succeed by generating complete, fully specified plans and then executing them mechanically. The execution phase is always itself a cognitive activity — interpreting the plan's intentions, recognizing how the current local situation applies to the plan's abstract specifications, and adapting when the plan's assumptions turn out not to hold.

Concretely:

- An orchestrating agent that generates a plan for a complex task ("step 1: retrieve data, step 2: analyze, step 3: synthesize, step 4: report") has not determined the behavior of the execution agents — it has provided a resource that the execution agents will interpret and adapt.
- The fidelity of plan execution depends on whether the execution agents share a sufficiently rich common understanding of the plan's *intentions* to interpret it appropriately in their specific local contexts.
- When local conditions diverge from the plan's assumptions, successful adaptation requires that execution agents understand *why* the plan specified what it did — so that they can find alternative means to the same end.

This argues for **intention-explicit planning** in agent systems: plans should specify not just what to do but why, so that execution agents have the resources to adapt intelligently when conditions change.

## Context as Input to Intelligence

One of the most practically important insights from situated cognition research is that context should be treated as a primary input to intelligence, not as incidental background.

For agent systems, this means:

**Context richness determines performance quality**: An agent operating with rich, accurate contextual information will perform substantially better than the same agent operating with impoverished context — even if its underlying capabilities are identical. Investing in context representation and maintenance is therefore a direct investment in performance quality.

**Context changes require active monitoring**: If context is constitutive of intelligent behavior, then changes in context require corresponding updates in the agent's situational model. An agent that acquired its situational model at time T and is now operating at time T+N (after context has changed) is not operating with the same cognitive resources as it appeared to have at T. The agent is, in an important sense, *a different agent* in a different context — and may not perform as expected.

**Context is partly created by the agent's own actions**: As agents act, they change the context in which subsequent actions occur. The planning agent that decomposes a task and assigns subtasks to execution agents has *created a context* for those execution agents — the assignments, the implied relationships, the expected outputs, the implicit deadlines. Managing the context that agent actions create is part of the coordination challenge, not a separate issue.

## Distributed Cognition in Multi-Agent Systems

Hutchins' distributed cognition framework is perhaps the most directly applicable to multi-agent systems of any insight in this literature.

Hutchins argues that the unit of cognitive analysis should be the *cognitive system*, not the individual cognizer. The system includes the humans, the artifacts, the communication channels, the shared representations, and the organizational structure — all of which contribute to the system's cognitive performance.

For multi-agent systems:

**The system's knowledge is not the sum of agent knowledge**: The multi-agent system may know things that no individual agent knows — because knowledge is encoded in the coordination patterns, the communication protocols, the shared representations, and the organizational structure. Similarly, the system may be unable to act on knowledge that individual agents possess, if that knowledge cannot be communicated or integrated appropriately.

**Coordination architecture is cognitive infrastructure**: The way agents communicate, the representations they share, the protocols they use for handoffs — these are not just logistics. They are the infrastructure through which the distributed cognitive system performs. Poor coordination architecture degrades cognitive performance even when individual agents are capable.

**Artifacts carry cognition**: In Hutchins' analysis, the ship's navigation instruments are not just tools — they are cognitive components. They store information, perform computations, and mediate the navigation process in ways that are constitutive of the cognitive system's performance. In agent systems, prompts, knowledge bases, context documents, example repositories, and output formats all play analogous roles. They are cognitive artifacts, and their design determines what kinds of cognition the system can perform.

**Propagation of representational states**: Hutchins analyzes navigation as a process of *propagating representational states* across the components of the system — from physical measurement to instrument reading to chart marking to position calculation. Each transformation preserves the information needed while converting it to a form that the next component can use. For agent systems, this translates to: every handoff between agents should be analyzed as a representational state propagation. Is the information being preserved? Is it being transformed into a form the receiving agent can use? Are important properties (uncertainty, limitations, context) being maintained across the transformation?

## Context Failures in Agent Systems

Agent systems fail in characteristic ways that can be understood through the situated cognition lens:

**Context stripping**: When a task is decomposed and distributed across agents, each agent receives only a portion of the original context. If the distribution is done carelessly, agents may receive the *what* of their subtask without the *why* — stripping the context they need to adapt intelligently when local conditions differ from plan assumptions.

**Context drift**: As a long-running task progresses, the context accumulates changes. Early agents produced outputs based on an early context; later agents inherit those outputs without necessarily having access to the earlier context. The output of agent A made sense given the context in which A was operating; when agent C (operating in a different context) builds on A's output, the mismatch may be invisible but consequential.

**Context explosion**: In the other direction, some agent systems accumulate context so aggressively that agents are overwhelmed — they receive more contextual information than they can effectively integrate, and performance degrades despite (or because of) the richness of available context. Expertise research shows that experts do not use all available information — they selectively attend to the cues that are most informative given their situational model. Agent systems should similarly have mechanisms for *selective context attention*, not just context accumulation.

**Decontextualized knowledge application**: An agent that applies a reasoning pattern or knowledge that was developed in one context to a different context — without recognizing that the change in context may change the appropriateness of the pattern — is committing the decontextualized knowledge error that situated cognition research systematically identifies. The recommendation that "applied in context X" may not apply in context Y, even if the surface problem looks similar.

## Design Principles from Situated Cognition

1. **Treat context as a first-class system resource**: Design explicit mechanisms for capturing, maintaining, propagating, and updating contextual representations across agent interactions.

2. **Design for intention preservation**: When tasks are decomposed and distributed, ensure that execution agents receive not just task specifications but task intentions — enough context to adapt intelligently when local conditions diverge from plan assumptions.

3. **Design handoffs as representational state propagations**: Every handoff between agents should be analyzed to ensure that information is preserved, transformed appropriately for the receiving agent, and not stripped of important properties.

4. **Recognize that the system's knowledge differs from agent knowledge**: Analyze what the multi-agent system collectively knows and can do — including what is encoded in coordination patterns and shared representations — rather than only analyzing individual agent capabilities.

5. **Monitor context change**: Build explicit mechanisms for detecting when the context has changed significantly enough that previous situational assessments and plans may no longer be appropriate.

6. **Design cognitive artifacts with care**: Treat prompts, knowledge bases, context documents, and output formats as cognitive infrastructure — analyze what cognition they enable or constrain, and design them to support the full range of intelligent behavior the system needs to exhibit.

The situated cognition insight does not make agent system design impossible — it makes it honest. Intelligence is not a context-free capacity that can be developed in abstraction and deployed anywhere. It is a distributed, contextual achievement that depends on the full cognitive system: the agents, their coordination architecture, their shared representations, and the contexts in which they operate.
```

### FILE: cognitive-task-analysis-for-skill-specification.md
```markdown
# Cognitive Task Analysis: The Missing Method for Specifying What Agents Should Actually Do

## Why Requirements Are Not Enough

The standard approach to specifying what an AI agent capability should do is requirements analysis: identify the inputs the capability should accept, the outputs it should produce, and the performance criteria it should meet. This approach is borrowed from software engineering, and it works reasonably well for deterministic, well-defined functions.

It fails systematically for capabilities that involve expertise, judgment, or complex reasoning — which is to say, for the capabilities that are most valuable and hardest to build.

The reason for this failure is precisely what cognitive systems engineering research identified: **the most important aspects of expert performance are not visible in behavioral inputs and outputs alone**. The expert's value is in the reasoning and recognition that happens between input and output — the situation assessment, the cue weighting, the expectation formation, the alternative generation and rapid evaluation, the pattern matching against experience. A specification that captures only inputs and outputs has missed the point.

Cognitive Task Analysis (CTA) — a family of methods developed and refined over decades of cognitive systems engineering research — provides the alternative. CTA aims to capture not just what practitioners do but *how they think*: the knowledge, strategies, and reasoning processes that underlie effective performance.

## What Cognitive Task Analysis Is

CTA is not a single method but a family of related approaches, each designed to surface different aspects of expert cognition. Hoffman, Crandall, and Shadbolt (1998), in their landmark methodological analysis, identify and evaluate the major CTA methods. The key methods include:

**The Critical Decision Method (CDM)**: A structured interviewing approach that focuses on specific challenging incidents rather than general procedures. The practitioner is asked to recall a specific difficult case — ideally one where things were uncertain, where they had to make judgment calls, or where things could easily have gone wrong. The interviewer then probes that specific incident with structured questions designed to surface the expert's cue recognition, situation assessment, expectation formation, and decision making at specific moments.

The power of the CDM is that the specific incident serves as a cognitive scaffold — it gives the expert's tacit knowledge something to attach to. General questions like "how do you decide when to do X?" often produce generic, rule-like answers that reflect the expert's theories about their decision-making rather than their actual decision-making. The specific incident question ("in that specific case, at that moment, what were you seeing, what were you thinking, what did you expect would happen?") is much more likely to surface the actual cognitive process.

**Think-Aloud Protocols**: Having experts perform their actual work while verbalizing their thinking. This captures real-time cognitive processing in a way that retrospective accounts cannot. The limitation is that verbalization can disrupt highly automated, tacit processes — the expert who thinks aloud while performing highly skilled tasks may perform differently than they would in silent practice.

**Concept Mapping and Knowledge Elicitation Interviews**: Structured approaches to capturing how experts organize domain knowledge — what concepts they use, how those concepts relate to each other, and what distinctions they consider important. These methods are particularly useful for capturing the deep-structure knowledge representations that differentiate expert from novice performance.

**Observation with Structured Debriefing**: Observing expert performance and capturing specific moments for later probing. The observer identifies moments where tacit knowledge is likely to be operating — pauses, unexpected actions, changes in direction, reactions to cues — and then probes those moments in a subsequent debriefing session.

**Simulation-Based Probing**: Presenting experts with simulated scenarios and asking specific questions designed to surface tacit knowledge: "What's wrong with this picture?" (exploiting anomaly detection), "What would you look at next?" (surfacing cue prioritization), "What's the first thing you'd do?" (surfacing action generation), "What might go wrong here?" (surfacing expectation formation).

## What CTA Reveals That Requirements Analysis Misses

The consistent finding across CTA studies is that expert performance involves cognitive elements that are invisible to behavioral observation and unavailable through direct self-report:

**Cue patterns**: Experts attend to configurations of cues — patterns that signal situation types — rather than individual features. The same individual cue may have opposite significance depending on what other cues are present. Requirements analysis that specifies inputs without specifying the cue patterns and their interdependencies will produce capabilities that process individual features but miss the pattern-level recognition that drives expert performance.

**Situation typologies**: Experts have rich, often implicit taxonomies of situation types, each with associated implications for goals, expectations, and actions. These taxonomies are rarely fully explicit and often don't map onto the categories that domain documentation uses. CTA can surface these typologies — which become the foundation for capability design.

**Expectation formation**: Experts continuously form specific expectations about what will happen next, and they treat violated expectations as diagnostic signals. This active prediction is a key component of expert situation awareness, and it is invisible to requirements analysis that specifies only input-output behavior.

**Decision points and choice rationale**: At specific points in complex tasks, experts make decisions among alternatives — but they often don't recognize these as decision points because the "right" choice is so strongly suggested by their situational recognition that it feels obvious. CTA can surface these implicit decision points and the rationale for the typical choice — which then becomes the basis for capability design (what should the agent do in this situation, and why?).

**Error recognition and recovery**: Experts have developed specific patterns for recognizing when something is going wrong and responding appropriately. These patterns are among the most valuable aspects of expertise — and they are essentially impossible to surface through requirements analysis, which focuses on the normal case.

## CTA Applied to Agent Skill Specification

The translation from CTA in human factors to agent skill specification requires adaptation, but the core approach transfers directly.

### Step 1: Domain Expert Analysis

Before designing an agent capability, conduct a structured analysis of how human domain experts approach the type of task the capability will handle. This analysis should use CTA methods:
- Collect specific cases across the range of difficulty and variability the capability will face
- Probe each case for cue recognition, situation assessment, decision points, and expectation formation
- Surface the implicit taxonomies of situation types experts use
- Document the "near misses" — cases where expert judgment was required to avoid an error

This analysis produces not just requirements but *cognitive models* — descriptions of how expertise operates in the domain.

### Step 2: Capability Specification from Cognitive Models

Use the cognitive models to specify capability behavior in terms of cognitive structure, not just input-output:
- What situation types should the capability recognize?
- What cue configurations identify each situation type?
- What does the capability expect to find in each situation type (and what signals anomaly)?
- What decision points exist, and what is the appropriate rationale for each choice?
- What error recognition patterns should the capability implement?

This cognitive-model-based specification goes far beyond behavioral requirements and provides the foundation for genuine expert-level performance.

### Step 3: Case Library Development

Develop a case library that covers:
- Routine cases across the range of normal variability
- Boundary cases — situations near the edge of the capability's appropriate scope
- Challenge cases — situations that are difficult, unusual, or require judgment
- Near-miss cases — situations where an obvious-seeming approach would fail, and why
- Diagnostic cases — situations designed to test specific aspects of the cognitive model

Each case should be annotated not just with the correct output but with the situation type it represents, the cues that identify it, the expectations it generates, and the decision rationale.

### Step 4: Expectation-Based Evaluation

Design capability evaluation around not just output correctness but cognitive fidelity:
- Does the capability attend to the right cues?
- Does it recognize the appropriate situation types?
- Does it form the appropriate expectations?
- Does it flag appropriately when situations fall outside its competence?
- Does it recognize error conditions that would be missed by a less experienced practitioner?

This evaluation approach surfaces capability failures that output-only evaluation misses — specifically, capabilities that produce correct outputs for wrong reasons (which will fail under novel conditions) and capabilities that fail to recognize when they are operating outside their scope of competence.

## Practical Challenges and How to Address Them

**Experts are not always available or cooperative**: CTA is time-intensive and requires significant expert participation. In practice, this means prioritizing CTA for the most critical and complex capabilities — those where the difference between rule-following and genuine expertise matters most.

**Tacit knowledge resists elicitation even with CTA**: The methods described above are much better than naive self-report, but they are not perfect. Some tacit knowledge remains inaccessible through any verbal method. This residual tacit knowledge can sometimes be captured through behavioral observation and annotation — identifying what the expert does that they can't articulate, and encoding that as observable behavior patterns.

**Domain documentation provides an incomplete picture**: Existing documentation (manuals, procedures, training materials) describes the prescribed work, not the actual work. CTA findings will typically diverge from documentation in important ways. Both are useful, but the CTA findings reveal the tacit expertise that documentation misses.

**CTA for novel domains**: When AI agent systems are being developed for domains where there is no existing human expert practice (genuinely novel AI capabilities), the CTA approach requires adaptation. The analysis must focus on first principles, boundary cases, and the logical structure of the task rather than on human expert practice. Simulated adversarial probing (attempting to find cases where the capability would fail) becomes particularly important.

## The Payoff

The investment in CTA-based capability specification pays off in multiple ways:

**Better performance on hard cases**: Capabilities specified through cognitive modeling perform better on the difficult, unusual cases that trip up requirements-based specifications — because the cognitive model specifically addresses the judgment and recognition that handle those cases.

**Better calibrated confidence**: Capabilities designed with explicit situational typologies and competence boundaries produce more accurate uncertainty estimates — they know when they are in familiar territory and when they are not.

**Better failure modes**: When CTA-based capabilities fail, they fail in more diagnosable ways — at the decision points and cue recognition steps that the cognitive model identifies, rather than in opaque, unpredictable ways.

**Better basis for improvement**: Failures can be analyzed against the cognitive model to identify what went wrong at a process level — wrong situation type recognition, wrong cue weighting, wrong expectation formation — rather than just noting that the output was wrong.

The broader lesson: building expert-level AI agent capabilities requires understanding how expertise works at a cognitive level — not just what experts produce, but how they reason. Cognitive Task Analysis is the method for developing that understanding, and it is an underutilized resource in current AI agent development.
```

### FILE: the-gap-between-knowing-and-doing-in-complex-systems.md
```markdown
# The Gap Between Knowing and Doing: Why Understanding a Problem Doesn't Solve It

## The Illusion of Sufficient Understanding

There is a seductive belief that drives much system design: if we understand a problem well enough, we can solve it. This belief is wrong in complex domains, and cognitive systems engineering research provides a detailed account of why.

The problem is not understanding. The problem is the gap between understanding and competent action — a gap that persists even when understanding is genuinely deep, and that creates characteristic failure modes in systems (both human and artificial) that have not adequately bridged it.

Hoffman, Klein, and Laughery (2002) observe this gap explicitly: even designers who are aware of the trap of building user-hostile systems "will still fall into it." Knowing that the trap exists does not prevent falling into it. This is not a statement about stupidity or carelessness — it is a statement about the structural properties of complex work.

## Forms of the Knowing-Doing Gap

The knowing-doing gap manifests in several distinct but related forms:

### Declarative-Procedural Gap

You can know, in the declarative sense, that "when approaching a system near its performance limit, you should back off and reconfigure before attempting to optimize" — and still fail to do this in practice, because the procedural knowledge of *how* to recognize "near its performance limit," *how* to "back off," and *when* the backing-off has been sufficient to attempt optimization is not given by the declarative principle.

In cognitive psychology, this distinction maps to the difference between knowing-that (declarative knowledge) and knowing-how (procedural knowledge). Instruction that teaches only declarative knowledge — principles, concepts, rules — leaves a large gap that experience must fill. The gap between the principle and its application is where expertise lives.

### Tacit-Explicit Gap

A large portion of expert knowledge is tacit — enacted in skilled performance but not available through introspection. This gap runs in a direction opposite to the declarative-procedural gap: it is not that you know the principle but cannot apply it, but that you *can* apply it without being able to articulate the principle.

For system design, the tacit-explicit gap creates a specific danger: designers build systems that support the explicit (articulable) part of expert knowledge while missing the tacit part. The system then fails at exactly the moments when tacit expertise would have made a difference — the subtle recognition of anomaly, the context-sensitive modulation of standard procedure, the intuitive override of an apparently valid rule.

### Comprehension-Application Gap

Even when someone fully understands a concept — can define it, apply it to canonical examples, explain its implications — they may fail to apply it in novel situations where the concept is relevant but not obviously so. This is sometimes called the "inert knowledge" problem: knowledge that is held in a form that cannot be activated in the situations where it is needed.

For agent systems, this manifests when an agent has access to relevant knowledge (in training, in retrieved documents, in its context) but fails to apply it because the connection between the current situation and the relevant knowledge is not explicit. The agent "knows" the relevant fact or principle but does not connect it to the current problem.

### Simulation-Reality Gap

Complex systems behave differently in deployment than in the designed and tested scenarios. This gap is not just a matter of testing coverage — it reflects a fundamental property of complex systems: their behavior in novel situations cannot be fully predicted from their behavior in tested situations, because the novel situations involve combinations and interactions that were not present in testing.

This gap is why "the road to user-hostile systems is paved with designers' user-centered intentions" — the designers understood the system, tested the system, and believed it was well-designed. The gap appeared between their understanding (developed in controlled conditions) and the system's actual behavior (in the variable, unpredictable real world).

## The Gap in Context-Sensitivity

One of the most practically important manifestations of the knowing-doing gap in complex work is the gap between knowing a rule and knowing when the rule applies.

Real expert knowledge is not just a collection of rules — it is a collection of contextually indexed rules: "this rule applies in this type of situation, and does not apply in that type of situation." The index is the crucial part. A novice who has learned the rule without learning the index will apply it in the wrong contexts. A system that encodes the rule without encoding the index will behave incorrectly in contexts where the rule doesn't apply.

Rasmussen's Skills-Rules-Knowledge (SRK) framework provides a useful lens here. At the rule-based level of performance, practitioners apply rules that map situations to responses. But the rule is only reliable if the situation recognition is correct. If the situation is misclassified — if a novel situation is erroneously classified as a familiar type — then the rule that fires is the wrong rule, and the response may be harmful.

This is one mechanism for the characteristic failures that cognitive systems engineering calls "rule-based mistakes": the rule was applied, the rule would have been correct for the situation it was designed for, but the situation turned out to be different from what the rule-applier believed. The error was in the situation recognition, not the rule application.

## The Gap in Agent Systems: Specific Manifestations

### Confident Application of Patterns in Novel Contexts

Language models and agent systems that have learned patterns from training data will apply those patterns in new contexts — sometimes correctly, sometimes not. The system cannot always distinguish between "this is a situation where the pattern I've learned applies" and "this is a superficially similar situation where the pattern does not apply." The system has the pattern (the declarative/procedural knowledge) but lacks the contextual indexing that would prevent misapplication.

This is a direct analog of the rule-based mistakes that Rasmussen identified in human performance. The solution is not to remove the patterns — patterns are valuable. It is to build richer contextual recognition that limits pattern application to appropriate contexts.

### Capability Without Calibration

An agent system may have genuine capability — it can perform the task correctly in situations within its competence — while lacking calibration: an accurate model of when it is within its competence and when it is not. The knowing-doing gap here is: the system knows how to do X (in the right situations) but does not know when it is in a situation where it can reliably do X.

Well-calibrated systems express appropriate uncertainty when operating near their competence boundaries. Poorly calibrated systems express uniform confidence regardless of the actual difficulty or novelty of the situation. The knowing-doing gap in calibration produces the most dangerous failure mode: confident wrong answers.

### Planning Without Execution Knowledge

Orchestrating agents can develop sophisticated plans for complex tasks — plans that correctly identify the subtasks required, their dependencies, and the agents best suited to each. But generating a plan and executing a plan are different cognitive activities, and the knowing-doing gap can appear between them.

The plan represents the orchestrating agent's understanding of what needs to happen. The execution is performed by agents operating in their specific local contexts. The gap between the plan's assumptions and the actual conditions the executing agents encounter is the simulation-reality gap — and it is why plans always require interpretation and adaptation in execution.

This is not a failure of planning. It is a structural feature of the planning-execution relationship in complex systems. The appropriate design response is to treat plans as *communicative acts* that express intentions, not as *programs* that specify behavior. Executing agents should be equipped to interpret the intention, not just follow the specification.

## Bridging the Gap: Design Principles

### 1. Simulate Before You Specify

Simulation — whether mental simulation (as in the RPD model) or computational simulation (as in agent testing) — is the primary mechanism for bridging the comprehension-reality gap. By simulating behavior in specific scenarios before specifying it, designers discover mismatches between their understanding and the system's actual behavior in advance of deployment.

For agent systems: before deploying a new capability or coordination protocol, test it against a diverse set of specific scenarios — especially unusual, edge-case, and adversarial scenarios. The goal is not to confirm that the system works in normal conditions (it probably does) but to discover where the comprehension-reality gap appears.

### 2. Design for Competence Boundary Awareness

Agent capabilities should be designed with explicit models of their own competence boundaries — the conditions under which they can be expected to perform reliably, and the conditions under which their performance should be treated with skepticism.

This requires:
- Diverse evaluation against cases ranging from easy to very difficult
- Explicit tagging of situations that fall near or outside competence boundaries
- Escalation protocols for situations near competence boundaries
- Honest expression of uncertainty (not uniform confidence)

### 3. Invest in Contextual Indexing, Not Just Pattern Learning

The gap between knowing a pattern and knowing when to apply it is a contextual indexing problem. Agent systems should be designed to build rich contextual representations that limit pattern application to appropriate contexts. This requires training cases that include explicit contextual features, annotated with which patterns apply and which don't — not just with correct outputs.

### 4. Treat the Knowing-Doing Gap as a Design Problem, Not a Training Problem

It is tempting to respond to the knowing-doing gap by increasing training — more examples, more cases, more exposure. Training is valuable, but it addresses only part of the gap. The part that remains is structural: the mismatch between the representations in which knowledge is held and the representations required for action.

Structural solutions include:
- Redesigning the interface between knowledge and action (making relevant knowledge more readily applicable)
- Building explicit bridges from principles to specific situations (worked examples with detailed contextual annotation)
- Designing practice protocols that specifically target the gap (cases designed to reveal misapplication of rules in wrong contexts)

### 5. Maintain Epistemic Humility at System Level

The deepest response to the knowing-doing gap is epistemic humility: building systems that acknowledge what they don't know, that flag when they are operating in unfamiliar territory, and that treat confident action under genuine uncertainty as a design failure rather than a success.

This is harder to achieve than it sounds. Agent systems (like human experts) tend to be more confident than they should be. The organizational pressure to project confidence — because uncertain systems are harder to trust and sell — pushes against calibration. But a system that is well-calibrated is genuinely more trustworthy than a system that projects uniform confidence, because the former's uncertainty flags are informative and the latter's are not.

## The Meta-Lesson

The knowing-doing gap, in its broadest form, is this: building a system that demonstrates competence is not the same as building a system that can be relied on. Demonstrated competence in tested conditions is evidence of underlying capability, but it is not a guarantee of reliable performance in deployment conditions.

The gap between tested performance and deployment performance is the gap between the designer's understanding and the full variability of the real world. Closing this gap requires:
- Richer testing across more diverse and adversarial conditions
- Explicit modeling of competence boundaries
- Honest calibration of uncertainty
- Design for graceful degradation when conditions exceed tested ranges
- Ongoing monitoring and adaptation in deployment

This is not pessimism about agent systems — it is realism about complex systems. The payoff for taking this gap seriously is systems that actually work reliably in the messy, variable, surprising real world, rather than systems that work in demonstrations and disappoint in deployment.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: Directly transformed by the invariant task sequence critique. Decomposition should be goal-directed and flexible rather than fixed sequential pipelines. Sub-tasks should carry intention metadata, not just behavioral specifications, so that executing agents can adapt when local conditions differ from plan assumptions.

- **Architecture Design**: The situated cognition and distributed cognition insights fundamentally change how agent coordination architecture should be conceived — not as plumbing between capability nodes but as cognitive infrastructure that determines what the joint cognitive system can know and do. Mode transparency, authority hierarchies, and shared state representation are architectural requirements, not optional features.

- **Debugging / Root Cause Analysis**: The automation surprise literature provides a framework for diagnosing multi-agent coordination failures. Most failures are not individual agent failures — they are joint cognitive system failures at coordination interfaces. The debugging approach should analyze: what state model did each agent hold, where did those models diverge, and how did the coordination protocol fail to catch the divergence?

- **Code Review**: The knowing-doing gap analysis applies directly. Code review should not just verify that code does what the specification requires — it should assess whether the code's behavior in edge cases and unusual conditions matches the underlying intent, whether confidence is appropriately calibrated, and whether the code fails gracefully at its competence boundaries.

- **Security Auditing**: The automation surprise framework — specifically mode confusion, transparency failures, and authority gradient problems — maps directly onto common security failure modes. Security audits should analyze not just whether agents have appropriate permissions but whether the coordination architecture ensures that authority is exercised transparently and with appropriate oversight.

- **Prompt Engineering / Skill Design**: Cognitive Task Analysis provides the missing methodology for specifying what agent skills should do. Behavioral requirements are insufficient; cognitive modeling of the underlying expertise — cue patterns, situation typologies, expectation formation, decision points — is required for capabilities that involve genuine judgment.

- **Quality Assurance / Testing**: The knowing-doing gap and the simulation-reality gap together define the testing challenge. Test design should specifically target competence boundary conditions and adversarial cases — not just normal-case verification. Confidence calibration should be explicitly evaluated.

- **Agent Orchestration**: Recognition-Primed Decision making provides the model for fast, competent orchestration decisions under uncertainty. Orchestrators should assess situation type before selecting routing strategy, simulate the proposed routing strategy before committing, and design for revision rather than treating routing as a one-shot decision.

- **Documentation / Knowledge Management**: The tacit-explicit gap and knowledge elicitation findings directly improve knowledge management practice. Documentation should use case-based formats (specific incidents with cue annotation) rather than principle statements, and should include explicit coverage of boundary conditions and failure modes — not just normal-case procedures.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The orchestration layer should function as a joint cognitive system coordinator, maintaining shared situational models across agents, ensuring mode transparency, and routing based on situation assessment rather than surface task features. The RPD model provides the micro-theory of how fast orchestration decisions should be made.

- **Task Decomposition**: Decomposition should separate goals from methods, include intention metadata, and provide alternative paths — not just fixed sequential assignment. The invariant task sequence critique applies directly: fixed pipelines encoded as "the decomposition" will fail when conditions diverge from design assumptions.

- **Failure Prevention**: Automation surprises are the primary failure mode in multi-agent coordination. Prevention requires explicit mode transparency, shared state representation, designed escalation protocols for consequential actions, and analysis of every coordination interface for potential representational divergence between agents.

- **Expert Decision-Making**: The RPD model provides a directly applicable architecture for fast, competent decisions under uncertainty: classify the situation type, generate the first plausible approach, simulate it briefly, act or revise. This replaces exhaustive option comparison with recognition-primed simulation — faster and often more accurate for experienced agents.