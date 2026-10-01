# Reference Index

Load only the file that answers the blocking question. Do not read the whole tree.

| File | Topic | When to load |
|---|---|---|
| `references/when-to-use-glass.md` | Layer model, regular vs clear, dimming, tint, scroll edge effects, bars, sheets | Deciding whether and where glass goes; reviewing a screen |
| `references/material-anatomy.md` | Lensing, blur, specular, shadow, adaptivity, size; house web approximations | Imitating the material anywhere custom (web, Metal) |
| `references/shape-and-concentricity.md` | Capsules, fixed, concentric radii; control sizes; APIs | Corners look pinched/flared; nesting shapes |
| `references/motion-and-interaction.md` | Materialize, morph, interactive press, container spacing | Animating glass; morph not happening |
| `references/accessibility-fallbacks.md` | Reduce Transparency, Increase Contrast, Reduce Motion, user glass look; native and web code | Any custom or web glass; accessibility review |
| `references/legibility-contrast.md` | Measuring text-on-glass contrast; checker usage; thresholds | Text sits on glass over variable content |
| `references/swiftui-recipes.md` | Verified SwiftUI APIs and code | SwiftUI implementation |
| `references/uikit-appkit-recipes.md` | Verified UIKit and AppKit APIs and code | UIKit or AppKit implementation |
| `references/web-decision-tree.md` | Choosing GPU vs library vs CSS; perf gates | Any web glass |
| `references/web-gpu-postprocess.md` | In-pipeline glass pass: SDF bevel, refraction, chroma, Fresnel, specular, tint (WGSL + GLSL) | Glass over a WebGL/WebGPU canvas |
| `references/web-library-route.md` | ybouane/liquidglass options and trade-offs | Showcase pages, few panels, mostly static backdrop |
| `references/web-css-route.md` | `backdrop-filter`, SVG `feDisplacementMap`, Backdrop Root, support, jitter traps | Ordinary DOM pages |
| `references/failure-modes.md` | Catalogue of failures with detection and fixes | Reviews and postmortems |
| `references/platform-timeline.md` | What shipped when (26.0, 26.1, 27) and renamed betas | Version gating; "does this API exist on X?" |
| `references/sources.md` | Primary sources with URLs and dates | Citing or re-verifying |
