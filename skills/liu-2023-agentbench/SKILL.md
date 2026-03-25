---
license: Apache-2.0
name: liu-2023-agentbench
description: Comprehensive benchmark suite for evaluating LLM agents across diverse interactive environments
category: Research & Academic
tags:
  - benchmarks
  - llm-agents
  - evaluation
  - agent-testing
  - capabilities
---

# SKILL: AgentBench - Evaluating and Debugging LLM Agents

## DECISION POINTS

### Model Selection for Agent Tasks
```
IF task requires procedural execution (web shopping, DB queries, API calls):
  ├─ IF <15 steps AND template-based outputs
  │  └─ Use code-trained models (CodeLlama) - 3x better at format compliance
  └─ IF >15 steps OR requires plan revision
     └─ Use general models (GPT-4) - maintains coherence across turns

IF task requires strategic reasoning (games, puzzles, negotiations):
  ├─ IF model must generate novel hypotheses
  │  └─ Avoid code-trained models - they over-optimize for deterministic paths
  └─ IF model must revise plans based on feedback
     └─ Use frontier models only - others lose state after round 5

IF failure budget <10%:
  ├─ Invalid format/action rate matters more than success rate
  └─ API models (GPT-4: 6% invalid) vs Open source (13.6% invalid)

IF task involves >20 interaction rounds:
  └─ Only GPT-4 tier maintains plan-state binding - others enter loops by round 10
```

### Failure Diagnosis Decision Tree
```
IF agent produces malformed outputs despite clear instructions:
  ├─ Check Rouge-L similarity in last 3 outputs
  │  ├─ High (>0.8): Loop detection failure → Add state tracking
  │  └─ Low (<0.5): Executive function gap → Add format validation
  
IF agent violates environment rules (impossible actions):
  ├─ Count rule violations per environment type
  │  ├─ Code environments: Missing API constraints → Add action space docs
  │  ├─ Game environments: Invalid moves → Add rule reminders each turn  
  │  └─ Web environments: Element targeting → Add DOM structure context

IF agent exceeds task limits without completion:
  ├─ Analyze final 5 rounds for repetition patterns
  │  ├─ Repeating same action: Add "what have I tried?" prompt
  │  ├─ Repeating same reasoning: Add progress checkpoints
  │  └─ Random actions: Escalate to human or abort task
```

### Prompt Engineering Verbosity Trade-off
```
IF environment has complex rule set (>10 constraints):
  ├─ High verbosity: Include full rules every turn
  │  └─ Trade-off: Context bloat but lower invalid action rate
  └─ Low verbosity: Rules in system message only
     └─ Trade-off: Cleaner prompt but higher rule violation risk

IF task requires >10 sequential steps:
  ├─ Include explicit progress tracking: "Step X of Y completed"
  └─ Add loop detection: "Have I done this exact action before?"
```

## FAILURE MODES

### 1. Rubber Stamp Validation ("Format Looks Right")
**Detection Rule**: If model produces structurally valid JSON but semantically invalid actions (e.g., `{"action": "click", "element": "nonexistent_button"}`)

**Symptoms**: 
- Valid syntax, impossible actions
- Model explains action correctly but targets wrong elements
- High invalid action rate (>15%) despite format compliance

**Diagnosis**: Dissociation between linguistic understanding and environmental grounding

**Fix**: Add action pre-validation layer that checks element existence before execution

### 2. Planning Amnesia ("I Had a Plan, What Was It?")
**Detection Rule**: If model generates good initial plan but actions don't follow plan by round 5+ OR model repeats plan generation mid-task

**Symptoms**:
- Rouge-L <0.3 between plan and actual action sequence
- Model re-explains same strategy when asked mid-task
- Good reasoning in `<thought>` tags, contradictory actions

**Diagnosis**: Plan-state binding failure in working memory

**Fix**: Include plan summary in every prompt; add "current plan step" tracking

### 3. Metacognitive Blindness ("I'm Not Stuck")
**Detection Rule**: If Rouge-L ≥0.8 in final 3 rounds AND task incomplete

**Symptoms**:
- Repeating identical actions/reasoning
- No recognition of loop when explicitly asked
- Confidence remains high despite lack of progress

**Diagnosis**: No internal representation of "attempted strategies" or progress monitoring

**Fix**: External loop detection with mandatory strategy pivot after 3 identical rounds

### 4. Code Training Rigidity ("There Must Be One Right Sequence")
**Detection Rule**: If code-trained model fails strategic tasks with success rate <50% of general model performance

