# Failure Modes in Operational Decision Systems: What Can Go Wrong and Why

## The Failure Landscape

The Klein and Calderwood research was not primarily a failure analysis — it was an investigation of how expert decision-making works when it works well. But embedded in that investigation are important insights about failure: where the recognitional decision-making model breaks down, what conditions cause it to fail, and what systematic patterns of error emerge.

Understanding these failure modes is essential for designing agent systems that fail gracefully rather than catastrophically.

## Failure Mode 1: Inappropriate Analogues

The most explicitly named cause of errors in the research: "When analogues are used (often to address aspects of a problem that are not routine), they are critical to option selection. Thus, inappropriate analogues are a primary cause of errors." (p. vi)

An inappropriate analogue is a past case that is used to guide a current decision when the surface similarity between the cases masks important causal differences. The decision-maker recognizes surface features of the current situation as similar to a past case, activates the response from that past case, and fails to notice that the features driving the similarity are not the causally relevant ones.

The mechanism is subtle. The analogue is retrieved *because* it seems similar. But similarity is assessed on the basis of available features, which may not be the features that determine outcomes. The decision-maker has essentially asked: "What does this situation look like?" rather than "What does this situation causally behave like?" These are different questions, and the answers can diverge dangerously.

In the novice armored officer study, analogues were helpful only about half the time: "On the remaining occasions the impact of analogues was mixed, ranging from neutral to disruptive." (p. 37) Novices don't know how to assess analogue quality — they apply analogues without the causal understanding needed to determine whether they transfer.

**Agent system implication**: Any system that uses case-based reasoning must have an explicit analogue validation step. The question is not just "is this past case similar?" but "are the features driving the similarity causally relevant to the current decision?" Systems without this validation will systematically surface inappropriate analogues, especially in novel situations where no good analogues exist.

## Failure Mode 2: Stale Situation Assessments

Dynamic situations change. A situation assessment that was correct at the time it was formed may become incorrect as events develop. If the decision-maker fails to update the assessment — or if the expectancy-monitoring system fails to detect that updating is needed — the stale assessment will drive increasingly inappropriate actions.

The research emphasizes that experienced decision-makers hold "clear expectancies" (p. 10) and monitor whether those expectancies are met. The fireground commander who directs water at the assumed fire seat expects the smoke to change within 20-30 seconds. When 45 seconds pass without change, the discrepancy triggers reassessment.

This expectancy-monitoring mechanism is the key defense against stale assessments. But it can fail:
- Under high cognitive load, monitoring attention may lapse
- Under strong schema activation, disconfirming evidence may be perceptually suppressed
- In rapidly changing situations, the time between expectancy formation and verification may be too short for detection
- In slowly changing situations, drift may be gradual enough to be below detection thresholds

**Agent system implication**: Every situation assessment should generate explicit, time-bounded predictions. A monitoring process should continuously compare predicted state against actual state. When predictions are violated beyond a threshold, a reassessment should be triggered. The triggering threshold and reassessment frequency should be calibrated to domain dynamics — faster-moving situations require more frequent reassessment and lower violation thresholds.

## Failure Mode 3: Novice Application of Expert-Mode Tools

A subtle but important failure mode identified in the research: training novices with analytical decision methods that they then rely on instead of developing recognitional capabilities. "Trainees may not have a chance to develop expertise if they learn to rely on the analytical methods rather than developing their own recognitional capabilities." (p. 20)

Decision analysis tools and concurrent evaluation frameworks are easy to learn in a way that recognitional skills are not. They provide explicit procedures, clear outputs, and an appearance of systematic rigor. Novices can learn to apply them correctly without understanding the domain. But if novices use these tools instead of developing domain expertise, they remain novices indefinitely — they develop analytical competence rather than recognitional competence.

The problem is that analytical competence degrades catastrophically under time pressure, while recognitional competence degrades gracefully. A decision-maker who has learned to use MAUA instead of developing situational expertise will be competent in low-pressure conditions and incompetent in high-pressure ones — exactly inverted from what operational settings require.

**Agent system implication**: Agent training should build recognitional capabilities, not just evaluation procedures. An agent that has learned to score options against criteria, without developing the pattern-matching and causal-inference capabilities that underlie situation assessment, is a novice-mode agent regardless of how sophisticated its scoring machinery is. Evaluation procedures should complement recognitional capabilities, not substitute for them.

## Failure Mode 4: Forcing Concurrent Evaluation on Expert Systems

The research explicitly warns that prescribing analytical/concurrent evaluation methods to expert decision-makers impairs their performance. This is not a theoretical concern — it follows directly from the architecture of expert cognition. Expert decision-makers have invested cognitive resources in developing recognitional capabilities; those capabilities are their actual competence. Forcing them to use analytical methods prevents them from employing their recognitional capabilities.

"The greater concern is that they will be unable to make effective use of their own expertise. The Decision Analysis and MAUA approaches may not leave much room for the recognitional skills of experienced personnel. Therefore the risk of using these approaches is that decision performance will become worse, not better." (p. 20)

**Agent system implication**: In multi-agent orchestration, the orchestrator should not impose uniform decision procedures on all agents. An agent with high domain expertise should be allowed to operate in recognition mode — stating its recommended action and moving forward, without being required to generate a comparative analysis. Requiring expert-mode agents to justify their choices through concurrent evaluation wastes their capabilities and slows the system.

