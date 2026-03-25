# Teaching "Getting It": The Cognitive Shift That Changes Everything

## The Core Learning Outcome

Russell Beale describes his primary teaching objective in a way that violates typical learning outcome formulations: "For my introductory HCI module, I wanted 'Getting It.'" This isn't measurable in traditional ways. You can't test for "Getting It" with multiple choice questions. But Beale knows it when he sees it, and he knows it matters more than any specific technique or tool.

What is "Getting It"? It's the moment when a student fundamentally understands that:
1. Bad design is not inevitable
2. User frustration is usually design failure, not user inadequacy
3. Current systems are not the limit of what's possible
4. They have the right to demand better
5. Pointing out and refusing to tolerate bad design is a responsibility, not rudeness

This cognitive shift is more valuable than any specific design skill because it's generative. Once students "Get It," they become self-directed critics of design, spotters of problems, and demanders of better systems. They don't need to be taught to evaluate every new interface—they do it automatically.

For intelligent agent systems, this same cognitive shift is essential for everyone involved: developers, operators, users, and funders. Until stakeholders "Get It"—until they fundamentally understand that current orchestration capabilities are far short of what's theoretically possible and that this gap is addressable, not inevitable—systems will stagnate at mediocrity.

## The Teaching Moment: Disabled Parking and Steps

Beale describes a specific teaching moment that crystallizes "Getting It":

"I told the story of the small plot of ground that had been dug up, flattened, and then asphalted over to create a two-bay car parking space for disabled people right by the back of our building, to ease their access. It's a great idea—except it's lower than the entrance to the building, and so they have built a few steps up for access... The only way in with a wheelchair would be to go back up the access road, past the usual car park, and then around the building on the pavements."

This example works as a teaching tool for several reasons:

**Physical Visibility**: The problem is literally visible. You can walk to it, look at it, photograph it. This makes denial impossible.

**Clear Intent vs. Execution Gap**: The intent (accessible parking) is obvious and good. But the execution defeats the intent. This separates failure from malice—the designers presumably meant well but didn't think through the implications.

**Absurdity Threshold**: The contradiction is so stark it crosses the threshold into absurdity. Accessible parking accessible only by stairs. Once you see it, you can't unsee it, and you can't rationalize it.

**Generalizability**: Once you've seen this example, you start seeing the same pattern everywhere: systems designed with good intentions but thoughtless execution that defeats the purpose.

**Attribution Clarity**: There's no way to blame wheelchair users for this failure. The responsibility clearly lies with designers and builders. This breaks the user self-blame pattern.

## Translating to Agent Systems

For agent orchestration systems, what are the equivalent "disabled parking with steps" examples that create "Getting It" moments?

### Sequential Execution of Parallelizable Tasks

An agent system that decomposes a parallelizable problem into sequential steps is the direct equivalent. The intent (break down the problem) is good. The execution (sequential when parallel would work) defeats the efficiency purpose.

Example: A system asked to "analyze this codebase for security issues, performance problems, and code quality issues" that does:
1. Analyze security (20 minutes)
2. Analyze performance (15 minutes)
3. Analyze code quality (18 minutes)
Total: 53 minutes

When it could do:
1. Analyze security, performance, and quality in parallel
Total: 20 minutes

The absurdity becomes clear when you make it visible. The system has all three capabilities. The tasks are independent. Yet it runs them sequentially, wasting 33 minutes. Why? Because the decomposition strategy is thoughtless—it breaks tasks down but doesn't reason about dependencies and parallelizability.

Once someone sees this example and understands it represents a decomposition failure, not an inherent limitation, they "Get It." They understand that agent orchestration can be intelligent or idiotic, and current implementations are often closer to idiotic than they need to be.

### Coordination Overhead Exceeding Task Time

Another absurdity: agent systems that spend more time coordinating than actually working.

Example: A system asked to "find the answer to this question using these three sources" that:
- Spends 45 seconds negotiating which agent should handle which source
- Spends 30 seconds checking each source (90 seconds total)
- Spends 60 seconds aggregating results
Total: 195 seconds, of which only 90 seconds was actual work

A well-designed system could:
- Assign sources immediately based on agent capabilities (5 seconds)
- Check in parallel (30 seconds)
- Aggregate progressively as results arrive (10 seconds)
Total: 45 seconds

