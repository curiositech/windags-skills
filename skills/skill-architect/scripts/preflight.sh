#!/usr/bin/env bash
set -euo pipefail

target="${1:-.}"

echo "skill-architect preflight"
echo "target: ${target}"

if [ ! -e "${target}" ]; then
  echo "error: target does not exist" >&2
  exit 1
fi

if command -v rg >/dev/null 2>&1; then
  echo "rg: available"
else
  echo "rg: missing"
fi

if command -v python3 >/dev/null 2>&1; then
  echo "python3: $(python3 --version 2>&1)"
else
  echo "python3: missing"
fi

if [ -d "${target}/skills" ]; then
  skill_count="$(find "${target}/skills" -name SKILL.md -type f 2>/dev/null | wc -l | tr -d ' ')"
  echo "skill manifests: ${skill_count}"
elif [ -f "${target}/SKILL.md" ]; then
  echo "skill manifests: 1"
else
  echo "skill manifests: 0"
fi
