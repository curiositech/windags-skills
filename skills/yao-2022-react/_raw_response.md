## BOOK IDENTITY

**Title**: ReAct: Synergizing Reasoning and Acting in Language Models
**Author**: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao
**Core Question**: How can intelligent systems combine internal reasoning with external action to solve complex problems that require both thinking and doing?
**Irreplaceable Contribution**: This paper is the first to demonstrate that interleaving reasoning traces with task-specific actions creates a synergistic relationship where reasoning guides action (reason to act) and action informs reasoning (act to reason). Unlike pure reasoning approaches that hallucinate facts or pure acting approaches that lack strategic planning, ReAct shows how grounding reasoning in observable feedback from external environments creates more reliable, interpretable, and correctable agent behavior.

## KEY IDEAS (3-5 sentences each)

1. **Reasoning and Acting are Complementary, Not Alternatives**: The core insight is that reasoning traces help agents "induce, track, and update action plans as well as handle exceptions," while actions "allow it to interface with and gather additional information from external sources." This creates a closed loop where internal knowledge (reasoning) and external knowledge (observations) continuously inform each other, addressing the hallucination problems of pure reasoning and the strategic blindness of pure acting.

2. **Sparse, Strategic Thought Placement Outperforms Dense Feedback**: ReAct uses flexible, sparse reasoning that serves multiple purposes: decomposing goals, tracking progress, performing commonsense reasoning, handling exceptions, and guiding search reformulation. This contrasts with "Inner Monologue" style dense environmental feedback, which ReAct consistently outperforms because strategic internal reasoning about *what needs to happen* is more valuable than constant narration of *what is happening*.

3. **The Grounding Trade-off Between Factuality and Flexibility**: ReAct trajectories are "more grounded, fact-driven, and trustworthy" than pure chain-of-thought reasoning due to interaction with external knowledge sources, but this structural constraint "reduces its flexibility in formulating reasoning steps." The sweet spot is combining both: use internal reasoning when confident, fall back to grounded external interaction when uncertain.

4. **Human-Interpretable Trajectories Enable On-the-Fly Correction**: Because reasoning traces are explicit language, humans can inspect decision-making processes, identify where agents go wrong (hallucinated facts vs. reasoning errors vs. search failures), and even edit thoughts mid-trajectory to correct behavior—a fundamentally different paradigm than editing model parameters or individual actions.

5. **Retrieval as Deliberate Reasoning, Not Automatic Lookup**: The Wikipedia API forces agents to "retrieve via explicit reasoning in language" rather than using powerful neural retrievers. This limitation is actually a feature: it makes the agent's information-seeking strategy transparent and teaches the system to reason about *what* to search for and *when*, rather than relying on retrieval as a black box.

## REFERENCE DOCUMENTS

### FILE: reasoning-action-synergy-in-agent-systems.md

```markdown
# Reasoning-Action Synergy: Why Thinking and Doing Must Interleave

## The Core Problem: Reasoning and Acting Have Been Artificially Separated

The ReAct paper addresses a fundamental architectural question for intelligent agent systems: should an agent *think* or should it *act*? The prevailing wisdom has treated these as separate capabilities. Chain-of-thought prompting demonstrates that language models can reason through problems step-by-step, producing "thinking procedures" that solve arithmetic, commonsense, and symbolic reasoning tasks. Meanwhile, action-generation systems show language models can plan and act in interactive environments, converting observations to text and generating domain-specific actions.

But this separation is artificial and limiting. As the authors observe, "A unique feature of human intelligence is the ability to seamlessly combine task-oriented actions with verbal reasoning (or inner speech)." When humans cook a dish, we don't first complete all reasoning then execute all actions. We interleave: we reason to track progress ("now that everything is cut, I should heat up the pot"), to handle exceptions ("I don't have salt, so let me use soy sauce instead"), and to recognize information gaps ("how do I prepare dough? Let me search online"). We also act to support reasoning—opening a cookbook, checking the fridge—to answer questions we couldn't answer from memory alone.

## The Synergistic Relationship: Reason to Act, Act to Reason

ReAct demonstrates two complementary value flows:

**Reason to Act**: Reasoning traces help the model "induce, track, and update action plans as well as handle exceptions." In the HotpotQA example, when the model searches for "Colorado orogeny" and learns about the "eastern sector," it reasons: "The eastern sector of Colorado orogeny extends into the High Plains. So I need to search High Plains and find its elevation range." The reasoning trace creates an explicit subgoal that guides the next action. Without this reasoning step, the action generation becomes reactive and loses strategic direction.

In ALFWorld, this manifests as goal decomposition: "To solve the task, I need to find and take a lettuce, then clean it with sinkbasin, then put it in diningtable." This high-level plan, expressed as a thought, prevents the agent from taking random exploratory actions. When the agent thinks "First I need to find a lettuce. A lettuce is more likely to appear in fridge (1), diningtable (1), sinkbasin (1)...", it's using commonsense reasoning to prioritize search, dramatically reducing the action space.

**Act to Reason**: Actions allow the model to "interface with and gather additional information from external sources such as knowledge bases or environments." This grounds reasoning in factual observations rather than potentially hallucinated internal knowledge. In the fact-verification task, after searching "Nikolaj Coster-Waldau," the model observes concrete text: "He then played a detective in the short-lived Fox television series New Amsterdam (2008), and appeared in the 2009 Fox television film Virtuality." This observation *enables* the reasoning: "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company."

The critical insight is that neither direction alone is sufficient. Pure reasoning (CoT) achieves 29.4% on HotpotQA but suffers from 14% false positive rate due to hallucination. Pure acting achieves only 25.7% because it cannot synthesize information across multiple search results or track complex subgoals. ReAct achieves 27.4% on HotpotQA with only 6% false positive rate—and when combined with CoT self-consistency to leverage both internal and external knowledge, reaches 35.1%.

## Architectural Implications for Agent Systems

For agent orchestration systems, this suggests a fundamental design principle: **don't separate reasoning and acting into distinct phases or specialized agents**. The common pattern of having a "planner agent" generate a complete plan, then an "executor agent" carry it out, misses the synergy. Plans must adapt based on what actions reveal. Execution must be guided by reasoning that updates in response to observations.

This has implications for DAG-based orchestration:

1. **Edges should carry both observations and reasoning traces**: When one agent's action produces an observation, the next agent needs not just the raw observation but the reasoning context—what were we trying to learn? Why did we take that action? What subgoal does this serve?

2. **Reasoning should be a first-class operation, not a preprocessing step**: Systems often do "plan then execute." ReAct shows the value of "think, act, observe, think, act, observe"—reasoning is interleaved throughout, not front-loaded.

3. **Failure recovery requires reasoning visibility**: When ReAct gets into repetitive action loops, it's a reasoning failure ("the model fails to reason about what the proper next action to take and jump out of the loop"). An orchestration system that logs only actions cannot diagnose this. You need the reasoning traces to see *why* the agent is stuck.

4. **Human-in-the-loop correction targets reasoning, not actions**: The paper shows that by editing two thoughts in a trajectory, a human can completely redirect agent behavior (Figure 5). This is vastly more efficient than trying to specify individual action corrections. Orchestration systems should expose reasoning traces as the primary intervention point.

## The Flexibility-Groundedness Tradeoff

The paper identifies a critical tradeoff: "While interleaving reasoning, action and observation steps improves ReAct's groundedness and trustworthiness, such a structural constraint also reduces its flexibility in formulating reasoning steps, leading to more reasoning error rate than CoT."

What does this mean? Pure CoT can reason freely, making logical deductions without constraint. It can say "let's think step by step" and chain together arbitrary inferences. ReAct must alternate thinking and acting, which means reasoning must be grounded in observations. This prevents flights of fancy but also constrains reasoning to what's immediately relevant to interpreting observations or choosing actions.

The sweet spot is adaptive: "when the majority answer among n CoT-SC samples occurs less than n/2 times (i.e. internal knowledge might not support the task confidently), back off to ReAct." Use pure reasoning when the model has strong internal knowledge, but switch to grounded reasoning-acting when uncertainty is high or facts need verification.

For agent systems, this suggests **confidence-aware routing**: when an agent's internal knowledge is sufficient (high agreement among reasoning traces, or high confidence scores), let it reason freely. When uncertainty is high or facts are disputed, force interaction with external knowledge sources and ground reasoning in observations.

## Sparse vs Dense Reasoning: Strategic Thought Placement

A key finding: ReAct's sparse, strategic reasoning (average 57% success on ALFWorld) substantially outperforms Inner Monologue's dense environmental feedback (48% success). Why?

Dense feedback is reactive: "I need to put this knife (1) in/on countertop 1." It narrates the immediate goal but doesn't provide strategic reasoning about *why* this is the right goal or *how* it fits into the overall plan. The agent gets stuck repeating this thought even after completing the action because it lacks the reasoning to recognize task completion.

Sparse strategic reasoning serves multiple purposes:
- **Goal decomposition**: "To solve the task, I need to find and take a lettuce, then clean it with sinkbasin, then put it in diningtable."
- **Progress tracking**: "Now I take a lettuce (1). Next, I need to go to sinkbasin (1) and clean it."
- **Commonsense application**: "A lettuce is more likely to appear in fridge (1), diningtable (1), sinkbasin (1)..."
- **Exception handling**: "Could not find [Beautiful]. Similar: [...]. From suggestions, I should search 'Beautiful (Christina Aguilera song)'."

For orchestration systems, this means: **don't generate reasoning at every step**. Generate reasoning when it serves a strategic purpose—decomposing goals, making decisions under uncertainty, tracking progress through multi-step plans, or handling exceptions. Dense reasoning creates noise and cognitive load without improving decisions.

The system should ask: *What decision point is this reasoning serving?* If the next action is obvious from context, skip explicit reasoning. If the situation requires strategic choice, invoke reasoning.

## Boundary Conditions and Failure Modes

ReAct's failure modes are instructive:

1. **Reasoning errors (47% of ReAct failures)**: Wrong reasoning traces, including repetitive action loops where the model fails to recognize it's stuck. This is more common in ReAct (47%) than CoT (16%) because the structural constraint of interleaving limits reasoning flexibility.

2. **Search result errors (23% of ReAct failures)**: The search returns empty or non-informative results, derailing subsequent reasoning. This highlights the dependency on environment quality—if actions don't produce useful observations, reasoning cannot be grounded effectively.

3. **Hallucination (0% of ReAct failures vs 56% of CoT failures)**: ReAct's grounding in observations virtually eliminates hallucination, while CoT's 56% failure rate from hallucination is its primary weakness.

For agent systems, this suggests:

- **Monitor for reasoning loops**: If an agent repeats similar reasoning or actions multiple times, intervention is needed. The system has lost the strategic thread.
- **Ensure observation quality**: Actions that produce uninformative observations break the synergy. Design environments and APIs to return actionable information.
- **Use grounded reasoning for facts, free reasoning for logic**: When factual accuracy matters, force interaction with external knowledge. When logical deduction matters and facts are established, allow free reasoning.

## Scaling Implications: When Does ReAct Excel?

The paper shows ReAct's advantages scale differently across learning paradigms:

- **Few-shot prompting**: ReAct requires learning both reasoning and acting from limited examples, making it harder than learning either alone. Act-only or CoT-only can be better with very few examples.
- **Fine-tuning**: With just 3,000 examples, ReAct becomes the best method, with 8B parameter ReAct outperforming 62B prompting methods and 62B ReAct outperforming 540B prompting methods.

Why? "Standard or CoT essentially teaches models to memorize (potentially hallucinated) knowledge facts, and [Act/ReAct] teaches models how to (reason and) act to access information from Wikipedia, a more generalizable skill."

For agent systems: **reasoning-acting patterns are more learnable and generalizable than memorizing facts**. If you're going to invest in training data, annotate reasoning-acting trajectories, not just correct answers. The skill of "how to seek information strategically and reason about what you find" transfers better than domain knowledge.

## Transferable Principles for WinDAGs

1. **Interleave reasoning and acting in agent workflows**: Don't separate planning from execution. Design conversation flows where reasoning and action alternate.

2. **Make reasoning traces explicit and loggable**: They're essential for debugging, human oversight, and learning from failures.

3. **Route based on confidence and task requirements**: Use grounded reasoning-acting for fact-intensive tasks, pure reasoning for logical deduction, and adaptive switching when uncertainty is high.

4. **Design environments to return informative observations**: The quality of action feedback directly determines reasoning quality.

5. **Use sparse, strategic reasoning**: Generate thoughts when they serve a purpose (decomposition, decision-making, exception handling), not at every step.

6. **Enable human correction at the reasoning level**: Let users edit thoughts, not just actions, for more efficient intervention.
```

