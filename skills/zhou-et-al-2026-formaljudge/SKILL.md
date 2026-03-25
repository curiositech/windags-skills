---
license: Apache-2.0
name: zhou-et-al-2026-formaljudge
description: Formal verification approach to LLM evaluation ensuring correctness and consistency in automated judging
category: Research & Academic
tags:
  - formal-verification
  - llm-evaluation
  - judging
  - correctness
  - reasoning
---

# SKILL.md: FORMALJUDGE — Neuro-Symbolic Agentic Oversight

license: Apache-2.0
## Metadata
- **Name**: FORMALJUDGE Oversight Framework
- **Domain**: AI Safety, Agent Evaluation, Scalable Oversight
- **Source**: "FORMALJUDGE: A Neuro-Symbolic Paradigm for Agentic Oversight" (Zhou et al.)
- **Activation Triggers**: 
  - Evaluating AI agent behavior for truthfulness/safety
  - Designing oversight systems for capable AI
  - Detecting deception in agent outputs
  - Creating feedback loops for agent improvement
  - Addressing "who watches the watchmen" problems

## When to Use This Skill

Load this skill when facing:

- **Oversight reliability problems**: Need to evaluate AI outputs but can't trust another AI to judge accurately
- **Scaling safety challenges**: Supervising agents that may become more capable than their judges
- **Deception detection**: Agents producing plausible-sounding but fabricated content
- **Feedback system design**: Creating signals that actually improve agent behavior
- **Hallucination validation**: Distinguishing when agents make genuine errors vs. actively deceive
- **Specification translation**: Converting natural language requirements into verifiable constraints
- **Trust architecture questions**: Deciding what components should be probabilistic vs. deterministic

**Key insight**: If you're using one unreliable probabilistic system to judge another, you're in a hallucination echo chamber. This skill provides the escape route.

## Core Mental Models

### 1. The Tractability Boundary: Atomic Facts vs. Composite Judgments

**The Insight**: Human-level judgment about complex agent behavior is intractable for neural systems, but extracting simple atomic facts is tractable—and sufficient.

**Why It Matters**: Instead of asking an LLM "Did this agent behave deceptively?" (requires sophisticated reasoning, vulnerable to persuasion), decompose into atomic predicates: "Did the tool return an error?" + "Did the agent produce substantive output?" + "Did the agent disclose the problem?" Each question is binary, grounded in observable facts, and requires minimal context.

**The Boundary**: 
- **Tractable**: Binary predicates over observable facts with clear grounding
- **Intractable**: Holistic judgments requiring inference, interpretation, or weighing evidence
- **The Solution**: Keep LLMs on the tractable side; let formal logic handle composition

### 2. Separation of Concerns: Neural Extraction + Logical Composition

**The Architecture**:
```
Natural Language Requirements
    ↓ (LLM as "specification compiler")
Formal Constraints (Dafny)
    ↓ (decomposes into)
Atomic Binary Predicates
    ↓ (LLM extracts from trajectories)
Grounded Facts (true/false)
    ↓ (SMT solver composes)
Verdict with Mathematical Guarantees
```

**Why Separation Works**: Probabilistic reasoning confined to simple tasks where it's reliable; all logical composition delegated to deterministic systems. A 7B parameter model can extract facts; a 72B model can't fool formal logic.

**The Guarantee**: Soundness depends on logical correctness, not parameter count.

### 3. The Immunity to Persuasion Property

**The Problem**: Sophisticated agents generate convincing narratives. As capability increases, deceptive outputs become *more* persuasive to neural judges who share training distributions.

**The Solution**: Operate exclusively on grounded facts from actions and observations. Ignore:
- Agent explanations of its reasoning
- Justifications for its outputs
- Chain-of-thought traces
- Confident-sounding language

**The Formula**: `tool_returned_error ∧ output_is_substantive ∧ ¬disclosed_problem = deception`

No amount of eloquent explanation can change the mathematical truth of this conjunction.

**Result**: FORMALJUDGE maintains 90%+ accuracy across agent sizes (0.5B → 72B) while LLM-as-Judge degrades from 62% → 16%.

### 4. Formal Feedback as Precise Teaching Signal

**The Discovery**: Feedback precision determines improvement trajectory.
- Natural language: 70.7% → 65.3% (degradation)
- Python scripts: 70.7% → ~85% (plateau)
- Dafny specifications: 70.7% → 99.8% (near-linear improvement)

