#!/usr/bin/env python3
"""Self-check the gpui-rust-console skill: frontmatter, required references,
schema validity, no phantom citations, and that every script's --selftest exits ok.

Exit codes: 0 pass, 1 failures, 2 invocation error. Designed for CI.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_REFS = [
    "console-architecture.md",
    "render-and-layout.md",
    "maritime-flags.md",
    "build-and-ci.md",
    "text-input.md",
]
REQUIRED_SCHEMAS = ["script-io.schema.json"]
REQUIRED_SCRIPTS_SELFTEST = ["oklch_to_srgb.py", "flag_resolve.py", "verify_console.py"]
REQUIRED_TEMPLATES = ["new_pane.rs.tmpl", "pane_tests.rs.tmpl"]
REQUIRED_EXAMPLES = ["add-a-pane.md", "preview-theme.md"]

errors: list[str] = []
warnings: list[str] = []


def err(m: str) -> None:
    errors.append(m)


def warn(m: str) -> None:
    warnings.append(m)


def check_frontmatter() -> None:
    p = ROOT / "SKILL.md"
    if not p.exists():
        err("SKILL.md missing")
        return
    content = p.read_text()
    m = re.match(r"---\n(.*?)\n---", content, re.DOTALL)
    if not m:
        err("SKILL.md missing YAML frontmatter")
        return
    fm = m.group(1)
    for required in ("name:", "description:"):
        if required not in fm:
            err(f"frontmatter missing {required.rstrip(':')}")
    if "NOT for" not in content and "NOT for" not in fm:
        warn("description should include 'NOT for' exclusions")
    lines = len(content.splitlines())
    if lines > 500:
        err(f"SKILL.md is {lines} lines (>500). Move depth to references.")
    if "```mermaid" not in content:
        warn("SKILL.md has no mermaid diagram")


def check_files(label: str, dirname: str, required: list[str]) -> None:
    base = ROOT / dirname
    if not base.exists():
        err(f"{dirname}/ directory missing")
        return
    have = {p.name for p in base.iterdir() if p.is_file()}
    for f in required:
        if f not in have:
            err(f"{label} missing: {dirname}/{f}")


def check_schemas_valid_json() -> None:
    base = ROOT / "schemas"
    if not base.exists():
        return
    for p in base.glob("*.json"):
        try:
            json.loads(p.read_text())
        except json.JSONDecodeError as e:
            err(f"schema invalid JSON: {p.name}: {e}")


def check_no_phantom_refs() -> None:
    skill = (ROOT / "SKILL.md").read_text()
    for sub, pat in (("references", r"references/([\w\-]+\.md)"),
                     ("scripts", r"scripts/([\w\-_]+\.py)"),
                     ("examples", r"examples/([\w\-]+\.md)")):
        cited = set(re.findall(pat, skill))
        on_disk = {p.name for p in (ROOT / sub).glob("*")}
        for c in cited - on_disk:
            err(f"phantom {sub} cited in SKILL.md but not on disk: {sub}/{c}")


def run_script_selftests() -> None:
    base = ROOT / "scripts"
    for s in REQUIRED_SCRIPTS_SELFTEST:
        p = base / s
        if not p.exists():
            err(f"script missing: scripts/{s}")
            continue
        try:
            r = subprocess.run([sys.executable, str(p), "--selftest"],
                               capture_output=True, text=True, timeout=30)
            if r.returncode != 0:
                err(f"selftest failed: {s} (rc={r.returncode}): {r.stderr.strip()[:200]}")
                continue
            out = json.loads(r.stdout.splitlines()[-1])
            if not (out.get("ok") or out.get("result", {}).get("ok")):
                err(f"selftest reported non-ok: {s}: {r.stdout[:200]}")
        except (subprocess.TimeoutExpired, json.JSONDecodeError, IndexError) as e:
            err(f"selftest error: {s}: {e}")


def main() -> int:
    check_frontmatter()
    check_files("reference", "references", REQUIRED_REFS)
    check_files("schema", "schemas", REQUIRED_SCHEMAS)
    check_files("template", "templates", REQUIRED_TEMPLATES)
    check_files("example", "examples", REQUIRED_EXAMPLES)
    check_schemas_valid_json()
    check_no_phantom_refs()
    run_script_selftests()

    print(f"errors:   {len(errors)}")
    print(f"warnings: {len(warnings)}")
    for e in errors:
        print(f"  ERR  {e}")
    for w in warnings:
        print(f"  WARN {w}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
