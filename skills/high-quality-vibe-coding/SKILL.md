---
license: Apache-2.0
name: high-quality-vibe-coding
description: |
  Patterns for vibe coding that produce production-quality output instead of garbage. Covers prompt engineering for AI coding, verification without reading every line, accept/reject/refine decision framework, architectural guardrails, context management (CLAUDE.md, .cursor/rules), TDD-driven vibe coding, screenshot-driven development, diff review discipline, and the anti-patterns that destroy quality. Activate on: "vibe coding", "AI coding quality", "Claude Code workflow", "AI-assisted development", "how to use AI for coding", "coding with AI", "agentic engineering workflow", "AI code quality", "vibe code without garbage", "production quality AI code", "CLAUDE.md setup", "cursorrules setup", "pre-commit hooks for AI", "TDD with AI", "test-driven vibe coding". NOT for: multi-person collaborative coding sessions (use cooperative-vibe-coding), building AI/LLM applications (use ai-engineer), prompt engineering for non-coding LLM use cases (use prompt-engineer).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Development Workflow
  tags:
    - vibe-coding
    - ai-assisted-development
    - code-quality
    - tdd
    - claude-code
    - cursor
    - agentic-engineering
    - workflow
    - best-practices
    - guardrails
    - pre-commit
    - context-management
  pairs-with:
    - skill: cooperative-vibe-coding
      reason: When vibe coding becomes multi-person — collaborative sessions with agents
    - skill: prompt-engineer
      reason: Deeper prompt optimization techniques for complex AI interactions
    - skill: vitest-testing-patterns
      reason: TDD-driven vibe coding requires strong test authoring skills
    - skill: git-best-practices
      reason: Git discipline is a core guardrail — small commits, clean diffs, worktrees
category: Code Quality & Testing
tags:
  - vibe-coding
  - code-quality
  - best-practices
  - craftsmanship
  - methodology
---

# High-Quality Vibe Coding

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes,
> embrace exponentials, and forget that the code even exists."
> — Andrej Karpathy, February 2025

Karpathy coined the term for throwaway weekend projects. One year later he declared it
passe — LLM agents had become the default professional workflow. He now calls it **agentic
engineering**: you orchestrate agents who write code while you provide oversight,
architecture, and judgment.

The problem: most people still vibe code the original way — Accept All, ignore diffs,
copy-paste errors back in, hope for the best. The result is garbage. Studies show AI
co-authored code has 2.74x higher security vulnerability rates, 75% more
misconfigurations, and experienced developers are 19% slower when they use AI tools
without discipline (while believing they are 24% faster).

This skill is about the discipline layer that makes vibe coding produce production-quality
output. You are the architect. The AI is the builder.

## When to Use

- Starting a new project or feature with AI coding assistance
- Setting up guardrails for an AI-assisted development workflow
- Configuring CLAUDE.md, .cursor/rules, pre-commit hooks, or CI for AI-generated code
- Teaching a team to use AI coding tools without creating technical debt
- Any time you find yourself accepting AI output without understanding it

## Do NOT Use For

- **Multi-person collaborative coding** — use `cooperative-vibe-coding`
- **Building AI/LLM applications** — use `ai-engineer`
- **Prompt engineering for non-coding tasks** — use `prompt-engineer`
- **Git workflow mechanics** — use `git-best-practices`
- **Test authoring patterns** — use `vitest-testing-patterns`

---

## The Three Laws

1. **Never accept what you cannot verify.** If you cannot test it, type-check it, or
   visually confirm it, do not merge it.
2. **Small batches, always.** One function, one feature, one fix. Never "build the whole
   thing." LLMs perform best on focused prompts.
3. **Guardrails are non-negotiable.** Types, linters, formatters, pre-commit hooks, and
   tests run automatically — not when you remember to.

> "AI should help us produce better code. Code that is better tested, better documented,
> code with better commit messages, and code that has been more thoroughly reviewed."
> — Simon Willison, Agentic Engineering Patterns, 2026

---

## Prompting for Code Quality

How you describe what you want determines what you get.

### The Effective Prompt Formula

```
[CONTEXT] + [CONSTRAINT] + [EXAMPLE] + [TASK] + [VERIFICATION]
```

**Bad:** `Build a user authentication system`

**Good:**
```
Implement JWT auth middleware for our Express app.

Context: TypeScript strict mode, Express 5, Drizzle ORM.
Existing patterns in src/middleware/auth.ts. RS256 with env var keys.

Constraints: Handle expired tokens (401). Attach typed user to Request
(see src/types/express.d.ts). Use jose, no other auth libraries.

Write the middleware, then 3 tests:
1. Valid token -> req.user populated
2. Expired token -> 401 "Token expired"
3. Missing token -> 401 "No token provided"
```

