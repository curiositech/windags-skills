---
license: Apache-2.0
name: terraform-module-builder
description: "Reusable Terraform module builder for AWS, GCP, and Azure infrastructure. Activate on: Terraform module, reusable IaC, provider configuration, state management, module registry, workspace management. NOT for: Kubernetes manifests (use kubernetes-manifest-generator), AWS CDK (use aws-cdk-builder), application deployment (use devops-automator)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - terraform
  - iac
  - aws
  - cloud
pairs-with:
  - skill: terraform-iac-expert
    reason: General Terraform expertise that modules formalize into reusable units
  - skill: aws-cdk-builder
    reason: Alternative IaC approach for AWS-only shops
---

# Terraform Module Builder

Expert in building composable, tested, and version-controlled Terraform modules for multi-cloud infrastructure.

## Decision Points

### Module Composition Strategy

```
Module Size Decision Tree:
├─ Resource count > 50 OR complexity score > 8?
│  ├─ YES → Split into sub-modules with clear interfaces
│  └─ NO → Continue as single module
├─ Multiple provider types (AWS + GCP + K8s)?
│  ├─ YES → Separate modules per provider
│  └─ NO → Single provider module acceptable
└─ Team size > 15 OR multiple product teams?
   ├─ YES → Create module registry with versioning
   └─ NO → Git submodules or local modules sufficient
```

### State Backend Selection

| Team Size | Maturity | Backend Choice | Lock Mechanism |
|-----------|----------|---------------|----------------|
| 1-3 devs | Startup | Terraform Cloud Free | Built-in |
| 4-10 devs | Growth | S3 + DynamoDB | DynamoDB table |
| 10+ devs | Enterprise | S3 + DynamoDB OR Terraform Cloud Team | DynamoDB + state encryption |
| Regulated | Any size | Self-hosted Consul OR Terraform Enterprise | Consul locks + audit logs |

### Resource Conditional Logic

```
Conditional Resource Decision:
IF environment_specific AND known_at_plan_time
  → Use count = var.enable_feature ? 1 : 0
IF data_driven AND multiple_instances
  → Use for_each with map of configurations
IF complex_branching OR resource_relationships
  → Use dynamic blocks with local values
```

## Failure Modes

### Mega-Module Syndrome
**Symptom:** `terraform plan` takes >30 seconds, module has >50 resources, single file >1000 lines  
**Diagnosis:** Module violates single responsibility principle  
**Fix:** Extract logical boundaries (networking, compute, data) into separate modules with defined interfaces

### Provider Configuration Chaos  
**Symptom:** `Error: provider "aws" was not configured by any provider blocks` in child modules  
**Diagnosis:** Child module declares provider block instead of inheriting from parent  
**Fix:** Remove provider blocks from child modules, add only `required_providers` in versions.tf

### Count Index Brittleness
**Symptom:** Resources recreate when boolean conditions change order: `aws_instance.web[0]` → `aws_instance.web[1]`  
**Diagnosis:** Using `count` with conditional lists instead of `for_each` with stable keys  
**Fix:** Replace `count = length(var.subnets)` with `for_each = toset(var.subnets)`

### State Backend Drift
**Symptom:** "Backend configuration changed" errors, state file conflicts between team members  
**Diagnosis:** Mixing local and remote state, or inconsistent backend configuration  
**Fix:** Standardize on remote backend with locking, use `terraform init -reconfigure`

### Validation Gap Anti-Pattern
**Symptom:** Plan succeeds but apply fails with provider errors like "invalid CIDR" or "region not found"  
**Diagnosis:** Missing input validation allows invalid values to reach provider  
**Fix:** Add validation blocks: `condition = can(cidrhost(var.cidr, 0))`

## Worked Examples

### Conditional RDS Read Replica Decision

**Scenario:** E-commerce module needs optional read replica based on environment and expected load.

**Decision Process:**
1. **Input Analysis:** `var.environment = "prod"`, `var.expected_read_iops = 5000`
2. **Threshold Check:** Read IOPS > 3000 AND environment = prod → Create replica
3. **Cost Consideration:** Replica doubles RDS costs (~$200/month) → Justify for production load

**Implementation Choice:**
```hcl
# Option 1: count (avoid - creates aws_db_instance.replica[0])
resource "aws_db_instance" "replica" {
  count = var.environment == "prod" && var.expected_read_iops > 3000 ? 1 : 0
  # Problem: Index-based addressing, brittle to condition changes
}

# Option 2: for_each (preferred - creates aws_db_instance.replica["primary"])
resource "aws_db_instance" "replica" {
  for_each = var.enable_read_replica ? { primary = var.replica_config } : {}
  # Benefit: Stable resource addressing, easier to extend to multiple replicas
}
```

**Novice Miss:** Using boolean count without considering future extensibility  
**Expert Catch:** Planning for multiple replicas (by region, by workload) using map-based for_each

**Cost Impact:** Production with replica = $400/month vs $200/month single instance

## Quality Gates

- [ ] Module variables.tf has descriptions and validation blocks for all inputs
- [ ] Module outputs.tf exposes all values consumed by dependent modules  
- [ ] versions.tf constrains Terraform version (e.g., >= 1.8) and provider versions
- [ ] examples/complete/ directory demonstrates all module features
- [ ] terraform test or Terratest validates happy path and error conditions
- [ ] README.md auto-generated by terraform-docs with current variable documentation
- [ ] tflint passes with zero warnings on module code
- [ ] checkov security scan shows no HIGH or CRITICAL findings
- [ ] No provider blocks in child modules (only required_providers declarations)
- [ ] Remote state backend configured with locking enabled
- [ ] Module tagged with semantic version (v1.2.3) for dependency management
- [ ] infracost analysis available for cost-sensitive resources (>$50/month)

## NOT-FOR Boundaries

**Do NOT use for:**
- **Kubernetes manifest generation** → Use `kubernetes-manifest-generator` for YAML/Helm
- **AWS CDK projects** → Use `aws-cdk-builder` for TypeScript/Python CDK stacks  
- **Application deployment pipelines** → Use `devops-automator` for CI/CD workflows
- **One-time infrastructure setup** → Use `terraform-iac-expert` for ad-hoc Terraform
- **Configuration management** → Use Ansible/Puppet for server configuration post-provision

**When to delegate:**
- If building Kubernetes operators → `kubernetes-manifest-generator`
- If team prefers imperative code → `aws-cdk-builder`  
- If focusing on deployment automation → `devops-automator`