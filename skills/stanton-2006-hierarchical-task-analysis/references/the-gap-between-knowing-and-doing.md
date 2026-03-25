# The Gap Between Knowing and Doing: Information, Knowledge, and Executable Understanding

## The Understated Problem in HTA Applications

Stammers & Astley (1987) added an "Information Assumed" column to their interface design analysis. This seemingly minor addition addresses a profound problem: systems fail not because procedures are wrong but because operators lack prerequisite knowledge to execute procedures.

Their coal preparation plant analysis shows:
- Sub-goal: "Start-up plant"
- Information assumed: "Start-up procedure" (must memorize order: C10, R2, C12)
- Sub-goal: "Run plant"  
- Information assumed: "Knowledge of plant flows and operational procedures"
- Sub-goal: "Fault diagnosis"
- Information assumed: "Some understanding of faults"

Notice: these aren't information needs (what must be displayed) but knowledge prerequisites (what must be already known). The distinction matters enormously for system design.

## Three Types of Knowledge Requirements

### 1. Procedural Knowledge: How to Execute

Knowing the sequence of actions. "Press button A, wait for indicator B, then press button C."

This is what traditional task analysis captures well. HTA plans encode procedural knowledge: "Do 1 then 2 then 3."

**Agent parallel**: Skill execution knowledge. How to invoke a function, what parameters it expects, what output format it produces.

**Problem**: Procedures work only when you understand why steps exist and when variations are needed. Rote execution breaks down under novelty.

### 2. Domain Knowledge: Why Things Work

Understanding the underlying system. "Pressing button A opens valve V, which allows flow from reservoir R1 to R2, which balances pressure."

This is largely absent from traditional HTA but critical for:
- Adapting procedures to unusual situations
- Diagnosing failures when procedures don't work
- Anticipating consequences of actions
- Making trade-off decisions

**Agent parallel**: Domain models. Understanding what code constructs do, what security vulnerabilities mean, why certain patterns are problematic.

**Problem**: Domain knowledge is vast. Which parts are essential for which sub-goals? HTA doesn't specify this systematically.

### 3. Strategic Knowledge: When to Apply What

Knowing which procedure or approach fits which situation. "If pressure rising rapidly use emergency shutdown sequence. If rising slowly use controlled reduction procedure."

This is encoded partially in plans (conditional logic) but plans assume you can evaluate conditions. Strategic knowledge is knowing what "rising rapidly" means, why it matters, what's at stake.

**Agent parallel**: Task-appropriate skill selection. Knowing when deep analysis is needed vs. quick heuristic, when to escalate to human vs. proceed autonomously.

## The Annotation Problem: Capturing Knowledge Requirements

Bruseberg & Shepherd (1997) propose annotating each sub-goal with knowledge requirements. But this is harder than it sounds:

**Explicit knowledge**: Can be stated in words/symbols. "The sequence is C10, R2, C12."
- Captured in procedures, manuals, training materials
- Can be externalized (written down, programmed)
- Transferable through instruction

**Tacit knowledge**: Acquired through experience, difficult to articulate. "You can feel when the system is about to fail."
- Captured in expertise, intuition, pattern recognition
- Resists externalization
- Transferable through apprenticeship, practice

