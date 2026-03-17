# windags-skills

**190+ agent skills** for Claude Code, Codex, Gemini CLI, Cursor, and 40+ other coding agents. Built by [WinDAGs](https://windags.ai).

Follows the [Agent Skills](https://agentskills.io) open standard.

## Quick Install

**Claude Code** (plugin marketplace):
```
/plugin marketplace add curiositech/windags-skills
```

**Any agent** (npx):
```bash
npx skills add curiositech/windags-skills
```

**Single skill** (manual):
```bash
git clone https://github.com/curiositech/windags-skills.git
cp -r windags-skills/skills/SKILL_NAME ~/.claude/skills/
```

## Featured Skills

| Skill | What It Does |
|-------|-------------|
| **next-move** | Predicts your highest-impact next actions as a parallelized DAG |
| **skill-architect** | Designs, creates, audits, and improves agent skills |
| **skill-creator** | Builds new skills with frontmatter validation and anti-pattern detection |
| **api-architect** | Expert API designer for REST, GraphQL, and gRPC |
| **code-review-checklist** | Structured code review with anti-pattern detection |
| **fullstack-debugger** | Cross-stack debugging from browser to database |
| **security-auditor** | Security vulnerability scanning and remediation |
| **prompt-engineer** | Expert prompt optimization and testing |
| **mcp-creator** | Build Model Context Protocol servers |
| **typescript-advanced-patterns** | Advanced TypeScript type-level programming |

## All Skills (194)

<details>
<summary>Click to expand full catalog</summary>

### Engineering
`api-architect` `code-architecture` `code-necromancer` `code-review-checklist` `component-template-generator` `database-design-patterns` `dependency-management` `docker-containerization` `drizzle-migrations` `error-handling-patterns` `form-validation-architect` `frontend-architect` `fullstack-debugger` `git-workflow-expert` `github-actions-pipeline-builder` `llm-streaming-response-handler` `microservices-patterns` `modern-auth-2026` `monorepo-management` `nextjs-app-router-expert` `oauth-oidc-implementer` `openapi-spec-writer` `postgresql-optimization` `pwa-expert` `react-performance-optimizer` `real-time-collaboration-engine` `refactoring-surgeon` `rest-api-design` `supabase-admin` `terraform-iac-expert` `typescript-advanced-patterns` `websocket-streaming`

### Testing & Quality
`checklist-discipline` `code-review-checklist` `launch-readiness-auditor` `playwright-e2e-tester` `playwright-screenshot-inspector` `test-automation-expert` `vitest-testing-patterns` `webapp-testing`

### DevOps & Infrastructure
`background-job-orchestrator` `caching-strategies` `cloudflare-worker-dev` `devops-automator` `logging-observability` `performance-profiling` `site-reliability-engineer` `vercel-deployment`

### AI & Machine Learning
`agent-creator` `ai-engineer` `automatic-stateful-prompt-improver` `chatbot-analytics` `clip-aware-embeddings` `computer-vision-pipeline` `event-detection-temporal-intelligence-expert` `mcp-creator` `prompt-engineer` `recursive-synthesis` `skillful-subagent-creator` `very-long-text-summarization`

### Design & Creative
`2000s-visualization-expert` `collage-layout-expert` `color-contrast-auditor` `color-theory-palette-harmony-expert` `dark-mode-design-expert` `design-accessibility-auditor` `design-archivist` `design-critic` `design-justice` `design-system-creator` `design-system-documenter` `design-system-generator` `design-trend-analyzer` `hand-drawn-infographic-creator` `interior-design-expert` `maximalist-wall-decorator` `mobile-ux-optimizer` `native-app-designer` `neobrutalist-web-designer` `pixel-art-infographic-creator` `pixel-art-scaler` `typography-expert` `ux-friction-analyzer` `vaporwave-glassomorphic-ui-designer` `vibe-matcher` `web-design-expert` `win31-pixel-art-designer` `windows-3-1-web-designer` `windows-95-web-designer`

### Data & Visualization
`data-pipeline-engineer` `data-viz-2025` `diagramming-expert` `geospatial-data-pipeline` `large-scale-map-visualization` `mermaid-graph-renderer` `mermaid-graph-writer` `reactive-dashboard-performance`

### Media & Audio/Video
`ai-video-production-master` `photo-composition-critic` `photo-content-recognition-curation-expert` `sound-engineer` `video-processing-editing` `voice-audio-engineer` `web-cloud-designer` `web-wave-designer` `web-weather-creator` `win31-audio-design`

### Research & Analysis
`competitive-cartographer` `munger-worldly-wisdom` `research-analyst` `research-craft` `seo-visibility-expert` `systems-thinking`

### Writing & Documentation
`claude-ecosystem-promoter` `email-composer` `mdx-sanitizer` `skill-documentarian` `technical-writer`

### Career & Professional
`anthropic-technical-deep-dive` `career-biographer` `cv-creator` `hiring-manager-deep-dive` `hr-network-analyst` `interview-loop-strategist` `interview-simulator` `job-application-optimizer` `ml-system-design-interview` `senior-coding-interview` `team-builder` `tech-presentation-interview` `values-behavioral-interview`

### Productivity & Meta
`adhd-daily-planner` `adhd-design-expert` `bot-developer` `feature-manifest` `next-move` `personal-finance-coach` `project-management-guru-adhd` `skill-architect` `skill-coach` `skill-creator` `skill-grader` `swift-executor` `tech-entrepreneur-coach-adhd` `wisdom-accountability-coach`

### Security & Compliance
`2026-legal-research-agent` `document-generation-pdf` `hipaa-compliance` `national-expungement-expert` `security-auditor`

### Specialized Domains
`admin-dashboard` `agentic-patterns` `clinical-diagnostic-reasoning` `crisis-detection-intervention-ai` `crisis-response-protocol` `digital-estate-planner` `drone-cv-expert` `drone-inspection-specialist` `fancy-yard-landscaper` `grief-companion` `hrv-alexithymia-expert` `human-centered-design-fundamentals` `indie-monetization-strategist` `jungian-psychologist` `knot-theory-educator` `legal-advertorial-writer` `metal-shader-expert` `modern-drug-rehab-computer` `panic-room-finder` `partner-text-coach` `pet-memorial-creator` `physics-rendering-expert` `product-appeal-analyzer` `recovery-app-legal-terms` `recovery-app-onboarding` `recovery-coach-patterns` `recovery-community-moderator` `recovery-education-writer` `recovery-social-features` `sober-addict-protector` `sobriety-tools-guardian` `soma-voices` `speech-pathology-ai` `vr-avatar-engineer` `wedding-immortalist`

</details>

## Compatibility

These skills follow the [Agent Skills](https://agentskills.io) open standard and work with:

- Claude Code
- OpenAI Codex CLI
- Gemini CLI
- Cursor
- VS Code Copilot
- Antigravity IDE
- OpenCode
- 30+ other agents

## Contributing

PRs welcome. Each skill lives in `skills/<name>/SKILL.md`. Follow the [Agent Skills spec](https://agentskills.io/specification).

## License

Apache-2.0