The ratio of coordination to work reveals the problem. Once you see that 2/3 of the time is wasted on coordination overhead, you understand that coordination protocols matter and current protocols are inadequate.

### Capability Present But Unusable

The equivalent of having wheelchair ramps that are too steep to actually use.

Example: A system that claims to support "semantic skill selection" but actually:
- Uses keyword matching on skill descriptions
- Fails to understand synonyms or related concepts
- Can't reason about skill composition
- Picks inappropriate skills 40% of the time

The capability exists in name but not in function. Users learn to manually specify skills rather than trusting automatic selection. This workaround becomes "expertise," obscuring the fact that semantic selection is supposed to work but doesn't.

Once someone sees that the system claims a capability that's actually unusable, requiring elaborate workarounds, they "Get It"—they understand that having features and having working features are different things.

### Information Available But Not Used

A system that asks users for information it already has or should be able to infer.

Example: A system that:
- Asks users to specify dependencies between subtasks when those dependencies are apparent from task structure
- Asks users which skills to use when skill requirements are obvious from task type
- Asks users for context that's already in the conversation history

This is the agent system equivalent of a form asking for information you've already provided. Once you see it clearly—the system asking you to specify dependencies it should be able to infer automatically—you understand that context management and inference capabilities matter and are often inadequate.

## How "Getting It" Changes Behavior

Beale reports that after teaching this way, students begin sending him examples of bad websites, especially ones he's been involved with. More importantly, "at least they are now critical and believe it is the designer or the company that is most at fault, and not them."

This behavioral change is the evidence that "Getting It" has occurred:

**Proactive Problem Spotting**: Instead of passively accepting poor design, students actively notice and point out problems. They've developed a critical lens that's always on.

**Attribution Shift**: Problems are attributed to designers/systems, not users. This breaks the self-blame cycle.

**Social Transmission**: Students start teaching others—parents, friends, colleagues. The cognitive shift is contagious.

**Standard Elevation**: What was previously accepted as "good enough" is now recognized as inadequate. Expectations have been recalibrated.

**Constructive Criticism**: Rather than vague complaints ("this doesn't work well"), students develop specific critiques ("this decomposition strategy fails for parallel tasks").

For agent systems, "Getting It" would manifest as:

**Developers questioning decomposition strategies**: "Why are we using sequential decomposition here? These subtasks are independent."

**Operators demanding better coordination**: "Why does coordination take longer than actual work? This seems like protocol overhead."

**Users refusing to accept workarounds**: "Why do I need to specify which skills to use? That should be automatic."

**Funders asking informed questions**: "What's your success rate on complex coordination tasks? How does that compare to theoretical optimal?"

**Community establishing higher standards**: "A system claiming sophisticated decomposition should handle these cases. If it doesn't, it should say so."

## The Teaching Strategy

How does Beale create "Getting It" moments? Several pedagogical strategies emerge from his brief essay:

### Use Concrete Examples

Abstract principles ("good design is important") don't create cognitive shifts. Concrete examples of absurdity do. The disabled parking with steps. The program that "goes all weird" and prompts apology from the user. The parent who apologizes for not being able to use a mobile phone.

For agent systems, teaching requires showing:
- Actual task execution traces showing coordination overhead
- Specific examples of decomposition strategies that waste time
- Real cases where skills are selected inappropriately
- Concrete instances of information the system should have but asks for

### Make the Absurdity Visible

Bad design is often normalized and invisible. Teaching requires making it startlingly visible. Beale uses humor ("the latest hilarious story of 'unusability'") and surprise (parking for the disabled that requires stairs!) to break through normalization.

For agent systems, this means:
- Visualizing execution DAGs to show unnecessary sequential bottlenecks
- Timing breakdowns that reveal coordination overhead
- Side-by-side comparisons of current vs. optimal execution
- Capability demonstrations that show what should be possible

### Provide Comparative Context

Excellence is invisible if you've only seen mediocrity. Beale advocates "Demonstrate dire Web sites to your students or colleagues, and show them good ones."

For agent systems:
- Show simple vs. sophisticated decomposition strategies on the same task
- Compare primitive coordination protocols with sophisticated dependency analysis
- Demonstrate capable vs. incapable semantic skill selection
- Show systems that handle failures well vs. systems that don't

