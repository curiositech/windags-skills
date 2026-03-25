---
name: toulmin-argument-analysis
description: "Structure and analyze arguments using the Toulmin model (Claim-Data-Warrant-Backing-Qualifier-Rebuttal). Use when the user wants to build logical arguments, evaluate reasoning, prepare formal debate, clarify messy reasoning, write persuasive pieces, or mentions 'argument structure', 'warrant', 'backing', 'logical framework', 'structure this argument'. Useful as input for speech-writing, fallacy detection, and steelmanning."
---

# Toulmin Argument Analysis

## When to Use This Skill

Load this skill when the user:

- Wants to **build or structure a logical argument** from scratch
- Asks you to **analyze or evaluate** existing reasoning or a written argument
- Is preparing for **formal debate, legal reasoning, or academic writing**
- Has **messy, emotional, or tangled reasoning** that needs to be clarified
- Is writing a **persuasive essay, op-ed, or policy brief** and needs to shore up their logic
- Mentions any of: "argument structure", "warrant", "backing", "logical framework", "structure this argument", "is this reasoning valid?", "make my case stronger", "what's missing from my argument"
- Wants to **de-escalate a conflict** by making implicit assumptions explicit
- Needs input for downstream skills: `logical-fallacy-detector`, `forensic-speech-structure`, `steel-man-argument`, or `socratic-questioning`

Also load this skill when working with personal or interpersonal arguments — see `references/examples/relationship-boundary-examples.md` for fully worked personal examples.

---

## The Toulmin Model — 6 Components

The Toulmin model, introduced by philosopher Stephen Toulmin in *The Uses of Argument* (1958), treats argument as a living, practical activity rather than a formal syllogism. It maps six structural elements that every real argument contains or implies.

For deep background on the model's history, comparisons with other frameworks, and patterns of weakness, read: `references/theory/toulmin-model.md`

### 1. Claim
**The thesis or conclusion being argued.**

The claim is what the arguer wants the audience to accept. It is the destination — everything else in the argument exists to support it.

- *Simple*: "We should adopt a four-day work week."
- *Personal*: "You need to change how you communicate with me."
- Always ask: *What is this person ultimately asserting?*

### 2. Data (Grounds)
**Evidence, facts, observations, or experiences that support the claim.**

Data is the "because" — the raw material the arguer points to as justification. It can be statistics, personal testimony, documented events, or physical evidence.

- *Simple*: "Studies show productivity stays flat or increases with a four-day schedule."
- *Personal*: "In our last three arguments, I couldn't get a word in."
- Always ask: *What is the arguer pointing to as proof?*

### 3. Warrant
**The logical bridge that connects the data to the claim.**

The warrant is the most important and most commonly missing element. It is the rule, principle, or assumption that makes the data relevant to the claim. Warrants are often implicit — the arguer assumes the audience shares them.

- *Simple*: "Productivity-neutral schedules that improve worker wellbeing should be adopted."
- *Personal*: "Being interrupted repeatedly is evidence of not being listened to."
- Always ask: *Why does this data support this claim? What assumption makes that connection?*

### 4. Backing
**Support for the warrant itself.**

When the warrant is likely to be challenged, backing provides the foundation for why the warrant is credible. Backing may be scientific consensus, legal precedent, cultural norms, or philosophical principles.

- *Simple*: "Labor economics research shows wellbeing directly predicts long-term retention and output."
- *Personal*: "Communication research defines 'active listening' as letting the other person complete their thoughts."
- Always ask: *Why should we accept this warrant?*

### 5. Qualifier
**Words and phrases indicating the strength or scope of the claim.**

Qualifiers hedge the claim appropriately — no good argument claims more than the data can support. Look for: *most, likely, generally, in many cases, under normal circumstances, probably, often, sometimes*.

- *Simple*: "In most knowledge-work contexts, a four-day week would likely improve outcomes."
- *Personal*: "I often feel unheard when we argue."
- Always ask: *How strong is this claim? Is it universal or conditional?*

### 6. Rebuttal
**Conditions, exceptions, or counterarguments under which the claim would not hold.**

