# Mental Simulation: How Experts See Into the Future and Past

## The Power Source That Decision Theory Missed

Classical decision theory assumes we evaluate options by estimating their outcomes and comparing expected utilities. But when Gary Klein studied expert decision makers in naturalistic settings, he found they rarely compared options at all. Instead, they used a different cognitive tool: **mental simulation**—the ability to imagine people and objects consciously and transform them through several transitions, picturing them in a different way than at the start.

Klein writes: **"Mental simulation serves several functions in nonroutitive decision making. It helps us to explain the cues and information we have received so that we can figure out how to interpret a situation and diagnose a problem. It helps us to generate expectancies by providing a preview of events as they might unfold... And it lets us evaluate a course of action by searching for pitfalls so we can decide whether to adopt it, change it, or look further."**

This isn't vague visualization or wishful thinking. Mental simulation has specific, measurable characteristics:
- **Maximum complexity**: 3 moving parts (variables that change)
- **Maximum depth**: 6 transition states
- **Purpose**: Diagnosis (explaining the past), expectancy generation (predicting what should happen next), and evaluation (testing for problems)

The constraint structure isn't a weakness—it's a design principle that forces experts to think at the right level of abstraction.

## The Three Functions of Mental Simulation

### Function 1: Diagnosis (Explaining the Present by Simulating the Past)

Expert troubleshooters don't just observe symptoms—they **construct causal stories** about how the current state came to be. This is mental simulation running backward in time.

**Example: The Case of the Seasonal Short**

An electrician's nightmare: a fuse blows only in summer, not winter. Multiple electricians find nothing.

The master troubleshooter's approach:
1. Asks about seasonal changes: room use changes in summer (becomes a walkway)
2. Requests the seasonal configuration be recreated
3. Gets on hands and knees, feels the carpet along the main pathway
4. Finds a protruding nail puncturing an electrical wire
5. Constructs the causal story: Summer = people step on nail → short. Winter = no foot traffic on nail → no short.

**The strategy**: Klein notes, "The strategy he used was to find a key change between the two seasons, to get a clue about where to find the culprit."

The troubleshooter mentally simulated what happens during summer traffic patterns—imagined feet stepping on carpet, pressure driving the nail deeper into the wire, electrical contact creating the short. This backward-running mental simulation generated a hypothesis that could be tested physically.

**Contrast with novice approach**: Novices would treat this as a structural failure in the electrical system itself, checking connections, testing circuits, examining the fuse box. They wouldn't think to ask "What's different about summer?" because they don't have the experience to recognize intermittent failures as clues about triggering conditions.

**Example: The Case of the Misleading Manuals (Software Troubleshooting)**

An engineer can't print long reports—they get cut off at about half the expected length. The manual says nothing about length limits. Under time pressure.

Expert troubleshooting sequence:
1. Asks someone (gets generic non-answer: "reports kept short for efficiency")
2. Checks manual (no restriction listed)
3. Becomes suspicious—decides reading all source code would take too long
4. Skims code after lunch, notices "255" appearing repeatedly
5. **Recognition**: 256 bytes is a universal computational constraint
6. **Hypothesis**: Limit set at 255 bytes to stay under 256
7. Brings code to original developer → confirmed

**What happened cognitively**: The expert mentally simulated the original developer's design process: "If I were implementing this system, where would I put a limit? What constraints would I face?" The repeated appearance of 255 triggered recognition of a canonical pattern (255 = max value for 8-bit unsigned integer, common boundary just under 256). Mental simulation of the designer's reasoning revealed the hidden constraint.

Klein emphasizes what the expert did right—and what novices get wrong:
- **Right**: Formed the correct initial diagnosis (not a bug, but an undocumented limit)
- **Right**: Knew when not to ask for help immediately (preserve credibility)
- **Right**: Found a diagnostic cue (255) that confirmed the hypothesis without reading all code
- **Wrong novice approach 1**: Waste hours with debugging programs
- **Wrong novice approach 2**: Ask for help too quickly and lose credibility
- **Wrong novice approach 3**: Try to read all source code (too time-consuming)

### Function 2: Expectancy Generation (Predicting What Should Happen Next)

Experts don't just react to what they observe—they **generate expectancies** about what should happen next and flag violations as anomalies.

