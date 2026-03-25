## BOOK IDENTITY

**Title**: "Causal Reasoning: Initial Report of a Naturalistic Study of Causal Inferences"
**Author**: Gary Klein, PhD & Robert Hoffman, PhD
**Core Question**: How do people *actually* reason about causality in messy, real-world settings — and how does this differ from the idealized accounts offered by philosophy and science?
**Irreplaceable Contribution**: This paper is irreplaceable because it refuses the comfortable fiction that causal reasoning is (or should be) a clean logical process. Klein and Hoffman go into the wild — newspapers, sports accounts, economic analyses, military post-mortems — and map the *actual taxonomy* of how humans explain why things happen. They discover that causal reasoning is simultaneously a search process (finding candidate causes) and a framing process (building explanatory structures), and that these two processes are *reciprocally constitutive* — each shapes the other in real time. No philosophy paper and no cognitive psychology lab experiment captures this. The Data/Frame Reciprocal Model they propose is a rare artifact: a framework that is both empirically grounded and directly actionable for system designers.

---

## KEY IDEAS (3-5 sentences each)

1. **Causal reasoning in the wild uses five explanation types — Events, Abstractions, Conditions, Lists, and Stories — and the type chosen shapes what causes get found.** Real-world explainers don't apply a single rational method; they reach for the form that feels most comfortable for the domain (sports favors counterfactual events; economics favors complex interactive stories). This isn't a cognitive defect — it is adaptive specialization. Agent systems that can recognize which explanation type is being invoked, and which type is *appropriate*, will reason more robustly than those that treat all causal inference as the same operation.

2. **The search for causes and the construction of explanatory frames are simultaneous and mutually shaping — not sequential.** Klein and Hoffman's Reciprocal Model (Figure 1) shows that you don't first find all the causes and then build an explanation; the explanatory frame you're building determines what counts as a relevant cause to look for. This means that if an agent begins with the wrong frame, it will systematically miss causes that don't fit. Conversely, a richer frame opens up more causal candidates. Agent systems must therefore treat framing as a first-class design concern, not an afterthought.

3. **Three criteria — propensity, reversibility (mutability), and covariation — are the workhorses of causal attribution, but they produce different verdicts for the same situation depending on context.** Propensity asks "could this plausibly lead to that?" Reversibility asks "would the effect disappear if we removed this cause?" Covariation asks "do these things travel together statistically?" Each criterion can be satisfied or violated independently, and context (like the watch-factory example) can flip the verdict entirely. Agents evaluating causes must apply all three criteria, weight them by domain, and remain sensitive to contextual reversal.

4. **The "reductive tendency" is both a cognitive trap and a practical necessity.** Feltovich et al.'s observation — that humans simplify dynamic, nonlinear, simultaneous causality into linear, sequential, static chains — is simultaneously a failure mode and an enabling condition for action. Scientists resist it; managers depend on it. For agent systems, this means there is no universally correct level of causal resolution: the right level of simplification depends on whether the agent is in diagnostic mode (needs richness) or action mode (needs closure). Systems must be able to switch registers.

5. **There is no single "true" cause for indeterminate events — and pretending otherwise is dangerous.** Multiple, interacting, partial causes are the norm, not the exception, in organizational, political, military, and economic domains. The quest for a single "root cause" is an epistemological error that produces oversimplification and distorted interventions. Agent systems must be designed to hold multiple simultaneous causal hypotheses, represent partial causation, and resist the pressure to collapse to a single explanation prematurely.

---

## REFERENCE DOCUMENTS

### FILE: five-forms-of-causal-explanation.md
```markdown
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
```

---

### FILE: reciprocal-framing-and-causal-search.md
```markdown
# The Reciprocal Model: How Frames and Causes Co-Construct Each Other

## The Central Insight

The most important — and most easily missed — finding in Klein and Hoffman's research is not the taxonomy of five explanation types. It is the *process model* that underlies all of them: causal reasoning is not a one-way search from data to explanation. It is a **reciprocal process** in which the explanatory frame being built shapes what data (causes) get noticed, and the causes being noticed shape what explanatory frame gets built.

This is not a metaphor or a loose analogy. Klein and Hoffman are making a specific claim about the mechanics of causal cognition: "The causes identified in a situation (based on propensity, covariation and reversibility) generate the explanatory frames... At the same time, these explanatory frames (events, abstractions, conditions, lists and stories) guide the search for causes. Both processes are occurring simultaneously, as the process of causal reasoning."

They illustrate this with the AIDS example: physicians in the early 1980s were detecting coincidences across their patients — young gay men dying of opportunistic infections. But "these coincidences were not simply a matter of matching patterns because the features hadn't been discovered before, and each case showed different symptoms (because AIDS is an opportunistic infection). Rather, the detection of coincidences was conditioned by the types of mental models and explanations that the physicians had learned."

The physicians were not simply reading off causes from the data. They were using their existing explanatory frames — their models of infectious disease, their knowledge of patient populations, their understanding of immune system dynamics — to perceive certain patterns as causally significant and to ignore others. At the same time, each new cause-candidate (shared blood supply? sexual contact? immune system abnormality?) generated a new frame, which then guided the search for further evidence.

This is the Reciprocal Model, and it has profound implications for how intelligent systems should be designed.

---

## Why This Challenges Standard AI Architecture

Most AI systems for causal reasoning are designed as sequential pipelines:
1. Collect data
2. Apply causal inference algorithm
3. Output causes ranked by strength

This design is wrong in a deep way. It treats the "collect data" step as theory-neutral — as if data just sits there waiting to be processed, and the causal inference algorithm merely extracts what was already there. Klein and Hoffman's research shows this is false. The data that gets collected is *already shaped* by the explanatory frames the reasoner brings to the situation. You find what you are equipped to find.

This means that an agent performing causal analysis with a single fixed frame will systematically miss causes that only become visible under a different frame. An agent that starts with the hypothesis "this system failure was caused by a software bug" will search for software bugs and likely find them, while missing the organizational condition that prevented engineers from flagging the problem, the architectural decision that made the system fragile to this class of bug, and the deployment process failure that pushed untested code to production.

Each of these is a real cause. None of them is visible from within the "software bug" frame.

---

## The Failure Mode: Frame Lock

The most dangerous consequence of the reciprocal model being misunderstood (or ignored) is **frame lock** — the situation where an agent commits to an explanatory frame early, which then causes it to select data that confirms the frame, which reinforces the frame, which causes it to select more confirming data, in a tightening loop that produces a confident but wrong explanation.

This is not a hypothetical failure mode. Klein and Hoffman describe exactly this dynamic in their discussion of the AIDS investigation: before the shared-blood-supply hypothesis was available, investigators were working within frames that made intravenous drug users and hemophiliacs invisible as a relevant population. The frame defined who was "at risk," and therefore who got studied, and therefore what causes were nominated.

Frame lock is especially dangerous in complex, indeterminate domains because:
1. There is enough real data to confirm almost any reasonable frame (the world is complex enough to support many partial explanations)
2. The cost of seeking disconfirming evidence is high (it requires stepping outside your current understanding)
3. Action pressure creates incentives to reach closure quickly (every additional hypothesis cycle delays decision)

For agent systems, frame lock is an architectural risk. If the system's first hypothesis-generation step produces a frame, and all subsequent steps use that frame to filter incoming data, the system will produce confident outputs that are artifacts of its initial framing rather than genuine causal discoveries.

---

## Implications for Agent System Design

### 1. Parallel Frame Generation Before Evidence Collection

Before an agent begins searching for causes, it should generate *multiple candidate explanatory frames* — different hypothesis-structures that would, if correct, produce different search strategies. This is analogous to hypothesis pre-registration in scientific research: you commit to the hypothesis before you look at the data, which prevents confirmation bias.

For example, an agent investigating a production system failure might generate these parallel frames before searching:
- Frame A: This is an event-type failure (something specific went wrong at a specific time)
- Frame B: This is a condition-type failure (a structural vulnerability was always present, this trigger just revealed it)
- Frame C: This is a list-type failure (multiple independent partial causes converged)
- Frame D: This is a story-type failure (a causal chain unfolded over time, each step making the next more likely)

Each frame would then generate a different evidence search. The agent collects evidence under all frames simultaneously, then compares.

### 2. Deliberate Frame Switching After Initial Evidence

Once an initial causal explanation begins to take shape, the agent should deliberately switch to a different frame and ask: "What would I find if I assumed this was a *different kind* of causal story?" This is not mere devil's advocacy — it is a structural defense against frame lock.

A specific protocol: after generating a story-type explanation, the agent should test it by asking "what would an event-type explainer say was the cause?" and "what would a condition-type explainer say was the cause?" If those alternative frames produce genuinely different candidate causes, the agent should investigate them before concluding.

### 3. Frame Transparency in Output

Any causal explanation produced by an agent should be labeled with its explanatory frame. This allows downstream agents or human reviewers to assess whether the frame was appropriate and to request alternative-frame analyses. A system that simply outputs "the cause was X" without revealing the explanatory frame under which X was found is not only uninformative — it is potentially misleading.

### 4. Cause-Frame Iteration Loops

The reciprocal model implies that causal analysis should be *iterative*, not single-pass. Each new cause discovered should be allowed to modify the explanatory frame, which then generates new cause-search directives, which may discover new causes. This loop should continue until the frame and the causes stabilize into a coherent explanation.

The termination condition is not "we have found enough causes" but "additional cause-search under this frame is no longer producing new candidate causes, and the current frame accounts for the causes we have found." This is a richer and more honest stopping criterion.

### 5. The Effect Can Morph — Agents Must Allow It

Klein and Hoffman make a subtle but important observation: "The initial effect may be re-framed and re-cast during the investigation into its causes." The AIDS investigators started trying to explain why gay men were dying of infectious diseases. As the investigation continued, the effect to be explained expanded to include IV drug users, blood transfusion recipients, and eventually anyone with compromised immune function.

This means that an agent's *definition of the effect to be explained* is not fixed at the start of the analysis. The effect is itself a frame, and as causes are discovered, the effect-frame may need to expand, contract, or shift. Agent systems must be capable of updating their target effect-definition mid-analysis, and when they do so, they must restart or extend the cause-search under the new effect-frame.

---

## The Boundary Condition: When Is Single-Frame Analysis Appropriate?

Not all causal analysis requires full reciprocal-model treatment. Single-frame analysis is appropriate when:
- The domain is well-understood and the space of possible causes is small
- The system has deep prior experience with this class of problem
- The cost of additional analysis exceeds the expected benefit of finding additional causes
- The purpose is action (which requires closure) rather than understanding (which requires completeness)

Klein and Hoffman acknowledge that "in order to take action we often need to engage in such simplification." The reductive tendency — the compression of complex causal stories into single-frame explanations — is not always a failure. It is sometimes a necessary condition for action. The skill is knowing when simplification is safe and when it is dangerous.

For agent systems, this translates to a *context-sensitive* design: high-stakes, novel, or complex situations should trigger the full reciprocal-model protocol; routine, well-understood, or time-critical situations should trigger single-frame analysis with explicit documentation that the analysis was simplified.

---

## Summary for System Designers

The Reciprocal Model is not just a description of how humans reason. It is a design specification for how intelligent systems *should* reason about causality. The key engineering requirements it implies are:

1. **Multi-frame initialization**: Generate multiple candidate explanatory frames before evidence collection begins
2. **Frame-sensitive evidence search**: Evidence is collected under specific frames, not theory-neutrally
3. **Cause-frame iteration**: Allow discovered causes to modify frames, and modified frames to generate new cause searches
4. **Effect-definition mutability**: Allow the target effect to be redefined as the analysis proceeds
5. **Frame transparency in output**: Label all causal conclusions with the frame under which they were discovered
6. **Frame-switching as a deliberate step**: After initial explanation, deliberately test alternative frames
7. **Context-sensitive simplification**: Know when full reciprocal analysis is warranted and when simplification is appropriate
```

