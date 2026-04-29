---
license: Apache-2.0
name: semantic-conflict-prediction
description: |
  AST-based semantic conflict prediction for multi-agent coding environments. Uses tree-sitter to parse code into ASTs, extract symbol-level claims, build dependency graphs, and predict conflicts BEFORE they happen -- at work-assignment time, not merge time. The key insight: git's textual merge is necessary but not sufficient. Two changes can merge cleanly and break the program. This skill covers tree-sitter fundamentals, symbol-level claims, dependency graph construction, conflict prediction algorithms, and integration with Port Daddy or similar coordination daemons. NOT FOR: textual merge conflict resolution (use git skills), linting or formatting (use static analysis tools), runtime verification of invariants (use runtime-verification-for-agents), or general multi-agent orchestration (use multi-agent-coordination).
metadata:
  category: AI & Agents
  tags:
  - tree-sitter
  - AST
  - conflict-prediction
  - semantic-analysis
  - multi-agent
  - static-analysis
  - dependency-graph
  - symbol-claims
  - coordination
  pairs-with:
  - skill: multi-agent-coordination
    reason: Conflict prediction is the intelligence layer above coordination primitives
  - skill: runtime-verification-for-agents
    reason: Arbiter can enforce symbol claim consistency as a runtime invariant
  - skill: agentic-patterns
    reason: Individual agent claim behavior composes into system-wide conflict analysis
  - skill: game-theoretic-agent-incentives
    reason: Incentive design for agents to declare honest claims rather than over-claiming
---

# Semantic Conflict Prediction

**Version:** 1.0
**Domain:** Static Analysis, Agent Coordination, Conflict Prevention
**Lineage:** Port Daddy file claims (advisory), multi-agent-coordination (git worktrees), runtime-verification-for-agents (Arbiter pattern)

You are an expert in predicting semantic conflicts between concurrent code modifications using abstract syntax tree analysis. You understand tree-sitter parsing, symbol-level dependency graphs, and the gap between "git merge succeeds" and "program still works." Your goal: detect conflicting intent at work-assignment time so agents never produce changes that merge clean and break the build.

---

## When to Use This Skill

Load this skill when:

- Multiple agents will modify the same codebase and you need to partition work safely
- You need to go beyond file-level claims to symbol-level claims (function, class, method)
- You are building or extending a coordination daemon with conflict detection
- You need to construct a dependency graph across a codebase to understand blast radius
- You are designing an Arbiter invariant for SymbolClaimConsistency
- You need to analyze whether two proposed changes are semantically compatible
- You are implementing tree-sitter parsing for code intelligence in an agent system

Do NOT load this skill for:

- **Textual merge conflict resolution** -- that is git's job; this skill prevents the conflicts git cannot see
- **Linting or code formatting** -- use ESLint, Prettier, or language-specific tools
- **Runtime invariant monitoring** -- use runtime-verification-for-agents
- **General multi-agent orchestration** -- use multi-agent-coordination
- **Refactoring automation** -- tree-sitter is a tool here, not the goal

---

## The Problem: Semantic Conflicts That Git Cannot See

Git merges at the text level. It answers: "Can these two diffs be applied to the same file without overlapping lines?" This is necessary but catastrophically insufficient.

### The Canonical Example

```
Agent A modifies server.ts:
  - Renames parameter `createRoutes(app, db)` to `createRoutes(app, { db, cache })`

Agent B modifies app.ts:
  - Adds call `createRoutes(expressApp, database)`
```

Git sees two different files. Merge succeeds. TypeScript compilation fails. In a dynamic language, the failure is silent -- `db` is now `undefined` inside `createRoutes` and the error surfaces at runtime, three abstraction layers away.

### Taxonomy of Semantic Conflicts

| Conflict Type | What Happens | Git Detects? | Example |
|---|---|---|---|
| **Direct** | Same symbol modified by two agents | Sometimes (same file) | Both agents rewrite `handleAuth()` |
| **Signature** | Agent A changes a function's contract, Agent B uses the old contract | Never | Rename param, add required arg |
| **Dependency** | Agent A modifies X, Agent B reads X | Never | Agent A changes return type, Agent B destructures result |
| **Transitive** | Agent A modifies X, X used by Y, Agent B modifies Y | Never | Change in utility propagates through call chain |
| **Type-structural** | Agent A changes a type definition, Agent B creates instances of it | Never | Add required field to interface |
| **Import-path** | Agent A moves/renames a module, Agent B imports from old path | Sometimes | File rename vs import statement in different file |

**The insight:** The set of "git-clean merges that break the program" is larger than the set git catches. Semantic conflict prediction targets this gap.

---

## Tree-sitter Fundamentals

Tree-sitter is an incremental parsing library that generates concrete syntax trees. It parses source code fast enough for real-time use (~1ms per file on modern hardware) and supports 100+ languages through grammar plugins.

### Why Tree-sitter (Not Regex, Not Full Compiler)

| Approach | Speed | Accuracy | Incremental | Multi-language |
|---|---|---|---|---|
| Regex/string matching | Fast | Catastrophic (no nesting, no scope) | No | Manual per language |
| Full compiler (tsc, rustc) | Slow (seconds) | Perfect | No | One language each |
| Tree-sitter | Fast (~1ms) | Structural (no type inference) | Yes | 100+ grammars |
| Language server (LSP) | Medium | High (types + inference) | Partial | Per server |

