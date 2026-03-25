# User Accommodation as System Failure: Reading What Users Don't Say

## The Invisible Workaround Problem

Russell Beale describes a pattern that's become so normalized it's nearly invisible: users adapting themselves to accommodate system limitations rather than demanding systems adapt to human needs. When his friend Jim encounters unexpected behavior, the response is automatic: "Ooohh, sorry, my fault... don't know what I did but it's gone all weird."

Even more telling is the parent who says, "Sorry, I can't do it. You do it. I'll only break it." This isn't just self-deprecation—it's a learned behavior pattern. The user has internalized that the system is correct and immutable, and therefore any mismatch must be the user's fault.

But these moments of explicit accommodation are just the visible tip of a much larger phenomenon. For every user who apologizes for a system's failure, there are dozens of invisible accommodations: tasks not attempted because users have learned the system can't handle them, elaborate workarounds developed to avoid known failure modes, careful formulation of requests in the specific way the system can process them.

For intelligent agent systems, understanding and detecting these invisible accommodations is critical because they represent the gap between what the system should be able to do and what it actually can do. More importantly, they represent failure modes that never show up in error logs because users have learned not to trigger them.

## The Accommodation Taxonomy

User accommodation takes several forms, each representing a different type of system failure:

### Task Avoidance

Users learn what the system can't do and simply stop asking. This is the most insidious form of accommodation because it's completely invisible to the system. The system never sees the requests that aren't made.

For agent orchestration systems:
- Users stop requesting certain types of task decomposition because they've learned the system handles them poorly
- Complex tasks that require sophisticated coordination are reformulated as simpler sequential tasks
- Tasks requiring capabilities the system has but can't coordinate effectively are never attempted
- Questions requiring synthesis of information from multiple sources are narrowed to single-source queries

The danger is that these accommodations become normalized. New users learn from experienced users what "can" and "can't" be done, and these socially constructed boundaries become more rigid than the actual technical limitations.

### Request Reformulation

Users learn to formulate requests in the specific way the system can process them rather than in the natural way they'd express the need. This is extremely common in LLM interactions, where "prompt engineering" has become an elaborate art.

For agent systems:
- Breaking complex requests into multiple simple requests because the system can't handle sophisticated decomposition
- Providing explicit sequencing or dependency information that the system should be able to infer
- Specifying which skills to use rather than letting the system select appropriate skills
- Avoiding ambiguous language even when the ambiguity is unavoidable in natural expression

This accommodation is particularly problematic because it makes the system appear more capable than it actually is. The system succeeds not because it understood a complex request but because the user pre-processed the request into a form the system could handle.

### Error Correction Patterns

Users develop predictable patterns of error correction, essentially debugging the system's failures in real-time. This includes:
- Retrying failed requests with slight variations
- Breaking down tasks differently when initial decomposition fails
- Manually coordinating between agents when automatic coordination fails
- Providing missing context or clarification that the system should have requested

These patterns represent system failures that have been externalized to the user. The system's inability to handle certain cases has been transformed into user expertise in working around those cases.

### Workaround Strategies

Users develop elaborate strategies to achieve goals despite system limitations:
- Using multiple systems for different parts of a task because no single system handles the full task well
- Maintaining external state or context because the system doesn't maintain it adequately
- Performing manual verification or correction of system outputs because reliability is insufficient
- Avoiding certain features or capabilities that are theoretically present but practically unusable

These workarounds represent functional gaps. The system claims certain capabilities, but they're sufficiently unreliable or awkward that users route around them.

### Expectation Management

Users calibrate their expectations based on experience with system limitations:
- Accepting 70% success rates as normal
- Treating certain types of failures as inevitable
- Building redundancy and backup plans into every interaction
- Mentally categorizing some tasks as "system tasks" and others as "must do manually"

This accommodation is particularly insidious because it prevents users from recognizing that better is possible. If you accept that systems fail regularly, you never develop the productive dissatisfaction that drives improvement.

