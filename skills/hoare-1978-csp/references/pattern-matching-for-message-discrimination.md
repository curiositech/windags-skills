# Pattern Matching for Message Discrimination

## The Problem: Type-Safe Message Routing

In a system where multiple processes communicate by message-passing, a fundamental question arises: **How does a receiving process distinguish between different types of messages?**

Traditional solutions:
- **Integer tags**: Message has a `type` field, receiver switches on it (error-prone, not type-safe)
- **Separate channels**: Different message types sent on different channels (proliferates channels, complex routing)
- **Polling**: Receiver tries to receive from multiple sources and handles whatever arrives (busy-waiting, inefficient)

Hoare's solution: **Structured messages with pattern-matching input commands**. The structure of the input command itself specifies what message types are acceptable, and the pattern-match succeeds or fails based on message structure.

## The Mechanism: Constructors and Structured Values

Hoare introduces constructors (p. 668):

```
<structured expression> ::= <constructor>(<expression list>)
<structured target> ::= <constructor>(<target variable list>)
```

A constructor is just a name (identifier). An expression like `insert(5)` creates a structured value with constructor `insert` and component `5`. A target like `insert(n)` matches values with constructor `insert`, binding the component to variable `n`.

**Key rule**: A structured target matches a structured value if:
1. They have the same constructor
2. The component lists are the same length
3. Each target variable matches the corresponding component

If the match fails, the input command fails—the message is rejected.

## Example: Multiple Entry Points (Section 4.3)

```
S :: *[n:integer; X?insert(n) → INSERT
      []n:integer; X?has(n) → SEARCH; X!(i < size)
     ]
```

Process S accepts two kinds of messages from X:
- `insert(n)`: Insert n into the set
- `has(n)`: Query whether n is in the set

If X sends `insert(5)`, the first alternative matches: constructor is `insert`, component is bound to n. The command INSERT executes.

If X sends `has(5)`, the second alternative matches: constructor is `has`, component bound to n. SEARCH executes, followed by a response.

If X sends `delete(5)` (assuming we added this), neither alternative matches. Both input guards fail. The alternative command fails—deadlock. This is intentional: S does not handle `delete`, so sending one is an error.

**For Agent Systems**: Each skill declares the message patterns it handles. The orchestrator routes messages based on pattern matching. If a skill receives a message it doesn't understand, this is a type error—detectable at the point of message send (if types are checked statically) or at the point of receive (if dynamic).

Example:
```
skill_analyze :: 
  *[code:string; client?analyze_code(code) → run_analysis(code); client!result(...)
   []options:map; client?configure(options) → apply_config(options)
  ]
```

This skill handles two message types: `analyze_code(string)` and `configure(map)`. Any other message type causes a match failure.

## Signals: Structured Values With No Components

Hoare introduces "signals" (p. 668): structured values with no components.

```
c := P()
P() := c
```

The first assigns a signal with constructor `P` to variable c. The second matches: if c has constructor `P`, it succeeds; otherwise fails.

**Use case**: Protocols where the message type alone carries information, no payload needed.

Example (Section 5.2, semaphore):
```
S :: *[(i:1..100) X(i)?V() → val := val + 1
      [](i:1..100) val > 0; X(i)?P() → val := val - 1
     ]
```

`V()` and `P()` are signals. No data is transferred—just the control message "increment" or "decrement."

**For Agent Systems**: Use signals for control messages:
- `shutdown()`: Terminate gracefully
- `pause()`: Stop accepting new work
- `resume()`: Resume accepting work
- `heartbeat()`: I'm alive

The absence of a payload avoids the need to invent dummy data just to send a control message.

## Nested Structures: Recursive Pattern Matching

Hoare's pattern matching extends to nested structures:

```
x := cons(cons(1, 2), cons(3, 4))
cons(cons(a, b), cons(c, d)) := x
```

After the assignment, a=1, b=2, c=3, d=4. The pattern `cons(cons(...), cons(...))` matches the nested structure of x and binds the leaf components.

**Use case**: Hierarchical data structures like trees.

