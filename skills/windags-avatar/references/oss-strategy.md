# WinDAGs V3 — Open Source Strategy

**Document type**: Formal strategy document
**Status**: Ratified
**Supersedes**: BC-BIZ-001 (behavioral contract reference — this document is the authoritative source)

---

## 1. License Architecture

The Market reviewer identified a gap in the V3 constitution: BC-BIZ-001 states that the "open-source core MUST remain genuinely open" but does not define the boundary in a legally enforceable or commercially unambiguous way. This document closes that gap.

### Dual-License Model

WinDAGs V3 ships under a dual-license structure:

- **Apache 2.0** — Core execution engine and all community-facing components
- **Business Source License 1.1 (BSL 1.1)** — Commercial features that generate revenue or provide competitive enterprise advantage

The BSL 1.1 "Change Date" is set to 4 years from each component's release date, at which point it automatically converts to Apache 2.0. This follows the HashiCorp Vault pattern (2023 BSL adoption) while providing a clearer conversion timeline than Elasticsearch's historical ambiguity.

### Feature Classification Table

This is the authoritative classification. It is not a behavioral contract. It is a legal and strategic document.

| Feature | License | Rationale |
|---|---|---|
| Three-pass decomposition engine | Apache 2.0 | Core architectural primitive |
| Wave-by-wave execution loop | Apache 2.0 | Core architectural primitive |
| Sensemaker + Halt Gate | Apache 2.0 | Core architectural primitive |
| Skill selection cascade (5-step) | Apache 2.0 | Core architectural primitive |
| Floor + Wall evaluation (Stage 1) | Apache 2.0 | Basic quality gate — free tier |
| Envelope score computation | Apache 2.0 | Deterministic, zero marginal cost (see ADR-033) |
| Circuit breaker registry | Apache 2.0 | Reliability primitive |
| ContextStore (local SQLite) | Apache 2.0 | Local-first storage layer |
| MockLLMProvider + test harness | Apache 2.0 | Developer tooling — drives adoption |
| SKILL.md format + parser | Apache 2.0 | Portability is the point; must be open |
| Basic Thompson sampling (skill-level) | Apache 2.0 | Learning loop is the moat — entry-level version must be open |
| Scalar Elo ranking | Apache 2.0 | Entry-level skill ranking |
| Looking Back Q1-Q2 | Apache 2.0 | Reflection protocol — drives skill quality |
| ReactFlow visualization (L1 only) | Apache 2.0 | First impression matters; onboarding must be free |
| 10 seed template DAGs | Apache 2.0 | Marketplace cold-start strategy requires free seeds |
| V2-to-V3 skill migration tooling | Apache 2.0 | Migration friction kills adoption |
| Ceiling evaluation (Stage 2, Channel A) | BSL 1.1 | Revenue-generating quality tier (Pro+) |
| Cognitive telemetry pipeline | BSL 1.1 | Revenue-generating quality tier (Pro+) |
| Multi-dimensional Elo | BSL 1.1 | Revenue-generating quality tier (Team+) |
| Kuhnian crisis detector | BSL 1.1 | Revenue-generating quality tier (Team+) |
| Monster-barring detector | BSL 1.1 | Revenue-generating quality tier (Team+) |
| Method-level learning (HTN) | BSL 1.1 | Revenue-generating quality tier (Team+) |
| Topology fingerprinting | BSL 1.1 | Revenue-generating quality tier (Team+) |
| Organizational skill isolation | BSL 1.1 | Enterprise architectural feature |
| Private skill library hosting | BSL 1.1 | Enterprise revenue line |
| Cross-deployment skill transfer | BSL 1.1 | Enterprise architectural feature |
| Stage-gated K-factor tuning | BSL 1.1 | Requires execution volume data — enterprise |
| Coordination model abstraction (Phase 2+) | BSL 1.1 | Multi-model coordination is Phase 2+ enterprise |
| DSPy compilation integration (Phase 3) | BSL 1.1 | Compiled module marketplace revenue |
| Marketplace hosting infrastructure | BSL 1.1 | Platform revenue |
| Revenue sharing API | BSL 1.1 | Platform revenue |

### What Apache 2.0 Core Guarantees

A developer using only Apache 2.0 components can:
- Execute multi-step DAG workflows locally
- Rank and select skills via Thompson sampling
- Evaluate output quality at Floor + Wall + Envelope
- Write, parse, and publish SKILL.md files
- Run the full test suite with the mock LLM provider
- Deploy a self-hosted, single-user WinDAGs instance indefinitely

