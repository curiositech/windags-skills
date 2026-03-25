# Task Environment vs. Problem Space: The Representation Problem

## The Critical Distinction

Simon and Newell make a distinction that is **fundamental to understanding intelligent systems**: 

"We must distinguish between the task environment—the omniscient observer's way of describing the actual problem 'out there'—and the problem space—the way a particular subject represents the task in order to work on it" (p. 151).

The task environment is objective reality. The problem space is the internal representation an agent uses. **The same task environment admits many possible problem spaces, and the choice of representation determines whether the problem is trivial or intractable**.

## The Tennis Tournament Example

The authors provide a striking example:

"An elimination tournament, with 109 entries, has been organized by the local tennis club... How should the pairings be arranged to minimize the total number of individual matches that will have to be played? An obvious representation is the space of all possible 'trees' of matchings of 109 players—an entirely infeasible space to search" (p. 154).

This representation makes the problem look impossibly hard.

Alternative representation: "Consider an alternative space in which each node is a possible sequence of matches constituting the tournament... Since the tournament begins with 109 players, and since each match eliminates one player, there must be exactly 108 matches to eliminate all but one player—no matter which sequence we have chosen."

This representation makes the answer trivial: 108 matches, no search required.

**The "problem" was entirely an artifact of representation choice.**

## What This Means for Agent Orchestration

In a WinDAG system, tasks don't arrive with their problem spaces pre-defined. An agent receiving "optimize this database query" could represent it as:

- **Representation A**: Space of all possible query rewrite rules applied in all possible orders (combinatorial explosion)
- **Representation B**: Space of bottleneck types (table scan, missing index, inefficient join) mapped to resolution skills (infeasible search becomes constraint satisfaction)
- **Representation C**: Space of query execution plans with cost annotations (hill-climbing on cost metric)

These aren't just "different approaches"—they are **different problem spaces**. The agent literally "sees" different problems depending on representation.

## Adaptive Systems Reveal Environment Structure

"To the extent a system is adaptive, its behavior is determined by the demands of that task environment rather than by its own internal characteristics. Only when the environment stresses its capacities along some dimension—presses its performance to the limit—do we discover what those capabilities and limits are" (p. 149).

This has profound implications:

**When you observe an intelligent agent solving problems, you're mostly learning about the task environment's structure, not the agent's internal architecture.**

If all agents in a WinDAG system follow similar orchestration patterns for debugging tasks, that reveals:
1. The debugging task environment has strong structure
2. That structure constrains effective approaches
3. The agents are successfully adapting to that structure

The similarity of behavior indicates successful adaptation, not lack of diversity in design.

## The DONALD + GERALD Case Study

"If we look at the protocols of subjects who solve the problem, we find that they all substitute numbers for the letters in approximately the same sequence. First, they set T=0, then E=9 and R=7, then A=4 and L=8, then G=1, then N=6 and B=3, and finally O=2" (p. 150).

Why do all solvers follow the same sequence? Not because they have the same algorithm hardcoded, but because:

1. The task structure makes certain columns "most constrained" at each step
2. A serial processor with limited memory benefits from processing constrained columns first
3. This heuristic is discoverable from task structure + processing constraints

The problem space that emerges is "assignments in order of constraint strength"—a representation that maps naturally onto both the task structure and processing limitations.

## Implications for Skill Design

When designing skills for a WinDAG system, you're not just building capabilities—**you're shaping the problem spaces agents can construct**.

A skill like `analyze_dependencies` doesn't just "do something"—it offers a way to represent certain tasks:
- Tasks can be represented as dependency graphs
- Problems can be framed as "find the bottleneck node"
- Solutions become "path through graph avoiding bottleneck"

The skill creates a **representational affordance**.

## The Problem Space Construction Gap

Here's where the theory becomes incomplete—and where opportunity lies:

"Although we have been careful to distinguish between the task environment and the problem space, we have not emphasized how radical can be the differences among alternative problem spaces for representing the same problem" (p. 154).

"Critics of the problem-solving theory we have sketched above complain that it explains too little... More serious, it explains behavior only after the problem space has been postulated—it does not show how the problem solver constructs his problem space in a given task environment" (p. 154).

**The theory explains search within a problem space, but not the construction of the problem space itself.**

## Six Sources of Information for Space Construction

Simon and Newell identify six sources:

1. **Task instructions** - explicit description of elements and constraints
2. **Previous identical experience** - cached problem space retrieval
3. **Analogous task experience** - adaptation of related problem spaces
4. **General-purpose programs** - task-independent procedures (like means-ends analysis)
5. **Construction meta-programs** - procedures for building new spaces
6. **Information from solving** - incremental refinement during search

For WinDAGs:
- Source 1: Task descriptions and schemas
- Source 2: Caching successful orchestration patterns
- Source 3: Transfer learning across similar task types
- Source 4: Generic orchestration strategies (decompose, parallelize, sequence)
- Source 5: Meta-skills for skill composition and workflow generation
- Source 6: Adaptive re-planning based on intermediate results

## Design Principles for Multi-Representation Systems

**1. Don't force a single problem space on all tasks**

Different task types may benefit from radically different representations. A debugging task might use "hypothesis space", while an optimization task uses "parameter space", while a refactoring task uses "transformation space".

**2. Make representation choice explicit**

Orchestration should include a "space selection" phase where the agent commits to a representation. This makes failures debuggable—was the search strategy wrong, or was the problem space wrong?

**3. Provide representational primitives**

Skills should be designed to support construction of useful problem spaces:
- Dependency analysis skills → graph-based spaces
- Constraint checking skills → constraint-satisfaction spaces
- Metric evaluation skills → optimization spaces

**4. Enable representation switching**

Sometimes the initial problem space is wrong. Agents need the ability to recognize this and construct alternative spaces. "Progressive deepening" within a space is different from "problem space replacement".

**5. Learn from representation failures**

If an agent searches 10,000 nodes without progress, that's not just a search failure—it's a representation failure. The problem space was wrong for the task structure.

## Boundary Conditions

This distinction matters most when:
- Multiple valid representations exist
- Representations differ dramatically in tractability
- Task structure is exploitable but not obvious
- Agents have representation choice flexibility

It matters less when:
- Only one natural representation exists
- Task instructions fully specify the representation
- Exhaustive search is feasible anyway

## The Irreducible Core

"It is sometimes alleged that search in a well-defined problem space is not problem solving at all—that the real problem solving is over as soon as the problem space has been selected" (p. 154).

Simon and Newell refute this: "For the subjects do not find that all the problems become trivial as soon as they have solved the first one. On the contrary, the set of human behaviors we call 'problem solving' encompasses both the activities required to construct a problem space in the face of a new task environment, and the activities required to solve a particular problem in some problem space" (p. 154).

**Both are problem solving. Both require intelligence. An agent system needs both capabilities.**

The WinDAG system needs:
- Orchestration within chosen workflows (search in problem space)
- Workflow construction from skills (problem space construction)

Neither subsumes the other.