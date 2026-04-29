# Learning From Expert Disagreement: How Agents Can Develop Judgment Without Ground Truth

## The Problem with Ground Truth in Complex Domains

Most AI training paradigms assume ground truth: supervised learning requires labeled correct answers, reinforcement learning requires reward signals that distinguish success from failure. But in the complex, ambiguous domains where multi-agent orchestration is most needed—system architecture design, security risk assessment, strategic planning, debugging subtle production issues—there often *isn't* ground truth. There's only expert judgment, and experts sometimes disagree.

The ShadowBox method embraces this reality explicitly. Klein et al. write: "Hintze found a strong consensus for many of the boxes, but never achieved 100% convergence. In some cases the experts did not reach a strong consensus, and Hintze let the trainees know about any strong minority position that had emerged. He made it clear that there was no ground truth for any of the answers."

This is profound. Rather than treating expert disagreement as noise or data quality problems, the method treats it as signal—as information about the legitimate ambiguity of the domain. Trainees learn that expertise isn't about knowing "the answer"; it's about developing **defensible judgment** in situations where multiple reasonable perspectives exist.

Hintze's panel of 14 fire chiefs showed "strong consensus for many of the boxes" but "never achieved 100% convergence." The method communicated both majority and "any strong minority position that had emerged" to trainees. This teaches a sophisticated understanding: sometimes experts converge strongly (high confidence these priorities matter), sometimes they diverge (legitimate disagreement about what's most important), and the pattern of agreement/disagreement itself is informative.

## What Trainees Learn From Expert Disagreement

When trainees see that experts disagree, they learn several crucial lessons:

**1. Expertise Is About Rationale Quality, Not Answer Correctness**
If Expert A prioritizes action X and Expert B prioritizes action Y, what matters isn't which answer is "right" but whether each expert can articulate a defensible rationale. Trainees learn to evaluate: What considerations does this expert's rationale address? What evidence does it cite? What assumptions does it make explicit?

**2. Context Sensitivity Matters**
Expert disagreement often reflects different assumptions about context. One expert may prioritize speed because they assume time pressure; another may prioritize thoroughness because they assume safety criticality. Trainees learn to ask: What contextual factors might make one approach better than another?

**3. Risk Tolerance and Values Are Legitimate Variables**
Some expert disagreement reflects different risk preferences, not different competence. One expert may favor conservative approaches (minimizing downside risk), another aggressive approaches (maximizing upside potential). Trainees learn that expertise includes value judgments, not just factual assessments.

**4. Multiple Paths Can Lead to Success**
Expert disagreement at decision point 3 doesn't mean one expert is wrong—it may mean different strategies can both work. Trainees learn that expertise involves choosing *a* defensible path, not finding *the* uniquely correct path.

This nuanced understanding of expertise is precisely what's missing from most AI training paradigms, which assume: if the model's output doesn't match the label, the model is wrong. In complex domains, this assumption breaks down.

## Translation to Agent Systems: Learning From Expert Panel Variance

For multi-agent systems, this suggests a fundamental shift in how we think about agent improvement:

**Traditional Paradigm**: Agent output should match ground truth label
**ShadowBox Paradigm**: Agent rationale should address considerations that expert panels identify as central, even if experts disagree on conclusions