### Enable Language Development

Before "Getting It," people know something is wrong but can't articulate it. After, they have language for the problems. Beale's students develop critical vocabulary about design, usability, and interaction.

For agent systems, this means teaching vocabulary for:
- Types of decomposition strategies (sequential, parallel, hierarchical, adaptive)
- Coordination protocol characteristics (centralized, distributed, reactive, anticipatory)
- Skill selection approaches (syntactic, semantic, compositional)
- Failure modes (capability gap, coordination failure, resource constraint, knowledge gap)

With better language, stakeholders can make specific demands rather than vague complaints.

### Create Social Permission

Users often feel they shouldn't criticize systems they don't fully understand. "Getting It" includes getting permission to criticize. Beale explicitly teaches that it's the designer's fault, not the user's.

For agent systems, this means:
- Explicitly stating that coordination overhead is a system failure, not inherent necessity
- Clearly attributing decomposition inadequacy to system limitations, not task complexity
- Making it clear that workarounds represent system failures that should be addressed
- Empowering users to demand specific improvements

### Use Emotion Productively

Beale uses humor, frustration, and absurdity productively. The disabled parking story is funny and infuriating simultaneously. That emotional engagement makes the lesson memorable.

For agent systems:
- The absurdity of spending more time coordinating than working
- The frustration of manually specifying information the system should infer
- The humor of systems that claim capabilities they clearly don't have
- The satisfaction of seeing truly excellent decomposition or coordination

## Assessment of "Getting It"

How do you know when someone has "gotten it"? Beale offers indicators:

**They spot problems proactively**: "Most of my students... now send me examples of bad Web sites."

**They teach others**: "Some have even begun to teach their parents to get out their hardly used mobile phones and text them."

**Their attribution is correct**: They "believe it is the designer or the company that is most at fault, and not them."

**They're constructively critical**: They don't just complain; they identify specific problems and explain why they're problems.

For agent systems, assessment would look for:

**Developers proactively identifying inefficiencies**: "This decomposition is creating unnecessary sequential bottlenecks. We should analyze dependencies and parallelize."

**Operators questioning system behavior**: "Why is coordination overhead so high here? This suggests our protocol is inefficient."

**Users demanding capabilities**: "This system should be able to infer these dependencies. Why am I specifying them manually?"

**Community developing shared standards**: "A system claiming sophisticated coordination should handle these cases. Let's create benchmarks."

## The Multi-Level Teaching Challenge

Beale advocates teaching not just designers but "all undergraduates in a university; to the people at large via public lectures; to the world on the Internet."

For agent systems, this multi-level teaching is critical:

### Teaching Developers

Developers need to "Get It" about:
- The gap between current and excellent decomposition strategies
- The overhead cost of primitive coordination protocols
- The difference between claimed and actual capabilities
- The importance of making limitations explicit

Teaching methods:
- Code reviews that highlight decomposition inefficiencies
- Performance analysis that breaks down coordination overhead
- Comparative demonstrations of different architectural approaches
- Deep dives into failure modes and root causes

### Teaching Operators

Operators need to "Get It" about:
- When poor performance indicates architectural problems vs. resource constraints
- How to recognize capability gaps vs. user errors
- What questions to ask when evaluating systems
- How to demand improvements effectively

Teaching methods:
- Analysis of execution traces showing where time is spent
- Comparative benchmarks showing what different systems can do
- Failure pattern analysis revealing systematic issues
- Best practice documentation that's honest about limitations

### Teaching Users

Users need to "Get It" about:
- That task decomposition can be intelligent or thoughtless
- That coordination overhead is often unnecessary
- That workarounds indicate system failures
- That they have the right to demand better

Teaching methods:
- Transparent execution explanation showing how tasks are handled
- Side-by-side comparison of current vs. optimal execution
- Clear communication about why tasks fail
- Examples of sophisticated capabilities they should be able to expect

### Teaching Funders and Decision-Makers

Funders need to "Get It" about:
- The difference between marginal improvement and transformative capability
- What questions to ask when evaluating systems
- Why sophisticated coordination and decomposition matter
- How to set appropriate requirements

