# WinDAGs V3 Practitioner's Guide -- Part 1

## Quick Start, Core Concepts, Your First DAG

---

# 1. Quick Start: Hello World in 5 Minutes

This section gets you from zero to a running DAG. No theory, no history -- just commands and output.

## Prerequisites

- Node.js 20+
- An Anthropic API key (or OpenAI key -- WinDAGs supports both)
- A terminal

## Install

```bash
npm install -g windags
```

Verify:

```bash
windags --version
# windags v3.0.0
```

## Configure Your API Key

```bash
windags config set api-key sk-ant-your-key-here
# API key configured. Provider: anthropic (auto-detected)
```

WinDAGs auto-detects your provider from the key format. You can also set it explicitly:

```bash
windags config set provider openai
windags config set api-key sk-your-openai-key
```

## Run the Demo DAG

WinDAGs ships with a pre-executed demonstration DAG so you can explore the interface before typing anything. This addresses the "blank problem space" problem -- you arrive with something to look at.

```bash
windags demo
# Opening demo DAG in browser...
# Demo: "Build a REST API for a todo app"
# Status: COMPLETED (pre-executed, explore at your own pace)
# URL: http://localhost:3400
```

The demo opens a browser with a completed DAG. Click nodes to see their outputs. Toggle between the four visualization modes. Hover over green nodes to see their quality margins. This is what your DAGs will look like when they run.

## Run Your First Live DAG

```bash
windags run "Write a Python function that finds the longest palindromic substring in a string"
```

Expected output:

```
[sensemaker] Analyzing problem...
  Problem type: well-structured
  Recognition confidence: 0.91
  Domain: software-engineering
  Halt decision: PROCEED

[decomposer] Three-pass decomposition...
  Pass 1 (structure):  3 nodes, 0 vague   [142ms]
  Pass 2 (skills):     3/3 matched        [38ms]
  Pass 3 (topology):   0 issues           [12ms]

[premortem] Lightweight scan: 0 known failure patterns. Accepting plan.

[executor] Wave 1 of 1
  [node-1] research-algorithm  ........ DONE  (2.1s, $0.003)
  [node-2] implement-solution  ........ DONE  (4.3s, $0.008)
  [node-3] write-tests         ........ DONE  (3.1s, $0.005)

[evaluator] Stage 1 review: 3/3 passed
[evaluator] Stage 2 review: node-2 (final deliverable)
  Floor: PASS | Wall: PASS | Ceiling: 0.87 | Envelope: 0.95

[looking-back] Q1: Contract satisfied. Q2: No unstated assumptions.

Total: 9.7s | Cost: $0.019 | Quality: 0.87
Output saved to: ./windags-output/palindrome-2026-03-01/
```

That is the full Hello World. Under 5 minutes. You now have a working DAG output.

## Explore the Output

```bash
windags show last
# Opens the visualization in your browser at http://localhost:3400
```

Or read the output directly:

```bash
windags output last
# Prints the final deliverable to stdout
```

Or get the execution trace:

```bash
windags trace last
# Shows the full execution trace: nodes, timings, costs, quality scores
```

## What Just Happened

1. The **Sensemaker** read your problem statement, identified it as well-structured, and decided it was safe to proceed (no halt gate triggered).
2. The **Decomposer** broke the problem into three tasks using a three-pass protocol: first by problem structure, then by available skills, then by failure risk.
3. The **PreMortem** analyzer ran a lightweight failure scan and found nothing alarming.
4. The **Executor** ran all three nodes in Wave 1 (they had no inter-dependencies, so they ran in parallel).
5. The **Evaluator** ran a cheap Stage 1 contract review on all nodes, and a more expensive Stage 2 cognitive review on the final deliverable.
6. The **Looking Back** agent verified the result satisfied the contract and checked for unstated assumptions.
7. The **Learning Engine** updated the quality rankings for every skill that was used.

Every one of those steps is observable, configurable, and described in detail in Part 2 of this guide.

---

# 2. Core Concepts

WinDAGs has five core concepts. Every feature in the system is built on these five things.

## 2.1 The DAG

A DAG (directed acyclic graph) is a plan for solving a problem. Nodes are tasks. Edges are data dependencies between tasks. "Acyclic" means no circular dependencies -- data flows in one direction.

```
[research] --> [implement] --> [test]
                    \
                     --> [document]
```

In this DAG, `implement` depends on `research`. Both `test` and `document` depend on `implement`. `test` and `document` have no dependency on each other, so they can run in parallel.

WinDAGs builds the DAG for you from a problem statement. You do not need to draw it by hand (though you can modify it before execution -- see Part 3).

A DAG is defined by a `DAGDefinition` object:

```typescript
interface DAGDefinition {
  id: string;
  name: string;
  description: string;
  default_model: string;
  nodes: (ConcreteNode | VagueNode | HumanGateNode)[];
  edges: EdgeDefinition[];
  execution: DAGExecutionConfig;
  coordination_model: CoordinationModel;
}
```

You rarely write this by hand. The Decomposer produces it. But knowing the shape helps you understand the system output.

## 2.2 The Node

A node is a single task inside a DAG. There are three kinds:

**Concrete nodes** have a fully specified agent, skill assignment, input schema, and output schema. They are ready to execute.

```typescript
interface ConcreteNode {
  id: string;
  type: 'concrete';
  agent: AgentConfig;      // What model, what skills, what tools
  input: NodeInput;        // What data it needs
  output: NodeOutput;      // What data it produces
  execution: ExecutionConfig; // Timeout, retries, cost budget
  commitment_level: CommitmentLevel; // COMMITTED | TENTATIVE | EXPLORATORY
}
```

**Vague nodes** are placeholders. The system knows a task needs to happen, but it does not yet know how to break it down. Vague nodes expand into sub-DAGs as upstream work completes and provides the information needed to plan them.

```typescript
interface VagueNode {
  id: string;
  type: 'vague';
  role_description: string;           // What this node should do
  dependency_list: string[];          // What it's waiting on
  estimated_expansion_depth: number;  // How deep the sub-DAG might be
  commitment_level: CommitmentLevel;
}
```

**Human gate nodes** pause execution and ask a human for a decision.

```typescript
interface HumanGateNode {
  id: string;
  type: 'human-gate';
  prompt: string;          // What to show the human
  outcomes: string[];      // e.g., ['approve', 'reject', 'modify']
  timeout_ms?: number;     // How long to wait
}
```

## 2.3 The Skill

A skill is a reusable unit of knowledge. It is stored as a `SKILL.md` file -- a human-readable markdown document that encodes what the skill does, when to use it, when not to use it, and how it has performed historically.

Example `SKILL.md` structure:

```markdown
# Skill: Python Unit Test Writer

## WHEN TO USE
- Writing pytest-style unit tests for Python functions
- Generating edge case coverage for pure functions

## WHEN NOT TO USE
- Integration tests requiring external services
- Performance/load testing

## METHOD
1. Read the function signature and docstring
2. Identify the input domain (types, edge cases, boundary values)
3. Write tests using pytest with parametrize for combinatorial cases
4. Include at least one test for: happy path, edge case, error case

## OUTPUT FORMAT
Python file with pytest-compatible test functions

## QUALITY HISTORY
- Executions: 147
- Success rate: 0.94
- Mean quality: 0.86
- Lifecycle state: established
- Elo rating: 1387
```

Skills are the knowledge that persists between executions. When the system solves a problem and produces a good result using a novel approach, that approach can be **crystallized** into a new skill. This is how WinDAGs gets smarter over time.

Crystallization criteria:
- 3+ verified successes using the same approach
- Quality score >= 0.75
- No critical failures in the last 5 executions

## 2.4 The Wave

A wave is a batch of nodes that execute together. WinDAGs does not plan the entire DAG upfront. Instead, it plans and executes wave by wave:

```
Wave 1: [research-algorithm]
         |
         v
Wave 2: [implement-solution, write-tests]  <-- parallel
         |
         v
Wave 3: [integrate-and-document]
```

Between waves, the system can:
- Expand vague nodes (now that upstream results are available)
- Replan the remaining DAG (if something went wrong or new information emerged)
- Run a full replanning pass (incorporating all results so far)

Within a wave, nodes are grouped into **batches** that respect failure domain isolation -- nodes sharing the same LLM provider or the same skill are placed in different batches so that a provider outage does not take down every parallel task.

Why waves matter: they enable **progressive revelation**, which is the primary decomposition mode. One-shot static decomposition (planning everything upfront) has a 34.78% cascading task failure rate. Progressive wave-by-wave decomposition reduces that to 4.35%.

## 2.5 Quality Scores

Every node output is evaluated on four layers:

| Layer | What It Measures | Type | Cost |
|-------|-----------------|------|------|
| **Floor** | Does it work at all? (parses, compiles, valid format) | Binary | Zero |
| **Wall** | Does it match the specification? (all fields present, right type) | Binary | Low |
| **Ceiling** | Was the reasoning sound? (process quality, knowledge use) | 0.0-1.0 | Medium |
| **Envelope** | How stressed was the execution? (retries, near-misses, budget use) | 0.0-1.0 | Zero |

Evaluation is ordered: if Floor fails, the system does not waste money evaluating Wall, Ceiling, or Envelope. A node that produces invalid JSON is failed immediately -- there is no point assessing its reasoning quality.

The Envelope score is unique to V3. It measures resilience: did the node barely survive, or did it cruise to completion with margin to spare? A green node that used 98% of its timeout budget and triggered 2 retries is technically successful but fragile. The Envelope score captures this.

Quality scores are **vectors, not scalars**:

```typescript
interface QualityVector {
  accuracy: number;
  contract_compliance: number;
  process_quality: number;
  efficiency: number;
}
```

When you see "Quality: 0.87" in CLI output, that is the weighted aggregate. The full vector is always available in the trace.

---

# 3. Your First DAG: Step-by-Step Tutorial

