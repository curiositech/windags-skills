# The Code Training Paradox: When Specialization Helps and When It Hurts

## The Unexpected Finding

One of the most counterintuitive results in AgentBench is the ambivalent effect of code training on agent performance. The CodeLlama series (models specifically fine-tuned on code) shows a striking pattern:

**Where CodeLlama-34b excels**:
- Web Shopping: 52.1% (vs. Llama2-70b: 5.6%)
- Database: 14.0% (vs. Llama2-70b: 13.0%)

**Where CodeLlama-34b struggles**:
- Digital Card Game: 8.4% (vs. Llama2-70b: 21.3%)
- Operating System: 2.8% (vs. Llama2-70b: 9.7%)

This is paradoxical. The Digital Card Game doesn't involve coding, yet the non-code-trained model does better. The Operating System task *does* involve bash commands (code), yet the code-trained model does worse. What's happening?

## The Teaching: Code Training Optimizes for Procedural Execution at the Cost of Strategic Flexibility

Code training doesn't just teach syntax—it shapes how models *think*. Code is fundamentally procedural: explicit steps executed in sequence, with deterministic results. Training on code pushes models toward procedural reasoning patterns.

This is beneficial when the task itself is procedural (follow template, execute steps, verify results). It's detrimental when the task requires strategic flexibility (adapt to opponent, explore possibilities, reason counterfactually).

## Evidence from AgentBench Environments

### Web Shopping: Where Procedural Thinking Wins

Web Shopping has a clear template:
1. Search for keywords based on requirements
2. Filter results by attributes (price, color, etc.)
3. Select product matching criteria
4. Click "buy now"

This is essentially a **code-like procedure**. There's a correct sequence of steps, and following the sequence reliably yields success.

**CodeLlama-34b's completion rate**: 50.3%
**Llama2-70b's completion rate**: 36.5%

CodeLlama's advantage: It treats the task as executing a template. When faced with "buy a queen size bedspread in redwood, price < $70," it:
- Extracts parameters (queen, redspread, redwood, <$70)
- Executes search(bedspread)
- Applies filters sequentially
- Verifies result matches all criteria

This is structurally similar to executing a function with parameters. Code-trained models excel at this pattern.

**Supporting evidence**: CodeLlama's trajectories show highly consistent structure across different products. Llama2's trajectories show more variation, including false starts and strategy switches. The consistency reflects procedural thinking.

### Digital Card Game: Where Procedural Thinking Loses

