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