---
name: knowledge-elicitation-of-recognition-pri
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  provenance:
    kind: legacy-recovered
    owners:
    - some-claude-skills
---
# SKILL.md: Recognition-Primed Decision Making & Knowledge Elicitation

license: Apache-2.0
```yaml
metadata:
  name: Recognition-Primed Decision Making (Klein & MacGregor)
  source: "Knowledge Elicitation of Recognition-Primed Decision Making (ARI Technical Report 799)"
  authors: Gary A. Klein, Donald MacGregor
  description: >
    Foundational model of how experts actually decide under time pressure —
    through pattern recognition and serial option validation, not option
    comparison. Includes the Critical Decision Method (CDM) for eliciting
    tacit knowledge, failure modes of expert judgment, and implications for
    building decision-support systems and training tools.
  activation_triggers:
    - Designing agent orchestration or routing logic
    - Building decision-support or decision-aid systems
    - Eliciting or encoding expert knowledge into a system
    - Diagnosing why a system or agent makes poor decisions under pressure
    - Training novices or transferring expertise across a team
    - Analyzing how a complex decision went wrong
    - Designing task decomposition strategies
    - Building systems that must recognize situation types and act accordingly
```

---

## When to Use This Skill

Load this skill when the problem involves **how decisions get made** (not just what gets decided), or when **expert knowledge must be captured, represented, or transferred**.

Specific triggers:

| Situation | Why This Skill Applies |
|-----------|----------------------|
| An agent keeps making poor routing or orchestration decisions | RPD model reveals whether the failure is in situation assessment vs. option selection |
| You're designing a decision aid and it isn't helping experts | Experts don't need better option comparison — they need better SA support |
| A knowledge base feels right to engineers but wrong to domain experts | Knowledge representation misalignment — structural vs. tacit |
| You need to interview an expert to build a training dataset | CDM elicitation methodology applies directly |
| A system works well in routine cases but fails at the boundary | Novice-to-expert spectrum; expertise lives at the routine/novel boundary |
| A coordinator is overwhelmed managing multiple simultaneous threads | Distributed decision-making and span of control |
| An agent produces decisions that seem correct but can't be explained | Tacit knowledge and the knowledge-action gap |
| A trained model performs well in testing but fails in deployment | Situational awareness failure modes — SA shift or SA fixation |

---

## Core Mental Models

### 1. Recognition Over Enumeration
Experts under time pressure do **not** generate and compare options. They recognize a situation as an instance of a familiar type, retrieve the associated response, and either execute immediately or mentally simulate it once to check feasibility. The decision is made *before* any formal comparison occurs. Comparison is a fallback for genuinely novel situations, not the normal mode.

**Implication**: Systems that present experts with ranked option lists are solving the wrong problem. Systems that help experts recognize situation type faster are solving the right one.

### 2. Situation Assessment Is the Bottleneck
The cognitive work separating experts from novices happens almost entirely **before** a course of action is selected: recognizing typicality, identifying critical cues, forming expectations, understanding what goals are achievable. Once assessment is correct, the action is often obvious. Wrong actions trace back to wrong assessments — not to poor option evaluation.

**Implication**: When a decision goes wrong, diagnose the assessment phase first. Don't optimize the decision algorithm when the input model is broken.

### 3. Expertise Lives at the Routine/Novel Boundary
Routine tasks are automatized — experts cannot introspect or articulate them. Genuinely novel tasks don't draw on expertise — the expert is effectively a novice. The productive zone for eliciting, studying, or transferring expertise is **non-routine incidents that required genuine expert judgment** — moments when the pattern library was stretched but not overwhelmed.

**Implication**: Don't ask experts to explain routine procedures (they can't). Don't study their responses to completely unfamiliar situations (irrelevant to expertise). Study the hard calls.

### 4. Tacit Knowledge Is the Core, Not Rules
The most important things experts know cannot be expressed as rules or procedures. This includes: perceptual pattern recognition, analogical case libraries, anticipation of causal dynamics, and recognition of when a standard pattern *doesn't* apply. Traditional knowledge representations (rules, decision trees, flowcharts) systematically fail to capture this — producing systems that experts reject as "missing what matters."

**Implication**: Elicitation methods that ask "what is your rule for X?" will fail. Methods that probe specific incidents (CDM) can surface tacit knowledge obliquely.

