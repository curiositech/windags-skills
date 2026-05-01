---
name: cloudflare-workers-debugging
description: 'Use when wrangler deploys silently fail or produce wrong artifacts, secrets upload as empty strings, custom domain DNS is not resolving, route assignment broke after rename, observability/tail logs are needed, D1/KV/R2 bindings are missing, OAuth scope errors block a command, cookies on a redirect are not attaching, or the worker exceeds CPU time. Triggers: "Tenant or user not found", "Authentication error" on wrangler d1 push, secret length is 0 after upload, route returns origin not worker, "compatibility_date too old", 1101 errors, custom_domain assignment lost on script rename. NOT for AWS Lambda / Vercel Edge / Deno Deploy (different runtimes), Cloudflare Zero Trust, or R2-specific tuning.'
category: DevOps & Infrastructure
tags:
  - cloudflare
  - workers
  - wrangler
  - pages
  - d1
  - deployment
  - debugging
---

# Cloudflare Workers Debugging

Wrangler papers over a lot, but when it leaks, it leaks badly. The combination of OAuth tokens, account/zone/script bindings, and shell aliases produces silent failures that look like "the deploy worked" until you hit prod and see nothing changed. This skill is the catalog of those failures.

## When to use

- A wrangler command "succeeded" but the live behavior didn't change.
- `wrangler secret put NAME` set the secret to an empty string.
- D1 commands fail with auth errors only sometimes (the rest of wrangler works).
- Custom domain configured days ago still 522s.
- Hono `c.redirect()` followed by `c.header('Set-Cookie', ...)` "loses the cookie."
- Worker hits CPU limit (1101) and you need to find the culprit.
- Pages preview deploy + git-push production deploy collided.

## Core capabilities

### Wrangler auth model

Wrangler has two auth paths: OAuth (`wrangler login`) for human-driven local work, and API tokens (`CLOUDFLARE_API_TOKEN`) for CI. They have different scope models.

OAuth scopes are granted at first login. Adding a new product (D1, R2, Workers Logs) creates a new scope you don't have until you re-auth:

```bash
wrangler logout
wrangler login
# Opens browser; consent to the new scopes the prompt now lists.
```

If `wrangler d1 execute` returns `Authentication error` but `wrangler whoami` works, you're missing `d1:write`. Re-login.

For CI, mint an API token with the exact scopes:
- `Account → Workers Scripts → Edit`
- `Account → D1 → Edit`
- `Zone → DNS → Edit` (only if you change DNS from CI)

Set as `CLOUDFLARE_API_TOKEN`; do not set `CLOUDFLARE_API_KEY` (legacy global).

### The empty-secret trap

This bites at least once per project:

```bash
# WRONG — if `cat` is aliased (e.g. `cat → bat`), the pipe receives no bytes.
cat /tmp/token.txt | wrangler secret put MY_TOKEN

# RIGHT — bypass aliases.
wrangler secret put MY_TOKEN < /tmp/token.txt
# OR
TOKEN=$(< /tmp/token.txt) && printf '%s' "$TOKEN" | wrangler secret put MY_TOKEN
```

After uploading, verify the value isn't empty. Add a debug endpoint temporarily:

```ts
app.get('/_debug/secret-len', (c) => {
  const v = c.env.MY_TOKEN ?? '';
  return c.json({ len: v.length, type: typeof v });
});
```

Hit it; expect `len > 0`. Remove the endpoint before any non-trivial deploy.

### D1 migrations vs "repair"

D1 has no `migration repair` analog because D1 doesn't pretend the SQL ran when it didn't. Compare:

```bash
# Apply pending migrations against the remote database.
wrangler d1 migrations apply windags-telemetry --remote

# One-off SQL.
wrangler d1 execute windags-telemetry --remote --file=migrations/002_cascade_scores.sql
wrangler d1 execute windags-telemetry --remote --command="SELECT count(*) FROM tool_call_events;"
```

Local vs remote: `--local` uses `.wrangler/state/v3/d1/`; `--remote` hits the real DB. Forgetting `--remote` is a frequent footgun.

### Custom domains and routes

Two competing models in `wrangler.toml`:

```toml
# Model A — Cloudflare manages the DNS record on the zone.
routes = [
  { pattern = "api.windags.ai", custom_domain = true }
]

# Model B — You own the DNS; route only triggers if traffic arrives.
routes = [
  { pattern = "api.windags.ai/*", zone_name = "windags.ai" }
]
```

`custom_domain = true` creates an AAAA record on first deploy. If you rename the worker, the assignment doesn't migrate; you need to delete the old domain assignment in the dashboard and let the new worker re-create it.

### Cookies on a 302

`SameSite=Strict` blocks cookies on redirects in some browsers (notably Safari and older Chrome). For login flows that POST or 302 into the protected zone, use `SameSite=Lax`:

```ts
c.header(
  'Set-Cookie',
  `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/_internal; Max-Age=${30*86400}`,
);
return c.redirect('/_internal/dashboard');
```

