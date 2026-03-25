---
license: Apache-2.0
name: devtool-documentation
description: 'Expert in developer tool documentation as a product. Activate on: docs site, getting started guide, API reference, developer documentation, Docusaurus, Mintlify, Nextra, ReadMe, migration guide, troubleshooting page, docs information architecture, documentation testing, llms.txt. NOT for: marketing copy (use seo-content-blogging), API design itself (use api-architect), general technical writing (use technical-writer).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docusaurus:*,mintlify:*),Glob,Grep,WebSearch,WebFetch
metadata:
  category: Documentation & Developer Experience
  tags:
    - documentation
    - developer-experience
    - docs-as-code
    - api-reference
    - getting-started
    - information-architecture
  pairs-with:
    - skill: technical-writer
      reason: General writing craft applied to developer audiences
    - skill: seo-content-blogging
      reason: SEO optimization for docs discoverability
    - skill: launch-readiness-auditor
      reason: Documentation completeness before launch
category: Productivity & Meta
tags:
  - documentation
  - developer-tools
  - api-docs
  - guides
  - writing
---

# Developer Tool Documentation

Expert in the specific art of documenting developer tools — the "documentation as product" philosophy where docs are the UI of your API.

## Activation Triggers

**Activate on:** "docs site", "getting started guide", "API reference", "developer documentation", "Docusaurus", "Mintlify", "Nextra", "ReadMe", "migration guide", "troubleshooting page", "docs information architecture", "documentation testing", "llms.txt", "docs-as-code", "quickstart"

**NOT for:** Marketing copy -> `seo-content-blogging` | API design itself -> `api-architect` | General technical writing -> `technical-writer`

## The Diataxis Framework

Every developer docs site organizes content into four quadrants. Mixing them is the #1 cause of bad docs.

```
                    PRACTICAL                     THEORETICAL
                ┌─────────────────┬─────────────────┐
  LEARNING      │   TUTORIALS     │  EXPLANATION     │
  (acquiring)   │   "Learning"    │  "Understanding" │
                │   by doing      │  why it works    │
                ├─────────────────┼─────────────────┤
  WORKING       │   HOW-TO GUIDES │  REFERENCE       │
  (applying)    │   "Achieving"   │  "Information"   │
                │   a goal        │  lookup          │
                └─────────────────┴─────────────────┘
```

| Type | Reader State | Structure | Example |
|------|-------------|-----------|---------|
| **Tutorial** | "I'm learning" | Step-by-step, controlled, no choices | "Build your first app in 5 minutes" |
| **How-To** | "I need to do X" | Goal-oriented, assumes knowledge | "How to deploy to Kubernetes" |
| **Reference** | "I need the specifics" | Exhaustive, structured, no narrative | API method signatures, config options |
| **Explanation** | "I want to understand" | Discursive, contextual, conceptual | "How authentication works under the hood" |

### Critical Rule: Never Mix Quadrants

A tutorial that stops to explain theory loses the learner. A reference page with narrative loses the person who just needs the method signature. Keep them separate; link between them.

## Documentation Platform Decision Matrix

| Platform | Best For | Cost | Setup | AI Features |
|----------|----------|------|-------|-------------|
| **Docusaurus** | Open-source projects, full control | Free (MIT) | Medium (React) | Plugin ecosystem |
| **Mintlify** | Startups wanting Stripe-quality docs fast | $150-$500/mo | Low (MDX, Git) | AI search, llms.txt |
| **Nextra** | Next.js projects, content-heavy docs | Free (MIT) | Low (Next.js) | Via plugins |
| **ReadMe** | API-first companies, interactive docs | $99-$399/mo | Low (dashboard) | AI chat, auto-gen |
| **GitBook** | Team wikis, knowledge bases | Free-$199/mo | Very low | AI search |
| **Starlight (Astro)** | Performance-critical, static sites | Free (MIT) | Medium (Astro) | Plugin ecosystem |

### When to Choose Each

- **You have React devs and want total control** -> Docusaurus
- **You want beautiful docs in a day** -> Mintlify
- **Your whole stack is Next.js** -> Nextra
- **Your primary artifact is an API** -> ReadMe
- **Performance and build speed matter most** -> Starlight

## The Getting Started Guide: Most Important Page

The getting started page has the highest bounce rate and the highest conversion potential. It must be flawless.

### Anatomy of a Great Quickstart

```markdown
# Getting Started

<Prerequisites callout>
- Node.js 18+
- A Supabase account (free tier works)
</Prerequisites>

## 1. Install

\`\`\`bash
npm install @your-tool/cli
\`\`\`

## 2. Initialize

\`\`\`bash
npx your-tool init
\`\`\`

<Expected output>
✓ Created config file at ./your-tool.config.ts
✓ Connected to your-tool cloud
</Expected output>

## 3. Your First [Thing]

\`\`\`typescript
import { YourTool } from '@your-tool/sdk'

const client = new YourTool({ apiKey: process.env.YOUR_TOOL_KEY })
const result = await client.doTheThing({ input: "hello" })
console.log(result)
// => { output: "Hello, world!", latency: 42 }
\`\`\`

## What Just Happened?

[2-3 sentences explaining the mental model. Link to Explanation page.]

## Next Steps

- **[Build a real app](/tutorials/build-a-chat-app)** — 15 min tutorial
- **[API Reference](/reference/client)** — All available methods
- **[How auth works](/explanation/authentication)** — Under the hood
```

