---
license: Apache-2.0
name: product-announcement-craft
description: The art and science of announcing a product you built -- narrative arc, format selection (Show HN vs blog vs tweet thread vs video demo), building anticipation, launch day coordination, follow-up engagement, handling feedback, and iterating the message. Activate on 'announce', 'product launch', 'launch announcement', 'how to announce', 'launch blog post', 'Show HN post', 'launch email', 'announcement strategy', 'launch narrative', 'launch copy'. NOT for channel-specific posting tactics (use tech-launch-channels) or monetization (use indie-monetization-strategist).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Marketing & Launch
  tags:
    - announcement
    - launch
    - copywriting
    - narrative
    - product-marketing
    - developer-relations
  pairs-with:
    - skill: tech-launch-channels
      reason: Distribute the announcement across the right platforms with platform-specific tactics
    - skill: indie-monetization-strategist
      reason: Align announcement with monetization model and pricing reveal strategy
    - skill: email-composer
      reason: Craft the launch email sequence that drives conversions
category: Content & Marketing
tags:
  - product-announcement
  - launch
  - copywriting
  - messaging
  - marketing
---

# Product Announcement Craft

How to announce a thing you built so that people care. The announcement is not the product -- it is a separate creative work that requires its own strategy, structure, and iteration.

## When to Use

**Use for:**
- Writing the core announcement narrative for a new product or major feature
- Choosing the right announcement format (blog post, tweet thread, Show HN, video)
- Planning a launch sequence (teaser, announcement, follow-up)
- Drafting launch emails and changelog entries
- Handling post-launch feedback and iterating the message
- Planning re-launches and "3 months later" updates

**Do NOT use for:**
- Platform-specific posting tactics and timing (use tech-launch-channels)
- Pricing and monetization strategy (use indie-monetization-strategist)
- SEO-optimized blog content (use seo-content-blogging)
- Enterprise sales collateral or pitch decks

---

## The Announcement Narrative Arc

Every great product announcement follows the same arc, whether it is a tweet, a blog post, or a 5-minute video. The medium changes; the arc does not.

```
1. THE HOOK       → Stop the scroll. Create curiosity or recognition.
2. THE PROBLEM    → "You know that feeling when..." -- make them nod.
3. THE STRUGGLE   → What you tried, what failed, why existing solutions fall short.
4. THE INSIGHT    → The key realization that led to your approach.
5. THE SOLUTION   → What you built. Show it. Demo it. Make it concrete.
6. THE PROOF      → Numbers, screenshots, testimonials, benchmarks, code.
7. THE INVITATION → How they can try it right now. Make it frictionless.
```

### Why This Arc Works
It mirrors the Jobs to be Done framework: people don't buy products, they hire solutions for problems they already have. Your announcement succeeds when the reader thinks "I have that exact problem" before they see your solution.

---

## Format Selection Matrix

Choose your PRIMARY format based on what you have to show:

| What You Have | Best Primary Format | Why |
|---------------|---------------------|-----|
| Beautiful UI, visual product | Video demo (60-90 sec) | Seeing is believing for visual tools |
| CLI tool, dev infrastructure | Show HN post + blog | Developers want to read how it works |
| Major upgrade to existing product | Changelog + email | Existing users care most |
| Complex system, many features | Blog post (1500-2500 words) | Needs space to explain the architecture |
| Quick hack, weekend project | Tweet thread (5-7 tweets) | Lightweight matches lightweight |
| Enterprise/B2B product | Blog post + LinkedIn article | Professional audience, needs depth |

### Format Templates

#### The Show HN Post
```
Title: Show HN: [Name] - [What it does in one line]

First comment:
Hi HN, I'm [name]. I've been working on [product] for [time].

The problem: [1-2 sentences about a specific pain point]

What it does: [2-3 sentences, technically specific]

How it works: [Brief architecture -- what's under the hood]

What makes this different from [obvious competitor]: [honest comparison]

Try it: [link]
Code: [repo link, if applicable]

I'd love your feedback, especially on [specific question].
```

#### The Launch Blog Post
```
Structure (1500-2500 words):

# [Name]: [Benefit-oriented subtitle]

[Opening hook -- a story, a surprising stat, or a relatable frustration]

## The Problem
[2-3 paragraphs. Be specific. Use examples. Make the reader nod.]

## What We Tried
[Optional but powerful. Shows intellectual honesty.]

## Introducing [Name]
[What it is, what it does, who it's for. Include a hero screenshot or GIF.]

## How It Works
[Technical deep-dive. Architecture diagram. Code examples. This is where
developers decide if you're serious.]

## Show Me
[Demo walkthrough. Annotated screenshots. GIF or embedded video. Before/after.]

## What's Next
[Roadmap transparency. What you're building next. How to get involved.]

## Try It
[Clear CTA. Link. Installation command. Getting started in 30 seconds.]
```

