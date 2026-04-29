---
name: the-state-of-cognitive-systems-engineeri
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  provenance:
    kind: legacy-recovered
    owners:
    - some-claude-skills
---
# SKILL.md — Cognitive Systems Engineering

license: Apache-2.0
```yaml
name: cognitive-systems-engineering
version: 1.0
description: >
  Apply insights from cognitive systems engineering research to the design
  of agent architectures, task decomposition, skill specification, and
  human-machine coordination. Draws on Hoffman, Klein, Woods, Vicente,
  Rasmussen, Hutchins, and the broader naturalistic decision-making corpus.
activation_triggers:
  - designing multi-agent orchestration or pipelines
  - specifying what an agent or skill should do
  - diagnosing why an automated system is failing or surprising users
  - building systems that encode expert knowledge
  - reasoning about human-AI handoffs, escalation, or oversight
  - decomposing complex tasks into agent subtasks
  - evaluating agent architectures for brittleness
  - asking "why does this system keep breaking in unexpected ways"
```

---

## When to Use This Skill

Load this skill when you are:

- **Designing agent task decomposition** and need to avoid encoding a fragile fixed pipeline
- **Specifying what an agent should do** and need to capture not just behavior but reasoning structure
- **Diagnosing coordination failures** between agents, or between agents and humans
- **Building systems that are supposed to encode expertise** (via prompting, fine-tuning, RAG, or tool design)
- **Evaluating an existing architecture** for the failure modes that cognitive systems engineering literature predicts
- **Designing escalation, oversight, or human-in-the-loop mechanisms** that actually work under load

This skill is *not* primarily about UI/UX. It is about the cognitive architecture of systems that must perform expert-level work in complex, dynamic, uncertain conditions. The questions it answers are: *What will break? Why? What should the internal structure look like to be resilient?*

---

## Core Mental Models

### 1. The Invariant Task Sequence Fallacy
> Fixed pipelines are models of the idealized case, not of real work.

Real expert performance is **context-sensitive selection among alternative paths to a goal** — not sequential execution of prescribed steps. Experts facing degraded conditions (a broken tool, missing data, an unexpected situation type) do not halt; their knowledge generates alternative routes. Systems built as fixed sequences become brittle at exactly the moments that matter most.

**The implication**: Task decomposition must separate *goals* from *methods*, include alternative paths, and carry intention metadata. The pipeline is a default, not a law.

---

### 2. Recognition-Primed Decision Making (RPD)
> Experienced agents don't compare options — they recognize situations and simulate.

Klein's research across firefighters, military commanders, and intensive care nurses showed that experts under time pressure rarely generate a list of options and evaluate them. Instead:
1. Cues activate **situation recognition** (this is a type-X situation)
2. Recognition retrieves a **first plausible action**
3. Agent runs a **brief mental simulation** — will this work here?
4. If yes, act. If simulation fails, revise the situation model or action.

The computational implication: fast, competent decision-making is not exhaustive search — it is **rich situational representation enabling rapid pattern match, followed by lightweight forward simulation**. Architectures that force deliberative comparison where RPD would suffice are slower and often worse.

---

### 3. The Human-Centered Inversion
> The system serves the task and the human; the task does not serve the system.

Most technology development adapts humans to machines (train the operator to fit the interface). Human-centered computing inverts this: machines should **amplify cognitive strengths and compensate for cognitive limits**. For agent systems, the parallel is direct: the orchestration layer should adapt to the nature of the problem and the capabilities of available agents — not force problems into shapes the orchestration layer finds convenient.

When you hear "we need to restructure the task so our pipeline can handle it," you are seeing the inversion fail.

---

### 4. Tacit Expertise Resists Behavioral Decomposition
> What experts do is not what they know; what they know is not what they can say.

Surface observation of expert behavior **systematically misleads**. A simple-looking action sequence often conceals rich, knowledge-driven selection processes: decisions not taken, cues recognized and discarded, situations reclassified before any visible action occurred. This is the **knowledge elicitation problem** — expertise has tacit dimensions that resist both behavioral observation and direct self-report.

