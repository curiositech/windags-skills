---
license: Apache-2.0
name: huang-et-al-2026-six-sigma-agent
description: Application of Six Sigma quality methodology to AI agent process improvement and reliability
category: Research & Academic
tags:
  - six-sigma
  - quality
  - agents
  - process-improvement
  - methodology
---

# SKILL.md: Six Sigma Agent Architecture

license: Apache-2.0
## Metadata
```yaml
name: six-sigma-agent
description: Enterprise-grade reliability engineering for LLM agent systems through consensus-driven decomposed execution
triggers:
  - "agent reliability"
  - "production AI systems"
  - "multi-step workflow"
  - "agent error rates"
  - "consensus voting"
  - "task decomposition"
  - "six sigma"
  - "Byzantine fault tolerance"
  - "agent coordination"
  - "enterprise AI deployment"
version: 1.0
source: "The Six Sigma Agent (Lyzr Research, 2024)"
```

## When to Use This Skill

Load this skill when facing:

- **High-stakes production deployments** where AI errors have significant business consequences
- **Complex multi-step workflows** where small per-step error rates compound catastrophically
- **Enterprise reliability requirements** (99.9%+ success rates, Six Sigma standards)
- **Budget constraints** that make using frontier models for every task prohibitively expensive
- **Coordination failures** in existing multi-agent systems where agents working together underperform
- **Uncertainty about task granularity** — unclear how to decompose complex tasks for reliable execution
- **Trade-offs between cost and reliability** — need to optimize for both simultaneously
- **Verification challenges** in agent outputs where ground truth is difficult to establish

This framework applies when you need **mathematical guarantees about system reliability** rather than empirical "it usually works" confidence.

## Core Mental Models

### 1. Error Compounding: The Exponential Decay Law

**The fundamental challenge**: In sequential workflows, reliability degrades exponentially with each step.

```
P(workflow_success) = (1 - p)^m
where p = per-step error rate, m = number of steps
```

**Implications**:
- 99% per-step accuracy → 36.6% success at 100 steps → 0.004% at 1000 steps
- Even frontier models (GPT-4: 1-5% error rates) hit sub-1% workflow success quickly
- **You cannot solve this by improving the model alone** — architectural solutions are required
- This is why "just use GPT-5" is not a production strategy for complex workflows

**Key insight**: The problem isn't that models are bad; it's that *multiplicative compound decay* dominates at scale, regardless of base accuracy.

### 2. Consensus Voting: Exponential Reliability from Redundancy

**The mathematical breakthrough**: Sample n independent executions and take the majority vote.

```
P(system_error) = O(p^⌈n/2⌉)
where p = individual agent error rate, n = number of voters (odd)
```

**Concrete example**:
- 5 agents, each with 5% error rate
- System error: (0.05)^3 = 0.0125% (exponential improvement)
- This is **14,700× more reliable** than a single agent with 1% error

**Why it works**:
- Independent failures are unlikely to align on the same wrong answer
- Majority voting filters out individual errors statistically
- More voters → exponentially lower probability all make the same mistake