**Example: The Sixth Sense (Basement Fire) Revisited**

The fireground commander leading a hose crew into a house fire generates multiple expectancies based on recognizing this as a "kitchen fire" pattern:
- **Expectancy 1**: Water should suppress flames quickly
- **Expectancy 2**: Fire should die down when hit
- **Expectancy 3**: Living room heat should be proportional to kitchen fire size (moderate)
- **Expectancy 4**: Fire should be noisy (heat produces sound)

**Violations detected**:
- Water has less impact than expected
- Fire roars back instead of dying
- Room is hotter than expected
- Very quiet

Each individual violation might be explainable. But the **total pattern mismatch** triggers alarm. The commander evacuates immediately, before conscious reasoning catches up to pattern recognition.

**The reality**: Fire was in the basement, directly beneath them. The floor acted as a baffle. If he'd stayed to investigate consciously, he and his crew would likely have been killed when the floor collapsed.

Klein's analysis: **"With hindsight, the reasons for the mismatch were clear"**—but the commander couldn't articulate them in real time. The pattern recognition was preconscious. Mental simulation generated expectancies; observation violated them; action followed before reasoning could interfere.

**Example: HMS Gloucester and the Silkworm Missile**

February 1992, Persian Gulf War. Lieutenant Commander Michael Riley identifies a radar blip as a Silkworm missile (not an A-6 aircraft) within seconds, before altitude data becomes available. He fires missiles, destroys it, narrowly avoids shooting down a U.S. ally.

**The puzzle**: Four ways to distinguish A-6 from Silkworm:
1. **Location**: Useless (U.S. pilots cutting corners, flying over Silkworm sites)
2. **Radar signature**: Useless (most A-6s had radar off)
3. **IFF signal**: Useless (pilots turn IFF off in enemy territory)
4. **Altitude**: Primary cue (Silkworm ~1000 ft, A-6 ~2000-3000 ft) but not available yet

**Riley's account**: He felt acceleration from the first radar sweep. "I believed I had one minute left to live."

**The problem**: No acceleration was detected objectively. The blip moved at constant speed throughout. Three radar sweeps are needed to calculate acceleration; Riley identified it by the second sweep. Experts analyzing the tape could not see acceleration.

**Rob Ellis's breakthrough hypothesis**:
- Ground clutter masks low-altitude objects longer than high-altitude ones
- First radar sweep after "feet wet" picks up A-6 at 3000 ft but NOT Silkworm at 1000 ft
- Silkworm first appears farther off-coast than typical A-6 blips
- **Perceptual illusion**: Farther = came faster = acceleration illusion
- Riley **confounded altitude with speed**

**Context Riley didn't articulate**:
- Five hours into a six-hour shift
- He'd mentally simulated earlier: "If I were running a Silkworm site, now is when I'd fire" (war ending, Missouri getting close, nothing to save missiles for)
- He'd warned crew 1 hour prior: "highest alert, this is when they'll fire"
- No other air tracks at the time → crew could focus entirely on this blip

**The mental simulation that saved the ship**: Riley had run forward-looking simulations of when an attack would come, priming him to expect a threat. When the radar blip appeared in an anomalous position (farther out than expected), his pattern recognition detected the mismatch. He couldn't explain why, but the violation of expectancy triggered immediate action.

### Function 3: Evaluation (Testing Plans for Failure Modes)

The most common use of mental simulation is to evaluate a course of action by imagining its execution and looking for problems.

**Example: The Car Rescue**

Driver unconscious, crashed car into concrete pillar. Doors badly damaged. Commander recognizes that most roof posts are severed by impact.

Mental simulation sequence (~1 minute):
1. Imagine roof being removed
2. Visualize sliding driver out
3. Imagine crew positions to support driver's neck
4. Imagine turning driver to maneuver around steering column
5. Imagine lifting him out
6. Check sequence for problems → seems to work
7. Run through again looking for problems → can't find any
8. Decision: Explain plan to crew; execute rescue

**What went right**: The basic plan worked. Roof was removed, driver was extracted safely.

**What went wrong**: Driver's legs were wedged under steering wheel. Additional crews needed to unlock knees.

