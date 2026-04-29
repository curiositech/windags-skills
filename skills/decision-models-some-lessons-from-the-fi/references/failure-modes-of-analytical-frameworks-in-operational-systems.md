# Failure Modes of Analytical Frameworks in Operational Systems

## The Seduction of the Analytical Model

Analytical decision frameworks are genuinely powerful. Decision analysis, multiattribute utility analysis (MAUA), Bayesian statistics — these methods are mathematically rigorous, transparent, and in the right conditions, yield demonstrably optimal choices. Their appeal for system designers is obvious: they produce auditable, explainable decisions. They provide a common language. They can be embedded in software and applied consistently at scale.

The problem is that they rest on assumptions that are almost never satisfied in real operational environments. Klein and Calderwood identify five of these assumptions and demonstrate that each fails under operational conditions. When the assumptions fail but the framework is applied anyway, the result is not just suboptimal decisions — it is the active degradation of the practitioner's ability to use their own expertise.

This is the deepest warning in the paper: **misapplied analytical frameworks don't just fail to help; they actively interfere with competent performance.**

## The Five Failed Assumptions

### Assumption 1: Goals Can Be Isolated

Classical decision theory requires goals to be clearly specified and separable from each other. MAUA takes a goal as its anchor and works forward from there. The problem: in operational environments, goals are nested, linked to higher-order goals, and interdependent with other goals that may not yet be recognized.

Klein and Calderwood use a military example: the goal of "denying the enemy key roads" is linked to "retaining the use of those same roads for a counterattack." Optimizing for the first goal may foreclose the second. "It is risky to segment goals out of the larger context." But trying to include the larger context in a formal analysis quickly becomes unmanageable.

There is no clean solution to this. Goal isolation is not a modeling choice that can be made more carefully — it is a fundamental mismatch between the mathematical requirements of the framework and the structure of real goals in complex environments. Goals are not isolable because reality is not modular.

For agent systems, this means: **beware of systems that require complete, consistent goal specification upfront**. In complex tasks, goals will emerge, shift, and conflict during execution. An architecture that treats initial goal specification as fixed and complete will fail on tasks where the goal structure needs to evolve.

### Assumption 2: Utilities Can Be Assessed Independently of Context

MAUA requires the decision-maker to evaluate options against a standard set of evaluation dimensions that apply uniformly across all options. This sounds reasonable in the abstract. In practice, it strips away exactly the contextual sensitivity that makes expert judgment valuable.

Chess masters don't rate moves on "center control" and "kingside attack potential" — they evaluate moves in the specific context of the current board position, which has implications that no generic dimension can capture. An expert's evaluation of a tactical option in battle is not a rating on "speed" and "resource efficiency" — it is a contextual judgment about what this option means in this situation, given this enemy disposition, this terrain, this weather, these available assets.

"Expertise often enables a decision maker to sense all kinds of implications for carrying out a course of action within a specific context, and this sensitivity can be degraded by using generic and abstract evaluation dimensions."

For agent systems: **evaluation functions based on fixed, context-independent criteria will consistently miss the implications that matter most in complex situations**. Good evaluation is contextual. It asks not "how does this score on our standard dimensions?" but "what does this mean, given everything we know about this specific situation?"

### Assumption 3: Probabilities Can Be Accurately Estimated

Decision analysis requires probability estimates for the branches of the option tree. This is feasible in domains with large amounts of historical data, stable base rates, and repeating event types. It is not feasible in operational environments characterized by unique, high-stakes, one-shot events under time pressure and stress.

Klein and Calderwood note: "Probabilities are more suited for decision tasks involving repeated occurrences of randomly generated events, rather than unique 'one shot' events." The Cuban Missile Crisis did not come with a base rate. Neither does a novel cyberattack, an unprecedented equipment failure, or a complex multi-stakeholder negotiation.

Even when base rates exist, they are often not retrievable under operational conditions. And even expert probability estimates are unreliable when generated under time pressure, stress, and ambiguity. Decision analysis built on unreliable probability estimates inherits all of that unreliability — and may dress it up in false mathematical precision.

For agent systems: **uncertainty quantification methods that produce precise probability estimates for genuinely uncertain, low-base-rate events should be treated with extreme skepticism**. The precision is not a measure of accuracy; it is a measure of the model's confidence in its own assumptions. When assumptions are wrong, precise estimates are confidently wrong.

### Assumption 4: Choices, Goals, and Evidence Are Clearly Defined

Decision analysis works best with "bounded decisions" — well-specified problems with a clear choice set and defined goal. The example Klein and Calderwood give of an apparently well-bounded decision: a fireground commander with the goal of "putting the fire out." But this apparent clarity dissolves immediately: if the fire has spread too far, the goal shifts to containment. Calling for reinforcements leaves the district vulnerable to other fires. "The actual goal is to do the best job possible with the appropriate amount of resources, hardly a well-defined goal."

