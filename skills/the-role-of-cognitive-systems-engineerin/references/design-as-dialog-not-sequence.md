# Design as Dialog: Why Sequential Process Models Fail Complex Problems

## The Pedagogical Lie

One of the most important intellectual contributions of Militello et al. (2009) is their candid critique of how design processes are typically described versus how they actually work. The authors state plainly:

"Descriptions of approaches are typically pedagogical rather than accurate. In order to communicate how CSE occurs and where it adds value, the design process is often oversimplified as a sequential, stepwise process. In fact, design rarely occurs this way, in part due to pragmatic constraints. Real world issues such as access to information, resources, and experts force project teams to work in a somewhat opportunistic and generally iterative manner." (p. 2-3)

This is not a minor methodological quibble. It is a claim that the dominant mental models used to plan, manage, and evaluate design projects are systematically wrong — and that this wrongness has real costs.

The sequential waterfall model — requirements → design → implementation → testing → deployment — remains deeply embedded in how organizations plan projects, allocate budgets, assign responsibility, and measure progress. It treats design as a production process: inputs come in at one end, outputs come out the other, and each stage adds value to the thing-being-built in a predictable, manageable way.

The problem is that this model applies well to *manufacturing* (building the same thing repeatedly) and poorly to *design* (building something new). Design problems "by their very nature are generally not familiar, but require fresh perspectives and innovation. Novel problems require exploration and discovery — processes that are stubbornly incompatible with approaches that rely solely on rigorous and systematic methods." (p. 3)

## What Design Actually Looks Like

The authors propose an alternative model: **design as dialog**.

"There is a continuous dialog throughout all of design as the team gathers more information about the world in which the eventual solution will be implemented. This evolving understanding sparks the generation of new ideas, the rejection of unsuitable schemes, and the refinement of promising design concepts." (p. 8-9)

This dialog has several characteristics that distinguish it from sequential process models:

**It is distributed**: The dialog doesn't happen at a single moment or in a single meeting. It is continuous — happening in hallways, during prototyping sessions, in user observations, in code reviews, in stakeholder conversations.

**It is opportunistic**: Information doesn't arrive in the order that a process model would prefer. A user observation that was supposed to happen in Phase 1 happens in Phase 3. A technical constraint that was supposed to be discovered in architecture review only becomes visible during implementation. Effective design teams exploit these opportunistic discoveries rather than ignoring them because they arrived "out of order."

**It is iterative and recursive**: Understanding the problem changes the solution. Building the solution changes understanding of the problem. This is not a failure of process discipline — it is the mechanism by which design improves.

**It is reframing**: "Anywhere in the process, as new information becomes available and the world changes, our understanding of the problem and/or the potential solutions may change. At any point, we may reframe the problem, consider a new solution, or discover potential repercussions not previously considered." (p. 8)

The authors represent this visually as a *wheel* rather than a sequence: "The representational form of the wheel is offered as a departure from the limitations of the sequential flow representation." The wheel conveys that all design activities are simultaneously active, mutually influencing, and subject to revision.

## Why Rigidity Kills Innovation

The authors make a bold claim: "There is an almost universal call for design to be formalized and standardized. We regard that as both unrealistic and as counterproductive. Too much success in that direction will stifle innovation, which is the touchstone of design." (p. 10)

This is worth sitting with. The intuition behind standardized design processes is sound: consistency reduces error, repeatability enables quality control, documentation enables knowledge transfer. But when these benefits are pursued at the cost of exploratory flexibility, the result is a system optimized for executing familiar solutions to familiar problems — exactly what complex, novel problems are not.

CSE provides what the authors describe as "a focus that can help guide an opportunistic and highly-variable design process" — not a substitute for opportunism, but a principled anchor that prevents opportunism from becoming arbitrary. The anchor is the constant question: *Does this serve the cognitive requirements of the work?*

## The Global Weather Management Tool: Dialog in Action

The Global Weather Management case study illustrates design-as-dialog concretely. Researchers conducted three multi-day site visits to observe flight managers and weather forecasters *before* specifying what the tool would do. These observations shaped the system model (SIMILAR Step 3) in ways that couldn't have been specified in advance:

