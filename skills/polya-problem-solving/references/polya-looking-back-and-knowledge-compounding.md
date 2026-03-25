# Looking Back: How Problem-Solving Compounds into Expertise

## The Neglected Phase

Polya is unambiguous: the Looking Back phase is the most neglected part of problem-solving, and its neglect is one of the most wasteful habits in intellectual work.

> "Even fairly good students, when they have obtained the solution of the problem and written down neatly the argument, shut their books and look for something else. Doing so, they miss an important and instructive phase of the work. By looking back at the completed solution, by reconsidering and reexamining the result and the path that led to it, they could consolidate their knowledge and develop their ability to solve problems" (p. 11).

The verb "consolidate" is key. Looking back is not repetition — it is *consolidation*. The same solution, reviewed with the questions Polya proposes, becomes integrated into a more organized knowledge structure. Without consolidation, each problem solved is an isolated event. With it, each problem solved becomes a building block.

---

## The Four Looking-Back Questions

**1. Can you check the result?**

The question is not "did you get an answer?" but "is the answer correct?" These are different. An answer can be produced without being correct.

Polya provides a rich taxonomy of checking strategies that go far beyond "repeat the calculation":

*Specialization*: Does the formula give the correct answer in known simple cases? If the formula for the volume of a frustum gives the correct answer when the upper base shrinks to zero (becoming a pyramid) and when the two bases are equal (becoming a prism), this is strong evidence of correctness.

*Dimensional analysis*: Does the dimensional structure of the result match what it should be? A formula for volume must have dimension (length)³, not (length)² or (length).

*Symmetry*: If the problem is symmetric in certain variables, is the result? The diagonal of a rectangular parallelepiped should be symmetric in a, b, and c — does your formula have this property?

*Variation*: If a positive parameter increases, does the result change in the expected direction? The diagonal should increase if any of a, b, c increases.

*Analogy*: Does the result have the form predicted by the analogous simpler problem? The 3D diagonal formula should be analogous to the 2D distance formula.

Each of these checks is a heuristic syllogism (a confirming instance increases credibility) rather than a proof. But passing many independent checks greatly increases confidence. "It is safe riding at two anchors" (p. 36).

**2. Can you check the argument?**

Checking the result and checking the argument are different operations. A result can sometimes be verified even when the argument that produced it is flawed. And an argument can be structurally sound while making a computational error at a late step.

Checking the argument focuses on the logical structure of the derivation: does each step follow validly from the premises? Are all the data and conditions used? Was any step justified by an assumption not explicitly stated?

A powerful checking strategy: "Did you use all the data? Did you use the whole condition?" If the result doesn't depend on some datum that was supposed to be essential, something is wrong — either in the derivation or in the problem statement.

**3. Can you derive the result differently?**

Two independent derivations of the same result provide much stronger evidence of correctness than one derivation alone. They also illuminate the result from different angles, deepening understanding.

> "We desire to convince ourselves of the validity of a theoretical result by two different derivations as we desire to perceive a material object through two different senses. Having found a proof, we wish to find another proof as we wish to touch an object after having seen it" (p. 36).

This question also motivates the search for simpler, more illuminating arguments. Often the first proof found is not the best:

> "Not entirely satisfied with our derivation of the result, we wish to improve it, to change it. Therefore, we study the result, trying to understand it better, to see some new aspect of it. We may succeed first in observing a new interpretation of a certain small part of the result" (p. 37).

The process of seeking a better argument often yields genuine new insights — new interpretations of sub-expressions, new structural relationships, new connections to other results.

**4. Can you use the result, or the method, for some other problem?**

This is the generative question — the one that transforms a solved problem into a productive resource.

> "Good problems and mushrooms of certain kinds have something in common; they grow in clusters. Having found one, you should look around; there is a good chance that there are some more quite near" (p. 65).

The specific ways to generate new problems from a solved one:

*Use the result directly*: Apply the formula or theorem to related problems. The diagonal formula applies immediately to finding the circumradius of a rectangular parallelepiped, the lateral edges of certain pyramids, distances in coordinate geometry.

*Use the method*: Apply the problem-solving technique to analogous problems. The technique of introducing auxiliary right triangles applies to many problems involving lengths in 3D.

*Vary the data systematically*: Keep the unknown, change the data; or keep the data, make one datum the unknown. The relation established by the solution can be exploited in multiple directions.

*Generalize*: What is the general principle of which this problem is a special case?

*Specialize*: What interesting special cases follow from the general result?

*Analogize*: What analogous problem in a different domain has a similar structure?

---

## Knowledge Organization Through Looking Back

The deep purpose of Looking Back is not just validation — it is the organization of knowledge for future use.

Polya describes two dangers for problem-solvers without good Looking-Back habits:

**Isolation**: Each problem solved remains separate, not connected to others. Knowledge is a bag of disconnected facts rather than a network of related insights. Retrieval is difficult because there is no structure to index into.

**Fragility**: Connections between facts are not reinforced by use. Facts learned are forgotten. The only antidote is the kind of active consolidation that Looking Back provides.

Looking Back builds the connections:
- This result is a special case of that general theorem
- This method is an application of that general principle  
- This problem is analogous to that simpler problem
- This formula reduces to that known formula as a parameter varies

