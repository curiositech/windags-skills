# The gpui App Skeleton

> *Capstone reference 02 of the "Build an M-Agent + N-Human Cooperative IDE in Rust gpui" skill.*
> This is the **structural** chapter: how to lay out a large gpui app so the Harbor Editor — agents and humans as co-equal Loro replicas, governed by Port Daddy claims — has a place to live. Motion, shaders, sound, and visual polish are **out of scope here**; they are owned by the sibling skills this capstone composes (see *Dependencies*). What follows is the load-bearing scaffold: the pane tree, the one object-safe surface contract, the background-refresh pipeline, and the end-to-end recipe for adding a new surface.

Everything below is grounded in the **real, shipping** pd-console at `/Users/erichowens/coding/tmp/pd-operator-console/core/pd-console/src` — `mux.rs`, `pane.rs`, `app.rs`, `main.rs`, `editor.rs`, `palette.rs`. Every `file:line` is quoted from that tree, not invented. Where the *Harbor Editor battle plan* (`docs/strategy/harbor-editor-battle-plan.md`) and the *interaction model* (`docs/design/harbor-interaction-model.md`) describe a primitive that does not exist yet, it is flagged **[planned]** so you never mistake the spec for the code.

---

## Dependencies — this capstone composes its siblings, it does not re-derive them

This skill is the **assembly manual**. It deliberately stops at the structural boundary and hands off:

- **`rust-gpui-motion`** — every `with_animation`, easing curve, `BoxShadow`/glow, breathing dot, pane zoom/slide. The skeleton here exposes the *seams* (focus glow at `app.rs:783`, the pulsing focus dot at `app.rs:813`); the motion skill owns what happens inside them. When this doc says "the pane lifts on hover," the *how* is gpui-motion's `motion::glow`/`motion::hard_offset` (`app.rs:225`–`245`).
- **`gpui-shaders`** (gpui/Metal/wgpu) — any custom-painted surface: the Vello living-harbor presence overlay the battle plan calls *Track B* (`pd-timeline-proto`, battle plan §3). A `SurfaceKind` variant can host a raw `canvas()`/wgpu pass; this doc tells you *where the variant plugs in*, the shader skill tells you what to paint.
- **`sound-design-and-audio`** — the audio cues for claim-granted, conflict-detected, agent-landed. The skeleton fires the *events* (a `ControlMsg` round-trips, a guard band appears); the audio skill turns them into sound.
- **`beautiful-gui-design`** — color/type/hierarchy/accessibility. The palette role table (`palette.rs:39`) and the 14px-minimum text rule are *its* law; this doc only shows where the `Theme` is threaded.

If you find yourself writing an easing curve or a fragment shader inside the app skeleton, **stop** — that belongs in a sibling, imported.

---

## 1. The shape of the whole app

A large gpui app of this kind has exactly **four layers**, and keeping them separate is the entire discipline:

```
┌─ main.rs ──────────────────────────────────────────────────────────────┐
│  Application::new().run(...)  — opens the window, owns two threads      │
│                                                                         │
│   ┌─ background std::thread (mini tokio rt) ─────────┐   mpsc   ┌─────┐ │
│   │  owns N surfaces + DaemonClient                  │ ───────► │ GPUI│ │
│   │  refresh() every 2s → Vec<(slot, Vec<Block>)>    │  (data)  │ fg  │ │
│   │  drains ControlMsg ◄─────────────────────────────┼──────────┤ task│ │
│   └──────────────────────────────────────────────────┘ (control)└──┬──┘ │
│                                                                     │    │
│                          ConsoleView (the one gpui Entity) ◄────────┘    │
└──────────────────┬──────────────────────────────────────────────────────┘
                   │ renders
       ┌───────────▼────────────┐
       │ Workspace (mux.rs)     │  pane tree: Node::Split / Node::Leaf
       │   each Leaf → SurfaceKind
       └───────────┬────────────┘
                   │ blocks_for_surface()
       ┌───────────▼────────────┐
       │ Pane / Surface trait   │  one contract, two renderers (GPUI + ratatui)
       │   (pane.rs) → Vec<Block>
       └────────────────────────┘
```

