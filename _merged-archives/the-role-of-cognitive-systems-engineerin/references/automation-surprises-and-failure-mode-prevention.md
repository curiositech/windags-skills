# Automation Surprises and Failure Mode Prevention in Complex Cognitive Systems

## The Concept of Automation Surprises

Among the failure modes catalogued in the CSE literature and referenced in Militello et al. (2009) is the phenomenon known as **automation surprises** — situations where automated systems behave in ways that are unexpected by the human operators nominally in charge of them.

The reference to Sarter, Woods, and Billings (1997) in the paper points to research conducted in the context of advanced aviation automation. As cockpits became increasingly automated in the 1980s and 1990s, pilots found themselves in situations where the aircraft was doing something they hadn't instructed it to do, couldn't predict it would do, and couldn't always immediately correct. These weren't software bugs — the automation was operating exactly as designed. The surprises arose from a mismatch between what designers assumed pilots would understand about the automation and what pilots actually understood.

The formal name for this mismatch is the **automation surprise**: the operator's model of what the automated system is doing diverges from what the automated system is actually doing, with potentially catastrophic consequences. The operator takes action based on their (incorrect) model, the automated system takes action based on its (correct, from its perspective) logic, and the resulting joint behavior is neither what the operator intended nor what the system was designed to produce.

## Why Automation Surprises Happen

Automation surprises are not primarily caused by bad design intentions. They arise from a structural feature of complex automated systems: **opacity**. As automation becomes more capable, it also tends to become less interpretable. The automation "knows" more, but it communicates less about what it knows and why.

CSE identifies several contributing mechanisms:

**Mode confusion**: Complex automated systems operate in different modes — the system's behavior depends on which mode is active. When operators are uncertain about the current mode, their predictions about system behavior will be wrong. In advanced aircraft, pilots sometimes lost track of which autopilot mode was active and acted on incorrect assumptions about what the automation was doing.

**Initiative confusion**: Automation is often designed to take action when certain conditions are met. If operators don't know what conditions trigger automatic actions, they can't anticipate those actions. The automation "surprises" them by acting when they didn't expect action.

**Outcome opacity**: Automation often produces outputs without surfacing the reasoning or assumptions behind those outputs. Operators receive an answer without the reasoning, and therefore cannot evaluate whether the answer is reliable in the current situation — which may differ from the situations the automation was designed to handle.

**Feedback suppression**: Highly automated systems often suppress feedback loops that would allow operators to detect when the automation is failing or operating outside its reliable range. The automation looks confident even when it shouldn't.

## The CSE Principle: Support, Don't Eliminate, Cognitive Function

The authors are explicit: "The aim of CSE is not to eliminate cognitive requirements, but to reduce complexity and support activities such as deciding, problem solving, and planning." (p. 3)

This is a crucial design philosophy that runs counter to a common automation impulse: if the human makes errors, automate the human away. CSE argues that this approach produces systems that fail in characteristic ways:

- When automation handles all normal cases, operators lose the skill and situational awareness needed to handle abnormal cases — which are precisely the cases where automation is most likely to fail
- When automation can't explain its reasoning, operators can't detect when the automation's assumptions don't match the current situation
- When automation handles cognition but operators are nominally responsible for outcomes, responsibility is diffused in ways that make accountability impossible and recovery difficult

The alternative is automation designed to be a *team player* — "strategies for making automated systems team players" (Christoffersen and Woods, 2002, cited on p. 5) — that augments human (or agent) cognition rather than replacing it.

## Indicators of Systems That Hinder Cognitive Performance

The paper references Long and Cox (2007) on "indicators for identifying systems that hinder cognitive performance." While the paper doesn't enumerate all these indicators, the case studies and surrounding literature suggest several important ones:

**Workload mismatch**: Systems that create high cognitive load during the situations when operators need to be most effective (emergencies, novel situations, high time-pressure decisions) — and low cognitive load the rest of the time — produce operators who are unprepared precisely when they are most needed.

**Information overload without salience**: Systems that present all information without organizing it by relevance, urgency, or goal-alignment force operators to do the organization work themselves — a cognitively expensive and error-prone task.

**Suppressed uncertainty**: Systems that present probabilistic or uncertain information as certain — that convert distributions into point estimates without communicating the uncertainty — mislead operators about how much to trust the information.

**Brittle task modeling**: Systems designed around a specific, prescribed task model fail when real-world situations deviate from the model. The system can't help when help is most needed.

