---
name: content-security-policy-headers
description: 'Use when designing or fixing a Content Security Policy on a real site, choosing between nonce-based and hash-based CSP, adding strict-dynamic, debugging "Refused to execute inline script" errors, deploying CSP in report-only mode first, configuring report-to / report-uri, or auditing an existing policy for unsafe-inline / unsafe-eval / wildcards. Triggers: "CSP blocks legitimate inline script", strict-dynamic, nonce-{RANDOM}, sha256-{HASH}, object-src none, base-uri none, frame-ancestors, Trusted Types, X-Content-Security-Policy obsolete, report-only vs enforced. NOT for general HTTP security headers (HSTS, COOP/COEP), Trusted Types deep dive, CORS configuration, or building a WAF.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - csp
  - security
  - xss
  - http-headers
  - browser-security
---

# Content Security Policy Headers

A real CSP is short, strict, and rolled out gradually. The accumulated industry consensus — Google's web.dev guide, OWASP's cheat sheet, and the W3C CSP3 spec — points at the same baseline: **nonce-based or hash-based `script-src` with `'strict-dynamic'`, `object-src 'none'`, `base-uri 'none'`**. That's it. Everything else (allowlists of CDN URLs, `unsafe-inline`, `unsafe-eval`) is what we're trying to leave behind.

```
Content-Security-Policy:
  script-src 'nonce-{RANDOM}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

This three-line policy is what Google's web.dev recommends verbatim ([web.dev — *Mitigate cross-site scripting (XSS) with a strict CSP*][webdev-strict-csp]) and what OWASP's cheat sheet recommends verbatim ([OWASP — *Content Security Policy Cheat Sheet*][owasp-csp]). When in doubt, ship that and add only what you measurably need.

**Jump to your fire:**
- "CSP blocks my legitimate inline script" → [Strict CSP with nonce or hash](#strict-csp-with-nonce-or-hash)
- Need to roll this out without breaking the site → [Rollout: report-only first](#rollout-report-only-first)
- SPA / static-site / can't generate per-request nonces → [Hash-based CSP for static apps](#hash-based-csp-for-static-apps)
- Third-party scripts (analytics, Sentry) keep getting blocked → [strict-dynamic explained](#strict-dynamic-explained)
- Where do violation reports go → [Reporting: report-to vs report-uri](#reporting-report-to-vs-report-uri)
- Auditing an existing too-permissive policy → [Anti-patterns](#anti-patterns)

## When to use

- New site, bake CSP in from the start.
- Existing site failing a security audit because of `unsafe-inline` or wildcard sources.
- "CSP blocks legitimate scripts" tickets piling up — usually means the policy is wrong, not that CSP is hostile.
- Migrating off legacy `X-Content-Security-Policy` / `X-WebKit-CSP` (obsolete; OWASP says: *"DO NOT use X-Content-Security-Policy or X-WebKit-CSP. Their implementations are obsolete… limited, inconsistent, and incredibly buggy."*) ([OWASP][owasp-csp])

## Core capabilities

### Strict CSP with nonce or hash

The policy:

```http
Content-Security-Policy:
  script-src 'nonce-aB3xZ9pQrLm2' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

What each directive does:

| Directive | Why |
|---|---|
| `script-src 'nonce-…' 'strict-dynamic'` | Only scripts with the matching nonce, or scripts loaded by such scripts, run. |
| `object-src 'none'` | Blocks `<object>`, `<embed>`, `<applet>` — historic XSS vectors. |
| `base-uri 'none'` | Blocks injected `<base>` tags from rewriting all relative URLs. |

The nonce is a fresh random per response, attached to every legitimate `<script>` you serve:

```html
<script nonce="aB3xZ9pQrLm2">
  // your real script
</script>
<script nonce="aB3xZ9pQrLm2" src="/app.js"></script>
```

Generate the nonce server-side per request — minimum 128 bits of entropy, base64-encoded:

```ts
// Hono / Express / generic.
import crypto from 'crypto';
function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

// In your render layer:
const nonce = generateNonce();
res.setHeader('Content-Security-Policy',
  `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none';`);
res.locals.cspNonce = nonce;   // available to templates
```

OWASP flags the most common nonce mistake: *"Don't create a middleware that replaces all script tags with nonces because attacker-injected scripts will then get the nonces as well."* ([OWASP][owasp-csp]) The nonce must be attached only to scripts you write into the template; never via a regex over arbitrary HTML.

### strict-dynamic explained

Without `strict-dynamic`, every `<script src="https://cdn.example.com/lib.js">` needs to be in the allowlist. Allowlists are brittle: third-party libraries load other scripts, and you end up either with a 50-line CSP or back to `unsafe-inline`.

`strict-dynamic` says: *if a script that already passed the nonce/hash check creates more scripts (e.g. dynamically inserts `<script>` tags), allow those too.* That collapses the allowlist into "the scripts I trust trust their own loaders." ([web.dev][webdev-strict-csp])

```
script-src 'nonce-...' 'strict-dynamic';
// → no need to enumerate cdn.example.com, sentry.io, googletagmanager.com, etc.
```

The web.dev guide's framing: `strict-dynamic` *"reduce[s] the effort of deploying a nonce- or hash-based CSP by automatically allowing the execution of scripts that a trusted script creates."* ([web.dev][webdev-strict-csp])

### Hash-based CSP for static apps

If your HTML is statically generated (SSG, S3-hosted SPA, no per-request rendering), you can't generate a fresh nonce per response. Use hashes of your inline scripts instead:

```
script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';
object-src 'none'; base-uri 'none';
```

Compute the hash:

```bash
echo -n "console.log('hello');" | openssl dgst -binary -sha256 | base64
# → e8s/wuPWnj1ulPdTGJN6WS9MotPHZkoOCFJrrG3EexQ=
```

Then:

```http
script-src 'sha256-e8s/wuPWnj1ulPdTGJN6WS9MotPHZkoOCFJrrG3EexQ=' 'strict-dynamic';
```

The downside, per OWASP and web.dev: *"the problem with hash-based directives is that you need to recalculate and reapply the hash if any change is made to the script contents."* ([web.dev][webdev-strict-csp]) Even whitespace changes break it. For SPAs, automate the hash generation as part of the build and write the policy from the same source-of-truth.

The web.dev guidance: *"Use a nonce-based CSP for HTML pages rendered on the server… Use a hash-based CSP for HTML pages served statically, or pages that need to be cached, such as single-page web applications."* ([web.dev][webdev-strict-csp])

### Rollout: report-only first

Two-phase rollout is the standard playbook ([web.dev][webdev-strict-csp], [OWASP][owasp-csp]):

```http
# Phase 1 — observation only. Browser reports violations, blocks nothing.
Content-Security-Policy-Report-Only:
  script-src 'nonce-...' 'strict-dynamic';
  object-src 'none'; base-uri 'none';
  report-to csp-endpoint
```

Run this for a week or two. Watch the violation reports. Find the legitimate scripts that don't have nonces yet, fix them. Find the `unsafe-eval` callers (looking at you, old jQuery), fix or replace.

```http
# Phase 2 — enforce. Same policy, different header.
Content-Security-Policy:
  script-src 'nonce-...' 'strict-dynamic';
  object-src 'none'; base-uri 'none';
  report-to csp-endpoint
```

Keep the report endpoint in place after enforcement — new violations mean either an attempted attack or a regression in your code.

### Reporting: report-to vs report-uri

The newer `report-to` directive uses a JSON `Reporting-Endpoints` header; the deprecated `report-uri` directive takes a URL directly. Browsers progressively support `report-to`; older ones still need `report-uri`. OWASP recommends emitting **both**: *"Whenever a browser supports report-to, it will ignore report-uri. Otherwise, report-uri will be used."* ([OWASP][owasp-csp])

```http
Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"

