---
license: Apache-2.0
name: cse-state-of-practice
description: Review of Cognitive Systems Engineering applications and current practice in safety-critical domains
category: Cognitive Science & Decision Making
tags:
  - cognitive-systems
  - state-of-practice
  - human-factors
  - review
  - methodology
---

# Cognitive Systems Engineering State of Practice

Apply insights from cognitive systems engineering research to design resilient agent architectures, diagnose coordination failures, and encode expert knowledge that performs under pressure.

## Decision Points

### Agent Architecture Design
```
START: Need to design multi-agent system
│
├─ Is this a well-defined, stable task sequence?
│  ├─ YES → Use pipeline architecture BUT build 3 failure recovery paths
│  └─ NO → Use goal-oriented architecture with alternative methods
│
├─ Does task require expertise under time pressure?
│  ├─ YES → Implement Recognition-Primed Decision Making pattern
│  │        (situation recognition → rapid simulation → action)
│  └─ NO → Standard deliberative architecture acceptable
│
└─ Will humans supervise or intervene?
   ├─ YES → Mandatory: mode transparency + shared state representation
   └─ NO → Focus on agent-to-agent coordination interfaces
```

### Task Decomposition Strategy
```
Given complex task to decompose:
│
├─ Can expert describe complete process reliably?
│  ├─ YES → Verify with Critical Decision Method anyway
│  └─ NO → Use structured cognitive task analysis FIRST
│
├─ Are there natural failure/degradation points?
│  ├─ YES → Design alternative paths for each failure mode
│  └─ NO → Suspicious - dig deeper for hidden failure modes
│
└─ Will agents need to adapt methods to context?
   ├─ YES → Separate goals from methods in specification
   └─ NO → Fixed sequence acceptable (rare case)
```

### Failure Diagnosis Protocol
```
System failing unexpectedly:
│
├─ Does it work in demos but fail in production?
│  └─ YES → Invariant sequence assumption violated
│
├─ Are humans surprised by agent actions?
│  └─ YES → Automation surprise - check mode transparency
│
├─ Do agents fail when tools/data unavailable?
│  └─ YES → Missing alternative paths in decomposition
│
└─ Does agent understand but can't execute effectively?
   └─ YES → Knowing-doing gap - check situated context
```

## Failure Modes

### 1. Pipeline Worship
**Symptoms:** System works perfectly in happy path, crashes at first unexpected condition
**Detection Rule:** If you hear "we need to handle the edge case" more than once, you're in this anti-pattern
**Root Cause:** Designed for idealized sequence, no alternative paths
**Fix:** Redesign with goal/method separation, build 3 recovery paths for most common failures

### 2. Behavioral Specification Fallacy
**Symptoms:** Agent mimics expert actions but can't adapt to novel situations
**Detection Rule:** If expert says "I don't know how I knew that," but system specification doesn't capture cue recognition
**Root Cause:** Encoded surface behavior without underlying reasoning structure
**Fix:** Use Critical Decision Method to elicit tacit knowledge and situation assessment patterns

### 3. Silent Mode Transitions
**Symptoms:** Humans/agents surprised when system changes behavior or strategy
**Detection Rule:** If stakeholders say "I had no idea it was doing that," automation surprise is occurring
**Root Cause:** State changes not communicated across coordination boundaries
**Fix:** Make every mode transition an explicit coordination event with shared state updates

### 4. Representation Divergence
**Symptoms:** Agent handoffs produce errors despite individual agents working correctly
**Detection Rule:** If output from Agent A is misinterpreted by Agent B consistently
**Root Cause:** Agents maintain different models of task/world state
**Fix:** Explicit shared ontology and interface state verification

### 5. Novice Architecture for Expert Tasks
**Symptoms:** System follows rules perfectly but fails under pressure or novel conditions
**Detection Rule:** If system can't explain WHY it chose an action, only WHAT rule it followed
**Root Cause:** Rule-based architecture deployed for expertise-requiring task
**Fix:** Upgrade to recognition-primed or case-based reasoning architecture

