# Tacit Knowledge Transfer Through Simulation: Lessons for AI Agent Training

## The Simulation Problem

The entire motivation for the COVE ship-handling simulator — and for the cognitive task analysis that is the thesis's product — is the problem of transmitting tacit expertise without requiring full apprenticeship in the operational environment. The Navy faced a concrete training problem:

> "The Navy, plagued by numerous budgetary cutbacks, was being forced to train its surface warfare officers without the benefit of actual ships to train on." (p. 2)

The question was not whether simulation could substitute for real experience — clearly it cannot, in the limit. The question was whether simulation could accelerate the development of expertise that would otherwise require hundreds of hours of on-the-job experience in high-stakes conditions.

The answer the thesis develops is nuanced: simulation can transmit the science effectively, and can begin to develop the art if the simulation correctly represents the perceptual cues that ground expert judgment. But the key requirement is that the simulation must correctly represent what the expert *perceives*, not just what physically happens:

> "The greatest challenge of the COVE system is to accurately display the visual cues a conning officer would utilize in the real environment." (p. 10)

This requirement — faithful perceptual representation — is exactly what makes simulation design hard. A physically accurate simulation (correct physics, correct ship dynamics, correct environmental forces) is necessary but not sufficient. The simulation must also correctly represent the *viewpoint* of the practitioner and the *signals* that carry decision-relevant information at that viewpoint.

## What Makes a Simulation Effective for Expert Knowledge Transfer

The thesis identifies specific features that make the COVE simulator effective as a knowledge transfer tool:

**1. Head-Mounted Display for Spatial Presence**
> "COVE's head mounted display (HMD) presents a full 360 degree field of view which closely resembles the view a conning officer would see if he were on an actual ship. Unlike large expensive bridge simulators currently being used at SWOS, the use of the HMD enhances the feeling of 'presence' by the subject. Presence is often referred to as the ability for one to feel that they are really in the world that is being represented by the computer other than their true physical location." (p. 10-11)

The HMD matters because spatial presence enables the trainee to calibrate their perceptual judgment against the simulated environment. If the trainee cannot perceive the relative scale of ship-to-pier, they cannot develop the visual distance estimation skills that experts use automatically. The field of view and the sense of being *in* the scene are prerequisites for perceptual skill development.

**2. Intelligent Tutor for Feedback Timing**
> "COVE is being developed to provide state of the art intelligent tutor techniques that will allow multiple students at individual stations to be evaluated simultaneously. The intelligent tutor aspect of COVE would not only allow the students to use the simulator at their own convenience, but would also provide immediate feedback and constructive criticism." (p. 11)

The critical phrase is "immediate feedback." Skill development — especially perceptual skill development — requires tight coupling between action and consequence. The expert's perceptual calibration develops through thousands of cycles of observation → judgment → action → observed outcome → correction. The intelligent tutor compresses this cycle by providing the "correction" immediately rather than waiting for the natural consequence to manifest.

**3. Accurate Perceptual Cue Representation**
The task analysis in the thesis is specifically designed to enable this aspect:
> "This challenge [displaying accurate visual cues] is successfully met by the use of COVE's head mounted display (HMD)." (p. 10)

But the display is only the delivery mechanism. What it must deliver — the specific cues at specific scales with specific dynamics — is what the Critical Cue Inventories specify. Without the CCIs, the simulator developers don't know which visual elements matter, at what scale, and in what form.

## The Task Analysis as Training Data Specification

The most important contribution of Grassi's thesis to the COVE project is not the task model itself — it is the specification of what the training environment must represent. The CCIs effectively define the requirements for perceptual fidelity in the simulation:

For a simulation to develop expert distance estimation, it must correctly render:
- The relative scale of the ship's stern/bow against the pier
- The ship's brow as a ~16-foot calibration reference
- The visual behavior of fenders as the ship approaches
- The wake patterns around pier pilings under varying current conditions
- The behavior of flags and pennants under varying wind conditions

Each CCI entry is simultaneously:
1. A description of what experts perceive
2. A requirement for what the simulation must correctly represent
3. A test case for evaluating simulation fidelity

For AI agent training, this framework translates directly: **the CCI layer of a task model specifies the minimum representational requirements for any training environment (simulated or real) from which the agent must learn the task.** If the training environment does not include accurate representations of the critical perceptual cues, the agent cannot develop the perceptual substrate that expert performance requires.

## The Gap Between Knowing the Task and Performing the Task

The thesis makes a fundamental distinction that has profound implications for AI agent evaluation:

> "In this thesis, ship-handling has been defined as being an art and a science. The idea was that the model would represent the science part of ship-handling." (p. 46)

