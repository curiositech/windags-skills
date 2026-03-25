---
license: Apache-2.0
name: diagramming-expert
description: Master of text-based visual communication using ASCII art, Unicode box-drawing, and structured diagram notation. Creates clear, maintainable diagrams for systems, processes, hierarchies, relationships, and psychological structures. Proactively generates diagrams to enhance understanding. Activate on visualization needs, system architecture, process flows, psychological mapping, or when complex concepts would benefit from visual representation. NOT for photo editing, vector graphics, or GUI-based design tools.
allowed-tools: Read,Write,Edit
category: Productivity & Meta
tags:
  - diagrams
  - visualization
  - architecture
  - flowcharts
  - documentation
pairs-with:
  - skill: technical-writer
    reason: Visual documentation for technical content
  - skill: api-architect
    reason: Diagram API architectures
---

# Diagramming Expert

Master of text-based visual communication. Creates clear, maintainable diagrams that reduce cognitive load and enhance understanding.

## Decision Points

### Diagram Type Selection Tree

```
Problem Size Analysis:
├── Small (≤5 elements)
│   ├── If showing relationships → Simple network diagram
│   ├── If showing sequence → Linear flowchart
│   └── If showing hierarchy → Tree diagram
├── Medium (6-15 elements)
│   ├── If showing process → Multi-lane flowchart with decision points
│   ├── If showing architecture → Layered architecture diagram
│   └── If showing relationships → Clustered network with grouping
└── Large (>15 elements)
    ├── If stakeholders = technical → Break into multiple detailed diagrams
    ├── If stakeholders = business → Create overview + drill-down diagrams
    └── If medium = presentation → Create progression slides

Complexity Threshold Heuristics:
- If >10 arrows cross each other → Break into multiple diagrams
- If labels don't fit in 80-character width → Simplify or split
- If >7 decision points in one flow → Create decision matrix instead
- If >5 hierarchical levels → Consider nested zoom-in approach
```

### Layout Decision Matrix

```
Content Type:
├── Static structure
│   ├── Top-down hierarchy → Use tree layout
│   ├── Peer relationships → Use horizontal layout
│   └── Layered system → Use vertical stack
├── Dynamic process
│   ├── Linear sequence → Left-to-right flow
│   ├── Branching logic → Decision tree format
│   └── Cyclical process → Circular or loop layout
└── Mixed content
    ├── Structure + process → Swimlane diagram
    ├── Multiple viewpoints → Side-by-side comparison
    └── Temporal changes → Before/after layout
```

### Annotation Strategy Decision

```
Information Density:
├── High detail required
│   ├── Use numbered callouts with legend below
│   ├── Create detail boxes connected by dotted lines
│   └── Split into overview + detail diagrams
├── Medium detail
│   ├── Inline labels within boxes
│   ├── Short descriptive text near elements
│   └── Color coding with simple legend
└── Low detail (overview)
    ├── Single-word labels only
    ├── Focus on structure, not content
    └── Use size/weight to show importance
```

## Failure Modes

### 1. Spaghetti Syndrome
**Symptoms:** Crossed arrows everywhere, unclear information flow, reader can't follow path  
**Detection Rule:** If you count >5 line crossings or can't trace any path without confusion  
**Fix:** Reorganize layout to minimize crossings, use hierarchical structure, break into multiple focused diagrams

### 2. Information Overload
**Symptoms:** Everything in one diagram, tiny unreadable text, cramped elements  
**Detection Rule:** If diagram requires >120 character width or elements are <3 characters apart  
**Fix:** Apply "One Main Idea" rule - create overview + detail breakouts, use progressive disclosure

### 3. Chartjunk Bloat
**Symptoms:** Excessive decoration, multiple border styles, unnecessary graphical elements  
**Detection Rule:** If more than 2 different line styles or decorative elements not carrying information  
**Fix:** Apply Tufte's data-ink ratio - remove all non-essential visual elements, use consistent minimal styling

### 4. Unlabeled Mystery
**Symptoms:** Boxes without labels, arrows without direction indicators, unclear relationships  
**Detection Rule:** If any element requires more than 5 seconds to understand its purpose  
**Fix:** Label everything clearly, add directional indicators, include legend for symbols

### 5. Scale Mismatch
**Symptoms:** Wrong diagram type for audience, too technical for business users, too simplistic for developers  
**Detection Rule:** If stakeholders ask "what does this mean" or "where's the detail"  
**Fix:** Match diagram complexity to audience expertise, create multiple views for different stakeholders

## Worked Examples

### Example 1: Refactoring a Crowded System Architecture

**Initial Problem:** 15-microservice system crammed into one diagram

```
# BEFORE (Failure Mode: Information Overload)
[Cramped diagram with 15 services, 30+ arrows, unreadable labels]

# ANALYSIS: Too much complexity for single view
- Stakeholder: Engineering team (technical)
- Purpose: Understanding service dependencies  
- Current issues: Can't trace request flows, unclear boundaries

# DECISION PROCESS:
1. Problem size = Large (15 elements) → Multiple diagrams needed
2. Audience = Technical → Detailed views acceptable
3. Main concerns = Dependencies → Focus on interaction patterns

# SOLUTION: 3-tier approach
```

