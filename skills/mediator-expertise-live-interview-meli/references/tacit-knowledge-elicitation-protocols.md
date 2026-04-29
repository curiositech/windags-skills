# Tacit Knowledge Elicitation: Why Experts Can't Tell You What They Know, and How to Get It Anyway

## The Core Problem: The Gap Between Knowing and Telling

One of the most important and counterintuitive findings in expertise research is that expert 
practitioners are often *poor* at describing their own expert behavior. This is not because they 
are evasive or inarticulate. It is because the knowledge that makes them expert operates below 
the level of conscious verbal access.

The canonical statement of this problem comes from Nisbett and Wilson (1977), who concluded 
that there may be "little or no direct access to higher order cognitive processes." This finding was 
subsequently supported by Johansson, Hall, Sikström and Olsson (2005), who demonstrated the 
phenomenon of "choice blindness" — people confidently explaining decisions they did not 
actually make, constructing post-hoc narratives that feel true but are fabricated.

Wilson cites these findings not to dismiss expert knowledge, but to argue that *the way we try 
to extract it must change*. The standard approach — asking an expert to write documentation, 
give a lecture, or answer direct questions about what they do — will systematically 
misrepresent expert practice. What you get is "theories-espoused": the expert's idealized 
self-model, shaped by professional norms, training conventions, and what seems appropriate 
to say in a formal context. What you need is "theories-in-use" (Argyris and Schön, 1974, cited 
in Wilson p.3): the actual cognitive operations that drive behavior in real situations.

Crucially, Petitmengen, Remillieux, Cahour and Carter-Thomas (2013) found something that 
partially redeems the situation. Their research showed that while "naïve descriptions of our 
decision-making processes are usually poor and unreliable," it IS possible to access these 
processes through "specific acts consisting in evoking the process and directing one's attention 
towards its different dimensions" (p.667). The implication is significant: with the right elicitation 
protocol, tacit knowledge *can* be made partially explicit. The elicitation method is not 
incidental — it is the entire intervention.

## What the MELI Protocol Teaches About Elicitation

Wilson's Mediator Expertise Live Interview (MELI) is built around four structured "passes" 
derived from Klein's (1999) cognitive task analysis methodology:

1. **Pass 1**: Identify a case — a tough or non-routine event where the practitioner's skills 
   "made a difference." The goal is to anchor the conversation in a specific incident, not 
   general practice.

2. **Pass 2**: Hear the full story without interruption, with only non-directive clarifying 
   questions. This establishes the narrative baseline.

3. **Pass 3**: Probe the expert's thought processes. Not "what do you usually do?" but 
   "what did you think *at that moment*?" and "how did you know what to do?" and 
   "what made you reject the other options?"

4. **Pass 4**: Compare expert to novice behavior. "What would someone with less experience 
   have missed?" "If you'd been involved five years earlier, would your interventions have 
   been the same?"

Each pass serves a different epistemic function. Pass 1 forces specificity — generalities are 
the enemy of tacit knowledge extraction. Pass 2 gives the expert's own narrative without 
interference. Pass 3 is where the real work happens: probing the decision points, the 
perceptual cues, the rejected alternatives, the situational awareness that drove action. 
Pass 4 creates a comparative frame that makes implicit expertise visible by contrast.

The questions Wilson provides for Pass 3 are worth examining in detail as an elicitation 
architecture:

- "What were your initial reactions?" — surfaces the rapid perceptual assessment
- "Which behavioral features did you expect to see, and what did you actually observe?" — 
  surfaces the model-world comparison that experts constantly run
- "What, if anything, was unusual about this case?" — surfaces anomaly detection
- "What did you consider doing, and what made you choose the intervention you chose?" — 
  surfaces option generation and rejection
- "What caused you to reject the other options?" — surfaces the implicit evaluation criteria
- "How did you know what to do at that moment?" — the key question, almost unanswerable 
  directly, but approached through the surrounding context
- "What might have happened if you hadn't done/said that?" — surfaces counterfactual 
  reasoning and consequence modeling
- "Is there anything that you observed which made you change course?" — surfaces 
  feedback loops and mid-action adjustment

These questions are not a questionnaire. They are a navigation system for moving through the 
territory of an expert's decision-making process, finding the points where expertise actually 
operated and shining a light there.

## The Non-Rehearsal Principle

A critical and counterintuitive design choice in the MELI is the request that the interviewee 
*not prepare in advance*. Wilson explains: "one purpose of asking someone not to rehearse or 
prepare is so that the interview can be as extemporaneous as possible, and thus bear some 
resemblance to witnessing that mediator in action" (p.14).

This is not just about spontaneity for its own sake. It is epistemically principled. When experts 
rehearse their "war stories" — the polished accounts of significant cases they tell at conferences 
and in training settings — those stories have been edited by the same process of naïve 
introspection that Nisbett and Wilson warned about. The expert has already constructed a 
coherent narrative that makes them look competent and that fits professional norms. The messy, 
confusing, real-time decision-making process has been retrospectively cleaned up.

