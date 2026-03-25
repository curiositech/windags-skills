## BOOK IDENTITY
**Title**: Domain-Driven Design: Tackling Complexity in the Heart of Software
**Author**: Eric Evans (2003)
**Core Question**: How do you build software that remains comprehensible, maintainable, and aligned with business reality as it grows more complex?
**Irreplaceable Contribution**: Evans is the first to systematically articulate that the real problem in software development is not technical — it is the gap between how humans understand a domain and how machines execute it. He provides a complete vocabulary, a set of design patterns, and a strategic framework for closing that gap. No other book treats the *model* as both the primary artifact of software development and the binding contract between business understanding and working code. His treatment of Bounded Contexts, Ubiquitous Language, and the distinction between Entity and Value Object remain foundational concepts that have shaped an entire generation of software architecture.

---

## KEY IDEAS

1. **The model is not the diagram — the model is the shared understanding, and the code is its most faithful expression.** Evans argues that UML diagrams, design documents, and specifications are all secondary artifacts that decay and mislead. The model lives in conversations, in code names, in the concepts developers and domain experts use when they think and speak together. When the code and the mental model diverge, the system begins to rot.

2. **Ubiquitous Language is not a communication technique — it is an architectural constraint.** The shared language between domain experts and developers must appear *identically* in code, conversations, and documentation. The moment developers maintain a separate vocabulary from domain experts, knowledge crunching stops translating into working software. Evans writes: "The division should never be between the domain experts and the developers."

3. **Strategic design is about choosing where to invest modeling depth.** Not all parts of a system deserve the same design rigor. The Core Domain — the place where your software creates genuine competitive advantage — deserves top talent and deep modeling. Generic subdomains (time zones, accounting arithmetic) should be solved with purchased solutions, published patterns, or delegated to less senior developers. Misallocating modeling effort is a strategic failure that compounds over time.

4. **Supple design is not simplicity — it is the property of software that can be understood and changed without fear.** Evans distinguishes between software that merely works and software that *invites* change. Supple design requires sophisticated technique: intention-revealing interfaces, side-effect-free functions, closed operations, and explicit assertions. It is harder to create than rigid design, and it pays off as the system grows.

5. **Bounded Contexts are the unit of model integrity, and context maps are the unit of strategic coordination.** Large systems inevitably contain multiple models. The mistake is not having multiple models — it is failing to make their boundaries explicit. When two teams share a term with different meanings, the contradiction is invisible until integration, at which point it causes cascading failures. Explicit context boundaries and translation strategies prevent silent model corruption.

---

## REFERENCE DOCUMENTS

### FILE: ubiquitous-language-and-model-driven-design.md
```markdown
# Ubiquitous Language and Model-Driven Design: The Binding Contract Between Understanding and Code

## The Problem This Solves

Most software projects fail not because the engineers are incompetent, but because there are two separate models operating simultaneously in the same project: the model domain experts use to understand their business, and the model developers use to implement the software. These two models drift apart constantly. Domain experts explain a concept in one language; developers implement it in another. Knowledge crunched in analysis meetings evaporates in the handoff to implementation. The resulting software does *something*, but it no longer reflects how anyone actually understands the domain.

Evans' central insight is that this drift is not inevitable — it is the consequence of a choice, and a different choice is available.

## The Ubiquitous Language

The Ubiquitous Language is the practice of establishing a single shared vocabulary that appears identically in:
- Developer-to-developer conversations about code
- Domain expert explanations of business concepts
- The code itself: class names, method names, module names
- Design documents and diagrams (when they exist at all)

Evans is explicit about what this is *not*: "The division should never be between the domain experts and the developers." Extensions and specialized jargon are permissible — developers need technical terms, domain experts use industry-specific vocabulary — but these must be *additions* to the shared language, not replacements for it.

"With a UBIQUITOUS LANGUAGE, conversations among developers, among domain experts, and expressions in the code itself are all based on the same language, derived from a shared domain model."

The practical consequence is striking. If you have a domain expert who talks about "routing specifications" and "itineraries," and your codebase has classes called `RouteParam` and `TripPlan`, you have two models. Every conversation requires mental translation. Every change to business requirements requires interpretation before it can become code. Knowledge is destroyed at each boundary crossing.

When the language is unified, requirements discussions produce code-ready concepts. A domain expert saying "the itinerary must satisfy the route specification" maps directly to `itinerary.isSatisfiedBy(routeSpecification)`. The code becomes readable to domain experts. The conversations become directly actionable.

## Model-Driven Design as the Binding Mechanism

The Ubiquitous Language requires a mechanism to prevent drift. That mechanism is Model-Driven Design: the commitment that the implementation model and the analysis model are *the same model*, expressed in different media.

Evans identifies the root of most software deterioration: "Many projects separate analysis (what to build) from design (how to build it), resulting in two disconnected models." Knowledge crunching happens in analysis. Developers then reconceptualize the domain independently when implementing. The analysts' insights are not preserved in code. The developers' technical realities do not reach the analysts.

The alternative: "MODEL-DRIVEN DESIGN discards the dichotomy of analysis model versus design to search out a single model that serves both purposes."

This is not a counsel of perfection. The constraint is pragmatic: "Demand a single model that serves both purposes well. Have one model and tie the implementation slavishly to it." When the model doesn't work for implementation, *change the model*. When the design doesn't express the key concepts, *change the design*. The model and the implementation co-evolve in a single iterative loop.

## The Model Is Not the Diagram

Evans spends significant energy correcting a widespread mistake: the belief that the model lives in UML diagrams or design documents.

"Always remember that the model is not the diagram. The diagram's purpose is to help communicate and explain the model. The code can serve as a repository of the details of the design."

UML diagrams cannot convey meaning — what a concept represents. They cannot convey behavior — what objects actually do. Comprehensive diagrams become cognitively overwhelming and actively fail to communicate. A 50-class diagram with arrows everywhere communicates nothing useful.

More importantly, diagrams decay. Code is executed and therefore constantly tested against reality. Documents are not. An outdated document actively confuses the project — it makes people believe things are true that are not. Evans argues that written documents often become liabilities: if the concepts in the document don't appear in actual conversations and code, the document is already dead.

The solution is not "no documentation" but rather: documentation must be woven into project activity. Test its relevance by listening to the Ubiquitous Language. If terms from a design document never appear in conversations or code, they have been rejected by the project.

## Explanatory Models Are Permitted

Evans makes a nuanced concession: you can have multiple models, as long as one model drives the implementation. Explanatory models — diagrams, stories, metaphors used only for learning — can show the domain from angles that differ from the implementation model. They help new developers understand context and help domain experts visualize what is being built.

But they must be clearly labeled as explanatory. The moment an explanatory model is confused with the implementation model, you have two models in production.

The cargo shipping example illustrates this well. The implementation model (a class diagram of Route, Leg, PortOperation, TransportLeg) is accurate but opaque to newcomers. An explanatory model — a timeline showing "loading by vendor XYZ → on ground in port LGB03 → on-board vessel voyage A → on-board train voyage B → unloading by vendor ABC" — makes the meaning clear. Each segment represents either a port operation, cargo in storage, or cargo in transit. The timeline shows what the abstract objects mean in the real world.

Together, the implementation model (structure) and the explanatory model (meaning) are easier to understand than either alone.

## Hands-On Modelers Are Non-Negotiable

The most disruptive claim Evans makes is about who must do the modeling work.

He recounts a failure: a skilled architect was separated from implementation to focus on modeling. The result was catastrophic. Details of the model were lost in the handoff to developers. Feedback about implementation difficulties never reached the modeler. The model became "reduced to a data structure" and was abandoned by developers who replaced it with their own improvised approach.

"When a modeler is separated from the implementation process, he or she never acquires, or quickly loses, a feel for the constraints of implementation."

And the complementary failure: "If developers don't realize that changing code changes the model, then their refactoring will weaken the model rather than strengthen it."

This is a direct challenge to traditional software engineering, where architects and implementers are distinct roles. Evans argues that in domains of any genuine complexity, modeling can only happen *through* implementation. The model must be built by people who can test it against code.

The corollary: every developer on a domain-driven project must understand that they are modelers, not just implementers. When they rename a class, they are changing the model. When they extract a method and give it a name, they are making a modeling decision. This requires a different kind of discipline — not following specifications, but thinking about whether the code truthfully expresses the domain.

## The PCB Layout Example: From Procedural Hacking to Model-Driven Design

Evans offers a vivid before-and-after comparison. A printed circuit board layout tool needs to apply rules to thousands of electrical nets. Engineers naturally think of nets as organized into "buses" — groups of related nets named by convention.

The existing implementation was a series of procedural scripts that parsed data files, sorted nets by naming convention, and applied rules to grouped nets. Five steps of procedural manipulation, each producing intermediate files. Each new operation required new scripts. Rules were embedded in file manipulation logic. Changing the file format required rewriting scripts. The domain concept of "bus" was entirely implicit — hidden in naming conventions and parsing logic.

The model-driven solution creates explicit domain objects: a `Bus` object containing nets, a `Net` object with identity within the bus, and `assignRule()` methods on both, with Bus propagating rules to its Nets.

```java
class Net extends AbstractNet {
    private Bus bus;
    
    Set assignedRules() {
        Set result = new HashSet();
        result.addAll(super.assignedRules());
        result.addAll(bus.assignedRules());
        return result;
    }
}
```

The core logic is now three or four lines of meaningful code. The domain concept of "bus" — which was real and important to domain experts all along — is now visible in the code. New operations are trivial to add. File format changes don't break the model. Tests can be written against the domain logic independently.

This is what Model-Driven Design looks like in practice: not a formal methodology, but the recognition that domain concepts should be visible in code.

## The SMART UI Alternative

Evans makes a move that surprises many readers: he presents Smart UI — putting all logic in the user interface — not as always wrong, but as a legitimate trade-off in specific circumstances.

Smart UI is appropriate when: the system is simple (mostly data entry and display), the team lacks advanced modeling skills, the timeline is very tight, and the domain complexity will not grow.

"Not all projects are ambitious or can muster those skills."

Smart UI offers high productivity for simple, bounded problems. The cost: you cannot use domain-driven design, you cannot refactor toward richer behavior, and you have a limited growth path. The moment the system needs to handle complex domain logic, you face rewriting from scratch.

Evans' point is not to endorse Smart UI but to be honest about the trade-off. Advocating for Model-Driven Design requires acknowledging when it is not worth the cost. If a team chooses Smart UI with open eyes, that is a legitimate decision. The danger is choosing it by default, without understanding that it closes off future options.

## What Makes This Approach Irreplaceable

The central insight of Ubiquitous Language and Model-Driven Design is that the gap between business understanding and software implementation is not a communication problem to be solved by better meetings. It is an architectural problem to be solved by making the model the common ground.

When the model lives in code — not just in diagrams or in the heads of senior architects — the model is continuously tested against reality. When domain experts can read code and recognize their concepts, the feedback loop closes. When developers understand that refactoring changes the model, every code change becomes an opportunity to deepen domain understanding.

The software produced by this approach is not just technically correct. It is *comprehensible to people who understand the domain*. That comprehensibility is what allows the system to be changed, extended, and maintained without fear.
```

