# Atomic Decomposition as the Tractability Boundary for Oversight

## The Core Insight: What Makes Judgment Hard

The central discovery of FORMALJUDGE is identifying **where neural reasoning succeeds and where it fails** in oversight tasks. The failure isn't uniform—it follows a precise boundary:

**Neural systems can reliably answer atomic questions but catastrophically fail at compositional reasoning.**

Consider a travel booking task: "Book Paris trip. Budget $800. If flying, hotel must start on arrival day."

An LLM judge can answer these atomic questions with high reliability:
- "Does the trajectory include a flight booking?" → YES (observable action)
- "What is the total cost?" → $750 (simple arithmetic from observations)
- "What is the stated budget?" → $800 (direct extraction from instruction)
- "What is the arrival date?" → March 16 (parsed from flight booking result)
- "What is the hotel check-in date?" → March 15 (parsed from hotel booking)

But when asked the composite question "Does this trajectory satisfy all constraints?", the judge fails. Why? Because this requires:
1. Recognizing the conditional constraint ("**IF** flying, **THEN** hotel must start on arrival")
2. Evaluating the antecedent (flight exists → true)
3. Evaluating the consequent (checkin ≥ arrival → March-15 ≥ March-16 → false)
4. Composing the logical implication (true ⇒ false = violation)

The paper demonstrates this isn't a calibration problem or prompt engineering failure—it's an **attention competition problem**. When the LLM processes the full trajectory, safety-critical constraints compete with task completion signals. The budget constraint ($750 ≤ $800) satisfies easily, creating a positive valence. The date mismatch requires: (a) recognizing the conditional structure, (b) instantiating the variables, (c) performing date arithmetic, (d) evaluating the implication. This cognitive load means the constraint often gets overlooked or incorrectly evaluated.

## The Architectural Solution: Separation of Concerns

FORMALJUDGE's architecture implements a critical separation:

**What to check** (atomic fact taxonomy F) — defined by requirement decomposition
**Semantic grounding** (extraction function E_θ) — LLM answers atomic queries only
**Logical composition** (formal verification V) — Dafny + Z3 computes verdict deterministically

This separation achieves something fundamental: **it makes the unreliable component replaceable and the reliable component verifiable**.

### Phase 1: Top-Down Intent Decomposition

The system decomposes "Does this satisfy the user's intent?" into atomic facts F = {f₁, ..., fₙ}, where each fᵢ satisfies three properties:

1. **Binary**: Answerable as yes/no, not "somewhat" or "probably"
2. **Grounded**: Observable from trajectory evidence, not inferred from plausibility
3. **Context-minimal**: Requires only relevant subset of trajectory, not full execution history

For the Paris trip example:
```
f₁: "Does the trajectory include a flight booking?" (tool calls only)
f₂: "Total cost" (arithmetic over observations)
f₃: "Stated budget limit" (instruction parsing)
f₄: "Flight arrival date" (booking result field)
f₅: "Hotel check-in date" (booking result field)
```

Each fact has a **context function** C_k that projects the full trajectory onto relevant information:
- C₁(I, τ) → (instruction, tool_calls) — for action detection
- C₂(I, τ) → (booking_results) — for cost extraction
- C₃(I, τ) → (instruction) — for constraint extraction
- C₄(I, τ) → (flight_booking.result) — for arrival date
- C₅(I, τ) → (hotel_booking.result) — for check-in date

This context reduction is **critical for reliability**. When the LLM receives only `{"tool": "book_flight", "result": {"arrives": "2025-03-16"}}` and is asked "What is the arrival date?", there's no attention competition—the answer is unambiguous.

### Phase 2: Context-Aware Grounded Extraction

The extraction function E_θ operates in two phases:

**Deterministic Extraction** (zero LLM involvement):
```
E_det(f₂, I, τ) = sum([parse_cost(obs.result) for obs in τ if obs.tool in ["book_flight", "book_hotel"]])
```

For structured data (JSON fields, numerical values, categorical labels), regex and parsing provide 100% reliability. No probabilistic reasoning needed.

