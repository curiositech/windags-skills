# The Gap Between Prescribed Work and True Work — And Why Agents Must Bridge It

## The Central Discovery of Cognitive Work Analysis

One of the most important — and consistently underappreciated — findings of Cognitive Systems Engineering is what Vicente (1999, cited in Hoffman et al.) called the "true work" that practitioners actually perform, as opposed to the work that is visible in task specifications, procedure manuals, and job descriptions.

These two things are not the same. The gap between them is not a matter of corner cases or edge conditions. **The gap is the essence of what skilled performance looks like.** It is the difference between what a job description says an intensive care nurse does (monitor vital signs, administer medications, follow care protocols) and what an intensive care nurse actually does (continuously integrating multiple streams of imperfect information, forming and updating mental models of patient trajectory, detecting early warning signals before they become measurable on standard monitors, coordinating with physicians and family and pharmacists and technicians in ways that are not on any protocol, and making dozens of micro-decisions per hour that never appear in any documentation).

Hoffman et al. point to the methodology implications: becoming an "expert apprentice" — "empowering them to enter into a domain or organization, arrive at a rich empirical understanding of work practice, and perceive the 'true work' that must be accomplished." The point is that the true work is not self-evident. It requires sustained, skilled observation to perceive. It is invisible to the outsider, and often invisible to the practitioner as well — because much of it has been automated through years of practice and is no longer accessible to conscious articulation.

## Why Task Analysis Fails to Capture True Work

Traditional task analysis — decomposing jobs into sequences of observable actions — fails to capture true work for a structural reason: **it can only observe what practitioners do, not why they do it, or what they are monitoring that they don't act on, or what they are ruling out, or what alternative actions they considered and rejected**.

Rasmussen's landmark 1983 paper (cited in Hoffman et al.) on "Skills, Rules and Knowledge" provides the theoretical framework. Skilled performance operates at three levels:

**Skill-based behavior** is automatic, below the level of conscious attention. Expert practitioners execute many components of their work without deliberate thought. This behavior is invisible to task analysis because there is nothing to observe — no deliberate action, no conscious decision.

**Rule-based behavior** is semi-conscious: if-then rules that have been abstracted from experience and can be applied to recognized situations without deep analysis. These rules are visible in their outputs but their internal logic is not directly observable.

**Knowledge-based behavior** is deliberate, effortful reasoning used when neither skills nor rules provide an adequate response — when the situation is novel or when things have gone wrong. This is where expertise is most visible, but it is also the rarest and most demanding form of performance.

The failure of traditional task analysis is that it observes the outputs of skill-based and rule-based behavior and mistakes them for their causes. It sees the action, not the recognition. It captures the what, not the why. And systems designed on this basis will be correct — will capture the prescribed sequence correctly — but will be missing the deep functional understanding that makes adaptive performance possible.

Suchman's (1987) work on "plans and situated actions" (cited in Hoffman et al.) makes the same point from a different angle. Plans are not programs. When a practitioner has a plan, they do not execute the plan like a computer executes code. They use the plan as a resource for improvised action in a concrete situation. The plan says what they intend; what they actually do is determined moment-by-moment by the situation they are in. The improvisation is not a deviation from competent performance — it is competent performance.

## The Implications for Agent Knowledge Representation

For AI agent systems, the distinction between prescribed work and true work translates directly into a question about knowledge representation: **what kind of knowledge does the agent have, and how was it acquired?**

An agent whose knowledge was acquired by documenting procedures — by reading manuals, by following specifications, by watching nominal execution and encoding what it observed — will have the prescribed work. It will know what should happen when everything goes according to plan.

An agent whose knowledge was acquired through deep engagement with the problem domain — through many encounters with edge cases, failures, and novel situations, and through explicit analysis of what knowledge supports adaptive performance — will have something closer to the true work. It will know what to do when things don't go according to plan.

The distinction is stark and its implications for agent performance are large. Most of the time, prescribed work and true work overlap — the plan is a good guide to action because the situation is nominal. But the distribution of cases where they diverge is precisely the distribution of hard, high-stakes, consequential situations. And this is where agent performance will matter most.

## Visible vs. Invisible Cognitive Operations

