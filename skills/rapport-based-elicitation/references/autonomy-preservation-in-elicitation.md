# Autonomy Preservation in Information Elicitation: Why Giving Up Control Produces More Information

## The Counter-Intuitive Principle

One of the most counter-intuitive findings embedded in the rapport-based interview 
literature is that interviewers who give up more control over the interview produce 
*more* information, *more accurately*, than interviewers who maintain tight control 
over the questioning process.

Brimbal et al. (2021) characterize autonomy support as a core component of conversational 
rapport:

> "Offering an individual autonomy involves allowing them to provide their own account 
> of an event absent pressure or direction from the interviewer, and to do so in the 
> order and level of detail they feel most comfortable." (p. 57)

And adaptation — the related capacity to follow the source's lead:

> "Adaptation—the ability to adjust questioning based on an individual's responses—can 
> facilitate perceived autonomy and encourage a free-flowing interview context." (p. 57)

The controlled interview — tight questions, specific topics in a predetermined sequence, 
constrained response options — seems like it should produce more information because 
it is more targeted. The evidence shows the opposite: it produces less information, 
because it replaces the source's model of what is relevant with the interviewer's model, 
and the interviewer's model is necessarily incomplete.

---

## Why the Controlled Approach Fails

### The Questioner's Model is Incomplete
The questioner who controls the interview sequence is, implicitly, imposing their model 
of what matters on the source. Every question presupposes a framework: what entities 
are relevant, what events are important, what connections are worth exploring. That 
framework is developed before the interview from incomplete information.

The source has information that the questioner doesn't know they need. If the questioner 
controls the sequence, they will never ask for it, and the source — following the lead 
of a questioner who seems to know what they're doing — will never volunteer it.

This is Fisher & Geiselman's (1992, cited p. 56) point about memory: leading and 
closed-ended questions don't just limit response options — they interfere with the 
source's retrieval process, making the source less able to access information that 
the questioner hasn't asked about.

### Autonomy and Psychological Safety Are Connected
A source who feels that their account is respected — that they can provide information 
in their own order, at their own level of detail, without being redirected or interrupted — 
is in a fundamentally different psychological state than a source who feels constrained 
and evaluated. The first state facilitates memory retrieval and honest self-report; 
the second activates threat responses that inhibit both.

### The Interruption Tax
Every time a questioner redirects or interrupts a source, they impose a cognitive and 
motivational cost: the source loses the thread of their own account, must reorient to 
the questioner's new topic, and receives a signal that their own model of relevance is 
wrong. This tax is paid on every subsequent exchange. Sources who have been interrupted 
multiple times become progressively less forthcoming, not out of deliberate resistance, 
but because the conditions for free retrieval and honest self-report have been eroded.

---

## The Funnel Structure as Autonomy Architecture

The training's "funnel structure" of questioning — start broad, carefully narrow 
focus — is an architectural expression of autonomy support:

> "asking productive questions (e.g., using a funnel structure [i.e., starting broad 
> and carefully narrowing the focus])" (p. 59)

The funnel structure operationalizes autonomy in a structured way:
1. **Broad initial question**: "Tell me about your relationship with this organization." 
   This gives the source maximum latitude to reveal what they consider relevant.
2. **Follow the source's leads**: Listen for what the source mentions, what they emphasize, 
   what they avoid. These are signals about their model of what matters.
3. **Narrow based on what emerged**: Only after the source's account has been heard does 
   the questioner introduce specific topics — and those topics are now informed by what 
   the source revealed in the broad phase.

This is fundamentally different from a sequence of specific questions. The funnel 
questioner uses the source's own output to guide the narrowing process; the list questioner 
uses their pre-interview model to guide every question.

The funnel structure produces more information because the source's broad narrative 
reveals things the questioner didn't know to ask about — and those unexpected revelations 
are often the most valuable.

---

## Evocation: Drawing Out What the Source Knows, Not What the Questioner Assumes

Closely related to autonomy is evocation:

> "Evocation involves drawing-out an individual's emotions and motivations during the 
> interview, paving the way for acceptance and demonstrations of empathy. Indeed, if the 
> interviewer successfully evokes what an individual is feeling in the moment or why 
> they are demonstrating resistance, they can offer acceptance and empathetic prompts 
> that demonstrate a nonjudgmental tone." (p. 57)