## Why Accommodation Is Invisible

User accommodation is largely invisible to traditional system monitoring and evaluation because:

**It Prevents Failures**: By avoiding problematic cases, accommodation prevents failures from occurring. The system never sees the edge cases it can't handle.

**It Looks Like Success**: When users reformulate requests into forms the system can handle, the system records success, not accommodation.

**It's Externalized**: Workarounds and error correction happen outside the system's observation. The system sees only the final, successful interaction after users have done substantial preprocessing.

**It's Socialized**: Accommodation strategies are shared user-to-user through documentation, training, and informal knowledge transfer. This social layer is invisible to the system.

**It's Normalized**: After enough time, accommodations become "how you use the system" rather than being recognized as compensating for system limitations.

## Detecting Accommodation Signals

To detect invisible accommodation, agent systems need to look for signals that indicate users are working around limitations:

### Pattern Analysis

**Request Clustering**: If users systematically avoid certain types of requests or request patterns, that's likely accommodation. Analysis should identify:
- Task types that are theoretically possible but rarely requested
- Request patterns that suddenly disappear after users gain experience
- Artificial constraints in requests (excessive sequencing, overly detailed specification) that suggest users are pre-processing

**Reformulation Patterns**: When users systematically reformulate requests in specific ways, that indicates the system isn't handling natural expression well. Look for:
- Multiple requests that could have been expressed as a single complex request
- Requests with unusually explicit structure or dependency specification
- Patterns of retry with progressive simplification

**Success Rate Evolution**: How success rates change as users gain experience is revealing:
- If success rates increase primarily because users learn what not to ask, that's accommodation
- If success rates increase primarily because users learn how to formulate requests the system can parse, that's accommodation
- If success rates increase because the system gets better, that's improvement

### Comparative Analysis

**Expert vs. Novice Behavior**: Comparing how experienced and novice users interact with the system reveals accommodation:
- If experts have higher success rates primarily because they avoid problematic cases, the system has hidden failure modes
- If experts use significantly more complex workarounds, the system isn't meeting needs directly
- If expert requests look very different from novice requests (more constrained, more explicit), users are learning to accommodate system limitations

**Intended vs. Actual Usage**: Comparing how designers expected the system to be used with how users actually use it reveals accommodation:
- Features that exist but are rarely used may be unreliable or awkward
- Capabilities that should be invoked automatically but are specified manually indicate coordination failures
- Decomposition strategies that should be automatic but are specified explicitly indicate decomposition failures

### Direct Investigation

**User Interviews**: Asking users directly about workarounds, avoided tasks, and frustrations reveals accommodation that's invisible in logs:
- "What tasks do you wish you could ask the system to do but don't because it doesn't work well?"
- "What workarounds have you developed?"
- "What do you do manually that you wish the system would do?"

**Task Diaries**: Having users document what they're trying to accomplish (not just what they ask the system) reveals the gap between need and request:
- Tasks that are never translated into system requests
- Manual steps performed before or after system interaction
- External coordination or verification users perform

**Failure Attribution Surveys**: Asking users to explain failures reveals whether they blame themselves or the system:
- If users consistently blame themselves for failures that are actually system limitations, accommodation is occurring
- If users describe failures as inevitable rather than addressable, expectations have been calibrated too low

## Accommodation as Design Critique

Every accommodation pattern represents a specific system design failure:

**Task Avoidance → Capability Gap**: When users avoid entire categories of tasks, the system lacks necessary capabilities. The accommodation signals which capabilities are most needed.

**Request Reformulation → Interface Inadequacy**: When users must reformulate natural requests into system-parseable form, the interface (in the broad sense of how the system accepts and interprets input) is inadequate. The reformulation patterns reveal what kind of interpretation the system should be able to do but can't.

