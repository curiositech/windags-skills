---
license: Apache-2.0
name: nasa-2017-systems-engineering-handbook
description: Apply NASA's battle-tested framework for building complex, mission-critical systems where failure has catastrophic consequences
category: Research & Academic
tags:
  - systems-engineering
  - nasa
  - lifecycle
  - requirements
  - handbook
---

# SKILL: NASA Systems Engineering Methodology

license: Apache-2.0
## Metadata
- **Name**: `nasa-systems-engineering`
- **Description**: Apply NASA's battle-tested framework for building complex, mission-critical systems where failure has catastrophic consequences
- **Version**: Based on NASA/SP-2016-6105 Rev2
- **Activation triggers**:
  - "How do I structure this complex system?"
  - "We need to break this problem down systematically"
  - "How do I ensure subsystems integrate correctly?"
  - "What level of rigor does this project need?"
  - "How do I manage risk in this decision?"
  - "Our interfaces keep failing during integration"
  - "How do I write requirements that actually work?"
  - "We need to scale our process without losing control"

## When to Use This Skill

Load this skill when facing:

- **Complex system decomposition** — Breaking down problems with >5 interacting subsystems where local optimization != global optimization
- **Mission-critical reliability** — Systems where failure means loss of life, >$10M losses, or irreversible consequences
- **Multi-team coordination** — Projects requiring 3+ independent teams to deliver components that must integrate perfectly
- **Requirement ambiguity** — Stakeholders say "we need reliability" but can't define what that means numerically
- **Integration failures** — Components work individually but fail when combined
- **Process scalability questions** — Deciding what rigor to apply to different project types/scales
- **Risk-laden decisions** — Choosing between options under uncertainty with asymmetric failure consequences
- **Configuration control problems** — Version drift, unauthorized changes, or "which baseline are we building to?"

**Not appropriate for**: Simple projects with single owners, purely exploratory R&D with no integration requirements, or contexts where "move fast and break things" is actually the right strategy.

## Core Mental Models

### 1. The Recursive Decomposition Engine
Systems engineering is **nested problem-solving loops**, not linear stages. Each subsystem undergoes the full cycle:
```
Stakeholder Expectations → Requirements → Design → Verification
         ↓
Baselined derived requirements become high-level requirements for next level down
         ↓
Repeat until atomic components, then integrate upward with validation at each seam
```

**Why this matters**: Prevents "correct parts, broken system" failures. Each decomposition level must prove it satisfies its parent's requirements before integration. Failures at Level N-1 force re-verification at Level N.

**Key insight**: The engine is *hierarchical* and *iterative* — you're never "done" with requirements or design, you're managing their evolution across levels.

### 2. Tailoring as Structured Governance
Tailoring is not "skipping steps" — it's **documented flexibility** based on 8 contextual factors:

| Factor | Examples |
|--------|----------|
| Mission type | Class A (flagship) → Class D (acceptable mission risk) |
| Acceptable risk | Loss of life vs. loss of mission vs. degraded performance |
| National significance | International treaty obligations, national security |
| Complexity | Component count, novel technology, interface density |
| Mission lifetime | 90 days vs. 15 years in space |
| Cost constraint | $10M CubeSat vs. $10B telescope |
| Launch constraints | No refurbishment possible (deep space) vs. ISS servicing |
| Human rating | Crew safety requirements |

**Process**: Use the Compliance Matrix to document what's eliminated, what's scaled, and **why**. This makes deviations traceable and auditable.

**Anti-dogma**: "Maximum rigor" is not "best practice" — over-engineering a CubeSat wastes resources; under-engineering a crewed mission kills people.

### 3. Configuration Management as Cognitive Infrastructure
CM is not administrative tracking — it's the **control system that prevents divergence** between:
- What you specified vs. what you built
- What Team A assumes vs. what Team B delivers  
- Version N requirements vs. Version N+1 design
- As-designed vs. as-built vs. as-tested vs. as-operated

**The failure mode CM prevents**: Subsystems drift from their baseline specifications through undocumented changes, then fail at integration because they no longer satisfy the interface contracts they were verified against.