### Show, Don't Tell

LLMs are exceptional mimics. Show an example from your codebase instead of describing
the pattern in prose:

```
Here's how we write route handlers:

// src/routes/health.ts
export const healthRoute = createRoute({
  method: 'GET',
  path: '/health',
  handler: async (req, res) => res.json({ status: 'ok', timestamp: Date.now() }),
  schema: { response: healthResponseSchema },
});

Create a similar route for GET /api/users/:id using Drizzle patterns in src/db/queries/.
```

### Prompt Sizing

| Size | Result | Use When |
|------|--------|----------|
| 1-2 sentences | Ambiguous, many assumptions | Trivial tasks (rename, format) |
| 3-8 sentences | Focused, high quality | Most tasks (functions, components) |
| 1-2 paragraphs | Good if structured | Complex features with clear scope |
| Full page+ | Diminishing returns, contradictions | Almost never — break into smaller tasks |

> "LLMs perform best when given focused prompts: implementing one function, fixing one
> bug, or adding one feature at a time." — Addy Osmani, 2026

### Plan Before You Build

Before any complex task, force a planning phase. In Claude Code:
```
Think through the architecture for adding WebSocket support.
Do NOT write any code yet. Give me: files to change, new files needed,
public API signatures, edge cases, test plan.
I will review your plan before we implement.
```

In Cursor: Shift+Tab twice for Plan Mode (prevents file modifications).

This eliminates the most common vibe coding failure: the AI building the wrong thing
very quickly and confidently.

---

## The Verification Layer

How do you verify AI output without reading every line? Build systems that verify for you.

### Verification Stack (Ordered by Cost)

| Layer | Catches | Setup | Run Time |
|-------|---------|-------|----------|
| **Type checker** (tsc --strict) | Wrong types, null errors | 10 min | 2-10 sec |
| **Linter** (ESLint, Biome) | Style violations, common bugs | 15 min | 1-5 sec |
| **Formatter** (Prettier, Biome) | Inconsistent formatting | 5 min | 1-3 sec |
| **Unit tests** (Vitest) | Logic errors, regressions | Ongoing | 5-30 sec |
| **Visual inspection** | UI bugs, layout issues | 0 | 10-30 sec |
| **Diff review** (human) | Design flaws, security issues | 0 | 2-10 min |

**Minimum viable verification** (catches 80% of AI mistakes in 15 seconds):
```bash
tsc --noEmit && eslint . && vitest run
```

### TDD-Driven Vibe Coding (The Gold Standard)

TDD is the single most effective technique for high-quality AI coding. Tests are
specifications — when you write the test first, you define exactly what "correct" means.
The AI cannot cheat by writing tests that verify broken behavior.

> "Automated tests are no longer optional when working with coding agents. The old excuses
> — that they're time consuming and expensive — no longer hold when an agent can knock them
> into shape in just a few minutes." — Simon Willison, 2026

**The workflow:**
1. **YOU write the test** (or describe it precisely for the AI to write)
2. **AI implements** until the test passes
3. **YOU verify** green tests, then review the diff
4. **Repeat** for next behavior

**Critical rule:** If the AI writes both test AND implementation, review the tests with
extra scrutiny. AI writes tests that assert "function returns whatever it returns" rather
than "function returns what it should return."

### Screenshot-Driven Development (For UI)

Visual verification beats reading CSS diffs:
1. AI builds the component
2. You render it (dev server, Storybook)
3. Look at it — does it look right?
4. If not: screenshot to AI with feedback ("button overlaps header — fix spacing")
5. Repeat until visually correct

### Diff Review Triage

```
ALWAYS READ:  Security code, public API surfaces, config changes, deleted code
SPOT-CHECK:   Implementation logic, error handling, resource management
TRUST IF TESTS PASS:  Formatting, import order, variable renames, boilerplate
```

---

## Accept / Reject / Refine Framework

Every piece of AI-generated code requires a decision.

### The Decision Tree

```
AI generates code
  -> Does it type-check?      NO -> REJECT (feed error back)
  -> Do tests pass?            NO -> REJECT (feed failure back)
  -> Does it do what I asked?  NO -> REFINE (clarify requirements)
  -> Is the approach sound?    NO -> REFINE (suggest better approach)
  -> Is it maintainable?       NO -> REFINE ("simplify — a junior dev should grok this")
  -> ACCEPT
```

**REJECT when:** Approach is fundamentally wrong. Unwanted dependency added. Files
modified outside task scope. Hallucinated API. More complex than the problem warrants.

