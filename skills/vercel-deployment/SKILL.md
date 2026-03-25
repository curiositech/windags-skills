---
license: Apache-2.0
name: vercel-deployment
description: Deploy Next.js applications to Vercel with proper configuration. Use when setting up deployment, configuring environment variables, edge functions, or troubleshooting builds. Activates for deployment issues, environment setup, and Vercel configuration.
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,vercel:*)
category: DevOps & Infrastructure
tags:
  - devops
  - automation
  - web
  - react
---

# Vercel Deployment

Deploy and configure Next.js applications on Vercel with expert-level decision-making for database selection, environment configuration, and production readiness.

## DECISION POINTS

### Database Selection Decision Tree

```
DECISION: What database should I use?

├── Development/Prototyping (< 1000 users expected)
│   ├── No external dependencies needed → SQLite (local file)
│   └── Need live data sharing → Turso (SQLite edge)
│
├── Production (> 1000 users, team collaboration)
│   ├── Simple schema, global edge performance → Turso
│   ├── Complex queries, existing Postgres knowledge → Vercel Postgres
│   ├── MySQL ecosystem, PlanetScale branching → PlanetScale
│   └── Self-managed, specific requirements → External Postgres/MySQL
│
└── High Scale (> 100k users)
    ├── Global read performance critical → Turso + caching
    ├── Complex analytics, reporting → Vercel Postgres
    └── Cost optimization priority → External managed database
```

### Environment Variable Scope Decision

```
DECISION: Where should this environment variable be set?

├── Contains secrets (API keys, database passwords)
│   ├── Used in build process → Build-time env var
│   └── Used at runtime → Runtime env var (Vercel Dashboard only)
│
├── Client-side access needed
│   ├── Public data (API endpoints) → NEXT_PUBLIC_ prefix
│   └── Should be server-only → Regular env var (no prefix)
│
└── Environment-specific values
    ├── Same across all environments → All scopes (Production + Preview + Development)
    ├── Different per environment → Separate values per scope
    └── Preview testing only → Preview scope only
```

### Build Failure Triage Decision

```
DECISION: Build failing - what's the root cause?

├── Build timeout (>10min Hobby, >45min Pro)
│   ├── Large bundle size → Analyze bundle, enable splitting
│   ├── Slow dependencies → Cache node_modules, optimize installs
│   └── Complex build step → Split into multiple functions
│
├── Memory errors (OOM)
│   ├── Build process → Reduce concurrent processes
│   └── Runtime → Increase function memory allocation
│
├── Environment variables missing
│   ├── Build-time vars → Set in Vercel project settings
│   └── Runtime vars → Check function logs, verify scope
│
└── Dependency issues
    ├── Version conflicts → Lock to specific versions
    └── Missing peer deps → Install explicitly
```

## FAILURE MODES

| Anti-Pattern | Detection Rule | Symptom | Diagnosis | Fix |
|--------------|---------------|---------|-----------|-----|
| **Env Var Leakage** | Client bundle contains server secrets | API keys visible in browser devtools | Used server env var without server-side check | Prefix with NEXT_PUBLIC_ only for public data, verify server-only vars |
| **Build Timeout Spiral** | Build time >15min, getting worse | Builds fail intermittently with timeout | Inefficient build process, growing dependencies | Enable build cache, analyze bundle size, split large operations |
| **Edge Function Bloat** | Edge function >5KB, slow cold starts | Preview deployments slow to respond | Imported server-only libraries in edge runtime | Move to serverless functions, use edge-compatible libraries only |
| **Database Connection Pool Exhaustion** | "too many connections" errors in production | 500 errors during traffic spikes | Each serverless function creates new connection | Implement connection pooling, use database proxy |
| **Preview Environment Pollution** | Production data appears in preview deployments | Test data mixed with real user data | Same database URL for preview and production | Separate DATABASE_URL for preview scope, use staging databases |

## WORKED EXAMPLES

### Example: Deploying Chat App with Turso Database

**Situation**: Deploy Next.js chat application with SQLite database to production

**Expert Decision Process**:

1. **Database Selection** (Decision Tree Navigation):
   - Production app (>1000 users expected) ✓
   - Simple schema (users, messages, sessions) → Turso selected
   - Global performance important for real-time chat ✓

2. **Environment Variable Configuration**:
   ```bash
   # Production scope
   TURSO_DATABASE_URL=libsql://app-prod.turso.io
   TURSO_AUTH_TOKEN=eyJ... (production token)
   SESSION_SECRET=prod-32-char-secret
   
   # Preview scope  
   TURSO_DATABASE_URL=libsql://app-staging.turso.io
   TURSO_AUTH_TOKEN=eyJ... (staging token)
   SESSION_SECRET=preview-32-char-secret
   ```

3. **Build Configuration**:
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build && npm run db:push",
     "regions": ["iad1", "fra1"], // Multi-region for chat
     "functions": {
       "src/app/api/chat/route.ts": {
         "maxDuration": 30 // Longer timeout for AI responses
       }
     }
   }
   ```

4. **Validation Steps Taken**:
   - Test database connectivity: `npm run db:test-connection`
   - Verify environment variable scoping in preview
   - Check build output size <50MB
   - Validate edge function compatibility

**Novice would miss**: Setting different database URLs for preview vs production, optimizing regions for chat performance, longer timeout for AI endpoints.

**Expert catches**: Environment separation, performance implications of database location, build optimization for chat features.

## QUALITY GATES

Deploy only when ALL conditions are met:

- [ ] Database connectivity test passes: `vercel env pull && npm run db:test`
- [ ] All required environment variables set in correct scopes (production, preview)
- [ ] Build completes locally under 5 minutes: `time npm run build`
- [ ] Bundle size analysis shows no critical issues: `ANALYZE=true npm run build`
- [ ] No secrets exposed in client bundle: check `_next/static/` for API keys
- [ ] Preview deployment accessible and functional
- [ ] Environment variable validation passes: all required vars present
- [ ] Database migrations applied successfully in production environment
- [ ] Function memory limits appropriate: no OOM errors in testing
- [ ] Edge functions under 5KB: check `.vercel/output/functions/` sizes

## NOT-FOR BOUNDARIES

**DO NOT use this skill for**:
- Static site deployments without server features → Use [static-site-generation] instead
- Non-Next.js frameworks (Nuxt, SvelteKit) → Use [generic-vercel-deployment] instead  
- Docker container deployments → Use [containerized-deployment] instead
- Multi-service applications requiring orchestration → Use [docker-compose-deployment] instead

**Delegate to other skills**:
- Database schema design → Use [database-design] skill
- API rate limiting implementation → Use [api-security] skill
- Performance optimization beyond deployment → Use [web-performance] skill
- CI/CD pipeline setup → Use [github-actions] skill