# The Hand-Tailorable vs. Fully-Automated Tradeoff: Lessons from Competition Results

## The Competition Landscape

The 2002 International Planning Competition included fourteen planning systems, split between two philosophies:

**Hand-Tailorable Planners** (3 systems): SHOP2, TLPlan, TALPlanner
- Accept domain-specific knowledge (HTN methods, control rules, etc.)
- Require human expertise to write domain descriptions
- "Cheating" according to pure AI research standards

**Fully-Automated Planners** (11 systems): Various STRIPS/PDDL planners
- Domain-independent search algorithms
- Work from generic operator descriptions only
- "Pure" AI research systems

The results were striking:
- **SHOP2**: 899 of 904 problems solved (99%)
- **TLPlan**: 894 of 904 problems solved (99%)  
- **TALPlanner**: 610 of 904 problems solved (67%, didn't do numeric domains)
- **Best fully-automated planner**: "several hundred" fewer problems than hand-tailorable ones

The paper notes: "SHOP2 solved more problems than any other planner in the competition" (p. 394).

## What Makes This Result Profound

The conventional wisdom in AI planning research has long been that **domain-independent is the goal**: the ideal planner should work on any domain given only operator descriptions, without human guidance.

SHOP2's competition results challenge this assumption. By accepting domain-specific procedural knowledge (HTN methods), hand-tailorable planners achieved:
- Higher success rates (99% vs. much lower)
- Faster solution times ("generally much faster than most of the fully-automated planners")
- Handling of much larger problems ("orders of magnitude more complicated than those typically solved by 'fully automated' planning systems")

The paper's experimental studies (Nau et al., 1999, 2001; Bacchus & Kabanza, 2000) consistently showed that hand-tailorable planners "have quickly solved planning problems orders of magnitude more complicated than those typically solved by 'fully automated' planning systems in which the domain-specific knowledge consists only of the planning operators" (p. 382).

## The Domain Knowledge Paradox

The paradox: Adding domain knowledge feels like "cheating"—you're encoding human expertise rather than discovering solutions algorithmically. Yet this "cheating" is what makes real-world problems tractable.

The paper frames this carefully: "The ability to use domain-specific problem-solving knowledge can dramatically improve a planner's performance, and sometimes make the difference between solving a problem in exponential time and solving it in polynomial time" (p. 382).

This isn't just a constant factor improvement—it's a complexity class difference. With appropriate HTN methods, problems solvable in O(n²) or O(n³) might otherwise require O(2ⁿ) without methods.

The paper cites formal results: "Gupta & Nau, 1992; Slaney & Thiébaux, 2001" showing that blocks-world planning is exponential for classical planners but polynomial for HTN planners with appropriate methods.

## Three Types of Domain Knowledge

The hand-tailorable planners in the competition used different types of domain knowledge:

### SHOP2: Hierarchical Task Networks (HTN Methods)

Methods encode procedural knowledge: "To accomplish task T, normally you'd do subtasks A, B, C in this order."

Example (Figure 1): "To transport a package, reserve a truck, dispatch it to the package, load, move to destination, unload, return truck, free it."

This knowledge prunes search space: SHOP2 never considers nonsensical sequences like "load package before dispatching truck" because the method specifies the correct order.

### TLPlan: Temporal Logic Control Rules

Control rules encode constraints: "Never reach a state where property P is violated" or "Always eventually reach a state where property Q holds."

These are specified in Linear Temporal Logic (LTL). The planner does forward search but backtracks when a control rule indicates the current state is "bad."

This knowledge prunes search space by excluding entire branches: if a state violates a control rule, all its successors are also excluded.

### TALPlanner: TAL (Temporal Action Logic) Rules

Similar to TLPlan but using TAL, a narrative-based temporal logic. Also encodes constraints about which states/transitions are valid.

## The Common Pattern: Expert Knowledge Enables Pruning

All three approaches share a key characteristic: **they use expert knowledge to prune the search space**, not to hardcode solutions.

This is crucial: they're not "cheating" by pre-computing answers. They're encoding general strategies that apply across all problem instances.

A SHOP2 method for "transport package" works whether there's 1 package or 1000, 1 truck or 100, simple topologies or complex ones. The method says "here's how to transport any package using any available truck," not "here's the solution to this specific problem."

The paper emphasizes: "SHOP2 is 'hand-tailorable:' its planning engine is domain-independent, but the HTN methods may be domain-specific" (p. 382).

The planner is domain-independent. The knowledge is domain-specific.

## The Cost: Human Expertise Required

The paper is honest about the cost of hand-tailorability:

**Expertise Required**: Writing good HTN methods requires both domain expertise (knowing standard procedures) and planning expertise (knowing how to encode them). "The ability to use domain-specific problem-solving knowledge" requires having that knowledge.

**Time Investment**: Domain descriptions took significant time to create. The paper mentions "days" and describes "spending a great deal of effort crafting the methods used in the competition" (p. 394).

**Risk of Errors**: In the AIPS-2000 competition, "SHOP's team made some mistakes in writing two of the domains. Thus SHOP found incorrect solutions for some of the problems in those domains, so the judges disqualified SHOP from those domains" (p. 388).

To address this, the SHOP2 team created a translator from PDDL to SHOP2: "We wrote a translator program to translate PDDL operators into SHOP2 domain descriptions. The domain descriptions produced by the translator program are not sufficient for efficient planning with SHOP2: they need to be modified by hand in order to put in the domain knowledge" (p. 388).

This reveals the workflow: automated translation produces correct but inefficient domains (equivalent to fully-automated planning), then human expertise refines them into efficient domains.

## The Boundary Between Acceptable and Unacceptable Knowledge

An interesting question: What kinds of domain knowledge are "fair" vs. "cheating"?

The competition rules distinguished between:

**Acceptable**: General problem-solving strategies for a domain
- "To transport something, get a vehicle, pick it up, deliver it"
- "When optimizing fuel, prefer slower speeds"
- "Clear obstacles before moving objects"

**Unacceptable**: Problem-instance-specific information
- "In problem #42, use truck T3 to transport package P17"
- Hard-coding solutions to specific problem instances

The SHOP2 team's domain descriptions were accepted because they encoded general strategies, not specific solutions. The methods worked across all problem instances in each domain.

This suggests a principle: **Strategic knowledge is acceptable; tactical knowledge specific to individual problems is not**.

## Comparing the Three Hand-Tailorable Planners

The paper notes key differences:

**Speed**: "In general, SHOP2 tended to be slower than TALPlanner and TLPlanner, although there was one domain (Satellite-HardNumeric) where SHOP2 was consistently the fastest" (p. 394).

This is interesting: TLPlan and TALPlanner use forward search with control rules (pruning bad states), while SHOP2 uses hierarchical decomposition. Forward search with pruning can be faster when control rules efficiently eliminate bad branches.

**Plan Quality**: "None of the three hand-tailorable planners dominated the other two in terms of plan quality. For each of them, there were situations where its solutions were significantly better or significantly worse than the other two" (p. 394).

This suggests different types of domain knowledge lead to different optimization characteristics. HTN methods might find high-quality solutions in some domains, while temporal logic control rules might be better in others.

**Expressiveness**: The paper argues HTN planning is strictly more expressive than classical planning (Turing-complete vs. regular sets), but doesn't directly compare expressiveness of HTN methods vs. temporal logic control rules.

## The Deeper Argument: Why Hand-Tailorability Wins

The paper makes a subtle but powerful argument about why domain knowledge helps:

**Claim**: "Most HTN practitioners would argue that such representations are more appropriate for many real-world domains than are classical planning operators, as they better characterize the way that users think about problems" (p. 382).

This isn't just about computational efficiency—it's about **representational adequacy**. HTN methods naturally express how humans think about complex tasks.

When a logistics coordinator plans package delivery, they think: "I need to get a truck to the package, load it, deliver it." They don't think: "I need to find a sequence of primitive actions that achieves the goal that the package is at the destination."

The hierarchical decomposition matches human cognition. This makes domain descriptions:
- Easier to write (matches expert mental models)
- Easier to verify (experts can review and validate)
- More maintainable (modifications align with how humans think about changes)

**Computational efficiency is a consequence of cognitive alignment**, not just clever algorithms.

## Application to AI Agent Systems

For WinDAG and similar orchestration systems:

**Embrace Task Decomposition**: Don't make agents search through primitive actions. Give them hierarchical task decomposition knowledge. For "implement authentication," the decomposition might be: design data model → implement registration → implement login → implement password reset → add tests.

**Make Knowledge Explicit and Reviewable**: SHOP2's HTN methods are declarative and human-readable. Engineers can review them, validate them, and refine them. This is vastly superior to having domain knowledge implicit in neural network weights or buried in complex search heuristics.

**Start with Generated Knowledge, Refine with Expertise**: Like SHOP2's PDDL translator, you could generate initial task decompositions automatically (e.g., from API documentation, codebase analysis), then refine them with human expertise about best practices, common pitfalls, and optimization strategies.

**Distinguish Strategic from Tactical Knowledge**: Encode strategic knowledge (general problem-solving procedures) in reusable skills/methods. Let the orchestrator make tactical decisions (which specific resources to use) based on current state.

**Accept the Cost of Expertise**: Building high-performance agent systems will require domain expertise. This isn't a limitation—it's a feature. The alternative (fully automated systems with no domain knowledge) simply doesn't scale to complex real-world problems.

**Create Knowledge Repositories**: Treat HTN-style methods as organizational assets. Build libraries of reusable task decomposition knowledge. New projects leverage existing knowledge, and knowledge improves over time as you learn better procedures.

## The Meta-Lesson: Beware the Generality Trap

The fully-automated planners represent a seductive idea: build one system that works on everything without domain knowledge. This seems more "general" and therefore better.

But SHOP2's results suggest **apparent generality can be an anti-pattern** when it makes real problems intractable.

The "less general" approach—accepting domain knowledge—actually handles more problems, handles larger problems, and handles them faster. It's more useful in practice precisely because it's "less general" in theory.

This appears throughout computer science:

**Database query optimization**: Hand-written SQL with hints outperforms pure automated optimization on complex queries. Expert database administrators encode domain knowledge about data distributions, access patterns, and index usage.

**Compiler optimization**: Profile-guided optimization uses domain knowledge (actual runtime behavior) to generate faster code than pure static analysis.

**Machine learning**: Domain-specific feature engineering often outperforms "end-to-end learning" that learns features from scratch.

**Software architecture**: Domain-driven design encodes business domain knowledge in software structure, enabling more maintainable systems than generic CRUD frameworks.

The common thread: **Encoding domain knowledge, when done right, is a source of power, not a limitation**.

For agent systems: Don't aim for "fully automated" as the ultimate goal. Aim for "expertly guided"—systems that can leverage human expertise effectively, scale it across problems, and refine it over time.

The goal isn't to eliminate human knowledge from the loop. It's to make human knowledge maximally effective by encoding it in forms that machines can execute efficiently across arbitrarily many problem instances.

## Key Insight: Hand-Tailorability is a Feature, Not a Bug

The deepest lesson from SHOP2's competition success: **Hand-tailorability is what enables solving real-world problems at scale**.

The phrase "hand-tailorable" might suggest limitation or compromise—as if we're settling for less than the ideal of full automation. But the competition results suggest the opposite: hand-tailorability is a feature that enables capabilities fully-automated systems cannot match.

The 99% success rate vs. much lower success rates for fully-automated systems isn't a marginal difference—it's the difference between "works in practice" and "doesn't work in practice."

For AI agent systems: Design for hand-tailorability from the start. Make it easy to inject domain knowledge, encode procedural expertise, and refine strategies over time. The systems that accept human expertise will dramatically outperform those that insist on learning everything from scratch.