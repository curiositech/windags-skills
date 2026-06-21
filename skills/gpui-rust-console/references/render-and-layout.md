# GPUI 0.2.x Rendering & Layout — the idioms that compile

> GPUI 0.2.2 (`Cargo.toml`: `gpui = { version = "0.2.2", optional = true }`). The crate
> is Metal-centric; everything here is what actually compiles against that pin, not the
> shifting `main`-branch API.

## Render vs RenderOnce — pick by mutability, not by "is it small"

- `Render` (`fn render(&mut self, &mut Window, &mut Context<Self>)`): a **stateful view**
  with a lifecycle. Holds a `FocusHandle`, responds to events, lives across frames. The
  console's `ConsoleView` and any pane that owns focus/selection is `Render`.
- `RenderOnce` (`fn render(self, &mut Window, &mut App)`, with `#[derive(IntoElement)]`):
  **pure presentation**, consumed once per paint. Rows, chips, sidebar items, and
  `FlagBadge` (`maritime.rs`) are `RenderOnce`. It takes `self` by value — it cannot keep
  state between frames, which is exactly the point.

Rule from `console-architecture.md`: if a thing only displays data, make it `RenderOnce`.
Reaching for an `Entity<T>` (the GPUI handle type) for pure display is the
"Entity-for-display" anti-pattern — it adds an allocation and a notify path for nothing.

```rust
#[derive(IntoElement)]
struct Chip { label: SharedString, tone: Tone }

impl RenderOnce for Chip {
    fn render(self, _: &mut Window, _: &mut App) -> impl IntoElement {
        div().px(px(8.0)).py(px(2.0)).rounded(px(4.0))
            .bg(rgb(/* tone resolved to u32 by caller */ 0x252420))
            .child(self.label)
    }
}
```

## Layout is Taffy flexbox with a fluent builder

GPUI lays out with Taffy (the same flexbox engine Zed uses). The builder methods map 1:1
to CSS flexbox:

| Method | CSS |
|--------|-----|
| `.flex()` | `display: flex` |
| `.flex_col()` | `flex-direction: column` |
| `.flex_1()` | `flex: 1 1 0` (grow to fill) |
| `.gap(px(8.0))` | `gap: 8px` |
| `.items_center()` / `.justify_center()` | align/justify |
| `.overflow_hidden()` | **clip** — required around any scroll region |
| `.overflow_y_scroll()` | vertical scroll + scrollbar |
| `.w(px(96.0))` / `.h_full()` / `.size_full()` | dimensions |
| `.border_l_2()` / `.border_b_1()` | per-side borders |
| `.rounded(px(6.0))` | border-radius |

**The load-bearing trap:** `overflow_y_scroll` does nothing useful without a *bounded*
parent. A scroll region must live inside something with a fixed or `flex_1` height, and
that ancestor needs `overflow_hidden`. Unbounded scroll = the content just grows the
window. This is the single most common GPUI layout bug.

### Three-panel skeleton (sidebar | divider | header+body) — what the console uses

```rust
div().flex().flex_1().overflow_hidden()
    .child(div().w(px(96.0)).h_full().bg(rgb(C_PANEL)).flex().flex_col()
        .children(nav_items))                                   // rail
    .child(div().w(px(1.0)).bg(rgb(C_BORDER)))                  // divider
    .child(div().flex_1().flex().flex_col()                     // main column
        .child(div().px(px(16.0)).py(px(10.0)).border_b_1()
            .border_color(rgb(C_BORDER)).child("Header"))       // fixed header
        .child(div().flex_1().overflow_hidden().child(body)))   // bounded scroll host
```

## Scrollable lists: `uniform_list` vs `list`

- **`uniform_list`** — *same-height* rows, virtualized. Use for agent/fleet/session
  tables (the common case). Only renders the visible window, so 10k rows is fine. Pass a
  closure `(this, range, _, cx) -> Vec<impl IntoElement>` that slices `this.items[range]`.
  Chain `.track_scroll(&self.scroll_handle)` for programmatic scrolling.
