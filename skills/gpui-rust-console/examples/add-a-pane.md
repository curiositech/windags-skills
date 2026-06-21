# Example: Add a new pane to pd-console end to end

Goal: add a "Voyages" pane that lists active voyages from `GET /voyages`, slotted after
Lane, fully unit-tested, no gpui needed for the tests. Every step cites a real file.

## 1. Copy the templates

```bash
cp skills/gpui-rust-console/templates/new_pane.rs.tmpl core/pd-console/src/voyages_pane.rs
# then replace the {{...}} placeholders:
#   {{PaneStruct}}   -> VoyagesPane
#   {{PANE_TITLE}}   -> Voyages
#   {{pane_id}}      -> voyages
#   {{pane_module}}  -> voyages_pane
#   {{DAEMON_ROUTE}} -> /voyages
#   {{RowType}}      -> Voyage   (define a real struct; remove the `type ... = String;` alias)
```

Paste the body of `templates/pane_tests.rs.tmpl` at the bottom of the file, same
substitutions.

## 2. Register the module (`main.rs`)

`core/pd-console/src/main.rs` has a `mod` block (lines ~11–33) and a `use` block
(~35–53). Add:

```rust
mod voyages_pane;
use voyages_pane::VoyagesPane;
```

## 3. Slot it into the producer's pane list (`main.rs`)

The producer thread constructs all panes (~lines 180–197) and pushes their views into the
`Vec<(usize, Vec<Block>)>` (~260–278). Pick the **next** nav index (Lane is 16, so Voyages
is 17). Add the construction:

```rust
let mut voyages = VoyagesPane::new();   // 17
```

a refresh call in the loop:

```rust
let _ = voyages.refresh(&client).await;
```

and a tuple in the `all` vec:

```rust
(17, voyages.view()),
```

## 4. Add it to the NAV table (`app.rs`)

`ConsoleView`'s `NAV` table (`app.rs`) maps nav index → label/glyph/key. Add a `Voyages`
entry with a free hotkey. The producer's index and the NAV index **must agree** — that
shared integer is the contract; a mismatch paints the wrong slot. (`main.rs` has a comment
block listing the canonical order — keep it updated.)

## 5. Verify the way CI does

```bash
python3 skills/gpui-rust-console/scripts/verify_console.py run --crate core/pd-console
# expect: cargo check ok, cargo test ok (your 4 new VoyagesPane tests included)
```

`cargo test` with no filter runs the new tests on Linux without touching gpui (the window
bin is `required-features = ["gpui"]`). The macOS window build is a separate, path-gated
job — only run `--gpui` locally if you're on a Mac.

## What a novice gets wrong here

- **Hardcoding a color in `view()`.** Emit `Block::Chip { tone: Tone::Engaged }`, never an
  rgb. The renderer resolves it (see `references/maritime-flags.md`).
- **Calling reqwest in `view()`.** `view()` is sync and runs on the foreground path.
  All IO is in `refresh()` on the producer thread.
- **Propagating a fetch error out of `refresh`.** Record it in `last_error` and render an
  error state; a single failing route must not blank the whole console.
- **Forgetting the NAV/producer index has to match.** They are the same integer in two
  files. Off-by-one paints Voyages' data under Lane's header.
