# Situation Assessment as Primary Cognitive Work: Recognition Before Decision

## The Paradigm Shift

Traditional decision research focused on choice: given multiple options, how do people select among them? Klein reveals this focuses on the wrong stage: "The decision-making process was expanded to include a prior stage of perception and recognition of situations, as well as generation of appropriate responses, not just choice from among given options."

For Klein's fireground commanders, the hard cognitive work wasn't comparing strategies for fighting a fire—it was **recognizing what kind of fire they faced**. Once they recognized the situation type, the appropriate response often followed directly.

This inverts the traditional understanding: decision-making isn't primarily about choice; it's primarily about situation assessment. Choice only happens when assessment is ambiguous.

## What Situation Assessment Actually Involves

Klein describes how patterns encompass multiple dimensions simultaneously:
1. **Primary causal factors** operating in the situation
2. **Relevant cues** that indicate situation type
3. **Expectancies** about what will happen next
4. **Plausible goals** appropriate to this situation
5. **Typical types of reactions** that work here

Notice: all of this happens during situation assessment, before any "decision" in the traditional sense. By the time the fireground commander recognizes "this is a defensive fire," they already know:
- Why it's defensive (causal factors: too much heat, structural instability)
- What cues indicate this (smoke patterns, flame behavior, building construction)
- What to expect (potential collapse, spread to exposures)
- What's achievable (protect adjacent structures, not save this building)
- What to do (pull crews back, apply water from outside, cover exposures)

**The "decision" is just executing what the situation assessment suggests.**

## Implications for Agent Architecture

Most AI agent systems treat situation assessment as information gathering preliminary to the "real work" of decision-making. Klein shows this is backwards.

### Current Typical Flow:
1. Gather information
2. Generate options
3. Evaluate options (THE HARD PART)
4. Choose
5. Execute

### Recognition-Primed Flow:
1. **Assess situation** → Pattern match (THE HARD PART)
2. Retrieve associated action
3. Mental simulation (validation)
4. Execute (possibly with adaptation)

The cognitive load shifts from step 3 (evaluation) to step 1 (assessment). This has profound architectural implications.

## Cue Recognition: What to Pay Attention To

Klein emphasizes that patterns "highlight the most relevant cues." Experts don't gather all available information—they selectively attend to features diagnostic of situation type.

**For Agent Systems**: Rather than comprehensive information gathering ("get all logs, all metrics, all recent changes"), agents should use cue-directed search:

1. **Initial Quick Assessment**: Scan for high-level situation indicators
   - Error type (500 vs. 404 vs. timeout)
   - Scope (single user vs. all users)
   - System component (database, API, frontend)

2. **Pattern-Directed Deepening**: Based on initial match, gather specific cues
   - If pattern suggests "database connection exhaustion," check connection pool metrics
   - If pattern suggests "memory leak," check heap growth over time
   - If pattern suggests "cache invalidation issue," check cache hit rates

3. **Expectancy-Driven Validation**: Look for cues that should be present if pattern match is correct
   - Pattern: "Database deadlock" → Expect: multiple transactions waiting on locks
   - If expectancy violated → Reassess situation

This is fundamentally different from "gather all data, then analyze." It's hypothesis-driven information gathering, where the hypothesis comes from pattern matching, not exhaustive analysis.

## The Decision Ladder Concept

Klein references Rasmussen's (1983) decision ladder, which "permitted heuristic cutoff paths." The full ladder involves extensive information processing and evaluation, but experts take shortcuts—jumping directly from situation recognition to action without traversing all steps.

**For Agent Orchestration**: Don't force all decisions through the same pipeline. Instead:

- **Recognized situations**: Short path (pattern → simulation → action)
- **Ambiguous situations**: Medium path (pattern → comparison → simulation → action)
- **Novel situations**: Full path (information gathering → option generation → evaluation → simulation → action)

The orchestration system should route based on situation recognition confidence. High confidence → short path; low confidence → longer path.

## Expectancies as Active Predictions

Klein's model includes: "Are expectancies violated?" This isn't passive outcome observation; it's active prediction monitoring.

When a fireground commander recognizes a fire as Type X, they have specific expectations:
- Flame spread should follow this pattern
- Smoke should behave this way
- Water application should have this effect
- Structure should respond like this

If any expectancy is violated—smoke suddenly changes color, water has no effect, collapse happens sooner than expected—this triggers reassessment: "This isn't what I thought it was."

**For Agent Systems**: Situation assessment should generate explicit predictions:

```
Situation Assessment: "Database connection exhaustion"
Expectancies:
  - Connection pool metrics show 100% utilization
  - Application logs show connection timeout errors
  - New connections should take >30s to establish
  - Increasing pool size should resolve issue
  - CPU/memory on DB server should be normal (not root cause)

Action: Increase connection pool size
Monitoring: Check expectancies after action
  - Did new connections establish faster? 
  - Did timeout errors decrease?
  - Did pool utilization drop?
```

If expectancies aren't met, the situation assessment was wrong. This isn't "the solution failed"; it's "the diagnosis was incorrect." Reassess, don't retry.

## Ambiguous Situation Assessment

Klein's model includes: "Is the Situation Familiar? → No → Seek More Information → Reassess Situation."

Not all situations pattern-match clearly. Multiple partial matches, conflicting cues, missing expected features—these indicate assessment ambiguity.

**For Agent Systems**: Explicit confidence scoring on situation assessment:

- **High Confidence**: Clear pattern match, all key cues present, no conflicting indicators → Execute pattern-suggested action
- **Medium Confidence**: Partial match, some missing cues, or multiple competing patterns → Seek additional information, compare patterns, or request human input
- **Low Confidence**: No clear match, novel situation, or contradictory cues → Full analytical mode, possibly escalate to human

The key insight: **assess confidence in the assessment**, not just confidence in the action. If you're not sure what situation you're in, you can't be sure what action is appropriate.

## Situation Categories as Knowledge Structures

Patterns aren't simple templates; they're rich knowledge structures that integrate causal understanding, perceptual cues, temporal dynamics, and action affordances.

**Example: "Database Slow Query Problem" Pattern**

Causal Structure:
- Query execution exceeds timeout
- Caused by: missing indexes, outdated statistics, query plan regression, or lock contention

Perceptual Cues:
- Slow query logs show specific queries
- Execution time orders of magnitude above baseline
- EXPLAIN plans show sequential scans or inefficient joins

Temporal Dynamics:
- Often appears after schema changes or data growth
- May worsen gradually as data accumulates
- Can appear suddenly after ORM/library updates

Expectancies:
- Specific queries should be identifiable
- Adding indexes should reduce execution time
- Query optimizer should prefer new indexes

Action Affordances:
- Primary: Add indexes on frequently-scanned columns
- Secondary: Update table statistics
- Tertiary: Rewrite queries for efficiency
- Fallback: Increase timeouts (temporary workaround)

Context Boundaries:
- Assumes query is fundamentally reasonable
- Doesn't apply if problem is data volume (need partitioning)
- Doesn't apply if problem is lock contention (different pattern)

This rich structure can't be captured by simple key-value pairs or feature vectors. Agent knowledge representation needs to support this complexity.

## Assessment-First Task Decomposition

For complex multi-step problems, traditional decomposition focuses on goal breakdown: "To achieve X, I must do A, B, and C."

Klein's approach suggests assessment-first decomposition: "This is situation type Y, which typically requires addressing aspects P, Q, and R."

The difference: goal-driven decomposition is forward-looking (from desired end state to required steps); situation-driven decomposition is recognition-based (from current state type to typical interventions).

**For Multi-Agent Systems**: When a complex problem arrives:

1. **Master agent assesses overall situation**: "This is a system performance degradation problem affecting the API layer"
2. **Situation type suggests decomposition**: "Typically requires checking: database performance, cache effectiveness, API logic efficiency, network latency"
3. **Spawn specialized agents for each aspect**: Each sub-agent does its own situation assessment in its domain
4. **Integrate findings**: Sub-assessments combine to refine overall situation understanding
5. **Execute integrated response**: Based on refined assessment

This is different from: "Goal: Improve API performance. Subgoals: Optimize database, optimize caching, optimize logic, optimize network. Allocate agents to subgoals."

The assessment-first approach adapts to what the situation actually is, not what the goal structure implies.

## Boundary Conditions: When Assessment Fails

Situation assessment depends on matching current situations to previously-encountered patterns. Failure modes:

1. **True Novelty**: Genuinely new situation with no historical match
2. **Surface Similarity**: Current situation superficially resembles known pattern but differs in critical ways
3. **Multiple Overlapping Patterns**: Situation has features of several patterns with no clear best match
4. **Missing Diagnostic Cues**: Key information needed for pattern matching isn't available

**Mitigation**:
- **Novelty Detection**: Explicitly recognize when no good pattern match exists; escalate to analytical mode
- **Similarity Metrics**: Assess not just pattern match strength but also confidence in the match
- **Pattern Conflict Resolution**: When multiple patterns partially match, use differentiating cues to disambiguate
- **Information Seeking**: Patterns should specify which cues are diagnostic; actively gather those

## What Makes This Distinctive

Klein's core insight is that **situation recognition is not preliminary to decision-making; it is the primary decision-making act**. Once you know what situation you're in, the action often follows directly.

Most AI architectures treat perception/assessment as input processing and decision/planning as the core intelligence. Klein inverts this: pattern matching (assessment) is the expertise; action selection is often straightforward given correct assessment.

For agent systems, this means: invest in rich situation categorization (pattern libraries) more than sophisticated action selection algorithms. If agents correctly assess situations, action selection becomes simpler.