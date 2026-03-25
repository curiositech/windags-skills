# Guarded Commands for Nondeterministic Choice

## The Problem: Selection Among Alternatives

A fundamental challenge in concurrent systems is: **how does a process choose which of several possible actions to take next?** Traditional approaches include:

- **Busy-waiting loops**: Poll multiple sources, check which is ready (inefficient, high CPU)
- **Callback registration**: Register handlers for different events (inverted control flow, hard to reason about)
- **Blocking on one source**: Wait for specific input (can't handle multiple sources)

Hoare synthesizes Dijkstra's guarded commands with his own input commands to create a powerful selection mechanism that solves this problem elegantly.

## The Mechanism: Alternative Commands with Guards

The basic structure:

```
[guard1 → command_list1
[]guard2 → command_list2
[]guard3 → command_list3
]
```

**Execution semantics**: Evaluate all guards. If any succeed, *arbitrarily* choose one and execute its command list. If all fail, the alternative command fails.

A guard can be:
1. A boolean expression (fails if false)
2. A declaration (introduces a variable, never fails)
3. An input command (fails if source is terminated; delays if source not ready)
4. A combination: boolean expression(s) and/or declaration(s); followed optionally by an input command

## The Power: Input Guards

The critical innovation is allowing input commands as guards:

```
*[producer?data → process(data)
 []controller?stop() → terminate := true
]
```

This process waits for *either* data from producer *or* a stop signal from controller, **whichever arrives first**. The choice is made by the external timing of the other processes, not by this process's internal logic.

**Contrast with traditional approaches**:
- Select/poll: requires OS support, not portable, doesn't integrate with sequential logic
- Callbacks: breaks up sequential logic into handlers, obscures control flow
- Multiple threads: heavyweight, requires locks, error-prone

Hoare's approach: guards are part of the sequential control structure. The process remains sequential; nondeterminism is explicit and local.

## Example: The Bounded Buffer (Section 5.1)

```
X :: buffer:(0..9) portion;
     in,out:integer; in := 0; out := 0;
     *[in < out + 10; producer?buffer(in mod 10) → in := in + 1
      []out < in; consumer?more() → consumer!buffer(out mod 10);
                                     out := out + 1
     ]
```

Two alternatives:
1. `in < out + 10; producer?buffer(in mod 10)`: If buffer not full AND producer is ready, accept input
2. `out < in; consumer?more()`: If buffer not empty AND consumer is requesting, send output

**Critical property**: The boolean guards *inhibit* selection even if the input partner is ready. When buffer is full (`in = out + 10`), the first alternative cannot be selected even if producer is blocked waiting to send. The producer must wait until consumer drains the buffer.

**For Agent Systems**: A skill that can handle multiple request types but has resource constraints can use guarded commands:

```
*[memory_available > threshold; client?large_task(t) → handle_large(t)
 []client?small_task(t) → handle_small(t)
 []client?cancel(id) → cancel_task(id)
]
```

Large tasks are only accepted when memory is available. Small tasks are always accepted. Cancellations are always processed. The guard structure encodes the scheduling policy.

## Pattern Matching in Guards

Guards support pattern matching on message structure:

```
*[n:integer; X?insert(n) → INSERT
 []n:integer; X?has(n) → SEARCH; X!(i < size)
]
```

The variable `n` is declared in each alternative. The input commands `X?insert(n)` and `X?has(n)` match different message constructors. If X sends `insert(42)`, only the first alternative can execute. If X sends `has(42)`, only the second.

**Why this matters**: Type-safe message discrimination. No need for:
```
X?msg;
[msg.type = INSERT → n := msg.payload; INSERT
[]msg.type = HAS → n := msg.payload; SEARCH; X!result
]
```

The structure of the input command IS the type check. Pattern match failure causes the guard to fail—meaning the message doesn't match and won't be accepted.

**For WinDAGs**: Skills declare the message patterns they handle. The orchestrator need not parse and route based on message content; the guard structure does this automatically. A skill declares:

```
skill_interface = [
  pattern: "analyze(code:string, options:map)"
  pattern: "cancel(request_id:uuid)"
]
```

The implementation is just guarded alternatives for each pattern.

## Fairness and Implementation Strategy

Hoare explicitly addresses fairness (Section 7.6): "Should a programming language definition specify that an implementation must be fair?" His answer: **NO**.

The reasoning: fairness is an implementation quality, not a semantic requirement. A correct program must not depend on fairness. Otherwise, you cannot prove termination—the program only terminates if the implementation happens to be fair, which is unprovable.

**But**: "an efficient implementation should try to be reasonably fair and should ensure that an output command is not delayed unreasonably often after it first becomes executable" (Section 7.6).

**Practical guidance**: When multiple guards are executable:
- Prefer the one that's been waiting longest (prevent starvation)
- Prefer the one with external effects (I/O) over internal computation
- Use randomization to avoid systematic bias

**For WinDAGs**: When multiple skills can handle a request, the orchestrator should:
1. Not guarantee any particular ordering (semantic freedom)
2. In practice, load-balance or prefer faster skills (implementation quality)
3. Never rely on fairness for correctness (prove termination assuming adversarial scheduling)

## Repetitive Commands: Iteration Until Termination

The repetitive command `*[...]` iterates the alternative command until all guards fail. With input guards, this creates a powerful pattern:

```
*[source?data → process(data)]
```

This loops, processing data from source, until source terminates. Then the input guard fails, the alternative command fails, and the repetitive command terminates.

**Generalization**: Multiple input sources:

```
*[source1?data → process1(data)
 []source2?data → process2(data)
]
```

This processes data from either source, in whatever order it arrives, until **both** sources terminate.

**For Agent Systems**: A coordinator aggregating results from multiple parallel skills:

```
coordinator ::
  results := [];
  *[worker(i:1..N)?result → results.append(result)]
  emit_aggregate(results)
```

This collects results from all workers (however many there are), in whatever order they complete, and terminates only when all workers are done.

## The Boundary Condition: When All Guards Fail

An alternative command with all guards failed is itself a failure. This propagates:

```
[false → anything
[]false → anything_else
]
```

This always fails. If it's inside a repetitive command, the repetitive command terminates. If it's at top level, the process fails (crashes, deadlocks, or reports error, depending on context).

**Design principle**: Ensure at least one guard can succeed, or ensure failure is intended.

**Example of intentional failure**: The dining philosophers (Section 5.3) deliberately allows a state where no philosopher can pick up forks (all have left fork, all waiting for right fork). This is deadlock, and the program is incorrect. The fix is architectural: prevent the state from arising (limit room occupancy to 4).

**For WinDAGs**: If all alternative skills are unavailable (overloaded, crashed, terminated), the orchestrator should:
- Fail explicitly with a clear error
- NOT busy-wait hoping one becomes available
- Propagate the failure to the caller (who may have fallback logic)

## Implications for Task Decomposition

Guarded commands suggest a decomposition strategy: **enumerate the possible external events and handle each**.

Traditional loop structure:
```
while (condition) {
  get_next_event();
  switch (event.type) {
    case A: handle_A(); break;
    case B: handle_B(); break;
  }
}
```

CSP structure:
```
*[source_A?event_A → handle_A(event_A)
 []source_B?event_B → handle_B(event_B)
]
```

The difference:
- Traditional: one source, multiple event types, explicit dispatch
- CSP: multiple sources, pattern-matched events, implicit dispatch via guards

**For complex agent orchestration**: A coordinator handling multiple event streams should use guarded alternatives. Each guard represents one event source and pattern. The guard structure IS the dispatch logic.

```
*[user?query(q) → skills.search!query(q); skills.search?results; user!results
 []monitor?alert(a) → log(a); admin!alert(a)
 []admin?shutdown() → cleanup(); terminate := true
 [](i:1..N)skill(i)?heartbeat() → update_health(i)
]
```

Four event types, handled uniformly. The monitor doesn't poll; it waits. When any event arrives, the corresponding handler executes. Termination is explicit (shutdown command). Health monitoring happens in parallel with query handling.

## Conclusion: Guards as Scheduling Policy

Hoare's guarded commands with input guards provide a declarative way to express **scheduling policies** for concurrent interactions. The guards specify:
- **Which** messages to accept (pattern matching)
- **When** to accept them (boolean conditions)
- **From whom** to accept them (input source names)

The alternative command then specifies **how** to handle each accepted message.

This separation of concerns (scheduling policy vs. message handling) is exactly what complex agent systems need. The orchestration layer specifies guards (what's acceptable given current state and constraints); the skill layer specifies handlers (what to do with each message type).

Together, they define a reactive system that responds to its environment without busy-waiting, without callbacks, and without losing sequential control flow.

For WinDAGs with 180+ skills: define orchestration as guarded alternatives over skill responses. The orchestrator is then a *reactive process* whose behavior is entirely determined by its guard structure and the messages that arrive. This is comprehensible, analyzable, and free of the callback spaghetti that plagues event-driven systems.