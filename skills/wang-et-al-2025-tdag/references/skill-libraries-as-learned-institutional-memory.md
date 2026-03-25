# Skill Libraries as Learned Institutional Memory: How Agent Systems Accumulate Expertise Over Time

## The Skill Library Concept

Section 4.2.2 introduces a deceptively simple idea: after completing a subtask, the agent **summarizes its solution process** and stores it as a "skill" for future use.

```
Skill format:
- Name: Short identifier
- Detail: Description of the subtask type
- Solution: How the subtask was solved
```

When a new subtask arrives, **retrieve similar skills** using semantic similarity (SentenceBERT embeddings, θ=0.7 threshold, top-k=2) and provide them as reference examples.

This is more profound than it appears. The skill library is essentially **learned documentation**—the system teaches itself how to solve problems based on its own execution history.

## Why This Differs From Voyager's Skills

The paper explicitly contrasts with Voyager (Wang et al., 2023a), a Minecraft agent that also uses skill libraries:

"The concept of a skill library is inspired by voyager, but with crucial adaptations. Unlike the environment of voyager, where the correctness of skills are directly verifiable through environmental feedback, our benchmark environment cannot guarantee the correctness of a skill. Therefore, the skills our agents develop are subject to continuous refinement in response to variable tasks and environmental conditions" (Section 4.2.2).

**Voyager's context**: Minecraft is deterministic. If skill "mine_diamond" works once, it works forever. Skills are **proven solutions**.

**TDAG's context**: Travel planning is stochastic and contextual. A skill "book afternoon train Shanghai→Beijing" might work today (train available) but fail tomorrow (train sold out), or work for one user (flexible schedule) but fail for another (rigid deadline). Skills are **heuristics**, not proofs.

This necessitates different architecture:

**Voyager**: Skills are immutable code. Once learned, they're trusted.

**TDAG**: Skills are suggestions. Retrieved skills guide agents but are adapted to current context. "A agent dedicated to skill modification oversees the library, updating existing skills based on new data and experiences" (Section 4.2.2).

## How Skills Are Generated

The paper doesn't provide the exact prompts, but describes the process (Section 4.2.2 and Algorithm 1, lines 7-9):

1. **Subtask completes successfully** (line 7)
2. **Agent summarizes its process** (line 8): 
   ```python
   s ← subagent_i.SummarizeProcess()
   ```
3. **Skill library is updated** (line 9):
   ```python
   L ← Processor.UpdateSkillLibrary(L, s)
   ```

**Inferred prompt for summarization**:
```
You just completed this subtask: {subtask_description}

Your actions were: {action_history}

Summarize your solution in this format:
- Name: [Short, memorable name for this solution approach]
- Detail: [What type of problem does this solve?]
- Solution: [Step-by-step approach that worked]

Focus on the approach that can generalize to similar problems.
```

**Example output** (inferred from travel domain):

```
Name: Book_Alternative_Train_When_Preferred_Sold_Out
Detail: User wants to travel from City A to City B on Date D at preferred time T, but that specific train is sold out.
Solution:
1. Query database for all trains from A to B on Date D
2. Filter for trains departing within ±3 hours of preferred time T
3. Sort by (proximity to T, price)
4. Check seat availability for top 3 results
5. Book first available train
6. Update subsequent subtasks with actual departure time
```

This skill captures a solution *pattern*, not a specific instance.

## Skill Retrieval and Application

When subagent_i is generated for subtask t_i, the system:

1. **Embeds subtask description** using SentenceBERT (Appendix B.1: model "all-mpnet-base-v2")
2. **Queries skill library** for similar skill details:
   ```python
   similar_skills = skill_library.query(
       embedding=subtask_embedding,
       threshold=0.7,
       top_k=2
   )
   ```
3. **Provides skills to subagent** as reference text

**Example**:

**Current subtask**: "Book train from Guangzhou to Shanghai on July 15, prefer morning departure"

**Retrieved skill** (similarity=0.82):
```
Name: Book_Morning_Train_For_Inter_City_Travel
Detail: Book train between major cities with morning departure preference
Solution:
1. Query "inter_city_transportation" table with origin, destination, date
2. Filter for departure_time between 07:00-11:00
3. Sort by departure_time (earliest first) then price
4. Check seats_available > 0
5. Book top result
```

**How subagent uses this**: The skill provides a **strategy** but not rigid instructions. The subagent adapts:
- Uses "Guangzhou" and "Shanghai" for origin/destination (not the generic "origin" and "destination" from skill)
- Uses actual date July 15 (not generic "date")
- May adjust time window if no 07:00-11:00 trains available

Skills are **inspirations**, not scripts.

## Skill Deduplication and Refinement

Appendix B.1 details the implementation:

**Deduplication criteria**:
- Compute similarity between new skill's detail and existing skills' details
- If ≥k similar skills already exist (similarity >θ), reject new skill
- Parameters: k=2, θ=0.7

**Rationale**: Prevents library pollution with redundant skills while allowing genuinely novel skills.

**Example**:

Library contains:
1. "Book train for inter-city travel, morning preference" (similarity=0.85 to new skill)
2. "Book train for inter-city travel, evening preference" (similarity=0.75 to new skill)

New skill: "Book train for inter-city travel, afternoon preference"