Content-Security-Policy:
  script-src 'nonce-...' 'strict-dynamic';
  object-src 'none'; base-uri 'none';
  report-to csp-endpoint;
  report-uri https://example.com/csp-reports
```

Receiver should accept JSON, log to `structured-logging-design`, alert if violation rate spikes (`grafana-dashboard-builder`).

### Other directives worth considering

- `frame-ancestors 'none'` — replaces the legacy `X-Frame-Options: DENY`. CSP-via-`<meta>` cannot set this; it must be a header.
- `upgrade-insecure-requests` — auto-upgrades `http://` subresources to HTTPS during a TLS migration.
- `default-src 'self'` — fallback for directives you didn't set; safe baseline.
- `connect-src` — restricts XHR/fetch/WebSocket destinations. Useful when paired with strict script-src.

### Trusted Types (advanced)

For sinks that can lead to XSS (`innerHTML`, `eval`, `Function`), browsers support `require-trusted-types-for 'script'` to force callers to go through a Trusted Types policy you define. web.dev calls it complementary to strict CSP ([web.dev][webdev-strict-csp]). Significant code-change cost; pick it up after strict CSP is stable.

## Anti-patterns

### `unsafe-inline` in `script-src`

**Symptom:** CSP audit "passes" syntactically, but XSS payloads still execute.
**Diagnosis:** `unsafe-inline` allows any inline `<script>` regardless of nonce/hash; it's the legacy escape hatch that defeats the point of CSP.
**Fix:** Remove it. Add `'strict-dynamic'` so legitimate dynamically-inserted scripts still work via nonce trust transfer.

### `unsafe-eval` in `script-src`

