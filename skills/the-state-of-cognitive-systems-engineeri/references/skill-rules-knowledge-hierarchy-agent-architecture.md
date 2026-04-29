# Rasmussen's SRK Framework: A Hierarchy of Agent Competence

## The Three Levels at Which Intelligent Systems Operate

One of the most influential frameworks in Cognitive Systems Engineering — cited throughout the literature that Hoffman et al. build on — is Jens Rasmussen's Skills-Rules-Knowledge (SRK) taxonomy of human performance (Rasmussen, 1983, cited in Hoffman et al., 2002). Originally developed to understand how nuclear plant operators manage complex systems, the SRK framework has proven applicable across virtually every domain of skilled human performance. It is also, when properly understood, one of the most useful conceptual tools available for designing the internal architecture of AI agents and for understanding how agent systems should allocate cognitive work.

The framework identifies three distinct levels at which intelligent behavior can be generated — three different mechanisms by which a system can map situations onto actions. These levels are not stages of development or layers of a hierarchy that are traversed in sequence. They are simultaneous capacities that skilled performers use in different proportions depending on the demands of the current situation.

## Skill-Based Behavior: The Automatic Layer

Skill-based behavior (SBB) is automatic, smooth, and largely below the threshold of conscious attention. It is the behavior of the expert pianist whose fingers find the notes without deliberate instruction, of the experienced driver who navigates a familiar route without conscious route-planning, of the seasoned practitioner who recognizes and responds to routine situations without deliberate analysis.

SBB is produced by highly trained sensorimotor schemas — internal programs that generate coordinated sequences of behavior in response to specific triggering conditions. These schemas are built through extended practice with feedback: thousands of repetitions that gradually automate what initially required deliberate effort. The result is behavior that is fast, fluid, and effortless — and that consumes minimal cognitive resources, freeing conscious attention for other demands.

The critical property of SBB for agent system design is its **opacity to introspection**. When a practitioner is operating at the skill level, they cannot tell you what they are doing or why — not because they are concealing information, but because the behavior is genuinely not accessible to conscious awareness. This is why traditional knowledge elicitation methods fail to capture skill-level knowledge: there is no verbal access to it.

For AI agents, the SBB analog is the behavior that emerges from trained pattern-matching — the rapid, automatic classification of inputs into categories that trigger standard responses. This behavior is fast and efficient under conditions that match the training distribution. It is also brittle: it degrades when conditions deviate from the patterns encoded in training, and it fails silently — the agent doesn't know it's in unfamiliar territory because its pattern-matching mechanism has no internal signal for "out of distribution."

## Rule-Based Behavior: The Protocol Layer

Rule-based behavior (RBB) involves the application of stored if-then rules to recognized situations. Unlike SBB, RBB is semi-conscious: the practitioner is aware that they are applying a rule, though the rule application itself may be rapid and practiced. Unlike knowledge-based behavior, RBB does not involve reasoning from first principles — the rule is retrieved and applied, not derived.

Rules at this level have the structure: "In situation S, do action A." The key cognitive work is situation recognition: correctly identifying which situation type applies, which triggers the appropriate rule. This recognition can itself operate at the skill level (automatic, rapid, pre-conscious) or at the knowledge level (deliberate, effortful analysis of ambiguous cues).

Rule-based behavior is the predominant mode of competent performance in well-understood, frequently encountered situations. Professional pilots follow checklists — rule-governed procedures — for the vast majority of routine operations. Emergency responders apply trained protocols to the situation types their training prepared them for. The efficiency of RBB comes from not having to derive appropriate responses from scratch on each occasion: the work of deriving the response has been done once, encoded as a rule, and can be retrieved as needed.

The failure mode of RBB is **rule misapplication**: applying the right rule to the wrong situation. This happens when situation recognition fails — when a novel situation is classified as a familiar situation type that it only superficially resembles. The rule is applied competently, but to the wrong situation, producing outputs that are correct for the assumed situation and wrong for the actual one. This error type is particularly insidious because nothing in the execution signals failure: the rule was applied correctly, the output was produced correctly, the problem is entirely in the upstream classification.

For AI agent systems, RBB corresponds to the application of learned heuristics, prompt templates, and standard operating procedures. The agent recognizes a situation class and applies the corresponding procedure. This is efficient and usually correct. The design challenge is ensuring that situation recognition is robust — that agents can detect when an apparent situation type doesn't actually match the pattern, rather than confidently misclassifying novel situations as familiar ones.

## Knowledge-Based Behavior: The Reasoning Layer

Knowledge-based behavior (KBB) is deliberate, effortful reasoning from first principles. It is engaged when neither stored skills nor stored rules provide an adequate response — when the situation is genuinely novel, when things have gone wrong in unexpected ways, when the available rules give contradictory guidance, or when the stakes of error are high enough to warrant deliberate analysis rather than reliance on automatic or habitual responses.

