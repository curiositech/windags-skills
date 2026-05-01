---
name: htmx-progressive-enhancement
description: 'Use when building server-driven UIs with htmx, designing hx-* attribute compositions, choosing swap strategies (innerHTML/outerHTML/morph), wiring out-of-band updates, integrating with form validation, or migrating from a SPA back to server-rendered HTML. Triggers: hx-get/hx-post setup, hx-target + hx-swap interplay, hx-trigger debouncing, OOB swaps for parts of the page outside the request target, response headers like HX-Trigger and HX-Push-Url, integration with Hyperscript or Alpine.js, accessibility considerations on partial updates. NOT for full SPAs (use React/Vue), framework-specific server libraries (use those skills directly), or non-HTML responses.'
category: Frontend & UI
tags:
  - htmx
  - hypermedia
  - progressive-enhancement
  - server-rendering
  - hateoas
---

# htmx Progressive Enhancement

htmx adds AJAX, CSS transitions, WebSockets, and server-sent events to HTML via attributes. The mental model is "the server returns HTML; the client swaps it in." For most CRUD apps, this beats a SPA in time-to-ship and bundle size.

## When to use

- Server-rendered app where SPA complexity isn't paying off.
- Adding partial updates to a Rails/Django/Laravel/Phoenix/Hono app.
- Form-heavy UIs (admin panels, dashboards) without React's overhead.
- Migrating away from a SPA that grew past its complexity budget.
- Real-time updates via SSE or WebSockets without a frontend framework.

## Core capabilities

### Basic request/swap

```html
<button hx-get="/api/widget" hx-target="#out" hx-swap="innerHTML">
  Load
</button>
<div id="out"></div>
```

Click → GET /api/widget → response HTML replaces `#out` content.

### Common attributes

| Attribute | Purpose |
|-----------|---------|
| `hx-get` / `hx-post` / `hx-put` / `hx-delete` / `hx-patch` | HTTP method + URL. |
| `hx-target` | CSS selector for the swap. Default: the element itself. `closest`, `next`, `previous` selectors supported. |
| `hx-swap` | How to swap. `innerHTML` (default), `outerHTML`, `beforebegin`, `afterbegin`, `beforeend`, `afterend`, `delete`, `none`. |
| `hx-trigger` | When to fire. `click` (default for buttons), `change`, `keyup changed delay:500ms`, `revealed`, `every 5s`. |
| `hx-include` | Extra fields to include with the request. |
| `hx-vals` | Static or JS-computed extra params. |
| `hx-confirm` | Browser confirm() before request. |
| `hx-indicator` | CSS selector to mark "request in flight." |
| `hx-disabled-elt` | Disable elements while request runs. |
| `hx-push-url` | Update browser URL on success. |

### Swap strategies

```html
<!-- Replace contents of target -->
<a hx-get="/feed/items" hx-target="#list" hx-swap="innerHTML">Refresh</a>

<!-- Replace the target itself -->
<button hx-delete="/items/42" hx-target="closest tr" hx-swap="outerHTML swap:300ms">
  Delete
</button>

<!-- Append to a list (newest at top) -->
<form hx-post="/comments" hx-target="#comments" hx-swap="afterbegin">
  ...
</form>
```

`swap:300ms` is a CSS transition delay — the old content gets `htmx-swapping` class for 300ms, you animate it out, then htmx swaps.

### Triggers — debouncing search

```html
<input
  type="search"
  name="q"
  hx-get="/search"
  hx-trigger="keyup changed delay:300ms, search"
  hx-target="#results"
/>
<div id="results"></div>
```

`changed` skips events that don't change the value (arrow keys). `delay:300ms` debounces. Multiple comma-separated triggers are OR'd.

### Out-of-band swaps

When a request needs to update something outside the target:

```html
<!-- Server returns -->
<div id="cart-count" hx-swap-oob="true">3</div>
<div>Item added to cart.</div>
```

The browser sees the OOB element and swaps it into the page wherever `id="cart-count"` lives. The remaining content goes to `hx-target`.

### Response headers — server controls the client

| Header | Effect |
|--------|--------|
| `HX-Trigger` | Fire a custom event on the document. JSON for events with payload. |
| `HX-Push-Url` | Update browser URL. |
| `HX-Redirect` | Client-side redirect. |
| `HX-Refresh: true` | Reload the page. |
| `HX-Reswap` / `HX-Retarget` | Override the swap strategy or target server-side. |
| `HX-Location` | Like Redirect, but uses htmx (preserves boost). |

```python
# Flask example
return render_template('partials/item.html', item=item), 200, {
    'HX-Trigger': json.dumps({'cart-updated': {'count': 3}})
}
```

