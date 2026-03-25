# From Novice to Expert: How Intelligent Systems Should Develop Capability Over Time

## The Dreyfus Model and What It Means for Agent Development

Klein, Orasanu and Connolly, Cosgrave, and Dreyfus and Dreyfus (1986) converge on a description of expertise that is fundamentally different from what we might naively expect. Njå and Rake synthesize this view:

**"An expert is a person who generally knows what needs to be done based on mature and practised understanding. An expert's skill has become so much a part of him that he does not need to be more aware of it than of his own body. When things proceed normally, experts are not actively solving problems or making decisions; they are intuitively doing what normally works."**

This is a striking picture. The expert is not a person who deliberates better, reasons more carefully, or has access to more decision rules than the novice. The expert's defining characteristic is that *conscious deliberation has become unnecessary for the vast majority of situations they encounter*. The knowledge has been internalized to the point where it executes automatically.

But this description also contains an important qualification:

**"Whilst most expert performance is ongoing and nonreflective, when time permits and outcomes are crucial, an expert will deliberate before acting. This deliberation does not require calculative problem solving, but rather involves critically reflecting on one's intuition."**

The expert is not always in automatic mode. They have the capacity to step back and critically examine their intuitive response — to ask "Is my intuition right here?" — and to do this without defaulting to the slow, calculative KB mode. Expert deliberation is *reflective* rather than *calculative*. It is checking the intuition, not replacing it.

This two-mode picture of expertise — automatic intuitive action in familiar situations, reflective checking in high-stakes or ambiguous situations — is the target state for any intelligent agent system that must operate in complex, dynamic environments.

## The Novice-Expert Distinction in Practice

The paper identifies a specific empirical finding from fire ground commander research that concretely illustrates the novice-expert distinction:

**"The experts showed a higher tendency to deliberate over situations and novices deliberated more on alternative options."**

This is counterintuitive. One might expect novices to deliberate less (being less capable of sophisticated reasoning) and experts to deliberate more (having more sophisticated reasoning available). But the finding is the opposite: novices deliberate *about which option to choose*, while experts deliberate *about whether their situation assessment is correct*.

This distinction maps precisely onto the Rasmussen SB/RB/KB framework:
- Novices operate primarily at KB level even in routine situations, because they lack the compiled patterns to handle situations at SB or RB level. Their deliberation is about option selection.
- Experts operate at SB/RB level in routine situations. Their deliberation, when it occurs, is meta-level — checking whether the situation actually belongs to the category they've classified it into.

The novice's problem is not that they make bad choices from the options they're considering. It is that they spend cognitive resources on option selection that the expert spends on situation assessment. And because situation assessment is the more fundamental problem — a correct situation assessment with good-enough option selection beats an incorrect situation assessment with optimal option selection — the expert's allocation of cognitive resources is superior.

## The Generalization-Discrimination Balance

One of the most practically important concepts in Njå and Rake's analysis is the balance between generalization and discrimination:

**"Personnel must be able to recognise typical signs (cues, characteristics) of the situations and respond with determined behaviour. The personnel must also be able to evaluate the consequences of their own behaviour and recognise whether it is effective or not."**

**"Discrimination is the opposite of generalisation. The personnel must be able to distinguish between situations that require different behaviour. The balance between discrimination and generalisation represents emergency management's philosophy regarding the behaviour flexibility of their emergency response organisations."**

*Generalization*: Applying the same response to all situations that share critical features, even when they differ in non-critical features. A fire in a residential building of type A and a fire in a residential building of type B may share enough features that the same tactical template applies — the experienced commander generalizes across the superficial differences.

*Discrimination*: Recognizing that apparently similar situations actually require different responses because of critical distinguishing features. A fire in a building with known occupants and a fire in an empty building look similar but require different priority allocation.

The expert must do both. Over-generalization means applying the same response to situations that actually require different handling. Under-generalization means treating every situation as unique and reinventing the response from scratch.

For agent systems, this balance maps to the fundamental tension in machine learning between underfitting (over-generalization, treating too many situations as the same type) and overfitting (under-generalization, treating slightly different situations as fundamentally different types requiring unique handling).

**The practical implication**: Agent capability assessment should evaluate both generalization ability (can the agent correctly handle novel instances of familiar situation types?) and discrimination ability (can the agent correctly distinguish situations that look similar but require different responses?). A system that generalizes well but discriminates poorly will confidently apply the wrong template to cases that are superficially similar but critically different. A system that discriminates well but generalizes poorly will treat familiar situations as novel, wasting KB resources on routine cases.

## The Quality Problem: What Makes a Good Decision?

Njå and Rake raise a pointed critique of NDM research that has direct implications for agent evaluation:

**"Yates (2001) raised questions about NDM researchers' lack of distinction between good and bad decisions. The issue is that experienced decision makers, whoever they might be, make better decisions in concurrence with the RPD model. On the other hand, a bad decision could very well be a result of people actually 'knowing too few facts that really matter and too many about things that don't.'"**