**The lesson**: Mental simulation was successful at the strategic level but incomplete in detail. It didn't catch every physical constraint. But the flexibility of the trained team caught the failure mid-action and adapted.

Klein emphasizes this is the **normal case**: "Mental simulation is usually better than anything else they can do" but it's not foolproof. The goal isn't perfection—it's good-enough evaluation that's fast enough to be useful under time pressure.

**Example: The Libyan Airliner Shootdown (February 21, 1973)**

This is a case of **catastrophic failure** where both sides used mental simulation but constructed incompatible stories.

**Israeli perspective**:
- Plane off-course, violating Egyptian airspace
- Flying "hostile" route used by Egyptian fighters
- Window shades down (suspicious)
- Egypt's radar should have detected but didn't
- Recent history: Ethiopian plane shot down by Egyptian missiles for similar penetration

**Israeli general Motti Hod's simulation**:
> "The captain sees our Israeli insignia on our F-4s. He sees Refidim airfield ahead. He knows we want him to land, since he lowers his landing gear. Then he retracts the landing gear and flies off! ...At first he doesn't fly directly west but turns to circle the air base. We interpret this as an attempt to make a better approach. Then he turns and starts to fly west. That is when we order our F-4s to start firing tracer bullets... Still they keep going west. No genuine civilian captain would behave in such a manner."

**Israeli conclusion from mental simulation**: "A crew on a terrorist mission would show such behavior."

**Libyan crew perspective** (reconstructed from black box):
- Sandstorm, position uncertain
- Captain (French) and flight engineer discuss doubts; copilot (Libyan) not fluent, not included
- Receives permission to descend from Cairo, tries beacon signals
- Gets radio contact with Cairo—reports difficulty with beacons
- **Identifies F-4s as "Egyptian fighters"** (Egyptians fly Soviet MiGs, not F-4s—so this is already a misidentification)
- Interprets hand signals as warning they've overshot Cairo West, are over Cairo East
- Thinks they need to avoid military base
- Turns toward what they think is Cairo West
- When fired on: "We are now shot by your fighter" (unthinkable—Egypt and Libya are allies)
- Think Egyptian fighters are "crazy"
- Don't incorporate hostile fire into their story until nearly the end

**The dual failure**: Both sides built coherent mental simulations that explained the same observables differently:
- **Israelis**: "Only terrorists would behave this way"
- **Libyans**: "Only friendly fighters would be here; they're helping us navigate"

Neither could imagine the other's situation. Both were locked into mental simulations that were internally consistent but incompatible with reality.

**Klein's lesson**:
> "In this example, mental simulation is used differently than in the car rescue. In that case, mental simulation was used to imagine how a course of action would be played out into the future. Here, the Israeli generals were using mental simulation to imagine what could have happened in the past to account for the strange goings-on. Mental simulation about the past can be used to explain the present. It can also be used for predicting the future from the present."

Mental simulation can trap you when you construct the wrong story. Once committed to a narrative, disconfirming evidence gets explained away.

## The De Minimus Error: When Mental Simulation Explains Away Warnings

One of Klein's most important findings is that decision makers can **dismiss inconvenient evidence** by generating plausible explanations for individual cues, missing the significance of their conjunction.

**Example: The Missed Diagnosis (Neonatal ICU)**

A neonatal nurse fails to detect necrotizing enterocolitis in a premature baby. Three classic danger signs were present:
1. Distended stomach
2. Blood in stool
3. 3 cc aspirate

**The nurse's fatal explanation chain**:
- Distended belly? "That's a family trait [from sister's case]"
- Blood in stool? "That's small, related to the nasogastric tube"
- 3 cc aspirate? "That's small by itself, not unusual"

Each individual explanation is reasonable. But the **pattern conjunction**—all three together—is diagnostic. Mental simulation allowed the nurse to construct a coherent narrative that explained each cue individually, suppressing the gestalt pattern.

Klein: **"The weakness is that decision makers can easily dismiss evidence that is inconvenient, explaining away the early warning signs."**

**Example: The Trademaster and Pisces (Mississippi River Collision)**

Two cargo ships with clear passing arrangement via radio (starboard-to-starboard), then deviation.

