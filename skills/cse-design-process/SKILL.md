---
license: Apache-2.0
name: cse-design-process
description: Cognitive Systems Engineering design methodology for joint cognitive systems and human-centered automation
category: Cognitive Science & Decision Making
tags:
  - cognitive-systems
  - design-process
  - human-factors
  - joint-cognitive-systems
  - methodology
---

# SKILL.md: Cognitive Systems Engineering for Complex Design

license: Apache-2.0
```yaml
metadata:
  name: cse-design-process
  source: "The Role of Cognitive Systems Engineering in the Systems Engineering Design Process"
  authors: Militello, Dominguez, Lintern, Klein
  version: 1.0
  activation_triggers:
    - designing agent systems or orchestration architectures
    - analyzing why a system failed or is failing users
    - decomposing complex tasks for AI or human execution
    - eliciting requirements from domain experts
    - encountering errors or unexpected behavior in cognitive work
    - questioning whether the right problem is being solved
    - designing for expert judgment, decision support, or automation
    - assessing whether a solution is solving the stated vs. actual problem
```

---

## When to Use This Skill

Load this skill when:

- **A system is being designed to support human cognition** — decision support, agent orchestration, information systems, automation of expertise
- **Requirements feel vague, contested, or keep shifting** — this is a signal that cognitive requirements are invisible, not that stakeholders are confused
- **Errors or failures are appearing** — treat them as diagnostics about design assumptions, not defects to patch
- **The stated problem feels wrong** — when the solution space seems to not contain the actual answer
- **Expertise needs to be captured, replicated, or supported** — and the expert "can't quite explain how they do it"
- **A distributed team or system must coordinate on complex cognitive work** — multiple agents, humans, tools, or organizations sharing cognitive load
- **The value of analysis work is being questioned** — when cognitive contributions are invisible against engineering deliverables

---

## Core Mental Models

### 1. Cognitive Requirements Are Invisible
What designers assume workers need and what workers actually need are systematically different — and the gap is enormous. Expert practitioners operate on tacit knowledge, perceptual cues, pattern recognition, and constraint awareness that they cannot easily articulate and that observation alone won't reveal. Any design process that doesn't actively excavate these requirements will build for an imaginary worker.

**Implication**: Requirements elicitation must use specialized methods (cognitive task analysis, critical decision method, think-aloud protocols) not interviews or surveys. The artifact of this work is a cognitive model of actual work, not a feature list.

### 2. Errors Are Diagnostics, Not Defects
An error in a cognitive system is not a malfunction — it is a precise indication of where the system's model of work diverges from work's actual structure. The mismatch between expected and observed behavior is the most information-dense signal available to a designer.

**Implication**: When agents, users, or joint systems produce unexpected output, the first question is "what does this error reveal about our design assumptions?" not "how do we eliminate this error?"

### 3. Design Is Dialog, Not Pipeline
Sequential design models (requirements → spec → build → test) are pedagogically convenient but operationally false. Complex problems reveal new information as you engage them. The problem statement you start with is never the problem statement you should finish with. Attempts to lock requirements early suppress the discovery that complex problems require.

**Implication**: Iterations are not failures of planning. Revisiting problem framing mid-project is not scope creep — it is the process working correctly. Build in explicit re-evaluation gates.

### 4. Problem Framing Is the Highest-Leverage Intervention
The most valuable thing a cognitive analysis can produce is often a restatement of the problem — not a better solution to the stated problem, but evidence that the stated problem is wrong. The nuclear plant case: 80+ staff reduced to 35, zero new technology, simply by understanding the actual cognitive structure of the work.

**Implication**: Before optimizing any solution, invest in verifying the problem statement. The cost of solving the wrong problem at high quality exceeds almost any other design error.

### 5. Joint Cognitive Systems, Not Tool-User Pairs
Cognitive complexity lives in the *distributed system* — the humans, technologies, processes, and organizational structures that collectively perform cognitive work. No single agent or tool can be designed in isolation. The coordination mechanisms, information flows, and shared situation awareness *across* the system are where cognitive success or failure is determined.

**Implication**: Design the handoffs, not just the nodes. Specify the shared mental model requirements between components. Analyze how automation changes the cognitive load distribution across the joint system, not just whether the automation works.

---

## Decision Frameworks

### Problem Diagnosis
```
IF a system is producing errors or unexpected behavior
THEN load: failure-modes-in-complex-cognitive-systems.md
→ Classify the failure mode before proposing a fix
→ Ask: Is this automation surprise, wrong problem, stove-piping, overspecification, or bottleneck?

IF stakeholders disagree on requirements or requirements keep shifting
THEN load: cognitive-requirements-are-invisible.md
→ The shifting is information: cognitive requirements haven't been made explicit yet
→ Deploy structured elicitation before more requirements gathering

IF the proposed solution feels like it solves the wrong thing
THEN load: problem-reframing-as-highest-leverage-intervention.md
→ Halt solution work; invest in problem framing first
→ Look for a restatement that makes current solution categories unnecessary
```

### Design Process
```
IF designing an agent system or orchestration architecture
THEN load: joint-cognitive-systems-distributed-cognition.md AND cse-concept-map-for-agent-architecture.md
→ Map the full joint system before designing any component
→ Design coordination mechanisms and information flow first

IF being pressured to finalize requirements before adequate understanding
THEN load: design-as-dialog-not-pipeline.md
→ Distinguish "locking requirements" from "having a current best model"
→ Propose explicit re-evaluation gates instead of sequential lock-in

IF designing for or around expert judgment
THEN load: expertise-recognition-and-tacit-knowledge.md
→ Apply Recognition-Primed Decision model to understand how expertise actually works
→ Plan for the expert articulation gap in requirements work
```