1. **`main.rs`** — process entry. Opens the window, spawns the background refresh thread, wires the two mpsc channels (data up, control down). It owns *no UI logic*.
2. **`ConsoleView` (in `app.rs`)** — the single gpui `Entity` that `impl Render`. Holds the tab/pane tree, the leader-key state machine, the command line, and the latest snapshot of every surface's blocks. **This is the only `Render` impl in the app** — there is no per-pane gpui widget zoo.
3. **`Workspace` (`mux.rs`)** — the GPUI-free, dependency-free, exhaustively unit-tested pane-tree multiplexer. The "tmux, but Rust" spine.
4. **`Pane`/`Surface` trait (`pane.rs`)** — the object-safe contract every data surface implements: emit render-agnostic `Block`s, pull from the daemon, optionally mutate and subscribe.

> **Decision Point — one big `Render` or many small ones?**
> pd-console chose **one** (`ConsoleView`). The pane *tree* is data (`mux.rs`), not a tree of gpui entities; `render_node` (`app.rs:717`) walks it recursively into one element tree per frame. This is why splitting, zooming, and "hop context" are pure data mutations (`Workspace::split`/`swap_surface`/`bind_entity`) with *zero* entity lifecycle. **Take this.** A tree of `View<PaneFoo>` entities would force you to manage focus, drop, and re-parent by hand on every split — the exact bug class `mux.rs` was written to delete.

---

## 2. The pane tree — `Workspace` in `mux.rs`

`Workspace` is the heart of the structural story and the reason adding the editor was cheap. Its module doc states the contract precisely (`mux.rs:7`):

> *"This module is deliberately **GPUI-free and dependency-free** so it compiles on the Linux CI gate and is exhaustively unit-testable. The GPUI shell (`app.rs`) renders this tree; the leader-key layer maps keystrokes onto the operations below."*

A `Workspace` is a tree of `Node`s (`mux.rs:101`):

```rust
pub enum Node {
    Leaf { id: PaneId, surface: SurfaceKind },
    Split { dir: Dir, children: Vec<Child> },   // Child { weight: f32, node: Node }
}
```

Exactly one leaf is focused at all times (`focused: PaneId`, `mux.rs:147`). The verbs are small and total:

| Verb | `mux.rs` | What it does |
|---|---|---|
| `split(dir, surface)` | `:195` | Split the focused pane; same-orientation parent → append as even sibling (no nesting); returns the new id, focuses it. |
| `close()` | `:225` | Remove focused leaf, merge the space, collapse degenerate splits; never closes the last pane. |
| `focus_next` / `focus_prev` / `focus(id)` | `:245`/`:250`/`:263` | Reading-order focus movement (wraps); direct focus. |
| `swap_surface(kind)` | `:273` | **The "hop context" verb** — mutate the focused leaf's `SurfaceKind` in place. Layout never moves. |
| `bind_entity(Option<String>)` | `:282` | Repoint a surface's *entity* without changing its kind (transcript → another agent; filetree → another root; editor → another path). |
| `resize(delta)` | `:303` | Shift flex weight between the focused leaf and its sibling (`±` fraction). |

The recursive tree surgery (`split_in`, `remove_leaf`, `collapse`, `resize_leaf`, `mux.rs:311`–`398`) lives as free functions to keep the borrow checker happy — a pattern worth copying verbatim.

> **Anti-Pattern — rebuilding the window manager.**
> **Symptom:** a PR that adds drag-to-resize or a new layout also touches `Node`/`Split`/`focus` semantics. **Detection:** `git diff mux.rs` shows changes to the *tree* algorithms when the task was a *view* feature. **Fix:** the battle plan is explicit (§3): *"The split/tab/zoom `Workspace` tree … is unit-tested and GPUU-free — **do not rebuild a window manager.**"* New interactions map onto the **existing** verbs. Drag-resize, for instance, is "generalize `resize_leaf` to take an absolute ratio" (interaction model §3), not a new tree.

### 2.1 The trees are tested without gpui