KBB uses explicit mental models of the system or domain: internal representations of how things work, what causes what, what the functional structure of the problem is. The practitioner who is operating at the knowledge level is thinking, in a meaningful sense — constructing representations, running forward simulations, evaluating alternatives, updating beliefs in response to evidence.

KBB is slow, effortful, and error-prone compared to the other levels — not because reasoning is inherently unreliable, but because it operates under cognitive resource constraints (working memory is limited, attention is limited, time is limited) and under uncertainty (the mental model is never a perfect representation of the actual system). But KBB is also the only level at which genuinely novel situations can be handled — situations that no stored skill or rule addresses.

The critical design implication: **KBB is the layer that determines system performance in the hardest, most important cases — the cases where things have gone wrong, where the situation is unprecedented, where the stored repertoire has run out.** Systems that are excellent at the SBB and RBB levels but impoverished at the KBB level will perform well under nominal conditions and fail precisely when robust performance matters most.

## The SRK Taxonomy as Agent Architecture Blueprint

The SRK framework maps onto agent architecture in a way that has direct design implications:

**SBB layer** in an AI agent = trained encodings, embeddings, automatic pattern classifiers, rapid-response templates. This layer is the agent's perceptual and motor system — fast, automatic, high-bandwidth. Design principle: maximize coverage of the common case; build robustness to distribution shift; build anomaly detection that flags when the automatic layer is operating outside its reliable range.

**RBB layer** in an AI agent = prompted procedures, rule-based routing, protocol application, decision trees. This layer is the agent's procedural system — organized, reliable for recognized situation types, efficient within its range. Design principle: maximize rule quality and situational coverage; build explicit representation of rule applicability conditions; build detection of rule-conflict and rule-failure situations.

**KBB layer** in an AI agent = causal reasoning, first-principles analysis, model-based simulation, novel problem solving. This layer is the agent's deliberate reasoning system — slow, effortful, flexible. Design principle: invest heavily in the quality of the domain models that ground this layer; build explicit mechanisms for escalating from the RBB to the KBB layer when rules fail; provide adequate computational budget for KBB operations, which may require more time and resources than the other layers.

## The Cascade Failure Pattern

Rasmussen's SRK framework illuminates a specific failure pattern that CSE research has documented extensively: **the cascade from KBB back to RBB under stress.**

When practitioners are under time pressure, cognitive load, stress, or fatigue, they tend to retreat from KBB to RBB — from deliberate reasoning to rule application. This retreat is usually rational: KBB is slow and expensive, RBB is fast and efficient. Under pressure, the temptation to apply a familiar rule and move on is strong.

The problem is that the situations that generate the most pressure are often exactly the situations that most require KBB — novel situations, failure situations, situations where the rules are wrong. The very conditions that push practitioners toward RBB are the conditions that make RBB most likely to produce errors.

This cascade is visible in many major accident analyses. A system behaves anomalously. Practitioners, under pressure, apply the rule that seems to apply to the apparent situation type. The rule is wrong for the actual situation. The error cascades. By the time the error is recognized, it has grown beyond easy correction.

For AI agent systems, the analog is: under computational resource pressure, agents will tend to fall back on cheaper, more automatic processing — RBB and SBB — even when the situation requires KBB. This is the agent-level version of the stress-driven regression. Design must either ensure that resource constraints don't force this regression in high-stakes situations, or build in explicit detection of situations where the regression has occurred and escalate accordingly.

## Cross-Level Coordination in Multi-Agent Systems

In a multi-agent system designed with SRK awareness, different agents can be specialized for different levels of the hierarchy:

**SBB-specialized agents** handle rapid, high-bandwidth, routine classification and response tasks. They are fast and efficient but have limited flexibility. They should include explicit out-of-distribution detection and escalation mechanisms.

**RBB-specialized agents** handle protocol application, procedure execution, and rule-based routing. They require rich situation recognition capability and explicit rule coverage maps — knowledge of what situation types they can handle and what should be escalated.

**KBB-specialized agents** handle deliberate analysis, novel problem solving, and the cases that fall outside the other agents' repertoires. They are slower and more resource-intensive but provide the flexibility that the system-level performance depends on.

The orchestration challenge is routing appropriately across these levels: recognizing which level a given situation demands, routing to agents equipped for that level, escalating when a lower-level agent reaches the boundary of its competence, and integrating outputs from different levels into coherent coordinated action.

This is a complex coordination problem — but it is also one that high-performing human teams solve routinely, through developed norms about who handles what, how escalation works, and how different levels of analysis are integrated. The SRK framework provides the conceptual architecture for understanding what those norms are for and how to design them deliberately into an AI agent system.