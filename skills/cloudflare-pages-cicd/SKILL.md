---
license: Apache-2.0
name: cloudflare-pages-cicd
description: "Cloudflare Pages CI/CD with preview environments, edge functions, and Wrangler automation. Activate on: Cloudflare Pages, Wrangler deploy, preview environment, edge function, Pages project, Cloudflare Workers integration, custom domain on Pages. NOT for: Worker-specific development (use cloudflare-worker-dev), DNS management (use devops-automator), full-stack app frameworks (use vercel-deployment)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - cloudflare
  - ci-cd
  - edge
  - deployment
pairs-with:
  - skill: cloudflare-worker-dev
    reason: Workers and Pages share the Cloudflare platform; Pages Functions are Workers under the hood
  - skill: ci-cache-optimizer
    reason: Build caching strategies apply to Cloudflare Pages builds
---

# Cloudflare Pages CI/CD

Expert in deploying and automating Cloudflare Pages projects with preview environments, edge functions, and Wrangler CLI.

## Decision Points

### Compute Platform Selection
```
Request processing needs:
├─ Static assets only → Pages (no functions needed)
├─ <10ms CPU + simple API routes → Pages Functions
├─ 10-50ms CPU + stateful operations → Workers
└─ >50ms CPU or heavy processing → Queues + Workers

Deployment model:
├─ Git-based with previews → Pages Git integration
├─ CI/CD with artifact upload → `wrangler pages deploy`
├─ Local development testing → `wrangler pages dev`
└─ Multi-environment promotion → Direct upload with branch targeting
```

### Build Configuration Strategy
```
Framework detected:
├─ Next.js → Use @cloudflare/next-on-pages adapter
├─ Astro/SvelteKit/Remix → Native Cloudflare support
├─ Static site generator → Standard build command
└─ Custom build → Specify exact build command + output dir

Environment variables needed:
├─ Public vars → [vars] in wrangler.toml
├─ Secrets → `wrangler pages secret put`
├─ Preview-specific → Environment-based binding IDs
└─ Build-time only → CI/CD environment variables
```

### Binding Architecture
```
Data persistence requirements:
├─ Cache/sessions → KV (global, eventual consistency)
├─ Relational data → D1 (SQL, strong consistency per location)
├─ File storage → R2 (S3-compatible object storage)
├─ Real-time state → Durable Objects
└─ External APIs → Service bindings or fetch()

Preview environment isolation:
├─ Development → Separate binding IDs for all resources
├─ Staging → Shared read-only or staging-specific resources  
├─ Production → Live binding IDs
└─ Local dev → `--local` flag with local SQLite/memory KV
```

## Failure Modes

### Build Timeout Death Spiral
**Symptoms:** Builds consistently timeout at 20+ minutes, "Build exceeded time limit"
**Root cause:** Inefficient dependency installation or missing build cache
**Fix:** 
- Add `node_modules` caching in CI/CD
- Use `npm ci` instead of `npm install`
- Enable Wrangler's incremental uploads with `--no-bundle`
**Detection:** `grep "Build exceeded" build-logs.txt`

### Environment Variable Mismatch
**Symptoms:** Functions work locally but fail in production with "undefined is not a function"
**Root cause:** Missing environment variables or incorrect binding names
**Fix:**
- Verify `wrangler.toml` matches dashboard bindings exactly
- Use `wrangler pages deployment tail` to debug runtime errors
- Check binding names match interface definition
**Detection:** Runtime errors mentioning "Cannot read property" on env bindings

### Preview Environment Poisoning  
**Symptoms:** Preview deployments show production data or fail authentication
**Root cause:** Shared binding IDs between environments
**Fix:**
- Create separate D1/KV/R2 instances for preview
- Use environment-specific binding IDs in wrangler.toml
- Implement environment detection in Functions code
**Detection:** Preview URLs returning production data or 401 errors

### Function Memory Exhaustion
**Symptoms:** "Memory limit exceeded" errors, slow response times >5s
**Root cause:** Loading large datasets in Functions (128MB limit)
**Fix:**
- Move data processing to Workers or external service
- Implement pagination for large queries
- Use streaming responses for big payloads
**Detection:** `Memory usage exceeded` in Function logs

### Git Integration Drift
**Symptoms:** Manual deploys work but Git pushes don't trigger builds
**Root cause:** Webhook disconnected or incorrect build settings
**Fix:**
- Reconnect Git integration in Cloudflare dashboard
- Verify build command and output directory match local setup
- Check branch protection rules aren't blocking deployments
**Detection:** Git commits without corresponding deployment notifications

## Worked Examples

### GitHub Actions CI/CD Pipeline with Preview

**Scenario:** Next.js app needs branch-based previews + production deploys

**Step 1: Decision Points Navigation**
- Framework: Next.js → Use @cloudflare/next-on-pages
- Deployment: CI/CD artifacts → Direct upload via Actions
- Environment isolation needed → Separate binding IDs

**Step 2: GitHub Actions Workflow**
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: npm-${{ hashFiles('package-lock.json') }}
          
      - name: Install and build
        run: |
          npm ci
          npx @cloudflare/next-on-pages
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=my-app --branch=${{ github.ref_name }}
          
      - name: Comment PR with preview URL
        if: github.event_name == 'pull_request'
        run: |
          PREVIEW_URL="https://${{ github.sha }}.my-app.pages.dev"
          gh pr comment ${{ github.event.number }} --body "🚀 Preview: $PREVIEW_URL"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Step 3: Expert vs Novice Catches**
- **Novice misses:** Caching dependencies (slow builds), branch-specific deployments
- **Expert catches:** Using commit SHA for preview URLs, proper Next.js adapter, cache keys

**Step 4: Quality Gate Validation**
- ✅ Preview URL posted to PR
- ✅ Main branch deploys to production domain
- ✅ Build completes under 2 minutes with caching

## Quality Gates

```
[ ] wrangler.toml has compatibility_date within 6 months
[ ] All bindings have separate preview/production IDs configured
[ ] Git integration connected and webhook responding to pushes
[ ] Preview deployments generate unique URLs for each branch/commit
[ ] Build command produces output in specified directory
[ ] Pages Functions use TypeScript with proper Env interface
[ ] Custom domain configured with SSL certificate active
[ ] Build time consistently under 3 minutes
[ ] Environment variables properly scoped (secrets vs vars)
[ ] Deployment notifications integrated with team communication
[ ] Function response times <100ms for simple operations
[ ] Static assets served with proper caching headers
```

## NOT-FOR Boundaries

**Don't use Cloudflare Pages for:**
- **Complex Workers logic** → Use `cloudflare-worker-dev` for advanced Workers features, WebSockets, or CPU-intensive tasks
- **DNS/domain management** → Use `devops-automator` for Cloudflare DNS API operations and domain configuration  
- **Full-stack frameworks needing SSR** → Use `vercel-deployment` for frameworks requiring Node.js runtime or complex server logic
- **Database management** → Pages handles bindings only; use dedicated database skills for schema design and migrations
- **CDN configuration** → Pages handles basic caching; use specialized CDN skills for advanced cache rules and edge logic

**Delegate to:**
- Heavy compute → Workers + Queues
- Real-time features → Durable Objects
- Database operations → D1 management skills
- Advanced networking → Workers for custom protocols