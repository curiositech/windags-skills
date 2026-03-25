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