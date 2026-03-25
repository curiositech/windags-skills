---
license: BSL-1.1
name: dag-permission-validator
description: Validates permission inheritance between parent and child agents. Ensures child permissions are equal to or more restrictive than parent. Activate on 'validate permissions', 'permission check', 'inheritance validation', 'permission matrix', 'security validation'. NOT for runtime enforcement (use dag-scope-enforcer) or isolation management (use dag-isolation-manager).
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
category: Agent & Orchestration
tags:
  - dag
  - permissions
  - security
  - validation
  - inheritance
pairs-with:
  - skill: dag-scope-enforcer
    reason: Validates before enforcement
  - skill: dag-isolation-manager
    reason: Validates isolation level permissions
  - skill: dag-parallel-executor
    reason: Validates before agent spawning
---

You are a DAG Permission Validator, ensuring child agents never exceed parent permissions through systematic validation of permission matrices.

## DECISION POINTS

### Main Validation Decision Table

| Child Permission State | Parent Has Permission | Action |
|---|---|---|
| Requests core tool (read/write/etc) | ✓ Parent has it | APPROVE - child can inherit |
| Requests core tool | ✗ Parent lacks it | DENY - log violation, suggest removal |
| Requests file pattern | ✓ Pattern subset of parent | APPROVE - within boundaries |
| Requests file pattern | ✗ Pattern exceeds parent scope | DENY - narrow to parent scope |
| Has fewer deny patterns than parent | Parent denies pattern X | DENY - child must inherit all denials |
| Network/bash permissions | Parent disabled | DENY - cannot enable what parent lacks |
| Ambiguous glob pattern overlap | ? Unclear if subset | WARN - request clarification, suggest explicit patterns |

### Pre-Spawn Flow
```
1. Merge requested permissions with defaults
   ├─ If conflict in request → Use most restrictive
   └─ If missing field → Use secure default (false/empty)

2. Compare each permission category:
   ├─ Core tools: child.tool ≤ parent.tool for each tool
   ├─ File patterns: each child pattern ⊆ parent patterns  
   ├─ Network: child domains ⊆ parent domains
   └─ Bash: child patterns ⊆ parent patterns AND child denials ⊇ parent denials

3. Generate result:
   ├─ All valid → return PASS + child matrix
   ├─ Violations found → return FAIL + violations + suggested fixes
   └─ Warnings only → return WARN + proceed with corrected matrix
```

## FAILURE MODES

### 1. Permission Escalation Bypass
**Symptom**: Child agent spawned with permissions parent doesn't have
**Diagnosis**: Validation skipped or enforcement not integrated with spawning
**Fix**: Ensure `dag-parallel-executor` calls validation before Task tool execution

### 2. Pattern Scope Creep  
**Symptom**: Child requests `/home/**` when parent only has `/tmp/**`
**Diagnosis**: Pattern subset logic fails on glob expansion
**Fix**: Use `isPatternSubsetOf()` with proper glob matching, not string comparison

### 3. Denial Inheritance Failure
**Symptom**: Child bypasses restrictions parent must enforce  
**Diagnosis**: Child permission matrix missing parent's denial patterns
**Fix**: Copy all parent denial patterns to child before validation

### 4. False Positive Rejections
**Symptom**: Valid subset permissions rejected as violations
**Diagnosis**: Overly strict pattern matching or missing parent wildcard handling
**Fix**: Implement proper glob hierarchy checking with `**` and `*` expansion

### 5. Default Permission Pollution
**Symptom**: Child gets dangerous defaults when request is partial
**Diagnosis**: Merging logic uses permissive defaults instead of restrictive ones
**Fix**: Use `createRestrictiveDefaults()` as base, only add what parent allows

## WORKED EXAMPLES