Tree-sitter occupies the sweet spot: fast enough for real-time conflict checking, accurate enough to identify symbols and their relationships, and language-agnostic enough to work across polyglot codebases.

**Shibboleth:** If someone suggests using regex to extract function definitions, they have not internalized why structural parsing matters. `function foo(` fails on arrow functions, methods, decorators, multiline signatures, comments containing the word "function," and template literals. Tree-sitter gets it right because it parses the grammar, not the text.

### Setting Up Tree-sitter in Node.js

```bash
npm install tree-sitter tree-sitter-typescript tree-sitter-python tree-sitter-javascript
```

```typescript
import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';

const parser = new Parser();
parser.setLanguage(TypeScript.typescript);

const sourceCode = `
export function createRoutes(app: Express, db: Database): Router {
  const router = express.Router();
  router.get('/health', (req, res) => res.json({ ok: true }));
  return router;
}
`;

const tree = parser.parse(sourceCode);
const rootNode = tree.rootNode;
```

### Key Node Types by Language

**TypeScript/JavaScript:**
- `function_declaration` -- named function (`function foo() {}`)
- `arrow_function` -- arrow function (`const foo = () => {}`)
- `method_definition` -- class method (`class C { foo() {} }`)
- `class_declaration` -- class definition
- `variable_declarator` -- `const x = ...` (the `x = ...` part)
- `import_statement` -- `import { x } from './y'`
- `export_statement` -- `export function/class/const`
- `interface_declaration` -- `interface Foo { ... }`
- `type_alias_declaration` -- `type Foo = ...`
- `call_expression` -- function call (`foo(arg)`)
- `member_expression` -- property access (`obj.prop`)

**Python:**
- `function_definition` -- `def foo():`
- `class_definition` -- `class Foo:`
- `import_statement` -- `import x`
- `import_from_statement` -- `from x import y`
- `call` -- function call
- `attribute` -- `obj.attr`
- `decorated_definition` -- `@decorator` + function/class

### Querying with S-expressions

Tree-sitter queries use S-expression patterns to match AST nodes:

```typescript
// Find all exported function declarations with their names
const query = new Parser.Query(TypeScript.typescript, `
  (export_statement
    (function_declaration
      name: (identifier) @func_name
      parameters: (formal_parameters) @params
    )
  ) @export
`);

const matches = query.matches(tree.rootNode);
for (const match of matches) {
  const nameNode = match.captures.find(c => c.name === 'func_name');
  console.log(`Found exported function: ${nameNode.node.text}`);
}
```

```typescript
// Find all call expressions to a specific function
const callQuery = new Parser.Query(TypeScript.typescript, `
  (call_expression
    function: (identifier) @callee
    arguments: (arguments) @args
  )
`);
```

### Incremental Parsing

Tree-sitter's killer feature for conflict prediction: when code changes, you do not re-parse the entire file. You tell tree-sitter what changed and it updates the tree incrementally.

```typescript
// Initial parse
let tree = parser.parse(sourceCode);

// Code was edited: characters 50-60 were replaced with new text
tree.edit({
  startIndex: 50,
  oldEndIndex: 60,
  newEndIndex: 65,
  startPosition: { row: 3, column: 10 },
  oldEndPosition: { row: 3, column: 20 },
  newEndPosition: { row: 3, column: 25 },
});

// Re-parse using old tree -- only changed subtrees are re-parsed
tree = parser.parse(newSourceCode, tree);
```

This matters because conflict prediction runs on every claim. If parsing took 500ms per file, the system would be unusable. At ~1ms incremental, it is invisible.

---

## Symbol-Level Claims

### The Granularity Hierarchy

```
File                    Too coarse: blocks entire file from other agents
  Class                 Good for large refactors, too coarse for method work
    Method/Function     Sweet spot: most agent work is at this level
      Statement         Too fine: agents rarely claim individual statements
        Expression      Noise: generates false positive conflicts constantly
```

**Decision framework:** Claim at the method/function level by default. Escalate to class level when the agent is restructuring a class (adding/removing methods, changing inheritance). Escalate to file level only when the agent is rewriting the module's public API (changing exports, reorganizing structure).

**Anti-pattern: Over-claiming.** An agent that claims the entire file "because it might need to change anything" defeats the purpose of granular claims. Over-claiming is the coordination equivalent of a global mutex -- it serializes all work.

**Anti-pattern: Under-claiming.** An agent that claims only the function it modifies but not the functions it calls is hiding dependencies. If it changes `validateInput()` and three other functions call `validateInput()`, those callers are implicit dependencies.

### Claim Types

```typescript
interface SymbolClaim {
  file: string;           // Relative path: 'src/server.ts'
  symbolPath: string[];   // Hierarchical: ['createRoutes'] or ['UserService', 'authenticate']
  claimType: 'modify' | 'read' | 'add-sibling' | 'add-child' | 'delete' | 'rename';
  agentId: string;
  sessionId: string;
  confidence: number;     // 0.0-1.0: how certain is the agent it needs this?
  timestamp: number;
}
```

**Claim types explained:**

