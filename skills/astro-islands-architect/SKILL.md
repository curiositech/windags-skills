---
name: astro-islands-architect
description: 'Use when building content-heavy sites with Astro, deciding between SSG/SSR/hybrid, choosing client directives (idle/visible/load/media), structuring content collections with type-safe schemas, integrating React/Vue/Solid/Svelte components in the same project, or migrating from Next.js for marketing/docs. Triggers: client:idle vs client:load tradeoffs, content collections schema with zod, image optimization via @astrojs/image, view transitions, server islands, MDX layouts. NOT for SPA-style apps that need full interactivity (use Next/Remix), Astro internals/plugin authoring, or non-content sites where islands provide no benefit.'
category: Frontend & UI
tags:
  - astro
  - islands
  - ssg
  - mdx
  - content
  - frontend
---

# Astro Islands Architect

Astro is "ship HTML by default, hydrate only what needs JS." For marketing, docs, and content-heavy sites, this produces dramatically smaller bundles than React/Next.js. The whole game is choosing which components are static and which are islands.

## When to use

- Marketing site, blog, docs portal — content is the product.
- Migrating from a Next.js marketing site that's overweight on client JS.
- Multi-framework — a React component lib used alongside Vue or Svelte components.
- Heavy content authoring with MDX + type-safe frontmatter.
- View transitions across pages without a SPA.

## Core capabilities

### Page structure

```astro
---
// src/pages/blog/[slug].astro — frontmatter runs at build/SSR time
import { getCollection, getEntry } from 'astro:content';
import Layout from '../../layouts/Default.astro';
import Newsletter from '../../components/Newsletter.tsx';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((p) => ({ params: { slug: p.slug }, props: { post: p } }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<Layout title={post.data.title}>
  <h1>{post.data.title}</h1>
  <article><Content /></article>

  {/* Island — only this component ships JS */}
  <Newsletter client:visible />
</Layout>
```

The `---` fences are server code. Inside `<...>`, the default is static HTML. Components with `client:*` directives become islands.

### Client directives — pick the right one

| Directive | When it hydrates | Use for |
|-----------|-------------------|---------|
| `client:load` | Page load | Above-the-fold interactive (cart, search). |
| `client:idle` | When the browser is idle | Non-critical interactive (chat widget). |
| `client:visible` | When scrolled into viewport | Below-the-fold (newsletter signup, comments). |
| `client:media="(min-width: 768px)"` | When the media query matches | Desktop-only widgets. |
| `client:only="react"` | Skip SSR; client-only render | Components that need browser APIs at mount. |

`client:idle` is the right default for most non-critical islands. `client:load` is the heavy hammer; reserve it.

### Content collections

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',                    // markdown/MDX files
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(160),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.object({ src: z.string(), alt: z.string() }).optional(),
  }),
});

