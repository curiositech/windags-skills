# The Gap Between Knowing and Proving: Conjectures Precede Their Justifications

## The Historical Paradox

Euler noticed the pattern V-E+F=2 in 1750. He was confident it was true. He could not prove it. The proof came sixty years later from Cauchy. Between the noticing and the proving, mathematicians used the formula, tested it, built on it — and could not, when pressed, give a rigorous justification for it.

This historical sequence — conjecture first, proof later, often *much* later — is not an anomaly. It is the normal structure of mathematical knowledge, and Lakatos documents it with extensive footnotes tracing this pattern across centuries of mathematical history. Gauss: "I have had my results for a long time; but I do not yet know how I am to arrive at them." Riemann: "If only I had the theorems! Then I should find the proofs easily enough." Chrysippus to Cleanthes: "Just send me the theorems, then I shall find the proofs."

The pattern is universal enough that Lakatos quotes an ancient Greek source: "According to Proclus, 'it is necessary to know beforehand what is sought'... The heuristic precedence of the result over the argument, of the theorem over the proof, has deep roots in mathematical folklore." (p. 10, footnote 2)

This is the gap between knowing and proving: you can *know* something — in the sense of having a reliable, well-tested, practically effective belief — without being able to prove it. And conversely, you can *prove* something — in the sense of constructing a formally valid argument — while not yet fully understanding what you've proved or why it's true.

## What This Gap Reveals About the Structure of Knowledge

The standard epistemological picture treats justification as the route to knowledge: you believe X; you have good reasons for X; therefore you know X. The gap Lakatos identifies suggests this picture is backwards, at least for difficult knowledge at the frontier. The sequence is:

1. **Pattern recognition**: You notice V-E+F=2 holds for many cases. You begin to believe it generally.
2. **Conjecture**: You commit to the general claim, beyond what the evidence strictly warrants.
3. **Testing**: You look for counterexamples, test consequences, build on the conjecture in further work.
4. **Proof-attempt**: You try to construct an argument that would justify the conjecture — which reveals its hidden structure.
5. **Counterexamples to the proof**: You discover the proof depends on assumptions that are false in some cases.
6. **Concept revision**: You revise the concepts and the conjecture to accurately characterize the domain.
7. **Mature theorem**: You arrive at a claim you can now prove — but it is a different, more precise claim than you started with.

Justification (the proof) comes near the *end* of this process, not the beginning. And the proof that emerges is not a justification of the original conjecture but of a *revised and enriched* version that the proof process itself helped create.

The Teacher makes this explicit:

> "That conjectures (or theorems) precede proofs in the heuristic order was a commonplace for ancient mathematicians. This followed from the heuristic precedence of 'analysis' over 'synthesis'. The Greeks did not think much of propositions which they happened to hit upon in the deductive direction without having previously guessed them. They called them porisms, corollaries, incidental results springing from the proof of a theorem or the solution of a problem, results not directly sought but appearing, as it were, by chance, without any additional labour." (p. 10, footnote 2)

The Greeks had a name for results discovered accidentally through proof (porisms) and *distinguished them from* results that were first conjectured and then proved. The conjecture-first route was considered the more intellectually dignified one — because it required genuine understanding, not just the mechanical operation of a proof technique.

## The Practical Sufficiency of Unproved Conjectures

One of the most practically important observations in Lakatos is implicit rather than explicit: **unproved conjectures are often perfectly adequate for practical use**. Euler could not prove V-E+F=2, but he used it to classify polyhedra, derive further results, and advance mathematical understanding. The formula worked. The lack of a proof was a theoretical embarrassment, not a practical obstacle.

This is not an argument for recklessness — Euler's use of the formula was careful and appropriately hedged, and he actively sought a proof. But it is an argument against the view that a claim must be proved before it can be responsibly used. In practice, a well-tested conjecture supported by many confirmatory cases, generating successful predictions, and surviving many attempts at refutation, is epistemically superior to a proved claim based on poorly understood assumptions — even though the latter has a certificate and the former does not.

Sigma (channeling Euler) makes this case:

> "I for one have to admit that I have not yet been able to devise a strict proof of this theorem. As however the truth of it has been established in so many cases, there can be no doubt that it holds good for any solid. Thus the proposition seems to be satisfactorily demonstrated." (p. 8)

The Teacher does not entirely endorse this view — the proof-attempt matters because it reveals structure, not just because it provides a certificate. But he doesn't entirely reject it either. The empirical corroboration has real epistemic weight, even without a formal proof.

## The Danger of Premature Proof

If conjectures precede proofs, it follows that there is such a thing as *premature proof* — a proof constructed before the conjecture is mature enough to be proved correctly. The Cauchy proof is exactly this: it is a proof of Euler's formula for a restricted class of polyhedra (spherical surfaces), but it is presented as a proof for all polyhedra. The proof is not wrong — its steps are valid for the cases they actually apply to — but it is *prematurely universal*: it claims more than it delivers.

This is the historical pattern: "After Cauchy's proof, it became absolutely indubitable that the elegant relation V+F=E+2 applies to all sorts of polyhedra, just as Euler stated in 1752. In 1811 all indecision should have disappeared." (Jonquières, quoted in footnote, p. 9)

