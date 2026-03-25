---
license: Apache-2.0
name: secret-management-expert
description: 'Secret lifecycle management with Vault, AWS Secrets Manager, and rotation automation. Activate on: secret management, HashiCorp Vault, AWS Secrets Manager, secret rotation, SOPS, sealed secrets, credential management, API key storage, least privilege. NOT for: application auth flows (use oauth-oidc-implementer), network security (use security-auditor), encryption at rest (use devops-automator).'
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Security
tags:
  - secrets
  - security
  - vault
  - compliance
pairs-with:
  - skill: security-auditor
    reason: Broad security audit includes secret management posture
  - skill: environment-config-manager
    reason: Config management must integrate with secret injection
---

# Secret Management Expert

Expert in secret lifecycle management — storage, rotation, injection, and audit — across cloud and self-hosted infrastructure.

## Activation Triggers

**Activate on:** "secret management", "Vault setup", "AWS Secrets Manager", "secret rotation", "SOPS encryption", "sealed secrets", "credential storage", "API key management", "least privilege secrets"

**NOT for:** Application auth flows → `oauth-oidc-implementer` | Network security → `security-auditor` | Encryption at rest → `devops-automator`

## Quick Start

1. **Inventory secrets** — catalog all credentials, API keys, certificates, and tokens
2. **Choose a backend** — Vault for self-hosted, AWS Secrets Manager/GCP Secret Manager for cloud-native
3. **Implement injection** — sidecar (Vault Agent), CSI driver, or init container pattern
4. **Enable rotation** — automated rotation with zero-downtime credential swaps
5. **Audit and alert** — log all secret access, alert on anomalous patterns

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Secret Stores** | HashiCorp Vault 1.18, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault |
| **Encryption** | SOPS 3.9, age, AWS KMS, GCP Cloud KMS, sealed-secrets |
| **K8s Integration** | External Secrets Operator, Vault CSI Provider, Sealed Secrets controller |
| **Rotation** | Vault dynamic secrets, AWS Lambda rotation, custom rotation functions |
| **Audit** | Vault audit log, CloudTrail, access anomaly detection |

## Architecture Patterns

### External Secrets Operator (K8s Best Practice, 2026)

```yaml
# ExternalSecret pulls from AWS Secrets Manager into K8s Secret
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: database-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: db-credentials        # K8s Secret name
    creationPolicy: Owner
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/database/postgres
        property: password
    - secretKey: DB_USERNAME
      remoteRef:
        key: prod/database/postgres
        property: username
```

### Vault Dynamic Secrets (Zero Standing Credentials)

```
App requests credential → Vault generates ephemeral DB credential
  ├─ Credential has TTL (e.g., 1 hour)
  ├─ Vault creates DB user with scoped permissions
  ├─ App uses credential until near expiry
  ├─ Vault Agent auto-renews or rotates
  └─ On expiry: Vault revokes DB user automatically

Result: No long-lived credentials exist. Every credential is:
  - Unique to the requester
  - Time-bounded
  - Automatically revoked
  - Fully audited
```

### SOPS for Git-Encrypted Secrets

```bash
# Encrypt secrets file with age key (developer workflow)
sops --encrypt --age age1... secrets.yaml > secrets.enc.yaml

# Decrypt in CI/CD pipeline
export SOPS_AGE_KEY=$(vault kv get -field=age-key secret/ci/sops)
sops --decrypt secrets.enc.yaml > secrets.yaml

# .sops.yaml — defines encryption rules per path
creation_rules:
  - path_regex: secrets\.yaml$
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
  - path_regex: \.env\..*$
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

## Anti-Patterns

1. **Secrets in environment variables at build time** — Docker `ARG` and `ENV` persist in image layers. Use runtime injection via sidecar, CSI driver, or entrypoint script.
2. **Shared service accounts** — one credential used by multiple services. Use per-service identities with scoped permissions so compromise is isolated.
3. **No rotation** — static credentials that never change. Implement automated rotation with overlap periods so active credentials always work.
4. **Secrets in Git** — even in `.env.example` with placeholder values that get real values committed. Use SOPS, sealed-secrets, or External Secrets Operator. Add `.env*` to `.gitignore`.
5. **Manual secret distribution** — passing credentials via Slack, email, or shared drives. Use a secret store with RBAC and audit logging.

## Quality Checklist

```
[ ] All secrets stored in a dedicated secret store (not config files)
[ ] No secrets in Docker image layers, Git history, or CI logs
[ ] Automated rotation enabled for database credentials
[ ] Secret access logged and auditable (Vault audit, CloudTrail)
[ ] Least privilege: each service has scoped access to only its secrets
[ ] SOPS or sealed-secrets used for any secrets committed to Git
[ ] Dynamic secrets preferred over static credentials
[ ] Secret TTLs set — no indefinite credentials
[ ] Emergency revocation procedure documented and tested
[ ] CI/CD uses short-lived tokens (OIDC federation), not long-lived keys
[ ] Developers cannot access production secrets from local machines
[ ] Secret sprawl inventory maintained and reviewed quarterly
```
