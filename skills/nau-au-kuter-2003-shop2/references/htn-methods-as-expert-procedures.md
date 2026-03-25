# HTN Methods: Encoding How Experts Actually Solve Problems

## The Central Insight

Hierarchical Task Network (HTN) planning represents a fundamentally different approach to problem-solving than classical planning. Rather than defining primitive actions and searching for sequences that achieve goals, HTN planning encodes **procedural knowledge about how tasks are normally accomplished**.

The authors write: "HTN methods generally describe the 'standard operating procedures' that one would normally use to perform tasks in some domain... Most HTN practitioners would argue that such representations are more appropriate for many real-world domains than are classical planning operators, as they better characterize the way that users think about problems" (p. 382).

## What Makes Methods Different from Operators

A classical planning operator says: "Action A can be taken when conditions C hold, producing effects E." The planner must search through all possible action sequences to find one that achieves the goal.

An HTN method says: "To accomplish task T when conditions C hold, here's the standard procedure: do subtasks S1, S2, ... Sn in this partial order." The method encodes human expertise about task decomposition.

Consider the example from Figure 1 (simplified logistics domain):

**Method for transporting one package**:
```
To transport package ?p:
1. Reserve a truck ?t
2. Dispatch ?t to package's location
3. Load ?p onto ?t  
4. Move ?t to package's destination
5. Unload ?p
6. Return ?t home
7. Free ?t (mark available)
```

This is how a human logistics coordinator thinks: "To transport something, you get a vehicle, go pick it up, deliver it, return the vehicle." The method captures this procedural knowledge directly.

Contrast with classical planning: you'd have operators for reserve, move, load, unload, etc., and the planner would have to discover through search that this particular sequence accomplishes the transport task.

## Expressiveness: HTN Planning is Turing-Complete

The paper makes a striking formal claim: "HTN planning is Turing-complete: even undecidable problems can be expressed as HTN planning problems. It remains Turing-complete even if we restrict the tasks and the logical atoms to be purely propositional (i.e., to have no arguments at all)" (footnote 4, p. 395).

This means HTN planning is strictly more expressive than classical planning. There exist problems that can be naturally expressed as HTN problems but cannot be expressed as classical planning problems at all.

Why? Because methods can encode arbitrary control flow and recursion. A method can say "to do X, recursively do X on smaller instances until you reach a base case"—representing algorithms, not just action sequences.

The paper notes: "In contrast, classical planning only represents planning problems for which the solutions are regular sets." Regular sets are far less expressive than the full range of computable problems.

## Methods Encode Multiple Levels of Abstraction

The power of HTN methods lies in their ability to represent problems at multiple levels of granularity simultaneously. Consider the abstract strategy for ZenoTravel (Figure 7):

**High-level strategy**:
- Task for each person: transport them to destination
- Task for each plane: move it to its destination  
- These are unordered; subtasks may interleave

**Mid-level method** (transport a person):
- If already at destination: done
- Else: select a plane, move it to person, board person, move to destination, debark

**Low-level operators**:
- board, debark, fly, zoom, refuel

