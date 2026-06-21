#!/usr/bin/env python3
"""Heuristic audit for advanced skill operating-surface affordances."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass
class Finding:
    severity: str
    category: str
    path: str
    message: str


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def frontmatter(text: str) -> str:
    if not text.startswith("---\n"):
        return ""
    parts = text.split("---\n", 2)
    return parts[1] if len(parts) >= 3 else ""


def referenced_paths(skill_dir: Path) -> set[str]:
    paths: set[str] = set()
    for path in skill_dir.rglob("*.md"):
        if "output" in path.parts:
            continue
        text = read_text(path)
        for match in re.finditer(r"`((?:agents|references|scripts|templates|schemas|examples|fixtures)/[^`]+)`", text):
            referenced = match.group(1)
            if any(token in referenced for token in ("*", " ", "<", ">", "[")):
                continue
            paths.add(referenced)
    return paths


def audit(skill_dir: Path) -> list[Finding]:
    findings: list[Finding] = []
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return [Finding("error", "structure", "SKILL.md", "Missing SKILL.md.")]

    text = read_text(skill_md)
    fm = frontmatter(text)

    if not (skill_dir / "agents" / "openai.yaml").exists():
        findings.append(
            Finding(
                "warning",
                "interface",
                "agents/openai.yaml",
                "Missing UI metadata. Add it for first-party distributed skills or record why this is local-only.",
            )
        )

    agent_match = re.search(r"(?m)^agent:\s*([A-Za-z0-9_-]+)\s*$", fm)
    if "context: fork" in fm and not agent_match:
        findings.append(Finding("error", "subagent", "SKILL.md", "`context: fork` is set without an `agent:` field."))
    if agent_match:
        agent_name = agent_match.group(1)
        candidates = [
            skill_dir / "agents" / f"{agent_name}.md",
            skill_dir / "agents" / f"{agent_name}.yaml",
            skill_dir / "agents" / f"{agent_name}.yml",
        ]
        if not any(path.exists() for path in candidates):
            findings.append(
                Finding(
                    "error",
                    "subagent",
                    "agents",
                    f"`agent: {agent_name}` has no matching prompt/config asset under agents/.",
                )
            )

    if "Port Daddy" in text and "pd " not in text:
        findings.append(
            Finding(
                "warning",
                "coordination",
                "SKILL.md",
                "Mentions Port Daddy without concrete `pd` primitives.",
            )
        )

    for referenced in sorted(referenced_paths(skill_dir)):
        if not (skill_dir / referenced).exists():
            findings.append(Finding("error", "phantom", referenced, "Referenced support file does not exist."))

    if (skill_dir / "templates").exists() and not any((skill_dir / "templates").iterdir()):
        findings.append(Finding("warning", "structure", "templates", "Empty templates directory."))
    if (skill_dir / "schemas").exists() and not any((skill_dir / "schemas").iterdir()):
        findings.append(Finding("warning", "structure", "schemas", "Empty schemas directory."))

    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit advanced skill operating-surface affordances.")
    parser.add_argument("skill_dir", help="Skill directory")
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    args = parser.parse_args()

    skill_dir = Path(args.skill_dir).resolve()
    findings = audit(skill_dir)
    errors = [finding for finding in findings if finding.severity == "error"]

    if args.json:
        print(json.dumps({"skill_dir": str(skill_dir), "errors": len(errors), "findings": [asdict(f) for f in findings]}, indent=2))
    else:
        print(f"Skill dir: {skill_dir}")
        print(f"Errors: {len(errors)}")
        for finding in findings:
            print(f"{finding.severity.upper()} [{finding.category}] {finding.path}: {finding.message}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