### Quickstart Rules

1. **Time-to-hello-world under 5 minutes.** If it takes longer, your install is too complex.
2. **Show expected output after every step.** The reader needs confirmation they're on track.
3. **Zero decisions.** Don't ask them to choose between approaches. Pick for them. How-to guides are where options live.
4. **Use realistic but simple data.** `"hello"` is fine. `"sk_test_abc123"` is better than `"YOUR_API_KEY"`.
5. **End with a working thing.** Not "you're ready to explore!" but a visible, running result.

## API Reference Best Practices

### What Stripe Gets Right

Stripe's API reference is the gold standard because of:

1. **Two-column layout**: Description left, code right. Eyes never leave context.
2. **Language switcher**: Same endpoint in curl, Node, Python, Ruby, Go, Java, .NET.
3. **Real data in examples**: `"cus_NffrFeUfNV2Hib"` not `"CUSTOMER_ID"`.
4. **Expandable objects**: Show the shape without overwhelming.
5. **Try it**: Authenticated API explorer with test keys.

### API Reference Page Template

```markdown
# create(params)

Creates a new [resource].

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Display name (1-100 chars) |
| `email` | `string` | Yes | Must be valid email format |
| `metadata` | `Record<string, string>` | No | Up to 50 key-value pairs |

## Returns

A `Resource` object on success. Throws `ValidationError` if params invalid.

## Example

\`\`\`typescript
const user = await client.users.create({
  name: "Ada Lovelace",
  email: "ada@example.com",
  metadata: { role: "engineer" }
})
// => { id: "usr_abc123", name: "Ada Lovelace", ... }
\`\`\`

## Errors

| Code | Meaning |
|------|---------|
| `validation_error` | Invalid parameters (see `details` array) |
| `conflict` | Email already exists |
| `rate_limited` | Too many requests (retry after `Retry-After` header) |
```

## Docs-as-Code Workflow

### The Pipeline

```
Author (MDX/MD) → Git Commit → PR Review → CI Checks → Deploy
```

### CI Checks to Implement

```yaml
# .github/workflows/docs-ci.yml
name: Docs CI
on: [pull_request]
jobs:
  docs-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint prose
        run: npx vale docs/         # Prose linting (style guide)
      - name: Check links
        run: npx linkinator docs/   # Dead link detection
      - name: Validate code blocks
        run: npx ts-check-md docs/  # TypeScript code blocks compile
      - name: Spell check
        run: npx cspell docs/**/*.md
      - name: Build docs
        run: npm run docs:build     # Catch build errors
```

### Essential Docs Tooling

| Tool | Purpose | Command |
|------|---------|---------|
| **Vale** | Prose linting (Microsoft, Google style) | `vale docs/` |
| **linkinator** | Dead link detection | `linkinator docs/ --recurse` |
| **cspell** | Spell checking with tech dictionaries | `cspell "docs/**/*.md"` |
| **ts-check-md** | Validate TypeScript code blocks compile | `ts-check-md docs/` |
| **remark-lint** | Markdown formatting consistency | `remark docs/ --use preset-lint-recommended` |
| **Algolia DocSearch** | Docs search (free for OSS) | Apply at docsearch.algolia.com |

## Information Architecture

### Standard Developer Docs Sitemap

```
docs/
├── index.md                    # Landing → quickstart CTA
├── getting-started/
│   ├── quickstart.md           # 5-min tutorial (THE most important page)
│   ├── installation.md         # All platforms, all package managers
│   └── key-concepts.md         # Mental model before diving in
├── tutorials/
│   ├── build-a-chat-app.md     # End-to-end, 15-30 min each
│   ├── real-time-dashboard.md
│   └── deploy-to-production.md
├── guides/                     # How-to guides (goal-oriented)
│   ├── authentication.md
│   ├── error-handling.md
│   ├── testing.md
│   ├── migration-from-v1.md
│   └── performance-tuning.md
├── reference/                  # API reference (exhaustive)
│   ├── client.md
│   ├── config.md
│   ├── cli.md
│   └── errors.md
├── explanation/                # Conceptual docs
│   ├── architecture.md
│   ├── how-auth-works.md
│   └── data-model.md
└── resources/
    ├── troubleshooting.md      # Common errors + solutions
    ├── faq.md
    ├── changelog.md
    └── community.md
```

### Navigation Rules

1. **Getting Started** is always first in the sidebar.
2. **Tutorials** are numbered and sequential.
3. **Guides** are alphabetical and independent.
4. **Reference** mirrors your API surface 1:1.
5. **Troubleshooting** is always findable from search and sidebar.

## Migration Guide Template

Migration guides are the most underinvested doc type. They determine whether users upgrade or leave.

