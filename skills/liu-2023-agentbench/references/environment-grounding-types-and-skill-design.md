# Environment Grounding Types: How Task Structure Shapes Agent Capability Requirements

## The Core Teaching

Not all agent tasks are created equal. AgentBench's eight environments cluster into three distinct grounding types—**Code, Game, and Web**—and agent performance varies dramatically across these types in ways that don't correlate with general intelligence. A model can excel at code-grounded database queries while failing at game-grounded strategic reasoning, even though both require multi-step planning.

This reveals a critical principle for agent system design: **Task structure determines capability requirements.** Systems that route all tasks to the "best" general-purpose model will fail. Effective orchestration requires matching task grounding types to model capabilities.

## The Three Grounding Types

### Code-Grounded Environments (OS, Database, Knowledge Graph)

**Characteristics**:
- Execution in formal, deterministic systems (bash, SQL, SPARQL-like APIs)
- Ground truth is verifiable by execution (query returns a result or an error)
- Action space is unbounded but syntactically constrained (any valid code is allowed)
- Success requires precise syntax and semantic correctness

**Cognitive demands**:
1. **Syntax knowledge**: Know the grammar of bash, SQL, etc.
2. **Semantic grounding**: Understand what operations mean in the domain (what does JOIN do?)
3. **Error interpretation**: When code fails, parse error messages to diagnose problems
4. **Multi-step composition**: Complex tasks require sequences of operations (filter, then aggregate, then sort)

**Performance patterns in AgentBench**:
- GPT-4 excels across all three (OS: 42.4%, DB: 32.0%, KG: 58.8%)
- Code-trained models (CodeLlama-34b) do well on OS (2.8%) and DB (14.0%) but weaker on KG (23.5%)
- General open-source models struggle uniformly (Llama2-70b: OS 9.7%, DB 13.0%, KG 8.0%)

**Key insight**: Code grounding rewards *procedural precision*. The model must generate exact syntax and compose operations correctly. There's little room for ambiguity—code either executes or fails. Models trained on code gain this precision but may sacrifice flexibility.

**Design implications for WinDAGs**:
- Skills that interact with code-grounded environments (CLI tools, databases, APIs) should prefer code-trained models when syntax precision is critical
- Implement error-recovery loops: When code fails, feed error messages back to the agent for debugging
- For complex tasks (multi-step queries), separate planning (what queries to run) from execution (generate actual syntax)

### Game-Grounded Environments (Digital Card Game, Lateral Thinking Puzzles, House Holding)

**Characteristics**:
- Execution in simulated worlds with state, rules, and goals
- Ground truth is defined by game rules (did you win? did you solve the puzzle?)
- Action space is discrete and constrained (legal moves only)
- Success requires strategic reasoning, not just correct syntax

**Cognitive demands**:
1. **Rule understanding**: Internalize complex game mechanics (fish abilities, puzzle logic, physics)
2. **Strategic planning**: Reason about opponent behavior, long-term consequences of actions
3. **State tracking**: Maintain mental model of current game state across many rounds
4. **Adaptability**: Adjust strategy based on opponent moves or new information

**Performance patterns in AgentBench**:
- GPT-4 excels at all three (DCG: 74.5%, LTP: 16.6%, HH: 78.0%)
- Claude-2 strong on DCG (55.5%) and HH (54.0%) but weaker on LTP (8.4%)
- Code-trained models *weaker* on strategic tasks (CodeLlama-34b DCG: 8.4%) despite being strong on code tasks
- Open-source models struggle, especially on LTP (Llama2-70b: 0.0%)

**Key insight**: Game grounding rewards *strategic flexibility*. Success requires adapting to dynamic situations, not following fixed procedures. Code training may actually *harm* performance here—it biases toward procedural execution when flexible adaptation is needed.

**The Code Training Trade-Off**:
AgentBench shows CodeLlama-34b outperforms Llama2-70b on Web Shopping (procedural, template-following task) but underperforms on Digital Card Game (strategic reasoning task). Code training optimizes for deterministic execution at the cost of strategic flexibility.

