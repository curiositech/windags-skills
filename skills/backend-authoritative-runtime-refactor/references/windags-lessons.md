# WinDAGs Lessons From The Desktop Push

These failures should become permanent design constraints.

## 1. Visibility before approval

Do not ask the user to accept, reject, or execute a plan until the artifact is visible in the same product surface.

## 2. Hidden-process semantics matter

On macOS, closing a window and hiding an app are not the same as quitting it. Launch flows must account for stale hidden processes.

## 3. Duplicate review surfaces drift

If runtime contract data is summarized in more than one window, the user will eventually distrust all of them. Keep one shared contract object and project from it.

## 4. Small text is an architecture smell

Unreadable metadata usually means too much data is competing for the same surface. Solve the surface and hierarchy problem, not just the font-size complaint.

## 5. Graph, timeline, and hierarchy must answer different questions

If they all show the same thing, the model is wrong or the surfaces are duplicated.