They cannot run at enterprise scale, access advanced learning features, or participate in the commercial marketplace without a BSL 1.1 commercial license.

---

## 2. Community Building Strategy

### First 90 Days: Infrastructure and Ignition

**Days 1-30: GitHub Setup**

The GitHub repository ships with:
- A `CONTRIBUTING.md` (see Section 5 for required structure)
- Issue templates for bug reports, skill submissions, and feature requests
- A `CODEOWNERS` file mapping subsystems to core team members
- A `GOOD_FIRST_ISSUE` label assigned to 15-20 tagged issues at launch
- GitHub Discussions enabled with category structure: Announcements, Q&A, Skills, Architecture, Show-and-Tell
- A public project board tracking Phase 1 milestones with public checkpoints at weeks 4, 6, and 8 (matching the critical path document)

**Days 1-30: Community Space**

Discord is the primary community channel (not Slack — Discord has better thread support for technical Q&A and lower friction for new contributors). Initial channel structure:

- `#announcements` (read-only, core team)
- `#general`
- `#skill-workshop` (primary contributor hub)
- `#help` (onboarding support)
- `#architecture` (ADR discussion)
- `#show-and-tell` (demos and crystallized skills)
- `#beta-feedback` (Phase 1 beta users)

A bot automatically cross-posts GitHub Discussions to relevant Discord channels and creates a thread for every new issue labeled `GOOD_FIRST_ISSUE`.

**Days 30-90: First 50 Contributors**

Target breakdown:
- 20 contributors via the Early Creator Program (Section 3)
- 15 contributors sourced from Claude Code community (natural adjacency — SKILL.md is already familiar to this audience)
- 10 contributors from LangChain/LangGraph community who are frustrated with stateless orchestration
- 5 contributors from academic agent systems community (HTN, BDI adjacency)

Each new contributor receives a personal welcome message from a core team member within 24 hours of their first merged PR. First contributions are explicitly acknowledged in the weekly `#announcements` digest.

### Months 3-6: Plugin Ecosystem and Evangelism

**Plugin Ecosystem**

The skill authoring surface is the primary plugin vector. Month 3 ships:
- A `create-windags-skill` CLI scaffolding tool (comparable to `create-react-app` — zero configuration, produces a valid SKILL.md + test harness)
- A skill validation linter that catches SKILL.md format violations before submission
- A community skill registry (separate from the commercial marketplace) hosted at `skills.windags.dev` — free to list, no revenue sharing required

By month 6, the target is 100 community skills in the registry across 8 domains.

**Evangelism Program**

Identify 5-8 "community advocates" from early contributors who demonstrate:
- High-quality skill contributions (quality score > 0.85 in validation)
- Active presence in Discord helping other contributors
- Public writing or speaking about agent orchestration

Advocates receive: early access to Phase 2 features, a `WinDAGs Advocate` badge in Discord, invitation to monthly private roadmap calls with the core team, and a one-time $500 credit toward API costs.

### Months 6-12: Governance and Community Council

Month 6 establishes the Community Council: a 5-member elected body representing the contributor community in architectural decisions. Council elections are held every 6 months. Eligibility: any contributor with 3+ merged PRs in the preceding 6 months.

The Council has binding input on:
- RFC approval for changes to the SKILL.md format (portability affects the whole ecosystem)
- Changes to the Apache 2.0 / BSL 1.1 boundary (requires Council ratification)
- Deprecation of any community skill in the seed library

The Council has advisory (non-binding) input on:
- Phase roadmap prioritization
- Marketplace revenue share rate adjustments

---

## 3. Early Creator Program

### Purpose

The constitution's marketplace cold-start playbook (ADR-032, addressing the CEO's blocking concern) calls for 50 seed skills at launch. The Early Creator Program recruits 20-30 developers to build and maintain these skills before launch and to anchor the marketplace with high-quality content in the first 90 days.

### Selection Criteria

Candidates must demonstrate:
1. Active development work (GitHub profile with substantial commit history or equivalent)
2. Familiarity with LLM-based tooling (Claude Code, LangChain, AutoGen, or similar)
3. Domain depth in at least one of the five target seed domains: software engineering, data analysis, content creation, security, DevOps
4. Willingness to maintain their skills for at least 6 months post-launch (execution data is needed to achieve proficient-stage Elo rankings)