## Failure Mode 5: Prototype Mismatch Without Detection

The recognitional model works by matching the current situation to a known prototype and activating the associated response. But what happens when the current situation matches a prototype on surface features while differing from it on causally important features?

This is prototype mismatch — and it is particularly dangerous because the decision-maker may be highly confident (the prototype match feels strong) while the situation actually calls for a different response. The confidence generated by recognition is calibrated to within-category variation; it does not protect against between-category errors.

The research does not explore this failure mode in depth, but its implications follow from the model. Expert decision-makers are best protected against prototype mismatch by their expectancy monitoring — if the situation is misclassified, the expectancies generated by the wrong prototype will typically be violated by subsequent events, triggering reassessment. But this protection depends on:
1. The decision-maker forming explicit expectancies (not just acting on recognition without forming predictions)
2. The decision-maker monitoring whether those expectancies are met
3. The time available for feedback before the decision consequences become irreversible

When situations are fast-moving, consequences are immediate, and expectancies are poorly formed, prototype mismatch can proceed to catastrophic failure before reassessment is triggered.

**Agent system implication**: Situation classification should be accompanied by a confidence score and a set of distinguishing features — the features that most strongly support the current classification and the features that, if different, would change the classification. A high-confidence classification with weak distinguishing features (matches on many surface features, few deep ones) should be flagged as higher-risk than a classification with strong distinguishing features. Additionally, expectancy formation should be mandatory, not optional — every classification should produce testable predictions.

## Failure Mode 6: Information Overload and Attentional Capture

In complex operational environments, there is far more information available than any decision-maker can process. The RPD model handles this through prioritized attention — the situation assessment itself determines which cues are worth attending to. But this mechanism can break down:

- In genuinely novel situations, the situation assessment may not be formed confidently enough to prioritize attention
- Salient but less important information can capture attention before situation assessment is complete
- High time pressure can prevent the attention prioritization that situation assessment provides
- Information from multiple sources may conflict, preventing confident classification

The research notes that proficient decision-makers "do not feel this overload" (p. 9) — but this is because expertise provides the filtering. Remove the expertise (or put the expert in a domain where their pattern libraries don't apply) and overload returns.

**Agent system implication**: Attention allocation should be treated as a first-class problem in agent systems, not a pre-processing step before "real" cognition. The question "which of these inputs most needs my attention right now?" is itself a decision that requires situational knowledge. Systems should be designed with explicit attention-prioritization mechanisms that are informed by the current situation assessment, and those mechanisms should gracefully degrade when situation assessment is uncertain.

## Failure Mode 7: Coordination Failures in Distributed Decision-Making

The wildland fire study (Study 2) examined distributed decision-making — multiple commanders coordinating across a large, complex situation. An important finding: failures at the coordination level were different in character from failures at the individual decision level.

Individual decisions by experienced commanders tended to be recognitional and effective. Coordination problems arose primarily around organizational issues and interpersonal negotiations — exactly the domains where even expert decision-makers shifted to concurrent evaluation strategies. These transitions from recognitional to analytical mode were cognitively expensive and created coordination overhead.

The study also found that many anticipated coordination failures did not occur: "There was little problem with information overload. Communication channels were limited but were used effectively. There was open communication about differences in the way situations were perceived and goals were formulated, but these were controlled so as to maintain team cooperation and morale." (p. 34-35)

The key enabling factor seems to have been shared situation assessment — commanders maintained a common operating picture that allowed effective coordination without requiring central control of individual decisions.

**Agent system implication**: In multi-agent systems, the coordination overhead is highest when agents have different situation assessments. Investing in shared situation assessment — ensuring that agents have compatible understandings of what is happening and what the goal is — reduces coordination costs more than any other single intervention. Coordination mechanisms designed for agents with divergent situation assessments (negotiation, arbitration, voting) are expensive and slow; mechanisms designed for agents with shared situation assessments (task assignment, specialization, role-based division) are cheap and fast.

## The Meta-Failure: Applying Inappropriate Models

Perhaps the deepest failure mode identified in the research is applying analytical prescriptions to expert practitioners who are already using better strategies. This is meta-failure — not failure within a decision process but failure of the framework used to design and evaluate decision processes.

The prescriptive tradition (Janis and Mann's seven criteria for high-quality decisions, Decision Analysis, MAUA) fails not because it is wrong but because it is applied to the wrong population. These methods may genuinely improve the decisions of novices who lack recognitional capabilities. They actively harm the decisions of experts who have developed those capabilities.

"The potential significance of this work is enormous. If it is possible to develop general methods to improve decision making, then these methods could be trained and they could be embedded within decision aids to provide a large improvement in decision quality. Unfortunately, the payoffs have yet to be seen." (p. 18-19)

**Agent system implication**: Decision support mechanisms should be calibrated to the decision-maker's expertise level, not applied uniformly. An agent operating in a domain where it has high expertise should receive different support from an agent operating in an unfamiliar domain. The appropriate question for system designers is not "what is the best decision procedure?" but "what decision procedure is best for an agent with this level of expertise, in this domain, under these conditions?"