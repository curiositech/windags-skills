---
license: Apache-2.0
name: windows-95-web-designer
description: Modern web applications with authentic Windows 95 aesthetic. Gradient title bars, Start menu paradigm, taskbar patterns, 3D beveled chrome. Extrapolates Win95 to AI chatbots, mobile UIs, responsive layouts. Activate on 'windows 95', 'win95', 'start menu', 'taskbar', 'retro desktop', '95 aesthetic', 'clippy'. NOT for Windows 3.1 (use windows-3-1-web-designer), vaporwave/synthwave, macOS, flat design.
allowed-tools: Read,Write,Edit,Glob,Grep
category: Design & Creative
tags:
  - windows-95
  - retro
  - web-design
  - nostalgic
  - ui
---

# Windows 95 Web Designer

Creates modern 2026 web applications with authentic Windows 95 aesthetic. Not recreating 1995—**extrapolating Win95 to modern contexts**: AI assistants as Clippy descendants, mobile as pocket PCs, responsive as multi-monitor.

## Decision Points

### Layout Mode Selection

```
What's the primary interaction model?
├── Chatbot/AI Assistant?
│   ├── Single conversation? → Clippy Dialog (modal over desktop)
│   ├── Multiple conversations? → MDI with chat windows
│   └── Proactive assistant? → System tray balloon + wizard dialog
│
├── Dashboard/Admin Panel?
│   ├── Multiple data views? → MDI with docked panels
│   ├── Single workflow? → Tabbed dialog
│   └── Real-time monitoring? → Desktop with updating icons
│
├── Mobile App?
│   ├── < 640px width? → Pocket PC (single window, taskbar nav)
│   ├── 640-1024px? → Laptop (cascading windows)
│   └── > 1024px? → Full desktop (multiple windows, desktop icons)
│
└── Website/Marketing?
    ├── Landing page? → Single maximized window
    ├── Multi-section? → Start menu navigation
    └── Documentation? → Help system with tree navigation
```

### Component Hierarchy Decision Tree

```
Is this element interactive?
├── YES: Button, Input, or Menu?
│   ├── Primary action? → Raised 3D button (default)
│   ├── Secondary action? → Flat button
│   ├── Data entry? → Inset input field
│   └── Navigation? → Menu bar or context menu
│
└── NO: Container or Content?
    ├── Groups content? → Group box with etched border
    ├── Displays data? → List view or tree view
    ├── Shows progress? → Progress bar
    └── Pure content? → White background, no chrome
```

### Responsive Breakpoint Strategy

```
Screen width detected:
├── < 640px (Mobile)
│   ├── Touch interface? → Pocket PC paradigm
│   │   ├── Start button: bottom-left (44px min)
│   │   ├── Navigation: taskbar with app buttons
│   │   └── Content: single modal window
│   └── Stylus interface? → Windows CE paradigm
│
├── 640-1024px (Tablet)
│   ├── Portrait? → Laptop simulation (cascading)
│   └── Landscape? → Desktop with limited windows
│
└── > 1024px (Desktop)
    ├── Single monitor feel? → 1024×768 window
    ├── Multi-monitor? → Multiple app windows
    └── Kiosk mode? → Fullscreen with taskbar
```

## Failure Modes

### Flat Bevels (Detection: no 3D depth visible)
- **Symptom**: Buttons look flat, no raised/inset appearance
- **Diagnosis**: Missing box-shadow insets or wrong border colors
- **Fix**: Apply 4-direction bevel: `box-shadow: inset -1px -1px 0 var(--win95-dark-shadow), inset 1px 1px 0 var(--win95-highlight), inset -2px -2px 0 var(--win95-shadow), inset 2px 2px 0 var(--win95-button-face);`

### Wrong Gradient Direction (Detection: vertical title bar gradients)
- **Symptom**: Title bars have top-to-bottom gradients instead of left-to-right
- **Diagnosis**: CSS gradient uses `0deg` or `180deg` instead of `90deg`
- **Fix**: Always use `linear-gradient(90deg, #000080 0%, #1084d0 100%)` for horizontal flow

### Missing Window Shadows (Detection: windows float without depth)
- **Symptom**: Windows appear flat against background
- **Diagnosis**: No hard pixel shadow or using soft CSS shadows
- **Fix**: Add hard shadow: `box-shadow: 2px 2px 0 var(--win95-dark-shadow)` (no blur radius)

