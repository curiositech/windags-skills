#!/usr/bin/env python3
"""Generate and audit an authored product palette; Python standard library only.

Color math: https://bottosson.github.io/posts/oklab/ (2021 matrices) and
https://www.w3.org/TR/css-color-4/#color-conversion-code . Contrast follows
https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html . This tool uses a
conservative fixed-lightness, fixed-hue chroma reduction, NOT the CSS Color 4
perceptual gamut-mapping algorithm. Audits describe listed opaque sRGB pairs,
not overall accessibility, color-vision distinguishability, or brand harmony.
"""
import argparse
import html
import json
import math
from pathlib import Path
import re
import sys
from urllib.parse import quote

STEPS = (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
LIGHTNESS = (.985, .96, .91, .85, .75, .65, .55, .45, .35, .25, .17)
ENVELOPE = (.08, .16, .32, .52, .80, 1, .95, .80, .65, .48, .32)
REQUIRED = tuple("""background foreground card card-foreground popover popover-foreground
primary primary-foreground secondary secondary-foreground muted muted-foreground
accent accent-foreground destructive destructive-foreground border input ring
chart-1 chart-2 chart-3 chart-4 chart-5 sidebar sidebar-foreground sidebar-primary
sidebar-primary-foreground sidebar-accent sidebar-accent-foreground sidebar-border
sidebar-ring success success-foreground warning warning-foreground info info-foreground
link selection selection-foreground primary-hover primary-active focus""".split())
SURFACES = ("card", "popover", "primary", "secondary", "muted", "accent",
            "destructive", "sidebar", "sidebar-primary", "sidebar-accent",
            "success", "warning", "info", "selection")
IDENTIFIER = re.compile(r"[a-z][a-z0-9]*(?:-[a-z0-9]+)*\Z")
NUMBER = r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?"
LITERAL = re.compile(r"oklch\(\s*(" + NUMBER + r")\s+(" + NUMBER + r")\s+(" + NUMBER + r")\s*\)\Z")
MAPPING_POLICY = "fixed-L/h binary chroma reduction to sRGB; not the CSS Color 4 gamut mapper"
# Only floating-point residue may be clipped. Substantive excursions reduce C.
GAMUT_EPSILON = 2e-7


def numeric(value):
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        return False
    try:
        return math.isfinite(value)
    except OverflowError:
        return False


def linear_to_srgb(value):
    """CSS Color 4 signed sRGB transfer function; accepts extended range."""
    if abs(value) <= .0031308:
        return 12.92 * value
    return math.copysign(1.055 * abs(value) ** (1 / 2.4) - .055, value)


def srgb_to_linear(value):
    return value / 12.92 if abs(value) <= .04045 else math.copysign(((abs(value) + .055) / 1.055) ** 2.4, value)


def oklab_to_linear_rgb(lightness, a, b):
    """Inverse of Ottosson's 2021 Oklab matrices, D65 / linear sRGB."""
    l = (lightness + .3963377774 * a + .2158037573 * b) ** 3
    m = (lightness - .1055613458 * a - .0638541728 * b) ** 3
    s = (lightness - .0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
            -.0041960863 * l - .7034186147 * m + 1.7076147010 * s)


def oklch_to_srgb(lightness, chroma, hue):
    radians = math.radians(hue % 360)
    return tuple(linear_to_srgb(channel) for channel in
                 oklab_to_linear_rgb(lightness, chroma * math.cos(radians), chroma * math.sin(radians)))


def srgb_to_oklab(red, green, blue):
    """Forward transform, also useful for independently specified RGB fixtures."""
    r, g, b = (srgb_to_linear(x) for x in (red, green, blue))
    l = .4122214708 * r + .5363325363 * g + .0514459929 * b
    m = .2119034982 * r + .6806995451 * g + .1073969566 * b
    s = .0883024619 * r + .2817188376 * g + .6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    return (.2104542553 * l + .7936177850 * m - .0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + .4505937099 * s,
            .0259040371 * l + .7827717662 * m - .8086757660 * s)


def in_gamut(rgb):
    return all(math.isfinite(x) and -GAMUT_EPSILON <= x <= 1 + GAMUT_EPSILON for x in rgb)


def gamut_map(lightness, chroma, hue):
    """Preserve L and h; binary-search C downwards, returning mapped LCh/RGB."""
    hue %= 360
    try:
        original = oklch_to_srgb(lightness, chroma, hue)
    except OverflowError:
        original = (math.inf,) * 3
    mapped = not in_gamut(original)
    if mapped:
        low, high = 0.0, min(chroma, 4.0)
        for _ in range(64):
            middle = (low + high) / 2
            if in_gamut(oklch_to_srgb(lightness, middle, hue)):
                low = middle
            else:
                high = middle
        chroma = low
    rgb = oklch_to_srgb(lightness, chroma, hue)
    # Matrix/transfer roundoff only: the search has already established gamut.
    rgb = tuple(min(1.0, max(0.0, x)) for x in rgb)
    return (lightness, chroma, hue), rgb, mapped


def css_color(lch):
    return "oklch(" + " ".join(format(x, ".12g") for x in lch) + ")"


def color_record(lightness, chroma, hue):
    requested = [lightness, chroma, hue % 360]
    lch, rgb, mapped = gamut_map(*requested)
    rgb8 = [int(math.floor(x * 255 + .5)) for x in rgb]
    return {"oklch": list(lch), "css": css_color(lch), "requestedOklch": requested,
            "mapped": mapped, "srgb": {"rgb": list(rgb), "rgb8": rgb8,
            "hex": "#" + "".join(format(x, "02x") for x in rgb8)}}


def luminance(rgb):
    return sum(weight * srgb_to_linear(channel) for weight, channel in zip((.2126, .7152, .0722), rgb))


def contrast_ratio(foreground, background):
    a, b = sorted((luminance(foreground), luminance(background)))
    return (b + .05) / (a + .05)


def audit(spec):
    """Return a JSON-safe report. Invalid input is reported, never exported."""
    report = {"name": "", "errors": [], "warnings": [], "ramps": {}, "themes": {},
              "contrast": [], "coverage": {}, "mapping": {"policy": MAPPING_POLICY,
              "numericalClipTolerance": GAMUT_EPSILON, "mappedColors": []},
              "limitations": ["Contrast covers listed opaque sRGB pairs only.",
              "Hue coverage does not establish harmony or accessibility.",
              "Inspect real typography, states, imagery, focus geometry and color-vision differentiation."]}
    errors, warnings = report["errors"], report["warnings"]
    if not isinstance(spec, dict):
        errors.append("spec must be a JSON object")
        return report
    unknown = set(spec) - {"name", "families", "themes", "pairs", "coverage"}
    if unknown:
        errors.append("unknown spec keys: " + ", ".join(sorted(unknown)))
    if not isinstance(spec.get("name"), str) or not spec["name"].strip():
        errors.append("name must be a nonempty string")
    else:
        report["name"] = spec["name"]
    families = spec.get("families")
    valid_families = {}
    if not isinstance(families, dict) or not families:
        errors.append("families must be a nonempty object")
        families = {}
    for family, values in families.items():
        location = "families." + str(family)
        if not isinstance(family, str) or not IDENTIFIER.fullmatch(family):
            errors.append(location + " must have a lowercase kebab-case name")
            continue
        if not isinstance(values, dict):
            errors.append(location + " must be an object")
            continue
        if set(values) - {"h", "c", "uses"}:
            errors.append(location + " has unknown keys")
        h, c, uses = values.get("h"), values.get("c"), values.get("uses")
        if not numeric(h) or not numeric(c) or c < 0:
            errors.append(location + " requires finite numeric h and nonnegative c")
            continue
        if not isinstance(uses, list) or not uses or any(not isinstance(x, str) or not x.strip() for x in uses):
            errors.append(location + ".uses must be a nonempty list of nonempty strings")
            continue
        valid_families[family] = values
        report["ramps"][family] = {str(step): color_record(l, c * envelope, h)
                                   for step, l, envelope in zip(STEPS, LIGHTNESS, ENVELOPE)}
    coverage = spec.get("coverage", {"maxGap": 75})
    if not isinstance(coverage, dict) or set(coverage) != {"maxGap"} or not numeric(coverage.get("maxGap")) or not 0 < coverage["maxGap"] <= 360:
        errors.append("coverage must contain only numeric maxGap in (0, 360]")
        max_gap = 75
    else:
        max_gap = coverage["maxGap"]
    hues = sorted({values["h"] % 360 for values in valid_families.values() if values["c"] >= .02})
    gaps = [((hues[(i + 1) % len(hues)] - hue) % 360) for i, hue in enumerate(hues)] if hues else []
    if len(hues) == 1:
        gaps = [360.0]
    measured = max(gaps) if gaps else None
    report["coverage"] = {"chromaticHues": hues, "cyclicGaps": gaps, "maxGap": measured,
                          "limit": max_gap, "neutralChromaCutoff": .02}
    if measured is None:
        warnings.append("No chromatic hue families; coverage cannot be measured.")
    elif measured > max_gap:
        warnings.append(f"Largest cyclic hue gap {measured:g} degrees exceeds {max_gap:g}; coverage is descriptive, not a harmony/accessibility verdict.")
    themes = spec.get("themes")
    if not isinstance(themes, dict):
        errors.append("themes must explicitly contain light and dark objects")
        themes = {}
    if set(themes) != {"light", "dark"}:
        errors.append("themes must explicitly contain exactly light and dark")
    if isinstance(themes.get("light"), dict) and isinstance(themes.get("dark"), dict):
        if set(themes["light"]) != set(themes["dark"]):
            errors.append("light and dark semantic token sets must match, including optional tokens")
    for theme in ("light", "dark"):
        definitions = themes.get(theme)
        report["themes"][theme] = {}
        if not isinstance(definitions, dict):
            errors.append("themes." + theme + " must be an object")
            continue
        missing = sorted(set(REQUIRED) - set(definitions))
        if missing:
            errors.append("themes." + theme + " missing tokens: " + ", ".join(missing))
        visiting = []
        resolved = report["themes"][theme]
        failed = set()

        def resolve(token):
            if token in resolved:
                return resolved[token]
            if token in failed:
                return None
            if token in visiting:
                errors.append(f"themes.{theme} alias cycle: " + " -> ".join(visiting + [token]))
                failed.add(token)
                return None
            if token not in definitions:
                errors.append(f"themes.{theme} unknown alias target: {token}")
                failed.add(token)
                return None
            expression = definitions[token]
            visiting.append(token)
            result = None
            if not isinstance(expression, str):
                errors.append(f"themes.{theme}.{token} must be a color expression string")
            elif expression.startswith("$"):
                target = expression[1:]
                if not IDENTIFIER.fullmatch(target):
                    errors.append(f"themes.{theme}.{token} has malformed alias")
                else:
                    result = resolve(target)
            else:
                literal = LITERAL.fullmatch(expression)
                if literal:
                    l, c, h = (float(x) for x in literal.groups())
                    if not all(numeric(x) for x in (l, c, h)) or not 0 <= l <= 1 or c < 0:
                        errors.append(f"themes.{theme}.{token} requires L in [0,1], C >= 0, and finite hue")
                    else:
                        result = color_record(l, c, h)
                elif "." in expression:
                    family, step = expression.rsplit(".", 1)
                    result = report["ramps"].get(family, {}).get(step)
                    if result is None:
                        errors.append(f"themes.{theme}.{token} unknown family shade: {expression}")
                else:
                    errors.append(f"themes.{theme}.{token} malformed color expression: {expression}")
            visiting.pop()
            if result is None:
                failed.add(token)
            else:
                resolved[token] = result
            return result

        for token in definitions:
            if not isinstance(token, str) or not IDENTIFIER.fullmatch(token):
                errors.append(f"themes.{theme} token names must be lowercase kebab-case")
                continue
            if any(token == family + "-" + str(step) for family in report["ramps"] for step in STEPS):
                errors.append(f"themes.{theme}.{token} collides with a family CSS namespace")
            resolve(token)
    pairs = spec.get("pairs")
    if not isinstance(pairs, list) or not pairs:
        errors.append("pairs must be a nonempty list with explicit light and dark use contexts")
        pairs = []
    pair_themes = set()

    def check_pair(theme, fg, bg, minimum, purpose, source):
        colors = report["themes"].get(theme, {})
        if fg not in colors or bg not in colors:
            errors.append(f"{source} pair {theme}:{fg}/{bg} references an unknown or unresolved token")
            return
        ratio = contrast_ratio(colors[fg]["srgb"]["rgb"], colors[bg]["srgb"]["rgb"])
        passed = ratio >= minimum  # Never round before comparing, even near 4.5.
        report["contrast"].append({"theme": theme, "fg": fg, "bg": bg, "min": minimum,
                                   "ratio": ratio, "pass": passed, "purpose": purpose, "source": source})
        if not passed:
            errors.append(f"{theme}:{fg}/{bg} contrast {ratio:.6f}:1 is below {minimum:g}:1 ({purpose})")

    for i, pair in enumerate(pairs):
        if not isinstance(pair, dict) or set(pair) != {"theme", "fg", "bg", "min", "purpose"}:
            errors.append(f"pairs[{i}] must contain theme, fg, bg, min, purpose only")
            continue
        theme, fg, bg, minimum, purpose = (pair.get(key) for key in ("theme", "fg", "bg", "min", "purpose"))
        if theme not in ("light", "dark") or not isinstance(fg, str) or not isinstance(bg, str) or not isinstance(purpose, str) or not purpose.strip() or not numeric(minimum) or not 3 <= minimum <= 21:
            errors.append(f"pairs[{i}] has invalid theme, token, purpose, or minimum (3..21)")
            continue
        if minimum < 4.5 and fg not in ("focus", "ring", "sidebar-ring", "border", "input", "sidebar-border", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"):
            errors.append(f"pairs[{i}] normal text minimum must be at least 4.5; 3 is only allowed for explicit non-text marks/boundaries/focus tokens")
            continue
        pair_themes.add(theme)
        check_pair(theme, fg, bg, minimum, purpose, "authored")
    if pair_themes != {"light", "dark"}:
        errors.append("pairs must explicitly cover both light and dark themes")
    for theme in ("light", "dark"):
        check_pair(theme, "foreground", "background", 4.5, "normal body text", "required")
        check_pair(theme, "link", "background", 4.5, "link text on page; non-color affordance still required", "required")
        for surface in SURFACES:
            check_pair(theme, surface + "-foreground", surface, 4.5, "normal text on " + surface, "required")
        for state in ("primary-hover", "primary-active"):
            check_pair(theme, "primary-foreground", state, 4.5, "button text in " + state, "required")
        for token in ("focus", "ring"):
            check_pair(theme, token, "background", 3, "limited to this adjacent background; inspect actual focus geometry and all adjacent colors", "required")
        check_pair(theme, "sidebar-ring", "sidebar", 3, "limited to sidebar adjacency; inspect actual focus geometry", "required")
    for group, collections in (("ramps", report["ramps"]), ("themes", report["themes"])):
        for name, colors in collections.items():
            for token, color in colors.items():
                if color["mapped"]:
                    report["mapping"]["mappedColors"].append(f"{group}.{name}.{token}")
    if report["mapping"]["mappedColors"]:
        warnings.append(f"Reduced chroma for {len(report['mapping']['mappedColors'])} color entries using {MAPPING_POLICY}.")
    return report


def token_rules(report):
    return "\n\n".join(selector + " {\n" + "\n".join(
        f"  --{token}: {color['css']};" for token, color in sorted(report["themes"][theme].items())) + "\n}"
        for theme, selector in (("light", ":root"), ("dark", ".dark")))


def family_declarations(report):
    return "\n".join(f"  --color-{family}-{step}: {color['css']};"
                     for family, ramp in report["ramps"].items() for step, color in ramp.items())


def render_css(report):
    semantic = sorted(set(report["themes"]["light"]) | set(report["themes"]["dark"]))
    aliases = "\n".join(f"  --color-{token}: var(--{token});" for token in semantic)
    return ('/* Generated opaque sRGB-mapped OKLCH tokens. ' + MAPPING_POLICY + '. */\n'
            '@import "tailwindcss";\n\n@custom-variant dark (&:where(.dark, .dark *));\n\n'
            '@theme {\n' + family_declarations(report) + '\n}\n\n@theme inline {\n' + aliases + '\n}\n\n'
            + token_rules(report) + '\n')


def render_preview(report, spec):
    escape = lambda value: html.escape(str(value), quote=True)
    title = escape(report["name"])
    theme_panels = []
    art_families = list(report["ramps"])
    art_colors = [f"var(--color-{family}-500)" for family in art_families]
    art_colors = (art_colors * 7)[:7]
    brand_art = f'''<svg class="brand-art" viewBox="0 0 320 260" role="img" aria-label="Original geometric landscape using the palette family 500 shades"><circle cx="223" cy="67" r="51" fill="{art_colors[0]}"/><path d="M12 238 88 51l88 187Z" fill="{art_colors[1]}"/><path d="m91 238 99-146 116 146Z" fill="{art_colors[2]}"/><path d="m88 51 36 187H12Z" fill="{art_colors[3]}"/><path d="m190 92 48 146H91Z" fill="{art_colors[4]}"/><rect x="10" y="224" width="298" height="24" rx="12" fill="{art_colors[5]}"/><circle cx="274" cy="194" r="25" fill="{art_colors[6]}"/></svg>'''
    for theme in ("light", "dark"):
        status = "".join(f'<span class="status {kind}">{label}</span>' for kind, label in
                         (("success", "Ready"), ("warning", "Review needed"), ("info", "Synced"), ("destructive", "Failed")))
        charts = "".join(f'<div><i style="height:{height}%;background:var(--chart-{i})"></i><span>{label}</span></div>'
                         for i, (height, label) in enumerate(((45, "Mon"), (62, "Tue"), (53, "Wed"), (87, "Thu"), (72, "Fri")), 1))
        theme_panels.append(f'''<section class="theme {theme if theme == 'dark' else ''}" aria-label="{theme} theme">
<div class="app-heading"><span class="mark" aria-hidden="true">◈</span><strong>{title}</strong><span class="mode">{theme.title()}</span></div>
<div class="product"><aside><strong>Workspace</strong><a class="nav" href="#palette">Overview</a><span>Projects</span><span>Members</span></aside>
<div class="workspace"><p class="eyebrow">PRODUCT PREVIEW</p><h2>Make progress visible.</h2><p class="subtle">Review your workspace and choose the next step.</p>
<div class="actions"><button>New project</button><button class="secondary">View activity</button><button class="selected" aria-pressed="true">Selected view ✓</button><button class="secondary" disabled>Export paused</button></div>
<label>Project name<input placeholder="Your next idea" value="Launch workspace"></label>
<div class="statuses">{status}</div><article class="card"><div class="card-heading"><h3>Weekly activity</h3><a href="#palette">View report ↗</a></div>
<div class="chart" aria-label="Illustrative five-series activity chart; inspect series distinguishability">{charts}</div></article>
<div class="message">A useful detail appears here. <a href="#palette">Learn more</a></div></div></div>
<div class="brand-panels"><div class="brand-logo"><span class="mark">◈</span><strong>{title}</strong><small>Illustrative logo colors</small></div>
<div class="favicon-panel"><span class="favicon">◈</span><small>Illustrative favicon · 32 px</small></div><div class="og-panel"><span>{title}</span><div class="og-content"><strong>A clearer view<br>of what comes next.</strong>{brand_art}</div><small>Illustrative social card colors · original geometric artwork</small></div></div></section>''')
    swatches = []
    for family, ramp in report["ramps"].items():
        uses = ", ".join(spec["families"][family]["uses"])
        cells = "".join(f'<li><span class="chip" style="background:{color["css"]}"></span><strong>{step}</strong><code title="{color["css"]}">L {color["oklch"][0]:.5g}<br>C {color["oklch"][1]:.5g}<br>h {color["oklch"][2]:.5g}°</code><code class="derived">{color["srgb"]["hex"]}</code></li>'
                        for step, color in ramp.items())
        swatches.append(f'<section class="family"><h3>{escape(family)}</h3><p>{escape(uses)}</p><ul class="swatches">{cells}</ul></section>')
    wheel_marks = []
    for family, ramp in report["ramps"].items():
        hue = ramp["500"]["oklch"][2]
        angle = math.radians(hue - 90)
        x, y = 180 + 112 * math.cos(angle), 180 + 112 * math.sin(angle)
        tx, ty = 180 + 145 * math.cos(angle), 180 + 145 * math.sin(angle)
        if spec["families"][family]["c"] >= .02:
            wheel_marks.append(f'<line x1="180" y1="180" x2="{x:.3f}" y2="{y:.3f}" stroke="{ramp["500"]["css"]}" stroke-width="2"/><circle cx="{x:.3f}" cy="{y:.3f}" r="10" fill="{ramp["500"]["css"]}"/><text x="{tx:.3f}" y="{ty:.3f}" text-anchor="middle" dominant-baseline="middle">{escape(family)} · {hue:g}°</text>')
    wheel = '<svg class="hue-wheel" viewBox="0 0 360 360" role="img" aria-label="Authored chromatic family hues, excluding neutrals. Circle positions show hue, marker fills show actual mapped 500 shades."><circle cx="180" cy="180" r="112" fill="none" stroke="currentColor" opacity=".2"/>' + ''.join(wheel_marks) + '<circle cx="180" cy="180" r="4" fill="currentColor"/></svg>'
    results = "".join(f'<tr><td>{escape(row["theme"])}</td><td>{escape(row["fg"])} / {escape(row["bg"])}</td><td>{row["ratio"]:.3f}:1</td><td>{row["min"]:g}:1</td></tr>'
                      for row in report["contrast"])
    warnings = "".join('<li>' + escape(warning) + '</li>' for warning in report["warnings"])
    icon_color = report["themes"]["light"]["primary"]["srgb"]["hex"]
    icon_foreground = report["themes"]["light"]["primary-foreground"]["srgb"]["hex"]
    icon = quote(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="{icon_color}"/><path d="m16 6 10 10-10 10L6 16Z" fill="{icon_foreground}"/></svg>')
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} · palette preview</title><link rel="icon" href="data:image/svg+xml,{icon}">
<style>
/* These are the same :root/.dark declarations exported in tokens.css. */
{token_rules(report)}
:root {{
{family_declarations(report)}
}}
*{{box-sizing:border-box}}body{{margin:0;font:16px/1.5 system-ui,sans-serif;background:var(--background);color:var(--foreground)}}
main{{max-width:1440px;margin:auto;padding:clamp(16px,3vw,48px)}}h1{{font-size:clamp(2rem,4vw,3.5rem);line-height:1.1;letter-spacing:-.04em}}h2{{font-size:1.6rem;line-height:1.2;letter-spacing:-.03em}}h3,p{{margin:.5em 0}}header{{max-width:850px;margin-bottom:32px}}a{{color:var(--link);text-decoration:underline;text-underline-offset:3px}}
.themes{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}}.theme{{background:var(--background);color:var(--foreground);border:1px solid var(--border);border-radius:20px;overflow:hidden;min-width:0}}.app-heading{{display:flex;align-items:center;gap:8px;padding:20px;border-bottom:1px solid var(--border);overflow-wrap:anywhere}}.mark{{color:var(--primary);font-size:28px;line-height:1}}.mode{{margin-left:auto;color:var(--muted-foreground);font-size:14px;white-space:nowrap;flex-shrink:0}}
.product{{display:flex}}aside{{display:flex;flex-direction:column;gap:12px;min-width:120px;padding:20px 12px;background:var(--sidebar);color:var(--sidebar-foreground);font-size:14px;border-right:1px solid var(--sidebar-border)}}.nav{{background:var(--sidebar-accent);color:var(--sidebar-accent-foreground);padding:8px;border-radius:6px}}.workspace{{padding:24px;min-width:0;flex:1}}.eyebrow{{font-size:14px;font-weight:700;letter-spacing:.08em}}.subtle{{color:var(--muted-foreground)}}.actions{{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0}}button{{background:var(--primary);color:var(--primary-foreground);border:0;border-radius:8px;padding:10px 14px;font:600 14px system-ui;cursor:pointer}}button:hover{{background:var(--primary-hover)}}button:active{{background:var(--primary-active)}}button.secondary{{background:var(--secondary);color:var(--secondary-foreground)}}button.selected{{background:var(--accent);color:var(--accent-foreground)}}button:disabled{{cursor:default;border:1px dashed var(--border)}}:is(button,input,a):focus-visible{{outline:3px solid var(--focus);outline-offset:3px}}label{{display:block;font-size:14px;font-weight:600}}input{{display:block;margin-top:6px;width:100%;padding:12px;border:1px solid var(--input);border-radius:8px;background:var(--background);color:var(--foreground);font:inherit}}input::placeholder{{color:var(--muted-foreground)}}.statuses{{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}}.status{{padding:4px 8px;border-radius:6px;font-size:14px;font-weight:700}}.success{{background:var(--success);color:var(--success-foreground)}}.warning{{background:var(--warning);color:var(--warning-foreground)}}.info{{background:var(--info);color:var(--info-foreground)}}.destructive{{background:var(--destructive);color:var(--destructive-foreground)}}.card{{padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--card);color:var(--card-foreground)}}.card-heading{{display:flex;align-items:center;flex-wrap:wrap;gap:8px;justify-content:space-between}}.card-heading h3{{font-size:14px}}.card-heading a{{font-size:14px}}.chart{{display:flex;height:160px;gap:8px;margin-top:20px}}.chart>div{{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;gap:6px;min-width:0}}.chart i{{display:block;min-height:12px;border-radius:5px 5px 0 0}}.chart span{{font-size:14px;text-align:center}}.message{{padding:14px 0;font-size:14px}}.brand-panels{{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--border)}}.brand-panels>div{{padding:22px;min-width:0;overflow-wrap:anywhere}}.brand-logo{{display:flex;align-items:center;flex-wrap:wrap;gap:8px;background:var(--muted);color:var(--muted-foreground)}}.brand-panels small{{display:block;font-size:14px;width:100%;margin-top:10px}}.favicon-panel{{background:var(--secondary);color:var(--secondary-foreground)}}.favicon{{display:block;width:32px;height:32px;text-align:center;border-radius:8px;background:var(--primary);color:var(--primary-foreground);font-size:24px;line-height:32px}}.og-panel{{grid-column:1/-1;background:var(--primary);color:var(--primary-foreground);aspect-ratio:1200/630;display:flex;flex-direction:column;justify-content:space-between}}.og-panel>span{{font-size:14px;font-weight:600}}.og-content{{display:flex;align-items:center;gap:16px}}.brand-art{{width:45%;height:auto;flex-shrink:0}}.og-panel strong{{font-size:clamp(18px,2.4vw,34px);line-height:1.12;letter-spacing:-.035em}}
.wheel-container{{display:flex;align-items:center;gap:32px;flex-wrap:wrap}}.hue-wheel{{width:min(100%,420px);height:auto;overflow:visible;flex-shrink:0}}.hue-wheel text{{fill:var(--foreground);font:14px system-ui,sans-serif}}.wheel-caption{{max-width:460px}}#palette{{margin-top:48px}}.family{{margin:24px 0}}.family p{{color:var(--muted-foreground)}}.swatches{{list-style:none;display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:8px;padding:0}}.swatches li{{min-width:0}}.chip{{display:block;height:84px;border-radius:8px;border:1px solid var(--border)}}.swatches strong,.swatches code{{display:block;font-size:14px;overflow-wrap:anywhere}}.derived{{margin-top:5px;color:var(--muted-foreground)}}.table-wrap{{overflow-x:auto}}table{{border-collapse:collapse;font-size:14px;width:100%}}th,td{{padding:8px;text-align:left;border-bottom:1px solid var(--border)}}.notes{{max-width:950px;margin-top:32px;font-size:14px}}::selection{{background:var(--selection);color:var(--selection-foreground)}}
@media(max-width:1000px){{.themes{{grid-template-columns:1fr}}.og-panel strong{{font-size:clamp(24px,5vw,40px)}}.swatches{{grid-template-columns:repeat(6,minmax(0,1fr))}}}}@media(max-width:480px){{aside{{display:none}}.workspace{{padding:18px}}.app-heading{{padding:16px}}.swatches{{grid-template-columns:repeat(4,minmax(0,1fr))}}.brand-panels>div{{padding:18px}}}}
</style></head><body><main><header><p>PRODUCT COLOR SYSTEM</p><h1>{title}</h1><p>Light and dark UI contexts, family ramps, and tested opaque color pairs. Interactive controls show hover, active, and keyboard focus states.</p></header>
<div class="themes">{''.join(theme_panels)}</div><section id="palette"><h2>Hue coverage</h2><div class="wheel-container">{wheel}<p class="wheel-caption">Positions show the authored hues of chromatic families; marker fills use the mapped 500 shades. Neutrals are excluded. Hue distribution describes coverage and does not establish harmony, accessibility, or series distinguishability.</p></div><h2>Color families</h2><p>Canonical OKLCH coordinates (L, C, h) appear first. Hex values are derived sRGB exports; hover coordinates for the full CSS expression.</p>{''.join(swatches)}</section>
<section><h2>Contrast measurements</h2><p>Unrounded values determine passes. Displayed ratios are rounded for reading.</p><div class="table-wrap"><table><thead><tr><th>Theme</th><th>Foreground / background</th><th>Measured</th><th>Minimum</th></tr></thead><tbody>{results}</tbody></table></div></section>
<section class="notes"><h2>Review notes</h2><ul>{warnings}</ul><p>{escape(MAPPING_POLICY)}. Hue gaps describe coverage only. Text contrast does not prove color-vision differentiation, focus geometry, image overlays, or accessibility of a finished product. Logo, favicon and social card panels illustrate palette application; they are not production artwork.</p></section></main></body></html>'''


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("spec", type=Path, help="authored JSON palette specification")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="audit only; create no files")
    mode.add_argument("--out", type=Path, help="export only after a successful audit")
    args = parser.parse_args(argv)
    try:
        # JSON's optional NaN/Infinity extension is refused at the input boundary.
        spec = json.loads(args.spec.read_text(encoding="utf-8"), parse_constant=lambda value: (_ for _ in ()).throw(ValueError("non-finite JSON number: " + value)))
    except (OSError, UnicodeError, ValueError) as error:
        print("ERROR: " + str(error), file=sys.stderr)
        return 1
    report = audit(spec)
    for error in report["errors"]:
        print("ERROR: " + error, file=sys.stderr)
    for warning in report["warnings"]:
        print("WARNING: " + warning, file=sys.stderr)
    if report["errors"]:
        print(f"Audit failed: {len(report['errors'])} errors. No files written.", file=sys.stderr)
        return 1
    if args.out:
        try:
            # Render all artifacts before touching the export directory.
            artifacts = {"palette.json": json.dumps(report, indent=2, ensure_ascii=False, allow_nan=False) + "\n",
                         "tokens.css": render_css(report), "preview.html": render_preview(report, spec)}
            args.out.mkdir(parents=True, exist_ok=True)
            for name, contents in artifacts.items():
                (args.out / name).write_text(contents, encoding="utf-8")
        except OSError as error:
            print("ERROR writing exports: " + str(error), file=sys.stderr)
            return 1
        print("Exported palette.json, tokens.css and preview.html to " + str(args.out))
    print(f"Audit passed: {len(report['ramps'])} families; {len(report['contrast'])} contrast pairs. Review warnings and product contexts.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
