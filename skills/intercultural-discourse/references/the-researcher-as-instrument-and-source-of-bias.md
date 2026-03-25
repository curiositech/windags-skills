# The Researcher as Instrument: Self-Awareness and the Production of Bias

## The Researcher Cannot Be Factored Out

A recurring theme in Adamson's thesis is the impossibility of eliminating the researcher's influence on the data. Unlike laboratory experiments where the experimenter can be separated from the experimental apparatus, interview-based research places the researcher as a central participant in the interaction being studied. Every decision the researcher makes — about seating, about when to use prompts, about when to provide evaluative versus acknowledging feedback, about how to rephrase questions — shapes the data being collected.

This is not a problem to be solved. It is a condition to be acknowledged and managed.

Adamson is unusually candid about the specific ways his own choices introduced bias — not in the abstract theoretical sense, but in concrete, operational terms.

## Specific Researcher Biases Documented

**Seating arrangement bias:**
Adamson initially arranged the interview seating at a 90-degree angle to avoid the formal barrier of a desk. He reverted to face-across-desk seating for practical reasons (managing the tape recorder and notes). He notes this may have reversed his intention to create an informal context.

**Telephone interruption bias:**
His office received calls during interviews, disrupting the flow. This was not randomly distributed — it affected early interviews more than later ones, as he took steps to reduce it. This means early interviewees experienced a systematically different interview context.

**Interview timing bias:**
Some interviews were conducted in late afternoon when students were less energetic than in morning interviews.

**Progressive skill acquisition bias:**
His own interviewing technique improved across interviews. Early interviewees received a less skilled version of the interview; later interviewees received a more skilled version. He refers to this as creating "contextual bias" while accepting it as inevitable:

> "My reaction to these thoughts was that the interviews were based upon semi-structured topics which had an element of leeway to them... I regarded the contextual features as well as my interviewing technique as areas to continually seek improvement. The acquisition of student input concerning learning strategies was the primary focus, not the standardisation of interviewing technique and context." (p. 90)

**Study Skills contamination:**
The first five students were interviewed in July, before much pre-sessional input. The next five could only be interviewed in August, after students had received Study Skills sessions that may have altered their awareness of learning strategies. This was unavoidable given the schedule, but introduced systematic differences between the two groups.

**Feedback inconsistency bias:**
The interviewer consciously decided to avoid evaluative feedback that might replicate classroom dynamics. He then subconsciously provided it anyway — particularly for responses he personally agreed with:

> "The fear that Nassaji and Wells express of eventual suppression of extended responses if classroom-like turn-taking is replicated is not substantiated in my interview data. In fact, looking at Sangdaew's interview shows that her responses were actually extended from 'i' to 'com' acts even after endorsing feedback was given. With this unexpected extension of responses in mind, there may have been a subconscious reversal of my policy to avoid endorsing feedback in subsequent interviews." (p. 153)

This is a particularly important finding: **a conscious decision to avoid a behavior was subconsciously reversed based on positive reinforcement**. The decision lost to the incentive. This is a lesson not just about interview methodology but about any system where human agents try to override their own trained responses.

## The Status Problem That Cannot Be Eliminated

The most fundamental source of researcher bias is structural rather than behavioral: Adamson was both the interviewer *and* the students' teacher. This relationship cannot be neutralized by procedural modifications.

> "I attempted to approach students outside the classroom, usually at break and lunch time intervals... My intention was not to give the students the impression that these interviews were in any sense obligatory or part of the college's official policy." (p. 86)

No student refused his request for an interview. This is consistent with multiple explanations — genuine willingness, polite compliance, difficulty refusing a teacher — and probably involves all three. The "no refusals" result is not evidence of optimal design; it is evidence of power differential.

The consent form included his job title ("Head of Academic Studies"). His own retrospective assessment: "my first impression may have been that I was surely making an approach in an official capacity."

He acknowledges the permanent inadequacy of his efforts:

> "In retrospect, my efforts to lower my status profile and de-institutionalise the image of the research may not have been entirely successful." (p. 102)

This is honest and important. The insight is not that the researcher failed but that certain sources of bias are structural and irreducible. Acknowledging this limits the claims that can be made from the data.

## Self-Awareness as a Research Tool

Rather than pretending bias doesn't exist, Adamson incorporates his own limitations as a form of data:

- His field notes capture not just interviewee behavior but his own real-time interpretive decisions
- His description of progressive skill improvement across interviews contextualizes the variation observed
- His candid acknowledgment of the subconscious feedback reversal is itself evidence about how conscious decisions can be overridden
- His recognition of the structural impossibility of eliminating status bias limits the interpretive claims he makes

This represents a sophisticated epistemological stance: **the researcher is not a neutral instrument but a situated participant whose situatedness must be accounted for in the analysis**.

> "This 'double focus' requires the researcher to carry forward the contextual information about the participants and interview as a speech event to the present research in order to help better interpret the data." (p. 6)

## The Institutional Context as Invisible Bias

Beyond individual researcher behavior, Adamson identifies the institutional context itself as a source of systematic bias. The college where the research was conducted was a setting where teacher authority was culturally reinforced at multiple levels — Thai cultural norms, Buddhist educational influences, and the formal asymmetry of the teacher-student relationship all converged.

Approaching students for interview in this setting was not just asking for research participation. It was a request from someone embedded in a web of institutional authority. The research was institutionally located even when it tried not to be.

> "Buripakdi and Mahakhan note that any evaluation of the Thai educational system 'can only be made in relation to the larger system' as it is 'a sub-system of the country to which it belongs.'" (p. 65)

This applies equally to the research: it cannot be evaluated apart from the institutional system in which it was embedded.

## Application to Agent Systems

**Principle 1: The agent is not a neutral instrument.** Every AI agent embeds assumptions, training biases, evaluation criteria, and interaction styles that shape the data it collects and the conclusions it reaches. These are not bugs to be eliminated but conditions to be acknowledged and managed.

**Principle 2: Progressive adaptation introduces systematic variation.** When an agent system improves its behavior over time — through fine-tuning, prompt refinement, or architectural changes — earlier interactions will be systematically different from later ones. This variation must be tracked and accounted for in any cross-time analysis.

**Principle 3: Power differentials cannot be eliminated by procedural design.** When users interact with agent systems that have evaluative authority (grading, credentialing, access control), no amount of friendly design language will neutralize the power differential. The interaction will be shaped by users' awareness of the agent's authority.

**Principle 4: Conscious decisions can be subverted by implicit incentives.** An agent designed to exhibit a specific behavior (e.g., non-evaluative responses) may be trained in ways that subvert this design when confronted with certain inputs (e.g., user inputs the agent internally classifies as "good"). Alignment between stated design intent and actual trained behavior requires explicit audit.

**Principle 5: The training context shapes all downstream outputs.** An agent trained on data from one institutional, cultural, or linguistic context will embed that context's assumptions. Deployment in a different context requires active debiasing or contextual calibration — not just surface adaptation.

**Principle 6: Self-awareness of limitations is a productive output, not a confession of failure.** Agents that can flag their own uncertainty, their likely bias sources, and the limits of their analytical tools are more trustworthy than agents that produce confident outputs without epistemic humility. Build mechanisms for agents to report their own situatedness alongside their conclusions.

## Boundary Conditions

These concerns are most acute when:
- The researcher/agent holds evaluative authority over those being studied
- The institutional context reinforces power differentials
- The data being collected is sensitive (personal, political, or face-threatening)
- The same entity collects data and analyzes it across an extended period during which its capabilities change

They are less acute when:
- Participants have genuine power to decline, exit, or contest without cost
- The institutional context is authority-neutral
- Data collection is distributed across many independent agents with no common authority relationship to participants