### FILE: decomposition-through-explicit-subgoaling.md

```markdown
# Problem Decomposition Through Explicit Subgoaling: How Thoughts Create Structure

## The Decomposition Challenge in Complex Multi-Step Tasks

A central challenge in agent systems is decomposition: how do you break a complex task into tractable subtasks? Traditional approaches use hierarchical planning (generate a high-level plan, then refine each step) or learned decomposition (train models to predict subtask sequences). ReAct reveals a different approach: **use explicit linguistic reasoning to decompose goals and track progress through them**.

Consider the ALFWorld task: "put a clean knife in countertop." This requires finding a knife, taking it, cleaning it in a sinkbasin, navigating back to a countertop, and placing it. The naive action-only approach immediately runs into trouble—the agent finds a knife, tries to clean it before reaching the sinkbasin ("clean knife 1 with sinkbasin 1" while standing at countertop 2), gets "Nothing happens," and enters a failure loop.

ReAct succeeds through explicit subgoal reasoning:
- **Initial decomposition**: "To solve the task, I need to find and take a knife, then clean it with sinkbasin, then put it in countertop."
- **Subgoal instantiation**: "First I need to find a knife. A knife is more likely to appear in cabinet (1-6), drawer (1-3), countertop (1-3)..."
- **Progress tracking**: "Now I find a knife (1). Next, I need to take it."
- **Subgoal transition**: "Now I take a knife (1). Next, I need to go to sinkbasin (1) and clean it."
- **Completion recognition**: "Now I clean a knife (1). Next, I need to put it in/on countertop 1."

Each reasoning trace serves as a **subgoal marker**. The agent knows what phase of the task it's in and what needs to happen next. This structure is maintained through observations and actions that might otherwise be ambiguous.

## How Explicit Subgoals Prevent State Confusion

The Act-only baseline fails instructively. After taking the knife, it attempts to clean it without moving to the sinkbasin. This is a state confusion error—the agent has lost track of its position in the task sequence. Without explicit subgoal reasoning, it doesn't maintain a mental model of "I have the knife, but I'm not yet at a location where I can clean it."

The failure cascades: after "Nothing happens," the agent goes to countertop 3, tries to take knife 2 (which it doesn't need, and which fails because it's already holding knife 1), goes back to countertop 2, tries to take knife 1 again (fails—already holding it), returns to countertop 1, attempts to clean knife 1 with sinkbasin 1 again (fails—wrong location). This loop repeats until timeout.

ReAct avoids this because its reasoning traces create **explicit state markers**: "Now I take a knife (1). Next, I need to go to sinkbasin (1) and clean it." This makes the precondition clear: before cleaning, we must navigate to the sinkbasin. The model doesn't attempt the cleaning action until the subgoal is satisfied.

## Commonsense Reasoning as Search Space Reduction

A powerful form of decomposition in ReAct is using commonsense knowledge to prune search spaces. When looking for a knife, rather than exhaustively searching every location, the agent reasons: "A knife is more likely to appear in cabinet (1-6), drawer (1-3), countertop (1-3), fridge (1), garbagecan (1), shelf (1-3), sinkbasin (1), stoveburner (1-4), toaster (1)."

This is **probabilistic search decomposition**—not a hard constraint but a prioritization based on world knowledge. The agent checks cabinets and drawers first, not because it has been explicitly told knives are there, but because language models contain distributional knowledge about where household items typically appear.

For agent systems, this suggests: **decomposition doesn't always need explicit planning algorithms**. Well-prompted language models can perform implicit decomposition through commonsense reasoning about where to look, what to try first, and what's likely to succeed. The key is making this reasoning explicit so it can guide action selection.

## Multi-Hop Reasoning as Sequential Subgoal Refinement

In HotpotQA, decomposition takes the form of **sequential information-seeking subgoals**. Consider: "What is the elevation range for the area that the eastern sector of the Colorado orogeny extends into?"

The reasoning unfolds:
1. **Initial decomposition**: "I need to search Colorado orogeny, find the area that the eastern sector extends into, then find the elevation range of the area."
2. **First observation processing**: "It does not mention the eastern sector. So I need to look up eastern sector." (Refining the search strategy based on what's missing)
3. **Information extraction and next subgoal**: "The eastern sector of Colorado orogeny extends into the High Plains. So I need to search High Plains and find its elevation range."
4. **Search refinement**: When "High Plains" returns ambiguous results, the agent reasons: "I need to instead search High Plains (United States)."
5. **Answer synthesis**: "High Plains rise in elevation from around 1,800 to 7,000 ft, so the answer is 1,800 to 7,000 ft."

Each step is a subgoal: search X, extract Y, search Z, find Q. But the sequence isn't predetermined—it emerges from reasoning about observations. The third search term ("High Plains") comes from the second observation, not from the initial question. This is **adaptive decomposition**—the subgoal structure evolves based on what's discovered.

## Contrast with Inner Monologue: Dense Feedback vs Strategic Decomposition

The paper's comparison with Inner Monologue (IM) reveals what makes decomposition effective. IM-style prompting uses dense thoughts: "I need to find a clean knife." -> observation -> "I need to find a clean knife." -> observation -> "I need to find a clean knife."

This is not decomposition—it's repetition. The thought doesn't track progress through a multi-step plan or decompose the goal into subgoals. It just restates the top-level goal.

ReAct's strategic decomposition does three things IM does not:

1. **Breaks the goal into ordered subgoals**: Find knife → take knife → go to sinkbasin → clean knife → go to countertop → place knife.

2. **Tracks progress explicitly**: Each thought marks completion of the previous subgoal and states the next one. "Now I take a knife (1). Next, I need to go to sinkbasin (1)."

3. **Uses commonsense to guide execution**: "A knife is more likely to appear in cabinet (1-6)..." guides systematic search rather than random exploration.

The result: ReAct achieves 71% average success rate across ALFWorld tasks, while IM achieves 48%. The difference is structural—IM lacks a decomposition of the task into trackable subgoals.

## Implications for Task Decomposition in Agent Systems

For DAG-based agent orchestration, several principles emerge:

**1. Explicit subgoals as node annotations**: In a task execution DAG, nodes shouldn't just represent actions ("search X", "click Y"). They should be annotated with their subgoal purpose: "Find entity X to extract attribute Y for final goal Z." This context helps downstream nodes understand why an action was taken and what to do with its results.

**2. Progress tracking through state markers**: Rather than implicitly tracking task state through database updates or hidden variables, make progress explicit through linguistic descriptions: "Subgoal 1 complete: entity found. Subgoal 2 active: extracting attributes."

**3. Commonsense search space reduction**: Before exhaustively trying possibilities, ask the LLM: "Where is X most likely to be found?" Use this to prioritize search order, reducing wasted actions.

**4. Adaptive decomposition**: Don't fix the entire task structure upfront. Allow subgoals to emerge from observations. After each action, ask: "Given what we observed, what should we do next?" rather than rigidly following a predetermined plan.

**5. Failure detection through subgoal tracking**: If the same subgoal remains active for multiple steps without progress, that's a detectable failure mode. "I need to find X" repeated three times without finding X suggests the search strategy needs revision.

## When Explicit Decomposition Fails

The paper identifies failure modes that constrain decomposition's effectiveness:

**Reasoning errors (47% of failures)**: The most common issue is the model generates wrong reasoning traces, including failing to escape repetitive action loops. Sometimes the model reasons "Now I need to do X" but then repeats the previous action instead of doing X. The explicit subgoal is correct, but action selection doesn't follow it.

For agent systems, this suggests: **decomposition is necessary but not sufficient**. You also need strong action selection that respects the current subgoal. In a DAG, this might mean routing based on explicit subgoal state—if the subgoal is "navigate to sinkbasin," only actions that move toward that goal should be allowed.

**Search result errors (23% of failures)**: When the environment returns uninformative observations, reasoning cannot properly refine subgoals. If you search "High Plains" and get back irrelevant results, you can't extract the next subgoal.

This highlights: **decomposition quality depends on observation quality**. If your APIs return low-signal information, even good reasoning cannot adapt. Design environments to provide rich, relevant observations that support subgoal refinement.

**The flexibility-structure tradeoff**: Explicit decomposition creates structure but constrains reasoning flexibility. CoT has fewer reasoning errors (16% vs 47%) because it can reason freely without constantly grounding in observations and subgoals. ReAct's structural constraint—alternate thinking and acting, keep reasoning tied to subgoals—prevents some forms of creative problem-solving.

The right balance depends on task characteristics: use structured decomposition when tasks have clear sequential subgoals (multi-step procedures, information gathering), but allow free reasoning when tasks require complex logical deduction or creative synthesis.

## Scaling Decomposition: From Few-Shot to Fine-Tuning

Prompting with explicit subgoal decomposition is hard to learn from few examples. The model must learn to decompose goals, track progress, and adapt to observations—all from 1-6 demonstrations. This is why ReAct underperforms Act or CoT in few-shot settings for smaller models.

But fine-tuning reverses this. With 3,000 annotated reasoning-acting trajectories, ReAct becomes the best method. Why? The paper suggests: "teaching models to memorize (potentially hallucinated) knowledge facts" (CoT/Standard) is less generalizable than teaching "how to (reason and) act to access information" (Act/ReAct).

For agent systems: **invest in decomposition annotations, not just correct answers**. A dataset of "here's how to break this task into subgoals, track progress, and adapt based on observations" transfers better than a dataset of "here's the right answer." The decomposition skill generalizes across tasks with similar structure, even if domain content differs.

## Transferable Principles for WinDAGs

1. **Make subgoals explicit in agent reasoning**: Don't just track "current action"—track "current subgoal" and "progress toward goal."

2. **Use commonsense reasoning for search space reduction**: Before trying everything, ask what's most likely to work.

3. **Allow adaptive decomposition**: Let subgoals emerge from observations rather than fixing them upfront.

4. **Track subgoal progress as a first-class metric**: Repeated subgoals without progress signal failure.

5. **Balance structure and flexibility**: Use explicit decomposition for procedural tasks, free reasoning for creative synthesis.

6. **Annotate decomposition patterns for learning**: When building training data, capture *how* to break tasks down, not just *what* to do.
```

