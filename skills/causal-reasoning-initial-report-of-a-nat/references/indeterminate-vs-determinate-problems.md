# The Determinate/Indeterminate Divide: When Scientific Reasoning Fails Agents

## The Central Distinction

One of Klein and Hoffman's most important contributions is their insistence on distinguishing between **determinate** and **indeterminate** causal problems. This distinction is not widely made explicit in the AI or cognitive systems literature, but it has profound implications for how agents should be designed to reason about causes and make decisions.

**Determinate problems** have single, discoverable correct answers. The investigation into AIDS led to the discovery that HIV causes AIDS. Watson and Crick figured out the structure of DNA. In determinate problems, "the investigation into the cause of AIDS led to the discovery" — the word "discovery" is key. The answer was out there, waiting to be found.

**Indeterminate problems** have no single correct answer, and no amount of research would reveal "the real" cause. "Why did the American military situation in Iraq improve from 2004 to 2008? Why did Hillary Clinton lose the contest to become the Democratic candidate for president in 2008?" There are no single or uniquely correct answers to such questions. Different observers, applying different values and different frameworks, will construct different valid explanations. None of them is simply wrong.

Most real-world agent deployment targets indeterminate problems. Most agent reasoning frameworks are implicitly designed for determinate ones.

---

## Five Ways the Determinate Model Fails in Indeterminate Settings

### 1. The Quest for "The True Cause" is Misleading

Klein and Hoffman identify as a widespread but misleading assumption: "Causal reasoning means finding the true cause for an effect/event." They note: "As described above, when dealing with indeterminate causes there is no way to identify the true single cause. Further, researchers such as Reason (1990) have shown that accidents do not have single causes, so the quest for some single 'root' cause or a culminating cause is bound to be an oversimplification and a distortion. Nevertheless, in order to take action we often need to engage in such simplification."

This passage contains two equally important truths:
- The quest for a single root cause is epistemically wrong
- The quest for a single root cause is pragmatically necessary

The reconciliation: an agent should *know* it is producing a simplification when it offers a single-cause explanation, and should flag this explicitly. The simplification is a tool for action, not a finding about reality.

### 2. Scientists and Decision-Makers Have Different Stopping Rules

"Scientists are driven by curiosity and are always looking for deeper explanations and further mysteries, whereas managers have to stop at a certain point and make decisions."

Scientists never have sufficient cause to stop investigating — every explanation raises new questions. Decision-makers must stop investigating and commit to action, even under uncertainty. These are different cognitive imperatives, and they produce different epistemologies.

An agent modeled on scientific reasoning will have trouble knowing when to stop. It will always find another question worth investigating, another cause worth exploring, another uncertainty worth resolving. An agent modeled on decision-making will have closure rules that may truncate investigation prematurely, but will enable action.

**The implication for orchestration:** The orchestrator must specify stopping rules for diagnostic agents that are appropriate for the decision at hand — not leaving it to the agent to determine when its investigation is "complete." Completion is not a property of an investigation; it is a property of the decision context.

### 3. The Reductive Tendency Is Both Necessary and Dangerous

Klein and Hoffman, citing Feltovich et al. (2004), identify the "reductive tendency": the cognitive propensity to "chop complex events into artificial stages, to treat simultaneous events as sequential, dynamic events as static, nonlinear processes as linear, to separate factors that are interacting with each other."

This tendency is not a bug — it is a feature for decision-makers. "Managers, leaders, and other kinds of decision makers depend on the reduction to avoid some of the complexity that might otherwise be unleashed." Without reduction, a complex system is incomprehensible and incompletely actionable.

But the reductions introduce systematic errors:
- Treating simultaneous causes as sequential creates false narratives about which came "first" and therefore which is more "fundamental"
- Treating nonlinear processes as linear leads to incorrect extrapolation (the housing market dynamic where rising prices increase demand is non-linear; treating it as linear produces systematically wrong predictions)
- Separating interacting factors produces independent cause lists that miss emergent effects from factor combination