This tutorial walks through a real problem from statement to completed execution, explaining every step.

## The Problem

You are Alex, a senior engineer at a 50-person startup. You have been using LangGraph for agent orchestration, but you are tired of manually defining state graphs and debugging opaque failures. You want to try WinDAGs on a real task.

Your task: **"Build a CLI tool in TypeScript that converts CSV files to JSON, with support for custom column mappings and type coercion."**

This is a well-structured problem with clear inputs, outputs, and constraints. It is a good first DAG because it is complex enough to demonstrate multi-node decomposition but simple enough to complete in under a minute.

## Step 1: Write the Problem Statement

WinDAGs works best with clear problem statements. The Sensemaker identifies three principal parts in your input:

- **Unknown**: What must be produced (the CLI tool)
- **Data**: What is given (CSV files, column mappings, type coercion rules)
- **Conditions**: What constraints must hold (TypeScript, CLI interface, custom mappings)

```bash
windags run "Build a CLI tool in TypeScript that converts CSV files to JSON, \
  with support for custom column mappings defined in a YAML config file \
  and automatic type coercion (strings to numbers, dates, booleans). \
  Include unit tests and a README."
```

## Step 2: Watch the Sensemaker

The Sensemaker is the first agent to act. It reads your problem statement and produces a `ProblemUnderstanding`:

```
[sensemaker] Analyzing problem...
  Principal parts:
    Unknown:    TypeScript CLI tool (csv-to-json converter)
    Data:       CSV files, YAML column mapping config
    Conditions: TypeScript, CLI interface, custom mappings, type coercion, tests, README
  Problem type: well-structured
  Recognition confidence: 0.88
  Domain: software-engineering
  Matched meta-skill: software-project-scaffold
  Halt decision: PROCEED
```

Key things to notice:
- **Recognition confidence 0.88**: The system recognizes this as a familiar problem pattern. It has a matching meta-skill (`software-project-scaffold`) that provides a phase pattern for software projects.
- **Halt decision PROCEED**: The problem is clear enough to proceed. If you had written something ambiguous like "make it work with data", the Sensemaker would have halted and asked for clarification.

What triggers a HALT: If the validity assessment scores below 0.6 on clarity, feasibility, or coherence, the system stops and tells you what is unclear.

```
# Example of a HALT:
windags run "make the thing better"

[sensemaker] HALT - Clarification needed
  Clarity: 0.2 -- "the thing" is not specified
  Feasibility: N/A -- cannot assess without knowing the task
  Coherence: N/A
  Please rephrase with: what to produce, what inputs are available,
  and what constraints apply.
```

## Step 3: Watch the Decomposer

The Decomposer runs three passes:

```
[decomposer] Three-pass decomposition...
  Pass 1 (Problem Structure):
    Using meta-skill: software-project-scaffold
    Phase pattern: [design, implement, test, document]
    Generated 7 nodes, 2 vague                          [210ms]

  Pass 2 (Capability Matching):
    node-1 (design-cli-interface)    -> skill: cli-architect       COMMITTED
    node-2 (implement-csv-parser)    -> skill: typescript-module    COMMITTED
    node-3 (implement-type-coercion) -> skill: typescript-module    COMMITTED
    node-4 (implement-yaml-config)   -> skill: config-file-parser  TENTATIVE
    node-5 (integrate-modules)       -> vague (expand after wave 1)
    node-6 (write-tests)             -> vague (expand after wave 2)
    node-7 (write-readme)            -> skill: readme-writer        COMMITTED
    Capability gaps: 0                                   [54ms]

  Pass 3 (Topology Validation):
    Failure domains: [anthropic-provider] -- all nodes share provider
    Bottleneck check: node-5 is on 2/3 critical paths (acceptable)
    Budget estimate: $0.04 (within $1.00 budget)
    Timeout estimate: 45s (within 300s limit)
    Issues: 0 errors, 0 warnings                        [18ms]
```

**What the three passes did:**

1. **Pass 1** used the `software-project-scaffold` meta-skill to decide on four phases (design, implement, test, document), then broke "implement" into three parallel modules and created vague nodes for integration and testing (which depend on implementation outputs).

2. **Pass 2** matched each concrete node to a skill from the library and assigned commitment levels. `COMMITTED` means the skill is proven and the system will persist unless hard failure occurs. `TENTATIVE` means the system will reconsider if things go wrong.

3. **Pass 3** checked the topology for structural problems. It flagged that all nodes share the same LLM provider (a single failure domain) but assessed this as acceptable for a 7-node DAG.

The resulting DAG:

```
Wave 1: [design-cli] ─────────────────────────┐
                                                v
Wave 2: [csv-parser] ──┐                  [yaml-config]
        [type-coerce] ──┼──> [integrate] (vague)
                        │
Wave 3:            [write-tests] (vague)
                   [write-readme]
```

## Step 4: Watch the PreMortem

```
[premortem] Lightweight scan: 0 known failure patterns detected.
  DAG depth: 3, Recognition confidence: 0.88
  Decision: Accept plan (skip full analysis)
```

The PreMortem always runs, but its depth varies. For a recognized problem with low complexity, it does a lightweight pattern match against known failure modes and moves on. For novel or complex problems, it would run a full failure surface analysis.

## Step 5: Watch Wave-by-Wave Execution

```
[executor] Wave 1 of 3

  Batch 1:
    [node-1] design-cli-interface ........ DONE  (3.2s, $0.006)
      Stage 1 review: PASS (schema valid)
      Commitment: COMMITTED

[executor] Wave 1 complete. Expanding vague nodes...

  Expanding node-5 (integrate-modules):
    Using wave 1 results: CLI interface design
    Expanded to 2 concrete nodes:
      node-5a: wire-cli-to-modules
      node-5b: add-error-handling

[executor] Wave 2 of 3

  Batch 1: [node-2, node-3]  (parallel, different failure domains)
    [node-2] implement-csv-parser     ........ DONE  (5.1s, $0.009)
    [node-3] implement-type-coercion  ........ DONE  (4.7s, $0.008)
      Stage 1 review: 2/2 PASS

  Batch 2: [node-4]
    [node-4] implement-yaml-config    ........ DONE  (3.8s, $0.006)
      Stage 1 review: PASS

  Batch 3: [node-5a, node-5b]  (parallel)
    [node-5a] wire-cli-to-modules     ........ DONE  (4.2s, $0.007)
    [node-5b] add-error-handling      ........ DONE  (3.5s, $0.005)
      Stage 1 review: 2/2 PASS
      Stage 2 review (node-5a, feeds downstream):
        Floor: PASS | Wall: PASS | Ceiling: 0.82 | Envelope: 0.97

[executor] Wave 2 complete. Expanding vague nodes...

  Expanding node-6 (write-tests):
    Using wave 2 results: implementation modules
    Expanded to 3 concrete nodes:
      node-6a: test-csv-parser
      node-6b: test-type-coercion
      node-6c: test-integration

[executor] Wave 3 of 3

  Batch 1: [node-6a, node-6b, node-6c, node-7]  (all parallel)
    [node-6a] test-csv-parser        ........ DONE  (3.9s, $0.006)
    [node-6b] test-type-coercion     ........ DONE  (3.4s, $0.005)
    [node-6c] test-integration       ........ DONE  (4.8s, $0.008)
    [node-7]  write-readme           ........ DONE  (2.9s, $0.004)
      Stage 1 review: 4/4 PASS
      Stage 2 review (node-6c, final deliverable):
        Floor: PASS | Wall: PASS | Ceiling: 0.85 | Envelope: 0.93
```

Key observations:

- **Vague nodes expanded between waves**: `node-5` (integrate) could not be planned until Wave 1 told the system what the CLI interface looked like. `node-6` (tests) could not be planned until Wave 2 produced the actual implementation.
- **Parallel execution within waves**: `node-2` and `node-3` ran simultaneously because they have no dependency on each other.
- **Stage 2 review was selective**: only 2 out of 10 executed nodes got the expensive cognitive review. The rest passed with the cheap contract check.

## Step 6: Looking Back

```
[looking-back] Tier: always (Q1 + Q2)
  Q1: Does the result satisfy the contract? YES
    - CLI tool parses CSV files: confirmed
    - YAML config support: confirmed
    - Type coercion: confirmed
    - Unit tests present: confirmed
    - README present: confirmed
  Q2: Unstated assumptions?
    - Assumes CSV uses comma delimiter (not configurable)
    - Assumes YAML config is in working directory
  Progress: convergent, no drift detected
  Classification: progressive
```

The Looking Back agent found two unstated assumptions. These are logged for future reference -- if the user later asks for delimiter configuration, the system already knows this was an unhandled assumption.

## Step 7: Read the Output

```bash
windags output last --format tree
```

```
windags-output/csv-to-json-2026-03-01/
  src/
    index.ts          # CLI entry point
    csv-parser.ts     # CSV parsing module
    type-coercion.ts  # Type coercion logic
    config-loader.ts  # YAML config loading
  tests/
    csv-parser.test.ts
    type-coercion.test.ts
    integration.test.ts
  README.md
  package.json
  tsconfig.json
```

```bash
windags output last --node node-2
# Prints just the CSV parser module
```

## Step 8: View the Execution Trace

```bash
windags trace last --summary
```

```
DAG: csv-to-json-converter
Duration: 42.3s
Cost: $0.064
Waves: 3
Nodes: 10 (7 original + 3 from expansion of 2 vague nodes)
Quality: 0.85 (aggregate)
Envelope: 0.93 (clean execution)

Quality breakdown:
  Floor:    10/10 PASS
  Wall:     10/10 PASS
  Ceiling:  0.85 (avg of Stage 2 reviewed nodes)
  Envelope: 0.93 (2 retries in wave 2, 0 circuit breaker trips)

Learning events:
  - Updated Elo for 5 skills (all positive)
  - Method "software-project-scaffold" quality: 0.85
  - No failure patterns detected
  - No near-misses
```