The unrehearsed account is *messier* but more truthful. The expert stumbles, contradicts 
themselves, says "I'm not sure why I did that," and then through the probing questions, 
discovers why. That discovery process is itself an instance of tacit knowledge becoming explicit 
— and the audience watching it happen learns something real.

## The "War Story" Problem

Wilson distinguishes the MELI sharply from "war stories" (DeSanto, 2001). A war story is 
a polished, prepared account of professional practice used as a training technique. War stories 
have value — they anchor abstract principles in memorable narratives — but they are not the 
same as expertise elicitation. The problem with war stories is that by the time a practitioner has 
told a story enough times to use it in training, it has been thoroughly retrospectively rationalized.

"[The MELI] draws out a narrative response, but this may or may not be a war story. A primary 
purpose of the MELI is to elicit the mediator's thought processes, and how these determined 
the decisions and actions s/he took (or did not take) at the time" (p.14-15).

The distinction matters because war stories transfer *conclusions* while the MELI transfers 
*process*. An agent system that learns only from documented outcomes learns what worked; 
it does not learn how to recognize when to apply what.

## Application to Intelligent Agent Systems

### The Problem of Agent Self-Report

Agent systems routinely produce logs, traces, and post-hoc explanations of their decisions. 
These are the computational equivalent of naïve introspection. They tell you what the agent 
did and what chain of reasoning it produced — but they may not accurately represent the 
actual computational process that drove behavior, especially in systems using learned 
representations (neural networks, embedding-based retrievals, etc.) where the "reasoning" 
is reconstructed after the decision.

When an agent is asked "why did you make that decision?" and produces an explanation, 
that explanation may be a theory-espoused rather than a theory-in-use. The real drivers of 
the decision may be patterns in training data or embedding space geometry that the 
explanation mechanism cannot access.

This is not just a philosophical problem. It has practical consequences: if you use agent 
self-explanations to tune agent behavior, you may be optimizing the explanation rather than 
the underlying process.

### Elicitation-Based Debugging

The MELI protocol suggests a different approach to agent debugging and improvement. 
Instead of asking an agent to explain its decisions directly, design evaluation protocols that:

1. **Anchor in specific cases**: Don't ask "how do you handle ambiguous requests?" 
   Ask about a specific ambiguous request and trace what happened step by step.

2. **Probe decision points**: At each point where the agent chose between alternatives, 
   examine what features of the input triggered that choice. Build tools that can 
   surface which input features were most influential at each branch point.

3. **Surface rejected alternatives**: What options did the agent implicitly not take? 
   What would a different model configuration have done? The gap between the taken 
   and rejected paths is where expertise (or its absence) lives.

4. **Compare expert to novice behavior**: Run the same case through an agent at 
   different capability levels or with different training. What does the more capable 
   agent see that the less capable one misses? That difference describes what the 
   capability actually consists of.

5. **Avoid leading with general descriptions**: An agent that is asked to describe its 
   general strategy will produce a policy statement that may not match its actual 
   behavior. Start with specific cases, then generalize.

### Knowledge Capture from Human Domain Experts

When building knowledge bases for agent systems — whether through RAG, fine-tuning, 
or explicit skill documentation — the MELI framework provides a superior model for 
knowledge capture from human experts compared to documentation requests or 
structured interviews.

The four-pass approach, applied to domain expert interviews for knowledge capture, would:

1. Ask the expert to identify a representative hard case (not a typical case — edge cases 
   reveal expertise)
2. Let them narrate the full case before any probing
3. Probe decision points: what did you notice, what did you consider, what did you 
   reject and why
4. Ask what a less experienced practitioner would have done differently

The resulting transcripts, properly processed, will contain knowledge that explicit 
documentation requests would never surface.

### The Non-Rehearsal Principle in System Design

The non-rehearsal principle has a structural analog in agent system design: *don't evaluate 
agents on cases they have been optimized for*. Evaluation on training-adjacent cases produces 
the computational equivalent of war stories — polished performance on familiar terrain that 
may not reflect real capability. True capability assessment requires novel cases, edge cases, 
and cases where the agent must improvise.

## Boundary Conditions and Caveats

This framework applies most powerfully when:
- The knowledge being extracted is genuinely tacit (skill-based, pattern-recognition-based, 
  context-dependent)
- The expert has accumulated substantial domain-specific experience (Wilson cites the 
  widely-supported "ten years" threshold from Ericsson)
- The knowledge is not already well-codified in documentation that the expert has internalized

It applies less well when:
- The knowledge is primarily procedural and already explicit (following a regulatory checklist)
- The expert's advantage is mainly in access to information rather than processing of information
- The domain has reliable performance metrics that make outcome-based evaluation sufficient

The MELI also has a social and trust dependency: "a degree of mutual trust is necessary between 
interviewer and interviewee" (p.15). Elicitation protocols that feel interrogative or evaluative 
will produce defensive, theory-espoused responses rather than genuine tacit knowledge access. 
This applies equally to human-agent interactions designed to elicit expert knowledge.