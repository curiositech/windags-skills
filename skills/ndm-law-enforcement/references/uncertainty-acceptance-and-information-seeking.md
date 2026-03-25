# Uncertainty Acceptance and Strategic Information Seeking: How Expert Systems Operate Without Complete Information

## The Fundamental Challenge

Every intelligent system operating in the real world faces a version of the same problem: the information needed to make the best decision is not fully available, may never become fully available, and waiting for it may itself be costly or impossible. The question is not whether to act under uncertainty — it is how.

Traditional decision theory has long studied decision-making under uncertainty, but typically treats uncertainty as a quantifiable property (unknown probability distributions over known outcomes). The NDM tradition, drawing on Lipshitz and Strauss (1997), presents a richer taxonomy that better reflects the kinds of uncertainty agents actually encounter.

## Three Types of Uncertainty

Lipshitz and Strauss (1997) classified uncertainty into three distinct types (cited in Zimmerman, pp. 6-7):

**Inadequate understanding**: The decision-maker doesn't know what is happening. The situation is not recognized, the diagnosis is unclear, the story doesn't make sense yet. This is uncertainty about the *nature of the problem*.

**Undifferentiated alternatives**: Multiple courses of action seem equally viable, or the decision-maker cannot distinguish which alternative is best. This is uncertainty about *what to do*.

**Lack of information**: Specific facts are missing that would be needed to resolve the above. This is uncertainty about *the data*.

The critical finding: "the subjective aspects of the situation, such as inadequate understanding and undifferentiated alternatives played a bigger role in uncertainty than did objective aspects, such as lack of information" (Lipshitz & Strauss, 1997, cited in Zimmerman, p. 7).

This is counterintuitive. We tend to think of uncertainty primarily as missing data — if we just had more information, we would understand the situation better and know what to do. But the research suggests that the harder problems are inadequate understanding (we can't make sense of the data we have) and undifferentiated alternatives (we understand the situation but still can't determine the best response).

**For agent systems:** This taxonomy has direct design implications. When an agent reports uncertainty, it matters enormously *which type* of uncertainty is present:
- Inadequate understanding → invest in situation assessment: story-building, pattern matching, seeking clarifying cues
- Undifferentiated alternatives → invest in action evaluation: mental simulation, quick test, explicit cost-benefit comparison
- Lack of information → invest in information acquisition: identify the specific data that would most reduce uncertainty, and seek it

Conflating these types leads to inappropriate responses: seeking more data when the problem is misinterpretation of existing data, or doing more analysis when the needed input is simply missing.

## Uncertainty as Staller vs. Uncertainty as Inevitable

Traditional framing: uncertainty is a problem to be resolved before action. Once sufficient certainty is achieved, action follows.

NDM framing: "Klein (1998) contends that once the inevitableness of uncertainty is accepted, decision makers can focus on the task of using the information that is available to reach effective decisions" (cited in Zimmerman, p. 7).

This reframing is crucial. Uncertainty is not a temporary state that precedes decision-making — it is the permanent condition within which decision-making occurs. Treating it as something to be eliminated leads to analysis paralysis. Treating it as the operating environment leads to pragmatic action under acknowledged uncertainty.

Zimmerman's empirical data confirmed this in law enforcement: "participants expected a high degree of uncertainty when encountering potentially threatening individuals and not only accepted this uncertainty, but also adapted to functioning in such environments" (p. 64). Officers' default operating mode was uncertainty acceptance — "I always expect the worst," "I assume everyone is armed," "everyone is a suspect, until I can determine otherwise." This is not pessimism; it is the expert's adaptation to a permanent epistemic condition.

**The expert's relationship to uncertainty**: The expert doesn't try to eliminate uncertainty before acting. Instead, they:
1. Acknowledge and calibrate the level of uncertainty present
2. Identify which decisions are robust to that uncertainty (can be made safely now) and which are not (should be deferred or made with escalated caution)
3. Act on robust decisions immediately
4. For non-robust decisions, actively seek the specific information that would most reduce uncertainty
5. Use worst-case assumptions as a protective default when uncertainty is irreducible

**For agent systems:** Build explicit uncertainty representation into agent architectures. Not just confidence scores (how sure am I?), but uncertainty type (which kind of not-sure?), uncertainty impact (does this uncertainty affect my decision?), and uncertainty reducibility (is there information I could get that would help?). An agent that represents uncertainty richly can make much better decisions about when to act, when to wait, and what information to seek.

## Active vs. Passive Information Seeking

A consistent finding across expertise research: experts actively seek information to reduce uncertainty, rather than passively waiting for information to arrive.

Vicente and Wang (1998) describe how "skilled decision makers are also better able to seek out relevant information and use leverage points to progress a situation to the desired end" (cited in Zimmerman, p. 26). The concept of **affordances** — opportunities provided by the environment — and **leverage points** — affordances that provide focus and direction — describes how experts scan the environment not just to record what's there, but to identify what's useful.

**Affordances**: elements of the environment that offer decision-relevant information or action opportunities. An expert officer entering an unknown building doesn't just see a room — they see cover positions, sight lines, entry and exit points, indicators of recent activity.

**Leverage points**: affordances that provide maximal progress toward the decision-maker's goal with minimal cost. The expert identifies *which* pieces of information, if obtained, would most efficiently resolve the current uncertainty, and directs attention accordingly.

The contrast with novice information seeking: novices tend to process information in order of presentation or salience, not in order of decision-relevance. They may note many features of the environment, but miss the specific feature that would most efficiently update their situational model.

