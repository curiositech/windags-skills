# Recognition-Primed Decision Architecture: How Experts Actually Choose

## The Core Finding

The dominant model of decision-making — the decision tree, with its branching alternatives, probability estimates, and utility comparisons — is not how expert practitioners make decisions in operational environments. This is not because experts are lazy or irrational. It is because the decision tree model describes a process that almost never happens in the field.

Klein and Calderwood's landmark field study of urban fireground commanders (FGCs) found that across 156 analyzed decision points in real emergency incidents, **only 18.6% involved concurrent deliberation** — the simultaneous comparison of two or more options. The remaining **81.4% were recognition-based**: the commander recognized the situation as familiar, generated a single plausible course of action, and evaluated it. No comparison. No utility scoring. No probability tree.

This finding was not a fluke. It held up across command-and-control studies of Army commanders, analyses of the Cuban Missile Crisis, jury deliberation research, business executive studies, and nuclear power plant operations. The pattern is consistent: when people with genuine domain expertise face real operational conditions, they do not compare alternatives. They recognize and act.

## The Structure of the RPD Model

The Recognition-Primed Decision (RPD) model has the following architecture:

**Step 1: Situation Recognition**
The decision-maker encounters a situation and asks: "Have I seen something like this before?" The judgment of familiarity is not binary — it operates on a spectrum from exact match to analogical match to prototype match. Crucially, this recognition is not just pattern-labeling. It comes bundled with:
- **Feasible goals**: What outcomes are achievable here?
- **Relevant cues**: What should I be attending to?
- **Expectancies**: What should happen next if my assessment is correct?
- **Plausible actions**: What do people do in situations like this?

**Step 2: Action Generation (Serial, Not Parallel)**
The decision-maker does not generate a list of options to compare. They generate one option — the most typical, most experience-grounded response to this recognized situation type. This is the first candidate.

**Step 3: Evaluation by Mental Simulation**
Rather than scoring this option on abstract dimensions, the decision-maker runs a mental simulation: "If I do this, what happens?" They watch the action play out in their mind's eye, looking for failure points, unexpected complications, or unacceptable consequences.

The classic example from Klein and Calderwood: a rescue commander trying to free a semiconscious woman dangling from highway support poles. He considered a Kingsley harness — imagined attaching it — saw the woman's back bending sharply — rejected it. Considered a Howd strap — same problem. Then imagined a ladder belt: lift her an inch, slide it under, attach the rope. No problems in simulation. Ordered the crew to use the ladder belt. "Notice that several different options were considered but none was contrasted to another. Instead, each was examined for feasibility, and the first acceptable one was implemented."

**Step 4: Satisficing, Not Optimizing**
The goal is not to find the best option. The goal is to find the first workable option. "Workable," "timely," and "cost-effective" were the criteria that FGCs used — not "optimal." If the simulation reveals no fatal problems, the option is executed. If it reveals problems, the option is modified or rejected, and the next most typical option is considered.

## Why This Architecture Makes Sense

Consider the operational environment: approximately 85% of the decisions studied were made in under one minute. Research consistently shows that analytical decision strategies (MAUA, formal decision analysis) cannot be completed in this time frame. An FGC who stopped to enumerate all options and score them against evaluation dimensions would arrive at a burning building to find it had already collapsed.

But this is not merely about speed. The RPD model is superior to analytical approaches in recognition-heavy domains for a deeper reason: **expertise is embedded in the recognition step**. The value of a decade of experience is not primarily that it gives you better probability estimates — it is that it gives you the ability to instantly recognize what type of situation you're in, what the key features are, what's likely to happen next, and what a reasonable response looks like. The analytical framework bypasses this entirely and asks the expert to pretend they're a novice working from first principles.

As Klein and Calderwood note: "Expertise often enables a decision maker to sense all kinds of implications for carrying out a course of action within a specific context, and this sensitivity can be degraded by using generic and abstract evaluation dimensions."

## Implications for Agent System Design

### Architecture: Recognition Before Search

An agent system designed around the RPD model does not begin with option generation. It begins with **situation classification**. Before any action is proposed, the system should attempt to recognize the current situation as belonging to a known type or category. This classification step is not merely routing — it activates a bundle of associated context:
- What goals are achievable given this situation type?
- What cues deserve monitoring?
- What typically goes wrong here?
- What does a reasonable first response look like?

This suggests a **case-based layer** that precedes any planning or option-evaluation layer. The case base should be organized around situation types, not just task types.

### Evaluation: Serial Mental Simulation, Not Parallel Scoring

When an agent generates a candidate action, the evaluation method should not be a scoring function applied to abstract dimensions. It should be a **forward simulation** of that action in context:
- What happens in step 2, step 3, step 5?
- Where might this go wrong?
- Are there resources available at each step?
- Does the expected state of the world at each step match what the simulation predicts?

This is exactly what a "mental simulation" skill would do: take a proposed action sequence, project it forward through the known task context, and flag mismatch points.

### Satisficing Termination Condition

The system should not continue generating and evaluating options in search of the optimal one. It should **stop at the first workable option**. This is not laziness — it is appropriate satisficing. The system should only resume option generation if the current candidate fails simulation evaluation. This prevents the pathological optimization spiral where the system delays action indefinitely searching for something better.

### Expert vs. Novice Mode

RPD is appropriate for agents with rich domain experience encoded in their case bases. For novel domains or genuinely unprecedented situations, a more analytical approach may be warranted. The system should be able to detect when it is in "novice territory" (no close case matches available) and shift to a more deliberate, analytical mode — while flagging this shift explicitly, since analytical approaches in operational conditions come with significant reliability costs.

## Boundary Conditions

The RPD model is NOT universally superior:
- In well-defined, bounded problems with clear options and measurable outcomes (e.g., which algorithm to use for a known sorting problem), analytical comparison may be faster and more reliable than recognition.
- When the agent genuinely lacks domain experience (no relevant cases), recognition cannot be primed. Novice agents should be designed differently.
- In high-stakes, irreversible decisions with ample time available, the additional rigor of analytical methods may be worth the cost.
- When the situation contains deliberate deception or adversarial manipulation of familiar cues, recognition-based approaches become a liability.

The key diagnostic question: **How much domain-relevant experience is available, and how much time is available to apply it?** High experience + low time = RPD. Low experience + high time = analytical. The other combinations require hybrid approaches.

## What This Book Sees That Others Miss

Most AI decision-making frameworks are built on the analytical model — they assume that better decisions come from better option enumeration and scoring. Klein and Calderwood reveal that this model is empirically wrong for the conditions that matter most. The paper's most important contribution is not just the RPD model itself, but the demonstration that **expertise is primarily a recognition capability, not an analytical one**. This fundamentally reframes what "supporting expert decision-making" means: not better scoring algorithms, but richer, faster, more accurate situation recognition.