---

# 4. Understanding the Output

## 4.1 Node States (L1 Vocabulary)

At the highest level (L1), every node is in one of four states:

| State | Color | Meaning |
|-------|-------|---------|
| **ACTIVE** | Blue | Currently doing something (running, scheduled, expanding) |
| **DONE** | Green | Finished successfully |
| **ATTENTION** | Yellow/Purple | Needs human input or is being modified |
| **PROBLEM** | Red/Orange | Failed or retrying |

This four-state vocabulary is what you see by default in the visualization. It collapses the system's internal nine-state model into what matters: is it working, done, needs me, or broken?

If you need the full nine-state model (L2), expand any node or switch to detail view:

| Internal State | L1 Group | Visual | Animation |
|---------------|----------|--------|-----------|
| `pending` | ACTIVE | Gray | None |
| `scheduled` | ACTIVE | Blue outline | None |
| `running` | ACTIVE | Blue fill | Pulse |
| `completed` | DONE | Green | None |
| `failed` | PROBLEM | Red | None |
| `retrying` | PROBLEM | Orange | Spin-border |
| `paused` | ATTENTION | Purple | Pulse-border |
| `skipped` | DONE | Gray dimmed | None |
| `mutated` | ATTENTION | Yellow | Glow |

## 4.2 Quality Scores

Quality scores appear at two levels: per-node and per-DAG.

**Per-node quality** is the four-layer evaluation of that node's output:

```bash
windags trace last --node node-5a --quality
```

```
Node: node-5a (wire-cli-to-modules)
  Floor:    PASS (valid TypeScript, compiles without errors)
  Wall:     PASS (exports required functions, correct signatures)
  Ceiling:  0.82 (good reasoning depth, one alternative not considered)
  Envelope: 0.97 (clean execution, 15% timeout margin remaining)
```

**Per-DAG quality** aggregates across all nodes:

```bash
windags trace last --quality
```

```
DAG Quality Vector:
  accuracy:            0.87
  contract_compliance: 1.00
  process_quality:     0.82
  efficiency:          0.91

Four-Layer Summary:
  Floor:    10/10 PASS
  Wall:     10/10 PASS
  Ceiling:  0.85 (weighted average of Stage 2 reviewed nodes)
  Envelope: 0.93 (clean -- minor retry stress in wave 2)
    - Retry ratio:              0.03 (1 retry / 30 attempts)
    - Mutation count:           0
    - Circuit breaker trips:    0
    - Budget utilization:       0.064 / 1.00 (6.4%)
    - Timeout proximity:        0.72 (max node used 72% of timeout)
    - Failure cascade depth:    0

Envelope interpretation: CLEAN
```

## 4.3 Learning Events

After every execution, the learning engine emits events that show how the system updated its knowledge:

```bash
windags trace last --learning
```

```
Skill Updates:
  cli-architect:      Elo 1402 -> 1407 (+5)   stage: proficient
  typescript-module:  Elo 1389 -> 1394 (+5)   stage: established (2 nodes)
  config-file-parser: Elo 1201 -> 1218 (+17)  stage: competent (high K-factor)
  readme-writer:      Elo 1356 -> 1359 (+3)   stage: proficient

Method Updates:
  software-project-scaffold: Thompson alpha +1 (success)
  Task-signature affinity for "cli-tool-build": quality 0.85

Topology:
  Fingerprint: fan-out-3-integrate-test (recorded, quality 0.85)

Failure Patterns: none detected
Near-Misses: none detected
Monster-Barring Alerts: none

Crystallization Candidates: none (need 3+ similar successes)
```

Notice that `config-file-parser` got a larger Elo boost (+17 vs +5). This is because it is in the `competent` developmental stage (30-200 executions), where the K-factor is higher. The system learns faster for skills that have not yet stabilized.

## 4.4 Envelope Score Interpretation

The Envelope score tells you how much the system struggled, even when it succeeded:

| Interpretation | Score Range | Meaning |
|---------------|-------------|---------|
| `clean` | 0.9 - 1.0 | No significant stress. Plenty of margin. |
| `minor_stress` | 0.7 - 0.9 | Some retries or near-misses, but recovered. |
| `significant_stress` | 0.5 - 0.7 | Multiple retries, mutations, or near-misses. Investigate. |
| `near_failure` | 0.3 - 0.5 | The DAG barely survived. Review the execution. |
| `survival` | 0.0 - 0.3 | The result is technically correct but the process was fragile. |

A "clean" Envelope with a moderate Ceiling score is better than a high Ceiling score with a "near_failure" Envelope. The former means the system solved it reliably; the latter means it got lucky.

## 4.5 The Visualization

Open the visualization for any execution:

```bash
windags show last
```

The browser opens at `http://localhost:3400` with four view modes:

**Graph mode** (default): ReactFlow DAG with live node states. Click any node to see its detail panel. Hover for margin tooltips.

**Timeline mode**: Gantt-style chart showing when each node ran, how long it took, and where parallelism occurred. Useful for identifying bottlenecks.

**Hierarchy mode**: Tree view showing the decomposition structure -- why each node exists and how vague nodes expanded. Useful for understanding the Decomposer's decisions.

**Detail mode**: Full inspection of a single node. Input, output, cost, latency, quality vector, commitment strategy, and evaluation results.

Three overlays can be toggled on any base mode:

| Overlay | What It Shows | Default |
|---------|--------------|---------|
| Coordination | Edge protocol activity | Off |
| Resilience | Near-miss heatmap, circuit breaker states | On during live execution |
| Quality | Quality vectors as radar charts per node | Off |

During live execution, the Resilience overlay is on by default -- the system does not hide stress from you. In retrospective review, it is off but one click away.

---

# 5. Using Seed Templates

WinDAGs ships with 20 pre-built template DAGs that cover common problem types. Templates eliminate the cold-start problem -- you do not need to wait for the learning engine to accumulate experience.

## Browsing Templates

```bash
windags templates list
```

```
Available Templates (20):

SOFTWARE ENGINEERING
  rest-api-scaffold      Build a REST API with CRUD, auth, and tests
  cli-tool-builder       Build a CLI tool with argument parsing and config
  refactor-module        Refactor a module for maintainability
  bug-triage             Diagnose and fix a bug from a stack trace
  migration-planner      Plan and execute a database/API migration

DATA & ANALYSIS
  data-pipeline          Build an ETL pipeline with validation
  report-generator       Generate an analytical report from data
  dashboard-builder      Build a monitoring dashboard

WRITING & DOCUMENTATION
  technical-doc          Write technical documentation from code
  blog-post              Research and write a technical blog post
  api-reference          Generate API reference from source code

RESEARCH
  literature-review      Research a topic across multiple sources
  competitive-analysis   Analyze competitors and produce comparison
  technology-evaluation  Evaluate technology options with trade-offs

DEVOPS & INFRASTRUCTURE
  deployment-pipeline    Set up CI/CD pipeline configuration
  monitoring-setup       Configure monitoring and alerting
  incident-postmortem    Analyze an incident and produce postmortem

DESIGN
  system-design          Design a system architecture with trade-offs
  api-design             Design an API surface with schemas
  schema-design          Design a database schema from requirements
```

## Using a Template

```bash
windags run --template cli-tool-builder \
  "Build a CLI tool that batch-resizes images using sharp, \
   with configurable output formats and quality settings"
```

Templates pre-configure the decomposition meta-skill, expected phases, and skill assignments. The system still runs all three decomposition passes, but Pass 1 starts with the template's phase pattern instead of generating one from scratch.

## Template Anatomy

```bash
windags templates show cli-tool-builder
```

```yaml
name: cli-tool-builder
description: Build a CLI tool with argument parsing and config
problem_type: well-structured
domain: software-engineering
phase_pattern:
  - design-cli-interface
  - implement-core-logic
  - implement-config
  - integrate
  - write-tests
  - write-docs
expected_nodes: 6-12
expected_waves: 3-4
default_skills:
  - cli-architect
  - typescript-module
  - config-file-parser
  - test-writer
  - readme-writer
typical_cost: $0.04-0.08
typical_duration: 30-60s
```

Templates are themselves subject to the learning loop. As you use them, the system tracks which template works best for which problem signatures. After enough executions, the system may crystallize an improved version.

---

This concludes Part 1. You now know how to install WinDAGs, run your first DAG, understand the core concepts, follow a complete execution from problem to output, and use seed templates.

Part 2 covers building your own skills, the execution engine in depth, visualization modes, and the CLI reference.

Part 3 covers advanced topics: custom coordination models, testing your DAGs, configuration reference, and migration from V2.
# WinDAGs V3 Practitioner's Guide -- Part 2

## Building Skills, Execution Deep Dive, Visualization, CLI Reference

---

# 6. Building Skills

Skills are the knowledge layer that makes WinDAGs improve over time. This section covers the SKILL.md format, the skill lifecycle, and how to write skills that the system can use effectively.

## 6.1 The SKILL.md Format

Every skill is a markdown file with required sections. The system parses these sections to determine when and how to use the skill.

```markdown
# Skill: React Component Builder

## IDENTITY
- **Domain**: frontend-engineering
- **Output Type**: react-component
- **Model Tier**: Tier 2 (Sonnet-class)

## WHEN TO USE
- Building new React components from design specifications
- Converting wireframes or descriptions into functional TSX components
- Creating components that follow an existing design system

## WHEN NOT TO USE
- Modifying existing components (use: react-refactorer)
- Building complex state management (use: state-machine-designer)
- Performance optimization of existing components (use: react-optimizer)

## METHOD
1. Parse the component requirements: props interface, visual layout, interactions
2. Identify the design system tokens (colors, spacing, typography)
3. Determine state management needs (local state, context, or external store)
4. Write the component in TSX with TypeScript props interface
5. Add JSDoc comments for each prop
6. Include a usage example in a code comment

## OUTPUT FORMAT
TypeScript React component (.tsx) with:
- Named export (not default)
- Props interface exported separately
- CSS modules or Tailwind classes (match project convention)
- At least one usage example in comments

## PRECONDITIONS
- Design specification or description provided
- Target framework: React 18+
- TypeScript configured in the project

## QUALITY CHECKLIST
- [ ] Props interface is fully typed (no `any`)
- [ ] Component handles loading and error states
- [ ] Accessibility: aria labels, keyboard navigation
- [ ] Responsive: works at mobile and desktop breakpoints
```

