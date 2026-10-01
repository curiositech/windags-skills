#!/usr/bin/env python3
"""glass_contrast_check.py - WCAG contrast of text against the pixels behind Liquid Glass.

Glass changes the background under a label as content moves, so one design-tool contrast
number is meaningless. This tool samples every pixel inside each text region of a real
screenshot and reports per-pixel contrast statistics (min, p5, median, % failing).

Best practice: capture the screen with the label hidden (so the region contains only the
rendered glass backdrop) and pass the label colour. Capture worst cases: top of scroll,
brightest/busiest content under the bar, light and dark, Reduce Transparency on/off.

Design-time simulation: pass a raw backdrop (no glass rendered) plus --simulate-blur,
--simulate-dim and/or --simulate-tint to estimate what regular/clear glass would give.

Stdlib only (PNG decoding built in). JPEG/WebP and interlaced PNG need Pillow if installed.

Usage:
  glass_contrast_check.py SHOT.png --regions regions.json [--scale 2] [--json]
  glass_contrast_check.py SHOT.png --regions regions.json --simulate-blur 8 --simulate-dim 0.35
  glass_contrast_check.py --self-test

Exit codes: 0 all regions pass, 1 at least one region fails, 2 usage/input error.
"""
from __future__ import annotations

import argparse
import json
import struct
import sys
import zlib

THRESHOLDS = {"text": 4.5, "large": 3.0, "glyph": 3.0}


# ----------------------------------------------------------------------------- image IO
class Image:
    def __init__(self, width: int, height: int, rgb: list[tuple[float, float, float]]):
        self.width = width
        self.height = height
        self.rgb = rgb  # row-major, 0..255 floats

    def get(self, x: int, y: int) -> tuple[float, float, float]:
        x = min(max(x, 0), self.width - 1)
        y = min(max(y, 0), self.height - 1)
        return self.rgb[y * self.width + x]


def _paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    return b if pb <= pc else c


def decode_png(data: bytes, alpha_bg: tuple[int, int, int]) -> Image:
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    pos, idat, palette, trns = 8, bytearray(), None, None
    width = height = bit_depth = color_type = interlace = None
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + length]
        pos += 12 + length
        if ctype == b"IHDR":
            width, height, bit_depth, color_type, _, _, interlace = struct.unpack(">IIBBBBB", chunk)
        elif ctype == b"PLTE":
            palette = [tuple(chunk[i:i + 3]) for i in range(0, len(chunk), 3)]
        elif ctype == b"tRNS":
            trns = chunk
        elif ctype == b"IDAT":
            idat += chunk
        elif ctype == b"IEND":
            break
    if interlace:
        raise ValueError("interlaced PNG: install Pillow or re-save non-interlaced")
    if bit_depth not in (8, 16) and color_type != 3:
        raise ValueError(f"unsupported bit depth {bit_depth}")
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color_type]
    if color_type == 3 and bit_depth != 8:
        raise ValueError("palette PNG with bit depth < 8: install Pillow")
    bpc = 2 if bit_depth == 16 else 1
    bpp = channels * bpc
    stride = width * bpp
    raw = zlib.decompress(bytes(idat))
    out = bytearray(height * stride)
    prev = bytearray(stride)
    i = 0
    for y in range(height):
        ftype = raw[i]
        i += 1
        line = bytearray(raw[i:i + stride])
        i += stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
            if ftype == 1:
                line[x] = (line[x] + a) & 0xFF
            elif ftype == 2:
                line[x] = (line[x] + b) & 0xFF
            elif ftype == 3:
                line[x] = (line[x] + ((a + b) >> 1)) & 0xFF
            elif ftype == 4:
                line[x] = (line[x] + _paeth(a, b, c)) & 0xFF
        out[y * stride:(y + 1) * stride] = line
        prev = line
    pixels = []
    for p in range(width * height):
        base = p * bpp
        vals = [out[base + k * bpc] for k in range(channels)]  # high byte for 16-bit
        if color_type == 0:
            r = g = b_ = vals[0]
            a_ = 255
        elif color_type == 2:
            r, g, b_ = vals
            a_ = 255
        elif color_type == 3:
            r, g, b_ = palette[vals[0]]
            a_ = trns[vals[0]] if trns and vals[0] < len(trns) else 255
        elif color_type == 4:
            r = g = b_ = vals[0]
            a_ = vals[1]
        else:
            r, g, b_, a_ = vals
        if a_ < 255:
            t = a_ / 255.0
            r = r * t + alpha_bg[0] * (1 - t)
            g = g * t + alpha_bg[1] * (1 - t)
            b_ = b_ * t + alpha_bg[2] * (1 - t)
        pixels.append((float(r), float(g), float(b_)))
    return Image(width, height, pixels)


