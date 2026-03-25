# Synchronization Primitives and Atomic Objects

## The Power Hierarchy of Synchronization

Lynch establishes a clear hierarchy of synchronization primitives, each with different computational power:

1. **Read/Write registers** (weakest): Can only read or write one variable per atomic step
2. **Read-Modify-Write (RMW)** (medium): Atomically read, compute new value, write — in one step
3. **Compare-and-Swap (CAS)**, **Test-and-Set**, **Fetch-and-Add** (specialized): Optimized for specific patterns
4. **Snapshot objects** (composite): Atomically read all components of a vector simultaneously

The computational difference between these is not constant-factor — moving up the hierarchy enables qualitatively new capabilities.

---

## Why Read/Write vs. Read-Modify-Write Is a Phase Transition

**Mutual exclusion with read/write**: Requires n distinct shared variables (Theorem 10.33). The proof:
- Every process must write a variable "uncovered" by others
- If fewer than n variables exist, two processes cover the same variable
- An adversarial construction makes states indistinguishable to a third process

**Mutual exclusion with read-modify-write**: Requires only 1 variable (TrivialME):

```
// TrivialME:
Try: if RMW(x, 0, 1) = 0:  // atomically check x=0, set x=1
         enter critical region
     else:
         spin

Exit: x := 0
```

This is trivially correct because the RMW operation atomically checks availability and claims the resource.

