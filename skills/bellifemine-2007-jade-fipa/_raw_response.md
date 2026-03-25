## BOOK IDENTITY

**Title**: Developing Multi-Agent Systems with JADE  
**Author**: Fabio Bellifemine, Giovanni Caire, Dominic Greenwood  
**Core Question**: How do you build distributed intelligent systems where hundreds of autonomous agents coordinate to solve problems that no single agent can handle alone?  

**Irreplaceable Contribution**: JADE is the only production multi-agent platform that fully implements FIPA standards while providing concrete, battle-tested patterns for the hardest problems in distributed AI: semantic interoperability across heterogeneous agents, failure-resilient coordination protocols, and hierarchical task decomposition that scales from mobile phones to enterprise clusters. Unlike theoretical agent frameworks or research prototypes, JADE has run mission-critical systems (air traffic control at Sydney airport, industrial process control) and codifies 25+ years of lessons about what actually works when intelligent systems must collaborate under real-world constraints.

---

## KEY IDEAS

1. **Agents coordinate through meaning, not mechanics**: FIPA-ACL separates what agents say (performatives like REQUEST, INFORM) from what they mean (content expressed in formal logic). Ontologies ground this meaning across heterogeneous implementations. This enables agents built by different teams, in different languages, to collaborate semantically—the equivalent of humans agreeing on concepts before arguing strategy.

2. **Coordination protocols are composable building blocks, not monolithic frameworks**: JADE provides 10+ standardized interaction patterns (Contract Net for negotiation, Request-When for conditional execution, Subscribe for streaming). Developers select and compose protocols based on task structure, not force-fit problems into one paradigm. A complex workflow might use Contract Net at the top level (resource allocation), Sequential behaviors in the middle (ordered skill execution), and Parallel behaviors at the leaves (concurrent I/O).

3. **The split-container architecture solves the mobile/stationary agent problem**: Lightweight front-ends (on phones, edge devices) delegate state management to heavyweight back-ends (on servers). A mediator handles discovery and reconnection. This isn't just for mobile—it's a pattern for any system with unreliable or resource-constrained execution environments paired with stable coordination infrastructure.

4. **Semantic agents reason by interpretation, not explicit message handling**: Instead of writing "if message.type == X then do Y" handlers, semantic agents apply Semantic Interpretation Principles (SIPs)—pluggable rules that extract meaning from messages, update beliefs, and trigger actions automatically. A zero-code "simplest agent" can answer queries, handle subscriptions, and perform actions because generic SIPs implement FIPA-ACL semantics.

5. **Failure prevention is protocol-level, not just implementation-level**: JADE's interaction protocols explicitly model refusal (agent can decline before starting), failure (agent started but couldn't complete), and not-understood (semantic mismatch). Timeouts, retries, and persistent message delivery are first-class features. This makes failure handling compositional—higher-level behaviors inherit error semantics from lower-level ones.

---

## REFERENCE DOCUMENTS

### FILE: coordination-without-bottlenecks.md

```markdown
# Coordination Without Bottlenecks: Decentralized Task Allocation at Scale

## The Coordination Problem JADE Solves

When you have 180+ skills (agents) that must collaborate to solve complex problems, the naive approach is a central coordinator: a master agent that knows all tasks, assigns work, and waits for results. This fails catastrophically at scale. The coordinator becomes a bottleneck (every decision flows through it), a single point of failure (if it crashes, the system stops), and a complexity sink (it must understand every skill's capabilities and constraints).

JADE's answer, formalized through FIPA standards and proven in production systems like OASIS (air traffic control at Sydney airport), is **market-based coordination via the Contract Net protocol**. This inverts the command hierarchy: instead of a master dictating task assignments, agents autonomously bid on tasks based on their local capabilities, and managers select bids using domain-specific logic.

## The Contract Net Protocol: Anatomy of Decentralized Coordination

The Contract Net protocol (Smith & Davis, 1980, operationalized in FIPA29) decomposes coordination into five phases:

1. **Task Announcement**: A manager agent broadcasts a Call for Proposals (CFP) specifying a task, deadline, and evaluation criteria.
2. **Bidding**: Contractor agents evaluate whether they can perform the task. If yes, they submit a PROPOSE message with cost, estimated completion time, and preconditions. If no, they send REFUSE.
3. **Award**: The manager evaluates all proposals (by deadline), selects the best bid using domain logic, and sends ACCEPT-PROPOSAL to the winner.
4. **Execution**: The contractor performs the task.
5. **Reporting**: The contractor sends INFORM (success with results) or FAILURE (attempted but couldn't complete).

**Critical non-obvious feature**: Preconditions are **explicit in bids**, not hidden in implementation. A contractor might bid: "I can sell this book for $30, provided you pay within 24 hours and accept delivery in 7 days." The manager can then evaluate bids not just on price but on whether preconditions are compatible with higher-level constraints.

### Example: Book-Trading System

The book demonstrates Contract Net through a second-hand book marketplace. A BookBuyerAgent wants a specific title with `max_price = $50` and `deadline = 1 hour`. Multiple BookSellerAgents have copies but different pricing strategies.

**Buyer's strategy** (temporal dynamics):
```
acceptable_price(t) = max_price × (elapsed_time / total_time)
```
As the deadline approaches, the buyer's willingness to pay increases linearly. At `t=0`, the buyer only accepts `$0`. At `t=1 hour`, the buyer accepts up to `$50`. This encodes urgency as a price signal.

**Seller's strategy** (temporal dynamics):
```
current_price(t) = init_price - (init_price - min_price) × (elapsed_time / total_time)
```
A seller starts at `init_price = $40` and decreases linearly toward `min_price = $20` as the deadline nears. This encodes desperation—the seller would rather sell cheap than not sell at all.

**Coordination emerges** without explicit negotiation: the buyer and seller curves eventually intersect (buyer's willingness rises, seller's asking price falls), and a transaction occurs. The Contract Net protocol provides the messaging structure; the pricing strategies provide the decision logic.

### Why This Scales

Contrast with master/slave coordination:
- **Master/slave**: O(1) latency per decision (manager is always consulted), but manager must store and reason about all N agents → O(N) state complexity, O(N) bottleneck.
- **Contract Net**: O(N) latency per task (broadcast CFP, wait for bids), but each agent reasons locally → O(1) state per agent, no bottleneck.

The book explicitly states: *"The main disadvantage [of hierarchical architectures] is that the architecture depends on all layers and is not fault tolerant, so if one layer fails, the entire system fails."* Contract Net eliminates this failure mode because no single agent is critical—if a contractor fails after winning a bid, the manager can reissue the CFP.

For systems with 180+ skills, the lesson is: **Don't centralize decisions that can be made locally.** Use Contract Net (or similar market mechanisms) when:
- Tasks can be meaningfully decomposed into independent units
- Contractors have heterogeneous capabilities (not all can do all tasks)
- Evaluation criteria can be expressed as bids (cost, time, quality)
- Failure recovery is critical (multiple bidders = built-in redundancy)

## Caching and Locality: The Hidden Optimization

While Contract Net decentralizes task allocation, JADE still has central services (the Global Agent Descriptor Table, or GADT, maps agent names to locations). The book reveals a critical optimization:

> "The cache replacement policy is LRU (least recently used), which was designed to optimize long conversations rather than sporadic, single message exchange conversations which are actually fairly uncommon in multi-agent applications."

This assumption—that agents engage in **extended conversations** (sequences of related messages) rather than one-off requests—is baked into the platform's performance model. Each container caches the GADT locally. When an agent sends a message, the runtime:
1. Checks the local cache for the recipient's address
2. If hit: sends directly
3. If miss: queries the main container, caches the result, then sends

**First-hit latency** is high (cache miss + network round-trip), but subsequent messages in the same conversation are fast (cache hit). This is why the book emphasizes conversation control fields:

> "It is a good practice to specify the conversation control fields in the messages exchanged within the conversation. This allows the easy creation of unambiguous templates matching the possible replies."

The `conversation-id` and `in-reply-to` fields aren't just for developer convenience—they enable the runtime to route correlated messages efficiently through the cached paths.

### Failure Mode: When the Assumption Breaks

If the assumption of long conversations is violated (many one-off requests to different agents), the cache thrashes. Every message becomes a cache miss. Performance degrades invisibly—the system still works, but latency spikes.

**For WinDAGs**: If orchestrating 180+ skills with frequent one-off requests (e.g., invoking many skills once each, rather than repeatedly invoking a few), the caching strategy fails. Solutions:
1. **Pre-warm caches**: At startup, populate the GADT cache with frequently-used skill addresses
2. **Conversation affinity**: Batch related skill invocations to exploit locality
3. **Explicit caching hints**: Allow skills to declare "I'll be talking to Skill X repeatedly" so the runtime can optimize

## The Mediator Pattern: Controlled Bottlenecks

The split-container architecture (for mobile/constrained devices) introduces a **voluntary bottleneck**: the mediator. All front-end agents (on phones, edge devices) connect through a single mediator, which:
- Accepts CREATE_MEDIATOR requests from front-ends
- Instantiates back-end agents on the server
- Maintains a lookup table: `container-name → back-end`
- Routes reconnections via CONNECT_MEDIATOR

> "The only element accepting connections (i.e. embedding a server socket) is the mediator. Therefore, if the mediator, the main container, and other normal containers, if any, are running behind a firewall, the only requirement is to open the port used by the mediator to listen for incoming connections."

**Why this works**: Discovery and recovery are inherently centralized problems (you need a rendezvous point). But **data flow** is decentralized—once connected, front-end and back-end communicate directly without mediator involvement. The mediator is a **control plane**, not a **data plane**.

**Failure mode**: The mediator is a single point of failure for new connections. Existing connections survive mediator failure, but new devices can't join until it restarts. The book acknowledges this but offers no replication strategy for the mediator itself (unlike the Main Replication Service for the main container).

**For WinDAGs**: If you have unreliable execution environments (e.g., AWS Lambda functions that can be killed mid-execution), use a split architecture:
- **Front-end**: Stateless skill executor (runs in Lambda)
- **Back-end**: Stateful coordinator (runs in ECS/EKS)
- **Mediator**: Service discovery + connection manager (runs in a replicated control plane)

Discovery flows through the mediator; execution flows directly between front-end and back-end.

## Yellow Pages: Service Discovery as Coordination Infrastructure

The Directory Facilitator (DF) is JADE's service registry. Agents publish **service descriptions** (not just "I exist" but "I provide book-selling with these properties"):

```java
DFAgentDescription dfd = new DFAgentDescription();
dfd.setName(getAID());
ServiceDescription sd = new ServiceDescription();
sd.setType("book-selling");
sd.setName("book-trade");
DFService.register(this, dfd);
```

Other agents search using **template matching**:

```java
DFAgentDescription template = new DFAgentDescription();
ServiceDescription sd = new ServiceDescription();
sd.setType("book-selling");
template.addServices(sd);
DFAgentDescription[] result = DFService.search(this, template);
```

**Why this matters for coordination**: Agents don't hard-code peer identities. A BookBuyerAgent doesn't know "contact AgentX at 192.168.1.10:1099"—it knows "find any agent providing book-selling." This enables:
1. **Dynamic substitution**: If Agent X crashes, Agent Y (also providing book-selling) can take over without buyer code changes
2. **Load balancing**: Multiple sellers can list the same service; buyer gets all results and applies domain logic (choose cheapest, closest, fastest)
3. **Graceful degradation**: If no sellers are available, the search returns an empty list; buyer can retry, escalate, or abort gracefully

The book reveals that DF state can be persisted to SQL databases (DFHSQLKB) or custom backends (DFKBFactory). This means:
- The DF survives platform restarts
- Service registrations are durable
- Federation is possible (multiple platforms can share a DF)

**For WinDAGs**: Implement a skill registry (similar to DF) where:
- Each skill publishes: `(name, type, version, SLA, preconditions, postconditions)`
- Orchestrators query by **capability** (intent-based addressing): "I need a skill that transforms PDFs to text"
- Registry returns all matching skills, sorted by SLA or cost
- Orchestrator applies domain logic to select the best fit

## Message Templates: Declarative Routing

With multiple concurrent workflows, the message routing problem is: **How does a behavior know which messages are for it?** JADE's answer: **MessageTemplate**, a declarative filter that matches messages based on headers, not by manually checking each message.

Example from the book-trading system:

```java
ACLMessage cfp = new ACLMessage(ACLMessage.CFP);
cfp.setConversationId("book-trade");
cfp.setReplyWith("cfp" + System.currentTimeMillis());
myAgent.send(cfp);

