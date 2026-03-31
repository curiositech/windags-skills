---
name: git-workflow-auditor
license: Apache-2.0
description: |
  Audits git repository hygiene: worktree state, stale branches, uncommitted changes,
  orphaned worktrees, and hook configuration. Finds the rot before it causes a crisis.
category: Code Quality & Testing
tags:
  - git
  - audit
  - worktree
  - branch-hygiene
  - cleanup
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: git-workflow-expert
    reason: Auditing finds problems; git-workflow-expert fixes them with proper strategy
  - skill: monorepo-management
    reason: Monorepos accumulate worktree and branch debt faster than single-repo projects
  - skill: multi-agent-coordination
    reason: Multi-agent workflows create worktrees that must be tracked and cleaned up
  - skill: dag-isolation-manager
    reason: DAG execution creates worktrees for isolation that need lifecycle management
---

# Git Workflow Auditor

Systematic audit of git repository state. Detects stale branches, orphaned worktrees, uncommitted work at risk of loss, hook misconfigurations, and branch hygiene violations. Designed for repositories where multiple developers or agents create branches and worktrees that nobody remembers to clean up.

## When to Use

**Use for:**
- Periodic repository health checks (weekly or before releases)
- Detecting stale worktrees left behind by crashed agent processes
- Finding branches with unmerged work that someone forgot about
- Auditing git hooks for completeness and correct configuration
- Identifying uncommitted changes across multiple worktrees
- Cleaning up after multi-agent DAG execution sessions
- Pre-migration audits before moving to a new branching strategy
- Diagnosing disk space issues caused by accumulated worktrees

**Do NOT use for:**
- Choosing a branching strategy (use `git-workflow-expert`)
- Setting up CI/CD pipelines (use `github-actions-pipeline-builder`)
- Resolving merge conflicts (use `git-workflow-expert`)
- Repository migration between hosting providers

---

## Core Capabilities

### 1. Worktree State Audit

Worktrees are the primary isolation mechanism for parallel agent execution. They accumulate silently. A crashed agent leaves its worktree behind. Ten crashed agents later, you have ten stale worktrees consuming disk and creating confusion.

```bash
# List all worktrees with their state
git worktree list --porcelain

# Parse into structured audit
git worktree list --porcelain | awk '
  /^worktree / { path=$2 }
  /^HEAD / { head=$2 }
  /^branch / { branch=$2 }
  /^detached/ { branch="DETACHED" }
  /^$/ { printf "%-60s %-12s %s\n", path, (branch == "DETACHED" ? "DETACHED" : branch), head; path=""; head=""; branch="" }
'
```

**Worktree classification:**

| State | Detection | Risk | Action |
|-------|-----------|------|--------|
| Active + clean | Has branch, no uncommitted changes | None | Leave alone |
| Active + dirty | Has branch, uncommitted changes | Data loss on cleanup | Commit or stash before removing |
| Detached HEAD | No branch reference | Moderate — work may be orphaned | Check reflog, create branch if needed |
| Orphaned | Directory missing but git still tracks it | Confusing state | `git worktree prune` |
| Stale | Last commit >7 days old, no recent activity | Disk waste, confusion | Investigate, then remove |
| Locked | `.lock` file present | Blocks prune | Check if lock is legitimate |

