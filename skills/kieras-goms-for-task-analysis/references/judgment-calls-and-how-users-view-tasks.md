# Judgment Calls and How Users View Tasks: Modeling the Unobservable

## The Central Problem: User Understanding Is Not Directly Observable

One of GOMS's most honest and practically important contributions is acknowledging that task analysis requires speculation about user cognition. Kieras states: "In constructing a GOMS model, the analyst is relying on a task analysis that involves judgments about how users view the task in terms of their natural goals, how they decompose the task into subtasks, and what the natural steps are in the user's methods. These are standard problems in task analysis" (p. 5).

The uncomfortable truth: we can observe what users do (keystrokes, mouse movements, timing), but we cannot directly observe how they think about what they're doing. Do MacWrite users think of "moving text" as a unified operation, or as "cut then paste"? The observable behavior (select, command-X, reposition cursor, command-V) is consistent with either mental model.

Yet the choice matters enormously. If users think "move," then methods for cutting and pasting should be learned together as components of moving. If users think "cut, then independently, paste," then those methods can be learned separately. This affects learning time, error patterns, and the mental model that documentation and training should foster.

## Judgment Calls: Necessary Speculation

GOMS makes explicit what many design methods leave implicit: "the analyst is actually speculating on a psychological theory or model for how people do the task, and so will have to make hypothetical claims and assumptions about how users think about the task. Because the analyst does not normally have the time or opportunities to collect the data required to test alternative models, these decisions may be wrong, but making them is better than not doing the analysis at all" (p. 5).

This is philosophically sophisticated. The analyst isn't pretending to know the truth—they're making an **explicit bet** about user cognition that can be documented, challenged, and revised. The alternative (not making the assumption) is worse because it means not analyzing the design at all.

**For agent systems**: The same applies to how we model user intent, task structure, and goal hierarchies when designing orchestration. We're speculating about how users (or client systems) think about their tasks. Document the speculation. Make it explicit. Test it when possible. But don't pretend the speculation isn't happening.

## Example: The Cut-and-Paste Judgment

The MacWrite example makes a critical judgment call about goal decomposition: "In the example below for moving text in MacWrite, the main judgment call is that due to the command structure, the user views moving text as first cutting, then pasting, rather than as a single unitary move operation. Given this judgment, the actual methods are determined by the possible sequences of actions that MacWrite permits" (p. 5).

This judgment is grounded in the interface design: MacWrite has separate Cut and Paste commands in the Edit menu, not a single Move command. This interface structure **encourages** users to think "cut then paste." But it doesn't **force** it—users could still conceptualize moving as a unitary operation that just happens to require two commands.

The model reflects the judgment:
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Cut Selection.
Step 2. Accomplish_goal: Paste Selection.
Step 3. Verify "correct text moved".
Step 4. Return_with_goal_accomplished.
```

This decomposition implies:
- Users learn "cut" and "paste" as separate capabilities
- Moving text is accomplished by composing these capabilities  
- Training should explain cut and paste independently, then show how they combine for moving

Alternative judgment (unitary move):
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Select Text.
Step 2. Accomplish_goal: Execute_Move_Command.
Step 3. Accomplish_goal: Designate_Destination.
Step 4. Verify "correct text moved".
Step 5. Return_with_goal_accomplished.
```

This would imply:
- Moving is the primary concept
- Cut and Paste are not independently meaningful to users
- Training should explain moving, with cut/paste as implementation details

**The interface design partly determines which judgment is reasonable**, but doesn't eliminate the need for judgment.

## How to Make Defensible Judgments

Kieras provides guidance: "If the analyst's assumptions are based on a careful consideration from the user's point of view, they can not do any more harm than that typically resulting from the designer's assumptions, and should lead to better results" (p. 6).

The standard: **thoughtful speculation is better than unconscious assumption**. Designers always make assumptions about users—GOMS just makes them explicit.

Sources of evidence for judgments:

1. **Interface structure**: "due to the command structure, the user views moving text as first cutting, then pasting" (p. 5)—the design suggests a decomposition

2. **Comparison to similar systems**: "In contrast, on the IBM DisplayWriter, the design did not include separate cut and paste operations. So here, the decomposition of moving into 'cut then paste' would be a weak judgment call" (p. 5)