### 5. The Knowledge-Action Gap Is Structural, Not Incidental
Experts cannot accurately report their own decision processes. They know more than they can tell (Polanyi's tacit dimension). This is not a communication problem — it's a structural feature of expertise. Self-reports of reasoning are post-hoc reconstructions, not accurate traces. Any elicitation method that relies on experts explaining their reasoning will systematically underrepresent the actual cognitive basis for performance.

**Implication**: Build in triangulation. Use incident probing, counterfactual probing, and error analysis — not just verbal protocols or interviews asking for principles.

---

## Decision Frameworks

### When to Use RPD vs. Analytical Decision-Making
```
IF time pressure is high AND the operator has domain experience
  → Expect and support Recognition-Primed Decision making
  → Optimize for situation assessment speed, not option comparison tools

IF the situation is genuinely novel AND high stakes AND time permits
  → RPD breaks down; analytical comparison becomes appropriate
  → But first check: is the situation truly novel, or just misassessed?

IF the decision-maker is a novice
  → RPD is not available; analytical scaffolding helps
  → Focus on building pattern libraries through case exposure, not rule memorization
```

### Diagnosing a Decision Failure
```
IF a wrong decision was made:
  Step 1: Was the situation assessment correct?
    NO → SA failure (wrong cue weighting, SA shift, SA fixation)
         → Fix: improve monitoring for expectation violations
    YES → Was the recognized course of action inappropriate?
         → Fix: expand case library; review prototype boundaries

IF an agent/system consistently fails at the same situation type:
  → Likely missing a prototype; the situation isn't being recognized as a type at all
  → Fix: elicit cases from experts using CDM; extract distinguishing cues
```

### Choosing a Knowledge Elicitation Method
```
IF you need structural/procedural knowledge (steps, sequences)
  → Task analysis, protocol analysis
  → Warning: captures the skeleton, misses the judgment

IF you need tacit/perceptual/prototypical knowledge
  → Critical Decision Method (CDM): probe specific non-routine incidents
  → Goal: surface cues noticed, expectations formed, options considered/rejected

IF you need to validate what you've elicited
  → Simulation-based probing; present scenarios and observe decisions
  → Compare to CDM outputs — mismatches indicate gaps

IF knowledge base feels complete to engineers but wrong to experts
  → Knowledge representation misalignment
  → Load: references/knowledge-representation-and-system-design-alignment.md
```

### Designing Decision Support Systems
```
IF building a system to help experts decide:
  → DO support situation assessment (cue presentation, expectation surfacing)
  → DO support mental simulation (what happens if I do X?)
  → DO NOT build option ranking/scoring as the primary interface
  → DO NOT optimize for novice explainability at the cost of expert workflow

IF building a system to replace expert judgment:
  → The RPD model should make you humble about this
  → Routine cases: automation is viable
  → Non-routine cases: automation will fail where experts succeed
  → Boundary detection (routine vs. non-routine) is itself an expertise problem
```

### Managing Multi-Thread Decisions
```
IF an orchestrator/coordinator is managing multiple simultaneous tasks:
  → Span of control is the binding constraint, not decision quality per thread
  → Design for chunking: related decisions should be routed to the same agent
  → Explicitly track "what did I expect to see here?" — flag violations
  → Load: references/distributed-decision-making-and-span-of-control.md
```

---

## Reference Files

Load these on demand when deeper guidance is needed. Do not load all at once.

| File | When to Load |
|------|-------------|
| `references/recognition-primed-decision-model.md` | Core architecture of RPD: the three levels (simple match, diagnosed, creative), mental simulation, the role of prototypes. Load when designing agent routing, understanding how experts decide, or explaining why option-comparison tools fail. |
| `references/situational-awareness-as-primary-cognitive-work.md` | SA as the pre-decision bottleneck: cue identification, expectation formation, goal prioritization. Load when diagnosing decision failures, designing monitoring systems, or building agents that must track dynamic environments. |
| `references/tacit-knowledge-elicitation-for-agent-systems.md` | Why experts can't explain their expertise, and what to do about it. Load when building knowledge bases, interviewing domain experts, or explaining why a knowledge base feels "thin" despite extensive documentation. |
| `references/failure-modes-of-expert-decision-making.md` | SA shift, SA fixation, cue misweighting, prototype mismatch. Load when analyzing a past decision failure, designing error-detection systems, or building adversarial test cases for agent systems. |
| `references/novice-to-expert-spectrum-and-knowledge-transfer.md` | What changes as expertise develops; implications for training and system scaffolding. Load when designing training pipelines, onboarding systems, or diagnosing why a system trained on expert data underperforms with novice users. |
| `references/knowledge-elicitation-methods-and-their-limits.md` | CDM methodology, protocol analysis, structured interviews — when each works and why each fails. Load when designing an expert interview process, building a training dataset, or auditing an existing knowledge elicitation pipeline. |
| `references/option-evaluation-the-serial-vs-concurrent-distinction.md` | Why experts evaluate options serially (one at a time, satisficing) rather than concurrently (comparing all options). Load when designing decision algorithms, reviewing why an analytical system doesn't match expert behavior, or choosing between architectural approaches. |
| `references/knowledge-representation-and-system-design-alignment.md` | The mismatch between how expert knowledge is structured cognitively vs. how it's represented in systems. Load when a knowledge base is rejected by domain experts, when a system fails to generalize, or when designing the schema for a new knowledge base. |
| `references/distributed-decision-making-and-span-of-control.md` | How expert decision-making works across multiple simultaneous threads; coordination overhead; span of control limits. Load when designing multi-agent orchestration, diagnosing coordination failures, or building systems that manage concurrent workstreams. |

---

## Anti-Patterns

These are the mistakes Klein and MacGregor most directly warn against:

**1. Building option-comparison tools for experts**
Presenting experts with ranked alternatives, scoring matrices, or expected utility calculations. Experts don't decide this way. These tools impose a cognitive model that conflicts with expertise, creating friction without benefit.

**2. Asking experts "what is your rule for X?"**
Abstract rule elicitation produces post-hoc rationalizations, not actual decision logic. The resulting rules are incomplete, brittle, and rejected by the experts who supposedly provided them.

**3. Treating situational assessment as preprocessing**
Designing systems where "situation recognition" is a quick first step before the "real" decision logic runs. In expert performance, situation assessment *is* the decision. Underinvesting here guarantees underperformance.

**4. Assuming routine task documentation captures expertise**
Standard operating procedures and task analyses capture what happens in routine cases — the cases where expertise is least engaged. The resulting knowledge base is accurate but shallow, missing the judgment calls that determine performance under stress.

**5. Conflating "can't explain it" with "doesn't know it"**
When experts struggle to articulate their reasoning, the failure is in elicitation method, not in expert knowledge. Responding by interviewing more experts or asking harder questions will fail. The method must change (→ CDM).

**6. Optimizing novice performance at the cost of expert workflow**
Systems designed for explainability, step-by-step guidance, and confirmation dialogs help novices and impede experts. The two populations need different system architectures, not a single design that tries to serve both.

**7. Assuming deployment context matches training context**
SA-shift failures occur when the operator's situational model drifts from reality. Systems fail in deployment when their embedded situational model no longer matches the domain. Neither experts nor systems automatically detect this drift without active expectation-monitoring.

---

## Shibboleths

How to tell if someone has actually internalized Klein and MacGregor vs. read a summary:

**They have internalized it if they:**
- Immediately ask "what was the situation assessment?" when analyzing a decision failure — not "which option did they pick?"
- Describe expert decision-making as *satisficing through serial simulation*, not as *selecting from ranked options*
- Distinguish between three RPD levels (simple recognition, diagnosed, creative) and explain when each applies
- Treat "I don't know how I knew" from an expert as *the start of an elicitation problem*, not the end of one
- Know that CDM probes **incidents**, not **principles** — and can explain why this distinction matters
- Identify *expectation violations* as the key signal for situational model reassessment
- Understand that prototypical knowledge is **irreducibly holistic** — you cannot decompose it into independently learnable parts
- Recognize that the best decision support for experts improves *situation assessment*, not *option selection*

**They have only read the summary if they:**
- Describe RPD as "experts use intuition instead of analysis"
- Say experts are "faster" at decision-making without explaining *what they skip and why*
- Think CDM is just "a thorough interview technique"
- Believe tacit knowledge can be captured by asking experts to "think aloud"
- Treat the novice-expert distinction as primarily about speed or accuracy rather than cognitive architecture
- Recommend "decision support tools" that present ranked options to experienced operators
- Assume that a knowledge base validated by experts is correctly *represented* just because experts agree with the facts it contains