def load_image(path: str, alpha_bg: tuple[int, int, int]) -> Image:
    with open(path, "rb") as fh:
        data = fh.read()
    try:
        return decode_png(data, alpha_bg)
    except ValueError as err:
        try:
            from PIL import Image as PILImage  # type: ignore
        except ImportError:
            raise SystemExit(f"error: {path}: {err} (and Pillow is not installed)")
        im = PILImage.open(path).convert("RGBA")
        bg = PILImage.new("RGBA", im.size, alpha_bg + (255,))
        im = PILImage.alpha_composite(bg, im).convert("RGB")
        return Image(im.width, im.height, [tuple(map(float, p)) for p in im.getdata()])


# ----------------------------------------------------------------------------- colour math
def parse_color(value: str) -> tuple[float, float, float]:
    v = value.strip()
    if v.startswith("#"):
        v = v[1:]
        if len(v) == 3:
            v = "".join(ch * 2 for ch in v)
        return (float(int(v[0:2], 16)), float(int(v[2:4], 16)), float(int(v[4:6], 16)))
    parts = [p.strip() for p in v.replace("rgb(", "").replace(")", "").split(",")]
    return (float(parts[0]), float(parts[1]), float(parts[2]))


def _lin(c: float) -> float:
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb: tuple[float, float, float]) -> float:
    r, g, b = rgb
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def contrast(l1: float, l2: float) -> float:
    hi, lo = (l1, l2) if l1 >= l2 else (l2, l1)
    return (hi + 0.05) / (lo + 0.05)


# ----------------------------------------------------------------------------- simulation
def _box_blur_1d(vals: list[list[float]], w: int, h: int, r: int, horizontal: bool) -> list[list[float]]:
    out = [[0.0, 0.0, 0.0] for _ in range(w * h)]
    span = 2 * r + 1
    outer, inner = (h, w) if horizontal else (w, h)
    for o in range(outer):
        def idx(k: int) -> int:
            k = min(max(k, 0), inner - 1)
            return o * w + k if horizontal else k * w + o
        acc = [0.0, 0.0, 0.0]
        for k in range(-r, r + 1):
            p = vals[idx(k)]
            acc[0] += p[0]; acc[1] += p[1]; acc[2] += p[2]
        for k in range(inner):
            dst = o * w + k if horizontal else k * w + o
            out[dst] = [acc[0] / span, acc[1] / span, acc[2] / span]
            add, sub = vals[idx(k + r + 1)], vals[idx(k - r)]
            acc[0] += add[0] - sub[0]; acc[1] += add[1] - sub[1]; acc[2] += add[2] - sub[2]
    return out


def simulate(img: Image, x: int, y: int, w: int, h: int, blur: float,
             dim: float, tint: tuple[float, float, float, float] | None) -> list[tuple[float, float, float]]:
    """Return the region's pixels after an approximate glass treatment."""
    pad = int(blur * 3) + 1 if blur > 0 else 0
    X, Y, W, H = x - pad, y - pad, w + 2 * pad, h + 2 * pad
    vals = [list(img.get(X + i, Y + j)) for j in range(H) for i in range(W)]
    if blur > 0:
        # three box passes approximate a gaussian with this sigma
        r = max(1, int(round(((12 * blur * blur / 3) + 1) ** 0.5 / 2)))
        for _ in range(3):
            vals = _box_blur_1d(vals, W, H, r, True)
            vals = _box_blur_1d(vals, W, H, r, False)
    out = []
    for j in range(pad, pad + h):
        for i in range(pad, pad + w):
            r_, g_, b_ = vals[j * W + i]
            if tint:
                tr, tg, tb, ta = tint
                r_, g_, b_ = r_ * (1 - ta) + tr * ta, g_ * (1 - ta) + tg * ta, b_ * (1 - ta) + tb * ta
            if dim > 0:
                r_, g_, b_ = r_ * (1 - dim), g_ * (1 - dim), b_ * (1 - dim)
            out.append((r_, g_, b_))
    return out