This is the rule, not the exception, in operational environments. The problem statement is not pre-given. It is itself a product of situation assessment. Analytical frameworks that require problem specification as input cannot be applied until after the hardest cognitive work — situation assessment — has already been done. And by that point, an experienced practitioner already knows roughly what to do.

For agent systems: **the task decomposition step is not a preprocessing step that precedes real work — it is itself a substantive cognitive task that requires domain expertise**. Systems that assume the initial problem statement is complete and well-formed will fail on exactly the tasks where they are needed most.

### Assumption 5: Utilities of Outcomes Are Independent of Each Other

To compare options analytically, their outcomes must be independently evaluable. But in complex operations, "the outcomes of different courses of action are interrelated so decision makers can't be trusted to provide useful outputs."

Taking a road to stop an enemy advance changes the conditions under which a later counterattack could use that road. Committing a reserve unit to one objective changes what's available for exploitation elsewhere. The outcomes are not independent. Analyzing them as if they were produces decisions that are locally optimal and globally incoherent.

This is the coupling problem. Complex systems are coupled — actions have consequences that propagate across components, time, and scales. Analytical frameworks built on independence assumptions systematically underestimate coupling and therefore systematically underestimate the side effects of their recommended actions.

## The Active Harm: Degrading Expert Competence

The most sobering claim in the paper is not that analytical frameworks are useless — it is that **misapplied analytical frameworks can actively degrade expert performance**. "By trying to force experienced decision makers to adjust to the needs of the prescriptive models we run the risk of degrading their ability to make use of their own experience. We can interfere with their proficiency."

This is the iatrogenic problem applied to decision support. The treatment can be worse than the disease. An FGC who has been trained to stop and enumerate options under time pressure may hesitate at exactly the moment when immediate recognition-based action is needed. A nuclear plant operator who has been taught to follow formal decision trees may fail to act on the subtle, experience-based cue that something is wrong before the formal indicators register.

In agent systems, the equivalent failure mode is: **a decision support layer that imposes analytical structure on an agent whose strength is pattern recognition may actively prevent that agent from doing what it's good at**. This argues for decision architectures that support and amplify the agent's natural mode of operation rather than imposing an alien structure.

## The Correct Use of Analytical Frameworks

Klein and Calderwood are not arguing that analytical methods are useless — they are arguing that their application must be bounded by conditions where their assumptions are actually met.

Analytical methods are appropriate when:
- The problem is genuinely well-bounded with clear, separable options
- Time is available to complete the analysis
- The decision-maker lacks domain expertise (novice context)
- Goals are genuinely specifiable and stable
- Historical data sufficient for reliable probability estimation is available
- The decision will be repeated and learning can improve the analysis over time
- The stakes are high enough that the cost of rigorous analysis is justified

"In the hands of an expert, decision analysis can be helpful in identifying factors entering into the decision, and in enabling decision makers to understand the differences in their goals and values. But expert decision analysts have also learned the boundary conditions and are careful not to push the methods beyond those boundaries."

The failure is not in the methods themselves. It is in treating them as universally applicable — in what Klein and Calderwood call "misapplying prescriptive decision models."

## Implications for Agent System Design

### Assumption Checking as a First-Class Operation

Before invoking any analytical decision framework, an agent system should explicitly check whether the framework's assumptions are satisfied:
- Are goals well-specified and separable?
- Are options clearly defined?
- Is there reliable probability data available?
- Are outcome utilities reasonably independent?
- Is there time to complete the analysis?

If the answer to several of these is "no," the system should route to a recognition-based or heuristic approach rather than forcing the analytical framework onto an ill-suited problem.

### Distinguishing Prescriptive and Descriptive Roles

Analytical frameworks can play a prescriptive role (what should we do?) or a descriptive/diagnostic role (what factors are relevant? what are our goals?). Even when the prescriptive role is inappropriate (because the assumptions aren't met), the diagnostic role may remain useful. An agent system might use analytical decomposition to identify what factors matter, then route to recognition-based evaluation for the actual decision.

### Preserving Expert Signal

When agent systems are designed to support or augment human experts, the architecture must preserve rather than override the human's recognition-based signal. A system that presents formal analytical outputs as recommendations may cause the expert to discount their own judgment in favor of the system's output — even when the system's assumptions are wrong and the expert's recognition is correct.

The safer design is: present the system's analysis as one input among many, clearly flagged with its assumptions and their likely satisfaction. Never present analytical output as a final recommendation that overrides expert judgment.