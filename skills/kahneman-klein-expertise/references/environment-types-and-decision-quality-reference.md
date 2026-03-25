# Reference Card: Environment Types and Decision Quality in Agent Systems

## Purpose

This reference card synthesizes Kahneman and Klein's framework for rapid-access use during agent system design, routing decisions, and output evaluation. It is designed to be loaded on demand when an agent needs to make or assess judgments about the reliability of a decision, assessment, or forecast.

---

## Environment Validity Spectrum

### Zero-Validity Environments
**Definition**: No stable cue-outcome relationships exist. Even with perfect information and unlimited analysis, outcomes are not predictably better than chance.

**Characteristics**:
- Outcomes depend heavily on complex, uncapturable dynamics
- Valid predictive information, if it existed, would be rapidly arbitraged away
- Long feedback loops that cannot be closed reliably
- High noise-to-signal ratio in available data

**Examples from the paper**: Long-term political forecasting ("large-scale historical developments are too complex to be forecast," p. 520), individual stock prediction ("if such valid information existed, the price of the stock would already reflect it," p. 520)

**Agent system implication**:
- Do not invoke "expert judgment" agent skills for these tasks — no amount of training produces genuine skill here
- Prefer null model / base rate responses with explicit uncertainty
- Flag to downstream agents and end users: this is a structurally unpredictable domain
- If prediction is required, use statistical models with appropriate confidence intervals, never point estimates

---

### Low-Validity Environments
**Definition**: Weak statistical regularities exist but are too subtle for reliable human detection. Below-chance performance is rare; above-chance performance by humans is inconsistent.

**Characteristics**:
- Some cue-outcome correlation exists but is weak
- Human inconsistency dominates over any genuine signal
- Feedback is available but noisy and delayed
- Base rates of key outcomes are low

**Examples from the paper**: Loan default prediction (before algorithmic replacement), clinical diagnosis in psychiatry (most sub-tasks), college admissions prediction

**Agent system implication**:
- Algorithmic/statistical approaches outperform pattern-recognition agent skills here
- The algorithm's advantage comes from consistency, not superior cue detection
- Apply algorithms with appropriate base-rate calibration
- Monitor for distribution shift that would render the algorithm obsolete

---

### Medium-Validity Environments
**Definition**: Genuine, learnable regularities exist. Expert pattern recognition can develop. Outcomes are substantially uncertain but skill reliably improves success rates.

**Characteristics**:
- Stable cue-outcome relationships that skilled practitioners learn to detect
- Substantial uncertainty remains even for experts
- Outcomes are reliably influenced by skill even though they are not determined by it
- Valid cues exist that are difficult to formalize algorithmically (tacit knowledge dimension)

**Examples from the paper**: Firefighting (building stability assessment, fire spread prediction), medicine (most diagnostic sub-tasks), poker, warfare

**Agent system implication**:
- Expert pattern recognition agent skills are most valuable here
- Use RPD-style architecture: recognize → simulate → accept/modify/reject
- Anomaly detection is critical: cases that don't match known patterns need deliberate analysis mode
- Fractionation risk is high: validate that the specific sub-task being invoked is within the skill's trained range

---

### High-Validity / Near-Ceiling Environments
**Definition**: Almost perfect predictability exists. Correct answers are nearly always achievable with sufficient attention. Human inconsistency and attention lapses are the primary error source.

**Characteristics**:
- Fixed rules with complete or near-complete coverage
- Rapid, unambiguous feedback
- Deterministic or near-deterministic cue-outcome relationships
- Algorithmic formalization is both possible and superior

**Examples from the paper**: Syntax checking, chess tactical calculation (in specific positions), airport automated transport systems

**Agent system implication**:
- Deterministic algorithms or deterministic agent skills outperform probabilistic judgment
- Human inconsistency is the main risk — automated systems eliminate it
- Automation bias is a concern: human supervisors will disengage and may miss the rare failures
- Design for the exceptional case, not the common case

---

### Wicked Environments
**Definition**: Feedback exists but is systematically misleading. Skills are acquired, but the wrong skills. Confident expertise develops that is systematically wrong.

**Characteristics**:
- Self-fulfilling patterns: the agent's own behavior influences the feedback
- Proxy metrics that diverge from true outcome
- Confounded feedback loops
- Local optimization that contradicts global outcome

