# WinDAGs V3 — Visualization Specification

**Document type**: Frontend engineering specification
**Status**: Authoritative (supersedes any prior visualization sketches)
**Source ADRs**: ADR-028, ADR-029, ADR-030, ADR-031
**Addresses**: Design Lead blocking concerns, Sci-Fi Engineer scale blocking concern

---

## 1. Tech Stack

### Core Libraries

| Library | Version | Role |
|---------|---------|------|
| ReactFlow | 12+ | Canvas, node/edge rendering, interaction model |
| ELKjs (elkjs) | 0.9+ | Layout computation (layered DAG, hierarchical) |
| React | 18+ | Component framework, concurrent features |
| TypeScript | 5+ | Type safety; all visual state types are exported |
| Framer Motion | 11+ | Wave transition animations, node state changes |
| Recharts | 2.x | Quality radar charts inside Quality overlay |
| Zustand | 4+ | Visualization config state (mode, overlays, disclosure level) |

### Why ReactFlow 12+

ReactFlow 12 introduced the `useNodesInitialized` hook and native ELKjs adapter, eliminating the manual layout synchronization that caused flicker in V2. Its virtual renderer handles up to 500 nodes at 60fps in benchmarks on M2 hardware. The `fitView` animation API makes wave transitions smooth. Edge routing is configurable per-edge-type, which is required for distinguishing data-flow edges from contract edges.

### Why ELKjs

ELKjs (Eclipse Layout Kernel for JS) provides the layered Sugiyama algorithm with port constraints — the only open-source JS layout engine that produces consistent DAG orderings when nodes are added mid-execution (vague node expansion). The `elk.layered` algorithm with `FIXED_ORDER` port assignment guarantees parent nodes stay visually stable as child subgraphs expand, which is essential for perceptual continuity during wave transitions.

### Performance Characteristics

- ELKjs runs in a Web Worker, blocking neither the React render thread nor the WebSocket event loop.
- ReactFlow's virtual renderer skips off-viewport nodes; meaningful for 300+ node DAGs.
- Framer Motion uses `will-change: transform` and GPU compositing for pulse/glow animations.
- All WebSocket DAGStateEvents are typed (BC-UX-003); no JSON parsing in the render path.

---

## 2. Four View Modes

### 2.1 Graph Mode (Key: `G`)

**Purpose**: Structural topology and live node states. Default view.

**Layout algorithm**: `elk.layered` with top-to-bottom direction (`elk.direction: DOWN`). Wave boundaries are mapped to ELK layers; all nodes in a wave share a layer. Edges routed as orthogonal segments by default, splines available via preference toggle.

**Node rendering**: Each node is a `NodeRenderer` component (see Section 10). Shape: rounded rectangle (8px radius) for concrete nodes; dashed rectangle for vague/unexpanded nodes. Size: 120px x 48px standard, collapsible to 80px x 32px at label-truncation threshold. Node body contains: status icon (shape + color), label (truncated per scale threshold), and — when Resilience overlay is active — a margin bar in the bottom 4px.

**Edge rendering**: `EdgeRenderer` draws edges as orthogonal routes. Line weight: 1.5px default, 3px for critical-path edges. Data-flow edges: solid. Contract edges: dashed (4px dash, 4px gap). Subscription edges: dotted (2px dot, 6px gap). Animated edges (traveling dot) during live node-to-node data transfer when Coordination overlay is on.

**Interaction model**:
- Click node: opens Detail panel (slide-in from right, 360px wide)
- Hover node: shows margin tooltip (quality margin %, budget margin %, timeout margin %)
- Scroll/pinch: zoom
- Drag canvas: pan
- Double-click node: switches to Detail Mode scoped to that node

**Keyboard shortcuts**:
| Key | Action |
|-----|--------|
| `G` | Switch to Graph mode |
| `F` | Fit graph to viewport |
| `+` / `-` | Zoom in / out |
| `Esc` | Close Detail panel |
| `Tab` | Next node (cycles selection) |
| `1` / `2` / `3` | Switch disclosure level |
| `C` / `R` / `Q` | Toggle Coordination / Resilience / Quality overlay |

**Information visible at L1**: Node label, 4-state status color and shape, wave grouping, edge directionality, aggregate cost ticker (top-right HUD), completion percentage progress bar.

---

### 2.2 Timeline Mode (Key: `T`)

**Purpose**: Temporal parallelism and bottleneck identification.

**Layout algorithm**: Gantt chart. X-axis is wall-clock time (ms, auto-scaled). Y-axis is execution lane (one row per concurrent execution slot). Wave boundaries are vertical dividers with wave labels. Idle gaps between batches are visually distinct (hatched fill, `#E8E8E8` light / `#2A2A2A` dark).

**Node rendering**: Horizontal bars spanning start-to-end timestamps. Height: 28px per lane. Bar color matches 4-state vocabulary (L1) or 9-state (L2/L3). Corner radius: 4px. Minimum visible bar width: 8px (clickable even if execution was < 10ms). Retried nodes show a stacked secondary bar in a lighter tint.

**Edge rendering**: Causal dependency arrows drawn as curved connectors between bar endpoints. Shown only when "show dependencies" is toggled (off by default in Timeline to reduce clutter). Line weight 1px, opacity 40%.

**Interaction model**:
- Click bar: opens Detail panel
- Hover bar: shows duration tooltip (start, end, elapsed, skill used)
- Drag horizontal ruler: scrub to a point in time (retrospective mode only; live mode follows real-time)
- Scroll: horizontal pan over timeline

**Keyboard shortcuts**: `T` (enter), `Left`/`Right` (scroll timeline), `Home`/`End` (jump to start/end), `1`/`2`/`3` (disclosure level).

**Information visible at L1**: Execution duration per node, wave boundaries, parallelism lanes, idle gaps, total wall time HUD.

---

### 2.3 Hierarchy Mode (Key: `H`)

**Purpose**: Decomposition structure and provenance.

**Layout algorithm**: `elk.mrtree` (multi-root tree). Root is the original problem statement. Children are the Pass 1 decomposition. Vague node expansions appear as expandable subtrees (collapsed by default, marked with a "+" icon). Method used at each node shown as a secondary label when L2 is active.

**Node rendering**: Box-in-box for collapsed subtrees. Leaf nodes: 100px x 36px. Parent nodes: expand to contain children. Color indicates commitment level: COMMITTED nodes have a navy left border (3px), TENTATIVE nodes amber, EXPLORATORY nodes gray. No animation in Hierarchy mode (static structural view).

**Edge rendering**: Straight lines. Parent-to-child edges are solid gray. "Depends on" cross-tree edges are dashed blue (rare; shown only at L2+).

**Interaction model**:
- Click parent node: collapse/expand subtree
- Click leaf node: opens Detail panel
- Hover: shows method label and commitment rationale

**Keyboard shortcuts**: `H` (enter), `Left`/`Right` (collapse/expand), `Tab` (next node), `1`/`2`/`3` (disclosure level).

**Information visible at L1**: Problem hierarchy, vague vs. concrete distinction, completion status of each subtree (green check on completed subtree roots).

---

### 2.4 Detail Mode (Key: `D`)

**Purpose**: Deep inspection of a single node.

**Layout**: Full-width panel replacing the canvas. `Tab` / `Shift+Tab` cycles between all nodes. Breadcrumb trail shows the node's position in the DAG hierarchy.

**Node rendering**: Not applicable (single-node view). The top card shows: node label, status badge, skill name, duration, cost, aggregate quality bar.

**L1 content**: Status, duration, cost, aggregate quality score, skill used, `layer2_summary` (required field, plain language).

**L2 content** (press `2`): Full quality vector (radar chart, 4-6 dimensions), reasoning trace text, commitment strategy with rationale, evaluation results (Stage 1 pass/fail, Stage 2 channel A/B scores), decomposition provenance ("created by Pass 1 / expanded from vague node X").

**L3 content** (press `3`): Raw LLM input/output text, Thompson sampling parameters (alpha, beta, K-factor), multi-dimensional Elo scores per dimension, cognitive telemetry events table, circuit breaker history, full DAGStateEvent log for this node.

