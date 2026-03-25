## BOOK IDENTITY

**Title**: FIPA Communicative Act Library Specification
**Author**: Foundation for Intelligent Physical Agents (FIPA)
**Core Question**: How can autonomous agents communicate with precise, interoperable semantics in a way that enables rational planning, coordination, and goal achievement without central control?
**Irreplaceable Contribution**: This specification provides the only formally grounded, modal logic-based semantics for agent communication acts that explicitly separates feasibility preconditions (what must be true to perform an act) from rational effects (what the sender intends to achieve). It demonstrates how complex coordination emerges from composing primitive acts with precise mental attitude semantics (belief, uncertainty, intention) rather than from predefined workflows or centralized orchestration.

## KEY IDEAS (3-5 sentences each)

1. **Separation of Feasibility Preconditions and Rational Effects**: Every communicative act has two critical components: feasibility preconditions (FP) that define when an act CAN be performed, and rational effects (RE) that define what the sender INTENDS to achieve. Crucially, achieving the RE is never guaranteed—the recipient is autonomous and may refuse, fail, or ignore the request. This separation enables agents to plan actions rationally (selecting acts whose RE matches their intentions) while maintaining realistic expectations about outcomes in a multi-agent system where no agent controls another.

2. **Mental Attitudes as the Foundation of Semantics**: The formal model uses modal operators for Belief (B), Uncertainty (U), and Intention (I) to define what it means for agents to communicate. An agent can only inform another of proposition φ if it believes φ (sincerity condition), and should only do so if it doesn't believe the receiver already knows φ (relevance condition). This grounds communication not in syntactic message exchange but in the rational management of distributed mental states—exactly what multi-agent systems require.

3. **Compositionality Through Action Expressions**: Complex coordination patterns emerge from composing primitive acts (inform, request, confirm, disconfirm) using operators: sequential (;), disjunctive choice (|), and conditional execution. A query-if is defined as requesting the recipient to inform-if, which itself is a disjunction of inform(φ) | inform(¬φ). This compositionality means agents don't need a library of hundreds of pre-programmed interactions—they can construct novel coordination patterns from primitives.

