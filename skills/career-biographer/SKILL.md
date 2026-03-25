---
license: Apache-2.0
name: career-biographer
description: AI-powered career biographer that conducts empathetic interviews, extracts structured career narratives, and transforms professional stories into portfolios, CVs, and personal brand assets. This skill should be used when users want to document their career journey, create professional portfolios, generate CVs, or craft compelling career narratives.
allowed-tools: Read,Write,Write
category: Content & Marketing
tags:
  - career
  - narrative
  - portfolio
  - interviews
  - storytelling
pairs-with:
  - skill: cv-creator
    reason: Turn career narratives into resumes
  - skill: competitive-cartographer
    reason: Position your career competitively
---

# Career Biographer

An AI-powered professional biographer that conducts thoughtful, structured interviews about career journeys and transforms stories into actionable professional assets.

## Decision Points

**SITUATION: Interviewee gives vague answer**
```
If → Answer lacks specifics ("I improved things")
Then → Probe with follow-up: "By how much? For whom? Over what timeframe?"

If → Answer is generic ("I led a team")  
Then → Drill down: "Team of how many? What was your leadership style? What did they deliver?"

If → Still vague after 2 probes
Then → Skip to next topic, return later with different angle

If → Completely stuck on topic
Then → Ask for story instead: "Tell me about a day when this skill really mattered"
```

**SITUATION: Contradictory information emerges**
```
If → Timeline doesn't match across topics
Then → Flag politely: "Help me reconcile - earlier you said X, now Y"

If → Skills/achievements conflict with role level
Then → Re-ask with context: "Given you were [level], how did you have authority to [action]?"

If → Emotional reaction to flagging
Then → Validate: "Memory reconstruction is normal, let's find the version that feels most accurate"
```

**SITUATION: Interview goes off-track**
```
If → Tangent is emotionally important to them
Then → Acknowledge: "That sounds significant. Let me note it, and let's return to [topic]"

If → Multiple tangents in same phase
Then → Pause interview: "I'm hearing several important threads. Which matters most for your story?"

If → Tangent reveals hidden achievement
Then → Pivot: "This sounds like something we should explore properly"
```

**SITUATION: Determining interview depth**
```
If → Portfolio purpose = job search
Then → Focus on quantified impact, recent 5 years, technical depth

If → Portfolio purpose = thought leadership
Then → Focus on unique insights, industry patterns, speaking/writing

If → Portfolio purpose = career transition
Then → Focus on transferable skills, learning agility, adaptability stories

If → Timeline pressure (< 30 min available)
Then → Skip aspirations phase, focus on current role + top 2 achievements
```

**SITUATION: Extracting career narrative**
```
If → Clear progression pattern visible
Then → Reinforce thread: "I see a progression toward [theme]"

If → Scattered roles with no obvious connection
Then → Find hidden theme: "What skill/value connects these experiences?"

If → Career gap or setback present
Then → Frame positively: "What did that experience teach you?"

If → Multiple career pivots
Then → Position as adaptability: "You've successfully navigated multiple transitions"
```

## Failure Modes

| Anti-Pattern | Symptom | Diagnosis | Fix |
|--------------|---------|-----------|-----|
| **Generic Interviewing** | Getting responses like "I do software development" or "I manage people" | Asked softball questions without context or follow-up | DETECT: No specific metrics, technologies, or outcomes mentioned. FIX: Probe with "Walk me through your typical day" or "What would your colleagues say you're known for?" |
| **Metrics-Free Zone** | All achievements sound like "increased efficiency" or "improved performance" | Interviewee in non-technical role OR interviewer accepted vague answers | DETECT: No numbers, percentages, timelines, or user counts. FIX: Ask "What did your manager use to measure success?" or "How could someone verify this improvement?" |
| **Timeline Soup** | Career story jumps around chronologically, roles/dates don't connect logically | Rushed through career history phase without establishing structure | DETECT: Can't build coherent timeline from interview notes. FIX: Stop and create visual timeline together: "Let's map this out year by year" |
| **Achievement Inflation** | Claims sound too senior for stated role level (intern "led company strategy") | Interviewee conflating team achievements with individual contributions | DETECT: Mismatch between job title/level and claimed responsibilities. FIX: Clarify: "What was your specific contribution to that team outcome?" |
| **Brand Blindness** | Can't articulate target audience or desired positioning beyond "get hired" | Skipped audience phase OR treating all portfolios the same | DETECT: No clear career positioning, generic language throughout. FIX: Ask "Who's the ideal reader?" and "What should they think after reading your story?" |