**Keyboard shortcuts**: `D` (enter mode), `Tab`/`Shift+Tab` (next/previous node), `1`/`2`/`3` (disclosure), `Esc` (return to prior mode).

---

## 3. Three Overlay Modes

Overlays are additive layers rendered by `OverlayLayer` (see Section 10) on top of any base view. They do not change layout; they add visual encodings to existing elements.

### 3.1 Coordination Overlay (Toggle: `C`)

**Visual elements added**:
- Animated traveling-dot on edges during active data transfer (dot color matches the sending node's status).
- Edge label badges showing: message count, last transfer timestamp, edge protocol type (data-flow / contract / subscription).
- Contract edges show acceptance/rejection icons at their terminus.
- Subscription edges show a "streaming" indicator (animated horizontal bars) when data is actively flowing.

**Combination with base views**:
- Graph: edge animations run on the existing edge paths.
- Timeline: a "data transfer" row appears above each execution lane showing transfer events as small markers.
- Hierarchy: static (no meaningful combination; overlay is disabled in Hierarchy mode).
- Detail: adds an "Edge Activity" tab to the detail panel.

**Toggle behavior**: Default off. User preference persisted in Zustand + `localStorage`. URL parameter `?overlay=coordination` forces on.

**When to use**: Primarily for debugging inter-node coordination failures. Not useful during normal monitoring.

---

### 3.2 Resilience Overlay (Toggle: `R`)

**Visual elements added**:
- Near-miss borders: nodes with quality margin < 10% get a yellow dashed border (`#F59E0B`). Nodes with timeout margin < 20% get an orange dashed border (`#EA580C`). Both conditions: alternating dash pattern.
- Circuit breaker badges: open breaker = red badge `OPEN` in upper-right of node. Half-open = orange badge `1/2`.
- Failure cascade arrows: red directed arrows overlaid on the graph showing how a failure propagated to downstream nodes. Arrow weight proportional to cascade depth.
- Resilience HUD: bottom-left panel showing aggregate stats (near-miss count, open breakers count, cascade events count).

**Combination with base views**:
- Graph: borders and badges applied to existing node visuals.
- Timeline: near-miss nodes have red/orange bar tint. Circuit breaker events appear as vertical marker lines.
- Hierarchy: subtree roots with stressed children get a health indicator dot (color-coded).
- Detail: "Resilience" tab added showing the full EnvelopeScore breakdown.

**Toggle behavior**: Default ON during live execution (per BC-UX-004), default OFF in retrospective review. User can override and preference is persisted. URL parameter `?overlay=resilience=on|off`.

---

### 3.3 Quality Overlay (Toggle: `Q`)

**Visual elements added**:
- Mini radar charts rendered inside each node (24px x 24px, replaces the status icon area). Radar has 4-6 axes (accuracy, contract_compliance, process_quality, efficiency; plus calibration and robustness when available).
- Progressive/degenerating indicator: a small arrow icon next to the node — up-arrow green for progressive, down-arrow red for degenerating (Lakatosian classification at L2+).
- Floor/Wall/Ceiling/Envelope stacked bar at node bottom (replaces margin bar when Quality overlay is active; both cannot show simultaneously).

**Combination with base views**:
- Graph: radar charts render inside node bounds; nodes auto-expand to 140px x 60px to accommodate.
- Timeline: quality color gradient applied to bar fill (high quality = saturated, low quality = desaturated).
- Hierarchy: quality score shown as numeric label on each node.
- Detail: "Quality" tab expands to full-size radar with dimension labels and trend sparklines.

**Toggle behavior**: Default off. URL parameter `?overlay=quality`.

---

## 4. Node State Visualization

### 4.1 L1 Four-State Vocabulary

The default view collapses nine internal states to four human-facing states. Each state has color, shape, and animation assigned independently so no two states are distinguishable by color alone (WCAG non-text contrast requirement).

| L1 State | Color | Hex | Shape Indicator | Animation | Internal States Mapped |
|----------|-------|-----|-----------------|-----------|------------------------|
| ACTIVE | Blue | `#3B82F6` | Circle (filled) | Radial pulse, 1.5s period | pending, scheduled, running |
| DONE | Green | `#22C55E` | Checkmark (solid) | None (static) | completed, skipped |
| ATTENTION | Amber | `#F59E0B` | Triangle (outlined) | Slow pulse-border, 2s period | paused (human gate), mutated |
| PROBLEM | Red | `#EF4444` | X mark (filled) | Fast flash, 0.8s period | failed, retrying |

All four states use distinct shapes. A user with complete color blindness (monochromacy) or using a grayscale display can distinguish states by shape and animation alone.

**Additional accessibility**:
- All animated states include a `aria-label` attribute updated on state change: "Node X: active", "Node X: needs attention".
- Screen reader announcements for ATTENTION and PROBLEM transitions via a visually-hidden ARIA live region (`aria-live="polite"` for ATTENTION, `aria-live="assertive"` for PROBLEM).
- Reduced-motion media query: animations fall back to static opacity shift when `prefers-reduced-motion: reduce` is set.

---

### 4.2 L2/L3 Nine-State Expansion

When disclosure level is set to L2 or L3, the nine internal states become visible. These are sub-states of the four L1 states.

| Internal State | Parent L1 | Color Hex (light) | Color Hex (dark) | Icon |
|----------------|-----------|-------------------|------------------|------|
| `pending` | ACTIVE | `#BFDBFE` | `#1E40AF` | Clock outline |
| `scheduled` | ACTIVE | `#93C5FD` | `#1D4ED8` | Calendar outline |
| `running` | ACTIVE | `#3B82F6` | `#60A5FA` | Spinner |
| `completed` | DONE | `#22C55E` | `#16A34A` | Checkmark filled |
| `skipped` | DONE | `#86EFAC` | `#15803D` | Checkmark dashed |
| `paused` | ATTENTION | `#A855F7` | `#9333EA` | Pause icon |
| `mutated` | ATTENTION | `#F59E0B` | `#D97706` | Refresh icon |
| `failed` | PROBLEM | `#EF4444` | `#DC2626` | X filled |
| `retrying` | PROBLEM | `#F97316` | `#EA580C` | Refresh + X |

At L2, node tooltip labels use the nine-state vocabulary. At L3, the full `NodeStatus` TypeScript enum value is shown verbatim.

---

## 5. Scale Boundaries

This section addresses the Sci-Fi Engineer's blocking concern: the graph view must not become an unreadable wall of nodes at high node counts.

All thresholds are based on node count at render time (not DAG definition size). Thresholds are checked every time the DAG state updates.

### Threshold Table

| Node Count | Mode Name | Behavior | Drill-Down |
|-----------|-----------|----------|------------|
| 1–50 | Full render | All nodes visible, all labels shown, full animations | N/A |
| 51–150 | Compact render | Labels truncated to 14 characters + ellipsis. Node height reduced to 36px. Minor edge weight reduction (1px). | Click node for full label in tooltip |
| 151–300 | Wave collapse | Completed waves collapse to `WaveContainer` summary blocks (gray rounded rectangle with wave number, completion count, aggregate quality dot). Click to expand any completed wave. Active wave always fully expanded. | Click WaveContainer to expand |
| 301–500 | Hierarchical mandatory | Only the currently active wave is fully expanded. All other waves collapsed to summary blocks. Switching to Timeline or Hierarchy mode is suggested via a non-modal notification bar. | Click any WaveContainer; switch to Hierarchy mode for full structure |
| 500+ | Meta-view | Each wave is rendered as a single large node (80px x 80px hexagon). The graph shows wave-to-wave dependency structure only. Individual nodes not visible in the canvas. Drill-down opens a Hierarchy-mode subpanel. | Click any wave hex to open full wave breakdown in side panel |

### Rendering Changes Per Threshold

**1–50 (Full)**: Default ELKjs layout. All labels rendered. All animations active. Margin bars visible per node.

**51–150 (Compact)**: Labels use CSS text-overflow: ellipsis. ELKjs spacing reduced (`elk.spacing.nodeNode: 20` vs. 30 default). Animations throttled for DONE nodes (pulse removed; only shape + color retained).

**151–300 (Wave collapse)**: `WaveContainer` components replace completed wave nodes. Each container renders: wave number, node count, completion percentage, aggregate status (healthiest/worst node color). Click opens an in-place accordion expanding that wave's nodes. Only one wave can be expanded at a time to prevent overcrowding.

**301–500 (Hierarchical mandatory)**: WaveContainers are the primary UI. Active wave nodes render inside a highlighted container with a bright border (`#3B82F6`, 2px). A persistent banner reads: "Showing 1 of N waves expanded. Switch to Hierarchy mode for full structure." ELKjs re-layout runs only on wave transitions (not per node update).

**500+ (Meta-view)**: Wave hexagons are arranged in a force-directed layout (ELKjs `elk.force`). Hexagon color is the worst-case status of any node in the wave. Clicking a hexagon opens a right-panel subview showing the Hierarchy-mode breakdown for that wave's nodes only.

### User Navigation

At all thresholds above 50 nodes, a breadcrumb trail at the top of the canvas shows: `Full DAG > Wave N > Node ID` as the user drills down. Pressing `Esc` at any level goes up one level in the breadcrumb.

---

## 6. Wave Transition Animations

Wave transitions are the highest-visibility animation in the system. They must feel deliberate, not jarring. The Design Lead identified wave transition animation design as a blocking concern.

### Core Parameters

| Parameter | Value |
|-----------|-------|
| Transition duration | 300ms |
| Easing function | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` (ease-out-cubic) |
| Animation library | Framer Motion `layout` prop + `AnimatePresence` |
| Reduced-motion fallback | Instant opacity crossfade, no motion |

### Expand-In-Place Behavior

When a vague node expands into a subgraph:

1. The vague node (dashed rectangle) does not disappear. It morphs into a `WaveContainer` outline (the parent outline persists; this is the "perceptual anchor").
2. Child nodes fade in from opacity 0 to 1, scaling from 0.8 to 1.0, over 300ms with ease-out-cubic.
3. The ELKjs re-layout runs in the Web Worker during the first 100ms of the animation. Layout results are applied at T=100ms, animating to the new positions over the remaining 200ms.
4. Edges to/from the expanded node reroute smoothly using ReactFlow's animated edge path interpolation.

### Ghost Node Fade-In

When a vague node first becomes visible (before expansion), it is rendered as a "ghost": dashed border, 50% opacity, no label text (only a "?" icon). This distinguishes unexpanded vague nodes from concrete pending nodes. When expansion triggers, the ghost's dashed border animates to solid over 150ms, then the expand-in-place sequence runs.

### Parent Node Outline Persistence

During expansion, the parent vague node's outline remains visible as a subtle gray rounded rectangle (2px dashed, `#9CA3AF`) beneath the expanding children. This persists until the child wave is complete, at which point the parent outline fades out over 200ms. This prevents the visual "disappearing act" that the Design Lead flagged as jarring.

### Wave Completion Collapse

When a wave completes and transitions to WaveContainer (at >150 node threshold):
1. All nodes in the wave simultaneously fade to 60% opacity.
2. Over 300ms, they scale down and translate toward the wave centroid.
3. The WaveContainer block fades in at 300ms as nodes finish collapsing.

---

## 7. Progressive Disclosure in the UI

### Level Switching

| Mechanism | L1 | L2 | L3 |
|-----------|----|----|-----|
| Keyboard | `1` | `2` | `3` |
| URL parameter | `?level=1` | `?level=2` | `?level=3` |
| Stored preference | `localStorage` key `windags_disclosure_level` | same | same |
| Default | Yes (new users) | — | — |

Level preference is per-user, persisted across sessions. URL parameter overrides localStorage (useful for sharing a specific view with a colleague). The URL parameter is stripped from the browser history on unmount to avoid polluting back-stack.

### What Each Level Shows/Hides

**Graph View**:
| Element | L1 | L2 | L3 |
|---------|----|----|-----|
| Node status vocabulary | 4-state | 9-state | 9-state |
| Node labels | Truncated task name | Full task name | Full task name + ID |
| Edge labels | None | Protocol type | Protocol type + message count |
| Technical terminology | None | Skill name, method, commitment strategy | All TypeScript enum values |
| Margin bar | Hidden | Visible on hover | Always visible |

**Timeline View**:
| Element | L1 | L2 | L3 |
|---------|----|----|-----|
| Bar color | 4-state | 9-state sub-colors | 9-state |
| Bar tooltip | Duration, status | + skill, quality score | + all NodeVisualState fields |
| Dependency arrows | Hidden | Visible | Visible + labels |
| Wave boundaries | Wave number | + Wave duration | + Wave planning cost |

**Detail View**:
| Element | L1 | L2 | L3 |
|---------|----|----|-----|
| Quality display | Aggregate bar | Radar chart (vector) | Radar + dimension sparklines |
| Reasoning trace | Hidden | Shown | Shown + raw LLM output |
| Skill info | Skill name | + lifecycle state, Elo | + Thompson parameters (alpha, beta, K) |
| Evaluation | Pass/fail badge | Stage 1 + Stage 2 breakdown | + bias mitigations applied |
| Cognitive telemetry | Hidden | Hidden | Full table |

**L1 language rules** (BC-UX-001): No "BDI", "HTN", "Lakatosian", "Thompson sampling", "PSI score", "Kuhnian", "FORMALJUDGE", or "sycophancy" at L1. These terms appear at L2 and L3 only, with inline tooltips linking to the documentation.

---

## 8. ELKjs Layout Configuration

The following configuration is passed to the ELK layout engine for Graph mode. It is the baseline; individual views may override specific properties.

```typescript
const ELK_LAYERED_CONFIG = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '30',
  'elk.spacing.edgeNode': '15',
  'elk.spacing.edgeEdge': '10',
  'elk.layered.spacing.nodeNodeBetweenLayers': '60',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
  'elk.portConstraints': 'FIXED_ORDER',
  'elk.edgeRouting': 'ORTHOGONAL',          // default; splines available via toggle
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.separateConnectedComponents': 'true',
};

// Compact mode overrides (51-150 nodes)
const ELK_COMPACT_OVERRIDES = {
  'elk.spacing.nodeNode': '20',
  'elk.layered.spacing.nodeNodeBetweenLayers': '40',
};

// Hierarchical mode overrides (301-500 nodes)
const ELK_HIERARCHICAL_OVERRIDES = {
  'elk.algorithm': 'layered',
  'elk.spacing.nodeNode': '15',
  'elk.layered.spacing.nodeNodeBetweenLayers': '30',
  'elk.hierarchyHandling': 'SEPARATE_CHILDREN',
};
```

**Edge routing**: Orthogonal is default for DAGs (cleaner, fewer crossings, more readable at scale). Splines are available as a user preference toggle (`?edges=splines`) for users who prefer organic flow. Splines are forced off above 150 nodes regardless of preference (rendering cost).

**Animation on re-layout**: When ELK produces a new layout (after vague node expansion, mutation, or wave collapse), existing nodes animate from their current position to their new position using ReactFlow's built-in `fitView` with `duration: 300ms`. Nodes that did not change position do not animate. This is achieved by comparing old vs. new position coordinates before triggering layout animation.

---

## 9. Color Palette

### Base Palette

| Token | Light Mode Hex | Dark Mode Hex | Usage |
|-------|---------------|---------------|-------|
| `--wd-bg-canvas` | `#F9FAFB` | `#111827` | Canvas background |
| `--wd-bg-node` | `#FFFFFF` | `#1F2937` | Node fill |
| `--wd-bg-node-hover` | `#F3F4F6` | `#374151` | Node hover state |
| `--wd-bg-panel` | `#FFFFFF` | `#1F2937` | Detail panel background |
| `--wd-bg-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` | Modal overlay |
| `--wd-border-default` | `#E5E7EB` | `#374151` | Node border, panel border |
| `--wd-border-strong` | `#9CA3AF` | `#6B7280` | Wave container border |
| `--wd-text-primary` | `#111827` | `#F9FAFB` | Labels, body text |
| `--wd-text-secondary` | `#6B7280` | `#9CA3AF` | Secondary labels, truncated |
| `--wd-text-code` | `#1F2937` | `#D1FAE5` | L3 raw type dumps |

### Status Colors

| Token | Light Hex | Dark Hex | State |
|-------|-----------|----------|-------|
| `--wd-active` | `#3B82F6` | `#60A5FA` | ACTIVE (blue) |
| `--wd-active-bg` | `#EFF6FF` | `#1E3A5F` | ACTIVE node fill |
| `--wd-done` | `#22C55E` | `#4ADE80` | DONE (green) |
| `--wd-done-bg` | `#F0FDF4` | `#14532D` | DONE node fill |
| `--wd-attention` | `#F59E0B` | `#FCD34D` | ATTENTION (amber) |
| `--wd-attention-bg` | `#FFFBEB` | `#451A03` | ATTENTION node fill |
| `--wd-problem` | `#EF4444` | `#F87171` | PROBLEM (red) |
| `--wd-problem-bg` | `#FEF2F2` | `#450A0A` | PROBLEM node fill |

### Overlay-Specific Colors

| Token | Light Hex | Dark Hex | Usage |
|-------|-----------|----------|-------|
| `--wd-nearmiss-quality` | `#F59E0B` | `#FCD34D` | Near-miss quality border |
| `--wd-nearmiss-timeout` | `#EA580C` | `#FB923C` | Near-miss timeout border |
| `--wd-breaker-open` | `#DC2626` | `#F87171` | Circuit breaker OPEN badge |
| `--wd-breaker-half` | `#EA580C` | `#FB923C` | Circuit breaker HALF_OPEN badge |
| `--wd-cascade-arrow` | `#EF4444` | `#F87171` | Failure cascade arrows |
| `--wd-coordination-dot` | `#A855F7` | `#C084FC` | Traveling coordination dot |
| `--wd-edge-contract` | `#6366F1` | `#818CF8` | Contract edge color |
| `--wd-edge-subscription` | `#0EA5E9` | `#38BDF8` | Subscription edge color |

### Accessibility Compliance

All foreground/background color pairs must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text and non-text UI elements). Verified pairs:

- `--wd-text-primary` on `--wd-bg-node` (light): 16.75:1 (AAA)
- `--wd-active` icon on `--wd-bg-node` (light): 4.5:1 (AA)
- `--wd-problem` badge on white: 4.48:1 — use `#DC2626` in badge context for 4.6:1
- `--wd-attention` on dark `--wd-attention-bg`: verify per implementation; amber on dark brown may need lightening

All interactive focus states use a 3px `outline` in `--wd-active` color, meeting the WCAG 2.2 Focus Appearance criterion.

---

## 10. Component Architecture

The visualization layer is a subtree mounted at `<DAGVisualization>`. It does not depend on any application routing or server state beyond the WebSocket stream and the execution ID.

```
DAGVisualization
├── DisclosureController          # Manages L1/L2/L3 state; reads URL param + localStorage
├── VisualizationToolbar          # Mode switcher (G/T/H/D), overlay toggles, zoom controls
├── DAGCanvas                     # ReactFlow canvas; mounts in Graph and Hierarchy modes
│   ├── NodeRenderer              # Per-node component; receives NodeVisualState
│   │   ├── NodeStatusIcon        # Shape + color + animation for the 4-state or 9-state
│   │   ├── NodeLabel             # Label text; truncates per scale threshold
│   │   ├── MarginBar             # Bottom 4px health bar (Resilience overlay)
│   │   └── QualityMiniRadar      # 24px radar (Quality overlay only)
│   ├── EdgeRenderer              # Per-edge component; handles data-flow / contract / subscription
│   │   └── CoordinationDot       # Traveling animated dot (Coordination overlay)
│   ├── WaveContainer             # Collapsed wave block; shown at 151+ nodes
│   └── OverlayLayer              # Renders overlay-specific elements above all nodes/edges
│       ├── ResilienceOverlay     # Near-miss borders, breaker badges, cascade arrows
│       ├── CoordinationOverlay   # Edge animations, transfer badges
│       └── QualityOverlay        # Radar charts, progressive/degenerating arrows
├── TimelineCanvas                # Gantt chart; mounted in Timeline mode
│   ├── TimelineBar               # Per-node horizontal bar
│   ├── WaveDivider               # Vertical wave boundary lines
│   └── IdleGap                   # Hatched fill for inter-batch idle periods
├── DetailPanel                   # Slide-in panel; mounted when a node is selected
│   ├── L1Summary                 # Status, duration, cost, skill name, layer2_summary
│   ├── L2Detail                  # Quality vector radar, reasoning trace, evaluation
│   └── L3Dump                    # Raw TypeScript types, Thompson params, telemetry
└── HUDLayer                      # Always-on HUD elements (cost ticker, progress bar, breadcrumb)
    ├── CostTicker                # Real-time cost counter
    ├── ProgressBar               # Percentage complete
    └── Breadcrumb                # Navigation trail for drill-down states
```

