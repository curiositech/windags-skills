# The Invisible Cognitive Layer: What Engineers Systematically Miss

## The Core Problem

When engineers design complex systems, they tend to focus on what is visible and measurable: physical specifications, functional requirements, throughput, latency, storage, interface elements. What they systematically miss is what Militello, Dominguez, Lintern, and Klein (2009) call the *cognitive requirements* of the work — the layer of mental activity that determines whether a system is actually useful to the agents (human or artificial) who must operate within it.

This invisible layer includes:

- **Perceiving**: What information needs to be noticed, and in what form?
- **Attending**: What should be in focus vs. background at each moment?
- **Judging and deciding**: What are the real decision points, and what makes them hard?
- **Sense-making**: How do operators build a coherent picture from fragmentary data?
- **Planning**: What goal structures guide action sequences?
- **Remembering**: What must be held in working memory vs. what can be offloaded?
- **Problem-solving under uncertainty**: What happens when the situation doesn't match expectations?

As the authors define it: CSE addresses "cognitive complexity" — activities such as "identifying, judging, attending, perceiving, remembering, reasoning, deciding, problem solving, and planning" — and crucially, these "rarely reside in one individual, but instead often happen in the context of teams, as well as within human-technology interactions."

The failure mode is not malice or incompetence. It is assumption. Engineers "make assumptions about cognitive requirements, extrapolating their experience to anticipate the needs of the workers. Occasionally their assumptions are correct. We tend to hear about the cases where their assumptions were dramatically wrong." (Militello et al., 2009, p. 1)

## Why This Layer Is Systematically Ignored

The invisible cognitive layer gets ignored for structural reasons that are worth naming explicitly:

**1. It doesn't appear in requirements documents.** Traditional systems engineering captures what a system must *do* (functions) and what it must *achieve* (performance metrics). It does not capture what a system must *support* (cognitive work). The cognitive layer is rarely written down because it is tacit knowledge held by expert practitioners, not explicit specifications held by managers.

**2. It's hard to measure before the system exists.** You can model latency mathematically. You cannot easily model whether an interface will cause attention tunneling or whether an alert system will create alarm fatigue. The cognitive costs only become visible when real humans (or agents) attempt real work with real systems.

**3. Engineers confuse simplicity of design with simplicity of use.** A system that presents a clean list of 200 data points may be architecturally simple but cognitively catastrophic — because the operator must now perform the integration, pattern recognition, and prioritization work that the system should have done.

**4. Domain knowledge and cognitive knowledge are treated as separate.** Engineers develop deep expertise in their technical domain (software architecture, signal processing, database design) and assume that domain expertise is sufficient to understand how the system will be used. CSE reveals this assumption is wrong. Understanding how people *think* in a specific context requires empirical inquiry, not extrapolation from the designer's own experience.

## The Cost of Missing It

The paper offers two dramatic examples of what happens when cognitive requirements are ignored:

**Cedars-Sinai Medical Center (2003)**: A "highly-anticipated" computerized physician-order entry system was deployed and taken offline within *days*. Physicians boycotted it. The system technically worked — it could process orders — but it failed to support how physicians actually think, prioritize, and make decisions in clinical contexts. The cognitive layer was absent from its design.

**FBI TRILOGY System**: $170 million was spent developing a system that was "flawed and unfixable." It was cancelled before launch. The technical specifications were met. The cognitive specifications never existed.

These are not edge cases. They represent a recurring pattern: "Technologies designed without CSE input as part of the dialog are often rejected because they do not support expertise or aid workers in accomplishing important goals. By neglecting this part of the dialog, designers can easily fall into the trap of designing technologies or tools that hinder rather than support workers, resulting in automation surprises and increased likelihood of error." (p. 9)

## Application to AI Agent Systems

For AI agent orchestration systems like WinDAGs, the invisible cognitive layer maps directly onto agent operational requirements that are rarely specified explicitly:

### What agents need but systems rarely provide:

**Attention management**: Which of the 180+ available skills should an agent attend to, given the current problem state? A system that makes all skills equally salient forces the agent to do maximal search. A system that surfaces contextually relevant skills reduces cognitive load and improves routing efficiency.

**Sense-making scaffolding**: When an agent receives a complex, ambiguous task, what context is needed to build a coherent problem model? Systems that pass raw task descriptions without situational context force agents to perform unnecessary orientation work — the equivalent of handing a surgeon a patient with no history.

**Decision support vs. decision automation**: The paper distinguishes between *eliminating* cognitive requirements (bad) and *reducing complexity while supporting* cognitive functions (good). An agent system that makes every micro-decision on behalf of orchestrating agents removes the agency that makes orchestration flexible and adaptive. A system that provides decision-relevant information while preserving agent judgment enables robust performance.

**Goal transparency**: Agents need to understand not just *what* task they are executing but *why* — what higher-level goal they are serving, what constraints bound the solution space, and what failure modes are most important to avoid. Without goal context, agents optimize for local task metrics rather than system-level outcomes.

**Feedback loops for learning**: Expert performance improves through feedback. Agent systems that complete tasks but provide no signal about outcome quality, downstream consequences, or decision quality prevent the accumulation of performance insight that distinguishes expert systems from merely adequate ones.

### Design Principle for WinDAGs

Before adding a new skill or agent capability, apply the cognitive requirements audit:

1. What decisions must an agent make to use this skill well?
2. What information does the agent need to make those decisions, and is it available in context?
3. What are the hard cases — the situations where the skill's naive application produces wrong results?
4. Does the skill expose its uncertainty, or does it produce confident-looking outputs that may be wrong?
5. What cognitive work is the skill offloading from the orchestrating agent, and what cognitive work is it *creating*?

The invisible cognitive layer in agent systems is the layer of decision-making, uncertainty management, and goal-alignment that happens *around* skill invocation — not within skills themselves. Design that ignores this layer produces systems that technically execute tasks while failing to solve problems.

## The Formative vs. Normative Distinction

One of the most important conceptual contributions of CSE is the distinction between *normative* and *formative* approaches:

A **normative** approach imposes a formal theory of how work *should* be done — a prescribed procedure, a decision tree, a rule set. It is efficient for familiar, well-defined problems. It fails for novel, complex, ambiguous situations where the prescribed procedure doesn't fit reality.

A **formative** approach "examines work and its functional structure in order to identify the constraints within which workers must operate" — understanding what work *actually requires* before prescribing how it should be done. Errors, under the formative approach, are "considered interesting openings for further inquiry" rather than deviations to be eliminated.

For agent systems: **don't impose normative task structures on genuinely complex problems**. The routing logic, decomposition heuristics, and skill selection mechanisms of an orchestration system should be informed by empirical study of how the system actually performs on hard cases — not by theoretical models of how it *should* perform. Treat agent failures as data, not defects.