| Type | Meaning | Example |
|---|---|---|
| `modify` | Will change the body or signature of this symbol | Rewriting a function's implementation |
| `read` | Depends on this symbol remaining stable | Calls this function, extends this class |
| `add-sibling` | Will add a new symbol at the same level | Adding a new method to a class, new export to a module |
| `add-child` | Will add a new symbol inside this one | Adding a statement inside a function |
| `delete` | Will remove this symbol | Removing a deprecated function |
| `rename` | Will change this symbol's name | Renaming a function, class, or variable |

**`rename` is the most dangerous claim type.** A rename affects every reference site across the entire codebase. It is an implicit read-claim on every file that imports or uses the symbol.

### Extracting Symbol Paths from Tree-sitter

```typescript
function extractSymbols(rootNode: Parser.SyntaxNode, filePath: string): Symbol[] {
  const symbols: Symbol[] = [];

  function walk(node: Parser.SyntaxNode, parentPath: string[]) {
    const symbolTypes = [
      'function_declaration',
      'method_definition',
      'class_declaration',
      'interface_declaration',
      'type_alias_declaration',
      'enum_declaration',
    ];

    if (symbolTypes.includes(node.type)) {
      const nameNode = node.childForFieldName('name');
      if (nameNode) {
        const symbolPath = [...parentPath, nameNode.text];
        symbols.push({
          file: filePath,
          symbolPath,
          type: node.type,
          startLine: node.startPosition.row,
          endLine: node.endPosition.row,
          exported: isExported(node),
          parameters: extractParameters(node),
          returnType: extractReturnType(node),
        });

        // Recurse into children (e.g., methods inside classes)
        for (const child of node.children) {
          walk(child, symbolPath);
        }
        return; // Don't double-walk children
      }
    }

    // Non-symbol nodes: recurse normally
    for (const child of node.children) {
      walk(child, parentPath);
    }
  }

  walk(rootNode, []);
  return symbols;
}

// Handle variable declarations that are actually function expressions
function extractVariableSymbols(rootNode: Parser.SyntaxNode, filePath: string): Symbol[] {
  const query = new Parser.Query(language, `
    (variable_declarator
      name: (identifier) @name
      value: [(arrow_function) (function_expression)] @value
    )
  `);

  return query.matches(rootNode).map(match => {
    const nameNode = match.captures.find(c => c.name === 'name')!.node;
    return {
      file: filePath,
      symbolPath: [nameNode.text],
      type: 'function_expression',
      startLine: nameNode.startPosition.row,
      endLine: match.captures.find(c => c.name === 'value')!.node.endPosition.row,
      exported: isExported(nameNode.parent!.parent!),
    };
  });
}
```

**Shibboleth:** If someone's symbol extractor does not handle arrow functions assigned to `const`, it will miss half the functions in a modern TypeScript codebase. `const handler = async (req, res) => { ... }` is a function declaration in everything but AST node type.

---

## Dependency Graph Construction

The dependency graph answers: "If I change symbol X, what else might break?"

### Graph Structure

```typescript
interface DependencyGraph {
  nodes: Map<string, SymbolNode>;  // key: 'file.ts::ClassName.methodName'
  edges: Map<string, DependencyEdge[]>;
}

interface SymbolNode {
  id: string;              // 'src/server.ts::createRoutes'
  file: string;
  symbolPath: string[];
  type: 'function' | 'class' | 'method' | 'interface' | 'type' | 'variable';
  exported: boolean;
  signature?: string;      // For functions: parameter types + return type
}

interface DependencyEdge {
  from: string;   // Symbol that depends
  to: string;     // Symbol being depended on
  type: 'calls' | 'imports' | 'extends' | 'implements' | 'references' | 'instantiates';
  weight: number; // 1.0 for direct, 0.5 for conditional, 0.1 for dynamic
}
```

### Building the Graph Incrementally

Full-project analysis on every claim is too expensive. Instead, build the graph lazily:

```
Agent claims symbol X in file F
  |
  +-- Parse file F (if not cached) -- ~1ms
  |
  +-- Extract symbols from F
  |
  +-- Find references TO X in already-parsed files
  |     (check import graph: which files import from F?)
  |
  +-- Find references FROM X to other symbols
  |     (parse X's body for call expressions)
  |
  +-- Update dependency graph with new edges
  |
  +-- Check claim against graph -- conflict prediction
```

### Import/Export Tracking

```typescript
function extractImports(rootNode: Parser.SyntaxNode, filePath: string): ImportInfo[] {
  const query = new Parser.Query(language, `
    (import_statement
      source: (string) @source
    ) @import
  `);

  return query.matches(rootNode).map(match => {
    const sourceNode = match.captures.find(c => c.name === 'source')!.node;
    const importNode = match.captures.find(c => c.name === 'import')!.node;

    // Extract named imports
    const namedQuery = new Parser.Query(language, `
      (import_specifier
        name: (identifier) @imported
        alias: (identifier)? @alias
      )
    `);

    const names = namedQuery.matches(importNode).map(m => ({
      imported: m.captures.find(c => c.name === 'imported')!.node.text,
      alias: m.captures.find(c => c.name === 'alias')?.node.text,
    }));

    return {
      file: filePath,
      source: resolveImportPath(filePath, sourceNode.text),
      namedImports: names,
      isDefault: importNode.text.includes('import ') && !importNode.text.includes('{'),
      isNamespace: importNode.text.includes('* as'),
    };
  });
}
```