---

### FILE: building-blocks-entities-values-aggregates.md
```markdown
# The Building Blocks of Domain Models: Entities, Value Objects, Aggregates, and the Art of Drawing Boundaries

## Why Object Classification Matters

In most object-oriented codebases, objects are objects. A class is a class. The distinction between a `Customer` and a `Money` amount is treated as a matter of taste or convention. Evans argues that this misses something fundamental: different kinds of domain concepts have different *identities*, different *lifecycles*, and different *consistency requirements*, and these differences must be reflected in how they are designed and managed.

The classification of objects into Entities, Value Objects, and Aggregates is not a formalism for its own sake. It is a set of design decisions that, when made correctly, produce systems that are easier to reason about, easier to test, and more correct under concurrent access.

## Entities: Identity as the Defining Property

An Entity is an object defined primarily by its *continuity and identity*, not by its attributes.

"Many objects are not fundamentally defined by their attributes, but by a thread of continuity and identity."

A customer remains the same customer even if their name, address, and phone number all change. An order remains the same order even if every line item on it is modified. What makes them "the same thing" is not what they contain — it is that they are the same *instance* persisting through time.

The design implications flow directly from this:

- **Identity must be tracked explicitly**, typically via an ID field that persists across state changes.
- **Attributes come and go**, but identity persists. The class definition should focus on lifecycle and identity.
- **Operations revolve around "who they are, not what they have."** The Customer class is about customer management, not about the current value of an address attribute.

Evans' insight about identity is non-obvious: "Identity is not intrinsic to things in the world, it is a meaning superimposed because it is useful. In fact, the same real-world thing might or might not be represented as an ENTITY in a domain model."

The example that makes this concrete: In a stadium with assigned seating, each seat has an identity — seat number 23B is distinct from seat number 23C. The seat is an Entity. In general admission, only the count of available seats matters. A "seat" is not an Entity — it has no meaningful identity distinct from any other seat.

The same physical object (a seat) is modeled differently depending on what the application cares about. This is a modeling decision, not a fact about the world.

## Value Objects: When Identity Does Not Matter

A Value Object is an object describing a characteristic or attribute; it has no conceptual identity.

"When you care only about the attributes of an element of the model, classify it as a VALUE OBJECT."

Evans' example is memorable: a child drawing doesn't care which red marker he uses. All red markers of the same shade are interchangeable. But he cares deeply which drawing is his versus his sister's — that drawing has identity. The marker is a Value Object; the drawing is an Entity.

Value Objects should be:
- **Immutable** — safe to share, copy, or pass as parameters without risk of unexpected mutation
- **Free of identity tracking overhead** — no ID fields, no lifecycle management
- **Eligible for performance optimizations** — FLYWEIGHT pattern, denormalization, aggressive caching

The immutability point deserves elaboration. When an object has no identity, mutating it is semantically incoherent. If you change the color of a red marker to blue, you haven't modified that marker — you've replaced the concept of "red" with the concept of "blue." Value Objects should return new instances rather than modifying themselves.

Evans permits an important exception: "If a VALUE is frequently changed, if object creation is expensive, if replacement will disturb clustering, or if there is not much sharing, then mutability may be justified." But then he enforces a strict trade-off: "If a VALUE's implementation is to be mutable, then it must not be shared." Mutability and sharing together destroy the value semantics that make Value Objects tractable.

## The Boundary Between Entity and Value Object Is a Design Choice, Not a Discovery

Perhaps the most important non-obvious point: the classification of an object as an Entity or Value Object is not a fact about the domain. It is a design decision driven by what the application needs to know.

Consider an address. In a mail-order business, when a customer moves, you update their address. The address is effectively a label — a Value Object. You don't care about the specific address instance; you care about the current location.

In a postal service, an address has identity. Two different packages might be delivered to the same physical location, but the address is an Entity — it has a history of what has been delivered there, a record of any delivery failures, a relationship to carrier routes.

Same real-world concept, modeled differently in different applications. The modeling decision should be driven by what the application needs to track.

## Aggregates: Consistency Boundaries in a Complex Object Graph

When objects form complex webs of associations — Customers referencing Orders, Orders referencing Products, Products referencing Suppliers, Suppliers referencing other Products — three problems emerge simultaneously:

1. **Concurrency**: If two users are editing the same order at the same time, what needs to be locked? Locking a line item doesn't prevent violations of order-level invariants. Locking the entire object graph prevents all concurrency.

2. **Deletion**: If you delete a Customer, what else must be deleted? What can be left in place? The answer depends on understanding which objects "belong to" the Customer in a meaningful sense.

3. **Invariants**: Which business rules must be maintained at all times? If an order must not exceed its approved limit, that invariant spans the order and all its line items. Who is responsible for enforcing it?

"It is difficult to guarantee the consistency of changes to objects in a model with complex associations."

The Aggregate pattern addresses all three problems simultaneously. An Aggregate is a cluster of related Entities and Value Objects treated as a *unit for data changes*.

The structure is precise:
- **Root**: A single Entity that external objects may reference. The root has global identity.
- **Boundary**: Defines what is inside the Aggregate.
- **Internal objects**: May reference each other but cannot be referenced from outside except through the root. Internal Entities have local identity only — meaningful within the Aggregate, not globally.

The rules governing Aggregate boundaries:
1. Nothing outside the boundary may hold a reference to anything inside except the root.
2. Only roots can be obtained directly from database queries.
3. Internal objects can only be found by traversal through the root.
4. Deleting the root deletes everything inside the boundary.
5. All invariants are checked when any change to the Aggregate is committed.

## The Purchase Order Example: When Invariants Drive Boundaries

Evans' purchase order example is the clearest illustration of why Aggregate boundaries matter in practice.

A Purchase Order contains Line Items. The business rule: the sum of all line items must not exceed the approved purchase limit.

Suppose two users are editing different line items simultaneously:
- User 1 adds 5 guitars at $100 each = $500
- User 2 adds 3 trombones at $200 each = $600
- The approved limit is $1,000
- Each user sees their own change as valid
- Combined: $1,100, which violates the invariant

If you lock only a single line item when editing, you cannot prevent this. The invariant spans the entire order. The only correct lock boundary is the entire Purchase Order — it is the Aggregate root, and the line items are inside its boundary.

Now consider an alternative design where Line Items reference the Parts catalog. Should Parts be inside the Purchase Order Aggregate? The answer is no — Parts are shared across many orders, and locking them whenever any order is edited would create enormous contention. Two different orders containing the same part couldn't be edited simultaneously.

The insight: Parts are not part of the Purchase Order's *consistency boundary*. The invariant (total cost) is enforced by the line item prices captured *at the time of ordering*, not by the current Part catalog prices.

The revised model: Line Items capture the price at the time they are added. Changes to Part catalog prices affect future orders but not existing ones. This eliminates lock contention between orders while maintaining the invariant that matters — the approved limit is enforced at commit time across all line items within the Aggregate.

"Any rule that spans AGGREGATES will not be expected to be always up to date. Through event processing, batch processing, or other update mechanisms, other dependencies can be resolved within some specified time."

This is a liberating principle: you don't need pessimistic locking across the entire system. Invariants *within* an Aggregate must be maintained within a transaction. Invariants *across* Aggregates can be eventual — maintained through events, batch processing, or reconciliation.

## Associations Must Be Constrained

Early domain models naturally produce many-to-many, bidirectional associations. Every entity has arrows pointing in multiple directions. Evans argues these must be actively reduced, not because simplicity is a virtue in itself, but because each association is a cost — a thing that must be maintained, tested, and understood.

The tools for constraining associations:

**Impose traversal direction.** If you can ask "which customer owns this order" but never "which orders does this customer have," make the association unidirectional: Order references Customer, but Customer does not reference Order. If you need to find all orders for a customer, that is a query — done through a Repository, not by traversing from the Customer.

**Add qualifiers.** A Country has many presidents, but each country has at most one president at any given time. A qualifier (time period) reduces a one-to-many association to a qualified one-to-one. "The current president of France" is a single, specific entity. The association is now easier to traverse and reason about.

**Eliminate non-essential associations.** The test: is this association necessary to enforce any invariant or support any required traversal? If not, it is accidental complexity.

Evans uses the president example explicitly: "We never ask 'Which country was George Washington president of?' So make it unidirectional." This reflects domain understanding — the question simply doesn't arise in the application — and simplifies the design.

## The Cargo Shipping Aggregate: A Complete Example

Evans' detailed cargo shipping example shows how these principles combine in practice.

Initial model issues: The Cargo object had bidirectional associations with Customer (each Customer had a collection of all their Cargos), and with Delivery History, which itself had a collection of Handling Events — creating a circular reference.

Refactoring decisions, step by step:

**Step 1: Directionality.** Remove the Customer → Cargo collection. If you need to find all cargos for a customer, use a Repository query. The Customer object should not be responsible for holding references to every order they've ever placed — that collection could grow without bound, and it creates unnecessary coupling.

**Step 2: Aggregate boundaries.** Cargo is the root, owning Delivery History and Delivery Specification. Customer, Location, and Carrier Movement are separate roots — they are shared across many cargos. Handling Event is a debatable case; it was made a separate root because adding handling events is a low-contention transaction that should not require locking the entire Cargo Aggregate.

**Step 3: The alternative design.** The original Delivery History held a collection of Handling Events. The problem: adding a new Handling Event required locking the Cargo Aggregate (because Delivery History is inside it). Under high load — many events being added simultaneously — this creates contention.

The solution: Replace the Handling Event collection in Delivery History with a Repository query. When you need the delivery history, you query for all Handling Events associated with this Cargo. You no longer hold the collection in memory. Handling Event creation is now independent — no lock on Cargo needed.

Trade-off: Slightly slower if frequent listing of full history is common; better under concurrent write load. Evans is explicit that this is a trade-off, not an obvious answer. The right choice depends on the actual access patterns of the application.

The Cargo constructor demonstrates how Aggregate integrity is enforced at creation:

```java
public Cargo(String id) {
    trackingID = id;
    deliveryHistory = new DeliveryHistory(this);
    customerRoles = new HashMap();
}
```

The Cargo's constructor creates the Delivery History (ensuring the Aggregate is complete from the moment of creation). The Delivery History's constructor requires the Cargo (maintaining bidirectional integrity within the Aggregate boundary). No partial objects can escape.

## Why These Building Blocks Are Irreplaceable

The classification of objects into Entities, Value Objects, and Aggregates is not a framework imposed from outside the domain. It is a rigorous vocabulary for decisions that every developer must make — whether explicitly or implicitly — about identity, mutability, and consistency.

Without this vocabulary, developers make these decisions inconsistently, by intuition, or not at all. The result is systems where some objects have accidental identity (they were given an ID column because everything gets an ID column), where Value Objects are mutated in place causing subtle bugs in concurrent code, and where there is no clear answer to "what do we lock" or "what do we delete."

The building blocks give developers a shared language for these architectural decisions — a language that connects directly to the business domain, not just to database schemas or memory management.
```

