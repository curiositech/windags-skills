# Recognition-Primed Decision Making: How Expert Agents Should Actually Choose Actions

## The Core Discovery

Gary Klein and Roberta Calderwood's field research with urban fireground commanders revealed something that challenges the foundation of most AI decision systems: **proficient decision-makers almost never compare options**. Across 156 decision points studied in actual emergency incidents, 81.4% were "recognition matches" — the expert recognized the situation, generated one action, tested it mentally, and acted. Only 18.6% involved any concurrent deliberation between alternatives.

This is not a flaw in expert cognition. It is the signature of genuine expertise.

The classical model of decision-making — enumerate alternatives, assess probabilities, compute utilities, select the maximum — is not how firefighters, military commanders, business executives, or judges actually decide. And it is not how high-performing agent systems should decide either.

## The Recognition-Primed Decision (RPD) Model

The RPD model describes how expert decision-making actually unfolds:

**Step 1: Situation Recognition**
The agent perceives the current state and asks: *Have I seen something like this before?* Expertise consists largely of a rich library of prior situations (prototypes and analogues) against which the current situation is matched. When a match is found, recognition is not just the identification of a category — it carries with it a bundled package of:
- Plausible goals for this situation
- Relevant cues to monitor
- Expected trajectory (what should happen next)
- Typical actions associated with this situation type

**Step 2: Serial Option Generation**
Rather than generating a full set of alternatives and comparing them, the expert generates the *single most likely action* given the recognized situation. This is not random — it is experience-weighted, drawing on the prototype match. The first option generated is the one that has worked in the most similar past situations.

**Step 3: Mental Simulation**
Before acting, the expert runs a forward simulation: *If I do this, what happens?* They mentally "watch" the option being implemented, looking for failure modes, contradictions with current constraints, or unexpected consequences. This is the evaluation step — but it evaluates the single option against the situation, not multiple options against each other.

**Step 4: Execute, Modify, or Reject**
- If the simulation reveals no serious problems → execute.
- If the simulation reveals fixable problems → modify the plan.
- If the simulation reveals fundamental problems → reject this option and return to Step 2, generating the *next most typical* action.

The critical point: **options are evaluated serially, not in parallel.** The agent is not doing a tournament; they are doing a quality check on each candidate in order of plausibility.

## Why This Works (And When It Fails)

The RPD model works because expert experience encodes a reliable ordering of option quality. The first option generated tends to be workable precisely because experts have learned, through years of domain experience, which actions are typically appropriate for which situation types. Klein and Calderwood report that approximately 85% of the 156 decisions studied were made in under one minute — a time frame in which analytical decision strategies simply cannot be completed.

The model implies a crucial asymmetry: **the cost of the first option being wrong is low** (you simply generate the next one), while **the cost of exhaustive option comparison is high** (time, cognitive load, action delay). Satisficing — finding the first good-enough option — is not a cognitive shortcut born of laziness. It is an optimal strategy given real operational constraints.

**The model fails when:**
- The situation is genuinely novel (no prior prototype exists to match against)
- The situation superficially resembles a familiar prototype but is importantly different (dangerous false recognition)
- Mental simulation capacity is exceeded by situation complexity
- Time allows for deliberative analysis AND stakes are high enough to warrant it

## Implications for Agent System Design

### 1. Don't Build Agents That Always Compare Options
An agent that always enumerates alternatives and scores them is not a better decision-maker — it is a slower one, and slower in exactly the situations (high time pressure, high uncertainty) where speed matters most. For routine and familiar problem classes, agents should recognize the situation type and directly generate the most likely effective action.

### 2. Build Rich Situation Libraries, Not Just Action Libraries
The expertise is in the recognition, not the rules. An agent system's most valuable asset is a well-organized library of past situations (cases, prototypes, patterns) with their associated:
- Context conditions under which each situation was recognized
- Actions that proved effective
- Failure modes discovered during similar cases
- Expected trajectories and monitoring cues

This is exactly the case-based reasoning architecture Klein and Calderwood point toward: "Prior cases could be stored in an analogy bank so that they could be retrieved individually, or there could be a means of retrieving and synthesizing several cases at once, to allow prototype matching."

### 3. Implement Mental Simulation as a Core Skill
Before executing any action, agents should have the capacity to run a forward simulation of that action's consequences within the current context. This is not a full probabilistic rollout — it is a targeted feasibility check that asks:
- Does this action conflict with any current constraints I know about?
- Does this action create problems downstream that I can anticipate?
- Are there known failure modes for this action in situations like this one?

The simulation catches problems that recognition alone misses. It is where the agent earns its reliability.

### 4. Design for Serial, Not Parallel, Option Evaluation
When a primary action candidate fails simulation, agents should move to the *next most likely* action given the recognized situation — not restart an exhaustive search. This requires that situation recognition produce not just a single best action but an *ordered list* of plausible actions, so that fallback is fast and contextually appropriate.

### 5. Invest in Situation Assessment, Not Option Scoring
The most powerful place to improve agent decision quality is in situation understanding — the "predecision process." An agent that correctly understands the current situation will almost automatically generate the right action. An agent that misunderstands the situation will generate the wrong action no matter how carefully it scores options.

Decision support for agents should therefore focus on:
- Improving the accuracy and completeness of situation representation
- Flagging anomalies that suggest the situation may not match the recognized prototype
- Prompting the agent to verify key expectations before committing to action

## The Fireground Commander as Agent Design Ideal

The example Klein and Calderwood provide of the rescue commander at the highway overpass is worth studying carefully as a design template:

> "The commander considered using a Kingsley harness... but, as he imagined carrying out such a rescue, he realized that it would be dangerous... So he rejected this option. Next he imagined attaching the harness from the back, but as he played this out in his mind he saw the woman's back bending sharply... He considered using a Howd strap instead of a Kingsley harness, but when he performed the mental simulation he found the same problems. Then he realized he could use a ladder belt... The commander imagined this scenario a few times, and ordered his crew to use a ladder belt."

Notice the structure:
- No explicit comparison between options
- Each option evaluated individually against the specific situation
- Rejection driven by simulated failure, not utility scoring
- Selection driven by simulation success, not comparative ranking
- The solution (ladder belt) is not "best" in some abstract sense — it is *the first one that works* in this specific situation

This is the model for agent action selection in complex, time-pressured domains.

## What This Means for the Gap Between Training and Performance

Klein and Calderwood note that "one of the deceptive qualities of rules is that the consequent follows so naturally from the antecedent; it is not always readily apparent how much expertise is needed in order to recognize when the antecedent has occurred."

For agent systems, this means: **the bottleneck is not the action library, it is the situation classifier.** An agent may have a perfectly good repertoire of responses, but if it misclassifies the situation, it will retrieve the wrong response. Training agents on what to do in labeled situations is far less valuable than training agents to reliably classify unlabeled situations into their correct types.

The performance gap between novice and expert agents will manifest not in the quality of their actions given correct classification, but in the reliability of their classification under ambiguous, noisy, or novel conditions.