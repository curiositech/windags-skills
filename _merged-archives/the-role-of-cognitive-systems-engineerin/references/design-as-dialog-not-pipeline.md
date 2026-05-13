# Design as Dialog: Why Iterative Discovery Beats Sequential Process in Complex Systems

## The Pedagogical Lie

Every formal design methodology presents itself as a sequence of steps. Requirements analysis, then architecture, then implementation, then testing, then deployment. The waterfall. The V-model. Even the spiral model with its iterative loops retains the fiction that each loop completes cleanly before the next begins. Systems engineering frameworks like SIMILAR (State the Problem → Investigate Alternatives → Model the System → Integrate → Launch → Assess → Reevaluate) depict design as a process you can point to on a flowchart.

Militello et al. are explicit that this is a useful fiction that becomes actively harmful when taken too seriously: "Descriptions of approaches are typically pedagogical rather than accurate. In order to communicate how CSE occurs and where it adds value, the design process is often oversimplified as a sequential, stepwise process. In fact, design rarely occurs this way, in part due to pragmatic constraints. Real world issues such as access to information, resources, and experts force project teams to work in a somewhat opportunistic and generally iterative manner."

But the critique goes further than mere pragmatics. The authors argue that the sequential ideal is not even desirable: "We doubt that the sequential, stepwise design process is even a desirable goal. Instead, design should be considered a dialog wherein opportunism and iteration is beneficial. While a stepwise process adds value and efficiency when solving familiar problems, design problems by their very nature are generally not familiar, but require fresh perspectives and innovation. Novel problems require exploration and discovery—processes that are stubbornly incompatible with approaches that rely solely on rigorous and systematic methods."

This is a strong claim. It says that the attempt to fully formalize design is not just impractical but *counterproductive* — that it actively suppresses the discovery and innovation that hard problems require.

## What Dialog Means in Design

The paper proposes replacing the sequential flow model with a "wheel" representation that makes the dialogic nature of design explicit. The key properties of design-as-dialog are:

**Continuous re-evaluation of the problem statement.** "Anywhere in the process, as new information becomes available and the world changes, our understanding of the problem and/or the potential solutions may change. At any point, we may reframe the problem, consider a new solution, or discover potential repercussions not previously considered." The problem is not fixed at the beginning and solved at the end — it is continuously refined as understanding deepens.

**Calibration against an evolving understanding of the work environment.** "The design team continually works to calibrate design activities with an understanding of worker needs, customer needs, available technologies, limitations, tradeoffs, and priorities." This calibration is not a one-time requirement-gathering exercise but an ongoing empirical process.

**Opportunism as a feature, not a bug.** "This figure is also intended to convey the notion that design is a variable process that, to an observer, may seem opportunistic and fragmented. For example, it is commonly proposed that design specifications flow from the products of analysis, but, in our work, specifications continue to emerge as the design is being prototyped or fabricated." The appearance of disorder is the signature of genuine engagement with a hard problem.

**Distributed and social.** "It is a distributed dialog that continues throughout the life of the design project." Design knowledge is not centralized in one person or one phase — it is distributed across practitioners, users, domain experts, and the system itself as it is progressively built and tested.

## The Case Study Evidence

The three case studies in the paper each illustrate a different dimension of design-as-dialog:

**Global Weather Management (Air Mobility Command):** The dialog revealed that the real cognitive challenge was not individual decision support for either flight managers *or* weather forecasters but *collaboration and information sharing between them*. No amount of requirements analysis conducted before observation would have produced this insight — it emerged from direct engagement with the work. Even after fielding, the dialog continued: follow-up observations revealed that "the work itself had changed, including goals and priorities, scale of operations, the organizational structure, the complexity of problems" — prompting a search for design features that would allow end users to "finish the design" as conditions continued to evolve.

**Landmine Detection:** Here the dialog occurred at the level of problem framing. The initial problem was poor detection rates with new equipment. The CSE contribution was recognizing that some operators had achieved >90% detection rates — which meant the problem was not the equipment but the training. The dialog between cognitive modeling and design produced a training curriculum organized around the expert's goal structure, with detection rate as the primary learning measure.