```markdown
# Migrating from v2 to v3

**Estimated time**: 15-30 minutes for most projects
**Breaking changes**: 3 (listed below)

## Before You Start

- [ ] You're on v2.8+ (run `your-tool --version`)
- [ ] Your tests pass on v2
- [ ] You've read the [v3 announcement blog post](/blog/v3)

## Step 1: Update Dependencies

\`\`\`bash
npm install @your-tool/sdk@3
\`\`\`

## Step 2: Breaking Change — `createClient()` signature

**Before (v2):**
\`\`\`typescript
const client = createClient("your-api-key")
\`\`\`

**After (v3):**
\`\`\`typescript
const client = createClient({ apiKey: "your-api-key" })
\`\`\`

**Why**: Object params are extensible. We need to add `region` and `timeout`.

**Codemod**: `npx @your-tool/codemod v2-to-v3`

## Step 3: [Next Breaking Change]

[Same pattern: before/after/why/codemod]

## Deprecations (Non-Breaking)

| Deprecated | Replacement | Removal |
|-----------|-------------|---------|
| `client.query()` | `client.sql()` | v4 |
| `Config.debug` | `Config.logLevel` | v4 |

## Verification

Run your test suite. If you see these specific errors, here's what they mean:
- `TypeError: createClient is not a function` → You imported from the wrong path
- `AuthError: invalid key format` → Wrap your key in the object param

## Need Help?

- [Discord #migration channel](https://discord.gg/...)
- [GitHub Discussion](https://github.com/...)
```

## Troubleshooting Page Best Practices

Structure every troubleshooting entry as: **exact error message** (H2, so search engines and users find it) -> **When** (context) -> **Why** (builds trust) -> **Fix** (copy-pasteable commands, not "adjust your configuration"). Users paste error messages into search. Make your H2 headings match what they paste.

## AI-Ready Documentation: llms.txt

Modern docs need to serve both humans and LLMs. Mintlify, Vercel, and Supabase lead here.

### llms.txt Format

```
# Your Tool Name

> One-line description of what it does.

## Docs

- [Getting Started](https://docs.your-tool.com/quickstart): Install and run your first query
- [Authentication](https://docs.your-tool.com/auth): API keys, OAuth, service accounts
- [API Reference](https://docs.your-tool.com/reference): All endpoints and methods

## Optional

- [GitHub](https://github.com/your-tool)
- [Status](https://status.your-tool.com)
```

### Best Practices for LLM Discoverability

- **Segment by language/framework** like Supabase does (JS, Python, Dart, etc.)
- **Include full code examples** — LLMs learn from complete, working snippets
- **Use consistent headings** — LLMs use H2/H3 structure for context windows
- **Provide llms-full.txt** — complete content dump for RAG systems

## Anti-Patterns

### 1. The Wall of Text Quickstart
**Symptom**: Getting started page is 2000 words before the first code block.
**Fix**: First code block within 30 seconds of scrolling. Move context to Explanation pages.

### 2. Outdated Code Examples
**Symptom**: Examples use deprecated APIs, wrong import paths, old syntax.
**Fix**: Test code examples in CI. Use `ts-check-md` or `pytest-codeblocks`.

### 3. Missing Error Documentation
**Symptom**: Users get `Error: E4012` with no explanation anywhere in docs.
**Fix**: Every error code gets a troubleshooting entry. Link from error messages to docs.

### 4. The "See Also" Graveyard
**Symptom**: Pages end with 15 "See also" links, none obviously relevant.
**Fix**: Max 3 next steps, each with a clear reason why the reader would go there.

### 5. Reference Docs Without Examples
**Symptom**: Method signature documented, but no usage example.
**Fix**: Every method gets at least one example with realistic data and expected output.

### 6. Tutorial That Isn't a Tutorial
**Symptom**: Page titled "Tutorial" but is really a concept explanation or a how-to guide.
**Fix**: Tutorials are step-by-step, start-to-finish, and the reader makes no decisions.

## Quality Checklist

```
[ ] Diataxis quadrants are separated — tutorials, how-tos, reference, explanation
[ ] Getting started guide tested by a newcomer (not the author)
[ ] Time-to-hello-world measured and under 5 minutes
[ ] Every API method has at least one working example
[ ] Code examples tested in CI pipeline
[ ] Prose linted with Vale or equivalent
[ ] Dead links checked automatically
[ ] Search implemented and failed searches tracked
[ ] llms.txt deployed for AI discoverability
[ ] Migration guide exists for every breaking version
[ ] Troubleshooting covers top 10 error messages
[ ] Feedback mechanism on every page
[ ] Mobile and dark mode tested
```

## Output Artifacts

1. **Docs Site** — Complete documentation site (Docusaurus, Mintlify, Nextra, or Starlight)
2. **Information Architecture** — Sitemap and navigation structure
3. **Style Guide** — Voice, tone, terminology glossary (Vale config)
4. **CI Pipeline** — Automated docs testing (links, code, prose)
5. **Templates** — Page templates for each Diataxis quadrant
6. **llms.txt** — AI-ready documentation manifest