**Outcome**: Rejected (2 existing skills with similarity >0.7). The existing skills are deemed sufficient; adding a third is redundant.

**But**: If new skill had unique characteristics (e.g., "Book train with wheelchair accessibility"), similarity would be lower (<0.7) and skill would be added.

**Refinement mechanism**: "A agent dedicated to skill modification oversees the library, updating existing skills based on new data and experiences" (Section 4.2.2).

Though not detailed in the paper, this implies:

```python
def update_skill_library(library: SkillLibrary, new_summary: Summary) -> SkillLibrary:
    similar_skills = library.find_similar(new_summary, threshold=0.7)
    
    if len(similar_skills) >= 2:
        # Skill is redundant, but may improve existing skills
        for skill in similar_skills:
            if new_summary.success_rate > skill.success_rate:
                # New approach is better, update skill
                skill.solution = merge_solutions(skill.solution, new_summary.solution)
    else:
        # Skill is novel, add to library
        library.add(new_summary)
    
    return library
```

Skills **evolve** as agents discover better approaches.

## Why This Is Institutional Memory

In human organizations, "institutional memory" refers to collective knowledge that persists beyond individuals:
- Documented procedures ("how we do things here")
- Lessons learned from past projects
- Best practices accumulated over time
- Workarounds for known problems

Traditionally, in software systems:
- **Procedures** = code
- **Lessons learned** = bug reports, postmortems
- **Best practices** = design documents
- **Workarounds** = comments in code

All written by humans, static, requiring manual updates.

TDAG's skill library provides **dynamic institutional memory**:
- **Procedures** = skills (generated from agent behavior)
- **Lessons learned** = implicit (failed approaches aren't stored, successful ones are)
- **Best practices** = skills retrieved most frequently (high utility)
- **Workarounds** = skills for handling edge cases (e.g., "when train sold out, query nearby times")

This memory is:
1. **Self-generated**: Agents create it from their own experience
2. **Self-updating**: Skill modification agent refines it as better approaches are discovered
3. **Self-pruning**: Unused skills can be marked low-priority (though paper doesn't detail this)

## Measuring Skill Library Value

The ablation study (Table 2) shows agent generation (including skill library) contributes ~5% improvement (46.69→49.08). But this aggregate masks important dynamics:

**Early in task execution**: Skill library is empty or sparse. Agent generation provides minimal benefit because there are no relevant skills to retrieve.

**Later in task execution**: Skill library has accumulated solutions from early subtasks. Later subtasks benefit from retrieval.

**Over multiple tasks**: Skill library accumulates solutions from all tasks. Each new task starts with more institutional memory than the previous task.

The paper doesn't report **cross-task learning** (does Task 2 benefit from skills learned in Task 1?), but the architecture supports it—skills are stored persistently and retrieved by similarity, regardless of which task generated them.

**Expected learning curve**:
```
Task 1:  49.08 score (baseline, sparse skill library)
Task 10: 52-55 score (warm library, common subtasks have good skills)
Task 50: 54-58 score (mature library, even rare subtasks have relevant skills)
```

**For WinDAGs**: Track skill library growth over time:
- Total skills stored
- Retrieval frequency per skill (which skills are most useful?)
- Contribution to success rate (does providing skills improve subagent performance?)

If skill library isn't improving performance over time, either:
1. Skill generation is poor (summarization doesn't capture useful patterns)
2. Skill retrieval is poor (similarity search isn't finding relevant skills)
3. Skill application is poor (subagents ignore skills)

## Implementation Strategy for WinDAGs

### 1. Skill Storage

```python
class Skill:
    id: str
    name: str
    detail: str  # Stored as text
    detail_embedding: np.ndarray  # For retrieval
    solution: str
    metadata: Dict[str, Any]  # Created_at, success_rate, usage_count, etc.

class SkillLibrary:
    skills: List[Skill]
    embedder: SentenceBERT  # "all-mpnet-base-v2"
    
    def add(self, skill: Skill):
        # Check deduplication
        similar = self.query(skill.detail_embedding, threshold=0.7, top_k=2)
        if len(similar) >= 2:
            # Update existing skills instead of adding
            self._merge_skill(skill, similar)
        else:
            self.skills.append(skill)
    
    def query(self, embedding: np.ndarray, threshold: float, top_k: int) -> List[Skill]:
        similarities = [cosine_similarity(embedding, s.detail_embedding) 
                        for s in self.skills]
        ranked = sorted(zip(self.skills, similarities), key=lambda x: x[1], reverse=True)
        return [s for s, sim in ranked if sim >= threshold][:top_k]
```

### 2. Skill Generation Prompt

```python
def generate_skill(subtask: Subtask, actions: List[Action], result: Result) -> Skill:
    prompt = f"""
    You just completed this subtask: {subtask.description}
    
    Your successful actions were:
    {format_actions(actions)}
    
    The result was: {result}
    
    Summarize this into a reusable skill:
    1. Name: Brief, descriptive (e.g., "Book_Train_With_Time_Constraint")
    2. Detail: What general problem does this solve? (e.g., "Book transportation between cities when user has specific time requirements")
    3. Solution: Step-by-step approach that worked, generalized to similar problems
    
    Focus on the STRATEGY, not the specific values. Use placeholders like [ORIGIN], [DESTINATION], [DATE].
    """
    
    return llm.generate(prompt)