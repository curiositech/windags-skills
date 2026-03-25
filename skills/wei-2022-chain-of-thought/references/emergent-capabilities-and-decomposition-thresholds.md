# Emergent Capabilities and Decomposition Thresholds in Intelligent Systems

## The Non-Monotonic Relationship Between Scale and Reasoning

One of the most striking findings in chain-of-thought prompting research is that intermediate reasoning steps don't simply improve performance gradually with scale—they actively *harm* performance in smaller models while dramatically improving it in larger ones. As the authors report: "chain-of-thought prompting does not positively impact performance for small models, and only yields performance gains when used with models of ∼100B parameters."

This is not a gradual improvement curve. For models below 10B parameters, providing reasoning chains makes them perform *worse* than standard prompting. The qualitative finding explains why: "models of smaller scale produced fluent but illogical chains of thought, leading to lower performance than standard prompting." The models are capable of mimicking the surface form of reasoning without the underlying logical capability—they generate something that looks like reasoning but leads them astray.

## What This Reveals About Problem Decomposition in Agent Systems

For orchestration systems coordinating multiple AI agents, this finding has profound implications:

**Decomposition is not always helpful**. The instinct to break complex problems into steps assumes that the agent performing each step has sufficient capability to execute it meaningfully. But if an agent is below the capability threshold for a task type, giving it a decomposed subtask with reasoning scaffolding may produce worse results than asking for a direct answer. The scaffolding doesn't guide—it confuses.

**Capability thresholds are task-type specific**. The emergence happens at different scales for different reasoning types. Arithmetic word problems showed emergence around 100B parameters. Symbolic reasoning tasks like last-letter concatenation showed similar thresholds. But the threshold isn't uniform—it depends on what kinds of patterns and knowledge the task requires activating.

**The "zone of confused capability"**. There exists a dangerous middle zone where a model is large enough to produce fluent, grammatically correct reasoning chains but not large enough to maintain logical coherence. An orchestration system needs to detect when it's operating in this zone. The symptoms are characteristic: fluent language, correct formatting, plausible-sounding logic, but fundamental semantic errors or incoherent step-to-step transitions.

## Implications for Agent Routing and Task Decomposition

The authors' error analysis of the 62B parameter PaLM model revealed that scaling to 540B fixed specific error categories: "Scaling PaLM to 540B fixed a substantial portion of errors in all categories" including semantic understanding errors (30% of errors fixed), one-step-missing errors (67% of errors fixed), and other errors including hallucinations (57% fixed).

For a WinDAGs-style system orchestrating agents with different capability levels:

**Route by capability profile, not just task type**. A task requiring 5-step reasoning should not be decomposed and distributed to 5 agents each solving one step unless each agent is above the emergence threshold for that reasoning type. It may be better to route the entire task to a single larger-capacity agent.

**Detect the emergence boundary empirically**. The paper shows that for GSM8K (math word problems), LaMDA 137B achieved 14.3% solve rate with chain-of-thought, while smaller models (68B: 8.2%, 8B: 1.6%) performed worse than their standard prompting baselines. An orchestration system should maintain performance profiles mapping (agent_capacity, task_complexity, decomposition_approach) → performance, learning which combinations create emergent improvements vs. confused outputs.

**Cascade strategies based on error analysis**. The finding that 46% of incorrect reasoning chains were "almost correct, barring minor mistakes (calculator error, symbol mapping error, or one reasoning step missing)" suggests a cascade architecture: attempt reasoning with chain-of-thought, analyze the reasoning chain for characteristic almost-correct patterns, apply targeted corrections (external calculator, symbol mapping verification, missing-step insertion), then re-evaluate.

## The Nature of Emergence Itself

The paper notes that "chain-of-thought reasoning is an emergent ability of model scale." This is defined precisely: "chain-of-thought prompting is an emergent ability in the sense that its success cannot be predicted only by extrapolating the performance of small scale models."

For orchestration systems, this creates a fundamental challenge: **You cannot predict which capabilities will emerge from combining components without empirical testing at scale**. A DAG of reasoning steps executed by below-threshold agents won't suddenly produce correct reasoning when you chain them together. But a DAG that routes appropriately to above-threshold agents may produce reasoning that's qualitatively different from what any component could produce alone.

## Practical Detection Strategies

The paper provides clues for detecting when an agent is below the emergence threshold:

1. **Fluent but illogical outputs**: "small language models produced fluent but illogical chains of thought"
2. **Failure to connect steps coherently**: In error analysis, 8 of 27 fundamental failures had "incoherent chain of thoughts, meaning that some statements in the generated chain of thought did not follow from prior ones"
3. **Surface-level mimicry without semantic grounding**: Symbol mapping errors (16% of failures) where "the chain of thought is correct except for the number symbols"

An orchestration system could implement real-time monitors:
- **Coherence scoring**: Check whether each reasoning step follows logically from previous steps
- **Symbolic consistency**: Verify that entities and values maintain consistent mappings throughout reasoning
- **Semantic grounding checks**: Ensure claims made in reasoning steps are consistent with retrievable world knowledge or problem constraints

## When Decomposition Helps vs. When It Harms

The paper shows decomposition helps when:
- The model is above the emergence threshold (~100B+ parameters for reasoning tasks)
- The task requires multiple reasoning steps that benefit from intermediate state
- The problem is genuinely complex (GSM8K performance doubled with chain-of-thought; single-step MAWPS problems showed "negative or very small" improvements)

Decomposition harms when:
- The model is below emergence threshold (produces confused pseudo-reasoning)
- The task is simple enough that direct inference works well
- The added structure creates overhead without enabling capability

For agent orchestration: **Before decomposing a task, verify that the agents executing subtasks are above the capability threshold for those subtask types**. If not, route to a higher-capacity agent or use a different decomposition strategy that better matches agent capabilities.

## The Implication for Multi-Agent Coordination

The most profound implication: **Coordination protocols themselves have emergence thresholds**. Just as chain-of-thought prompting only works above a certain model scale, certain coordination strategies only work when agents have sufficient individual capability. Trying to achieve complex reasoning through fine-grained task decomposition across weak agents may produce worse results than routing to a single strong agent. The overhead of coordination (context passing, partial result integration, error propagation) can dominate the benefits of parallelization when components are below their capability thresholds.