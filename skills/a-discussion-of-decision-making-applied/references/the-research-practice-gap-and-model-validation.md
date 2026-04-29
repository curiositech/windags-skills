# On the Reliability of Decision Models: Why What We Think We Know About Expert Reasoning May Be Wrong

## The Self-Undermining Nature of the Evidence Base

This paper is remarkable for its willingness to undermine the very models it presents. After carefully explaining the RPD model and the Contingency Approach, Njå and Rake turn a critical eye on the evidence base for both — and find it wanting in specific, important ways. This self-critique is not academic throat-clearing. It is essential guidance for anyone trying to build systems informed by these models.

The core problem is methodological: both major frameworks for understanding crisis decision-making are built on evidence gathered in ways that may systematically misrepresent what actually happens.

## The RPD Evidence Base: Strengths and Limits

Klein's RPD model is built primarily on retrospective interviews — specifically, the Critical Decision Method (CDM). The CDM is careful and structured; it has shown reasonable inter-rater reliability and test-retest correspondence. But it has specific limits:

### The Retrospective Construction Problem

When Klein et al. studied fireground commanders and found that over 80% of decisions were non-deliberate, what were they actually measuring? They were measuring what commanders *reported* when asked about their decisions after the fact. As Njå and Rake note, retrospective accounts systematically reconstruct decisions as more deliberate, more conscious, and more individually authored than they were.

The 80% figure for non-deliberate decisions may actually *underestimate* the degree of automaticity, because commanders who made rapid intuitive judgments will reconstruct them as more considered in the interview. Or it may overestimate it, because commanders who did engage in some deliberation will compress and simplify that deliberation in retrospect.

### The Domain Transfer Problem

> "The RPD model is based on research from a variety of tasks and domains, such as fireground command, wildland fire incident command teams, battle planning, critical care nursing and chess tournaments... These topics are relatively remote from incident commanding and, thus, the relevance to predicting behaviour in crisis decision making is minor." (Njå & Rake, p. 11-12)

This is a striking observation. The RPD model claims generality across high-stakes, time-pressured decision-making domains. But chess is not a life-safety context. Wildland fire command has different time pressures and coordination requirements than urban fire command. Critical care nursing operates within a different authority structure than military command. The evidence base is diverse but may not be transferable to any specific application domain without verification.

### The Good/Bad Decision Distinction

> "Yates (2001) raised questions about NDM researchers' lack of distinction between good and bad decisions. The issue is that experienced decision makers, whoever they might be, make better decisions in concurrence with the RPD model. On the other hand, a bad decision could very well be a result of people actually 'knowing too few facts that really matter and too many about things that don't'." (Njå & Rake, p. 9)

The RPD model describes *how* experienced decision-makers decide — but it doesn't distinguish between experienced decision-makers who decide well and those who decide badly. Experience enables RPD, but experience does not guarantee accuracy. A commander with 20 years of experience can have deeply ingrained but wrong pattern libraries. The RPD model, as typically presented, has no mechanism for evaluating the quality of the pattern library, only the structure of the decision process.

For agent systems, this is critical: a system that implements RPD faithfully can be fast, efficient, confident, and wrong. The quality of the system depends not on how well it implements recognition-primed reasoning, but on how well-calibrated its pattern library is.

## The Contingency Approach Evidence Base: Strengths and Limits

The CA draws on a larger case bank — numerous documented crises across many countries and contexts. But its evidentiary problems are different:

### The Unverifiable Meta-Analysis Problem

> "No meta-analysis has been identified that supports decision-making characteristics and it has been impossible to retrieve the background to the statements regarding crisis decision making presented by Rosenthal et al. (1989b)." (Njå & Rake, p. 14)

The crisis decision pathologies catalogued earlier — centralization, commitment persistence, groupthink — are presented as empirical findings. But Njå and Rake cannot locate the original evidence that supports them. The claims are presented with confidence in the research literature, but the underlying data is not retrievable for independent verification. The field has been citing these findings for decades, but no one has gone back to verify the original case analyses.

### The Case Study Generalization Problem

> "Drawing conclusions on causal explanations based on the factors existing in one case could be misleading. The factors do not need to be present in similar cases, nor is it possible to treat partial effects in case studies." (Njå & Rake, p. 14)

Case studies are excellent for generating hypotheses and developing thick descriptions. They are poor for establishing causal claims. The CA has generated an impressive library of cases, but without meta-analysis or controlled comparison, it cannot establish which factors in those cases are causally relevant versus incidentally present.

## Implications for Building Agent Systems on These Foundations

### 1. Treat Models as Heuristics, Not Laws

The RPD model and the CA pathology list are not established facts about how decision-making works. They are *useful heuristics* — well-grounded in observation, coherent as explanations, predictively useful in many contexts, but not proven in the way that physical laws are proven.

Agent systems built on these models should treat them accordingly: as strong starting points that should be updated as operational data accumulates, not as fixed truths that should be implemented and left alone.

### 2. Build Validation Into the System

Neither the RPD model nor the CA provides agent systems with a way to verify whether their implementation is accurate. This verification must be built in:

- Compare predicted agent behavior (based on the model) with actual behavior in logged executions
- Track cases where the system's reasoning didn't match the RPD structure — situations where it generated and compared multiple options rather than recognizing and simulating one, or where expectancy monitoring wasn't triggered
- Compare the pathology predictions of the CA against system behavior under stress: does the system actually centralize under load? Does it show commitment persistence?

### 3. The "Good/Bad Decision" Gap Must Be Filled

Since the RPD model doesn't distinguish good from bad pattern libraries, agent systems must supply this distinction themselves. Every pattern in the library should be associated with a performance history: on what fraction of past invocations did this pattern produce the expected outcome? How does that fraction vary with context?

This is outcome-linked knowledge representation — not just "here is the pattern and response" but "here is how reliable this pattern-response link has proven across its deployment history."

### 4. Domain Specificity Must Be Respected

The cross-domain generality of the RPD model is a research convenience, not a guarantee of applicability. Every domain has features that make its decision requirements distinctive. An agent system deployed in a specific domain (code review, security auditing, financial analysis) should not assume that RPD principles derived from fireground command transfer without verification.

Domain-specific validation should establish:
- Does recognition-primed (serial, first-option-tested) decision-making actually outperform option-comparison approaches in this domain?
- What does "situation recognition" look like in this domain's vocabulary?
- What are the domain-specific failure modes when RPD is applied incorrectly?

### 5. Humility About What We Don't Know

The deepest lesson of Njå and Rake's methodological critique is that **we know less about how good decisions are made than we think we do**. The research looks more settled than it is. The models look more validated than they are. The knowledge base looks more complete than it is.

For agent system design, this argues for:
- Conservative defaults: when in doubt, prefer the approach that fails gracefully over the approach that might perform brilliantly but fails hard
- Explicit uncertainty acknowledgment in high-stakes decisions
- Ongoing evaluation rather than one-time validation
- Preserving human oversight for the tail of the distribution — the novel, high-stakes situations where the models are most likely to be wrong

The alternative — building a system on the assumption that decision-making research is settled and complete — is to build a system that is confidently miscalibrated in the precisely those cases where it most needs to be right.