Teaching methods:
- Business case analysis showing the cost of inefficiency
- Comparative demonstrations of what investment in excellence enables
- Risk analysis showing the cost of capability gaps
- Success metrics that go beyond simple task completion rates

## Sustainability of "Getting It"

Once someone "Gets It," is it permanent? Beale's evidence suggests yes—the cognitive shift is stable. Students continue noticing problems and teaching others long after the course ends.

But there's a potential counter-force: normalization. If someone "Gets It" but is then immersed in an environment where mediocrity is universal and excellence is rare, will they maintain the cognitive shift or gradually renormalize?

This suggests that "Getting It" needs to be socially sustained:

**Community Standards**: Professional communities that maintain high standards and call out mediocrity help individuals sustain their critical perspective.

**Visible Excellence**: Regular exposure to examples of truly excellent design prevents renormalization of mediocrity.

**Collective Criticism**: When multiple people "Get It" and reinforce each other's critical perspective, the cognitive shift is more stable.

**Institutional Support**: Organizations that value and reward excellence make it easier for individuals to maintain high standards.

For agent systems, this means:
- Developer communities that maintain shared benchmarks and call out inadequate approaches
- Regular conferences and publications showing state-of-art capabilities
- Professional societies that establish and promote standards
- Organizations that fund and reward pursuit of excellence, not just adequacy

## Teaching Across the Experience Spectrum

An interesting challenge: how does teaching "Getting It" differ for novices vs. experts?

**Novices** have the advantage of not having internalized system limitations as their own inadequacy. But they lack the experience to recognize what's possible.

Teaching novices requires:
- Showing them excellence first, before they learn to accept mediocrity
- Providing comparative examples so they develop calibrated expectations
- Teaching them to attribute failures correctly from the start
- Giving them language for criticism before they need to use it

**Experienced Users** have rich knowledge of what current systems can do, but they've often developed elaborate accommodation strategies and normalized limitations.

Teaching experienced users requires:
- Helping them recognize their workarounds as accommodation, not expertise
- Showing them that their expert knowledge of limitations is evidence of system inadequacy
- Demonstrating that better is possible, not just theoretical
- Validating their frustrations and redirecting them from self-blame

**Developers** may resist "Getting It" because it implies their work is inadequate. This resistance needs to be addressed carefully.

Teaching developers requires:
- Framing critique as identifying opportunities, not assigning blame
- Showing that architectural limitations are often inherited, not chosen
- Demonstrating that pursuit of excellence is professionalism, not perfectionism
- Creating safe spaces for acknowledging limitations without defensiveness

## Conclusion: The Cognitive Foundation of Progress

Beale's insight about "Getting It" reveals something crucial about improving intelligent systems: technical capability is necessary but insufficient. Until stakeholders—developers, operators, users, funders—fundamentally understand that current systems fall far short of what's possible, there's no sustained pressure for improvement.

"Getting It" is the cognitive foundation that makes progress possible. It's the shift from:
- "I must not be using this right" to "This system isn't designed right"
- "This is just how technology is" to "This is inadequate design"
- "I need to work around this limitation" to "This limitation should be addressed"
- "Good enough compared to alternatives" to "Far from what's theoretically possible"

For DAG-based orchestration systems specifically, "Getting It" means understanding:
- That task decomposition can be sophisticated or primitive, and primitive should be unacceptable
- That coordination protocols can be efficient or wasteful, and waste should be visible and criticized
- That capability claims should be verifiable, and unusable capabilities should be called out
- That workarounds represent system failures, not user expertise

The teaching challenge is creating moments of clarity—like the disabled parking with steps—that make the absurdity of current limitations startlingly visible. Once that clarity is achieved, the cognitive shift is stable and generative. People who "Get It" become self-sustaining advocates for better design, spotters of problems, and demanders of excellence.

As Beale demonstrates, teaching "Getting It" doesn't require elaborate curricula or extensive technical training. It requires concrete examples, comparative context, clear attribution of responsibility, and permission to criticize. But once achieved, it's more valuable than any specific technical skill because it creates stakeholders who will continuously push systems toward excellence rather than accepting adequacy.

For intelligent agent systems to fulfill their potential, we need communities of developers, operators, and users who have all "Gotten It"—who understand what's possible, refuse to accept mediocrity, and demand that systems continuously improve rather than stagnate at "good enough."