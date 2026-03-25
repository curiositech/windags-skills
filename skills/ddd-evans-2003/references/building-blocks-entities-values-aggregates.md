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