MessageTemplate mt = MessageTemplate.and(
    MessageTemplate.MatchConversationId("book-trade"),
    MessageTemplate.MatchInReplyTo(cfp.getReplyWith()));

ACLMessage reply = myAgent.receive(mt);
```

The template `mt` matches messages where:
- `conversation-id = "book-trade"` (this is part of the book-trading workflow)
- `in-reply-to = cfp.getReplyWith()` (this is a reply to the specific CFP I sent)

**Why this is elegant**: Without templates, the agent would need to manually check every message in its queue, track which CFP each reply corresponds to, and handle out-of-order delivery. Templates make this **declarative and automatic**.

Templates compose with AND, OR, NOT operators (not shown in the excerpt but standard in JADE). For example:

```java
MessageTemplate highPriority = MessageTemplate.or(
    MessageTemplate.MatchPerformative(ACLMessage.REQUEST),
    MessageTemplate.MatchPerformative(ACLMessage.CFP));
```

This matches messages that are either REQUEST or CFP (useful for prioritizing time-sensitive messages).

**For WinDAGs**: Implement correlation IDs (similar to conversation-id) and request-reply matching (similar to in-reply-to). When Orchestrator A invokes Skill B:
1. Orchestrator generates unique request ID: `req-12345`
2. Orchestrator sends request with header `request-id: req-12345`
3. Skill B processes, responds with header `in-reply-to: req-12345`
4. Orchestrator uses template `MatchInReplyTo("req-12345")` to route response to the correct workflow state

This avoids a common bug: multiple workflows invoke the same skill concurrently, responses arrive out of order, and workflows get each other's results.

## Lessons for 180+ Skill Orchestration

1. **Use Contract Net for resource allocation**: If multiple skills can perform a task, broadcast a CFP and let them bid. Select based on cost, latency, or other criteria. This scales better than a central task queue.

2. **Cache skill addresses locally**: Don't query the skill registry on every invocation. Assume conversation locality—if you invoke Skill X once, you'll probably invoke it again soon. Cache the address.

3. **Separate discovery from execution**: Use a mediator or registry for discovery (where is Skill X?). Use direct connections for execution (invoke Skill X). Don't route data through the discovery service.

4. **Make preconditions explicit in bids**: A skill's bid should include: "I can do this task IF these conditions hold." The orchestrator evaluates bids not just on cost but on whether preconditions are met.

5. **Use message templates for routing**: Don't manually check message headers in application code. Declare templates that match relevant messages and let the runtime filter.

6. **Design for long conversations**: If skills are repeatedly invoked in workflows, batch related invocations to exploit caching and connection reuse. Avoid one-off invocations scattered across many skills.

7. **Fail explicitly, not silently**: Use REFUSE (before starting), FAILURE (started but couldn't complete), and NOT_UNDERSTOOD (semantic mismatch) performatives. This allows orchestrators to apply different recovery strategies for different failure modes.

The architecture JADE demonstrates—decentralized coordination with targeted use of centralized services (DF, mediator)—is the only proven approach for scaling intelligent systems beyond a few dozen agents. The patterns are directly transferable to DAG-based orchestration systems managing hundreds of skills.
```

---

### FILE: semantic-grounding-for-skill-composition.md

```markdown
# Semantic Grounding for Skill Composition: How Agents Understand Each Other

## The Semantic Interoperability Problem

When you have 180+ skills built by different teams, possibly in different languages, running on different platforms, how do they understand each other's messages? The naive answer—"just use JSON or Protocol Buffers"—solves syntax (how to encode data) but not semantics (what the data means).

JADE's answer, formalized in FIPA-SL (Semantic Language) and the Content Reference Model, is: **Agents must share ontologies—formal, explicit descriptions of concepts, properties, and relationships.** Without ontologies, message passing is like two people speaking different languages using the same alphabet.

## The Three-Layer Model: Syntax, Structure, Semantics

JADE separates three concerns:

1. **Content Language** (syntax): How concepts are encoded as bytes or strings. JADE supports three:
   - **SL (Semantic Language)**: Human-readable S-expressions, e.g., `(Book :title "JADE" :price 50)`
   - **LEAP**: Binary format for bandwidth-constrained devices (mobile phones, IoT)
   - **XML**: For interoperability with external systems (Web services, databases)

2. **Ontology** (structure): What concepts exist and how they relate. Defined as schemas:
   - **ConceptSchema**: Entities with slots (Book has title, authors, editor)
   - **PredicateSchema**: Statements about the world (Costs associates a Book with a price)
   - **AgentActionSchema**: Performable actions (Sell transfers ownership of a Book)

3. **Semantic Interpretation** (meaning): How agents reason about messages. Governed by Semantic Interpretation Principles (SIPs), which are pluggable rules that extract meaning from messages and update beliefs/behaviors.

The book emphasizes this separation:

> "According to FIPA terminology this syntax is known as a content language... According to FIPA terminology this... set of concepts and the symbols used to express them are known as an ontology."

**Why not just use Java serialization?** The book gives three reasons:
1. "Only applicable in a Java environment" (not interoperable)
2. "Non-human-readable format" (hard to debug)
3. "An agent receiving a message has no means of determining the kind of object it will obtain when decoding" (no schema validation)

Java serialization conflates syntax and semantics—it encodes how objects are laid out in memory, not what they mean.

## Ontology Definition: The BookTradingOntology Example

The book-trading system defines an ontology with three core elements:

### 1. Concept: Book
```java
ConceptSchema cs = (ConceptSchema) getSchema(BOOK);
cs.add(BOOK_TITLE, 
    (PrimitiveSchema) getSchema(BasicOntology.STRING));
cs.add(BOOK_AUTHORS, 
    (PrimitiveSchema) getSchema(BasicOntology.STRING), 
    0, ObjectSchema.UNLIMITED);  // 0 or more authors
cs.add(BOOK_EDITOR, 
    (PrimitiveSchema) getSchema(BasicOntology.STRING), 
    ObjectSchema.OPTIONAL);  // may be null
```

**Cardinality constraints** are first-class:
- `BOOK_TITLE`: Exactly one (mandatory, singular)
- `BOOK_AUTHORS`: Zero or more (optional, multi-valued sequence)
- `BOOK_EDITOR`: Zero or one (optional, singular)

This schema is **enforced at serialization/deserialization**. If you try to send a Book with two titles or missing a mandatory title, the codec rejects it before the message leaves the sender. This prevents silent semantic errors.

### 2. Predicate: Costs
```java
add(new PredicateSchema(COSTS), Costs.class);
```

A predicate associates a Book with a price. Predicates are **statements about the world** that can be true or false. When an agent receives `(Costs (Book :title "JADE") 50)`, it can assert this into its belief base, query it later, or use it in reasoning (e.g., "Is this book affordable given my budget?").

### 3. Agent Action: Sell
```java
add(new AgentActionSchema(SELL), Sell.class);
```

An action is something an agent can perform. The `Sell` action has preconditions (the book must be for sale) and postconditions (the book is no longer for sale). Actions are used in REQUEST messages: "Please perform the Sell action with these parameters."

### Ontology Composition

Ontologies can extend other ontologies:

```java
public BookTradingOntology() {
    super(ONTOLOGY_NAME, BasicOntology.getInstance());
    // Now inherits STRING, INTEGER, BOOLEAN from BasicOntology
}
```

The `BasicOntology` defines primitives (numbers, strings, dates), aggregates (sets, sequences), and meta-constructs (variables, identifying referential expressions). Application ontologies build on top.

**For WinDAGs**: Define a **base skill ontology** with primitives (task ID, timestamp, status code). Each skill's specific ontology extends this base:

```
BaseSkillOntology
  ├─ Task (id, timestamp, requester)
  ├─ Result (status, output, error)
  └─ Resource (type, availability)

PDFProcessingOntology extends BaseSkillOntology
  ├─ PDFDocument (filename, pages, encoding)
  └─ ExtractText (input: PDFDocument, output: Text)

TextAnalysisOntology extends BaseSkillOntology
  ├─ Text (content, language, length)
  └─ Sentiment (input: Text, output: Score)
```

The orchestrator can reason about `Task` and `Result` (common across all skills) without knowing PDFDocument or Sentiment details. Type safety across skill boundaries.

## Content Extraction and Filling: The Two-Way Bridge

JADE's `ContentManager` provides two operations:

### Extraction: Message → Java Objects
```java
ContentManager cm = myAgent.getContentManager();
Action act = (Action) cm.extractContent(msg);
Sell sellAction = (Sell) act.getAction();
Book book = sellAction.getItem();
int price = book.getPrice();
```

The runtime:
1. Decodes the message content using the registered codec (SL, LEAP, or XML)
2. Validates against the ontology schemas (are all mandatory slots present? do types match?)
3. Instantiates Java objects using reflection or custom introspectors
4. Returns typed objects to application code

**Critical**: The agent never sees strings like `"(Book :title \"JADE\")"`. It sees a `Book` object with a `getTitle()` method. Type safety is enforced by the ontology.

### Filling: Java Objects → Message
```java
ContentElementList cel = new ContentElementList();
cel.add(act);  // Re-use the action from the request