#### The Tweet Thread
```
Tweet 1 (Hook):
I just shipped [thing] and it [surprising result or benefit].

Here's the 2-minute version of what it does and why I built it:

Tweet 2 (Problem):
The problem: [relatable pain in 1-2 sentences]

[Screenshot of the ugly status quo or a code snippet of the painful way]

Tweet 3 (Solution):
So I built [name].

[Screenshot or GIF of your product solving the problem]

Tweet 4 (How):
How it works:
- [Bullet 1 -- technical but accessible]
- [Bullet 2]
- [Bullet 3]

Tweet 5 (Demo):
[30-60 second demo video or GIF. This is the most important tweet.]

Tweet 6 (Proof):
Early results:
- [Metric 1]
- [Metric 2]
- [Quote from early user]

Tweet 7 (CTA):
Try it: [link]
Star it: [repo link]
Follow for updates on [topic].
```

#### The Launch Email
```
Subject: [Name] is live -- [one benefit in 5 words]

Hey [name],

Remember when I mentioned I was building [thing]? It's live.

[One paragraph: what it does and why you'd care]

[Screenshot or GIF -- visual proof]

Here's what you can do with it:
- [Use case 1]
- [Use case 2]
- [Use case 3]

Try it now: [link]

I built this because [personal reason]. If you have 2 minutes,
I'd genuinely appreciate you trying it and telling me what breaks.

[Your name]

P.S. If you share it on [Twitter/HN/etc], that would mean the world.
Here's a ready-to-tweet: [pre-written tweet with link]
```

---

## Building Anticipation (The Pre-Launch)

The launch does not start on launch day. It starts 2-6 weeks before.

### Week -6 to -4: Seed the Problem
- Share the problem you are solving (without revealing the solution)
- Post about your frustrations with the status quo
- Ask your audience "how do you handle X?" -- genuine curiosity

### Week -4 to -2: Build in Public
- Share progress screenshots, architecture decisions, tradeoffs
- "Here's a sneak peek of what I've been working on"
- Let people into the process -- they become emotionally invested

### Week -2 to -1: Create Urgency
- "Launching next week. Here's what to expect."
- Share a waitlist or early access form
- DM 20-30 people personally and ask them to try the beta

### Launch Day
- Execute the coordinated multi-channel launch (see tech-launch-channels)
- Have your announcement post, email, and social content ready to fire

### Week +1: The Follow-Up
- "We launched last week. Here's what happened." (share numbers, learnings)
- Address common questions and objections from launch feedback
- Thank everyone who shared, commented, or gave feedback

---

## Handling Feedback and Criticism

Launch day will bring criticism. This is GOOD. How you handle it determines whether critics become advocates.

### The Response Framework

```
1. ACKNOWLEDGE  → "That's a fair point" or "I see where you're coming from"
2. AGREE        → Find the grain of truth (there always is one)
3. EXPLAIN      → Your reasoning, without being defensive
4. INVITE       → "Would you be open to trying X? I'd love your take after that"
```

### Common Criticisms and Responses

| Criticism | Bad Response | Good Response |
|-----------|-------------|---------------|
| "This already exists" | "No it doesn't!" | "You're right that X and Y exist. Here's what's different: [specific technical difference]. Happy to discuss the tradeoffs." |
| "Why would I use this?" | "Because it's better!" | "Fair question. If you're doing [workflow], this saves you [specific time/effort]. If not, it might not be for you -- and that's fine." |
| "This looks like a weekend project" | "It took 6 months!" | "The simplicity is intentional. Under the hood: [technical depth]. The hard part was making it feel this simple." |
| "No tests/docs/etc" | Ignore it | "You're right, docs need work. I prioritized [thing] first. PRs welcome, and I'm working on docs this week." |

### The 24-Hour Rule
Do not respond to harsh criticism immediately. Draft your response, wait 1 hour, then re-read it. Remove any defensiveness. Post the revised version.

---

## Iterating the Message

Your first announcement rarely gets the messaging right. Watch for signals and adapt.

### Signals That Your Messaging Is Off

| Signal | What It Means | Fix |
|--------|---------------|-----|
| "Cool, but what does it DO?" | Too abstract, not concrete enough | Add a demo GIF, show specific use cases |
| "How is this different from X?" | Differentiation unclear | Add a comparison table, be explicit about tradeoffs |
| "Who is this for?" | Audience not defined | Lead with a persona: "If you're a developer who..." |
| High traffic, low signups | Landing page doesn't match announcement | Align landing page messaging with what resonated |
| Low traffic, high conversion | Message is right, distribution is wrong | Use tech-launch-channels to expand reach |

### The Supabase "Launch Week" Model
Instead of one big announcement, ship one thing per day for a week. Each day's announcement is smaller and easier to write. The cumulative effect is massive. Supabase has done 15+ launch weeks and it is their primary growth engine.

Benefits:
- 5 shots at the front page instead of 1
- Each day's announcement can target a different audience
- Creates sustained buzz over a week instead of a single-day spike
- Easier to write 5 small posts than 1 giant one

