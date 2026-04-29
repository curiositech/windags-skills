#!/bin/bash
# Validates that the Swiss-modern skill package is structurally intact.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

required_files=(
  "$ROOT/SKILL.md"
  "$ROOT/references/swiss-modern-principles.md"
  "$ROOT/references/typography-and-grids.md"
  "$ROOT/references/component-patterns.md"
  "$ROOT/references/frontend-implementation.md"
  "$ROOT/references/research-notes.md"
  "$ROOT/templates/swiss-modern-design-brief.md"
  "$ROOT/templates/swiss-modern-layout.tsx"
  "$ROOT/templates/swiss-modern-tokens.css"
  "$ROOT/scripts/audit_frontend_for_swiss.sh"
  "$ROOT/scripts/validate_swiss_modern_brief.sh"
  "$ROOT/diagrams/INDEX.md"
  "$ROOT/agents/openai.yaml"
)

echo "Validating Swiss-modern skill bundle"

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: missing required file: $file"
    exit 1
  fi
done

bash -n "$ROOT/scripts/audit_frontend_for_swiss.sh"
bash -n "$ROOT/scripts/validate_swiss_modern_brief.sh"
bash -n "$ROOT/scripts/validate_skill_bundle.sh"

if ! rg -q '^name:\s+swiss-modern-website-design$' "$ROOT/SKILL.md"; then
  echo "ERROR: SKILL.md frontmatter name is missing or incorrect"
  exit 1
fi

skill_lines=$(wc -l < "$ROOT/SKILL.md" | tr -d ' ')
echo "SKILL.md lines: $skill_lines"

if [ "$skill_lines" -gt 500 ]; then
  echo "ERROR: SKILL.md exceeds the 500-line target"
  exit 1
fi

echo "Skill bundle looks structurally valid"