Costs costs = new Costs();
costs.setItem(book);
costs.setPrice(30);
cel.add(costs);

cm.fillContent(reply, cel);
```

The runtime:
1. Validates that `cel` contains elements registered in the ontology
2. Serializes using the codec specified in the message header
3. Sets the message content

**Error handling**: Two exception types reveal the failure modes:
- `OntologyException`: Schema validation failed (e.g., required slot missing, wrong type)
- `CodecException`: Encoding failed (e.g., unsupported characters in string, number out of range)

The book shows these caught separately in the CallForOfferServer behavior:

```java
catch (OntologyException oe) {
    oe.printStackTrace();
    reply.setPerformative(ACLMessage.NOT_UNDERSTOOD);
}
catch (CodecException ce) {
    ce.printStackTrace();
    reply.setPerformative(ACLMessage.NOT_UNDERSTOOD);
}
```

This is **explicit semantic error handling**: if the sender's message doesn't match the receiver's ontology, respond with NOT_UNDERSTOOD (a FIPA-ACL performative). The sender can then:
- Retry with corrected data
- Negotiate a common ontology
- Escalate to a human

## FIPA-SL: Formal Semantics for Agent Communication

FIPA-SL is a first-order logic extended with modal operators for beliefs, intentions, and actions. It's not just a data format—it's a **language for reasoning**.

### Basic Terms
```
Numbers:       123, -45.6E1
Strings:       "prime numbers"
Dates:         20231215T093000000z  (ISO 8601)
Sets:          (set 2 2 1) ≡ (set 1 2)   [unordered, no duplicates]
Sequences:     (sequence 2 2 1) ≠ (sequence 1 2)   [ordered]
```

### Functional Terms (Ontology Instances)
```
(Book :title "JADE" :authors (sequence "Bellifemine" "Caire" "Greenwood"))
```

This is a term of type `Book` with slot bindings. The `:keyword` syntax makes slots explicit (not positional).

### Predicates (Assertions)
```
(Costs (Book :title "JADE") 50)
```

This asserts: "The book titled 'JADE' costs $50." Can be stored in a belief base, queried, or used in logical inference.

### Action Expressions
```
(action seller (Sell :item (Book :title "JADE") :price 50))
```

This says: "The agent named 'seller' performs the Sell action with these parameters." Used in REQUEST messages.

### Identifying Referential Expressions (IREs)

IREs are queries expressed as logic formulas:

```
(all ?x (prime ?x))                     # All prime numbers
(iota ?x (and (Book ?x) (= (title ?x) "JADE")))   # The unique Book with title "JADE"
(any ?x (author "Bellifemine" ?x))      # Any book authored by Bellifemine
(some ?x (< (price ?x) 30))             # Some books costing less than $30
```

**Why IREs matter**: Instead of hard-coding queries ("give me all books under $30"), agents express queries as logical formulas. The receiver can interpret these formulas **even if it doesn't have a pre-defined query handler**. This is **semantic flexibility**.

Example from the book:

> "Without any coding, a semantic agent is able to answer any query about a fact he has been informed of previously."

If Agent A tells Agent B: `(Costs (Book :title "JADE") 50)`, and later Agent C asks Agent B: `(all (sequence ?x ?y) (Costs ?x ?y))`, Agent B can answer automatically by querying its belief base—no application code needed.

### Meta-References (Pattern Matching)

```
Pattern:   (Costs (Book :title ??title) ??price)
Instance:  (Costs (Book :title "JADE") 50)
Match:     ??title = "JADE", ??price = 50
```

Double `??` marks a **meta-variable** (not a logic variable `?x`). Used for pattern matching in SIPs (Semantic Interpretation Principles) and filters.

## Semantic Agents: Interpretation, Not Handling

Traditional agents are structured as message handlers:

```java
void handleRequest(ACLMessage msg) {
    String action = msg.getContent();
    if (action.equals("sell_book")) {
        sellBook(...);
    } else if (action.equals("query_price")) {
        queryPrice(...);
    }
    // ... 50 more cases
}
```

This is brittle: every new message type requires a new handler. Semantic agents invert this:

```java
// No explicit handlers!
// Instead: register Semantic Interpretation Principles (SIPs)
```

The **SemanticInterpreterBehaviour** (JADE's built-in behavior for semantic agents) does:
1. Receives a message
2. Extracts its meaning as a **Semantic Representation (SR)** (a FIPA-SL formula)
3. Applies SIPs in sequence
4. Each SIP may:
   - Update the agent's belief base
   - Generate new SRs (e.g., "achieving this goal requires performing action X")
   - Add or remove behaviors

### Example: The Simplest Agent

The book demonstrates an agent created with **zero application code**:

```bash
java -cp ... jade.Boot -gui simplest:jade.semantics.interpreter.SemanticAgentBase()
```

This agent can:
1. **Handle INFORM messages**: Extract facts and assert them into the belief base
2. **Answer QUERY-REF**: Respond with all facts matching the query pattern
3. **Handle REQUEST**: Parse action expressions and perform actions
4. **Handle SUBSCRIBE**: Automatically send updates when relevant facts change

All of this works because **generic SIPs implement FIPA-ACL semantics**. For example:

- **Belief Transfer SIP**: On receiving `(INFORM :content "(Costs (Book :title \"JADE\") 50)")`, assert `(Costs ...)` into belief base
- **Query SIP**: On receiving `(QUERY-REF :content "(all ?x (Costs ?x ?y))")`, query belief base for all `(Costs ...)` facts, serialize results, send INFORM reply
- **Intention Transfer SIP**: On receiving `(REQUEST :content "(action myself (Sell ...))")`, create an intention to perform the Sell action

### Three Ways to Request the Same Action

The book shows that semantic agents handle these identically:

1. **Direct request**:
   ```
   (REQUEST :content "(action seller (Sell :item (Book :title \"JADE\") :price 50))")
   ```

2. **Inform about intention to act**:
   ```
   (INFORM :content "(I other (done (action seller (Sell :item (Book :title \"JADE\") :price 50))))")
   ```
   Translates to: "I (the other agent) intend that it becomes true that seller has done the Sell action."

3. **Inform about intention for effect**:
   ```
   (INFORM :content "(I other (not (for_sale (Book :title \"JADE\"))))")
   ```
   Translates to: "I intend that the book is no longer for sale." The semantic agent infers that performing the Sell action achieves this effect (because Sell's postcondition is `not (for_sale ...)`).

**How this works**: The SIPs are rule-based:
- **Action Features SIP**: Extracts the intent from any message (what does the sender want?)
- **Planning SIP**: Finds actions whose postconditions match the intent
- **Execution SIP**: Performs the action

No hard-coded message handlers. The reasoning is declarative.

## Belief Bases: Three-State Logic for Reasoning Under Uncertainty

A semantic agent's belief base stores **mental attitudes** (not just facts):

- Beliefs about facts: `(Costs (Book :title "JADE") 50)`
- Beliefs about other agents' beliefs: `(B seller (for_sale (Book :title "JADE")))`
- Uncertainties: neither `p` nor `¬p` is in the base

**Critical non-obvious point**: Three states, not two:
1. Agent believes `p` (formula `p` is in belief base)
2. Agent believes `¬p` (formula `¬p` is in belief base)
3. Agent is **uncertain** about `p` (neither is in belief base)

This asymmetry matters for reasoning. If Agent A queries Agent B: "Is book X for sale?" and B doesn't have that fact, B should respond "I don't know," not "No." The three-state logic makes this explicit.

### Filters: Middleware for Belief Management

Belief bases are accessed through **assertion filters** (intercept writes) and **query filters** (intercept reads). This decouples storage from logic.

Example: **Maintain uniqueness of prices**

When a new price is asserted, retract the old price first:

```java
kb.addKBAssertFilter(
    new KBAssertFilterAdapter("(B ??myself (selling_price ??isbn ??price ??seller))") {
        public Formula doApply(Formula formula, MatchResult match) {
            Term isbn = match.term("isbn");
            // Retract old price
            myKBase.retractFormula(SELLING_PRICE_FORMULA.instantiate("isbn", isbn));
            // Now allow new price to be asserted
            return formula;
        }
    });
```

Example: **Cascade-retract when book is no longer for sale**

```java
kb.addKBAssertFilter(
    new KBAssertFilterAdapter("(B ??myself (not (for_sale ??isbn ??seller)))") {
        public Formula doApply(Formula formula, MatchResult match) {
            Term isbn = match.term("isbn");
            // Remove all facts about this book
            myKBase.retractFormula(ISBN_FORMULA.instantiate("isbn", isbn));
            myKBase.retractFormula(TITLE_FORMULA.instantiate("isbn", isbn));
            myKBase.retractFormula(SELLING_PRICE_FORMULA.instantiate("isbn", isbn));
            return new TrueNode(); // Prevent assertion (already handled)
        }
    });
```

Example: **Query filter for substring matching** (derived fact)

```java
kb.addKBQueryFilter(
    new KBQueryFilterAdapter("(B ??myself (zsubstr ??str ??substr))") {
        public MatchResult doApply(Formula formula, MatchResult match) {
            String str = ((Constant)match.term("str")).stringValue();
            String substr = ((Constant)match.term("substr")).stringValue();
            return (str.indexOf(substr) != -1) ? match : null;
        }
    });
```

The predicate `(zsubstr ...)` isn't stored in the belief base—it's computed on-demand. This allows reasoning about facts that are expensive or impossible to enumerate.

**For WinDAGs**: Use filters to:
1. **Enforce invariants**: E.g., "Only one skill can claim ownership of resource X"
2. **Cascade updates**: E.g., "If skill A fails, invalidate all results computed by skills that depend on A"
3. **Derived facts**: E.g., "Query for 'is resource Y available' by checking current allocation state, not stored facts"

## Ontological Actions: Declarative Skill Contracts

The book introduces `OntologicalAction`—a pattern for defining skills with explicit preconditions and postconditions:

```java
class SellBookAction extends OntologicalAction {
    public SellBookAction() {
        super(BookSellerCapabilities.this,
              "(SELL_BOOK :buyer ??buyer :isbn ??isbn :price ??price)",  // pattern
              "(not (for_sale ??isbn ??actor))",    // postcondition
              "(for_sale ??isbn ??actor)");          // precondition
    }

