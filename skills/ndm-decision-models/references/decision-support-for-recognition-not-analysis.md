# Designing Decision Support for Recognition-Based Agents

## The Wrong Kind of Help

Decision support systems are almost universally designed to facilitate analytical decision-making: they structure option generation, compute utilities, present probability estimates, display decision trees, and recommend options based on formal criteria.

Klein and Calderwood demonstrate that this design orientation is exactly backward for the domains where decision support is most urgently needed. The proficient decision-makers who most need support — fireground commanders managing dynamic emergencies, military commanders running complex operations, medical teams managing crisis patients — are doing recognitional decision-making, not analytical decision-making. Decision support designed to facilitate analysis does not help them. In some cases, it actively interferes.

"A recognitional model would focus attention on the ways situations are understood, and could therefore offer a different perspective on expert/novice decision making."

The prescription is to design decision support that enhances *situation assessment* and *mental simulation* — the actual cognitive work of expert decision-making — rather than option generation and utility computation.

## What Recognition-Support Actually Looks Like

### 1. Analogue Displays Over Digital Data

Klein and Calderwood recommend "analogue displays, such as maps and graphics, rather than alphanumeric data, on the assumption that the patterns presented in analogue displays would facilitate perceptual matching."

The reasoning is grounded in the RPD model: recognition is pattern-matching. Pattern-matching works on perceptual wholes, not on parsed data streams. An expert recognizes a tactical situation from the shape of a position on a map; they do not recognize it from a table of unit coordinates. A fireground commander recognizes the meaning of smoke color, density, and behavior as an integrated percept; they do not recognize it from a numerical reading.

Decision support that presents information in analogue, integrated, pattern-legible formats accelerates the recognition process. Decision support that presents information as decomposed data requires the decision-maker to mentally reconstruct the pattern — adding cognitive load and time to the most time-sensitive step.

**For agent systems**: This principle generalizes to any representation that an agent uses as input for situation classification. Representations that preserve the integrative, contextual structure of situations will support better pattern-matching than those that decompose situations into independent features. Feature engineering for recognitional agents should aim for representations that capture *gestalt* properties, not just component values.

### 2. Case-Based Retrieval Over Analytical Databases

"Prior cases could be stored in an analogy bank so that they could be retrieved individually, or there could be a means of retrieving and synthesizing several cases at once, to allow prototype matching. The identification of one or several prior cases would allow the recognition of goals that were plausible, reactions that were typical, critical cues to monitor, and expectancies to monitor."

This is a specific architectural recommendation: decision support should be case-indexed, not criteria-indexed. The agent should be able to query its knowledge base by situational similarity ("find me cases that look like this current situation") rather than by formal criteria ("find me options that score above threshold on these dimensions").

Case retrieval by situational similarity returns:
- What goals were applicable in similar past cases
- What actions were taken and what happened
- What cues were important to monitor
- What expectations should be set
- What failure modes were encountered

This is exactly the information an expert decision-maker needs to either confirm their current situation assessment or identify where it might be wrong.

**For agent systems**: This recommends a specific database architecture — case libraries indexed by situational features, with retrieval mechanisms that support similarity search rather than exact match. The case record should include full situation context, not just outcomes. Retrieval should return not just the single most similar case but a cluster of similar cases from which prototype patterns can be abstracted.

### 3. Expectation Flagging Over Option Recommendation

"Decision support systems could facilitate performance by flagging mismatches or by prompting the decision maker about potentially relevant cases that were not retrieved."

This is one of the most distinctive design recommendations in the paper. Rather than recommending actions, decision support should flag *anomalies* — places where the current situation diverges from what the active situation classification predicts.

The logic: if the agent's situation assessment is correct, no support is needed for action selection — recognition will handle it. The critical failure mode is situation misassessment. Decision support is most valuable when it catches misassessment early — before action is taken on a wrong model.

Misassessment is detectable through expectancy violation: if the agent classified this as Situation Type A, it should be seeing cues C1, C2, C3 and the trajectory should be moving toward T1. If instead cue C4 appears (not predicted by A), or the trajectory is moving toward T2 (inconsistent with A), the situation classification may be wrong.

