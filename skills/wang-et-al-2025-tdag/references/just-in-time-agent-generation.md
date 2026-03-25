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