4. **Context-Relevance vs. Ability Preconditions**: Feasibility preconditions split into two types: ability preconditions (intrinsic capability—"can I assert φ?" requires believing φ) and context-relevance preconditions (appropriateness—"should I assert φ?" requires believing the recipient doesn't already know). This distinction enables agents to detect when they're capable of an action but it would be wasteful, redundant, or inappropriate—crucial for efficient multi-agent coordination at scale.

5. **No Guaranteed Perlocutionary Effects**: The specification explicitly states that rational effects are what the sender intends, not what actually happens. When agent i requests agent j to perform action a, the RE is Done(a), but this is i's intention—j may refuse, fail, or ignore the request. This realistic model of agency prevents designs that assume compliance and forces systems to handle non-cooperation, failure, and autonomy explicitly in their coordination protocols.

## REFERENCE DOCUMENTS

### FILE: feasibility-preconditions-rational-effects-separation.md

```markdown
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
```

### FILE: mental-attitudes-as-coordination-substrate.md

```markdown
# Mental Attitudes as the Substrate for Agent Coordination

## The Core Insight

The FIPA ACL semantics are grounded not in message syntax or protocol state machines, but in **modal operators over mental attitudes**: Belief (B), Uncertainty (U), and Intention (I). This is not merely a theoretical choice—it fundamentally changes how agent coordination works.

Traditional distributed systems coordinate through shared state, locks, transactions, or message acknowledgment. Agent systems coordinate through **mutual modeling of each other's mental states**. When agent i sends a message to agent j, i is not pushing data or invoking a remote procedure—i is attempting to shape j's beliefs and intentions.

## The Formal Primitives

The specification defines three modal operators:

**Belief (Bᵢφ)**: "Agent i believes proposition φ"
- Models: KD45 modal logic (belief is consistent, agents believe what they believe, and know what they don't believe)
- Key property: Bᵢφ ⇒ BᵢBᵢφ (introspection)
- Practical meaning: An agent's beliefs form a consistent, introspectively accessible worldview

**Uncertainty (Uᵢφ)**: "Agent i is uncertain about φ but thinks φ more likely than ¬φ"
- Strictly weaker than belief, strictly stronger than ignorance
- Mutually exclusive with belief: Bᵢφ ⇒ ¬Uᵢφ
- Practical meaning: Probabilistic or confidence-weighted knowledge states

**Intention (Iᵢφ)**: "Agent i intends to bring about φ"
- Derived from Choice (Cᵢφ, "i desires φ") + commitment until success/impossibility
- Generates planning: Iᵢφ ⇒ planning process to achieve φ
- Practical meaning: Goals that drive action selection

## Why Mental Attitudes, Not Message Types?

### Traditional Approach: Message-Type Coordination

Imagine designing agent communication with message types:

```
MESSAGE_TYPE: {QUERY, RESPONSE, COMMAND, ERROR, ...}
```

Each type triggers predefined handlers. This is how most distributed systems work. But this fails for multi-agent systems because:

1. **Semantic Ambiguity**: What does QUERY mean? "Tell me X" could be a request for information, a test of knowledge, a demand for proof, or a conversational filler. Without grounding in mental attitudes, there's no principled way to disambiguate.

2. **Context Insensitivity**: The same message means different things in different contexts. "The door is open" could inform (if you didn't know), confirm (if you were uncertain), or remind (if you forgot). Message-type systems hardcode context, which doesn't scale.

3. **Brittle Composition**: How do you compose QUERY + COMMAND to mean "ask who can do X, then tell them to do it"? Message-type systems require explicitly enumerating all compositions. The FIPA model composes naturally through mental attitude operators.

### FIPA Approach: Mental-Attitude Coordination

Every communicative act is defined in terms of what mental attitudes it requires (FP) and what mental attitudes it aims to create (RE):

```
<i, inform(j, φ)>
  FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  RE: Bⱼφ
```

This reads: "i can inform j of φ if i believes φ and i doesn't believe j already knows whether φ. The intended effect is j believes φ."

**Advantages**:

1. **Semantic Grounding**: Every act's meaning is precisely defined in terms of belief, uncertainty, and intention. No ambiguity.

2. **Context Sensitivity**: The FPs naturally encode context. i should only inform j if j doesn't already know—this isn't an extra rule, it falls out of the rationality constraints.

3. **Natural Composition**: Complex acts compose through modal operator logic. query-if is defined as request(inform-if), which expands to request(inform(φ) | inform(¬φ)), which has clear FPs and RE.

## Practical Implications for Agent System Design

### 1. Agents Must Model Each Other's Mental States

In a FIPA-compliant system, agent i cannot rationally send inform(j, φ) without modeling Bⱼφ. This has profound implications:

**Traditional orchestration**:
```python
def orchestrator_logic():
    for agent in agents:
        agent.send("QUERY", content)  # Broadcast to all
```

**Mental-attitude orchestration**:
```python
def orchestrator_logic():
    for agent in agents:
        if not self.believes_agent_knows(agent, content):
            if self.believes(content):
                agent.send(inform(content))
            elif self.uncertain(content):
                agent.send(query_if(content))
```

The orchestrator must maintain models of what each agent believes. This is not optional overhead—it's required for rational communication.

### 2. Message Redundancy is Irrational

The FP for inform includes ¬Bᵢ(Bᵢfⱼφ)—"i doesn't believe j knows φ". If i already believes j knows, sending inform violates rationality.

**Implication**: Your agent system should track what has been communicated to avoid redundant messages. If agent A already informed agent B of φ, agent C shouldn't also inform B of φ (unless C believes A's message failed).

This is formalized in the specification (section 2.1): "If an agent knows already that some state of the world holds (that the receiver knows proposition p), it cannot rationally adopt an intention to bring about that state of the world."

**Design pattern**: Maintain a shared or distributed belief tracking system:
```
BeliefTracker {
    agent_beliefs: Map<Agent, Set<Proposition>>
    
    fn should_inform(sender: Agent, receiver: Agent, φ: Proposition) -> bool {
        !self.agent_beliefs[receiver].contains(φ) &&
        !self.agent_beliefs[receiver].contains(¬φ)
    }
}
```

### 3. Confirmation vs. Information

The specification distinguishes three assertive acts based on the receiver's prior mental state:

- **inform**: Use when receiver has no knowledge of φ
  - FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  
- **confirm**: Use when receiver is uncertain about φ
  - FP: Bᵢφ ∧ BᵢUⱼφ
  
- **disconfirm**: Use when receiver believes φ but i believes ¬φ
  - FP: Bᵢ¬φ ∧ Bᵢ(Uⱼφ ∨ Bⱼφ)

**Practical difference**: Imagine an agent debugging system. Agent Worker reports status to Orchestrator:

- If Orchestrator hasn't asked, Worker should **inform**: "Task X completed"
- If Orchestrator asked "Is X done?" and seems uncertain, Worker should **confirm**: "Yes, X is done"
- If Orchestrator wrongly believes X failed, Worker should **disconfirm**: "No, X did not fail"

These aren't synonyms—they represent different rational responses to different belief states. A well-designed agent system selects the right act based on the recipient's modeled mental state.

### 4. Uncertainty as a First-Class State

Most systems model binary knowledge: known/unknown. The FIPA model adds uncertainty as a distinct state:

- **Belief (Bᵢφ)**: High confidence φ is true
- **Uncertainty (Uᵢφ)**: φ more likely than ¬φ, but not confident
- **Ignorance (¬Bᵢfᵢφ)**: No information about φ

This maps naturally to confidence scores, probabilistic reasoning, or evidence-based systems:

```python
class BeliefState:
    def __init__(self, confidence: float):
        self.confidence = confidence
    
    def is_belief(self) -> bool:
        return self.confidence > 0.9  # High confidence
    
    def is_uncertain(self) -> bool:
        return 0.6 <= self.confidence <= 0.9  # Moderate confidence
    
    def is_ignorant(self) -> bool:
        return self.confidence < 0.6  # Low or no information
```

When an agent queries another, it should use:
- **query-if** if ignorant (¬Bᵢfᵢφ)
- **request(confirm | disconfirm)** if uncertain (Uᵢφ)

### 5. Intention Drives Planning

The specification defines (Property 1, section 5.3.1):

"An agent's intention to achieve a given goal generates an intention that one of the acts known to the agent be done, such that its rational effect corresponds to the agent's goal."

Formally:
```
Iᵢφ ⇒ Iᵢ Done(a₁ | ... | aₙ)
```

Where each aᵢ has RE = φ.

**Practical meaning**: When an agent forms an intention, it automatically triggers planning for communicative acts that would achieve that intention.

**Example**: 
```
Orchestrator has: I_orchestrator(Task_X_completed)
This generates: I_orchestrator Done(<Worker, perform-task-X>)
Which leads to: <Orchestrator, request(Worker, perform-task-X)>
```

Your agent architecture should implement this as a planning loop:
1. Agent has intention Iφ
2. Agent searches for acts whose RE = φ
3. Agent checks FPs for those acts
4. Agent executes feasible act with highest expected utility

## The Deep Coordination Mechanism

The genius of the FIPA model is that **coordination emerges from mutual belief modeling without central control**.

When agent i requests agent j to perform action a:
1. i forms intention: Iᵢ Done(a)
2. i sends request, which informs j: Bⱼ(Iᵢ Done(a))
3. j models i's intention and decides whether to adopt: Iⱼ Done(a)
4. If yes, j sends agree, informing i: Bᵢ(Iⱼ Done(a))
5. Now both agents mutually believe j intends to do a: Bᵢ Bⱼ Iⱼ Done(a) ∧ Bⱼ Bᵢ Iⱼ Done(a)

This is **distributed commitment through shared mental state**, not through locks, transactions, or two-phase commit.

## When This Model Fails

The mental attitude approach assumes:

1. **Agents are rational**: They follow the FP→Act→RE pattern. An agent that violates FPs (e.g., informs without believing) breaks the model.

2. **Mental states are somewhat stable**: If agent beliefs change faster than communication latency, the model breaks down. High-frequency trading agents might face this.

3. **Computational tractability**: Maintaining mental models of other agents scales as O(n×m) where n=agents, m=propositions. Very large systems may need approximations.

## Design Recommendations

1. **Implement belief tracking**: Don't just send messages—track what each agent believes you've told them.

2. **Use acts that match belief states**: Don't inform when you should confirm. Let mental state dictate act selection.

3. **Model uncertainty explicitly**: If your agents have confidence scores, map them to belief/uncertainty/ignorance and use appropriate acts.

4. **Treat intention as the planning trigger**: When an agent needs something, it forms an intention, which triggers search for communicative acts with matching REs.

5. **Accept that mental models are approximations**: You can't perfectly know another agent's beliefs. Design for occasional mismatches (use not-understood to handle).

The mental attitude substrate is not theoretical overhead—it's the mechanism that enables agents to coordinate without a coordinator.
```

### FILE: compositional-communication-through-action-expressions.md

```markdown
# Compositional Communication: Building Complex Coordination from Primitive Acts

## The Compositionality Principle

The FIPA specification demonstrates a profound design principle: **you don't need a vast library of pre-defined communication acts; you need a small set of primitives and composition operators**. This is analogous to how programming languages work—you don't have a built-in command for every possible task, you have primitives (assignment, conditionals, loops) and composition mechanisms (sequencing, nesting, functions).

The FIPA model defines ~4 primitive acts (inform, request, confirm, disconfirm) and builds dozens of useful composite acts through action expression operators:

- **Sequential (;)**: a₁ ; a₂ means do a₁ then do a₂
- **Disjunctive (|)**: a₁ | a₂ means do either a₁ or a₂ (non-deterministic choice)
- **Conditional**: Done(a, φ) means do a when φ holds

From these, the specification derives acts like query-if, query-ref, inform-if, inform-ref, and entire interaction protocols.

## The Primitive Acts

### 1. INFORM (Assertive)

```
<i, INFORM(j, φ)>
  FP: Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
  RE: Bⱼφ
```

"i tells j that φ is true (i believes it, i doesn't think j already knows)"

### 2. REQUEST (Directive)

```
<i, REQUEST(j, a)>
  FP: FP(a)[i\j] ∧ Bᵢ Agent(j, a) ∧ ¬Bᵢ Iⱼ Done(a)
  RE: Done(a)
```

"i asks j to perform action a (a is feasible from i's perspective, j is the agent, j doesn't already intend to do a)"

### 3. CONFIRM (Assertive, specialized)

```
<i, CONFIRM(j, φ)>
  FP: Bᵢφ ∧ BᵢUⱼφ
  RE: Bⱼφ
```

"i tells j that φ is true when i knows j is uncertain about it"

### 4. DISCONFIRM (Assertive, specialized)

```
<i, DISCONFIRM(j, φ)>
  FP: Bᵢ¬φ ∧ Bᵢ(Uⱼφ ∨ Bⱼφ)
  RE: Bⱼ¬φ
```

"i tells j that φ is false when j believes or is uncertain that it's true"

Everything else is built from these through composition.

## Derived Acts Through Disjunction

### INFORM-IF: The Basic Disjunctive Pattern

The inform-if macro act illustrates the power of disjunction:

```
<i, INFORM-IF(j, φ)> ≡
  <i, INFORM(j, φ)> | <i, INFORM(j, ¬φ)>
```

**Meaning**: "i will inform j whether φ is true or false—whichever i believes"

**FPs and RE for disjunctive acts**:

```
FP: FP(inform(j, φ)) ∨ FP(inform(j, ¬φ))
  = (Bᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)) ∨ (Bᵢ¬φ ∧ ¬Bᵢ(Bᵢfⱼ¬φ ∨ Uᵢfⱼ¬φ))
  = Bᵢfᵢφ ∧ ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)

RE: RE(inform(j, φ)) ∨ RE(inform(j, ¬φ))
  = Bⱼφ ∨ Bⱼ¬φ
  = Bᵢfⱼφ
```

**Practical meaning**: The agent i commits to informing j of φ's truth value (whichever it is), provided i actually has a definite belief about φ and j doesn't already know.

**When performed**: Agent i receives this as a request and must choose which branch to execute:
- If Bᵢφ, execute inform(j, φ)
- If Bᵢ¬φ, execute inform(j, ¬φ)
- If neither (¬Bᵢfᵢφ), refuse the request (FPs not satisfied)

### QUERY-IF: Composed from REQUEST and INFORM-IF

Now build query-if by requesting an inform-if:

```
<i, QUERY-IF(j, φ)> ≡
  <i, REQUEST(j, <j, INFORM-IF(i, φ)>)>
```

**Expansion**:
```
<i, REQUEST(j, <j, INFORM(i, φ)> | <j, INFORM(i, ¬φ)>)>
```

**Meaning**: "i asks j to tell i whether φ is true or false"

**FPs** (applying the request FPs to the inform-if action):
```
FP: FP(<j, INFORM-IF(i, φ)>)[i\j] ∧ 
    Bᵢ Agent(j, <j, INFORM-IF(i, φ)>) ∧
    ¬Bᵢ Iⱼ Done(<j, INFORM-IF(i, φ)>)
  = ¬Bᵢfᵢφ ∧ ¬Uᵢfᵢφ ∧ ¬Bᵢ Iⱼ Done(<j, INFORM-IF(i, φ)>)
