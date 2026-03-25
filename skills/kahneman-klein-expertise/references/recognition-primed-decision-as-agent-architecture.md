# Recognition-Primed Decision Making as an Agent Architecture Pattern

## The RPD Model: What Experts Actually Do

One of Gary Klein's most important contributions — developed through studying fireground commanders, military officers, and intensive care nurses — is the Recognition-Primed Decision (RPD) model. This model fundamentally challenges the classical view of expert decision making and offers a direct architectural template for how intelligent agents should handle complex, time-pressured problems.

The classical view of expert decision making imagines a process like this: an expert faces a problem, generates a set of options, evaluates each against criteria, and selects the best. This is the rational choice model. It is also, according to Klein's field research, largely a fiction about what experts actually do.

What fireground commanders actually did when studied was strikingly different. When asked how they chose their tactics under fire, commanders consistently reported: they didn't compare options. They didn't generate sets of alternatives. They identified a single plausible course of action — one that "came to them" based on their reading of the situation — and then mentally evaluated that single option. If it seemed workable, they executed it. If it had problems, they modified it or set it aside and considered the next option that came to mind.

Klein et al. (1986) report: "The commanders usually generated only a single option, and that was all they needed."

## The Three-Stage RPD Process

The RPD model has three components that together describe how genuine expertise operates:

### 1. Situation Recognition (Pattern Matching)
The expert reads the situation and classifies it — not necessarily consciously or articulately — into a known category. This classification activates a cluster of associated knowledge: typical goals, relevant cues, expected dynamics, plausible actions. The fireground commander walks into a burning building and immediately knows (without deliberate analysis) whether this is a "structural collapse imminent" situation, a "ventilation problem" situation, or a "standard residential" situation. Each classification carries implicit knowledge about what matters and what to do.

This is Simon's definition of intuition in action: "The situation has provided a cue: This cue has given the expert access to information stored in memory, and the information provides the answer. Intuition is nothing more and nothing less than recognition."

The chess grandmaster, studied by deGroot (1946) and Chase & Simon (1973), typically identified the best moves rapidly — not by calculating all possibilities (which is computationally infeasible even for computers at depth) but by recognizing the *type of position* they were in. Chess masters were estimated to have 50,000 to 100,000 immediately recognizable patterns in memory. Critically, these patterns didn't just identify the position — they came pre-loaded with candidate moves that were almost always good.

### 2. Mental Simulation (Evaluation by Projection)
Once a candidate action comes to mind, the expert evaluates it not through explicit multi-criteria analysis but through *mental simulation*: imagining how the situation would unfold if this action were taken. deGroot called this process "progressive deepening" — following the causal chain forward to see if anything goes wrong.

The expert asks (usually implicitly): *If I do this, what happens? Does anything break? Does it get worse before it gets better? Is there a point of no return I'd cross?*

This mental simulation is often fast and automatic for well-practiced scenarios. For novel or ambiguous situations, it becomes slower, more deliberate, and more likely to surface problems that modify or eliminate the candidate action.

### 3. Serial Evaluation (Not Parallel Comparison)
The key architectural feature of RPD: options are considered *serially*, not *in parallel*. The first plausible option is fully evaluated before a second is considered. If the first option fails mental simulation, it is either modified or discarded, and the next plausible option comes to mind. This continues until a workable option is found.

This is radically different from classical decision theory, which would have the decision maker hold all options in mind simultaneously and compare them. RPD doesn't optimize — it *satisfices*: it finds the first option that meets the threshold of "workable" and executes it.

This seems suboptimal. Why not compare all options and pick the best? The answers:
- In time-pressured, high-stakes environments, generating and comparing all options is impossible
- The first option that comes to mind in a high-validity environment is usually quite good (pattern recognition selects good candidates)
- Mental simulation is a more powerful evaluator than multi-criteria analysis because it preserves causal structure and can detect interaction effects
- The cost of decision delay often exceeds the benefit of finding the optimal option vs. the first good one

## Why This Matters for Agent Architecture

The RPD model is not just a description of human behavior — it is a functional architecture for decision making under uncertainty that has been replicated across domains. As an architecture, it has specific properties that agents can implement.

### Pattern Libraries as the Core Asset

