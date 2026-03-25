---
license: Apache-2.0
name: fullstack-debugger
description: "Expert debugger for Next.js + Cloudflare Workers + Supabase stacks. Systematic troubleshooting for auth, caching, workers, RLS, CORS, and build issues. Activate on: 'debug', 'not working', 'error', 'broken', '500', '401', '403', 'cache issue', 'RLS', 'CORS'. NOT for: feature development (use language skills), architecture design (use system-architect)."
allowed-tools: Read,Write,Edit,Bash,Grep,Glob,WebFetch,mcp__supabase__*,mcp__playwright__*
category: Code Quality & Testing
tags:
  - debugging
  - nextjs
  - cloudflare-workers
  - supabase
  - troubleshooting
pairs-with:
  - skill: devops-automator
    reason: Deployment and infrastructure issues
  - skill: site-reliability-engineer
    reason: Production incidents
---

# Fullstack Debugger

Expert debugger for Next.js + Cloudflare Workers + Supabase stacks. Evidence-based troubleshooting with systematic layer isolation.

## DECISION POINTS

### 1. Error Source Identification

```
Is there an error message visible?
├── YES: Browser console error
│   ├── "Failed to fetch" → CORS/Network issue → Test endpoint with curl
│   ├── "Hydration failed" → SSR/Client mismatch → Check for browser APIs
│   ├── "Cannot read properties" → Data loading race → Add optional chaining
│   └── TypeScript error → Type mismatch → Check interface definitions
│
├── YES: Network tab shows red
│   ├── 401/403 status → Auth issue → Check JWT + RLS policies
│   ├── 404 status → Wrong endpoint → Verify worker routes
│   ├── 500 status → Server error → Check worker logs
│   └── CORS preflight fail → Missing headers → Add OPTIONS handler
│
├── YES: Build/Deploy error
│   ├── "Module not found" → Import path wrong → Check relative paths
│   ├── "Type error" → TypeScript strict → Fix type definitions
│   ├── Memory exceeded → Bundle too large → Check webpack config
│   └── Deploy timeout → Worker size → Optimize dependencies
│
└── NO: Silent failure/unexpected behavior
    ├── Empty data returned → RLS blocking → Test with direct SQL
    ├── Stale data shown → Cache not invalidating → Check KV cache keys
    ├── Auth state lost → Session issue → Verify localStorage persistence
    └── Worker not updating → Deploy failed → Check wrangler status
```

### 2. Layer Isolation Strategy

```
Which layer contains the bug?
│
├── Client (Browser/React)
│   ├── Console errors present → Fix JavaScript/React issues
│   ├── Network requests failing → Check endpoint accessibility
│   └── State management broken → Debug React Query/Context
│
├── Next.js Application
│   ├── Build fails → Fix TypeScript/import issues
│   ├── Pages not rendering → Check routing/components
│   └── SSR/SSG issues → Verify static generation setup
│
├── Cloudflare Worker
│   ├── Worker logs show errors → Fix worker code
│   ├── CORS headers missing → Add proper headers
│   └── KV cache issues → Check cache keys/expiration
│
├── Supabase Database
│   ├── Auth failing → Check user session/JWT
│   ├── Queries empty → Test RLS policies
│   └── Realtime broken → Verify subscriptions
│
└── External APIs
    ├── Rate limited → Check headers/implement backoff
    ├── Changed response format → Update parsing logic
    └── Service unavailable → Add error handling/fallbacks
```

### 3. Fix Validation Process

```
After applying fix, how to verify?
│
├── Local testing
│   ├── Run `npm run build` → Ensure no build errors
│   ├── Test in browser → Verify UI works correctly
│   ├── Check console → No new errors introduced
│   └── Test edge cases → Boundary conditions work
│
├── Worker testing
│   ├── Deploy to staging → `wrangler deploy --env staging`
│   ├── Test endpoints → Curl all affected routes
│   ├── Check logs → `wrangler tail` shows no errors
│   └── Monitor for 10min → No immediate regressions
│
└── Database testing
    ├── Test as anon user → RLS policies work correctly
    ├── Test as auth user → Permissions appropriate
    ├── Check query performance → No new slow queries
    └── Verify data integrity → No data corruption
```

