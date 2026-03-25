---
license: Apache-2.0
name: next-move-marketing
description: Marketing strategy and execution for the /next-move prediction pipeline — positioning, messaging, content strategy, distribution channels, demos, and launch tactics. Activate on 'how to market next-move', 'next-move launch', 'next-move content strategy', 'developer marketing', 'next-move demo', 'next-move distribution', 'next-move pricing', 'show don't tell'. NOT for customer persona research (use next-move-customer-persona), general competitive analysis (use competitive-cartographer), or WinDAGs-wide marketing (use claude-ecosystem-promoter).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Product & Strategy
  tags:
    - marketing
    - next-move
    - developer-tools
    - content-strategy
    - launch
    - distribution
  pairs-with:
    - skill: next-move-customer-persona
      reason: Marketing must target the specific personas identified
    - skill: claude-ecosystem-promoter
      reason: Distribute through Claude ecosystem channels
    - skill: indie-monetization-strategist
      reason: Pricing and monetization model for next-move
category: Content & Marketing
tags:
  - next-move
  - marketing
  - strategy
  - positioning
  - go-to-market
---

# Next-Move Marketing

How to market the `/next-move` prediction pipeline to developers. This skill covers positioning, messaging, content strategy, distribution, demos, and the playbook for getting the first 1,000 users — inspired by what worked for Cursor, Copilot, and the best developer tools.

**Core insight**: Developer tools sell on *demonstrated capability*, not promises. Cursor reached $100M ARR with zero marketing spend. The entire budget was product and demos. Next-move must follow the same playbook: show a developer their own repo being analyzed, and the product sells itself.

## When to Use

**Use for:**
- Planning a next-move launch or content push
- Writing blog posts, tweets, or demos that showcase next-move
- Deciding between distribution channels (where to post)
- Crafting messaging for landing pages and README
- Evaluating pricing models and freemium strategy
- Creating "show don't tell" demo content

**Do NOT use for:**
- Defining customer personas -> use **next-move-customer-persona**
- Competitive landscape mapping -> use **competitive-cartographer**
- WinDAGs-wide ecosystem promotion -> use **claude-ecosystem-promoter**
- Pricing and business model analysis -> use **indie-monetization-strategist**

---

## Positioning: The One-Sentence Pitch

**For developers**: "AI that reads your codebase and tells you exactly what to work on next."

**For the ADHD community**: "Never waste another hour deciding what to code. Just ask."

**For consultants**: "Walk into any repo cold and know the highest-impact thing to fix in 30 seconds."

**Technical positioning**: "/next-move is a 5-agent meta-DAG that analyzes your project context — git history, file structure, test coverage, dependency health, TODO comments — and recommends the highest-impact next action as an executable DAG of skills."

### Positioning Against Alternatives

| "If you use X, next-move is..." | Message |
|----------------------------------|---------|
| ChatGPT | "Like asking ChatGPT what to work on, except it actually reads your code" |
| Copilot | "Copilot writes code. next-move tells you *which* code to write" |
| Linear/Jira | "Your ticket board shows what's assigned. next-move shows what *matters*" |
| Motion | "Motion schedules your calendar. next-move reads your codebase" |
| Your own brain | "You already know what to do. next-move just says it out loud so you can stop deliberating" |

---

## The Demo-First Marketing Playbook

### Principle: Show, Don't Tell

Developer marketing has one iron law: **if you can't demo it in 60 seconds, you can't sell it**. Next-move's advantage is that the demo *is* the product experience. The viewer watches their own problem being solved in real time.

### The Canonical Demo Script (60 seconds)