### Modern Font Usage (Detection: system fonts like Helvetica/San Francisco)
- **Symptom**: Text looks too modern/clean for Win95
- **Diagnosis**: Using default system fonts instead of Win95 typography
- **Fix**: Force Tahoma/MS Sans Serif: `font-family: 'Tahoma', 'Segoe UI', 'Arial', sans-serif;`

### Hamburger Menu Contamination (Detection: three horizontal lines for navigation)
- **Symptom**: Mobile navigation uses hamburger icon
- **Diagnosis**: Applying modern mobile patterns instead of Win95 extrapolation
- **Fix**: Replace with Start button + Start menu pattern

## Worked Examples

### Example: AI Chatbot Interface

**Novice approach**: Create chat bubbles with modern messaging UI
**Expert approach**: Apply Clippy paradigm with proactive wizard dialog

```html
<!-- WRONG: Modern chat -->
<div class="chat-container">
  <div class="message user">Hello AI</div>
  <div class="message assistant">How can I help?</div>
</div>

<!-- RIGHT: Win95 AI Assistant -->
<div class="win95-dialog" id="assistant-dialog">
  <div class="win95-titlebar">
    <span>Office Assistant</span>
    <div class="win95-controls">
      <button class="win95-control-btn">−</button>
      <button class="win95-control-btn">×</button>
    </div>
  </div>
  
  <div class="win95-dialog-content">
    <div class="assistant-character">
      <img src="clippy-animation.gif" alt="Assistant" width="48" height="48">
    </div>
    <div class="assistant-message">
      <p>It looks like you're writing a document. Would you like help?</p>
      <div class="assistant-choices">
        <label><input type="radio" name="help" value="writing"> Get help with writing</label>
        <label><input type="radio" name="help" value="formatting"> Get help with formatting</label>
        <label><input type="radio" name="help" value="none"> Just write without help</label>
      </div>
    </div>
  </div>
  
  <div class="win95-dialog-buttons">
    <button class="win95-button win95-button-primary">OK</button>
    <button class="win95-button">Cancel</button>
  </div>
</div>
```

**Key decisions navigated**:
1. **Character over chat**: Used Clippy avatar instead of message bubbles
2. **Proactive suggestions**: "It looks like..." instead of reactive responses
3. **Constrained choices**: Radio buttons instead of free text input
4. **Modal dialog**: Traditional Win95 dialog instead of sidebar chat
5. **Wizard buttons**: OK/Cancel instead of Send button

## Quality Gates

- [ ] Title bar has horizontal gradient (dark blue to light blue, left to right)
- [ ] All interactive elements have 3D bevels (buttons raised, inputs inset)
- [ ] Three window control buttons present (minimize, maximize, close)
- [ ] Typography uses Tahoma/MS Sans Serif fallbacks, 11px base size
- [ ] Hard pixel shadows only (no blur radius in box-shadow)
- [ ] Color palette uses exact Win95 hex values (#c0c0c0, #000080, etc.)
- [ ] Mobile layout uses Start button (not hamburger menu)
- [ ] AI interfaces use character avatar + wizard pattern (not chat bubbles)
- [ ] Navigation follows Start menu paradigm (not modern navigation patterns)
- [ ] Responsive breakpoints extrapolate Win95 to multiple "monitor" sizes

## NOT-FOR Boundaries

**Do NOT use for:**
- **Windows 3.1 aesthetic** → Use `windows-3-1-web-designer` (flatter, Program Manager, no gradients)
- **Vaporwave/synthwave themes** → Use `vaporwave-glassomorphic-ui-designer` (neon colors, different era)
- **macOS/iOS styling** → Use `native-app-designer` (different design language)
- **Modern flat design** → Use `web-design-expert` (Material, minimalist approaches)
- **Windows XP/Vista/7 styles** → Use `modern-windows-designer` (different visual systems)
- **Gaming/entertainment apps** → Use `game-ui-designer` (different interaction paradigms)

**Delegate to other skills when:**
- Client wants authentic Windows 3.1 (pre-Start menu era)
- Design needs modern accessibility compliance beyond Win95 patterns
- Project requires native mobile app patterns (iOS/Android guidelines)
- Brand guidelines conflict with Win95 aesthetic choices
- Performance requires eliminating CSS gradients and shadows