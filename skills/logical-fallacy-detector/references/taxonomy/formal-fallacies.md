# Formal Fallacies Reference

Formal fallacies are errors in the **logical structure** of a deductive argument. The conclusion fails to follow from the premises because the argument's form is invalid — regardless of whether the premises happen to be true or false. Correcting or replacing the content does not fix the argument; the structure itself must change.

Formal fallacies are most visible in syllogistic and propositional logic, but they appear in everyday reasoning whenever someone treats an invalid inference form as though it were valid.

---

## 1. Affirming the Consequent

### Definition
A conditional argument of the form:
1. If P, then Q.
2. Q.
3. Therefore, P.

This is invalid. Just because Q is true does not mean P is the cause or condition — Q might be true for many other reasons.

### Formal Structure
```
P → Q
Q
∴ P        [INVALID]
```

Valid form for comparison (modus ponens):
```
P → Q
P
∴ Q        [VALID]
```

### Why It Fails
A conditional statement ("if P then Q") does not assert that P is the *only* way to get Q. Many antecedents can lead to the same consequent. Affirming the consequent treats a one-way implication as a two-way equivalence.

### Examples

**Example 1 (abstract):**
- If it is raining, the ground is wet.
- The ground is wet.
- Therefore, it is raining.

*Flaw:* The ground might be wet because a sprinkler ran, a pipe burst, or someone spilled water — not because of rain.

**Example 2 (everyday language):**
- "If our product quality was poor, we'd be getting customer complaints. We are getting customer complaints. So our product quality must be poor."

*Flaw:* Customer complaints might stem from poor customer service, confusing documentation, pricing issues, or shipping delays — not quality. The argument does not rule out other causes.

**Example 3 (medical reasoning):**
- "If the patient has flu, they'll have a fever. The patient has a fever. Therefore, the patient has flu."

*Flaw:* Fever accompanies many conditions. Flu is just one possible explanation.

### How to Fix It
Use modus ponens (affirm the antecedent) or modus tollens (deny the consequent):
- *Valid:* "If it rains, the ground gets wet. It is raining. Therefore the ground is wet."
- *Valid:* "If it rains, the ground gets wet. The ground is not wet. Therefore it is not raining."

---

## 2. Denying the Antecedent

### Definition
A conditional argument of the form:
1. If P, then Q.
2. Not P.
3. Therefore, not Q.

This is invalid. The falsity of P tells us nothing certain about Q — Q might still be true through other pathways.

### Formal Structure
```
P → Q
¬P
∴ ¬Q       [INVALID]
```

### Why It Fails
A conditional does not say P is the *only* way to get Q. The antecedent being false just means that particular pathway to Q is absent — other pathways may still produce Q.

### Examples

**Example 1 (abstract):**
- If it is raining, the ground is wet.
- It is not raining.
- Therefore, the ground is not wet.

*Flaw:* The ground might be wet for other reasons even though it isn't raining.

**Example 2 (policy argument):**
- "If we cut taxes, businesses will invest more. We did not cut taxes. Therefore, businesses will not invest more."

*Flaw:* Businesses may increase investment due to regulatory reform, improved infrastructure, lower interest rates, or growing consumer demand — even without a tax cut.

**Example 3 (interpersonal):**
- "If he respected me, he would have called. He didn't call. So he doesn't respect me."

*Flaw:* He might not have called for reasons unrelated to respect — he was ill, forgot, had an emergency, or assumed you'd reach out first.

### How to Fix It
To correctly use a conditional in an argument:
- Affirm the antecedent to prove the consequent (modus ponens).
- Deny the consequent to disprove the antecedent (modus tollens).

---

## 3. Undistributed Middle

### Definition
A syllogistic fallacy where the **middle term** (the term shared by both premises but absent from the conclusion) is not distributed — that is, it does not refer to *all* members of its class in at least one premise.

### Formal Structure
```
All A are B.
All C are B.
∴ All A are C.     [INVALID — B is undistributed in both premises]
```

### Why It Fails
For the syllogism to work, the middle term must "bridge" the two other terms definitively. If B covers only some members in both premises, A and C might overlap in B without overlapping with each other.

### Examples

**Example 1 (classic):**
- All dogs are mammals.
- All cats are mammals.
- Therefore, all dogs are cats.

*Flaw:* "Mammals" includes both dogs and cats but does not make them identical. The middle term (mammals) is undistributed.

**Example 2 (business):**
- All successful companies invest heavily in marketing.
- Our competitor invests heavily in marketing.
- Therefore, our competitor is a successful company.

*Flaw:* Investing in marketing is a property shared by many companies, successful and not. The middle term ("invests heavily in marketing") is undistributed — it does not tell us that *all* heavy marketing investors are successful.

**Example 3 (social reasoning):**
- "All extremists hold strong opinions."
- "She holds strong opinions."
- "Therefore, she is an extremist."

*Flaw:* Strong opinions are held by many non-extremists. The middle term is too broad.

---

## 4. Illicit Major

### Definition
A syllogistic fallacy in which the **major term** (the predicate of the conclusion) is distributed in the conclusion but was *not* distributed in the major premise.

### Formal Structure
```
All A are B.
No C are A.
∴ No C are B.     [INVALID — B is distributed in conclusion but not in premise 1]
```

### Why It Fails
When the conclusion makes a claim about *all* members of the major term, but the major premise only said something about a subset, the conclusion overreaches what the premises license.

### Examples

**Example 1:**
- All athletes are hardworking people.
- No philosophers are athletes.
- Therefore, no philosophers are hardworking people.

*Flaw:* Premise 1 says athletes are *among* hardworking people — it doesn't say athletes are the *only* hardworking people. The conclusion claims something about all hardworking people, which the premise doesn't support.

**Example 2 (workplace):**
- "All top performers receive bonuses."
- "Part-time workers are not top performers."
- "Therefore, part-time workers do not receive bonuses."

*Flaw:* The premise only establishes that top performers get bonuses — not that *only* top performers get bonuses. Part-time workers might receive bonuses through other criteria.

---

## 5. Illicit Minor

### Definition
A syllogistic fallacy in which the **minor term** (the subject of the conclusion) is distributed in the conclusion but was *not* distributed in the minor premise.

### Formal Structure
```
All A are B.
All A are C.
∴ All C are B.     [INVALID — C is distributed in conclusion but undistributed in premise 2]
```

### Why It Fails
The minor premise says something about A being C, but does not license a claim about *all* C — only about those C that happen to be A.

### Examples

**Example 1:**
- All humans are mortal.
- All humans are animals.
- Therefore, all animals are mortal.

*Flaw:* The premises only establish a relationship involving *humans*. We cannot generalize from "all humans are animals" to conclude something about *all animals*.

**Example 2 (policy):**
- "All members of the task force support the new policy."
- "All members of the task force are managers."
- "Therefore, all managers support the new policy."

*Flaw:* The minor premise ("all members of the task force are managers") doesn't tell us anything about managers outside the task force.

---

## 6. Fallacy of Four Terms (Quaternio Terminorum)

### Definition
A categorical syllogism requires **exactly three terms**, each used consistently. The fallacy of four terms occurs when four distinct terms appear (or when one term is used in two different senses, creating an apparent three-term syllogism that is actually four-term).

### Formal Structure
```
All A are B.
All C are D.
∴ [some conclusion involving A and D]   [INVALID — no shared middle term]
```

### Why It Fails
Without a genuine shared middle term, the two premises have no logical connection. The argument is structurally broken from the start.

### Examples

**Example 1 (equivocation variant):**
- "Nothing is better than eternal happiness."
- "A ham sandwich is better than nothing."
- "Therefore, a ham sandwich is better than eternal happiness."

*Flaw:* "Nothing" is used in two different senses — existential ("there exists no thing") and comparative ("it is better than the null option"). This creates a four-term structure in disguise.

**Example 2:**
- "All laws restrict freedom."
- "All contracts are agreements."
- "Therefore, all agreements restrict freedom."

*Flaw:* There is no shared middle term connecting "laws" and "contracts." The premises operate on entirely separate subjects.

**Example 3 (everyday reasoning):**
- "All leaders make tough decisions."
- "My boss makes arbitrary decisions."
- "Therefore, my boss is a leader."

*Flaw:* "Tough decisions" and "arbitrary decisions" are different terms. The argument uses four distinct concepts.

---

## Quick Reference Table

| Fallacy | Short Form | Error Type |
|---|---|---|
| Affirming the Consequent | P→Q, Q, ∴P | Invalid propositional form |
| Denying the Antecedent | P→Q, ¬P, ∴¬Q | Invalid propositional form |
| Undistributed Middle | All A=B, All C=B, ∴A=C | Middle term not distributed |
| Illicit Major | Major term distributed in conclusion but not in premise | Distribution error |
| Illicit Minor | Minor term distributed in conclusion but not in premise | Distribution error |
| Four Terms | No genuine middle term / equivocal middle | Structural / equivocation |

---

## Distinguishing Formal from Informal Fallacies

A formal fallacy means the argument is **invalid**: even if the premises were true, the conclusion would not follow. An informal fallacy means the argument may be **valid in form** but the premises are irrelevant, ambiguous, or presumptuous. When analyzing an argument:

1. Check form first — is the structure valid?
2. If form is valid, check the premises — are they true, relevant, unambiguous, and non-presumptuous?

Formal fallacies are decisive: a formally invalid argument cannot be saved by better premises. Informal fallacies are more contextual: they describe flawed strategies of persuasion that might sometimes overlap with legitimate reasoning.
