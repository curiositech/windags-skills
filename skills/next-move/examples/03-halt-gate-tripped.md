# Example 03 — Halt Gate Tripped

**Scenario**: User invokes `/next-move` on a repo with two unrelated workstreams in flight.
**Topology**: n/a — pipeline halts before topology selection.
**Outcome**: User clarifies, re-runs, gets a confident plan.

This is the case `/next-move` exists to handle gracefully. Most skills, when faced with ambiguity, predict anyway and produce confident-sounding nonsense. `/next-move` halts.

## 1. User Invocation

```
$ wg next-move
```

Standard invocation. No focus hint.

## 2. Gathered Context (the contradiction)

```json
{
  "git_branch": "main",
  "git_status": " M apps/marketing/components/Hero.tsx\n M apps/marketing/components/Footer.tsx\n M packages/core/src/retrieval/skill-search-service.ts\n M packages/core/src/retrieval/bm25-index.ts",
  "recent_commits": [
    "Polish hero copy",
    "Update footer links",
    "Add testimonials section",
    "Fix navbar sticky behavior"
  ],
  "modified_files": [
    "apps/marketing/components/Hero.tsx",
    "apps/marketing/components/Footer.tsx",
    "packages/core/src/retrieval/skill-search-service.ts",
    "packages/core/src/retrieval/bm25-index.ts"
  ],
  "test_status": { "passing": 1421, "failing": 0, "skipped": 12, "last_run": "2026-04-19T07:00:00.000Z" },
  "conversation_summary": "Working on the project.",
  "active_tasks": [],
  "triple_count": 14
}
```

The contradiction: recent commits are entirely about marketing site polish (Hero, Footer, navbar, testimonials). Modified files are split between marketing site **and** core retrieval engine internals. The conversation summary is generic ("working on the project") and active tasks are empty — no signal about which thread is current focus.

## 3. Sensemaker Output

```json
{
  "inferred_problem": null,
  "problem_classification": "ill-structured",
  "confidence": 0.42,
  "halt_reason": "Two unrelated workstreams visible in modified files: marketing site polish (Hero, Footer) and core retrieval engine (skill-search-service, bm25-index). Recent commits all describe marketing work, but modified files include core changes with no commit yet. Cannot infer which is the current focus.",
  "evidence": [
    "Recent commits 100% marketing-related",
    "Modified files split across two unrelated subsystems",
    "Conversation summary is generic and offers no disambiguation",
    "Active tasks empty"
  ]
}
```

`confidence: 0.42` is well below the 0.6 floor. `halt_reason` is non-null and **specific** — it names the contradiction.

## 4. Halt Gate Decision

**Trip.** Three of the four halt triggers fired:
- Confidence floor: 0.42 < 0.6 ✗
- Wicked classification: no (it's `ill-structured`)
- Explicit halt reason: yes, non-null ✗
- Multi-thread project: yes ✗

Pipeline halts. Decomposer never runs. PreMortem never runs. **No triple is stored** — halts shouldn't pollute training data.

## 5. Halt Response Presented to User

The output uses `templates/halt-gate-response.template.md`:

```
I can't predict a confident next move from the current signals.

What I see:
  • Recent commits are entirely about the marketing site (Hero, Footer, testimonials, navbar).
  • Modified files include marketing components AND core retrieval engine
    (skill-search-service.ts, bm25-index.ts) — two unrelated areas.
  • No commits yet on the core retrieval changes.
  • Conversation summary doesn't name a focus.

Two reasonable next moves exist, but they go in opposite directions:
  1. Finish the marketing polish and ship it.
  2. Continue the retrieval engine work and commit it.

Which one is your current focus? Or are you mid-pivot between them?

(If neither is right and you're working on something else entirely, run
 /next-move --fresh "<what you're actually doing>" to ignore the
 conversation context.)
```

Notice: the halt names the contradiction precisely, lists the resolution options, and offers an escape hatch (`--fresh`).

## 6. User Clarifies

User responds: "Marketing polish — the core retrieval changes are stale from last week, I should probably revert them."

## 7. Re-Run

User runs `/next-move` again. The new conversation summary now includes the clarification.

```json
{
  "conversation_summary": "User is focused on marketing site polish. The core retrieval changes are stale and should be reverted before proceeding."
}
```

This time the Sensemaker is confident:

```json
{
  "inferred_problem": "Revert stale core retrieval changes, then continue marketing site polish (testimonials section finishing touches likely the next sub-task).",
  "problem_classification": "well-structured",
  "confidence": 0.86,
  "halt_reason": null
}
```

Pipeline runs to completion, produces a plan. (The plan itself is a `dag` happy-path — see Example 01 for that shape.)

## What This Example Teaches

1. **The halt is the value.** A confident-sounding wrong plan would have wasted real work. The halt cost 30 seconds.
2. **Halt triggers compound.** Any one of them can fire alone, but here three fired simultaneously. The pipeline halted decisively.
3. **Specificity beats vagueness.** "Things are unclear" doesn't help the user. "Two unrelated workstreams: A and B; recent commits say A but modified files include B" is actionable.
4. **No triple stored on halt.** Halts aren't training signal — they're absence of signal. Don't pollute the attribution DB.
5. **The escape hatch matters.** Mentioning `--fresh` lets the user override conversation context if our inference is itself wrong.
6. **Re-run from scratch, not from the failed Sensemaker.** The clarification changes `conversation_summary`, which changes context, which may change everything downstream. Don't try to splice into a half-completed pipeline.

## Quality Gate for Halt Output

A good halt response:
- [ ] Names the specific contradiction or missing piece.
- [ ] Lists the candidate resolutions if multiple are plausible.
- [ ] Offers a way to override (e.g., `--fresh`).
- [ ] Avoids judgmental language ("you should have…", "your context is bad…").
- [ ] Stays under 15 lines — terse enough to read at a glance.

## Anti-Pattern: Soft-Halt Predict

What `/next-move` must **not** do here:

> Based on the recent commits, you're focused on marketing polish. Here's a plan to add a testimonials section and improve the navbar...

That's predicting. The user might *not* be focused on marketing — the modified core files suggest otherwise. Predicting one thread arbitrarily is worse than admitting the ambiguity. The halt is correct.
