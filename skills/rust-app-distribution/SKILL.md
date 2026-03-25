---
license: Apache-2.0
name: rust-app-distribution
description: 'Distribution pipeline for signed Rust desktop applications -- code signing, notarization, auto-updates, and package manager distribution. Activate on: code signing, macOS notarization, Apple Developer, Authenticode, Windows signing, auto-updater, Homebrew formula, winget manifest, Scoop bucket, Tauri updater, app distribution, release pipeline. NOT for: library crate publishing (use crates.io docs), web deployment (use devops-automator).'
allowed-tools: Read,Write,Edit,Bash(cargo:*,npm:*,npx:*,gh:*,security:*,codesign:*,xcrun:*),Glob,Grep
metadata:
  category: Desktop & Native
  tags:
    - code-signing
    - notarization
    - distribution
    - auto-updater
    - homebrew
    - winget
    - release-pipeline
  pairs-with:
    - skill: rust-tauri-development
      reason: Tauri apps need signing and distribution
    - skill: cross-platform-desktop
      reason: Platform-specific installer and signing requirements
    - skill: devops-automator
      reason: CI/CD infrastructure for automated builds and releases
category: Backend & Infrastructure
tags:
  - rust
  - distribution
  - packaging
  - binary
  - deployment
---

# Rust App Distribution

Ship signed Rust desktop applications to users on macOS and Windows. This skill covers the full distribution pipeline: code signing certificates, Apple notarization, Windows Authenticode, auto-updater mechanisms, and publishing to package managers (Homebrew, winget, Scoop).

## Decision Points

### Certificate Selection Decision Tree

**IF** macOS distribution needed:
- → **THEN** Apple Developer Program required ($99/year)
- → Generate Developer ID Application cert (automatic with membership)
- → For installers: also generate Developer ID Installer cert

**IF** Windows distribution AND budget < $50/month:
- → **THEN** use EV certificate from DigiCert/Sectigo ($300-500/year)
- → Store on hardware HSM or Azure Key Vault
- → **ELSE IF** US/Canada business with 3+ years history:
  - → Use Azure Trusted Signing ($9.99/month)
  - → Faster setup, cloud-based HSM

**IF** CI platform is GitHub Actions:
- → **THEN** use tauri-action for automated builds
- → Store certs in GitHub Secrets
- → **ELSE IF** CI platform is Azure DevOps:
  - → Use Azure Trusted Signing integration
  - → Store Apple certs in Azure Key Vault

### Auto-Updater Implementation Decision

**IF** simple GitHub-hosted releases:
- → **THEN** use Tauri updater with GitHub releases endpoint
- → Generate signing keys: `cargo tauri signer generate`
- → Point to: `https://github.com/ORG/REPO/releases/latest/download/latest.json`

**IF** custom release infrastructure needed:
- → **THEN** implement custom update endpoint
- → Return JSON with version/signature/download URLs
- → Use CDN for binary hosting

**IF** enterprise deployment with restricted internet:
- → **THEN** implement internal update server
- → Mirror updates behind corporate firewall
- → Use same Tauri updater JSON format

### Package Manager Distribution Decision

**IF** macOS users AND want simple install:
- → **THEN** create Homebrew tap
- → Generate formula with `komac` or manually
- → Automate SHA256 updates in CI

**IF** Windows users AND mainstream distribution:
- → **THEN** submit to winget
- → Use `komac` for manifest generation
- → Submit PR to microsoft/winget-pkgs

**IF** Windows power users OR faster approval:
- → **THEN** create Scoop bucket
- → JSON manifests simpler than winget
- → Faster than winget review process

## Failure Modes

### Notarization Rejection ("Invalid Entitlements")

**Detection rule**: `xcrun notarytool` returns "The entitlements in the app are invalid" or similar entitlement errors.

**Symptom**: Notarization fails despite valid signing.

**Diagnosis**: 
- App requests entitlements not available to Developer ID
- Hardened runtime flags conflict with entitlements
- Using entitlements meant for Mac App Store

