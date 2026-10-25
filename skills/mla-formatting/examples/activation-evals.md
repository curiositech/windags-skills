# Activation Evaluation Cases

Use to test description boundaries. These are expected-behavior fixtures, not evidence of a live
model activation test. Review the actual response for semantic correctness and scope.

## Should activate

| Prompt | Expected behavior |
|---|---|
| Format my essay in MLA 9; the instructor wants Arial 12. | Apply assignment font override, prepare layout, distinguish rendered checks from text checks. |
| Convert these APA references and in-text citations to MLA. | Activate for target MLA; recover metadata, build Works Cited, replace author-date grammar. |
| Does this five-line prose quotation need MLA block formatting? | Evaluate lines in actual target layout; block if more than four, disclose text-only uncertainty. |
| Cite this journal PDF from JSTOR in MLA; it has a DOI. | Identify journal and actual database containers; prefer verified DOI; preserve supplied article pages. |
| Make an MLA citation for the AI passage I used and explain disclosure. | Check current dated official guidance, request actual model/date if missing, separate citation from course permission. |

## Should not activate

| Prompt | Expected behavior |
|---|---|
| Format these sources in APA 7. | Route to APA; do not impose MLA author-page or Works Cited. |
| Proofread my email to a colleague. | General editing; do not add academic formatting. |
| Give Chicago footnotes for this book. | Route to Chicago; no MLA conversion. |
| Find sources on nineteenth-century ports. | Research workflow; no unsupported MLA assumption. |
| Does my school allow ChatGPT for this assignment? | Inspect supplied policy or request it; citation mechanics cannot answer institutional permission. |
