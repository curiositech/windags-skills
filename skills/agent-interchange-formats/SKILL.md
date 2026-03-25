---
license: Apache-2.0
name: agent-interchange-formats
description: |
  Data structures and serialization formats for agent-to-agent communication. Covers message envelopes, structured output schemas, capability declarations, task handoff payloads, error/retry signaling, and context windows as data structures. Deep comparison of A2A protocol, MCP, OpenAI function calling, and LangChain message types. Teaches when to use rigid schemas vs free-form with validation, typed vs untyped, streaming vs batch. Activate on: "agent message format", "agent communication schema", "agent-to-agent protocol", "A2A protocol", "MCP message format", "structured output for agents", "agent interop", "interchange format", "agent serialization", "task handoff format", "capability declaration". NOT for: what agents say to each other (use agent-conversation-protocols), orchestration topology (use multi-agent-coordination), building agent infrastructure (use agentic-infrastructure-2026).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
metadata:
  category: AI & Agents
  tags:
    - agents
    - protocols
    - serialization
    - schemas
    - interoperability
    - A2A
    - MCP
    - structured-output
  pairs-with:
    - skill: agent-conversation-protocols
      reason: Formats define the wire; conversation protocols define the dialogue
    - skill: multi-agent-coordination
      reason: Coordination patterns depend on well-defined interchange formats
    - skill: typescript-advanced-patterns
      reason: Branded types, discriminated unions, and Zod schemas power format validation
    - skill: agentic-infrastructure-2026
      reason: Infrastructure decisions constrain which interchange formats are viable
category: Agent & Orchestration
tags:
  - agent
  - interchange
  - formats
  - ai
  - orchestration
  - ui
---

# Agent Interchange Formats

You are an expert in the data structures agents use to communicate. You understand wire formats from FIPA-ACL through MCP and A2A, and you can design message envelopes, capability cards, task payloads, and error signals that are both machine-parseable and LLM-friendly.

## DECISION POINTS

### Protocol Selection Tree

```
Agent communication scenario?
├── Single agent calling tools?
│   ├── Tools are local processes → MCP over stdio
│   └── Tools are remote services → MCP over HTTP/SSE or OpenAI function calling
├── Agent-to-agent communication?
│   ├── Need discovery + task lifecycle + async → A2A Protocol
│   ├── Simple request/response → JSON-RPC 2.0 custom
│   └── Integration with existing framework → Framework's native format
└── Structured output from LLM?
    ├── Machine-readable payload (APIs, schemas) → Schema-first (Zod/JSON Schema)
    └── Creative/exploratory content → Validate-after parsing
```

### Schema Strictness Decision

```
If payload type is:
├── Tool call parameters → Always schema-first (breaks without structure)
├── Agent capability cards → Always schema-first (discovery needs reliability)  
├── Task handoff data → Always schema-first (automation requires structure)
├── Error/retry signals → Always schema-first (programmatic retry logic)
├── Creative text output → Always validate-after (schema kills creativity)
├── Analysis results → Validate-after with fallback extraction
└── Mixed content → Use Parts array: schema-first for DataPart, validate-after for TextPart
```

### Streaming vs Batch Decision

```
If user experience requires:
├── Progressive output (user-facing) → Streaming (SSE/WebSocket)
├── Long-running tasks (>30s) → Streaming with status updates
├── Agent-to-agent pipelines → Batch (cleaner error handling)
├── Cost tracking critical → Batch (known token count upfront)
├── Mid-stream recovery needed → Batch (streaming error handling is complex)
└── Simple integration → Batch (HTTP request/response)
```

## FAILURE MODES

### Schema Drift
**Symptoms:** Runtime validation errors between agents that worked before, TypeScript compilation succeeds but runtime fails
**Diagnosis:** Version mismatch between schema definitions, one agent updated schema without coordinating
**Fix:** Add explicit version field to all schemas; implement backward compatibility checking; use schema registry for coordination

### Message Loss
**Symptoms:** Conversations appear incomplete, agents retry indefinitely, duplicate processing occurs
**Diagnosis:** No deduplication mechanism, missing correlation IDs, network issues without recovery
**Fix:** Add UUID message IDs; implement seen-message tracking; use conversationId for threading; add retry logic with exponential backoff

### Context Window Overflow 
**Symptoms:** Agent tasks fail with "context too long", truncated conversations, incomplete tool results
**Diagnosis:** No token counting in handoffs, unlimited context accumulation, missing summarization
**Fix:** Estimate tokens per Part; implement context budgeting; add droppable priority system; compress with summaries

### Parsing Rigidity
**Symptoms:** Agent outputs malformed JSON, creative tasks produce generic responses, high retry rates
**Diagnosis:** Schema-first applied to exploratory content, overly strict validation, no graceful degradation
**Fix:** Use validate-after for creative content; implement extraction fallbacks; loosen constraints for exploratory tasks

### Protocol Tower of Babel
**Symptoms:** Each agent pair needs custom translation, integration complexity explodes, maintenance burden
**Diagnosis:** Every team invented their own wire format, no standardization, NIH syndrome
**Fix:** Adopt JSON-RPC 2.0 as wire standard; use A2A for multi-agent; implement format adapters for legacy systems

## WORKED EXAMPLES

### Example 1: Task Handoff with Context Window Limits

**Scenario:** Research agent (32k context) hands off to code generation agent (128k context) with 50k tokens of research data.

**Decision Process:**
1. Check receiving agent's context budget: 128k - 8k (system) - 8k (output) = 112k available
2. Research data (50k) fits, but apply context budgeting anyway for robustness
3. Structure handoff with priority dropping for non-critical context

```typescript
// Research agent prepares handoff
const contextHandoff: ContextHandoff = {
  context: [
    { kind: 'text', text: summary, mimeType: 'text/markdown' },
    { kind: 'data', data: criticalFindings, schema: FindingsSchema },
    { kind: 'text', text: detailedNotes, mimeType: 'text/plain' }
  ],
  estimatedTokens: 50000,
  droppable: [
    { partIndex: 2, priority: 1, tokenEstimate: 30000 }, // Detailed notes first
    { partIndex: 0, priority: 2, tokenEstimate: 15000 }  // Summary if desperate
  ],
  summary: "Key findings: API rate limits, async patterns needed",
  summaryTokens: 500
};

// Code generation agent receives and budgets
const budget = calculateContextBudget(128000);
if (contextHandoff.estimatedTokens > budget.available) {
  // Drop low-priority context
  let remainingBudget = budget.available;
  const finalContext = contextHandoff.context.filter((part, index) => {
    const droppable = contextHandoff.droppable?.find(d => d.partIndex === index);
    if (droppable && droppable.tokenEstimate > remainingBudget) {
      return false; // Drop this part
    }
    remainingBudget -= droppable?.tokenEstimate || 1000;
    return true;
  });
}
```

**Novice miss:** Would pass raw research data without token estimates, causing downstream context overflow.
**Expert catch:** Structures handoff with explicit budgeting and graceful degradation.

### Example 2: A2A vs MCP Protocol Choice

**Scenario:** Building a document processing system with OCR agent, analysis agent, and formatting agent.

**Decision Process:**
1. Multiple agents need to discover each other → Rules out OpenAI function calling
2. Agents run on different servers, need async task lifecycle → A2A Protocol wins over MCP
3. Need bidirectional communication and task status → Confirms A2A choice

```typescript
// Document flows through agent pipeline
const ocrCard: AgentCard = {
  agentId: 'ocr-service-v2',
  name: 'OCR Document Reader', 
  url: 'https://ocr.company.com',
  skills: [{
    id: 'extract-text',
    inputSchema: { /* PDF/image schema */ },
    outputSchema: { /* structured text schema */ }
  }],
  capabilities: {
    streaming: true,  // Long OCR tasks need status updates
    pushNotifications: true,  // Notify when OCR completes
    stateTransitionHistory: true  // Track progress through pipeline
  }
};

// Task submission to OCR agent
const ocrTask: Task = {
  id: generateTaskId(),
  state: 'submitted',
  messages: [{
    id: generateId(),
    timestamp: new Date().toISOString(),
    sender: { agentId: 'document-processor' },
    recipient: { agentId: 'ocr-service-v2' },
    conversationId: documentProcessingId,
    parts: [
      { kind: 'file', name: 'contract.pdf', content: base64Content, mimeType: 'application/pdf' }
    ]
  }],
  artifacts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

**Novice miss:** Would choose MCP because "it's simpler" without considering bidirectional async requirements.
**Expert catch:** Recognizes A2A is needed for service discovery, task lifecycle, and multi-agent orchestration.

### Example 3: Error Recovery with Retry Logic

**Scenario:** Analysis agent fails during processing due to rate limiting, needs intelligent retry.

**Decision Process:**
1. Detect error type from structured error codes
2. Check retryable flag and backoff parameters
3. Implement exponential backoff with jitter
4. Escalate to human after max retries

```typescript
// Agent returns structured error
const rateLimitError: AgentError = {
  code: 'RATE_LIMITED',
  message: 'API quota exceeded. Try again in 60 seconds.',
  retryable: true,
  retryAfterMs: 60000,
  maxRetries: 3,
  details: {
    quotaType: 'requests_per_minute',
    resetTime: '2025-01-08T10:15:00Z'
  }
};

// Calling agent implements retry logic
async function callAgentWithRetry(agent: AgentCard, task: Task, attempt = 1): Promise<Task> {
  try {
    return await callAgent(agent, task);
  } catch (error) {
    if (error instanceof AgentError && error.retryable && attempt <= error.maxRetries) {
      // Exponential backoff with jitter
      const baseDelay = error.retryAfterMs || 1000;
      const jitter = Math.random() * 0.1 * baseDelay;
      const delay = baseDelay * Math.pow(2, attempt - 1) + jitter;
      
      await sleep(delay);
      return callAgentWithRetry(agent, task, attempt + 1);
    } else {
      // Not retryable or max attempts exceeded
      return {
        ...task,
        state: 'failed',
        artifacts: [{
          id: generateId(),
          name: 'error-report',
          parts: [{ kind: 'error', ...error }],
          createdAt: new Date().toISOString(),
          index: 0
        }]
      };
    }
  }
}
```

**Novice miss:** Would retry immediately without backoff, or give up after first failure.
**Expert catch:** Uses structured error codes for intelligent retry with proper backoff and escalation.

## QUALITY GATES

- [ ] Every message envelope includes unique `id`, `conversationId`, and ISO-8601 `timestamp`
- [ ] Parts use discriminated union with `kind` field for type safety
- [ ] Agent Cards are published at discoverable `.well-known/agent.json` URL  
- [ ] Error objects include `retryable` boolean and typed `code` enum
- [ ] Context handoffs include token estimates and priority-based dropping
- [ ] All schemas validate round-trip: serialize → deserialize → equals original
- [ ] Binary content uses URI references, not base64 embedding
- [ ] Backward compatibility maintained across schema versions
- [ ] Streaming events include monotonic sequence numbers for ordering
- [ ] No sensitive data in message metadata (use proper auth headers)

## NOT-FOR Boundaries

**This skill should NOT be used for:**
- **Conversation semantics**: What agents say to each other → Use `agent-conversation-protocols` instead
- **Orchestration topology**: How agents are connected → Use `multi-agent-coordination` instead  
- **Infrastructure setup**: Deploying agent runtime → Use `agentic-infrastructure-2026` instead
- **Single-agent frameworks**: Building individual agents → Use `ai-engineer` instead
- **API design**: Designing REST/GraphQL APIs → Use `api-design-patterns` instead

**Delegate to:**
- Schema validation logic → Use `typescript-advanced-patterns` for Zod/branded types
- Network transport → Use `systems-architecture` for HTTP/WebSocket setup
- Authentication flows → Use `auth-patterns` for OAuth2/JWT implementation