A well-formed argument anticipates objections and specifies when the claim does not apply. Rebuttals demonstrate intellectual honesty and strengthen the overall argument.

- *Simple*: "Unless the business requires five-day client coverage or operates in sectors where continuous staffing is legally required."
- *Personal*: "Except in high-stress situations where I may need to interrupt to stop escalation."
- Always ask: *When would this argument fail? What are the exceptions?*

---

## Workflow

### Input
Accept any of:
- Free-form text (an essay, an argument written out, a conversational excerpt)
- A single-sentence position the user wants to develop
- A structured argument the user wants audited
- A transcript of a debate or disagreement

---

### Step 1 — Identify the Core Claim(s)

Read the input and extract the primary claim. In long arguments, there may be nested sub-claims. Identify the main conclusion first, then note supporting sub-claims separately.

> If the claim is unclear, infer the most charitable interpretation before proceeding.

---

### Step 2 — Extract Explicit Data / Grounds

List all facts, observations, statistics, and examples the arguer provides. Quote or paraphrase directly from the input. Do not infer data that is not present — note absence explicitly.

---

### Step 3 — Infer the Warrant (Make It Explicit)

This is the most important step. Warrants are almost always unstated. Your job is to surface the hidden assumption that makes the data relevant to the claim.

Phrase the warrant as a general principle: *"[Type of data] is/are sufficient reason to [accept the claim] because [underlying principle]."*

If multiple warrants are possible, present the most plausible one and note alternatives.

---

### Step 4 — Look for Backing, Qualifiers, and Rebuttals

- **Backing**: Does the arguer support their warrant, or is it assumed without foundation?
- **Qualifiers**: Are any hedging words present? If the claim is stated absolutely when it should be qualified, flag that.
- **Rebuttals**: Does the argument acknowledge exceptions? If not, note the absence.

---

### Step 5 — Present the Structured Analysis

Present the breakdown in the output format below. Be precise and concise for each component.

---

### Step 6 — Provide a "Missing Pieces" Summary

After the structured breakdown, add a brief diagnostic:

- Which components are **absent or weak**?
- Is the **warrant unstated and contestable**?
- Is the **claim over-qualified or under-qualified**?
- Are there **obvious rebuttals the arguer ignored**?
- What **one action** would most strengthen the argument?

---

## Output Format

Present every analysis using this labeled structure:

```
## Toulmin Analysis

**Claim:**
[The core conclusion being argued]

**Data (Grounds):**
[Evidence and facts provided — quote or paraphrase from the source]

**Warrant:**
[The logical bridge connecting data to claim — make implicit warrants explicit]

**Backing:**
[Support for the warrant — note if absent]

**Qualifier:**
[Hedging language used — note if the claim is stated without appropriate qualification]

**Rebuttal:**
[Acknowledged exceptions — note if absent]

---

### Missing Pieces / Diagnostic
- [Weakness 1]
- [Weakness 2]
- **Strongest next step:** [One concrete recommendation]
```

For multi-claim arguments, present one full breakdown per sub-claim, then a summary.

---

## Examples

### Example 1 — Policy Argument

**Raw input:** "We should ban single-use plastics because they are clogging our oceans and killing marine life."

**Toulmin Analysis**

**Claim:** Single-use plastics should be banned.

**Data:** Single-use plastics are clogging oceans and killing marine life.

**Warrant:** *(Implicit)* Products that cause substantial, demonstrable environmental harm and death to wildlife ought to be legally prohibited.

**Backing:** *(Absent — not stated)* Could be supported by: environmental ethics frameworks, the precautionary principle, international treaty obligations (UNCLOS), or empirical research on plastic mortality rates in marine species.

**Qualifier:** *(Absent — claim is absolute)* The word "ban" implies a universal prohibition. A stronger version might say "in most consumer contexts, a phase-out of single-use plastics is warranted."

**Rebuttal:** *(Absent)* No exceptions acknowledged — e.g., medical devices, food safety packaging, or low-income access concerns.