### Call Graph Construction

```typescript
function extractCallsFromFunction(
  funcNode: Parser.SyntaxNode,
  containingSymbol: string
): CallEdge[] {
  const edges: CallEdge[] = [];

  const callQuery = new Parser.Query(language, `
    (call_expression
      function: [
        (identifier) @direct_call
        (member_expression
          object: (identifier) @object
          property: (property_identifier) @method
        )
      ]
      arguments: (arguments) @args
    )
  `);

  const matches = callQuery.matches(funcNode);
  for (const match of matches) {
    const directCall = match.captures.find(c => c.name === 'direct_call');
    const object = match.captures.find(c => c.name === 'object');
    const method = match.captures.find(c => c.name === 'method');
    const args = match.captures.find(c => c.name === 'args')!;

    if (directCall) {
      edges.push({
        from: containingSymbol,
        to: directCall.node.text,
        type: 'calls',
        argCount: countArguments(args.node),
        weight: isInsideConditional(directCall.node) ? 0.5 : 1.0,
      });
    } else if (object && method) {
      edges.push({
        from: containingSymbol,
        to: `${object.node.text}.${method.node.text}`,
        type: 'calls',
        argCount: countArguments(args.node),
        weight: isInsideConditional(object.node) ? 0.5 : 1.0,
      });
    }
  }

  return edges;
}
```

### Type Dependency Tracking

```typescript
function extractTypeDependencies(rootNode: Parser.SyntaxNode): TypeEdge[] {
  const edges: TypeEdge[] = [];

  // Find class extensions
  const extendsQuery = new Parser.Query(language, `
    (class_declaration
      name: (type_identifier) @class_name
      (class_heritage
        (extends_clause
          value: (identifier) @parent_class
        )
      )
    )
  `);

  // Find interface implementations
  const implementsQuery = new Parser.Query(language, `
    (class_declaration
      name: (type_identifier) @class_name
      (class_heritage
        (implements_clause
          (type_identifier) @interface_name
        )
      )
    )
  `);

  // Find type references in parameter types, return types, variable types
  const typeRefQuery = new Parser.Query(language, `
    (type_identifier) @type_ref
  `);

  // ... build edges from matches
  return edges;
}
```

---

## Conflict Prediction Algorithm

Given two sets of claims from two agents, predict whether their work will conflict.

### Decision Tree: Is This a Conflict?

```
Agent A claims symbol X with type T_A
Agent B claims symbol Y with type T_B
|
+-- Are X and Y the same symbol?
|   |
|   +-- YES --> DIRECT CONFLICT
|   |   |
|   |   +-- Both 'modify'? --> BLOCKING: incompatible parallel writes
|   |   +-- One 'modify', one 'read'? --> WARNING: reader may break
|   |   +-- One 'delete', any other? --> BLOCKING: can't use deleted symbol
|   |   +-- One 'rename', any other? --> BLOCKING: name changes break all refs
|   |   +-- Both 'add-sibling'? --> SAFE: siblings don't conflict
|   |   +-- Both 'read'? --> SAFE: concurrent reads are fine
|   |
|   +-- NO --> Does X depend on Y or Y depend on X?
|       |
|       +-- YES --> DEPENDENCY CONFLICT
|       |   |
|       |   +-- Direct edge (X calls Y)? --> severity: HIGH
|       |   +-- Transitive (X -> ... -> Y)? --> severity: MEDIUM (distance 2)
|       |   +-- Transitive (distance 3+)? --> severity: LOW
|       |   |
|       |   +-- Is the dependency through a STABLE interface?
|       |       +-- YES (public API, versioned) --> Downgrade severity one level
|       |       +-- NO (internal, no contract) --> Keep severity
|       |
|       +-- NO --> Are X and Y in the same file?
|           |
|           +-- YES --> INFO: possible textual merge conflict
|           +-- NO  --> SAFE: independent symbols in independent files
```

### The Conflict Matrix

When two claims land on the same symbol, the conflict depends on claim types:

```
              Agent B's Claim
              modify  read   add-sib  add-child  delete  rename
A modify      BLOCK   WARN   SAFE     WARN       BLOCK   BLOCK
A read        WARN    SAFE   SAFE     SAFE       BLOCK   BLOCK
A add-sib     SAFE    SAFE   SAFE     SAFE       WARN    WARN
A add-child   WARN    SAFE   SAFE     WARN       BLOCK   BLOCK
A delete      BLOCK   BLOCK  WARN     BLOCK      BLOCK   BLOCK
A rename      BLOCK   BLOCK  WARN     BLOCK      BLOCK   BLOCK
```

**Reading the matrix:** Find Agent A's claim type in the left column, Agent B's in the top row. The intersection is the conflict severity.

- **BLOCK:** These claims are incompatible. Agents must coordinate or serialize.
- **WARN:** These claims might conflict depending on specifics. Agents should be aware.
- **SAFE:** These claims are compatible. No coordination needed.

### Confidence Scoring

Not all predicted conflicts are equally likely to manifest. Score them:

```typescript
interface ConflictPrediction {
  agentA: string;
  agentB: string;
  symbolA: string;
  symbolB: string;
  conflictType: 'direct' | 'dependency' | 'transitive' | 'signature' | 'type-structural';
  severity: 'blocking' | 'warning' | 'info';
  confidence: number;  // 0.0 - 1.0
  explanation: string;
  suggestedResolution: string;
}

function scoreConfidence(conflict: RawConflict): number {
  let score = 1.0;

  // Direct conflicts are certain
  if (conflict.type === 'direct') return 1.0;

  // Dependency distance reduces confidence
  if (conflict.type === 'transitive') {
    score *= Math.pow(0.6, conflict.pathLength - 1);
    // distance 2: 0.6, distance 3: 0.36, distance 4: 0.22
  }

  // Conditional dependencies are less certain
  if (conflict.edgeWeight < 1.0) {
    score *= conflict.edgeWeight;
  }

  // Exported/public symbols are more likely to cause real conflicts
  if (conflict.symbolExported) {
    score *= 1.0;  // no discount
  } else {
    score *= 0.7;  // internal symbols might be refactored away
  }

  // Cross-file dependencies are higher signal than same-file
  if (conflict.crossFile) {
    score *= 1.0;  // cross-file = harder to notice manually
  } else {
    score *= 0.8;  // same-file = agent might handle it
  }

  return Math.max(0.05, Math.min(1.0, score));
}
```

### The Full Prediction Pipeline

```typescript
function predictConflicts(
  claimsA: SymbolClaim[],
  claimsB: SymbolClaim[],
  graph: DependencyGraph
): ConflictPrediction[] {
  const predictions: ConflictPrediction[] = [];

  for (const a of claimsA) {
    for (const b of claimsB) {
      const aId = symbolId(a);
      const bId = symbolId(b);

      // Check 1: Direct conflict (same symbol)
      if (aId === bId) {
        const severity = CONFLICT_MATRIX[a.claimType][b.claimType];
        if (severity !== 'safe') {
          predictions.push({
            agentA: a.agentId,
            agentB: b.agentId,
            symbolA: aId,
            symbolB: bId,
            conflictType: 'direct',
            severity,
            confidence: 1.0,
            explanation: `Both agents claim ${aId}: ${a.claimType} vs ${b.claimType}`,
            suggestedResolution: severity === 'blocking'
              ? `Serialize: one agent must complete before the other starts`
              : `Coordinate: agents should communicate about changes to ${aId}`,
          });
        }
        continue;
      }

      // Check 2: Dependency conflict
      const pathAtoB = findShortestPath(graph, aId, bId);
      const pathBtoA = findShortestPath(graph, bId, aId);
      const path = pathAtoB ?? pathBtoA;

      if (path && path.length <= 4) {
        const isModifyRead =
          (a.claimType === 'modify' && b.claimType === 'read') ||
          (b.claimType === 'modify' && a.claimType === 'read');

        const severity = path.length === 1 ? 'warning' : 'info';
        const confidence = scoreConfidence({
          type: path.length === 1 ? 'dependency' : 'transitive',
          pathLength: path.length,
          edgeWeight: path.reduce((w, e) => w * e.weight, 1.0),
          symbolExported: graph.nodes.get(aId)?.exported ?? false,
          crossFile: a.file !== b.file,
        });

        if (confidence > 0.2) {
          predictions.push({
            agentA: a.agentId,
            agentB: b.agentId,
            symbolA: aId,
            symbolB: bId,
            conflictType: path.length === 1 ? 'dependency' : 'transitive',
            severity,
            confidence,
            explanation: `${aId} ${a.claimType} -> ${path.map(e => e.to).join(' -> ')} <- ${bId} ${b.claimType}`,
            suggestedResolution: isModifyRead
              ? `Agent modifying ${aId} should notify agent reading it before changing the contract`
              : `Low-confidence transitive dependency. Monitor but do not block.`,
          });
        }
      }

      // Check 3: Signature conflict
      if (a.claimType === 'modify' && b.claimType !== 'modify') {
        const callers = graph.edges.get(aId)?.filter(e => e.type === 'calls') ?? [];
        const bCallsA = callers.some(e => e.from === bId);
        if (bCallsA) {
          predictions.push({
            agentA: a.agentId,
            agentB: b.agentId,
            symbolA: aId,
            symbolB: bId,
            conflictType: 'signature',
            severity: 'warning',
            confidence: 0.8,
            explanation: `Agent A may change the signature of ${aId}, which Agent B calls from ${bId}`,
            suggestedResolution: `Agent A: if changing ${aId}'s signature, add backward-compatible overload or notify Agent B`,
          });
        }
      }
    }
  }

  // Sort by severity (blocking first) then confidence (highest first)
  return predictions.sort((a, b) => {
    const severityOrder = { blocking: 0, warning: 1, info: 2 };
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return b.confidence - a.confidence;
  });
}
```

---

## Integration with Port Daddy

Port Daddy currently supports file-level claims (`POST /sessions/:id/files`). Symbol-level claims extend this with richer semantics.

### Proposed API: Symbol Claims

```
POST /sessions/:id/symbols
Content-Type: application/json

{
  "claims": [
    {
      "file": "src/server.ts",
      "symbolPath": ["createRoutes"],
      "claimType": "modify"
    },
    {
      "file": "src/routes/index.ts",
      "symbolPath": ["registerRoutes"],
      "claimType": "read"
    }
  ]
}

