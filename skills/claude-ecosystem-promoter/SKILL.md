---
license: Apache-2.0
name: claude-ecosystem-promoter
description: Marketing and promotion specialist for Claude ecosystem technology - MCP servers, skills, plugins, and agents. Expert in community engagement, registry submissions, content marketing, and developer relations. Activate on 'promote MCP', 'share skill', 'market plugin', 'launch agent', 'developer marketing', 'MCP registry'. NOT for creating MCPs/skills (use agent-creator), general marketing (use content-marketer), or SEO optimization (use seo-visibility-expert).
allowed-tools: Read,Write,Edit,Glob,Grep,Bash,mcp__firecrawl__firecrawl_search,mcp__brave-search__brave_web_search,WebFetch,mcp__fetch__fetch
category: Content & Marketing
tags:
  - marketing
  - community
  - mcp
  - developer-relations
  - promotion
pairs-with:
  - skill: seo-visibility-expert
    reason: SEO for skill/MCP discoverability
  - skill: agent-creator
    reason: Create the things you promote
---

# Claude Ecosystem Promoter

Marketing specialist for Claude ecosystem technology. Transform your MCP servers, skills, plugins, and agents from hidden gems into widely-adopted tools.

## Decision Points

### Channel Priority Matrix
```
Given: (Budget: low/med/high, Target: devs/business/general, Urgency: days/weeks/months)

IF Budget=low AND Target=devs:
  → Official MCP Registry + r/ClaudeAI + GitHub awesome lists
  
IF Budget=low AND Target=business:
  → LinkedIn + dev.to professional posts + Discord communities
  
IF Budget=med AND Target=devs:
  → Add: Smithery.ai + YouTube demos + Twitter threads
  
IF Budget=med AND Target=business:
  → Add: Medium articles + newsletter outreach + HackerNews
  
IF Budget=high:
  → Full multi-channel: All above + influencer outreach + paid communities

IF Urgency=days:
  → Reddit + Twitter + Discord (immediate reach)
  
IF Urgency=weeks:
  → Add: Registry submissions + dev.to articles
  
IF Urgency=months:
  → Add: SEO content + awesome list building + newsletter campaigns
```

### Content Format Decision Tree
```
IF Tool complexity = simple:
  → GIF demo + 2-minute video + Twitter thread
  
IF Tool complexity = moderate:
  → 5-minute tutorial + dev.to walkthrough + Reddit showcase
  
IF Tool complexity = advanced:
  → YouTube deep-dive + documentation site + multi-part series

IF Audience = technical:
  → Code samples + GitHub integration + technical blogs
  
IF Audience = business:
  → ROI examples + case studies + professional platforms

IF Tool type = MCP server:
  → Installation demo + Claude config examples + registry submissions
  
IF Tool type = skill:
  → Usage examples + workflow integration + skills directory
```

## Failure Modes

### Anti-Pattern 1: Ghost Launch
**Symptoms**: Tool gets 5-10 stars, no community engagement, forgotten in weeks
**Diagnosis**: Posted once to one channel, never followed up
**Fix**: 
- Create 30-day engagement calendar
- Respond to every comment within 4 hours for first week
- Post weekly updates with new features/user feedback

### Anti-Pattern 2: Spam Bomber
**Symptoms**: Downvoted posts, community backlash, banned from subreddits
**Diagnosis**: Same promotional content posted to 10+ places simultaneously
**Fix**:
- Customize each post for platform audience
- Follow 10:1 rule (10 helpful contributions per 1 promotion)
- Space posts 24-48 hours apart

### Anti-Pattern 3: Documentation Neglect
**Symptoms**: GitHub issues asking "how to install?", high bounce rate from repos
**Diagnosis**: README lacks clear installation, no demo video, poor examples
**Fix**:
- Create 30-second installation GIF
- Add "Quick Start" section with copy-paste commands
- Include real-world use case in README

### Anti-Pattern 4: Registry Submission Failure
**Symptoms**: Tool not discoverable in MCP clients, low adoption despite quality
**Diagnosis**: Never submitted to official registries, only posted on social media
**Fix**:
- Submit to Official MCP Registry first (before any promotion)
- List on Smithery, Glama, PulseMCP within 48 hours
- Track registry acceptance status weekly

### Anti-Pattern 5: Timing Catastrophe
**Symptoms**: Reddit post gets 3 upvotes, tweet gets 2 likes, no traction
**Diagnosis**: Posted Friday evening or during major tech events
**Fix**:
- Post Tuesday-Thursday, 2-5pm UTC
- Avoid: Black Friday, major Apple/Google events, holidays
- Use scheduling tools for optimal timing

## Worked Examples

### Example 1: MCP Server Launch - "Notion Integration"
**Scenario**: Developer built MCP server connecting Claude to Notion API

**Day -7 Pre-Launch**:
- Audit checklist: README unclear on auth setup → rewrote with step-by-step screenshots
- Created 90-second demo video showing: install → configure → query Notion database
- Generated social preview image with before/after workflow

**Launch Day Decision Points**:
- Budget=low, Target=developers, Urgency=weeks → Official Registry + r/ClaudeAI + Twitter
- Tool complexity=moderate → 5-minute tutorial + dev.to walkthrough

**Execution**:
1. Morning: Submitted to MCP Registry (PR #247)
2. Afternoon: Posted to r/ClaudeAI with [Showcase] tag
3. Evening: Twitter thread with demo GIF

**Results Week 1**: 127 GitHub stars, 45 Reddit upvotes, 2.3K tweet views, featured in PulseMCP newsletter

**Expert vs Novice**:
- **Novice missed**: Posted to r/programming first (wrong audience), no demo video, linked to raw GitHub
- **Expert caught**: Led with problem statement, showed working integration, engaged in comments

### Example 2: Claude Skill Launch - "Email Automation"
**Scenario**: Business user created Claude skill for automated email responses

**Decision Process**:
- Budget=medium, Target=business users, Urgency=months → LinkedIn + Medium + professional networks
- Audience=business → ROI examples + case studies needed

**Content Strategy**:
- LinkedIn: "How I saved 2 hours daily with this Claude skill" (professional outcome)
- Medium: "Building Email Automation with Claude: A Non-Developer's Journey" (accessibility)
- Reddit: Technical implementation details for r/ClaudeAI

**Results**: 45 LinkedIn shares, Medium article featured in AI newsletter, 2 enterprise inquiries

## Quality Gates

Launch Readiness Checklist:
- [ ] README.md has clear problem statement in first paragraph
- [ ] One-line installation command works on clean system
- [ ] Demo video under 3 minutes shows real use case
- [ ] GitHub repo has MIT/Apache license file
- [ ] At least 3 example configurations provided
- [ ] Social media preview image (1200x630px) created
- [ ] Primary registry submission completed (MCP Registry or Skills repo)
- [ ] Response plan ready for first 24-48 hours of feedback
- [ ] Contact information clearly visible for follow-up
- [ ] Roadmap with next 3 planned features documented

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- Creating MCP servers, skills, or agents → Use `agent-creator` instead
- General marketing strategies → Use `content-marketer` instead  
- SEO optimization and keyword research → Use `seo-visibility-expert` instead
- Writing documentation → Use `technical-writer` instead
- Community management beyond launch → Use dedicated community management tools
- Paid advertising campaigns → Use performance marketing specialists
- PR outreach to major publications → Use PR professionals
- Legal compliance for marketing → Use legal advisors

**Delegate when**:
- Tool needs technical improvements before launch → Return to development
- Marketing budget exceeds $5K → Engage professional marketing agency
- Press coverage needed from major outlets → Use PR firm
- International market expansion → Use localization specialists