---

### FILE: three-causal-criteria-for-agent-diagnosis.md
```markdown
# Propensity, Reversibility, and Covariation: The Three Lenses of Causal Attribution

## Overview

Klein and Hoffman identify three primary criteria — drawn from Hume but refined through naturalistic observation — that human reasoners use to evaluate whether something counts as a cause. These are:

1. **Propensity**: Could this plausibly lead to that effect? Is there a mechanism?
2. **Reversibility (Mutability)**: Would the effect disappear if the cause were removed?
3. **Covariation**: Do cause and effect reliably travel together statistically?

These are not three steps in a sequence. They are three independent lenses that can be applied simultaneously, and they can disagree with each other. A candidate cause might satisfy covariation (statistically correlated) but fail propensity (no plausible mechanism). A cause might satisfy propensity (clear mechanism) but fail reversibility (removing it doesn't change the outcome because another cause would take its place). Understanding when each criterion applies, when they conflict, and how context changes their verdicts is essential for building agents that reason about causality as robustly as expert humans do.

---

## Criterion 1: Propensity — "Could This Plausibly Lead to That?"

Propensity is the intuitive check: given what we know about how the world works, is it conceivable that A would produce B? Klein and Hoffman describe it as similar to Hume's "necessary connection" — not that the connection is logically necessary, but that it is *mechanistically plausible*.

**The mosquito-malaria example**: A century ago, researchers suggested mosquitoes caused malaria and yellow fever. They were ridiculed because "no one could see how tiny mosquitoes could contain enough venom to sicken and kill grown men." The propensity criterion *failed* — there was no plausible mechanism. It was only after viruses were identified that the mosquito link became propensitively credible. The statistical covariation was always there; the propensity became available only when the mechanistic understanding arrived.

**Critical implication**: Propensity is *theory-dependent*. What counts as a plausible mechanism depends on what theories and models the reasoner has available. An agent with a richer domain model will find more causes propensitively plausible. An agent with a limited or incorrect domain model will reject real causes because it cannot see the mechanism.

**The chain-length rule**: Klein and Hoffman note that "the strength of the cause will depend on the links between it and the effect. The more links, the less plausible. The strength is generally no greater than the weakest plausible link in the chain." This is a quantitative claim embedded in the propensity criterion: long causal chains are inherently less credible than short ones, because each link introduces uncertainty. An agent constructing causal chains should explicitly track chain length and flag long chains as requiring additional evidence.

**For agent systems**: Propensity checks require the agent to have (or query) a domain model. When an agent nominates a candidate cause, it should immediately ask: "What is the mechanism by which this cause would produce this effect? How many steps does the mechanism require? What is the weakest link in the chain?" If the mechanism cannot be specified, the cause should be flagged as covariation-only (suggestive but not confirmed).

---

## Criterion 2: Reversibility — "Would the Effect Disappear If We Removed This Cause?"

Reversibility (which the literature often calls "mutability") is the counterfactual test: imagine the cause had not happened — would the effect still have occurred? If yes, the proposed cause is not doing causal work. If no, it is genuinely causally relevant.

**The basketball example**: Klein and Hoffman use the image of a last-second three-point shot winning a game. It is easy to imagine the shot missing; if it had missed, the game would have ended differently. The shot is reversible, therefore causally credible. By contrast, a free throw made mid-game would not receive the same causal attribution — it could easily be "replaced" by any other play.

**The enabling condition distinction**: Reversibility allows us to distinguish *causes* from *enabling conditions*. When a match held under paper causes it to burn, the oxygen in the room is an enabling condition, not a cause. We cannot easily imagine the room being void of oxygen; we can easily imagine the match not being held to the paper. The match is more reversible, therefore it is the cause. Enabling conditions are necessary but not *causally salient*.

This is one of the most powerful distinctions in the entire paper. In complex system analysis, the vast majority of identified "causes" are actually enabling conditions — necessary background states that, if absent, would have prevented the failure, but that are not *the* cause in any action-relevant sense. An organization that blames a system failure on "lack of redundancy" (an enabling condition) rather than on the specific architectural decision that created the fragility (the reversible event) has mislocated the cause and will likely implement wrong-headed solutions.

**Time lag complexity**: Klein and Hoffman note that reversibility is cleaner for close-in-time causes. "A cause is identified by tracing back from the effect to the nearest plausible candidate in the causal chain." But greater time lags permit "intervening factors to tangle up the assessment." Dörner's research on microworld tasks shows that participants struggle to understand causal connections when time delays increase — not just because of memory limitations, but because intervening events cloud the picture.

**The person-responsibility application**: "The person responsible is the one whose actions cannot be reversed by anyone else." This is a fascinatingly precise definition. It implies that causal responsibility is not about who was "most involved" or "who was there" but about whose action was irreplaceable — the one that, if undone, would have changed the outcome, and that no one else could have undone on their behalf.

**For agent systems**: Reversibility checks should be a standard component of any causal analysis protocol. For each candidate cause, the agent should explicitly construct the counterfactual: "If this cause had not occurred (or had occurred differently), what would have happened?" This can be implemented as a simple intervention simulation: "Remove cause X from the causal model; what does the model predict for the outcome?" Causes that do not change the predicted outcome should be reclassified as enabling conditions.

Critically, agents should track the *distance* between cause and effect in the causal chain. Close-in-time, easily reversible causes should receive high credibility. Distal causes should receive lower default credibility and require more evidence.

---

## Criterion 3: Covariation — "Do These Travel Together?"

Covariation is the statistical criterion: when the cause is present, is the effect also present? When the cause is absent, is the effect also absent? This is the empirical foundation of causal reasoning — you do not need to understand the mechanism (propensity) or to run a thought experiment (reversibility) if you have enough observations showing reliable co-occurrence.

**The yellow fever example**: Even before anyone understood how mosquitoes transmitted yellow fever, the persistent covariation between mosquito populations and yellow fever cases was strong enough to motivate eradication campaigns that worked. The propensity story (how tiny mosquitoes could cause disease) was unavailable; the covariation signal was strong enough to act on.

**The critical misconception**: "Correlation does not imply causality." Klein and Hoffman address this directly and find the statement misleading: "Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones... Correlation certainly suggests causality, but it does not require a conclusion of causality." The confusion comes from conflating "implies" as "suggests" versus "requires." Correlation *suggests* causation — strongly, systematically, and usefully. It does not *prove* causation. But neither does it prove nothing.

"Sharp observers use coincidence to speculate about causality. The coincidence of prevalence/absence of mosquitoes and presence/absence of Yellow Fever helped control and then understand the disease." Covariation is not a weak or fallacious form of causal reasoning — it is the empirical raw material from which causal understanding is built.

**For agent systems**: Agents should actively seek covariation signals as a legitimate and powerful input to causal analysis. This means:
- Tracking co-occurrence patterns across events and outcomes
- Treating strong covariation as a prompt for propensity investigation ("we see these always travel together — what is the mechanism?")
- Not dismissing covariation-based hypotheses simply because the mechanism is not yet understood
- Flagging covariation-only causes as requiring propensity investigation before action is taken

The appropriate epistemic status of a covariation-only cause is: *this is a credible candidate cause requiring mechanistic investigation; do not act on it as confirmed until propensity is established, but do not ignore it either.*

---

## How Context Changes the Verdict: The Watch Factory Case

Klein and Hoffman describe Einhorn and Hogarth's watch-factory example, which is worth quoting at length because it so cleanly illustrates how context inverts causal attributions:

*If we see a hammer strike and shatter a watch crystal, we would say that the hammer was the cause of the crystal's destruction. But if the observation took place in a watch factory where the hammer was used to test the crystals, and this was the only crystal that shattered, we would now say that the crystal must have been flawed. But if the test hammer shattered crystal after crystal, we might speculate that perhaps the hammer force was set too high.*

Same physical event (hammer + crystal → shattering), three different contexts, three different causal attributions. The change in attribution is not irrational — it is appropriate updating based on information about the base rate of the effect (how often do crystals shatter in this context?) and the presence of alternative explanations (is the hammer or the crystal more variable?).

This has a direct and important implication for agent systems: **causal attribution is not a function of the event alone. It is a function of event + context + base rates + alternative explanations.** An agent that assigns causes without modeling context will produce systematically wrong attributions.

Specifically, agents should ask:
- What is the base rate of this effect in this context? (High base rate → look for structural/condition causes; low base rate → look for unusual events)
- What is the most variable element in this situation? (The most variable element is the most likely cause — this is essentially the method of differences)
- What alternative explanations exist that could account for the same effect?

---

## Criteria in Conflict: What to Do When They Disagree

The three criteria can and frequently do disagree. Agents must be able to handle disagreement between criteria, not just apply them in isolation.

**High covariation, low propensity**: The mosquito-malaria case. This pattern suggests a real but mechanistically obscure cause. Appropriate action: treat as a strong causal candidate, invest in propensity investigation (mechanism research), act on the covariation signal if action is urgent and safe (eradicate mosquitoes even without understanding why).

**High propensity, low covariation**: We have a clear mechanism story, but the proposed cause doesn't reliably produce the effect. This suggests the mechanism is correct but the cause is not sufficient on its own — other enabling conditions must also be present. Appropriate action: search for the enabling conditions that are required alongside this cause.

**High reversibility, low propensity**: The cause is easy to remove counterfactually, and the effect seems to track it, but there's no clear mechanism. This is the "last-second shot wins the game" situation — the correlation with the specific moment is high, but the mechanism is just "basketball." Appropriate action: use as a candidate cause for event-type explanations, but investigate whether structural factors (team skill, prior plays) are the real cause with the event just being the observable trigger.

**All three high**: Strong causal candidate. This is the closest to confirmed causation in naturalistic settings.

**All three low**: Not a cause. Remove from consideration.

---

## Summary Decision Protocol

For each candidate cause C of effect E, an agent should apply:

1. **Propensity check**: What is the proposed mechanism from C to E? How many steps? What is the weakest link? Score: strong / moderate / weak / none

2. **Reversibility check**: If C had not occurred, would E still have occurred? Is C reversible (could it have gone differently)? Who or what was in a position to prevent C? Score: high / moderate / low

3. **Context calibration**: What is the base rate of E in this context? What is the most variable element? What alternative causes exist? How does this context change the above scores?

4. **Covariation check**: Is there statistical evidence of C reliably co-occurring with E? Is this from direct observation, known patterns, or inference? Score: strong / moderate / weak / none

5. **Criteria synthesis**:
   - All three strong → confirmed cause candidate (subject to alternative cause competition)
   - Covariation strong, propensity weak → credible candidate, mechanism investigation required
   - Propensity strong, covariation weak → possible cause, look for missing enabling conditions
   - Reversibility high, others weak → event-type cause candidate, check for structural alternatives
   - Enabling condition flag: if removing C would prevent E but C is not easily imaginable as absent, classify as enabling condition rather than cause

6. **Output**: Labeled cause candidate with criteria scores, enabling condition flags, chain length, and confidence level
```

