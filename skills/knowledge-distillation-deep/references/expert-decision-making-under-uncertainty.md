# Expert Decision-Making Under Uncertainty: Soft Labels and Dark Knowledge

## The Problem: Hard Labels Discard Information

In traditional supervised learning, models learn from **hard labels**: one-hot encoded vectors that represent absolute certainty.

Example for image classification:
- Input: Image of a cat
- Hard label: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]  (1 at position "cat," 0 everywhere else)

This representation assumes perfect certainty: the image is definitely a cat, definitely not a dog, definitely not anything else. But expert systems don't think this way.

An expert looking at an ambiguous image of a cat-like animal might think:
- 70% confident it's a cat
- 25% confident it's a lynx
- 5% confident it's some other feline

This probability distribution contains **rich information about similarity structure**: the expert believes cats and lynxes are similar (both have non-zero probability), but cats and cars are dissimilar (car probability is effectively zero).

## Hinton's Insight: Soft Labels as Dark Knowledge

Hinton, Vinyals & Dean (2015) introduced the foundational concept: **the relative probabilities of incorrect answers** contain valuable knowledge about how an expert model generalizes. They called this "dark knowledge" because it's not present in the training labels—it emerges from the model's learned internal structure.

**Soft labels** are the probability distribution over all classes that a trained model outputs:
- Hard label: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
- Soft label: [0.01, 0.01, 0.02, 0.89, 0.03, 0.01, 0.01, 0.01, 0.005, 0.005]

The soft label reveals:
1. The model is very confident (0.89) but not absolutely certain
2. The model thinks some confusion with class 4 (0.03) is possible
3. The model has learned that classes 2 and 4 are somewhat similar to class 3

### Temperature Scaling: Amplifying Uncertainty

To make soft labels more informative, Hinton introduced **temperature scaling**:

**logit_i = z_i / T**
**soft_label_i = exp(logit_i) / Σ_j exp(logit_j)**

Where:
- z_i is the raw logit (pre-softmax score) for class i
- T is temperature (T=1 is standard softmax, T>1 "softens" the distribution)

Example with T=1 (standard):
- Logits: [1.0, 2.0, 5.0]
- Probabilities: [0.02, 0.05, 0.93]

Example with T=5 (high temperature):
- Logits: [0.2, 0.4, 1.0]
- Probabilities: [0.18, 0.22, 0.40]

High temperature makes the distribution more uniform, exposing subtle similarities. At T=20, even the third-place class gets significant probability (0.22), revealing that the model learned some relationship between class 1 and class 3.

**For agent systems**: When a specialized agent provides a recommendation, it should expose:
1. Its top prediction (hard decision)
2. Its full probability distribution (soft decision)
3. Temperature-scaled distributions at multiple temperatures (revealing different levels of confidence)

A security auditing agent that says "this is a SQL injection vulnerability" (hard label) is less informative than one that says:
- 0.7: SQL injection
- 0.2: Cross-site scripting (similar attack vector)
- 0.08: Buffer overflow (different but also exploits input handling)
- 0.02: Legitimate code pattern

The distribution reveals that the agent believes SQL injection and XSS are related, which helps other agents (or humans) understand the reasoning.

## How Students Learn from Soft Labels

The standard distillation loss combines two terms:

**L_total = α·L_hard + (1-α)·L_soft**

Where:
- L_hard = CrossEntropy(student_prediction, ground_truth)
- L_soft = KL_divergence(student_prediction, teacher_soft_labels)
- α is a weighting parameter (typically 0.1-0.5)

**L_hard** ensures the student learns the correct answer.
**L_soft** ensures the student learns the similarity structure.

### Why This Works: Regularization Through Similarity

Training only on hard labels allows the student to memorize arbitrary decision boundaries. Training on soft labels provides **implicit regularization**: the student must not only predict the correct class, but also maintain the teacher's similarity judgments.

Example: Suppose the teacher learned that "image A" (a cat) and "image B" (a lynx) are similar, so:
- P_teacher(cat | image A) = 0.9, P_teacher(lynx | image A) = 0.08
- P_teacher(lynx | image B) = 0.85, P_teacher(cat | image B) = 0.12

If the student predicts:
- P_student(cat | image A) = 0.99, P_student(lynx | image A) = 0.001
- P_student(lynx | image B) = 0.99, P_student(cat | image B) = 0.001