This critique is fundamental. The NDM framework shows that experienced decision makers use recognition-primed decision making. But this doesn't mean all recognition-primed decisions are good. An experienced decision maker with incorrect or incomplete pattern knowledge will make fast, confident, consistently wrong decisions. The speed and confidence are features of the recognition-primed mode; the accuracy is a function of the quality of the underlying knowledge.

This means expertise has two components that must both be evaluated:
1. **Process expertise**: Does the agent use appropriate decision processes — situation assessment, pattern recognition, mental simulation, feedback integration?
2. **Content expertise**: Is the agent's knowledge base accurate, complete, and appropriately calibrated?

An agent with strong process expertise but poor content expertise will apply expert-like decision processes to reach wrong conclusions quickly and confidently. An agent with strong content expertise but poor process expertise will have the right knowledge but apply it inefficiently or incorrectly.

The most dangerous failure mode is an agent with high process expertise confidence and poor content expertise — it will produce rapid, confident, well-reasoned-sounding wrong answers, and it will be the hardest to catch because the form of its outputs will appear expert-like.

**For WinDAGs**: Skill evaluation must assess both process quality (Is the skill following sound reasoning procedures?) and content quality (Is the knowledge the skill is drawing on accurate and appropriately current?). High process quality scores do not guarantee high content quality. Both must be independently assessed.

## Building Toward Expert Performance: The Learning Architecture

Rasmussen's framework implies a specific learning trajectory: KB → RB → SB. Novel situations handled through KB reasoning, when they produce good outcomes, provide the raw material for RB rule formation. RB rules that prove reliably applicable across many situations become SB patterns.

For agent systems, this suggests a learning architecture with three phases:

**Phase 1 — KB Phase (Novel Situation Handling)**:
- All genuinely novel situations are handled through first-principles KB reasoning
- KB reasoning processes are fully logged with decision points, information considered, alternatives examined, and conclusion rationale
- Outcomes are tracked against predictions

**Phase 2 — RB Rule Induction**:
- When a cluster of KB-handled situations shares a common pattern (similar features → similar successful response), induce an explicit RB rule
- The induced rule captures the situation classification criteria and the associated response
- Rules are tested prospectively on new cases before being added to the active RB layer

**Phase 3 — SB Pattern Formation**:
- When an RB rule has been validated across many cases with high reliability, it can be promoted to SB-equivalent automated response
- SB-level responses require no deliberation; they execute automatically on matching situation recognition
- SB patterns are monitored for context drift — cases where the situation features that triggered the SB pattern have changed in ways that invalidate the underlying logic

**The critical safety constraint**: Promotion from KB to RB to SB should be conservative. The cost of incorrectly promoting a KB response to SB level is high — the system will make confident, rapid, wrong decisions in situations that actually required deliberation. False promotion is more dangerous than false retention. It is always better to be overly conservative in promoting patterns and waste some KB resources than to be overly aggressive and embed wrong patterns into the automatic response layer.

## The Leadership Paradox: Why Crisis Performance Differs From Routine Performance

Flin's (2001) analysis of the Piper Alpha disaster, cited by Njå and Rake, produces a finding with profound implications:

**"Leadership in routine situations may not predict leadership ability for crisis management."**

This is striking. The skills that make someone an effective leader in normal conditions — maintaining organizational order, managing routine complexity, executing established procedures, coordinating normal operations — are not the same skills that make someone effective in a major crisis. Crisis leadership requires situation assessment under extreme uncertainty, rapid decision making with incomplete information, willingness to violate established procedures when they are inapplicable, and maintaining cognitive clarity under intense emotional stress.

Worse: the patterns of behavior that work well in routine situations can actively impede crisis performance. The manager who succeeds by following procedures carefully will be impeded by their commitment to procedure when the crisis requires improvisation. The manager who succeeds by centralized control will create a bottleneck when the crisis demands distributed rapid response.

**Agent system translation**: An agent system tuned for routine performance may actually be misconfigured for crisis performance. The optimizations that improve routine performance — aggressive caching, pattern matching, automated execution, centralized coordination — can become liabilities in novel, high-stakes situations that require deliberation, novelty detection, and distributed authority.

This is a fundamental argument for building *mode-switching* into agent systems. The system should be capable of detecting when it is in routine mode versus crisis mode, and adjusting its operating parameters accordingly:
- Routine mode: aggressive pattern matching, automated execution, centralized coordination, fast throughput
- Crisis mode: conservative pattern matching with explicit anomaly checking, KB-level deliberation, distributed authority, slower throughput with higher verification

The failure to implement mode switching means the system will be optimized for one mode and vulnerable in the other. Given that crises are precisely when performance matters most, the failure to perform well in crisis mode is the more costly misconfiguration.