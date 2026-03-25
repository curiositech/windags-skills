# Taxonomy Before Benchmark: The Epistemology of Evaluation Design

## The Anti-Pattern That HELM Diagnoses

The dominant paradigm in AI evaluation before HELM: find existing datasets, combine them into a benchmark, measure models on the combination. The problem with this bottom-up approach is articulated precisely: "Benchmarks across AI, including those for language models like SuperGLUE, the EleutherAI LM Harness, and BIG-bench, are defined by specific choices of scenarios and metrics. Different benchmarks make different decisions on what to prioritize, how to make these decisions, and to what extent these processes are made clear." (§1.1)

When the decision process is invisible, you cannot know what the benchmark represents, what it's missing, or whether the coverage is principled. Prior to HELM, "models on average were evaluated on just 17.9% of the core HELM scenarios, with some prominent models not sharing a single scenario in common." (§1.1) This is not a measurement problem — it's a design problem. The field lacked a shared vocabulary for what "complete" evaluation would look like.

## The Two-Level Architecture

HELM's solution is explicit two-level architecture:

**Level 1: Abstract Taxonomy** — A structured enumeration of the entire design space. For scenarios: tasks × domains × languages. For metrics: the union of all desiderata studied across major AI venues (Table 2), then filtered by measurability requirements (Table 3). This taxonomy is the *aspiration* — it defines what holistic evaluation would look like if resources were unlimited.

**Level 2: Concrete Implementation** — A deliberate subset selected from the taxonomy, with explicit principles governing selection (coverage, minimality, user-facing priority) and explicit acknowledgment of what's missing (§10). This implementation is the *actual benchmark* — it's what you can run today.

The gap between Level 1 and Level 2 is the *recognized incompleteness*: "our benchmark foregrounds the limitations of our current benchmark by design: our benchmark is a subset of a pre-specified taxonomy. That is, the difference between what is in the taxonomy and what is in the benchmark identifies what we currently miss." (§10)

This is genuinely novel. Most benchmarks don't have a Level 1. They are their Level 2.

## Scenario Decomposition: The Three-Dimensional Structure

A scenario in HELM is a *triple*: (task, domain, language). This decomposition is non-trivial — each axis independently contributes variation in model behavior:

**Task**: What we want the system to do. HELM uses the ACL 2022 track taxonomy as a starting enumeration (Table 1), then filters for user-facing tasks: question answering, information retrieval, summarization, sentiment analysis, toxicity detection, miscellaneous text classification. The filtering principle is explicit: "user-facing tasks will confer much of the direct social impact of language models." (§3.2) Non-user-facing tasks (parsing, NLI) are deprioritized not because they're unimportant but because the benchmark's purpose is evaluating societal impact.

**Domain**: The "3 W's" — What (genre: Wikipedia, news, social media, scientific), Who (demographic speaker: Black/White, men/women, children/elderly), When (time period: pre-Internet, 2018, present). The domain decomposition is crucial because a model that performs well on Wikipedia data may degrade on social media, on African American English, or on text from before its training cutoff. "A dataset has a single domain corresponding to properties of its inputs, though it would be more precise to consider domains associated with all aspects of the input and output." (§3.1)

**Language/Language Variety**: HELM focuses on English but within English explicitly covers varieties — Standard American English, African American English, and international Englishes via ICE (India, Hong Kong, Kenya/Tanzania, etc.). The rationale: language technologies that degrade for non-dominant language varieties cause harm by "reinforcing a stigmatization" of those varieties and "historically and continue to deny social opportunity to the speakers of that language." (§5.1.1)

## The Desiderata Taxonomy

For metrics, HELM starts with a union of all desiderata appearing across major venues' calls for papers (Table 2). The full list is extensive: accuracy, bias, causality, creativity, credibility/provenance, emotional intelligence, environmental impact, explainability, fairness, inference efficiency, interpretability, legality, linguistic plausibility, maintainability, memory efficiency, morality, oversight, participatory design, privacy, reliability, robustness, sample efficiency, security, theoretical guarantees, toxicity, training efficiency, transparency, trustworthiness, uncertainty/calibration, user experience.