- **`list` + `ListState`** — *variable* heights (mixed headers, gaps, chips). Heavier;
  reach for it only when rows genuinely differ in height.

```rust
use gpui::uniform_list;
uniform_list(cx, "agents-list", self.agents.len(), |this, range, _, cx| {
    this.agents[range].iter().map(render_agent_row).collect()
}).track_scroll(&self.scroll_handle)
```

Rendering 1000+ rows as flat `.children(...)` instead of `uniform_list` is the virtual-
scroll anti-pattern — it paints every row every frame.

## Focus & keyboard nav

A focusable view stores `focus_handle: FocusHandle` (from `cx.focus_handle()`), calls
`.track_focus(&self.focus_handle)` in `render`, sets a `.key_context("my-pane")`, and
attaches `.on_key_down(cx.listener(...))`. `main.rs` focuses the root view at startup so
nav works pre-click.

```rust
.on_key_down(cx.listener(|this, ev: &KeyDownEvent, _, cx| {
    match ev.keystroke.key.as_str() {
        "ArrowDown" => this.sel = (this.sel + 1).min(this.items.len().saturating_sub(1)),
        "ArrowUp"   => this.sel = this.sel.saturating_sub(1),
        "Enter"     => this.activate(),
        "Escape"    => this.dismiss(),
        _           => return,         // let other handlers see unmatched keys
    }
    cx.notify();                       // only notify on a real state change
}))
```

Key strings are lowercase with modifier prefixes: `"ArrowUp"`, `"Enter"`, `"Escape"`,
`"Tab"`, `"0"`–`"9"`, `"a"`–`"z"`, `"cmd-s"`, `"ctrl-shift-p"`, `"shift-ArrowUp"`.

## Hover / active / conditional styling

```rust
div()
    .hover(|s| s.bg(rgb(C_RAISED)).cursor_pointer())
    .active(|s| s.bg(rgb(C_ENGAGED)))
    .when(is_selected, |s| s.bg(rgb(C_RAISED)).text_color(rgb(C_ACCENT)))
    .when(!is_selected, |s| s.text_color(rgb(C_INK2)))
```

`.when(cond, |s| ...)` is the GPUI conditional — there is no ternary in the builder.

## Tooltips & animations

```rust
div().tooltip(|_, _| div().bg(rgb(0x2a2825)).text_color(rgb(0xd4cfc7))
    .px(px(8.0)).py(px(4.0)).rounded(px(4.0)).text_size(px(13.0))
    .child("ICS Kilo — wish to communicate").into_any_view())

div().with_animation("fade-in", Animation::new(Duration::from_millis(200)),
    |el, delta| el.opacity(delta))   // delta: 0.0 → 1.0
```

Easing names: `linear`, `quadratic`, `ease_in_out`, `ease_out_quint`, `bounce(easing)`.

## `cx.notify()` discipline

`cx.notify()` schedules a re-render. Calling it every frame (e.g. in a timer with no state
change) defeats GPUI's dirty-tracking and pins the GPU. Call it **only** when state the
view reads has actually changed — exactly once per real mutation, in the event handler.
GPUI renders are *pure*: never mutate `self` inside `render`; mutate in handlers and let
the notify trigger the next paint.

## Performance anti-patterns (each costs frames)

| Anti-pattern | Fix |
|---|---|
| `cx.notify()` every frame | Notify only on meaningful state change |
| Cloning a big `Vec<T>` in `render` | Slice in `uniform_list`; or `Rc<[T]>` |
| `Entity<T>` for pure display | `RenderOnce` struct |
| Flat `.children(1000 rows)` | `uniform_list` (virtual scroll) |
| `overflow_y_scroll` with no bounded parent | wrap in `flex_1` + `overflow_hidden` |
| Hardcoded inline hex | resolve `Tone`→OKLCH in one place (`theme.rs`) |
| `Arc<Mutex<State>>` across threads | `mpsc` producer/consumer (`console-architecture.md`) |
