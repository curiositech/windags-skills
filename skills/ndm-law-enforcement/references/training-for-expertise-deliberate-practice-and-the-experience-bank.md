# Training for Expertise: Building the Mental Models That Enable Expert Decision-Making

## The Problem with Natural Experience

Expertise develops through experience — but not just any experience. The relationship between time-in-domain and actual expert performance is far weaker than commonly assumed. "Years of experience alone does not provide an accurate determination of experience" (Zimmerman, p. 42, citing Ericsson & Charness, 1994).

There are several reasons for this:

**Low-probability events may never be encountered.** A police officer who works primarily in low-crime areas may accumulate many years of service without ever facing a hostage situation, an active shooter, or an armed confrontation requiring shoot/no-shoot judgment. Natural experience provides no training for the situations that most need it.

**Feedback is often delayed, absent, or distorted.** As discussed in the previous document, natural field feedback is systematically biased toward salient outcomes and away from the base rates that would allow calibration.

**Without structure, experience encodes errors.** If a novice develops a bad habit early — approaching subjects too quickly, maintaining inappropriate distances, failing to use cover — natural experience may reinforce those errors rather than correcting them, because the errors don't consistently produce bad outcomes in routine situations.

**Expert knowledge, once acquired, cannot be taught by having experts simply describe it.** The tacit, automated nature of expert knowledge means that experienced officers cannot reliably transmit their expertise through verbal instruction.

## Ericsson's Deliberate Practice

Ericsson, Krampe, and Tesch-Römer (1993) identified **deliberate practice** as the specific mechanism through which expertise develops. The key features of deliberate practice:

1. **Designed to address specific weaknesses**, not to perform familiar tasks comfortably
2. **Includes immediate, accurate feedback** on performance
3. **Requires effortful concentration**, not automatic execution
4. **Is often not enjoyable** — it is inherently effortful and targets deficits
5. **Accumulates over extended periods** — expertise requires thousands of hours of deliberate practice, not just experience

The implication for police training is direct: time spent on familiar patrol activities does not build expertise in high-stakes critical incident decisions. What builds that expertise is specifically structured exposure to challenging, non-routine situations with immediate, accurate performance feedback.

## The Three-Pronged Approach

The CIDS (Critical Incident Decision Skills) training framework synthesized in this research implements deliberate practice through three coordinated components:

### 1. Simulation (Simunition® Scenarios)
Live scenario training with genuine emotional, cognitive, and behavioral engagement. The non-lethal marking cartridges mean that being "shot" has real consequences — pain, defeat, embarrassment. This emotional reality is not an incidental feature — it is essential to building mental models that will operate under actual stress.

"These simulations are considered more effective than lecture courses or typical gun range practice for preparing officers for duty on the streets" (p. 33).

The simulation component provides:
- Controlled exposure to rare, high-stakes scenarios that would otherwise never be encountered
- Real-time decision-making under genuine time pressure and emotional engagement
- Behavioral record (video) for post-event analysis
- Multiple officers experiencing identical scenarios (enabling comparison and discussion)

**Transfer to agent systems**: Simulation-equivalent training for agents means exposure to synthetic but realistic scenarios that include the full complexity profile of the target environment — not just clean examples from training distributions, but ambiguous, time-pressured, high-stakes, dynamically changing situations. Agents trained exclusively on well-structured examples will fail in naturalistic environments for the same reason officers trained only in classroom settings fail in the field.

### 2. Post-Event Interview (CDM)
Structured retrospective knowledge elicitation immediately following the simulation. The proximity to the event maximizes memory access. The CDM structure ensures that cognitive processes are probed, not just behavioral outcomes.

This serves two functions simultaneously:
- **Knowledge elicitation**: extracts the cognitive processes that produced the observed behavior, surfacing both effective strategies and failure modes
- **Self-reflective learning**: the process of articulating what you noticed and why forces a level of metacognitive awareness that accelerates future learning

"Researchers in the NDM domain have progressively developed and refined interview techniques that use cognitive probes to tap into decision makers' understanding of situations and their internal decision processes" (p. 16).

**Transfer to agent systems**: Post-execution retrospective analysis is the agent analog of CDM. Rather than simply logging what happened, agent systems should include structured analysis of *why* decisions were made — what the working model was, what information was weighted, what alternatives were considered, where the plan diverged from expectation. This is the training signal for the reasoning process, not just the action outputs.

### 3. Cognitive Skills Training (CIDS)
The classroom component: structured training in the explicit cognitive tools of expert decision-making. Not just "here's how to clear a room" but "here's how to assess a situation, here's the OODA loop, here's the quick test, here's how to run a mental simulation, here's how to communicate the reasoning behind your decisions."

