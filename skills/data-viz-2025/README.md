# Data Visualization

Build web charts around a reader's question. The skill covers graphical integrity, mark and scale choices, direct labeling, small multiples, responsive layouts, and accessible data alternatives.

## Start with the example

Render the React component in an existing app. The component imports its own stylesheet and needs no chart library.

```tsx
import { EditorialSignupReport } from "./assets/example-chart";

export function Report() {
  return <EditorialSignupReport />;
}
```

The chart and expandable table share illustrative weekly signup data. Panels share a scale, and the referral series leaves a gap where no count was recorded. The example shows the underlying values without requiring a mouse.

- [Skill instructions](SKILL.md) describe when to start, what to check, and how to hand off.
- [Chart asset](assets/example-chart.tsx) and [stylesheet](assets/example-chart.css) provide the working example.
- [Data transformations](scripts/data-transform.ts) and [test helpers](scripts/chart-test-helpers.ts) support preparation and verification.
- [Matching requests](references/tool2vec-queries.json) are sample user requests for the WinDAGs search vector.
