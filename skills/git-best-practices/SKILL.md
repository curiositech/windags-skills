---
license: Apache-2.0
name: git-best-practices
description: 'Expert in Git workflows, conventions, and patterns for modern development teams and AI agents. Activate on: branching strategy, commit conventions, git hooks, pre-commit, husky, lint-staged, trunk-based development, git worktree, monorepo git, PR review workflow, conventional commits, git workflow. NOT for: CI/CD pipelines (use github-actions-pipeline-builder), repository hosting (use devops-automator), multi-agent orchestration (use multi-agent-coordination).'
allowed-tools: Read,Write,Edit,Bash(git:*,npm:*,npx:*,husky:*),Glob,Grep,WebSearch,WebFetch
metadata:
  category: Development Workflow
  tags:
    - git
    - version-control
    - branching
    - conventional-commits
    - git-hooks
    - worktrees
    - monorepo
  pairs-with:
    - skill: multi-agent-coordination
      reason: Git worktrees are the isolation primitive for parallel agents
    - skill: monorepo-management
      reason: Monorepo-specific git patterns (sparse checkout, path-scoped hooks)
    - skill: github-actions-pipeline-builder
      reason: Git hooks feed into CI; branching strategy shapes pipeline design
category: DevOps & Infrastructure
tags:
  - git
  - best-practices
  - branching
  - commits
  - workflow
---

# Git Best Practices

Expert in the specific Git workflows, conventions, and patterns that make development teams — and solo developers working with AI coding agents — productive. Not "how to use git" but "how to use git well."

## Activation Triggers

**Activate on:** "branching strategy", "commit conventions", "git hooks", "pre-commit", "husky", "lint-staged", "trunk-based development", "git worktree", "monorepo git", "PR review workflow", "conventional commits", "git workflow", "merge strategy", "rebase vs merge", "git conflict resolution"

**NOT for:** CI/CD pipelines -> `github-actions-pipeline-builder` | Repo hosting -> `devops-automator` | Multi-agent orchestration -> `multi-agent-coordination`

## Branching Strategy Decision Matrix

| Strategy | Team Size | Release Cadence | Complexity | Best For |
|----------|-----------|-----------------|------------|----------|
| **Trunk-Based** | Any | Continuous | Low | SaaS, microservices, AI agents |
| **GitHub Flow** | 2-20 | Daily/weekly | Low | Most teams, open source |
| **GitFlow** | 10+ | Scheduled releases | High | Mobile apps, versioned libraries |
| **Ship/Show/Ask** | Any | Continuous | Medium | High-trust teams |

### Trunk-Based Development (Recommended Default)

```
main ──●──●──●──●──●──●──●──●──●── (always deployable)
        \   /  \     /  \       /
         ●─●    ●──●    ●──●──●
        (hours)  (1 day) (2 days max)
```

**Rules:**
1. `main` is always deployable. Period.
2. Feature branches live max 2 days. Shorter is better.
3. Feature flags gate incomplete work, not long-lived branches.
4. Every merge to `main` triggers CI. Green means deployable.
5. No release branches unless you ship packaged software.

**When NOT to use trunk-based:**
- Mobile apps with app store review cycles
- Libraries with semantic versioning and support branches
- Teams without CI/CD automation

### GitHub Flow

```
main ──●──────●──────●──────●──── (protected, PR-only merges)
        \    / \    / \    /
         ●──●   ●──●   ●──●
        feature  fix   feature
```

**Rules:**
1. `main` is protected. No direct pushes.
2. Create branch from `main`, do work, open PR.
3. PR gets reviewed, CI passes, squash-merge to `main`.
4. Delete branch after merge.

### Ship / Show / Ask Framework

| Category | Action | When |
|----------|--------|------|
| **Ship** | Merge directly to main | Typos, config, deps, obvious fixes |
| **Show** | Open PR, merge immediately, review async | Straightforward changes, established patterns |
| **Ask** | Open PR, wait for review | New architecture, risky changes, unfamiliar code |

## Conventional Commits

### The Specification

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When | Bumps |
|------|------|-------|
| `feat` | New user-facing feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | - |
| `style` | Formatting, whitespace (not CSS) | - |
| `refactor` | Code change that neither fixes nor adds | - |
| `perf` | Performance improvement | - |
| `test` | Adding/fixing tests | - |
| `build` | Build system, dependencies | - |
| `ci` | CI/CD changes | - |
| `chore` | Maintenance, tooling | - |
| `revert` | Reverts a previous commit | - |

### Breaking Changes

```
feat(auth)!: replace API key with OAuth2

BREAKING CHANGE: The `apiKey` parameter in `createClient()` has been
removed. Use `oauth: { clientId, clientSecret }` instead.

Migration: npx @your-tool/codemod v2-to-v3
```

The `!` after the type/scope and `BREAKING CHANGE:` footer both signal a MAJOR version bump.

### Good vs Bad Commit Messages

