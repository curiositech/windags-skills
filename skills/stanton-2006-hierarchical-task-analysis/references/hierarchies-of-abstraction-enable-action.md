# Hierarchies of Abstraction Enable (or Prevent) Effective Action

## The Abstraction Problem: Detail vs. Comprehension

Miller, Galanter & Pribram (1960) noted that the hammering analysis (figure two in source) could continue indefinitely: "hammer nail" decomposes to "lift hammer" and "strike nail," which decompose to muscle activations, which decompose to neural signals, which decompose to molecular interactions.

At what level should analysis stop? They observed: "most of the therbligs refer to physical movement, there were some 'cognitive' therbligs, such as 'search,' 'select,' and 'find.'" The critical insight: abstraction level determines what's visible.

At molecular level, you can't see "hammering." At behavioral level, you can't see neural computation. At task level, you can't see organizational strategy. Each level of abstraction reveals certain aspects while hiding others.

HTA's contribution: systematic method for navigating abstraction levels through hierarchical decomposition with stopping rules.

## The Three-to-Ten Rule: Cognitive Chunking

Patrick et al (1986) recommend 3-8 immediate subordinates per super-ordinate goal, extending to 10 maximum. Why?

**Cognitive science**: Working memory holds 7±2 chunks (Miller, 1956). More than 10 subordinates exceeds comprehension capacity.

**Practical usability**: Hierarchical diagrams with 3-8 branches are visually parseable. Diagrams with 20 branches are incomprehensible tangles.

**Logical coherence**: If super-ordinate has 15+ subordinates, probably missing an intermediate abstraction level.

Example of too many subordinates:
```
0. Prepare meal (20 subordinates)
  1. Get flour
  2. Get eggs  
  3. Get milk
  4. Get butter
  5. Get sugar
  ...
  20. Wash dishes
```

This is a list, not a hierarchy. Better:
```
0. Prepare meal
  1. Gather ingredients
  2. Mix ingredients
  3. Cook mixture
  4. Serve meal
  5. Clean up
```

Now each super-ordinate has 4-5 subordinates. Further decomposition reveals details:
```
1. Gather ingredients
  1.1. Get dry ingredients (flour, sugar)
  1.2. Get wet ingredients (eggs, milk, butter)
  1.3. Get equipment (bowl, whisk, pan)
```

The abstraction hierarchy enables comprehension at multiple levels:
- **Executive level**: "Prepare meal" (1 goal, overview)
- **Management level**: "Gather, mix, cook, serve, clean" (5 goals, operational flow)
- **Worker level**: "Get flour, eggs, milk..." (20+ goals, execution detail)

Each level is understandable because subordinates are chunked into manageable groups.

## The Right Granularity: What's Too Abstract vs. Too Concrete?

Annett (2004) distinguishes between "abstraction that's appropriate to the purpose" and "abstraction that's too high or too low to be useful."

**Too abstract**: "Solve the problem" → Provides no guidance on how
- Example: "Ensure security" (what does that mean operationally?)
- Agent system: "Be helpful" (what actions does this trigger?)

**Too concrete**: "Move mouse cursor 3cm, click button at pixel (247, 183)" → Binds to specific implementation
- Example: "Press CTRL+SHIFT+F3" (what if keyboard layout changes?)
- Agent system: "Execute command string 'git commit -m \"fix bug\"'" (what if command syntax changes?)

**Appropriate abstraction**: "Commit code changes with descriptive message"
- Abstract enough to allow implementation flexibility (UI vs. command line vs. API)
- Concrete enough to specify what must be achieved (commit, not just save)
- Measurable (can verify commit occurred with message)

Finding appropriate abstraction requires asking:
- **Purpose**: What decision does this level support?
- **Stability**: What's likely to change vs. remain constant?
- **Actionability**: Can someone act on this level of description?

Different purposes need different abstractions:

**Strategic planning**: High abstraction ("Improve system security")  
**Resource allocation**: Medium abstraction ("Implement authentication, encryption, audit logging")  
**Implementation**: Low abstraction ("Use bcrypt for password hashing with cost factor 12")

HTA accommodates multiple abstraction levels simultaneously through hierarchical structure. Top levels stay abstract and stable. Bottom levels become concrete and specific.

## The Interface Between Abstraction Levels: Plans as Bridges

Plans connect abstraction levels by specifying how high-level goals decompose to low-level actions.

Consider: "Make nail flush with surface"
- **Abstract goal**: Nail should not protrude
- **Concrete actions**: Lift hammer, strike nail
- **Plan**: Test if nail protrudes → If yes, lift hammer then strike nail, repeat test → If no, exit

