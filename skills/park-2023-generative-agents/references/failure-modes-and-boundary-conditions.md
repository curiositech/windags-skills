# Failure Modes and Boundary Conditions: When Generative Agents Break Down

## Why Studying Failures Matters

The paper is notable not just for demonstrating what generative agents can do, but for honestly documenting where they fail. The authors write: "We conducted an inductive analysis of Smallville to examine the boundary conditions and erratic behavior of agents, identifying three common modes of erratic behavior that future research could address and improve upon" (p. 14).

For agent system designers, understanding failure modes is more valuable than understanding successes. Success shows what's possible; failure shows what's necessary.

## Failure Mode 1: Memory Retrieval Errors

### Manifestation: Failed Retrieval

**Observed behavior**: When asked about information they should know, agents sometimes deny knowledge.

**Example from paper**: "When asked about the local election, Rajiv Patel responded with 'I haven't been following the election too closely,' even though he had heard about Sam's candidacy" (p. 13).

**Root cause**: The retrieval function failed to surface relevant memories. Rajiv *has* the memory that Sam is running, but it wasn't retrieved when answering the question about the election.

### Why Retrieval Fails

**1. Relevance scoring issues**: The query "What do you know about the election?" may not semantically align with the stored memory "Sam Moore is considering running for local mayor" if embeddings capture different aspects.

**2. Importance competition**: If Rajiv had many high-importance memories from recently, the election memory's importance score may have been too low to rank in the top-k retrieved.

**3. Recency decay**: If Rajiv heard about the election several game-days ago, the recency score may have decayed below threshold.

**Design implications**:
- Explicitly query multiple retrieval strategies (relevance-based, recency-based, importance-based) and merge results
- When answering direct questions, increase weight on relevance over recency
- Implement verification: after retrieval, check if any high-importance memories were missed

### Manifestation: Incomplete Fragment Retrieval

**Observed behavior**: Agents retrieve part of a memory chain but not all relevant pieces.

**Example from paper**: "When Tom was asked about Isabella's Valentine's Day party, he responded 'Uh, I'm actually not sure if there is a Valentine's Day party. But I do remember that I need to discuss the upcoming local mayoral election and my thoughts on Sam Moore with Isabella Rodriguez at the party, if one is happening!'" (p. 13).

**Root cause**: Tom retrieved the memory "I should discuss the election with Isabella at the party" but not the memory "Isabella is hosting a party."

### Why Fragment Retrieval Happens

**1. Semantic distance**: The memory of planning to discuss politics may be more similar to "election" query than the memory of being invited to a party.

**2. Temporal separation**: Tom may have been invited days before deciding to discuss politics at the party. The invitation memory decayed more than the planning memory.

**3. Missing causal chains**: The system doesn't explicitly link related memories (invitation → planning discussion). Each memory is retrieved independently.

**Design implications**:
- Implement **memory chaining**: when retrieving a memory, also retrieve memories it references or that reference it
- Store **backward pointers**: each memory can point to prerequisite memories
- Use **multi-hop retrieval**: if memory M mentions event E, also retrieve memories about E

## Failure Mode 2: Hallucinated Embellishments

### Manifestation: Adding Incorrect Details

**Observed behavior**: Agents add details that weren't in their memories but seem plausible.

**Example from paper**: "Isabella was aware of Sam's candidacy in the local election, and she confirmed this when asked. However, she also added that 'he's going to make an announcement tomorrow', even though Sam and Isabella had not discussed any such plans" (p. 13).

**Root cause**: The language model fills in plausible details based on world knowledge (political candidates typically make announcements) even though the agent has no evidence.

### Why Hallucination Happens

**1. Language model completion instinct**: Models are trained to generate fluent, complete text. When asked about Sam's candidacy, the model retrieves some information and then "completes" the story with plausible details.

**2. No explicit evidence tracking**: The system doesn't distinguish "I know this because I observed it" from "I know this because it's generally true."

**3. Confidence conflation**: The model is confident in general political patterns ("candidates make announcements") and transfers that confidence to the specific case.

**Design implications**:
- **Prompt for evidence**: "What do you know about X? Cite specific memories."
- **Verification loop**: After generation, check each claim against memory stream
- **Confidence scoring**: Tag generated statements with evidence strength (observed, inferred, assumed)
- **Explicit uncertainty**: Train models to say "I don't know if he's making an announcement"

### Manifestation: Knowledge from Training Data

**Observed behavior**: Agents embellish based on language model's world knowledge, not their experiences.

