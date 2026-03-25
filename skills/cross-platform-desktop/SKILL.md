---
license: Apache-2.0
name: cross-platform-desktop
description: 'Cross-platform desktop development for macOS and Windows -- platform abstractions, UI convention differences, and multi-platform CI/CD. Activate on: cross-platform app, macOS and Windows, platform differences, DMG installer, MSI installer, NSIS installer, Cmd vs Ctrl, platform abstractions, menu bar differences, native conventions. NOT for: mobile apps, web-only apps, Tauri-specific internals (use rust-tauri-development).'
allowed-tools: Read,Write,Edit,Bash(cargo:*,npm:*,npx:*,pnpm:*),Glob,Grep
metadata:
  category: Desktop & Native
  tags:
    - cross-platform
    - desktop
    - macos
    - windows
    - native
    - platform-abstraction
  pairs-with:
    - skill: rust-tauri-development
      reason: Tauri is the primary cross-platform desktop framework
    - skill: rust-app-distribution
      reason: Platform-specific signing, packaging, and distribution
    - skill: github-actions-pipeline-builder
      reason: CI/CD matrix builds for multiple platforms
category: Frontend & UI
tags:
  - cross-platform
  - desktop
  - electron
  - tauri
  - native
---

# Cross-Platform Desktop Development

Build desktop applications that ship on macOS AND Windows. This skill covers the platform differences that break your app, the abstraction strategies that save your sanity, and the CI/CD discipline that catches problems before users do.

## When to Use / Do NOT Use For

**Use for:** Desktop apps targeting macOS + Windows, framework evaluation (Tauri vs Electron vs Flutter), platform-convention-aware UI design, multi-platform CI/CD, debugging cross-platform rendering/behavior.

**Do NOT use for:** Web-only apps | Mobile apps | Single-platform native (SwiftUI/WinUI) | Linux-only desktop

## Framework Decision Matrix (2025-2026)

| Factor | Tauri v2 | Electron | Flutter Desktop |
|--------|----------|----------|-----------------|
| **Bundle size** | 2-10 MB | 80-150 MB | 15-30 MB |
| **Idle memory** | 30-40 MB | 150-300 MB | 60-100 MB |
| **Rendering** | Native webview (varies per OS) | Bundled Chromium (identical) | Skia engine (identical) |
| **Backend** | Rust | Node.js | Dart |
| **Plugin ecosystem** | Growing (50+ official) | Mature (thousands) | Moderate |
| **Security model** | Deny-by-default | Open by default | Sandboxed |
| **Cross-platform rendering** | WebKit (macOS) vs Chromium (Windows) | Chromium everywhere | Skia everywhere |
| **Best for** | Performance, security, small bundle | Web teams, pixel-perfect parity | Custom UI, animation |

**Choose Tauri** when performance and security matter and you accept rendering differences.
**Choose Electron** when pixel-identical rendering across platforms is non-negotiable.
**Choose Flutter** when you also target mobile and want one widget toolkit everywhere.

## Platform Differences That Break Apps

### File Paths

| Concern | macOS | Windows |
|---------|-------|---------|
| Separator | `/` | `\` (but `/` works in most APIs) |
| App data | `~/Library/Application Support/com.app.id/` | `%APPDATA%\AppName\` |
| Temp dir | `$TMPDIR` | `%TEMP%` |
| Home dir | `$HOME` (~) | `%USERPROFILE%` |
| Case sensitivity | No by default (APFS) | No (NTFS) |
| Max path length | 1024 chars | 260 chars default, 32767 with opt-in |
| Reserved names | None | CON, PRN, AUX, NUL, COM1-9, LPT1-9 |

**Never hardcode paths.** Use platform APIs:

```rust
// Rust: dirs crate
let config = dirs::config_dir().unwrap();
// macOS: ~/Library/Application Support
// Windows: C:\Users\<user>\AppData\Roaming

let data = dirs::data_dir().unwrap();
let cache = dirs::cache_dir().unwrap();
```

```typescript
// Tauri JS API
import { appDataDir, homeDir, tempDir } from "@tauri-apps/api/path";

const dataDir = await appDataDir(); // Platform-correct automatically
```

### Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Copy | Cmd+C | Ctrl+C |
| Paste | Cmd+V | Ctrl+V |
| Undo | Cmd+Z | Ctrl+Z |
| Redo | Cmd+Shift+Z | Ctrl+Y |
| Preferences | Cmd+, | Ctrl+, (or Edit > Preferences) |
| Quit app | Cmd+Q | Alt+F4 |
| Close window | Cmd+W | Ctrl+W or Alt+F4 |
| Find | Cmd+F | Ctrl+F |
| Save | Cmd+S | Ctrl+S |

**Abstraction pattern:**

```typescript
const isMac = navigator.platform.includes("Mac");