The plan mediates between "flush nail" (abstract) and "hammer movements" (concrete). It answers: "How do these concrete actions achieve that abstract goal?"

Without plans, hierarchy is just taxonomy. With plans, hierarchy is executable specification.

For agent systems, this means:
- **High-level goals** → What the system should achieve (abstract)
- **Low-level skills** → What capabilities exist (concrete)
- **Plans** → How capabilities combine to achieve goals (bridge)

The orchestrator operates at plan level, mapping abstract goals to concrete skill invocations.

## The Stopping Rule Revisited: Abstraction Economy

P×C stopping rule is really an abstraction economy rule: refine abstraction only where precision matters.

Low P×C → Stay abstract. No need for detail when:
- Success is likely (low P)
- Failure is inconsequential (low C)

High P×C → Get concrete. Need detail when:
- Success is uncertain (high P)
- Failure is catastrophic (high C)

This creates variable-depth hierarchies where critical paths are refined to concrete actions while routine paths remain abstract.

Example (emergency response):
- "Receive notification" → Single abstract sub-goal (low P, low C)
- "Identify chemical hazard" → Deep refinement with 5+ levels (high P, high C)

The hierarchy visually communicates where complexity and risk concentrate. Uneven depth is feature, not bug.

For agent systems: Allocate detailed analysis (error prediction, resource estimation, monitoring) to deep branches. Shallow branches get minimal overhead.

## The Wrong Abstraction: When Hierarchies Mislead

Hierarchies can prevent effective action when abstraction is wrong:

### Problem 1: Premature Commitment to Structure

Imposing hierarchy before understanding problem locks in wrong abstraction.

Example: "Respond to security incident" initially decomposed as:
```
1. Detect intrusion
2. Identify attacker
3. Block access
4. Restore system
```

This assumes linear sequence: detect → identify → block → restore.

Reality: Detection and blocking might happen concurrently. Restoration might begin before complete identification. The imposed hierarchy constrains response strategy.

Better: Analyze actual incident response patterns, then extract hierarchy that reflects real dependencies and opportunities.

### Problem 2: Conflating Multiple Abstraction Dimensions

Hierarchies assume single decomposition basis. But systems have multiple valid decompositions:

**Functional decomposition**: What functions exist?
- "Provide authentication" → "Verify credentials" + "Manage sessions" + "Enforce access control"

**Temporal decomposition**: What happens when?
- "User login" → "Enter credentials" → "Verify password" → "Create session"

**Spatial decomposition**: What components exist where?
- "Distributed system" → "Web server" + "Application server" + "Database server"

**Organizational decomposition**: Who does what?
- "Software development" → "Frontend team" + "Backend team" + "DevOps team"

HTA primarily supports functional decomposition (goals and sub-goals). Temporal structure goes in plans. Spatial and organizational structure requires additional annotation.

Trying to encode multiple dimensions in single hierarchy creates confusion. Sub-goals at same level might mix functional, temporal, and organizational concerns.

Solution: Primary hierarchy for functional decomposition, supplementary representations for other dimensions.

### Problem 3: Hiding Cross-Cutting Concerns

Hierarchies partition problems cleanly. But some concerns cross boundaries:

**Security**: Affects authentication, data storage, communication, error handling (multiple branches)
**Performance**: Affects database queries, UI rendering, network calls (multiple branches)
**Error handling**: Affects every sub-goal (all branches)

In functional hierarchy, these cross-cutting concerns get buried in multiple places or omitted entirely.

Shepherd (2001) addresses this with contextual constraint analysis (table thirteen in source): annotate each sub-goal with difficulty, predictability, controllability, consequences, stresses, etc.

These cross-cutting concerns aren't part of hierarchical decomposition but supplementary analysis using hierarchy as framework.

## Abstraction Mismatch: When Levels Don't Align

Problems arise when abstraction levels mix within same hierarchical tier:

**Mixed abstraction**: 
```
1. Analyze codebase
  1.1. Tokenize files (very low-level)
  1.2. Detect security issues (high-level)
  1.3. Write to output buffer (very low-level)
```

Sub-goals 1.1 and 1.3 are implementation details. Sub-goal 1.2 is conceptual outcome. They don't belong at same level.

**Proper abstraction**:
```
1. Analyze codebase
  1.1. Parse code structure
  1.2. Detect security issues  
  1.3. Generate report
```

Now all three are at similar abstraction (functional steps). Implementation details move to deeper levels:
```
1.1. Parse code structure
  1.1.1. Tokenize source files
  1.1.2. Build abstract syntax tree
  1.1.3. Extract semantic information