# Selective Search as the Essence of Intelligence

## Core Principle

The fundamental insight of Simon and Newell's problem-solving theory is that **intelligence is not about processing speed or parallel computation—it is about knowing where to look**. A system that can examine the right 50 possibilities out of 10^100 will vastly outperform one that can examine a billion random possibilities per second.

"LT typically searched trees of 50 or so branches in constructing the more difficult proofs that it found. Obtaining by brute force the proofs it discovered by selective search would have meant examining enormous numbers of possibilities—10 raised to an exponent of hundreds or thousands" (p. 147).

## Why This Matters for Agent Systems

In a WinDAG orchestration system with 180+ skills, the combinatorial explosion is real. If each task could potentially invoke any of 10 skills in sequence for just 5 steps, you're looking at 10^5 = 100,000 possible paths. But most of those paths are nonsensical. The intelligence lies in:

1. **Recognizing structural constraints** that eliminate entire regions of the search space
2. **Using heuristics** that bias search toward productive areas
3. **Extracting information incrementally** to guide the next choice

An agent system that tries to "plan" by evaluating all possible skill sequences will fail. One that uses selective heuristics—"if debugging fails, check dependencies before trying more complex diagnostics"—can operate in reasonable time.

## The Tower of Hanoi Lesson

Simon and Newell use the Tower of Hanoi to make a crucial point: "If there are four discs, the problem space comprised of possible arrangements of discs on spindles contains only 3^4 = 81 nodes, yet the problem is nontrivial for human adults. The five-disc problem, though it admits only 243 arrangements, is very difficult for most people" (p. 151).

**The size of the problem space is almost irrelevant to difficulty**. What matters is the availability of information that guides selective search. A 100-node space with no structure is harder than a 10^20-node space with good heuristics.

For agent systems, this means:
- Don't optimize for "considering all options"
- Do optimize for "having good reasons to ignore most options"
- The cost of search is determined by selectivity, not space size

## Information as Constraint

"Structure is simply the antithesis of randomness, providing redundancy that can be used to predict the properties of parts of the space not yet visited from the properties of those already searched" (p. 151).

Every piece of information learned during search should **constrain subsequent choices**. In the DONALD + GERALD cryptarithmetic problem, once you determine D=5, you immediately get T=0 (from 5+5=10). This isn't just one fact leading to another—it's one fact eliminating thousands of possibilities in a single step.

For WinDAGs:
- After a skill executes, what did we learn about valid next steps?
- Which skills are now irrelevant given current state?
- What constraints can we propagate to simplify remaining choices?

## The Hill-Climbing Heuristic

"In climbing a (not too precipitous) hill, a good heuristic rule is always to go upward. If a particular spot is higher, reaching it probably represents progress toward the top. The time it takes to reach the top will depend on the height of the hill and its steepness, but not on its circumference or area—not on the size of the total problem space" (p. 152).

Simple heuristics that provide even weak guidance—"are we getting warmer?"—are often sufficient. The heuristic doesn't need to be perfect; it just needs to bias search toward productive regions more often than not.

For orchestration:
- "Errors decreasing" is a hill to climb
- "Code complexity reducing" is a hill to climb  
- "Test coverage increasing" is a hill to climb

These aren't perfect measures, but they provide **sufficient signal** for selective search.

## When Search Becomes Unnecessary

The tennis tournament problem reveals something profound: "Since the tournament begins with 109 players, and since each match eliminates one player, there must be exactly 108 matches to eliminate all but one player—no matter which sequence we have chosen. Hence, the minimum number of matches is 108, and any tree we select will contain exactly this number" (p. 154).

With the right representation, some problems require **zero search**. The answer is implicit in the problem structure itself.

This is the ultimate form of selectivity: recognizing when you don't need to search at all. For agent systems, this means:
- Some orchestration questions have answers determined by constraints alone
- "What's the minimum number of steps?" may be answerable without trying any sequence
- The right representation makes answers obvious

## Boundary Conditions

This theory applies when:
1. **Problem spaces are large** relative to serial processing speed
2. **Structure exists** to be exploited (not purely random spaces)
3. **Heuristics are available** or discoverable
4. **Processing is serial** or serial-equivalent (limited parallel capacity)

It does NOT explain:
- How heuristics are initially discovered or constructed
- Performance on genuinely random or structureless problems
- Massively parallel processing systems
- Situations where exhaustive search is feasible and optimal

## Design Implications for WinDAGs

**Don't**: Build routers that evaluate all possible skill sequences
**Do**: Build routers that quickly eliminate most sequences using cheap tests

**Don't**: Treat orchestration as optimization over a flat action space
**Do**: Recognize and exploit hierarchical structure and constraints

**Don't**: Measure intelligence by how many possibilities are considered
**Do**: Measure intelligence by how few possibilities need to be examined

**Don't**: Add more skills assuming "more options = better"
**Do**: Add skills that introduce new exploitable structure or constraints

The power of a 180-skill system isn't that it has 180 options—it's that skilled orchestration can ignore 170 of them immediately based on task structure.