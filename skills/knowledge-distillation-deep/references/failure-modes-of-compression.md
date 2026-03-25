# Failure Modes of Compression: When Smaller Models Catastrophically Fail

## The Illusion of Accuracy Metrics

Standard evaluation of knowledge distillation reports top-1 or top-5 accuracy:
- Teacher: 95% accuracy
- Student: 92% accuracy
- Conclusion: "Only 3% accuracy loss!"

But this aggregate metric masks catastrophic failures. Hooker et al. (2019, 2020) exposed that compressed models don't lose accuracy uniformly—they suffer **disproportionate performance degradation on specific subgroups**:

1. **Rare classes**: Underrepresented in training data
2. **Difficult examples**: Near decision boundaries
3. **Outliers**: Unusual feature combinations
4. **Adversarial inputs**: Deliberately crafted to exploit weaknesses

The paper states: "measures like top-1 and top-5 accuracy masks some of the pitfalls of model compression techniques... compressed models are less robust to changes in data."

This is not a minor technical detail. It's a fundamental failure mode that makes compressed systems unsuitable for deployment in domains where worst-case performance matters.

## Failure Mode 1: Bias Amplification

### The Mechanism

Compression works by removing parameters (weights, neurons, layers). Optimization algorithms preferentially remove parameters that:
- Have small magnitudes
- Contribute little to average loss
- Represent rare patterns

But "rare patterns" often correspond to minority classes or edge cases. When these parameters are removed, the model's **existing biases are amplified**:
- Teacher: 95% accuracy on majority class, 75% accuracy on minority class
- Student: 94% accuracy on majority class, 55% accuracy on minority class

The student maintains high average accuracy (91%) by specializing on the majority class at the expense of minority class performance.

### Documented Examples

From Hooker et al. (2020):
- ImageNet compression reduced top-1 accuracy by 4% overall
- But reduced accuracy by **12% on the least-represented 10% of classes**
- Fairness metrics (demographic parity, equalized odds) degraded by 2-3×

From the knowledge distillation survey:
- Min et al. (2019): 99.44% reduction in size, only 0.607% accuracy loss (seems excellent)
- But: Not evaluated on per-class basis. Likely fails catastrophically on rare classes.

### Application to Agent Systems

When distilling specialized skills:

**Dangerous scenario**: A "code security auditing" skill compressed by 90%:
- Maintains 95% accuracy on common vulnerabilities (SQL injection, XSS)
- Drops to 60% accuracy on rare vulnerabilities (race conditions, side-channel attacks)
- Average accuracy: 91% (seems acceptable)
- **Reality**: System is blind to sophisticated attacks

**Mitigation strategy**:
1. Evaluate compressed agents on per-class basis, not just averages
2. Use minimum per-class accuracy as a hard constraint
3. Weight rare class losses higher during distillation:
   ```python
   loss = sum(weight[class_i] * loss[class_i] for class_i in all_classes)
   weight[class_i] = 1 / frequency[class_i]  # Rare classes get high weight
   ```
4. Create separate specialized micro-agents for rare cases, not one compressed generalist

## Failure Mode 2: Brittleness to Input Variation

### The Mechanism

Large models learn robust features that activate across variations:
- A cat detector learns: fur texture, whiskers, ear shape, eye patterns
- Even if some features are obscured (cat in shadow, cat from behind), others activate