---

### FILE: reductive-tendency-and-when-to-resist-it.md
```markdown
# The Reductive Tendency: When Simplification Helps and When It Kills

## The Core Tension

Klein and Hoffman surface a fundamental tension in causal reasoning that is rarely made explicit: the forces that make simplification *cognitively necessary* are the same forces that make simplification *epistemically dangerous*. They draw on Feltovich et al.'s (2004) concept of the "reductive tendency" — the systematic human propensity to:

- Chop complex events into artificial stages
- Treat simultaneous events as sequential
- Treat dynamic events as static
- Treat nonlinear processes as linear
- Separate factors that are interacting with each other

The reductive tendency is not a bug. It is, in many contexts, an adaptive feature. Without it, the cognitive load of managing genuine causal complexity would be paralyzing. Managers, military commanders, emergency responders, and organizational leaders *depend* on simplification to act. A firefighter who stops to perform a full causal analysis of why the building is burning will die in the building. A general who demands a complete causal account of why enemy forces are advancing before ordering a response will lose the battle.

But — and this is Klein and Hoffman's critical observation — scientists are "on the lookout for these [reductive] tendencies, whereas managers, leaders, and other kinds of decision makers depend on the reduction to avoid some of the complexity that might otherwise be unleashed." The reductive tendency is a coping mechanism in action-oriented contexts and an error-source in understanding-oriented contexts.

For agent systems, this tension is not abstract. It is a design requirement: the system must know *when* to be a manager (simplify, act) and *when* to be a scientist (resist simplification, investigate). Getting this wrong in either direction is catastrophic.

---

## What Gets Lost in Reduction

The five reductive transformations Feltovich et al. identify each produce characteristic blind spots:

### Chopping complex events into artificial stages
Reality: a complex situation unfolds as a continuous, causally entangled process.
Reduced version: discrete stages with clean handoffs.
What gets lost: feedback effects (how later stages retroactively affect earlier ones), simultaneity (things happening at the same time that interact), and threshold effects (where a small change in the middle of a stage produces a non-linear jump to a different outcome).

**Example in agent systems**: An agent analyzing a software deployment pipeline might treat "development → testing → staging → production" as clean sequential stages. In reality, production issues may be feeding back into development requirements, testing is happening simultaneously with staging, and there may be threshold effects where a certain volume of concurrent users creates non-linear failure modes.

### Treating simultaneous events as sequential
Reality: multiple causes are operating at the same time, interacting with each other.
Reduced version: a timeline where one thing leads to another.
What gets lost: interaction effects. When cause A and cause B are simultaneous and interacting, their joint effect may be non-additive — A+B may produce an effect that is qualitatively different from A alone or B alone.

**The mortgage crisis illustration**: The Federal Reserve rate decisions, the global capital flows from oil exporters, the housing market bubble dynamics, and the relaxation of lending standards were all operating simultaneously and interacting. Any sequential account of the crisis that says "first X, then Y, then Z" misses the interaction structure. The crisis emerged from the simultaneous operation of all these factors, not from a sequential chain.

### Treating dynamic events as static
Reality: the situation is changing as the analysis is being performed.
Reduced version: a snapshot that is treated as stable.
What gets lost: the changing significance of causes over time. A cause that was minor at T1 may become dominant at T3. An enabling condition that was inert at T1 may become active at T2 due to changes in other factors.

**Agent system implication**: Agents performing causal analysis on ongoing situations (as opposed to completed past events) must explicitly model the *temporal dynamics* of their causal model. A causal diagram that was accurate three days ago may be wrong today because the situation has evolved. Systems must have refresh mechanisms that periodically re-evaluate the causal structure.

### Treating nonlinear processes as linear
Reality: causal relationships in complex systems are frequently nonlinear — small causes produce disproportionate effects, thresholds exist, feedback loops operate.
Reduced version: proportional, additive, linear relationships.
What gets lost: threshold effects, tipping points, cascades, and the general class of "last straw" phenomena where the final cause appears disproportionately small relative to its effect.

**Dörner's research**: Klein and Hoffman cite Dörner's work showing that "participants in a microworld task struggle to make sense of causal connections as the time delay increases." Part of this is due to nonlinearity — when causes produce effects that are delayed and nonlinear, the human (or agent) working from a linear model will systematically misunderstand the situation.

### Separating interacting factors
Reality: causes interact with each other — the presence of one changes the effect of another.
Reduced version: independent additive factors.
What gets lost: interaction effects, conditional causation (A only causes B when C is also present), and synergistic or antagonistic relationships between causes.

---

## The Necessity of Reduction: When to Accept It

Klein and Hoffman are careful not to simply condemn the reductive tendency. They note that "in order to take action we often need to engage in such simplification." The key question for any intelligent system is: *when is reduction safe and when is it dangerous?*

**Reduction is safe when**:
- The domain is well-understood and the simplification preserves the causally relevant structure
- The action required is clear even under the simplified model (you don't need to know *why* the building is on fire to get out of it)
- The cost of error under the simplified model is low or recoverable
- Time pressure genuinely prevents fuller analysis
- The system has extensive prior experience with this class of problem and the simplification is based on validated pattern recognition

**Reduction is dangerous when**:
- The situation is novel and prior simplification patterns may not apply
- Interaction effects are likely (multiple causes operating simultaneously)
- Nonlinearity is present (small causes may have large effects)
- The simplified model will be used to design interventions (wrong model → wrong intervention)
- The purpose is system improvement or failure prevention (which requires understanding, not just action)

---

## The Root Cause Fallacy

Klein and Hoffman explicitly flag one of the most dangerous applications of the reductive tendency: the quest for a single "root cause."

"Researchers such as Reason (1990) have shown that accidents do not have single causes, so the quest for some single 'root' cause or a culminating cause is bound to be an oversimplification and a distortion. Nevertheless, in order to take action we often need to engage in such simplification."

This is a remarkably candid statement. The root cause framework is both epistemologically wrong (accidents don't have single causes) and practically useful (organizations need to take specific action). The challenge is to use the root cause framework as a *decision aid* without mistaking it for a *complete description of reality*.

**For agent systems performing post-incident analysis**:
The system should:
1. Identify the most action-relevant cause (the one that, if changed, would most efficiently prevent recurrence) — this serves the function of "root cause" without claiming to be the complete causal story
2. Explicitly document that this is an action-prioritization decision, not a claim that this cause is uniquely or fundamentally responsible
3. Generate a fuller causal story (as many contributing causes and enabling conditions as can be identified) for organizational learning purposes
4. Flag the gap between the "action root cause" and the "complete causal story" so that decision-makers understand what is being simplified

This dual-output design — action-cause + full-causal-story — preserves the practical utility of the reductive tendency while protecting the organization from mistaking the simplified account for the complete truth.

---

## The Time-Lag Problem

One specific aspect of the reductive tendency deserves special attention: the difficulty of reasoning about causal chains with significant time lags.

Klein and Hoffman note: "Dörner (1996) has shown that participants in a microworld task struggle to make sense of causal connections as the time delay increases. Other than a simple memory problem, time lags permit intervening factors to tangle up the assessment."

The reductive tendency in time-delayed causation is to either:
- **Over-attribute to recent causes**: "The system crashed because of yesterday's deployment" — ignoring causes that were established weeks or months earlier
- **Under-attribute to distal causes**: "The root cause was the architectural decision made two years ago" — correct but unhelpfully distal for action

Cigarettes are a canonical example: if you start smoking today and are diagnosed with lung cancer the next day, you don't attribute the cancer to yesterday's smoking. The time lag is wrong for the known causal mechanism. But this means that reasoning about time-delayed causation requires *knowing the expected delay for the mechanism in question* — and that is domain knowledge, not logical inference.

**For agent systems**: When constructing causal chains with significant time lags, the agent must:
1. Know (or query) the expected temporal signature of the proposed mechanism
2. Flag candidate causes whose time-lag doesn't match the expected mechanism signature
3. Track intervening events in the gap between proposed cause and effect
4. Assess whether intervening events are causally relevant (tangling the assessment) or causally irrelevant background noise

---

## The Opposite of Reduction: Story Explanation

The antidote to inappropriate reduction is the story explanation type. Stories resist reduction by explicitly modeling simultaneous causes, interaction effects, and temporal dynamics. The two story examples in Klein and Hoffman's paper — the mortgage crisis and the fatal fire — both demonstrate causal structures that *cannot* be reduced to a single root cause without distorting the truth.

The fireground commander's death involves:
- Parallel causal streams (the spread of fire through the hall; the firefighters' oxygen depletion)
- Interaction between streams (the smoke spread made withdrawal harder; the harder withdrawal caused the depletion to matter more)
- Multiple possible explanations for the final non-withdrawal (disorientation, still searching for residents, ensuring crew had left)
- No single identifiable root cause — the death required the simultaneous presence of all elements

An agent that reduces this to "the commander failed to follow withdrawal protocols" has produced an action-relevant cause (change the protocol; improve training) but has distorted the causal truth and missed the structural interventions that could have prevented the situation from reaching the withdrawal decision at all.

---

## Design Principles for Agent Systems

1. **Explicit reduction-awareness**: When an agent simplifies a causal account, it should flag the simplification type (what kind of reduction has been applied) and estimate what might have been lost.

2. **Domain-sensitive reduction thresholds**: Different domains have different safe-reduction levels. Agents should have domain-specific parameters for how much causal complexity to preserve before simplifying.

3. **Dual-output for high-stakes analysis**: Action-cause (simplified, decision-relevant) + full-causal-story (complex, understanding-relevant).

4. **Interaction-effect flags**: Any causal analysis that involves multiple simultaneous causes should explicitly flag the possibility of interaction effects and, where possible, model them.

5. **Nonlinearity alerts**: When a proposed cause seems disproportionately small relative to the effect, the agent should flag nonlinearity as a possible explanation rather than assuming the causal story is wrong.

6. **Time-lag validation**: All causal claims with significant temporal distance between cause and effect should be validated against the expected mechanism signature for that domain.

7. **Root cause as a decision aid, not a truth claim**: Root cause outputs should always be labeled as action-prioritization decisions, accompanied by the fuller causal story they simplify.
```

