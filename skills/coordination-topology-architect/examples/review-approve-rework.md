# Example: Review / Approve / Rework

Problem:
- "Have two writers draft sections, then a reviewer decides whether to ship, request rework, or escalate."

Why this is not a DAG:
- reviewer verdict changes routing
- rejected work loops back
- escalation is conditional

Chosen topology:
- planning: `workflow`
- runtime today: `workflow`

Key structure:
- coordinator -> worker-a
- coordinator -> worker-b
- workers -> reviewer
- reviewer -> approved delivery
- reviewer -> rejected rework back-edge
- reviewer -> escalate human gate
