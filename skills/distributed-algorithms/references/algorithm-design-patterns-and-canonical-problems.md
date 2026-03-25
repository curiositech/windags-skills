# Algorithm Design Patterns and Canonical Problems

## The Canonical Problem Set

Lynch identifies a small set of fundamental distributed problems that recur across different system models and applications. Mastering these canonical problems means mastering the building blocks for most real distributed systems.

| Problem | What It Solves | Canonical Algorithm | Key Complexity |
|---------|---------------|---------------------|----------------|
| Leader Election | Select unique coordinator | PetersonLeader (async ring) | Ω(n log n) messages |
| BFS/Spanning Tree | Build communication tree | SynchBFS / AsynchSpanningTree | O(|E|) messages |
| Shortest Paths | Optimal routing | BellmanFord (sync), Async exponential worst case | O((n-1)|E|) sync |
| MST | Efficient broadcast infrastructure | SynchGHS / GHS | O(n log n + |E|) messages |
| Maximal Independent Set | Resource allocation | LubyMIS (randomized) | O(log n) expected rounds |
| Consensus | Agreement on value | FloodSet, EIGByz, BenOr | f+1 rounds (or impossible) |
| Mutual Exclusion | Serialize resource access | Peterson, Bakery, TicketME | n variables minimum |
| Resource Allocation | Multi-resource access | Coloring, LehmannRabin | Color-bounded chains |
| Global Snapshot | Observe consistent state | ChandyLamport / LogicalTimeSnapshot | O(diam) time |
| Reliable Broadcast | Guaranteed delivery | EIGStop / PolyByz | f+1 rounds |

The power of this canonical set: when you face a new distributed problem, ask "which canonical problem does this reduce to?" The reduction tells you both the algorithm and the lower bounds.

---

## Pattern 1: Explore → Aggregate → Decide

The most fundamental pattern in distributed algorithms. Used for BFS, spanning trees, convergecast, and consensus.

### Structure

1. **Explore (Broadcast)**: Root sends query outward; each node forwards to unvisited neighbors
2. **Aggregate (Convergecast)**: Leaves report results; each node aggregates children's reports and sends to parent
3. **Decide**: Root receives all results, makes decision, broadcasts if needed

### BFS as Infrastructure

**SynchBFS algorithm**:
```
Process i₀ (root): mark self, send "search" to all neighbors
At each round:
  If i is unmarked and receives search:
    mark self; choose sender as parent
    send search to all neighbors
    report: send to parent at next round