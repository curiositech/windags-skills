# Skillful Node Execution for `next-move`

When `next-move` shifts from prediction to execution, each predicted subtask must become a **skillful node**, not a generic subagent prompt.

This reference operationalizes:

- `skills/skillful-node-prompt/SKILL.md`
- `skills/skillful-subagent-creator/SKILL.md`

## Node Contract

Each execution node should be specified with:

```json
{
  "role": "string",
  "primary_skill_id": "string",
  "secondary_skill_ids": ["string"],
  "model_tier": "fast | balanced | powerful",
  "task_description": "string",
  "focus_files": ["string"],
  "domain_keywords": ["string"],
  "input_contract": {
    "required_inputs": ["string"],
    "upstream_nodes": ["string"]
  },
  "output_contract": {
    "format": "string",
    "fields": ["string"]
  },
  "side_effects": ["read-only | file-write | git | api | pd"],
  "escalation": {
    "when_to_escalate": ["string"],
    "fallback": "string"
  }
}
```

The exact shape can vary, but these concerns must exist.

## Prompt Architecture

Use the four-branch structure from `skillful-node-prompt`:

1. **Identity**
   - narrow role
   - primary skill body
   - secondary skills listed or injected
2. **Context**
   - upstream outputs
   - target project
   - relevant files
   - risk notes
3. **Task**
   - the concrete node job
   - success criteria
   - permitted side effects
4. **Protocol**
   - task loop
   - output contract
   - escalation behavior
   - confidence report

Use `prompts/execution-node.md` as the canonical template.

## Skill Selection Rules per Node

### Primary skill

Choose the one skill that should dominate the node's operating procedure.

### Secondary skills

Add only when they materially change execution.

Good reasons:

- testing framework needs specific patterns
- UI node needs `reactflow-expert`
- contract-sensitive handoff needs `output-contract-enforcer`

Bad reasons:

- "maybe useful"
- "sounds smart"
- "covers the whole domain"

Keep the total equipped skill count small.

## Gate Rules

If a node is really a human approval or review step:

- model it as a gate
- use `human-gate-designer` patterns
- do not bury approval inside prose

If the runtime shape is workflow/reviewer-style, remember the current server expects reviewer or gate outputs to end with:

```text
VERDICT: approved
VERDICT: rejected
VERDICT: escalate
```

That behavior is implemented in `packages/cli/src/server.ts`.

## Output Discipline

Use explicit output contracts whenever:

- another node depends on structured fields
- the result will be displayed in a live DAG inspector
- the node writes data that a later validation step consumes

If you need structured downstream behavior, include contract validation in the node or equip `output-contract-enforcer`.

## Side Effects

Every node should state its side effects up front:

- read-only
- file writes
- git operations
- API calls
- Port Daddy operations

This matters for both user trust and execution previews.

## Quality Gates

- [ ] Narrow role is explicit
- [ ] One primary skill is named
- [ ] Secondary skills are justified
- [ ] Input contract is explicit
- [ ] Output contract is explicit when needed
- [ ] Side effects are listed
- [ ] Escalation conditions are listed
- [ ] Confidence is required in the response
- [ ] Gates are modeled as gates, not prose

## Failure Modes

### Generic "paste the skill body and hope"

Symptom:
- node prompt is just `SKILL.md` plus a task paragraph

Fix:
- instantiate `prompts/execution-node.md`

### Too many equipped skills

Symptom:
- node prompt turns into a catalog dump

Fix:
- keep a narrow role and only the skills needed for the node

### Missing output contract

Symptom:
- downstream node has to parse free-form prose

Fix:
- define fields or equip contract enforcement
