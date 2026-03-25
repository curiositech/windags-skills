---
license: Apache-2.0
name: react-native-architect
description: "React Native 0.76+ architect with New Architecture, Fabric renderer, TurboModules, and production navigation/state patterns. Activate on: React Native app, RN architecture, Fabric, TurboModules, React Navigation, Expo integration, RN performance, native modules. NOT for: web-only React (use frontend-architect), Expo-specific workflows (use expo-workflow-expert), Flutter (use flutter-bloc-state-manager)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - react-native
  - mobile
  - ios
  - android
pairs-with:
  - skill: frontend-architect
    reason: Shared React patterns between web and native
  - skill: expo-workflow-expert
    reason: Expo provides the managed workflow layer on top of React Native
---

# React Native Architect

Expert in building production React Native applications with the New Architecture (Fabric + TurboModules), performant navigation, and scalable state management.

## Decision Points

### State Management Selection
```
Is data persisted across app restarts?
├─ YES: Is it frequently accessed/updated?
│   ├─ YES: MMKV + Zustand (persistent store)
│   └─ NO: AsyncStorage + Context
└─ NO: Is data from server?
    ├─ YES: TanStack Query + optimistic updates
    └─ NO: Local component complexity?
        ├─ Simple: useState/useReducer
        ├─ Cross-component: Zustand
        └─ Atomic updates: Jotai
```

### Animation Strategy Decision
```
Performance requirement?
├─ 60fps critical (UI interactions, gestures)
│   └─ React Native Reanimated 3 (UI thread worklets)
├─ Layout transitions only
│   └─ Fabric's LayoutAnimation API
└─ Simple state changes
    └─ Animated API or CSS transitions
```

### Native Module Architecture
```
Need native functionality?
├─ Existing in community: Use @react-native-community/* package
├─ Simple data access: TurboModule with Codegen spec
├─ Complex native UI: Fabric native component
└─ Heavy computation: JSI module with C++ bridge
```

### Navigation Pattern Selection
```
App complexity?
├─ Single stack: Stack Navigator
├─ Tab + Stack: Nested navigators with typed routes
├─ Drawer + Tabs: Bottom Tabs inside Drawer
└─ Complex routing: Expo Router with file-based routing
```

## Failure Modes

### Symptom: App crashes on startup after RN upgrade
**Detection**: `Unable to resolve module`, `ViewManager not found`, or native crashes
**Diagnosis**: New Architecture compatibility issues
**Fix**: 
1. Check `react-native.config.js` for New Architecture flag
2. Run `cd ios && pod install --repo-update`
3. Clean build: `npx react-native clean && cd ios && xcodebuild clean`
4. Migrate incompatible libraries to New Architecture versions

### Symptom: Memory leaks and increasing RAM usage
**Detection**: Memory profiler shows steady climb, app killed by OS
**Diagnosis**: Bridge reference leaks between JS and native
**Fix**:
1. Profile with React Native DevTools memory tab
2. Remove global listeners in useEffect cleanup
3. Check for retain cycles in native module callbacks
4. Use WeakMap for native object references

### Symptom: Sluggish animations and frame drops
**Detection**: Performance monitor shows JS thread >16ms, dropped frames
**Diagnosis**: Animations running on JS thread instead of UI thread
**Fix**:
1. Migrate to Reanimated 3 worklets: `useAnimatedStyle`
2. Avoid state updates during animation
3. Use `runOnUI()` for expensive calculations
4. Profile with Flipper or React Native Performance tab

### Symptom: Slow app startup (>3 seconds)
**Detection**: Time to Interactive profiling, user complaints
**Diagnosis**: Bundle size or initialization bottlenecks
**Fix**:
1. Enable Hermes: check `HermesInternal` exists
2. Lazy load screens: `React.lazy()` with Suspense
3. Profile with `react-native-performance`
4. Split large bundle with Metro's async chunks

### Symptom: Navigation state lost on app backgrounding
**Detection**: Users return to wrong screen, navigation stack corrupted
**Diagnosis**: Missing navigation state persistence
**Fix**:
1. Add `NavigationContainer` state persistence
2. Implement deep linking with proper route matching
3. Use `getStateFromPath`/`getPathFromState` for URL sync
4. Test with device Developer Settings background app limits

## Worked Example

### Large Payload Handling: TurboModule vs Bridge Performance

**Scenario**: Displaying 10MB product catalog with images, filtering, and real-time updates.

**Decision Process**:
1. **Data Transfer**: 10MB JSON over old bridge = 3-5s blocking
   - **TurboModule approach**: Stream data in chunks via JSI
   - **Alternative**: Compressed transfer + background parsing

2. **State Strategy**: 
   - **Initial**: Redux with 10MB in memory → OOM on older devices
   - **Optimized**: Virtualized list + TanStack Query with pagination
   - **Implementation**:
   ```typescript
   // TurboModule for efficient data transfer
   const productData = await ProductCatalog.getChunkedData(chunkSize: 1000);
   
   // Virtualized rendering
   <FlashList
     data={products}
     estimatedItemSize={120}
     renderItem={({ item }) => <ProductCard product={item} />}
     onEndReached={() => fetchNextPage()}
   />
   ```

3. **Performance Trade-offs**:
   - TurboModule: 300ms load time, but requires native implementation
   - Bridge + pagination: 800ms initial + smooth scrolling
   - **Expert choice**: Hybrid - TurboModule for critical data, pagination for detailed views

4. **What novice misses**: 
   - Loading entire dataset into memory causes crashes
   - Not measuring actual JS thread impact
   - Missing incremental loading UX patterns

5. **Expert optimization**:
   - Preload next chunk during scroll deceleration
   - Implement optimistic updates for real-time changes
   - Use MMKV for instant app restart with cached data

## Quality Gates

- [ ] New Architecture enabled (check `newArchEnabled: true` in config)
- [ ] Hermes engine active (verify `global.HermesInternal` exists)
- [ ] Navigation routes fully typed with TypeScript route params
- [ ] All lists >50 items use FlashList instead of FlatList
- [ ] Critical animations use Reanimated 3 worklets (60fps target)
- [ ] Server state managed with TanStack Query (no Redux for API calls)
- [ ] Local persistence uses MMKV for performance-critical data
- [ ] App bundle size under target (<30MB APK, <50MB IPA)
- [ ] Cold start time <2s on mid-tier device (measured with profiler)
- [ ] Memory usage stable under 100MB during normal operation
- [ ] All native modules have New Architecture compatibility
- [ ] Deep linking configured with URL scheme and universal links

## Not-For Boundaries

**Web-only React development** → Use `frontend-architect` instead
- React Native patterns don't apply to DOM/browser APIs
- Navigation libraries are completely different

**Expo managed workflow specifics** → Use `expo-workflow-expert` instead
- EAS Build configuration, Expo modules, OTA updates
- This skill focuses on bare React Native + New Architecture

**Cross-platform mobile strategy** → Use `flutter-bloc-state-manager` for Flutter
- Different architecture patterns, native bridge approaches

**React Native <0.70** → Use legacy React Native skills
- Old Architecture patterns, different performance considerations