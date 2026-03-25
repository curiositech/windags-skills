# Interval Algebra as a Reasoning Substrate: How to Choose the Right Ontological Primitive

## The Central Lesson

The choice of ontological primitive — the thing your system treats as the *irreducible atom* of a domain — determines everything that comes after. It determines which facts are easy to represent, which inferences are automatic, which queries are cheap, and which problems disappear entirely. Allen's 1983 paper on temporal intervals is a case study in making this choice correctly, and then building a complete computational machinery on top of it.

The domain is time. The naive choice of primitive is the *point* — a location on a number line. This is what most systems before Allen used. But Allen shows that points introduce deep problems that no amount of engineering can fix, and that switching to *intervals* as the primitive resolves those problems structurally, not by patching.

## Why Points Fail as Primitives

The fundamental problem with time points is the *boundary paradox*. Consider a light that is turned on at some moment. To represent the world changing, you need an interval when the light was off, followed by an interval when it was on. If these intervals are *open* (do not include their endpoints), then there exists a point between them where the light is neither on nor off — a semantic impossibility. If they are *closed* (include their endpoints), then there is a point where the light is both on and off — worse.

The standard engineering fix — "make intervals half-open, closed on the left and open on the right" — is purely conventional. It has no semantic grounding. As Allen notes: "The artificiality of this solution merely emphasizes that a model of time based on points on the real line does not correspond to our intuitive notion of time" (p. 834).

But there is a deeper reason to prefer intervals. Consider any event that appears instantaneous — "finding the letter," "flipping the switch." Look more closely and it decomposes: finding the letter is composed of "looking at the spot" and "recognizing it as the letter." Recognizing decomposes into a sequence of inferences. There seems to be no lower bound: "given an event, we can always 'turn up the magnification' and look at its structure" (p. 834). A time point, by definition, does not decompose. Therefore time points are never the *actual* referent of temporal language; they are a fiction that becomes increasingly inconvenient as reasoning becomes more complex.

The practical alternative: treat time points as *very small intervals* whose minimum duration is context-dependent. A historian may treat a day as a point; a computer engineer designing logic circuits treats a day as an eternity. The minimum duration below which an interval is treated as point-like "varies with the reasoning task" (p. 841). This is already a hint at the reference-interval mechanism to come.

## The Thirteen Relations: A Complete Algebra

Once intervals are primitive, something remarkable happens: you can enumerate, exhaustively and without overlap, every possible relationship between any two intervals. There are exactly 13:

| Relation | Symbol | Inverse | Picture |
|---|---|---|---|
| X before Y | < | > | XXX   YYY |
| X equals Y | = | = | XXXYYY (same) |
| X meets Y | m | mi | XXXYYY (touching) |
| X overlaps Y | o | oi | XXX↔YYY |
| X during Y | d | di | (X inside Y) |
| X starts Y | s | si | (X starts with Y) |
| X finishes Y | f | fi | (X ends with Y) |

This completeness is not trivial. It means that for any two intervals in your system, the uncertainty about their relationship can be represented as a *subset* of these 13 possibilities — no more, no less. The set of possible relations on any arc in the network is a well-defined mathematical object. When you learn new information, you *intersect* the constraint with the existing arc label, producing a smaller (or equal) set. The constraint can only decrease, never increase. This is the foundation of a monotone inference system.

The 13 relations are also *mutually exclusive* and *jointly exhaustive*. Mutual exclusivity means you cannot have ambiguity about what a single relation label means. Joint exhaustivity means no possible relationship between two intervals falls outside the system. This closure is what makes constraint propagation definable: there is a complete transitivity table (Allen's Figure 4, p. 836) giving, for any two relations r1 and r2, the set of possible relations that can hold between the outer endpoints when the middle relation is known.

## Application to Agent Systems: Choosing Your Domain Primitive

The direct lesson for intelligent agent systems is this: **before building any reasoning or coordination machinery, choose the right primitive for the domain you are modeling**.

For temporal reasoning, the primitive is the interval. For code reasoning, the primitive might be the *transformation* (a function from state to state) rather than the state itself. For task coordination, the primitive might be the *commitment* (a binding between an agent and an outcome) rather than the action. For dependency tracking, the primitive might be the *causal edge* rather than the node.

The practical test for whether you have the right primitive:

1. **Does it decompose naturally?** An interval decomposes into subintervals. A commit decomposes into sub-commits. If your primitive doesn't decompose, you'll need points, and you'll hit boundary paradoxes.

2. **Does it yield a finite, closed algebra of relationships?** Allen gets 13 interval relations. If your domain has a finite set of primitive relationship types between your atomic units, you can build a constraint propagation engine. If not, you're doing something harder.

3. **Does using it make certain inferences automatic?** The "during" relation between intervals allows facts to be inherited through the hierarchy without explicit reasoning. If your primitive choice makes certain inference patterns structural rather than computational, you've made a good choice.

4. **Does it match the granularity of what is actually knowable?** Allen's system is designed for knowledge that is *relative and imprecise*. A historian knows "the battle was during the war" but not the precise dates. If your primitive requires more precision than your agents can actually obtain, it will produce a system that is formally correct but practically useless.

## The Transitivity Table as a Complete Inference Specification

Allen's transitivity table (Figure 4) is not just a data structure — it is a *complete specification of what can be inferred from what*. For every ordered pair of relations (r1, r2), the table gives the set of relations T(r1, r2) that must hold between the outer endpoints. The constraint propagation algorithm uses this table to ensure that every arc in the network reflects everything knowable from the current set of facts.

This is a model for how agent systems should handle inference in any domain with compositional structure:

1. Define your primitives (intervals, tasks, agents, resources).
2. Define the complete set of binary relationships between them.
3. Build the transitivity table: what can you conclude about the relationship between A and C if you know A-to-B and B-to-C?
4. Implement constraint propagation: whenever you add a fact, update all affected arcs by intersecting with the computed constraint.

The result is a system where adding a new fact automatically makes available all its logical consequences within the scope of the network, without requiring a theorem prover or a search through rules.

## Boundary Conditions: When Interval Algebra Is Not Enough

Allen is explicit about the limits of his system:

- **Global inconsistency can go undetected.** The propagation algorithm guarantees consistency of every *three-node subnetwork*, but there exist globally inconsistent networks that look consistent when examined three nodes at a time (Allen's Figure 5). Full consistency checking requires exponential-time backtracking. The practical answer: use the cheap propagation for routine inference, and invoke the expensive consistency check only when needed.

- **The system cannot express cross-interval disjunctions.** You can say "A meets B, or A overlaps B" (a disjunction about the relationship between two specific intervals). You cannot say "(A meets B) OR (C before D)" (a disjunction about *different* interval pairs). This is a deliberate restriction that makes the algebra closed. If your domain requires cross-entity disjunctions, you need a different formalism.

- **The system does not reason about causation.** It can tell you that A occurred during B and B occurred before C, but it cannot tell you *why* or *whether* A caused B. Causal reasoning requires additional machinery (e.g., situation calculus, causal graphs).

For agent systems, these boundary conditions translate to design requirements: know what your interval-algebra-equivalent can and cannot represent, and have a fallback for the cases it cannot handle.