---
name: skillful-node-prompt
description: How WinDAGs constructs prompts for agent nodes. Encodes the hypertree structure, DSPy signature model, 4-section subagent pattern, discourse metadata, and memory-scored context selection. The meta-skill that teaches agents how to be skillful.
category: Agent & Orchestration
tags:
  - windags
  - prompt-architecture
  - node-execution
  - skills
  - meta-skill
allowed-tools: Read
pairs-with:
  - skill: skillful-subagent-creator
    reason: Defines the 4-section prompt structure this skill implements
  - skill: task-decomposer
    reason: Decomposes tasks into nodes that this skill equips
  - skill: dag-execution-tracer
    reason: Traces what this skill produces
---

# Skillful Node Prompt Architecture

A node prompt is not a string. It is a **hypertree of independent branches** that merge at execution time. Each branch is a module with its own concern, assembled into a coherent prompt that gives an agent everything it needs to execute one node in a DAG.

## When to Use This Skill

Activate when:
- Building or modifying `SkillNodeExecutor.buildPrompt()`
- Designing how a DAG node agent receives its instructions
- Debugging why an agent produced poor output (check which branch failed)
- Adding new capabilities to node prompts (new branch, not longer chain)
- Configuring the node configurator module in the planning pipeline

NOT for: writing the task decomposer prompt, designing the swarm bridge prompt, or creating skills themselves.

## The Hypertree Structure

A node prompt has 4 top-level branches that are independently constructed and independently reasoned about. This is NOT a sequential 8-section document — it is 4 parallel concerns that merge at the root.

```
                        [Node Prompt]
                       /      |       \        \
              [Identity]  [Context]  [Task]  [Protocol]
              /       \       |        |       /    |    \
        [Skill    [References] [Upstream] [Description] [Tools] [Output] [Escalation]
         Body]                  [Whiteboard]             [MCPs]  [Contract]
```

### Branch 1: Identity — Who You Are

**Signature**: `(skillId, skillIds[]) → expertise section`

This branch answers: what expertise does this agent have?

Contents:
- **Skill body**: The full SKILL.md content for the primary skill (2-5K tokens)
- **Catalog skills**: Name + description for secondary skills (50 tokens each)
- **Available references**: File paths + descriptions for on-demand loading
- **Reference loading instruction**: "Use read_skill_reference to load any reference file relevant to your task. The skill body is the overview — references contain worked examples, schemas, and deep expertise."

Construction rule: Resolve skills via `resolveSkill()` / `resolveSkills()`. If multiple skills, merge bodies with `## Skill: {id}` headers. List reference files with sizes and descriptions. Never load reference bodies eagerly — list them for on-demand loading.

### Branch 2: Context — What You Know

**Signature**: `(upstreamOutputs, whiteboard, waveMetrics, priorDiscourse?) → context section`

This branch answers: what has already happened in this execution?

Contents:
- **Upstream wave summaries**: Compressed outputs from prior waves (from ScopedAccumulator)
- **Whiteboard entries**: Shared key-value state across nodes
- **Aggregate metrics**: Waves completed, tokens used, cost, avg confidence
- **Prior discourse** (swarm only): Scored messages from other agents, ranked by recency × importance × relevance

