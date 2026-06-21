# Building pd-console & the Real CI Gate

> Source of truth: `core/pd-console/Cargo.toml` and the `rust-console` /
> `rust-console-gpui` jobs in `.github/workflows/ci.yml`. This page **corrects** folklore
> that circulated in earlier drafts of this skill.

## The feature-gate is the whole trick

`Cargo.toml` declares gpui as an **optional** dependency behind a `gpui` feature:

```toml
[features]
gpui = ["dep:gpui"]

[[bin]]
name = "pd-console-repl"            # headless ratatui — builds everywhere
path = "src/bin/repl.rs"

[[bin]]
name = "pd-console"                 # the GPU window
path = "src/main.rs"
required-features = ["gpui"]        # only builds with --features gpui
```

Consequence: a plain `cargo check` / `cargo test` on Linux **never compiles gpui at all**.
The GPU window bin is `required-features = ["gpui"]`, so it's silently excluded. This is
why every pane is unit-tested on cheap Linux runners while the Metal-centric window is
built only on macOS.

## What CI actually runs (verbatim from ci.yml)

| Job | Runner | Commands | Path-gated? |
|-----|--------|----------|-------------|
| `rust-console` | `ubuntu-latest` | `cargo check` then `cargo test` (cwd `core/pd-console`) | no — always runs |
| `rust-console-gpui` | `macos-latest` | `cargo build --features gpui --bin pd-console` | yes — only when `core/pd-console/` (or ci.yml) changed |

There is **no `RUST_MIN_STACK` override in CI. There is no `--bin pd-console-repl` test
filter in CI.** Earlier skill drafts claimed both; they are wrong. `cargo test` with no
filter runs every test in the crate, and that is the gate.

`scripts/verify_console.py` reproduces this exactly: `cargo check` + `cargo test`, plus an
opt-in `cargo build --features gpui --bin pd-console` for macOS. Run it before you push a
console change:

```bash
python3 skills/gpui-rust-console/scripts/verify_console.py run --crate core/pd-console
# on macOS, also build the window:
python3 skills/gpui-rust-console/scripts/verify_console.py run --crate core/pd-console --gpui
```

## The real stack-overflow guard: `recursion_limit`, not an env var

GPUI's element builders are deeply nested generic types; the macro/trait machinery can
blow the **compiler's** recursion limit (a const-eval / type-resolution depth, not the
runtime thread stack). The real, in-tree fix is the first line of `main.rs`:

```rust
#![recursion_limit = "512"]
```

That is a crate attribute the compiler honors directly. If you hit
`reached the recursion limit while instantiating ...` when building `--features gpui`,
**raise this number** — do not set `RUST_MIN_STACK`. `RUST_MIN_STACK` resizes the runtime
thread stack and has no effect on a compile-time recursion-limit error. Conflating the two
sends you chasing the wrong knob for an hour. (If you ever do hit a genuine *runtime*
stack overflow inside a test — distinct from the compile error — that is when
`RUST_MIN_STACK=16777216` is the tool; it is not part of the normal build.)

## Anti-pattern: "just build it on Linux"

A novice tries to make the GPU window compile on the Linux job and fights gpui's Metal
backend for an afternoon. The design says no: the window is a macOS deliverable, gated by
`required-features`, built on `macos-latest`. Keep the Linux gate gpui-free; it's what
makes the pane unit tests fast and portable.

## Brand-color guard (this is what `1d14ef84` fixed)

A repo-wide guard rejects the retired Harbor Heritage cinnabar red in tracked files (see
`website-v2/docs/design/BRAND.md`). A literal cinnabar hex appearing even in a SKILL.md
or a doc comment will fail the guard — the merge-commit scan reads docs too. Use OKLCH
tokens (`theme.rs`) or the named badge colors; never paste a raw retired hex.

## Hardcoded-URL / port guard

`tests/unit/no-hardcoded-daemon-url.test.js` and `no-hardcoded-daemon-port.test.js` forbid
the daemon literal `9876` / `http://127.0.0.1:9876` anywhere in `core/` **except**
`agent.rs` (the canonical resolver, allowlisted). Doc comments and ASCII art count. In a
pane's docs use the `<resolved-url>` placeholder, never the literal — `DaemonClient::discover()`
is the only thing allowed to know the number.
