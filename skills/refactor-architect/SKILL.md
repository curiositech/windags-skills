---
license: Apache-2.0
name: refactor-architect
description: |
  Plans large-scale refactoring campaigns across codebases. Analyzes dependency graphs, calculates
  blast radius, designs migration strategies, and creates incremental plans that keep the system
  deployable at every step. The strategist to the refactoring-surgeon's operator.
category: Code Quality & Testing
tags:
  - refactoring
  - architecture
  - migration
  - planning
  - dependency-analysis
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: refactoring-surgeon
    reason: Architect plans, surgeon executes individual refactoring steps
  - skill: code-architecture
    reason: Understands the target architecture being refactored toward
  - skill: dependency-management
    reason: Dependency graph analysis is foundational to safe refactoring order
  - skill: test-automation-expert
    reason: Tests are the safety net that makes incremental refactoring possible
  - skill: monorepo-management
    reason: Cross-package refactoring in monorepos requires package-aware planning
---

# Refactor Architect

Plans and coordinates large-scale refactoring campaigns. Analyzes dependency graphs to determine
safe execution order, designs migration strategies that keep the system deployable at every step,
calculates blast radius of proposed changes, and creates incremental plans that multiple developers
or agents can execute in parallel.

## Activation Triggers

**Use this skill when:**
- A refactoring affects more than 5 files or crosses package/module boundaries
- You need to rename a widely-used interface, type, or function
- A database schema migration requires coordinated application code changes
- You are migrating from one API version to another across consumers
- A type system upgrade (e.g., stricter TypeScript config) will break many files
- You need to split a monolith module into separate packages
- You are planning a codebase-wide pattern migration (e.g., class components to hooks)
- The refactoring must be done incrementally because the system cannot go offline

**Do NOT use this skill for:**
- Refactoring a single file or function (use refactoring-surgeon)
- Planning new architecture from scratch (use code-architecture)
- Database-only migrations with no application code impact (use database-migration-manager)
- Dependency version upgrades with no API changes (use dependency-management)

## Core Capabilities

### 1. Dependency Graph Analysis

Before touching anything, map what depends on what.

```typescript
// dependency-analysis.ts — Extract import graph for blast radius calculation
import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import path from 'node:path';

interface DepGraph {
  /** file -> files it imports */
  imports: Map<string, Set<string>>;
  /** file -> files that import it */
  importedBy: Map<string, Set<string>>;
}

function buildDepGraph(rootDir: string, pattern = '**/*.{ts,tsx}'): DepGraph {
  const files = globSync(pattern, { cwd: rootDir, absolute: true });
  const imports = new Map<string, Set<string>>();
  const importedBy = new Map<string, Set<string>>();

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const deps = new Set<string>();

    try {
      const ast = parse(source, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      traverse(ast, {
        ImportDeclaration({ node }) {
          const resolved = resolveImport(node.source.value, file, rootDir);
          if (resolved) deps.add(resolved);
        },
        CallExpression({ node }) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
            const arg = node.arguments[0];
            if (arg?.type === 'StringLiteral') {
              const resolved = resolveImport(arg.value, file, rootDir);
              if (resolved) deps.add(resolved);
            }
          }
        },
      });
    } catch {
      // Parse errors are noted but don't block analysis
    }

    imports.set(file, deps);
    for (const dep of deps) {
      if (!importedBy.has(dep)) importedBy.set(dep, new Set());
      importedBy.get(dep)!.add(file);
    }
  }

  return { imports, importedBy };
}

function resolveImport(specifier: string, fromFile: string, rootDir: string): string | null {
  if (specifier.startsWith('.')) {
    const dir = path.dirname(fromFile);
    // Try common extensions
    for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']) {
      const candidate = path.resolve(dir, specifier + ext);
      try { readFileSync(candidate); return candidate; } catch { /* try next */ }
    }
  }
  return null; // External package, not in our graph
}
```

### 2. Blast Radius Calculation

Given a set of files you intend to change, determine everything downstream:

