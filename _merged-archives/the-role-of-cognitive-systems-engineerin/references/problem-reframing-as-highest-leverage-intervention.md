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