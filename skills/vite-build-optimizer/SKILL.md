---
name: vite-build-optimizer
description: 'Use when Vite dev startup is slow, HMR is not invalidating, the build emits chunks larger than expected, or you are authoring a Vite plugin. Triggers: "[plugin:..] failed", "Failed to resolve import", externalize warnings, dependency pre-bundling errors, lib mode + code splitting, ssr externals confusion, "Cannot find package" only in build, manualChunks tuning, optimizeDeps include/exclude tuning, rollup-plugin-visualizer review, --profile flag, configResolved/handleHotUpdate hook authoring. NOT for Webpack tuning, Turbopack-specific, Astro internals, or Bun bundler — those have their own conventions.'
category: Frontend & UI
tags:
  - vite
  - bundler
  - hmr
  - esbuild
  - rollup
  - build-tools
  - frontend
---

# Vite Build Optimizer

Vite is two tools wearing one config. In dev it's an esbuild-based ESM dev server with on-demand transforms; in prod it's a Rollup pipeline. Most Vite pain comes from confusing dev-mode behavior with prod-mode behavior.

## When to use

- Dev startup over 3s on a small app, or HMR roundtrip over 200ms.
- HMR fails silently after editing a default-exported component.
- Production build has chunks >500KB you didn't ask for, or duplicate React/lodash copies.
- A package shows up in `optimizeDeps` warnings (CJS interop edge cases).
- SSR build errors with "Cannot find package" while client build works.
- Authoring a plugin and need the right hook (transform vs handleHotUpdate vs configResolved).

## Core capabilities

### Dependency pre-bundling

Vite pre-bundles CommonJS deps to ESM and combines many small modules into one. This is dev-only.

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // Force pre-bundling for deeply-imported subpaths the scanner misses.
    include: ['lodash-es/throttle', '@scope/pkg/dist/feature'],
    // Exclude packages with their own ESM that breaks pre-bundling.
    exclude: ['@my/wasm-pkg'],
    // Pre-bundle on cold start (avoids a stutter on first request).
    holdUntilCrawlEnd: true,
  },
});
```

If the dev server thrashes (`new dependencies optimized: …` on every page load), one of your deps imports something dynamic Vite's scanner can't see — add it to `include`.

### Server warmup

Tells the dev server to transform hot files before the first request hits.

```ts
server: {
  warmup: {
    clientFiles: ['./src/components/Layout.tsx', './src/routes/_root.tsx'],
  },
}
```

### Manual chunking

The function form lets you split by source path, not just module ID.

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor';
          if (id.includes('@radix-ui')) return 'radix';
          return 'vendor';
        }
      },
    },
  },
}
```

Don't manualChunks shared modules into the same chunk as a route — you'll undo route-level code splitting.

### Resolve.dedupe — duplicate React bug

Symptoms: `Invalid hook call` in production only, or two copies of React in the bundle.

```ts
resolve: { dedupe: ['react', 'react-dom'] }
```

Common when a workspace package depends on react with a slightly different version.

### SSR externals

For a Node-target SSR build, leave deps on disk; for an edge-target, bundle most things.

```ts
ssr: {
  // Bundle these even in SSR (they assume bundler resolution).
  noExternal: ['@my-org/ui', /^@radix-ui\//],
  // Force-external — useful for native deps.
  external: ['sharp'],
}
```

Edge runtimes (Workers, Edge Functions) usually need `noExternal: true` on everything except a known node_modules allowlist, because there's no runtime `require`.

### Plugin lifecycle

| Hook | Phase | What you do here |
|------|-------|-------------------|
| `config` | before resolve | Mutate user config (add plugins, tweak `optimizeDeps`). |
| `configResolved` | after resolve | Read final config (mode, command, root) — read-only. |
| `transform(code, id)` | every module | Code transforms. Return `{ code, map }`. |
| `handleHotUpdate({ file, server, modules })` | dev only | Custom HMR — return narrowed `modules` array, or `[]` to swallow the event. |
| `generateBundle` | prod only | Inspect/mutate the final chunk graph. |

### Profiling

