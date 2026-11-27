#!/usr/bin/env python3
"""Render catalog JSON into static, branded storefront review pages.

Requires Python 3.10+. CSS and JavaScript are embedded in the output. Copy
real product images to their referenced paths before sharing the preview.
The local demo bag takes no payments and sends no order or personal data.
"""
import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit


ASSETS = Path(__file__).resolve().parent.parent / "assets"
DEFAULT_COLORS = {
    "background": "#f4f0e7", "text": "#202920", "accent": "#294938",
    "muted": "#525b51", "rule": "#a8aa9e", "mat": "#e6ded1",
    "hero": "#213429", "on_hero": "#faf6e9", "on_accent": "#fff9ed",
    "on_dark": "#fff9ed", "scrim": "rgba(20,30,25,.5)",
}
CSS_NAMES = {
    "background": "paper", "text": "ink", "accent": "accent",
    "muted": "muted", "rule": "rule", "mat": "mat", "hero": "hero",
    "on_hero": "on-hero", "on_accent": "on-accent", "on_dark": "on-dark", "scrim": "scrim",
}
DEFAULT_FONTS = {"heading": "Georgia", "body": "system-ui"}
SLUG_PATTERN = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
CSS_LITERAL = re.compile(r"[A-Za-z0-9\-_#(),.% /]+")


def esc(value) -> str:
    """Escape text and attribute values from catalog input."""
    return html.escape(str(value))


def money(cents: int, currency: str) -> str:
    """Format catalog integer cents for the server-rendered preview."""
    symbol = {"usd": "$", "eur": "€", "gbp": "£", "cad": "CA$", "aud": "AU$"}.get(currency, currency.upper() + " ")
    units, fractional = divmod(abs(cents), 100)
    return f"{'-' if cents < 0 else ''}{symbol}{units:,}.{fractional:02d}"


def stylesheet(tokens: dict) -> str:
    """Map the source palette to the renderer's semantic CSS variables."""
    colors = tokens.get("colors") or {}
    fonts = tokens.get("fonts") or {}

    def literal(value, fallback):
        return value if isinstance(value, str) and value and CSS_LITERAL.fullmatch(value) else fallback

    declarations = [
        f"--{CSS_NAMES[key]}:{literal(colors.get(key), fallback)}"
        for key, fallback in DEFAULT_COLORS.items()
    ]
    declarations.extend(
        f"--{variable}:{literal(fonts.get(key), DEFAULT_FONTS[key])},{fallback}"
        for key, variable, fallback in (("heading", "display", "Georgia,serif"), ("body", "body", "sans-serif"))
    )
    declarations.append(f"--radius:{literal(tokens.get('radius'), '.25rem')}")
    dark = tokens.get("dark_colors") or {}
    dark_styles = [
        f"--{CSS_NAMES[key]}:{literal(value, DEFAULT_COLORS[key])}"
        for key, value in dark.items() if key in CSS_NAMES
    ]
    stylesheet_text = ":root{" + ";".join(declarations) + "}\n" + (ASSETS / "storefront.css").read_text()
    if dark_styles:
        stylesheet_text += "@media(prefers-color-scheme:dark){:root{color-scheme:dark;" + ";".join(dark_styles) + "}}"
    return stylesheet_text


def image_html(src: str, alt: str, *, hero: bool = False) -> str:
    """Render an optional image and exclude executable or unsupported URL schemes."""
    if not src or urlsplit(src).scheme not in {"", "http", "https"}:
        return ""
    loading = 'fetchpriority="high"' if hero else 'loading="lazy"'
    return f'<img src="{esc(src)}" alt="{esc(alt)}" width="768" height="512" {loading}>'


def item_limit(product: dict, variant: dict | None = None) -> int:
    """Return the maximum demo quantity, bounded by fixture stock and a sane cap."""
    inventory = (variant or {}).get("inventory") or product.get("inventory") or {}
    if inventory.get("track") and isinstance(inventory.get("quantity"), int):
        return min(99, max(0, inventory["quantity"]))
    return 99


def commerce_items(products: list[dict]) -> list[dict]:
    """Keep one cart key per purchasable SKU and preserve variant-specific prices."""
    items = []
    for product in products:
        variants = product.get("variants") or []
        for variant in variants or [None]:
            override = variant or {}
            suffix = " / ".join(str(value) for value in (override.get("options") or {}).values())
            items.append({
                "sku": override.get("sku", product["sku"]),
                "name": f'{product["name"]} · {suffix}' if suffix else product["name"],
                "cents": override.get("price_cents", product["price_cents"]),
                "limit": item_limit(product, variant),
            })
    return items


