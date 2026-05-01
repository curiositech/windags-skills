---
name: github-actions-matrix-patterns
description: 'Use when designing matrix builds (OS x version x dimension), composing reusable workflows, gating jobs on conditions, doing OIDC to AWS/GCP/Cloudflare without long-lived secrets, sharding tests across runners, or fixing cache invalidation. Triggers: workflow_call between repos, fail-fast: false tradeoffs, exclude/include matrix surgery, environment protection rules, OIDC trust policy setup, concurrency cancellation on duplicate pushes, artifact reuse across jobs, conditional job matrices computed at runtime. NOT for GitLab CI / CircleCI / Jenkins (different yaml dialects), self-hosted runner administration, or local act dev.'
category: DevOps & Infrastructure
tags:
  - github-actions
  - ci-cd
  - matrix
  - oidc
  - reusable-workflows
  - automation
---

# GitHub Actions Matrix Patterns

Hello-world Actions are easy. Real CI gets stuck on three things: matrix expansion that runs the wrong cells, OIDC trust policies that reject your cloud auth, and cache keys that never invalidate (or invalidate on every commit). This skill catalogs those.

## When to use

- Building across OS x runtime version x dimension (e.g., ubuntu/macos/windows × Node 20/22).
- Sharing a workflow between repos via `workflow_call`.
- Authenticating to AWS/GCP/Cloudflare without storing long-lived keys.
- Sharding a slow test suite across N runners.
- Cancelling outdated CI runs when a new commit lands on the same branch.

## Core capabilities

### Basic matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node: [20, 22]
    include:
      - os: ubuntu-latest
        node: 22
        coverage: true        # extra dimension only on this cell
    exclude:
      - os: windows-latest
        node: 20              # known broken combination
```

`fail-fast: true` cancels the rest of the matrix on the first failure — fine for dev speed, bad for "tell me everything that's broken." Default to `false` for release CI.

### Reusable workflows (`workflow_call`)

```yaml
# .github/workflows/test.yml
on:
  workflow_call:
    inputs:
      node-version: { type: string, required: false, default: '22' }
      coverage: { type: boolean, required: false, default: false }
    secrets:
      CODECOV_TOKEN: { required: false }
    outputs:
      coverage-pct:
        value: ${{ jobs.test.outputs.coverage-pct }}

jobs:
  test:
    runs-on: ubuntu-latest
    outputs:
      coverage-pct: ${{ steps.report.outputs.pct }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ inputs.node-version }} }
      - run: pnpm test
      - if: inputs.coverage
        id: report
        run: echo "pct=$(node scripts/coverage-pct.js)" >> "$GITHUB_OUTPUT"
```

Caller:

```yaml
jobs:
  call-test:
    uses: ./.github/workflows/test.yml
    with: { node-version: '22', coverage: true }
    secrets: inherit
```

For cross-repo: `uses: org/repo/.github/workflows/test.yml@v1` and pin to a tag, never `@main`.

### OIDC to a cloud provider

GitHub mints a short-lived OIDC token. The cloud trusts it via a trust policy. No long-lived AWS keys in your secrets.

```yaml
permissions:
  id-token: write           # mint OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-deploy
          aws-region: us-west-2
      - run: aws s3 sync ./out s3://my-bucket/
```

AWS trust policy on `github-deploy`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":  { "token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:ref:refs/heads/main" }
    }
  }]
}
```

The `sub` condition is the security boundary. Tighten it to `repo:org/repo:environment:production` for additional protection from a malicious PR.

### Concurrency

Cancel outdated runs when a new commit lands on a branch:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

For deploy jobs you don't want to cancel mid-flight, scope to PRs only:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

### Conditional matrices

Compute a matrix at runtime when the dimensions depend on the changed files:

```yaml
jobs:
  changed:
    runs-on: ubuntu-latest
    outputs:
      packages: ${{ steps.set.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - id: set
        run: |
          PKGS=$(git diff --name-only origin/main...HEAD | grep '^packages/' | cut -d/ -f2 | sort -u | jq -R . | jq -sc .)
          echo "packages=$PKGS" >> "$GITHUB_OUTPUT"

  test:
    needs: changed
    if: ${{ needs.changed.outputs.packages != '[]' }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: ${{ fromJson(needs.changed.outputs.packages) }}
    steps:
      - run: pnpm --filter @myorg/${{ matrix.package }} test
```

