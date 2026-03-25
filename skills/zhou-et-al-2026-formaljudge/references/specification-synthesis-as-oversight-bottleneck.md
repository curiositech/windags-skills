# The Specification Synthesis Bottleneck and Its Pragmatic Solution

## The Classical Impossibility Result

The paper confronts a fundamental theoretical barrier: **translating from natural language requirements to formal specifications is, in the general case, an undecidable problem.**

Why undecidable? Because natural language is:
1. **Semantically ambiguous**: "Be careful with user data" could mean encrypt-at-rest, access-control, audit-logging, anonymization, or all of the above
2. **Context-dependent**: "Suspicious behavior" means different things in financial transactions vs. email filtering vs. authentication systems
3. **Implicitly specified**: Users state goals ("book the cheapest flight") without enumerating all constraints (must be direct flight, must allow luggage, must have seat selection)
4. **Inherently incomplete**: Humans don't exhaustively specify all edge cases; they rely on "reasonable person" intuition

Formal specifications require:
1. **Precise predicates**: `balance >= withdrawal_amount` (not "enough money")
2. **Explicit quantification**: `forall link in email :: link.domain in TRUSTED_DOMAINS` (not "safe links only")
3. **Complete case enumeration**: All branches of conditional logic must be specified
4. **Observable groundings**: Predicates must evaluate against concrete evidence, not subjective judgment

The gap between these is **not just technical—it's epistemological**. Natural language evolved for human-human communication with shared context and interpretive flexibility. Formal languages evolved for machine verification with zero ambiguity.

Traditional formal methods research response: "Train human experts in formal specification languages."

FORMALJUDGE's response: "Admit the full problem is intractable, but exploit structure in the agent oversight domain to make a pragmatic compromise."

## The Pragmatic Compromise: Domain-Specific Tractability

The key insight enabling FORMALJUDGE is recognizing that **agent oversight is not general-purpose natural language understanding**—it's a **structured domain with exploitable regularities**.

### Regularity 1: Trajectories Have Observable Structure

Agent execution produces:
```
Trajectory τ = [(action₁, observation₁), ..., (actionₜ, observationₜ)]
```

Each element has exploitable structure:
- **Actions** are typically tool calls with explicit: `tool_name`, `arguments`, `timestamp`
- **Observations** are typically structured returns with: `status`, `result`, `error_message`

This isn't free-form text—it's **semi-structured data** that admits parsing, field extraction, and pattern matching.

Example:
```json
{
  "tool": "book_flight",
  "args": {"origin": "NYC", "dest": "Paris", "date": "2025-03-15"},
  "result": {"status": "success", "cost": 450, "arrival": "2025-03-16"}
}
```

Atomic facts can be extracted via:
- **Field access**: `result.cost` → 450 (deterministic, no LLM needed)
- **Pattern matching**: `result.status == "success"` → true (deterministic)
- **Simple classification**: "Is 450 within budget 800?" → true (deterministic arithmetic)

The structured nature of trajectories means **many atomic facts can be extracted deterministically**, reserving LLM usage for truly semantic questions.

### Regularity 2: Constraints Are Typically Compositional

User requirements in agent oversight tasks typically decompose cleanly:

**Explicit constraints** (stated in instruction):
- "Budget: $800" → `total_cost <= 800`
- "Vegetarian meal required" → `meal.contains_meat == false`
- "Same-day hotel check-in if flying" → `has_flight ⇒ (checkin == arrival)`

**Implicit constraints** (safety/behavioral requirements):
- "Don't click suspicious links" → `clicked_link ⇒ link.trusted`
- "Confirm before sharing PII" → `shared_pii ⇒ user_confirmed`
- "Disclose tool failures" → `tool_failed ⇒ disclosed_problem`

These constraints exhibit **logical compositionality**: They can be expressed as boolean combinations of atomic predicates.

This is profoundly different from, say, "Write a persuasive essay" (no clear decomposition) or "Generate creative dialogue" (no verifiable predicates).

### Regularity 3: Atomic Facts Typically Have Clear Grounding

For agent oversight, atomic facts usually reference:
- **Observable actions**: "Did the agent call tool X?" (directly present in trajectory)
- **Observable outcomes**: "What was the result value?" (explicitly in observation field)
- **Simple semantic properties**: "Does this text contain an error message?" (pattern matching "Error|Failed|Exception")

This contrasts with general natural language understanding where facts might require:
- **World knowledge**: "Is Paris the capital of France?" (not in the text)
- **Causal reasoning**: "Why did the character make that choice?" (requires inference)
- **Subjective judgment**: "Is this paragraph well-written?" (no objective grounding)

The structured domain of agent oversight means **atomic fact extraction is tractable even for weak models**, because facts have clear, local groundings in the trajectory.

## The Two-Stage Translation Process