Small models have fewer parameters, so they learn **more brittle features**:
- Compressed cat detector learns: pointy ears + fur texture
- If ears are occluded, the model fails (doesn't have enough capacity for backup features)

Hooker et al. (2019) showed compressed models suffer larger accuracy drops when:
- Images are rotated, translated, or scaled
- Lighting conditions change
- Backgrounds are swapped
- Subtle adversarial perturbations are added

### Documented Examples

From the paper:
- Polino et al. (2018): Quantized distillation (2-bit weights) reduced accuracy by only 0.18%
- **But**: Not evaluated on augmented test data. Likely fails on out-of-distribution inputs.

From broader literature (cited in the paper):
- Compressed models' adversarial robustness drops by 10-15% even when standard accuracy is preserved
- Small input perturbations cause 3-5× higher failure rates

### Application to Agent Systems

**Dangerous scenario**: A "bug detection" agent compressed to fit on-device:
- Works well on clearly buggy code (null pointer dereferences, syntax errors)
- Fails on subtle bugs (race conditions, off-by-one errors, logic flaws)
- Fails when code uses unusual syntax (macros, templates, metaprogramming)

**Mitigation strategy**:
1. Evaluate compressed agents on **adversarial test sets**:
   - Deliberately obfuscated inputs
   - Edge cases at distribution boundaries
   - Inputs designed to confuse the specific compressed architecture
2. Implement **ensemble of diverse compressed agents**:
   - Agent 1: Compressed CNN (good at local patterns)
   - Agent 2: Compressed Transformer (good at global context)
   - Agent 3: Compressed rule-based system (good at explicit constraints)
   - If they disagree, escalate to larger model or human
3. Use **confidence thresholds tuned per input complexity**:
   ```python
   if input_complexity < LOW:
       threshold = 0.7  # Allow compressed agent to decide
   elif input_complexity < MEDIUM:
       threshold = 0.85  # Higher confidence required
   else:
       threshold = 0.95  # Near-certain or escalate
   ```

## Failure Mode 3: Capacity Cliff

### The Mechanism

There's a non-linear relationship between model size and performance. Small reductions (50% → 40%) may cause linear accuracy drops (95% → 94%). But further reductions (40% → 10%) cause **catastrophic collapse** (94% → 75%).

The paper documents this in Table 1:
- Walawalkar et al. (2020) on CIFAR-100 with ResNet44:
  - 62.84% size: 69.12% accuracy (2.64% drop from teacher)
  - 35.36% size: 67.04% accuracy (4.72% drop)
  - 15.25% size: 62.87% accuracy (8.89% drop)
  - 3.74% size: 43.11% accuracy (**28.65% drop**)

The 15.25% student is at the "sweet spot"—further compression causes catastrophic failure.

### Why This Happens

Neural networks have **minimum capacity requirements** for representing certain functions. Below this threshold, the network fundamentally cannot learn the mapping, no matter how long you train.

Example: XOR function requires at least 2 hidden neurons in a fully connected network. A network with 1 hidden neuron cannot learn XOR, period. No amount of training helps.

For complex tasks (image recognition, natural language), the minimum capacity is unknown but substantial. Compressing below it causes complete failure.

### Application to Agent Systems

**Dangerous scenario**: A system architect decides "all skills must be under 10MB for mobile deployment":
- Simple skills (syntax checking, formatting): 10MB is plenty, works fine
- Complex skills (semantic code analysis, security auditing): 10MB is below capacity threshold, fails catastrophically

**Mitigation strategy**:
1. **Profile the capacity cliff** for each skill:
   - Train 10 students at different compression levels (100%, 50%, 25%, 10%, 5%, 1%)
   - Plot accuracy vs. size
   - Identify the "knee" of the curve (point where accuracy drops sharply)
   - Set minimum size constraint above the knee
2. **Stratify deployment targets**:
   - Tier 1 skills (simple): Heavy compression allowed
   - Tier 2 skills (moderate): Moderate compression
   - Tier 3 skills (complex): Minimal compression, requires server deployment
3. **Implement graceful degradation**:
   - If a compressed agent's confidence is below threshold, return "unable to process" rather than a wrong answer
   - Route to larger agent or human rather than failing silently

## Failure Mode 4: Knowledge Forgetting in Online Distillation

### The Mechanism

Online distillation (agents learning from each other simultaneously) can cause **catastrophic forgetting**: as agents learn new patterns from peers, they overwrite previously learned patterns.

Scenario:
1. Agent A learns feature X well (early in training)
2. Agent B learns feature Y well (slightly later)
3. Agent A learns from Agent B, focusing on feature Y
4. Agent A forgets feature X (parameters overwritten)
5. Now no agent knows feature X well

This is especially problematic when agents have limited capacity—they can't learn all features simultaneously, so they must choose which features to prioritize based on peer signals.

### Documented Examples

The paper doesn't explicitly document forgetting in online distillation, but it's a known failure mode in continual learning. Methods like:
- Gradual distillation (Min et al., 2019): Learn from checkpoints sequentially
- Born-Again Networks (Furlanello et al., 2018): Ensemble of students prevents single point of failure

...are implicitly designed to mitigate forgetting.

### Application to Agent Systems

**Dangerous scenario**: A multi-agent system where agents co-evolve:
- Agents collectively learn to handle common cases very well
- Agents forget how to handle rare cases (no peer reinforcement)
- System becomes optimized for throughput, brittle to edge cases

**Mitigation strategy**:
1. **Implement experience replay**:
   - Store difficult examples in a buffer
   - Periodically retrain agents on buffer to prevent forgetting
2. **Use elastic weight consolidation**:
   - Identify parameters important for rare cases
   - Penalize changes to those parameters when learning new patterns
3. **Maintain specialist agents**:
   - Agent 1: General-purpose (co-evolves with peers)
   - Agent 2: Rare-case specialist (trained offline, frozen)
   - Route rare cases to Agent 2, common cases to Agent 1

## Failure Mode 5: The Averaging Fallacy

### The Mechanism

When multiple compressed agents form an ensemble, averaging their predictions can mask individual failures:
- Agent 1: 90% confident in wrong answer
- Agent 2: 60% confident in wrong answer
- Agent 3: 40% confident in correct answer
- Average: 63% confident in wrong answer

The ensemble is confidently wrong. This happens when all agents share the same systematic bias (from being distilled from the same teacher or trained on the same data).

### Application to Agent Systems

**Dangerous scenario**: System uses 5 compressed agents to form an ensemble:
- All agents distilled from the same teacher
- All agents inherit teacher's bias on minority classes
- Ensemble amplifies bias instead of correcting it

**Mitigation strategy**:
1. **Diversify ensemble sources**:
   - Distill from different teachers (trained on different data splits)
   - Use different student architectures (CNNs, transformers, etc.)
   - Apply different augmentations during distillation
2. **Weight by uncertainty calibration**:
   - Agents that are frequently overconfident get lower weight
   - Agents that are well-calibrated (confidence matches accuracy) get higher weight
3. **Detect systematic agreement**:
   - If all agents agree with >95% confidence, flag for human review
   - High agreement on common cases is expected
   - High agreement on rare cases suggests shared blind spot

## Practical Recommendations for Failure Prevention

### 1. Multi-Metric Evaluation

Don't rely on aggregate accuracy. Evaluate:
- Per-class accuracy (especially minority classes)
- Worst-case accuracy (bottom 10% of classes)
- Fairness metrics (demographic parity, equalized odds)
- Robustness to input perturbations
- Calibration error (confidence vs. actual accuracy)

### 2. Adversarial Testing

Create test sets designed to exploit compression failures:
- Edge cases at class boundaries
- Rare feature combinations
- Out-of-distribution inputs
- Adversarially perturbed inputs

### 3. Conservative Deployment

Start with larger compressed models, even if they don't meet size targets:
- Deploy 50% compression initially
- Monitor production performance on rare cases
- Gradually increase compression only if rare-case performance is maintained
- **Never** compress below the capacity cliff identified in profiling

### 4. Ensemble Diversity

If using ensembles:
- Diverse initializations (different random seeds)
- Diverse architectures (different model families)
- Diverse training data (different augmentations, different subsets)
- Monitor within-ensemble correlation (high correlation = redundant, low diversity)

### 5. Fallback Mechanisms

Implement graceful degradation:
- Compressed agent attempts task
- If confidence < threshold, escalate to medium agent
- If still uncertain, escalate to full teacher or human
- Track escalation rate to detect systematic failures

### 6. Continuous Monitoring

In production:
- Log all predictions with confidence scores
- Segment performance by input characteristics
- Alert when per-segment accuracy drops below baseline
- Retrain/re-distill when performance degradation detected

## The Fundamental Tradeoff

Compression is not free. Every parameter removed is information lost. The art of knowledge distillation is finding the **minimum information loss** for a given size constraint.

But the paper and broader research make clear: **some tasks have minimum capacity requirements**. Below that threshold, no amount of clever distillation helps. The model fundamentally cannot represent the function.

For agent systems, this means:
- Some skills cannot be compressed arbitrarily (e.g., complex reasoning)
- Some skills can be compressed heavily (e.g., simple pattern matching)
- Deployment constraints must be matched to task complexity
- One-size-fits-all compression policies will fail

The distillation metric (DS) helps quantify this tradeoff, but it must be evaluated honestly—on worst-case performance, not just averages.