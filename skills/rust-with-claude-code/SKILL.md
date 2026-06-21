---
name: rust-with-claude-code
version: 0.1.0
description: >
  Effective Rust development with Claude Code as AI pair programmer.
  Testing patterns, borrow checker idioms, debugging, toolchain workflow,
  and GPUI-specific Rust patterns for pd-console.
author: port-daddy
tags: [rust, claude-code, testing, debugging, workflow, gpui]
pairs-with:
  - gpui-rust-console
  - git-best-practices
  - daemon-development
---

# Rust with Claude Code

## Session Startup Checklist

Every Rust session:
```bash
cd core/pd-console
cargo check           # fast semantic check (catches 90% of errors)
cargo clippy          # lints (catches real bugs, not just style)
cargo test --bin pd-console-repl  # unit tests
```

Tell Claude your current test status first: "cargo check passes, clippy clean, 23 tests green."

---

## Sharing Errors with Claude

Always share:
1. Full compiler error (all lines, not just the first)
2. 10-15 lines of surrounding code
3. One sentence of intent: "I want to [read field], then [mutate struct]"

Claude pattern-matches on constraint shape, not syntax. Intent enables correct suggestions.

---

## Borrow Checker Patterns

**Get field → use → mutate struct:**
```rust
// WRONG: borrow extends into mutation
let channel = &self.agents[i].channel;
self.agents[i].cursor = 0;  // ERROR: still borrowed

// RIGHT: scope the borrow
let channel = self.agents[i].channel.clone();
self.agents[i].cursor = 0;
```

**Self reference in async closure:**
```rust
// RIGHT: extract into owned bindings, then use
let (channel, backend) = {
    let a = self.agents.get(&local)?;
    (a.channel.clone(), a.backend)
};
self.client.tube_send(&channel, text, "operator").await
```

**Modify while iterating:**
```rust
// Collect indices, apply after
let to_remove: Vec<_> = self.items.iter().enumerate()
    .filter(|(_, item)| item.should_remove())
    .map(|(i, _)| i)
    .collect();
for i in to_remove.into_iter().rev() {
    self.items.remove(i);
}
```

---

## Async Patterns for pd-console

**Thread + tokio mini-runtime for HTTP (main.rs pattern):**
```rust
let (tx, rx) = mpsc::channel::<Vec<Block>>();
std::thread::spawn(move || {
    let rt = tokio::runtime::Builder::new_current_thread()
        .enable_all().build().expect("tokio rt");
    rt.block_on(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(2)).await;
            if tx.send(data).is_err() { break; }  // window closed
        }
    });
});
```

Use ALWAYS for reqwest: it needs tokio; GPUI uses smol. Never run reqwest in GPUI's executor.

**Async trait method (object-safe, no async-trait crate):**
```rust
fn refresh<'a>(
    &'a mut self,
    daemon: &'a DaemonClient,
) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<()>> + Send + 'a>> {
    Box::pin(async move {
        // async code
    })
}
```

**Async tests:**
```rust
#[tokio::test]
async fn test_refresh() {
    let client = DaemonClient::new("http://localhost:9999".into());
    assert!(client.agents().await.is_err());  // no daemon, should fail gracefully
}
```
Use `#[tokio::test]` for async — never `#[test]` on an async fn.

---

## Testing Patterns

**Unit tests in the same file:**
```rust
#[cfg(test)]
mod tests {
    use super::*;  // Access private types

    fn make_pane(entries: Vec<Entry>) -> MyPane {
        MyPane { entries, count: 0, last_error: None }
    }

    #[test]
    fn view_empty() {
        assert!(!make_pane(vec![]).view().is_empty());
    }

    #[test]
    fn view_error_state() {
        let mut p = MyPane::default();
        p.last_error = Some("conn refused".into());
        let blocks = p.view();
        assert!(blocks.iter().any(|b| matches!(b, Block::KeyVal(k, _) if k == "error")));
    }
}
```