**Why this is a phase transition**: The factor-of-n reduction in required variables is not just efficiency — it enables qualitatively different algorithms. With read/write, you need Θ(n) variables and Θ(n) time complexity (e.g., PetersonNP's exponential O(2^n) worst case). With RMW, one variable and O(1) time for acquisition.

**The impossibility theorem bridges them** (Theorem 13.11):

> "Cannot implement read-modify-write atomic objects from read/write using 1-failure termination."

Proof: Assume system B implements RMW from read/write. Apply Trans() to RMWAgreement algorithm A (which guarantees 1-failure termination on RMW). Result: Trans(A) uses only read/write variables. Contradiction: Trans(A) would solve agreement with 1-failure termination in read/write model, violating Theorem 12.8 (impossible).

This proves RMW is strictly more powerful than read/write — not just more efficient.

---

## The Mutual Exclusion Algorithm Landscape

Lynch presents a progression from simple to sophisticated:

### DijkstraME: First But Unfair (O(ln), No Lockout-Freedom)

```
Stages: flag=1 "interested", flag=2 "competing"
Stage 1: flag(i) := 1; wait until turn=i or no competitor has flag=1
         if turn ≠ i: flag(i) := 0; wait until turn=i; repeat
Stage 2: flag(i) := 2; check all others for flag≠2
         if any has flag=2: restart from Stage 1
```

**Time (Theorem 10.7)**: O(ln) where l = max step time, n = number of processes

**Failure mode**: "One user can be repeatedly granted access while other users trying to gain access are forever prevented from doing so." Process 1 can cycle while Process 2 waits forever.

**Why unfair**: The turn variable is updated to the "winner" of Stage 1 competition. If Process 1 keeps winning Stage 1, it keeps entering. Process 2 has no recourse.

### Peterson2P: Fair But Only for Two Processes

The key insight of Peterson2P is non-obvious:

> "Setting `turn := i` *gives the other process the resource*. If both set turn to themselves, the one who set it *last* wins."

```
Process i:
  flag(i) := 1
  turn := i           // Give priority to opponent
  wait for: flag(ī)=0 OR turn≠i
  critical region
  flag(i) := 0
```

**Time (Theorem 10.14)**: c + O(l) where c = critical section time

**Lockout-freedom**: 2-bounded bypass (Lemma 10.12): While i waits, ī enters critical region at most twice.

**Proof**: ī can only pass i by setting turn := ī; can only do this once per trying region entry. Since there are 2 processes, ī can't "lap" i.

### PetersonNP: Fair But Exponential Time

Generalizing Peterson2P to n processes using n-1 competition levels:

```
At level k, process i:
  flag(i) := k
  turn(k) := i
  wait for: (∀j≠i: flag(j)<k) OR turn(k)≠i
```

**Time (Theorem 10.16)**: O(2^n · c + 2^n · n · l) — exponential in n!

**Why exponential**: Process that "loses" level k must cycle back and restart. At each level, a process might cycle O(n) times. n levels compound multiplicatively: recurrence T(k) < 2T(k+1) + c + (3n+4)l solves to 2^n factor.

**The fix — Tournament algorithm** (Section 10.5.3): Use tree structure instead of linear levels:
- Logarithmic depth instead of linear
- Time bound O((n-1)c + O(n²l)) instead of exponential
- **Tradeoff**: No bounded bypass guarantee (but DijkstraME doesn't have it either)

### Bakery Algorithm: FIFO With Unbounded Variables

```
Process i:
  choosing(i) := 1
  number(i) := 1 + max_j number(j)  // Get a ticket
  choosing(i) := 0
  for j≠i:
    wait for choosing(j)=0           // Wait for j to get their ticket
    wait for number(j)=0 or (number(i),i) < (number(j),j)
  critical region
  number(i) := 0
```

**Key property**: "FIFO after a wait-free doorway." If i completes the doorway (getting a ticket) before j enters the trying region, then i enters the critical section before j.

**Doorway is wait-free**: A process won't get stuck even if all others fail. This is a crucial property — the Bakery algorithm degrades gracefully under failures.

**Time (Section 10.6)**: (n-1)c + O(n²l) — polynomial.

**The unbounded variable problem**: number(i) grows without bound. Cannot use wraparound (unlike TicketME) because the algorithm checks number(j)=0 to mean "j exited," not "j has ticket 0."

**TicketME (Section 10.9)** solves this via simulation:
- InfiniteTicketME (unbounded): trivially correct
- TicketME: uses modular arithmetic (tickets mod n)
- Simulation relation: states correspond when ticket values equal modulo n
- Invariant: granted < next < granted+n ensures outstanding tickets are distinct mod n

### The Lower Bound on Variable Values

**Theorem 10.41**: Any algorithm using a single read-modify-write variable and guaranteeing bounded bypass requires that variable to have ≥ n distinct values.

**Theorem 10.44**: Any algorithm guaranteeing lockout-freedom requires ≥ √n values (approximately).

**The gap**: Upper bound for lockout-freedom = ⌈n/2⌉ + k values (BufferMainME algorithm). Lower bound ≈ √n. This gap remains an open research problem as of Lynch's writing.

---

## Atomic Objects: The Abstraction Layer

### What Makes an Object "Atomic"?

**Theorem 13.1 (paraphrased)**: An atomic object guarantees **well-formedness** (operations properly paired invocation-response) and **atomicity** (there exists a total order of non-overlapping operations that produces all observable traces).

**Critical distinction**: Atomicity does not require operations to execute in real-time order — only that a *serialization point* exists within each operation's interval where it "appears to occur atomically."

**Lemma 13.10** (the most practically important lemma in Chapter 13):

> "If every execution with no incomplete operations satisfies atomicity, then every execution (including those with incomplete operations) satisfies atomicity."

**Why surprising**: You only need to check atomicity on *complete* executions. Crashes that kill operations mid-execution don't affect atomicity of completed operations. This dramatically simplifies proofs.

### Variable Types as Operation Contracts

A variable type is:
- **Invocations**: set of allowed operations
- **Responses**: set of possible results
- **Function f**: (invocation, value) → (response, new_value)

**Register**:
```
f(read, v) = (v, v)              // Return current value, unchanged
f(write(v), w) = (ack, v)        // Return ack, set to v
```

**RMW (Read-Modify-Write)**:
```
f(h, v) = (v, h(v))             // Return old value, apply h atomically
```

**Compare-and-Swap (CAS)**:
```
f(CAS(u,v), w) = (w, v if u=w else w)  // Conditional update
```

**Test-and-Set**:
```
f(TAS, v) = (v, 1)              // Return old, set to 1
```

**Fetch-and-Add**:
```
f(F&A(u), v) = (v, v+u)         // Return old, add u
```

The function f captures the *atomicity guarantee* — the contract between the object and its callers.

### Snapshot Algorithms: Reading Many Variables Atomically

The snapshot problem: read n variables simultaneously, getting a consistent view (as if all reads occurred at the same instant).

**UnboundedSnapshot** (Section 13.3.2):

The key insight: "Before an update process i writes to x(i), it first executes its own embedded-snap subroutine. When it writes its value and tag in x(i), it also places the result of its embedded-snap in x(i)."

**Algorithm**:
```
snap():
  while true:
    read all x(i) → tags₁      // First scan
    read all x(i) → tags₂      // Second scan
    
    if tags₁ = tags₂ everywhere:
      return values from second scan  // Consistent
    
    if any x(i) has 4 different tags seen:
      return embedded-snap from 3rd tag  // Update contained within our interval
```

**Why 4 tags implies containment** (Observation 2, Section 13.3.2):

If snap sees tags t₁, t₂, t₃, t₄ from the same variable in sequence:
- Update producing t₃ begins *after* update producing t₂ completes
- That completion is *after* snap begins (snap saw t₁)
- Update producing t₃ ends *before* update producing t₄ begins
- Snap sees t₄ (so t₄ existed before snap ends)
- Therefore: t₃ update is sandwiched entirely within snap interval

This is a beautiful argument: the snapshot sees an update from "inside" its own interval, so that update's embedded snapshot is valid at the correct time.

**Complexity**: O(m²) accesses (where m = number of variables).

**BoundedSnapshot**: Replaces unbounded tags with handshake bits + toggle bits. Each pair (updater i, snapper j) has a 1-bit handshake channel:

```
updater i:
  flip comm(j) to differ from y(j).ack(i)  // Signal new update

snapper j:
  read comm, set ack ← comm  // Acknowledge receipt
```

Toggle bit ensures consecutive updates by same process produce distinguishable values even with 1-bit handshakes.

**Result**: Fully bounded storage, same O(m²) time. The bounded version is production-safe.

---

## The Composition Theorem: Why Layers Work

### Theorem 13.7 (The Transformation Theorem)

If algorithm A uses shared variables x₁,...,xₖ, and you replace each xᵢ with an atomic object implementation Bᵢ, then:

1. Users of the system cannot observe any difference (indistinguishability)
2. If the original system was fair and each Bᵢ guarantees I-failure termination, the new system is also fair

**Why this enables layered design**:
- Prove the lowest-level primitives (registers) are atomic: once
- Prove each higher-level algorithm using those primitives: once per level
- The composition theorem guarantees correctness propagates upward: automatically

**Corollary 13.9**: If A is an atomic object and each Bᵢ is an atomic object, then Trans(A) (A with Bᵢ substituted for xᵢ) is also an atomic object guaranteeing I-failure termination.

**Practical example** (three layers):
- Layer 0: Single-writer/single-reader registers (hardware primitives)
- Layer 1: Multi-writer registers via Bloom algorithm (O(1) time, bounded)
- Layer 2: Snapshot objects via BoundedSnapshot (O(m²) time, bounded)
- Layer 3: Business logic using snapshots (reserve, allocate, etc.)

Each layer's correctness proof is independent. Composition is automatic.

### The Turn Function: Preventing Concurrent Invocations

The transformation theorem requires a **turn function** to prevent deadlock:

> "For each port i, there is a function turn_i that, for any finite execution α, yields either system or user, indicating whose turn it is to take the next step."

**Why this is necessary**: Without turn functions:
- User sends invocation to object
- Object is waiting for response from another object
- User tries to send another invocation
- Deadlock: object cannot respond while waiting, user cannot proceed

The turn function ensures: if system (object) is waiting to deliver response, user cannot send new invocations. Mutual exclusion on ports prevents the deadlock.

**Practical implication**: In any layered system, you need an explicit discipline that prevents a caller from issuing a new request while waiting for a response. This is often implicit (blocking calls), but must be explicit in non-blocking designs.

---

## The Multi-Writer Register Problem

### VitanyiAwerbuch: General Solution

For m writers and p readers using n × n registers (one per pair):

```
WRITE(v) at port i:
  read all x(i,j) for all j
  k ← max tagpair found
  write all x(j,i): val←v, tag←(k+1), index←i

READ at port i:
  read all x(i,j) for all j
  find max tagpair = (tag, index)
  return associated val
  // Propagate: write same value to all x(j,i)
```

**Atomicity proof** (Lemma 13.16): Define partial order:
- π ≺ φ iff tagpair(π) < tagpair(φ), OR
- tagpair(π) = tagpair(φ) AND π is WRITE, φ is READ

**Key claims**:
- Tagpairs are monotone non-decreasing per variable (Claim 13.18)
- Each WRITE gets distinct tagpair (Claim 13.19)
- All WRITEs totally ordered by tagpair
- Each READ returns value of latest WRITE in order

**Complexity**: O(n) operations per step (read/write n registers each).

### Bloom Algorithm: Optimal for 2 Writers

For exactly 2 writers, Bloom achieves O(1) time with bounded registers:

**Key idea**: Two registers with 1-bit tags. Process 1 makes tags "unequal" on write; Process 2 makes tags "equal" on write. Readers choose register based on tag sum:
- Sum = 1 → Process 1's register is newer
- Sum = 0 → Process 2's register is newer

**Proof via simulation** (Lemma 13.26): Relate to IntegerBloom algorithm where tags are integers. The simulation relation: bit-valued tag = second-lowest-order bit of integer tag. Show that:
- When Process 1 writes (tag ← t+1), if t is odd, then second-lowest bits of t and t+1 differ ✓
- When Process 2 writes (tag ← t+1), if t is even, then second-lowest bits are equal ✓

**Advantage**: O(1) time per operation, bounded 2|V|-sized registers. Optimal for 2-writer case.

---

## Resource Allocation: Beyond Mutual Exclusion

Chapter 11 generalizes mutual exclusion to multi-resource problems. The key insight:

**Resource graph**: Nodes = resources, edges connect resources needed by same process.

**Coloring algorithm**: Color the resource graph such that adjacent nodes (resources used by the same process) get different colors. Acquire resources in color order (smallest to largest).

**Why coloring prevents deadlock** (from proof):
> "If process i waits for a resource held by process j, then j could only be delayed by waiting for a resource that is strictly larger (in the resource ordering) than the one for which i is waiting; since there are only finitely many processes, the one that holds the largest resource is not blocked."

**The waiting chain length bound**: Equals the number of colors (chromatic number of resource graph). Fewer colors = shorter chains = better performance.

**Symmetry breaking requirement** (Theorem 11.2):

> "There is no symmetric solution to the Dining Philosophers problem."

Proof: "Consider an execution α that begins with all processes in the same process state...proceeding 'round robin.' By induction, all processes are in the same state after r rounds. But progress says some process eventually enters C. This implies all other processes also enter C at the same round. Contradiction to exclusion property."

**LehmannRabin randomized algorithm** breaks symmetry without asymmetry:
- Each process randomly chooses which fork to try first
- With probability ≥ 1/16 per attempt, some adjacent pair successfully coordinates
- Terminates with probability 1 (not certainty — valid fair executions exist where no one enters)

The algorithm guarantees: well-formedness always, exclusion always, progress *with probability 1* (not certain). The randomness is in performance, not safety.