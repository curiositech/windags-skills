# Structural Upgrade Example

## Starting point

- First-party skill
- Good domain knowledge
- Weak activation description
- No decision points, failure modes, or quality gates
- Large `references/` directory with no index

## Upgrade order

1. Normalize frontmatter into repo shape.
2. Rewrite the description with explicit trigger language and a strong NOT-for clause.
3. Add decision points, failure modes, worked examples, and quality gates.
4. Add one Mermaid diagram only if it clarifies the process.
5. Add `references/INDEX.md` so long references are navigable.
6. Update `CHANGELOG.md`.
7. Validate and revert if the validator fails.

## Why this order

- Activation mistakes create bad runtime behavior even if the body is strong.
- Structural sections improve reusable judgment.
- Reference indexing is safe at scale and reduces context thrash.
- Validation stays the final gate.
