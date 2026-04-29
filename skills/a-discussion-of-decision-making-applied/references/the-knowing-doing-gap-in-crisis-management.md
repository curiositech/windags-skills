# The Knowing-Doing Gap: Why Research Knowledge Doesn't Reach Practice, and What Agents Can Do About It

## The Structural Isolation Problem

Njå and Rake end their paper with an observation that many researchers in applied domains would recognize, but that is stated here with unusual directness:

> "Based on our research in Scandinavian countries, incident commanders and their emergency organisations appear to be very little concerned with research and the practical use of scientific results. The barriers between researchers and first responders are both structurally and culturally conditioned. There are very few arenas where researchers and operative responders meet. Researchers developing descriptive and normative models seem unable to communicate with the responders. The responders, on the other hand, work in a rather enclosed community in which exposure to outside criticism is infrequent and experience transfer within and across services does not work very well." (Njå & Rake, p. 16)

This is the knowing-doing gap in its most fully developed form. It is not just that practitioners don't know what researchers have found. It is that the two communities have developed in structural isolation from each other, each with its own culture, its own epistemological standards, its own language — and almost no formal channels through which knowledge flows between them.

This pattern is not unique to emergency management. It appears in medicine (the gap between clinical trial evidence and medical practice), in software engineering (the gap between software engineering research and industry practice), in education (the gap between learning science and teaching practice), and in organizational management. It is a near-universal feature of complex, high-stakes practice domains.

## Why the Gap Persists

Several mechanisms sustain the knowing-doing gap:

### 1. Language Incompatibility

Research produces findings in the language of theoretical constructs, statistical significance, and empirical generalization. Practice operates in the language of specific situations, immediate pressures, and accumulated intuition. The RPD model, expressed as a process diagram with recognition-primed decision cycles, conveys something real about expert fireground commanders. But a fireground commander presented with that diagram does not immediately see their own experience in it.

The translation problem is not just a matter of jargon. It is a matter of abstraction level. Research findings are *generalized* — they describe tendencies across cases. Practice knowledge is *particular* — it is knowledge about *this type of fire*, *this type of building*, *this time of year*. The generalized finding doesn't slot directly into the particular knowledge structure.

### 2. Trust and Authority

In many practice domains, practitioners are skeptical of researchers who have not themselves done the work. This skepticism is not unreasonable. Research into firefighting incident command conducted entirely through retrospective interviews, by researchers who have never commanded a fire, will be received differently than research conducted with practitioner involvement. Njå and Rake's own background — one is a former Fire Chief and Deputy Fire Chief — is not incidental to the paper's credibility.

### 3. Feedback Loops and Outcome Visibility

Practice knowledge is maintained by feedback: commanders act, observe consequences, update. But as Njå and Rake note, the feedback in crisis management is often incomplete:

> "There is no easily accessible and measurable output quantity of incident commanding which can be used as the dependent variable." (Njå & Rake, p. 14)

When performance feedback is hard to measure, practitioners cannot easily tell whether their accumulated knowledge is accurate or not. They can see gross outcomes (the fire was extinguished, the building collapsed) but not the contribution of individual decisions to those outcomes. This makes it hard to update practice based on evidence.

### 4. Organizational Enclosure

> "The responders work in a rather enclosed community in which exposure to outside criticism is infrequent and experience transfer within and across services does not work very well." (Njå & Rake, p. 16)

Organizations that operate in high-stress, high-stakes environments tend to develop strong internal cultures. These cultures provide cohesion and efficiency, but they also insulate against external input. After-action reviews focus on "what should have happened" (normative) rather than "what actually happened and why" (descriptive). Critical analysis of commander performance is rare because it threatens team morale and professional identity.

## The Drabek Warning

Thomas Drabek's observation, cited by Njå and Rake, captures the human cost of the knowing-doing gap in emergency management:

> "Maybe the explosion couldn't have been avoided, but too many people suffered even more because these emergency workers did not do their jobs. Or more accurately, emergency workers had been swallowed up in a system that failed them despite their best individual efforts." (Njå & Rake, p. 12, citing Drabek, 2002)

This is not a criticism of individual competence. It is a systems critique: competent individuals, embedded in a system with inadequate knowledge transfer, produce worse outcomes than their individual capability would predict. The system-level failure is structural, not personal.

## Implications for Agent System Design

The knowing-doing gap has direct implications for how WinDAGs and similar agent systems should be designed, deployed, and maintained.

### 1. Knowledge Must Be Embedded in Workflow, Not Stored Separately

The research on incident command is valuable. But if it exists only as a reference document that agents can invoke on request, it will not influence agent behavior in practice. The knowing-doing gap in human organizations is partly caused by the separation of knowledge (in research papers, training manuals) from action (in operational contexts). For agents, the same dynamic applies.

**Design principle**: The insights from decision-making research should be embedded in the agent's default behavior, not stored as an accessible reference. The agent that invokes a skill should automatically be running with the understanding of when to escalate, how to monitor expectancies, when to discriminate from the pattern — not because it retrieved a document, but because those principles are part of its operational logic.

Concretely:
- The "commit only to satisficing solutions" principle should be a default heuristic, not a rule to be looked up
- The "monitor expectancies, not just error states" principle should be built into every execution framework
- The "flag for KB engagement when similarity score is low" principle should be automatic

### 2. Design for After-Action Learning

One of the ways to close the knowing-doing gap in human organizations is to build feedback channels — mechanisms by which experience from operations flows back into training, procedures, and organizational knowledge. Agent systems need equivalent mechanisms.

After-action learning design:
- Every execution should produce a structured log that includes: situation classification, confidence score, action taken, expected outcomes, actual outcomes, and deviation from expectancy
- Systematic review of these logs should drive updates to the pattern library, the discrimination boundaries, and the escalation thresholds
- The agents that execute tasks should not be the only agents that learn from those executions; there should be a distinct "learning agent" role that analyzes cross-agent performance patterns

### 3. The Participatory Action Research Model

Njå and Rake, in a companion paper cited here, advocate for a methodology called "participatory action research" as an alternative to the researcher/practitioner separation. In this model, researchers work *within* practitioner organizations, sharing the operational context, contributing to practice, and studying what they observe in real time.

The equivalent for agent systems is **embedded evaluation**: agents that continuously evaluate their own performance and that of the system, using real-time operational data rather than post-hoc review. This is architecturally different from standard logging: it requires the evaluation agent to be present during execution, not added afterward.

### 4. Build Bridges, Not Reports

The knowing-doing gap in emergency management is partly sustained by the form in which knowledge is communicated: research papers addressed to other researchers. The operational implications are not surfaced because that is not the paper's primary audience.

For agent systems serving human operators, the equivalent is system feedback that is legible to the humans who need to act on it. An agent that identifies a pattern of errors in its own behavior and produces a technical log is not closing the knowing-doing gap. An agent that identifies a pattern and produces an actionable recommendation to the system operators, in plain language, tied to specific recent examples, is closing it.

**Design principle**: Every insight the agent system generates about its own performance should come with an explicit translation: "This is what it means in practice, and this is what should change."

## The Meta-Lesson: Systems Need Institutions

The knowing-doing gap in emergency management is not just a communication problem. It is an institutional problem: there are no standing institutions whose job it is to bridge research and practice, to run the feedback loops, to maintain the connection between what is known and what is done.

Agent systems face the same structural challenge. The gap between what the system has learned (its pattern library, its trained behavior) and what it *should* be doing (given accumulated operational experience) will grow unless there is a standing process — an institutional equivalent — that maintains the bridge. This is not a technical problem that can be solved once and forgotten. It is an ongoing organizational commitment to operational learning.