#!/usr/bin/env python3
"""Run the real pd-console CI gate locally and report it as a script-io envelope.

This mirrors the `rust-console` and `rust-console-gpui` jobs in
`.github/workflows/ci.yml`:
  - Linux/default gate:  `cargo check` + `cargo test`  (gpui feature OFF — the
    GPU window is feature-gated so Linux never compiles Metal-centric gpui)
  - macOS window build:  `cargo build --features gpui --bin pd-console`

It does NOT invent flags the CI doesn't use. In particular there is NO
`RUST_MIN_STACK` override and NO `--bin pd-console-repl` test filter in CI — the
real stack-overflow guard is `#![recursion_limit = "512"]` at the top of main.rs
(gpui's macro-heavy element builders), not an env var. See
references/build-and-ci.md.

Envelope command: `console.verify`  (also runs as a plain CLI: `verify_console.py run --crate <path>`)
  payload: {"crate_dir": "core/pd-console", "gpui": false}
  result:  {"steps": [{"cmd": "...", "rc": 0, "ok": true}], "ok": true}

`--selftest` does a dry run (checks cargo is present, does NOT compile).
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from typing import Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _envelope import run, write_ok, write_error  # noqa: E402


def _run_step(cmd: list[str], cwd: str) -> dict[str, Any]:
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=1800)
    except subprocess.TimeoutExpired:
        return {"cmd": " ".join(cmd), "rc": -1, "ok": False, "stderr": "timed out (>30m)"}
    return {
        "cmd": " ".join(cmd),
        "rc": r.returncode,
        "ok": r.returncode == 0,
        # tail of stderr is where rustc/cargo put the diagnostics
        "stderr": r.stderr.strip().splitlines()[-40:],
    }


def verify(crate_dir: str, gpui: bool) -> dict[str, Any]:
    if not shutil.which("cargo"):
        return {"ok": False, "steps": [], "error": "cargo not on PATH"}
    if not os.path.isdir(crate_dir):
        return {"ok": False, "steps": [], "error": f"crate dir not found: {crate_dir}"}

    steps: list[dict[str, Any]] = []
    # The always-on Linux/default gate.
    steps.append(_run_step(["cargo", "check"], crate_dir))
    steps.append(_run_step(["cargo", "test"], crate_dir))
    # The GPU window build — only meaningful on macOS (Metal). Opt-in.
    if gpui:
        steps.append(_run_step(
            ["cargo", "build", "--features", "gpui", "--bin", "pd-console"], crate_dir))
    return {"ok": all(s["ok"] for s in steps), "steps": steps}


def handler(payload: dict[str, Any]) -> dict[str, Any]:
    return verify(payload.get("crate_dir", "core/pd-console"), bool(payload.get("gpui", False)))


def selftest() -> dict[str, Any]:
    return {"ok": True, "cargo_present": shutil.which("cargo") is not None, "dry_run": True}


if __name__ == "__main__":
    # Convenience CLI: `verify_console.py run --crate core/pd-console [--gpui]`
    if len(sys.argv) > 1 and sys.argv[1] == "run":
        crate = "core/pd-console"
        gpui = "--gpui" in sys.argv
        if "--crate" in sys.argv:
            crate = sys.argv[sys.argv.index("--crate") + 1]
        out = verify(crate, gpui)
        if out["ok"]:
            write_ok(out)
        else:
            write_error("verify_failed", "one or more cargo steps failed", hint=str(out))
            sys.exit(1)
    else:
        run(handler, "console.verify", selftest=selftest)
