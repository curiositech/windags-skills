# Extracting Expertise Through Structured Probes: The Knowledge Audit Approach

## The Central Challenge

Expert knowledge is largely tacit, built through years of pattern recognition and situated problem-solving. When asked to explain their expertise, experts typically respond with procedures ("I check the readings") or vague generalities ("You develop a feel for it"). The Knowledge Audit addresses this through a systematic framework for probing different dimensions of expertise, grounded in decades of cognitive research but simplified for practitioner use.

## The Six Fundamental Dimensions of Expertise

The ACTA framework identifies six cognitive capabilities that distinguish expert from novice performance across domains:

**Perceptual Skills** - Experts detect cues and patterns that novices cannot see. A fireground commander notices "the color and movement of smoke" providing instant information about fire location, intensity, and building structural integrity. An electronic warfare supervisor hears subtle differences in radar signal characteristics. These aren't learned as facts—they're learned through exposure to hundreds of variations until patterns become salient.

The probe: "Have you had experiences where part of a situation just 'popped' out at you; where you noticed things going on that others didn't catch?"

**Past and Future (Mental Simulation)** - Experts can "story-build"—reconstructing how a situation arose and projecting how it will evolve. This enables proactive intervention before problems develop. A commander arriving mid-incident can reconstruct the fire's progression from damage patterns and current conditions, then anticipate structural collapse before visual warning signs appear.

The probe: "Is there a time when you walked into the middle of a situation and knew exactly how things got there and where it was headed?"

**Big Picture (Situation Awareness)** - Novices focus on individual elements. Experts simultaneously track multiple interrelated factors and understand how they interact. The fireground commander maintains awareness of water supply, building type, occupancy status, weather conditions, crew locations, and changing fire behavior—integrating these into a coherent assessment that guides all decisions.

The probe: "Can you give me an example of what is important about the Big Picture for this task? What are the major elements you have to know and keep track of?"

**Tricks of the Trade (Efficient Heuristics)** - Experts develop shortcuts that aren't taught formally but emerge from experience. These aren't corner-cutting—they're optimizations that accomplish more with less. A mechanic develops a diagnostic sequence that eliminates 80% of possible causes with three quick checks. An EW operator develops a verification routine that catches equipment errors.

The probe: "When you do this task, are there ways of working smart or accomplishing more with less that you have found especially useful?"

**Opportunities and Improvising** - Experts recognize when standard procedures won't work and when situations offer opportunities beyond the standard playbook. They're comfortable adapting based on situational specifics rather than rigidly following protocols.

The probe: "Can you think of an example when you have improvised in this task or noticed an opportunity to do something better?"

**Self-Monitoring and Adjustment** - Experts notice when their own performance is degrading (fatigue, stress, distraction) and adjust accordingly. They also catch their own errors before they cascade into larger problems.

The probe: "Can you think of a time when you realized that you would need to change the way you were performing in order to get the job done?"

## The Three-Column Structure

For each expertise dimension, the Knowledge Audit elicits three types of information:

1. **Example** - A specific incident where this aspect of expertise was critical
2. **Why Difficult** - What makes this hard for less experienced personnel
3. **Cues and Strategies** - What information the expert attends to and how they use it

This structure forces concreteness (the example), surfaces the novice-expert gap (why difficult), and makes expertise portable (cues and strategies can be taught).

## Application to Agent System Design

### For Intelligent Routing Systems

When designing systems that route complex problems to appropriate specialists, the Knowledge Audit framework reveals:

- **What cues** indicate problem complexity level (perceptual skills dimension)
- **What context** must be preserved when escalating (big picture dimension)
- **What rapid checks** can eliminate 80% of false paths (tricks of trade dimension)

A routing agent that only knows "if problem type X, route to specialist Y" misses the expertise of pattern recognition: "This *looks like* X but has three indicators that it's actually a subtle variant requiring different handling."

### For Decomposition Systems

Task decomposition by intelligent agents often fails because it doesn't capture the "why difficult" and "cues/strategies" dimensions. Decomposing a task into subtasks (what ACTA's Task Diagram does at surface level) is necessary but insufficient.

