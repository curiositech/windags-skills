# Failure Modes in Cognitively Complex Systems: What CSE Warns Against

## The Characteristic Failures

Cognitive Systems Engineering did not emerge from theoretical interest. It emerged from disasters: the Three Mile Island partial core meltdown in 1979 that prompted Cognitive Work Analysis; the USS Vincennes shoot-down of Iran Air Flight 655 in 1988 that prompted Decision-Centered Design and the TADMUS program; a decade of expensive, rejected information technology systems that prompted each of the five major CSE frameworks described in the paper.

Each disaster is a case study in how cognitive failures in complex sociotechnical systems emerge not from incompetence but from systematic mismatches between system design and actual cognitive requirements. Understanding these failure patterns is directly relevant to designing agent systems that avoid them.

The paper's failure taxonomy, assembled from its case studies and references, identifies five primary failure modes. Each has a direct analog in AI agent system design.

---

## Failure Mode 1: Automation Surprises

The paper cites Sarter, Woods, and Billings (1997) on "automation surprises" — situations where automated systems behave in ways their human partners do not expect and cannot predict. The canonical case is advanced aircraft automation that transitions between modes, changes flight parameters, or takes control of the aircraft in response to conditions that the pilot has not noticed or does not fully understand.

Automation surprises emerge when:
- Automated systems take actions that are not directly observable or legible to human partners
- The conditions that trigger automation behaviors are not fully understood by human operators
- The system's internal state (what mode it is in, what it is about to do) is not adequately communicated
- Human operators develop incorrect mental models of automation behavior that are not corrected until failure

The deeper principle is that automation behaves as a *team member* in a joint cognitive system, and any team member whose actions and reasoning are opaque to other team members degrades the performance of the joint system — even if the automation's individual performance is excellent.

**Agent system analog:** An orchestration agent that silently re-routes tasks, escalates or de-escalates priority, or modifies problem decompositions without making those changes visible to monitoring agents or human operators creates automation surprises. An agent that produces confident-looking outputs without signaling uncertainty creates automation surprises. Any component whose behavior under novel conditions cannot be anticipated by the agents and humans it coordinates with is a source of automation surprises waiting to manifest.

Design response: every agent in the system should maintain legibility — its state, its actions, its uncertainty, and its reasoning should be available to other system participants at appropriate granularity. This is not just a monitoring convenience; it is a fundamental requirement for joint cognitive system performance.

---

## Failure Mode 2: The Wrong Problem Statement

The nuclear plant case is the canonical example in this paper, but the phenomenon is general: "Without CSE, the design process can be fixated on a narrow set of procedures that make it look like the technology will be very helpful. It is easy to assume that if the worker follows a set of simple, prescribed steps, then the system will operate smoothly and safely."

This failure mode is insidious because it does not look like a failure during design. The problem statement looks reasonable. The solution is coherently designed to address it. Testing validates that the solution solves the stated problem. Only when the system meets actual work does the mismatch between the stated problem and the actual problem become apparent.

The $170 million TRILOGY case is an instance of this failure mode at maximum scale: a system designed to solve a problem that turned out not to be the actual problem, discovered during testing after full development expenditure.

The paper names the mechanism: "CSE helps designers move beyond a superficial, oversimplified view of the work system to create systems that better support complexity and uncertainty in the real world." The superficial view makes the design look solid; the actual complexity, hidden by normative models and engineering intuitions, is what eventually destroys the design.

**Agent system analog:** An orchestrator that executes against a task specification without interrogating whether that specification correctly describes the actual problem. A skill that optimizes for a metric that is measurable but not actually important. A decomposition strategy that breaks problems along technically convenient boundaries that don't correspond to the natural structure of the domain.

Design response: invest explicitly in problem-framing capability. Build in mechanisms for agents to signal that the stated problem appears to be the wrong problem. Treat task specifications as hypotheses to be tested, not contracts to be executed.

---

## Failure Mode 3: Stove-Piping and Coordination Fragmentation

The Work-Centered Design framework emerged from a specific observed failure pattern at the US Air Force Air Mobility Command: "multiple databases, collaborative systems, and decision support systems, each of which used different interface design conventions. This lack of a unifying structure resulted in unneeded complexity and increased likelihood of error as users were required to maintain expertise not only in the content area of the job... but also in how to use a broad range of technological interfaces."

This is not an interface design problem — it is a joint cognitive system problem. When the components of a system are built independently, each optimized for its own function, the cognitive cost of coordination between components falls on the human operators who must bridge between them. This cognitive overhead is not visible in any component's performance metrics; it accumulates invisibly in operator workload, error rates, and the informal workarounds practitioners develop to manage systems that don't work together.

**Agent system analog:** A 180+ skill ecosystem where each skill was designed independently, uses its own internal representation conventions, produces outputs in formats optimized for its own domain, and has no coherent interface with the other skills it will routinely coordinate with. The orchestration layer then bears the full cognitive cost of translation between incompatible representations — a cost that grows super-linearly with the number of skills that must interact.

