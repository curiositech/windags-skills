# Recognition-Primed Decision Making: How Experts Decide Without Comparing Options

## The Model That Changed Decision Science

In 1986, Gary Klein and colleagues studied fireground commanders — captains of firefighting companies — to understand how they made life-or-death decisions under conditions of extreme time pressure and uncertainty. The initial hypothesis was that commanders would compare at least two options before acting. The hypothesis was wrong.

"In fact, the commanders usually generated only a single option, and that was all they needed. They could draw on the repertoire of patterns that they had compiled during more than a decade of both real and virtual experience to identify a plausible option, which they considered first. They evaluated this option by mentally simulating it to see if it would work in the situation they were facing — a process that deGroot had described as progressive deepening. If the course of action they were considering seemed appropriate, they would implement it. If it had shortcomings, they would modify it. If they could not easily modify it, they would turn to the next most plausible option and run through the same procedure until an acceptable course of action was found." (p. 516)

This is the Recognition-Primed Decision (RPD) model. It has been replicated across system design, military command and control, offshore oil installation management, and multiple other high-stakes domains. It describes not how people *should* make decisions in a rationally optimal sense, but how high-performing experts *actually* make decisions — and why this works.

## The Structure of the RPD Model

The RPD model has three phases, each corresponding to a different cognitive operation:

**Phase 1: Recognition**
The expert perceives the situation and matches it against a repertoire of stored patterns. This is not a deliberate search — it is automatic, System 1 pattern matching. The result is not a ranked list of options; it is a single "most plausible" option that comes to mind. Chess grandmasters don't consider all possible moves; they see the board and the right region of the move tree becomes salient. Fireground commanders don't brainstorm tactics; they read the smoke and the building geometry and a response strategy presents itself.

Simon's definition captures this precisely: "The situation has provided a cue: This cue has given the expert access to information stored in memory, and the information provides the answer. Intuition is nothing more and nothing less than recognition." (p. 519)

**Phase 2: Mental Simulation (Progressive Deepening)**
Rather than comparing the recognized option against alternatives, the expert mentally simulates it forward in time. "Does this work given what I know about this situation?" This is a System 2 operation — deliberate, effortful — but it is applied to a *single* option, not used to generate and compare multiple options. The expert is asking "is this sufficient?" not "is this optimal?"

**Phase 3: Modification or Rejection**
If the simulation reveals a problem, the expert modifies the option to fix it. If modification fails, the option is rejected and the next most salient pattern is retrieved for simulation. The process terminates when a satisfactory (not optimal) option is found.

## Why This Architecture Works

The RPD model is not a rational choice model. It does not guarantee finding the optimal solution. It guarantees finding an acceptable solution quickly. Why does "good enough, found fast" outperform "optimal, found slowly" in real-world high-stakes settings?

Because the cost of delay is often larger than the benefit of optimization. A fireground commander who spends five minutes comparing tactics while the building fills with smoke has made a catastrophically worse decision than one who immediately implements an acceptable tactic. The performance criterion in naturalistic decision making is not "find the best option" — it is "find an acceptable option before the situation deteriorates beyond recovery."

More fundamentally, the RPD model works because pattern recognition is extraordinarily fast and reliable when the environment is high-validity and the expert has adequate training. The single option that comes to mind is typically good precisely because it emerges from thousands of hours of calibration against real outcomes. The speed is not a corner-cut — it is a product.

## What the Pattern Repertoire Contains

Chase and Simon estimated that chess masters acquire 50,000 to 100,000 immediately recognizable patterns — and that this repertoire is what enables them to identify good moves without calculating all possible continuations. The knowledge is not propositional ("if X then Y") — it is perceptual and structural. The expert sees the pattern; the response is activated; justification may not be available even to the expert.

This is why cognitive task analysis (CTA) methods are necessary: "Researchers cannot expect decision makers to accurately explain why they made decisions. CTA methods provide a basis for making inferences about the judgment and decision process." (p. 517)

The nurses in the neonatal intensive care unit who could detect infants developing life-threatening infections before blood tests came back positive "were at first unable to describe how they made their judgments." CTA methods identified cues and patterns "some of which had not yet appeared in the nursing or medical literature. A few of these cues were opposite to the indicators of infection in adults." (p. 517)

This is the tacit knowledge problem: the most valuable expert knowledge is often not articulable by the expert, and may even appear contradictory to non-experts. The knowledge lives in the pattern repertoire, not in explicit rules.

## Implications for Agent Decision Architecture

The RPD model suggests a specific and non-obvious architecture for agents facing complex decisions under time pressure:

**Standard architecture (what most agents do)**:
1. Generate N candidate solutions
2. Evaluate each against criteria
3. Select the highest-scoring

