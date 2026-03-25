# WinDAGs Amendment Framework

Research-backed protocol for evolving the V3 Constitution. Synthesized from constitutional law, IETF RFC process, Rust/Python/TC39 standards processes, game theory (Arrow, Aumann, quadratic voting), Habermas's discourse ethics, Fishkin's deliberative polling, and open source governance.

---

## Core Principle: Immutability + Additive Evolution

The original V3 Constitution is never edited. All changes are additive:
- Annotations are appended
- Interpretive guidance is a separate document referencing the original
- Formal amendments are new documents that supersede specific sections
- The original text is preserved as the historical record

This follows the IETF RFC model: RFCs are never edited once published. Evolution happens through Updates (modify part), Obsoletes (replace entirely), and Errata (minor corrections).

---

## Four-Tier Amendment System

### Tier 1: Annotations (PATCH-level)

**What**: Implementation notes, clarifications of ambiguous language, empirical observations, error corrections. No normative force.

**Process**: Any agent or human can add annotations. Tagged with author, date, and the provision annotated.

**Threshold**: None. Immediate.

**Example**: "ADR-012's assumption that skill matching would take < 100ms was incorrect; observed latency is 200-400ms. See implementation log."

### Tier 2: Interpretive Guidance (MINOR-level)

**What**: Guidance on applying existing provisions in new contexts. Reconciliation of apparent conflicts between provisions. Elaboration for unforeseen situations. Has normative force but doesn't change original text.

**Process**: Proposed by any tradition-agent or human. Requires review by at least 3 relevant tradition-agents. Adopted by **lazy consensus** (72-hour window for objection).

**Threshold**: Lazy consensus among relevant traditions.

**Example**: "ADR-017 (retry policy) and ADR-023 (cost limits) conflict when a retry would exceed the cost budget. Guidance: cost limits take precedence; retries must respect the cost envelope."

### Tier 3: Formal Amendment (MAJOR-level)

**What**: Changes to core architectural principles, new or removed behavioral contracts, supersession of ADRs.

**Process**: Mini-convention scoped to the specific change:
1. **Proposal**: Sponsor authors problem statement, proposed change, rationale, impact analysis
2. **Steel-manning**: Each relevant tradition provides their strongest argument FOR and AGAINST
3. **Deliberation**: Structured discussion with synthesis at each round
4. **Decision**: Supermajority (7/10 traditions) OR human override with documented rationale
5. **Dissent preservation**: Opposing positions recorded in the amendment document

**Threshold**: 7/10 traditions or human override.

### Tier 4: Constitutional Revision (BREAKING-level)

**What**: Changes to foundational framework, tradition set, meta-process, or amendment framework itself.

**Process**: Full convention comparable to original 7-phase process:
1. **Convening threshold**: Sponsored by 3+ traditions or human architect
2. **Full 7-phase process**: Divergence → Convergence → Steel-Manning → Consolidation → Review → Preservation Audit → Ratification
3. **Ratification**: Unanimous consent or human override with full documentation

**Threshold**: Unanimity or human override.

---

## Version Numbering

```
V3.0.0 = Current convention output (ratified)
V3.0.x = Annotations (Tier 1 — patch)
V3.x.0 = Interpretive guidance + new ADRs (Tier 2 — minor)
V4.0.0 = Constitutional revision (Tier 4 — major)
```

Tier 3 formal amendments increment the minor version but are documented more heavily than Tier 2.

---

## Amendment Document Template

```
AMENDMENT-{number}
Date: {ISO date}
Tier: {1|2|3|4}
Sponsor: {tradition or human}
Status: {Proposed|Under Deliberation|Ratified|Rejected|Withdrawn}

AFFECTS: {sections, ADRs, or behavioral contracts affected}
SUPERSEDES: {previous amendments or ADR sections replaced}

PROBLEM STATEMENT:
{Why the current provision is inadequate}

PROPOSED CHANGE:
{Exact change, with diff-style notation}

RATIONALE:
{Why this change is appropriate}

TRADITION ASSESSMENTS:
- [Tradition]: {position + steel-manned counterargument}

DISSENTING POSITIONS:
{Full text of dissenting arguments}

IMPLEMENTATION EVIDENCE:
{Empirical evidence motivating the change}

DECISION:
{Ratified/Rejected with vote count or consensus statement}
```

---

## Implementation Discovery Feedback Loop

The most common amendment trigger is implementation discovering a decision was wrong.

### Implementation Log

