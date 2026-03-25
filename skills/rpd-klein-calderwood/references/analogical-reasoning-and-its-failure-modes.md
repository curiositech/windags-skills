# Analogical Reasoning in Expert Decision Making: When Cases Help and When They Harm

## The Original Hypothesis and Why It Was Revised

The research program described in this report began with the hypothesis that analogical reasoning was the primary mechanism by which experienced decision makers leverage their past experience. The original project was titled "Analogical Decision Making."

This hypothesis was revised. Klein and Calderwood found that analogical reasoning — explicit recall and use of a specific past case — was reported relatively infrequently in their data. Across the full data set of over 400 decision points from more than 100 decision makers, only 33 analogues were identified in enough detail to analyze their function. Analogies appeared, but they were not the dominant mechanism.

Why? "Analogical reasoning is reported relatively infrequently by experts, perhaps because the individual cases have often merged into prototypes." Expert decision makers have processed so many cases that specific incidents have been abstracted away — consolidated into a general schema that captures the pattern without storing the individual case. The expert "knows from experience" without being able to point to which experience.

But Klein and Calderwood did not conclude that analogies are unimportant. The opposite conclusion emerged: when analogies are explicitly invoked, they are typically invoked precisely because the routine prototype doesn't fit. "When analogical reasoning occurs, it is often critical for success. For experts, it often emerges during non-routine cases."

## The Three Functions of Analogical Reasoning

Analysis of the 33 identified analogues revealed three distinct functions:

**1. Understanding Situational Dynamics**: The analogue helps the decision maker understand *why* the current situation has the features it does, and how it is likely to evolve. Rather than pattern-matching to a generic prototype, the decision maker retrieves a specific case whose causal dynamics match the current situation's dynamics. "I've seen this before — the fire was spreading vertically like this when the attic was acting as a chimney" provides causal interpretation, not just pattern recognition.

**2. Generating Options**: The specific past case suggests a specific response that was used then and might apply now. Where the generic prototype suggests "typical actions for this situation type," the specific analogue suggests "what we did in case X and why it worked." This is valuable when the current situation deviates from the prototype in ways that might make typical actions less appropriate.

**3. Evaluating Probable Success or Failure**: The analogue serves as a test case for progressive deepening. "When we tried this approach in situation Y, it failed because of Z — does Z apply here?" The past case becomes a source of prior experience about failure modes, accelerating the mental simulation.

## The Critical Role of Analogues in Non-Routine Cases

The RPD framework accounts for routine cases through prototype-based recognition: the situation matches a known type, the action queue is retrieved, evaluation proceeds. But not all situations are routine. When a situation presents features that don't fit the standard prototype — when something is wrong, unusual, or unprecedented — the routine schema may not provide adequate guidance.

In these non-routine cases, specific analogues become critical. The expert searches memory for a case that shares the unusual features of the current situation, even if it differs on many dimensions. The specific past case provides a richer, more targeted source of guidance than the abstract prototype.