This enables learning in domains where ground truth doesn't exist or is unknowable:
- Architecture design: No way to know if Design A or Design B is "better" until system is built and operated for years
- Security risk assessment: No ground truth about which risks are most critical until attacks happen (or don't)
- Strategic planning: No ground truth about optimal strategy until future unfolds
- Debugging: Multiple root causes may be plausible; which one is "correct" may be unknowable or context-dependent

### Practical Implementation: Expert Panel as Distribution

Rather than training agents to match a single expert or consensus answer, we can train them to match the *distribution of expert responses*:

**Collect Expert Panel Data**
For a given decision scenario:
- 7 experts provide responses
- 5 experts prioritize action X first
- 2 experts prioritize action Y first
- Expert rationales reveal: X-prioritizers emphasize speed, Y-prioritizers emphasize safety

**Agent Calibration Against Distribution**
Agent encounters the same scenario and provides:
- Agent's priority: Y
- Agent's rationale: [cites safety concerns]

**Calibration Feedback**
"You prioritized Y (safety-focused approach). This aligns with 2/7 experts who also prioritized Y with similar rationale. However, 5/7 experts prioritized X (speed-focused approach). Their rationale emphasized: [time pressure, resource constraints, reversibility of decision]. Consider: Does your context assessment differ from the majority? Are you overweighting certain risks?"

The agent isn't told it's wrong. It's told where it fits in the expert distribution and prompted to reflect on whether its divergence is defensible.

**Multi-Agent Consensus Seeking**
In WinDAGs orchestration, we could implement:
- Multiple agents evaluate the same decision independently (like the expert panel)
- System collects their responses and rationales
- When agents disagree, system facilitates: "Agent A prioritizes X because [rationale]. Agent B prioritizes Y because [rationale]. What considerations should determine which approach fits this context?"

This models how expert teams actually work: through discussion of competing perspectives, surfacing of implicit assumptions, and collective judgment refinement.

## Rationale Quality as the Training Signal

If there's no ground truth answer, what's the learning target? The ShadowBox method points to: **rationale quality**.

Klein et al. emphasize that experts provide not just responses but "rationale for their decisions" and trainees "compare the rationale" not just the answers. The training materials include "the rationale for the experts' answers" and trainees must "describe the differences" in both content and reasoning.

For agents, this means:
- Don't just compare agent decision to expert decision
- Compare agent rationale to expert rationale
- Evaluate: Does agent rationale address the considerations experts identify as central?

### Operationalizing Rationale Quality

What makes a rationale high-quality in a domain without ground truth?

**1. Consideration Coverage**
Does the rationale address key considerations that experts identify? If experts consistently mention factors A, B, and C, does the agent's rationale address these factors (even if weighting them differently)?

**Measurement**: Semantic similarity between agent rationale and expert rationales; coverage of expert-mentioned concepts.

**2. Evidence Citation**
Does the rationale cite specific evidence or observations from the scenario? Experts ground their reasoning in details; novices offer vague generalizations.

**Measurement**: Presence of specific references to scenario elements; grounding in observable facts vs. unsupported assertions.

**3. Assumption Explicitness**
Does the rationale make assumptions explicit? Experts often disagree about assumptions (time pressure, resource constraints, risk tolerance); making these explicit enables productive disagreement.

**Measurement**: Presence of conditional statements ("assuming X, then..."); explicit acknowledgment of unknowns.

**4. Alternative Awareness**
Does the rationale acknowledge alternative perspectives? Expert-level thinking recognizes trade-offs; novice thinking presents single paths.

**Measurement**: Presence of "trade-off" language; acknowledgment of downsides to chosen approach or upsides to rejected approaches.

**5. Context Sensitivity**
Does the rationale explain why this judgment fits this context? Expert judgment is situational; novice thinking applies rules rigidly.

**Measurement**: References to context-specific factors; conditional reasoning ("in this scenario... because...").

These can all be computationally assessed, at least approximately, enabling automated calibration feedback focused on rationale quality rather than answer matching.

## When Minority Positions Matter: Teaching Agents About Tail Risks

The ShadowBox method's practice of sharing "any strong minority position" with trainees is particularly important for tail risk management.

Sometimes the majority expert view is optimistic and the minority view flags a critical risk. For example:
- 6/7 experts prioritize speed (typical case reasoning)
- 1/7 expert prioritizes safety check (recognizing rare but catastrophic failure mode)

If we train agents only on majority consensus, we lose tail risk awareness. But the 1/7 expert may be critically important precisely in the unusual case where the catastrophic failure mode is present.

For agent systems, this suggests:
- Track not just consensus but variance in expert responses
- Pay special attention to minority positions that flag risks
- When expert panel shows strong disagreement (e.g., 4-3 split), treat this as high-uncertainty signal requiring extra caution

### Practical Pattern: Uncertainty-Aware Routing

In WinDAGs orchestration:
```
When decomposing task:
  - Collect multiple agent decompositions (simulating expert panel)
  - If decompositions converge (high agreement): proceed with confidence
  - If decompositions diverge (low agreement): 
    - Flag task as high-uncertainty
    - Allocate extra resources/review
    - Require explicit assumption documentation
    - Consider multiple parallel approaches (hedge)
```

This mimics how expert teams handle ambiguous situations: when experts disagree, you don't just pick one answer—you recognize the disagreement as signal that the situation is genuinely ambiguous and requires extra care.

## Expert Convergence as a Signal of Scenario Structure

The pattern of expert agreement/disagreement also provides information about the scenario itself:

**High Expert Convergence** suggests:
- Scenario has clear critical priorities (experts see them)
- Best practices are well-established for this situation type
- Less room for legitimate strategic variation

**Low Expert Convergence** suggests:
- Scenario is genuinely ambiguous or ill-structured
- Multiple valid approaches exist
- Context details that aren't specified would determine best approach
- Domain knowledge may be incomplete

For agents, this means expert variance can be used as a **problem difficulty signal**:

When calibrating against expert panels:
- High variance scenarios = treat as harder, allocate more resources, require more careful reasoning
- Low variance scenarios = treat as more routine, standard approaches apply

This also enables **curriculum design**: train agents first on high-convergence scenarios (where expert patterns are clearest), then progress to low-convergence scenarios (where judgment is more nuanced).

## The Danger of Consensus-Only Training

If we train agents only on consensus expert responses and ignore minority positions, we create blind spots:

**1. Overfitting to Modal Cases**
Agents learn the typical pattern but miss rare but important exceptions. The minority expert who considers unusual risks gets filtered out as noise.

**2. Loss of Diverse Strategies**
Multiple valid approaches collapse into single "best practice" that may not fit all contexts.

**3. Brittleness to Distribution Shift**
When the environment changes such that the minority expert's concerns become central, agents have no exposure to that reasoning pattern.

**4. False Confidence**
Agents may appear highly confident because they've been trained only on cases where experts agreed, but this confidence doesn't reflect the actual ambiguity of many real-world decisions.

## Operationalizing Multi-Expert Calibration in WinDAGs

For a WinDAGs system, practical implementation could involve:

**1. Expert Panel Database**
For key decision types:
- Collect responses from multiple expert practitioners (human or high-performing agent runs)
- Store response distribution, not just consensus
- Store full rationales
- Tag with context factors that influenced disagreement

**2. Calibration at Decision Points**
When an agent reaches a key decision:
- Agent generates its response + rationale
- System retrieves expert panel distribution for similar scenarios
- System presents:
  - Where agent's response fits in expert distribution
  - Key considerations in majority rationale
  - Key considerations in minority rationale (if exists)
  - Assessment of agent's rationale quality (consideration coverage, evidence citation, etc.)

**3. Adaptive Confidence Based on Expert Variance**
- If expert panel showed high consensus: agent can proceed with confidence
- If expert panel showed high variance: agent should flag uncertainty, document assumptions, consider hedging strategies

**4. Long-Term Learning Metrics**
Track over time:
- Is agent response distribution converging toward expert response distribution?
- Is agent rationale quality improving (better consideration coverage, evidence citation, etc.)?
- Is agent appropriately calibrated (confident when experts converge, uncertain when experts diverge)?

## Boundary Conditions: When Expert Panels Mislead

The expert panel approach has limitations:

**1. Systemic Expert Bias**
If all experts share a common bias (due to training, culture, institutional incentives), the panel consensus may be collectively wrong. "Industry best practices" sometimes lead entire industries astray.

Implication: Need mechanisms for detecting systemic bias—track long-term outcomes, compare expert panels from different organizational cultures, include "outside view" experts who aren't embedded in the domain.

**2. Rapidly Evolving Domains**
In domains with fast-changing technology or threats, expert judgment rapidly becomes outdated. Yesterday's expert consensus may be today's misconception.

Implication: Date-stamp expert panel data, periodically re-calibrate with current experts, weight recent expert judgments more heavily in fast-changing domains.

**3. Lack of Outcome Feedback**
Expert panels reflect expert *beliefs*, not necessarily expert *accuracy*. If experts rarely get clear feedback on their decisions (because outcomes are delayed or ambiguous), expert consensus may drift from actual effectiveness.

Implication: Where possible, supplement expert panel calibration with outcome-based calibration. If agent rationale differs from experts but outcomes are good, this is valuable signal.

**4. Expert-Novice Gaps Too Large**
If the gap between current agent capability and expert capability is very large, expert rationales may be incomprehensible—they reference patterns the agent has no exposure to.

Implication: Need staged calibration—start with "journeyman" level experts whose reasoning is closer to current agent capability, progress to master-level experts as agent improves.

## Conclusion: Judgment Development Without Ground Truth

The ShadowBox method's treatment of expert disagreement reveals a path forward for training agents in domains where ground truth doesn't exist:

1. **Collect expert panels, not single experts**: Capture response distributions and rationale variance
2. **Calibrate agents against distributions**: Show where agent fits in expert response space, not whether agent matches "the answer"
3. **Focus on rationale quality**: Evaluate whether agent addresses considerations experts identify, not whether agent reaches same conclusion
4. **Use disagreement as signal**: When experts diverge, this indicates genuine ambiguity requiring extra care
5. **Preserve minority positions**: Tail risk awareness often comes from minority expert perspectives
6. **Enable multi-agent deliberation**: Model expert team dynamics where competing perspectives are surfaced and discussed

This enables agent learning and improvement even in domains where we can't define ground truth—which describes most of the complex, high-stakes problems that multi-agent systems are designed to tackle.