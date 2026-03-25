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