---

### FILE: indeterminate-causation-and-partial-explanations.md
```markdown
# Indeterminate Causation: How to Reason About Causes That Cannot Be Fully Known

## The Indeterminacy Problem

One of Klein and Hoffman's most important challenges to conventional thinking is their insistence that many real-world causal questions are *indeterminate* — they have no single correct answer, and no amount of additional investigation would reveal "the" cause.

"Why did the American military situation in Iraq improve from 2004 to 2008? Why did Hillary Clinton lose the contest to become the Democratic candidate for president in 2008? Why did a certain sports team beat another in a championship game?"

Klein and Hoffman's response is direct: "There are no single or uniquely correct answers to such questions, and no amount of research would discover 'the real' cause."

This is not a statement about our ignorance — it is a statement about the nature of the questions. These are indeterminate problems, and treating them as determinate problems (the way philosophers and scientists reason) is a category error.

The distinction is fundamental:

**Determinate causal problems**: There is a fact of the matter about the cause, and investigation can uncover it. Watson and Crick figured out the structure of DNA. HIV was discovered as the cause of AIDS. These investigations led to real discoveries.

**Indeterminate causal problems**: There are multiple valid causal accounts, none of which is "the real" cause. The causes are multiple, partial, and interacting. Even a complete account of every event would not uniquely determine a single cause — it would produce a complex story with many legitimate causal interpretations.

Most of the problems that organizations, managers, military leaders, and AI agents face in practice are *indeterminate*. The goal is not to find the true cause but to construct the *most useful* causal account — one that is actionable, honest about its limitations, and open to revision.

---

## Why This Matters for Agent Systems

An agent designed to "find the root cause" of an indeterminate problem is an agent designed to fail in a specific and dangerous way: it will produce a confident single-cause answer to a question that has no single-cause answer. This answer will feel complete (it satisfies the cognitive demand for closure) while being wrong (it omits the interacting partial causes that together produced the outcome).

The harm is not merely academic. Organizations that act on single-cause diagnoses of multi-cause problems will implement targeted fixes that address one contributing factor while leaving the others intact. The same failure (or a closely related variant) will then recur, attributed to a "different" cause that is actually just another partial factor in the same underlying causal structure.

This is a well-documented pattern in safety engineering, known as "whack-a-mole" failure management: you fix the identified cause, the next incident has a different identified cause, you fix that, and so on — without ever addressing the structural conditions that make the system vulnerable to this class of failure.

---

## The Five Characteristics of Indeterminate Causal Problems

Klein and Hoffman's analysis allows us to characterize indeterminate causal problems along five dimensions:

### 1. Multiple valid causal accounts
For any indeterminate event, multiple causal stories can be constructed, each legitimate, each emphasizing different aspects of the situation. A sports championship can be explained by the winning team's execution, the losing team's errors, the referee's decisions, the weather conditions, injuries, historical rivalry dynamics, and dozens of other factors. None of these accounts is wrong; none is complete.

### 2. No discovery procedure converges to "the" cause
In determinate problems, more evidence and better methods converge toward the true cause. In indeterminate problems, more evidence often produces more competing causal hypotheses rather than convergence. The investigation into Clinton's 2008 campaign failure generated dozens of serious causal analyses that disagreed with each other on fundamental points — and no amount of additional analysis produced consensus.

### 3. Causes are partial and conditional
Each cause in an indeterminate explanation contributes partially to the outcome. No single cause is sufficient; no single cause is uniquely necessary (other combinations of causes might have produced the same outcome). This is radically different from the clean necessary-and-sufficient causation of determinate problems.

### 4. The effect itself may be indeterminate
Klein and Hoffman note that "the initial effect may be re-framed and re-cast during the investigation into its causes." In indeterminate problems, even the description of what happened is contested. Was the AIDS epidemic a failure of the medical system? A failure of public health policy? A story of scientific success in identifying a novel pathogen? The answer depends on who is asking and why.

### 5. Action requires premature closure
Managers and decision-makers must act despite indeterminacy. They must stop their causal investigation at a "certain point" (as Klein and Hoffman note) and commit to an explanation sufficient to support a decision. This premature closure is necessary but is always epistemically unjustified — the investigation was stopped because action was required, not because the cause was found.

---

## Strategies for Reasoning Under Causal Indeterminacy

### Strategy 1: Maintain Multiple Concurrent Hypotheses

Rather than seeking a single cause, maintain multiple candidate explanations simultaneously, each with an assigned credibility level. Do not prematurely collapse to a single explanation. Make decisions based on the distribution of explanations, not on the pretend certainty of a single one.

This is analogous to Bayesian reasoning in technical domains: you don't find "the" probability of an event; you maintain a probability distribution over possible events. For indeterminate causal problems, you maintain a distribution over possible causal accounts.

**Implementation for agents**: A causal analysis output should include a structured list of causal hypotheses, each with:
- Explanatory type (event, condition, story, etc.)
- Evidence supporting it
- Evidence against it
- Actions it would support
- Actions it would contraindicate
- Confidence level

### Strategy 2: Act on the Overlap

When multiple causal hypotheses agree on a specific factor, that factor deserves priority attention even if its causal role is uncertain. If five different causal accounts all include "inadequate testing protocols" as a contributing factor, then improving testing protocols is a high-value intervention regardless of which causal account is most correct.

**Implementation for agents**: Agents should identify the *intersection* of their multiple causal hypotheses — the causes that appear across all or most accounts. Interventions targeting the intersection are robust across hypotheses.

### Strategy 3: Design Reversible Interventions

When you must act under causal indeterminacy, prefer interventions that are reversible (can be undone if the causal hypothesis turns out to be wrong) over interventions that are irreversible (commit the system to a path that may be wrong).

This follows directly from the reversibility criterion: if you treat an intervention as an experiment (will removing this cause reduce the effect?), you want to be able to run the experiment in both directions.

**Implementation for agents**: Agents recommending interventions should flag the reversibility of each proposed intervention and recommend reversible interventions as first steps in genuinely indeterminate situations.

### Strategy 4: Distinguish Closure Type from Truth Claim

When action requires premature closure, explicitly distinguish between:
- **Pragmatic closure**: "For the purpose of making this decision, we are treating X as the cause" (explicitly acknowledging that this is a decision-enabling simplification)
- **Epistemic claim**: "X is the cause of this event" (a truth claim about reality)

These are different statements. Most organizational communication collapses them. Agents should preserve the distinction.

### Strategy 5: Invest in Causal Model Building Before Problems Occur

In domains where indeterminate problems are common, the best preparation is building richer causal models of the domain *before* problems occur. A military analyst who has studied past campaigns has richer explanatory frames available when a new campaign must be analyzed. A financial analyst who has studied past crises can recognize causal patterns in new crises more quickly.

**Implementation for agents**: Domain-specific causal libraries — structured collections of causal patterns, interaction types, and explanatory frames — should be built and maintained as a core knowledge resource. When an agent faces a novel situation, it should query the causal library for analogous patterns before beginning fresh causal analysis.

---

## The Specific Failure of the "Correlation Does Not Imply Causation" Rule

Klein and Hoffman address one of the most commonly invoked cautions in causal reasoning and find it misleading. The statement "correlation does not imply causation" is technically true in the strong sense ("correlation does not prove causation") but practically harmful if interpreted as "correlation tells us nothing about causation."

"Correlation as a suite of mathematical techniques was invented precisely to enable the exploration of causal relations or potential ones. Correlation is a major cue to causality. Even in scientific investigations, correlation is required in order for causation to be proved."

The correct interpretation: correlation is *necessary but not sufficient* evidence of causation. It should initiate investigation, not be dismissed. "It often initiates a fruitful causal investigation."

This is particularly important for agent systems that work with statistical patterns. An agent that dismisses a strong statistical covariation as "not evidence of causation" is throwing away potentially the most important signal it has about the causal structure of the domain. The appropriate response to strong covariation is: "This is a credible causal candidate. What is the mechanism? Are there confounds? Does it pass the reversibility test?"

---

## Knowing When to Stop: The Closure Problem

Klein and Hoffman raise but do not fully solve the problem of when to stop causal investigation. "Managers have to stop at a certain point and make decisions." But when is that point?

The investigators plan for Phase 2 of their research is revealing: "We seek to understand how decision makers achieve closure in their causal explanations of events in which they themselves have causal powers, and prevent themselves from a never ending spiral into further depth. We suspect that decision makers learn by action as much as by analysis — they take some actions in order to see how the situation changes."

This points to an important insight: in indeterminate domains, *action is itself a form of causal investigation*. You take an intervention, observe the effect, and use the observation to update your causal model. This is not the same as acting carelessly — it is treating action as a hypothesis test.

**For agent systems**: In indeterminate domains, agents should be designed to recommend *probe interventions* — small, reversible actions taken specifically to generate information about the causal structure of the situation. The results of probe interventions should then feed back into the causal analysis, updating the distribution of causal hypotheses. This is an active, adaptive approach to causal investigation that respects the indeterminate nature of the problem while still making progress toward actionable understanding.

---

## Summary Principles for Indeterminate Causal Reasoning

1. Explicitly identify whether a problem is determinate (single true cause discoverable) or indeterminate (multiple valid accounts, no convergence to single cause)
2. For indeterminate problems, maintain multiple concurrent causal hypotheses rather than forcing premature convergence
3. Identify the intersection of competing hypotheses — this is where high-value, hypothesis-robust interventions lie
4. Prefer reversible interventions when causal uncertainty is high
5. Distinguish pragmatic closure (for decision purposes) from epistemic claims (about reality)
6. Treat covariation as a credible and important causal signal, not something to be dismissed
7. Build domain-specific causal model libraries as a pre-crisis resource
8. Use action as a form of causal investigation in ongoing dynamic situations
9. Update causal models continuously as new evidence (including the results of interventions) arrives
```

