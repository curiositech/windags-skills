# The Two-Layer Structure of Expert Knowledge: Science and Art in Complex Task Performance

## The Central Problem This Document Addresses

When you ask an expert to explain what they do, they tell you the science. When you watch them perform, you see the art. These are not the same thing, and confusing them produces systems — training simulators, AI agents, knowledge bases, checklists — that teach the wrong things with high confidence.

Grassi's 2000 thesis on pier-side ship-handling puts this problem in unusually sharp relief. The thesis opens with a distinction that should be foundational for any intelligent system designer:

> "Often described as an art, a science and a skill, ship-handling is an individual's ability to apply science to develop the art of competently maneuvering a vessel safely and efficiently. Therefore to be a skilled shiphandler, one must master the science, understand the knowledge, and display the art, whenever and wherever required." (p. 1)

This is not rhetorical flourish. It is a precise structural claim about the architecture of expertise. And it leads directly to a diagnostic of why training fails:

> "This problem was not due to the fact that these officers knew nothing about the 'science' or fundamentals of ship-handling, but rather that they were not given the proper training to acquire the 'art' of ship-handling." (p. 1)

The young Surface Warfare Officers arriving at their first command knew the physics of propeller side-force, the six forces acting on a ship, the standard engine and rudder commands. They had this knowledge. What they lacked was the capacity to *act on it in real time under uncertainty* — the perceptual discrimination, the timing sense, the feel for when a rate of swing is "too fast" before the stern strikes the pier.

## What the Science Layer Contains

The science layer of any complex skill is:
- **Explicit and articulable**: It can be written down in manuals, taught in classrooms, expressed in notation
- **Procedural and sequential**: It has a logical order, prerequisites, and if-then structure
- **Domain-physics grounded**: It derives from causal relationships in the world (propellers push water, rudders deflect flow, currents carry hulls)
- **Transferable without practice**: Reading Naval Education and Training Command's NAVEDTRA 10776-A gives you the science

The GOMS model (Goals, Operators, Methods, Selection Rules) captures this layer. At the science level, "stopping a ship" becomes:

```
goal: Stop_Headway_Of_Ship
  [select: Order_Backing_Bell_On_Outboard_screw  ...if slight headway
           Order_Backing_Bell_On_Both_screws     ...if moderate headway]
  goal: Verify_No_Forward_Motion
    method: Assess ship's movement and position
  goal: Order_Engine(s)_Stopped
```

This is teachable. It is correct. It is necessary. And it is insufficient.

## What the Art Layer Contains

The art layer is:
- **Implicit and difficult to articulate**: Experts often say "I just know when it is"
- **Perceptual and pattern-based**: Triggered by specific sensory cues, not logical inference
- **Timing-dependent**: The same action at different moments produces different outcomes
- **Acquired through practice, not instruction**: Cannot be transmitted via text alone

The diagnostic moment in Grassi's thesis comes during knowledge elicitation:

> "When an expert ship-handler was asked to explain how he knows when a ship is far enough away from the pier so that its stern will not collide with it when the ship is getting underway, he responded with, 'I can't explain it. I just know when it is.'" (p. 16)

This is not evasion. It is an honest report of how expert cognition actually works. The knowledge is real and reliable — the expert reliably doesn't hit the pier — but it is encoded in perceptual pattern recognition, not in articulable rules. The critical question is: *what is the expert actually perceiving?*

The thesis answers this through Critical Cue Inventories. The "just knowing" resolves into specific signals:
- The open space between stern and pier, compared to known reference dimensions (the brow is approximately 16 feet)
- The rate at which the corner of the stern moves through the water
- The relative motion of a fixed point on the pier (an empty box, a paint mark)
- The verbal distance reports from the stern watch
- The churning of water as propellers engage

None of these require magic. They require a trained perceptual system that has associated these specific stimuli with specific states of the world.

## Why Training Systems Fail When They Only Teach Science

A training system that teaches only the science layer produces what the thesis calls "parrots":

> "Most junior officers are so nervous and inexperienced when they conn a ship for the first time that they usually end up being a 'parrot' where all they do is repeat orders given by the OOD or commanding officer." (p. 7)

Parrots know the commands. They can recite the selection rules. They cannot execute the selection rules because they cannot perceive the conditions the rules reference. When the GOMS model says "select: Order_Backing_Bell_On_Outboard_screw ... if slight headway" — the parrot does not know what *slight headway feels like*. They don't know which visual cues indicate slight vs. moderate. They don't have the perceptual vocabulary.

This is the gap between knowing something and doing it — between declarative and procedural knowledge, between understanding a procedure and having the situational awareness to trigger it correctly.

## The Structural Implication for Agent System Design

An AI agent that performs complex tasks inherits exactly this problem. Consider a task decomposition agent given a complex multi-step task:

- **Science layer**: The agent can represent the logical structure of the task — prerequisites, ordering constraints, conditional branches, resource requirements. This is the GOMS layer. Tools like task graphs, workflow engines, and planning algorithms operate here.

- **Art layer**: The agent must also perceive and classify the *current state of the environment* in ways that trigger the correct branch at each decision point. This requires not just logic but *perceptual categories* — what counts as "slight headway," what counts as "mooring lines under strain," what counts as "proper approach angle."

When agents fail at complex tasks, the failure usually occurs at the art layer, not the science layer. The agent's logical decomposition is correct. But the agent misclassifies the current state of the world and applies the right method to the wrong situation.

### Design Principle: Separate the Procedural from the Perceptual

For any complex capability, a WinDAGs agent system should maintain:

1. **A GOMS-equivalent task graph** — the explicit hierarchical decomposition of goals into subgoals into methods into selection rules. This is the science.

2. **A Critical Cue Inventory equivalent** — for each decision point in the task graph, an explicit list of observable signals that classify the current state. This is the art.

The GOMS model alone tells you *what to do*. The CCI tells you *how to know when to do it*. Both are required.

### Design Principle: Distinguish Articulable from Tacit Knowledge

When building agent capabilities, assume that:
- Subject matter experts will naturally provide science-layer knowledge
- Art-layer knowledge requires specific elicitation methods (the CDM equivalent: scenario walkthroughs, "what did you notice just before you did X?", multiple expert cross-validation)
- Initial capability specifications will be systematically deficient in art-layer content
- Validation against real performance (not just expert review) is necessary to surface the gaps

### Design Principle: Practice Environments Are Not Optional

The thesis is emphatic that art cannot be transmitted through text:

> "The skill of ship-handling cannot be learned by solely reading books or observing someone else. Like so many other things in life, one cannot become proficient at something without practice." (p. 2)

For agent systems, this translates to: capabilities that require perceptual judgment must be validated in high-fidelity environments that provide the relevant perceptual signals. Testing a complex reasoning agent only on abstract symbolic inputs is equivalent to training a ship-handler only in the classroom. The agent will be a parrot when deployed.

## Boundary Conditions

This framework applies most forcefully when:
- The task is highly physical, time-critical, or deeply embedded in perceptual context
- Expert performance is visibly superior to novice performance without being fully explicable
- The cost of real-world practice is high (dangerous, expensive, rare)

It applies less forcefully when:
- The task is primarily symbolic or logical (where articulation captures most of performance)
- The relevant state of the world is fully and accurately represented in machine-readable form
- The perceptual signals are identical between training and deployment environments

The danger zone is tasks that *appear* to be purely logical (code review, security auditing, architectural assessment) but that actually involve significant tacit perceptual judgment — "this codebase feels fragile" is an art-layer judgment even if expressed verbally. These tasks benefit from explicit CCI-style documentation of the signals that trigger expert intuitions.