```

Translation: "i can query j about φ if i doesn't know whether φ is true, isn't uncertain (i.e., has no information at all), and doesn't already believe j intends to tell i."

**RE**:
```
RE: Done(<j, INFORM(i, φ)> | <j, INFORM(i, ¬φ)>)
```

The rational effect is that j will have done one of the inform acts, thus i will know φ's truth value.

### Practical Implementation Pattern

Your agent system should implement this compositionally:

```python
class Agent:
    def plan_query_if(self, recipient, proposition):
        # Construct the composed action
        inform_true = InformAct(self, recipient, proposition)
        inform_false = InformAct(self, recipient, NOT(proposition))
        inform_if = DisjunctiveAct([inform_true, inform_false])
        query = RequestAct(self, recipient, inform_if)
        
        # Check FPs
        if self.has_belief(proposition) or self.has_belief(NOT(proposition)):
            return Refuse("I already know the answer")
        if self.believes(recipient.intends(inform_if)):
            return Refuse("You're already planning to tell me")
        
        # Execute
        return self.send(query)

    def handle_request(self, sender, action):
        if isinstance(action, DisjunctiveAct):
            # Choose which branch to execute
            for branch in action.branches:
                if self.check_fps(branch):
                    return self.execute(branch)
            return Refuse("Cannot perform any branch")
```

## Referential Expressions and Infinite Disjunctions

### The INFORM-REF Challenge

What if you want to ask "what is X?" where X could be any of infinitely many values?

Example: "What is the current exchange rate?" The answer could be 1.234, 1.235, 1.236, ...—an infinite set.

The specification handles this with referential expressions:

```
<i, INFORM-REF(j, ιx δ(x))> ≡
  <i, INFORM(j, ιx δ(x) = r₁)> | ... | <i, INFORM(j, ιx δ(x) = rₙ)>
```

Where:
- ιx δ(x) is the unique x such that δ(x) holds (definite description)
- r₁, ..., rₙ are all possible referents (potentially infinite)

**Example**:
```
<i, INFORM-REF(j, ιx (x = exchange-rate(USD, EUR)))>
```

Means: "i will inform j of the value v such that v = exchange-rate(USD, EUR)"

This expands to:
```
<i, INFORM(j, exchange-rate(USD, EUR) = 1.234)> |
<i, INFORM(j, exchange-rate(USD, EUR) = 1.235)> |
...
```

**FPs**:
```
FP: Brefᵢ ιx δ(x) ∧ ¬Bᵢ(Brefⱼ ιx δ(x) ∨ Urefⱼ ιx δ(x))
```

Where Brefᵢ ιx δ(x) means: (∃y) Bᵢ(ιx δ(x) = y) — "i believes it knows which object is the x that is δ"

Translation: "i can inform-ref j of ιx δ(x) if i knows which object it is, and i doesn't believe j already knows"

### QUERY-REF: Asking for Referents

```
<i, QUERY-REF(j, ιx δ(x))> ≡
  <i, REQUEST(j, <j, INFORM-REF(i, ιx δ(x))>)>
```

**Example**:
```
<i, QUERY-REF(j, ιx (x = capital-of(France)))>
```

"What is the capital of France?"

**FPs**:
```
FP: ¬Brefᵢ ιx δ(x) ∧ ¬Urefᵢ ιx δ(x) ∧ 
    ¬Bᵢ Iⱼ Done(<j, INFORM-REF(i, ιx δ(x))>)
```

"i can query-ref j if i doesn't know which object δ refers to, and doesn't believe j already intends to tell i"

### Practical Implementation

For finite domains, enumerate possibilities:

```python
def inform_ref(agent_i, agent_j, description):
    # description is a function/predicate like "capital_of('France')"
    possible_referents = agent_i.knowledge_base.query(description)
    
    if len(possible_referents) == 0:
        return Refuse("I don't know any object matching that description")
    
    if len(possible_referents) > 1:
        return Failure("Description is ambiguous")
    
    referent = possible_referents[0]
    return Inform(agent_i, agent_j, description == referent)
```

For infinite or large domains, use lazy evaluation:

```python
def inform_ref(agent_i, agent_j, description):
    # Don't enumerate all possibilities—compute on demand
    referent = agent_i.compute_referent(description)
    return Inform(agent_i, agent_j, description == referent)
```

## Call for Proposal: Complex Composition

CFP shows sophisticated composition:

```
<i, CFP(j, <j, act>, Ref x φ(x))> ≡
  <i, QUERY-REF(j, Ref x (Iᵢ Done(<j, act>, φ(x)) ⇒ 
                            Iⱼ Done(<j, act>, φ(x))))>