Sequence of disconfirming evidence ignored:
1. Pisces captain sees oncoming tug forcing him left; radios for port-to-port passage
2. Pisces turns right to get in position
3. Trademaster captain never gets the message; sees Pisces swing out
4. **De minimus explanation #1**: "Pisces will correct his error soon"
5. Trademaster turns left to give more room (wrong direction)
6. Pisces, seeing Trademaster swing out, turns more sharply to give him room
7. **De minimus explanation #2**: Each captain thinks the other will correct
8. **Result**: Collision

**The pattern**: Each captain explained away the anomaly (other ship in wrong position) by assuming temporary deviation and correction-to-come. Mental simulation of "what the other captain is probably doing" prevented recognition that something was fundamentally wrong.

**Example: The Disoriented Physicists**

Two physicists descending Maroon Bells get lost, descend wrong side of mountain. See Crater Lake below (would indicate correct trail home).

**Anomaly**: Crater Lake doesn't have a dock. This one does.

**De minimus explanation**: "They must have built it since we left this morning."

Even trained scientists **confabulate to defend a mental simulation once constructed**.

## The Constraints of Mental Simulation: Why Three and Six Matter

Klein discovered that mental simulation has hard limits:
- **Maximum variables**: 3 moving parts
- **Maximum transitions**: 6 states

Why these specific numbers? The research doesn't definitively answer, but Klein's observations suggest:

1. **Working memory capacity**: Humans can hold 3-5 items in working memory simultaneously. Mental simulation requires tracking how variables interact—each interaction multiplies cognitive load.

2. **Error accumulation**: Each transition introduces uncertainty. After 6 transitions, accumulated error makes the simulation unreliable.

3. **Chunking enables complexity**: Experts don't violate these limits—they **reframe problems** to stay within them. Instead of tracking 10 variables through 20 transitions, they chunk related variables into units and represent transitions at a higher level of abstraction.

**Example from Klein's code inspection study**: Programmers asked to mentally execute code and predict outcomes. When variables interacted, "the job of visualizing the program in action became quite difficult." But experienced programmers reframed interacting variables as a single "subsystem state" and reasoned about subsystem transitions instead.

**The implication for intelligent systems**: Don't treat the 3/6 constraint as a limitation to overcome. Treat it as a **design principle**. If a plan requires tracking more than 3 variables or simulating more than 6 transitions, decompose it into smaller chunks that fit within simulation bounds.

## Mental Simulation vs. Formal Analysis: When Each Works

Klein doesn't claim mental simulation is always superior to formal analysis. He identifies when each approach works best:

### Mental Simulation Works When:
- **Time is limited** (seconds to minutes)
- **Causal relationships are qualitative** (not easily quantified)
- **Interactions are complex** (variables affect each other in non-linear ways)
- **Experience provides good intuitions** about what to expect
- **Satisficing is adequate** (good-enough solutions work)

### Formal Analysis Works When:
- **Time is adequate** (hours to days)
- **Variables are quantifiable** (can be measured precisely)
- **Relationships are well-understood** (can be modeled mathematically)
- **Optimization is necessary** (need provably best solution)
- **Stakeholders require justification** (must show explicit reasoning)

**Example of successful formal analysis: The Denver Bullets case** (from Section 2 notes)

Police chief wants hollow-point bullets. Citizen groups protest. Hammond's compensatory decision strategy:
1. Identify criteria (stopping effectiveness, injury severity, bystander threat)
2. Expert panel rates 80 bullet types on each criterion
3. City council weights criteria by values
4. Mathematically combine ratings and weights
5. Result: Identified a bullet that dominated on multiple dimensions

This worked because:
- Adequate time was available
- Criteria were quantifiable
- Stakeholders needed explicit justification
- The problem was fundamentally about **tradeoffs** that couldn't be resolved by mental simulation alone

## Training Mental Simulation: Techniques That Work

Klein identifies several methods for improving mental simulation ability:

### The Crystal Ball Method
> "The idea is that you can look at the situation, pretend that a crystal ball has shown that your explanation is wrong, and try to come up with a different explanation. Each time you stretch for a new explanation, you are likely to consider more factors, more nuances. This should reduce fixation on a single explanation."

**Caveat**: Not suited for time-pressured conditions. Useful in training to internalize what fixation feels like.

