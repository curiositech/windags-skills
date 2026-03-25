---
license: Apache-2.0
name: hipaa-compliance
description: Ensure HIPAA compliance when handling PHI (Protected Health Information). Use when writing code that accesses user health data, check-ins, journal entries, or any sensitive information. Activates for audit logging, data access, security events, and compliance questions.
allowed-tools: Read,Write,Edit
category: Legal & Compliance
tags:
  - hipaa
  - compliance
  - healthcare
  - privacy
  - security
---

# HIPAA Compliance for Recovery Coach

This skill helps you maintain HIPAA compliance when developing features that handle Protected Health Information (PHI).

## DECISION POINTS

### PHI Classification Decision Tree

```
Is this user data?
├─ NO → No HIPAA requirements, proceed normally
└─ YES → Is it health-related or personally identifiable?
   ├─ NO (aggregated analytics, page views) → No audit logging needed
   └─ YES → PHI detected, proceed to access type:
      ├─ READ access → Use logPHIAccess() + authentication check
      ├─ WRITE/UPDATE → Use logPHIModification() + change tracking
      ├─ DELETE → Use logPHIModification() + soft delete preferred
      └─ EXPORT → Use logAdminAction() + encryption required
```

### Ambiguous Data Classification

| Data Type | PHI Status | Decision Rule |
|-----------|------------|---------------|
| Check-in mood/cravings | PHI | Always audit - health condition |
| Journal entries | PHI | Always audit - personal health notes |
| Chat messages | PHI | Always audit - health discussions |
| User profile (name/email) | PHI | Audit modifications only |
| Sobriety date | PHI | Always audit - health milestone |
| Usage patterns (timing) | Depends | If linkable to individual → PHI |
| Error logs with userIds | PHI | If contains health context → PHI |

### Logging Performance Decision Tree

```
Is this a high-frequency operation (>100/min)?
├─ NO → Use synchronous audit logging
└─ YES → Performance consideration needed:
   ├─ Critical PHI access → Async logging with failure retry
   ├─ Bulk operations → Batch logging every 100 records
   └─ Analytics tracking → Sample logging (1 in 10)
```

## FAILURE MODES

### Anti-Pattern: Audit Log Gaps
**Symptoms:** Missing entries in audit trail, incomplete access records
**Detection:** `if (auditLog.count < actualOperations.count)`
**Fix:** Add try-catch around all PHI operations, implement audit middleware

### Anti-Pattern: PHI Content Leakage
**Symptoms:** Actual health data appears in logs or error messages
**Detection:** `if (logEntry.includes(personalHealthInfo))`
**Fix:** Use sanitization middleware, audit log reviews, content redaction

### Anti-Pattern: Session Hijacking Vulnerability
**Symptoms:** Users accessing data without recent authentication
**Detection:** `if (timeSinceLastAuth > 15_MINUTES && accessingPHI)`
**Fix:** Force re-authentication for PHI access, implement session timeouts

### Anti-Pattern: Break Glass Abuse
**Symptoms:** Emergency access used for non-emergencies
**Detection:** `if (breakGlassUsage.frequency > normalPatterns)`
**Fix:** Require written justification, automated compliance officer alerts

### Anti-Pattern: Encryption At Rest Failures
**Symptoms:** PHI stored in plaintext, backup files unencrypted
**Detection:** `if (database.encryption === false && containsPHI)`
**Fix:** Enable database encryption, encrypt export files, audit storage

## WORKED EXAMPLES

### Scenario: Building Chat History Viewer with Performance Trade-offs

**Context:** User wants to view 6 months of chat history (1000+ messages).

**Step 1 - PHI Classification:**
```typescript
// Decision: Chat messages contain health discussions → PHI
const messageType = 'chat';
const isPHI = true; // Health-related conversations
```

**Step 2 - Performance vs Compliance Trade-off:**
```typescript
// OPTION A: Real-time logging (high latency)
messages.forEach(async (msg) => {
  await logPHIAccess(userId, 'chat', msg.id, AuditAction.PHI_VIEW);
});

// OPTION B: Batch logging (chosen solution)
const batchSize = 100;
const messageChunks = chunk(messages, batchSize);

for (const chunk of messageChunks) {
  await logBatchPHIAccess(
    userId, 
    'chat_bulk', 
    chunk.map(m => m.id),
    AuditAction.PHI_VIEW,
    { messageCount: chunk.length }
  );
}
```

**Expert vs Novice:**
- **Novice miss:** Would log each message individually, causing 5+ second load times
- **Expert catch:** Batch logging maintains compliance while preserving UX, includes metadata count for audit completeness

**Step 3 - Implementation:**
```typescript
export async function getChatHistory(userId: string) {
  const session = await requireAuth();
  
  // Performance: Paginated fetch
  const messages = await db.messages.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100 // First page only
  });
  
  // Compliance: Batch audit log
  await logBatchPHIAccess(
    session.userId,
    'chat_history',
    messages.map(m => m.id),
    AuditAction.PHI_VIEW,
    { 
      pageSize: messages.length,
      totalRequested: '6_months',
      loadTime: performance.now()
    }
  );
  
  return messages;
}
```

## QUALITY GATES

Before deploying any PHI-related feature:

- [ ] All PHI read operations have corresponding audit log entries
- [ ] All PHI write operations include change metadata (never actual content)
- [ ] Authentication check exists before any PHI access
- [ ] Session timeout enforcement is active (15 min for PHI routes)
- [ ] Error handling never exposes PHI in error messages
- [ ] Database queries use parameterized statements (SQL injection prevention)
- [ ] PHI export features create audit trail entries
- [ ] Failed access attempts trigger security event logs
- [ ] Break glass access requires written justification
- [ ] All audit logs exclude actual PHI content (IDs and metadata only)

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**

- **Non-health applications** → For general privacy compliance, use [gdpr-compliance] skill instead
- **Financial data protection** → For PCI DSS compliance, use [financial-security] skill instead  
- **Internal analytics** → For usage tracking without PHI, use [analytics-privacy] skill instead
- **API rate limiting** → For general security, use [api-security] skill instead
- **Database design** → For schema design, use [data-modeling] skill instead

**When to delegate:**
- **If handling payment data:** Use [pci-compliance] skill
- **If building authentication:** Use [auth-security] skill  
- **If designing data retention:** Use [data-lifecycle] skill
- **If incident response needed:** Use [security-incident] skill