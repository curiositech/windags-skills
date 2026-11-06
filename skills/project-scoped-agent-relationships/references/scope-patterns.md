# Project boundaries and relationship continuity

Product descriptions below were checked on November 6, 2026. Product controls can vary by plan, app version, and rollout. Treat help pages as evidence of documented behavior, and verify actual product permissions separately.

## Market precedents

| Evidence | What is documented | What to take from it |
| --- | --- | --- |
| [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) | Projects group chats, instructions and files across devices. Shared projects use project-only memory and cannot reference individual members’ context outside the project. The documentation describes separate rules for sharing a single chat and leaving or copying project chats. | Design an explicit sharing transition. A project boundary and the visible contents of a shared link need separate explanations. |
| [Claude Projects](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) | Claude describes a project memory and a Use account memory setting. Its documented default interaction allows account memory in project work and can let new project memory inform outside-project chats. Turning that setting off is the documented separation control. | Tell people what crosses in both directions. A label such as “project memory” leaves the policy underspecified. |
| [Claude memory and chat search](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) | Claude describes a per-chat memory option across web, desktop and supported mobile versions. That option can leave the chat in searchable history. Claude separately documents incognito and account-level pause or reset. | Model read, write, archive, search and retention individually. |
| [Notion Agent Memories](https://www.notion.com/help/view-your-notion-agent-memories) and [Custom Agent permissions](https://www.notion.com/help/custom-agents-sharing-and-permissions) | Notion documents private per-user memories and separately describes the resources a Custom Agent can access. | An agent's organizational identity, a user's relationship with it, and its tool grants are distinct controls. |
| [Slack agent design](https://docs.slack.dev/concepts/agent-design) | Slack uses different conversation surfaces for different audiences and advises that assistants use context the user is entitled to see. | Apply the boundary to derived answers, not just the chat tab. |
| [MemGPT](https://arxiv.org/abs/2310.08560) | Research prototype using multiple memory tiers to operate beyond a limited context window. | Treat runtime compaction and storage tiers as an implementation choice. Neither is proof of access separation. |
| [Microsoft's Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/) | Research-backed design guidelines emphasize context, correction, and controls across initial, ongoing and long-term interaction. | Make changing scope and recovering from bad recall part of the primary user flow. |

ChatGPT and Claude document different sharing choices. The comparison establishes the need for explicit policy, not a universal product default. A design inference for high-sensitivity work is strict project separation with narrowly approved reuse of personal preferences.

## Capability matrix to fill in

Use a row per interaction and record effective permissions at both start and resume. The values below are example defaults for a portfolio studio.

| Interaction | Can read | Can write | Visible to | Recheck |
| --- | --- | --- | --- | --- |
| Private project conversation | Current project sources plus individually approved account preferences | The active private thread | Thread members | Send, retrieve, resume |
| Shared review | Shared project records allowed to this viewer and the assigned agent | Comments on the shared draft | Members authorized for the review | Open, comment, export |
| Scoped background run | Project and source grants current at execution time | Private artifact and run receipt | Run owner and explicitly permitted viewers | Before each effect, after suspension, before result display |
| Approved import | Previewed excerpt from the selected source | Destination copy only if explicitly requested | Destination audience shown before commit | Preview, confirm, open |
| Notification | Already-authorized event type and opaque target ID | Read or snooze state | Device/account owner per OS settings | Open and resolve target |

Minimum context envelope for the design review:

```text
viewer_id, specialist_id, tenant_id, project_id, conversation_id,
audience_id, artifact_revision, policy_version, source_record_ids,
read_grants, write_grants, allowed_effects, durable_run_id
```

Identifiers are locators and labels. Do not accept them as evidence of access. The execution layer checks current permissions and excludes ineligible records before assembling context. Cache keys include the scope and policy version. Ensure revocation wins over offline replay, old push links and stale cache entries.

## Worked example

Iris knows Mira likes generous type and tight captions. Mira has two projects, **Portfolio** and **Employer work**. She grants only the typography preference to both and keeps the private interview explaining why she left her last role in Portfolio. In Employer work, the desktop header reads “Iris · Employer work” with “Team review” near the reply field. The mobile screen shows the same context before the keyboard. The context sheet lists the typography preference and the current project references, with no trace of the private interview.

Mira starts a mobile upload in Portfolio, switches projects, and later opens “A draft is ready” on a locked phone. The notification opens an authorized revision in Portfolio. If the relevant grant has expired, show a generic access state. Never redirect the old event to the open project or recreate the private text in the notification body.

## User-facing wording to verify

| Situation | Example wording |
| --- | --- |
| Project-only | “Iris can use files and conversations in Portfolio.” |
| Selective portable preference | “Use your typography preference here. The original interview stays private.” |
| Transfer into a shared project | “Copy this excerpt to Employer work. Members of Team review can read the copy.” |
| Return after a break | “Since your last visit, Iris prepared v7. The introduction is ready for review.” |
| Access changed | “This item is unavailable to your current account.” |

Use permission-neutral notification text such as “One update is ready.” Show names, titles, documents or snippets only under the verified preview policy for that audience.

## Verification cases

| Action | Observable proof |
| --- | --- |
| Move A → B with an unsent message or queued upload | Draft and upload remain scoped to A. B presents a fresh or B-scoped draft. |
| Open a direct link after membership was revoked | No document title, avatar-associated snippet or content leaks through UI, notification fallback or export. |
| Insert a unique phrase in a private conversation | No trace in another project’s answers, agent handoff, summaries, search, linked previews or cached results. |
| Widen a project's audience | Preview the recipient view and separate private notes. Verify each as a second member. |
| Reopen after an offline device catches up | No duplicate writes and no stale grant revival. “Last checked” reflects the last verified state. |
| Restore from a compacted conversation | The scope and record provenance survive. The user can reopen the source or see a clear unavailable state. |