def page(title: str, content: str, skin: str, script: str, store: dict, items: list[dict], collection: str) -> str:
    """Compose a self-contained page with a native preview bag beside the catalog content."""
    packed = json.dumps(
        {"store": store["name"], "currency": store["currency"].upper(), "items": items}, ensure_ascii=True
    ).replace("<", "\\u003c")
    markup = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <style>{skin}</style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-bar">
    <a class="brand" href="index.html">{esc(store["name"])}</a>
    <nav aria-label="Store">
      <a href="{collection}">Collection</a>
      <button class="bag-trigger" type="button" aria-haspopup="dialog" hidden>Bag <span class="bag-count">0</span></button>
    </nav>
  </header>
  <main id="main" class="wrap">{content}</main>
  <footer class="site-footer wrap">
    <a class="brand" href="index.html">{esc(store["name"])}</a>
    <p>Storefront design preview. Checkout is not wired.</p>
  </footer>
  <dialog class="bag" aria-labelledby="bag-heading">
    <div class="bag-header">
      <h2 id="bag-heading">Your bag</h2>
      <form method="dialog"><button type="submit" class="secondary-button" autofocus>Close</button></form>
    </div>
    <p class="bag-empty">Your bag is empty.</p>
    <ul class="bag-items"></ul>
    <div class="bag-totals" hidden>
      <div class="bag-total"><span>Subtotal</span><span class="subtotal"></span></div>
      <p class="bag-note">This is a demo bag. No payment or order is processed.</p>
    </div>
    <p class="sr-only" role="status"></p>
  </dialog>
  <script type="application/json" id="demo-catalog">{packed}</script>
  <script>{script}</script>