### FILE: failure-modes-and-error-propagation.md

```markdown
# Failure Modes and Error Propagation: What ReAct Reveals About Complex System Failures

## The Three Failure Categories: A Taxonomy for Agent Systems

The ReAct paper's systematic failure analysis (Table 2) provides a taxonomy that every agent system should monitor. Across 50 randomly sampled trajectories from HotpotQA, the authors identify:

**Reasoning errors (47% of ReAct failures)**: Wrong reasoning traces, including failing to recover from repetitive steps. The model gets stuck in loops, reasoning "Now I need to do X" but then repeating action Y, unable to recognize the loop.

**Search result errors (23% of ReAct failures)**: The search returns empty or doesn't contain useful information. The environment fails to provide the grounding needed for reasoning to proceed.

**Hallucination (0% of ReAct failures, 56% of CoT failures)**: Generating plausible but false information. CoT's dominant failure mode—more than half of its errors—is making up facts that aren't in its training data or misremembering details.

**Label ambiguity (29% of ReAct failures, 28% of CoT failures)**: The prediction is arguably correct but doesn't match the label precisely (e.g., predicting "Israeli" when the label is "Israel-American").

This taxonomy is crucial because **different failure modes require different interventions**. Hallucination requires grounding in external sources. Reasoning errors require better action selection or loop detection. Search errors require better environment design. Label ambiguity requires better evaluation metrics.

## Hallucination: The Failure Mode That Grounding Eliminates

The most striking finding: ReAct reduces hallucination to virtually zero (0% of failures) while CoT suffers 56% hallucination failure rate and 14% false positive rate vs ReAct's 6%.

Why? CoT relies entirely on internal knowledge. When asked "What was the first year a scientific journal published by an organization located in the Bronx was published?", CoT reasons: "Let's think step by step. The first year a scientific journal published by an organization located in the Bronx was published was 1916." This sounds authoritative but is wrong (correct answer: 1909). The model is generating plausible facts from distributional patterns in training data, not retrieving verified information.

ReAct forces external grounding. Every fact claim must be supported by an observation from Wikipedia. If the model wants to claim Nikolaj Coster-Waldau worked with Fox, it must first search for him and observe: "He appeared in the 2009 Fox television film Virtuality." The reasoning then explicitly references this observation: "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company."

This is **provenance tracking**—every fact has a source. For agent systems, this suggests:

1. **Require external evidence for factual claims**: Don't let agents make assertions without grounding. Design workflows where factual statements must cite observations.

2. **Log observation-reasoning chains**: Store not just "what did the agent claim" but "what observation supports this claim." This enables post-hoc verification and debugging.

3. **Distinguish internal reasoning from external facts**: Make it clear in agent outputs what's derived from model knowledge (logical deduction, commonsense inference) vs external sources (API responses, database queries).

4. **Use grounding for high-stakes decisions**: When accuracy matters—security audits, compliance checks, financial decisions—force interaction with authoritative sources rather than relying on model memory.

## Reasoning Loops: The Cascading Failure of Lost Context

Reasoning errors manifest primarily as repetitive action loops where "the model repetitively generates the previous thoughts and actions." The agent loses track of what it's already tried and fails to reason about "what the proper next action to take and jump out of the loop."

Example failure pattern from ALFWorld Act-only trajectory:
```
> take knife 1 from countertop 2
You pick up the knife 1 from the countertop 2.
> clean knife 1 with sinkbasin 1
Nothing happens.
> go to countertop 3
...
> take knife 2 from countertop 3
Nothing happens.
> go to countertop 2
...
> take knife 1 from countertop 2
Nothing happens.  # Already holding it!
> clean knife 1 with sinkbasin 1
Nothing happens.  # Not at sinkbasin!
[Repeats indefinitely]
```

The agent doesn't recognize it's already holding knife 1, so it tries to take it again. It doesn't recognize it's not at the sinkbasin, so cleaning fails. Without reasoning traces to maintain context, the agent has no memory of subgoal progress or failure causes.

ReAct addresses this through explicit progress tracking: "Now I take a knife (1). Next, I need to go to sinkbasin (1) and clean it." This thought makes the subgoal explicit. When the model generates the next action, it can reason: "I've already taken the knife. The current subgoal is to go to sinkbasin. Therefore, the next action should be navigation, not another take command."

For agent systems, this suggests:

**1. Detect repetition as a failure signal**: If an agent performs the same action multiple times with identical failures, intervention is needed. The system has lost its strategic thread.

**2. Maintain explicit state in reasoning**: Don't just track action history—track "subgoals completed," "subgoals active," "attempts failed." Make this state visible in the reasoning context.

**3. Force reflection on failure**: When an action fails, require the agent to reason about *why* before trying again. "Action X failed. This might be because [enumerate possibilities]. I should try [alternative approach]."

**4. Implement loop-breaking heuristics**: After N repetitions or failures, escalate to a different reasoning strategy, or prompt for human input.

## Search Errors: When Environment Quality Limits Agent Performance

23% of ReAct failures come from "search returns empty or does not contain useful information." This is distinct from reasoning failures—the agent's strategy is sound, but the environment doesn't provide the grounding needed to proceed.

Example: When searching for "Front Row" (a software program), the Wikipedia API returns "Could not find [Front Row]. Similar: ['Front Row Seats to Earth', 'Front Row Motorsports', 'Front Row (software)'...]" If the agent doesn't recognize "Front Row (software)" as the correct match and instead searches "Front Row software," it might eventually succeed—but it might also give up or search tangentially related terms.

The paper notes: "Non-informative search, which counts for 23% of the error cases, derails the model reasoning and gives it a hard time to recover and reformulate thoughts."

This highlights: **agent capability is bounded by environment quality**. No amount of clever reasoning can overcome APIs that return irrelevant data, databases with missing information, or tools with poor discoverability.

For agent systems, this suggests:

**1. Invest in environment design, not just agent intelligence**: A simple, reliable API with comprehensive coverage enables more agent success than a complex, unreliable API with sparse data.

**2. Design observations to be actionable**: Don't just return "not found"—return similar matches, suggestions, or explanatory context. The Wikipedia API's "Similar: [...]" feature enables recovery from failed searches.

**3. Provide feedback on search quality**: Let agents know when observations are low-confidence or incomplete. An observation "I found 3 results but none are highly relevant" is more useful than silently returning weak matches.

**4. Monitor environment errors separately from agent errors**: Track "how often do API calls fail" and "how often do API results contain the information agents need." These metrics reveal whether performance bottlenecks are agent-side or environment-side.

## Error Propagation: How Single Failures Cascade

A crucial observation: errors propagate differently in ReAct vs CoT due to their different grounding.

**CoT error propagation**: A single hallucinated fact can corrupt an entire reasoning chain. If the model incorrectly believes "Reign Over Me was made in 2010" (it was 2007), all subsequent reasoning based on this fact inherits the error. There's no mechanism to detect or correct the hallucination—the model doesn't know it's wrong.

**ReAct error propagation**: Errors can still propagate, but they're more constrained. If a search fails to find the right entity, subsequent reasoning is based on incomplete information—but at least the incompleteness is observable. The model sees "Could not find X" and can reason about how to proceed: try alternative search terms, make partial inferences, or report insufficient information.

The key difference: **observability of error state**. In CoT, errors are silent (hallucinations look like valid facts). In ReAct, errors are visible (failed searches, missing information, unexpected observations).

For agent systems, this suggests:

**1. Make error states observable**: When an action fails, don't hide it—make the failure visible to the reasoning process. "API returned 404" is more useful than silently returning empty results.

**2. Design for graceful degradation**: When information is incomplete, let agents reason about "what can I infer from partial information" rather than forcing them to pretend completeness.

**3. Use checkpoints in long reasoning chains**: Periodically verify key facts or assumptions before proceeding. In a multi-agent workflow, have downstream agents validate upstream claims rather than trusting them blindly.

**4. Log error propagation paths**: When a final answer is wrong, trace back through the reasoning-action chain to identify where the error originated. Was it a hallucination, a failed search, a reasoning mistake, or a label ambiguity?

## The Flexibility-Reliability Tradeoff

ReAct has more reasoning errors (47%) than CoT (16%) because "the structural constraint also reduces its flexibility in formulating reasoning steps." Forcing alternation between reasoning and acting constrains what reasoning can express.

CoT can engage in multi-step deductive chains: "If A then B. If B then C. Therefore if A then C." It can explore hypotheticals and counterfactuals. ReAct's reasoning must be tied to observations and action choices—it's more constrained.

The tradeoff: **structure increases reliability (reduces hallucination) but decreases flexibility (increases reasoning errors)**. Neither extreme is optimal. The best approach combines both:

- Use ReAct's structured reasoning-acting when grounding in facts is critical
- Use CoT's free reasoning when logical deduction matters and facts are established
- Switch between them based on task requirements and confidence

For agent systems, this suggests: **don't impose uniform reasoning structure across all tasks**. Some tasks need tight grounding (fact-checking, information retrieval), others need flexible reasoning (mathematical proof, creative synthesis). Design routing logic that selects the appropriate reasoning mode.

## Detecting Failure Before Completion: Early Warning Signals

The failure mode taxonomy suggests monitoring signals:

**For hallucination risk**: 
- Absence of cited observations supporting factual claims
- High confidence on rare facts or specific numbers
- Contradictions between internal reasoning and external observations

**For reasoning loop risk**:
- Repeated actions with identical failures
- Subgoals that remain active across multiple steps without progress
- Actions that don't align with stated current subgoal

**For search error risk**:
- Observations returning "not found" or empty results
- Low overlap between search terms and observation content
- Multiple search reformulations without improvement

**For error propagation risk**:
- Long reasoning chains without external validation
- Key facts established early that later reasoning depends on
- Branching points where errors could propagate to multiple downstream steps

Monitoring these signals enables early intervention before failures cascade to incorrect final answers.

## Transferable Principles for WinDAGs

1. **Classify failures by type** (hallucination, reasoning error, environment error, ambiguity) to guide intervention.
2. **Use external grounding to eliminate hallucination** in high-stakes decisions.
3. **Detect repetition loops as reasoning failures** and implement breaking mechanisms.
4. **Invest in environment quality** as much as agent intelligence—observations determine reasoning limits.
5. **Make error states observable** rather than hiding failures.
6. **Choose reasoning structure based on task needs**: grounded for facts, flexible for logic.
7. **Monitor early warning signals** for each failure mode to enable intervention before cascade.
```