3. **User interviews**: "the analyst can learn a lot about how users view the task by talking to the users to get ideas about how they decompose the task in to subtasks" (p. 6)

4. **Behavioral observation**: "rather than asking people to describe verbally what they do, a better approach is having users demonstrate on the system what they do, or better yet, observing what they normally do in an unobtrusive way" (p. 6)

5. **Linguistic evidence**: How do users spontaneously describe their actions? Do they say "I'll cut this and paste it there" or "I'll move this there"?

The key principle: **triangulate**. No single source is definitive, but convergent evidence strengthens a judgment.

## The Gap Between What Users Do and What They Think They Do

A critical insight: "people have only a very limited awareness of their own goals, strategies, and mental processes in general. Thus the analyst can not simply collect this information from interviews or having people 'think out loud.' What users actually do can differ a lot from what they think they do" (p. 6).

This is a fundamental result from cognitive psychology: introspection is unreliable. Users might say "I always use keyboard shortcuts" while observation reveals they use menus 80% of the time. They might claim "I just know where things are" while video shows systematic visual search.

**Implication**: Verbal reports are useful for hypotheses, not conclusions. If users say "moving text is one operation," that's evidence to consider, but observation of how they actually execute moves (pause between cut and paste? ever cut without pasting?) provides stronger evidence.

**For agent systems**: When gathering requirements about how users want agents to operate, distinguish between:
- **Stated preferences**: "I want the agent to optimize for speed"
- **Revealed preferences**: User actually chooses careful/slow operation when speed/risk tradeoff is real
- **Behavioral patterns**: User actually reviews every suggestion before applying

Design for revealed preferences and behavioral patterns, not stated preferences.

## Judgment About Suboptimal Usage

An important complication: "what users actually do with a system may not in fact be what they should be doing with it. As a result of poor design, bad documentation, or inadequate training, users may not in fact be taking advantage of features of the system that allow them to be more productive" (p. 6).

Example: Bhavnani & John (1996) showed that CAD users often used inefficient procedures because they didn't know about better features, even after years of experience.

This creates a choice for the analyst:
- **Descriptive model**: How users actually operate the system (including inefficiencies)
- **Normative model**: How users should operate if fully trained and making optimal use of features

The decision depends on purpose:
- Evaluating **current** usability problems: use descriptive model
- Predicting **potential** performance: use normative model  
- Designing **training**: identify gap between descriptive and normative

**For agent systems**: Similar choice exists. Should we model:
- How users currently accomplish tasks (possibly with suboptimal tool usage)?
- How users could accomplish tasks with full knowledge of available skills?
- How users would accomplish tasks after AI-augmented workflow training?

Document which assumption you're making, because it affects system design. If users currently use 5 steps but could use 2 with better knowledge, should the agent:
- Automate the current 5-step workflow?
- Teach/enforce the optimal 2-step workflow?
- Transparently execute the 2-step workflow for the user?

## Bracketing Uncertainty: Fastest and Slowest Models

When task strategy is genuinely uncertain, Kieras proposes **bracketing**: "Construct two models of the task, one representing using the system as cleverly as possible, producing the the fastest-possible performance, and another that represents the nominal or unenterprising use of the system, resulting in a slowest-reasonable model" (p. 7).

These two models bound the actual performance. If both models predict the same design conclusion (e.g., Design A is faster than Design B in both cases), the uncertainty about strategy doesn't matter. If the models give opposite conclusions, either gather more data or analyze where the sensitivity lies.

Example: For a data entry task, optimistic model assumes user memorizes common entries and types without looking up; pessimistic model assumes user looks up every entry. If both models predict System A is faster, the memorization question doesn't affect the design choice.

**For agent orchestration**: When uncertain about user strategy or context, create bracketing workflows:
- **Optimistic**: Assumes all required information is immediately available, user makes no errors, no external delays
- **Pessimistic**: Assumes information must be gathered, user will review/revise outputs, external dependencies slow execution

If Design A is better in both cases, proceed with Design A. If outcomes flip, identify the critical uncertainty and either gather data or design to handle both cases.

## The "How Should Users Use It?" Alternative

