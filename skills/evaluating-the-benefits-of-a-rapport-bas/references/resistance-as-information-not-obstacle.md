# Resistance as Information: How Intelligent Systems Should Process Uncooperative Counterparts

## The Default Misreading of Resistance

When an interviewer, an agent, or any intelligent system encounters resistance from a counterpart — refusal, minimal response, redirection, or active evasion — the default interpretation is that resistance is an *obstacle*: something that prevents the system from getting what it needs and must therefore be overcome, bypassed, or suppressed.

This interpretation is wrong in a way that is both empirically demonstrable and systematically harmful.

The Brimbal et al. (2021) study's scenario design is instructive here. Interviewees were given a genuine motivational conflict: they had an incentive to disclose (securing a deal) and an incentive not to disclose (risk of being viewed as an accessory). They were explicitly told the interviewer might not uphold the deal. This created *genuine resistance* — not stubbornness or stupidity, but rational information management under uncertainty. "On average, our participants (N = 125) were reluctant to provide information (M = 12.26, SD = 6.22, from a total of 35 potential details). Furthermore, interviewees were above the midpoint when reporting their motivation to balance what information to reveal and not to reveal (M = 4.82, SD = 1.79)" (p. 61).

The resistance was rational. It communicated something true about the interviewee's situation: they were uncertain about the interviewer's trustworthiness, uncertain about the consequences of disclosure, and actively managing both risks simultaneously. An interviewer who reads this resistance as mere obstruction to be overcome misses all of that diagnostic information.

## What Resistance Actually Signals

Resistance in an information-management context signals one or more of the following:

**1. Unresolved uncertainty about the cost of disclosure**
The counterpart doesn't know what will happen if they provide the information. They are protecting against worst-case outcomes. This is risk management, not hostility.

**2. Insufficient perceived rapport**
The counterpart doesn't trust the actor sufficiently to believe disclosure will be safe or beneficial. The rapport-cooperation pathway (described in the Rapport as Causal Mechanism reference document) is blocked at the rapport stage.

**3. Competing motivations**
The counterpart has a genuine reason not to disclose that exists independently of the actor's behavior. Rapport can mitigate this but cannot eliminate it — some resistance is irreducible given the counterpart's actual situation.

**4. Uncertainty about what the actor wants**
The counterpart may not understand what information is being sought, leading to conservative, minimal responses that err on the side of not disclosing something that wasn't wanted anyway. This is ambiguity-driven resistance, and it is resolved by clearer query structure (Layer 1 productive questioning), not by rapport building.

**5. Structural constraints the counterpart cannot name**
The counterpart may face constraints — organizational, legal, technical, relational — that prevent disclosure but that the counterpart cannot or will not explicitly name. Resistance in this case is not dishonesty; it is the surface manifestation of an invisible structural constraint.

Each of these resistance types calls for a different response. Treating them all as "obstacles to overcome" is the equivalent of treating all error messages in a software system as instances of the same bug. The diagnostic step — figuring out *which* type of resistance is occurring — must precede the response.

## The Paper's Approach to Resistance Diagnosis

The training in Brimbal et al. explicitly included "a framework with which to understand and manage a subject's resistance" (p. 59). Investigators were trained to recognize resistance, assess its nature, and deploy appropriate tactics accordingly — relational rapport-building tactics specifically "aimed at enhancing cooperation and eliciting information" from resistant subjects (p. 59).

The conversational rapport layer specifically includes evocation — "drawing-out an individual's emotions and motivations during the interview, paving the way for acceptance and demonstrations of empathy" (p. 57). Evocation is the diagnostic tool for resistance: it surfaces *why* the counterpart is resistant, which then determines which response is appropriate.

The specific sequence the training implies:

1. **Detect resistance**: Recognize that minimal responses, deflections, or refusals are occurring
2. **Evoke**: Surface the counterpart's perspective on why resistance is occurring ("It seems like there's something making you uncertain about sharing this — can you tell me what's holding you back?")
3. **Accept**: Receive the counterpart's expressed concern without judgment or pressure
4. **Address**: Deploy the appropriate tactic based on what the evocation revealed (trust-building if the issue is trustworthiness, autonomy support if the issue is perceived control, similarity highlighting if the issue is perceived adversarial relationship)

Critically, the paper notes that investigators — even after training — "overwhelmingly indicated that they wanted to know more about resistance (41.7%), even though rapport and trust building tactics were aimed at overcoming resistance" (p. 61). This reflects the deep intuition that resistance requires special tools, even when the general approach (rapport-based tactics) is the correct tool. The desire for a separate "resistance module" is itself a product of the old accusatorial framing, in which resistant subjects require fundamentally different treatment than cooperative ones.