---

### FILE: domain-expertise-and-causal-frame-selection.md
```markdown
# Domain Expertise and the Selection of Causal Frames: What Experts Know That Novices Don't

## The Expertise Gap in Causal Reasoning

Klein and Hoffman make a finding that passes almost without comment in their paper, but that has substantial implications: "Domain knowledge seems critical for reliably identifying the causes mentioned in a media account. However, once the causes are specific, domain knowledge doesn't seem necessary for coding the causes into the explanatory categories."

This is a profound distinction. It separates causal reasoning into two phases with very different knowledge requirements:

1. **Cause identification**: Finding candidate causes in the first place. This requires deep domain knowledge — you must know the domain well enough to recognize what counts as causally relevant.

2. **Cause categorization**: Once causes are identified, classifying them into explanation types (event, condition, abstraction, list, story). This does not require domain expertise — it is a generic analytical skill.

For agent systems, this has direct architectural implications. Domain expertise and analytical structure are separate competencies that can be provided by different system components.

---

## What Domain Expertise Provides: The Propensity Repository

Domain expertise functions primarily as a *propensity repository* — a stored collection of mechanistic knowledge about what kinds of causes can plausibly produce what kinds of effects in this domain.

The mosquito-malaria example illustrates this perfectly. The covariation between mosquitoes and malaria was observable by anyone. But the propensity connection — understanding *how* mosquitoes could transmit disease — required specific domain knowledge (virology, epidemiology, understanding of transmission mechanisms) that was not available until viruses were identified.

An expert in a domain can:
- Quickly assess whether a proposed mechanism is plausible (propensity check)
- Know the expected temporal signature of causal mechanisms (how long between cause and effect)
- Recognize when apparent covariation is likely to be spurious (confounds, common causes)
- Identify enabling conditions that are so standard in the domain that they are invisible to non-experts
- Know the base rates for different classes of outcomes in this domain

A non-expert can observe the same events, identify the same covariations, and apply the same logical framework — but will make systematic errors in propensity assessment and will miss enabling conditions that are domain-specific background knowledge.

**The AIDS example**: The physicians who were detecting the early AIDS cases were not performing sophisticated logical analysis — they were noticing patterns that their domain knowledge told them were unusual. "Each case showed different symptoms (because AIDS is an opportunistic infection)" — recognizing that different symptoms could reflect the *same* underlying immune system failure required deep medical expertise. A layperson seeing different symptoms in different patients would not recognize them as a pattern.

---

## Expertise as Frame Generation

Beyond propensity assessment, domain expertise shapes the *frames* available to an expert reasoner. Different domains have characteristic explanatory structures — the kinds of stories that "work" in that domain.

Klein and Hoffman's data shows this clearly:
- **Sports** accounts favor event-type (counterfactual/mutable) explanations — because sports experts know that individual plays really do matter, and the domain is structured around competitive reversible events
- **Economics** accounts favor complex story-type explanations — because economics experts know that economic outcomes are produced by multiple interacting structural forces operating across time
- **Politics** accounts favor list-type explanations — because political outcomes genuinely are produced by multiple independent contributing factors

This domain-appropriate frame selection is itself a form of expertise. A novice applying the wrong explanatory frame to a domain will generate systematically distorted causal accounts. Someone applying a sports-type (single pivotal event) frame to an economic crisis will conclude that "Alan Greenspan's 2002 rate decision" caused the financial crisis — a conclusion that satisfies the narrative demand for a pivotal moment but misses the multi-year, multi-actor, interactive causal structure that the crisis actually reflects.

---

## Expert Recognition of Enabling Conditions vs. Causes

One of the most important things domain expertise provides is the ability to distinguish *enabling conditions* from *causes* — and to recognize when a proposed "cause" is actually just background that was always present in this domain.

Klein and Hoffman's example: oxygen in a burning room is an enabling condition, not a cause of the fire. Someone who knows nothing about combustion might include "oxygen presence" in their causal list. A chemistry-domain expert immediately classifies it as a background enabling condition because oxygen is ubiquitously present and does not vary in normal fire scenarios.

The enabling condition recognition problem is pervasive in complex domains:
- An organizational analyst looking at a company failure might include "competitive market environment" as a cause — but an industry expert knows that competitive pressure is the constant background condition of all companies in this sector, and is therefore an enabling condition rather than a cause of this specific failure
- A software engineer analyzing a system failure might include "high traffic volume" as a cause — but a domain expert knows that the system was supposed to handle this traffic volume, and the traffic is an enabling condition that revealed a design flaw, not the cause

**For agent systems**: Domain-expert behavior should be modeled by building systems that have access to domain-specific databases of "always-present enabling conditions" for each domain. When these enabling conditions appear as candidate causes, the system should reclassify them and note: "This is a standard enabling condition in this domain. The causally relevant question is what changed — what event or condition *in addition to* this background factor produced this outcome?"

---

## The Reductive Tendency and Expert Efficiency

Klein and Hoffman note that domain experts often simplify more aggressively than domain novices — but their simplifications are calibrated. Feltovich et al.'s "reductive tendency" is not equally dangerous in all hands. An expert's simplification is informed by deep knowledge of what can be safely ignored; a novice's simplification is based on ignorance of what they don't know they're ignoring.

A master chess player who quickly decides on a move has not failed to consider all possibilities — they have efficiently pruned the search space using pattern recognition that compresses the relevant causal structure of the position into a few key features. A novice who makes a quick move is just not considering enough options.

The same dynamic applies to causal reasoning. An experienced incident commander assessing a fire scene may quickly settle on a causal account that a more careful analyst would take an hour to reach — and the commander's rapid account may be more accurate than the careful analyst's, because the commander's pattern recognition correctly identifies the causally relevant features.

**For agent systems**: This means that the goal is not *always* to resist simplification and demand full causal analysis. The goal is to have the domain knowledge necessary to simplify *wisely* — to know what can be safely reduced and what cannot.

Systems should:
1. Be calibrated by domain — have domain-specific models of safe simplification
2. Distinguish between simplification based on domain expertise (probably safe) and simplification based on cognitive convenience (probably dangerous)
3. When uncertain about whether a simplification is safe, flag it explicitly rather than silently accepting it

---

## The Commentator vs. Participant Problem

Klein and Hoffman acknowledge a significant limitation of their Phase 1 research: "It was based on passive onlookers rather than participants in the to-be-explained events, such as decision makers in mortgage banking industry. The causal reasoning is heavily analytical and not grounded in the context of making choices."

This points to an important distinction between two types of causal reasoning expertise:

**Analytical expertise** (the commentator): The ability to construct accurate causal accounts of events after the fact, from a detached position, with full information and no action pressure.

**Practical expertise** (the participant): The ability to reason causally in real-time, under action pressure, with incomplete information, while being causally entangled in the situation being analyzed.

These are different skills, and they produce different kinds of causal reasoning. Commentators can construct rich, complete, accurate causal accounts. Participants must construct *actionable* accounts quickly, while managing uncertainty about whether their own actions will change the causal dynamics they are analyzing.

The physician treating a patient is in a different epistemic position than the epidemiologist studying disease patterns. The military commander ordering an advance is in a different position than the military historian studying the battle. The software engineer debugging a live production failure is in a different position than the post-mortem analyst reviewing logs the next day.

**For agent systems**: Systems that must reason causally in real-time should be designed with the participant constraint explicitly in mind:
- Prioritize actionable causal hypotheses over complete causal accounts
- Flag when action pressure is forcing premature closure
- Identify the highest-leverage reversible action that could generate causal information while also addressing the immediate problem
- Maintain the partial causal account and continue updating it as the situation evolves, even after action has begun

This is fundamentally different from the design of post-hoc analysis systems, which can take full advantage of the commentator's perspective.

---

## Implications for Agent Skill Design

The distinction between domain expertise and analytical structure has a direct architectural implication for agent systems: these two components should be separable.

**The analytical structure component** (domain-independent):
- Recognition of explanation types (event, condition, abstraction, list, story)
- Application of causal criteria (propensity, reversibility, covariation)
- Frame-switching protocols
- Hypothesis-management and closure decision rules
- Reduction-awareness flags

**The domain expertise component** (domain-specific):
- Propensity databases (what mechanisms are plausible in this domain)
- Enabling condition libraries (what background conditions are always present)
- Causal pattern libraries (what explanatory structures work in this domain)
- Temporal signature databases (how long between cause and effect for different mechanism types)
- Base rate knowledge (how common are different types of outcomes in this domain)

This separation enables a powerful design pattern: a single analytical reasoning system paired with swappable domain expertise modules. When deployed in a new domain, you don't replace the reasoning system — you load new domain expertise. When domain knowledge is updated, you update the domain expertise module without changing the reasoning architecture.

This mirrors how human expertise actually works: experienced analysts bring both a general reasoning toolkit and domain-specific knowledge, and it is the combination that produces expert causal reasoning.
```