`mux.rs` ships ~18 unit tests (`mux.rs:424`–`598`) that run on the Linux CI gate with no GPU: `split_creates_two_panes_and_focuses_the_new_one` (`:440`), `same_orientation_split_appends_evenly_not_nests` (`:485`), `close_merges_and_collapses_degenerate_split` (`:513`), `swap_surface_hops_context_without_moving_layout` (`:543`). **This is the payoff of keeping the tree pure.** When you add a `SurfaceKind`, you add a `mux.rs` test for it the same way `split_into_editor_focuses_the_new_editor_pane` (`:463`) does — no window, no frame, no flake.

---

## 3. `SurfaceKind` — one pane, many faces

`SurfaceKind` (`mux.rs:33`) is the closed enum of *what a leaf shows*. Its doc nails the philosophy (`mux.rs:30`): *"'Hopping context' is just mutating this on the focused leaf — the layout never moves."* The shipping variants:

```rust
pub enum SurfaceKind {
    AgentTranscript { agent_id: Option<String> },  // None = follow the newest agent
    Roadmap,
    CartographerChat,
    FileTree { root: Option<String> },
    Editor { path: String, region: Option<(u32, u32)> },   // the Harbor Editor seed
    DaemonHealth,
    Fleet,
    Sessions,
    Dispatch,
    Panel { nav: String },   // bridge to any legacy data pane by nav id
}
```

Two design moves here are load-bearing and worth stealing:

1. **`Panel { nav: String }`** (`mux.rs:59`) is the *escape hatch*. Rather than minting a variant per data pane (fleet, cockpit, claims, peek, adrs…), one variant addresses any of them by nav id. The doc calls it *"the bridge to the live data the shell already fetches: every pane the old static console had is summonable into any split."* **Decision Point:** when a surface is just "render these blocks the background thread already fetches," it does **not** need its own `SurfaceKind` — it routes through `Panel`. Reserve dedicated variants for surfaces with *distinct interaction* (Editor selects/scrolls; FileTree is clickable; AgentTranscript steers).

2. **`Editor { path, region }`** (`mux.rs:46`) carries its own data key (the path), not a slot index. The doc is careful: *"Fed per-path (not via a NAV slot) — the editor reads its file from disk."* This is the structural seam where the Harbor Editor grows: today `region` is a scroll/select target; in the battle plan's P3 (§5) the same `region` becomes the **claimed range** rendered as a Loro awareness band. The variant already anticipates the wedge.

`SurfaceKind::label()` (`mux.rs:64`) gives every variant its title-bar string; `Editor` derives a basename-with-optional-region label (`mux.rs:72`), tested at `mux.rs:453`.

> **Anti-Pattern — variant explosion.**
> **Symptom:** `SurfaceKind` grows a variant for every new read-only panel. **Detection:** a new variant whose only behavior is `blocks_for_surface` → look-up-in-`pane_blocks`. **Fix:** route it through `Panel { nav }` and register a pane in `main.rs` (§5). A dedicated variant is justified only by dedicated *interaction* or a dedicated *data source* (disk, a CRDT doc), not by "it's a new screen."

---

## 4. The object-safe `Pane`/`Surface` contract — `pane.rs`

`pane.rs` defines the contract every *data* surface implements. Its framing (`pane.rs:1`): *"Render-agnostic on purpose: a pane emits `Block`s; the pd-tui (ratatui) and pd-console (GPUI) renderers each paint them in the locked theme. **One pane, two faces.**"*

### 4.1 `Block` — the render-agnostic currency

A pane never touches gpui. It emits `Block`s (`pane.rs:42`):

```rust
pub enum Block {
    Header(String),
    KeyVal(String, String),
    Row(Vec<String>),
    Chip { label: String, tone: Tone },
    Flag { letter: char, label: String, tone: Tone },  // a maritime ICS signal flag
    Spark(Vec<f32>),
    Gap,
}
```

Color is **meaning, not pixels**: `Tone` (`pane.rs:16`) is a semantic enum (`Default`, `Accent`, `Engaged`, `Gated`, `Resting`, `Landed`, `Conflicted`) resolved to a concrete OKLCH/sRGB by whichever renderer paints it (`Theme::tone`, `palette.rs:131`). The Harbor Editor's "claimed range" band and the battle plan's contradiction guard reuse `Tone::Conflicted` and `Tone::Gated` directly (battle plan §4) — the vocabulary already exists.

