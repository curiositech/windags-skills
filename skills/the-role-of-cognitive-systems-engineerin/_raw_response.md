## BOOK IDENTITY

**Title**: "The Role of Cognitive Systems Engineering in the Systems Engineering Design Process"
**Author**: Laura G. Militello, Cynthia O. Dominguez, Gavan Lintern, and Gary Klein
**Core Question**: How can we design systems — technological, organizational, and cognitive — that genuinely support the way skilled humans actually think and act under real-world complexity, rather than how designers imagine they think?
**Irreplaceable Contribution**: This paper synthesizes 30 years of Cognitive Systems Engineering (CSE) into a unified framework that insists on a radical claim: the hardest problems in complex system design are not technical but *cognitive*. Systems fail not because the engineering is wrong but because the cognitive requirements of real work are invisible to designers who rely on intuition, normative assumptions, or sequential process models. The paper's unique contribution is its argument that design must be understood as *dialog* — perpetually iterative, opportunistic, and grounded in ongoing empirical discovery of what human cognition actually demands — and that this is not a weakness to be engineered away but the fundamental nature of all serious design.

---

## KEY IDEAS

1. **Cognitive requirements are invisible and must be made explicit.** The gap between what designers assume workers need and what workers actually need in cognitively complex domains is enormous and systematically underestimated. Without active methods for surfacing the tacit knowledge, decision structures, perceptual cues, and constraint spaces of expert practitioners, design teams will build systems that hinder rather than support work — even when those teams are highly intelligent and well-intentioned.

2. **Errors are diagnostics, not defects.** CSE treats errors not as failures to be eliminated but as "interesting openings for further inquiry" — windows into the mismatch between a system's design assumptions and the actual cognitive demands of the work. This reframing is foundational: errors reveal where the system's model of work diverges from work's actual structure.

3. **Design is dialog, not pipeline.** The dominant sequential/waterfall model of design is pedagogically convenient but operationally false and counterproductive. Real design is opportunistic, iterative, and driven by continuous re-evaluation of the problem as understanding deepens. Attempts to fully formalize design suppress the innovation and discovery that complex problems require.

4. **Problem framing is the highest-leverage intervention.** In multiple case studies, the most valuable CSE contribution was not finding better solutions to a stated problem but discovering that the problem had been stated incorrectly. The nuclear power plant case (80+ staff → 35 staff, zero new technology) demonstrates that an accurate cognitive model of work can make entire categories of expensive proposed solutions unnecessary.

5. **Joint cognitive systems, not individual tool-user pairs.** Cognitive complexity does not reside in one person or one machine but in the distributed system of humans, technologies, processes, and organizational structures that collectively perform cognitive work. Design must target this joint system — and particularly the coordination, information flow, and shared situation awareness across its components.

---

## REFERENCE DOCUMENTS

### FILE: cognitive-requirements-are-invisible.md
```markdown
# Cognitive Requirements Are Invisible: Why Agent Systems Must Surface What Designers Assume

## The Core Problem

When engineers build systems — whether information technologies, decision support tools, or AI agent orchestration platforms — they make constant assumptions about the cognitive requirements of the work those systems will support. These assumptions are usually implicit. They are rarely verified. And they are systematically wrong in predictable ways.

Militello, Dominguez, Lintern, and Klein open their synthesis of Cognitive Systems Engineering (CSE) with a blunt observation: "It is possible to design information technologies without bringing in CSE specialists. Many have done so. The design team simply ignores the cognitive requirements for the systems they are specifying, and directs its energy towards meeting the physical specifications. In other cases the design team makes assumptions about cognitive requirements, extrapolating their experience to anticipate the needs of the workers. Occasionally their assumptions are correct. We tend to hear about the cases where their assumptions were dramatically wrong."

The authors cite Charles Perrow's *Normal Accidents* as the canonical documentation of what happens when assumptions go dramatically wrong. But the more insidious problem is not the dramatic failure — it is the quiet, accumulating degradation of system usefulness when cognitive requirements are addressed superficially or not at all.

## What "Cognitive Requirements" Actually Means

The paper defines cognitive complexity as encompassing "activities such as identifying, judging, attending, perceiving, remembering, reasoning, deciding, problem solving, and planning." This is not merely about user interface aesthetics or information display. It is about the entire structure of how competent practitioners *think* in the context of their work:

- What cues do experts attend to, and in what order?
- What decisions are the hardest, and why?
- What mental models do practitioners carry about the system state?
- Where does workload spike, and what degrades under that load?
- What workarounds have practitioners invented because the official process doesn't match the actual work?
- What are the competing goals and constraints that create genuine dilemmas?

These requirements are *invisible* because they live in the heads of practitioners, expressed through behavior that appears fluid and effortless to observers precisely because expertise has made it so. The CSE insight is that fluency masks complexity — what looks simple is often the product of years of pattern recognition and tacit knowledge that no amount of engineering intuition will reconstruct.

## Why Agent Systems Face This Problem Acutely

An AI agent orchestration system like WinDAGs faces a version of this problem at multiple levels simultaneously:

**Level 1: The agents themselves.** Each agent invokes skills — specialized capabilities designed by someone who made assumptions about what that skill needs to accomplish and what information it needs to do so. Those assumptions may be wrong, incomplete, or appropriate for a different context than the one in which the skill is actually invoked.

**Level 2: The orchestration logic.** The system that routes tasks, sequences agents, and decides when to decompose or synthesize makes implicit assumptions about how complex problems are structured, what subtask boundaries are natural, and what information must flow between agents. These assumptions encode a model of cognitive work that may or may not match the actual work.

**Level 3: The interface to human operators.** Any human who monitors, audits, corrects, or collaborates with the agent system is performing cognitive work. The system's outputs, explanations, confidence signals, and escalation triggers either support or hinder that cognitive work — and designers of those outputs almost certainly made assumptions that were wrong in some contexts.

**Level 4: The domain being addressed.** When an agent system is deployed to support, say, security auditing or medical diagnosis or mission planning, the domain itself has cognitive structure — expert practitioners have developed tacit knowledge, heuristics, and decision patterns that represent the accumulated wisdom of the field. A system that ignores this structure will produce outputs that are technically correct but pragmatically useless, or worse, actively misleading.

## The Two Failure Modes

The paper implicitly describes two distinct failure modes when cognitive requirements remain invisible:

**Failure Mode 1: The Rejected System.** The system is built, deployed, and then abandoned because workers find it more hindrance than help. The Cedars-Sinai physician order entry system is the authors' primary example: "After just a few days of use, however, doctors complained of problems ordering medications, tests, and supplies and the hospital took the software offline." The FBI TRILOGY system was cancelled after $170 million in development because it was "flawed and unfixable" — discovered only during testing, never deployed at all. These failures are visible and costly, but they at least produce a clear signal.

**Failure Mode 2: The System That Looks Like It Works.** More dangerous is the system that is used but that subtly degrades the cognitive performance of its users — creating automation surprises (Sarter, Woods, and Billings, 1997), increasing error rates in edge cases, or training users into dependency patterns that fail catastrophically when the system is unavailable or wrong. This failure mode is nearly impossible to detect without deliberate CSE-style analysis because it doesn't produce a visible crisis.

For agent systems, the equivalent of Failure Mode 2 is an orchestration pipeline that handles common cases well but systematically fails on the cases that matter most — the edge cases, the high-stakes decisions, the situations that require genuine expert judgment rather than pattern matching. These are precisely the situations where invisible cognitive requirements are most consequential.

## Making the Invisible Visible: CSE Methods as Diagnostic Tools

The paper describes a family of methods developed specifically to surface cognitive requirements:

**Cognitive Task Analysis (CTA)**, particularly the Critical Decision Method, elicits knowledge about challenging situations from expert practitioners. The key insight is that challenging situations — near-misses, unusual cases, the decisions that kept an expert up at night — are where the cognitive structure of expertise becomes visible. Routine situations compress expertise into automaticity; hard cases expose the underlying reasoning.

**Cognitive Work Analysis** examines the functional structure of work and the constraints within which workers must operate, independent of how any particular practitioner happens to approach the work. This produces a model of the *work system* rather than the *worker* — valuable for understanding what any competent practitioner must be able to do, regardless of individual differences in approach.

**Applied Cognitive Work Analysis** extends these products directly into design artifacts — "steps and corresponding artifacts to transform the cognitive demands of a complex work domain into graphical elements of an interface."

For agent system design, the translation of these methods suggests several concrete practices:

1. **Before defining agent skills, interview domain experts about their hardest cases.** What decisions do they find genuinely difficult? What information do they wish they had? Where do they most often find their initial assessment was wrong? The answers define the cognitive requirements that agent skills must support.

2. **Treat skill failures as diagnostics, not defects.** When an agent skill produces a wrong or unhelpful output, the first question should not be "how do we fix this skill?" but "what does this failure reveal about our model of the work this skill is supposed to support?"

3. **Map the constraint structure of the domain, not just the task sequence.** What are the hard limits within which any solution must operate? What are the competing goals that create genuine tradeoffs? This constraint map should drive agent design at least as much as any procedural task description.

4. **Distinguish between what experts say they do and what they actually do.** CTA methodology exists precisely because expert practitioners are often poor narrators of their own cognitive processes. Verbal protocols, observation, and incident analysis all converge on a more accurate model than self-report alone.

## The Boundary Condition

This principle applies most strongly when:
- The work being supported is genuinely cognitively complex (high uncertainty, time pressure, competing goals, expert judgment required)
- The practitioners who will work with the system have developed real domain expertise
- The cost of errors is high
- The system will be used in conditions that differ from those imagined during design

It applies less strongly when:
- The task is genuinely procedural and well-defined
- The domain is fully formalized (pure mathematics, rule-following)
- The system replaces rather than supports human judgment

For WinDAGs specifically: the 180+ skill ecosystem almost certainly contains skills whose design assumptions are wrong or incomplete for at least some invocation contexts. The question is not whether this is true but how to find it — and the CSE answer is: look for the failures, especially the subtle ones, and treat them as the most valuable design information you have.
```

