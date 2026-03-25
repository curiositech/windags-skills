---
---
license: Apache-2.0
name: agentic-zero-trust-security
description: |
  Cryptographic security for agentic systems — zero-trust agent networking, signed message envelopes (JWS/JWE), capability-based security (ocaps), Merkle tree audit trails, WASM sandboxing, and formal verification. Covers CLI dev tool security, mTLS between agents, permission boundaries (least privilege for AI agents), and supply chain security for skills/plugins. Activate on: "agent security", "zero trust agents", "secure agent communication", "capability-based security", "ocap", "signed messages between agents", "agent audit trail", "sandbox agent execution", "agent permissions", "mTLS agents", "cryptographic verification", "agent supply chain", "OWASP agentic", "prove agent did X", "tamper-proof agent logs". NOT for: application-level SAST scanning (use security-auditor), network firewall rules (use infrastructure), SOC2/HIPAA compliance (organizational), or prompt injection defense (use prompt-engineer).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Security & Trust
  tags:
    - zero-trust
    - cryptography
    - agent-security
    - capability-security
    - mTLS
    - audit-trail
    - sandboxing
    - WASM
    - ocap
    - formal-verification
  pairs-with:
    - skill: multi-agent-coordination
      reason: Secures the communication channels multi-agent systems rely on
    - skill: agent-conversation-protocols
      reason: Message envelope signing and verification for agent protocols
    - skill: security-auditor
      reason: Complements code-level SAST with architectural security patterns
category: Security
tags:
  - zero-trust
  - security
  - agents
  - authentication
  - authorization
---

# Agentic Zero-Trust Security

Cryptographic security architecture for autonomous AI agent systems. This skill covers the intersection of traditional security engineering and the unique challenges of agents that plan, persist, delegate, and execute across trust boundaries.

**Core principle**: Never trust, always verify — applied to every agent-to-agent message, every skill loaded, every tool invoked, and every result returned.

## Decision Points

### 1. Threat Level → Verification Strategy

```
Threat Level Assessment:
├── PUBLIC (internet agents, unknown skills)
│   ├── Actions: Full mTLS + JWS + capability tokens + WASM sandbox
│   ├── Audit: Every action logged with Merkle proof
│   └── TTL: Max 5min capability lifetime
├── INTERNAL (trusted agent cluster)
│   ├── Actions: mTLS + JWS + capabilities (longer TTL)
│   ├── Audit: Aggregate logging with daily root publish
│   └── TTL: Max 1hr capability lifetime
└── DEV/TEST (localhost, development)
    ├── Actions: Optional mTLS + basic capabilities
    ├── Audit: Local file logs (no Merkle tree)
    └── TTL: Max 24hr capability lifetime
```

### 2. Agent Request → Capability Check → Grant/Deny Logic

```
Incoming Agent Request Processing:
├── 1. Verify mTLS certificate chain
│   ├── Valid CA signature? → Continue
│   └── Invalid/expired? → REJECT immediately
├── 2. Parse JWS message envelope
│   ├── Signature valid + not expired? → Continue
│   ├── Replay detected (jti cache)? → REJECT
│   └── Signature invalid? → REJECT + log security event
├── 3. Check required capabilities
│   ├── Agent holds exact capability? → GRANT
│   ├── Agent holds broader capability? → ATTENUATE + GRANT
│   ├── Capability expired? → REJECT + force refresh
│   └── No matching capability? → REJECT + suggest minimal grant
└── 4. Execute with sandbox constraints
    ├── WASM skills: CPU/memory limits enforced
    ├── File operations: Path validation against capabilities
    └── Network calls: Destination validation against capabilities
```

### 3. Delegation Chain → Trust Depth Decision

```
Capability Delegation Request:
├── Parent capability delegatable=true?
│   ├── Yes → Check remaining depth
│   │   ├── Depth > 0 → Allow with depth-1
│   │   └── Depth = 0 → REJECT (max delegation reached)
│   └── No → REJECT (not delegatable)
├── Requested actions ⊆ parent actions?
│   ├── Yes → Allow subset
│   └── No → REJECT (cannot escalate privileges)
└── Trust boundary crossed?
    ├── Same orchestrator domain → Allow
    └── Different domain → Require explicit cross-domain capability
```

