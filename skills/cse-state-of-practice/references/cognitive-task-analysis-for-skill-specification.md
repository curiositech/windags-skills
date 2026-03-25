# Cognitive Task Analysis: The Missing Method for Specifying What Agents Should Actually Do

## Why Requirements Are Not Enough

The standard approach to specifying what an AI agent capability should do is requirements analysis: identify the inputs the capability should accept, the outputs it should produce, and the performance criteria it should meet. This approach is borrowed from software engineering, and it works reasonably well for deterministic, well-defined functions.

It fails systematically for capabilities that involve expertise, judgment, or complex reasoning — which is to say, for the capabilities that are most valuable and hardest to build.

The reason for this failure is precisely what cognitive systems engineering research identified: **the most important aspects of expert performance are not visible in behavioral inputs and outputs alone**. The expert's value is in the reasoning and recognition that happens between input and output — the situation assessment, the cue weighting, the expectation formation, the alternative generation and rapid evaluation, the pattern matching against experience. A specification that captures only inputs and outputs has missed the point.

Cognitive Task Analysis (CTA) — a family of methods developed and refined over decades of cognitive systems engineering research — provides the alternative. CTA aims to capture not just what practitioners do but *how they think*: the knowledge, strategies, and reasoning processes that underlie effective performance.

## What Cognitive Task Analysis Is

CTA is not a single method but a family of related approaches, each designed to surface different aspects of expert cognition. Hoffman, Crandall, and Shadbolt (1998), in their landmark methodological analysis, identify and evaluate the major CTA methods. The key methods include:

**The Critical Decision Method (CDM)**: A structured interviewing approach that focuses on specific challenging incidents rather than general procedures. The practitioner is asked to recall a specific difficult case — ideally one where things were uncertain, where they had to make judgment calls, or where things could easily have gone wrong. The interviewer then probes that specific incident with structured questions designed to surface the expert's cue recognition, situation assessment, expectation formation, and decision making at specific moments.

The power of the CDM is that the specific incident serves as a cognitive scaffold — it gives the expert's tacit knowledge something to attach to. General questions like "how do you decide when to do X?" often produce generic, rule-like answers that reflect the expert's theories about their decision-making rather than their actual decision-making. The specific incident question ("in that specific case, at that moment, what were you seeing, what were you thinking, what did you expect would happen?") is much more likely to surface the actual cognitive process.

**Think-Aloud Protocols**: Having experts perform their actual work while verbalizing their thinking. This captures real-time cognitive processing in a way that retrospective accounts cannot. The limitation is that verbalization can disrupt highly automated, tacit processes — the expert who thinks aloud while performing highly skilled tasks may perform differently than they would in silent practice.

**Concept Mapping and Knowledge Elicitation Interviews**: Structured approaches to capturing how experts organize domain knowledge — what concepts they use, how those concepts relate to each other, and what distinctions they consider important. These methods are particularly useful for capturing the deep-structure knowledge representations that differentiate expert from novice performance.

**Observation with Structured Debriefing**: Observing expert performance and capturing specific moments for later probing. The observer identifies moments where tacit knowledge is likely to be operating — pauses, unexpected actions, changes in direction, reactions to cues — and then probes those moments in a subsequent debriefing session.

**Simulation-Based Probing**: Presenting experts with simulated scenarios and asking specific questions designed to surface tacit knowledge: "What's wrong with this picture?" (exploiting anomaly detection), "What would you look at next?" (surfacing cue prioritization), "What's the first thing you'd do?" (surfacing action generation), "What might go wrong here?" (surfacing expectation formation).

## What CTA Reveals That Requirements Analysis Misses

The consistent finding across CTA studies is that expert performance involves cognitive elements that are invisible to behavioral observation and unavailable through direct self-report:

**Cue patterns**: Experts attend to configurations of cues — patterns that signal situation types — rather than individual features. The same individual cue may have opposite significance depending on what other cues are present. Requirements analysis that specifies inputs without specifying the cue patterns and their interdependencies will produce capabilities that process individual features but miss the pattern-level recognition that drives expert performance.

**Situation typologies**: Experts have rich, often implicit taxonomies of situation types, each with associated implications for goals, expectations, and actions. These taxonomies are rarely fully explicit and often don't map onto the categories that domain documentation uses. CTA can surface these typologies — which become the foundation for capability design.

**Expectation formation**: Experts continuously form specific expectations about what will happen next, and they treat violated expectations as diagnostic signals. This active prediction is a key component of expert situation awareness, and it is invisible to requirements analysis that specifies only input-output behavior.

**Decision points and choice rationale**: At specific points in complex tasks, experts make decisions among alternatives — but they often don't recognize these as decision points because the "right" choice is so strongly suggested by their situational recognition that it feels obvious. CTA can surface these implicit decision points and the rationale for the typical choice — which then becomes the basis for capability design (what should the agent do in this situation, and why?).