# ----------------------------------------------------------------------------- analysis
def percentile(sorted_vals: list[float], p: float) -> float:
    if not sorted_vals:
        return float("nan")
    k = (len(sorted_vals) - 1) * p
    f = int(k)
    c = min(f + 1, len(sorted_vals) - 1)
    return sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f)


def stats_for(pixels, text_rgb, threshold, exclude_dist):
    tl = luminance(text_rgb)
    ratios = []
    for p in pixels:
        if exclude_dist > 0:
            d = ((p[0] - text_rgb[0]) ** 2 + (p[1] - text_rgb[1]) ** 2 + (p[2] - text_rgb[2]) ** 2) ** 0.5
            if d < exclude_dist:
                continue
        ratios.append(contrast(tl, luminance(p)))
    ratios.sort()
    n = len(ratios)
    if n == 0:
        return {"samples": 0}
    below = sum(1 for r in ratios if r < threshold)
    return {
        "samples": n,
        "min": round(ratios[0], 2),
        "p5": round(percentile(ratios, 0.05), 2),
        "median": round(percentile(ratios, 0.5), 2),
        "pct_below": round(100.0 * below / n, 1),
    }


def check(img: Image, regions: list[dict], scale: float, sim: dict, exclude_dist: float) -> list[dict]:
    results = []
    for reg in regions:
        kind = reg.get("kind", "large" if reg.get("large") else "text")
        threshold = float(reg.get("threshold", THRESHOLDS.get(kind, 4.5)))
        x, y = int(round(reg["x"] * scale)), int(round(reg["y"] * scale))
        w, h = max(1, int(round(reg["w"] * scale))), max(1, int(round(reg["h"] * scale)))
        if x >= img.width or y >= img.height:
            results.append({"id": reg.get("id"), "error": "region outside image"})
            continue
        w, h = min(w, img.width - x), min(h, img.height - y)
        if sim["blur"] or sim["dim"] or sim["tint"]:
            pixels = simulate(img, x, y, w, h, sim["blur"] * scale, sim["dim"], sim["tint"])
        else:
            pixels = [img.get(x + i, y + j) for j in range(h) for i in range(w)]
        candidates = ([("given", parse_color(reg["text_color"]))] if reg.get("text_color")
                      else [("black", (0.0, 0.0, 0.0)), ("white", (255.0, 255.0, 255.0))])
        evals = []
        for name, rgb in candidates:
            s = stats_for(pixels, rgb, threshold, exclude_dist if name == "given" else 0)
            s["text"] = name if name != "given" else reg["text_color"]
            evals.append(s)
        best = max(evals, key=lambda s: s.get("p5", 0))
        bg = [sum(p[k] for p in pixels) / len(pixels) for k in range(3)]
        res = {
            "id": reg.get("id"),
            "kind": kind,
            "threshold": threshold,
            "backdrop_mean_luminance": round(luminance(tuple(bg)), 3),
            **best,
            "pass": best.get("p5", 0) >= threshold,
        }
        if not reg.get("text_color"):
            res["note"] = f"no text_color given; best adaptive label colour is {best['text']}"
        results.append(res)
    return results


