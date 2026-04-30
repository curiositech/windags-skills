---
name: pnpm Workspace Monorepo
description: 'Use when configuring a pnpm-workspaces monorepo, debugging hoisting/peer-dep resolution, adopting the catalog protocol, integrating with Turborepo or Nx, fixing "cannot find module" issues that only happen in CI, or migrating from npm/yarn workspaces. Triggers: pnpm-workspace.yaml setup, packageExtensions for broken peer deps, .npmrc tuning (public-hoist-pattern, shamefully-hoist), workspace protocol (workspace:*), filtering with --filter, version mismatches across packages, "Cannot find module \"foo\"" only after lockfile update, ESM/CJS interop in workspace packages. NOT for npm/yarn-specific workspace bugs, monorepos using Bazel/Lerna/Rush, or single-package projects.'
category: DevOps & Infrastructure
tags:
  - pnpm
  - monorepo
  - workspaces
  - turbo
  - dependencies
  - typescript
---

# pnpm Workspace Monorepo

pnpm's strict resolution catches dependency mistakes that npm and yarn silently allow. That's its biggest feature and its biggest source of confusion. Most "weird CI failure" stories in pnpm monorepos boil down to a missing peer-dep declaration that npm-style hoisting was hiding.

## When to use

- Standing up a new monorepo or migrating from npm/yarn workspaces.
- A package builds locally but fails CI with "cannot find module".
- Bumping a version and watching half the workspace break.
- Centralizing common dep versions (catalog protocol).
- Wiring Turborepo / Nx for caching.
- Debugging peer-dependency warnings that look harmless but break runtime.

## Core capabilities

### Workspace layout

```
repo/
├── pnpm-workspace.yaml
├── package.json                    # workspace root, no app deps
├── packages/
│   ├── core/                       # @myorg/core
│   ├── ui/                         # @myorg/ui
│   └── tsconfig/                   # @myorg/tsconfig (shared base)
└── apps/
    ├── api/                        # @myorg/api
    └── marketing/                  # @myorg/marketing
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'

# Catalog protocol — pinned versions referenced by name.
catalog:
  react: ^19.0.0
  typescript: 5.7.2
  zod: ^3.25.0

# Multiple named catalogs for divergent stacks.
catalogs:
  legacy:
    react: ^18.2.0
```

In each package:

```json
{
  "name": "@myorg/ui",
  "dependencies": {
    "@myorg/core": "workspace:*",
    "react": "catalog:",
    "zod": "catalog:"
  },
  "devDependencies": {
    "@myorg/tsconfig": "workspace:*",
    "typescript": "catalog:"
  }
}
```

`workspace:*` resolves to the local package on install and to a real version range when published. `catalog:` resolves to whatever the workspace catalog pins. One source of truth, no version drift.

### Filtering

```bash
# Run a script in one package.
pnpm --filter @myorg/api dev

# In a package and everything that depends on it.
pnpm --filter @myorg/core... build

# In a package and everything it depends on.
pnpm --filter ...@myorg/api build

# Changes since main.
pnpm --filter "...[origin/main]" test

# Multiple filters.
pnpm --filter "@myorg/api" --filter "@myorg/marketing" build
```

The dot ellipses are dependency direction: `pkg...` includes downstream consumers; `...pkg` includes upstream deps.

### `.npmrc` knobs that matter

```ini
# Strict by default — pnpm doesn't hoist. Tools that assume hoisting break.
# Allow specific things to hoist when a tool needs them at the root.
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=@types/*

# When a dep doesn't declare a peer correctly and patching upstream isn't viable.
auto-install-peers=true

# Catalog mode: 'strict' fails the install if a workspace package uses a non-catalog version.
# Encourage the catalog without forcing it during migration.
manage-package-manager-versions=true

# Avoid lifecycle scripts running in CI for postinstalled deps you don't trust.
side-effects-cache-readonly=true
```

`shamefully-hoist=true` is a last resort. It defeats pnpm's strictness and reintroduces npm-style implicit deps.

### `packageExtensions` — fix broken peer deps without forking

```yaml
# pnpm-workspace.yaml
packageExtensions:
  some-broken-pkg@*:
    peerDependencies:
      react: '*'
  other-pkg@<2:
    dependencies:
      buffer: ^6.0.0
```

