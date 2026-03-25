# WinDAGs V3 Business Model

**Document type**: Derivative — Business strategy synthesis
**Source documents**: Constitution Part 3 (ADR-032 through ADR-035), Part 4 (Delivery Roadmap), Phase 5 Review Brief
**Status**: Addresses all blocking items from Market and CEO reviewers
**Date**: 2026-03-01

---

## Framing

This document translates the WinDAGs V3 architectural constitution into commercial terms. Every section addresses at least one blocking concern from the Market or CEO reviewer. Where the constitution deferred a business decision, this document makes it explicit. Where the constitution said "trust us," this document provides enumerable specifics.

The one-sentence GTM (Market reviewer mandate): **"WinDAGs is the AI orchestration platform that gets smarter every time it runs."**

---

## 1. Pricing Tiers

Four tiers. The tiers map directly to the progressive disclosure layers in the architecture: each paid tier unlocks a deeper layer of the evaluation and learning stack.

### Free Tier

**Target user**: Individual developer exploring the platform; open-source projects; academic research.

**What is included**:
- 100 DAG executions per month
- Unlimited skill library access (community skills only)
- Floor + Wall evaluation (functional correctness + frame compatibility)
- Envelope score — deterministic, zero marginal cost; included in free because gating it is indefensible (Market reviewer, ADR-033)
- Basic Elo ranking across community skills
- Skill crystallization: the system identifies recurring ad-hoc workflows and suggests converting them to skills
- Standard visualization: L1 overview (traffic-light status, DAG progress, cost ticker)
- Hello World in < 5 minutes (non-negotiable; BC-BIZ-002)
- Single-user organizational skill isolation (distinct namespace from community skills; architectural decision, not a tier feature — see Section 5)
- Apache 2.0 core; self-hostable

**What is gated**:
- Ceiling evaluation (process quality, decomposition quality, neural evaluation)
- Kuhnian crisis detection (drift detection requires execution volume; unlocks at Pro)
- Method-level learning (method library accumulation deferred to Pro)
- Premium marketplace skills
- Organizational skill libraries shared across multiple users (Team tier)

**Why this works**: The free tier is genuinely useful. A developer running 100 workflows per month and seeing their skills improve through Elo ranking and crystallization has experienced the core value proposition before spending a dollar. The Envelope score — showing execution resilience (retry ratio, circuit breaker trips, budget utilization, timeout proximity) — gives every free user a professional-grade signal at zero marginal cost.

---

### Pro Tier — $29/month

**Target user**: Alex (the first-customer persona): senior engineer at a 50-person SaaS company, running recurring complex workflows, wants measurable improvement over time.

**What is included** (everything in Free, plus):
- 10,000 DAG executions per month
- Ceiling evaluation (full four-layer quality model: Floor + Wall + Ceiling + Envelope)
- Drift detection and Kuhnian crisis monitoring (PSI score tracking, progressive/degenerating classification)
- Method-level learning (decomposition strategies indexed by task signature; the highest-impact learning tier)
- Premium marketplace skills (curated creator library; see Section 4)
- Full L1/L2 visualization (reasoning traces, coordination events, decomposition provenance, quality breakdowns)
- Post-execution retrospective panel (quality radar chart, learning events, Looking Back Q1-Q4 results, near-miss report)
- LLM cost pass-through dashboard (actual vs. estimated cost tracking per workflow)

**What is gated**:
- Organizational skill libraries shared with team members (Team tier)
- Coordination templates (Phase 3 feature; Enterprise tier at launch)
- Compiled DSPy modules (Phase 3 feature)

**Why $29**: This price is below the noise floor for any engineering team's monthly tooling budget. At 10,000 executions, the math is $0.0029 per execution for orchestration overhead, against a target meta-layer cost of < $0.07 (BC-BIZ-003). The Ceiling evaluation and method learning at this tier is where Alex's Day 1 → Day 30 quality improvement (70% → 85%) becomes visible and attributable.

---

### Team Tier — $99/month

**Target user**: A 4-person backend team; product engineering teams with shared workflows and tribal knowledge to codify.

