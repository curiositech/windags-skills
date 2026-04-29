# Expertise, Tacit Knowledge, and the Recognition-Primed Decision Model

## The Expert Problem

Experts are the gold standard for cognitive performance in complex domains. When we want to know how to detect landmines effectively, or how to manage a nuclear plant emergency, or how to coordinate weather and flight information for airlift missions, we look at what experts do. But experts are famously poor at explaining what they do. Expertise is characterized by fluency — actions that have been performed thousands of times become automatic, and the cognitive processes underlying them become inaccessible to conscious reflection and verbal report.

This creates a fundamental design problem. The knowledge that most needs to be understood and supported — the expert knowledge that separates excellent performance from adequate performance — is the knowledge least available through conventional inquiry methods. Ask an expert what they do, and they will give you a simplified, proceduralized account that describes the surface of their performance while leaving the cognitive substance invisible.

Gary Klein (one of the paper's four authors, and the founder of the Naturalistic Decision Making field) developed the Recognition-Primed Decision (RPD) model specifically to characterize how experts actually make decisions under real-world conditions of time pressure, uncertainty, and high stakes. The paper references this model implicitly throughout, and the methodologies described — particularly the Critical Decision Method — were developed to make expert knowledge accessible for design purposes.

## What the RPD Model Reveals

The RPD model was developed following research conducted after the 1988 shoot-down of Iran Air Flight 655 by the USS Vincennes. The Tactical Decision Making Under Stress (TADMUS) program "better understand how such an incident had occurred and how to avoid similar incidents in the future." The research revealed that expert decision-making under stress does not look like classical decision theory predicts.

Classical decision theory assumes that decision-makers:
1. Identify all relevant options
2. Evaluate each option against relevant criteria
3. Select the option with the highest expected utility

Expert decision-makers under time pressure do not do this. Instead, they:
1. Recognize the current situation as an instance of a familiar type
2. Access a pattern-matched response associated with that situation type
3. Mentally simulate the response to check for obvious problems
4. If the simulation succeeds, execute the response; if not, modify it or try another

This is recognition-primed decision-making: the expert's primary cognitive work is *recognition*, not *comparison*. The question is not "which option is best?" but "what kind of situation is this, and what does this kind of situation call for?"

The implications are profound. Expertise resides primarily in a rich library of situation-type patterns, developed through extensive experience, that allows rapid and accurate recognition and appropriate response. The expert does not reason from first principles every time — they pattern-match to accumulated knowledge, then verify and adjust.

## Why This Matters for System Design

The RPD model has several critical implications for how systems should be designed to support expert work:

**Support recognition, not just analysis.** If experts primarily work through recognition, then decision support systems that present options for comparative analysis are misaligned with how expertise actually works. What experts need is systems that enhance their ability to recognize situation types accurately — systems that provide the right cues at the right time to support pattern matching, not systems that perform the pattern-matching work on behalf of experts and present a ranked list of options.

**Cues are the critical information.** Pattern recognition is triggered by cues — specific features of the situation that indicate what type of situation it is. Experts have developed finely tuned perceptual discrimination: they attend to specific cues that novices either don't notice or don't know to prioritize. Design for expert cognition means identifying which cues matter, ensuring those cues are salient, and not obscuring them with information that is less relevant.

**Mental simulation is part of the decision process.** Experts don't just recognize situations — they mentally simulate proposed responses to check for problems. Design can support this by providing information that enables better mental simulation: what are the likely consequences of this action? What could go wrong? What does the system's current state suggest about how this action will play out?

**Experts are often unaware of their own expertise.** This is the critical methodological problem. The knowledge that drives expert recognition is tacit — it is not verbally available, it does not appear in procedure manuals, and it cannot be elicited by asking experts to describe their decision process. The Critical Decision Method addresses this by:
- Eliciting specific past incidents (especially challenging or unusual ones)
- Working through those incidents in detail, asking about cues, options, and reasoning
- Probing for what made the situation seem like a particular type
- Identifying moments where expertise was most engaged

The landmine detection case illustrates this methodology and its payoff: "Staszewski [2004], a cognitive scientist with a background in expertise studies, noted that although performance was generally poor with the newer low metal content mine detection equipment, a few operators had detection rates over 90%. Armed with the knowledge that some had developed expertise using the new equipment, Staszewski hypothesized that improved training incorporating CSE principles could be used to close the performance gap." The path to closing the gap was analyzing expert performance and building training around the cognitive model of high performers — using expert knowledge to bootstrap novice development.

## Expert Models as Design Blueprints

The paper describes a general principle that Staszewski made explicit: "Models of expertise as blueprints for cognitive engineering." If you can construct an accurate model of how experts perceive, reason, and decide in a domain, you have a blueprint for what any system that supports work in that domain must provide.

This principle grounds the training design in the landmine case:
- "Training content and organization were driven by the expert model."
- "Instruction and tasks were organized hierarchically, using the expert's goal structure."
- "Instruction and training began with part-tasks and evolved into integrated subskills."

The expert model is not just descriptive — it is prescriptive for design. It tells you what cognitive capacities must be supported, what the hierarchy of goals looks like, and what the sequence of skill development should be.

The same logic applies beyond training to tool design: if experts primarily attend to certain cues to recognize situation types, the display should make those cues prominent. If experts use mental simulation to evaluate potential actions, the system should provide information that supports accurate simulation. If expert judgment integrates information across multiple sources in specific ways, the information architecture should facilitate that integration.

## The Gap Between Knowing and Doing

The paper touches on what is perhaps the deepest problem in cognitive systems engineering: the gap between knowing that expertise exists and actually capturing it for design purposes. This is not merely a methodological challenge — it reflects something fundamental about the nature of tacit knowledge.

Polanyi's formulation (referenced implicitly throughout CSE literature) is that "we know more than we can tell." Expert practitioners have genuine knowledge — they consistently perform at levels that cannot be explained by chance — but that knowledge is embedded in patterns of perception and action that resist verbal articulation. An expert landmine detector cannot tell you exactly what combinations of signals led them to flag a particular location; they just know. An experienced emergency room nurse cannot fully explain why they had a bad feeling about a patient who looked fine — they just had it, and they were right.

Forcing this knowledge into verbal form produces distorted accounts — typically accounts that describe the official procedure rather than the actual cognitive process, or that describe the last instance recalled rather than the general pattern, or that substitute plausible rationalization for actual reasoning.

The Critical Decision Method is designed to work around this distortion by:
1. Focusing on specific incidents rather than general descriptions
2. Working through incidents retrospectively with prompts designed to surface cues and reasoning
3. Using multiple incidents to identify patterns that transcend individual cases
4. Checking reconstructed accounts against behavior observed in other cases

For AI agent system design, the implication is: never rely solely on documented procedures or stated requirements to define what an agent skill should do. The documented procedure captures the official model of the work, not the cognitive reality. The actual cognitive requirements — the cues, the recognition patterns, the judgment calls, the mental simulation steps — are embedded in expert practice and must be surfaced through deliberate investigation.

## What Makes Expertise Transferable (and What Doesn't)

The paper's case studies suggest that expertise is most effectively transferred when:
- The transfer targets specific cognitive skills (recognition patterns, cue weighting) rather than general knowledge
- Training is organized around the goal structure of expert performance
- Part-tasks are practiced before integration (building toward the expert's coherent pattern)
- Ample practice with feedback closes the gap between novice pattern recognition and expert pattern recognition

What does *not* transfer expertise:
- Descriptions of procedures that don't include the perceptual and cognitive substrate
- Training on nominal cases when expertise is primarily exercised in unusual ones
- Knowledge representation that captures what experts know declaratively but not how they apply it situationally
- Performance metrics that measure outputs (task completion) without probing the cognitive processes that produced them

For AI agents that aspire to expert-level performance: the design challenge is not building a repository of domain facts but building systems that capture and apply the recognition patterns, cue weightings, and situational judgment of expert practitioners. Retrieval-augmented systems that surface relevant facts are not enough — what is needed is the cognitive architecture that tells you which facts are relevant in which situations and what to do with them.

## Connecting to WinDAGs Skill Design

For a 180+ skill ecosystem:

**Each skill should be grounded in a model of expert cognitive performance in the relevant task domain.** Not just: "what does this task require?" but "how do expert practitioners actually approach this task, what cues do they use, what recognition patterns are most important, where does novice performance fail relative to expert performance?"

**Skills should be designed to support the recognition-evaluation cycle, not replace it.** The goal is not to automate expert judgment but to provide the information substrate that enables accurate recognition and effective evaluation.

**Skill failures should be analyzed in terms of the expert cognitive model.** When a skill fails, the diagnostic question is: where in the recognition-primed decision cycle did the failure occur? Was it a failure of situation recognition (wrong pattern match)? A failure of cue detection (right pattern, wrong cues attended to)? A failure of mental simulation (correct action but consequences not adequately anticipated)? Each failure type implies a different design response.

**Cross-skill coordination should be designed around cognitive information needs.** When one skill's output feeds another skill's input, the question is: what does the receiving skill need to recognize the situation it's facing and act appropriately? The output format and content should be designed to answer that question.