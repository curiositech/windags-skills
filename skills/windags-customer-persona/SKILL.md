---
---
license: BSL-1.1
name: windags-customer-persona
description: Deep understanding of WinDAGs customer personas — who needs DAG-based agent orchestration, their pain points, buying triggers, and workflow patterns. Activate on 'who is the WinDAGs customer', 'target audience', 'customer persona', 'ICP', 'ideal customer profile', 'who buys agent orchestration', 'WinDAGs positioning', 'competitive differentiation'. NOT for marketing execution (use next-move-marketing), general competitive mapping (use competitive-cartographer), or pricing strategy (use indie-monetization-strategist).
allowed-tools: Read,Write,Edit,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Product & Strategy
  tags:
    - customer-persona
    - product-strategy
    - agent-orchestration
    - market-positioning
    - ICP
  pairs-with:
    - skill: competitive-cartographer
      reason: Map WinDAGs positioning against LangGraph/CrewAI/AutoGen
    - skill: next-move-customer-persona
      reason: Next-move has a distinct but overlapping customer base
    - skill: product-appeal-analyzer
      reason: Evaluate whether WinDAGs resonates with each persona
category: Content & Marketing
tags:
  - windags
  - customer-persona
  - user-research
  - marketing
  - positioning
---

# WinDAGs Customer Persona

Understanding who needs DAG-based agent orchestration through decision trees that identify personas, their pain points, and buying triggers.

## DECISION POINTS

### Persona Identification Framework

```
INPUT: Context signals from conversation/content
↓
IF mentions "side project" OR "weekend coding" OR "solo dev" OR salary + indie hacker
  └─ THEN: Marcus (Solo Builder)
     └─ Primary pain: Serial AI execution limiting weekend productivity
     └─ Trigger: Seeing parallel agent orchestration demo

ELSE IF mentions "tech lead" OR "managing devs" OR "sprint planning" OR "cross-cutting concerns"  
  └─ THEN: Sarah (Tech Lead)
     └─ Primary pain: Coordination overhead between team members
     └─ Trigger: DAG that mirrors her mental task breakdown

ELSE IF mentions "client work" OR "multiple codebases" OR "consulting" OR "fractional CTO"
  └─ THEN: Dev (Consultant) 
     └─ Primary pain: Context switching across client engagements
     └─ Trigger: /next-move predictions that create instant deliverables

ELSE IF mentions "enterprise" OR "compliance" OR "team of 20+" OR "SOC2"
  └─ THEN: Not core WinDAGs persona (delegate to enterprise tools)
```

### Message Positioning Decision Tree

```
IF persona = Marcus AND context = feature discussion
  └─ Emphasize: "Ships in hours not days" + "Zero infrastructure setup"

IF persona = Sarah AND context = planning/management  
  └─ Emphasize: "30-second task breakdown" + "Human-in-the-loop review"

IF persona = Dev AND context = client work
  └─ Emphasize: "/next-move predictions" + "Force multiplier across engagements"

IF competitive comparison mentioned
  └─ Use positioning: "Structured parallelism with skill injection vs [competitor weakness]"

IF pricing objections  
  └─ Redirect to indie-monetization-strategist skill
```

### Pain Point Mapping Decision Logic

```
IF user describes "waiting for AI responses" OR "one thing at a time"
  └─ Map to: Serial execution limitation (Marcus primary pain)

IF user describes "writing detailed task breakdowns" OR "dependency management"  
  └─ Map to: Coordination overhead (Sarah primary pain)

IF user describes "ramping up on new codebases" OR "context switching"
  └─ Map to: Client engagement scaling (Dev primary pain)

IF user describes cost concerns with Devin/enterprise tools
  └─ Map to: Affordable orchestration (Marcus + Dev shared pain)
```

## FAILURE MODES

### 1. Persona Confusion Anti-Pattern
**Detection**: If messaging tries to appeal to all three personas simultaneously OR uses generic "developers need orchestration" language
**Diagnosis**: Diluted value proposition that resonates with no one strongly
**Fix**: Pick ONE persona per piece of content. Lead with their specific pain point.

