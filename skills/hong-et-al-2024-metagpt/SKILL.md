---
license: Apache-2.0
name: hong-et-al-2024-metagpt
description: Applies insights from MetaGPT paper on how structured communication, role specialization, and SOPs prevent coordination failures in multi-agent LLM systems
category: Research & Academic
tags:
  - multi-agent
  - software-development
  - llm-agents
  - role-assignment
  - collaboration
---

# MetaGPT: Multi-Agent Systems Through Structured Coordination

## Decision Points

### Agent Count & Architecture Selection
```
IF task requires <3 sequential steps with minimal handoffs
└── Use single agent with structured output templates
    └── Add validation checkpoints at each step

IF task requires 3-7 steps with clear role boundaries
├── Use role-based specialization (PM→Architect→Engineer→QA)
│   └── Implement structured artifacts at each handoff
└── Add pub-sub message pool if >5 agents

IF task requires >7 agents or complex information sharing
└── Mandatory pub-sub architecture with typed messages
    ├── Define message schemas first, then agent roles
    └── Implement subscription patterns by information type
```

### Domain-Specific Decomposition Strategy
```
IF task has established human SOP (software dev, research, content)
├── Encode existing workflow as agent roles
│   └── Map human deliverables to structured artifacts
└── Validate each role produces testable outputs

IF task is novel/experimental
├── Start with 3-agent proof-of-concept (Generator→Validator→Refiner)
│   └── Identify handoff points where information degrades
└── Add specialization only when bottlenecks appear
```

### Feedback Mechanism Selection
```
IF output is executable (code, API calls, database queries)
└── Mandatory execution feedback loop
    ├── Capture concrete errors (stack traces, response codes)
    └── Feed errors back to generating agent

IF output is structured data (JSON, documents, reports)
├── Schema validation first
└── Content validation via executable checks where possible

IF output is creative/subjective (writing, designs)
└── Use structured evaluation criteria with binary checkpoints
```

## Failure Modes

### 1. **Hallucination Cascade** 
*Symptoms*: Output quality degrades with each agent handoff; later agents produce confident but incorrect results based on earlier errors
*Detection*: Compare first agent output quality to final output—if final is significantly worse, cascade is occurring
*Fix*: Implement structured artifacts with validation at each handoff; require concrete verification before passing to next agent

### 2. **Context Dilution**
*Symptoms*: Agents lose critical information from earlier steps; requirements get "interpreted" differently at each stage
*Detection*: If agents ask for information that was provided earlier, or if final output doesn't match initial requirements
*Fix*: Use persistent structured documents (PRDs, design specs) that agents read from rather than relying on message passing

### 3. **Coordination Thrashing**
*Symptoms*: Agents endlessly negotiate, ask clarifying questions, or produce conflicting outputs
*Detection*: High message volume between agents with low progress on actual deliverables; circular dependencies in agent communication
*Fix*: Switch to pub-sub with pre-defined message types; eliminate agent-to-agent negotiation in favor of structured information publishing

### 4. **Executable Bypass**
*Symptoms*: Code/outputs that look correct but fail when tested; agents claiming "validation complete" without actually running tests
*Detection*: If agent reports success but execution reveals errors that should have been caught
*Fix*: Make execution feedback mandatory and automatic; never accept agent self-assessment without concrete verification

### 5. **Role Boundary Blur**
*Symptoms*: Agents performing tasks outside their specialization; unclear ownership when outputs fail
*Detection*: If you can't answer "which agent is responsible for X deliverable?" or agents produce overlapping outputs
*Fix*: Redefine roles by output artifacts; each agent owns exactly one type of structured deliverable

## Worked Examples

### Example 1: Research Paper Analysis Pipeline

**Scenario**: Analyze 50 academic papers to identify trends in multi-agent systems

**Initial Approach** (fails): Single agent reads papers and produces analysis
- Agent gets overwhelmed by 50 papers, loses context
- Analysis lacks systematic comparison framework
- No way to verify claims against source material

**MetaGPT Approach**:
1. **Paper Processor** agent produces structured summaries:
   ```json
   {
     "title": "...",
     "methodology": "...", 
     "key_findings": ["...", "..."],
     "evaluation_metrics": {...}
   }
   ```

2. **Trend Analyzer** subscribes to summary messages, produces trend reports:
   ```json
   {
     "trend_name": "...",
     "supporting_papers": ["id1", "id2"],
     "evidence_strength": "high|medium|low",
     "counter_evidence": [...]
   }
   ```

3. **Synthesis Agent** produces final analysis with traceable references

**Key Decisions Made**:
- Used structured JSON to prevent information loss between agents
- Made trend claims traceable to specific papers (executable verification)
- Each agent specialized on one output type with clear success criteria

**Failure Recovery**: When Trend Analyzer produced unsupported claims, the structured format allowed automatic verification against source summaries—claims without supporting evidence were flagged and regenerated.

### Example 2: Content Generation Pipeline with Failure Recovery

**Scenario**: Generate technical blog posts from API documentation

**Decision Tree Navigated**:
1. **Agent Count**: 4 steps (Research→Outline→Draft→Edit) = role-based specialization
2. **Domain**: Has human SOP (technical writing process) = encode existing workflow  
3. **Feedback**: Output is text but with verifiable technical claims = mixed validation

**Implementation**:
- **Research Agent** produces structured fact sheet with verifiable claims:
  ```json
  {
    "api_endpoints": [{"url": "...", "verified": true/false}],
    "code_examples": [{"code": "...", "tested": true/false}],
    "use_cases": [...]
  }
  ```

- **Outline Agent** subscribes to fact sheets, produces structured outline
- **Draft Agent** writes content following outline structure  
- **Technical Editor** validates code examples through execution

**Failure Recovery Scenario**: Draft Agent claimed an API endpoint returned specific JSON structure. Technical Editor executed the API call, discovered different response format, published correction to message pool. Draft Agent automatically regenerated affected sections with correct structure.

**What Novice Would Miss**: Running code examples to verify they work; accepting plausible-sounding API behavior without testing
**What Expert Catches**: Every technical claim must be executable-verifiable; structure enables automatic error localization and recovery

## Quality Gates

- [ ] Each agent role is defined by exactly one structured output artifact type
- [ ] All agent handoffs use validated structured formats (schemas, templates)
- [ ] Executable outputs include mandatory execution feedback loops
- [ ] Information flow uses pub-sub for >3 agents, eliminating point-to-point dependencies
- [ ] Each structured artifact includes fields that enable error detection/verification
- [ ] Agent responsibilities map to proven human role boundaries (where domain SOPs exist)
- [ ] System can recover from individual agent failures without manual intervention
- [ ] Final output quality is verifiable through concrete metrics, not agent self-assessment
- [ ] Adding/removing agents doesn't require rewiring communication logic
- [ ] Each agent's success criteria are binary and testable

## NOT-FOR Boundaries

**Don't use MetaGPT principles for**:
- Single-step tasks that one agent can complete without handoffs → Use basic prompt engineering instead
- Creative tasks where "correctness" is subjective and not verifiable → Use human-in-loop evaluation instead  
- Real-time interactive systems where pub-sub latency is prohibitive → Use direct agent communication with careful prompt design
- Tasks where human SOPs don't exist or are counterproductive → Use experimental multi-agent approaches instead
- Systems where structured output significantly constrains useful creativity → Use loose coordination with human oversight instead

**For these alternatives, use**:
- Simple automation: `basic-prompting` 
- Creative workflows: `human-ai-collaboration`
- Real-time systems: `direct-agent-coordination`
- Novel problem domains: `experimental-multi-agent`
- Creative processes: `structured-creativity-frameworks`