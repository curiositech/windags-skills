# Benchmarks as Social Artifacts: How Evaluation Shapes What Gets Built

## The Opening Claim

HELM opens with an explicit normative statement that situates evaluation as more than a technical exercise: "Benchmarks orient AI. They encode values and priorities that specify directions for the AI community to improve upon." (§1)

This is not a metaphor. It is a causal claim: the benchmarks that exist determine what gets optimized, what capabilities improve, what failure modes remain unaddressed, and what problems are defined as "solved." The benchmark is the policy.

The history of NLP illustrates this. SQuAD made reading comprehension important. ImageNet made image classification important. GLUE made natural language understanding important. Not because these were the most important problems — but because these benchmarks existed, were widely adopted, and therefore attracted research effort.

## The Benchmark-as-Values-Encoding

HELM's taxonomy effort forces an uncomfortable question into the open: whose values determine what gets measured? The list of desiderata in Table 2 — collected from ACL, NeurIPS, FAccT, SIGIR, and others — reflects the values of academic ML/NLP researchers at a specific historical moment. It does not reflect the values of:

- Non-English speaking populations (underrepresented in both the benchmark and the research community)
- Marginalized communities who bear the costs of AI failures (racial groups, LGBTQ individuals, non-dominant language speakers)
- Users in the Global South (not well-represented in the datasets)
- Future users (who will interact with models trained on benchmarks designed today)

"Benchmarks set the agenda and orient progress: we should aspire for holistic, pluralistic and democratic benchmarks." (§12)

The reflexivity statement at the end of HELM explicitly acknowledges that it was produced by Stanford — "a privileged, high-resourced, and powerful institution" — continuing "a trend...that many works that introduce (influential) benchmarks come from privileged...institutions." (§12 reflexivity section) This is not self-flagellation; it's an honest accounting of the power dynamics embedded in benchmark creation.

## Strathern's Law in AI Evaluation

The most important practical implication of the benchmark-as-policy view is Strathern's Law: "When a measure becomes a target, it ceases to be a good measure." (Strathern, 1997, cited in §11.2)

HELM's summarization findings demonstrate this concretely. CNN/DailyMail and XSUM are the dominant summarization benchmarks. Years of optimization against ROUGE scores on these datasets have produced models that are good at ROUGE on CNN/DailyMail and XSUM. But "automated evaluations on these datasets largely fail to discriminate differences we observed in model quality." (§1.2, Finding 10) The measure has been optimized; therefore it is no longer a good measure.

The mechanism: research teams find prompting strategies, fine-tuning approaches, or model architectures that improve ROUGE scores. These improvements may or may not reflect improvements in actual summary quality. As the benchmark gets "solved," it stops distinguishing good summaries from poor ones on dimensions that matter (length appropriateness, faithfulness to the source document, coverage of key information). The benchmark that was once signal becomes noise.

## What "Solved" Really Means

HELM's calibration findings reveal another dimension of the benchmark-as-policy problem. HellaSwag is a commonsense inference dataset. The most accurate models on HellaSwag have calibration errors exceeding 0.28. What does it mean that text-davinci-002 "solves" HellaSwag with 81.5% accuracy if its confidence in its answers is systematically miscalibrated?

It means the benchmark has been solved in one dimension (accuracy) while remaining unsolved in another dimension (calibration). The field's declaration that commonsense inference is "largely solved" based on accuracy metrics is potentially premature. The models are accurate but overconfident — which means they will fail unexpectedly in downstream applications that depend on confidence signals.

More broadly: every time a benchmark appears "solved" based on a single metric, it may be "unsolved" on every other metric. HELM's insistence on multi-metric evaluation is partly a response to this: a task is not done until you've characterized performance across all the desiderata that matter for deployment.

## The Model Access Power Dynamic

HELM frames model access as a governance issue, not just a technical one: "The absence of an evaluation standard compromises the community's ability to clearly and rigorously understand the overall landscape of language models." (§1.1)

