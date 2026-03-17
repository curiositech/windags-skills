#!/usr/bin/env python3
"""
Skill Validator — Comprehensive Structural Validation for Agent Skills

Validates a skill directory for correctness: frontmatter fields, description
quality, file references, line counts, anti-patterns, and naming conventions.

Usage:
    python scripts/validate_skill.py <skill-dir>
    python scripts/validate_skill.py <skill-dir> --json
    python scripts/validate_skill.py <skill-dir> --strict

Examples:
    python scripts/validate_skill.py ~/.claude/skills/my-skill
    python scripts/validate_skill.py . --json
    python scripts/validate_skill.py /path/to/skill --strict
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


# ──────────────────────────────────────────────────────────────────────
# Frontmatter Parsing (stdlib-only, no yaml dependency)
# ──────────────────────────────────────────────────────────────────────

def parse_frontmatter(text: str) -> Tuple[Optional[Dict[str, Any]], int]:
    """Parse YAML frontmatter from markdown text.

    Returns (dict, end_line) or (None, 0) if no frontmatter found.
    Handles simple key: value, nested maps, and lists without PyYAML.
    """
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None, 0

    end_idx = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break

    if end_idx < 0:
        return None, 0

    fm: Dict[str, Any] = {}
    current_key: Optional[str] = None
    current_indent = 0
    # Track whether current_key has a string value that may span multiple lines
    current_is_scalar = False

    for line in lines[1:end_idx]:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        indent = len(line) - len(line.lstrip())

        # Top-level key: value
        m = re.match(r"^(\w[\w-]*):\s*(.*)", stripped)
        if m and indent == 0:
            key, val = m.group(1), m.group(2).strip()
            current_key = key
            current_indent = 0
            current_is_scalar = False
            if val:
                # Inline list: [a, b, c]
                if val.startswith("[") and val.endswith("]"):
                    fm[key] = [v.strip().strip("'\"") for v in val[1:-1].split(",") if v.strip()]
                elif val in ("true", "True"):
                    fm[key] = True
                elif val in ("false", "False"):
                    fm[key] = False
                elif val in (">-", ">", "|", "|-"):
                    # YAML block scalar indicator — value follows on next lines
                    fm[key] = ""
                    current_is_scalar = True
                else:
                    # Strip quotes
                    fm[key] = val.strip("'\"")
                    current_is_scalar = True  # might have continuation lines
            else:
                fm[key] = {}
            continue

        # Continuation line for a scalar value (indented text under a string key)
        if current_key and current_is_scalar and indent > 0 and isinstance(fm.get(current_key), str):
            fm[current_key] = (fm[current_key] + " " + stripped).strip()
            continue

        # Nested key or list item under current_key
        if current_key and indent > 0:
            current_is_scalar = False
            if stripped.startswith("- "):
                item_val = stripped[2:].strip()
                # List item under a key
                if isinstance(fm.get(current_key), dict):
                    # Check if it's a "key: value" list item
                    km = re.match(r"^(\w[\w-]*):\s*(.*)", item_val)
                    if km:
                        sub_key, sub_val = km.group(1), km.group(2).strip().strip("'\"")
                        if not isinstance(fm[current_key], list):
                            fm[current_key] = []
                        fm[current_key].append({sub_key: sub_val})
                    else:
                        fm[current_key] = [item_val.strip("'\"")]
                elif isinstance(fm.get(current_key), list):
                    km = re.match(r"^(\w[\w-]*):\s*(.*)", item_val)
                    if km:
                        sub_key, sub_val = km.group(1), km.group(2).strip().strip("'\"")
                        fm[current_key].append({sub_key: sub_val})
                    else:
                        fm[current_key].append(item_val.strip("'\""))
                continue

            # Nested key: value
            nm = re.match(r"^(\w[\w-]*):\s*(.*)", stripped)
            if nm:
                sub_key, sub_val = nm.group(1), nm.group(2).strip()
                if isinstance(fm.get(current_key), dict):
                    if sub_val.startswith("[") and sub_val.endswith("]"):
                        fm[current_key][sub_key] = [
                            v.strip().strip("'\"") for v in sub_val[1:-1].split(",") if v.strip()
                        ]
                    elif sub_val in ("true", "True"):
                        fm[current_key][sub_key] = True
                    elif sub_val in ("false", "False"):
                        fm[current_key][sub_key] = False
                    elif sub_val:
                        fm[current_key][sub_key] = sub_val.strip("'\"")
                    else:
                        fm[current_key][sub_key] = {}
                continue

    return fm, end_idx + 1


# ──────────────────────────────────────────────────────────────────────
# Issue Tracking
# ──────────────────────────────────────────────────────────────────────

@dataclass
class Issue:
    file: str
    line: int
    severity: str  # "error", "warning", "suggestion"
    category: str
    message: str


@dataclass
class ValidationReport:
    skill_dir: str = ""
    issues: List[Issue] = field(default_factory=list)

    @property
    def errors(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "error"]

    @property
    def warnings(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "warning"]

    @property
    def suggestions(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "suggestion"]

    @property
    def passed(self) -> bool:
        return len(self.errors) == 0

    def add(self, file: str, line: int, severity: str, category: str, message: str):
        self.issues.append(Issue(file=file, line=line, severity=severity,
                                 category=category, message=message))


# ──────────────────────────────────────────────────────────────────────
# Validators
# ──────────────────────────────────────────────────────────────────────

VALID_FRONTMATTER_KEYS = {
    "name", "description", "allowed-tools", "argument-hint", "license",
    "disable-model-invocation", "user-invocable", "context", "agent",
    "model", "hooks", "metadata", "dependencies", "bundled-resources",
    "distribution",
}

RESERVED_NAME_WORDS = {"anthropic", "claude"}
NAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def validate_frontmatter(skill_dir: Path, text: str, report: ValidationReport):
    """Validate frontmatter fields in SKILL.md."""
    fm, end_line = parse_frontmatter(text)
    rel = "SKILL.md"

    if fm is None:
        report.add(rel, 1, "error", "frontmatter", "No YAML frontmatter found (must start with ---)")
        return

    # Required: name
    name = fm.get("name")
    if not name:
        report.add(rel, 1, "error", "frontmatter", "Missing required field: name")
    elif isinstance(name, str):
        if len(name) > 64:
            report.add(rel, 1, "error", "frontmatter",
                       f"name exceeds 64 chars ({len(name)} chars)")
        if not NAME_PATTERN.match(name):
            report.add(rel, 1, "error", "frontmatter",
                       f"name must be lowercase letters, numbers, hyphens only: '{name}'")
        for word in RESERVED_NAME_WORDS:
            if word in name.lower():
                report.add(rel, 1, "error", "frontmatter",
                           f"name must not contain reserved word '{word}'")
        if "<" in name or ">" in name:
            report.add(rel, 1, "error", "frontmatter", "name must not contain XML tags")

        # Check name matches directory name
        dir_name = skill_dir.name
        if name != dir_name:
            report.add(rel, 1, "warning", "frontmatter",
                       f"name '{name}' doesn't match directory name '{dir_name}'")

    # Required: description
    desc = fm.get("description")
    if not desc:
        report.add(rel, 1, "error", "frontmatter", "Missing required field: description")
    elif isinstance(desc, str):
        if len(desc) > 1024:
            report.add(rel, 1, "error", "frontmatter",
                       f"description exceeds 1024 chars ({len(desc)} chars)")
        if "<" in desc and ">" in desc:
            report.add(rel, 1, "warning", "frontmatter",
                       "description may contain XML tags (prohibited)")
        if "NOT " not in desc and "NOT for" not in desc.lower():
            report.add(rel, 1, "warning", "frontmatter",
                       "description missing NOT clause — add 'NOT for [exclusions]' to prevent false activation")

    # Check for invalid frontmatter keys
    for key in fm:
        if key not in VALID_FRONTMATTER_KEYS and key != "metadata":
            # Keys inside metadata are custom and always valid
            if not isinstance(fm.get("metadata"), dict) or key not in fm.get("metadata", {}):
                report.add(rel, 1, "warning", "frontmatter",
                           f"Unknown frontmatter key '{key}' — will be ignored by runtime. "
                           f"Move to metadata: block or SKILL.md body")


def validate_skill_md(skill_dir: Path, report: ValidationReport):
    """Validate SKILL.md content."""
    skill_md = skill_dir / "SKILL.md"
    rel = "SKILL.md"

    if not skill_md.exists():
        report.add(rel, 0, "error", "structure", "SKILL.md not found")
        return

    text = skill_md.read_text(encoding="utf-8")
    lines = text.split("\n")
    line_count = len(lines)

    # Line count checks
    if line_count > 500:
        report.add(rel, 0, "error", "size",
                   f"SKILL.md is {line_count} lines (max 500). Move depth to /references")
    elif line_count > 400:
        report.add(rel, 0, "warning", "size",
                   f"SKILL.md is {line_count} lines (approaching 500 limit)")

    # Frontmatter validation
    validate_frontmatter(skill_dir, text, report)

    # Check for HTML entities that should be plain text
    html_entities = re.findall(r"&(?:lt|gt|amp|quot|apos|nbsp);", text)
    if html_entities:
        unique = set(html_entities)
        report.add(rel, 0, "warning", "content",
                   f"Found HTML entities that may render incorrectly: {', '.join(unique)}")


def validate_all_md_html_entities(skill_dir: Path, report: ValidationReport):
    """Check all .md files (references/, README.md, agents/) for HTML entities.

    validate_skill_md() only checks SKILL.md. Reference files and README
    often carry HTML entities that escape review — this catches the rest.
    """
    HTML_ENTITY_RE = re.compile(r"&(?:lt|gt|amp|quot|apos|nbsp);")
    checked_already = {"SKILL.md"}

    for md_file in skill_dir.rglob("*.md"):
        rel = str(md_file.relative_to(skill_dir))
        if rel in checked_already:
            continue
        try:
            text = md_file.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        entities = HTML_ENTITY_RE.findall(text)
        if entities:
            unique = set(entities)
            report.add(rel, 0, "warning", "content",
                       f"HTML entities in {rel}: {', '.join(unique)}")


def validate_structure(skill_dir: Path, report: ValidationReport):
    """Validate directory structure."""
    # CHANGELOG.md is recommended
    if not (skill_dir / "CHANGELOG.md").exists():
        report.add("", 0, "suggestion", "structure",
                   "No CHANGELOG.md — recommended for tracking version history")

    # Check scripts are executable (have shebang or .py extension)
    scripts_dir = skill_dir / "scripts"
    if scripts_dir.exists():
        for script in scripts_dir.iterdir():
            if script.is_file() and script.suffix == ".py":
                content = script.read_text(encoding="utf-8", errors="replace")
                if not content.startswith("#!/"):
                    report.add(f"scripts/{script.name}", 1, "suggestion", "scripts",
                               "Python script missing shebang (#!/usr/bin/env python3)")

    # Check for empty directories
    for subdir in ["references", "scripts", "assets"]:
        d = skill_dir / subdir
        if d.exists() and d.is_dir():
            children = [f for f in d.iterdir() if not f.name.startswith(".")]
            if not children:
                report.add(subdir, 0, "warning", "structure",
                           f"Empty directory: {subdir}/ — remove or add content")


def validate_tags(skill_dir: Path, text: str, report: ValidationReport):
    """Validate tags are present and non-empty."""
    fm, _ = parse_frontmatter(text)
    if fm is None:
        return

    metadata = fm.get("metadata", {})
    if isinstance(metadata, dict):
        tags = metadata.get("tags")
        if tags is not None:
            if isinstance(tags, list) and len(tags) == 0:
                report.add("SKILL.md", 1, "warning", "frontmatter",
                           "tags list is empty — add relevant tags for discoverability")
        else:
            report.add("SKILL.md", 1, "suggestion", "frontmatter",
                       "No tags defined in metadata — consider adding for discoverability")


# ──────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────

def validate_skill(skill_dir: Path, strict: bool = False) -> ValidationReport:
    """Run all validations on a skill directory."""
    report = ValidationReport(skill_dir=str(skill_dir))

    if not skill_dir.is_dir():
        report.add("", 0, "error", "structure", f"Not a directory: {skill_dir}")
        return report

    validate_skill_md(skill_dir, report)
    validate_structure(skill_dir, report)
    validate_all_md_html_entities(skill_dir, report)

    skill_md = skill_dir / "SKILL.md"
    if skill_md.exists():
        text = skill_md.read_text(encoding="utf-8")
        validate_tags(skill_dir, text, report)

    if strict:
        # In strict mode, warnings become errors
        for issue in report.issues:
            if issue.severity == "warning":
                issue.severity = "error"

    return report


def print_report(report: ValidationReport):
    """Print human-readable report."""
    skill_name = Path(report.skill_dir).name if report.skill_dir else "unknown"
    print(f"\n{'='*60}")
    print(f"  Skill Validation: {skill_name}")
    print(f"{'='*60}\n")

    if not report.issues:
        print("  ✓ All checks passed\n")
        return

    # Group by severity
    for severity, label, symbol in [
        ("error", "ERRORS", "✗"),
        ("warning", "WARNINGS", "⚠"),
        ("suggestion", "SUGGESTIONS", "→"),
    ]:
        items = [i for i in report.issues if i.severity == severity]
        if items:
            print(f"  {label} ({len(items)}):")
            for issue in items:
                loc = f"{issue.file}:{issue.line}" if issue.line else issue.file or "(root)"
                print(f"    {symbol} [{issue.category}] {loc}: {issue.message}")
            print()

    status = "PASS" if report.passed else "FAIL"
    print(f"  Result: {status}  "
          f"({len(report.errors)} errors, {len(report.warnings)} warnings, "
          f"{len(report.suggestions)} suggestions)\n")


def main():
    parser = argparse.ArgumentParser(
        description="Validate an Agent Skill directory for correctness",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("skill_dir", help="Path to the skill directory")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--strict", action="store_true",
                        help="Treat warnings as errors (stricter validation)")

    args = parser.parse_args()
    skill_dir = Path(args.skill_dir).resolve()

    report = validate_skill(skill_dir, strict=args.strict)

    if args.json:
        output = {
            "skill_dir": str(skill_dir),
            "skill_name": skill_dir.name,
            "passed": report.passed,
            "errors": len(report.errors),
            "warnings": len(report.warnings),
            "suggestions": len(report.suggestions),
            "issues": [
                {
                    "file": i.file,
                    "line": i.line,
                    "severity": i.severity,
                    "category": i.category,
                    "message": i.message,
                }
                for i in report.issues
            ],
        }
        print(json.dumps(output, indent=2))
    else:
        print_report(report)

    return 0 if report.passed else 1


if __name__ == "__main__":
    sys.exit(main())
