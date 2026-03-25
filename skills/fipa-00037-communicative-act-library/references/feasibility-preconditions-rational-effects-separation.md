# The Feasibility-Effect Gap: Why Agent Communication Cannot Guarantee Outcomes

## Core Principle

The FIPA ACL specification makes a foundational architectural choice that every agent system designer must internalize: **every communicative act has feasibility preconditions (FP) that determine when it can be rationally performed, and rational effects (RE) that represent what the sender intends to achieve—but achieving the RE is never guaranteed.**

This is not a bug or limitation. It is the formal recognition that in a multi-agent system, **agents are autonomous**. No agent can force another agent's mental states or actions. This separation is the difference between building a distributed system of independent reasoners versus building a monolithic system with message-passing as an implementation detail.

## The Formal Structure

For any communicative act, the specification defines:

```
<i, act(j, content)>
  FP: φ₁  (feasibility preconditions)
  RE: φ₂  (rational effect)
```

**Feasibility Preconditions**: These are conditions on the sender's mental state that must hold for the act to be rational to perform. For an inform act:

```
<i, inform(j, φ)>
  FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  RE: Bⱼφ
```

Translation: "Agent i can inform j that φ if i believes φ AND i doesn't believe that j already knows whether φ is true or likely true."

**Rational Effect**: This is what the sender intends to achieve. For inform, the RE is Bⱼφ—that j comes to believe φ. But this is i's *intention*, not a guaranteed outcome.

## Why the Gap Exists

The specification states explicitly (Property 4, section 5.3.4): "When an agent observes a CA, it should believe that the agent performing the act has the intention to achieve the rational effect of the act." Note: *should believe the sender has the intention*, not *should adopt the belief*.

Three fundamental reasons prevent guaranteed effects:

1. **Autonomy**: Agent j may distrust i, have conflicting information, or use different reasoning methods. j is *entitled* to believe that i believes φ, but whether j *adopts* φ depends on j's trust model, prior beliefs, and rationality criteria.

2. **Feasibility vs. Success**: Even if i satisfies all FPs, j may be unable to perform the requested action. The specification models this with the refuse act: j can inform i that the requested action is not feasible from j's perspective.

3. **Asynchrony and Timing**: By the time j receives and processes the message, the world may have changed. The RE represents i's intention *at the time of sending*, not a guarantee about future states.

## Implications for Agent System Design

### 1. Never Assume Compliance

When your orchestration system sends a request to an agent:

```
<orchestrator, request(worker, perform-task)>
  FP: FP(perform-task)[orchestrator\worker] ∧ 
      Bₒᵣcₕₑₛₜᵣₐₜₒᵣ Agent(worker, perform-task) ∧ 
      ¬Bₒᵣcₕₑₛₜᵣₐₜₒᵣ Iworker Done(perform-task)
  RE: Done(perform-task)
```

**Do not proceed as if the task will be done.** The RE is orchestrator's intention. The worker may:
- Send refuse (cannot do it)
- Send agree but then failure (tried but failed)
- Send agree and succeed (the happy path)
- Not respond at all (timeout case)

Your system must explicitly handle all these outcomes. The specification forces you to design for the realistic case: agents don't comply, they negotiate.

### 2. Design for Explicit Rejection

The specification includes refuse and failure as first-class acts precisely because non-compliance is normal:

```
<worker, refuse(orchestrator, <worker, perform-task>, reason)>
  FP: Bworker ¬Feasible(<worker, perform-task>) ∧ 
      Bworker(Bₒᵣcₕₑₛₜᵣₐₜₒᵣ Feasible(<worker, perform-task>) ∨ 
              Uₒᵣcₕₑₛₜᵣₐₜₒᵣ Feasible(<worker, perform-task>))
  RE: Bₒᵣcₕₑₛₜᵣₐₜₒᵣ ¬Feasible(<worker, perform-task>)
```

The worker explicitly informs the orchestrator that the task is not feasible. This is not an error—it's a rational response. Your orchestration layer must treat refuse as valuable information: "I asked agent X to do Y, X has informed me it cannot, what's my next step?"

### 3. Model Intentions, Not Commands

The specification's formalism treats all communication as *informing about intentions*:

```
<i, request(j, a)> ≡ 
  "i informs j that i intends that j performs action a"
```

Not: "i commands j to do a"
Not: "i expects j to do a"

This is subtle but critical. In a command-control architecture, failed compliance is a system failure. In an intention-based architecture, failed compliance is *data*—it tells you about the world (j cannot or will not do a) and triggers replanning.

### 4. Use Agree/Refuse to Model Commitment

The specification provides agree as a way for j to inform i that j *does* intend to perform the action:

```
<j, agree(i, <j, action>, φ)> ≡
  <j, inform(i, Iⱼ Done(<j, action>, φ))>
```

This creates a social commitment: j has publicly stated an intention. But even this is not a guarantee—j may later fail and send failure:

```
<j, failure(i, action, reason)>
```

Your orchestration system should track these commitment states: requested → (agreed | refused) → (done | failed). This state machine is not implementation detail—it's fundamental to multi-agent coordination.

## The Alternative: Synchronized Distributed Systems

If you need guaranteed execution, you don't have a multi-agent system—you have a distributed system with synchronized components. The FIPA model explicitly rejects this:

- In synchronized systems: send(command) blocks until acknowledged
- In agent systems: send(request) returns immediately; outcome is learned through subsequent messages

The FIPA approach scales better (no blocking), handles failure gracefully (explicit refuse/failure messages), and models realistic scenarios (agents have private goals and may rationally decline requests).

## Practical Design Pattern: Request-Agree-Inform

A robust multi-agent protocol:

1. **Orchestrator requests**: "Do you intend to perform X?"
2. **Agent responds with agree or refuse**: "Yes, I will when φ holds" or "No, because ψ"
3. **Agent later informs of completion or failure**: "X is done" or "X failed because ω"

Each step is a separate communicative act with its own FP and RE. The orchestrator never assumes compliance—it waits for explicit confirmation at each stage.

## When Does This Matter Most?

### High Autonomy Domains
When agents represent independent organizations, humans, or systems with private objectives. A supply chain where each company's agent has its own goals—requests are negotiations, not commands.

### Failure-Prone Environments
When actions can fail for environmental reasons. A robot swarm where each robot may lose power, encounter obstacles, or have sensor failures—the orchestrator must track explicit success/failure reports.

### Trust-Limited Systems
When agents may be unreliable or adversarial. A market where agents may lie, defect, or have incentive to misreport—the gap between RE and actual outcome captures this trust problem formally.

### Scale and Latency
When systems are large and asynchronous. A cloud orchestration system managing thousands of services—blocking on guarantees doesn't scale; designing for eventual consistency with explicit status messages does.

## The Deep Lesson

The feasibility-effect gap is not a weakness of the FIPA model—it's the formalization of a fundamental truth about distributed intelligence: **you cannot control what you do not inhabit**. 

An agent system that assumes guaranteed rational effects is either:
1. Not actually a multi-agent system (it's a disguised monolith), or
2. Silently ignoring autonomy and will fail when agents don't comply

The FIPA specification forces honest design: if you want j to do something, you must:
- Check your FPs before requesting (am I entitled to ask?)
- Accept that j may refuse (plan for refusal)
- Wait for j's response (don't assume compliance)
- Handle failure explicitly (j may try and fail)

This is how intelligence coordinates without central control. This is how DAGs of agents should actually work.