A related insight from CSE is the distinction between visible and invisible cognitive operations. Visible operations are actions in the world — clicks, keystrokes, utterances, movements. Invisible operations are the cognitive work that precedes, accompanies, and grounds those visible actions — situation assessment, goal prioritization, hypothesis generation, strategy selection, prediction, evaluation.

Traditional system design focuses on visible operations because they are, by definition, observable. The design question becomes: how do we make these operations faster, more accurate, less error-prone? Interface design, automation, procedure support — all aimed at the visible layer.

But CSE research shows that errors almost always originate in the invisible layer. A nurse administers the wrong medication not because the administration action was executed incorrectly, but because the situation assessment upstream was wrong — the wrong patient was identified, or the medication was misread, or the order was misinterpreted. A pilot executes the correct procedure for the wrong situation because the situation recognition step failed.

**Errors in the invisible cognitive operations are not visible through observation of the visible operations — until they have already cascaded into consequences.**

For agent systems, the design lesson is: **build explicit representations of the cognitive operations, not just the behavioral operations.** An agent that represents its current situation assessment — what it thinks is happening and why — exposes a layer where errors can be detected before they manifest as actions. An agent that represents only its behavioral plan — what it intends to do next — has hidden the most error-prone cognitive layer from any possible oversight.

## Designing Agents That Know the True Work

Given the difficulty of eliciting tacit knowledge and the limitations of procedure documentation, how can AI agents be given access to something like the true work?

CSE offers several methodological principles that transfer directly:

**Use incident-based knowledge elicitation rather than procedure-based.** Don't ask "what do you do in situation X?" Ask "tell me about a difficult case where you had to depart from the standard procedure — what happened, what did you notice, how did you decide what to do?" This narrative method surfaces the tacit knowledge that grounds expert flexibility.

**Study the cases that procedures don't cover.** The boundary conditions, the edge cases, the failures, the anomalies — these are where the true work is most visible, because they are where practitioners cannot rely on automation and must engage deliberate, explicit reasoning. These cases are the richest source of knowledge about what real performance requires.

**Represent goals functionally, not procedurally.** Instead of encoding "step 3: run validation check," encode "the purpose of validation at this stage is to detect [specific class of errors] that would cause [specific downstream failure]. Validation is satisfactory if it achieves [epistemic goal] with [acceptable confidence]." This functional representation gives the agent the understanding it needs to adapt when the nominal validation procedure is unavailable.

**Include the meta-knowledge: when does this strategy work, and when does it fail?** Expert practitioners know not just strategies but the applicability conditions for strategies. They know when to use procedure A and when procedure A will fail and procedure B is needed. This meta-knowledge is some of the most valuable knowledge an agent can have, and it is almost never captured in procedure documentation.

**Build in mechanisms for progressive knowledge refinement.** The true work is not static — as environments change, as tools change, as the nature of tasks evolves, what skilled performance looks like changes. An agent system that cannot update its functional understanding of the work it is supporting will become progressively less aligned with the true work over time.

## The Organizational Dimension: Distributed True Work

One final point from CSE that is particularly relevant for multi-agent systems: in real-world organizations, the true work is frequently distributed. No single practitioner has the full picture. The knowledge required for effective performance is spread across individuals, teams, tools, documents, and organizational memory.

Hutchins' (1995) "Cognition in the Wild" (cited in Hoffman et al.) documents this in detail in the context of ship navigation: the navigational knowledge required to safely bring a large vessel into port is distributed across the crew in a way that no individual possesses it fully. The system as a whole is more capable than any of its parts.

For multi-agent systems, this is not just an interesting observation — it is a design challenge. **The true work that the agent system collectively needs to accomplish may not be holdable by any single agent.** This means that the knowledge architecture of the agent system — which agents know what, how that knowledge is shared and integrated, how gaps in individual knowledge are compensated by the collective — is not a secondary design question. It is primary.

An agent system that has been designed around the prescribed work — that has decomposed a task into sub-tasks and allocated each sub-task to an agent — may be missing the distributed, integrated understanding that the true work requires. Designing for true work means designing the collective intelligence of the system, not just the individual capabilities of its components.