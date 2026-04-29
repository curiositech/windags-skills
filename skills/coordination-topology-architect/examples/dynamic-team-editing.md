# Example: Manager-Driven Editorial Team

Problem:
- "Get this launch brief to publishable quality, but only activate the roles needed each round and let the lead pull in a legal reviewer if a claim looks risky."

Why this is not just workflow:
- active roles change round by round
- lead decides assignments
- lead may add a new role midstream
- final ship call is holistic, not just one reviewer verdict

Chosen topology:
- planning: manager-driven team
- compatibility label in current schema: `team-loop`
- runtime today: plan-only or explicit `workflow` projection if you can formalize the rework path