The power dynamic: model providers decide which models to release, which to keep closed, and which to permit for evaluation. PaLM, LaMDA, Gopher, Chinchilla — the models with the most investment and potentially the most capability — were not evaluated in HELM. They were unavailable. This is not a neutral fact; it is a policy choice by the companies that own these models.

The implication: the public understanding of AI capabilities is systematically biased toward models that have been released openly or through limited-access APIs. The most powerful models exist in a zone of opacity. "We raise this as an important open question for the community: how do we ensure foundation models (including language models) are transparently benchmarked when we do not know they exist and no existing mechanism requires they be disclosed?" (§10.4)

This is a call for governance mechanisms — standards, regulations, or norms — that would require disclosure and evaluation of models having social impact. Without such mechanisms, the models with the most potential impact are the least characterized.

## The Living Benchmark Concept

HELM's aspiration is to be "a living benchmark for the community, continuously updated with new scenarios, metrics, and models." (Abstract)

This reflects a recognition that any benchmark is a snapshot of current capabilities and current concerns. As capabilities evolve, the benchmark's scenarios may become saturated (easy for all models) or irrelevant (no longer representative of deployment). As social concerns evolve, new metrics become important. As new models are released, new comparisons become possible.

The living benchmark concept is a response to the problem that static benchmarks become outdated:
- Scenarios that were hard become easy; the benchmark no longer discriminates.
- New deployment contexts (LLMs as coding assistants, medical consultants, educational tutors) create new scenarios that aren't represented.
- New harms emerge (disinformation capabilities, copyright infringement) that weren't anticipated.
- New equity concerns are identified by communities affected by AI systems.

A living benchmark requires infrastructure (a codebase that accepts new scenarios, a website that presents results, a community process for validation) and commitment (ongoing evaluation as new models are released).

## Application to Agent System Design

**Benchmark governance for the skill library.** The skills in a WinDAGs system face the same benchmark-as-policy dynamics. Whatever skills are benchmarked will be optimized; what isn't benchmarked will drift. A governance process for the skill benchmark — who decides what scenarios are evaluated, what metrics matter, when evaluations are updated — is as important as the technical evaluation infrastructure.

**Anticipate Strathern's Law.** As skills are optimized against internal benchmarks, the benchmarks will increasingly fail to discriminate good from bad performance. Plan for benchmark refresh cycles: regularly introduce new test cases, new scenarios, new metrics that measure dimensions the current benchmark has started to miss.

**Treat evaluation gaps as known risks.** Every skill has dimensions that aren't evaluated. Those dimensions are not "fine" — they are *unknown*. Document evaluation gaps explicitly (the §10 equivalent for the skill library). When a skill is deployed in a new context, check whether that context involves evaluation gaps.

**Design for multi-stakeholder input on metrics.** The users of a WinDAGs system may have different values than its developers. A skill that performs well on developer-defined accuracy metrics may fail on user-defined quality dimensions. Build feedback loops that allow users to report when skills fail in ways not captured by automated metrics.

**Distinguish solved from saturated.** When a benchmark shows ceiling effects (all skills performing >95%), the benchmark has been saturated — it no longer provides signal. Don't confuse benchmark saturation with the problem being solved. The space of relevant inputs is larger than any benchmark; saturation means you've exhausted the benchmark's ability to discriminate, not that all relevant inputs are handled well.

## The Deeper Contribution

HELM's most important contribution is not any specific empirical finding. It is the demonstration that **evaluation is a form of power**. Whoever controls the benchmark controls the definition of "better." Whoever gets to choose which metrics matter is choosing what values get optimized. A field that accepts benchmark scores uncritically is accepting those value choices without examination.

For AI agent system designers, this means: the metrics you use to evaluate your agents are not neutral. They encode assumptions about what matters. Making those assumptions explicit — through taxonomy-first design, multi-metric evaluation, acknowledgment of gaps, and living benchmark practices — is not just methodological rigor. It is epistemic responsibility.