`Strict` is appropriate for cookies that should never accompany a cross-origin navigation; `Lax` is the right default for session cookies that need to ride a top-level redirect.

### Observability and tail

```toml
# wrangler.toml
[observability]
enabled = true
```

```bash
# Pretty live tail.
wrangler tail --format=pretty

# Filtered.
wrangler tail --status=error --search="OOM"
```

Without `[observability]`, the dashboard's logs view is read-only and limited. Turn it on; the cost is negligible.

### Bindings — verifying they exist at runtime

The wrangler.toml is hopeful; the deploy is the truth. Add a startup log that enumerates env keys:

```ts
console.log('bindings', Object.keys(c.env).join(','));
```

Bindings that exist in the toml but not in the deploy artifact mean: you re-deployed without the new toml, or `[env.staging]` overrides shadowed it.

### Workers limits

| Plan | CPU per request | Memory | Subrequests |
|------|------------------|--------|-------------|
| Free | 10ms | 128MB | 50 |
| Paid | 30s | 128MB | 1000 |

Error 1101 = uncaught error during execution; 1102 = exceeded CPU. JSON.parse on a huge body, regex backtracking, and crypto.subtle calls on big inputs are common culprits.

## Anti-patterns

### Empty secret from piped `cat` (alias trap)

**Symptom:** Worker logs show `secret_len=0` but `wrangler secret list` shows the secret name.
**Diagnosis:** `cat` aliased to a tool that's missing or expects a TTY. Pipe sends nothing; wrangler stores empty string.
**Fix:** Use `< file` redirect or `printf '%s' "$VAR" | wrangler secret put NAME`. Verify length after upload.

### Wrangler OAuth missing D1 scope

**Symptom:** Workers/Pages commands work; `wrangler d1 execute` returns "Authentication error".
**Diagnosis:** OAuth was granted before D1 became part of the project; the scope wasn't re-consented.
**Fix:** `wrangler logout && wrangler login`. Consent to the now-listed scopes.

### Re-deployed but route still hits old version

**Symptom:** `wrangler deploy` succeeded; live behavior unchanged.
**Diagnosis:** Custom domain still bound to the previous worker name, or a `routes` entry overlaps.
**Fix:** Dashboard → Workers & Pages → Triggers. Delete the stale assignment. Re-run `wrangler deploy`.

### `c.redirect()` "losing" Set-Cookie

**Symptom:** Login endpoint sets cookie, redirects; the dashboard says forbidden.
**Diagnosis:** Hono DOES emit Set-Cookie on a redirect, but `SameSite=Strict` makes the browser drop the cookie on the immediate navigation.
**Fix:** Switch to `SameSite=Lax` for login-token cookies. Verify with curl + cookie jar to rule out server-side issues first.

### Pages preview clobbered by git-push prod deploy

**Symptom:** A teammate's `wrangler pages deploy` preview is overwritten when main pushes.
**Diagnosis:** Both flows write to the same project. Production deploy from git is configured to consume the `main` branch.
**Fix:** Use distinct project names or branches. `wrangler pages deploy out --project=foo-preview --branch=erich-test` keeps previews isolated.

### `compatibility_date` too old

**Symptom:** `URLPattern is not defined`; `EventSource is undefined`. Code that runs locally fails in production.
**Diagnosis:** Workers ships new APIs gated by compat date; old dates pin to old runtimes.
**Fix:** Bump `compatibility_date` to within the last 30 days. Add `compatibility_flags` only when you need a specific opt-in.

## Quality gates

- [ ] Every secret verified with a length-check endpoint or smoke test post-upload.
- [ ] OAuth scopes refreshed whenever the project adds D1/R2/Queues.
- [ ] D1 migrations applied with `--remote`; local + remote schemas reconciled before deploy.
- [ ] Custom domain DNS resolves before the deploy is announced.
- [ ] `[observability] enabled = true` in every environment.
- [ ] `compatibility_date` bumped within 90 days of release.
- [ ] Bindings enumerated at startup; missing bindings are loud, not silent.
- [ ] No `--no-verify` or `-c commit.gpgsign=false` in deploy scripts unless explicitly authorized.
- [ ] Error budget for CPU time monitored; 1102s tracked over time.

## NOT for

- **AWS Lambda / Vercel Edge / Deno Deploy** — different runtimes, different limits.
- **R2 bucket-specific tuning** — multipart, lifecycle, presigned URLs are a separate domain.
- **Cloudflare Zero Trust / Access** — auth product with its own configuration model.
- **Hyperdrive-specific debugging** — pair with the Hyperdrive skill (no dedicated skill yet).
- **Hono routing/middleware specifics** — once it's a Hono issue, → `hono-patterns`.
- **D1 / Supabase migration commands hanging** — different surface. → `d1-and-supabase-migrations`.
- **Pages Functions** specifically — overlaps but has its own conventions.
