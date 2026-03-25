---
license: Apache-2.0
name: prompt-template-manager
description: "Version-control, parameterize, and A/B test LLM prompt templates with Git-native workflows. Activate on: prompt versioning, prompt templates, A/B test prompts, manage prompts, prompt registry. NOT for: writing prompts from scratch (prompt-engineer), fine-tuning data (fine-tuning-dataset-curator)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - prompt-management
  - versioning
  - a-b-testing
  - templates
  - llm-ops
pairs-with:
  - skill: prompt-engineer
    reason: Prompt engineer writes content; this skill manages lifecycle
  - skill: llm-evaluation-harness
    reason: A/B tests need automated evaluation to pick winners
  - skill: llm-cost-optimizer
    reason: Template compression and model routing reduce per-prompt cost
---

# Prompt Template Manager

Version-control, parameterize, and A/B test LLM prompt templates using Git-native workflows and structured registries.

## Activation Triggers

**Activate on**: "prompt versioning", "prompt template", "A/B test prompts", "prompt registry", "manage prompt variants", "prompt as code", "parameterized prompts", "prompt lifecycle"

**NOT for**: Writing or optimizing individual prompts (prompt-engineer), fine-tuning dataset preparation (fine-tuning-dataset-curator), or LLM application architecture (ai-engineer)

## Quick Start

1. **Structure prompts as files** — Store each prompt template in `prompts/{domain}/{name}.yaml` with metadata, variables, and versioned content.
2. **Parameterize with variables** — Use `{{variable}}` placeholders for dynamic content; separate static instruction from dynamic context.
3. **Version with Git** — Each prompt change is a commit. Tags mark production versions. Branches for experiments.
4. **A/B test** — Deploy multiple variants simultaneously, route traffic by percentage, collect metrics per variant.
5. **Promote winners** — Evaluate via automated harness or human review, promote winning variant to production tag.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Template Format** | YAML + Jinja2, Handlebars, Mustache | YAML frontmatter for metadata, body for template |
| **Version Control** | Git tags, branches, semantic versioning | `v1.2.0` tags for production, branches for experiments |
| **A/B Testing** | Feature flags (LaunchDarkly, Unleash, custom) | Percentage-based routing with metrics collection |
| **Registry** | File-based, PostgreSQL, Redis | Central lookup for template resolution at runtime |
| **Evaluation** | LLM-as-judge, human eval, RAGAS | Automated comparison of variant outputs |
| **Rendering** | Jinja2 (Python), Handlebars (JS), custom | Variable interpolation with type validation |

## Architecture Patterns

### Pattern 1: File-Based Prompt Registry

```
prompts/
├── customer-support/
│   ├── ticket-classifier.yaml      # Active production template
│   ├── ticket-classifier.v2.yaml   # Experiment variant
│   └── response-generator.yaml
├── content/
│   ├── blog-outline.yaml
│   └── social-post.yaml
└── _shared/
    ├── system-safety.yaml          # Reusable system prompt fragments
    └── output-format-json.yaml
```

```yaml
# prompts/customer-support/ticket-classifier.yaml
name: ticket-classifier
version: "1.3.0"
model: claude-sonnet-4-20250514
temperature: 0
description: Classify support tickets into categories
variables:
  - name: ticket_text
    type: string
    required: true
  - name: categories
    type: list
    default: [billing, technical, account, other]
includes:
  - _shared/output-format-json.yaml

template: |
  You are a support ticket classifier.

  Classify the following ticket into exactly one category.
  Categories: {{categories | join(", ")}}

  Ticket:
  {{ticket_text}}

  {{> output-format-json}}

tests:
  - input: { ticket_text: "I can't log in to my account" }
    expected_category: "account"
  - input: { ticket_text: "You charged me twice" }
    expected_category: "billing"
```

### Pattern 2: A/B Testing Pipeline

```
Request ──→ [Router] ──→ Variant A (control, 80%) ──→ [LLM] ──→ Response + Log
                │                                                      │
                └──→ Variant B (experiment, 20%) ──→ [LLM] ──→ Response + Log
                                                                       │
                                                                       ▼
                                                              [Metrics Store]
                                                              - latency
                                                              - token count
                                                              - quality score
                                                              - user feedback
                                                                       │
                                                                       ▼
                                                              [Evaluation]
                                                              Winner → promote to 100%
```

```python
# A/B routing with metrics
import random, time

class PromptRouter:
    def __init__(self, registry, metrics):
        self.registry = registry
        self.metrics = metrics

    def resolve(self, template_name: str, user_id: str) -> dict:
        variants = self.registry.get_variants(template_name)
        # Deterministic assignment by user_id for consistency
        bucket = hash(f"{user_id}:{template_name}") % 100
        for variant in variants:
            if bucket < variant["traffic_pct"]:
                self.metrics.log("variant_assigned", {
                    "template": template_name,
                    "variant": variant["version"],
                    "user_id": user_id
                })
                return variant
            bucket -= variant["traffic_pct"]
        return variants[0]  # Default to control
```

### Pattern 3: Prompt Composition with Includes

```
System Prompt = [safety-preamble] + [role-definition] + [output-format]
User Prompt   = [context-injection] + [user-query] + [constraints]

Compose from reusable fragments:
  _shared/safety-preamble.yaml  ──→ "You must not generate harmful content..."
  _shared/json-output.yaml     ──→ "Respond with valid JSON matching this schema..."
  domain/role.yaml              ──→ "You are an expert in {{domain}}..."

Final prompt = render(compose([safety, role, output]), variables)
```

## Anti-Patterns

1. **Prompts hardcoded in application code** — Changing a prompt requires a code deploy. Store prompts externally with hot-reload capability.
2. **No version tracking** — "Which prompt was running when quality dropped last Tuesday?" Without versions tied to timestamps, this is unanswerable.
3. **A/B testing without statistical significance** — Declaring a winner after 50 requests is noise. Require minimum sample sizes (typically 200+ per variant) and p-value thresholds.
4. **Monolithic mega-prompts** — A 3,000-token prompt that handles every case is fragile. Compose from reusable fragments so changes are isolated.
5. **No rollback plan** — Every prompt version must be instantly rollbackable by re-tagging the previous version as production.

## Quality Checklist

- [ ] Prompts stored as files with YAML metadata (not hardcoded in application code)
- [ ] Variables parameterized with types and validation (required, default, enum)
- [ ] Each prompt has inline test cases for regression testing
- [ ] Git tags mark production versions (semantic versioning: major.minor.patch)
- [ ] A/B test routing is deterministic per user (no flickering between variants)
- [ ] Minimum sample size enforced before declaring A/B test winners
- [ ] Metrics collected per variant: latency, tokens, quality score, user feedback
- [ ] Reusable fragments extracted to `_shared/` for composition
- [ ] Rollback possible in under 1 minute (re-tag or config flip)
- [ ] Prompt rendering tested: all variables substituted, no raw `{{placeholders}}` in output