    public void perform(OntoActionBehaviour behaviour) {
        switch (behaviour.getState()) {
            case OntoActionBehaviour.START:
                // Extract parameters
                isbn = getActionParameter("isbn");
                buyer = getActionParameter("buyer");
                price = getActionParameter("price");
                behaviour.setState(OntoActionBehaviour.RUNNING);
                break;

            case OntoActionBehaviour.RUNNING:
                // Perform the sale
                System.out.println("Selling " + isbn + " to " + buyer + " for " + price);
                behaviour.setState(OntoActionBehaviour.SUCCESS);
                break;
        }
    }
}
```

The `OntoActionBehaviour` FSM checks:
1. **Before START**: Is the precondition satisfied? If no → state = FEASIBILITY_FAILURE
2. **During RUNNING**: Perform the action
3. **On SUCCESS**: Assert the postcondition into the belief base
4. **On EXECUTION_FAILURE**: Don't assert postcondition (belief base remains consistent)

**For WinDAGs**: Each skill should be an OntologicalAction:

```python
class ExtractTextSkill(OntologicalAction):
    pattern = "(ExtractText :input ??pdf :output ??text)"
    precondition = "(available ??pdf)"
    postcondition = "(extracted ??text ??pdf)"

    def perform(self, state):
        if state == START:
            pdf = self.get_parameter("pdf")
            self.state = RUNNING
        elif state == RUNNING:
            text = extract_text_from_pdf(pdf)
            self.set_parameter("text", text)
            self.state = SUCCESS
```

The orchestrator can:
- Query: "Which skills have `(available ??pdf)` as precondition?" → finds ExtractText
- Verify: Before invoking ExtractText, check belief base for `(available pdf123)`
- Commit: After ExtractText succeeds, assert `(extracted text456 pdf123)`
- Rollback: If ExtractText fails, belief base unchanged; orchestrator can retry or abort

## Lessons for 180+ Skill Orchestration

1. **Define ontologies before building skills**: Each skill publishes preconditions, postconditions, input concepts, output concepts. The orchestrator reasons about these schemas, not skill implementations.

2. **Use FIPA-SL (or equivalent) for semantic grounding**: Don't exchange JSON blobs with implicit contracts. Use a formal language where agents can query, reason, and validate meaning.

3. **Separate syntax, structure, and semantics**: Support multiple content languages (binary for performance, text for debugging, XML for integration). All must map to the same ontology.

4. **Use belief bases with filters**: Don't scatter state across skill implementations. Centralize beliefs in a managed store with assertion/query filters that enforce invariants.

5. **Embrace three-state logic**: Unknown ≠ False. If a skill hasn't reported a result yet, the orchestrator should treat it as uncertain, not failed.

6. **Use IREs for flexible queries**: Instead of hard-coding "get all skills with status=ready", express as `(all ?x (and (Skill ?x) (status ?x "ready")))`. New skill types automatically match if they conform to the ontology.

7. **Design skills as OntologicalActions**: Explicit preconditions enable feasibility checks before execution. Explicit postconditions enable automatic belief updates and dependency tracking.

The semantic framework JADE provides isn't optional sophistication—it's the only proven way to make heterogeneous agents interoperate reliably at scale. Without it, you're back to brittle string parsing and implicit contracts.
```

---

### FILE: failure-resilient-distributed-coordination.md