Example:
```
*[tree?node(left, right) → 
    process_left(left); 
    process_right(right)
 []tree?leaf(value) → 
    process_leaf(value)
]
```

This accepts trees with two constructors: `node` (internal node with two children) and `leaf` (leaf node with a value). The pattern match discriminates based on structure, not an integer tag.

**For Agent Systems**: Complex messages can carry structured data. A code analysis result might be:

```
result(
  status("success"),
  metrics(lines(1000), complexity(15)),
  issues([warning("unused_var", line(42)), error("type_mismatch", line(56))])
)
```

The receiver can pattern-match at multiple levels:

```
*[client?result(status("success"), metrics(lines(l), complexity(c)), issues(list)) →
    log("Analysis succeeded: " + l + " lines, complexity " + c);
    handle_issues(list)
 []client?result(status("failure"), error(msg), _) →
    log("Analysis failed: " + msg)
]
```

The pattern match extracts relevant fields and ignores others (`_` as wildcard).

## Discriminating Between Senders: Subscripted Process Names

Hoare allows process arrays and subscripted names:

```
*[(i:1..100) X(i)?message(data) → handle(i, data)]
```

This accepts `message(data)` from any process X(i), where i ranges from 1 to 100. The bound variable i is available in the command list, so the handler knows which process sent the message.

**Use case**: A server handling requests from multiple clients.

Example (Section 5.1, bounded buffer):
```
*[in < out + 10; producer?buffer(in mod 10) → in := in + 1
 []out < in; consumer?more() → consumer!buffer(out mod 10); out := out + 1
]
```

The buffer accepts messages from specific named sources: `producer` and `consumer`. If a third process tries to send, the input would be from the wrong source and would not match.

**For Agent Systems**: When a skill can accept requests from multiple clients, use subscripted names to identify the sender:

```
*[(i:1..N) client(i)?request(r) → 
    result := process(r);
    client(i)!response(result)
]
```

This handles requests from N clients. The bound variable i identifies which client sent the request, so the response goes back to the right client.

## Pattern Match Failure: Rejection and Deadlock

If an input command's pattern does not match the incoming message, the input fails. If the input is in a guard, the guard fails. If all guards fail, the alternative command fails.

Example:
```
*[X?insert(n) → ...
 []X?has(n) → ...
]
```

If X sends `delete(n)`, neither input guard matches. Both fail. The alternative command has no executable guards, so it fails. The repetitive command terminates (or the process deadlocks, depending on context).

**This is intentional**. The receiver specifies what messages it can handle. Sending an unhandled message is a protocol violation. The system makes this explicit by failing.

**For Agent Systems**: Message pattern mismatch should be treated as a type error:
- **At design time**: Type-check the orchestration plan to ensure all messages sent match patterns expected by receivers
- **At runtime**: If a mismatch occurs, log it as an error, report to the sender, and (possibly) retry with a corrected message

Do not silently ignore mismatched messages—this hides bugs.

## Combining Patterns and Predicates: Guarded Input

Hoare allows boolean guards before input commands:

```
*[val > 0; X?P() → val := val - 1]
```

The input `X?P()` is only accepted if `val > 0`. Even if X is ready to send `P()`, this guard will not execute if val <= 0.

**Combining pattern matching and predicates**:

```
*[size < 100; X?insert(n) → INSERT
 []size > 0; X?retrieve() → X!content(0); size := size - 1
]
```

The first alternative matches `insert(n)` but only if size < 100 (room available). The second matches `retrieve()` but only if size > 0 (data available).

**For Agent Systems**: Resource-limited skills can use guarded inputs to reject requests when overloaded:

```
*[queue_size < MAX; client?request(r) → enqueue(r)
 []queue_size > 0; worker?ready() → worker!dequeue()
]
```

Requests are only accepted if the queue isn't full. Work is only dispatched if the queue isn't empty. The guards encode the scheduling policy.

## Wildcards and Partial Matching

Hoare doesn't explicitly include wildcards, but they're a natural extension:

```
*[X?message(_, important_field, _) → handle(important_field)]
```

The `_` wildcards match any value but don't bind to a variable. This extracts just the fields of interest.

**Use case**: Large messages where only a few fields are relevant to a particular handler.

**For Agent Systems**: Orchestrators dealing with complex results from skills can use partial matching:

```
*[analyzer?result(_, metrics(lines(l), _), _) → 
    log("Code has " + l + " lines")
]
```

This extracts just the line count from a complex result structure, ignoring everything else.

## Type Safety and Static Checking

Hoare's pattern matching enables static type checking of message protocols:

1. **Sender**: `X!insert(5)` constructs a message with constructor `insert` and integer component
2. **Receiver**: `X?insert(n)` expects constructor `insert` and binds an integer to n

If the sender sends `insert("abc")` (string instead of integer), the types don't match. A statically-typed language can catch this at compile time.

If the sender sends `has(5)` (wrong constructor), the pattern match fails at runtime—but this is also detectable statically if the protocol is specified.

**For WinDAGs**: Skill interfaces should be typed:

```
skill_interface(analyzer) = {
  input: analyze_code(code:string, options:map),
  output: result(status:enum, metrics:map, issues:list)
}
```

The orchestrator type-checks message sends against these interfaces. If skill A sends a message that skill B's interface doesn't accept, this is a compile-time error in the orchestration plan.

## Comparison to Other Approaches

**vs. Integer tags**:
- Hoare: Constructors are names, pattern matching is structural
- Tags: Integers, must manually ensure sender and receiver agree on meanings
- Winner: Hoare (type-safe, self-documenting)

**vs. Separate channels**:
- Hoare: One channel, multiple message types distinguished by pattern
- Separate: One channel per message type
- Winner: Hoare for simplicity; separate channels for performance (can select on channel readiness, not message content)

**vs. Dynamic dispatch (OOP)**:
- Hoare: Receiver explicitly enumerates patterns; unhandled messages fail
- OOP: Receiver inherits or implements message handlers; unhandled messages may silently do nothing or throw exception
- Winner: Hoare for explicitness; OOP for extensibility (subclasses can add handlers)

**For Agent Systems**: Hoare's approach is best when the message protocol is fixed and known. If the protocol must evolve (new message types added dynamically), a more extensible approach (separate channels or dynamic dispatch) may be needed. But for most orchestration scenarios, fixed protocols with pattern matching are sufficient and safer.

## Implications for Agent Coordination

Pattern matching transforms how we think about agent coordination:

**Traditional**: "Send a message. Hope the receiver understands it."
**CSP**: "Send a message with structure X. Receiver declares it accepts X. If structures match, communication succeeds; otherwise, it fails explicitly."

This makes coordination **declarative**. The receiver declares what it can handle. The sender declares what it sends. The system checks compatibility.

For WinDAGs:
1. **Each skill declares input patterns**: "I accept analyze_code(string, map) and configure(map)"
2. **Orchestrator ensures sends match**: Before invoking a skill, check that the message matches one of its input patterns
3. **Runtime detects violations**: If a mismatch occurs (sender changed, receiver changed, orchestrator bug), the system fails explicitly rather than silently

This is **contract-based coordination**: each skill has a contract (input patterns), and the orchestrator enforces contracts.

## Conclusion: Structure as Protocol

Hoare's pattern matching elevates message structure from an implementation detail to a first-class protocol element. The structure of a message—its constructor and components—defines what it is and what it means.

For multi-agent systems, this is transformative:
- **No magic numbers**: Message types are named constructors, not integers
- **No manual parsing**: Pattern matching extracts components automatically
- **Type safety**: Mismatched messages are caught, not silently mishandled
- **Self-documenting**: Code shows exactly what messages are expected

For a system with 180+ skills, pattern matching prevents chaos. Without it, skills must manually parse messages, check types, handle errors. With it, the language does this automatically.

The result: safer, clearer, more maintainable agent coordination. The structure of the code reflects the structure of the communication protocol, and the structure of the protocol reflects the structure of the problem.