```typescript
function calculateBlastRadius(graph: DepGraph, changedFiles: string[]): BlastRadius {
  const directlyAffected = new Set<string>();
  const transitivelyAffected = new Set<string>();
  const queue = [...changedFiles];
  const visited = new Set<string>();

  // BFS through importedBy graph
  while (queue.length > 0) {
    const file = queue.shift()!;
    if (visited.has(file)) continue;
    visited.add(file);

    const dependents = graph.importedBy.get(file) || new Set();
    for (const dep of dependents) {
      if (changedFiles.includes(file)) {
        directlyAffected.add(dep);
      } else {
        transitivelyAffected.add(dep);
      }
      queue.push(dep);
    }
  }

  return {
    changedFiles,
    directlyAffected: [...directlyAffected],
    transitivelyAffected: [...transitivelyAffected],
    totalAffected: visited.size - changedFiles.length,
    riskLevel: categorizeRisk(visited.size),
  };
}

interface BlastRadius {
  changedFiles: string[];
  directlyAffected: string[];
  transitivelyAffected: string[];
  totalAffected: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

function categorizeRisk(affectedCount: number): BlastRadius['riskLevel'] {
  if (affectedCount <= 5) return 'low';
  if (affectedCount <= 20) return 'medium';
  if (affectedCount <= 50) return 'high';
  return 'critical';
}
```

**Blast radius report format:**

```
=== Blast Radius Report ===
Target: Rename UserService.getUser() -> UserService.findUser()

Changed files (1):
  src/services/user-service.ts

Directly affected (8):
  src/routes/user-routes.ts
  src/routes/admin-routes.ts
  src/middleware/auth.ts
  src/controllers/user-controller.ts
  src/controllers/admin-controller.ts
  src/jobs/user-sync.ts
  src/jobs/cleanup.ts
  tests/services/user-service.test.ts

Transitively affected (12):
  src/routes/index.ts
  src/app.ts
  tests/routes/user-routes.test.ts
  tests/routes/admin-routes.test.ts
  ...

Risk level: HIGH (21 files affected)

Recommendation: Split into 3 PRs over 2 days.
  PR 1: Add findUser() as alias, deprecate getUser() [0 breakage]
  PR 2: Migrate all callers to findUser() [0 breakage]
  PR 3: Remove getUser() [0 breakage if PR 2 is complete]
```

### 3. Safe Refactoring Order

Topological sort of the dependency graph gives you the order in which files can be
safely modified without breaking intermediate states:

```typescript
function computeSafeRefactoringOrder(
  graph: DepGraph,
  affectedFiles: string[]
): RefactoringWave[] {
  // Build sub-graph of only affected files
  const inDegree = new Map<string, number>();
  const subEdges = new Map<string, Set<string>>();

  for (const file of affectedFiles) {
    inDegree.set(file, 0);
    subEdges.set(file, new Set());
  }

  for (const file of affectedFiles) {
    const deps = graph.imports.get(file) || new Set();
    for (const dep of deps) {
      if (affectedFiles.includes(dep)) {
        subEdges.get(dep)!.add(file);
        inDegree.set(file, (inDegree.get(file) || 0) + 1);
      }
    }
  }

  // Kahn's algorithm — group into waves (same as DAG wave computation)
  const waves: RefactoringWave[] = [];
  let remaining = new Set(affectedFiles);

  while (remaining.size > 0) {
    const wave = [...remaining].filter(f => (inDegree.get(f) || 0) === 0);
    if (wave.length === 0) {
      // Cycle detected — these files have circular dependencies
      waves.push({ files: [...remaining], parallel: false, note: 'CIRCULAR — manual ordering required' });
      break;
    }

    waves.push({ files: wave, parallel: true, note: `Wave ${waves.length + 1}: safe to modify in parallel` });

    for (const file of wave) {
      remaining.delete(file);
      for (const dependent of subEdges.get(file) || []) {
        inDegree.set(dependent, (inDegree.get(dependent) || 0) - 1);
      }
    }
  }

  return waves;
}

interface RefactoringWave {
  files: string[];
  parallel: boolean;
  note: string;
}
```

**Output example:**

```
=== Refactoring Order (4 waves) ===

Wave 1 (parallel-safe):
  src/types/user.ts           — Change the type definition first
  src/types/admin.ts          — Also independent

Wave 2 (parallel-safe):
  src/services/user-service.ts  — Update service (depends on types)
  src/services/admin-service.ts — Update service (depends on types)

Wave 3 (parallel-safe):
  src/controllers/user-controller.ts   — Update consumers of services
  src/controllers/admin-controller.ts
  src/middleware/auth.ts
  src/jobs/user-sync.ts

Wave 4 (parallel-safe):
  src/routes/user-routes.ts    — Update route wiring (depends on controllers)
  src/routes/admin-routes.ts
  tests/**/*.test.ts           — Update tests last (they verify the new state)
```

