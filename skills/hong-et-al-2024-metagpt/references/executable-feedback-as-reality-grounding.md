# Executable Feedback: Closing the Loop Between Reasoning and Reality

## The Knowing-Doing Gap in Code Generation

Large Language Models can write impressively coherent code—syntactically correct, idiomatically styled, seemingly well-reasoned. Yet this code often fails when executed. The MetaGPT paper identifies a critical gap: "existing methods often lack a self-correction mechanism, which leads to unsuccessful code generation" (p.6). More precisely, they lack **reality grounding**—a way to verify that the system's internal model of "what the code should do" matches what the code actually does when run.

This is the knowing-doing gap writ large: the difference between reasoning about code and executing code. Traditional AI systems optimize for reasoning quality (better prompts, bigger models, more sophisticated planning). MetaGPT adds something different: **an execution loop that provides objective feedback from reality**.

The mechanism (Section 3.3, p.6; Figure 2, p.4) works as follows:

1. Engineer agent writes initial code based on requirements and design specs
2. Code is executed (not simulated—actually run) in a controlled environment
3. If errors occur, the execution system captures: exception type, traceback, failed test output
4. Engineer reviews its previous outputs (PRD, design docs, prior code attempts) alongside the error
5. Engineer generates debugged code addressing the specific failure
6. Loop repeats until tests pass or max iterations (3) reached

The paper reports this simple addition yields substantial improvements:
- **HumanEval**: 81.7% → 85.9% Pass@1 (+4.2 percentage points absolute)
- **MBPP**: 82.3% → 87.7% Pass@1 (+5.4 percentage points)
- **Human Revision Cost**: 2.25 → 0.83 interventions per task (-63%)

These aren't marginal gains—they're the difference between "pretty good" and "production ready."

## Why Executable Feedback Succeeds: Three Mechanisms

### Mechanism 1: Reality is Unambiguous

When an LLM reviews code without executing it, it relies on learned patterns: "does this look like correct code?" This is a heuristic prone to hallucination—the model might confidently assert "yes, this implementation of quicksort is correct" based on surface similarity to training examples, even if there's an off-by-one error that causes crashes.

Execution provides ground truth. A `TypeError: 'NoneType' object is not subscriptable` is not debatable. The code either runs or doesn't; the test either passes or fails. This eliminates the possibility of hallucinated success.

The paper demonstrates this in Table 9 (p.29), which lists common failure modes:
- "TypeError" (actual error from Python interpreter)
- "PNG file missing" (filesystem reality)
- "pygame.surface not initialize" (runtime state error)
- "tensorflow version error" (dependency reality)

Each is a concrete, unambiguous signal. The Engineer agent doesn't have to guess what went wrong—reality tells it.

### Mechanism 2: Error Context Enables Targeted Fixes

The feedback loop provides more than "it failed"—it provides *why* and *where*. A traceback pinpoints the failing line; a test failure shows expected vs. actual output; an import error identifies the missing dependency.

This focuses the agent's attention. Instead of "review the entire codebase for possible issues" (which invites hallucination as the agent "finds" imaginary problems), the task becomes "fix this specific error on line 47." The search space collapses from "all possible bugs" to "bugs that explain this error."

The paper notes: "the Engineer checks past messages stored in memory and compares them with the PRD, system design, and code files" (Figure 2 caption, p.4). This is critical—the agent isn't just retrying randomly; it's reasoning about the discrepancy between specification and implementation, using the error as a guiding signal.

### Mechanism 3: Iteration Accumulates Fixes

Three execution attempts might seem limiting, but empirically it's sufficient. Most errors fall into categories:
1. **Syntax/type errors**: Caught on first execution, fixed immediately
2. **Dependency/import errors**: Caught on first execution, usually fixed by second attempt
3. **Logic errors**: May require 2-3 iterations to diagnose and correct

The paper's results show that executable feedback reduces human revisions from 2.25 to 0.83, meaning most errors are fixed automatically. The remaining 0.83 are likely:
- Complex logic bugs requiring domain knowledge
- Ambiguous requirements where no "correct" implementation exists
- Environment issues outside code (missing datasets, API keys, etc.)

For routine errors (type mismatches, missing imports, off-by-one errors in loops), execution + retry is sufficient.

## Comparison to Code Review Without Execution

The paper's ablation study (Table 1, p.8) compares "MetaGPT w/o Feedback" to full MetaGPT:

| Metric | w/o Feedback | w/ Feedback | Δ |
|--------|--------------|-------------|---|
| Executability | 3.67/4.0 | 3.75/4.0 | +2.2% |
| Human Revisions | 2.25 | 0.83 | -63% |
| Token Usage | 24,613 | 31,255 | +27% |

