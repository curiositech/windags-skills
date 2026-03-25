---
license: Apache-2.0
name: tech-launch-channels
description: Platform-specific launch playbooks for developer tools and technical products. Covers Hacker News, Product Hunt, Reddit, LinkedIn, Twitter/X, Indie Hackers, Dev.to, and Facebook with exact timing, formatting rules, community norms, and common mistakes for EACH channel. Activate on 'launch', 'Hacker News', 'Product Hunt', 'Show HN', 'Reddit launch', 'developer marketing channels', 'where to post', 'distribution channels', 'launch day', 'go-to-market'. NOT for writing the announcement itself (use product-announcement-craft) or SEO/content strategy (use seo-content-blogging).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Marketing & Launch
  tags:
    - launch
    - distribution
    - hacker-news
    - product-hunt
    - reddit
    - developer-marketing
    - social-media
  pairs-with:
    - skill: product-announcement-craft
      reason: Craft the announcement message that gets distributed across these channels
    - skill: claude-ecosystem-promoter
      reason: Claude-specific community and ecosystem promotion tactics
    - skill: seo-content-blogging
      reason: Long-tail content strategy that compounds after launch day traffic fades
category: Content & Marketing
tags:
  - launch
  - channels
  - distribution
  - marketing
  - go-to-market
---

# Tech Launch Channels

Platform-by-platform playbook for launching developer tools and technical products. Not generic social media advice -- the specific tactics that work on each channel, from someone who has seen hundreds of dev tool launches succeed and fail.

## When to Use

**Use for:**
- Planning a multi-channel launch for a developer tool or technical product
- Understanding community norms before posting to a new platform
- Timing and formatting a post for maximum reach on a specific channel
- Coordinating a launch day across multiple platforms
- Recovering from a botched launch or planning a re-launch

**Do NOT use for:**
- Writing the actual announcement copy (use product-announcement-craft)
- SEO and blog content strategy (use seo-content-blogging)
- Paid advertising or enterprise marketing campaigns
- General social media management for non-technical products

## The Launch Day Sequence

Post to channels in this order. Each channel has different peak windows and the order matters because early traction on one feeds momentum on others.

```
06:00 AM ET  - Hacker News (Show HN)
08:00 AM ET  - Twitter/X thread
09:00 AM ET  - LinkedIn post
10:00 AM ET  - Dev.to article
12:00 PM ET  - Reddit (r/SideProject, then niche subs)
02:00 PM ET  - Indie Hackers
Evening      - Facebook groups
Next day     - Product Hunt (if using PH, make it its OWN day)
```

Product Hunt resets daily at 12:01 AM PT. Launch it on a SEPARATE day from your HN push so you can give each platform full attention.

---

## Hacker News (Show HN)

**Reach potential:** 500K-2M+ impressions if front page
**Best for:** Technical tools, open source, anything builders appreciate
**Culture:** Meritocratic, skeptical, hates marketing speak

### Timing
- **Best days:** Tuesday, Wednesday, Thursday
- **Best time:** 6:00-8:00 AM ET (US morning, before front page fills up)
- **Avoid:** Weekends (lower traffic), Fridays (people check out), major tech news days

### Title Format
```
Show HN: <Name> - <What it does in plain English>

GOOD:  Show HN: Windags - DAG orchestration for multi-agent workflows
GOOD:  Show HN: I built a CLI that turns natural language into parallelized agent calls
BAD:   Show HN: Introducing Windags - The Future of AI Orchestration (tm)
BAD:   Show HN: We're excited to announce our new platform
```

**Rules:**
- "Show HN:" prefix gets your post on /show (less competitive than front page)
- Title must be factual and specific -- no superlatives, no marketing language
- No company names without explaining what the thing does
- Technical detail is good: "written in Rust" or "uses SQLite" adds credibility

### The First Comment (Critical)
Immediately post a comment on your own submission. This is your one chance to tell the story:

```
Template:
Hey HN, I'm [name]. I built [thing] because [genuine problem you had].

[1-2 sentences on how it works technically]

[What makes this different from X, Y, Z alternatives]

I'd love feedback on [specific question]. The code is at [repo link].
```

