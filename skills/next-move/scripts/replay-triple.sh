#!/usr/bin/env bash
# replay-triple.sh — Load a past /next-move triple and re-display the prediction.
#
# Usage:
#   ./replay-triple.sh <triple-id>
#   ./replay-triple.sh latest        # most recent triple
#   ./replay-triple.sh --list        # list available triples
#
# Triples live in .windags/triples/. This tool loads one and renders the
# stored prediction without re-running the pipeline.

set -euo pipefail

TRIPLE_DIR="${WINDAGS_TRIPLE_DIR:-.windags/triples}"

if [[ ! -d "$TRIPLE_DIR" ]]; then
  echo "Error: no triples directory at $TRIPLE_DIR" >&2
  echo "Hint: run /next-move at least once, or set WINDAGS_TRIPLE_DIR." >&2
  exit 1
fi

if [[ "${1:-}" == "--list" ]] || [[ -z "${1:-}" ]]; then
  echo "Available triples (newest first):"
  ls -1t "$TRIPLE_DIR" 2>/dev/null | grep '\.json$' | head -20 | while read -r f; do
    id="${f%.json}"
    title=$(jq -r '.predicted_dag.title // "<no title>"' "$TRIPLE_DIR/$f" 2>/dev/null || echo "<unreadable>")
    rating=$(jq -r '.feedback.rating // "no feedback"' "$TRIPLE_DIR/$f" 2>/dev/null)
    echo "  $id  rating=$rating  $title"
  done
  exit 0
fi

if [[ "$1" == "latest" ]]; then
  TRIPLE_FILE=$(ls -1t "$TRIPLE_DIR"/*.json 2>/dev/null | head -1)
  if [[ -z "$TRIPLE_FILE" ]]; then
    echo "No triples found." >&2
    exit 1
  fi
else
  TRIPLE_FILE="$TRIPLE_DIR/$1.json"
  if [[ ! -f "$TRIPLE_FILE" ]]; then
    echo "Error: triple $1 not found at $TRIPLE_FILE" >&2
    exit 1
  fi
fi

echo "=== Triple: $(basename "$TRIPLE_FILE" .json) ==="
echo
jq -r '
  "Title:           " + .predicted_dag.title,
  "Classification:  " + .predicted_dag.problem_classification,
  "Confidence:      " + (.predicted_dag.confidence | tostring),
  "Topology:        " + (.predicted_dag.topology // "dag"),
  "Estimated:       " + (.predicted_dag.estimated_total_minutes | tostring) + " min, $" + (.predicted_dag.estimated_total_cost_usd | tostring),
  "Stored:          " + .timestamp,
  "Session:         " + .session_id,
  "",
  "Waves:"
' "$TRIPLE_FILE"

jq -r '.predicted_dag.waves[] |
  "  Wave " + (.wave_number | tostring) + " (parallel=" + (.parallelizable | tostring) + "):",
  (.nodes[] | "    " + .id + "  →  " + .skill_id + "  [" + .commitment_level + ", " + .model_tier + "]")
' "$TRIPLE_FILE"

echo
echo "Feedback:"
jq -r '.feedback // "  (none yet)" |
  if type == "object" then
    "  accepted: " + (.accepted | tostring) + ", rating: " + (.rating | tostring) +
    (if .modifications | length > 0 then "\n  modifications: " + (.modifications | join(", ")) else "" end) +
    (if .notes then "\n  notes: " + .notes else "" end)
  else . end
' "$TRIPLE_FILE"
