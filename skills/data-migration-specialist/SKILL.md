---
license: Apache-2.0
name: data-migration-specialist
description: "Large-scale data migrations with validation, rollback, and zero-downtime strategies. Activate on: data migration, database migration, zero-downtime migration, dual-write, backfill, cutover, data validation, schema migration. NOT for: schema evolution in streams (use schema-evolution-manager), API versioning (use api-versioning-backward-compatibility)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,python:*,psql:*,docker:*)
category: Data & Analytics
tags:
  - data-migration
  - zero-downtime
  - validation
  - rollback
  - cutover
pairs-with:
  - skill: database-connection-pool-manager
    reason: Migrations impact connection pooling during cutover
  - skill: data-quality-guardian
    reason: Post-migration validation requires quality checks
  - skill: schema-evolution-manager
    reason: Schema changes accompany data migrations
---

# Data Migration Specialist

Plan and execute large-scale data migrations with zero-downtime strategies, comprehensive validation, and reliable rollback plans.

## Activation Triggers

**Activate on:** "data migration", "database migration", "zero-downtime migration", "dual-write", "backfill", "cutover", "data validation", "schema migration", "platform migration", "cloud migration"

**NOT for:** Streaming schema evolution → `schema-evolution-manager` | API backward compatibility → `api-versioning-backward-compatibility` | Warehouse optimization → `data-warehouse-optimizer`

## Quick Start

1. **Audit source data** — profile row counts, data types, nulls, constraints, and edge cases
2. **Choose strategy** — big bang (downtime), dual-write (zero-downtime), CDC-based (continuous sync)
3. **Build validation framework** — row counts, checksums, spot checks, and business rule assertions
4. **Run rehearsal** — execute full migration on staging with production-scale data
5. **Plan rollback** — define rollback triggers, procedure, and maximum acceptable rollback window

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Strategies** | Dual-write, CDC-based, big bang, strangler fig |
| **CDC Tools** | Debezium, AWS DMS, GCP Datastream, pglogical |
| **Validation** | Great Expectations, custom checksums, row-count reconciliation |
| **Schema** | Flyway, Liquibase, Prisma Migrate, Alembic |
| **Orchestration** | Airflow, Temporal, custom migration scripts |

## Architecture Patterns

### Zero-Downtime Migration (Dual-Write)

```
Phase 1: Dual-Write (days/weeks)
──────────────────────────────────
App writes → Old DB (primary)
         → New DB (shadow, async)
Reads from: Old DB only

Phase 2: Shadow Read Validation
──────────────────────────────────
App writes → Old DB + New DB
Reads from: Old DB (primary)
            New DB (shadow, compare results)

Phase 3: Cutover
──────────────────────────────────
App writes → New DB (primary)
         → Old DB (shadow, for rollback)
Reads from: New DB

Phase 4: Cleanup
──────────────────────────────────
App writes → New DB only
Remove old DB writes
Decommission old DB (after rollback window expires)
```

### Validation Framework

```python
class MigrationValidator:
    """Run after each migration phase to verify data integrity."""

    def validate_row_counts(self):
        """Source and target row counts must match within tolerance."""
        for table in self.tables:
            source = self.source_db.count(table)
            target = self.target_db.count(table)
            tolerance = 0.001  # 0.1% tolerance for in-flight writes
            assert abs(source - target) / source < tolerance, \
                f"{table}: source={source}, target={target}"

    def validate_checksums(self):
        """Hash comparison on sampled rows."""
        for table in self.tables:
            sample_ids = self.source_db.sample_ids(table, n=10000)
            for batch in chunked(sample_ids, 1000):
                source_hash = self.source_db.hash_rows(table, batch)
                target_hash = self.target_db.hash_rows(table, batch)
                assert source_hash == target_hash, \
                    f"{table}: checksum mismatch in batch"

    def validate_business_rules(self):
        """Domain-specific invariants."""
        # Example: total revenue must match
        source_rev = self.source_db.query("SELECT SUM(amount) FROM orders")
        target_rev = self.target_db.query("SELECT SUM(amount) FROM orders")
        assert source_rev == target_rev, "Revenue mismatch!"

    def validate_constraints(self):
        """All FKs, unique constraints, and NOT NULLs hold on target."""
        violations = self.target_db.check_constraints()
        assert len(violations) == 0, f"Constraint violations: {violations}"
```

### Rollback Decision Tree

```
Migration issue detected?
  │
  ├─ Data loss or corruption? → IMMEDIATE ROLLBACK
  │   Switch reads/writes back to old DB
  │   Replay writes from new DB → old DB (if needed)
  │
  ├─ Performance regression? → EVALUATE
  │   ├─ < 2x slower → optimize, do not rollback
  │   └─ > 2x slower → rollback, investigate
  │
  └─ Minor data discrepancy? → FIX FORWARD
      Run reconciliation job to sync
      Do NOT rollback for fixable issues

Rollback window: keep old DB live for 7-14 days post-cutover
```

## Anti-Patterns

1. **No rehearsal** — always run the full migration on staging with production-scale data before the real cutover
2. **Validation after cutover only** — validate continuously during dual-write phase, not just at the end
3. **No rollback plan** — every migration needs a documented rollback procedure with defined triggers
4. **Big bang for large datasets** — migrating 1TB+ in one shot risks extended downtime; use CDC or phased approach
5. **Ignoring edge cases** — NULLs, empty strings, Unicode, timezone differences, and precision loss cause subtle data corruption

## Quality Checklist

- [ ] Source data profiled: row counts, types, nulls, edge cases documented
- [ ] Migration strategy chosen with justification (dual-write, CDC, big bang)
- [ ] Validation framework covers: row counts, checksums, business rules, constraints
- [ ] Full rehearsal completed on staging with production-scale data
- [ ] Rollback procedure documented with trigger criteria
- [ ] Rollback window defined (keep old system live 7-14 days)
- [ ] Dual-write conflict resolution strategy defined
- [ ] Performance benchmarked: target system meets SLA before cutover
- [ ] Communication plan: stakeholders notified of timeline and risks
- [ ] Post-migration monitoring: alerts for data discrepancies for 30 days