Each level captures appropriate decision-making granularity. The high-level strategy recognizes that people can be transported in any order (they're independent tasks). The mid-level method encodes the standard procedure for using aircraft. The low-level operators are primitive actions.

This hierarchy mirrors how human experts think: strategic decisions (which people to prioritize?), tactical decisions (how to transport this person?), operational decisions (fly or zoom? when to refuel?).

## Methods Enable Polynomial Solutions to Exponential Problems

Perhaps the most practically important claim: "The ability to use domain-specific problem-solving knowledge can dramatically improve a planner's performance, and sometimes make the difference between solving a problem in exponential time and solving it in polynomial time" (p. 382).

The paper cites Gupta & Nau (1992) and Slaney & Thiébaux (2001) showing that for blocks-world planning:
- With appropriate HTN methods: polynomial time
- With classical planning: exponential time

Why? Because methods prune the search space by encoding which decompositions are sensible. A classical planner might consider stacking blocks in arbitrary orders, trying exponentially many possibilities. An HTN method encodes: "To clear a block, first recursively clear what's on top of it, then move it to the table." This procedural knowledge eliminates the need to search.

The paper reports experimental evidence: "hand-tailorable planners have quickly solved planning problems orders of magnitude more complicated than those typically solved by 'fully automated' planning systems" (p. 382).

In the competition, SHOP2 solved 899 of 904 problems. Most "fully automated" planners solved only a fraction of that.

## The Method Structure: Conditional Task Networks

A SHOP2 method has this general form:

```
(:method task-head
  precondition-1 subtask-network-1
  precondition-2 subtask-network-2
  ...
  precondition-n subtask-network-n)
```

This is analogous to if-then-else: "If precondition-1 holds, decompose using subtask-network-1; else if precondition-2 holds, use subtask-network-2; ..."

Figure 8 shows an example:

```
(:method (transport-person ?person ?destination)
  Case1  ; already there
    (and (at ?person ?current-position)
         (same ?current-position ?destination))
    ()  ; no subtasks needed
    
  Case2  ; need to transport
    (and (at ?person ?current-position)
         (plane ?p))
    ((transport-with-plane ?person ?p ?destination)))
```

This encodes two cases: "If the person is already at the destination, you're done. Otherwise, select a plane and transport them with that plane."

The ability to have multiple cases—each with different preconditions and subtask networks—makes methods highly expressive. They can encode case-based reasoning directly: "In situation A, use procedure X; in situation B, use procedure Y."

## Partial Ordering: Balancing Commitment and Flexibility

SHOP2 improves on its predecessor SHOP by allowing **partially ordered subtasks**: some subtasks must be done in sequence, others can be interleaved.

Consider transporting two packages (Figure 1):
```
(:method (transport-two ?p ?q)
  :unordered
  ((transport ?p)
   (transport ?q)))
```

The `:unordered` keyword says these can interleave. SHOP2 might:
1. Reserve truck for p
2. Reserve truck for q  
3. Dispatch truck for p
4. Dispatch truck for q
5. Load p, move, unload p
6. Load q, move, unload q

This is more flexible than forcing complete transport of p before starting q, but more structured than allowing arbitrary interleaving (some orderings would cause conflicts).

The paper notes: "This often makes it possible to specify domain knowledge in a more intuitive manner than was possible in SHOP" (p. 380).

The notation uses `:ordered` and `:unordered` tags, which can be nested:
```
(:method some-task
  :ordered
  (subtask-1
   :unordered
   (subtask-2a subtask-2b)
   subtask-3))
```

Meaning: do subtask-1, then do subtask-2a and subtask-2b in any interleaving, then do subtask-3.

The paper acknowledges: "This notation does not allow every possible partial ordering, but that has not been a problem in practice; and this notation is less clumsy than those that allow every possible partial ordering" (footnote 3, p. 384).

Practical lesson: Don't aim for maximal expressiveness; aim for the sweet spot where common patterns are natural to express.

## Boundary Condition: When Domain Knowledge Fails

The strength of HTN planning—encoding expert procedures—is also its limitation: **you need expert knowledge**.

The paper is honest about this: "HTN planning is 'hand-tailorable:' its planning engine is domain-independent, but the HTN methods may be domain-specific, and the planner can be customized to work in different problem domains by giving it different sets of HTN methods" (p. 382).

Writing good HTN methods requires:
1. Domain expertise (knowing the standard operating procedures)
2. Planning expertise (knowing how to encode them as methods)
3. Significant effort (the paper mentions "days" to write domain descriptions)

The competition exposed this challenge. In AIPS-2000, SHOP's team "made some mistakes in writing two of the domains. Thus SHOP found incorrect solutions for some of the problems in those domains, so the judges disqualified SHOP from those domains" (p. 388).

For AIPS-2002, they addressed this by: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This reveals the true challenge: automatic translation produces correct but inefficient domain descriptions (essentially, no better than classical planning). Human expertise is needed to add the procedural knowledge that makes planning tractable.

## Application to AI Agent Systems

For WinDAG and similar multi-agent systems:

**Skill Decomposition**: Each high-level skill (like "implement authentication system") should have HTN-style methods encoding standard procedures: "First design the data model, then implement user registration, then implement login, then implement password reset..." This is more useful than having primitive actions like "write function" and hoping the system discovers good orderings.

**Conditional Methods for Context**: Use SHOP2's conditional method structure:
```
method: implement-feature
  case: feature is already implemented → verify and return
  case: similar feature exists → adapt existing implementation  
  case: from scratch → standard implementation procedure
```

Each case encodes a different situation-appropriate strategy.

**Encode Development Conventions**: HTN methods should capture team standards: "To implement an API endpoint, first write the schema, then the handler, then the tests, then update the API documentation." These procedural conventions dramatically reduce search space.

**Hierarchical Task Monitoring**: When a high-level task decomposes into subtasks, the orchestrator can monitor progress at multiple levels. If a low-level subtask fails, the system can backtrack to the method level and try a different decomposition, rather than failing the entire high-level task.

**Method Libraries as Organizational Memory**: HTN methods become organizational memory—reusable procedures that capture institutional knowledge about how to accomplish tasks. New projects benefit from existing methods, and methods evolve as better procedures are discovered.

## The Profound Lesson

The success of HTN planning challenges a common assumption in AI: that **more general is better**. Classical planning seems more general because it doesn't require hand-crafted methods. But this "generality" makes it computationally intractable for real problems.

SHOP2's "limitation"—requiring domain-specific methods—is actually its strength. By encoding expert procedural knowledge, it reduces exponential search spaces to polynomial ones. The 99% success rate (899 of 904 problems) proves the approach scales.

The lesson for agent systems: **Don't make your agents figure out everything from first principles**. Encode standard operating procedures. Provide hierarchical task decomposition knowledge. Make your system "hand-tailorable" in the SHOP2 sense—capable of incorporating expert knowledge about how tasks should normally be accomplished.

This is how human organizations work: new employees don't rediscover procedures through trial and error; they learn standard operating procedures from experienced colleagues. HTN planning is the computational equivalent of institutional procedural knowledge.