## Failure Modes

### 1. Ambient Authority Leakage
**Detection**: `grep -r "process.env" agent_code/` shows environment variable access without capability check
**Symptom**: Agent accesses resources it shouldn't have permissions for
**Fix**: Replace with explicit capability tokens scoped to exact resources needed

### 2. Message Replay Attack
**Detection**: Multiple audit log entries with identical `jti` (message ID) or timestamps within replay window
**Symptom**: Agent receives and processes the same command multiple times
**Fix**: Implement jti deduplication cache with TTL matching message expiry

### 3. Capability Escalation Through Delegation
**Detection**: Child capability has more actions than parent, or delegation depth exceeded configured maximum
**Symptom**: Sub-agents gain more privileges than their parent delegator intended
**Fix**: Enforce attenuation invariant: child capabilities ⊆ parent capabilities at delegation time

### 4. Sandbox Escape Through Resource Exhaustion
**Detection**: Agent CPU usage >95% for >30 seconds, or memory usage approaching sandbox limits
**Symptom**: Agent attempts infinite loops or excessive memory allocation to break out of constraints
**Fix**: Hard-kill agent process at resource limits, implement fuel-based execution metering

### 5. Trust-on-First-Use (TOFU) Certificate Acceptance
**Detection**: Agent accepts certificate without CA verification on first connection
**Symptom**: Man-in-the-middle attacks succeed by presenting any certificate
**Fix**: Pre-provision all agent certificates, maintain explicit trust store, reject unknown CAs

## Worked Examples

### Example 1: Multi-Agent Message Signing Pipeline

**Scenario**: Research agent needs to pass analysis to code generation agent, then to review agent.

**Setup Phase**:
```typescript
// Orchestrator mints capabilities
const researchCap = mint.mint('fs:/tmp/research/**', ['read','write'], 'agent-research-001');
const codegenCap = mint.mint('fs:/workspace/src/**', ['read','write'], 'agent-codegen-001'); 
const reviewCap = mint.mint('fs:/workspace/**', ['read'], 'agent-review-001');
```

**Message Flow**:
1. **Research → Codegen**: Research agent creates JWS-signed message:
   ```
   Header: {alg: 'EdDSA', kid: 'agent-research-001/v1'}
   Payload: {
     iss: 'agent-research-001',
     sub: 'agent-codegen-001', 
     dag_id: 'proj-alpha-v1',
     action: 'task',
     body: {analysis: "API needs OAuth2 flow", output_path: "/tmp/research/api_analysis.json"}
   }
   ```

2. **Codegen Verification**: Codegen agent receives message:
   - Verifies JWS signature against research agent's public key
   - Checks message TTL (not expired)
   - Validates jti not in replay cache
   - Confirms dag_id matches current execution context
   - **Expert catch**: Verifies research agent had capability for output_path

3. **Codegen → Review**: Codegen creates signed result:
   ```json
   {
     "iss": "agent-codegen-001",
     "sub": "agent-review-001",
     "action": "result", 
     "body": {"generated_files": ["/workspace/src/auth.ts"], "confidence": 0.87}
   }
   ```

**Novice miss**: Would skip jti replay protection, allowing duplicate processing.
**Expert insight**: Audit trail shows complete message chain with cryptographic proof of custody.

### Example 2: Capability Token Issuance with Attenuation

**Scenario**: Main agent needs to delegate file analysis to specialized sub-agent, but restrict access to sensitive directories.

**Initial Grant**:
```typescript
// Orchestrator grants broad filesystem access
const mainCap = mint.mint('fs:/project/**', ['read','write','execute'], 'agent-main', {
  delegatable: true,
  maxDepth: 2,
  ttlSeconds: 3600
});
```

**Attenuation Decision Tree**:
```
Main agent evaluating delegation request:
├── Sub-agent requests: fs:/project/src/** [read]
│   ├── /project/src/** ⊂ /project/** ? YES
│   ├── [read] ⊂ [read,write,execute] ? YES  
│   ├── Delegation depth 2 > 0 ? YES
│   └── GRANT: Create attenuated capability
├── Sub-agent requests: fs:/project/secrets/** [read]  
│   ├── Path contains "secrets" → Security policy violation
│   └── REJECT: Sensitive path exclusion
└── Sub-agent requests: fs:/etc/passwd [read]
    ├── /etc/passwd ⊂ /project/** ? NO
    └── REJECT: Outside authorized scope
```