A running log of deviations from the constitution. Each deviation documented with:
- Which provision was deviated from
- Why
- What was done instead
- Whether the deviation worked

### Deviation Review Protocol

Weekly during active development:
1. Review accumulated deviations
2. For each deviation, determine:
   - One-time exception? → Document as annotation (Tier 1)
   - Needs reinterpretation? → Propose interpretive guidance (Tier 2)
   - Provision is wrong? → Propose formal amendment (Tier 3)
3. **Retroactive ratification**: If a deviation is working well, the amendment process can retroactively ratify it (analogous to judicial recognition of customary law)

---

## New Source Assimilation Protocol

When new books, papers, or frameworks are introduced:

1. **Map to existing concepts**: What does the constitution already say about this domain?
2. **Identify gaps**: What does the new source teach that isn't covered?
3. **Classify the gap**:
   - Reinforces existing ADR → Tier 1 annotation ("Airflow validates ADR-006")
   - Extends existing ADR → Tier 2 interpretive guidance
   - Contradicts existing ADR → Tier 3 formal amendment
   - Reveals entirely new territory → New ADR proposal (Tier 2 or 3 depending on scope)
4. **Update derivatives**: Business model, UX roadmap, and build roadmap may need updates even when constitution doesn't

---

## Revisit Condition Evaluation Protocol

### Trigger Detection

Each of the 6 preserved dissenting positions has an empirical revisit condition. Formalize each as a testable predicate:

| Dissent | Predicate | Measurement |
|---------|-----------|-------------|
| D-1: Capability-first | `revision_rate > 0.30` | Track decomposition revisions / total decompositions |
| D-2: Per-task interleaving | `preemption_rate > 0.50` | Track mid-batch preemptions / total batches |
| D-3: Rich default protocols | `manual_upgrade_rate > 0.40` | Track protocol upgrades / total edges |
| D-4: Aggressive phasing | Competitive pressure | Qualitative assessment |
| D-5: Mandatory telemetry | `correlation(process, outcome) < 0.30 after n=1000` | Statistical test |
| D-6: Formal BFT quorum | Model independence demonstrated | Empirical study |

### When a Trigger Fires

1. Generate **Trigger Report**: which condition, evidence, date
2. Assign **Sponsor**: tradition most aligned with the ADR's domain
3. Sponsor produces **Reassessment Brief**: Is original decision still correct? What should change? What tier?
4. Route to appropriate tier process

### Automatic Sunset

ADRs marked "provisional" or "experimental" have mandatory revisit after 90 days of implementation. If not re-ratified, demoted to "deprecated."

---

## Governance

### Authority Model: BDFL with Structured Advice

The human architect retains ultimate override authority (Linux kernel model). Tradition-agents serve as advisors whose collective judgment carries strong but not absolute weight.

**Human override**: Available at every tier. When used, must be documented with:
- Why the traditions' recommendation was overridden
- What the human knows that the traditions don't
- Under what conditions the override should be revisited

### Amendment of the Amendment Process

Changes to this framework itself are Tier 4 (constitutional revision). Prevents the process from being gamed by amending its own rules.

### Enhanced Dissent for Core Principles

If a tradition's core principles are directly at stake in an amendment, their dissent gets enhanced documentation and weight, analogous to constitutional protections for minority rights.

---

## Academic Foundations

| Framework | Source | Key Contribution |
|-----------|--------|-----------------|
| Living constitutionalism | Strauss (2010) | Interpretation vs. amendment distinction |
| Constitutional moments | Ackerman (1991) | Convention as legitimate foundational event |
| Immutable standards | IETF RFC 2026 | Never edit; evolve through new documents |
| Lazy consensus | Apache Foundation | Low-friction for low-stakes changes |
| Staged maturity | TC39/Rust/Python | Ideas progress through commitment levels |
| Social choice theory | Arrow (1951) | No perfect voting rule; choose failure modes |
| Bayesian group updating | Aumann (1976), DeGroot (1974) | Steel-manning as forced belief updating |
| Discourse ethics | Habermas (1996) | Legitimacy conditions for deliberation |
| Deliberative polling | Fishkin (2009) | Deliberation changes minds; process matters |
| Scalable oversight | Christiano et al. (2023) | Process proportional to stakes |
| Social laws for agents | Shoham & Tennenholtz (1995) | Norms evaluated for usefulness + non-interference |
| Quadratic voting | Posner & Weyl (2018) | Express preference intensity, not just direction |