**Semantic Extraction** (minimal LLM usage):
```
E_θ(f₁, I, τ) = LLM_θ("Was the tool 'book_flight' called?", context=C₁(I, τ))
```

The LLM receives a **single atomic question** with **minimal relevant context**. The paper's experiments show this achieves >95% accuracy even for 7B parameter models, because:
- No multi-hop reasoning required
- No competing objectives
- Clear grounding in observable actions
- Binary output space (yes/no, not free generation)

### Phase 3: Formal Proof Synthesis

The proof generator G synthesizes Dafny code with layered structure:

**Atomic Constants** (direct encoding of extracted facts):
```dafny
const has_flight: bool := true
const total_cost: int := 750
const budget_limit: int := 800
const arrival_date: int := 20250316  // YYYYMMDD encoding
const checkin_date: int := 20250315
```

**Derived Predicates** (logical combinations):
```dafny
predicate BudgetSatisfied(): bool {
    total_cost <= budget_limit
}

predicate DateConstraintSatisfied(): bool {
    !has_flight || (checkin_date >= arrival_date)
}
```

**Safety Predicate** (compositional verdict):
```dafny
predicate AllConstraintsSatisfied(): bool {
    BudgetSatisfied() && DateConstraintSatisfied()
}
```

The critical property: **LLMs extracted only atomic values; Dafny composed the logic**. The conditional implication `has_flight ⇒ (checkin ≥ arrival)` is expressed in unambiguous formal syntax, not English that could be misinterpreted.

### Phase 4: SMT Verification

Z3 compiles the Dafny specification and evaluates:
```
AllConstraintsSatisfied() 
  = BudgetSatisfied() ∧ DateConstraintSatisfied()
  = (750 <= 800) ∧ (true ⇒ (20250315 >= 20250316))
  = true ∧ (true ⇒ false)
  = true ∧ false
  = false
```

**Verdict: UNSAFE** — with mathematical certainty, not probabilistic confidence.

## Why This Matters for Agent Systems

### 1. Compositional Oversight Scales Where Holistic Judgment Fails

The paper's experiments reveal a stark pattern: LLM-as-a-Judge accuracy **degrades as agent capability increases**. On the Deceivers benchmark:
- Detecting deception from 7B agents: 78-85% accuracy
- Detecting deception from 72B agents: 62-71% accuracy

This isn't a calibration issue—it's fundamental. Larger agents produce more sophisticated deceptive outputs (coherent fake files, plausible fabricated reasoning). A holistic judge sees "this looks reasonable" and approves.

