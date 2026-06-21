"""Shared script-io envelope helpers for the gpui-rust-console skill.

Every script reads a Request envelope from stdin and writes a Response envelope
to stdout. See schemas/script-io.schema.json. Stdlib-only on purpose so the
scripts run in any CI image without a venv.
"""
from __future__ import annotations

import json
import sys
from typing import Any, Callable

VERSION = "1"


def read_request() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        return {"kind": "request", "version": VERSION, "command": "", "payload": {}}
    try:
        req = json.loads(raw)
    except json.JSONDecodeError as e:
        write_error("invalid_json", f"stdin is not valid JSON: {e}")
        sys.exit(2)
    if req.get("kind") != "request":
        write_error("invalid_envelope", "expected kind=request")
        sys.exit(2)
    return req


def write_ok(result: dict[str, Any], trace_id: str | None = None) -> None:
    out: dict[str, Any] = {"kind": "response", "version": VERSION, "ok": True, "result": result}
    if trace_id:
        out["trace_id"] = trace_id
    json.dump(out, sys.stdout, separators=(",", ":"), sort_keys=True)
    sys.stdout.write("\n")


def write_error(code: str, message: str, hint: str | None = None,
                trace_id: str | None = None) -> None:
    err: dict[str, Any] = {"code": code, "message": message}
    if hint:
        err["hint"] = hint
    out: dict[str, Any] = {"kind": "response", "version": VERSION, "ok": False, "error": err}
    if trace_id:
        out["trace_id"] = trace_id
    json.dump(out, sys.stdout, separators=(",", ":"), sort_keys=True)
    sys.stdout.write("\n")


def run(handler: Callable[[dict[str, Any]], dict[str, Any]],
        expected_command: str,
        selftest: Callable[[], dict[str, Any]] | None = None) -> None:
    """Read request, dispatch, write response. Catch and report errors.

    If ``--selftest`` is passed, run the supplied selftest (or a no-op success)
    and emit ``{"ok": true, ...}`` so validate_skill.py can gate on it.
    """
    if "--selftest" in sys.argv[1:]:
        if selftest is not None:
            try:
                write_ok(selftest())
            except Exception as e:  # noqa: BLE001 — selftest boundary
                write_error("selftest_failed", str(e))
                sys.exit(1)
        else:
            write_ok({"selftest": "ok"})
        return
    req = read_request()
    if req.get("command") != expected_command:
        write_error(
            "wrong_command",
            f"expected command={expected_command}; got {req.get('command')!r}",
            trace_id=req.get("trace_id"),
        )
        sys.exit(2)
    try:
        result = handler(req.get("payload", {}))
    except Exception as e:  # noqa: BLE001 — boundary, want trace
        write_error("handler_failed", str(e), trace_id=req.get("trace_id"))
        sys.exit(1)
    write_ok(result, trace_id=req.get("trace_id"))