```bash
# Find orphaned worktrees (directory gone but git still references)
git worktree list --porcelain | grep "^worktree " | awk '{print $2}' | while read -r wt; do
  if [ ! -d "$wt" ]; then
    echo "ORPHANED: $wt (directory does not exist)"
  fi
done

# Find stale worktrees (no commits in 7+ days)
git worktree list --porcelain | grep "^worktree " | awk '{print $2}' | while read -r wt; do
  if [ -d "$wt" ]; then
    last_commit=$(git -C "$wt" log -1 --format="%ci" 2>/dev/null)
    if [ -n "$last_commit" ]; then
      days_old=$(( ($(date +%s) - $(date -jf "%Y-%m-%d %H:%M:%S %z" "$last_commit" +%s 2>/dev/null || date -d "$last_commit" +%s 2>/dev/null)) / 86400 ))
      if [ "$days_old" -gt 7 ]; then
        echo "STALE ($days_old days): $wt"
      fi
    fi
  fi
done

# Check for dirty worktrees (uncommitted changes)
git worktree list --porcelain | grep "^worktree " | awk '{print $2}' | while read -r wt; do
  if [ -d "$wt" ]; then
    status=$(git -C "$wt" status --porcelain 2>/dev/null)
    if [ -n "$status" ]; then
      file_count=$(echo "$status" | wc -l | tr -d ' ')
      echo "DIRTY ($file_count files): $wt"
    fi
  fi
done
```

### 2. Branch Hygiene Audit

Branches that have been merged but not deleted. Branches that haven't been touched in months. Branches with no upstream tracking. Each one is a small piece of confusion that compounds.

```bash
# Branches merged into main that haven't been deleted
git branch --merged main | grep -v "^\*\|main\|master" | while read -r branch; do
  echo "MERGED (safe to delete): $branch"
done

# Branches NOT merged, sorted by last commit date
git for-each-ref --sort=-committerdate --format='%(refname:short) %(committerdate:relative) %(authorname)' refs/heads/ | \
  while read -r branch date author; do
    merged=$(git branch --merged main | grep -c "^\s*$branch$")
    if [ "$merged" -eq 0 ] && [ "$branch" != "main" ] && [ "$branch" != "master" ]; then
      echo "UNMERGED: $branch (last commit: $date by $author)"
    fi
  done

# Remote branches with no local tracking
git branch -r | grep -v HEAD | while read -r remote_branch; do
  local_branch="${remote_branch#origin/}"
  if ! git branch --list "$local_branch" | grep -q .; then
    # Check if it's stale
    last_date=$(git log -1 --format="%cr" "$remote_branch" 2>/dev/null)
    echo "REMOTE ONLY: $remote_branch (last commit: $last_date)"
  fi
done

# Branches with diverged upstream
git for-each-ref --format='%(refname:short) %(upstream:short) %(upstream:track)' refs/heads/ | \
  grep -v "^\s*$" | while read -r local upstream track; do
    if [[ "$track" == *"ahead"* ]] && [[ "$track" == *"behind"* ]]; then
      echo "DIVERGED: $local ($track)"
    elif [[ "$track" == *"gone"* ]]; then
      echo "UPSTREAM GONE: $local (remote branch deleted)"
    fi
  done
```

**Branch age thresholds:**

| Age | Status | Recommendation |
|-----|--------|---------------|
| < 7 days | Active | Leave alone |
| 7-30 days | Aging | Check with author |
| 30-90 days | Stale | Strong candidate for deletion if merged |
| > 90 days | Abandoned | Delete if merged, archive if unmerged with value |

### 3. Uncommitted Work Detection

The most dangerous state: valuable work that exists only as uncommitted changes, one `git clean` away from oblivion.

```bash
# Check main worktree
main_status=$(git status --porcelain)
if [ -n "$main_status" ]; then
  echo "MAIN WORKTREE has uncommitted changes:"
  echo "$main_status" | head -20
  staged=$(echo "$main_status" | grep "^[MADRCU]" | wc -l | tr -d ' ')
  unstaged=$(echo "$main_status" | grep "^.[MADRCU]" | wc -l | tr -d ' ')
  untracked=$(echo "$main_status" | grep "^??" | wc -l | tr -d ' ')
  echo "  Staged: $staged | Unstaged: $unstaged | Untracked: $untracked"
fi

# Check all worktrees
git worktree list --porcelain | grep "^worktree " | awk '{print $2}' | while read -r wt; do
  status=$(git -C "$wt" status --porcelain 2>/dev/null)
  if [ -n "$status" ]; then
    branch=$(git -C "$wt" branch --show-current 2>/dev/null || echo "DETACHED")
    echo ""
    echo "UNCOMMITTED in $wt (branch: $branch):"
    echo "$status" | head -10
    total=$(echo "$status" | wc -l | tr -d ' ')
    if [ "$total" -gt 10 ]; then
      echo "  ... and $((total - 10)) more files"
    fi
  fi
done
```

