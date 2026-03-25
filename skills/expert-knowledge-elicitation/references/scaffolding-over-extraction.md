# Knowledge Elicitation as Scaffolded Collaboration, Not Extraction

## The Failed Extraction Metaphor

Early expert systems work was haunted by the "knowledge extraction" metaphor—the idea that expert knowledge exists as a fixed commodity inside experts' heads, waiting to be mined, extracted, or downloaded. This metaphor shaped methodology ("knowledge acquisition tools"), defined problems ("the knowledge acquisition bottleneck"), and ultimately contributed to system failures.

Hoffman and Lintern document the empirical death of this metaphor and its replacement with a more accurate model: **knowledge elicitation as scaffolded collaborative discovery**.

## What Actually Happens in Successful Elicitation

From the chapter (p. 216): "In Concept-Mapping interviews with domain experts, experience shows that almost every time the expert will reach a point in making a Concept Map where s/he will say something like, 'Well, I've never really thought about that, or thought about it in this way, but now that you mention it...' and what follows will be a clear specification on some procedure, strategy, or aspect of subdomain knowledge that had not been articulated up to that point."

This reveals the core truth: **Knowledge isn't extracted; it's constructed in the moment of elicitation through a collaborative process between expert and elicitor.**

## The Tacit Knowledge Red Herring

The persistent claim that expert knowledge is "tacit" (inexpressible through verbal report) has been used to:
- Justify avoiding human experts ("they can't tell us what they know")
- Promote machine learning ("we'll learn from their behavior instead")
- Excuse poor elicitation results ("the knowledge must be tacit")

Hoffman and Lintern's position, backed by decades of empirical work: **"It has never been demonstrated that there exists such a thing as 'knowledge that cannot be verbalized in principle'" (p. 216).**

The real issue isn't tacit knowledge but **inadequate scaffolding**. When elicitation fails, it's usually because:

1. **Insufficient structure**: Unstructured interviews ("tell me what you know") provide no cognitive hooks for the expert to organize their knowledge
2. **Wrong granularity**: Questions too abstract ("describe your general approach") or too specific ("what's the third step?") miss the natural grain of expertise
3. **Missing context**: Without concrete cases or situations, experts struggle to activate relevant knowledge
4. **Poor collaboration**: The elicitor lacks domain understanding to recognize when something important has been said

## What Makes Effective Scaffolding

### Cognitive Support Structures

**Concrete cases as anchors**: The Critical Decision Method leverages experts' detailed episodic memory for challenging cases. Rather than asking "How do you handle X in general?", it asks "Walk me through that tough case from last month." The specificity activates rich, contextualized knowledge.

**Visual externalization**: Concept Mapping provides spatial scaffolding—experts can see the emerging structure, recognize gaps ("oh, but I also need to mention..."), and refine relationships. The external representation serves as working memory extension.

**Systematic probing**: CDM probe questions ("What were you seeing?" "What were you thinking?" "What else could you have done?") provide retrieval cues that structured questioning can't match. They guide attention without prescribing content.

**Incremental building**: Multi-pass methods allow experts to start with gross structure, then refine. First pass: major concepts and relationships. Second pass: add detail, qualifications, exceptions. This matches how experts naturally organize knowledge—from general principles to specific nuances.

### Collaborative Intelligence

The elicitation process combines two types of expertise:

**Expert A (domain practitioner)**: Deep knowledge of the domain, pattern recognition, intuitive sense of what matters, but may lack meta-cognitive awareness of their own reasoning or ability to organize knowledge for others.

**Expert B (cognitive engineer)**: Understanding of knowledge representation, ability to recognize different knowledge types, skill at framing questions and probes, but lacks domain knowledge.

Successful elicitation emerges from this complementary partnership. As Hoffman notes (p. 218): "There is no substitute for the skill of the elicitor (e.g., in framing alternative suggestions and wordings)."

## Implications for Agent Systems

### For Knowledge Acquisition in AI Systems

**Traditional ML approach**: Avoid humans, learn from behavioral data, treat human knowledge as inaccessible.

**Scaffolded approach**: Design interfaces and processes that support humans in articulating what they know, treating knowledge construction as a collaborative human-AI activity.

**Example application**: Rather than having AI agents try to infer debugging strategies purely from code repositories, create scaffolded interfaces where expert debuggers construct knowledge models while solving real problems. The scaffolding might include:
- Visual representation of debugging process flows
- Prompts about decision points ("What made you check that module?")
- Automatic capture of reasoning traces with expert annotation
- Collaborative refinement where AI suggests patterns and expert validates/corrects

### For Agent-to-Agent Knowledge Sharing

When one agent needs expertise from another agent (or from a human expert), the interaction protocol should provide scaffolding:

**Poor**: Generic query ("Agent B, what do you know about X?")

**Better**: Structured query with context ("Agent B, in situation Y, when I observe signals Z, what should I consider?")

**Best**: Case-based, multi-pass elicitation where requesting agent provides concrete scenario, receiving agent walks through reasoning, requesting agent probes key decision points, iterative refinement of shared understanding.

### For Human-Agent Collaboration

When human experts interact with agent systems, the interface should scaffold knowledge transfer in both directions:

**Human → Agent**: Provide concept mapping tools, case-based explanation interfaces, decision replay with annotation capabilities. Make it easy for experts to show their thinking, not just their conclusions.

**Agent → Human**: When agents explain their reasoning, use scaffolded revelation—start with high-level strategy, allow human to probe deeper ("why that branch?" "what alternatives did you consider?"), provide concrete examples, support comparison with human reasoning patterns.

## The Practice of Scaffolded Elicitation

The chapter emphasizes (p. 218): "No matter how much detail is provided about the conduct of a knowledge-elicitation procedure, there is no substitute for practice."

Becoming an "expert apprentice" requires:
- Experience across multiple domains (to recognize patterns in expertise itself)
- Skill at rapid bootstrapping (efficiently learning enough to ask good questions)
- Sensitivity to individual differences (adapting to expert's cognitive style)
- Building trust and rapport (experts share more when comfortable)
- Recognizing significance (knowing when something important has been said)

**For agent system development**: We should treat cognitive task analysis as a core skill, not an occasional activity. Teams building intelligent systems need dedicated "expert apprentices" who specialize in eliciting and representing expert knowledge—not as a one-time project phase but as ongoing organizational capability.

## Boundary Conditions and Failure Modes

**When scaffolding fails**: 
- Expert lacks insight into their own reasoning (rare but exists)
- Domain knowledge is genuinely perceptual-motor (expert can demonstrate but not verbalize)
- Organizational barriers prevent honest disclosure (expert fears job loss, regulatory consequences)
- Insufficient time for iterative refinement (pressure for quick results)

**When to avoid verbal elicitation**:
- Skill is primarily physical (though even here, strategic knowledge can be elicited)
- Rapid, automatic perceptual judgments (supplement with contrived tasks that slow down processing)
- Knowledge truly is just behavioral patterns with no conceptual structure (rare in professional domains)

**Signs you need better scaffolding**:
- Expert frequently says "I don't know" or "I just know"
- Knowledge descriptions stay abstract and generic
- Expert can't provide concrete examples
- Elicited knowledge fails validation with other experts
- Resulting representations don't help domain novices

The key insight: When elicitation struggles, the first hypothesis should be "inadequate scaffolding," not "tacit knowledge."