### 4. Migration Strategy Patterns

#### Pattern A: Expand-Contract (Parallel Change)

The safest pattern for API changes. Three phases, each independently deployable:

```
Phase 1: EXPAND — Add the new alongside the old
  - New method/field/endpoint exists
  - Old method/field/endpoint still works
  - All tests pass, nothing breaks

Phase 2: MIGRATE — Move consumers to the new
  - Update all callers one by one
  - Each caller migration is a separate commit
  - Old method/field/endpoint still works (for safety)

Phase 3: CONTRACT — Remove the old
  - Delete deprecated method/field/endpoint
  - Remove any shim/adapter code
  - Final cleanup
```

#### Pattern B: Strangler Fig (Module Replacement)

For replacing an entire module or subsystem:

```
1. Identify the boundary (imports into and out of the module)
2. Create the new module with the same public interface
3. Route traffic/calls through a facade that delegates:
   - Initially 100% to old module
   - Gradually shift to new module (feature flag or config)
   - Monitor for errors at each percentage
4. When new module handles 100%, remove old module and facade
```

#### Pattern C: Branch by Abstraction

For replacing a dependency that is deeply woven into the codebase:

```
1. Create an abstraction layer (interface) in front of the old dependency
2. Make all existing code use the abstraction instead of the dependency directly
3. Create a second implementation of the abstraction using the new dependency
4. Switch the implementation (DI container, factory, config flag)
5. Remove the old implementation and the abstraction (if only one impl remains)
```

#### Pattern D: Database Schema Evolution

For schema changes that require coordinated app changes:

```
Step 1: Deploy app that WRITES to both old and new schema
Step 2: Backfill — migrate existing data to new schema
Step 3: Deploy app that READS from new schema
Step 4: Deploy app that stops WRITING to old schema
Step 5: Drop old columns/tables

NEVER: Change schema and app code in the same deployment.
```

### 5. Multi-Agent Refactoring Plans

When the refactoring is large enough to parallelize across agents or developers:

```yaml
# refactoring-plan.yaml
campaign: rename-getUser-to-findUser
strategy: expand-contract
estimated_waves: 4
estimated_duration: 2 days

phases:
  - name: expand
    description: Add findUser() as an alias for getUser()
    files:
      - src/services/user-service.ts
    verification: npm test
    pr_title: "refactor: add findUser() alias (expand phase)"

  - name: migrate-wave-1
    description: Migrate controllers and middleware
    parallel: true
    files:
      - src/controllers/user-controller.ts
      - src/controllers/admin-controller.ts
      - src/middleware/auth.ts
    verification: npm test
    depends_on: expand
    pr_title: "refactor: migrate controllers to findUser()"

  - name: migrate-wave-2
    description: Migrate background jobs and tests
    parallel: true
    files:
      - src/jobs/user-sync.ts
      - src/jobs/cleanup.ts
      - tests/services/user-service.test.ts
      - tests/controllers/*.test.ts
    verification: npm test
    depends_on: migrate-wave-1
    pr_title: "refactor: migrate jobs and tests to findUser()"

  - name: contract
    description: Remove deprecated getUser()
    files:
      - src/services/user-service.ts
    verification: |
      npm test
      grep -r "getUser" src/ --include="*.ts" && exit 1 || exit 0
    depends_on: migrate-wave-2
    pr_title: "refactor: remove deprecated getUser()"
```

### 6. Import Graph Rewiring

When reorganizing modules (moving files, splitting packages), the import graph must be
systematically updated. Approach:

```bash
# 1. Find all imports of the file being moved
grep -rn "from ['\"].*old-path" src/ --include="*.ts" --include="*.tsx"

# 2. Generate a sed script for the rename
find src -name '*.ts' -o -name '*.tsx' | xargs sed -i '' \
  "s|from ['\"]\.\.\/services\/user-service['\"]|from '../services/identity/user-service'|g"

# 3. Verify no broken imports
npx tsc --noEmit 2>&1 | grep "Cannot find module" || echo "All imports resolved"

# 4. Verify no circular dependencies introduced
npx madge --circular src/
```

