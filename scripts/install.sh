#!/usr/bin/env bash
# install.sh — User-level installer for the WinDAGs skill system.
#
# Detects the install location of this plugin, finds each agent tool's config dir
# under $HOME, and creates symlinks so skills + subagents are available across:
#   - Claude Code (~/.claude/skills, ~/.claude/agents)
#   - Codex      (~/.codex/skills)
#   - Gemini CLI (~/.gemini/GEMINI.md pointer)
#   - Any AGENTS.md-aware tool (~/AGENTS.md)
#
# Idempotent: re-running updates symlinks and rewrites AGENTS.md from the template.
#
# Usage:
#   ./scripts/install.sh                # auto-detect plugin dir
#   WINDAGS_HOME=/path ./install.sh     # override
#   ./install.sh --dry-run              # show actions without executing

set -euo pipefail

# Resolve plugin home: directory containing this script's parent
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WINDAGS_HOME="${WINDAGS_HOME:-$(dirname "$SCRIPT_DIR")}"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

# Skills + subagents that get linked into per-tool dirs.
SKILLS=(
  next-move
  windags-sensemaker
  windags-decomposer
  windags-skill-selector
  windags-premortem
  windags-synthesizer
)
AGENTS=(
  sensemaker
  decomposer
  skill-selector
  premortem
  synthesizer
)

log() { printf '[install] %s\n' "$*"; }
run() {
  if [[ $DRY_RUN -eq 1 ]]; then
    printf '[dry-run] %s\n' "$*"
  else
    eval "$@"
  fi
}

# Sanity check: plugin home looks valid
if [[ ! -d "$WINDAGS_HOME/skills" || ! -d "$WINDAGS_HOME/agents" ]]; then
  echo "ERROR: $WINDAGS_HOME does not look like a windags-skills plugin checkout" >&2
  echo "       (expected skills/ and agents/ subdirs)" >&2
  exit 1
fi

log "Plugin home: $WINDAGS_HOME"
log "User home:   $HOME"
[[ $DRY_RUN -eq 1 ]] && log "DRY RUN — no filesystem changes"

# --- Claude Code ---
if [[ -d "$HOME/.claude" ]]; then
  log "Detected Claude Code at $HOME/.claude"
  run "mkdir -p '$HOME/.claude/skills' '$HOME/.claude/agents'"
  for s in "${SKILLS[@]}"; do
    src="$WINDAGS_HOME/skills/$s"
    dst="$HOME/.claude/skills/$s"
    [[ -d "$src" ]] || continue
    run "rm -rf '$dst' && ln -s '$src' '$dst'"
  done
  for a in "${AGENTS[@]}"; do
    src="$WINDAGS_HOME/agents/$a.md"
    dst="$HOME/.claude/agents/$a.md"
    [[ -f "$src" ]] || continue
    run "ln -sfn '$src' '$dst'"
  done
fi

# --- Codex ---
if [[ -d "$HOME/.codex" ]]; then
  log "Detected Codex at $HOME/.codex"
  run "mkdir -p '$HOME/.codex/skills'"
  for s in "${SKILLS[@]}"; do
    src="$WINDAGS_HOME/skills/$s"
    dst="$HOME/.codex/skills/$s"
    [[ -d "$src" ]] || continue
    run "rm -rf '$dst' && ln -s '$src' '$dst'"
  done
fi

# --- AGENTS.md (Codex / Cursor / Cline / Aider standard) ---
log "Generating ~/AGENTS.md from template"
TEMPLATE="$WINDAGS_HOME/scripts/AGENTS.md.template"
if [[ -f "$TEMPLATE" ]]; then
  if [[ $DRY_RUN -eq 1 ]]; then
    log "[dry-run] would write $HOME/AGENTS.md"
  else
    sed \
      -e "s|__WINDAGS_HOME__|$WINDAGS_HOME|g" \
      -e "s|__HOME__|$HOME|g" \
      "$TEMPLATE" > "$HOME/AGENTS.md"
  fi
  if [[ -d "$HOME/.codex" ]]; then
    run "ln -sfn '$HOME/AGENTS.md' '$HOME/.codex/AGENTS.md'"
  fi
fi

# --- Gemini ---
if [[ -d "$HOME/.gemini" ]]; then
  log "Detected Gemini at $HOME/.gemini"
  GEMINI_MD="$HOME/.gemini/GEMINI.md"
  MARKER="<!-- windags-skills:start -->"
  if [[ ! -f "$GEMINI_MD" ]] || ! grep -qF "$MARKER" "$GEMINI_MD" 2>/dev/null; then
    if [[ $DRY_RUN -eq 1 ]]; then
      log "[dry-run] would append windags pointer to $GEMINI_MD"
    else
      cat >> "$GEMINI_MD" <<EOF

$MARKER
## WinDAGs Skill System

Cross-tool agent guide: \`$HOME/AGENTS.md\`. Read it for the full skill system,
the \`/next-move\` 5-stage pipeline, and the MCP server config.

Quick pointers:
- Skills: \`$WINDAGS_HOME/skills/<skill-id>/SKILL.md\` (463+ skills)
- Subagents: \`$WINDAGS_HOME/agents/{sensemaker,decomposer,skill-selector,premortem,synthesizer}.md\`
- Schemas: \`$WINDAGS_HOME/skills/next-move/schemas/*.schema.json\`
- MCP server: \`$WINDAGS_HOME/mcp-server/dist/index.js\`

Never substring/keyword-match skills — use the MCP \`windags_skill_search\` BM25 tool.
<!-- windags-skills:end -->
EOF
    fi
  else
    log "Gemini pointer already present — skipping"
  fi
fi

log "Done. Re-run anytime with: $WINDAGS_HOME/scripts/install.sh"
