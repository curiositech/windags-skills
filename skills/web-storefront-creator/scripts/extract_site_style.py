#!/usr/bin/env python3
"""Extract design tokens (fonts, colors, radius) from an existing website so
storefront previews blend in with it. Stdlib-only, heuristic by design.

Works from a live URL (fetches the page + linked stylesheets) or a local
project directory (reads *.css and CSS custom properties).

Usage:
    python3 extract_site_style.py https://example.com --out style-tokens.json
    python3 extract_site_style.py ./my-site/src --out style-tokens.json

Output is a starting point, not gospel: open the JSON, eyeball the picks, and
correct anything the heuristics got wrong before rendering previews.
"""
import argparse
import colorsys
import json
import re
import sys
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

HEX_RE = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
FONT_RE = re.compile(r"font-family\s*:\s*([^;}{]+)[;}]", re.IGNORECASE)
RADIUS_RE = re.compile(r"border-radius\s*:\s*([\d.]+(?:px|rem|em))", re.IGNORECASE)
VAR_RE = re.compile(r"(--[\w-]+)\s*:\s*([^;}{]+)[;}]")
LINK_CSS_RE = re.compile(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', re.IGNORECASE)
HREF_RE = re.compile(r'href=["\']([^"\']+)["\']')
GENERIC_FONTS = {"inherit", "initial", "sans-serif", "serif", "monospace", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "var"}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (style-extractor)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", errors="replace")


def gather_css(source: str) -> tuple[str, str]:
    """Returns (all_css_text, html_text)."""
    if source.startswith(("http://", "https://")):
        html = fetch(source)
        css_chunks = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL | re.IGNORECASE)
        for link in LINK_CSS_RE.findall(html):
            m = HREF_RE.search(link)
            if not m:
                continue
            css_url = urllib.parse.urljoin(source, m.group(1))
            try:
                css_chunks.append(fetch(css_url))
            except Exception as e:
                print(f"  note: could not fetch {css_url}: {e}", file=sys.stderr)
        return "\n".join(css_chunks), html
    root = Path(source)
    if not root.exists():
        raise SystemExit(f"ERROR: {source} is neither a URL nor an existing path")
    chunks = [p.read_text(errors="replace") for p in root.rglob("*.css")
              if "node_modules" not in p.parts]
    return "\n".join(chunks), ""


def norm_hex(h: str) -> str:
    h = h.lower()
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return "#" + h


def hsl_of(hex6: str) -> tuple[float, float, float]:
    r, g, b = (int(hex6[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h, s, l


def pick_colors(counts: Counter) -> dict:
    """Heuristic role assignment: lightest frequent = background, darkest
    frequent = text, most-frequent saturated mid-tone = accent."""
    ranked = counts.most_common(40)
    bg = text = accent = None
    for hex6, _ in ranked:
        _, s, l = hsl_of(hex6)
        if bg is None and l > 0.85:
            bg = hex6
        if text is None and l < 0.25:
            text = hex6
    for hex6, _ in ranked:
        _, s, l = hsl_of(hex6)
        if s > 0.35 and 0.25 < l < 0.75 and hex6 not in (bg, text):
            accent = hex6
            break
    # Dark-mode site: most frequent color is dark -> swap roles
    if ranked and hsl_of(ranked[0][0])[2] < 0.3:
        bg = bg or ranked[0][0]
        if bg and hsl_of(bg)[2] > 0.5 and text and hsl_of(text)[2] < 0.3:
            bg, text = text, bg
    return {
        "background": bg or "#faf8f5",
        "text": text or "#1c1917",
        "accent": accent or "#8b4513",
        "top_colors_seen": [f"{h} (x{c})" for h, c in ranked[:12]],
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", help="Site URL or local project directory")
    ap.add_argument("--out", default="style-tokens.json")
    args = ap.parse_args()

    css, _ = gather_css(args.source)
    if not css.strip():
        print("WARN: no CSS found; writing neutral defaults you should edit.", file=sys.stderr)

    font_counts: Counter = Counter()
    for decl in FONT_RE.findall(css):
        first = decl.split(",")[0].strip().strip("'\"")
        if first and first.lower() not in GENERIC_FONTS and not first.startswith("--"):
            font_counts[first] += 1

    color_counts: Counter = Counter(norm_hex(m) for m in HEX_RE.findall(css))
    radius_counts: Counter = Counter(RADIUS_RE.findall(css))
    css_vars = {name: val.strip() for name, val in VAR_RE.findall(css)
                if any(k in name for k in ("color", "primary", "accent", "brand", "bg", "background", "font", "radius"))}

    fonts = [f for f, _ in font_counts.most_common(4)]
    tokens = {
        "_note": "Heuristic extraction — REVIEW before use. Fix any wrong picks by hand.",
        "source": args.source,
        "fonts": {
            "heading": fonts[1] if len(fonts) > 1 else (fonts[0] if fonts else "Georgia"),
            "body": fonts[0] if fonts else "Georgia",
            "all_seen": [f"{f} (x{c})" for f, c in font_counts.most_common(8)],
        },
        "colors": pick_colors(color_counts),
        "radius": radius_counts.most_common(1)[0][0] if radius_counts else "6px",
        "css_variables_found": dict(sorted(css_vars.items())[:30]),
    }
    Path(args.out).write_text(json.dumps(tokens, indent=2))
    print(f"Wrote {args.out}")
    print(f"  body font: {tokens['fonts']['body']}   heading: {tokens['fonts']['heading']}")
    print(f"  bg {tokens['colors']['background']}  text {tokens['colors']['text']}  accent {tokens['colors']['accent']}  radius {tokens['radius']}")
    print("Review the picks (especially accent) before rendering previews.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