**Implicit knowledge**: Assumed as background, not consciously considered. "The plant operates according to thermodynamic principles."
- Often cultural or domain-standard
- Becomes visible only when absent (novices don't have it)
- Transferable through enculturation

HTA can annotate explicit knowledge ("must know X") but struggles with tacit and implicit. Yet these are often where critical breakdowns occur.

## The Training Design Implication

HTA was originally developed for training specification. The logic:
1. Decompose task into sub-goals
2. For each sub-goal, identify required knowledge/skills  
3. Design training to develop those knowledge/skills
4. Sequence training to match task hierarchy

This works beautifully when knowledge requirements are explicit and procedural. But consider:

**Sub-goal**: "Make decision about nature of incident"  
**Knowledge required**: "Understanding of hazard types, propagation patterns, severity indicators, available resources, risk trade-offs, regulatory constraints"

How do you train that? Not by memorizing procedures. You need:
- **Conceptual instruction**: What are hazard types? How do they propagate?
- **Case-based learning**: Here are 50 incidents, analyze each  
- **Simulation**: Practice decision-making under realistic conditions
- **Feedback**: Experts critique your decisions, explain better alternatives
- **Reflection**: Articulate your decision rationale, identify gaps

The sub-goal hierarchy guides training scope (what needs to be learned) but doesn't specify training method (how to learn it). That requires deeper analysis of knowledge types.

Patrick et al (1986) recognized this and proposed augmenting HTA with:
- **Knowledge prerequisites**: What must be already known
- **Skill components**: What capabilities must be developed
- **Learning objectives**: What mastery criteria apply
- **Training methods**: What instructional approaches fit

This transforms HTA from task description to learning architecture.

## The Interface Design Implication

Stammers & Astley's insight: interfaces must provide information that compensates for knowledge gaps.

If operator knows plant topology perfectly, interface can show abstract symbols. If operator is novice, interface needs spatial layout showing physical relationships.

If operator understands causal relationships, interface can show effects and let operator infer causes. If operator lacks causal model, interface needs diagnostic support that suggests causes.

The "information assumed" column identifies design trade-offs:
- **Assume more knowledge → Simpler interface, but excludes less knowledgeable users**
- **Assume less knowledge → More comprehensive interface, but cluttered for experts**

Resolution: Adaptive interfaces that reveal complexity progressively as user demonstrates mastery. But this requires explicit modeling of knowledge requirements per sub-goal.

## The Agent Design Implication: Skill Prerequisites

For AI agents, the knowing-doing gap manifests as:

**Skill availability ≠ Skill applicability**

You might have a "code refactoring" skill, but knowing when to apply it requires understanding:
- What makes code "need refactoring"?
- What trade-offs exist (time vs. quality)?
- What downstream consequences matter (will this break tests)?
- What alternatives exist (refactor now vs. later vs. never)?

These aren't skill parameters; they're contextual knowledge needed to decide whether to invoke the skill.

Design implications:

### 1. Explicit Prerequisite Specification
Each skill declares:
- Required input information (data dependencies)
- Required domain knowledge (conceptual prerequisites)  
- Required context (when is this skill applicable)

Example:
```
Skill: "Detect SQL injection vulnerabilities"
Input: Codebase with database queries
Domain knowledge: Understanding of SQL syntax, parameterized queries, input sanitization
Context: Web application with user-facing forms
```

This makes knowledge gaps explicit. If agent lacks domain knowledge, it can't reliably use skill.

### 2. Graduated Skill Versions  
Same functional goal, different knowledge requirements:

- **Basic version**: Pattern matching (low knowledge requirement)
- **Intermediate version**: Structural analysis (medium knowledge requirement)  
- **Advanced version**: Semantic reasoning (high knowledge requirement)

Agent selects version based on available knowledge/resources.

### 3. Skill Composition with Knowledge Transfer
Some skills produce knowledge that other skills consume:

- Skill A: "Analyze codebase structure" → Produces architectural model
- Skill B: "Identify design issues" → Consumes architectural model

The architectural model is both output (information) and input (knowledge). This makes knowledge flow explicit in agent coordination.

### 4. Meta-Skills for Knowledge Acquisition
Skills that build knowledge rather than perform tasks:

- "Learn domain terminology from codebase"
- "Build causal model from documentation"
- "Extract design patterns from examples"

These meta-skills address knowledge gaps dynamically rather than assuming prerequisites.

## The Implicit Assumption Problem

Many HTA analyses contain hidden assumptions about what operators/agents "obviously know."

Example (emergency response): Sub-goal "Assess situation to establish extent of emergency"

Unstated assumptions:
- Knows what constitutes "emergency" vs "incident"
- Understands severity indicators  
- Recognizes escalation triggers
- Appreciates time constraints
- Aware of available resources

These aren't in plans or procedures. They're background knowledge that experienced responders have but novices don't.

For agent systems, implicit assumptions are bugs waiting to happen. The agent doesn't share human cultural context. What's "obvious" to human designer isn't obvious to LLM or rule-based system.

Solution: Make assumptions explicit through annotation:
- **Assumed knowledge**: List what must be already known
- **Assumed context**: Specify environmental/situational assumptions  
- **Assumed capabilities**: Detail prerequisite skills
- **Assumed constraints**: Note limitations and boundaries

This transforms implicit assumptions into explicit requirements that can be validated.

## The Verification Problem: Do They Actually Know?

Even when knowledge requirements are specified, how do you verify agents have them?

**For humans**: Training, testing, certification, supervised practice

**For AI agents**: Much harder. LLMs have vast knowledge but:
- Inconsistent (know X in one context, forget in another)
- Unreliable (hallucinate facts)
- Unverifiable (can't inspect what's "known")

Approaches:

### 1. Prerequisite Testing
Before invoking skill, test if agent has required knowledge:
- "What is SQL injection?"
- "How do parameterized queries prevent it?"
- "Give example of vulnerable code"

If answers are correct, proceed. If not, use fallback (simpler skill, human escalation, knowledge acquisition phase).

### 2. Confidence Estimation  
Agent estimates its own knowledge sufficiency:
- "I'm 95% confident I understand this domain"
- "I'm 30% confident in my assessment"

Use confidence to guide autonomy level (high confidence → autonomous, low confidence → supervised).

### 3. Performance Monitoring
Track skill success rates:
- If "detect vulnerabilities" succeeds 95% of time → Knowledge adequate
- If succeeds 60% of time → Knowledge inadequate, needs improvement

Feedback loop: performance → knowledge gap identification → targeted learning → improved performance.

### 4. Knowledge Provenance
Track where knowledge came from:
- Pretrained model (high breadth, variable reliability)
- Fine-tuned on domain (high relevance, limited scope)
- Retrieved from docs (verifiable, potentially incomplete)
- Human-provided (high quality, expensive)

Different sources have different trust levels. Critical sub-goals might require human-provided or retrieval-based knowledge rather than model-generated.

## Case Study: The VCR Programming Knowledge Gap

Stanton's VCR analysis reveals knowing-doing gap:

Users know they want to record a program (goal knowledge). But they don't know:
- **Procedural**: 8-step sequence with timing constraints
- **Conceptual**: Why wait 5 seconds between start and finish time?
- **Contextual**: Must set timer selector AND press timer record (redundant confirmation)
- **Causal**: How does VCR distinguish "set start time" vs "set finish time"? (modal interface)

Result: 40% task failure rate among first-time users.

Design solutions emerge from knowledge gap analysis:
- **Reduce procedural knowledge requirement**: Simplify sequence, remove redundant steps
- **Reduce conceptual knowledge requirement**: Replace abstract time entry with visual calendar/clock
- **Reduce contextual knowledge requirement**: Eliminate mode confusions, make state visible
- **Reduce causal knowledge requirement**: Direct manipulation (drag program from EPG to timeline)

Same goal ("record program at specified time"), drastically reduced knowledge prerequisites. This is only possible by analyzing knowledge requirements systematically.

For agent systems: If task has high knowledge prerequisites, either:
1. Ensure agents have that knowledge (training, retrieval, reasoning)
2. Redesign task to reduce knowledge requirements (simpler procedures, better tools, more automation)

## Meta-Lesson: Information Architecture ≠ Knowledge Architecture

Information is external, objective, transferable. Knowledge is internal, subjective, constructed.

HTA's tabular format handles information well:
- Information flow (→ ←)
- Information sources (where does data come from)
- Information requirements (what must be displayed)

HTA handles knowledge less well, but extensions help:
- Knowledge prerequisites (what must be already known)
- Knowledge gaps (what's missing)
- Knowledge acquisition (how to develop understanding)

For intelligent systems, both matter:
- **Information architecture**: Data schemas, APIs, message passing, databases
- **Knowledge architecture**: Ontologies, domain models, inference rules, learned representations

Systems fail when designers provide information but assume knowledge. "Here's the data you need" ≠ "Here's what you need to know."

The gap between knowing and doing is the gap between information provision and knowledge construction. HTA makes this gap visible by forcing analysts to ask: "What must the operator/agent already understand to execute this sub-goal successfully?"

Answer that question for every sub-goal, and you've moved from task analysis to knowledge analysis. That's where the real design work begins.