### Evaluation and Value
```
IF the value of cognitive analysis work is being questioned
THEN load: value-case-and-invisible-contributions.md
→ The paradox: good CSE work makes itself invisible (fewer failures, smoother operation)
→ Use leading indicators, not just incident counts

IF a proposed solution involves adding technology or staff
THEN load: problem-reframing-as-highest-leverage-intervention.md
→ Check: has an accurate cognitive model of work been used to validate this solution?
→ The nuclear plant benchmark: could problem reframing eliminate the need for the proposed resource?
```

---

## Reference Files

| File | When to Load |
|------|-------------|
| `references/cognitive-requirements-are-invisible.md` | Requirements feel vague or contested; designing for expert users; starting any requirements elicitation process; user research methods are in question |
| `references/design-as-dialog-not-pipeline.md` | Pressure to finalize requirements early; iterative process is being challenged as inefficient; project is mid-stream and problem statement needs revisiting |
| `references/problem-reframing-as-highest-leverage-intervention.md` | Solution space doesn't seem to contain the right answer; proposed solutions feel expensive or misaligned; need to justify pausing execution to reframe |
| `references/joint-cognitive-systems-distributed-cognition.md` | Designing multi-agent or human-machine systems; analyzing coordination failures; assessing how automation changes cognitive load distribution |
| `references/expertise-recognition-and-tacit-knowledge.md` | Capturing expert knowledge; designing decision support; building systems to replicate or assist expert judgment; expert can't articulate how they do the work |
| `references/failure-modes-in-complex-cognitive-systems.md` | Diagnosing system errors or unexpected behavior; pre-mortems on proposed designs; classifying an observed failure before responding to it |
| `references/cse-concept-map-for-agent-architecture.md` | Mapping capabilities for an agent system; organizing cognitive functions across components; resolving terminological confusion across frameworks |
| `references/value-case-and-invisible-contributions.md` | Justifying cognitive analysis investment; the value of CSE work is being questioned; measuring outcomes of systems that primarily prevent failures |

---

## Anti-Patterns

These are the failure modes CSE specifically warns against. Recognize them early.

**1. Designing for the imagined worker**
Building systems based on how designers think experts work, not how experts actually work. The imagined worker is rational, has complete information, follows procedures, and makes decisions the way a textbook says they should. The actual worker does none of this.

**2. Treating errors as defects rather than diagnostics**
Patching errors without asking what they reveal. A fixed error that wasn't understood is a missed opportunity to correct the underlying design assumption — and a guarantee the problem will resurface in a different form.

**3. Locking requirements before cognitive work is done**
Sequential process models create pressure to lock requirements early. In cognitively complex domains, this guarantees the wrong system gets built efficiently. Early requirements lock is not discipline; it is premature closure.

**4. Stove-piping: optimizing components without the joint system view**
Building an excellent tool that breaks the workflow of the humans or agents around it. Local optimization that degrades system performance. The classic version: automation that frees a human from a task but leaves them with no situation awareness when the automation fails.

**5. Hindsight bias in failure analysis**
After an incident, designing only for that specific failure. The seductive clarity of post-hoc reconstruction makes failures seem more predictable than they were — and focuses design energy on the last failure rather than the next one.

**6. Overspecification that eliminates adaptive capacity**
Designing systems so tightly that practitioners cannot improvise when reality deviates from the model. Real complex work requires adaptation. Overspecification makes the system brittle precisely in the situations where flexibility matters most.

**7. The expert bottleneck by design**
Building a system where a single expert (human or AI) is the required gateway for all critical decisions. Even when that expert is excellent, this creates catastrophic fragility. CSE calls for distributing expertise, not concentrating it.

---

## Shibboleths

*How to tell if someone has genuinely internalized CSE vs. read a summary:*

**They say "errors are interesting"** — not "errors are problems." Someone who has absorbed CSE treats a failure report as a research opportunity, not a ticket to close.

**They ask "is this the right problem?" before "what's the solution?"** — and they're willing to spend real time on that question even when it delays visible progress. They've seen the nuclear plant case and know what the answer can be worth.

**They resist requirements lock without cognitive analysis** — not as obstruction but because they understand that locking requirements before you understand the cognitive structure of work is a specific, named, predictable way to build the wrong thing.

**They think in joint systems** — when analyzing a failure or designing a solution, they instinctively ask "where does this sit in the full cognitive system?" not "what should this component do?"

**They know what tacit knowledge costs** — they don't expect experts to be able to tell them what they need to know. They've internalized that expertise is largely inaccessible to introspection and plan their elicitation methods accordingly.

**They treat the iterative nature of design as signal, not noise** — when a problem statement changes mid-project, they read it as the process revealing something real, not as a planning failure to be managed.

**They can name the five failure modes** — automation surprise, wrong problem statement, stove-piping, overspecification, expert bottleneck — and apply them diagnostically to novel situations, not as a checklist.

**What they don't say**: "We just need better requirements." "If we document the process, the system will follow it." "The users just need training." "We can evaluate the AI tool independently of how operators use it."

---

*Load reference files on demand as specific situations arise. The SKILL activates with this file; deeper analysis requires the references.*