# Validation Through Disagreement: What Discrepancies Reveal About Hidden Assumptions

## The Most Valuable Information Comes From Where the Model Is Wrong

Grassi's thesis underwent a validation process in which five experienced surface warfare officers reviewed the GOMS models using the Critical Decision Method. The validation found extensive agreement — and one significant disagreement. That single disagreement is more instructive than all the confirmations combined:

> "Throughout the entire validation process there was only one discrepancy that was considered significant enough to warrant changes to the GOMS model. The discrepancy was over the use of tugboats. The initial GOMS model was originally constructed under the assumption that no tugs would be available and that the conning officer would have to use only the ship in getting underway or mooring to a pier. Therefore, the initial GOMS model did not reflect any procedures concerning the use of tugboats. However, all of the participants opted to use tugboats." (p. 50)

Read this carefully. The initial model was not wrong about procedures — it correctly captured what a conning officer does without tugs. The model was wrong about the *assumption space* — it had embedded an assumption about operating conditions (no tugs available) that systematically diverged from what experienced practitioners actually do.

The validation participants didn't just say "the tug procedures are missing." They revealed something deeper:

> "All of the participants agreed that, due to the severe consequences of damaging the ship, it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat. Therefore the model was changed to reflect using the assistance of a tugboat." (p. 50)

The experts were operating under a risk management constraint that had never been made explicit: given the consequences of error (damaging a naval vessel), the use of a tug is effectively mandatory — not a preference or an option, but a standard risk mitigation practice. The initial model had been built from procedural documentation that described how to do the task *in principle*, but real practitioners had collectively decided that the principled "without tugs" method was unacceptably risky.

This is the discovery that validation through disagreement makes possible: **identifying the gap between how a task is *described* and how it is *actually practiced*.**

## The Structure of Hidden Assumptions

Every task model embeds assumptions. The problem is that most assumptions are invisible to the model builder — they seem so obvious, or so unimportant, that they are never stated. The tugboat assumption is a perfect example:

- The model builder assumed "no tugs available" was a valid simplification
- The practitioners assumed "always use tugs" was such a basic risk management principle that it didn't need to be stated
- Neither party was aware that they held opposite assumptions until the validation surfaced the disagreement

This pattern — where critical divergences are invisible to both parties until forced into explicit comparison — is systematic in complex system design. Assumptions that seem like obviously-fine simplifications to designers are often exactly the assumptions that practitioners have learned, through hard experience, never to make.

For agent systems, the implication is that **the most dangerous bugs in task models are not errors in procedure but unexamined assumptions about operating conditions.** An agent built on a task model that assumes "tugs always available" will fail silently in any deployment where they are not.

## The Typology of Model-Practice Divergences

The tug disagreement belongs to a broader typology of ways that task models diverge from actual practice. The thesis and its surrounding context suggest at least five categories:

### 1. Missing Risk Mitigations
*The model describes the task; practice adds protections against catastrophic failure.*

The tug example falls here. The model correctly describes how to maneuver a ship without a tug. Practice adds a tug because of the consequences of error. Any model of a high-stakes task that does not incorporate the risk mitigations practitioners have developed is systematically incomplete.

**For agent systems**: Ask not just "what does the task require?" but "what could go catastrophically wrong, and what does standard practice do to prevent it?"

### 2. Elided Prerequisites
*The model starts at step N; practice builds in extensive preparation before step 1.*

The thesis describes elaborate briefing and preparation phases that consume 24-72 hours before the actual evolution. These phases are easy to elide in a task model focused on the execution phase, but they contain significant decision points and knowledge transfer that shape what becomes possible during execution.

**For agent systems**: Trace the full workflow backwards. For each task, ask: what conditions must be true at the start of this task? Who ensures those conditions? How long before execution must preparation begin?

### 3. Informal Coordination Protocols
*The model shows a solo operator; practice involves constant informal coordination.*

The thesis describes explicit command protocols (the conning officer issues orders, the helmsman repeats them back, the conning officer acknowledges the repeat-back, the helmsman reports execution). These protocols are formal and documented. But the thesis also describes informal coordination: conferring with the pilot, watching the face of the OOD for signs of concern, calling the bow watch for distance estimates.

**For agent systems**: Model both the formal communication protocols and the informal monitoring relationships. Agents in multi-agent systems need both explicit handoff protocols and background awareness of what other agents are doing.

### 4. Contextual Adaptations
*The model describes the standard case; practice adapts significantly to context.*

The five participants in the validation presumably had collectively conducted hundreds of pier side evolutions across many different ship types, ports, weather conditions, and time pressures. Their judgment about when to use a tug, where to position it, and how much to rely on it would reflect that accumulated contextual experience. The model, built on one generic scenario, could only capture a fraction of this contextual adaptation.

