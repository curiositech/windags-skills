---
license: Apache-2.0
name: terraform-iac-expert
version: 1.0.0
category: DevOps & Infrastructure
tags:
  - terraform
  - iac
  - infrastructure
  - aws
  - gcp
  - azure
  - opentofu
---

# Terraform IaC Expert

## Overview

Expert in Infrastructure as Code using Terraform and OpenTofu. Specializes in module design, state management, multi-cloud deployments, and CI/CD integration. Handles complex infrastructure patterns including multi-environment setups, remote state backends, and secure secrets management.

## Decision Points

### When to Migrate State vs Full Rebuild
```
Resource Change Assessment:
├── Breaking changes to core resources (VPC, networks)?
│   ├── Yes → Full rebuild with blue-green deployment
│   └── No → Continue to state migration assessment
├── State file corruption or drift > 20% resources?
│   ├── Yes → Import strategy: selective rebuild of drifted resources
│   └── No → Standard state migration
├── Cost of downtime > $10k/hour?
│   ├── Yes → Blue-green with gradual migration
│   └── No → Direct migration with maintenance window
└── Team expertise level?
    ├── Junior → Use Terraform Cloud migration tools
    └── Senior → Manual state manipulation acceptable
```

### Module vs Inline Resource Decision
```
Resource Complexity:
├── Will this pattern be used > 2 times?
│   ├── Yes → Create module
│   └── No → Continue evaluation
├── Configuration > 50 lines?
│   ├── Yes → Module for maintainability
│   └── No → Inline acceptable
├── Needs input validation?
│   ├── Yes → Module with validation blocks
│   └── No → Can remain inline
└── Cross-team sharing required?
    ├── Yes → Published module with versioning
    └── No → Local module sufficient
```

### Environment Strategy Selection
```
Team Size & Structure:
├── < 5 engineers, single team?
│   ├── Yes → Workspace-based environments
│   └── No → Continue evaluation
├── Multiple teams, shared infrastructure?
│   ├── Yes → Directory-based with remote state sharing
│   └── No → Hybrid approach
├── Need environment-specific backends?
│   ├── Yes → Directory-based mandatory
│   └── No → Workspaces viable
└── Complex promotion workflows?
    ├── Yes → Terragrunt with directory structure
    └── No → Native Terraform sufficient
```

## Failure Modes

### State Corruption Spiral
**Symptoms:** "Error acquiring the state lock", terraform refresh shows massive drift, apply fails with "resource already exists"
**Root Cause:** Concurrent operations without proper locking or force-unlock used incorrectly
**Fix:** 
1. Verify no concurrent operations: `terraform force-unlock LOCK_ID`
2. Compare state with reality: `terraform refresh`  
3. Import missing resources: `terraform import resource.name existing_id`
4. Remove phantom resources: `terraform state rm resource.phantom`

### Schema Version Drift
**Symptoms:** "provider registry.terraform.io/hashicorp/aws: required_version" errors, resources show perpetual changes in plan
**Root Cause:** Team members using different provider versions or Terraform versions
**Fix:**
1. Pin provider versions in terraform block: `version = "~> 5.0"`
2. Use .terraform-version file for tfenv
3. Run terraform init -upgrade on all environments
4. Update state schema: `terraform state replace-provider`

### Module Input Explosion
**Symptoms:** Module has >20 input variables, complex nested object variables, frequent "unsupported attribute" errors
**Root Cause:** Over-abstracting modules trying to handle every use case
**Fix:**
1. Split into focused modules (max 15 variables each)
2. Use sensible defaults with variable validation
3. Create specialized modules vs generic ones
4. Use locals block for complex transformations

### Remote State Reference Loops
**Symptoms:** "Cycle" errors during plan, "depends_on contains dependencies that cannot be determined before apply"
**Root Cause:** Circular dependencies between state files or environments
**Fix:**
1. Map dependency graph on paper first
2. Extract shared resources to separate state file
3. Use data sources instead of remote state when possible
4. Implement dependency inversion (shared->env specific)

### Secrets Leakage Through State
**Symptoms:** Sensitive values visible in terraform.tfstate, state file contains passwords/keys in plaintext
**Root Cause:** Not marking outputs as sensitive, storing secrets in variables instead of data sources
**Fix:**
1. Mark all sensitive outputs: `sensitive = true`
2. Use data sources for secrets: `data "aws_secretsmanager_secret"`
3. Enable state file encryption at rest
4. Rotate any exposed secrets immediately

## Worked Examples

### Complete Infrastructure Migration from Existing AWS Resources

**Scenario:** Migrating manually-created production AWS infrastructure (VPC, EKS cluster, RDS) to Terraform management.

**Step 1 - Assessment and Planning**
```bash
# Discover existing resources
aws ec2 describe-vpcs --filters "Name=tag:Environment,Values=prod"
aws eks describe-cluster --name prod-cluster
aws rds describe-db-instances --db-instance-identifier prod-db
```

Expert catches: Check for dependencies between resources, identify non-standard configurations that need special handling.
Novice misses: Not documenting existing resource relationships before starting.

**Step 2 - State Structure Decision**
Following decision tree → Multiple teams + shared infrastructure = Directory-based approach
```
terraform/
├── shared/          # VPC, networking
├── data/            # RDS, ElastiCache  
├── compute/         # EKS cluster
└── applications/    # App-specific resources
```

**Step 3 - Import Strategy**
```bash
# Start with shared infrastructure (VPC first)
cd terraform/shared
terraform import aws_vpc.main vpc-12345678
terraform import aws_subnet.private[0] subnet-abcd1234
terraform import aws_subnet.private[1] subnet-efgh5678

# Generate configuration to match
terraform show -json | jq '.values.root_module.resources[] | select(.type=="aws_vpc")'
```

Expert catches: Import in dependency order (VPC → subnets → route tables → gateways).
Novice misses: Importing resources in wrong order causing dependency conflicts.

**Step 4 - Validation and Safety Gates**
```bash
# Verify no changes after import
terraform plan  # Should show "No changes"

# Test in non-prod first
cd ../terraform/shared-staging
terraform plan -var-file=staging.tfvars
```

## Quality Gates

- [ ] terraform plan shows zero changes after import/migration
- [ ] All sensitive outputs marked with `sensitive = true`
- [ ] Provider versions pinned with `~>` constraints (not `>=`)
- [ ] Remote state backend configured with encryption and locking
- [ ] terraform validate passes on all modules
- [ ] No hardcoded values (all environment differences in variables)
- [ ] Cost estimation reviewed (>$1000/month needs approval)
- [ ] Security scan passed (checkov/tfsec/terrascan)
- [ ] Backup of existing infrastructure state/config completed
- [ ] Rollback plan documented and tested in staging

## NOT-FOR Boundaries

**This skill should NOT be used for:**
- **Application deployment** → Use `kubernetes-orchestrator` or `docker-specialist` instead
- **Application code building** → Use `github-actions-pipeline-builder` instead  
- **Container orchestration** → Use `kubernetes-orchestrator` instead
- **Database schema management** → Use `database-architect` instead
- **SSL certificate management** → Use `site-reliability-engineer` instead

**Delegate to other skills when:**
- Need application-level monitoring → `site-reliability-engineer`
- Need Kubernetes manifest generation → `kubernetes-orchestrator`  
- Need cloud cost optimization strategies → `aws-solutions-architect`
- Need security policy implementation → `security-specialist`