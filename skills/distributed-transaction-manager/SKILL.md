---
license: Apache-2.0
name: distributed-transaction-manager
description: "Saga patterns, compensating actions, and two-phase commit for distributed transactions. Activate on: distributed transaction, saga, compensating action, two-phase commit, eventual consistency, cross-service transaction. NOT for: single-database transactions (use database-connection-pool-manager), event sourcing (use cqrs-event-sourcing-architect)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*)
category: Backend & Infrastructure
tags:
  - distributed-transactions
  - saga
  - compensating-actions
  - consistency
  - microservices
pairs-with:
  - skill: cqrs-event-sourcing-architect
    reason: Event sourcing provides audit trail for saga steps
  - skill: event-driven-architecture-expert
    reason: Sagas coordinate via async events
  - skill: observability-apm-expert
    reason: Distributed tracing across saga steps is essential
---

# Distributed Transaction Manager

Design and implement reliable cross-service transactions using saga patterns, compensating actions, and orchestrated workflows.

## Activation Triggers

**Activate on:** "distributed transaction", "saga pattern", "compensating action", "two-phase commit", "eventual consistency", "cross-service transaction", "Temporal workflow", "rollback across services"

**NOT for:** Single-database ACID transactions → `database-connection-pool-manager` | Event sourcing → `cqrs-event-sourcing-architect` | Message queue setup → `event-driven-architecture-expert`

## Quick Start

1. **Map the transaction boundary** — identify all services that must participate
2. **Choose pattern** — choreography saga (event-driven) or orchestration saga (central coordinator)
3. **Define compensating actions** — every forward step needs a reverse operation
4. **Implement idempotency** — all steps must be safely retryable
5. **Add timeout and dead-letter handling** — no saga should hang indefinitely

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Orchestration** | Temporal 1.25+, Step Functions, Conductor |
| **Choreography** | Kafka events, RabbitMQ, Redis Streams |
| **Frameworks** | NestJS Saga, MassTransit (.NET), Axon (JVM) |
| **State Machines** | XState 5.x, custom saga state tables |
| **Monitoring** | Temporal UI, saga state dashboards |

## Architecture Patterns

### Orchestration Saga (Temporal)

```
Saga Orchestrator (Temporal Workflow)
    │
    ├─→ Step 1: Reserve Inventory    ──fail──→ (no compensation needed)
    │       ↓ success
    ├─→ Step 2: Charge Payment       ──fail──→ Compensate: Release Inventory
    │       ↓ success
    ├─→ Step 3: Create Shipment      ──fail──→ Compensate: Refund Payment
    │       ↓ success                            Compensate: Release Inventory
    └─→ COMPLETE
```

```typescript
// Temporal workflow definition
import { proxyActivities } from '@temporalio/workflow';

const { reserveInventory, releaseInventory,
        chargePayment, refundPayment,
        createShipment } = proxyActivities<Activities>({
  startToCloseTimeout: '30s',
  retry: { maximumAttempts: 3 },
});

export async function orderSaga(order: Order): Promise<OrderResult> {
  // Step 1
  await reserveInventory(order.items);
  try {
    // Step 2
    const paymentId = await chargePayment(order.payment);
    try {
      // Step 3
      const shipmentId = await createShipment(order.shipping);
      return { status: 'completed', paymentId, shipmentId };
    } catch {
      await refundPayment(paymentId);
      throw new Error('Shipment failed');
    }
  } catch {
    await releaseInventory(order.items);
    throw new Error('Order saga failed');
  }
}
```

### Choreography Saga (Event-Driven)

```
Order Service         Inventory Service       Payment Service
     │                       │                       │
     ├─ OrderCreated ───────→│                       │
     │                       ├─ InventoryReserved ──→│
     │                       │                       ├─ PaymentCharged
     │←── OrderCompleted ────┤←── PaymentConfirmed ──┤
     │                       │                       │
     │  On failure at any step, each service         │
     │  listens for failure events and compensates   │
```

### Saga State Machine

```
STARTED → INVENTORY_RESERVED → PAYMENT_CHARGED → SHIPMENT_CREATED → COMPLETED
    │              │                   │                  │
    └→ FAILED   COMPENSATING ←─── COMPENSATING ←─── COMPENSATING
                    │
                COMPENSATED (terminal)
```

## Anti-Patterns

1. **Distributed two-phase commit** — 2PC across microservices creates tight coupling and availability problems; use sagas instead
2. **No compensation logic** — every forward action must have a defined reverse; "undo" is not optional
3. **Non-idempotent steps** — network retries will duplicate calls; use idempotency keys for every saga step
4. **Ignoring partial failure** — compensations can also fail; implement compensation retry with dead letter escalation
5. **Synchronous saga coordination** — sagas should be async; do not block the original request on saga completion

## Quality Checklist

- [ ] Every forward step has a defined compensating action
- [ ] All steps are idempotent with unique operation IDs
- [ ] Saga state persisted durably (not in-memory)
- [ ] Timeout configured for each step (no infinite waits)
- [ ] Compensation failures route to dead letter queue with alerting
- [ ] Distributed tracing spans the entire saga lifecycle
- [ ] Saga state machine has clear terminal states (COMPLETED, COMPENSATED, FAILED)
- [ ] Integration tests cover happy path AND each compensation branch
- [ ] Temporal/orchestrator dashboard accessible for debugging stuck sagas