When speculative judgment is too difficult, Kieras suggests: "construct a GOMS model for how the user should do the task. This is much less speculative, and is thus relatively well-defined. It represents a sort of best-case analysis in which the system designer's intentions are assumed to be fully communicated to the user" (p. 7).

This shifts the question from "how will users think about this?" to "how did designers intend users to think about this?"—much easier to answer, because you can ask the designers.

This "intended use" model is valuable for:
1. **Evaluating design coherence**: Does the intended use make sense? Is it consistent across features?
2. **Worst-case testing**: If even ideal usage is problematic, actual usage will be worse
3. **Training design**: The model defines what users need to learn
4. **Documentation**: The model structure maps to help topics

**For agent systems**: When designing a new capability without existing user data, model the **intended workflow**:
- How should users think about this task given the skills available?
- What's the optimal decomposition given the orchestration capabilities?
- What mental model do we want users to form?

This "intended use" model becomes the basis for documentation, examples, and training. Then, after deployment, observe actual usage and refine the model toward descriptive accuracy.

## Documenting Judgment Calls

Critical practice: "By documenting these judgment calls, the analyst can explore more than one way of decomposing the task, and consider whether there are serious implications to how these decisions are made. If so, collecting behavioral data might then be required" (p. 5).

Best practice format:

```
JUDGMENT CALLS:

1. Goal decomposition for "Move Text"
   Decision: Move = Cut + Paste (sequential subgoals)
   Basis: MacWrite has separate Cut/Paste commands; 
          users describe actions as "cut...then paste"
   Alternatives: Move as single goal with multi-step method
   Sensitivity: Affects learning time prediction (separate vs. 
                unified learning); affects documentation structure
   Confidence: Medium (interface structure supports, verbal 
               reports support, no direct observation)

2. Selection method for "arbitrary text"
   Decision: Click-drag selection
   Basis: Most common method observed; menu alternative 
          requires more steps
   Alternatives: Shift-arrow keys; Edit>Select menu
   Sensitivity: Affects execution time (click-drag faster); 
                doesn't affect learning (all methods must be learned)
   Confidence: High (observation data available)
```

This documentation enables:
- **Review**: Others can assess judgment quality
- **Revision**: New data can target specific judgments
- **Sensitivity analysis**: Important judgments get more scrutiny
- **Learning**: Patterns in judgments inform future analyses

**For agent systems**: Document analogous judgments about user workflows, task decomposition, and skill composition:

```yaml
DESIGN ASSUMPTIONS:

assumption: sequential_file_processing
  decision: Process files one at a time, completing each before starting next
  basis: Users mentioned wanting to track progress; parallel processing 
         reduces visibility
  alternatives: Batch parallel processing; streaming with progress aggregation
  sensitivity: Affects resource usage (parallel would be faster but use more 
               memory); affects user experience (serial provides clear progress)
  confidence: Medium (user interviews only, no usage observation)
  validation_plan: Implement both modes, A/B test with telemetry on user 
                   satisfaction and task completion
```

## When Judgments Should Trigger Empirical Work

The judgment call framework includes knowing when speculation isn't enough: "If so, collecting behavioral data might then be required. But notice that once the basic decisions are made for a task, the methods are determined by the design of the system, and no longer by judgments on the part of the analyst" (p. 5).

Triggers for empirical investigation:

1. **High sensitivity**: Different judgments lead to opposite design conclusions (choose Design A vs. Design B)
2. **Large impact**: Judgment affects major resource allocation (hire 3 engineers to build feature X vs. not)
3. **Low confidence**: No interface structure or existing data supports the judgment
4. **Disagreement**: Stakeholders or users hold conflicting views about the task
5. **Novel situation**: No precedent or analogous system to learn from

When these conditions hold, the cost of being wrong exceeds the cost of data collection. Run a pilot study, observe actual usage, or conduct controlled experiments.

**For agent systems**: Invest in user research when:
- Workflow decomposition significantly affects which skills to build
- Unclear if users want automation vs. augmentation for a task
- Disagreement on whether a task is procedural or creative
- No existing system to learn from (truly novel capability)

## The Designer's Assumptions: Making the Implicit Explicit

A profound insight: "any designer of a system has de facto made many such assumptions. The usability problems in many software products are a result of the designer making assumptions, often unconsciously, with little or no thoughtful consideration of the implications for users" (p. 6).