---

### FILE: causal-stories-as-system-models.md
```markdown
# Causal Stories as System Models: The Rich Structure of Complex Mechanistic Explanation

## Why Stories Are the Ultimate Causal Form

Of the five explanation types Klein and Hoffman identify — events, abstractions, conditions, lists, and stories — stories are qualitatively different from the others. Events, abstractions, conditions, and lists are all ways of naming causes. Stories do something more fundamental: they model the *mechanism* by which causes interact to produce effects.

A story explanation is, in the deepest sense, a *model of the system* — a representation of how the components of a situation interact over time, creating the conditions for each other, cascading, reinforcing, and sometimes creating outcomes that no single component could have produced alone.

This makes story explanations the most powerful and the most demanding form of causal reasoning. They are the most powerful because they reveal interaction effects, conditional causation, and feedback dynamics that simpler explanation types cannot capture. They are the most demanding because they require the most domain knowledge, the most cognitive effort, and the most tolerance for complexity.

For agent systems designed to understand complex domains — organizational systems, software architectures, financial markets, military operations, biological processes — the story explanation is the gold standard. Building systems that can construct, evaluate, and communicate story explanations is one of the most valuable investments in causal reasoning capability.

---

## Anatomy of a Causal Story

Klein and Hoffman provide two extended story examples that reward careful analysis. Let us examine their structure.

### The Mortgage Crisis Story

The Federal Reserve story (reproduced in Table 2 of the paper) has the following structural features:

**Multiple parallel causal streams**: The dot-com bubble collapse, the 9/11 attacks, the fear of deflation, and the vibrant housing market are *simultaneous* background conditions, not sequential events. They are operating at the same time, each contributing to the environment in which the Federal Reserve made its decisions.

**Conditional causation**: The Federal Reserve's rate cuts only became problematic *given* the housing market's unusual dynamics (housing prices can create demand bubbles rather than following normal supply-demand logic). The rate cuts were not inherently catastrophic — they became catastrophic because of the specific conditions in which they operated.

**Interaction between streams**: The global capital flows from oil exporters and Asian economies (Bernanke's "global savings glut") interacted with the Federal Reserve's domestic rate decisions to keep mortgage rates low even when the Federal Reserve was raising the base rate. Neither stream alone explains the low mortgage rates; their interaction does.

**A failure of expectation**: The story includes the judgment that "by 2002 it was clear that rates should be staying neutral or going up, not down." This is a counterfactual embedded in the story — a statement about what *should* have happened and didn't, which is crucial for identifying the reversible decision point.

**Convergence on enabling conditions for failure**: The story culminates in "all of these credit-cheapening forces helped the sub-prime borrowers enter the equation, as looser practices and pressures enticed less-qualified investors." The final effect is not directly caused by any single stream — it is enabled by the convergence of all streams.

### The Fireground Death Story

The fireground story (Table 3) has different structural features:

**Sequential chain with branching**: The story is more linear than the mortgage crisis story — each event enables the next. But it includes branching uncertainty at the end (three alternative explanations for why the commander didn't withdraw) that is honestly preserved rather than collapsed to a single answer.

**Small decisions with large consequences**: A child's paper wrapper catching fire, a rug getting stuck in a door — individually trivial events that compound into a fatal outcome. This illustrates the nonlinear character of many causal chains: the consequence is dramatically disproportionate to any individual contributing event.

**The "no single cause" structure**: "There is no single event or simple sequential chain." The commissioner's death required: the initial fire (caused by the child), the door failing to close (caused by the dislodged rug), the smoke filling the hall (caused by the open door), the firefighters' slow progress (caused by the smoke), the oxygen depletion (caused by the slow progress), the mandatory withdrawal (caused by the depletion), and the commander's failure to withdraw (caused by... something still uncertain). Any single link in this chain, if absent, might have prevented the death.

**Preserved uncertainty**: Unlike most causal accounts, this story honestly preserves the uncertainty about the commander's final decision. Three possible explanations are listed (still searching, ensuring crew safety, disoriented) without collapsing to one. This epistemic honesty is unusual and valuable.

---

## What Stories Reveal That Other Explanations Cannot

### Interaction Effects

The mortgage crisis story reveals that low mortgage rates persisted even when the Federal Reserve raised base rates — because the global capital inflow was offsetting the rate increase. This interaction cannot be represented by a list ("reason 1: rate cuts; reason 2: global capital flows") because the list format suggests additive independent causes. The interaction is the story.

For agent systems analyzing complex failures, the most important causal work is often identifying *where* causes interact — where A makes B worse, where C prevents D from working, where the simultaneous operation of E and F creates G that neither would have created alone.

### Temporal Dynamics

Stories unfold over time. The mortgage crisis story spans from January 2001 through 2006. The decisions made in 2001 (rate cuts in response to the dot-com collapse) only became catastrophic in combination with decisions made in 2004 and 2006 (continued low rates despite recovery signals; gradual rate increases that were too slow). The temporal structure is part of the causal explanation.

This means that story explanations require *timelines* — explicit representations of when causes occurred and how their timing interacted. An agent constructing a story explanation must build and maintain a temporal model of the situation.

### The Role of Expectations

Good causal stories often include *expectations that were violated* — points where things should have gone differently but didn't. The mortgage crisis story includes the observation that "by 2002 it was clear that rates should be staying neutral or going up." This violated expectation is causally important — it marks the point where human judgment failed to respond appropriately to available signals.

For agent systems, this means that causal stories should include not just what happened, but what *should* have happened at each decision point. The gap between actual and appropriate response is often where the causal responsibility lies.

### Convergent and Divergent Causation

The mortgage crisis story features convergent causation: multiple independent causal streams all contribute to the same final condition. The fireground story features more linear causation, but with a divergence at the end (multiple possible explanations for the commander's failure to withdraw).

Agent systems should be able to model both convergent and divergent causal structures. Convergent structures produce resilience problems — removing one stream may not be sufficient if others remain. Divergent structures produce uncertainty problems — the final cause may be genuinely indeterminate.

---

## The Economics Domain as the Natural Home of Story Explanations

Klein and Hoffman's data shows that economics accounts use the most complex story explanations. This is not coincidental. Economic systems have the structural features that make story explanations necessary:

- Multiple actors making decisions simultaneously
- Long time lags between causes and effects
- Nonlinear dynamics (bubbles, crashes, cascades)
- Feedback loops (rising prices creating demand, not just responding to it)
- Global interconnection (domestic decisions interacting with international capital flows)

The dominance of story explanations in economics also comes with a warning: "The economics explanations created an impression of inevitability, a sense that this is how the dominos were fated to fall." Retrospective story explanations can be misleadingly deterministic — they arrange the causes into a coherent narrative that makes the outcome feel unavoidable, suppressing the genuine uncertainty that existed at each step.

**For agent systems**: Story explanations should be evaluated for false determinism. A good story should include:
- At least two or three identified points where the outcome could have been different (counterfactual pivot points)
- Explicit acknowledgment of uncertainty at key junctures
- Identification of the enabling conditions that were required for the story to unfold as it did (conditions that, if changed, would have produced a different story)

---

## Building Story Explanations: A Protocol for Agent Systems

### Step 1: Timeline Construction

Build a timeline of events and conditions relevant to the outcome. This requires:
- Identifying when relevant enabling conditions came into place (prior to the focal period)
- Identifying the sequence of events during the focal period
- Noting simultaneous events that may interact

### Step 2: Causal Link Identification

For each adjacent pair of events/conditions in the timeline, identify the causal link:
- What is the mechanism by which the first event/condition contributed to the second?
- How strong is this link? (What is the weakest link assessment?)
- Is this link conditional on other factors?

### Step 3: Parallel Stream Identification

Identify events/conditions that were operating simultaneously and ask:
- Are these streams independent, or do they interact?
- If they interact, how? (Does A make B worse? Does C prevent D from working? Do E and F together create G?)

### Step 4: Counterfactual Pivot Point Identification

For each causal link, ask:
- Could this have gone differently?
- If it had gone differently, would the final outcome have been different?
- Who or what was in a position to make it go differently?

Identify the two to five points in the story where the outcome was most contingent — where different decisions or conditions would most plausibly have produced a different outcome.

### Step 5: Uncertainty Preservation

Identify points in the story where the causal account is uncertain:
- Points where multiple explanations are possible
- Points where evidence is missing
- Points where the mechanism is clear but the specific cause is not

Do not collapse these uncertainties — preserve them in the story output as explicitly uncertain elements.

### Step 6: Convergence Assessment

Identify the convergent structure: which causes contribute to which effects, and where do multiple streams converge on a single outcome? The convergence points are often where the most robust interventions lie (because they are downstream of multiple contributing streams).

### Step 7: Plausibility Evaluation

For each link in the story, evaluate: "Does this transition make sense given domain knowledge? Is this a plausible mechanism? Does it violate expectations in a way that is well-explained, or in a way that suggests the story is wrong?"

Klein and Hoffman note: "Confidence in a causal chain or interaction depends on the plausibility of each transition. In this regard, it is not clear how to treat violations of expectancies. If a transition is highly plausible then it should add to confidence but also diminish the information value of the account. Transitions that violate immediate expectancies but seem to be well-justified may increase confidence in the account."

This is a subtle point: unexpected-but-explainable transitions *increase* story credibility, because they show that the story can account for surprising features of the situation.

---

## Stories as Living Documents

One final implication of story explanations for agent systems: stories are not static outputs. As new information becomes available — as probe interventions produce results, as the situation evolves, as new witnesses are interviewed — the causal story should be updated.

A story explanation is a *current best model* of the causal system, not a final truth. It should be held and communicated with appropriate epistemic humility, updated regularly, and versioned so that the evolution of the causal understanding is itself part of the record.

This is especially important for ongoing situations (a crisis still unfolding, a system failure still being investigated) where the causal story is necessarily incomplete and where action taken based on the current story will itself change the story.

Agent systems should maintain story explanations as mutable, versioned, living documents — not as final outputs to be filed and forgotten.
```

