---
license: Apache-2.0
name: event-driven-architecture-expert
description: "Message queues, pub/sub, event sourcing with Kafka, RabbitMQ, Redis Streams. Activate on: event-driven, message queue, pub/sub, Kafka, RabbitMQ, event bus, async messaging, dead letter queue. NOT for: CQRS projections (use cqrs-event-sourcing-architect), real-time WebSocket (use websocket-realtime-expert), observability (use observability-apm-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*)
category: Backend & Infrastructure
tags:
  - event-driven
  - kafka
  - messaging
  - pub-sub
  - rabbitmq
pairs-with:
  - skill: cqrs-event-sourcing-architect
    reason: Event sourcing builds on event-driven foundations
  - skill: streaming-pipeline-architect
    reason: Streaming pipelines consume event-driven sources
  - skill: observability-apm-expert
    reason: Distributed tracing across async event flows
---

# Event-Driven Architecture Expert

Design and implement resilient message-driven systems using Kafka, RabbitMQ, Redis Streams, and cloud-native event buses.

## Activation Triggers

**Activate on:** "event-driven", "message queue", "pub/sub", "Kafka", "RabbitMQ", "event bus", "async messaging", "dead letter queue", "event broker", "fan-out", "Redis Streams"

**NOT for:** CQRS projections/event stores → `cqrs-event-sourcing-architect` | WebSocket real-time → `websocket-realtime-expert` | Distributed tracing → `observability-apm-expert`

## Quick Start

1. **Identify event boundaries** — map domain events to bounded contexts
2. **Choose broker** — Kafka for ordered logs, RabbitMQ for routing flexibility, Redis Streams for lightweight queues
3. **Define event schemas** — use CloudEvents spec with JSON Schema or Avro
4. **Implement idempotent consumers** — design for at-least-once delivery
5. **Configure DLQ and retry policies** — never silently drop messages

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Message Brokers** | Apache Kafka 3.8+, RabbitMQ 4.x, Redis Streams 7.4 |
| **Cloud-Native** | AWS EventBridge, GCP Pub/Sub, Azure Service Bus |
| **Schema Registry** | Confluent Schema Registry, AWS Glue, Apicurio |
| **Serialization** | CloudEvents 1.0, Avro, Protobuf, JSON Schema |
| **Frameworks** | KafkaJS, amqplib, BullMQ 5.x, Temporal |

## Architecture Patterns

### Fan-Out with Dead Letter Queue

```
Producer → Topic/Exchange
              ├─→ Consumer A (order-service)
              ├─→ Consumer B (notification-service)
              └─→ Consumer C (analytics-service)
                       ↓ (failure after 3 retries)
                   Dead Letter Queue → Alert + Manual Review
```

### Transactional Outbox Pattern

Avoid dual-write problems by writing events to an outbox table within the same DB transaction, then polling/CDC to publish:

```
┌─────────────────────────────┐
│  BEGIN TRANSACTION          │
│  INSERT INTO orders (...)   │
│  INSERT INTO outbox (       │
│    event_type, payload,     │
│    published_at = NULL      │
│  )                          │
│  COMMIT                     │
└─────────────────────────────┘
         ↓ (CDC / Poller)
   Kafka / RabbitMQ Topic
```

### Competing Consumers with Partitioned Ordering

```typescript
// KafkaJS consumer group — 3 partitions, 3 consumers
const kafka = new Kafka({ brokers: ['broker:9092'] });
const consumer = kafka.consumer({ groupId: 'order-processors' });
await consumer.subscribe({ topic: 'orders', fromBeginning: false });
await consumer.run({
  partitionsConsumedConcurrently: 3,
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    await processIdempotent(event, message.headers['idempotency-key']);
  },
});
```

## Anti-Patterns

1. **No idempotency** — consumers must tolerate duplicate delivery; use idempotency keys stored in Redis or a DB unique constraint
2. **Unbounded retry loops** — always set max retries with exponential backoff, then route to DLQ
3. **Synchronous over async** — do not await downstream completion in the producer; fire-and-forget with ack
4. **Oversized payloads** — keep events under 1MB; use claim-check pattern for large blobs (store in S3, pass reference)
5. **Missing schema evolution** — always version your event schemas; breaking changes require a new topic or dual-publish

## Quality Checklist

- [ ] All events follow CloudEvents spec with `type`, `source`, `id`, `time`
- [ ] Consumers are idempotent (replay-safe)
- [ ] Dead letter queues configured with alerting
- [ ] Schema registry enforces backward compatibility
- [ ] Retry policy: exponential backoff, max 3-5 retries
- [ ] Partition key chosen to preserve ordering where required
- [ ] Consumer lag monitoring configured (Kafka) or queue depth alerts (RabbitMQ)
- [ ] Transactional outbox used to avoid dual-write inconsistency
- [ ] Event payloads under 1MB (claim-check for larger)
- [ ] Load tested at 2x expected peak throughput