## FAILURE MODES

### 1. Rubber Stamp Debugging
**Symptoms:** Applying common fixes without understanding root cause
**Detection:** If you're changing multiple things at once without testing each
**Fix:** Stop. Reproduce issue first, then test ONE hypothesis at a time

### 2. Layer Confusion
**Symptoms:** Debugging client code when issue is in worker, or vice versa
**Detection:** If you've been debugging for 30+ minutes in wrong layer
**Fix:** Use decision tree above to isolate which layer actually has the bug

### 3. Cache Blindness
**Symptoms:** "Fixed" code still showing old behavior due to cached responses
**Detection:** If fix looks correct but behavior unchanged
**Fix:** Clear ALL caches - browser, React Query, KV, TypeScript, CDN

### 4. RLS Tunnel Vision
**Symptoms:** Assuming all empty queries are RLS issues
**Detection:** If you immediately jump to RLS without checking other causes
**Fix:** First verify query syntax, then check network, then RLS policies

### 5. Production Panic
**Symptoms:** Making multiple changes rapidly when live site is broken
**Detection:** If you're editing production code without local reproduction
**Fix:** Reproduce locally first, or rollback immediately and debug systematically

## WORKED EXAMPLES

### Example 1: JWT Token Expiry Causing 401 Errors

**Initial symptom:** User reports getting logged out randomly, 401 errors in network tab

**Step 1: Layer isolation**
- Check browser console → No errors
- Check network tab → 401 on /api/profile requests
- Status 401 = auth issue → Focus on Supabase layer

**Step 2: Evidence gathering**
```bash
# Check current JWT
node -e "
const jwt = localStorage.getItem('sb-project-auth-token');
console.log('JWT payload:', JSON.parse(atob(jwt.split('.')[1])));
console.log('Expires:', new Date(JSON.parse(atob(jwt.split('.')[1])).exp * 1000));
"
```

**Step 3: Root cause analysis**
JWT shows expiry 1 hour ago. Token refresh failing because:
- RLS policy on profiles table requires valid JWT
- Refresh endpoint also hitting profiles table
- Circular dependency causing refresh to fail

**Step 4: Fix implementation**
```sql
-- Create policy that allows token refresh
CREATE POLICY "Allow token refresh" ON profiles
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    OR current_setting('request.jwt.claims', true)::json->>'exp' > extract(epoch from now())::text
  );
```

**Step 5: Verification**
- Clear localStorage
- Log in fresh user
- Wait 1 hour
- Verify automatic token refresh works
- Check no 401 errors in network tab

**Lesson:** Token expiry can create cascading auth failures when RLS policies block refresh attempts

### Example 2: CORS Error on Worker Endpoint

**Initial symptom:** "Access to fetch blocked by CORS policy" when calling worker API

**Step 1: Reproduction**
```bash
# Direct curl works
curl https://my-worker.workers.dev/api/meetings
# Returns data successfully

# Browser fetch fails with CORS error
fetch('https://my-worker.workers.dev/api/meetings').catch(console.error)
# CORS error
```

**Step 2: Diagnosis**
```bash
# Check what headers are returned
curl -i -H "Origin: https://my-site.com" https://my-worker.workers.dev/api/meetings
# Missing Access-Control-Allow-Origin header
```

**Step 3: Trade-off analysis**
Option A: Allow all origins (*) - Simple but less secure
Option B: Whitelist specific domains - Secure but requires maintenance
Option C: Dynamic origin checking - Flexible but more complex

**Step 4: Fix with security consideration**
```typescript
// worker.js - Option B chosen for security
const ALLOWED_ORIGINS = [
  'https://my-site.com',
  'https://my-site-staging.pages.dev',
  'http://localhost:3000' // dev only
];

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle preflight
if (request.method === 'OPTIONS') {
  return new Response(null, { 
    headers: corsHeaders(request.headers.get('Origin')) 
  });
}
```

