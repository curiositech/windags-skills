# Bayesian Affordance Models: Object Recognition as Predictive Control

## The Traditional Object Recognition Problem

Standard approaches to object recognition treat it as a classification problem: given sensory input (RGB image, point cloud, feature vector), predict object category or instance ID. The representation is passive—objects are described by geometric properties (shape, size, color) or learned embeddings (deep features, latent codes).

This creates a gap: **knowing what object you're looking at doesn't directly inform how to interact with it**. After recognizing "coffee cup," a separate planning layer must determine grasping affordances, manipulation strategies, etc. The representation doesn't inherently support action selection.

Sen et al. invert this: **represent objects as generative models over the control programs they support**. Recognition becomes: "Given observed controller convergences, which object is most likely present?" Action selection becomes: "Given likely objects and task goals, which control program should I execute next?"

The Bayesian network in Figure 3 formalizes this inversion.

## The Generative Model: Objects Cause Affordances

The network structure encodes causal relationships:

**Object node** O_i ~ Bernoulli(p_object):  
Binary variable, "Is object i present in the environment?"  
*Prior*: Learned from past experience (how often has this object appeared?)

**Affordance state nodes** p_ij ~ Multinomial({X, −, 0, 1}):  
For each affordance j of object i, what's the current controller state?  
*Conditional distribution*: Pr(p_ij | O_i)  
- If O_i = 1 (object present): p_ij has high probability of being trackable (states 0 or 1)
- If O_i = 0 (object absent): p_ij likely in state − (signal unavailable) or X (unknown)

**Feature location nodes** f_ij ~ Gaussian(μ_position, μ_orientation, μ_scale, Σ):  
Where in space (x,y,z), at what orientation (θ), at what scale (sc) does affordance j manifest?  
*Conditional distribution*: Pr(f_ij | O_i, p_ij)  
- If O_i = 1 and p_ij = 1 (object present and affordance tracked): f_ij follows a learned spatial distribution specific to that object and affordance
- The distribution captures natural variation (object can be grasped from slightly different angles, tolerances in positioning)

**Spatial relationship nodes** r_jk ~ Gaussian(μ_relative, Σ_relative):  
Relative distance, orientation, and scale between affordances j and k  
*Conditional distribution*: Pr(r_jk | f_ij, f_ik)  
- Deterministic function of the feature locations (if you know where both affordances are, their relationship is determined)
- Uncertainty in r_jk comes from uncertainty in f_ij and f_ik

## Why This Is a Generative Model

You can *sample* from this network to generate predictions:

1. Sample object presence: O_radio ~ Bernoulli(0.3) → O_radio = 1
2. Sample affordance states conditioned on object:
   - p_yellow_knob | O_radio = 1 → state = 1 (trackable)
   - p_black_antenna | O_radio = 1 → state = 1
   - p_green_base | O_radio = 1 → state = 1  
   - p_grasp_axis | O_radio = 1 → state = 0 (requires positioning)

3. Sample feature locations conditioned on object and states:
   - f_yellow_knob ~ N(μ_knob, Σ_knob) → (x=0.3, y=0.1, z=0.5, θ=0, sc=0.05)
   - f_black_antenna ~ N(μ_antenna, Σ_antenna) → (x=0.32, y=0.15, z=0.8, θ=π/2, sc=0.01)
   - ...

4. Compute spatial relationships from features:
   - r_knob_antenna = f(f_yellow_knob, f_black_antenna) → (Δx, Δy, Δz, Δθ, Δsc)

This generative process predicts: "If the radio is present, I expect to find a yellow trackable feature near (0.3, 0.1, 0.5), a black feature 20cm above at π/2 orientation, and grasping will be possible along the principal axis aligned with both."

## Inference: From Observations to Object Beliefs

**Recognition (evidence → object)**:  
Given observations Z = {z_p, z_f} where:
- z_p = observed controller states (which affordances tracked successfully)
- z_f = observed feature locations (where trackable features were found)

Compute posterior: Pr(O_i | Z) ∝ Pr(Z | O_i) Pr(O_i)

Example: Robot executes visual SEARCHTRACK for green blob, finds one at (0.25, 0.08, 0.12). Also finds yellow circular feature at (0.28, 0.09, 0.48). Spatial relationship between them: Δz ≈ 0.36m, Δθ ≈ aligned.

Query model: Which object is most consistent with {green blob at X1, yellow circle at X2, spatial relationship R}?

If O_radio predicts exactly this configuration (green base at bottom, yellow knob above, 36cm separation), then Pr(O_radio | Z) is high. If O_flashlight predicts only one trackable feature (no green base), then Pr(O_flashlight | Z) is low.

**Action selection (object + goal → next action)**:  
Given likely object Pr(O_i | Z) and goal affordance a_g (e.g., REACHGRASP), predict:

Pr(f_g | Z, p_g) = Σ_i Pr(f_g | O_i, p_g) Pr(O_i | Z)

This is the predicted location distribution for the goal affordance given current evidence and object beliefs. If uncertain (high entropy), execute exploratory actions to reduce uncertainty (see Algorithm 1).

## The Radio Grasping Example: Inference Under Uncertainty

**Initial state**: Robot has learned a model of the radio but hasn't observed it yet.  
**Goal**: Execute REACHGRASP (achieve force closure on the object)  
**Problem**: The grasp affordance f_grasp has high uncertainty (Figure 4 shows multimodal distribution)

Why the uncertainty? The model knows:
- Grasping can occur at multiple positions along the radio's body
- The yellow knob has rotational symmetry (Figure 5d)—if that's the only observed feature, orientation is ambiguous  
- The green base has bilateral symmetry—mirror image grasps are equivalent

**Algorithm 1 execution**:

**Round 1**:
- Compute entropy of grasp posterior: H(f_grasp | priors) = high (multimodal, broad)
- For each possible exploratory action (track yellow knob, track green base, track black antenna, track bounding box):
  - Predict: If I execute this action and observe feature f_i, how much does it reduce H(f_grasp)?
  - Compute mutual information: I(f_grasp ; f_i | evidence)
- Result: Tracking green base has maximal mutual information (Figure 5b shows it most effectively disambiguates grasp locations)
- Execute: SEARCHTRACK green base → observe at (x₁, y₁, z₁)
- Update: evidence ← evidence ∪ {p_green=1, f_green=(x₁, y₁, z₁)}

**Round 2** (Figure 6):
- Recompute entropy: H(f_grasp | evidence with green base) = medium (still uncertain about orientation)
- Most informative next action: track black antenna (breaks rotational symmetry)
- Execute: SEARCHTRACK black antenna → observe at (x₂, y₂, z₂)  
- Update: evidence ← evidence ∪ {p_black=1, f_black=(x₂, y₂, z₂)}
- Recompute entropy: H(f_grasp | evidence with green + black) < ε (threshold)
- Goal posterior is now unimodal and tight → Execute REACHGRASP sampling from Pr(f_grasp | evidence)

## Information-Theoretic Action Selection: Mutual Information

Why mutual information I(f_grasp ; f_i | evidence)?

**Definition**: I(X;Y) = H(X) - H(X|Y) = reduction in uncertainty about X from observing Y

In the grasping context:
- H(f_grasp): Current uncertainty in grasp location (entropy of posterior distribution)
- H(f_grasp | f_i): Expected uncertainty after observing feature i  
- I(f_grasp ; f_i): Expected reduction in uncertainty

**Computing expectation**: We don't know what f_i we'll observe until we search for it, so:

I(f_grasp ; f_i | evidence) = ∫ Pr(f_i | evidence) · [H(f_grasp | evidence) - H(f_grasp | evidence, f_i)] df_i

This requires marginalizing over possible observations—integrate over the predicted distribution of where feature i might be found.

**Practical approximation**: Sample likely feature locations from Pr(f_i | evidence), compute entropy reduction for each, weight by probability, sum. This is computationally expensive but tractable with modern probabilistic programming tools.

## Why This Beats Greedy Action Selection

**Alternative approach 1: Random exploration**  
Try affordances randomly until one works for grasping.  
*Problem*: Inefficient, especially with many possible affordances. Might try antenna, knob, bounding box before green base, wasting time.

**Alternative approach 2: Fixed heuristic**  
Always search for features in a predefined order (e.g., largest feature first).  
*Problem*: Not adaptive to task or evidence. For some objects, smallest feature might be most diagnostic.

**Alternative approach 3: Greedy uncertainty reduction**  
Execute action that maximally reduces entropy over *all* affordances, not specifically the goal.  
*Problem*: Might disambiguate irrelevant features while leaving goal uncertain.

**Mutual information approach**:  
Explicitly optimizes for reducing uncertainty in *task-relevant* affordances given *current evidence*. If grasp location is already well-determined but object identity uncertain, don't waste time on recognition—go for the grasp. If grasp requires knowing orientation and only symmetric features observed, prioritize asymmetric features.

This is **task-directed exploration**: each action is chosen to maximally progress toward executing the goal action, not for general knowledge acquisition.

## Boundary Conditions and Failure Modes

**Model mismatch**: If the learned model is incorrect (radio stored upside-down, parts broken off), observations won't match predictions.  
*Detection*: Low likelihood Pr(Z | all objects)—nothing in the model explains observations well.  
*Response*: Signal novelty, initiate exploration to update model or learn new object representation.