**For agent systems:** Build leverage-point reasoning into agent information-gathering. Before seeking additional information, agents should ask:
- What specific uncertainty am I trying to reduce?
- What information would most efficiently reduce that uncertainty?
- Where is that information available, and what is the cost to obtain it?

This converts information-seeking from a diffuse "gather more data" process into a targeted, efficient reduction of the most important uncertainties.

## Satisficing Under Uncertainty: Integrating the Frameworks

The quick test, the satisficing framework, and the uncertainty acceptance principle together form an integrated decision policy:

**Step 1: Acknowledge uncertainty.** Accept that complete information is not available and will not become available in time. Classify the type of uncertainty present.

**Step 2: Run the quick test.** Is delay acceptable? Is error cost high? Is the situation unfamiliar? These three questions determine whether to act immediately or invest in further analysis.

**Step 3: If analysis is warranted, identify leverage points.** Don't seek information broadly — identify the specific information that would most reduce the most consequential uncertainty and seek that specifically.

**Step 4: Set the satisficing threshold.** Define what an acceptable solution looks like in this situation. This is context-dependent: in a life-or-death situation with high error costs, the threshold is different than in a low-stakes, easily reversible situation.

**Step 5: Evaluate the first viable option against the threshold.** If it passes, implement it. If not, modify it or generate the next option.

**Step 6: Monitor for situation change.** Continue tracking whether the situation remains what the initial assessment said it was. If it changes, reassess.

This integrated policy embeds uncertainty acceptance at every step: the goal is never to eliminate uncertainty, but to make the best decision possible given the uncertainty that exists.

## The Special Challenge of Human Behavior Uncertainty

Zimmerman's research introduces a finding that distinguishes law enforcement (and many other agent deployment contexts) from the domains where most NDM research has been conducted. In most NDM domains — aviation, firefighting, naval warfare, nuclear power — the decision-maker is assessing physical systems that follow physical laws. The uncertainty is about system state and physical process.

In law enforcement, the decision-maker must predict human behavior. "The ability to assess and predict human behavior is vastly more complex than predicting the behavior of non-human entities. Humans interact socially and interpret intentions and actions based on their own previous experiences, their emotions before and during the event, their mental state, personality traits, and previous knowledge or misinformation" (Zimmerman, p. 22).

Shanteau (1992) documented the performance gap empirically: decision-makers who make decisions about physical entities (weather, aircraft, chess positions) perform significantly better than decision-makers who make decisions about human behavior (clinical patients, defendants, parolees). The task characteristics that enable good performance — static, unique, predictable, with decision aids and feedback — are absent in human behavior domains.

**For agent systems operating in human-facing domains:** The fundamental finding is that human behavior uncertainty is categorically harder than physical system uncertainty. Several specific properties make it harder:

- **Intentionality**: Humans adapt their behavior in response to what they believe about the agent's intentions and capabilities. This creates adversarial dynamics that physical systems don't have.
- **Opacity**: Human internal states (emotions, intentions, beliefs) are not directly observable. The agent must infer them from behavioral signals that are often ambiguous and culturally variable.
- **Variability**: The same person in the same situation may behave differently depending on internal states that the agent cannot observe. The variance in human behavior prediction is simply higher than in physical system prediction.
- **Feedback scarcity**: In many human behavior prediction domains, feedback is delayed, noisy, or absent. The agent cannot learn quickly from mistakes.

**The novel opportunity identified by Zimmerman:** Experienced officers didn't just assess human behavior — they actively shaped it. "Instead of only using tactics to alter the physical environment, some participants attempted to manipulate the cognitive environment in order to achieve their goals" (p. 71). One expert officer, recognizing that a suicidal subject's agitation was centered on his family, "drop[ped his] voice way down and started asking about his family... If you can play on his emotions for his family, all of the sudden he realizes he's hurting someone besides himself, so I went after that and it ended up working" (p. 58).

This represents a second-order capability beyond situation assessment: the ability to influence the human's own situational assessment, changing what they perceive as possible and desirable. Agent systems operating in human-interactive domains should be designed not just to assess and respond to human behavior, but to consider how their responses shape the human's subsequent behavior — including whether the human's uncertainty about the agent's capabilities and intentions can be used strategically.

## Uncertainty, Stress, and Decision Quality

Acute stress — the kind present in high-stakes, time-pressured decision environments — interacts with uncertainty in specific ways that are relevant to agent design.

"Anxiety leads to a narrowing of attention (tunnel vision)" (CIDS Training, Appendix C). Under stress, decision-makers reduce the breadth of their attention, focusing narrowly on the most salient features of the environment. This has two effects: they process less information overall (increasing effective uncertainty), and they may miss peripheral cues that would be decision-relevant.

"Stress constrains the thinking process. Stress affects the way we process information, it does not cause poor decisions" (CIDS Training, Appendix C). This nuance is important: stress doesn't make people stupid. It narrows attention, reduces working memory capacity, and increases reliance on familiar patterns. For agents: elevated task complexity and time pressure should trigger similar conservatism — relying more heavily on well-established patterns and seeking fewer, more targeted pieces of new information.

"More experienced decision makers are less influenced by stress" (CIDS Training, Appendix C). The mechanism: experts have better-established mental models that are more resistant to degradation under stress, and their proceduralized knowledge requires less working memory to access. For agents: robust pattern libraries and proceduralized common-case handling are not just efficiency gains — they are resilience factors that maintain performance when computational resources are constrained.

**For agent systems under high-load conditions:** Design degradation protocols that explicitly trade breadth for reliability when resources are constrained. Under high load, narrow the attention window, rely on established patterns, reduce option generation, and apply satisficing with a higher threshold. This produces more conservative but more reliable behavior — which is appropriate when uncertainty and stakes are both elevated.