Construction rule: If accumulator is available, inject wave summaries, whiteboard, and metrics. For swarms, score prior messages using Park-style retrieval (recency: exponential decay 30s half-life, importance: synthesize > counter > propose > inform, relevance: keyword overlap with agent's skill). Include top-scoring messages within context budget.

### Branch 3: Task — What to Do

**Signature**: `(taskDescription, domainKeywords?, files?, mcps?, userPreferences?) → task section`

This branch answers: what specific work does this node perform?

Contents:
- **Task description**: The natural language instruction
- **Domain keywords**: For context grounding
- **Focus files**: Specific file paths to work on
- **Available MCPs**: External tools the agent can use
- **User preferences**: Deployment target, styling, database, frameworks, things to avoid

Construction rule: Task description comes from the node's `description` field or `metadata.taskDescription`. All other fields are optional and only included when present. Keep this section clean — no skill content, no context, just the job.

### Branch 4: Protocol — How to Behave

**Signature**: `(toolPermissions, outputContract?, isSwarm?) → protocol section`

This branch answers: what rules govern this agent's behavior?

Contents:
- **Task-handling loop**: Restate → Assess fit → Load references → Execute → Validate → Report
- **Tool constraints**: Which tools are allowed (from skill `allowed-tools` frontmatter)
- **Output contract**: Expected output format (JSON schema if structured)
- **Escalation protocol**: How to refuse a task that's out of scope (return structured `{status: 'escalate', reason, suggestion, partial_work}`)
- **Confidence self-assessment**: Mandatory confidence block in output
- **Discourse metadata** (swarm only): How to annotate responses with speech act, relationship, thesis, respondingTo

Construction rule: Always include the task-handling loop and escalation protocol. Include confidence block unless explicitly disabled. Include discourse instructions only for swarm agents. Tool constraints come from `toClaudeCliFlags()` for ProcessExecutor or built-in tool definitions for ProviderExecutor.

## The DSPy Model

Each branch is a **module** in the DSPy sense — it has a signature (typed inputs → typed outputs), learnable parameters (which demonstrations work best), and a compilation target (metrics that evaluate quality).

### Signatures (the interface)

```typescript
// Branch 1
type IdentitySignature = (skillId: string, skillIds: string[]) => string;

// Branch 2
type ContextSignature = (
  upstreamOutputs: Map<string, unknown>,
  whiteboard: Record<string, unknown>,
  metrics: WaveMetrics,
  priorMessages?: ScoredMessage[],
) => string;

// Branch 3
type TaskSignature = (description: string, metadata: NodeMetadata) => string;

// Branch 4
type ProtocolSignature = (
  toolPermissions: ToolPermission[],
  isSwarm: boolean,
  outputContract?: JSONSchema,
) => string;

// Assembly
type NodePromptSignature = (
  identity: string,
  context: string,
  task: string,
  protocol: string,
) => string;
```

### Parameters (what gets optimized)

In the current implementation, parameters are fixed (hand-written section templates). In a DSPy-compiled version:
- **Identity**: Which reference files to pre-summarize vs. list for on-demand loading
- **Context**: How many prior messages to include, at what compression level
- **Task**: Whether to include domain keywords (sometimes noise, sometimes essential)
- **Protocol**: Which task-handling loop steps to emphasize, which to abbreviate

### Metrics (what makes a good prompt)

The quality gates ARE the metrics:
- **Floor**: Did the node produce non-empty output?
- **Wall**: Does the output match the expected type/format?
- **Ceiling**: Did the agent demonstrate genuine reasoning (not just pattern matching)?
- **Envelope**: Did execution stay within time/cost/token bounds?

A compiled node prompt optimizes these metrics by bootstrapping from successful execution traces.

## Node Configurator Module

The node configurator runs AFTER the decomposer and skill matcher, BEFORE execution. It produces the full execution config for each node:

```typescript
interface NodeExecutionConfig {
  // From decomposer
  nodeId: string;
  taskDescription: string;
  dependencies: string[];

  // From skill matcher
  primarySkillId: string;
  secondarySkillIds: string[];

  // From node configurator (NEW)
  tools: string[];           // which tools this node needs
  mcps: string[];            // which MCP servers to connect
  permissions: PermissionLevel; // read-only, standard, full
  promptTechnique: 'direct' | 'chain-of-thought' | 'react';
  referenceStrategy: 'list-only' | 'pre-summarize-top-3' | 'eager-load-all';
  contextBudget: number;     // max tokens for upstream context
  model: string;             // which model tier
  timeoutMs: number;         // execution timeout
  outputContract?: JSONSchema; // expected output structure
}
```

The configurator reads the skill's frontmatter (`allowed-tools`, `pairs-with`, reference files) and the task description to determine these values. It's a separate planning step, not part of the decomposer.

## Anti-Patterns

### 1. Sequential String Concatenation
**Wrong**: Building the prompt as one long string, section by section, top to bottom.
**Why**: Creates a chain where error in section 3 corrupts section 7. Changes to one section require re-reading the whole prompt.
**Right**: Build each branch independently, assemble at the end. If one branch fails, the others are unaffected.

### 2. Eager Reference Loading
**Wrong**: Reading all reference file contents and injecting them into the prompt.
**Why**: Blows the context window. A skill with 11 references × 2KB each = 22KB of content the agent may not need.
**Right**: List references with descriptions. Give the agent `read_skill_reference` tool to load on demand. The agent decides what's relevant.

### 3. Flat Context (No Scoring)
**Wrong**: Including the last N messages from prior waves/agents regardless of relevance.
**Why**: Fills context with noise. An irrelevant upstream output displaces a critical one.
**Right**: Score context by recency × importance × relevance. Include top-scoring items within budget.

### 4. Hard-Coded Prompt Technique
**Wrong**: Always using the same task-handling loop regardless of task complexity.
**Why**: A simple "write a file" task doesn't need a 6-step loop. A complex "analyze and recommend" task needs more structure.
**Right**: The node configurator chooses `direct` (simple tasks), `chain-of-thought` (reasoning tasks), or `react` (tool-heavy tasks) based on skill and task.

### 5. Missing Escalation Protocol
**Wrong**: Omitting escalation instructions to save tokens.
**Why**: The agent attempts out-of-scope tasks and produces garbage instead of refusing.
**Right**: Always include escalation. Predictable scope > unpredictable quality.

### 6. Monolithic Planning
**Wrong**: The decomposer outputs skill IDs, tools, MCPs, permissions, model, timeout all in one step.
**Why**: Too many concerns for one planning call. The decomposer is good at structure, not at per-node tool selection.
**Right**: Stratify: decomposer → skill matcher → node configurator → prompt builder → execution. Each step reasons locally about its concern.

## Quality Gates

- [ ] Each branch can be constructed independently (no cross-branch dependencies during build)
- [ ] Skill body is present for primary skill (not just the ID)
- [ ] Reference files listed with paths and descriptions (not eagerly loaded)
- [ ] `read_skill_reference` tool available when references exist
- [ ] Upstream context scored by relevance, not just chronological
- [ ] Task description present and specific (not generic)
- [ ] Tool permissions match skill frontmatter
- [ ] Escalation protocol included
- [ ] Confidence self-assessment included
- [ ] Discourse metadata instructions included (swarm only)
- [ ] Output contract specified when downstream nodes need structured input
- [ ] Total prompt size within model's context budget (track per-branch token counts)

## NOT-FOR Boundaries

Do NOT use this skill for:
- **Swarm bridge prompts**: The swarm comment-section prompt has additional requirements (channel awareness, discourse metadata, memory-scored prior messages). Use `swarm-executor-bridge` logic.
- **Meta-DAG prompts**: The `/next-move` prediction pipeline has its own prompt structure. Use `windags-sensemaker` / `windags-decomposer`.
- **Skill creation**: Writing SKILL.md files is a different concern. Use `skill-architect`.
- **Team manager prompts**: The Team executor's manager prompt has dynamic role listing and round-by-round state. Use `team.ts` buildManagerPrompt.