This is a non-disruptive way to patch `package.json` for installed deps. Write the issue link as a comment so future-you knows to remove it after upstream fixes.

### Turborepo wiring

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`^build` means "build all upstream deps first." Outputs declare what to cache. Persistent: dev servers shouldn't cache.

```bash
# Run build, cached by content hash of inputs.
turbo build

# Run only the affected packages since main.
turbo build --filter "...[origin/main]"
```

### TypeScript project references in a workspace

```json
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "composite": true
  }
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "@myorg/tsconfig/base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "references": [{ "path": "../core" }]
}
```

`tsc -b` builds packages in dependency order with incremental caches. Each package gets a `tsconfig.tsbuildinfo` next to its outputs.

### CI install pattern

```yaml
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'

- name: Install
  run: pnpm install --frozen-lockfile

- name: Build
  run: pnpm turbo build --filter "...[origin/main]"

- name: Test
  run: pnpm turbo test --filter "...[origin/main]"
```

`--frozen-lockfile` fails CI if `pnpm-lock.yaml` would change. Always use it in CI.

## Anti-patterns

### Implicit transitive dep

**Symptom:** App imports `lodash` (which it doesn't declare) but the build works locally because some other dep transitively pulled it in.
**Diagnosis:** pnpm's strict resolution hides transitive deps from your code; this works on npm. Until pnpm.
**Fix:** Declare every dep you import. `pnpm why lodash` shows who's actually pulling it in.

### `workspace:*` accidentally published

**Symptom:** Consumer of a published package gets `workspace:*` in node_modules and chokes.
**Diagnosis:** Forgot to convert `workspace:*` → real semver on publish.
**Fix:** Use `pnpm publish` (handles the rewrite) or `pnpm pack` to inspect first. Never run `npm publish` directly in a pnpm monorepo.

### `shamefully-hoist=true` to "fix" a missing peer

**Symptom:** App works locally with shamefully-hoist; CI fails when hoisting differs.
**Diagnosis:** Hiding a real bug under hoisting. Some tool needs a peer that's not declared.
**Fix:** Find the missing peer, add it to the package's `peerDependencies` or use `packageExtensions`. Remove `shamefully-hoist`.

### Turbo cache invalidating on every commit

**Symptom:** No turbo cache hits despite config looking right.
**Diagnosis:** `inputs` not declared — turbo defaults to "everything in the package," so an unrelated file change busts the cache.
**Fix:** Set `inputs` per task: `["src/**/*.{ts,tsx}", "package.json", "tsconfig.json"]`.

### Catalog drift via direct edits

**Symptom:** Half the workspace is on `react@^19`, half on `^18`.
**Diagnosis:** Someone bumped react in one package's `package.json` instead of in the catalog.
**Fix:** Adopt `catalog:` for shared deps. Set `pnpm.overrides` for transitive single-version enforcement. Lint with `manage-package-manager-versions`.

### Lifecycle scripts running with secrets in env

**Symptom:** A postinstall in a transitive dep prints sensitive env vars (or worse).
**Diagnosis:** pnpm runs lifecycle scripts by default.
**Fix:** `pnpm install --ignore-scripts` for installs in CI sensitive paths; allowlist scripts via `pnpm.onlyBuiltDependencies`.

## Quality gates

- [ ] `pnpm-lock.yaml` committed; `--frozen-lockfile` enforced in CI.
- [ ] No `workspace:*` ranges in published artifacts.
- [ ] Shared dep versions live in the catalog (`catalog:` protocol).
- [ ] No `shamefully-hoist=true`; missing peers fixed via `packageExtensions` or proper declarations.
- [ ] Turbo task `inputs` declared so the cache reflects real dependencies.
- [ ] CI uses `--filter "...[origin/main]"` so only affected packages build.
- [ ] TypeScript project references mirror workspace dependency graph.
- [ ] Every package has `engines.node` matching the repo Node version.
- [ ] `pnpm.onlyBuiltDependencies` allowlist for postinstall scripts.

## NOT for

- **npm or yarn workspaces** — different resolution semantics.
- **Bazel / Lerna / Rush** — different orchestration models.
- **Single-package repos** — pnpm works fine, but workspace features don't apply.
- **Bun workspaces** — Bun's workspace support is similar but has its own quirks.