```markdown
# Failure-Resilient Distributed Coordination: How Production Agent Systems Stay Alive

## The Distributed Failure Problem

Distributed systems fail in ways single-machine systems don't. JADE, running production systems like OASIS (air traffic control at Sydney airport) and industrial process control, codifies hard-won lessons about how to keep multi-agent systems running when components fail.

The book's approach: **Failure is not exceptional—it's structural.** The architecture assumes:
- Messages can be lost or delayed
- Agents can crash mid-execution
- Network partitions can isolate subsets of agents
- Devices can go offline and reconnect hours later

Rather than try to prevent failures (impossible), JADE provides **protocols and patterns that degrade gracefully**.

## Layer 1: Protocol-Level Failure Handling

FIPA-ACL defines **performatives** (communicative acts) that explicitly represent failure:

- **REFUSE**: "I can't do this task" (sent *before* starting)
- **FAILURE**: "I tried but couldn't complete" (sent *after* starting)
- **NOT-UNDERSTOOD**: "I can't parse your message" (semantic mismatch)
- **CANCEL**: "Stop what you're doing" (meta-protocol)

These aren't error codes—they're **first-class messages** that agents must be prepared to receive and handle.

### Example: Contract Net with Explicit Failure Paths

The Contract Net protocol (FIPA29) includes failure handling at every step:

```
1. Manager sends CFP (Call for Proposals)
   - Contractors can respond: PROPOSE (I can do it) or REFUSE (I can't)
   - Timeout if no responses → Manager retries or escalates

2. Manager sends ACCEPT-PROPOSAL to winner
   - Contractor can respond: AGREE (I'm starting) or REFUSE (I changed my mind)
   - AGREE establishes a contract (commitment)

3. Contractor executes
   - On success: INFORM (result)
   - On failure: FAILURE (reason)
   - Timeout → Manager retries with another contractor

4. Manager can send CANCEL at any time
   - Contractor must stop and respond: INFORM (stopped) or FAILURE (couldn't stop cleanly)
```

**Key design principle**: Every step has **explicit failure paths**, not implicit error handling. The protocol anticipates refusal, timeout, and cancellation as **normal cases**, not exceptions.

### Book-Trading Example: Refusal Before Commitment

The BookSellerAgent checks preconditions before agreeing to sell:

```java
private class CallForOfferServer extends CyclicBehaviour {
    public void action() {
        ACLMessage msg = myAgent.receive();
        if (msg != null) {
            String title = msg.getContent();
            ACLMessage reply = msg.createReply();
            PriceManager pm = (PriceManager) catalogue.get(title);
            if (pm != null) {
                reply.setPerformative(ACLMessage.PROPOSE);
                reply.setContent(String.valueOf(pm.getCurrentPrice()));
            } else {
                reply.setPerformative(ACLMessage.REFUSE);  // No commitment
            }
            myAgent.send(reply);
        }
    }
}
```

If the book isn't in the catalog, the seller **immediately refuses** (doesn't accept and then fail later). This prevents wasted work and allows the buyer to query other sellers quickly.

**For WinDAGs**: Skills should check preconditions *before* accepting work:

```python
def handle_task_request(task):
    if not check_preconditions(task):
        return REFUSE(reason="Preconditions not met")
    if resource_unavailable():
        return REFUSE(reason="Resource busy")
    # Only accept if we can commit
    return AGREE()
```

This is better than accepting and failing later (which blocks the requester while you fail).

## Layer 2: Message-Level Reliability

### Asynchronous Message Passing with Timeouts

JADE's communication is **asynchronous by default**:

> "Message-based asynchronous communication is the basic form of communication between agents in JADE; an agent wishing to communicate must send a message to an identified destination (or set of destinations). There is no temporal dependency between the sender and receivers: a receiver might not be available when the sender issues the message."

This eliminates **temporal coupling**: the sender doesn't block waiting for a reply. But it introduces a problem: **How do you know if a reply is coming?**

JADE's solution: **blockingReceive with timeout**:

```java
ACLMessage reply = myAgent.blockingReceive(mt, timeout);
if (reply == null) {
    // Timeout: receiver didn't respond
    // Options: retry, escalate, abort
}
```

The `timeout` parameter is critical. Without it, the agent hangs indefinitely if the receiver crashes. With it, the agent can implement **retry logic**:

```java
int retries = 3;
ACLMessage reply = null;
while (retries > 0 && reply == null) {
    myAgent.send(request);
    reply = myAgent.blockingReceive(mt, 5000); // 5 sec timeout
    retries--;
}
if (reply == null) {
    // All retries exhausted: escalate or fail gracefully
}
```

### Persistent Message Delivery

For critical messages (e.g., task assignments, payment transactions), JADE provides **Persistent Delivery Service**:

```
persistent-delivery-basedir: /var/jade/messages
persistent-delivery-storagemethod: file
persistent-delivery-sendfailureperiod: 60000  # Retry every 60 seconds
```

Messages are written to disk before sending. If delivery fails:
1. Message remains on disk
2. JADE retries periodically
3. If receiver comes online later, message is delivered
4. After successful delivery, message is deleted

**For WinDAGs**: Implement persistent queues (e.g., Kafka, RabbitMQ with durable queues) for inter-skill messages. If Skill B crashes while Skill A is sending results, the message waits in the queue until B restarts.

### Message Templates for Resilient Routing

The book emphasizes **conversation-id** and **in-reply-to** fields:

> "It is a good practice to specify the conversation control fields in the messages exchanged within the conversation. This allows the easy creation of unambiguous templates matching the possible replies."

This prevents a failure mode: Agent A sends requests to Skill X and Skill Y concurrently. Responses arrive out of order. Without correlation IDs, Agent A can't tell which response is for which request.

**Pattern from book-trading**:

```java
// Send CFP with unique ID
cfp.setConversationId("book-trade");
cfp.setReplyWith("cfp" + System.currentTimeMillis());

// Create template that matches only replies to this CFP
MessageTemplate mt = MessageTemplate.and(
    MessageTemplate.MatchConversationId("book-trade"),
    MessageTemplate.MatchInReplyTo(cfp.getReplyWith()));

// Receive with template: only matching replies are returned
ACLMessage reply = myAgent.receive(mt);
```

**For WinDAGs**: Every skill invocation should include:
- **Request-ID**: Globally unique (UUID)
- **Conversation-ID**: Identifies the workflow instance
- **In-reply-to**: Points to the request this is responding to

This allows the orchestrator to:
- Route responses to the correct workflow state
- Detect lost messages (request sent, no reply with matching in-reply-to after timeout)
- Detect duplicate messages (same request-id seen twice → deduplicate)

## Layer 3: Agent-Level Resilience

### Cooperative Scheduling Eliminates Synchronization Bugs

JADE uses **non-preemptive scheduling** for behaviors:

> "The scheduling of behaviours in an agent is not pre-emptive (as for Java threads), but cooperative. This means that when a behaviour is scheduled for execution its action() method is called and runs until it returns."

**Why this matters for failure prevention**:
1. **No data races**: Only one behavior runs at a time per agent → no need for locks
2. **Predictable state**: Behaviors see consistent snapshots of agent state
3. **Explicit yield points**: Behaviors call `block()` to yield control → agent can schedule other behaviors or check for termination

**Failure mode this prevents**: Traditional multi-threaded agents can deadlock (two threads waiting for each other's locks) or corrupt state (race conditions). Cooperative scheduling eliminates both.

**Constraint**: Behaviors must **not block indefinitely** in `action()`. A misbehaving behavior can hang the agent. The book warns:

> "A behaviour such as that shown below will prevent any other behaviour from being executed because its action() method will never return."

**For WinDAGs**: If using cooperative scheduling for skill executors:
- Enforce **per-behavior timeouts** at the scheduler level
- If a behavior doesn't return within N seconds, forcibly terminate it
- Log timeout events for debugging (which behaviors are misbehaving?)

### State Machine Pattern for Explicit Failure Handling

The book demonstrates **FSM-based behaviors** where each state explicitly handles failure transitions:

```java
private class BookNegotiator extends Behaviour {
    private int step = 0;

    public void action() {
        switch (step) {
            case 0:  // Send CFP
                myAgent.send(cfp);
                step = 1;
                break;

            case 1:  // Collect replies
                ACLMessage reply = myAgent.receive(mt);
                if (reply != null) {
                    // Process reply
                    repliesCnt++;
                    if (repliesCnt >= sellerAgents.length) {
                        step = 2;  // All replies received
                    }
                } else {
                    block();  // Wait for more replies
                }
                break;

            case 2:  // Send purchase order
                if (bestSeller != null && bestPrice <= maxPrice) {
                    myAgent.send(order);
                    step = 3;
                } else {
                    step = 4;  // No acceptable offer → terminate
                }
                break;

            case 3:  // Receive confirmation
                reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.INFORM) {
                        // Success
                    }
                    step = 4;  // Terminal state
                } else {
                    block();
                }
                break;
        }
    }

    public boolean done() {
        return step == 4;
    }
}
```

**Explicit failure paths**:
- If no acceptable offers (step 2), jump directly to terminal state (step 4)
- If confirmation doesn't arrive (step 3), timeout logic (implicit in receive + block)
- Each state has a clear next state or terminal condition

**For WinDAGs**: Represent workflows as explicit FSMs:

```python
class WorkflowFSM:
    def __init__(self):
        self.state = "INIT"

    def step(self):
        if self.state == "INIT":
            self.send_requests()
            self.state = "WAITING"
        elif self.state == "WAITING":
            replies = self.receive_replies(timeout=5)
            if all_replies_received(replies):
                self.state = "PROCESSING"
            elif timeout_expired():
                self.state = "RETRY" if retries_left() else "FAILED"
        elif self.state == "PROCESSING":
            result = self.process(replies)
            if result.success:
                self.state = "SUCCESS"
            else:
                self.state = "FAILED"
        elif self.state in ["SUCCESS", "FAILED"]:
            return True  # Terminal state
        return False  # Not done yet
```

This makes failure handling **compositional**: each state's failure paths are explicit, and higher-level workflows can inspect the terminal state (SUCCESS vs. FAILED) to decide recovery.

## Layer 4: Platform-Level Resilience

### Main Container Replication

The main container (which hosts the AMS and DF) is a single point of failure. JADE provides **Main Replication Service** (MCRS):

```
Configuration:
jade_core_replication_AddressNotificationService: true
jade_core_replication_MainReplicationService: true
```

MCRS works by:
1. **Backup containers** periodically sync state from the main container
2. If the main container crashes, a backup **promotes itself** to main
3. Agents re-register with the new main container
4. Service continuity maintained (agents don't need to restart)

**For WinDAGs**: If the central orchestrator is a single point of failure:
- Deploy multiple orchestrator replicas (active-passive or active-active)
- Use leader election (e.g., Raft, Zookeeper) to choose the active orchestrator
- Replicate orchestrator state (workflow states, skill registry) across replicas
- On failover, workflows resume from last checkpointed state

### UDP Node Monitoring

JADE uses **periodic health checks** to detect dead agents:

```
udp-node-monitoring-pingdelay: 5000           # Ping every 5 seconds
udp-node-monitoring-pingdelaylimit: 30000     # Tolerate 30 sec delay
udp-node-monitoring-unreachablelimit: 3       # 3 missed pings → unreachable
```

If an agent doesn't respond to pings:
1. Mark as **unreachable**
2. Remove from routing tables (messages to it will fail-fast)
3. Notify dependent agents (if configured)

**For WinDAGs**: Implement heartbeat monitoring:
- Each skill sends heartbeat every N seconds
- Orchestrator expects heartbeats within 3N seconds
- If 3 consecutive heartbeats missed → mark skill as down
- Route new tasks to healthy replicas
- When skill recovers, re-add to pool automatically

## Layer 5: Application-Level Recovery Strategies

### The Connection Listener Pattern (JADE-LEAP)

For mobile agents (JADE-LEAP), the split-container architecture exposes **connection events**:

```java
MicroRuntime.setConnectionListener(new ConnectionListener() {
    public void handleConnectionEvent(int code, Object info) {
        switch (code) {
            case DISCONNECTED:
                // Cache messages locally
                log.warning("Connection lost");
                break;

            case RECONNECTED:
                // Flush cached messages
                log.info("Connection restored");
                break;

            case RECONNECTION_FAILURE:
                // Escalate to user or fallback to alternative network
                log.error("Reconnection failed after retries");
                break;

            case BE_NOT_FOUND:
                // Back-end was killed during disconnect
                log.error("Back-end lost: state unrecoverable");
                break;
        }
    }
});
```

**Why this matters**: The system doesn't pretend disconnections don't happen. Instead, it **exposes them to application logic** so apps can make informed decisions:
- Buffer messages during disconnect (don't fail silently)
- Retry reconnection with exponential backoff
- Escalate to user if recovery impossible
- Invalidate cached state if back-end lost

**For WinDAGs**: Expose similar events:
- `SKILL_UNAVAILABLE`: Registry lookup failed
- `EXECUTION_STALLED`: Skill started but no heartbeat
- `RESULT_UNDELIVERABLE`: Skill completed but orchestrator unreachable
- `WORKFLOW_TIMEOUT`: End-to-end deadline exceeded

Applications can register handlers:

```python
orchestrator.on_event(SKILL_UNAVAILABLE, lambda event: 
    retry_with_fallback(event.skill_id))

orchestrator.on_event(WORKFLOW_TIMEOUT, lambda event: 
    send_alert_to_human(event.workflow_id))
```

### Subscription-Based Monitoring

FIPA35 (Subscribe interaction protocol) enables **push-based updates**:

```
Agent A → Agent B: SUBSCRIBE (notify me when condition C holds)
Agent B: AGREE (I'll monitor C)
... time passes ...
Agent B → Agent A: INFORM (C is now true)
Agent A: CANCEL (stop monitoring)
```

**Use for failure detection**: An orchestrator can subscribe to skill health updates:

```java
ACLMessage subscribe = new ACLMessage(ACLMessage.SUBSCRIBE);
subscribe.setContent("(status ?x)");  // Notify me of any status changes
subscribe.addReceiver(skillAgent);
myAgent.send(subscribe);

// Later, skill sends INFORM whenever its status changes
// Orchestrator processes INFORMs asynchronously
```

**For WinDAGs**: Use pub/sub (e.g., Redis Pub/Sub, Kafka) for status updates:
- Skills publish `(skill_id, status, timestamp)` to a topic
- Orchestrators subscribe to the topic
- On status change (ready → running → failed), orchestrator updates workflow state
- No polling; push-based updates reduce latency and load

## Lessons for 180+ Skill Orchestration

### 1. Explicit Failure Performatives

Don't use generic error codes. Define specific failure types:
- **Skill not found**: Registry lookup failed
- **Preconditions not met**: Skill can't start due to missing inputs
- **Resource exhausted**: Skill started but ran out of memory/time/quota
- **Logical contradiction**: Skill's output conflicts with existing beliefs

Each failure type enables different recovery:
- Skill not found → retry with fallback skill
- Preconditions not met → wait for upstream skills to complete
- Resource exhausted → allocate more resources or degrade gracefully
- Logical contradiction → abort workflow or invoke conflict resolution

### 2. Message Correlation IDs

Every message must have:
- **Request-ID** (globally unique)
- **Conversation-ID** (workflow instance)
- **In-reply-to** (parent message)

This enables:
- Response routing (which workflow does this reply belong to?)
- Timeout detection (request sent at T, no reply with matching in-reply-to by T+timeout)
- Duplicate detection (same request-id seen twice → deduplicate)

### 3. Timeout at Every Layer

- **Network timeout**: TCP/HTTP connection timeout (3-10 seconds)
- **Message timeout**: Expected reply by deadline (5-60 seconds)
- **Workflow timeout**: End-to-end deadline (minutes to hours)
- **Heartbeat timeout**: Expect periodic health check (5-30 seconds)

Each timeout has a different recovery strategy:
- Network timeout → retry with exponential backoff
- Message timeout → send to fallback skill
- Workflow timeout → escalate to human or abort
- Heartbeat timeout → mark skill as down, route to replica

### 4. Persistent Queues for Critical Paths

Use durable message queues (Kafka, RabbitMQ with persistence) for:
- Task assignments (don't lose work)
- Results (don't lose computed outputs)
- State transitions (don't lose workflow progress)

Avoid persistent queues for:
- Heartbeats (ephemeral, no replay needed)
- Logs (write to separate logging infrastructure)
- Temporary queries (recompute if lost)

### 5. Health Monitoring with Automatic Remediation

- **Passive monitoring**: Skills send periodic heartbeats
- **Active monitoring**: Orchestrator pings skills periodically
- **Remediation**: On failure detected, automatically:
  - Mark skill as down in registry
  - Redirect in-flight tasks to replicas
  - Alert human if no replicas available
  - Re-add skill when heartbeat resumes

### 6. Graceful Degradation Over Fail-Stop

When a skill fails, don't crash the entire workflow. Options:
- **Retry**: Same skill, different input or parameters
- **Fallback**: Different skill with similar capability
- **Partial result**: Return incomplete output with warning
- **Abort subtree**: Fail this branch but continue other branches

JADE's FSM-based behaviors enable this: each state can transition to SUCCESS, RETRY, FALLBACK, or TERMINAL_FAILURE based on domain logic.

### 7. Semantic Error Handling

Use NOT_UNDERSTOOD performative when messages don't match expected ontology:
- Sender gets explicit feedback (not silent failure)
- Sender can retry with corrected data or negotiate a compatible ontology
- Receiver doesn't crash on unexpected input

**For WinDAGs**: Validate skill inputs against declared schemas before execution. If validation fails, return schema mismatch error (not runtime exception).

## The Hard Truth About Distributed Failures

The book's approach reflects a mature understanding: **You cannot prevent distributed failures. You can only design systems that remain coherent when failures occur.**

Key principles:
1. **Explicit failure paths** in protocols (not exceptions)
2. **Asynchronous messaging** with timeouts (not blocking calls)
3. **Stateful recovery** via persistent queues (not replay from logs)
4. **Decentralized coordination** with central discovery (not all-or-nothing)
5. **Observable failure** via events (not silent degradation)

These patterns, proven in mission-critical systems (air traffic control, industrial automation), are directly applicable to DAG-based orchestration of 180+ skills. Failure resilience isn't an add-on—it's a structural property that must be designed in from the start.
```

---

### FILE: hierarchical-task-decomposition-patterns.md

```markdown
# Hierarchical Task Decomposition: Composable Abstractions for Complex Workflows

## The Decomposition Problem

A complex task (e.g., "Buy the best book on JADE at the lowest price") can't be solved by a single atomic action. It requires:
1. **Discovery**: Find all agents selling books
2. **Negotiation**: Request proposals from sellers
3. **Evaluation**: Compare proposals by price, delivery time, etc.
4. **Commitment**: Accept the best proposal
5. **Confirmation**: Receive and verify delivery

JADE's solution: **Behaviors as composable state machines.** Each behavior is a unit of work that can be:
- **Atomic** (one-shot: execute once and finish)
- **Cyclic** (loop forever: listen for messages, handle, repeat)
- **Sequential** (chain: do A, then B, then C)
- **Parallel** (fork-join: do A and B concurrently, wait for both)
- **Conditional** (FSM: do A, then B or C based on condition)

These compose into **arbitrarily deep hierarchies**: a SequentialBehaviour can contain ParallelBehaviours, each of which contains OneShotBehaviours, etc.

## Behavior as the Fundamental Unit of Work

### The Behavior Interface

```java
public abstract class Behaviour {
    public abstract void action();     // What to do
    public abstract boolean done();    // Are we finished?
    
    protected void block();            // Yield control (wait for event)
    protected void block(long timeout);
}
```

**Key insight from the book**:

> "The scheduling of behaviours in an agent is not pre-emptive (as for Java threads), but cooperative. This means that when a behaviour is scheduled for execution its action() method is called and runs until it returns."

Behaviors are **not threads**. They're lightweight units of work scheduled by the agent. Benefits:
1. **Single Java thread per agent** → scales to thousands of agents on one JVM
2. **No locks needed** → behaviors see consistent snapshots of agent state
3. **Fast switching** → behavior switching is method call overhead, not thread context switch

**Constraint**: A behavior must **return control** (either by finishing or calling `block()`). If it loops forever without yielding, the agent hangs.

### Three Primitive Behavior Types

#### 1. OneShotBehaviour
Executes once and finishes:

```java
public class SendMessageBehaviour extends OneShotBehaviour {
    public void action() {
        ACLMessage msg = new ACLMessage(ACLMessage.INFORM);
        msg.setContent("Hello");
        myAgent.send(msg);
    }
}
```

**Use cases**:
- Send a message
- Perform a computation
- Initialize state

#### 2. CyclicBehaviour
Loops forever:

```java
public class MessageListenerBehaviour extends CyclicBehaviour {
    public void action() {
        ACLMessage msg = myAgent.receive();
        if (msg != null) {
            // Process message
        } else {
            block();  // Wait for next message
        }
    }
}
```

**Critical pattern**: Call `block()` when no work available. The agent scheduler removes the behavior from the run queue. When a message arrives, the scheduler reactivates it.

**Use cases**:
- Listen for messages
- Monitor events
- Maintain a service

#### 3. Behaviour with State (Generic FSM)
Uses a `step` variable to track state:

```java
public class NegotiationBehaviour extends Behaviour {
    private int step = 0;

    public void action() {
        switch (step) {
            case 0:
                sendCFP();
                step = 1;
                break;
            case 1:
                collectProposals();
                if (allProposalsReceived()) step = 2;
                break;
            case 2:
                selectBestProposal();
                step = 3;
                break;
            case 3:
                sendAcceptance();
                step = 4;
                break;
        }
    }

    public boolean done() {
        return step == 4;
    }
}
```

**Why this pattern is powerful**: It's a **lightweight coroutine**. The behavior resumes from where it left off (state `step`) each time `action()` is called. No need for threads or continuations.

**Use cases**:
- Multi-step protocols (Contract Net, negotiation)
- Workflows with decision points
- Retry logic with backoff

## Composite Behaviors: Building Hierarchies

### SequentialBehaviour: Chain Tasks

Execute behaviors in order, one at a time:

```java
SequentialBehaviour seq = new SequentialBehaviour();
seq.addSubBehaviour(new RegisterWithDF());
seq.addSubBehaviour(new FindSellers());
seq.addSubBehaviour(new Negotiate());
seq.addSubBehaviour(new DeregisterFromDF());
myAgent.addBehaviour(seq);
```

**Execution model**:
1. Execute first sub-behavior until `done() == true`
2. Execute second sub-behavior until `done() == true`
3. ... continue until all sub-behaviors complete
4. SequentialBehaviour itself becomes `done()`

**Critical feature**: If a sub-behavior calls `block()`, the entire SequentialBehaviour blocks. Control returns to the agent scheduler, which can run other behaviors.

**For WinDAGs**: This is the **DAG linearization pattern**. If you have a dependency chain (Skill A → Skill B → Skill C), represent it as:

```python
seq = SequentialBehaviour()
seq.add(InvokeSkillA())
seq.add(InvokeSkillB())  # Waits for A to finish
seq.add(InvokeSkillC())  # Waits for B to finish
```

### ParallelBehaviour: Fork-Join

Execute behaviors concurrently (cooperatively, not preemptively):

```java
ParallelBehaviour par = new ParallelBehaviour(ParallelBehaviour.WHEN_ALL);
par.addSubBehaviour(new QuerySellerA());
par.addSubBehaviour(new QuerySellerB());
par.addSubBehaviour(new QuerySellerC());
myAgent.addBehaviour(par);
```

**Execution model**:
1. On each scheduler tick, execute one step of each sub-behavior (round-robin)
2. If a sub-behavior calls `block()`, skip it this tick
3. When all sub-behaviors are `done()`, ParallelBehaviour is done

**Termination conditions** (configurable):
- `WHEN_ALL`: Wait for all sub-behaviors to finish
- `WHEN_ANY`: Finish as soon as one sub-behavior finishes (race)

**For WinDAGs**: This is the **parallel skill execution pattern**. If Skill A, B, and C can run concurrently (no dependencies between them):

```python
par = ParallelBehaviour(WHEN_ALL)
par.add(InvokeSkillA())
par.add(InvokeSkillB())
par.add(InvokeSkillC())
# Wait for all three to complete before proceeding
```

**Example from book-trading**: A buyer sends CFPs to multiple sellers concurrently (ParallelBehaviour), waits for all responses (WHEN_ALL), then evaluates proposals (next behavior in SequentialBehaviour).

### FSMBehaviour: Conditional Branching

Execute behaviors based on state transitions:

```java
FSMBehaviour fsm = new FSMBehaviour();
fsm.registerFirstState(new SendCFP(), "SendCFP");
fsm.registerState(new EvaluateProposals(), "Evaluate");
fsm.registerState(new SendAcceptance(), "Accept");
fsm.registerLastState(new Confirm(), "Confirm");

fsm.registerTransition("SendCFP", "Evaluate", 0);  // Always transition
fsm.registerTransition("Evaluate", "Accept", 1);   // If acceptable proposal found
fsm.registerTransition("Evaluate", "Confirm", 2);  // If no acceptable proposal
fsm.registerTransition("Accept", "Confirm", 0);
```

**Execution model**:
1. Execute current state's behavior
2. When behavior finishes, call `onEnd()` to get exit code
3. Look up transition for (current_state, exit_code)
4. Transition to next state
5. Repeat until reaching a last state

**For WinDAGs**: This is the **decision-point pattern**. If Skill A succeeds, invoke Skill B; if Skill A fails, invoke Skill C (fallback):

```python
fsm = FSMBehaviour()
fsm.register_state("InvokeA", InvokeSkillA())
fsm.register_state("InvokeB", InvokeSkillB())
fsm.register_state("InvokeC", InvokeSkillC())  # Fallback

fsm.register_transition("InvokeA", "InvokeB", exit_code=SUCCESS)
fsm.register_transition("InvokeA", "InvokeC", exit_code=FAILURE)
```

## DataStore: Sharing State Across Behaviors

Behaviors in a composite need to share intermediate results. Example: `FindSellers` produces a list of seller AIDs that `Negotiate` needs.

**DataStore pattern**:

```java
DataStore ds = new DataStore();
SequentialBehaviour seq = new SequentialBehaviour();
seq.setDataStore(ds);

class FindSellers extends OneShotBehaviour {
    public void action() {
        DFAgentDescription[] sellers = DFService.search(...);
        getDataStore().put("sellers", sellers);  // Write to shared store
    }
}

class Negotiate extends Behaviour {
    public void action() {
        DFAgentDescription[] sellers = 
            (DFAgentDescription[]) getDataStore().get("sellers");  // Read from shared store
        // Use sellers...
    }
}

seq.addSubBehaviour(new FindSellers());
seq.addSubBehaviour(new Negotiate());
```

**Key insight**: The DataStore is **scoped to the composite behavior**. Sub-behaviors of the same parent share the store; unrelated behaviors don't see it. This is **lexical scoping for agent state**.

**For WinDAGs**: Implement a **workflow context** (similar to DataStore):

```python
class WorkflowContext:
    def __init__(self):
        self.data = {}

    def put(self, key, value):
        self.data[key] = value

    def get(self, key):
        return self.data.get(key)

seq = SequentialBehaviour(context=WorkflowContext())
seq.add(InvokeSkillA())  # Writes "result_a" to context
seq.add(InvokeSkillB())  # Reads "result_a" from context
```

## Example: Book-Trading Negotiation Decomposition

The book-trading system demonstrates hierarchical decomposition. The buyer agent's top-level behavior:

```
SequentialBehaviour (main workflow)
  ├─ OneShotBehaviour: Register with DF
  ├─ TickerBehaviour: Launch negotiations periodically
  │   └─ PurchaseManager (FSM)
  │       ├─ State 0: Send CFP to all sellers
  │       ├─ State 1: Collect PROPOSE replies (block until all received or timeout)
  │       ├─ State 2: Evaluate proposals, send ACCEPT to best
  │       ├─ State 3: Wait for INFORM (confirmation)
  │       └─ State 4: Terminal state (success or failure)
  └─ OneShotBehaviour: Deregister from DF on shutdown
```

**Key decomposition decisions**:

1. **Top-level is sequential**: Registration → negotiation loop → deregistration (lifecycle)
2. **Negotiation loop is cyclic**: Keep trying to buy books until stopped
3. **Each negotiation is an FSM**: Multi-step protocol with explicit state transitions
4. **CFP broadcast is implicit parallel**: Message sent to multiple sellers, wait for all replies

### Detailed FSM: PurchaseManager

```java
private class BookNegotiator extends Behaviour {
    private int step = 0;
    private MessageTemplate mt;
    private int repliesCnt = 0;
    private ACLMessage bestReply = null;

    public void action() {
        switch (step) {
            case 0:  // Send CFP
                ACLMessage cfp = new ACLMessage(ACLMessage.CFP);
                for (int i = 0; i < sellerAgents.length; ++i) {
                    cfp.addReceiver(sellerAgents[i]);
                }
                cfp.setContent(title);
                cfp.setConversationId("book-trade");
                cfp.setReplyWith("cfp" + System.currentTimeMillis());
                myAgent.send(cfp);

                mt = MessageTemplate.and(
                    MessageTemplate.MatchConversationId("book-trade"),
                    MessageTemplate.MatchInReplyTo(cfp.getReplyWith()));
                step = 1;
                break;

            case 1:  // Collect replies
                ACLMessage reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.PROPOSE) {
                        int price = Integer.parseInt(reply.getContent());
                        if (bestReply == null || price < bestPrice) {
                            bestPrice = price;
                            bestReply = reply;
                        }
                    }
                    repliesCnt++;
                    if (repliesCnt >= sellerAgents.length) {
                        step = 2;  // All replies received
                    }
                } else {
                    block();  // Wait for more replies
                }
                break;

            case 2:  // Send acceptance
                if (bestReply != null && bestPrice <= maxPrice) {
                    ACLMessage order = new ACLMessage(ACLMessage.ACCEPT_PROPOSAL);
                    order.addReceiver(bestReply.getSender());
                    order.setContent(title);
                    order.setConversationId("book-trade");
                    order.setReplyWith("order" + System.currentTimeMillis());
                    myAgent.send(order);

                    mt = MessageTemplate.and(
                        MessageTemplate.MatchConversationId("book-trade"),
                        MessageTemplate.MatchInReplyTo(order.getReplyWith()));
                    step = 3;
                } else {
                    step = 4;  // No acceptable offer
                }
                break;

            case 3:  // Wait for confirmation
                reply = myAgent.receive(mt);
                if (reply != null) {
                    if (reply.getPerformative() == ACLMessage.INFORM) {
                        myGui.notifyUser("Book successfully purchased.");
                    }
                    step = 4;
                } else {
                    block();
                }
                break;
        }
    }

    public boolean done() {
        return step == 4;
    }
}
```

**Decomposition lessons**:

1. **State variable tracks progress**: `step` explicitly encodes where we are in the protocol
2. **Blocking is explicit**: Call `block()` when waiting for messages (not busy-wait)
3. **Message templates prevent cross-talk**: Each state creates a template that matches only relevant replies
4. **Early exit on failure**: If no acceptable offer (state 2), jump directly to terminal state (state 4)
5. **Single responsibility per state**: State 0 sends, state 1 collects, state 2 evaluates, state 3 confirms

### Why This Scales

Contrast with a monolithic approach (no decomposition):

```java
// Monolithic (anti-pattern)
void buyBook() {
    ACLMessage cfp = ...; send(cfp);
    List<ACLMessage> replies = new ArrayList<>();
    while (replies.size() < sellers.length) {
        ACLMessage reply = blockingReceive();
        replies.add(reply);
    }
    ACLMessage best = evaluateBest(replies);
    if (best != null) {
        send(accept);
        ACLMessage confirm = blockingReceive();
        if (confirm.getPerformative() == INFORM) {
            success();
        }
    }
}
```

**Problems**:
1. **Blocks the entire agent**: No other behaviors can run while waiting for replies
2. **No timeout handling**: If a seller never replies, hangs forever
3. **No cancellation**: Can't abort mid-negotiation
4. **Not composable**: Can't nest this inside a larger workflow

The FSM-based approach fixes all of these:
- Cooperative scheduling → other behaviors run while waiting
- Explicit timeout → jump to terminal state if deadline exceeded
- Cancellable → agent can call `removeBehaviour(negotiator)` to abort
- Composable → `BookNegotiator` can be a sub-behavior of a larger workflow

## Advanced Pattern: Behavior Nesting and Reuse

Behaviors compose recursively. Example: A top-level workflow contains multiple negotiations, each of which contains multiple queries:

```
SequentialBehaviour (main)
  ├─ ParallelBehaviour (negotiate for multiple books concurrently)
  │   ├─ BookNegotiator("JADE book")
  │   │   └─ FSM (send CFP → collect → evaluate → accept → confirm)
  │   └─ BookNegotiator("Design Patterns book")
  │       └─ FSM (send CFP → collect → evaluate → accept → confirm)
  └─ OneShotBehaviour (report results to user)