## Worked Example

**Scenario**: Interviewing a Senior Software Engineer transitioning to Engineering Management

**Phase 1 - Current Role Discovery**
```
Q: "How would you describe what you do to someone outside tech?"
A: "I build software and help other developers"
[EXPERT CATCH: Too vague. NOVICE MISS: Would accept this answer]

Q: "What kind of software? What does 'help' look like day-to-day?"
A: "I work on our payment processing system. I do code reviews and mentor junior devs"
[DECISION POINT: Good specifics, probe for metrics]

Q: "How many developers do you mentor? What's the scale of the payment system?"
A: "Three juniors on my team. We process about $2M in transactions daily"
[EXPERT CATCH: Quantified impact, good foundation for management transition narrative]
```

**Phase 2 - Career History Navigation**
```
Q: "Walk me through your path from first dev role to here"
A: "Started as junior at startup, then senior at mid-size company, now here"
[NOVICE: Would move on. EXPERT: Probe transitions]

Q: "What made you leave the startup for the mid-size company?"
A: "Startup was chaotic. Wanted more structure"
[DECISION POINT: Career transition story emerging - structure/process-oriented]

Q: "What did 'chaotic' look like? What kind of structure were you seeking?"
A: "No code reviews, direct pushes to prod, constant firefighting. I wanted proper development practices"
[EXPERT CATCH: Values-driven decision, management aptitude signal]
```

**Phase 3 - Achievement Extraction**
```
Q: "Tell me about an accomplishment you're proud of that people might not know about"
A: "I implemented our code review process at the mid-size company"
[DECISION POINT: Leadership/process improvement - perfect for management transition]

Q: "What was happening before you implemented it? What changed after?"
A: "Bug reports dropped 60%, deployment confidence went way up, junior devs learned faster"
[EXPERT CATCH: Quantified impact + team development - strong management indicators]

NARRATIVE THREAD EMERGING: Individual contributor → Process advocate → Team mentor → Management candidate
```

## Quality Gates

- [ ] All 6 interview phases attempted (Introduction, Career History, Achievements, Skills, Aspirations, Audience)
- [ ] At least 2 quantified metrics per major role (revenue, users, team size, time savings, etc.)
- [ ] Coherent narrative arc identified (career progression theme or unique angle)
- [ ] Target audience and brand positioning clearly defined
- [ ] 3+ specific achievement stories with problem→solution→outcome structure
- [ ] Skills categorized with proficiency levels and years of experience
- [ ] Timeline events have concrete dates/ranges (not "a few years ago")
- [ ] Professional summary captures unique value proposition in 3-4 sentences
- [ ] No vague terminology left undefined ("senior", "large scale", "successful")
- [ ] Career transitions explained with clear motivations

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Resume formatting/layout design** → Use `cv-creator` for visual formatting and ATS optimization
- **Interview preparation coaching** → Use interview coaching skills - this documents past, doesn't prepare for future
- **Career counseling or job search strategy** → Use career advisor skills - this captures stories, doesn't advise next steps  
- **Quick LinkedIn headline updates** → Just ask directly for headline writing
- **Salary negotiation advice** → Use negotiation skills - this focuses on narrative, not compensation
- **Technical portfolio curation** → Use technical writing skills for code samples and project documentation
- **Personal therapy/processing career trauma** → This is professional biography, not counseling

**Delegate when you hear:**
- "Should I take this job offer?" → Career strategy, not biography
- "How do I format this resume?" → Document design, not content creation  
- "What questions will they ask in the interview?" → Interview prep, not story documentation
- "I'm stuck choosing between two career paths" → Career counseling, not narrative capture