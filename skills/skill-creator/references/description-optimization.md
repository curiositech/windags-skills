# Description Optimization: Detailed Guide

Detailed guidance for the Description Optimization step in skill-creator. Consult this when generating trigger eval queries or when you need to understand how skill triggering works.

---

## How Skill Triggering Works

Understanding the triggering mechanism helps design better eval queries.

Skills appear in Claude's `available_skills` list with their name + description. Claude decides whether to consult a skill based on that description. Key behaviors:

- **Semantic matching, not keyword matching**: Claude reasons about whether the description covers the user's intent. Specific, context-rich descriptions outperform keyword lists.
- **Claude undertriggers**: Claude errs toward NOT activating skills. Make descriptions slightly pushy — explain when the skill should be used, even if it seems obvious.
- **Task complexity matters**: Claude only consults skills for tasks it can't easily handle on its own. Simple, one-step queries may not trigger a skill even if the description matches perfectly. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

This means your eval queries should be substantive enough that Claude would actually benefit from consulting a skill. Simple queries like "read file X" are poor test cases — they won't trigger skills regardless of description quality.

---

## Writing High-Quality Trigger Eval Queries

### The Goal

20 queries total — a mix of should-trigger and should-not-trigger. Queries must be realistic: something a Claude Code or Claude.ai user would actually type. Not abstract, but concrete and specific: file paths, personal context, column names, company names, URLs, a bit of backstory.

**Bad**: `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

**Good**: `"ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"`

Use a mix of lengths. Some in lowercase, some with abbreviations, typos, or casual speech. Focus on **edge cases** rather than clear-cut cases.

### Should-Trigger Queries (8-10)

Design for coverage:
- Different phrasings of the same intent (formal and casual)
- Cases where the user doesn't explicitly name the skill but clearly needs it
- Uncommon use cases (skill used in unusual ways)
- Cases where this skill competes with another but should win
- Cases where the user describes the need indirectly

**Example for skill-creator:**
- `"I want to make a skill for X"` (explicit request)
- `"I have this workflow I keep doing manually, can we automate it as a claude skill?"` (indirect)
- `"My skill isn't triggering right, help me fix the description"` (improvement)
- `"Turn this conversation into a skill — we've figured out a good approach here"` (capture workflow)

### Should-Not-Trigger Queries (8-10)

The most valuable negatives are **near-misses**: queries that share keywords or concepts but actually need something different.

**Avoid**: obviously irrelevant queries. `"Write a fibonacci function"` as a negative for a skill-creator skill is too easy — it doesn't test anything.

**Good negatives**:
- Adjacent domains that share vocabulary
- Ambiguous phrasing where naive keyword matching would trigger but shouldn't
- Cases where the query touches on something the skill does but in a context where another tool is more appropriate

**Example for skill-creator:**
- `"I need to create an MCP server for my project"` (looks like skill-building but it's MCP, not skill-creator)
- `"Help me debug why my Python script is failing"` (general coding, not skill creation)
- `"How do I configure my Claude Code hooks?"` (hooks, not skills)

### Query Length and Style

Include all of these:
- Short, casual: `"how do i make a skill"`
- Medium with context: `"I have a skill that tests PDFs and I want to improve it"`
- Long with backstory: the xlsx example above
- Technical: mentions file paths, tool names, specific workflows
- Non-technical: written by someone unfamiliar with jargon

---

## Optimization Loop Details

The `run_loop.py` script handles everything automatically:

1. **Split**: 60% train, 40% held-out test (stratified by should_trigger)
2. **Evaluate**: Each description is tested 3 times per query (for reliability under model stochasticity)
3. **Improve**: Claude proposes improvements based on which queries failed
4. **Select**: `best_description` is chosen by **test score**, not train score, to avoid overfitting to the training set
5. **Report**: Outputs an HTML report showing results per iteration

The train/test split is the critical safety mechanism — it prevents the loop from optimizing the description to "memorize" your specific eval queries. A description that scores 90% on train but only 60% on test is overfit; the loop rejects it.

### When the Loop Produces Poor Results

If the optimization loop converges to a low test score:

1. **Review your eval queries** — they may be too easy (clear-cut) or the negatives may not be near-misses. Add more edge cases.
2. **Check description length** — descriptions longer than ~200 words may confuse the triggering mechanism. Try a shorter version.
3. **Try manual iteration first** — rewrite the description by hand based on failing queries, then re-run the loop.
4. **Check for skill conflicts** — if another installed skill has overlapping description, they may be competing. Test with and without other skills loaded.

### Understanding the Score Output

```json
{
  "best_description": "...",
  "train_score": 0.88,
  "test_score": 0.75,
  "iterations": [
    {"description": "...", "train_score": 0.72, "test_score": 0.65},
    {"description": "...", "train_score": 0.80, "test_score": 0.72},
    {"description": "...", "train_score": 0.88, "test_score": 0.75}
  ]
}
```

- `train_score`: How well this description matched on the training queries
- `test_score`: How well it matched on held-out queries (the more honest metric)
- A gap of >15% between train and test is a sign of overfitting — the description has been tuned too specifically to the training queries

---

## Description Quality Checklist

Before finalizing any description (whether from the optimization loop or manual rewrite):

```
□ Contains at least one specific verb (creates, reviews, plans, improves, debugs)
□ Names a specific deliverable or domain (not abstract)
□ Has a NOT clause with 2-5 explicit exclusions
□ Name and description are aligned (no contradictions)
□ Under 1024 characters (ideally 25-80 words)
□ No process/workflow details (those go in SKILL.md body)
□ Slightly pushy — tells Claude when to use it, not just what it does
□ Covers synonym variants (e.g., "create skill", "make a skill", "build a skill")
```
