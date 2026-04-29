# The Five Forms of Causal Explanation: A Taxonomy for Intelligent Reasoning Systems

## Why This Matters for Agent Systems

When an AI agent is asked "why did this happen?" or "what caused this failure?" or "what is driving this pattern?", the agent faces a choice that most systems ignore: *what kind of explanation am I building?* Klein and Hoffman's naturalistic study of real-world causal reasoning reveals that humans do not apply a single universal method of causal inference. Instead, they invoke one of five qualitatively distinct explanation types — and the type they choose both reflects and shapes what they are able to discover. Agent systems that treat all causal inference as the same operation will be systematically blind to the richness available to them.

This reference document teaches the five forms, their characteristic domains, their strengths and failure modes, and their implications for agent design.

---

## The Five Forms

### 1. Events (Counterfactual/Mutable Causes)

An event-based causal explanation identifies a *specific, reversible action or decision* as the cause of an outcome. The hallmark is mutability: you can easily imagine the event going the other way, and the outcome changing accordingly. Klein and Hoffman call these "close counterfactuals."

**Canonical example**: Late in Super Bowl XLII, Eli Manning escaped a sack and completed a pass caught against the receiver's helmet. Most accounts identified this play as *the cause* of the Giants' victory — because it was easy to imagine Manning being sacked, and if that had happened, the outcome would have reversed.