---

### FILE: factories-repositories-and-lifecycle-management.md
```markdown
# Factories, Repositories, and the Complete Lifecycle of Domain Objects

## The Problem of Object Lifecycle

A domain model does not exist at a single moment in time. Objects are created, modified, queried, sometimes archived, and eventually deleted. Each phase of this lifecycle presents challenges: How do you create complex objects without clients needing to know their internal structure? How do you retrieve objects from persistent storage without losing the domain model's integrity? How do you ensure that the act of querying for an object doesn't force you to think about database schemas instead of business concepts?

Evans introduces two patterns that together manage the complete lifecycle of domain objects: Factories handle creation, and Repositories handle retrieval.

"The FACTORY makes new objects, the REPOSITORY finds old objects."

This distinction seems obvious stated plainly, but its implications run deep.

## Factories: Creation Without Exposure

The problem with letting complex objects create themselves or letting clients create them directly is encapsulation failure. When a client must construct an object, the client must know enough about the internal structure to create a valid instance. That knowledge represents coupling — coupling that breaks every time the internal structure changes.

"Shift the responsibility for creating instances of complex objects and AGGREGATES to a separate object, which may itself have no responsibility in the domain model, but is still part of the domain design."

A Factory has three essential properties:

**Atomicity**: A Factory creates objects completely. There is no "partially constructed" state that escapes to clients. The Factory either produces a fully valid object or throws an exception. Invariants are enforced at creation time, not left for the caller to enforce.

**Encapsulation**: The Factory hides all internal structure. Clients do not need to know whether a Cargo contains a DeliveryHistory or how that DeliveryHistory is initialized. They call the Factory and receive a valid Cargo.

**Abstraction**: Factories should return interfaces, not concrete types, when possible. This allows the implementation to change without affecting callers.

The placement of Factory logic follows natural boundaries:

**Factory Method on the Aggregate Root** creates internal objects, hiding Aggregate internals. The Cargo creates its own DeliveryHistory in its constructor — clients don't need to know that Delivery History exists, much less how to initialize it correctly.

**Factory Method on a Related Object** is appropriate when one object naturally creates another because of their relationship. A CarrierMovement might have a factory method for creating a new HandlingEvent, because a HandlingEvent is only meaningful in the context of a CarrierMovement.

**Standalone Factory** is necessary when creation logic is complex but has no natural home in the domain model, or when the creation should be decoupled from a specific class hierarchy.

## Reconstitution: The Special Case

Factories are typically discussed in terms of creating new objects. But Evans identifies an equally important and often overlooked responsibility: reconstitution — rebuilding objects from persistent storage.

When you load a Cargo from a database, you are not creating a new Cargo. You are rebuilding an existing Cargo that was previously stored. The object already has an identity (its tracking ID). The Factory for reconstitution must respect that identity rather than generating a new one.

"A REPOSITORY may defer to the object's FACTORY, so that the assembly of the object in the REPOSITORY and the Factory's handling of the new object are not separated."

The practical implication: Factories for reconstitution take stored data (database rows, XML documents, serialized state) and produce fully valid domain objects. They handle all the mapping from storage representation to domain model. The client receives the object and has no awareness that it was reconstructed from a database rather than created fresh.

## Repositories: The Illusion of a Collection

Without Repositories, developers become entangled in database access mechanics. They write SQL queries, map result sets to objects, manage connections, handle transaction boundaries. This is not just tedious — it actively undermines Model-Driven Design. Domain logic leaks into application code as developers bypass the model and query directly for what they need.

"The goal of domain-driven design is to create software by focusing on a model of the domain rather than the technology."

A Repository solves this by presenting a simple, model-focused interface to persistent objects.

"A REPOSITORY represents all objects of a certain type as a conceptual set (usually simulated). It acts like a collection, except with more elaborate querying capability."

The client's experience of a Repository should feel like accessing a collection of objects in memory. "Give me the Cargo with tracking ID XYZ123." "Give me all cargos departing from Rotterdam." The Repository handles all persistence mechanics: the database query, the object reconstitution, the caching strategy, the transaction management.

The Repository's responsibilities:
- Add and remove objects (encapsulating database insert and delete)
- Query for objects by criteria (encapsulating search logic)
- Return fully instantiated objects (encapsulating reconstitution via Factory)
- Provide access only to Aggregate roots, never to internal objects

That last point is critical. Repositories enforce Aggregate boundaries. You cannot ask a Repository for a Delivery History directly — Delivery History is inside the Cargo Aggregate, accessible only through Cargo. This constraint prevents clients from bypassing the Aggregate root and accessing internal objects directly, which would undermine invariant enforcement.

## The Infrastructure Disappears

The most powerful property of Repositories is testability. Because the Repository presents an interface to clients, that interface can be backed by:
- A production relational database
- A different database (for a different deployment environment)
- An in-memory collection (for unit tests)
- A mock that returns specific test data

The client code does not change. The Repository implementation changes. This enables unit testing of domain logic in complete isolation from database infrastructure.

"The ideal is to hide all this from the client (although not the developer of the client) so that client code will be the same whether the data is stored in an object database, a relational database, or simply held in memory."

Evans is careful to note the parenthetical: "not the developer of the client." The developer writing the client code should understand that a Repository exists and what it does. But the specific implementation details — connection strings, query languages, mapping strategies — are hidden.

"You have more freedom to change the implementation of a REPOSITORY than you would if the client were calling the mechanisms directly. You can take advantage of this to optimize for performance, by varying the query technique or by caching objects in memory, freely switching persistence strategies at any time."

## Repositories Only for Aggregate Roots

One of the most important and frequently misunderstood aspects of Repository design: Repositories exist only for Aggregate roots.

Evans is explicit: "A REPOSITORY may be thought of as an object to hold ENTITIES. In practice, you will want REPOSITORIES only for AGGREGATE roots that actually need direct access."

When you define your Aggregates, you are simultaneously defining which objects can be queried directly and which can only be reached by traversal. If a Handling Event is inside the Cargo Aggregate, there is no Handling Event Repository — you find Handling Events by querying for the Cargo and traversing to its Delivery History.

This constraint has significant implications for system design. It means that defining Aggregate boundaries is partly a query design decision: "How will clients need to access this object? Will they need to find it directly, or always through a containing root?"

In the cargo shipping example, the Handling Event Repository question was debatable: "The most problematic of the AGGREGATE boundaries in the CARGO shipping model is the one between DELIVERY HISTORY and HANDLING EVENT." The initial design put Handling Events inside the Cargo Aggregate, accessible only through Delivery History. The alternative design gave Handling Events their own Repository, allowing them to be queried directly.

The trade-off: tighter Aggregate boundary (less contention, simpler queries at the cost of loading Cargo to access Handling Events) versus a separate Aggregate root (direct access, but higher contention when adding events simultaneously with Cargo modifications).

## Relational Databases and the Object Model

Evans addresses the practical challenge of mapping object models to relational databases with unusual honesty.

"When the database schema is being created specifically as a store for the objects, it is worth accepting some model limitations in order to keep the mapping very simple."

The recommendation: keep the mapping simple. "A table row contains an object, perhaps along with subsidiaries in an AGGREGATE. A foreign key in the table translates to a reference to another ENTITY object."

The warning against divergence: "When the database is being viewed as an object store, don't let the data model and the object model diverge far, regardless of the powers of the mapping tools."

And the application of Ubiquitous Language to database schemas: "Corresponding elements in the objects and the relational tables should be named meticulously the same and have the same associations. Subtle differences in relationships will cause a lot of confusion."

This last point is striking. The Ubiquitous Language extends to database schemas. If the domain object is called `Cargo` and the database table is called `shipments`, you have introduced a translation layer — another place where meaning can be lost, another thing for developers to hold in their heads.

## Pragmatism with Frameworks

Evans acknowledges that frameworks do not always cooperate with Repository design. J2EE projects, for example, had EJB Home objects that served a similar purpose to Repositories but with different mechanics.

"In general, don't fight your frameworks. Seek ways to keep the fundamentals of domain-driven design and let go of the specifics when the framework is antagonistic."

This is important pragmatic guidance. The goal is the *behavior* of a Repository — encapsulating persistence mechanics, presenting a model-focused interface — not the specific implementation. If a framework provides a mechanism that achieves the same effect with different code structure, use it. The commitment is to the principle, not to the pattern name.

## The Complete Lifecycle Integrated

Factories and Repositories together manage the complete lifecycle of domain objects without exposing the domain model to infrastructure concerns.

**Creation**: A client asks a Factory to create a new Cargo. The Factory initializes the Cargo with its Delivery History and empty customer roles, enforcing all creation invariants. The client receives a complete, valid Cargo with no knowledge of how it was constructed.

**Retrieval**: A client asks a Repository to find a Cargo by tracking ID. The Repository queries the database, uses the Factory to reconstitute the Cargo (preserving its existing identity), and returns the complete, valid object. The client has no knowledge of the query mechanism or the reconstruction process.

**Modification**: The client modifies the Cargo through its public interface. The Cargo enforces its invariants (Delivery Specification must be satisfiable, etc.). The Repository's Unit of Work tracks all changes.

**Persistence**: At transaction commit, the Repository persists all changes. Again, the domain model is shielded from the mechanics.

**Deletion**: The client removes the Cargo from the Repository. The Repository deletes the entire Aggregate — Cargo, Delivery History, and all associated objects — in a single coordinated operation. Internal objects are not left as orphans.

At no point does the domain model contain infrastructure code. Persistence is entirely the Repository's concern. Creation invariants are entirely the Factory's concern. The domain model remains focused exclusively on business rules and domain behavior.

This separation is what makes it possible for domain code to be testable in isolation, for persistence strategies to be changed without touching domain logic, and for domain experts to read and validate code that accurately represents their mental model.
```

---