```
# BAD - what, not why
fix: update code
feat: add stuff
chore: changes

# GOOD - why, with context
fix(auth): prevent token refresh race condition on slow networks
feat(search): add fuzzy matching for skill names with Levenshtein distance
chore(deps): bump vitest to 3.1 for Node 22 compatibility
```

### Enforcing with commitlint

```bash
# Install
npm install -D @commitlint/cli @commitlint/config-conventional

# Configure
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Hook into Husky
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

## Git Hooks: Husky + lint-staged

### Setup (Modern Husky v9+)

```bash
# Install
npm install -D husky lint-staged

# Initialize husky
npx husky init

# The init command creates .husky/ and adds a prepare script
# Edit .husky/pre-commit:
echo "npx lint-staged" > .husky/pre-commit
```

### lint-staged Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ],
    "*.test.{ts,tsx}": [
      "vitest related --run"
    ]
  }
}
```

### Monorepo Hook Configuration

Install Husky at root, scope lint-staged by package path: `"packages/core/**/*.ts": "pnpm --filter @your-org/core lint"`. Each package gets its own lint command, preventing cross-package leak.

### Hook Performance Guidelines

| Hook | Max Time | What to Run |
|------|----------|-------------|
| `pre-commit` | <5 seconds | Lint + format staged files only |
| `commit-msg` | <1 second | commitlint validation |
| `pre-push` | <30 seconds | Type check + fast test suite |

If hooks are slow, developers skip them with `--no-verify`. Keep them fast.

### Essential Hook Set

```bash
# .husky/pre-commit — fast, staged files only
npx lint-staged

# .husky/commit-msg — validate message format
npx --no -- commitlint --edit $1

# .husky/pre-push — more thorough checks
pnpm typecheck && pnpm test --run
```

## Git Worktrees for AI Agent Isolation

Worktrees let you check out multiple branches simultaneously in separate directories, sharing the same `.git` history. This is the primary isolation primitive for parallel AI agents.

### Basic Worktree Workflow

```bash
# Create a worktree for a feature
git worktree add ../myproject-feature-auth feature/auth

# List active worktrees
git worktree list

# Work in the worktree (it's a normal directory)
cd ../myproject-feature-auth
# ... make changes, commit, push ...

# Remove when done
git worktree remove ../myproject-feature-auth
```

### AI Agent Worktree Pattern

```bash
# Agent 1: Working on auth
git worktree add ../project-agent-auth -b agent/auth-refactor

# Agent 2: Working on API (parallel, isolated)
git worktree add ../project-agent-api -b agent/api-endpoints

# Agent 3: Working on tests (parallel, isolated)
git worktree add ../project-agent-tests -b agent/test-coverage

# Each agent has full filesystem isolation
# Commits in any worktree are visible to all (shared .git)

# When agents finish, merge results
git merge agent/auth-refactor
git merge agent/api-endpoints
git merge agent/test-coverage

# Clean up
git worktree remove ../project-agent-auth
git worktree remove ../project-agent-api
git worktree remove ../project-agent-tests
```

### Worktree Gotchas

| Problem | Solution |
|---------|----------|
| **Port conflicts** | Each worktree needs unique dev server ports (use env vars or port-daddy) |
| **Shared node_modules** | Run `npm install` in each worktree (separate node_modules per worktree) |
| **Database conflicts** | Use per-worktree database names or Docker containers |
| **Same branch twice** | Git prevents this — you cannot check out a branch that's checked out elsewhere |
| **IDE confusion** | Open each worktree as a separate workspace/window |
| **Stale worktrees** | Run `git worktree prune` periodically to clean up |

### Worktree Naming Convention

```
../project-<purpose>-<branch-slug>

# Examples:
../windags-agent-auth-refactor
../windags-agent-api-endpoints
../windags-review-pr-142
../windags-experiment-new-executor
```

## PR Review Workflow

### PR Size Guidelines

| Size | Lines Changed | Review Time | Recommendation |
|------|---------------|-------------|----------------|
| **XS** | 1-10 | Minutes | Ship or Show |
| **S** | 10-100 | 15 min | Standard review |
| **M** | 100-400 | 30 min | Standard review |
| **L** | 400-1000 | 1 hour | Break it up if possible |
| **XL** | 1000+ | Hours | Almost always should be split |

### PR Template Sections

Every PR template should include: **What** (1-2 sentences, what and why) -> **How** (technical approach) -> **Testing** (steps + checkboxes) -> **Screenshots** (before/after for UI) -> **Breaking Changes** (none or migration path). Save as `.github/pull_request_template.md`.

### Reviewer Checklist

Understand what/why, tests cover happy + edge path, no TODO without issue link, error handling present, no secrets in diff, breaking changes documented.

## Merge Strategy

| Strategy | When | Command |
|----------|------|---------|
| **Squash merge** (default) | Feature branches, messy commits | `git merge --squash feature/auth` then single conventional commit |
| **Rebase + FF merge** | Linear history, each commit meaningful | `git rebase main` then `git merge feature/auth` |
| **Merge commit** | Long-running integration branches (rare) | `git merge feature/auth` |