**Design implications for WinDAGs**:
- Skills requiring strategic reasoning (planning, competitive scenarios, puzzle-solving) should prefer generally-trained models over code-specialized ones
- Game-grounded skills need explicit state tracking mechanisms—don't rely on implicit attention to maintain game state
- For adversarial scenarios (card game), consider multi-agent simulations where models play against each other to generate training data

### Web-Grounded Environments (Web Shopping, Web Browsing)

**Characteristics**:
- Execution in semi-structured web interfaces (HTML, clickable elements, forms)
- Ground truth is task completion (bought the right item, reached the right page)
- Action space is hybrid: discrete (click options) + continuous (search text, form inputs)
- Success requires navigating information overload (thousands of products, complex page structures)

**Cognitive demands**:
1. **Information filtering**: Extract relevant info from verbose HTML or product descriptions
2. **Goal decomposition**: Break high-level goals ("buy cheap flight") into web actions (search, filter, click)
3. **Navigation strategy**: Decide between search (jump to target) vs. browse (explore systematically)
4. **Context tracking**: Remember search criteria across page transitions

**Performance patterns in AgentBench**:
- GPT-4 strong on WS (61.1%) but weaker on WB (29.0%)
- Claude-2 excellent on WS (61.4%) but fails completely on WB (0.0%!)
- Code-trained models excel on WS (CodeLlama-34b: 52.1%) but mixed on WB (20.0%)
- Open-source models mostly weak on both

**Key insight**: Web grounding has two sub-types:
- **Template-following (Web Shopping)**: Task has clear procedure (search → filter → select → buy). Code-trained models excel because it's essentially procedural execution.
- **Open-ended navigation (Web Browsing)**: Task requires flexible exploration of unfamiliar websites. Requires adaptability more than procedural execution.

**Design implications for WinDAGs**:
- Distinguish template-following web skills (booking flights, shopping) from open-ended web skills (research, exploration)
- For template-following, use code-trained models and explicit step-by-step templates
- For open-ended browsing, use generally-capable models with strong instruction following
- Implement element ranking/filtering (as Mind2Web does) to reduce action space—raw HTML is too large for most models

## Cross-Environment Performance Patterns

AgentBench allows analyzing which models have balanced vs. specialized capabilities:

**Balanced performers** (strong across grounding types):
- GPT-4: Top performer in 6/8 environments
- Claude-3-opus: Strong across code, game, web (with some weak spots)

**Specialized performers** (strong in specific grounding):
- CodeLlama-34b: Strong in code and template-following web, weak in strategic games
- Claude-2: Strong in procedural tasks (DB, web shopping), weak in open-ended (web browsing)

**Struggling across board**:
- Most open-source models <70B show poor performance across all grounding types
- Instruction-following deficits (high IF/IA rates) harm performance universally

## Routing Strategies for Agent Orchestration

Based on grounding type analysis, here's a routing decision tree:

```
Task arrives → Classify grounding type:

IF Code-grounded:
    IF task requires syntax precision:
        → Use code-trained model (CodeLlama, CodeGen)
    IF task requires reasoning over knowledge:
        → Use general capable model (GPT-4, Claude)
    
IF Game-grounded:
    IF task is strategic (adversarial, puzzle):
        → Avoid code-trained models
        → Use general capable model with strong reasoning
    IF task is procedural (follow rules):
        → Code-trained models acceptable
        
IF Web-grounded:
    IF task follows template (shopping, booking):
        → Use code-trained model with template
    IF task is open-ended (research, exploration):
        → Use general capable model
        → Implement element filtering to reduce action space
```

## The Instruction Following Bottleneck Applies Everywhere

While grounding types have different cognitive demands, one factor affects all environments: **instruction following capability**. AgentBench shows:

- Invalid Format (IF) errors: 6.0% commercial, 10.4% open-source
- Invalid Action (IA) errors: 4.6% commercial, 13.6% open-source

