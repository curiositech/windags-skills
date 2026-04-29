# The Gap Between Knowing and Doing: Why Simulators and Agent Systems Need High-Fidelity Perceptual Environments

## The Fundamental Problem of Transfer

A surface warfare officer can read every chapter of Crenshaw's *Naval Shiphandling*, memorize the physics of propeller side-force, and pass a written examination on the six forces affecting a ship — and still, when given the conn for the first time, "end up being a 'parrot' where all they do is repeat orders given by the OOD or commanding officer."

The knowledge is present. The performance is absent. This gap — between knowing and doing — is not a failure of intelligence or motivation. It is a structural feature of how complex skilled performance is encoded in the human cognitive system.

Grassi's thesis is fundamentally a study of this gap, and its methodology is an attempt to bridge it through a combination of explicit procedural documentation (GOMS) and perceptual signal cataloguing (CCI). The bridge is imperfect — the thesis acknowledges that even the completed analysis "in no way depicts every possible method that could have been utilized" — but it represents the most systematic approach available given the constraints.

## What Creates the Gap

The gap exists because knowing and doing engage different cognitive systems:

**Declarative knowledge** (knowing-that): "A backing bell on the outboard engine will swing the stern toward the pier." This is propositional. It can be stated, stored as text, tested in written examination, and transmitted by reading.

**Procedural knowledge** (knowing-how): The capacity to recognize "this is the moment for a backing bell on the outboard engine" from perceptual signals, execute the verbal order in the correct form, coordinate it with other concurrent actions, and monitor its execution — all under time pressure, with attention simultaneously allocated to ten other developing situations.

The first can be transmitted without practice. The second cannot. The SWOS classroom produces declarative knowledge. The bridge produces procedural knowledge. The simulator is an attempt to produce procedural knowledge without the full risk of the bridge.

## What Simulators Must Reproduce

For a simulator to actually build procedural knowledge, it must reproduce the perceptual environment with sufficient fidelity that the perceptual-motor skills trained in simulation *transfer* to the real environment. The thesis makes this requirement explicit:

> "The greatest challenge of the COVE system is to accurately display the visual cues a conning officer would utilize in the real environment." (p. 10)

The critical word is *visual cues*. Not "the physics of ship handling" — that can be simulated accurately with a mathematical model. Not "the standard commands" — those can be drilled verbally without any simulator. The challenge is replicating the specific visual (and auditory) signals that experts have learned to interpret as indicating specific states of the world.

If the simulator does not reproduce these cues with sufficient fidelity:
- The trainee cannot practice the perceptual discrimination skills the expert uses
- Cues learned in the simulator will not transfer to the real environment (because they look different)
- The trainee will build procedural knowledge that works in the simulator but not on the ship

This is the problem of *perceptual fidelity* — and it is the hardest part of simulation design, because it requires an accurate inventory of *which perceptual signals* experts actually use, not just the physics that produces them.

The CCI is the answer to this requirement: it provides a validated inventory of the specific perceptual signals that expert ship-handlers actually use, in sufficient detail to allow simulation designers to know what they must reproduce.

## Presence and the Feeling of Reality

The thesis introduces a concept that is central to simulation effectiveness: *presence* — the sense of actually being in the simulated environment rather than observing it.

> "Presence is often referred to as the ability for one to feel that they are really in the world that is being represented by the computer other than their true physical location." (p. 10-11)

The head-mounted display (HMD) used in COVE enhances presence compared to flat-screen simulators by providing a full 360-degree field of view that matches the conning officer's actual visual environment. This is not just a comfort feature — presence is functionally important because:

1. **It activates the right cognitive systems**: High presence activates the same perceptual-motor engagement as the real task. Low presence (sitting at a desk, watching a screen) activates observer mode rather than performer mode.

2. **It enables transfer**: Skills trained in a high-presence environment are more likely to transfer to the real environment because the encoding conditions are similar.

3. **It allows realistic errors**: In a low-presence environment, trainees know they're safe and take risks they wouldn't take in reality. In a high-presence environment, the normal autonomic stress responses activate, providing more realistic conditions for learning error recognition and recovery.

For agent systems, the presence concept translates to *environmental fidelity*: an agent trained and evaluated only on sanitized, simplified inputs will perform differently when deployed in noisy, complex, real-world conditions. The gap between training environment and deployment environment is the agent equivalent of the presence gap.

## The Intelligent Tutor Requirement

The COVE project specification includes a requirement that illuminates a different dimension of the knowing/doing gap:

> "The COVE system is being developed to provide state of the art intelligent tutor techniques that will allow multiple students at individual stations to be evaluated simultaneously. The intelligent tutor aspect of COVE would not only allow the students to use the simulator at their own convenience, but would also provide immediate feedback and constructive criticism." (p. 11)