### 4. Git Hooks Audit

Hooks are the immune system of the repository. Missing or misconfigured hooks mean quality gates are down.

```bash
HOOKS_DIR=".git/hooks"
# Check for Husky (modern standard)
if [ -d ".husky" ]; then
  HOOKS_DIR=".husky"
  echo "Hook system: Husky"
elif [ -f ".lefthookrc" ] || [ -f "lefthook.yml" ]; then
  echo "Hook system: Lefthook"
else
  echo "Hook system: Native git hooks"
fi

# Expected hooks
EXPECTED_HOOKS=("pre-commit" "commit-msg" "pre-push")

for hook in "${EXPECTED_HOOKS[@]}"; do
  hook_file="$HOOKS_DIR/$hook"
  if [ -f "$hook_file" ]; then
    if [ -x "$hook_file" ]; then
      echo "OK: $hook (executable)"
    else
      echo "WARNING: $hook exists but is NOT executable"
    fi
  else
    echo "MISSING: $hook"
  fi
done

# Check if hooks are being bypassed
# Look for --no-verify in recent commits (sign of habitual skipping)
git log --oneline -50 | while read -r sha msg; do
  # Can't detect --no-verify from log, but can check for missing
  # conventional commit format if commit-msg hook should enforce it
  if ! echo "$msg" | grep -qE "^[a-f0-9]+ (feat|fix|docs|style|refactor|test|chore|build|ci|perf)"; then
    echo "UNCONVENTIONAL: $sha $msg"
  fi
done 2>/dev/null | head -10
```

### 5. Disk Usage Audit

Git repositories grow. Worktrees multiply. Nobody notices until the disk is full.

```bash
# Repository size
repo_size=$(du -sh .git | awk '{print $1}')
echo "Repository (.git): $repo_size"

# Worktree sizes
git worktree list --porcelain | grep "^worktree " | awk '{print $2}' | while read -r wt; do
  if [ -d "$wt" ]; then
    wt_size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
    echo "Worktree: $wt ($wt_size)"
  fi
done

# Largest objects in pack (potential LFS candidates)
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  grep "^blob" | sort -t' ' -k3 -rn | head -10 | \
  while read -r type sha size path; do
    size_mb=$(echo "scale=1; $size / 1048576" | bc)
    echo "LARGE OBJECT: ${size_mb}MB - $path"
  done

# Check for large files that should be in LFS
find . -not -path './.git/*' -type f -size +10M 2>/dev/null | while read -r file; do
  echo "LARGE FILE (>10MB): $file ($(du -h "$file" | awk '{print $1}'))"
done
```

---

## Decision Points

### When to Auto-Clean vs Require Human Review

| Condition | Auto-Clean OK? | Reasoning |
|-----------|---------------|-----------|
| Orphaned worktree (directory gone) | Yes | `git worktree prune` is safe; the directory is already gone |
| Merged branch, local only | Yes | Work is in main, branch is redundant |
| Merged branch, has remote | Ask first | Others may reference the remote branch |
| Stale branch, unmerged | Never auto-clean | May contain valuable unfinished work |
| Dirty worktree | Never auto-clean | Uncommitted changes would be lost |
| Locked worktree | Never auto-clean | Lock exists for a reason; investigate |

### Audit Frequency Recommendations

| Project Type | Frequency | Trigger |
|-------------|-----------|---------|
| Solo developer | Monthly | Before release |
| Small team (2-5) | Bi-weekly | Sprint boundaries |
| Large team (5+) | Weekly | Automated in CI |
| Multi-agent execution | After every session | Agent cleanup hook |
| Monorepo | Weekly | Worktree count check |

