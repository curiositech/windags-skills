---
license: Apache-2.0
name: dependency-management
description: Managing third-party dependencies — version pinning, security auditing, license compliance, update workflows, lockfile management, supply chain security. Activate on "npm audit", "dependabot", "renovate", "pin versions", "dependency update", "supply chain", "license compliance", "lockfile", "security advisory", "typosquatting", "SBOM". NOT for internal monorepo package management (use monorepo-management) or publishing your own packages to npm/PyPI.
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
metadata:
  category: Code Quality & Testing
  tags:
    - dependency
    - management
    - npm-audit
    - dependabot
    - renovate
  pairs-with:
    - skill: security-auditor
      reason: Dependency vulnerability scanning is a critical security audit dimension
    - skill: monorepo-management
      reason: Monorepo workspace dependency hoisting and version alignment require specialized management
    - skill: devops-automator
      reason: CI/CD pipelines automate dependency auditing, lockfile validation, and update workflows
category: DevOps & Infrastructure
tags:
  - dependencies
  - package-management
  - npm
  - versioning
  - upgrades
---

# Dependency Management

## Decision Points

### 1. Should I add this dependency?

```
Package evaluation flow:
├─ Code volume > 200 lines? → Proceed to evaluation
├─ Code volume 20-200 lines?
│  ├─ Pure logic (no edge cases, locale, timezone)? → Write yourself
│  └─ Complex domain (crypto, date handling, parsing)? → Proceed to evaluation
└─ Code volume < 20 lines? → Write yourself

Dependency evaluation checklist:
├─ Downloads/week?
│  ├─ < 10k → HIGH RISK (consider alternatives)
│  ├─ 10k-100k → MEDIUM (check maintenance)
│  └─ > 100k → Proceed
├─ Last commit within 2 years? → If no, find maintained fork
├─ License compatible with your project? → If GPL in proprietary, REJECT
├─ npm audit / Socket.dev clean? → If CVEs unfixed, REJECT
└─ Transitive deps < 50? → If > 50, reconsider blast radius
```

### 2. How to version pin?

```
By environment:
├─ Production app dependencies → Exact pins (1.2.3) + lockfile
├─ Library you publish → Tilde ranges (~1.2.3) for flexibility
├─ Dev tooling only → Caret (^1.2.3) acceptable for churn
└─ Never use star (*) → Catastrophic randomness

By risk tolerance:
├─ Zero-downtime services → Exact pins, staged rollouts
├─ Internal tools → Ranges OK with good test coverage
└─ Experimental projects → Ranges to catch breaking changes early
```

### 3. How to handle updates?

```
Automation decision:
├─ Team size > 3 developers? → Use Renovate or Dependabot
├─ High-churn project (>20 deps)? → Use automation with grouping
└─ Small/stable project? → Manual monthly audit acceptable

Tool selection:
├─ GitHub-only, simple needs → Dependabot
├─ Multi-platform or advanced grouping → Renovate
└─ Air-gapped environment → Manual with local scanning

Grouping strategy:
├─ Dev dependencies → Group all patch updates
├─ Production dependencies → One PR per major, group minors
└─ Security updates → Always individual PRs for visibility
```

### 4. How to respond to security advisory?

```
Severity triage:
├─ Critical (CVSS 9.0+) → Drop everything, fix within 24h
├─ High (7.0-8.9) → Fix within 1 week
├─ Medium (4.0-6.9) → Fix in next sprint
└─ Low (<4.0) → Fix opportunistically

Path analysis:
├─ Direct dependency → Update to patched version
├─ Transitive dependency?
│  ├─ Direct dep has update → Update direct dep
│  ├─ No update available → Use npm overrides/resolutions
│  └─ Dev dependency only → Assess if tooling reaches production
└─ No patch available → Find alternative or vendor/patch yourself
```

### 5. When to use npm overrides?

```
Use overrides when:
├─ Transitive dep has vulnerability, no upstream fix available
├─ Version conflict between multiple dependents
└─ Need to force newer version for compatibility

DON'T use overrides for:
├─ Working around peer dependency warnings (fix the root cause)
├─ Downgrading to avoid testing breaking changes
└─ Long-term fixes (pressure upstream to update)
```

## Failure Modes

### Schema Bloat
**Symptoms**: Project has 200+ dependencies for simple functionality, bundle size ballooning, frequent update conflicts.
**Diagnosis**: Team adding packages for trivial utilities (is-odd, left-pad), not evaluating code-to-dependency ratio.
**Fix**: Audit with `npx cost-of-modules`, remove packages <10KB unless they handle complex domains (crypto, i18n, protocols). Write trivial utilities in-house.

### Version Conflict Hell
**Symptoms**: Peer dependency warnings flooding logs, runtime errors about missing APIs, npm install taking minutes.
**Diagnosis**: Using caret ranges on production dependencies, multiple versions of React/Angular/Vue in tree.
**Fix**: Pin direct dependencies exactly, use `npm ls <package>` to trace conflicts, resolve with explicit overrides or upgrade all consumers to compatible range.

### Stale Vulnerability Debt
**Symptoms**: npm audit showing same vulnerabilities for weeks, security scanners red in CI, audit fatigue setting in.
**Diagnosis**: Treating security advisories as "background noise" instead of prioritized work items.
**Fix**: Implement SLA by severity (Critical=24h, High=1week), assign ownership, track resolution in sprint planning. Use `npm audit --audit-level=high` to focus on actionable items.

