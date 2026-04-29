# Decomposing and Recombining: The Cognitive Architecture of Problem Structure

## The Core Operation

Almost every non-trivial problem-solving move Polya describes comes down to a two-phase operation: *decomposition* (breaking the whole into parts for individual examination) and *recombination* (assembling parts into a new whole better adapted to the problem). Together these form the engine of productive thinking.

> "You examine an object that touches your interest or challenges your curiosity... You decompose the whole into its parts, and you recombine the parts into a more or less different whole" (p. 104).

This description applies equally to problems (what you are trying to solve), to solutions (the arguments you construct), and to the knowledge base (the previously solved problems and theorems you bring to bear).

---

## The Danger of Premature Decomposition

Polya issues an early warning that applies directly to agent systems:

> "If you go into detail you may lose yourself in details. Too many or too minute particulars are a burden on the mind. They may prevent you from giving sufficient attention to the main point, or even from seeing the main point at all. Think of the man who cannot see the forest for the trees" (p. 105).

The correct order is not "decompose first, then understand." It is "understand the whole, then identify which details deserve examination, then decompose selectively."

The practical sequence:
1. Understand the problem as a whole — its aim, its main point
2. Identify which parts are most likely essential
3. Examine those parts in detail
4. Proceed to finer detail only as necessary

> "Let us, first of all, understand the problem as a whole... Let us go into detail and decompose the problem gradually, but not further than we need to" (p. 105).

This "lazy decomposition" principle — decompose only as far as necessary, not as far as possible — is important. Maximal decomposition is often counterproductive, destroying the structural relationships that make the problem tractable.

---

## The Principal Parts of a Problem

Every problem has *principal parts* — the elements that must be explicitly identified before decomposition can proceed intelligently.

For **problems to find**:
- **The unknown**: What must be produced or determined?
- **The data**: What is given or available?
- **The condition**: What constraints link the unknown to the data?

For **problems to prove**:
- **The hypothesis**: What is assumed?
- **The conclusion**: What must be established?

These are not interchangeable. You cannot treat the unknown as if it were data, or the condition as if it were the unknown. Understanding the role of each principal part is prerequisite to intelligent decomposition.

Polya's key questions always target the principal parts first:
> "What is the unknown? What are the data? What is the condition?" (p. 3)
> "What is the hypothesis? What is the conclusion?" (p. 157)

---

## The Three-Way Classification of Decomposition Strategies

Polya provides a formal classification of how new problems can be generated from old ones by selective preservation and change of principal parts:

**Strategy 1: Keep the unknown, change data and conditions.**
This generates problems with the same output type. The "Look at the Unknown" heuristic exploits this: familiar problems with the same unknown often have relevant methods or results that transfer.

> "Keeping the unknown, we try to keep also some data and some part of the condition, and to change, as little as feasible, only one or two data and a small part of the condition" (p. 106).

The minimal-change version of this: keep the unknown and keep *part* of the condition, dropping the other part. This relaxes the constraint and makes the problem easier while preserving its character.

**Strategy 2: Keep the data, change the unknown.**
This generates stepping-stone problems. You look for something that can be derived from the available data and will be useful in finding the original unknown.

> "The new unknown should be both accessible and useful... If nothing better presents itself, it is not unreasonable to derive something from the data that has some chance of being useful" (p. 107).

This is the "Could you derive something useful from the data?" heuristic. The stepping stone is a new unknown that is (1) obtainable from the current data and (2) useful in obtaining the original unknown.

**Strategy 3: Change both unknown and data.**
More radical, and used when more conservative variations have failed. One important special case: interchange the unknown with one of the data.

> "An interesting way of changing both the unknown and the data is interchanging the unknown with one of the data" (p. 108).

This generates problems where what was sought becomes given and what was given becomes sought — often a productive transformation.

---

## Separating the Parts of the Condition

One of the most practically important decomposition moves is: **separate the various parts of the condition**. When the condition is compound (has multiple clauses), examining each clause independently often reveals structure that is invisible when the condition is treated as a whole.

The square-inscription problem (section 18) illustrates this beautifully:
- The condition has four parts: each vertex on a specific side
- Drop all but one vertex constraint → the square can vary freely, the unconstrained vertex describes a *locus*
- Drop all but two vertex constraints → the locus is further constrained
- The full problem: find the intersection of loci derived from the parts of the condition

The general principle: **when you drop part of the condition, the unknown goes from fully determined to partially free**. The range of variation of the unknown under the partial condition is itself a geometrically or structurally meaningful object (a locus, a set, a region). The intersection of such objects under different partial conditions gives the solution of the full problem.

Polya notes: "Even if the unknown is not a mathematical object... it may be useful to consider, to characterize, to describe, or to list those objects which satisfy a certain part of the condition imposed upon the unknown by the proposed problem" (p. 109).

---

## Defining Terms: The Hidden Decomposition

Going back to the definition of a technical term is a form of decomposition that is easy to overlook. When a problem involves a derived notion (parabola, sphere, isosceles triangle), the definition of that notion encodes relationships that must be introduced into the problem's structure.

