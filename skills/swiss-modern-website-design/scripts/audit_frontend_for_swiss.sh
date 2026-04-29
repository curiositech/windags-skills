#!/bin/bash
# Swiss-modern frontend audit
# Heuristically inspects a frontend codebase for typography, token, and chrome drift

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <project-root>"
  exit 1
fi

ROOT="$1"

if [ ! -d "$ROOT" ]; then
  echo "Error: directory '$ROOT' not found"
  exit 1
fi

cd "$ROOT"

if ! command -v rg >/dev/null 2>&1; then
  echo "Error: rg is required"
  exit 1
fi

echo "==============================================="
echo "Swiss-Modern Frontend Audit"
echo "==============================================="
echo "Root: $ROOT"
echo ""

COLOR_REGEX='#[0-9A-Fa-f]{3,8}\b|rgb[a]?\([^)]*\)|hsl[a]?\([^)]*\)'
RADIUS_REGEX='border-radius\s*:\s*[^;]+|rounded(?:-[a-z0-9]+)?'
SHADOW_REGEX='box-shadow\s*:|shadow(?:-[a-z0-9]+)?'
MAX_WIDTH_REGEX='max-width\s*:\s*[^;]+|max-w-[a-z0-9\-\[\]\./]+'
FONT_REGEX='font-family\s*:|font-[a-z]+|fontFamily'

FILE_GLOB='*.{css,scss,sass,less,styl,ts,tsx,js,jsx,html,mdx}'

list_matches() {
  local pattern="$1"
  rg -o -N "$pattern" -g "$FILE_GLOB" . 2>/dev/null || true
}

count_unique_matches() {
  local pattern="$1"
  list_matches "$pattern" | sort | uniq | wc -l | tr -d ' '
}

count_total_matches() {
  local pattern="$1"
  list_matches "$pattern" | wc -l | tr -d ' '
}

echo "Color tokens and literal colors:"
list_matches "$COLOR_REGEX" | sort | uniq -c | sort -nr | head -n 20 || true
echo ""

echo "Font-related declarations:"
list_matches "$FONT_REGEX" | sort | uniq -c | sort -nr | head -n 20 || true
echo ""

echo "Border radius usage:"
list_matches "$RADIUS_REGEX" | sort | uniq -c | sort -nr | head -n 20 || true
echo ""

echo "Shadow usage:"
list_matches "$SHADOW_REGEX" | sort | uniq -c | sort -nr | head -n 20 || true
echo ""

echo "Width discipline:"
list_matches "$MAX_WIDTH_REGEX" | sort | uniq -c | sort -nr | head -n 20 || true
echo ""

TOTAL_COLOR_LITERALS=$(count_total_matches "$COLOR_REGEX")
UNIQUE_COLOR_LITERALS=$(count_unique_matches "$COLOR_REGEX")
UNIQUE_RADIUS_PATTERNS=$(count_unique_matches "$RADIUS_REGEX")
UNIQUE_SHADOW_PATTERNS=$(count_unique_matches "$SHADOW_REGEX")
UNIQUE_MAX_WIDTHS=$(count_unique_matches "$MAX_WIDTH_REGEX")

echo "-----------------------------------------------"
echo "Heuristic summary"
echo "-----------------------------------------------"
echo "Literal color instances: $TOTAL_COLOR_LITERALS"
echo "Unique literal colors:   $UNIQUE_COLOR_LITERALS"
echo "Unique radius patterns:  $UNIQUE_RADIUS_PATTERNS"
echo "Unique shadow patterns:  $UNIQUE_SHADOW_PATTERNS"
echo "Unique width patterns:   $UNIQUE_MAX_WIDTHS"
echo ""

if [ "$UNIQUE_COLOR_LITERALS" -gt 12 ]; then
  echo "WARN: palette is likely too noisy for Swiss-modern discipline"
fi

if [ "$UNIQUE_RADIUS_PATTERNS" -gt 6 ]; then
  echo "WARN: border-radius usage is drifting; reduce geometry vocabulary"
fi

if [ "$UNIQUE_SHADOW_PATTERNS" -gt 6 ]; then
  echo "WARN: shadow usage is too expressive; Swiss-modern usually wants flatter surfaces"
fi

if [ "$UNIQUE_MAX_WIDTHS" -gt 10 ]; then
  echo "WARN: width system looks inconsistent; define a smaller container set"
fi

echo ""
echo "Next step:"
echo "1. Normalize tokens"
echo "2. Establish container and grid rules"
echo "3. Reduce chrome before refining accent and imagery"