The Digital Card Game (Aquawar) requires:
- Assessing opponent's fish types and abilities
- Reasoning about multi-turn strategies (if I attack now, they might counter, so I should...)
- Adapting to unexpected plays
- Strategic deception (guess opponent's identities)

This is **non-procedural**. There's no template to follow. Success requires:
- Counterfactual reasoning ("what if I had done X instead?")
- Opponent modeling ("what will they do given what they know?")
- Strategy adaptation ("my plan isn't working, try something different")

**CodeLlama-34b's reward**: 8.4
**Llama2-70b's reward**: 21.3

Llama2's advantage: It's not biased toward procedural execution. It can explore multiple strategies, adapt when a strategy fails, and reason about the opponent as an active agent (not a passive environment).

**Supporting evidence**: CodeLlama's failed trajectories show repetitive action patterns—it finds a strategy (e.g., "always use AOE attack") and sticks to it even when it's failing. Llama2's trajectories show more strategic diversity.

### Operating System: The Paradox

Operating System tasks involve bash commands (code), yet CodeLlama underperforms. Why?

**The key distinction**: OS tasks are not primarily about *writing code*—they're about *interacting with a system*. The challenge is:
- Understanding what the system state is (what files exist, what permissions are set)
- Deciding what to ask the system (what commands will reveal needed information)
- Interpreting system output (error messages, file listings)

This is closer to **dialogue with a complex environment** than to code generation.

**Example task**: "Find all files in /etc owned by users without /home directories"

**CodeLlama's approach** (procedural):
```bash
# Generate commands in sequence
ls /etc
cat /etc/passwd
# ... generates syntactically correct bash but doesn't adapt to outputs
```

**Llama2's approach** (interactive):
```bash
ls /etc                    # See what's there
[observes: many files]
getent passwd              # Check user info
[observes: some users lack /home]
find /etc -user username   # Check ownership
[observes: several matches]
# Adapts strategy based on observations
```

The difference: Llama2 treats the OS as a dialogue partner, adjusting queries based on responses. CodeLlama treats it as a code execution environment, generating scripts without tight feedback loops.

**Why code training hurts here**: Code training emphasizes batch processing (write complete script, run it, get result). OS interaction requires incremental querying (run command, observe, adjust next command). The procedural bias of code training is misaligned with the interactive nature of OS tasks.

## The Mechanism: How Code Training Changes Reasoning

### Procedural Priming

Code training exposes models to millions of examples of:
- Function definitions (clear input → output mappings)
- Sequential execution (step 1, step 2, step 3...)
- Deterministic logic (if X, then Y, no ambiguity)

This creates a **procedural prior**: When faced with a task, the model's first instinct is to decompose it into sequential steps and execute them in order.

This prior helps when tasks actually are sequential (web shopping template). It hurts when tasks require exploration, adaptation, or strategic reasoning.

### Reduced Stochasticity in Action Selection

Analysis of CodeLlama trajectories shows lower action diversity than Llama2:
- CodeLlama tends to repeat similar actions round after round
- Llama2 shows more exploration of different approaches

**Hypothesis**: Code training reduces exploration behavior. Code values correctness over diversity—there's usually one right answer, and you should find it, not explore alternatives. This bias carries over to agent tasks, reducing the model's willingness to try diverse strategies.

### Stronger Commitment to Plans

Code emphasizes upfront planning: Define the function signature, then implement the body. Changing course mid-implementation is discouraged (you don't redesign the function interface after writing half the code).

This creates a **plan commitment bias**: Once CodeLlama commits to a strategy, it's less likely to abandon it even when it's failing.

**Evidence**: In Card Game, CodeLlama continues using failing strategies (e.g., AOE attack every turn) far longer than Llama2. In Web Shopping, this same persistence is beneficial (stick to the template, don't get distracted).

## Design Implications for Agent Systems

### 1. Route Tasks Based on Procedural vs. Strategic Nature

**Procedural tasks** (benefiting from code training):
- Template-following workflows (booking, shopping, form-filling)
- Multi-step processes with clear sequences (setup → configure → execute → verify)
- Tasks with deterministic outcomes (query database, call API, parse response)

**Strategic tasks** (harmed by code training):
- Adversarial scenarios (games, negotiations, competitive agents)
- Open-ended exploration (research, investigation, discovery)
- Tasks requiring adaptation (when plan A fails, try plan B, C, D...)

**Routing rule**:
```python
if task.has_clear_template() and task.steps_are_sequential():
    use_model("code-trained")  # CodeLlama, CodeGen
elif task.requires_strategy() or task.is_adversarial():
    use_model("general")       # Llama2, GPT, Claude
else:
    use_model("most-capable")  # Default to best available
```

### 2. Combine Code and General Models via Ensemble

For tasks with both procedural and strategic elements:
- Use code-trained model for procedural subtasks (generate queries, parse outputs)
- Use general model for strategic subtasks (decide what to query, adapt plan)

**Example: Complex Database Task**:
```
Task: "Analyze database and generate report of anomalies"

Planning phase (general model):
  - Decide what constitutes an anomaly
  - Plan what queries will reveal anomalies

Query generation phase (code-trained model):
  - Generate specific SQL queries
  - Parse query results

Analysis phase (general model):
  - Interpret results
  - Decide if more queries are needed
  - Adapt strategy based on findings
```

This exploits each model's strengths while avoiding their weaknesses.

### 3. Detect When Procedural Bias Causes Failure

Monitor for signs that code training's procedural bias is harming performance:
- **Repetitive actions without adaptation**: Model repeats same strategy despite failure
- **Ignoring feedback**: Model continues executing plan despite error messages or poor results
- **Lack of exploration**: Model doesn't try alternative approaches

When detected, either:
- Switch to general model
- Inject explicit strategy diversity requirements ("try 3 completely different approaches")
- Force plan revision ("your current strategy isn't working; generate entirely new strategy")

### 4. Use Code Training for Syntax, Not Strategy

Even in procedural tasks, separate syntax generation from strategic decisions:

**Strategic decision** (general model):
```
"Given that we need to find users without home directories, 
what's the best approach?"
→ "Query /etc/passwd for users with non-standard home directories"
```

**Syntax generation** (code-trained model):
```
"Generate bash command to query /etc/passwd for users 
with home directories not starting with /home"
→ "grep -v '^[^:]*:[^:]*:[^:]*:[^:]*:/home' /etc/passwd"
```

This leverages code training's strength (precise syntax) without its weakness (inflexible strategy).

### 5. Consider Task-Specific Fine-Tuning Instead of General Code Training

AgentBench suggests that *what you train on* shapes *how you think*. Rather than using general code-trained models, consider task-specific fine-tuning:

- **Web shopping agent**: Fine-tune on web shopping trajectories specifically
- **Database agent**: Fine-tune on SQL query-response cycles specifically
- **Card game agent**: Fine-tune on strategic game play specifically

This gives models task-appropriate reasoning patterns without the baggage of general code training.

**Trade-off**: Requires data and compute for task-specific fine-tuning. But for high-value, frequently-used agent skills, the performance gain may justify it.

## The Broader Lesson: Training Distribution Shapes Reasoning Style

Code training is just one example of a broader phenomenon: **What models train on shapes how they reason, not just what they know.**

Other examples from AgentBench:
- **RLHF on helpfulness**: Models over-explain, even when conciseness is required
- **Training on web text**: Models default to verbose, explanatory text even when formal outputs (JSON, SQL) are needed
- **Training on dialogue**: Models perform multi-turn interaction well but struggle with batch processing tasks

**Design principle**: When selecting or training models for agents, consider not just capability (can it do X?) but reasoning style (does it think in ways appropriate for X?).

## When Code Training Is Essential

Despite the limitations, code training is critical for:

1. **Syntax precision tasks**: Generating compilable code, valid SQL, correct API calls
2. **Formal verification**: Tasks where outputs must satisfy strict formal constraints
3. **Template instantiation**: Filling structured templates with specific values

In these cases, the procedural bias is exactly what you want. The model should follow the template rigidly, not explore alternatives.

**Recommendation**: Maintain both code-trained and general models in your agent infrastructure. Route tasks based on whether procedural rigidity or strategic flexibility is more important.

## Open Questions

AgentBench raises but doesn't fully answer:

1. **Can we fine-tune away the procedural bias?** Train on code but also on strategic tasks, balancing the priors.
2. **Can we prompt code-trained models to be more exploratory?** Explicit instructions like "try multiple diverse strategies" might overcome the procedural bias.
3. **Is the code training effect generalizable?** Would training on other formal domains (mathematics, logic) show similar procedural bias?

These are avenues for future research.

## Summary: Code Training as a Trade-Off

The core teaching: **Code training is not a pure win. It trades strategic flexibility for procedural precision.**

For agent systems:
- **Use code-trained models** when tasks are template-like, sequential, deterministic
- **Avoid code-trained models** when tasks are adversarial, exploratory, adaptive
- **Combine both** for complex tasks with procedural and strategic elements
- **Monitor for procedural bias** (repetition, lack of adaptation) as a failure signal
- **Consider task-specific fine-tuning** instead of general code training

The lesson for WinDAGs: Don't assume "better at code = better at agents." Task structure matters more than raw capability. A weaker model with the right reasoning style can outperform a stronger model with the wrong style.