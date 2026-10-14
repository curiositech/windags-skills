#!/usr/bin/env python3
"""Verify the closed, reviewed interview reference surface without dependencies.

The runtimes enumerate files directly, so an unlinked restored asset is still
dangerous. Exact inventories reject both historical and renamed extra guides.
This gate checks structure and availability; prose changes still need review.
"""
import re
import sys
from pathlib import Path

EXPECTED = {
    "interview-loop-strategist": {
        "INDEX.md", "company-specific-loops.md", "mock-interview-rubrics.md",
        "preparation-timeline-templates.md",
    },
    "interview-simulator": {
        "INDEX.md", "mobile-app-architecture.md", "whiteboard-engine-setup.md",
    },
}
SPECIALISTS = {
    "senior-coding-interview", "ml-system-design-interview",
    "anthropic-technical-deep-dive", "tech-presentation-interview",
    "values-behavioral-interview", "hiring-manager-deep-dive",
}


def audit(root: Path) -> list[str]:
    """Report unreviewed assets, missing routes, or broken reference hubs.

    Resolve the complete reference tree, including nested files, because a
    distribution may expose more assets than the authoritative runtime does.
    Direct specialist edges are required; indirect discovery is insufficient.
    """
    errors = []
    for skill_id, expected in EXPECTED.items():
        skill = root / "skills" / skill_id
        refs = skill / "references"
        entry = skill / "SKILL.md"
        if not entry.is_file() or not refs.is_dir():
            errors.append(f"{skill_id}: missing entry point or references")
            continue
        actual = {p.relative_to(refs).as_posix() for p in refs.rglob("*") if p.is_file()}
        if actual != expected:
            errors.append(f"{skill_id}: reference inventory differs: extra={sorted(actual - expected)}, missing={sorted(expected - actual)}")
        text = entry.read_text(encoding="utf-8")
        if "[references/INDEX.md](references/INDEX.md)" not in text:
            errors.append(f"{skill_id}: entry point does not load reference index")
        frontmatter = re.match(r"^---\n([\s\S]*?)\n---", text)
        if not frontmatter:
            errors.append(f"{skill_id}: missing closed frontmatter")
            continue
        pairs = set(re.findall(r"^    - skill: ([a-z0-9-]+)\s*$", frontmatter.group(1), re.M))
        partner = "interview-simulator" if skill_id == "interview-loop-strategist" else "interview-loop-strategist"
        if pairs != SPECIALISTS | {partner}:
            errors.append(f"{skill_id}: direct specialist relationships differ")
        for paired in pairs:
            if not (root / "skills" / paired / "SKILL.md").is_file():
                errors.append(f"{skill_id}: unavailable specialist {paired}")
        index = refs / "INDEX.md"
        if index.is_file():
            index_text = index.read_text(encoding="utf-8")
            for name in expected - {"INDEX.md"}:
                if f"]({name})" not in index_text:
                    errors.append(f"{skill_id}: index does not link {name}")
            for target in re.findall(r"\]\(([^)]+)\)", index_text):
                if target not in expected - {"INDEX.md"}:
                    errors.append(f"{skill_id}: unreviewed index target {target}")
        for path in refs.rglob("*"):
            if path.is_symlink():
                errors.append(f"{skill_id}: reference symlink is not a reviewed local asset: {path.name}")
    return errors


def main() -> int:
    """Use the repository containing this script, or an explicit fixture root."""
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    errors = audit(root)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("Interview bundle inventories, indexes, and direct specialists verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