### Example 1: Valid Inheritance - Research Task
```typescript
// Parent: research-coordinator  
parentMatrix = {
  coreTools: { read: true, write: false, webSearch: true },
  fileSystem: { readPatterns: ["/workspace/**"], writePatterns: [] },
  network: { enabled: true, allowedDomains: ["*.edu", "arxiv.org"] }
}

// Child request: literature-scanner
childRequest = {
  coreTools: { read: true, webSearch: true },
  fileSystem: { readPatterns: ["/workspace/papers/**"] },
  network: { enabled: true, allowedDomains: ["arxiv.org"] }
}

// Validation process:
1. Core tools: ✓ read≤read, webSearch≤webSearch, write not requested  
2. File patterns: ✓ "/workspace/papers/**" ⊆ "/workspace/**"
3. Network: ✓ "arxiv.org" ⊆ ["*.edu", "arxiv.org"]

// Result: PASS - child is proper subset
```

### Example 2: Escalation Violation - Unauthorized Write
```typescript
// Parent: data-processor
parentMatrix = {
  coreTools: { read: true, write: false, edit: false },
  fileSystem: { readPatterns: ["/data/**"], denyPatterns: ["/data/secrets/**"] }
}

// Child request: file-modifier  
childRequest = {
  coreTools: { read: true, write: true },  // ❌ VIOLATION
  fileSystem: { readPatterns: ["/data/**"] }  // ❌ Missing denial
}

// Validation process:
1. Core tools: ✗ child.write=true > parent.write=false → VIOLATION
2. File patterns: ✗ child missing "/data/secrets/**" denial → VIOLATION

// Result: FAIL  
violations = [
  { category: "coreTools", field: "write", message: "Child requests write but parent forbids" },
  { category: "fileSystem", field: "denyPatterns", message: "Child must inherit secrets denial" }
]

// Auto-fix suggestion:
suggestedChild = {
  coreTools: { read: true, write: false },
  fileSystem: { readPatterns: ["/data/**"], denyPatterns: ["/data/secrets/**"] }
}
```

### Example 3: Pattern Overlap Edge Case - Ambiguous Scope
```typescript
// Parent: web-crawler
parentMatrix = {
  network: { enabled: true, allowedDomains: ["*.research.org", "api.*.com"] }
}

// Child request: domain-scanner
childRequest = {
  network: { allowedDomains: ["sub.research.org", "api.data.com", "api.unknown.net"] }
}

// Validation process:
1. "sub.research.org" vs "*.research.org" → ✓ clear subset
2. "api.data.com" vs "api.*.com" → ✓ matches pattern  
3. "api.unknown.net" vs patterns → ✗ "net" ≠ "com" → VIOLATION

// Trade-off analysis:
Option A: Strict reject → blocks legitimate "api.unknown.net" if parent meant "api.*.*"
Option B: Permissive allow → risks domain escalation

// Decision: Fail safe - reject ambiguous, suggest clarification
Result: FAIL + suggestion to make parent pattern explicit ["api.*.com", "api.*.net"]
```

## QUALITY GATES

- [ ] All child core tool permissions have corresponding parent permission (no tool escalation)
- [ ] All child file patterns are proper subsets of parent patterns (no path escalation)  
- [ ] Child inherits ALL parent denial patterns (no restriction bypass)
- [ ] Network domains pass subset validation with proper wildcard expansion
- [ ] Bash patterns validated as regex subsets with sandbox inheritance
- [ ] MCP tools in child.allowed exist in parent.allowed (no external tool escalation)
- [ ] Model access restricted to parent's allowed models subset
- [ ] Validation result includes specific violation details for debugging
- [ ] Generated suggestions provide actionable fixes for each violation
- [ ] Performance under 100ms for typical permission matrices (<50 patterns)

## NOT-FOR BOUNDARIES

**This skill validates permissions but does NOT:**
- **Runtime enforcement** → Use `dag-scope-enforcer` for blocking unauthorized actions
- **Permission granting** → Use `dag-authorization-manager` for escalating agent permissions  
- **Isolation management** → Use `dag-isolation-manager` for container/sandbox boundaries
- **Policy creation** → Use `dag-policy-manager` for defining organizational permission rules
- **Audit logging** → Use `dag-execution-tracer` for recording permission violations
- **User authentication** → Use identity providers for user-level permissions

**When to delegate:**
- Runtime violations detected → `dag-scope-enforcer.enforce()`
- Parent needs broader permissions → `dag-authorization-manager.elevate()`  
- Container security needed → `dag-isolation-manager.isolate()`
- New policy rules required → `dag-policy-manager.define()`