**Symptom:** Same as above — CSP technically present, but runtime code from strings runs unrestricted.
**Diagnosis:** Library uses `eval`, `new Function()`, or `setTimeout("...")`; you added `unsafe-eval` to silence the errors.
**Fix:** Find the offender (CSP report-only mode shows the line). Replace `eval`-using libraries (the modern alternatives don't need it).

### Wildcard `*` in any directive

**Symptom:** CSP allows scripts/connections from any origin; review marks it as "configured but ineffective."
**Diagnosis:** `script-src *` or `connect-src *` defeats CSP entirely.
**Fix:** Specific origins only, or use `'strict-dynamic'` for scripts.

### CDN URL allowlist instead of nonce/hash + strict-dynamic

**Symptom:** Policy is 200 chars long, listing every CDN you've ever loaded a font from.
**Diagnosis:** Allowlist-based CSP is the old way; bypasses are easy (any domain serving JSONP is a vector).
**Fix:** Switch to nonce + `'strict-dynamic'`. Drop the URL list.

### Nonce reused across requests

**Symptom:** XSS payload that captured a previous nonce can inject scripts in subsequent requests.
**Diagnosis:** The nonce was generated once at server startup (or per-route) instead of per-response.
**Fix:** Fresh nonce on every response. ≥ 128 bits entropy.

### Middleware that adds nonces to all `<script>` tags

**Symptom:** Attacker-injected `<script>` tags also get the nonce automatically — CSP is now useless.
**Diagnosis:** Per OWASP: *"Don't create a middleware that replaces all script tags with nonces because attacker-injected scripts will then get the nonces as well."* ([OWASP][owasp-csp])
**Fix:** Add the nonce only at known emission points (template engine, server-rendered HTML), never via a post-hoc HTML rewrite.

### CSP via `<meta http-equiv>` for everything

**Symptom:** `frame-ancestors` is in the meta tag and silently ignored.
**Diagnosis:** Per the CSP3 spec, several directives (`frame-ancestors`, `report-to`, `report-uri`, `sandbox`) are header-only. Meta-tag CSP can't enforce framing.
**Fix:** Set CSP as an HTTP header. Meta-tag CSP is acceptable as a fallback but not as the primary mechanism.

### Forgetting `object-src 'none'`

**Symptom:** Strict `script-src` is in place, but XSS via `<embed>` / `<object>` still works.
**Diagnosis:** `object-src` falls back to `default-src` if unset, which is often missing or permissive.
**Fix:** Always include `object-src 'none'` in the strict baseline.

### `X-Content-Security-Policy` or `X-WebKit-CSP`

**Symptom:** Old documentation tells you to set these; security scanner still warns.
**Diagnosis:** Obsolete vendor-prefixed headers. OWASP: *"limited, inconsistent, and incredibly buggy."* ([OWASP][owasp-csp])
**Fix:** Use the standard `Content-Security-Policy` header. Remove the legacy ones.

## Quality gates

- [ ] **Test:** integration test asserts `Content-Security-Policy` header is present on every HTML response and matches the expected directive set.
- [ ] **Test:** XSS-payload attempt against a known sink is rejected by the browser and produces a violation report (Playwright + violation listener).
- [ ] **Test:** the nonce in the header matches the nonce in the rendered HTML on every response (no caching bug stalls the nonce).
- [ ] Policy contains no `unsafe-inline`, no `unsafe-eval`, no `*` outside very narrow `img-src` / `font-src` cases. CI grep enforces.
- [ ] `script-src` uses `'nonce-...'` or `'sha256-...'` plus `'strict-dynamic'`.
- [ ] `object-src 'none'` and `base-uri 'none'` set.
- [ ] `frame-ancestors 'none'` (or specific origins) set; `<meta>` CSP not relied on for it.
- [ ] Nonce is ≥ 128 bits entropy and regenerated per response.
- [ ] Nonce is added only at known emission points, not via post-hoc HTML rewriting.
- [ ] Both `report-to` (with `Reporting-Endpoints`) and `report-uri` set during transition; receiver logs structured violation reports (see `structured-logging-design`).
- [ ] Two-phase rollout: ≥ 7 days in `Content-Security-Policy-Report-Only` before flipping to enforcement.
- [ ] Legacy `X-Content-Security-Policy` and `X-WebKit-CSP` headers removed.
- [ ] Violation-rate alert: page if violations spike > Nx baseline (defends against attempted XSS or regression).

## NOT for

- **General HTTP security headers** (HSTS, COOP/COEP, X-Frame-Options when CSP isn't an option, X-Content-Type-Options) — different scope. No dedicated skill yet.
- **Trusted Types deep dive** — large standalone topic; complementary to CSP. No dedicated skill yet.
- **CORS configuration** — different mechanism, different threat model.
- **Building a WAF / CSP-bypass detection** — server-side, very different layer.
- **CSP for browser extensions / WebViews / Electron** — sandbox model differs.
- **Subresource integrity** (`integrity="sha384-..."` on `<script>`) — overlapping but distinct. Use both.

## Sources

- web.dev — *Mitigate cross-site scripting (XSS) with a strict Content Security Policy* (Google's recommended baseline policy, nonce vs hash, strict-dynamic, two-phase rollout). [web.dev/articles/strict-csp][webdev-strict-csp]
- OWASP — *Content Security Policy Cheat Sheet* (anti-patterns, obsolete headers, nonce mishandling, report-to vs report-uri). [cheatsheetseries.owasp.org/.../Content_Security_Policy_Cheat_Sheet.html][owasp-csp]
- W3C — *Content Security Policy Level 3*. [w3.org/TR/CSP3/][w3c-csp3]
- MDN — *Content-Security-Policy: script-src directive*. [developer.mozilla.org/.../Content-Security-Policy/script-src][mdn-script-src]
- content-security-policy.com — *strict-dynamic in CSP*. [content-security-policy.com/strict-dynamic/][csp-strict-dynamic]

[webdev-strict-csp]: https://web.dev/articles/strict-csp
[owasp-csp]: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
[w3c-csp3]: https://www.w3.org/TR/CSP3/
[mdn-script-src]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src
[csp-strict-dynamic]: https://content-security-policy.com/strict-dynamic/