```

**Key insight**: Each `BookNegotiator` is independent. They run concurrently (ParallelBehaviour), but each is internally an FSM with blocking waits. The agent scheduler interleaves their execution.

**For WinDAGs**: Nested workflows enable **reusable sub-workflows**:

```python
class InvokeSkillWithRetry(SequentialBehaviour):
    def __init__(self, skill_name, max_retries=3):
        self.add(TrySkill(skill_name))
        self.add(CheckResult())
        self.add(RetryIfFailed(max_retries))

# Use as a building block
workflow = SequentialBehaviour()
workflow.add(InvokeSkillWithRetry("ExtractText"))
workflow.add(InvokeSkillWithRetry("AnalyzeSentiment"))
workflow.add(InvokeSkillWithRetry("GenerateReport"))
```

Each skill invocation is wrapped in a retry sub-workflow. If `ExtractText` fails, the retry logic runs (exponential backoff, fallback to alternative skill, etc.) without polluting the top-level workflow.

## Lessons for 180+ Skill Orchestration

### 1. Represent Workflows as Behavior Hierarchies

Don't hard-code workflows in imperative logic. Use composable behaviors:
- **Sequential dependencies**: SequentialBehaviour
- **Parallel execution**: ParallelBehaviour
- **Conditional branching**: FSMBehaviour
- **Retry logic**: SequentialBehaviour with loop detection
- **Timeouts**: TickerBehaviour with deadline checks

### 2. Use FSMs for Multi-Step Protocols

Any interaction that requires:
- Multiple message exchanges
- Waiting for responses
- Decision points based on responses
- Failure recovery

Should be an FSM. Explicit states make the protocol **readable** and **debuggable**.

### 3. Isolate State with DataStore

Don't share state via global variables or agent fields. Use DataStore (or equivalent workflow context) so that:
- State is scoped to the workflow (not leaked across workflows)
- Sub-behaviors can pass data cleanly (put/get, not side effects)
- Composite behaviors are **testable in isolation** (inject a mock DataStore)

### 4. Block Explicitly, Don't Spin-Wait

When waiting for a message or external event, call `block()` (or equivalent). Don't:

```python
# Anti-pattern: busy-wait
while True:
    msg = receive(timeout=0.1)
    if msg is not None:
        process(msg)
        break
