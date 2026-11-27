# Cinder & Pine storefront preview

This original illustrative shop uses a fixture catalog. The photographs and cover mockup are generated editorial imagery for the fixture. They do not document a real product or a customer business.

Regenerate the collection and product pages from the skill directory.

```sh
python3 scripts/validate_catalog.py templates/catalog.example.json --images-root examples/preview
python3 scripts/render_storefront_preview.py templates/catalog.example.json --style examples/style-tokens.example.json --out examples/preview
python3 -m http.server 8080 --bind 127.0.0.1 --directory examples/preview
```

Use the local HTTP page to test persistence across collection and product routes. Opening the files directly or embedding them with scripts in an opaque sandbox can limit persistence. The preview remains usable in memory for the current page. It does not send an order, charge money or process addresses.

Rebuilds remove retired product pages that still carry a valid generator marker. Review old unmarked pages before removing them from an existing preview folder.

Verify that the category filter can isolate prints and return to all items. Choose the 14 oz candle in its detail page and check that the bag contains that variant at $38. Add a $12 guide and check the $50 subtotal. Change quantities and remove an item, close the dialog with Escape, and check that focus returns to the invoking control. Check 320 px and a desktop width in both themes.