Klein and Calderwood note: "When analogues are used (often to address aspects of a problem that are not routine), they are critical to option selection." The analogue bridges the gap between the generic schema (which doesn't quite fit) and the specific decision needed.

## The Primary Failure Mode: Inappropriate Analogues

If appropriate analogues are critical for non-routine cases, then *inappropriate* analogues — wrong comparison cases — become the primary cause of error in exactly those non-routine cases where expertise is most needed.

"Inappropriate analogues are a primary cause of errors."

The mechanism is insidious. When an expert retrieves an inappropriate analogue, they do not typically know it is inappropriate. The analogue feels like a fit — it was selected because of some surface or structural similarity to the current situation. The expert then uses this analogue to understand the situation, generate options, and evaluate probable success. All three functions are now being driven by the wrong reference case.

The expert's progressive deepening will then run — and it will be sophisticated and detailed — but it will be simulating the *analogue's* situation, not the actual one. The expert may confidently execute a course of action that was correct in the remembered case but is wrong in the current one.

This is worse than the novice error of thin option evaluation. The novice's errors are visible — they deliberate, they show their work, their uncertainty is legible. The expert's analogical error is invisible — the decision process looks competent and confident and moves quickly to implementation.

## The Novice Analogue Problem: Use Without Adaptation

The armored platoon study revealed a different failure mode in novice analogical reasoning. "Novices appear to rely more heavily than experts on analogical reasoning, but have not learned how to apply the analogues, modify them, or reject them. Therefore almost half the analogue use by novices results in poor choices."

The expert uses an analogue as a starting point and then adapts it: "This is like case X, but differs in Y and Z, so the response needs to be modified accordingly." The novice applies the analogue directly, without checking whether the differences between the current situation and the remembered case are consequential.

The expert's prototypical knowledge provides the structure for assessing which differences between cases matter. Without that structure, the novice cannot determine which features of the remembered case are essential (and must be matched for the analogue to apply) and which are incidental (and can be ignored). They pattern-match on surface features and apply the analogue globally.

This creates a particularly harmful dynamic: the novice's use of analogues can *reduce* performance by giving them inappropriate confidence. Rather than defaulting to slow, careful deliberation in an uncertain situation, they retrieve a (wrong) analogue and proceed with the false certainty of someone who "knows what to do."

## The Automaticity Question

One of the more philosophically interesting findings is that successful analogue retrieval appears to be largely automatic and unconscious in experts. Interviewees frequently reported *knowing* that they were reminded of a past case without being able to explain how the reminding occurred. "The processes involved in selecting and using analogues are relatively automatic and unconscious."

This creates a methodological problem for research (and for building AI systems): the most critical analogical reasoning processes are not introspectively accessible. Experts can report that they were reminded, and they can often describe the remembered case, but they cannot report the retrieval process itself.

It also creates an operational problem. If appropriate analogue retrieval is automatic, then the expert has limited ability to deliberately override an inappropriate reminding. The wrong case "comes to mind" and the expert may not recognize it as wrong — they may experience it as legitimate insight.

This suggests that error prevention through deliberate analogue checking ("let me make sure this is the right comparison case") is limited in effectiveness. The unreflective analogue that drives the situation assessment before conscious deliberation can begin is the dangerous one.

## Application to Agent System Design

**Case Libraries vs. Abstract Schema Libraries**: Agent systems need both. Abstract schemas (situation type → (goals, cues, expectancies, actions)) handle routine cases efficiently. Case libraries (specific past cases with their causal dynamics, what was tried, what worked, what failed) handle non-routine cases that deviate from the prototype. The two serve different functions and should be architected separately.

**Non-Routine Detection as a Critical Skill**: Agents need reliable detection of when a situation is sufficiently non-routine to require case-based rather than schema-based reasoning. If the prototype activation is weak or generates poor expectancy matches, this is a signal to shift to case retrieval. The threshold for this shift must be calibrated — too high and non-routine cases are mishandled by inappropriate schemas; too low and every routine case triggers expensive case retrieval.

**Analogue Validation Before Commitment**: Unlike human experts (where inappropriate analogues can be irreversible), agent systems can build in an analogue validation step: before an analogue drives option selection or situation interpretation, check whether the current situation matches the analogue on the *causally relevant* dimensions, not just surface features. This requires encoding which features of a case are essential vs. incidental.

**Diversity in Analogical Retrieval**: Retrieving multiple candidate analogues and checking which one best fits the current situation's causal structure is more robust than retrieving the first analogue that comes to mind. This is analogous to the RPD's serial evaluation: consider candidates in sequence, check fit, proceed with best fit.

**Novice Mode = More Analogue Scaffolding**: In domains where the agent system lacks rich schemas (equivalent to novice expertise), it should rely more heavily on case-based reasoning but apply strict adaptation protocols — explicitly checking what is different between the retrieved case and the current situation and modifying the implied response accordingly.

**Error Logging Should Tag Analogical Reasoning**: Because inappropriate analogues are a primary cause of expert error, and because they produce confident wrong actions, post-hoc error analysis should specifically check whether an analogue was driving the situation assessment at the time of the error. This supports systematic improvement in analogue library quality.