Response 200:
{
  "claimed": 2,
  "conflicts": [
    {
      "conflictType": "dependency",
      "severity": "warning",
      "confidence": 0.75,
      "otherAgent": "agent-xyz",
      "otherSession": "session-456",
      "symbol": "src/routes/index.ts::registerRoutes",
      "explanation": "Agent 'agent-xyz' has a modify claim on registerRoutes, which you declared a read dependency on",
      "suggestedResolution": "Coordinate with agent-xyz: your read depends on their modification"
    }
  ]
}

Response 409 (blocking conflict):
{
  "claimed": 0,
  "conflicts": [
    {
      "conflictType": "direct",
      "severity": "blocking",
      "confidence": 1.0,
      "otherAgent": "agent-abc",
      "otherSession": "session-789",
      "symbol": "src/server.ts::createRoutes",
      "explanation": "Agent 'agent-abc' already has a modify claim on createRoutes",
      "suggestedResolution": "Wait for agent-abc to complete, or negotiate via pub/sub channel 'symbol-conflicts'"
    }
  ]
}
```

### Arbiter Invariant: SymbolClaimConsistency

```
SymbolClaimConsistency:
  For all pairs of active sessions (S1, S2) where S1 != S2:
    For all symbol claims (C1 in S1, C2 in S2):
      If C1.symbol == C2.symbol:
        CONFLICT_MATRIX[C1.claimType][C2.claimType] != 'blocking'

Violation triggers: Alert + optional session pause for blocking conflicts
Check strategy: Synchronous on every POST /sessions/:id/symbols
```

### CLI Integration

```bash
# Claim symbols for your session
pd session symbols claim $SESSION_ID \
  --file src/server.ts --symbol createRoutes --type modify \
  --file src/routes/index.ts --symbol registerRoutes --type read

# Check for conflicts without claiming
pd session symbols check $SESSION_ID \
  --file src/server.ts --symbol createRoutes --type modify

# List all symbol claims across active sessions
pd session symbols list --active

# Show dependency graph for a symbol
pd symbols deps src/server.ts::createRoutes --depth 3
```

### Integration Architecture

```
Agent declares intent ("I will modify createRoutes")
  |
  +-- CLI / SDK / MCP sends POST /sessions/:id/symbols
  |
  +-- Server parses target file with tree-sitter (cached)
  |
  +-- Server resolves symbol path in AST
  |     (validates the symbol exists, extracts signature)
  |
  +-- Server checks claim against all active session claims
  |     (runs conflict prediction algorithm)
  |
  +-- Blocking conflict?
  |   +-- YES: Return 409, do not record claim
  |   +-- NO:  Record claim, return warnings if any
  |
  +-- Arbiter monitors for consistency
  |     (catches race conditions between concurrent claims)
  |
  +-- Agent completes work, calls pd done
      +-- Claims auto-released with session
```

---

## Tree-sitter Beyond Conflict Prediction

Once you have tree-sitter parsing infrastructure, it unlocks capabilities far beyond conflict detection.

### Code Search and Navigation

```typescript
// "Find all functions that take a Database parameter"
const dbParamQuery = new Parser.Query(language, `
  (function_declaration
    name: (identifier) @name
    parameters: (formal_parameters
      (required_parameter
        pattern: (identifier)
        type: (type_annotation
          (type_identifier) @param_type
        )
      )
    )
  )
`);

// Filter matches where @param_type.text === 'Database'
```

### Automated Refactoring

```typescript
// Rename a function across the codebase
function renameSymbol(
  graph: DependencyGraph,
  symbolId: string,
  newName: string
): FileEdit[] {
  const edits: FileEdit[] = [];
  const node = graph.nodes.get(symbolId);
  if (!node) throw new Error(`Symbol not found: ${symbolId}`);

  // Edit 1: The declaration itself
  edits.push({
    file: node.file,
    oldText: node.symbolPath[node.symbolPath.length - 1],
    newText: newName,
    line: node.startLine,
  });

  // Edit 2: All reference sites
  const references = findAllReferences(graph, symbolId);
  for (const ref of references) {
    edits.push({
      file: ref.file,
      oldText: node.symbolPath[node.symbolPath.length - 1],
      newText: newName,
      line: ref.line,
    });
  }

  // Edit 3: Import statements
  const importRefs = findImportReferences(graph, symbolId);
  for (const imp of importRefs) {
    edits.push({
      file: imp.file,
      oldText: node.symbolPath[node.symbolPath.length - 1],
      newText: newName,
      line: imp.line,
    });
  }

  return edits;
}
```

### Code Metrics

```typescript
function cyclomaticComplexity(funcNode: Parser.SyntaxNode): number {
  let complexity = 1; // Base path

  const branchTypes = [
    'if_statement', 'else_clause',
    'for_statement', 'for_in_statement',
    'while_statement', 'do_statement',
    'switch_case',
    'catch_clause',
    'ternary_expression',   // ? :
    'binary_expression',    // && and || (short-circuit)
  ];

  function walk(node: Parser.SyntaxNode) {
    if (branchTypes.includes(node.type)) {
      if (node.type === 'binary_expression') {
        const op = node.childForFieldName('operator');
        if (op && (op.text === '&&' || op.text === '||')) {
          complexity++;
        }
      } else {
        complexity++;
      }
    }
    for (const child of node.children) {
      walk(child);
    }
  }

  walk(funcNode);
  return complexity;
}
```

### Architecture Enforcement

```typescript
// Define allowed import rules
const architectureRules: ImportRule[] = [
  { from: 'routes/*',  canImport: ['lib/*', 'types/*'],    cannotImport: ['routes/*'] },
  { from: 'lib/*',     canImport: ['lib/*', 'types/*'],    cannotImport: ['routes/*'] },
  { from: 'types/*',   canImport: [],                      cannotImport: ['lib/*', 'routes/*'] },
];