```
[Terminal opens. Real repo visible.]
$ wg next-move

Analyzing project context...
  - 847 files across 12 packages
  - 34 open TODOs, 7 marked FIXME
  - Test coverage: 72% (down from 78% last week)
  - 3 stale branches with unmerged work
  - Auth middleware has known vulnerability (CVE-2026-1234)

Your highest-impact next move:

  Fix auth middleware vulnerability (CVE-2026-1234)
  Impact: CRITICAL — blocks security audit and 2 downstream features
  Estimated effort: 45 minutes
  Skill: security-auditor + api-architect
  Confidence: 0.91

  Ready-to-execute DAG:
    Wave 0: [research-cve-details]
    Wave 1: [patch-session-handler, update-middleware-tests]
    Wave 2: [integration-test, security-scan]

  Run this DAG? [Y/n]
```

**Why this demo works**:
1. Real repo, real data — not a toy example
2. Identifies something the developer *knows* they should fix but hasn't
3. Provides a specific, actionable plan — not vague advice
4. Shows estimated effort — reduces fear of commitment
5. Offers immediate execution — zero friction from insight to action

### Demo Variations by Channel

| Channel | Demo Format | Length | Key Element |
|---------|-------------|--------|-------------|
| Twitter/X | Screen recording GIF | 15-30s | Just the output — skip the analysis phase |
| Blog post | Full terminal recording with narration | 2-5 min | Show the before/after of a real session |
| Hacker News | Text-based walkthrough in the post | N/A | Technical depth, show the 5-agent meta-DAG architecture |
| YouTube | Narrated screen recording | 3-8 min | Multiple repos, show cross-repo prioritization |
| Reddit (r/ClaudeAI) | GIF + text explanation | 30s + text | Focus on the "aha" moment, invite questions |
| Conference talk | Live demo on audience member's repo | 5 min | Highest risk, highest reward — real-time analysis |

---

## Content Strategy: The 12-Week Launch Calendar

### Phase 1: Seed (Weeks 1-4) — Build credibility before asking for attention

| Week | Content | Channel | Goal |
|------|---------|---------|------|
| 1 | Blog: "How I Use AI to Decide What to Code Next" | windags.ai/blog, dev.to | SEO + establish problem space |
| 2 | Blog: "The /next-move Architecture: A 5-Agent Meta-DAG" | windags.ai/blog, HN | Technical credibility |
| 3 | Tweet thread: 7-tweet breakdown of a real next-move session | Twitter/X | Awareness, show the product |
| 4 | Blog: "Why ADHD Developers Need Code-Aware Task Prioritization" | windags.ai/blog, Reddit | Target persona 1 (Jamie) directly |

### Phase 2: Grow (Weeks 5-8) — Demos and community engagement

| Week | Content | Channel | Goal |
|------|---------|---------|------|
| 5 | Terminal GIF demo: next-move on a popular OSS repo | Twitter/X, Reddit, HN | Viral potential — devs can verify the analysis |
| 6 | Blog: "next-move vs. Motion vs. Linear: What Actually Helps Developers Prioritize" | windags.ai/blog, dev.to | Competitive positioning (fair, not hostile) |
| 7 | YouTube: "I Let AI Plan My Entire Coding Day" | YouTube, Twitter/X | Personality-driven content |
| 8 | Guest post or podcast appearance on a dev productivity show | External | Audience expansion |

### Phase 3: Convert (Weeks 9-12) — Drive installation and usage

| Week | Content | Channel | Goal |
|------|---------|---------|------|
| 9 | "Try next-move on YOUR repo" interactive challenge | Twitter/X, Discord | User-generated content, social proof |
| 10 | Blog: "What We Learned from 500 next-move Predictions" | windags.ai/blog | Data-driven credibility, anonymized insights |
| 11 | Case study: Real developer's workflow transformation | windags.ai/blog, LinkedIn | Conversion-optimized content |
| 12 | someclaudeskills.com feature: next-move skill deep-dive | someclaudeskills.com | Cross-promotion with skill marketplace |

---

## Distribution Channels Ranked by ROI

### Tier 1: High-intent, zero cost