GOMS doesn't create the need for assumptions—it makes existing assumptions visible. Designers always assume things about how users think. The question is whether these assumptions are:
- **Conscious or unconscious**
- **Documented or invisible**  
- **Testable or untestable**
- **Consistent or contradictory**

By forcing assumptions into the GOMS model structure, they become:
- Conscious (you must decide how to decompose goals)
- Documented (written in methods)
- Testable (can be verified against behavioral data)
- Consistency-checkable (do related goals decompose similarly?)

**For agent systems**: Orchestration design embeds assumptions about:
- How users think about task structure (sequential, parallel, hierarchical?)
- What information users have available when (context availability)
- What decisions users can make reliably (what requires agent assistance?)
- What outputs users find useful (intermediate results? only final answer?)

Make these assumptions explicit in design documents, even without full empirical validation. The act of articulation improves decision quality.

## Practical Process for Making Judgment Calls

Based on GOMS approach, a systematic process:

**Step 1: Identify the judgment point**
"Do users view Move as one operation or as Cut+Paste?"

**Step 2: List alternatives**
- Alternative A: Unitary move operation
- Alternative B: Sequential cut, then paste
- Alternative C: Users vary (some A, some B)

**Step 3: Gather evidence**
- Interface structure: Separate Cut/Paste commands → B
- User language: "I cut it and pasted it here" → B
- Timing data: Pause between cut and paste → B
- Error patterns: Sometimes cut without pasting → B

**Step 4: Make provisional judgment**
"We'll model as B (sequential Cut+Paste) because evidence converges"

**Step 5: Document with confidence level**
"Confidence: Medium-High (multiple weak signals, no contradictions, no direct observation)"

**Step 6: Identify sensitivity**
"Affects: Learning time estimates, documentation structure, error recovery design"

**Step 7: Set validation trigger**
"If learning time predictions miss by >20%, revisit this judgment"

**Step 8: Proceed with design based on judgment**

This process makes judgment-making systematic without requiring impossible levels of certainty before proceeding.

## Connection to Selection Rules: When Judgment Determines Code

The GOMS model makes judgment calls executable. When you decide users view a task one way vs. another, that judgment becomes code structure.

If you judge users think "Move = Cut + Paste":
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Cut Selection.
Step 2. Accomplish_goal: Paste Selection.
```

If you judge users think "Move = atomic operation":
```
Method_for_goal: Move Text
Step 1. Accomplish_goal: Execute_Move.
```

The selection rule structure captures judgments about when different strategies apply:
```
Selection_rules_for_goal: Select Text
If Text_size of <current_task> is Word, 
   Then Accomplish_goal: Select Word.
If Text_size of <current_task> is Arbitrary,
   Then Accomplish_goal: Select Arbitrary_text.
```

This encodes the judgment: "Users think of selecting words differently from selecting arbitrary text spans."

**For agent orchestration**: Judgment calls about task decomposition directly determine orchestration structure:

```yaml
# Judgment: Users separate data gathering from analysis
workflow: analyze_codebase
  steps:
    - skill: collect_files
    - skill: analyze_collected_files
    
# Alternative judgment: Users think of analysis as including gathering
workflow: analyze_codebase
  steps:
    - skill: analyze_codebase_including_discovery
```

These aren't mere implementation differences—they reflect different theories of how users conceptualize the task.

## Conclusion: Modeling Requires Theory

The deepest lesson: **any useful task model embeds a theory of user cognition**. You cannot model how users accomplish tasks without modeling how they understand tasks. You cannot predict learnability without modeling what users learn. You cannot evaluate consistency without modeling what counts as "the same thing" to users.

GOMS makes this explicit and systematic. It doesn't eliminate judgment—it structures judgment, documents it, and makes its implications traceable.

For WinDAGs and agent systems: **orchestration design is cognitive engineering**. You're not just wiring up capabilities—you're creating a structure that encourages certain ways of thinking about tasks. Document your theory of how users think. Test it when possible. Revise when wrong. But don't pretend you don't have a theory. That just makes your theory unconscious and untestable.

The standard: thoughtful, documented, revisable speculation beats unconscious assumption.