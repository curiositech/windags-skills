# Why Your Agent Swarm Needs a Leviathan

Use this reference when you need a full blog-post or talk outline that bridges from operational pain to formal coordination.

## Outline

```text
Title: Why Your Agent Swarm Needs a Leviathan
Subtitle: What Hobbes knew about your CI pipeline

I. Hook: the 3 AM page that tests could not prevent
II. The testing ceiling
III. Enter the Leviathan
IV. Show, don't tell
V. The proof, not the promise
VI. CTA
```

## Hook Calibration

The hook must pass three tests:

1. Recognition: the reader thinks "that happened to me."
2. Stakes: the reader feels the cost.
3. Curiosity: the reader wants to know how you solved it.

Draft hook:

> Your test suite is green. All 2,400 tests pass. You deploy. At 3:17 AM, two agents write to the same migration file. One wins. The other's changes vanish. Monitoring does not notice because both agents reported success.
>
> This is not a testing problem. It is a coordination problem. And no number of tests will solve it, because the failure exists in the space between your agents.

## Depth Calibration

Target audience:

- runs multi-agent systems
- has not used TLA+
- manages infrastructure or reliability

Implications:

- do not show specs before the demo works
- show operational metrics like collision detection latency or prevented incidents
- keep the piece around 2,000 words and put the install command in the first 300 words

## CTA Sequence

```bash
npm install -g port-daddy
pd start
pd begin --identity myapp:api --purpose "testing the leviathan"
pd session files claim $SESSION_ID src/db/migrations/001.sql
pd note "I own this file now. Try to take it."
```

Second terminal:

```bash
pd begin --identity myapp:worker --purpose "also wants that migration"
pd session files claim $SESSION_ID src/db/migrations/001.sql
```

Expected result: conflict detected before any write occurs.
