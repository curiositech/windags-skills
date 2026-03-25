# Control Through Natural Language: Programming Agent Behavior Via Prompts

## The Dual Programming Interface

One of AutoGen's most distinctive features is enabling **control flow programming through natural language prompts** in addition to traditional code. The paper states: "AutoGen allows the usage of programming and natural language in various control flow management patterns: 1) Natural-language control via LLMs... 2) Programming-language control... 3) Control transition between natural and programming language." (p. 5)

This is not just "prompting agents to do things" - it's **using natural language as a control flow programming language**, specifying conditions, loops, error handling, and termination criteria through prose.

## The System Message as Control Flow Specification

Appendix C (Figure 5) provides the most explicit example - the default system message for AssistantAgent. This message contains multiple types of control flow instructions:

**Conditional execution**:
"In the following cases, suggest python code... 
1. When you need to collect info...
2. When you need to perform some task with code..."

This specifies **if-then logic** in natural language: IF (need to collect info) THEN (suggest code to output info).

**Error handling and retry logic**:
"If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes. If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try."

This specifies a **complex error recovery strategy**:
1. TRY execute code
2. IF error THEN fix and retry
3. IF still error THEN analyze problem, gather more info, change approach
4. ELSE IF code succeeds but task not solved THEN analyze and try different approach

This is essentially exception handling and retry logic expressed in natural language.

**Termination conditions**:
"Reply 'TERMINATE' in the end when everything is done."

This specifies when the control flow should end - when all tasks are completed.

**Output formatting for downstream consumption**:
"you must indicate the script type in the code block"
"put # filename: <filename> inside the code block as the first line"
"use 'print' function for the output when relevant"

These are **interface specifications** - how the agent's outputs should be formatted so other agents (the UserProxyAgent executor) can consume them correctly.

**Facilitating automation**:
"The user cannot provide any other feedback or perform any other action beyond executing the code you suggest. The user can't modify your code. So do not suggest incomplete code which requires users to modify."

This specifies **assumptions about the execution environment** that constrain the agent's behavior - don't produce outputs that require manual intervention.

## Why This Works: LLMs as Instruction Followers

The effectiveness of natural language control relies on **chat-optimized LLMs' ability to follow complex, multi-step instructions**. The paper notes: "chat-optimized LLMs (e.g., GPT-4) show the ability to incorporate feedback, LLM agents can cooperate through conversations with each other or human(s)" (p. 2)

This means LLMs can:
1. **Parse conditional logic** from prose ("If the result indicates there is an error...")
2. **Remember multi-step procedures** from instructions ("fix the error and output the code again")
3. **Apply context-specific rules** ("Suggest the full code instead of partial code")
4. **Recognize termination conditions** ("when everything is done")

The paper demonstrates this works in practice across all applications - agents follow these natural language control instructions surprisingly reliably.

## The Spectrum of Control Specification

The paper shows control can be specified at different levels of formality:

**1. Pure natural language (loosest)**:
"Solve the task step by step if you need to" (from system message)
- Suggests general strategy
- Relies on LLM's interpretation of "step by step"
- Most flexible, least precise

**2. Structured natural language (medium)**:
"In the following cases, suggest python code: 1. When you need to collect info... 2. When you need to perform some task with code..." (from system message)
- Enumerated conditions
- Specific actions for each condition
- More precise, still readable

**3. Natural language with formal elements (tighter)**:
"Reply 'TERMINATE' in the end when everything is done" (from system message)
- Specific keyword ('TERMINATE') with semantic meaning
- Parseable by code (UserProxyAgent checks for this keyword)
- Bridges natural and formal specification

**4. Code-level control (most formal)**:
```python
user_proxy = UserProxyAgent(
    max_consecutive_auto_replies=10,
    human_input_mode="NEVER"
)
```
- Programmatically specified parameters
- Unambiguous semantics
- Traditional control flow specification

The power comes from **mixing these levels** - using natural language for nuanced control that's hard to formalize, code for precise constraints.

## Prompting Techniques as Control Patterns

The paper identifies several prompting techniques used for control (Figure 5 highlights):

**1. Role Play**: "You are a helpful AI assistant"
- Establishes agent identity and general behavioral constraints
- Affects all subsequent decisions

