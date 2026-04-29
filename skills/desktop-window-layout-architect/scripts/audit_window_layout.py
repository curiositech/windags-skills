#!/usr/bin/env python3
"""Static audit for desktop window-layout systems.

This tool scans a codebase for the layout anti-patterns that make desktop
applications feel fake: guessed work areas, percentage-first pane splits,
boolean maximize state, peer support windows, overweight chrome, and missing
restore semantics.

The script is deliberately conservative. It does not try to prove correctness;
it highlights strong signals that usually deserve a human review.

Example commands:
    python3 scripts/audit_window_layout.py apps/tauri-desktop
    python3 scripts/audit_window_layout.py apps/tauri-desktop --format json
    python3 scripts/audit_window_layout.py apps/tauri-desktop --format html \
        --output /tmp/window-layout-audit.html

Example JSON output shape:
{
  "target": "/repo/apps/tauri-desktop",
  "files_scanned": 23,
  "scores": [
    {
      "id": "geometry-contract",
      "label": "Geometry Contract",
      "score": 1,
      "out_of": 5,
      "goal": "Define default sizes, minimums, snap-safe widths, and explicit reversible modes."
    }
  ],
  "findings": [
    {
      "id": "hardcoded-work-area",
      "severity": "high",
      "title": "Hard-coded work-area subtraction",
      "file": "src/state/windowStore.ts",
      "line": 22
    }
  ],
  "next_moves": [
    "Measure the real desktop container and clamp all placement against it."
  ]
}
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Sequence


SOURCE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".css",
    ".scss",
    ".rs",
    ".swift",
    ".kt",
    ".java",
    ".xaml",
}

IGNORED_DIRECTORIES = {
    ".git",
    ".next",
    ".turbo",
    ".yarn",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "target",
}

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2}
SEVERITY_BADGES = {"high": "High", "medium": "Medium", "low": "Low"}


@dataclass(frozen=True)
class SourceFile:
    """A source file included in the audit.

    Example:
        SourceFile(
            relative_path="apps/tauri-desktop/src/state/windowStore.ts",
            text="const width = window.innerWidth;"
        )
    """

    relative_path: str
    text: str


@dataclass(frozen=True)
class Finding:
    """A single static-audit finding with a concrete recommendation.

    Example:
        Finding(
            id="hardcoded-work-area",
            severity="high",
            category="placement",
            title="Hard-coded work-area subtraction",
            why="Shell chrome changes will drift away from this constant.",
            recommendation="Measure the real desktop container instead of subtracting magic numbers.",
            file="src/state/windowStore.ts",
            line=22,
            evidence="const height = window.innerHeight - 80;"
        )
    """

    id: str
    severity: str
    category: str
    title: str
    why: str
    recommendation: str
    file: str
    line: int
    evidence: str


@dataclass(frozen=True)
class DimensionScore:
    """A scored affordance dimension from the rubric file."""

    id: str
    label: str
    goal: str
    score: int
    out_of: int


@dataclass(frozen=True)
class AuditReport:
    """Structured output for downstream rendering or scripting."""

    target: str
    generated_at: str
    files_scanned: int
    scores: list[DimensionScore]
    findings: list[Finding]
    next_moves: list[str]
    scanned_files: list[str]


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse command-line arguments for the audit.

    Example:
        parse_args(["apps/tauri-desktop", "--format", "json"])
    """

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", nargs="?", default=".", help="Repo or app directory to audit.")
    parser.add_argument(
        "--format",
        choices=("markdown", "json", "html"),
        default="markdown",
        help="Output format.",
    )
    parser.add_argument(
        "--output",
        help="Optional file path for the rendered report. Stdout is still used when omitted.",
    )
    return parser.parse_args(argv)


def iter_source_files(target: Path) -> Iterable[Path]:
    """Yield source files that are likely to contain layout logic.

    The filter is intentionally broad enough to catch desktop shell code across
    Tauri, Electron, WinUI, SwiftUI, GTK, and React-based shells.
    """

    for path in target.rglob("*"):
        if not path.is_file():
            continue
        if any(part in IGNORED_DIRECTORIES for part in path.parts):
            continue
        if path.suffix.lower() not in SOURCE_EXTENSIONS:
            continue
        yield path


