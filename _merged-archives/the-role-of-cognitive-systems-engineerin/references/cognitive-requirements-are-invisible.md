# Cognitive Requirements Are Invisible: Why Agent Systems Must Surface What Designers Assume

## The Core Problem

When engineers build systems — whether information technologies, decision support tools, or AI agent orchestration platforms — they make constant assumptions about the cognitive requirements of the work those systems will support. These assumptions are usually implicit. They are rarely verified. And they are systematically wrong in predictable ways.

Militello, Dominguez, Lintern, and Klein open their synthesis of Cognitive Systems Engineering (CSE) with a blunt observation: "It is possible to design information technologies without bringing in CSE specialists. Many have done so. The design team simply ignores the cognitive requirements for the systems they are specifying, and directs its energy towards meeting the physical specifications. In other cases the design team makes assumptions about cognitive requirements, extrapolating their experience to anticipate the needs of the workers. Occasionally their assumptions are correct. We tend to hear about the cases where their assumptions were dramatically wrong."

The authors cite Charles Perrow's *Normal Accidents* as the canonical documentation of what happens when assumptions go dramatically wrong. But the more insidious problem is not the dramatic failure — it is the quiet, accumulating degradation of system usefulness when cognitive requirements are addressed superficially or not at all.

## What "Cognitive Requirements" Actually Means

The paper defines cognitive complexity as encompassing "activities such as identifying, judging, attending, perceiving, remembering, reasoning, deciding, problem solving, and planning." This is not merely about user interface aesthetics or information display. It is about the entire structure of how competent practitioners *think* in the context of their work:

- What cues do experts attend to, and in what order?
- What decisions are the hardest, and why?
- What mental models do practitioners carry about the system state?
- Where does workload spike, and what degrades under that load?
- What workarounds have practitioners invented because the official process doesn't match the actual work?
- What are the competing goals and constraints that create genuine dilemmas?

These requirements are *invisible* because they live in the heads of practitioners, expressed through behavior that appears fluid and effortless to observers precisely because expertise has made it so. The CSE insight is that fluency masks complexity — what looks simple is often the product of years of pattern recognition and tacit knowledge that no amount of engineering intuition will reconstruct.

## Why Agent Systems Face This Problem Acutely

An AI agent orchestration system like WinDAGs faces a version of this problem at multiple levels simultaneously:

**Level 1: The agents themselves.** Each agent invokes skills — specialized capabilities designed by someone who made assumptions about what that skill needs to accomplish and what information it needs to do so. Those assumptions may be wrong, incomplete, or appropriate for a different context than the one in which the skill is actually invoked.

**Level 2: The orchestration logic.** The system that routes tasks, sequences agents, and decides when to decompose or synthesize makes implicit assumptions about how complex problems are structured, what subtask boundaries are natural, and what information must flow between agents. These assumptions encode a model of cognitive work that may or may not match the actual work.

**Level 3: The interface to human operators.** Any human who monitors, audits, corrects, or collaborates with the agent system is performing cognitive work. The system's outputs, explanations, confidence signals, and escalation triggers either support or hinder that cognitive work — and designers of those outputs almost certainly made assumptions that were wrong in some contexts.

**Level 4: The domain being addressed.** When an agent system is deployed to support, say, security auditing or medical diagnosis or mission planning, the domain itself has cognitive structure — expert practitioners have developed tacit knowledge, heuristics, and decision patterns that represent the accumulated wisdom of the field. A system that ignores this structure will produce outputs that are technically correct but pragmatically useless, or worse, actively misleading.

## The Two Failure Modes

The paper implicitly describes two distinct failure modes when cognitive requirements remain invisible:

**Failure Mode 1: The Rejected System.** The system is built, deployed, and then abandoned because workers find it more hindrance than help. The Cedars-Sinai physician order entry system is the authors' primary example: "After just a few days of use, however, doctors complained of problems ordering medications, tests, and supplies and the hospital took the software offline." The FBI TRILOGY system was cancelled after $170 million in development because it was "flawed and unfixable" — discovered only during testing, never deployed at all. These failures are visible and costly, but they at least produce a clear signal.

**Failure Mode 2: The System That Looks Like It Works.** More dangerous is the system that is used but that subtly degrades the cognitive performance of its users — creating automation surprises (Sarter, Woods, and Billings, 1997), increasing error rates in edge cases, or training users into dependency patterns that fail catastrophically when the system is unavailable or wrong. This failure mode is nearly impossible to detect without deliberate CSE-style analysis because it doesn't produce a visible crisis.

For agent systems, the equivalent of Failure Mode 2 is an orchestration pipeline that handles common cases well but systematically fails on the cases that matter most — the edge cases, the high-stakes decisions, the situations that require genuine expert judgment rather than pattern matching. These are precisely the situations where invisible cognitive requirements are most consequential.

## Making the Invisible Visible: CSE Methods as Diagnostic Tools

The paper describes a family of methods developed specifically to surface cognitive requirements:

**Cognitive Task Analysis (CTA)**, particularly the Critical Decision Method, elicits knowledge about challenging situations from expert practitioners. The key insight is that challenging situations — near-misses, unusual cases, the decisions that kept an expert up at night — are where the cognitive structure of expertise becomes visible. Routine situations compress expertise into automaticity; hard cases expose the underlying reasoning.

**Cognitive Work Analysis** examines the functional structure of work and the constraints within which workers must operate, independent of how any particular practitioner happens to approach the work. This produces a model of the *work system* rather than the *worker* — valuable for understanding what any competent practitioner must be able to do, regardless of individual differences in approach.

**Applied Cognitive Work Analysis** extends these products directly into design artifacts — "steps and corresponding artifacts to transform the cognitive demands of a complex work domain into graphical elements of an interface."

For agent system design, the translation of these methods suggests several concrete practices:

1. **Before defining agent skills, interview domain experts about their hardest cases.** What decisions do they find genuinely difficult? What information do they wish they had? Where do they most often find their initial assessment was wrong? The answers define the cognitive requirements that agent skills must support.

2. **Treat skill failures as diagnostics, not defects.** When an agent skill produces a wrong or unhelpful output, the first question should not be "how do we fix this skill?" but "what does this failure reveal about our model of the work this skill is supposed to support?"

3. **Map the constraint structure of the domain, not just the task sequence.** What are the hard limits within which any solution must operate? What are the competing goals that create genuine tradeoffs? This constraint map should drive agent design at least as much as any procedural task description.

4. **Distinguish between what experts say they do and what they actually do.** CTA methodology exists precisely because expert practitioners are often poor narrators of their own cognitive processes. Verbal protocols, observation, and incident analysis all converge on a more accurate model than self-report alone.

## The Boundary Condition

This principle applies most strongly when:
- The work being supported is genuinely cognitively complex (high uncertainty, time pressure, competing goals, expert judgment required)
- The practitioners who will work with the system have developed real domain expertise
- The cost of errors is high
- The system will be used in conditions that differ from those imagined during design

It applies less strongly when:
- The task is genuinely procedural and well-defined
- The domain is fully formalized (pure mathematics, rule-following)
- The system replaces rather than supports human judgment

For WinDAGs specifically: the 180+ skill ecosystem almost certainly contains skills whose design assumptions are wrong or incomplete for at least some invocation contexts. The question is not whether this is true but how to find it — and the CSE answer is: look for the failures, especially the subtle ones, and treat them as the most valuable design information you have.