**The implication for agent design:** Reduction is unavoidable. The question is *which* reductions to make. Experts have learned which reductions are safe in their domain and which are dangerous. This domain-specific reduction knowledge is a critical component of expertise that is rarely made explicit. An agent system should surface its reductions rather than hide them — making explicit which simplifications are being made and which interactions are being suppressed.

### 4. The Effect Morphs During Investigation

"Cases such as these show that the initial effect may be re-framed and re-cast during the investigation into its causes." The AIDS example: the effect to be explained started as "gay men dying of infectious diseases" and morphed to include IV drug users, blood transfusion recipients, and others. Each re-framing of the effect generated different candidate causes and different investigation directions.

A pipeline model of causal reasoning has no mechanism for effect-morphing — the effect is defined at the start and remains fixed. The Reciprocal Model accommodates this naturally: as the investigation proceeds, the frame evolves, and the frame includes the definition of the effect.

**Implication:** An agent should treat its effect definition as a hypothesis, not a fact. "What we are trying to explain" should be revisited when:
- New data arrives that doesn't fit the current effect frame
- Proposed causes have implications for other outcomes not yet considered
- The scope of the investigation expands due to newly discovered related cases

### 5. Multiple Valid Explanations Can Coexist

For indeterminate problems, there is no single correct explanation. This is not a limitation to be overcome — it is a feature of the problem type. "There are no single or uniquely correct answers to such questions, and no amount of research would discover 'the real' cause."

This means that an agent asked "why did X happen?" in an indeterminate domain should not be designed to converge on a single answer. It should be designed to produce a set of viable explanations, each constructed using a different frame, each valid from within its frame, and each appropriate for different purposes (accountability, prevention, prediction, communication).

This pluralism is cognitively uncomfortable for humans and architecturally challenging for AI systems. But suppressing it in favor of false convergence is epistemically dishonest and practically dangerous.

---

## Recognizing Indeterminate Problems Before Beginning Investigation

An agent should have a prior assessment of whether its current problem is determinate or indeterminate. Signals of indeterminacy:

1. **Multiple equally credentialed observers have produced different causal accounts** — this suggests the problem is genuinely indeterminate, not that some observers are wrong
2. **The causal factors include human decisions and intentions** — human choice introduces genuine contingency that breaks determinism
3. **The domain is historical or political** — the causes of wars, elections, and social movements are almost always indeterminate
4. **The outcome has been produced by a complex sociotechnical system** — such systems have too many interacting components for single-cause explanations to be valid
5. **The time lag between cause and effect spans multiple decision cycles** — the longer the lag, the more intervening decisions have contributed

When an agent detects indeterminacy, it should:
- Shift from "find the cause" mode to "construct explanations" mode
- Generate multiple explanation forms (event, condition, story) rather than converging on one
- Flag the indeterminate character of its output explicitly
- Ask the human decision-maker what the explanation will be *used for* — because the appropriate explanation form depends on the use case, not just the facts

---

## The Accountability Trap

A specific failure mode in indeterminate settings is the **Accountability Trap**: the pressure (from organizations, legal systems, or social norms) to produce a single causal account that assigns responsibility to an identifiable agent. This pressure drives causal reasoning toward event explanations (identifiable, reversible, recent) and away from condition explanations (structural, diffuse, impersonal).

The result: conditions that created systemic vulnerability are ignored, precipitating events are over-attributed, and the specific individual who happened to be in the wrong place at the wrong time is assigned responsibility for a failure that was structurally produced.

**Agent design implication:** When an agent is operating in an accountability context (producing reports for legal review, assigning blame for system failures, generating post-mortems), it should explicitly resist the pull toward event-only explanations. The accountability-appropriate explanation (who did what?) and the prevention-appropriate explanation (what structural conditions should be changed?) are different explanations, both valid, both necessary. An agent should produce both and label them separately.