```

**Meaning**: "i asks j: what value x (e.g., price, time, condition) would make you willing to perform act?"

**Example**:
```
<buyer, CFP(seller, <seller, sell(widget, 100)>, any x (price(widget) = x ∧ x < 1000))>
```

"What price would you accept to sell 100 widgets, given that I want a price under 1000?"

**Breakdown**:
1. The action is: <seller, sell(widget, 100)>
2. The condition is: φ(x) = price(widget) = x ∧ x < 1000
3. The query-ref asks: what x satisfies (Ibuyer Done(sell, φ(x)) ⇒ Iseller Done(sell, φ(x)))?

This means: "What x makes it true that if buyer intends the sale at price x, then seller also intends it?"

**Seller's response** (using PROPOSE):
```
<seller, PROPOSE(buyer, <seller, sell(widget, 100)>, price(widget) = 500)>
```

"I will sell at price 500"

## Conditional Execution: REQUEST-WHEN and REQUEST-WHENEVER

### REQUEST-WHEN: One-Time Conditional

```
<i, REQUEST-WHEN(j, <j, act>, φ)> ≡
  <i, INFORM(j, (∃e') Done(e') ∧ Unique(e') ∧ 
         Iᵢ Done(<j, act>, (∃e) Enables(e, Bⱼφ) ∧ 
              Has-never-held-since(e', Bⱼφ)))>
```

**Simplified meaning**: "i wants j to do act when j comes to believe φ (once)"

**Example**:
```
<orchestrator, REQUEST-WHEN(sensor, 
    <sensor, INFORM(orchestrator, temperature-reading)>,
    temperature > 100)>
```

"When temperature exceeds 100, tell me the reading (once)"

### REQUEST-WHENEVER: Persistent Conditional

```
<i, REQUEST-WHENEVER(j, <j, act>, φ)> ≡
  <i, INFORM(j, Iᵢ Done(<j, act>, (∃e) Enables(e, Bⱼφ)))>
```

**Meaning**: "i wants j to do act whenever φ becomes true (persistently)"

**Example**:
```
<orchestrator, REQUEST-WHENEVER(sensor,
    <sensor, INFORM(orchestrator, temperature-reading)>,
    temperature > 100)>
```

"Every time temperature exceeds 100, tell me (not just once—every time it crosses the threshold again)"

### SUBSCRIBE: Combining REQUEST-WHENEVER and INFORM-REF

```
<i, SUBSCRIBE(j, ιx δ(x))> ≡
  <i, REQUEST-WHENEVER(j, <j, INFORM-REF(i, ιx δ(x))>,
                       (∃y) Bⱼ(ιx δ(x) = y))>
```

**Meaning**: "i wants j to inform i of ιx δ(x) whenever j comes to know it"

**Example**:
```
<trader, SUBSCRIBE(market-feed, ιx (x = price(AAPL)))>
```

"Tell me Apple's stock price whenever it changes"

**Practical implementation**:
```python
class Agent:
    def __init__(self):
        self.subscriptions = []  # List of (requester, referent, condition)
    
    def handle_subscribe(self, sender, referent):
        # Add persistent watch
        self.subscriptions.append((sender, referent))
    
    def update_knowledge(self, proposition):
        # Called whenever agent learns something
        self.knowledge_base.add(proposition)
        
        # Check all subscriptions
        for (requester, referent) in self.subscriptions:
            if self.knows_referent(referent):
                self.send(InformRef(self, requester, referent))
```

## Building Interaction Protocols from Primitives

The FIPA Contract Net protocol can be built entirely from composed acts:

1. **Initiator sends CFP**:
   ```
   <initiator, CFP(participants, <participant, task>, Ref x (price = x ∧ x < budget))>
   ```

2. **Participants respond with PROPOSE or REFUSE**:
   ```
   <participant, PROPOSE(initiator, <participant, task>, price = 500)>
   OR
   <participant, REFUSE(initiator, <participant, task>, reason)>
   ```

3. **Initiator selects winner and sends ACCEPT-PROPOSAL**:
   ```
   <initiator, ACCEPT-PROPOSAL(winner, <winner, task>, price = 500)>
   ```

4. **Winner responds with AGREE** or **REFUSE**:
   ```
   <winner, AGREE(initiator, <winner, task>, start-date = tomorrow)>
   ```

5. **Winner later sends INFORM of completion** or **FAILURE**:
   ```
   <winner, INFORM(initiator, Done(task))>
   OR
   <winner, FAILURE(initiator, task, reason)>
   ```

Each step is a composition of primitives. You don't need to hardcode the Contract Net protocol—it emerges from agents using composed communicative acts rationally.

## Design Implications for WinDAGs

### 1. Don't Build a Flat Act Library

Avoid:
```python
class CommunicativeActs:
    def inform(...)
    def request(...)
    def query_if(...)
    def query_ref(...)
    def request_when(...)
    def request_whenever(...)
    def subscribe(...)
    # ... 100 more methods
```

Instead, build compositionally:
```python
class PrimitiveActs:
    def inform(agent_i, agent_j, proposition): ...
    def request(agent_i, agent_j, action): ...
    def confirm(agent_i, agent_j, proposition): ...
    def disconfirm(agent_i, agent_j, proposition): ...

class ActionExpressions:
    def sequence(action1, action2): return SequenceExpr(action1, action2)
    def choice(actions): return DisjunctiveExpr(actions)
    def conditional(action, condition): return ConditionalExpr(action, condition)

class DerivedActs:
    def query_if(agent_i, agent_j, prop):
        inform_if = choice([
            PrimitiveActs.inform(agent_j, agent_i, prop),
            PrimitiveActs.inform(agent_j, agent_i, NOT(prop))
        ])
        return PrimitiveActs.request(agent_i, agent_j, inform_if)
```

### 2. Generate Interaction Protocols Dynamically

Don't hardcode protocols—generate them from goals:

```python
class Orchestrator:
    def achieve_goal(self, goal):
        # Goal: Know temperature readings when > 100
        if goal.type == "monitor-condition":
            condition = goal.condition  # temperature > 100
            reading = goal.referent  # temperature reading
            agent = self.find_agent_with_capability("temperature-sensor")
            
            # Compose the appropriate act
            act = RequestWhenever(
                self, agent,
                InformRef(agent, self, reading),
                condition
            )
            
            return self.send(act)
```

### 3. Use Referential Expressions for Flexibility

Instead of:
```python
request(agent, "get_user_age", user_id="12345")
```

Use:
```python
query_ref(agent, ιx (x = age_of(user("12345"))))
```

This allows the agent to:
- Understand you want a specific referent (age value)
- Respond with inform-ref when it knows
- Refuse if it doesn't know
- Subscribe if you want ongoing updates

### 4. Implement FP Checking for Composed Acts

Before executing a disjunctive act, check which branches have satisfied FPs:

```python
def execute_disjunctive(agent, disjunctive_act):
    executable_branches = [
        branch for branch in disjunctive_act.branches
        if agent.check_fps(branch)
    ]
    
    if not executable_branches:
        return Refuse(disjunctive_act, "No branch is feasible")
    
    # Choose the first feasible branch (could be more sophisticated)
    return agent.execute(executable_branches[0])
```

## The Power of Composition

The compositional approach means:

1. **Fewer primitives to implement**: ~4 instead of ~30+
2. **More flexible agents**: Can construct novel acts for novel situations
3. **Clearer semantics**: Each composition has precise FPs and RE derived from primitives
4. **Protocol synthesis**: Interaction patterns emerge from rational act selection rather than hardcoded state machines

The FIPA specification proves that complex multi-agent coordination doesn't require a vast predefined vocabulary—it requires a rich composition algebra over a small set of well-defined primitives.
```

### FILE: ability-preconditions-vs-context-relevance.md

```markdown
# Ability vs. Context Relevance: The Two Dimensions of Feasibility

## The Critical Distinction

The FIPA specification makes a subtle but crucial distinction within feasibility preconditions (FPs): **ability preconditions** vs. **context-relevance preconditions**. This distinction prevents a massive class of coordination failures in multi-agent systems.

From section 5.3: "The set of feasibility preconditions for a CA can be split into two subsets: the ability preconditions and the context-relevance preconditions. The ability preconditions characterise the intrinsic ability of an agent to perform a given CA. The context-relevance preconditions characterise the relevance of the act to the context in which it is performed."

**Ability**: Can I perform this act? (Internal capability)
**Context-Relevance**: Should I perform this act? (External appropriateness)

This maps directly to the design challenge in any multi-agent orchestration system: agents can do many things, but they should only do things that advance the collective goal efficiently.

## Formal Characterization

### Ability Preconditions

**For INFORM**:
```
Ability: Bᵢφ
```
"i must believe φ to inform about φ"

This is an intrinsic constraint. If i doesn't believe φ, it cannot sincerely inform about φ—doing so would be lying or bullshitting. A rational agent cannot form the intention to inform about something it doesn't believe.

**For REQUEST**:
```
Ability: FP(a)[i\j] ∧ Bᵢ Agent(j, a)
```
"i must believe the requested action a is feasible (from i's perspective) and that j is the agent who can perform it"

If i doesn't believe a is feasible at all, it's irrational to request it. If i doesn't believe j is the relevant agent, requesting j is pointless.

### Context-Relevance Preconditions

**For INFORM**:
```
Context-Relevance: ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
```
"i must not believe that j already knows whether φ is true"

This prevents redundant communication. i might be capable of informing j (i believes φ), but if i believes j already knows φ, sending inform would waste resources and clutter the communication channel.

**For REQUEST**:
```
Context-Relevance: ¬Bᵢ Iⱼ Done(a)
```
"i must not believe that j already intends to do a"

If i believes j already plans to do a, requesting it is redundant. The request adds no new information and wastes coordination overhead.

## Why This Distinction Matters

### Problem 1: Redundant Communication

Without context-relevance preconditions, agents flood the system with technically correct but useless messages.

**Scenario**: Three agents (A, B, C) all know fact φ. Agent D needs to know φ.

**Without context-relevance**:
```
A checks: Can I inform D? Bₐφ? Yes. → A informs D
B checks: Can I inform D? Bᵦφ? Yes. → B informs D  
C checks: Can I inform D? Bᵧφ? Yes. → C informs D
```

D receives three identical messages. This scales horribly: in a system with n agents and m facts, you get O(n²m) redundant messages.

**With context-relevance**:
```
A checks: Bₐφ? Yes. Bₐ Bᵢfᴅφ? No. → A informs D
[A records: Bₐ Bᴅφ (I believe D now knows φ)]
B checks: Bᵦφ? Yes. Bᵦ Bᵢfᴅφ? Uncertain (A might have informed). → B queries A or stays silent
C checks: Similar to B
```

Only A sends inform. B and C recognize it would be redundant (or query to confirm D knows before redundantly informing).

### Problem 2: Ignoring Existing Commitments

**Scenario**: Orchestrator wants task T done. Two workers (W1, W2) are available.

**Without context-relevance**:
```
Orchestrator: Iₒᵣcₕ Done(T)
Check: Can I request W1? Feasible(T) from orch perspective? Yes. → Request W1
Check: Can I request W2? Feasible(T) from orch perspective? Yes. → Request W2
```

Both workers receive requests. Both might agree. Now two agents are redundantly executing T, or worse, they might interfere (if T isn't idempotent).

**With context-relevance**:
```
Orchestrator: Iₒᵣcₕ Done(T)
Check: Can I request W1? Feasible(T)? Yes. Bₒᵣcₕ Iw₁ Done(T)? No. → Request W1
[W1 agrees, so: Bₒᵣcₕ Iw₁ Done(T)]
Check: Can I request W2? Feasible(T)? Yes. Bₒᵣcₕ Iw₂ Done(T)? No.
       BUT: Bₒᵣcₕ Iw₁ Done(T)? Yes. → DON'T request W2 (W1 already committed)
```

Only W1 gets the request. Orchestrator recognizes that W1's commitment makes W2's involvement redundant.

### Problem 3: Conversational Mismatch

**Scenario**: Agent A asks B if φ is true. B responds "φ is true." A then asks again.

**Without context-relevance**:
```
A: QUERY-IF(B, φ)
B: INFORM(A, φ)
A: [Still uncertain for some reason] QUERY-IF(B, φ) again
B: [Checks: Bᵦφ? Yes.] INFORM(A, φ) again
```

This can loop indefinitely if there's any communication noise or belief revision.

**With context-relevance**:
```
A: QUERY-IF(B, φ)
B: INFORM(A, φ) [B records: Bᵦ Bₐφ]
A: QUERY-IF(B, φ) again
B: [Checks: Bᵦφ? Yes. Bᵦ Bᵢfₐφ? Yes (I just informed A!)]
   → REFUSE(A, INFORM-IF, "You already know—I just told you")
```

B recognizes that A's question is now inappropriate (A should already believe φ based on B's prior inform).

## Practical Implementation

### 1. Maintain Belief Tracking for Context-Relevance

Your agents need a belief model:

```python
class Agent:
    def __init__(self, agent_id):
        self.id = agent_id
        self.beliefs = set()  # Propositions this agent believes
        self.beliefs_about_others = {}  # agent_id -> set of propositions
        self.intentions = set()  # Actions this agent intends
        self.beliefs_about_others_intentions = {}  # agent_id -> set of actions
    
    def check_ability_preconditions_inform(self, proposition):
        """Can I inform about this proposition?"""
        return proposition in self.beliefs
    
    def check_context_relevance_inform(self, recipient, proposition):
        """Should I inform this recipient?"""
        recipient_knows = (
            proposition in self.beliefs_about_others.get(recipient, set()) or
            Not(proposition) in self.beliefs_about_others.get(recipient, set())
        )
        return not recipient_knows
    
    def can_inform(self, recipient, proposition):
        """Full FP check for inform"""
        return (
            self.check_ability_preconditions_inform(proposition) and
            self.check_context_relevance_inform(recipient, proposition)
        )
```

### 2. Update Models After Communication

When an agent informs another, update both agents' models:

```python
def send_inform(sender, receiver, proposition):
    if not sender.can_inform(receiver, proposition):
        raise FeasibilityViolation("Cannot inform—FPs not satisfied")
    
    # Send the message
    message = InformMessage(sender.id, receiver.id, proposition)
    send_message(message)
    
    # Update sender's model: "I now believe receiver knows proposition"
    if receiver.id not in sender.beliefs_about_others:
        sender.beliefs_about_others[receiver.id] = set()
    sender.beliefs_about_others[receiver.id].add(proposition)
    
def receive_inform(receiver, sender, proposition):
    # Update receiver's beliefs
    receiver.beliefs.add(proposition)
    
    # Update receiver's model: "Sender believes proposition"
    if sender.id not in receiver.beliefs_about_others:
        receiver.beliefs_about_others[sender.id] = set()
    receiver.beliefs_about_others[sender.id].add(proposition)
```

### 3. Implement Refuse for Context-Relevance Violations

When an agent receives a request that violates context-relevance, it should refuse:

```python
def handle_request(receiver, sender, action):
    # Check ability preconditions
    if not receiver.can_perform(action):
        return Refuse(action, reason="Action not feasible for me")
    
    # Check context-relevance: Do I already intend to do this?
    if action in receiver.intentions:
        return Refuse(action, reason="I already intend to do this—no need to request")
    
    # If both pass, proceed with agreement/execution
    return Agree(action)
```

## Advanced Pattern: Cooperative Redundancy Prevention

In large systems, agents can cooperatively avoid redundancy:

### Protocol: Inform with Broadcast Awareness

```python
class MultiAgentSystem:
    def __init__(self):
        self.agents = {}
        self.communication_log = []  # Shared or gossiped log
    
    def agent_informs(self, sender, receiver, proposition):
        # Before informing, check if any other agent recently informed receiver
        recent_informs = [
            msg for msg in self.communication_log[-10:]  # Last 10 messages
            if msg.type == "inform" and 
               msg.receiver == receiver.id and 
               msg.proposition == proposition
        ]
        
        if recent_informs:
            # Someone else already informed receiver
            sender.beliefs_about_others[receiver.id].add(proposition)
            return Refuse(
                InformAct(sender, receiver, proposition),
                reason=f"Agent {recent_informs[0].sender} already informed {receiver.id}"
            )
        
        # Proceed with inform
        send_inform(sender, receiver, proposition)
        self.communication_log.append(
            Message("inform", sender.id, receiver.id, proposition)
        )
```

## Context-Relevance in Different Act Types

### CONFIRM vs. INFORM

The only difference is context-relevance:

**INFORM**:
```
Ability: Bᵢφ
Context-Relevance: ¬Bᵢ(Bᵢfⱼφ ∨ Uᵢfⱼφ)
```
Use when recipient has no prior knowledge.

**CONFIRM**:
```
Ability: Bᵢφ
Context-Relevance: BᵢUⱼφ
```
Use when recipient is uncertain (has some information but not confidence).

**Implementation**:
```python
def should_confirm_vs_inform(agent_i, agent_j, proposition):
    if agent_j.id not in agent_i.beliefs_about_others:
        return "inform"  # No model of j's beliefs
    
    j_beliefs = agent_i.beliefs_about_others[agent_j.id]
    
    if proposition in j_beliefs or Not(proposition) in j_beliefs:
        return "neither"  # j already has definite belief
    
    if proposition in agent_i.uncertainties_about_others.get(agent_j.id, set()):
        return "confirm"  # j is uncertain
    
    return "inform"  # j has no information
```

### REQUEST-WHEN vs. Immediate REQUEST

**Immediate REQUEST**:
```
Context-Relevance: ¬Bᵢ Iⱼ Done(a)
```
Use when j doesn't already intend to do a.

**REQUEST-WHEN**:
```
Context-Relevance: [Similar, but adds temporal aspect]
```
Use when you want j to commit now but execute later when condition holds. The context-relevance check ensures j doesn't already have a persistent intention to do a when condition holds.

## Gricean Maxims Formalized

The context-relevance preconditions formalize Grice's conversational maxims:

**Quantity**: "Make your contribution as informative as necessary, but not more"
- Formalized as: ¬Bᵢ Bᵢfⱼφ (don't inform if recipient already knows)

**Relation**: "Be relevant"
- Formalized as: ¬Bᵢ Iⱼ Done(a) (don't request what's already intended)

**Manner**: "Be clear and orderly"
- Implicit in the act selection: use confirm vs. inform vs. disconfirm based on recipient's state

The FIPA model thus grounds pragmatics in modal logic.

## Common Design Errors

### Error 1: Treating All FPs as Ability Preconditions

**Wrong**:
```python
def can_send_inform(sender, proposition):
    return sender.believes(proposition)  # Only checking ability!
```

**Right**:
```python
def can_send_inform(sender, recipient, proposition):
    ability = sender.believes(proposition)
    context = not sender.believes_recipient_knows(recipient, proposition)
    return ability and context
```

### Error 2: Ignoring Context-Relevance Because "It's Just Optimization"

Context-relevance isn't optimization—it's **semantic correctness**. An agent that violates context-relevance preconditions is behaving irrationally by the formal model.

If your agent system treats context-relevance as optional, it will:
- Generate redundant messages (scalability problem)
- Fail to recognize when communication is pointless (efficiency problem)
- Violate conversational norms (interoperability problem with other agents)

### Error 3: Not Updating Belief Models After Communication

**Wrong**:
```python
send_message(inform(sender, receiver, proposition))
# Forget about it
```

**Right**:
```python
send_message(inform(sender, receiver, proposition))
sender.update_belief_about(receiver, proposition)  # I now think receiver knows
```

Without updating, the agent will repeat the same inform again and again.

## Practical Recommendations

1. **Implement Both Checks**: Every communicative act should check ability AND context-relevance before execution.

2. **Maintain Belief Models**: Track what you believe about other agents' beliefs and intentions. This is not optional for context-relevance.

3. **Use Refuse for Context Violations**: If an agent receives a request that violates context-relevance (e.g., "do X" when agent already intends X), it should refuse with explanation.

4. **Log Communications**: Keep a recent history of communications to detect redundancy attempts.

5. **Test with Redundancy Scenarios**: Stress-test your system by having multiple agents try to inform the same recipient of the same fact. A correct implementation should prevent all but the first.

6. **Design for Graceful Degradation**: If belief tracking is uncertain (due to message loss, etc.), err on the side of caution—allow some redundancy rather than failing to inform.

## The Deep Insight

The ability/context-relevance distinction reveals a profound truth: **competence is not sufficient for rational action; appropriateness matters equally**.

Your agents can have vast capabilities (ability preconditions), but without understanding context (what's already known, what's already committed), they will waste those capabilities on redundant, unnecessary, or inappropriate actions.

This is the formalization of social intelligence: knowing not just what you *can* do, but what you *should* do given the state of the multi-agent system.
```

### FILE: macro-acts-and-infinite-disjunctions.md

```markdown
# Macro Acts and Infinite Disjunctions: Handling Open-Ended Communication

## The Challenge of Unbounded Information Spaces

Traditional communication protocols handle finite, enumerable message types. But many agent coordination scenarios involve unbounded possibility spaces:

- "What is the current stock price?" (infinite possible values)
- "Who can perform this task?" (unbounded set of agents)
- "When will the package arrive?" (unbounded temporal references)
- "List all matching database records" (result set size unknown in advance)

The FIPA specification solves this through **macro acts**: communicative acts defined as potentially infinite disjunctions of primitive acts, executed lazily based on the sender's knowledge state at execution time.

From section 5.5: "An important distinction is made between acts that can be carried out directly, and those macro acts which can be planned (which includes requesting another agent to perform the act), but cannot be directly carried out."

## Primitive Acts vs. Macro Acts

### Primitive Acts: Directly Executable

These can be performed and said to be "Done":

```
<i, inform(j, φ)>
<i, request(j, a)>
<i, confirm(j, φ)>
<i, disconfirm(j, φ)>
```

When agent i executes inform(j, φ), the act is completed and Done(<i, inform(j, φ)>) is true.

### Macro Acts: Planned but Not Directly Executed

These represent planning commitments that resolve to primitive acts at execution time:

```
<i, inform-if(j, φ)> ≡ <i, inform(j, φ)> | <i, inform(j, ¬φ)>
<i, inform-ref(j, ιx δ(x))> ≡ <i, inform(j, ιx δ(x) = r₁)> | ... | <i, inform(j, ιx δ(x) = rₙ)>
```

When agent i plans to perform inform-ref, it commits to executing *one* of the disjunctive branches (whichever matches its current knowledge), but doesn't directly execute the macro act itself.

**Key property**: What gets "Done" is the primitive act, not the macro act.

## The Inform-Ref Macro Act

### Definition

```
<i, inform-ref(j, ιx δ(x))> ≡
  <i, inform(j, ιx δ(x) = r₁)> | ... | <i, inform(j, ιx δ(x) = rₙ)>
```

Where:
- ιx δ(x) is a definite description ("the x such that δ(x)")
- r₁, ..., rₙ are all possible referents (potentially infinite)

**Informal meaning**: "i will inform j of which object satisfies δ"

### Formal FPs and RE

```
FP: Brefᵢ ιx δ(x) ∧ ¬Bᵢ(Brefⱼ ιx δ(x) ∨ Urefⱼ ιx δ(x))
RE: Brefⱼ ιx δ(x)
```

Where Brefᵢ ιx δ(x) ≡ (∃y) Bᵢ(ιx δ(x) = y) means "i believes it knows which object is the x that is δ"

**Translation**: 
- FP: "i knows which object δ refers to, and i doesn't believe j already knows"
- RE: "j comes to know which object δ refers to"

### Example: Stock Price Query

Agent Trader wants to know the current price of AAPL stock from Agent MarketFeed:

```
<Trader, query-ref(MarketFeed, ιx (x = price(AAPL)))>
```

This expands to:
```
<Trader, request(MarketFeed, <MarketFeed, inform-ref(Trader, ιx (x = price(AAPL)))>)>
```

Which further expands to:
```
<Trader, request(MarketFeed, 
    <MarketFeed, inform(Trader, price(AAPL) = 150.00)> |
    <MarketFeed, inform(Trader, price(AAPL) = 150.01)> |
    <MarketFeed, inform(Trader, price(AAPL) = 150.02)> |
    ...)>
```

**At execution time**, MarketFeed:
1. Checks FP: Does it know the current price? Yes (suppose Bₘₐᵣₖₑₜfₑₑd price(AAPL) = 150.23)
2. Selects the matching branch: inform(Trader, price(AAPL) = 150.23)
3. Executes that primitive inform act
4. Done(<MarketFeed, inform(Trader, price(AAPL) = 150.23)>) becomes true

**Critically**: The infinite disjunction is never enumerated. It's a commitment to "inform of whatever value I currently believe" resolved lazily at execution time.

## Query-Ref: Requesting Inform-Ref

### Definition

```
<i, query-ref(j, ιx δ(x))> ≡
  <i, request(j, <j, inform-ref(i, ιx δ(x))>)>
```

**Meaning**: "i asks j to inform i of which object satisfies δ"

### FPs

```
FP: ¬Brefᵢ ιx δ(x) ∧ ¬Urefᵢ ιx δ(x) ∧ 
    ¬Bᵢ Iⱼ Done(<j, inform-ref(i, ιx δ(x))>)
```

"i doesn't know which object δ refers to, and i doesn't believe j already intends to tell i"

### Example: Database Query

Agent Orchestrator wants Agent DatabaseWorker to fetch all records matching a predicate:

```
<Orchestrator, query-ref(DatabaseWorker, all x (user(x) ∧ age(x) > 30))>
```

The definite description here is "all x such that user(x) and age(x) > 30"—a set-valued referent.

DatabaseWorker responds:
```
<DatabaseWorker, inform(Orchestrator, 
    (all x (user(x) ∧ age(x) > 30)) = {user123, user456, user789})>
```

Note: The result set might be empty, finite, or very large. The macro act doesn't enumerate possibilities in advance—it computes the referent on demand.

## Implementation Patterns

### Pattern 1: Lazy Evaluation for Inform-Ref

```python
class Agent:
    def execute_inform_ref(self, recipient, description):
        """
        Execute inform-ref by computing the referent on-demand.
        description is a function/predicate defining the referent.
        """
        # Check ability precondition
        referent = self.knowledge_base.find_referent(description)
        if referent is None:
            # Cannot satisfy FP: Brefᵢ description
            return Refuse(
                action=InformRef(self, recipient, description),
                reason="I don't know which object satisfies that description"
            )
        
        # Check context-relevance precondition
        if self.believes_recipient_knows_referent(recipient, description):
            return Refuse(
                action=InformRef(self, recipient, description),
                reason="You already know which object that refers to"
            )
        
        # Execute the matching primitive inform act
        return self.execute_inform(recipient, f"{description} = {referent}")
```

### Pattern 2: Set-Valued Referents (all x δ(x))

```python
def execute_inform_ref_all(self, recipient, predicate):
    """
    Handle inform-ref for 'all x such that δ(x)'—a set-valued referent.
    """
    matching_objects = self.knowledge_base.query_all(predicate)
    
    if matching_objects is None:
        # Can't compute the set
        return Refuse(
            reason="Cannot determine all objects satisfying that predicate"
        )
    
    # Inform of the set
    return self.execute_inform(
        recipient,
        f"(all x {predicate}(x)) = {set(matching_objects)}"
    )
```

### Pattern 3: Handling Ambiguity (Non-Unique Referents)

What if the description isn't uniquely satisfied?

```python
def execute_inform_ref_iota(self, recipient, description):
    """
    Handle inform-ref for ιx δ(x)—"the unique x such that δ(x)".
    """
    matching_objects = self.knowledge_base.query_all(description)
    
    if len(matching_objects) == 0:
        return Refuse(reason="No object satisfies that description")
    
    if len(matching_objects) > 1:
        # Ambiguous reference—cannot satisfy uniqueness
        return Failure(
            action=InformRef(self, recipient, description),
            reason=f"Description is ambiguous: matches {matching_objects}"
        )
    
    # Unique referent found
    referent = matching_objects[0]
    return self.execute_inform(recipient, f"{description} = {referent}")
```

### Pattern 4: Streaming Results for Large Sets

If "all x δ(x)" yields a huge result set, stream the response:

```python
def execute_inform_ref_streaming(self, recipient, predicate):
    """
    Handle large result sets by streaming multiple inform messages.
    """
    result_iterator = self.knowledge_base.query_streaming(predicate)
    
    # Send initial message indicating a stream follows
    self.send(Inform(
        self, recipient,
        f"(all x {predicate}(x)) is being streamed in chunks"
    ))
    
    # Stream results
    for chunk in chunk_iterator(result_iterator, chunk_size=100):
        self.send(Inform(self, recipient, f"partial_results: {chunk}"))
    
    # Send completion marker
    self.send(Inform(self, recipient, "stream_complete"))
```

## Composition with Other Macro Acts

### Subscribe: Persistent Inform-Ref

```
<i, subscribe(j, ιx δ(x))> ≡
  <i, request-whenever(j, <j, inform-ref(i, ιx δ(x))>,
                       (∃y) Bⱼ(ιx δ(x) = y))>
```

**Meaning**: "i wants j to inform i of the referent of δ whenever j comes to know it"

**Example**: Stock price subscription
```
<Trader, subscribe(MarketFeed, ιx (x = price(AAPL)))>
```

MarketFeed will repeatedly execute inform-ref(Trader, ιx (x = price(AAPL))) whenever the price changes.

**Implementation**:
```python
class Agent:
    def __init__(self):
        self.subscriptions = []  # (subscriber, description, condition)
    
    def handle_subscribe(self, subscriber, description):
        condition = lambda: self.knowledge_base.knows_referent(description)
        self.subscriptions.append((subscriber, description, condition))
    
    def process_subscriptions(self):
        """Called periodically or when knowledge changes."""
        for (subscriber, description, condition) in self.subscriptions:
            if condition():
                # Trigger inform-ref
                self.execute_inform_ref(subscriber, description)
```

### Call for Proposal: Conditional Inform-Ref

CFP uses referential expressions to query conditions under which an agent will act:

```
<i, cfp(j, <j, act>, Ref x φ(x))> ≡
  <i, query-ref(j, Ref x (Iᵢ Done(<j, act>, φ(x)) ⇒ Iⱼ Done(<j, act>, φ(x))))>
```

**Meaning**: "What value x would make you (j) willing to do act, given that I (i) want it done under condition φ(x)?"

**Example**: Auction bid
```
<Auctioneer, cfp(Bidders, <Bidder, deliver(item)>, any x (price(item) = x))>
```

"What price would you bid to deliver this item?"

Bidders respond with:
```
<Bidder1, propose(Auctioneer, <Bidder1, deliver(item)>, price(item) = 100)>
<Bidder2, propose(Auctioneer, <Bidder2, deliver(item)>, price(item) = 95)>
```

The referential expression (any x ...) creates an open-ended space of proposals.

## Handling Failure Cases

### FP Violations

If agent j cannot satisfy the FPs for inform-ref, it should refuse:

```python
def handle_request_inform_ref(self, sender, description):
    if not self.knowledge_base.knows_referent(description):
        return Refuse(
            action=InformRef(self, sender, description),
            reason="I don't know which object satisfies that description"
        )
    
    return self.execute_inform_ref(sender, description)
```

### Partial Knowledge

If the agent knows some but not all of the referent (e.g., knows price is between 150 and 160 but not exact value):

```python
def handle_partial_knowledge(self, sender, description):
    partial_info = self.knowledge_base.get_partial_info(description)
    
    if partial_info.is_complete():
        return self.execute_inform_ref(sender, description)
    else:
        # Inform of partial knowledge using uncertainty
        return self.execute_inform(
            sender,
            f"I'm uncertain about the exact value, but {description} is approximately {partial_info}"
        )
```

## Referential Operators: ιx, any x, all x

The FIPA specification uses three referential operators:

### ιx δ(x): "The unique x such that δ(x)"

- Presupposes uniqueness
- If multiple objects satisfy δ, the description is malformed
- Example: ιx (x = capital-of(France)) refers to Paris (unique)

### any x δ(x): "Any x such that δ(x)"

- Picks one arbitrary satisfying object
- Used when any instance will do
- Example: any x (x = available-worker) picks one available worker

### all x δ(x): "All x such that δ(x)"

- Refers to the set of all satisfying objects
- Example: all x (x = database-record(age > 30)) refers to a set

**Implementation**:
```python
def evaluate_referent(self, ref_expr):
    if ref_expr.operator == "iota":  # ιx δ(x)
        matches = self.knowledge_base.query_all(ref_expr.predicate)
        if len(matches) == 0:
            raise ReferentNotFound()
        if len(matches) > 1:
            raise AmbiguousReferent(matches)
        return matches[0]
    
    elif ref_expr.operator == "any":  # any x δ(x)
        matches = self.knowledge_base.query_all(ref_expr.predicate)
        if len(matches) == 0:
            raise ReferentNotFound()
        return random.choice(matches)  # Or use some selection policy
    
    elif ref_expr.operator == "all":  # all x δ(x)
        matches = self.knowledge_base.query_all(ref_expr.predicate)
        return set(matches)  # Return as a set
```

## Design Implications for WinDAGs

### 1. Don't Enumerate Possibilities in Advance

**Avoid**:
```python
# Bad: Pre-enumerate all possible values
possible_prices = [150.00, 150.01, 150.02, ...]  # Infinite!
for price in possible_prices:
    if self.believes(price_is(price)):
        return Inform(recipient, price_is(price))
```

**Instead**:
```python
# Good: Compute on-demand
current_price = self.get_current_price()
return Inform(recipient, f"price = {current_price}")
```

### 2. Use Descriptions, Not Enumeration

When requesting information, use referential expressions:

**Avoid**:
```python
# Bad: Enumerate all users manually
for user in [user1, user2, user3, ...]:
    query(worker, f"age({user}) > 30?")
```

**Instead**:
```python
# Good: Use description
query_ref(worker, all_x(lambda x: user(x) and age(x) > 30))
```

### 3. Implement Lazy Resolution

Your agent framework should delay resolution of referential expressions until execution time:

```python
class ReferentialExpression:
    def __init__(self, operator, predicate):
        self.operator = operator  # "iota", "any", "all"
        self.predicate = predicate  # Function or AST
    
    def resolve(self, knowledge_base):
        """Resolve at execution time, not at planning time."""
        if self.operator == "iota":
            return knowledge_base.find_unique(self.predicate)
        elif self.operator == "any":
            return knowledge_base.find_any(self.predicate)
        elif self.operator == "all":
            return knowledge_base.find_all(self.predicate)

class InformRefAct:
    def __init__(self, sender, receiver, ref_expr):
        self.sender = sender
        self.receiver = receiver
        self.ref_expr = ref_expr  # Not resolved yet!
    
    def execute(self):
        # Resolve now
        referent = self.ref_expr.resolve(self.sender.knowledge_base)
        # Execute primitive inform
        return InformAct(self.sender, self.receiver, f"{self.ref_expr} = {referent}").execute()
```

### 4. Support Streaming for Large Results

When "all x δ(x)" might yield huge sets, design your communication layer to support chunked or streamed responses:

```python
def handle_large_result_query(orchestrator, worker, predicate):
    # Worker starts streaming
    worker.start_stream(orchestrator, predicate)
    
    # Orchestrator accumulates results
    results = []
    for chunk in orchestrator.receive_stream(worker):
        results.extend(chunk)
        # Can start processing partial results while waiting
        orchestrator.process_partial(chunk)
    
    return results
```

### 5. Graceful Degradation for Ambiguity

If a referential expression is ambiguous, don't fail silently—inform the requester:

```python
def handle_ambiguous_referent(self, sender, description):
    matches = self.knowledge_base.query_all(description)
    
    if len(matches) > 1:
        # Ask sender to disambiguate
        return Inform(
            self, sender,
            f"Your description '{description}' matches multiple objects: {matches}. Please refine."
        )
```

## When to Use Macro Acts

**Use inform-ref/query-ref when**:
- The information space is large or unbounded
- You don't know in advance which specific value to query
- You want the recipient to compute/look up the referent dynamically

**Use primitive inform when**:
- You already know the specific proposition to communicate
- The information space is small and discrete

**Example comparison**:

```python
# Primitive inform: Specific proposition
inform(agent, "temperature = 72")

# Macro inform-ref: Open-ended query
query_ref(agent, ιx (x = current_temperature))
```

The second is more flexible if temperature changes or if you don't know it in advance.

## The Deep Lesson

Macro acts with infinite disjunctions are not theoretical curiosities—they're the formalization of **open-ended communication in unbounded information spaces**.

Real-world agent systems must handle:
- Database queries (unbounded result sets)
- Marketplace queries (unbounded number of offers)
- Sensor readings (continuous value spaces)
- Agent discovery (unbounded number of potential agents)

The FIPA model solves this by separating **planning** (commit to inform-ref) from **execution** (resolve to specific inform at runtime). This lazy evaluation enables agents to coordinate over infinite possibility spaces without infinite planning.

Your agent orchestration system should embrace this: define macro acts as planning commitments that resolve to primitives at execution time, and never try to enumerate infinite disjunctions in advance.
```

### FILE: failure-modes-of-multi-agent-coordination.md

```markdown
# Failure Modes and Robustness Patterns in Multi-Agent Coordination

## The Explicit Failure Vocabulary

Unlike traditional distributed systems that often treat failure as exceptional (exceptions, errors, timeouts), the FIPA specification makes **failure a first-class communicative act**. This reflects a profound recognition: in multi-agent systems, failure to achieve coordination is *normal*, not exceptional.

The specification defines three primary failure-related acts:

1. **REFUSE**: "I cannot or will not do what you asked"
2. **FAILURE**: "I tried but failed"
3. **NOT-UNDERSTOOD**: "I didn't understand what you said"

Each has precise semantics and addresses a different coordination breakdown mode.

## REFUSE: Capability Boundaries and Autonomy

### Formal Definition

```
<i, refuse(j, <i, act>, φ)> ≡
  <i, disconfirm(j, Feasible(<i, act>))>;
  <i, inform(j, φ ∧ ¬Done(<i, act>) ∧ ¬Iᵢ Done(<i, act>))>
  
FP: Bᵢ ¬Feasible(<i, act>) ∧ Bᵢ(Bⱼ Feasible(<i, act>) ∨ Uⱼ Feasible(<i, act>)) ∧
    Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
  
RE: Bⱼ ¬Feasible(<i, act>) ∧ Bⱼ α

Where: α = φ ∧ ¬Done(<i, act>) ∧ ¬Iᵢ Done(<i, act>)
```

### Translation

**Refuse means**: 
1. i informs j that the requested action is not feasible (from i's perspective)
2. i informs j why (the reason φ)
3. i informs j that the action hasn't been done and i has no intention to do it

**When to refuse**:
- Agent lacks capability: "I don't have database access"
- Resource constraints: "I'm at full capacity"
- Policy violation: "I don't have permission for that operation"
- Semantic impossibility: "That action is logically impossible given current state"

### Practical Example

```python
class Worker:
    def handle_request(self, sender, action):
        # Check feasibility
        if not self.can_perform(action):
            reason = self.diagnose_infeasibility(action)
            return Refuse(
                sender=self,
                receiver=sender,
                action=action,
                reason=reason
            )
        
        # If feasible, proceed with agree/execute
        return self.execute(action)
    
    def diagnose_infeasibility(self, action):
        """Return structured reason for infeasibility."""
        if not self.has_capability(action):
            return Reason(
                type="missing_capability",
                details=f"I don't have skill: {action.required_skill}"
            )
        elif not self.has_resources(action):
            return Reason(
                type="resource_constraint",
                details=f"Insufficient resources: {action.resource_requirement}"
            )
        elif not self.is_permitted(action):
            return Reason(
                type="policy_violation",
                details=f"Not authorized: {action} requires {action.required_permission}"
            )
        else:
            return Reason(
                type="unknown",
                details="Action not feasible for unknown reason"
            )
```

### Why Refuse is Critical for Orchestration

In a WinDAG orchestration system, refuse enables:

1. **Graceful degradation**: Orchestrator can try alternative agents or plans
2. **Root cause analysis**: The reason φ provides actionable diagnostic information
3. **Capability discovery**: Patterns of refusals reveal actual vs. claimed capabilities
4. **Workload management**: Agents can refuse when overloaded, enabling load balancing

**Anti-pattern**: Silently accepting requests you can't fulfill

```python
# Bad: Accept but never execute
def handle_request(self, sender, action):
    return Agree(action)  # Lying—will never actually do it
```

**Correct pattern**: Honest refusal with reason

```python
# Good: Refuse if infeasible
def handle_request(self, sender, action):
    if not self.can_perform(action):
        return Refuse(action, reason="Insufficient memory")
    return Agree(action)
```

## FAILURE: Attempting vs. Succeeding

### Formal Definition

```
<i, failure(j, a, φ)> ≡
  <i, inform(j, (∃e) Single(e) ∧ Done(e) ∧ Agent(e, i) ∧ 
            Bᵢ(Done(e) ∧ Agent(e, i) ∧ (a = e)) ∧ φ ∧ 
            ¬Done(a) ∧ ¬Iᵢ Done(a))>
  
FP: Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
RE: Bⱼ α

Where: α = (∃e) Single(e) ∧ Done(e, Feasible(a) ∧ Iᵢ Done(a)) ∧ φ ∧ 
              ¬Done(a) ∧ ¬Iᵢ Done(a)
```

### Translation

**Failure means**:
1. i had the intention to do action a
2. i believed a was feasible
3. i attempted to do a (there exists an event e where i tried)
4. The action a was not completed
5. i no longer intends to do a
6. The reason for failure is φ

**Key distinction from refuse**: 
- Refuse: "I can't do this" (before attempting)
- Failure: "I tried but it didn't work" (after attempting)

### Practical Example

```python
class Worker:
    def execute_task(self, sender, task):
        # Already agreed—now attempting execution
        try:
            # Attempt the task
            result = self.perform(task)
            
            # Success
            return Inform(
                self, sender,
                Done(task, result=result)
            )
        
        except ResourceExhausted as e:
            # Attempted but failed due to resource issue
            return Failure(
                self, sender,
                action=task,
                reason=f"Resource exhausted: {e}"
            )
        
        except NetworkTimeout as e:
            # Attempted but failed due to external dependency
            return Failure(
                self, sender,
                action=task,
                reason=f"Network timeout communicating with external service: {e}"
            )
        
        except Exception as e:
            # Attempted but failed for unknown reason
            return Failure(
                self, sender,
                action=task,
                reason=f"Unexpected error: {e}"
            )
```

### Why Failure is Critical

Failure enables:

1. **Distinguishing attempt from success**: Orchestrator knows the agent tried (vs. refused)
2. **Retry strategies**: Different failures warrant different retry approaches
3. **Debugging**: The reason φ provides exception-like diagnostic information
4. **Partial completion tracking**: Agent may have completed substeps before failing

**Orchestration pattern**: Differentiated failure handling

```python
class Orchestrator:
    def handle_response(self, worker, response):
        if isinstance(response, Agree):
            # Worker committed—wait for completion
            self.wait_for_completion(worker)
        
        elif isinstance(response, Refuse):
            # Worker can't do it—try alternative
            reason = response.reason
            if reason.type == "missing_capability":
                # Need different worker
                alternative = self.find_capable_worker(response.action)
                self.request(alternative, response.action)
            elif reason.type == "resource_constraint":
                # Worker might become available later—retry or queue
                self.schedule_retry(worker, response.action, delay=60)
        
        elif isinstance(response, Failure):
            # Worker tried but failed—analyze failure mode
            reason = response.reason
            if "timeout" in reason.details:
                # Transient failure—immediate retry might work
                self.request(worker, response.action)  # Retry same worker
            elif "resource" in reason.details:
                # Need more resources or different worker
                self.scale_up_resources() or self.delegate_to_another()
            else:
                # Unknown failure—escalate
                self.escalate_to_human(response)
```

## NOT-UNDERSTOOD: Communication Breakdowns

### Formal Definition

```
<i, not-understood(j, a, φ)> ≡
  <i, inform(j, α)>
  
FP: Bᵢ α ∧ ¬Bᵢ(Bᵢfⱼ α ∨ Uᵢfⱼ α)
RE: Bⱼ α

Where: α = φ ∧ (∃x) Bᵢ((ιe Done(e) ∧ Agent(e, j) ∧ 
              Bⱼ(Done(e) ∧ Agent(e, j) ∧ (a = e))) = x)
```

### Translation

**Not-understood means**:
1. i observed agent j perform action a
2. i doesn't understand what a was (semantic failure)
3. The reason i doesn't understand is φ

**Common reasons for not-understood**:
- Unknown ontology: "I don't recognize that domain vocabulary"
- Unknown content language: "I can't parse that syntax"
- Unknown act type: "I don't know what 'flobberate' means"
- Protocol violation: "That message doesn't make sense in this conversation"

### Practical Example

```python
class Agent:
    def receive_message(self, message):
        try:
            # Try to parse message
            parsed = self.parse(message)
        except UnknownLanguage as e:
            # Can't parse content language
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Unknown content language: {message.language}"
            )
        except UnknownOntology as e:
            # Can't interpret domain terms
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Unknown ontology: {message.ontology}"
            )
        
        try:
            # Try to understand act type
            act_type = parsed.act
            if act_type not in self.known_acts:
                return NotUnderstood(
                    self, message.sender,
                    action=message,
                    reason=f"Unknown communicative act: {act_type}"
                )
        except Exception as e:
            return NotUnderstood(
                self, message.sender,
                action=message,
                reason=f"Cannot interpret message: {e}"
            )
        
        # Successfully understood—process normally
        return self.handle_message(parsed)
```

### Why Not-Understood is Critical

Not-understood enables:

1. **Protocol negotiation**: Sender learns receiver's limitations and can adapt
2. **Graceful interoperability failure**: Better than silent misinterpretation
3. **Debugging multi-vendor systems**: Reveals incompatibilities explicitly
4. **Learning**: Agents can request clarification or negotiate common languages

**Pattern**: Falling back to simpler communication

```python
class Orchestrator:
    def send_request(self, worker, action):
        # Try sending with full semantic richness
        response = self.send(
            Request(
                self, worker, action,
                language="FIPA-SL",
                ontology="domain-specific-v2"
            )
        )
        
        if isinstance(response, NotUnderstood):
            reason = response.reason
            if "Unknown ontology" in reason:
                # Fall back to simpler ontology
                response = self.send(
                    Request(
                        self, worker, action,
                        language="FIPA-SL",
                        ontology="domain-specific-v1"  # Older version
                    )
                )
            
            if isinstance(response, NotUnderstood) and "Unknown language" in reason:
                # Fall back to string-based content
                response = self.send(
                    Request(
                        self, worker, action,
                        language="string",  # Minimal semantics
                        content=str(action)
                    )
                )
        
        return response
```

## Compositional Failure Handling

### Cancel: Retracting Intentions

```
<i, cancel(j, a)> ≡ 