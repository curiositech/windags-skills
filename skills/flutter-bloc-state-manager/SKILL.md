---
license: Apache-2.0
name: flutter-bloc-state-manager
description: "Flutter state management expert with BLoC/Cubit, Riverpod, Provider, and Navigation 2.0 (GoRouter). Activate on: Flutter state management, BLoC pattern, Cubit, Riverpod, Provider, GetX, GoRouter, Flutter navigation, flutter_bloc. NOT for: React Native (use react-native-architect), SwiftUI (use swiftui-data-flow-expert), Jetpack Compose (use jetpack-compose-navigation-expert)."
allowed-tools: Read,Write,Edit,Bash(flutter:*,dart:*)
category: Mobile Development
tags:
  - flutter
  - bloc
  - state-management
  - dart
pairs-with:
  - skill: frontend-architect
    reason: Reactive UI patterns shared between Flutter and web frameworks
  - skill: mobile-offline-sync-architect
    reason: State management integrates with offline persistence layer
---

# Flutter BLoC State Manager

Expert in Flutter state management with BLoC/Cubit, Riverpod, GoRouter navigation, and scalable architecture patterns.

## Decision Points

### State Solution Selection Tree

```
1. State Complexity Assessment:
   ├─ Simple data (boolean, enum, single value) 
   │  └─ Use: Cubit with copyWith pattern
   ├─ Event-driven logic (debounce, side effects, audit trail)
   │  └─ Use: BLoC with events/states
   ├─ Global app state with DI
   │  └─ Use: Riverpod StateNotifier
   └─ Widget-scoped state only
      └─ Use: Provider or setState

2. When choosing between BLoC packages:
   ├─ Need testing/debugging tools + state/event separation
   │  └─ flutter_bloc
   ├─ Want compile-time safety + automatic disposal
   │  └─ Riverpod
   ├─ Legacy codebase migration
   │  └─ Provider (then migrate to Cubit)
   └─ Simple state only
      └─ Cubit (via flutter_bloc)

3. Navigation Architecture Decision:
   ├─ Deep linking required OR type safety needed
   │  └─ GoRouter
   ├─ Nested navigation with bottom tabs
   │  └─ GoRouter with StatefulShellRoute
   ├─ Simple push/pop navigation only
   │  └─ Navigator.push (but prefer GoRouter for consistency)
   └─ Web app with URL routing
      └─ GoRouter (required)
```

### Real-time Decision Matrix

| Scenario | Cubit | BLoC | Riverpod | Provider |
|----------|-------|------|----------|----------|
| Form validation | ✅ | ❌ | ✅ | ❌ |
| API loading states | ✅ | ⚠️ | ✅ | ⚠️ |
| Event sourcing needed | ❌ | ✅ | ❌ | ❌ |
| Global auth state | ⚠️ | ⚠️ | ✅ | ❌ |
| Widget-only state | ❌ | ❌ | ❌ | ✅ |

## Failure Modes

### 1. **Mutable State Mutation** 
- **Symptom**: UI doesn't rebuild after calling cubit methods
- **Detection**: `emit(state.someList.add(item))` or direct property assignment
- **Fix**: Always use `copyWith` and return new instances; never mutate existing state objects

### 2. **Listener Hell**
- **Symptom**: Multiple BlocListeners wrapping widgets, performance issues, duplicate side effects
- **Detection**: Nested BlocListener widgets or same listener logic in multiple widgets  
- **Fix**: Use MultiBlocListener or move side effects to cubit methods with single listener at route level

### 3. **Rebuild Cascades**
- **Symptom**: Entire screen rebuilds when only small part should update
- **Detection**: Every widget rebuilds on any state change, performance profiler shows excessive builds
- **Fix**: Split large state objects, use BlocSelector for granular rebuilds, proper widget tree structure

### 4. **God State Object**
- **Symptom**: Single state class with 10+ properties, copyWith method with massive parameter list
- **Detection**: State class >20 lines, copyWith with >8 parameters
- **Fix**: Split into feature-specific cubits; composition over god objects

