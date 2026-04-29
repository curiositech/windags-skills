# Building Theory-Driven Agent Capability Taxonomies: Lessons from CTA Classification Research

## The Current State of Agent Skill Libraries

Most multi-agent orchestration systems with large skill libraries (100+) face a version of the same problem that CTA researchers faced in the 1990s: many different methods (skills) with overlapping names, unclear distinctions, no principled basis for choosing among them, and no systematic understanding of which skills produce which types of outputs.

The CTA literature evolved through exactly this problem over thirty years. The lessons it learned — both about the failure modes and about what genuine taxonomic progress requires — provide a direct guide for building skill libraries that scale intelligently.

---

## How Classification Systems Fail: The CTA History as Warning

Over 100 CTA methods were identified and classified under at least a dozen different schemes. Each scheme provided partial guidance but failed to solve the core practical problem: "there remain no clear guidelines for the practitioner to choose the appropriate combination of methods to apply to a specific task or intended results" (Cooke, 1994, p. 804, as cited in Yates, p. 7).

The failure patterns:

**Mechanism-based classification**: Early schemes organized methods by what they looked like (observation, interview, process tracing). This answered the question "how does this method work?" but not "when should I use this method?" The mechanic of a tool and its appropriate application are different questions.

**Domain-specific classification**: Methods were often classified within the context of a particular application (expert systems, human factors, instructional design). A classification valid for expert systems development might not transfer to instructional design. Practitioners working across domains had no portable guidance.

**Theory-neutral classification**: By refusing to commit to cognitive theory, classification schemes remained permanently descriptive. "Interviews are used for elicitation" is not a theoretical claim and generates no predictions. It merely names.

**Proliferation without reduction**: Each time a new application context was encountered or a new research group became involved, new methods were named. Without a unifying theory that could collapse distinctions, the category count only grew.

The result: "it is difficult to consolidate the literature around one methodological theme" (Yates, p. 25). A practitioner approaching the field found not a toolkit with instructions, but a warehouse with unlabeled contents.

---

## What Taxonomic Success Looks Like: The Hempelian Standard Applied

A well-functioning taxonomy, under Hempel's standard:

1. **Provides a common vocabulary** that enables communication across contexts and accumulation of findings
2. **Supports integration** of findings from disparate sources under a common framework
3. **Facilitates theory development** by revealing relationships that generate testable predictions
4. **Reduces categories** over time as theory identifies underlying unities

The periodic table is the paradigm case: 92 naturally occurring elements organized by atomic number and electron configuration. This organization reveals patterns (periodicity, valence, reactivity families) that could not be seen in a list-based classification. It generates predictions (undiscovered elements with specific properties) and has been progressively refined rather than expanded without bound.

Bloom's taxonomy of educational objectives is a closer analog: six categories of cognitive complexity (remember, understand, apply, analyze, evaluate, create), organized by the type of cognitive activity required. It generates predictions about instructional design and assessment that have been empirically validated across decades of research.

Yates proposes that Anderson's ACT-R cognitive architecture could serve as the organizing theory for a genuinely taxonomic CTA classification: "Based on existing theories of cognition that are well-developed and articulated, a taxonomy of CTA methods and cognition could possibly achieve the desired reduction in taxonomic categories, while providing clearly explicated guidelines for conducting the CTA enterprise" (p. 30-31).

---

## Applying Hempelian Standards to Agent Skill Libraries

**Test 1: Common Vocabulary**

Can a skill in this library be described in terms that would be understood the same way by any agent or system in the ecosystem? Or does "debugging" mean something different in the context of Skill #47 than in the context of Skill #112?

Taxonomic vocabulary requires that names be instances of theoretical categories, not descriptive labels. "Use/Process skill for software systems" is taxonomic. "Debugging" is descriptive. The former generates predictions (this skill will perform classification operations, produce diagnoses, require sequential reasoning); the latter does not.

**Test 2: Integration Support**

Can findings from one skill's performance be applied to another skill of the same type? If Skill A and Skill B are both Use/Process skills for different domains, should we expect their performance patterns to be similar? Their failure modes to be similar? Their validation requirements to be similar?

A taxonomy that supports integration allows lessons learned from one skill to transfer systematically to others of the same type. A typology does not.

**Test 3: Theory-Derived Predictions**

Does the classification generate predictions about skill behavior that can be tested? "Skills that perform Use/Procedure operations will require ordered sequential execution and will fail when steps are performed out of order" is a testable prediction. "Debugging skills debug code" is not.

**Test 4: Category Reduction**

Is the category count shrinking over time as theory identifies underlying unities, or growing over time as new applications generate new labels? In most agent skill libraries, the count only grows. This is the DSM failure mode.

