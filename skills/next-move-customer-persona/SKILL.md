---
license: Apache-2.0
name: next-move-customer-persona
description: Deep understanding of /next-move customer personas — who needs AI that tells them what to work on next. Developers with ADHD, overwhelmed project leads, consultants juggling codebases, indie hackers who context-switch. Activate on 'next-move customer', 'who needs next-move', 'task prioritization persona', 'developer decision fatigue', 'what should I work on', 'ADHD developer tools', 'context switching pain'. NOT for WinDAGs orchestration personas (use windags-customer-persona), marketing execution (use next-move-marketing), or general productivity advice (use adhd-daily-planner).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Product & Strategy
  tags:
    - customer-persona
    - next-move
    - developer-productivity
    - ADHD
    - task-prioritization
    - decision-fatigue
  pairs-with:
    - skill: windags-customer-persona
      reason: Next-move is the gateway drug to WinDAGs orchestration
    - skill: adhd-daily-planner
      reason: ADHD developers are a core next-move persona
    - skill: competitive-cartographer
      reason: Map next-move against Motion, Linear, Copilot, and generic AI assistants
category: Content & Marketing
tags:
  - next-move
  - customer-persona
  - user-research
  - marketing
  - positioning
---

# Next-Move Customer Persona

Understanding who needs "AI that tells you what to work on next" — targeting *decision fatigue*, not *execution fatigue*.

## DECISION POINTS

### Persona Recognition Tree
```
If user mentions:
├── "can't decide what to work on" → ADHD Developer (Jamie)
├── "switching between repos" → Multi-Repo Juggler (Priya)  
├── "team blocked on dependencies" → Overwhelmed Project Lead (Alex)
└── "limited time on weekends" → Weekend Warrior (Ray)

If positioning for use case:
├── Personal productivity → Emphasize "confidence in choices" message
├── Team leadership → Emphasize "data-driven triage" message
├── Client work → Emphasize "cross-repo priority stack" message
└── Side projects → Emphasize "momentum preservation" message

If comparing to competitors:
├── vs Motion → "Code-aware vs calendar-aware"
├── vs Linear → "Impact-ranked vs manually prioritized"
├── vs Copilot → "What to build vs how to build"
└── vs ChatGPT → "Repo context vs generic advice"
```

### Messaging Framework Selection
```
If audience pain is:
├── Decision paralysis → Lead with: "Eliminates 20-min 'staring at repo' ritual"
├── Tool fatigue → Lead with: "Lives in workflow, not another dashboard"
├── Context switching → Lead with: "Remembers where you left off"
└── Time scarcity → Lead with: "2-second start button for coding sessions"
```

## FAILURE MODES

**Anti-Pattern 1: "Copilot Confusion"**
- Symptom: Positioning next-move as "AI that helps you code"
- Detection: If messaging focuses on code generation vs task selection
- Fix: Emphasize "decides WHAT to build" vs "helps HOW to build"

**Anti-Pattern 2: "PM Tool Mis-positioning"** 
- Symptom: Targeting project managers instead of developers
- Detection: If copy mentions "team management" or "stakeholder updates"
- Fix: Frame as "developer decision support" not "project oversight"

**Anti-Pattern 3: "Generic Productivity Trap"**
- Symptom: Comparing to Todoist/Notion instead of developer-specific tools
- Detection: If examples use non-coding tasks
- Fix: Only use codebase examples (bugs, features, refactors)

**Anti-Pattern 4: "All-Personas-Equal"**
- Symptom: Giving equal weight to all 4 personas in messaging
- Detection: If Jamie (ADHD) doesn't get 50%+ of content focus
- Fix: Lead with Jamie, mention others as "also serves"

**Anti-Pattern 5: "Accuracy Over Usefulness"**
- Symptom: Emphasizing how "smart" the AI is vs how actionable
- Detection: If messaging highlights algorithm sophistication
- Fix: Focus on "80% right + immediately actionable" benefit

## WORKED EXAMPLES

### Example: Positioning for ADHD Developer Conference Talk

**Scenario**: Speaking at ADHD Tech Meetup, 40 developers, mostly Jamie persona.

**Decision Process**:
1. Audience = primarily Jamie → Use "decision paralysis" messaging framework
2. Setting = tech meetup → Can use specific tool comparisons  
3. Goal = trial signups → Emphasize free instant value

**Expert Approach**:
- Open: "Raise your hand if you've spent 20+ minutes this week just choosing what to work on" 
- Pain point: "You have a Notion board, Linear tickets, GitHub issues - but which one actually matters?"
- Positioning: "Next-move is like `git status` but for priorities"
- Demo: Live `wg next-move` on real repo, show instant recommendation
- CTA: "Try it on your repo tonight - no signup required"

**Novice Would Miss**:
- Using visceral, time-specific pain points ("20 minutes")
- Avoiding jargon ("prioritization AI" → "`git status` for priorities")  
- Showing working software vs slides
- Making trial completely frictionless

### Example: Competitive Response to "Motion Does This"

**Scenario**: Prospect says "Motion already helps me prioritize tasks with AI"

**Decision Process**:
1. Objection = Motion comparison → Use "code-aware vs calendar-aware" distinction
2. Prospect = likely Priya/Alex (mentions existing tool) → Focus on repo context
3. Goal = differentiation → Emphasize unique capability

**Response**:
"Motion is brilliant for calendar scheduling, but it can't read your codebase. It doesn't know that the bug you scheduled for Friday actually blocks three features launching next week. Next-move analyzes your git history, dependency graphs, and impact chains to tell you what matters most *technically*. Motion tells you when to work - next-move tells you what to work on."

## QUALITY GATES

Persona messaging is ready when:

- [ ] Pain points are expressed in developer-specific language (not generic productivity speak)
- [ ] Each persona has a named character with specific demographics and job title
- [ ] Buying trigger describes a concrete, observable moment with specific tool interaction
- [ ] Emotional core ("confidence in choices") is explicitly stated vs implied
- [ ] At least 3 specific competitor distinctions are documented with exact capability gaps
- [ ] Jamie (ADHD) persona gets 50%+ of content focus and examples
- [ ] All messaging avoids "project management" framing in favor of "developer decision support"
- [ ] Free trial path is outlined with zero friction requirements
- [ ] Gateway to WinDAGs is natural and unforced (not sales-y)
- [ ] Anti-patterns protect against the 5 most likely messaging mistakes

## NOT-FOR BOUNDARIES

**Do NOT use this skill for**:
- WinDAGs orchestration personas → Use `windags-customer-persona` instead
- Marketing campaign planning → Use `next-move-marketing` instead  
- General ADHD productivity advice → Use `adhd-daily-planner` instead
- Competitive analysis deep-dives → Use `competitive-cartographer` instead
- Sales objection handling → Use dedicated sales enablement content instead

**Delegate when**:
- Asked about pricing strategy → Hand to product strategy team
- Need user research data → Hand to research/analytics team
- Request specific demo scripts → Hand to sales engineering team
- Technical integration questions → Hand to engineering team