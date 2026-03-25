---
name: bad-faith-rhetoric-detector
description: "Describe patterns that may indicate bad-faith or manipulative communication including gish gallop, whataboutism, tone policing, motte-and-bailey, sealioning, lying by omission, deflection, and strategic evasion. Use when the user suspects manipulation, notices repeated non-engagement, wants to analyze debate tactics, or mentions 'bad faith', 'deflection', 'manipulation', 'dodging the question', 'avoiding the issue', 'gaslighting', 'moving goalposts'. Describes behavioral patterns without making psychological diagnoses."
---

# Bad-Faith Rhetoric Detector

## When to Use This Skill

Load this skill when the user suspects manipulation, asks about "bad faith" responses, wants to analyze debate tactics, or uses phrases like "dodging the question," "moving goalposts," or "gaslighting."

## DECISION POINTS

### Primary Tactic Identification (when multiple patterns co-occur)

```
1. WHAT was the original question/claim?
   ↓
2. HOW did the response handle it?
   ├─ Completely ignored → Stonewalling or Deflection
   ├─ Replaced with different topic → Whataboutism or Gish Gallop
   ├─ Attacked the asking style → Tone Policing
   ├─ Retreated to safer claim → Motte-and-Bailey
   └─ Demanded excessive proof → Sealioning or Burden-Shifting
   ↓
3. WHAT was the emotional effect?
   ├─ Exhaustion from volume → Gish Gallop (primary)
   ├─ Self-doubt about reasonableness → DARVO or Gaslighting
   ├─ Confusion about what was agreed → Moving Goalposts
   └─ Frustration at non-engagement → Stonewalling (primary)
```

### Confidence Assessment Tree

```
High Confidence (>80%):
├─ Pattern appears 3+ times in exchange
├─ Clear quotes demonstrate the behavior
└─ Effect on conversation is obvious

Medium Confidence (50-80%):
├─ Pattern appears 1-2 times
├─ Some ambiguity in interpretation
└─ Could be defensive behavior instead

Low Confidence (<50%):
├─ Single instance only
├─ Multiple reasonable interpretations
└─ Context suggests good faith possible
```

### Response Strategy Selection

```
IF relationship is unsafe OR pattern is clearly intentional
   → Name + Exit (use boundary scripts)

ELSE IF pattern seems defensive/overwhelmed
   → Name + Pause ("Let's take a step back...")

ELSE IF user needs ongoing relationship
   → Name + Limit ("I'll engage with X, but not Y")

ELSE IF one-off interaction
   → Exit without explanation
```

## FAILURE MODES

### Anti-Pattern: "Pattern Confirmation Bias"
**Symptom:** Finding bad faith everywhere, even in ambiguous exchanges
**Detection Rule:** If >70% of analyzed exchanges show "bad faith," you're overcalling
**Fix:** Force charitable interpretation first, then pattern match second

### Anti-Pattern: "Therapeutic Overreach"  
**Symptom:** Diagnosing psychological conditions from rhetoric patterns
**Detection Rule:** Using words like "narcissist," "sociopath," or "personality disorder"
**Fix:** Stick to behavioral descriptions only: "This response pattern avoids..."

### Anti-Pattern: "False Equivalence Detection"
**Symptom:** Labeling legitimate disagreement as "bad faith" 
**Detection Rule:** No actual question dodging, just unwelcome answer
**Fix:** Distinguish between "didn't answer how I wanted" vs "didn't answer at all"

### Anti-Pattern: "Weaponized Analysis"
**Symptom:** User wants help deploying these tactics themselves
**Detection Rule:** Questions focus on "how to" rather than "is this happening"
**Fix:** Decline to assist with tactical deployment; redirect to productive discourse

### Anti-Pattern: "Analysis Paralysis Loop"
**Symptom:** Endless cataloging without decision or action
**Detection Rule:** 3+ rounds of pattern identification with no boundary setting
**Fix:** "What do you want to do with this information?" Force decision point

## WORKED EXAMPLES

### Example 1: Workplace Motte-and-Bailey

**User:** "My boss said in the meeting that our department 'needs major restructuring and some people aren't pulling their weight.' When I asked privately who specifically and what changes, he said 'I'm just saying we all need to step up our game.' Is this bad faith?"

**Analysis Process:**
1. Original claim: Department needs major restructuring + some people underperforming
2. Response to clarification request: Vague "we all need to step up"
3. Pattern match: Motte-and-Bailey (retreat from specific threat to generic encouragement)
4. Confidence: High (clear retreat pattern)
5. Alternative explanation: Boss may lack specific plan, using vague language to avoid premature commitments

**Output:** "This follows a motte-and-bailey pattern - making a specific concerning claim (major restructuring, people not pulling weight) then retreating to an uncontroversial position (everyone should work hard) when pressed for details. This could indicate he's testing reactions before committing to specifics, or he may lack a concrete plan but wants to create urgency."

### Example 2: Relationship DARVO

**User:** "I told my partner I felt hurt when they canceled our plans last minute again. They said 'I can't believe you're attacking me when I'm dealing with work stress. You never support me when I'm struggling.' Did I do something wrong?"

**Analysis Process:**
1. Original concern: Pattern of last-minute plan cancellation causing hurt
2. Response pattern: Deny wrongdoing, attack user for raising it, position self as victim
3. Pattern match: DARVO (Deny-Attack-Reverse Victim/Offender)
4. Alternative explanation: Partner genuinely overwhelmed, defensive reaction to feeling criticized
5. Effect: User now doubting if their concern was legitimate

**Output:** "This response follows DARVO - your concern about canceled plans was denied ('can't believe you're attacking'), you were attacked for raising it, and they repositioned themselves as the victim who needs support. This could be manipulative, or it could be a defensive reaction from someone who feels overwhelmed and criticized. The effect either way is that your original concern (cancellation pattern) remains unaddressed."

## QUALITY GATES

Analysis is complete when you can answer YES to all:

- [ ] Identified the original question/claim that was allegedly avoided or deflected
- [ ] Mapped how the response handled (or failed to handle) that original point
- [ ] Named specific pattern(s) with confidence level (high/medium/low)
- [ ] Provided at least one charitable alternative explanation
- [ ] Described observable effect on the conversation or relationship
- [ ] Checked for pattern confirmation bias (am I overcalling this?)
- [ ] Avoided psychological diagnosis (stuck to behavioral description)
- [ ] Offered practical next-step options for the user
- [ ] Verified quotes/examples support the pattern identification
- [ ] Considered context that might explain the behavior differently

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**
- Helping users deploy bad-faith tactics themselves → Use `productive-discourse-facilitator` for ethical persuasion
- Diagnosing personality disorders → Refer to mental health professionals
- Analyzing your own responses in conversation → Use `communication-clarity-optimizer` for self-improvement
- Legal or HR advice about hostile communication → Refer to legal professionals
- Determining if someone is "lying" definitively → Use `factual-accuracy-verifier` for truth claims

**Delegate when:**
- User needs specific response scripts → Use `boundary-setting-navigator`  
- Focus is on repairing damaged communication → Use `relationship-repair-facilitator`
- Analysis reveals potential abuse → Prioritize safety resources over pattern analysis