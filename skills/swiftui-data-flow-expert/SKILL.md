---
license: Apache-2.0
name: swiftui-data-flow-expert
description: "SwiftUI data flow expert with @Observable, SwiftData, NavigationStack, and structured concurrency. Activate on: SwiftUI state management, @Observable, SwiftData, NavigationStack, Combine, async/await Swift, structured concurrency, MVVM SwiftUI. NOT for: UIKit legacy (use react-native-architect), Core Data migrations (use ios-core-data-architect), Android Compose (use jetpack-compose-navigation-expert)."
allowed-tools: Read,Write,Edit,Bash(swift:*,xcodebuild:*)
category: Mobile Development
tags:
  - swiftui
  - ios
  - swift
  - state-management
pairs-with:
  - skill: native-app-designer
    reason: Native design patterns inform SwiftUI component architecture
  - skill: ios-core-data-architect
    reason: Core Data and SwiftData persistence layer beneath SwiftUI views
---

# SwiftUI Data Flow Expert

Expert in SwiftUI state management with @Observable, SwiftData persistence, NavigationStack, and structured concurrency patterns for iOS 17+/18.

## Decision Points

### State Management Choice

```
1. View-local state (form inputs, toggles, local UI)?
   → Use @State
   → Keep data inside the view
   → Example: @State private var showingSheet = false

2. Shared state across views (user session, app data)?
   → Use @Observable class
   → Pass via @Environment or init
   → Example: @Observable class UserSession

3. Persistent data (saved to disk)?
   → Use SwiftData @Model
   → Access via @Query in views
   → Example: @Model class Expense

4. External data source (network, sensors)?
   → Use @Observable + async methods
   → Wrap in Task {} for concurrency
   → Example: @Observable class WeatherViewModel
```

### Concurrency Model Choice

```
1. Single async operation (network call)?
   → Use Task {} in SwiftUI .task modifier
   → Handle errors with do/catch

2. Multiple related operations?
   → Use TaskGroup for parallel execution
   → Use await for sequential dependencies

3. Continuous data stream (location, sensors)?
   → Use AsyncStream or AsyncSequence
   → Cancel with .onDisappear

4. Background processing?
   → Use @globalActor or custom actor
   → Never access @MainActor data directly
```

### Data Binding Strategy

```
1. Direct property binding needed?
   → Use @Bindable(viewModel)
   → Allows $ syntax for Observable objects

2. One-way data flow only?
   → Pass Observable directly
   → Read properties without $

3. Computed property or transformation?
   → Create computed var in Observable class
   → SwiftUI auto-tracks changes

4. Form data with validation?
   → Use @State for working copy
   → Sync to Observable on save/submit
```

## Failure Modes

### Symptom: View Won't Re-render
- **Detection**: Data changes but UI stays stale
- **Diagnosis**: Missing observation or wrong binding type
- **Fix**: Ensure @Observable class, check @Bindable usage, verify property access

### Symptom: App Crashes on Navigation
- **Detection**: Fatal error on NavigationLink tap or back navigation
- **Diagnosis**: Type mismatch in NavigationStack routing
- **Fix**: Verify navigationDestination(for:) matches NavigationLink value types

### Symptom: Data Appears Then Disappears
- **Detection**: SwiftData @Query shows data briefly, then empty list
- **Diagnosis**: ModelContext not properly injected or predicate filtering all results
- **Fix**: Check .modelContainer() in App, verify @Query predicate syntax

### Symptom: Async Task Never Completes
- **Detection**: Loading spinner forever, no error thrown
- **Diagnosis**: Task not cancelled on view dismiss, holding strong references
- **Fix**: Store Task reference, call .cancel() in .onDisappear, check actor isolation

### Symptom: Main Thread Blocking
- **Detection**: UI freezes during operations, Xcode warnings about main actor
- **Diagnosis**: Heavy work or synchronous I/O on main thread
- **Fix**: Wrap in Task {}, use @globalActor for background work, check Sendable conformance

