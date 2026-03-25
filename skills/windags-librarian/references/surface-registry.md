# winDAGs Surface Registry

**Last Updated**: 2026-02-15
**Maintained by**: windags-librarian skill

This registry tracks every surface where winDAGs content appears, its authority tier, last verification date, and known issues.

---

## Tier 1: Authoritative Sources

These are the ground truth. All other surfaces must conform to these.

### Constitution
- **Path**: `corpus/outputs/v2_synthesis/phase6_final/windags-constitution.md`
- **Approximate Lines**: 1,350
- **Created**: 2026-02-15 (Phase 6 Final Merge)
- **Last Verified**: 2026-02-15
- **Status**: ✅ Current
- **Notes**: Supreme authority. Produced by Polymath Editor after 6-phase recursive synthesis.

### Practitioner's Guide
- **Path**: `corpus/outputs/v2_synthesis/phase6_final/windags-architect-v2.md`
- **Approximate Lines**: 1,350
- **Created**: 2026-02-15 (Phase 6 Final Merge)
- **Last Verified**: 2026-02-15
- **Status**: ✅ Current
- **Notes**: Outside-in structure. Parts 1-5 for users (~450 lines), Parts 6-8 for experts.

### Editorial Notes
- **Path**: `corpus/outputs/v2_synthesis/phase6_final/editorial_notes.md`
- **Approximate Lines**: 364
- **Created**: 2026-02-15 (Phase 6 Revision 2)
- **Last Verified**: 2026-02-15
- **Status**: ✅ Current
- **Notes**: Documents all v1→v2 changes, confidence levels, terminology renames.

---

## Tier 2: Derivative Documents

Derived from Tier 1 by specialized agents. May interpret for their audience but must not contradict Tier 1.

### Marketing & Positioning
- **Path**: `corpus/outputs/v2_synthesis/derivatives/derivative_marketing.md`
- **Lines**: ~525
- **Audience**: GTM team, content writers
- **Key Content**: Elevator pitch, taglines, landing page copy, competitive messaging, DO/DON'T lists
- **Last Verified**: 2026-02-15
- **Known Issues**: None

### Graph Visualization UI Spec
- **Path**: `corpus/outputs/v2_synthesis/derivatives/derivative_viz_spec.md`
- **Lines**: ~310
- **Audience**: Frontend engineers
- **Key Content**: 5 core views, node rendering spec, real-time events, Phase 1 wireframe
- **Last Verified**: 2026-02-15
- **Known Issues**: None

### OSS Boundary Strategy
- **Path**: `corpus/outputs/v2_synthesis/derivatives/derivative_oss_strategy.md`
- **Lines**: ~580
- **Audience**: Business/legal, open-source strategy
- **Key Content**: Core vs. premium split, licensing, community model
- **Last Verified**: 2026-02-15
- **Known Issues**: None

### Business Model Analysis
- **Path**: `corpus/outputs/v2_synthesis/derivatives/derivative_business_model.md`
- **Lines**: ~707
- **Audience**: Business strategy, investors
- **Key Content**: Revenue models, pricing tiers, market sizing
- **Last Verified**: 2026-02-15
- **Known Issues**: None

### Build Roadmap
- **Path**: `corpus/outputs/v2_synthesis/derivatives/derivative_build_roadmap.md`
- **Lines**: ~461
- **Audience**: Engineering management
- **Key Content**: 3-phase plan, team sizing, risk factors, milestones
- **Last Verified**: 2026-02-15
- **Known Issues**: None

---

## Tier 3: External-Facing Surfaces

These reach users directly. Must be kept in strict sync with Tier 1/2.

### Marketing Website (Mockup)
- **Path**: `corpus/outputs/windags-marketing-site/index.html`
- **Type**: Self-contained HTML (for screenshots)
- **Created**: 2026-02-15
- **Last Verified**: 2026-02-15
- **Content Sources**: derivative_marketing.md, derivative_viz_spec.md
- **Known Issues**: Static mockup, not the live site. Live site (windags.ai) is still the old Win3.11 theme and needs full replacement.

