#!/usr/bin/env python3
"""Idempotently sync catalog.json to Stripe Products & Prices. Stdlib-only.

Join keys (stable across runs, no local state file needed):
  - Stripe Product  <-> catalog SKU   via product metadata['sku']
  - Stripe Price    <-> catalog SKU   via price lookup_key == SKU (lowercased)

Price changes: Stripe Prices are IMMUTABLE. This script never edits an amount;
it creates a new Price with transfer_lookup_key=true (which atomically moves the
lookup_key from the old price) and then archives the old price. Your website
should always resolve prices by lookup_key, never by hard-coded price IDs.

Usage:
    export STRIPE_API_KEY=sk_test_...        # use a TEST key first, always
    python3 sync_stripe.py catalog.json                 # dry run (default)
    python3 sync_stripe.py catalog.json --apply         # actually write
    python3 sync_stripe.py catalog.json --apply --archive-missing
        # also archives Stripe products whose SKU is active=false / gone locally

Requires: STRIPE_API_KEY env var. No pip installs.
"""
import argparse
import hashlib
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.stripe.com/v1"


def stripe_call(method: str, path: str, params: dict | None = None, api_key: str = ""):
    """Form-encoded Stripe API call. Returns parsed JSON; raises on HTTP errors.
    Mutating POSTs carry a deterministic Idempotency-Key derived from the params,
    so a crashed run can be re-run safely within Stripe's 24h idempotency window."""
    url = f"{API}{path}"
    data = None
    idem = None
    if params is not None and method in ("POST", "DELETE"):
        encoded = urllib.parse.urlencode(params, doseq=True)
        data = encoded.encode()
        idem = hashlib.sha256(f"{path}|{encoded}".encode()).hexdigest()[:48]
    elif params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Stripe-Version", "2025-06-30.basil")
    if idem:
        req.add_header("Idempotency-Key", idem)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise SystemExit(f"Stripe API {e.code} on {method} {path}:\n{body}") from e


def sellable_units(product: dict) -> list[dict]:
    """A catalog product with variants sells the variants; otherwise itself."""
    variants = product.get("variants") or []
    if not variants:
        return [{
            "sku": product["sku"],
            "name": product["name"],
            "price_cents": product["price_cents"],
            "description": product.get("description", ""),
            "images": product.get("images", []),
        }]
    units = []
    for v in variants:
        label = ", ".join(f"{k}: {val}" for k, val in (v.get("options") or {}).items())
        units.append({
            "sku": v["sku"],
            "name": f"{product['name']} ({label})" if label else product["name"],
            "price_cents": v.get("price_cents", product["price_cents"]),
            "description": product.get("description", ""),
            "images": v.get("images") or product.get("images", []),
        })
    return units


def absolutize(images: list[str], base_url: str) -> list[str]:
    out = []
    for img in images[:8]:  # Stripe caps product images at 8
        if img.startswith(("http://", "https://")):
            out.append(img)
        elif base_url:
            out.append(base_url.rstrip("/") + "/" + img.lstrip("/"))
    return out


def find_product_by_sku(sku: str, api_key: str) -> dict | None:
    res = stripe_call("GET", "/products/search",
                      {"query": f"metadata['sku']:'{sku}'", "limit": 2}, api_key)
    hits = res.get("data", [])
    if len(hits) > 1:
        print(f"  WARN: multiple Stripe products carry sku={sku}; using {hits[0]['id']}. Clean up duplicates in the dashboard.")
    return hits[0] if hits else None


