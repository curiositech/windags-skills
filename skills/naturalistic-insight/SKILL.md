---
license: Apache-2.0
name: naturalistic-insight
description: Research on how insights and creative solutions emerge naturally during problem-solving and expertise
category: Cognitive Science & Decision Making
tags:
  - insight
  - problem-solving
  - creativity
  - ndm
  - cognition
---

# SKILL.md: Naturalistic Insight (Klein & Jarosz)

## When to Use This Skill

Load this skill when the user faces challenges where **reframing** rather than **optimizing** is needed:
- Contradiction signals: Data doesn't fit the current model
- Impasse situations: Standard approaches aren't working
- Organizational insight barriers: Teams excel at error prevention but fail to generate new understanding
- Agent/AI system design: Building systems that need to discover novel solutions

## Decision Points

**Primary Decision Matrix: Anomaly Type × Context → Pathway Selection**

```
IF anomalous data persists despite explanation attempts:
├─ IF in research/investigation context → Contradiction Pathway
│  └─ Action: Treat anomaly as most reliable data point
│  └─ Question: "What frame makes this the normal case?"
├─ IF in operational context with time pressure → Knowledge Shield Check
│  └─ Action: Document anomaly for later analysis
│  └─ Escalate to subject matter experts
└─ IF in learning/exploration context → Pattern Accumulation
   └─ Action: Log as gradual insight opportunity
   └─ Set up tracking infrastructure

IF experiencing genuine impasse (multiple solution attempts failed):
├─ IF problem is well-defined domain → Execution Problem
│  └─ Action: Standard decomposition and optimization
├─ IF problem definition feels wrong → Desperation Pathway  
│  └─ Action: Question foundational assumptions
│  └─ Replace strongest anchors systematically
└─ IF expertise feels like obstacle → Expertise Paradox
   └─ Action: Leverage knowledge for pattern detection
   └─ Remain open to frame revision

IF noticing unexpected connections across cases:
├─ IF connection is metaphorical → Connection Pathway
│  └─ Action: Add bridging anchor to mental model
├─ IF connection reveals causal relationship → Analytical Extension
│  └─ Action: Standard hypothesis testing
└─ IF connection spans domains → Cross-Domain Transfer
   └─ Action: Map structural similarities

IF designing for insight generation:
├─ IF users are domain experts → Expertise-Enabled Design
│  └─ Provide pattern libraries and anomaly detection
├─ IF organizational context → Assess Error vs. Insight Culture
│  └─ IF error-focused: Create protected spaces
│  └─ IF insight-friendly: Integrate with existing processes
└─ IF AI/agent system → Multi-Pathway Architecture
   └─ Build contradiction, connection, and desperation modules
```

## Failure Modes

**1. Rubber Stamp Anomaly Dismissal**
- *Detection*: You find yourself explaining away contradictions with increasingly sophisticated technical reasons
- *Symptoms*: Multiple "special cases," forced explanations, mounting cognitive dissonance
- *Fix*: Deliberately treat the weakest piece of evidence as most reliable; explore frames where anomaly is central

**2. Sudden Insight Fixation**
- *Detection*: System/process designed only for "aha!" moments and breakthrough experiences  
- *Symptoms*: Missing 44% of gradual insights, no infrastructure for pattern accumulation
- *Fix*: Build tracking systems for incremental evidence gathering across cases over time

**3. Expertise Contamination Fear**
- *Detection*: Treating domain knowledge as obstacle to fresh thinking
- *Symptoms*: Deliberately excluding experts, seeking "naive" perspectives only
- *Fix*: Recognize expertise enables 2/3 of real insights; leverage knowledge while staying open to revision

**4. Execution Task Decomposition**
- *Detection*: Breaking insight problems into sub-tasks and parallel processing
- *Symptoms*: Progress stalls, sub-solutions don't integrate, frame remains unchanged
- *Fix*: Recognize holistic frame revision needed; don't decompose prematurely

**5. Innovation Theater Deployment**
- *Detection*: Adding insight processes to error-prevention organizations without addressing conflicts
- *Symptoms*: Brainstorming sessions ignored, suggestion boxes empty, innovation initiatives fail
- *Fix*: Create protected spaces with different norms or accept insights will remain accidental

## Worked Examples

### Example 1: AIDS Blood Supply Crisis (Contradiction Pathway)

**Context**: 1981, CDC epidemiologist reviewing unusual pneumonia cases in gay men.

**Initial Frame**: Isolated outbreak, likely lifestyle-related immune suppression.

**Anomaly**: Hemophiliac patients presenting identical symptoms despite completely different demographics.

**Novice Response**: "Hemophiliacs have compromised health anyway—probably coincidence."