### FILE: supple-design-patterns.md
```markdown
# Supple Design: How to Build Software That Invites Change

## The Core Problem

Every complex software system accumulates a debt. As the system grows, each new feature requires understanding more of the existing code. Developers who aren't confident about the consequences of a change stop making changes. They write new code instead of modifying old code. Duplication proliferates. The system grows harder to understand with each passing week, until the team spends most of its time not building new capability but managing the complexity they have already created.

"When software with complex behavior lacks a good design, it becomes hard to refactor or combine elements. Duplication starts to appear as soon as a developer isn't confident of predicting the full implications of a computation."

The consequence is a ceiling: "In any but the smallest systems, this places a ceiling on the richness of behavior it is feasible to build. It stops refactoring and iterative refinement."

The alternative is what Evans calls supple design: software that remains comprehensible and malleable as it grows. "To have a project accelerate as development proceeds rather than get weighed down by its own legacy demands a design that is a pleasure to work with; inviting to change. A supple design."

The non-obvious claim: "Simple is not easy. To make complex systems work, a dedication to MODEL-DRIVEN DESIGN has to be joined with a moderately rigorous design style. It may well require relatively sophisticated design skill to create or to use."

Supple design is not minimalism. It is not avoiding complexity. It is structuring complexity in ways that remain tractable.

## Pattern 1: Intention-Revealing Interfaces

The first and most fundamental principle: "If a developer must consider the implementation of a component in order to use it, the value of encapsulation is lost."

When you can only understand a method by reading its body, abstraction has failed. Every time a developer calls your method, they must do the mental work of reading and understanding the implementation. This work is repeated by every developer who uses the method, every time they use it.

"If someone other than the original developer must infer the purpose of an object or operation based on its implementation, that new developer may infer a purpose that the operation or class fulfills only by chance."

The pattern: name classes and operations to describe their *effect and purpose*, without reference to the *means* by which they achieve it.

**Example: Paint Mixing**

Consider a paint mixing application. The initial method signature:
```java
void paint(Paint p)
```

This tells you almost nothing. Paint *what*? Does the argument get modified? What happens to `this`?

Rename it:
```java
void mixIn(Paint p)
```

Now the intent is clear. You are mixing the argument paint into this paint. A developer calling this method understands what will happen without reading the implementation.

Evans' technique for discovering the right interface: write the test first, using the API you *wish* you had.

```java
ourPaint.mixIn(blue);
assertEquals(200.0, ourPaint.getVolume(), 0.01);
```

Writing the test first forces you to express your intent before you think about implementation. The names that feel natural in a test often reveal the right interface.

## Pattern 2: Side-Effect-Free Functions

Operations nest arbitrarily. Method A calls method B, which calls method C, which modifies state in objects D, E, and F. By the time you are reasoning about method A, you have lost track of all the state changes that occurred two and three levels down.

"Interactions of multiple rules or compositions of calculations become extremely difficult to predict. The developer calling an operation must understand its implementation and the implementation of all its delegations in order to anticipate the result."

Two strategies address this:

**Strategy 1**: Segregate commands (operations that modify state) from queries (operations that return results without modifying state). Keep commands simple — ideally, a command just modifies one specific thing. Ensure queries have no side effects — calling them does not change any observable state.

**Strategy 2**: Return a new Value Object instead of modifying existing state. The complex logic produces a result; it does not mutate the inputs.

**Example: PigmentColor as Value Object**

The paint mixing code initially modified the Paint object in place:

```java
public void mixIn(Paint other) {
    volume = volume + other.getVolume();
    // ... complex color calculations modifying 'this' in place
}
```

The problem: color mixing is complex. Verifying that it worked correctly requires understanding all the mutations that occurred. Testing requires examining object state after the fact.

The refactored approach extracts color mixing into an immutable Value Object:

```java
public class PigmentColor {  // Immutable VALUE OBJECT
    public PigmentColor mixedWith(PigmentColor other, double ratio) {
        // Returns a NEW PigmentColor; does not modify 'this' or 'other'
    }
}
```

Now:
```java
public void mixIn(Paint other) {
    volume = volume + other.getVolume();
    pigmentColor = pigmentColor.mixedWith(other.pigmentColor, other.volume / this.volume);
}
```

The complex logic (color mixing) is now isolated in a side-effect-free function. It can be tested independently. It can be composed with other operations without tracing mutations. The mutation in `mixIn` is minimal and obvious.

"VALUE OBJECTS are immutable, which implies that, apart from initializers called only during creation, all their operations are functions."

## Pattern 3: Assertions

Even simple commands can trigger cascading mutations. Without explicit postconditions, developers must trace the entire call chain to understand what a command guarantees.

"When the side effects of operations are only defined implicitly by their implementation, designs with a lot of delegation become a tangle of cause and effect."

The pattern: state postconditions of operations and invariants of classes explicitly. These are assertions — not just documentation, but design claims that should be testable.

**Example: The Paint Volume Puzzle**

The original paint mixing design had a confusing postcondition:

```java
p1.mixIn(p2);
// p1's volume increases by p2's volume
// p2's volume is UNCHANGED
```

Why is p2's volume unchanged? Intuitively, if you pour paint2 into paint1, paint2 should be depleted. But the code doesn't reflect this. The postcondition is incoherent with intuition.

This signals a model problem, not a documentation problem. The solution is not to write a comment explaining the counterintuitive behavior — it is to refactor the model so the postconditions make sense.

The refactored model:

```java
public class MixedPaint {
    private List<StockPaint> constituents;
    
    public void mixIn(StockPaint paint) {
        constituents.add(paint);  // Simply adds to collection
    }
    
    public double getVolume() {
        return constituents.stream().mapToDouble(StockPaint::getAmount).sum();
    }
    
    public PigmentColor getColor() {
        return calculateMixFromConstituents();  // Computed, not stored
    }
}
```

Now the assertions are coherent:
- Postcondition of `mixIn`: the paint is added to constituents
- Invariant: volume equals the sum of constituent volumes
- Invariant: color equals the computed mix of constituent colors

"Theoretically, any non-contradictory set of assertions would work. But humans don't just compile predicates in their heads. They will be extrapolating and interpolating the concepts of the model, so it is important to find models that make sense to people as well as satisfying the needs of the application."

When postconditions are confusing, the confusion is a signal from the domain. The model is wrong. Find the concept that makes the assertions coherent, and refactor to make that concept explicit.

## Pattern 4: Conceptual Contours

Decompose into pieces that are too fine and clients face a combinatorial explosion of concepts to understand before they can accomplish anything. Decompose into monoliths and you get duplication and coupling.

"Cookbook rules don't work. But there is a logical consistency deep in most domains, or they would not be viable in their own sphere."

The pattern: align decomposition with the domain's natural joints, not with arbitrary granularity or technical convenience.

"Find the conceptually meaningful unit of functionality, and the design will be both flexible and easily understood. For example, if an 'addition' of two objects has a coherent meaning in the domain, then implement methods at that level. Don't break the add() into two steps."

**Example: Accruals Refactor**

An initial loan system design scattered responsibility across multiple classes:
- `Asset.calculateInterestForDate()`
- `Asset.calculateFeesForDate()`
- Separate `InterestPaymentHistory` and `FeePaymentHistory`

When a new requirement arrived — handling early and late payment rules — the design forced duplication. Interest payment history and fee payment history had parallel logic that differed only in the specific type being computed.

The refactored model aligned with domain contours:
- Abstract `AccrualSchedule` with Interest and Fee as subclasses
- Single `Payment` class covering all payment types
- `Asset` delegates to `AccrualSchedule`

The critical insight about this refactoring: "This ease of extension did not come because she anticipated the change. Nor did it come because she made a design so versatile it could accommodate any conceivable change. It happened because in the previous refactoring, the design was aligned with underlying concepts of the domain."

Alignment with domain contours does not require anticipating future requirements. It requires correctly understanding the present domain. When the model is correct, future changes in the same domain tend to fit naturally.

## Pattern 5: Standalone Classes

Every dependency is a thing you must understand before you can understand the class that depends on it. Dependencies compound.

"With one dependency, you have to think about two classes at the same time, and the nature of their relationship. With two dependencies, you have to think about each of the three classes, the nature of the class's relationship to each of them, and any relationship they might have to each other... It snowballs."

The pattern: eliminate all *nonessential* dependencies. Pursue zero dependencies where possible.

"In an important subset, the number of dependencies can be reduced to zero, resulting in a class that can be fully understood all by itself, along with a few primitives and basic library concepts."

**Example: PigmentColor as Standalone**

`PigmentColor` depends only on:
- Primitive types (numbers for color channel values)
- Basic library concepts (collections, if needed)

It has no dependency on `Paint`, `StockPaint`, `MixedPaint`, or any domain-specific class. Paint depends on PigmentColor — the dependency is one-way. PigmentColor can be understood, tested, and reasoned about in complete isolation.

"Low coupling is a basic way to reduce conceptual overload. A STANDALONE CLASS is an extreme of low coupling."

The pursuit of standalone classes is an active design discipline, not a natural outcome. Dependencies accumulate easily. Removing them requires deliberate effort to find where logic can be extracted into classes that know less about the surrounding system.

## Pattern 6: Closure of Operations

Return types introduce conceptual dependencies. If a method takes a Widget and returns a Gadget, you now need to understand both Widget and Gadget to use the method. If the return type is the same as the argument type, no new concept is introduced.

"A lot of unnecessary dependencies, and even entire concepts, get introduced at interfaces. Most interesting objects end up doing things that can't be characterized by primitives alone."

The pattern: where possible, define operations where the return type is the same as the argument type.

**Mathematical basis**: Addition of real numbers is closed — 1 + 1 = 2, a real number. You can chain additions indefinitely without introducing new concepts. The natural numbers, the rationals, the reals — all of these are closed under addition.

**Software example**:

```java
PigmentColor mixed = blue.mixedWith(red, 0.5);
```

`mixedWith` takes a `PigmentColor` and returns a `PigmentColor`. No new concepts introduced. You can chain:

```java
PigmentColor result = blue.mixedWith(red, 0.5).mixedWith(yellow, 0.3);
```

This is the Smalltalk Collections example made explicit. In Smalltalk:
```smalltalk
employees select: [:e | e salary < 40000]
```
Returns a Collection. You can immediately `select` again. Chain arbitrarily. Java's equivalent required `Iterator` boilerplate that broke the closure.

**The SharePie Capstone**

The most powerful example of closure in DDD is the SharePie class for syndicated loan payment distribution.

Initial problem: When a borrower makes a payment on a syndicated loan, the payment must be distributed proportionally among the lending banks according to their shares. The logic was complex and scattered.

The solution: a SharePie Value Object with closed arithmetic:

```java
public class SharePie {  // Immutable VALUE OBJECT
    public SharePie prorated(double amount) { ... }  // Returns SharePie
    public SharePie plus(SharePie other) { ... }     // Returns SharePie
    public SharePie minus(SharePie other) { ... }    // Returns SharePie
}
```

With this design, business logic becomes readable:

```java
public void applyPrinciplePayment(SharePie paymentShares) {
    setShares(shares.minus(paymentShares));
}

public SharePie calculateLoanDrawdownDistribution(double amount) {
    return shares.prorated(amount);
}

