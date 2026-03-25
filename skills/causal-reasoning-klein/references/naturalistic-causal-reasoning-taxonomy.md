# The Five Forms of Causal Explanation: A Taxonomy for Diagnostic Agents

## Why This Matters for Agent Systems

When an AI agent is asked to diagnose a failure, explain an outcome, or attribute responsibility, it is doing causal reasoning. Most agent architectures treat this as a single capability: "find the cause." But Klein and Hoffman's naturalistic study reveals that causal reasoning in the real world takes at least five structurally distinct forms, each suited to different problem types, each with different strengths and failure modes. An agent that only uses one form will systematically produce explanations that feel wrong, miss critical factors, or fail to support good decisions.

This document teaches the taxonomy — not as abstract categories, but as operational modes that any diagnostic or explanatory agent should be able to invoke deliberately.

---

## The Three Atomic Forms

### 1. Events (Counterfactual Anchors)

An **event explanation** identifies a specific, reversible occurrence as the cause — something that could have gone the other way. Klein and Hoffman call these "mutable" events. The paradigm example: late in Super Bowl XLII, Eli Manning nearly got sacked but spun away and completed a pass that his receiver caught against his helmet. Most accounts of the game cited this play as *the* cause of the Giants' victory. Why? Because it was easy to imagine it failing. If Manning goes down, the Giants lose. The play was both necessary (the team would have lost without it) and sufficient (at that point, the game turned on it).

**Key properties of event explanations:**
- They are temporally proximate to the effect
- They are mentally reversible — you can easily imagine the counterfactual
- They satisfy the "reversibility criterion" for causation: remove the cause, the effect disappears
- They are more convincing when the event is dramatic (a 3-point buzzer-beater is cited more than a free throw, even if the free throw contributed equally to the margin)

**What event explanations are good for:**
- Assigning accountability (who made the decision that turned the tide?)
- Communicating explanations to stakeholders who need a single narrative handle
- Triggering rapid action (the rug caught in the door — fix that single failure point)

**What event explanations miss:**
- Structural conditions that made the event possible
- The accumulation of smaller factors that made the outcome fragile
- Slow-moving causes with long time lags (smoking → cancer; decades of deregulation → financial crisis)

**Agent design implication:** Event explanations are the *default* for human causal reasoning, especially under time pressure. Any agent generating explanations for human decision-makers should be capable of offering event-level accounts — but should flag when an event explanation is being offered for a problem that is structurally multi-causal.

---

### 2. Abstractions (Synthesizing Themes)

An **abstraction explanation** takes multiple causes — possibly including counterfactuals, conditions, and events — and synthesizes them into a single higher-level answer. In basketball, a series of mistakes by the New York Knicks is synthesized as: "poor execution in the fourth quarter." The abstraction doesn't list the mistakes; it names their shared character.

**Key properties of abstraction explanations:**
- They offer a single answer to "why did this happen?" even when the underlying causes are plural
- They are typically presented without their supporting exemplars (the details are implicit)
- They compress complexity into a label that can be communicated and remembered
- They enable rapid coordination: if everyone agrees the problem is "poor execution," they can align on a response

**What abstraction explanations are good for:**
- Communication across domains (explaining the housing crisis as "greed" — oversimplified but coordinable)
- Generating hypotheses for investigation ("if this is a coordination failure, look for these symptoms")
- Framing problems for leaders who need to act, not analyze