```

Instead:

```python
# Correct: block and yield
msg = receive_blocking(template=mt)
if msg is not None:
    process(msg)
```

This allows the scheduler to run other behaviors, reducing CPU waste and latency.

### 5. Compose Behaviors for Reuse

Common sub-workflows (authentication, retry logic, error reporting) should be **reusable behaviors**:

```python
class RetryWithBackoff(SequentialBehaviour):
    def __init__(self, action, max_retries=3, backoff=2.0):
        for attempt in range(max_retries):
            self.add(TryAction(action))
            self.add(CheckSuccess())
            if attempt < max_retries - 1:
                self.add(WaitWithBackoff(backoff ** attempt))

# Use in multiple workflows
workflow1 = SequentialBehaviour()
workflow1.add(RetryWithBackoff(InvokeSkillA()))

workflow2 = SequentialBehaviour()
workflow2.add(RetryWithBackoff(InvokeSkillB()))
```

### 6. Test Behaviors in Isolation

Because behaviors are composable, they can be tested independently:

```python
# Unit test for NegotiationBehaviour
def test_negotiation_behavior():
    behavior = NegotiationBehaviour()
    
    # Inject mock agent
    behavior.set_agent(MockAgent())
    
    # Step 0: Should send CFP
    behavior.action()
    assert behavior.step == 1
    
    # Step 1: Inject mock replies
    mock_agent.inject_message(PROPOSE(price=50))
    behavior.action()
    assert behavior.best_price == 50
    
    # ... continue testing each state
```

### 7. Design for Observability

Each state transition should be logged:

```python
class FSMBehaviour:
    def transition(self, from_state, to_state):
        logger.info(f"FSM transition: {from_state} -> {to_state}")
        self.state = to_state
```

When debugging a workflow failure, the log shows:
```
FSM transition: SendCFP -> CollectReplies
FSM transition: CollectReplies -> Evaluate
FSM transition: Evaluate -> FAILED (no acceptable offer)
```

This is **trace-level debugging without a debugger**.

## The Fundamental Insight

JADE's behavior model demonstrates: **Complex workflows are best expressed as hierarchies of simple state machines, not as monolithic control flow.**

Each behavior is:
- **Self-contained**: Has clear inputs (DataStore), outputs (DataStore), and termination condition
- **Composable**: Can be nested inside other behaviors
- **Testable**: Can be executed in isolation
- **Observable**: State transitions are explicit

This approach scales to arbitrarily complex workflows because:
- **Local reasoning**: Understand each behavior independently
- **Compositional semantics**: Behavior of composite = semantics of composition operator + semantics of sub-behaviors
- **Graceful failure**: Each behavior can fail independently without crashing the entire workflow

For WinDAGs managing 180+ skills, this means: Don't write a 10,000-line orchestrator function. Compose small, reusable behaviors (InvokeSkill, Retry, Timeout, Fallback) into hierarchies that match your task structure. The resulting system is understandable, maintainable, and extensible.
```

---

### FILE: split-container-architecture-for-heterogeneous-environments.md