**Fix**:
```bash
# Check current entitlements
codesign -d --entitlements - MyApp.app

# Remove Mac App Store entitlements, keep only:
# - com.apple.security.cs.allow-jit (if needed)
# - com.apple.security.cs.allow-unsigned-executable-memory (if needed)
# - com.apple.security.cs.disable-library-validation (if needed)
# - com.apple.security.network.client (for network access)
```

### SmartScreen Reputation Warning ("Publisher Unknown")

**Detection rule**: Windows users report "Windows protected your PC" even with valid EV certificate.

**Symptom**: Valid signature but SmartScreen still warns about unknown publisher.

**Diagnosis**: 
- New certificate without established reputation
- Low download volume (< 1000 downloads)
- Binary not seen by enough Windows Defender users

**Fix**:
1. **Immediate**: Add certificate to Microsoft's reputation system via Partner Center
2. **Long-term**: Accumulate downloads and user reports
3. **Workaround**: Submit binary to Microsoft for manual review
4. **Alternative**: Use extended validation (EV) certificate for faster trust

### Auto-Updater Signature Mismatch

**Detection rule**: Update check succeeds but installation fails with signature verification error.

**Symptom**: App downloads update but refuses to install.

**Diagnosis**:
- Update manifest signed with different key than expected
- Manifest JSON malformed or missing signature field
- Binary tampered with during upload

**Fix**:
```bash
# Verify signature manually
cargo tauri signer verify \
  --public-key-path ~/.tauri/myapp.pub \
  --signature-path release.sig \
  --file MyApp-setup.exe

# Check manifest format
curl -s https://releases.myapp.com/latest.json | jq .

# Re-sign update if signature invalid
cargo tauri signer sign \
  --private-key-path ~/.tauri/myapp.key \
  --file MyApp-setup.exe
```

### Build Pipeline Certificate Expiry

**Detection rule**: CI builds start failing with "certificate not found" or "certificate expired" errors.

**Symptom**: Previously working builds suddenly fail during signing step.

**Diagnosis**:
- Apple Developer ID certificate expired (1 year validity)
- Windows EV certificate expired
- Apple app-specific password revoked

**Fix**:
1. **Apple**: Renew certificate in Apple Developer portal, export new .p12
2. **Windows**: Renew EV certificate with provider, update KeyVault
3. **Update secrets**: Replace base64-encoded certificates in CI secrets
4. **Test**: Run manual build to verify new certificates work

### Cross-Platform Binary Mismatch

**Detection rule**: Package manager users report "architecture not supported" or binary won't launch.

**Symptom**: Installer downloads but app won't run on user's architecture.

**Diagnosis**:
- Built x86_64 binary but user has ARM64 machine
- Universal binary not actually universal
- Wrong target specified in CI matrix

**Fix**:
```yaml
# Ensure complete architecture matrix
strategy:
  matrix:
    include:
      - os: macos-latest
        target: aarch64-apple-darwin
      - os: macos-13  # Intel runner
        target: x86_64-apple-darwin
      - os: windows-latest
        target: x86_64-pc-windows-msvc

# Verify binary architecture
file target/release/myapp  # Should show correct arch
lipo -info target/release/myapp  # macOS universal binary check
```

## Worked Examples

### Complete Release Pipeline Setup

**Scenario**: Setting up automated releases for a Tauri app "DevTools" that needs macOS and Windows distribution.

**Step 1 - Certificate Setup**:
```bash
# Generate Apple Developer ID (via Apple Developer portal)
# Download .p12 file, encode for CI:
base64 -i ~/Downloads/certificates.p12 -o apple_cert.txt

# For Windows - setup Azure Trusted Signing:
# 1. Create account at codesigning.azure.net
# 2. Create certificate profile "production"
# 3. Note tenant ID, client ID, account name
```

**Expert catches**: Novices often skip the app-specific password step or try to use their Apple ID password directly. Expert immediately generates app-specific password at appleid.apple.com.

