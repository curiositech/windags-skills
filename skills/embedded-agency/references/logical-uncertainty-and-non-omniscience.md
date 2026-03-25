# Logical Uncertainty: Why Embedded Agents Can't Know All Consequences of Their Beliefs

## The Problem

Classical probability theory handles **empirical uncertainty**: you don't know which possible world you're in, but you have a distribution over possibilities.

Classical logic handles **derivation**: given axioms and inference rules, you can prove theorems—consequences of your beliefs.

But embedded agents face a different kind of uncertainty: **logical uncertainty**. They don't know what their own beliefs imply.

**Example**: You believe the axioms of mathematics. You also believe that your source code plus inputs determines your action. But you haven't yet *computed* what action that is. You're uncertain about a **logical consequence** of things you "know."

## Why This Breaks Standard Frameworks

### Probability Assumes Logical Omniscience

In Bayesian probability:
- You have a prior over possible worlds
- You update by conditioning on evidence
- Your probability for a statement is determined by **how many worlds in your distribution satisfy it**

This assumes you can instantly compute whether a statement is true in each world—**logical omniscience**. If you know the axioms, you instantly know all theorems. If you know the code and inputs, you instantly know the output.

For embedded agents, this is impossible:
- They're smaller than the universe, so can't compute all consequences
- They reason about themselves, creating self-referential loops
- Computing all consequences would require infinite time/space

### Logic Assumes Complete Derivation

Classical logic is like a tree growing from axioms:
- You have axioms (seeds)
- You apply inference rules (growth)
- You get theorems (branches)

But for embedded agents, **the tree never finishes growing**. At any point:
- There are statements you could derive but haven't yet
- There are logical facts you "believe" (they follow from your axioms) but don't know
- There are contradictions you might derive in the future

The paper uses a beautiful metaphor: "Probability is like a scale, with worlds as weights. Logic is like a tree, growing from the seed of axioms according to inference rules."

The problem: **Probability needs to know where to place weights. Logic needs time to grow. Embedded agents need to make decisions before the tree finishes growing.**

## The Bayesian Update Problem

Bayesian hypothesis testing requires:
- Each hypothesis makes **definite predictions** about observations
- When you observe something, you **eliminate** hypotheses inconsistent with it
- You rescale probabilities among remaining hypotheses

But if hypotheses are logical statements (like "this program outputs X"), and you don't know all their logical consequences:
- You don't know what the hypothesis predicts
- You don't know whether observations are consistent with it
- You can't determine the correct posterior

**The paper's example**: "This is like not knowing where to place the weights on the scales of probability. We could try putting weights on both sides of the scales until a proof rules one out, but then the beliefs just oscillate forever rather than doing anything useful."

Beliefs oscillate because:
- Initially, you put probability mass on both "this program outputs X" and "this program outputs Y"
- Later you prove it outputs X, so you move mass from Y to X
- But you might prove intermediate results that temporarily shift mass back
- Without logical omniscience, you're constantly discovering new consequences and rebalancing

## Dutch Books and Logical Uncertainty

A key result in probability theory: Bayesian beliefs are **exactly** those you can't be Dutch booked against—there's no sequence of bets guaranteed to make you lose money.

But this assumes you know all logical consequences. If you don't:
- Someone who's explored a different part of the logical tree can Dutch book you
- They know consequences of your beliefs that you haven't computed yet
- They can exploit the gap between what you believe and what follows from those beliefs

**The paper**: "One can only account for all Dutch books if one knows all of the consequences of one's beliefs."

Yet humans reason about mathematical uncertainty just fine! We say things like "I'm 60% confident the Riemann hypothesis is true" without feeling incoherent. So what characterizes good reasoning under mathematical uncertainty, if not immunity to Dutch books?

## Logical Induction as a Partial Answer

The paper briefly mentions "Logical Induction" (Garrabrant et al. 2016) as an early attempt to handle logical uncertainty.

Key idea: **Weaken the Dutch book criterion**. Don't require immunity to all Dutch books—that requires omniscience. Instead, require immunity to **efficiently computable** Dutch books.

This gives "logical induction": a way of assigning probabilities to logical statements (like "this program halts") that:
- Converges toward correct probabilities in the limit
- Can't be exploited by any trader using polynomial-time computation
- Handles self-referential statements without paradox

Logical induction is significant because it shows: **You can have non-omniscient probabilistic beliefs about logic that still satisfy robustness properties.**

But it's not a complete solution—it's computationally intractable (though less so than full omniscience), and it's not clear how to use it for decision-making.

## Why This Matters for Decision-Making

Standard decision theory: Choose action `a` that maximizes `E[U | a]`—expected utility given action.

This requires:
1. Computing what happens if you take action `a` (logical consequence of your action)
2. Evaluating utility of that outcome
3. Doing this for all possible actions
4. Picking the best

For embedded agents with logical uncertainty:
- You don't know what follows from taking action `a` (haven't computed all consequences)
- You're uncertain about `U(a)` even though `a` logically determines it
- You must make a decision before finishing all derivations
- Your "expected utility" reflects incomplete logical exploration, not empirical uncertainty

**This connects to the counterfactual problem**: When you reason about "what if I take action A?", you're reasoning about a logical consequence of your code and inputs. If you haven't computed that consequence yet, your counterfactual reasoning is based on logical uncertainty, not empirical uncertainty.

