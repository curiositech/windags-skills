---
license: Apache-2.0
name: agentic-calendar-coordination
description: |
  AI-powered calendar management and agent-based scheduling coordination. Covers calendar APIs (Google Calendar, CalDAV/iCal), AI scheduling assistants (Reclaim, Clockwise, Motion, Cal.com), building custom calendar agents with MCP, multi-calendar merging, timezone management, focus block protection, meeting fatigue detection, and agent-to-agent meeting negotiation protocols. Activate on: "calendar agent", "AI scheduling", "calendar coordination", "meeting scheduling", "calendar API", "focus time protection", "calendar optimization", "Google Calendar MCP", "Reclaim", "Clockwise", "Motion", "Cal.com", "smart scheduling", "calendar-aware agent", "timezone scheduling", "agent negotiation meetings". NOT for: manual calendar UI component design (use form-validation-architect), project management scheduling or Gantt charts (use project-management-guru-adhd), general time-tracking or pomodoro apps (use adhd-daily-planner for time-awareness), building the agent itself from scratch (use agent-creator).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Productivity & Agents
  tags:
    - calendar
    - scheduling
    - agent
    - productivity
    - google-calendar
    - timezone
    - meetings
    - mcp
    - coordination
    - focus-time
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Calendar is a primary context source for persistent agents — event streams feed the memory hierarchy
    - skill: always-on-agent-inputs
      reason: Calendar events as contextual signals for agent behavior and energy-level inference
    - skill: adhd-daily-planner
      reason: ADHD-friendly scheduling patterns, time-blindness mitigation, and hyperfocus block protection
    - skill: daemon-development
      reason: Background daemon for continuous calendar monitoring, conflict detection, and proactive rescheduling
    - skill: multi-agent-coordination
      reason: Agent-to-agent meeting negotiation protocols and multi-party scheduling orchestration
category: Lifestyle & Personal
tags:
  - calendar
  - scheduling
  - coordination
  - agentic
  - productivity
---

# Agentic Calendar Coordination

Build AI agents that negotiate meetings, protect focus time, and infer context from calendar data. Navigate timezone complexity, implement agent-to-agent scheduling, and architect custom calendar logic using Google Calendar API and MCP.

## Decision Points

### When Conflict Detected

```
Incoming meeting request conflicts with existing event
├─ Sender = manager/exec → Auto-accept, suggest moving existing
├─ Meeting = 1:1/urgent tagged → Propose alternative within 24h
├─ Focus block collision
│  ├─ Block priority = high (deep work) → Auto-decline
│  └─ Block priority = medium → Propose alternative time
└─ Double-booking with peer meeting → Counter with 3 alternative slots
```

### Auto-Decline vs. Propose-Alternative Decision

```
Factors: sender_tier (exec/manager/peer/external) × meeting_type (1:1/team/all-hands) × focus_block_priority
If exec + any_type → Always propose alternative
If manager + (1:1 OR urgent) → Propose alternative
If peer + recurring + low_attendance → Auto-decline
If external + no_prior_relationship → Auto-decline with "use calendar link"
If during high_priority_focus_block → Auto-decline regardless of sender
```

### Timezone-Aware Slot Selection

```
Multi-participant scheduling:
├─ All same timezone → Use local working hours (9-17)
├─ 2 timezones, <6h apart → Find overlap window
├─ 2 timezones, >6h apart → Early/late split (one takes 8am, other takes 6pm)
└─ 3+ timezones → Propose async alternative OR rotating schedule
```

### Energy Model Slot Ranking

```
Time of day priority (descending):
1. 9-11 AM (peak cognitive) → Reserve for deep work, decline routine meetings
2. 11 AM-12 PM (sustained focus) → Allow important meetings only
3. 2-4 PM (collaboration sweet spot) → Prefer for team meetings
4. 4-5 PM (wrap-up) → Good for 1:1s, status updates
5. 1-2 PM (post-lunch dip) → Avoid complex meetings
```

## Failure Modes

### Timezone-Aware Recurring Conflicts
**Symptoms**: Weekly 9 AM meeting shows conflicts in winter but not summer; cross-timezone recurring fails after DST change
**Detection**: `if recurring_event && timezone_conversion && conflict_pattern_seasonal`
**Fix**: Always expand recurring with `singleEvents: true`, convert each instance to UTC for conflict checking, re-evaluate after DST transitions

### Buffer Enforcement Thrashing
**Symptoms**: Agent repeatedly reschedules same meeting trying to create buffers; meetings bounce between slots
**Detection**: `if same_meeting_rescheduled > 2 times in 24h for buffer_reasons`
**Fix**: Lock in meeting after first reschedule, adjust buffer requirements dynamically based on meeting importance

