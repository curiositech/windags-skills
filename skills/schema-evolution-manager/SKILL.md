---
license: Apache-2.0
name: schema-evolution-manager
description: 'Avro, Protobuf, backward/forward compatibility for schema evolution. Activate on: schema evolution, Avro, Protobuf, backward compatibility, forward compatibility, schema registry, breaking change, schema migration. NOT for: database migrations (use data-migration-specialist), API versioning (use api-versioning-backward-compatibility).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,docker:*)
category: Backend & Infrastructure
tags:
  - schema-evolution
  - avro
  - protobuf
  - compatibility
  - schema-registry
pairs-with:
  - skill: streaming-pipeline-architect
    reason: Stream schemas must evolve without breaking consumers
  - skill: event-driven-architecture-expert
    reason: Event schemas need versioning for long-lived systems
  - skill: cqrs-event-sourcing-architect
    reason: Event store schemas must evolve while remaining replayable
---

# Schema Evolution Manager

Design schema evolution strategies using Avro, Protobuf, and JSON Schema with compatibility enforcement via schema registries.

## Activation Triggers

**Activate on:** "schema evolution", "Avro schema", "Protobuf", "backward compatibility", "forward compatibility", "schema registry", "breaking change", "schema migration", "schema versioning"

**NOT for:** Database DDL migrations → `data-migration-specialist` | API versioning → `api-versioning-backward-compatibility` | Data contract enforcement → `data-quality-guardian`

## Quick Start

1. **Choose serialization** — Avro (schema-with-data, compact), Protobuf (code-gen, fast), JSON Schema (human-readable)
2. **Set compatibility mode** — BACKWARD (default for consumers), FORWARD (for producers), FULL (both)
3. **Deploy schema registry** — Confluent Schema Registry or AWS Glue for centralized schema governance
4. **Test compatibility** — check every schema change against the registry before deployment
5. **Plan for breaking changes** — new topic/table + migration period, never in-place breaks

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Serialization** | Apache Avro 1.12+, Protobuf 5.x, JSON Schema 2020-12 |
| **Registry** | Confluent Schema Registry, AWS Glue, Apicurio |
| **Compatibility** | BACKWARD, FORWARD, FULL, NONE modes |
| **Code Generation** | avro-codegen, protoc, json-schema-to-ts |
| **Validation** | Schema compatibility checks, CI integration |

## Architecture Patterns

### Compatibility Mode Decision Matrix

```
                    BACKWARD           FORWARD            FULL
                    ─────────          ────────           ────
Allowed changes:
  Add field          YES (with default)  YES               YES (with default)
  Remove field       NO                  YES               NO
  Rename field       NO                  NO                NO
  Change type        NO                  NO                NO

Use when:
  Consumer-first     YES                 NO                NO
  Producer-first     NO                  YES               NO
  Both evolve        NO                  NO                YES

Default choice:     Most common         Rare              Safest
```

### Avro Schema Evolution Example

```json
// v1: original schema
{
  "type": "record",
  "name": "UserEvent",
  "namespace": "com.example",
  "fields": [
    { "name": "user_id", "type": "string" },
    { "name": "email", "type": "string" },
    { "name": "created_at", "type": "long" }
  ]
}

// v2: BACKWARD compatible (new field with default)
{
  "type": "record",
  "name": "UserEvent",
  "namespace": "com.example",
  "fields": [
    { "name": "user_id", "type": "string" },
    { "name": "email", "type": "string" },
    { "name": "created_at", "type": "long" },
    { "name": "phone", "type": ["null", "string"], "default": null }
  ]
}
// Old consumers can read v2 data (they ignore `phone`)
// New consumers can read v1 data (`phone` defaults to null)
```

### CI Schema Compatibility Check

```bash
#!/bin/bash
# ci/check-schema-compatibility.sh

REGISTRY_URL="http://schema-registry:8081"
SUBJECT="user-events-value"
SCHEMA_FILE="schemas/user-event.avsc"

# Check compatibility before merge
RESULT=$(curl -s -X POST \
  "${REGISTRY_URL}/compatibility/subjects/${SUBJECT}/versions/latest" \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  -d "{\"schema\": $(cat $SCHEMA_FILE | jq -Rs .)}")

IS_COMPATIBLE=$(echo $RESULT | jq -r '.is_compatible')

if [ "$IS_COMPATIBLE" != "true" ]; then
  echo "SCHEMA INCOMPATIBLE: $RESULT"
  exit 1
fi
echo "Schema is compatible"
```

## Anti-Patterns

1. **Removing required fields** — under BACKWARD compatibility, removing a field without a default breaks old consumers
2. **Renaming fields** — renaming is equivalent to remove + add; it breaks both readers and writers
3. **No default values** — new fields must have defaults for backward compatibility; always provide one
4. **Skipping the registry** — local schema files without centralized validation lead to runtime deserialization failures
5. **NONE compatibility mode** — disabling compatibility checks "for speed" guarantees future production incidents

## Quality Checklist

- [ ] Schema registry deployed and enforced (no bypass)
- [ ] Compatibility mode set: BACKWARD for consumer-first, FULL for maximum safety
- [ ] All new fields have default values
- [ ] CI pipeline checks schema compatibility before merge
- [ ] Breaking changes require new subject/topic + migration plan
- [ ] Schema changes documented in changelog with migration notes
- [ ] Producers and consumers tested against both old and new schemas
- [ ] Schema IDs embedded in messages (Confluent wire format)
- [ ] Unused schemas deprecated and cleaned up quarterly
- [ ] Team trained on compatibility rules for their serialization format