### FILE: design-as-dialog-not-pipeline.md
```markdown
# Design as Dialog: Why Iterative Discovery Beats Sequential Process in Complex Systems

## The Pedagogical Lie

Every formal design methodology presents itself as a sequence of steps. Requirements analysis, then architecture, then implementation, then testing, then deployment. The waterfall. The V-model. Even the spiral model with its iterative loops retains the fiction that each loop completes cleanly before the next begins. Systems engineering frameworks like SIMILAR (State the Problem → Investigate Alternatives → Model the System → Integrate → Launch → Assess → Reevaluate) depict design as a process you can point to on a flowchart.

Militello et al. are explicit that this is a useful fiction that becomes actively harmful when taken too seriously: "Descriptions of approaches are typically pedagogical rather than accurate. In order to communicate how CSE occurs and where it adds value, the design process is often oversimplified as a sequential, stepwise process. In fact, design rarely occurs this way, in part due to pragmatic constraints. Real world issues such as access to information, resources, and experts force project teams to work in a somewhat opportunistic and generally iterative manner."

But the critique goes further than mere pragmatics. The authors argue that the sequential ideal is not even desirable: "We doubt that the sequential, stepwise design process is even a desirable goal. Instead, design should be considered a dialog wherein opportunism and iteration is beneficial. While a stepwise process adds value and efficiency when solving familiar problems, design problems by their very nature are generally not familiar, but require fresh perspectives and innovation. Novel problems require exploration and discovery—processes that are stubbornly incompatible with approaches that rely solely on rigorous and systematic methods."

This is a strong claim. It says that the attempt to fully formalize design is not just impractical but *counterproductive* — that it actively suppresses the discovery and innovation that hard problems require.

## What Dialog Means in Design

The paper proposes replacing the sequential flow model with a "wheel" representation that makes the dialogic nature of design explicit. The key properties of design-as-dialog are:

**Continuous re-evaluation of the problem statement.** "Anywhere in the process, as new information becomes available and the world changes, our understanding of the problem and/or the potential solutions may change. At any point, we may reframe the problem, consider a new solution, or discover potential repercussions not previously considered." The problem is not fixed at the beginning and solved at the end — it is continuously refined as understanding deepens.

**Calibration against an evolving understanding of the work environment.** "The design team continually works to calibrate design activities with an understanding of worker needs, customer needs, available technologies, limitations, tradeoffs, and priorities." This calibration is not a one-time requirement-gathering exercise but an ongoing empirical process.

**Opportunism as a feature, not a bug.** "This figure is also intended to convey the notion that design is a variable process that, to an observer, may seem opportunistic and fragmented. For example, it is commonly proposed that design specifications flow from the products of analysis, but, in our work, specifications continue to emerge as the design is being prototyped or fabricated." The appearance of disorder is the signature of genuine engagement with a hard problem.

**Distributed and social.** "It is a distributed dialog that continues throughout the life of the design project." Design knowledge is not centralized in one person or one phase — it is distributed across practitioners, users, domain experts, and the system itself as it is progressively built and tested.

## The Case Study Evidence

The three case studies in the paper each illustrate a different dimension of design-as-dialog:

**Global Weather Management (Air Mobility Command):** The dialog revealed that the real cognitive challenge was not individual decision support for either flight managers *or* weather forecasters but *collaboration and information sharing between them*. No amount of requirements analysis conducted before observation would have produced this insight — it emerged from direct engagement with the work. Even after fielding, the dialog continued: follow-up observations revealed that "the work itself had changed, including goals and priorities, scale of operations, the organizational structure, the complexity of problems" — prompting a search for design features that would allow end users to "finish the design" as conditions continued to evolve.

**Landmine Detection:** Here the dialog occurred at the level of problem framing. The initial problem was poor detection rates with new equipment. The CSE contribution was recognizing that some operators had achieved >90% detection rates — which meant the problem was not the equipment but the training. The dialog between cognitive modeling and design produced a training curriculum organized around the expert's goal structure, with detection rate as the primary learning measure.

**Nuclear Power Plant Emergency Operations:** The most dramatic example. Plant managers believed the problem was too much workload and too few staff. They proposed adding technology and increasing headcount. The CSE dialog produced a completely different problem statement: poorly defined roles, key decision makers making no decisions, the emergency director as bottleneck, a facility layout that inhibited coordination. The solution involved zero new technology and reduced staff from 80+ to 35. "Thus, referring to the first step of the SIMILAR model, one might say that the plant had an inadequate statement of the problem." The dialog did not improve the solution to the original problem — it replaced the original problem with the actual problem.

## The Danger of Premature Closure

The contrast between design-as-dialog and design-as-pipeline has a specific failure mode: **premature closure on a problem framing that is wrong.** 

When a sequential design process commits to a problem statement in Phase 1 and then executes Phases 2 through N without re-evaluating that statement, it builds an increasingly elaborate and expensive solution to a problem that may have been incorrectly framed from the start. The TRILOGY and Cedars-Sinai cases represent $170 million and millions of dollars respectively invested in solving the wrong problem — or solving the right problem in a way that ignored cognitive requirements until it was too late to recover.

The CSE framework explicitly names this risk: "Without CSE, the design process can be fixated on a narrow set of procedures that make it look like the technology will be very helpful. It is easy to assume that if the worker follows a set of simple, prescribed steps, then the system will operate smoothly and safely."

## Translating Design-as-Dialog to Agent System Architecture

For a multi-agent orchestration system, design-as-dialog has direct architectural implications:

**Agent pipelines should be designed for re-entry, not just forward progress.** A system designed as a linear pipeline — decompose, execute, synthesize — has no mechanism for the discovery that the initial decomposition was wrong. An architecture that supports design-as-dialog includes explicit mechanisms for problem reframing: a step where agents can signal that the decomposition structure needs revision, that the problem statement received was inadequate, or that intermediate results have changed what the final question should be.

**Problem statements should be treated as hypotheses, not specifications.** When an orchestrator receives a complex task, the initial framing of that task is a hypothesis about what problem needs to be solved. The architecture should support iterative refinement of that hypothesis as subagents surface new information. This is different from simply executing against a fixed specification.

**Intermediate outputs should feed back to the orchestrator, not just forward to the next agent.** In a dialog model, information produced at any stage can change understanding at any other stage. The architecture should support bidirectional information flow, not just a single downstream cascade.

**Distinguish between known problems and novel problems.** The paper explicitly notes that sequential stepwise processes add value when solving *familiar* problems. An orchestration system can profitably maintain both modes: a more rigid execution path for well-understood problem classes, and a more exploratory, iterative dialog mode for genuinely novel problems. The skill of distinguishing between these two modes — recognizing when a problem that *looks* familiar is actually novel in ways that matter — is itself a high-value capability.

**Build in mechanisms for "finishing the design."** The Global Weather Management case explicitly noted the need for features that would allow end users to adapt the system to changing conditions. For agent systems, this translates to architectures that expose their assumptions — what constraints am I operating under? what did I assume about the problem structure? — so that human operators and successive iterations can refine those assumptions rather than being locked into them.

## The Formalization Paradox

There is a genuine tension here that the paper does not fully resolve: complex systems require some formalization to be tractable, but excessive formalization suppresses the discovery and adaptation that complex problems require. 

The paper's practical resolution is that CSE provides a *focus* — a coherent set of constructs and concerns (worker needs, expertise, cognitive demands, constraints, goals) — that guides an inherently opportunistic process without turning it into a rigid procedure. The framework orients the dialog without dictating its content or sequence.

For agent system design, the analogous resolution is: maintain a clear understanding of *what you are trying to support* (the cognitive work of whoever or whatever consumes the system's outputs) while holding the *how* loosely enough to revise it as understanding deepens. The goal is fixed; the path to it is discovered.
```

