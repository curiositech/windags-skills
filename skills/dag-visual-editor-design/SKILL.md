---
license: BSL-1.1
name: dag-visual-editor-design
version: 1.0.0
description: Design modern, intuitive DAG/workflow visual editors that feel like LEGO, not LabView
category: Agent & Orchestration
tags:
  - dag
  - visual-editor
  - design
  - ui
  - graph-editing
trigger_phrases:
  - design dag editor
  - workflow builder ui
  - node graph ux
  - visual programming interface
  - make dag editor intuitive
allowed-tools:
  - Read
  - Write
  - Edit
  - WebSearch
  - WebFetch
---

# DAG Visual Editor Design

Design modern, intuitive DAG and workflow visual editors following the LEGO philosophy: snap blocks together simply rather than wire complex ports.

## DECISION POINTS

### Layout Algorithm Selection

```
Node Count < 20 AND Simple Flow?
├─ YES → Force-directed layout (React Flow default)
│         • Fast rendering
│         • Good for exploring connections
│
└─ NO → Node Count > 100?
    ├─ YES → Hierarchical (Dagre) + Virtualization
    │        • Set viewport culling
    │        • Lazy load node details
    │
    └─ NO → Branch Factor > 3 per node?
        ├─ YES → ELK Layered Algorithm
        │        • Handles complex routing
        │        • Minimizes edge crossings
        │
        └─ NO → Dagre LR (Left-Right)
                • Standard choice
                • rankdir: 'LR', ranksep: 80
```

### Node Connection Strategy

```
Data Type Diversity?
├─ Single type (e.g., JSON) → Implicit connections
│   • No handles visible by default
│   • Snap zones on hover
│
├─ 2-3 types → Color-coded handles
│   • Red: Error streams
│   • Blue: Data streams  
│   • Green: Success/completion
│
└─ 4+ types → Bundled connections
    • Group related channels
    • Label bundles clearly
    • Consider type coercion nodes
```

### Editing Mode Selection

```
User Skill Level?
├─ Beginner → Canvas + Sidebar
│   • Drag nodes from categorized list
│   • Template-based workflows
│
├─ Intermediate → Quick Add (Slash Commands)
│   • Type "/" for node search
│   • Context-aware suggestions
│
└─ Expert → Keyboard First
    • Hotkeys for common nodes
    • Text-based node creation
    • Batch operations
```

## FAILURE MODES

### Spaghetti Graph Syndrome
**Symptoms:** Edges crossing everywhere, impossible to follow data flow, users getting lost
**Detection:** If >30% of edges cross other edges, or users spend >20s tracing a path
**Fix:** 
- Force hierarchical layout (Dagre/ELK)
- Add intermediate junction nodes to break long connections
- Implement edge bundling for parallel data flows

### Zoom Desert Problem
**Symptoms:** Pan/zoom feels broken, users can't find their content, minimap unhelpful
**Detection:** Users hitting zoom limits frequently, >5 seconds to locate nodes after navigation
**Fix:**
- Implement fit-to-view on double-click background
- Add breadcrumb navigation for nested groups
- Set proper zoom bounds: min 0.1x, max 3x
- Show node labels at all zoom levels >0.5x

### Handle Ambiguity Confusion
**Symptoms:** Users connecting wrong ports, type errors, unexpected data flow
**Detection:** >20% connection error rate, frequent undo of connections
**Fix:**
- Show handle compatibility on hover (green=valid, red=invalid)
- Add connection preview with data type labels
- Implement smart handle snapping within 20px radius

### Performance Cliff Rendering
**Symptoms:** Editor freezes with >50 nodes, stuttering during pan/zoom
**Detection:** Frame rate drops below 30fps, render times >100ms
**Fix:**
- Enable React Flow viewport culling
- Virtualize node lists in sidebar
- Debounce layout recalculation (300ms delay)
- Cache node measurements between renders

### No-Feedback Execution Black Box
**Symptoms:** Users don't know if workflow is running, what failed, or why it stopped
**Detection:** Users asking "is it working?" or clicking run button multiple times
**Fix:**
- Animate edges during execution (flowing dots)
- Add node status indicators: idle/running/success/error
- Show execution time and data throughput
- Highlight current execution path

## WORKED EXAMPLES

### Example: Data Processing Pipeline Editor

**Scenario:** Design editor for CSV → Transform → Database pipeline

**Step 1: Choose Layout**
- 5 nodes total, linear flow → Use Dagre LR
- Set `rankdir: 'LR'`, `ranksep: 120` for readable spacing

**Step 2: Design Node Structure**
```tsx
const TransformNode = ({ data }) => (
  <div className="w-64 border-2 border-gray-200 rounded-lg bg-white">
    <div className="bg-blue-50 px-3 py-2 border-b">
      <h3>🔄 Transform Data</h3>
    </div>
    <div className="p-3">
      <div className="text-sm">Filter: {data.filter}</div>
      <div className="text-sm">Sort: {data.sort}</div>
    </div>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);
```

**Step 3: Connection Logic**
- Single data type (tabular) → One handle per side
- Show preview of first 3 rows on edge hover
- Animate data flow during execution

**Novice Miss:** Would add separate handles for each column
**Expert Catch:** Keeps single connection, shows column mapping in node detail

## QUALITY GATES

- [ ] Pan latency <50ms (measure with performance.now())
- [ ] Zoom smoothness: no frame drops during scroll zoom
- [ ] Handle discoverability: New users find connection points within 30s
- [ ] Edge routing: <20% of edges cross other edges in auto-layout
- [ ] Node search: Find any node within 3 keystrokes
- [ ] Execution feedback: Status visible during all async operations
- [ ] Mobile usability: Touch targets ≥44px, pinch zoom works
- [ ] Undo reliability: Can undo/redo any operation without corruption
- [ ] Save performance: Workflow JSON serialization <500ms for 100 nodes
- [ ] Error clarity: Failed connections show specific reason (type mismatch, circular reference)

## NOT-FOR Boundaries

**Don't use DAG editors for:**
- **Text-heavy content** → Use document editors instead
- **Real-time collaboration** → Use [collaborative-editing] skill for conflict resolution
- **Complex mathematical expressions** → Use formula builders instead
- **Timeline-based workflows** → Use [gantt-chart-design] for scheduling
- **State machines with loops** → Use dedicated state diagram tools

**Delegate to other skills:**
- **Performance optimization** → Use [react-performance-optimization] for >1000 nodes
- **Accessibility compliance** → Use [web-accessibility] for screen reader support
- **Animation design** → Use [micro-interactions] for execution visualizations