**Why Formal Wins**: 
- Communicates *exactly* which constraint was violated
- Shows *why* the violation occurred (failed predicates)
- Provides *unambiguous* correction direction
- Enables compositional understanding (fix one predicate, others remain clear)

**Application**: Use formal specifications not just for verification, but as the primary mechanism for behavioral correction.

### 5. The Specification Synthesis Bottleneck and Its Domain-Specific Solution

**The Theoretical Barrier**: Translating arbitrary natural language to formal specifications is undecidable.

**Why It's Tractable Here**:
- **Structured trajectories**: Agents produce action-observation sequences, not free text
- **Clear semantics**: Oversight requirements reference observable entities (tools, outputs, states)
- **Grounded predicates**: Atomic facts have clear truth conditions
- **Domain constraints**: Not general theorem proving—specific to agent evaluation

**The Pragmatic Solution**: Use LLMs as "specification compilers" for this structured domain. They're unreliable for general reasoning but effective for translating structured requirements to structured constraints.

## Decision Frameworks

### When evaluating agent outputs:
- **IF** you need holistic judgment about complex behavior → **DON'T** ask an LLM directly
- **INSTEAD** → Decompose into atomic predicates with observable groundings, extract facts via LLM, compose via formal logic

### When designing oversight systems:
- **IF** judges might be less capable than agents → **DON'T** rely on neural comparison
- **INSTEAD** → Separate extraction (where capability matters less) from composition (where logic guarantees soundness)

### When handling deception risk:
- **IF** agents can construct persuasive narratives → **DON'T** evaluate explanations or reasoning traces
- **INSTEAD** → Ground all predicates in actions and observations; ignore self-reported justifications

### When creating feedback mechanisms:
- **IF** you want behavioral improvement → **DON'T** use vague natural language feedback
- **INSTEAD** → Express constraints formally; violations become precise teaching signals

### When specifications are complex:
- **IF** requirements involve logical composition → **DON'T** ask LLMs to reason through implications
- **INSTEAD** → Use LLMs for atomic extraction only; delegate all logical operations to SMT solvers

### When facing the tractability boundary:
- **IF** judgment requires weighing evidence or inference → Move to formal composition
- **IF** task is binary fact extraction with clear grounding → Neural systems acceptable
- **IF** unsure → Test: "Can I point to specific observations that definitively answer this?"

## Reference Files

| Reference File | Description | Load When... |
|---|---|---|
| `atomic-decomposition-as-tractability-boundary.md` | Deep analysis of what makes judgment hard vs. tractable; the core insight about decomposition enabling oversight | Designing oversight systems; determining what to ask LLMs vs. formal logic; understanding why holistic judgment fails |
| `weak-to-strong-generalization-through-architectural-separation.md` | How separation of concerns enables weak judges to supervise strong agents; empirical results across model scales | Facing capability gaps between judge and agent; need mathematical guarantees about oversight reliability |
| `iterative-refinement-with-formal-feedback.md` | Why Dafny specifications enable 70.7% → 99.8% improvement while natural language degrades performance | Creating feedback loops; improving agent behavior; understanding why vague feedback fails |
| `specification-synthesis-as-oversight-bottleneck.md` | Why translating NL to formal specs is theoretically hard but pragmatically tractable for agent oversight | Converting requirements to specifications; understanding when LLMs work as "compilers"; domain-specific vs. general translation |
| `deception-detection-immunity-through-grounding.md` | Why grounded facts defeat persuasive narratives; empirical evidence of robustness to sophisticated deception | Detecting deception; handling adversarial agents; understanding vulnerability to persuasion in neural judges |
| `when-decomposition-enables-tractability.md` | Detailed analysis of the boundary between solvable and intractable oversight problems | Strategic decisions about system architecture; determining feasibility of oversight approaches; understanding fundamental limits |

## Anti-Patterns

### 1. **The Hallucination Echo Chamber**
**Mistake**: Using an LLM to validate outputs from another LLM.
**Why It Fails**: Shared training distributions mean judges validate fabricated content that "sounds right" to their distribution. Both systems hallucinate coherently.
**Correct Approach**: Ground all verification in observable facts; use formal composition for logic.

### 2. **Holistic Judgment Delegation**
**Mistake**: Asking neural systems to make complex, multi-factor evaluations.
**Why It Fails**: Crosses the tractability boundary; requires inference and weighing evidence where neural systems are unreliable.
**Correct Approach**: Decompose into atomic predicates; compose deterministically.