**2. Control Flow**: "If the result indicates there is an error, fix the error..."
- Explicit conditional logic and sequencing

**3. Output Confine**: "you must indicate the script type in the code block"
- Constrains output format for downstream processing

**4. Facilitate Automation**: "The user cannot provide any other feedback"
- Specifies automation constraints that limit agent options

**5. Grounding**: "Check the execution result returned by the user"
- Instructs agent to ground in concrete feedback rather than speculation

These are not just "prompt engineering tricks" - they're **control flow patterns expressed in natural language**.

## Advantages of Natural Language Control

The paper demonstrates several benefits:

**1. Rapid iteration**: Changing control flow is as simple as editing prompt text
- No code compilation or testing
- Immediate effect on agent behavior
- Enables quick experimentation

**2. Expressiveness**: Natural language can specify nuanced control that's hard to code
- "analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try"
- This is vague but effective guidance that would be complex to formalize

**3. Accessibility**: Non-programmers can specify control flow
- Domain experts can write control instructions
- Reduces barrier to customizing agent behavior

**4. Composability with code**: Natural and programming language controls can be mixed
- Prompt specifies high-level strategy
- Code specifies hard constraints (max iterations, termination conditions)
- Each used where most appropriate

**5. Self-documentation**: Natural language control is inherently readable
- New team members can understand system behavior by reading prompts
- No need for separate documentation of control logic

## Limitations and Failure Modes

The paper is less explicit about when natural language control fails, but examples reveal issues:

**1. Ambiguity**: Natural language is inherently ambiguous
- "when everything is done" - what counts as "everything"?
- "if the error can't be fixed" - how many attempts before deciding it can't be fixed?
- Agents may interpret these differently than intended

**2. Inconsistent following**: LLMs don't always follow instructions perfectly
- Paper notes "LLMs do not follow all the instructions perfectly" (Appendix C)
- Some control specifications may be ignored or misinterpreted
- Requires empirical testing to verify behavior

**3. Context limitations**: Long, complex control specifications may exceed effective context
- The default system message (Figure 5) is already quite long
- Adding more control details may dilute effectiveness
- Trade-off between comprehensive specification and digestibility

**4. No formal guarantees**: Unlike code, natural language control provides no guarantees
- Can't prove an agent will always follow a specified procedure
- Can't statically analyze control flow for bugs
- Requires runtime monitoring and testing

**5. Difficulty debugging**: When agents misbehave, unclear if it's:
- Misunderstanding of natural language control instructions
- LLM capability limitations
- Conflicting instructions in the prompt
- Environmental issues
- Debugging natural language control is harder than debugging code

## Hybrid Control: Natural + Programming Language

The paper's most powerful examples combine both:

**Example 1: Math problem solving (A1)**

Natural language control (in AssistantAgent system message):
- "Solve the task step by step if you need to"
- "If the result indicates there is an error, fix the error and output the code again"

Programming language control (in agent configuration):
```python
max_consecutive_auto_replies=10  # Hard limit on iterations
```

The natural language specifies **strategy** (step-by-step, error recovery), the code specifies **constraints** (maximum iterations).

**Example 2: Human involvement (A1 Scenario 2)**

Natural language control (same system message as above)

Programming language control:
```python
human_input_mode='ALWAYS'  # Force human input every turn
```

The natural language tells the agent **how to solve problems**, the code specifies **when humans participate**.

**Example 3: Dynamic group chat (A5)**

Natural language control (in speaker selection prompt):
- Role-play style prompt considering conversation context and role alignment

Programming language control:
```python
GroupChatManager(group_chat=[agent1, agent2, ...])  # Who can participate
```

The natural language determines **who speaks next**, the code determines **who is available to speak**.

## Control Transfer Between Languages

The paper notes a sophisticated capability: "AutoGen also supports flexible control transition between natural and programming language." (p. 5)

**Natural → Code transition**:
"One can achieve transition from code to natural-language control by invoking an LLM inference containing certain control logic in a customized reply function"

Example: A programmatic reply function calls an LLM with a prompt containing control instructions. The LLM then makes control decisions in natural language (like selecting the next speaker in GroupChatManager).

