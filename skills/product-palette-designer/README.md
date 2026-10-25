# Product Palette Designer

Start with [SKILL.md](SKILL.md). Create a bespoke OKLCH color system for a
product's UI, native apps and brand assets, with light/dark semantic tokens,
Tailwind v4/shadcn guidance and a local, dependency-free palette checker/exporter.

The source is OKLCH. RGB/hex are derived compatibility exports. The fictional
Fieldnotes example demonstrates the JSON contract and an extended hue wheel;
it is not a universal recommended palette.

```bash
python3 scripts/palette.py examples/fieldnotes.palette.json --check
python3 scripts/palette.py examples/fieldnotes.palette.json --out /absolute/owned/palette-output
python3 -B -m unittest discover -s scripts -p 'test_palette.py'
```

Open the generated `preview.html` in a browser. Numeric checks cover declared
opaque sRGB pairs; visual, native, compositing, color-vision and asset QA remain
separate. See [references/toolkit.md](references/toolkit.md) for input/export
contracts and [templates/palette-handoff.md](templates/palette-handoff.md) for
delivery. Source guidance checked 2026-10-25.