def find_price_by_lookup(lookup_key: str, api_key: str) -> dict | None:
    res = stripe_call("GET", "/prices", {"lookup_keys[]": lookup_key, "limit": 1}, api_key)
    hits = res.get("data", [])
    return hits[0] if hits else None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("catalog")
    ap.add_argument("--apply", action="store_true", help="Write changes (default is dry run)")
    ap.add_argument("--archive-missing", action="store_true",
                    help="Archive Stripe products whose SKUs are inactive/absent locally")
    args = ap.parse_args()

    api_key = os.environ.get("STRIPE_API_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        print("ERROR: set STRIPE_API_KEY (start with a sk_test_ key).")
        return 2
    mode_live = api_key.startswith("sk_live_")
    print(f"Mode: {'LIVE' if mode_live else 'test'} | {'APPLY' if args.apply else 'DRY RUN (pass --apply to write)'}")
    if mode_live and not args.apply:
        print("Note: live key + dry run. Review output carefully before --apply.")

    data = json.loads(Path(args.catalog).read_text())
    currency = data["store"]["currency"]
    base_url = data["store"].get("url", "")

    created = updated = repriced = unchanged = 0
    local_skus: set[str] = set()

    for product in data["products"]:
        stripe_cfg = (product.get("channels") or {}).get("stripe") or {}
        if stripe_cfg.get("enabled") is False:
            continue
        for unit in sellable_units(product):
            sku = unit["sku"]
            if product.get("active", True):
                local_skus.add(sku)
            else:
                continue
            images = absolutize(unit["images"], base_url)
            remote = find_product_by_sku(sku, api_key)

            if remote is None:
                print(f"CREATE product+price  {sku}  '{unit['name']}'  {unit['price_cents']} {currency}")
                created += 1
                if args.apply:
                    params = {
                        "name": unit["name"],
                        "description": unit["description"][:5000] or unit["name"],
                        "metadata[sku]": sku,
                        "default_price_data[currency]": currency,
                        "default_price_data[unit_amount]": unit["price_cents"],
                    }
                    for i, img in enumerate(images):
                        params[f"images[{i}]"] = img
                    prod = stripe_call("POST", "/products", params, api_key)
                    # Give the default price its stable lookup_key
                    stripe_call("POST", f"/prices/{prod['default_price']}",
                                {"lookup_key": sku.lower(), "transfer_lookup_key": "true"}, api_key)
                continue

            # Product exists: diff name/description/images
            field_updates = {}
            if remote.get("name") != unit["name"]:
                field_updates["name"] = unit["name"]
            if (remote.get("description") or "") != unit["description"][:5000]:
                field_updates["description"] = unit["description"][:5000]
            if images and remote.get("images") != images:
                for i, img in enumerate(images):
                    field_updates[f"images[{i}]"] = img
            if not remote.get("active"):
                field_updates["active"] = "true"
            if field_updates:
                print(f"UPDATE product        {sku}  fields: {sorted(k.split('[')[0] for k in field_updates)}")
                updated += 1
                if args.apply:
                    stripe_call("POST", f"/products/{remote['id']}", field_updates, api_key)

            # Price: resolve by lookup_key, archive-and-create on change
            price = find_price_by_lookup(sku.lower(), api_key)
            if price and price["unit_amount"] == unit["price_cents"] and price["currency"] == currency:
                if not field_updates:
                    unchanged += 1
            else:
                old = f"{price['unit_amount']} {price['currency']}" if price else "none"
                print(f"REPRICE               {sku}  {old} -> {unit['price_cents']} {currency}  (new price, old archived)")
                repriced += 1
                if args.apply:
                    new_price = stripe_call("POST", "/prices", {
                        "product": remote["id"],
                        "currency": currency,
                        "unit_amount": unit["price_cents"],
                        "lookup_key": sku.lower(),
                        "transfer_lookup_key": "true",
                    }, api_key)
                    stripe_call("POST", f"/products/{remote['id']}",
                                {"default_price": new_price["id"]}, api_key)
                    if price:
                        stripe_call("POST", f"/prices/{price['id']}", {"active": "false"}, api_key)

    if args.archive_missing:
        print("\nScanning Stripe for products to archive...")
        params = {"active": "true", "limit": 100}
        while True:
            page = stripe_call("GET", "/products", params, api_key)
            for prod in page.get("data", []):
                rsku = (prod.get("metadata") or {}).get("sku")
                if rsku and rsku not in local_skus:
                    print(f"ARCHIVE               {rsku}  ({prod['id']})")
                    if args.apply:
                        stripe_call("POST", f"/products/{prod['id']}", {"active": "false"}, api_key)
            if not page.get("has_more"):
                break
            params["starting_after"] = page["data"][-1]["id"]

    print(f"\nSummary: {created} created, {updated} updated, {repriced} repriced, {unchanged} unchanged"
          + ("" if args.apply else "  [dry run — nothing written]"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
