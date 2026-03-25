---
license: Apache-2.0
name: large-scale-map-visualization
description: Master of high-performance web map implementations handling 5,000-100,000+ geographic data points. Specializes in Leaflet.js optimization, Supercluster algorithms, viewport-based loading, canvas rendering, and progressive disclosure UX patterns.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch
category: Data & Analytics
tags:
  - maps
  - visualization
  - geospatial
  - large-scale
  - interactive
---

# Large-Scale Map Visualization Expert

Master of high-performance web map implementations handling 5,000-100,000+ geographic data points. Specializes in Leaflet.js optimization, spatial clustering algorithms, viewport-based loading, and progressive disclosure UX patterns for map-based applications.

## Decision Points

### Data Volume Routing
```
Dataset Size Assessment:
├─ 0-100 markers
│  └─ Use vanilla Leaflet (no optimization needed)
├─ 100-1,000 markers
│  └─ Use basic clustering (react-leaflet-cluster)
├─ 1,000-10,000 markers
│  └─ Use Supercluster + viewport loading
├─ 10,000-50,000 markers
│  └─ Use Supercluster + canvas + sampling
├─ 50,000-500,000 markers
│  └─ Use Web Workers + server-side clustering
└─ 500,000+ markers
   └─ Use MVT tiles + backend pre-aggregation
```

### Performance Architecture Selection
```
If zoom level < 9:
├─ Apply server-side sampling (20% random sample)
├─ Use large cluster radius (100px)
└─ Minimum 5 points per cluster

If zoom level 9-14:
├─ Use viewport-based loading
├─ Medium cluster radius (75px)
└─ Minimum 2 points per cluster

If zoom level > 14:
├─ Load all points in viewport
├─ Small cluster radius (50px)
└─ Show individual markers with labels
```

### Rendering Strategy Decision
```
If mobile device detected:
├─ Enable canvas renderer (preferCanvas: true)
├─ Disable animations (zoomAnimation: false)
└─ Use 500ms debounce on map events

If desktop:
├─ Use SVG renderer for better quality
├─ Enable animations for smooth UX
└─ Use 300ms debounce on map events
```

## Failure Modes

| Anti-Pattern | Symptom | Detection Rule | Fix |
|-------------|---------|----------------|-----|
| **DOM Explosion** | UI freezes on pan/zoom, browser tab crashes | If >1000 DOM markers rendered simultaneously | Implement clustering with maxZoom: 16, radius: 75px |
| **Query Flooding** | Network tab shows continuous requests during pan | If API calls triggered on every pixel movement | Add 300ms debounce to map move events |
| **Memory Leak** | Map gets slower over time, RAM usage grows | If clusters array keeps growing without cleanup | Clear previous clusters before setting new ones |
| **Zoom Overload** | Markers too dense at high zoom | If cluster radius same at all zoom levels | Use progressive radius: zoom<10 ? 100 : zoom<14 ? 75 : 50 |
| **Mobile Meltdown** | App unusable on mobile devices | If frame rate <20fps on 4G device | Enable canvas renderer, disable animations, increase debounce to 500ms |

## Worked Examples

### Scenario: 50,000 Restaurant Locations

**Initial State**: Client reports map freezing with 50k restaurants loaded at once.

**Step 1 - Assess Data Volume**
- 50k points → Falls in "Web Workers + server-side clustering" tier
- Need viewport loading + Supercluster + sampling strategy

**Step 2 - Implement Viewport Loading**
```tsx
// Database function with zoom-based sampling
CREATE FUNCTION find_restaurants_in_viewport(
  min_lng DOUBLE PRECISION, min_lat DOUBLE PRECISION,
  max_lng DOUBLE PRECISION, max_lat DOUBLE PRECISION,
  zoom_level INTEGER
) 
RETURNS TABLE (id UUID, name TEXT, lat DOUBLE PRECISION, lng DOUBLE PRECISION) AS $$
BEGIN
  IF zoom_level < 9 THEN
    -- Sample 10% for performance
    RETURN QUERY SELECT r.id, r.name, ST_Y(r.geog), ST_X(r.geog)
    FROM restaurants r 
    WHERE r.geog && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    AND random() < 0.1 LIMIT 1000;
  ELSE
    -- Full data at higher zoom
    RETURN QUERY SELECT r.id, r.name, ST_Y(r.geog), ST_X(r.geog)
    FROM restaurants r 
    WHERE r.geog && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    LIMIT 5000;
  END IF;
END; $$ LANGUAGE plpgsql;
```

**Step 3 - Configure Supercluster with Zoom-Adaptive Settings**
```tsx
const getClusterOptions = (zoom: number) => ({
  radius: zoom < 10 ? 120 : zoom < 14 ? 80 : 60,
  maxZoom: 16, // Stop clustering at street level
  minPoints: zoom < 10 ? 10 : 3 // More aggressive clustering at low zoom
});
```

**Step 4 - Add Canvas Rendering for Mobile**
```tsx
const mapOptions = {
  preferCanvas: true,
  renderer: L.canvas({ tolerance: 15, padding: 0.3 }),
  zoomAnimation: !isMobile,
  fadeAnimation: !isMobile
};
```

**Expert vs Novice Decisions**:
- **Novice**: Would try to cluster all 50k points client-side → UI freeze
- **Expert**: Recognizes need for server-side sampling based on zoom level
- **Novice**: Uses same cluster settings at all zoom levels → poor UX
- **Expert**: Implements progressive disclosure with zoom-adaptive clustering

**Result**: Map loads in <500ms, smooth panning at 60fps, handles zoom from world view to street level.

## Quality Gates

Performance and functionality checklist for map optimization completion:

- [ ] **Pan Latency**: Map responds to pan gestures within 200ms
- [ ] **Initial Load**: First markers visible within 500ms of page load
- [ ] **Memory Usage**: Heap size stable during 5 minutes of interaction
- [ ] **Cluster Density**: No more than 50 visible clusters at any zoom level
- [ ] **Mobile Performance**: 30+ FPS on 4G-throttled mobile device
- [ ] **Viewport Loading**: Only requests data for current map bounds
- [ ] **Progressive Disclosure**: Cluster radius adapts to zoom level (3+ different settings)
- [ ] **Error Handling**: Graceful fallback when API requests fail
- [ ] **Touch Interaction**: Cluster expansion works on mobile tap
- [ ] **Zoom Boundaries**: Clustering stops at appropriate street-level zoom (14-16)

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Static map images** → Use Mapbox/Google Static Maps API instead
- **3D visualizations** → Use Maplibre GL JS or Cesium instead  
- **Non-geographic data** → Use D3.js force simulation or Chart.js instead
- **Simple maps (<100 markers)** → Vanilla Leaflet is sufficient
- **Real-time tracking** → Use WebSocket + canvas animation patterns instead
- **Heatmaps** → Use Leaflet.heat plugin or deck.gl HeatmapLayer instead
- **Vector tile rendering** → Use Maplibre GL JS with PMTiles instead

**Delegate to other skills:**
- For database optimization → Use `database-performance-tuning`
- For React performance → Use `react-optimization` 
- For API design → Use `rest-api-design`
- For mobile UX → Use `mobile-first-design`