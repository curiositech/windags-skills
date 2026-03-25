---
license: Apache-2.0
name: rust-tauri-development
description: 'Expert Tauri v2 developer for building desktop apps with Rust backend and web frontend. Activate on: Tauri app, Tauri v2, Rust desktop app, IPC commands, tauri::command, tauri.conf.json, Tauri plugin, WebviewWindow, system tray Tauri, Tauri multi-window. NOT for: Electron apps (use cross-platform-desktop), code signing/distribution (use rust-app-distribution), pure Rust CLI tools (use rust-expert).'
allowed-tools: Read,Write,Edit,Bash(cargo:*,npm:*,npx:*,pnpm:*,rustup:*),Glob,Grep
metadata:
  category: Desktop & Native
  tags:
    - tauri
    - rust
    - desktop
    - webview
    - ipc
    - native-app
  pairs-with:
    - skill: cross-platform-desktop
      reason: Platform-specific UI and behavior abstractions
    - skill: rust-app-distribution
      reason: Code signing, notarization, and distribution pipelines
    - skill: typescript-advanced-patterns
      reason: Type-safe frontend consuming Tauri IPC bridge
category: Frontend & UI
tags:
  - rust
  - tauri
  - desktop
  - webview
  - cross-platform
---

# Rust Tauri Development

Expert Tauri v2 development for building desktop applications with Rust backend and web frontend.

## DECISION POINTS

### IPC Pattern Selection
```
Data Exchange Pattern:
├─ Request/Response needed?
│  ├─ YES: Use #[tauri::command]
│  │  ├─ Sync operation? → fn command() -> Result<T, String>
│  │  └─ I/O operation? → async fn command() -> Result<T, String>
│  └─ NO: Fire-and-forget?
│     ├─ YES: Use events (emit/listen)
│     └─ Large binary data? → Use raw payload channels

State Management Pattern:
├─ Simple shared data?
│  ├─ Read-only → Arc<T>
│  ├─ Mutable + sync access → Arc<Mutex<T>>
│  └─ Mutable + async access → Arc<RwLock<T>>
├─ Database needed?
│  ├─ Simple KV → tauri-plugin-store
│  └─ Relational → tauri-plugin-sql
└─ Cross-process state? → Database or file-based
```

### Window Architecture
```
Window Count Decision:
├─ Single window app?
│  └─ Use default main window only
├─ Settings/preferences needed?
│  └─ Create secondary window with restricted capabilities
├─ Background processing?
│  ├─ System tray → TrayIconBuilder + hidden main window
│  └─ No tray → Keep main window, emit progress events
└─ Multi-document interface?
    └─ Create window per document with shared state
```

### Plugin vs Custom Code
```
Functionality needed:
├─ File system access?
│  ├─ Basic read/write → cargo tauri add fs
│  └─ Complex file ops → Custom commands + std::fs
├─ HTTP requests?
│  ├─ Simple → reqwest in custom commands
│  └─ Complex proxy/auth → Custom plugin
├─ Database?
│  ├─ SQLite/MySQL → cargo tauri add sql
│  └─ Custom storage → Custom plugin
└─ Platform integration?
    ├─ Notifications → cargo tauri add notification
    └─ Custom system APIs → Custom plugin
```

## FAILURE MODES

### Thread Blocking Anti-Pattern
**Detection Rule:** If UI freezes during Rust command execution
**Symptoms:** 
- Frontend becomes unresponsive
- Spinning cursor on macOS/Windows
- DevTools shows pending invoke() calls
**Fix:** Convert blocking command to async or spawn onto background thread
```rust
// BAD: Blocks the main thread
#[tauri::command]
fn heavy_computation() -> String {
    std::thread::sleep(Duration::from_secs(5)); // UI freezes
    "done".to_string()
}

// GOOD: Async command
#[tauri::command]
async fn heavy_computation() -> String {
    tokio::time::sleep(Duration::from_secs(5)).await;
    "done".to_string()
}
```

### Serialization Panic Trap
**Detection Rule:** If app crashes with "failed to serialize" during invoke()
**Symptoms:**
- App crash on specific command calls
- Serde errors in console
- Commands work with simple data but fail with complex types
**Fix:** Ensure all command parameters/returns implement Serialize/Deserialize
```rust
// BAD: Missing derives
struct MyData {
    field: String,
}

// GOOD: Proper derives
#[derive(Serialize, Deserialize)]
struct MyData {
    field: String,
}
```