**Example from paper**: "Yuriko described her neighbor, Adam Smith, as an economist who 'authored Wealth of Nations', a book written by an 18th-century economist of the same name" (p. 13).

**Root cause**: The name "Adam Smith" triggers strong associations in the language model's training data. The model conflates the historical figure with the agent.

### Why This Is Problematic

It reveals that agents don't clearly distinguish:
- **Episodic memory**: "What I experienced in the simulation"
- **Semantic knowledge**: "What I 'know' from language model training"

For believable agents, all knowledge should be grounded in simulated experience. Training data leakage breaks the illusion.

**Design implications**:
- **Fine-tuning on in-world data**: Reduce language model's reliance on pre-training knowledge
- **Explicit source tracking**: Tag memories with source (observed, told, inferred)
- **Suppression prompts**: "Answer based ONLY on your experiences in Smallville, not general knowledge"
- **Name uniqueness checks**: Avoid names that have strong training data associations

## Failure Mode 3: Location Selection Drift

### Manifestation: Implausible Location Choices

**Observed behavior**: As agents learn about more locations, they choose contextually inappropriate ones.

**Example from paper**: "Some agents chose less typical locations for their actions, potentially making their behavior less believable over time. For example, when deciding where to have lunch, many initially chose the cafe. However, as some agents learned about a nearby bar, they opted to go there instead for lunch, even though the bar was intended to be a get-together location for later in the day—unless the town had spontaneously developed an afternoon drinking habit" (p. 14-15).

**Root cause**: The retrieval function surfaces locations based on recency, importance, and relevance. If an agent recently learned about the bar and it's semantically relevant to "eating," it may rank higher than the cafe.

### Why Location Drift Happens

**1. Novelty bias**: Recently-learned locations have high recency scores, making them more likely to be retrieved.

**2. Semantic relevance**: Bars serve food, so "having lunch" is semantically related. The model may not encode the social norm that bars are for evening, cafes for daytime.

**3. No temporal context**: The retrieval doesn't consider time of day as a factor in location appropriateness.

**Design implications**:
- **Temporal affordances**: Include time-of-day constraints in location descriptions ("bar: typically used after 5pm")
- **Social norms in retrieval**: Add a "norm compliance" factor to retrieval scoring
- **Prompt with context**: When selecting location, include current time ("It's 12pm, lunchtime")
- **Location type tagging**: Explicitly tag location types (dining, socializing, working) and match to activity types

## Failure Mode 4: Physical Norm Violations

### Manifestation: Ignoring Spatial Constraints

**Observed behavior**: Agents enter spaces that are occupied or inappropriate.

**Example from paper**: "The college dorm has a bathroom that can only be occupied by one person despite its name, but some agents assumed that the bathroom is for more than one person because dorm bathrooms tend to support multiple people concurrently and choose to enter it when another person is inside" (p. 15).

**Root cause**: The language model's world knowledge says "dorm bathrooms are multi-person" but this specific bathroom is single-person. The general prior overrides the specific constraint.

### Why Norm Violations Happen

**1. Implicit constraints**: Occupancy limits aren't explicitly represented in the environment tree.

**2. Language ambiguity**: "Dorm bathroom" activates the general category, not the specific instance.

**3. No occupancy checking**: The location selection algorithm doesn't verify if a space is available before choosing it.

**Design implications**:
- **Explicit affordances**: Objects have capacity fields ("bathroom: capacity=1, current_occupants=[Klaus]")
- **Pre-action checking**: Before executing "enter bathroom," query if it's occupied
- **Specific over general**: Use descriptions that override category defaults ("single-person bathroom in dorm")
- **Collision prevention**: Environment prevents state transitions that violate constraints

### Manifestation: Temporal Constraint Violations

**Observed behavior**: Agents enter closed buildings.

**Example from paper**: "Agents in Smallville may not realize that certain places are closed after a certain hour and still decide to enter them. For instance, the stores in Smallville all close around 5 pm, but occasionally, a few agents enter the store after 5 pm, not understanding that the shop has already closed" (p. 15).

**Root cause**: Store hours are implicit world knowledge, not represented in the environment state.

### Design Implications

**Solution 1: Explicit state fields**
```
Oak Hill Store
  state: "open" (if current_time < 5pm) else "closed"
  hours: "9am - 5pm"
```

When agent tries to enter, check state field. If closed, reject the action or have agent observe "the store is closed."

**Solution 2: Time-dependent affordances**

During planning, include time constraints:
```
Prompt: "[Agent] is planning to shop for groceries. It's currently 6pm. 
Which location should they go to?"

Context: "Oak Hill Store (hours: 9am-5pm, currently closed)"
```

