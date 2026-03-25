# Failure Modes in Knowledge Elicitation: What This Book Teaches About Going Wrong

## The Nature of Elicitation Failures

Knowledge elicitation fails in predictable ways. ACTA's development and evaluation revealed systematic failure modes that agent systems face when attempting to learn from experts, extract knowledge from documentation, or construct reasoning from examples.

## Surface-Level Capture: Mistaking Procedure for Cognition

**The Failure Mode**: Interviewer asks expert "How do you diagnose network failures?" Expert responds "I check the logs, then I test connectivity, then I examine configuration." Interviewer records this as complete description of expertise.

**What's Missing**: The procedural description omits all cognitive work:
- How does the expert know WHICH log entries matter? (pattern recognition)
- What does "test connectivity" mean when tests give ambiguous results? (interpretation)
- What makes expert examine configuration versus hardware versus software? (situation assessment)

The evaluation study found novice interviewers often captured behavioral descriptions that were accurate but superficial. Even when trying to get cognitive information, without understanding what cognition looks like, they accepted procedural descriptions.

**For Agent Systems**: 

This is exactly how many agent capabilities are currently specified: "Agent will retrieve relevant documents, extract key information, and formulate response." But:
- How does agent determine document relevance? (What patterns indicate relevance?)
- What makes information "key"? (What distinguishes signal from noise?)
- What makes a response well-formulated? (What structure and content define quality?)

Without explicit attention to the cognitive dimensions, agent specifications describe behavior without capturing the intelligence that makes behavior effective.

**The ACTA Counter**: Knowledge Audit probes force attention to cognitive dimensions explicitly:
- "What do you notice that others might miss?" (perceptual skills)
- "How do you know something's wrong?" (anomaly detection)  
- "What makes this hard for novices?" (surfaces the tacit knowledge)

For agent design: Specifications must include not just "what the agent does" but "how the agent determines what to do"—the pattern recognition, situation assessment, and judgment processes.

## Expert Articulation Failure: The Curse of Automaticity

**The Failure Mode**: Experts perform skills so automatically that they cannot articulate them. Asked "How do you know the building is about to collapse?", expert responds "I just know" or "Years of experience."

**What's Happening**: Expert cognition has become proceduralized—the perceptual cues that trigger assessment happen below conscious awareness. The expert genuinely doesn't know how they know.

**The ACTA Counter**: 

Simulation Interview works around this by presenting a scenario and asking "What are you noticing HERE?" Rather than asking for abstract articulation of skill, the concrete situation triggers the automatic processes, which the expert can then report.

"What made you think the building might collapse in this scenario?"  
"I noticed the roofline sagging, heard those creaking sounds, and this type of construction typically fails suddenly after 20 minutes."

The specific context makes tacit cues reportable.

**For Agent Systems**:

When learning from expert demonstrations (imitation learning, inverse reinforcement learning), the same problem exists: expert behavior is observable, but the perceptual cues and assessments driving behavior are hidden.

Solution parallels ACTA: Don't just observe behavior, query about specific situations:
- What were you noticing at THIS moment?
- What made you choose THIS action rather than THAT one?
- What would have changed your mind?

This transforms passive observation into active interrogation of situated reasoning.

## Novice Perspective Bias: Asking the Wrong Questions

**The Failure Mode**: Interviewer asks questions that make sense from novice perspective but miss expert concerns.

Example: Interviewer asks firefighter "What's the first thing you do when you arrive?" Expert responds "Size up the situation." Interviewer asks "How long does that take?" Expert: "Maybe 30 seconds." Interviewer records: "Step 1: Size up situation (30 seconds)."

**What's Wrong**: The interviewer is thinking procedurally (what are the steps? how long do they take?). The expert is thinking cognitively (what information do I need to integrate? what patterns am I recognizing?).

Questions about duration and sequence miss the cognitive work of the size-up.

**The ACTA Counter**: Knowledge Audit categories are derived from expertise research, not task structure. This forces interviewer to ask about:
- Mental simulation (past and future)
- Situation awareness (big picture)
- Pattern recognition (noticing)

These categories reflect how experts actually think, not how task procedure is organized.

**For Agent Systems**:

When designing agent capabilities, starting from "what are the steps?" leads to procedural agents that can execute predefined sequences but not handle novel variations.

Starting from "what patterns must be recognized?" and "what judgments must be made?" leads to agents with cognitive capabilities that can be composed flexibly.

The architecture question isn't "what's the workflow?" but "what types of reasoning are required?" (pattern matching, causal inference, planning under uncertainty, etc.)

## Accepting Abstract Generalization: Missing the Concrete

**The Failure Mode**: Expert says "You need good situation awareness" or "Experience teaches you what to look for." Interviewer records this as a finding.

**What's Missing**: Abstract statements don't contain transferable knowledge. A novice reading "you need good situation awareness" gains nothing actionable.

**The ACTA Counter**: Force concreteness through examples:
- "Can you tell me about a specific time when your situation awareness made a difference?"
- "What specific things were you aware of in that situation?"
- "What would someone with poor situation awareness have missed?"

The example grounds the abstraction in observables that can be taught.

**For Agent Systems**:

When extracting knowledge from documents or experts, abstract statements are common: "The system should be robust" or "The agent should consider context."

These are placeholders, not specifications. System design requires operationalizing:
- What specific inputs constitute "context"?
- What specific behaviors demonstrate "robustness"?
- What specific failures should be prevented?

Agent development must push past abstraction to concrete: Given this input, what specifically should happen? When this type of situation occurs, what specifically should be considered?

## The Disagreement Problem: Treating Conflict as Noise

**The Failure Mode**: Three experts give different answers to the same question. Analyst averages them, picks the most common answer, or throws out "outliers."

**What's Really Happening**: 

Experts may disagree legitimately because:
- They have experience in different subdomains (different ship types, different building types)
- They use different strategies that are equally valid
- They emphasize different aspects based on what went wrong in their experience
- They're at different expertise levels (journeyman vs. master)

Treating this as noise loses valuable information.

**The ACTA Solution**: Cognitive Demands Table makes disagreement explicit. Rather than hiding it:

```
Cues and Strategies:
- Expert A: "Check logs chronologically"
- Expert B: "Sample logs at key intervals"  
- Expert C: "Start with most recent and work backward"
```

This shows alternative valid approaches rather than forcing false consensus.

**For Agent Systems**:

When learning from multiple experts or multiple demonstration datasets, disagreement is often treated as noise to be averaged out. This loses the information that:
- Multiple valid strategies exist
- Strategy selection depends on context
- Experts adapt approach based on situation specifics

Better approach: 
- Learn multiple strategies
- Learn meta-reasoning about when each applies
- Allow agent to switch strategies based on situation assessment

Multi-agent systems naturally fit this: different agents using different strategies, with meta-agent deciding which to invoke for current situation.

## Confusing Correlation with Understanding: The Surface Pattern Problem

**The Failure Mode**: System learns "when X occurs, do Y" from examples, without understanding WHY that works.

Classic example: Medical diagnosis system learned that patients with pneumonia should be sent home if they have asthma (because training data showed asthma patients had better outcomes). Reality: asthma patients went directly to ICU, received aggressive treatment, and thus had better outcomes. The system learned a spurious correlation and would have killed patients by sending them home.

**The ACTA Protection**: "Why Difficult" and "Common Errors" columns surface the causal reasoning:

```
Difficult Element: Determining collapse risk
Why Difficult: Visual cues are subtle; requires understanding how fire degrades structural members
Common Errors: Novices focus only on visible damage, missing the time-temperature relationship
Cues and Strategies: Integrate building age, construction type, fire duration, and current conditions
```

This makes explicit that the judgment isn't "if condition X then collapse risk high" but rather "understanding how fire affects this type of structure over this duration."

**For Agent Systems**:

Current ML systems excel at finding correlations but struggle with causal understanding. When agents must explain decisions or handle situations where correlations break down (distribution shift, adversarial input, novel contexts), correlation-based learning fails.

ACTA's emphasis on "why difficult" and expert reasoning process points toward:
- Extracting causal models from expert explanations
- Training agents on reasoning traces, not just input-output pairs
- Building agents that can articulate why a strategy works, not just that it works