### Rubber Stamp Updates
**Symptoms**: Auto-merging all dependency PRs without review, surprise production failures after "safe" patch updates.
**Diagnosis**: Trusting semver absolutely, not understanding that patch versions can introduce breaking changes.
**Fix**: Auto-merge only dev dependencies + patches with full test coverage. Always human-review production dependencies, major versions, and packages with <100k downloads/week.

### Lockfile Drift
**Symptoms**: "Works on my machine" dependency issues, CI installing different versions than local development.
**Diagnosis**: Developers running `npm install` instead of `npm ci`, lockfile not committed or gitignored.
**Fix**: CI must use `npm ci` exclusively, commit lockfiles, add pre-commit hook to validate lockfile freshness with `npm ci --dry-run`.

## Worked Examples

### Example 1: Adding a Risky Dependency

**Scenario**: Need date manipulation. Considering moment.js vs date-fns vs writing custom.

**Decision process**:
1. Code volume: Date timezone/locale handling >200 lines → proceed to evaluation
2. Check candidates:
   - moment.js: 2.8M/week downloads, BUT marked legacy, 67KB bundle, immutable
   - date-fns: 24M/week, actively maintained, tree-shakeable, 11KB for needed functions
   - Custom: Edge cases with leap years, timezones, DST make this error-prone

3. Evaluate date-fns:
   - `npm audit date-fns` → Clean
   - License: MIT → Compatible
   - Last commit: 2 weeks ago → Active
   - Transitive deps: 0 → Clean tree

**Decision**: Add date-fns with exact pin. Avoid moment.js (legacy), avoid custom (too many edge cases).

```json
{
  "dependencies": {
    "date-fns": "2.30.0"
  }
}
```

### Example 2: Resolving CVE with Override

**Scenario**: npm audit shows critical vulnerability in semver@5.7.0, but jest dependency chain requires exactly that version.

**Investigation**:
```bash
npm ls semver
# Shows: jest@27.0.0 → jest-config@27.0.0 → semver@5.7.0

npm audit --json | jq '.vulnerabilities.semver'
# CVE-2022-25883: ReDoS in semver parsing
```

**Fix strategy**:
```json
{
  "overrides": {
    "semver": ">=7.5.2"
  }
}
```

**Validation**:
```bash
npm audit  # Should be clean
npm test   # Verify jest still works with newer semver
```

**What novice misses**: Just ignoring the warning or trying `npm audit fix --force` which might break jest entirely.
**What expert catches**: Scoping the override specifically, testing that the version bump doesn't break the consumer, documenting why override was needed.

### Example 3: Major Upgrade with Trade-offs

**Scenario**: Upgrading React 16 → 18 in production app. Dependency bot created PR.

**Analysis checklist**:
1. Breaking changes review: React 18 has new automatic batching, StrictMode changes, Suspense behavior
2. Dependencies impact: Check if all React ecosystem packages support React 18
3. Bundle size: React 18 is larger but has better performance characteristics
4. Timeline: Can this be done incrementally?

**Migration plan**:
```bash
# 1. Audit current React ecosystem
npm ls | grep react

# 2. Check each package's React 18 compatibility
npm info react-router peerDependencies
npm info @material-ui/core peerDependencies  # Might be incompatible

# 3. Plan migration path
# - Upgrade react first
# - Upgrade react-router next week  
# - Block on @material-ui (might need to migrate to @mui/material)
```

**What novice does**: Auto-merge the React upgrade PR without checking ecosystem compatibility.
**What expert does**: Maps the full dependency graph impact, plans staged rollout, identifies blocking incompatibilities before starting.

## Quality Gates

- [ ] npm audit returns 0 critical/high vulnerabilities in production dependencies
- [ ] All direct dependencies pinned to exact versions (no ^, ~, *, or ranges) in production apps
- [ ] Lockfile (package-lock.json/yarn.lock) committed and up-to-date
- [ ] License scan passes: no GPL dependencies in proprietary projects
- [ ] Transitive dependency count <100 (check with `npm ls --depth=0 | wc -l`)
- [ ] No peer dependency warnings in clean install (`npm ci 2>&1 | grep -i "peer"` returns empty)
- [ ] All dependencies >1k weekly downloads OR explicitly documented risk acceptance
- [ ] Security tooling configured: npm audit in CI, Renovate/Dependabot enabled
- [ ] SBOM can be generated without errors (`npx @cyclonedx/cyclonedx-npm`)
- [ ] Team has defined SLAs for vulnerability response by severity level

## NOT-FOR Boundaries

**This skill does NOT cover**:
- Internal monorepo package management (workspace dependencies, hoisting) → Use `monorepo-management`
- Publishing packages to npm/PyPI/crates.io → Use `package-publishing`
- Package manager configuration (registry setup, authentication) → Use `devops-automator`
- Vendoring dependencies or air-gapped environments → Specialized enterprise patterns beyond scope
- Docker base image dependency management → Use `container-security`
- Language-specific package managers beyond npm/pip basics → Consult ecosystem-specific skills

**Delegate when**:
- For Gradle/Maven complex dependency resolution → Use `java-ecosystem`
- For Go modules advanced patterns → Use `golang-development`
- For Rust cargo workspace management → Use `rust-development`
- For security assessment beyond dependency scanning → Use `security-auditor`