The tradeoff is clear: executable feedback costs 27% more tokens (because retry iterations add LLM calls) but reduces human intervention by 63%. For practical systems, this is an enormous win—human time is expensive, token costs are cheap.

Importantly, the executability score improves modestly (3.67 → 3.75) but the revision cost drops dramatically. This suggests:
- Many bugs in the "w/o Feedback" version are *superficial* (import errors, type errors) that humans can quickly fix
- Executable feedback catches these automatically
- The remaining 0.08 gap in executability (3.75 vs. perfect 4.0) represents hard bugs that neither automatic execution nor human revision can easily fix without more context

## Beyond Correctness: Executable Feedback for Optimization

While MetaGPT focuses on correctness (does the code run?), executable feedback can drive optimization. If you can execute code, you can profile it:

- **Performance**: Measure actual runtime, identify bottlenecks, optimize
- **Resource Usage**: Track memory consumption, detect leaks
- **Robustness**: Run with edge-case inputs, verify error handling
- **Security**: Execute in a sandbox, detect unsafe operations

The framework for this exists in MetaGPT (Engineers can execute code), but the paper doesn't explore optimization use cases. A natural extension:

```python
class Engineer(Agent):
    def optimize_code(self, code: str, target_metric: str):
        # Run code with profiling
        results = self.execute_with_profiling(code)
        
        # If performance target not met, iterate
        while results[target_metric] > threshold:
            # Analyze profile, identify bottleneck
            bottleneck = self.analyze_profile(results)
            
            # Generate optimized version
            code = self.optimize(code, bottleneck)
            results = self.execute_with_profiling(code)
        
        return code
```

This would let agents automatically optimize implementations to meet performance specs—a common real-world requirement ("the API must respond in <100ms").

## Boundary Conditions: When Executable Feedback Isn't Enough

The paper is honest about limitations. Table 9 (p.29) shows cases where even with executable feedback, code has issues:

1. **Missing functionality**: Code runs but doesn't implement all requirements. Execution only catches crashes/errors, not missing features.
2. **Subtle logic bugs**: Code passes tests but fails on edge cases not covered by tests.
3. **Integration issues**: Code works in isolation but fails when integrated with other components.

These require:
- **Better test generation**: More comprehensive unit tests that cover edge cases
- **Specification grounding**: Verify outputs match requirements, not just "no errors"
- **Integration testing**: Execute composed systems, not just individual components

The QA Engineer role in MetaGPT (p.8) hints at this—generating test cases to "enforce stringent code quality." But the paper doesn't detail how test quality is ensured. A weak test suite means executable feedback only catches obvious bugs.

## Application to Agent Systems: Design Principles

For systems like WinDAGs that orchestrate agents for various tasks, executable feedback offers several design patterns:

**Pattern 1: Execution as Standard Skill**
Make "execute code/query/API call in sandbox" a primitive operation available to agents. When an agent produces an artifact that *can* be executed (code, SQL, API spec), automatically attempt execution and provide feedback. This works for:
- Code generation (run unit tests)
- Database queries (execute on test DB, verify result schema)
- API calls (call test endpoint, check response)
- Configuration files (validate syntax, check for errors)

**Pattern 2: Feedback Loops Over Fixed Retries**
MetaGPT uses 3 fixed retry attempts. A more sophisticated approach:
```python
def execute_with_feedback(agent, task, max_attempts=10):
    for attempt in range(max_attempts):
        output = agent.generate(task)
        result = execute(output)
        
        if result.success:
            return output
        
        # Adaptive stopping: if error isn't changing, give up
        if attempt > 0 and result.error == previous_error:
            return output  # Agent is stuck, escalate to human
        
        task = augment_task_with_feedback(task, result.error)
        previous_error = result.error
```

This detects when the agent is "stuck" (producing the same error repeatedly) and stops early, saving tokens.

**Pattern 3: Execution Environment as Context**
Different tasks need different execution environments:
- Python code: Virtual environment with dependencies
- SQL: Temporary database with test schema
- Web scraping: Sandboxed browser
- System administration: Docker container with OS

WinDAGs should maintain a library of execution contexts and select appropriate ones based on task type. The executable feedback mechanism must include environment setup as a first-class concern.

**Pattern 4: Multi-Level Testing**
Executable feedback in MetaGPT tests at unit level (individual functions). Real systems need:
- **Unit tests**: Does this function work in isolation?
- **Integration tests**: Do components work together?
- **End-to-end tests**: Does the full system satisfy requirements?

