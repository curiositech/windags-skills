---
name: oauth2-and-oidc-from-scratch
description: 'Use when implementing or reviewing OAuth 2.0 / OAuth 2.1 / OpenID Connect from scratch in a real codebase, choosing a flow (authorization code + PKCE, client credentials, BFF), validating ID tokens, storing tokens safely in browsers, sizing refresh-token rotation, or migrating off implicit / ROPC. Triggers: "should I use a JWT or session cookie", PKCE code_challenge/code_verifier, exact redirect_uri match, state vs nonce confusion, ID-token replay, refresh-token rotation, BFF (backend-for-frontend) pattern, token in localStorage warning. NOT for SAML / WS-Federation, building an authorization server (use a battle-tested IdP), passwordless-only flows (passkeys/WebAuthn), or session-cookie auth without a third-party IdP.'
category: Backend & Infrastructure
allowed-tools: Read,Grep,Glob,Edit,Write,Bash
tags:
  - oauth
  - oauth2
  - oidc
  - openid-connect
  - pkce
  - authentication
  - authorization
---

# OAuth 2.0 / OIDC From Scratch

OAuth is small in spec and enormous in pitfalls — most production "auth bugs" are actually one of five recurring mistakes, and the IETF has been quietly hardening the protocol for a decade to close them. As of OAuth 2.1 (current draft `draft-ietf-oauth-v2-1-15`, March 2026), **PKCE is mandatory for every client**, the implicit grant is **removed**, the resource-owner-password-credentials grant is **removed**, and the authorization server **MUST** reject any redirect_uri that doesn't exactly match a registered URI. ([IETF — OAuth 2.1 draft-15][oauth-2-1])

For browser apps the IETF's *Browser-Based Apps* BCP (`draft-ietf-oauth-browser-based-apps-26`) ranks architectures by safety: **BFF (Backend-For-Frontend) > token-mediating backend > pure SPA OAuth client**. The pure-SPA pattern is "vulnerable to all attack scenarios discussed earlier" and should only be used when no backend is available. ([IETF — Browser-Based Apps draft-26][browser-based-apps])

If you remember nothing else: **authorization code flow + PKCE, BFF pattern in the browser, HttpOnly cookies, never localStorage for tokens.**