### FILE: bridging-knowledge-and-action-gap.md

```markdown
# The Gap Between Knowing and Doing: How ReAct Bridges Internal Knowledge and External Action

## The Two Knowledge Sources: Internal Models vs External Environments

A fundamental insight from ReAct is that intelligent systems have access to two distinct knowledge sources, each with different properties:

**Internal knowledge (model parameters)**: Vast, rapidly accessible, enables reasoning about patterns and relationships. But it's static (frozen at training time), potentially outdated, and prone to hallucination. Chain-of-thought reasoning exemplifies pure internal knowledge use—the model generates answers from learned patterns without external verification.

**External knowledge (environments, APIs, databases)**: More limited in scope, requires actions to access, introduces latency. But it's grounded in reality, can be up-to-date, and provides verifiable facts. Action-based systems exemplify pure external knowledge use—the model queries databases or APIs to retrieve current information.

The gap between knowing and doing emerges when systems try to use only one knowledge source. Pure reasoning (CoT) "knows" vast amounts but hallucinates 14% of the time on HotpotQA success cases and fails 56% of the time due to hallucination overall. Pure acting (Act) can "do" by retrieving real information but lacks the strategic reasoning to know what to retrieve or how to synthesize information across multiple retrievals.

## Case Study: Outdated Knowledge and Temporal Grounding

Figure 4 provides a compelling example of the knowledge-action gap. The question: "How many rooms are in the hotel that is home to the Cirque du Soleil show Mystere?"

**CoT's approach** (pure internal knowledge):
"Let's think step by step. The hotel that is home to the Cirque du Soleil show Mystere is Treasure Island. Treasure Island has 2,885 rooms, so the answer is 2,885."

This is plausible and authoritative-sounding. But it's wrong. The correct answer is 2,884.

Why the error? Likely the model's training data contains outdated information. Hotels renovate, room counts change. The model "knows" a fact from its training distribution, but that fact is no longer current.

**Act's approach** (pure external knowledge):
Successfully searches for "Cirque du Soleil show Mystere" and "Treasure Island Hotel," retrieving up-to-date information. But fails to synthesize the final answer because it lacks the reasoning to connect "Mystere is held at Treasure Island" with "Treasure Island has X rooms" to answer "how many rooms."

**ReAct's approach** (combined internal and external knowledge):
1. Internal reasoning: "I need to search Cirque du Soleil show Mystere, find the hotel it is in, then find the number of rooms in the hotel."
2. External action: Search[Mystere Cirque du Soleil]
3. Observation: "Mystère... Held in a custom theatre at the Treasure Island Hotel and Casino..."
4. Internal reasoning: "Mystere is held in a custom theatre at the Treasure Island Hotel and Casino. So I need to search Treasure Island Hotel and Casino next and find the number of rooms in the hotel."
5. External action: Search[Treasure Island Hotel and Casino]
6. Observation: "Treasure Island Hotel and Casino... with 2,884 rooms and suites..."
7. Internal reasoning: "Treasure Island Hotel and Casino has 2,884 rooms and suites. So the answer is 2,884."

ReAct succeeds because it uses internal knowledge for *strategy* (what to search, how to decompose the question) and external knowledge for *facts* (current room count). Neither alone is sufficient—you need reasoning to guide action and action to ground reasoning.

## The Confidence-Based Switching Strategy

The paper proposes two heuristics for deciding when to use internal vs external knowledge:

**CoT-SC → ReAct**: "When the majority answer among n CoT-SC samples occurs less than n/2 times (i.e. internal knowledge might not support the task confidently), back off to ReAct."

This is a confidence-based routing decision. If self-consistency sampling shows high agreement (>50% of samples give the same answer), the model's internal knowledge is probably reliable. If agreement is low, internal knowledge is uncertain—switch to grounded external interaction.

**ReAct → CoT-SC**: "When ReAct fails to return an answer within given steps, back off to CoT-SC."

This addresses ReAct's limitation: when external knowledge is insufficient (searches fail, information is missing, environments are uninformative), fall back to internal reasoning.

The combined approaches (Table 1) outperform either alone:
- HotpotQA: ReAct alone (27.4), CoT-SC alone (33.4), ReAct→CoT-SC (35.1), CoT-SC→ReAct (34.2)
- FEVER: ReAct alone (60.9), CoT-SC alone (60.4), CoT-SC→ReAct (64.6), ReAct→CoT-SC (62.0)

The best method is task-dependent, but both hybrid approaches substantially outperform single-mode approaches, especially with few CoT-SC samples (Figure 2).

## What This Means for Agent Architectures

The confidence-switching strategy suggests a general pattern for agent systems:

**Route based on confidence and task characteristics**:
- High confidence + logical reasoning task → use internal knowledge (CoT)
- Low confidence + factual question → use external knowledge (ReAct)
- High stakes + factual claims → always use external grounding
- Time-sensitive information → always use external retrieval
- Complex synthesis → combine both

This isn't a fixed architecture but an adaptive routing decision. The system must assess:
1. **How confident is internal knowledge?** (via self-consistency, calibration, or uncertainty estimation)
2. **What does the task require?** (fact retrieval vs logical deduction vs synthesis)
3. **What are the stakes?** (exploratory vs high-consequence decisions)
4. **What's the cost of external interaction?** (latency, API costs, rate limits)

For WinDAGs orchestration, this suggests: **skills should declare their knowledge requirements and confidence levels**. A skill that needs current information should signal "requires external grounding." A skill that's uncertain about its answer should signal "low confidence, consider alternative approach."

## The Provenance Problem: Tracking Knowledge Sources

A critical capability enabled by ReAct is **provenance tracking**—knowing where each fact comes from. In the Nikolaj Coster-Waldau example:

Claim: "Nikolaj Coster-Waldau worked with the Fox Broadcasting Company."

ReAct reasoning: "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company."

The quotation marks indicate this is not internal knowledge—it's quoted from an observation. A system could parse this to extract: 
- Claim: "worked with Fox Broadcasting Company"
- Evidence: "appeared in the 2009 Fox television film Virtuality"
- Source: Wikipedia search for "Nikolaj Coster-Waldau"

This enables several capabilities:

**Verification**: A human or another agent can check the source. Does Wikipedia actually say this? Is the inference valid?

**Updating**: If the source information changes, dependent conclusions can be invalidated and revised.

**Trust assessment**: Different sources have different reliability. Wikipedia is generally reliable but community-edited. Internal model knowledge might be outdated or hallucinated. APIs from authoritative sources (government databases, primary scientific literature) are highly trustworthy.

**Debugging**: When an answer is wrong, trace back through provenance to identify where the error originated. Was the source wrong? Was the extraction wrong? Was the reasoning wrong?

For agent systems, this suggests: **make provenance a first-class concept**. Every fact should carry metadata: source, retrieval time, confidence. Reasoning should explicitly cite sources, not just state conclusions.

## The Synthesis Challenge: Combining Multiple External Sources

ReAct demonstrates multi-hop reasoning that combines information from multiple external sources. The Colorado orogeny question requires:
1. Search "Colorado orogeny" → extract "eastern sector extends into High Plains"
2. Search "High Plains (United States)" → extract "rise in elevation from 1,800 to 7,000 ft"
3. Synthesize: "High Plains rise in elevation from 1,800 to 7,000 ft, so the answer is 1,800 to 7,000 ft."

This is non-trivial. The final answer doesn't appear in any single source—it requires connecting information across sources. Internal reasoning performs the synthesis: recognizing that "High Plains" from observation 1 should be the search target for step 2, and that the elevation range from observation 2 answers the original question about the area mentioned in observation 1.

Act alone struggles with this. It can retrieve both pieces of information but often fails to synthesize them. Without reasoning traces like "The eastern sector extends into High Plains. So I need to search High Plains and find its elevation range," the connection between observations is implicit and easily lost.

For agent systems, this suggests: **multi-source synthesis requires explicit reasoning about how sources relate**. Don't just accumulate observations—reason about what each observation contributes to the overall goal and how they connect.

## When Internal Knowledge Is Actually Better

The paper is careful to note that external grounding isn't always superior. CoT outperforms ReAct on HotpotQA (29.4 vs 27.4) despite ReAct's better grounding. Why?

1. **Reasoning flexibility**: CoT can formulate complex deductive chains without the structural constraint of alternating with actions.

2. **No search errors**: CoT doesn't fail due to uninformative or missing external information. It works entirely with internal knowledge, which is always "available."

3. **Efficiency**: CoT requires no external calls, reducing latency and cost.

The failure analysis clarifies the tradeoff: CoT has more hallucination errors but fewer reasoning errors. When the task requires complex logical reasoning over well-established facts, CoT's flexibility outweighs ReAct's grounding advantage.

This suggests: **use internal knowledge for deductive reasoning over established facts**. If the facts are reliably in the model's training data (mathematical axioms, common knowledge, logical relationships) and the task is primarily deductive, pure reasoning without external grounding can be more effective.

The key is knowing when facts are reliable. Temporal facts (current events, recent data), rare facts (specific numbers, obscure entities), and high-stakes facts (medical decisions, legal compliance) should always be grounded. Common knowledge and logical relationships can rely on internal knowledge.

## The Fine-Tuning Reversal: Learning to Bridge the Gap

An interesting finding: while ReAct underperforms CoT and Act in few-shot prompting with smaller models, it becomes the best method after fine-tuning with just 3,000 examples (Figure 3).

The paper's explanation: "teaching models to memorize (potentially hallucinated) knowledge facts" (CoT/Standard) is less generalizable than teaching "how to (reason and) act to access information" (Act/ReAct).

This reveals something fundamental: **the skill of bridging internal and external knowledge is more learnable and transferable than memorizing facts**. Once a model learns "when I need a fact, I should search for it; when I have facts, I should reason about them; when reasoning is uncertain, I should gather more information," this pattern generalizes across domains.

For agent systems, this suggests: **invest training resources in reasoning-acting patterns, not domain knowledge**. If you're building a medical agent, don't just fine-tune on medical facts (which will go out of date). Fine-tune on patterns like "search medical literature, extract relevant findings, reason about how they apply to this case." The pattern transfers; the facts don't.

## Transferable Principles for WinDAGs

1. **Route based on confidence and task requirements**: Internal knowledge for high-confidence deduction, external for facts and low-confidence scenarios.

2. **Track provenance for all facts**: Know what came from internal knowledge vs external sources.

3. **Design for multi-source synthesis**: Explicitly reason about how information from different sources connects.

4. **Use external grounding for temporal, rare, or high-stakes facts**: Don't trust model memory for anything that changes or matters critically.

5. **Enable confidence signaling**: Let agents declare when they're uncertain and need external validation.

6. **Learn reasoning-acting patterns, not facts**: Training should focus on *how to seek and use information*, not memorizing domain content.

7. **Make knowledge source transparent**: Users should see whether claims come from model knowledge or external verification.
```

