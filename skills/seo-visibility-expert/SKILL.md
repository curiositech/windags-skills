---
license: Apache-2.0
name: seo-visibility-expert
description: Comprehensive SEO, discoverability, and AI crawler optimization for web projects. Use for technical SEO audits, llms.txt/robots.txt setup, schema markup, social launch strategies (Product Hunt, HN, Reddit), and Answer Engine Optimization (AEO). Activate on 'SEO', 'discoverability', 'llms.txt', 'robots.txt', 'Product Hunt', 'launch strategy', 'get traffic', 'be found', 'search ranking'. NOT for paid advertising, PPC campaigns, or social media content creation (use marketing skills).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebFetch,WebSearch
category: Content & Marketing
tags:
  - seo
  - visibility
  - search-engines
  - organic-traffic
  - optimization
pairs-with:
  - skill: claude-ecosystem-promoter
    reason: Promote with SEO backing
  - skill: technical-writer
    reason: SEO-optimized documentation
---

# SEO & Visibility Expert

## DECISION POINTS

### Traffic Diagnostic Tree
```
Traffic stalled/low? → Check in this order:
├── 1. Technical health
│   ├── Core Web Vitals score <90? → Fix performance first
│   ├── robots.txt blocking? → Check user-agents
│   └── Schema markup missing? → Add JSON-LD
├── 2. Content discoverability
│   ├── No llms.txt? → AI can't reference your content
│   ├── Missing Open Graph? → Poor social shares
│   └── No sitemap? → Crawlers missing pages
└── 3. Distribution channels
    ├── New project? → Need social launch strategy
    ├── Existing project? → Expand content marketing
    └── B2B tool? → Focus on community presence
```

### Launch Timing Decision Matrix
```
Ready to launch?
├── Product Hunt
│   ├── Tuesday-Thursday? → Proceed
│   ├── Holiday week? → Wait
│   └── Major tech news? → Reschedule
├── Hacker News
│   ├── 6-8am PST, Tue-Thu? → Post
│   ├── Weekend? → Wait for weekday
│   └── Technical audience? → Use "Show HN"
└── Reddit
    ├── Participated 90% vs promoted 10%? → Safe to promote
    ├── New account? → Build karma first
    └── Wrong subreddit rules? → Find better fit
```

### AI Crawler Strategy
```
Want AI to find your content?
├── Training data inclusion
│   ├── Want citations? → Allow GPTBot, Claude-Web
│   └── Privacy concerns? → Block Google-Extended only
├── Content optimization
│   ├── Technical docs? → Detailed llms.txt with examples
│   ├── Marketing site? → Brief llms.txt with features
│   └── Blog? → Post summaries in llms.txt
```

## FAILURE MODES

### 1. "Invisible Launch" Anti-Pattern
**Detection:** Product posted, gets <50 total votes/comments across all platforms
**Symptoms:** No pre-launch network, posted at wrong times, generic messaging
**Fix:** Build relationships 4 weeks before launch, time posts strategically, craft platform-specific messaging

### 2. "AI Blind Spot" Anti-Pattern  
**Detection:** Zero mentions when searching your product in ChatGPT/Claude/Perplexity
**Symptoms:** Missing llms.txt, AI crawlers blocked in robots.txt, no structured data
**Fix:** Create llms.txt immediately, allow AI user-agents, add schema markup

### 3. "Performance Death Spiral" Anti-Pattern
**Detection:** Core Web Vitals score <50, bounce rate >70%
**Symptoms:** Slow loading, layout shifts, heavy JavaScript
**Fix:** Optimize images first (biggest impact), minimize JS bundles, set explicit image dimensions

### 4. "Social Media Ghost Town" Anti-Pattern
**Detection:** Shared links show default browser title, no image preview
**Symptoms:** Missing Open Graph tags, no og:image, generic descriptions
**Fix:** Add complete Open Graph meta tags, create 1200×630 og:image, test with social debuggers

### 5. "Keyword Stuffing Penalty" Anti-Pattern
**Detection:** Rankings dropped after content update, unnatural reading flow
**Symptoms:** Same keyword repeated 10+ times unnaturally, robotic prose
**Fix:** Rewrite for humans first, use synonyms and related terms, maintain 1-2% keyword density max

## WORKED EXAMPLES

### Example 1: SaaS Tool Launch Recovery
**Situation:** DevSync (code collaboration tool) launched 3 months ago, getting only 50 visitors/day

**Diagnostic Process:**
1. **Technical check:** Core Web Vitals at 45 - LCP over 4 seconds
2. **AI visibility:** No llms.txt, GPTBot blocked in robots.txt
3. **Social presence:** No Product Hunt launch, minimal community engagement

**Actions Taken:**
1. **Performance first:** Optimized hero images, reduced from 2MB to 200KB → LCP down to 2.1s
2. **AI optimization:** Added llms.txt with technical specs and use cases, allowed AI crawlers
3. **Strategic launch:** Built relationships on Indie Hackers for 3 weeks, launched on Product Hunt Tuesday at 12:01 AM PST

**Expert vs Novice:** 
- **Novice would:** Try to fix everything at once, launch immediately without network
- **Expert caught:** Performance blocks everything else - fix technical issues before promotion

**Results:** 2,500 visitors on launch day, #3 Product of the Day, 450% increase in trial signups

### Example 2: Technical Documentation SEO
**Situation:** Open source library docs getting 90% traffic to homepage, other pages invisible

**Diagnostic Process:**
1. **Content audit:** Individual doc pages missing schema markup
2. **Structure analysis:** No clear information hierarchy for crawlers
3. **AI discoverability:** llms.txt too generic, no specific examples

**Actions Taken:**
1. **Schema implementation:** Added TechArticle schema to each doc page with code examples
2. **llms.txt enhancement:** Included specific API endpoints, common use cases, code snippets
3. **Internal linking:** Created clear hierarchy: Overview → Getting Started → Advanced Features

**Results:** Individual doc pages now rank for long-tail queries, 300% increase in organic traffic to deep pages

## QUALITY GATES

SEO audit is complete when ALL of these are true:

- [ ] Core Web Vitals score >90 on PageSpeed Insights (mobile and desktop)
- [ ] llms.txt exists at site root with project overview and key features
- [ ] robots.txt allows GPTBot, Claude-Web, and major search engines
- [ ] Every page has unique title (<60 chars), description (<160 chars), and canonical URL
- [ ] Primary content types have appropriate JSON-LD schema markup
- [ ] Open Graph tags present with og:image (1200×630px) for social sharing
- [ ] XML sitemap exists and submitted to Google Search Console
- [ ] Internal linking structure allows crawling to all important pages
- [ ] Mobile-responsive design confirmed on multiple devices
- [ ] Site loads in <3 seconds on 3G connection

## NOT-FOR BOUNDARIES

**Do NOT use this skill for:**
- **Paid advertising campaigns** → Use `paid-marketing-specialist` instead
- **Social media content creation** → Use `content-creator` instead  
- **Email marketing campaigns** → Use `email-marketing-expert` instead
- **Conversion rate optimization** → Use `conversion-optimization` instead
- **Brand strategy and messaging** → Use `brand-strategist` instead

**Delegate when:**
- Client wants Google Ads setup → Hand off to paid marketing
- Need social media post templates → Hand off to content creation
- Require A/B testing landing pages → Hand off to conversion optimization
- Want comprehensive brand guidelines → Hand off to brand strategy

**Gray areas requiring judgment:**
- Landing page copy that mentions SEO benefits → Collaborate with copywriter
- Technical blog posts for SEO → Collaborate with technical writer
- Product positioning for search → Collaborate with brand strategist