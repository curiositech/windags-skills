# Generalization and Discrimination: The Core Competency That Makes Expertise Transferable

## The Two Faces of Pattern Recognition

At the heart of incident command expertise — and, by extension, at the heart of any intelligent system that must apply learned knowledge to new situations — lies a pair of complementary cognitive skills that Njå and Rake identify as the fundamental measure of competence:

> "Personnel (P) must be able to recognise typical signs (cues, characteristics) of the situations (S) and respond with determined behaviour (B). The personnel must also be able to evaluate the consequences (C) of their own behaviour and recognise whether it is effective or not. The level of expertise could be assessed in terms of one's ability to generalise situations with similar characteristics.
>
> Discrimination is the opposite of generalisation. The personnel must be able to distinguish between situations that require different behaviour. The balance between discrimination and generalisation represents emergency management's philosophy regarding the behaviour flexibility of their emergency response organisations." (Njå & Rake, p. 8)

This framework — the S → P → B → C loop, governed by generalization and discrimination — is deceptively simple. It is also one of the most useful lenses available for evaluating an intelligent system's actual capability versus its apparent capability.

## Generalization: The Engine of Efficiency

Generalization is the ability to recognize that *this new situation is sufficiently similar to known situations* that a known response will work. Generalization is what enables expertise to scale: rather than treating every incident as entirely novel, the experienced commander draws on a library of past cases and applies responses that have worked before.

Without generalization, every problem is a KB-level problem. Every task requires full deliberation. The system cannot benefit from experience because it never recognizes anything as familiar.

The pathology of *under-generalization* looks like:
- Excessive escalation to human oversight for problems the system has encountered many times before
- Slow, uncertain responses to routine problems
- Failure to build on past successes
- Inability to work at speed

In WinDAGs terms, under-generalization means that the KB layer is being invoked for tasks that should be handled by the RB or SB layer. The system is sophisticated but slow, and its sophistication is being wasted on problems that don't require it.

## Discrimination: The Guard Against Misapplication

Discrimination is the ability to recognize that *this new situation, despite superficial similarities to known cases, is different in ways that matter*. Discrimination prevents the misapplication of solutions to situations they don't fit.

Without discrimination, the system applies well-learned responses to situations where those responses are wrong. It does so with confidence, because the situation looks familiar. This is the most dangerous failure mode in an expert system.

The pathology of *under-discrimination* looks like:
- Applying a solution designed for situation type A to situation type B because they share surface features
- Proceeding confidently when caution is required
- Missing the "this time it's different" signal
- Producing errors that are difficult to catch because they are generated with high confidence

In WinDAGs terms, under-discrimination means that the pattern-matching layer is accepting situations as familiar when they are actually outside the boundary of applicability. The SB or RB layer activates when KB engagement was needed.

## The Balance Between Them

Njå and Rake frame the generalization-discrimination balance as a *design philosophy* for emergency response organizations. The same framing applies directly to agent system design.

An organization (or system) that favors **high generalization / low discrimination** is:
- Fast and efficient in routine situations
- Brittle and error-prone in novel situations
- Likely to miss important contextual differences
- Good for high-volume, low-novelty tasks

An organization that favors **high discrimination / low generalization** is:
- Careful and accurate in recognizing differences
- Slow and resource-intensive even in routine situations
- Unlikely to benefit from accumulated experience
- Good for high-novelty, high-stakes tasks where errors are very costly

The right balance depends on the distribution of situations the system will encounter. A system that handles a known, well-characterized problem domain should be tuned toward generalization. A system that handles novel, open-ended problems should be tuned toward discrimination. Most real systems need both — and they need the meta-competency of knowing which to apply.

## Implementing Generalization-Discrimination in Agent Systems

### Explicit Similarity Scoring

Every time an agent recognizes a situation as belonging to a known pattern, it should produce:
1. A **similarity score**: how closely does this situation match the canonical pattern? (0.0 = no match, 1.0 = perfect match)
2. A **feature list of differences**: what features of this situation differ from the canonical pattern?
3. A **materiality assessment**: are any of the differences likely to affect the validity of the canonical response?

Only if the similarity score is above threshold *and* no material differences are identified should the system proceed with the canonical response. If material differences are found, the system should either escalate to KB reasoning or explicitly modify the response to account for those differences.

### Boundary Conditions for Every Pattern

Every pattern in the agent's library should carry explicit boundary conditions: the range of situations over which it is valid. These conditions should be stated as features, not outcomes.

Example structure for a pattern entry: