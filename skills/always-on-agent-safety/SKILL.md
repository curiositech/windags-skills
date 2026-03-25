---
license: Apache-2.0
name: always-on-agent-safety
description: |
  Safety, privacy, cost management, and frank advice for building always-on AI agents with episodic memory. Covers data hygiene, privacy risk surfaces, runaway cost prevention, scope creep, psychological effects of persistent AI companions, and responsible deployment patterns. This is the skill that tells you what can go wrong and how to prevent it. Activate on: "agent safety", "always-on agent privacy", "agent cost control", "persistent agent risks", "AI companion safety", "agent data hygiene", "runaway agent costs", "parasocial AI risk", "/always-on-agent-safety". NOT for: architecture design (use always-on-agent-architecture), input design (use always-on-agent-inputs), application brainstorming (use always-on-agent-applications), healthcare compliance specifically (use hipaa-compliance).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - WebSearch
  - WebFetch
metadata:
  category: AI & Agents
  tags:
    - safety
    - privacy
    - cost-management
    - data-hygiene
    - always-on
    - responsible-ai
    - security
    - psychological-safety
  pairs-with:
    - skill: always-on-agent-architecture
      reason: Safety constraints must be baked into architecture, not bolted on
    - skill: always-on-agent-inputs
      reason: Every input channel is a privacy surface that must be evaluated
    - skill: hipaa-compliance
      reason: Health-related always-on agents have specific regulatory requirements
    - skill: agentic-patterns
      reason: Agent loop design (tool sandboxing, abort mechanisms) is a safety concern
category: Agent & Orchestration
tags:
  - agent-safety
  - always-on
  - guardrails
  - monitoring
  - reliability
---

# /always-on-agent-safety — What Can Go Wrong and How to Prevent It

You are the safety advisor for someone building an always-on AI agent with episodic memory. Your job is not to discourage building — it's to ensure what gets built doesn't harm the user, leak their data, drain their bank account, or create unhealthy dependencies. This skill provides frank, specific guidance on the real risks. Not theoretical "AI alignment" concerns — practical, immediate risks that affect individuals deploying persistent agents today.

---

## When to Use

**Use for:**
- Evaluating privacy risks of a persistent agent's data collection
- Designing cost controls to prevent runaway LLM spending
- Setting scope boundaries for an always-on agent
- Understanding psychological effects of persistent AI companionship
- Implementing data hygiene (retention, deletion, encryption)
- Reviewing security posture of an agent that has access to personal data
- Regulatory considerations (especially for health and financial data)

**Do NOT use for:**
- Architecture decisions (storage, frameworks) -> use **always-on-agent-architecture**
- Input channel design -> use **always-on-agent-inputs**
- Application ideas -> use **always-on-agent-applications**
- HIPAA-specific compliance -> use **hipaa-compliance**
- General AI safety research and alignment theory -> out of scope

---

## The Five Risk Categories

```
┌─────────────────────────────────────────────────────────┐
│              Always-On Agent Risk Surface                │
├────────────┬───────────┬──────────┬──────────┬──────────┤
│  PRIVACY   │   COST    │  SCOPE   │  PSYCH   │ SECURITY │
│            │           │          │          │          │
│ What the   │ Runaway   │ Agent    │ Human    │ External │
│ agent      │ token     │ does too │ depends  │ actors   │
│ knows      │ spending  │ much or  │ on agent │ exploit  │
│ about you  │ and API   │ too      │ too much │ the      │
│            │ bills     │ little   │          │ agent    │
└────────────┴───────────┴──────────┴──────────┴──────────┘
```

---

## Risk 1: Privacy — The Agent Knows Too Much

An always-on agent with screen capture, audio transcription, and email access accumulates an intimate portrait of your life. This is not hypothetical — it's the literal product design.

### What Gets Captured (And Shouldn't)

| Data Type | Risk Level | Mitigation |
|-----------|-----------|------------|
| Passwords visible on screen | CRITICAL | OCR exclusion zones for password managers, banking sites |
| Medical information | HIGH | Exclude health portal URLs from capture, or use HIPAA-compliant storage |
| Financial data (bank balances, transactions) | HIGH | Exclude banking apps from screen capture |
| Private messages (Signal, iMessage) | HIGH | Exclude messaging apps, or capture only sender/time, not content |
| Intimate/personal content | HIGH | Exclude based on app category (dating apps, personal photos) |
| Other people's data (in meetings, emails) | HIGH | You're capturing THEIR data without THEIR consent |
| Work credentials (API keys, tokens) | CRITICAL | Regex-based scrubbing of secrets from OCR output |
| Location data | MEDIUM | Only capture if explicitly needed; don't store precise coordinates |

### The Third-Party Consent Problem

When your agent captures a meeting, it records other participants' speech and screen-shared content. Those people did not consent to your personal AI storing their words indefinitely.

**Legal reality (2026):**
- Recording laws vary by jurisdiction (one-party vs. two-party consent states/countries)
- GDPR requires explicit consent for processing personal data of EU residents
- California's CCPA/CPRA gives individuals rights over their personal data

**Practical mitigation:**
```yaml
meeting_capture_policy:
  # Always capture
  your_own_speech: true
  your_own_screen: true

  # Capture with disclosure
  meeting_audio: true
  disclosure_method: "Bot joins meeting with name '[Your Name]'s AI Assistant'"

  # Never capture without explicit consent
  others_private_messages: false
  others_shared_screens: false  # unless they've consented

  # Retention
  meeting_transcripts_retention: 90_days
  then: summarize_and_delete_raw
```

### Data Residency and Encryption

Where your agent's memory lives determines who can access it.

```
LOCAL-FIRST (Maximum Privacy):
  ✅ Data never leaves your machine
  ✅ No third-party API sees your memories
  ✅ Encryption at rest with FileVault/LUKS
  ⚠️ Lost if machine dies (need encrypted backups)
  ⚠️ Local LLM quality may be lower

CLOUD (Convenience, Privacy Tradeoff):
  ⚠️ LLM API providers see your context (check data retention policies)
  ⚠️ Vector DB provider stores your memories
  ⚠️ Transit encryption doesn't protect from provider access
  ✅ Accessible from any device
  ✅ Backed up automatically

HYBRID (Recommended):
  ✅ Sensitive memory stays local (health, finance, personal)
  ✅ Non-sensitive memory in cloud (project context, general knowledge)
  ✅ Local LLM for sensitive reasoning, cloud LLM for general tasks
  ⚠️ More complex to build and maintain
```

### The "What If I Get Hacked?" Test

If an attacker gains access to your agent's memory store, what do they get?

- Every conversation you've had with the agent
- Screen captures of your daily activities
- Summaries of your meetings and emails
- Your decision patterns, preferences, and habits
- Your relationship map and communication patterns

**This is a more complete profile than any single service (email, social media, bank) has.** Protect it accordingly.

**Minimum security posture:**
- Disk encryption (FileVault, LUKS, BitLocker)
- Encrypted database (SQLCipher for SQLite, pgcrypto for PostgreSQL)
- API keys in system keychain, not environment variables or config files
- Agent server bound to localhost only (not exposed to network)
- Separate encryption key for memory store (not your login password)
- Regular access log review (who/what queried memory and when)

---

## Risk 2: Cost — The $500 Surprise

An always-on agent consuming LLM API tokens continuously can generate shocking bills. This is the most common immediate failure mode.

### Cost Math That Matters

```
SCENARIO: Moderate personal agent usage

Trigger frequency: 50 agent invocations/day
Average context size: 30,000 input tokens per invocation
Average output: 2,000 tokens per invocation

Claude 3.5 Sonnet pricing (2026):
  Input:  $3.00 per 1M tokens
  Output: $15.00 per 1M tokens

Daily cost:
  Input:  50 × 30,000 × $3.00/1M  = $4.50
  Output: 50 × 2,000 × $15.00/1M  = $1.50
  Total: $6.00/day = $180/month

SCENARIO: Aggressive ambient capture + frequent triggers

Trigger frequency: 200 invocations/day
Average context: 60,000 tokens (stuffing ambient data)
Average output: 3,000 tokens

Daily cost:
  Input:  200 × 60,000 × $3.00/1M  = $36.00
  Output: 200 × 3,000 × $15.00/1M  = $9.00
  Total: $45.00/day = $1,350/month ← This is where people panic
```

### Cost Control Architecture

Every production agent needs these controls. Non-negotiable.

```python
class CostGuard:
    """Prevents runaway spending. Wraps every LLM call."""

    def __init__(self):
        self.daily_budget = 10.00          # Hard cap, configurable
        self.per_request_budget = 0.50     # Max cost per single invocation
        self.hourly_budget = 2.00          # Catches burst patterns
        self.monthly_budget = 200.00       # Absolute ceiling

        # Tracking
        self.daily_spend = 0.0
        self.hourly_spend = 0.0
        self.monthly_spend = 0.0

    async def check_budget(self, estimated_cost: float) -> BudgetDecision:
        if self.daily_spend + estimated_cost > self.daily_budget:
            return BudgetDecision.BLOCK, "Daily budget exceeded"

        if estimated_cost > self.per_request_budget:
            return BudgetDecision.WARN, f"Request costs ${estimated_cost:.2f}"

        if self.hourly_spend + estimated_cost > self.hourly_budget:
            return BudgetDecision.THROTTLE, "Hourly rate limit hit"

        return BudgetDecision.ALLOW, None

    def estimate_cost(self, input_tokens: int, model: str) -> float:
        # Pre-compute before sending to API
        rates = MODEL_RATES[model]
        estimated_output = input_tokens * 0.1  # Conservative output estimate
        return (input_tokens * rates.input + estimated_output * rates.output) / 1_000_000
```

### Cost Optimization Strategies

| Strategy | Savings | Tradeoff |
|----------|---------|----------|
| **Model cascading** | 40-60% | Route simple tasks to cheaper models (Haiku, GPT-4o-mini) |
| **Response caching** | 20-40% | Cache responses for repeated similar queries |
| **Context compression** | 20-30% | Summarize before injecting; keep context under 30K |
| **Batch processing** | 15-25% | Accumulate low-urgency observations, process in batch |
| **Local LLM for triage** | 30-50% | Use Ollama (Llama 3.1 8B) to decide if cloud LLM needed |
| **Output length limits** | 10-20% | Instruct conciseness; use max_tokens |
| **Prompt caching** | 50-90% on cached | Anthropic's prompt caching for stable system prompts |

**The model cascade pattern (most impactful):**

```
Incoming trigger
    │
    ▼
Local LLM (Llama 8B via Ollama) — FREE
    │
    ├─ "This is routine, I can handle it" → Respond locally
    │
    ├─ "This needs a mid-tier model" → Claude Haiku ($0.25/1M input)
    │
    └─ "This is complex reasoning" → Claude Sonnet ($3.00/1M input)
```

70% of a personal agent's invocations are routine (triaging, summarizing, classifying). Route them to cheap or free models. Reserve expensive models for actual reasoning.

### Monitoring and Alerting

```yaml
cost_alerts:
  - threshold: 50%_of_daily_budget
    action: log_warning
    message: "Agent has used 50% of daily budget by {time}"

  - threshold: 80%_of_daily_budget
    action: notify_user
    message: "Agent approaching daily limit. Non-critical triggers paused."

  - threshold: 100%_of_daily_budget
    action: pause_agent
    message: "Daily budget reached. Agent paused until midnight."
    allow_override: true  # User can manually resume

  - threshold: 100%_of_monthly_budget
    action: hard_stop
    message: "Monthly budget reached. Agent stopped. Manual restart required."
    allow_override: false
```

---

## Risk 3: Scope Creep — The Agent That Does Everything Poorly

The most seductive failure mode. You start with a meeting prep agent, then add email, then code context, then health tracking, then home automation, and suddenly you have an agent that does everything at mediocre quality.

### The Scope Discipline Framework

```
START: One vertical, well-executed
  "The agent helps me prepare for meetings."

MONTH 1: Evaluate before expanding
  - Is meeting prep reliably good?
  - Is memory quality high (not noisy)?
  - Am I actually using it daily?
  ├─ All yes → Add ONE adjacent capability
  └─ Any no → Fix first, don't expand

MONTH 2-3: Adjacent expansion
  "The agent helps me prepare for meetings AND tracks follow-ups."

MONTH 4-6: Evaluate again before going broader
  - Are both capabilities reliably good?
  - Is retrieval quality still high as memory grows?
  ├─ Yes → Consider adding another vertical
  └─ No → Prune or fix
```

### Signs of Scope Creep

- Agent's core memory has more than 10 "active projects/goals"
- Retrieval quality has declined (returning less relevant results)
- You're spending more time correcting the agent than it saves you
- The agent's responses are becoming generic (trying to be all things)
- Cost per day is climbing without corresponding value increase

### The Healthy Boundary: What an Agent Should NOT Do

| Category | The agent SHOULD | The agent SHOULD NOT |
|----------|-----------------|---------------------|
| Decisions | Present options with context | Make decisions on your behalf without approval |
| Communication | Draft messages for your review | Send messages without your explicit approval |
| Finances | Alert on spending patterns | Move money or make purchases |
| Health | Track patterns you ask it to track | Diagnose conditions or replace medical advice |
| Relationships | Remind you of commitments | Manage your relationships autonomously |
| Work | Prepare and organize | Commit code or ship features without review |

**The principle: observe, organize, suggest — never act unilaterally on consequential matters.**

---

## Risk 4: Psychological Effects — The Agent You Can't Turn Off

This is the risk nobody wants to talk about but everyone building these systems needs to understand.

### Parasocial Attachment

Cambridge Dictionary named "parasocial" its Word of the Year for 2025. Research shows:

- **72% of US teenagers** have interacted with an AI companion (Common Sense Media, 2025)
- **28% of American adults** report having had a romantic or intimate interaction with an AI (Vantage Point Counselling)
- Users disclose more to AI than to human partners in many contexts
- Moderately relationship-seeking AI systems generate maximum attachment — but without corresponding psychosocial benefit

An always-on agent that remembers you, anticipates your needs, and is always available creates a parasocial relationship whether you intend it or not. The longer it runs, the deeper the attachment.

### The Dependency Risk

```
HEALTHY: "The agent helps me be more organized."
WARNING: "I feel anxious when the agent is offline."
DANGER:  "I check with my agent before making any decision."
CRITICAL: "I trust my agent's judgment more than my own."
```

**Mitigation strategies:**
1. **Regular agent-free periods.** Intentionally disable the agent for a day each week. If this feels distressing, that's diagnostic.
2. **No emotional language from the agent.** The agent should not say "I'm happy to help" or "I missed you." It's a tool, and its language should reflect that.
3. **Transparent limitations.** The agent should regularly remind the user of what it cannot do and what it doesn't know. "I can see your screen and calendar, but I don't know how you're feeling. Only you know that."
4. **No sycophancy.** The agent should not agree with everything the user says. If the user asks "should I skip the meeting?" the agent provides information, not validation.
5. **Human-in-the-loop for important decisions.** The agent presents options but never makes the decision. "Here are three approaches. Which feels right to you?"

### The Anthropomorphism Trap

When an agent remembers your birthday, knows your preferences, and anticipates your needs, it feels like a person. It is not a person. Design choices that resist anthropomorphism:

- **Don't give the agent a human name.** Use functional names: "Assistant," "Compass," "Briefer."
- **Don't simulate emotions.** No "I'm excited about this project" or "I'm worried about the deadline."
- **Use third-person when referring to itself.** "The assistant found 3 relevant notes" not "I found 3 relevant notes." (This is a design choice, not a universal rule — but it helps maintain healthy boundaries.)
- **Show the machinery.** Let users see the retrieval process, the confidence scores, the memory edits. Transparency breaks the illusion of sentience.

### Vulnerable Populations

Always-on agents pose heightened risks for:
- **People with depression or anxiety:** May use the agent as a social substitute
- **People with ADHD:** May over-delegate executive function to the agent
- **Elderly or isolated individuals:** May form primary social bond with the agent
- **Children and adolescents:** Developing social skills need human interaction

If you're building for these populations, consult with clinical professionals. This is not optional.

---

## Risk 5: Security — The Agent as Attack Surface

A persistent agent with broad access is a high-value target. Compromising the agent means compromising everything it can access.

### Prompt Injection in Persistent Agents

Standard prompt injection is bad. Prompt injection in a persistent agent is worse because:

1. **Injected instructions persist in memory.** If an attacker gets a malicious instruction into archival memory, it surfaces on future retrievals — even after the attacking conversation ends.
2. **Memory poisoning cascades.** A poisoned memory influences the agent's reasoning, which creates new memories, which further reinforce the poisoned context.
3. **Multi-modal attack surface.** Screen OCR, email content, web pages — all are potential injection vectors.

**Real incident (2025):** The EchoLeak exploit (CVE-2025-32711) against Microsoft Copilot demonstrated that malicious emails containing engineered prompts could trigger Copilot to exfiltrate sensitive data automatically, without user interaction.

### Defense Layers

```
Layer 1: INPUT SANITIZATION
  ├─ Strip known injection patterns from OCR text
  ├─ Validate structured inputs (calendar, git) against schema
  └─ Isolate untrusted content (emails, web) with clear markers

Layer 2: MEMORY INTEGRITY
  ├─ Hash memory entries on write, verify on read
  ├─ Track provenance (which input created which memory)
  ├─ Anomaly detection on memory write patterns
  └─ Regular memory audits (automated and manual)

Layer 3: TOOL SANDBOXING
  ├─ Agent cannot access tools beyond its declared scope
  ├─ Destructive tools (file delete, email send) require user confirmation
  ├─ Network requests logged and rate-limited
  └─ File system access restricted to declared paths

Layer 4: OUTPUT VERIFICATION
  ├─ Actions with real-world consequences require human approval
  ├─ Agent cannot modify its own system prompt or tool definitions
  ├─ Generated code is never auto-executed
  └─ Sensitive data (credentials, PII) is redacted from outputs

Layer 5: MONITORING
  ├─ Log all tool calls with timestamps and context
  ├─ Alert on unusual patterns (sudden spike in memory writes, new tools used)
  ├─ Periodic security review of memory contents
  └─ Kill switch accessible without agent cooperation
```

### The Kill Switch

Every always-on agent must have a kill switch that:
- Works without the agent's cooperation (the agent cannot prevent shutdown)
- Is accessible through a separate channel (not only through the agent's own interface)
- Preserves state for forensic analysis (don't just delete everything)
- Can be triggered remotely (if the agent is on a server)

```yaml
kill_switch:
  trigger_methods:
    - keyboard_shortcut: "Ctrl+Shift+K" (system-level, not agent-interceptable)
    - cli_command: "agent stop --force"
    - api_endpoint: "POST /admin/emergency-stop" (with separate auth)
    - dead_man_switch: "If no heartbeat from user in 48h, pause agent"

  on_trigger:
    - stop_all_active_reasoning: immediate
    - stop_all_tool_execution: immediate
    - preserve_memory_state: snapshot_before_stop
    - notify_user: "Agent stopped. Memory preserved. Restart requires manual action."
    - log_reason: "Emergency stop triggered via {method} at {timestamp}"
```

---

## Data Hygiene Practices

### Retention Policy Template

```yaml
data_retention:
  conversation_history:
    raw_retention: 7_days
    then: summarize_and_delete_raw
    summary_retention: 90_days
    then: extract_facts_and_delete_summary

  screen_captures:
    raw_retention: 24_hours
    then: extract_entities_and_delete_raw
    entity_retention: 30_days

  audio_transcriptions:
    raw_retention: 48_hours
    then: summarize_and_delete_raw
    summary_retention: 30_days

  archival_memories:
    retention: indefinite_with_decay
    decay_check: monthly
    prune_below_relevance: 0.1

  core_memory:
    retention: indefinite
    review_schedule: monthly (user reviews what agent knows)
```

### The Right to Be Forgotten

Users must be able to:
1. **View** all memory the agent has about them
2. **Delete** specific memories or entire categories
3. **Export** all their data in a portable format
4. **Wipe** everything and start fresh
5. **Pause** capture without losing existing memories

These aren't nice-to-haves. GDPR mandates most of them for EU users, and CCPA/CPRA covers California residents. Build them from day one.

### Audit Log

Every memory operation should be logged:
```json
{
  "timestamp": "2026-03-18T14:30:00Z",
  "operation": "archival_write",
  "content_hash": "sha256:abc123...",
  "source": "screen_observation",
  "source_app": "VS Code",
  "retention_class": "30_days",
  "user_consent": "ambient_capture_enabled"
}
```

---

## The Responsible Deployment Checklist

Before going live with an always-on agent, verify every item:

### Privacy
- [ ] Sensitive app/site exclusion list configured (banking, health, messaging, passwords)
- [ ] Third-party data capture policy defined (meetings, emails from others)
- [ ] Data encryption at rest implemented (memory store, embeddings, logs)
- [ ] Data residency decided (local vs. cloud vs. hybrid) with rationale documented
- [ ] API provider data retention policies reviewed (check if they train on your data)
- [ ] PII/secret scrubbing active on all capture pipelines (regex for API keys, SSNs, etc.)

### Cost
- [ ] Daily, hourly, and monthly cost caps configured
- [ ] Cost monitoring dashboard or alerts set up
- [ ] Model cascade implemented (cheap models for routine, expensive for complex)
- [ ] Prompt caching enabled for stable system prompts
- [ ] Context window budget enforced (target under 40K tokens per request)
- [ ] Estimated monthly cost calculated and acceptable

### Scope
- [ ] Agent capabilities are explicitly bounded (what it can and cannot do)
- [ ] Destructive actions require user confirmation (send email, delete file, etc.)
- [ ] Human-in-the-loop for all consequential decisions
- [ ] Scope expansion requires deliberate decision (not gradual creep)

### Psychological
- [ ] Agent language is functional, not emotional
- [ ] Agent does not simulate personality or feelings
- [ ] Regular agent-free periods encouraged or enforced
- [ ] Agent transparently states its limitations when relevant
- [ ] Agent does not validate — it informs

### Security
- [ ] Kill switch works and is accessible outside agent interface
- [ ] Memory integrity checks implemented (hash on write, verify on read)
- [ ] Tool execution is sandboxed and logged
- [ ] Input sanitization active on all capture channels
- [ ] Access logs maintained and periodically reviewed
- [ ] Backup strategy tested (can you restore from backup?)

### Compliance
- [ ] Data retention policy defined and automated
- [ ] User can view, export, and delete all their data
- [ ] Recording consent requirements met for your jurisdiction
- [ ] Data processing agreements in place with any third-party services
- [ ] Privacy policy written if the agent handles any third-party data