function formatShortcut(key: string): string {
  const mod = isMac ? "\u2318" : "Ctrl+";
  return `${mod}${key.toUpperCase()}`;
}

function isModKey(e: KeyboardEvent): boolean {
  return isMac ? e.metaKey : e.ctrlKey;
}

// Usage
document.addEventListener("keydown", (e) => {
  if (isModKey(e) && e.key === "s") {
    e.preventDefault();
    saveDocument();
  }
});
```

### Window Chrome and Menus

| Element | macOS | Windows |
|---------|-------|---------|
| Menu bar location | Top of screen (global) | Top of window |
| Window controls | Top-left (close/minimize/zoom) | Top-right (minimize/maximize/close) |
| System tray | Menu bar area (top-right) | Notification area (bottom-right) |
| Close last window | App keeps running | App quits |
| Quit app | Cmd+Q or menu | Closing last window or Alt+F4 |
| Native dialogs | Sheet (slides from title bar) | Modal (centered on window) |
| Dark mode | NSAppearance / system | prefers-color-scheme + registry |
| Default font | SF Pro (system) | Segoe UI (system) |

**The close-vs-quit behavior is the most common cross-platform bug.** Handle it explicitly:

```rust
// Tauri: platform-correct close behavior
app.on_window_event(|window, event| {
    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        #[cfg(target_os = "macos")]
        {
            // macOS convention: hide, do not quit
            window.hide().unwrap();
            api.prevent_close();
        }
        // Windows: default close-and-quit is correct
    }
});
```

### Rendering Differences (Tauri-Specific)

Tauri uses native webviews per platform. This causes subtle differences:

| Issue | macOS (WebKit) | Windows (WebView2/Chromium) |
|-------|----------------|------------------------------|
| Font rendering | Sub-pixel antialiasing | ClearType / grayscale |
| Default system font | SF Pro | Segoe UI |
| Emoji rendering | Apple Color Emoji | Segoe UI Emoji |
| Scrollbar styling | WebKit-specific | Chromium-specific |
| CSS container queries | Check WebKit version | Generally supported |
| Date/time input | Native WebKit picker | Chromium picker |

**Electron avoids these entirely** by bundling Chromium on all platforms. If rendering parity is critical, this is the strongest argument for Electron.

**Mitigation for Tauri:**

```css
/* Cross-platform font stack */
body {
  font-family:
    -apple-system,        /* macOS SF Pro */
    BlinkMacSystemFont,   /* macOS Chrome fallback */
    "Segoe UI",           /* Windows */
    Roboto,               /* Android/Linux */
    system-ui,
    sans-serif;
}

/* Normalize scrollbars */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}
```

### DPI and Display Scaling

| Factor | macOS | Windows |
|--------|-------|---------|
| Default scale | 2x (Retina) | 1x, 1.25x, 1.5x, 2x (user configurable) |
| Scaling method | Integer (2x only on most displays) | Fractional (125%, 150%) |
| Common gotcha | None (2x is standard) | 125% scaling causes blurry rendering |

**Fix:** Use CSS logical units, SVG icons (not bitmaps), and test at 100%, 125%, and 150% scaling on Windows.

## Installer Formats

| Format | Platform | Tool | Use Case |
|--------|----------|------|----------|
| DMG | macOS | create-dmg, Tauri bundler | Standard drag-to-Applications |
| .app bundle | macOS | cargo tauri build | The application itself |
| MSI | Windows | WiX (via Tauri) | Enterprise, Group Policy |
| NSIS EXE | Windows | NSIS (via Tauri) | Consumer apps, custom UI |
| AppImage | Linux | Tauri bundler | Universal portable binary |
| .deb | Linux | Tauri bundler | Debian/Ubuntu |

**Tauri config for all formats:**

```json
{
  "bundle": {
    "targets": ["dmg", "nsis", "msi", "deb", "appimage"],
    "macOS": {
      "minimumSystemVersion": "10.15",
      "dmg": {
        "appPosition": { "x": 180, "y": 170 },
        "applicationFolderPosition": { "x": 480, "y": 170 }
      }
    },
    "windows": {
      "nsis": {
        "installMode": "both",
        "displayLanguageSelector": true
      },
      "wix": {
        "language": "en-US"
      }
    }
  }
}
```

## CI/CD: GitHub Actions Matrix Build

Use a matrix strategy to build on native runners for each platform. The full pipeline YAML is in `rust-app-distribution` -- the key pattern:

```yaml
strategy:
  fail-fast: false
  matrix:
    include:
      - platform: macos-latest     # ARM Mac (M-series)
        target: aarch64-apple-darwin
      - platform: macos-13         # Intel Mac
        target: x86_64-apple-darwin
      - platform: windows-latest
        target: x86_64-pc-windows-msvc