---

## A Candidate Theoretical Framework for Skill Classification

Based on Merrill's Performance-Content Matrix (adapted with Clark modifications, as described in Yates p. 38-39), a theory-driven skill taxonomy could organize skills on two dimensions:

**Performance Dimension**:
- **Remember/Retrieve**: Search knowledge base and return information
- **Classify**: Apply conceptual categories to novel instances
- **Troubleshoot**: Diagnose failures in systems with known structure
- **Create-Instance**: Apply principles to generate new examples
- **Execute-Procedure**: Perform ordered steps to accomplish a transformation

**Content Dimension**:
- **Fact** (arbitrary associations — names, codes, specific instances)
- **Concept** (class memberships with shared attributes)
- **Process** (stage sequences describing how systems work)
- **Principle** (cause-effect relationships)
- **Procedure** (ordered steps for goal accomplishment)

The cross-product of these dimensions yields 25 cells, each representing a distinct type of cognitive operation. Not all cells will be populated in any given skill library, but the framework provides a principled basis for classification.

**Predicted properties from this framework**:

| Cell | Expected Input | Expected Output | Failure Mode |
|------|---------------|-----------------|--------------|
| Remember/Concept | Instance description | Definition or properties | Retrieval failure; outdated knowledge |
| Classify/Concept | Novel instance | Category assignment | Out-of-distribution cases; ambiguous boundaries |
| Troubleshoot/Process | Faulty system state | Diagnosis | Missing causal model; novel failure modes |
| Create/Principle | Constraints | New instance | Constraint satisfaction failure; principle misapplication |
| Execute/Procedure | Goal + target | Transformed target | Step omission; sequence error; precondition violation |

Each cell type requires different validation, different elicitation methods for specification, and different error recovery strategies. A taxonomy based on this framework would predict these properties from the skill classification alone.

---

## Practical Steps Toward Taxonomic Skill Organization

**Step 1: Audit existing skills against the performance-content matrix.**

Classify each existing skill in the library by its primary knowledge type (content dimension) and primary operation type (performance dimension). Expect to find:
- Many skills currently classified by mechanism (what they do mechanically) rather than knowledge type
- Significant overlap between skills that are actually the same type deployed in different domains
- Gaps in certain cells (typically the procedural execution cells, which are hardest to specify)

**Step 2: Identify skills that are actually the same type.**

Following Hempel, skills that are mechanisms for the same cognitive operation should be collapsed or organized as domain variants of a single skill type. "Medical diagnosis" and "software debugging" may both be Use/Process skills — differing in domain but sharing core cognitive structure.

**Step 3: Specify skills in knowledge-type terms, not just descriptive terms.**

Each skill profile should include:
- Primary knowledge operation (cell in the performance-content matrix)
- Input knowledge type (what the skill receives)
- Output knowledge type (what the skill produces)
- Domain applicability (where it has been validated)
- Sensitivity to automated knowledge (does this skill require iterative refinement? multiple input sources?)

**Step 4: Build routing logic from knowledge type, not just keyword matching.**

A routing system informed by knowledge type can ask: "Does this task require classification of a novel instance into a known category? Route to a Classify/Concept skill. Does it require troubleshooting a system with known structure? Route to a Troubleshoot/Process skill."

**Step 5: Track category reduction as a quality metric.**

If the skill library is growing without bound, that is a warning sign. A mature, theory-driven library should show periods of reduction — where multiple skills are recognized as instances of the same underlying type and collapsed. The ratio of unifications to additions is a rough measure of theoretical maturity.

---

## The First Principles Approach: A Research Agenda for Skill Libraries

Clark et al. (in press, as cited in Yates p. 79) propose applying Merrill's "first principles" approach to CTA research — identifying the active ingredients in effective CTA methods across their diverse implementations.

This approach is directly applicable to agent skill libraries:

**Identify the active ingredients in high-performing skills.** What cognitive operations make a skill effective? Strip away domain-specific content and look for structural commonalities across skills that perform well on similar task types.

**Systematically compare skill types on similar task goals.** If two skills both claim to perform Use/Process operations, compare them on the same tasks and measure which elements of each contribute to performance.

**Develop standardized protocols for skill specification.** Just as CTA research developed formal methods with standardized procedures, agent skills should be developed with standardized specification protocols that capture knowledge type, operation type, input/output characteristics, and validation methodology.

This is not a completed research program — it is a research agenda. But the CTA literature suggests it is achievable: formal methods with standardized procedures do produce more consistent and predictable results than informal methods. The same principle should apply to agent skill development.