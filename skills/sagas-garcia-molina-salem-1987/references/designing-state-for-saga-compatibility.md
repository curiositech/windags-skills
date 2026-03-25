# Designing State for Saga Compatibility: The "Funds in Transit" Principle

## Introduction

The Sagas paper contains a design principle that is easy to overlook because it appears late in the paper and is illustrated with a financial example. But it is one of the most important and transferable ideas in the entire document. The principle: **intermediate state that passes between workflow steps must be explicitly represented in shared, durable storage — not held in private memory**.

This is the "funds in transit" principle, and it directly governs how agent systems should manage context, partial results, and inter-step data.

---

## The Problem: Invisible Intermediate State

The paper illustrates the problem with a financial transfer:

> "Consider a LLT L with three sub-transactions T1, T2, and T3. In T1, L performs some actions and then withdraws a certain amount of money from an account stored in the database. This amount is stored in a temporary, local variable until during T3 the funds are placed in some other account(s). After T1 completes, the database is left in an inconsistent state because some money is 'missing,' i.e., it cannot be found in the database. Therefore, L cannot be run as a saga. If it were, a transaction that needed to see all the money (say an audit transaction) could run sometime between T1 and T3 and would not find all the funds." (p. 257-258)

The workflow is:
- T1: Withdraw $1000 from Account A → store in local variable X
- T2: Some intermediate computation
- T3: Deposit X into Account B

The problem: Between T1 and T3, the $1000 exists only in the local variable X. The database shows Account A with $1000 less but Account B unchanged. An audit run at this moment would incorrectly conclude $1000 has vanished. The workflow cannot be safely interleaved because its intermediate state is *invisible* to other observers.

**This is not a financial peculiarity.** It is a universal pattern in complex workflows. Anytime a workflow step produces output that is held privately until a later step uses it, the shared world appears inconsistent during the interval.

---

## The Solution: Explicit "In-Transit" State

> "If instead of storing the missing money in local storage L stores it in the database, then the database would be consistent, and other transactions could be interleaved. To achieve this we must incorporate into the database schema the 'temporary' storage (e.g., we add a relation for funds in transit or for pending insurance claims)." (p. 258)

The restructured workflow:
- T1: Withdraw $1000 from Account A → write $1000 to "Funds In Transit" table with transfer ID
- T2: Some intermediate computation
- T3: Read $1000 from "Funds In Transit" table → deposit into Account B → delete transit record

Now, between T1 and T3, an audit can see the $1000 in the "Funds In Transit" table. The total money in the system is unchanged. The world is consistent. The workflow can be safely interleaved.

The paper adds a key design note:

> "Also, transactions that need to see all the money must be aware of this new storage. Hence it is best if this storage is defined when the database is first designed and not added as an afterthought." (p. 258)

The "in-transit" representation must be a first-class concept in the data model, not a hack. Other workflows that might observe the intermediate state must know to look for it.

---

## Applications to Agent System Design

### Application 1: Research and Synthesis Workflows

Consider an agent workflow that:
1. Searches for sources on a topic
2. Reads and summarizes each source
3. Synthesizes summaries into a final report

In the naive implementation, summaries are accumulated in the agent's working memory between steps. If the agent crashes between step 2 and step 3, all summaries are lost. Other agents that might contribute to the report cannot see partial summaries. The workflow cannot be safely decomposed.

**The saga-compatible redesign**:
- Step 1: Search for sources → write source list to bibliography table
- Step 2 (iterated): For each source, summarize it → write summary to summaries table
- Step 3: Read all summaries from summaries table → write final report to output table

Each step reads from and writes to durable shared storage. Other agents can see the growing bibliography and summaries table. If the workflow crashes after step 2, it can resume from the last written summary. The "summaries in progress" table is the "funds in transit" equivalent.

### Application 2: Code Generation and Integration Workflows

