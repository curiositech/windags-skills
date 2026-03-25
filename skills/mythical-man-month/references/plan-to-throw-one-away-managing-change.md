# Plan to Throw One Away: Managing Inevitable Change in Complex Systems

## The Pilot Plant Principle

Chemical engineers learned a hard lesson that software engineers keep relearning: **A process that works in the laboratory cannot be implemented in a factory in one step.**

The intermediate stage—the pilot plant—is not optional. It's where you discover what happens when you scale quantities, operate in non-laboratory conditions, encounter materials that aren't pure, and face failure modes that never occurred in controlled settings.

Programming, Brooks argues, has ignored this lesson to its peril. "Project after project designs a set of algorithms and then plunges into construction of customer-deliverable software on a schedule that demands delivery of the first thing built."

The result is universally the same: "In most projects, the first system built is barely usable. It may be too slow, too big, awkward to use, or all three."

## The Question Is Not Whether, But When

Brooks's radical framing: **"The management question is not whether to build a pilot system and throw it away. You will do that."**

The only question is: Will you **plan** to throw it away, or will you promise to **deliver** it to customers?

If you promise to deliver it:
- Users suffer with an awkward, slow, oversized system
- Builders are distracted during redesign by support demands
- The product acquires a bad reputation that the best redesign struggles to overcome

If you plan to discard it:
- You learn what's actually needed without the penalty of customer commitments
- You can redesign freely based on what you learned
- The delivered product reflects knowledge you didn't have at the start

**The first system is your education**. Why would you expect to graduate without attending school?

## Why You Can't Get It Right the First Time

Brooks identifies deep reasons why pilot systems are necessary, not signs of incompetence:

**1. The Problem Domain Isn't Fully Understood**
- User needs evolve as they interact with early versions
- Real workloads differ from imagined ones
- Edge cases emerge only during actual use
- Performance bottlenecks appear in unexpected places

**2. The Technology Isn't Fully Understood**
- What seemed fast in small tests is slow at scale
- What seemed simple in isolation is complex in integration
- APIs that looked clean turn out to have subtle constraints
- Failure modes that seemed unlikely turn out to be common

**3. The Team Isn't Fully Coordinated**
- Assumptions about interfaces turn out to be mismatched
- What seemed like the right decomposition reveals hidden dependencies
- Communication patterns that worked for planning break during implementation

**4. Requirements Change During Construction**
- Markets shift
- Competitors release new features
- Regulations change
- Technology platforms evolve

The pilot system is the forcing function that makes all this tacit knowledge explicit.

## The Only Constancy Is Change Itself

Having accepted that the first system will be thrown away, Brooks pushes further: **Change never stops. The delivered system must be designed for continuous evolution.**

"The first step is to accept the fact of change as a way of life, rather than an untoward and annoying exception."

This is harder than it sounds. Programmers, trained to think of programs as mathematical objects with stable specifications, resist the idea that software is **inherently fluid**. But Cosgrove's insight is correct: "The programmer delivers satisfaction of a user need rather than any tangible product." And needs change.

**What makes software especially vulnerable:**

1. **Invisibility**: There's no physical artifact constraining change. Hardware ships; changes require retooling. Software is weightless bits; changing it is "just" rewriting code.

2. **Tractability**: Software is the most flexible medium humans have ever worked with. This means users **know** you can change it, so they ask for changes.

3. **Obsolescence**: Technology platforms (languages, frameworks, hardware) evolve faster than application lifetimes, forcing adaptation.

The conclusion: **Design the system to accommodate change, not to resist it.**

## Techniques for Change-Resistant Design

Brooks enumerates specific practices (some now standard, some still aspirational):

