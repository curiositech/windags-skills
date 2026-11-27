#!/usr/bin/env python3
"""Generate a Google Shopping-format product feed (XML) from catalog.json.

One feed, two channels: Google Merchant Center free listings AND Meta
(Facebook/Instagram) Shops catalogs both accept this format — Meta modeled its
spec on Google's. Host the output at a stable URL (e.g. /feed.xml on your site)
and point both dashboards at it on a scheduled fetch.

Stdlib-only. Variants are emitted as separate items sharing an item_group_id.
Products without a GTIN get identifier_exists=false (required, or Google
disapproves the item). Digital goods are skipped by default (Google Shopping
free listings are for physical goods; pass --include-digital to override).

Usage:
    python3 build_feed.py catalog.json --out public/feed.xml
"""
import argparse
import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape


def money(cents: int, currency: str) -> str:
    return f"{cents / 100:.2f} {currency.upper()}"


def item_xml(unit: dict, store: dict, group_id: str | None) -> str:
    base = store["url"].rstrip("/")
    link = f"{base}/shop/{unit['slug']}"
    image = unit["images"][0] if unit.get("images") else ""
    if image and not image.startswith(("http://", "https://")):
        image = f"{base}/{image.lstrip('/')}"
    inv = unit.get("inventory") or {}
    in_stock = (not inv.get("track")) or (inv.get("quantity") or 0) > 0
    lines = [
        f"  <item>",
        f"    <g:id>{escape(unit['sku'])}</g:id>",
        f"    <g:title>{escape(unit['name'][:150])}</g:title>",
        f"    <g:description>{escape(unit['description'][:5000])}</g:description>",
        f"    <g:link>{escape(link)}</g:link>",
        f"    <g:image_link>{escape(image)}</g:image_link>",
        f"    <g:availability>{'in_stock' if in_stock else 'out_of_stock'}</g:availability>",
        f"    <g:condition>new</g:condition>",
        f"    <g:brand>{escape(store.get('brand') or store['name'])}</g:brand>",
    ]
    price = money(unit["price_cents"], store["currency"])
    if unit.get("compare_at_cents"):
        lines.append(f"    <g:price>{money(unit['compare_at_cents'], store['currency'])}</g:price>")
        lines.append(f"    <g:sale_price>{price}</g:sale_price>")
    else:
        lines.append(f"    <g:price>{price}</g:price>")
    if unit.get("gtin"):
        lines.append(f"    <g:gtin>{escape(unit['gtin'])}</g:gtin>")
    else:
        lines.append(f"    <g:identifier_exists>false</g:identifier_exists>")
    if unit.get("weight_grams"):
        lines.append(f"    <g:shipping_weight>{unit['weight_grams']} g</g:shipping_weight>")
    if group_id:
        lines.append(f"    <g:item_group_id>{escape(group_id)}</g:item_group_id>")
        for key, val in (unit.get("options") or {}).items():
            attr = key.lower()
            if attr in ("color", "size", "material", "pattern"):
                lines.append(f"    <g:{attr}>{escape(val)}</g:{attr}>")
    lines.append("  </item>")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("catalog")
    ap.add_argument("--out", default="feed.xml")
    ap.add_argument("--include-digital", action="store_true")
    args = ap.parse_args()

    data = json.loads(Path(args.catalog).read_text())
    store = data["store"]
    items, skipped = [], 0

    for p in data["products"]:
        if not p.get("active", True) or not (p.get("channels") or {}).get("google_feed", True):
            continue
        if p.get("kind") == "digital" and not args.include_digital:
            skipped += 1
            continue
        variants = p.get("variants") or []
        if not variants:
            items.append(item_xml(p, store, None))
            continue
        for v in variants:
            unit = {
                **p,
                "sku": v["sku"],
                "price_cents": v.get("price_cents", p["price_cents"]),
                "images": v.get("images") or p.get("images"),
                "inventory": v.get("inventory") or p.get("inventory"),
                "options": v.get("options"),
                "name": p["name"] + " — " + ", ".join((v.get("options") or {}).values()),
            }
            items.append(item_xml(unit, store, p["sku"]))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n'
        f"  <title>{escape(store['name'])}</title>\n"
        f"  <link>{escape(store['url'])}</link>\n"
        f"  <description>Product feed for {escape(store['name'])}</description>\n"
        + "\n".join(items)
        + "\n</channel>\n</rss>\n"
    )
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(xml)
    print(f"Wrote {args.out}: {len(items)} items" + (f", {skipped} digital skipped" if skipped else ""))
    print("Submit the hosted URL to: Google Merchant Center (Data sources) and Meta Commerce Manager (Catalog > Data sources).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
