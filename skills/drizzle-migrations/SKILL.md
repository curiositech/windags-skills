---
license: Apache-2.0
name: drizzle-migrations
description: Manage database schema with Drizzle ORM and SQLite migrations. Use when adding tables, modifying columns, creating indexes, or running migrations. Activates for database schema changes, migration generation, and Drizzle query patterns.
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Backend & Infrastructure
tags:
  - drizzle
  - migrations
  - orm
  - database
  - typescript
---

# Drizzle ORM Migrations

Manage database schema changes using Drizzle ORM with SQLite through decision-driven migration strategies.

## DECISION POINTS

### Schema Change Strategy Decision Tree

```
Is this a production database?
├─ YES → Always use generate + migrate workflow
│  ├─ Breaking change (column removal, type change)?
│  │  ├─ YES → Multi-step migration with data preservation
│  │  └─ NO → Standard migration generation
│  └─ Performance impact (large table, complex index)?
│     ├─ YES → Plan maintenance window, test on replica
│     └─ NO → Standard migration during low traffic
└─ NO (development) → Can use push for speed
   ├─ Breaking existing local data?
   │  ├─ YES → Backup first, consider fresh DB
   │  └─ NO → Safe to push directly
   └─ Collaborating with team?
      ├─ YES → Use migrations for consistency
      └─ NO → Push is acceptable
```

### Column Type Selection Matrix

| Data Type | Use | Drizzle Type | Index Recommended |
|-----------|-----|--------------|------------------|
| User ID | Primary/Foreign keys | `text('id').primaryKey()` | Auto on PK/FK |
| Email | Unique identifiers | `text('email').unique()` | YES |
| Timestamps | Created/updated times | `text('created_at').default(sql\`CURRENT_TIMESTAMP\`)` | If filtered |
| JSON Data | Flexible schemas | `text('data', { mode: 'json' })` | NO (use computed) |
| Booleans | Status flags | `integer('active', { mode: 'boolean' })` | If filtered |
| Counters | Stats, quantities | `integer('count').default(0)` | If aggregated |

### Migration Conflict Resolution

```
Migration fails to apply?
├─ Schema conflict detected
│  ├─ Column exists → Check if type matches expected
│  ├─ Table exists → Verify schema matches or rename
│  └─ Index exists → Check if definition identical
├─ Foreign key violation
│  ├─ Referenced table missing → Create dependency first
│  ├─ Referenced column missing → Fix reference or add column
│  └─ Circular reference → Break into separate migrations
└─ Data type mismatch
   ├─ Incompatible conversion → Create transformation migration
   ├─ NULL constraint violation → Add default or migrate data
   └─ Unique constraint violation → Clean duplicate data first
```

## FAILURE MODES

### 1. "Push to Production" Anti-Pattern
**Symptoms:** Using `npm run db:push` on production database
**Detection:** If environment is production AND using push command
**Fix:** 
- Stop immediately
- Generate proper migration: `npm run db:generate`
- Review SQL in `/drizzle` folder
- Test on staging first
- Apply via migration runner

### 2. "Missing Index Cascade" Anti-Pattern  
**Symptoms:** Query performance degrades after adding foreign keys
**Detection:** Foreign key columns without corresponding indexes
**Fix:**
```typescript
// Add index for FK columns
export const checkIns = sqliteTable('check_ins', {
  userId: text('user_id').notNull().references(() => users.id),
}, (table) => ({
  userIdIdx: index('idx_checkins_user_id').on(table.userId), // Add this
}));
```

### 3. "Destructive Migration Drift" Anti-Pattern
**Symptoms:** Data loss during column rename or type changes
**Detection:** Migration contains `DROP COLUMN` or incompatible type changes
**Fix:**
- Create multi-step migration
- Step 1: Add new column
- Step 2: Migrate data  
- Step 3: Remove old column

### 4. "Schema Bloat" Anti-Pattern
**Symptoms:** Tables with 15+ columns, deeply nested JSON in text fields
**Detection:** Single table handling multiple concerns
**Fix:**
- Break into related tables with proper foreign keys
- Extract JSON objects into separate tables
- Use relations to maintain referential integrity

### 5. "Missing WHERE Clause Disaster" Anti-Pattern
**Symptoms:** Accidental bulk deletes or updates
**Detection:** `DELETE` or `UPDATE` statements without `.where()` clause
**Fix:**
```typescript
// WRONG: Deletes all records
await db.delete(users);

// RIGHT: Targeted deletion
await db.delete(users).where(eq(users.id, userId));
```

## WORKED EXAMPLES

### Adding a New Table with Relations

**Scenario:** Add user preferences table to existing user system

**Step 1: Analyze Impact**
- New table, no breaking changes
- Will need FK relationship to users
- Should include index on user_id for lookups

**Step 2: Schema Definition**
```typescript
// src/db/schema.ts
export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',  // Delete prefs when user deleted
  }),
  theme: text('theme', { enum: ['light', 'dark', 'auto'] }).default('auto'),
  notifications: integer('notifications', { mode: 'boolean' }).default(true),
  timezone: text('timezone').default('UTC'),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('idx_user_preferences_user_id').on(table.userId),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  preferences: one(userPreferences),  // Add this line
  checkIns: many(checkIns),
}));
```

**Step 3: Generate and Review**
```bash
npm run db:generate
```

**Step 4: Verify Generated SQL**
```sql
-- drizzle/0001_create_user_preferences.sql
CREATE TABLE `user_preferences` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `theme` text DEFAULT 'auto',
  `notifications` integer DEFAULT true,
  `timezone` text DEFAULT 'UTC',
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `idx_user_preferences_user_id` ON `user_preferences` (`user_id`);
```

**What Expert Catches:** FK cascade behavior is correct, index is present, defaults are appropriate
**What Novice Misses:** Would forget the index, might not consider cascade behavior

## QUALITY GATES

- [ ] Migration generates without errors (`npm run db:generate`)
- [ ] Generated SQL reviewed for correctness in `/drizzle` folder
- [ ] Foreign key constraints include proper `onDelete` behavior
- [ ] Indexes added for all foreign key columns
- [ ] Test database successfully migrates (`npm run db:migrate`)
- [ ] Sample queries execute without performance issues
- [ ] No data loss verified if modifying existing tables
- [ ] Migration is reversible or rollback plan documented
- [ ] Schema matches TypeScript types (no type/runtime mismatches)
- [ ] Relations properly defined for new tables

## NOT-FOR Boundaries

❌ **DO NOT use this skill for:**
- **PostgreSQL/Supabase projects** → Use `supabase-admin` skill instead
- **Prisma ORM migrations** → Different syntax and CLI commands
- **Raw SQL database management** → Use database-specific tools
- **Database design theory** → Use architecture planning skills
- **Performance tuning** → Use database optimization skills
- **Backup/restore operations** → Use database administration skills

✅ **Instead delegate to:**
- `supabase-admin` for PostgreSQL schema management
- `database-design` for entity relationship modeling
- `sql-optimization` for query performance issues