Design response: establish shared information architecture standards across skills. Ensure that skills that routinely interact are designed around shared vocabulary and representation conventions. Invest in the orchestration layer's ability to manage between-skill translation, but do not treat this as a sufficient substitute for coherent system-level design.

---

## Failure Mode 4: Overspecification and Rigidity

The paper contains a strong argument against overformalization: "There is an almost universal call for design to be formalized and standardized. We regard that as both unrealistic and as counterproductive. Too much success in that direction will stifle innovation, which is the touchstone of design."

This applies not just to the design process but to the systems being designed. Systems that are overspecified — that assume work follows a well-defined procedure, that the situations they will encounter are within the space of situations anticipated during design — are brittle against the "never ending creativity of humans as they adapt technologies and processes to accomplish work tasks, as well as the many unexpected situations that arise in a changing world."

The paper points to features that would allow end users to "finish the design" as the appropriate response to this failure mode in the Global Weather Management case — building in the flexibility for practitioners to adapt the system to conditions that the designers couldn't fully anticipate.

**Agent system analog:** An orchestration architecture so rigidly specified that it cannot handle problem structures that differ from those encountered during development. A skill library that handles nominal cases well but has no graceful degradation path for cases that fall outside its training distribution. A decomposition strategy that assumes problems have the structure of problems already seen.

Design response: design for adaptability explicitly. Include mechanisms for agents to handle out-of-distribution cases gracefully — signaling uncertainty, seeking clarification, escalating to human judgment, or applying more general-purpose reasoning when specialized skills fail. The system should be more robust to unexpected situations, not less robust, as it encounters more of them.

---

## Failure Mode 5: The Expert Bottleneck

The nuclear plant case reveals this failure mode in its purest form: "The emergency director was a bottleneck." In the original emergency response organization, key decisions were concentrated in a single role, creating a fragility point where the performance of the entire system depended on the cognitive capacity of one person under extreme stress.

This is a structural failure of the joint cognitive system: the system's cognitive architecture created a dependency on a single node that could not scale under load. The solution was redistribution — redefining roles and communication pathways so that cognitive work was distributed more resilience.

**Agent system analog:** An orchestration architecture where all complex reasoning routes through a single agent or a single decision point. A system where one central orchestrator must fully understand every subtask it delegates in order to coordinate them. A skill design where one skill's output is required by all other skills before any can proceed.

Design response: design cognitive architecture for resilience by distributing decision-making capacity across multiple nodes. The orchestrator should not be required to understand every subtask fully — it should be able to coordinate based on interface-level specifications while subtasks are handled autonomously. Critical path analysis of information and decision flow should identify bottlenecks before they manifest as performance failures.

---

## The Meta-Failure: Hindsight Bias in Failure Analysis

The paper contains an important methodological caution that applies to failure analysis generally: Woods et al.'s work on "Behind Human Error: Cognitive Systems, Computers, and Hindsight" (1994) argues that post-hoc failure analysis systematically distorts our understanding of why failures occurred by making the information that would have prevented the failure appear more available than it actually was at the time.

When we analyze a failure after the fact, we know the outcome, and that knowledge makes certain pre-failure signals appear salient and obvious. We ask: why didn't the operators recognize this signal? Why didn't the system catch this error? The question assumes that the operators and system should have been able to recognize a signal that is salient only because we know what it predicted.

For AI agent systems, this means: failure analysis should be conducted in terms of what information was actually available at the time of the failure, not what information was available post-hoc. The question is not "what should the agent have done given everything we now know?" but "given what the agent could have known at the time, in the format it was available, was the failure a reasonable outcome of the information environment?"

This changes the design response. Hindsight-based analysis produces designs that are optimized for the specific failures that have already occurred, often at the cost of the flexibility needed for failures that haven't occurred yet. Information-environment-based analysis produces designs that improve the quality of the information environment — making critical signals more salient, reducing noise, improving situation awareness across the joint system — which addresses a broader class of failures.

---

## Integrated Failure Prevention Framework

The CSE framework, synthesized across these failure modes, suggests several principles for failure-resistant design:

1. **Make system state legible.** Every component of the joint system should be able to understand the state, actions, and reasoning of every other component at the granularity needed for effective coordination.

2. **Invest in problem framing before execution.** The single highest-leverage failure prevention investment is ensuring the problem being solved is the right problem.

3. **Design for the joint system, not just components.** Failure modes that emerge at interfaces between components will not be caught by testing individual components.

4. **Build in adaptability for unanticipated situations.** Systems designed only for anticipated cases are brittle. Graceful degradation and escalation pathways are essential.

5. **Distribute cognitive load and decision-making capacity.** Single points of cognitive failure are as dangerous as single points of technical failure.

6. **Treat errors as diagnostics, not defects.** Every failure contains information about the mismatch between the system's model of work and work's actual structure. Mining that information is a continuous design activity.