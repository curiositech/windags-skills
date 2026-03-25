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