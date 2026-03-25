---
license: Apache-2.0
name: chatbot-analytics
description: Implement AI chatbot analytics and conversation monitoring. Use when adding conversation metrics, tracking AI usage, measuring user engagement with chat, or building conversation dashboards. Activates for AI analytics, token tracking, conversation categorization, and chat performance.
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: AI & Machine Learning
tags:
  - chatbot
  - analytics
  - conversation
  - metrics
  - optimization
---

# AI Chatbot Analytics

This skill helps you implement analytics for the AI coaching chat feature while maintaining HIPAA compliance.

## Decision Points

### 1. Alert Threshold Configuration
```
IF abandonment_rate > 40% within 24h
  → THEN escalate to admin team
  → ELSE log for trending analysis

IF crisis_escalations > 5 within 24h  
  → THEN send email alert immediately
  → ELSE track for weekly review

IF error_rate > 10% within 1h
  → THEN send Slack alert
  → ELSE continue monitoring

IF token_cost > budget_threshold
  → THEN enable cost controls
  → ELSE continue tracking
```

### 2. Category Classification Decision Tree
```
IF metadata.usedCrisisProtocol == true
  → category = "crisis_support"
ELSE IF metadata.usedCopingStrategies == true
  → category = "coping_strategies"  
ELSE IF metadata.usedCheckInSupport == true
  → category = "checkin_support"
ELSE IF metadata.requestedClarification == true
  → category = "clarification"
ELSE
  → category = "general_chat"
```

### 3. Data Storage Compliance Check
```
IF data_contains(PHI_indicators)
  → REJECT storage, log metadata only
ELSE IF data_is_aggregate()
  → STORE for analytics
ELSE IF data_is_metadata()
  → STORE with encryption
ELSE
  → REVIEW manually before storage
```

## Failure Modes

### 1. **PHI Leakage**
- **Symptom**: Analytics contain user messages, specific health topics, or emotional states
- **Detection Rule**: If analytics tables contain columns like `messageContent`, `userQuery`, or `specificTopics`
- **Fix**: Remove PHI columns, implement metadata-only tracking with category flags

### 2. **Alert Fatigue**
- **Symptom**: Too many false positive alerts overwhelming admin team
- **Detection Rule**: If alert frequency > 10 per day or admin response rate < 20%
- **Fix**: Raise thresholds, add time windows, implement alert severity levels

### 3. **Token Cost Explosion**
- **Symptom**: Unexpectedly high AI usage costs without visibility
- **Detection Rule**: If monthly cost > budget by 50% or avg tokens/session > baseline by 200%
- **Fix**: Check input length validation, implement conversation limits, add real-time cost tracking

### 4. **Incomplete Session Tracking**
- **Symptom**: Analytics show many abandoned sessions that were actually completed
- **Detection Rule**: If abandonment rate > 60% but user satisfaction remains high
- **Fix**: Verify `trackConversationEnd()` is called in all exit paths, add session timeout logic

### 5. **Slow Query Performance**
- **Symptom**: Dashboard loads taking >10 seconds, analytics queries timing out
- **Detection Rule**: If query latency > 2s or dashboard bounce rate > 80%
- **Fix**: Add indexes on `started_at`, `user_id`, and `outcome` columns, implement query optimization

## Worked Example

### Scenario: Implementing Crisis Escalation Tracking

**Setup**: User reports feeling overwhelmed, AI detects crisis indicators

```typescript
// 1. Start tracking conversation
await trackConversationStart('conv-789', 'user-123');

// 2. AI processes message and sets metadata flags
const aiResponse = await processMessage(userMessage);
const metadata = {
  usedCrisisProtocol: true,
  usedCopingStrategies: false,
  requestedClarification: false
};

// 3. Expert decision: Check crisis threshold first
if (metadata.usedCrisisProtocol) {
  // Set category immediately
  const category = 'crisis_support';
  
  // Track the exchange with crisis flag
  await trackMessageExchange('conv-789', 
    { input: 150, output: 300 },
    1200, // 1.2s response time
    { hadFallback: false, hasCrisisIndicator: true }
  );
}

// 4. End conversation with escalation
await trackConversationEnd('conv-789', 'crisis_escalated');

// 5. Check if alert threshold reached
const recentCrises = await countCrisisEscalations(24); // last 24h
if (recentCrises > 5) {
  await sendAlert('crisis_spike', { count: recentCrises });
}
```

**Expert catches**: The crisis flag triggers immediate categorization and outcome tracking, bypassing normal conversation flow analysis.

**Novice misses**: Would wait until conversation end to classify, missing real-time escalation opportunity.

## Quality Gates

- [ ] HIPAA audit passes: No PHI stored in analytics tables
- [ ] Query performance: All dashboard queries complete in <2s  
- [ ] Data completeness: >95% of conversations have complete analytics records
- [ ] Alert accuracy: False positive rate <10% for all alert types
- [ ] Cost tracking: Token usage tracked within 1% accuracy of actual API calls
- [ ] Category coverage: >90% of conversations automatically categorized (not 'unknown')
- [ ] Session integrity: Abandonment rate calculation matches user exit patterns
- [ ] Real-time updates: Analytics refresh within 30s of conversation events
- [ ] Index coverage: All queries use database indexes (no table scans)
- [ ] Compliance validation: All stored fields pass PHI detection rules

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Individual user profiling**: Use [user-management] skill instead
- **Content analysis of messages**: Use [ai-safety] skill for content moderation  
- **Billing/payment tracking**: Use [subscription-management] skill instead
- **Performance monitoring of AI model**: Use [ai-monitoring] skill instead
- **Security audit trails**: Use [audit-logging] skill instead

**Delegate when:**
- Need to analyze actual message content → Use content analysis tools with proper PHI handling
- Need real-time conversation interruption → Use AI safety monitoring
- Need detailed user behavior beyond chat → Use comprehensive user analytics platform