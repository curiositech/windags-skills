# The Cognitive Demands Table: From Raw Data to Actionable Insight

## The Representation Problem

Cognitive Task Analysis interviews generate vast amounts of qualitative data—stories, examples, cues, strategies, observations. A typical ACTA session with one expert produces 10-15 pages of notes. After interviewing 3-5 experts, you have 50-75 pages of rich but overwhelming information.

The Cognitive Demands Table solves a critical problem that stymies most knowledge management efforts: transforming raw interview data into a representation that non-experts can use to make design decisions. It's a forcing function that compels the analyst to identify patterns, reconcile differences, and extract actionable insights.

## The Four-Column Structure

**Difficult Cognitive Element** - What aspect of the task requires expertise? This must be specific enough to be meaningful but general enough to appear across multiple interviews. Bad: "The job is hard." Good: "Knowing where to search after an explosion in an office building."

**Why Difficult?** - What makes this hard for someone without experience? This surfaces the novice-expert gap explicitly. For "knowing where to search": "Novices may not be trained in dealing with explosions. Other training suggests you should start at the source and work outward. Not everyone knows about Material Safety Data Sheets that contain critical information."

**Common Errors** - What mistakes do less-experienced people make? For searching after explosion: "Novice would be likely to start at the source of the explosion. Starting at the source is a rule of thumb for most other kinds of incidents."

**Cues and Strategies Used** - What information do experts attend to, and how do they use it? For explosion search: "Start where you are most likely to find victims, keeping in mind safety considerations. Refer to Material Safety Data Sheets to determine where dangerous chemicals are likely to be. Consider the type of structure and where victims are likely to be. Consider the likelihood of further explosions."

## Why This Structure Works

**Forces synthesis across interviews** - If you interviewed three fireground commanders and they each told different stories about explosions, the Cognitive Demands Table requires finding the common cognitive challenge: assessing where victims are likely to be given incomplete information and safety constraints.

**Makes tacit knowledge explicit** - Experts don't say "I use Material Safety Data Sheets to determine chemical locations." They say "Check the MSDS." The analyst must infer why this matters (determines dangerous chemical locations) and when novices would miss it (not everyone knows these exist).

**Separates domain content from cognitive skill** - The "difficult cognitive element" might be "diagnosing intermittent network failures." The "why difficult" is often a cognitive reason applicable across domains: "The failure isn't present when you're looking for it, requiring mental reconstruction from traces it left behind."

**Provides design guidance directly** - Each row in the table implies training or system design interventions:
- Train the cognitive skill (how experts do it differently)
- Surface the critical cues (make them more visible)
- Alert to common errors (warnings or checks)
- Provide expert strategies as heuristics (decision support)

## Application to Agent System Design

### Skill Inventory for Agent Capabilities

Each row in a Cognitive Demands Table defines a capability that an agent might need:

**Difficult Element**: "Determining whether a building is likely to collapse"

This becomes a capability spec:
- **Inputs required**: Building age/type, fire duration, weather conditions, visible damage, sounds
- **Reasoning type**: Pattern recognition + causal modeling
- **Output**: Probability estimate + confidence + key indicators
- **Failure mode**: False negatives (missing subtle cues) or false positives (over-reacting to minor issues)

**Common Errors** column defines test cases - the agent should NOT make these mistakes that novices make.

**Cues and Strategies** column defines feature importance - these are the inputs the agent should weight heavily.

### Decomposition and Routing Logic

The Cognitive Demands Table reveals which aspects of a task require which types of reasoning:

**Pattern recognition tasks** (cues column emphasizes perceptual signals):
- "Heavy smoke from eaves indicates attic fire"
- "Rhythmic slapping sound indicates uneven tire wear"
- Route to perception-specialized agents or neural pattern matchers

**Causal reasoning tasks** (why difficult involves understanding mechanisms):
- "Ventilating the attic draws fire upward through pipes and electrical system"
- "This wear pattern indicates front-end alignment problem"
- Route to causal model-based reasoners or simulation engines

**Heuristic/optimization tasks** (strategies column lists shortcuts):
- "Start search where victims most likely, considering safety"
- "These three checks eliminate 80% of possible causes"
- Route to constraint satisfaction or planning agents

