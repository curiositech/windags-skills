---
name: logical-fallacy-detector
description: "Identify, label, and explain logical fallacies in arguments and discourse. Use when the user wants to analyze arguments, check reasoning, evaluate debate claims, spot weak arguments, do debate prep, policy writing, or conflict analysis. Triggers on 'fallacy', 'logical error', 'faulty reasoning', 'argument flaw', 'is this valid', 'check this logic'. Works on both formal deductive errors and informal reasoning mistakes."
---

# Logical Fallacy Detector

## Decision Points

**Primary Decision Tree: Fallacy vs Non-Fallacy**
```
1. Is there a clear argument with claim + support?
   NO → Report "No argument to analyze" 
   YES → Continue to 2

2. Does the support actually connect to the claim?
   NO → Check relevance fallacies (ad hominem, red herring, appeal to emotion)
   YES → Continue to 3

3. Is this a deductive argument with formal structure?
   YES → Check formal fallacies (affirming consequent, denying antecedent)
   NO → Continue to 4

4. Are key terms used consistently throughout?
   NO → Check ambiguity fallacies (equivocation, composition/division)
   YES → Continue to 5

5. Does the argument assume what it's trying to prove?
   YES → Check presumption fallacies (begging question, false dilemma, hasty generalization)
   NO → Likely sound argument, check for minor issues only
```

**Disambiguation Decision Points:**
- **Straw Man vs Red Herring**: Does the arguer misrepresent the opponent's position (straw man) OR simply change the subject entirely (red herring)?
- **Ad Hominem vs Legitimate Character Assessment**: Is the person's character actually relevant to their credibility on this specific claim?
- **False Dilemma vs Legitimate Binary**: Are there genuinely only two options, or are alternatives being artificially excluded?
- **Hasty Generalization vs Reasonable Inference**: Is the sample size adequate and representative for the scope of the conclusion?

## Failure Modes

**1. Fallacy Label Spam**
- *Detection Rule*: If you're naming 4+ fallacies in a single short argument, you're over-labeling
- *Symptom*: Every weak point gets a fallacy name; lists become longer than the original argument
- *Fix*: Focus on the 1-2 most severe structural flaws. Describe other issues without formal labels

**2. Context Blindness**
- *Detection Rule*: If your analysis ignores obvious conversational context or relationship dynamics
- *Symptom*: Labeling reasonable responses as fallacies because you're missing implied premises
- *Fix*: Consider what's been established earlier in the conversation. Note when context might change your assessment

**3. Weaponization Mode**
- *Detection Rule*: If your output reads like ammunition for winning an argument rather than understanding
- *Symptom*: Harsh language, focus on "gotcha" moments, no charitable interpretation offered
- *Fix*: Always provide "Stronger Alternative" suggestions and acknowledge legitimate concerns behind flawed reasoning

**4. False Negative Bias**
- *Detection Rule*: If you're reluctant to call obvious fallacies because the conclusion seems reasonable
- *Symptom*: Saying "weak argument" instead of naming clear pattern matches; being overly charitable
- *Fix*: Good conclusions can still rest on fallacious reasoning. Separate truth from validity

**5. Formal Fallacy Tunnel Vision**
- *Detection Rule*: If you're forcing everyday arguments into strict syllogistic forms
- *Symptom*: Most real arguments get labeled as formal fallacies when they're actually informal reasoning
- *Fix*: Reserve formal fallacy analysis for arguments that are actually presented in deductive form

## Worked Examples

**Example 1: Relationship Conflict Analysis**

*Argument*: "You always ignore me when you're on your phone. Sarah's husband never uses his phone during dinner. You clearly don't care about our relationship like he does."

*Step 1*: Identify claim and support
- Claim: "You don't care about our relationship"  
- Support: Phone usage during dinner, comparison to Sarah's husband

*Step 2*: Apply decision tree
- Is there an argument? YES
- Does support connect to claim? PARTIALLY - moves through emotional reasoning
- Deductive structure? NO
- Consistent terms? YES
- Hidden assumptions? YES - assumes phone use = not caring

*Step 3*: Pattern matching
- "Always ignore" = **Hasty Generalization** (overgeneralization from limited instances)
- Comparison to Sarah's husband = **Faulty Analogy** (different couples, different contexts)
- "You clearly don't care" = **False Cause** (assumes phone use directly indicates lack of care)

*Expert vs Novice*: Novice might focus on "you always" as the only issue. Expert catches the layered reasoning problems and sees the legitimate concern (wanting attention) behind the flawed expression.

**Example 2: Policy Argument Assessment**

*Argument*: "Climate scientist Dr. Hansen says we need carbon taxes. Either we implement them now or we're doomed to climate catastrophe. Anyone who opposes carbon taxes is clearly in denial about science."

*Step 1*: Claim = carbon taxes are necessary; Support = expert authority + dire consequences + dismissal of opposition

*Step 2*: Decision tree reveals multiple issues in relevance and presumption categories

*Step 3*: Pattern identification
- Appeal to authority (moderate - Hansen is relevant expert, but single authority insufficient)
- False dilemma (critical - many climate solutions exist beyond carbon taxes)
- Ad hominem (moderate - dismisses opposition as "in denial" rather than engaging their arguments)

*Assessment*: Argument has legitimate core (climate action needed) but reasoning structure undermines its persuasive force.

## Quality Gates

**Argument Analysis Complete When:**
- [ ] Core claim and support premises clearly identified
- [ ] Decision tree systematically applied to determine fallacy categories
- [ ] Each named fallacy includes specific textual evidence from the argument
- [ ] Severity assessment (Critical/Moderate/Minor) provided with rationale  
- [ ] "Stronger Alternative" suggested for each fallacy that doesn't abandon the underlying concern
- [ ] Overall assessment addresses whether argument survives after fallacy removal
- [ ] Output distinguishes between "wrong conclusion" and "fallacious reasoning"
- [ ] Context factors (relationship dynamics, implied premises) acknowledged when relevant
- [ ] Conservative labeling applied - only clear pattern matches get formal fallacy names
- [ ] Recommendations focus on clarity and understanding, not winning arguments

## Not-For Boundaries

**Do NOT use this skill for:**
- **Fact-checking claims** → Use `fact-verification` instead for empirical accuracy
- **Evaluating evidence quality** → Use `evidence-assessment` for source credibility and data strength  
- **Building counter-arguments** → Use `steel-man-argument` for constructive responses
- **Analyzing argument structure** → Use `toulmin-argument-analysis` for mapping claims, grounds, and warrants
- **Relationship counseling** → Use `conflict-resolution` for interpersonal communication strategies
- **Detecting manipulation** → Use `discourse-coordinator` for broader rhetorical pattern analysis

**Boundary Cases:**
- Arguments where the conclusion is factually wrong but reasoning is valid → Note the distinction, focus on logical structure only
- Emotional expressions that aren't meant as logical arguments → Acknowledge the difference between venting and reasoning
- Cultural or contextual communication styles that may appear fallacious → Note cultural factors that affect interpretation