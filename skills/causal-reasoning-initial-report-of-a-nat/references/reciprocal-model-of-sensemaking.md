# The Reciprocal Model: How Causes and Frames Co-Constitute Each Other

## The Central Insight

Most models of reasoning treat diagnosis as a pipeline: observe data → form hypotheses → test hypotheses → reach conclusion. Klein and Hoffman's research reveals something more unsettling and more true: **causes and explanatory frames construct each other simultaneously**. What you identify as a potential cause depends on what kind of explanation you're already building. And what explanation you build depends on which causes you've already noticed. This is not a sequential process — it is a loop, running continuously, where each iteration shapes the next.

This is the Reciprocal Model, described by Klein and Hoffman as an application of the Data/Frame theory of sensemaking (Klein et al., 2007): "explanations are frames that get built out of data and that data are defined by the frames being used to fashion explanations."

The implication is profound for any intelligent system: **there is no neutral observation of causes**. Every time an agent begins to analyze why something happened, it is already bringing a frame — an implicit theory of what kind of event this is, what kinds of causes operate in this domain, what counts as relevant. That frame filters what causes get noticed. The causes that get noticed reshape the frame. The process continues until some closure is reached — not because the "true" cause has been found, but because the frame and the causes have achieved sufficient mutual coherence.

---

## The AIDS Case: A Demonstration

Klein and Hoffman use the early investigation of AIDS as the paradigm case of the Reciprocal Model in action.

The physicians detecting the early cases of AIDS were "noticing coincidences across their patients, but these coincidences were not simply a matter of matching patterns because the features hadn't been discovered before, and each case showed different symptoms (because AIDS is an opportunistic infection). Rather, the detection of coincidences was conditioned by the types of mental models and explanations that the physicians had learned."

Unpack this: the doctors weren't starting from a blank slate, neutrally tallying symptoms. They were pattern-matching against their existing models of infectious disease, immune function, and epidemiology. Those models shaped which coincidences were *noticeable* as coincidences. At the same time, the coincidences they noticed were reshaping their mental models — forcing them to entertain new explanatory frames (a novel immune disorder? an environmental cause? a transmissible agent?). Each new frame suggested new things to look for. Each new data point either reinforced or destabilized the current frame.

The investigation was iterative and reciprocal throughout. The "effect" being explained was itself a moving target — it started as "why are gay men dying of opportunistic infections?" and gradually expanded to include IV drug users, blood transfusion recipients, and others. The framing of the effect was co-evolving with the causal investigation.

This is fundamentally different from a hypothesis-testing pipeline. The hypothesis space itself was being revised during the investigation.

---

## What the Reciprocal Model Predicts About Reasoning Failures

The Reciprocal Model explains several important failure modes that a pipeline model cannot:

### 1. Frame Lock (Premature Closure on the Wrong Explanation Type)
Once an agent — human or artificial — has adopted a particular explanatory frame (say, "this is an event-level failure caused by one bad decision"), that frame will filter subsequent cause identification. Causes that don't fit the event frame (slow-moving conditions, distributed responsibility) will be harder to notice, even if they're present in the data. The frame and its supporting causes will become mutually reinforcing, creating the illusion of completeness.

This is why Klein and Hoffman's fifth assumption ("in causal reasoning, people identify an effect, nominate causes, and select the best one") is wrong: the effect itself morphs. If you're locked into a frame, you won't notice when the effect has changed shape.

### 2. Domain-Frame Mismatch
Different domains have characteristic explanatory frames. Sports cultivates event-frame thinking (the miracle play, the last-second shot). Economics tends toward condition-frame thinking (market forces, bubble dynamics). Political analysis tends toward list-frame thinking (multiple contributing factors). 

When a reasoner from one domain encounters a problem that belongs to another domain's natural frame, they will impose the wrong explanatory structure. An agent trained primarily on sports-like problems (discrete, high-counterfactual events) will systematically underexplain economic-style problems (slow structural forces, interacting conditions). 

This is not a knowledge failure — it's a frame failure. The agent may have access to all the relevant facts but organize them into the wrong kind of explanation.

