---
license: Apache-2.0
name: rapport-based-elicitation
description: Interview techniques using rapport-building to improve information quality and yield from sources
category: Cognitive Science & Decision Making
tags:
  - rapport
  - elicitation
  - interviewing
  - communication
  - intelligence
---

# SKILL.md: Rapport-Based Elicitation & Information Extraction

license: Apache-2.0
```yaml
metadata:
  name: rapport-based-elicitation
  version: 1.0.0
  source: "Brimbal et al. (2021) — Evaluating the Benefits of a Rapport-Based Approach
    to Investigative Interviews: A Training Study With Law Enforcement Investigators"
  journal: "Law and Human Behavior, Vol. 45, No. 1, pp. 55–67"
  activation_triggers:
    - extracting information from resistant or semi-cooperative systems/agents
    - designing agent orchestration pipelines with sub-agent dependencies
    - diagnosing why a coercive or pressure-based approach is failing to produce output
    - evaluating whether self-reported competence reflects actual behavioral capability
    - building training or evaluation systems for expert performance
    - decomposing complex tasks with hidden sequential dependencies
    - detecting false-confidence failure modes in agent output
```

---

## When to Load This Skill

Activate when the problem involves any of these conditions:

| Condition | Signal Phrases |
|---|---|
| **Resistance encountered** | "It's not cooperating," "keeps giving minimal responses," "stuck in a loop," "sub-agent not producing" |
| **Pressure-based approach failing** | "Tried forcing the output," "prompt engineering isn't working," "adding more constraints made it worse" |
| **Orchestration design** | "How should the orchestrator frame requests to sub-agents?" "Task handoff failing" |
| **Self-assessment reliability** | "The model says it can do X," "the expert said they know this," "confidence score is high but output is wrong" |
| **Sequential task dependencies** | "Parallel subtasks failing," "outputs look wrong but inputs seem fine," "dependency order unclear" |
| **Training / capability evaluation** | "How do we know if training actually worked?" "Evaluating agent behavior under pressure" |
| **False output detection** | "Plausible but wrong output," "confident but fabricated," "high-quality-looking errors" |

**Do NOT activate** for purely technical debugging, straightforward cooperative tasks, or problems where the counterpart system is fully compliant and producing high-quality output.

---

## Core Mental Models

### 1. Coercion Is a Structural Failure Mode, Not a Suboptimal Option
Accusatorial / pressure-based approaches don't merely underperform rapport — they *actively corrupt the output channel*. Forcing output from a resistant system produces:
- Minimal, low-information responses
- Plausible-but-false output manufactured to satisfy the pressure
- Permanent damage to the cooperative substrate needed for future extraction

**Cross-domain translation**: An orchestrator that issues demanding, constraining, or pressure-laden prompts to a sub-agent facing an ambiguous or hard task will receive the agent equivalent of a false confession — well-formed, confident, wrong. The failure is *structurally guaranteed*, not probabilistic.

### 2. Rapport Is a Causal Mechanism with a Non-Skippable Pathway
The empirically established chain is:

```
Rapport Tactics → Perceived Rapport → Willingness to Cooperate → Information Disclosure
```

Each arrow is a *necessary mediation step*. Jumping from tactic to disclosure skips the substrate-building phase. The reason resistant systems stay resistant is almost always a missing mediation step, not a missing output-forcing tactic.

**Cross-domain translation**: In agent orchestration, establishing cooperative preconditions (task framing, authority signaling, resource provision, clear role definition) is not preamble — it IS the mechanism. Skipping it and going straight to the output request will stall at the cooperation step.

### 3. Three Layers Must Be Stacked in Order
Elicitation skill has a required architecture:

| Layer | Tactics | Failure Without It |
|---|---|---|
| **Foundation** (Productive Questioning) | Open-ended questions, non-leading prompts, active listening, free narrative | Higher layers collapse; output is shaped by questioner, not subject |
| **Conversational Rapport** | Autonomy support, empathy, evocation, adaptation | Moderate resistance persists; willingness to cooperate never forms |
| **Relational Rapport** | Self-disclosure, similarity highlighting, reciprocity acts, verification | Deep resistance unchanged; high-stakes disclosure impossible |

