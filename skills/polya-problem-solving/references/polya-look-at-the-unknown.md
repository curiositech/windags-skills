# Look at the Unknown: The Master Heuristic for Problem Decomposition

## The Single Most Powerful Move

In a book full of useful heuristics, one stands above all others in Polya's treatment. It appears in the "How to Solve It" list, in the dialogue of Part II, and as the organizing center of the dictionary entry on "Look at the Unknown." It is this:

> **Look at the unknown! And try to think of a familiar problem having the same or a similar unknown.**

This is Polya's master heuristic for problem-solving. Understanding why it works — and how to implement it correctly — is one of the most valuable things an intelligent system can do.

---

## Why the Unknown, Not the Data?

Most naive problem-solvers begin with the data. They survey what they have been given and ask: "What can I do with this?" This is the wrong direction. As Polya observes, starting from the data generates an enormous, unfocused search through prior knowledge. Almost anything might be "related" to the data in some sense.

Starting from the unknown focuses the search: "What kind of thing do I need to produce? What operations produce things of that kind? What problems have I solved that produced the same kind of thing?"

Polya explains: "Looking at the unknown, we restrict our choice; we take into consideration only such problems as have the same unknown. And, of course, among the problems having the same unknown, we consider first those which are the most elementary and the most familiar to us" (p. 123).

The unknown defines the *type* of the answer required. Types are the critical constraint. A problem requiring a length has a different family of relevant prior solutions than one requiring an area or an angle or a probability.

---

## The Schematic View

Polya recommends a powerful representational practice: look at the problem *schematically*, attending only to the unknown:

```
"Given . . . . . . . . . . find the length of the line."
"Given . . . . . . . . . . find the angle."
"Given . . . . . . . . . . find the volume of the tetrahedron."
"Given . . . . . . . . . . find the point."
```

The dots obscure the data entirely. This is not intellectual sloppiness — it is a deliberate cognitive move to focus attention on the structural type of the answer. Once you know what *type* of thing you need, you can ask: what is the simplest, most familiar way I know to produce a thing of this type?

For problems to prove (rather than find), the analogous heuristic is: **Look at the conclusion!** The schematic becomes:

```
"If . . . . . . . . . . then the angles are equal."
"If . . . . . . . . . . then the triangles are congruent."
```

---

## The Four Standard Unknown-Types in Elementary Mathematics

Polya provides a beautiful example of how attending to the unknown type immediately generates a plan skeleton:

**(1) Given . . . find the length of a line.**
"The unknown should be obtained as a side of some triangle. It remains to introduce a suitable triangle with three known, or easily obtainable, constituents" (p. 124).

**(2) Given . . . find the angle.**
"The unknown should be obtained as an angle in some triangle. It remains to introduce a suitable triangle" (p. 124).

**(3) Given . . . find the volume of the tetrahedron.**
"The unknown can be obtained if the area of the base and the length of the altitude are known. It remains to find the area of a face and the corresponding altitude" (p. 124).

**(4) Given . . . construct the point.**
"The unknown should be obtained as the intersection of two loci each of which is either a circle or a straight line. It remains to disentangle such loci from the proposed condition" (p. 124).

Each of these is a *plan skeleton* — a partially specified solution strategy that becomes fully specified once the data and conditions are examined. The unknown type gives you the skeleton; the data and conditions give you the flesh.

---

## Mobilizing Prior Knowledge

The question "Look at the unknown" is, at its deepest level, a question about memory and prior knowledge. Polya writes: "Good ideas are based on past experience and formerly acquired knowledge. Mere remembering is not enough for a good idea, but we cannot have any good idea without recollecting some pertinent facts" (p. 9).

The problem-solving process involves what Polya calls *mobilization* and *organization*: activating relevant prior knowledge and combining it into a structure adapted to the current problem. "Look at the unknown" is the key that unlocks mobilization — it gives memory a specific target to search for.

The sequence is:
1. Identify the unknown (its type and characteristics)
2. Search memory for problems with the same or similar unknown
3. Find the most elementary, most familiar match
4. Ask: "Here is a problem related to yours and solved before. Could you use it?"
5. If yes, ask: "Should I introduce some auxiliary element to make its use possible?"

---

## The Difference Between Known and Unknown Unknowns

Polya makes a critical distinction that has profound implications for agent system design:

> "To know or not to know a formerly solved problem with the same unknown may make all the difference between an easy and a difficult problem" (p. 126).

When Archimedes computed the surface area of a sphere, there was no prior solution with the same unknown. He had to invent the approach from scratch — "one of the most notable mathematical achievements" (p. 125). When a student computes the surface area of a sphere today, they just apply Archimedes' result. The problem is now trivial.

This asymmetry is fundamental. **The difficulty of a problem is not inherent — it depends on what relevant prior solutions are accessible.** An agent with a rich, well-organized library of prior solutions can solve problems that would be impossibly hard for an agent with no such library.