function checkArchitectureViolations(
  imports: ImportInfo[],
  rules: ImportRule[]
): Violation[] {
  return imports.flatMap(imp => {
    const rule = rules.find(r => matchGlob(imp.file, r.from));
    if (!rule) return [];

    const forbidden = rule.cannotImport.some(p => matchGlob(imp.source, p));
    if (forbidden) {
      return [{
        file: imp.file,
        source: imp.source,
        rule: `${rule.from} cannot import from ${rule.cannotImport.join(', ')}`,
        severity: 'error',
      }];
    }
    return [];
  });
}
```

---

## Practical Limitations

### What Tree-sitter Cannot See

**Dynamic dispatch:**
```typescript
const handler = handlers[req.method]; // Which function? Unknown statically.
handler(req, res);
```
Tree-sitter sees a call to `handler` but cannot resolve which function `handlers[req.method]` points to. The dependency is invisible to static analysis.

**Mitigation:** Track the assignment (`handlers = { GET: getHandler, POST: postHandler }`) and propagate possible targets. Accept that confidence will be lower for dynamic calls.

**Reflection and metaprogramming:**
```typescript
class.prototype[methodName] = function() { ... };
Reflect.apply(target, thisArg, args);
eval(`${funcName}(${args})`);
```

**Mitigation:** None that is reliable. Flag `eval`, `Reflect`, and dynamic property assignment as "opaque zones" where conflict prediction confidence drops to zero. Alert agents that they are entering territory where static analysis provides no guarantees.

**String-based references:**
```json
// config.json
{ "handler": "src/handlers/auth.ts:handleLogin" }
```
```yaml
# docker-compose.yml
services:
  api:
    command: "node src/server.ts"
```

**Mitigation:** Maintain a registry of known config-to-code mappings. Parse common config formats (JSON, YAML, TOML) and resolve string references where patterns are known. Accept that novel config formats will be missed.

**Cross-language boundaries:**
```typescript
// TypeScript calls native addon
const { compress } = require('./native/zlib.node');
```

**Mitigation:** Treat cross-language boundaries as opaque. If an agent claims a symbol in the TypeScript layer, and the symbol's implementation is in C++, flag the cross-language dependency as low-confidence.

### Performance Characteristics

| Operation | Time | Memory | Notes |
|---|---|---|---|
| Parse single file | ~1ms | ~2x file size | Incremental after first parse |
| Parse 1000 files | ~1s | ~200MB | Parallelizable, cache results |
| Extract symbols from file | <0.5ms | Negligible | After parsing |
| Build call graph for function | <1ms | Proportional to function size | Single function scope |
| Full-project dependency graph | 2-10s | 50-500MB | Do once, update incrementally |
| Conflict check (two claim sets) | <5ms | Proportional to graph edges | With pre-built graph |
| Shortest path in graph | <1ms (BFS) | O(nodes) | Bounded depth (4) |

**Performance anti-pattern:** Rebuilding the entire dependency graph on every claim. The graph should be built once at daemon startup (or lazily on first access), then updated incrementally as files change and claims arrive.

**Performance anti-pattern:** Parsing files that have not changed since last parse. Cache parse trees keyed by `(filePath, contentHash)`. Tree-sitter trees are re-usable across queries.

### The 80/20 Rule for Conflict Prediction

You do not need perfect analysis to be useful. The goal is not "detect every possible conflict" -- it is "detect enough conflicts that agents waste less time on merge failures than they would without prediction."

In practice:
- **Direct conflicts** (same symbol, both modify): 100% detection, trivial
- **Signature conflicts** (change params, someone calls with old params): ~90% detection with tree-sitter
- **Dependency conflicts** (modify something that someone reads): ~80% detection with import + call graph
- **Transitive conflicts** (3+ hops away): ~40% detection, diminishing returns
- **Dynamic/reflection conflicts**: ~5% detection, not worth optimizing

Focus engineering effort on the first three categories. They cover the vast majority of real-world multi-agent conflicts.

---

## Decision Frameworks

### When to Add Symbol Claims to a Coordination System

```
Do you have multiple agents modifying the same codebase concurrently?
|
+-- NO --> File claims are sufficient. Do not add complexity.
|
+-- YES --> Do agents routinely produce changes that merge clean but break tests?
    |
    +-- NO --> File claims are sufficient. Your task decomposition is good enough.
    |
    +-- YES --> Are the broken merges caused by dependency violations?
        |
        +-- NO (just textual conflicts) --> Better task decomposition, not AST analysis.
        |
        +-- YES --> Symbol claims will help. How many languages?
            |
            +-- 1-2 --> Implement it. Tree-sitter grammars are available.
            +-- 3+  --> Implement for primary languages. Accept blind spots in others.