---

### FILE: closure-decisions-and-the-action-understanding-tradeoff.md
```markdown
# The Closure Problem: When to Stop Reasoning and Start Acting

## The Problem Klein and Hoffman Name But Don't Fully Solve

Among the most intellectually honest moments in Klein and Hoffman's paper is their acknowledgment of a problem they have identified but not resolved: "Our next step, for Phase 2 of this project, is to understand how decision makers achieve closure in their causal explanations of events in which they themselves have causal powers, and prevent themselves from a never ending spiral into further depth."

Closure — the decision to stop investigating causes and commit to an explanation sufficient for action — is one of the hardest problems in practical causal reasoning. The tension is irreducible: more investigation produces better causal understanding but delays action; faster closure enables action but on the basis of an incomplete or wrong causal account.

This is not a problem unique to causal reasoning. It appears in every domain where intelligent systems must decide when they have enough information to act. But causal reasoning makes it particularly acute because:

1. Causal investigation in complex domains can always go deeper (the reductive tendency can always be partially unwound)
2. The cost of acting on a wrong causal account can be severe (wrong treatment, wrong intervention, wrong strategy)
3. The cost of delayed action is also often severe (the situation deteriorates while investigation continues)
4. The investigator is often *causally entangled* in the situation — their investigation is itself changing what they are investigating

---

## The Key Observation: Action as Causal Investigation

Klein and Hoffman's hypothesis for Phase 2 is revealing: "We suspect that decision makers learn by action as much as by analysis — they take some actions in order to see how the situation changes."

This is a profound reframing of the closure problem. The traditional view of the action-investigation relationship is sequential:
- First you investigate until you understand the cause
- Then you act based on that understanding

Klein and Hoffman suggest that in practice (and appropriately), the relationship is *iterative*:
- You investigate until you have a "good enough" hypothesis
- You act on that hypothesis as an *experiment* — a probe designed to generate information as well as to address the problem
- You observe the results of the action
- You update your causal model based on the results
- You investigate further, guided by the updated model
- You act again

This transforms action from the *endpoint* of causal reasoning into an *instrument* of causal reasoning. You don't stop reasoning causally when you start acting; you reason causally through and because of action.

For agent systems, this is not a philosophical nicety — it is a design specification for how the investigation-action cycle should work.

---

## What Makes a Causal Account "Good Enough" for Action?

Although Klein and Hoffman do not fully answer the closure question, their framework suggests several criteria for when a causal account is sufficient to support action:

### 1. Actionable: The Account Identifies Levers

A causal account is actionable when it identifies specific, changeable factors — things that a decision-maker can actually influence. An account that correctly identifies "the fundamental unpredictability of complex systems" as the cause of a failure is epistemically honest but not actionable. An account that identifies "the absence of circuit breakers in the deployment pipeline" is actionable, even if incomplete.

The closure criterion of actionability asks: "Given this causal account, is there a specific action that would plausibly reduce the probability of this outcome in the future?" If yes, the account is actionable. If no, further investigation is needed.

### 2. Proportionate to Decision Stakes

The required depth of causal account should scale with the stakes of the decision. A decision about whether to patch a minor UI bug can be based on a shallow event-type explanation. A decision about whether to redesign a critical security system requires a story-type explanation that models the full causal structure of the vulnerability.

This is calibrated closure: the more important and irreversible the action, the more complete the causal account must be before closure is appropriate.

### 3. Achieves Plausibility Threshold

A causal account is sufficiently complete when the major elements of the situation are accounted for and there are no large, unexplained residuals — surprising features of the outcome that the current causal account cannot explain. If the current story explains 85% of what happened and the remaining 15% seems like noise, closure may be appropriate. If the remaining 15% includes a major surprising feature that the story cannot account for, more investigation is needed.

### 4. Survives Frame-Switching

A causal account that is robust under frame-switching — that looks credible whether you analyze it as an event-type problem, a condition-type problem, or a story-type problem — is more reliably complete than one that only makes sense under one frame. If switching frames reveals gaping holes in the account, those holes are evidence that closure is premature.

---

## The Spiral Problem: When More Investigation Generates More Questions

Klein and Hoffman identify the failure mode on the other side of premature closure: "prevent themselves from a never ending spiral into further depth."

In indeterminate domains, every new cause discovered raises the question of what caused *that* cause. Why did the Federal Reserve keep rates low? Because they feared deflation. Why did they fear deflation? Because of the dot-com bust and 9/11. Why were those events so economically disruptive? Because... and so on. The spiral can continue indefinitely.

The spiral is not just a practical time problem — it reflects a genuine feature of indeterminate causal systems: causes have causes, all the way back (and sideways) as far as you care to look. There is no natural stopping point built into the domain. The stopping point must be imposed by a decision about *purpose*.

**The purpose-relative stopping criterion**: The appropriate depth of causal investigation is determined by the purpose of the investigation. If the purpose is:
- *Blame assignment* → stop at the reversible decision nearest to the effect
- *Legal liability* → stop at the point where legal responsibility can be determined
- *Operational improvement* → stop at the point where actionable interventions can be identified
- *System redesign* → go deeper, to the structural conditions that enabled the problem
- *Scientific understanding* → go as deep as the evidence permits

Different purposes require different depths. An agent system must be designed to accept a purpose parameter and calibrate its closure decisions accordingly.

---

## The Self-Referential Problem: When the Investigator Is Part of the Causal System

Klein and Hoffman note the difference between "passive onlookers" and "participants in the to-be-explained events." When decision-makers are themselves causally entangled in the situation they are analyzing, the causal reasoning becomes self-referential: understanding the cause requires understanding your own role in the cause, which requires understanding the situation, which requires understanding your own role...

This creates a specific failure mode: *motivated causal reasoning*. Decision-makers who are causally entangled in a failure have incentives to construct causal accounts that minimize their own role and maximize the role of external factors. This is not necessarily dishonest — the human mind genuinely perceives situations differently when it is implicated in them.

**For agent systems**: Agents analyzing situations in which their own previous actions may have contributed to the current state must be explicitly designed to:
1. Include their own previous actions as candidate causes
2. Apply the same causal criteria (propensity, reversibility, covariation) to their own actions as to external factors
3. Flag when their own actions are causally relevant to the situation being analyzed

This self-referential causation analysis is one of the hardest problems in agent system design. An agent that cannot identify when it is causally responsible for the situation it is analyzing will systematically produce biased causal accounts.

---

## The Reductive Tendency and Premature Closure: The Unholy Alliance

The reductive tendency and premature closure reinforce each other in dangerous ways. Under time pressure, the reductive tendency suggests "simplify the causal story" and premature closure suggests "stop investigating." Together, they produce confident, simple, wrong causal accounts.

Klein and Hoffman's scientists are described as resisting the reductive tendency and avoiding premature closure — they are "always looking for deeper explanations and further mysteries." But managers "have to stop at a certain point and make decisions" and "depend on the reduction to avoid some of the complexity that might otherwise be unleashed."

The design challenge for agent systems is to provide the manager's practicality without losing the scientist's honesty. The key is *transparency about what has been simplified and when closure was forced*:

- "We stopped the investigation at this point because action was required, not because the causal story was complete"
- "We simplified by treating these simultaneous causes as sequential — this simplification may have cost us the following information..."
- "This root cause designation is a decision-aid simplification. The fuller causal story is available in the appended analysis"

These disclosures do not undo the simplification — they preserve the epistemic integrity of the organization by making clear what is being assumed and what is being acknowledged as uncertain.

---

## A Practical Closure Decision Protocol for Agents

When an agent must decide whether to continue investigating or to produce an output sufficient for action, the following protocol applies:

1. **Check actionability**: Does the current causal account identify specific, changeable factors? If not, continue investigating.

2. **Check proportionality**: Is the current account depth proportionate to the decision stakes and irreversibility? If underdepth for high-stakes decision, continue investigating.

3. **Check unexplained residuals**: Are there significant surprising features of the situation that the current account cannot explain? If yes, continue investigating — these may be symptoms of a wrong frame.

4. **Check frame robustness**: Does the account hold up under frame-switching? If switching frames reveals major holes, continue investigating.

5. **Check purpose alignment**: Is the depth of the current account appropriate for the stated purpose of the investigation? If underdepth for the purpose, continue investigating.

6. **Assess investigation cost vs. expected benefit**: What is the expected gain in causal accuracy from continued investigation, and what is the cost (time, resources, action delay)? If the cost exceeds the expected benefit, close with documented caveats.

7. **If closing**: Produce a closure output that includes:
   - The causal account at the current depth
   - The closure reason (time, resource constraints, actionability achieved)
   - The known gaps and uncertainties in the account
   - The recommended probe actions that would generate the most information for the least cost
   - The update triggers — what new evidence would cause the account to be reopened and revised

8. **Set update triggers**: Define specific observable conditions that would cause the causal account to be reopened. These are the leading indicators that the current account may be wrong — early warning signals that the intervention based on the current account is not producing the expected effect.
```