### FILE: hierarchical-abstraction-in-agent-reasoning.md

```markdown
# Hierarchical Abstraction in Agent Reasoning: How Thought Levels Enable and Constrain Action

## The Abstraction Hierarchy in ReAct Reasoning

ReAct reasoning operates at multiple levels of abstraction, from high-level goal decomposition to low-level action selection. Consider the ALFWorld knife-cleaning task:

**Level 0 (Task goal)**: "Put a clean knife in countertop"

**Level 1 (Strategic decomposition)**: "To solve the task, I need to find and take a knife, then clean it with sinkbasin, then put it in countertop."

**Level 2 (Subgoal instantiation)**: "First I need to find a knife. A knife is more likely to appear in cabinet (1-6), drawer (1-3), countertop (1-3)..."

**Level 3 (Action selection)**: "go to cabinet 1"

**Level 4 (Execution)**: The environment executes the action and returns observation

**Back to Level 2 (Progress evaluation)**: "Now I find a knife (1). Next, I need to take it."

**Level 3**: "take knife 1 from countertop 2"

This hierarchy serves several functions:

**Guidance**: Higher levels constrain and guide lower levels. The Level 1 decomposition establishes that cleaning must happen between taking and placing. This prevents the agent from trying to place an unclean knife or clean it before taking it.

**Tracking**: Level 2 thoughts track progress through the Level 1 plan. "Now I find a knife (1)" marks completion of the first subgoal, "Next, I need to take it" establishes the active subgoal.

**Adaptation**: When observations don't match expectations, reasoning can occur at the appropriate level. If a search fails (Level 4 observation), Level 2 reasoning decides whether to search elsewhere or reformulate the search.

## How Abstraction Enables Effective Action Selection

The critical function of hierarchical abstraction is **action space reduction**. Without it, the agent faces a combinatorial explosion of possible actions.

In ALFWorld, at any moment the agent could:
- Navigate to any of 20+ locations
- Attempt to take any visible object
- Attempt to use any object with any other object
- Open/close containers
- Examine things
- Do nothing

The action space is enormous. Random or even learned action selection struggles because the space is too large to explore effectively.

Hierarchical reasoning reduces this space:

**Level 1 decomposition** reduces the entire task to a sequence: find → take → clean → place. This eliminates all actions that don't serve these subgoals. No need to examine things, open random containers, or interact with objects not relevant to these steps.

**Level 2 subgoal activation** further reduces: "First I need to find a knife." This makes only navigation actions relevant—we're searching, not yet manipulating objects.

**Level 2 commonsense reasoning** prioritizes within navigation: "A knife is more likely to appear in cabinet (1-6), drawer (1-3), countertop (1-3)..." This orders the search space by probability, checking high-likelihood locations first.

**Level 3 action selection** then becomes simple: given "I need to find a knife" and "knives are likely in cabinets," the next action is "go to cabinet 1."

The action that was one choice among hundreds is now the obvious next step, given the hierarchical reasoning structure.

## The Rigidity Problem: When Abstraction Constrains Too Much

But hierarchical abstraction has costs. The paper notes ReAct has more reasoning errors (47%) than CoT (16%), and the structural constraint "reduces its flexibility in formulating reasoning steps."

What does this mean concretely?

**Fixed decomposition**: Once ReAct commits to the plan "find → take → clean → place," it's difficult to deviate. If the agent discovers the knife is already clean, it can't skip directly to placing—the structure enforces the cleaning step.

**Alternation constraint**: ReAct must alternate thinking and acting. It can't do multi-step deduction without intervening actions. If a problem requires complex reasoning like "If A and B then C, if C and D then E, therefore if A, B, D then E," ReAct struggles because it must ground reasoning in observations, not chain abstract implications.

**Level transitions**: Moving between abstraction levels requires explicit reasoning. If the agent is at Level 3 (action selection) and encounters an unexpected observation, it must reason its way back to Level 2 (subgoal evaluation) to adjust the plan. Sometimes it fails to make this transition and gets stuck in repetitive Level 3 actions.

CoT doesn't have these constraints. It can reason freely across abstraction levels, make complex deductions, and explore hypotheticals without being forced to ground in actions. This flexibility allows it to handle tasks where logical reasoning is paramount.

The tradeoff: **structure enables action selection but constrains reasoning flexibility**.

## The Inner Monologue Comparison: Insufficient Abstraction

The comparison with Inner Monologue (IM) reveals what happens with insufficient hierarchical abstraction. IM uses thoughts like: "I need to find a clean knife" → observation → "I need to find a clean knife" → observation → "I need to put this knife (1) in/on countertop 1" → observation → "I need to put this knife (1) in/on countertop 1"...

These thoughts lack abstraction hierarchy:

**No strategic decomposition**: There's no Level 1 plan decomposing the task into find → take → clean → place. Each thought is reactive, responding to the immediate situation without a multi-step plan.

**No progress tracking**: The thoughts don't mark subgoal transitions. "I need to find a clean knife" doesn't clarify whether we've found the knife, taken it, cleaned it, or what remains to be done.

**No subgoal guidance**: Without explicit subgoals, the action selection lacks structure. The agent tries to "put knife in countertop" before cleaning it because there's no Level 1 constraint establishing the required sequence.

The result: ReAct (71% success) substantially outperforms IM (48%) across ALFWorld tasks.

The lesson: **abstraction hierarchy is not automatic—it must be explicitly constructed in the reasoning**. Simply narrating observations or stating immediate goals doesn't create the multi-level structure needed for complex task execution.

## Adaptive vs. Fixed Decomposition

An important subtlety: ReAct's decomposition is not entirely fixed. It's **adaptive within structure**.

In HotpotQA, the initial Level 1 decomposition: "I need to search Colorado orogeny, find the area that the eastern sector extends into, then find the elevation range of the area."

But after searching and observing "The eastern sector extends into the High Plains," the Level 1 plan adapts: "So I need to search High Plains and find its elevation range."

The structure (search → extract → search → extract → synthesize) is maintained, but the specific targets adapt based on observations. This is **adaptive hierarchical planning**—the abstraction levels provide structure, but the content fills in based on what's discovered.

Contrast this with completely fixed planning (generate a detailed plan upfront and execute regardless of observations) or completely reactive planning (no structure, just respond to each observation). ReAct occupies a middle ground: structured but adaptive.

For agent systems, this suggests: **provide abstraction structure without over-specifying content**. A task decomposition like "research → analyze → synthesize → report" provides useful structure while leaving room for the specific research questions, analysis methods, and synthesis approach to adapt based on what's discovered.

## Abstraction Leakage: When Levels Blur

A failure mode occurs when abstraction levels leak into each other. In some failed ReAct trajectories, the agent reasons: "Now I need to put the knife in countertop" (Level 2 subgoal) but then repeats this thought multiple times without recognizing it's been accomplished.

This is **abstraction leakage**—Level 2 reasoning (subgoal state) has leaked into Level 3 (action selection) without proper separation. The agent confuses "what needs to happen" (Level 2) with "what action to take next" (Level 3).

Proper abstraction hierarchy would be:
- Level 2: "Now I need to put the knife in countertop" (subgoal state)
- Level 3: "go to countertop 1" (action to serve subgoal)
- Level 4: Observation
- Level 2: "Now I am at countertop with the knife" (state update)
- Level 3: "put knife 1 in/on countertop 1" (action to complete subgoal)
- Level 4: Observation "You put the knife 1 in/on the countertop 1"
- Level 2: "Subgoal complete: knife is in countertop. Task complete." (progress tracking)

The failed version collapses Level 2 and 3: "I need to put knife in countertop" serves as both subgoal state and attempted action, without proper level separation.

For agent systems, this suggests: **maintain clear separation between abstraction levels**. Subgoal state ("what needs to be accomplished") should be distinct from action selection ("what to do next"). Progress tracking ("what's been completed") should be distinct from planning ("what remains").

## When to Flatten the Hierarchy: Single-Step Tasks

Not all tasks benefit from hierarchical abstraction. For simple, single-step tasks, the overhead of decomposition can hurt performance.

If the task is "What is the capital of France?", hierarchical reasoning like "First I need to understand what is being asked. The question is about the capital city of a country named France. Next, I need to recall or look up this information..." is wasteful. The answer "Paris" is direct and doesn't need decomposition.

The paper doesn't extensively study single-step tasks, but the implication is clear: **hierarchical abstraction is beneficial when tasks have multiple steps, sequential dependencies, or require integration of information from multiple sources**. For atomic tasks, flat reasoning or direct retrieval is more efficient.

This suggests agent systems should assess task complexity before imposing hierarchical structure. A routing decision: 
- Single-step, well-defined question → direct retrieval or flat reasoning
- Multi-step, requires sequential actions → hierarchical ReAct-style decomposition
- Logical deduction, no external dependencies → flat CoT-style reasoning

## The Human Interpretability Advantage of Explicit Hierarchy

A major benefit of explicit hierarchical reasoning: **humans can understand and intervene at the appropriate level**.

When a human inspects a failed ReAct trajectory and sees:
- Level 1: "I need to find and take a knife, then clean it with sinkbasin, then put it in countertop."
- Level 2: "Now I take a knife (1). Next, I need to go to sinkbasin (1) and clean it."
- Level 3: "clean knife 1 with sinkbasin 1"
- Level 4: "Nothing happens"

They can immediately diagnose: Level 3 action was premature—the agent didn't execute the Level 2 plan to "go to sinkbasin" first. The fix: edit the Level 2 thought or insert a missing Level 3 navigation action.

Without hierarchical abstraction, failure diagnosis is harder. If the trace is just a sequence of actions with no reasoning, the human must infer the agent's intent and plan to understand why it did what it did.

Figure 5 demonstrates this: by editing two thoughts (Level 1 and Level 2 reasoning), a human redirects the entire trajectory. The edited thoughts change the abstraction hierarchy, which cascades down to different Level 3 action selections.

For agent systems, this suggests: **expose hierarchical reasoning for human oversight**. Don't just log actions—log the goal hierarchy, active subgoals, progress state, and reasoning at each level. This enables targeted intervention at the right abstraction level.

## Transferable Principles for WinDAGs

1. **Use hierarchical abstraction to reduce action spaces**: High-level decomposition constrains low-level choices.

2. **Maintain clear level separation**: Goal state, subgoal tracking, action selection, and execution should be distinct.

3. **Allow adaptive decomposition within structure**: Provide abstraction framework, let content adapt to observations.

4. **Match abstraction depth to task complexity**: Simple tasks don't need deep hierarchy; complex tasks do.

5. **Expose hierarchy for human interpretability**: Let users see and intervene at goal, subgoal, or action levels.

6. **Detect abstraction leakage**: When level boundaries blur, reasoning becomes confused—enforce separation.

7. **Route based on task structure**: Single-step → flat reasoning, multi-step sequential → hierarchical decomposition, logical deduction → free reasoning.
```

### FILE: uncertainty-and-confidence-in-agent-decisions.md