The implication: you cannot specify what an agent should do purely from input-output behavioral examples. The **internal reasoning structure** — the cues attended to, the situation classifications applied, the alternatives briefly considered and rejected — must be elicited through structured methods (Critical Decision Method, cognitive task analysis), not inferred from behavioral trace alone.

---

### 5. Automation Surprises Are Predictable Structural Failures
> Human-machine coordination breaks when agents maintain different models of the world.

When automated systems shift modes, take initiative, or fail silently, human operators who lack visibility into that state change experience **automation surprises** — sudden, dangerous gaps between what the operator believes the system is doing and what it is actually doing. These are not random failures; they are structural consequences of **representational divergence** at coordination interfaces.

The pattern: high automation reduces operator engagement → operator loses situational awareness → system shifts mode or fails → operator confronted with system state they cannot interpret → catastrophic response time.

For multi-agent systems: every interface where one agent's output becomes another agent's input is a **potential automation surprise surface**. Mode transparency and shared state representation are not optional.

---

## Decision Frameworks

### Task Decomposition
| Situation | Guidance |
|-----------|----------|
| Decomposing a complex task into agent subtasks | Separate goals from methods — specify *what must be achieved*, not just *what steps to execute* |
| Assigning subtasks sequentially | Ask: what breaks this sequence? Build alternative paths for the 3 most likely failure modes |
| One agent's output feeds another agent's input | Make the handoff state explicit and inspectable; assume representational divergence as the default |
| A task has never been done before in this system | Use cognitive task analysis methods before specification — don't infer structure from surface behavior |

### Orchestration Architecture
| Situation | Guidance |
|-----------|----------|
| Orchestrator must route tasks to agents | Route based on *situation type*, not just surface task features; load `references/recognition-primed-decision-making-for-agents.md` |
| Agent pipeline is failing in unexpected ways | Check for invariant sequence assumptions; load `references/invariant-task-fallacy-and-agent-pipelines.md` |
| Human needs to supervise or override agents | Design for mode transparency — the human must always know what the system believes and what it is doing |
| Agent handoffs are producing errors | Inspect for representational divergence at interfaces; load `references/automation-surprises-and-coordination-failure.md` |

### Expertise Encoding
| Situation | Guidance |
|-----------|----------|
| Trying to encode expert knowledge via prompting or examples | Assume significant tacit knowledge is invisible to behavioral observation; load `references/the-knowledge-elicitation-problem.md` |
| Expert is explaining their process | Apply skepticism — verbal reports underrepresent tacit cue recognition; use structured elicitation |
| Agent performance plateaus below expert level | The gap is likely in situation assessment, not procedure execution; diagnose cue recognition |
| Building agents at different capability levels | Match the agent architecture to the expertise stage; load `references/expertise-acquisition-stages-for-agent-capability-design.md` |

### Failure Diagnosis
| Symptom | Likely Cause | Action |
|---------|-------------|--------|
| System works in demos, breaks in production | Invariant sequence assumption hit an edge case | Load `references/invariant-task-fallacy-and-agent-pipelines.md` |
| Human supervisor keeps being surprised by what agents did | Automation surprise / representational divergence | Load `references/automation-surprises-and-coordination-failure.md` |
| Agent can't adapt when one tool or data source fails | No alternative paths in task structure | Redesign decomposition with goal/method separation |
| Encoded expertise underperforms the human expert | Tacit knowledge not elicited | Load `references/cognitive-task-analysis-for-skill-specification.md` |
| Agent decisions seem brittle in unusual situations | Situational context not represented | Load `references/situated-cognition-and-context-dependence.md` |
| System understands the problem but can't act effectively | Knowing-doing gap | Load `references/the-gap-between-knowing-and-doing-in-complex-systems.md` |

---

## Reference Files

