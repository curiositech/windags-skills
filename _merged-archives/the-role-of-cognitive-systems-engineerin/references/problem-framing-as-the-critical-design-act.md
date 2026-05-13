# Problem Framing as the Critical Design Act: Why Solving the Wrong Problem Is the Primary Failure Mode

## The Nuclear Power Plant Lesson

The most instructive case study in Militello et al. (2009) involves the redesign of an emergency operations facility at a nuclear power plant following an adverse event. It deserves extended examination because it illustrates, with almost shocking clarity, how deeply wrong a confident, experienced team can be about what problem they are actually facing.

After an unplanned shutdown triggered by an adverse event, the plant's management concluded that:
- Workload had been too high during the emergency
- More information technology was needed to manage complexity
- More staff were needed to handle the load
- The challenge: the facility was already crowded with 80 emergency response personnel

Their logic was coherent. Their diagnosis was wrong.

A CSE study combining Critical Decision Method interviews with drill observations identified the *actual* problems:

- The emergency response team had **poorly defined roles and functions**
- Most key decision makers **were not making any decisions at all**
- Some personnel **were irrelevant** to emergency responses
- The emergency director **was a bottleneck**
- The facility layout **was inefficient**
- Staff size was **too high**, not too low

The solution, consequently, was radically different from what was planned: positions were rearranged by coordination requirements; a simple status board was introduced for situation awareness; staff was *reduced* from 80+ to 35. Approximately 50 recommendations were implemented — **none involving information technology**.

The assessment by both plant managers and the Nuclear Regulatory Commission was that the plant "scored extremely well." They were removed from the watch list for extra drills, saving millions of dollars.

The authors draw the direct implication: "One might say that the plant had an inadequate statement of the problem." (p. 8)

This is not a minor refinement. The original plan would have added cost, complexity, and staff while doing nothing to fix the actual problems — role confusion, decision bottlenecks, and layout inefficiency. More technology would likely have *worsened* the situation by adding more complexity for an already overloaded decision bottleneck to manage.

## Why Problem Mis-Framing Is Ubiquitous

The pattern of confidently solving the wrong problem is not an anomaly. It has structural causes:

**Availability bias in diagnosis**: Problem-owners diagnose based on what is visible and memorable. In the nuclear case, the visible symptom was high workload and a near-accident. The visible solution was more resources. The *structural* causes — role confusion, bottlenecks, layout — were invisible without systematic inquiry.

**Technology as default solution**: When organizations experience system failures, there is strong institutional pressure to respond with new technology. Technology is tangible, purchasable, demonstrable, and legible to stakeholders. Organizational restructuring and role redefinition are messy, political, and harder to point to. This creates systematic bias toward technical solutions for organizational and cognitive problems.

**The expert extrapolation trap**: Managers and engineers bring their own cognitive models to problem diagnosis. The nuclear plant managers had expertise in plant operations; they extrapolated that expertise to conclude that more of what they knew (technology, staff) would fix the problem. CSE revealed that the problem was in the *organization of cognition* — a domain outside their training.

**Escalating commitment**: Once a problem frame is established, it generates its own momentum. Vendor relationships are initiated. Budgets are allocated. Stakeholders form expectations. Challenging the problem frame requires not just intellectual courage but political capital.

## The Three-Stage Problem-Framing Cascade

Militello et al. reveal that problem mis-framing cascades through subsequent design decisions:

**Stage 1 — Problem Statement**: If the problem is stated incorrectly, every subsequent step optimizes for the wrong target. The SIMILAR process model used in systems engineering begins with "State the Problem" — and if this step fails, no amount of sophisticated engineering in subsequent steps can correct it.

**Stage 2 — Alternatives Considered**: The problem statement determines the solution space that is even considered. If the nuclear plant's problem had been correctly stated as "role confusion and decision bottlenecks," alternatives like organizational restructuring and role redefinition would have been on the table from the start. With the incorrect problem statement, these solutions were invisible.