```bash
# CPU profile of the dev server.
node --cpu-prof node_modules/vite/bin/vite.js

# Flamegraph for prod build.
vite build --profile

# Bundle visualizer.
# vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer';
plugins: [visualizer({ filename: 'stats.html', gzipSize: true, brotliSize: true })]
```

## Anti-patterns

### Pre-bundling thrash from dynamic CJS imports

**Symptom:** Every page navigation logs `new dependencies optimized: pkg/x`. Cold reload appears to work but warm dev is sluggish.
**Diagnosis:** A dep does `require(\`./locales/${lang}\`)` or similar — Vite's scanner can't enumerate. Reload re-discovers, re-bundles, full page refresh.
**Fix:** Enumerate the imports in `optimizeDeps.include` (`pkg/x/locales/en`, `pkg/x/locales/fr`), or move the dep to `optimizeDeps.exclude` if it ships ESM.

### HMR breaking on default-exported components

**Symptom:** Editing a component triggers full reload instead of HMR.
**Diagnosis:** React Fast Refresh requires named function components for HMR to invalidate granularly. `export default function Page() {…}` works; `export default () => …` does not.
**Fix:** Name the function: `export default function PageImpl() { … }; export { PageImpl as Page }`.

### Accidental Node-polyfills bloat

**Symptom:** Browser bundle includes `buffer`, `events`, `process` polyfills you never imported.
**Diagnosis:** A dep references `process.env.NODE_ENV` or `Buffer` and a polyfill plugin (vite-plugin-node-polyfills, etc.) is auto-injecting.
**Fix:** Remove the polyfill plugin and let the build fail loudly. Replace `process.env.NODE_ENV` with `import.meta.env.MODE`. For deps you can't fix, `define` a literal: `define: { 'process.env.NODE_ENV': JSON.stringify(mode) }`.

### `import.meta.env` in code that runs in both SSR and client

**Symptom:** Client reads `VITE_PUBLIC_KEY` correctly; SSR sees `undefined`.
**Diagnosis:** `import.meta.env` is rewritten at build time per environment. SSR build resolves env vars from the SSR config; client from the client config. They're separate.
**Fix:** Pass env values explicitly into the SSR entry function rather than relying on `import.meta.env` inside library code.

### `manualChunks` accidentally bundling app code into the vendor chunk

**Symptom:** Vendor chunk is 800KB; route chunks are 5KB.
**Diagnosis:** A `manualChunks` rule like `id.includes('node_modules') || id.includes('utils')` matches both vendors and the app's `src/utils/`.
**Fix:** Use absolute path tests (`id.startsWith('/abs/path/node_modules/')`) or call `path.relative(root, id)` first.

### Missing source maps in production debugging

**Symptom:** Sentry/console shows minified column numbers.
**Diagnosis:** `build.sourcemap` defaults to `false`. Enabling it adds .map files but doesn't ship them to clients unless asked.
**Fix:** `build.sourcemap: 'hidden'` (writes maps, no `//# sourceMappingURL=` comment, upload separately).

## Quality gates

- [ ] `pnpm build` finishes in under 60s for a typical app; under 5s for a library.
- [ ] No JS chunk over 500KB unminified unless intentional.
- [ ] `dedupe` lists every framework that appears multiple times in `node_modules`.
- [ ] `optimizeDeps.include` covers every dep flagged in dev logs.
- [ ] `rollup-plugin-visualizer` output reviewed before any release.
- [ ] SSR build fails CI if a Node-only API leaks into client code (use vite-plugin-checker or a custom plugin).
- [ ] Source maps generated and uploaded to error tracker (`sourcemap: 'hidden'`).
- [ ] HMR roundtrip on a representative file under 200ms (measure: edit, ts to repaint).

## NOT for

- **Webpack tuning** → use a Webpack-specific skill.
- **Turbopack** (Next.js 15+) → different bundler, different config surface.
- **Astro internals** — Astro uses Vite but has its own collection/integrations layer. → `astro-islands-architect`.
- **Bun bundler** → `Bun.build()` API is separate.
- **esbuild standalone** → much smaller surface; use directly when Vite's plugin lifecycle is overkill.