### The Premortem
Before executing a plan, imagine it has failed catastrophically. Generate a story about how the failure occurred. This surfaces hidden assumptions and potential failure modes that mental simulation might miss.

**Example**: Before launching a software release, team does a premortem: "It's six months later, and this release was a disaster. What happened?" Answers reveal: database migration script wasn't tested on production-scale data, key engineer will be on vacation during launch week, customer support wasn't trained on new features. These become action items.

### Snap-Back Thinking
When you notice yourself explaining away anomalies, **force yourself to consider** whether the anomalies might indicate your entire mental model is wrong. Klein calls this "snap-back" because you're snapping back from your current explanation to reconsider from scratch.

**Example: The Contact Lens Case** (from Section 4 notes)

Klein's wife loses contact lens Friday night. They search dining room and bathroom. Nothing. Klein concludes lens is gone (crushed or lost). But reviewing the timeline, Klein realizes:
- Wife removed lenses Friday night
- After meal, wife rolled up tablecloth to trap crumbs
- Carried tablecloth to hamper for next wash day
- Saturday morning, put out fresh (blue) tablecloth
- They searched under clean (blue) tablecloth

**Memory compartmentalization error**: They knew Friday's tablecloth was in hamper. They knew lens was removed Friday night. But they couldn't connect these facts—they were in different memory contexts.

**Solution**: Snap-back. Klein mentally simulated the sequence from scratch: "What actually happened Friday night?" Lens was on Friday's (yellow) tablecloth, now in the hamper.

## Mental Simulation in Organizations and Teams

Mental simulation isn't just individual cognition—it's a team skill.

**Example: Apollo 13**

Klein coded 73 problem-solving episodes during the Apollo 13 crisis. **Forecasting** (a form of mental simulation) appeared in 15 episodes and was critical:
- Oxygen depletion forecast → triggered goal revision (abort mission, focus on survival)
- Trajectory deviation forecast → detected new problem (off-course)

Mental simulation enabled the team to:
- **Diagnose** causes of oxygen loss
- **Generate expectancies** about how long systems would last
- **Evaluate** improvised solutions (like using LEM as lifeboat)
- **Forecast** whether crew could survive with available resources

**Example: The Polish Economy (1990 Reform)**

Andrzej Bloch, Polish economist, mentally simulated the consequences of switching from socialism to market economy (January 1, 1990). He reduced the problem to **3 variables**:
- Inflation rate
- Unemployment rate
- Foreign exchange rate

**Predicted sequence**:
1. Inflation zooms from 80% annually to ~1000% (80% monthly) for a few months
2. Prices rise faster than wages → demand falls → prices stabilize (~3 months)
3. Risk: Food shortages (traditional unrest trigger), but Solidarity euphoria mitigates
4. Unemployment: Gov't drops unproductive industries → 6-month delay → rise to ~10% from <1%
5. Foreign exchange: Acts as balancing force; as rate worsens, Polish goods become bargain → exports boom
6. Expected: 700 zloty/$ → 1400 zloty/$

**Actual outcomes**:
- Inflation: 1000% Jan-Feb, down to 20-25% by April ✓
- Unemployment: Rose slower than expected (government less ruthless)
- Exchange rate: Only reached 900/$ (Andrzej too pessimistic)