**What works:** Honesty about limitations, technical depth, asking for specific feedback
**What kills you:** Marketing speak, ignoring criticism, defensive responses

### Engagement Rules
- Respond to EVERY comment in the first 2 hours
- When criticized, find something to agree with first
- Never say "great question!" -- just answer it
- Upvotes from direct links do NOT count (HN detects vote rings)
- Ask friends to find your post on /newest and upvote organically

### Second Chances
You get ONE launch. A re-post only works if you have something substantially new (major feature, open-sourced it, pivoted). Wait at least 3-6 months.

---

## Product Hunt

**Reach potential:** 10K-100K visitors on launch day
**Best for:** Polished tools with visual demos, products targeting early adopters
**Culture:** Supportive, upvote-driven, rewards preparation and community engagement

### Pre-Launch (Start 4-8 Weeks Before)
1. Build your Product Hunt profile -- upvote and comment on 20+ products
2. Find a Hunter with 1,000+ followers (reach out personally, explain your product)
3. Build an email list of 200+ people who will support launch day
4. Create all assets: 6 images (1270x760), a GIF or video, compelling tagline

### Timing
- **Best days:** Tuesday, Wednesday, Thursday (data shows highest engagement)
- **Launch time:** 12:01 AM PT (when the daily cycle resets)
- **Block your entire launch day** -- set 30-minute timers to check for comments

### Critical Success Factor: First 4 Hours
Launches that cross 100 upvotes before 4:00 AM PT have an 82% chance of finishing Top 10. This means your email list and personal network must be activated the moment you launch.

### The Listing
```
Tagline: [verb] + [what] + [benefit] (under 60 chars)
GOOD: "Build AI workflows with drag-and-drop DAGs"
BAD:  "The revolutionary AI platform for the future"

First Comment:
- Who you are and why you built this
- What problem it solves (be specific)
- What's free vs paid
- Ask for specific feedback
```

### Asset Checklist
- [ ] 6 gallery images (1270x760px) -- show the product, not marketing fluff
- [ ] 30-60 second demo video or GIF
- [ ] Tagline under 60 characters
- [ ] Description (paragraph format, not bullet points on PH)
- [ ] Maker comment drafted and ready
- [ ] Hunter confirmed and briefed
- [ ] Launch day email drafted for your list

### Engagement
- Respond to every comment within 15 minutes
- Thank upvoters personally (they get notified)
- Share progress updates throughout the day ("We just hit #3!")
- Never ask for upvotes directly -- ask people to "check it out and share feedback"

---

## Reddit

**Reach potential:** Varies wildly by subreddit (1K to 1M+)
**Best for:** Authentic stories, technical deep-dives, "I built this" narratives
**Culture:** Allergic to self-promotion, rewards genuine contribution