### 3. The Illusion of Inevitability in Stories
Story explanations are particularly vulnerable to a specific reciprocal distortion: the causal chain, once assembled, generates a frame of inevitability. Each link seems to lead naturally to the next. Klein and Hoffman note that "the economics explanations created an impression of inevitability, a sense that this is how the dominos were fated to fall." Only 3 of 18 economics stories cited countervailing forces, compared to 12 of 38 sports stories.

The story frame, once built, suppresses attention to the branches not taken — the points where a different decision would have broken the chain. This is hindsight bias operating at the frame level, not just the event level.

### 4. The Morphing Effect Problem
Because the effect being explained is itself frame-dependent, an agent that fixes the effect definition at the start of an investigation will miss cases where the real problem is different from the presenting problem. The early AIDS investigators had to repeatedly re-frame what they were trying to explain. An agent committed to explaining "why gay men were dying" would have missed the transfusion cases. An agent committed to explaining "why the Giants won Super Bowl XLII" might miss the story about the Patriots' season-long offensive dominance that made the outcome surprising in the first place.

**Agent design implication:** A diagnostic agent should treat its initial problem framing as provisional. The problem definition should be revisited at key points during the investigation, especially when causes are discovered that don't fit the initial frame. The question "is this still the right problem?" should be explicitly asked.

---

## The Reciprocal Model and Multi-Agent Coordination

In a multi-agent system where different agents hold different explanatory frames, the Reciprocal Model predicts a specific coordination challenge: **agents with different frames will not just disagree about causes — they will disagree about what the effect is and what counts as relevant data**.

This is not a simple conflict that can be resolved by majority vote or by gathering more data. If Agent A is using an event frame and Agent B is using a condition frame, they may be producing mutually incoherent outputs even when operating on the same underlying facts. Agent A will cite the Federal Reserve's 2002 rate decision as the cause of the mortgage crisis. Agent B will cite the structural features of housing markets (the demand-increasing-with-price dynamic) as the cause. These are not competing answers to the same question — they are answers to different questions generated by different frames.

**Resolution requires frame negotiation, not just evidence arbitration.** A meta-agent or orchestrator needs to:
1. Detect when agents are operating with different explanatory frames
2. Translate between frames (what does Agent A's event explanation look like from Agent B's condition frame?)
3. Determine which frame is appropriate for the decision being made (immediate accountability vs. systemic prevention)
4. Synthesize across frames into a story that incorporates both precipitating events and enabling conditions

This is a non-trivial capability. It requires the orchestrator to have a model of its agents' explanatory frames, not just their outputs.

---

## Practical Guidance: Designing Agents That Navigate the Reciprocal Loop

**Principle 1: Make frames explicit, not implicit.**
An agent should not just produce a causal explanation — it should label what kind of explanation it is producing and what frame it is using. "This is an event explanation anchored on [X]" or "this is a condition explanation focused on [Y]" gives downstream agents and human reviewers the information needed to assess whether the frame is appropriate.

**Principle 2: Require frame justification, not just cause identification.**
Before an agent accepts a causal explanation as sufficient, it should ask: "Given my current frame, what causes would I expect NOT to notice? Is there evidence for those causes that I've been filtering out?" This is an active frame-challenge, not just evidence-gathering.

**Principle 3: Build in effect-definition checkpoints.**
At defined points in a diagnostic process, the agent should re-examine its definition of the effect being explained. "Is this still the right problem? Has the investigation revealed that the effect is different from what I initially framed?"

**Principle 4: Track countervailing forces explicitly.**
Because story frames suppress attention to countervailing forces, any agent generating a story explanation should be required to report on factors that worked against the outcome — the near-misses, the almost-prevented events. If no countervailing forces are identified, this should be flagged as a potential frame artifact, not a fact about the world.

**Principle 5: Use the domain to calibrate the appropriate frame.**
The empirical finding that sports generates event explanations and economics generates story/condition explanations is a guide to prior frame selection. Before beginning a causal investigation, an agent should ask: "What kind of domain is this? What explanatory frame is typically appropriate here?" This doesn't determine the answer, but it sets a calibrated prior.