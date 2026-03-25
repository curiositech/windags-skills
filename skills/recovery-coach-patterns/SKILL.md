---
license: Apache-2.0
name: recovery-coach-patterns
description: Follow Recovery Coach codebase patterns and conventions. Use when writing new code, components, API routes, or database queries. Activates for general development, code organization, styling, and architectural decisions in this project.
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Recovery & Wellness
tags:
  - recovery
  - patterns
  - coaching
  - development
  - next-js
---

# Recovery Coach Development Patterns

## Decision Points

### Component Architecture Selection
```
Is this component handling user data?
├─ YES: Does it need real-time updates?
│  ├─ YES: Use Client Component with useEffect + fetch
│  └─ NO: Use Server Component with direct DB query
└─ NO: Is it interactive (forms, buttons, state)?
   ├─ YES: Use Client Component
   └─ NO: Use Server Component
```

### API Route Security Level
```
What data does this route access?
├─ Public data only → Basic rate limiting (100/min)
├─ User's own data → Auth + RLS + moderate rate limiting (30/min)  
├─ Cross-user data → Auth + explicit permission check + PHI audit
└─ Admin data → requireAdmin() + strict rate limiting (10/min) + security audit
```

### Database Query Pattern
```
Who can access this data?
├─ User's own data only
│  └─ Use secure-db with RLS (filters automatically)
├─ Admin accessing any data
│  ├─ Call requireAdmin() first
│  └─ Log admin access with logSecurityEvent()
└─ System/background job
   └─ Use regular db connection with explicit WHERE clauses
```

## Failure Modes

### Anti-Pattern: RLS Bypass Attempt
**Symptoms:** Using regular `db` instead of `secure-db` for user data queries
**Detection:** `import { db } from '@/lib/db'` in user-facing code
**Fix:** 
1. Change to `import { db } from '@/db/secure-db'`
2. Ensure RLS policies exist for the table
3. Test with different user sessions

### Anti-Pattern: Missing Rate Limit
**Symptoms:** API route accepts unlimited requests, potential DoS
**Detection:** No `createRateLimiter` call in route handler
**Fix:**
1. Add rate limiter with appropriate limits for endpoint type
2. Apply `rateLimitResult` check before processing
3. Return 429 status with retry headers

### Anti-Pattern: PHI Logging Leak
**Symptoms:** User health data appears in console.log or error messages
**Detection:** `console.log` or `throw new Error` containing user data
**Fix:**
1. Remove sensitive data from logs
2. Use `logPHIAccess()` for legitimate audit trails
3. Return generic error messages to client

### Anti-Pattern: Schema Validation Skip
**Symptoms:** API accepts malformed data, causing runtime errors
**Detection:** Missing `z.object()` schema or `.safeParse()` call
**Fix:**
1. Define Zod schema for all inputs
2. Use `.safeParse()` and check `success` property
3. Return validation errors with 400 status

### Anti-Pattern: Unhandled Auth State
**Symptoms:** Component crashes when user logs out mid-session
**Detection:** Assuming session exists without null checks
**Fix:**
1. Check `if (!session)` before using session data
2. Show login prompt or redirect to auth page
3. Handle loading states during auth checks

## Worked Examples

### Creating a New Check-In API Route

**Scenario:** Add endpoint for users to submit daily wellness check-ins with mood and notes.

**Expert Decision Process:**
1. **Security Assessment:** User's own health data → needs auth + RLS + PHI audit
2. **Rate Limiting:** Personal health data → moderate limits (30/min)
3. **Validation:** User input → strict Zod schema required

**Implementation:**
```typescript
// src/app/api/check-in/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createRateLimiter } from '@/lib/rate-limit';
import { logPHIAccess } from '@/lib/hipaa/audit';
import { db, checkIns } from '@/db/secure-db';
import { z } from 'zod';

const rateLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 30, // Health data = moderate limit
  keyPrefix: 'api:check-in'
});

const CheckInSchema = z.object({
  mood: z.number().min(1).max(10),
  notes: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).max(10)
});

export async function POST(request: Request) {
  // Auth check (required for user data)
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting (prevent abuse)
  const rateLimitResult = await rateLimiter.check(session.userId);
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Input validation (prevent bad data)
  const body = await request.json();
  const parsed = CheckInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Invalid input',
      details: parsed.error.issues
    }, { status: 400 });
  }

  // Database operation (RLS auto-filters to user's data)
  const checkIn = await db.insert(checkIns).values({
    userId: session.userId,
    mood: parsed.data.mood,
    notes: parsed.data.notes,
    symptoms: parsed.data.symptoms,
    createdAt: new Date()
  }).returning();

  // PHI audit log (required for health data)
  await logPHIAccess(session.userId, 'check-in', checkIn[0].id, 'CREATE');

  return NextResponse.json(checkIn[0]);
}
```

**What novices miss:** Skip rate limiting, forget PHI audit logging, use console.log for debugging user data
**What experts catch:** Health data needs all security layers, RLS handles user isolation automatically

## Quality Gates

Pre-submit checklist for all code changes:

- [ ] Authentication verified: `getSession()` called for protected routes
- [ ] Rate limiting configured: Appropriate limits for endpoint type  
- [ ] Input validation: Zod schemas defined and `.safeParse()` used
- [ ] RLS enabled: Using `secure-db` for user data queries
- [ ] PHI audit logging: `logPHIAccess()` called for health data operations
- [ ] Error handling: No user data in error messages or logs
- [ ] Type safety: TypeScript strict mode passes without `any` types
- [ ] Testing: Unit tests cover happy path and error conditions
- [ ] HIPAA compliance: No PHI in client-side storage or URLs
- [ ] Accessibility: Semantic HTML and ARIA labels for interactive elements

## NOT-FOR Boundaries

**DO NOT use this skill for:**

- Crisis intervention features → Use `crisis-response-protocol` instead
- Content moderation rules → Use `recovery-community-moderator` instead  
- AI coaching logic → Use `modern-drug-rehab-computer` instead
- General Next.js patterns → Use Next.js documentation instead
- Third-party integrations → Create specific integration skills instead

**When to delegate:**
- For mental health crisis detection: `crisis-response-protocol`
- For inappropriate content handling: `recovery-community-moderator`
- For AI conversation flows: `modern-drug-rehab-computer`
- For deployment and infrastructure: Create DevOps-specific skill