The intelligent tutor replaces the human expert observer who, in traditional training, monitors the trainee's performance and provides corrective feedback. Without feedback:
- Trainees don't know when their perceptual assessments are wrong (they may "see" the correct state but report the wrong conclusion)
- Trainees can't calibrate their confidence (they may be confident and wrong, or uncertain and right)
- Bad habits learned early can entrench because no one corrects them

But building an intelligent tutor requires knowing *what the expert is looking for* — which is exactly what the GOMS + CCI combination provides. The tutor can evaluate trainee performance against the expert model documented in the CCI: "the trainee said the stern was clear, but the CCI indicates that a competent officer would check both the direct visual separation and the stern watch report. The trainee only checked one channel. Flag this as a monitoring deficiency."

For agent systems: evaluation metrics derived from expert behavior models (GOMS + CCI) enable more diagnostically precise capability assessment than simple pass/fail outcome metrics. An agent that reaches the right answer for the wrong reasons (using unreliable signals, skipping verification steps) is not performing correctly even if the outcome is correct in easy cases. It will fail when conditions degrade.

## The Seaman's Eye: What Practice Builds

The concept of "seaman's eye" — the sailor's analog to the pilot's "hand-eye coordination" or the surgeon's "feel" — appears throughout the thesis as the target of ship-handling training:

> "One of the primary requirements defined by SWOS is to have a 'performance-driven system' that trains ship handlers in acquiring a seaman's eye." (p. 10)

What is seaman's eye? It is the integrated perceptual-motor-cognitive system that:
- Continuously integrates perceptual signals into an accurate mental picture
- Anticipates the implication of the current situation's trajectory
- Triggers appropriate responses at the right moment with the right intensity
- Recovers gracefully from errors without losing the overall picture

This is not a verbal skill. It is not a logical skill. It is a trained perceptual-motor system that operates largely below the threshold of conscious deliberation. It is built through thousands of repetitions in varied conditions.

The thesis makes no claim that its task analysis substitutes for seaman's eye. The claim is more modest: the task analysis identifies what the simulator must reproduce in order to provide the conditions in which seaman's eye can be developed through practice.

## Transfer: The Real Test

The ultimate test of any simulator — or any agent training methodology — is *transfer*: do the skills built in the training environment actually generalize to the deployment environment?

> "The primary goal of the VETT research is to provide a testbed system that can be used to demonstrate how well ship-handling skills trained in a virtual environment transfer to real world situations." (p. 9)

Transfer is not guaranteed. It requires:
1. Sufficient perceptual fidelity that the signals used in training match the signals present in deployment
2. Sufficient scenario variety that the trainee has encountered a range of conditions, not just the standardized scenario
3. Sufficient difficulty that the trainee has experienced and recovered from errors, building error-recovery skills
4. Sufficient repetition that procedural knowledge is encoded robustly, not fragily

For agent systems, the parallel concerns are:
1. **Input distribution fidelity**: Is the distribution of inputs in testing similar to the distribution in deployment?
2. **Scenario diversity**: Has the agent been tested across a range of conditions, or only on standardized benchmark cases?
3. **Error exposure**: Has the agent been tested in conditions where errors occur and recovery is required?
4. **Robustness under degraded conditions**: Has the agent been tested with missing, noisy, or conflicting inputs?

The gap between benchmark performance and deployment performance in AI systems is exactly the same gap as between classroom knowledge and bridge performance — the training environment is simplified, sanitized, and standardized in ways that do not reflect the complexity of the deployment environment. The CCI + GOMS methodology, applied to agent development, is one approach to making training conditions more systematically aligned with deployment conditions.

## Recommendations for Practice: Building Agent Capabilities That Transfer

1. **Document the deployment perceptual environment explicitly**: What inputs will the agent actually receive? What will they look like when degraded, ambiguous, or conflicting? Build test cases that match this distribution.

2. **Identify the CCI-equivalent for each decision node**: For each point where the agent must classify a situation before acting, document the specific signals available in deployment. Ensure the agent's decision logic uses signals that are actually available in deployment, not only in training.

3. **Test in conditions of graduated complexity**: Begin with clean, simple cases; progress to noisy, complex, ambiguous cases. Don't report only the clean-case performance.

4. **Test error recovery explicitly**: Deliberately inject errors and monitor recovery quality. An agent that cannot recover gracefully from its own errors (or from errors in its inputs) will degrade badly in deployment.

5. **Measure the right things**: Outcome metrics (did the task succeed?) capture the gross performance. Process metrics (were the right signals checked? in the right sequence? with the right verification steps?) reveal whether the right skills are being built. Both are required.

6. **Validate transfer, not just performance**: A capability that works perfectly on test scenarios but fails on slight variations of those scenarios has not transferred — it has memorized. Transfer requires generalization to genuinely novel inputs within the scope of the intended task.