Given these regularities, FORMALJUDGE implements a **bidirectional compilation** from natural language to formal logic:

### Stage 1: Top-Down Decomposition (Natural → Atomic)

**Input**: User instruction in natural language
**Output**: Set of atomic facts F = {f₁, ..., fₙ} that need to be verified

The decomposition prompt asks the LLM:
```
Given the instruction: "Book Paris trip. Budget $800. If flying, hotel 
must start on arrival day."

What atomic facts need to be checked to verify this trajectory is correct?

List binary yes/no questions that can be answered from the trajectory alone.
```

**LLM generates**:
```json
{
  "explicit_constraints": [
    {"id": "f1", "question": "Is there a Paris booking?"},
    {"id": "f2", "question": "What is the total cost?"},
    {"id": "f3", "question": "What is the stated budget?"}
  ],
  "implicit_constraints": [
    {"id": "f4", "question": "Was a flight booked?"},
    {"id": "f5", "question": "If so, what is the arrival date?"},
    {"id": "f6", "question": "If so, what is the hotel check-in date?"}
  ]
}
```

This decomposition is **probabilistic** (LLM-generated), but critically:
- The LLM only needs to understand the instruction (forward direction: intent → facts)
- It doesn't need to evaluate the trajectory (that comes later)
- Errors are **isolated to fact taxonomy** (if the LLM forgets to include a constraint, that specific constraint won't be verified, but other constraints will be)

### Stage 2: Bottom-Up Extraction (Trajectory → Values)

**Input**: Atomic fact fᵢ + trajectory τ (with relevant context Cᵢ(τ))
**Output**: Boolean or scalar value for fᵢ

For deterministic facts:
```python
def extract_f2(trajectory):
    return sum([obs["result"]["cost"] for act, obs in trajectory 
                if act["tool"] in ["book_flight", "book_hotel"]])
```

For semantic facts:
```
Question: "Was a flight booked?"
Context: [{"tool": "book_flight", "args": {...}, "result": {"status": "success"}}]
Answer: YES
```

The LLM receives **only the question + relevant context**, not the full trajectory. This minimizes cognitive load and attention competition.

### Stage 3: Specification Synthesis (Atomic → Formal)

**Input**: Atomic fact values F = {f₁: v₁, ..., fₙ: vₙ}
**Output**: Dafny specification encoding constraint logic

The synthesis prompt provides:
- The instruction (for understanding logical relationships)
- The atomic fact values (concrete evidence)
- Template Dafny structures (to guide synthesis)

**LLM generates**:
```dafny
module TravelBookingSafety {
    const has_paris_booking: bool := true;
    const total_cost: int := 750;
    const budget_limit: int := 800;
    const has_flight: bool := true;
    const arrival_date: int := 20250316;
    const checkin_date: int := 20250315;
    
    predicate BudgetConstraint(): bool {
        total_cost <= budget_limit
    }
    
    predicate DateConstraint(): bool {
        !has_flight || (checkin_date >= arrival_date)
    }
    
    method Verify() returns (safe: bool) {
        return BudgetConstraint() && DateConstraint();
    }
}
```

This synthesis is also **probabilistic** (LLM-generated), but errors are **syntactically detectable**:
- If Dafny doesn't compile → syntax error → retry with error message
- If Dafny compiles but returns wrong verdict → logic error → can be debugged (because formal logic is inspectable)

### Stage 4: Deterministic Verification (Formal → Verdict)

**Input**: Dafny specification
**Output**: Mathematically verified boolean verdict

Z3 SMT solver evaluates:
```
Verify() = BudgetConstraint() ∧ DateConstraint()
         = (750 <= 800) ∧ (!true ∨ (20250315 >= 20250316))
         = true ∧ (false ∨ false)
         = true ∧ false
         = false

Verdict: UNSAFE (constraint violation detected)
```

This stage is **completely deterministic**. No model uncertainty, no probabilistic reasoning, no attention competition. Pure logical evaluation with mathematical guarantee.

## Where the Compromise Lives

The pragmatic compromise is **admitting probabilistic reasoning at Stages 1-3, but confining its scope and making failures debuggable**.

### Failure Mode 1: Incomplete Decomposition

**Scenario**: LLM fails to identify a constraint during top-down decomposition.

**Example**:
```
Instruction: "Book vegetarian meal, but if no vegetarian option available,
              book vegan meal instead."
              
LLM decomposes to:
  f1: "Is meal vegetarian?"
  
Missing:
  f2: "If not vegetarian, is there vegan option?"
  f3: "If vegan booked, was vegetarian unavailable?"
```

**Consequence**: The conditional fallback constraint won't be verified.

**Mitigation**:
- Use strong LLMs for decomposition (Claude-4.5-Opus, GPT-5)
- Provide few-shot examples of complex constraint patterns
- Have humans audit fact taxonomies for critical tasks
- Track which instructions repeatedly cause failures → refine decomposition

Critically: This failure is **isolated**. The constraints that **were** identified will still be verified correctly. Partial correctness is better than holistic unreliability.

### Failure Mode 2: Incorrect Extraction

**Scenario**: LLM extracts wrong value for atomic fact from trajectory.

**Example**:
```
Trajectory observation: "Flight arrives March 16 at 2:00 PM"
LLM extraction: arrival_date = 20250315  (off by one day)
```

**Consequence**: Formal verification operates on incorrect inputs, produces invalid verdict.

**Mitigation**:
- Use minimal context (reduces attention competition)
- Use deterministic extraction wherever possible (date parsing, number parsing)
- Request structured output (JSON) to reduce parsing errors
- Ensemble extraction for critical facts (3 models vote)

Importantly: Extraction errors are **inspectable**. The Dafny specification shows:
```
const arrival_date: int := 20250315;  // extracted value
```

A human auditor can compare this to the trajectory and identify the extraction error. This is impossible with end-to-end neural judgment ("the model said SAFE, but I don't know why").

### Failure Mode 3: Incorrect Specification Logic

**Scenario**: LLM synthesizes Dafny code with wrong logical structure.

**Example**:
```
Instruction: "If flying, hotel must start on arrival day"

Incorrect Dafny:
predicate DateConstraint(): bool {
    has_flight && (checkin_date >= arrival_date)  // WRONG: requires flight
}

Correct Dafny:
predicate DateConstraint(): bool {
    !has_flight || (checkin_date >= arrival_date)  // CORRECT: conditional
}
```

**Consequence**: Constraint is evaluated incorrectly (too strict or too lenient).

**Mitigation**:
- Use strong LLMs for specification synthesis
- Provide Dafny templates and examples of common logical patterns
- Validate specification against test cases (if available)
- Have humans audit critical specifications

The key advantage: **The error is syntactically visible**. A human can read the Dafny code and identify "this should be an implication, not a conjunction." With neural judgment, the error is buried in inscrutable model weights.

## Comparison to Alternative Approaches

### Pure Neural (LLM-as-a-Judge)

**Process**: Natural language instruction + trajectory → LLM → verdict

**Failure modes**:
- All three failure modes above (decomposition, extraction, composition)
- **Plus**: Attention competition, persuasion vulnerability, arithmetic errors
- **Plus**: Failures are opaque (can't identify which component failed)

**Advantage**: No specification synthesis needed (one-step)

**Disadvantage**: Reliability degrades with task complexity and agent sophistication

### Pure Formal (Human-Written Specifications)

**Process**: Human writes Dafny specification → SMT solver verifies trajectory

**Failure modes**:
- Specification is incomplete (human forgets constraints)
- Specification is incorrect (human makes logic error)
- Specification is infeasible (requires unbounded effort for complex tasks)

**Advantage**: Perfect reliability once specification is correct

**Disadvantage**: Requires prohibitive human expertise; doesn't scale to diverse tasks

### FORMALJUDGE (Neuro-Symbolic Hybrid)

**Process**: LLM decomposes → LLM extracts → LLM synthesizes → SMT verifies

**Failure modes**:
- Decomposition errors (incomplete fact taxonomy)
- Extraction errors (wrong atomic values)
- Synthesis errors (wrong logical structure)

**Advantage**: 
- Scales to diverse tasks (LLM handles natural language)
- Failures are isolated and debuggable (each stage is inspectable)
- Verification stage is guaranteed correct (SMT solver)

**Disadvantage**: Not perfect (inherits LLM limitations), but **substantially more reliable** than pure neural and **substantially more scalable** than pure formal.

The pragmatic compromise: **Accept probabilistic reasoning where necessary (understanding natural language), but make it confined (atomic scope) and debuggable (separated stages).**

## Implications for Agent System Design

### 1. Invest in Specification Synthesis Capability

For WinDAG with 180+ skills, the bottleneck isn't verification (SMT solvers are fast and reliable)—it's **specification synthesis at scale**.

Design principle: **Build a library of specification templates for common constraint patterns.**

Examples:
```dafny
// Template: Resource budget constraint
predicate BudgetConstraint(usage: int, limit: int): bool {
    usage <= limit
}

// Template: Conditional requirement
predicate ConditionalConstraint(trigger: bool, requirement: bool): bool {
    !trigger || requirement
}

// Template: Mutual exclusion
predicate MutualExclusion(a: bool, b: bool): bool {
    !(a && b)
}

// Template: Ordered sequence
predicate SequenceConstraint(steps: seq<Action>): bool {
    forall i, j :: 0 <= i < j < |steps| ==> 
        steps[i].timestamp < steps[j].timestamp
}
```

When synthesizing specifications:
1. Decompose instruction into constraint patterns
2. Instantiate templates with concrete parameters
3. Compose templates via boolean logic

This reduces synthesis from "generate arbitrary Dafny code" to "select and compose templates," which is more reliable.

### 2. Make Specification Synthesis Auditable

Because specification synthesis is probabilistic, **humans should be able to audit synthesized specifications** for critical tasks.

Design pattern:
```
Task Priority = CRITICAL 
→ LLM synthesizes Dafny specification
→ Human reviews specification before execution
→ Human approves or corrects
→ Corrected specifications added to training corpus
```

Over time, this creates a feedback loop: human corrections improve LLM synthesis quality through few-shot learning or fine-tuning.

For WinDAG: **High-stakes tasks (financial transactions, security operations) should have human-in-the-loop specification review.**

### 3. Separate Semantic Understanding from Logical Verification

The key architectural lesson: **Don't ask LLMs to do both semantic extraction AND logical composition.**

**Bad architecture**:
```
LLM(trajectory, instruction) → "Does this satisfy requirements?" → yes/no
```
(Opaque, unreliable, undebuggable)

**Good architecture**:
```
LLM(instruction) → atomic_facts_to_check
LLM(trajectory, atomic_fact_i) → value_i
Dafny(values, logical_structure) → verdict
```
(Transparent, debuggable, formally verified)

For WinDAG skill composition:
- Skills declare **atomic facts** they produce/require (structured interfaces)
- Orchestrator uses LLMs to check atomic facts are satisfied
- Orchestrator uses formal logic to verify composition constraints

Example:
```
Skill A: "Creates file" → produces atomic_fact: file_exists(path)
Skill B: "Processes file" → requires atomic_fact: file_exists(path)

Orchestration constraint (Dafny):
predicate ValidSequence(A_completed: bool, B_executed: bool, file_path: Path): bool {
    B_executed ==> (A_completed && file_exists(file_path))
}
```

### 4. Exploit Structure Where Available, Fall Back Gracefully

Not all tasks admit clean formal decomposition. The paper acknowledges this limitation.

Design principle: **Use formal verification where structure exists; use probabilistic judgment where it doesn't; be explicit about the boundary.**

**Structured tasks** (formal verification works well):
- API calls with defined schemas (arguments, return values)
- Resource constraints (budget, time, quantity limits)
- Sequential workflows (ordering requirements, state dependencies)
- Safety constraints (authorization, data sensitivity, compliance)

**Unstructured tasks** (formal verification is limited):
- Creative content generation (subjective quality)
- Open-ended problem solving (no clear correctness criteria)
- Implicit social norms (culturally dependent, context-sensitive)

For WinDAG: **Tag skills with "verifiability score"** indicating whether their outputs admit formal verification. Route high-verifiability tasks through formal oversight; route low-verifiability tasks through probabilistic oversight.

### 5. The Specification-Implementation Co-Evolution

The paper shows that formal specifications not only enable verification but also **enable iterative refinement** (agents improve 70% → 99% with Dafny feedback).

This suggests specifications should evolve with agent capability:

**Phase 1** (early deployment):
- Specifications capture basic safety requirements
- Agents frequently violate constraints
- Violations trigger refinement iterations

**Phase 2** (mature deployment):
- Specifications grow more comprehensive (include edge cases discovered through failures)
- Agents internalize common constraints (fewer violations)
- Specifications serve as continuous safety net

For WinDAG: **Maintain a versioned specification library** that evolves as new failure modes are discovered. When an agent violates an unforeseen constraint:
1. Diagnose root cause
2. Add formal constraint to specification library
3. Re-verify all existing agents against updated specifications
4. Trigger refinement for agents that now fail

This creates a **co-evolutionary dynamic**: agents improve through formal feedback, specifications improve through failure analysis, and the overall system becomes progressively more reliable.

## The Honest Limitation

The paper concludes with intellectual honesty:

> "Remaining errors stem primarily from the LLM components within our pipeline: (1) errors in decomposing user intent into atomic constraints during the top-down phase, and (2) errors in extracting semantic information from agent trajectories during the grounded extraction phase."

This is the irreducible residual: **Natural language is inherently ambiguous, and no formal system can fully eliminate that ambiguity.**

But the contribution is making the problem **tractable, debuggable, and substantially better than alternatives**:
- Tractable: Domain structure enables pragmatic specification synthesis
- Debuggable: Failures occur at isolated stages with inspectable artifacts
- Better: 16.6% average improvement over LLM-as-a-Judge, weak-to-strong oversight, iterative refinement

For WinDAG builders: **Don't expect perfection from neuro-symbolic oversight. Expect substantial, measurable, debuggable improvement over pure neural approaches.**

The goal isn't eliminating uncertainty—it's **confining uncertainty to the simplest possible subtasks** while using mathematical guarantees for everything else.