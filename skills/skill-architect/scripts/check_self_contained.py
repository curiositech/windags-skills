#!/usr/bin/env python3
"""
Self-Containment Checker — Detect Phantom References and Orphaned Files

Scans all markdown files in a skill directory for path references to
scripts/, references/, and assets/ — then verifies each referenced file
exists. Optionally detects orphaned files (exist but are never referenced).

Usage:
    python scripts/check_self_contained.py <skill-dir>
    python scripts/check_self_contained.py <skill-dir> --json
    python scripts/check_self_contained.py <skill-dir> --include-orphans

Examples:
    python scripts/check_self_contained.py ~/.claude/skills/skill-architect
    python scripts/check_self_contained.py . --json --include-orphans
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Set, Tuple


# ──────────────────────────────────────────────────────────────────────
# Types
# ──────────────────────────────────────────────────────────────────────

@dataclass
class Reference:
    """A file path reference found in a markdown file."""
    source_file: str   # The .md file containing the reference
    source_line: int    # Line number where the reference appears
    target_path: str    # The referenced path (e.g., "scripts/validate.py")
    exists: bool        # Whether the target file actually exists


@dataclass
class OrphanedFile:
    """A file that exists but is never referenced."""
    path: str           # Relative path within skill directory
    size_bytes: int     # File size


@dataclass
class SelfContainmentReport:
    skill_dir: str = ""
    references: List[Reference] = field(default_factory=list)
    orphans: List[OrphanedFile] = field(default_factory=list)
    files_scanned: int = 0

    @property
    def phantoms(self) -> List[Reference]:
        return [r for r in self.references if not r.exists]

    @property
    def valid_refs(self) -> List[Reference]:
        return [r for r in self.references if r.exists]

    @property
    def passed(self) -> bool:
        return len(self.phantoms) == 0


# ──────────────────────────────────────────────────────────────────────
# Reference Detection
# ──────────────────────────────────────────────────────────────────────

# Directories that constitute skill-internal references
TRACKED_DIRS = {"scripts", "references", "assets", "agents", "eval-viewer"}

# Pattern matches: references/foo.md, scripts/bar.py, assets/baz.png
# In various contexts: backticks, quotes, bare paths, markdown links
REF_PATTERN = re.compile(
    r"(?:^|[\s`\"'(\[])("
    + "|".join(re.escape(d) for d in TRACKED_DIRS)
    + r")/([^\s`\"')\]#]+)"
)

# Markers that indicate a line contains an illustrative example rather than a real reference.
# Lines matching any of these patterns are skipped — the path they mention is a placeholder.
ILLUSTRATIVE_MARKERS = re.compile(
    r"(?:"
    r"e\.g\.,|"                   # (e.g., scripts/foo.py)
    r"for example[,:]|"           # for example, references/guide.md
    r"\bexample\b.*path|"         # example path
    r"replace with|"              # (replace with your actual ...)
    r"your actual|"               # your actual reference file names
    r"\bsuch as\b|"               # such as references/foo.md
    r"<!-- *phantom-ok *-->|"     # explicit opt-out annotation
    r"What it looks like|"        # Anti-pattern prose examples
    r"backtick-formatted path|"   # Evaluation docs describing phantom path detection
    r"triggering a false phantom|" # Evaluation narrative describing phantom detections
    r"false positive root cause"  # Evaluation post-mortems about false positives
    r")",
    re.IGNORECASE,
)


def strip_inline_code_spans(line: str) -> str:
    """Return line with inline backtick spans replaced by spaces.

    This lets the caller detect paths in *prose* that happen to appear
    outside inline code, while ignoring paths that are clearly quoted as
    code examples (e.g., `references/foo.md`).

    Note: we do NOT strip triple-backtick fences here — those are handled
    by the outer code-fence tracker.
    """
    # Replace all `...` spans with spaces of equal length
    return re.sub(r"`[^`\n]+`", lambda m: " " * len(m.group()), line)


def find_references_in_file(file_path: Path, skill_dir: Path) -> List[Reference]:
    """Extract all path references from a markdown file.

    References are found in:
    - Backtick-quoted inline code:  `references/foo.md`
    - Quoted strings:               'scripts/bar.py'
    - Bare paths in prose:          See references/baz.md for details

    False positives are suppressed for:
    - Lines inside triple-backtick fenced code blocks (examples/templates)
    - Lines that contain illustrative markers (e.g., "e.g.,", "for example")
    - Lines with explicit `<!-- phantom-ok -->` annotation
    """
    refs: List[Reference] = []
    try:
        text = file_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return refs

    rel_source = str(file_path.relative_to(skill_dir))
    lines = text.split("\n")

    # Track fenced code blocks to skip example/template references
    in_code_fence = False
    fence_pattern = re.compile(r"^\s*(`{3,}|~{3,})")

    for i, line in enumerate(lines, 1):
        if fence_pattern.match(line):
            in_code_fence = not in_code_fence
            continue

        # Skip references inside code blocks (these are examples/templates)
        if in_code_fence:
            continue

        # Skip lines that are illustrative examples, not real references
        if ILLUSTRATIVE_MARKERS.search(line):
            continue

        for match in REF_PATTERN.finditer(line):
            dir_name = match.group(1)
            rest = match.group(2).rstrip(".,;:!?")
            target = f"{dir_name}/{rest}"

            # Skip duplicates in the same file
            if any(r.target_path == target and r.source_file == rel_source for r in refs):
                continue

            full_target = skill_dir / target
            refs.append(Reference(
                source_file=rel_source,
                source_line=i,
                target_path=target,
                exists=full_target.exists(),
            ))

    return refs


def find_all_tracked_files(skill_dir: Path) -> Set[str]:
    """Find all files in tracked directories."""
    files: Set[str] = set()
    for dir_name in TRACKED_DIRS:
        d = skill_dir / dir_name
        if d.exists() and d.is_dir():
            for f in d.rglob("*"):
                if f.is_file() and not f.name.startswith("."):
                    files.add(str(f.relative_to(skill_dir)))
    return files


def find_orphans(skill_dir: Path, referenced_paths: Set[str]) -> List[OrphanedFile]:
    """Find files that exist in tracked dirs but are never referenced."""
    all_files = find_all_tracked_files(skill_dir)
    orphaned = all_files - referenced_paths
    result = []
    for path in sorted(orphaned):
        full = skill_dir / path
        try:
            size = full.stat().st_size
        except OSError:
            size = 0
        result.append(OrphanedFile(path=path, size_bytes=size))
    return result


# ──────────────────────────────────────────────────────────────────────
# Main Check
# ──────────────────────────────────────────────────────────────────────

def check_self_contained(
    skill_dir: Path,
    include_orphans: bool = False,
) -> SelfContainmentReport:
    """Run self-containment check on a skill directory."""
    report = SelfContainmentReport(skill_dir=str(skill_dir))

    if not skill_dir.is_dir():
        return report

    # Scan all markdown files
    md_files = list(skill_dir.rglob("*.md"))
    report.files_scanned = len(md_files)

    for md_file in md_files:
        refs = find_references_in_file(md_file, skill_dir)
        report.references.extend(refs)

    # Orphan detection
    if include_orphans:
        referenced_paths = {r.target_path for r in report.references}
        report.orphans = find_orphans(skill_dir, referenced_paths)

    return report


def print_report(report: SelfContainmentReport, include_orphans: bool = False):
    """Print human-readable report."""
    skill_name = Path(report.skill_dir).name if report.skill_dir else "unknown"
    print(f"\n{'='*60}")
    print(f"  Self-Containment Check: {skill_name}")
    print(f"{'='*60}\n")

    print(f"  Files scanned: {report.files_scanned}")
    print(f"  References found: {len(report.references)}")
    print(f"  Valid: {len(report.valid_refs)}")
    print(f"  Phantoms: {len(report.phantoms)}")
    print()

    if report.phantoms:
        print("  PHANTOM REFERENCES (files referenced but don't exist):")
        for ref in report.phantoms:
            print(f"    ✗ {ref.source_file}:{ref.source_line} → {ref.target_path}")
        print()

    if include_orphans and report.orphans:
        print("  ORPHANED FILES (exist but never referenced):")
        for orphan in report.orphans:
            size_kb = orphan.size_bytes / 1024
            print(f"    ? {orphan.path} ({size_kb:.1f} KB)")
        print()

    status = "PASS (0 phantoms)" if report.passed else f"FAIL ({len(report.phantoms)} phantoms)"
    print(f"  Result: {status}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Check skill directory for phantom references and orphaned files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("skill_dir", help="Path to the skill directory")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--include-orphans", action="store_true",
                        help="Also report files that exist but are never referenced")

    args = parser.parse_args()
    skill_dir = Path(args.skill_dir).resolve()

    report = check_self_contained(skill_dir, include_orphans=args.include_orphans)

    if args.json:
        output = {
            "skill_dir": str(skill_dir),
            "skill_name": skill_dir.name,
            "passed": report.passed,
            "files_scanned": report.files_scanned,
            "total_references": len(report.references),
            "valid_references": len(report.valid_refs),
            "phantom_count": len(report.phantoms),
            "phantoms": [
                {
                    "source_file": r.source_file,
                    "source_line": r.source_line,
                    "target_path": r.target_path,
                }
                for r in report.phantoms
            ],
        }
        if args.include_orphans:
            output["orphan_count"] = len(report.orphans)
            output["orphans"] = [
                {"path": o.path, "size_bytes": o.size_bytes}
                for o in report.orphans
            ]
        print(json.dumps(output, indent=2))
    else:
        print_report(report, include_orphans=args.include_orphans)

    return 0 if report.passed else 1


if __name__ == "__main__":
    sys.exit(main())