Polya's example: "Construct the point of intersection of a given straight line and a parabola of which the focus and the directrix are given."

The word "parabola" is intimidating. But applying the definition — "the locus of points equidistant from the focus and directrix" — transforms the problem into: "Construct a point P on the line such that PF = PQ" (where F is the focus and Q the foot of the perpendicular to the directrix). The technical term has been *deflated* into a direct geometric condition.

> "The typical procedure: We introduce suitable elements into the conception of the problem. On the basis of the definition, we establish relations between the elements we introduced. If these relations express completely the meaning, we have used the definition. Having used its definition, we have eliminated the technical term" (p. 97).

This is critical for agent systems: when a task involves technical terms, jargon, or domain concepts, the first decomposition move should be to apply the definitions of those terms. This replaces opaque vocabulary with transparent relationships.

**The deeper principle**: words have no explanatory power in themselves. Power resides in the facts they reference. "Going back to definitions" is the operation of looking through words to the facts that make them meaningful.

---

## Notation as Cognitive Infrastructure

Decomposition and recombination are enormously aided by good notation. Polya devotes substantial attention to notation because it is not cosmetic — it is a cognitive tool that determines what relationships are visible.

The key properties of good notation:
1. **Unambiguous**: The same symbol never denotes two different objects in the same inquiry
2. **Pregnant**: The notation expresses the relationships among objects, not just their names
3. **Mnemonic**: The signs remind you of the objects and vice versa
4. **Ordered**: The order and connection of signs suggests the order and connection of things

The most powerful feature: **notation can exploit second meanings** — the connotations that symbols acquire from their history of use. Letters at the beginning of the alphabet (a, b, c) suggest constants; letters at the end (x, y, z) suggest variables. Roman capitals suggest points, small letters lines, Greek letters angles. When notation is chosen consistently with these conventions, the relationships become visible at a glance rather than requiring explicit reconstruction.

> "A good sign should be easy to remember and easy to recognize; the sign should immediately remind us of the object and the object of the sign" (p. 173).

---

## Symmetry: Decomposition's Structural Constraint

When a problem is symmetric — has interchangeable parts — the decomposition and recombination must respect this symmetry. Violating symmetry in the decomposition introduces spurious distinctions that contaminate the solution.

Polya's example: constructing a triangle given one angle (α), the altitude from its vertex, and the perimeter (p). When introducing p into the figure, attempts that treat the two equal sides differently (Figs. 9 and 10) "appear clumsy." The reason: "our problem is symmetric with respect to b and c. But b and c do not play the same role in our figures 9, 10; placing the length p we treated b and c differently; the figures 9 and 10 spoil the natural symmetry of the problem with respect to b and c" (p. 72).

The symmetric solution: place p so that b and c appear on opposite sides of the base, maintaining the natural symmetry. This forces the introduction of isosceles triangles — familiar, useful auxiliary elements.

> "Try to treat symmetrically what is symmetrical, and do not destroy wantonly any natural symmetry" (p. 204).

---

## Recombination: The Creative Phase

After decomposition comes recombination — finding a new whole that is better adapted to the problem. This is the creative step, and it is where difficulty lives.

Polya's honest assessment: "Difficult problems demand hidden, exceptional, original combinations, and the ingenuity of the problem-solver shows itself in the originality of the combination" (p. 105).

However, for simpler problems, "certain usual and relatively simple sorts of combinations, sufficient for simpler problems, which we should know thoroughly and try first" (p. 105) are usually adequate. The classification of strategies (keep unknown/change data, keep data/change unknown, change both) provides the systematic framework for generating candidate recombinations.

The insect returns: "An insect tries to escape through the windowpane, tries the same hopeless thing again and again, and does not try the next window which is open" (p. 209). The mouse tries different bars. The human systematically varies the approach. The difference is not effort — it is *systematic variation*.

---

## Application to Agent Task Architecture

**Task intake as principal-parts identification**: The first operation when an agent receives a task should be explicitly identifying the principal parts: What is the unknown (output type and specifications)? What are the data (inputs available)? What is the condition (constraints on the output)?

**Condition decomposition before skill selection**: Before routing to any skill, separate the condition into its parts and examine each independently. This reveals whether the task is a single-step or multi-step problem, and which constraints are the binding ones.

**Definition application as first decomposition**: When the task involves technical terms, immediately apply their definitions to transform opaque requirements into explicit structural conditions.

**Symmetry preservation**: In decomposing a task, respect any symmetries present in the original problem. Sub-tasks that break natural symmetry may introduce spurious distinctions and complicate recombination.

**Lazy decomposition**: Do not decompose maximally. Decompose until you can see the next productive step, then execute, then reassess. Over-decomposition can destroy the structural relationships that make the problem tractable.

**Notation standards**: The internal representation chosen for a complex task should exploit the "second meaning" principle — use established conventions that carry implicit relational information, rather than arbitrary identifiers that must be looked up.