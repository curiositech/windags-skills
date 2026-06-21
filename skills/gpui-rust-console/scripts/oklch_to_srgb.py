#!/usr/bin/env python3
"""Convert OKLCH theme tokens to packed 0xRRGGBB sRGB — a faithful Python port of
`core/pd-console/src/theme.rs::Oklch::to_srgb8` (Björn Ottosson's standard
OKLCH→OKLab→linear sRGB→gamma path).

Why this exists: the console theme is authored in OKLCH (perceptually uniform) and
GPUI wants `rgb(u32)`. When you add a status tone or tweak the accent you want to
SEE the hex without a `cargo build`. This script is the source-of-truth port; its
selftest asserts the same channel relationships theme.rs::tests does, so a drift in
the math is caught here too.

Envelope command: `oklch.to_srgb`
  payload: {"l": 0.80, "c": 0.105, "h": 78.0}  (one color)
        or {"colors": {"accent": {"l":..,"c":..,"h":..}, ...}}  (a ramp)
  result: {"hex": "e3b56d", "rgb": [227,181,109]}  or  {"colors": {...}}

Run `--selftest` to verify against the locked DARK theme tokens.
"""
from __future__ import annotations

import math
import os
import sys
from typing import Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _envelope import run  # noqa: E402


def _gamma_encode(v: float) -> int:
    v = max(0.0, min(1.0, v))
    s = 12.92 * v if v <= 0.0031308 else 1.055 * (v ** (1.0 / 2.4)) - 0.055
    return int(max(0.0, min(1.0, s)) * 255.0 + 0.5)


def oklch_to_srgb8(l: float, c: float, h: float) -> int:
    """Port of theme.rs::Oklch::to_srgb8. Returns packed 0xRRGGBB."""
    hr = math.radians(h)
    a, b = c * math.cos(hr), c * math.sin(hr)
    # OKLab -> LMS'
    l_ = l + 0.39633778 * a + 0.21580376 * b
    m_ = l - 0.105561346 * a - 0.06385417 * b
    s_ = l - 0.08948418 * a - 1.2914855 * b
    l3, m3, s3 = l_ ** 3, m_ ** 3, s_ ** 3
    # LMS -> linear sRGB
    lin_r = 4.0767417 * l3 - 3.3077116 * m3 + 0.23096994 * s3
    lin_g = -1.268438 * l3 + 2.6097574 * m3 - 0.34131938 * s3
    lin_b = -0.004196086 * l3 - 0.7034186 * m3 + 1.7076147 * s3
    return (_gamma_encode(lin_r) << 16) | (_gamma_encode(lin_g) << 8) | _gamma_encode(lin_b)


def _one(color: dict[str, Any]) -> dict[str, Any]:
    packed = oklch_to_srgb8(float(color["l"]), float(color["c"]), float(color["h"]))
    return {
        "hex": f"{packed:06x}",
        "rgb": [(packed >> 16) & 0xFF, (packed >> 8) & 0xFF, packed & 0xFF],
    }


def handler(payload: dict[str, Any]) -> dict[str, Any]:
    if "colors" in payload:
        return {"colors": {name: _one(c) for name, c in payload["colors"].items()}}
    return _one(payload)


# The locked DARK theme tokens (theme.rs::DARK) for the selftest.
_DARK = {
    "bg": (0.16, 0.006, 80.0),
    "ink": (0.95, 0.012, 85.0),
    "accent": (0.80, 0.105, 78.0),
}


def selftest() -> dict[str, Any]:
    out = {name: _one({"l": l, "c": c, "h": h}) for name, (l, c, h) in _DARK.items()}
    # Same invariants theme.rs::oklch_converts_to_plausible_srgb asserts:
    ink = out["ink"]["rgb"]
    assert ink[0] > 220 and ink[1] > 220 and ink[2] > 200, f"ink not bright: {ink}"
    bg = out["bg"]["rgb"]
    assert bg[0] < 40 and bg[2] < 40, f"bg not dark: {bg}"
    ac = out["accent"]["rgb"]
    assert ac[0] >= ac[1] >= ac[2], f"accent not warm: {ac}"
    return {"ok": True, "dark_theme": out}


if __name__ == "__main__":
    run(handler, "oklch.to_srgb", selftest=selftest)