**Knowledge-intensive tasks** (why difficult mentions information novices don't have):
- "Novices don't know about Material Safety Data Sheets"
- "Requires knowing typical failure signatures for this equipment type"
- Route to knowledge base lookup or retrieval-augmented generation

### Training Data Generation

Each row in the Cognitive Demands Table implies training examples:

**For the "searching after explosion" row:**

Positive examples:
- Expert started search in office areas despite explosion source being in storage area (victims more likely in offices)
- Expert checked MSDS before entering (identified chemical hazards)

Negative examples (from Common Errors column):
- Started at explosion source despite low victim probability
- Proceeded without checking MSDS and encountered unexpected hazards

The "why difficult" column often suggests hard negatives—examples that look right to novices but are wrong:
- Starting at source works for most fires (correct in other contexts)
- But starting at source is wrong when explosion + chemicals involved

This type of contrastive data (what's right in context A but wrong in context B) is exactly what current ML systems struggle with.

### Explanation Generation

When an AI system must explain its reasoning to users, the Cognitive Demands Table structure provides the explanation template:

User asks: "Why are you recommending searching the offices first instead of starting at the explosion site?"

Agent explains:
1. **Cognitive element**: "Determining search priority after explosion requires balancing victim likelihood with safety"
2. **Why standard approach fails**: "The usual rule of starting at the source works for typical fires but is dangerous after explosions with chemical involvement"
3. **Cues I'm using**: "MSDS indicates hazardous chemicals in storage area near explosion source. Office areas have higher occupancy during business hours"
4. **Strategy**: "Search where victims are most likely while maintaining crew safety. Check MSDS to identify hazard locations"

This explanation structure—what makes this hard, why standard approaches fail, what I'm noticing, and what strategy I'm applying—matches how experts explain decisions to learners.

### Error Detection and Recovery

The "Common Errors" column defines anti-patterns that the system should detect:

**In agent self-monitoring**:
- Agent detects it's about to "start at the explosion source"
- Checks whether this matches the common error pattern
- Verifies whether the conditions that make this an error are present (chemicals, explosion vs. fire)

**In human-AI collaboration**:
- System detects user is about to make a common novice error
- Provides warning: "Starting at the explosion source is appropriate for most fires, but with chemical involvement and explosion, searching high-occupancy areas first while verifying chemical locations is safer"

**In multi-agent coordination**:
- Agent A proposes action that agent B recognizes as a common error for the current situation type
- Agent B explains why this is typically wrong in this context
- Agents negotiate alternative approach based on expert strategies

## Handling Expert Disagreement

In the evaluation study, sometimes different experts gave conflicting advice. The Cognitive Demands Table surfaces this explicitly:

**Difficult Element**: "Diagnosing network failure with intermittent symptoms"

**Cues and Strategies**:
- Expert A: "Check logs chronologically to find when issue first appeared"
- Expert B: "Sample logs at multiple time points to find pattern"
- Expert C: "Start with most recent logs and work backward until finding last normal state"

Rather than hiding disagreement, the table shows alternative strategies exist. For agent systems, this suggests:

1. **Multiple strategies should be available** (agent can select based on context)
2. **Strategy selection becomes a meta-task** (when to use which approach)
3. **Evaluation metrics should allow multiple valid solutions** (don't assume single ground truth)

## The Consolidation Challenge

Creating a Cognitive Demands Table from multiple interviews requires reconciling:

**Different levels of abstraction**:
- Expert A: "Look at the smoke"
- Expert B: "Notice color, volume, movement, and pressure of smoke"
- Analyst must decide: Are these the same element at different detail levels, or different elements?

**Different terminology**:
- Fireground Commander: "Do a size-up"
- Navy instructor: "Establish situation awareness"
- Same cognitive element, different professional language

**Different emphases based on experience**:
- Very experienced expert: "Trust your gut feeling that something's off"
- Recently experienced expert: "Systematically check these five indicators"
- Both describe valid expertise but at different developmental stages

The analyst must use judgment to synthesize these into coherent cognitive demands. This is why the evaluation study had SME raters assess the output—to verify that analyst synthesis preserved validity.

## Boundary Conditions

**When Cognitive Demands Tables Work Well:**

1. **Multiple interviews completed** - Patterns emerge when you have 3-5+ experts describing similar challenges
2. **Focused task scope** - Tables work for specific tasks (signal threat analysis, size-up), not entire job roles
3. **Clear novice-expert performance gap** - If novices and experts do the same thing, nothing to capture
4. **Analyst has domain familiarization** - Not expertise, but enough orientation to understand what experts are describing

**When They Fail or Need Modification:**

1. **Highly team-dependent tasks** - Table captures individual cognition; team coordination requires different representation (information flow diagrams, shared mental model maps)

2. **Perceptual skills dominant** - When expertise is "I can hear the difference" and expert can't articulate cues, strategies column stays thin

3. **Highly proceduralized with rare exceptions** - If 95% of task is checklist + 5% expert judgment, table may contain only 1-2 rows

## For Multi-Agent Orchestration Systems

The Cognitive Demands Table directly translates to agent orchestration architecture:

**Each row becomes a skill/capability that some agent must provide**:
```
CognitiveSkill: "DetermineCollapseRisk"
Difficulty: ["VisualCuesSubtle", "RequiresCausalModel", "TimeConstrained"]
Inputs: ["BuildingAge", "FireDuration", "VisibleDamage", "AuditorySignals"]
CommonErrors: ["OverrelyOnVisualOnly", "IgnoreAuditoryCues", "MissDeadspaceSignificance"]
ExpertStrategies: ["IntegrateMultipleCueSources", "MentallySimulateStructuralPhysics", "CompareToTypicalVsAtypical"]
RequiredAgentCapabilities: ["PatternRecognition", "CausalReasoning", "UncertaintyHandling"]
```

**"Why Difficult" column suggests where agent assistance is most valuable**:
- "Novices don't know X" → Provide knowledge augmentation
- "Hard to notice Y" → Provide perceptual highlighting
- "Requires tracking Z simultaneously" → Provide memory/attention support

**"Common Errors" column defines safety checks**:
- Before executing high-stakes actions, verify not falling into known error patterns
- "You're about to start at explosion source. Are you sure this isn't the chemical explosion case?"

**"Cues and Strategies" column defines required context**:
- What information must be available for this cognitive skill to work?
- What computation must be performed to make cues accessible?

The table becomes both a requirements document (what capabilities the system needs) and an architecture diagram (how capabilities relate to tasks).