**Step 5: Verification**
```bash
# Test from allowed origin
curl -H "Origin: https://my-site.com" -i https://my-worker.workers.dev/api/meetings
# Should include Access-Control-Allow-Origin: https://my-site.com

# Test from disallowed origin  
curl -H "Origin: https://evil-site.com" -i https://my-worker.workers.dev/api/meetings
# Should include Access-Control-Allow-Origin: null
```

**Lesson:** CORS failures often indicate missing preflight handling; security requires thoughtful origin whitelisting

### Example 3: RLS Policy Silently Blocking Data

**Initial symptom:** Meeting search returns empty array, but Supabase dashboard shows data exists

**Step 1: Evidence collection**
```javascript
// Test current query
const { data, error, count } = await supabase
  .from('meetings')
  .select('*', { count: 'exact' })
  .limit(5);
console.log({ data, error, count }); // data: [], error: null, count: 0
```

**Step 2: Isolate RLS vs query issue**
```sql
-- In Supabase SQL Editor, test as anon user
SET ROLE anon;
SELECT COUNT(*) FROM meetings; -- Returns 0
RESET ROLE;

-- Test as admin
SELECT COUNT(*) FROM meetings; -- Returns 1000+
```

**Step 3: Policy analysis**
```sql
-- Check existing policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'meetings';

-- Shows: "authenticated_read" policy with USING (auth.uid() IS NOT NULL)
```

**Step 4: Root cause**
Anonymous users need read access to public meetings, but policy requires authentication. Query silently fails instead of erroring.

**Step 5: Fix with proper scoping**
```sql
-- Remove overly restrictive policy
DROP POLICY "authenticated_read" ON meetings;

-- Add public read for published meetings
CREATE POLICY "public_read_published" ON meetings
  FOR SELECT USING (status = 'published');

-- Add authenticated read for all meetings
CREATE POLICY "authenticated_read_all" ON meetings  
  FOR SELECT TO authenticated USING (true);
```

**Step 6: Verification**
```sql
-- Test as anon - should see published only
SET ROLE anon;
SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'published') 
FROM meetings; -- Should show same count for both

-- Test as authenticated - should see all
SET ROLE authenticated;
SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'published') 
FROM meetings; -- Total count > published count
```

**Lesson:** RLS policies fail silently; always test with actual user roles, not just admin dashboard

## QUALITY GATES

**Before marking debug complete, verify:**

- [ ] Issue can be reproduced consistently in original environment
- [ ] Root cause identified with supporting evidence (logs, queries, network traces)
- [ ] Fix applied addresses root cause, not just symptoms
- [ ] Solution tested in clean browser session / incognito mode
- [ ] No new errors introduced in browser console
- [ ] No failed requests in network tab after fix
- [ ] Worker logs show no new errors (if workers involved)
- [ ] Database queries return expected results (if DB involved)
- [ ] Fix works for both authenticated and anonymous users (if auth involved)
- [ ] Change tested in production-like environment (not just localhost)
- [ ] No performance regression introduced (check load times)
- [ ] Documentation updated if configuration changed

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**

- **Feature development** → Use language-specific skills (typescript-expert, react-expert)
- **Architecture design** → Use `system-architect` for design decisions  
- **Performance optimization** → Use `performance-engineer` for speed/efficiency
- **Security audits** → Use `security-analyst` for vulnerability assessment
- **Database design** → Use `data-engineer` for schema/query optimization
- **UI/UX issues** → Use `frontend-expert` for design/usability problems

**Delegate when you see:**
- "How should I structure this feature?" → `system-architect`
- "This page loads slowly" → `performance-engineer` 
- "Is this secure?" → `security-analyst`
- "What's the best database schema?" → `data-engineer`
- "Users find this confusing" → `frontend-expert`