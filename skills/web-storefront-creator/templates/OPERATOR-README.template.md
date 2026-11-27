# {{STORE_NAME}} — Owner's Manual

Last updated: {{DATE}}. This is the manual for running your store. It assumes no
programming knowledge — every command here is copy-paste. Keep it next to the till.

## What your store is made of

| Piece | What it is | Where |
|---|---|---|
| Your website | The pages customers see | {{SITE_URL}} — code in `{{REPO_PATH}}` |
| `catalog.json` | The ONE file that defines every product, price, and stock count | `{{CATALOG_PATH}}` |
| {{PAYMENT_PROVIDER}} | Takes card payments, deposits to your bank | {{PROVIDER_DASHBOARD_URL}} |
| Product feed | A file that lists your products for Google and Instagram | {{FEED_URL}} |
| These docs | README (this file), FAQ, Update Playbook | same folder |

## Where the money goes

1. A customer pays on your site → {{PAYMENT_PROVIDER}} processes the card.
2. {{PAYMENT_PROVIDER}} keeps its fee: **{{FEE_SUMMARY, e.g. 2.9% + 30¢ per sale}}**.
   On a {{EXAMPLE_PRICE}} sale you receive **{{EXAMPLE_NET}}**.
3. The rest lands in your bank account **{{BANK_NAME}} (…{{LAST4}})** on a
   {{PAYOUT_SCHEDULE, e.g. 2-business-day rolling}} schedule.
4. See every payment and payout: {{PROVIDER_DASHBOARD_URL}}/payments and /payouts.

Set aside roughly **25–30% of profit** for income + self-employment tax. Details in the FAQ.

## The one loop to remember

Every product, price, or stock change is the same five steps:

```
1. Edit catalog.json          (change the number or add the product)
2. {{VALIDATE_COMMAND}}       (checks you didn't break anything — expect "0 errors")
3. {{SYNC_DRY_RUN_COMMAND}}   (shows what WOULD change — read it)
4. {{SYNC_APPLY_COMMAND}}     (actually applies it)
5. Look at the live site      (hard-refresh: Cmd+Shift+R)
```

Step-by-step recipes for each task (change a price, add a product, run a sale,
mark sold out, restock) are in **UPDATE-PLAYBOOK.md**.

## The five most common tasks

| I want to… | Go to |
|---|---|
| Change a price | Playbook §1 |
| Add a new product | Playbook §2 |
| Mark something sold out / restock | Playbook §3 |
| Run a sale | Playbook §4 |
| Retire a product | Playbook §5 |

## When something goes wrong

- **A customer wants a refund** → do it fast from {{PROVIDER_DASHBOARD_URL}}/payments
  (find the payment → Refund). A refund costs you nothing extra; a chargeback costs $15+. FAQ §Refunds.
- **The site shows an old price** → it synced, but your browser or the site cache
  is stale. Hard-refresh; if it persists: {{CACHE_FIX_COMMAND_OR_NOTE}}.
- **A sync command printed an error** → nothing was half-applied; the scripts are safe
  to re-run after fixing the reported line. FAQ §Sync errors.
- **Anything else** → the FAQ is long on purpose; search it first (Cmd+F).

## Accounts you own (keep credentials in {{PASSWORD_MANAGER}})

| Account | Used for | Login |
|---|---|---|
| {{PAYMENT_PROVIDER}} | payments, refunds, payouts | {{EMAIL}} |
| {{HOSTING}} | the website itself | {{EMAIL}} |
| {{DOMAIN_REGISTRAR}} | the domain name (renews {{RENEWAL_DATE}}) | {{EMAIL}} |
| Google Merchant Center | free Google Shopping listings | {{EMAIL}} |
| Meta Commerce Manager | Instagram/Facebook shop | {{EMAIL}} |

If the domain or hosting lapses, the store goes dark — both renew on
{{RENEWAL_SUMMARY}}. Calendar reminders are set for {{REMINDER_DATES}}.
