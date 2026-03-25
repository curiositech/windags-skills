---
license: Apache-2.0
name: oauth-oidc-implementer
version: 1.0.0
category: Security
tags:
  - oauth
  - oidc
  - authentication
  - authorization
  - jwt
  - security
---

# OAuth/OIDC Implementer

Expert in implementing OAuth 2.0 and OpenID Connect (OIDC) authentication flows. Specializes in secure token handling, social login integration, API authorization, and identity provider configuration.

## Decision Points

### Flow Selection Matrix

**For Web Applications (with backend):**
- If frontend + backend architecture → Authorization Code flow with client_secret
- If SPA (React/Vue) only → Authorization Code + PKCE (no client_secret)
- If mobile app → Authorization Code + PKCE + custom URI scheme

**For API Access:**
- If service-to-service authentication → Client Credentials flow
- If user delegation required → Authorization Code flow with offline_access scope
- If device has no browser (IoT/CLI) → Device Authorization flow

**For Enterprise SSO:**
- If SAML existing infrastructure → OIDC bridge or native SAML
- If modern identity provider → OIDC Authorization Code flow
- If legacy systems involved → Federation with protocol translation

### Token Storage Decision Tree

**Access Tokens:**
- If server-side rendering → httpOnly cookie with SameSite=Lax
- If SPA with API calls → memory only, refresh on page load
- If mobile app → secure keychain/keystore

**Refresh Tokens:**
- Always httpOnly cookie for web apps (never localStorage)
- Secure storage for mobile apps
- Never expose to client JavaScript

## Failure Modes

### Invalid Grant Error
**Detection:** Error response contains `"error": "invalid_grant"`
**Root Cause:** Authorization code expired (>10min) or PKCE verifier mismatch
**Fix:** Implement proper code exchange timing and verify PKCE generation/storage

### Token Expired Syndrome
**Detection:** API returns 401 with expired token, no automatic retry
**Root Cause:** Missing token refresh logic or refresh token rotation failure
**Fix:** Implement automatic refresh with race condition handling and fallback to login

### State Mismatch Vulnerability
**Detection:** OAuth callback validation fails with state parameter errors
**Root Cause:** State not properly stored/validated or CSRF attack in progress
**Fix:** Verify state generation uses cryptographically secure randomness and server-side validation

### Scope Creep Anti-pattern
**Detection:** Requesting excessive scopes (`scope=*` or kitchen-sink permissions)
**Root Cause:** Over-requesting permissions instead of minimal viable scopes
**Fix:** Request only needed scopes initially, use incremental authorization for additional permissions

### Silent Login Loop
**Detection:** Infinite redirects between app and identity provider
**Root Cause:** Session state mismatch or malformed logout implementation
**Fix:** Implement proper session cleanup and logout flow with back-channel notification

## Worked Example: SPA Social Login Implementation

**Scenario:** React app implementing "Login with Google" using Authorization Code + PKCE

**Step 1: Initialize Flow**
```typescript
// Expert catches: PKCE generation must be cryptographically secure
const codeVerifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
const codeChallenge = base64URLEncode(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier)));

// Novice misses: State must be stored server-side to prevent tampering
const state = crypto.randomUUID();
sessionStorage.setItem('oauth_state', state);
sessionStorage.setItem('pkce_verifier', codeVerifier);
```

**Step 2: Decision Point Navigation**
- **Flow chosen:** Authorization Code + PKCE (SPA detected)
- **Storage strategy:** sessionStorage for temporary values (PKCE verifier, state)
- **Scope minimal:** `openid profile email` only

**Step 3: Handle Callback**
```typescript
// Expert validates: State MUST match exactly
if (urlState !== sessionStorage.getItem('oauth_state')) {
  throw new Error('CSRF protection failed');
}

// Novice misses: Code verifier must be included in token exchange
const tokenRequest = {
  grant_type: 'authorization_code',
  code: authCode,
  code_verifier: sessionStorage.getItem('pkce_verifier'),
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI
};
```

**Step 4: Token Handling**
- **Expert approach:** Store access token in memory, implement refresh pattern
- **Novice mistake:** Storing refresh token in localStorage (security vulnerability)
- **Correct implementation:** Access token expires in 1 hour, automatic refresh before expiry

## Quality Gates

Implementation checklist for production readiness:

- [ ] State parameter validated on callback (CSRF protection verified)
- [ ] PKCE code verifier uses crypto.getRandomValues() (not Math.random)
- [ ] Refresh tokens stored in httpOnly cookies (never accessible to JavaScript)
- [ ] Token expiry handled with automatic refresh and fallback to login
- [ ] Logout flow tested with token revocation and session cleanup
- [ ] JWT signature validation implemented using provider's JWKS endpoint
- [ ] Scope requests follow principle of least privilege
- [ ] Error handling covers network failures and invalid_grant scenarios
- [ ] Race conditions prevented in concurrent token refresh requests
- [ ] Production uses HTTPS for all OAuth endpoints and redirects

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Session-based authentication** → Use traditional cookie sessions instead
- **API key management** → Use `api-security-specialist` for static API keys
- **Password hashing/storage** → Use `authentication-specialist` for credential handling
- **SAML implementation** → Use `enterprise-sso-architect` for SAML-specific flows
- **Custom JWT creation** → Use `jwt-specialist` for application-specific token generation

**Delegate to other skills:**
- Certificate management → `tls-certificate-manager`
- Database user storage → `database-architect`
- Rate limiting auth endpoints → `api-rate-limiter`
- Security monitoring → `security-monitoring-specialist`