The student's hard predictions are correct (cat for image A, lynx for image B), so L_hard is low. But the student's soft predictions diverge from the teacher's—it believes cats and lynxes are completely distinct, contradicting the teacher's learned similarity. L_soft is high, penalizing this overly confident boundary.

The distillation loss forces the student to learn: "these classes are mostly distinct, but share some similarities." This prevents overfitting and improves generalization.

## Failure Mode: When Soft Labels Mislead

### Case 1: Teacher Overfitting

If the teacher overfits the training data, its soft labels encode spurious correlations. The student then learns these false patterns.

Example: Teacher trained on a small dataset where all dog images have grass backgrounds might learn:
- P(dog | image with grass) = 0.7
- P(grass | dog) = 0.8 (implicitly)

The soft labels encode the spurious correlation "dogs appear on grass." A student learning from these soft labels will inherit the bias, performing poorly on dogs photographed indoors.

**Mitigation**: Ensure teachers are trained with strong regularization (dropout, data augmentation, early stopping) before distillation. Better yet, use ensemble teachers—averaging soft labels from multiple teachers cancels out individual overfitting.

### Case 2: Architecture Mismatch

If the student's architecture is fundamentally different from the teacher's, the teacher's soft labels may be incompatible with the student's inductive bias.

Example from the paper: Kimura et al. (2019) showed that distilling from a Gaussian Process teacher to a CNN student can improve student performance beyond the teacher. The GP's soft labels encode uncertainty in a way that complements the CNN's structural priors.

But this is fragile. If the student's architecture makes certain similarity judgments impossible (e.g., a linear student can't learn nonlinear similarities), soft labels that assume those similarities will confuse the student.

**Mitigation**: Match student and teacher architectures loosely—same family (both CNNs, both transformers) but different scales. Avoid distilling from fundamentally different model families unless empirically validated on your specific task.

### Case 3: Label Noise

If ground truth labels are noisy, soft labels amplify the noise. The teacher learns to predict the noisy labels with high confidence, and the student learns that high confidence is appropriate even when it shouldn't be.

**Mitigation**: Use label smoothing on the teacher during initial training. Label smoothing replaces hard labels with slightly softened versions (e.g., 0.95 for the correct class, 0.05 distributed over others), which makes the teacher's soft labels more robust.

## Application to Agent Systems: Uncertainty Propagation

### Pattern 1: Cascade with Confidence Thresholds

```python
def cascade_agents(task, agent_hierarchy):
    """Route task through agents from smallest to largest until confident."""
    for agent in sorted(agent_hierarchy, key=lambda a: a.size):
        prediction, soft_labels = agent.predict(task)
        confidence = max(soft_labels)
        
        if confidence > THRESHOLD:
            return prediction
        else:
            # Agent is uncertain, escalate to larger agent
            continue
    
    # Reached largest agent, return its prediction regardless of confidence
    return prediction
```

This implements **adaptive computation**: simple cases are handled by small, fast agents; complex cases escalate to larger, slower agents. The soft labels' maximum value (confidence) determines whether escalation is needed.

### Pattern 2: Uncertainty-Weighted Ensemble

```python
def uncertainty_weighted_ensemble(task, agents):
    """Weight agent contributions by inverse of their uncertainty."""
    predictions = []
    uncertainties = []
    
    for agent in agents:
        soft_labels = agent.predict(task)
        predictions.append(soft_labels)
        
        # Uncertainty = entropy of prediction distribution
        entropy = -sum(p * log(p) for p in soft_labels if p > 0)
        uncertainties.append(entropy)
    
    # Weight by inverse uncertainty (confident agents get more weight)
    weights = [1/u for u in uncertainties]
    weights = [w/sum(weights) for w in weights]  # Normalize
    
    # Weighted average of predictions
    ensemble_pred = sum(w*p for w, p in zip(weights, predictions))
    return ensemble_pred
```

This implements **learned trust**: agents with low entropy (high confidence) get more influence on the final decision. If all agents are uncertain (high entropy), the ensemble averages them equally.

### Pattern 3: Disagreement-Based Active Learning

```python
def active_learning_selector(tasks, agents):
    """Select tasks where agents disagree most for human review."""
    disagreement_scores = []
    
    for task in tasks:
        predictions = [agent.predict(task) for agent in agents]
        
        # Disagreement = variance of predictions
        mean_pred = np.mean(predictions, axis=0)
        variance = np.var(predictions, axis=0)
        disagreement = np.sum(variance)
        
        disagreement_scores.append((task, disagreement))
    
    # Return top-k most disagreed-upon tasks
    disagreement_scores.sort(key=lambda x: x[1], reverse=True)
    return [task for task, _ in disagreement_scores[:k]]
```

