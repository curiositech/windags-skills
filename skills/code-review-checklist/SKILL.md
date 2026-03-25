---
license: Apache-2.0
name: code-review-checklist
description: Generates comprehensive, context-aware code review checklists tailored to the specific codebase, programming language, and team standards. Analyzes PR diffs and suggests what reviewers should focus on.
category: Code Quality & Testing
tags:
  - code-review
  - quality
  - checklist
  - pr-review
  - best-practices
allowed-tools: Read, Grep, Glob
---

# Code Review Checklist Generator

Generate thorough, contextual code review checklists that route attention to highest-risk areas based on what actually changed, not generic advice.

## Decision Points: Route by Change Type

**Step 1**: Scan PR title, description, and git diff summary to classify change type
**Step 2**: Apply corresponding decision tree, checking items in priority order

```
IF New Feature:
├─ Security First: Does change touch auth, user input, or data access?
│  ├─ YES → Check input validation, auth boundaries, SQL injection vectors
│  └─ NO → Skip to API review
├─ API Surface: New public methods minimal? Could interface be smaller?
├─ Edge Cases: Test null/empty/max inputs, concurrent access, network failures
└─ Backwards Compatibility: Migration path for breaking changes?

IF Bug Fix:
├─ Triage Severity: Critical (security/data loss) vs Normal vs Cosmetic
│  ├─ CRITICAL → Verify fix addresses root cause, add regression test
│  ├─ NORMAL → Check blast radius, search for similar patterns
│  └─ COSMETIC → Ensure fix doesn't introduce complexity
├─ Root Cause: Comment explains WHY bug occurred, not just what changed
└─ Test Coverage: Regression test fails on old code, passes on new

IF Refactoring:
├─ Behavior Preservation Check: Do existing tests pass unmodified?
│  ├─ YES → Focus on performance implications
│  └─ NO → Require explanation for each test change
├─ No Feature Smuggling: Are behavior changes documented/intentional?
├─ Incremental Safety: Could split into smaller PRs to reduce risk?
└─ Performance Impact: New allocations, DB calls, or O(n) changes?

IF Dependencies:
├─ Version Jump Size: Patch vs Minor vs Major update
│  ├─ MAJOR → Read breaking changes, check for API usage
│  ├─ MINOR → Verify new features don't auto-enable unsafely
│  └─ PATCH → Quick security scan, verify lockfile consistency
├─ Security Focus: Does update address CVE? Check for new vulnerabilities
└─ Bundle Impact: Frontend deps - check bundle size growth

IF Config/Infrastructure:
├─ Secret Exposure: Scan for API keys, passwords, tokens in plain text
├─ Rollback Safety: Can revert without data loss or downtime?
├─ Environment Consistency: Does change work across dev/staging/prod?
└─ Deployment Dependencies: Required manual steps documented?
```

## Failure Modes

### Rubber Stamp Review
- **Detection**: Approval under 2 minutes on 500+ line PR, no substantive comments, generic "LGTM"
- **Root Cause**: Social pressure to not block, review fatigue, didn't actually read code
- **Fix**: Require one substantive comment per 100 lines changed OR explicit "trivial change" justification

### Logic Blindness
- **Detection**: 10+ style/format comments, zero comments on correctness, error handling, or edge cases
- **Root Cause**: Style issues are cognitively cheap to spot, logic bugs require understanding control flow
- **Fix**: Automate style checks, explicitly ignore formatting in review, focus first pass on "what breaks if this runs twice?"

### Authorization Gap Miss  
- **Detection**: Approved endpoint/route changes without checking permission boundaries or user access controls
- **Root Cause**: No systematic scan for auth implications when request handlers change
- **Fix**: For any route/handler change, trace: "Who can call this? What must they prove? What data can they access?"

### Test Theater Approval
- **Detection**: Approved based on test file existence without verifying tests actually validate the changed behavior
- **Root Cause**: Treating tests as documentation rather than executable specifications
- **Fix**: For each new/modified test, ask: "Does this fail on the old code? What specific behavior does it prove works?"

### Scope Creep Review
- **Detection**: Reviewer requests unrelated features: "while you're here, also refactor X" or "can you add Y feature too?"
- **Root Cause**: Conflating code review with design session, treating PR as infinitely expandable
- **Fix**: File unrelated suggestions as separate issues, evaluate PR strictly against its stated scope

## Worked Examples

### Example 1: SQL Injection in User Search

**PR**: "Add advanced user search with role filtering"
**Files**: `routes/users.js`, `services/userSearch.js`, `test/search.test.js`

**Decision Tree Application**:
1. **Change Type**: New Feature → Check security first
2. **Security Scan**: Route accepts user input → Examine query construction
3. **Code Analysis**: `userSearch.js` line 23: `SELECT * FROM users WHERE name LIKE '%${req.query.name}%'`
4. **Vulnerability Found**: Direct string interpolation in SQL query

**What Novice Misses**:
- Tests exist and pass ✓
- Feature works as described ✓  
- Code follows style guide ✓
- **Misses**: SQL injection vector in search parameter

**Expert Catches**:
- String interpolation `${req.query.name}` allows injection
- Test inputs are benign ("john", "admin") - missing malicious cases
- No input sanitization before query construction
- **Action**: Block with "SQL injection risk - use parameterized queries. Add test with injection payload."

### Example 2: Race Condition in Payment Flow

**PR**: "Remove transaction wrapper for better performance"  
**Files**: `services/payment.js` - removes database transaction

**Decision Tree Application**:
1. **Change Type**: Refactoring → Check behavior preservation
2. **Test Analysis**: Existing tests still pass → Dig deeper into what changed
3. **Code Diff**: Removed `db.transaction()` wrapper around payment operations
4. **Race Condition**: Status update and balance deduction now separate operations

**What Novice Misses**:
- Fewer lines of code ✓
- Tests still pass ✓
- Performance improvement mentioned ✓
- **Misses**: Atomicity requirement for financial operations

**Expert Catches**:
- Transaction removal breaks ACID properties
- Crash between operations leaves inconsistent state
- Tests don't cover partial failure scenarios  
- **Action**: Block with "Removing transaction creates race condition. Payment could be marked complete without balance deduction."

## Quality Gates

Mark review complete only when ALL conditions verified:

- [ ] Every changed file examined (not just GitHub diff preview)
- [ ] Security implications assessed for any user input, auth, or data access changes
- [ ] Test coverage verified: new code paths tested, modified paths have updated tests
- [ ] At least one substantive logic/correctness comment per 100 lines OR explicit "trivial" justification
- [ ] All blocking issues resolved (no outstanding "request changes" items)
- [ ] Can explain PR purpose and technical approach to uninvolved teammate
- [ ] For data operations: authorization verified, audit logging confirmed
- [ ] For schema changes: migration tested, rollback plan documented  
- [ ] For API changes: backwards compatibility confirmed or breaking change explicitly noted
- [ ] Non-trivial changes tested locally (not just code reading)

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- High-level architecture discussions - use `system-design` skill instead
- Performance optimization strategies - use `performance-optimization` skill  
- Comprehensive security threat modeling - use `security-review` skill
- Code style/formatting enforcement - use automated linting tools
- Technology selection decisions - use `technical-decision-making` skill

**Delegate when**:
- PR introduces new architectural patterns → `system-design`
- Performance issues beyond obvious inefficiencies → `performance-optimization`
- Security changes affecting authentication/authorization systems → `security-review`  
- Complex database migrations with data transformation → `database-design`
- Framework or technology stack changes → `technical-decision-making`