**Symptoms**:
- Over-optimization for deterministic execution
- Fails to explore alternative paths when first approach fails
- Strong performance on procedural tasks, weak on exploratory tasks

**Diagnosis**: Code training bias toward single optimal path

**Fix**: Use general models for strategic tasks; add explicit exploration prompts for code-trained models

### 5. Executive Function Collapse ("I Know What To Do But Can't Do It")
**Detection Rule**: If model correctly explains requirements when asked but immediately violates them in output

**Symptoms**:
- Perfect task understanding in conversation mode
- Immediate format violations in action mode
- Can debug own errors but repeats them

**Diagnosis**: Linguistic competence vs. procedural compliance dissociation

**Fix**: Constrained decoding, output validation layer, or format templates with variable substitution

## WORKED EXAMPLES

### Example 1: Web Shopping Failure Analysis
**Scenario**: Agent must purchase specific laptop from e-commerce site. CodeLlama-34b vs GPT-4 comparison.

**Turn 1-3**: Both models navigate homepage correctly, use search function
- CodeLlama: Clean JSON format, efficient navigation
- GPT-4: Slightly verbose but same actions

**Turn 4-6**: Product comparison required
- CodeLlama: Attempts to add first matching product to cart immediately
- GPT-4: Opens multiple products, compares specs against requirements

**Turn 7-12**: CodeLlama hits constraint (wrong specs)
- CodeLlama: Loops on same product, doesn't revise search strategy
- GPT-4: Recognizes mismatch, refines search with different keywords

**Turn 13+**: Task completion
- CodeLlama: Task limit exceeded (TLE) - Rouge-L 0.87 in final rounds
- GPT-4: Completes purchase successfully

**Key Insight**: Procedural task (web navigation) initially favors CodeLlama, but strategic pivot requirement (spec mismatch → search refinement) causes failure. The task grounding shifted from procedural to strategic mid-execution.

### Example 2: Debug TLE Loop with Recovery
**Scenario**: Agent stuck in navigation loop on unfamiliar website

**Detection Phase**:
```
Round 15: {"action": "click", "element": "nav-menu"}
Round 16: {"action": "click", "element": "nav-menu"}  
Round 17: {"action": "click", "element": "nav-menu"}
Rouge-L: 0.92 - LOOP DETECTED
```

**Recovery Steps**:
1. **Interrupt**: Insert "You've clicked nav-menu 3 times. What are you trying to accomplish?"
2. **State Reset**: Agent responds: "Looking for product categories"  
3. **Alternative Prompt**: "List 3 different ways to find product categories besides nav-menu"
4. **Strategy Pivot**: Agent suggests search bar, footer links, homepage scan
5. **Execution**: Agent successfully uses search bar, completes task

**Key Insight**: Loop detection must trigger strategy enumeration, not just "try harder." The fix is metacognitive scaffolding, not better reasoning.

## QUALITY GATES

- [ ] Invalid format rate <8% (measure malformed JSON/action structures)
- [ ] Invalid action rate <12% (measure environment rule violations)  
- [ ] Task limit exceeded rate <30% (measure incomplete tasks at round limit)
- [ ] Loop detection triggers activated <15% of runs (Rouge-L ≥0.8 check)
- [ ] Multi-turn coherence maintained: Rouge-L between plan and actions ≥0.4 after round 10
- [ ] Model-task grounding alignment: Code-trained models only on procedural tasks
- [ ] Failure mode distribution logged: Track format/action/TLE breakdown for intervention targeting
- [ ] Human escalation triggers defined: Automatic handoff rules for detected failure patterns
- [ ] Progress validation: State advancement measurable every 5 rounds
- [ ] Environment-specific constraints validated: Action space limitations enforced pre-execution

## NOT-FOR BOUNDARIES

**Do NOT use this skill for**:
- **Single-turn question answering** → Use `question-answering-strategies.md` instead
- **Static text generation** → Use `content-generation-patterns.md` instead  
- **Pure reasoning without environmental interaction** → Use `logical-reasoning-frameworks.md` instead
- **Real-time reactive systems** → Use `streaming-response-handling.md` instead
- **Simple API calls without multi-step planning** → Use `api-integration-patterns.md` instead

**Delegate to other skills when**:
- Task requires domain-specific knowledge → Use `domain-expertise-routing.md`
- Evaluation needs custom metrics → Use `benchmark-design-principles.md`
- Agent architecture design needed → Use `agent-orchestration-patterns.md`
- Production deployment concerns → Use `llm-system-monitoring.md`

**This skill specifically handles**: Multi-round interactive decision-making where environmental constraints, plan revision, and failure recovery are primary concerns.