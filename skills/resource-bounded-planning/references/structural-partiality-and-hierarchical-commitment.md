# Structural Partiality and Hierarchical Commitment: How Decomposition Enables Bounded Reasoning

## The Case for Partial Plans

Traditional AI planning systems used partial plans "only as intermediate representations in the plan formation process" (p. 10, footnote 6). The goal was always to produce a complete, detailed plan before execution began. But Bratman, Israel, and Pollack argue that **acting on the basis of partial plans** is not a limitation — it's a rational strategy for resource-bounded agents.

The argument rests on two observations about bounded agents:

1. **Bounded Knowledge**: "Agents have bounded knowledge. They are neither prescient nor omniscient: the world may change around them in ways they are not in a position to anticipate. Hence highly detailed plans about the far future will often be of little use, the details not worth bothering about" (p. 9).

2. **Bounded Computation**: Constructing detailed plans takes time. "It is recognized that the construction of plans takes time" (p. 4), and that time could be spent on more productive activities — like actually executing the plan or working on other tasks.

The combination creates a compelling argument: if you don't know what the future holds, and it's expensive to plan for every contingency, then **defer detailed planning until you have better information and more pressing need**.

## Two Types of Partiality

The paper distinguishes two forms of partiality:

### Temporal Partiality

"Plans may be temporally partial, accounting for some periods of time and not for others. An agent may plan to give a lecture from 10 o'clock until noon, to pick up a book at the bookstore on the way back from the lecture, to attend a meeting from 2:00 to 3:30, and to pick up her child at school at 5:00; she may not yet have decided what to do between 3:30 and the time she leaves for her child's school" (p. 10).

This is straightforward: I know what I'm doing from 10-12, 2-3:30, and at 5:00. The gap from 3:30-5:00 is unplanned. Maybe I'll prepare for tomorrow's meeting, maybe I'll return email, maybe an opportunity will arise. Planning now would be premature.

### Structural Partiality

"More important for our purposes is the potential for structural partiality in plans. Agents frequently decide upon ends, leaving open for later deliberation questions about means to those ends" (p. 10).

This is more subtle and more powerful. **I commit to a goal before I know how to achieve it**. I decide "I will get that book today" before deciding whether to buy it or borrow it, before deciding which bookstore or which library, before deciding how to get there.

The plan is partial not because it has temporal gaps, but because it's **hierarchically incomplete**. The high-level structure is fixed ("get book today") while low-level details remain unspecified.

## Why Structural Partiality Matters for Agent Systems

Consider a WinDAG agent receiving: "Implement user authentication for the web application."

A **complete plan** would specify:
- Which authentication scheme (OAuth, JWT, session-based)
- Which OAuth provider (Google, GitHub, Auth0)
- Which libraries (passport.js, next-auth, custom)
- Database schema for user records
- Middleware placement in the application
- Error handling strategy
- Test coverage approach
- Documentation updates needed

Planning all of this upfront has severe problems:

1. **Many decisions depend on information not yet available**: The best OAuth provider depends on what's already in package.json. The database schema depends on existing user table structure. The testing approach depends on what breaks during implementation.

2. **The world changes during planning**: By the time you've researched all OAuth providers, a new one may have launched or an existing one may have deprecated an API.