### 5. **Navigation State Conflicts**
- **Symptom**: GoRouter redirect loops, navigation stack corruption, authentication redirects failing
- **Detection**: Browser back button breaks app, authentication status conflicts with routes
- **Fix**: Centralize auth state, use redirect guards properly, test deep link scenarios

## Worked Examples

### Complete E-commerce Cart Implementation

**Scenario**: Build shopping cart with add/remove items, quantity updates, price calculations, and checkout navigation.

**1. State Design** (Expert catches: immutability, separation of concerns)
```dart
// Novice: Single cart state with mutable list
// Expert: Immutable state with calculated properties
class CartState extends Equatable {
  final Map<String, CartItem> items;  // Expert: Use Map for O(1) lookups
  final CartStatus status;
  
  // Expert: Calculated properties prevent state inconsistency
  double get totalPrice => items.values.fold(0, (sum, item) => sum + item.total);
  int get itemCount => items.values.fold(0, (sum, item) => sum + item.quantity);
  
  CartState copyWith({Map<String, CartItem>? items, CartStatus? status}) {
    return CartState._(items ?? this.items, status ?? this.status);
  }
}
```

**2. Decision Point Navigation**: Adding item logic
- If item exists → update quantity via copyWith of Map
- If new item → add to Map copy  
- If quantity becomes 0 → remove from Map

**3. Implementation** (Expert catches: performance, error handling)
```dart
class CartCubit extends Cubit<CartState> {
  Future<void> addItem(Product product, int quantity) async {
    final currentItems = Map<String, CartItem>.from(state.items);
    final existingItem = currentItems[product.id];
    
    if (existingItem != null) {
      // Expert: Immutable update of nested object
      currentItems[product.id] = existingItem.copyWith(
        quantity: existingItem.quantity + quantity
      );
    } else {
      currentItems[product.id] = CartItem.fromProduct(product, quantity);
    }
    
    emit(state.copyWith(items: currentItems));
    
    // Expert: Navigation coupling - delegate to router
    if (state.itemCount == 1) {
      context.go('/cart-overview');  // First item added
    }
  }
}
```

**4. What Novice Misses vs Expert Catches**:
- Novice: Direct list mutation `state.items.add()` → UI won't rebuild
- Expert: Map copying with proper immutability 
- Novice: Business logic in widget `build()` method
- Expert: All logic in cubit, widgets only render and dispatch
- Novice: No error handling for network failures
- Expert: Loading/error states in every async operation

## Quality Gates

- [ ] All state classes extend Equatable with props override
- [ ] Every async operation has loading/success/error states  
- [ ] CopyWith method covers all state properties
- [ ] No business logic in widget build() methods
- [ ] BlocTest coverage >90% for all state transitions
- [ ] Widget tests verify UI for each state enum value
- [ ] GoRouter redirect guards prevent infinite loops
- [ ] Deep link navigation tested (manual + automated)
- [ ] BlocObserver configured for debug logging
- [ ] Repository interfaces abstract data layer access
- [ ] Feature modules export single barrel file
- [ ] No God state objects (>8 copyWith parameters = split)

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **React Native state** → Use `react-native-architect` instead
- **SwiftUI data flow** → Use `swiftui-data-flow-expert` instead  
- **Jetpack Compose navigation** → Use `jetpack-compose-navigation-expert` instead
- **Flutter UI/widgets only** → Use `flutter-ui-specialist` instead
- **Backend API design** → Use `api-architect` instead
- **Database schema design** → Use `database-architect` instead
- **Widget-only state (no business logic)** → Use built-in `setState` instead
- **Static data/constants** → Use simple Dart classes, not state management
- **Animation controllers** → Use Flutter's AnimationController directly

**Delegate to other skills when:**
- Complex offline sync needed → `mobile-offline-sync-architect`
- Performance optimization required → `flutter-performance-expert`  
- Architecture decisions beyond state → `frontend-architect`