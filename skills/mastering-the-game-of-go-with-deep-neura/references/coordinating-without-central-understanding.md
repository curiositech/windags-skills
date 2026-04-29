# Coordinating Without Central Understanding: Decentralized Intelligence in Search Systems

## The Coordination Challenge

AlphaGo's distributed version runs 40 search threads on 1,202 CPUs and 176 GPUs. These components must coordinate to build a shared search tree, but they operate asynchronously without global synchronization.

This creates a fundamental challenge: **how do independent computational units coordinate toward a shared goal without a central controller that understands everything?**

Traditional approaches to parallel computation rely on:
- **Locks** to prevent concurrent modifications
- **Barriers** to synchronize threads at specific points
- **Master-worker** with central scheduler knowing all work

AlphaGo uses none of these. Instead, it employs **decentralized coordination mechanisms** where each component makes local decisions using partial information, and intelligent global behavior emerges from their interaction.

## The Lock-Free Architecture

### The Traditional Parallel Search Problem

In parallel MCTS, multiple threads share a search tree. Each thread must:
1. Read node statistics (N, W, Q values)
2. Compute which child to select
3. Traverse to child
4. Eventually update statistics based on simulation results

With traditional locking:
```
lock(node)
  read statistics
  compute best child
  traverse
unlock(node)
... simulation ...
lock(node)
  update statistics
unlock(node)
```

This serializes access to each node—only one thread can touch it at a time. With 40 threads, contention becomes severe. Threads spend time waiting for locks rather than doing useful work.

### AlphaGo's Lock-Free Solution

AlphaGo updates statistics using **lock-free atomic operations**:

```
// Read (no lock needed - eventual consistency OK)
N = atomic_read(node.N)
W = atomic_read(node.W)
Q = W / N

// Update (atomic increment - no lock needed)
atomic_increment(node.N, 1)
atomic_increment(node.W, value)
```

Atomic operations guarantee that increments don't corrupt data even if multiple threads update simultaneously. The CPU hardware ensures atomicity—no software locks needed.

**Key insight**: We don't need strict consistency. It's acceptable if a thread reads slightly stale values (another thread's update hasn't finished). Statistical noise in Monte Carlo evaluation dwarfs the error from stale reads.

This is **eventual consistency**: all updates eventually become visible to all threads, but there's no guarantee of immediate visibility.

### The Benefit: Linear Scaling

Lock-free updates enable near-linear scaling. Extended Data Table 8 shows:

**Threads on 48 CPUs, 8 GPUs:**
- 1 thread: 2,203 Elo
- 2 threads: 2,393 Elo (+190)
- 4 threads: 2,564 Elo (+171)
- 8 threads: 2,665 Elo (+101)
- 16 threads: 2,778 Elo (+113)
- 32 threads: 2,867 Elo (+89)
- 40 threads: 2,890 Elo (+23)

Going from 1 to 40 threads gains 687 Elo—massive improvement. The scaling isn't perfectly linear (diminishing returns at high thread counts), but it's much better than would be achieved with locks.

With locks, threads would contend for shared nodes, spending time waiting. Without locks, all 40 threads do useful work simultaneously.

## Virtual Loss: Coordination Without Communication

### The Redundant Exploration Problem

Without coordination, parallel threads might redundantly explore the same path:
- Thread A sees that action a1 has high Q + u value
- Thread B, running simultaneously, also sees that a1 has high value
- Both threads select a1 and traverse identical paths
- Computation is wasted—they should explore different paths

The traditional solution: locks or explicit communication. Thread A locks the node, preventing Thread B from selecting the same action.

### AlphaGo's Virtual Loss Solution

AlphaGo uses **virtual loss** instead:

When thread selects action a and traverses to child node, it immediately updates statistics as if the simulation has lost:
```
N(s,a) += nvl  // Add virtual visit count
W(s,a) -= nvl  // Subtract virtual wins (assume loss)
```

This makes the path temporarily look worse, discouraging other threads from selecting it. When the simulation completes and backup occurs, remove virtual loss and add real result:
```
N(s,a) = N(s,a) - nvl + 1    // Remove virtual, add real
W(s,a) = W(s,a) + nvl + z    // Remove virtual loss, add real outcome
```

**Key properties**:

1. **No communication**: Thread doesn't need to tell other threads what it's doing. The updated statistics in the tree implicitly signal "this path is being explored."

2. **Self-correcting**: If the thread takes longer than expected, the virtual loss remains, continuing to discourage others. When it completes, the correct values are restored.

3. **Temporary**: Virtual loss is local to one simulation. It doesn't permanently bias the tree—once simulation completes, true values are restored.

4. **Tunable**: The magnitude nvl = 3 balances between:
   - Too small (< 2): Insufficient discouragement, threads still collide
   - Too large (> 10): Over-discouragement, threads avoid promising paths even when parallelization would help

The paper uses nvl = 3, "losing 3 games" temporarily. This provides moderate discouragement without completely blocking paths.

## Asynchronous Evaluation: Coordination Through Queues

### The GPU Evaluation Problem

Neural network evaluation (policy and value networks) requires GPUs and takes ~3ms. Search threads run on CPUs and make decisions every microseconds. 

Synchronous approach would be disastrous:
```
// Thread decides to evaluate position
queue_position(s)
result = wait_for_gpu_evaluation(s)  // Blocks for 3ms
use_result(result)
continue_search()
```

With 40 search threads all waiting for GPU results, throughput would collapse. The GPU would be utilized, but CPUs would be idle most of the time.

### AlphaGo's Asynchronous Queue Solution

```
// Thread evaluates position
queue_position(s)
// IMMEDIATELY CONTINUE - don't wait
continue_search()

// Later, asynchronously:
// GPU thread pulls from queue
result = evaluate_on_gpu(s)
// GPU thread updates tree
backup_result(s, result)
```

Search threads never wait for GPU evaluation. They queue positions and immediately continue searching. GPU threads pull from queues, evaluate, and update the tree asynchronously.

**Coordination mechanism**: The queue itself provides coordination:
- **Producer-consumer pattern**: Search threads produce work (positions to evaluate); GPU threads consume work (evaluate positions)
- **Load balancing**: If multiple GPUs available, all pull from same queue—work naturally distributes to idle GPUs
- **Backpressure**: If queue grows too large, the system "dynamically adjusts the expansion threshold nthr" to generate less work

### The Placeholder Prior Strategy

When node is first expanded, it needs prior probabilities P(s,a) for action selection. But policy network evaluation hasn't completed yet—position is queued but result not available.

Solution: **use fast placeholder priors immediately, replace with accurate priors when available**:

```
// Node expansion (CPU thread)
initialize_priors_with_tree_policy()  // Fast, uses pτ
queue_for_policy_network()            // Slow, uses pσ

// Later (GPU thread)
accurate_priors = evaluate_policy_network()
atomic_update(priors, accurate_priors)