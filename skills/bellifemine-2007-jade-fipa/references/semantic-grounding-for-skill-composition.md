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