**Stage 3 — Evaluation Metrics**: How you measure success depends on what problem you believe you are solving. If the problem is "insufficient capacity," success looks like "more staff processed more decisions." If the problem is "decision bottlenecks and role confusion," success looks like "fewer people making clearer decisions faster." Using the wrong metrics can make a successful system look like a failure and a failed system look like a success.

## The CSE Reframing Method

What enables CSE to reframe problems correctly when domain experts cannot? The answer lies in methodological stance:

**Empirical inquiry before prescription**: CSE practitioners observe actual work before proposing solutions. The nuclear plant study used Critical Decision Method interviews *and* observations of drills — grounding the analysis in what actually happened, not what the manual says should happen.

**Treating errors as data**: "CSE does not impose a formal normative theory of how people think (or 'should' think). Instead, the study of each work domain involves a process of discovery, wherein errors are considered interesting openings for further inquiry." (p. 3) The adverse event at the nuclear plant was not a deviation to be corrected by more procedure — it was a signal revealing a structural problem.

**Functional analysis of constraints**: Cognitive Work Analysis specifically examines "the functional structure of work" to identify "the constraints within which workers must operate." This reveals what work *requires* regardless of what any specific worker happens to be doing. Constraint analysis reveals the problem structure that surface symptoms only hint at.

**First-person perspective**: The Work-Centered Design principle of First-Person Perspective — using the worker's own terminology and goals as the frame of reference — prevents analysts from imposing their own conceptual models on the problem domain.

## Application to AI Agent System Design and Orchestration

This principle has direct and powerful implications for agent system design:

### Problem Framing at Task Intake

When a complex task enters a WinDAGs orchestration system, the primary failure risk is not in skill execution — it is in problem framing. The agent or meta-agent responsible for task decomposition must ask:

1. **Is the stated problem the actual problem?** User-stated problems often reflect the user's mental model of the solution domain, not the underlying need. "Build me a dashboard that shows all our metrics" may actually be "help us identify which metric movements require urgent action."

2. **What constraints bound the real problem?** Before decomposing a task, identify the constraints — time, resources, dependencies, downstream effects — that define what solutions are actually feasible and appropriate.

3. **What assumptions are embedded in the task framing?** Every problem statement carries implicit assumptions about what kind of solution is appropriate. Making these assumptions explicit allows them to be tested.

4. **What would "success" look like from the perspective of the ultimate goal?** Not the stated task, but the goal the task is meant to serve.

### The Mis-Framing Detection Skill

Agent systems benefit from a dedicated problem-reframing capability that applies CSE-style inquiry:

- Does the stated problem assume a specific type of solution? (Technology when the problem may be process; automation when the problem may be information design)
- Is the problem framed around symptoms or causes?
- What expertise, when interviewed, would likely reveal a different problem structure?
- Are there precedents in adjacent domains where this problem framing led to expensive failure?

### Cascading Commitment in Agent Pipelines

Once a task is decomposed and sub-tasks assigned, the system develops commitments analogous to the nuclear plant's vendor relationships and budget allocations. Sub-agents begin executing, context windows fill with work product from the initial framing, and challenging the original decomposition becomes increasingly costly.

This suggests that **problem framing validation should be a gate, not a byproduct**. Before committing to a decomposition plan, a meta-agent should perform an explicit reframing check: "Given what we now know, is this still the right problem to be solving, and is this still the right decomposition?"

### The Simplicity Dividend

The nuclear plant case demonstrates what might be called the *simplicity dividend* of correct problem framing: the actual solution was simpler, cheaper, and more effective than the originally planned solution. This is not a coincidence — complex, expensive solutions are often signs of solving the wrong problem. When a proposed solution requires many moving parts, large resource investment, and exotic capabilities, it is worth asking whether the problem has been correctly stated. Correct framing frequently reveals simpler solutions.

For agent systems: when a task decomposition produces an unexpectedly complex multi-agent pipeline, treat that complexity as a signal to revisit the problem framing rather than automatically proceeding with the complex plan.