**Code → Natural transition**:
"or transition from natural language to code control via LLM-proposed function calls"

Example (A1 Scenario 3): Natural language prompt instructs the agent to call `ask_for_expert` function when stuck. The LLM decides (via natural language reasoning) when to invoke this function, which then executes programmatic control flow (initiating a sub-conversation with the expert).

This **bi-directional transfer** enables:
- Natural language to specify high-level control
- Code to implement that control mechanistically
- Natural language to make runtime control decisions (like "should I call the expert now?")
- Code to enforce those decisions (actually calling the expert)

## Design Implications for Prompt Engineering

The paper's examples suggest several principles for effective control via prompts:

**1. Separate concerns in the prompt**:
The default system message (Figure 5) organizes instructions by concern:
- Role definition
- When to use code
- How to format output
- Error handling procedure
- Facilitating automation
- Verification steps
- Termination condition

This organization helps LLMs parse and apply the right instructions at the right time.

**2. Be specific about interfaces**:
"you must indicate the script type in the code block"
"put # filename: <filename> inside the code block"

These specify the **contract** between this agent and downstream consumers (the executor agent).

**3. Explicitly address failure modes**:
"If the result indicates there is an error, fix the error..."
"If the error can't be fixed or if the task is not solved..."

Anticipating failure and specifying recovery is crucial - don't just specify the happy path.

**4. Use progressive refinement instructions**:
"Suggest the full code instead of partial code or code changes"

This guides the agent toward outputs that are more useful (complete, executable code vs. partial snippets).

**5. Balance completeness with parsability**:
The system message is comprehensive but not overwhelming - it fits in context and remains coherent. Adding too many instructions would dilute effectiveness.

## Comparison to Traditional Control Specification

**Traditional approach**: Control flow is entirely in code
- State machines, if-then-else, loops, exceptions
- Precise but inflexible
- Requires programming expertise to modify

**AutoGen approach**: Control flow is split between natural language and code
- Natural language for strategy, code for constraints
- Flexible but less precise
- Accessible to domain experts for high-level control

**Trade-offs**:
- Traditional: Predictable, debuggable, provable / Inflexible, requires code changes
- AutoGen: Adaptable, intuitive, rapid iteration / Probabilistic, harder to debug, no guarantees

## Critical Gap: Formalizing Natural Language Control

While the paper demonstrates natural language control works, it doesn't provide:

**1. A systematic methodology for designing control prompts**:
- How do you determine what control instructions to include?
- How do you test that instructions are being followed?
- How do you debug when instructions are misunderstood?

**2. Compositional semantics**:
- If Agent A's prompt says "always verify answers" and Agent B's says "trust other agents' outputs", what happens when they interact?
- How do conflicting control instructions across agents get resolved?

**3. Verification and testing approaches**:
- How do you validate that an agent follows control instructions?
- What metrics indicate instruction adherence?
- How do you detect instruction drift over time or across LLM versions?

**4. Prompt version control and evolution**:
- How do you track changes to control prompts over time?
- How do you A/B test different control specifications?
- How do you migrate between prompt versions?

These represent significant open problems for production use of natural language control.

## Takeaway for System Designers

**Natural language control is not a replacement for traditional programming but a complementary layer that enables rapid, accessible specification of high-level agent behavior**. The most effective designs:

1. Use **natural language for strategy** ("solve step by step", "if error then fix and retry")
2. Use **code for constraints** (max iterations, human involvement mode)
3. Enable **bidirectional transfer** (LLM decides when to invoke programmatic control, code decides when to invoke LLM reasoning)
4. **Test empirically** (natural language control is probabilistic, requires validation)
5. **Document extensively** (what control instructions mean, why they're included, what behavior they're intended to produce)

For WinDAGs specifically: Consider designing a **library of control prompt templates** for common patterns (error recovery, iterative refinement, validation, escalation) that can be composed into skill-specific prompts. Provide tooling to test that skills follow control instructions. Make it easy for domain experts to customize high-level control behavior through natural language while developers maintain programmatic constraints.

The key insight is that **natural language extends the expressiveness of control specification beyond what's practical to formalize in code**, enabling domain experts to participate in system design while maintaining programmatic guardrails.