Bonus criteria (not required):
- Prior open-source contribution history
- Public writing about AI agent systems
- Technical background in evaluation, quality, or testing

### Recruitment Timeline

| Period | Action |
|---|---|
| Phase 1, Week 4 (internal milestone) | Soft launch creator program to beta users who have seen the first DAG execute |
| Phase 1, Week 6 | Open applications via website form |
| Phase 1, Week 8 | Accept first 15 creators; provide skill authoring tooling and documentation |
| Launch - 30 days | Remaining 5-15 creators onboarded; seed library complete |
| Launch + 30 days | Founding creator cohort closes; standard marketplace opens |

### Creator Incentives

**Attribution**: Every skill in the marketplace displays the creator's name, GitHub profile link, and a "Founding Creator" badge for skills published in the first 90 days. This attribution persists permanently — it is not removed when the skill is superseded or archived.

**Revenue share**: Founding creators receive an 80/20 split (creator/platform) for the first 12 months post-launch. Standard rate is 70/30. This is contractually guaranteed for the founding cohort regardless of future rate changes.

**Launch credits**: Each founding creator receives $200 in WinDAGs execution credits at launch. Credits do not expire for 24 months.

**Early access**: Founding creators receive Phase 2 features (method-level learning, organizational skill libraries) 60 days before general availability. This provides a head start on building higher-value compiled module assets for the Phase 3 marketplace.

**Direct line**: A `#founding-creators` private Discord channel with direct access to the core team for architectural questions and skill quality feedback.

---

## 4. SKILL.md as Open Standard

### The Opportunity

The V3 constitution positions SKILL.md as the knowledge crystallization format at the top of the learning hierarchy: "human-readable, version-controlled — the interchange format" (ADR-018). This is more than a file format. It is an opportunity to establish WinDAGs as the owner of a portable, multi-system standard for codified agent knowledge.

The strategic bet: if SKILL.md becomes the format that practitioners reach for when they want to document an agent capability — regardless of which orchestration system they use — WinDAGs owns the mindshare even when it doesn't own the runtime.

### Portability Requirements

For SKILL.md to achieve standard status, the Apache 2.0 tooling must include:
- A formal JSON Schema definition of the SKILL.md structure (versioned, at `schema.windags.dev/skill/v1`)
- A TypeScript reference parser (`@windags/skill-parser` — published to npm)
- A Python reference parser (`windags-skill-parser` — published to PyPI)
- A validation CLI (`windags-skill validate ./my-skill.md`)
- A conversion tool for importing skills from competing formats (LangChain tools, AutoGen agent configs) with a best-effort SKILL.md output

### Integration Targets

**Claude Code**: SKILL.md is already the native format for Claude Code skills (the `some_claude_skills` project). The WinDAGs SKILL.md schema should remain a superset of the Claude Code skill format — any Claude Code skill should be a valid WinDAGs skill with no modification. This gives WinDAGs immediate access to the existing Claude Code skill ecosystem.

**MCP Tools**: WinDAGs exposes its skill library as MCP tools (ADR-034). Publish a reference implementation that wraps any SKILL.md as an MCP tool, making the standard valuable to any MCP-compatible orchestration system.

**LangChain / LangGraph**: Publish a `langchain-windags-skills` package that wraps WinDAGs skills as LangChain tools. This creates bidirectional ecosystem benefit: LangChain users can consume WinDAGs skills without migrating; WinDAGs gains visibility in the LangChain community.

**Documentation and Adoption**

Publish `skill.md` as a standalone website (`skill.md` or `skillmd.dev`) with:
- The specification in plain English
- Interactive examples (paste a skill, see its parsed structure)
- A registry of parsers and integrations maintained by the community
- A compatibility matrix showing which fields are supported in which systems

Submit SKILL.md to relevant standards bodies and working groups. The OpenAI Evals format and Anthropic's Constitutional AI documents are precedents: well-structured community formats that achieved informal standard status through quality and adoption, not committee processes.

---

## 5. Contribution Guide Structure

### CONTRIBUTING.md Required Coverage

The CONTRIBUTING.md is a front door, not a legal document. It must be readable in 10 minutes and actionable in 30.

**Required sections**:

1. **Quick Start** — Clone, install, run the test suite, see the mock LLM provider produce a DAG. This section has exactly one success criterion: a new contributor can execute it without reading anything else.

2. **Contribution Categories** (detailed below)

3. **Development Workflow** — Branch naming, commit message format, PR template, CI checks that must pass

4. **Code Style** — TypeScript strict mode, linting rules, test coverage requirements per category

5. **Review Process** — Who reviews what, expected turnaround time (core engine PRs: 5 business days; skill PRs: 2 business days), what gets auto-merged vs requires discussion

6. **Community Standards** — Code of conduct reference (separate document), Discord etiquette, how to escalate disputes

### Contribution Categories

| Category | Bar | Reviewer | Typical Turnaround |
|---|---|---|---|
| Core engine (execution, decomposition, evaluation) | High — requires architectural discussion in an RFC for non-trivial changes | 2 core team members | 5-10 business days |
| Skills (SKILL.md submissions to community registry) | Low — passes linter, has at least 3 test cases, domain is documented | 1 community advocate | 2 business days |
| Documentation | Low — factually accurate, no jargon at L1 | 1 core team member | 2 business days |
| Tests | Medium — covers the stated behavioral contract, no over-mocking | 1 core team member | 3 business days |
| Bug fixes | Depends on subsystem | Subsystem CODEOWNER | 2-5 business days |

### CLA vs DCO Decision

WinDAGs uses a **Developer Certificate of Origin (DCO)** rather than a Contributor License Agreement (CLA).

Rationale: CLAs require legal review, introduce friction for corporate contributors, and have caused notable community backlash (HashiCorp 2023, Redis 2024). The DCO (a simple `git commit -s` sign-off) is lighter, well-understood, and legally sufficient for the Apache 2.0 / BSL 1.1 dual-license structure because WinDAGs is not asking contributors to assign copyright — only to certify that they have the right to contribute the code under the license terms.

Exception: Contributors submitting to BSL 1.1 components must additionally acknowledge in writing that their contribution will be licensed under BSL 1.1 terms, including the 4-year conversion clause.

---

## 6. Lessons from HashiCorp, Elastic, and Redis

### What Went Right

**HashiCorp (Terraform, Vault, 2023)**: The BSL announcement was technically clean. The change date was defined, the "additional use grant" was specific, and the Open Terraform fork (OpenTofu, now under the Linux Foundation) was expected and accepted. HashiCorp's mistake was the surprise: no pre-announcement community consultation, no transition period.

**Elastic (2021)**: Elastic moved from Apache 2.0 to SSPL (Server Side Public License) in response to AWS bundling Elasticsearch. The SSPL is more aggressive than BSL — it requires open-sourcing any service that deploys the software. The move was legally valid but created a trust deficit that led to the OpenSearch fork, now a AWS-maintained Apache 2.0 project with significant adoption.

**Redis (2024)**: Redis moved from BSD to a dual license (RSAL + SSPL) with very little community notice. The Redis community forked to Valkey (now Linux Foundation). Redis's error was not the license change itself — it was the perception that the company had extracted community labor and then enclosed the commons.

### What Went Wrong — The Pattern

In all three cases, the trust deficit was not primarily about the license text. It was about the sequence: build community value with one license, then change terms after the community is invested. The community read this as: "We used your contributions to build our moat, then changed the rules."

### How WinDAGs Avoids This

**Announce the dual-license structure before launch, not after community investment.** This document exists to establish the boundary clearly, formally, and publicly from Day 1. There is no bait-and-switch. Every contributor knows the rules before they write a line of code.

**The BSL boundary is architectural, not arbitrary.** Features are in BSL 1.1 because they require execution volume data (which the platform accumulates) to be valuable, not because they were popular community features that the company decided to monetize. The learning loop features that require massive execution data to calibrate (Kuhnian crisis detector, method-level learning, multi-dimensional Elo) are genuinely not useful to self-hosted single-user deployments.

**The Change Date converts to Apache 2.0.** BSL 1.1 is not a permanent enclosure. The 4-year conversion clause means the community knows that today's commercial features will eventually be fully open. This changes the moral calculus significantly compared to SSPL.

**Community Council has binding approval over boundary changes.** No change to the Apache 2.0 / BSL 1.1 classification table can be made without Community Council ratification. This contractual constraint prevents future leadership from repeating the HashiCorp/Elastic/Redis playbook.

---

## 7. Community Metrics and Health