**Error recognition and recovery**: Experts have developed specific patterns for recognizing when something is going wrong and responding appropriately. These patterns are among the most valuable aspects of expertise — and they are essentially impossible to surface through requirements analysis, which focuses on the normal case.

## CTA Applied to Agent Skill Specification

The translation from CTA in human factors to agent skill specification requires adaptation, but the core approach transfers directly.

### Step 1: Domain Expert Analysis

Before designing an agent capability, conduct a structured analysis of how human domain experts approach the type of task the capability will handle. This analysis should use CTA methods:
- Collect specific cases across the range of difficulty and variability the capability will face
- Probe each case for cue recognition, situation assessment, decision points, and expectation formation
- Surface the implicit taxonomies of situation types experts use
- Document the "near misses" — cases where expert judgment was required to avoid an error

This analysis produces not just requirements but *cognitive models* — descriptions of how expertise operates in the domain.

### Step 2: Capability Specification from Cognitive Models

Use the cognitive models to specify capability behavior in terms of cognitive structure, not just input-output:
- What situation types should the capability recognize?
- What cue configurations identify each situation type?
- What does the capability expect to find in each situation type (and what signals anomaly)?
- What decision points exist, and what is the appropriate rationale for each choice?
- What error recognition patterns should the capability implement?

This cognitive-model-based specification goes far beyond behavioral requirements and provides the foundation for genuine expert-level performance.

### Step 3: Case Library Development

Develop a case library that covers:
- Routine cases across the range of normal variability
- Boundary cases — situations near the edge of the capability's appropriate scope
- Challenge cases — situations that are difficult, unusual, or require judgment
- Near-miss cases — situations where an obvious-seeming approach would fail, and why
- Diagnostic cases — situations designed to test specific aspects of the cognitive model

Each case should be annotated not just with the correct output but with the situation type it represents, the cues that identify it, the expectations it generates, and the decision rationale.

### Step 4: Expectation-Based Evaluation

Design capability evaluation around not just output correctness but cognitive fidelity:
- Does the capability attend to the right cues?
- Does it recognize the appropriate situation types?
- Does it form the appropriate expectations?
- Does it flag appropriately when situations fall outside its competence?
- Does it recognize error conditions that would be missed by a less experienced practitioner?

This evaluation approach surfaces capability failures that output-only evaluation misses — specifically, capabilities that produce correct outputs for wrong reasons (which will fail under novel conditions) and capabilities that fail to recognize when they are operating outside their scope of competence.

## Practical Challenges and How to Address Them

**Experts are not always available or cooperative**: CTA is time-intensive and requires significant expert participation. In practice, this means prioritizing CTA for the most critical and complex capabilities — those where the difference between rule-following and genuine expertise matters most.

**Tacit knowledge resists elicitation even with CTA**: The methods described above are much better than naive self-report, but they are not perfect. Some tacit knowledge remains inaccessible through any verbal method. This residual tacit knowledge can sometimes be captured through behavioral observation and annotation — identifying what the expert does that they can't articulate, and encoding that as observable behavior patterns.

**Domain documentation provides an incomplete picture**: Existing documentation (manuals, procedures, training materials) describes the prescribed work, not the actual work. CTA findings will typically diverge from documentation in important ways. Both are useful, but the CTA findings reveal the tacit expertise that documentation misses.

**CTA for novel domains**: When AI agent systems are being developed for domains where there is no existing human expert practice (genuinely novel AI capabilities), the CTA approach requires adaptation. The analysis must focus on first principles, boundary cases, and the logical structure of the task rather than on human expert practice. Simulated adversarial probing (attempting to find cases where the capability would fail) becomes particularly important.

## The Payoff

The investment in CTA-based capability specification pays off in multiple ways:

**Better performance on hard cases**: Capabilities specified through cognitive modeling perform better on the difficult, unusual cases that trip up requirements-based specifications — because the cognitive model specifically addresses the judgment and recognition that handle those cases.

**Better calibrated confidence**: Capabilities designed with explicit situational typologies and competence boundaries produce more accurate uncertainty estimates — they know when they are in familiar territory and when they are not.

**Better failure modes**: When CTA-based capabilities fail, they fail in more diagnosable ways — at the decision points and cue recognition steps that the cognitive model identifies, rather than in opaque, unpredictable ways.

**Better basis for improvement**: Failures can be analyzed against the cognitive model to identify what went wrong at a process level — wrong situation type recognition, wrong cue weighting, wrong expectation formation — rather than just noting that the output was wrong.

The broader lesson: building expert-level AI agent capabilities requires understanding how expertise works at a cognitive level — not just what experts produce, but how they reason. Cognitive Task Analysis is the method for developing that understanding, and it is an underutilized resource in current AI agent development.