**REFINE when:** Approach is right but details are wrong. Missing error handling. Naming
inconsistent. Test coverage incomplete. Ask the AI to justify or simplify.

**ACCEPT when:** Types, lint, and tests pass. You understand the architecture (not every
line). Consistent with codebase patterns. Spot-check reveals nothing concerning.

**Healthy accept rate:** 60-80%. Above 90% means insufficient review. Below 50% means
your prompts need work.

### When to Reset vs. Iterate

**Reset** when the AI has gone 3+ iterations without converging, the approach is
fundamentally wrong, or you have lost track of what the code does.

**Iterate** when the approach is correct but details are off, test failures are specific,
and the AI is converging toward correct.

**Heuristic:** If your third feedback message is longer than your original prompt, reset.
You have more context now — a fresh prompt will be better than continued patching.

---

## Architectural Guardrails

Constraints that make it hard for AI to create a mess, even when you are not watching.

### TypeScript Strict Mode (Non-Negotiable)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

`strict: true` is the single highest-ROI guardrail. AI generates code assuming values
exist that might be null, returns wrong types, accesses optional properties without
checks. The type checker catches all of this at compile time.

### Pre-Commit Hooks (Automated Quality Gate)

```bash
npm install -D husky lint-staged && npx husky init
```

```json
// package.json
{ "lint-staged": {
    "*.{ts,tsx}": ["biome check --write", "tsc-files --noEmit"],
    "*.{json,md}": ["biome format --write"]
} }
```

Every commit — human or AI — passes through formatting, linting, and type checking.

### Claude Code Hooks (AI-Specific Gates)

```json
// .claude/settings.json
{ "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "npx biome check --write $CLAUDE_FILE_PATH" }]
    }],
    "PreToolUse": [{
      "matcher": "Bash\\(rm|Bash\\(git push --force|Bash\\(git reset --hard",
      "hooks": [{ "type": "command", "command": "echo 'BLOCKED: Destructive op' && exit 2" }]
    }]
} }
```

Auto-formats every file Claude writes. Blocks destructive operations (`exit 2` = block).

---

## Context Management

AI coding quality is directly proportional to the context you provide.

### CLAUDE.md Template

Keep under 200 lines. For each line ask: "Would removing this cause the AI to make a
mistake?" If not, cut it.

```markdown
# CLAUDE.md

## Project Overview
[1-2 sentences: what it does, tech stack]

## Commands
pnpm dev / pnpm test / pnpm typecheck / pnpm lint

## Code Conventions
- TypeScript strict, no `any`
- Functional components with hooks
- Result<T, E> for expected errors, try/catch for unexpected
- camelCase vars/functions, PascalCase types/components

## Testing
- Colocated: foo.ts -> foo.test.ts
- describe blocks by function, prefer integration over mocks

## Patterns to Follow
- [Reference file for route handlers]
- [Reference file for components]

## Do NOT
- Add dependencies without asking
- Modify tsconfig.json or biome.json
- Use console.log — use src/lib/logger.ts
```

### Cursor Rules (.cursor/rules/*.mdc)

`.cursorrules` is deprecated. Use individual `.mdc` files with frontmatter:

```markdown
---
description: TypeScript coding standards
globs: ["src/**/*.ts", "src/**/*.tsx"]
alwaysApply: true
---
# TypeScript Standards
- strict: true, never use `any`
- Branded types for IDs: `type UserId = string & { __brand: 'UserId' }`
- Discriminated unions for errors, try/catch for unexpected only
- One component per file, named exports, colocated tests
```

**Principles:** One concern per file. Small and actionable. Concrete code samples over
abstract descriptions. Explicit globs to scope rules.

### Project Structure as Context

Well-structured projects produce better AI output without any CLAUDE.md:

```
src/
  routes/users.ts         # AI infers: HTTP route handlers
  routes/users.test.ts    # AI infers: colocated tests
  db/schema.ts            # AI infers: database schema
  db/queries/             # AI infers: query functions
  lib/logger.ts           # AI infers: logging utility
  types/index.ts          # AI infers: shared types
```

Name clearly. Group related things. Colocate tests. The AI learns from your code.

---

## The Iteration Loop

### Tight Loop (Small Tasks — 30 seconds per cycle)

```
Prompt -> Generate (~10s) -> Verify: types+tests+visual (~15s) -> Accept/Feedback (~5s)
```

### Structured Loop (Features)

1. Plan (no code) — 5 min
2. Define interfaces/types — AI generates, you review
3. Write tests — you write, or AI writes with your critical review
4. Implement — AI generates, tests verify
5. Visual review (if UI) — render and look
6. Diff review — spot-check security, APIs, config
7. Commit — small, atomic, clear message