Deploying Layer 3 tactics on a Layer 1 deficit doesn't work. Stopping at Layer 1 with a highly resistant counterpart is insufficient. **Layer order is not optional.**

### 4. Self-Reported Competence ≠ Behavioral Competence
Experienced investigators reported moderate-to-high pre-training familiarity with rapport tactics. Blind behavioral coding showed effect sizes of **d = 1.03–1.10** from pre- to post-training. The gap is large, real, and closed only by situated behavioral practice — not by knowing the concepts.

**Implication**: An agent's (or expert's) confidence in its own capability is an unreliable proxy for actual performance under pressure. Systems relying on self-assessment for routing, fallback decisions, or capability evaluation are building on a systematically flawed signal.

### 5. Evidence Alone Does Not Change Dominant Strategy
Even well-validated alternative approaches fail to propagate when:
- Practitioners have anecdotal "success" stories from the dominant approach
- No compelling demonstration exists for the *hardest cases* (resistant subjects)
- Change requires abandoning a strategy that feels like expertise

**Cross-domain translation**: Agent systems trained on a dominant failure-mode strategy will not self-correct based on abstract evidence. Concrete, situated demonstration in the hard cases is the required intervention.

---

## Decision Frameworks

### IF resistant system / non-cooperating sub-agent, THEN:
1. **Do NOT add more pressure or constraints** — this triggers the coercive failure mode
2. Diagnose *which mediation step is missing*: is perceived rapport absent? cooperation substrate not formed?
3. Apply the appropriate layer tactic to the missing step
4. Re-evaluate cooperation level before requesting disclosure

### IF output is high-confidence but suspect, THEN:
- Check whether the system was under output pressure at the time of generation
- Treat confident, well-formed output from a constrained/resistant system as a false-confession candidate
- Apply ground-truth verification, not self-report ("does the output match external evidence?")

### IF task decomposition is failing despite correct sub-tasks, THEN:
- Map the three-layer architecture onto the task: are foundational sub-tasks complete before higher-order ones were dispatched?
- Identify skipped mediation steps (dependency failures masquerading as sub-task failures)
- Resequence in dependency order; re-run

### IF self-assessment or confidence score is being used for routing, THEN:
- Flag the knowing-doing gap risk
- Require behavioral evidence from analogous pressured conditions, not self-report
- Design evaluation against ground truth with blind coding logic

### IF a new approach is failing to be adopted despite evidence of superiority, THEN:
- The bottleneck is likely the absence of a compelling demonstration in hard cases
- Abstract evidence presentation will not move practitioners
- Find the resistant-case demonstration; build that first

### IF orchestrator is designing sub-agent handoffs, THEN:
- Apply the mediation chain: establish cooperative preconditions *before* issuing the output request
- Frame tasks to provide: clear authority, necessary resources, autonomy where possible, explicit role definition
- Treat sub-agent cooperation as something that must be *earned*, not assumed

---

## Reference Files

Load these on demand based on the specific diagnostic need:

| File | Description | Load When |
|---|---|---|
| `references/coercive-vs-rapport-the-failure-mode-of-forcing-output.md` | Why pressure-based approaches structurally guarantee failure in resistant systems; false confession as archetypal agent failure | Diagnosing a coercive approach that's producing plausible-but-wrong output, or designing systems to avoid output-forcing failure modes |
| `references/rapport-as-causal-mechanism-not-social-lubricant.md` | The three-stage pathway (tactic → perceived rapport → cooperation → disclosure) and why rapport is not warmth | Trying to understand why rapport "isn't working," or designing orchestration handoffs that depend on sub-agent willingness |
| `references/three-layer-elicitation-architecture.md` | The stacked architecture of productive questioning, conversational rapport, and relational rapport with specific tactics per layer | Designing a multi-step elicitation or orchestration strategy; choosing which tactics to deploy against which resistance level |
| `references/knowing-doing-gap-in-expert-systems.md` | Empirical evidence that self-reported competence dramatically underestimates the gap from knowing to doing (d = 1.03–1.10) | Evaluating agent or expert capabilities; designing evaluation systems; questioning whether confidence scores are reliable |
| `references/resistance-as-information-not-obstacle.md` | How to read resistance as diagnostic signal rather than problem to overcome; resistance reveals missing mediation steps | Encountering a stuck, minimal-output, or uncooperative sub-agent or counterpart; reframing the intervention strategy |
| `references/evidence-research-practice-gap-as-systemic-failure.md` | Why evidence-based approaches fail to propagate into dominant practice; institutional inertia in expert systems | Trying to change an entrenched strategy in an agent pipeline or organization; understanding why better approaches don't self-adopt |
| `references/mediation-chains-and-skipping-steps.md` | Structural equation model showing that skipping mediation steps causes system failure; sequential dependency requirements | Task decomposition failures; parallel sub-task failures that are actually dependency failures; orchestration handoff debugging |
| `references/training-transfer-and-skill-erosion.md` | What behavioral change requires and why training fails to transfer; skill erosion under pressure; evaluation methodology | Designing training for agents or practitioners; evaluating whether capability gains persist under real conditions |

