# Pattern Matching as the Primary Decision Mechanism in Expert Systems

## Core Insight

The Recognition-Primed Decision (RPD) model fundamentally reframes how intelligent systems should approach decision-making. Rather than generating multiple options and comparing them systematically—the approach assumed by traditional decision theory and most current AI architectures—expert decision makers "use their experience in the form of a repertoire of patterns" (Klein, 1989). These patterns are not simple templates but rich knowledge structures that simultaneously:

1. Describe primary causal factors operating in the situation
2. Highlight the most relevant cues
3. Provide expectancies about what will happen next
4. Identify plausible goals
5. Suggest typical types of reactions

Klein's research with fireground commanders revealed that 80-90% of decisions followed the RPD strategy: "When people need to make a decision they can quickly match the situation to the patterns they have learned. If they find a clear match, they can carry out the most typical course of action."

## Implications for Agent System Design

**Current State Problem**: Most multi-agent orchestration systems treat decision-making as option generation followed by evaluation. An agent facing a complex problem will decompose it into subtasks, generate multiple approaches, score them against criteria, and select the highest-scoring option. This mirrors the classical decision theory approach that Klein's research shows experts don't actually use.

**Pattern-Based Alternative**: An agent system designed around RPD principles would:

1. **Build Pattern Libraries Through Experience**: Rather than starting fresh with each problem, agents should accumulate case libraries where each case captures: the situation context, the cues that mattered, what was expected, what actually happened, and what action was taken. This is closer to case-based reasoning but richer—patterns aren't just similar past situations but compressed expertise.

2. **Match First, Generate Second**: When encountering a problem, the first step isn't "what are all possible approaches?" but "what pattern does this match?" The pattern match immediately suggests a course of action without requiring explicit option generation.

3. **Use Generation as Fallback**: Only when no clear pattern match exists should the system fall back to generative problem-solving. Klein notes that his fireground commanders sought more information or reassessed the situation when it wasn't familiar—they didn't immediately start generating novel solutions.

## Boundary Conditions and Failure Modes

Klein is explicit that this approach depends on experience: "The NDM movement shifted our conception of human decision making from a domain-independent general approach to a knowledge-based approach exemplified by decision makers who had substantial experience."

**When Pattern Matching Fails**:
- **Novel Situations**: When agents encounter truly unprecedented problems, pattern libraries provide no match. The system needs clear signals that it's operating outside known patterns.
- **Surface Similarity Traps**: Patterns might match on superficial features while differing on critical dimensions. Klein's solution is mental simulation (covered in another document), but agents need mechanisms to detect false pattern matches.
- **Pattern Interference**: Multiple partially-matching patterns can create confusion. Human experts have implicit weighting; agent systems need explicit conflict resolution.

**The Novice Problem**: Klein's research focused on experienced decision-makers. A new agent with no accumulated patterns can't use RPD effectively. This suggests a developmental trajectory: early in deployment, agents must use more deliberative, analytical approaches; as they accumulate experience, they can shift toward pattern-based decisions.

## Design Principles for Pattern-Based Agent Systems

1. **Pattern Representation Must Be Rich**: Simple key-value pairs or feature vectors won't suffice. Patterns must capture causal relationships, temporal dynamics, expectancies, and action affordances. Consider knowledge graph representations where nodes are situation elements and edges encode relationships, typical sequences, and outcome expectations.

2. **Similarity Metrics Need Context**: Two situations might be similar on features but different in what matters. Pattern matching requires understanding which dimensions are critical for this decision type. This suggests meta-patterns: patterns about which patterns apply when.

3. **Pattern Libraries Should Be Shareable**: Klein studied individual experts, but in multi-agent systems, patterns learned by one agent should be available to others (with appropriate context about when they apply). This is organizational learning at the system level.

4. **Confidence Calibration**: Pattern matches vary in strength. A weak match might trigger mental simulation (evaluation); a strong match might proceed directly to action. Agents need calibrated confidence in pattern matches.

## Evidence and Validation

Klein's critical finding: "Klein, Wolf, Militello, and Zsambok (1995) found that chess players were not randomly generating moves that they would then evaluate. Rather, the first moves that occurred to them were much better than would be expected by chance." 

This supports the prediction "that for experienced decision makers, the first option they consider is usually satisfactory." For agent systems, this suggests that if pattern matching is working correctly, the first suggested action should have high success probability. If agents frequently reject their first pattern-matched suggestion, either the patterns are inadequate or the matching mechanism is flawed.

## What Makes This Distinctive

Most AI decision-making research focuses on search, optimization, and systematic comparison. Even case-based reasoning typically retrieves cases to inform deliberative analysis. Klein shows that **pattern matching can be the complete decision mechanism**—not a preprocessing step before "real" decision-making but the decision itself. The pattern doesn't just narrow the search space; it specifies the action.

This is uncomfortable for systems that want explainability. "Why did you take that action?" "Because the situation matched Pattern 47" feels less rigorous than "I evaluated 12 options on 8 criteria and this scored highest." But Klein's research suggests the latter is not how expertise actually works. Agent systems may need to embrace pattern-based decisions while developing separate mechanisms for explaining pattern content and match quality.

## Integration with Task Decomposition

For complex problems requiring decomposition, pattern matching operates at multiple levels:
- **Situation Categorization**: "This is a database performance problem" (high-level pattern)
- **Approach Selection**: "For this type of DB problem, we profile queries first" (strategy pattern)
- **Tactic Execution**: "Slow query patterns suggest missing indexes" (tactical pattern)

Each level uses pattern matching to avoid exhaustive search of possibility spaces. The system rapidly navigates from problem to solution through a cascade of pattern recognitions rather than a single monolithic decision.