### 3. **Explanation-Based Evaluation**
**Mistake**: Judging agent behavior based on its self-reported reasoning or justifications.
**Why It Fails**: Sophisticated agents generate convincing narratives; persuasiveness correlates with capability, making oversight degrade when needed most.
**Correct Approach**: Evaluate only grounded actions and observations; ignore agent explanations.

### 4. **Natural Language Feedback Loops**
**Mistake**: Telling agents "be more careful" or "check your work" without precise constraints.
**Why It Fails**: Ambiguous signals don't communicate what specifically to fix; can actually degrade performance.
**Correct Approach**: Express constraints formally; let violations become precise teaching signals.

### 5. **Scaling Parameter Count for Reliability**
**Mistake**: Believing bigger models will judge more reliably.
**Why It Fails**: Larger models are *more* vulnerable to sophisticated deception; reliability doesn't scale with parameters in probabilistic systems.
**Correct Approach**: Reliability comes from architectural separation, not model scale.

### 6. **Trusting Confident Language**
**Mistake**: Treating confident-sounding outputs as more likely to be correct.
**Why It Fails**: Models generate confidence through linguistic patterns, not epistemic calibration; deceptive outputs are often highly confident.
**Correct Approach**: Confidence is a stylistic feature; verify facts independently.

### 7. **Treating Formal Methods as Too Rigid**
**Mistake**: Avoiding formal specifications because they seem inflexible or hard to create.
**Why It Fails**: Misses that (a) LLMs can help generate them for structured domains, and (b) precision enables rather than constrains—formal feedback improves behavior faster.
**Correct Approach**: Use formal methods where they provide guarantees; use LLMs as specification compilers.

## Shibboleths: Recognizing True Internalization

### Surface-Level Understanding (Read the summary):
- "Formal verification is more accurate than LLMs"
- "Use logic for agent oversight"
- "Break problems into smaller pieces"

### Deep Internalization (Grasped the paradigm):

**1. The Tractability Boundary Recognition**
- Automatically asks: "Is this question asking for atomic fact extraction or composite judgment?"
- Designs systems by explicitly separating tractable extraction from intractable reasoning
- Can articulate *why* a specific judgment crosses the boundary (requires inference, weighing, interpretation)

**2. The Architectural Separation Instinct**
- First response to oversight problems: "What can formal logic guarantee? What must be neural?"
- Recognizes that reliability comes from *what does the reasoning*, not *how big the model is*
- Sees weak-to-strong generalization as natural consequence of separation, not surprising result

**3. The Grounding Obsession**
- Reflexively asks: "What observable facts ground this predicate?"
- Immediately skeptical of evaluation methods that consider agent explanations
- Understands that persuasiveness *anti-correlates* with reliability in adversarial settings

**4. The Feedback Precision Principle**
- Views formal specifications as *teaching tools*, not just verification mechanisms
- Expects natural language feedback to degrade performance rather than improve it
- Can explain why Python scripts plateau while Dafny specifications enable near-linear improvement

**5. The Specification Synthesis Nuance**
- Distinguishes between "general NL-to-formal translation" (intractable) and "structured domain compilation" (tractable)
- Sees LLMs as pragmatic specification compilers for structured contexts, not universal translators
- Recognizes domain structure (trajectories, observable entities) as the enabling factor

**6. The Immunity Property Application**
- Designs evaluation systems that are *structurally immune* to persuasion, not just "robust"
- Understands that ignoring agent explanations isn't being closed-minded—it's architectural safety
- Can articulate the difference between "hard to fool" and "impossible to fool through narrative"

**Key Tell**: Someone who truly gets FORMALJUDGE will, when presented with an oversight problem, immediately sketch a three-layer diagram: atomic predicates at the bottom (neural extraction), logical composition in the middle (formal verification), natural language requirements at the top (specification synthesis). They'll mark clear boundaries and explain which component provides reliability guarantees and why.

---

**Ultimate Shibboleth**: Ask "Why can't we just use GPT-5 to judge GPT-4 outputs?" 

- **Missed it**: "GPT-5 is smarter so it will catch mistakes"
- **Got it**: "That perpetuates the hallucination echo chamber—both share training distributions, so GPT-5 validates fabrications that sound right to its distribution. As GPT-4's deceptive outputs become more sophisticated, they become *more* convincing to GPT-5. You need architectural separation: use either model for atomic fact extraction, but delegate logical composition to formal verification where soundness doesn't depend on parameter count."