**Attenuated Capability Generated**:
```typescript
const subCap = mint.attenuate(mainCap, 'agent-analyzer-001', ['read']);
// Results in: fs:/project/src/** [read] delegatable=true maxDepth=1 ttl=3600s
```

**Novice miss**: Would grant full parent capability without restriction.
**Expert insight**: Attenuation enforces "never escalate privileges" at the cryptographic level.

### Example 3: Sandbox Policy Violation Detection with Trade-off Analysis

**Scenario**: Code generation agent attempts to access network during execution, violating sandbox policy.

**Sandbox Configuration**:
```typescript
const codegenSandbox = {
  fileRead: ['/workspace/src/**', '/workspace/package.json'],
  fileWrite: ['/workspace/src/**'], 
  netConnect: false,  // NO network access
  maxExecutionMs: 300000,
  maxMemoryMb: 512
};
```

**Violation Detection Flow**:
1. **Agent Action**: Codegen attempts `fetch('https://api.github.com/repos/...')`
2. **Sandbox Intercept**: WASM runtime catches syscall for network socket
3. **Policy Check**: `netConnect: false` → VIOLATION DETECTED
4. **Trade-off Analysis**:
   ```
   Security vs Functionality Trade-offs:
   ├── STRICT (current): Block network, terminate agent
   │   ├── Pro: Zero network attack surface
   │   ├── Con: Cannot fetch external dependencies/docs
   │   └── Decision: ENFORCE (security-first environment)
   ├── MODERATE: Allow specific whitelisted domains
   │   ├── Pro: Functional for known-good APIs  
   │   ├── Con: DNS poisoning, subdomain takeover risks
   │   └── Decision: Consider for dev environments only
   └── PERMISSIVE: Log but allow
       ├── Pro: Full functionality preserved
       ├── Con: Agent can exfiltrate data, download malware
       └── Decision: REJECT (violates zero-trust model)
   ```

5. **Response**: Terminate agent, log security event:
   ```json
   {
     "event": "sandbox_violation",
     "agent_id": "agent-codegen-001", 
     "violation_type": "unauthorized_network_access",
     "attempted_url": "api.github.com",
     "policy_matched": "netConnect: false",
     "action_taken": "terminate_agent"
   }
   ```

**Novice miss**: Would allow the network access "just this once" or not detect the violation.
**Expert insight**: Sandbox violations indicate potential compromise or model drift—always enforce strictly.

## Quality Gates

- [ ] Every agent has unique cryptographic identity (Ed25519 keypair + certificate)
- [ ] All agent-to-agent channels use mutual TLS with certificate verification
- [ ] All messages carry JWS signatures with <5min TTL and jti replay protection
- [ ] Capability tokens follow ocap model (no ambient authority anywhere)
- [ ] Capability delegation preserves attenuation invariant (child ⊆ parent privileges)
- [ ] Audit trail uses append-only Merkle tree with published roots
- [ ] All skill execution occurs in WASM or container sandbox
- [ ] Resource limits enforced (CPU, memory, execution time, network)
- [ ] Skill packages are content-addressed and author-signed
- [ ] No agent accepts unsigned or unverified skills/inputs
- [ ] Certificate rotation automated with <24hr certificate lifetime
- [ ] Replay detection cache operational with TTL matching message expiry
- [ ] All security violations logged with timestamp + agent identity + action taken

## NOT-FOR Boundaries

**This skill should NOT be used for:**
- Application-level vulnerability scanning → Use `security-auditor` instead
- Network firewall/WAF configuration → Use `infrastructure-engineer` instead  
- SOC2/HIPAA compliance documentation → Use organizational compliance processes
- Prompt injection defense → Use `prompt-engineer` skill instead
- Rate limiting or DDoS protection → Use API gateway configuration
- Container orchestration security → Use `devops-automator` skill instead

**Delegation boundaries:**
- For code-level security issues → `security-auditor`
- For infrastructure hardening → `infrastructure-engineer`
- For secure coding practices → `software-engineer`
- For incident response → `security-incident-response`