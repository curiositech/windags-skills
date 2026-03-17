#!/usr/bin/env python3
"""
Skill Scaffolder — Initialize a New Agent Skill Directory

Creates a skill directory with:
- SKILL.md template (frontmatter, NOT clause placeholder, shibboleth stub)
- Empty references/ and scripts/ directories
- Starter CHANGELOG.md

Usage:
    python scripts/init_skill.py <name> --path <dir>
    python scripts/init_skill.py <name> --path <dir> --category <cat>
    python scripts/init_skill.py <name> --path <dir> --with-mermaid

Examples:
    python scripts/init_skill.py api-architect --path ~/.claude/skills
    python scripts/init_skill.py my-skill --path ./skills --category "Code Quality"
    python scripts/init_skill.py my-skill --path ./skills --with-mermaid
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
) -> str:
    """Generate SKILL.md template content."""
    title = name.replace("-", " ").title()

    metadata_block = ""
    if category:
        metadata_block = f"""metadata:
  category: {category}
  tags:
  - {name.split('-')[0]}
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

    return f"""---
name: {name}
description: >-
  [What it does] [When to use — be slightly pushy].
  NOT for [explicit exclusions].
allowed-tools: Read,Write,Edit,Bash,Grep,Glob
argument-hint: '[expected arguments]'
{metadata_block}---

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

## Core Process
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
| `references/guide.md` | [Specific situation] |
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
└── scripts/              # Validation and utility scripts
```

## Quick Start

1. Review SKILL.md for core process
2. Check references/ for deep dives
3. Run `python scripts/validate_skill.py .` to validate
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
) -> Path:
    """Create a new skill directory with template files."""
    skill_dir = base_path / name

    if skill_dir.exists():
        raise FileExistsError(f"Directory already exists: {skill_dir}")

    # Create directory structure
    skill_dir.mkdir(parents=True)
    (skill_dir / "references").mkdir()
    (skill_dir / "scripts").mkdir()

    # Write template files
    (skill_dir / "SKILL.md").write_text(
        skill_md_template(name, category=category, with_mermaid=with_mermaid),
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
        )
    except FileExistsError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1

    print(f"Created skill: {skill_dir}")
    print(f"  ├── SKILL.md")
    print(f"  ├── CHANGELOG.md")
    print(f"  ├── README.md")
    print(f"  ├── references/")
    print(f"  └── scripts/")
    print()
    print("Next steps:")
    print("  1. Edit SKILL.md — fill in description, process, anti-patterns")
    print("  2. Add reference files to references/")
    print("  3. Add scripts to scripts/")
    print(f"  4. Validate: python scripts/validate_skill.py {skill_dir}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
