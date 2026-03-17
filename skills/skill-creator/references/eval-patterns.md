# Eval Assertion Patterns

A guide to writing assertions that reliably distinguish a skill working from a skill failing.

The core question for every assertion: **Would a clearly wrong output also pass this?** If yes, the assertion is weak.

---

## The Discriminating Assertion Test

Before finalizing an assertion, mentally apply it to two scenarios:
1. The skill worked perfectly
2. The skill produced empty output / completely wrong output

If both scenarios pass, the assertion is non-discriminating and should be rewritten or dropped.

**Weak**: `"An output file was created"` — an empty file passes this
**Strong**: `"The output CSV contains all 47 rows from the input with the 'margin' column added"`

---

## Patterns by Task Type

### Document Generation (PDF, DOCX, XLSX)

**Good patterns:**
- Check specific content that would only appear if the task was done correctly
  `"The generated report includes the Q3 revenue figure from the input data"`
- Check structural requirements
  `"The DOCX has at least 3 sections: Executive Summary, Findings, and Recommendations"`
- Check that formulas or calculations are correct (not just present)
  `"The SUM formula in column E correctly totals columns B through D"`

**Anti-patterns:**
- `"A PDF file was created"` — file existence alone proves nothing
- `"The document looks professional"` — subjective, not verifiable
- `"All fields are populated"` — need to specify which fields and what values

**Common additions:**
- If a template was provided: `"The output uses the provided template (same header, footer, and branding)"`
- If input data was specified: `"The name 'Jane Doe' appears in the client section"`

### Data Extraction / Transformation

**Good patterns:**
- Spot-check specific values you can verify from the input
  `"The extracted phone number for John Smith is 555-1234"`
- Check counts when verifiable
  `"All 12 rows from the input appear in the output (no rows dropped)"`
- Check format compliance
  `"All dates are in ISO 8601 format (YYYY-MM-DD)"`

**Anti-patterns:**
- `"Data was extracted correctly"` — vague and unverifiable
- `"The output is a valid JSON file"` — trivially satisfied
- `"The extraction was complete"` — no way to verify without checking values

**Common additions:**
- For multi-column transforms: check the most error-prone column specifically
- For aggregations: verify at least one known aggregate value

### Code Generation

**Good patterns:**
- Check that the code runs without errors (executable assertion via script)
  `"python generated_script.py exits with code 0"`
- Check specific function signatures or class structures
  `"The code defines a function named 'process_records' that takes a list parameter"`
- Check output correctness on a known input
  `"Running the code on test input [1,2,3] produces [2,4,6]"`

**Anti-patterns:**
- `"The code looks correct"` — subjective
- `"The file contains Python code"` — trivially satisfied
- `"The function is implemented"` — existence ≠ correctness

**Common additions:**
- `"The code does not contain placeholder comments like 'TODO' or 'pass'"` — checks for stub implementations
- `"The code imports only standard library modules"` if that's a requirement

### Content Writing / Editing

Good writing assertions focus on structure and required content, not subjective quality.

**Good patterns:**
- `"The output is between 400 and 600 words"`
- `"The text mentions all three product names from the brief: Apex, Horizon, and Summit"`
- `"The output has exactly 5 bullet points"`
- `"The subject line is under 60 characters"`

**Anti-patterns:**
- `"The writing is clear and engaging"` — subjective
- `"The output is well-structured"` — too vague
- `"The tone matches the brand"` — needs to be defined precisely to be testable

**When to skip assertions entirely:** For open-ended creative tasks where quality is entirely subjective (e.g., "write a poem in the style of X"), skip assertions and rely on human review. Forcing assertions on subjective output creates false confidence.

### Workflow / Multi-step Processes

**Good patterns:**
- Check that each required step produced its expected artifact
  `"A transcript.md file exists in the run directory"`
- Check the final output, not intermediate steps
  `"The final merged document contains content from all three input sections"`
- Check that the skill's own scripts were used (via transcript)
  `"The transcript shows the skill's extract_data.py script was called"`

**Anti-patterns:**
- `"All steps were followed"` — unverifiable
- `"The process completed successfully"` — tautological if there's an output
- Checking every intermediate step — over-specification; breaks if the skill improves its approach

### File / Format Validation

When output format compliance matters, be specific:

**Good patterns:**
- `"The output file is a valid ZIP (starts with PK header bytes)"`
- `"The generated JSON is valid (parses without errors)"`
- `"The image dimensions are 1024x768 pixels"`

For these assertions, write a script — don't eyeball it:

```python
# check_valid_json.py
import json, sys
try:
    json.loads(open(sys.argv[1]).read())
    print("PASS")
except json.JSONDecodeError as e:
    print(f"FAIL: {e}")
    sys.exit(1)
```

---

## Assertion Volume

**2-4 assertions per eval is the sweet spot.** More than 5 creates noise; fewer than 2 leaves gaps.

Prioritize assertions that:
1. Test the most important output quality (the one thing that must be right)
2. Would catch the most common failure mode for this type of task
3. Can be verified programmatically (via script, not eyeballing)

---

## Non-discriminating Assertion Patterns to Avoid

These assertion types rarely add value — they tend to pass for both good and bad outputs:

| Pattern | Why it's weak |
|---------|---------------|
| `"A file was created"` | Even an empty file passes |
| `"The output is not empty"` | A single whitespace character passes |
| `"No errors occurred"` | Checks process, not output quality |
| `"The output looks reasonable"` | Subjective and not verifiable |
| `"The skill was invoked"` | Tests mechanism, not outcome |
| `"The transcript has N steps"` | Step count is an implementation detail |

---

## Scripted Grading

For assertions that can be verified mechanically, always write a script rather than having the grader agent eyeball it. Script checking is faster, more consistent, and can be reused across iterations.

**Example: verify row count**
```python
#!/usr/bin/env python3
import csv, sys
with open(sys.argv[1]) as f:
    rows = list(csv.reader(f))
# Header + 47 data rows = 48 total
assert len(rows) == 48, f"Expected 48 rows, got {len(rows)}"
print("PASS")
```

**Example: verify PDF is non-empty and has expected page count**
```python
#!/usr/bin/env python3
import subprocess, sys
result = subprocess.run(["pdfinfo", sys.argv[1]], capture_output=True, text=True)
for line in result.stdout.splitlines():
    if "Pages:" in line:
        pages = int(line.split(":")[1].strip())
        assert pages >= 3, f"Expected at least 3 pages, got {pages}"
        print(f"PASS ({pages} pages)")
        sys.exit(0)
print("FAIL: could not determine page count")
sys.exit(1)
```

Save these scripts to the skill's `scripts/` directory so they can be reused across eval iterations.

---

## The Grader's Criterion for Assertion Quality

When grading, always ask: could a clearly wrong or empty output accidentally satisfy this assertion? If yes, flag it in `eval_feedback` with a concrete suggestion for how to make it more discriminating.

Good assertion improvement cycle:
1. Write assertion
2. Run eval
3. Grader flags it as weak
4. Tighten the assertion
5. Rerun — a tightened assertion should fail on the old (worse) output
