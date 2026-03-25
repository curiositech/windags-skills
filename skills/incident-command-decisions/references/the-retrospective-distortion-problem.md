# The Retrospective Distortion Problem: Why What Experts Say They Did Is Not What They Did

## The Central Epistemological Trap

There is a profound and underappreciated problem at the heart of knowledge elicitation from expert decision-makers. Nearly all of what we know about how experts make decisions comes from *after* those decisions were made — from interviews, debriefs, after-action reviews, and case studies. And this data is systematically, predictably unreliable.

Njå and Rake document this problem with unusual honesty:

> "It has always bothered us that the 'decision-making' we have observed during actual crises seldom corresponds to the picture evoked in later interviews outside of the actual crisis context, where the process is often depicted as explicit, conscious, individually based and involves the consideration of alternative options." (Njå & Rake, p. 14, quoting Quarantelli, 2002)

This is not a minor methodological caveat. It is a fundamental challenge to the knowledge base on which both NDM and the Contingency Approach are built — and, by extension, to any intelligent system that learns from documented human expert behavior.

## The Mechanisms of Distortion

Several distinct distortion mechanisms are at work simultaneously in post-hoc decision accounts:

### 1. Normative Reconstruction

> "Memory errs in the direction of how the respondent feels he/she should have behaved." (Njå & Rake, p. 12, citing Scott, 1955)

When asked to recall their decisions, people reconstruct a version that is more deliberate, more rational, and more aligned with standard procedures than what actually occurred. The on-scene commander who "wildly guessed" describes a structured assessment process in the debrief. The incident commander who relied on intuition describes a systematic options analysis.

One respondent, interviewed in the field during an active crisis, acknowledged directly: *"I could tell you I know what I am doing, but you can clearly see I'm wildly guessing in much of what I'm doing."* (Njå & Rake, p. 10) This same commander, interviewed later, would almost certainly describe a more structured process.

### 2. Blame-Avoidance Filtering

> "Since damage and/or severe consequences are always involved, blame fixing is an integral – but often indirect – part of communication." (Njå & Rake, p. 11)

Post-crisis interviews occur in a context where responsibility for outcomes has real consequences. People naturally edit their accounts to emphasize decisions that were defensible and minimize or omit decisions that were not. The data is filtered through self-preservation, not deliberately, but structurally.

### 3. Group Version Formation

> "A 'group version' of an event can develop during a very short period." (Njå & Rake, p. 12)

Between the event and the interview, participants talk to each other. A shared narrative emerges. Details that don't fit the narrative are quietly dropped. The interview captures not individual memory but a collectively negotiated account. In Njå and Rake's own research, multiple respondents describing the same critical incident produced "versions [that] varied substantially" — but the variations were not random; they reflected each respondent's role and interests.

### 4. Temporal Decay and False Confidence

With time, specific memories fade and are reconstructed from general schemas. The commander may not remember which information arrived in which order — but they have a strong schema for how such decisions should go, and they fill the gaps with that schema. The result is a confident, coherent, and partially fabricated account.

### 5. Researcher Identification Effects

> "The greatest danger is not that the interviewer will appear unsympathetic to the respondent, but that he/she will become so identified with him/her that he/she drops the role of scientific observer. Interviewers must be cautioned and recautioned against retaining only the data which support the hypotheses of the research design." (Njå & Rake, p. 14, citing Killian, 2002)

The researcher is not a neutral recorder. Their presence, their framing of questions, their visible reactions to answers — all of these shape what the respondent says. And researchers who have spent years studying incident command develop empathy for commanders that can bias what they hear as much as what the commanders say.

## What This Means for Agent Systems Learning from Human Expertise

### The Training Data Problem

Every agent system that learns from documented human expert behavior — from case studies, from decision logs, from expert interviews, from after-action reports — is learning from data that has passed through the distortion filters described above. The training data does not represent what experts actually did. It represents what experts *remembered doing*, filtered through normative reconstruction, blame avoidance, and group version formation.