This addresses the gap identified across all NDM research: expert cognitive skills are tacit and automatic in true experts, but they can be made explicit, taught, and practiced in novices before they become automatic.

Key components of the CIDS curriculum:
- **Decision environments** — understanding the characteristics of critical incident environments vs. strategic environments
- **Boyd's OODA loop** — Observe, Orient, Decide, Act — as a model for explicit decision process management
- **The Quick Test** — applied as a real-time decision gate
- **Mental simulation** — explicitly taught as a tool, not just acquired naturally
- **Error recognition** — task fixation, expectancy bias, tool-retention error
- **Communication of decision reasoning** — how to verbalize the basis for a decision so it can be reviewed, defended, and learned from
- **Inside the enemy's OODA loop** — how to act faster than the adversary can update their own decision cycle

"The purpose of CIDS training is to enhance decision maker ability in critical situations and to develop novice skills to expert levels" (p. 37).

**Transfer to agent systems**: This translates to explicit encoding of decision-quality meta-skills, not just domain skills. An agent system should have explicit representations of: when to switch between fast and slow processing; how to represent and communicate uncertainty; what kinds of situations trigger plan re-evaluation; how to recognize that the current mental model is failing.

## Why One-Day Training Is Not Enough

The study's honest finding: the one-day CIDS training did not produce reliable measurable changes in decision processes between Time 1 and Time 2 evaluations. Officers showed enthusiasm and reported value from the training, but the systematic performance differences the study hoped to detect were not found.

"It may be necessary to implement continual training procedures where mental models are introduced and feedback about performance is given on a regular basis" (p. 72).

This is consistent with the deliberate practice literature: a single exposure to new cognitive tools does not restructure decision-making. What changes behavior is repeated exposure, with feedback, over time. "It is through repeated exposure to a variety of domain-specific incidents and consistent feedback about performance that expertise develops" (p. 72).

The implication for agent training is significant: **a single training run, even with excellent methodology, will not produce expert-level performance in genuinely complex domains**. The path to expertise in NDM environments requires ongoing exposure to diverse scenarios with accurate feedback — not a single training episode.

## The Experience Bank

A recurring concept in this research is the "experience bank" — the accumulated store of domain-specific incidents, patterns, and outcomes that experts draw on when making decisions. "Structured simulations allow officers to evaluate their action choices, receive feedback, and develop first-hand experience. Engaging in simulated events provides officers with opportunity to engage in low-probability incidents that they must nonetheless continually be prepared to handle" (p. 34).

The experience bank is not just a store of cases — it is a structured representation of what kinds of situations lead to what kinds of outcomes under what kinds of actions. It is the basis for:
- Pattern recognition (this situation matches past situations in these ways)
- Expectancy generation (given this kind of situation, X typically happens next)
- Action retrieval (in situations like this, Y is the effective response)
- Anomaly detection (something about this doesn't fit the pattern)

Building a rich experience bank requires deliberate construction, not just accumulation. Officers (and agent systems) who encounter only routine situations will have banks that are deep in routine situations and shallow in the high-stakes scenarios that most need robust coverage.

## The Value of Other People's Stories

One finding from the training evaluation is particularly important: participants found hearing other participants' stories and approaches *more valuable* than many of the formal training components.

"It is possible to develop or expand mental models simply by hearing other people's stories, and many participants stated that hearing how other participants have handled or would handle particular situations provided them with insight and ideas they had not previously thought of" (p. 68-69).

This finding has direct relevance to agent system design: **sharing case-specific narratives across agents is a legitimate and valuable mechanism for distributing domain expertise**. A less-experienced agent that can access the resolved case histories of more experienced agents — with the cognitive reasoning attached, not just the outcomes — can develop mental model coverage that would otherwise require many more direct encounters.

This is the knowledge management implication of the NDM framework: experience sharing, when structured around specific incidents with accessible reasoning, produces faster expertise development than natural individual experience accumulation alone.

## Summary Design Principles

1. **Train on the full complexity profile**, not just clean cases. Simulated scenarios should include ambiguity, time pressure, missing information, and dynamic changes.

2. **Feedback must be immediate, specific, and accurate**. Delayed, vague, or inaccurate feedback doesn't build expertise — it may actively build miscalibration.

3. **Cognitive tools need explicit instruction and practice**, not just implicit acquisition. The OODA loop, the quick test, mental simulation, anomaly recognition — these should be named, taught, and practiced.

4. **One training session is insufficient**. Expertise requires repeated exposure with feedback over extended periods.

5. **Story-sharing across agents is a training mechanism**. Structured access to others' resolved experiences with reasoning visible is valuable for expanding mental model coverage.

6. **Low-probability high-stakes scenarios need deliberate coverage**. Natural experience will not provide these; they must be designed in.