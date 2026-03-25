---
license: Apache-2.0
name: polya-problem-solving
description: 'Classic mathematical problem-solving methodology: understand, plan, execute, review'
category: Cognitive Science & Decision Making
tags:
  - problem-solving
  - heuristics
  - mathematics
  - methodology
  - strategy
---

# SKILL.md — How to Solve It (Polya)

license: Apache-2.0
```yaml
metadata:
  name: polya-problem-solving
  version: 1.0
  source: "How to Solve It: A New Aspect of Mathematical Method — G. Polya (1945/1957)"
  description: >
    Systematic heuristics for navigating hard problems: identifying the unknown,
    finding related problems, reasoning under uncertainty, and consolidating
    knowledge after solving. Applies across all domains where the path to
    solution is not immediately visible.
  activation_triggers:
    - "stuck on a hard problem with no clear path forward"
    - "need to decompose a complex task into tractable subproblems"
    - "unsure what the actual question is before starting work"
    - "finished a problem and need to extract generalizable lessons"
    - "reasoning under uncertainty about which approach to try"
    - "debugging a solution that keeps failing in non-obvious ways"
    - "designing a solution strategy before writing any code"
    - "problem seems too hard / too vague / too large"
```

---

## When to Load This Skill

Load this skill when:

- **The path is not obvious.** You know what the goal is but not how to get there.
- **You keep getting stuck in the same place.** Repeated failure on the same step suggests a missing heuristic.
- **The problem scope keeps shifting.** Polya's Understanding phase catches scope confusion early.
- **You're about to brute-force something that might have elegant structure.** Before iterating blindly, check whether a related, simpler problem solves this one.
- **You've just solved something and are moving on immediately.** That's exactly when Looking Back is being skipped.
- **You need to explain your reasoning process**, not just your answer — Polya gives you a vocabulary for the scaffolding, not just the result.

Do *not* load this skill when the problem is genuinely routine and the method is already known — Polya is for *finding* a path, not *walking* a known one.

---

## Core Mental Models

### 1. Four Phases — Each with Its Own Failure Mode

```
UNDERSTAND → PLAN → EXECUTE → REVIEW
```

Every non-trivial problem traverses these phases. The phases are not optional and cannot safely be reordered.

| Phase | Key Question | Characteristic Failure |
|-------|-------------|----------------------|
| Understand | What is unknown? What is given? What is the condition? | Rushing to plan before the problem is fully stated |
| Plan | Do I know a related problem? Can I reduce this? | Planning for the wrong problem; skipping to execution |
| Execute | Carry out the plan, checking each step | Executing a plan that was never validated against the problem |
| Review (Look Back) | Can I check the result? Can I use this elsewhere? | Skipping entirely; treating the solution as a closed event |

**The most common failure**: Understanding → Execution, skipping Planning entirely. This produces technically correct work that answers the wrong question.

---

### 2. The Unknown Is the Master Key

Before mobilizing any knowledge, **look at the unknown**. Not the data. Not the constraints. The unknown.

- What kind of thing is the answer? (A number? A function? A decision? A proof?)
- Have I seen a problem with this same *type* of unknown before?
- What would I need to know to produce something of that type?

This focuses all subsequent heuristic operations. It prevents the trap of drowning in data while the actual question goes unexamined. Almost every successful move in Polya's worked examples begins here.

---

### 3. If You Can't Solve It, Find a Related Problem You Can

Hard problems are hard because no direct path is visible. The solution is to find a stepping stone:

- **Generalize**: Solve a broader version (Inventor's Paradox — the more ambitious problem is often easier)
- **Specialize**: Try a simpler case first; extract the pattern
- **Analogize**: What is this problem like in a domain you know better?
- **Decompose**: Drop part of the condition; solve the relaxed problem; restore the condition
- **Introduce auxiliary elements**: Add a construction, variable, or intermediate result that didn't appear in the original problem

The **Inventor's Paradox**: A more general problem may be easier to solve than a specific one because it strips away misleading particulars and reveals the underlying structure.

---

### 4. Heuristic Reasoning Is Not Weak Reasoning

Polya distinguishes two modes:

| Mode | Nature | Role |
|------|--------|------|
| **Heuristic** | Provisional, plausible, directional | The *only* reasoning available before the answer is known |
| **Demonstrative** | Certain, complete, verifiable | What you write after the answer is found |

Heuristic reasoning is the scaffolding; demonstrative reasoning is the building. The danger is not using heuristic reasoning — it is either:
1. **Confusing heuristic with proof** (treating a plausible guess as established)
2. **Refusing to reason heuristically** (waiting for certainty before acting, which never comes)

A heuristic that leads to a wrong answer is not a failure — it is information. Follow the plausible path, but label it as provisional.

---

### 5. Looking Back Is Where Knowledge Compounds

After a solution is found, experts ask four questions:
1. **Verify**: Can I check this result independently?
2. **Illuminate**: Can I derive it differently? Can I see it at a glance?
3. **Generalize**: Can I use this method for other problems?
4. **Extend**: What new problems does this solution suggest?

Without Looking Back, each solved problem is an isolated event. With it, each solution cross-links to prior knowledge, creates transferable methods, and generates new productive questions. This is the difference between a solver who improves and one who merely completes tasks.

---

## Decision Frameworks

```
IF the problem is unclear or vague
→ Before doing anything: state the unknown explicitly.
  What type of thing is the answer? What are the given data?
  What is the condition connecting them?
  [Load: polya-four-phase-problem-solving.md]

IF you are stuck and don't know where to start
→ Look at the unknown. Ask: have I seen this type of unknown before?
  Try to recall a related problem and ask if its method transfers.
  [Load: polya-look-at-the-unknown.md]

IF the problem feels too hard or too large
→ Try auxiliary problems first: specialize, generalize, analogize.
  Consider the Inventor's Paradox — is the general version easier?
  [Load: polya-auxiliary-problems-and-stepping-stones.md]

IF you have a vague sense of the right direction but can't prove it
→ Proceed heuristically; label the reasoning as provisional.
  Follow the plausible path. Verify at the end, not before you start.
  [Load: polya-heuristic-vs-demonstrative-reasoning.md]

IF you need to restructure a complex problem
→ Decompose into parts, manipulate the parts, recombine.
  Look for structure in the problem itself, not just in your method.
  [Load: polya-decomposing-and-recombining.md]

IF you feel like you're making no progress despite effort
→ Distinguish mobilization (retrieving relevant knowledge) from
  organization (assembling it toward a plan). Check whether a
  "bright idea" is being waited for vs. actively constructed.
  [Load: polya-mobilization-organization-progress.md]

IF you have just solved a problem and are about to move on
→ Stop. Look back. Can you check it another way? Can you use
  the method elsewhere? What does this solution open up?
  [Load: polya-looking-back-and-knowledge-compounding.md]

IF you need to recognize whether you're making genuine progress
→ Learn the signs: subsymbolic sense of "getting warmer," 
  productive subproblems being resolved, structure becoming visible.
  [Load: polya-expert-intuition-and-signs-of-progress.md]
```

---

## Reference Files

| File | When to Load |
|------|-------------|
| `polya-four-phase-problem-solving.md` | When setting up any non-trivial problem; when a solution attempt keeps failing and you suspect the *process* is wrong, not just the method |
| `polya-look-at-the-unknown.md` | When stuck at the start; when you need to focus mobilization of prior knowledge on what actually matters |
| `polya-auxiliary-problems-and-stepping-stones.md` | When the problem is too hard for direct attack; when considering generalization, specialization, or analogy as reduction strategies |
| `polya-heuristic-vs-demonstrative-reasoning.md` | When uncertain whether to proceed with a provisional approach; when distinguishing "I think this is right" from "I can prove this is right" |
| `polya-decomposing-and-recombining.md` | When a problem has multi-part structure; when you need to isolate which component is causing failure |
| `polya-mobilization-organization-progress.md` | When effort isn't converting to progress; when you need to distinguish between retrieving relevant knowledge and assembling it into a plan |
| `polya-looking-back-and-knowledge-compounding.md` | After solving any significant problem; when the goal is not just solution but learning that transfers |
| `polya-expert-intuition-and-signs-of-progress.md` | When navigating under uncertainty; when trying to assess whether a current approach is worth continuing |

---

## Anti-Patterns

**The most common failures Polya warns against:**

1. **Understanding → Execution skip.** Moving directly from problem statement to work without a plan. Produces correct-looking work that answers the wrong question. *Test: can you state, in your own words, what the unknown is?*

2. **Drowning in the data.** Fixating on what is given rather than what is sought. The data are only valuable insofar as they constrain or illuminate the unknown. *Fix: always start from the unknown side, work backward toward the data.*

3. **Treating heuristic reasoning as shameful.** Refusing to follow a plausible path because it isn't proved. This produces paralysis. Heuristic reasoning is not a fallback — it is the *only* tool available before the answer is known.

4. **Confusing heuristic reasoning with proof.** The opposite failure: taking a plausible guess as established. Always label provisional reasoning explicitly. Verify after executing, not before planning.

5. **Skipping the Looking Back phase.** Treating a solved problem as closed. This is where expertise compounds. Without it, you are always starting from scratch.

6. **Attacking the hard problem directly and repeatedly.** If direct attack hasn't worked three times, the structure of the problem is telling you something. Find an auxiliary problem instead of increasing effort on the same approach.

7. **Waiting for the "bright idea."** Inspiration is real, but it rewards *organized preparation*, not passive waiting. Mobilize relevant knowledge, organize it deliberately, and the bright idea becomes more likely — it is not random.

---

## Shibboleths

*How to tell if someone has actually internalized Polya vs. merely read a summary:*

**They have internalized it if they:**

- Instinctively ask "what is the unknown?" before doing anything else — not as a ritual but as a genuine orienting move
- Treat a failed approach as *information about the problem's structure*, not just a wrong answer
- Reach for the *more general* problem when the specific one is stuck, rather than the simpler special case (Inventor's Paradox runs counter to naive intuition)
- Distinguish clearly between "I have a plausible reason to try this" and "I have established that this is correct" — and can work productively in the first state without pretending it's the second
- Pause after solving and ask what the method generalizes to, rather than immediately moving on
- Think in terms of *types of unknowns* — connecting a new problem to prior problems by structural similarity, not surface similarity

**They haven't internalized it if they:**
- Describe the Four Phases as a checklist to follow rather than a diagnostic for where a stuck process has gone wrong
- Think "Look at the unknown" means "re-read the problem statement"
- Treat "heuristic" as a synonym for "shortcut" or "approximation" rather than "provisional reasoning that may be upgraded to proof"
- Believe Looking Back is about checking your arithmetic
- Cannot distinguish a problem that is *hard* from a problem that is *stated unclearly* — Polya's first move is always to clarify the statement

---

*This skill is the entry point. When a reference file is needed, load it explicitly. The reference files contain worked examples, extended reasoning, and deeper treatment of each concept.*