3. **Detailed plans are fragile**: A complete plan assumes specific preconditions. If any assumption is violated (library doesn't work as documented, existing code has unexpected constraints), the entire plan must be reconsidered.

4. **Planning is expensive**: Researching all these decisions takes hours. Many of those decisions won't matter (maybe the OAuth provider choice is essentially arbitrary for this use case).

A **structurally partial plan** might be:
```
1. Implement user authentication [COMMITTED]
   1.1. Choose authentication approach [DEFERRED]
   1.2. Implement chosen approach [DEFERRED]
   1.3. Add tests [DEFERRED]
```

Or perhaps one level deeper:
```
1. Implement user authentication [COMMITTED]
   1.1. Use OAuth [COMMITTED]
   1.2. Choose OAuth provider [DEFERRED]
   1.3. Implement OAuth flow [DEFERRED]
   1.4. Add tests [DEFERRED]
```

The commitment to "OAuth" rules out session-based auth and JWT, dramatically narrowing the option space for future decisions. But the specific provider remains open, because that decision benefits from information gathered during implementation setup.

## The Consistency Constraint and Structural Partiality

Recall the earlier example: "A plan to spend all of one's cash at lunch is inconsistent with a plan to buy a book that includes an intention to pay for it with cash, but is not necessarily inconsistent with a partial plan merely to purchase a book, since the book may be paid for with a credit card" (p. 11).

This reveals a crucial interaction: **the more partial a plan, the more compatible it is with other plans**. 

- Highly specific plan ("buy book with cash") → many potential conflicts
- Partial plan ("buy book") → fewer conflicts, because payment method left open

For agent systems, this suggests a strategy: **commit to structure before committing to details**. 

If Agent A commits to "produce report" without specifying format, Agent B can commit to "consume report" without conflict, because they can coordinate on format later. If Agent A prematurely commits to "produce report in XML", and Agent B commits to "consume JSON report", you have conflicts that could have been avoided.

The partiality of plans is not just about deferring work — it's about **maximizing compatibility and minimizing premature constraints** that limit future flexibility.

## Means-End Coherence as Progressive Refinement

While plans can be partial, they cannot be arbitrarily partial forever. The demand for means-end coherence creates a forcing function: "as time goes by, they must be filled in with subplans that are at least as extensive as the agent believes necessary to execute the plan successfully" (p. 11).

The trigger is temporal: "Means-end reasoning may occur at any time up to the point at which a plan is in danger of becoming means-end incoherent; at that point it must occur" (p. 12).

This creates a natural rhythm for hierarchical decomposition:

**Phase 1: High-Level Commitment**
- Agent receives goal: "Implement authentication"
- Forms partial plan: [Implement authentication] → triggers compatibility check against existing plans
- If compatible, moves to execution phase

**Phase 2: Progressive Refinement**
- Time passes. Deadline approaches or precondition checked.
- Detector: "Plan to implement authentication is means-end incoherent without approach"
- Triggers means-end reasoning: What authentication approaches are available?
- Result: Refined plan [Implement authentication → Use OAuth] 

**Phase 3: Continued Refinement**
- More time passes. Implementation phase begins.
- Detector: "Plan to use OAuth is means-end incoherent without provider"
- Triggers means-end reasoning: Which OAuth provider?
- Result: [Implement authentication → Use OAuth → Use GitHub OAuth]

**Phase 4: Execution**
- Concrete actions now specified enough to execute
- Implementation proceeds with fully specified subplan

Each refinement step:
1. Is triggered by approaching means-end incoherence (temporal pressure)
2. Operates on a narrowed option space (previous commitments filter)
3. Produces a more specific but still potentially partial plan
4. Preserves compatibility with commitments made by other agents

## The Information-Availability Argument

One of the paper's most important insights is buried in the discussion of bounded knowledge: **detailed planning is often premature because the information needed for good decisions isn't available yet**.

Consider the authentication example. Key information becomes available progressively:

- **After inspecting package.json**: "Oh, we already use Google APIs extensively" → GitHub OAuth is more compatible
- **After attempting first OAuth integration**: "This library doesn't handle token refresh well" → different library needed
- **After implementing basic flow**: "Our frontend architecture doesn't support the redirect flow we planned" → need to adjust approach

Each piece of information was *unknowable* before beginning execution. You can't determine library quality by reading docs — you must attempt integration. You can't identify frontend architecture constraints without examining the codebase.

This means **planning is not just expensive; premature detailed planning is often wasteful** because it makes decisions with poor information that must be revisited later.

The structurally partial plan sidesteps this: it defers decisions until information is available to make them well. It's not procrastination — it's rational information-gathering.

## Implementation for Agent Orchestration

For a system like WinDAGs, this suggests an architecture where:

### 1. Plans Are Explicitly Hierarchical

Each plan node has:
- Commitment status: [COMMITTED | DEFERRED | COMPLETED]
- Abstraction level: [GOAL | APPROACH | METHOD | ACTION]
- Children: More specific subplans (possibly empty if DEFERRED)
- Preconditions: What must be true to refine this node
- Deadline: When means-end coherence becomes threatened

Example:
```
Plan Node: "Implement authentication"
  Status: COMMITTED
  Level: GOAL
  Children: [DEFERRED]
  Preconditions: { None }
  Deadline: 2 hours from now
  
  [Time passes, deadline approaches]
  
Plan Node: "Implement authentication"  
  Status: COMMITTED
  Level: GOAL
  Children: [
    Node: "Use OAuth"
      Status: COMMITTED
      Level: APPROACH
      Children: [DEFERRED]
      Preconditions: { package.json inspected }
      Deadline: 1.5 hours from now
  ]
```

### 2. Means-End Reasoning Is Triggered, Not Continuous

Rather than constantly elaborating plans, the system:

- Monitors plans for means-end coherence threats
- When deadline approaches or precondition met, triggers means-end reasoning
- Means-end reasoning operates on the partial plan, proposing refinements
- Refinements are filtered for compatibility with other plans
- Surviving refinements go to deliberation

This is **event-driven decomposition**, not depth-first expansion. Plans are refined just-in-time, not speculatively.

### 3. Compatibility Checking Respects Partiality

When Agent A has partial plan "implement authentication" and Agent B proposes "modify user database schema", compatibility checking must handle the partiality:

- **Definitely compatible**: If authentication plan specifies "no database changes" → clear conflict
- **Definitely incompatible**: If schema changes break existing auth code → clear conflict  
- **Uncertain**: If authentication plan is partial and might or might not need schema changes → ???

The paper's consistency requirement suggests: **treat partial plans conservatively for compatibility**. If Agent A's plan *might* need schema changes, and Agent B wants to modify schema, this is a potential conflict requiring coordination or deliberation, even if the plans might ultimately be compatible.

Better to coordinate early (when plans are partial and flexible) than discover conflicts late (when plans are detailed and committed).

### 4. Skill Selection Is Hierarchical

The 180+ skills in WinDAGs naturally form a hierarchy:
- High-level: "implement feature", "refactor module", "debug issue"
- Mid-level: "add authentication", "optimize database queries", "trace error source"
- Low-level: "generate OAuth code", "add database index", "inspect stack trace"

Early in plan execution, high-level skills are selected to form partial plans. As plans refine, more specific skills become relevant. The structural partiality of plans naturally mirrors the hierarchical structure of skills.

## Failure Modes of Insufficient Partiality

What happens if plans are too detailed too early?

**Brittleness**: Complete plans depend on many assumptions. When any assumption is violated, the entire plan must be reconsidered. A partial plan is more robust because fewer commitments mean fewer potential violations.

**Wasted Effort**: Detailed planning for situations that never arise. You spend an hour choosing between OAuth providers, then discover the existing codebase already has OAuth code that just needs to be configured.

**Thrashing**: Detailed plans made with poor information are frequently wrong, leading to constant replanning. This is exactly what the paper warns against with "overly cautious" override mechanisms (Situations 2b and 3) — too much deliberation, not enough action.

**Coordination Failures**: If Agent A commits to detailed plans prematurely, Agent B must work around those details rather than coordinating on approach. Early detailed commitment reduces collaborative flexibility.

## The Deeper Principle: Commitment as a Spectrum

The paper reveals that commitment isn't binary. Between "no commitment" and "fully specified plan" lies a spectrum of structural partiality:

- No commitment: "I might work on authentication"
- Goal commitment: "I will work on authentication" 
- Approach commitment: "I will work on authentication using OAuth"
- Method commitment: "I will implement GitHub OAuth using next-auth library"
- Action commitment: "I will add next-auth to package.json with version 4.22.0"

Each level of commitment:
- Narrows future option space more than the previous level
- Provides more constraint for compatibility checking
- Requires more information to commit rationally
- Is harder to revise without wasted effort

Rational decomposition involves moving down this spectrum at the right pace — fast enough to make progress, slow enough to gather information, careful enough to preserve flexibility.

For agent systems: **make decomposition decisions explicit**. Don't just have "task queue." Have hierarchically structured partial plans where commitment level and refinement status are first-class concepts. This makes the system's reasoning transparent and debuggable in ways that flat task lists cannot provide.