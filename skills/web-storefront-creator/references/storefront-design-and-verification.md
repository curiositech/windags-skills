# Storefront design and verification

Read this when a design needs to become a usable visual storefront or when a preview is ready to review.

## Make the product easier to choose

- Review the host at a phone and desktop width. Carry over the host's text, accent and focus roles. Let original photography establish the mood. Use a consistent aspect ratio across a collection, with deliberate detail-page crops. Include meaningful descriptions on standalone product images.
- Give each product card a legible name, current price, and the buyer's actual next action. If a product needs more than one meaningful choice, route to a detail view and show the price and availability of the selected variant. Keep discounts, ratings and stock claims tied to verified inputs.
- Make the detail page answer the next purchase question. A print buyer may need paper and frame details. A buyer of a PDF needs the file format. Put these near the description or action rather than filling the hero with abstract benefits.
- Keep the cart subtotal and line items visible in the same view. Opening and closing a bag must preserve keyboard orientation. Use real disabled states and clear empty or unavailable messages.

## Concrete design references

- [21st.dev Featured Product Showcase](https://docs.21st.dev/%40ziegfiroyt/components/ecommerce5) is useful for studying a split image and purchase-information layout. [21st.dev Product Card](https://dev.21st.dev/%40aadixc0de/components/product-card) shows explicit variant controls and distinct actions. Treat these as patterns to compare against the host. Check licenses and dependencies before reusing any source. Product photos, claims, badges and styling should come from the actual shop.
- [Shopify Editions theme](https://themes.shopify.com/themes/editions/presets/editions) shows how simple product grouping and generous image space make a small catalog easier to browse.
- [Shopify Storefront product object](https://shopify.dev/docs/api/storefront/latest/objects/product) documents product-to-variant relations, availability and media. The product ID and the selected purchasable variant are distinct. Preserve the variant ID through the bag, checkout and order.
- [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) covers initial focus, Escape, tab containment and focus return. Test these with the actual cart surface when using a dialog.

The Cinder & Pine example uses original photography with a split editorial hero, restrained card hierarchy and an ordinary HTML dialog. It imports no 21st.dev widgets and adapts the patterns to an original collection.

## Acceptance checks

| Check | Observable outcome |
| --- | --- |
| Product media | Each requested image loads, the actual product stays in frame at phone width, and alt text describes the product rather than its sales pitch. |
| Discovery | The supported filter changes the catalog and count. Removing the filter restores all active products. A no-JavaScript catalog still shows its items and detail links. |
| Variant and price | A variant change updates the shown price, selectable availability and exact line item. A second item changes the subtotal by its listed price. |
| Quantity and recovery | Changing quantities, removing the last line and returning from details behave predictably. A sold-out line cannot be purchased in a preview of availability. |
| Accessibility | At 320 px and 200% text, names, prices and actions remain accessible. Verify keyboard focus, dialog label and Escape, and focus return at phone and desktop widths. |
| Authority | A preview is visibly identified, captures no payment details, and sends no orders. Sandbox and live checkout have separate evidence. |

Report the rendered URL or artifact path, catalog revision, modes checked, and a specific failure that would prevent publishing. When outcomes differ from a storefront inspiration board, explain the product constraint that drove the difference.