**Critical requirement**: Only works when tasks are truly atomic (see Mental Model #3).

### 3. Atomic Decomposition: The Foundation for Consensus

**The core principle**: Consensus voting requires tasks decomposed to **minimal, verifiable, functionally deterministic units**.

**Why atomicity matters**:
- **Comparable outputs**: Multiple agents must produce outputs that can be directly compared for voting
- **Deterministic outcomes**: Given the same context, correct execution should converge to the same answer
- **Verification feasibility**: Small enough scope that correctness can be evaluated reliably
- **Independence preservation**: Each atomic action should have minimal dependencies

**Bad decomposition** (too coarse):
```
Task: "Analyze this dataset and create a report"
Problem: Too many degrees of freedom — agents will produce incomparable outputs
```

**Good decomposition** (atomic):
```
Task 1: "Extract the numerical values from column 'Revenue' in rows 10-20"
Task 2: "Calculate the mean of these values"
Task 3: "Compare this mean to 150000 and return 'above' or 'below'"
```

**Quality criteria**:
- Single, well-defined objective per action
- Minimal context dependencies
- Output format strictly specified
- Success/failure clearly definable

### 4. Dynamic Scaling: Converting Disagreement into Verification

**The adaptive mechanism**: Use initial vote disagreement as an uncertainty signal.

**How it works**:
1. Start with minimum viable redundancy (n=5)
2. If vote is contested (3-2 split), automatically scale to n=7, then n=9, up to n=13
3. Stop when clear majority emerges or max scale reached

**Why this is elegant**:
- **Cost-efficient**: Only 11% of actions require scaling in practice
- **Self-correcting**: System detects its own uncertainty automatically
- **No manual tuning**: Disagreement pattern is the objective indicator
- **Maintains guarantees**: Each scaling step increases reliability exponentially

**Practical insight**: Contested votes reveal genuinely ambiguous cases where additional verification is worthwhile — the system's "doubt" is information.

### 5. The Multi-Agent Paradox: Redundancy Beats Collaboration

**The counterintuitive finding**: Multi-agent systems where agents perform *different* roles often underperform single agents.

**Why collaboration fails**:
- **Coordination overhead**: Agents must communicate, negotiate, and synchronize
- **Task verification failures**: Hard to verify correctness of interdependent subtasks
- **Compounding errors**: Mistakes in one agent's output propagate to dependent agents
- **Handoff brittleness**: Information loss and misinterpretation at role boundaries

**Why redundancy succeeds**:
- **No coordination required**: All agents execute identical tasks independently
- **Statistical error correction**: Consensus filters individual mistakes
- **Mathematical guarantees**: Formal reliability proofs hold
- **Simpler architecture**: No complex communication protocols

**Design principle**: *Identical parallel execution* > *Differentiated collaborative execution*

## Decision Frameworks

### Framework 1: When to Apply Consensus Architecture

**IF** you have a multi-step workflow with reliability requirements, **THEN**:

1. **Calculate compound error risk**:
   - Estimate per-step error rate (p) and number of steps (m)
   - If (1-p)^m < required reliability → architectural solution needed
   
2. **Evaluate atomicity feasibility**:
   - Can workflow be decomposed to verifiable atomic actions?
   - If YES → consensus architecture applicable
   - If NO → examine what's blocking decomposition (load `atomic-decomposition-consensus-effectiveness.md`)

3. **Assess independence assumption**:
   - Will agents make truly independent errors?
   - If systematic errors possible (e.g., ambiguous instructions) → improve task specification
   - Correlation ρ ≤ 0.99 still achieves Six Sigma; perfect independence not required

### Framework 2: Choosing Redundancy Level (n)

**IF** implementing consensus voting, **THEN**:

- **Start with n=5** (standard baseline)
  - Achieves p^3 reliability (e.g., 0.0125% with 5% base error)
  - Cost: 5× single execution
  
- **Use dynamic scaling** if:
  - Cost sensitivity is moderate (willing to pay 5-13× for reliability)
  - Tasks have variable difficulty (some are genuinely ambiguous)
  - Goal: Six Sigma (3.4 DPMO) with minimal cost
  
- **Use fixed n=13** if:
  - Absolute reliability is paramount
  - Cost is secondary concern
  - Achieves p^7 reliability (e.g., 7.8×10^-10 with 5% base error)

### Framework 3: Model Selection Strategy

**IF** optimizing cost vs. reliability, **THEN**:

```
Counterintuitive result: 5× cheap models often > 1× expensive model
```

**Decision matrix**:
- **Frontier model alone** (GPT-4 Turbo, Claude 3.5):
  - Use when: Single-step tasks, non-critical applications
  - Reliability: ~99% per-action
  - Cost: High per call

- **Mid-tier consensus** (5× GPT-3.5 or similar):
  - Use when: Multi-step workflows, moderate stakes
  - Reliability: ~99.99% per-action (with 5% base error)
  - Cost: Often lower than single frontier call
  - Load `cost-efficiency-through-model-diversity.md` for detailed economics

- **Hybrid approach**:
  - Cheap models for atomic actions with consensus
  - Frontier model for final synthesis/presentation
  - Best of both: reliability + quality

### Framework 4: Diagnosing Multi-Agent Failures

**IF** your existing multi-agent system underperforms expectations, **THEN**:

1. **Identify failure category** (see MAST-Data taxonomy):
   - **Coordination failures**: Agents miscommunicate or work at cross-purposes
   - **Task verification failures**: Can't reliably check if subtask succeeded
   - **Individual agent errors**: Compounding through workflow

2. **Consider architectural pivot**:
   - Instead of N agents with different roles (planner, executor, critic)...
   - Try N agents executing same atomic actions with consensus
   - Load `multi-agent-coordination-failures.md` for detailed analysis

3. **If coordination is necessary**:
   - Keep collaborative agents for high-level orchestration
   - Use consensus redundancy for low-level atomic execution
   - Hybrid architecture preserves benefits of both

## Reference Files

| File | Description | Load When... |
|------|-------------|--------------|
| `error-compounding-and-workflow-reliability.md` | Mathematical foundations of exponential decay in multi-step workflows; formal proofs of why model improvement alone cannot achieve Six Sigma | Designing production workflows; justifying architectural investments; calculating reliability requirements |
| `consensus-voting-exponential-reliability.md` | Core mathematical framework for consensus voting; proofs of O(p^⌈n/2⌉) reliability; analysis of error correlation constraints | Implementing consensus mechanisms; choosing redundancy levels; understanding independence requirements |
| `atomic-decomposition-consensus-effectiveness.md` | Detailed criteria for task decomposition; formalization of atomicity properties; examples of good vs. bad decomposition | Breaking down complex tasks; troubleshooting why consensus isn't working; training agents to decompose effectively |
| `dynamic-scaling-uncertainty-detection.md` | Mechanism design for adaptive redundancy; contested vote patterns as uncertainty signals; cost optimization strategies | Implementing dynamic scaling; balancing cost and reliability; handling variable-difficulty tasks |
| `cost-efficiency-through-model-diversity.md` | Economic analysis of model selection; case studies showing when cheap consensus beats expensive single models; ROI calculations | Budget planning; model selection decisions; justifying consensus overhead to stakeholders |
| `multi-agent-coordination-failures.md` | Empirical evidence that collaboration often fails; taxonomy of failure modes; comparison of collaboration vs. redundancy architectures | Diagnosing multi-agent system failures; deciding between collaborative vs. consensus architectures; understanding coordination overhead |
| `task-verification-failure-prevention.md` | Architectural patterns for preventing verification failures; relationship between atomicity and verifiability; design principles for testable actions | Designing verification mechanisms; troubleshooting false positives/negatives; ensuring atomic actions are truly verifiable |

## Anti-Patterns

### ❌ "Just Use a Better Model"
**Mistake**: Believing GPT-5 or Claude-4 will solve reliability problems.

**Why it fails**: Error compounding is exponential. Even 0.1% per-step error → 90.5% at 100 steps. You can't model your way out of O(p^m) decay.

**Correct approach**: Accept that all models are probabilistic; build architecture for reliability.

### ❌ Coarse-Grained Consensus
**Mistake**: Applying consensus voting to complex, multi-faceted tasks.

**Example**: "Write a financial analysis report" × 5 agents → vote on best report

**Why it fails**: Outputs are too diverse to meaningfully "vote" on. No clear majority emerges. Consensus requires comparable atomic outputs.

**Correct approach**: Decompose to atomic units first, *then* apply consensus. Vote on specific extractable facts, calculations, or classifications.

### ❌ Collaborative Multi-Agent as Default
**Mistake**: Designing systems where agents have differentiated roles (researcher, writer, critic) without considering redundancy.

**Why it fails**: Coordination overhead, task verification failures, and handoff brittleness often negate benefits. Empirically underperforms in many cases.

**Correct approach**: Start with redundant consensus architecture. Only add collaboration when coordination complexity is demonstrably worth it.

### ❌ Ignoring Error Correlation
**Mistake**: Assuming consensus works with any set of agents, ignoring that they might make the same systematic errors.

**Example**: All agents misinterpret ambiguous instruction identically → consensus on wrong answer.

**Why it fails**: Mathematical guarantees assume independent errors. High correlation (ρ > 0.99) breaks exponential improvement.

**Correct approach**: Ensure task specifications are unambiguous. Test for systematic errors. Framework tolerates ρ ≤ 0.99, but lower is better.

### ❌ Static Redundancy Without Adaptation
**Mistake**: Always using n=13 agents (maximum reliability) for every action.

**Why it fails**: Massive unnecessary cost. Most actions don't need that much redundancy.

**Correct approach**: Use dynamic scaling. Start with n=5, scale only on contested votes. Achieves Six Sigma with 89% of actions at base redundancy.

### ❌ Skipping Decomposition
**Mistake**: Feeding complex, end-to-end tasks directly to consensus system.

**Example**: "Build a customer segmentation model" × 5 agents → vote

**Why it fails**: Task is not atomic. Agents will diverge in approach. No meaningful consensus possible.

**Correct approach**: Decompose ruthlessly. Every action should be minimal, verifiable, functionally deterministic.

## Shibboleths: Signs of True Understanding

### ✅ They Talk About Error *Multiplication*, Not Addition
**Surface**: "We need 99% accuracy, so let's improve the model."

**Deep**: "With 99% per-step accuracy, we're at 36% for 100 steps due to (0.99)^100. The exponential dominates everything."

### ✅ They Prioritize Decomposition Over Model Selection
**Surface**: "Let's use GPT-4 for reliability."

**Deep**: "First, can we decompose this to atomic actions? If yes, 5× GPT-3.5 with consensus will likely outperform 1× GPT-4 and cost less."

### ✅ They Distinguish Redundancy from Collaboration
**Surface**: "We have a multi-agent system with 5 agents working together."

**Deep**: "Are they executing different tasks collaboratively or identical tasks redundantly? The mathematics only hold for redundant execution with consensus."

### ✅ They Use Contested Votes as Information
**Surface**: "The vote was 3-2, so majority wins."

**Deep**: "A 3-2 vote signals genuine uncertainty. We should scale to n=7 for additional verification on this specific action."

### ✅ They Calculate System Error, Not Agent Error
**Surface**: "Each agent has 5% error rate."

**Deep**: "With n=5 consensus, our *system* error is (0.05)^3 = 0.0125%. That's the number that matters for workflow reliability."

### ✅ They Design for Verifiability
**Surface**: "This task is too complex for the model."

**Deep**: "Is this task atomic enough that we can verify correctness? If not, how do we decompose it until verification becomes feasible?"

### ✅ They Know When Consensus *Doesn't* Apply
**Surface**: "Consensus voting solves everything."

**Deep**: "Consensus requires deterministic atomic tasks. For creative tasks with legitimate multiple valid outputs, we need different approaches. This is a scalpel, not a hammer."

### ✅ They Cite the Correlation Bound
**Surface**: "Agents need to be independent."

**Deep**: "The framework achieves Six Sigma even with error correlation ρ ≤ 0.99. Perfect independence isn't required—we need to stay below that threshold."

---

## Quick Reference: Key Equations

```
Error Compounding:
P(workflow_success) = (1 - p)^m

Consensus Reliability:
P(system_error) = O(p^⌈n/2⌉)

Six Sigma Target:
3.4 DPMO = 0.00034% error rate = 99.99966% reliability

Cost-Reliability Trade-off:
5 agents @ 5% error > 1 agent @ 1% error (14,700× more reliable)
```

## Integration Points

This framework connects to:
- **Distributed Systems Theory**: Byzantine fault tolerance, Paxos consensus
- **Quality Engineering**: Six Sigma methodology, defect prevention
- **Economic Optimization**: Cost-quality trade-offs, ROI analysis
- **Software Architecture**: Redundancy patterns, fault tolerance
- **ML Systems Design**: Model selection, ensemble methods

---

*For implementation details, mathematical proofs, and empirical validation, load the appropriate reference file from the table above.*