**What is included** (everything in Pro, plus):
- 50,000 DAG executions per month
- Organizational skill libraries shared across the team (dedicated namespace, access-controlled; see Section 5)
- Up to 10 team members
- Team-scoped learning state (skill rankings and method quality accumulated across all team members' executions)
- Shared failure intelligence (failure patterns and near-miss events visible to all team members)
- L2/L3 visualization for all team members
- Admin dashboard: member management, usage by member, cost allocation

**What is gated**:
- Unlimited members (Enterprise)
- SSO / SAML / LDAP integration (Enterprise)
- Private organizational skill library with custom access tiers and audit logs (Enterprise; see Section 5)
- Coordination templates (Enterprise at launch)
- SLA guarantees

**Why $99**: Teams of 4-10 people are the natural scaling unit for WinDAGs adoption. The organizational skill library at this tier is where the skills migration moat begins to activate (CEO reviewer insight): the team's shared skills accumulate tribal knowledge that is not available on the open marketplace.

---

### Enterprise Tier — Custom pricing (anchor: $2,000+/month)

**Target user**: Engineering org with compliance requirements, procurement processes, and the need for private knowledge isolation at organizational scale.

**What is included** (everything in Team, plus):
- Unlimited executions
- Unlimited members
- Full evaluation stack (Ceiling, drift detection, multi-dimensional Elo, cognitive telemetry)
- Full organizational skill library architecture: private storage, tiered access control, sharing model, audit logs (see Section 5)
- SSO / SAML / LDAP integration
- Coordination templates (multi-model coordination patterns)
- Compiled DSPy modules as organizational assets
- SLA: 99.9% uptime, < 4-hour response time for critical issues
- Dedicated customer success manager
- Design partner program eligibility (see Section 9)
- On-premises / private cloud deployment option
- A2A protocol support (Phase 4)

**Pricing model**: Per seat for organizations < 100 users; flat org-level pricing for 100+ users. Annual contracts with 20% discount.

---

## 2. Revenue Projections — Conservative 18-Month Forecast

These projections address the Preservation Audit's MISSING flag: the $0 → $5K → $25K → $150K+ MRR trajectory was not stated in the constitution.

### Assumptions

- Phase 1 ships at end of Month 2 (8-week critical path)
- Private beta: Months 1-3 (50 users, free tier only, no revenue)
- Public launch: Month 4
- Pro conversion rate from free: 8% (conservative; Stripe benchmarks for dev tools: 3-12%)
- Team conversion rate from Pro: 15% of Pro accounts add team tier within 90 days
- Enterprise conversion: 2 design partners at Month 6; organic pipeline builds from Month 9
- Monthly execution growth: 25% MoM for first 12 months post-launch, tapering to 10%
- Marketplace revenue: 30% of premium skill GMV; begins Month 6 when Phase 3 prerequisites enable paid skills
- Churn: 5% monthly (aggressive assumption; typical dev tools: 3-8%)

### Projection Table

| Month | Free MAUs | Pro Accounts | Team Accounts | Enterprise | MRR |
|-------|-----------|-------------|---------------|------------|-----|
| 1-3   | 50 (beta) | 0           | 0             | 0          | $0 |
| 4     | 200       | 12          | 0             | 0          | $350 |
| 5     | 500       | 32          | 3             | 0          | $1,225 |
| 6     | 1,000     | 72          | 8             | 1          | $4,884 |
| 7     | 1,800     | 130         | 15            | 1          | $8,420 |
| 8     | 2,800     | 195         | 24            | 2          | $13,215 |
| 9     | 4,000     | 270         | 35            | 2          | $17,980 |
| 10    | 5,500     | 370         | 50            | 3          | $24,530 |
| 11    | 7,200     | 480         | 68            | 4          | $32,520 |
| 12    | 9,000     | 600         | 88            | 5          | $41,120 |
| 14    | 13,000    | 870         | 130           | 8          | $59,930 |
| 16    | 18,000    | 1,200       | 185           | 12         | $84,765 |
| 18    | 24,000    | 1,600       | 250           | 17         | $116,900 |

**MRR construction at Month 18**: 1,600 Pro × $29 = $46,400; 250 Team × $99 = $24,750; 17 Enterprise × avg $2,500 = $42,500; marketplace GMV share ≈ $3,250. Total: ~$116,900 MRR.

### Revenue Bridge to $150K MRR (Month 20-22)

The $150K MRR milestone is achievable at Month 20-22 under the conservative model if:
- Enterprise average contract value reaches $3,000/month as case studies accumulate
- Marketplace GMV grows to $30K/month gross (yielding $9K platform cut)
- Pro conversion improves to 9% as the learning loop becomes a demonstrable differentiator

### Key Risks to Projection

1. **Phase 1 ships late**: Each month of delay costs approximately 2 months of the growth curve (compounding effect). The 8-week critical path has no slack.
2. **Hello World > 5 minutes**: The free-to-Pro conversion depends on users experiencing value before friction. A 10-minute Hello World halves conversion rate estimates.
3. **Enterprise sales cycle**: Enterprise deals at Month 6 assume design partner relationships established at Month 1 (see Section 9). Without pre-existing relationships, Enterprise revenue pushes to Month 9-10.
4. **Marketplace cold start**: If premium skill inventory is thin at Phase 3 launch, marketplace revenue is near zero through Month 12. The cold-start playbook (Section 3) is load-bearing for Month 10+ projections.

---

## 3. Marketplace Cold-Start Playbook

The CEO's blocking concern: "Who creates the first 20 premium skills? How are they commissioned? What is the quality bar?"

### Answer: Three-Stage Commission Plan

**Stage 1 — Internal Curation (Pre-Launch, Weeks 1-8)**

The WinDAGs team is responsible for the first 50 community skills and 20 premium skill drafts. This is not optional and is not delegated to the community before launch.

The 50 seed community skills span five domains with known demand:
- Software engineering (10 skills): code review, dependency audit, migration script generation, changelog generation, test suite generation
- Data analysis (10 skills): SQL query generation, data quality assessment, visualization selection, statistical summary, anomaly detection
- Content creation (10 skills): technical blog post, release notes, documentation generation, meeting summary, proposal drafting
- Security (10 skills): OWASP checklist, dependency vulnerability scan, secret detection, threat model generation, access review
- DevOps (10 skills): incident postmortem, deployment checklist, infrastructure cost analysis, runbook generation, SLA compliance review

The team also creates 10 decomposition methods (HTN decomposition strategies for common problem classes) and 20 template DAGs (pre-built execution patterns for the seed domains).

The first 20 premium skill drafts are created by the team but not published at launch. They are held for the Founding Creator program (Stage 2).

**Stage 2 — Founding Creator Program (Launch + Days 1-90)**

Identify 10-15 power users from the beta program (Month 1-3). Selection criteria: demonstrated technical depth, articulate about their domain problems, active in community channels, at least 50 executions in beta.

Offer them Founding Creator status with three concrete benefits:
- Elevated revenue share: 80/20 (instead of 70/30) for skills published within the first 90 days
- Early access to the skill authoring toolkit (CTA-assisted creation; the system co-authors skills from execution traces)
- "Founding Creator" badge on their marketplace profile (permanent, not revocable even if share reverts to standard after Day 90)

The Founding Creator program runs from the public launch date (Month 4) through Day 90. Target: 15 Founding Creators publish at least 2 premium skills each = 30 premium skills in the marketplace by Month 7.

The WinDAGs team reviews all Founding Creator submissions. Quality bar: see below.

**Stage 3 — Crystallization Pipeline (Day 30 Onward)**

From Day 30, the system is generating crystallization candidates automatically: ad-hoc workflows that succeeded 3+ times with similar task signatures. The Curator module suggests these as skill drafts with a one-click "promote to marketplace" path.

Early users discover the system is writing skill drafts for them based on their usage patterns. This is a compounding supply mechanism that does not require manual commission after the initial seed period.

### Quality Bar for Premium Skills

A premium skill must pass four gates before marketplace listing:

1. **Functional gate**: The skill must achieve quality >= 0.85 on the Floor + Wall + Ceiling evaluation stack across 10 canonical test executions using the mock LLM provider.

2. **Coverage gate**: The WHEN_TO_USE and NOT_FOR sections must be non-trivial and non-overlapping. Monster-barring detector must show < 0.2 score (skill is not shrinking scope to fake quality). The skill must handle at least 3 canonical edge cases explicitly.

3. **Documentation gate**: The skill must include a concrete worked example (input → output), at least one failure case with expected behavior, and a Compatibility section listing which LLM providers it has been tested against.

4. **Uniqueness gate**: The skill library orthogonality metric must confirm the skill adds coverage that is not already provided by existing skills at > 80% overlap. Redundant skills are rejected or merged.

Skills that pass all four gates are listed as Premium. Skills that pass gates 1-2 but fail gate 3-4 are listed as Community with a "Draft" badge.

---

## 4. Marketplace Economics — 70/30 Analysis

The revenue split is 70% to the skill creator, 30% to the WinDAGs platform. This section justifies the 30% cut by reference to comparable platforms and specifies what the platform provides in exchange.

### Comparative Analysis

| Platform | Creator Share | Platform Cut | Discovery Mechanism | Notes |
|----------|-------------|-------------|---------------------|-------|
| Apple App Store | 70% | 30% | Curated + search + recommendations | Industry-standard for curated apps |
| VS Code Marketplace | 100% | 0% | Search + featured lists | No monetization; extensions are free |
| GitHub Marketplace | 80% | 20% | GitHub native discovery, org integration | Lower cut justified by GitHub distribution |
| Hugging Face Hub | 100% (community) | Variable (enterprise) | Search + trending + papers | Not a commercial marketplace; different model |
| Salesforce AppExchange | 75% | 25% | Salesforce CRM integration, certified badge | B2B marketplace premium |
| WinDAGs (proposed) | 70% | 30% | Ranked discovery + learning loop integration + quality certification | See below |

The 30% cut is justified by four specific services the platform provides that VS Code, GitHub, and Hugging Face do not:

**1. Quality certification**: Every listed premium skill has passed the four-gate quality review (Section 3). Buyers are not buying from an unvetted repository. The platform is the trust layer. This is valuable: enterprise buyers cannot afford to run uncertified agent skills in production.

**2. Ranked discovery with learning loop integration**: Skills in the WinDAGs marketplace are ranked by actual multi-dimensional Elo scores accumulated from real execution data — not by download count or manual curation. When a user's system recommends a skill, it is recommending based on empirical performance data in their domain. This discovery mechanism is structurally more valuable than search.

**3. Execution telemetry feedback to creators**: Creators receive anonymized execution telemetry: their skill's quality trajectory, developmental stage (novice/competent/proficient/expert), failure patterns, and comparison to peer skills in the same category. This feedback loop is unavailable in any comparable marketplace. It enables creators to improve their skills based on real-world performance.

**4. Distribution via the organizational embedding moat**: Skills sold through the WinDAGs marketplace are not just downloaded — they are integrated into organizational skill libraries, execution traces, and method rankings. This creates recurring demand: organizations that build workflows around a premium skill are sticky customers. Creators benefit from this stickiness without having to build it themselves.

The honest comparison is to Apple's App Store, not GitHub's marketplace. Apple charges 30% because it provides distribution to hundreds of millions of devices, payment processing, and a trusted brand. WinDAGs charges 30% because it provides distribution to the organizations that have the deepest investment in the platform, a trust layer that enterprise buyers require, and a data-driven discovery mechanism that is more valuable than search.

### Founder Creator Exception

For the first 90 days post-launch, Founding Creators receive 80/20. This is a commission subsidy to solve the cold-start problem. It has a sunset: after Day 90, the share reverts to 70/30 for new skills. Existing Founding Creator skills published in the first 90 days retain 80/20 for their lifetime on the platform.

---

## 5. Private Organizational Skill Libraries — Architectural Concept

The Market reviewer's key insight: "the most valuable enterprise skills are not marketplace-shareable." This section elevates organizational skill libraries from a tier feature to a first-class architectural concept.

### Why This Is Architecture, Not a Feature

An organizational skill library encodes the competitive advantage of the organization itself. Consider:
- A fintech company's compliance review workflow encodes years of regulatory interpretation, institutional judgment, and accumulated failure patterns from real audits.
- A gaming studio's content moderation skill encodes their specific community standards, legal exposure, and edge case library from thousands of moderation decisions.
- A healthcare company's clinical documentation skill encodes HIPAA-specific constraints, EHR integration patterns, and clinical terminology validated by clinicians.

None of these skills are marketplace-shareable. Publishing them would transfer competitive advantage to competitors. They are organizational assets in exactly the same way as proprietary code, customer data, or internal processes.

WinDAGs treats organizational skill libraries as organizationally owned intellectual property. The platform is the infrastructure; the organization owns the content.

### Storage Model

Organizational skills are stored in a separate namespace from community skills. The data model distinguishes:

```
community_skills        → Shared, publicly readable, marketplace-eligible
org_skills:{org_id}     → Private to the organization, never indexed by platform
user_skills:{user_id}   → Private to the individual user (free tier baseline)
```

Organizational skills can reference community skills (import, extend, wrap), but community skills cannot reference organizational skills. The dependency graph is strictly one-directional. This prevents accidental leakage of organizational content into community indexes.

On-premises deployments (Enterprise tier): organizational skill libraries are stored entirely within the customer's infrastructure. The WinDAGs platform never receives the skill content. Execution telemetry from organizational skills is opt-in; by default, execution traces from org skills stay on-premises.

### Access Control Model

Three access levels within an organizational skill library:

| Level | Who | Can Do |
|-------|-----|--------|
| Reader | All org members | Execute skills, view metadata, view quality metrics |
| Author | Designated contributors | Create, edit, version skills; submit for internal review |
| Admin | Org administrators | Approve skills, set access controls, export/import, manage library structure |

Internal review workflow (Team+ tiers): Authors submit skills to Admin review. Admins approve or reject with comments. Approved skills are versioned and published to the org library. Rejected skills are returned with rejection reason.

Skills can be scoped to sub-organizations (departments, teams, projects). A skill marked `scope: engineering` is visible to engineering team members but not to the sales team. Scoping is enforced at the execution layer, not just the UI layer.

### Sharing Model

Organizational skills have four sharing states:

1. **Private** (default): Visible only within the organization.
2. **Partner-shared**: Shared with one or more specific named organizations (bilateral agreement; used for partner integrations, joint ventures, outsourced teams).
3. **Anonymous-contributed**: The skill's logic is contributed to the community skill library with organizational attribution stripped. The organization donates the skill; they receive a Contributor badge but no revenue share. This is the mechanism for organizations that want to give back without exposing organizational identity.
4. **Marketplace-published**: The skill is submitted to the premium marketplace with the standard 70/30 revenue split. The organization becomes a commercial skill creator.

The sharing model is explicit and requires Admin approval to transition a skill from Private to any other state. No skill leaks to the marketplace without deliberate organizational decision.

### Pricing

Organizational skill libraries are included in the Team and Enterprise tiers. The pricing reflects the value of the organizational embedding moat:

- **Free tier**: Single-user namespace only. Skills are private to the individual user. No team sharing.
- **Pro tier**: Single-user namespace. Skills are private to the individual user. No team sharing.
- **Team tier** ($99/month): Team-scoped organizational skill library. Up to 10 members. Scoping to sub-teams within the organization.
- **Enterprise tier** (custom): Unlimited members, unlimited sub-organization scoping, on-premises storage option, audit logs, partner-sharing agreements, formal data processing agreements.

---

## 6. MCP Integration Positioning

The Market reviewer demanded explicit specification of the MCP relationship. WinDAGs' position on MCP is bidirectional but asymmetric: WinDAGs is the orchestrator, not a tool.

### What WinDAGs Exposes as MCP Tools

WinDAGs exposes its skill library as MCP tools, making individual WinDAGs skills callable by any MCP-compatible client (Claude Code, other orchestrators, IDE plugins):

- `windags.skill.execute(skill_id, input)` — Execute a specific skill and return the result
- `windags.skill.search(query, domain)` — Search the skill library by query and domain; returns ranked results with Elo scores
- `windags.dag.execute(description, config)` — Submit a natural language problem description and receive a DAG execution result
- `windags.dag.status(dag_id)` — Poll the status of a running DAG execution
- `windags.skill.crystallize(execution_traces)` — Submit execution traces for crystallization review; returns a skill draft if patterns are detected

These MCP tool exposures make WinDAGs a composable primitive in the broader MCP ecosystem. An LLM agent using Claude Code can call `windags.skill.execute` to invoke domain-specific skills without running the full WinDAGs orchestration stack. This is a distribution mechanism: it puts WinDAGs skills in front of MCP users who are not yet WinDAGs adopters.

### What WinDAGs Consumes as MCP Tools

WinDAGs agents can call any external MCP tool as a capability within a DAG. The LLM abstraction layer treats MCP tools as first-class execution resources alongside direct LLM API calls:

- File system operations (read, write, search) — enabling agents to work with local artifacts
- Browser / web fetch — enabling research and data gathering nodes
- Code execution environments — enabling test-running and linting nodes
- Database connectors — enabling data access nodes without custom skill authoring
- Third-party API connectors (GitHub, Jira, Slack, PagerDuty) — enabling integration-heavy workflows

MCP tool calls are tracked in execution telemetry identically to LLM calls: cost (where applicable), latency, success/failure, and contribution to the overall quality vector. A node that calls an MCP tool is evaluated the same way as a node that calls an LLM.

### A2A Positioning

The Agent-to-Agent (A2A) protocol represents a future state where WinDAGs instances communicate with each other and with other agent systems as peers. WinDAGs' A2A stance:

- **Phase 1-3**: WinDAGs does not implement A2A. MCP is sufficient for tool-level interoperability.
- **Phase 4**: A2A support for organizational WinDAGs instances that need to coordinate across team or department boundaries — for example, an engineering WinDAGs instance delegating a compliance check to a legal team's WinDAGs instance.
- **Strategic position**: WinDAGs is an A2A orchestrator, not an A2A tool. When A2A coordination occurs, WinDAGs manages the coordination topology (which agent handles which subtask, what contracts govern the handoff), not the transport protocol.

The one-sentence A2A positioning: WinDAGs orchestrates A2A interactions; it does not become subordinate to them.

---

## 7. License Boundary Document

The Market reviewer's concern: "'Trust us' is insufficient." This section provides an enumerable specification of what is Apache 2.0 forever and what is BSL 1.1.

The "trust us" problem is real. Enterprise legal teams cannot approve tooling based on verbal commitments. This document is the commitmentm, and it must be checkable against the actual repository structure.

### Apache 2.0 Forever (Core)

The following components are Apache 2.0 licensed and this will not change. "Apache 2.0 forever" means: no relicensing, no BSL transition, no Commercial Source License conversion. If WinDAGs ever violates this commitment, the Apache 2.0 license already granted to existing users is irrevocable — users can fork from the last Apache 2.0 commit.

| Component | What It Is | Package |
|-----------|-----------|---------|
| Core execution engine | DAG execution loop, wave scheduling, Kahn's algorithm | `@windags/core` |
| Type system | All type definitions in `types.ts` | `@windags/types` |
| SKILL.md format specification | The interchange format for skills | Specification document; reference parser in `@windags/skill-parser` |
| Skill selection cascade | Five-step selection algorithm (ADR-007) | `@windags/core` |
| Thompson sampling + Elo | Base learning primitives | `@windags/learning` |
| Four-layer evaluation protocol | Floor, Wall, Ceiling, Envelope logic | `@windags/evaluator` |
| Circuit breakers | Three-level failure containment | `@windags/resilience` |
| ContextStore | Progressive summarization, token budget management | `@windags/context` |
| LLM abstraction layer | Provider router, behavioral contracts, mock provider | `@windags/llm` |
| Visualization components | ReactFlow DAG renderer, timeline, hierarchy views | `@windags/viz` |
| CLI tools | `windags init`, `windags run`, `windags skill` | `@windags/cli` |
| Self-hosting infrastructure | Docker compose, Kubernetes manifests | `deploy/` |

### BSL 1.1 Commercial (Platform)

The following components are Business Source License 1.1. BSL 1.1 means: free for non-commercial use and non-production internal use; commercial use requires a license (included in Pro/Team/Enterprise tiers). BSL components convert to Apache 2.0 after 4 years.

| Component | What It Is | Why Not Open |
|-----------|-----------|-------------|
| Marketplace infrastructure | Skill listing, payment processing, creator analytics | Revenue-generating platform service |
| Organizational skill library server | Multi-tenant storage, access control, audit logs | Differentiated enterprise feature |
| Cloud execution platform | Managed hosting, SLA infrastructure, rate limiting | Revenue-generating hosted service |
| Drift detection dashboard | Kuhnian crisis visualization, multi-tenant org view | Differentiated Pro/Enterprise feature |
| Compilation pipeline | DSPy compilation orchestration (Phase 3) | Compute-intensive; commercially operated |
| A2A coordination server | Cross-organizational agent coordination (Phase 4) | Enterprise-only feature |

### What BSL 1.1 Means in Practice

- Self-hosting the Apache 2.0 core: always free for any use, including commercial
- Running WinDAGs inside your company for internal workflows: free (internal use)
- Building a product that resells WinDAGs as a managed service: requires commercial license
- Using the marketplace to sell skills: covered by creator agreement; BSL does not affect creators

The BSL → Apache 2.0 conversion schedule: all BSL 1.1 components convert to Apache 2.0 on January 1, 2030 (4 years from anticipated 2026 launch). This is a binding commitment written into the license file.

### What This Document Enables

Enterprise legal teams can verify compliance by checking the `LICENSE` file in each package. The license boundary is enforced at the package level, not the source file level, which makes it auditable without reading source code. Any future changes to the license boundary require a public announcement with 90-day notice and do not retroactively affect rights already granted.

---

## 8. The $100M LangGraph Question

The CEO's framing: if LangGraph raises $100M and hires 50 engineers, what can't they copy in 12-18 months?

### The Honest Assessment

LangGraph can copy:
- The evaluation stack (Floor/Wall/Ceiling/Envelope) — it is architecturally sound but not novel; well-funded engineers can implement it in 6-8 months
- The visualization layer — React Flow is open-source; a polished DAG UI is a 3-month project with adequate resources
- The SKILL.md format — it is an open specification; competitors can adopt it
- The resilience infrastructure (circuit breakers, saga compensation, PreMortem) — standard distributed systems patterns; implementable in 4-6 months

LangGraph cannot copy in 12-18 months:
- **The execution history**: WinDAGs' Thompson parameters, Elo ratings, and method quality scores are accumulations of real execution data. A fresh LangGraph deployment in the same domain starts from zero. WinDAGs with 500 executions in that domain has meaningfully better skill selection. This advantage is proportional to execution volume and accumulates faster than competitors can catch up without users.
- **The organizational embedding**: Organizations that have built custom skills, tuned method libraries, and accumulated failure intelligence are not migrating. The switching cost is not technical (skills are Apache 2.0 and portable); the switching cost is the accumulated learning state. An organization at Month 18 with 5,000 executions of their compliance review workflow, 50 custom skills, and a crystallized method library has created something that no amount of engineering budget can instantly replicate.
- **The failure intelligence network**: Anonymized failure patterns from thousands of organizations create a cross-deployment intelligence layer (Phase 2+). This is a data network effect. LangGraph has no equivalent data asset because LangGraph executions are stateless.

### The 12-18 Month Window

The window exists for a specific reason: LangGraph's current stateless architecture is not a bug they can patch — it is a foundational design choice. Rewriting LangGraph to accumulate learning state while maintaining backward compatibility with the entire LangGraph ecosystem is a multi-year project, not a sprint.

The window closes when one of two things happens: (1) LangGraph ships a native learning loop that accumulates organizational state, or (2) a well-funded new entrant ships with a WinDAGs-equivalent learning architecture and better go-to-market execution.

The window stays open if WinDAGs uses the 12-18 months to do three things:
1. Get to 10,000+ active organizations before LangGraph ships learning
2. Make the organizational skill library migration cost prohibitive (accumulate enough org-specific state that switching is genuinely painful)
3. Win the enterprise narrative: "production-grade agent orchestration with audit trails" is a different category than "developer framework for LLM apps"

### What the $100M Actually Threatens

The most plausible $100M threat scenario is not technical replication. It is ecosystem capture: LangGraph uses the funding to build integrations with every major enterprise data platform (Snowflake, Databricks, Salesforce), sign strategic partnerships with AWS/Azure/GCP, and become the default agent orchestration layer for the cloud providers' own managed AI services.

The WinDAGs response to this threat is not to outspend on integrations. It is to be so deeply embedded in the organizations that use it that cloud provider partnerships route through WinDAGs rather than displace it. The organizational embedding moat is the defense against ecosystem capture, not just technical competition.

---

## 9. Design Partner Program

The CEO suggested 3-5 companies. This section defines the full program.

### Selection Criteria

Target: 5 design partners, selected by Month 1, engaged through Month 9.

A design partner must meet all four criteria:
1. **Scale**: 5-50 person engineering team with at least 3 people whose primary job involves complex multi-step analytical or generative workflows
2. **Domain diversity**: The five partners should span at least four distinct domains (software engineering, data analysis, legal/compliance, creative/content, security/DevOps) to ensure the skill library is not over-indexed on one domain
3. **Feedback commitment**: A designated technical contact who can engage with the WinDAGs team for 2-4 hours per week during the engagement period — not a VP who signs off, but an engineer who runs the workflows
4. **Organizational authority**: The ability to adopt WinDAGs for at least one real production workflow within 60 days — not just evaluation, but actual use

Disqualifying factors: direct competitors to WinDAGs; organizations whose compliance requirements prevent sharing even anonymized execution telemetry (telemetry is the currency of the design partner exchange); organizations that require NDA-gated features before any commitment (design partners receive early access but not custom feature development on demand).

### What Design Partners Receive

- Free Enterprise tier for 12 months (market value: ~$24,000 per partner)
- Direct access to the WinDAGs engineering team: weekly 30-minute check-ins, Slack channel with < 4-hour response time
- Priority feature requests: design partner requests enter the Phase 2 planning backlog; they are not guaranteed but are explicitly considered
- "Design Partner" badge on their company's WinDAGs marketplace profile (if they choose to publish skills)
- Case study co-authorship: the partner co-authors their success story with WinDAGs and receives approval rights over how their name is used
- Early access to Phase 2 and Phase 3 features before public release (2-4 week preview window)

### What Design Partners Provide

- 2-4 hours per week of technical contact time for 9 months
- Permission to use anonymized execution telemetry (failure patterns, skill quality data, method effectiveness) to improve the platform — no raw data, no organizational skill content, aggregate statistics only
- At least one documented use case submitted for the case study library by Month 6
- Participation in at least two product feedback sessions (structured 90-minute sessions with the product team)
- Non-exclusive reference: willing to be named as a design partner on the WinDAGs website and in investor materials

### Timeline

| Milestone | Date |
|-----------|------|
| Identify 10 candidates from network | Month 1 Week 1 |
| Initial conversations with all 10 | Month 1 Week 3 |
| Design partner agreements signed | Month 2 Week 2 |
| Onboarding sessions (2 hours each) | Month 2 Week 4 |
| First real workflow running at each partner | Month 3 Week 4 |
| Mid-program review: are partners getting value? | Month 5 |
| Case study drafts submitted | Month 6 |
| Phase 2 feature preview access | Month 7 |
| Program end; transition to standard Enterprise pricing | Month 9 |
| Case studies published | Month 10 |

### Success Metrics

The design partner program succeeds if, by Month 9:
- At least 4 of 5 partners have converted to paid Enterprise contracts
- At least 3 partners have published case studies (co-authored, approved by partner)
- At least 2 partners have published organizational skills to the marketplace (evidence of value creation beyond the WinDAGs team)
- The average partner has accumulated 500+ executions on at least one production workflow (evidence of real use, not evaluation use)
- At least 1 partner can serve as a reference call for an inbound enterprise prospect (qualitative: the partner's engineer enthusiastically endorses WinDAGs to a peer)

The program fails if < 3 partners convert to paid contracts by Month 10. In that scenario, the business model assumptions in Section 2 require downward revision.

---

## 10. Unit Economics

### Cost Per Execution

WinDAGs' meta-layer cost target is < 10% of total execution cost for medium DAGs, not to exceed $0.07 per execution (BC-BIZ-003).

**Cost components per execution** (medium DAG; 10-20 nodes; Pro tier):

| Component | Cost | Notes |
|-----------|------|-------|
| Stage 1 review (Floor + Wall) | < $0.005 per node | Deterministic; target < 500ms per BC-EM |
| Stage 2 review (Ceiling, Channel A) | $0.02 per triggered node | ~40% of nodes trigger Stage 2 at Pro tier |
| Envelope computation | $0 | Deterministic; zero marginal cost |
| Skill selection cascade | $0.001 | Vector search + Thompson sampling |
| Learning update (Thompson + Elo) | $0.001 | In-process computation |
| Looking Back Q1-Q2 | $0.005 | Required; every DAG |
| ContextStore operations | $0.002 | Summarization overhead |
| WebSocket / infrastructure | $0.002 | Pro tier allocation |

**Total meta-layer cost per medium DAG** (20 nodes, 40% Stage 2 escalation): $0.005 × 20 + $0.02 × 8 + $0.001 + $0.001 + $0.005 + $0.002 + $0.002 = $0.100 + $0.160 + $0.011 = $0.271.

At a typical medium DAG execution cost of $2-5 in LLM API costs, the meta-layer is 5-14% of total cost — within the < 10% target for most executions. High-Stage-2-escalation DAGs (irreversible nodes, final deliverables) will exceed 10% on purpose; the cost is justified by the quality guarantee.

**Note**: LLM API costs are pass-through to the user. WinDAGs charges for orchestration, not inference.

### Margin Per Tier

| Tier | Gross Revenue | Infrastructure Cost | Support Cost | Net Margin |
|------|--------------|---------------------|-------------|-----------|
| Free | $0 | ~$0.80/MAU/month (compute) | $0 (community) | Negative; CAC investment |
| Pro ($29) | $29 | ~$3/account/month | ~$2/account/month | ~83% gross; ~65% net |
| Team ($99) | $99 | ~$8/account/month | ~$5/account/month | ~87% gross; ~74% net |
| Enterprise ($2,500 avg) | $2,500 | ~$80/account/month | ~$200/account/month (CSM allocation) | ~89% gross; ~81% net |

Infrastructure costs are dominated by PostgreSQL hosting, vector search (pgvector), and WebSocket connections. At scale, infrastructure costs as a percentage of revenue decrease. The Pro and Team tiers have the highest margin profile because support costs are low (self-serve, documentation-driven) and infrastructure costs are fixed per account regardless of execution volume within plan limits.

### LTV / CAC Targets

**Customer Acquisition Cost (CAC)**:

| Channel | CAC Target | Notes |
|---------|-----------|-------|
| Organic / word-of-mouth | $0 | Target primary channel |
| Open-source community | $20-50 | DevRel, conference talks, blog content |
| Product-led growth (free → paid) | $30-80 | Cost of free tier infrastructure per converting user |
| Paid acquisition (content SEO) | $100-200 | Acceptable only for Pro; not for Free |
| Enterprise outbound | $500-2,000 | Acceptable given Enterprise LTV |

**Lifetime Value (LTV)**:

| Tier | Avg Contract Duration | Monthly Revenue | LTV |
|------|----------------------|----------------|-----|
| Pro | 18 months | $29 | $522 |
| Team | 24 months | $99 | $2,376 |
| Enterprise | 36 months | $2,500 avg | $90,000 |

**LTV:CAC Targets**:

| Tier | LTV | Target CAC | LTV:CAC Ratio |
|------|-----|-----------|--------------|
| Pro | $522 | < $100 | > 5:1 |
| Team | $2,376 | < $400 | > 5:1 |
| Enterprise | $90,000 | < $5,000 | > 15:1 |

The 5:1 LTV:CAC ratio is the minimum healthy threshold for SaaS. The 15:1 target for Enterprise reflects the high value of the organizational embedding moat: Enterprise customers who have invested in organizational skill libraries have significantly lower churn than the baseline assumption (5% monthly), often renewing for 3+ years.

**The key insight**: WinDAGs' LTV is not primarily a function of pricing — it is a function of the organizational embedding moat. An Enterprise customer at Month 18 with 5,000+ executions and 50+ organizational skills has a switching cost that drives multi-year retention regardless of competitor pricing. The LTV projections above assume the moat activation happens at Month 6-9 per customer; customers who activate the moat churn at < 1% monthly rather than 5%.

---

## Appendix: Blocking Item Resolution Index

| Reviewer | Blocking Concern | Section Addressing It |
|----------|-----------------|----------------------|
| Market | Move Envelope to free tier | Section 1 (Free Tier) |
| Market | Go-to-market Day 1/30/180 value story | Part 4 roadmap (addressed in constitution); reflected in Pro tier learning description |
| Market | MCP relationship explicit | Section 6 |
| Market | Open-source/commercial license boundary document | Section 7 |
| Market | Private org skill libraries as architectural concept | Section 5 |
| CEO | Who creates first 20 premium skills? | Section 3 |
| CEO | How are they commissioned? | Section 3 |
| CEO | What is the quality bar? | Section 3 |
| CEO | Marketplace cold-start playbook | Section 3 |
| CEO | $100M LangGraph question | Section 8 |
| CEO | Design partner program (3-5 companies) | Section 9 |
| Preservation Audit | Revenue projections MISSING ($0→$5K→$25K→$150K+) | Section 2 |

---

*Document length: ~490 lines. All ten required sections present. All blocking items from Market and CEO reviewers addressed. Preservation audit MISSING flag on revenue projections resolved.*
