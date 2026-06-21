#!/usr/bin/env python3
"""Resolve a canonical agent-state string to its ICS maritime flag, meanings, and
badge color — a faithful port of `core/pd-console/src/maritime.rs`
(`flag_for_state`, `Flag::letter`, `ics_meaning`, `pd_meaning`, `bg_rgb`).

Why: the FlagBadge is the console's at-a-glance status glyph. When you add a new
agent state you must (1) map it to a flag in maritime.rs AND (2) keep the tooltip
meanings coherent. This script lets an agent check "what flag does state X get, and
is it the right ICS semantic?" without a `cargo run`, and the selftest pins the
load-bearing mappings (HITL→Foxtrot, mayday→Juliett) the Rust tests also pin.

Envelope command: `flag.resolve`
  payload: {"state": "awaiting-human"}  ->  full record
        or {"states": ["idle","mayday"]}  ->  list of records
"""
from __future__ import annotations

import os
import sys
from typing import Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _envelope import run  # noqa: E402

# (letter, ics_meaning, pd_meaning, bg_rgb) — mirrors maritime.rs exactly.
FLAGS: dict[str, tuple[str, str, str, int]] = {
    "Alpha":   ("A", "I have a diver down; keep well clear at slow speed", "Agent spawning — keep clear", 0x374151),
    "Bravo":   ("B", "I am taking in, discharging, or carrying dangerous cargo", "Agent burning budget at elevated rate", 0x374151),
    "Charlie": ("C", "Affirmative / Yes", "Approved / confirmed", 0x2D6A4F),
    "Delta":   ("D", "Keep clear of me; I am maneuvering with difficulty", "Agent blocked / waiting on dependency", 0x7F1D1D),
    "Echo":    ("E", "I am altering my course to starboard", "Agent pivoting mid-task", 0x1E3A5F),
    "Foxtrot": ("F", "I am disabled; communicate with me", "HITL gate active — agent needs operator input", 0x7F1D1D),
    "Golf":    ("G", "I require a pilot", "Agent requesting orchestrator guidance", 0x4A1942),
    "Hotel":   ("H", "I have a pilot on board", "Agent has active file claims — engaged", 0x2D6A4F),
    "India":   ("I", "I am altering my course to port", "Agent re-routing", 0x1E3A5F),
    "Juliett": ("J", "I am on fire and have dangerous cargo on board; keep well clear", "Agent in crisis — runaway / on fire", 0x7F1D1D),
    "Kilo":    ("K", "I wish to communicate with you", "Agent has a message for you", 0x92400E),
    "Lima":    ("L", "You should stop your vessel instantly", "Coordination Guard blocked this commit", 0x374151),
    "Mike":    ("M", "My vessel is stopped and making no way through the water", "Agent idle / no progress", 0x92400E),
    "November":("N", "Negative / No", "Error / refused / negative", 0x7F1D1D),
    "Oscar":   ("O", "Man overboard", "Agent crashed — man overboard", 0x7F1D1D),
    "Papa":    ("P", "Blue Peter — all persons report on board; about to put to sea", "Fleet healthy — ready to sail", 0x2D6A4F),
    "Quebec":  ("Q", "My vessel is healthy and I request free pratique", "New agent — no completed sortie history yet", 0x2D6A4F),
    "Romeo":   ("R", "The way is off my ship; you may feel your way past me", "Agent completed — way is off", 0x1E3A5F),
    "Sierra":  ("S", "I am operating astern propulsion", "Agent rolling back", 0x1E3A5F),
    "Tango":   ("T", "Keep clear of me; I am engaged in pair trawling", "Coordinated multi-agent operation", 0x374151),
    "Uniform": ("U", "You are running into danger", "Conflict warning — running into danger", 0x92400E),
    "Victor":  ("V", "I require assistance", "Agent needs operator assistance", 0x7F1D1D),
    "Whiskey": ("W", "I require medical assistance", "Agent health degraded", 0x7F1D1D),
    "Xray":    ("X", "Stop carrying out your intentions and watch for my signals", "Guard override pending", 0x7F1D1D),
    "Yankee":  ("Y", "I am dragging my anchor", "Agent has stale claims — dragging anchor", 0x92400E),
    "Zulu":    ("Z", "I require a tug", "Agent needs a larger operation to assist", 0x374151),
}

# Mirrors maritime.rs::flag_for_state. Unknown -> Mike (idle), like the Rust `_` arm.
STATE_TO_FLAG: dict[str, str] = {
    "spawning": "Alpha", "starting": "Alpha",
    "burning-cash": "Bravo", "over-budget": "Bravo",
    "approved": "Charlie", "affirmative": "Charlie",
    "blocked": "Delta", "waiting": "Delta",
    "pivoting": "Echo",
    "awaiting-human": "Foxtrot", "hitl": "Foxtrot", "gated": "Foxtrot",
    "needs-orchestrator": "Golf",
    "claim-active": "Hotel", "engaged": "Hotel",
    "mayday": "Juliett", "crisis": "Juliett", "runaway": "Juliett",
    "messaging": "Kilo", "request": "Kilo",
    "guard-blocked": "Lima", "commit-blocked": "Lima",
    "idle": "Mike", "resting": "Mike",
    "error": "November", "failed": "November", "refused": "November",
    "crashed": "Oscar", "dead": "Oscar",
    "healthy": "Papa", "fleet-healthy": "Papa",
    "new": "Quebec", "newcomer": "Quebec",
    "completed": "Romeo", "landed": "Romeo", "done": "Romeo",
    "rolling-back": "Sierra",
    "coordinated": "Tango", "pair": "Tango",
    "conflict-warning": "Uniform",
    "needs-help": "Victor",
    "degraded": "Whiskey",
    "guard-intercept": "Xray",
    "claim-stale": "Yankee", "stale": "Yankee",
}


def resolve(state: str) -> dict[str, Any]:
    flag = STATE_TO_FLAG.get(state, "Mike")
    letter, ics, pd, bg = FLAGS[flag]
    return {
        "state": state,
        "flag": flag,
        "letter": letter,
        "ics_meaning": ics,
        "pd_meaning": pd,
        "bg_hex": f"{bg:06x}",
        "fallback": state not in STATE_TO_FLAG,
    }


def handler(payload: dict[str, Any]) -> dict[str, Any]:
    if "states" in payload:
        return {"flags": [resolve(s) for s in payload["states"]]}
    return resolve(payload["state"])


def selftest() -> dict[str, Any]:
    # maritime.rs::hitl_flag_is_foxtrot
    assert resolve("awaiting-human")["flag"] == "Foxtrot"
    assert resolve("hitl")["flag"] == "Foxtrot"
    assert "disabled" in resolve("hitl")["ics_meaning"]
    # maritime.rs::mayday_is_juliett
    assert resolve("mayday")["flag"] == "Juliett"
    assert "on fire" in resolve("mayday")["ics_meaning"]
    # unknown state falls back to Mike (idle), like the Rust `_` arm
    assert resolve("totally-unknown")["flag"] == "Mike"
    assert resolve("totally-unknown")["fallback"] is True
    # every flag has all four facets non-empty (maritime.rs::all_states_map_to_flags)
    for f, (letter, ics, pd, _bg) in FLAGS.items():
        assert letter and ics and pd, f"flag {f} missing facet"
    return {"ok": True, "states_known": len(STATE_TO_FLAG), "flags": len(FLAGS)}


if __name__ == "__main__":
    run(handler, "flag.resolve", selftest=selftest)
