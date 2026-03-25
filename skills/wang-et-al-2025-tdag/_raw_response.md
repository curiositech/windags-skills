## BOOK IDENTITY

**Title**: TDAG: A Multi-Agent Framework based on Dynamic Task Decomposition and Agent Generation

**Author**: Yaoxiang Wang, Zhiyong Wu, Junfeng Yao, Jinsong Su

**Core Question**: How can intelligent agent systems decompose complex, multi-step tasks and coordinate specialized subagents to handle unpredictable real-world problems where static planning and error propagation cripple conventional approaches?

**Irreplaceable Contribution**: This paper provides the first systematic demonstration that **dynamic replanning combined with just-in-time agent generation** outperforms all static decomposition strategies in complex multi-step tasks. Unlike theoretical frameworks, it offers concrete architectural patterns tested in a benchmark (ItineraryBench) specifically designed to measure *partial progress* rather than binary success/failure—revealing that conventional evaluation metrics systematically hide what agents actually accomplish and obscure critical failure modes.

## KEY IDEAS

1. **Static Decomposition Creates Cascading Failures**: When a task is decomposed once at the beginning into fixed subtasks, early failures propagate through the entire sequence, causing complete task failure even when later subtasks could succeed independently. The paper demonstrates that "Cascading Task Failure" (CTF) accounts for 34.78% of errors in Plan-and-Execute methods versus only 4.35% in dynamic approaches—a nearly 8x reduction.

2. **Binary Evaluation Hides Agent Capabilities**: In tasks with <30% completion rates, binary scoring (success/fail) cannot distinguish between methods that accomplish nothing and methods that complete 60-70% of subtasks. Fine-grained evaluation reveals performance differences invisible to pass/fail metrics, exposing the "emergent abilities" phenomenon as potentially an artifact of crude measurement.

3. **Context Bloat vs. Context Precision**: Single-agent approaches force the LLM to process irrelevant information from all possible subtasks simultaneously, increasing hallucination rates (External Information Misalignment errors). Decomposition with specialized subagents reduces each agent's context to only relevant information, but *only if the decomposition adapts dynamically* to what previous subtasks actually accomplished.

4. **Agent Customization Through Tool Document Refinement**: Generic tool documentation contains redundancy and ambiguity that misleads agents into inappropriate actions. Generating subtask-specific, clarified tool documentation for each subagent—restructuring and enriching the original content—significantly improves execution accuracy without requiring manual agent engineering.

5. **Incremental Skill Libraries Require Continuous Validation**: Unlike deterministic environments (e.g., Minecraft/Voyager) where skill correctness is immediately verifiable through environment feedback, real-world tasks lack ground truth validation. Skills must be stored with contextual metadata and continuously refined based on variable outcomes rather than treated as proven solutions.

## REFERENCE DOCUMENTS

### FILE: dynamic-decomposition-vs-static-planning.md

```markdown
# Dynamic Decomposition vs. Static Planning: Why Early Commitment Kills Complex Problem Solving

## The Core Problem with Static Planning

When an intelligent system faces a complex, multi-step task, the intuitive approach is to break it down: decompose the problem into subtasks, assign each to a specialist, execute sequentially. This is the foundation of nearly every task planning system from hierarchical task networks to modern LLM-based agents.

Yet this paper demonstrates a critical failure mode: **static decomposition—deciding all subtasks upfront—creates brittle execution chains where early failures cascade catastrophically through the entire task sequence.**

The TDAG framework shows that in travel planning tasks involving 5-8 interconnected steps across multiple cities, the Plan-and-Execute (P&E) baseline exhibits Cascading Task Failure (CTF) rates of 34.78% compared to just 4.35% for dynamic decomposition—nearly an order of magnitude difference (Table 3). More striking: P&E often *underperforms* even single-agent ReAct approaches, which don't decompose at all, scoring 42.85 versus 43.02 average points.

## What Is Cascading Task Failure?

Consider this scenario from the paper's travel planning domain:

```
Subtask 1: Book train from Shanghai to Beijing, departing 14:40
Subtask 2: Arrive Beijing at 20:30, visit the Great Wall
Subtask 3: Visit Forbidden City
Subtask 4: Return to Shanghai by train
```

In static decomposition, these subtasks are fixed at planning time. If Subtask 1 fails—perhaps the 14:40 train is unavailable—the system has three bad options:

1. **Proceed anyway**: Subtask 2 assumes 20:30 arrival but the agent never boards a train. The plan becomes nonsensical.
2. **Abort entirely**: Throw away Subtasks 2-4 even though visiting the Great Wall tomorrow would work fine.
3. **Retry forever**: Keep attempting the 14:40 train, never considering the 18:25 alternative that would merely delay the Great Wall visit by a few hours.

The paper's error analysis reveals P&E systems predominantly choose option 2—complete abortion—resulting in 0% task completion even when 75% of the work could succeed with minor replanning.

## Dynamic Decomposition: Replanning as First-Class Operation

TDAG's solution is deceptively simple but architecturally profound. Task decomposition is *not* a one-time planning phase but an **ongoing process that updates based on execution results**:

```
t'_i = Update(t_i, r_1, r_2, ..., r_{i-1})
```

Where `t'_i` is the revised i-th subtask and `r_1...r_{i-1}` are the actual results of completed subtasks (Equation 6).

In the train booking example, when Subtask 1 fails, the system doesn't execute Subtask 2 blindly. Instead:

1. **Execution feedback**: "Train G2304 at 14:40 is fully booked"
2. **Dynamic update**: Main agent receives this result and regenerates Subtask 2: "Bob arrives in Beijing by train G2305 at 22:45 on July 8th. Adjust the Beijing itinerary to start the next morning."
3. **Cascade prevention**: Later subtasks remain executable; the Great Wall visit shifts to July 9th morning instead of July 8th evening.

The paper's Algorithm 1 shows this explicitly: after each subtask execution (line 6), the task list is updated (line 11), not just marked complete/incomplete.

## Why This Matters for Agent Orchestration Systems

### 1. Error Containment Boundaries

In static systems, errors have **task-wide scope**—any failure potentially invalidates the entire plan. Dynamic decomposition creates **subtask-scoped errors** with contained blast radius. The system asks: "Given what actually happened in steps 1-3, what should step 4 become?" not "Does step 4 match the original plan?"

For WinDAGs or similar orchestration systems, this suggests:
- **Don't**: Generate complete task graphs upfront with fixed edges
- **Do**: Generate next-subtask proposals after each subtask completes, consuming actual execution traces

### 2. The Replan Decision Is Itself a Coordination Problem

TDAG uses a "main agent" to perform decomposition updates (line 11, Algorithm 1). This is a coordinator role distinct from executors. The coordinator:
- Receives execution results from subagents
- Decides if replanning is needed
- Generates updated subtask specifications
- Routes them to appropriate (possibly new) subagents

This maps to orchestration patterns where:
- **Executors** are skills/agents that perform atomic actions
- **Coordinators** are meta-agents that observe execution traces and revise plans
- **Communication** flows bidirectionally: coordinators send tasks, executors return structured results (not just success/failure)

### 3. Context Management Through Decomposition

The paper notes that single-agent ReAct approaches suffer from "excessive irrelevant contexts" degrading LLM performance. But naive decomposition doesn't solve this—P&E performs worse than ReAct despite using subagents.

The difference: **dynamic decomposition allows context refinement at each step**. When generating Subtask i, the main agent has access to:
- Original task specification
- Actual results r_1 through r_{i-1}
- Environmental state changes caused by those results

This allows generating subtask descriptions that are *contextually precise*—"Bob is now in Beijing at 22:45 on July 8th" vs. the original plan's "Bob should arrive at 20:30." Subagents receive accurate context without needing the full task history.

For multi-agent orchestration:
- Subagents should receive **current state summaries**, not full execution logs
- Coordinators maintain the full history and synthesize it into fresh, accurate context per subtask
- Each subtask description should reflect *reality*, not *original intentions*

## When Static Planning Is Acceptable

The paper's generalization experiments (Section 5.5) show TDAG excels even in "monotonous" tasks like TextCraft (73.5% success vs. ADAPT's 52%). But TextCraft and WebShop don't exhibit the same CTF vulnerability. Why?

**Static planning works when:**

1. **Subtasks are loosely coupled**: Failure in subtask i doesn't invalidate subtask i+1's preconditions
2. **Environment is deterministic**: Executing action A reliably produces state B
3. **Failure recovery is local**: Retrying a subtask eventually succeeds without changing the overall plan

Travel planning violates all three:
- Booking train X at time T1 is a hard precondition for arriving at city Y at time T2
- Ticket availability is stochastic
- If train X is unavailable, no amount of retrying helps; you need a *different plan*

