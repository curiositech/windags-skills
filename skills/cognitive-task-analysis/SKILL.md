---
license: Apache-2.0
name: cognitive-task-analysis
description: Methodology for eliciting expert knowledge about cognitive processes, decisions, and mental models in complex tasks
category: Cognitive Science & Decision Making
tags:
  - cta
  - task-analysis
  - expertise
  - knowledge-elicitation
  - methodology
---

# Cognitive Task Analysis for Agent Systems

Expert knowledge elicitation methodology focused on capturing procedural knowledge, identifying automation gaps, and matching elicitation methods to knowledge architectures.

## DECISION POINTS

### Primary Branch: Diagnosing Agent Performance Gaps

```
Is expert performance significantly better than agent performance on this task?
├─ YES: Automation gap likely
│   ├─ Agent has correct facts but wrong execution → Declarative/procedural mismatch
│   │   └─ Action: Use observational methods + process tracing
│   └─ Agent lacks pattern recognition skills → Missing classification procedures  
│       └─ Action: Use think-aloud with expert cases + critical decision method
└─ NO: Knowledge completeness issue
    ├─ Agent fails on edge cases → Incomplete coverage
    │   └─ Action: Expand expert pool + use multiple elicitation methods
    └─ Agent inconsistent on similar cases → Representation format mismatch
        └─ Action: Audit method-to-format coupling + redesign knowledge base
```

### Secondary Branch: Method Selection

```
What type of knowledge does this task primarily require?
├─ Declarative ("knowing that" - facts, concepts, relationships)
│   └─ Use: Concept mapping, structured interviews, card sorting
├─ Procedural-Classification ("knowing which" - pattern recognition)
│   └─ Use: Think-aloud with cases, critical decision method, paired comparisons
└─ Procedural-Execution ("knowing how" - step sequences)
    ├─ Expert can explain steps → Use: Process tracing, task decomposition
    └─ Expert cannot explain → Use: Observational shadowing + protocol analysis
```

### Tertiary Branch: Knowledge Base Quality Assessment

```
How was this knowledge captured?
├─ Single method used → High risk of knowledge gaps
│   ├─ Interview/self-report only → Missing automated procedures
│   └─ Observation only → Missing conceptual frameworks
├─ Multiple methods used → Check method-knowledge type alignment
│   └─ Methods match knowledge types → Proceed to validation
└─ Unknown/undocumented → Assume incomplete capture
    └─ Action: Re-elicit with method triangulation
```

## FAILURE MODES

### 1. Automation Gap Blindness
**Detection**: Agent performs poorly on tasks experts handle effortlessly, despite having "complete" knowledge base built from expert interviews
**Root Cause**: Automated expert knowledge is inaccessible to self-report; interview methods only capture conscious, declarative layer
**Fix**: Add observational methods (shadowing, process tracing) and think-aloud protocols during actual task performance

### 2. Representation Bias
**Detection**: Knowledge base structure suspiciously mirrors intended output format (e.g., all knowledge fits cleanly into IF-THEN rules)
**Root Cause**: Output format drove method selection instead of knowledge type driving method selection
**Fix**: Re-elicit using methods matched to knowledge architecture, then adapt representation format to captured knowledge

### 3. Single-Method Tunnel Vision
**Detection**: All domain knowledge captured using one elicitation technique; gaps appear in specific contexts
**Root Cause**: Belief that one method can capture all knowledge types; ignores differential access hypothesis
**Fix**: Map knowledge types required by task, select complementary methods for each type, triangulate results

### 4. Expert Reconstruction Fallacy
**Detection**: Expert explanations are overly logical/linear; agent follows explanations but fails on expert-level cases
**Root Cause**: Experts construct plausible post-hoc narratives rather than reporting actual cognitive process
**Fix**: Use concurrent protocols (think-aloud during task) rather than retrospective explanations

### 5. Typological Skill Proliferation
**Detection**: Skill library grows continuously without consolidation; routing failures increase with library size
**Root Cause**: Skills organized by surface features rather than knowledge architecture; lacks theoretical organizing principle
**Fix**: Classify skills by knowledge type produced/consumed; consolidate using Hempel's reduction criterion

## WORKED EXAMPLES

### Example 1: Medical Diagnosis Agent Underperformance

**Scenario**: Radiologist expert can spot lung nodules in chest X-rays with 95% accuracy in 3 seconds. AI agent trained on same images achieves 78% accuracy with 30-second processing.