## Worked Examples

### Complete Order Management Flow

**Scenario**: Build order list with SwiftData persistence, async loading, and type-safe navigation.

**Step 1: Define the data model**
```swift
@Model
class Order {
    var id: UUID
    var customerName: String
    var total: Decimal
    var status: OrderStatus
    var createdAt: Date
    
    init(customerName: String, total: Decimal) {
        self.id = UUID()
        self.customerName = customerName
        self.total = total
        self.status = .pending
        self.createdAt = .now
    }
}
```

**Step 2: Navigation routing (expert catches type safety)**
```swift
enum AppRoute: Hashable {
    case orderDetail(Order.ID)  // UUID, not Order object
    case newOrder
}
```

**Step 3: Observable view model for business logic**
```swift
@Observable
class OrderStore {
    var isLoading = false
    var error: AppError?
    
    @MainActor
    func syncWithServer(context: ModelContext) async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            let serverOrders = try await APIClient.shared.fetchOrders()
            // Update SwiftData context
            for serverOrder in serverOrders {
                context.insert(serverOrder.toModelObject())
            }
            try context.save()
        } catch {
            self.error = .sync(error)
        }
    }
}
```

**Step 4: SwiftUI view with decision points applied**
```swift
struct OrderListView: View {
    @Query(sort: \Order.createdAt, order: .reverse) private var orders: [Order]
    @Environment(\.modelContext) private var modelContext
    @State private var orderStore = OrderStore()
    @State private var path = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $path) {
            List(orders) { order in
                NavigationLink(value: AppRoute.orderDetail(order.id)) {
                    OrderRow(order: order)
                }
            }
            .navigationTitle("Orders")
            .toolbar {
                Button("Add") { path.append(AppRoute.newOrder) }
                Button("Sync", action: sync)
            }
            .navigationDestination(for: AppRoute.self) { route in
                switch route {
                case .orderDetail(let id):
                    OrderDetailView(orderId: id)
                case .newOrder:
                    NewOrderView()
                }
            }
            .overlay {
                if orderStore.isLoading { ProgressView() }
            }
            .task { await sync() }
        }
    }
    
    private func sync() async {
        await orderStore.syncWithServer(context: modelContext)
    }
}
```

**Novice mistakes this catches:**
- Using Order object in navigation (crashes on back navigation)
- Missing @MainActor on UI updates from async context
- Not cancelling tasks on view disappear
- Using @State for shared business logic instead of @Observable

## Quality Gates

- [ ] All @Observable classes used for shared state (not @State)
- [ ] @Query sorts applied with explicit descriptors
- [ ] NavigationStack uses value-based routing (not destination-based)
- [ ] All async tasks properly cancelled on view disappear
- [ ] @MainActor respected for UI updates from background contexts
- [ ] SwiftData ModelContext injected via environment (not global)
- [ ] Error handling present for all async operations
- [ ] @Bindable used only when $ binding syntax needed
- [ ] No force unwrapping in production paths
- [ ] Sendable conformance for types crossing actor boundaries

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **UIKit/AppKit** → Use `ios-uikit-architect` for legacy UI frameworks
- **Core Data migrations** → Use `ios-core-data-architect` for existing Core Data stacks
- **Combine publishers** → Use `ios-reactive-architect` for existing Combine codebases
- **Cross-platform** → Use `flutter-architect` or `react-native-architect`
- **SwiftUI iOS 15/16** → Use `ios-legacy-swiftui` for pre-@Observable patterns
- **Performance optimization** → Use `ios-performance-engineer` for Instruments analysis
- **App Store deployment** → Use `ios-release-engineer` for CI/CD and signing

**Delegate to other skills when:**
- Complex animations needed → `native-app-designer`
- Backend integration → `api-integration-specialist`
- Testing strategies → `ios-test-architect`