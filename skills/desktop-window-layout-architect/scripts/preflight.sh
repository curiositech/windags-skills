#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-.}"
TARGET_ABS="$(cd "$TARGET" && pwd)"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "missing command: $1" >&2
    exit 1
  fi
}

need_cmd find
need_cmd sed

SEARCH_BIN="grep"
if command -v rg >/dev/null 2>&1; then
  SEARCH_BIN="rg"
fi

echo "# Preflight"
echo "target: $TARGET_ABS"
echo "pwd: $(pwd)"
echo

if command -v git >/dev/null 2>&1 && git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  echo "## Git Status"
  git -C "$TARGET" status --short -- .
  echo
else
  echo "## Git Status"
  echo "not a git repository"
  echo
fi

echo "## Candidate Windowing Files"
find "$TARGET" \
  \( -path '*/node_modules/*' -o -path '*/dist/*' -o -path '*/target/*' -o -path '*/.git/*' \) -prune \
  -o \
  \( -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.css' -o -name '*.scss' -o -name '*.rs' -o -name '*.swift' -o -name '*.kt' \) \) -print \
  | sed "s#^$TARGET_ABS/##" \
  | grep -Ei '(window|titlebar|taskbar|desktop|split|pane|layout|inspector|modal|dialog|sidebar)' \
  | sort \
  | head -120
echo

echo "## Geometry Signals"
if [ "$SEARCH_BIN" = "rg" ]; then
  rg -n \
    "innerWidth|innerHeight|defaultSize|minSize|restoreBounds|getNormalBounds|window-state|isMaximized|snapWindow|tileWindows|cascadeWindows|SplitView|TwoPaneView|NavigationView|ResizeObserver|getBoundingClientRect" \
    "$TARGET" \
    -g '!node_modules' -g '!dist' -g '!target' \
    | head -160 || true
else
  grep -RInE \
    "innerWidth|innerHeight|defaultSize|minSize|restoreBounds|getNormalBounds|window-state|isMaximized|snapWindow|tileWindows|cascadeWindows|SplitView|TwoPaneView|NavigationView|ResizeObserver|getBoundingClientRect" \
    "$TARGET" \
    | grep -Ev '/(node_modules|dist|target)/' \
    | head -160 || true
fi
echo

echo "## Chrome Density Signals"
if [ "$SEARCH_BIN" = "rg" ]; then
  rg -n \
    "h-10|h-12|h-14|h-7|w-7|border-2|height:\\s*(40|48|56)px|title=\\\"Snap left\\\"|title=\\\"Snap right\\\"" \
    "$TARGET" \
    -g '!node_modules' -g '!dist' -g '!target' \
    | head -160 || true
else
  grep -RInE \
    "h-10|h-12|h-14|h-7|w-7|border-2|height:[[:space:]]*(40|48|56)px|title=\"Snap left\"|title=\"Snap right\"" \
    "$TARGET" \
    | grep -Ev '/(node_modules|dist|target)/' \
    | head -160 || true
fi
echo

echo "## Suggested Follow-up"
echo "Run:"
echo "  python3 skills/desktop-window-layout-architect/scripts/audit_window_layout.py \"$TARGET_ABS\""