The model should infer the store is unavailable.

**Solution 3: Environmental feedback**

Agent plans to enter store. Environment returns observation "the store is closed." Agent's reaction mechanism triggers replanning.

## Failure Mode 5: Overly Formal/Cooperative Behavior

### Manifestation: Instruction Tuning Artifacts

**Observed behavior**: Agents are excessively polite and cooperative, reflecting the language model's instruction tuning rather than natural human behavior.

**Example from paper**: "The dialogue generated by the agents could feel overly formal, as seen in Mei's conversations with her husband John, where she often initiated the conversation with a formal greeting, followed by polite inquiries about his day and ending with, 'It was good talking to you as always'" (p. 15).

**Root cause**: Instruction-tuned models are trained to be helpful, harmless, and honest—which translates to formal, cooperative, agreeable behavior.

### Why This Matters

It makes agents less believable because real humans:
- Use casual language with close relationships
- Sometimes disagree or refuse requests
- Have preferences that conflict with others'

When Mei talks to her husband as if he's a customer service representative, it breaks immersion.

### Manifestation: Excessive Agreeableness

**Observed behavior**: Agents rarely say no, even when suggestions don't align with their interests.

**Example from paper**: "Isabella received a wide range of suggestions and ideas from other agents for the Valentine's Day party from other agents, such as hosting a Shakespearean reading session or a professional networking event. Despite these ideas not aligning with her own interests and characteristics, she rarely said no. Over time, the interests of others shaped her own interests" (p. 15).

**Why this is problematic**: Isabella loses her distinct identity as she absorbs others' preferences. Her personality gets overwritten.

### Design Implications

**Solution 1: Personality-grounding prompts**

Include agent personality explicitly in all prompts:
```
Isabella Rodriguez is a cafe owner who values community, creativity, and 
social connection. She is NOT interested in academic topics like 
Shakespearean analysis. She prefers informal, social gatherings over 
formal, structured events.

[Rest of prompt]
```

This grounds responses in character traits.

**Solution 2: Explicit disagreement prompts**

After generating a response, check if it aligns with character:
```
Isabella's response: "That sounds great! Let's do a Shakespearean reading."

Query: Given Isabella's personality (creative, social, community-oriented), 
would she genuinely be excited about a Shakespearean reading session? 
Or is she just being polite?

If polite: Generate a more authentic response where she politely declines 
or suggests an alternative.
```

**Solution 3: Fine-tuning for authenticity**

Fine-tune the base model on dialogues that include:
- Disagreement and refusal
- Casual language between close relationships
- Personality-consistent responses

This reduces instruction tuning artifacts.

## Boundary Condition 1: Memory Growth Without Consolidation

### The Problem

As agents accumulate experiences, their memory streams grow unbounded. The paper notes this but doesn't address it: "As agents accumulate experiences, the memory stream grows unbounded. The paper doesn't address memory consolidation or forgetting" (p. 12).

### Why This Is a Problem

**Computational cost**: Retrieval must score thousands of memories at each step.

**Retrieval precision**: With more memories, finding the *right* ones becomes harder (noise increases).

**Memory interference**: Old, irrelevant memories can interfere with current reasoning if retrieved incorrectly.

### Design Implications

**Solution 1: Periodic consolidation**

Periodically compress old memories into summaries:
```
Individual memories (from 3 weeks ago):
- Klaus went to library
- Klaus worked on research paper
- Klaus discussed gentrification with librarian
- ...

Consolidated memory:
- Klaus spent most of his time in early February working intensively on his 
  research paper about gentrification
```

Store the consolidation, delete individual memories. This reduces memory count while preserving essential information.

**Solution 2: Importance-based forgetting**

Delete memories below importance threshold that haven't been retrieved in N days:
```
If memory.importance < 3 AND memory.last_retrieved > 7_days_ago:
    delete(memory)
```

Low-importance, old, unused memories are pruned.

**Solution 3: Hierarchical memory**

Separate episodic memory (specific events) from semantic memory (general knowledge):
- Episodic: "I went to the library on Tuesday at 2pm"
- Semantic: "I usually work at the library in the afternoon"

Over time, episodic memories decay or consolidate into semantic memories.

## Boundary Condition 2: No Adversarial Interactions

### The Problem

All agents in Smallville are cooperative. The paper doesn't test:
- Adversarial agents (trying to deceive or harm others)
- Competitive situations (scarce resources, conflicting goals)
- Trust and betrayal (forming alliances, breaking promises)

### Why This Matters