```html
<div hx-get="/cart/count" hx-trigger="cart-updated from:body">...</div>
```

### Forms with validation

```html
<form hx-post="/users" hx-target="#form-area" hx-swap="outerHTML">
  <label>
    Email
    <input name="email" required hx-post="/validate/email"
           hx-trigger="change" hx-target="next .error" hx-swap="innerHTML" />
    <span class="error"></span>
  </label>
  <button>Save</button>
</form>
```

The change-time validation hits `/validate/email`; the form-submit hits `/users`. Server returns either the next form state or the success view.

### Boost — turn regular links into AJAX

```html
<body hx-boost="true">
  <a href="/about">About</a>      <!-- becomes an htmx swap -->
  <a href="/external" hx-boost="false">External</a>
</body>
```

Boosted navigation does an AJAX GET, swaps `<body>`, and pushes URL. SPA-like navigation without writing a SPA.

### Loading indicators

```html
<button hx-post="/submit" hx-indicator="#spinner">Submit</button>
<span id="spinner" class="htmx-indicator">Saving…</span>
```

```css
.htmx-indicator { display: none; }
.htmx-request .htmx-indicator { display: inline; }
```

The `htmx-request` class is added to the element making the request for the duration; CSS handles the rest.

### Server-sent events

```html
<div hx-ext="sse" sse-connect="/events" sse-swap="message">
  Waiting for events…
</div>
```

Each `event: message` from the server triggers a swap of the response body into the div.

### WebSockets

```html
<div hx-ext="ws" ws-connect="/chat">
  <ul id="messages"></ul>
  <form ws-send>
    <input name="text" />
  </form>
</div>
```

The form sends JSON on submit; server echoes HTML back, swapping into the page.

## Anti-patterns

### Returning JSON when htmx wanted HTML

**Symptom:** Endpoint returns 200 but nothing changes on the page.
**Diagnosis:** htmx swaps response bodies as HTML. JSON ends up rendered as text.
**Fix:** Server returns HTML fragments for htmx requests (detect via `HX-Request` header). Keep JSON endpoints separate.

### Tracking state on the client

**Symptom:** Race conditions; page shows stale data after multiple actions.
**Diagnosis:** Trying to maintain client-side state in JS variables.
**Fix:** Server is the source of truth. Each response includes the new state's HTML. If you're tempted to maintain client state, you probably want a SPA.

### Forgotten `hx-target` for forms

**Symptom:** Form submission replaces the form's container instead of updating output area.
**Diagnosis:** `hx-target` defaults to the element itself; for forms, this is the form.
**Fix:** Add `hx-target="#output"` and `hx-swap` explicitly.

### Missing CSRF token

**Symptom:** POST/PUT/DELETE returns 403 from a framework that enforces CSRF.
**Diagnosis:** Form helpers usually inject CSRF; htmx requests don't unless you tell them.
**Fix:** Use `hx-headers='{"X-CSRF-Token": "..."}'` or include in `hx-vals`. Some frameworks have htmx-aware CSRF middleware.

### No fallback for JS-disabled

**Symptom:** Site unusable without JS even though it could degrade.
**Diagnosis:** Forms and links that *only* work via htmx.
**Fix:** Use `hx-boost="true"` on links and forms — without JS they're regular HTML; with JS they upgrade. Combine `action="/path"` with `hx-post="/path"` so POST works either way.

### Accessibility: focus + announcements

**Symptom:** Screen reader users don't know content updated.
**Diagnosis:** Partial swaps don't trigger ARIA live regions automatically.
**Fix:** Mark dynamic regions with `aria-live="polite"`. Manage focus on swap with `hx-on::after-swap`. Add visually-hidden announcements for important changes.

## Quality gates

- [ ] htmx request endpoints return HTML, not JSON.
- [ ] CSRF tokens included on every state-changing request.
- [ ] Forms work without JS (progressive enhancement, not JS-required).
- [ ] Dynamic regions have `aria-live` for screen readers.
- [ ] Focus managed on swap (`hx-on::after-swap`).
- [ ] No client-side state beyond htmx attributes; server is the source of truth.
- [ ] Loading indicators on every request that takes >300ms.
- [ ] OOB swaps used for cross-region updates instead of multiple requests.
- [ ] Trigger debouncing (`delay:`) on every type-as-you-search input.

## NOT for

- **Full SPAs** with rich client state — htmx adds friction for that case.
- **Framework-specific server-side rendering** — use the framework's idioms (Phoenix LiveView, Rails Hotwire, Laravel Livewire are similar but not htmx).
- **Native mobile** — htmx is web-only.
- **Heavy real-time collaborative apps** (Figma-like) — the round-trip cost is too high.