### Permission Escalation Error
**Detection Rule:** If commands fail with "not allowed" or capability errors
**Symptoms:**
- Plugin commands return permission denied
- File operations fail unexpectedly
- "capability not granted" in logs
**Fix:** Add required permissions to capabilities/*.json
```json
{
  "permissions": [
    "fs:allow-read",
    "fs:scope-app-data"  // Add specific scopes
  ]
}
```

### State Race Condition Bug
**Detection Rule:** If shared state shows inconsistent values between windows
**Symptoms:**
- Data corruption in multi-window apps
- Commands occasionally return stale data
- State updates lost intermittently
**Fix:** Use proper async locking (RwLock for async, Mutex for sync)
```rust
// BAD: No synchronization
static mut COUNTER: i32 = 0;

// GOOD: Proper state management
struct AppState {
    counter: Arc<Mutex<i32>>,
}
```

### WebView Platform Divergence
**Detection Rule:** If layout/behavior differs dramatically between macOS and Windows
**Symptoms:**
- CSS renders differently on different platforms
- JavaScript APIs work on one platform but not others
- Font rendering inconsistencies
**Fix:** Test on all platforms, use cross-platform CSS, avoid WebKit-specific features

## WORKED EXAMPLES

### Building a File Manager App
**Scenario:** Create a desktop file manager with folder tree, file operations, and progress tracking.

**Step 1: Architecture Decision**
- Need file system access → Use tauri-plugin-fs
- Progress updates → Use events for real-time feedback
- Multi-pane UI → Single window with multiple views

**Step 2: Setup Capabilities**
```json
{
  "permissions": [
    "core:default",
    "fs:allow-read",
    "fs:allow-write", 
    "fs:allow-create",
    "fs:scope-downloads",
    "fs:scope-documents"
  ]
}
```

**Step 3: Implement Backend Commands**
```rust
#[tauri::command]
async fn list_directory(path: String, app: AppHandle) -> Result<Vec<FileEntry>, String> {
    let entries = std::fs::read_dir(&path)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    let mut files = Vec::new();
    for (i, entry) in entries.iter().enumerate() {
        // Emit progress for large directories
        if i % 100 == 0 {
            app.emit("scan_progress", i).unwrap();
        }
        files.push(FileEntry::from_dir_entry(entry)?);
    }
    
    app.emit("scan_complete", files.len()).unwrap();
    Ok(files)
}

#[tauri::command]
async fn copy_file(src: String, dest: String, app: AppHandle) -> Result<(), String> {
    let src_path = Path::new(&src);
    let dest_path = Path::new(&dest);
    
    // Use async file operations for large files
    let mut src_file = tokio::fs::File::open(&src_path).await
        .map_err(|e| e.to_string())?;
    let mut dest_file = tokio::fs::File::create(&dest_path).await
        .map_err(|e| e.to_string())?;
        
    // Stream copy with progress
    let file_size = src_file.metadata().await
        .map_err(|e| e.to_string())?.len();
    let mut copied = 0u64;
    
    while copied < file_size {
        let chunk_size = tokio::io::copy(&mut src_file, &mut dest_file).await
            .map_err(|e| e.to_string())?;
        copied += chunk_size;
        
        app.emit("copy_progress", (copied * 100) / file_size).unwrap();
    }
    
    Ok(())
}
```

**What a novice would miss:** Using blocking std::fs operations (freezes UI), forgetting progress events, not handling permission errors.

**What an expert catches:** Async file operations, progress tracking, proper error propagation, scoped capabilities.

## QUALITY GATES

- [ ] All commands return Result<T, String> for proper error handling
- [ ] Async commands used for any I/O operations (file, network, database)
- [ ] Capabilities scoped to minimum required permissions per window
- [ ] App icons generated via `cargo tauri icon` for all required sizes
- [ ] Bundle identifier follows reverse-domain format (com.company.app)
- [ ] Event listeners properly cleaned up with unlisten() calls
- [ ] State management uses Arc<Mutex<T>> or Arc<RwLock<T>> for thread safety
- [ ] No secrets or API keys stored in frontend JavaScript code
- [ ] CSP (Content Security Policy) configured in tauri.conf.json
- [ ] Tested on both macOS and Windows for rendering consistency
- [ ] Bundle size under 50MB for simple apps (check with `cargo tauri build`)
- [ ] All plugins registered in lib.rs Builder chain
- [ ] Minimum OS versions specified in bundle configuration

## NOT-FOR BOUNDARIES

**Do NOT use for:**
- Browser-only web applications → Use standard web frameworks
- Mobile applications → Use tauri-mobile (experimental) or native mobile development
- Node.js compatibility required → Use Electron instead
- Pure command-line tools → Use rust-expert skill
- Complex video/audio processing → Use native platform frameworks
- Apps requiring embedded Chromium → Use Electron

**Delegate to:**
- Code signing and distribution → rust-app-distribution skill
- Cross-platform UI abstractions → cross-platform-desktop skill
- Advanced TypeScript patterns → typescript-advanced-patterns skill
- Database design and optimization → database-design skill