# ----------------------------------------------------------------------------- self-test
def self_test() -> int:
    assert abs(contrast(luminance((0, 0, 0)), luminance((255, 255, 255))) - 21.0) < 0.01
    assert abs(contrast(luminance((118, 118, 118)), luminance((255, 255, 255))) - 4.54) < 0.05
    # Build a 40x10 image: left half white, right half black; regions on each side.
    w, h = 40, 10
    px = [(255.0, 255.0, 255.0) if x < 20 else (0.0, 0.0, 0.0) for y in range(h) for x in range(w)]
    img = Image(w, h, px)
    r = check(img, [{"id": "dark-on-white", "x": 0, "y": 0, "w": 20, "h": 10, "text_color": "#111"},
                    {"id": "dark-on-black", "x": 20, "y": 0, "w": 20, "h": 10, "text_color": "#111"},
                    {"id": "adaptive", "x": 20, "y": 0, "w": 20, "h": 10}],
              1.0, {"blur": 0, "dim": 0, "tint": None}, 0)
    assert r[0]["pass"] and not r[1]["pass"], r
    assert r[2]["text"] == "white", r
    # Dimming a white backdrop by 35% should let white text gain contrast.
    sim = check(img, [{"id": "white-on-dimmed-white", "x": 0, "y": 0, "w": 20, "h": 10,
                       "text_color": "#fff"}], 1.0, {"blur": 0, "dim": 0.35, "tint": None}, 0)
    assert sim[0]["p5"] > 1.5 and not sim[0]["pass"], sim  # 35% dim alone is not enough for white text on white
    # PNG round trip through the decoder.
    raw = b"".join(b"\x00" + bytes([255, 0, 0] * 2) for _ in range(2))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", 2, 2, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))
    im = decode_png(png, (255, 255, 255))
    assert im.get(1, 1) == (255.0, 0.0, 0.0)
    print("self-test: ok")
    return 0


# ----------------------------------------------------------------------------- CLI
def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image", nargs="?")
    ap.add_argument("--regions", help="JSON file with {'regions': [...]} (see templates/contrast-regions.sample.json)")
    ap.add_argument("--scale", type=float, default=1.0, help="multiply region coords (e.g. 2 for CSS px on a 2x screenshot)")
    ap.add_argument("--simulate-blur", type=float, default=0.0, help="gaussian sigma in region units")
    ap.add_argument("--simulate-dim", type=float, default=0.0, help="black dimming layer opacity 0..1")
    ap.add_argument("--simulate-tint", default=None, help="'r,g,b,a' tint/fill composited over the backdrop")
    ap.add_argument("--text-present", type=float, default=0.0, metavar="DIST",
                    help="screenshot still contains the text: ignore pixels within this RGB distance of "
                         "text_color (40 is typical). Can hide real failures; prefer text-hidden captures.")
    ap.add_argument("--alpha-bg", default="255,255,255", help="background for transparent PNG pixels")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args(argv)
    if a.self_test:
        return self_test()
    if not a.image or not a.regions:
        ap.print_usage(sys.stderr)
        return 2
    with open(a.regions) as fh:
        spec = json.load(fh)
    regions = spec["regions"] if isinstance(spec, dict) else spec
    tint = None
    if a.simulate_tint:
        parts = [float(v) for v in a.simulate_tint.split(",")]
        tint = (parts[0], parts[1], parts[2], parts[3] if len(parts) > 3 else 0.1)
    img = load_image(a.image, tuple(int(v) for v in a.alpha_bg.split(",")))
    results = check(img, regions, a.scale,
                    {"blur": a.simulate_blur, "dim": a.simulate_dim, "tint": tint}, a.text_present)
    failed = [r for r in results if not r.get("pass")]
    if a.json:
        print(json.dumps({"image": a.image, "results": results, "pass": not failed}, indent=2))
    else:
        print(f"{'region':28} {'kind':6} {'need':>5} {'p5':>6} {'min':>6} {'median':>7} {'%fail':>6}  text      result")
        for r in results:
            if "error" in r:
                print(f"{str(r['id']):28} ERROR {r['error']}")
                continue
            print(f"{str(r['id']):28} {r['kind']:6} {r['threshold']:>5} {r.get('p5', 0):>6} {r.get('min', 0):>6} "
                  f"{r.get('median', 0):>7} {r.get('pct_below', 0):>6}  {str(r.get('text')):9} "
                  f"{'PASS' if r['pass'] else 'FAIL'}")
            if r.get("note"):
                print(f"{'':28} note: {r['note']}")
        print(f"\n{len(results) - len(failed)}/{len(results)} regions pass (gate: p5 >= threshold)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