def load_sources(target: Path) -> list[SourceFile]:
    """Read matching source files into memory for pattern scans."""

    sources: list[SourceFile] = []
    for path in iter_source_files(target):
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        sources.append(SourceFile(relative_path=str(path.relative_to(target)), text=text))
    return sources


def line_number(text: str, index: int) -> int:
    """Convert a character offset into a 1-based line number."""

    return text.count("\n", 0, index) + 1


def first_match(sources: Sequence[SourceFile], pattern: str, flags: int = 0) -> tuple[SourceFile, re.Match[str]] | None:
    """Return the first regex match across the loaded source files."""

    regex = re.compile(pattern, flags)
    for source in sources:
        match = regex.search(source.text)
        if match:
            return source, match
    return None


def all_matches(
    sources: Sequence[SourceFile],
    pattern: str,
    *,
    flags: int = 0,
    file_pattern: str | None = None,
) -> list[tuple[SourceFile, re.Match[str]]]:
    """Return every regex match across the selected source files."""

    regex = re.compile(pattern, flags)
    file_regex = re.compile(file_pattern, re.IGNORECASE) if file_pattern else None
    matches: list[tuple[SourceFile, re.Match[str]]] = []
    for source in sources:
        if file_regex and not file_regex.search(source.relative_path):
            continue
        for match in regex.finditer(source.text):
            matches.append((source, match))
    return matches


def relevant_shell_source(sources: Sequence[SourceFile]) -> SourceFile | None:
    """Return a representative desktop-shell file for repo-wide fallback findings."""

    for source in sources:
        if re.search(r"(window|desktop|titlebar|taskbar|shell|split|pane)", source.relative_path, re.IGNORECASE):
            return source
    return sources[0] if sources else None


def build_finding(
    finding_id: str,
    severity: str,
    category: str,
    title: str,
    why: str,
    recommendation: str,
    source: SourceFile,
    match: re.Match[str],
) -> Finding:
    """Construct a normalized finding from a regex match."""

    return Finding(
        id=finding_id,
        severity=severity,
        category=category,
        title=title,
        why=why,
        recommendation=recommendation,
        file=source.relative_path,
        line=line_number(source.text, match.start()),
        evidence=match.group(0).strip(),
    )


def dedupe_findings(findings: Iterable[Finding]) -> list[Finding]:
    """Remove duplicate findings while preserving stable severity ordering."""

    unique: dict[tuple[str, str, int], Finding] = {}
    for finding in findings:
        key = (finding.id, finding.file, finding.line)
        unique.setdefault(key, finding)
    return sorted(
        unique.values(),
        key=lambda item: (SEVERITY_ORDER[item.severity], item.file, item.line, item.id),
    )


def load_scorecard(skill_root: Path) -> dict:
    """Load the rubric used to score the audit."""

    scorecard_path = skill_root / "affordance-scorecard.json"
    return json.loads(scorecard_path.read_text(encoding="utf-8"))


