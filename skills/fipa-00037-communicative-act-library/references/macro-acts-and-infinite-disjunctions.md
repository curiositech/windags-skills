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