The implication: building and maintaining a well-organized library of "solved problems indexed by unknown type" is not merely useful — it is the primary driver of problem-solving capability growth.

---

## When the Unknown Type Has No Match

What happens when no prior solution with the same unknown can be found? Polya recommends falling back to *similar* unknowns:

> "If we are unable to find a formerly solved problem having the same unknown as the problem before us, we try to find one having a *similar* unknown. Problems of the latter kind are less closely related to the problem before us... and therefore less easy to use for our purpose in general, but they may be valuable guides nevertheless" (p. 127).

Archimedes, lacking a solved problem with "surface area of a sphere" as the unknown, worked with the nearest similar unknowns he had: lateral surfaces of cylinders, cones, and frustums. These approximating surfaces became the scaffolding for his construction.

**The hierarchy of search when looking at the unknown:**
1. Exact match: prior problem with identical unknown type
2. Near match: prior problem with structurally similar unknown
3. Analogy: prior problem in a simpler or lower-dimensional analogous domain
4. Construction: invent a new auxiliary problem whose unknown is a stepping stone to the original

---

## Connection to Auxiliary Elements

A critical link: when you find a related problem with the same unknown and want to use it, you often need to introduce *auxiliary elements* to make the connection possible.

Polya's canonical example: you need to find the length of a diagonal of a rectangular parallelepiped (3D). You recall that you can find the side of a right triangle. But there's no triangle in your figure. So you *introduce* one — an auxiliary right triangle whose hypotenuse is the desired diagonal. Then another auxiliary right triangle to find the other leg. The auxiliary elements bridge the gap between the unknown you need and the problem type you know.

> "Should you introduce some auxiliary element in order to make its use possible?" (p. 8)

The introduction of auxiliary elements is not arbitrary — it is *motivated* by the desire to use a specific related problem. The related problem (identified by unknown type) specifies *what kind* of auxiliary element to introduce.

---

## Application to Agent Task Decomposition

For an AI agent system, "Look at the unknown" translates directly into a decomposition strategy:

**Step 1: Characterize the unknown.**
Before invoking any skill or tool, the agent should ask: what is the type and structure of the output required? What are its key properties? What constraints does it satisfy?

**Step 2: Search the skill library by output type.**
Skills can be indexed not just by their names but by the *type of output they produce*. A task requiring "a working implementation of X" maps to a different set of skills than "an explanation of X" or "a test suite for X."

**Step 3: Find the most relevant prior pattern.**
Which skill or skill sequence has produced outputs of the required type in similar contexts? What was the structure of successful solutions in those cases?

**Step 4: Identify the gap and introduce auxiliaries.**
What intermediate outputs (auxiliary unknowns) are needed to bridge from current inputs to the required output type? These become the sub-tasks of the decomposition.

**Step 5: Check that the decomposition uses all data.**
"Did you use all the data?" — After decomposing into sub-tasks, verify that every piece of available information has been assigned to some sub-task. Missing data usually signals a missing subtask.

---

## The Companion Question: Did You Use All the Data?

Polya pairs "Look at the unknown" with a companion check that catches a different kind of error: "Did you use all the data? Did you use the whole condition?" (p. 8).

These questions serve two functions:

1. **During planning**: If part of the data hasn't been connected to the unknown, the plan is incomplete. There is a missing link that needs to be found.

2. **During verification**: If the final answer doesn't depend on some datum that was supposed to be essential, either the datum is redundant (possible) or an error was made in derivation (more likely).

Polya illustrates this beautifully in the parallelepiped problem: a student finds the diagonal of a face (y² = a² + b²) but then gets stuck. The teacher asks "Did you use all the data?" The student notices that c (the height) hasn't appeared in the expression. This signals that a second step is needed — another right triangle involving c. The unused datum points directly to the missing step.

**Agent implication**: After constructing a decomposition plan, audit it: does every input/datum appear in at least one subtask? Does the output of every subtask feed into the final result? Gaps in either direction indicate structural incompleteness.

---

## Summary: The Unknown as Navigation System

The "Look at the unknown" heuristic works because it transforms a vague, open-ended search ("what should I do?") into a targeted retrieval ("what have I done before when I needed to produce something like this?"). It is a navigation system that orients the problem-solver toward relevant prior knowledge.

In a system with 180+ skills, this principle is critical. The challenge is not that there are too few capabilities — it is that there are too many, and activating the right ones requires a principled selection mechanism. "Look at the unknown" provides that mechanism: characterize the output type, search by output type, select the most elementary relevant match, bridge gaps with auxiliary steps.

The quality of a problem-solving system depends critically on:
1. The richness of its indexed solution library
2. The precision with which unknowns can be characterized
3. The ability to introduce auxiliary elements that bridge gaps

All three of these are areas where deliberate design and maintenance compound over time.