But this confidence was misplaced. The proof had not established what the community thought it had established. The confidence produced by the proof actually *delayed* progress by suppressing the search for the boundary cases that would have revealed the proof's limitations.

**Premature proof can be worse than no proof**, because it produces false certainty that is harder to dislodge than acknowledged uncertainty.

For agent systems, this is a warning against over-reliance on formal verification or certified outputs when the underlying concepts are still immature. A formally verified property of a system that is using the wrong abstraction is worse than an unverified property at the right abstraction, because the verification closes off inquiry.

## Implications for Agent Systems

### 1. Treat High-Confidence Outputs as Well-Tested Conjectures, Not Proved Theorems

An agent that produces an output with 95% confidence is not producing a proved theorem — it is producing a well-tested conjecture. The 95% confidence reflects the conjecture's empirical record (how often this type of output has been correct in the past) not a formal proof of correctness. This should affect how the output is used: as a reliable working hypothesis, subject to revision if evidence against it appears, not as a certified fact that can be built upon without further scrutiny.

### 2. Distinguish Corroboration from Justification

A claim can be highly corroborated (tested against many cases, all confirming) without being justified (derived from first principles with a valid argument). Both provide epistemic warrant, but different kinds. Corroboration licenses use in practice; justification reveals structure. The highest-quality epistemic state combines both — but neither alone is sufficient for all purposes.

Agent systems should track both kinds of warrant separately: how well-tested is this claim (corroboration score)? And is there a known argument structure that explains why it's true (justification structure)? Claims with high corroboration but no known justification are reliable in familiar territory but suspect in novel situations where the untested assumptions in their implicit proof might fail.

### 3. The Value of Failed Proof Attempts

When an agent attempts to justify a claim and fails, the failure is not merely negative evidence — it is structural information. "I cannot construct a valid argument for X from premises P1...Pn" tells you that X, if true, is not derivable from P1...Pn. This means either X is false, or there is a required premise that is not in the set. Both are informative.

More specifically: the point at which the proof-attempt breaks down tells you *where the real difficulty lies*. The Cauchy proof breaks down at Step 1 for non-spherical surfaces. This breakdown tells you that the topological structure of the surface (whether it's simply connected) is the missing premise.

An agent system that records not just whether proof-attempts succeed or fail but *where* they fail is generating the most valuable kind of negative evidence: structural localization of the epistemic gap.

### 4. Corroboration as Active Inquiry

Euler didn't just notice V-E+F=2 for a few cases and stop. He tested it "quite thoroughly for consequences. He checked it for prisms, pyramids and so on." The corroboration was *active* — it searched for diversity in the test cases, tested consequences rather than just confirming instances, and explicitly acknowledged its limits ("I have not yet been able to devise a strict proof").

Agent systems should implement *active corroboration*: when an agent produces a claim, a parallel process should be seeking disconfirming evidence, testing consequences, and searching for boundary cases that might stress-test the claim. This is not the same as adversarial testing (which is adversarial by design) — it is the standard scientific practice of seeking to falsify one's own best hypotheses.

### 5. Productive Uncertainty Management

The gap between knowing and proving should change how agent systems communicate uncertainty. There are at least three distinct types of uncertainty an agent might have:

- **Statistical uncertainty**: "This is my best estimate, with X% confidence based on training data"
- **Structural uncertainty**: "I believe this is true but cannot yet construct a valid argument for it"  
- **Conceptual uncertainty**: "I am not sure my concepts are well-defined enough to determine whether this is true"

These require different responses. Statistical uncertainty is handled by better data or larger samples. Structural uncertainty is handled by proof-search and argument construction. Conceptual uncertainty is handled by the kind of boundary-case exploration that Lakatos's dialogue dramatizes.

A system that conflates these three types — treating all uncertainty as statistical — will systematically mishandle the latter two.

### 6. The Heuristic Value of Conjecture

Perhaps the most underappreciated practical lesson: **it is better to conjecture boldly and be wrong than to refuse to conjecture**. Sigma's retreat to "it has been established in so many cases" is epistemically cautious but heuristically weak — it doesn't generate the proof-attempt that reveals the conjecture's structure.

Agent systems that are calibrated to never produce outputs with more confidence than they can rigorously justify will be systematically *less useful* than systems that produce bold, well-labeled conjectures. The label "conjecture" — with its implication "I believe this is true, I am not yet able to prove it, and I actively invite challenge" — is not a weakness but a feature.

Build the conjecture/theorem distinction into agent outputs: outputs should be labeled with their epistemic status, and "conjecture" should be a legitimate and valued category, not a failure mode.

## The Philosophical Payoff

The gap between knowing and proving is not a temporary inconvenience on the way to complete knowledge — it is a permanent feature of inquiry at the frontier. The frontier is always defined by the claims we can make with confidence but not yet with proof. If we could not make those claims, we could not even know where to look for the proofs.

Lakatos is pointing at something deep about the structure of intelligence: **the capacity to form well-supported conjectures that outrun current justificatory resources is not a deficiency but a faculty**. It is what allows knowledge to grow. A reasoner that cannot conjecture beyond its current proofs is limited to what has already been established; a reasoner that can form bold, well-tested conjectures in the face of incomplete proof is capable of genuine discovery