### FILE: problem-reframing-as-highest-leverage-intervention.md
```markdown
# Problem Reframing: The Most Valuable Thing a Cognitive Analysis Can Do

## The Counterintuitive Insight

The most expensive part of solving a problem is usually the execution: building, testing, deploying, maintaining. The cheapest part is the problem statement — it costs almost nothing to write a sentence describing what needs to be fixed. 

This asymmetry makes the cost of a wrong problem statement enormous. Solving the wrong problem efficiently is not a success; it is a failure that consumed all the resources of a success while producing none of its benefits.

Militello et al. argue that the highest-leverage contribution Cognitive Systems Engineering makes to design is frequently not better solutions to stated problems but *better problem statements* — recognizing that the problem as initially framed is incorrect, incomplete, or shaped by assumptions that don't survive contact with how work actually occurs.

The authors describe this across multiple case studies, but the nuclear power plant case is the most striking illustration of the principle in pure form.

## The Nuclear Plant Case: A Study in Reframing

A nuclear power plant had experienced an adverse event requiring an unplanned shutdown. The Nuclear Regulatory Commission was preparing to require the plant to conduct two formal drills per year instead of one — an additional cost of millions of dollars. Plant managers believed they understood the problem: "During the adverse event workload had been extremely high. Therefore, they anticipated that additional information technologies combined with additional staff members could be introduced to reduce the workload."

This is a reasonable inference. High workload during an adverse event → need more resources to handle that workload. It is also completely wrong.

A CSE study combining Critical Decision Method interviews with observation of drills produced a different set of findings:

- "The emergency response team had poorly defined roles and functions."
- "Most of the key decision makers were not making any decisions at all, and some were irrelevant to emergency responses."
- "The emergency director was a bottleneck."
- "The layout of the Emergency Response Facility was inefficient."
- "The staff size was too high, not too low."

The problem was not insufficient resources. The problem was that the existing resources were structured in a way that created coordination failures, decision bottlenecks, and cognitive overload in exactly the wrong places. Adding more people and technology to a system with those structural problems would have made them worse.

The reframing enabled a completely different solution space: "Rather than adding information technology and increasing staffing levels, positions within the facility were rearranged so that people were grouped by coordination requirements. A simple status board was established to improve situation awareness. Staff size was reduced from 80+ down to 35. Approximately 50 recommendations were made involving staff, facility, and procedures; none of them involved information technologies."

The result: the plant scored extremely well on its official exercise, was removed from the watch list, and saved millions of dollars in avoided drill costs. The solution was simpler, cheaper, and more effective than anything the original problem framing could have generated — because the original problem framing was wrong.

## Why Problem Statements Are Usually Wrong

The paper offers an implicit theory of why initial problem statements fail in cognitively complex domains:

**They are based on observable symptoms, not underlying causes.** High workload during an adverse event is observable. Poorly defined roles and a bottlenecked emergency director are much harder to see from the outside, and invisible to managers who are not present during the event.

**They reflect the solution space that is already familiar.** Plant managers who know about information technology and staffing levels naturally frame problems in terms of information technology and staffing levels. The CSE observation is that domain experts often have a rich solution repertoire that shapes how they see problems — they find the problems that their tools can solve.

**They are formed before the cognitive requirements of the work are understood.** Without a model of how the emergency response team actually thinks and coordinates under stress, there is no way to see that the bottleneck is the emergency director's decision process rather than the information available to that director.

**They reflect a normative model of how work *should* happen rather than how it *does* happen.** Plant managers presumably had an organizational chart and a set of defined procedures. The problem statement was formed in relation to that normative model. The CSE investigation revealed that the normative model bore little relationship to actual cognitive and coordinative demands during an emergency.

## The Pattern Across Case Studies

The pattern repeats across the three case studies in the paper, each revealing a different dimension of wrong problem framing:

**Global Weather Management:** The initial problem framing was likely something like "flight managers need better decision support." The reframing was: "flight managers and weather forecasters have a collaboration and information-sharing problem that neither can solve independently." The solution — a shared geographic display with intelligent alerts — would not have emerged from the original framing.

**Landmine Detection:** The initial problem framing was "detection rates are unacceptably low with new equipment." The reframing was: "some operators have achieved >90% detection rates using the same equipment, which means this is a training problem, not an equipment problem, and we can build training around the cognitive model of high performers." The original framing would have generated equipment redesign or procurement. The reframing generated a training curriculum.

**Nuclear Power Plant:** As described above — the problem was structural and coordinative, not resource-level.

In each case, the reframing was made possible by CSE investigation: direct contact with how the work actually occurs, using methods designed to surface cognitive requirements rather than validate assumed ones.

## The Mechanism: Errors as Diagnostic Signals

The paper offers an important methodological note about how reframings are found: "CSE does not impose a formal normative theory of how people think (or 'should' think). Instead, the study of each work domain involves a process of discovery, wherein errors are considered interesting openings for further inquiry. Errors can often be traced to misleading information technology, contradictory processes, or competing goals."

This is a philosophically important stance. In most engineering frameworks, errors are defects — deviations from correct function that must be identified and eliminated. In CSE, errors are *diagnostic signals* that reveal where the system's model of work diverges from work's actual structure. An operator who makes an error is not failing to follow the procedure; the operator's error is evidence that the procedure does not match the actual cognitive demands of the situation.

For agent systems, this translates directly: when an agent produces an incorrect or unhelpful output, the first analytical question should not be "how do we make this agent output the right answer?" but "what does this failure tell us about our model of what the agent is being asked to do?" The error is information about the problem, not just a performance gap in the solution.

## Applying Problem Reframing to Agent System Design

**Principle 1: Treat the initial task specification as a hypothesis.** When a WinDAGs orchestrator receives a complex task, that task description represents the requestor's model of what needs to be done. That model may be wrong — it may describe symptoms rather than causes, may frame the problem in terms of familiar solutions, or may be based on a normative understanding of how the domain works that doesn't match actual cognitive demands. The system should be designed to test and potentially revise that specification, not just execute against it.

**Principle 2: Include a problem-framing phase before decomposition.** Before decomposing a complex problem into sub-tasks for specialized agents, include an explicit phase that interrogates the problem statement: Is this the right question? What are the assumptions embedded in this framing? Are there observable symptoms here that suggest a different underlying structure? This is not the same as task decomposition — it is a prior step that determines whether the decomposition is pointed in the right direction.

**Principle 3: Build in mechanisms for agents to surface alternative framings.** Agents executing sub-tasks sometimes encounter evidence that the original framing was wrong. A debugging agent might find that the bug report misidentifies the faulty component. A research agent might find that the question as asked assumes a false premise. The architecture should make it easy for agents to surface these reframings rather than forcing them to work within a fixed specification.

**Principle 4: Distinguish between "we solved the wrong problem" and "we solved the right problem badly."** Both are failure modes, but they require completely different responses. An agent system that can distinguish between them — that can recognize when intermediate results suggest a fundamentally different problem structure rather than just a performance shortfall — is far more capable than one that only measures progress toward a fixed goal.

**Principle 5: Invest in post-hoc analysis of cases where the solution was technically correct but practically useless.** These cases are the richest source of information about wrong problem framing. They represent situations where the system executed well against its specification and the specification was wrong. Systematically analyzing these cases — what was the stated problem, what was the actual problem, where did the divergence occur — is how problem-framing capability improves over time.

## The Cost of Not Reframing

The paper's implicit argument is that the cost of not reframing — of committing to a wrong problem statement and executing it efficiently — is enormous. The $170 million TRILOGY case and the Cedars-Sinai physician order entry system are monuments to this cost. But the more common failure is less dramatic: systems that are built, deployed, used reluctantly, and eventually abandoned because they solve a problem that turns out to be less important than the one they don't solve.

For agent systems that aspire to handle genuinely complex problems, the ability to reframe problems is not an optional enhancement — it is a core capability. The difference between an agent system that helps and one that doesn't is often not the quality of execution within a fixed framing but the quality of the framing itself.
```

### FILE: joint-cognitive-systems-distributed-cognition.md
```markdown
# Joint Cognitive Systems: Why Complex Cognition Is Always Distributed

## Beyond the Single Agent Assumption

The dominant mental model for AI systems — and for a great deal of cognitive science — is the single intelligent agent: one reasoner, one knowledge base, one decision process, one output. This mental model is wrong for almost all interesting problems, and the field of Cognitive Systems Engineering was partly built on recognizing its inadequacy.

Militello et al. ground their entire framework in what Hollnagel and Woods call the "joint cognitive system": "In a single term, the agenda of CSE is how can we design joint cognitive systems so they can effectively control the situations where they have to function." The word "joint" is doing enormous work here. It signals that cognition — real problem-solving cognition in complex domains — is not performed by isolated individuals but by systems of agents (human and technological) whose cognitive work is deeply interdependent.

The paper's definition of cognitive complexity reflects this: "These activities [identifying, judging, attending, perceiving, remembering, reasoning, deciding, problem solving, and planning] rarely reside in one individual, but instead often happen in the context of teams, as well as within human-technology interactions. This distributed and large-scale collaboration between humans and interaction with technology has been referred to as a sociotechnical system, highlighting the notion that the humans, the technologies, and the larger system are highly interdependent and are linked by human social processes of collaboration and shared goals."

This is not a philosophical abstraction. It has direct architectural implications for how AI agent systems should be designed.

## What the Joint Cognitive System Actually Contains

The sociotechnical system that performs cognitive work includes at minimum:

**Human practitioners** with domain expertise, tacit knowledge, and developed perceptual and decision skills. These practitioners are not the users of the system in a passive sense — they are cognitive participants whose knowledge and judgment are part of the system's total cognitive capacity.

**Technological artifacts** — tools, displays, databases, communication systems — that extend, augment, or replace aspects of human cognitive work. These artifacts are not neutral conduits for information; their design choices actively shape what information is salient, what patterns are visible, what actions are easy or hard.

**Organizational structures** — role definitions, authority relationships, communication channels, procedures — that coordinate the cognitive work of multiple practitioners and distribute responsibility across the system.

**Physical workspace configurations** that either enable or impede the coordination and information sharing that joint cognitive work requires. The nuclear plant case is the clearest example: rearranging physical positions to group people by coordination requirements was one of the most important interventions.

**The work itself** — the domain with its intrinsic structure, constraints, goals, and the situations that arise within it. Work is not simply assigned to the system; the domain generates demands that the system must be capable of meeting.

All five components interact continuously. A change in any one of them changes the cognitive demands on all the others. This is why the paper insists that CSE addresses not a specific technology but "the design of technology, training, and processes intended to manage cognitive complexity in sociotechnical systems" — because effective cognitive support requires attending to the entire system, not just the technology component.

## The Global Weather Management Case: Joint Cognition in Action

The Global Weather Management case is the paper's clearest illustration of joint cognitive system design. The initial problem framing was likely something like: "flight managers need decision support for weather-affected mission planning." This frames the cognitive work as residing in a single role (the flight manager) and a single cognitive task (deciding how to handle weather impacts on missions).

The CSE investigation revealed that the actual cognitive work was distributed across *two* roles — flight managers and weather forecasters — who needed to integrate complementary knowledge to produce actionable situational understanding. Neither role had all the information needed; neither could perform the cognitive work independently; the quality of their joint output depended critically on how well they could share and integrate their respective knowledge.

The design response accordingly targeted the *interface between* the two roles: "the research team focused on designing a technology that would serve as an information-sharing and collaboration tool for both flight managers and weather forecasters." The geographic display with mission and weather information overlaid was not a tool for either individual — it was a tool for the joint cognitive system, supporting the coordination and integration that neither could do alone.

This reorientation — from designing for individual cognitive work to designing for joint cognitive work — is one of the most practically important contributions of the CSE framework.

## Situation Awareness as a Joint System Property

The paper traces situation awareness research from its origins in WWI fighter pilots to its modern applications in complex automated systems. The early definition captures the distributed nature of the challenge: "the pilot's need to observe the opponent's current move and anticipate the opponent's next move a fraction of a second before the opponent could observe and anticipate one's own."

What makes this definition interesting for joint cognitive system design is that it frames situation awareness as fundamentally relational and competitive: you need to know not just the state of the situation but what *other agents* in the situation know and what they are likely to do based on that knowledge. This is not a property of one agent's information processing — it is a property of the interaction between agents in a shared situation.

When advanced cockpit automation "brought increased potential for information overload," the CSE response was to design for situation awareness as a system property — ensuring that the human-machine joint cognitive system maintained adequate shared situational understanding, not just that the automation had accurate data.

For multi-agent AI systems, situation awareness as a joint property means: what does each agent in the system know? What does it *not* know? What assumptions is it making that other agents might correct? Where are the gaps between what the system as a whole knows and what any individual agent can access? These are not questions about individual agent performance — they are questions about the cognitive architecture of the joint system.

## Coordination and Information Flow as Design Variables

The paper's Work-Centered Design framework emerged specifically from observing "stove-piped technologies within large military socio-technical systems" where "multiple databases, collaborative systems, and decision support systems... used different interface design conventions. This lack of a unifying structure resulted in unneeded complexity and increased likelihood of error as users were required to maintain expertise not only in the content area of the job... but also in how to use a broad range of technological interfaces."

This is a systems-level failure: individually functional components that collectively degrade the performance of the joint cognitive system because they do not share a coherent information architecture. The cognitive cost of navigating interface heterogeneity is real and cumulative — it consumes cognitive resources that should be available for the actual work.

The Work-Centered Design response is a "First-Person Perspective principle suggesting that the worker's terminology should be used as information elements in the interface display" — creating a unified vocabulary that spans the components of the system and reduces the translation cost that practitioners otherwise bear.

For AI agent systems, the analogous design challenge is ensuring that the 180+ skills in a system like WinDAGs share coherent representations, vocabulary, and information formats — not just technically but cognitively. When one agent produces an output that another agent must consume, the question is not only whether the data is technically compatible but whether it carries the semantic structure that the receiving agent needs to use it effectively. Stove-piped AI skills that use different internal representations and produce outputs in incompatible formats impose the same kind of cognitive coordination cost on the orchestration layer that incompatible military systems imposed on human operators.

## Designing Automated Systems as Team Players

The paper references Christoffersen and Woods's work on "strategies for making automated systems team players." This framing is crucial: in a joint cognitive system, automation is not a replacement for human cognitive work but a *participant* in the joint system — a participant that has specific capabilities, specific limitations, specific knowledge, and specific failure modes that the other participants (human and technological) must be able to anticipate and work with.

An automated system that is *not* a good team player is one that:
- Takes action without making its reasoning visible to other system participants
- Fails in ways that are surprising and non-diagnostic (automation surprises)
- Does not signal its own uncertainty or confidence level
- Cannot be effectively monitored or overridden by human participants
- Assumes competencies that other system participants do not actually have

An automated system that *is* a good team player:
- Makes its actions and reasoning visible to other participants
- Fails gracefully and informatively — failures signal what went wrong and why
- Communicates confidence and uncertainty as part of its outputs
- Supports human monitoring and intervention at appropriate granularity
- Takes into account the cognitive state and workload of the other participants it is coordinating with

This framework applies directly to agent orchestration: each agent in a WinDAGs system is a participant in a joint cognitive system, and the quality of the system as a whole depends on how well each agent supports the cognitive work of the agents and humans it coordinates with — not just on how well each agent performs its own task.

## Implications for Multi-Agent Orchestration

**Implication 1: Design for the joint system, not for individual agents.** The performance metrics that matter are system-level cognitive outcomes: does the system as a whole maintain adequate situational understanding? Does it coordinate effectively? Does it produce outputs that human operators can use? These cannot be inferred from individual agent performance alone.

**Implication 2: Coordination is cognitive work, not overhead.** The tendency to treat coordination between agents as a logistical problem (routing, scheduling, interface formats) rather than a cognitive problem (shared understanding, joint situation awareness, distributed knowledge integration) underestimates the cognitive demands of multi-agent work and produces systems that coordinate efficiently in nominal cases but fail catastrophically in complex ones.

**Implication 3: Information flow should be designed around cognitive needs, not technical convenience.** What information does each agent need from other agents to perform its cognitive work? What is the minimal representation that preserves the information needed while reducing the translation cost? These questions should drive interface design between agents, not just technical compatibility.

**Implication 4: The human-AI interface is part of the joint cognitive system.** Human operators who monitor, audit, or collaborate with the agent system are participants in the joint cognitive system. Their cognitive needs — for situation awareness, for appropriate confidence signals, for ability to intervene effectively — are design requirements for the system, not add-ons.

**Implication 5: Model the joint system's failure modes, not just individual agent failures.** A joint cognitive system can fail in ways that no individual component fails — through coordination breakdown, through gaps in shared understanding, through automation surprises that emerge at the interfaces between components. Failure mode analysis must be conducted at the system level.
```