This has several specific implications:

**The system will learn more deliberate, more rational, more procedure-following behavior than experts actually exhibit.** Real expert performance is messier, more intuitive, more improvisational than the accounts suggest. A system trained on accounts will be miscalibrated toward over-deliberation.

**The system will systematically underlearn the failure modes.** People don't narrate their mistakes with full fidelity. The training data underrepresents errors, near-misses, and the specific conditions under which good decision-makers go wrong.

**The system will learn the *justifications* for decisions, not the *actual causes*.** Post-hoc rationalization is a real phenomenon. What experts say caused them to make a decision may be entirely post-hoc construction. The system learning from this data learns the narrative, not the mechanism.

### Mitigation: Privileging Real-Time Data

Njå and Rake are emphatic about the solution:

> "Our analysis of the two different research perspectives strengthened our belief that real-time data are necessary to understand and influence the features involved." (Njå & Rake, p. 15)

For agent systems, this means:

- **Log actual behavior, not reported behavior.** The most reliable data about how agents perform is the logs of what they actually did, not their post-hoc explanations of why.
- **Instrument for real-time observation.** Build observability into the system such that decisions can be studied as they happen, not reconstructed afterward.
- **Treat post-hoc analysis as hypothesis generation, not ground truth.** Use after-the-fact analysis to generate hypotheses about system behavior; use real-time logs to test those hypotheses.
- **Build in uncertainty acknowledgment.** Design agents to explicitly flag when they are uncertain, when they are guessing, when they are applying an analogy rather than a known pattern. Do not let them present uncertain decisions as confident ones.

### Mitigation: Structured Knowledge Elicitation

Klein's Critical Decision Method (CDM) was developed specifically to improve the reliability of retrospective expert interviews. It proceeds through four "sweeps":
1. Incident identification (establishing the timeline)
2. Timeline verification (pinning specific decisions to specific moments)
3. Deepening (probing the cognitive process behind each decision)
4. "What if" queries (exploring counterfactuals to surface implicit knowledge)

The CDM approach showed reasonable reliability in follow-up studies (56-100% correspondence between decision points identified in first and second interviews). For agent systems, the CDM structure suggests a discipline for knowledge capture:

- Don't ask "how do you solve this type of problem" (produces schemas and generalizations, not actual behavior)
- Ask about specific incidents: "What happened here? What did you notice first? What did you do next? What were you expecting?"
- Ask about the moment of decision: "At this specific point, what information did you have? What did you consider?"
- Use counterfactuals to surface implicit knowledge: "What if X had been different? What would you have done?"

### Mitigation: Distinguishing Praxis from Expertise

> "NDM research has provided useful insight into individual reasoning in crises, but the research could just as well have revealed experts' decision making based on established praxis rather than distinct expertise in crisis decision making involving great uncertainties, ill-structured goals, etc." (Njå & Rake, p. 15)

This is a crucial distinction that is easy to miss. What NDM studies often capture is not *expertise* — the ability to navigate genuinely novel, high-uncertainty situations — but *praxis* — the accumulated habits and routines of experienced practitioners in familiar situations. The two look the same in a retrospective interview. They perform very differently when the situation is genuinely novel.

For agent systems, this means: do not assume that a system trained on documented expert behavior will generalize to genuinely novel situations. It will generalize to situations that resemble documented cases. Its "expertise" is bounded by the novelty coverage of its training data.

## The Design Prescription

Build agent systems as if their knowledge base is reconstructed, not recorded. Assume:
- The system knows more about what worked in typical situations than what works in novel ones
- The system's confidence is miscalibrated upward in the tail of the distribution
- The system's failure modes are underrepresented in its training

Design accordingly: build explicit novelty detection, explicit uncertainty acknowledgment, and explicit escalation to human review when the system is operating outside the novelty envelope it was trained on.