Consider an agent workflow that:
1. Generates a module implementation
2. Generates tests for the module
3. Runs the tests and fixes failures
4. Commits the module

In the naive implementation, the generated code and tests are held in agent memory between steps. If the agent crashes after generating tests but before running them, all work is lost.

**The saga-compatible redesign**:
- Step 1: Generate implementation → write to a staging file in the repository
- Step 2: Generate tests → write to a staging test file
- Step 3: Run tests against staging files → write results to a test-results table
- Step 4: If tests pass, move staging files to production paths and commit

The staging files are the "funds in transit" equivalent. Another agent could review the generated implementation before tests are run. If the workflow crashes, it can resume from the last written staging file.

### Application 3: Multi-Step Data Analysis

Consider an agent workflow that:
1. Fetches raw data from multiple sources
2. Cleans and normalizes the data
3. Runs statistical analysis
4. Generates a report

**The naive pattern**: All data passes through agent memory. Each step reads from the previous step's output variable.

**The saga-compatible redesign**: Each step writes its output to a named, durable dataset in the data store. The pipeline is:
- raw_data_[job_id] → cleaned_data_[job_id] → analysis_results_[job_id] → report_[job_id]

Any step can be retried independently. Multiple agents can work on different stages in parallel. An observer can see the state of processing at any stage. Compensation is straightforward: delete the dataset produced by the step being compensated.

---

## The Schema Design Implication

The paper's guidance that in-transit storage should be designed upfront, not added as an afterthought, has a direct implication for agent system architecture:

**The state schema of a multi-agent system must include explicit representations for intermediate workflow states.**

This means:
- Not just "final results" tables, but "in-progress" or "staged" variants
- Explicit status fields that distinguish "available for use" from "being processed" from "pending validation"
- First-class representations for common intermediate states: "draft," "pending review," "staged," "in transit," "queued for processing"

Systems that only represent final states cannot be safely decomposed into sagas. Every step that produces an intermediate result leaves the system in an "inconsistent" state — one where the old state is gone but the new state isn't fully established.

---

## The Resource-Release Dividend

The paper notes an additional benefit of externalizing intermediate state that goes beyond saga compatibility:

> "Notice that in this case L would release the locks on the temporary storage after T1, only to immediately request them again in T3. This may add some overhead to L, but in return for this transactions that are waiting to see the funds will be able to proceed sooner, after T1. This is analogous to having a person with a huge photocopying job periodically step aside and let shorter jobs through. For this the coveted resources, i.e., the copying machine or the funds, must be temporarily released." (p. 258)

This is the politeness principle of saga design: *release resources as soon as you're done with them, even if you'll need them again later*. The cost is a brief re-acquisition overhead. The benefit is that other processes can use the resource during the interval.

For agent systems, this translates to:
- Release exclusive access to shared context after each step, even if the next step will need it
- Write intermediate results to shared storage where other agents can read them, even if you'll be the one reading them again
- Don't hold API connections, locks, or execution slots between steps that don't need them

The aggregate system performance improvement from this discipline — multiplied across many concurrent workflows — far outweighs the small overhead of re-acquisition.

---

## Summary: The Principle Stated Directly

> "We believe that what we have stated in terms of money and LLT L holds in general. The database and the LLTs should be designed so that data passed from one sub-transaction to the next via local storage is minimized." (p. 258)

Restated for agent systems:

**Intermediate results that pass between workflow steps should be written to durable shared storage, not held in agent memory.** This makes intermediate state visible, recoverable, and compensable. It is the prerequisite for safe workflow decomposition.

This is not primarily a reliability concern — it is a *design correctness* concern. Workflows that hold intermediate state in memory are not just fragile; they are incorrect in the sense that they create windows where shared state appears inconsistent. No amount of retry logic or crash recovery can fix a workflow whose intermediate states are fundamentally invisible.

The fix is always the same: name the intermediate state, give it a home in the shared state model, make it visible and durable, and design the transitions between states explicitly.