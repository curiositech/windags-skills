# Serial Evaluation vs. Concurrent Comparison: Why Experts Don't Compare Options

## The Standard Model and Its Problems

The dominant prescriptive model of decision making — represented by Janis and Mann's (1977) seven criteria for "ideal" decision making — requires that a decision maker:

- "Thoroughly canvass a wide range of alternative courses of action"
- "Survey the full range of objectives to be fulfilled and the values implicated by the choice"
- "Carefully weigh whatever he knows about the costs and risks of negative consequences, as well as the positive consequences, that could flow from each alternative"
- "Reexamine the positive and negative consequences of all known alternatives, including those originally regarded as unacceptable, before making a final choice"

Janis and Mann assert that "failure to meet any of these seven criteria when a person is making a fundamental decision constitutes a defect in the decision-making process."

Klein and Calderwood's field research found that experienced, high-performing decision makers systematically violated all of these criteria — and performed *better* as a result.

## What Concurrent Evaluation Actually Costs

Concurrent evaluation — comparing multiple options against each other on a set of dimensions — is expensive in multiple ways:

**Time cost**: Generating all viable options and evaluating them systematically takes time that dynamic environments may not provide. Fires spread. Tactical situations shift. The situation during which analysis begins may not be the situation when analysis concludes.

**Cognitive cost**: Holding multiple options in working memory while computing their relative merits on multiple dimensions approaches the limits of human (and computational) cognitive capacity rapidly.

**Action-readiness cost**: The most underappreciated cost. During concurrent evaluation, the decision maker has *no ready action*. They are not prepared to act until all analysis is complete. If time pressure forces early termination of analysis, they may not know which option was favored. "Only when all the analyses were completed would it become clear which course of action to select."

Klein notes: "A serial evaluation strategy as posited by the RPD model continuously makes available to a decision maker a preferred course of action. If time pressure forces a response, decision makers are prepared. In contrast, a concurrent evaluation model would leave a decision maker unprepared for action during the time course of the analysis."

This is a fundamental architectural difference. Concurrent evaluation is a batch process — it produces output only when complete. Serial evaluation is a streaming process — it produces a current best output at every moment, updated as each evaluation completes.

## How Serial Evaluation Works

Serial evaluation proceeds as follows:

1. The situation assessment activates an action queue — an ordered list of typical responses for this situation type, with the most typical action first.
2. The first action is proposed and mentally simulated (via progressive deepening — see that document for details).
3. If the simulation reveals no fatal flaws, the action is implemented.
4. If flaws are found, the action is either modified to address the flaw, or rejected.
5. If rejected, the next action in the queue is proposed and the cycle repeats.

The key features:

**No comparison**: At no point are two options held in mind simultaneously and compared against each other. Each option is evaluated in isolation, against the situation itself rather than against other options.

**Satisficing, not optimizing**: The decision terminates when a *workable* option is found, not when the *best* option is identified. But this is not naive satisficing — because the action queue is ordered by typicality, "the first option selected from the 'action queue' is the most typical option, and therefore has a high likelihood of being effective." The expert begins with a promising option, not a random one.

**Option modification**: When a simulation reveals a flaw, the expert often *repairs* the option rather than rejecting it entirely. "Limitations are found but the decision maker often tries to find ways of overcoming them, thereby strengthening the option." This is a capability that concurrent evaluation explicitly lacks — modifying an option during comparison would disrupt the analysis.

## The Chess Evidence

Study 5 provides a clean experimental test of the expert-novice difference in time pressure sensitivity.

The hypothesis: if experts rely more on recognition (fast, holistic, time-insensitive) and less on calculation (sequential, time-intensive), then time pressure should hurt novices more than experts. Chess provides an ideal test because skill is objectively measurable and time pressure is experimentally controllable.

The study compared master players and class B players in regulation games (50+ moves in 2 hours) versus blitz games (6 minutes total per player). Move quality was rated by a grandmaster.