### Context Window Management

Quality degrades as conversation grows. At ~70% context, precision drops. At 85%+,
hallucinations increase.

- `/clear` in Claude Code between unrelated tasks
- New Composer sessions in Cursor for new features
- Reference files explicitly instead of relying on conversation memory
- Summarize progress before clearing context

---

## Tool-Specific Patterns

### Claude Code

1. Set up CLAUDE.md at project root
2. Configure hooks for auto-formatting and destructive-op blocking
3. Plan mode (Shift+Tab x2) before complex tasks
4. `/clear` between unrelated tasks
5. Leverage the permission model — review prompts before approving Write/Edit/Bash
6. Grant blanket permissions for safe ops (Read, Glob, Grep)

### Cursor

1. Set up `.cursor/rules/` with scoped `.mdc` files
2. Plan Mode (Shift+Tab x2) before complex tasks
3. Cmd+K for small inline edits (tight feedback loop)
4. Composer for multi-file changes — review each diff individually
5. Background agents for independent tasks — fire and review, not fire and forget

### Any Stack

Whatever your language's equivalent of "strict types + linter + formatter + tests" is,
set it up. Python: `mypy --strict` + `ruff` + `pytest`. Go: the compiler + `golangci-lint`
+ `go test`. These four pillars are universal.

---

## Anti-Patterns

### "YOLO Accept All" (The Original Sin)
Accepting every AI output without verifying. AI generates plausible code with subtle logic
errors, security holes, and wrong assumptions that accumulate silently.
**Fix:** Minimum viable verification: type check + lint + test. Fifteen seconds.

### "Mega-Prompt" (The Kitchen Sink)
One prompt asking for an entire feature with auth, DB, API, frontend, and tests. LLMs lose
coherence on long outputs — the 50th function is dramatically worse than the 5th.
**Fix:** 5-10 focused prompts, each independently verifiable.

### "Clipboard Debugging" (Error-In, Error-Out)
Pasting errors to AI with "fix this," no context. Each surface-level patch introduces new
issues. After 5 rounds the code is a patchwork of bandaids.
**Fix:** Understand the root cause. Tell AI: "Error is X, cause is Y, fix by Z."

### "No Types, No Tests, No Guardrails" (The Cowboy)
JavaScript (not TypeScript), no tests, `any` everywhere. Without guardrails there is no
automated way to verify correctness.
**Fix:** 30 min setup: tsconfig strict + Biome + Vitest. Pays back on every AI interaction.

### "Context Amnesia" (No CLAUDE.md, No Rules)
No project conventions documented. AI reinvents patterns on every prompt — callbacks Monday,
promises Tuesday, async/await Wednesday.
**Fix:** Write a CLAUDE.md. Create one reference implementation per pattern.

### "Over-Delegation" (The Absent Architect)
"Build me a full-stack app with auth, payments, and a dashboard." The AI makes hundreds of
architectural decisions you did not review.
**Fix:** Delegate implementation, not architecture. You decide schema, auth approach, API
design. AI implements within your architecture.

### "Ignoring Warnings" (The Optimist)
TypeScript and linter warnings ignored because "it works." AI-generated code with warnings
is statistically more likely to have logic errors in the same area.
**Fix:** Treat warnings as errors in CI. Clean them as they appear.

---

## Quality Checklist

**Before the session:**
- [ ] CLAUDE.md or .cursor/rules exists with conventions documented
- [ ] TypeScript strict mode (or language equivalent) enabled
- [ ] Linter and formatter configured and running
- [ ] Pre-commit hooks installed
- [ ] Test framework ready with at least one passing test
- [ ] Reference implementations exist for key patterns

**During the session:**
- [ ] Planning before coding for any task > 30 min of work
- [ ] Small batches — one function/component/feature per prompt
- [ ] Verification after every generation (types + lint + test)
- [ ] Diff review for security-sensitive code and public APIs
- [ ] Visual inspection for all UI changes
- [ ] /clear between unrelated tasks

**After the session:**
- [ ] Full test suite passes (not just new tests)
- [ ] No new warnings introduced
- [ ] Commits are atomic with clear messages
- [ ] You can explain every architectural decision
- [ ] No `// TODO: fix later` hacks — file tickets for follow-ups

---

> "If an LLM wrote the code for you, and you then reviewed it, tested it thoroughly and
> made sure you could explain how it works to someone else — that's not vibe coding,
> it's software development." — Simon Willison, 2025

The goal is not to avoid AI. It is to use AI so effectively that the code it produces is
better than what you would have written by hand — better tested, more consistent, produced
in a fraction of the time. That requires discipline. This skill is that discipline.
