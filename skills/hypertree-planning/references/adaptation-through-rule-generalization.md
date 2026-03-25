# Adaptation Through Rule Generalization: Beyond Example-Driven Learning

## The Generalization Problem in Agent Systems

A fundamental challenge for intelligent agent systems: **how do you enable behavior that generalizes across problem instances without requiring per-instance human intervention?** The HyperTree Planning paper demonstrates that rule-based decomposition achieves dramatically better generalization than example-based approaches, with implications for how we build adaptable orchestration systems.

The empirical evidence from TravelPlanner is striking. Using the same backbone model (GPT-4o):
- **One-shot learning** (single example provided): 3.9% success
- **HTP** (rule-based, no examples): 20.0% success
- **5.1× improvement from structural approach**

More importantly, the same rules handle:
- 3-day trips with 2 cities: 55-60% success
- 5-day trips with 3 cities: 35-45% success  
- 7-day trips with 4 cities: 25-35% success

The rules generalize perfectly within the domain despite wide variance in problem complexity (2× difference in trip duration, 2× difference in cities visited, 3× difference in reasoning steps required).

## What Makes Rules Generalize

Rules generalize because they encode **invariant structure** rather than specific instances. Compare:

**Example-based knowledge**:
```
Query: "Plan a 3-day trip from San Jose to Los Angeles with $500 budget"

Answer: 
Day 1: Fly San Jose→LA (Flight AA123, $89)
       Stay at Hotel X ($120/night)
       Dinner at Restaurant Y ($25)
Day 2: Visit Santa Monica Pier
       Lunch at Restaurant Z ($15)
       Dinner at Restaurant W ($30)
Day 3: Return to San Jose (Flight AA456, $95)
```

This example contains:
- **Instance-specific content**: Specific cities, flights, hotels, restaurants
- **Implicit structure**: The pattern of flight→hotel→activities
- **Fixed complexity**: Exactly 3 days, 2 cities, 4 meals planned
- **Concrete values**: Specific prices, flight numbers, names

**Rule-based knowledge**:
```
[Plan] → [Transportation][Accommodation][Attraction][Dining]

[Transportation] → {{Specific segments}}
    [segment] → [Self-driving][Taxi][Flight]
        [mode] → [availability][preference][cost][non-conflicting]

[Accommodation] → {{Specific locations}}
    [location] → [cost][house rule][room type][minimum stay]

[Attraction] → {{Specific locations}}

[Dining] → {{Specific locations}}
    [location] → [cuisine][cost]
```

This rule set contains:
- **Domain-general structure**: Applies to any travel planning problem
- **Explicit patterns**: The decomposition strategy is formalized
- **Variable complexity**: {{notation}} indicates variable number of instances
- **Abstract categories**: Types of concerns, not specific values

The key difference: **rules abstract away from instance details while preserving structural relationships**. The rule doesn't specify "Plan must include Santa Monica Pier" (specific) but rather "Plan must include attractions at each visited location" (general).

## The Mechanics of Rule Application

The top-down hypertree construction algorithm (Algorithm 1) shows how rules enable generalization. For a 3-day, 2-city trip:

```
Apply: [Plan] → [Transportation][Accommodation][Attraction][Dining]
Apply: [Transportation] → {{Segments}}
    Instantiate: 2 cities → 2 segments (City1→City2, City2→City1)
Apply: [segment City1→City2] → [Self-driving][Taxi][Flight]
Apply: [Flight] → [availability][preference][cost]
```

For a 7-day, 4-city trip:

```
Apply: [Plan] → [Transportation][Accommodation][Attraction][Dining]
Apply: [Transportation] → {{Segments}}
    Instantiate: 4 cities → 4 segments (C1→C2, C2→C3, C3→C4, C4→C1)
Apply: [segment C1→C2] → [Self-driving][Taxi][Flight]
Apply: [Flight] → [availability][preference][cost]
```

**The same rule `[Transportation] → {{Segments}}`** produces different structures (2 segments vs. 4 segments) based on the query context. This is true generalization—the rule doesn't contain a fixed structure but a **template for generating problem-specific structures**.

The {{notation}} is crucial. It represents **variable multiplicity**: the rule specifies that there will be multiple segments, but doesn't fix the number. The actual number emerges from query analysis.

## Why Examples Fail to Generalize

The paper's comparison with one-shot learning (3.9% success) and HiAR-ICL (6.7% success) reveals why example-based approaches struggle:

**Problem 1: Structural Mismatch**
If your example shows a 3-day, 2-city trip but the query asks for a 7-day, 4-city trip, the model must:
1. Recognize the structural pattern in the example (day-by-day itinerary with flights between cities)
2. Abstract away instance-specific details (San Jose, Los Angeles, specific flights)
3. Scale the structure (from 3 days to 7, from 2 cities to 4)
4. Maintain constraint handling (budget across more segments)

This multi-step abstraction is error-prone. The model might:
- Copy the 3-day structure for a 7-day trip (incomplete)
- Repeat the same pattern without adapting (naive scaling)
- Miss the constraint handling pattern (budget tracking breaks down)

**Problem 2: Implicit vs. Explicit Structure**
Examples contain implicit structure that must be induced. Looking at the example itinerary, the model must infer:
- "Ah, I see transportation happens at day transitions"
- "Accommodation is specified at the end of each day"
- "Meals are distributed throughout the day"

This inference is unreliable, especially when examples are complex. The paper notes: "The discrepancy between the example and the actual query remains a fundamentally unresolved challenge."

**Problem 3: Example-Query Distance**
As the query diverges from the example, performance degrades. The paper shows (Figure 4) that baseline methods' success rates drop dramatically as trip duration increases from 3 to 7 days (often to 0%), while HTP maintains 25-35% success on 7-day trips.

This suggests example-based learning exhibits **distance-dependent generalization**: performance degrades with query-example dissimilarity. Rule-based learning exhibits **distance-independent generalization**: performance depends on problem complexity, not similarity to training data.

## Multi-Level Abstraction in Rules

The rule hierarchy itself represents multiple levels of abstraction:

**Level 0: Domain Structure** (Most abstract)
```
[Problem] → [Major Concerns]
```
Applies across problem domains (not just travel planning).

**Level 1: Category Decomposition**
```
[Plan] → [Transportation][Accommodation][Attraction][Dining]
```
Travel-specific but instance-independent.

**Level 2: Instance Enumeration**  
```
[Transportation] → {{Segments}}
```
Creates instance-specific structure from query context.

**Level 3: Option Exploration**
```
[Segment] → [Self-driving][Taxi][Flight]
```
Domain knowledge about available options.

**Level 4: Constraint Application**
```
[Flight] → [availability][preference][cost][non-conflicting]
```
Atomic concerns that must be evaluated.

Each level applies **context-appropriate abstraction**. Level 1 doesn't need to know how many cities are involved. Level 2 doesn't need to know about specific constraints. This hierarchical abstraction prevents cognitive overload and enables compositional reasoning.

For agent systems with 180+ skills, this suggests organizing skills into **abstraction hierarchies** rather than flat lists: