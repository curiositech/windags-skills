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