```markdown
# Uncertainty and Confidence in Agent Decision-Making: When to Act vs. When to Reason

## The Confidence-Based Switching Heuristic

One of ReAct's most practically significant contributions is demonstrating when to use internal reasoning vs. external action based on confidence measures. The paper proposes two switching heuristics:

**CoT-SC → ReAct**: "When the majority answer among n CoT-SC samples occurs less than n/2 times (i.e. internal knowledge might not support the task confidently), back off to ReAct."

This uses self-consistency as a proxy for confidence. If you sample 21 reasoning traces and 15 give answer A while 6 give other answers, the 71% agreement suggests high confidence. If answers are split 8-7-6 across three options, the 38% maximum agreement suggests low confidence—the model's internal knowledge doesn't reliably support any answer.

Low confidence triggers switching from pure internal reasoning to grounded external interaction. The logic: when uncertain, gather more information before committing to an answer.

**ReAct → CoT-SC**: "When ReAct fails to return an answer within given steps, back off to CoT-SC."

This addresses ReAct's failure mode: when external knowledge sources are insufficient (searches return nothing, APIs are unavailable, information doesn't exist), the agent can get stuck. After a threshold number of unsuccessful retrieval attempts, fall back to making the best inference from internal knowledge.

The combined approaches (Table 1) outperform either alone, and Figure 2 shows they're especially effective with few samples—reaching CoT-SC performance with 21 samples using only 3-5 samples when combined with ReAct.

## Measuring Uncertainty in Agent Systems

The self-consistency approach (sampling multiple reasoning traces and checking agreement) is one way to estimate uncertainty. Other approaches agent systems should consider:

**1. Token-level probability scores**: Language models assign probabilities to generated tokens. Low probability on key claims suggests uncertainty. If the model generates "The capital is Paris" with token probabilities [0.95, 0.92, 0.88, 0.97], that's high confidence. If it generates "The population is 2.8 million" with [0.62, 0.45, 0.58, 0.71, 0.39], that's low confidence—the model is uncertain about each number.

**2. Semantic consistency across rephrasings**: Ask the same question multiple ways. If answers are consistent ("capital of France" = "France's capital city" = "main city of France"), confidence is high. If answers vary, confidence is low.

**3. Consistency between reasoning and answer**: If the reasoning trace supports a different answer than the final answer given, that's a red flag. Example: Reasoning says "1844 < 1989, so Arthur's Magazine came first" but answer is "First for Women"—inconsistency suggests low confidence or reasoning error.

**4. Presence of hedging language**: When models are uncertain, they hedge: "It seems likely that...", "Probably...", "Based on common patterns...". Confident statements are more direct: "The answer is X." Detecting hedging language in reasoning traces signals uncertainty.

**5. Factual specificity**: Specific facts ("founded in 1844") suggest higher confidence than vague statements ("founded in the mid-19th century"). Vagueness may indicate the model is uncertain about precise details.

For agent systems, these signals should influence routing decisions: high-confidence tasks can proceed with internal reasoning, low-confidence tasks should invoke external verification.

## The Cost-Benefit Analysis of External Grounding

External grounding (ReAct) has costs that internal reasoning (CoT) doesn't:

**Latency**: API calls take time. Wikipedia searches, database queries, web scraping—each adds milliseconds to seconds. For time-sensitive tasks, this matters.

**API costs**: Many external data sources charge per call. GPT-4 API calls, specialized data APIs, paid research databases—costs accumulate with heavy use.

**Rate limits**: External services limit request rates. An agent making thousands of queries might hit rate limits, forcing delays or failures.

**Reliability**: External services have uptime < 100%. Network issues, API outages, service degradation—all can cause external grounding to fail when internal reasoning would have succeeded.

**Error rates**: External sources aren't perfectly reliable. Wikipedia can have errors, databases can have stale data, search results can be misleading. While generally more reliable than model hallucination, external sources aren't ground truth.

These costs must be weighed against benefits:

**Factual grounding**: ReAct reduces hallucination to near-zero (0% in the study vs. 56% for CoT).

**Up-to-date information**: External sources provide current data; model knowledge is frozen at training time.

**Verifiability**: External sources can be audited; internal reasoning cannot.

**Domain coverage**: External sources may cover rare facts or specialized domains not well-represented in training data.

The optimal decision depends on task characteristics:

| Task Type | Best Approach | Rationale |
|-----------|---------------|-----------|
| Current events | External (ReAct) | Model knowledge is outdated |
| Mathematical reasoning | Internal (CoT) | No external source needed, pure logic |
| Rare/specialized facts | External (ReAct) | Unlikely to be in training data reliably |
| Common knowledge | Internal (CoT) | Well-represented in training, faster |
| High-stakes decisions | External (ReAct) | Need verifiability and accuracy |
| Time-sensitive queries | Internal (CoT) | Latency matters more than perfect accuracy |
| Logical deduction | Internal (CoT) | External sources don't help with inference |
| Fact verification | External (ReAct) | Purpose is to check facts against sources |

## Uncertainty as a First-Class Signal in Orchestration

For DAG-based agent orchestration, uncertainty should be a first-class signal that affects routing:

**1. Confidence thresholds for routing**: Skills should return not just answers but confidence scores. Downstream routing decisions use these scores:
```
if confidence > 0.8:
    return answer directly
elif confidence > 0.5:
    validate with external source
else:
    escalate to human review or gather more information
```

**2. Uncertainty-aware skill composition**: When composing skills in a DAG, high-uncertainty outputs from one skill trigger additional validation skills. A research skill that returns low-confidence findings might trigger a fact-checking skill or multiple-source verification.

**3. Adaptive sampling**: Use confidence to decide how many samples to generate. High-confidence tasks need only one reasoning trace. Low-confidence tasks benefit from multiple samples and self-consistency voting.

**4. Human-in-the-loop triggers**: Uncertainty above a threshold triggers human review. Rather than failing or guessing, the system signals "I'm uncertain about X, please advise."

**5. Cascading confidence**: In multi-step reasoning, track confidence at each step. If early steps have low confidence, downstream inferences inherit that uncertainty—don't make high-confidence final claims based on low-confidence premises.

## The Self-Consistency Paradox: When Agreement Doesn't Mean Correctness

Self-consistency is a useful confidence proxy but not perfect. The paper shows CoT-SC (self-consistency with 21 samples) significantly outperforms single-sample CoT, suggesting agreement correlates with correctness.

But there are failure modes:

**Consistent hallucination**: If the model's training data contains a widespread error, all samples might agree on the wrong answer. Self-consistency measures internal coherence, not external correctness.

**Mode collapse**: Sampling from a language model with temperature 0.7 introduces randomness, but the model might still have strong priors that dominate all samples. If 95% of probability mass is on answer A, all 21 samples will choose A even if it's wrong.

**Semantic variation**: Different phrasings of the same answer might be counted as disagreement. "Paris," "The capital is Paris," and "It's Paris" are the same answer but might not match exactly in self-consistency voting.

For agent systems, this suggests:

**1. Combine self-consistency with external validation**: Use agreement as an initial filter, but validate high-stakes or low-agreement answers externally.

**2. Semantic similarity, not exact match**: When checking consistency, use semantic similarity (embeddings, paraphrase detection) not string matching.

**3. Calibration**: Test whether self-consistency correlation with correctness holds on your domain. Some domains might need higher agreement thresholds than others.

**4. Diverse sampling**: Ensure sampling diversity by using higher temperature, different prompts, or different model initializations. Avoid mode collapse where all samples are near-identical.

## Graceful Degradation: Handling Irreducible Uncertainty

Sometimes uncertainty cannot be resolved. External sources have no information, multiple sources conflict, or the question is genuinely ambiguous.

ReAct demonstrates graceful degradation through the "NOT ENOUGH INFO" option in FEVER. When the model searches for information to verify a claim but finds insufficient evidence, it explicitly states this rather than guessing:

"The song peaked at number two on the Billboard Hot 100 in the United States, but not sure if it was in 2003." → Answer: NOT ENOUGH INFO

This is preferable to hallucinating a confident answer. For agent systems:

**1. Make "I don't know" a valid response**: Systems should be allowed to report insufficient information rather than forced to guess.

**2. Distinguish types of uncertainty**: 
   - "I don't have information" (retrievable externally)
   - "Information doesn't exist" (question is unanswerable)
   - "Information is conflicting" (sources disagree)
   - "Question is ambiguous" (needs clarification)

**3. Provide partial answers**: "I found X and Y but not Z" is more useful than refusing to answer because Z is missing.

**4. Suggest next steps**: "I couldn't find this information in Wikipedia, but it might be in specialized databases" guides users toward resolution.

## The Temperature-Confidence Relationship

The paper uses temperature 0.7 for CoT-SC sampling to get diversity. Temperature controls randomness in token selection:
- Temperature 0 (greedy): Always pick highest-probability token → deterministic, no diversity
- Temperature 1 (neutral): Sample from true distribution → moderate diversity
- Temperature >1 (high): Flatten distribution → high diversity, potentially incoherent

The temperature-confidence relationship:

**Low temperature (0-0.3)**: 
- Pros: More consistent, higher coherence, reflects model's strong beliefs
- Cons: No diversity for self-consistency, mode collapse

**Medium temperature (0.5-0.9)**:
- Pros: Good diversity for self-consistency while maintaining coherence
- Cons: Moderate randomness might introduce some inconsistency

**High temperature (>1)**:
- Pros: Maximum diversity, explores unlikely paths
- Cons: May generate incoherent or contradictory responses

For uncertainty estimation via self-consistency, medium temperature (0.6-0.8) is optimal. It provides diversity to measure agreement without sacrificing coherence.

## Transferable Principles for WinDAGs

1. **Use self-consistency as a confidence proxy**: Sample multiple reasoning traces, measure agreement as uncertainty signal.

2. **Route based on confidence**: High-confidence internal reasoning, low-confidence external grounding.

3. **Make uncertainty a first-class signal**: Skills should return confidence scores that affect downstream routing.

4. **Implement confidence thresholds**: Define levels that trigger different actions (proceed, validate, escalate).

5. **Allow "I don't know" responses**: Forcing guesses under uncertainty creates unreliable outputs.

6. **Combine multiple uncertainty signals**: Self-consistency, hedging language, specificity, reasoning-answer consistency.

7. **Balance costs and benefits**: External grounding has latency and cost; use it when accuracy justifies these costs.

8. **Calibrate for your domain**: Test whether uncertainty measures correlate with correctness in your specific tasks.
```

### FILE: human-interpretability-and-controllability.md