def detect_findings(sources: Sequence[SourceFile]) -> list[Finding]:
    """Run the heuristic detector suite and return normalized findings."""

    findings: list[Finding] = []

    for source, match in all_matches(
        sources,
        r"(?:window\.)?innerHeight\s*-\s*\d+|(?:window\.)?innerWidth\s*-\s*\d+",
    ):
        findings.append(
            build_finding(
                "hardcoded-work-area",
                "high",
                "placement",
                "Hard-coded work-area subtraction",
                "Shell chrome changes, title-bar tweaks, and embedded panes drift away from fixed subtraction constants.",
                "Measure the actual desktop container or visible work area, then share the result through a single clamp utility.",
                source,
                match,
            )
        )

    if first_match(sources, r"window\.innerWidth|window\.innerHeight") and not first_match(
        sources,
        r"ResizeObserver|getBoundingClientRect|visualViewport|offsetHeight|clientHeight",
    ):
        source, match = first_match(sources, r"window\.innerWidth|window\.innerHeight")  # type: ignore[misc]
        findings.append(
            build_finding(
                "viewport-as-work-area",
                "medium",
                "placement",
                "Viewport size is acting as the desktop work area",
                "Desktop shells usually lose space to custom title bars, taskbars, docked trays, and inspector chrome.",
                "Base placement on measured shell bounds instead of raw viewport dimensions.",
                source,
                match,
            )
        )

    maximize_match = first_match(sources, r"isMaximized\s*:\s*boolean")
    if maximize_match:
        source, match = maximize_match
        if not re.search(r"restoreBounds|getNormalBounds|\bmode\s*:", source.text):
            findings.append(
                build_finding(
                    "boolean-maximize-state",
                    "high",
                    "geometry",
                    "Boolean maximize state without explicit window modes",
                    "A single boolean cannot faithfully represent snapped, tiled, restored, fullscreen, and maximized behavior.",
                    "Replace the boolean with an explicit `mode` plus `restoreBounds` or use the platform's normal-bounds API.",
                    source,
                    match,
                )
            )

    snap_match = first_match(sources, r"snapWindow|toggleMaximize|maximize\(")
    if snap_match:
        source, match = snap_match
        if not re.search(r"restoreBounds|getNormalBounds|window-state|WindowStatePlugin", source.text):
            findings.append(
                build_finding(
                    "snap-without-restore-bounds",
                    "high",
                    "placement",
                    "Snap or maximize behavior without persisted normal bounds",
                    "Reversible window modes feel broken if the app overwrites its floating geometry during snap or maximize transitions.",
                    "Persist `restoreBounds` or use `getNormalBounds()` and restore from that shape when leaving snapped or maximized states.",
                    source,
                    match,
                )
            )

    registry_match = first_match(sources, r"DEFAULT_WINDOW_CONFIGS|windowRegistry|windowConfig")
    if registry_match:
        source, match = registry_match
        if not re.search(r"\brole\s*:", source.text):
            findings.append(
                build_finding(
                    "missing-surface-roles",
                    "medium",
                    "surface",
                    "Window registry lacks explicit surface roles",
                    "Type alone is usually too coarse to drive role-aware presets, collapse order, and field ownership.",
                    "Add metadata such as `role`, `collapsePriority`, and `snapSafeMinWidth` to the registry.",
                    source,
                    match,
                )
            )

    move_body_match = first_match(
        sources,
        r"moveWindow\s*:\s*\([^)]+\)\s*=>\s*\{(?P<body>[\s\S]{0,500}?)\n\s*\},",
    )
    if move_body_match:
        source, match = move_body_match
        body = match.group("body")
        if re.search(r"position:\s*\{\s*x,\s*y\s*\}", body) and not re.search(r"clamp|constrain|bound", body):
            findings.append(
                build_finding(
                    "unclamped-move",
                    "high",
                    "placement",
                    "Window movement appears to write raw coordinates without clamp logic",
                    "Users can lose windows off-screen when movement ignores the real work area and recovery margins.",
                    "Clamp movement so a draggable title region always remains reachable.",
                    source,
                    match,
                )
            )

    resize_body_match = first_match(
        sources,
        r"resizeWindow\s*:\s*\([^)]+\)\s*=>\s*\{(?P<body>[\s\S]{0,900}?)\n\s*\},",
    )
    if resize_body_match:
        source, match = resize_body_match
        body = match.group("body")
        if re.search(r"Math\.max\(minW,\s*width\)|Math\.max\(minH,\s*height\)", body) and not re.search(
            r"viewportWidth|viewportHeight|workArea|clamp|constrain",
            body,
        ):
            findings.append(
                build_finding(
                    "resize-without-work-area-clamp",
                    "high",
                    "geometry",
                    "Resize logic enforces minimums but not work-area bounds",
                    "Minimums alone prevent collapse but do not prevent windows from growing beyond what the shell can show.",
                    "Clamp resize operations against the measured work area after minimums are applied.",
                    source,
                    match,
                )
            )

    for source, match in all_matches(
        sources,
        r"(?:screenW|screenH|innerWidth|innerHeight)[^\\n;]{0,40}\*\s*0\.\d+",
    ):
        findings.append(
            build_finding(
                "percentage-first-layout",
                "high",
                "adaptive",
                "Percentage-first layout heuristics",
                "Fixed percentages usually overlap or starve panes once real minimums are applied.",
                "Choose a named preset after comparing summed minimums against available work area, then distribute remaining space by role priority.",
                source,
                match,
            )
        )

    for source, match in all_matches(sources, r"Math\.ceil\(\s*Math\.sqrt\("):
        findings.append(
            build_finding(
                "sqrt-grid-tiling",
                "medium",
                "surface",
                "Square-root tiling heuristic",
                "Grid-tiling every window by count ignores surface roles and often makes primary workspaces too small.",
                "Prefer role-aware presets or at least reserve the largest share for the primary field before tiling support windows.",
                source,
                match,
            )
        )

    if first_match(sources, r"cascadeWindows") and first_match(sources, r"index\s*\*\s*step|windows\.length\s*\*\s*\d+"):
        source, match = first_match(sources, r"index\s*\*\s*step|windows\.length\s*\*\s*\d+")  # type: ignore[misc]
        findings.append(
            build_finding(
                "static-cascade",
                "medium",
                "placement",
                "Static cascade heuristic",
                "Cascading by index is acceptable for first-open fallback, but it is not a replacement for remembered placement.",
                "Use cascade only as a fallback and persist per-window normal bounds for reopen behavior.",
                source,
                match,
            )
        )

    if first_match(sources, r"Snap left|Snap right|snapWindow\(.*left|snapWindow\(.*right", re.IGNORECASE):
        source, match = first_match(sources, r"Snap left|Snap right|snapWindow\(.*left|snapWindow\(.*right", re.IGNORECASE)  # type: ignore[misc]
        findings.append(
            build_finding(
                "always-visible-snap-controls",
                "low",
                "chrome",
                "Always-visible snap controls in child-window chrome",
                "Permanent snap buttons add chrome weight to every window and duplicate common platform affordances.",
                "Prefer edge-drag snap, title-bar double-click maximize, or contextual window-menu actions instead of persistent per-window buttons.",
                source,
                match,
            )
        )

    chrome_matches = all_matches(
        sources,
        r"h-(?:10|12|14)\b|border-2\b|h-7\b|w-7\b|height:\s*(?:40|48|56)px",
        file_pattern=r"(Titlebar|Taskbar|WindowFrame|globals\.css)$",
    )
    if len(chrome_matches) >= 4:
        source, match = chrome_matches[0]
        findings.append(
            build_finding(
                "heavy-shell-chrome",
                "medium",
                "chrome",
                "Shell chrome is likely consuming too much vertical and visual weight",
                "Large title bars, taskbars, caption buttons, borders, and repeated headers quickly crowd out the field.",
                "Trim caption sizes, reduce duplicated borders and headings, and reserve bold chrome for only one level of hierarchy.",
                source,
                match,
            )
        )

    if not first_match(sources, r"window-state|getNormalBounds|saveWindowState|restoreState"):
        source = relevant_shell_source(sources)
        fake_match = None
        if source and source.text:
            fake_match = re.search(r".+", source.text)
        elif source:
            fake_match = re.match(r".+", source.relative_path)
        if fake_match:
            findings.append(
                build_finding(
                    "no-persisted-window-state",
                    "medium",
                    "platform",
                    "No obvious persisted window-state support detected",
                    "Desktop apps feel disposable when placement, size, and normal bounds reset on every launch.",
                    "Use a platform capability such as Tauri `window-state`, Electron normal-bounds persistence, or your toolkit's restore API.",
                    source,
                    fake_match,
                )
            )

    return dedupe_findings(findings)


