# Capability Search and Partial Matching: How Agents Find What They Need

## The Discovery Problem

In a multi-agent system with many specialized capabilities, the hardest problem is often not "can this agent do this task?" but "which agent among the hundreds available is best suited to this task?" Naive approaches enumerate all agents and test each one. That doesn't scale. Keyword search misses semantic equivalences. Exact matching fails when capabilities evolve.

FIPA's DF search mechanism, specified in Sections 4.1 and 6.2.4, defines a principled approach to capability discovery based on *partial template matching*: you describe what you need in as much or as little detail as you have, and the directory returns all agents whose advertised capabilities are a superset of what you specified.

## The Matching Semantics: Partial Templates

The core matching rule (Section 6.2.4.1):

> "A registered object matches an object template if: 1. The class name of the object (that is, the object type) is the same as the class name of the object description template, and, 2. Each parameter of the object template is matched by a parameter of the object description."

The critical phrase is "each parameter of the *template* is matched by a parameter of the *object*" — not the other way around. The template specifies *constraints*, not a complete description. A registered agent description with *more* parameters than the template still matches. Only agents with *fewer* specified parameters than the template (i.e., missing something you required) fail to match.

This is subset matching: the template defines a minimum requirement set. Any agent whose description is a superset of the template matches.

For sets specifically: "a set matches a set template if each element of the set template is matched by an element of the set." This means if you ask for agents that support ontology {`code-review`}, you'll get agents that support {`code-review`}, agents that support {`code-review`, `security-audit`}, and agents that support {`code-review`, `refactoring`, `documentation`} — all of them, because all of them include `code-review`.

For sequences: a sequence template is matched if the template's elements appear in order within the full sequence (it need not be a complete match — it's a subsequence match with gaps allowed).

## Why Partial Matching Is the Right Default

Partial matching is the right default for capability discovery because of an asymmetry in knowledge: the *searcher* knows what they need, but the *provider* may offer far more than just what is needed. If the searcher had to specify the provider's full description to match, capability search would require complete foreknowledge of providers — defeating its purpose.

Consider: you need an agent that can perform security auditing on Python code. You don't know whether the security auditing agent also does JavaScript, also supports SAST, also speaks multiple ontologies. You only know what *you* need. Partial matching lets you express just that: "give me agents with `security-audit` in their service type and `Python` in their properties." You get back all agents that satisfy those constraints, regardless of their other capabilities.

## The Example from Section 6.2.4.2

FIPA provides a detailed matching example that is worth studying carefully. A fully-specified `df-agent-description` for `CameraProxy1@foo.com` includes:
- Name, addresses
- Two services: `description-delivery-1` (type `description-delivery`, ontology `Traffic-Surveillance-Domain`, properties: `camera-id=camera1`, `baud-rate=1MHz`) and `agent-feedback-information-1`
- Protocols: `FIPA-Request`, `FIPA-Query`
- Ontologies: `Traffic-Surveillance-Domain`, `FIPA-Agent-Management`
- Languages: `FIPA-SL`

The search template omits most of this. It specifies only:
- One service (partial): type `description-delivery`, ontology `Traffic-Surveillance-Domain`, property `camera-id=camera1`, language `FIPA-SL` or `FIPA-SL1`
- No name, no protocol constraints, no agent-level ontology constraints

> "Notice that several parameters of the df-agent-description were omitted in the df-agent-description template. Furthermore, not all elements of set-valued parameters of the df-agent-description were specified and, when the elements of a set were themselves descriptions, the corresponding object description templates are also partial descriptions." (Section 6.2.4.2)

The match succeeds because:
- The registered agent has a service of type `description-delivery` ✓
- That service includes ontology `Traffic-Surveillance-Domain` in its ontology set ✓
- That service includes property `camera-id=camera1` in its property set ✓
- That service includes `FIPA-SL` in its language set (template requested `FIPA-SL` or `FIPA-SL1`, set matching finds `FIPA-SL`) ✓

The registered agent has more properties than the template requires (also has `baud-rate=1MHz`, also has a second service, etc.) — but those *additional* attributes don't cause a mismatch. They're simply ignored by the template.

## Federated Search: Scaling Discovery Across Platforms

Section 4.1.3 specifies how search can extend beyond a single DF:

> "The DF encompasses a search mechanism that searches first locally and then extends the search to other DFs, if allowed. The default search mechanism is assumed to be a depth-first search across DFs."

DFs federate by registering with each other with the service type `fipa-df`. When a search arrives at a DF, it:
1. Searches its local registry
2. If federated DFs are known and the search constraints allow, propagates the search to them

Search propagation is controlled by constraints (Section 6.1.4):
- **`max-depth`**: Maximum number of federation hops. Prevents infinite loops and runaway searches.
- **`max-results`**: Maximum number of matching descriptions to return. Allows early termination once enough candidates are found.

Depth-first traversal with `max-depth` control is the FIPA default, but the federation topology can encode any search strategy. A star topology (one central DF that knows all local DFs) gives breadth-first-like behavior if the central DF propagates in parallel.

## Application to WinDAGs Skill Discovery

### The Skill Template Query

When a WinDAGs orchestrator needs to decompose a task and find appropriate skills for each step, it should express what each step *requires* as a partial template and send that to the Skill Directory. The template specifies:

- **Service type**: What category of skill is needed (e.g., `code-analysis`, `security-audit`, `test-generation`)
- **Ontologies/schemas supported**: What data representation the skill must understand (e.g., `Python-AST-v3`, `OWASP-CWE-2023`)
- **Properties**: Specific capability attributes (e.g., `language=Python`, `framework=Django`, `severity-levels=critical,high`)
- **Interaction protocols**: How the skill communicates (e.g., `streaming-results`, `batch-processing`)
- **Languages**: What content languages the skill speaks

The search returns all skills whose capabilities are a superset of the template. The orchestrator then selects among candidates based on secondary criteria (performance history, load, trust level, specialization depth).

### Avoiding Over-Specification

A common mistake in skill routing is over-specifying the template to the point where no agents match. If an orchestrator asks for a skill that is type `security-audit`, speaks `OWASP-CWE-2023` *and* `NIST-SP-800-53` *and* `ISO-27001`, and has properties `language=Python`, `framework=Django`, `severity-levels=critical,high,medium,low`, and supports `streaming-results` — there may be no skill that matches all of these simultaneously.

The partial matching model encourages specifying the *minimum necessary constraints*. Ask for what you truly require; let the directory handle what's available. If you get back multiple matches, your selection logic can prefer more specialized matches. If you get back zero matches, you know the constraint set is too tight and can relax it systematically.

### Hierarchical Capability Decomposition

Federated DFs in FIPA suggest a hierarchical skill discovery model for large WinDAGs deployments:

- **Local skill registries**: Each team or domain maintains a registry of their skills
- **Domain DF**: Aggregates registries within a domain (e.g., "code quality skills," "security skills," "data processing skills")
- **Platform DF**: Aggregates domain DFs

When an orchestrator needs a skill, it queries the local registry first (fastest, most specific). If not found, it propagates to the domain DF. If still not found, it propagates to the platform DF. The `max-depth` constraint controls how far the search propagates, and `max-results` ensures the query terminates once enough candidates are found.

This mirrors the FIPA depth-first federated search exactly. The depth control is important in WinDAGs because propagating a complex search query across all skill registries on every task step would create a performance problem.

### Dynamic Capability Registration

Skills in WinDAGs should be able to dynamically update their DF registration as their capabilities evolve. When a code review skill adds support for a new framework, it sends a `modify` to the Skill Directory with the updated service description. The directory accepts the modification, and from that point forward, searches for that framework's capabilities will find this skill.

This dynamic registration capability is what makes the DF model superior to static routing tables: the registry reflects current reality, not a snapshot from deployment time.

### The Non-Guarantee of DF Results

A crucial point from Section 4.1.1 must be preserved in WinDAGs:

> "The DF cannot guarantee the validity or accuracy of the information that has been registered with it."

Skills self-report their capabilities. The directory cannot verify them. Therefore:
- Orchestrators must treat DF results as *candidate* matches, not *verified* matches
- The actual invocation attempt is the verification
- Failed invocations should be fed back to the routing layer: if a skill returned `unsupported-function` (I don't actually support this), the skill's DF registration may be stale and should be refreshed or the skill deregistered

### Implementing the Matching Semantics

The FIPA matching algorithm is worth implementing directly in the WinDAGs skill directory, because it provides exactly the semantics needed: subsumption-based capability matching with partial templates. The recursive sequence matching and the subset-based set matching are both implementable as straightforward algorithms.

For performance, the skill directory should index by service type first (the most discriminating filter in most searches), then filter by ontologies, then by properties. This matches the natural query pattern: you almost always know what *type* of service you need, and then want to refine by specific capabilities.

## Search Constraints as Efficiency Tools

The `search-constraints` object (Section 6.1.4) with `max-depth` and `max-results` is worth implementing in WinDAGs skill search for efficiency:

- **`max-results`**: If you need just one skill for a task step, setting `max-results=1` allows the directory to stop searching after the first match. No need to enumerate all possibilities.
- **`max-depth`**: If you know the capability is available locally, setting `max-depth=0` prevents unnecessary federated search.

For orchestrators doing fast path routing (finding the obvious skill for a simple task), `max-results=1, max-depth=0` gives a fast local lookup. For orchestrators doing comprehensive capability surveys (are there any skills that could handle this unusual task?), `max-depth=unlimited, max-results=100` gives breadth at the cost of latency.

## Caveats

**Semantic equivalence is not handled**: The FIPA matching semantics are purely syntactic — string equality for names and values. There's no inference that `security-audit` and `vulnerability-scanning` are related. A more sophisticated WinDAGs implementation might add ontology-based subsumption reasoning on top of the FIPA model.

**Performance with many registered agents**: Partial matching against hundreds of registered service descriptions can be slow if done naively. Inverted indexes, pre-computed capability clusters, and embedding-based semantic search are all reasonable extensions to the FIPA model for large-scale deployments.

**Circular federation**: Federated DF searches can loop if DFs are mutually registered. The `max-depth` constraint prevents infinite loops but may still visit the same DF multiple times in a tangled federation graph. Implementations should track visited DFs and skip already-visited ones.

## Summary

FIPA's capability search mechanism uses partial template matching (subset semantics for sets, subsequence semantics for sequences) to find agents whose capabilities are a superset of what you need. Federated search extends this across multiple directories with depth and result count controls. For WinDAGs, this translates to: define skill capabilities as structured service descriptions, query with partial templates expressing minimum requirements, use federation for large-scale skill ecosystems, and always treat results as candidates requiring verification at invocation time.