**Modularization**
- Break the system into coherent pieces with narrow interfaces
- Each module should hide a design decision (Parnas's principle)
- Changes should ideally affect one module, not ripple across many

**Extensive Subroutining**
- Don't repeat code; factor out common patterns
- Changes to shared logic affect one place, not dozens

**Precise Interface Definitions**
- Document exactly what each module expects and provides
- Use type systems, contracts, or formal specs to make interfaces checkable

**High-Level Languages**
- Code in the most abstract, human-readable notation practical
- Lower-level details (register allocation, memory layout) should be abstracted away
- Changes are easier when you're manipulating concepts, not bits

**Table-Driven Techniques**
- Put variation in data, not code
- Changing a table entry is safer and faster than changing logic

**Self-Documenting Code**
- Merge documentation into the code itself so they can't diverge
- Use meaningful names, clear structure, and explanatory comments
- The code should tell you what it does; comments should tell you why

**Compile-Time Operations**
- Use macros, includes, and preprocessor facilities to centralize definitions
- A single source of truth for shared constants, interfaces, or protocols

**Versioning and Quantized Releases**
- Every product should have numbered versions
- Each version has a freeze date; changes go into the next version
- Don't allow continuous, untracked drift

## The Second-System Effect: When Experience Becomes Dangerous

Brooks warns of a specific failure mode: **"This second is the most dangerous system a man ever designs."**

Why? The first system taught you caution—you knew you didn't know, so you were disciplined. The second system tempts you with all the ideas you couldn't fit into the first one. The result: over-design, feature creep, solving yesterday's problems with excessive generality.

**OS/360 exemplified this:**

- The linkage editor offered a "culmination of overlay techniques"—in a system designed for dynamic allocation where overlays were obsolete
- TESTRAN provided batch debugging sophistication just as interactive debugging was emerging
- The scheduler was designed for fixed-batch workloads in an era of multiprogramming and remote job entry

Each was **technically excellent at solving the wrong problem**. They were extrapolations from prior systems that didn't account for changed assumptions.

**The remedy:**

1. **Self-awareness**: Know you're building a second system and guard against embellishment
2. **Functional budgets**: Assign each feature a cost (memory, time, complexity); reject features that exceed their budget
3. **Question assumptions**: Does this feature fit the new context, or is it fighting the last war?
4. **Senior architects**: Managers should "insist on a senior architect who has at least two systems under his belt" to avoid naive second-system traps

## Organizational Design for Change

Designing changeable systems isn't just a technical problem—it's an organizational one. Brooks offers specific structural advice:

**1. Reduce Role Conflict**
- Managers fear reporting problems will trigger premature action
- Separate "status meetings" from "action meetings"
- Make clear that status reporting is for education, not for intervention
- Reserve action for explicit problem-solving sessions

**2. Flexible Personnel Assignments**
- Keep senior people technically current, not just managerially busy
- Rotate people between implementation and architecture
- Maintain a "dual ladder" with equal prestige for technical and managerial tracks
- Never treat a move from management to coding as a demotion—accompany it with a raise

**3. Create Technical Cavalry**
- Keep a few top programmers unassigned to regular projects
- They're your rapid-response team for crises
- They can be dispatched wherever the battle is thickest

**4. Surgical Team Structure**
- Organize so that **small teams with minimal interfaces** own large subsystems
- When change is needed, reassign whole surgical teams, not individuals
- This minimizes the communication reorganization cost

**5. Documentation That Evolves With Code**
- Don't maintain separate spec documents and code
- Use self-documenting techniques where code IS documentation
- Changes to code automatically change documentation

## The Cost of Change: Two Steps Forward, One Step Back

Brooks presents sobering data: **Fixing a defect has a 20-50% chance of introducing another.**

Why? Because:
1. **Defects have nonlocal causes**: The symptom is local, the cause is systemic
2. **Fixers don't understand the whole**: Often a junior programmer fixes code written by someone else
3. **Regression is common**: Fixing one thing breaks another thing that depended on the "broken" behavior

The implication: **Program maintenance requires more testing per line of code than original development**. Every fix demands running the entire test suite to ensure nothing broke.

Lehman and Belady's studies show an even darker pattern: **entropy increases over time**. With each release:
- Total modules increase linearly
- Modules affected by changes increase exponentially
- Eventually, "each forward step is matched by a backward one"

The system becomes less and less well-ordered. "Although in principle usable forever, the system has worn out as a base for progress."

**C.S. Lewis's metaphor applies**: "Terrific energy is expended—civilizations are built up—excellent institutions devised; but each time something goes wrong. Some fatal flaw always brings the selfish and cruel people to the top, and then it all slides back into misery and ruin. In fact, the machine conks."

Software entropy is not preventable, only delayed. This is why planning to throw one away isn't defeatism—it's realism.

## Application to Agent Systems: Change Is the Default State

For multi-agent orchestration systems with 180 skills, change is not an edge case—**it's the operational reality**:

**1. Skills Evolve Independently**
- Better models become available
- APIs change
- Cost structures shift
- New providers appear
- Old providers deprecate features

**Implication**: The orchestration layer must not hard-code skill specifics. Use abstraction boundaries (interfaces, contracts) so skills can be swapped without rewriting orchestration logic.

**2. Decomposition Strategies Improve With Use**
- Early task decompositions will be suboptimal
- Real workloads reveal better patterns
- What seemed like a good DAG turns out to have bottlenecks or redundancies

**Implication**: Plan for orchestration patterns to be versioned and improved. Don't treat the first decomposition as gospel—treat it as hypothesis.

**3. Agent Coordination Patterns Emerge**
- You won't know the right agent interaction model on day one
- Some agents will need tight coupling, others loose
- Failure modes will demand new recovery strategies

**Implication**: Build instrumentation and logging from day one. Let data guide refactoring. Accept that coordination logic will be rewritten.

**4. User Needs Drift**
- What users ask for initially is not what they need after using the system
- Edge cases become the common case
- Performance requirements tighten as adoption grows

**Implication**: Version the system. Maintain a "current stable" and "next beta." Quantize changes into releases. Don't let the system drift into an untested, half-changed state.

**5. The Throwaway Isn't Wasted**
- The first version of your orchestration logic will be wrong
- Accept this. Don't over-engineer it.
- Build something simple, learn from it, then build the real thing
- The learning is the product; the code is the byproduct

## The Bitter Pill: Some Systems Must Be Replaced

Brooks and Belady/Lehman converge on a hard truth: **Eventually, even with the best maintenance, a system becomes unmaintainable.** Entropy wins. The accumulated cruft, the violated assumptions, the outdated design—it all adds up.

"A brand-new, from-the-ground-up redesign is necessary."

This is not failure. This is the lifecycle of complex artifacts. The first cathedral teaches you how to build the second one. The pilot plant teaches you how to build the factory.

For agent systems, this means:
- **Don't treat the current architecture as permanent**
- **Plan for periodic rebuilds** (not patching, but reconception)
- **Extract lessons** from the current system while it still works
- **Recognize when you're patching the unpatchable** and have the courage to start over

## The Central Lesson

Change is not an exceptional event requiring apologetic justification. **Change is the only constant in software.**

The question is not: "Can we avoid changing this system?"
The question is: "Have we designed this system to change gracefully?"

Brooks's answer involves technical practices (modularization, high-level languages, versioning), organizational practices (flexible roles, surgical teams, separated meetings), and psychological acceptance (this is a pilot, this will evolve, this will eventually be replaced).

The mythical man-month assumed time and labor were interchangeable. The mythical stable system assumes requirements and implementations are permanent.

Both myths share a root error: **ignoring the human, communicative, evolutionary nature of complex intellectual work.**

For agent orchestration: Build the simplest thing that could work. Instrument it. Learn from it. Refactor it. Version it. And when the time comes—throw it away and build the thing you wish you'd built the first time.

Because by then, you'll know what that is.