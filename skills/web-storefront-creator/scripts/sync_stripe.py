#!/usr/bin/env python3
"""Idempotently sync catalog.json to Stripe Products & Prices. Stdlib-only.

Join keys (stable across runs, no local state file needed):
  - Stripe Product  <-> catalog SKU   via product metadata['sku']
  - Stripe Price    <-> catalog SKU   via price lookup_key == SKU (lowercased)

Price changes: Stripe Prices are IMMUTABLE. This script never edits an amount;
it creates a new Price with transfer_lookup_key=true (which atomically moves the
lookup_key from the old price), repairs the default pointer, and then archives
superseded prices identified by the sync. Stripe metadata preserves the previous
Price ID for recovery and distinguishes successive state changes.

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
REVISION = "windags_catalog_revision"
PREVIOUS_PRICE = "windags_previous_price"


def transition_key(path: str, params: dict, previous: object) -> str:
    """Name a single transition from its predecessor and intended values."""
    payload = json.dumps(["windags_catalog_sync", path, params, previous], sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()[:48]


def stripe_call(method: str, path: str, params: dict | None = None, api_key: str = "",
                *, idempotency_key: str | None = None):
    """Send a form-encoded request with an explicit transition key for every POST."""
    url = f"{API}{path}"
    data = None
    if method == "POST":
        if not idempotency_key:
            raise ValueError(f"POST {path} requires a transition key")
        data = urllib.parse.urlencode(params or {}, doseq=True).encode()
    elif params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Stripe-Version", "2025-06-30.basil")
    if idempotency_key:
        req.add_header("Idempotency-Key", idempotency_key)
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
    # Search can lag writes. Retrieve the matched Product before planning a transition.
    return stripe_call("GET", f"/products/{hits[0]['id']}", api_key=api_key) if hits else None


def find_price_by_lookup(lookup_key: str, api_key: str) -> dict | None:
    res = stripe_call("GET", "/prices", {"lookup_keys[]": lookup_key, "limit": 1}, api_key)
    hits = res.get("data", [])
    return hits[0] if hits else None


def resource_id(reference) -> str | None:
    """Normalize either an expandable Stripe object or its ID."""
    return reference.get("id") if isinstance(reference, dict) else reference


def update_resource(collection: str, remote: dict, changes: dict, api_key: str) -> dict:
    """Keep a generation marker on mutable resources so a later cycle uses a fresh key."""
    path = f"/{collection}/{remote['id']}"
    previous = {
        field: remote.get(field)
        for field in ("updated", "active", "name", "description", "images", "default_price", "lookup_key")
    }
    previous["revision"] = (remote.get("metadata") or {}).get(REVISION)
    key = transition_key(path, changes, previous)
    params = {**changes, f"metadata[{REVISION}]": key}
    return stripe_call("POST", path, params, api_key, idempotency_key=key)


def superseded_prices(current: dict, default_id: str | None, product_id: str, api_key: str) -> list[dict]:
    """Follow recorded predecessors and recover an old default still pointing at the prior price."""
    pending = [default_id, (current.get("metadata") or {}).get(PREVIOUS_PRICE)]
    seen = {current["id"]}
    stale = []
    while pending:
        price_id = pending.pop()
        if not price_id or price_id in seen:
            continue
        seen.add(price_id)
        prior = stripe_call("GET", f"/prices/{price_id}", api_key=api_key)
        # Skip other products and prices still named by a different lookup key.
        if not prior["active"] or resource_id(prior.get("product")) != product_id or prior.get("lookup_key"):
            continue
        stale.append(prior)
        pending.append((prior.get("metadata") or {}).get(PREVIOUS_PRICE))
    # Archive the oldest predecessor first so an inactive price marks a completed chain.
    return list(reversed(stale))


def matches_price(price: dict | None, amount: int, currency: str) -> bool:
    return bool(price and price["active"] and price["unit_amount"] == amount and price["currency"] == currency)


def reconcile_price(remote: dict, sku: str, amount: int, currency: str, api_key: str, apply: bool) -> str:
    """Converge the lookup, default pointer, and known predecessor prices."""
    lookup = sku.lower()
    product_id = remote["id"]
    default_id = resource_id(remote.get("default_price"))
    price = find_price_by_lookup(lookup, api_key)
    if price and resource_id(price.get("product")) != product_id:
        raise SystemExit(f"Stripe lookup {lookup!r} belongs to another product")

    attach_lookup = False
    if not price and default_id:
        default = stripe_call("GET", f"/prices/{default_id}", api_key=api_key)
        if (matches_price(default, amount, currency)
                and resource_id(default.get("product")) == product_id and not default.get("lookup_key")):
            # A prior run can stop just after creating a Product and its default Price.
            price = default
            attach_lookup = True

    if matches_price(price, amount, currency):
        stale = superseded_prices(price, default_id, product_id, api_key)
        if not attach_lookup and price["id"] == default_id and not stale:
            return "unchanged"
        print(f"RECONCILE price       {sku}  (lookup/default and {len(stale)} superseded)")
        result = "reconciled"
        if apply and attach_lookup:
            price = update_resource("prices", price, {"lookup_key": lookup}, api_key)
    else:
        old = f"{price['unit_amount']} {price['currency']}" if price else "none"
        print(f"REPRICE               {sku}  {old} -> {amount} {currency}  (new price, old archived)")
        if not apply:
            return "repriced"
        previous_id = price["id"] if price else default_id
        params = {
            "product": product_id, "currency": currency, "unit_amount": amount,
            "lookup_key": lookup, "transfer_lookup_key": "true",
        }
        if previous_id:
            params[f"metadata[{PREVIOUS_PRICE}]"] = previous_id
        price = stripe_call("POST", "/prices", params, api_key,
                            idempotency_key=transition_key("/prices", params, previous_id))
        stale = superseded_prices(price, default_id, product_id, api_key)
        result = "repriced"

    if apply:
        if price["id"] != default_id:
            update_resource("products", remote, {"default_price": price["id"]}, api_key)
        for prior in stale:
            update_resource("prices", prior, {"active": "false"}, api_key)
    return result


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

    created = updated = repriced = reconciled = unchanged = 0
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
                    prod = stripe_call("POST", "/products", params, api_key,
                                       idempotency_key=transition_key("/products", {}, sku))
                    reconcile_price(prod, sku, unit["price_cents"], currency, api_key, apply=True)
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
                    remote = update_resource("products", remote, field_updates, api_key)

            result = reconcile_price(remote, sku, unit["price_cents"], currency, api_key, args.apply)
            if result == "repriced":
                repriced += 1
            elif result == "reconciled":
                reconciled += 1
            elif not field_updates:
                unchanged += 1

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
                        update_resource("products", prod, {"active": "false"}, api_key)
            if not page.get("has_more"):
                break
            params["starting_after"] = page["data"][-1]["id"]

    print(f"\nSummary: {created} created, {updated} updated, {repriced} repriced, "
          f"{reconciled} reconciled, {unchanged} unchanged"
          + ("" if args.apply else "  [dry run — nothing written]"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