**RPD-inspired architecture (what skilled humans do)**:
1. Classify the situation against a learned pattern repertoire
2. Retrieve the most plausible response pattern
3. Run forward simulation on that single candidate
4. Accept if simulation passes, modify if small problems, reject if unworkable
5. Retrieve next pattern only if current one is rejected

The RPD architecture is faster, lower in cognitive load, and — in high-validity environments with adequate training — roughly as accurate as exhaustive search. It fails only when:
- The situation is genuinely novel (no matching pattern exists)
- The retrieved pattern is from a related but different domain (fractionated expertise, covered separately)
- The environment has changed such that the pattern is no longer valid

**How to detect these failure modes in agents**:
- Novel situations: measure pattern-match confidence; low confidence signals genuine novelty requiring deliberate analysis
- Domain mismatch: track which training distribution the pattern came from; flag cross-domain retrievals
- Environmental drift: monitor whether the cue-outcome relationships that trained the pattern still hold in the deployment environment

## The Role of Mental Simulation

Progressive deepening — the mental simulation phase of RPD — is where System 2 reasoning enters. For agents, this maps directly to chain-of-thought or scratchpad reasoning applied not to option generation but to option validation.

The key insight: simulation is *generative*, not just evaluative. When an expert simulates a course of action forward, they don't just ask "does this work?" — they discover things about the situation that weren't explicitly perceived in Phase 1. Simulation reveals dependencies, resource constraints, timing issues, and secondary effects that the initial pattern recognition didn't surface.

For agent systems, this suggests that the validation pass on a candidate solution should be substantively deeper than the generation pass. The generator can be fast and heuristic; the validator should be slow and deliberate. A single high-quality simulation of one option is often more useful than shallow evaluations of five options.

## The Anomaly Detection Capability

One of the most important products of genuine expertise, from the RPD framework, is the ability to recognize when a situation is *anomalous* — when it doesn't fit any familiar pattern. Kahneman and Klein describe this as "one of the manifestations of authentic expertise":

"The ability to recognize that a situation is anomalous and poses a novel challenge is one of the manifestations of authentic expertise. Descriptions of diagnostic thinking in medicine emphasize the intuitive ability of some physicians to realize that the characteristics of a case do not fit into any familiar category and call for a deliberate search for the true diagnosis." (p. 522)

The expert who pattern-matches with very high confidence and doesn't detect anomaly is dangerous. The expert who pattern-matches, notices the slight wrongness, and shifts to a slower deliberate mode is practicing genuine expertise.

For agents: the confidence level on a pattern match should not just gate action — it should also gate *mode of reasoning*. A good pattern match should trigger RPD-style fast response with light simulation. A poor or uncertain pattern match should trigger a fundamentally different reasoning mode: deliberate, systematic, comparative, slower.

This is the architectural equivalent of the dual-process System 1/System 2 distinction. The routing between modes should be driven by pattern-match quality, not by task complexity — because in high-validity domains, complex tasks can match cleanly, while in novel or anomalous situations, apparently simple tasks may require full deliberative analysis.

## The Satisficing Standard

The RPD model is explicitly satisficing, not optimizing. This is not a weakness — it is a feature appropriate to the deployment environment. The critique that satisficing is suboptimal assumes a static environment where more analysis time always produces better results. In dynamic environments where delay has costs, satisficing plus speed can dominate optimization plus delay.

For agent orchestration: not every sub-problem in a complex task requires optimal solution. A WinDAGs system should have explicit satisficing thresholds — "good enough to proceed" criteria — that allow pipeline stages to terminate quickly and pass partial results forward rather than blocking on pursuit of optimality. The performance criterion for each stage should be calibrated to the cost of delay, not just the benefit of better answers.

## Building Pattern Repertoires in Agents

The RPD framework implies that agent capability in a domain is fundamentally a function of pattern repertoire size and quality. This has direct implications for training and fine-tuning:

- **Breadth of pattern exposure matters more than depth on any single pattern** — the chess master has 50,000-100,000 patterns, not 1,000 patterns with deep analysis trees
- **Pattern quality depends on cue-outcome validity** — patterns learned from low-validity training data become confident-but-wrong retrievals in deployment
- **Tacit knowledge cannot be transferred through explicit rules alone** — fine-tuning on worked examples (cases) is more effective than fine-tuning on stated principles, because pattern repertoires are case-indexed, not rule-indexed
- **Anomaly detection requires knowing what normal looks like** — an agent can only recognize anomaly if its pattern repertoire is dense enough that the absence of a matching pattern is meaningful, not just a reflection of sparse training

The RPD model is ultimately an argument for case-based, experiential training over principle-based, declarative training — at least for the kinds of fast, reliable, high-stakes judgment that expert intuition supports.