**Jump to your fire:**
- Choosing a flow → [Pick the right grant type](#pick-the-right-grant-type)
- Building it for a SPA → [BFF (backend-for-frontend) pattern](#bff-backend-for-frontend-pattern)
- "Should I store the token in localStorage?" → [Token storage in the browser](#token-storage-in-the-browser)
- state vs nonce confusion → [state (CSRF) vs nonce (replay)](#state-csrf-vs-nonce-replay)
- ID token validation → [Validating the ID token](#validating-the-id-token)
- Refresh token rotation → [Refresh tokens](#refresh-tokens)
- Migrating off implicit or ROPC → [Migration off deprecated flows](#migration-off-deprecated-flows)

## When to use

- Implementing user login via Google / Microsoft / Apple / Auth0 / Okta / Cognito / Keycloak.
- Service-to-service auth between your own services using `client_credentials`.
- Reviewing a codebase that has its own custom OAuth integration.
- Migrating from implicit flow or ROPC (both removed in OAuth 2.1).
- Designing token storage for a new SPA or mobile app.

## Core capabilities

### Pick the right grant type

| Use case | Grant | Notes |
|---|---|---|
| User logs into your web app via an IdP | **Authorization code + PKCE** | The default. PKCE required even for confidential clients in 2.1. ([oauth-2-1]) |
| Same, but native or mobile | **Authorization code + PKCE** | Use a system browser (`ASWebAuthenticationSession` / Custom Tabs), not embedded WebView |
| SPA without backend | Authorization code + PKCE in the browser, **but prefer BFF** | The browser-based-apps BCP explicitly discourages pure-SPA. ([browser-based-apps]) |
| Service-to-service (no user) | **Client credentials** | mTLS or signed JWT client assertion preferred over client_secret |
| Device with no browser (CLI, IoT) | **Device authorization grant** (RFC 8628) | The "go to https://provider/code and enter ABCD-1234" flow |
| ~~Implicit~~ | **Removed** in 2.1 — migrate to authcode + PKCE | ([oauth-2-1]) |
| ~~Resource Owner Password Credentials~~ | **Removed** in 2.1 — there is no replacement; use a real flow | ([oauth-2-1]) |

The OAuth 2.1 draft is explicit: "Clients MUST use code_challenge and code_verifier and authorization servers MUST enforce their use except under the conditions described in Section 7.5.1." ([oauth-2-1])

### BFF (backend-for-frontend) pattern

```
Browser  ──cookie──▶  BFF  ──tokens──▶  Resource server
                       │
                       ├─ holds access_token + refresh_token server-side
                       └─ exposes only an HttpOnly session cookie to the browser
```

The BCP is unambiguous: *"The BFF MUST act as a confidential client by establishing credentials with the authorization server."* ([browser-based-apps]) That makes the browser **never** see an access token, refresh token, or client credential. The browser holds only an opaque session cookie keyed to a server-side session record.

```ts
// Hono-style BFF, simplified.
import { Hono } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import crypto from 'crypto';

const app = new Hono();

// Login: redirect user to IdP with state + nonce + PKCE.
app.get('/auth/login', async (c) => {
  const state = crypto.randomBytes(32).toString('base64url');
  const nonce = crypto.randomBytes(32).toString('base64url');
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');

  await sessionStore.putPending(state, { nonce, verifier });   // server-side
  const url = new URL(`${ISSUER}/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', `${BFF_ORIGIN}/auth/callback`);  // exact match
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return c.redirect(url.toString());
});

// Callback: validate state, exchange code, validate ID token, set session cookie.
app.get('/auth/callback', async (c) => {
  const code = c.req.query('code');
  const returnedState = c.req.query('state');
  const pending = await sessionStore.takePending(returnedState!);
  if (!pending) return c.text('CSRF: state did not match', 400);

  const tokenRes = await fetch(`${ISSUER}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code!,
      redirect_uri: `${BFF_ORIGIN}/auth/callback`,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,    // confidential client
      code_verifier: pending.verifier,
    }),
  });
  const { access_token, refresh_token, id_token } = await tokenRes.json();

  const idTokenClaims = await verifyIdToken(id_token, { issuer: ISSUER, audience: CLIENT_ID });
  if (idTokenClaims.nonce !== pending.nonce) return c.text('Replay: nonce mismatch', 400);

  const sid = crypto.randomBytes(32).toString('base64url');
  await sessionStore.create(sid, { sub: idTokenClaims.sub, access_token, refresh_token });
  setCookie(c, 'sid', sid, {
    httpOnly: true, secure: true, sameSite: 'Lax',
    path: '/', maxAge: 60 * 60 * 8,
  });
  return c.redirect('/');
});
```

The BFF requirements straight from the BCP: HttpOnly cookies (`MUST`), Secure flag (`MUST`), CSRF defense on the redirect URI (`MUST`). ([browser-based-apps])

### Token storage in the browser

The BCP's hierarchy, unambiguous: ([browser-based-apps])

1. **No browser-side token storage at all** (BFF) — best.
2. **HttpOnly + Secure cookies** — second best, but only for opaque session IDs in the BFF model.
3. **In-memory** (regenerated on refresh) — acceptable for the token-mediating-backend pattern.
4. **Service Workers** — with restrictions; not common.
5. **`localStorage` / `sessionStorage` / `IndexedDB`** — avoid; XSS-readable.

The browser-based-apps BCP says it directly: *"localStorage, IndexedDB (vulnerable to XSS)."* ([browser-based-apps])

### state (CSRF) vs nonce (replay)

These look similar and aren't. Both are random; both are sent in the request and checked in the response; they defend against different attacks.

| Param | Defends against | Where it lives | When you check it |
|---|---|---|---|
| `state` | **CSRF** on the redirect — attacker tricks the user's browser into completing a login the user didn't initiate | URL of the auth request, returned in callback | Compare callback's `state` to a value bound to the user's session before redirecting back ([Auth0 — state-vs-nonce-vs-pkce][auth0-state-nonce]) |
| `nonce` | **ID token replay** — attacker reuses a previously-issued ID token | URL of the auth request, included as a claim in the ID token | Compare the `nonce` claim in the validated ID token to the value you sent ([Auth0 — state-vs-nonce-vs-pkce][auth0-state-nonce]) |

```ts
// Not "either-or" — you need both for OIDC.
const state = randomBase64Url(32);   // CSRF
const nonce = randomBase64Url(32);   // ID-token replay
```

Auth0's writeup is blunt: the nonce *"prevents attackers from reusing old authentication codes... The ID Token's nonce claim must contain the exact same value that was sent in the request. If not, authentication should be rejected."* ([Auth0][auth0-state-nonce])

### Validating the ID token

An ID token is a JWT. Validation is not "decode it" — it's:

1. Verify the signature against the IdP's public keys (`/.well-known/jwks.json`, with key rotation).
2. `iss` (issuer) matches your configured issuer **exactly** (no trailing slash drift).
3. `aud` (audience) contains your `client_id`.
4. `azp` (authorized party) equals your `client_id` if multiple audiences.
5. `exp` is in the future. `iat` and `nbf` are sane. Allow ~60s clock skew.
6. `nonce` matches what you sent.
7. Optionally `at_hash` matches the hash of the access token (if you have one).

Use a vetted library — `jose` (Node), `python-jose` or `authlib` (Python), `go-jose` (Go), `jjwt` or `nimbus-jose-jwt` (JVM). Don't write JWT verification by hand; the historical CVE list is long.

### Refresh tokens

OAuth 2.1 binds refresh-token semantics tightly: *"If refresh tokens are issued, those refresh tokens MUST be bound to the scope and resource servers as consented by the resource owner."* ([oauth-2-1])

Best-current-practice rotation:

- Each `/token` exchange that uses a refresh token issues a **new** refresh token AND invalidates the old one.
- The IdP keeps a chain — if a refresh token is reused after being rotated, the IdP suspects theft and revokes the entire chain.
- Refresh tokens live in the BFF's session store, NOT the browser.

If you can't rotate (limited IdP), at minimum apply a sliding session window.

### Migration off deprecated flows

If you find code using:

- **Implicit grant** (`response_type=token` or `response_type=id_token token`) → migrate to **authcode + PKCE**. ([oauth-2-1])
- **ROPC** (sending username + password to `/token`) → there is no drop-in replacement; you need a real authentication UI on the IdP.

Sequence the migration: (1) add the new flow alongside the old, (2) move clients over, (3) revoke the old flow at the IdP. Don't yank it in a single deploy.

### Client credentials

For service-to-service:

```http
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=orders:read
Authorization: Basic <base64(client_id:client_secret)>
```

Prefer `client_assertion` (signed JWT) or mTLS over `client_secret` for production: rotated client secrets are a moving target; mTLS-bound credentials are tied to a key you can keep in HSM/KMS.

## Anti-patterns

### Tokens in localStorage

**Symptom:** XSS leads to token exfiltration; attackers impersonate users.
**Diagnosis:** Storing access or refresh tokens in `localStorage` makes them readable from any same-origin script.
**Fix:** BFF + HttpOnly cookies. The browser-based-apps BCP discourages browser-side token storage entirely. ([browser-based-apps])

### Skipping state validation

**Symptom:** CSRF on the redirect — an attacker links the user's browser to their own provider login, the user lands authenticated as the attacker.
**Diagnosis:** Redirect handler accepts the `code` without validating `state` matches a session-bound value.
**Fix:** Always generate `state`, store it server-side bound to the pre-login session, and reject callbacks where it doesn't match.

### Treating the access token as a user identity

**Symptom:** App reads `sub` from the access token to identify the user.
**Diagnosis:** Access tokens are for resource servers, not for the client to introspect identity. The IdP makes no API guarantee about the access-token format.
**Fix:** Identify users from the **ID token** (OIDC). Pass access tokens to APIs without parsing them.

### Loose `redirect_uri` matching

**Symptom:** `redirect_uri=https://app.example.com/callback?next=//evil.com` ends up redirecting the auth code to an attacker.
**Diagnosis:** Matching only the prefix or hostname, not the full URI.
**Fix:** Exact match. OAuth 2.1 requires it: *"Authorization servers MUST reject authorization requests that specify a redirect URI that doesn't exactly match one that was registered."* ([oauth-2-1])

### One refresh token forever

**Symptom:** A leaked refresh token works for months; theft has no detection signal.
**Diagnosis:** No rotation; no chain.
**Fix:** Rotate on each exchange. The IdP detects reused-after-rotation and revokes the chain.

### Custom JWT verification

**Symptom:** Token forgery via algorithm confusion (`alg=none`, RS256→HS256 swap), signature stripping.
**Diagnosis:** Hand-rolled JWT verification missing one of the historical CVEs.
**Fix:** Use a vetted library. Pin the expected algorithm. Verify all claims (iss, aud, exp, nonce).

### Implicit flow because "it's simpler for SPAs"

**Symptom:** Tokens land in URL fragments and browser history; downgrade attacks possible.
**Diagnosis:** Implicit was deprecated for exactly this reason and is removed in 2.1. ([oauth-2-1])
**Fix:** Authorization code + PKCE (browser) or BFF (best).

### Storing the IdP's public key, not its JWKS endpoint

**Symptom:** Token validation breaks during scheduled IdP key rotation.
**Diagnosis:** Hardcoded the public key.
**Fix:** Fetch from `/.well-known/jwks.json` at startup; cache with a TTL; refetch on `kid` mismatch.

## Quality gates

- [ ] **Test:** end-to-end login flow works against a real IdP (or `mockoidc`) in CI; assert `state` is checked and `nonce` is checked.
- [ ] **Test:** ID-token validator rejects tokens with: wrong `iss`, wrong `aud`, expired `exp`, mismatched `nonce`, `alg=none`, signature swap.
- [ ] **Test:** unauthenticated user trying to access a protected endpoint receives 401 (not 500, not blank 200).
- [ ] PKCE is on for every authorization code flow (no exceptions). ([oauth-2-1])
- [ ] Implicit grant and ROPC are not present in the codebase. CI grep fails on `response_type=token`. ([oauth-2-1])
- [ ] Browser app uses BFF or token-mediating-backend; no access tokens in `localStorage`. ([browser-based-apps])
- [ ] Session cookie is `HttpOnly; Secure; SameSite=Lax` (or `Strict`); cookie attributes asserted in an integration test.
- [ ] `redirect_uri` is exactly registered; no wildcards or prefix matching.
- [ ] ID-token validation uses a vetted JWT library; algorithm pinned (`RS256` or `EdDSA`); `alg` is checked, not just trusted.
- [ ] Refresh tokens (if used) are stored server-side and rotated on each exchange.
- [ ] JWKS fetched from `/.well-known/jwks.json` with TTL cache; key rotation handled.
- [ ] OTel span around token exchange with `oauth.client_id`, `oauth.flow`, `oauth.outcome` (see `opentelemetry-instrumentation`).
- [ ] Clock-skew tolerance ≤ 60s for `exp`/`iat`/`nbf`.

## NOT for

- **SAML / WS-Federation** — different protocol family. No dedicated skill yet.
- **Building an authorization server from scratch** — use Keycloak / Auth0 / Okta / WorkOS / Cognito. The spec doesn't tell you how to operate token revocation, key rotation, fraud signals, etc.
- **Passwordless / passkeys / WebAuthn** — adjacent. No dedicated skill yet.
- **Session-cookie auth without an IdP** — different problem; OAuth doesn't apply.
- **Per-request signature schemes** (HTTP message signatures, RFC 9421) — different layer.
- **Rate limiting the auth endpoints** — → `rate-limiting-strategy`.
- **CSRF beyond the OAuth redirect** — → `content-security-policy-headers` and a dedicated CSRF skill (none yet).

## Sources

- IETF — *The OAuth 2.1 Authorization Framework* (`draft-ietf-oauth-v2-1-15`, March 2026): PKCE MUST, exact redirect_uri MUST, implicit + ROPC removed, refresh-token binding. [datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/][oauth-2-1]
- IETF — *OAuth 2.0 for Browser-Based Applications* BCP (`draft-ietf-oauth-browser-based-apps-26`): BFF > token-mediating > pure-SPA, HttpOnly + Secure cookie MUSTs, localStorage discouraged. [datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/][browser-based-apps]
- Auth0 — *Demystifying OAuth Security: State vs. Nonce vs. PKCE*. [auth0.com/blog/demystifying-oauth-security-state-vs-nonce-vs-pkce/][auth0-state-nonce]
- Auth0 docs — *Prevent Attacks and Redirect Users with OAuth 2.0 State Parameters*. [auth0.com/docs/secure/attack-protection/state-parameters][auth0-state-docs]
- PortSwigger — *OAuth 2.0 authentication vulnerabilities* (anti-pattern catalog). [portswigger.net/web-security/oauth][portswigger-oauth]

[oauth-2-1]: https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/
[browser-based-apps]: https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/
[auth0-state-nonce]: https://auth0.com/blog/demystifying-oauth-security-state-vs-nonce-vs-pkce/
[auth0-state-docs]: https://auth0.com/docs/secure/attack-protection/state-parameters
[portswigger-oauth]: https://portswigger.net/web-security/oauth