---

## Anti-Patterns

These are the failure modes the research explicitly documents:

**1. The Pressure Ratchet**
Adding more constraints, more specific requirements, or more demanding prompts when output is insufficient. This replicates the accusatorial approach and structurally guarantees either false output or stonewalling.

**2. Rapport as Preamble**
Treating cooperative framing as a "niceness" step before the real request, rather than as the causal mechanism that makes disclosure possible. Skipping to the output request after a single friendly sentence.

**3. Layer Skipping**
Deploying relational rapport tactics (self-disclosure, reciprocity) without having established foundational productive questioning. The higher layer has no substrate to attach to.

**4. Self-Assessment Routing**
Using an agent's or expert's self-reported confidence to route tasks or evaluate capability. The knowing-doing gap makes this systematically unreliable under pressure.

**5. Resistance as Obstruction**
Treating a resistant counterpart as a problem to overcome rather than as an information source. Resistance signals *which mediation step is missing*, not that the approach should be abandoned or escalated.

**6. Evidence-First Persuasion**
Trying to change a dominant strategy by presenting abstract evidence for the alternative. Without compelling demonstration in the hard cases, evidence alone does not move practitioners.

**7. False Confession Acceptance**
Accepting well-formed, confident output from a pressured or constrained system without ground-truth verification. High confidence + high pressure = highest false-output risk.

**8. Parallel Dispatch Without Dependency Mapping**
Decomposing a task into parallel sub-tasks without identifying sequential dependencies — the task-level analog of skipping mediation chain steps.

---

## Shibboleths

How to tell if someone has *internalized* this book versus just read the summary:

**They understand rapport as mechanism, not mood**
> ❌ "Build rapport first to make them comfortable"
> ✅ "Rapport tactics work by creating perceived rapport, which enables cooperation, which enables disclosure — those are three distinct steps that can each fail independently"

**They read resistance diagnostically**
> ❌ "They're being resistant, we need to apply more pressure"
> ✅ "Resistance tells me which step in the mediation chain is missing — let me diagnose before intervening"

**They treat self-report as a lagging indicator**
> ❌ "The expert says they know how to do this"
> ✅ "Self-reported competence and behavioral competence are empirically separable; I need to see behavioral evidence under pressure"

**They know the direction of the knowing-doing gap**
> ❌ "After training, people know more about rapport"
> ✅ "They already *knew* about rapport — training changed their *behavior*, d = 1.03, which is enormous. The knowing was never the bottleneck."

**They understand why coercion produces false output specifically**
> ❌ "Coercion doesn't work as well as rapport"
> ✅ "Coercion produces the false confession problem: it doesn't get no output, it gets *confident wrong output*. That's the catastrophic failure mode, worse than silence."

**They recognize the demonstration bottleneck**
> ❌ "If we show the evidence, they'll adopt the better approach"
> ✅ "Practitioners won't abandon their dominant strategy without compelling demonstration in the hard cases — their resistant-subject scenarios, specifically. Evidence without demonstration won't move them."

**They can identify layer mismatches in their own systems**
> ❌ "We're using all the rapport tactics"
> ✅ "We're using Layer 3 tactics on a Layer 1 foundation deficit. The foundational questioning isn't open-ended enough, so the conversational and relational layers have nothing to build on."

---

*Last updated: generated from Brimbal et al. (2021). Load reference files for depth; this file is the index.*