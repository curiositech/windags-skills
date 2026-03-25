# Fractionated Expertise: Why Competence in One Sub-Task Does Not Transfer to Adjacent Sub-Tasks

## The Problem That Both Traditions Agree On

One of the most useful and underappreciated findings in Kahneman and Klein's synthesis is what they call "fractionated expertise." It arises from a simple observation: professionals who are genuinely skilled in some aspects of their work are often called upon — and frequently volunteer — to make judgments in areas where their expertise does not actually extend. The result is confident, experienced-sounding judgment that has no more validity than a novice guess.

The paper is unambiguous: "Three professions — nurses, physicians, and auditors — appeared on both of Shanteau's (1992) lists. These professionals exhibited genuine expertise in some of their activities but not in others. We refer to such mixed grades for professionals as 'fractionated expertise,' and we believe that the fractionation of expertise is the rule, not an exception." (p. 522)

Fractionation is not the exception. It is the default condition. No professional has uniform expertise across all the tasks their title implies.

## The Structural Reason for Fractionation

Expertise develops task-by-task, not domain-by-domain. A domain label (physician, auditor, financial analyst) describes a professional identity, not a uniform skill profile. Within any professional domain, different sub-tasks have different:

- Validity levels (some sub-tasks have stable cue-outcome relationships; others don't)
- Feedback quality (some produce rapid unambiguous feedback; others produce delayed, noisy, ambiguous feedback)
- Learning opportunity (some are performed frequently enough to build pattern repertoire; others occur rarely)

The result is a jagged competence profile. A physician may be genuinely skilled at pattern-matching the symptoms of common infectious diseases (high validity, frequent occurrence, rapid feedback through treatment response) while being unreliable at predicting patient compliance with multi-month medication regimens (low validity, delayed feedback, high confounding).

Both the skill and the non-skill live in the same person, with the same title, with the same subjective confidence. And the person often cannot distinguish which mode they're in.

## The Auditor Example

Kahneman and Klein offer auditors as a particularly clean case: "Auditors who have expertise in 'hard' data such as accounts receivable may do much less well with 'soft' data such as indications of fraud." (p. 522, citing personal communication with Shanteau)

Accounts receivable: high validity (the numbers either add up or they don't), clear criteria, rapid feedback (errors are discovered at close or audit), extensive practice. Genuine expertise develops.

Fraud detection: low validity (fraudsters actively work to mimic legitimate patterns), ambiguous cues, delayed and sparse feedback (fraud is discovered late if at all), rare base rates (most accounts are legitimate, making the skill hard to train). The environment cannot support genuine expertise.

The auditor's decades of experience with accounts receivable does not transfer to fraud detection. Worse, the confidence the auditor has developed through genuine expertise in the former task bleeds over — unjustifiably — into the latter. The fractionation creates overconfidence exactly where underconfidence is warranted.

## The Finance Professional Example

The financial analyst version is worth quoting in full: "Finance professionals, psychotherapists, and intelligence analysts may know a great deal about a particular company, patient, or international conflict, and they may have received ample feedback supporting their confidence in the performance of some tasks — typically those that deal with the short term — but the feedback they receive from their failures in long-term judgments is delayed, sparse, and ambiguous." (p. 523)

The financial analyst may be genuinely skilled at assessing whether a company is currently operationally sound (short-term, direct cues, relatively rapid feedback). That skill does not extend to predicting whether the company's stock is underpriced (long-term, noisy feedback, confounded by market dynamics that are largely unpredictable). Same person, same domain label, radically different validity of the underlying judgment task.

## True Experts Know Their Boundaries

A diagnostic feature of genuine expertise versus overconfident fractionation is boundary awareness: "People in professions marked by standard methods, clear feedback, and direct consequences for error appear to appreciate the boundaries of their expertise. These experts know more knowledgeable experts exist. Weather forecasters know there are people in another location who better understand the local dynamics. Structural engineers know that chemical engineers, or even structural engineers working with different types of models or materials, are the true experts who should be consulted." (p. 523)

The weather forecaster who knows their model doesn't handle hail well is demonstrating genuine expertise. The one who produces hail forecasts with the same confidence as temperature forecasts is demonstrating fractionated expertise — competence in one area, overextension into another.

For agents: the ability to recognize the *boundaries* of a skill is itself a skill, and it develops under the same conditions as other skills — high validity, good feedback. Agents trained with poor feedback on when to escalate or defer will overextend just as human professionals do.

## Implications for Agent Skill Design and Invocation

In a WinDAGs system with 180+ skills, fractionated expertise is a systemic architectural risk. Consider:

**The naming problem**: A skill called "code_review" may have genuine depth in syntax checking and style enforcement (high validity, good feedback, frequent application) but be unreliable for security vulnerability detection (lower base rates, delayed feedback from actual exploits, sophisticated adversarial patterns). The label doesn't tell you which sub-tasks are truly skilled.

**The confidence bleed problem**: If the "code_review" skill produces high-confidence outputs based on its strong performance on syntax tasks, that confidence will appear in its security outputs too — not because those outputs are accurate, but because the model's internal coherence on the topic is high. The confidence is a property of the model's certainty, not of the security assessment's validity.

**The adjacency assumption problem**: Because skills are typically named for domains, not sub-tasks, orchestration systems naturally invoke them for any task in the domain neighborhood. A skill that is genuinely expert in sub-task A gets invoked for sub-task B because B is "in the same area." This is the exact mechanism of fractionated expertise.

## Detecting Fractionation in Agent Skills

A rigorous agent system should maintain metadata on each skill that encodes not just capability but *task-specific capability profile*:

**For each skill, document:**
1. Which specific sub-tasks have been validated with ground-truth feedback?
2. What is the validity of the environment for each sub-task? (Are there stable cue-outcome relationships?)
3. What is the quality and speed of feedback for each sub-task?
4. What are the adjacent sub-tasks that the skill might be invoked for, and which of those are validated vs. extrapolated?

**Orchestration rules derived from this:**
- Never invoke a skill for a sub-task that is only adjacent to its validated domain without flagging the output as "fractionated application"
- When invoking a skill near its domain boundary, require cross-validation or secondary agent review
- Confidence scores from fractionated applications should be discounted by a calibration factor reflecting the validity-gap between the validated sub-task and the invoked sub-task

## The Premortem as Fractionation Defense

Kahneman and Klein jointly endorse the premortem method precisely because it counteracts the overconfidence produced by fractionated expertise: "Project teams using this method start by describing their plan. Next they imagine that their plan has failed and the project has been a disaster. Their task is to write down, in two minutes, all the reasons why the project failed... The rationale for the method is the concept of prospective hindsight — that people can generate more criticisms when they are told that an outcome is certain. It also offers a solution to one of the major problems of decision making within organizations: the gradual suppression of dissenting opinions, doubts, and objections." (p. 524)

The premortem works because it changes the task: instead of defending a plan (which activates the overconfidence generated by genuine expertise in related areas), it requires generating reasons for failure (which activates broader critical thinking). For fractionated experts, the premortem surfaces concerns in the non-expert sub-domains that would otherwise be drowned out by confident expertise in the core domains.

For agent systems: a "premortem agent" or "adversarial reviewer" skill that is invoked on any high-confidence output to generate plausible failure modes is a direct implementation of this defense. The premortem agent should be designed specifically to challenge the framing and assumptions of the primary agent's output, not just verify the logic within the established frame.

## The Meta-Skill of Domain Calibration

The paper's deepest implication about fractionated expertise is that *knowing when you don't know* is itself a skill, not just a virtue. True experts develop it through experience with direct consequences for overextension. Agents can develop it through explicit calibration training — feedback not just on whether outputs are correct, but on whether confidence scores are calibrated across different sub-task types.

This is distinct from general calibration. An agent can be well-calibrated on average but systematically overconfident at domain boundaries — precisely the pattern fractionated expertise produces. Calibration training needs to be *sub-task specific*, not just overall.

The goal: agents that produce high confidence in their validated sub-domains, correctly reduced confidence at domain boundaries, and explicit uncertainty flags when invoked for tasks they have not been validated on. This requires the training infrastructure to track sub-task performance separately, not just aggregate domain performance — the exact diagnostic that Shanteau's original work made possible.