### 4.2 The trait — object-safe by construction

```rust
pub trait Pane: Send {
    fn id(&self) -> &str;
    fn title(&self) -> String;
    fn view(&self) -> Vec<Block>;                              // sync render
    fn refresh<'a>(&'a mut self, daemon: &'a DaemonClient)
        -> Pin<Box<dyn Future<Output = Result<()>> + Send + 'a>>;   // pull data
    fn mutate<'a>(&'a mut self, daemon: &'a DaemonClient, action: SurfaceAction)
        -> Pin<Box<...>> { /* default no-op */ }                    // grab the wheel
    fn subscription(&self) -> Option<Subscription> { None }         // watch live
    fn on_stream(&mut self, env: &StreamEnvelope) { }               // fold one frame
}
pub use self::Pane as Surface;   // pane.rs:125 — call it a "Surface" when it mutates+subscribes
```

The doc (`pane.rs:76`) explains the two deliberate constraints:

- **Object-safe** so the registry holds `Box<dyn Pane>` (`pane.rs:130`). That is why `mutate` takes an **action enum** (`SurfaceAction`, `pane.rs:60`) instead of a generic `mutate<T>` — a generic method would make the trait non-object-safe. **Take this rule:** any "do a thing" verb on the surface is a new `SurfaceAction` variant, never a generic.
- **Boxed futures, not `async-trait`** — `refresh`/`mutate` return `Pin<Box<dyn Future + Send>>` by hand (`pane.rs:92`), keeping the trait object-safe without a proc-macro. `on_stream` is sync (folding a frame is cheap).

The contract evolved *additively*: the 14 pre-existing read-only panes got `mutate`/`subscription`/`on_stream` for free via defaults (`pane.rs:80`: *"this is an additive evolution of the original `Pane` contract"*). **This is the model for evolving a large trait without a flag day.**

### 4.3 One pane, two faces — the proof in `EditorPane`

`editor.rs` is the cleanest worked example of the contract and the literal first slice of the Harbor Editor. Its doc (`editor.rs:1`): *"impls the same `Pane` contract as every other pane, so both renderers (ratatui `term::render_blocks` + GPUI `app::render_block`) paint it for free — one pane, two faces."*

