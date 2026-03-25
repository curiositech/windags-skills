---
license: Apache-2.0
name: frontend-architect
description: Frontend stack decisions, Cloudflare deployment patterns, component systems, and internal tools architecture. Use for framework selection, deployment strategy, design system bridging, shadcn setup. Activate on "frontend architecture", "tech stack", "Cloudflare Pages", "component library", "internal tools", "shadcn setup". NOT for writing CSS (use frontend-developer), design critique (use design-critic), or backend APIs.
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebFetch,WebSearch
category: Frontend & UI
tags:
  - frontend
  - architect
  - api
  - deployment
  - design
  - css
---

# Frontend Architect

Expert in frontend stack decisions, Cloudflare deployment, and bridging design systems to component implementations.

## Decision Points

### Framework Selection Tree

**1. Performance Budget Assessment**
```
If bundle size must be <100KB:
  → Use Astro (islands architecture)
If first contentful paint must be <800ms:
  → Use Astro or SvelteKit
If you need full SSR + interactivity:
  → Use Next.js or Remix
If team only knows React:
  → Use Next.js or Vite + React
```

**2. Deployment Target Decision**
```
If deploying to Cloudflare Pages:
  → Astro (native) > Next.js (OpenNext) > SvelteKit
If need edge compute + database:
  → Next.js + Turso or Astro + D1
If team uses Vercel:
  → Next.js (best DX) > Astro
If self-hosting:
  → Any framework, consider maintenance overhead
```

**3. Team Capability Assessment**
```
If team <3 developers:
  → Pick familiar stack, avoid learning curves
If team >5 developers:
  → Consider TypeScript monorepo (Turborepo)
If designers hand off static mockups:
  → Astro + MDX for content
If designers work in Figma with dev mode:
  → Next.js + shadcn/ui
```

**4. Content Type Classification**
```
If >80% static content:
  → Astro
If heavy user interactions (dashboards, SPAs):
  → Next.js App Router or Vite + React
If marketing site with CMS:
  → Astro + Sanity/Contentful
If internal tool prototype:
  → Next.js (faster iteration) or Vite (faster builds)
```

## Failure Modes

### Schema Bloat
**Detection**: Bundle size >500KB from framework overhead alone
**Diagnosis**: Using full-stack framework for static content
**Fix**: Switch to Astro. If you see hydration for simple interactions, you're over-engineering

### Deployment Mismatch
**Detection**: Build takes >5 minutes or frequent deployment failures
**Diagnosis**: Wrong adapter for platform (e.g., Node.js app on edge runtime)
**Fix**: Next.js on Cloudflare needs OpenNext. Check runtime compatibility early

### Access Control Theatre
**Detection**: Complex auth logic in frontend for internal tools
**Diagnosis**: Implementing security in wrong layer
**Fix**: Use Cloudflare Access for auth, simple role checks in app. Don't build OAuth from scratch

### Framework FOMO
**Detection**: Considering migration without clear performance/DX problems
**Diagnosis**: Chasing trends instead of solving real problems
**Fix**: Measure current pain points. Only migrate if you can quantify 2x improvement

### Premature Microservices
**Detection**: 3+ repos for a team of <5 developers
**Diagnosis**: Over-engineering for future scale that may never come
**Fix**: Consolidate to monorepo. Split when you have dedicated teams per service

## Worked Examples

### Example 1: Content Site with CMS (Next.js vs Astro)

**Scenario**: Marketing site, 20 pages, blog, team of 2 developers, Contentful CMS

**Decision Process**:
1. **Performance requirement**: Marketing needs <90 Lighthouse score
2. **Content type**: 80% static, 20% interactive (newsletter signup, contact forms)
3. **Team skill**: React familiar, never used Astro
4. **Timeline**: 4 weeks to launch

**Framework Analysis**:
```
Next.js Route:
- Pros: Team familiar, rich ecosystem, good CMS integrations
- Cons: Bundle size ~200KB, hydration cost, overkill for mostly static
- Performance: 75-85 Lighthouse (hydration penalty)

Astro Route:
- Pros: <50KB bundle, 95+ Lighthouse, partial hydration
- Cons: 1-week learning curve, smaller ecosystem
- Performance: 90-100 Lighthouse
```

**Decision**: Choose Astro
- Performance requirement (>90 Lighthouse) eliminates Next.js
- 1-week learning curve acceptable for 4-week timeline
- Use Astro with React islands for forms (familiar components)

**Implementation**:
```bash
npm create astro@latest -- --template minimal
npx astro add react tailwind
# Use .astro for pages, .tsx for interactive islands
```

### Example 2: Internal Tool Prototype

**Scenario**: Admin dashboard prototype, 5 beta users, 2-week sprint

**Decision Process**:
1. **Polish requirement**: 70% (internal tool, not customer-facing)
2. **Iteration speed**: Critical (prototype validation)
3. **Access control**: Must restrict to beta users
4. **Tech debt tolerance**: High (will rebuild if successful)

**Architecture Decision**:
```
Framework: Next.js (fast iteration, familiar)
Styling: shadcn/ui (components without design time)
Auth: Cloudflare Access (zero auth code)
Deployment: Cloudflare Pages with protection
Database: Turso (edge-compatible, easy setup)
```

**Access Control Setup**:
```
1. Cloudflare Access Application:
   - Domain: internal-admin.pages.dev
   - Policy: Allow emails from allowlist
   
2. Feature flags in app:
   - Check cf-access-authenticated-user-email header
   - Grant features based on email (admin vs beta)
```

**What expert catches vs novice misses**:
- **Novice**: Builds custom auth, spends 50% of sprint on login
- **Expert**: Uses Cloudflare Access, focuses 100% on core features

## Quality Gates

- [ ] Framework choice justified with performance/team/timeline constraints
- [ ] Deployment target verified with test deploy (not just documentation)
- [ ] Bundle size measured and under target (<200KB for marketing, <500KB for apps)
- [ ] Team has completed hello-world in chosen framework
- [ ] Access control strategy defined for internal tools
- [ ] Performance budget established with Lighthouse targets
- [ ] Migration path documented if changing from existing stack
- [ ] Cost estimate including hosting, CDN, and edge compute usage
- [ ] Rollback plan defined for deployment issues
- [ ] Component library integration tested with actual design tokens

## NOT-FOR Boundaries

**Don't use this skill for**:
- Writing component styling → Use `frontend-developer` instead
- Design critique or visual assessment → Use `design-critic` instead
- Backend API architecture → Use `api-architect` instead
- Database schema design → Use `database-architect` instead
- CSS debugging or animation → Use `frontend-developer` instead
- DevOps beyond deployment config → Use `devops-automator` instead
- Performance optimization of existing code → Use `performance-optimizer` instead

**Delegation triggers**:
- If discussing CSS selectors or animations → `frontend-developer`
- If evaluating visual hierarchy or user experience → `design-critic`
- If designing REST/GraphQL endpoints → `api-architect`
- If optimizing database queries → `database-architect`