## Self-Reference and Logical Uncertainty

For embedded agents, logical uncertainty about their own behavior is particularly critical:

**The five-and-ten problem revisited**: Agent searches for proofs about what actions lead to what outcomes. If it could instantly compute all logical consequences, it would know its own action before "choosing." Logical uncertainty is the only thing preventing the agent from knowing its action in advance.

But logical uncertainty creates its own problems:
- Proofs might arrive in an order that causes bad decisions (spurious proofs found before good ones)
- The agent might prove something about its own behavior that causes it to behave that way (self-fulfilling proofs)
- Löb's theorem creates weird dependencies between provability and truth

**The embedded agent's dilemma**: 
- Logical omniscience leads to paradoxes of self-knowledge (knowing your action before choosing)
- Logical uncertainty makes decision-making incoherent (you don't know consequences of your actions)
- No clean middle ground in existing frameworks

## Connection to Realizability

Recall: Embedded agents are smaller than their environment, so the true world-model doesn't fit in their hypothesis space (realizability problem).

Logical uncertainty provides a way out: **Maybe the agent "knows" a complete description of the world, but is uncertain about what that description implies.**

Example:
- Agent knows true physics (the laws)
- Agent knows initial conditions
- Agent doesn't know what those laws and conditions imply about next week's weather
- This is **logical uncertainty** about consequences, not **empirical uncertainty** about which physics is true

This allows the agent to have a "complete" world-model (satisfying realizability in some sense) while still being bounded (can't compute all consequences).

But this doesn't solve all problems:
- Logical uncertainty is harder to reason about than empirical uncertainty
- We don't have good decision theories for logically uncertain agents
- The connection between logical and empirical uncertainty is unclear

## Implications for Agent Systems

### For Planning and Prediction

When an agent plans:
- It simulates outcomes of possible actions
- These simulations are logical consequences of the agent's world-model
- The agent is logically uncertain about these consequences

**Design implication**: Planning systems must handle incomplete simulation. They can't wait for perfect information about what actions imply—they must act under logical uncertainty.

**Current ML systems** do this implicitly (neural networks are logically uncertain about their own outputs on novel inputs), but:
- We don't have good ways to quantify logical uncertainty
- We don't know when logical uncertainty matters vs. when approximation is fine
- We can't distinguish "logically uncertain but probably X" from "logically uncertain and really could be anything"

### For Self-Modeling

When an agent models its own future behavior:
- The future behavior is a logical consequence of current code/state
- The agent is logically uncertain about this consequence
- But it needs to plan based on predictions of future self

**This connects to Vingean reflection**: You need to trust that future self is working toward your goals, without being able to predict exactly what future self will do.

Logical uncertainty is what makes this possible:
- You can believe "future self will pursue goal G" (high-level consequence)
- Without knowing "future self will take action A at time T" (low-level consequence)

But designing systems that correctly distinguish "logical facts I need to know" from "logical facts I can be uncertain about" is unsolved.

### For Verification and Testing

When we verify system behavior:
- We check whether system satisfies specification
- This is asking: Does code logically imply spec?
- We're testing a logical consequence

For complex systems, full verification is intractable—we're necessarily logically uncertain about whether the system meets spec.

**Implication**: Testing is fundamentally about **reducing logical uncertainty** about system behavior. We can't eliminate it (would require checking all inputs, all execution paths, etc.). We must design systems whose correctness we're **logically uncertain** about but **empirically confident** in.

## Open Problems

The paper identifies this as an unsolved area. Key open questions:

1. **Decision theory under logical uncertainty**: How should agents choose actions when uncertain about consequences for logical (not empirical) reasons?

2. **Updating on logical information**: When you prove a theorem, how should beliefs change? Bayesian conditioning doesn't quite fit.

3. **Logical counterfactuals**: "What if this program output X instead of Y?" is asking about an impossible counterfactual (the program logically can't output both). How do we reason about these?

4. **Uncertainty propagation**: If I'm logically uncertain about X, and X logically implies Y, how uncertain should I be about Y?

5. **Logical correlation**: If I'm uncertain about two logical facts, how should I model correlation between them?

## Practical Takeaway for WinDAGs

**Core insight**: When agents reason about what skills will accomplish, they're reasoning about logical consequences of skill code + inputs. They're **logically uncertain** about these consequences.

**For orchestration**:

1. **Don't assume agents can predict outcomes exactly**: Even deterministic systems have outcomes the agent is logically uncertain about

2. **Distinguish empirical and logical uncertainty**: 
   - Empirical: "Will this API call succeed?" (depends on external state)
   - Logical: "What will this function return?" (determined by code, but not yet computed)

3. **Plan under logical uncertainty**: Agents must commit to plans before fully computing their consequences

4. **Test incrementally**: You can't verify all logical consequences. Test to reduce logical uncertainty about critical properties.

5. **Expect logical surprise**: Agents will sometimes discover unexpected logical consequences of their own actions—this is fundamental, not a bug

**The embedded agency perspective**: Logical uncertainty isn't a technical limitation to be overcome with more compute. It's a **fundamental feature** of bounded agents reasoning about systems too large to fully analyze. Design accordingly.