**Implementation**: Configuration Items (CIs), baselines, change control boards, version-controlled interface control documents (ICDs).

### 4. Interface Management: Where Independence Meets Integration
**The paradox**: Every subsystem can be independently correct yet the system fails when integrated.

**Root cause**: Interfaces have three failure modes:
1. **Specification ambiguity** — "Data shall be transmitted" (what format? what rate? what error handling?)
2. **Version mismatch** — Team A builds to ICD v1.2, Team B tests against v1.3
3. **Assumption incompatibility** — Both sides think they're the bus master; both sides assume the other handles error correction

**Solution framework**:
- Explicit Interface Control Documents (ICDs) for every boundary
- Managed by neutral Interface Control Working Groups (ICWGs)
- Version control with both-sides sign-off before changes
- Integration testing validates interface reality vs. specification

### 5. Risk-Informed Decision Making
Decisions under uncertainty require **structured comparison methods**, not intuition:

- **For technical risks**: Probabilistic Risk Assessment (PRA) — fault trees, Monte Carlo, failure rate data
- **For multi-objective tradeoffs**: Analytic Hierarchy Process (AHP) — weighted criteria with pairwise comparisons
- **For cost/schedule**: Earned Value Management (EVM) — variance analysis, trend projection
- **For architecture**: Trade studies with explicit evaluation criteria and sensitivity analysis

**Key discipline**: Document assumptions, weightings, and decision rationale *before* committing resources. Enables post-decision learning when assumptions prove wrong.

## Decision Frameworks

### Should I tailor this process step?

**IF** the mission is:
- Class D (high acceptable risk) + short lifetime (<2 years) + low cost (<$50M)

**THEN** consider:
- Eliminating peer reviews for non-critical subsystems
- Scaling documentation from formal specs to annotated models
- Using rapid prototyping instead of full requirements flow-down

**BUT** never eliminate:
- Interface management for multi-team boundaries
- Configuration control for flight hardware
- Risk assessment for novel technology

**Document in Compliance Matrix**: What you eliminated, why these factors justified it, what alternative controls remain.

---

### How do I write a requirement that actually works?

**IF** you can't answer these 5 questions about a requirement, it's not ready:
1. What single "shall" statement does this make?
2. What numerical threshold defines satisfaction? (tolerance bands, MTBF, throughput)
3. How will we verify it? (test, analysis, inspection, demonstration)
4. Which parent requirement does this derive from?
5. Which subsystem owns implementation?

**THEN** rewrite using the requirement discipline:
- One "shall" per statement
- No "and/or" constructions (split into separate requirements)
- Include tolerances, environmental conditions, operational modes
- Use standard specification formats (MIL-STD references, IEEE formats)

**Example transformation**:
- ❌ "The system shall be highly reliable"
- ✅ "The propulsion system shall achieve MTBF ≥ 40,000 hours when operating at 350K ± 10K ambient temperature per MIL-HDBK-217F"

---

### When do I escalate an interface issue?

**IF** any of these conditions exist:
- Version mismatch between ICD and implemented interface
- Assumption conflict discovered after subsystem verification
- Change request affects >1 subsystem's verified requirements
- Integration test reveals specification ambiguity

**THEN** immediately:
1. Freeze integration of affected subsystems
2. Convene Interface Control Working Group (ICWG)
3. Assess impact: does this require re-verification? re-baselining?
4. Update ICD with explicit resolution and version increment
5. Both sides re-verify against new ICD before re-integration

**Why urgency matters**: Interface defects compound exponentially — catching at integration costs 10x more than at design, catching at operations costs 100x more.

---

### How do I decide between architecture options under uncertainty?

**Use Analytic Hierarchy Process (AHP) when**:
- >3 competing architectures
- Multiple stakeholders with conflicting priorities
- Mix of quantitative (cost, mass) and qualitative (flexibility, heritage) criteria