---

## The Launch Day Checklist

### 48 Hours Before
- [ ] All announcement content written and reviewed (blog, social, email)
- [ ] Landing page updated with launch messaging
- [ ] Demo video/GIF recorded and tested on all platforms
- [ ] Analytics tracking set up (UTM params for each channel)
- [ ] 20+ people DMed personally and asked to support on launch day
- [ ] Email list segmented and launch email scheduled

### Launch Morning
- [ ] Blog post published and live
- [ ] Show HN posted with first comment ready
- [ ] Twitter thread posted
- [ ] LinkedIn post published (link in first comment)
- [ ] Launch email sent
- [ ] Team/friends notified to engage organically

### Launch Day (Every 30 Minutes)
- [ ] Check HN for new comments -- respond to all
- [ ] Check Twitter for replies and quote tweets
- [ ] Check email for replies and questions
- [ ] Monitor analytics for traffic sources
- [ ] Note recurring questions for FAQ or follow-up content

### 24 Hours After
- [ ] Thank everyone who shared or commented
- [ ] Compile feedback into themes
- [ ] Draft "here's what happened" follow-up post
- [ ] Update landing page with any messaging improvements
- [ ] Fix any bugs reported during launch

### 1 Week After
- [ ] Publish follow-up post with numbers and learnings
- [ ] Address top 3 pieces of feedback publicly
- [ ] Plan next content piece based on launch reception

---

## Announcement Examples That Worked

### Supabase Launch Week Format
**What they did:** Ship one major feature per day for 5 days, each with its own blog post, demo, and social campaign. Coordinated countdown, daily reveals, community engagement.
**Why it worked:** Sustained attention over 5 days instead of a 1-day spike. Each feature attracted a different audience segment.
**Lesson:** Frequency beats magnitude. Five good announcements beat one great one.

### Linear's "Craft" Positioning
**What they did:** Positioned a project management tool as a design and craft story. Focused on speed, keyboard shortcuts, and developer experience rather than features.
**Why it worked:** Differentiated from Jira/Asana by speaking to developer values (speed, craft, taste) rather than competing on features.
**Lesson:** Announce what makes you DIFFERENT, not what makes you complete.

### Cursor's "AI Code Editor" Framing
**What they did:** Didn't say "IDE with AI features." Said "the AI code editor." Owned a category instead of being a feature of an existing category.
**Why it worked:** Category creation is more memorable than feature comparison.
**Lesson:** Name the category you want to own. "AI agent orchestrator" > "workflow tool with AI."

---

## Anti-Patterns

### 1. Announcing the Vision, Not the Product
**Mistake:** "We're building the future of X" with no demo, no link, no way to try it.
**Fix:** Never announce without something people can use TODAY. Vision is marketing. Product is announcement.

### 2. The Feature List Announcement
**Mistake:** "New in v2.0: feature A, feature B, feature C, feature D..."
**Fix:** Lead with ONE story about ONE user solving ONE problem. Features are supporting evidence, not the headline.

### 3. Premature Announcement
**Mistake:** Announcing before the product works reliably for a first-time user.
**Fix:** Have 5 non-team-members complete the onboarding flow before you announce. If they can't, you're not ready.

### 4. The Identical Cross-Post
**Mistake:** Copy-pasting the same text to HN, Reddit, Twitter, and LinkedIn.
**Fix:** Each platform has different norms. Write for each audience separately (see tech-launch-channels).

### 5. No Follow-Up
**Mistake:** Launching, celebrating, and going silent.
**Fix:** Launch day is day 1. Plan content for day 7, day 30, and day 90. The follow-up posts often outperform the launch.

### 6. Hiding from Feedback
**Mistake:** Not responding to criticism, or responding defensively.
**Fix:** Every critic is a potential advocate. Acknowledge, agree, explain, invite.

### 7. Burying the Demo
**Mistake:** Three paragraphs of context before the reader sees what the product looks like.
**Fix:** Show the product in the first 10 seconds (video) or first scroll (blog post). Hook with the result, then explain.

---

## Quality Checklist

- [ ] The announcement follows the narrative arc (hook, problem, struggle, insight, solution, proof, invitation)
- [ ] Someone can understand what the product does within 15 seconds of reading/watching
- [ ] There is a clear, frictionless way to try the product RIGHT NOW
- [ ] The announcement shows the product (screenshot, GIF, video), not just describes it
- [ ] Differentiation from alternatives is stated explicitly and honestly
- [ ] The tone matches the audience (technical for HN, personal for Indie Hackers, professional for LinkedIn)
- [ ] Someone outside your team has read the announcement and confirmed it makes sense
- [ ] You have a plan for responding to feedback within 30 minutes of posting
- [ ] Follow-up content is planned for week 1, month 1, and month 3
- [ ] The announcement passes the "so what?" test -- a stranger would understand why this matters to them