These rates are relatively consistent across grounding types—instruction following is a universal bottleneck. A model might be cognitively capable for a task but operationally unreliable due to poor instruction following.

**Design implication**: Instruction following is a first-order filter. Before considering grounding-specific routing, filter out models with high IF/IA rates for autonomous workflows. Reserve instruction-unreliable models for human-supervised or retriable tasks.

## Emergent Properties: What Doesn't Transfer Across Grounding Types

Traditional NLP benchmarks (MMLU, HumanEval, etc.) test isolated capabilities. AgentBench reveals capabilities that *don't transfer* across grounding types:

**Code skill doesn't transfer to strategy**: CodeLlama-34b's code performance doesn't help with Digital Card Game

**Strategic skill doesn't transfer to syntax**: GPT-4's card game dominance doesn't perfectly predict database success

**Template-following doesn't transfer to open exploration**: Claude-2's web shopping success doesn't transfer to web browsing

**Why this matters**: Traditional capability evaluations (can the model write code? can it reason?) don't predict agent task performance. Agent capability is *interaction-grounded*—you can only evaluate it by testing the model in the actual interaction loop.

**Design implication for benchmarking**: When evaluating a new model for your agent system, test it on diverse grounding types. Performance on one type weakly predicts performance on others.

## Task Decomposition Should Respect Grounding Boundaries

When decomposing complex tasks, partition along grounding type boundaries:

**Good decomposition** (respects grounding):
```
Complex task: "Research competitors and build database of findings"

Subtask 1 (Web-grounded): Research competitors on web, extract info
Subtask 2 (Code-grounded): Insert findings into SQL database
```
Each subtask can be routed to grounding-appropriate model.

**Poor decomposition** (mixes grounding):
```
Complex task: "Research competitors and build database"

Subtask 1: "Do everything"
```
Single model must handle both web navigation and SQL generation, requiring proficiency in multiple grounding types.

**Design principle**: Decompose tasks at grounding type boundaries. This allows specialized routing per subtask.

## Environment Construction Principles

AgentBench's environment design offers lessons for building evaluation environments:

1. **Deterministic evaluation where possible**: Code-grounded tasks have clear right/wrong answers. Game-grounded tasks have win/loss conditions. Web-grounded tasks have verifiable goal completion. This enables automatic evaluation at scale.

2. **Partial observability is realistic**: Knowledge Graph tasks simulate real scenarios where agents can't see the full state. This tests planning under uncertainty.

3. **Multi-round interaction is essential**: Single-turn evaluations miss instruction following, loop detection, and progress monitoring—all critical for real agents.

4. **Action space design matters**: House Holding's discrete action space is easier than Web Browsing's hybrid space (click + type). Constrain action spaces when possible.

5. **Evaluation should capture operational failures**: Don't just measure final accuracy. Capture IF, IA, TLE, CLE. These reveal different failure modes requiring different fixes.

## Summary: Match Task Structure to Model Capabilities

The core teaching: **Agent performance is grounding-dependent. Code, game, and web tasks require different cognitive profiles.** Systems that treat all tasks uniformly will underperform. Effective orchestration requires:

1. **Classify tasks by grounding type** (code/game/web)
2. **Route to grounding-appropriate models** (code-trained for syntax, general for strategy)
3. **Implement grounding-specific infrastructure** (error recovery for code, state tracking for games, element filtering for web)
4. **Decompose along grounding boundaries** to enable specialized routing
5. **Test models across grounding types** to map their capability profiles

The success of GPT-4 across grounding types indicates that general capability eventually overcomes specialization. But for resource-constrained systems, grounding-aware routing enables using smaller, specialized models effectively. A 13B code-trained model may match a 70B general model on code-grounded tasks while being 5× cheaper to run.

The lesson for WinDAGs: Don't build a monolithic agent. Build a routing system that matches tasks to appropriate specialists based on grounding type.