### 12-Month KPI Dashboard

The following metrics are tracked publicly (a live dashboard at `community.windags.dev`) to demonstrate health and hold the team accountable.

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|
| GitHub stars | 500 | 2,000 | 8,000 |
| GitHub forks | 100 | 400 | 1,500 |
| Unique contributors (merged PRs) | 20 | 75 | 200 |
| Community skills published | 30 | 100 | 400 |
| Issues resolved (< 7 days) | 60% | 70% | 80% |
| PR median time to review | 5 days | 4 days | 3 days |
| Discord members | 300 | 1,000 | 4,000 |
| Discord weekly active users | 50 | 200 | 800 |
| Hello World completion rate (new installs) | 60% | 70% | 80% |
| Skill execution volume (community skills) | 1,000/week | 10,000/week | 100,000/week |
| Founding Creator retention (still active) | 85% | 70% | 60% |

### Health Indicators Beyond Counts

Raw counts can be gamed. Secondary health indicators:

- **Contributor diversity**: Percentage of merged PRs from non-core-team contributors. Target: 30% by month 6, 50% by month 12.
- **Issue response quality**: Community issues resolved by non-core contributors (not just closed by core team). Target: 25% by month 6.
- **Skill quality distribution**: Median Elo score of community-submitted skills. A declining median indicates the review bar is too low or the authoring tools are insufficient.
- **Return contributor rate**: Contributors who submit a second PR within 90 days of their first. Target: 40%. Below 25% indicates the contribution experience is too painful.

### Failure Modes to Monitor

- Star count growing while contributor count stagnates: audience without community. Indicates the project is interesting but not accessible.
- High issue count with low resolution rate: maintenance debt accumulating. Core team is shipping features instead of tending the commons.
- Skill submissions clustered in one domain: ecosystem is not broadening. Indicates outreach is not reaching target domains.

---

## 8. Governance Model

### Decision Framework

WinDAGs uses a **Benevolent Dictator with Structured Escalation** model for Phase 1 and Phase 2. The Community Council transitions the model toward a Technical Steering Committee (TSC) by month 12.

**Current state (Phase 1-2)**: Core team has final authority on all architectural decisions. The lead architect retains veto power on changes to the core execution model, the SKILL.md schema, and the Apache 2.0 / BSL 1.1 boundary. This is a pragmatic concession to speed: the architecture is not yet stable enough for committee governance.

**Transition state (Month 6-12)**: Community Council gains binding authority on SKILL.md schema changes and the license boundary. TSC formation begins with 3 seats for community-elected members and 2 seats for core team appointees.

**Target state (Month 12+)**: Full TSC governance with RFC process for all architectural changes.

### RFC Process

Any change to the following requires an RFC (Request for Comment):
- SKILL.md schema (any version increment)
- Core execution behavioral contracts (BC-DECOMP, BC-EXEC, BC-FAIL, BC-LEARN, BC-EVAL)
- The Apache 2.0 / BSL 1.1 classification table
- Addition or removal of coordination model types

RFC format:
1. **Problem statement** — What breaks or is insufficient today?
2. **Proposed change** — Precise specification, not prose
3. **Alternatives considered** — At least two, with rejection rationale
4. **Migration path** — How existing deployments and skills are affected
5. **Behavioral contract updates** — Which BCs change and how

RFC lifecycle: 14-day public comment period minimum. Community Council review. Core team ratification (or TSC ratification after month 12). Implementation only after ratification.

### What Gets Merged Without an RFC

- Bug fixes that do not change behavioral contracts
- Performance improvements that do not change observable behavior
- Documentation improvements
- New skills submitted to the community registry
- New seed template DAGs that use existing primitives
- Test coverage additions

### Conflict Resolution

Disputes between contributors are resolved in this order:
1. Discussion in the relevant GitHub issue or PR
2. Escalation to Discord `#architecture` with a 72-hour comment window
3. Community Council mediation (binding for community disputes, advisory for technical disputes)
4. Core team final decision (technical disputes only)

The lead architect's veto on core architectural matters is the final word during Phase 1 and Phase 2. This is explicit, not hidden. The trade-off is speed and coherence during a critical architectural formation period. The TSC transition is the contractual commitment to relinquish this veto.

---

*This document is version-controlled alongside the WinDAGs V3 constitution. Amendments require the same RFC process as SKILL.md schema changes.*