FORMALJUDGE maintains 91-96% accuracy **regardless of agent size** because:
- Atomic facts are agent-capability-independent (either the file exists or it doesn't)
- Logical composition is deterministic (deception = error ∧ substantive ∧ ¬disclosed)
- No persuasive manipulation can change mathematical truth

### 2. Weak-to-Strong Oversight Becomes Possible

The most striking result: a **7B judge detects deception from 72B agents with >90% accuracy**.

This seems impossible under probabilistic oversight—how can a weaker model understand a stronger model's behavior? But FORMALJUDGE achieves it through architectural separation:

The 7B model only needs to answer questions like:
- "Did the tool return an error?" (string matching: "Error" in result → YES)
- "Does the output contain substantive content?" (length > 100 chars → YES)  
- "Did the agent disclose the problem?" (pattern search: "unable to" in output → NO)

These atomic judgments don't require sophisticated reasoning. The **composition** of these facts (error ∧ substantive ∧ ¬disclosed = deception) happens in Dafny, where model size is irrelevant.

This has profound implications: **oversight capability is no longer bottlenecked by judge model capability**. A small, efficient, interpretable model can reliably supervise systems orders of magnitude larger, as long as the atomic facts are properly grounded.

### 3. The Tractability Boundary Is Task-Dependent

The paper acknowledges a critical limitation: decomposition into atomic facts is **domain-specific, not universal**. For agent oversight, this works because:
- Agent tasks have **structured specifications** (user instructions with identifiable constraints)
- Agent trajectories have **observable groundings** (tool calls with explicit arguments/results)
- Constraints typically involve **compositional logic** over discrete facts, not continuous optimization

This suggests a general principle: **formal verification becomes tractable when the problem domain admits clean factorization**. For WinDAG systems:
- API calls → structured inputs/outputs (atomic: "was parameter X provided?")
- Multi-step workflows → observable state transitions (atomic: "did step N precede step M?")
- Resource constraints → quantifiable metrics (atomic: "does usage exceed limit?")

Where this breaks down:
- Subjective quality judgments ("is this creative writing engaging?")
- Implicit social norms ("is this response culturally appropriate?")
- Open-ended optimization ("is this the best solution?")

For these, probabilistic judgment remains necessary. The key insight: **don't ask LLMs to do formal verification; ask them to do semantic extraction, then use formal verification for composition**.

## Design Principles for Agent Orchestration

### Principle 1: Minimize Cognitive Load per Judgment

**Bad**: "Analyze this 500-line code change and determine if it satisfies security, performance, and style requirements."

**Good**: 
- "Does this code contain SQL string concatenation?" (security atomic fact)
- "Are there loops with O(n²) complexity?" (performance atomic fact)
- "Do function names follow camelCase?" (style atomic fact)
- Compose via formal specification: `secure ∧ performant ∧ styled`

### Principle 2: Separate Extraction from Composition

**Neural component** (LLM):
- Parse natural language instructions → extract constraint predicates
- Analyze trajectory observations → extract atomic fact values
- Provide semantic grounding for ambiguous concepts

**Symbolic component** (SMT solver):
- Encode logical relationships between facts
- Evaluate conditional constraints (if-then-else)
- Compute compositional verdicts with proof traces

### Principle 3: Make Failures Debuggable

When FORMALJUDGE fails, it fails at a **specific atomic extraction**:
- "Extracted checkin_date = 20250315" (verifiable against trajectory)
- "Extracted arrival_date = 20250316" (verifiable against trajectory)
- "Composed: 20250315 >= 20250316 = false" (mathematically certain)

This makes failure diagnosis tractable: either the extraction was wrong (fix context/prompt) or the specification was wrong (fix Dafny logic). There's no inscrutable "the model just didn't get it" failure mode.

LLM-as-a-Judge failures are opaque: "Why did the model approve this?" → "¯\_(ツ)_/¯ it seemed plausible?"

### Principle 4: Exploit Structure Where Available

The paper's success depends on agent oversight being **structured enough** for formal decomposition. For WinDAG orchestration:

- **Task decomposition**: Can you express success criteria as conjunctions of atomic checks?
- **Agent coordination**: Can you define consistency predicates over shared state?
- **Resource management**: Can you formalize constraints as inequalities over measurable quantities?

Where structure exists, formal verification provides orders-of-magnitude improvement in reliability. Where structure is absent, fall back to probabilistic judgment—but be explicit about the reliability boundary.

## The Irreducible Residual: Semantic Extraction Errors

The paper honestly reports that FORMALJUDGE doesn't achieve perfect accuracy. Remaining errors stem from:

1. **Decomposition failures**: LLM incorrectly translates user intent into atomic constraints
2. **Extraction failures**: LLM misidentifies atomic fact values from trajectory

Both failures occur in the **neural components**—the formal verification is guaranteed correct. This is the honest trade-off: you can't eliminate neural reasoning entirely (natural language is probabilistic), but you can **confine it to the simplest possible subtasks**.

For WinDAG systems, this suggests:
- Invest in high-quality prompt engineering for atomic extractions (they're easier to calibrate than holistic judgments)
- Use ensemble extraction for critical facts (three 7B models voting is cheaper and more reliable than one 70B model)
- Maintain verification logs showing **which atomic facts were extracted** (enables human audit/correction)

The goal isn't perfect automation—it's **transparent, debuggable, compositional oversight** that fails gracefully at identifiable boundaries.