When agents disagree on soft labels (high variance), it indicates:
- The task is ambiguous
- Different agents learned different features
- Human expertise might be needed

This implements **selective escalation to humans**: instead of random sampling for labeling, intelligently select tasks where automated agents are collectively uncertain.

## Dark Knowledge Beyond Classification

The paper primarily discusses classification, but the concept of soft labels generalizes:

### Regression: Distribution Over Continuous Values

Instead of a point prediction (y = 5.3), a regression model could output:
- Mean: 5.3
- Variance: 0.8
- Distribution: Gaussian or mixture model

Soft labels for regression contain information about:
- Prediction uncertainty (variance)
- Multimodality (mixture components)
- Asymmetry (skewed distributions)

**For agents**: A "code complexity estimator" agent shouldn't just return "complexity = 23.5" but should return a distribution: "likely between 20-27, with small probability it's as high as 35 if certain edge cases activate."

### Structured Prediction: Dependencies in Output Space

For tasks like parsing, translation, or code generation, outputs are structured (trees, sequences, graphs). Soft labels can encode:
- Alternative parses with different probabilities
- Substructure uncertainties (this token is certain, that token is ambiguous)
- Dependency strengths (this subtree is strongly dependent on that subtree)

**For agents**: A "code refactoring" agent should expose multiple refactoring strategies with confidence scores, plus which suggestions are independent vs. coupled. This allows downstream agents to select refactorings that compose well together.

### Generative Models: Sampling Distributions

Generative models (VAEs, GANs, diffusion models) can distill knowledge through:
- Latent space distributions (which latent codes produce which outputs)
- Generated sample diversity (how many modes the generator learned)
- Conditional dependencies (how varying input affects output distribution)

**For agents**: A "test case generator" agent should expose:
- Multiple generated test cases (not just one)
- Latent representations of each test case (which abstract scenarios they cover)
- Conditional relationships (if you want to test feature X, vary latent dimension Z)

## The Deeper Principle: Uncertainty is Knowledge

The core insight from soft labels and dark knowledge is: **what an expert doesn't know is as informative as what it does know**.

An agent that says:
- "I'm 99.9% confident this is class A"

...is conveying: "I have decisive evidence for class A and essentially no confusion."

An agent that says:
- "I'm 60% confident this is class A, 30% class B, 10% class C"

...is conveying: "The evidence is mixed. A and B are both plausible. C is unlikely but not impossible."

The second agent is more honest and more useful. Downstream agents can:
- Gather more evidence if the decision is important
- Hedge their own predictions appropriately
- Learn which features distinguish A from B (the teacher was uncertain)

For a WinDAG system with 180+ skills, every skill should expose not just its answer, but its uncertainty. Routing decisions, ensemble weights, and human escalation triggers should all depend on these uncertainty estimates.

## Practical Recommendations

1. **Every agent output should include soft labels**, not just hard predictions. Store temperature-scaled versions at T=1, 5, 10, 20 to expose different granularities of similarity.

2. **Log soft label distributions** for all predictions. Analyze which classes are frequently confused (high cross-class probability). These confusions reveal:
   - Missing features in the input
   - Ambiguities in the task definition
   - Opportunities for new specialized agents

3. **Train students with mixed loss**: α·L_hard + (1-α)·L_soft where α decreases during training. Early in training, emphasize hard labels (get the basics right). Late in training, emphasize soft labels (refine similarity structure).

4. **Ensemble teachers before distilling**: Train 3-5 teacher models with different initializations. Average their soft labels. This cancels individual teacher overfitting and produces more robust dark knowledge.

5. **Monitor soft label calibration**: The teacher's confidence scores should match its actual accuracy. If the teacher predicts 0.9 confidence but is only correct 0.7 of the time, its soft labels are miscalibrated and will mislead students. Recalibrate using temperature scaling or Platt scaling before distillation.

6. **Use soft labels for debugging**: When a student fails, compare its soft labels to the teacher's. Large KL divergence indicates the student learned a different similarity structure. Small KL divergence but wrong hard prediction indicates the student learned the structure but is systematically biased.

The fundamental lesson: **expert decision-making under uncertainty is not about making the right choice, but about understanding the space of possible choices and their relative likelihoods**. Systems that encode only final decisions lose this rich structure.