## Worked Examples

### Example 1: Multi-Agent Code Review System
**Scenario:** Design system where Agent A writes code, Agent B reviews, Agent C handles deployment

**Initial Design (Flawed):**
- Linear pipeline: Code → Review → Deploy
- Binary review outcome: Pass/Fail
- Fixed criteria checklist

**CSE Analysis Reveals:**
- Expert code reviewers don't use checklists - they recognize code smells and risk patterns
- Reviews adapt to code complexity, author experience, deployment criticality
- Real reviewers often iterate with authors, not just reject

**Improved Design:**
```
Agent A: Code Generation
├─ Includes intention metadata (what problem solving, why this approach)
├─ Context flags (urgency, risk level, author confidence)

Agent B: Recognition-Primed Review
├─ Situation assessment (code type, risk factors, author patterns)
├─ Pattern matching against failure libraries
├─ Graduated response: approve/iterate/escalate/reject

Agent C: Context-Sensitive Deployment  
├─ Deployment strategy adapts to review confidence + context flags
├─ Rollback paths pre-planned based on risk assessment
```

**Key Decision Points Applied:**
- Separated goals (ensure code quality) from methods (checklist vs pattern recognition)
- Added alternative paths (iteration loop, escalation)
- Made handoff state explicit (intention metadata, confidence levels)

### Example 2: Diagnosing Customer Service Agent Failures
**Problem:** AI customer service agent handles routine queries well but escalates too often on complex issues

**Diagnosis Process:**
1. **Check for Invariant Sequence:** Agent follows script linearly, can't adapt when customer deviates
2. **Examine Situation Recognition:** Agent uses keyword matching, not contextual assessment
3. **Test Alternative Paths:** Agent has no recovery strategies when first approach fails

**Root Cause:** Behavioral specification fallacy - system trained on successful interaction transcripts but missing expert reasoning about when/how to adapt

**Solution:**
- Interview expert human agents using Critical Decision Method
- Identify situation types and recognition cues
- Build case library of adaptation strategies
- Add confidence scoring to enable graduated escalation

## Quality Gates

Task completion checklist for CSE-informed agent design:

[ ] **Alternative Path Coverage:** System has defined recovery paths for 3 most likely failure modes
[ ] **Situation Recognition:** Agent can classify situation type, not just process inputs
[ ] **Mode Transparency:** All state changes are observable by supervisors/coordinators  
[ ] **Representation Alignment:** Agent handoffs use explicit, shared state models
[ ] **Expertise Stage Match:** Architecture complexity matches required expertise level
[ ] **Tacit Knowledge Elicitation:** Used structured methods (not just self-report) for expert knowledge
[ ] **Context Sensitivity:** System adapts methods to situational factors
[ ] **Knowing-Doing Verification:** Tested execution capability, not just comprehension
[ ] **Coordination Failure Recovery:** System handles representational divergence gracefully
[ ] **Automation Surprise Prevention:** Mode changes communicated across all coordination boundaries

## NOT-FOR Boundaries

**This skill is NOT for:**
- Pure UI/UX design problems → Use interaction design skills instead
- Simple deterministic tasks with no failure modes → Use standard pipeline architecture
- Tasks where behavioral observation captures all relevant expertise → Use direct behavioral modeling
- Systems with no human supervision or agent coordination → Use individual agent optimization

**Use OTHER skills for:**
- Interface layout and visual design → UI/UX skills
- Mathematical optimization problems → Operations research skills  
- Data pipeline engineering → Data engineering skills
- Individual agent prompt optimization → Prompt engineering skills

**This skill IS specifically for:**
- Multi-agent coordination architecture
- Expert knowledge elicitation and encoding
- Failure mode prediction and mitigation
- Human-AI handoff design
- Complex task decomposition under uncertainty