These connections are what make knowledge *mobilizable* — accessible when a new problem calls for it.

---

## Testing by Multiple Angles: A Worked Example

Polya devotes an extended discussion in section 14 to demonstrating what substantive Looking Back looks like. After obtaining the diagonal formula for a rectangular parallelepiped:

```
x = √(a² + b² + c²)
```

He asks a series of checking questions, each exploiting a different structure:

1. "Did you use all the data? Do all data a, b, c appear in your formula?" — Yes, all three appear.

2. "Our problem is symmetric with respect to a, b, c. Is your formula symmetric?" — Yes, it is unchanged when a, b, c are permuted.

3. "Our problem is analogous to finding the diagonal of a rectangle. Is your result analogous to that result?" — Yes: the 2D formula x = √(a² + b²) extends naturally to 3D by adding c².

4. "If c decreases to 0, the parallelepiped becomes a parallelogram. Does your formula reduce to the 2D formula when c = 0?" — Yes.

5. "If c increases, the diagonal increases. Does your formula show this?" — Yes: ∂x/∂c > 0.

6. "If all dimensions are multiplied by 12, the diagonal should also multiply by 12. Does your formula show this?" — Yes: scale invariance holds.

> "An intelligent student cannot help being impressed by the fact that the formula passes so many tests. He was convinced before that the formula is correct because he derived it carefully. But now he is more convinced, and his gain in confidence comes from a different source; it is due to a sort of 'experimental evidence'" (p. 13).

The cumulative effect is not just increased confidence in this result — it is the acquisition of a *checking methodology* that can be applied to any formula in similar problems.

---

## The Euler Method: Checking Arguments by Using All Data

Polya's most elegant checking technique works for proofs as well as computational results: verify that every part of the hypothesis is actually used.

If a theorem has three essential hypothesis clauses, then each clause should appear at least once in the proof. If the proof seems to go through without using clause 3, something is wrong — either clause 3 is not actually essential (and the theorem is stronger than stated), or a step relying on clause 3 was implicitly assumed without acknowledgment.

This technique works because *a well-stated problem uses all its data*. Any data item that doesn't appear in the solution is either redundant (indicating the problem is imperfectly stated) or signals a gap in the argument.

The checking procedure: "Does the proof use the first part of the hypothesis? Where does it use it? Where does it use the second part? Where the third?" (p. 63).

---

## Indirect Proof and Looking Back

Polya's discussion of reductio ad absurdum contains a beautiful illustration of productive Looking Back. After finding a proof by contradiction, he asks: can the proof be reorganized?

The original proof started from an impossible assumption and derived a contradiction. On Looking Back, Polya extracts a positive, direct proof by identifying the elements of the reductio argument that are *unconditionally true* — independent of the false assumption. These elements are reorganized into a direct argument that proves the same result without the cognitive difficulties of reasoning from a false premise.

> "Looking back at the reasoning... we may perceive that this much is doubtless true: If a set of numbers with one or two digits is written so that each of the ten figures occurs just once, then the sum of the set is of the form 9(t+5). Thus, this sum is divisible by 9" (p. 186).

The contradiction came from the fact that 100 is not divisible by 9. The indirect proof is reorganized into: "the sum must be divisible by 9, but 100 is not, therefore the puzzle has no solution." The reductio structure disappears; the direct insight remains.

This is a model for productive Looking Back in formal reasoning: after finding a proof or argument by whatever means, seek a cleaner, more direct presentation that preserves the insight while dropping the scaffolding.

---

## Applications to Agent System Design

**Looking Back as a non-optional pipeline stage**: In any agent system pipeline, a structured validation and consolidation stage should be mandatory after task completion. This stage is not a single check — it is a multi-method review using at least two independent validation strategies.

**The validation strategy hierarchy**:
1. Specialization test: Does the result hold in the simplest, most accessible special cases?
2. Dimensional/type consistency: Does the output have the right structure/type/format?
3. Symmetry/invariance: Does the output respect symmetries present in the input?
4. Boundary behavior: Does the output behave correctly as inputs vary toward extreme values?
5. Analogical consistency: Does the output match the pattern expected from analogous simpler problems?

**Alternative derivation as robustness check**: For high-stakes outputs, the system should attempt at least one independent derivation or construction of the result. Convergence of two independent approaches provides much stronger confidence than any single approach alone.

**Generative exploitation**: After completing a task, the system should ask: what related tasks does this solution make accessible? What new capabilities has this solution demonstrated? What patterns from this solution should be indexed for future use?

**Knowledge indexing**: Completed solutions should be stored with metadata that enables future mobilization: output type, domain, method used, key structural features, analogy relationships. The investment in good indexing pays dividends every time a future problem activates a relevant stored solution.

**The "used all data" audit**: After completing a task, verify that every piece of provided information was incorporated. Missing data usually signals missing steps. Unused data in a well-stated problem is a red flag.

**Compounding**: The value of a good Looking-Back practice is not just the correctness of the current output — it is the compound return over many tasks. Systems that consolidate, organize, and index their solutions improve over time. Systems that treat each task as isolated do not.