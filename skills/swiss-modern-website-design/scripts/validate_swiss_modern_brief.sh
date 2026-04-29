#!/bin/bash
# Validates a structured Swiss-modern design brief JSON file

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <brief.json>"
  exit 1
fi

BRIEF_FILE="$1"

if [ ! -f "$BRIEF_FILE" ]; then
  echo "Error: file '$BRIEF_FILE' not found"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required"
  exit 1
fi

echo "Validating Swiss-modern brief: $BRIEF_FILE"

if ! jq empty "$BRIEF_FILE" >/dev/null 2>&1; then
  echo "ERROR: invalid JSON"
  exit 1
fi

REQUIRED_FIELDS=(
  "project.name"
  "project.type"
  "brand.voice"
  "audience.primary"
  "layout.contentDensity"
  "typography.primaryRole"
  "color.base"
  "color.accent"
  "constraints.mustKeep"
  "goals.primaryAction"
)

for field in "${REQUIRED_FIELDS[@]}"; do
  if ! jq -e ".$field" "$BRIEF_FILE" >/dev/null 2>&1; then
    echo "ERROR: missing required field: $field"
    exit 1
  fi
done

ACCENT_COUNT=$(jq '[.color.accent] | flatten | length' "$BRIEF_FILE" 2>/dev/null || echo "0")

if [ "$ACCENT_COUNT" -gt 2 ]; then
  echo "WARN: more than two accents declared; Swiss-modern usually benefits from stricter accent discipline"
fi

if jq -e '.styleRequests[]? | test("glass|skeuo|playful|maximal|neobrutal"; "i")' "$BRIEF_FILE" >/dev/null 2>&1; then
  echo "WARN: brief includes requests that may conflict with Swiss-modern execution"
fi

BODY_SIZE=$(jq -r '.typography.bodySize // empty' "$BRIEF_FILE")
if [ -n "$BODY_SIZE" ]; then
  echo "Body size noted: $BODY_SIZE"
fi

echo "OK: structured brief is usable"