The GOMS model represents the science. The CCIs begin to represent the art. But even together, they represent *knowledge about* the task, not the *ability to perform* the task. The conning officer who has read and understood both the GOMS model and all the CCIs still cannot moor a ship — they must practice.

The thesis acknowledges this:
> "Out in the fleet, a conning officer is never expected to be able to conduct a successful pier side evolution right on the spot. Time is needed for him to evaluate the given situation and review in his mind the procedures and strategies he will use to properly accomplish the task." (p. 49)

The validation participants were given the scenario beforehand, time to prepare, notes, and a physical model of the pier — all forms of cognitive scaffolding that reduce the gap between knowing the task and being able to perform it. But this scaffolding would not be available in operational conditions.

For AI agents, this gap manifests as the difference between **capability in distribution** (the agent performs well on inputs similar to its training data) and **robustness out of distribution** (the agent performs well on novel inputs). An agent that has learned the task procedures but not the underlying perceptual grounding will perform well on nominal scenarios and fail in novel ones — precisely the same pattern as a junior officer who knows the science but lacks the art.

## Simulation Scenarios as Knowledge Structure Probes

The thesis's approach to scenario selection reveals something important about how simulation scenarios should be designed. The generic baseline scenario (no wind, no current, empty pier, twin-screw ship) is not a realistic operational scenario — it is a **knowledge structure probe** designed to isolate the core procedures from the complications:

> "Generating a generic pier side scenario would allow the GOMS model to be constructed around the basic concepts of pier side ship-handling. Once the basic structure of the model was created, the analysis would then be able to examine the generic scenario further by asking 'What if' questions at each basic phase of the tasks in order to address the procedures and decisions used during more complex situations." (p. 44)

The baseline scenario exists to make the core task structure legible. Complications (current, wind, neighboring ships, mechanical casualties) add decision branches and alternative methods that would obscure the core structure if all present simultaneously.

For simulation-based agent training, this suggests a **progressive difficulty strategy**:
1. Train on the baseline scenario first, until core procedures are stable
2. Add complications one at a time, with the simplest complications first
3. Build toward multi-complication scenarios only after single-complication variants are handled well
4. Use "What if" scenarios specifically to probe the boundaries of the agent's current capability

This is not just pedagogical preference — it is knowledge structure design. An agent trained on maximally complex scenarios from the start may learn surface patterns without developing the underlying structural understanding that generalizes to novel complications.

## The Seaman's Eye: What Expert Simulation Must Ultimately Develop

The thesis's concept of "seaman's eye" — the holistic perceptual-judgmental capability that distinguishes experts from competent practitioners — is presented as the ultimate goal of simulation training:

> "One of the primary requirements defined by SWOS is to have a 'performance-driven system' that trains ship handlers in acquiring a seaman's eye." (p. 10)

Seaman's eye is not a specific skill — it is an integration of many skills into a coherent perceptual-judgmental capability. The expert with seaman's eye sees the ship situation as a whole and knows, without analysis, whether it is developing safely or dangerously.

This holistic capability cannot be directly taught or specified — it emerges from extensive practice in perceptually rich environments with good feedback. The task analysis and CCIs are not descriptions of seaman's eye — they are the **scaffolding that makes its development possible through simulation.** By specifying the critical cues and the knowledge structure, the task analysis ensures that the simulation correctly represents the perceptual substrate from which seaman's eye must develop.

For AI agent development, the analogue of seaman's eye is **generalization** — the agent's ability to handle novel situations correctly by drawing on a deep understanding of the task structure rather than surface pattern-matching. This generalization cannot be directly trained — it emerges from extensive practice on a perceptually rich, structurally varied training distribution that develops genuine understanding.

The CCIs and task model specify what that training distribution must include. They do not guarantee that the agent will develop genuine understanding — but their absence guarantees that it cannot.

## Boundary Conditions

The simulation-as-knowledge-transfer framework applies when:
- The target skill has a perceptual component that can be represented in simulation
- The training environment can be made sufficiently faithful to develop the required perceptual calibration
- The feedback cycle can be kept tight enough to enable rapid perceptual skill development
- Progressive complexity scenarios can be designed to develop structural understanding

The framework is less effective when:
- The critical perceptual cues involve modalities that are hard to simulate (smell, temperature, physical vibration, proprioception)
- The operational environment varies so widely that no reasonable simulation set covers the training distribution
- The feedback available in simulation is qualitatively different from feedback available in real operations (the simulation tells you what happened, but the operation tells you what it felt like)

The central lesson: **building a simulation is not sufficient for knowledge transfer — the simulation must correctly represent the perceptual cues that carry decision-relevant information.** This requires the CCI layer, not just the physics layer. Perceptually impoverished simulation develops procedural knowledge without developing the perceptual grounding that makes procedural knowledge usable in novel conditions.