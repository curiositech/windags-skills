# AMENDMENT-001: Skill Selection Cascade

```
AMENDMENT-001
Date: 2026-03-07
Tier: 3 (Formal Amendment)
Sponsor: Human Architect (BDFL override)
Status: Ratified
Version: V3.1.0
```

**AFFECTS**: BC-DECOMP-002, ADR-007 (Skill Selection Cascade)

**SUPERSEDES**: ADR-007 Steps 1 and 4 (Signature Compatibility, Pattern Recognition Fast Path)

---

## Problem Statement

BC-DECOMP-002 mandates: *"Pass 2 MUST NOT invoke LLM calls — it operates on skill metadata only."*

ADR-007 implements this via a five-step cascade whose Step 1 (Signature Compatibility) assumes skills have typed output schemas (`output_schema`, `taskSignature`). This assumption originates from DSPy Compiler Optimization (Topic 6, convention tradition #6), which is deferred to Phase 3.

**In Phase 1 reality**, skills are multifaceted markdown documents (SKILL.md format) with `name`, `description`, `tags`, and prose instructions. They do not have typed input/output schemas. A skill like `skill-architect` can create, criticize, mutate, or advise — its output depends entirely on context. You cannot express "what skill-architect does" as a JSON Schema output type. Signature compatibility filtering is impossible without schemas that don't exist.

Additionally, Step 4 (Pattern Recognition Fast Path) requires execution history (`recognition confidence >= 0.8`). At cold start, all pattern caches are empty. This step provides zero value until significant execution data accumulates — violating our cold-start-viable requirement.

Step 2 (Context Conditions) assumes machine-readable precondition metadata (`preconditions: { requires_git: true }`). Skills don't have this structured metadata. Extracting it would require either manual annotation of ~191 skills or an LLM call, both defeating the purpose.

---

## Proposed Change

### BC-DECOMP-002

**Original (V3.0.0):**

> The Decomposer MUST execute all three passes of ADR-001 in order. Pass 2 MUST NOT invoke LLM calls — it operates on skill metadata only. Pass 3 MAY be skipped for DAGs with depth < 3 and no parallel batches.

**Amended (V3.1.0):**

> The Decomposer MUST execute all three passes of ADR-001 in order. Pass 2 MUST apply deterministic filters (embedding similarity) to narrow the candidate set before any LLM-based selection. Pass 2 MAY use a Tier 1 (Haiku) model for final selection from the narrowed candidate set (no more than 15 candidates). Pass 2 MUST NOT send the full skill library to an LLM. Pass 3 MAY be skipped for DAGs with depth < 3 and no parallel batches.

### ADR-007 Cascade

**Original (V3.0.0) — Five steps:**

| Step | Type | Source Tradition | What |
|------|------|-----------------|------|
| 1. Signature Compatibility | Hard filter | DSPy | Eliminate skills whose output cannot connect to downstream inputs |
| 2. Context Conditions | Hard filter | BDI | Eliminate skills whose preconditions are not met |
| 3. Output Type + Domain Relevance | Soft ranking | Polya | Prioritize by output type and domain match |
| 4. Pattern Recognition Fast Path | Shortcut | NDM/RPD | If confidence >= 0.8, skip to matched skill |
| 5. Thompson Sampling | Explore/exploit | Lakatos | Beta-distribution sampling for final pick |

**Amended (V3.1.0) — Three steps:**

| Step | Type | Cost | What |
|------|------|------|------|
| 1. Embedding Narrowing | Soft filter, no LLM | ~$0.001 | Contextual embeddings + cosine similarity narrow full library (~191 skills) to top K candidates (K=10-15). Embeddings precomputed and cached with hash-based invalidation. |
| 2. Haiku Selection | Cheap LLM call | ~$0.003-0.005 | Haiku reads candidate skill descriptions + subtask description. Returns ranked relevance scores. Understands multifaceted skills because it reads them as natural language. |
| 3. Thompson Sampling | Deterministic | Zero | Warm-start Thompson: Beta(alpha, beta) samples perturb Haiku's ranking. `data_weight` scales from 0 (cold start, trust Haiku entirely) to ~1 (mature, trust execution data). |

**Total cost per subtask**: ~$0.005. For a 6-subtask DAG: ~$0.03. Within the "meta-layer overhead < 10%" performance budget.

### Warm-Start Thompson Algorithm

```typescript
function selectSkill(
  candidates: RankedCandidate[],  // From Steps 1-2
  domain: string,
  thompsonStore: ThompsonStore,
  N: number = 20  // Tuning: executions to reach 50/50 weight
): string {
  const scored = candidates.map(({ skillId, haikuScore }) => {
    const { alpha, beta } = thompsonStore.getParams(skillId, domain);
    const dataPoints = alpha + beta - 2;  // Subtract prior
    const dataWeight = dataPoints / (dataPoints + N);
    const thompsonSample = betaRandom(alpha, beta);
    const finalScore = (1 - dataWeight) * haikuScore + dataWeight * thompsonSample;
    return { skillId, finalScore };
  });

  return scored.sort((a, b) => b.finalScore - a.finalScore)[0].skillId;
}

function updateThompson(
  skillId: string,
  domain: string,
  qualityScore: number,  // Weighted evaluator score in [0, 1]
  thompsonStore: ThompsonStore,
): void {
  const { alpha, beta } = thompsonStore.getParams(skillId, domain);
  thompsonStore.setParams(skillId, domain, {
    alpha: alpha + qualityScore,
    beta: beta + (1 - qualityScore),
  });
}
```

**Cold start behavior**: All skills have Beta(1, 1). `dataWeight = 0`. Selection is 100% Haiku's judgment.

**At 20 executions**: `dataWeight ≈ 0.5`. Half Haiku, half Thompson.

**At 100 executions**: `dataWeight ≈ 0.83`. Thompson dominates. Skills have proven track records.

---

## Rationale

The **spirit** of BC-DECOMP-002 is economic: don't waste expensive LLM calls on elimination. The amended version preserves this by requiring deterministic narrowing (embeddings) before any LLM call. The Haiku call sees at most 15 candidates, not 191.

The amendment drops three assumptions that don't hold in Phase 1:
1. Skills have typed input/output schemas (Phase 3 DSPy prerequisite)
2. Skills have machine-readable precondition metadata (would require manual annotation)
3. Execution history exists for pattern recognition (cold start reality)

The existing `SkillMatcher.llmMatch()` in `packages/core/src/core/skill-matcher.ts` already implements Steps 1-2 of the amended cascade.

---

## Tradition Assessments

**DSPy**: Signature compatibility is the correct mechanism WHEN typed signatures exist. Phase 3 will provide compiled modules with schemas via DSPy compilation from execution traces. The amended cascade is correct for Phase 1. When Phase 3 materializes, the original five-step cascade should be revisited — signature compatibility would then serve as a Step 0 hard filter before embedding narrowing, potentially eliminating 60-80% of candidates at zero cost.

**BDI**: Context conditions remain valid in principle but are better expressed as natural language understood by Haiku than as machine-readable predicates requiring manual annotation of 191 skills. Haiku reading "NOT for: Python-only projects" in a skill description is equivalent to evaluating a structured precondition — and adapts automatically when skill descriptions change.

**NDM/RPD**: Pattern recognition is the correct long-term mechanism. The warm-start Thompson algorithm provides a principled bridge from cold start (trust Haiku) to pattern-rich state (trust data). As execution data accumulates, Thompson's Beta distributions become the statistical equivalent of "recognition-primed decisions" — the system increasingly recognizes which skills work for which tasks.

**Polya**: Domain relevance is now captured by embedding similarity (semantic) rather than keyword matching (lexical). Contextual embeddings (Anthropic cookbook: Claude generates situating context per chunk before embedding) provide 35% better retrieval than naive embeddings.

**Lakatos**: Thompson sampling is retained unchanged. The update mechanism (alpha += quality_score, beta += 1 - quality_score) feeds from the four evaluators (self: 0.15, peer: 0.25, downstream: 0.35, human: 0.50). Monster-barring still applies — skills that consistently produce low-quality output accumulate high beta, effectively barring them from selection.

---

## Dissenting Positions

None. Human architect exercised BDFL override authority based on implementation evidence.

**Override justification**: The implementation clearly demonstrated that typed skill signatures (ADR-007 Step 1) and machine-readable preconditions (ADR-007 Step 2) do not exist in the current skill format and cannot exist until Phase 3 DSPy compilation. Proceeding with the original cascade would require either (a) building fictional metadata or (b) leaving the skill selection step unimplemented.

---

## Implementation Evidence

1. **Existing infrastructure supports the amendment**: `EmbeddingService`, `EmbeddingCache`, and `SkillMatcher.llmMatch()` already implement embedding narrowing + Haiku selection.

2. **dag-skills-matcher skill marked deprecated**: The V1 LLM-based matcher (deprecated: true in frontmatter) is being replaced by the amended cascade.

3. **191 skills lack typed schemas**: Audit of all SKILL.md files confirms none have `output_schema` or `input_schema` fields. Skills use natural language descriptions, `tags`, and prose "When to Use" sections.

4. **Cold start is the launch reality**: No execution data exists. Pattern recognition (Step 4) would return zero matches for every query.

---

## Revisit Conditions

This amendment should be revisited when:

1. **Phase 3 DSPy compilation materializes**: Compiled modules will have typed schemas. Signature compatibility can then be reintroduced as a Step 0 hard filter before embedding narrowing.

2. **Sufficient execution data accumulates**: After 1000+ executions across 50+ skills, evaluate whether pattern recognition (NDM/RPD fast path) should be reintroduced as a Step 0 shortcut.

3. **Skill metadata standardization**: If a structured precondition schema is adopted for SKILL.md (e.g., `requires: [git, typescript]`), context conditions can be reintroduced as a deterministic filter.

---

## Decision

**Ratified** by human architect (BDFL override). Constitution version: V3.1.0.

| Provision | Old | New |
|-----------|-----|-----|
| BC-DECOMP-002 | "Pass 2 MUST NOT invoke LLM calls" | "Pass 2 MUST narrow deterministically before Haiku selection from ≤15 candidates" |
| ADR-007 | 5-step cascade (signature, context, relevance, recognition, Thompson) | 3-step cascade (embeddings, Haiku, Thompson) |
| ADR-007 Step 1 | Signature Compatibility (hard filter) | **Superseded** — no typed schemas in Phase 1 |
| ADR-007 Step 2 | Context Conditions (hard filter) | **Absorbed** — Haiku handles implicitly |
| ADR-007 Step 3 | Output Type + Domain Relevance (soft ranking) | **Replaced** by embedding similarity |
| ADR-007 Step 4 | Pattern Recognition Fast Path | **Deferred** — cold start reality |
| ADR-007 Step 5 | Thompson Sampling | **Retained** with warm-start weighting |
