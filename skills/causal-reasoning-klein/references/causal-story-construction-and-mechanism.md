# Story Explanations as Mechanism Maps: Building and Evaluating Causal Narratives

## The Unique Power of Story Explanations

Of the five forms of causal explanation identified by Klein and Hoffman — events, abstractions, conditions, lists, and stories — the story form is uniquely powerful and uniquely dangerous. It is powerful because it reveals mechanism: not just that A and B are correlated, not just that A plausibly leads to B, but *how* the entire chain from initial conditions through precipitating events to final outcome unfolded, with each transition justified and each causal link made explicit.

It is dangerous because stories create the illusion of necessity. Once assembled, a causal chain seems to have been inevitable. "This is how the dominos were fated to fall." The mechanism that enabled the outcome can seem, in retrospect, like the mechanism that guaranteed it — obscuring the many branching points where a different decision would have produced a different outcome.

This document examines what makes a story explanation work, how to construct one rigorously, how to evaluate one critically, and how to use story explanations as inputs to agent decision-making.

---

## Anatomy of a Causal Story

A causal story is not simply a chronological account of events. It has specific structural features that distinguish it from a list or a narrative:

**1. Each element is a cause, not just an event.**
In Klein and Hoffman's fireground story (Table 3), every item on the list is described in causal terms: "Because the door didn't close, the fire and smoke were not contained to the apartment. They spread into the hall." The story doesn't just say "the fire spread to the hall" — it says *why*, linking each outcome to its cause.

**2. Transitions between elements must be plausible.**
"Confidence in a causal chain or interaction depends on the plausibility of each transition." The strength of a story explanation is proportional to the plausibility of its weakest link. A single implausible transition invalidates the story (or at least that portion of it).

**3. Multiple causes can operate in parallel and interact.**
The subprime mortgage story (Table 2) shows causes converging from different directions: rate policy, housing market dynamics, global capital flows, loosened lending standards. These don't form a simple chain — they form a network of interacting factors that collectively created the crisis conditions. The story must represent this network, not just a linear sequence.