### windags.AI Live Site
- **URL**: https://windags.ai
- **Type**: Live website
- **Last Verified**: 2026-02-15
- **Status**: ⚠️ OUT OF SYNC — Still shows old Win3.11 "176+ curated skills" theme. Does NOT reflect the cognitive DAG architecture from the synthesis corpus.
- **Action Required**: Replace with content from marketing mockup or derivative_marketing.md

### windags-architect Skill
- **Path**: `.claude/skills/windags-architect/SKILL.md`
- **Type**: Claude Code skill
- **Last Verified**: 2026-02-15 (structure only)
- **Status**: ⚠️ NEEDS AUDIT — Created before the recursive synthesis. May use pre-synthesis terminology and architecture descriptions.
- **Action Required**: Full terminology audit + structural consistency check against Constitution

### windags-architect References
- **Path**: `.claude/skills/windags-architect/references/`
- **Files**: 11 reference documents
- **Status**: ⚠️ NEEDS AUDIT — Same concern as parent skill
- **Priority References to Audit**:
  - `business-model.md` — compare against derivative_business_model.md
  - `visualization-research.md` — compare against derivative_viz_spec.md
  - `skill-lifecycle.md` — compare against Constitution learning mechanisms
  - `observability-and-testing.md` — compare against Constitution Ch.14 + Appendix B

### windags-librarian Skill (This System)
- **Path**: `.claude/skills/windags-librarian/skill.md`
- **Type**: Claude Code skill
- **Last Verified**: 2026-02-15
- **Status**: ✅ Current (created from synthesis corpus)

---

## Tier 4: Process Artifacts

Historical reference only. Not authoritative for current terminology.

### Phase 1: Position Papers (10)
- **Path**: `corpus/outputs/v2_synthesis/phase1_positions/`
- **Status**: Historical — uses academic terminology throughout
- **Value**: Understanding WHY decisions were made

### Phase 2: Synthesis
- **Path**: `corpus/outputs/v2_synthesis/phase2_synthesis/`
- **Status**: Historical — principle hierarchy and skeleton

### Phase 3: Commentary (10)
- **Path**: `corpus/outputs/v2_synthesis/phase3_commentary/`
- **Status**: Historical — adversarial review of synthesis

### Phase 4: Consolidation
- **Path**: `corpus/outputs/v2_synthesis/phase4_consolidation/`
- **Status**: Historical — includes dissenting appendix (still relevant)
- **Note**: `dissenting_appendix.md` documents unresolved tensions that remain valid

### Phase 5: Reality Check (3)
- **Path**: `corpus/outputs/v2_synthesis/phase5_reality_check/`
- **Status**: Historical — PM/EM/Design fresh-eyes reviews
- **Note**: Reality check demands were incorporated into Tier 1; originals useful for context

### Archivist's Record
- **Path**: `corpus/outputs/v2_synthesis/ARCHIVISTS_RECORD.md`
- **Status**: Process metadata — documents the synthesis process itself
- **Note**: Valuable for understanding how the corpus was produced

---

## Verification Schedule

| Surface | Frequency | Trigger |
|---------|-----------|---------|
| Tier 1 (Constitution, Guide, Notes) | On change only | Any Tier 1 edit |
| Tier 2 (Derivatives) | After Tier 1 change | Propagation protocol |
| Tier 3 (External surfaces) | Monthly + after Tier 1/2 change | Calendar + propagation |
| Tier 4 (Historical) | Never (read-only) | N/A |

---

## Quick Audit Checklist

Before any winDAGs content goes external:

- [ ] All terms match the canonical vocabulary (no academic terms)
- [ ] Agent count is 11 (not 12, not 10)
- [ ] Phase pipeline is 6 phases (UNDERSTAND through LEARN)
- [ ] Quality model is 2 layers (Floor + Ceiling)
- [ ] Elevator pitch is "DAG execution that improves itself"
- [ ] No forbidden messaging ("AI-powered", "revolutionary", competitor attacks)
- [ ] All factual claims traceable to Constitution or Practitioner's Guide
- [ ] Voice appropriate for the target audience
