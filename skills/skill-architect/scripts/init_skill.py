#!/usr/bin/env python3
"""
Skill Scaffolder — Initialize a New Agent Skill Directory

Creates a skill directory with:
- SKILL.md template (frontmatter, NOT clause placeholder, shibboleth stub)
- A real starter `references/guide.md`
- Optional `examples/`, `templates/`, `agents/`, and `scripts/preflight.sh`
- Starter CHANGELOG.md

Usage:
    python scripts/init_skill.py <name> --path <dir>
    python scripts/init_skill.py <name> --path <dir> --category <cat>
    python scripts/init_skill.py <name> --path <dir> --with-mermaid
    python scripts/init_skill.py <name> --path <dir> --with-examples --with-templates
    python scripts/init_skill.py <name> --path <dir> --with-preflight --fork-context

Examples:
    python scripts/init_skill.py api-architect --path ~/.claude/skills
    python scripts/init_skill.py my-skill --path ./skills --category "Code Quality"
    python scripts/init_skill.py my-skill --path ./skills --with-mermaid
    python scripts/init_skill.py my-skill --path ./skills --with-preflight --with-examples
    python scripts/init_skill.py my-skill --path ./skills --fork-context
"""

import argparse
import re
import sys
from datetime import date
from pathlib import Path


# ──────────────────────────────────────────────────────────────────────
# Templates
# ──────────────────────────────────────────────────────────────────────

def skill_md_template(
    name: str,
    category: str = "",
    with_mermaid: bool = False,
    with_examples: bool = False,
    with_templates: bool = False,
    with_preflight: bool = False,
    fork_context: bool = False,
) -> str:
    """Generate SKILL.md template content."""
    title = name.replace("-", " ").title()
    agent_name = f"{name}-worker"

    metadata_lines = [
        "metadata:",
        "  argument-hint: '[expected arguments]'",
    ]
    if category:
        metadata_lines.append(f"  category: {category}")
    metadata_lines.extend(
        [
            "  tags:",
            f"    - {name.split('-')[0]}",
        ]
    )
    metadata_block = "\n".join(metadata_lines) + "\n"

    fork_block = ""
    if fork_context:
        fork_block = f"""context: fork
agent: {agent_name}
"""

    mermaid_block = ""
    if with_mermaid:
        mermaid_block = """
```mermaid
flowchart LR
  S1[1. Analyze] --> S2[2. Plan]
  S2 --> S3[3. Execute]
  S3 --> S4[4. Validate]
  S4 --> S5{{Errors?}}
  S5 -->|Yes| S3
  S5 -->|No| S6[5. Done]
```
"""

    preflight_section = ""
    if with_preflight:
        preflight_section = """
## Preflight

Run the preflight script before making decisions that depend on the user's current environment.

```bash
./scripts/preflight.sh [target-path]
```

Use it for safe read-only inspection of git state, top-level files, and obvious missing prerequisites.

---
"""

    output_contract_lines = ""
    if with_examples or with_templates:
        output_contract_lines = """
## Output Format

- Final answer follows the reusable structure documented below.
- Use `examples/expected-output.md` as the concrete quality bar for finished work.
- Use `templates/output-template.md` when producing repeatable structured output.

---
"""

    reference_rows = [
        "| `references/guide.md` | [Specific situation] |",
    ]
    if with_preflight:
        reference_rows.append("| `scripts/preflight.sh` | Run before work when current repo or file state matters |")
    if with_examples:
        reference_rows.append("| `examples/expected-output.md` | Consult for a concrete finished-output example |")
    if with_templates:
        reference_rows.append("| `templates/output-template.md` | Reuse when this skill emits a structured deliverable |")
    if fork_context:
        reference_rows.append(f"| `agents/{agent_name}.md` | Use when this skill should run in an isolated forked subagent |")

    return f"""---
name: {name}
description: >-
  [What it does] [When to use — be slightly pushy].
  NOT for [explicit exclusions].
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
{fork_block}{metadata_block}---

# {title}

[One sentence purpose]

## When to Use

✅ **Use for**:
- [Specific trigger A]
- [Specific trigger B]
- [Specific trigger C]

❌ **NOT for**:
- [Exclusion D]
- [Exclusion E]
- [Exclusion F]

---

{preflight_section}{output_contract_lines}## Core Process
{mermaid_block}
### Step 1: [First Step]

[Instructions]

### Step 2: [Second Step]

[Instructions]

### Step 3: [Third Step]

[Instructions]

---

## Anti-Patterns

### Anti-Pattern: [Pattern Name]

**Novice**: "[Wrong assumption]"
**Expert**: [Why it's wrong + correct approach]
**Timeline**: [When this changed, if temporal]

---

## References

Consult these for deep dives — they are NOT loaded by default:

| File | Consult When |
|------|-------------|
{chr(10).join(reference_rows)}
"""


