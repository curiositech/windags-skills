#!/usr/bin/env python3
"""audit_glass_spec.py - rule-based audit of a Liquid Glass screen spec.

Reads a JSON spec (schema: schemas/glass-spec.schema.json; example:
templates/glass-spec.sample.json) describing every surface on a screen and reports
violations of the skill's rules. Rule IDs match references/failure-modes.md.

Usage:
  audit_glass_spec.py SPEC.json [--json] [--strict]
  audit_glass_spec.py --self-test

--strict treats warnings as failures. Exit: 0 clean, 1 findings at failing severity,
2 invalid input. Stdlib only; uses `jsonschema` for full schema validation if installed.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import defaultdict

GLASS = {"regular", "clear"}
HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA = os.path.join(HERE, "..", "schemas", "glass-spec.schema.json")


def finding(rule, severity, element, message, fix):
    return {"rule": rule, "severity": severity, "element": element, "message": message, "fix": fix}


def validate(spec: dict) -> list[str]:
    errs = []
    try:
        import jsonschema  # type: ignore
        with open(SCHEMA) as fh:
            schema = json.load(fh)
        for e in jsonschema.Draft202012Validator(schema).iter_errors(spec):
            errs.append(f"{'/'.join(map(str, e.path)) or '<root>'}: {e.message}")
        return errs
    except ImportError:
        pass
    for key in ("screen", "platform", "route", "elements"):
        if key not in spec:
            errs.append(f"missing required key '{key}'")
    ids = set()
    for i, el in enumerate(spec.get("elements", [])):
        for key in ("id", "layer", "material"):
            if key not in el:
                errs.append(f"elements/{i}: missing '{key}'")
        if el.get("id") in ids:
            errs.append(f"elements/{i}: duplicate id '{el.get('id')}'")
        ids.add(el.get("id"))
    return errs


def audit(spec: dict) -> list[dict]:
    out: list[dict] = []
    els = spec.get("elements", [])
    by_id = {e["id"]: e for e in els}
    route = spec.get("route")
    platform = spec.get("platform")
    acc = spec.get("accessibility", {})
    is_glass = lambda e: e.get("material") in GLASS  # noqa: E731

    def ancestors(e):
        seen = set()
        p = e.get("parent")
        while p and p in by_id and p not in seen:
            seen.add(p)
            yield by_id[p]
            p = by_id[p].get("parent")

    for e in els:
        eid = e["id"]
        # LG001 content layer
        if e.get("layer") == "content" and is_glass(e) and not e.get("transient"):
            out.append(finding("LG001", "error", eid, "Liquid Glass in the content layer.",
                               "Use a standard material or solid fill; glass is for floating controls."))
        # LG015 repeated
        if e.get("repeated") and is_glass(e):
            out.append(finding("LG015", "error", eid, "Glass applied per repeated item (rows/tiles/pins).",
                               "Style repeated items in the content layer; keep glass for singletons."))
        # LG002 glass on glass
        if is_glass(e):
            for anc in ancestors(e):
                if is_glass(anc):
                    out.append(finding("LG002", "error", eid, f"Glass on glass (ancestor '{anc['id']}' is glass).",
                                       "Use fills, transparency or vibrancy on top of glass; or make them siblings in one container."))
                    break
        # LG003 clear conditions
        if e.get("material") == "clear":
            if e.get("over") not in (None, "media", "canvas"):
                out.append(finding("LG003", "error", eid, f"Clear glass over '{e.get('over')}', not media.",
                                   "Use the regular variant."))
            if e.get("backdrop_bright", True) and e.get("dimming", 0) < 0.3:
                out.append(finding("LG003", "error", eid, "Clear glass over a bright (or unknown) backdrop without a ~35% dimming layer.",
                                   "Add a dark dimming layer (~0.35) or switch to regular."))
            if e.get("content_on_top") not in (None, "bold-bright", "none"):
                out.append(finding("LG003", "warning", eid, "Clear glass with content that is not bold and bright.",
                                   "Bold, bright symbols/labels on clear glass, or use regular."))
        # LG006 over-blur
        if is_glass(e) and e.get("blur_px", 0) > 12:
            out.append(finding("LG006", "warning", eid, f"Blur {e['blur_px']}px reads as the old frosted material.",
                               "Light blur (6-10px) plus edge refraction; legibility from luminosity, dimming, scroll edge effect."))
        # LG007 text
        t = e.get("text") or {}
        if t:
            need = 3.0 if t.get("large") else 4.5
            if "contrast_p5" in t and t["contrast_p5"] < need:
                out.append(finding("LG007", "error", eid, f"Text contrast p5 {t['contrast_p5']} < {need}.",
                                   "See references/legibility-contrast.md fixes (adaptive labels, regular, dimming, weight)."))
            size = t.get("size_px")
            if size is not None and size < 14:
                eyebrow = size >= 12 and t.get("weight", 400) >= 600 and t.get("uppercase_tracked")
                if not eyebrow:
                    out.append(finding("LG007", "error", eid, f"Text {size}px on glass is below the 14px floor.",
                                       "Raise to >= 14px (12px only for bold uppercase tracked eyebrows)."))
        # LG008 concentric
        if e.get("shape") in ("concentric", "rounded") and all(k in e for k in ("corner_radius", "parent_corner_radius", "inset")):
            expected = max(e["parent_corner_radius"] - e["inset"], 0)
            if abs(e["corner_radius"] - expected) > 2:
                kind = "flared" if e["corner_radius"] < expected else "pinched"
                out.append(finding("LG008", "warning", eid,
                                   f"Corner {e['corner_radius']} is {kind}; concentric radius is {expected} (parent {e['parent_corner_radius']} - inset {e['inset']}).",
                                   "Use ConcentricRectangle / .containerConcentric(minimum:) or computed tokens."))
        # LG010 custom backgrounds
        if e.get("system_component") and e.get("custom_background"):
            out.append(finding("LG010", "warning", eid, "Custom background on a system bar/sheet.",
                               "Remove it; let the system glass and scroll edge effect work."))
        # LG011 scroll edge effects
        n_see = e.get("scroll_edge_effects", 0)
        if n_see > 1:
            out.append(finding("LG011", "warning", eid, f"{n_see} scroll edge effects on one view.",
                               "One per view (per pane in split views)."))
        if n_see and e.get("floating_ui_over_scroll") is False:
            out.append(finding("LG011", "warning", eid, "Scroll edge effect with no floating UI over the scroll view.",
                               "Remove it; scroll edge effects are not decorative."))

    # Group-level rules
    groups = defaultdict(list)
    for e in els:
        if e.get("group"):
            groups[e["group"]].append(e)
    for g, members in groups.items():
        variants = {m["material"] for m in members if is_glass(m)}
        if len(variants) > 1:
            out.append(finding("LG004", "error", g, "Regular and clear glass mixed in one group.", "Pick one variant per group."))
        tinted = [m["id"] for m in members if m.get("tint")]
        if len(tinted) > 1:
            out.append(finding("LG005", "warning", g, f"{len(tinted)} tinted elements in one group: {tinted}.",
                               "Tint one primary action; colour lives in the content layer."))
        containers = {m.get("container") for m in members if is_glass(m)}
        if len(containers) > 1:
            out.append(finding("LG009", "warning", g, f"Glass neighbours split across containers {sorted(map(str, containers))}.",
                               "Use one GlassEffectContainer / UIGlassContainerEffect / NSGlassEffectContainerView."))
        kinds = {m.get("label_kind") for m in members if m.get("label_kind") in ("text", "symbol")}
        if len(kinds) > 1:
            out.append(finding("LG016", "warning", g, "Text and symbol items share one group.",
                               "Give text buttons their own container."))

    # Screen-level tint count and non-primary tint
    tinted_all = [e for e in els if e.get("tint")]
    if len(tinted_all) > 2:
        out.append(finding("LG005", "warning", spec.get("screen"), f"{len(tinted_all)} tinted elements on one screen.",
                           "Reserve tint for the primary action(s)."))
    for e in tinted_all:
        if e.get("role") not in (None, "primary-action", "status"):
            out.append(finding("LG005", "warning", e["id"], f"Tint on a '{e.get('role')}' element.",
                               "Tint only primary actions or meaningful status."))

    # Bars
    bars = defaultdict(set)
    for e in els:
        if e.get("bar") and e.get("group"):
            bars[e["bar"]].add(e["group"])
    for bar, gs in bars.items():
        if len(gs) > 3:
            out.append(finding("LG017", "warning", bar, f"{len(gs)} groups in one bar.", "Aim for at most three; use an overflow menu."))

    # Web performance
    glass_count = sum(1 for e in els if is_glass(e))
    if route in ("css", "library") and spec.get("backdrop_animated"):
        sev = "error" if glass_count > 6 or route == "library" else "warning"
        out.append(finding("LG012", sev, spec.get("screen"),
                           f"{route} glass ({glass_count} regions) over an animated backdrop"
                           f"{' at ' + str(spec['backdrop_hz']) + ' Hz' if spec.get('backdrop_hz') else ''}: compositor/capture is not frame-synchronised with the canvas.",
                           "Render glass inside the canvas pipeline (references/web-gpu-postprocess.md)."))
    if route == "library":
        contexts = glass_count + spec.get("app_webgl_contexts", 0)
        if contexts >= 12:
            out.append(finding("LG013", "error", spec.get("screen"), f"~{contexts} WebGL contexts (library uses one per glass element).",
                               "Fewer glass elements or the GPU route; browsers cap ~16 contexts."))

    # Accessibility
    custom = route in ("gpu", "library", "css") or any(is_glass(e) and not e.get("system_component") for e in els)
    if custom:
        for key, label in (("handles_reduce_transparency", "Reduce Transparency"),
                           ("handles_increase_contrast", "Increase Contrast"),
                           ("handles_reduce_motion", "Reduce Motion")):
            if not acc.get(key):
                sev = "error" if route in ("gpu", "library", "css") else "warning"
                out.append(finding("LG014", sev, spec.get("screen"), f"Custom glass does not handle {label}.",
                                   "Implement the fallback (references/accessibility-fallbacks.md)."))
        if platform == "web" and not acc.get("in_app_transparency_toggle"):
            out.append(finding("LG014", "warning", spec.get("screen"),
                               "No in-app transparency toggle; Safari cannot report Reduce Transparency to the page.",
                               "Add a persisted 'solid chrome' toggle."))
    return out


def self_test() -> int:
    sample = os.path.join(HERE, "..", "templates", "glass-spec.sample.json")
    with open(sample) as fh:
        spec = json.load(fh)
    assert not validate(spec), validate(spec)
    rules = {f["rule"] for f in audit(spec)}
    for expected in ("LG001", "LG002", "LG005", "LG006", "LG007", "LG008", "LG012", "LG014", "LG015"):
        assert expected in rules, (expected, rules)
    clean = {"screen": "ok", "platform": "ios", "route": "native", "elements": [
        {"id": "tabbar", "layer": "control", "material": "regular", "system_component": True},
        {"id": "done", "layer": "control", "material": "regular", "role": "primary-action", "tint": True,
         "system_component": True}]}
    assert audit(clean) == [], audit(clean)
    print("self-test: ok")
    return 0


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("spec", nargs="?")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--strict", action="store_true", help="warnings also fail")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args(argv)
    if a.self_test:
        return self_test()
    if not a.spec:
        ap.print_usage(sys.stderr)
        return 2
    with open(a.spec) as fh:
        spec = json.load(fh)
    errs = validate(spec)
    if errs:
        print("invalid spec:\n  " + "\n  ".join(errs), file=sys.stderr)
        return 2
    findings = audit(spec)
    failing = [f for f in findings if f["severity"] == "error" or (a.strict and f["severity"] == "warning")]
    if a.json:
        print(json.dumps({"screen": spec.get("screen"), "findings": findings, "pass": not failing}, indent=2))
    else:
        for f in sorted(findings, key=lambda f: (f["severity"] != "error", f["rule"])):
            print(f"[{f['severity'].upper():7}] {f['rule']} {f['element']}: {f['message']}\n           fix: {f['fix']}")
        n_err = sum(f["severity"] == "error" for f in findings)
        print(f"\n{n_err} errors, {len(findings) - n_err} warnings -> {'FAIL' if failing else 'PASS'}")
    return 1 if failing else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