**4. The story includes enabling conditions, not just precipitating events.**
A complete story distinguishes between:
- The structural conditions that made the system vulnerable (the bubble dynamic in housing; the firefighter's limited oxygen)
- The precipitating events that triggered the final outcome (the Fed's rate decision; the rug caught in the door)

A story that only includes precipitating events without conditions is incomplete — it explains why the outcome happened *now* but not why it was *possible*.

---

## The Construction Process: How Story Explanations Are Built

Stories are not found — they are constructed. The construction process, viewed through the Reciprocal Model, involves:

**Step 1: Anchor on the outcome.**
The story begins with the effect to be explained. What happened? But as Klein and Hoffman emphasize, the effect definition is itself provisional and may need to be revised as the story unfolds.

**Step 2: Trace backward from the outcome to immediate causes.**
What directly caused the outcome? For the firefighter commander: he ran out of air. Why? He failed to withdraw in time. Why? Possibly he was disoriented, possibly still searching for residents — the story notes uncertainty at this transition point, which is honest.

**Step 3: Extend the causal chain backward.**
For each immediate cause, ask: what caused this? Continue backward until reaching either a condition that can be treated as given (the woman's decision to heat the apartment; the Fed's rate decision context) or a point where the chain becomes too remote to be actionable.

**Step 4: Identify parallel causes.**
Are there causes operating simultaneously that haven't been included? In the fireground story: the shattered windows creating wind, and the firefighters' advancing oxygen depletion, are parallel processes that intersect in the hall. Both are needed to explain the commander's death.

**Step 5: Map interactions.**
Do any of the causes amplify or suppress each other? In the mortgage story: looser lending standards and low interest rates interacted — either alone would have been insufficient to produce the crisis; together they were mutually amplifying.

**Step 6: Test plausibility of each transition.**
For each cause-effect link in the story, ask: how plausible is this transition? Is there evidence for it? Would it typically produce this outcome? What would have to be true for this link to fail?

**Step 7: Actively seek countervailing forces.**
What almost prevented the outcome? Where were there near-misses — points where the causal chain almost broke? This step is critical because story frames suppress countervailing forces. Klein and Hoffman's data show that economics stories almost never include them. An agent constructing a story explanation should be required to complete this step.

---

## Evaluating a Story Explanation: Red Flags

When an agent receives or generates a story explanation, the following red flags should trigger scrutiny:

**Red Flag 1: No countervailing forces.**
If the story proceeds from beginning to end with no mention of factors that worked against the outcome, no near-misses, no branch points where a different outcome was nearly achieved — the story has almost certainly been assembled in hindsight and is over-determining. Reality is almost always messier.

**Red Flag 2: Every transition is "obvious."**
If the story reads as completely inevitable — each step seems to follow naturally from the previous — this may indicate that the story has been reverse-engineered from the outcome rather than forward-traced from the causes. Real causal chains have uncertain transitions. A story with no uncertainty is probably suppressing real uncertainty.

**Red Flag 3: The story has no natural starting point.**
If the story can always be extended further back in time — every cause has a cause, and every enabling condition has prior enabling conditions — then the story doesn't have a principled beginning, just a convenient one. The choice of where to start the story is a substantive decision that shapes attribution. An agent should make this starting-point choice explicit and justify it.

**Red Flag 4: The story doesn't fit the decision context.**
Stories built for accountability (who did wrong?) are different from stories built for prevention (what should we change?). A story optimized for accountability will tend to focus on individual decisions near the end of the causal chain. A story optimized for prevention will focus on structural conditions at the beginning. An agent should know which kind of story it has built.

**Red Flag 5: Key interactions are absent.**
If the story presents all causes as independent (each contributing its portion of the outcome without affecting the others), it is probably missing important interaction effects. The question to ask: "Would any single cause in this story, operating alone, have produced the outcome?" If the answer is no for all of them, the interactions are causally essential and must be in the story.

---

## Story Explanations as Intervention Maps

The most important practical application of story explanations is their use as **intervention maps**: representations of where in a causal chain an intervention would be most effective.

Each link in a causal story is a potential intervention point. The question for each point is:
- **Feasibility:** Is intervention at this point possible? (Can we prevent the child from playing with fire? Can we prevent the rate decision? Can we ensure the door closes?)
- **Leverage:** If we intervene here, how many of the downstream effects does it prevent? (Fixing the door-closing mechanism prevents the spread to the hall, the low-visibility condition, the commander's exposure — many effects for one intervention)
- **Cost:** What does intervention at this point require?
- **Side effects:** Does intervention at this point create new problems?

The fireground story reveals that door-closing mechanisms are high-leverage intervention points — they prevent fire spread without requiring any change in the initial fire-starting conditions. The mortgage story reveals that lending standards were a high-leverage intervention point — changing lending criteria would have broken the interaction between low rates and speculative borrowing.

An agent generating a story explanation for a complex failure should automatically produce an intervention map as a byproduct: a ranked list of intervention points with their leverage, feasibility, and estimated cost.

---

## When NOT to Use Story Explanations

Story explanations are not always the right tool:

1. **When the causal structure is genuinely unknown.** A story gives false precision to an unknown structure. A list is more honest.

2. **When time pressure requires immediate action.** Story construction is expensive. For time-pressured decisions, an event or abstraction explanation supports faster action.

3. **When the audience will anchor on the story rather than act on it.** Stories are persuasive. If the audience is likely to treat the story as the definitive account and resist updating when new information arrives, a more provisional form (list, partial story with flagged uncertainties) may be preferable.

4. **When the story will be used for accountability in ways that will suppress countervailing forces.** If the organizational or legal context will strip out the nuance and use the story to assign blame to a single actor, a story explanation may be more harmful than a less precise form that resists this use.

5. **When the domain is genuinely sports-like.** Some domains really do have high-counterfactual, event-driven causal structures where the last-moment reversal is the main cause. In those domains, story explanations may be over-engineering — adding complexity that isn't actually present in the causal structure.