def score_dimensions(findings: Sequence[Finding], scorecard: dict) -> list[DimensionScore]:
    """Score each affordance dimension from the rubric and penalties."""

    penalties = scorecard["penalties"]
    totals = {item["id"]: 5 for item in scorecard["dimensions"]}
    for finding in findings:
        penalty = penalties.get(finding.id)
        if not penalty:
            continue
        dimension_id = penalty["dimension"]
        totals[dimension_id] = max(0, totals[dimension_id] - int(penalty["points"]))

    return [
        DimensionScore(
            id=item["id"],
            label=item["label"],
            goal=item["goal"],
            score=totals[item["id"]],
            out_of=5,
        )
        for item in scorecard["dimensions"]
    ]


def recommend_next_moves(findings: Sequence[Finding]) -> list[str]:
    """Choose a short, high-signal set of follow-up actions."""

    moves: list[str] = []
    seen: set[str] = set()
    for finding in findings:
        if finding.recommendation in seen:
            continue
        seen.add(finding.recommendation)
        moves.append(finding.recommendation)
        if len(moves) == 5:
            break
    return moves


def build_report(target: Path, sources: Sequence[SourceFile], skill_root: Path) -> AuditReport:
    """Run the full audit and return a structured report."""

    findings = detect_findings(sources)
    scorecard = load_scorecard(skill_root)
    scores = score_dimensions(findings, scorecard)
    return AuditReport(
        target=str(target.resolve()),
        generated_at=datetime.now(timezone.utc).isoformat(),
        files_scanned=len(sources),
        scores=scores,
        findings=findings,
        next_moves=recommend_next_moves(findings),
        scanned_files=[source.relative_path for source in sources],
    )