### FILE: expertise-recognition-and-tacit-knowledge.md
```markdown
# Expertise, Tacit Knowledge, and the Recognition-Primed Decision Model

## The Expert Problem

Experts are the gold standard for cognitive performance in complex domains. When we want to know how to detect landmines effectively, or how to manage a nuclear plant emergency, or how to coordinate weather and flight information for airlift missions, we look at what experts do. But experts are famously poor at explaining what they do. Expertise is characterized by fluency — actions that have been performed thousands of times become automatic, and the cognitive processes underlying them become inaccessible to conscious reflection and verbal report.

This creates a fundamental design problem. The knowledge that most needs to be understood and supported — the expert knowledge that separates excellent performance from adequate performance — is the knowledge least available through conventional inquiry methods. Ask an expert what they do, and they will give you a simplified, proceduralized account that describes the surface of their performance while leaving the cognitive substance invisible.

Gary Klein (one of the paper's four authors, and the founder of the Naturalistic Decision Making field) developed the Recognition-Primed Decision (RPD) model specifically to characterize how experts actually make decisions under real-world conditions of time pressure, uncertainty, and high stakes. The paper references this model implicitly throughout, and the methodologies described — particularly the Critical Decision Method — were developed to make expert knowledge accessible for design purposes.

## What the RPD Model Reveals

The RPD model was developed following research conducted after the 1988 shoot-down of Iran Air Flight 655 by the USS Vincennes. The Tactical Decision Making Under Stress (TADMUS) program "better understand how such an incident had occurred and how to avoid similar incidents in the future." The research revealed that expert decision-making under stress does not look like classical decision theory predicts.

Classical decision theory assumes that decision-makers:
1. Identify all relevant options
2. Evaluate each option against relevant criteria
3. Select the option with the highest expected utility

Expert decision-makers under time pressure do not do this. Instead, they:
1. Recognize the current situation as an instance of a familiar type
2. Access a pattern-matched response associated with that situation type
3. Mentally simulate the response to check for obvious problems
4. If the simulation succeeds, execute the response; if not, modify it or try another

This is recognition-primed decision-making: the expert's primary cognitive work is *recognition*, not *comparison*. The question is not "which option is best?" but "what kind of situation is this, and what does this kind of situation call for?"

The implications are profound. Expertise resides primarily in a rich library of situation-type patterns, developed through extensive experience, that allows rapid and accurate recognition and appropriate response. The expert does not reason from first principles every time — they pattern-match to accumulated knowledge, then verify and adjust.

## Why This Matters for System Design

The RPD model has several critical implications for how systems should be designed to support expert work:

**Support recognition, not just analysis.** If experts primarily work through recognition, then decision support systems that present options for comparative analysis are misaligned with how expertise actually works. What experts need is systems that enhance their ability to recognize situation types accurately — systems that provide the right cues at the right time to support pattern matching, not systems that perform the pattern-matching work on behalf of experts and present a ranked list of options.

**Cues are the critical information.** Pattern recognition is triggered by cues — specific features of the situation that indicate what type of situation it is. Experts have developed finely tuned perceptual discrimination: they attend to specific cues that novices either don't notice or don't know to prioritize. Design for expert cognition means identifying which cues matter, ensuring those cues are salient, and not obscuring them with information that is less relevant.

**Mental simulation is part of the decision process.** Experts don't just recognize situations — they mentally simulate proposed responses to check for problems. Design can support this by providing information that enables better mental simulation: what are the likely consequences of this action? What could go wrong? What does the system's current state suggest about how this action will play out?

**Experts are often unaware of their own expertise.** This is the critical methodological problem. The knowledge that drives expert recognition is tacit — it is not verbally available, it does not appear in procedure manuals, and it cannot be elicited by asking experts to describe their decision process. The Critical Decision Method addresses this by:
- Eliciting specific past incidents (especially challenging or unusual ones)
- Working through those incidents in detail, asking about cues, options, and reasoning
- Probing for what made the situation seem like a particular type
- Identifying moments where expertise was most engaged

The landmine detection case illustrates this methodology and its payoff: "Staszewski [2004], a cognitive scientist with a background in expertise studies, noted that although performance was generally poor with the newer low metal content mine detection equipment, a few operators had detection rates over 90%. Armed with the knowledge that some had developed expertise using the new equipment, Staszewski hypothesized that improved training incorporating CSE principles could be used to close the performance gap." The path to closing the gap was analyzing expert performance and building training around the cognitive model of high performers — using expert knowledge to bootstrap novice development.

## Expert Models as Design Blueprints

The paper describes a general principle that Staszewski made explicit: "Models of expertise as blueprints for cognitive engineering." If you can construct an accurate model of how experts perceive, reason, and decide in a domain, you have a blueprint for what any system that supports work in that domain must provide.

This principle grounds the training design in the landmine case:
- "Training content and organization were driven by the expert model."
- "Instruction and tasks were organized hierarchically, using the expert's goal structure."
- "Instruction and training began with part-tasks and evolved into integrated subskills."

The expert model is not just descriptive — it is prescriptive for design. It tells you what cognitive capacities must be supported, what the hierarchy of goals looks like, and what the sequence of skill development should be.

The same logic applies beyond training to tool design: if experts primarily attend to certain cues to recognize situation types, the display should make those cues prominent. If experts use mental simulation to evaluate potential actions, the system should provide information that supports accurate simulation. If expert judgment integrates information across multiple sources in specific ways, the information architecture should facilitate that integration.

## The Gap Between Knowing and Doing

The paper touches on what is perhaps the deepest problem in cognitive systems engineering: the gap between knowing that expertise exists and actually capturing it for design purposes. This is not merely a methodological challenge — it reflects something fundamental about the nature of tacit knowledge.

Polanyi's formulation (referenced implicitly throughout CSE literature) is that "we know more than we can tell." Expert practitioners have genuine knowledge — they consistently perform at levels that cannot be explained by chance — but that knowledge is embedded in patterns of perception and action that resist verbal articulation. An expert landmine detector cannot tell you exactly what combinations of signals led them to flag a particular location; they just know. An experienced emergency room nurse cannot fully explain why they had a bad feeling about a patient who looked fine — they just had it, and they were right.

Forcing this knowledge into verbal form produces distorted accounts — typically accounts that describe the official procedure rather than the actual cognitive process, or that describe the last instance recalled rather than the general pattern, or that substitute plausible rationalization for actual reasoning.

The Critical Decision Method is designed to work around this distortion by:
1. Focusing on specific incidents rather than general descriptions
2. Working through incidents retrospectively with prompts designed to surface cues and reasoning
3. Using multiple incidents to identify patterns that transcend individual cases
4. Checking reconstructed accounts against behavior observed in other cases

For AI agent system design, the implication is: never rely solely on documented procedures or stated requirements to define what an agent skill should do. The documented procedure captures the official model of the work, not the cognitive reality. The actual cognitive requirements — the cues, the recognition patterns, the judgment calls, the mental simulation steps — are embedded in expert practice and must be surfaced through deliberate investigation.

## What Makes Expertise Transferable (and What Doesn't)

The paper's case studies suggest that expertise is most effectively transferred when:
- The transfer targets specific cognitive skills (recognition patterns, cue weighting) rather than general knowledge
- Training is organized around the goal structure of expert performance
- Part-tasks are practiced before integration (building toward the expert's coherent pattern)
- Ample practice with feedback closes the gap between novice pattern recognition and expert pattern recognition

What does *not* transfer expertise:
- Descriptions of procedures that don't include the perceptual and cognitive substrate
- Training on nominal cases when expertise is primarily exercised in unusual ones
- Knowledge representation that captures what experts know declaratively but not how they apply it situationally
- Performance metrics that measure outputs (task completion) without probing the cognitive processes that produced them

For AI agents that aspire to expert-level performance: the design challenge is not building a repository of domain facts but building systems that capture and apply the recognition patterns, cue weightings, and situational judgment of expert practitioners. Retrieval-augmented systems that surface relevant facts are not enough — what is needed is the cognitive architecture that tells you which facts are relevant in which situations and what to do with them.

## Connecting to WinDAGs Skill Design

For a 180+ skill ecosystem:

**Each skill should be grounded in a model of expert cognitive performance in the relevant task domain.** Not just: "what does this task require?" but "how do expert practitioners actually approach this task, what cues do they use, what recognition patterns are most important, where does novice performance fail relative to expert performance?"

**Skills should be designed to support the recognition-evaluation cycle, not replace it.** The goal is not to automate expert judgment but to provide the information substrate that enables accurate recognition and effective evaluation.

**Skill failures should be analyzed in terms of the expert cognitive model.** When a skill fails, the diagnostic question is: where in the recognition-primed decision cycle did the failure occur? Was it a failure of situation recognition (wrong pattern match)? A failure of cue detection (right pattern, wrong cues attended to)? A failure of mental simulation (correct action but consequences not adequately anticipated)? Each failure type implies a different design response.

**Cross-skill coordination should be designed around cognitive information needs.** When one skill's output feeds another skill's input, the question is: what does the receiving skill need to recognize the situation it's facing and act appropriately? The output format and content should be designed to answer that question.
```

