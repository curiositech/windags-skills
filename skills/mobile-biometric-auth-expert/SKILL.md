---
license: Apache-2.0
name: mobile-biometric-auth-expert
description: "Mobile biometric authentication expert for Face ID, Touch ID, BiometricPrompt, Keychain/Keystore, and WebAuthn. Activate on: biometric authentication, Face ID, Touch ID, BiometricPrompt, Keychain, Keystore, WebAuthn, passkeys, FIDO2, device authentication. NOT for: OAuth/OIDC flows (use oauth-oidc-implementer), secret management (use secret-management-expert), general security (use security-auditor)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - biometric
  - authentication
  - security
  - mobile
pairs-with:
  - skill: oauth-oidc-implementer
    reason: Biometric auth often gates access to OAuth tokens stored in secure storage
  - skill: mobile-payment-integration-specialist
    reason: Payments require biometric confirmation for high-value transactions
---

# Mobile Biometric Auth Expert

Expert in implementing biometric authentication with Face ID, Touch ID, Android BiometricPrompt, secure credential storage, and Passkeys/WebAuthn.

## Decision Points

**Biometric Availability Check:**
```
If biometric hardware available AND enrolled:
  → Offer biometric as primary auth
If biometric hardware available BUT not enrolled:
  → Show enrollment prompt + fallback to password
If biometric hardware unavailable:
  → Use password/PIN only, hide biometric UI

Special cases:
- If user declined biometric permission: Store preference, don't re-prompt
- If biometric lockout (too many failures): Force device PIN, then re-enable
```

**Authentication Flow Selection:**
```
If first login on device:
  → Password auth → store token in secure storage → enable biometric gate
If returning user with stored credential:
  → Biometric prompt → decrypt stored token → validate/refresh if needed
If biometric prompt times out (>30s):
  → Show "Use Password" option → device PIN fallback
If biometric enrollment changed:
  → Invalidate stored credentials → require re-authentication
```

**Storage Strategy:**
```
If iOS:
  → Keychain with kSecAccessControlBiometryCurrentSet
If Android API 23+:
  → Keystore with setUserAuthenticationRequired(true)
If cross-platform framework:
  → Expo SecureStore or RN Keychain with biometric access control
```

**Passkey vs Biometric-Gated Token:**
```
If WebAuthn/Passkey supported AND user has existing account:
  → Offer passkey upgrade (future-proof, no token storage)
If new user registration:
  → Default to passkey flow, fallback to biometric-gated tokens
If enterprise/MDM environment:
  → Check policy for passkey allowlist before offering
```

## Failure Modes

**Rubber Stamp Biometric** - Using biometric UI without secure storage
- *Detection:* Biometric success doesn't gate any Keychain/Keystore operations
- *Diagnosis:* Auth token stored in plain SharedPreferences/UserDefaults
- *Fix:* Move token to Keychain (iOS) or Keystore (Android) with biometric access control

**Enrollment Invalidation Blind Spot** - Ignoring biometric enrollment changes
- *Detection:* Old stored credentials work after user adds new fingerprint/face
- *Diagnosis:* Using kSecAccessControlBiometryAny instead of kSecAccessControlBiometryCurrentSet
- *Fix:* Configure invalidation on enrollment change, handle re-authentication gracefully

**Fallback Chain Break** - No recovery path when biometrics fail
- *Detection:* User stuck on biometric prompt with no "Use Password" option
- *Diagnosis:* Missing device credential fallback in BiometricPrompt configuration
- *Fix:* Add DEVICE_CREDENTIAL to allowed authenticators, implement password login

**Prompt Fatigue** - Biometric prompts for low-value actions
- *Detection:* Biometric prompt shows for non-sensitive screens (settings, help)
- *Diagnosis:* Over-eager biometric gating without UX consideration
- *Fix:* Gate only login, payments, and sensitive data access

**Custom UI Trust Gap** - Building custom biometric interfaces
- *Detection:* Custom fingerprint/face scanning animations instead of system prompt
- *Diagnosis:* Attempting to replicate system biometric UI
- *Fix:* Use BiometricPrompt (Android) or LAContext (iOS) exclusively

## Worked Examples

**Passkey Implementation with Biometric Fallback:**

```swift
// 1. Check WebAuthn support
guard ASAuthorizationPlatformPublicKeyCredentialProvider.isSupported else {
    // Fall back to biometric-gated token storage
    return authenticateWithStoredToken()
}

// 2. Create passkey request
let challenge = Data("server-challenge".utf8)
let request = ASAuthorizationPlatformPublicKeyCredentialProvider
    .createCredentialRegistrationRequest(
        challenge: challenge,
        name: "user@example.com",
        userID: Data("user-123".utf8)
    )

// 3. Handle success/failure
func authorizationController(controller: ASAuthorizationController, 
                           didCompleteWithAuthorization authorization: ASAuthorization) {
    if let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialRegistration {
        // Passkey created - store credential ID, send public key to server
        storeCredentialID(credential.credentialID)
        sendPublicKeyToServer(credential.rawAttestationObject)
    }
}

// 4. Graceful degradation
func authorizationController(controller: ASAuthorizationController, 
                           didCompleteWithError error: Error) {
    if case ASAuthorizationError.canceled = error {
        // User canceled - offer biometric-gated password login
        showBiometricPasswordFallback()
    }
}
```

**Trade-offs navigated:**
- Expert caught: Passkey requires user gesture, can't auto-trigger on app launch
- Novice missed: Need credential ID storage for future authentication requests
- UX friction: Passkey setup vs immediate biometric access (setup once vs authenticate always)
- Security gain: Phishing-resistant, no stored secrets vs biometric-gated token storage

## Quality Gates

- [ ] Tested on iOS 14+ with Face ID/Touch ID enabled and disabled
- [ ] Tested on Android 9+ with fingerprint/face unlock enabled and disabled  
- [ ] Biometric prompt shows system UI, not custom animations
- [ ] Device PIN/password fallback verified when biometric fails 3+ times
- [ ] Keychain (iOS) or Keystore (Android) access control validated with security flags
- [ ] Rate limiting enforced: max 5 biometric attempts per 5-minute window
- [ ] Biometric enrollment change invalidates stored credentials automatically
- [ ] Passkey/WebAuthn flow tested with successful registration and authentication
- [ ] Error messages are user-friendly: "Face ID not recognized" not "LAError -1"
- [ ] Accessibility tested: VoiceOver announces biometric prompt status
- [ ] App backgrounding/foregrounding doesn't bypass biometric requirement
- [ ] Network timeout during auth shows clear retry/offline options

## NOT-FOR Boundaries

**Use other skills for:**
- OAuth/OIDC token exchange flows → `oauth-oidc-implementer`
- Server-side JWT validation and refresh → `api-security-expert`
- Hardware security module (HSM) integration → `secret-management-expert`
- PCI compliance for payment flows → `mobile-payment-integration-specialist`
- App-level security audits and penetration testing → `security-auditor`
- Database encryption of user credentials → `database-security-expert`

**This skill handles:** Device-level biometric authentication, secure credential storage, WebAuthn/Passkey implementation, and biometric UX flows only.