| Channel | Audience | Tactic | Expected Result |
|---------|----------|--------|-----------------|
| **Hacker News** | 500K+ technical developers | "Show HN" post with honest, technical writing | 50-200 installs per front-page post |
| **Twitter/X dev community** | High-engagement devs | GIF demos, tweet threads, reply to "what tools do you use?" | Sustained awareness, 10-30 installs/week |
| **Reddit r/ClaudeAI** | Claude power users | Demo posts, answer questions, contribute value first | 20-50 installs per post |
| **Reddit r/ADHD + r/adhd_programmers** | Target persona 1 | Genuine utility, not marketing. "I built this because I have ADHD too" | 30-100 installs per post (high conversion) |

### Tier 2: Medium effort, high credibility

| Channel | Audience | Tactic | Expected Result |
|---------|----------|--------|-----------------|
| **Dev.to / Hashnode** | Broad developer audience | SEO-optimized blog posts, cross-posted from windags.ai | Long-tail traffic, 5-15 installs/week ongoing |
| **YouTube** | Visual learners, tutorial seekers | Screen recordings with narration | Slow burn, compounds over months |
| **Discord communities** | Claude, AI dev, indie hacker servers | Helpful presence, share when relevant | Trust-based, 5-10 installs/week |
| **someclaudeskills.com** | Claude skill enthusiasts | Featured skill, installation CTA | Cross-sell existing audience |

### Tier 3: Strategic, longer timeline

| Channel | Audience | Tactic | Expected Result |
|---------|----------|--------|-----------------|
| **Podcasts** (Changelog, devtools.fm, Indie Hackers) | Engaged dev audiences | Guest appearance, tell the WinDAGs story | Brand awareness, 50-100 installs per episode |
| **Conference talks** | Conference attendees | Live demo of next-move on an audience member's repo | Viral moment potential, 100+ installs |
| **LinkedIn** | Engineering managers, CTOs | "How I reduced my team's sprint planning from 2 hours to 20 minutes" | Persona 3 (Alex) conversion |

---

## Messaging Framework

### Headlines (A/B test these)

**Problem-led**:
- "Stop wasting 30 minutes deciding what to code"
- "Your repo already knows what needs attention"
- "The hardest bug is deciding which bug to fix first"

**Solution-led**:
- "AI that reads your codebase and tells you what to work on next"
- "`wg next-move` — one command, instant clarity"
- "Every morning starts with a plan. Automatically."

**Outcome-led**:
- "Ship 2x faster by eliminating decision paralysis"
- "From 'I don't know where to start' to 'I'm already building' in 30 seconds"
- "What if you never had to decide what to code again?"

**ADHD-specific** (use with care — authentic only):
- "Built by a developer who was tired of staring at his repo for 20 minutes every morning"
- "Task initiation is the hardest part. We automated it."
- "Your executive function called in sick. next-move showed up instead."

### Messaging Do's and Don'ts

| Do | Don't |
|----|-------|
| Use real terminal output in demos | Use mockups or screenshots of hypothetical output |
| Show next-move being *wrong* sometimes (builds trust) | Claim 100% accuracy or "always right" |
| Acknowledge ADHD authentically if the founder has it | Co-opt ADHD language for marketing if inauthentic |
| Compare to specific tools fairly | Trash competitors — devs see through it |
| Let the demo speak for itself | Over-explain the architecture in marketing copy |
| Show time saved with real numbers | Use vague claims like "boost productivity" |

---

## Pricing Model Options

### Option A: next-move is free forever (recommended for launch)

**Rationale**: Next-move is the *acquisition channel* for WinDAGs. The prediction is free. Executing the suggested DAG requires WinDAGs (free tier for small DAGs, paid for larger orchestrations).

**Funnel**: Free prediction -> "Run this DAG?" -> WinDAGs free tier -> WinDAGs Pro

**Precedent**: Cursor's free tier (2,000 completions) is the on-ramp to $20/mo Pro.

### Option B: Freemium predictions

3 free next-move predictions per week. Unlimited with WinDAGs Pro ($20-40/mo).