Evocation is the active complement of autonomy preservation. Autonomy preservation means 
not imposing the questioner's framework; evocation means actively creating conditions 
for the source's framework to emerge. The questioner asks what the source cares about, 
what they're concerned about, what they find relevant — and lets those priorities 
organize the subsequent inquiry.

In agent terms: an agent that asks a human user "What matters most to you about this 
problem?" before formulating its approach is practicing evocation. An agent that 
immediately launches into its own model of the problem is not.

---

## The Reflective Listening Loop

Reflective listening — repeating back key phrases, summarizing, noting emotional 
content — serves multiple functions simultaneously:

1. **Comprehension verification**: The source can confirm or correct the questioner's 
   understanding, preventing errors from propagating
2. **Autonomy confirmation**: The source receives evidence that their account has been 
   heard, which validates the investment of providing it
3. **Prompting for elaboration**: The act of summarizing often prompts the source to 
   add detail or correct emphasis: "Well, it wasn't exactly that — it was more that..."
4. **Building the shared model**: Each summary-and-correction cycle builds a more 
   accurate shared model of the situation between questioner and source

> "summaries (i.e., offering back a concise, yet detailed, encapsulation of what the 
> individual has said) demonstrate that the interviewer has listened to the individual 
> and offered an opportunity for correction of the statement or transition within the 
> interview." (p. 56-57)

For agent systems: periodic synthesis and reflection — "Here is what I understand so 
far: [synthesis]. Is that accurate?" — serves all four functions simultaneously. 
It is not a delay; it is an information-generating move.

---

## Applications to Agent System Design

### Query Ordering: Broad Before Narrow
Agent queries to any source should begin with broad, open-ended inquiries that allow 
the source to reveal its own structure before the agent imposes its structure. 
Only after a broad exploration should the agent introduce specific, targeted queries — 
and those specific queries should be informed by what the broad exploration revealed.

In practice: when an agent is exploring a new codebase, a new dataset, or a new 
domain, its first queries should be taxonomic and exploratory ("What does this 
system do?", "What are the main entities?", "What are the known failure modes?") 
before becoming specific ("What is the time complexity of function X?").

### Avoid Response Space Contamination
An agent that provides its own hypothesis in the query ("Is this a security vulnerability 
of type Y?") constrains the source to confirming or denying type Y, missing vulnerabilities 
of type Z. An agent that asks "Are there security concerns in this code?" allows the 
source to reveal the full range of concerns.

The cost of open-ended queries is more output to process. The benefit is that the output 
hasn't been pre-filtered by the questioner's model. In high-stakes domains (security, 
medical diagnosis, legal analysis), the benefit typically outweighs the cost.

### Adaptive Routing Based on Source Revelations
An agent pipeline that follows a fixed question sequence regardless of what sources 
reveal is implementing the controlled-interview failure mode. Dynamic routing — where 
each step in the pipeline is determined by what previous steps revealed — is the 
adaptive approach.

This requires that intermediate outputs be inspectable and that the routing logic 
can recognize and respond to unexpected revelations, not just expected ones.

### Summaries as Information-Generating Moves
Build periodic synthesis moves into agent pipelines, particularly in multi-turn 
interactions with human users or when aggregating information from multiple sources. 
The synthesis is not just a report of what was learned — it is a query that invites 
correction, elaboration, and the revelation of what the agent's synthesis missed.

---

## Boundary Conditions

**Autonomy support requires sufficient time**: The 20-minute time limit in the study 
constrained how much autonomy support investigators could provide. In severely 
time-constrained interactions, the funnel structure may need to be compressed, 
reducing its benefits.

**Some sources need structure**: Sources that are uncertain about what is relevant 
or overwhelmed by an open-ended question may benefit from more structure, not less. 
Autonomy support should be calibrated to the source's capacity and context, not 
applied uniformly.

**Open-ended queries produce more output to process**: An agent that elicits broad, 
narrative responses must have the processing capacity to work with that output. 
If downstream processing is capacity-constrained, very open-ended queries may produce 
more than can be effectively used.

---

## Summary Principle

> **Giving a source control over the pace, sequence, and detail level of their account 
> produces more accurate and more complete information than controlling the interaction 
> through tight, specific, sequenced questions. The questioner's model of what is 
> relevant is always incomplete; the source's model contains the information the 
> questioner didn't know they needed. Autonomy support, adaptive following, and 
> reflective listening are not soft social skills — they are information-maximizing 
> strategies grounded in the mechanics of human memory retrieval and cooperative 
> communication.**