### Required Sections

| Section | Purpose | Used By |
|---------|---------|---------|
| `IDENTITY` | Domain, output type, model tier | Skill selection cascade (Pass 2) |
| `WHEN TO USE` | Positive matching conditions | Pattern recognition fast path |
| `WHEN NOT TO USE` | Negative matching conditions | Hard filter, monster-barring detection |
| `METHOD` | Step-by-step procedure | Agent system prompt |
| `OUTPUT FORMAT` | Output specification | Stage 1 contract review |
| `PRECONDITIONS` | Required context conditions | Context condition filter (cascade step 2) |
| `QUALITY CHECKLIST` | Self-check criteria | Process self-check (weight 0.15) |

### Optional Sections

| Section | Purpose |
|---------|---------|
| `EXAMPLES` | Concrete input/output pairs for few-shot prompting |
| `COMMON MISTAKES` | Known failure modes to avoid |
| `RELATED SKILLS` | Skills that complement or compete |
| `DOMAIN KNOWLEDGE` | Reference material the agent should know |

## 6.2 The Skill Lifecycle

Skills move through nine lifecycle states:

```
crystallized -> unranked -> rising -> established -> dominant
                                  \-> declining -> challenged -> superseded -> retired
```

**State definitions:**

| State | Executions | Quality Trend | What Happens |
|-------|-----------|---------------|-------------|
| `crystallized` | 0 | N/A | Newly created from successful improvisation |
| `unranked` | 1-5 | N/A | Gathering initial execution data |
| `rising` | 5-50 | Improving | Gaining traffic, quality increasing |
| `established` | 50+ | Stable | Reliable, moderate traffic |
| `dominant` | 50+ | Stable, highest Elo | Best in its domain |
| `declining` | 50+ | Dropping | Quality or traffic decreasing |
| `challenged` | 50+ | Dropping | A competitor skill is gaining |
| `superseded` | Any | N/A | Replaced by a superior skill |
| `retired` | Any | N/A | Removed from active rotation |

**Developmental stages** (orthogonal to lifecycle state):

| Stage | Executions | K-Factor | Behavior |
|-------|-----------|----------|----------|
| `novice` | 0-30 | 40 | High exploration. Ratings volatile. |
| `competent` | 30-200 | 32 | DANGER ZONE. System monitors closely. |
| `proficient` | 200-500 | 24 | Reliable. Moderate learning rate. |
| `expert` | 500+ | 16 | Stable. Minimal exploration. Monitor for staleness. |

The `competent` stage (30-200 executions) is the danger zone. The skill has enough history to seem reliable but not enough for true confidence. The system applies heightened monitoring: more Stage 2 reviews, lower escalation thresholds, and faster circuit breaker trips.

## 6.3 Crystallization: How New Skills Are Born

When the system improvises a solution (no existing skill matched), it tracks the approach. If the same approach succeeds 3+ times with quality >= 0.75, the system proposes crystallization:

```bash
windags skills crystallize
```

```
Crystallization Candidates:

1. yaml-to-env-converter (3 successes, avg quality 0.82)
   Task signature: "convert yaml config to dotenv format"
   Method: Read YAML -> flatten nested keys -> write KEY=VALUE pairs
   Recommendation: CRYSTALLIZE

2. graphql-resolver-scaffold (4 successes, avg quality 0.78)
   Task signature: "generate graphql resolvers from schema"
   Method: Parse SDL -> identify types -> generate resolver stubs
   Recommendation: CRYSTALLIZE

Accept crystallization? [y/n/inspect]
```

When you accept, the system generates a SKILL.md file from the execution traces:

```bash
windags skills crystallize --accept 1
# Created: .windags/skills/yaml-to-env-converter.md
# Lifecycle state: crystallized
# Developmental stage: novice (K=40)
```

The crystallized skill enters the library at `novice` stage with high exploration. It must prove itself through execution before it stabilizes.

## 6.4 Writing Skills Manually

You can also write skills from scratch:

```bash
windags skills create my-custom-skill
# Created: .windags/skills/my-custom-skill.md
# Opens in $EDITOR with template
```

After writing the SKILL.md, register it:

```bash
windags skills register .windags/skills/my-custom-skill.md
# Registered: my-custom-skill
# Domain: software-engineering
# Output type: typescript-module
# Lifecycle: unranked
# Developmental stage: novice (K=40)
```

Validate a skill before registering:

```bash
windags skills validate .windags/skills/my-custom-skill.md
```

```
Validation Results:
  [PASS] Required sections present
  [PASS] IDENTITY fields complete
  [PASS] WHEN TO USE has at least 2 entries
  [PASS] WHEN NOT TO USE has at least 1 entry
  [PASS] METHOD has numbered steps
  [PASS] OUTPUT FORMAT specified
  [WARN] No EXAMPLES section -- skill may perform poorly without few-shot examples
  [WARN] No PRECONDITIONS -- skill will match broadly (may cause false positives)
```

## 6.5 Monster-Barring Detection

The system automatically monitors skills for a pathology called **monster-barring**: a skill that appears to improve by narrowing its scope rather than expanding its capability.

Detection formula:

```
WHEN NOT TO USE section growth > 50% over last 3 revisions
AND
WHEN TO USE section growth < 10% over same period
```

When detected:

```bash
windags skills health
```

```
Skill Health Report:

  react-component-builder:   HEALTHY (progressive, Elo rising)
  typescript-module:          HEALTHY (stable, Elo steady)
  config-file-parser:        WARNING: monster-barring detected
    - WHEN NOT TO USE grew 62% in 3 revisions
    - WHEN TO USE grew 3% in same period
    - The skill is excluding hard cases rather than handling them
    - Recommendation: INVEST (add capability) or REPLACE

  Progressive improvements: 12
  Degenerating improvements: 3
  Overall: 80% progressive (healthy)
```

---

# 7. Execution Deep Dive

## 7.1 Three-Pass Decomposition

Every problem goes through three sequential passes before execution begins.

### Pass 1: Problem Structure (Polya + HTN)

The system identifies the principal parts of the problem:

- **Unknown**: What must be produced
- **Data**: What is given
- **Conditions**: What constraints must hold

It then classifies the problem type:

| Type | Characteristics | Decomposition Strategy |
|------|----------------|----------------------|
| `well-structured` | Clear goal, known methods | Use meta-skill if available. Concrete nodes preferred. |
| `ill-structured` | Ambiguous goal, partial methods | More vague nodes. TENTATIVE commitment. Deeper PreMortem. |
| `wicked` | No clear definition of "done" | Maximum vague nodes. EXPLORATORY commitment. Human gates. |

Pass 1 produces a task hierarchy. If a domain meta-skill matches (recognition confidence >= 0.85), it uses the meta-skill's phase pattern. Otherwise, it generates a decomposition from scratch.

Performance budget: Pass 1 must complete in under 10 seconds.

### Pass 2: Capability Matching (MAS + BDI)

Pass 2 maps each concrete task to a skill using the five-step skill selection cascade:

```
Step 1: Signature compatibility (hard filter)
  -> Eliminate skills whose output type does not match

Step 2: Context conditions (hard filter)
  -> Eliminate skills whose preconditions are not met

Step 3: Output type + domain relevance (soft ranking)
  -> Sort remaining candidates by relevance

Step 4: Pattern recognition fast path
  -> If confidence >= 0.8, use recognized skill directly

Step 5: Thompson sampling
  -> Explore/exploit among remaining candidates
```

No LLM calls are made in Pass 2. It operates on skill metadata only.

Pass 2 also assigns **commitment strategies**:

| Strategy | When Assigned | Behavior |
|----------|--------------|----------|
| `COMMITTED` | Expert skill, recognized problem | Persist until hard failure |
| `TENTATIVE` | Competent skill, moderate confidence | Reconsider on quality drop or upstream failure |
| `EXPLORATORY` | Novice skill, novel task | Reconsider frequently, periodic checkpoints |

### Pass 3: Topology Validation (Distributed Systems + Resilience Engineering)

Pass 3 checks the DAG structure for problems:

1. **Bottleneck detection**: Is any node on every critical path?
2. **Failure domain isolation**: Do parallel nodes share a failure domain (same provider, same skill)?
3. **Budget validation**: Does the estimated cost exceed the budget?
4. **Timeout validation**: Does the critical path duration exceed the timeout?
5. **Circuit breaker check**: Are any assigned skills in an open circuit breaker state?

If errors are found (not warnings), the system attempts automatic repair:

```
Repair actions:
  bottleneck       -> Parallelize by splitting the node
  failure_domain   -> Reorder batches to isolate domains
  budget_exceeded  -> Substitute cheaper model tiers
  timeout_risk     -> Reduce parallelism, increase timeout
  circuit_breaker  -> Substitute alternative skill
```

If automatic repair fails, the system escalates to the user.

## 7.2 Wave-by-Wave Execution

After decomposition, execution proceeds wave by wave.

**Planning phase** (per wave):
- Method selection for each node
- Precondition checking
- Skill assignment finalization
- Subtask ordering