### FILE: failure-modes-in-complex-cognitive-systems.md
```markdown
# Failure Modes in Cognitively Complex Systems: What CSE Warns Against

## The Characteristic Failures

Cognitive Systems Engineering did not emerge from theoretical interest. It emerged from disasters: the Three Mile Island partial core meltdown in 1979 that prompted Cognitive Work Analysis; the USS Vincennes shoot-down of Iran Air Flight 655 in 1988 that prompted Decision-Centered Design and the TADMUS program; a decade of expensive, rejected information technology systems that prompted each of the five major CSE frameworks described in the paper.

Each disaster is a case study in how cognitive failures in complex sociotechnical systems emerge not from incompetence but from systematic mismatches between system design and actual cognitive requirements. Understanding these failure patterns is directly relevant to designing agent systems that avoid them.

The paper's failure taxonomy, assembled from its case studies and references, identifies five primary failure modes. Each has a direct analog in AI agent system design.

---

## Failure Mode 1: Automation Surprises

The paper cites Sarter, Woods, and Billings (1997) on "automation surprises" — situations where automated systems behave in ways their human partners do not expect and cannot predict. The canonical case is advanced aircraft automation that transitions between modes, changes flight parameters, or takes control of the aircraft in response to conditions that the pilot has not noticed or does not fully understand.

Automation surprises emerge when:
- Automated systems take actions that are not directly observable or legible to human partners
- The conditions that trigger automation behaviors are not fully understood by human operators
- The system's internal state (what mode it is in, what it is about to do) is not adequately communicated
- Human operators develop incorrect mental models of automation behavior that are not corrected until failure

The deeper principle is that automation behaves as a *team member* in a joint cognitive system, and any team member whose actions and reasoning are opaque to other team members degrades the performance of the joint system — even if the automation's individual performance is excellent.

**Agent system analog:** An orchestration agent that silently re-routes tasks, escalates or de-escalates priority, or modifies problem decompositions without making those changes visible to monitoring agents or human operators creates automation surprises. An agent that produces confident-looking outputs without signaling uncertainty creates automation surprises. Any component whose behavior under novel conditions cannot be anticipated by the agents and humans it coordinates with is a source of automation surprises waiting to manifest.

Design response: every agent in the system should maintain legibility — its state, its actions, its uncertainty, and its reasoning should be available to other system participants at appropriate granularity. This is not just a monitoring convenience; it is a fundamental requirement for joint cognitive system performance.

---

## Failure Mode 2: The Wrong Problem Statement

The nuclear plant case is the canonical example in this paper, but the phenomenon is general: "Without CSE, the design process can be fixated on a narrow set of procedures that make it look like the technology will be very helpful. It is easy to assume that if the worker follows a set of simple, prescribed steps, then the system will operate smoothly and safely."

This failure mode is insidious because it does not look like a failure during design. The problem statement looks reasonable. The solution is coherently designed to address it. Testing validates that the solution solves the stated problem. Only when the system meets actual work does the mismatch between the stated problem and the actual problem become apparent.

The $170 million TRILOGY case is an instance of this failure mode at maximum scale: a system designed to solve a problem that turned out not to be the actual problem, discovered during testing after full development expenditure.

The paper names the mechanism: "CSE helps designers move beyond a superficial, oversimplified view of the work system to create systems that better support complexity and uncertainty in the real world." The superficial view makes the design look solid; the actual complexity, hidden by normative models and engineering intuitions, is what eventually destroys the design.

**Agent system analog:** An orchestrator that executes against a task specification without interrogating whether that specification correctly describes the actual problem. A skill that optimizes for a metric that is measurable but not actually important. A decomposition strategy that breaks problems along technically convenient boundaries that don't correspond to the natural structure of the domain.

Design response: invest explicitly in problem-framing capability. Build in mechanisms for agents to signal that the stated problem appears to be the wrong problem. Treat task specifications as hypotheses to be tested, not contracts to be executed.

---

## Failure Mode 3: Stove-Piping and Coordination Fragmentation

The Work-Centered Design framework emerged from a specific observed failure pattern at the US Air Force Air Mobility Command: "multiple databases, collaborative systems, and decision support systems, each of which used different interface design conventions. This lack of a unifying structure resulted in unneeded complexity and increased likelihood of error as users were required to maintain expertise not only in the content area of the job... but also in how to use a broad range of technological interfaces."

This is not an interface design problem — it is a joint cognitive system problem. When the components of a system are built independently, each optimized for its own function, the cognitive cost of coordination between components falls on the human operators who must bridge between them. This cognitive overhead is not visible in any component's performance metrics; it accumulates invisibly in operator workload, error rates, and the informal workarounds practitioners develop to manage systems that don't work together.

**Agent system analog:** A 180+ skill ecosystem where each skill was designed independently, uses its own internal representation conventions, produces outputs in formats optimized for its own domain, and has no coherent interface with the other skills it will routinely coordinate with. The orchestration layer then bears the full cognitive cost of translation between incompatible representations — a cost that grows super-linearly with the number of skills that must interact.

Design response: establish shared information architecture standards across skills. Ensure that skills that routinely interact are designed around shared vocabulary and representation conventions. Invest in the orchestration layer's ability to manage between-skill translation, but do not treat this as a sufficient substitute for coherent system-level design.

---

## Failure Mode 4: Overspecification and Rigidity

The paper contains a strong argument against overformalization: "There is an almost universal call for design to be formalized and standardized. We regard that as both unrealistic and as counterproductive. Too much success in that direction will stifle innovation, which is the touchstone of design."

This applies not just to the design process but to the systems being designed. Systems that are overspecified — that assume work follows a well-defined procedure, that the situations they will encounter are within the space of situations anticipated during design — are brittle against the "never ending creativity of humans as they adapt technologies and processes to accomplish work tasks, as well as the many unexpected situations that arise in a changing world."

The paper points to features that would allow end users to "finish the design" as the appropriate response to this failure mode in the Global Weather Management case — building in the flexibility for practitioners to adapt the system to conditions that the designers couldn't fully anticipate.

**Agent system analog:** An orchestration architecture so rigidly specified that it cannot handle problem structures that differ from those encountered during development. A skill library that handles nominal cases well but has no graceful degradation path for cases that fall outside its training distribution. A decomposition strategy that assumes problems have the structure of problems already seen.

Design response: design for adaptability explicitly. Include mechanisms for agents to handle out-of-distribution cases gracefully — signaling uncertainty, seeking clarification, escalating to human judgment, or applying more general-purpose reasoning when specialized skills fail. The system should be more robust to unexpected situations, not less robust, as it encounters more of them.

---

## Failure Mode 5: The Expert Bottleneck

The nuclear plant case reveals this failure mode in its purest form: "The emergency director was a bottleneck." In the original emergency response organization, key decisions were concentrated in a single role, creating a fragility point where the performance of the entire system depended on the cognitive capacity of one person under extreme stress.

This is a structural failure of the joint cognitive system: the system's cognitive architecture created a dependency on a single node that could not scale under load. The solution was redistribution — redefining roles and communication pathways so that cognitive work was distributed more resilience.

**Agent system analog:** An orchestration architecture where all complex reasoning routes through a single agent or a single decision point. A system where one central orchestrator must fully understand every subtask it delegates in order to coordinate them. A skill design where one skill's output is required by all other skills before any can proceed.

Design response: design cognitive architecture for resilience by distributing decision-making capacity across multiple nodes. The orchestrator should not be required to understand every subtask fully — it should be able to coordinate based on interface-level specifications while subtasks are handled autonomously. Critical path analysis of information and decision flow should identify bottlenecks before they manifest as performance failures.

---

## The Meta-Failure: Hindsight Bias in Failure Analysis

The paper contains an important methodological caution that applies to failure analysis generally: Woods et al.'s work on "Behind Human Error: Cognitive Systems, Computers, and Hindsight" (1994) argues that post-hoc failure analysis systematically distorts our understanding of why failures occurred by making the information that would have prevented the failure appear more available than it actually was at the time.

When we analyze a failure after the fact, we know the outcome, and that knowledge makes certain pre-failure signals appear salient and obvious. We ask: why didn't the operators recognize this signal? Why didn't the system catch this error? The question assumes that the operators and system should have been able to recognize a signal that is salient only because we know what it predicted.

For AI agent systems, this means: failure analysis should be conducted in terms of what information was actually available at the time of the failure, not what information was available post-hoc. The question is not "what should the agent have done given everything we now know?" but "given what the agent could have known at the time, in the format it was available, was the failure a reasonable outcome of the information environment?"

This changes the design response. Hindsight-based analysis produces designs that are optimized for the specific failures that have already occurred, often at the cost of the flexibility needed for failures that haven't occurred yet. Information-environment-based analysis produces designs that improve the quality of the information environment — making critical signals more salient, reducing noise, improving situation awareness across the joint system — which addresses a broader class of failures.

---

## Integrated Failure Prevention Framework

The CSE framework, synthesized across these failure modes, suggests several principles for failure-resistant design:

1. **Make system state legible.** Every component of the joint system should be able to understand the state, actions, and reasoning of every other component at the granularity needed for effective coordination.

2. **Invest in problem framing before execution.** The single highest-leverage failure prevention investment is ensuring the problem being solved is the right problem.

3. **Design for the joint system, not just components.** Failure modes that emerge at interfaces between components will not be caught by testing individual components.

4. **Build in adaptability for unanticipated situations.** Systems designed only for anticipated cases are brittle. Graceful degradation and escalation pathways are essential.

5. **Distribute cognitive load and decision-making capacity.** Single points of cognitive failure are as dangerous as single points of technical failure.

6. **Treat errors as diagnostics, not defects.** Every failure contains information about the mismatch between the system's model of work and work's actual structure. Mining that information is a continuous design activity.
```