### Caching with stable keys

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: |
      pnpm-${{ runner.os }}-
```

`key` invalidates when the lockfile changes. `restore-keys` is the partial-hit fallback — restores the latest matching prefix.

For language toolchains, prefer the setup-* actions' built-in caching (`actions/setup-node@v4 with: cache: 'pnpm'`); they handle key construction.

### Sharding tests across runners

```yaml
strategy:
  fail-fast: false
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: pnpm test --shard=${{ matrix.shard }}/4
```

Most test runners (vitest, jest, playwright) accept `--shard=K/N`. Distribute by file count and rotate the assignment seed weekly to prevent a slow file always landing on shard 1.

### Environments + protection rules

```yaml
jobs:
  deploy-prod:
    environment: production
    runs-on: ubuntu-latest
```

`environment: production` triggers required reviewers, deployment branches policy, wait timer, and environment-scoped secrets. Use this for the production deploy step rather than baking approvals into the workflow logic.

## Anti-patterns

### Pinning to `@main` for third-party actions

**Symptom:** Workflow that worked yesterday fails today; no commits to your repo.
**Diagnosis:** Floating tag — upstream pushed a breaking change.
**Fix:** Pin to a SHA: `uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab`. Or at minimum a major tag your security team has reviewed.

### `secrets.GITHUB_TOKEN` for cross-repo writes

**Symptom:** Workflow fails to push to another repo even with `permissions: contents: write`.
**Diagnosis:** `GITHUB_TOKEN` only has scope to the current repo.
**Fix:** Use a deploy key, fine-grained PAT, or GitHub App token (preferred for orgs).

### Matrix `exclude` without `include`

**Symptom:** Matrix balloons to 30 cells; you exclude 25 of them.
**Diagnosis:** Inverting the polarity. Exclude is for trimming a small handful; include is for adding cells.
**Fix:** Build the small list explicitly with `include` only.

### Cache key that never invalidates

**Symptom:** Stale dependencies on every run; "works locally" recurring.
**Diagnosis:** Key uses only `runner.os`, no hash of the lockfile.
**Fix:** Always `hashFiles('lockfile.path')` in the key. `restore-keys` is fallback, not primary.

### OIDC `sub` claim too permissive

**Symptom:** A fork PR triggers a deploy.
**Diagnosis:** Trust policy `sub: repo:org/repo:*` matches PR refs from forks.
**Fix:** Pin to specific refs: `repo:org/repo:ref:refs/heads/main`, or use environment claims: `repo:org/repo:environment:production`.

### Implicit `permissions: write-all`

**Symptom:** A compromised action exfiltrates a token with full repo write.
**Diagnosis:** Workflow inherits the default permissions, which historically were write-all.
**Fix:** Set top-level `permissions: read-all` and grant per-job: `permissions: { contents: read, id-token: write }`.

## Quality gates

- [ ] Every third-party action pinned to a SHA or audited major version.
- [ ] Top-level `permissions: read-all`; per-job grants minimal.
- [ ] OIDC used instead of long-lived cloud secrets where the provider supports it.
- [ ] Production deploys behind `environment:` with required reviewers.
- [ ] `concurrency` set on PR workflows to cancel outdated runs.
- [ ] Cache keys include a hash of the lockfile they cover.
- [ ] `fail-fast: false` on release CI matrices.
- [ ] Test sharding seed rotated weekly so slow files don't pin a shard.
- [ ] No `secrets: inherit` to forks.

## NOT for

- **GitLab CI / CircleCI / Jenkins** — different DSLs, different runners.
- **Self-hosted runner administration** — different domain (autoscaling, security hardening).
- **`act` local development** — local-only quirks not worth conflating.
- **GitHub Apps** beyond their use as token issuers — separate skill (no dedicated skill yet).
- **pnpm workspace filtering, catalogs, hoisting** — once the matrix is fine and the workspace is broken, → `pnpm-workspace-monorepo`.
- **Docker image build cache strategy from CI** — → `dockerfile-build-cache-mastery` for the Dockerfile/buildx side.