### 2. Feature-First Positioning
**Detection**: If description leads with "DAG engine" or "multi-agent framework" instead of outcome
**Diagnosis**: Technical features don't map to customer problems
**Fix**: Start with persona pain point, then show WinDAGs as solution. "Tired of serial AI execution? WinDAGs orchestrates parallel agents..."

### 3. LangGraph Comparison Trap  
**Detection**: If positioning starts with "Like LangGraph but easier" or defines WinDAGs relative to competitors
**Diagnosis**: Concedes market framing to competitors, makes WinDAGs sound derivative
**Fix**: Lead with unique value: "Structured parallelism with skill injection" before mentioning any competitor

### 4. Enterprise Feature Creep
**Detection**: If roadmap discussion prioritizes SSO/RBAC/teams before solo developer experience is perfect
**Diagnosis**: Chasing enterprise deals before nailing core persona (Marcus)
**Fix**: Validate all features against Marcus workflow first. Enterprise features are P2+ until solo experience scores 9/10

### 5. Generic Developer Market Sizing
**Detection**: If TAM calculation uses "all developers" or "AI tool users" without orchestration-specific funnel
**Diagnosis**: Overestimates addressable market, leads to wrong channel/pricing decisions  
**Fix**: Bottom-up sizing: LangGraph+CrewAI users (200K) → filter for orchestration need (10%) = 20K realistic TAM

## WORKED EXAMPLES

### Example: Feature Prioritization Discussion

**Scenario**: Team debating whether to build team sharing features vs improving /next-move predictions

**Persona Analysis**:
- Marcus (Solo): Teams irrelevant, /next-move critical for weekend productivity
- Sarah (Tech Lead): Teams helpful but /next-move medium priority  
- Dev (Consultant): /next-move critical for client deliverables, teams nice-to-have

**Decision Process**:
1. Map feature to persona priority matrix
2. Weight by target persona sequence (Marcus P0, then Sarah, then Dev)
3. /next-move wins: HIGH for Marcus + Dev, only MEDIUM for Sarah
4. Teams sharing: LOW for Marcus, HIGH for Sarah, MEDIUM for Dev

**Recommendation**: Prioritize /next-move predictions. Teams sharing is P2 after solo experience perfected.

**Expert Insight**: Novice would see "teams sharing" as obvious enterprise feature to build. Expert recognizes Marcus (solo) must be nailed first, and /next-move serves 2/3 personas strongly.

## QUALITY GATES

- [ ] Persona identification includes specific signal words/phrases that trigger each archetype
- [ ] Each persona has ONE primary pain point that maps directly to WinDAGs value prop
- [ ] Buying triggers are observable moments, not vague "they realize they need it" 
- [ ] Messaging includes orchestration value (not just "better AI coding")
- [ ] Persona pain points map to specific WinDAGs features (/next-move, skill injection, DAG review)
- [ ] Competitive positioning leads with WinDAGs strength, not competitor comparison
- [ ] Feature prioritization matrix weights by primary persona sequence (Marcus → Sarah → Dev)  
- [ ] Market sizing uses bottom-up logic from orchestration-specific user base
- [ ] Content passes "60-second demo test" - aha moment is demonstrable quickly
- [ ] Anti-patterns include detection rules that are objectively measurable

## NOT-FOR BOUNDARIES

**Do NOT use this skill for**:
- Marketing execution or campaign planning → use **next-move-marketing**
- General competitive landscape analysis → use **competitive-cartographer** 
- Pricing and monetization decisions → use **indie-monetization-strategist**
- Next-move specific customer analysis → use **next-move-customer-persona**
- Enterprise sales process or RFP responses → delegate to enterprise-focused skills
- Developer tool market research beyond orchestration → use broader market research skills

**Delegation Rules**:
- If conversation shifts to "how to market to these personas" → next-move-marketing
- If detailed competitive feature comparison needed → competitive-cartographer
- If pricing model discussion begins → indie-monetization-strategist
- If enterprise requirements (SOC2, SAML) dominate → not core WinDAGs persona, recommend enterprise tools