---

## SKILL ENRICHMENT

- **Root Cause Analysis / Incident Post-Mortems**: This paper's taxonomy of five explanation types gives this skill a genuine framework where previously it often collapsed to "find the root cause." The insight that root cause designation is a decision-aid simplification, not a truth claim, fundamentally upgrades how post-mortems should be structured. Agents should produce dual outputs: an action-cause and a full causal story. The reductive tendency framework helps agents flag when they are oversimplifying.

- **Debugging and Failure Analysis**: The three causal criteria (propensity, reversibility, covariation) give debugging agents a structured protocol for evaluating candidate causes. The distinction between causes and enabling conditions prevents agents from blaming stable background conditions rather than the specific change that triggered the failure. The "chain length weakens plausibility" rule helps agents avoid long-chain speculative diagnoses.

- **Architecture and System Design Review**: The condition-type explanation (identifying structural vulnerabilities that predate any specific failure event) is the native mode of architectural review. Agents performing architecture reviews should be explicitly searching for conditions — pre-existing structural features that create vulnerability classes — not just event-type causes of past failures.

- **Security Auditing**: The reciprocal model (frames and causes co-construct each other) is directly applicable to threat modeling. Security auditors who begin with a specific attack-type frame will find threats matching that frame and miss others. Agents performing security audits should explicitly generate multiple threat frames before searching for vulnerabilities.

- **Task Decomposition and Planning**: The list vs. story distinction matters for task planning. A list of subtasks assumes independence; a story assumes interaction. High-stakes plans with interacting components should be modeled as stories, with explicit identification of interaction effects between tasks. The reductive tendency warning applies directly to plans that decompose a complex task into artificially clean sequential stages.

- **Code Review**: The enabling condition vs. cause distinction is valuable in code review. A bug in a specific function may be the cause of an error; but the absence of input validation throughout the codebase is an enabling condition that made the bug exploitable. Agents doing code review should distinguish between fixing the specific bug (addressing the cause) and fixing the validation framework (addressing the enabling condition).

- **Anomaly Detection and Monitoring**: The covariation criterion, properly understood, is the foundation of anomaly detection. Klein and Hoffman's rehabilitation of correlation as a legitimate causal signal (not to be dismissed) supports investment in pattern-detection systems. The key is building systems that treat covariation as "credible candidate cause, mechanism investigation required" rather than either "confirmed cause" or "meaningless correlation."

- **Strategic Planning and Forecasting**: The indeterminate causation framework is directly applicable to forecasting in complex domains. Agents producing forecasts should maintain multiple causal accounts of the domain being forecasted, not a single model. The intersection of multiple accounts identifies the most robust predictions. The divergence between accounts identifies the key uncertainties.

- **Multi-Agent Coordination**: The reciprocal model (frame shapes search; search shapes frame) has direct implications for multi-agent coordination. When multiple agents are investigating the same situation with different frames, their outputs should be explicitly compared for frame-diversity before synthesis. Agents working from the same frame will produce correlated (not independent) assessments even if they appear to be independent.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The closure decision protocol maps directly onto orchestration design: when should an orchestrator continue spinning up investigation agents versus committing to an output? The proportionality criterion (closure depth proportionate to decision stakes) gives orchestrators a concrete parameter to optimize. The frame-diversity requirement suggests orchestrators should deliberately assign different initial frames to parallel investigation agents.

- **Task Decomposition**: The five explanation types correspond to five decomposition strategies. Event-type problems decompose around reversible decision points. Condition-type problems decompose around structural features. Story-type problems decompose into parallel causal streams that must be modeled jointly. The reductive tendency warning applies directly: task decomposition that treats simultaneous processes as sequential, or interactive components as independent, will produce plans that fail at the interaction points.

- **Failure Prevention**: The dual-output design (action-cause + full causal story) is the core of failure prevention. Action-causes support immediate intervention; full causal stories support structural improvement. The enabling condition framework points toward proactive failure prevention: identify the structural conditions that make systems vulnerable before specific triggers reveal them.

- **Expert Decision-Making**: The commentator vs. participant distinction is the most important insight for modeling expert decision-making. Real expert decisions are made under action pressure, with incomplete information, while the decision-maker is causally entangled in the situation. Agents modeling expert decision-making must account for these constraints — they cannot simply model the reflective post-hoc analyst. The probe-action insight (action as causal investigation) is how experts actually close the gap between analysis and action without sacrificing learning.