**Missing Pieces / Diagnostic**
- Warrant is strong but unstated — making it explicit reveals it is contestable (some argue harm-reduction regulation is preferable to prohibition)
- No qualifier — treating a complex policy question as absolute weakens credibility
- No rebuttal — ignoring medical or economic exceptions makes the argument easy to attack
- **Strongest next step:** Add a qualifier ("except where no viable alternative exists") and acknowledge the medical device carve-out explicitly

---

### Example 2 — Scientific Claim

**Raw input:** "Intermittent fasting works for weight loss. Multiple RCTs show it produces caloric deficits comparable to continuous restriction."

**Toulmin Analysis**

**Claim:** Intermittent fasting is an effective weight-loss strategy.

**Data:** Multiple randomized controlled trials (RCTs) show it produces caloric deficits comparable to continuous caloric restriction.

**Warrant:** *(Implicit)* Interventions that produce outcomes equivalent to established methods in controlled trials are valid alternatives worth recommending.

**Backing:** Evidence-based medicine treats RCT data as the gold standard for intervention efficacy — this is a well-accepted methodological principle.

**Qualifier:** "Comparable" — the argument correctly avoids claiming superiority; it asserts equivalence. This is appropriately modest.

**Rebuttal:** *(Partially stated)* "Comparable to continuous restriction" implicitly acknowledges this is not a breakthrough — it works as well as other methods, not better. Could explicitly note: does not work for all individuals; long-term adherence data is mixed; may be contraindicated for people with certain metabolic conditions.

**Missing Pieces / Diagnostic**
- Backing is strong (RCT methodology is well-accepted)
- Qualifier is present and appropriate
- Rebuttal is implicit but should be made explicit for a formal argument
- **Strongest next step:** Add an explicit rebuttal clause addressing individual variation and contraindications

---

### Example 3 — Interpersonal / Relationship Argument

**Raw input:** "You never listen to me. Every time I try to bring something up, you cut me off or change the subject."

**Toulmin Analysis**

**Claim:** The other person does not listen.

**Data:** In conversations where the speaker raises issues, the other person interrupts or redirects the topic.

**Warrant:** *(Implicit)* Interrupting and redirecting are behaviors that constitute "not listening" — i.e., those behaviors are sufficient evidence of failed listening.

**Backing:** *(Absent — assumed)* Communication research defines active listening as sustaining attention and allowing the speaker to complete thoughts. This could be cited as backing but is not stated.

**Qualifier:** "Never" — this is an absolute qualifier that overstates the claim and is likely to trigger defensiveness rather than agreement. A more accurate qualifier would be "often" or "when I raise serious concerns."

**Rebuttal:** *(Absent)* No acknowledgment of cases where the other person did listen, or of circumstances (stress, distraction) that might explain the behavior.

**Missing Pieces / Diagnostic**
- The word "never" is the biggest vulnerability — it invites counterexamples and derails the conversation
- The warrant is contestable: interrupting can be a sign of engagement rather than dismissal in some relational styles
- No backing is offered — citing a shared understanding of what "listening" means would ground the argument
- **Strongest next step:** Replace "never" with "often" or "in situations that matter to me," and state the warrant explicitly: "When I'm cut off, I experience that as not being heard"

> For deeper worked examples of relationship arguments through the Toulmin lens, including "We need to spend more time together," "I need space to process," and "You're being controlling," read: `references/examples/relationship-boundary-examples.md`

---

## Collaboration Hooks

This skill is designed to slot into a broader analytical pipeline:

| Downstream Skill | How This Skill Feeds It |
|---|---|
| `logical-fallacy-detector` | Expose the warrant explicitly — logical fallacies are most visible at the warrant level (e.g., false dichotomy, appeal to authority, slippery slope) |
| `forensic-speech-structure` | The 6-component breakdown maps directly onto speech sections: intro (claim), body (data + backing), transitions (warrant), conclusion (rebuttal + qualifier) |
| `steel-man-argument` | Normalize the argument's structure first, so steelmanning strengthens each component rather than rewriting from scratch |
| `socratic-questioning` | Missing pieces from the diagnostic map directly to productive Socratic questions — each gap is a question worth asking |

**Upstream compatibility:** This skill accepts raw text from any source — conversation, document, essay, or debate transcript. No preprocessing required.