**Overall success**: 60% accuracy (Andrzej's own estimate)

**Contrast with non-experts**:
- Andrzej's best student: Considered only 2 variables (inflation, unemployment); no balancing force; didn't know current rates; optimistic prediction
- Political science professor: Same 2 variables; Marxist perspective; thought market experiment would fail

Klein's lesson: **"Without a sufficient amount of expertise and background knowledge, it may be difficult or impossible to build a mental simulation."**

The expert's mental simulation included:
- **Causal mechanisms** (price-wage spiral, supply-demand dynamics, export competitiveness)
- **Feedback loops** (exchange rate as balancing force)
- **Timeline estimates** (3 months for inflation, 6 months for unemployment)
- **Risk assessment** (food shortage potential, political stability)

## Implications for Intelligent Agent Systems

### Design Principle 1: Implement Constrained Mental Simulation

Don't build agents that exhaustively explore all possible futures. Instead:

1. **Identify 3 key state variables** for the current problem
2. **Simulate 6 transitions forward**
3. **Look for failure modes**: Does the simulation end in an unsafe state? Are constraints violated? Are goals unmet?
4. **Refine or reject** the plan based on simulation

If the problem requires more than 3 variables or 6 transitions, **decompose it hierarchically**:
- High-level simulation: 3 strategic variables, 6 major phases
- Each phase: 3 tactical variables, 6 steps
- Each step: 3 operational variables, 6 actions

### Design Principle 2: Generate Expectancies and Flag Violations

Agents should:
1. **Recognize situation type** (pattern matching)
2. **Generate expectancies** for that situation type (what should happen next)
3. **Monitor for violations** (what didn't happen that should have, what happened that shouldn't)
4. **Escalate** when expectancies are violated

**Implementation**: Maintain a library of situation types with associated expectancies:
- **Situation**: Database query for user records
- **Expectancy 1**: Return within 100ms
- **Expectancy 2**: Return 1-1000 rows
- **Expectancy 3**: No null values in critical fields

If any expectancy is violated, flag it as an anomaly requiring investigation.

### Design Principle 3: Detect and Counter De Minimus Errors

Agents can fall into the same trap as humans: explaining away individual anomalies without recognizing their conjunction as diagnostic.

**Counter-measures**:
1. **Track anomaly count**: How many expectancies have been violated?
2. **Conjunction detection**: Are multiple anomalies co-occurring?
3. **Snap-back trigger**: After 3+ anomalies, force re-evaluation of entire mental model
4. **Crystal ball exercise**: "Assume your current diagnosis is wrong. What alternative explanations fit the evidence?"

**Example**: System diagnosing slow web service
- Anomaly 1: Response time 2x normal → Explained: "Temporary network congestion"
- Anomaly 2: Error rate up 10% → Explained: "Bad client retry logic"
- Anomaly 3: Memory usage rising → Explained: "Garbage collection backlog"

**Snap-back trigger**: Three anomalies. Re-evaluate. Alternative diagnosis: **Memory leak causing GC churn causing slow responses causing client retries cascading into errors.** Single root cause, not three independent issues.

### Design Principle 4: Use Mental Simulation for Evaluation, Not Just Planning

Mental simulation isn't just for generating plans—it's for **testing them**:

**Before execution**:
- Simulate the plan forward
- Look for failure modes
- Identify decision points where things could go wrong
- Pre-position fallback options

**During execution**:
- Monitor expectancies
- Compare actual state transitions to simulated ones
- If reality diverges from simulation, update the model

**After execution**:
- Review where simulation was accurate vs. inaccurate
- Update the simulation model based on actual outcomes
- This is how expertise improves over time

### Design Principle 5: Match Simulation Fidelity to Stakes and Time

Not all problems deserve deep mental simulation:

**Low stakes, time-critical**: Shallow simulation (2-3 transitions, rough check)
**High stakes, adequate time**: Deep simulation (6 transitions, detailed failure analysis, alternative scenarios)
**Medium stakes, medium time**: Standard simulation (4-5 transitions, key failure modes)

Agents should dynamically adjust simulation depth based on problem characteristics.

## The Irreplaceable Contribution: Mental Simulation as Cognitive Technology

Before Klein's work, mental simulation was treated as informal, unreliable thinking—something to be replaced by formal analysis whenever possible.

Klein showed that mental simulation is:
- **Systematic**: Has predictable constraints and failure modes
- **Powerful**: Enables evaluation without exhaustive comparison
- **Trainable**: Can be improved through techniques like premortem and snap-back
- **Essential**: In time-critical, uncertain environments, it's often the only option

The evidence is overwhelming:
- Experts use mental simulation routinely in high-stakes decisions
- Mental simulation enables diagnosis, expectancy generation, and evaluation
- The 3-variable, 6-transition constraint isn't a bug—it's a feature that forces good abstraction

For intelligent systems, this is transformative. We don't need to build agents that exhaustively explore possibility spaces. We need to build agents that:
1. Recognize situations as types
2. Generate typical responses
3. Mentally simulate those responses to check for problems
4. Refine and execute

That's the power of mental simulation. That's what Klein made irreplaceable.