runs-on: ${{ matrix.platform }}
```

**macOS universal binary** (ARM + Intel in one): use target `universal-apple-darwin` with `rustup target add aarch64-apple-darwin x86_64-apple-darwin`.

## Platform-Specific Code Patterns

### Rust: cfg(target_os) Guards

```rust
#[cfg(target_os = "macos")]
fn platform_init(app: &tauri::App) {
    // macOS-specific: dock icon, activation policy
    app.set_activation_policy(tauri::ActivationPolicy::Regular);
}

#[cfg(target_os = "windows")]
fn platform_init(app: &tauri::App) {
    // Windows-specific: jump list, toast notification setup
}

// Always provide a fallback
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn platform_init(_app: &tauri::App) {}
```

### TypeScript: Runtime Platform Detection

```typescript
import { platform } from "@tauri-apps/plugin-os";

const os = await platform(); // "macos" | "windows" | "linux"

// Conditional UI
function ShortcutHint({ action }: { action: string }) {
  const mod = os === "macos" ? "\u2318" : "Ctrl";
  return <kbd>{mod}+{action}</kbd>;
}
```

### CSS: Platform-Aware Styling

```css
/* Tauri injects data-platform attribute (configure in setup) */
[data-platform="macos"] .titlebar {
  padding-left: 80px; /* Space for traffic lights */
}

[data-platform="windows"] .titlebar {
  padding-right: 140px; /* Space for min/max/close */
}
```

## Testing Across Platforms

### Local Development

- **Primary dev machine**: Build and test natively
- **Secondary platform**: VM (Parallels/VMware for Windows on Mac, or vice versa), or dedicated hardware
- **Quick check**: CI runners catch build failures even without local testing

### Automated Testing in CI

```yaml
# Run tests on both platforms in CI
test:
  strategy:
    matrix:
      os: [macos-latest, windows-latest]
  runs-on: ${{ matrix.os }}
  steps:
    - uses: actions/checkout@v4
    - run: cargo test --manifest-path src-tauri/Cargo.toml
    - run: npm ci && npm test
```

### Screenshot Comparison

Use headless browser testing (Playwright) in CI to screenshot the app on each platform and diff the results. Catches rendering regressions across WebKit/WebView2.

## Anti-Patterns

### 1. Hardcoded Paths
**Symptom:** `fs.readFile("/Users/...")` or `fs.readFile("C:\\Users\\...")`
**Fix:** Use `dirs` crate (Rust) or `@tauri-apps/api/path` (JS). Never assume separators.

### 2. Testing on One Platform Only
**Symptom:** "Works on my Mac" ships broken on Windows.
**Fix:** CI matrix builds on both platforms. Period.

### 3. Ignoring Close-vs-Quit Semantics
**Symptom:** macOS users expect app to stay running when closing window. Windows users expect it to quit.
**Fix:** Follow each platform's convention explicitly.

### 4. Platform-Specific Fonts Without Fallbacks
**Symptom:** "SF Pro" renders as Times New Roman on Windows.
**Fix:** Full font stack: `-apple-system, "Segoe UI", Roboto, sans-serif`.

### 5. Pixel-Based Layouts That Break at Fractional Scaling
**Symptom:** UI looks fine on macOS Retina, misaligned at 125%/150% on Windows.
**Fix:** Use logical CSS units, SVG icons, test at multiple DPI settings.

### 6. Assuming WebKit Behavior on Windows
**Symptom:** CSS or JS works on macOS (WebKit) but breaks on Windows (Chromium).
**Fix:** Test both. Use feature detection. Check compat tables.

### 7. One Giant Installer for All Platforms
**Symptom:** Trying to create a universal artifact.
**Fix:** Each platform gets its own format: DMG (macOS), NSIS/MSI (Windows).

### 8. Not Handling Windows Long Path Limits
**Symptom:** File operations fail on deeply nested directories.
**Fix:** Check path length, or use `\\?\` extended-length prefix on Windows.

## Quality Checklist

```
[ ] App builds and runs on both macOS and Windows
[ ] CI/CD matrix builds both platforms on every push
[ ] Keyboard shortcuts use Cmd on macOS, Ctrl on Windows
[ ] Shortcut hints in UI reflect current platform dynamically
[ ] Close button follows platform convention (hide on macOS, quit on Windows)
[ ] Menu bar is global on macOS, in-window on Windows
[ ] System tray works on both platforms
[ ] File paths resolved via platform APIs (never hardcoded)
[ ] Font stack includes fallbacks for both platforms
[ ] Dark mode detected and applied on both platforms
[ ] Tested at 1x, 1.25x, 1.5x, and 2x display scaling
[ ] Installers generated: DMG for macOS, NSIS or MSI for Windows
[ ] Code signing configured for both platforms (see rust-app-distribution)
[ ] No platform-specific CSS without feature detection
[ ] Window state (size, position) persisted correctly per platform
```