**Risk**: Artificial friction on the acquisition channel. Reduces word-of-mouth.

### Option C: next-move as standalone product

$5-10/mo for unlimited predictions. Separate from WinDAGs.

**Risk**: Splits the brand. Creates confusion about what WinDAGs is.

**Recommendation**: Option A. Make next-move free, make it amazing, let it be the reason people discover WinDAGs. The monetization happens when they want to *execute* the DAG, not when they want to *see* it.

---

## The "Zero Marketing Spend" Playbook

Cursor reached $100M ARR with zero marketing budget. Their playbook is directly applicable:

1. **Product IS the marketing**: Every `wg next-move` invocation is a marketing event. If the output is good, users screenshot it and share it. Build for shareability.

2. **Ship weekly, talk about it**: Every new next-move capability (new analysis dimension, better skill matching, cross-repo support) is a content opportunity. Announce on Twitter, show the diff.

3. **Engage authentically**: Reply to every tweet that mentions WinDAGs or next-move. Answer every HN comment. Be present in Discord. This does not scale, and that is the point — it builds trust.

4. **Let power users evangelize**: Identify the 10 most active users and give them early access to features. They become volunteer advocates.

5. **Compound content**: Every blog post builds on the last. Week 1's "How I Use AI to Decide What to Code" links to Week 4's "Why ADHD Developers Need This" which links to Week 10's "What We Learned from 500 Predictions." The corpus becomes an SEO moat.

---

## Metrics That Matter

### Launch metrics (first 90 days)

| Metric | Target | Why |
|--------|--------|-----|
| `wg next-move` invocations | 1,000 | Product usage = real adoption |
| Unique users | 200 | People who tried it at least once |
| Repeat users (2+ sessions) | 50 | Retention signal |
| DAG execution from next-move | 30 | Conversion to WinDAGs |
| Blog post views | 5,000 | Content reach |
| GitHub stars | 200 | Social proof for Hacker News credibility |

### Growth metrics (month 4-12)

| Metric | Target | Why |
|--------|--------|-----|
| Weekly active users | 500 | Sustainable usage |
| next-move -> DAG execution rate | 15% | Conversion funnel health |
| Organic mentions (Twitter, Reddit, HN) | 10/week | Word-of-mouth velocity |
| Blog traffic (monthly) | 10K | Content flywheel working |

---

## Anti-Patterns

- Do not launch with a waitlist. Developer tools with waitlists signal "we're not ready." Just ship it.
- Do not write marketing copy that sounds like marketing copy. Developers can smell it. Write like an engineer explaining what they built and why.
- Do not lead with the Windows 3.11 aesthetic in marketing. It's a delightful surprise when people discover it, not a selling point in the headline.
- Do not create a Product Hunt launch as the *primary* strategy. Product Hunt is a vanity metric — the Hacker News and Reddit developer communities have higher conversion rates.
- Do not market next-move and WinDAGs as the same thing. "AI that tells you what to do" and "AI that does it" are different value propositions for different moments. Market them distinctly even if they live in the same CLI.
- Do not make the first demo a video. Make it a GIF or terminal recording — developers want to see output, not listen to a voiceover.
- Do not target enterprise marketing channels before nailing the solo developer experience. Enterprise follows individual adoption in developer tools, not the other way around.

## Quality Checklist

- [ ] Positioning statement is one sentence that a developer can repeat to a friend
- [ ] Demo script takes under 60 seconds and uses a real repo
- [ ] Content calendar has at least 8 weeks of planned content
- [ ] Distribution channels are ranked by expected ROI with specific tactics
- [ ] Messaging framework includes problem-led, solution-led, and outcome-led variants
- [ ] Pricing recommendation is justified with precedent from other dev tools
- [ ] Metrics are specific, time-bound, and tied to business outcomes
- [ ] Anti-patterns protect against the most common developer tool marketing mistakes
- [ ] Zero marketing spend playbook is actionable without hiring