Decision support that monitors for these violations and flags them for attention is providing exactly the right help — not substituting for expert judgment but protecting against the specific failure mode that judgment is most vulnerable to.

**For agent systems**: Build situation monitoring as a first-class component. After a situation is classified and action is taken, the monitoring system should continuously check whether observed developments match the predictions of the active classification. Significant deviations trigger a reassessment alert. This is the highest-value decision support an agent system can provide.

### 4. Training Focused on Situation Differentiation

"Turning to training, the emphasis would include sensitivity to critical factors distinguishing one prototype from another, effective use of expectancies to evaluate whether the situation has been understood correctly, and ability to anticipate the important contingencies in implementing a course of action."

Training for recognitional decision-making is qualitatively different from training for analytical decision-making. The authors recommend focusing on:

- **Discrimination**: Training cases that require distinguishing between superficially similar situation types with importantly different appropriate responses
- **Expectancy use**: Training the habit of generating predictions from situation classifications and attending to whether those predictions are confirmed
- **Contingency anticipation**: Training mental simulation skills — the ability to play out the likely trajectory of an action before committing to it

"Training programs could address the development, verification, and modification of situational understanding, rather than teaching systematic procedures for generating and evaluating alternative options."

**For agent systems**: Agent training regimes should include deliberate discrimination challenges — cases where the correct classification is non-obvious and where incorrect classification leads to meaningfully different outcomes. These cases are harder to construct and curate but are more valuable for developing robust pattern recognition than the prototype cases that are typically easiest to source.

### 5. Metacognitive Support: Noticing When You're Lost

Means et al., cited by Klein and Calderwood, found that "one area where decision training appears to be effective is metacognition, teaching the decision maker to notice cues signaling information overload, confusion, and so on, and teaching procedures to better manage the decision-making task."

This is the recognitional equivalent of calibration: learning to recognize when your recognition is failing. Specific metacognitive signals include:
- Difficulty classifying the situation (no prototype feels right)
- Unusual inconsistency among observed cues
- Rapidly shifting situation classifications (unstable assessment)
- Absence of expected cues (something that should be visible isn't)
- Presence of highly anomalous cues (something appears that fits no known situation type)

**For agent systems**: Build explicit monitoring for these metacognitive signals. An agent that can detect "I am in an uncertain situation where my pattern recognition is unreliable" and shift to deliberative processing — or flag for human oversight — is far more reliable than one that continues with confident recognitional processing in genuinely novel territory.

## The Interface Between Human and Agent Decision Support

Klein and Calderwood's recommendations, while directed at human decision-makers, translate directly to the interface design challenge for hybrid human-agent systems.

When a human works with an agent on complex decisions:
- The agent should present situation assessments in pattern-readable formats, not data dumps
- The agent should surface relevant past cases, not just current recommendations
- The agent should flag anomalies against the active situation model, not just recommend options
- The agent should support the human's mental simulation by answering "what happens if we do X?" rather than "the best option is Y"

The goal is to support the human's recognitional processing, not to replace it with the agent's analytical processing. The division of labor: the human provides pattern recognition capacity and domain expertise; the agent provides case retrieval, anomaly detection, and simulation support.

## The Danger of Well-Designed Wrong-Direction Support

Klein and Calderwood's most serious warning is that forcing people to use analytical tools in recognitional domains does not just fail to help — it actively degrades performance by interrupting the natural cognition of expert practitioners.

The same risk applies in agent system design. A well-implemented analytical decision support system, grafted onto a recognitional decision process, will:
- Slow down the decision process at the points where speed is most critical
- Force the decision into explicit option comparison that strips context
- Create artificial precision in probability estimates that don't exist
- Undermine the decision-maker's confidence in their own pattern-based judgment
- Produce outputs that look rigorous but are unreliable because the assumptions don't hold

"By trying to force experienced decision makers to adjust to the needs of the prescriptive models we run the risk of degrading their ability to make use of their own experience. We can interfere with their proficiency."

The principle for agent system design: know what kind of decision process you are supporting, and build support that fits it. Mismatched support — however well-engineered — will hurt more than help.