### Energy Model Cold-Start
**Symptoms**: New agent schedules meetings at user's worst cognitive times; ignores established patterns
**Detection**: `if meeting_satisfaction_score < 3 for meetings_scheduled_by_agent`
**Fix**: Bootstrap with explicit user preferences, learn from decline patterns, require 2-week observation period before auto-scheduling

### Schema Bloat Privacy Leak
**Symptoms**: Agent shares too much calendar detail with external systems; event descriptions leak to LLMs
**Detection**: `if external_api_call contains event.description OR attendee.email`
**Fix**: Implement data minimization layer, strip PII before external calls, use free/busy only for scheduling

### Recursive Negotiation Loop
**Symptoms**: Two agents endlessly counter-propose; no convergence on meeting time
**Detection**: `if negotiation_rounds > 3 && no_accepted_slot`
**Fix**: Escalate to human after 2 counters, implement "good enough" acceptance threshold, time-bound negotiations

## Worked Examples

### Cross-Timezone Meeting Negotiation

**Scenario**: Your agent (Chicago) needs 30min with peer agent (Tokyo) for API review. Both have energy constraints.

**Step 1: Initial Analysis**
- Chicago: 9 AM-5 PM CST = 12 AM-6 AM JST (next day)
- Tokyo: 9 AM-6 PM JST = 7 PM-4 AM CST (previous day)  
- Overlap window: 7-8 PM CST = 9-10 AM JST

**Step 2: Energy Model Check**
- Chicago 7 PM = end of workday (energy: 6/10)
- Tokyo 9 AM = peak cognitive hours (energy: 9/10)
- Imbalance detected → Need compromise

**Step 3: Proposal Generation**
```
Agent Chicago → Agent Tokyo: PROPOSE
Slots: [
  "2024-03-19T01:00Z" (Chi: 7PM, Tok: 10AM),
  "2024-03-19T23:00Z" (Chi: 5PM, Tok: 8AM),  
  "2024-03-20T00:00Z" (Chi: 6PM, Tok: 9AM)
]
Priority: normal
Topic: "API review - timezone complexity discussion"
```

**Step 4: Counter-Proposal**
```
Agent Tokyo → Agent Chicago: COUNTER
Reason: "Prefer later Tokyo morning for complex technical discussion"
Alternatives: [
  "2024-03-19T02:00Z" (Chi: 8PM, Tok: 11AM),
  "2024-03-20T01:00Z" (Chi: 7PM, Tok: 10AM)
]
Constraints: "Need 15min buffer before 11:30 AM JST standup"
```

**Step 5: Resolution**
Chicago agent accepts 8 PM CST / 11 AM JST slot, creates event with both timezones in description:
"API Review - 8:00 PM CST / 11:00 AM JST+1"

**Novice vs Expert**:
- Novice: Schedules at Chicago-convenient time without checking Tokyo cognitive hours
- Expert: Recognizes energy imbalance, proposes late-in-Chicago-day when Tokyo is fresh

## Quality Gates

- [ ] All timestamps stored in UTC internally, converted only at display/API boundaries
- [ ] IANA timezone names used throughout (no UTC offset strings like "-05:00")
- [ ] Free/busy queries strip event details, sharing only time blocks with external agents
- [ ] Buffer enforcement creates minimum 10-15 minutes between consecutive meetings
- [ ] Focus blocks marked as "busy" but with lower priority than actual meetings for negotiation
- [ ] Energy model considers user's cognitive peak hours and meeting fatigue patterns
- [ ] OAuth tokens encrypted at rest with automatic refresh flow implemented
- [ ] Rate limiting handles Google Calendar API quotas with exponential backoff
- [ ] Recurring events expanded to individual instances before conflict detection
- [ ] Multi-calendar merging tested across personal/work calendars with different permissions
- [ ] Agent negotiations time-bound with human escalation after failed rounds
- [ ] Audit log captures all calendar mutations with rollback capability

## NOT-FOR Boundaries

**This skill is NOT for**:
- Building calendar UI components → Use `form-validation-architect`
- Project Gantt charts or milestone tracking → Use `project-management-guru-adhd` 
- Pomodoro timers or time tracking apps → Use `adhd-daily-planner`
- General agent architecture patterns → Use `agentic-patterns`
- Building the base agent framework → Use `agent-creator`

**Delegate to other skills when**:
- User needs ADHD-specific time management → `adhd-daily-planner`
- Building persistent agent memory → `always-on-agent-architecture`  
- Multi-agent coordination beyond calendar → `multi-agent-coordination`
- Background daemon architecture → `daemon-development`

This skill focuses specifically on calendar data structures, scheduling algorithms, and meeting coordination logic.