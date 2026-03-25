---
license: Apache-2.0
name: cqrs-event-sourcing-architect
description: "CQRS pattern, event stores, projections, eventual consistency. Activate on: CQRS, event sourcing, event store, read model, projection, aggregate, domain event, command handler. NOT for: message broker setup (use event-driven-architecture-expert), database optimization (use data-warehouse-optimizer)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*)
category: Backend & Infrastructure
tags:
  - cqrs
  - event-sourcing
  - ddd
  - projections
  - eventual-consistency
pairs-with:
  - skill: event-driven-architecture-expert
    reason: Event sourcing depends on reliable event infrastructure
  - skill: distributed-transaction-manager
    reason: Saga patterns complement CQRS for cross-aggregate consistency
  - skill: schema-evolution-manager
    reason: Event schema evolution is critical for long-lived event stores
---

# CQRS & Event Sourcing Architect

Design systems that separate read/write models and derive state from immutable event logs using EventStoreDB, Marten, or custom stores.

## Activation Triggers

**Activate on:** "CQRS", "event sourcing", "event store", "read model", "projection", "aggregate", "domain event", "command handler", "EventStoreDB", "Marten"

**NOT for:** Message broker infrastructure → `event-driven-architecture-expert` | Database query optimization → `data-warehouse-optimizer` | API design → `api-architect`

## Quick Start

1. **Model aggregates** — identify consistency boundaries in your domain
2. **Define domain events** — past-tense facts: `OrderPlaced`, `ItemShipped`
3. **Implement command handlers** — validate, then emit events
4. **Build event store** — append-only log (EventStoreDB, PostgreSQL, DynamoDB)
5. **Create projections** — materialize read models from event streams

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Event Stores** | EventStoreDB 24.x, Marten 7.x, custom PostgreSQL |
| **Frameworks** | NestJS CQRS, Axon (JVM), Eventuous, Commanded (Elixir) |
| **Projections** | In-memory, PostgreSQL views, Elasticsearch, Redis |
| **Serialization** | JSON with versioned schemas, Protobuf |
| **Testing** | Given-When-Then event test pattern |

## Architecture Patterns

### CQRS Separation

```
Command Side                    Query Side
─────────────                   ──────────
POST /orders                    GET /orders/:id
     ↓                               ↑
Command Handler                 Read Model (Postgres/ES)
     ↓                               ↑
Aggregate.apply(event)          Projection Handler
     ↓                               ↑
Event Store (append)  ──────→  Event Subscription
```

### Aggregate with Event Replay

```typescript
class OrderAggregate {
  private status: 'draft' | 'placed' | 'shipped' = 'draft';
  private items: OrderItem[] = [];
  private uncommitted: DomainEvent[] = [];

  place(command: PlaceOrderCommand): void {
    if (this.status !== 'draft') throw new Error('Order already placed');
    this.apply(new OrderPlaced({ orderId: command.orderId, items: command.items }));
  }

  private apply(event: DomainEvent): void {
    this.when(event);           // mutate state
    this.uncommitted.push(event); // track for persistence
  }

  private when(event: DomainEvent): void {
    if (event instanceof OrderPlaced) {
      this.status = 'placed';
      this.items = event.items;
    }
  }

  static rehydrate(events: DomainEvent[]): OrderAggregate {
    const agg = new OrderAggregate();
    events.forEach(e => agg.when(e));
    return agg;
  }
}
```

### Projection Rebuild Strategy

```
1. Stop projection subscription
2. Drop/truncate read model table
3. Replay all events from position 0
4. Resume subscription at current position

Key: projections are disposable — the event log is the source of truth
```

## Anti-Patterns

1. **CRUD in disguise** — if you just save/load entities without events, you have CRUD with extra steps
2. **Anemic events** — events like `OrderUpdated` are useless; capture *what changed* specifically
3. **Querying the event store** — never query raw events for read use cases; build a projection
4. **Deleting events** — event stores are append-only; use compensating events for corrections
5. **Ignoring eventual consistency** — read models lag behind writes; design UIs to handle this gracefully

## Quality Checklist

- [ ] Aggregates enforce invariants before emitting events
- [ ] Events are immutable, past-tense, and contain all needed data
- [ ] Event store is append-only with optimistic concurrency
- [ ] Projections can be rebuilt from scratch without data loss
- [ ] Event versioning strategy defined (upcasting or schema registry)
- [ ] Given-When-Then tests cover all aggregate state transitions
- [ ] Snapshot strategy defined for aggregates with long event streams (>1000 events)
- [ ] Eventual consistency communicated clearly in API contracts
- [ ] Idempotent projection handlers (replaying events produces same read model)
