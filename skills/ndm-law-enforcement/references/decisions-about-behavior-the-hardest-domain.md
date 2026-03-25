# Decisions About Behavior: The Hardest Prediction Problem in Expert Decision-Making

## The Domain That Breaks Expert Systems

James Shanteau (1992) made a distinction that cuts to the heart of a fundamental limitation in expert decision-making systems. He compared the performance of experts who make "decisions about things" versus experts who make "decisions about behavior."

Experts who make decisions about things:
- Weather forecasters
- Test pilots
- Chess masters
- Livestock judges

Experts who make decisions about behavior:
- Clinical psychologists
- Court judges
- Parole officers
- Stock market analysts

The finding was stark: **experts who make decisions about things tend to perform well. Experts who make decisions about behavior often exhibit poor performance** — frequently no better than base rates, and sometimes worse.

Shanteau's conclusion: the difference is not about the intelligence of the decision-makers or the amount of their training. It is about the *task characteristics* of the domain. "If the tasks were dynamic, unique, unpredictable, and decision aids and feedback were unavailable, then decision performance was poor" (Zimmerman, p. 23).

Human behavior is all of these things. Weather follows physical laws with measurable states. Human decision-making follows social, psychological, cultural, and situational pressures that interact in ways that resist systematic modeling.

## Why Human Behavior Prediction Is Categorically Harder

"The ability to assess and predict human behavior is vastly more complex than predicting the behavior of non-human entities. Humans interact socially and interpret intentions and actions based on their own previous experiences, their emotions before and during the event, their mental state, personality traits, and previous knowledge or misinformation" (p. 22).

This is not just a quantitative complexity claim — it is a qualitative difference:

**Non-human entities have fixed state spaces.** An aircraft's mechanical state is continuous but bounded — there are only so many ways an aircraft can behave given its physical construction and the laws of physics. A human being's behavioral state space is open-ended: any person can do almost anything at any moment, and the distribution of likely behaviors is conditioned on factors that are largely unobservable (emotional state, cognitive state, belief state, motivation state).

**Non-human entities don't model the decision-maker.** An aircraft doesn't change its behavior based on what the pilot is doing. A human subject in a police scenario does. The person being assessed is actively forming models of the officer and adapting their behavior in response. This creates a recursive modeling problem: the subject's behavior depends on the subject's model of the officer, which depends on the officer's actions, which depend on the officer's model of the subject. This mutual modeling creates adaptive adversarial dynamics that simple expert systems cannot represent.

**Human behavior is context-specific in ways that resist generalization.** A pattern of behavior that reliably indicates threat in one cultural context may indicate deference in another. Nervousness that indicates guilt in one socioeconomic setting may indicate prior negative police encounters in another. Mental models built on a particular population may perform poorly when applied to different populations.

## The Specific Case: Police Decisions About Human Behavior

Police officers in this study were making decisions about what a person they'd never met was likely to do in the next thirty seconds — based on incomplete verbal exchanges, limited visual access (Simunition gear reduced nonverbal information), cultural and psychological factors they might not be aware of, and prior experiences that the subject brought that the officer couldn't observe.

The expert-novice difference appeared here too, but with a distinctive character:

**Novices** tended to apply categorical rules: "person has prior prison record = dangerous." They treated behavioral cues as binary switches rather than probabilistic indicators.

**Experts** maintained richer probabilistic models that conditioned assessments on multiple interacting factors. An experienced officer who heard "I just got out of prison" didn't just flag "dangerous" — they thought: "He knows the system. If he's still resisting, knowing I have a weapon pointed at him, he's either desperate or past caring about consequences. This is more dangerous than typical non-compliance."

The difference is that experts maintain conditional probability models (explicitly or implicitly) — their assessment of one cue changes as a function of the values of other cues. Novices apply cues independently.

## The Novel Finding: Influencing the Cognitive Environment

This research identified a finding specific to police decision-making that distinguishes it from most other NDM domains: **experienced officers don't just respond to human behavior — they actively attempt to change it by manipulating the subject's cognitive and emotional state**.

"Instead of only using tactics to alter the physical environment, some participants attempted to manipulate the cognitive environment in order to achieve their goals" (p. 71-72).

Examples from experienced officers:
- "I just caught 'family' very briefly and I thought obviously his family means something to him so that's what I'm going to go after... I drop my voice way down and started asking about his family."
- "Why feed his fear. 'Hey, come downstairs, you can use my phone, we'll call whoever you want.' And asking his kids names, because just thinking of his kids... I wanted him to snap him out of it, try to get him to think rational."
- Making the subject "feel like he was helping me" rather than being confronted, to reduce resistance.

This is a qualitatively different cognitive capability from pure assessment: the officer is running a model not just of what the subject will do, but of *what the subject will do if the officer does X*. They are doing counterfactual behavioral simulation — "if I talk about his family, will his emotional state change in the direction of de-escalation?"

This requires:
1. A theory of mind about the subject (what does this person care about?)
2. A model of how emotional states change in response to conversation (how does talking about family change his current state?)
3. A forward simulation of the resulting behavior change (if his emotional state changes this way, what does he do?)
4. An action selection based on that simulation (what should I say to achieve that?)

Expert officers were doing all of this in real time, fluidly, without conscious enumeration of these steps.

## Why Feedback Is Critical (And Often Absent)

Shanteau identified feedback as one of the key task characteristics that distinguishes domains where experts perform well from those where they don't. Where feedback is available, calibrated, and timely, experts can develop genuine expertise. Where feedback is absent, delayed, ambiguous, or unrepresentative, experts develop overconfident but uncalibrated models.

"Feedback is said to be an essential component of efficient decision making and necessary for the development of expertise in a given domain" (p. 28, citing Klein, 1998 and Shanteau, 1992).

In police work, feedback is systematically distorted:
- Officers rarely know the full outcomes of their encounters (what happened to the subject after the encounter?)
- Successful de-escalations are invisible — nothing happened
- The base rate of dangerous encounters is low, making calibration against base rates difficult
- Confirmation bias operates: officers remember the cases where their threat assessment was confirmed, not where it was wrong

This is the structural problem that makes expertise development in behavioral domains harder than in physical domains, and it is precisely why structured training with feedback (like Simunition scenarios + CDM interviews + CIDS training) has potential that natural field experience alone cannot achieve.

## Agent System Implications

**1. Behavioral prediction requires explicit uncertainty representation.** An agent making decisions about human behavior should represent its uncertainty explicitly rather than collapsing to a point prediction. "This person is probably hostile" is less useful than "based on observed cues, probability of immediate aggression is ~40%, probability of compliance is ~35%, probability of suicidal gesture is ~25%."

**2. Mutual modeling creates recursive complexity.** When the entity being assessed can model the agent and adapt, the agent needs a theory of mind about the entity. Simple feature-based classification is insufficient for adversarial or adaptive human behavior.

**3. Cognitive environment manipulation is a legitimate skill.** The finding that expert officers actively manipulate the subject's cognitive state translates to agent systems that interact with humans: there may be value in modeling not just what a human user is doing but how to influence what they'll do next, in service of a beneficial outcome.

**4. Feedback calibration is a design responsibility.** In behavioral domains, natural feedback is often distorted or absent. Agent systems that make behavioral predictions should have explicit mechanisms for calibration feedback — and should actively seek it rather than passively receiving it.

**5. Human behavior prediction deserves special epistemic humility.** The Shanteau finding is a design constraint: systems making behavioral predictions should be held to different standards than systems making physical predictions. Overconfidence in behavioral models is not just an accuracy problem — it can cause direct harm.