# Troubleshooting

Common errors and fixes when running skill-creator workflows.

---

## Eval viewer / generate_review.py

### "Address already in use" when launching the viewer

The viewer tries to bind to a port (default 8765). If something is already there:

```bash
# Find and kill the old server
lsof -ti :8765 | xargs kill -9

# Or just use a different port
python eval-viewer/generate_review.py <workspace>/iteration-N --port 8766
```

### Viewer launches but shows no runs

The viewer discovers runs by looking for directories with an `outputs/` subdirectory inside them. If your directory structure doesn't match, it finds nothing.

Check that your workspace has this layout:
```
iteration-N/
└── eval-<name>/
    └── with_skill/
        └── run-1/
            └── outputs/       ← this directory must exist
```

If you put outputs directly in `with_skill/` (not inside `run-1/`), both the viewer and `aggregate_benchmark.py` will miss them.

### No display / "webbrowser.open() failed" in headless environments

Pass `--static` to write a self-contained HTML file instead:

```bash
python eval-viewer/generate_review.py <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  --static /tmp/review.html
```

Then open `/tmp/review.html` in your browser. The "Submit All Reviews" button will download `feedback.json` to your Downloads folder.

---

## `claude -p` failures (run_eval.py, run_loop.py)

### "CLAUDECODE environment variable" error

The scripts already strip `CLAUDECODE` from the subprocess environment. If you see this error anyway, it may be from a nested wrapper. Try running the script outside of a Claude Code session, or check if a shell hook is re-setting the variable.

### Process hangs / timeout

`run_eval.py` has a `--timeout` flag (default 30 seconds per query). If your skill is slow to respond:

```bash
python -m scripts.run_eval ... --timeout 60
```

For `run_loop.py`, pass `--timeout 60` as well.

### "No SKILL.md found" error

The `--skill-path` argument must point to the **directory** containing `SKILL.md`, not to `SKILL.md` itself.

```bash
# Wrong
python -m scripts.run_loop --skill-path /path/to/my-skill/SKILL.md ...

# Right
python -m scripts.run_loop --skill-path /path/to/my-skill/ ...
```

### "claude: command not found"

The scripts require the `claude` CLI to be installed and on your PATH. Install it with:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## aggregate_benchmark.py

### "No eval directories found"

The script looks for directories matching `eval-*` inside the benchmark directory. If your eval directories use a different naming prefix, the script won't find them.

Rename directories to start with `eval-` or pass a custom `--benchmark-dir` that contains the `eval-*` directories.

### Grading results not included / pass rate shows 0%

The aggregator reads `grading.json` from each `run-*` subdirectory inside each config directory. If `grading.json` is missing from a run directory, that run is skipped with a warning.

Check that:
1. The grader agent was run for each config/run combination
2. `grading.json` exists at `eval-<name>/with_skill/run-1/grading.json`
3. The `grading.json` is valid JSON with a `summary.pass_rate` field

### `eval_id` extraction warning

The aggregator tries to parse `eval_id` from `eval_metadata.json` first, then falls back to the directory name. If your eval directory is named `eval-fill-simple-form`, the fallback tries `int("fill")` which fails and uses the directory index instead. This is harmless but causes a warning. Fix it by ensuring `eval_metadata.json` has a numeric `eval_id` field.

---

## quick_validate.py / package_skill.py

### "Unexpected key(s) in SKILL.md frontmatter"

Valid frontmatter keys are: `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`. Any other key causes validation to fail.

Common mistakes:
- Using `tags:` (not a valid top-level key — move to `metadata.tags`)
- Using `pairs-with:` (not a valid key — this is a skill-creator-internal concept, not part of the spec)
- Using `author:` (not a valid key — remove it or move to `metadata`)

### "Description is too long"

The description field has a hard limit of 1024 characters. Check the length:

```bash
python -c "
import yaml, re
content = open('SKILL.md').read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
fm = yaml.safe_load(m.group(1))
print(len(fm['description']), 'chars')
"
```

### Packaging fails validation

`package_skill.py` runs `quick_validate.py` before packaging. Fix any validation errors first, then repackage.

---

## Mid-run recovery

### A subagent crashed mid-iteration

If a with_skill or without_skill subagent died before saving outputs:

1. Don't re-run the whole iteration — just re-run the failed subagent with the same prompt and output path
2. If grading already happened for some runs, don't re-grade those — the aggregator handles partial results
3. If you need to rerun from scratch: delete the iteration directory and start a new iteration

### feedback.json not found after clicking "Submit All Reviews"

In headless/static mode, the viewer downloads `feedback.json` to the browser's default download folder (usually `~/Downloads/`). Check there. If multiple downloads occurred, look for `feedback (1).json` etc. — take the most recent one.

Copy it to the workspace:
```bash
cp ~/Downloads/feedback.json <workspace>/iteration-N/feedback.json
```

---

## check_self_contained.py false positives

The `check_self_contained.py` validation script can produce phantom reference warnings for two patterns that are NOT real problems:

### Path-like patterns in prose

The checker uses a regular expression to match file path patterns (e.g., `folder/filename.ext`). If your documentation prose contains a phrase that looks like a path — such as a folder name, a slash, and a filename — the checker may flag it as a phantom reference even when it's just descriptive text.

Examples of phrases that can trigger false positives:
- A sentence like "Better scripts and tools that produced better output?" in `agents/analyzer.md` where "scripts" and a word containing a slash are read as a path
- File paths that appear inside markdown bold markers (`**...**`) where the closing `**` is included in the matched filename

**Resolution**: These are false positives. No action needed if the actual files being referenced exist.

### scripts/__init__.py and scripts/utils.py shebang warnings

The `validate_skill.py` script flags these files for missing shebangs (`#!/usr/bin/env python3`). However, `__init__.py` is a Python module initializer and `utils.py` is a library module — neither is meant to be run directly as a script. Adding shebangs would be misleading.

**Resolution**: This is a false positive. These files correctly lack shebangs.