**Error Correction Patterns → Brittle Processing**: When users develop predictable error correction strategies, the system is too brittle. The error patterns reveal where robustness is needed.

**Workaround Strategies → Coordination Failure**: When users route around system features, those features aren't working well enough to be worth the cost of using them. The workarounds reveal what would need to improve for direct usage to be worthwhile.

**Expectation Management → Reliability Inadequacy**: When users build redundancy and backup plans into every interaction, the system isn't reliable enough to trust. The backup strategies reveal the minimum reliability threshold users need.

## Designing to Detect and Discourage Accommodation

Agent systems should be designed to actively detect and discourage accommodation:

### Proactive Capability Communication

Rather than waiting for users to discover limitations through failure, systems should proactively communicate boundaries:
- "I can handle tasks of these types well: [list]. I struggle with these types: [list]. I cannot currently do these types: [list]."
- "This request is near the edge of my capabilities. Success probability is approximately 60%. Would you like me to attempt it, or would you prefer to reformulate?"

This prevents the trial-and-error process through which users learn accommodations.

### Request Naturalness Scoring

Systems should evaluate how "natural" requests are:
- Is this request unnecessarily sequential when parallelization would be natural?
- Does this request specify implementation details that should be inferred?
- Is this request artificially constrained in ways that suggest the user is avoiding something?

When requests appear unnaturally constrained, the system should ask: "This request seems very specific. Is this exactly what you need, or have you simplified it because you think I can't handle something more complex?"

### Alternative Suggestion

When users make requests that the system can handle but suspects are accommodations, suggest alternatives:
- "I can do this sequential task, but I notice this could potentially be parallelized. Did you specify sequential execution because you need it that way, or because you're not sure I can handle parallelization?"
- "You've specified which skill to use. I could also select skills automatically. Would you like me to do that, or do you prefer explicit control?"

This makes accommodation visible and gives users permission to stop accommodating.

### Capability Development Transparency

Systems should be transparent about which capabilities they're developing:
- "I've noticed several users avoid asking me to handle tasks with circular dependencies. I'm working on improving my decomposition strategies for this case. Would you like to be notified when this capability improves?"

This signals that accommodations are recognized as temporary rather than permanent, and that the system is working to eliminate the need for them.

### Workaround Detection

Systems should explicitly try to detect workarounds:
- Multiple small requests in sequence that could have been one complex request
- Manual specification of information the system should be able to infer
- External tools being used for tasks the system should handle
- Patterns of immediate verification or correction of system outputs

When workarounds are detected, the system should investigate: "I notice you're doing X manually. This is something I should be able to do. Can you help me understand why you're doing it manually instead of asking me?"

## The Feedback Loop from Accommodation to Improvement

Detected accommodation should drive system improvement:

**Capability Development**: Task avoidance patterns should directly inform capability development priorities. If many users are avoiding tasks of a certain type, developing capabilities for that type has high impact.

**Interface Enhancement**: Request reformulation patterns should inform interface improvement. If users consistently must express requests in specific ways, the interface should be enhanced to accept more natural expression.

**Robustness Improvement**: Error correction patterns should inform robustness development. The specific failures users learn to work around are exactly the failures that need robustness improvements.

**Feature Refinement**: Workaround patterns should inform feature refinement. If users route around existing features, those features need improvement before new features are added.

**Reliability Enhancement**: Expectation management patterns should inform reliability improvement priorities. The backup strategies users develop reveal where reliability improvements would have most impact.

## The Anti-Pattern: Celebrating Accommodation as "User Skill"

There's a dangerous tendency to celebrate user accommodation as "expertise" or "skill." Users who've learned to work effectively with a limited system are described as "power users" or "experts." Documentation describes elaborate workarounds as "best practices."

This is exactly backwards. User accommodation represents the externalization of system inadequacy. Celebrating it:
- Normalizes system limitations
- Places responsibility for compensation on users
- Creates barriers to entry for new users
- Prevents recognition that improvement is needed
- Rewards users for tolerating poor design