// Analytical query becomes declarative:
SharePie deviation = actual.minus(originalAgreement.prorated(loanAmount));
```

That last line is remarkable. It is a business statement expressed directly in code: "The deviation is the actual distribution minus what the original agreement would have called for, prorated by loan amount." A domain expert who understands the business can validate that this code is correct.

"Where it fits, define an operation whose return type is the same as the type of its argument(s)... A closed operation provides a high-level interface without introducing any dependency on other concepts."

## The Integration of the Six Patterns

These patterns are not independent techniques. They reinforce each other and should be applied together.

Intention-revealing interfaces make operations understandable without reading their implementation. Side-effect-free functions make them safe to compose. Assertions make their guarantees explicit. Conceptual contours ensure the decomposition follows domain logic. Standalone classes minimize the mental overhead of understanding any single component. Closure of operations enables algebraic composition without introducing new concepts at every step.

When all six are applied consistently, the result is code that reads like a description of the business domain, not like a list of programming instructions. "Versatility and explanatory power suddenly increase even as complexity evaporates."

## The Validation-First Principle

Evans' warehouse packing example introduces a non-obvious technique for approaching hard algorithmic problems: start with validation, not optimization.

The warehouse problem: chemicals need containers with specific safety features (armored, ventilated). The packing algorithm must satisfy these constraints while optimizing space.

The counterintuitive approach: "We could start writing a procedure to take a chemical and place it in a container, but, instead, let's start with the validation problem. This will force us to make the rules explicit, and will give us a way to test the final implementation."

Start by building the constraint checker:

```java
class ContainerSpecification {
    boolean isSatisfiedBy(Container c) { ... }
}
```

Define the packing service interface with an explicit assertion:
```
/* ASSERTION: At end of pack, the ContainerSpecification 
of each Drum shall be satisfied by its Container. */
```

Then implement the simplest possible packing algorithm — a greedy first-fit:

```java
class PrototypePacker implements WarehousePacker {
    // ~30 lines; naive but correct; satisfies the assertion
}
```

This prototype satisfies the contract. It is correct, even if suboptimal. It unblocks other development. When specialists implement a better algorithm, they can verify it against the same assertion the prototype satisfies.

**The strategic insight**: decoupling domain rules (what is correct) from algorithms (how to find correct solutions) enables them to evolve independently. Domain rules are stable; algorithms are volatile. When a better packing algorithm is found, the validation remains unchanged. When business rules change (a new hazardous material regulation), the algorithm doesn't need to change — only the specification.

## What This Means in Practice

The six patterns of supple design produce a specific experience for developers working with the code. They can:
- Call methods without reading their implementations
- Compose operations without tracing mutations
- Trust that assertions will catch violations
- Add new functionality in the natural domain location
- Understand each component without understanding the entire system
- Write business logic that reads like domain description

This is not an aesthetic preference. It is the foundation for sustainable development of complex systems. Software that is hard to understand cannot be maintained. Software that cannot be maintained cannot grow. The ceiling on complexity is lifted not by better tooling or more developers, but by code that remains comprehensible as it grows.
```

---

### FILE: bounded-contexts-and-strategic-design.md
```markdown
# Bounded Contexts and Strategic Design: Managing Model Integrity Across Large Systems

## The Problem of Model Fragmentation

In a small system with a single team, a single model can be maintained coherently. As the system grows — more developers, more teams, more subsystems, longer timelines — the model begins to fragment. Different parts of the codebase develop subtly different understandings of the same concepts. Classes share names but accumulate incompatible semantics. The fragmentation is invisible within any single module but catastrophic at integration points.

Evans opens his strategic design section with a concrete disaster that illustrates the pattern.

Two teams worked on the same enterprise system. Both teams had a class called `Charge`. Team A (invoicing) used Charge to represent an amount due, with fields for expense code and billing period. Team B (bill-payment) used Charge to represent a payment obligation, with fields for percent deductible and validation rules. Neither team realized the other team's Charge existed.

When the systems were integrated, the failures were mysterious. The bill-payment application crashed on a "month-to-date tax report" when summing deductible amounts. Mysterious Charge records appeared in Team B's data that Team B had never created. Investigation eventually revealed: Team A's test data had default `percent_deductible` values set by a validation routine. Team B's code required `percent_deductible` to never be null. The field meant different things in each context. Integration had silently combined two incompatible models.

"The most fundamental requirement of a model is that it be internally consistent; that every term always have the same meaning, and that it contain no contradictory rules. Internal consistency of a model such that each term is unambiguous and no rules contradict is called unification."

The key lesson: **models don't break at their own contradictions. They break at integration points, often far downstream from the original decision.** Contradiction is silent until scale forces it into the open.

## Bounded Contexts: The Solution

The resolution is not to force all teams to share a single model. That is expensive, constraining, and frequently impossible when teams work on genuinely different domains. The resolution is to make the fragmentation *explicit* and *deliberate*.

"Explicitly define the context within which a model applies. Explicitly set boundaries in terms of team organization, usage within specific parts of the application, and physical manifestations such as code bases and database schemas."

A Bounded Context is the explicit declaration of where a specific model applies. Within the boundary, the model is internally consistent and unambiguous. Across the boundary, translation is required.

The resolution of the Charge disaster: Team A creates `CustomerCharge` within the Invoicing Bounded Context. Team B creates `SupplierCharge` within the Bill-Payment Bounded Context. An Anticorruption Layer handles translation at the boundary between the two contexts.

This might seem like more work than sharing a single class. It is, in the short term. But it is far less work than diagnosing and fixing the failures that arise when contradictory models share a namespace.

## Context Maps: Making Relationships Explicit

Knowing where your Bounded Contexts end is only useful if you also know how they relate to each other. The Context Map is the tool for documenting these relationships.

A Context Map shows:
- All Bounded Contexts in the system
- The relationships between them
- The translation strategy at each boundary

Evans documents the cargo shipping system's Context Maps in detail. Three contexts exist:

**Booking Context**: Owns the core model — Cargo, Route Specification, Itinerary, Leg. The team controls this model entirely. The database schema is driven by this model.

**Transport Schedule Context** (Legacy): An existing system the team does not control. The only relationship is translation — the Booking team translates between its own model and whatever the legacy system requires.

**Voyage Scheduling Context**: A separate team working on scheduling optimization. Initially, this relationship was informal — occasional conversations, shared terminology, no explicit boundary definition.

The lesson from the Voyage Scheduling relationship: informal coordination is risky. Both teams used the word "Cargo" and assumed they meant the same thing. They did not. The relationship should have been formalized: either a Shared Kernel (with explicit agreement on what is shared and a process for coordinating changes) or explicit separate models with translation.

"The boundaries between BOUNDED CONTEXTS follow the contours of team organization."

This is a crucial insight. Model fragmentation follows organizational boundaries. Teams that don't communicate regularly will develop divergent models, regardless of technical architecture. Conversely, a Context Map that contradicts organizational reality will fail — if two teams are assigned to "share" a model but never coordinate, they will fragment it silently.

## Context Relationships: A Taxonomy

Evans defines several distinct ways that Bounded Contexts can relate to each other, each with different integration costs and different implications for team autonomy.

**Shared Kernel**: Two teams share a subset of the domain model — typically, core concepts that both teams need. The shared portion is subject to coordination: neither team can change it unilaterally. This requires ongoing communication and joint testing. It reduces integration cost but constrains team autonomy.

**Customer/Supplier**: The upstream team (supplier) provides a model that the downstream team (customer) depends on. The downstream team has some influence (they can request changes) but ultimately must adapt to what the upstream team provides. The upstream team must be responsive to downstream needs, or the relationship degrades.

**Conformist**: The upstream team provides a model; the downstream team adopts it wholesale, without translation. This is simpler than Customer/Supplier (no translation layer) but requires the downstream team to accept the upstream model's limitations and idiosyncrasies.

**Anticorruption Layer**: The downstream team translates the upstream model into its own model. The downstream team is fully isolated from the upstream model's concepts. This requires building and maintaining translation infrastructure, but it protects the downstream model's integrity completely.

**Separate Ways**: Two contexts have no integration. Each team solves its problems independently. This eliminates integration cost entirely, at the cost of eliminating any shared functionality.

**Published Language**: A shared, formal language (typically schema-based) that multiple contexts can use for integration. Similar to Shared Kernel but more formal and often more stable. The Chemical Markup Language (CML) is Evans' example — an industry-standard XML format for chemical data that enables tool interoperability without requiring all tools to share a model.

"Integration is always expensive, and sometimes the benefit is small."

This is the principle underlying the Separate Ways pattern. The default assumption in most organizations is that integration is always worth doing. Evans argues the opposite: justify integration. If two subsystems don't genuinely need shared data, the integration cost may exceed the benefit.

## The Anticorruption Layer in Detail

When integration is necessary but the external system's model would corrupt your own, the Anticorruption Layer is the appropriate solution.

The layer consists of several components working together:

**Facade**: Simplifies the interface to the external system. If the legacy system has a complex, idiosyncratic API, the Facade presents a cleaner interface to the translator code.

**Adapter**: Handles protocol translation — different calling conventions, different communication formats, different data structures.

**Translator**: The core of the Anticorruption Layer. The Translator understands both models and maps between them. This is where semantic translation occurs — understanding that "Charge" in the external system means "billing record," which corresponds to "CustomerInvoiceLine" in your model.

The translation is often bidirectional but rarely symmetric. Some information flows in one direction only. Some translations are lossy — information available in one model has no equivalent in the other.

In the shipping routing example, the translation between the Booking Context and the Transport Network Context is explicitly asymmetric:

**Booking → Transport Network**: A RouteSpecification (origin, destination, customs clearance requirements) is translated to a list of location codes. This is relatively straightforward — the location codes are well-defined.

**Transport Network → Booking**: A path through the network (a sequence of Nodes) is translated to an Itinerary (a sequence of Legs). This is more complex — Nodes with operationType="depart"/"arrive" form pairs; each pair becomes a Leg with vessel, date, and location information.

The Translator is a single, well-defined object that embodies the boundary between the two contexts. Both teams coordinate on it. It is accompanied by automated tests that verify the translation in both directions.

## Continuous Integration Within a Bounded Context

Defining a Bounded Context is not a one-time decision. It must be maintained. As the system evolves, the model evolves. As the model evolves, the risk of silent fragmentation returns.

"A pattern of frequent merging of code and tests, with automated testing to promptly detect incompatibilities, makes it feasible to keep all the developers on a single model." This is Continuous Integration applied at the semantic level, not just the code level.

Within a Bounded Context, Continuous Integration means:
- All team members work from a shared model
- Code is merged frequently (at minimum daily)
- Automated tests verify that merged code is semantically consistent
- When tests fail, the team stops and fixes the model before continuing

The contrast with inter-Context integration: within a Context, inconsistency must be fixed immediately. Across Contexts, inconsistency is managed through explicit translation. The boundary determines which kind of inconsistency applies.

## Distillation: The Core Domain and Its Periphery

Strategic design is not only about managing model integrity across contexts. It is also about directing effort toward the parts of the domain that matter most.

"Boil the model down. Find the CORE DOMAIN and provide a means of easily distinguishing it from the mass of supporting model and code."

The Core Domain is the part of the system where your software creates genuine competitive advantage. It is the reason the software exists. It is the part that, if implemented poorly, makes the entire system fail regardless of how well everything else works.

Evans illustrates the failure mode with a painful example: a loan system where expert developers were assigned to a "commenting" feature — the ability for operations staff to add notes to records. The loan model itself, the mission-critical calculation engine, was implemented by junior developers who did not understand the domain well enough.

The commenting feature worked well. The loan model was wrong in ways that were discovered slowly and expensively. The team had allocated their best people to the wrong problem.

**Generic Subdomains** are the parts of the system that support the Core Domain but do not differentiate it. Time zones, currency conversion, accounting arithmetic — these are necessary but not distinctive. They should be:
- Purchased as off-the-shelf components when available
- Implemented using published patterns (like double-entry accounting, well-documented for centuries)
- Assigned to less senior developers once their requirements are clear
- Not built speculatively before requirements are understood

The time zone example from the book shows both outcomes. One project assigned a strong temporary developer to research and implement time zone handling only after confirming it was genuinely needed. They leveraged an existing database (BSD Unix time zone database), built an import routine, and delivered a working solution that was isolated in a well-defined component. The core domain remained the focus.

A second project assigned a junior developer to build a "flexible" time zone model speculatively — before understanding that the application only needed North American time zones. Senior developers were pulled in to help. The resulting code was never used. The time spent on the generic subdomain was time not spent building the core domain knowledge that would have made the project successful.

## Cohesive Mechanisms: Extracting Algorithms

Even within the Core Domain, not all code is modeling code. Some code is *mechanical* — implementing algorithms that support the domain model but are not themselves domain knowledge.

**Cohesive Mechanisms** are extracted from the domain model and encapsulated as distinct components. The domain model describes *what* must be accomplished; the Mechanism provides the *how*.

The organization hierarchy example: A large organization needs to determine reporting relationships — who reports to whom, transitively. This requires graph traversal. Graph traversal is not domain knowledge; it is a formalism.

Initial design: graph traversal logic mixed into the organizational hierarchy domain model. The model is hard to understand because graph algorithm code obscures the domain concepts.

Refactored design: a graph traversal component (the Cohesive Mechanism) is extracted. The organizational hierarchy model describes the structure of the organization. The graph traversal component provides the algorithm for traversing any graph. The domain model uses the mechanism but does not contain it.

The domain model becomes cleaner — it expresses organizational concepts without implementation noise. The mechanism becomes a standalone component that can be understood and tested independently. Neither component needs to understand the other's full complexity.

## Large-Scale Structure: Understanding the System in Broad Strokes

Even when individual Bounded Contexts are well-designed and the Core Domain is clearly identified, a large system can remain incomprehensible at the whole-system level. Developers can understand their own module but cannot explain how it fits into the larger picture.

"A 'large-scale structure' is a language that lets you discuss and understand the system in broad strokes. A set of high-level concepts and/or rules establishes a pattern of design for an entire system."

The satellite communications simulator illustrates the problem. Individual modules were coherent. The team understood their own code. But developers working on one module couldn't quickly understand what another module did or how the two related. "What part handles X?" required investigation.

The breakthrough: the team realized they could tell a simple story about the system. Data flows through physical infrastructure. Integrity and routing are assured by layers of telecommunications technology. Higher layers manage logical communication.

Three layers:
1. **Physical Infrastructure Layer**: Raw bit transmission between nodes.
2. **Packet Routing Layer**: Direct data streams to the next node.
3. **Higher Protocol Layers**: Manage logical communication.

Once this structure was articulated, it became a design tool. Any new component had a natural question: "Which layer does this belong in?" Dependencies flowed downward — higher layers depend on lower layers; lower layers are self-contained. This constraint made design decisions consistent across the entire system.

The large-scale structure is not imposed top-down at the start of a project. It emerges from understanding the domain deeply enough to see the natural story the system tells. Attempting to impose structure before understanding produces ossified designs that must be abandoned as understanding deepens.

## The Phased Legacy Migration Strategy

Strategic design is not only about greenfield systems. Evans addresses the practical problem of existing legacy systems that have accumulated decades of implicit model decisions.

The recommended approach is iterative boundary adjustment, not big-bang replacement.

Each iteration:
1. Identify one function of the legacy system to replace.
2. Implement that function in the new system, with its own clean model.
3. Refine the Anticorruption Layer to translate between the new model and the legacy system.
4. Deploy both systems in parallel.
5. Once the new implementation is proven, remove that part of the legacy system and shrink the Anticorruption Layer accordingly.
6. Repeat.

The Anticorruption Layer grows as the new system takes on more functionality, then shrinks as the legacy system is retired piece by piece. At no point does the new system need to support the full complexity of the legacy system's model — it only needs to translate for the specific functions being migrated.

"Integration is always expensive, and sometimes the benefit is small." This principle applies to legacy integration. The goal is to minimize the time during which the new system must translate legacy concepts, by shrinking the legacy system's scope as quickly as possible.

## The Strategic Design Imperative

The patterns in strategic design — Bounded Contexts, Context Maps, distillation, large-scale structure — address a failure mode that technical patterns cannot prevent: the failure of coordination across organizational boundaries.

Technical patterns (Entities, Repositories, Factories, Aggregates) solve local problems. A well-designed Aggregate protects invariants within one module. But if two teams develop incompatible models of what an Aggregate's root means, no amount of technical sophistication prevents the failure at integration.

Strategic design requires decisions about:
- Where model boundaries should be drawn
- Which relationships between contexts require translation and which can share a kernel
- Which parts of the domain deserve deep modeling and which should be delegated to patterns or purchased solutions
- What story the system tells at a high level, and whether the code tells that story coherently

These are organizational and architectural decisions, not just technical ones. They require authority — the ability to make commitments about team coordination and model ownership. They require humility — the recognition that maintaining a single unified model across a large organization is often impossible and sometimes counterproductive.

And they require honesty about integration costs. "Integration is always expensive, and sometimes the benefit is small." The discipline to say "these two subsystems should go their separate ways" is as important as the discipline to say "these two models must be reconciled."
```

