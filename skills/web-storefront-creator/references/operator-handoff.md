# The Operator Handoff: READMEs, FAQs, and the Update System

A storefront build isn't done when checkout works. It's done when the person who owns the store can change a price, mark something sold out, add a product, and answer "where did my money go?" without calling a developer. This reference defines the three documents every build must ship and the standard they must meet.

## The deliverables (from `templates/`)

| Document | Template | Purpose |
|---|---|---|
| `STORE-README.md` | `OPERATOR-README.template.md` | The owner's manual: what exists, where money flows, how to do the five common tasks |
| `STORE-FAQ.md` | `FAQ.template.md` | Deep answers to the questions the operator WILL have in month 3 (taxes, refunds, fees, "the sync failed") |
| `UPDATE-PLAYBOOK.md` | `update-playbook.template.md` | Step-by-step recipes: change a price, add a product, run a sale, retire an item, restock |

Fill every `{{PLACEHOLDER}}`; delete sections that don't apply to the chosen platform route. A template section left generic is worse than absent — it teaches the operator the docs can't be trusted.

## Writing standard

- **Assume no terminal fluency beyond copy-paste.** Every command appears in a fenced block, complete and copy-pasteable, with one sentence saying what it does and one saying what success looks like ("you should see `0 errors`").
- **Name real files and real dashboards.** "Edit `catalog.json`, line with your product's SKU" — not "update the catalog." Link the exact Stripe dashboard pages (payments, payouts, disputes).
- **Every procedure ends with verification.** How does the operator KNOW the price changed? (Check the site, check the Stripe product page, run the dry-run and see "unchanged".)
- **Money paths in plain language.** Customer pays → Stripe holds ~2 days → deposits to {bank}, minus 2.9%+30¢. One diagram or table; no jargon.
- **Failure sections are mandatory.** "If the sync prints an error", "if a customer disputes a charge", "if the site shows the old price" (cache!). The FAQ absorbs the long tail.
- Dates on facts that decay (fees, tax thresholds), with "verify at {url}" pointers.
- Run the finished docs through `make_copy_and_media_human` — operator docs read aloud even more than marketing copy does.

## The update system contract

The system is understandable when this loop is the WHOLE mental model:

```
edit catalog.json  →  validate  →  preview (optional)  →  sync --dry-run  →  sync --apply  →  verify on site
```

Rules that keep it understandable:
1. One file to edit, ever, for product/price/stock changes. If a change requires touching two systems by hand, the build is wrong — fix the automation, not the docs.
2. Dry-run is the default everywhere; `--apply` is always explicit and always shows a diff first.
3. Nothing is deleted: products retire (`active: false`), prices archive. The operator can't destroy history.
4. The scripts print what they did in plain sentences, not JSON dumps.
5. Any recurring manual step gets a wrapper script or Makefile target with a memorable name (`make price-update`), documented in the playbook.

## FAQ depth standard

The FAQ must answer at minimum: where the money goes and when; what fees are actually taken (with a worked example on a real product's price); what to do about a refund request, a chargeback, a lost package; sales tax posture in one paragraph (home-state + marketplace facilitator); what the 1099-K is and current thresholds; how to see what's selling; what happens when stock hits zero; how to pause the store (vacation); what breaks if the domain/host/Stripe account lapses; who to contact (and what it costs) when something's beyond the docs. Answers give the reasoning, not just the steps — the operator will face variants of these questions the doc author didn't predict.