**Overview Diagram:**
```
┌─────────────────────────────────────────┐
│              API Gateway                │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│           Core Services (6)              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Auth    │ │ User    │ │ Order   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│          Support Services (9)            │
│     Logging, Metrics, Storage...         │
└─────────────────────────────────────────┘
```

**Detail Diagram (Core Services):**
```
    ┌─────────┐
    │   Auth  │◄─────────────┐
    └────┬────┘              │
         │ validates         │ requests
         ▼                   │ auth
    ┌─────────┐         ┌────┴────┐
    │  User   │◄────────┤ Order   │
    │ Service │ lookup  │ Service │
    └─────────┘         └─────────┘
```

**Key Decisions Made:**
- Split by service tier (API → Core → Support)
- Overview for navigation, details for implementation
- Kept arrows minimal, focused on critical dependencies

### Example 2: Choosing Between Diagram Types for Same System

**Scenario:** Need to show employee feedback process to different audiences

**Decision Analysis:**
```
Audience 1: HR Policy Team (non-technical)
→ Need: Understand policy compliance checkpoints
→ Choice: Process flowchart with decision diamonds

Audience 2: Engineering Team  
→ Need: Understand system integration points
→ Choice: Sequence diagram with API calls

Audience 3: Employees
→ Need: Understand what to expect
→ Choice: Simple linear timeline
```

**HR Policy View (Process focus):**
```
┌─────────────┐
│ Employee    │
│ Submits     │
│ Feedback    │
└──────┬──────┘
       │
       ▼
   ┌───────┐    No    ┌─────────────┐
   │Anonymous? ├──────►│ Route to    │
   │         │        │ Manager     │
   └───┬─────┘        └─────────────┘
       │ Yes
       ▼
┌─────────────┐
│ Route to    │
│ HR Only     │
└─────────────┘
```

**Engineering View (System focus):**
```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Web App │─────►│ API     │─────►│ Queue   │
└─────────┘ POST └─────────┘ pub  └─────────┘
                      │                │
                      │ auth           │ consume
                      ▼                ▼
               ┌─────────┐      ┌─────────┐
               │ Auth    │      │ Process │
               │ Service │      │ Worker  │
               └─────────┘      └─────────┘
```

**Trade-off Analysis:**
- HR diagram prioritizes policy compliance over technical accuracy
- Engineering diagram shows actual implementation flow
- Both valid for their audiences - same system, different mental models

## Quality Gates

**Diagram Readability Test:**
- [ ] Can be understood by target audience in <30 seconds
- [ ] No more than 7±2 elements per visual chunk
- [ ] All text readable in monospace font at standard size
- [ ] Clear visual hierarchy (primary/secondary/tertiary elements)

**Content Coverage Checklist:**
- [ ] All significant elements labeled clearly
- [ ] Directional flow indicated where applicable
- [ ] Decision points explicitly marked
- [ ] Relationships between elements are obvious

**Layout Balance Verification:**
- [ ] Elements evenly distributed (no cramped corners)
- [ ] Consistent spacing between similar elements
- [ ] Arrow crossings minimized (<3 total)
- [ ] Diagram fits in 80-character width when possible

**Maintenance Acceptance Criteria:**
- [ ] Uses consistent character set throughout
- [ ] Text labels can be updated without layout changes
- [ ] Adding one element won't require complete redesign
- [ ] Follows established pattern library conventions

**Stakeholder Validation Gates:**
- [ ] Technical accuracy verified by domain expert
- [ ] Complexity level appropriate for intended audience
- [ ] Answers the specific question it was created for
- [ ] Can stand alone without extensive verbal explanation

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Pixel-perfect UI mockups → Use design tools (Figma, Sketch)
- Photo editing or image manipulation → Use image editing software
- Complex mathematical visualizations → Use specialized math tools
- Interactive animations → Use animation software
- Publication-quality graphics → Use professional design tools

**Delegation Guidelines:**
- For UI/UX wireframes → Use `ux-designer` skill instead
- For data visualization with charts → Use `data-analyst` skill
- For architectural blueprints → Use CAD software
- For presentation graphics → Use `presentation-designer` skill
- For infographic design → Use graphic design tools

**Complexity Boundaries:**
- If diagram needs >50 elements → Break into multiple diagrams or use specialized tools
- If requiring precise positioning → Use vector graphics software
- If stakeholders need interactive exploration → Use digital diagramming tools
- If output needs color for comprehension → Use tools that support color

**Medium Limitations:**
- ASCII/Unicode text only - no images, colors, or fonts
- Monospace character grid constraints
- Static representation - no animation or interaction
- Limited to characters available in standard Unicode sets