**Decision**: Are all commits on the branch meaningful and tested? Yes -> rebase. No -> squash.

## Monorepo Git Patterns

### Sparse Checkout (Work on One Package)

```bash
# Clone with sparse checkout
git clone --sparse --filter=blob:none https://github.com/org/monorepo.git
cd monorepo

# Check out only what you need
git sparse-checkout set packages/core packages/shared
```

### Path-Scoped Git Operations

```bash
# Log for one package
git log --oneline -- packages/core/

# Diff for one package
git diff main -- packages/ui/

# Blame within scope
git log --all --oneline -- packages/cli/src/index.ts
```

### CODEOWNERS for Monorepos

```
# .github/CODEOWNERS
packages/core/       @org/core-team
packages/ui/         @org/frontend-team
packages/cli/        @org/dx-team
docs/                @org/docs-team
.github/             @org/platform-team
```

## Git Configuration Essentials

Key settings every team should configure:

```ini
[pull]   rebase = true           # Rebase on pull instead of merge
[push]   autoSetupRemote = true  # Auto set upstream on first push
[merge]  conflictstyle = zdiff3  # Better conflict markers with common ancestor
[diff]   algorithm = histogram   # Better diff output
[rerere] enabled = true          # Remember conflict resolutions
[fetch]  prune = true            # Auto-delete stale remote branches
```

**.gitignore essentials**: `node_modules/`, `.env*`, `dist/`, `.turbo/`, `.DS_Store`, `coverage/`. Always commit lock files (`pnpm-lock.yaml`). Use `gitignore.io` for stack-specific templates. Set up `~/.gitignore_global` for per-developer ignores.

## Anti-Patterns

### 1. Long-Lived Feature Branches
**Symptom**: Branch diverges from main for weeks. Merge becomes a nightmare.
**Fix**: Trunk-based development. Feature flags for incomplete work. Branch lives max 2 days.

### 2. "WIP" Commit Messages
**Symptom**: `git log` shows "wip", "stuff", "fix", "asdf".
**Fix**: Squash merge into a single conventional commit. Or use `git rebase -i` to clean up before PR.

### 3. Skipping Hooks with --no-verify
**Symptom**: Developers routinely bypass pre-commit hooks.
**Fix**: Hooks are too slow. Make them faster (lint-staged, not full project). Or move slow checks to pre-push.

### 4. Force Pushing to Shared Branches
**Symptom**: `git push --force` to `main` or shared feature branches.
**Fix**: Protect `main` in GitHub/GitLab settings. Use `--force-with-lease` if you must force push to your own branch.

### 5. Committing Generated Files
**Symptom**: `dist/`, `node_modules/`, `*.lock` diffs pollute PRs.
**Fix**: Add to `.gitignore`. Only commit lock files (`package-lock.json`, `pnpm-lock.yaml`) — those belong in version control.

### 6. Secrets in Git History
**Symptom**: API keys, passwords committed and "removed" in a later commit. They're still in history.
**Fix**: Use `git-filter-repo` to rewrite history. Rotate the exposed credentials immediately. Add `.env` to `.gitignore` before first commit.

### 7. No Branch Protection
**Symptom**: Anyone can push directly to `main`. No required reviews. No CI gate.
**Fix**: Enable branch protection: require PR, require 1+ review, require CI green, require up-to-date branch.

### 8. Rebasing Public/Shared Branches
**Symptom**: Rebasing a branch that others have pulled causes history divergence.
**Fix**: Only rebase your own local branches. Once pushed and shared, merge only.

## Quality Checklist

```
[ ] Branching strategy documented and agreed upon by team
[ ] Conventional commit format enforced via commitlint + husky
[ ] Pre-commit hooks run lint + format on staged files only (< 5 seconds)
[ ] Pre-push hooks run typecheck + tests
[ ] Branch protection enabled on main (PR required, CI green, review required)
[ ] .gitignore covers dependencies, build output, env files, OS files
[ ] PR template exists with what/how/testing/breaking sections
[ ] Merge strategy chosen and configured (squash recommended)
[ ] CODEOWNERS file maps directories to responsible teams
[ ] git config includes rebase-on-pull, prune-on-fetch, zdiff3 conflicts
[ ] Worktree conventions documented for AI agent workflows
[ ] No secrets in git history (scanned with trufflehog or gitleaks)
[ ] Lock files (pnpm-lock.yaml) committed, generated output is not
```

## Output Artifacts

1. **Git Configuration** — `.gitconfig` recommendations, branch protection rules
2. **Hook Setup** — Husky + lint-staged + commitlint configuration
3. **PR Template** — `.github/pull_request_template.md`
4. **CODEOWNERS** — Directory-to-team ownership mapping
5. **.gitignore** — Comprehensive ignore rules for the stack
6. **Branching Strategy Doc** — Team-agreed workflow documentation
7. **Worktree Scripts** — Helper scripts for creating/cleaning agent worktrees
