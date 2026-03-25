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