```markdown
# Human Interpretability and Controllability: How Explicit Reasoning Enables Human-Agent Collaboration

## The Interpretability Advantage: Transparent Decision Processes

A core claim of the ReAct paper: reasoning traces create "human interpretable and controllable task-solving trajectories" that are "more interpretable than baselines without reasoning traces." This isn't just aesthetic—it has functional implications for system reliability and human-AI collaboration.

Compare two trajectories on the same task:

**Act-only (no reasoning)**:
```
search[Colorado orogeny]
lookup[eastern sector]
search[High Plains]
search[High Plains (United States)]
finish[1,800 to 7,000 ft]
```

**ReAct (with reasoning)**:
```
think[I need to search Colorado orogeny, find the area that the eastern sector extends into, then find the elevation range]
search[Colorado orogeny]
think[It does not mention the eastern sector. So I need to look up eastern sector]
lookup[eastern sector]
think[The eastern sector extends into the High Plains. So I need to search High Plains and find its elevation range]
search[High Plains]
think[I need to instead search High Plains (United States)]
search[High Plains (United States)]
think[High Plains rise in elevation from around 1,800 to 7,000 ft, so the answer is 1,800 to 7,000 ft]
finish[1,800 to 7,000 ft]
```

The Act-only trajectory shows *what* the agent did but not *why*. A human reviewing it must infer:
- Why did it look up "eastern sector"? (Because initial search didn't mention it)
- Why did it search for "High Plains"? (Because that's where the eastern sector extends)
- Why "High Plains (United States)"? (Because "High Plains" was ambiguous)

These inferences are possible but require effort and domain knowledge. If the action sequence is wrong, diagnosing why is difficult.

The ReAct trajectory makes reasoning explicit. Each thought explains:
- **Intent**: What the agent is trying to accomplish ("find the area that the eastern sector extends into")
- **Strategy**: How it plans to accomplish it ("search X, then search Y")
- **Interpretation**: What it learned from observations ("The eastern sector extends into the High Plains")
- **Adaptation**: Why it's changing approach ("I need to instead search High Plains (United States)")
- **Conclusion**: How it arrived at the answer ("High Plains rise in elevation from 1,800 to 7,000 ft, so the answer is...")

A human can follow the reasoning, verify each step, and identify exactly where errors occur.

## Failure Diagnosis: Where Did It Go Wrong?

The interpretability advantage is most valuable when things fail. Consider a failed FEVER trajectory where the model incorrectly claims "Soyuz was part of the American space program" is "SUPPORTS":

**ReAct trajectory**:
```
think[I need to search Soyuz and find if it was part of the American space program]
search[Soyuz]
observe[Soyuz is a transliteration...]
think[It does not mention the American space program, so I need to search "American space program"]
search[American space program]
observe[The space policy...]
think[It does not mention Soyuz, so I am not sure if this claim is true or not]
finish[NOT ENOUGH INFO]
```

This is actually correct—the model appropriately concludes insufficient information. But suppose it had incorrectly finished with "SUPPORTS." A human could trace the error:

1. Did it search the right entities? (Yes—Soyuz and American space program)
2. Did the observations contain relevant information? (Check Wikipedia—are the observations accurate excerpts?)
3. Did it correctly interpret the observations? (Look at "think" steps—did it extract the right facts?)
4. Did it reason correctly from facts to conclusion? (Does "It does not mention Soyuz" logically lead to "SUPPORTS"? No—reasoning error.)

The diagnostic process is systematic because reasoning is explicit.

Compare with Act-only:
```
search[Soyuz]
search[American space program]
finish[SUPPORTS]
```

Where did this go wrong? We can't tell without the reasoning. Did it misinterpret observations? Did it hallucinate a connection? Did it have the right information but draw wrong conclusions? The black-box nature prevents diagnosis.

For agent systems, this means: **reasoning traces are debugging tools**. Log them not just for interpretability but for systematic failure analysis.

## On-the-Fly Human Correction: Editing Thoughts to Redirect Behavior

Perhaps the most striking demonstration of ReAct's interpretability advantage: Figure 5 shows a human editing two thoughts mid-trajectory to correct agent behavior.

**Original trajectory (fails)**:
- Takes knife from drawer
- Thinks: "Now I find the first keychain. Next, I need to take it. I can find the second keychain later in drawer 3."
- Puts first keychain in safe
- Thinks: "Now I put the first keychain in safe. Next, I need to find the second keychain. I can directly go to drawer 3."
- Goes to drawer 3
- Observes: just a watch (no keychain)
- Attempts to take keychain from drawer 3
- [Fails—no keychain there, gets stuck]

**Human-edited trajectory (succeeds)**:
- [Same initial steps]
- Edited thought: "Now I put the first keychain in safe. Next, I need to find the second keychain, which is more likely to appear in dresser, garbagecan, safe, sidetable, sofa, shelf."
- Goes to dresser
- Finds second keychain
- Takes it and puts in safe
- [Success]

The human edited two thoughts:
1. Removed the hallucination "I can find the second keychain later in drawer 3"
2. Added commonsense guidance about where keychains are likely to appear

These thought edits changed the entire subsequent trajectory. The agent no longer expected drawer 3 to contain a keychain, so it didn't get stuck trying to take something that wasn't there. It instead performed a systematic search of likely locations.

This is fundamentally different from editing actions. If a human edited the action sequence directly:
```
Original: go to drawer 3
Edited: go to dresser
```

This fixes one action but doesn't change the agent's beliefs or reasoning. The next action might still be based on the wrong assumption (that drawer 3 has keychains). Thought editing changes the reasoning context that generates all subsequent actions.

## What Makes Thought Editing Possible

Thought editing works because:

**1. Thoughts represent belief state**: The thought "I can find the second keychain later in drawer 3" is a belief. Editing it changes what the agent "knows."

**2. Reasoning is compositional**: Each thought builds on previous thoughts and observations. Changing one thought changes downstream reasoning.

**3. Thoughts guide action selection**: Actions are chosen to serve the current thought (subgoal). Change the thought, and action selection changes.

**4. Natural language is human-editable**: Unlike editing model parameters (requires ML expertise) or reward functions (requires reinforcement learning setup), editing natural language thoughts requires only domain knowledge.

For agent systems, this suggests **reasoning traces should be editable by domain experts, not just ML engineers**. A doctor should be able to edit medical reasoning, a lawyer should be able to edit legal reasoning, a programmer should be able to edit code analysis reasoning—without understanding the underlying AI system.

## The Trust-Through-Transparency Principle

The paper emphasizes ReAct makes systems "more interpretable and trustworthy." Trust comes from transparency:

**Provenance**: When ReAct claims a fact, it cites the observation supporting it. "Because he 'appeared in the 2009 Fox television film Virtuality', he should have worked with the Fox Broadcasting Company." The quotation marks indicate external evidence, not model hallucination.

**Explicit reasoning**: The logical steps are visible. If the logic is wrong, humans can spot it. If the logic is sound, humans can verify it.

**Error observability**: Mistakes are visible. If a search fails or returns irrelevant results, this appears in the trajectory. Humans can see when the agent is working with incomplete information.

**Intermediate outputs**: Rather than just final answers, humans see the entire problem-solving process. This makes it possible to assign partial credit ("the agent did 4 out of 5 steps correctly, failing only on the last search") rather than just binary success/failure.

For high-stakes applications (medical diagnosis, legal analysis, security auditing), transparency is not optional. Regulators and users need to understand how decisions were made. Reasoning traces provide this transparency.

## Limitations of Interpretability: When Reasoning Is Still Opaque

The paper is honest about limitations. Not all reasoning is interpretable:

**1. Reasoning can be wrong**: Explicit reasoning that's incorrect might be more dangerous than no reasoning—it looks authoritative but leads to wrong conclusions. Humans might trust explicit reasoning even when it's flawed.

**2. Lengthy traces are hard to parse**: A 50-step trajectory with alternating thoughts and actions requires significant human effort to review. Interpretability degrades with length.

**3. Natural language is ambiguous**: A thought like "I need to find X" might mean "I need to search for X" or "I need to receive X as input" or "I need to create X." The intended interpretation isn't always clear.

**4. Model reasoning may not match human reasoning**: The model might generate reasoning traces that satisfy the prompt structure but don't reflect its actual "decision process" (to the extent language models have decision processes). The reasoning might be post-hoc rationalization rather than genuine deliberation.

**5. Selective reasoning**: ReAct shows only explicit thoughts. Implicit reasoning (in forward passes, attention patterns, hidden states) is still opaque. The explicit reasoning might not capture all factors influencing decisions.

For agent systems, these limitations suggest:

- Don't blindly trust explicit reasoning—verify it, especially for high-stakes decisions
- Summarize or hierarchically display long reasoning traces for human review
- Standardize reasoning language to reduce ambiguity
- Validate that explicit reasoning actually predicts behavior (if editing reasoning changes behavior, it's genuine; if not, it might be post-hoc)
- Complement reasoning trace interpretability with other interpretability tools (attention visualization, feature attribution)

## Controllability: From Passive Observation to Active Direction

Interpretability enables passive understanding (what did the agent do and why?). Controllability enables active direction (make the agent do something different).

The ReAct paper demonstrates controllability through thought editing, but other forms of control are possible:

**1. Goal injection**: Add a new top-level thought: "Before solving the main task, first verify that all inputs are valid." This adds a precondition to the task execution.

**2. Strategy guidance**: Edit a thought to change problem-solving approach: "Instead of searching alphabetically, prioritize locations where X is most likely based on commonsense."

**3. Constraint addition**: Add a thought: "I must not use more than 5 searches to avoid exceeding rate limits." This constrains the action space.

**4. Knowledge injection**: Add a thought with domain knowledge: "In this environment, keychains are typically found in dressers, not drawers." This corrects erroneous assumptions.

**5. Exception handling**: When an unexpected observation occurs, a human can add a thought: "This error suggests the API is temporarily unavailable. I should switch to using the backup database."

For agent orchestration, this suggests: **reasoning traces should be not just loggable but editable during execution**. A human should be able to inject thoughts, modify subgoals, or redirect strategy in real-time, not just retrospectively.

## Transferable Principles for WinDAGs

1. **Make reasoning traces visible**: Log thoughts, not just actions, for interpretability.

2. **Structure reasoning for reviewability**: Use consistent formats, hierarchical organization, clear intent statements.

3. **Enable thought editing**: Allow domain experts to modify reasoning without ML expertise.

4. **Implement provenance tracking**: Every fact should cite its source (internal knowledge vs. external observation).

5. **Support mid-trajectory intervention**: Let humans redirect agent behavior by editing thoughts during execution.

6. **Design for failure diagnosis**: Structure traces to make it easy to identify where errors occurred.

7. **Balance explicitness and conciseness**: Make reasoning clear but not so verbose it's unreadable.

8. **Validate reasoning genuineness**: Test that editing reasoning actually changes behavior (proof it's not post-hoc rationalization).

9. **Complement with other interpretability tools**: Reasoning traces are powerful but not sufficient—use multiple interpretability approaches.
```

### FILE: learning-reasoning-acting-patterns.md

