# Expert Models as Engineering Blueprints: How Exceptional Performance Specifies System Requirements

## The Landmine Detection Insight

Among the case studies in Militello et al. (2009), the landmine detection project contains what may be the most transferable insight for agent system design. It begins with a simple observation that contains enormous leverage:

When standard-issue mine detection equipment was tested, US soldiers' performance was "substandard" — detection rates for low metal content mines were "dangerously low." But within this population of poor performers, a subset of operators achieved detection rates *over 90%*.

Cognitive scientist Staszewski drew the inference that made this tractable: "Although performance was generally poor with the newer low metal content mine detection equipment, a few operators had detection rates over 90%... Staszewski hypothesized that improved training incorporating CSE principles could be used to close the performance gap." (p. 7)

The existence of expert performers within a domain means that high performance is *achievable* with the available equipment and constraints. The question becomes: what is different about how experts think, perceive, and decide — and can that difference be transferred?

The approach was to build "a model of expert perception and reasoning" that was then "used as a basis for improved training." The training design was explicitly structured around the expert model:

- Training content and organization were driven by the expert model
- Detection rate was the primary measure (aligning training evaluation with the actual goal)
- Instruction was organized hierarchically, using the expert's goal structure
- Training began with part-tasks and evolved into integrated subskills
- Practice and feedback were provided for each drill

The results: detection rates improved from dangerously low baselines to 94% (existing device) and 97-100% (device under development). The US Army adopted the training program and distributed it with new equipment as an integrated package.

The crucial point: **the expert's cognitive model was not merely interesting — it was an engineering specification.** It specified what the training system needed to produce in the minds of trainees. Everything else flowed from that specification.

## What Expert Models Contain That Novice Models Don't

The CSE tradition — particularly the Decision-Centered Design framework, which grew from Klein's Recognition-Primed Decision (RPD) model — has developed detailed understanding of what distinguishes expert from novice cognition. This understanding is directly applicable to agent system design.

### Cue-Goal Linkages

Experts notice different things than novices. More precisely, experts have learned which *cues* (observable features of a situation) are reliably connected to which *goals* (objectives worth pursuing) and *threats* (outcomes worth avoiding). A landmine detection expert perceives soil disturbance patterns, vegetation anomalies, and surface irregularities that a novice's attention passes over entirely.

This is not a difference in raw perception — the expert's retina receives the same photons. It is a difference in *attention organization*: the expert's perceptual system is tuned by experience to sample the environment in goal-directed ways.

For agent systems: **skill selection and routing should be informed by cue-goal linkages extracted from expert performance**. If analysis of high-performing agents reveals that certain context signatures reliably predict which skills will be needed, this pattern should be encoded into the orchestration routing logic — not left to be discovered by each task execution independently.

### Pattern Libraries

Experts recognize situations as instances of patterns they have encountered before, enabling rapid diagnosis and response without exhaustive analysis. Klein's RPD model describes how firefighters, military commanders, chess players, and other experts identify the "first workable option" through recognition rather than comparison of alternatives.

This pattern library is built through experience, but it can be partially transferred through systematic exposure to curated cases — which is exactly what the landmine detection training did by using "part-tasks that evolved into integrated subskills."

For agent systems: **build case libraries that expose agents to the characteristic patterns of hard problems in their domain**. Don't just train on average cases — curate the hard cases, the edge cases, and the cases where naive approaches fail. This is the agent equivalent of the deliberate practice literature.

### Hierarchical Goal Structures

One of the most important elements of the landmine detection training design was that "instruction and tasks were organized hierarchically, using the expert's goal structure." Experts don't just know more — they organize what they know differently. Their knowledge is structured around goals at multiple levels of abstraction, and they navigate between these levels fluidly as they work.

A novice approaches a task as a sequence of actions. An expert approaches it as a hierarchy of goals with multiple possible action paths to achieve each goal. The expert's flexibility and adaptability come from this hierarchical goal structure — when one path is blocked, the expert can generate alternatives because they understand *what they are trying to achieve*, not just *how they were planning to achieve it*.