def render_markdown(report: AuditReport) -> str:
    """Render the audit as Markdown for humans and LLMs."""

    lines = [
        "# Desktop Window Layout Audit",
        "",
        f"- Target: `{report.target}`",
        f"- Files scanned: `{report.files_scanned}`",
        f"- Generated at: `{report.generated_at}`",
        "",
        "## Affordance Scorecard",
        "",
        "| Dimension | Score | Goal |",
        "|---|---:|---|",
    ]
    for score in report.scores:
        lines.append(f"| {score.label} | {score.score}/{score.out_of} | {score.goal} |")

    lines.extend(["", "## Findings", ""])
    if not report.findings:
        lines.append("- No static anti-patterns were detected by this heuristic pass.")
    else:
        for finding in report.findings:
            lines.extend(
                [
                    f"### [{SEVERITY_BADGES[finding.severity]}] {finding.title}",
                    f"- Location: `{finding.file}:{finding.line}`",
                    f"- Evidence: `{finding.evidence}`",
                    f"- Why it matters: {finding.why}",
                    f"- Recommendation: {finding.recommendation}",
                    "",
                ]
            )

    lines.extend(["## Recommended Next Moves", ""])
    for move in report.next_moves:
        lines.append(f"1. {move}")
    return "\n".join(lines) + "\n"


def render_json(report: AuditReport) -> str:
    """Render the audit as pretty JSON."""

    payload = {
        "target": report.target,
        "generated_at": report.generated_at,
        "files_scanned": report.files_scanned,
        "scores": [asdict(item) for item in report.scores],
        "findings": [asdict(item) for item in report.findings],
        "next_moves": report.next_moves,
        "scanned_files": report.scanned_files,
    }
    return json.dumps(payload, indent=2) + "\n"


