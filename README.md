# windags-skills

**463+ agent skills** for Claude Code, Codex, Gemini CLI, Cursor, and 40+ other coding agents. Built by [WinDAGs](https://windags.ai).

Includes **/next-move** -- a 5-agent meta-DAG that predicts your highest-impact next action as a parallelized wave-based execution plan.

## Quick Install

**Claude Code** (plugin):
```
claude plugin add /path/to/windags-skills
```

**Any agent** (manual):
```bash
git clone https://github.com/curiositech/windags-skills.git
# Copy skills you want:
cp -r windags-skills/skills/next-move ~/.claude/commands/
```

## /next-move

The flagship skill. Analyzes your project context (git state, CLAUDE.md, recent commits, conversation) and produces a predicted DAG of the highest-impact agents to run next.

```
/next-move                           # Auto-detect what to work on
/next-move fix the flaky auth tests  # Tell it what you care about
```

What you get:
- Problem classification (well-structured / ill-structured / wicked)
- 3-8 subtasks decomposed into parallel waves
- Each subtask matched to the best skill from 463+ via BM25 retrieval
- Risk analysis (what could go wrong + mitigations)
- Time and cost estimates
- Accept / Modify / Reject feedback loop

## Skill Categories (19)

| Category | Count | Examples |
|----------|-------|---------|
| Agent & Orchestration | 78 | dag-orchestrator, next-move, skill-architect |
| Research & Academic | 61 | raft-consensus, bdi-agents, chain-of-thought |
| Design & Creative | 46 | design-system-creator, pixel-art, typography |
| Backend & Infrastructure | 35 | api-architect, microservices, caching |
| Cognitive Science | 29 | naturalistic-decision-making, sensemaking |
| AI & Machine Learning | 27 | ai-engineer, RAG, computer-vision |
| DevOps & Infrastructure | 26 | github-actions, kubernetes, terraform |
| Frontend & UI | 24 | nextjs, react-performance, animation |
| Data & Analytics | 17 | data-pipeline, dbt, data-viz |
| Mobile Development | 17 | ios, react-native, flutter |
| Code Quality & Testing | 16 | vitest, playwright, code-review |
| Productivity & Meta | 16 | prompt-engineer, documentation, skill-creator |
| Recovery & Wellness | 16 | sobriety, crisis-intervention, speech-pathology |
| Lifestyle & Personal | 14 | ADHD, grief, finance, interior-design |
| Content & Marketing | 14 | SEO, copywriting, product-launches |
| Career & Interview | 9 | interview-prep, resume, hiring |
| Legal & Compliance | 7 | expungement, HIPAA, legal-tech |
| Video & Audio | 6 | video-production, TTS, sound-design |
| Security | 5 | auth, vulnerability-scanning, zero-trust |

## Compatibility

Skills follow the [Agent Skills](https://agentskills.io) open standard:

- Claude Code
- OpenAI Codex CLI
- Gemini CLI
- Cursor
- VS Code Copilot
- Antigravity IDE
- 30+ other agents

## License

BUSL-1.1 (Business Source License). Free for non-commercial use. Converts to Apache 2.0 on 2030-03-03. See [LICENSE](LICENSE) for details.

Commercial licensing: licensing@curiositech.ai