The Knowledge Audit reveals:
- Which subtasks require expertise vs. which are procedural
- What makes expert subtask execution different from novice execution
- What cues trigger transitions between subtasks or modifications to the plan

An agent system decomposing "diagnose network failure" needs to know that "check log files" is different for an expert (who knows what patterns signal specific failure modes) versus a novice (who reads logs linearly).

### For Training Simulators and Synthetic Scenarios

The simulation interview provides the structure for what makes a scenario "challenging" rather than merely complicated. Graduate students with no domain experience, after learning ACTA, generated training materials rated by domain experts as 70%+ important and 90%+ accurate.

For agent systems that generate training scenarios or test cases:
- **Past/Future probes** reveal what temporal reasoning the scenario must test
- **Big picture probes** identify what elements must be present simultaneously
- **Potential errors** (from simulation interview) define what the scenario should surface

### For Human-AI Collaboration Interfaces

The "Equipment Difficulties" optional probe ("Have there been times when the equipment pointed in one direction, but your own judgment told you to do something else?") directly addresses AI system design.

Experts don't blindly trust instruments or automation. The Knowledge Audit surfaces:
- When experts override system recommendations
- What cues they use to assess system reliability in-context
- How they verify or doubt automated outputs

This is critical for designing AI systems that will be adopted: the system must surface information that supports expert skepticism rather than demanding blind trust.

## Boundary Conditions

**When This Approach Fails:**

1. **Truly novel domains** - If genuine experts don't exist (new technology, unprecedented situations), there's no expertise to extract

2. **Purely procedural tasks** - If expert and novice performance is identical when following procedures, cognitive task analysis adds no value

3. **Individual difference domains** - If the "right answer" varies by expert with no reconcilable differences (purely subjective judgment), the framework reveals disagreement but can't resolve it

4. **Tacit-perceptual extremes** - Some expertise (wine tasting, art authentication) may be so perceptual that experts cannot articulate cues even with structured probing

**When Alternative Approaches Are Better:**

- **Team coordination tasks** - ACTA was designed for individual expertise. Team Cognitive Task Analysis requires different methods (information flow analysis, shared mental models)

- **Detailed mental model mapping** - If you need comprehensive causal models of expert reasoning (for building expert systems), more intensive methods like conceptual graph analysis are warranted

- **Real-time protocol analysis** - If you need moment-by-moment reasoning during task execution, think-aloud protocols provide different data

## Implementation Insights

The evaluation study revealed that successful knowledge elicitation depends on:

1. **Understanding what you're looking for** - Interviewers who understood expertise dimensions (from the introductory material on cognition) were dramatically more effective than those who just learned the probes

2. **Following expert tangents purposefully** - The probes provide structure, but experts often reveal critical information through stories that don't directly answer the question. Skilled interviewers recognized valuable tangents.

3. **Pushing past surface responses** - First responses are often procedural. The interviewer must probe: "What makes that tricky?" "How would you know?" "What would trip up someone new?"

4. **Writing for later understanding** - Interview notes must capture enough context that someone who wasn't present can understand what was meant. The Cognitive Demands Table representation forces this discipline.

The finding that graduate students with minimal training could produce valid training materials demonstrates that the bottleneck isn't method sophistication—it's having a learnable structure that directs attention to expertise dimensions that matter.

## For Multi-Agent Orchestration

In systems where multiple AI agents collaborate to solve problems:

- **The Knowledge Audit framework defines capability types** - An agent with "perceptual skills" can recognize patterns; one with "mental simulation" can project futures; one with "tricks of trade" can apply heuristics efficiently

- **The "why difficult" column identifies bottlenecks** - Where novices struggle indicates where agent assistance is most valuable

- **The cues/strategies column defines information requirements** - What experts attend to defines what information must be available to agents at decision points

A sophisticated orchestration system might route tasks based not just on domain (firefighting, software debugging) but on cognitive demand type: Does this problem require pattern recognition? Mental simulation? Handling of anomalies? Different agent capabilities or different information contexts might be optimal.