**Process**:
1. Define evaluation criteria (performance, cost, risk, schedule, operability)
2. Weight criteria via pairwise comparisons with stakeholders
3. Score each architecture against each criterion (1-10 scale)
4. Calculate weighted scores
5. **Sensitivity analysis**: vary weightings ±20% — does rank order change?
6. Document assumptions about uncertain parameters (failure rates, tech maturity)

**Decision rule**: If rank order is stable across sensitivity ranges, choose top-ranked. If unstable, either:
- Reduce uncertainty via prototyping/analysis before deciding
- Choose architecture with best worst-case performance (minimax strategy)

---

### When do I create a new configuration baseline?

**Establish baseline when**:
- Requirements set is stable and verified against parent requirements
- Design passes preliminary/critical design review
- Build completes and passes acceptance testing
- System passes integration verification
- Operations phase begins (as-operated baseline)

**Between baselines**: All changes flow through Configuration Control Board (CCB).

**CCB approval required for changes affecting**:
- External interfaces
- Verified requirements
- Mass/power/data budgets
- Safety-critical functions

**Fast-track allowed for**: Documentation corrections, non-interface internal changes, pre-approved modifications

## Reference Documents

| File | When to Load | Contents |
|------|--------------|----------|
| `references/recursive-decomposition-engine.md` | When structuring problem breakdown, setting up integration strategy, or explaining why requirements keep changing | The 4-phase SE Engine architecture, how decomposition levels interact, validation at integration seams, common breakdown patterns |
| `references/tailoring-as-governance.md` | When deciding process rigor for a new project, justifying deviation from standard practices, or creating a Compliance Matrix | 8 tailoring factors, 3 tailoring modes, mission classification system, documentation requirements for justified deviations |
| `references/configuration-management-as-cognitive-infrastructure.md` | When setting up CM for a multi-team project, investigating version drift issues, or deciding what requires CCB approval | Configuration Items, baseline types, change control process, relationship to interface management, failure modes CM prevents |
| `references/interface-management-prevents-integration-failures.md` | When defining subsystem boundaries, writing ICDs, setting up ICWGs, or debugging integration failures | Interface failure taxonomy, ICD requirements, version control procedures, integration testing strategy, ICWG operating model |
| `references/risk-informed-decision-making.md` | When choosing between options under uncertainty, assessing technical risks, or defending a difficult decision | PRA methodology, AHP process, trade study structure, assumption documentation, sensitivity analysis techniques |

**Loading strategy**: Start with `recursive-decomposition-engine.md` for structural problems, `tailoring-as-governance.md` for scoping decisions, or `interface-management-prevents-integration-failures.md` for integration issues.

## Anti-Patterns

### 1. "We'll define interfaces during integration"
**Failure mode**: Both teams make incompatible assumptions, discover at integration, require re-design/re-verification.

**Cost multiplier**: 10-100x vs. defining interfaces at decomposition.

**Correct approach**: ICDs signed off by both sides before detailed design begins.

---

### 2. "This requirement is obvious, we don't need to write it down"
**Failure mode**: Obvious to Team A ≠ obvious to Team B. Unwritten assumptions propagate as hidden dependencies.

**Example**: "Data will be transmitted" — obvious to software team means TCP/IP packets, obvious to hardware team means RS-422 serial.

**Correct approach**: If it affects interfaces or verification, it's a requirement. Write it, trace it, verify it.

---

### 3. "We're agile, we don't do big upfront requirements"
**False dichotomy**: Recursive decomposition ≠ waterfall. You iterate, but *each level* stabilizes before spawning the next.

**The trap**: Changing Level N requirements after Level N-1 design begins forces rework that cascades downward.

**Correct approach**: Agility within levels (sprint on design options), stability across levels (freeze requirements before decomposition).

---

### 4. "Configuration management slows us down"
**Reality inversion**: CM prevents the slowdown of debugging why Component A mysteriously stopped working (someone changed the interface without documenting it).

**Cost**: Tracking changes in real-time < investigating failures from uncontrolled changes after integration.

**Correct approach**: Lightweight CM (version control + change log) for small teams, formal CCB for multi-team programs.

---

### 5. "We'll tailor by just skipping the stuff that seems unnecessary"
**Governance failure**: Undocumented tailoring = untraceability. When something fails, you can't reconstruct what controls were bypassed.