**Automated verification after each wave:**
1. `tsc --noEmit` -- type checker confirms all imports resolve
2. `npx madge --circular src/` -- no new circular dependencies
3. `npm test` -- behavior is unchanged
4. `git diff --stat` -- confirms only expected files changed

## Decision Points

### When to use Expand-Contract vs. Big Bang

| Factor | Expand-Contract | Big Bang |
|--------|----------------|----------|
| Change scope | > 10 files | < 5 files, all in one module |
| Deployment risk | Low (each phase is safe) | High (all or nothing) |
| Team coordination | Multiple developers/agents | Single developer |
| Rollback cost | Trivial (revert one phase) | Painful (revert everything) |
| Duration | Days to weeks | Hours |
| When to use | Production systems, shared APIs | Internal tools, early-stage code |

### When to split into multiple PRs

- **Always split** if the total diff exceeds 500 lines
- **Always split** if changes cross package boundaries in a monorepo
- **Always split** if different parts of the change have different risk levels
- **OK to merge** if the entire change is under 200 lines and touches one module

### How to handle circular dependencies during refactoring

1. Identify the cycle: `npx madge --circular src/`
2. Determine which edge in the cycle is the "wrong" direction
3. Extract the shared dependency into its own module (break the cycle)
4. Update imports on both sides
5. Verify: `npx madge --circular src/` should show one fewer cycle

## Anti-Patterns

### 1. Planning without a dependency graph
**Symptom**: "Let's just rename this interface everywhere" without knowing what "everywhere" means
**Why wrong**: You will miss transitive consumers, break CI for other teams, and spend days debugging
**Fix**: Build or generate the dependency graph first. Every refactoring plan starts with blast radius.

### 2. Monolithic refactoring PRs
**Symptom**: A 3000-line PR titled "refactor: modernize user module"
**Why wrong**: Unreviewable, unrevertable, blocks the main branch for days
**Fix**: Split by wave. Each wave is a PR. Each PR is reviewable in 15 minutes.

### 3. Skipping the expand phase
**Symptom**: Renaming a function and updating all callers in one commit
**Why wrong**: If any caller was missed (dynamic imports, config files, scripts), the deploy breaks
**Fix**: Always add the new name alongside the old, migrate callers, then remove the old name.

### 4. Refactoring without a verification step per wave
**Symptom**: "We'll run tests after the whole refactoring is done"
**Why wrong**: When tests fail, you don't know which wave introduced the failure
**Fix**: `npm test` after every wave. If tests fail, fix before moving to the next wave.

### 5. Changing interfaces and implementations simultaneously
**Symptom**: Modifying a service's public API and its internal logic in the same PR
**Why wrong**: If a bug appears, you can't tell if it's from the API change or the logic change
**Fix**: Separate PRs. First change the interface shape (with the old behavior). Then change the behavior.

### 6. Ignoring downstream consumers outside the repo
**Symptom**: Renaming an API endpoint without checking who calls it
**Fix**: Check API access logs, search for the endpoint in other repositories, notify consumers before the contract phase.

### 7. Planning the entire campaign upfront with no feedback loops
**Symptom**: A 50-page refactoring document that becomes stale after the first wave
**Fix**: Plan 2-3 waves ahead. After each wave, reassess. The dependency graph may change as you refactor.

## Quality Checklist

- [ ] Dependency graph is built and blast radius is calculated before any code changes
- [ ] Risk level is categorized (low/medium/high/critical) and communicated to stakeholders
- [ ] Migration strategy is chosen (expand-contract, strangler fig, branch by abstraction) and documented
- [ ] Refactoring is broken into waves, each independently deployable
- [ ] Each wave has a verification step (tests, type check, circular dependency check)
- [ ] No wave introduces circular dependencies
- [ ] Each wave's PR is under 500 lines of diff
- [ ] The system is deployable and functional after every wave (no intermediate broken states)
- [ ] Downstream consumers outside the repo are identified and notified
- [ ] Rollback plan exists for each phase (usually: revert the PR)
- [ ] The refactoring plan is a living document, updated after each wave
- [ ] All renamed/moved symbols have their old names available during the migration period
- [ ] Automated tooling (sed, codemod, IDE refactor) is preferred over manual find-replace
- [ ] Test coverage for affected areas is verified before starting (add tests if gaps exist)