**For WinDAGs skill design**: Classify problems along these dimensions. Use static decomposition for deterministic, loosely-coupled tasks (e.g., "analyze these 10 files" where file order doesn't matter). Reserve dynamic decomposition for tightly-coupled, stochastic workflows (e.g., "debug this system" where each finding changes what to investigate next).

## Implementation Pattern: The Update Mechanism

The paper doesn't detail the Update function's internals, but Section 4.1 implies it's an LLM prompt that:

**Inputs:**
- Original subtask specification t_i
- Execution results r_1...r_{i-1} from previous subtasks
- (Implicitly) the original task T for goal context

**Outputs:**
- Revised subtask t'_i that:
  - Achieves the same *goal* as t_i (visit the Great Wall)
  - Adjusts *constraints* based on reality (start time is now 09:00 not 08:00)
  - Updates *preconditions* (agent is in Beijing Railway Hotel, not at train station)

For orchestration systems, implement this as a **replanning skill** that:

```python
def replan_subtask(
    original_subtask: Task,
    completed_subtasks: List[Task],
    execution_results: List[Result],
    original_goal: Task
) -> Task:
    """
    Given actual execution history, rewrite the next subtask
    to maintain goal feasibility under current conditions.
    """
    prompt = f"""
    Original plan: {original_subtask}
    What actually happened: {execution_results}
    
    Rewrite the next subtask to:
    1. Still work toward the goal: {original_goal}
    2. Account for actual current state
    3. Preserve intent while adjusting constraints
    
    If the original subtask is now impossible, propose an alternative
    that achieves the same purpose.
    """
    return llm.generate(prompt)
```

## The Measurement Problem

Perhaps the most important contribution isn't the TDAG architecture but **Figure 3's revelation**: binary scoring shows no statistically significant difference between methods (scores ~28-32%) while fine-grained evaluation reveals a 20% performance gap (ReAct: 43.02, TDAG: 49.08).

This has profound implications:

**Binary evaluation creates an optimization mirage.** Researchers compare Method A (30% success) vs. Method B (31% success), conclude they're equivalent, and miss that Method B completes 65% of subtasks while Method A completes 40%.

**For agent system development:**
- Instrument partial completion tracking from day one
- Don't wait until "the whole task works" to measure progress
- Report distributions: "what % of runs complete ≥80% of subtasks?" not just "what % complete 100%?"

The paper's three-level evaluation (Executability → Constraint Satisfaction → Efficiency) provides a template:
- **Level 1**: Are individual actions valid? (train exists, time is consistent)
- **Level 2**: Do actions satisfy requirements? (budget not exceeded, attractions visited)
- **Level 3**: Is the solution optimized? (minimize time/cost)

Systems score 60 points for Level 1, 20 for Level 2, 20 for Level 3, with higher levels only evaluated if lower levels pass (Section 3.3).

**This prevents a critical measurement artifact**: a system that generates beautiful, efficient itineraries with impossible train schedules scores 0 despite demonstrating planning capability. A system that generates valid but inefficient itineraries scores 60. Binary evaluation would score both 0 (failure), hiding a massive capability difference.

## Connection to DAG Orchestration

WinDAGs likely represents tasks as directed acyclic graphs where nodes are skills and edges are data dependencies. The TDAG paper suggests:

**Don't**: Build the entire DAG upfront
**Do**: Build a meta-DAG where:
- **Execute subtask i** → **Evaluate result** → **Replan subtasks i+1...n** → **Execute subtask i+1**

Each "Replan" node consumes execution history and generates new subtask specifications. The DAG grows and mutates during execution.

This is feasible because:
1. Each subtask completes before the next is fully specified (sequential execution within complexity levels)
2. The coordinator maintains global state while executors work locally
3. Subtask boundaries provide natural checkpoints for replanning decisions

## Boundary Conditions: When Dynamic Decomposition Adds Overhead

**Unnecessary replanning costs tokens and latency.** If subtask success rate is >95%, dynamic updates rarely trigger—you pay planning overhead for minimal benefit.

**Highly parallel tasks don't benefit.** If subtasks 2-10 can all run simultaneously independent of subtask 1, dynamic decomposition adds sequencing constraints that hurt performance.

**Small task spaces.** If there are only 3 possible plans and you can enumerate them upfront, replanning is overkill—just try plan A, then plan B, then plan C.

The paper's travel planning domain has:
- ~20% base success rate (Table 2, baseline methods)
- Sequential dependencies (can't visit city B before traveling there)
- Combinatorial plan space (83 attractions, 15 cities, 4749 routes)

This is the *ideal* use case for dynamic decomposition. Scale it back when these conditions don't hold.

## Summary: The Architectural Principle

**Static decomposition treats planning as a one-time compilation step that generates an execution plan.**

**Dynamic decomposition treats planning as continuous interpretation where each execution step provides feedback that reshapes subsequent plans.**

For complex, uncertain, tightly-coupled tasks, compilation fails and interpretation succeeds. The cost is coordination overhead; the benefit is robustness to reality's refusal to match predictions.
```

### FILE: just-in-time-agent-generation.md

```markdown
# Just-In-Time Agent Generation: Why Pre-Defined Agents Can't Scale to Open-Ended Problems

## The Problem with Fixed Agent Populations

Most multi-agent systems start with a roster: AnalysisAgent, ExecutionAgent, ValidationAgent, etc. Each agent has predefined capabilities, prompts, and tool access. When a task arrives, it's routed to the appropriate agent(s).

The TDAG paper demonstrates this approach fails at scale. In their ablation study (Table 2), removing agent generation (using predefined subagents instead) drops performance from 49.08 to 46.69 average score—a 2.39 point loss, or ~5% degradation.

But the deeper insight is *why* it fails. The paper states: "Prevailing efforts often involve the manual construction of hard-coded subagents. This static design tends to lack generality and is unable to scale effectively to handle diverse real-world tasks, given its labor and time-intensive nature" (Introduction).

The issue isn't just engineering effort. It's **fundamental task diversity**: in open-ended domains, you cannot enumerate all necessary agent types in advance.

## What "Agent Generation" Actually Means

TDAG generates agents dynamically using two mechanisms:

### 1. Tool Document Generation (Section 4.2.1)

Standard practice gives all agents the same generic tool documentation. TDAG generates **subtask-specific tool documentation** that:

- **Restructures**: Reorders tool descriptions by relevance to current subtask
- **Clarifies**: Expands ambiguous descriptions that might mislead the agent
- **Enriches**: Adds context about when/why to use each tool for this particular subtask

Example (inferred from paper's description):

**Generic Tool Doc:**
```
query_database(table, conditions): Query the database
  - table: table name (str)
  - conditions: filter conditions (dict)
Returns query results (list)
```

**Subtask-Specific Tool Doc for "Find trains from Shanghai to Beijing on July 1st":**
```
query_database(table, conditions): Find available transportation

For your subtask (train search), use this tool as follows:
  - table: "inter_city_transportation"  (NOT "intra_city_transportation")
  - conditions: {"origin": "Shanghai", "destination": "Beijing", 
                 "date": "2023-07-01", "type": "train"}
  
This returns: [{ticket_id, departure_time, arrival_time, price, seats_available}, ...]

Common errors to avoid:
  - Don't query "intra_city_transportation" for city-to-city travel
  - Date format must be YYYY-MM-DD
  - Filter by "type": "train" to exclude buses/flights if train is required
```

The paper notes: "In standard tool documents, there are often issues of redundancy, unclear descriptions, which may mislead the agent into making inappropriate attempts."

**For WinDAGs**: This suggests skills should receive **execution-context-aware tool documentation** generated per invocation, not generic API docs. A code review skill invoked for security checks sees different tool descriptions (emphasis on security scanners) than the same skill invoked for performance optimization (emphasis on profilers).

### 2. Incremental Skill Library (Section 4.2.2)

After completing a subtask, subagents:
1. **Summarize their solution process** using LLM prompting
2. **Extract a skill**: structured as {Name, Detail, Solution}
3. **Store with semantic embedding** using SentenceBERT

When a new subtask arrives:
1. **Retrieve relevant skills** using embedding similarity (Appendix B.1: θ=0.7 threshold, top-k=2)
2. **Provide skills to the new subagent** as reference solutions

Critically: "Unlike the environment of voyager, where the correctness of skills are directly verifiable through environmental feedback, our benchmark environment cannot guarantee the correctness of a skill. Therefore, the skills our agents develop are subject to continuous refinement" (Section 4.2.2).

This is **just-in-time agent specialization**: each subagent is initialized with:
- Base LLM capabilities
- Subtask-specific tool documentation
- Retrieved skills from similar past subtasks

The agent isn't "created from scratch" but **configured at generation time** with context that makes it a specialist for this particular subtask.

## Why This Outperforms Fixed Agents

### Problem 1: Task Space Explosivity

Travel planning involves:
- 15 cities, 83 attractions
- 846 intra-city routes, 3903 inter-city routes
- Constraints: budget, time, opening hours, activity windows

Number of possible subtask types: ~O(cities × attractions × constraint_combinations). If you need a pre-defined agent for each, you need hundreds of agent types.

TDAG generates specialized agents on-demand: "plan visits in Beijing starting from Railway Hotel with 6-hour window" gets different tool docs and skills than "plan visits in Shanghai starting from Pudong with 3-hour window."

### Problem 2: Relevance Precision

Fixed agents must handle *all possible subtasks of their type*. A generic "ticket booking agent" must work for:
- Booking trains vs. flights vs. buses
- Morning vs. evening departures
- Budget-constrained vs. time-constrained vs. unconstrained

Its prompts and tool documentation must be generic enough to cover everything, which makes them verbose and dilutes signal with noise.

Generated agents are **hyperspecialized**: "book a train from Shanghai to Beijing departing afternoon of July 1st, budget <300 RMB." Tool docs highlight only train booking APIs, skills retrieved are from similar train booking subtasks, prompts emphasize afternoon departure filtering.

The paper's error analysis (Table 3) shows TDAG has lower External Information Misalignment (EIM) errors (19.33%) than methods like ADAPT (21.74%) despite ADAPT also using multi-agent approaches. The difference: ADAPT uses fixed agents, TDAG generates specialized agents, reducing context bloat that causes hallucination.

### Problem 3: Evolution Without Redeployment

In fixed-agent systems, improving an agent requires:
1. Identifying failure patterns
2. Modifying agent code/prompts
3. Testing across all subtask types it handles
4. Redeploying

In TDAG, improvement happens **automatically through skill accumulation**:
1. Subagent completes a subtask novel
2. Solution is summarized and stored as a skill
3. Future similar subtasks retrieve this skill
4. Skill is refined if future executions reveal flaws

The system **learns from experience without code changes**. Each solved subtask potentially improves future performance on similar subtasks.

Appendix B.1 details the implementation:
- Skills are stored if ≥k=2 similar skills already exist (prevents library pollution with one-offs)
- Similarity threshold θ=0.7 using SentenceBERT embeddings
- A dedicated "skill modification" agent updates existing skills based on new execution data

This is **evolutionary agent development**: the agent population's capabilities grow over time without human intervention.

## Implementation Pattern for WinDAGs

The paper suggests a three-stage agent generation process:

### Stage 1: Base Agent Selection
```python
def select_base_agent(subtask: Task) -> AgentTemplate:
    """
    Choose foundational agent type based on subtask category.
    This is the only pre-defined component.
    """
    if subtask.involves_code():
        return CodeExecutorAgent
    elif subtask.involves_data_query():
        return DatabaseQueryAgent
    elif subtask.involves_optimization():
        return PlannerAgent
    # etc.
```

**Key insight**: Base agents are *templates*, not complete agents. They provide core capabilities (code execution, database access) but not task-specific configuration.

### Stage 2: Tool Documentation Generation
```python
def generate_tool_docs(
    base_agent: AgentTemplate,
    subtask: Task,
    available_tools: List[Tool]
) -> str:
    """
    Create subtask-specific tool documentation.
    """
    relevant_tools = filter_tools_by_relevance(available_tools, subtask)
    
    prompt = f"""
    Rewrite this tool documentation for an agent working on: {subtask}
    
    Original docs: {relevant_tools.docs}
    
    Provide:
    1. Reordered by relevance to this subtask
    2. Expanded descriptions of ambiguous parameters
    3. Usage examples specific to this subtask's context
    4. Common errors to avoid for this subtask type
    """
    
    return llm.generate(prompt)
```

**Critical detail**: The paper emphasizes this reduces "redundancy, unclear descriptions, which may mislead the agent into making inappropriate attempts" (Section 4.2.1). Generic docs say *what* a tool does; generated docs say *how to use it for this specific subtask*.

### Stage 3: Skill Retrieval and Injection
```python
def retrieve_skills(subtask: Task, skill_library: SkillLibrary) -> List[Skill]:
    """
    Find relevant past solutions to guide current subtask.
    """
    subtask_embedding = sentence_bert.encode(subtask.description)
    
    similar_skills = skill_library.query(
        embedding=subtask_embedding,
        threshold=0.7,  # per Appendix B.1
        top_k=2
    )
    
    return similar_skills

def generate_agent(
    subtask: Task,
    base_agent: AgentTemplate,
    tool_docs: str,
    skills: List[Skill]
) -> Agent:
    """
    Assemble the final specialized agent.
    """
    return Agent(
        core_capabilities=base_agent.capabilities,
        tools=tool_docs,
        reference_skills=skills,
        system_prompt=f"""
        You are a specialist for: {subtask}
        
        Tools available: {tool_docs}
        
        Similar problems have been solved as:
        {format_skills(skills)}
        
        Apply these lessons but adapt to current context.
        """
    )
```

**The generated agent** is thus:
- **Structurally**: A base template (code executor, database client, etc.)
- **Behaviorally**: Configured by generated tool docs and retrieved skills
- **Contextually**: Specialized for one subtask, not reused across different subtask types

## When Just-In-Time Generation Is Overkill

The paper's WebShop experiment (Section 5.5) notes: "Due to the lack of tool document and the monotonous nature of the tasks, we did not engage in agent generation. Instead, we utilized the predefined agents from ADAPT."

This reveals boundary conditions:

**Agent generation is unnecessary when:**

1. **Tool set is minimal**: If there are only 2-3 tools, generic documentation suffices
2. **Tasks are homogeneous**: If all subtasks are the same type (e.g., "click this button"), specialization provides no benefit
3. **No skill accumulation**: If similar subtasks never repeat, skill libraries can't build meaningful history

In WebShop, tasks are "click elements on a webpage"—highly uniform. In TextCraft, tasks are "craft item X"—more varied but still within a single domain (Minecraft crafting). Yet TDAG still outperforms (WebShop: 64.5 vs. 60.0; TextCraft: 73.5 vs. 52.0), suggesting **agent generation helps even in relatively simple domains** by providing focused context.

**For WinDAGs**: Use fixed agents for:
- High-frequency, invariant operations (e.g., "parse JSON")
- Ultra-low-latency requirements where generation overhead matters
- Security-critical operations where generated prompts might introduce vulnerabilities

Use generated agents for:
- Novel task types not seen before
- Complex operations with many tool/parameter choices
- Domains where task requirements evolve over time

## The Skill Library as Institutional Memory

The most interesting implication: **skill libraries are how agent systems accumulate expertise**.

Traditional systems improve through:
- Human engineers analyzing failures
- Updating code/prompts
- Redeploying updated agents

TDAG systems improve through:
- Agents solving subtasks
- Successful solutions stored as skills
- Future agents retrieving and adapting those solutions

This is **organizational learning**. The paper notes: "A agent dedicated to skill modification oversees the library, updating existing skills based on new data and experiences. This continuous cycle of generation, application, and refinement ensures that the skills in our library remain effective and adaptable" (Section 4.2.2).

**Implementation detail** (Appendix B.1):
- Skills are deduplicated: if ≥k=2 similar skills exist (similarity >θ=0.7), new skill is rejected
- This prevents library pollution while allowing refinement: if a skill proves flawed, next execution generates a corrected version that *replaces* it (by being more similar to the problem than the flawed skill)

**For WinDAGs**: The skill library becomes a critical component:
- **Persistence**: Store across sessions, like a database
- **Versioning**: Track skill evolution over time
- **Analytics**: Monitor which skills are retrieved most often, which lead to success/failure
- **Pruning**: Remove skills that consistently lead to failure or are never retrieved

The skill library is essentially **learned prompts**: instead of hand-crafting prompts for every scenario, the system learns successful solution patterns from its own execution history.

## The Meta-Question: Who Generates the Generator?

TDAG uses LLM prompting to generate tool docs and extract skills. But who writes *those* prompts?

The paper doesn't detail the generator prompts, but implies they're relatively stable templates that take subtask descriptions and produce customized content. This is **one level of meta-programming**: 

- **Level 0**: Agents execute subtasks
- **Level 1**: Generator creates agents for subtasks
- **Level 2**: Engineers design generators

The system is autonomous at Level 0-1 but not Level 2. This is the right trade-off: Level 2 changes rarely (how to customize documentation is stable) while Level 0-1 changes constantly (which specific subtasks need solving).

**For WinDAGs**: Invest engineering effort in *generator quality* (Level 2), not agent variety (Level 1). Build excellent tool doc generators and skill extractors, let them produce the agent zoo.

## Measuring Agent Generation Impact

Table 2's ablation shows agent generation contributes 2.39 points (46.69→49.08), about 5% improvement. This seems modest. But consider:

- **No manual effort**: The 5% comes without writing any subtask-specific agent code
- **Compounds over scale**: With 100s of subtask types, 5% per subtask is substantial
- **Covers the long tail**: Fixed agents handle common subtasks well; generation helps rare subtasks that wouldn't justify custom agent development

The paper's Type 3 tasks (combined intra/inter-city planning) show the largest gap: 43.94→46.51 when adding agent generation (Table 2). Type 3 is the most complex, with the most subtask diversity—exactly where you'd expect generated agents to shine.

**Evaluation strategy**: Track performance *separately by subtask type frequency*. Generated agents should show:
- Small gains on frequent subtasks (fixed agents are already optimized)
- Large gains on rare subtasks (fixed agents are generic)
- Enable solving never-before-seen subtasks (fixed agents don't exist)

## Summary: The Architectural Shift

**Traditional multi-agent systems**: Agent types are design-time decisions. You architect the agent population, implement each agent, deploy the system.

**TDAG-style systems**: Agent types are runtime decisions. You architect the *agent generation process*, implement generators, deploy a system that creates its own agent population dynamically.

This shifts complexity from:
- **Instance engineering** (writing 50 agents) to **class engineering** (writing agent generators)
- **Static optimization** (tuning each agent's prompts) to **dynamic optimization** (tuning how prompts get generated per subtask)
- **Coverage through enumeration** (handle subtask X, Y, Z) to **coverage through synthesis** (handle any subtask by generating appropriate agent)

The cost: Added complexity in the generation layer, need for skill storage/retrieval infrastructure.

The benefit: Systems that scale to open-ended task diversity without linear growth in engineering effort.
```

### FILE: fine-grained-evaluation-reveals-hidden-progress.md

```markdown
# Fine-Grained Evaluation Reveals Hidden Progress: Why Binary Metrics Hide Agent Capabilities

## The Binary Evaluation Trap

Figure 3 in the TDAG paper contains a startling revelation: when evaluated with binary scoring (success/failure), all tested methods score between 27-32% with no clear winner. But when evaluated with fine-grained metrics, the performance spread is 43-49%—a 20% gap between worst and best methods.

**The binary evaluation hides 20 percentage points of real performance difference.**

This isn't measurement noise. It's a fundamental problem: **in complex multi-step tasks with low completion rates, binary metrics conflate "accomplished nothing" with "accomplished most subtasks but failed the last one."**

The paper states: "The evaluation metrics in current benchmarks often lack the granularity needed to accurately reflect the incremental progress of agents. In complex multi-step tasks, even if an agent fails to achieve the ultimate targets, it might successfully accomplish some of the subtasks. It is essential to include these partial successes in evaluation metrics to faithfully capture the capabilities of agents. Reporting only a binary score (success or failure) can lead to misconceptions such as emergent abilities" (Introduction).

This last point is crucial: the "emergent abilities" phenomenon (Wei et al., 2022) may be partly an artifact of crude measurement that jumps from 0% to 100% success as model scale increases, when in reality capabilities grow gradually but sub-100% completion scores as "failure."

## ItineraryBench's Three-Level Evaluation

The paper introduces a hierarchical evaluation system (Section 3.3):

### Level 1: Executability (60 points)
**Question**: Are the individual actions physically possible?

Example checks:
- `go_to_city(Shanghai, Beijing, 07-01 14:40, 07-01 20:30, G2305)`: Does train G2305 actually run from Shanghai to Beijing with those times?
- `visit(Great_Wall, 07-02 08:00, 07-02 12:00)`: Is the Great Wall open 08:00-12:00?
- Sequential consistency: Does person arrive in Beijing before trying to visit Beijing attractions?

**Scoring formula**:
```
s1 = w1 × (A1 / B1)
```
Where A1 = completed checks, B1 = total checks, w1 = 60 points.

This is **partial credit for valid actions**: if an itinerary correctly books 4/5 trains and visits 6/8 attractions, it scores ~(10/13) × 60 ≈ 46 points, not 0.

### Level 2: Constraint Satisfaction (20 points)
**Question**: Does the plan satisfy specified requirements?

Example constraints:
- Budget limit: <5000 RMB
- Stay duration: 2 nights in Beijing
- Visit requirements: must see Great Wall, Forbidden City, Summer Palace
- Activity windows: only 07:00-22:00

**Scoring formula**:
```
s2 = w2 × (A2 / B2)
```
Where A2 = satisfied constraints, B2 = total constraints, w2 = 20 points.

**Critical rule**: "Level 2 evaluation only proceeds after the complete attainment of scores in the lower levels" (Section 3.3). If an itinerary scores <60 in Level 1 (has infeasible actions), Level 2 isn't evaluated—constraint satisfaction is meaningless if the plan is impossible.

### Level 3: Time and Cost Efficiency (20 points)
**Question**: How optimized is the solution?

The paper uses a reference range [a, b] where:
- a = mean - std_dev of valid sample itineraries
- b = mean + std_dev

**Scoring formula**:
```
s3 = w3                           if cost ≤ a
s3 = w3 × (1 - (cost-a)/(b-a))   if a < cost < b
s3 = 0                            if cost ≥ b
```

This rewards efficiency but with diminishing returns: beating the mean by 1 std_dev gives full 20 points, being at the mean gives ~10 points, exceeding mean by 1 std_dev gives 0 points.

**Critical rule**: Level 3 only evaluates if Level 1 = 60 points (full executability) AND Level 2 requirements met. "This approach reinforces the importance of a strong base in practical execution, as advanced optimizations are irrelevant if basic executability is not achieved" (Section 3.3).

## Why This Matters: The Emergent Abilities Illusion

Wei et al. (2022) documented "emergent abilities" where capabilities appear suddenly at certain model scales—graphs show flat zero performance, then a sharp jump to non-zero performance.

The TDAG authors suggest this may be **measurement artifact**: "Reporting only a binary score (success or failure) can lead to misconceptions such as emergent abilities."

Consider this scenario:

**Task**: Book trains for 5-city tour, visit 12 attractions, return home in 10 days.

**Small model behavior**:
- Books 3/5 trains correctly (others have schedule errors)
- Visits 7/12 attractions (others closed when visited)
- Returns 2 days late
- **Binary score: 0% (failure)**
- **Fine-grained score: ~35% (partial completion)**

**Large model behavior**:
- Books 5/5 trains correctly
- Visits 11/12 attractions (one closed due to unexpected holiday)
- Returns on time
- **Binary score: 0% (failure—missed one attraction)**
- **Fine-grained score: ~85% (near-complete)**

**Even larger model behavior**:
- Books 5/5 trains
- Visits 12/12 attractions
- Returns on time
- **Binary score: 100% (success)**
- **Fine-grained score: 100%**

With binary evaluation, you see: 0%, 0%, 100%—an "emergent" jump. With fine-grained evaluation, you see: 35%, 85%, 100%—smooth capability growth.

Figure 3 demonstrates this empirically: binary scoring shows all methods between 27-32% (no significant difference), while fine-grained scoring reveals ReAct=43%, P&S=44%, ADAPT=45%, TDAG=49%—clear stratification invisible to binary metrics.

## Implementation for WinDAGs: Hierarchical Scoring

The three-level structure generalizes to any complex task:

### Level 1: Syntactic/Mechanical Correctness
**What it measures**: Can actions execute without errors?

For code generation:
- Does code parse?
- Do imported libraries exist?
- Are function calls syntactically correct?

For data processing:
- Do input files exist?
- Are data formats valid?
- Do queries run without errors?

**Scoring**: Percentage of actions that execute without runtime errors.

### Level 2: Semantic Correctness
**What it measures**: Do actions achieve their intended local goals?

For code generation:
- Does each function do what its docstring claims?
- Are test cases passing?
- Do components integrate correctly?

For data processing:
- Is the output schema correct?
- Are required fields present?
- Do values satisfy domain constraints?

**Scoring**: Percentage of sub-goals achieved, only evaluated if Level 1 = 100%.

### Level 3: Global Optimality
**What it measures**: How good is the overall solution?

For code generation:
- Performance benchmarks
- Code quality metrics
- Security/maintainability scores

For data processing:
- Processing time
- Resource utilization
- Output quality metrics

**Scoring**: Continuous score relative to reference distribution, only evaluated if Level 1 = 100% and Level 2 requirements met.

## The Reference Distribution Problem

Level 3 scoring requires a reference distribution—what's "good" vs. "acceptable" vs. "poor" efficiency?

The paper's approach (Section 3.3):
1. Generate many candidate solutions (100s)
2. Execute in simulator, filter to valid ones (Level 1 = 100%)
3. Randomly sample 50 valid solutions
4. Compute mean μ and std σ of cost/time
5. Set a = μ - σ, b = μ + σ

This ensures [a, b] reflects "realistic achievable performance" not "theoretical optimum."

**Why not use theoretical optimum?** Example: Traveling Salesman Problem has a globally optimal route. But:
- Finding it may be NP-hard
- Agents have limited computation time
- "Good enough" solutions (within 10% of optimal) are valuable

Scoring against mean ± std_dev measures **how much better than typical** a solution is, which is often more practical than **how close to perfect** it is.

**For WinDAGs**: When adding new task types:
1. Generate initial solutions using baseline methods
2. Execute and measure cost/time/quality metrics
3. Compute statistics from successful runs
4. Use these as reference distributions for Level 3 scoring

**Bootstrap problem**: First runs have no reference. Solution: Use first N successful runs to establish baseline, then evaluate subsequent runs against it. Refine reference distribution periodically.

## Partial Credit Anti-Patterns

Fine-grained evaluation can be misapplied:

### Anti-Pattern 1: Credit for Irrelevant Work
**Example**: Task requires file processing + analysis + reporting. Agent processes file correctly, fails analysis, produces empty report. Scores 33% (1/3 stages).

**Problem**: Processing without analysis is useless—no value delivered.

**Solution**: Use dependencies in scoring. ItineraryBench does this via sequential evaluation: Level 2 only counts if Level 1 = 100%. Extend this: sub-tasks only count if their dependencies succeeded.

### Anti-Pattern 2: Hiding Critical Failures
**Example**: Task requires 10 data transformations. Agent completes 9, fails the last (data export). Scores 90%.

**Problem**: If export is critical and others are preparatory, 90% hides complete failure to deliver.

**Solution**: Weight subtasks by importance. ItineraryBench does this via points allocation: Level 1 (executability) = 60 points, Level 2 (constraints) = 20 points, Level 3 (efficiency) = 20 points. Executability is 3× more important than efficiency.

### Anti-Pattern 3: Rewarding Redundancy
**Example**: Task requires 3 analyses. Agent performs 6 (including the 3 required + 3 unnecessary). Scores 200% (6/3).

**Problem**: Unnecessary work wastes resources.

**Solution**: Cap scores at 100% per category. ItineraryBench's formula `s1 = w1 × (A1/B1)` caps at w1 when A1=B1, doesn't give extra credit for A1>B1.

## Instrumentation Requirements

Fine-grained evaluation requires **observable intermediate states**. The paper uses a simulator (Section 3.3) that validates each action as it executes.

**For WinDAGs**, this means:

### 1. Structured Task Decomposition
Tasks must decompose into checkpointable subtasks. Instead of:
```python
# Black-box function
result = agent.solve_task(task)
```

Use:
```python
# Observable subtasks
subtasks = decompose(task)
results = []
for st in subtasks:
    r = agent.solve_subtask(st)
    results.append(r)
    evaluate_partial_progress(results)  # Incremental scoring
```

### 2. Validation Functions Per Subtask
Each subtask needs a validator that checks correctness without requiring full task completion:

```python
def validate_subtask(subtask: Task, result: Result) -> Score:
    """
    Check if this subtask result is correct in isolation.
    """
    if subtask.type == "train_booking":
        return validate_train_booking(result)
    elif subtask.type == "attraction_visit":
        return validate_attraction_visit(result)
    # etc.
```

ItineraryBench's simulator does this by checking each action against the database: does this train exist? Are these times consistent?

### 3. Dependency Tracking
Know which subtasks depend on which:
```python
class Task:
    subtasks: List[Subtask]
    dependencies: Dict[Subtask, List[Subtask]]  # subtask → prerequisites
```

When subtask S fails, mark all dependent subtasks as unscoreable (don't count as 0, count as N/A).

### 4. Continuous Scoring During Execution
Don't wait until task completion to compute score:

```python
def execute_task(task: Task) -> Tuple[Result, Score]:
    score = Score(level1=0, level2=0, level3=0)
    
    for subtask in task.subtasks:
        result = execute_subtask(subtask)
        
        # Update Level 1 score incrementally
        if is_valid(result):
            score.level1 += weight_of(subtask)
        
        # Update Level 2 if Level 1 is perfect
        if score.level1 == max_level1:
            if satisfies_constraints(result):
                score.level2 += constraint_weight(subtask)
        
        # Update Level 3 if Levels 1&2 are perfect
        if score.level1 == max_level1 and score.level2 == max_level2:
            score.level3 = compute_efficiency(results)
    
    return results, score
```

This provides **real-time progress visibility** rather than waiting until the end.

## Reporting Guidelines

The paper's insight: in low-completion-rate scenarios, binary metrics are uninformative (Figure 3). But even fine-grained metrics can be reported poorly.

**Good reporting includes:**

### 1. Distribution of Completion Levels
Don't just report mean score. Report:
- What % of runs achieve Level 1 = 100%?
- What % achieve Level 2 requirements?
- What % reach Level 3 evaluation?

Example:
```
Method: TDAG
Level 1 (executability): 73% of runs achieve 100%, mean=89%
Level 2 (constraints):   51% of runs evaluated (Level 1=100%), 68% satisfy all
Level 3 (efficiency):    34% of runs evaluated (Levels 1&2=100%), mean efficiency score=14.2/20
```

This reveals the "funnel": 73% get executable plans, but only 51% also satisfy constraints, and only 34% are eligible for efficiency scoring.

### 2. Subtask-Level Breakdowns
Which subtasks are bottlenecks?

```
Train booking: 92% success rate
Hotel booking: 88% success rate
Attraction visits: 67% success rate ← bottleneck
Route planning: 78% success rate
```

Identifies where to focus improvement efforts.

### 3. Failure Mode Analysis
Table 3 in the paper breaks down error types:
- Cascading Task Failure (CTF): 4.35% for TDAG vs 34.78% for P&E
- Commonsense Knowledge Errors (CKE): 18.87% vs 20.94%
- External Information Misalignment (EIM): 19.33% vs 22.14%
- Constraint Non-compliance (CNC): 18.63% vs 21.05%

This granularity reveals *why* methods fail differently: P&E suffers CTF due to static planning; ReAct suffers EIM due to context overload.

### 4. Comparison to Random/Heuristic Baselines
Fine-grained metrics should show:
- Random agent: ~20% Level 1 score (some actions accidentally valid)
- Heuristic agent: ~60% Level 1 score (simple rules work partially)
- LLM agent: 85%+ Level 1 score

If your LLM agent scores near heuristic baseline, fine-grained metrics reveal it's not leveraging LLM capabilities effectively, even if binary metric says "both fail."

## The Psychological Benefit: Maintaining Morale

Anecdotally, the paper's approach has a human benefit: **developers can see progress even when tasks don't fully complete**.

Working on complex agents is demoralizing when every run scores "0% - failed." Fine-grained metrics show:
- Week 1: 25% average (actions are valid but constraints violated)
- Week 2: 45% average (most constraints satisfied, efficiency poor)
- Week 3: 62% average (some runs complete fully, others nearly so)

This visible progress sustains development effort. Binary metrics would show "0%, 0%, 30%" across these same weeks—looks like nothing happened for two weeks, then sudden breakthrough.

**For WinDAGs development**: Use fine-grained metrics internally even if external reporting uses binary metrics. It helps teams understand where they are in capability development.

## Summary: Evaluation as Debugging Tool

The deepest insight: **fine-grained evaluation isn't just about fairness in comparison—it's a debugging tool**.

Binary metrics tell you "it doesn't work." Fine-grained metrics tell you:
- **Where** it doesn't work (which subtasks fail)
- **How badly** it doesn't work (10% complete vs 90% complete)
- **Why** it doesn't work (executability issues vs constraint violations vs inefficiency)

The paper's three levels provide a **diagnostic framework**:
- Level 1 failures → agent doesn't understand action mechanics
- Level 2 failures → agent understands actions but not requirements
- Level 3 suboptimal → agent understands both but doesn't optimize

This guides fixes:
- Level 1 issues → improve tool documentation, provide examples
- Level 2 issues → improve task specification, add constraint checking
- Level 3 issues → add optimization skills to skill library

Treat evaluation not as a final grade but as an ongoing diagnostic that reveals what capabilities are present and which are missing.
```

### FILE: error-propagation-and-failure-containment.md

```markdown
# Error Propagation and Failure Containment: Architectural Patterns for Robust Agent Systems

## The Cascading Failure Problem

The TDAG paper's error analysis (Table 3) reveals a striking pattern: Plan-and-Execute (P&E) systems suffer Cascading Task Failure (CTF) at an 8× higher rate than dynamic decomposition systems—34.78% vs 4.35% of all errors.

What is CTF? The paper defines it as "The entire task fails due to the failure of intermediate subtasks, often as a result of error propagation" (Section 5.3).

**Example scenario** (reconstructed from paper's domain):

```
Task: Visit 8 attractions across 3 cities in 7 days

Subtask 1: Book Shanghai→Beijing train, July 1 at 14:40
Subtask 2: Visit Great Wall, July 2
Subtask 3: Visit Forbidden City, July 3
Subtask 4: Book Beijing→Xi'an train, July 4
Subtask 5: Visit Terracotta Army, July 5
Subtask 6: Visit City Wall, July 6
Subtask 7: Book Xi'an→Shanghai flight, July 7
Subtask 8: Return to origin, July 7
```

**Static plan behavior** (P&E):
1. Subtask 1 fails: train G2304 at 14:40 is sold out
2. System executes Subtask 2 anyway: "Visit Great Wall July 2"
3. But agent never arrived in Beijing—agent is still in Shanghai
4. Subtask 2 fails due to geographic impossibility
5. Subtasks 3-8 all fail for same reason
6. **Final score: 0/8 subtasks completed**

**Dynamic plan behavior** (TDAG):
1. Subtask 1 fails: train G2304 at 14:40 is sold out
2. System regenerates Subtask 1': "Book Shanghai→Beijing train, July 1, any time"
3. System successfully books 18:25 train (arrives 00:20 July 2)
4. System regenerates Subtask 2': "Visit Great Wall, July 2 afternoon" (not morning—agent arrives late)
5. Subtasks 2'-8 proceed with updated timing
6. **Final score: 7/8 subtasks completed** (only original Subtask 1 failed)

The difference: static plans treat subtask failures as terminal; dynamic plans treat them as opportunities to replan.

## Why Static Decomposition Propagates Errors

Three architectural properties of static decomposition create CTF vulnerability:

### Property 1: Immutable Subtask Dependencies

In static decomposition, subtasks have **preconditions** that reference *intended* states, not *actual* states:

```python
class Subtask:
    preconditions: List[State]  # What SHOULD be true
    actions: List[Action]
    postconditions: List[State]  # What WILL be true if actions succeed
```

Example:
```python
subtask_2 = Subtask(
    preconditions=["agent_location == 'Beijing'",
                   "current_time == '2023-07-02 08:00'"],
    actions=[visit("Great Wall")],
    postconditions=["visited('Great Wall')"]
)
```

When Subtask 1 fails to move agent to Beijing, `preconditions` are false but **Subtask 2 executes anyway** because preconditions are *assertions about the plan*, not *runtime checks*.

**Why execute with false preconditions?** Because in many static systems, there's no precondition validation—subtasks are generated once and assumed to be sequentially valid.

### Property 2: Non-Revisable Decomposition

The paper contrasts static vs. dynamic decomposition:

**Static**: `(t1, t2, ..., tn) = Decompose(T)` — called once at start
**Dynamic**: `t'_i = Update(t_i, r_1, ..., r_{i-1})` — called after each subtask completion

In static systems, the decomposition function is **not invoked during execution**. Once subtasks are generated, the system has no mechanism to change them based on actual outcomes.

This is an **architectural constraint**, not an algorithmic choice. Static systems typically:
1. Have a planning phase (generate subtasks)
2. Have an execution phase (perform subtasks)
3. No feedback loop from execution → planning

Dynamic systems have a different architecture:
1. Planning and execution are **interleaved**
2. Each execution result is an input to next planning step
3. Continuous loop: plan → execute → observe → replan

### Property 3: Failure Semantics Are Binary

When a subtask fails in a static system, the system has limited options:

**Option A: Continue** — execute next subtask, ignoring failure. Leads to CTF when next subtask depends on the failed one.

**Option B: Abort** — stop entire task. This is what P&E often does, explaining why it performs worse than single-agent ReAct (Table 2: P&E = 42.85, ReAct = 43.02).

**Option C: Retry** — repeat the failed subtask. Works if failure is transient (network error), fails if failure is structural (train doesn't exist).

None of these options address the root problem: **the subtask itself may be unachievable and needs replacement**, not retry.

Dynamic systems add:

**Option D: Replan** — revise the subtask based on current state. This is what TDAG does, preventing CTF.

## Failure Containment Strategies

The paper doesn't explicitly describe these as "containment strategies," but they can be extracted from TDAG's design:

### Strategy 1: Checkpointing State After Each Subtask

Algorithm 1, line 6:
```
r_i ← subagent_i.Execute(t_1, ..., t_i, r_1, ..., r_{i-1})
```

Each subtask execution returns a **result** `r_i`, not just success/failure. This result captures:
- What actions were performed
- What state changes occurred
- What constraints were violated
- What resources were consumed

**Example result structure**:
```python
class Result:
    success: bool
    state_changes: Dict[str, Any]  # e.g., {"agent_location": "Shanghai"}
    constraint_violations: List[str]
    attempted_actions: List[Action]
    errors: List[str]
```

This rich result enables intelligent replanning. If Subtask 1 fails to book the 14:40 train but successfully books the 18:25 train, `r_1` captures:
- `success = False` (didn't get the intended train)
- `state_changes = {"departure_time": "18:25", "arrival_time": "00:20"}`
- `errors = ["Train G2304 sold out"]`

The replanner uses this to generate Subtask 2': "Given agent arrives Beijing at 00:20, visit Great Wall starting 09:00 next day."

### Strategy 2: Stateless Subtask Specifications

Subtasks should specify **goals**, not **actions assuming prior state**:

**Bad (state-dependent)**:
```python
subtask_2 = "Visit the Great Wall starting at 08:00 on July 2"
```
This assumes agent is in Beijing at 08:00.

**Good (goal-oriented)**:
```python
subtask_2 = "After arriving in Beijing, visit the Great Wall. Allocate 4 hours. Consider attraction opening hours (08:00-17:00)."
```
This states what to achieve, not when/how. The subagent determines when/how based on actual arrival time.

TDAG's dynamic update (Equation 6) transforms subtasks from state-dependent to state-aware:
- Original subtask: goal + assumed preconditions
- Updated subtask: goal + actual preconditions from `r_1...r_{i-1}`

### Strategy 3: Graceful Degradation Metrics

The paper's three-level evaluation (Section 3.3) is also a **specification for graceful degradation**:

**Level 1 (Executability)**: Must have. If subtask produces infeasible actions, it's worthless.
**Level 2 (Constraints)**: Should have. If subtask violates budget/time, it's suboptimal but not useless.
**Level 3 (Efficiency)**: Nice to have. If subtask is inefficient, it's suboptimal but still valuable.

This hierarchy guides replanning decisions:

```python
if subtask_failed(level=1):
    # Must replan—current subtask is infeasible
    replanned_subtask = replan(subtask, relax_constraints=[])
elif subtask_failed(level=2):
    # May replan—current subtask violates requirements
    replanned_subtask = replan(subtask, relax_constraints=["budget", "duration"])
elif subtask_failed(level=3):
    # Optional replan—current subtask is just inefficient
    replanned_subtask = subtask  # Accept suboptimal solution
```

**Containment principle**: Level 1 failures escalate to replanning; Level 2/3 failures are tolerated unless critical.

### Strategy 4: Error Classification Drives Recovery Strategy

Table 3's error taxonomy guides recovery:

**Cascading Task Failure (CTF)**: Indicates broken dependencies → replan entire remaining task sequence
**Commonsense Knowledge Errors (CKE)**: Indicates wrong action selection → retry with better tool documentation
**External Information Misalignment (EIM)**: Indicates hallucination → retry with explicit fact-checking
**Constraint Non-compliance (CNC)**: Indicates optimization failure → retry with constraint emphasis

TDAG reduces CTF dramatically (4.35% vs 34.78%) but doesn't eliminate other error types. This reveals:
- Dynamic decomposition solves *structural* failures (dependencies broken)
- But doesn't inherently solve *semantic* failures (wrong tool use, hallucination, constraint reasoning)

**For WinDAGs**: Different error types need different recovery strategies. Don't use one-size-fits-all retry logic.

## Implementing Failure Containment in DAG Systems

The paper's framework suggests treating tasks as **partially-ordered dependency graphs** rather than linear sequences:

### Traditional Linear Decomposition
```
T → [t1] → [t2] → [t3] → [t4] → [t5]
```
If t2 fails, t3-t5 are blocked.

### Dependency-Aware Decomposition
```
        [t2] → [t4]
       ↗      ↗
[t1] →       
       ↘      ↘
        [t3] → [t5]
```
If t2 fails, t3, t5 can still execute (they don't depend on t2).

**TDAG implicitly does this** through dynamic decomposition: when t_i fails, the replanner generates t'_{i+1} based on which prior subtasks succeeded, not based on the original plan.

**Implementation pattern**:

```python
def execute_task_with_containment(task: Task) -> Tuple[Result, Score]:
    completed_subtasks = []
    failed_subtasks = []
    
    subtasks = decompose(task)
    
    while subtasks:
        # Execute subtasks whose dependencies are met
        ready_subtasks = [st for st in subtasks 
                          if dependencies_met(st, completed_subtasks)]
        
        for st in ready_subtasks:
            result = execute_subtask(st)
            
            if result.success:
                completed_subtasks.append((st, result))
                subtasks.remove(st)
            else:
                # Attempt replanning
                replanned = replan_subtask(st, result, completed_subtasks)
                
                if replanned:
                    subtasks.remove(st)
                    subtasks.append(replanned)
                else:
                    # Replanning failed—mark as permanently failed
                    failed_subtasks.append((st, result))
                    subtasks.remove(st)
                    
                    # Remove dependent subtasks (CTF prevention)
                    blocked = [s for s in subtasks if depends_on(s, st)]
                    subtasks = [s for s in subtasks if s not in blocked]
                    failed_subtasks.extend([(s, "Dependency failed") for s in blocked])
    
    return aggregate_results(completed_subtasks, failed_subtasks)
```

**Key properties**:
1. Subtasks execute when dependencies are met, not in fixed order
2. Failed subtasks trigger replanning, not immediate abortion
3. If replanning fails, only dependent subtasks are blocked (explicit CTF prevention)
4. Independent subtasks continue executing

## When Failure Containment Is Harmful

The paper's results show dynamic decomposition is superior in their domain (travel planning with stochastic availability and tight coupling). But there are domains where failure containment is **counterproductive**:

### Domain 1: Strict Sequential Protocols

Example: Medical treatment protocols where step N must complete successfully before step N+1, and any failure requires expert re-evaluation.

**Why containment is bad**: Continuing after a failed step violates safety protocols. Better to abort and alert human.

### Domain 2: All-or-Nothing Transactions

Example: Financial transfers where partial completion leaves system in inconsistent state.

**Why containment is bad**: Executing independent subtasks after a failure may create partial state that's worse than no state change at all.

### Domain 3: Rapidly Changing Environments

Example: Real-time strategy games where state changes every second.

**Why containment is bad**: By the time replanning completes, the state has changed again. Better to use reactive policies (fast heuristics) than deliberative planning (slow optimization).

**For WinDAGs**: Add task metadata indicating whether containment is appropriate:

```python
class Task:
    allow_partial_completion: bool  # Can subtasks succeed independently?
    allow_replanning: bool          # Can subtasks be revised mid-execution?
    safety_critical: bool            # Must human approve after failures?
```

Use this metadata to select execution strategy: dynamic decomposition with containment vs. static plan with immediate abort.

## The Coordination Cost of Failure Containment

Dynamic decomposition isn't free. The paper's approach requires:

**Coordination overhead**:
- Main agent regenerates subtasks after each execution (Algorithm 1, line 11)
- Subagents must communicate structured results (not just success/failure)
- Skill library queries happen per subtask (Section 4.2.2)

**Latency impact**:
- Replanning takes time: LLM inference for update prompt
- State checkpointing takes time: capturing and serializing results
- Skill retrieval takes time: embedding similarity search

The paper doesn't report execution time, but TDAG likely has **higher latency per task** than ReAct or P&E. The benefit: **higher success rate** (49.08 vs 43.02-44.74).

**Trade-off**: Lower throughput (tasks/hour) for higher quality (score/task).

**When is this trade-off acceptable?**
- High-value tasks where failure is expensive
- Low-frequency tasks where latency doesn't matter
- Debugging/exploration phases where understanding failures is priority

**When is it unacceptable?**
- High-volume, low-value tasks (e.g., batch processing millions of records)
- Real-time tasks with strict latency requirements
- Tasks where partial completion has no value (must be all-or-nothing)

## The Human Coordination Analogy

The paper's multi-agent system mirrors human project management:

**Static planning = Waterfall methodology**:
- Plan entire project upfront
- Execute phases sequentially
- Minimal adaptation to problems

**Dynamic planning = Agile methodology**:
- Plan next sprint based on current progress
- Retrospectives after each sprint inform next sprint
- Continuous adaptation

Waterfall fails on complex, uncertain projects for the same reason static decomposition fails on complex, uncertain tasks: **reality diverges from plans, and the system has no mechanism to adapt**.

Agile succeeds by building adaptation into the process: sprint reviews are *expected*, not exceptional. Similarly, TDAG builds replanning into the architecture: subtask updates are *expected*, not exceptional.

**The principle**: In uncertain domains, **treat replanning as the norm, not the exception**. Design systems that assume plans will need revision, not systems that assume plans will execute as written.

## Summary: Containment as Architectural Philosophy

The TDAG paper's core contribution: demonstrate that **error propagation is not inevitable—it's a consequence of architectural choices**.

Static decomposition creates error propagation by:
- Committing to full plan before execution
- Not validating preconditions at runtime
- Treating failure as unexpected exception

Dynamic decomposition prevents error propagation by:
- Deferring planning decisions until needed
- Validating actual state after each step
- Treating failure as expected event that triggers replanning

**For WinDAGs design**: The question isn't "should we support failure containment?" but "what's our default stance?"

- **Default to static**: Good for well-understood, stable domains. Fast but brittle.
- **Default to dynamic**: Good for novel, uncertain domains. Slow but robust.

The paper suggests for complex real-world tasks (where uncertainty is high and stakes are high), **dynamic should be the default**. The 8× reduction in cascading failures (Table 3) is worth the coordination overhead.
```

### FILE: context-precision-vs-context-bloat.md

```markdown
# Context Precision vs. Context Bloat: Managing Information Flow in Multi-Agent Systems

## The Context Problem in Complex Tasks

A subtle insight in the TDAG paper: single-agent approaches (ReAct) suffer from "excessive irrelevant contexts" (Introduction), but naive multi-agent decomposition doesn't automatically solve this. In fact, Plan-and-Execute (P&E) performs *worse* than ReAct despite using specialized subagents (Table 2: 42.85 vs 43.02).

Why doesn't decomposition help with context management? And when does it?

## What Is Context Bloat?

In LLM-based agents, "context" refers to the prompt content the model processes:
- Task description
- Available tools and their documentation
- Execution history (previous actions and results)
- Skills or examples from similar tasks
- Environmental state information

**Context bloat** occurs when this content includes information irrelevant to the current decision, which degrades performance through:

1. **Distraction**: Model attention spreads across irrelevant details, reducing focus on pertinent information
2. **Hallucination**: More content increases probability of fabricating connections between unrelated facts (External Information Misalignment errors in Table 3)
3. **Token limits**: Long contexts risk truncation of important information
4. **Latency**: Processing large contexts is slower

The paper's error analysis (Table 3) shows ReAct has the *lowest* External Information Misalignment (EIM) rate despite using a single agent—17.32% vs. P&S's 19.46%, ADAPT's 21.74%, TDAG's 19.33%. This suggests single agents sometimes manage context *better* than naive multi-agent systems.

## Why Single Agents Avoid Some Context Bloat

ReAct's advantage: **it only maintains one context thread**. Each iteration adds:
```
Thought: [reasoning about current situation]
Action: [tool call]
Observation: [result]
```

This grows linearly with task steps, but each entry is *directly relevant* because it's part of the sequential problem-solving process.

Compare to multi-agent systems with poor coordination:

**Subagent 1 (train booking)** receives:
- Full task description (including attraction details, irrelevant to booking)
- All available tools (including attraction databases, irrelevant to booking)
- Previous results from other subagents (if they're shared globally)

**Result**: Each subagent's context includes information for *other* subagents' tasks, creating bloat.

The paper notes: "Concretely, agents in our benchmark are required to act as personal assistants, leveraging computer tools like the databases and the code interpreter to execute tasks" (Section 3.1). If all subagents see all tools, even when they only need a subset, bloat accumulates.

## TDAG's Solution: Generated Context Precision

TDAG addresses this through **agent generation** (Section 4.2), which creates **subtask-specific context**:

### Mechanism 1: Tool Document Generation (Section 4.2.1)

Instead of giving every subagent the full tool documentation, TDAG generates documentation tailored to each subtask:

**Generic documentation** (given to all agents):
```
query_database(table, conditions): Query the database
  - table: table name (str)
  - conditions: filter conditions (dict)
Returns query results (list)
```

**Generated documentation for "book train from Shanghai to Beijing"**:
```
query_database(table, conditions): Find available trains

For your subtask (train booking), use:
  - table: "inter_city_transportation"
  - conditions: {
      "origin": "Shanghai",
      "destination": "Beijing",
      "date": "2023-07-01",
      "type": "train"
    }

Returns: [{ticket_id, departure_time, arrival_time, price, seats_available}, ...]

Relevant for your subtask:
  - Focus on "departure_time" and "arrival_time" to match user's schedule
  - Check "seats_available" > 0 before selecting
  - Consider "price" if budget constraints exist
```

**Generated documentation for "find restaurants near hotel"**:
```
query_database(table, conditions): Find nearby dining options

For your subtask (restaurant search), use:
  - table: "intra_city_places"
  - conditions: {
      "city": "Beijing",
      "type": "restaurant",
      "distance_from": "Beijing Railway Hotel",
      "max_distance": 2.0  # km
    }

Returns: [{place_id, name, cuisine_type, rating, distance}, ...]

Relevant for your subtask:
  - "distance" indicates walking time (assume 1km = 15min walk)
  - "rating" is out of 5 stars
  - "cuisine_type" helps match user preferences
```

**Notice the difference**:
- Same underlying tool (`query_database`)
- Completely different usage guidance
- Context is *precise* to subtask needs

The paper states: "This is achieved through LLM prompting... By doing so, we aim to ensure that every piece of information presented to the agent is not only relevant but also optimally formatted for effective comprehension and application" (Section 4.2.1).

### Mechanism 2: Skill Retrieval (Section 4.2.2)

Skills are retrieved by semantic similarity to the current subtask:

```python
subtask_embedding = sentence_bert.encode(subtask.description)
similar_skills = skill_library.query(
    embedding=subtask_embedding,
    threshold=0.7,
    top_k=2
)
```

This ensures subagents only see skills relevant to their specific subtask, not all skills in the library.

**Example**:

**Subtask**: "Book train from Shanghai to Beijing"
**Retrieved skills** (k=2 most similar):
1. "For train booking, query database with 'inter_city_transportation' table and filter by departure city, arrival city, and date. Check seat availability before confirming."
2. "If preferred train is sold out, query for alternative departure times within 3-hour window. Consider earlier/later trains."

**Not retrieved** (low similarity):
- Skills about attraction visiting
- Skills about hotel booking
- Skills about route optimization within cities

**Contrast with global skill sharing**: If all 100 skills in the library were provided to every subagent, context bloat would be severe—most skills are irrelevant to any given subtask.

## The Context Precision Principle

TDAG's approach suggests a design principle:

**Context should be proportional to scope**: An agent working on subtask S should receive information precisely scaled to S's scope—not the full task's information, not a fixed generic set of information, but information specifically curated for S.

This requires **just-in-time context generation**:

```python
def generate_agent(subtask: Subtask) -> Agent:
    # Scope context to subtask
    relevant_tools = filter_tools(all_tools, subtask)
    tool_docs = generate_docs(relevant_tools, subtask)
    skills = retrieve_skills(subtask, skill_library)
    
    return Agent(
        tools=relevant_tools,
        tool_docs=tool_docs,
        skills=skills,
        prompt=f"Your only job: {subtask.description}"
    )
```

**Not**:
```python
def create_generic_agent() -> Agent:
    return Agent(
        tools=all_tools,  # Everything
        tool_docs=generic_docs,  # One-size-fits-all
        skills=all_skills,  # Entire library
        prompt="You are a helpful assistant"  # Vague
    )
```

## Why P&E Fails at Context Management

The paper shows P&E (Plan-and-Execute with fixed subagents) underperforms ReAct despite decomposition. The likely reason: **P&E decomposes tasks but not context**.

**P&E architecture** (inferred from description):
1. Planner generates subtasks: t1, t2, ..., tn
2. Each subtask assigned to pre-defined executor (e.g., "executor for database queries")
3. Executors are generic—designed to handle *any* database query, not specifically train booking vs. restaurant search

**Context at executor**:
- Generic tool documentation
- Subtask description
- Maybe previous subtask results

**Problem**: The executor must figure out, from generic docs, how to use tools for this specific subtask. It sees documentation for 10 different database tables, must infer which is relevant.

**TDAG architecture**:
1. Planner generates subtask: t_i
2. Agent generator creates *specialized* executor for t_i
3. Executor receives *generated* documentation specific to t_i

**Context at executor**:
- Subtask-specific tool documentation
- Retrieved skills from similar subtasks
- Subtask description
- Previous subtask results

**Advantage**: Executor doesn't need to infer relevance—documentation is pre-filtered. Less cognitive load, fewer errors.

## Measuring Context Precision

The paper doesn't directly measure context size, but we can infer from error analysis:

**External Information Misalignment (EIM)** errors (Table 3) relate to context management:
- ReAct: 17.32% (lowest)
- P&S: 19.46%
- P&E: 22.14%
- ADAPT: 21.74%
- TDAG: 19.33%

**Interpretation**:
- ReAct's single-agent approach avoids multi-agent coordination context bloat
- P&E and ADAPT (multi-agent, fixed agents) have high EIM due to generic contexts
- TDAG (multi-agent, generated agents) reduces EIM vs. P&E/ADAPT through context precision
- But TDAG still slightly higher than ReAct—trade-off for parallelization benefits

**For WinDAGs**: Track EIM-equivalent errors (hallucination, tool misuse, fact misalignment) as proxy for context quality. If errors increase with task complexity faster than linearly, suspect context bloat.

## Implementing Context Precision in DAG Systems

### Strategy 1: Scope Isolation

Each skill/agent should have explicit scope declaration:

```python
class Agent:
    scope: Scope  # What this agent is responsible for
    
class Scope:
    task_types: List[str]  # e.g., ["train_booking", "flight_booking"]
    tools: List[str]        # e.g., ["query_database", "book_ticket"]
    knowledge_domains: List[str]  # e.g., ["transportation", "schedules"]
```

When generating context for an agent:
```python
def generate_context(agent: Agent, subtask: Subtask) -> Context:
    # Only include information within agent's scope
    relevant_tools = [t for t in all_tools if t.name in agent.scope.tools]
    relevant_knowledge = [k for k in knowledge_base 
                          if k.domain in agent.scope.knowledge_domains]
    
    return Context(
        tools=relevant_tools,
        knowledge=relevant_knowledge,
        task_description=subtask.description
    )
```

### Strategy 2: Hierarchical Context

Provide context at multiple granularity levels:

**Level 0: Task overview** (for coordinator)
```
User wants to visit 8 attractions across 3 cities in 7 days.
Budget: 5000 RMB.
```

**Level 1: Subtask goals** (for subagent)
```
Your job: Book transportation from Shanghai to Beijing.
Departure: July 1, afternoon preferred.
Budget for this leg: ~300 RMB.
```

**Level 2: Execution specifics** (for tool calls)
```
Query "inter_city_transportation" table with:
  origin = "Shanghai"
  destination = "Beijing"
  date = "2023-07-01"
  type = "train"
Filter results where seats_available > 0.
```

Each level omits details irrelevant at that abstraction level. Subagents don't see Level 0 details (attraction specifics for other cities); tool calls don't see Level 1 details (budget reasoning).

### Strategy 3: Dynamic Documentation

The paper's tool document generation (Section 4.2.1) can be implemented as:

```python
def generate_tool_docs(tool: Tool, subtask: Subtask) -> str:
    prompt = f"""
    This agent needs to use {tool.name} for: {subtask.description}
    
    Original documentation:
    {tool.documentation}
    
    Rewrite the documentation to:
    1. Emphasize parameters relevant to this subtask
    2. Provide example usage for this specific subtask
    3. Warn about common mistakes for this subtask type
    4. Omit details irrelevant to this subtask
    """
    
    return llm.generate(prompt)
```

**Cost consideration**: This requires an LLM call per tool per subtask. For a task with 10 subtasks and 5 tools each, that's 50 doc generation calls.

**Optimization**: Cache generated docs for (tool, subtask_type) pairs:
```python
doc_cache: Dict[Tuple[str, str], str] = {}

def get_tool_docs(tool: Tool, subtask: Subtask) -> str:
    key = (tool.name, subtask.type)
    if key in doc_cache:
        return doc_cache[key]
    
    generated = generate_tool_docs(tool, subtask)
    doc_cache[key] = generated
    return generated
```

Over time, cache warms up and doc generation becomes rare.

### Strategy 4: Context Pruning

Even with careful construction, contexts can bloat during execution as results accumulate:

```python
def prune_context(context: Context, current_subtask: Subtask) -> Context:
    """
    Remove information from context that's no longer relevant.
    """
    # Keep only recent results (last 3 subtasks)
    recent_results = context.results[-3:]
    
    # Keep only results directly referenced by current subtask
    relevant_results = [r for r in recent_results 
                        if subtask.depends_on(r.subtask_id)]
    
    # Remove tool docs for tools not available to this subtask
    relevant_tools = [t for t in context.tools 
                      if t.name in current_subtask.allowed_tools]
    
    return Context(
        results=relevant_results,
        tools=relevant_tools,
        task_description=context.task_description
    )
```

## The Attention Allocation Hypothesis

The deeper reason context precision matters: **LLM attention is a limited resource**.

Transformer models allocate attention across all tokens in context. If context has 1000 tokens but only 100 are relevant to the current decision, attention is "wasted" on 900 irrelevant tokens.

**Evidence from paper**: Table 3 shows EIM errors correlate with context breadth:
- ReAct (narrowest context—single thread): 17.32% EIM
- TDAG (medium context—subtask-specific): 19.33% EIM
- P&E (broad context—generic multi-agent): 22.14% EIM

**Hypothesis**: EIM increases as % of irrelevant context increases, because model attention is distracted by irrelevant information, leading to hallucination.

**Implication for WinDAGs**: Measure effective context size:
```
Effective size = (relevant tokens) / (total tokens)
```

Aim for effective size >70%. If it drops below 50%, context is too bloated.

## When Context Breadth Is Beneficial

The paper's results don't suggest context should be *minimal*—they suggest it should be *precise*.

**Beneficial breadth**:
- **Historical context**: Results from previous subtasks that current subtask depends on
- **Related skills**: Examples from similar past subtasks, even if not identical
- **Constraint context**: Global requirements that all subtasks must satisfy

**TDAG includes these**: Each subagent receives (Equation 5):
```
r_i = SubAgent_i(t_1, t_2, ..., t_i, r_1, r_2, ..., r_{i-1})
```

Notice: all previous subtask descriptions (t_1...t_i) and results (r_1...r_{i-1}) are provided. This is *broad* context—but it's *relevant* breadth because current subtask may depend on any prior subtask's outcome.

**Example**: Subtask 5 is "visit Forbidden City in Beijing." It needs to know:
- When did agent arrive in Beijing? (from Subtask 1's result)
- How much budget was spent on train? (from Subtask 1's result)
- What other attractions are planned in Beijing? (from Subtask 2-4 descriptions)

Without this context, Subtask 5 can't make informed decisions. But Subtask 5 doesn't need:
- Attraction opening hours for Xi'an attractions (planned for Subtasks 6-7)
- Hotel options in Shanghai (origin city, not relevant to Beijing visit)

**Design principle**: Include all *dependencies*, exclude all *non-dependencies*.

## The Generator's Context Challenge

A subtle problem: the **agent generator itself** needs context to generate subtask-specific documentation.

Algorithm 1 doesn't show this, but the generator must receive:
- Subtask description (to understand what's relevant)
- Full tool documentation (to extract relevant parts)
- Access to skill library (to retrieve relevant skills)

**The generator's context is necessarily broad** because its job is filtering. It sees everything, outputs a subset.

This is acceptable because:
1. Generator runs once per subtask (not iteratively)
2. Generator's output (filtered context) is used by subagent multiple times
3. Cost of generator's broad context is amortized over subagent's execution

**But**: If task has 50 subtasks, generator runs 50 times with broad context. This is expensive.

**Optimization**: Batch generation. Generate agents for all current subtasks in one generator call:

```python
def generate_agents_batch(subtasks: List[Subtask]) -> List[Agent]:
    prompt = f"""
    Generate specialized documentation for each subtask:
    {format_subtasks(subtasks)}
    
    Available tools: {all_tools}
    
    For each subtask, specify:
    - Which tools it needs
    - How to use those tools for that specific subtask
    - What skills are relevant
    """
    
    return llm.generate(prompt)
```

This runs generator once for N subtasks instead of N times, reducing total generator context processing.

## Summary: Context as Scarce Resource

The TDAG paper's implicit lesson: **treat context like memory in computing—finite and precious**.

Just as programs should allocate memory judiciously (load what you need, free what you don't), agents should construct context judiciously (include what's relevant, exclude what's not).

**Three principles**:

1. **Scope contexts to decision boundaries**: Subagents solving subtask S should see only information relevant to S, not the full task.

2. **Generate documentation dynamically**: Don't give generic docs to all agents; generate subtask-specific docs that emphasize relevant details.

3. **Retrieve, don't broadcast**: Use semantic search to pull relevant skills/knowledge instead of providing everything to everyone.

**For WinDAGs**: Build infrastructure for context management:
- Context generation templates
- Tool documentation generators
- Skill retrieval systems
- Context pruning policies

The payoff: Lower error rates (especially hallucination/EIM), better performance on complex tasks, and better scaling to large tool libraries.
```

### FILE: skill-libraries-as-learned-institutional-memory.md

```markdown
# Skill Libraries as Learned Institutional Memory: How Agent Systems Accumulate Expertise Over Time

## The Skill Library Concept

Section 4.2.2 introduces a deceptively simple idea: after completing a subtask, the agent **summarizes its solution process** and stores it as a "skill" for future use.

```
Skill format:
- Name: Short identifier
- Detail: Description of the subtask type
- Solution: How the subtask was solved
```

When a new subtask arrives, **retrieve similar skills** using semantic similarity (SentenceBERT embeddings, θ=0.7 threshold, top-k=2) and provide them as reference examples.

This is more profound than it appears. The skill library is essentially **learned documentation**—the system teaches itself how to solve problems based on its own execution history.

## Why This Differs From Voyager's Skills

The paper explicitly contrasts with Voyager (Wang et al., 2023a), a Minecraft agent that also uses skill libraries:

"The concept of a skill library is inspired by voyager, but with crucial adaptations. Unlike the environment of voyager, where the correctness of skills are directly verifiable through environmental feedback, our benchmark environment cannot guarantee the correctness of a skill. Therefore, the skills our agents develop are subject to continuous refinement in response to variable tasks and environmental conditions" (Section 4.2.2).

**Voyager's context**: Minecraft is deterministic. If skill "mine_diamond" works once, it works forever. Skills are **proven solutions**.

**TDAG's context**: Travel planning is stochastic and contextual. A skill "book afternoon train Shanghai→Beijing" might work today (train available) but fail tomorrow (train sold out), or work for one user (flexible schedule) but fail for another (rigid deadline). Skills are **heuristics**, not proofs.

This necessitates different architecture:

**Voyager**: Skills are immutable code. Once learned, they're trusted.

**TDAG**: Skills are suggestions. Retrieved skills guide agents but are adapted to current context. "A agent dedicated to skill modification oversees the library, updating existing skills based on new data and experiences" (Section 4.2.2).

## How Skills Are Generated

The paper doesn't provide the exact prompts, but describes the process (Section 4.2.2 and Algorithm 1, lines 7-9):

1. **Subtask completes successfully** (line 7)
2. **Agent summarizes its process** (line 8): 
   ```python
   s ← subagent_i.SummarizeProcess()
   ```
3. **Skill library is updated** (line 9):
   ```python
   L ← Processor.UpdateSkillLibrary(L, s)
   ```

**Inferred prompt for summarization**:
```
You just completed this subtask: {subtask_description}

Your actions were: {action_history}

Summarize your solution in this format:
- Name: [Short, memorable name for this solution approach]
- Detail: [What type of problem does this solve?]
- Solution: [Step-by-step approach that worked]

Focus on the approach that can generalize to similar problems.
```

**Example output** (inferred from travel domain):

```
Name: Book_Alternative_Train_When_Preferred_Sold_Out
Detail: User wants to travel from City A to City B on Date D at preferred time T, but that specific train is sold out.
Solution:
1. Query database for all trains from A to B on Date D
2. Filter for trains departing within ±3 hours of preferred time T
3. Sort by (proximity to T, price)
4. Check seat availability for top 3 results
5. Book first available train
6. Update subsequent subtasks with actual departure time
```

This skill captures a solution *pattern*, not a specific instance.

## Skill Retrieval and Application

When subagent_i is generated for subtask t_i, the system:

1. **Embeds subtask description** using SentenceBERT (Appendix B.1: model "all-mpnet-base-v2")
2. **Queries skill library** for similar skill details:
   ```python
   similar_skills = skill_library.query(
       embedding=subtask_embedding,
       threshold=0.7,
       top_k=2
   )
   ```
3. **Provides skills to subagent** as reference text

**Example**:

**Current subtask**: "Book train from Guangzhou to Shanghai on July 15, prefer morning departure"

**Retrieved skill** (similarity=0.82):
```
Name: Book_Morning_Train_For_Inter_City_Travel
Detail: Book train between major cities with morning departure preference
Solution:
1. Query "inter_city_transportation" table with origin, destination, date
2. Filter for departure_time between 07:00-11:00
3. Sort by departure_time (earliest first) then price
4. Check seats_available > 0
5. Book top result
```

**How subagent uses this**: The skill provides a **strategy** but not rigid instructions. The subagent adapts:
- Uses "Guangzhou" and "Shanghai" for origin/destination (not the generic "origin" and "destination" from skill)
- Uses actual date July 15 (not generic "date")
- May adjust time window if no 07:00-11:00 trains available

Skills are **inspirations**, not scripts.

## Skill Deduplication and Refinement

Appendix B.1 details the implementation:

**Deduplication criteria**:
- Compute similarity between new skill's detail and existing skills' details
- If ≥k similar skills already exist (similarity >θ), reject new skill
- Parameters: k=2, θ=0.7

**Rationale**: Prevents library pollution with redundant skills while allowing genuinely novel skills.

**Example**:

Library contains:
1. "Book train for inter-city travel, morning preference" (similarity=0.85 to new skill)
2. "Book train for inter-city travel, evening preference" (similarity=0.75 to new skill)

New skill: "Book train for inter-city travel, afternoon preference"

**Outcome**: Rejected (2 existing skills with similarity >0.7). The existing skills are deemed sufficient; adding a third is redundant.

**But**: If new skill had unique characteristics (e.g., "Book train with wheelchair accessibility"), similarity would be lower (<0.7) and skill would be added.

**Refinement mechanism**: "A agent dedicated to skill modification oversees the library, updating existing skills based on new data and experiences" (Section 4.2.2).

Though not detailed in the paper, this implies:

```python
def update_skill_library(library: SkillLibrary, new_summary: Summary) -> SkillLibrary:
    similar_skills = library.find_similar(new_summary, threshold=0.7)
    
    if len(similar_skills) >= 2:
        # Skill is redundant, but may improve existing skills
        for skill in similar_skills:
            if new_summary.success_rate > skill.success_rate:
                # New approach is better, update skill
                skill.solution = merge_solutions(skill.solution, new_summary.solution)
    else:
        # Skill is novel, add to library
        library.add(new_summary)
    
    return library
```

Skills **evolve** as agents discover better approaches.

## Why This Is Institutional Memory

In human organizations, "institutional memory" refers to collective knowledge that persists beyond individuals:
- Documented procedures ("how we do things here")
- Lessons learned from past projects
- Best practices accumulated over time
- Workarounds for known problems

Traditionally, in software systems:
- **Procedures** = code
- **Lessons learned** = bug reports, postmortems
- **Best practices** = design documents
- **Workarounds** = comments in code

All written by humans, static, requiring manual updates.

TDAG's skill library provides **dynamic institutional memory**:
- **Procedures** = skills (generated from agent behavior)
- **Lessons learned** = implicit (failed approaches aren't stored, successful ones are)
- **Best practices** = skills retrieved most frequently (high utility)
- **Workarounds** = skills for handling edge cases (e.g., "when train sold out, query nearby times")

This memory is:
1. **Self-generated**: Agents create it from their own experience
2. **Self-updating**: Skill modification agent refines it as better approaches are discovered
3. **Self-pruning**: Unused skills can be marked low-priority (though paper doesn't detail this)

## Measuring Skill Library Value

The ablation study (Table 2) shows agent generation (including skill library) contributes ~5% improvement (46.69→49.08). But this aggregate masks important dynamics:

**Early in task execution**: Skill library is empty or sparse. Agent generation provides minimal benefit because there are no relevant skills to retrieve.

**Later in task execution**: Skill library has accumulated solutions from early subtasks. Later subtasks benefit from retrieval.

**Over multiple tasks**: Skill library accumulates solutions from all tasks. Each new task starts with more institutional memory than the previous task.

The paper doesn't report **cross-task learning** (does Task 2 benefit from skills learned in Task 1?), but the architecture supports it—skills are stored persistently and retrieved by similarity, regardless of which task generated them.

**Expected learning curve**:
```
Task 1:  49.08 score (baseline, sparse skill library)
Task 10: 52-55 score (warm library, common subtasks have good skills)
Task 50: 54-58 score (mature library, even rare subtasks have relevant skills)
```

**For WinDAGs**: Track skill library growth over time:
- Total skills stored
- Retrieval frequency per skill (which skills are most useful?)
- Contribution to success rate (does providing skills improve subagent performance?)

If skill library isn't improving performance over time, either:
1. Skill generation is poor (summarization doesn't capture useful patterns)
2. Skill retrieval is poor (similarity search isn't finding relevant skills)
3. Skill application is poor (subagents ignore skills)

## Implementation Strategy for WinDAGs

### 1. Skill Storage

```python
class Skill:
    id: str
    name: str
    detail: str  # Stored as text
    detail_embedding: np.ndarray  # For retrieval
    solution: str
    metadata: Dict[str, Any]  # Created_at, success_rate, usage_count, etc.

class SkillLibrary:
    skills: List[Skill]
    embedder: SentenceBERT  # "all-mpnet-base-v2"
    
    def add(self, skill: Skill):
        # Check deduplication
        similar = self.query(skill.detail_embedding, threshold=0.7, top_k=2)
        if len(similar) >= 2:
            # Update existing skills instead of adding
            self._merge_skill(skill, similar)
        else:
            self.skills.append(skill)
    
    def query(self, embedding: np.ndarray, threshold: float, top_k: int) -> List[Skill]:
        similarities = [cosine_similarity(embedding, s.detail_embedding) 
                        for s in self.skills]
        ranked = sorted(zip(self.skills, similarities), key=lambda x: x[1], reverse=True)
        return [s for s, sim in ranked if sim >= threshold][:top_k]
```

### 2. Skill Generation Prompt

```python
def generate_skill(subtask: Subtask, actions: List[Action], result: Result) -> Skill:
    prompt = f"""
    You just completed this subtask: {subtask.description}
    
    Your successful actions were:
    {format_actions(actions)}
    
    The result was: {result}
    
    Summarize this into a reusable skill:
    1. Name: Brief, descriptive (e.g., "Book_Train_With_Time_Constraint")
    2. Detail: What general problem does this solve? (e.g., "Book transportation between cities when user has specific time requirements")
    3. Solution: Step-by-step approach that worked, generalized to similar problems
    
    Focus on the STRATEGY, not the specific values. Use placeholders like [ORIGIN], [DESTINATION], [DATE].
    """
    
    return llm.generate(prompt)
```

### 3. Skill Application in Subagent

```python
def generate_subagent(subtask: Subtask, skill_library: SkillLibrary) -> Agent:
    # Retrieve relevant skills
    subtask_embedding =