**Step 2 - Auto-Updater Keys**:
```bash
# Generate signing keypair
cargo tauri signer generate -w ~/.tauri/devtools.key

# Output shows:
# Private key: ~/.tauri/devtools.key (keep secret!)
# Public key: dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWdu... (embed in app)
```

**Expert catches**: The public key goes in `tauri.conf.json` under `plugins.updater.pubkey`, NOT as a file. Novices often try to reference a pubkey file path.

**Step 3 - CI Configuration**:
```yaml
name: Release
on:
  push:
    tags: ["v*"]

jobs:
  build:
    strategy:
      matrix:
        include:
          - os: macos-latest
            target: aarch64-apple-darwin
          - os: windows-latest
            target: x86_64-pc-windows-msvc
    runs-on: ${{ matrix.os }}
    steps:
      - uses: tauri-apps/tauri-action@v0
        env:
          # Apple secrets
          APPLE_SIGNING_IDENTITY: ${{ secrets.APPLE_SIGNING_IDENTITY }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_APP_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
          # Windows secrets  
          AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
          # Update signing
          TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
        with:
          tagName: v__VERSION__
          releaseName: "DevTools v__VERSION__"
```

**Expert catches**: The `APPLE_SIGNING_IDENTITY` must match the certificate name exactly, including the team ID in parentheses. Novices often forget the team ID or get the format wrong.

**Decision point navigated**: Since this is a GitHub Actions setup with Windows distribution, expert chose Azure Trusted Signing over EV certificate for cost and simplicity. For a GitLab CI setup, would have chosen traditional EV cert.

**Step 4 - Testing Update Flow**:
```typescript
// In the app frontend
import { check } from "@tauri-apps/plugin-updater";

async function testUpdate() {
  console.log("Checking for updates...");
  const update = await check();
  
  if (update) {
    console.log(`Found update: ${update.version}`);
    // Expert validates signature is checked automatically by Tauri
    await update.downloadAndInstall();
  }
}
```

**Expert catches**: The updater automatically validates signatures using the embedded public key. Novices often try to add manual signature verification, which is redundant and error-prone.

## Quality Gates

**Pre-release validation checklist:**

- [ ] macOS app signed with Developer ID Application certificate (verify: `codesign -dv MyApp.app`)
- [ ] macOS app notarization completed and ticket stapled (verify: `spctl --assess --type exec -v MyApp.app`)
- [ ] Windows executable signed with EV or Azure Trusted Signing (verify: `signtool verify /pa MyApp.exe`)
- [ ] SmartScreen reputation check passed (test on clean Windows VM)
- [ ] Auto-updater endpoint returns valid JSON with correct signatures
- [ ] Update signing keys generated and private key secured in CI secrets
- [ ] All target architectures built and tested (x86_64, aarch64 for macOS)
- [ ] Package manager manifests updated with correct SHA256 hashes
- [ ] Release artifacts uploaded to GitHub releases with proper naming
- [ ] CI pipeline completes without certificate warnings or errors
- [ ] Rollback test: previous version can still check for and install updates
- [ ] Offline test: notarized macOS app launches without internet connection

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **Library crate publishing** → Use `cargo publish` and crates.io documentation instead
- **Web application deployment** → Use `devops-automator` skill for containerized deployment
- **Mobile app distribution** → Use platform-specific mobile deployment skills (iOS App Store, Google Play)
- **Internal enterprise distribution without signing** → This skill assumes public distribution requiring code signing
- **Building the application itself** → Use `rust-tauri-development` skill for app development and local building
- **Backend service deployment** → Use infrastructure deployment skills for server applications
- **Cross-compilation troubleshooting** → Use native runners; cross-compilation not recommended for desktop apps with platform-specific dependencies

**Delegate to other skills:**
- For CI/CD infrastructure setup → `devops-automator`
- For Tauri app development → `rust-tauri-development` 
- For cross-platform desktop architecture → `cross-platform-desktop`