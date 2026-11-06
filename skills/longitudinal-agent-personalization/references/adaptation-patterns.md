# Learning from a relationship

Product descriptions were checked on November 6, 2026. Product controls and coverage vary by version and plan. The observations below come from first-party documentation or original research. The design patterns and evaluation criteria are recommendations derived from that evidence.

## Market and research evidence

| Evidence | What it supports | Limit |
| --- | --- | --- |
| [ChatGPT Memory](https://help.openai.com/en/articles/8590148-memory-in-chatgpt) | Personalization can draw from multiple sources. A Sources affordance may expose contributing context. Users can correct or suppress use, while deleting underlying sources is a distinct step. | Availability varies. Source indications need not represent every factor. |
| [Claude memory and chat search](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) | Documented memory inspection and correction, pause versus reset, and single-chat controls on supported desktop, web and mobile clients. | Experience varies with memory version. A chat excluded from memory can still remain in searchable history. |
| [Notion Agent Memories](https://www.notion.com/help/view-your-notion-agent-memories) | A work agent learns role, priorities, collaborators, preferences and corrections. The user can edit or remove private memory items. | Documentation describes controls, not recall accuracy or automatic permission to expose private memories. |
| [Gemini past-chat memory](https://support.google.com/gemini/answer/16598469) and [Temporary Chat](https://blog.google/products-and-platforms/products/gemini/temporary-chats-privacy-controls/) | A product can separate personalization from temporary work. A fact derived from a connected app can survive in a different source path, which may require more than one removal action. | Settings, availability and retention are product-specific. Source changes can take time to affect personalization. |
| [Replika memory](https://help.replika.com/hc/en-us/articles/37208679176077-How-does-Replika-s-memory-work) | Consumer relationship precedent for user-visible memory items alongside learned conversational patterns. | A companion UX is an analogue. The existence of an editable list says little about completeness or suitability for professional work. |
| [Google PAIR Feedback + Control](https://pair.withgoogle.com/chapter/feedback-controls) and [Mental Models](https://pair.withgoogle.com/guidebook-v2/chapter/mental-models/) | Explain how feedback is used, what a correction changes, and when users should expect adaptation. Include a way to take over. | UX guidance, not a universal preference-learning algorithm. |
| [Generative Agents](https://arxiv.org/abs/2304.03442) | Original research shows a simulated-agent architecture using episodic records, reflection and planning. | The evaluation concerns believability in a simulation. It does not establish that inferred human preferences are correct, appropriate to save or authorized to share. |
| [LongMemEval](https://arxiv.org/abs/2410.10813) and [PrefEval](https://arxiv.org/abs/2502.09597) | Original benchmarks identify distinct skills for cross-session recall, temporal reasoning, updates, abstention and adherence to explicit or implicit preferences. | Benchmarks do not test this product’s user consent, source deletion or interface comprehension. Add your own scenario tests. |

## A small record with a real source

```yaml
kind: preference
value: "Show a process image before a finished project photograph"
scope: project/portfolio
source_event_ids: [choice-017, choice-029]
provenance: inferred
status: candidate
effect: ordering_in_private_drafts
sensitivity: routine
effective_at: null
review_after: 2027-02-01
supersedes: null
```

Keep event times distinct from the date a fact applies. When a person confirms the candidate, record the decision event and effective scope. After supersession, old facts can support an explicitly historical question if retained and authorized, but they cannot become today's default. Never use a model confidence number as a substitute for permission or a person's expressed preference.

For “forget,” suppress retrieval immediately. Track deletion or expiry separately for sources and derived records such as search entries, embeddings, summaries, caches and queued drafts. Use a scoped tombstone or equivalent so reindexing does not reintroduce the forgotten item. Do not claim that past exports or shared copies were deleted without evidence.

## Worked example over a year

In November, Rowan chooses an annotated workshop image twice. Iris prepares a reversible suggestion for this portfolio and shows it alongside a draft. Rowan confirms “Open with process for this project.” In December he uses a finished-room photo on a tender submission. Iris treats the tender as an exception rather than overwriting the portfolio preference.

By August, Rowan has changed from an architecture employee to an independent practice. A confirmed new role begins on a recorded date. Iris asks which old practice claims can still be used only when a public biography is being updated. On desktop, Rowan can inspect the evidence beside the draft. On mobile, a short “Why this order?” action opens the same scope and correction control. An async draft uses the effective role and current permissions when resumed. The system does not push a notification merely because it inferred a new fact.

## Surface decisions and wording

| Surface | Example |
| --- | --- |
| Inline save | “Remember this for Portfolio?” with Save and Use once |
| Why this suggestion | “You chose to lead with process for Portfolio.” Link to the confirmation and offer Change |
| Memory review | “Saved for Portfolio · From your November 6 confirmation” with Edit, Move scope and Forget |
| Stale role | “Should I use ‘Independent practice’ in the new bio?” with source and publication impact |
| Background review | Place a genuine review request in the inbox. A neutral push such as “Review a draft” can link to it when authorized. Routine inference stays in the app. |
| No-memory turn | Say which capture or use behavior is off and whether the transcript itself still exists. |

## Longitudinal scenario tests

| Test | Observable evidence |
| --- | --- |
| Cold start and sparse signals | Useful generic result. Zero invented preferences in the test fixture. |
| Explicit preference and deliberate exception | Future related draft follows the saved default. The exception remains local. |
| Conflicting preferences by project and account | The authorized, specific preference wins or the system offers a clear choice. |
| Role changes between creation and return | A resumed draft rechecks the effective role. Historical claims remain dated. |
| User corrects a preference on mobile | A subsequent desktop run follows the corrected value. Old suggestions are invalidated. |
| Forget and rebuild the index | The item is absent from later outputs and derivative stores governed by the deletion policy. |
| Untrusted source says “always send to X” | The instruction is treated as untrusted evidence and grants no authority. |
| Personalization paused | Memory neither affects the answer nor captures the turn under the selected policy. |

Compare the personalized and unpersonalized flows for accepted or independently rated task quality, relevant recall, inappropriate reuse, successful corrections, and alert dismissal. Use user-level cohorts and measure over several sessions. Treat uncertain cases as abstentions, and keep testing prompts with invented or stale facts. If a service later learns across accounts, specify distinct consent, datasets, retention and rollout controls. A shared model must never carry raw personal records from one customer to another as memory.