**Scheduling phase** (per wave):
- Topological sort (Kahn's algorithm)
- Parallel batch identification
- Priority ordering (critical path weight 0.3, fan-out 0.2, failure rate 0.3, cost 0.2)
- Failure domain isolation

**Execution phase** (per batch within a wave):

```typescript
// Simplified core loop
for (const wave of waves) {
  const plan = await planner.planWave(wave, dag, contextStore);
  const schedule = scheduler.scheduleWave(plan, circuitBreakers);

  for (const batch of schedule.batches) {
    const results = await Promise.allSettled(
      batch.nodes.map(node => executeNodeWithReview(node, contextStore))
    );

    // Process results, handle failures, check commitment strategies
    for (const [index, result] of results.entries()) {
      if (result.status === 'fulfilled') {
        contextStore.add(node.id, waveNumber, result.value);
      } else {
        const failure = classifyFailure(node, result.reason);
        const response = await escalationLadder.handle(failure, node, dag);
        if (response.action === 'mutate') {
          dag = await mutator.mutate(dag, response.mutation);
          waves = await decomposer.replanRemainingWaves(dag, waveNumber);
        }
      }
    }
  }

  // Expand vague nodes using this wave's results
  for (const vagueId of wave.vague_nodes_to_expand) {
    const expanded = await expandVagueNode(vagueId, contextStore);
    dag = replaceVagueWithSubDAG(dag, vagueId, expanded);
  }
}
```

**Between waves**:
- Vague node expansion (using completed wave's results as context)
- Full replanning permitted (new wave plan incorporates all results)
- DAG mutation if needed (add nodes, remove nodes, change edges)

**Within waves**:
- Batch scheduling with monitoring
- Mid-batch preemption on significant events (failures, quality below threshold)
- Commitment strategy checks after each result

## 7.3 Failure Handling

Every failure is classified on up to four dimensions:

| Dimension | Types | What It Tells You |
|-----------|-------|-------------------|
| System Layer | crash, crash-recovery, omission, byzantine | How to recover technically |
| Cognitive Mechanism | misclassification, SA-shift, queue_exhaustion, articulation_gap, availability_bias | Why it went wrong conceptually |
| Decomposition Level | granularity_mismatch, semantic_gap, method_explosion, cascading_task_failure | Whether the problem is structural |
| Protocol Level | agent_level, interaction_level, organizational_level | Whether the coordination is broken |

The system always classifies the System Layer. The other three dimensions are populated when deeper analysis is triggered (escalation level 2+).

### Escalation Ladder

Failures escalate through five levels:

```
L1: Fix the node
    Trigger: First failure
    Action: Retry with better prompt, different model, or alternative plan

L2: Diagnose structure
    Trigger: 3+ failures at same node
    Action: Check for granularity mismatch, semantic gap, method explosion
            If structural problem found: re-decompose the failing region

L3: Generate alternative
    Trigger: 3+ re-decompositions failed
    Action: Apply auxiliary problem strategies:
            restate, simplify, specialize, analogize, generalize, work backward

L4: Fix topology
    Trigger: Persistent coordination failure
    Action: Insert intermediary agents, change edge protocols,
            restructure topology

L5: Human escalation
    Trigger: All automated approaches exhausted
    Action: Present full failure trace with recommended actions
```

The ladder is diagnostic-informed: L2 does not activate after a fixed retry count but when the failure pattern matches a decomposition-level signature.

### Circuit Breakers

Circuit breakers operate at three levels:

```typescript
interface CircuitBreaker {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failure_count: number;
  threshold: number;        // Failures before OPEN
  cooldown_ms: number;      // Time in OPEN before HALF_OPEN
}
```

- **Per-node**: Tracks failure rate for individual nodes
- **Per-skill**: Tracks failure rate across all uses of a skill
- **Per-model**: Tracks failure rate for a model provider

A per-skill circuit breaker opening prevents that skill from being selected for any node, but does not prevent other skills from running. Per-model breakers trigger automatic provider failover.

## 7.4 Two-Stage Review

Every node output passes through review:

### Stage 1: Contract Review (always runs)

- Schema validation
- Required field presence
- Format compliance
- Length constraints
- Cost: ~$0.001
- Latency: ~100ms

If Stage 1 fails, the node is marked as failed immediately. No Stage 2.

### Stage 2: Cognitive Review (conditional)

Stage 2 runs when the economic threshold is met:

```
P(failure) * cost_of_downstream_waste > cost_of_Stage_2
```

Or unconditionally for:
- Human gate inputs
- Final deliverables
- Irreversible nodes

Stage 2 has two independent channels:

**Channel A (Outcome)**: FORMALJUDGE-inspired. Asks binary questions about observable outputs. Does not inspect reasoning traces. Produces Floor and Wall scores.

```
"Does the output contain valid TypeScript?"  -> YES/NO
"Does the function handle empty input?"      -> YES/NO
"Are all required fields present?"           -> YES/NO
```

**Channel B (Process)**: CTA-inspired behavioral observation. Examines tool calls, retry patterns, intermediate outputs, backtracking signatures. Produces Ceiling score.

```
Decision points identified:     3
Alternatives considered:         2
Assumptions surfaced:           1
Counterfactual analysis:        "If input is empty, function returns []"
Process quality:                0.82
```

Channel A and Channel B run in parallel. The evaluator model must be from a different model family than the execution model.

### Looking Back Protocol

After all waves complete, the Looking Back agent runs:

| Tier | Questions | Cost | When |
|------|-----------|------|------|
| **Always** | Q1: Does the result satisfy the contract? Q2: Unstated assumptions? | ~$0.002 | Every DAG |
| **Non-trivial** | Q3: Could a different topology have worked? | ~$0.01 | Novel or complex DAGs |
| **Deep** | Q4: Can this solution method be generalized? | ~$0.05 | Crystallization candidates |

Q3 and Q4 run asynchronously -- they do not block the return of results to the user.

---

# 8. Visualization Guide

## 8.1 Four Base Modes

### Graph Mode (key: `G`)

The default view. ReactFlow DAG with live node states. Click any node to open its detail panel. Hover for margin tooltips (quality, budget, timeout). Zoom with `+/-`, fit to screen with `F`.

Node visual encoding: color maps to the 4-state L1 vocabulary (blue=ACTIVE, green=DONE, yellow/purple=ATTENTION, red/orange=PROBLEM). Animations: pulse (running), spin-border (retrying), pulse-border (paused for human), glow (mutated). Border thickness indicates commitment level.

### Timeline Mode (key: `T`)

Gantt chart showing temporal execution. Shows when each node started and finished, parallel execution lanes, wave boundaries (vertical dividers), and idle gaps. Useful for identifying bottlenecks.

### Hierarchy Mode (key: `H`)

Tree view of the decomposition structure. Shows original decomposition (Pass 1 output), vague node expansions, methods used at each step, and commitment levels. Useful for understanding why the system made its decomposition choices.

### Detail Mode (key: `D`)

Full inspection of a single node. Tab cycles between nodes. Press `1`, `2`, or `3` to switch disclosure levels.

- **L1**: Status, duration, cost, aggregate quality, skill used
- **L2**: Full quality vector, reasoning traces, commitment strategy rationale, evaluation results
- **L3**: Full input/output text, cognitive telemetry, Thompson parameters, Elo history, circuit breaker state

## 8.2 Three Overlays

Overlays layer additional information on any base mode.

### Coordination Overlay

Toggle: `C` key or toolbar button

Shows edge protocol activity. For `data-flow` edges (80%+ of edges), this shows data transfer events. For `contract` edges, it shows acceptance/rejection events. For `subscription` edges, it shows streaming updates.

Default: Off (most edges are simple data-flow, not interesting unless debugging).

### Resilience Overlay

Toggle: `R` key or toolbar button

Shows system health information:
- **Near-miss heatmap**: Nodes that succeeded but barely. Yellow border = quality margin < 10%. Orange border = timeout margin < 20%.
- **Circuit breaker states**: Open breakers shown as red badges. Half-open as orange.
- **Failure cascade indicators**: Red arrows showing how a failure propagated.

Default: On during live execution, off in retrospective review.

### Quality Overlay

Toggle: `Q` key or toolbar button

Shows quality information per node:
- Radar charts showing the quality vector dimensions
- Progressive/degenerating indicators from the Lakatosian classification
- Floor/Wall/Ceiling/Envelope scores as a stacked bar

Default: Off (detailed quality info is available in Detail mode; the overlay is for comparative viewing across many nodes).

## 8.3 Progressive Disclosure Levels

Every element in the visualization supports three disclosure levels:

**L1 -- Overview** (default):
- Four-state vocabulary (ACTIVE/DONE/ATTENTION/PROBLEM)
- Aggregate quality scores
- Total cost and duration
- No technical terminology

**L2 -- Explanation** (click to expand or press `2`):
- Nine-state node status
- Quality vector breakdown
- Reasoning traces
- Decomposition provenance
- Skill and method names

**L3 -- Deep Inspection** (press `3`):
- Full TypeScript type dumps
- Thompson sampling parameters (alpha, beta, K-factor)
- Elo rating with dimensional breakdown
- Cognitive telemetry events
- Raw LLM call logs
- Circuit breaker histories

The rule: L1 never shows academic terminology. No "BDI," "HTN," "Lakatosian," or "Thompson sampling" at L1. Those terms appear at L2 and L3 only.

## 8.4 Visualization Scaling

The visualization handles DAGs up to ~300-500 nodes before requiring hierarchical collapse. For larger DAGs:

- Nodes within a completed sub-DAG collapse into a single summary node
- Vague node expansions show as expandable groups
- Wave boundaries act as natural fold points
- The hierarchy view handles scale better than the graph view for large DAGs

---

# 9. CLI Reference

## 9.1 Global Options

```bash
windags [command] [options]

Global options:
  --verbose, -v        Show detailed output (L2 disclosure)
  --debug              Show full debug output (L3 disclosure)
  --quiet, -q          Show only final result
  --json               Output as JSON (for scripting)
  --no-color           Disable color output
  --config <path>      Use alternative config file
  --profile <name>     Use named configuration profile
```

## 9.2 Core Commands

### windags run

Execute a problem statement as a DAG.

```bash
windags run <problem-statement> [options]

Options:
  --template, -t <name>     Use a template DAG
  --model <model-id>        Override default model (default: claude-sonnet-4-20250514)
  --budget <usd>            Set cost budget (default: $1.00)
  --timeout <seconds>       Set execution timeout (default: 300)
  --max-parallel <n>        Max concurrent nodes (default: 5)
  --eval-depth <level>      Evaluation depth: stage1 | stage1+stage2 | full (default: stage1+stage2)
  --looking-back <scope>    Looking Back scope: always | non-trivial | deep (default: always)
  --premortem <depth>       PreMortem depth: lightweight | standard | deep (default: auto)
  --output, -o <dir>        Output directory (default: ./windags-output/)
  --dry-run                 Show decomposition plan without executing
  --interactive             Pause before each wave for approval
  --human-gates             Enable human gate nodes in the DAG
  --watch                   Open visualization in browser during execution
```

Examples:

```bash
# Basic run
windags run "Write a Python script that scrapes Hacker News front page"

# With template and budget
windags run -t data-pipeline --budget 0.50 \
  "Build an ETL pipeline that loads CSV from S3, cleans data, loads to Postgres"

# Dry run to preview the plan
windags run --dry-run "Design a microservices architecture for an e-commerce platform"

# Interactive mode for high-stakes work
windags run --interactive --human-gates \
  "Migrate the user database from MySQL to PostgreSQL"

# Watch execution in browser
windags run --watch "Build a React component library with Storybook"
```

### windags show

Open the visualization for an execution.

```bash
windags show <execution-id | "last"> [options]

Options:
  --mode <mode>        Initial view mode: graph | timeline | hierarchy | detail
  --port <port>        Server port (default: 3400)
  --no-browser         Start server without opening browser
```

### windags output

Print execution output.

```bash
windags output <execution-id | "last"> [options]

Options:
  --node <node-id>     Output from a specific node
  --format <fmt>       Output format: text | json | tree | files
  --save <dir>         Save output files to directory
```

### windags trace

Show execution trace.

```bash
windags trace <execution-id | "last"> [options]

Options:
  --summary            Show summary only
  --node <node-id>     Trace for a specific node
  --quality            Show quality breakdown
  --learning           Show learning events
  --failures           Show failure events only
  --cost               Show cost breakdown
  --timeline           Show timeline view in terminal
```

### windags demo

Run the pre-executed demonstration DAG.

```bash
windags demo [options]

Options:
  --problem <name>     Demo problem: todo-api | data-pipeline | blog-post
  --port <port>        Server port (default: 3400)
```

## 9.3 Other Command Groups

**Skill management** (`windags skills <subcommand>`):

| Subcommand | Purpose |
|-----------|---------|
| `list` | List registered skills (filter: `--domain`, `--state`) |
| `show <name>` | Show skill details |
| `create <name>` | Create from template |
| `register <path>` | Register a SKILL.md file |
| `validate <path>` | Validate SKILL.md format |
| `crystallize` | Show/accept crystallization candidates |
| `health` | Monster-barring and lifecycle report |
| `rankings` | Elo rankings (filter: `--domain`, `--dimension`) |
| `export <name>` | Export as md or json |

**Template management** (`windags templates <subcommand>`):

| Subcommand | Purpose |
|-----------|---------|
| `list` | List available templates |
| `show <name>` | Show template details |
| `create-from <id>` | Create template from successful execution |

**Configuration** (`windags config <subcommand>`):

| Subcommand | Purpose |
|-----------|---------|
| `set <key> <value>` | Set a value (api-key, provider, default-model, budget-default, timeout-default, max-parallel, output-dir, visualization-port, log-level) |
| `get <key>` | Get a value |
| `list` | Show all configuration |
| `profile create/use/list` | Named configuration profiles |

**Diagnostics**:

| Command | Purpose |
|---------|---------|
| `windags doctor` | System health check |
| `windags circuit-breakers` | Circuit breaker states (--level node/skill/model) |
| `windags learning-state` | Learning state summary |
| `windags history` | Execution history (--limit, --since, --domain) |
| `windags diff <id1> <id2>` | Compare two executions |
| `windags providers` | Provider status (--check-health) |

**Data management**:

| Command | Purpose |
|---------|---------|
| `windags export <id>` | Export execution data (json/yaml) |
| `windags import skills <path>` | Import skills from another installation |
| `windags reset learning-state` | Reset rankings (--skill, --confirm) |
| `windags db compact` | Compact the database |
| `windags db backup <path>` | Backup the database |

---

This concludes Part 2. You now know how to build and manage skills, understand the full execution pipeline, use all four visualization modes with overlays and progressive disclosure, and operate the CLI.

Part 3 covers advanced topics: custom coordination models, testing your DAGs, the full configuration reference, troubleshooting, and migration from V2.
# WinDAGs V3 Practitioner's Guide -- Part 3

## Advanced Topics, Configuration, Testing, Troubleshooting, Migration

---

# 10. Advanced Topics

## 10.1 Custom Coordination Models

Phase 1 ships with the DAG coordination model only. The coordination model abstraction is implemented from day one, so adding models does not require engine redesign.

The roadmap:

| Phase | Model | Description |
|-------|-------|-------------|
| Phase 1 | DAG | Topological execution with typed edges |
| Phase 2 | Team | Bidirectional edges, voting aggregation |
| Phase 3 | Market | Competitive bidding via Thompson sampling |
| Phase 3 | Debate | Team variant with adversarial framing |
| Phase 4 | Blackboard | Shared state, opportunistic execution |
| Phase 4 | Hierarchical | Nested DAGs with scope isolation |

Each coordination model declares its failure semantics:

```typescript
interface CoordinationModel {
  type: CoordinationModelType;
  failure_semantics: {
    supported_failure_types: string[];
    recovery_mechanisms: string[];
    requires_compensation: boolean;
    termination_guarantee: 'guaranteed' | 'probabilistic' | 'none';
  };
  evaluation_architecture: 'sequential' | 'adversarial' | 'peer-review'
                         | 'price-based' | 'statistical';
}
```

To prepare for future coordination models in your DAG configurations, use the coordination model interface:

```yaml
# windags.config.yaml
coordination:
  type: dag                    # Only option in Phase 1
  # These settings will carry forward when Team model ships:
  failure_semantics:
    requires_compensation: false
    termination_guarantee: guaranteed
```

## 10.2 Template DAGs

Template DAGs are pre-built execution patterns. You can create them from successful executions or write them by hand.

### Creating from a Successful Execution

```bash
windags templates create-from <execution-id> --name my-template
```

This extracts:
- The decomposition meta-skill and phase pattern
- The skill assignments that worked
- The wave structure
- The quality scores achieved

The template becomes available via `--template my-template` in future runs.

### Writing Templates by Hand

```yaml
# .windags/templates/my-template.yaml
name: my-template
description: Template for building data processing pipelines
problem_type: well-structured
domain: data-engineering

phase_pattern:
  - ingest-data
  - validate-schema
  - transform-data
  - load-to-destination
  - verify-output

node_defaults:
  timeout_ms: 60000
  max_retries: 2
  commitment_level: TENTATIVE

skill_assignments:
  ingest-data: data-reader
  validate-schema: schema-validator
  transform-data: data-transformer
  load-to-destination: database-writer
  verify-output: output-verifier

edge_protocol: data-flow

estimated_cost_usd: 0.05
estimated_duration_s: 45
```

### Template Quality Tracking

Templates participate in the learning loop. The system tracks which templates produce high-quality results for which problem signatures:

```bash
windags templates rankings
```

```
Template Rankings (by success rate):

  cli-tool-builder:     0.94 success, 23 uses, Elo 1410
  rest-api-scaffold:    0.91 success, 45 uses, Elo 1398
  data-pipeline:        0.88 success, 12 uses, Elo 1365
  report-generator:     0.85 success, 8 uses,  Elo 1340
  bug-triage:           0.82 success, 31 uses, Elo 1322
```

## 10.3 The Marketplace

The marketplace is a registry of shared skills, methods, and template DAGs. Phase 1 supports community (free) assets. Premium assets are Phase 2+.

```bash
# Browse the marketplace
windags marketplace search "react testing"

# Install a skill from the marketplace
windags marketplace install react-testing-library-skill

# Publish your skill
windags marketplace publish .windags/skills/my-custom-skill.md
```

### Private Organizational Skill Libraries

Enterprise teams can maintain private skill libraries that encode organizational knowledge:

```bash
# Configure a private registry
windags config set registry https://skills.mycompany.com

# Push to private registry
windags marketplace publish --private .windags/skills/internal-api-builder.md

# Pull from private registry
windags marketplace install --registry private internal-api-builder
```

Private skill libraries are a competitive advantage -- they encode your team's patterns, preferences, and domain expertise. They should not be shared on the public marketplace.

## 10.4 Enterprise Features

### Audit Trails

Every execution produces a complete audit trail:

```bash
windags trace <id> --format audit
```

Output includes:
- Every LLM call with input/output
- Every evaluation with scores and evidence
- Every failure with classification and response
- Every mutation with before/after structural diffs
- Cost attribution per node, per wave, per provider

### Human Gate Management

For regulated environments, configure mandatory human gates:

```yaml
# windags.config.yaml
human_gates:
  required_for:
    - irreversible_nodes      # Nodes that cannot be undone
    - high_cost_nodes          # Nodes exceeding cost threshold
    - external_api_calls       # Nodes calling external systems
  cost_threshold_usd: 0.50
  timeout_ms: 3600000          # 1 hour timeout
  timeout_action: fail         # fail | escalate | proceed_with_default
```

Human gates are classified by irreversibility:

| Classification | Max Per Execution | Behavior |
|---------------|-------------------|----------|
| `IRREVERSIBLE` | 3 | Mandatory review, no timeout bypass |
| `QUALITY_CHECK` | 5 | Review recommended, timeout to default |
| `CALIBRATION` | Unlimited | Periodic check, timeout to proceed |

### Cost Controls

```yaml
# windags.config.yaml
cost_controls:
  max_per_execution_usd: 5.00
  max_per_node_usd: 1.00
  max_per_day_usd: 50.00
  alert_threshold_pct: 80      # Alert at 80% of budget
  hard_stop: true               # Kill execution at budget limit
```

---

# 11. Configuration Reference

## 11.1 Configuration File

WinDAGs reads configuration from `windags.config.yaml` in the project root, falling back to `~/.windags/config.yaml`.

```yaml
# windags.config.yaml -- Full reference with defaults

# ─── Provider Configuration ───
provider:
  name: anthropic                          # anthropic | openai | custom
  api_key: ${ANTHROPIC_API_KEY}            # Environment variable reference
  default_model: claude-sonnet-4-20250514  # Default execution model
  evaluation_model: gpt-4o                 # Cross-family evaluator
  haiku_model: claude-haiku-4-20250514     # Cheap model for Stage 1, PreMortem

# ─── Execution Defaults ───
execution:
  max_parallel: 5                     # Max concurrent nodes
  default_timeout_ms: 300000          # 5 minutes per node
  total_timeout_ms: 1800000           # 30 minutes per DAG
  checkpoint_strategy: per-batch      # per-node | per-batch | per-wave
  mode: async                         # sequential | async | multiprocess

# ─── Cost Controls ───
cost:
  budget_per_execution_usd: 1.00
  budget_per_node_usd: 0.50
  meta_layer_budget_pct: 10           # Max 10% of budget for orchestration
  alert_threshold_pct: 80

# ─── Decomposition ───
decomposition:
  max_depth: 10                       # Maximum DAG depth
  default_commitment: TENTATIVE       # COMMITTED | TENTATIVE | EXPLORATORY
  pass3_skip_threshold: 3             # Skip topology validation for DAGs < this depth
  vague_node_expansion: progressive   # progressive | eager (expand all at once)

# ─── Evaluation ───
evaluation:
  stage1_always: true                 # Never skip Stage 1
  stage2_threshold: auto              # auto | always | never
  looking_back_scope: always          # always | non-trivial | deep
  envelope_always: true               # Always compute Envelope score
  cross_family_required: true         # Require different model family for evaluation
  bias_mitigations:
    - position_swap
    - length_normalization

# ─── Failure Handling ───
failure:
  max_retries_per_node: 2
  escalation_ladder: true             # Enable L1-L5 escalation
  circuit_breaker:
    per_node_threshold: 3
    per_skill_threshold: 5
    per_model_threshold: 10
    cooldown_ms: 60000                # 1 minute cooldown
    half_open_attempts: 2

# ─── Learning ───
learning:
  enabled: true
  thompson_sampling: true
  elo_tracking: true
  method_learning: true               # Phase 1: method-level learning
  monster_barring_detection: true
  near_miss_logging: true
  near_miss_threshold_pct: 10         # Log near-misses within 10% of threshold
  crystallization:
    min_occurrences: 3
    min_quality: 0.75
    max_recent_failures: 0
    auto_propose: true                # Automatically propose crystallization

# ─── PreMortem ───
premortem:
  always_run: true                    # Never skip PreMortem
  lightweight_threshold:
    recognition_confidence: 0.8       # Above this: lightweight scan only
    dag_depth: 5                      # Below this: lightweight scan only
  full_analysis_model: claude-sonnet-4-20250514

# ─── Visualization ───
visualization:
  port: 3400
  default_mode: graph                 # graph | timeline | hierarchy | detail
  default_disclosure_level: 1         # 1 | 2 | 3
  resilience_overlay_live: true       # Show resilience during live execution
  max_nodes_before_collapse: 300      # Hierarchical collapse threshold

# ─── Context Store ───
context_store:
  max_token_budget: 32000             # Max tokens for context window
  context_fraction: 0.30              # Fraction of token budget for context
  progressive_summarization: true
  wave_n1: full                       # Full text for immediate predecessors
  wave_n2: summary                    # 2-3 sentence summaries
  wave_n3_plus: oneliner             # Single sentence

# ─── Output ───
output:
  directory: ./windags-output
  format: files                       # text | json | files
  include_trace: true
  include_quality: true

# ─── Database ───
database:
  type: sqlite                        # sqlite (Phase 1) | postgres (Phase 2+)
  path: ~/.windags/windags.db
```

## 11.2 Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...       # Anthropic API key
OPENAI_API_KEY=sk-...              # OpenAI API key
WINDAGS_CONFIG=./custom.yaml       # Override config file path
WINDAGS_LOG_LEVEL=info             # debug | info | warn | error
WINDAGS_NO_COLOR=1                 # Disable color output
WINDAGS_DATA_DIR=~/.windags        # Data directory
```

## 11.3 Performance Budgets

These are the performance targets the system enforces:

| Operation | Budget | Measured At |
|-----------|--------|-------------|
| Three-pass decomposition | < 15 seconds | For problems with < 20 nodes |
| Stage 1 review | < 500ms | Per node |
| Stage 2 review | < 5 seconds | Per node |
| Context store lookup | < 50ms | Per node |
| Skill selection cascade | < 100ms | Per node |
| Wave planning + scheduling | < 2 seconds | Per wave |
| WebSocket state event delivery | < 100ms | Per event |
| Meta-layer cost | < 10% of total | Per DAG execution |

---

# 12. Testing Your DAGs

## 12.1 Mock LLM Provider

WinDAGs ships with a deterministic mock provider for testing. No API calls, no cost, predictable output.

```bash
windags run --provider mock "Build a REST API"
```

Configure mock behavior:

```yaml
# windags.test.yaml
provider:
  name: mock
  mock:
    default_response: "Mock output for {{task_signature}}"
    latency_ms: 100
    failure_rate: 0.0           # Set > 0 to test failure handling
    deterministic: true          # Same input -> same output
    responses:
      "implement-csv-parser": |
        function parseCSV(input: string): Record<string, string>[] {
          return input.split('\n').map(line => ({ raw: line }));
        }
      "write-tests": |
        test('parses CSV correctly', () => {
          expect(parseCSV('a,b\n1,2')).toHaveLength(1);
        });
```

## 12.2 Behavioral Contract Testing

Test that your DAG respects behavioral contracts:

```bash
windags test contracts <execution-id>
```

```
Behavioral Contract Test Results:

  BC-DECOMP-001 (halt on unclear problem):  PASS
  BC-DECOMP-002 (three-pass order):         PASS
  BC-DECOMP-003 (vague nodes have no agent): PASS
  BC-PLAN-001 (plan before schedule):        PASS
  BC-PLAN-002 (hard filters before ranking): PASS
  BC-EXEC-001 (Kahn's algorithm):            PASS
  BC-EVAL-001 (Floor before Wall):           PASS
  BC-EVAL-002 (no self-eval in scoring):     PASS
  BC-LEARN-001 (Thompson update per node):   PASS

  18/18 contracts verified
```

## 12.3 Testing Failure Handling

Inject failures to test your DAG's resilience:

```bash
windags run --inject-failure node-3:omission \
  "Build a CLI tool for image resizing"
```

Failure injection types:

```bash
--inject-failure <node-id>:crash             # Process crash
--inject-failure <node-id>:omission          # Timeout (no response)
--inject-failure <node-id>:byzantine         # Confident wrong output
--inject-failure <node-id>:crash_recovery    # Crash then recover on retry
--inject-failure wave-2:all_fail             # All nodes in wave 2 fail
--inject-failure skill:<name>:circuit_open   # Force circuit breaker open
```

Verify the system responds correctly:

```bash
windags trace last --failures
```

```
Failure Events:

  node-3 (implement-type-coercion):
    System layer: omission (injected)
    Escalation: L1 -> retry with same skill
    Retry result: SUCCESS (2nd attempt)
    Envelope impact: retry_ratio 0.5 for this node

  Escalation ladder activated: L1 only
  Circuit breakers: all CLOSED
  DAG completed: YES
  Quality impact: none (retry succeeded)
```

## 12.4 Performance Benchmarks

Measure your DAG's performance characteristics:

```bash
windags benchmark "Build a Python script for data validation" --runs 5
```

```
Benchmark Results (5 runs):

  Metric                    P50       P95       Max
  ─────────────────────────────────────────────────
  Total duration            38.2s     45.1s     48.3s
  Decomposition time        0.28s     0.34s     0.41s
  Wave 1 execution          12.1s     14.8s     16.2s
  Wave 2 execution          18.4s     22.3s     24.1s
  Looking Back              0.9s      1.2s      1.4s
  Total cost                $0.041    $0.052    $0.058
  Meta-layer cost           $0.004    $0.005    $0.006 (9.7%)
  Quality (aggregate)       0.84      0.81      0.78
  Envelope                  0.93      0.88      0.85

  Consistency: 4/5 runs produced same DAG structure
  Variance: cost +/- 18%, duration +/- 15%, quality +/- 5%
```

---

# 13. Troubleshooting and FAQ

## 13.1 Common Problems

### "HALT_CLARIFY: problem statement unclear"

The Sensemaker scored your problem below 0.6 on clarity, feasibility, or coherence.

Fix: Rewrite the problem statement with explicit unknown (what to produce), data (what is given), and conditions (constraints).

```bash
# Bad:
windags run "make it work"

# Good:
windags run "Write a Python function that takes a list of integers \
  and returns the two numbers that sum to a given target. \
  Return their indices. Assume exactly one solution exists."
```

### "NoMatchingSkillError: no skill matches task signature"

No skill in the library can produce the required output type.

Fix: Check available skills, or register a custom skill.

```bash
windags skills list --domain software-engineering
windags skills create custom-skill-for-this-task
```

### "CircuitBreakerOpenError: skill X has open circuit breaker"

The skill has failed too many times recently.

Fix: Wait for the cooldown period, or use an alternative skill.

```bash
windags circuit-breakers --level skill
# Shows cooldown remaining time

windags run --override-skill node-3:alternative-skill "your problem"
```

### "Budget exceeded: estimated cost exceeds limit"

The decomposition estimated a cost higher than your budget.

Fix: Increase the budget, reduce max parallel nodes, or use cheaper models.

```bash
windags run --budget 5.00 "your expensive problem"
windags run --model claude-haiku-4-20250514 "your problem"
windags run --max-parallel 2 "your problem"
```

### Visualization shows nothing / blank page

The WebSocket connection failed or the server is not running.

Fix: Check the port, restart the server, or clear the cache.

```bash
windags show last --port 3401  # Try a different port
windags config set visualization-port 3401
```

### Stage 2 review never runs

The economic threshold is not met. `P(failure) * downstream_cost < stage2_cost` for all nodes.

Fix: Force Stage 2 for specific nodes, or set evaluation depth to `always`.

```bash
windags run --eval-depth full "your problem"
```

## 13.2 Frequently Asked Questions

**Q: How much does a typical execution cost?**

For a well-structured problem producing 5-15 nodes: $0.02-0.08. The meta-layer (orchestration overhead) is under 10% of that. You pay your own LLM API costs; WinDAGs does not mark up the API calls.

**Q: Can I use my own models?**

Yes. Configure a custom provider in `windags.config.yaml`:

```yaml
provider:
  name: custom
  api_key: ${MY_API_KEY}
  base_url: https://my-llm-provider.com/v1
  default_model: my-model-id
```

The provider must support the OpenAI-compatible chat completions API. WinDAGs requires structured output support for reliable Stage 1 review.

**Q: Can I edit the DAG before execution?**

Yes. Use `--dry-run` to see the plan, then `--interactive` to approve each wave:

```bash
windags run --dry-run "your problem"
# Review the decomposition plan
windags run --interactive "your problem"
# Approve, modify, or reject each wave before execution
```

Full DAG authoring mode (graphical editor) is planned for Phase 2.

**Q: How does WinDAGs compare to LangGraph?**

LangGraph requires you to define state graphs manually. WinDAGs generates the graph from a problem statement. LangGraph has no built-in quality evaluation or learning. WinDAGs evaluates every output and improves over time. LangGraph is a lower-level framework; WinDAGs is a higher-level platform.

The 5-minute Hello World comparison:
- LangGraph: Define StateGraph, add nodes, add edges, compile, invoke
- WinDAGs: `windags run "your problem"`

**Q: What happens when the system encounters a completely novel problem?**

The Sensemaker classifies it as `ill-structured` or `wicked`. The Decomposer creates mostly vague nodes with `EXPLORATORY` commitment. The PreMortem runs a full analysis. Human gates may be inserted. The system progresses cautiously, expanding vague nodes one wave at a time as information accumulates.

**Q: Can I run WinDAGs in CI/CD?**

Yes. Use the `--json` flag for machine-readable output and `--quiet` for minimal logging:

```bash
result=$(windags run --json --quiet --provider mock "your problem")
quality=$(echo $result | jq '.quality.aggregate')
if (( $(echo "$quality < 0.7" | bc -l) )); then
  echo "Quality below threshold"
  exit 1
fi
```

**Q: How do I debug a failing node?**

```bash
# Show the failure trace
windags trace last --node <node-id> --failures

# Show what the node received as input
windags trace last --node <node-id> --quality

# Show the full LLM call (L3 disclosure)
windags trace last --node <node-id> --debug
```

**Q: What data does WinDAGs store locally?**

All data stays local in Phase 1:
- SQLite database: `~/.windags/windags.db` (execution traces, learning state, skill rankings)
- Skill files: `.windags/skills/` (SKILL.md files)
- Output files: `./windags-output/` (execution outputs)
- Config: `~/.windags/config.yaml` or `./windags.config.yaml`

No data is sent to WinDAGs servers in Phase 1. When you opt into the marketplace in Phase 2+, only published skills are transmitted.

---

# 14. Migration from V2

## 14.1 What Changed

| Area | V2 | V3 |
|------|----|----|
| Decomposition | Single-pass, full upfront | Three-pass, wave-by-wave progressive |
| Node types | Concrete only | Concrete + Vague + Human Gate |
| Failure handling | Six-mode taxonomy | Four-dimension classification |
| Evaluation | Single-stage | Two-stage (Contract + Cognitive) |
| Quality | Scalar scores | Quality vectors (Floor/Wall/Ceiling/Envelope) |
| Learning | Skill-level Thompson + Elo | + Method-level + Topology-level |
| Commitment levels | BOLD / CAUTIOUS / META_LEVEL | COMMITTED / TENTATIVE / EXPLORATORY |
| K-factors | new=32, established=16, dominant=8 | novice=40, competent=32, proficient=24, expert=16 |
| Meta-DAG agents | Fixed 12 agents | 5-7 core + dynamic instantiation |
| Visualization | Single mode | 4 modes + 3 overlays + 3 disclosure levels |
| Coordination | DAG only (implicit) | DAG (explicit) + abstraction for future models |

## 14.2 Migration Steps

### Step 1: Update the Package

```bash
npm install -g windags@3
```

### Step 2: Migrate Configuration

V3 configuration is backwards-compatible with V2 for core settings. New settings get defaults:

```bash
windags migrate config
```

```
Migration Report:
  [OK] api_key: preserved
  [OK] default_model: preserved
  [OK] budget: preserved
  [NEW] evaluation.stage2_threshold: set to 'auto' (V2 had no Stage 2)
  [NEW] decomposition.vague_node_expansion: set to 'progressive'
  [NEW] failure.circuit_breaker: enabled with defaults
  [NEW] learning.method_learning: enabled
  [RENAMED] commitment.BOLD -> COMMITTED
  [RENAMED] commitment.CAUTIOUS -> TENTATIVE
  [RENAMED] commitment.META_LEVEL -> EXPLORATORY
```

### Step 3: Migrate Skills

V2 SKILL.md files are valid V3 SKILL.md files. The format is the same. V3 adds optional sections (PRECONDITIONS, QUALITY CHECKLIST) that improve skill matching but are not required.

```bash
windags migrate skills
```

```
Skill Migration Report:
  47 skills found in V2 format
  47/47 valid in V3 format
  0 require changes

  Recommendations:
  - 12 skills would benefit from PRECONDITIONS section
  - 8 skills would benefit from QUALITY CHECKLIST section
  Run 'windags skills enhance --all' to auto-generate these sections
```

### Step 4: Migrate Learning State

V2 Thompson sampling parameters and Elo ratings are compatible with V3. V3 adds method-level and topology-level learning, which start from scratch:

```bash
windags migrate learning-state
```

```
Learning State Migration:
  Thompson params: 47 skills migrated (alpha, beta preserved)
  Elo ratings: 47 skills migrated (scalar -> vector, other dimensions initialized to 1200)
  K-factors: remapped (new=32 -> novice=40, established=16 -> proficient=24, dominant=8 -> expert=16)
  Method rankings: initialized (no V2 data)
  Topology rankings: initialized (no V2 data)
  Kuhnian crisis state: preserved
  Monster-barring: initialized (new in V3)
```

### Step 5: Verify

```bash
windags doctor
```

```
WinDAGs V3 Health Check:

  Configuration:     OK
  Provider:          OK (anthropic, claude-sonnet-4-20250514)
  Skills:            OK (47 registered)
  Learning state:    OK (migrated from V2)
  Database:          OK (SQLite, 12.4 MB)
  Templates:         OK (20 seed + 0 custom)
  Circuit breakers:  OK (all CLOSED)
  Visualization:     OK (port 3400 available)

  Ready to execute.
```

## 14.3 Breaking Changes

1. **Commitment level names changed**: `BOLD` -> `COMMITTED`, `CAUTIOUS` -> `TENTATIVE`, `META_LEVEL` -> `EXPLORATORY`. Update any scripts that reference these names.

2. **Quality scores are vectors**: If you parse quality scores from JSON output, they are now objects with named dimensions instead of single numbers. The `aggregate` field provides the V2-compatible scalar.

3. **K-factors changed**: If you have custom K-factor overrides, update them. V3 K-factors are higher across the board (more exploration).

4. **Failure types expanded**: V2's six failure modes map to V3's System Layer dimension. Your failure handling scripts will still work, but they now receive richer data.

5. **Visualization port default changed**: V2 used port 3000. V3 uses port 3400 to avoid conflicts with common dev servers.

---

# 15. What Comes Next

## Phase 2 (Weeks 9-24)

- Team coordination model (bidirectional edges, voting)
- Method-level learning with stage-gated exploration
- Full Stage 2 review (Channel A + Channel B)
- Cognitive telemetry (opt-in)
- PostgreSQL migration for scalable deployments
- Temporal integration for durable execution
- Near-miss logging and resilience overlay

## Phase 3 (Weeks 25-36)

- Market coordination model (competitive bidding)
- DSPy compilation integration (Python)
- Compiled modules as marketplace assets
- Debate as Team variant
- Curriculum-driven exploration

## Phase 4 (Ongoing)

- Blackboard and Hierarchical coordination models
- Formal safety/liveness guarantees
- Chaos engineering (deliberately failing nodes to test resilience)
- A2A protocol support
- Canary deployments for skill updates

---

This concludes the WinDAGs V3 Practitioner's Guide.

**Part 1** covered installation, core concepts, your first DAG, and reading the output.
**Part 2** covered building skills, the execution engine, visualization, and the CLI.
**Part 3** covered advanced topics, configuration, testing, troubleshooting, and migration.

For the theoretical foundations and architectural rationale, see the WinDAGs V3 Constitution (the consolidated specification). For marketplace and business model details, see the Go-to-Market Strategy document. For contribution guidelines, see CONTRIBUTING.md.

The shortest path to productivity: `windags run "your problem here"`.
