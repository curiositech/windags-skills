# The Knowledge Elicitation Problem: Why Experts Can't Just Tell You What They Know

## The Fundamental Difficulty

There is a pervasive and costly assumption embedded in many attempts to build intelligent systems: that domain expertise can be captured by asking experts to describe what they do and encoding their answers. This assumption underlies early expert systems development, many training program designs, and most workflow documentation efforts.

The cognitive systems engineering research community, through decades of careful fieldwork, has demonstrated that this assumption is wrong in a way that is both subtle and consequential. The problem is not that experts are uncooperative or inarticulate. The problem is structural: **a significant portion of expert knowledge is tacit — it is enacted in practice but cannot be directly retrieved through introspection and self-report**.

Hoffman, Crandall, and Shadbolt (1998) document this in detail in their analysis of knowledge elicitation methodology. The core finding: when you ask experts to describe their decision-making process, they produce accounts that are systematically incomplete — not because they are withholding, but because they genuinely do not have introspective access to the most important parts of their own expertise.

What experts cannot easily report includes:
- The specific cues they attend to that trigger recognition of a situation type
- The expectations they form automatically upon situation recognition (and therefore what surprises them)
- The micro-adjustments they make in real-time during skilled performance
- The alternatives they implicitly ruled out before settling on their approach
- The "feel" of a situation that something is wrong before any specific anomaly is identifiable

What they *can* report — and will readily produce when asked — are the explicit, articulable aspects of their knowledge: the rules they consciously follow, the procedures they were trained in, the general principles they can state. These are real and useful, but they are not the most powerful parts of expertise.

## The Two Gaps

Understanding the knowledge elicitation problem requires distinguishing two related but different gaps:

**Gap 1: Knowing-Doing (Declarative-Procedural)**
People know things they cannot do. You can read every book on bicycle riding and still fall off when you first mount a bicycle. Declarative knowledge ("the bike tips left, lean right") does not automatically translate to procedural competence. This gap is widely recognized.

**Gap 2: Doing-Saying (Tacit-Explicit)**
People do things they cannot fully articulate. The expert bicycle rider cannot provide complete instructions that would allow a novice to ride — not because riding is mysterious, but because the relevant knowledge is encoded in motor programs and perceptual calibrations that are below the level of conscious access. This gap is less widely appreciated, and it is at least as important.

The second gap is what makes naive knowledge elicitation fail. When you ask the expert fire commander "how did you decide to evacuate that building?", you get an account of the decision that was constructed after the fact, filtered through the expert's theories about their own decision-making, and inevitably incomplete with respect to the cue recognition and tacit assessment that actually drove the decision. The account is not fabricated — it is the expert's honest attempt at introspection. But introspection is a lossy channel for capturing tacit knowledge.

## What Works: Methods That Circumvent Introspective Limits

The critical insight from cognitive task analysis research is that you can often elicit tacit knowledge *indirectly* — not by asking experts to describe their knowledge, but by constructing situations that *force the knowledge to manifest* in ways that can be observed and analyzed.

Hoffman and colleagues developed and analyzed a range of such methods. Among the most powerful:

**The Critical Decision Method (CDM)**: Instead of asking experts to describe their general approach, you ask them to recall specific challenging cases — incidents where something was difficult, unexpected, or where things could easily have gone wrong. Then you probe that specific case with structured questions: "What were you seeing at that point? What were you thinking about? What did you expect to happen next? Why did you do X rather than Y? Was there a moment when you knew it was going to be okay?" The specific incident serves as a scaffold that gives the expert's tacit knowledge something to attach to. The CDM reliably elicits more specific, cue-level knowledge than general "tell me how you do your job" interviews.

**Think-Aloud Protocols**: Having experts perform their actual work while simultaneously verbalizing their thinking. This captures real-time reasoning in a way that retrospective accounts cannot. The limitation is that verbalization itself disrupts performance for highly skilled, automated processes — the expert who thinks aloud while doing something highly skilled often performs worse, because the verbalization interferes with the automatic processes being studied.

**Structured Observation with Probing**: Observing expert performance and noting specific moments to probe later: "I noticed that at minute 3:47 you paused and looked at the upper left of the display before continuing. What were you looking at? What were you thinking?" This focuses the retrospective account on specific moments where tacit knowledge was likely operating.

**Comparative Case Analysis**: Presenting experts with pairs of cases that differ in one key feature and asking them to articulate the difference in their response. The comparison forces explication of distinctions that would remain implicit in single-case description.

