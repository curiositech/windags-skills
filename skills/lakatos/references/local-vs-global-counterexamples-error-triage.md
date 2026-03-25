# Local vs. Global Counterexamples: A Framework for Error Triage in Complex Systems

## The Most Important Distinction in Failure Analysis

When a complex system fails, the most urgent question is not "how do we fix it?" but "what exactly has been falsified?" A failure at the output level might indicate a flaw in the final inference step, or it might indicate a flaw in a foundational assumption that contaminates every downstream claim. A local repair might be sufficient, or the entire conjecture might need revision. Treating these cases the same way — either by always escalating to full system review, or always attempting local patch — produces either massive waste or systematic brittleness.

Imre Lakatos, in *Proofs and Refutations*, gives us the precise vocabulary for this triage problem. He distinguishes between **local counterexamples** and **global counterexamples**, and shows that conflating them is one of the most common and damaging errors in mathematical reasoning — and, by extension, in any system that reasons about complex domains.

## The Taxonomy

When Gamma presents a counterexample to Step 3 of the Cauchy proof (the cube's flat triangulated network contains interior triangles that can be removed without affecting any edge), the Teacher responds:

> "I shall call a 'local counterexample' an example which refutes a lemma (without necessarily refuting the main conjecture), and I shall call a 'global counterexample' an example which refutes the main conjecture itself. Thus your counterexample is local but not global. A local, but not global, counterexample is a criticism of the proof, but not of the conjecture." (p. 13)

This distinction creates a 2×2 matrix of counterexample types:

| | Falsifies a Lemma | Does NOT Falsify a Lemma |
|---|---|---|
| **Falsifies the Conjecture** | Global (and local) | Purely Global (rare) |
| **Does NOT Falsify the Conjecture** | Local only | Not a counterexample |

The interesting cases are:
- **Local only**: The proof is broken; the conjecture may still be true. Repair the proof.
- **Global (and local)**: Both the proof and the conjecture are damaged. The lemma that's falsified is the entry point for the global failure.
- **Purely global**: The conjecture is false but all the lemmas are individually true — the problem is in how they connect. This is the rarest and most subtle case.

## Walking Through the Cases

### Case 1: Local but not global (Gamma's interior triangle)

Gamma shows that in a cube's triangulated flat network, you can remove an interior triangle by extracting it "like a piece from a jigsaw puzzle" — without removing any edge. This violates Step 3's lemma that every triangle removal follows one of two specific patterns.

But the cube itself satisfies V-E+F=2. The main conjecture is untouched.

Response: The *proof* needs repair, but the *claim* does not need revision. The Teacher patches Step 3 by specifying "boundary triangles" rather than any triangles. The patch is local.

### Case 2: Global (and local) (Alpha's hollow cube)

Alpha presents two nested cubes, for which V-E+F=4. This is also a local counterexample to Step 1 (the hollow cube cannot be stretched flat on a plane after a face is removed).

Response: Both the proof and the conjecture need revision. The local failure (Step 1 breaks down) is the entry point for understanding *why* the global failure occurs: it is precisely the topological structure that prevents flattening that also causes the Euler characteristic to differ from 2. The local failure is *diagnostic* of the global failure.

### Case 3: Global counterexample, different source (the urchin)

Gamma presents a star-polyhedron (urchin) for which V-E+F=-6. This is global. But its local status depends on which definition of "polygon" you accept.

Response: This case forces a *conceptual* decision — should star-polygons be admitted as polygons? This is not a repair question but a *scope* question. The conjecture may be true for one concept of polyhedron and false for another.

## The Asymmetry of Response

Lakatos is explicit that local and global counterexamples demand qualitatively different responses:

For a local counterexample: **improve the proof**. The conjecture is not yet threatened; the argument structure is. Find the false lemma, revise it, verify that the revision handles the counterexample, and check that the revision doesn't introduce new vulnerabilities.

For a global counterexample: **investigate the conceptual structure**. The claim itself is at stake. You must ask: is this an anomaly (a genuine edge case that should be excluded by a theoretically motivated restriction), a refutation (the claim is simply false), or a discovery (the claim is true in a more general form than originally stated)?

The Teacher refuses to treat global counterexamples as automatically demanding surrender:

> "I am not perturbed at finding a counterexample to a 'proved' conjecture; I am even willing to set out to 'prove' a false conjecture!" (p. 25)

This is because a global counterexample, properly understood, provides a *diagnostic structure*: it tells you which lemma in your proof-decomposition is false, and therefore which aspect of your model needs revision.

## Applications to Agent System Orchestration

### 1. Error Triage in Multi-Agent Pipelines

In a multi-agent system, a failure at the output of Agent N could be caused by:
- A bug in Agent N's reasoning (local to N)
- A flawed assumption passed to N from Agent N-1 (local to an upstream step)
- A fundamental misspecification of the task (global)

Current practice often responds to output failures by either retrying Agent N (assuming local failure) or escalating to full pipeline review (assuming global failure). Lakatos's framework suggests a better approach: **trace the failure to the specific lemma it falsifies**.

Ask: "Which sub-claim in N's reasoning chain is the counterexample evidence against?" The answer determines whether the repair is local (revise N's reasoning step) or global (revise the task specification or the assumptions passed into the pipeline).

### 2. Test Suite Design

A test suite for a complex agent system should distinguish test types by what they falsify:
- **Lemma tests**: Verify individual reasoning steps in isolation. A failure here is local.
- **Integration tests**: Verify that lemmas compose correctly. Failure here can be local (to the composition step) or global (if the composition failure implies the composite claim is false).
- **Conjecture tests**: Verify the top-level claim. Failure here is global and demands conceptual investigation.

Running only conjecture tests and diagnosing failures from output alone is like observing that V-E+F≠2 and concluding only that "the formula is wrong." The local structure of the failure — *which step broke down* — is the most valuable information.

### 3. Confidence Propagation

When an agent system produces a confidence score for a claim, that score should reflect the confidence in *each lemma in the claim's proof decomposition*, not just the confidence in the final output. A claim that rests on five highly confident sub-claims is more robust than a claim that reaches the same output confidence through one very uncertain sub-claim.

This means: confidence propagation in agent reasoning chains should track the *weakest lemma*, not just the *average confidence*. A chain that is 99%/99%/99%/99%/40% confident across its five steps has a real confidence of approximately 40% on the last step, not 87%.

### 4. Debugging Protocol for Agent Failures

When an agent produces an incorrect output, the debugging protocol should follow the local/global distinction:

**Step 1: Is this a local failure?**
- Can you identify a specific sub-step in the agent's reasoning that produced an incorrect intermediate result?
- Does fixing that sub-step (with the rest of the reasoning held fixed) produce the correct output?
- If yes: local counterexample. Repair the specific step.

**Step 2: Is this a global failure?**
- If no single sub-step error explains the output failure, the problem is in the *composition* of steps or in the *assumptions* underlying the entire reasoning chain.
- What is the *structure* of the failure? What property does the failing case have that the passing cases lack?
- This structure points toward the conceptual revision needed.

**Step 3: Is this a scope question?**
- Does the failing case belong to a class that the agent was never intended to handle?
- If yes: is excluding this class theoretically motivated (the agent genuinely doesn't apply here) or defensively motivated (we're excluding it because we fail on it)?
- If the latter: this is monster-barring. The failure should be treated as a global counterexample, not a scope restriction.

### 5. Cascade Failure Analysis

In distributed agent systems, failures cascade: a local failure in one agent becomes a global failure in the system if that agent's output is used as a lemma by many downstream agents. This is the analog of a false lemma that is used extensively in a proof — the corruption propagates through every claim that depends on it.

The Lakatos framework suggests: **map the lemma dependency graph**. When a failure is detected, trace not just the direct cause but all the downstream claims that depend on the falsified lemma. This is the scope of the damage — and it defines the minimum revision required.

## The Detective Analogy

Lakatos's local/global distinction maps naturally onto detective reasoning. A detective investigating a crime scene encounters "counterexamples" to their working hypothesis all the time. The skilled detective's first move is always: is this evidence against one *step* in my reconstruction of events (local), or against the entire reconstruction (global)?

A fingerprint in an unexpected location might falsify a specific sub-claim ("the suspect entered through the front door") without touching the main claim ("the suspect was present"). Or it might falsify the main claim entirely (if the fingerprint is dated after the suspect's alleged alibi). The response — revise the route of entry vs. revisit the entire theory — depends critically on this distinction.

Agent systems doing investigative reasoning (debugging, fraud detection, medical diagnosis, security auditing) should build this triage step explicitly into their reasoning protocols.

## The Hardest Case: When Local and Global Coincide

The most epistemically demanding situation is when a counterexample is *both* local and global: it falsifies a specific lemma *and* the main conjecture. Alpha's hollow cube is this case. The nested cube falsifies Step 1 of the Cauchy proof (it can't be stretched flat) *and* gives V-E+F=4.

Here, the local failure is not just diagnostic — it is *constitutive* of the global failure. The same property that causes Step 1 to break down (the topology of the hollow cube is not spherical) is what causes Euler's formula to give 4 instead of 2.

In agent systems, this coincidence is a signal of a **deep structural insight**: the conceptual apparatus that handles the sub-claim correctly is the same apparatus that handles the main claim correctly. Getting the concept right at the lemma level and getting it right at the conjecture level are the same problem. Revising only one without revising the other will fail.

This is the signal to escalate from "repair" to "rearchitect": not just fix the failing step, but revisit the foundational concepts that both steps rely on.

## Conclusion

The distinction between local and global counterexamples is not subtle — but it is routinely missed in engineering practice, scientific reasoning, and agent system design. Systems that treat all failures as equally demanding of the same response — whether that response is local patch or global revision — will be systematically inefficient and systematically brittle.

Lakatos gives us the right question to ask at every failure point: **What, exactly, has been falsified?** A lemma? The main conjecture? Both? The answer determines the appropriate scope of response. Building this question into the debugging, monitoring, and learning protocols of agent systems is one of the highest-leverage improvements available.