**Expert Interview Attempt**: 
- Q: "How do you spot lung nodules?"
- A: "I look for density differences, irregular shapes, and size patterns. You check the upper lobes first, then lower lobes..."

**Initial Implementation**: Rule-based system checking density thresholds, shape parameters, systematic scanning pattern. Performance: 65% accuracy.

**CTA Method Application**:
1. **Knowledge Type Analysis**: Task requires procedural-classification (pattern recognition), not declarative facts
2. **Method Selection**: Think-aloud during live cases + eye-tracking observation
3. **Key Finding**: Expert gaze patterns showed 200ms fixations on suspicious regions before conscious recognition; automated pattern matching occurred before declarative knowledge activated

**Outcome**: Redesigned agent with pattern recognition model trained on expert gaze data + semantic features. Performance: 91% accuracy.

**What Novice Missed**: Assumed expert's verbal explanation captured actual recognition process
**What Expert Caught**: Distinguished between post-hoc explanation and real-time cognitive process

### Example 2: Financial Trading Decision System

**Scenario**: Expert trader makes profitable split-second decisions on market volatility. Initial agent built from trading strategy documents performs poorly.

**Document Analysis Approach**: Extracted rules from strategy documents: "When VIX > 25 and S&P drops > 2%, buy volatility protection..."

**Performance**: 23% of trades profitable (random chance ≈ 30%)

**CTA Method Application**:
1. **Failure Mode Diagnosis**: Automation gap - documents contain conscious strategies, not automated pattern recognition
2. **Method Selection**: Concurrent protocol analysis during live trading + retrospective critical decision method
3. **Knowledge Architecture**: Found three layers:
   - Declarative: Market theories and formal strategies (captured in documents)
   - Procedural-classification: Pattern recognition of market "feel" and momentum shifts
   - Procedural-execution: Timing and sizing decisions based on risk appetite

**Key Discovery**: Expert's profitable decisions came from recognizing subtle momentum patterns in real-time price action, not from following documented strategies.

**Redesign**: Hybrid system combining formal strategies (for position direction) with pattern recognition model (for timing and sizing).

**Performance**: 67% profitable trades.

### Example 3: Customer Service Routing System

**Scenario**: Expert human router assigns customer inquiries to specialist teams with 94% first-contact resolution. Automated system achieves 71%.

**Initial Approach**: Keyword matching based on inquiry categories expert provided in interview.

**CTA Application**:
1. **Method**: Concurrent think-aloud + case comparison method
2. **Discovery**: Expert used multiple information sources simultaneously:
   - Surface content (captured by keywords)
   - Customer frustration level (detected in language patterns)
   - Interaction history (pattern of previous contacts)
   - Team capacity and expertise overlap

**Critical Insight**: Expert performed multi-dimensional classification, not single-category assignment. Keyword approach captured only one dimension.

**Implementation**: Multi-factor routing algorithm weighing content classification, sentiment analysis, customer history clustering, and real-time team capacity.

**Result**: 89% first-contact resolution.

## QUALITY GATES

- [ ] Knowledge elicitation used at least two different methods matched to knowledge types required
- [ ] Expert performance benchmarks established and agent performance gaps quantified
- [ ] Automated vs. conscious expert knowledge explicitly distinguished in knowledge base
- [ ] Method selection documented with rationale for each knowledge type targeted
- [ ] Representation format chosen after knowledge capture, not before
- [ ] Edge cases and failure modes tested against expert judgment samples
- [ ] Knowledge base includes both declarative concepts and procedural execution steps
- [ ] Expert reconstruction vs. actual cognitive process distinction validated through observation
- [ ] System performance approaches expert performance on time-pressured, routine decisions
- [ ] Agent can explain its reasoning at appropriate level of detail for each knowledge type

## NOT-FOR BOUNDARIES

**Do NOT use CTA for:**
- Pure factual knowledge where experts are reliable self-reporters
- Tasks where statistical/ML approaches already match expert performance
- Domains where expert knowledge is primarily declarative and well-documented
- Simple rule-following tasks without complex pattern recognition

**Delegate instead:**
- For factual knowledge extraction → Use structured interviews or documentation analysis
- For statistical pattern recognition → Use machine learning with sufficient training data  
- For workflow optimization → Use process mapping and lean methodologies
- For knowledge organization → Use ontology engineering approaches

**This skill is specifically for capturing expert cognitive processes that are:**
- Partially or fully automated (fast, unconscious)
- Involving complex pattern recognition
- Requiring procedural knowledge that experts cannot fully articulate
- Creating performance gaps between human experts and automated systems