For agent systems: **task decomposition should expose the goal hierarchy, not just the action sequence**. Sub-agents need to know not only what they are supposed to do, but *why* — what higher-level goal their action serves, and what success looks like from the perspective of that goal. This enables adaptive re-planning when initial approaches fail.

### Uncertainty Calibration

Expert performers have well-calibrated uncertainty — they know what they know and what they don't, which prevents both overconfidence (committing to incorrect assessments) and under-confidence (failing to act on reliable cues). Novices tend toward miscalibration in both directions.

Critically, experts have learned *which aspects of a situation reliably predict outcomes* and which are noise. This discrimination — knowing which cues to trust — is often the most cognitively complex element of expert performance and the hardest to transfer.

## The Critical Decision Method: Eliciting the Invisible

The primary method CSE uses to extract expert models is the **Critical Decision Method (CDM)**, developed within the Decision-Centered Design framework. The CDM involves:

1. Asking experts to recall specific incidents where their judgment mattered — particularly hard cases, near-misses, and situations where novices would have failed
2. Probing these incidents in depth: What cues were you noticing? What were you thinking about doing? What options did you consider and reject? What were you trying to achieve?
3. Identifying the *cognitive events* — the moments of recognition, decision, and action — within the narrative

The CDM surfaces tacit knowledge that experts cannot easily articulate directly. Experts often say "I just knew" or "it felt wrong" — the CDM provides structured probes that decompose these intuitive judgments into observable cues, pattern recognition, and goal assessment.

The resulting model is not the expert's verbal account of their process (which is often inaccurate) — it is a reconstruction of the cognitive structure that underlies expert performance, built by analyzing many incidents from many angles.

## Application to AI Agent Systems

### Skill Design from Performance Analysis

For each domain-specific skill in an agent system, the expert model principle suggests:

1. **Identify exceptional cases**: Find instances where the skill (or a human performing the analogous function) produced exceptional results. Don't average across all cases — exceptional performance is the specification.

2. **Analyze the cognitive events**: What information was used? What alternatives were considered? What constraints were recognized? What patterns were matched? What made the hard cases hard?

3. **Build that structure into the skill**: Don't just train on average cases. Expose the skill to the hard cases, the edge cases, and the cases where naive approaches fail. Use the expert model to design the training curriculum.

4. **Evaluate against the expert standard**: Use detection rate (or its equivalent) as the performance measure — not a proxy metric that can be gamed without improving actual performance.

### The Gap Between Formal Specs and Expert Knowledge

The landmine detection case reveals a fundamental gap that appears throughout CSE work: **formal task descriptions capture procedures, not expertise**. The formal procedure for mine detection describes how to operate the equipment. Expert performance adds layers of perceptual attention, situational pattern recognition, and uncertainty management that are not in any manual.

This gap between formal specification and expert knowledge appears in agent systems as the gap between:
- **The prompt/task specification** and the **implicit domain knowledge** needed to execute it well
- **The skill's described function** and the **tacit conditions** under which that function produces reliable results
- **The explicit evaluation metric** and the **actual quality criterion** that distinguishes good outputs from bad

Closing this gap requires explicitly eliciting and representing the tacit knowledge — through something analogous to CDM, but applied to agent performance analysis.

### Models of Expertise for Agent Routing

When a complex task arrives, the most efficient routing decision is the one an expert orchestrator would make — one informed by pattern recognition across many prior cases. If we can build models of expert routing decisions (what made the expert choose skill X for situation Y?), we can encode that expertise into the routing logic rather than requiring every routing decision to be made from first principles.

This is the agent-system equivalent of the landmine detection training: rather than letting each orchestrating agent build routing intuition from scratch through trial and error, extract the routing patterns from analysis of high-performing instances and encode them into the system's priors.

### The Performance Gap as Opportunity Signal

Finally, the most actionable insight from the landmine detection case is the *performance gap as opportunity signal*. When you observe large variance in performance across agents or across task instances — when some executions achieve exceptional outcomes and others fail — this variance is not noise to be averaged away. It is a signal that there is structure to be discovered.

The question to ask: What is different about the high-performing cases? What cues did they attend to? What decision paths did they take? What constraints did they recognize? The answers specify what the system needs to learn.