**Aliasing**: Multiple objects might afford similar control programs.  
*Example*: Both "radio" and "toolbox" have trackable knobs, graspable handles, similar size.  
*Mitigation*: The spatial relationships r_jk disambiguate—even if individual affordances are similar, their relative configuration is distinctive.  
*Limitation*: If objects are genuinely ambiguous in their affordances, recognition may remain uncertain. This is actually desirable—forcing a decision when evidence is ambiguous leads to errors.

**Expensive/destructive actions**: Some affordances can't be casually explored.  
*Example*: To verify an object is graspable, you must attempt grasping—which might knock it over or damage it.  
*Solution*: Algorithm 1 explicitly avoids executing the goal action (a_g) until uncertainty is below threshold. "Try grasping to see if it's graspable" is prevented; "observe visual features to infer graspability" is preferred.

**Local minima in exploration**: Mutual information is computed with current model and evidence. If the model is missing critical features, no action will have high mutual information.  
*Example*: If the model doesn't include texture information and texture is actually critical for grasping, all actions will seem equally uninformative.  
*Mitigation*: Ensure models capture diverse affordance types. Periodically inject random exploration to discover out-of-model affordances.

## Implications for Multi-Agent Object Recognition

**Shared object models**: Multiple agents can contribute to and benefit from a common Bayesian affordance model database. When agent A encounters "radio" and executes {green base, black antenna, grasp} sequence, that data updates the shared model, improving agent B's future recognition and action selection.

**Distributed inference**: The Bayesian network factorization allows distributed computation:
- Agent A computes Pr(O_i | observations_A)  
- Agent B computes Pr(O_i | observations_B)
- Combine: Pr(O_i | observations_A, observations_B) ∝ Pr(O_i | observations_A) · Pr(O_i | observations_B) / Pr(O_i)

No need for centralized fusion—agents multiply their posterior beliefs (accounting for the prior).

**Specialization through model refinement**: Different agents might refine models for objects they frequently encounter. Agent specialized in "kitchen tasks" has richer affordance models for kitchen objects (more affordances modeled, tighter spatial distributions). When other agents encounter kitchen objects, they can query the specialist's models.

**Handling model drift**: Objects change over time (wear, damage, reconfiguration). The Bayesian framework supports online updating:
- If observed affordance locations consistently deviate from model predictions, update Pr(f_ij | O_i)  
- If affordances become unreliable (p_ij frequently fails to converge), update Pr(p_ij | O_i) to reflect lower success probability

## Connection to Active Perception

Algorithm 1 is a form of **active perception**: the agent doesn't passively receive sensory input but actively selects actions (sensor positioning, feature tracking attempts) to acquire task-relevant information.

Classical active perception (e.g., "move camera to better view object") is subsumed: executing a SEARCHTRACK schema inherently involves moving sensors (pan/tilt head, arm positioning) to track the target feature. The affordance-based framework unifies sensor control and recognition.

The mutual information criterion provides a principled alternative to heuristics like "maximize image resolution" or "minimize occlusion." Instead: **maximize expected reduction in task-relevant uncertainty.**

## Design Pattern: Affordance-Driven Task Decomposition

For WinDAGs orchestrators planning complex tasks:

**1. Goal specification as affordance**:  
Rather than "grasp radio," specify "achieve p_grasp=1 ∧ f_grasp satisfies task constraints"

**2. Consult affordance model**:  
Query: Pr(p_grasp=1 | current observations) and H(f_grasp | current observations)

**3. If uncertainty high, decompose into exploration subtasks**:  
For each potential exploratory action, compute I(f_goal ; f_exploratory | evidence)  
Create subgraph: explore → update beliefs → recheck → (iterate or execute goal)

**4. If uncertainty low, proceed to execution**:  
Sample goal parameters from Pr(f_goal | evidence), invoke goal skill

**5. Monitor execution**:  
If goal action fails (p_goal doesn't reach 1), evidence contradicts model. Update model or escalate to human.

This pattern makes exploration and exploitation explicit in the task graph, with information-theoretic criteria for transitioning between them.

## Critical Insight: Representation Grounds Recognition in Action

Traditional AI separates "vision" (recognizing objects) from "robotics" (manipulating them). This creates an integration problem: vision researchers optimize for ImageNet accuracy; robotics researchers optimize for grasp success; the representations don't align.

Affordance-based representation dissolves this separation: **recognition is predicting which actions will succeed; acting is executing predictions from recognition.**

For agent systems, this suggests: don't maintain separate "knowledge base" (object properties) and "skill library" (manipulation programs). Instead, the knowledge base *is* a probabilistic model over which skills will succeed in which configurations. Recognition becomes: "query the model for likely objects given observed skill successes/failures." This grounds abstract knowledge in executable, testable predictions.