**For agent systems**: Document the adaptation logic explicitly — under what conditions does standard procedure become inappropriate, and what substitutes for it?

### 5. Accumulated Cultural Knowledge
*The model describes the task; practice reflects lessons from incidents and near-misses that practitioners share informally.*

The statement that "it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat" reflects an accumulation of hard-won lessons — near misses, actual collisions, costly errors — that have been encoded as cultural norms in the surface warfare community. This knowledge is not in any manual. It lives in the collective memory of practitioners and is transmitted through apprenticeship.

**For agent systems**: Interview not just for "how do you do this task?" but "what has gone wrong, and what does everyone now do differently because of it?"

## The Validation Design That Surfaces Disagreements

The validation methodology in the thesis was specifically designed to surface disagreements, not just confirm agreement. Several design choices made this possible:

**1. Multiple independent experts**
Five participants, each reviewed the model independently. If the tug issue had been idiosyncratic to one practitioner, it would not have emerged as a universal correction. Universal agreement on a correction reveals systematic model error.

**2. Performance before inspection**
Participants were asked to walk through the task themselves before being shown the model. This "initial task recount" phase prevents the model from anchoring the practitioner's thinking — they cannot defer to the model because they have not seen it yet. Their independent performance reveals what they actually do, not what they would agree the model says they should do.

**3. Probing disagreements for underlying reasons**
> "Any discrepancies found were thoroughly examined to determine if it was just a difference of opinion or a significant error in the GOMS model." (p. 50)

The key distinction: difference of opinion (multiple valid methods exist) versus systematic error (the model is missing something real). The tug case was systematic error — not just one person's preference, but a universal safety practice. The investigation of the disagreement's source turned a "model is incomplete" finding into a "model makes a dangerous assumption" finding.

**4. "What if" questions to probe edge cases**
The probe questions during Phase 3 of the CDM asked "what if" scenarios that tested the model's assumptions: What if the tug were unavailable? What if the wind were stronger? These questions revealed the model's implicit assumptions by asking what happens when they are violated.

## Applying This Framework to Agent System Validation

The validation approach in the thesis translates directly to agent system validation:

**1. Independent expert walkthrough before model exposure**
Before showing an expert reviewer the agent's task model, ask them to walk through how they would approach the task. Record their approach fully. Compare with the model. The divergences are the findings.

**2. Multiple independent reviewers**
One reviewer's deviation may be idiosyncratic. Three or more reviewers showing the same deviation reveals a systematic model failure.

**3. Identify the assumption behind each divergence**
For each divergence, ask: "Why does the model do X here, and why would practitioners do Y?" The answer will identify an implicit assumption in the model. Make that assumption explicit and evaluate whether it is valid.

**4. Test the model in adversarial conditions**
The scenario constraints in the thesis (no wind, no current, empty pier) represent nominal conditions. Test the agent in edge cases that violate each constraint. Where the agent fails, you have found a hidden assumption.

**5. Track the consequences of discovered assumptions**
The tug assumption was important because the *consequence* of being wrong was severe: ship damage. Not all model assumptions matter equally. The investigation should trace from each discovered assumption to its failure consequence — how bad would it be if this assumption were violated?

## When Validation Confirms the Model: What That Means

It is important to note that validation through disagreement does not imply that agreements are meaningless. The thesis's validation confirmed the vast majority of the model's structure. This is important information: the procedures for giving engine orders, confirming their execution, and verifying the ship's response were all validated by multiple independent practitioners. These procedures are genuinely reliable.

The distinction between confirmed and unconfirmed elements is valuable for calibrating confidence. When deploying an agent built on a validated model:
- **High-confidence elements** (confirmed by multiple experts): should be executed as specified
- **Low-confidence elements** (not tested against real practice): should be monitored more carefully and flagged for re-validation
- **Discovered-assumption elements** (found through disagreement): should be explicitly parameterized to allow for operating condition variation

## Boundary Conditions

Validation through disagreement works best when:
- Human expert practitioners can be recruited as reviewers
- The task model has enough specificity that disagreements can be precisely identified
- The validation process separates initial performance from model review
- Multiple independent experts can be compared

It is less effective when:
- Only a single expert is available (can't distinguish idiosyncratic from systematic)
- The experts are not independent (they have read the model before the walkthrough)
- The task is too simple to have significant implicit assumptions
- The domain is too novel for expert practitioners to have developed stable practice norms

The meta-lesson: **never validate by asking "does this look right?" — always validate by asking "show me how you would do this and let me compare."** The first question invites confirmation. The second question creates the conditions for discovery.