---

### FILE: deep-models-and-breakthrough-refactoring.md
```markdown
# Deep Models and Breakthrough Refactoring: How Domain Understanding Evolves

## The Nature of Modeling Progress

Most software methodologies assume that understanding a domain is a linear process: you gather requirements, you analyze them, you produce a model, and you implement it. The model produced at the start is essentially the model that will be implemented.

Evans argues that this assumption is wrong in any domain of genuine complexity.

"I cheated, for the sake of brevity. This was not my initial model. I started with something that seemed reasonable, progressed through the steps toward design, found aspects of that model that made design difficult, and then I went back and changed it to make it a better basis for design."

Initial models are always naive. They reflect the domain expert's first attempt to explain a complex system to developers who don't yet understand it, combined with developers' first attempt to structure code around concepts they don't yet understand deeply. The initial model works. It is not wrong, exactly. But it is shallow — it captures the obvious structure without capturing the underlying logic.

"Deep models can emerge gradually through a sequence of small refactorings, an object at a time, an association tweak here, a shifted responsibility there. But they are often shocks."

The deep model is the goal. The path to it is iterative, and the arrival is often sudden.

## The Syndicated Loan Breakthrough

The most complete case study in DDD is the syndicated loan system's breakthrough. It deserves full examination because it illustrates exactly what a deep model breakthrough looks and feels like.

**The initial model** reflected the obvious structure of syndicated lending: a Facility (the loan agreement), Loan Investments (each lender's share), and Loan Adjustments (modifications to shares over time). The model was reasonable. The team could implement it. The system worked.

But problems accumulated:
- Rounding errors appeared mysteriously in payment distributions
- Rules for distributing payments grew complex and hard to reason about
- Requirements changes that seemed minor required changes in unexpected places
- The term "Loan Investment" appeared nowhere in conversations with domain experts

That last observation is a diagnostic signal Evans describes explicitly: "When the users or domain experts use vocabulary that is nowhere in the design, that is a warning sign."

The model had "Loan Investment" as a central concept. Bankers never used this term. They talked about "shares" — a lender's share of a facility, a lender's share of a particular draw, the share of a payment that goes to each lender. Shares, shares everywhere.

**The breakthrough insight**: "Shares, shares everywhere. Shares of a facility, shares of a loan, shares of a payment distribution. Shares of any divisible value."

This was not a technical observation. It was a domain observation. The underlying mathematical reality of syndicated lending is that everything is prorated shares. The initial model had all the data to represent this, but not the concept. The concept was implicit — present in the spreadsheets the bankers used, present in their vocabulary, present in the calculations the code was laboriously performing — but never reified as a domain object.

**The new abstraction**: SharePie — an abstract Value Object representing a prorated distribution among parties.

Two subtypes:
- **PercentPie**: Holds percentages summing to 1.0. Used for facility-level agreements.
- **AmountPie**: Holds dollar amounts derived from a PercentPie by prorating an actual payment.

**What was eliminated**: "Loan Investment" — a term developers invented but bankers never used. The concept was replaced by the Share Pie abstraction, which actually matched how bankers thought.

**What was simplified**: Loan Adjustments were no longer special cases. When shares change, the SharePie for the Loan is directly modified. The adjustment mechanism that required careful special-case handling dissolved.

The payoff was immediate and significant: "Mystifyingly unexpected requirement changes stopped." The team had been implementing features and discovering that small changes in requirements caused large, unexpected changes in code. This is a symptom of a model that doesn't align with the domain's underlying logic. When the model aligns, requirements in the same domain tend to fit naturally.

"Rounding logic stabilized and made sense." The mysterious rounding errors were a consequence of the model performing prorating calculations in scattered, inconsistent ways. When SharePie centralized the prorating logic and made it algebraically closed (prorated() returns a SharePie, plus() returns a SharePie, minus() returns a SharePie), the rounding policy could be applied once, consistently.

SharePie became "ubiquitous language" across business, marketing, and customers. The domain concept that had always been present — the central mathematical reality of syndicated lending — was now visible in the code, in conversations, and in customer documentation.

## The Decision to Refactor

The breakthrough required investment. The project manager asked four hard questions:

1. How long to reach current functionality? **Three weeks.**
2. Could we solve the problems without it? **Probably, but no way to be sure.**
3. Forward movement without it? **Slow, harder once deployed.**
4. Is the new design right? **Yes — simpler, better fit, lower long-term risk.**

Three weeks of heavy refactoring, in the middle of a deadline, for a system that was already working. The project manager authorized it.

This decision illustrates something Evans treats seriously: breakthrough decisions require executive courage and trust. The technical team had to be credible enough that the project manager would accept their assessment of long-term risk. The project manager had to be confident enough in the technical judgment to accept three weeks of apparent backward movement.

"Despite the risk of the change, the project manager decided to authorize it." This is a human moment, not a technical one. The best technical analysis in the world is useless if the organizational context doesn't support acting on it.

## The Implicit Concepts That Hide in Plain Sight

The syndicated loan breakthrough is dramatic. Most modeling progress is quieter — the recognition that a concept the domain uses freely has no corresponding object in the model.

"Many transformations of domain models and the corresponding code take the form of recognizing a concept that has been hinted at, present implicitly, and representing it with one or more explicit objects or relationships in the model."

The Itinerary example from the cargo shipping system illustrates the quieter pattern. The booking application and the operations application both needed to work with cargo routing information. The booking system had a table with cargo ID, vessel voyage, load location, and unload location. The operations system queried the same table and derived its own representation.

Neither system had an object called "Itinerary." But domain experts used the word constantly. Operations staff talked about "the itinerary." Customers asked about "the itinerary." Booking agents created "itineraries."

A developer noticed: "The itinerary is really the link between booking and operations." A domain expert confirmed: "Yes, and some customer relations, too."

**Before the refactoring**: The Routing Service wrote directly to the cargo_bookings table. The booking application printed "itinerary reports" from that table. The operations application queried the same table independently, deriving load and unload times from vessel voyage schedules. The two applications were coupled to the same database schema but had different implicit understandings of what the data meant.

**After the refactoring**: An Itinerary object with Legs. The Routing Service produces an Itinerary, not a table row. The booking application stores the Itinerary via Repository. The operations application retrieves the Itinerary and derives its needed information from it. Reports are derived from the Itinerary object.

Benefits:
1. The Routing Service is decoupled from the database schema — it produces domain objects, not rows.
2. Booking and operations share a common language — both refer to the same Itinerary object.
3. Domain logic (deriving load and unload times from vessel voyage schedules) is centralized in the Itinerary object.
4. The Ubiquitous Language is enriched — "itinerary" is now explicit in the code.

The insight required only recognizing that a concept the domain experts used freely was missing from the code.

## How to Find Implicit Concepts

Evans provides several diagnostic signals for concepts that are present implicitly and should be made explicit.

**Awkward code**: "When operations seem to work on two elements at once, is it because the operation is really primary and the two elements are playing subordinate roles in it? Is there a missing object?"

**Vocabulary mismatches**: "When the users or domain experts use vocabulary that is nowhere in the design, that is a warning sign." Developers and domain experts are speaking different languages. One of those languages is wrong.

**The nightly batch**: Evans shows a team that had a 100-line batch script running nightly, posting accounting entries to a legacy system. The script was entirely procedural. Nobody thought of it as "domain" — it was infrastructure. When a developer applied Analysis Patterns to it, they recognized that the script contained an implicit "Posting Rule" — a domain concept that could be reified as an object with explicit behavior.

The resulting model had Posting Rules that watch input Accounts and post derived entries to output Accounts. The 100-line script became a handful of calls to domain objects. The logic became testable. The ledger mappings became a configuration (a Map from asset class to ledger name) instead of hardcoded strings.

The insight: "This is domain logic. The posting rules from Analysis Patterns apply here." What looked like infrastructure was actually a domain problem being solved procedurally because nobody had modeled it as domain.

## The Role of Analysis Patterns

Evans is careful about how to use published patterns from other domains.

"Analysis Patterns can be particularly helpful in showing us these blind spots."

Published pattern catalogs (Martin Fowler's Analysis Patterns being the primary example Evans uses) document solutions that experienced developers have found for common modeling problems. They provide vocabulary and direction.

But they are not recipes. The Posting Rules pattern from accounting does not map directly to a loan system. The team had to understand:
- Which aspects of the pattern apply to their domain
- Which aspects need modification
- Which assumptions the pattern makes that don't hold in their context

The team debated where to attach the Posting Rules. In the canonical pattern, rules are attached to Accounts. In their system, the Asset was the natural access point (the batch script started with Assets) and the Asset owned knowledge of which accounts (fee, interest) to use. So rules were attached to the Asset via singleton access, not to the Account.

"Pragmatic deviations from pattern are acceptable if they're visible and discussed." The important thing is that the deviation is conscious and understood, not accidental.

## The Accounting Model Refactoring in Detail

The accounting model refactoring in the loan system shows the step-by-step process of making implicit concepts explicit.

**Initial state**: An `interestDueAmount` field on a Loan object. The Interest Calculator modified this field directly. Payments also modified it. There was no audit trail of individual accruals versus payments.

**The problem discovered**: The domain experts talked about "accruals" and "payments" as distinct operations. The code had only one concept: a single field that both modified. When domain experts asked "What accruals have been posted for this loan?", there was no answer — the individual accruals had been lost.

**Pattern recognition**: A developer read Analysis Patterns Chapter 6 and found the Account model with Entries — a pattern where individual transactions are preserved as immutable records, and balances are computed by summing all entries. Entries are never removed.

**Team discussion** produced a critical insight: the domain expert clarified that accruals and payments are *not* paired in accounting — they are separate postings. A debit for accrued interest and a payment against that interest are independent entries, not a matched pair. The Transaction concept from some accounting models would be wrong here.

**Refactored model**:
```
Account
  ├─ Entry (abstract)
  │  ├─ Accrual
  │  │  ├─ Interest Accrual
  │  │  └─ Fee Accrual
  │  └─ Payment
  │     ├─ Interest Payment
  │     └─ Fee Payment
  └─ balance() → computed from all entries