export const collections = { blog };
```

Now `getCollection('blog')` is fully typed. Frontmatter mistakes fail the build, not production.

```ts
const posts = (await getCollection('blog'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => +b.data.date - +a.data.date);
```

### Multi-framework

```bash
npx astro add react vue svelte
```

```astro
---
import ReactSearch from '../components/Search.tsx';
import VueChart from '../components/Chart.vue';
import SvelteToggle from '../components/Toggle.svelte';
---
<ReactSearch client:idle />
<VueChart client:visible />
<SvelteToggle client:load />
```

Each framework's runtime is bundled separately and loaded only on pages that use it. For a docs site that's mostly static, this can mean shipping zero React JS to most pages.

### Server islands (Astro 4+)

```astro
<Layout>
  <Header />
  <PersonalizedRecommendations server:defer>
    <p slot="fallback">Loading recommendations...</p>
  </PersonalizedRecommendations>
  <Footer />
</Layout>
```

`server:defer` renders the rest of the page immediately and streams the deferred component's HTML in via a separate request. Useful for personalized content that would otherwise force the whole page to be SSR.

### Image optimization

```astro
---
import { Image } from 'astro:assets';
import cover from '../assets/cover.jpg';
---
<Image src={cover} alt="Cover photo" widths={[400, 800, 1200]} sizes="(max-width: 768px) 400px, 1200px" />
```

Astro generates srcset, runs Sharp for resizing, and ships only what's needed. Place images under `src/assets/` for full optimization; `public/` is unprocessed.

### View transitions

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
  </head>
  ...
</html>
```

```astro
<a href="/about" transition:name="hero">About</a>
```

Cross-page transitions without a SPA. The browser does most of the work; Astro coordinates element matching.

### MDX with components

```mdx
---
title: My post
date: 2026-04-30
---

import Callout from '../../components/Callout.astro';

# {frontmatter.title}

<Callout type="warn">
This is a warning rendered server-side. No JS.
</Callout>
```

Components imported in MDX run at build/SSR time unless they're islands.

### Hybrid SSR

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
});
```

```astro
---
// src/pages/api/search.ts — runs on the edge
export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? '';
  const results = await search(q);
  return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
}
```

`prerender = false` opts a route into SSR; the rest of the site stays static.

## Anti-patterns

### `client:load` everywhere

**Symptom:** Lighthouse JS bundle bloats; Astro's hydration story disappears.
**Diagnosis:** Engineers default to `client:load` because it's the most familiar.
**Fix:** Default to `client:idle` or `client:visible`. Reserve `client:load` for above-the-fold interactive.

### Fetching data in client components

**Symptom:** Loading spinners on every page; SEO hurt.
**Diagnosis:** Data fetching moved to React components instead of the Astro frontmatter.
**Fix:** Fetch in the `---` fences, render server-side, pass data as props to islands.

### Untyped frontmatter

**Symptom:** Build succeeds; production shows `undefined` in titles.
**Diagnosis:** No content collection schema; typo in frontmatter went unnoticed.
**Fix:** Use `defineCollection` with a zod schema. Frontmatter mistakes fail the build.

### Mixing `public/` and `src/assets/` for images

**Symptom:** Some images optimized, others ship at original size.
**Diagnosis:** `public/` is served as-is; only `src/assets/` runs through Sharp.
**Fix:** Move images to `src/assets/`. Use `<Image>` everywhere. `public/` only for OG images and favicons.

### Trying to use Astro for a SPA

**Symptom:** Constant battle with hydration; islands grow until the entire page is interactive.
**Diagnosis:** Wrong framework for the job. Astro shines for content; SPAs need Next/Remix.
**Fix:** Reach for Next/Remix when most pages are interactive. Use Astro for marketing + docs.

### Overusing `client:only`

**Symptom:** Layout shift (CLS) on every page load; "blink" before content appears.
**Diagnosis:** Skipping SSR means the browser sees an empty placeholder until JS runs.
**Fix:** Use `client:only` only when the component truly can't render server-side. Provide a placeholder that approximates the final size.

## Quality gates

- [ ] Default client directive is `client:idle` or `client:visible`; `client:load` justified per use.
- [ ] All content has a typed schema via `defineCollection`.
- [ ] Images live under `src/assets/` and use the `<Image>` component.
- [ ] Multi-framework integrations (`@astrojs/react`, etc.) added only for components that exist.
- [ ] LCP under 2s on the slowest representative page.
- [ ] First-load JS budget set per page; CI fails on regressions.
- [ ] MDX uses Astro components for static parts; islands only where interactive.
- [ ] View transitions tested across the major navigation paths.

## NOT for

- **Full SPAs** — Next.js, Remix, TanStack Start are better fits.
- **Astro plugin/integration authoring** — separate skill (no dedicated skill yet).
- **Vite-side build tuning** — Astro uses Vite under the hood. → `vite-build-optimizer` for chunk sizing, HMR, plugin lifecycle issues.
- **Heavy client-state apps** (dashboards, real-time tools) — too much JS for islands to help.
- **Native mobile** — Astro is web-only.