```

### Choosing Between Advisory and Enforced Claims

```
Are your agents trustworthy (won't ignore warnings)?
|
+-- YES (AI agents following instructions) --> Advisory claims with warnings
|   Agents see conflicts, adjust their approach. No hard blocks.
|   This is Port Daddy's current model.
|
+-- NO (adversarial or unreliable agents) --> Enforced claims with 409 responses
    The system blocks incompatible claims outright.
    This adds latency and can cause deadlocks if agents over-claim.
```

**The Port Daddy philosophy:** Advisory by default. The agent coordination layer should inform, not obstruct. A blocking 409 on symbol claims is appropriate only when the conflict is direct (same symbol, incompatible types) and confidence is 1.0. Everything else is a warning.

### When to Parse vs When to Trust the Claim

```
Agent says "I will modify createRoutes in server.ts"
|
+-- Does server.ts exist and is it parseable?
    |
    +-- NO --> Trust the claim as-is. Agent may be creating the file.
    |
    +-- YES --> Parse and validate.
        |
        +-- Does 'createRoutes' exist in the AST?
            |
            +-- YES --> Record with full AST metadata (line, params, exports)
            +-- NO  --> Warn agent: "Symbol 'createRoutes' not found in server.ts"
                        Record anyway (agent may intend to create it)
```

---

## Anti-Patterns

### 1. The Global Mutex
**Symptom:** Agent claims entire files instead of symbols.
**Result:** Other agents are blocked from the file even though they need different functions.
**Fix:** Require symbol-level granularity. If the agent truly needs the whole file, it should explain why.

### 2. The Silent Consumer
**Symptom:** Agent reads a function's output but does not declare a `read` claim.
**Result:** When the function changes, the silent consumer breaks with no warning.
**Fix:** Auto-detect read dependencies from call graph analysis. If Agent B's code calls a function that Agent A claims to modify, auto-generate a `read` claim for Agent B.

### 3. The Premature Optimizer
**Symptom:** Building a full Language Server Protocol integration instead of tree-sitter.
**Result:** 10x the complexity, 100x the startup time, limited to one language per server.
**Fix:** Start with tree-sitter. Upgrade to LSP only if you need type inference (and you probably do not for conflict prediction).

### 4. The Overfitter
**Symptom:** Predicting conflicts at expression granularity.
**Result:** Every agent conflicts with every other agent because they both use `console.log`.
**Fix:** Function/method granularity. Ignore leaf expressions. Filter out standard library calls.

### 5. The Graph Maximalist
**Symptom:** Computing transitive dependencies to unlimited depth.
**Result:** Every symbol "depends on" every other symbol because everything eventually traces back to `main()`.
**Fix:** Cap dependency depth at 3-4 hops. Beyond that, confidence is too low to act on.

### 6. The Config Ignorer
**Symptom:** Only analyzing source code, ignoring config files that reference source symbols.
**Result:** Agent renames a handler function. Config still references the old name. Runtime crash.
**Fix:** Parse config files (JSON, YAML, TOML) and treat string values that match symbol names as soft dependencies.

---

## Shibboleths: How to Tell if Someone Understands This Domain

**They understand:** "We parse with tree-sitter for structure, not for types. Type inference is the compiler's job -- we just need to know what calls what."

**They do not understand:** "We can use regex to find function definitions and then grep for calls." (Structural nesting, scope, and aliasing make regex unreliable for anything beyond toy examples.)

**They understand:** "A rename claim is the most dangerous claim type because it implies read-claims on every reference site across the entire codebase."

**They do not understand:** "Rename is just a modify claim on one symbol." (Renames have global blast radius.)

**They understand:** "Confidence decays exponentially with dependency distance. A transitive conflict at depth 4 has ~20% chance of manifesting. We report it but do not block on it."

**They do not understand:** "All conflicts are equally important." (Direct conflicts are certain; transitive conflicts are probabilistic.)

**They understand:** "The hard part is not the AST parsing. It is maintaining the dependency graph incrementally without re-analyzing the entire project on every change."

**They do not understand:** "Just parse all the files every time someone makes a claim." (O(project_size) per claim is unacceptable for real-time coordination.)

**They understand:** "Dynamic dispatch is the fundamental limit of static analysis. We acknowledge the blind spot and report confidence accordingly."

**They do not understand:** "Our static analysis catches everything." (It provably cannot, by Rice's theorem.)

---

## References and Further Reading

- **Tree-sitter documentation:** https://tree-sitter.github.io/tree-sitter/
- **Tree-sitter playground:** https://tree-sitter.github.io/tree-sitter/playground (interactive AST visualization)
- **node-tree-sitter:** https://github.com/tree-sitter/node-tree-sitter
- **Port Daddy:** coordination daemon that this skill extends (see `~/coding/port-daddy/`)
- **runtime-verification-for-agents:** companion skill for enforcing invariants at runtime
- **multi-agent-coordination:** companion skill for the coordination layer this builds on
- **Rice's theorem:** undecidability of non-trivial semantic properties of programs (why perfect static analysis is impossible)
- **Binkley & Harman (2004):** "A Survey of Empirical Results on Program Slicing" -- dependency analysis foundations
- **Horwitz, Reps & Binkley (1990):** "Interprocedural Slicing Using Dependence Graphs" -- the formal basis for cross-function dependency tracking
