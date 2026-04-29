# Graph Decomposition Strategy Space

```mermaid
mindmap
  root((Graph Decomposition<br/>Strategy Space))
    Core Insight
      Exploit structural<br/>regularity in DAGs
      Transform scaling<br/>bottlenecks into<br/>manageable abstractions
      Chain-based indexing<br/>+ transitive compression
    Mental Model 1
      Width Over Density
      True complexity in<br/>coordination not<br/>connections
      Payoff: Identify<br/>reduced edge set
      Benefit: Budget scaling<br/>against width not<br/>total edges
    Mental Model 2
      Greedy + Fast beats<br/>Optimal + Slow
      Near-optimal preprocessing<br/>enables downstream<br/>workflows
      Payoff: 90% solution<br/>in 1s > 100% in 1h
      Benefit: Unlock iterative<br/>use cases
    Mental Model 3
      Hierarchical Abstraction<br/>via Chain Decomposition
      Chains = total orders<br/>Cross-chain = coordination<br/>boundaries
      Payoff: O(V²) → O(kc×Ered)<br/>compression
      Benefit: Separate within-chain<br/>from cross-chain optimization
    Mental Model 4
      Transitive Structure as<br/>Compression Opportunity
      85-95% of dense graph<br/>edges are transitive
      Payoff: Store only reduced<br/>set while preserving<br/>all information
      Benefit: Dramatic working<br/>set reduction
    Mental Model 5
      Invest in Indexing for<br/>Query-Heavy Workloads
      Precompute structure<br/>once enable O(1) queries
      Payoff: O(kc×V) space<br/>sublinear in edges
      Benefit: Flatter runtime<br/>curves vs density growth
    Practical Applications
      Scaling Bottlenecks
        Signal: Dense graphs<br/>with hidden structure
        Action: Identify width<br/>vs node count ratio
        Apply: Models 1, 4
      Dependency Management
        Signal: Build systems<br/>task scheduling<br/>knowledge graphs
        Action: Extract transitive<br/>closure patterns
        Apply: Models 3, 4
      Query Performance
        Signal: Reachability checks<br/>repeated frequently
        Action: Build chain-based<br/>indexes
        Apply: Models 2, 5
      Abstraction Design
        Signal: Layering decisions<br/>for complex systems
        Action: Decompose into<br/>coordination boundaries
        Apply: Models 3, 5
      Optimization Paradoxes
        Signal: Good-enough-fast<br/>might beat optimal-slow
        Action: Profile downstream<br/>value not solution quality
        Apply: Model 2
```