**Hidden state**: Systems that change their internal state without communicating those changes to operators — the automation surprise source — undermine the operator's ability to maintain a coherent model of the joint system.

## The Nuclear Plant as Cognitive System Failure

The nuclear plant adverse event, analyzed from this perspective, was a joint cognitive system failure with identifiable structural causes:

- The emergency director was a cognitive bottleneck — a single point through which information had to pass and decisions had to emerge, creating overload at the moment when overload was most dangerous
- Most personnel "were not making any decisions at all" — cognitive capacity was present but not integrated into the decision-making structure
- The layout was inefficient — people who needed to coordinate were not proximate, creating communication overhead precisely when communication speed was critical

The automation surprise analog: the emergency response organization was nominally capable of handling the adverse event (enough people, appropriate equipment, defined procedures) but the *joint cognitive system* — the coordination structure through which individual capabilities became collective capability — was misconfigured in ways that produced failure despite adequate component-level resources.

## Application to AI Agent Systems

### Automation Surprises in Agent Pipelines

Automation surprises are not merely a human-automation issue. They can occur within multi-agent systems wherever one agent's behavior is not transparent to coordinating agents that depend on it.

An orchestrating agent that sends a task to a sub-agent and receives a result has, in complex cases, a model of what the sub-agent was doing. If the sub-agent's actual behavior diverges from that model — because the sub-agent encountered an edge case, changed its approach, or operated in an unexpected mode — the orchestrating agent's subsequent decisions may be based on false assumptions about what has already been done.

This is the agent-system automation surprise: the orchestrator's model of sub-agent behavior diverges from actual sub-agent behavior.

Prevention mechanisms:
- **Sub-agents should communicate their actual approach**, not just their result. If a sub-agent used a fallback strategy because its primary approach failed, that fact should be communicated to the orchestrator.
- **Sub-agents should surface their uncertainty explicitly**. A result produced with high confidence should be flagged differently from a result produced with low confidence, so the orchestrator can calibrate its reliance accordingly.
- **Significant deviations from task specification should trigger alerts**. If a sub-agent's understanding of the task requires it to reinterpret the original specification, that reinterpretation should be flagged rather than silently incorporated.

### Mode Transparency in Orchestration

Orchestration systems often operate in different modes — executing a plan, replanning, waiting for dependencies, handling errors — and the behavior of the system differs across modes. If orchestrating agents don't know which mode they are in, or if the mode is implicitly changed by upstream events without notification, the orchestrator's predictions about system behavior will be wrong.

Design principle: **make orchestration modes explicit and visible**. Every agent in the system should be able to query the current mode and understand how it affects expected behavior.

### The Workload Inversion Problem

A critical pattern from the aviation automation research is the *workload inversion*: automation reduces workload when workload is low (routine operations) and increases workload when workload is high (abnormal situations). The automation handles routine tasks, freeing operators — until something goes wrong, at which point operators must quickly reconstruct situational awareness they haven't been maintaining and take control of a system whose state they may not fully understand.

For agent systems: design the difficulty management so that the most cognitively demanding moments for orchestrating agents coincide with the most support, not the most opacity. When a sub-agent returns an unexpected result, when a pipeline encounters an error, when a task proves to be harder than anticipated — these are the moments when the orchestrating agent most needs rich information about system state, and when automation surprises are most costly.

### Supporting Macrocognition

The paper references Klein et al. (2003) on **macrocognition** — the high-level cognitive functions that enable effective performance in complex, naturalistic settings: sense-making, decision-making under uncertainty, planning, situation awareness, and collaborative problem-solving.

These macrocognitive functions are not just human concerns — they are the functions that orchestrating agents in complex systems must perform. An orchestration architecture that supports macrocognition will:

- Provide rich situational context, not just task specifications
- Enable collaborative sense-making across agents rather than treating each agent as an isolated executor
- Surface uncertainty and confidence at each step, enabling informed decision-making about how much to trust intermediate results
- Support replanning and adaptation when situations deviate from expectations
- Maintain explicit goal awareness so that local decisions can be evaluated against global objectives

The goal of agent system design, through the CSE lens, is not to eliminate uncertainty and complexity from agent operation — it is to design joint agent cognitive systems that can "effectively control the situations where they have to function," including the uncertain, complex, and novel situations where capable orchestration creates the most value.