Beale's insight applies here: users who accommodate are not more skilled; they're the ones who've most thoroughly internalized the system's inadequacy as their own responsibility to manage.

For agent systems, this means:
- Workarounds should be documented as *temporary compensations* not best practices
- "Power users" should be recognized as people who've learned to work despite limitations, not because of capabilities
- Expertise should be measured by what users can accomplish, not by how well they can navigate system limitations
- Documentation should aspire to eliminate workarounds, not document them

## Accommodation in Multi-Agent Coordination

In multi-agent orchestration systems, accommodation takes specific forms:

**Manual Coordination**: Users explicitly coordinating between agents because automatic coordination is inadequate. This accommodation signals that coordination protocols need improvement.

**Sequential Specification**: Users specifying sequential execution when parallel execution would be more efficient, because they don't trust the system to manage parallel execution correctly.

**Explicit Resource Management**: Users manually managing resource allocation because the system's automatic resource management is inadequate.

**Redundant Specification**: Users providing the same information to multiple agents because the system doesn't share context effectively.

**Agent Selection**: Users explicitly selecting which agents to involve rather than letting the system determine this, because agent selection is unreliable.

**Result Verification**: Users systematically verifying and cross-checking results from multiple agents because individual agent reliability is insufficient.

Each of these accommodations points to specific improvements needed in coordination protocols, resource management, context sharing, agent selection, or reliability enhancement.

## Measuring Accommodation

To track accommodation over time and measure improvement efforts, systems need metrics:

**Task Coverage Rate**: What percentage of theoretically possible tasks (given available skills and knowledge) are users actually requesting? Low coverage suggests significant task avoidance.

**Request Naturalness Score**: How natural and minimally specified are user requests? Highly explicit, constrained requests suggest accommodation.

**Workaround Frequency**: How often do interaction patterns suggest users are working around limitations?

**Failure Attribution Ratio**: When failures occur, what percentage does the system correctly identify as system limitations versus user errors? If the system consistently attributes failures to user error when users report accommodation patterns, attribution is broken.

**Capability Gap Survey Results**: Regular surveys asking "What do you wish the system could do that it currently can't?" The size and consistency of this gap measures accommodation.

**Success Rate Components**: Decomposing success rates into:
- Pure success (system handled natural request well)
- Accommodation success (user reformulated and system handled it)
- Workaround success (user routed around system entirely)

Only the first represents true system capability.

## Conclusion: Accommodation as Signal, Not Solution

Russell Beale's core insight—that users blame themselves and accommodate system limitations rather than demanding better—is particularly important for agent systems because accommodation is even more invisible than in traditional interfaces.

In graphical interfaces, workarounds are at least visible (multiple clicks, navigation through awkward paths). In agent systems, accommodation often happens in the user's head during request formulation, or in the user's decision not to request at all. These cognitive accommodations leave almost no trace in system logs.

For agent orchestration systems to improve, they must:

1. Actively detect accommodation signals through pattern analysis, comparative studies, and direct investigation
2. Treat accommodation as a system failure signal, not user expertise
3. Design interfaces that discourage accommodation by proactively communicating capabilities and limitations
4. Use detected accommodation to drive capability development, interface enhancement, and robustness improvement
5. Measure the reduction of accommodation over time as a key success metric

The goal is not to create systems that never require user adaptation—that's impossible in complex domains. The goal is to create systems that continuously reduce the need for accommodation, that make their limitations explicit rather than forcing users to discover them through failure, and that shift the burden of compensation from users to the system architecture.

As Beale argues, users should not apologize for system failures. For agent systems, this means users should not have to develop elaborate expertise in working around system limitations. When they do, that expertise is a signal that the system needs to improve, not a sign that users are becoming more skilled.

True system excellence is measured not by the sophistication of workarounds users develop, but by the elimination of the need for workarounds entirely.