The foundation of RPD is a large, organized library of recognized patterns, each linked to:
- Typical goals for situations of this type
- Salient cues that define the pattern
- Expected dynamics (what will happen if nothing is done)
- Plausible actions (what typically works)
- Red flags (cues that would indicate the situation is not what it appears)

For an agent system, this suggests that the highest-leverage investment is in **curated pattern libraries** — not just general training data but structured repositories of:
- "This type of situation" → "these cues signal it" → "these actions are typically effective" → "watch for these failure signals"

A security auditing agent with an explicit pattern library for common vulnerability classes (injection, auth bypass, logic errors, supply chain issues) can operate in RPD mode: recognize the vulnerability class → mentally simulate the exploit path → evaluate whether the fix addresses the root pattern → if not, consider the next pattern match.

### Serial Evaluation as a Feature, Not a Bug

Agent systems are often designed to generate N options and rank them. RPD suggests an alternative: generate the most plausible option based on pattern recognition, evaluate it thoroughly via simulation, and only generate alternatives if the first fails.

This has real advantages:
- Focuses computational resources on deep evaluation rather than shallow generation
- Surfaces interaction effects that parallel comparison misses
- Produces more explainable reasoning (one path evaluated, not a ranking of unexplained alternatives)
- Avoids "choice overload" effects where more options produce worse decisions

### Anomaly Detection as a Skill

Klein notes that one hallmark of genuine expertise is recognizing when a situation is anomalous — when it doesn't fit any known pattern. This metacognitive skill (knowing that you don't recognize this situation) is as important as recognition itself.

Expert physicians, as described in Gawande (2002) and Groopman (2007), develop the ability to notice when a case doesn't fit any familiar category — the diagnostic equivalent of the fireground commander saying "something feels wrong about this building." That feeling of non-recognition is a signal to shift from RPD (fast pattern-matching) to deliberate analysis (systematic investigation).

Agent systems need explicit anomaly detection: a meta-level monitor that tracks whether the current situation matches known patterns with high confidence, and flags low-confidence matches for escalated deliberate processing rather than fast pattern-matching output.

## The Limits of RPD

### When Pattern Libraries Are Wrong

RPD is only as good as the pattern library. If the library was built in a different environment than the one the agent is operating in, pattern recognition will produce plausible-seeming but wrong options. The Vincennes incident (USS Vincennes shooting down an Iranian civilian airliner in 1988) is the authors' central example of expert pattern recognition catastrophically failing: the crew's highly trained pattern recognition system classified an ascending civilian airliner as a descending attacking military aircraft, and the mental simulation ("if I wait, I will be destroyed") confirmed action. Every step of the RPD process worked correctly. The pattern library was wrong.

### When Mental Simulation Is Inadequate

Mental simulation works well when:
- The causal chains are relatively short
- The agent has accurate internal models of how components behave
- The environment responds in ways consistent with past experience

It breaks down when:
- Complex system interactions produce emergent behaviors not captured in past patterns
- The environment has changed in ways the agent doesn't know
- The action under consideration is genuinely novel

### The Overconfidence Trap

RPD generates decisive, confident action. This is a feature in high-validity environments and a dangerous bug in low-validity ones. An agent that operates in RPD mode in a low-validity environment will generate fast, confident, wrong answers with no internal signal that anything is amiss.

## Implementation Guidance for WinDAGs

When designing agent workflows that use RPD-style reasoning:

1. **Explicitly classify the situation before entering RPD mode.** Don't let agents pattern-match without first determining whether the situation is one where patterns are reliable.

2. **Build anomaly detection into the recognition step.** If the best pattern match has low confidence, route to deliberate analysis rather than fast execution.

3. **Make mental simulation explicit and traceable.** The simulation should generate observable outputs (step-by-step causal chain) that can be reviewed, not just a thumbs-up/thumbs-down.

4. **Distinguish RPD-appropriate from RPD-inappropriate subtasks.** Within a complex problem, some subproblems are high-validity (use RPD), others are low-validity (use statistical/algorithmic approaches).

5. **Track pattern library coverage.** Which situation types does the agent's pattern library cover confidently? Which are sparsely represented? This metadata should influence routing decisions.

The RPD model gives agent system designers a concrete alternative to the generate-all-options-and-rank paradigm. It is faster, more contextually sensitive, and better aligned with how skilled judgment actually works — while its failure modes are clearly specified and can be engineered around.