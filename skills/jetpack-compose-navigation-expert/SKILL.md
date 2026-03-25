---
license: Apache-2.0
name: jetpack-compose-navigation-expert
description: "Jetpack Compose navigation expert with type-safe routes, Hilt DI, and MVVM/MVI architecture. Activate on: Jetpack Compose navigation, Compose type-safe routes, Hilt dependency injection, MVVM Android, MVI pattern, Compose state management, NavHost, ViewModel. NOT for: XML layouts (use frontend-architect), iOS SwiftUI (use swiftui-data-flow-expert), React Native (use react-native-architect)."
allowed-tools: Read,Write,Edit,Bash(gradle:*,adb:*)
category: Mobile Development
tags:
  - android
  - jetpack-compose
  - navigation
  - architecture
pairs-with:
  - skill: frontend-architect
    reason: Shared reactive UI patterns between Compose and React
  - skill: android-background-task-specialist
    reason: ViewModels coordinate with background tasks via WorkManager
---

# Jetpack Compose Navigation Expert

Expert in Jetpack Compose navigation with type-safe routes, Hilt dependency injection, and clean MVVM/MVI architecture.

## Activation Triggers

**Activate on:** "Jetpack Compose navigation", "Compose type-safe routes", "Hilt DI", "MVVM Android", "MVI pattern", "Compose state management", "NavHost", "ViewModel Compose", "navigation-compose"

**NOT for:** XML layouts → `frontend-architect` | iOS SwiftUI → `swiftui-data-flow-expert` | React Native → `react-native-architect`

## Quick Start

1. **Add Navigation Compose** — `implementation("androidx.navigation:navigation-compose:2.9.x")` with type-safe routes
2. **Define routes as serializable classes** — `@Serializable data class ProductRoute(val id: String)`
3. **Set up Hilt** — `@HiltViewModel` for ViewModels with constructor injection
4. **Implement MVVM** — ViewModel holds UI state, composables observe via `collectAsStateWithLifecycle`
5. **Handle deep links** — declarative deep link mapping in NavHost

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Navigation** | Navigation Compose 2.9, type-safe routes, nested graphs |
| **DI** | Hilt 2.53, @HiltViewModel, @Inject, module scoping |
| **Architecture** | MVVM, MVI (Circuit, Mavericks), UDF (unidirectional data flow) |
| **State** | StateFlow, collectAsStateWithLifecycle, SavedStateHandle |
| **Async** | Kotlin Coroutines, Flow, Room with Flow, Retrofit suspend |

## Architecture Patterns

### Type-Safe Navigation (Compose 2.8+)

```kotlin
// Define routes as serializable data classes
@Serializable
data object HomeRoute

@Serializable
data class ProductRoute(val productId: String)

@Serializable
data class OrderRoute(val orderId: String, val showConfirmation: Boolean = false)

// NavHost with type-safe composable destinations
@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = HomeRoute) {
        composable<HomeRoute> {
            HomeScreen(
                onProductClick = { id ->
                    navController.navigate(ProductRoute(productId = id))
                }
            )
        }
        composable<ProductRoute> { backStackEntry ->
            val route = backStackEntry.toRoute<ProductRoute>()
            ProductScreen(productId = route.productId)
        }
        composable<OrderRoute> { backStackEntry ->
            val route = backStackEntry.toRoute<OrderRoute>()
            OrderScreen(orderId = route.orderId)
        }
    }
}
```

### MVVM with Hilt and UDF

```kotlin
@HiltViewModel
class ProductViewModel @Inject constructor(
    private val repository: ProductRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val productId: String = savedStateHandle.toRoute<ProductRoute>().productId

    private val _uiState = MutableStateFlow<ProductUiState>(ProductUiState.Loading)
    val uiState: StateFlow<ProductUiState> = _uiState.asStateFlow()

    init { loadProduct() }

    fun onEvent(event: ProductEvent) {
        when (event) {
            is ProductEvent.AddToCart -> addToCart(event.quantity)
            is ProductEvent.Refresh -> loadProduct()
        }
    }

    private fun loadProduct() {
        viewModelScope.launch {
            _uiState.value = ProductUiState.Loading
            repository.getProduct(productId)
                .onSuccess { _uiState.value = ProductUiState.Success(it) }
                .onFailure { _uiState.value = ProductUiState.Error(it.message) }
        }
    }
}

// Composable observes state
@Composable
fun ProductScreen(viewModel: ProductViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is ProductUiState.Loading -> LoadingIndicator()
        is ProductUiState.Success -> ProductContent(
            product = state.product,
            onEvent = viewModel::onEvent,
        )
        is ProductUiState.Error -> ErrorMessage(state.message)
    }
}
```

### Nested Navigation Graphs

```
Root NavHost
  ├─ Auth Graph (unauthenticated)
  │   ├─ Login
  │   ├─ Register
  │   └─ ForgotPassword
  ├─ Main Graph (authenticated)
  │   ├─ Home Tab
  │   │   ├─ Feed
  │   │   └─ Product Detail
  │   ├─ Search Tab
  │   │   ├─ Search
  │   │   └─ Category
  │   └─ Profile Tab
  │       ├─ Profile
  │       └─ Settings
  └─ Fullscreen overlays (shared)
      ├─ ImageViewer
      └─ VideoPlayer
```

## Anti-Patterns

1. **String-based routes** — `navController.navigate("product/123")` is error-prone. Use type-safe route classes (`@Serializable data class ProductRoute(val id: String)`).
2. **ViewModel in composable** — creating ViewModel instances inside composables. Use `hiltViewModel()` which handles scoping to the NavBackStackEntry.
3. **Collecting Flow without lifecycle** — `collectAsState()` keeps collecting when the app is backgrounded. Use `collectAsStateWithLifecycle()` to respect lifecycle.
4. **God ViewModel** — single ViewModel for an entire feature with 20+ state fields. Split into smaller ViewModels or use MVI with sealed state classes.
5. **Navigation in ViewModel** — calling `navController.navigate()` from ViewModel. Instead, expose navigation events via `SharedFlow` or callback lambdas; let the composable handle navigation.

## Quality Checklist

```
[ ] Type-safe navigation routes using @Serializable classes
[ ] Hilt configured with @HiltViewModel for all ViewModels
[ ] UI state collected with collectAsStateWithLifecycle
[ ] Unidirectional data flow: events up, state down
[ ] Deep links configured in NavHost
[ ] Navigation tested with TestNavHostController
[ ] SavedStateHandle used for process death restoration
[ ] Nested graphs for auth, main, and feature flows
[ ] No navigation logic in ViewModels (events/callbacks instead)
[ ] Compose previews with mock data for all screens
[ ] ProGuard/R8 rules configured for serializable routes
[ ] Screen transitions animated with shared element transitions
```