The insight from the evidence-based approach is precisely the opposite: resistance is not a special case requiring special coercive tools — it is a signal requiring more careful application of the same information-gathering tools, with additional attention to the relational layer.

## The Information Value of Resistance

There is an even deeper point here that the paper doesn't fully articulate but that the experimental design implies: what the counterpart *doesn't* disclose, and the *manner* in which they don't disclose it, is itself valuable information.

In the study scenario, interviewees were managing which of 35 facts to reveal. Their decisions about what to disclose and what to withhold were not random — they were driven by their risk assessment of what disclosure would cost. A sophisticated interviewer watching resistance patterns could potentially infer something about what the interviewee was most strongly protecting, which would identify the high-value information targets.

This is the intelligence value of resistance patterns. They are not just noise interfering with signal — they are signal about signal location.

**Agent System Translation:**

When a sub-agent, API, or external system refuses a request, returns an error, or provides minimal output:
- The *fact* of resistance is information about the boundary of the system's capabilities or permissions
- The *type* of resistance (error type, refusal framing, minimal response pattern) is information about *why* the boundary exists
- The *specificity* of resistance (resists narrow queries but answers broad ones, or vice versa) is information about where within the system the constraint originates

A sophisticated agent system treats every resistance response as a diagnostic data point to be analyzed, not an obstacle to be bypassed. The analysis should follow the evocation sequence: name what is happening, surface what the resistance is signaling, identify which type of resistance is occurring, and select the appropriate response accordingly.

For example:
- **API rate-limit error**: Resistance type = structural constraint, not motivational. Response: back off and re-queue, or query the API documentation for the actual rate limit. Rapport-building is irrelevant here.
- **Human user providing minimal responses to detailed queries**: Resistance type = possibly ambiguity-driven (user doesn't understand what's being asked), possibly rapport deficit (user doesn't trust the agent's purpose), possibly competing motivation (user is protecting information they think is sensitive). Response: diagnose first — ask what makes the query unclear, or surface the apparent concern explicitly.
- **Sub-agent returning off-topic outputs**: Resistance type = possibly misunderstood task (query clarity issue), possibly capability boundary (the agent cannot do what's being asked and is substituting something it can do). Response: reflect the output back and ask for clarification about what the agent understood the task to be.

## The "Toolbox" Problem

The paper warns against what it calls a "toolbox" approach to investigative interviewing, citing Snook et al. (2020): "the selective adoption of evidence-based practices often associated with a 'toolbox' approach" (p. 58). A toolbox approach treats resistance-management tactics as optional additions to an otherwise unchanged practice — practitioners add whichever tools seem useful and leave their existing approach intact.

This is insufficient. The entire approach must shift — not just the tools. Rapport-based interviewing is not accusatorial interviewing plus some rapport tactics. It is a fundamentally different orientation toward the counterpart and toward the goal of the interaction.

**Agent System Translation of the Toolbox Problem:**

An agent system that implements productive questioning by adding open-ended query formatting to an otherwise output-forcing architecture has made a superficial change. It has the form of the correct approach without the substance. The substance is the underlying orientation:

- Is the goal to confirm an expected output, or to discover the actual state of the world?
- When resistance is encountered, does the system move toward understanding or toward forcing?
- Are unexpected outputs treated as errors or as information?

These are architectural and orientation questions, not tool-selection questions. The toolbox problem in agent design is adding open-ended query templates to an agent that otherwise treats all counterpart outputs as either "correct" (matches expected) or "incorrect" (doesn't match expected). The tool is present; the orientation is unchanged; the failure mode persists.

## Irreducible Resistance: When Rapport Is Not Enough

A critical honest assessment: not all resistance can be overcome by rapport. The paper acknowledges that "contextual factors that are independent of an interviewer's tactics can influence the reporting of information by interview subjects" (p. 63). The structural equation model explained only 17% of variance in cooperation and 9% in disclosure — substantial unexplained variance remains.

Some counterparts in the study presumably remained resistant despite well-executed rapport-building, because their motivational structure, risk assessment, or structural constraints were too strong for rapport to overcome in a 20-minute interaction.

For agent systems, the analogous cases are:
- Systems with hard technical constraints that are genuinely unable to provide the requested information
- Counterparts with competing goals that are strong enough to outweigh any rapport benefit
- Situations where the structural relationship (authority, competition, fundamental conflict of interest) makes cooperative rapport implausible

In these cases, the appropriate response is to recognize that rapport cannot resolve the constraint and shift to alternative information sources or task reformulation. Persistence in rapport-building when a hard constraint is present is not evidence-based — it is the inverse of the coercive persistence it was designed to replace.

The diagnostic question: is this resistance *motivational* (capable of being changed by rapport tactics) or *structural* (not capable of being changed by relationship dynamics alone)? The answer determines whether the rapport pathway is the right tool.