### The 90/10 Rule
For every 1 self-promotional post, you need 9 genuine contributions (comments, helpful answers, sharing others' work). Build 200-300 karma before any product mentions.

### Subreddit Playbook

| Subreddit | Members | Rules | Best Post Format |
|-----------|---------|-------|------------------|
| r/SideProject | 200K+ | Self-promo OK | "I built X" with story + demo |
| r/webdev | 2M+ | Self-promo threads only | Technical deep-dive, ask for code review |
| r/programming | 5M+ | No self-promo | Technical article about HOW you built it |
| r/opensource | 100K+ | Projects welcome | Repo link + what problem it solves |
| r/selfhosted | 400K+ | Projects welcome | Docker setup + why self-host matters |
| r/InternetIsBeautiful | 17M+ | Must be web-based | Just the URL + short description |
| r/startups | 1.5M+ | Friday self-promo thread | Business story, not product pitch |
| r/entrepreneur | 3M+ | Share your journey | Revenue numbers, lessons learned |
| r/buildinpublic | 50K+ | Everything welcome | Progress updates, metrics, failures |

### Post Format That Works
```
Title: I spent 6 months building [X] - here's what I learned

Body:
- The problem you had (relatable)
- What you tried first (shows effort)
- How you built the solution (technical detail)
- What surprised you (honest reflection)
- Link to project (at the END, not the beginning)
- "Happy to answer questions about [specific technical topic]"
```

### What Gets You Banned
- Posting the same thing to 10 subreddits simultaneously
- Account that only posts about your own product
- Asking friends to upvote (Reddit detects brigading aggressively)
- Posting a link with no context or story

---

## Twitter / X

**Reach potential:** 10K-500K impressions with a good thread
**Best for:** Build-in-public narratives, demo videos, connecting with developer influencers
**Culture:** Rewards visual content, hot takes, and authenticity

### Thread Format (Launch Announcement)
```
Tweet 1 (Hook): Bold claim or surprising result
  "I replaced 4 hours of manual agent coordination with a 30-second DAG."

Tweet 2: The problem (relatable pain)
Tweet 3: The solution (what you built, with screenshot or GIF)
Tweet 4: How it works (technical but accessible)
Tweet 5: Demo video or GIF (60 sec max)
Tweet 6: What's next + call to action
Tweet 7: Link to try it

Final tweet: "If this was useful, follow me for more [topic] content"
```

### Timing
- **Best days:** Tuesday-Thursday
- **Best time:** 8:00-10:00 AM ET (US developer morning)
- Tweet 1 goes out at peak time; rest of thread is already written and posted as a thread

### Engagement Tactics
- Quote-tweet people who share your launch (more visibility than a reply)
- Reply to every comment in the first hour
- Pin the launch thread to your profile
- Tag relevant people in replies (not in the thread itself -- that's spammy)
- Post a standalone demo GIF 2-3 days after the thread (catches different audience)

### What NOT to Do
- Don't tag 10 influencers in your launch tweet
- Don't use hashtags (developer Twitter ignores or mocks them)
- Don't just post a link -- always add context, a screenshot, or a take
- Don't thread more than 7-8 tweets -- attention drops after that

---

## LinkedIn

**Reach potential:** 5K-200K impressions for good content
**Best for:** Professional narrative, "lessons learned" format, B2B developer tools
**Culture:** Professional but increasingly authentic, rewards storytelling

### Post Format
```
[Hook line that stops the scroll - personal, surprising, or contrarian]

[Blank line]

[2-3 short paragraphs telling the story]

[Blank line]

[Bullet list of key takeaways or lessons]

[Blank line]

[Call to action - try it, follow for more, link in comments]
```

### Timing
- **Best days:** Tuesday, Wednesday, Thursday
- **Best time:** 8:00-10:00 AM in your audience's timezone
- LinkedIn's algorithm identifies subject-matter experts and boosts their content to relevant audiences

### Key Rules
- Put the link in the FIRST COMMENT, not in the post (LinkedIn suppresses posts with external links)
- 1,200-2,000 characters performs best
- Carousels and PDFs get more reach than video (LinkedIn deprioritized video in 2025)
- Personal stories outperform corporate announcements
- Write as a person, not a brand

### What Works for Dev Tool Launches
```
GOOD: "I spent 6 months building something nobody asked for. Here's why I don't regret it."
GOOD: "3 things I learned launching a developer tool with zero marketing budget"
BAD:  "Excited to announce the launch of our new platform!"
BAD:  "We're hiring! Also check out our new product"
```

---

## Dev.to

**Reach potential:** 5K-50K views for featured articles
**Best for:** Technical tutorials, architecture deep-dives, "how I built this" posts
**Culture:** Developer-first, educational, supportive of new tools

### Article Format
- Title: "How I Built X with Y" or "X: A Better Way to Do Y"
- Include a cover image (1000x420px)
- Use proper markdown with code blocks
- Tag appropriately (max 4 tags): the tech stack tags + relevant topic tags
- Cross-post from your blog (Dev.to supports canonical URLs for SEO)

### Timing
- **Best days:** Monday-Wednesday (developer reading time)
- **Best time:** 7:00-9:00 AM ET

### Promotion Rules
- The article must be genuinely educational, not just an ad
- Show code, show architecture decisions, show tradeoffs
- End with a link to the project but make the article valuable on its own
- Engage with comments -- Dev.to community rewards responsiveness

---

## Indie Hackers

**Reach potential:** 1K-20K views, but 23% conversion rate per engaged post
**Best for:** Revenue stories, build-in-public updates, asking for feedback
**Culture:** Founder-friendly, loves transparency, especially revenue numbers

### What Performs Best
Journey posts with specific numbers outperform everything else:
```
GOOD: "From $0 to $2.4K MRR in 90 days -- how I launched [X]"
GOOD: "I got 500 signups in a week. Here's the exact playbook."
BAD:  "Check out my new developer tool!"
BAD:  "Announcing [product name]"
```

### Post Structure
1. The hook (result or surprising number)
2. Context (what you built and why)
3. The specific tactics (what you did, step by step)
4. The numbers (traffic, signups, revenue -- be specific)
5. What failed (honesty builds trust)
6. What's next + ask for feedback

### Timing
- Post Tuesday-Thursday for best engagement
- Engage in other threads for 2-4 weeks before your launch post

---

## Facebook Groups

**Reach potential:** 500-5K per group, but highly targeted
**Best for:** Niche communities, local tech scenes, framework-specific groups
**Culture:** Varies wildly by group -- read the rules first

### Key Groups for Dev Tools
- JavaScript / TypeScript / React groups (for frontend tools)
- AI/ML practitioner groups (for AI tools)
- Indie Hackers and solopreneur groups
- Framework-specific groups (Next.js, Svelte, etc.)

### Rules
- Almost all groups prohibit direct self-promotion
- Share a useful insight or tutorial, mention your tool as context
- Ask for feedback, not downloads
- Never cross-post the same thing to 10 groups on the same day

---

## Anti-Patterns

### 1. Shotgun Blast Launch
**Mistake:** Posting to all channels simultaneously with the same copy-paste message.
**Fix:** Tailor each post to the platform's culture and format. Stagger over 2-3 days.

### 2. Launch and Disappear
**Mistake:** Posting your launch and not checking back for 8 hours.
**Fix:** Block your entire launch day. Respond to every comment within 30 minutes.

### 3. Begging for Upvotes
**Mistake:** Sending direct links to friends asking them to upvote on HN or PH.
**Fix:** On HN, tell people to find your post on /newest. On PH, ask people to "check it out." Both platforms detect and penalize vote manipulation.

### 4. Marketing Speak on Technical Platforms
**Mistake:** "We're thrilled to announce our revolutionary AI-powered platform."
**Fix:** "I built a CLI that turns prompts into parallel agent workflows. Here's how it works."

### 5. Ignoring Criticism
**Mistake:** Defensive replies or ignoring negative feedback.
**Fix:** Thank critics, find something to agree with, explain your thinking. The audience watches how you handle criticism more than the criticism itself.

### 6. One Launch, Done Forever
**Mistake:** Treating launch as a single event.
**Fix:** Launch day is day 1. Follow up with technical blog posts, case studies, changelog updates, and "3 months later" retrospectives on each channel.

### 7. Wrong Channel for Your Product
**Mistake:** Launching a B2B enterprise tool on r/SideProject, or a hobby project on LinkedIn.
**Fix:** Match channel to audience. HN and Reddit for technical builders. LinkedIn for B2B. PH for early adopters. Indie Hackers for solo founders.

---

## Quality Checklist

- [ ] Each platform post is written specifically for that platform's culture and format
- [ ] Timing is planned for each channel's peak engagement window
- [ ] You have 200+ karma on Reddit before posting (if using Reddit)
- [ ] Product Hunt assets are prepared (6 images, video, tagline, hunter confirmed)
- [ ] HN title is factual, specific, and free of marketing language
- [ ] First comment is written and ready for HN and PH
- [ ] Launch day calendar is blocked with 30-minute engagement check-ins
- [ ] You have a list of 10+ people who will organically support launch day
- [ ] Each post links to something the reader can try immediately (demo, repo, landing page)
- [ ] Follow-up content is planned for 1 week, 1 month, and 3 months post-launch
- [ ] You have read the rules of every subreddit you plan to post in
- [ ] LinkedIn post has the link in the first comment, not in the post body