</body>
</html>
"""
    return "\n".join(line.rstrip() for line in markup.splitlines()) + "\n"


def collection_hero(store: dict, tokens: dict) -> str:
    """Render optional editorial art or a clear store-heading fallback."""
    preview = tokens.get("preview") or {}
    art = image_html(preview.get("hero_image", ""), preview.get("hero_alt", ""), hero=True)
    intro = f'<p>{esc(preview["intro"])}</p>' if preview.get("intro") else ""
    headline = esc(preview.get("headline", store["name"]))
    hero_class = "hero" if art else "hero hero-simple"
    return f"""<section class="{hero_class}" aria-labelledby="hero-title">
    <div class="hero-copy"><h1 id="hero-title">{headline}</h1>{intro}<a href="#collection" class="hero-link">Browse the collection</a></div>
    {art}
  </section>"""


def product_card(product: dict, currency: str) -> str:
    """Show photo, price and the next useful action without invented scarcity."""
    name = esc(product["name"])
    target = f'product-{product["slug"]}.html'
    images = product.get("images") or []
    visual = image_html(images[0], "", hero=False) if images else ""
    category = esc(product.get("category") or "Other")
    variants = product.get("variants") or []
    prices = [variant.get("price_cents", product["price_cents"]) for variant in variants] or [product["price_cents"]]
    prefix = "From " if min(prices) != max(prices) else ""
    support = f"{prefix}{money(min(prices), currency)}"
    old_price = previous_price(product, min(prices), currency) if not variants else ""
    if variants:
        action = f'<a class="secondary-button quick-add" href="{target}">Choose options</a>'
    else:
        disabled = ' disabled' if item_limit(product) == 0 else ""
        label = "Unavailable" if disabled else "Add to bag"
        action = f'<button class="secondary-button quick-add" data-add="{esc(product["sku"])}" type="button"{disabled} hidden>{label}</button>'
    media = f'<a class="product-media" href="{target}" aria-hidden="true" tabindex="-1">{visual}</a>' if visual else ""
    return f"""<article class="product-card" data-category="{category}">
    {media}
    <p class="kind">{category}</p>
    <h3><a class="product-card-title" href="{target}">{name}</a></h3>
    <p class="money">{esc(support)}{old_price}</p>
    <div class="card-buy">{action}</div>
  </article>"""


def previous_price(product: dict, current: int, currency: str) -> str:
    """Show a compare-at amount only when a caller supplied a valid higher price."""
    previous = product.get("compare_at_cents")
    if not isinstance(previous, int) or previous <= current:
        return ""
    return f'<s class="previous-price" aria-label="Previous price {esc(money(previous, currency))}">{esc(money(previous, currency))}</s>'


def detail_page(product: dict, currency: str) -> str:
    """Expose exact variant choices, with stock-aware demo purchasing behavior."""
    name = esc(product["name"])
    images = product.get("images") or []
    visual = image_html(images[0], product.get("image_alt") or product["name"]) if images else ""
    variants = product.get("variants") or []
    first = next((variant for variant in variants if item_limit(product, variant) > 0), variants[0] if variants else None)
    starting_price = (first or {}).get("price_cents", product["price_cents"])
    old_price = previous_price(product, starting_price, currency) if not variants else ""
    available = item_limit(product, first)
    variant_picker = ""
    if variants:
        options = []
        for variant in variants:
            choice = " / ".join(str(value) for value in (variant.get("options") or {}).values()) or variant["sku"]
            label = f'{choice} · {money(variant.get("price_cents", product["price_cents"]), currency)}'
            if item_limit(product, variant) == 0:
                label += " · Unavailable"
            selected = " selected" if variant is first else ""
            options.append(f'<option value="{esc(variant["sku"])}"{selected}>{esc(label)}</option>')
        variant_picker = f'<label class="detail-select">Options<select name="sku">{"".join(options)}</select></label>'
    product_image = f'<figure class="product-media">{visual}</figure>' if visual else ""
    source = product.get("category") or ("Digital download" if product.get("kind") == "digital" else "Physical item")
    return f"""<article class="detail">
    <p class="breadcrumb"><a href="index.html#collection">Collection</a></p>
    <div class="detail-grid">
      {product_image}
      <form class="detail-copy">
        <p class="kind">{esc(source)}</p>
        <h1>{name}</h1>
        <p class="money"><span data-detail-price>{esc(money(starting_price, currency))}</span>{old_price}</p>
        <p class="description">{esc(product["description"])}</p>
        {variant_picker}
        <button class="primary-button" type="button" data-add="{esc(product['sku'])}"{'' if available else ' disabled'} hidden>{'Add to bag' if available else 'Unavailable'}</button>
      </form>
    </div>
  </article>"""


def render(catalog: dict, tokens: dict, out: Path) -> list[str]:
    """Write one collection and one detail page for every active web product."""
    products = [product for product in catalog["products"]
                if product.get("active", True) and (product.get("channels") or {}).get("web", True)]
    slugs = [product["slug"] for product in products]
    if any(not SLUG_PATTERN.fullmatch(slug) for slug in slugs) or len(set(slugs)) != len(slugs):
        raise ValueError("Expected unique lowercase, hyphenated product slugs")
    store = catalog["store"]
    currency = store["currency"]
    items = commerce_items(products)
    if len({item["sku"] for item in items}) != len(items):
        raise ValueError("Expected unique purchasable SKUs")

    categories = sorted({product.get("category") or "Other" for product in products})
    choices = ''.join(f'<button class="filter" type="button" data-filter="{esc(category)}" aria-pressed="false">{esc(category)}</button>' for category in categories)
    filters = f'<div class="filters" role="group" aria-label="Filter by category" hidden><button class="filter" type="button" data-filter="" aria-pressed="true">All items</button>{choices}</div>' if len(categories) > 1 else ""
    result_word = "item" if len(products) == 1 else "items"
    grid = f"""{collection_hero(store, tokens)}
    <section id="collection" class="collection" aria-labelledby="collection-title">
      <div class="collection-header"><h2 id="collection-title">The collection</h2>{filters}</div>
      <p class="results" aria-live="polite">{len(products)} {result_word}</p>
      <!-- Catalog cards -->
      <div class="catalog-grid">
      {''.join(product_card(product, currency) for product in products)}
      </div>
    </section>"""
    skin = stylesheet(tokens)
    script = (ASSETS / "storefront.js").read_text()
    (out / "index.html").write_text(page(f"Shop – {store['name']}", grid, skin, script, store, items, "#collection"), encoding="utf-8")
    written = ["index.html"]
    for product in products:
        filename = f"product-{product['slug']}.html"
        (out / filename).write_text(
            page(f"{product['name']} – {store['name']}", detail_page(product, currency), skin, script, store, items, "index.html#collection"),
            encoding="utf-8",
        )
        written.append(filename)
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("catalog")
    parser.add_argument("--style", help="style-tokens.json from extract_site_style.py or an authored palette")
    parser.add_argument("--out", default="preview")
    args = parser.parse_args()
    catalog = json.loads(Path(args.catalog).read_text(encoding="utf-8"))
    tokens = json.loads(Path(args.style).read_text(encoding="utf-8")) if args.style else {}
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    try:
        written = render(catalog, tokens, out)
    except ValueError as error:
        parser.error(str(error))
    print(f"Wrote {len(written)} pages to {out}/. Open {out}/index.html.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
