# Event Calculus as Operational Time and Action Model: Making Temporal Reasoning Executable

## Why BDI Agents Need Temporal Reasoning

Beliefs, desires, and intentions are fundamentally temporal: "I desire that property P holds *at time T*." "I intend to execute action A *at time T*." "I believe property P initiated *at T1* and persisted *until T2*." Without temporal reasoning, an agent can't represent durative goals, reason about action consequences over time, or detect when commitments are obsolete.

But temporal reasoning is notoriously complex. Temporal logics (LTL, CTL, interval logics) are expressive but often undecidable or computationally expensive. Planning formalisms (STRIPS, PDDL) handle time but are specialized for planning, not general reasoning.

Móra et al. solve this by adopting the *Event Calculus* (EC), a logic programming formalism for time and actions. Their key insight: "When we reason about pro-attitudes like desires and intentions, we need to deal with properties that should hold at an instant of time and with actions that should be executed at a certain time. Therefore... we need to have a logical formalism that deals with actions and time" (p. 15).

The EC provides exactly this: A declarative specification of how actions initiate/terminate properties, how properties persist over time, and how to query what holds when. Crucially, EC has *operational semantics*—it's executable through logic programming, not just a specification language.

## The Event Calculus: Core Predicates

The version used in the paper (a modification of Kowalski & Sergot's original EC) has five main predicates:

**happens(E, Ti, Tf)**: Event E occurs from time Ti to time Tf  
Events have *duration* (not instantaneous). E is an event identifier (allows multiple occurrences of same action type).

**act(E, A)**: Event E is an execution of action A  
Links events to action types. The same action can have multiple events: happens(e1, 0, 5), happens(e2, 10, 15), act(e1, move), act(e2, move) — two move actions at different times.

**initiates(E, T, P)**: Event E initiates property P at time T  
After E occurs, P becomes true (if it wasn't already). T is typically the end time of E (effects take hold after action completes).

**terminates(E, T, P)**: Event E terminates property P at time T  
After E occurs, P becomes false (if it was true).

**holds_at(P, T)**: Property P holds at time T  
The query predicate—does P hold at a given time? This is defined in terms of initiates/terminates/happens.

The EC axioms (p. 15) define holds_at using these predicates:

```
holds_at(P, T) ← 
    happens(E, Ti, Tf),
    initiates(E, TP, P),
    TP < T,
    TP >= Ti,
    persists(TP, P, T).

persists(TP, P, T) ← 
    not clipped(TP, P, T).

clipped(TP, P, T) ← 
    happens(C, Tci, Tcf),
    terminates(C, TC, P),
    TC >= Tci,
    not out(TC, TP, T).

out(TC, TP, T) ← 
    (T ≤ TC); (TC < TP).
```

Translation: Property P holds at time T if there's an earlier event that initiated P, and P wasn't clipped (terminated by another event) between initiation and T.

## Example: Warehouse Robot Actions

From Example 5 (p. 18-19), the robot's action model:

**Charging Initiates Battery Charged**:
```
initiates(E, Tf, bel(rbt, bat_charged)) ← 
    happens(E, Ti, Tf),
    act(E, charge).
```
When a charge action completes (at Tf), property bel(rbt, bat_charged) becomes true.

**Low Battery Terminates Battery Charged**:
```
terminates(E, T, bel(rbt, bat_charged)) ← 
    happens(E, T, T),
    act(E, sense_low_bat).
```
A sense_low_bat event (instantaneous, Ti = Tf = T) terminates the bat_charged property.

**Storing Initiates Stored**:
```
initiates(E, Tf, bel(rbt, stored(O))) ← 
    happens(E, Ti, Tf),
    act(E, store(O)).
```

**Input Events**:
```
happens(e, t, t).
act(e, input(o)).
```
An input event occurred at time t (object o placed on input counter).

Query: "holds_at(bel(rbt, stored(o)), 10)?" — Is object o stored at time 10?

Reasoning:
1. Was there an event initiating stored(o) before time 10? 
2. If so, was it clipped (terminated) before 10?
3. If initiated and not clipped, then yes.

This reasoning is *automatic*—query the EC program, get an answer.

## Explicit vs. Implicit Negation for Properties

The paper introduces a subtle but important distinction (p. 15):

```
holds_at(¬P, T) ← ¬holds_at(P, T).
¬holds_at(P, T) ← not holds_at(P, T).