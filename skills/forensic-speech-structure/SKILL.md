---
name: forensic-speech-structure
description: "Structure persuasive speeches and formal arguments in forensic, legal, policy, and competitive debate styles. Use when the user needs to prepare talks, opening or closing arguments, policy pitches, public explanations, debate speeches, or mentions 'forensic speech', 'formal argument', 'persuasive speech structure', 'debate speech', 'opening statement', 'closing argument'. Turns structured claims into audience-tuned persuasive delivery."
metadata:
  version: '1.0'
  author: forensic-speech-structure
---

# Forensic Speech Structure Skill

## DECISION POINTS

**Format Selection Tree:** Choose structure based on audience and time constraints:

```
IF legal/judicial context:
├─ IF <10 minutes → Classical 5-part (abbreviated)
└─ IF >10 minutes → Classical 5-part (full)

IF policy/legislative context:
├─ IF formal body → Congressional format
└─ IF advocacy → Policy debate format

IF public/corporate presentation:
├─ IF <15 minutes → TED-style structure
├─ IF hostile audience → Classical (heavy refutatio)
└─ IF neutral/friendly → TED-style or Congressional

IF competitive debate:
├─ IF policy debate → Plan/Inherency/Harms/Solvency
└─ IF parliamentary → Classical 5-part
```

**Argument Ordering Decision:**
- IF hostile audience → Start with shared values, bury weakest point in middle
- IF neutral audience → Primacy/recency (2nd strongest first, strongest last)
- IF friendly audience → Lead with strongest, maintain momentum

**Time Allocation by Format:**
- Classical: Exordium 10% | Narratio 20% | Confirmatio 35% | Refutatio 25% | Peroratio 10%
- TED-style: Story 25% | Problem 25% | Solution 35% | Call-to-Action 15%
- Policy: Plan 15% | Inherency 25% | Harms 30% | Solvency 30%

## FAILURE MODES

**1. Exordium Overload**
- *Symptoms:* Introduction >15% of speech, multiple stories, thesis buried
- *Detection:* If you can't find the thesis in first 60 seconds of a 5-minute speech
- *Fix:* Single hook, quick ethos signal, clear thesis statement. Cut everything else.

**2. Evidence Dumping**
- *Symptoms:* Lists of facts without warrants, no impact statements, audience glazing over
- *Detection:* If confirmatio has >5 discrete evidence pieces without logical connectors
- *Fix:* Group evidence into 2-3 major claims. Use Toulmin: Claim → Warrant → Evidence → Impact

**3. Strawman Refutation**
- *Symptoms:* Addressing weak or irrelevant objections while ignoring the strongest counter
- *Detection:* If refutatio feels easy or opposition sounds unreasonable
- *Fix:* Steel-man the best objection. If you can't make their case sound compelling, you haven't understood it.

**4. Fizzle Finish**
- *Symptoms:* Peroratio restates points without escalation, trails off with qualifications
- *Detection:* Final sentence contains "maybe," "perhaps," or "in conclusion"
- *Fix:* End with imperative verb. Return to opening image. No hedging in final 30 seconds.

**5. Format Mismatch**
- *Symptoms:* Using TED structure for legal argument, or classical structure for policy pitch
- *Detection:* Audience looks confused despite clear content
- *Fix:* Match structure to audience expectations (see decision tree above)

## WORKED EXAMPLES

**Example 1: Legal Closing (200 words)**

```
[EXORDIUM] "Members of the jury, three weeks ago you promised to follow the evidence wherever it leads. Today, it leads to one conclusion: reasonable doubt." 

[NARRATIO] Timeline: incident at 9:47pm → police arrival 10:15pm → witness statements collected 11pm-1am.

[CONFIRMATIO] First, the alibi: restaurant receipt timestamped 9:52pm, five miles away. Physical impossibility to travel that distance in 5 minutes during rush traffic. Second, witness credibility: Ms. Johnson changed her story three times between initial statement and trial testimony—first "maybe saw someone," then "definitely the defendant," now "absolutely certain." This progression suggests influence, not memory.

[REFUTATIO] The prosecution says restaurant receipts can be faked. But they provided no evidence of forgery, no motive for the restaurant to lie, no explanation for how my client could fake a receipt showing him ordering food at the exact moment of the crime.

[PERORATIO] Reasonable doubt isn't just possible here—it's unavoidable. The evidence doesn't whisper doubt; it shouts it. Your oath demands you follow that evidence. Find my client not guilty.
```

*Expert catches:* Primacy/recency in confirmatio (strongest argument last), refutatio addresses prosecution's likely response, peroratio echoes opening oath language.
*Novice misses:* Would dump all evidence equally, wouldn't anticipate strongest objection.

**Example 2: Policy Pitch (150 words)**

```
[PROBLEM] Remote work policies are failing 40% of employees who report isolation and productivity drops. Current hybrid solutions address logistics but ignore human connection needs.

[SOLUTION] Implement "squad-based" remote work: permanent 4-person teams with daily virtual coworking sessions, quarterly in-person intensives, and shared project ownership. 

[BENEFITS] Pilot data from three departments shows 23% productivity increase, 67% reduction in reported isolation, 45% improvement in project completion rates. Cost: $2400/employee annually vs. $18,000 for full office return.

[ADDRESSING CONCERNS] "This sounds complicated"—actually simpler than current ad-hoc arrangements. Everyone knows their squad, daily touchpoint, quarterly dates. "What about bigger meetings?"—squads send representatives, just like current team leads model.

[CALL TO ACTION] Approve the six-month pilot for marketing and engineering. If results match our pilot data, we'll have solved remote work's biggest weakness while keeping its biggest advantages.
```

*Expert catches:* Concrete data points, addresses obvious objection, specific ask.
*Novice misses:* Would provide vague benefits, wouldn't anticipate implementation concerns.

## QUALITY GATES

- [ ] Thesis statement appears within first 10% of speech length
- [ ] Ethos signal (credibility marker) established in first 30 seconds
- [ ] Each major claim has warrant + evidence + impact (Toulmin complete)
- [ ] Strongest argument positioned last in confirmatio section
- [ ] Refutatio addresses most compelling counter-argument, not weakest
- [ ] Argument ordering follows primacy/recency principle
- [ ] Peroratio ≤10% of total length with clear call to action
- [ ] No hedging language ("maybe," "perhaps") in final sentence
- [ ] Time allocation matches chosen format percentages (±5%)
- [ ] Speech structure matches audience type per decision tree

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**
- Informational presentations without persuasive intent → Use `presentation-structure` instead
- Technical explanations or training materials → Use `instructional-design` instead
- Ceremonial speeches (eulogies, toasts, awards) → Use `ceremonial-speech` instead
- Impromptu or conversational arguments → Use `socratic-dialogue` instead
- Written persuasive essays or articles → Use `argumentative-writing` instead

**Delegate when:**
- User needs argument analysis before structure → Call `toulmin-argument-analysis` first
- Content has logical fallacies → Call `logical-fallacy-detector` before structuring
- Need to strengthen opposition case for refutatio → Call `steel-man-argument`
- Audience analysis required → Call `audience-analysis` for complex stakeholder mapping