def changelog_template(name: str) -> str:
    """Generate starter CHANGELOG.md."""
    today = date.today().isoformat()
    title = name.replace("-", " ").title()
    return f"""# {title} — Changelog

## v1.0.0 ({today})

- Initial skill creation
- Core process defined
- Reference files added
"""


def readme_template(name: str) -> str:
    """Generate README.md."""
    title = name.replace("-", " ").title()
    return f"""# {title}

[Brief description of what this skill does]

## Structure

```
{name}/
├── SKILL.md              # Core instructions (<500 lines)
├── CHANGELOG.md          # Version history
├── README.md             # This file
├── references/           # Deep-dive reference material
├── scripts/              # Working scripts such as preflight/validation helpers
├── examples/             # Concrete finished outputs (optional)
├── templates/            # Reusable output shapes (optional)
└── agents/               # Forked subagent prompts (optional)
```

## Quick Start

1. Review SKILL.md for core process
2. Check references/ for deep dives
3. Run the `skill-architect` validator against this directory
4. Remove scaffold placeholders before shipping the skill
"""


def guide_reference_template(name: str) -> str:
    """Generate starter references/guide.md."""
    title = name.replace("-", " ").title()
    return f"""# {title} Guide

Add the deep-dive material that would otherwise bloat SKILL.md.

Suggested sections:
- Domain model
- Decision criteria
- Edge cases and anti-patterns
- Worked examples
- Source links or internal references
"""


def preflight_template() -> str:
    """Generate starter scripts/preflight.sh."""
    return """#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-.}"

echo "# Preflight"
echo "target: $TARGET"
echo "pwd: $(pwd)"
echo

if command -v git >/dev/null 2>&1 && git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  echo "## Git Status"
  git -C "$TARGET" status --short
  echo
else
  echo "## Git Status"
  echo "not a git repository"
  echo
fi

echo "## Top-Level Entries"
find "$TARGET" -maxdepth 2 -mindepth 1 | sed 's#^\\./##' | sort | head -200
"""


def example_output_template(name: str) -> str:
    """Generate starter examples/expected-output.md."""
    title = name.replace("-", " ").title()
    return f"""# Example Output: {title}

Use this file to show what a strong final deliverable looks like.

Include:
- Input context
- Key decisions
- Final artifact or answer
- What quality gates were satisfied
"""


def output_template_template(name: str) -> str:
    """Generate starter templates/output-template.md."""
    title = name.replace("-", " ").title()
    return f"""# Output Template: {title}

## Summary
[One paragraph]

## Key Decisions
- [Decision 1]
- [Decision 2]

## Risks / Open Questions
- [Risk or open question]

## Next Actions
- [Action]
"""


def agent_prompt_template(name: str) -> str:
    """Generate starter agents/<name>-worker.md."""
    title = name.replace("-", " ").title()
    worker_name = f"{name}-worker"
    return f"""# Agent: {worker_name}

## Purpose
Execute `{name}` in an isolated forked context when the task benefits from separation, parallelism, or a tighter tool boundary.

## System Prompt
You are the **{title} Worker**.

For each task:
1. Restate the task briefly
2. Follow the parent skill's numbered process
3. Use only the tools required for this subtask
4. Return:
   - final artifact
   - assumptions
   - remaining risks

## Success Criteria
- Task stays within the subagent's narrow scope
- Output follows the parent skill's format
- Risks and assumptions are explicit
"""


# ──────────────────────────────────────────────────────────────────────
# Validation
# ──────────────────────────────────────────────────────────────────────

NAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*$")
RESERVED_WORDS = {"anthropic", "claude"}


def validate_name(name: str) -> str | None:
    """Validate skill name. Returns error message or None."""
    if len(name) > 64:
        return f"Name exceeds 64 chars ({len(name)} chars)"
    if not NAME_PATTERN.match(name):
        return "Name must be lowercase letters, numbers, hyphens only"
    for word in RESERVED_WORDS:
        if word in name.lower():
            return f"Name must not contain reserved word '{word}'"
    return None


# ──────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────