```

**What changed**: The word "accrual" now exists in the code, matching the domain expert's vocabulary. Individual accruals are preserved, enabling audit trails. The balance is computed from the full history, not mutated by each transaction. The Interest Calculator no longer directly mutates the loan balance — it creates Accrual entries.

**What simplified**: The Interest Calculator's logic became a side-effect-free function — given a Loan and a date range, it returns Accrual entries. No mutation. Testable in isolation. The mutation is deferred to the Account when accruals are posted.

This is the pattern of making implicit concepts explicit applied at the accounting level: recognizing that "accrual" was a real domain concept being represented as a mutation to a number, and reifying it as a proper domain object.

## Deep Models and the Modeling Process

Evans is honest about the process that produces deep models.

"Modeling is as inherently unstructured as any exploration."

There is no reliable algorithm for discovering the right model. There are heuristics — listen for vocabulary mismatches, watch for awkward code, scrutinize operations that work on two elements simultaneously, look for concepts used freely in conversation that have no code representation. But these are signals, not solutions. The solution requires creative insight.

What can be cultivated is the *practice* of recognizing these signals and responding to them. Teams that develop the habit of asking "Is there a missing concept here?" consistently produce deeper models than teams that assume the initial model is correct.

The other essential practice: having domain experts present not just for requirements gathering, but for the ongoing work of model refinement. The Accrual insight came from a discussion with a domain expert. The Itinerary insight came from a conversation. The SharePie breakthrough happened in an intense collaboration between developers and bankers.

"When a modeler is separated from the implementation process, he or she never acquires, or quickly loses, a feel for the constraints of implementation."

The people doing the modeling must be the people doing the implementation. Not because implementation is simple, but because the feedback loop between modeling and implementation is where deep models are forged. A model that cannot be implemented cleanly is wrong. An implementation that cannot be explained in domain terms is wrong. The tension between these two requirements, held by people who understand both, is what produces deep models.

## What a Deep Model Feels Like

The markers that a breakthrough has occurred:

**Vocabulary alignment**: Domain experts recognize themselves in the code. When they read class names and method names, they see concepts they use in their daily work.

**Unexpected stability**: Requirements changes that previously caused widespread code changes now fit naturally in one place. The model's structure and the domain's structure are aligned, so changes in the domain correspond to local changes in the model.

**Evaporating complexity**: "Versatility and explanatory power suddenly increase even as complexity evaporates." Code that was complex because it was fighting the model becomes simple when the model is right.

**Resolved mysteries**: Unexplained edge cases, mysterious bugs, rules that didn't quite fit — these often resolve when the right model is found. The SharePie breakthrough resolved the mysterious rounding errors. The correct model makes previously inexplicable behavior explicable.

**Emerging insight**: Domain experts often learn something about their own domain when a deep model is found. The SharePie abstraction was not just a software concept — it clarified the underlying mathematics that bankers had been applying intuitively for years. When bankers saw the SharePie, they recognized it as expressing something true about syndicated lending that they had never articulated explicitly.

This last point is remarkable. The software modeling process can produce domain insight, not just domain representation. This is what Evans means when he says the model must be "jointly developed by domain experts and developers." Domain experts bring knowledge of the domain. Developers bring the discipline of making structure explicit. The synthesis produces understanding that neither could reach alone.
```

---