---

## Anti-Patterns

### Anti-Pattern: "Delete All Merged Branches" Scripts

**What it looks like:** A cron job that runs `git branch --merged main | xargs git branch -d` weekly.

**Why wrong:** Not all merged branches should be deleted. Release branches (`release/v2.1`), environment branches (`staging`, `production`), and long-lived integration branches are "merged" in the sense that main contains their work, but they serve ongoing purposes. Blanket deletion destroys these.

**Instead:** Maintain an explicit allowlist of protected branch patterns. Only auto-delete branches matching feature-branch naming conventions (e.g., `feat/*`, `fix/*`, `chore/*`). Require human confirmation for anything else.

### Anti-Pattern: Never Cleaning Worktrees

**What it looks like:** 30 worktrees on disk, 25 of them stale, developer says "I'll clean them up eventually."

**Why wrong:** Each worktree is a full checkout. In a 500MB repo, 30 worktrees consume 15GB. More importantly, stale worktrees create confusion about which checkout is the "real" one. Agents may accidentally operate in a stale worktree.

**Instead:** Enforce a worktree limit. If you have more than 5 worktrees, you must justify each one. Run the audit after every multi-agent session and clean up immediately.

### Anti-Pattern: Hooks Without Enforcement

**What it looks like:** Pre-commit hooks configured but half the team uses `--no-verify` because "the hooks are too slow."

**Why wrong:** Hooks that are routinely bypassed provide false confidence. The team thinks quality gates are active. They are not. Server-side hooks (pre-receive) cannot be bypassed and should be the enforcement layer. Client-side hooks are a convenience, not a guarantee.

**Instead:** If hooks are too slow, fix the performance (use `lint-staged` for incremental linting, cache test results). Track `--no-verify` usage via server-side hook that checks for missing expected metadata. If client hooks ran, they would have added metadata; absence means they were skipped.

### Anti-Pattern: Auditing Without Action

**What it looks like:** Weekly audit report emailed to the team. Nobody reads it. Nothing changes.

**Why wrong:** An audit that produces no action is waste. It exists to make someone feel like hygiene is being maintained, while the actual hygiene declines.

**Instead:** Audit results must produce tickets or automated cleanup. Every WARNING must have an owner. Every FAIL must block something (merge, deploy, or release). If nobody acts on audit results, stop running the audit and invest the time in automation instead.

---

## Quality Checklist

A complete audit covers:

- [ ] All worktrees enumerated with state classification (active/stale/orphaned/dirty)
- [ ] Orphaned worktrees pruned
- [ ] Stale worktrees flagged with last commit date and author
- [ ] Dirty worktrees inventoried with uncommitted file counts
- [ ] Merged branches identified for deletion
- [ ] Unmerged stale branches flagged with owner and last activity date
- [ ] Branches with deleted upstream remotes identified
- [ ] Diverged branches flagged for rebase or resolution
- [ ] Git hooks present, executable, and covering pre-commit + commit-msg + pre-push
- [ ] Repository disk usage reported
- [ ] Large objects identified as LFS candidates
- [ ] Cleanup actions documented with commands to execute

---

## Output Contract

This skill produces:
- **Audit report** with PASS/WARN/FAIL for each category (worktrees, branches, hooks, disk)
- **Cleanup script** with safe-to-run commands for orphaned worktrees and merged branches
- **Risk inventory** listing dirty worktrees and unmerged stale branches requiring human decision
- **Hook configuration assessment** with gaps and recommended additions
- **Disk usage summary** with largest objects and LFS migration candidates

## References

- `references/worktree-lifecycle.md` -- Worktree creation, usage, and cleanup patterns for agent-based workflows
- `references/branch-naming-conventions.md` -- Protected patterns, feature branch naming, and auto-cleanup rules