The research team discovered that the *relationship* between flight managers and weather forecasters — the collaborative sense-making they did together — was as important as any individual function either performed. This led to designing a tool that served as "an information-sharing and collaboration tool for both flight managers and weather forecasters" rather than a decision-support tool for one or the other in isolation.

After deployment, the dialog continued: CSE researchers conducted follow-up observations and found that "even in the short time since the prototype had been developed, certain aspects of the work itself had changed, including goals and priorities, scale of operations, the organizational structure, the complexity of problems, information sources and information systems, and the physical layout of the workspace." (p. 7)

Rather than treating this as scope creep to be resisted, the team responded by looking for "design features that would allow end users to 'finish the design' to meet changing work conditions." The system was designed to accommodate the dialog's continuation after deployment.

## Application to AI Agent Orchestration

The design-as-dialog principle has profound implications for how agent orchestration systems should be built and operated.

### Against Over-Specification of Agent Pipelines

Sequential process models manifest in agent systems as rigid, pre-specified pipelines: Task → Decomposition → Skill Selection → Execution → Aggregation → Output. This works when the task is well-understood and the solution approach is established. It fails when the task is complex, novel, or ambiguous — precisely the cases where sophisticated agent orchestration adds the most value.

A dialog-based approach to agent orchestration means:

**Decomposition is a hypothesis, not a prescription**: The initial decomposition of a complex task is an informed guess about what sub-problems need to be solved. As sub-agents execute and return results, the orchestrator should treat those results as new information that may warrant revising the decomposition.

**Skill selection is contextual and adaptive**: Rather than selecting skills once at task intake based on the initial problem framing, the orchestrator should re-evaluate skill selection as understanding of the problem evolves. A task that initially looked like a data analysis problem may reveal itself to be a problem of ambiguous requirements — and the skill set needed shifts accordingly.

**Intermediate outputs are inputs to problem understanding**: In a sequential model, intermediate outputs are inputs to the next stage of processing. In a dialog model, intermediate outputs are also inputs to *understanding* — they may reveal that the original problem framing was wrong, that a constraint was missed, or that the goal has shifted.

### The Opportunistic Orchestrator

The paper describes effective design teams as "somewhat opportunistic" — exploiting information as it arrives rather than waiting for it to arrive in the expected sequence. An effective orchestrating agent should be similarly opportunistic:

- If a sub-agent returns a result that contains useful information for a *different* branch of the task than the one it was assigned to, route that information accordingly
- If a sub-agent encounters an unexpected constraint or reveals an unexpected dependency, use that as input to revise the overall plan
- If early results suggest the original decomposition is wrong, be willing to restructure mid-execution rather than proceeding with a plan that no longer fits

### The Finishing-the-Design Principle

Perhaps the most powerful design insight from this paper, as illustrated in the Global Weather Management case, is the principle of allowing users (or downstream agents) to "finish the design." Rather than designing for a specific, anticipated use case, design for a range of use cases by exposing enough control and flexibility that operators can adapt the system to changing conditions.

For agent systems: **build meta-level flexibility into pipelines**. This means:
- Orchestrators should be able to modify active pipelines in response to new information, not just execute pre-specified plans
- Skills should expose their uncertainty and confidence levels, enabling orchestrators to use this information in routing decisions
- The system should maintain a model of "what we currently understand about this problem" that can be updated as execution proceeds — not just a task queue

### When Sequential IS Appropriate

The design-as-dialog principle has important boundary conditions:

- **Familiar, well-scoped tasks**: When the task type is well-understood and the solution approach is established, sequential execution is efficient and appropriate. Dialog adds overhead that isn't worth paying when there's nothing genuinely uncertain to discover.
- **Time-critical execution**: When latency is critical, the overhead of iterative reframing may be unacceptable. Sequential pipelines are faster when the initial decomposition is reliable.
- **Compliance-constrained environments**: Some regulated domains require traceable, auditable sequential processes. Design-as-dialog may be appropriate at the design level but require sequential documentation for compliance.

The signal for when dialog matters: **novelty and ambiguity in the problem, consequence to getting it wrong, and presence of domain knowledge that isn't fully captured in the initial task specification**.