### Key Component Contracts

**`NodeRenderer`** receives a `NodeVisualState` (typed per BC-UX-003). It never fetches data; all display state flows in via props. It emits `onSelect(nodeId)` and `onHover(nodeId, position)` events upward.

**`DisclosureController`** is a Zustand slice, not a React context. This avoids prop-drilling and prevents unnecessary re-renders of the entire canvas when disclosure level changes. Components opt into the disclosure level via `useDisclosureLevel()` hook.

**`OverlayLayer`** renders as an SVG `<g>` element positioned absolutely over the ReactFlow canvas with `pointer-events: none` (overlays do not intercept clicks; node interaction is handled by `NodeRenderer` beneath).

**`WaveContainer`** manages its own expand/collapse state via local `useState`. It reports expand/collapse events to an analytics hook (`useVisualizationAnalytics`) but does not propagate state upward.

---

## 11. Performance Targets

These targets are non-negotiable for production launch. They are testable via Playwright + Performance Observer in CI.

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Initial render, 100 nodes | < 500ms | Time from WebSocket "execution_started" event to first paint of all nodes |
| ELKjs re-layout, 50 nodes | < 200ms | Time from layout call to ReactFlow `nodesPositioned` event |
| Animation frame rate | 60fps sustained | Playwright `page.metrics()` during 5s pulse animation on 100-node DAG |
| Wave collapse animation | No jank (< 1 dropped frame) | Chrome DevTools trace during 300-node wave completion |
| WebSocket event processing | < 16ms per event | `performance.measure` from event receipt to state update commit |
| Memory (500-node DAG) | < 150MB heap | Chrome `performance.memory.usedJSHeapSize` after full render |
| Detail panel open | < 100ms | Time from click to panel fully visible (no skeleton state) |

