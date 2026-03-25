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