### FILE: cse-concept-map-for-agent-architecture.md
```markdown
# The CSE Concept Map: A Framework for Organizing Agent System Capabilities

## The Problem of Proliferating Labels

One of the paper's most practically useful contributions is its attempt to bring order to what Hoffman et al. (2002) called "acronym soup" — the proliferation of terms, frameworks, methods, and principles in the CSE field that use similar language to describe different things, or different language to describe similar things.

The authors identify four fundamental confusion sources, each of which has a direct analog in the proliferating landscape of AI agent system capabilities:

1. **Approaches are at different levels of abstraction.** Some are high-level frameworks (how to orient the entire design process), some are methods (specific procedures for gathering information), some are modeling techniques (how to represent cognitive structure), and some are design principles (guidelines for good practice). These categories are not mutually exclusive, but failing to distinguish between them creates confusion about what is being compared.

2. **Approaches come from different traditions with different emphases.** Decision-Centered Design prioritizes expert decision-making; Cognitive Work Analysis prioritizes constraint structure; Situation Awareness-Oriented Design prioritizes perceptual and attentional demands. Different questions drive different answers, even when the questions superficially look similar.

3. **Descriptions are typically pedagogical rather than accurate.** Sequential representations of inherently iterative processes make them more comprehensible but less truthful — and can actively mislead practitioners who take them too literally.

4. **Categories are not disjoint.** A method can be used within multiple frameworks; a principle can inform multiple methods. The landscape is genuinely overlapping, and any representation of it will be a simplification.

The concept map the paper offers is their response: a structured organization of CSE elements into four categories — Frameworks, Methods, Modeling Techniques, and Principles of Good Practice — that clarifies the level of abstraction and purpose of each element while acknowledging that any element can interact with elements in other categories.

## Translating the Concept Map to Agent System Architecture

For a WinDAGs-style multi-agent orchestration system with 180+ skills, the same organizational challenge exists — and the same four-category structure offers a useful organizing framework.

### Category 1: Frameworks (Orienting Philosophies)

In CSE, frameworks "guide the evolution of CSE theory and practice" and shape how methods are applied. They are not procedures — they are lenses that determine what questions are worth asking and what answers count as relevant.

For agent systems, the framework level includes:
- The philosophy of how complex problems should be decomposed (hierarchical? emergent? constraint-based?)
- The theory of how agents should coordinate (centralized orchestration? peer-to-peer negotiation? market mechanisms?)
- The stance on uncertainty (explicit Bayesian reasoning? confidence intervals? hard commitments?)
- The philosophy of failure (fail fast? graceful degradation? human escalation?)
- The theory of expertise (what does expert performance look like, and how should agents be designed relative to it?)

These frameworks are often implicit in system design. Making them explicit — the way the five CSE frameworks are made explicit in the paper — enables meaningful comparison and deliberate choice. A system designed under a "central orchestrator understands all" framework will behave very differently from one designed under a "agents are autonomous specialists that coordinate at interfaces" framework, and the failure modes of each will be characteristically different.

### Category 2: Methods (Procedures for Gathering Information)

In CSE, methods provide "strategies for eliciting and representing core constructs." The Critical Decision Method elicits knowledge through incident-based interviews. Document analysis and semi-structured interviews populate constraint representations. Each method is appropriate for different information needs and different contexts.

For agent systems, the methods level includes:
- Procedures for evaluating skill performance on domain-specific test cases
- Techniques for profiling agent behavior under novel or adversarial inputs
- Methods for analyzing failure modes in multi-agent coordination
- Protocols for knowledge elicitation from domain experts to inform skill design
- Evaluation frameworks for assessing system-level cognitive support (not just individual skill accuracy)

The paper's observation that "the investigator's theoretical stance, or originating community of practice, greatly influences the use of methods" applies here too: the same performance evaluation method will produce different information when applied by someone who believes the primary system goal is accuracy versus someone who believes it is appropriate uncertainty communication.

### Category 3: Modeling Techniques (Representations of Cognitive Structure)

In CSE, modeling techniques are "knowledge representation or work modeling methods intended to aid in mapping patterns or constraints." The abstraction-decomposition matrix represents domain structure at different levels of abstraction. Decision ladders represent the flow between situation assessment and action selection. COGNET models the cognitive aspects of task performance.

For agent systems, the modeling level includes:
- Task decomposition representations (what are the natural subtask boundaries for a given problem class?)
- Agent state models (what information does each agent need to maintain across a multi-step task?)
- Coordination protocols (what is the sequence of information exchange required for two agents to effectively handoff?)
- Uncertainty models (how should confidence be propagated through a multi-step reasoning chain?)
- Domain constraint models (what are the hard and soft constraints that any solution must satisfy?)

The paper makes an important methodological point about modeling techniques: "When used in a Cognitive Work Analysis context, the Critical Decision Method might be used to uncover constraints or map decision processes... rather than the expert decision process." The same method, used to populate different models, produces different artifacts that answer different design questions. The model drives the method's use.

For agent systems, this means: before designing how to evaluate agents, clarify what model the evaluation is populating. Are you building a model of individual skill capability? A model of coordination patterns? A model of domain constraint coverage? Each requires different evaluation methods.

### Category 4: Principles of Good Practice (Guidelines That Apply Across Contexts)

In CSE, principles are "widely applicable maxims" intended to guide design across frameworks. Woods's "Laws that Govern Cognitive Work" are one example; the First-Person Perspective principle is another. These are not procedures — they are heuristics, grounded in accumulated experience, that apply across many specific design contexts.

The paper identifies several principles that apply with particular force to agent system design:

**Visual Momentum (Woods, 1984):** The design principle that interface displays should maintain users' sense of context as they navigate between views — so that each new display is interpretable in terms of the previous display without cognitive reset cost. For agent systems: outputs produced by one skill and consumed by another should maintain semantic continuity — the receiving agent should be able to situate the incoming information in the context of what it already knows without having to perform a costly cognitive translation.

**Making Automated Systems Team Players (Christoffersen and Woods, 2002):** The principle that automation should behave as a legible, predictable, and monitorable participant in the joint cognitive system. For agent systems: each skill should be designed to make its state, confidence, reasoning, and failure modes visible to the orchestration layer — not just to produce outputs.

**Resilience Engineering (Woods and Hollnagel, 2006):** The principle that systems should be designed for graceful adaptation to unexpected conditions, not just optimal performance under anticipated conditions. For agent systems: the skill library should include explicit degradation pathways for cases that fall outside any skill's confident operating range.

**First-Person Perspective (Eggleston and Whitaker, 2002):** The principle that system interfaces should use the worker's own terminology and conceptual framework, not the designer's. For agent systems: the interface between the orchestration layer and human operators should be built around the domain vocabulary and problem-framing of the practitioners who consume the system's outputs — not the technical vocabulary of the system's designers.

## The Concept Map's Key Insight: Context Determines Application

The paper makes a subtle but important point about its concept map: "this concept map implies that any method could be applied within any framework. While this is technically true, history tells us that the investigator's theoretical stance, or originating community of practice, greatly influences the use of methods."

This means: a method is never purely objective. The same Critical Decision Method interview produces different information in the hands of a Decision-Centered Design practitioner than in the hands of a Cognitive Work Analysis practitioner — not because one is doing it wrong, but because the orienting framework shapes what questions are asked, what answers are noted as significant, and what representation is used to capture the findings.

For agent systems, the analogous insight is: a skill is never purely a function. The same skill invoked within different orchestration frameworks — centralized versus distributed, certainty-seeking versus uncertainty-tolerant, human-in-the-loop versus fully autonomous — produces different patterns of behavior, exploits different strengths, and exposes different failure modes. The skill doesn't change; the framework in which it is embedded determines whether its strengths are used and its weaknesses are compensated for.

This is why architectural decisions at the framework level matter more than individual skill optimization. A brilliant skill embedded in a poorly-designed orchestration framework will underperform. A mediocre skill embedded in an orchestration framework that complements its weaknesses and amplifies its strengths will outperform. The concept map's four-level structure helps keep this perspective: don't optimize methods and techniques without attending to the framework within which they operate.

## The Missing Level: Meta-Cognitive Awareness

The paper briefly surfaces a category that doesn't fit cleanly into the four-level structure: meta-cognitive awareness — the system's capacity to reflect on its own cognitive processes and limitations.

CSE's commitment to discovery over procedure implies a kind of meta-cognitive stance: the practitioner must maintain awareness not just of the domain being analyzed but of their own analytical approach and its limitations. This is why "errors are considered interesting openings for further inquiry" rather than failures to be corrected: the meta-cognitive awareness that an error implies a model mismatch is itself a capability that must be designed for.

For agent systems, meta-cognitive capability means:
- Agents that can assess the limits of their own expertise and signal when a problem falls outside their reliable operating range
- Orchestrators that can recognize when a decomposition strategy is failing and revise it
- Skills that can identify when their output confidence is not warranted by the information they had access to
- A system-level capacity to distinguish between "we solved this problem" and "we produced an answer to this problem" — the latter being achievable without the former

This is perhaps the hardest capability to build and the most important one to have for a system that aspires to handle genuinely novel and complex problems. The CSE concept map doesn't explicitly label it, but the entire CSE project is oriented around it.
```