### Memory Budget for 500-Node DAGs

- ReactFlow node objects: ~500 × 2KB = 1MB
- ELKjs graph model: ~500 × 1KB = 500KB
- NodeVisualState objects (full L3): ~500 × 4KB = 2MB
- DAGStateEvent history (last 1000 events): ~4MB
- Canvas SVG DOM: ~10MB (primary concern; controlled by virtual rendering)
- Framer Motion animation state: ~2MB
- **Total target**: < 150MB, leaving headroom for browser overhead on typical 8GB machines

### ELKjs Web Worker Strategy

ELKjs layout computation runs in a dedicated Web Worker (`elk-worker.js`). Layout results are `postMessage`'d back to the main thread as a flat `{ nodeId, x, y }[]` array. This prevents layout computation from blocking React's render loop during large re-layouts. The worker is initialized once at `DAGVisualization` mount and kept alive for the session lifetime.

### Virtual Rendering Threshold

ReactFlow's virtual renderer (only rendering nodes/edges in the viewport) is enabled at all times. At 500+ nodes in meta-view, node hexagons are explicitly sized to 80px × 80px to maximize the number of in-viewport nodes, reducing DOM size to typically < 30 rendered elements regardless of total DAG size.

---

*End of Visualization Specification. Next derivative: interaction-spec.md (keyboard-complete interaction model and accessibility audit checklist).*