**Simulation-Based Probing**: Presenting experts with simulated scenarios and asking not "what would you do?" but "what's wrong with this picture?" — exploiting the expert's automatic anomaly detection to surface the expectations and patterns they use without being able to directly report them.

## Implications for Agent Systems

### Skill Design Cannot Be Based on Self-Report

If you are building a specialized agent capability (a "skill") by encoding expert knowledge, you cannot rely solely on what experts say they do. You need methods that surface what they actually do — and the gap between these two is often where the most valuable knowledge lives.

This means:
- **Analyze cases, not principles**: Encode knowledge from specific solved problems, including the cues that triggered different approaches and the expectations that were confirmed or violated
- **Include anomaly cases**: The cases where something seemed wrong before it was identifiable, or where the expert reversed course midway, contain more tacit knowledge than the smoothly executed routine cases
- **Document non-decisions**: What did the expert consider and reject? The implicitly ruled-out options reveal the situational distinctions the expert makes but cannot easily articulate

### The Context Window Is Not Enough

A common assumption in LLM-based agent design is that providing the model with sufficient context ("here is the task, here is the relevant documentation, here are examples") will produce expert-level performance. The knowledge elicitation literature suggests this is insufficient.

The most powerful expert knowledge is not in the documentation — it was never written down because it couldn't be easily articulated. It lives in the patterns of cases, in the anomalies, in the "feel" of situations that something is off. To the extent that language models can capture this knowledge, it is because they were trained on *behavior traces* (code that was actually written, text that was actually produced) not on *descriptions of how to produce the behavior*.

This means that agent systems should prefer **few-shot examples drawn from actual expert performance** over **verbal descriptions of expert knowledge** as the primary mechanism for transmitting expertise.

### Build in Uncertainty About Own Knowledge

Expert systems and agent systems alike tend to project confidence that their outputs are correct. The knowledge elicitation literature warns that the most dangerous errors often occur at the boundary of tacit and explicit knowledge — where the system confidently applies a rule to a situation that the rule was not designed for, because the tacit knowledge that would flag the mismatch has not been encoded.

Agent systems should therefore have explicit mechanisms for:
- Flagging when a situation has features not well-covered by training cases
- Distinguishing between "I can produce an answer" and "I have reliable knowledge for this type of problem"
- Seeking confirmation from other agents or from humans when tacit-knowledge-dependent judgments are required

### Knowledge Preservation Is a Specialized Function

Hoffman and colleagues (1998) note that knowledge elicitation and preservation is itself a skilled activity, not simply a matter of documentation. Organizations routinely lose critical knowledge when experienced practitioners retire, because the tacit knowledge that made them effective was never systematically captured.

For agent systems, this implies that maintaining and improving skill representations is an ongoing, methodologically demanding process — not a one-time engineering task. There should be explicit feedback mechanisms that capture cases where agent performance was surprisingly good or surprisingly poor, and processes for analyzing those cases to update the underlying skill representations.

## Boundary Conditions

The tacit knowledge problem is most severe for:
- Skills that are highly practiced and automated
- Perceptual and diagnostic skills (pattern recognition from sensory data)
- Skills developed through experience with unusual cases rather than formal training
- Skills in domains where the vocabulary for describing fine distinctions is underdeveloped

It is less severe for:
- Knowledge that was originally taught through explicit instruction and remains consciously accessible
- Procedural knowledge for genuinely routine, invariant tasks
- Mathematical and logical reasoning, where the steps can be fully articulated
- Knowledge of principles rather than knowledge of specific situational patterns

The implication is not that all knowledge is tacit — it is that knowledge elicitation must use multiple methods, calibrated to the type of knowledge being sought, and must include methods that bypass introspective limits for the tacit portions.

## The Organizational Dimension

Hutchins (1995) adds a dimension that individual-focused knowledge elicitation often misses: much expert knowledge is *distributed across the social and material system*, not stored in any individual head. The knowledge of how to navigate a ship safely is not in any one navigator's head — it is distributed across the crew, the instruments, the charts, the communication protocols, and the physical arrangement of the bridge. When any of these components is changed (new instruments, crew rotation, updated charts), the system's effective knowledge changes in ways that cannot be captured by interviewing any individual.

For agent systems working in coordination, this means: the expertise of the multi-agent system as a whole may exceed or differ from the expertise of any individual agent, and characterizing the system's knowledge requires analyzing the *coordination patterns* and *shared representations*, not just the individual agent capabilities. This is a frontier that most current agent system design has not yet adequately addressed.