```markdown
# Learning to Reason and Act: What Training Data Should Capture

## The Surprising Fine-Tuning Result

A striking finding from the ReAct paper: while prompting with few examples makes ReAct harder to learn than simpler methods (Act or CoT alone), fine-tuning with just 3,000 examples makes ReAct the *best* method.

Figure 3 shows the reversal:

**8B parameter model, prompting**:
- Standard: ~10% exact match (EM) on HotpotQA
- CoT: ~12% EM
- Act: ~14% EM  
- ReAct: ~8% EM (worst)

**8B parameter model, fine-tuned on 3,000 examples**:
- Standard: ~18% EM
- CoT: ~19% EM
- Act: ~22% EM
- ReAct: ~27% EM (best)

ReAct goes from worst in prompting to best in fine-tuning. With 62B parameters, fine-tuned ReAct (~30% EM) even outperforms all 540B prompting methods.

Why this reversal?

## What Makes Reasoning-Acting Patterns Learnable

The paper's explanation: "Standard or CoT essentially teaches models to memorize (potentially hallucinated) knowledge facts, and [Act/ReAct] teaches models how to (reason and) act to access information from Wikipedia, a more generalizable skill for knowledge reasoning."

This is profound. The fine-tuning data teaches different things:

**Standard/CoT training** teaches:
- Question → Answer mappings
- Common reasoning patterns (if A then B, etc.)
- Domain facts (capitals, dates, names)

But facts are numerous, domain-specific, and become outdated. Memorizing "Treasure Island has 2,885 rooms" is fragile—renovations change room counts, the model must memorize thousands of hotel room counts, and this knowledge doesn't transfer to other tasks.

**Act/ReAct training** teaches:
- How to formulate search queries from questions
- How to extract relevant information from observations
- How to determine when more information is needed
- How to combine information from multiple sources
- How to track progress through multi-step information gathering

These are *procedures*, not facts. Learning "when you need a fact, search for it; when search returns partial info, search again with refined terms; when you have sufficient info, synthesize an answer" is a general pattern that transfers across domains.

## The Composition of Training Trajectories

The 3,000 ReAct fine-tuning examples are "trajectories with correct answers generated by ReAct." Each trajectory includes:

- The question
- Reasoning traces (thoughts)
- Actions taken
- Observations received
- Final answer

This is much richer than question-answer pairs. A QA dataset teaches "Q → A." A trajectory dataset teaches "Q → [reason → act → observe → reason → act → observe...] → A."

The intermediate steps provide supervision on:

**Search strategy**: Which entities to search first, how to decompose multi-hop questions, when to refine search terms.

**Information extraction**: What information from an observation is relevant to answering the question.

**Reasoning patterns**: How to connect information from multiple observations, when to stop searching, how to handle ambiguity.

**Error recovery**: When searches fail, how to reformulate. When information is incomplete, how to make partial inferences.

For agent systems, this suggests: **invest in trajectory annotation, not just input-output pairs**. If you're building a code review agent, don't just collect (code, issues found) pairs. Collect (code, reasoning about what to check, actions taken to check it, observations from checks, reasoning about findings, issues found) trajectories.

The intermediate reasoning and actions are where the transferable patterns live.

## What Training Data Should Not Capture: Facts vs. Procedures

The key insight is distinguishing learnable procedures from non-learnable facts:

**Learnable procedures** (good for training):
- How to decompose complex questions into sub-questions
- How to formulate effective search queries
- How to extract relevant information from noisy observations
- How to recognize when information is sufficient vs. insufficient
- How to synthesize information from multiple sources
- How to handle exceptions and failures
- How to track progress through multi-step processes

**Non-learnable facts** (bad for training focus):
- "Paris is the capital of France"
- "The population of Tokyo is 13.96 million"
- "Python was created by Guido van Rossum"

Why are facts non-learnable for this purpose? Not because models can't memorize them—they can. But because:
1. Facts are numerous (millions or billions)
2. Facts change over time (populations grow, leaders change)
3. Facts are domain-specific (medical facts don't help with legal questions)
4. Memorized facts encourage hallucination (model "knows" outdated facts)

Procedures, in contrast, are few, stable, and transferable. Once a model learns "when you need a current fact, search for it in an external source," this works for any fact in any domain, remains valid over time, and prevents hallucination.

## The Generalization Advantage of Procedural Learning

The paper demonstrates that procedural learning generalizes better. ReAct fine-tuned on 3,000 HotpotQA examples performs well on *new* HotpotQA questions it hasn't seen. It's not memorizing question-answer pairs (3,000 pairs don't cover the space of all possible questions). It's learning the procedure: "decompose multi-hop questions, search for each hop, extract bridge entities, search again, synthesize answer."

This procedure transfers to questions about entities not in training data. If training includes:
- "What is the elevation of the area where X extends?" → search X → extract area → search area → extract elevation
- "What year was Y founded in Z?" → search Y → extract Z connection → search Z → extract founding year

Then the model can answer:
- "What is the population of the city where Q was born?" → search Q → extract birth city → search city → extract population

It hasn't seen this specific question, but the procedure (search entity, extract property, search property, extract fact) is the same.

For agent systems: **procedural training enables few-shot transfer to new domains**. Train on reasoning-acting patterns in one domain (e.g., answering questions about movies using IMDB), and those patterns transfer to other domains (answering questions about companies using financial databases) because the *procedure* is the same even though the *content* differs.

## Bootstrapping: Generating Training Data from Model Outputs

The paper uses a "bootstrapping approach similar to Zelikman et al. (2022), using 3,000 trajectories with correct answers generated by ReAct."

This is crucial: the training data is generated by prompting ReAct, filtering for correct answers, and using those trajectories to fine-tune smaller models.

The bootstrapping loop:
1. Prompt large model (PaLM-540B) with few-shot ReAct examples
2. Generate trajectories on training questions
3. Filter for trajectories that produce correct final answers
4. Fine-tune smaller model (PaLM-8B/62B) on filtered trajectories
5. Smaller model learns reasoning-acting patterns from successful trajectories

This is powerful because:

**Scalability**: Human annotation of full reasoning-acting trajectories is expensive. Generating them from a large model then filtering for correctness is cheaper.

**Quality**: Trajectories generated by a strong model (540B) provide high-quality reasoning patterns for a weaker model (8B/62B) to learn.

**Coverage**: Automatic generation can cover more diverse situations than manual annotation.

**Iteration**: As the model improves, it can generate better trajectories, which can be used to further improve the model.

For agent systems, this suggests: **use strong models to generate training data for weaker models**. If you have access to GPT-4 or Claude-3, use them to generate reasoning traces and action sequences on your tasks. Filter for successful outcomes. Fine-tune smaller, cheaper models on this data. The smaller models learn the reasoning patterns without needing to match the raw capability of the larger model.

## What Should Be Fixed vs. What Should Be Learned

The ReAct prompting setup fixes several things:
- The reasoning-action structure (thoughts alternate with actions)
- The action space (search, lookup, finish)
- The environment (Wikipedia API)
- The few-shot examples (manually curated successful trajectories)

Fine-tuning learns:
- When to reason vs. act
- What to think about (goal decomposition, progress tracking, information extraction)
- What actions to take (which entities to search, when to lookup vs. search again)
- How to extract relevant information from observations
- When to finish (sufficient information gathered)

This division suggests a general principle: **fix structure and interfaces, learn behavior**. 

Don't try to learn:
- The format of reasoning traces (fix this in prompts/training data structure)
- Available actions (define a fixed action space)
- Environment mechanics (how APIs work, what observations look like)

Do learn:
- When to use each action
- What reasoning serves which purposes
- How to adapt to observations
- When to transition between subgoals

For agent systems: **provide structure, teach strategy**. Define the reasoning-action framework, the available tools, the observation format. Then use training to teach when and how to use them.

## The Sparsity Question: How Much Reasoning Is Needed?

An interesting detail: ReAct uses sparse reasoning in ALFWorld (thoughts appear when strategically needed, not at every step) but dense reasoning in HotpotQA (thoughts appear before every action).

The paper suggests task characteristics determine appropriate reasoning density:

**Dense reasoning** (HotpotQA, FEVER):
- Tasks where every action requires careful justification
- Information-seeking where each search must be strategically chosen
- High cost of wrong actions (wasted searches, misleading information)

**Sparse reasoning** (ALFWorld, WebShop):
- Tasks with many routine actions that don't require deliberation
- Decisions clustered at key choice points (which room to search, when to stop searching)
- Low cost of exploratory actions (checking a location doesn't hurt)

Training should match task characteristics. For tasks requiring dense reasoning, annotate thoughts at every step. For tasks with sparse critical decisions, annotate thoughts only at choice points.

For agent systems: **adapt reasoning density to task structure**. Don't force reasoning at every step if most steps are routine. Don't omit reasoning at critical decision points even if most of the trajectory is straightforward.

## Transferable Principles for WinDAGs

1. **Annotate procedures, not facts**: Training data should capture *how* to solve problems, not memorize domain content.

2. **Collect full trajectories**: Include reasoning, actions, observations, and answers—not just input-output pairs.

3. **Bootstrap from strong models**: Use capable models to generate training trajectories for weaker models to learn from.

4. **Filter for success**: Train on trajectories that achieved correct outcomes to avoid learning failure patterns.

5. **Fix structure, learn strategy**: Provide reasoning-action framework, let training figure out when and how to use it.

6. **Match reasoning density to task needs**: Dense reasoning for every-decision-matters tasks, sparse for routine-with-critical-choices tasks.

7. **Procedural learning enables transfer**: Reasoning-acting patterns learned in one domain transfer to others with similar structure.

8. **Small models can learn from large**: Fine-tuned 8B model can outperform prompted 540B model by learning procedures, not memorizing facts.

9. **Iterate training data**: As models improve, regenerate training trajectories with better reasoning patterns.
```

## SKILL ENRICHMENT

- **Task Decomposition**: ReAct's explicit hierarchical subgoaling (find → take → clean → place) teaches decomposition through linguistic markers rather than fixed planning algorithms. Apply this by having decomposition skills generate not just action sequences but reasoning traces that track subgoal completion and guide adaptive refinement based on observations.

- **Code Review / Architecture Design**: The provenance tracking and error classification (hallucination vs. reasoning error vs. environment error) can be applied to code analysis. A code review skill should explicitly reason about "why might this be buggy" (reasoning), "let me check the API documentation" (external grounding), "the docs confirm this is deprecated" (observation), creating an auditable review process.

- **Debugging**: The failure mode taxonomy (reasoning loops, search errors, hallucination) maps directly to debugging patterns. A debugging agent should detect when it's repeating the same inspection actions (reasoning loop), when API responses are uninformative (search error), and when it's making assumptions not validated by code execution (hallucination). The uncertainty-based routing helps decide when to gather more runtime information vs. reason about code logic.

- **Security Auditing**: ReAct's principle "use external grounding for high-stakes factual claims" is critical for security. A security audit skill should never rely on internal knowledge about whether a library version has vulnerabilities—it must query CVE databases, security advisories, and dependency checkers. The thought traces create audit trails for compliance.

- **Information Retrieval / Research**: The multi-hop reasoning pattern (search X → extract Y → search Y → extract Z) directly transfers to research skills. The commonsense search space reduction ("X is more likely in sources A, B, C...") and search reformulation on failure are core research strategies. The combination of internal reasoning (what to search) and external grounding (where to search) is the