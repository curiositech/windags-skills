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