The result: "The decrement in move quality for blitz games compared to regulation games was greater for the class B players than for the masters." Moreover, "masters were more able to maintain higher quality moves in the blitz condition at the same time that they generated a substantially greater number of moves, and proportionately more complex moves."

This is precisely the predicted pattern: expert recognition-based processing is robust to time pressure in a way that novice calculation-based processing is not.

The insight extends beyond chess. In any domain where experts have developed strong situational recognition, time pressure affects them far less than novices. The novice, who compensates for thin situation assessment by doing explicit option generation and comparison, is the one who is most damaged by time pressure — because time pressure interrupts their compensatory strategy.

## The Expert/Novice Reversal

Perhaps the most important finding is the expert/novice reversal in decision strategy. From Study 7:

"Experts appeared to pay more attention to assessing the situation (noticing cues and making inferences based on the cues), whereas Novices pay relatively more attention to generating and evaluating options."

Novices are doing what the prescriptive models recommend — generating options and evaluating them. Experts are not. And experts perform better.

The implication is profound: the prescriptive recommendation to generate more options and evaluate them more carefully is advice that makes sense for novices (who lack strong recognition capabilities) but actively harms experts (by forcing them to use an inferior strategy that undermines their primary strength).

From Study 1: "Experts used an approximately equivalent mix of serial and concurrent strategies whereas Novices appeared to rely more on concurrent deliberation. Experts were also more likely to deliberate about situational aspects of the decision problem, whereas Novices deliberated more about option implementation and timing."

The expert's deliberation is about understanding the situation. The novice's deliberation is about which option to pick — which is backward. You should understand the situation first; option selection follows naturally from that understanding.

## When Concurrent Evaluation Is Appropriate

This is a critical boundary condition. Klein's data does not claim that concurrent evaluation is always wrong. The wildland firefighting study found that "for decisions involving organizational issues and interpersonal negotiations (28% of the incidents identified as critical), we found a predominance of analytical strategies in which several options were evaluated concurrently."

When is concurrent evaluation warranted?
- When the situation is genuinely novel and no prototype fits well
- When multiple stakeholders have conflicting goals and a visible deliberation process is required for buy-in
- When there is sufficient time and stakes are high enough that the cost of suboptimal selection exceeds the cost of deliberation
- When the domain is under-experienced (the expert has not yet built strong recognition patterns)

Klein also notes: "The time to develop large option sets is when a situation is encountered that is unfamiliar, or when there are disputes." Concurrent evaluation is a fallback, not a primary strategy — and it is most appropriate in exactly the conditions (novelty, disagreement, time availability) where the costs of serial evaluation are highest.

## Application to Agent System Design

**Default to Serial Proposal**: Agent systems should be designed to propose and evaluate one action at a time, rather than generating a slate of options and scoring them. The first proposal should be the most situationally-typical action. This keeps the system action-ready at every moment.

**Streaming Output Architecture**: Like serial evaluation, agent execution should produce a current best action continuously, improvable as more evaluation occurs, rather than a batch output that arrives only when complete. This enables graceful degradation under interruption.

**Reserve Concurrent Evaluation for Specific Triggers**: Concurrent option comparison should be reserved for cases where the situation assessment is flagged as novel, where the domain knowledge is thin, or where explicit stakeholder deliberation is required. It should not be the default.

**Treat Option Modification as First-Class**: When an agent's simulation of a proposed action reveals a flaw, the agent should first attempt to *repair* the option before rejecting it. Option modification is more efficient than full rejection when the flaw is localized.

**Track Action-Readiness**: At any point during an agent's evaluation process, it should be able to report "current best action if interrupted now." This is not a fallback — it is an architectural requirement for operating in dynamic environments.

**The Expert Design Principle**: As agents accumulate more domain experience (whether through training or operational deployment), they should be designed to shift *from* concurrent evaluation *toward* serial evaluation with progressive deepening. Continued reliance on concurrent option scoring after expertise develops is a design antipattern — it prevents the recognition capabilities from driving the process.