def render_html(report: AuditReport) -> str:
    """Render the audit as a standalone HTML report."""

    score_cards = []
    for score in report.scores:
        pct = int((score.score / score.out_of) * 100)
        score_cards.append(
            f"""
            <article class="score-card">
              <div class="score-card__head">
                <h3>{html.escape(score.label)}</h3>
                <strong>{score.score}/{score.out_of}</strong>
              </div>
              <div class="score-bar"><span style="width:{pct}%"></span></div>
              <p>{html.escape(score.goal)}</p>
            </article>
            """
        )

    finding_cards = []
    for finding in report.findings:
        finding_cards.append(
            f"""
            <article class="finding finding--{finding.severity}">
              <header>
                <span class="badge">{html.escape(SEVERITY_BADGES[finding.severity])}</span>
                <h3>{html.escape(finding.title)}</h3>
              </header>
              <p class="meta">{html.escape(finding.file)}:{finding.line}</p>
              <pre>{html.escape(finding.evidence)}</pre>
              <p><strong>Why:</strong> {html.escape(finding.why)}</p>
              <p><strong>Recommendation:</strong> {html.escape(finding.recommendation)}</p>
            </article>
            """
        )

    next_moves = "".join(f"<li>{html.escape(move)}</li>" for move in report.next_moves)
    findings_html = "\n".join(finding_cards) if finding_cards else "<p>No static anti-patterns were detected by this heuristic pass.</p>"

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Desktop Window Layout Audit</title>
    <style>
      :root {{
        color-scheme: light;
        --bg: #f7f2ea;
        --panel: #fffdf8;
        --ink: #182033;
        --muted: #5f6780;
        --outline: #20273a;
        --soft: #d4d8e6;
        --accent: #5c89d6;
        --warn: #f2b447;
        --bad: #d86c5c;
        --good: #83b35b;
      }}
      * {{ box-sizing: border-box; }}
      body {{
        margin: 0;
        font-family: "Inter", "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(92,137,214,0.15), transparent 28%),
          radial-gradient(circle at bottom right, rgba(216,108,92,0.12), transparent 24%),
          var(--bg);
        color: var(--ink);
      }}
      main {{
        width: min(1200px, calc(100vw - 48px));
        margin: 32px auto 56px;
      }}
      .hero, .panel {{
        background: color-mix(in srgb, var(--panel) 92%, white 8%);
        border: 3px solid var(--outline);
        box-shadow: 12px 12px 0 rgba(32, 39, 58, 0.08);
      }}
      .hero {{
        padding: 28px 30px;
        margin-bottom: 22px;
      }}
      h1 {{
        margin: 0 0 10px;
        font-size: clamp(2rem, 3vw, 3rem);
        line-height: 0.95;
      }}
      .subtle {{
        color: var(--muted);
        font-size: 0.98rem;
      }}
      .scores {{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 22px;
      }}
      .score-card {{
        background: var(--panel);
        border: 2px solid var(--outline);
        padding: 16px;
      }}
      .score-card__head {{
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
      }}
      .score-card h3 {{
        margin: 0;
        font-size: 1rem;
      }}
      .score-card p {{
        margin: 10px 0 0;
        color: var(--muted);
        font-size: 0.92rem;
      }}
      .score-bar {{
        height: 12px;
        border: 2px solid var(--outline);
        background: #ebe6dd;
        margin-top: 12px;
      }}
      .score-bar span {{
        display: block;
        height: 100%;
        background: linear-gradient(90deg, var(--accent), var(--good));
      }}
      .panel {{
        padding: 24px 26px;
        margin-bottom: 22px;
      }}
      .findings {{
        display: grid;
        gap: 16px;
      }}
      .finding {{
        border: 2px solid var(--outline);
        background: var(--panel);
        padding: 16px 18px;
      }}
      .finding header {{
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }}
      .finding h3 {{
        margin: 0;
        font-size: 1.04rem;
      }}
      .badge {{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 72px;
        padding: 0.2rem 0.55rem;
        border: 2px solid var(--outline);
        background: #efe7da;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }}
      .finding--high .badge {{ background: rgba(216,108,92,0.24); }}
      .finding--medium .badge {{ background: rgba(242,180,71,0.24); }}
      .finding--low .badge {{ background: rgba(92,137,214,0.2); }}
      .meta {{
        margin: 0 0 10px;
        color: var(--muted);
        font-family: "JetBrains Mono", monospace;
        font-size: 0.86rem;
      }}
      pre {{
        overflow-x: auto;
        padding: 12px;
        background: #1c2236;
        color: #eff3ff;
        border: 2px solid var(--outline);
        white-space: pre-wrap;
        margin: 0 0 12px;
      }}
      ol {{
        margin: 0;
        padding-left: 1.2rem;
      }}
      li + li {{
        margin-top: 0.55rem;
      }}
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="subtle">Desktop Window Layout Audit</p>
        <h1>{html.escape(Path(report.target).name or report.target)}</h1>
        <p class="subtle">Scanned {report.files_scanned} files at {html.escape(report.generated_at)}</p>
      </section>
      <section class="scores">
        {''.join(score_cards)}
      </section>
      <section class="panel">
        <h2>Recommended Next Moves</h2>
        <ol>{next_moves}</ol>
      </section>
      <section class="panel">
        <h2>Findings</h2>
        <div class="findings">
          {findings_html}
        </div>
      </section>
    </main>
  </body>
</html>
"""


def write_or_print(output: str, output_path: str | None) -> None:
    """Write the rendered report to disk or stdout."""

    if output_path:
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(output, encoding="utf-8")
        print(str(path))
        return
    sys.stdout.write(output)


def main(argv: Sequence[str]) -> int:
    """Entry point used by the CLI wrapper."""

    args = parse_args(argv)
    target = Path(args.target).resolve()
    if not target.exists():
        print(f"target does not exist: {target}", file=sys.stderr)
        return 1

    skill_root = Path(__file__).resolve().parents[1]
    sources = load_sources(target)
    report = build_report(target, sources, skill_root)

    if args.format == "json":
        rendered = render_json(report)
    elif args.format == "html":
        rendered = render_html(report)
    else:
        rendered = render_markdown(report)

    write_or_print(rendered, args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