**Why event explanations are compelling**: They satisfy the reversibility criterion (remove the cause, remove the effect) and often the propensity criterion (there's a clear mechanism from the event to the outcome). They are *narratively satisfying* because they create a moment of contingency — a pivot point.

**The failure mode**: Event explanations privilege recency and drama over structural importance. The last-minute basket gets credit for a victory that was built over forty minutes of play. In complex systems, the event that *triggers* a failure is often not the *cause* of the failure — it is merely the final straw in a long causal chain. Blaming the triggering event while ignoring the structural conditions that made the system fragile is a classic post-hoc error.

**Domain distribution**: Klein and Hoffman found that sports accounts heavily favor event explanations (17 events across 38 sports incidents). This makes sense: sports are designed to be reversible, zero-sum, and time-bounded. The last play really does matter disproportionately.

**Agent system implication**: When an agent is performing root cause analysis on a system failure, debugging a pipeline error, or reviewing a security incident, it should explicitly ask: *Am I anchoring on the triggering event because it is recent and dramatic, or because it is structurally significant?* The triggering event should be documented but not mistaken for the full causal story. An agent should flag event-type explanations as "incomplete pending structural analysis."

---

### 2. Abstractions (Synthesizing Explanations)

An abstraction takes multiple specific causes — often a collection of events — and synthesizes them into a single higher-level explanation. Where an event says "they lost because of the last-minute turnover," an abstraction says "they lost because of poor execution in the fourth quarter." The abstraction is not wrong — it is a genuine synthesis — but it hides the specific causal mechanisms inside a conceptual container.

**Canonical example**: A series of mistakes by the New York Knicks were synthesized into the explanation "the Knicks lost because of poor team chemistry." Individual plays (events) are collapsed into a dispositional or structural characterization.

**When abstractions are useful**: Abstractions are powerful when the specific events are numerous, heterogeneous, or individually weak. When no single event stands out as dominant, an abstraction allows the reasoner to name the *pattern* across the events. Abstractions are also useful for communication — telling a commander "the operation failed due to inadequate intelligence preparation" is more actionable than reciting thirty individual intelligence failures.

**The failure mode**: Abstractions can masquerade as explanations while providing no actual causal mechanism. "They lost because of poor leadership" or "the economy collapsed due to greed" are abstractions that feel explanatory but are actually just labels. They give the illusion of understanding without the substance. Klein and Hoffman note that the condition theme is "sometimes used in a simplistic fashion" — the economic recession is blamed on greed, a sports team's success attributed to better coaching or "wanting it more."

**Agent system implication**: Agents generating explanations for complex system behaviors should flag when they have produced an abstraction: *This is a synthesizing label, not a causal mechanism. What specific events or conditions does this abstraction stand for?* Abstraction-type explanations should trigger a secondary decomposition step that either confirms the abstraction with specific evidence or replaces it with a more granular account. An abstraction is a hypothesis about pattern, not a confirmed cause.

---

### 3. Conditions (Prior State Explanations)

A condition explanation identifies a *pre-existing state or structural feature* that was present before the focal event began, and treats that state as the cause. Conditions differ from events because they are not easily reversible — they are background facts rather than pivotal choices.

**Canonical examples**:
- A key player was injured before the game began, so the team lost (the injury is a condition, not an event in the game).
- The rise of nationalism in early twentieth-century Europe is cited as the cause of World War I — not the assassination at Sarajevo (which is an event explanation), but the structural condition that made the assassination explosive.
- The development of a housing bubble is a condition that preceded and enabled the mortgage crisis.

**When conditions are essential**: Many failures cannot be understood without conditions. A system that crashes under load may have crashed because of a specific request (event), but the *real* cause may be an architectural condition — an inadequate memory allocation scheme that was always going to fail under certain circumstances. The event just revealed the condition.

**The failure mode**: Condition explanations can feel deterministic and can suppress counterfactual thinking. If "nationalism caused WWI," then the assassination is just an irrelevant trigger, and there was nothing anyone could have done. This fatalism can be epistemologically convenient (it removes individual responsibility) but is often factually unjustified. Klein and Hoffman note that economics explanations in particular "created an impression of inevitability, a sense that this is how the dominos were fated to fall" — and that most economics explanations fail to include countervailing forces or opportunities for events to unfold differently.

**Agent system implication**: Agents performing architectural review, security auditing, or system health assessment should explicitly look for condition-type causes — structural features that create vulnerability regardless of which specific event triggers a failure. Condition-identification is the core of proactive (rather than reactive) analysis. An agent that only explains events will always be in reactive mode. An agent that identifies conditions can anticipate failure classes before they materialize.

---

### 4. Lists (Multicausal Collections)

A list explanation simply enumerates multiple reasons why something happened, without specifying how they interact, which is most important, or what mechanism connects them to the outcome. Lists are honest about complexity but surrender the ambition to explain mechanism.

**Canonical examples**:
- The reasons Hillary Clinton's presidential campaign failed: a list of strategic errors, demographic misreads, media dynamics, opponent strengths, and timing factors.
- The reasons the New England Patriots lost the Super Bowl: execution failures, defensive breakdowns, the opponent's unexpected resilience.

**When lists are useful**: Lists are appropriate when causes are genuinely multiple and parallel, when there is no clear dominant cause, and when the purpose is documentation rather than deep diagnosis. A list preserves epistemic humility — it does not pretend to know which cause was most important when that is genuinely uncertain.

**The failure mode**: Lists can be a refuge from hard analytical work. Listing seven causes of a failure without specifying their relative importance, their interactions, or the mechanism by which they produced the outcome does not actually explain anything — it catalogs. Klein and Hoffman observe that political accounts relied heavily on lists. This may reflect the genuine complexity of political causation, but it may also reflect the tendency to enumerate without integrating.

**Agent system implication**: When an agent produces a list of causes, it should flag this as an incomplete explanation and trigger follow-on analysis: *Can these causes be ranked by importance? Do they interact? Are some causes sufficient while others are merely contributing? Is there a structural story that connects them?* Lists should be intermediate outputs, not terminal explanations. An agent that returns a list when asked for a root cause analysis has done useful work but has not finished the job.

---

### 5. Stories (Complex Mechanistic Explanations)

A story explanation provides a detailed account of *how* multiple causes interacted over time to produce an outcome. Stories include causal chains, parallel causal streams, interactions between causes, feedback loops, and conditional branchings. They are the richest and most mechanistically complete form of causal explanation.

**Canonical examples**: Klein and Hoffman provide two extended story examples worth studying carefully:

The first is the U.S. Federal Reserve's role in the mortgage crisis — a multi-threaded account involving the dot-com bubble, the 9/11 attacks, fear of deflation, sequential rate cuts, housing market dynamics that violated normal supply-and-demand logic, global capital flows, and finally the relaxation of lending standards. Each element is causally connected to others; causes interact rather than merely accumulate.

The second is the death of a fireground commander — a story where a mother's desire to keep her apartment warm while bathing her children, a child playing with paper near a flame, a frightened child hiding burning paper behind a sofa, a door propped open by a dislodged rug, smoke filling the hall, firefighters running low on oxygen, a mandatory withdrawal, and a lieutenant who did not withdraw — all link together into a fatal outcome. "There is no single event or simple sequential chain."

**Why stories are powerful**: Stories satisfy all three causal criteria simultaneously — propensity (each link is mechanistically plausible), reversibility (each event could have gone differently), and covariation (the pattern of causes reliably produces the pattern of effects). They also reveal *interaction effects* — places where cause A only becomes dangerous because cause B is also present.

**The failure mode**: Stories can create an illusion of inevitability. Once the story is assembled in retrospect, it feels as though the outcome was always going to happen. This "hindsight bias" effect suppresses the legitimate uncertainty that existed at each decision point. Stories also require extensive domain knowledge to construct correctly — Klein and Hoffman note that "domain knowledge seems critical for reliably identifying the causes mentioned in a media account." An agent without adequate domain knowledge will construct plausible-sounding but factually wrong stories.

**Agent system implication**: Story-type explanations are the gold standard for complex system post-mortems, incident analysis, and strategic planning. Agents should be capable of constructing story explanations when the domain is complex, when interaction effects are likely, and when the purpose is to prevent future failures rather than merely document past ones. Story construction requires: (a) a timeline of events and conditions, (b) explicit linkages between each element and subsequent elements, (c) identification of parallel causal streams, (d) assessment of interaction effects, and (e) identification of the key reversible decisions where the outcome could have been different.

---

## How the Five Forms Interact

Klein and Hoffman observe that "sometimes these three types of explanations (an event, an abstraction, a condition) were offered by themselves, but often they were bundled together." Events and conditions are the *primary* materials; abstractions, lists, and stories are *bundling structures* that organize multiple primary causes.

The taxonomy is not a strict hierarchy — a story can contain lists, abstractions can emerge from stories, and conditions can frame which events are even considered. The key insight for agent systems is that **the form of explanation chosen at the start shapes what causes get discovered**. An agent that defaults to event-type explanations will find events. An agent that defaults to condition-type explanations will find structural vulnerabilities. An agent designing a causal explanation process should therefore *deliberately cycle through multiple explanation types* before settling on a conclusion.

---

## Decision Protocol for Agent Systems

When an agent is tasked with causal explanation, the following protocol applies:

1. **Identify the domain and appropriate explanation type**: Sports-like (time-bounded, zero-sum, high-drama) → prioritize event search. Economics-like (multi-actor, multi-time-scale, structural) → prioritize story construction. Political-like (multi-causal, indeterminate) → build honest list, then attempt story.

2. **Apply all three causal criteria to each candidate cause**: Propensity check (is there a plausible mechanism?), reversibility check (would removing this change the outcome?), covariation check (does this reliably co-occur with the effect?).

3. **Flag abstraction-type explanations for decomposition**: Any explanation that names a pattern without specifying mechanism should trigger a "decompose this abstraction" step.

4. **Check for condition-type causes before concluding**: Ask explicitly: "What pre-existing structural features made this outcome possible or likely? Would the event-causes have mattered in a different structural context?"

5. **Attempt a story explanation for high-stakes analyses**: If the situation is complex and the stakes are high, invest in constructing a story that links conditions, events, and interactions into a mechanistic account.

6. **Flag lists as incomplete**: Any list of causes should be followed by an attempt to rank, interact, or story-ify the elements.

7. **Test the story for counterfactual richness**: A good story explanation should identify at least two or three points where the outcome could have been different. If the story feels completely inevitable, it has likely been over-determined in retrospect.