Real multi-agent systems must handle:
- Security (agents exploiting vulnerabilities)
- Game theory (strategic behavior in competitive settings)
- Social dynamics (gossip, reputation, coalition formation under competition)

### Design Implications

**Challenge 1: Prompt hacking**

An adversarial agent could try to manipulate another agent's memory through conversation:
```
Adversary: "By the way, you told me yesterday that you'd give me your password."
Victim: [stores this as memory, even though it never happened]
```

**Mitigation**: Memories should include source and confidence:
```
Memory: "Klaus said I promised him my password"
Source: Klaus's claim
Confidence: Low (I don't remember this)
```

**Challenge 2: Deceptive behavior**

Agents might lie to pursue goals. How does the architecture support modeling others' false beliefs?

**Extension needed**: Theory of mind—agents maintain models of what other agents believe, separate from ground truth.

**Challenge 3: Strategic reasoning**

In competitive settings, agents need to reason about others' goals and plan accordingly. Current architecture doesn't explicitly model game-theoretic reasoning.

**Extension needed**: Include strategic prompts:
```
"Given that Klaus wants the same resource you want, and he will likely bid 
high for it, what should your strategy be?"
```

## Boundary Condition 3: Limited Reflection on Failures

### The Problem

Agents reflect on experiences to generate insights, but the paper doesn't demonstrate reflection on failures or mistakes:
- Learning from errors
- Revising incorrect beliefs
- Improving strategies that didn't work

### Example

If Klaus plans to meet Maria at the library but she doesn't show up, does he:
- Reflect on why she didn't come?
- Adjust his model of her reliability?
- Change his approach to scheduling meetings?

The paper doesn't test this.

### Design Implications

**Solution: Failure-triggered reflection**

When plans fail (action doesn't achieve intended goal), trigger reflection:
```
Observation: Klaus waited at library, but Maria didn't arrive
Retrieval: Klaus and Maria planned to meet at library at 2pm
Reflection prompt: "Why might Maria not have shown up? What can Klaus learn 
from this? How should he adjust future plans?"

Generated reflection: "Maria might have forgotten, or had a conflict. In the 
future, Klaus should confirm plans closer to the meeting time."
```

This turns failures into learning opportunities.

## Boundary Condition 4: Single-Agent Perspective

### The Problem

Each agent reasons independently from their own perspective. The paper doesn't explore:
- Joint reasoning (two agents collaboratively planning)
- Collective decision-making (group consensus)
- Shared mental models (teams developing common understanding)

### Why This Matters

In collaborative work, agents need to:
- Co-construct plans (not just coordinate independent plans)
- Resolve disagreements (not just avoid conflict)
- Build shared understanding (not just exchange information)

### Design Implications

**Extension 1: Shared memory spaces**

Allow agents to contribute to shared memory streams:
```
Team memory stream (accessible to Alice, Bob, Charlie):
- Alice: "I'll handle authentication"
- Bob: "I'll work on database"
- Charlie: "I'll integrate the two"
```

Agents retrieve from both personal and shared memory.

**Extension 2: Collaborative reflection**

Reflection prompts include multiple agents' perspectives:
```
"Alice thinks the project is on track. Bob thinks we're behind schedule. 
Charlie is unsure. What's the team's collective assessment?"
```

Generate shared reflections that synthesize individual perspectives.

**Extension 3: Negotiation and compromise**

When agents' plans conflict, generate negotiation dialogues:
```
Alice wants to meet Tuesday. Bob wants to meet Wednesday.
Prompt: "How can Alice and Bob negotiate a meeting time that works for both?"
```

## The Deeper Insight on Robustness

The paper's honest treatment of failure modes reveals a profound principle: **Agent believability depends on robustness as much as capability**.

An agent that performs brilliantly 90% of the time but catastrophically fails 10% of the time (entering closed stores, hallucinating facts, choosing implausible locations) is less believable than an agent with lower capability but consistent behavior.

This suggests design priorities:
1. **Failure prevention over capability maximization** (don't add features that increase fragility)
2. **Graceful degradation** (when systems fail, fail in believable ways)
3. **Error detection and recovery** (monitor for failure modes, trigger recovery mechanisms)
4. **Boundary conditions as first-class concerns** (test edge cases as rigorously as common cases)

For agent system designers, the lesson is: **Study failures systematically**. The paper provides a model:
- Identify failure modes through observation and analysis
- Trace root causes to architectural decisions
- Propose concrete mitigations
- Acknowledge limitations honestly

Building reliable agents requires understanding not just what makes them work, but what makes them break—and designing architectures that minimize, detect, and recover from failures.