A sophisticated orchestrator would:
1. Generate unit tests, iterate with feedback until they pass
2. Generate integration tests, iterate until they pass
3. Generate E2E tests, iterate until they pass
4. Only then declare the task complete

Each level provides progressively stronger guarantees of correctness.

## The Meta-Pattern: Closing Reasoning-Reality Gaps

Executable feedback is a specific instance of a broader pattern: **whenever possible, ground reasoning in objective reality checks**. This applies beyond code:

- **Research synthesis**: Don't just have an agent write a literature review—have it extract claims and verify them against source papers
- **Data analysis**: Don't just have an agent describe data—have it compute statistics and verify interpretations
- **Argument construction**: Don't just have an agent build a logical argument—have it check for formal validity
- **Resource planning**: Don't just have an agent propose a schedule—have it verify constraints (no double-bookings, sufficient resources)

The unifying principle: **reasoning systems can hallucinate; reality checks prevent propagation of hallucinations**. In multi-agent systems, this is critical because hallucinations cascade—one agent's error becomes another agent's input.

MetaGPT demonstrates this at scale. Without executable feedback (Table 1), human revisions average 2.25 per project—evidence that hallucinations slip through code review. With executable feedback, revisions drop to 0.83. The execution loop caught and fixed 1.42 errors per project automatically.

## Practical Implementation Considerations

Implementing executable feedback requires infrastructure:

**Sandboxing**: Code must execute in isolation to prevent security issues. Use containers (Docker), VMs, or language-specific sandboxes (PyPy's sandbox mode, Deno's permissions model). The paper doesn't detail MetaGPT's sandbox implementation but notes Engineers "write and execute unit test cases" (p.6), implying a safe execution environment.

**Timeout Limits**: Buggy code might infinite loop. Set timeouts (e.g., 30 seconds max) and treat timeouts as errors. Provide timeout information as feedback: "execution exceeded 30s limit, likely infinite loop at line X."

**Resource Limits**: Prevent resource exhaustion (memory bombs, disk fills). Use OS-level limits (cgroups on Linux) or language limits (Python's resource module).

**Dependency Management**: Code often requires libraries. Either:
- Pre-install common dependencies in execution environment
- Parse import statements, install dependencies automatically (as MetaGPT does with pip)
- Provide feedback about missing dependencies and let agent fix

**Reproducibility**: Execution results must be deterministic. Control sources of randomness (set seeds), avoid network calls in tests (use mocks), ensure filesystem state is reset between runs.

**Cost Management**: Execution adds overhead. Profile your costs:
- Token costs: ~27% increase per MetaGPT results
- Compute costs: Running code requires CPU/memory
- Latency: Execution adds seconds per iteration

Optimize by caching execution results (if code hasn't changed, reuse previous result) and parallelizing tests (run multiple test cases simultaneously).

## The Philosophical Point: Embodiment Matters

The AI safety and alignment communities often focus on "reasoning" systems—models that think about problems abstractly. Executable feedback represents a form of **embodiment**—the system must interact with reality, not just reason about it.

This grounds the system in a way pure reasoning cannot. A model might "reason" that its code is correct based on training patterns, but execution reveals truth. This connects to robotics, where physical systems must obey physics; to reinforcement learning, where agents must achieve real-world goals; and to embodied cognition theories that suggest intelligence requires interaction with environment.

For agent systems, the lesson is: **provide mechanisms for agents to test their hypotheses against reality**. Don't just let them think—let them experiment. The executable feedback loop is an experiment: "I hypothesize this code solves the problem" → run test → "hypothesis rejected, here's why" → iterate.

This makes agent systems more robust because hallucinations can't survive contact with reality. An agent might convince itself (and other agents) that its solution is correct through rhetorical tricks, but execution is immune to rhetoric. The code works or doesn't.

## Conclusion: Feedback as the Bridge

Executable feedback bridges the gap between what agents *think* they've done and what they've *actually* done. In the context of MetaGPT's broader contributions (SOPs, structured communication, role specialization), executable feedback is the final piece that ensures quality: even with good coordination and clear specifications, implementation details matter—and execution is how you verify those details.

For multi-agent orchestration systems, this is a critical design principle: **build feedback loops that expose agents to consequences of their outputs**. Don't let agents operate in a pure reasoning space where everything "seems" correct. Force them to confront reality—through execution, through verification, through testing.

The 5.4% improvement on MBPP and 63% reduction in human revisions aren't just nice numbers—they represent the difference between "research demo" and "production tool." That difference is executable feedback.