#!/usr/bin/env python3
"""Validate a storefront catalog.json before syncing anywhere.

Stdlib-only. Checks structure, SKU/slug uniqueness and format, integer-cent
prices, variant consistency, and (optionally) that referenced image files exist.

Usage:
    python3 validate_catalog.py catalog.json
    python3 validate_catalog.py catalog.json --images-root ./public
    python3 validate_catalog.py catalog.json --strict   # warnings become errors

Exit codes: 0 = valid, 1 = errors found, 2 = could not read/parse file.
"""
import argparse
import json
import re
import sys
from pathlib import Path

SKU_RE = re.compile(r"^[A-Z0-9]+(-[A-Z0-9]+)*$")
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
CURRENCY_RE = re.compile(r"^[a-z]{3}$")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("catalog", help="Path to catalog.json")
    ap.add_argument("--images-root", help="Directory to resolve relative image paths against")
    ap.add_argument("--strict", action="store_true", help="Treat warnings as errors")
    args = ap.parse_args()

    try:
        data = json.loads(Path(args.catalog).read_text())
    except (OSError, json.JSONDecodeError) as e:
        print(f"ERROR: cannot read/parse {args.catalog}: {e}")
        return 2

    errors: list[str] = []
    warnings: list[str] = []

    store = data.get("store")
    if not isinstance(store, dict):
        errors.append("missing 'store' object")
    else:
        for key in ("name", "currency", "url"):
            if not store.get(key):
                errors.append(f"store.{key} is required")
        cur = store.get("currency", "")
        if cur and not CURRENCY_RE.match(cur):
            errors.append(f"store.currency must be lowercase ISO 4217 (got {cur!r})")

    products = data.get("products")
    if not isinstance(products, list) or not products:
        errors.append("'products' must be a non-empty array")
        products = []

    seen_skus: dict[str, str] = {}
    seen_slugs: dict[str, str] = {}

    def check_sku(sku, where):
        if not isinstance(sku, str) or not SKU_RE.match(sku):
            errors.append(f"{where}: SKU {sku!r} must match CATEGORY-PRODUCT[-VARIANT] uppercase pattern")
            return
        if sku in seen_skus:
            errors.append(f"{where}: SKU {sku!r} duplicates {seen_skus[sku]}")
        seen_skus[sku] = where

    def check_price(value, where, field="price_cents", required=True):
        if value is None:
            if required:
                errors.append(f"{where}: {field} is required")
            return
        if not isinstance(value, int) or isinstance(value, bool) or value < 1:
            errors.append(f"{where}: {field} must be a positive integer of cents (got {value!r}) — never floats")
        elif value < 50:
            warnings.append(f"{where}: {field}={value} is under $0.50 — Stripe's minimum charge is $0.50 USD. Typo?")

    for i, p in enumerate(products):
        where = f"products[{i}] ({p.get('sku', '?')})"
        if not isinstance(p, dict):
            errors.append(f"products[{i}]: not an object")
            continue
        check_sku(p.get("sku"), where)
        if not p.get("name"):
            errors.append(f"{where}: name is required")
        slug = p.get("slug")
        if not isinstance(slug, str) or not SLUG_RE.match(slug or ""):
            errors.append(f"{where}: slug {slug!r} must be lowercase-hyphenated")
        elif slug in seen_slugs:
            errors.append(f"{where}: slug {slug!r} duplicates {seen_slugs[slug]}")
        else:
            seen_slugs[slug] = where
        if not p.get("description"):
            errors.append(f"{where}: description is required")
        elif len(p["description"]) < 40:
            warnings.append(f"{where}: description under 40 chars — marketplaces reject thin descriptions")
        check_price(p.get("price_cents"), where)
        check_price(p.get("compare_at_cents"), where, "compare_at_cents", required=False)
        if p.get("compare_at_cents") and p.get("price_cents") and p["compare_at_cents"] <= p["price_cents"]:
            errors.append(f"{where}: compare_at_cents must exceed price_cents (it's the strike-through price)")

        kind = p.get("kind", "physical")
        if kind not in ("physical", "digital", "service"):
            errors.append(f"{where}: kind must be physical|digital|service")
        if kind == "physical" and not p.get("weight_grams"):
            warnings.append(f"{where}: physical product without weight_grams — needed for calculated shipping")
        if not p.get("images"):
            warnings.append(f"{where}: no images — product pages and every marketplace need at least one")

        inv = p.get("inventory") or {}
        if inv.get("track") and not isinstance(inv.get("quantity"), int):
            errors.append(f"{where}: inventory.track=true requires integer inventory.quantity")

        variants = p.get("variants") or []
        parent_sku = p.get("sku") or ""
        for j, v in enumerate(variants):
            vwhere = f"{where}.variants[{j}]"
            check_sku(v.get("sku"), vwhere)
            if isinstance(v.get("sku"), str) and parent_sku and not v["sku"].startswith(parent_sku):
                warnings.append(f"{vwhere}: variant SKU {v['sku']!r} doesn't extend parent {parent_sku!r} — allowed, but breaks at-a-glance grouping")
            if not v.get("options"):
                errors.append(f"{vwhere}: options object is required (e.g. {{\"size\": \"8oz\"}})")
            check_price(v.get("price_cents"), vwhere, required=False)

        if args.images_root:
            root = Path(args.images_root)
            for img in p.get("images", []) + [i for v in variants for i in (v.get("images") or [])]:
                if img.startswith(("http://", "https://")):
                    continue
                if not (root / img).is_file():
                    errors.append(f"{where}: image not found: {root / img}")

    if args.strict:
        errors.extend(warnings)
        warnings = []

    for w in warnings:
        print(f"WARN:  {w}")
    for e in errors:
        print(f"ERROR: {e}")
    active = sum(1 for p in products if isinstance(p, dict) and p.get("active", True))
    print(f"\n{len(products)} products ({active} active), {len(seen_skus)} SKUs, "
          f"{len(errors)} errors, {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