**Expert Application of Skill**:
1. **Anomaly Detection**: Two populations with no overlap showing identical rare syndrome
2. **Knowledge Shield Recognition**: Initial tendency to explain away as "different causes, similar symptoms"  
3. **Weak Anchor Examination**: What if the connection IS the explanation?
4. **Frame Shift**: Single transmissible agent affecting both populations
5. **Implication Following**: Blood supply contamination hypothesis
6. **Action**: Test blood products, not just lifestyle factors

**Outcome**: Discovery of bloodborne transmission route, saving thousands of lives.

**Decision Points Navigated**:
- Chose contradiction pathway over connection pathway
- Treated demographic difference as data, not dismissal reason
- Leveraged epidemiological expertise to recognize impossible coincidence

### Example 2: Fire Commander's Escape Decision (Desperation Pathway)

**Context**: Fire commander Klein interviewed, routine house fire response.

**Initial Frame**: Standard interior attack, crew positioned normally.

**Impasse Signals**: Fire not responding to water, heat increasing unexpectedly, no visible progress.

**Expert Application of Skill**:
1. **Impasse Recognition**: Standard procedures failing despite correct execution
2. **Strong Anchor Identification**: "Interior attack is always correct for this type of fire"
3. **Anchor Replacement**: "This fire is not what it appears to be"
4. **Frame Revision**: Basement fire burning undetected, floor about to collapse
5. **Immediate Action**: Order evacuation

**Outcome**: Crew evacuated 30 seconds before floor collapsed.

**Decision Points Navigated**:
- Recognized desperation pathway signals (expertise feels like obstacle)
- Questioned foundational assumptions rather than execution details
- Trusted pattern recognition over procedural compliance

### Example 3: Darwin's Gradual Coral Atoll Insight (Connection Pathway)

**Context**: Darwin studying coral formations during Beagle voyage.

**Pattern Accumulation**: Observing multiple atolls across different locations over months.

**Connection Emergence**: Noticing structural similarity between atolls and barrier reefs around volcanic islands.

**Expert Application of Skill**:
1. **Pattern Tracking**: Systematic documentation of coral structures
2. **Cross-Case Analysis**: Comparing formations across geographic regions  
3. **Geological Knowledge**: Understanding volcanic island subsidence
4. **Bridging Anchor**: "Atolls are sunken barrier reefs"
5. **Prediction Testing**: Drilling should find ancient reef limestone beneath modern coral

**Outcome**: Revolutionary theory of coral formation, confirmed by drilling decades later.

**Decision Points Navigated**:
- Recognized gradual insight pattern (no sudden "aha!" moment)
- Used expertise to detect structural similarities across cases
- Built infrastructure for pattern tracking over extended time periods

## Quality Gates

**Frame Coherence Check**:
[ ] New frame explains previously unexplained anomalies without special pleading
[ ] Frame generates testable predictions different from old model  
[ ] Revised understanding integrates smoothly with established domain knowledge
[ ] Frame addresses root cause, not just symptoms

**Prediction Power Validation**:
[ ] New frame successfully predicts behavior in untested cases
[ ] Predictions are specific enough to risk falsification
[ ] Frame explains both positive and negative cases in dataset
[ ] Model performs better than previous best explanation

**Expert Acceptance Assessment**:
[ ] Domain experts can follow the reasoning path
[ ] Insight leverages rather than dismisses existing expertise  
[ ] Other experts can replicate the insight given same data
[ ] Resistance based on evidence, not just unfamiliarity

**Anomaly Resolution Verification**:
[ ] Original contradiction/impasse is genuinely resolved, not just deferred
[ ] Resolution doesn't create larger contradictions elsewhere
[ ] Previously dismissed data now makes sense within new frame
[ ] Weak anchors that triggered insight are now integrated

**Implementation Readiness**:
[ ] Clear next actions follow from the insight
[ ] Resource and timeline implications are understood
[ ] Organizational barriers to implementation are identified
[ ] Success metrics for new approach are defined

## NOT-FOR Boundaries

**This skill is NOT for**:
- Routine optimization problems with clear metrics → Use `systematic-optimization` instead
- Error correction in well-understood systems → Use `debugging-protocols` instead  
- Incremental improvements to existing processes → Use `continuous-improvement` instead
- Problems with obvious decomposition into subtasks → Use `task-decomposition` instead
- Situations requiring immediate action without reflection → Use `crisis-response` instead

**Delegate to other skills when**:
- User needs brainstorming techniques → Use `creative-ideation` instead
- User wants systematic innovation methods → Use `systematic-inventive-thinking` instead
- User faces behavioral change challenges → Use `behavior-change-design` instead
- User needs decision-making under uncertainty → Use `decision-analysis` instead
- User requires team creativity facilitation → Use `group-problem-solving` instead

**Critical boundary**: This skill focuses on naturalistic insight (how insights actually emerge in real contexts) not laboratory creativity (puzzle-solving, divergent thinking exercises). If the user wants "innovation training" or "creative thinking workshops," redirect to appropriate facilitation skills.