For agent orchestration: A meta-agent deciding "should I route this to Agent A or Agent B?" needs to understand WHY each agent's approach works, so it can assess which applies to the current situation.

## The Interviewer Variability Problem: Method Reliability

**The Failure Mode**: Two interviewers talking to the same expert produce different results because they probe differently, interpret responses differently, or focus on different aspects.

**The ACTA Approach**: 

The evaluation study explicitly tested whether different interviewers using ACTA would generate similar information. Findings:

- All ACTA users identified the same major cognitive demand categories (situation analysis, information collection, planning)
- Specific examples varied (different stories from different experts)
- But types of cues, nature of difficulty, classes of errors were consistent

The structure provided by Knowledge Audit categories and Cognitive Demands Table format created sufficient standardization while allowing flexibility.

**For Agent Systems**:

When multiple developers build agent capabilities, consistency is critical:
- Different agents handling similar tasks should use compatible abstractions
- Coordination between agents requires shared vocabulary
- Meta-reasoning about agent capabilities requires comparable specifications

ACTA suggests: Provide structured framework for capability specification (analogous to Knowledge Audit categories) while allowing domain-specific instantiation (analogous to specific examples being different).

For instance: All "anomaly detection" capabilities might be specified with:
- What constitutes "normal" in this domain
- What patterns signal deviations  
- What false positives to avoid
- What false negatives are dangerous

This structure ensures different developers specify capabilities comparably, enabling integration.

## The Time Pressure Problem: Premature Conclusion

**The Failure Mode**: Constrained time leads analyst to stop after one or two interviews, drawing conclusions from insufficient data.

**What's Missed**: 

- First expert may emphasize idiosyncratic aspects
- Early patterns may not replicate with additional experts
- Boundary conditions only emerge across multiple cases
- Alternative strategies surface only when you see multiple approaches

**The ACTA Guidance**: Conduct 3-5 expert interviews before drawing training/design conclusions. The Cognitive Demands Table consolidation explicitly assumes multiple interviews.

**For Agent Systems**:

When extracting knowledge for agent capabilities, the temptation is to move from one good example to implementation:
- Read one thorough documentation
- Observe one expert demonstration
- Analyze one dataset

This creates brittle agents that:
- Don't handle variation
- Miss edge cases
- Apply strategies beyond their valid context

The discipline: Multiple examples BEFORE implementation. The variation across examples reveals:
- What's essential vs. incidental
- What strategies are robust vs. context-specific
- What assumptions underlie the approach

For orchestration: Don't build routing logic from single examples of "how this expert decomposed this problem." Sample across multiple experts and multiple problems to find patterns in decomposition.

## Lessons for Agent Orchestration Systems

**Failure Mode Recognition in Agent Systems**:

The failure modes in human knowledge elicitation have direct parallels in agent learning and specification:

1. **Surface-level capture** → Specifying agent behavior without specifying intelligence
   - Mitigation: Force explicit specification of pattern recognition, situation assessment, judgment processes

2. **Automaticity curse** → Learning from expert behavior without access to expert reasoning
   - Mitigation: Query-based learning, not just observation; "why this action?" probing

3. **Novice perspective bias** → Architecting agents around procedural flow instead of cognitive demands
   - Mitigation: Start from "what types of reasoning required?" not "what's the sequence?"

4. **Abstract placeholders** → Requirements like "agent should be robust" without operationalization
   - Mitigation: Push every abstraction to concrete: "robust against WHAT? measured HOW?"

5. **Disagreement as noise** → Averaging multiple strategies instead of preserving alternatives
   - Mitigation: Multi-strategy agents with meta-reasoning about strategy selection

6. **Spurious correlation** → Learning "when X do Y" without understanding why
   - Mitigation: Require explanations; test generalization; seek causal models

7. **Interviewer variability** → Different developers creating incompatible agent specs
   - Mitigation: Structured frameworks for capability specification

8. **Premature conclusion** → Building from single example
   - Mitigation: Require multiple cases before implementation

These aren't just human problems—they're fundamental challenges in extracting and encoding expertise. Agent systems face them just as much as human interviewers do. The methodological discipline ACTA imposed on human knowledge elicitation applies equally to agent development.