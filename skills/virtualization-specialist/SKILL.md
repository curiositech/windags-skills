---
license: Apache-2.0
name: virtualization-specialist
description: 'Implement high-performance list virtualization for 100K+ item datasets using TanStack Virtual and react-window. Activate on: large lists, infinite scroll, windowing, virtual scroll, table with 1000+ rows. NOT for: lists under 100 items (use standard map), pagination-only (use data-fetching-strategist).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: DevOps & Infrastructure
tags:
  - virtualization
  - tanstack-virtual
  - infinite-scroll
  - performance
  - windowing
pairs-with:
  - skill: react-performance-optimizer
    reason: Virtualization is one pillar of React perf -- combine with memoization and code splitting
  - skill: data-fetching-strategist
    reason: Infinite scroll needs cursor-based pagination and prefetching strategies
---

# Virtualization Specialist

Render 100K+ item lists and tables at 60fps by only mounting visible DOM nodes using TanStack Virtual, react-window, and custom windowing.

## Decision Points

### Library Choice Decision Tree
```
Dataset size + requirements?
├─ 100-1000 items, fixed height → react-window (FixedSizeList)
├─ 1000-10K items, variable height → react-virtuoso (auto-sizing)
├─ 10K+ items, need full control → TanStack Virtual
└─ Grid with 1M+ cells → TanStack Virtual 2D + column virtualization

Content type?
├─ Chat messages (variable height) → TanStack Virtual + measureElement
├─ Data table (fixed columns) → TanStack Virtual + TanStack Table
├─ Image gallery (uniform grid) → react-window GridList
└─ File explorer (tree structure) → TanStack Virtual + custom expand/collapse
```

### Overscan Tuning Heuristics
```
Scroll behavior pattern?
├─ Smooth scrolling (trackpad) → overscan: 3-5 items
├─ Fast scroll/keyboard → overscan: 8-15 items  
├─ Mobile touch scroll → overscan: 5-8 items
└─ Programmatic scroll-to-index → overscan: 2-3 items

Performance constraints?
├─ Mobile/low-end device → Lower overscan (3-5), prioritize memory
├─ Desktop/high-end → Higher overscan (10-15), prioritize smoothness
└─ Slow render time per item → Reduce overscan to minimize work
```

### Height Strategy Selection
```
Content predictability?
├─ Known fixed height → estimateSize: () => FIXED_HEIGHT
├─ Predictable range → estimateSize: (index) => getEstimatedHeight(items[index])
├─ Completely dynamic → measureElement + estimateSize fallback
└─ Mixed content types → Conditional measureElement based on item type
```

## Failure Modes

**Flickering White Space**
- Symptoms: Blank areas appear during scroll, especially fast scrolling
- Diagnosis: `overscan` too low or `estimateSize` severely underestimating
- Fix: Increase overscan to 8-12 items, improve height estimation accuracy

**Scroll Position Jumping**
- Symptoms: List jumps when new data loads, scroll position resets unexpectedly  
- Diagnosis: Items shifting during data updates, height recalculation triggering layout
- Fix: Use stable keys, implement `scrollMargin` preservation, batch height updates

**Memory Bloat Over Time**  
- Symptoms: Browser memory increases indefinitely, eventual crash on long usage
- Diagnosis: Item state not cleaning up, event listeners persisting, measurement cache growing
- Fix: Implement cleanup in item components, clear measurement cache periodically

**Infinite Fetch Loop**
- Symptoms: Network requests firing continuously, UI unresponsive
- Diagnosis: `hasNextPage` logic broken or fetch trigger too aggressive  
- Fix: Add loading guards, increase distance threshold for fetch trigger (5+ items from end)

**Keyboard Navigation Breaking**
- Symptoms: Tab/arrow keys don't work, focus lost when scrolling
- Diagnosis: Focus target unmounted due to virtualization, no focus management
- Fix: Implement `scrollToIndex` on focus, maintain focus state outside virtualizer

## Worked Example

**Scenario**: Chat app with 50K messages, variable heights (text + images)

**Novice approach**: Renders all 50K messages → 7-second load time, browser freeze
```javascript
// ❌ Renders everything
messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
```

**Expert reasoning**:
1. **Size assessment**: 50K items × ~80px avg = 4M pixels tall → virtualization required
2. **Library choice**: Variable heights + need control → TanStack Virtual + measureElement  
3. **Overscan tuning**: Chat = smooth scrolling pattern → overscan: 5 items
4. **Height strategy**: Text+images = unpredictable → measureElement required
5. **Infinite scroll**: Implement fetch trigger at 90% of current data

**Implementation**:
```javascript
const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => parentRef.current,
  estimateSize: (index) => {
    const msg = messages[index];
    return msg.type === 'image' ? 200 : 60; // Better estimation
  },
  overscan: 5,
  measureElement: (el) => el?.getBoundingClientRect().height ?? 60,
});

// Expert catches: stable keys, position preservation, loading states
```

**Expert catches vs novice misses**:
- Stable unique keys (novice uses array index)
- Height estimation based on content type (novice uses fixed 50px)
- Loading state during fetch (novice shows blank space)
- Scroll position preservation on new data (novice loses position)

## Quality Gates

- [ ] DOM node count < 100 regardless of dataset size (verify in DevTools Elements)
- [ ] Scroll maintains 60fps with no >16ms frames (check Performance tab)
- [ ] Overscan 5-10 items prevents white flash during normal scrolling speed
- [ ] Height estimation within 20% of actual (measure accuracy via logs)
- [ ] Infinite scroll triggers when 5+ items from end, not at exact bottom
- [ ] Scroll position preserved when new data loads (no jumping)
- [ ] Loading indicator shows during fetch (never blank space)
- [ ] Memory usage stable over 10-minute usage session (no leak)
- [ ] Keyboard navigation works: arrow keys + tab move through items
- [ ] Screen readers announce correct item position and total count

## NOT-FOR Boundaries

**Don't virtualize these cases:**
- Lists under 100 items → Use standard `.map()` rendering
- Server paginated tables → Use `data-fetching-strategist` with page-based nav
- Canvas-based grids → Use dedicated canvas libraries (e.g., Luckysheet, x-spreadsheet)
- Simple dropdowns/selects → Use browser native or headless UI libraries

**Delegate instead:**
- For complex table features → Use `data-table-architect` skill
- For real-time updates → Use `real-time-sync-engineer` skill  
- For accessibility compliance → Use `accessibility-specialist` skill
- For mobile touch optimization → Use `mobile-performance-optimizer` skill