| File | Load When |
|------|-----------|
| `references/invariant-task-fallacy-and-agent-pipelines.md` | Designing or diagnosing task pipelines; system is fragile at edge cases; decomposition feels too rigid |
| `references/recognition-primed-decision-making-for-agents.md` | Designing fast decision-making under uncertainty; evaluating whether deliberative vs. recognition-based architecture fits |
| `references/the-knowledge-elicitation-problem.md` | Encoding expert knowledge into agents; expert self-reports seem insufficient; skill performance plateaus |
| `references/automation-surprises-and-coordination-failure.md` | Designing human-agent handoffs; diagnosing coordination failures; building oversight/escalation mechanisms |
| `references/human-centered-inversion-for-agent-design.md` | Architecture review; evaluating whether system serves the task or forces tasks into system-convenient shapes |
| `references/expertise-acquisition-stages-for-agent-capability-design.md` | Calibrating agent capability levels; deciding between rule-based and adaptive architectures; staging capability rollout |
| `references/situated-cognition-and-context-dependence.md` | Agent is ignoring contextual factors; decisions seem decontextualized; system fails to adapt to situational variation |
| `references/cognitive-task-analysis-for-skill-specification.md` | Specifying a new skill or agent capability; translating expert work into agent requirements |
| `references/the-gap-between-knowing-and-doing-in-complex-systems.md` | System understands problem but fails to act; knowing-doing gap in agent execution; planning vs. execution failures |

---

## Anti-Patterns

These are the mistakes this literature most directly warns against:

**1. Pipeline Worship**
Building the happy path as a rigid sequential pipeline and treating deviations as errors. The invariant sequence is a fiction. Real work branches, backtracks, and routes around obstacles. *Build for the departure, not just the nominal case.*

**2. Behavioral Specification as Complete Specification**
Watching what experts do and encoding it as if that captures what they know. The most important cognitive work is invisible in behavior traces — situation assessment, rejected alternatives, reclassification events. *The trace is not the expertise.*

**3. Forcing Problems Into System-Convenient Shapes**
Redesigning tasks or workflows so the existing orchestration layer can handle them. This is the human-centered inversion failing. *The system adapts to the task; the task does not adapt to the system.*

**4. Silent Mode Transitions**
Agents changing state, strategy, or approach without making that transition visible to other agents or human supervisors. This is the mechanism behind automation surprises. *Every mode transition is a coordination event; treat it as such.*

**5. Asking Experts to Just Describe Their Process**
Self-report is unreliable for tacit expertise. Experts reconstruct post-hoc narratives that underrepresent cue recognition and overrepresent deliberative reasoning. *Use Critical Decision Method and retrospective incident analysis, not open-ended self-description.*

**6. Confusing Knowing With Capability**
Assuming that because an agent can represent or discuss a problem, it can act effectively on it. The knowing-doing gap is real, bidirectional, and specifically dangerous in complex dynamic environments. *Test execution, not just comprehension.*

**7. Novice-Level Architecture for Expert-Level Tasks**
Deploying rule-based, procedure-following architectures for tasks that require genuine expertise — tasks characterized by novel situations, degraded conditions, and high-stakes time pressure. *Match the architecture to the expertise stage required.*

---

## Shibboleths

How to tell if someone has actually internalized this body of work vs. skimmed a summary:

**They have internalized it if they:**
- Immediately ask "what's the failure mode when conditions diverge from the design assumption?" when reviewing a pipeline
- Treat the gap between prescribed behavior and actual expert behavior as *the data of interest*, not noise
- Distinguish between *knowing what to do* and *being able to do it* as separate design problems
- Ask about situation classification and cue recognition before asking about action selection
- Treat human oversight mechanisms as cognitive systems requiring their own design analysis — not just UI elements
- Recognize that an expert saying "I just knew" is the *start* of the elicitation problem, not the end of it
- Distinguish goal from method in task specifications without being prompted

**They are still at the summary level if they:**
- Use "human-centered design" to mean "good UX"
- Treat expert self-reports as reliable representations of expert cognition
- Define a skill as "the input-output transformation we want the agent to perform"
- Assume that if an agent can pass a behavioral test it has captured the underlying expertise
- Frame automation surprises as user-error problems rather than coordination architecture problems
- Talk about "the task sequence" as if there is a canonical one
- Equate decision quality with number of options considered

---

*Load reference files on demand. This index is sufficient for initial framing; reference files provide the methodological depth needed for design and diagnostic work.*