### FILE: services-modules-and-layered-architecture.md
```markdown
# Services, Modules, and the Layered Architecture: Organizing Complexity Without Losing the Model

## The Isolation Problem

The most common failure mode in software architecture is not poor algorithms or slow databases — it is the loss of domain logic visibility. Business rules become distributed across user interface handlers, database queries, transaction scripts, and utility classes. To understand what the system does when a customer submits a payment, you must trace through UI handlers, application services, stored procedures, and infrastructure utilities, gradually assembling the business logic from scattered fragments.

When domain logic is diffused this way, Model-Driven Design becomes impossible. You cannot maintain a model of the domain because the domain logic does not exist in one place — it is smeared across all the technical concerns simultaneously.

Evans' response is the Layered Architecture: a structural commitment to keeping domain logic concentrated in one place, isolated from infrastructure concerns, so that the model remains visible and maintainable.

## The Layered Architecture

"Concentrate all the code related to the domain model in one layer and isolate it from the user interface, application, and infrastructure code."

Four layers, each with a distinct responsibility:

**User Interface Layer** (or Presentation Layer): Displays information and interprets user commands. Thin. No business logic. Delegates all meaningful work to the Application Layer.

**Application Layer**: "Thin" — it coordinates tasks but contains no business rules or domain knowledge. Application services orchestrate domain objects and infrastructure services to accomplish user goals. They are responsible for what gets done, not how the domain works.

**Domain Layer**: Contains all business rules, domain concepts, and state that reflects the business situation. This is where the Model lives. This layer is deliberately isolated from infrastructure. It should be possible to test the entire Domain Layer without a database, without a network, without any external dependency.

**Infrastructure Layer**: Provides technical capabilities: persistence, messaging, email, external service calls. Supports all three higher layers but knows nothing about the domain.

"The part of the software that specifically solves problems from the domain usually constitutes only a small portion of the software of a system, although its importance is disproportionate to its size."

The paradox: domain logic is a small fraction of total code, but it is the reason the software exists. Infrastructure code is large but generic. The Layered Architecture reflects this priority — it creates the conditions for the domain layer to be the focus of design effort, even though it is numerically small.

## Why the Application Layer Must Be Thin

The Application Layer is one of the most commonly misunderstood elements of DDD architecture. Developers frequently expand it, treating it as the appropriate location for business logic that seems "too complex" for the domain layer.

This is always wrong. Business logic in the Application Layer is business logic that is invisible to the model — it exists outside the place where domain experts and developers converge. It cannot be expressed in domain terms. It cannot be understood by domain experts reading the code. It bypasses all the invariant protection that Aggregates provide.

The Application Layer's legitimate responsibilities:
- Loading and saving Aggregate roots via Repositories
- Coordinating between multiple domain services
- Publishing events (domain events that infrastructure will distribute)
- Transaction demarcation (beginning and committing transactions)
- Input validation at the application level (checking that required parameters are present, formats are correct — but not applying business rules about the values)

Business rules — "a payment cannot be recorded without a corresponding debit," "a cargo's itinerary must satisfy its route specification," "an order total cannot exceed the approved limit" — belong in the Domain Layer, on domain objects, enforced by Aggregate invariants.

## Services: When Domain Operations Don't Belong to Objects

The object-oriented intuition is that all behavior should belong to an object. But some domain operations don't naturally belong to any entity or value object.

Consider funds transfer between bank accounts. The operation is meaningful — it has business rules (debit one account, credit another, maintain the invariant that every debit has a corresponding credit). But where does it live? 

Putting it on the Account class is awkward. `account.transferFundsTo(otherAccount, amount)` puts one account in charge of an operation that involves two accounts and global rules. The Account class becomes responsible for understanding the rules of fund transfers, not just the rules of its own balance.

Creating a `FundsTransfer` object as an Entity feels forced. A FundsTransfer is not a thing with identity that persists — it's an operation.

The Service pattern resolves this: "A SERVICE is an operation offered as an interface that stands alone in the model, without encapsulating state as ENTITIES and VALUE OBJECTS do."

Three properties identify a genuine domain Service:
1. The operation relates to a domain concept that is not naturally part of any Entity or Value Object.
2. The interface is defined in terms of other domain model elements.
3. The operation is stateless — any client can use any instance, and the service holds no domain state between calls.

Services exist at multiple layers, and the distinctions matter:

**Domain Services** embed significant business rules. A `FundsTransferService` that enforces the debit-credit invariant is a Domain Service. A `ShippingCostCalculator` that applies complex rate tables is a Domain Service. They are part of the model.

**Application Services** orchestrate. A `FundsTransferApplicationService` loads the accounts from Repositories, calls the Domain Service, persists the results, and publishes an event. It contains no business rules — it is pure coordination.

**Infrastructure Services** provide technical capabilities. An `EmailNotificationService` sends emails. A `PdfGenerationService` produces documents. These exist in the infrastructure layer.

The distinction is not always obvious in practice. The test: could a domain expert understand the service's purpose by reading its interface? If yes, it probably belongs in the Domain Layer. If it requires knowledge of technical infrastructure (how emails work, how PDFs are generated), it belongs in the Infrastructure Layer.

## The Online Banking Example: Layers in Action

The funds transfer scenario makes the layering concrete.

**Without layers**: The UI handler receives form input, opens a database connection, reads two accounts, updates both account balances, checks that the debit equals the credit, commits the transaction, and returns a success message. Everything is in one place. The business rule ("every credit has a matching debit") is buried in the UI handler.

**With layers**:

1. **UI Layer**: The `TransferController` reads user input (from-account, to-account, amount), validates format, calls `FundsTransferApplicationService.transfer(fromId, toId, amount)`.

2. **Application Layer**: `FundsTransferApplicationService` loads Account objects via Repository, calls `FundsTransferService.transfer(fromAccount, toAccount, amount)`, commits the transaction.

3. **Domain Layer**: `FundsTransferService` calls `fromAccount.debit(amount)` and `toAccount.credit(amount)`. The Account class enforces its own invariants (balance cannot go below zero for a checking account, etc.). The debit-credit pair is enforced by the Service.

4. **Infrastructure Layer**: The Repository handles persistence. The transaction manager handles commit. The database handles locking.

The business rule ("every credit has a matching debit") lives in the Domain Service. It is expressed in domain terms. It can be read and validated by domain experts. It is tested in isolation from UI and infrastructure. It enforces the invariant regardless of how the call reaches it — web UI, API, batch process, or test.

## Modules: Chapters in the Model's Story

"MODULES are a communications mechanism. The meaning of the objects being divided needs to drive the choice of MODULES. When you place some classes together in a MODULE, you are telling the next developer who looks at your design to think about them together. If your model is telling a story, the MODULES are chapters."

This framing is crucial. Modules are not just technical organization — they are part of the model itself. They communicate what belongs together and how the model is divided.

The consequences of this framing:

**Module names enter the Ubiquitous Language.** "Let's look at the customer module" is a statement about the domain, not just about code organization. Module names should be domain terms, not technical terms.

**Infrastructure-driven packaging destroys the model.** Evans offers a devastating example: J2EE projects that split every domain concept across entity beans, session beans, and data access objects. A single conceptual object is spread across three packages. To understand "Cargo," you must look in `entity.Cargo`, `session.CargoManager`, and `dao.CargoDAO`. The multiplicity of packages uses up all the mental capacity available for chunking, leaving none for the model.

"There is only so much partitioning a mind can stitch back together, and if the framework uses it all up, the domain developers lose their ability to chunk the model into meaningful pieces."

**The packaging principle**: Keep conceptual objects together. If a domain concept requires an entity bean, a session bean, and a DAO, keep all three in the same package. The packaging reveals the domain concept, not the technical layer.

**Module cohesion and coupling**: High cohesion within modules (things that belong together, conceptually), low coupling between modules (modules can be understood independently). This is not a technical recommendation — it is a domain recommendation. The test of cohesion is conceptual, not functional: do these things belong together in the model's story?

## The Challenge of Module Refactoring

Evans acknowledges a structural problem with modules: they tend to fossilize.

"MODULES tend to be chosen to organize an early form of the objects. After that, the objects tend to change in ways that keep it in the bounds of the existing module definition... Refactoring modules is typically more work and disruption than refactoring classes."

The early module structure reflects early understanding of the domain. As understanding deepens — as the model evolves, as new concepts emerge, as the Core Domain is clarified — the module structure often becomes wrong. Concepts that seemed related at the start belong in different parts of the domain. New concepts that emerged through modeling don't fit neatly into existing modules.

Refactoring classes is local work: rename a class, change a method signature, extract a concept. Refactoring modules has organizational consequences: team assignments change, build scripts change, import statements throughout the codebase change, version control history becomes harder to follow.

Evans offers tactical mitigation (in Java, import the full package rather than individual classes, so that module renaming only requires changing import statements in one place) but acknowledges that no purely technical solution exists. Module refactoring requires organizational will.

The deeper lesson: get module structure right early by starting from domain understanding, not from technical convenience. Ask "What is the story the model tells, and what are its chapters?" before asking "What packages does the framework expect?"

## The Infrastructure-Domain Boundary in Practice

The Layered Architecture requires a strict rule: the Domain Layer must not depend on the Infrastructure Layer. Domain objects must not contain database calls, network requests, or file system operations.

This creates a practical challenge: how do domain objects persist themselves? How do they find related objects?

The answer is inversion of control. Domain objects define interfaces (Repositories, Publishers) that the Infrastructure Layer implements. The Domain Layer depends on the *interface*, not the *implementation*. The Infrastructure Layer provides the implementation at runtime.

This inversion is what makes the Domain Layer testable in isolation. In tests, substitute an in-memory implementation of the Repository interface. The domain objects work identically — they call `repository.findById(id)` — but the "database" is just a HashMap in memory.

The isolation is not just for testability. It is the mechanical expression of the priority hierarchy: domain logic is primary; infrastructure is secondary. Domain objects define what they need (a way to find Cargos by tracking ID). Infrastructure provides it. If the infrastructure implementation changes (new database, different ORM), the domain objects are untouched.

## Recognizing Architecture Violations

Over time, layering discipline erodes. Business logic accumulates in Application Services. Repositories start containing business logic. Domain objects take on infrastructure dependencies "just this once" for convenience.

The warning signs:
- Application Service methods that are long and complex, containing conditional logic about business rules
- Domain objects with @Autowired dependencies on infrastructure services
- Repository methods that encode business filtering logic (finding "eligible" customers rather than "all customers with status=ACTIVE AND credit_score > 700")
- Tests that require a real database to verify business logic

Each of these indicates that the Domain Layer has leaked. The model is no longer contained. When the domain is diffused, the Ubiquitous Language cannot be maintained — there is no single place where the model lives, so no single place where domain experts can read and validate it.

The response is not to rewrite — it is to incrementally extract. Move business logic from Application Services to domain objects or domain services. Extract infrastructure calls from domain objects behind interfaces. Move business filtering from Repositories to domain specifications that can be translated into queries.

The goal is always the same: domain logic in the Domain Layer, visible, isolated, and expressed in the language of the domain.
```

---

### FILE: knowledge-crunching-and-collaborative-modeling.md
```markdown
# Knowledge Crunching and Collaborative Modeling: How Understanding Becomes Software

## The Central Problem of Domain Knowledge

Software development has a knowledge problem that is rarely discussed directly. The people who understand the business domain deeply — domain experts, senior practitioners, experienced users — are not the people who write the code. The people who write the code do not understand the domain deeply when they start. Somehow, knowledge must transfer from the domain experts to the codebase.

Most software methodologies treat this as a communication problem: gather requirements, write specifications, review them with domain experts, then implement. But Evans argues that this process consistently fails because requirements gathering is a lossy compression of domain knowledge.

"Effective domain modelers are knowledge crunchers. They take a torrent of information and probe for the relevant trod."

Knowledge crunching is not requirements gathering. It is an active, iterative, collaborative process in which developers and domain experts build shared understanding together — not by transferring knowledge from expert to developer, but by jointly constructing a model that captures both the expert's domain knowledge and the developer's understanding of what can be implemented.

## What Knowledge Crunching Looks Like

Evans describes the process with specificity. It begins with conversation — domain experts explaining how they think about the domain, developers probing with questions. But unlike requirements gathering, the conversation does not end with a specification document. It continues through implementation.

The key discipline: "As they develop their model, the team will distill, augment, and refine. Early on, the model is rough, then it grows more specific, then more abstract still."

An initial conversation might produce a rough object model. The developers implement a prototype. They bring it back to the domain expert. The domain expert notices that the implementation doesn't quite match how they actually think about the domain. The model is revised. The implementation is revised. The conversation continues.

This cycle is not a waterfall with feedback — it is genuine co-evolution. The model changes not just because requirements change, but because understanding deepens. What the domain expert said in the first conversation was true, but incomplete. Implementation revealed what was missing. Revision of the implementation revealed what the model needed that neither party had articulated.

"The model is never done. It will continue to be refined and improved throughout the life of the software."

## The Ubiquitous Language as Knowledge Crystallization

The first visible product of knowledge crunching is the Ubiquitous Language. When domain experts and developers have been working together effectively, you can observe it: they use the same words for the same concepts, without translation, in conversations, in code, and in documentation.

The absence of a Ubiquitous Language is itself diagnostic. When developers have to mentally translate between what domain experts say and what the code does, knowledge crunching has been insufficient. The model has not yet crystallized the shared understanding.

Evans offers a concrete example from cargo shipping. Developers initially used terms like "cargo booking" and "route parameters." Domain experts talked about "bookings," "route specifications," and "itineraries." The mismatch