These are then filtered based on measurement requirements (Table 3):

- **Requires knowledge of training**: causality, environmental impact, linguistic plausibility, memory efficiency, training efficiency, theoretical guarantees → excluded or partially included
- **Requires specific model structure**: credibility/provenance, explainability → excluded (we treat models as black boxes)
- **Requires more than blackbox access**: interpretability → excluded
- **Requires knowledge of broader system context**: maintainability, reliability, security, transparency → excluded
- **Requires knowledge of broader social context**: accessibility, accountability, creativity, legality, morality, oversight, trustworthiness → excluded

What remains: accuracy, bias, fairness, inference efficiency, robustness, toxicity, uncertainty/calibration. The selection is principled, not arbitrary.

## The Recognition of Incompleteness as a Feature, Not a Bug

The most intellectually honest aspect of HELM is its §10 ("What is Missing"), which explicitly catalogs the gaps:

**Missing scenarios**: clinical notes, financial documents, education data, customer service domains; text from non-dominant time periods; non-US demographic groups; languages beyond English; interactive tasks like dialogue; entirely new tasks enabled by LM capabilities (copywriting, creative generation).

**Missing metrics**: user experience (as models become interfaces), linguistic plausibility (comparisons to human language behavior), credibility/provenance (critical as LMs are used in knowledge-intensive settings), adversarial robustness, privacy risk from memorization.

**Missing models**: proprietary models (PaLM, Gopher, Chinchilla, LaMDA) that couldn't be accessed; recently released models; entirely undisclosed models that may nonetheless be having social impact.

**Missing adaptation**: chain-of-thought prompting, parameter-efficient fine-tuning, retrieval-augmented generation — all of which may produce qualitatively different results.

This honest cataloging is itself methodologically important. It means consumers of the benchmark can calibrate their confidence: "I know HELM didn't measure this; I should not use HELM results to make claims about this."

## Application to Agent System Design

**Design the skill taxonomy before the skill library.** For a system with 180+ skills, the skills represent the Level 2 implementation. What's the Level 1 taxonomy? What are all the tasks agents should be able to do? What domains do they operate in? What desiderata should each skill be characterized on? Without the taxonomy, the skill library is a collection of bottom-up patches rather than a designed system.

**Track what's missing.** Every agent system has capabilities it hasn't yet characterized. The taxonomy framework makes this concrete: you can say "we haven't evaluated skill X on users who speak non-standard English" or "we haven't measured robustness for skill Y under input formatting variation." This is far more tractable than trying to enumerate every possible failure mode.

**Decompose scenarios into (task, domain, desiderata) triples.** When specifying what a skill should do, be explicit about all three dimensions. A "summarization skill" is underdetermined — it should be specified as (summarization, [legal documents, news, scientific papers], [accuracy/faithfulness, efficiency]) to be operationally meaningful.

**Use taxonomic coverage to drive testing priorities.** When testing an agent pipeline, use the taxonomy to identify which (task, domain) combinations are least tested. Random testing will over-represent common cases. Structured taxonomic testing surfaces rare but important coverage gaps.

**Acknowledge incompleteness to users.** Systems that present capability claims without acknowledging their scope of validity are misleading. A benchmark that scores highly on all tested scenarios and metrics should still communicate: "This evaluation does not cover [X, Y, Z]."

## The Deeper Epistemological Point

HELM's taxonomy-first design reflects a deeper epistemological position: **you cannot evaluate what you cannot name**. The history of NLP benchmarks is partly a history of measuring what was easy to measure, then assuming that what was easy to measure was what mattered. The taxonomy exercise forces the question: what should matter, given the deployment context and the values at stake? The answer is not determined by what datasets happen to exist.

This is why HELM describes benchmarks as encoding "values and priorities" that "orient the AI community." (§1) A benchmark is not a neutral instrument. It is a policy — it determines what gets optimized, and therefore what gets built.