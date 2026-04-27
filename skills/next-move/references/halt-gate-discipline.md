# Halt-Gate Discipline

**The hardest skill in `/next-move` is refusing to predict.** A confident-sounding wrong plan costs the user real work. A halt costs them 30 seconds and a clarifying question. The asymmetry is large. Lean toward halting.

## The Four Halt Triggers

The Sensemaker emits a `halt_reason` when **any** of the following are true. Only one needs to fire.

| Trigger | What it looks like | Why it halts |
|---|---|---|
| **Confidence floor** | `sensemaker.confidence < 0.6` | The model itself doesn't believe its inference. Anything you build on top inherits that uncertainty. |
| **Wicked classification** | `problem_classification === 'wicked'` | The problem is value-laden, has no stopping criterion, or the stakeholders disagree on the goal. No DAG can solve it; only a human conversation can. |
| **Explicit halt reason** | Sensemaker returned a non-null `halt_reason` string | The model saw something specific (contradictory signals, missing context, multi-tenant ambiguity) and named it. Trust this. |
| **Multi-thread project** | Repo signals show ≥2 unrelated workstreams with no dominant thread | Picking one secretly is worse than asking. |

## What "Halt" Actually Looks Like

Do **not** soft-halt by predicting a small/safe move. That's still predicting. A real halt:

1. Stops the pipeline before `decomposer` runs.
2. Surfaces the **specific** ambiguity — not "things are unclear."
3. Asks the user to choose a direction, narrow scope, or supply missing context.
4. Stores nothing in `.windags/triples/` (no triple = no false training signal).

Use `templates/halt-gate-response.template.md` for the output shape.

## Borderline Cases (the real judgment calls)

These are the cases where two reasonable operators would disagree.

### Confidence 0.55–0.65

This is the noisy band. Treat 0.6 as a hard floor when **any** of these are also true:
- The branch has fewer than 3 commits (you don't have history to anchor on).
- `git_status` is empty AND `conversation_summary` is generic ("help me with my project").
- The skill catalog audit shows `gap_count > 5` for the inferred problem (you're going to recommend skills you don't have).

If confidence is 0.55–0.65 and **none** of the above amplifiers fire, predict but mark every node `commitment_level: 'TENTATIVE'` and surface confidence prominently.

### "ill-structured" classification

`ill-structured` is **not** an automatic halt. It means the problem is messy but tractable. Most real engineering work is ill-structured. Halt only if `confidence < 0.6` *and* the problem is ill-structured. Either alone is fine.

### Conflicting signals

A tell: `recent_commits` describe one workstream but `modified_files` are in a totally different area. Examples:
- Recent commits: "fix auth middleware" — modified files: `apps/marketing/components/Hero.tsx`
- Recent commits: "ship blog post" — modified files: `packages/core/src/retrieval/*.ts`

This is almost always real ambiguity (the user pivoted) and a halt is correct. Do not paper over it by picking the more recently-touched files — that hides a project-level decision.

### Wicked but framed as well-structured

The user says: "Decide if we should rewrite the auth system." The Sensemaker's first instinct is `well-structured` because the verb is "decide." This is a wicked problem dressed in well-structured clothing. Force the classification to `wicked` if:
- The decision involves trade-offs across stakeholders ("the team," "leadership," "users").
- There's no agreed-upon stopping criterion ("rewrite is done when…").
- The choice is reversible only at high cost.

Then halt. `/next-move` is not the right tool for org-shaping decisions.

## What NOT to Halt On

These look halt-worthy but aren't:

| Looks like a halt | Actually | What to do |
|---|---|---|
| `git_status` is dirty with 50+ files | User has been working hard | Predict. Many uncommitted changes is signal, not noise. |
| `test_status.failing > 0` | Tests are red | Predict — fixing the red tests is often *the* next move. |
| User says "I don't know what to do next" | They want you to pick | Predict. That's literally the use case. |
| Confidence is 0.85 but classification is `ill-structured` | Normal engineering | Predict with confidence. |
| The repo has multiple packages | Monorepo, not multi-thread | Predict for the package the user has been touching. |

## How to Phrase a Halt

Bad halt (vague):
> The next move isn't clear. Can you provide more context?

Good halt (specific):
> I see two unrelated workstreams in the recent activity:
> - Recent commits: marketing site (Hero, footer, blog posts).
> - Modified files: `packages/core/src/retrieval/skill-search-service.ts`.
>
> Which one are you focused on right now? Or is one a leftover I should ignore?

The rule: a good halt names the contradiction precisely enough that the user can resolve it in one sentence.

## After a Halt

When the user resolves the ambiguity:
- Re-gather signals (the resolution may have changed `conversation_summary`).
- Re-run the Sensemaker — it may now classify confidently.
- Do **not** skip back to the Decomposer with the prior Sensemaker output. The whole pipeline rebuilds on the new framing.

## Anti-Patterns

- **Halting because the prediction is hard.** Halts are about ambiguity in the *input*, not difficulty in the *output*.
- **Predicting and adding a "by the way, this is uncertain" footnote.** The user will ignore the footnote and use the plan. Halt instead.
- **Using halt as a way to avoid commitment.** A `TENTATIVE` commitment level on every node is more honest than a halt when you have enough signal to predict.
- **Halting on a single missing piece of context.** If you can predict from the rest, predict and flag the gap as a node ("verify X before proceeding").

## Quality Gate

Before sending the prediction:
- [ ] Did I check the four halt triggers explicitly?
- [ ] If any borderline case applied, did I name which amplifier(s) tipped me?
- [ ] If I halted, did I name the specific contradiction?
- [ ] If I predicted under low confidence, did I mark nodes `TENTATIVE`?
