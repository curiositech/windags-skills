---
name: terraform-module-design
description: 'Use when designing Terraform modules for reuse, structuring root vs child modules, choosing variable shapes (object vs flat list), wiring versioning + module registries, managing remote state, detecting and remediating drift, or refactoring monolithic configs. Triggers: module composition, var validation blocks, output contracts, count vs for_each, lifecycle ignore_changes, terraform import, state mv between resources, workspaces vs separate state files, OIDC to provider, drift detection runs. NOT for Pulumi/CDK (different paradigms), CloudFormation, ad-hoc one-off deployments, or Terraform Cloud-specific UX.'
category: DevOps & Infrastructure
tags:
  - terraform
  - iac
  - modules
  - state
  - hashicorp
  - cloud
---

# Terraform Module Design

A good Terraform module is a black box: clear inputs, stable outputs, locked-down dependencies. The shift from "configuration files" to "module library" is what separates a working repo from a maintainable one.

**Jump to your fire:**
- Plan output changes mysteriously between runs → [Versioning + registry](#versioning--registry)
- Removing one item from a list recreates everything after it → [`count` vs `for_each`](#count-vs-for_each)
- Every plan shows a phantom diff → [`lifecycle` blocks](#lifecycle-blocks)
- Refactor turned into destroy + create → [Refactoring without recreate](#refactoring-without-recreate)
- Apply mid-plan caused incident → [Plan-apply-pray (anti-pattern)](#plan-apply-pray)
- Small change requires apply on the whole world → [State management](#state-management)
- Long-lived cloud creds in CI → [OIDC to cloud providers](#oidc-to-cloud-providers)

## When to use

- Reusable infrastructure across environments (dev/staging/prod) or services.
- A monolithic Terraform config that's becoming unmanageable.
- Sharing modules across teams via a registry (Terraform Registry, private registry, git).
- Detecting drift before it causes incidents.
- Refactoring resource ownership (one resource → multiple modules) without recreating cloud resources.

## Core capabilities

### Module structure

```
modules/
└── service/
    ├── main.tf              # resources
    ├── variables.tf         # inputs
    ├── outputs.tf           # outputs
    ├── versions.tf          # required_providers + required_version
    └── README.md            # purpose, inputs, outputs, examples
```

```hcl
# modules/service/variables.tf
variable "name" {
  type        = string
  description = "Service name. Used in resource names; lowercase + dashes."
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.name))
    error_message = "name must be 3-31 chars, start with a letter, lowercase + dashes."
  }
}

variable "scaling" {
  type = object({
    min  = number
    max  = number
    cpu  = number
  })
  default = { min = 1, max = 10, cpu = 50 }
}

variable "tags" {
  type    = map(string)
  default = {}
}
```

Validation blocks turn unclear runtime errors into clear plan-time errors. Use them on every variable that has constraints.

### Outputs as the contract

```hcl
# modules/service/outputs.tf
output "service_url" {
  value       = aws_ecs_service.this.url
  description = "HTTPS URL of the deployed service."
}

output "log_group" {
  value       = aws_cloudwatch_log_group.this.name
  description = "Log group name for downstream alerts."
}

output "_resources" {
  value       = { service_arn = aws_ecs_service.this.arn, role_arn = aws_iam_role.this.arn }
  description = "Internal resource references for sibling modules."
  sensitive   = false
}
```

Outputs are the public API. Once a module is used by multiple callers, removing or renaming an output is a breaking change.

### Versioning + registry

Tag releases:

```bash
git tag -a service/v1.4.0 -m "service module v1.4.0"
git push origin service/v1.4.0
```

Caller pins:

```hcl
module "orders_api" {
  source  = "git::https://github.com/myorg/tf-modules.git//service?ref=service/v1.4.0"
  name    = "orders-api"
  scaling = { min = 2, max = 20, cpu = 60 }
}
```

For a private registry, the source becomes `myorg.com/service/aws` with version constraints (`version = "~> 1.4"`). Never source from `main` — invisible upstream changes break everything downstream.

### `count` vs `for_each`

```hcl
# count — index-based; reorder = recreate.
resource "aws_iam_user" "team" {
  count = length(var.team_members)
  name  = var.team_members[count.index]
}

# for_each — key-based; addition/removal doesn't disturb others.
resource "aws_iam_user" "team" {
  for_each = toset(var.team_members)
  name     = each.value
}
```

Always prefer `for_each` over `count` for dynamic resources. `count` is fine for "create N identical things"; `for_each` is for any case where the items have identity.

### `lifecycle` blocks

```hcl
resource "aws_ecs_service" "this" {
  # ...
  lifecycle {
    ignore_changes = [task_definition]  # CD pipeline updates this; Terraform shouldn't.
    create_before_destroy = true
    prevent_destroy = false             # set true on shared resources (DBs, buckets)
  }
}
```

`ignore_changes` is essential for resources that have authoritative external mutators (autoscaling, CI/CD deploys). Without it, every plan shows a diff.

### State management

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "myorg-tf-state"
    key            = "envs/prod/orders/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

State separation: one state file per (environment × stack). Don't put dev + prod in the same state. Workspaces are a third option but generally discouraged for prod isolation.

### Refactoring without recreate

```hcl
# moved.tf — keep alongside the refactor.
moved {
  from = aws_lb.app
  to   = module.network.aws_lb.app
}
```

`moved` blocks (1.1+) tell Terraform "this resource moved within state." Without them, refactor → destroy + create → outage.

For cross-state moves: `terraform state mv` (manual) or `import` blocks (1.5+):

```hcl
import {
  to = aws_s3_bucket.this
  id = "existing-bucket-name"
}
```

### Drift detection

```bash
# Plan against current cloud state. Non-zero exit if drift.
terraform plan -detailed-exitcode -lock=false

# Production drift detection in CI (read-only).
terraform plan -detailed-exitcode -lock=false || echo "drift detected"
```

Schedule a daily drift check. Non-zero exit codes mean a human edited something out-of-band — investigate.

### OIDC to cloud providers

```hcl
provider "aws" {
  region = "us-west-2"
  assume_role_with_web_identity {
    role_arn                = "arn:aws:iam::123456789012:role/terraform-deploy"
    web_identity_token_file = "$ACTIONS_ID_TOKEN_REQUEST_TOKEN"
  }
}
```

In CI, use the OIDC token from GitHub Actions to assume the role — no long-lived credentials.

### Tagging strategy

```hcl
locals {
  required_tags = {
    Environment = var.environment
    Service     = var.name
    Owner       = var.team
    ManagedBy   = "terraform"
  }
}

resource "aws_ecs_service" "this" {
  tags = merge(local.required_tags, var.tags)
}
```

A `default_tags` block on the provider sets these for all resources without per-resource boilerplate.

### Provider versions

```hcl
# versions.tf
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.40" }
  }
}
```

Pin major + minor. Patch range is fine. `>= 1.7` keeps you within tested territory.

## Anti-patterns

### Module sourced from `main`

**Symptom:** Plan output changes mysteriously between runs.
**Diagnosis:** Floating reference; upstream changed.
**Fix:** Pin to a tag or SHA. Update intentionally.

### One state file for everything

**Symptom:** A small change requires apply on the entire infrastructure.
**Diagnosis:** Monolithic state.
**Fix:** Split by blast radius: networking, data, services. Cross-reference via `terraform_remote_state` or outputs.

### `count` for resources with identity

**Symptom:** Removing a user from the middle of the list recreates everyone after.
**Diagnosis:** `count.index` reorders when the list does.
**Fix:** `for_each = toset(...)` — keys are stable.

### `ignore_changes` blanket-applied

**Symptom:** Drift goes undetected; security misconfig persists.
**Diagnosis:** `ignore_changes = all` on a resource that should be authoritative.
**Fix:** Specific paths only: `ignore_changes = [task_definition]`. Never `all`.

### Plan-apply-pray

**Symptom:** Apply mid-plan caused incident.
**Diagnosis:** Apply ran on stale plan; another engineer changed state.
**Fix:** `terraform plan -out=plan.tfplan && terraform apply plan.tfplan`. The plan file binds the apply to a specific state version.

### Secrets in tfvars

**Symptom:** Database password committed to repo.
**Diagnosis:** `terraform.tfvars` checked in.
**Fix:** Sensitive variables from environment (`TF_VAR_db_password`), Vault, or AWS Secrets Manager. Mark with `sensitive = true` in declaration.

## Quality gates

- [ ] Every module pins source to a tag or SHA, never `main`.
- [ ] Every variable has a `description` and `validation` (where applicable).
- [ ] Outputs documented; deprecation handled with `moved` blocks.
- [ ] State backend is remote, encrypted, and locked.
- [ ] Drift check runs daily; non-zero exits are investigated.
- [ ] No secrets in tfvars or state-readable plain text.
- [ ] `for_each` used over `count` for resources with identity.
- [ ] `ignore_changes` is targeted, never `all`.
- [ ] `terraform plan -out` then `apply plan.tfplan` in CI.
- [ ] Provider + Terraform versions pinned.

## NOT for

- **Pulumi / AWS CDK** — different paradigms. No dedicated skill.
- **CloudFormation / ARM / Bicep** — provider-native, different idioms. No dedicated skill.
- **One-off deployments** — Terraform's overhead doesn't pay off; just script it. No dedicated skill.
- **Terraform Cloud / HCP-specific UX** — overlaps but has product-specific features. No dedicated skill.
- **Kubernetes manifest management** — IaC neighbor, but Helm/Kustomize is its own domain. → `kubernetes-debugging-runbook` for runtime debugging only.
- **Observability of the cloud you provisioned** — once it's up, → `grafana-dashboard-builder` and `opentelemetry-instrumentation`.
