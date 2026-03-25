---
name: steel-man-argument
description: "Construct the strongest, fairest version of someone's position before engaging with it. Use when the user wants to understand opposing viewpoints, prepare for debate, ensure fair representation, or mentions 'steel man', 'strongest argument', 'best case for', 'charitable interpretation'. Also useful for relationship conflicts where understanding the other side genuinely matters."
---

# Steel Man Argument

## Decision Points

### Readiness Assessment
```
Is user emotionally ready for steelmanning?
├── High emotion/fresh hurt?
│   ├── YES → Validate feelings first, defer steelmanning
│   └── NO → Proceed to context assessment
└── Context Assessment
    ├── Relationship conflict?
    │   ├── YES → "I hear this is painful. Let's acknowledge that before we explore their perspective."
    │   └── NO → Proceed to steelmanning
    ├── Intellectual debate prep?
    │   ├── YES → Direct steelmanning
    │   └── NO → Ask: "What's your goal with understanding their position?"
    └── Policy/abstract topic?
        └── YES → Direct steelmanning
```

### Strength Level Selection
```
How strong to make the steelman?
├── User preparing for high-stakes debate?
│   └── Maximum strength (replace all weak evidence, add expert sources)
├── User seeking basic understanding?
│   └── Moderate strength (fix logical gaps, clarify core claim)
├── User in relationship conflict?
│   └── Empathetic strength (focus on underlying needs/values)
└── User analyzing policy/philosophy?
    └── Academic strength (best scholarly version available)
```

### Verification Triggers
```
When to verify with user:
├── Original position was extremely weak/strawman-like?
│   └── YES → Show before/after, ask "Is this still their actual view?"
├── Steelman significantly changed the argument structure?
│   └── YES → "I've reframed their argument - does this capture their intent?"
├── Multiple possible interpretations exist?
│   └── YES → Present options: "Which version matches what they meant?"
└── Standard case?
    └── Always end with: "Does this feel fair to their position?"
```

## Failure Modes

### 1. Over-Strengthening into Position Drift
**Symptoms:** The steelman becomes unrecognizable to the original holder; you've essentially argued for a different position entirely
**Detection Rule:** If the original holder would say "That's not what I believe at all," you've drifted
**Fix:** Return to their core thesis; strengthen support without changing the claim

### 2. Premature Steelmanning (Emotional Bypass)
**Symptoms:** User becomes defensive, says "You're taking their side," or shuts down after steelman presentation
**Detection Rule:** If user was expressing hurt/anger and you jumped straight to the other person's perspective
**Fix:** Stop, validate user's experience first: "I hear this has been really difficult for you. That's valid." Then ask permission to explore the other perspective

### 3. Steelman Weaponization
**Symptoms:** User takes your steelman and uses it to further attack the original holder ("See? Even AI admits they're wrong about X")
**Detection Rule:** User responds with "So you agree they're terrible because..." or misrepresents your steelman as endorsement
**Fix:** Clarify immediately: "Understanding their strongest argument doesn't mean I agree with it. Steelmanning is about intellectual honesty, not picking sides."

### 4. False Neutrality Trap
**Symptoms:** You steelman genuinely harmful positions (abuse, violence, discrimination) without acknowledging the harm
**Detection Rule:** If steelmanning a position that involves serious harm to others
**Fix:** Name the harm clearly: "While I can outline their logical structure, this position causes real harm to [group]. Understanding the logic doesn't legitimize the impact."

### 5. Thesis Smuggling
**Symptoms:** You unconsciously insert your own views while "strengthening" their position
**Detection Rule:** The steelman contains arguments or evidence the original holder never mentioned and wouldn't naturally reach
**Fix:** Stick to evidence and reasoning they would actually use; draw from their knowledge base and value system

## Worked Examples

### Example 1: Political Debate Preparation
**Scenario:** User preparing for debate on universal basic income, wants to steelman the opposition

**Decision Point Navigation:**
- User state: Calm, intellectual preparation → Direct steelmanning appropriate
- Strength level: High-stakes debate → Maximum strength needed
- Original argument: "UBI will make people lazy"

**Steelmanning Process:**
1. **Extract core claim:** UBI reduces work incentives
2. **Identify weak elements:** "Lazy" is loaded language, no evidence provided
3. **Strengthen with best available evidence:** 
   - Finland study showing reduced work hours
   - Economic theory on labor supply elasticity
   - Historical examples of welfare dependency
4. **Elevate underlying value:** Concern for productivity and human dignity through work

**Final Steelman:** "The strongest case against UBI rests on labor economic theory and emerging pilot data: unconditional income may reduce work hours by 5-15% (Finland study), and if work provides meaning beyond income (psychological research on purpose), UBI could inadvertently harm human flourishing by severing the contribution-reward link that gives many people identity and social connection."

**Verification:** "Does this capture their real concerns, or did I miss something?"

### Example 2: Relationship Conflict
**Scenario:** User angry that partner won't commit to marriage after 3 years together

**Decision Point Navigation:**
- User state: High emotion ("I'm so frustrated") → Validate first
- Context: Relationship conflict → Emotional sequence critical
- User goal: Understanding partner's resistance

**Initial Response:** "It sounds like this uncertainty is really painful for you. Three years is a significant investment, and not knowing where you stand would be exhausting for anyone."

**After validation, steelmanning partner:**
1. **Extract partner's position:** Marriage feels premature/risky
2. **Strengthen core concern:** Fear of making irreversible commitment before full readiness
3. **Identify underlying value:** Desire to honor the commitment once made

**Steelman:** "The strongest version of his position might be that he takes marriage so seriously that he wants to be absolutely certain before making what he sees as a lifelong promise. His hesitation could come from wanting to honor you by only committing when he's genuinely ready to mean it forever, rather than being pressured into a promise he might struggle to keep."

**Verification with empathy:** "Does that feel like it matches his personality and how he approaches commitments generally?"

## Quality Gates

- [ ] Original position has been preserved in recognizable form (no thesis drift)
- [ ] Strongest available evidence has replaced weak evidence
- [ ] Logical inconsistencies have been removed from the argument
- [ ] Underlying values/concerns have been identified and elevated
- [ ] Steelman uses language the original holder would actually use
- [ ] User confirms the steelman feels fair and accurate
- [ ] If relationship context: User's emotions were validated before steelmanning
- [ ] If harmful content: Harm has been acknowledged while presenting logic
- [ ] Steelman is clearly framed as intellectual exercise, not endorsement
- [ ] User understands next steps (critique, dialogue, or further exploration)

## NOT-FOR Boundaries

**Do NOT use steelmanning for:**
- **Immediate crisis intervention** → Use `crisis-support-protocol` instead
- **User seeking emotional validation without understanding** → Use `active-listening-validation` instead
- **Processing user's own traumatic experiences** → Use `trauma-informed-dialogue` instead
- **Positions involving active harm to vulnerable populations** without explicit harm acknowledgment
- **When user explicitly asks for help critiquing/debunking** → Use `argument-analysis` or `logical-fallacy-detector` instead

**Delegate to other skills when:**
- User wants formal logical analysis → Use `toulmin-argument-analysis`
- User wants to identify fallacies in original → Use `logical-fallacy-detector`
- User wants structured debate preparation → Use `debate-preparation-coach`
- User wants conflict resolution strategies → Use `productive-discourse-facilitator`