**What abstraction explanations miss:**
- The specific, actionable causes beneath the abstraction
- The cases where the abstraction is wrong (not all of the Knicks' mistakes were "poor execution" — some were defensive failures, some were coaching decisions)
- The possibility that different observers would abstract differently, and those differences matter

**Agent design implication:** Abstractions are excellent for routing and triage — determining *which kind* of problem this is — but dangerous for root-cause analysis. An agent should know when it has produced an abstraction and should be able to expand it on demand.

---

### 3. Conditions (Prior Enabling States)

A **condition explanation** cites a prior state of the world — not a specific event during the to-be-explained episode, but a background feature that made the outcome possible. In sports: if a key player was too injured to play, that injury is a condition. It didn't happen during the game. In economics: the development and collapse of bubbles; the housing market dynamic where rising prices increase demand (because people expect further rises) — these are conditions, not events.

**Key properties of condition explanations:**
- They are temporally prior to the episode being explained
- They are often less mutable than events — harder to imagine away (you can't easily counterfactualize "what if there had been no nationalism before World War I?")
- They are often lawful or structural: regularities, market forces, demographic trends
- They explain *why* the system was vulnerable to the precipitating event

**What condition explanations are good for:**
- Prevention and system hardening (fix the condition, prevent many possible events)
- Explaining why similar events produce different outcomes in different contexts
- Long-horizon analysis and strategic assessment

**What condition explanations miss:**
- They can be trivially true (of course the room needed oxygen for the fire; that's an "enabling condition" not a "cause")
- They can be used to deflect accountability ("the system was set up to fail" — but who set it up?)
- They can create an illusion of inevitability, as if no individual decision could have changed anything

**Agent design implication:** A mature diagnostic agent should distinguish between precipitating events and enabling conditions. When asked "why did this happen?", it should offer both levels: the event that triggered the outcome AND the conditions that made the system vulnerable to that trigger.

---

## The Three Compositional Forms

These forms bundle the atomic explanations into higher-level structures.

### 4. Lists (Undifferentiated Multi-Causal Accumulations)

A **list explanation** is simply: multiple reasons, stated in parallel, with no claim about their relative weight or how they interact. "The reasons Hillary Clinton's campaign failed: she was perceived as inevitable, she underestimated Obama's ground game, she had high unfavorable ratings, she failed to compete in caucus states..." 

**Key properties of list explanations:**
- They are politically safe — offering a list avoids having to claim which cause was *really* decisive
- They are appropriate when the causes are genuinely multiple and non-interacting
- They are common in political analysis (as Klein and Hoffman found — all political incidents in their study used lists)
- They are cognitively honest about uncertainty: "I don't know which of these was primary"

**What list explanations are good for:**
- Scoping investigations (here are all the factors worth examining)
- Reporting to audiences who will weigh the factors themselves
- Early-stage diagnosis before the causal structure is clear

**What list explanations miss:**
- The interactions between causes (factors that amplify or suppress each other)
- The sequencing that reveals mechanism
- The possibility that the list is radically incomplete

**Agent design implication:** Lists are the appropriate output when a diagnostic agent has low confidence about causal structure. But a list should be marked as a list — not presented as if it were a story or a single-cause explanation. Lists should trigger further investigation, not terminate it.

---

### 5. Stories (Complex Mechanisms with Interacting Causes)

A **story explanation** is the most informationally rich form. It presents causes acting in sequence, in parallel, and in interaction — revealing the *mechanism* by which the outcome was produced. Klein and Hoffman's example of the fireground commander's death is a story: the mother turns on the gas stove → the child plays with paper → it catches fire → he hides it behind the sofa → the sofa catches fire → the mother flees → the rug gets caught in the door → the door doesn't close → smoke fills the hall → firefighters' visibility is impaired → they run low on oxygen → they withdraw → the unit commander fails to withdraw → he dies.

Each transition is a cause-effect link. Each link must be plausible for the story to hold. The story for the Federal Reserve and the subprime crisis is even more complex: parallel causes (the dot-com bubble, 9/11 fears, housing market dynamics, global capital flows) interacting with sequential decisions (rate cuts, delayed rate increases, loosened lending standards) to produce a cascading outcome.

**Key properties of story explanations:**
- They reveal mechanism, not just correlation
- They show how causes interacted — which is essential for prevention
- They satisfy the propensity criterion: you can trace *why* each transition happened
- They allow identification of intervention points: any link in the chain where a different decision would have broken the causal sequence
- Confidence in the story is proportional to the plausibility of each transition

**What story explanations are good for:**
- Deep diagnosis where prevention is the goal
- Training and learning (stories are memorable; they convey how systems fail)
- High-stakes decisions where the mechanism of failure must be understood, not just labeled
- Identifying leverage points for intervention

**What story explanations miss:**
- They can create an illusion of inevitability ("of course it ended that way — look at all those dominos falling")
- They can be constructed post-hoc to fit any outcome (a story can be reverse-engineered from any result)
- They are expensive to produce — they require deep domain knowledge and significant time
- They can suppress attention to countervailing forces (only 3 of 18 economics stories in the study cited countervailing factors, vs. 12 of 38 sports stories)

**Agent design implication:** Story explanations are the gold standard for diagnostic quality, but they are the most expensive to generate and the most prone to hindsight bias. An agent producing a story explanation should explicitly mark the plausibility of each transition and should actively seek countervailing factors — forces that almost prevented the outcome — as a check on false inevitability.

---

## The Taxonomy as an Operational Decision Tool

When a diagnostic agent receives a request to explain an outcome, it should not default to a single explanation form. Instead, it should ask:

1. **What is the consumer of this explanation going to do with it?**
   - Needs to act immediately → Event explanation (find the reversible trigger)
   - Needs to coordinate a team → Abstraction (shared label)
   - Needs to prevent recurrence → Story (mechanism) + Condition (vulnerability)
   - Needs to scope an investigation → List (all candidate factors)
   - Needs to understand structural risk → Condition (enabling state)

2. **How much is known about the causal structure?**
   - Unknown structure → List
   - Partial structure → Abstraction or Events
   - Well-understood mechanism → Story

3. **What is the time horizon?**
   - Immediate → Event or Abstraction
   - Medium → Events + Conditions
   - Long-term systemic → Conditions + Story

4. **What kind of domain is this?**
   - Sports/discrete contest → Event explanations are natural and honest
   - Economics/complex system → Stories and Conditions are necessary; Lists are insufficient
   - Politics/social systems → Lists are epistemically honest; beware false stories

The taxonomy is not a hierarchy where Stories are always better. Each form has its domain of appropriate use. The failure is using the wrong form for the context — offering a single-event explanation for a complex systemic failure, or producing a story that creates false inevitability for a contingent outcome.