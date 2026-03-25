# winDAGs Terminology Evolution

**Purpose**: Document the history of terminology changes so future maintainers understand WHY specific terms were chosen and what they replaced.

---

## The Great Renaming (Phase 5 → Phase 6)

The Design Reviewer in Phase 5 identified that the v1 soul document used academic terminology throughout, creating unnecessary barriers for practitioners. The Polymath Editor in Phase 6 executed a systematic renaming.

### Rationale

The philosophical agents (Phase 1) naturally used their domain's vocabulary:
- Cognitive science → "cognitive core", "sensemaking"
- Decision theory → "commitment strategy", "BOLD/CAUTIOUS/META_LEVEL"
- Philosophy of science → "dialectical classification", "method crystallization"
- Resilience engineering → "PreMortem analyzer"

These terms are precise within their disciplines but opaque to a senior engineer reading the docs for the first time. The Design Reviewer's test: **"Could a new hire understand this in 30 minutes?"**

### The Renaming Table

| Original (Academic) | Renamed To (Practitioner) | Source Tradition | Why Renamed |
|---------------------|--------------------------|-----------------|-------------|
| `cognitive_core` | `node_config` | Cognitive Science | Engineers know "config", not "cognitive core" |
| `cognitive_extended` | `node_config_advanced` | Cognitive Science | Progressive disclosure: basic → advanced |
| `commitment_strategy` | `persistence` | Decision Theory | "How hard should it try?" is the user's mental model |
| `BOLD` | `COMMITTED` | Decision Theory | "Bold" implies recklessness; "committed" implies determination |
| `CAUTIOUS` | `FLEXIBLE` | Decision Theory | "Cautious" implies fear; "flexible" implies adaptability |
| `META_LEVEL` | `EXPLORATORY` | Decision Theory | "Meta-level" is jargon; "exploratory" is intuitive |
| PreMortem Analyzer | Risk Analyzer | Resilience Engineering | "Pre-mortem" requires domain knowledge; "risk" is universal |
| Method Crystallization | "approach saved" / `pattern_save` | Philosophy of Science | "Crystallization" is metaphorical; "saved" is literal |
| `dialectical_classification` | `failure_type` | Hegelian Philosophy | Engineers classify failures, not dialectics |
| Sensemaking Agent | Problem Analyzer | Organizational Theory | "Sensemaking" is a Weick concept; "problem analyzer" is self-describing |
| Looking Back Agent | Learning Agent | Pólya's Heuristics | "Looking back" is Pólya's Phase 4; "learning" is what it does |
| Method Matcher | Pattern Matcher | Software Engineering | "Method" is overloaded in programming; "pattern" is clearer |

### Terms That Survived Unchanged

Some academic terms were kept because they have no better practitioner equivalent or have already entered common usage:

| Term | Kept Because |
|------|-------------|
| Thompson Sampling | Standard algorithm name; renaming would confuse search |
| Circuit Breaker | Already a well-known resilience pattern (Hystrix, Polly) |
| Saga | Standard distributed systems terminology |
| Elo Rating | Universally known from chess; self-explanatory with context |
| Beta Distribution | Mathematical term; no simpler alternative that's still precise |
| DAG | Universal CS/engineering term |

### Terms With Audience-Dependent Usage

Some terms have different forms depending on the audience:

| Technical Audience | General Audience | Context |
|-------------------|-----------------|---------|
| "Thompson sampling" | "the system learns which approaches work" | Marketing copy |
| "Beta(α, β) distribution" | "confidence score" | Dashboard UI |
| "Elo ratings" | "skill rankings" | User-facing displays |
| "Pattern crystallization" | "approaches get saved" | Onboarding materials |

---

## Structural Renames

### Agent Count: 12 → 11

**Phase 4 (Consolidation)**: Lead Architect proposed 12 agents including Health Monitor and Knowledge Curator.

**Phase 5 (EM Reality Check)**: Engineering Manager argued Health Monitor could be folded into Executor as a sub-process rather than a top-level agent. Reduced handoff surface area.

**Phase 6 (Final)**: 11 agents adopted. The 6-phase user-facing model (UNDERSTAND, PLAN, CHECK, EXECUTE, EVALUATE, LEARN) wraps 11 implementation agents.

**Dissenting Note**: The dissenting appendix (Phase 4) notes this may need revisit. If executor becomes too complex, Health Monitor may be re-extracted.

### Quality Model: 3 → 2 Layers

**Phase 4**: Three layers: Floor (functional correctness), Wall (frame compatibility), Ceiling (process quality).

**Phase 5 (EM Reality Check)**: EM argued "Wall" (frame compatibility) was too abstract. What does it mean for output to "match expected prototype for situation type"?

**Phase 6**: Two layers: Floor (binary) + Ceiling (0.0-1.0). Wall concepts folded into Ceiling's `approach_appropriate` component.

**Dissenting Note**: Editorial notes flag this as "medium confidence" — Wall may need to return if the 2-layer model proves insufficient for reliable evaluation.

### Circuit Breakers: 6 → 3 Exposed

**Phase 4**: Six circuit breaker types in full taxonomy.

**Phase 5 (PM Reality Check)**: PM argued users can't reason about 6 types. Expose 3 with unified `retry_policy`.

**Phase 6**: 3 user-exposed types. Full 6-type taxonomy exists internally but isn't user-facing.

---

## Vocabulary Decisions Still Under Debate

These terms may change in future versions:

| Current Term | Potential Change | Trigger |
|-------------|-----------------|---------|
| "Learning Agent" | Possibly too generic | If confusion with ML "learning" arises |
| "persistence" (strategy) | Possibly "retry-mode" | If confused with data persistence |
| "node_config" | Possibly "step_config" | If users think "node" means network node |
| "pattern_save" | Possibly "approach_bookmark" | User testing feedback |

---

## Process for Future Renames

When proposing a terminology change:

1. **Document the problem**: Why is the current term confusing?
2. **Propose the replacement**: What term is clearer?
3. **Check all surfaces**: Use the Surface Registry to find every occurrence
4. **Estimate blast radius**: How many documents change? How many users are affected?
5. **Get consensus**: For Tier 1 changes, this should go through a lightweight version of the Reality Check (at minimum, one fresh-eyes reviewer)
6. **Execute atomically**: Change ALL surfaces in one session, not incrementally
7. **Update this document**: Add the rename to the evolution table
8. **Update the canonical vocabulary**: In the main skill.md term table