### FILE: value-case-and-invisible-contributions.md
```markdown
# The Value Case Problem: Making Invisible Contributions Visible in Complex Systems

## The Paradox of Good Cognitive Systems Engineering

There is a frustrating paradox at the heart of Cognitive Systems Engineering: its most valuable contributions are the hardest to demonstrate. When CSE works well, disasters don't happen, systems get used, practitioners don't have to develop elaborate workarounds, and coordination happens smoothly. None of these are visible as outcomes — they are absences, the non-occurrence of failures that were never triggered.

Militello et al. describe this directly: "The CSE community still faces the challenge of providing a convincing value case at the time work is scoped and planned... Often the only way to provide a convincing value case is to explain CSE processes and show specific work products that have resulted from previous CSE efforts."

And the more troubling version: "As a relatively new approach to design, the contribution and value of CSE are not widely understood. Although examples of difficult-to-use and even failed technologies are plentiful and widely appreciated, there is a pervasive tendency to underestimate the difficulty of developing effective solutions. Resources devoted specifically to exploring worker perspectives, work constraints, and cognitive requirements are hard to justify if program managers and system designers believe issues of usability, usefulness, and impact are to be resolved as a natural byproduct of smart people using common sense."

This is the value case problem in its pure form: smart people using common sense can build functional systems, and the gap between a functionally correct system and a cognitively effective one is mostly invisible until it manifests as failure. The cost of that gap is systematically underestimated because it is invisible.

## The "Smart People Using Common Sense" Assumption

The assumption that good designers using engineering intuition will naturally address cognitive requirements is not irrational — it is wrong in a specific way that the paper traces carefully. Engineering intuition is calibrated by experience with systems, and experience with systems is a poor basis for understanding the cognitive requirements of human work in those systems for several reasons:

**Engineers are not representative practitioners.** The people who design systems typically have extensive expertise in the design domain (software, hardware, systems architecture) and limited expertise in the work domain the system will support. Their intuitions about what practitioners need are formed through limited, often atypical contact with the work.

**Common sense systematically underestimates tacit knowledge.** Work that looks simple or routine from the outside — the expert who handles a complex situation smoothly, the team that coordinates without apparent effort — looks that way precisely because expertise and practiced coordination have made it so. The difficulty of the underlying cognitive work is invisible in the performance. When designers use that performance as their model of the work, they design systems that support the appearance of the work rather than its cognitive substrate.

**Normative models of work are poor approximations of actual work.** Designers have access to procedure manuals, process flows, and official descriptions of how work is supposed to happen. These normative models are internally consistent and make the work look more tractable than it is. Actual work involves constant improvisation, judgment, workarounds, and adaptation — the "informal artifacts" that practitioners develop when official tools don't fully support actual cognitive demands.

**Error analysis without CSE methodology blames practitioners, not systems.** When things go wrong, the most visible explanation is practitioner error — the operator didn't follow the procedure, the analyst made a judgment mistake, the team didn't communicate adequately. CSE methodology consistently finds that what looks like practitioner error is actually a system design failure: "Errors can often be traced to misleading information technology, contradictory processes, or competing goals." Without that analytical lens, each error produces attribution to human failure rather than insight into system design inadequacy.

## The Cost Visibility Problem

The paper identifies a specific measurement challenge: "outcomes of CSE include more productive iterations during the design cycle (and often fewer false starts) and fielded systems that better support cognitive work and reduce the likelihood of error. Systems designed using CSE methods and principles are more likely to feature the flexibility required to accommodate a changing world."

Each of these outcomes is genuinely valuable. None is easily measured as an isolated contribution of CSE:

- "More productive iterations" requires counterfactual comparison to iterations that would have occurred without CSE input
- "Fewer false starts" requires identifying which starts were avoided, which is impossible to observe
- "Better support cognitive work" requires cognitive performance measures that most organizations don't collect
- "Reduce the likelihood of error" requires a baseline of errors that would have occurred, which again requires counterfactual reasoning
- "Flexibility to accommodate a changing world" is only visible when the world actually changes

The paper acknowledges directly: "It does not make sense to build one work system using CSE and one work system without CSE for comparison in terms of development costs and the impact of the final design on cognitive work and error rates."

The practical result is that CSE is chronically underfunded relative to its actual contribution because its contribution is systematically invisible to the metrics that drive funding decisions.

## The Worker Acceptance Indicator

The paper notes: "Worker acceptance is an excellent indicator of success in hindsight (after the design is complete)." This is important: while CSE's positive contributions are hard to measure prospectively, rejection by workers is a clear indicator of failure in retrospect. The Cedars-Sinai and TRILOGY cases both ultimately produced clear rejection signals — though only after enormous investment.

The inverse is also true: systems that are readily adopted and used by practitioners — without the workarounds, complaints, and informal adaptations that signal design-practice mismatch — are a positive indicator of CSE effectiveness. The Global Weather Management tool being "so well received that a fieldable version was immediately requested" is an example.

For agent system design, worker acceptance of the system's outputs by the practitioners or downstream agents that consume them is the clearest immediate indicator of whether cognitive requirements have been adequately addressed. Outputs that require extensive post-processing, that are frequently overridden, that generate complaints from downstream users, or that are used only when no alternative is available — these are the analog of systems that workers boycott.

## Making the Value Case Concretely

The paper's practical suggestion is to "capture and share success stories in which cognitive requirements and worker perspectives are incorporated early in the design process." The success stories work as value cases because they make visible the contrast between the design trajectory with CSE input and what the design trajectory would have been without it.

The nuclear plant case is the most striking value case in the paper precisely because the counterfactual is so clear: the plant was about to spend millions of dollars adding technology and staff to solve a problem that a CSE investigation revealed was not the actual problem. The CSE contribution is not measured in the effectiveness of the eventual solution — it is measured in the millions of dollars of wrong investment that were avoided.

For agent systems, the analogous value case approach is:
- Document cases where problem reframing prevented expensive investment in the wrong solution
- Track cases where skill failures or coordination breakdowns were caught and corrected before manifesting as consequential errors
- Measure the frequency with which human operators override or post-process agent outputs (high frequency = poor cognitive support; low frequency = effective cognitive support)
- Capture cases where adaptability features enabled the system to handle unanticipated situations that a more rigid system would have failed on

## The Justification Challenge and Its Structural Cause

The paper identifies a structural cause for the justification challenge that goes beyond measurement difficulty: "often the CSE contribution is difficult, if not impossible, to isolate from the contributions of others on the design team — particularly if it is done well as part of an integrated design effort."

This is the deepest version of the problem. CSE is most effective when it is not a separate activity — when cognitive requirements are integrated into every phase of design, when problem framing is continuously updated as cognitive analysis deepens, when design decisions are made with full awareness of cognitive implications. In that integrated case, there is no "CSE contribution" to isolate — the whole system reflects CSE principles, and the value is diffused throughout.

The systems that produce the most visible CSE value cases — like the nuclear plant case — are often ones where CSE was not integrated into design from the beginning. The dramatic contrast between the initial (wrong) problem framing and the CSE-generated (correct) problem framing is visible precisely because CSE was brought in after the fact to correct a trajectory that had already diverged from cognitive reality.

This creates a perverse incentive: the most dramatic value cases come from late, corrective CSE interventions, while the greatest actual value comes from early, integrated CSE involvement that prevents those dramatic failures from occurring. But the value of prevention is invisible.

## For WinDAGs: The Invisible Contribution Problem

For an AI agent orchestration system, the same paradox applies. The hardest-to-demonstrate but most valuable contributions of cognitive quality in system design include:

- **Problem reframings that prevented expensive wrong-direction work.** If an agent recognizes that a task specification embeds a wrong problem framing and requests clarification before executing, the value of that recognition is entirely invisible — the wrong work never happened.

- **Coordination quality that prevents cascading failures.** A well-designed inter-agent coordination protocol that prevents one agent's uncertainty from being misinterpreted as confidence by the next agent in the chain prevents a class of errors that is entirely invisible when the protocol is working.

- **Appropriate uncertainty signaling.** An agent that correctly signals low confidence on an unusual case and escalates to human judgment has prevented a potential error — but because the error never occurred, its prevention has no obvious value in any metric that counts successes.

- **Graceful failure handling.** A skill that fails informatively, producing diagnostically useful error information rather than a plausible-looking wrong answer, contributes to system quality in ways that are invisible when the system is working and visible only in the aftermath of failures that were caught rather than propagated.

The practical implication: design the system to make these invisible contributions visible by tracking them explicitly. Log problem reframings and their estimated impact. Track escalations and their outcomes. Measure uncertainty calibration (how often does stated confidence correspond to actual accuracy?). Analyze cases where graceful failure prevented downstream error propagation. Build the metrics infrastructure to see the value that would otherwise be invisible — because invisible contributions don't get resourced, and under-resourcing them produces the failures that expensive post-hoc corrections try to fix.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The paper's insistence that problem framing precedes decomposition, and that decomposition should follow the natural constraint structure of the work domain rather than technical convenience, directly improves decomposition skill. Specifically: treat initial task descriptions as hypotheses; look for the constraint structure of the domain before defining subtask boundaries; build in mechanisms for reframing when intermediate results suggest the decomposition was wrong.

- **Debugging and Error Analysis**: CSE's principle that errors are diagnostics rather than defects transforms debugging practice. Instead of asking "how do I fix this?" first, ask "what does this error reveal about the model of the task this code is supposed to perform?" The failure is information about the mismatch between intended behavior and actual domain structure.

- **Architecture Design**: The joint cognitive system framework fundamentally enriches architecture design. Every interface between components is an interface between participants in a joint cognitive system. The question for each interface is not just technical compatibility but cognitive compatibility: does this interface carry the semantic information that the receiving component needs to perform its cognitive work? The stove-piping failure mode and the automation surprise failure mode both have direct architectural implications.

- **Code Review**: The gap between normative models and actual practice (official procedures vs. how work really happens) applies directly to code review. Reviewing code against specifications tells you whether the code satisfies the stated requirements; CSE methodology asks whether the stated requirements correctly describe the cognitive demands of the actual use context. Code review enriched by CSE asks: what assumptions about actual usage are embedded in this code, and are those assumptions correct?

- **Security Auditing**: The automation surprise failure mode — systems behaving in ways their human partners cannot anticipate or interpret — is a primary attack vector in social engineering. Security auditing enriched by CSE examines not just whether systems have correct security properties but whether those properties are legible to the practitioners who must work with them. Hidden failure modes and opaque system behaviors are security vulnerabilities even when they are not technically exploitable.

- **Frontend Development**: The Visual Momentum principle (maintaining context as users navigate between views) and the First-Person Perspective principle (using the user's vocabulary and conceptual framework) are direct design guidelines for frontend development. More deeply, the CSE insistence on grounding interface design in cognitive task analysis — understanding what information users need, in what sequence, under what cognitive load, with what competing demands — transforms frontend development from aesthetic craft to cognitive support engineering.

- **Agent Orchestration**: The paper's entire framework applies to orchestration design. Joint cognitive system principles govern agent coordination. The design-as-dialog framework applies to orchestration architecture development. Problem reframing capabilities should be built into orchestration logic. The four-level concept map (frameworks, methods, modeling techniques, principles) provides an organizing structure for the orchestration layer's design.

- **Documentation and Knowledge Management**: The paper's treatment of tacit knowledge and the gap between what experts know and what they can tell applies directly to knowledge management. Documentation based on expert self-reports captures the normative model, not the cognitive reality. Knowledge management systems enriched by CTA methodology can capture the actual patterns of recognition, cue-weighting, and situational judgment that make expertise valuable — not just the facts that experts can articulate.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The joint cognitive system framework is directly applicable. Each agent is a participant in a distributed cognitive system; the orchestration architecture should be designed around the cognitive coordination requirements of that system, not just technical routing. Automation surprise, bottleneck, and stove-piping failure modes all have direct architectural analogs. Design-as-dialog suggests orchestration should include problem reframing capability, not just execution capability.

- **Task Decomposition**: The paper's insistence that decomposition should follow domain constraint structure rather than technical convenience reshapes decomposition skill. Problem reframing as the highest-leverage intervention means decomposition should be preceded by an explicit problem-framing phase. The recognition that design (including decomposition) is dialog rather than pipeline means decompositions should be revisable as intermediate results surface new information about actual problem structure.

- **Failure Prevention**: The five failure mode taxonomy (automation surprises, wrong problem statement, stove-piping, overspecification, expert bottleneck) provides a diagnostic framework for anticipating and preventing system failures. The meta-principle that errors are diagnostics rather than defects transforms failure analysis from corrective to generative. The hindsight bias warning cautions against designing only for failures already seen.

- **Expert Decision-Making**: The Recognition-Primed Decision model, developed by Klein (one of the paper's authors), provides the theoretical basis for understanding how expertise actually works — pattern recognition triggering responses, followed by mental simulation verification — and what this means for systems that aspire to support or replicate expert judgment. Tacit knowledge, the expert-articulation gap, and models of expertise as blueprints for system design all flow from this core insight.