def init_skill(
    name: str,
    base_path: Path,
    category: str = "",
    with_mermaid: bool = False,
    with_examples: bool = False,
    with_templates: bool = False,
    with_preflight: bool = False,
    fork_context: bool = False,
) -> Path:
    """Create a new skill directory with template files."""
    skill_dir = base_path / name

    if skill_dir.exists():
        raise FileExistsError(f"Directory already exists: {skill_dir}")

    # Create directory structure
    skill_dir.mkdir(parents=True)
    (skill_dir / "references").mkdir()
    (skill_dir / "scripts").mkdir()
    if with_examples:
        (skill_dir / "examples").mkdir()
    if with_templates:
        (skill_dir / "templates").mkdir()
    if fork_context:
        (skill_dir / "agents").mkdir()

    # Write template files
    (skill_dir / "SKILL.md").write_text(
        skill_md_template(
            name,
            category=category,
            with_mermaid=with_mermaid,
            with_examples=with_examples,
            with_templates=with_templates,
            with_preflight=with_preflight,
            fork_context=fork_context,
        ),
        encoding="utf-8",
    )
    (skill_dir / "CHANGELOG.md").write_text(
        changelog_template(name),
        encoding="utf-8",
    )
    (skill_dir / "README.md").write_text(
        readme_template(name),
        encoding="utf-8",
    )
    (skill_dir / "references" / "guide.md").write_text(
        guide_reference_template(name),
        encoding="utf-8",
    )

    if with_preflight:
        preflight_path = skill_dir / "scripts" / "preflight.sh"
        preflight_path.write_text(preflight_template(), encoding="utf-8")
        preflight_path.chmod(0o755)

    if with_examples:
        (skill_dir / "examples" / "expected-output.md").write_text(
            example_output_template(name),
            encoding="utf-8",
        )

    if with_templates:
        (skill_dir / "templates" / "output-template.md").write_text(
            output_template_template(name),
            encoding="utf-8",
        )

    if fork_context:
        (skill_dir / "agents" / f"{name}-worker.md").write_text(
            agent_prompt_template(name),
            encoding="utf-8",
        )

    return skill_dir


def main():
    parser = argparse.ArgumentParser(
        description="Initialize a new Agent Skill directory with templates",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("name", help="Skill name (lowercase-hyphenated, e.g. 'api-architect')")
    parser.add_argument("--path", required=True,
                        help="Base directory where skill folder will be created")
    parser.add_argument("--category", default="",
                        help="Skill category (e.g. 'Code Quality & Testing')")
    parser.add_argument("--with-mermaid", action="store_true",
                        help="Include a starter Mermaid flowchart in the template")
    parser.add_argument("--with-examples", action="store_true",
                        help="Create examples/ with a starter finished-output example")
    parser.add_argument("--with-templates", action="store_true",
                        help="Create templates/ with a reusable output template")
    parser.add_argument("--with-preflight", action="store_true",
                        help="Create scripts/preflight.sh for safe environment inspection")
    parser.add_argument("--fork-context", action="store_true",
                        help="Add context: fork + agent: frontmatter and scaffold agents/")

    args = parser.parse_args()

    # Validate name
    error = validate_name(args.name)
    if error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    base_path = Path(args.path).resolve()
    if not base_path.exists():
        print(f"Error: Base path does not exist: {base_path}", file=sys.stderr)
        return 1

    try:
        skill_dir = init_skill(
            args.name,
            base_path,
            category=args.category,
            with_mermaid=args.with_mermaid,
            with_examples=args.with_examples,
            with_templates=args.with_templates,
            with_preflight=args.with_preflight,
            fork_context=args.fork_context,
        )
    except FileExistsError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

    print(f"Created skill: {skill_dir}")
    print(f"  ├── SKILL.md")
    print(f"  ├── CHANGELOG.md")
    print(f"  ├── README.md")
    print(f"  ├── references/")
    print(f"  ├── scripts/")
    if args.with_examples:
        print(f"  ├── examples/")
    if args.with_templates:
        print(f"  ├── templates/")
    if args.fork_context:
        print(f"  └── agents/")
    else:
        print(f"  └── (optional support dirs omitted)")
    print()
    print("Next steps:")
    print("  1. Edit SKILL.md — fill in description, process, anti-patterns")
    print("  2. Add reference files to references/")
    print("  3. Replace scaffold examples/templates/agent prompts with domain-specific content")
    validator_path = Path(__file__).resolve().parent / "validate_skill.py"
    print(f"  4. Validate: python {validator_path} {skill_dir}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