**Example from the paper**: The early-20th-century physician who predicted typhoid correctly but transmitted it through his examination process, producing "disastrously self-fulfilling" intuitions (p. 520, citing Hogarth 2001)

**Agent system implication**:
- Actively audit feedback loops for confounds before trusting them as training signals
- Watch for reward hacking: agent behavior that optimizes the metric without optimizing the goal
- Periodic out-of-distribution evaluation to detect systematic biases
- Premortem reviews of training procedures, not just model outputs

---

## Quick Routing Decision Matrix

| Task Validity | Feedback Quality | Human Expert Track Record | Recommended Approach |
|---|---|---|---|
| Zero | Any | None possible | Null model + base rate + explicit uncertainty |
| Low | High | Poor | Statistical algorithm with consistency enforcement |
| Low | Low | Poor | Ensemble + explicit low-confidence flagging |
| Medium | High | Strong | Expert agent skill (RPD-style) + simulation validation |
| Medium | Low | Variable | Expert agent + secondary review + fractionation check |
| High | High | Strong | Algorithmic / deterministic skill |
| Wicked | Any | Systematically biased | Adversarial review + assumption audit + alternative formulation |

---

## Confidence Calibration Rules

**Rule 1**: Never use raw confidence scores as validity proxies. Confidence measures internal coherence, not accuracy. In low-validity environments, high coherence produces high confidence that is worthless.

**Rule 2**: Adjust reported confidence by:
- Structural confidence (based on environment validity and training quality)
- Domain-boundary proximity (in-domain = full confidence; boundary-adjacent = discounted; out-of-domain = minimum)
- Feedback quality (if the training signal was noisy, discount proportionally)

**Rule 3**: High confidence + low environmental validity = illusion of validity. Treat as a warning signal, not a reliability indicator.

**Rule 4**: Consistent agreement among multiple agents drawing on the same information source does not increase accuracy. It increases coherence confidence while accuracy remains unchanged. Seek diverse, independent sources for calibration.

---

## The Premortem Protocol (Quick Reference)

**When to invoke**: Before any high-confidence, high-stakes, or irreversible output.

**Protocol**:
1. Stipulate that the proposed output/plan has failed completely
2. Generate 3-5 specific, distinct failure modes (not variations on one failure)
3. Identify which failures stem from: environmental invalidity / skill boundary overextension / systematic bias / external factors
4. For each failure mode, estimate its prior probability
5. Adjust output confidence downward proportional to failure mode density and plausibility
6. Return confidence-adjusted output with explicit notation of primary failure risks

**Purpose**: Bypass the internal-coherence trap. Force generation of inconsistent information that calibrates confidence.

---

## Key Quotes for On-Demand Access

**On the limits of confidence as a signal**:
> "Subjective confidence is often determined by the internal consistency of the information on which a judgment is based, rather than by the quality of that information." (p. 522)

**On the two conditions for genuine expertise**:
> "Two conditions must be satisfied for skilled intuition to develop: an environment of sufficiently high validity and adequate opportunity to practice the skill." (p. 520)

**On what intuition actually is**:
> "The situation has provided a cue: This cue has given the expert access to information stored in memory, and the information provides the answer. Intuition is nothing more and nothing less than recognition." (Simon, 1992, cited p. 519)

**On fractionated expertise**:
> "We believe that the fractionation of expertise is the rule, not an exception." (p. 522)

**On when algorithms win**:
> "The correct conclusion is that people perform significantly more poorly than algorithms in low-validity environments." (p. 523)

**On automation bias**:
> "Human operators become more passive and less vigilant when algorithms are in charge." (p. 524)

**On true expertise and self-knowledge**:
> "True experts, it is said, know when they don't know. However, nonexperts (whether or not they think they are) certainly do not know when they don't know." (p. 524)

---

## Practical Summary: Questions to Ask Before Trusting Any Output

1. What environment type is this judgment being made in?
2. Was this skill trained with adequate feedback specifically for this sub-task?
3. Is this an in-domain invocation or a domain-boundary invocation?
4. What does high confidence actually indicate here — genuine expertise or internal coherence in a low-validity domain?
5. Has a premortem been run? If not, is the stakes level sufficient to require one?
6. Are confidence scores being propagated downstream with appropriate provenance metadata?
7. Is the feedback loop for monitoring this skill's performance free from confounds?