```markdown
# Split-Container Architecture: Orchestrating Agents Across Unreliable and Resource-Constrained Environments

## The Heterogeneity Problem

Production multi-agent systems don't run on homogeneous clusters. They span:
- **Resource-rich servers** (multi-core, GB RAM, persistent storage)
- **Resource-constrained devices** (mobile phones, IoT sensors, edge devices)
- **Unreliable networks** (cellular with intermittent coverage, firewalls, NAT traversal)

Running full JADE containers on every device is impractical:
- A JADE main container requires ~10-50MB RAM
- Mobile devices have limited battery (maintaining network connections drains power)
- Firewalls block incoming connections (agents can't receive messages directly)

JADE's solution: **Split-container architecture** (JADE-LEAP: Lightweight Extensible Agent Platform). An agent is split into:
1. **Front-end**: Runs on constrained device, handles I/O, minimal state
2. **Back-end**: Runs on server, handles coordination, full agent logic
3. **Mediator**: Centralized discovery and reconnection service

## Architecture Overview

### Components

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Mobile    │         │   Mediator  │         │   Server    │
│   Device    │◄───────►│   (Gateway) │◄───────►│   Cluster   │
│  (Front-end)│         │             │         │  (Back-end) │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │ JICP connection       │                       │
      │ (can disconnect)      │                       │
      └───────────────────────┘                       │
                                                      │
                                                  Full JADE
                                                  container
```

**Key insight from the book**:

> "The mediator must be up and running on a host with a known, fixed and visible address before front-ends can be initiated on any mobile device."

The mediator is the **rendezvous point**. All discovery flows through it, but data flows directly between front-end and back-end once connected.

### Startup Sequence (Figure 8.5)

```
1. Front-end → Mediator: CREATE_MEDIATOR request via JICP
   - Includes device info (MSISDN if mobile, container name if known)

2. Mediator creates back-end instance on server
   - Instantiates agent class
   - Assigns container name (e.g., MSISDN-container if mobile)

3. Mediator passes connection to back-end
   - Back-end now has open socket to front-end

4. Back-end registers with main container
   - DF service available
   - Yellow pages updated

5. Mediator → Front-end: Response with:
   - Assigned container name
   - Platform name
   - Platform addresses (for direct communication if network allows)
```

**Critical design decision**: The mediator is **not in the data path** after connection. It only handles:
- Initial connection (CREATE_MEDIATOR)
- Reconnection after disconnect (CONNECT_MEDIATOR)
- Lookup table maintenance (container-name → back-end mapping)

### Reconnection After Disconnect (Figure 8.6)

Mobile devices frequently lose connectivity (out of coverage, airplane mode, battery death). The front-end reconnects:

```
1. Front-end detects disconnection
   - TCP connection closed or timeout on heartbeat

2. Front-end → Mediator: CONNECT_MEDIATOR + container-name
   - "I'm the agent that was using container-name X"

3. Mediator looks up back-end by container-name
   - Maintained in persistent table

4. Mediator passes new connection to existing back-end
   - Back-end resumes with same state

5. Back-end → Front-end: OK response
   - Front-end flushes buffered messages (sent while disconnected)
```

**Key feature**: The back-end **survives disconnection**. While the front-end is offline:
- Back-end continues to exist on server
- Messages destined for the agent are queued at back-end
- When front-end reconnects, queued messages are delivered

**For WinDAGs**: If a skill executor is running on an unreliable device (Lambda function, edge device), use split execution:
- **Front-end**: Stateless executor (receives tasks, returns results)
- **Back-end**: Stateful coordinator (tracks task history, handles retries)
- **Mediator**: Task registry (front-ends discover which back-end to connect to)

## Firewall Transparency

The book emphasizes a critical deployment advantage:

> "The only element accepting connections (i.e. embedding a server socket) is the mediator. Therefore, if the mediator, the main container, and other normal containers, if any, are running behind a firewall, the only requirement is to open the port used by the mediator to listen for incoming connections."

**Traditional distributed system** (peer-to-peer):
- Each agent must accept incoming connections
- N agents → N ports to open in firewall
- Firewall admin nightmare

**Split-container architecture**:
- Only mediator accepts connections (1 port)
- All devices connect outbound to mediator (no firewall rules needed for devices)
- Back-ends are behind firewall, never accept external connections

**Network topology**:

```
Internet                    Firewall               Internal Network
                                 ║
Mobile Device ────────────► Mediator ◄────────────► Back-end Container
                            (Port 1099)             (No inbound port)
```

**For WinDAGs**: If deploying across environments (cloud + on-prem, public + private):
- Deploy mediator in DMZ (one public IP, one port)
- Deploy skill executors behind firewall
- Executors connect outbound to mediator
- No VPN or complex routing needed

## BIFEDispatcher: Handling Device Constraints

The book reveals a non-obvious implementation detail:

> "The BIFEDispatcher keeps two sockets open (one for commands to back-end, one for responses from back-end) to work around device limitations (specifically Symbian phones that can't read/write on the same socket simultaneously)."

**Hardware constraint propagates to architecture**: Early Symbian phones had a broken TCP stack. The BIFEDispatcher (Back-end In Front-end Dispatcher) compensates:
- Socket A: Front-end → Back-end (commands)
- Socket B: Back-end → Front-end (responses)

**Alternative dispatcher** (for better devices):
- `FrontEndDispatcher`: Single socket (full-duplex)
- `HTTPFEDispatcher`: HTTP tunneling (for proxies that block non-HTTP)

**Lesson**: Don't assume uniform platform capabilities. Provide **pluggable transport adapters** that abstract device constraints.

**For WinDAGs**: If skills run on heterogeneous hardware (ARM, x86, GPU, TPU):
- Define abstract transport interface (send/receive)
- Implement device-specific transports (gRPC, HTTP/2, custom binary protocol)
- Let skills declare required transport ("I need full-duplex bidirectional streaming")
- Orchestrator selects compatible transport at runtime

## ConnectionListener: Observable Failure Events

The split-container architecture exposes **connection state transitions** to application logic:

```java
MicroRuntime.setConnectionListener(new ConnectionListener() {
    public void handleConnectionEvent(int code, Object info) {
        switch (code) {
            case BEFORE_CONNECTION:
                // About to connect: set up PDP context (mobile), pre-allocate resources
                break;

            case DISCONNECTED:
                // Lost connection: cache messages locally, notify user
                queueMessagesLocally();
                showUserAlert("Connection lost, working offline");
                break;

            case RECONNECTED:
                // Restored connection: flush cached messages
                flushLocalQueue();
                showUserAlert("Connection restored");
                break;

            case RECONNECTION_FAILURE:
                // Reconnection failed after retries: escalate
                log.error("Cannot reconnect to server");
                promptUserForManualRetry();
                break;

            case BE_NOT_FOUND:
                // Back-end was killed during disconnect: unrecoverable
                log.error("Server lost our state, must restart");
                resetAgent();
                break;

            case NOT_AUTHORIZED:
                // Authentication failed: don't retry indefinitely
                log.error("Authentication rejected");
                promptUserForCredentials();
                break;

            case CONNECTION_DROPPED:
                // Unexpected disconnect: likely network issue
                log.warning("Connection dropped unexpectedly");
                initiateReconnection();
                break;
        }
    }
});
```

**Why this matters**: The system doesn't pretend disconnections don't happen. Instead:
- Applications **observe** connection events
- Applications **decide** recovery strategy (retry, degrade, abort)
- Users are **informed** (not left in the dark when operations fail)

**For WinDAGs**: Expose similar events for skill execution:

```python
orchestrator.on_event(SKILL_UNAVAILABLE, lambda event:
    log.warning(f"Skill {event.skill_id} unreachable, trying fallback"))

orchestrator.on_event(EXECUTION_STALLED, lambda event:
    log.error(f"Skill {event.skill_id} not responding, timeout in {event.remaining}s"))

orchestrator.on_event(RESULT_UNDELIVERABLE, lambda event:
    log.warning(f"Skill {event.skill_id} completed but orchestrator unreachable"))
```

## Message Buffering During Disconnection

**Critical feature**: While disconnected, the front-end **buffers outgoing messages locally**:

```java
// Front-end code (pseudo)
public void send(ACLMessage msg) {
    if (connected) {
        dispatchToBackend(msg);
    } else {
        localBuffer.add(msg);  // Queue for later
    }
}

public void onReconnected() {
    for (ACLMessage msg : localBuffer) {
        dispatchToBackend(msg);
    }
    localBuffer.clear();
}
```

**Problem**: Local buffer can grow unbounded if disconnection is prolonged. The book doesn't specify overflow policy, but production systems need:
- **Maximum buffer size** (e.g., 1000 messages)
- **Overflow strategy**:
  - Drop oldest messages (FIFO eviction)
  - Drop low-priority messages first
  - Persist to disk if RAM exhausted
  - Alert user if critical messages can't be sent

**For WinDAGs**: Implement **persistent task queues** for orchestrator-to-skill communication:
- Use Kafka, RabbitMQ, or SQS with durable queues
- If skill is unavailable, messages wait in queue
- When skill comes online, process backlog
- Set **retention policy** (e.g., delete after 7 days if unprocessed)

## Minimization: Deployment-Time Code Reduction

JADE for mobile (MIDP/CLDC) requires aggressive code size reduction. The book describes a **minimization utility**:

```bash
java -cp ... jade.Boot minimizer -input jade.jar -output jade-min.jar -dlc app.dlc
```

The `.dlc` (Dynamically Loaded Classes) file specifies entry points:

```
# app.dlc
bookTrading.buyer.BookBuyerAgent
bookTrading.seller.BookSellerAgent
```

The minimizer:
1. Starts from entry points (agent classes)
2. Traces all reachable code (bytecode analysis)
3. Removes unreachable classes, methods, fields
4. Compresses bytecode (remove debug info, inline constants)

**Result**: 600KB JADE JAR → 150KB minimized JAR for MIDP.

**For WinDAGs**: If deploying to constrained environments (edge devices, serverless with size limits):
- Use **dead code elimination** (tree-shaking in JavaScript, ProGuard for Java, PyInstaller for Python)
- **Lazy loading**: Don't bundle all 180 skills in every deployment; load dynamically
- **Modular packaging**: Each skill is a separate artifact (Docker layer, Lambda function)

## MSISDN-Based Naming: Infrastructure as Identity

For mobile agents, the book suggests using **MSISDN** (phone number) as the agent's name:

```java
Properties pp = new Properties();
pp.setProperty(MicroRuntime.AGENTS_KEY, "%C-book-buyer:bookTrading.buyer.BookBuyerAgent");
```

The `%C` wildcard is replaced at runtime:
- If MSISDN detected (from SIM card): `+1-555-123