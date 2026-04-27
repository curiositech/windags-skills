#!/usr/bin/env bash
# validate-prediction.sh — JSON-Schema validate a PredictedDAG file.
#
# Usage:
#   ./validate-prediction.sh <file.json>
#   ./validate-prediction.sh -            # read from stdin
#
# Exits 0 if valid, 1 if invalid (with errors printed to stderr).
# Uses ajv-cli if available, otherwise falls back to a basic structure check.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
SCHEMA="$SCRIPT_DIR/../schemas/predicted-dag.schema.json"

if [[ ! -f "$SCHEMA" ]]; then
  echo "Error: schema not found at $SCHEMA" >&2
  exit 2
fi

if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 <file.json | ->" >&2
  exit 2
fi

INPUT_FILE="$1"
if [[ "$INPUT_FILE" == "-" ]]; then
  INPUT_FILE=$(mktemp)
  trap 'rm -f "$INPUT_FILE"' EXIT
  cat > "$INPUT_FILE"
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Error: file not found: $INPUT_FILE" >&2
  exit 2
fi

# Fast path: ajv-cli for proper JSON Schema 2020-12 validation
if command -v ajv >/dev/null 2>&1; then
  if ajv validate -s "$SCHEMA" -d "$INPUT_FILE" --spec=draft2020 2>&1; then
    echo "valid"
    exit 0
  else
    exit 1
  fi
fi

# Fallback: basic structural check via jq (no full schema validation)
echo "Note: ajv-cli not installed; running basic structure check only." >&2
echo "Install with: npm install -g ajv-cli ajv-formats" >&2

REQUIRED_FIELDS='["title","problem_classification","confidence","waves","estimated_total_minutes","estimated_total_cost_usd","premortem"]'

MISSING=$(jq -r --argjson req "$REQUIRED_FIELDS" '
  [$req[] | select(. as $f | $f | in(.) | not)] | join(", ")
' "$INPUT_FILE" 2>/dev/null || echo "FAILED")

if [[ "$MISSING" == "FAILED" ]]; then
  echo "Error: input is not valid JSON" >&2
  exit 1
fi

if [[ -n "$MISSING" ]]; then
  echo "Missing required fields: $MISSING" >&2
  exit 1
fi

# Spot-check enums and types
CLASS=$(jq -r '.problem_classification' "$INPUT_FILE")
case "$CLASS" in
  well-structured|ill-structured|wicked) ;;
  *) echo "Invalid problem_classification: $CLASS" >&2; exit 1 ;;
esac

CONFIDENCE=$(jq -r '.confidence' "$INPUT_FILE")
if ! awk -v c="$CONFIDENCE" 'BEGIN{exit !(c >= 0 && c <= 1)}'; then
  echo "Invalid confidence: $CONFIDENCE (must be 0..1)" >&2
  exit 1
fi

WAVES=$(jq -r '.waves | length' "$INPUT_FILE")
if [[ "$WAVES" -lt 1 ]]; then
  echo "Invalid: waves array is empty" >&2
  exit 1
fi

echo "valid (basic check)"
exit 0