**Nuclear Power Plant Emergency Operations:** The most dramatic example. Plant managers believed the problem was too much workload and too few staff. They proposed adding technology and increasing headcount. The CSE dialog produced a completely different problem statement: poorly defined roles, key decision makers making no decisions, the emergency director as bottleneck, a facility layout that inhibited coordination. The solution involved zero new technology and reduced staff from 80+ to 35. "Thus, referring to the first step of the SIMILAR model, one might say that the plant had an inadequate statement of the problem." The dialog did not improve the solution to the original problem — it replaced the original problem with the actual problem.

## The Danger of Premature Closure

The contrast between design-as-dialog and design-as-pipeline has a specific failure mode: **premature closure on a problem framing that is wrong.** 

When a sequential design process commits to a problem statement in Phase 1 and then executes Phases 2 through N without re-evaluating that statement, it builds an increasingly elaborate and expensive solution to a problem that may have been incorrectly framed from the start. The TRILOGY and Cedars-Sinai cases represent $170 million and millions of dollars respectively invested in solving the wrong problem — or solving the right problem in a way that ignored cognitive requirements until it was too late to recover.

The CSE framework explicitly names this risk: "Without CSE, the design process can be fixated on a narrow set of procedures that make it look like the technology will be very helpful. It is easy to assume that if the worker follows a set of simple, prescribed steps, then the system will operate smoothly and safely."

## Translating Design-as-Dialog to Agent System Architecture

For a multi-agent orchestration system, design-as-dialog has direct architectural implications:

**Agent pipelines should be designed for re-entry, not just forward progress.** A system designed as a linear pipeline — decompose, execute, synthesize — has no mechanism for the discovery that the initial decomposition was wrong. An architecture that supports design-as-dialog includes explicit mechanisms for problem reframing: a step where agents can signal that the decomposition structure needs revision, that the problem statement received was inadequate, or that intermediate results have changed what the final question should be.

**Problem statements should be treated as hypotheses, not specifications.** When an orchestrator receives a complex task, the initial framing of that task is a hypothesis about what problem needs to be solved. The architecture should support iterative refinement of that hypothesis as subagents surface new information. This is different from simply executing against a fixed specification.

**Intermediate outputs should feed back to the orchestrator, not just forward to the next agent.** In a dialog model, information produced at any stage can change understanding at any other stage. The architecture should support bidirectional information flow, not just a single downstream cascade.

**Distinguish between known problems and novel problems.** The paper explicitly notes that sequential stepwise processes add value when solving *familiar* problems. An orchestration system can profitably maintain both modes: a more rigid execution path for well-understood problem classes, and a more exploratory, iterative dialog mode for genuinely novel problems. The skill of distinguishing between these two modes — recognizing when a problem that *looks* familiar is actually novel in ways that matter — is itself a high-value capability.

**Build in mechanisms for "finishing the design."** The Global Weather Management case explicitly noted the need for features that would allow end users to adapt the system to changing conditions. For agent systems, this translates to architectures that expose their assumptions — what constraints am I operating under? what did I assume about the problem structure? — so that human operators and successive iterations can refine those assumptions rather than being locked into them.

## The Formalization Paradox

There is a genuine tension here that the paper does not fully resolve: complex systems require some formalization to be tractable, but excessive formalization suppresses the discovery and adaptation that complex problems require. 

The paper's practical resolution is that CSE provides a *focus* — a coherent set of constructs and concerns (worker needs, expertise, cognitive demands, constraints, goals) — that guides an inherently opportunistic process without turning it into a rigid procedure. The framework orients the dialog without dictating its content or sequence.

For agent system design, the analogous resolution is: maintain a clear understanding of *what you are trying to support* (the cognitive work of whoever or whatever consumes the system's outputs) while holding the *how* loosely enough to revise it as understanding deepens. The goal is fixed; the path to it is discovered.