**Audit risk**: "Why didn't you do X?" "It seemed unnecessary" is not a defensible answer for a mishap investigation.

**Correct approach**: Compliance Matrix documents *what* you're eliminating, *why* the 8 factors justify it, *what alternative controls* remain.

---

### 6. "Verification and Validation are the same thing"
**Conceptual error**: 
- **Verification** = "Did we build it right?" (meets requirements)
- **Validation** = "Did we build the right thing?" (meets stakeholder expectations)

**Failure scenario**: System perfectly verifies against requirements but fails validation because requirements misunderstood stakeholder needs.

**Correct approach**: Validate requirements with stakeholders *before* design begins. Verify design against requirements before integration.

## Shibboleths: Signs of True Internalization

### Poser says:
"We do systems engineering — we have requirements documents."

### Expert says:
"Our requirements are verified against parent requirements and traced to verification methods in our V&V matrix. When a derived requirement changes, we assess re-verification impact on the parent."

**Distinguisher**: Understands requirements exist in a *hierarchy* with bidirectional traceability.

---

### Poser says:
"We tailor our process to move faster."

### Expert says:
"We tailored by eliminating peer reviews for Class D subsystems with <$5M cost and <1 year lifetime, documented in our Compliance Matrix, but kept interface reviews because we're integrating with partner hardware."

**Distinguisher**: Can articulate *which* factors justified *which* tailoring decisions and what controls remain.

---

### Poser says:
"We use version control for our code."

### Expert says:
"We have four configuration baselines: functional (requirements), allocated (design), product (as-built), and operational (as-flown). Our CCB approves changes affecting external interfaces or verified requirements."

**Distinguisher**: Understands CM spans requirements, design, hardware, and operations — not just source code.

---

### Poser says:
"We write interface specifications."

### Expert says:
"Our ICDs specify message formats, timing tolerances, error handling, and environmental assumptions. They're version-controlled, both sides sign off before detailed design, and our ICWG meets biweekly to process change requests."

**Distinguisher**: Treats interfaces as *contracts* requiring bilateral agreement and change management.

---

### Poser says:
"We do risk management."

### Expert says:
"We ran PRA with fault trees for the propulsion system, AHP for architecture selection weighted toward operability over cost, and tracked via risk matrices with retire-by dates tied to verification events."

**Distinguisher**: Can name specific *methods* used for specific *risk types* and how they tied to decisions.

---

### Poser says:
"We verify our design meets requirements."

### Expert says:
"We validated requirements with stakeholders before PDR, verified subsystems against allocated requirements before integration, then validated integrated system performance against Concept of Operations in operational environment."

**Distinguisher**: Distinguishes verification (requirements compliance) from validation (stakeholder needs satisfaction) and sequences them correctly.

---

## Quick Reference: First Steps

**Starting a new complex project?**
1. Load `tailoring-as-governance.md` → classify mission, fill out Compliance Matrix
2. Load `recursive-decomposition-engine.md` → map decomposition levels, identify integration points
3. Load `interface-management-prevents-integration-failures.md` → define subsystem boundaries, start ICDs

**Debugging an integration failure?**
1. Check configuration baselines — are both sides building to same ICD version?
2. Check interface assumptions — explicitly list what each side expects the other to provide
3. Load `interface-management-prevents-integration-failures.md` → work through failure taxonomy

**Facing a difficult decision under uncertainty?**
1. List decision options and evaluation criteria
2. Load `risk-informed-decision-making.md` → select appropriate method (PRA/AHP/trade study)
3. Document assumptions, run sensitivity analysis, record rationale

**Requirements keep changing and breaking downstream work?**
1. Check if requirements are verified against parent requirements before decomposition
2. Check if derived requirements are baselined before subsystem design begins
3. Load `recursive-decomposition-engine.md` → review decomposition timing and baseline discipline

---

*This skill synthesizes 60+ years of NASA's operational experience building systems where failure means catastrophe. Apply with appropriate tailoring based on your mission context.*