`EditorPane` (`editor.rs:28`) holds a `path`, capped `lines`, a `region`, and a `last_error`. `view()` (`editor.rs:123`) emits a `Header`, an optional `range` `KeyVal`, and one `Block::Row([gutter, content])` per line — honoring the focus `region` so a `foo.rs:10-20` label is never a lie (`editor.rs:137`, tested `:273`). `refresh()` (`editor.rs:169`) re-reads from **disk** (the `&DaemonClient` arg is unused — the editor's data source is the filesystem, not the daemon). It overrides nothing else: no `mutate`, no `subscription` — it inherits the no-op defaults, exactly as a read-only surface should.

> **Decision Point — disk vs daemon vs CRDT as a surface's data source.**
> A surface's data source is whatever its `refresh` reads. `EditorPane` reads disk *today*; the battle plan's P1 (§5) swaps that backing store for a `LoroDoc`/`LoroText` while keeping the *same* `Pane` impl and the *same* `Block` output — the gutter just colors each span by PeerID. **The contract does not change when the data source becomes a CRDT.** That is the whole point of the seam: the renderer never learns a new trick.

---

## 5. The background-refresh → channel → view pipeline

This is the part most teams get wrong, and pd-console gets right. The rule (stated in `main.rs:4`): **one std thread with a mini tokio runtime owns all the surfaces and the daemon client; the GPUI foreground thread owns rendering; they speak only through two mpsc channels.** No tokio/smol collision, no `Send`-across-the-render-loop fights.

### 5.1 Data up: surfaces → `(slot, Vec<Block>)` → `ConsoleView`

`main.rs:180` spawns the producer:

```rust
std::thread::spawn(move || {
    let rt = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
    rt.block_on(async move {
        let client = DaemonClient::new(url);
        let mut fleet = FleetPane::new();   // ...one owned surface per NAV slot (main.rs:193–212)
        let mut lane  = LanePane::new();     // slot 16 — the LIVE one
        loop {
            tokio::time::sleep(Duration::from_secs(2)).await;
            /* drain ControlMsg (see 5.2) */
            let _ = fleet.refresh(&client).await;   // ...refresh each surface
            /* (re)subscribe + drain the lane's live SSE stream (main.rs:277–297) */
            let all = vec![ (0, fleet.view()), /* ... */ (16, lane.view()), /* ... */ ];
            if tx.send((all, dispatch.head())).is_err() { break; } // window closed
        }
    });
});
```

The consumer is a GPUI foreground task that drains the channel every 500ms and notifies the view (`main.rs:332`):

```rust
cx.foreground_executor().spawn(async move {
    loop {
        bg.timer(Duration::from_millis(500)).await;
        while let Ok((panes, dispatch_head)) = rx.try_recv() {
            async_cx.update(|app| window.update(app, |view: &mut ConsoleView, _, cx| {
                view.update_panes(panes.clone(), dispatch_head.clone());  // app.rs:702
                cx.notify();
            })).ok();
        }
    }
}).detach();
```

`update_panes` (`app.rs:702`) writes each `(slot, blocks)` into `ConsoleView::pane_blocks: Vec<Vec<Block>>` (`app.rs:433`). On the next frame, `blocks_for_surface` (`app.rs:549`) maps a leaf's `SurfaceKind` to the freshest blocks: a `Panel`/nav-backed surface looks up its slot in `pane_blocks` (`app.rs:558`); an `Editor` is constructed-and-loaded *synchronously* from disk on the spot (`app.rs:554`, `EditorPane::loaded(...).view()`).

> **Anti-Pattern — refreshing on the render thread.**
> **Symptom:** a surface does blocking I/O (HTTP, disk on a huge file) inside `view()` or the gpui render closure. **Detection:** frame hitches when a pane updates; an `.await` or `reqwest`/`fs::read` call reachable from `Render::render`. **Fix:** all data pull happens in the background thread's `refresh()`; the foreground only ever copies pre-computed `Block`s. (The *one* sanctioned exception is `EditorPane::loaded` reading a small file synchronously — and the battle plan §P1 flags moving even that off-thread once the buffer is a CRDT delta stream.)

> **Anti-Pattern — the two-runtime collision.**
> **Symptom:** `Cannot start a runtime from within a runtime`, or `Send`/`!Send` errors threading a `reqwest::Client` into a gpui task. **Detection:** you tried to `tokio::spawn` from inside `cx.foreground_executor().spawn`. **Fix:** the daemon-touching async lives **only** in the dedicated std-thread runtime (`main.rs:181`). The gpui side is pure channel-drain. Keep the membrane absolute.

### 5.2 Control down: `ControlMsg` — the "grab the wheel" channel

The UI mutates the world by sending a `ControlMsg` *back* to the thread that owns the daemon client (`app.rs:33`):

```rust
pub enum ControlMsg {
    InterruptLane,                                  // interrupt the agent the Lane watches
    Spawn { backend: String, prompt: String },      // POST /spawn
    Cartographer { text: String },                  // POST /msg/cartographer
    DispatchAccept { id: String },                  // review-gate verdicts
    DispatchReject { id: String, reason: String },
    DispatchCancel { id: String },
}
```

The button closure sends (`app.rs:892`, `tx.send(ControlMsg::InterruptLane)`); the background loop drains and performs it against the daemon (`main.rs:225`–`252`). This keeps the foreground thread *entirely* free of async/tokio (`app.rs:30`). The doc is explicit: the Lane's Interrupt button *"sends ControlMsg to the background thread that owns the surfaces + daemon."*

> **Decision Point — where does a new operator action go?**
> A new "do something to the world" verb is **a `ControlMsg` variant + a match arm in `main.rs`**, never an `.await` in a render closure. Adding the Harbor Editor's `claim_region`/`release_region` (battle plan §4) follows this exact shape: a `ControlMsg::ClaimRegion { path, range }` [planned], drained and POSTed to `/sessions/:id/files`. The render side only fires the message and shows a flash (`control_flash`, `app.rs:443`).

**Two channels, one direction each.** Data flows up as `(slot, Vec<Block>)`; control flows down as `ControlMsg`. This bidirectional-but-decoupled membrane is the single most reusable idea in the skeleton.

---

## 6. The view: `ConsoleView`, `render_node`, focus, zoom, tabs

`ConsoleView` (`app.rs:420`) is the one `Render` entity. Its state, trimmed:

```rust
pub struct ConsoleView {
    tabs: Vec<Tab>,             // each Tab = { name, workspace: Workspace, zoomed: Option<PaneId> }
    active_tab: usize,
    leader_armed: bool,         // Ctrl-A pressed; next key is a mux command
    command: Option<CommandLine>,   // an open bottom command line
    pane_blocks: Vec<Vec<Block>>,   // freshest blocks per NAV slot (from update_panes)
    focus_handle: FocusHandle,      // created ONCE (app.rs:482), focused on open
    control_tx: Option<mpsc::Sender<ControlMsg>>,
    control_flash: Option<String>,
    dispatch_head: Option<DispatchHead>,
    reject_target: Option<String>,
}
```

**Tabs** are independent pane trees (`Tab`, `app.rs:132`) — tmux windows. `new_tab`/`close_tab`/`switch_tab` (`app.rs:522`–`543`) manage them; `ws()`/`ws_mut()` (`app.rs:507`) always address the active tab's `Workspace`, so every mux verb operates on the right tree without the call sites knowing about tabs.

**Rendering** is the recursive `render_node` (`app.rs:717`): a `Split` becomes a `flex_row`/`flex_col` with each child weighted by `flex_basis(relative(frac))` (`app.rs:730`) — the flex layout reads the same `weight` the mux tree stores, which is why `resize` is a pure data write. A `Leaf` becomes `render_leaf` (`app.rs:745`), which pulls `blocks_for_surface` and paints the bordered pane, the title bar, the focus glow (`app.rs:783`), and the breathing focus dot (`app.rs:813`).

> **Decision Point — create the `FocusHandle` once.**
> `ConsoleView` stores `focus_handle` and focuses it on window open (`main.rs:162`). The code comment (`app.rs:435`) records the bug it fixes: *"Recreating it per render … meant nothing stayed focused, so the keyboard nav never received key events."* **Take this:** one handle, created in the constructor, never in `render`.

**Zoom** is `Tab::zoomed: Option<PaneId>` (`app.rs:133`); `toggle_zoom` (`app.rs:517`) flips it; the renderer paints only that pane when set. **Focus** is a single `PaneId` in the `Workspace`. Both are data, both are trivially testable.

**The leader-key state machine** (`leader_command`, `app.rs:573`) maps a key after `Ctrl-A` onto a mux verb: `|`/`-` split, `x` close, `o`/`O` focus cycle, `=`/`_` resize, `z` zoom, `w`/`[`/`]` tabs, `g` theme flip, and any nav key → `swap_surface`. **This is the keyboard layer the interaction model demotes** (harbor-interaction-model §2: *"the chord becomes the fast path, not the required path"*) — the Quay/click-to-board and ⌘K Helm are the [planned] discoverable layer that sit *on top of these same verbs*. Crucially: the future mouse-first layer reuses `bind_entity`/`swap_surface`/`split`, it does not replace them.

---

## 7. The add-pane picker

The interaction model's ⌘K Helm is [planned]; the **shipping** picker is the `AddPane` command line, and it is the template for the Helm. Flow:

1. `Ctrl-A i` arms `CommandLine { kind: CmdKind::AddPane }` (`app.rs:606`). `CmdKind` (`app.rs:48`) enumerates the open command lines (`Spawn`, `Cartographer`, `DispatchReject`, `AddPane`).
2. Keystrokes feed `handle_command_key` (`app.rs:620`) into the buffer (case-preserving via `keystroke.key_char`).
3. Enter calls `submit_command` (`app.rs:653`). `AddPane` is a **purely local** UI mutation — no daemon round-trip (`app.rs:661`): it resolves the typed name and splits.
4. `surface_for_query` (`app.rs:93`) is the resolver: `editor <path>` / `e <path>` → `SurfaceKind::Editor` (`app.rs:97`); `chat` → `CartographerChat`; `files`/`tree` → `FileTree`; otherwise a case-insensitive **prefix match** over `NAV` (`app.rs:116`) → `surface_for_nav_id`.

> **Anti-Pattern — keyword-NLP in the picker.**
> **Symptom:** matching a typed surface name with a hand-rolled list of synonyms / substring soup. **Detection:** an array of "if it contains 'cost' or 'money' or 'spend'…". **Fix:** `surface_for_query` uses **structured prefix match over a closed `NAV` table** (`app.rs:116`) — a controlled enum of ids/keys/labels, not free-text classification. When the Helm grows fuzzy search (interaction model §4), it stays a *subsequence scorer over the same structured action list* — explicitly *"structured action list, not free-text NLP."* Never reach for keyword soup.

---

## 8. Adding a new surface, end to end

The recipe, using a hypothetical **Diff** surface (the battle plan's P3 review view) as the worked example. It exercises every layer.

**Decide first:** does it need a dedicated `SurfaceKind`, or does it route through `Panel { nav }`?
- Distinct interaction or data source (Diff scrolls hunks, reads a daemon diff) → **dedicated variant**.
- Just "render blocks the background thread fetched" → **`Panel { nav: "diff" }`**, skip steps 1–2.

For a dedicated variant:

**1. Add the variant** to `SurfaceKind` (`mux.rs:33`) and its arm in `label()` (`mux.rs:64`). If it carries an entity, extend `bind_entity` (`mux.rs:282`). Add a `mux.rs` unit test mirroring `split_into_editor_focuses_the_new_editor_pane` (`mux.rs:463`).

```rust
// mux.rs
Diff { left: String, right: String },
// label():
SurfaceKind::Diff { left, right } => format!("diff {left}…{right}"),
```

**2. Implement the data surface** as a `Pane` in a new `diff_pane.rs`, mirroring `editor.rs`:
- `view()` → `Vec<Block>` (use `Tone::Conflicted` for clashing hunks).
- `refresh()` → pull the diff (disk, or daemon for a server-computed diff). If it reads disk like `EditorPane`, the `&DaemonClient` arg is unused; if it streams, override `subscription()`/`on_stream` like `LanePane`.
- Override `mutate` **only** if the operator can act on it (e.g. stage a hunk → a new `SurfaceAction` variant, `pane.rs:60`).

**3. Register it** in `main.rs`:
- If it's a NAV-slot surface: add a `NavItem` to `NAV` (`app.rs:150`), construct it in the background thread (`main.rs:193`), `refresh()` it in the loop (`main.rs:256`), and push `(slot, view())` into the `all` vec (`main.rs:299`). Bump the slot comment block (`main.rs:174`).
- If it's a per-key surface like `Editor` (constructed on demand from its `SurfaceKind` data): teach `blocks_for_surface` to build it synchronously (`app.rs:554`), exactly as the `Editor` arm does.

**4. Wire creation paths** — how does a user open it?
- Picker: add a prefix to `surface_for_query` (`app.rs:93`), e.g. `diff <a> <b>`.
- Leader key: add an arm to `leader_command` (`app.rs:573`) if it deserves a chord.
- Direct manipulation: like the FileTree-click → Editor split (`app.rs:1112`–`1122`), where clicking a file does `ws_mut().split(Dir::Row, SurfaceKind::Editor { path, region: None })`.

**5. Operator actions** (optional) — if the surface mutates the world, add a `ControlMsg` variant (`app.rs:33`), send it from the render closure, and drain+perform it in `main.rs` (`main.rs:225`). Show a `control_flash` (`app.rs:443`) for feedback.

**6. Render-agnostic check** — because the surface emits only `Block`s, the ratatui face (`term.rs`) paints it for free. Verify with a `view()` unit test (no gpui needed), the way `editor.rs:204` and `:248` do.

**Quote the recipe back to yourself:** the editor was added by exactly this path, and its `mux.rs` tests (`:463`, `:475`) plus its `Pane` tests (`editor.rs:248`) are the regression net. A surface is "done" when it has both.

---

## 9. Quality Gates

A new surface — or any change to the skeleton — ships only when **all** of these are green:

- [ ] **`mux.rs` stays GPUI-free and dependency-free.** No `use gpui` in `mux.rs`; the Linux CI gate compiles it. (`mux.rs:7` is the contract.)
- [ ] **New `SurfaceKind` variant has a `mux.rs` unit test** covering split + label, like `split_into_editor_focuses_the_new_editor_pane` (`mux.rs:463`).
- [ ] **New data surface impls `Pane`, emits only `Block`s, has a `view()` unit test** with no window (`editor.rs:204`).
- [ ] **No blocking I/O on the render thread.** All `refresh`/`mutate` async lives in the `main.rs` background runtime; the foreground only drains channels. (The sole exception — small synchronous file read in `EditorPane::loaded` — is documented and slated to move off-thread once the buffer is a CRDT.)
- [ ] **Operator actions go through `ControlMsg`,** never an `.await` in a closure.
- [ ] **`FocusHandle` is created once,** in the constructor (`app.rs:482`), never in `render`.
- [ ] **Picker matching is structured, not keyword-NLP** — prefix/subsequence over the `NAV`/action table (`app.rs:116`), never a synonym list.
- [ ] **Color is `Tone`, not a literal.** Surfaces emit semantic `Tone` (`pane.rs:16`); only the renderer resolves it via `Theme` (`palette.rs:131`). No raw `0xRRGGBB` in a `Pane`.
- [ ] **Object safety preserved.** New surface verbs are `SurfaceAction` variants (`pane.rs:60`), not generic methods; the registry must still hold `Box<dyn Pane>` (`pane.rs:130`).
- [ ] **Text ≥14px** in any gpui-painted label (sibling `beautiful-gui-design` law; the editor gutter/content paint at `text_size(px(14.0))`, `app.rs:1109`).
- [ ] **Motion/shaders/audio deferred to siblings.** Any easing curve, custom paint, or sound cue is imported from `rust-gpui-motion` / `gpui-shaders` / `sound-design-and-audio`, not written in the app skeleton.

---

## 10. Where the Harbor Editor plugs into this skeleton

To close the loop with the battle plan, the skeleton-to-Harbor map:

| Battle plan (§) | Skeleton seam (today) | What changes |
|---|---|---|
| P0 walking skeleton | `SurfaceKind::Editor` (`mux.rs:46`) + `EditorPane` (`editor.rs`) | **Already shipped** — read-only, disk-backed, both faces. |
| P1 buffer + Loro | `EditorPane`'s backing store | Swap disk `lines` → `LoroDoc`/`LoroText`; gutter colors by PeerID. **Same `Pane` impl, same `Block` output.** |
| P2 LAN multiplayer | `Subscription`/`on_stream` (`pane.rs:71`/`:118`) + the lane SSE pipeline (`main.rs:277`) | Loro Protocol frames ride the existing tube SSE; `on_stream` folds remote ops. |
| P3 claims (the wedge) | `Editor { region }` + `Tone::Conflicted`/`Gated` (`pane.rs:16`) + `ControlMsg` | `region` becomes the claimed range; a `ControlMsg::ClaimRegion` [planned] POSTs the claim; overlap paints a `Conflicted` band. |
| P3.5 salvage | `ControlMsg` + `control_flash` | `ControlMsg::Salvage` [planned] → `/recovery/consume`. |
| Track B viz | a custom-paint `SurfaceKind` hosting a `canvas()`/wgpu pass | Owned by `gpui-shaders`; the skeleton only supplies the leaf. |

The discipline that makes this map cheap is the one this whole doc argues for: **a pure pane tree, one object-safe surface contract, and a two-channel membrane between data and render.** Build those right and the Harbor Editor is assembly, not invention.
