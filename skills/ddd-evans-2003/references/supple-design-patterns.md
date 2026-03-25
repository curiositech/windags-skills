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