**Test three states always:** empty, populated, error.

**CI constraint:** `cargo test --bin pd-console-repl` with `RUST_MIN_STACK=16777216` (GPUI proc-macros overflow Linux rustc stack on `--lib` test mode).

---

## Error Handling (anyhow)

```rust
use anyhow::{anyhow, Context, Result};

pub async fn fetch(&self, path: &str) -> Result<Value> {
    let resp = self.http
        .get(format!("{}{}", self.base, path))
        .send()
        .await
        .context(format!("GET {}", path))?;  // Add context to any error
    
    let v: Value = resp.json().await.context("parse JSON")?;
    Ok(v)
}
```

Always `.context("what were we doing")` — makes error chains readable. Never `.unwrap()` outside tests.

---

## Clippy Rules

**Meaningful (fix these):**
- `borrowed_box` → use `&T` not `&Box<T>`
- `clone_on_copy` → Copy types use copy, not `.clone()`
- `unwrap_used` → use `?` or `.ok_or_else()` in non-test code

**Safe to ignore in GPUI code:**
- `type_complexity` → GPUI builders create complex element types by design
- `upper_case_acronyms` → PD/API naming is intentional

---

## String Efficiency

| Use case | Type |
|----------|------|
| Static string literals | `"text"` or `&'static str` |
| Owned UI text | `String` (one per frame is fine) |
| Interned UI strings | `SharedString` (GPUI, cheap clone) |
| Static-or-owned flexibility | `Cow<'static, str>` |

Avoid `String::from("text")` — use `"text".into()` or `.to_string()` for clarity at call site.

---

## Cargo Workflow

```bash
cargo watch -x check        # Continuous check on file save
cargo check                 # Fast semantic check
cargo clippy                # Lints + real bug detection
cargo test                  # All tests
cargo run --bin pd-console  # Run the GPUI app
cargo fmt                   # Format before commit
```

**Feature flags explicit:**
```toml
tokio = { version = "1", features = ["rt-multi-thread", "macros", "time", "sync"] }
reqwest = { version = "0.12", default-features = false, features = ["json", "rustls-tls"] }
```

Never leave features implicit — it makes AI assistance and debugging harder.

---

## What to Push Back on When Claude Suggests

- ✗ `.unwrap()` → "Use `?` or `.ok_or_else()`"
- ✗ `async-trait` crate → "We use `Box::pin(async { ... })` for object safety"
- ✗ `Arc<Mutex<T>>` → "We use mpsc channels — Arc<Mutex> blocks the renderer"
- ✗ `#[test]` on async fn → "Use `#[tokio::test]` for async tests"
- ✗ Modifying `self` during render → "GPUI renders are pure; mutate in event handlers"

---

## Trait Object Pattern (Pane registry)

```rust
pub trait Pane: Send {
    fn id(&self) -> &str;
    fn view(&self) -> Vec<Block>;
    fn refresh<'a>(&'a mut self, daemon: &'a DaemonClient)
        -> Pin<Box<dyn Future<Output = Result<()>> + Send + 'a>>;
}

// Registry holds any Pane implementation
struct PaneRegistry {
    panes: Vec<Box<dyn Pane>>,
}
```

Use for plugin-like extensibility where multiple types implement the same interface. No generics needed at the registry level.

---

## Visibility Conventions

```rust
pub struct DaemonClient { ... }        // Public to whole workspace
pub(crate) fn extract_text(...) { }   // Public within this crate
fn tone_rgb(...) { }                   // Private to module
```

For a binary crate (not library), most types can be `pub(crate)`. Reserve `pub` for types that may be used from other crates in the workspace.

<!-- BEGIN BUNDLE INDEX (auto: index_references.py) -->

## Skill Bundle Index

*Every file in this skill, and when to open it. Auto-generated; run `scripts/index_references.py --fix`.*

<!-- END BUNDLE INDEX -->
