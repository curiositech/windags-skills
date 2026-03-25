---
license: Apache-2.0
name: image-optimization-engineer
description: 'Optimize web images for performance with Next.js Image, responsive srcset, AVIF/WebP, lazy loading, and blur placeholders. Activate on: image optimization, LCP improvement, responsive images, AVIF, blur placeholder, next/image. NOT for: image generation/editing (use image-gen skills), SVG icon systems (use design-system-creator).'
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*)
category: Design & Creative
tags:
  - images
  - performance
  - next-image
  - avif
  - responsive
pairs-with:
  - skill: react-performance-optimizer
    reason: Images are often the largest LCP element -- optimization directly improves Core Web Vitals
  - skill: responsive-layout-master
    reason: Responsive images must coordinate with responsive layouts for correct sizing
---

# Image Optimization Engineer

Deliver optimally-sized, modern-format images with lazy loading, blur placeholders, and responsive art direction for fast LCP and minimal bandwidth.

## Activation Triggers

**Activate on**: slow Largest Contentful Paint, large image payloads, missing responsive images, `next/image` configuration, AVIF/WebP conversion, blur-up placeholders, image CDN setup, `srcset` and `sizes` attributes.

**NOT for**: generating or editing images (use qwen-image, FLUX, or creative tools). SVG icon sprite systems -- use design-system-creator. Video optimization -- different domain entirely.

## Quick Start

1. **Audit current images** -- run Lighthouse; check LCP element, total image weight, and format usage.
2. **Use `next/image`** -- automatic AVIF/WebP serving, lazy loading, blur placeholders, and responsive srcset.
3. **Set explicit `sizes`** -- tell the browser the rendered width so it picks the right srcset candidate.
4. **Generate blur placeholders** -- use `plaiceholder` or Next.js built-in `placeholder="blur"` for static imports.
5. **Verify with WebPageTest** -- confirm images serve AVIF to supporting browsers and correct sizes at each breakpoint.

## Core Capabilities

| Domain | Technologies | Key Patterns |
|--------|-------------|--------------|
| Framework Integration | `next/image`, Astro `<Image>`, Vite `vite-imagetools` | Automatic optimization at build/request time |
| Modern Formats | AVIF, WebP, fallback JPEG/PNG | Content negotiation via `Accept` header |
| Responsive Images | `srcset`, `sizes`, `<picture>` | Art direction, resolution switching |
| Lazy Loading | `loading="lazy"`, Intersection Observer | Defer off-screen images |
| Placeholders | LQIP (blur), solid color, blurhash | Perceived performance during load |
| CDN/Loaders | Cloudflare Images, Imgix, Cloudinary | On-the-fly resize, format conversion, caching |

## Architecture Patterns

### Pattern 1: Next.js Image with Proper Sizing

```typescript
import Image from 'next/image';

// Static import -- enables automatic blur placeholder
import heroImage from '@/public/images/hero.jpg';

export function HeroSection() {
  return (
    <Image
      src={heroImage}
      alt="Product hero shot showing the dashboard in action"
      placeholder="blur"          // automatic blurhash from static import
      priority                     // preload -- this is the LCP element
      sizes="100vw"                // full-width hero
      quality={85}
      className="w-full h-auto object-cover"
    />
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <Image
          key={product.id}
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"            // NOT priority -- below the fold
          placeholder="blur"
          blurDataURL={product.blurHash}
        />
      ))}
    </div>
  );
}
```

### Pattern 2: Art Direction with `<picture>`

When you need different crops/aspect ratios at different breakpoints:

```typescript
export function ResponsiveHero({ image }: { image: HeroImage }) {
  return (
    <picture>
      {/* Mobile: square crop */}
      <source
        media="(max-width: 639px)"
        srcSet={`${image.mobileUrl}?w=640&format=avif 1x, ${image.mobileUrl}?w=1280&format=avif 2x`}
        type="image/avif"
      />
      <source
        media="(max-width: 639px)"
        srcSet={`${image.mobileUrl}?w=640&format=webp 1x, ${image.mobileUrl}?w=1280&format=webp 2x`}
        type="image/webp"
      />
      {/* Desktop: wide crop */}
      <source
        media="(min-width: 640px)"
        srcSet={`${image.desktopUrl}?w=1200&format=avif 1x, ${image.desktopUrl}?w=2400&format=avif 2x`}
        type="image/avif"
      />
      <source
        media="(min-width: 640px)"
        srcSet={`${image.desktopUrl}?w=1200&format=webp 1x, ${image.desktopUrl}?w=2400&format=webp 2x`}
        type="image/webp"
      />
      {/* Fallback */}
      <img
        src={`${image.desktopUrl}?w=1200&format=jpeg`}
        alt={image.alt}
        loading="eager"
        decoding="async"
        className="w-full h-auto"
      />
    </picture>
  );
}
```

### Image Pipeline Architecture

```
  ┌─ Source Image (4000x3000 JPEG, 8MB) ──────────────┐
  │                                                     │
  │  Build/CDN Pipeline:                                │
  │  ├─ Resize: 640, 960, 1280, 1920, 2560            │
  │  ├─ Format: AVIF (best), WebP (fallback), JPEG     │
  │  ├─ Quality: 80 (AVIF), 85 (WebP), 85 (JPEG)      │
  │  └─ Generate: blur placeholder (32x32 base64)      │
  │                                                     │
  │  Browser receives (via content negotiation):        │
  │  ├─ Chrome/Edge: AVIF @ matched width (~40KB)       │
  │  ├─ Safari 16+: WebP @ matched width (~60KB)        │
  │  └─ Legacy: JPEG @ matched width (~90KB)            │
  │                                                     │
  │  Result: 8MB → 40-90KB (98% reduction)              │
  └─────────────────────────────────────────────────────┘
```

## Anti-Patterns

1. **Missing `sizes` attribute** -- without it, the browser assumes the image is `100vw` and downloads the largest srcset candidate. A 25vw grid image downloads 4x too large.
2. **`priority` on every image** -- preloads them all, defeating the purpose. Only the LCP element (usually the hero image) should have `priority`.
3. **Serving PNG for photographs** -- PNG is lossless and 5-10x larger than AVIF for photos. Use PNG only for graphics with transparency and sharp edges; AVIF/WebP for photos.
4. **No explicit `width` and `height`** -- causes Cumulative Layout Shift (CLS) because the browser cannot reserve space before the image loads. Always set dimensions or use `aspect-ratio`.
5. **Blur placeholder on tiny thumbnails** -- the blur placeholder adds ~300 bytes of inline base64. For 32x32 thumbnails, that is larger than the image itself. Skip placeholders for small images.

## Quality Checklist

- [ ] LCP image has `priority` (or `fetchpriority="high"`) and is preloaded
- [ ] All images specify `sizes` attribute matching their actual rendered width at each breakpoint
- [ ] AVIF served to supporting browsers (verify with DevTools Network panel `Type` column)
- [ ] `width` and `height` set on every `<img>` (CLS score = 0 for images)
- [ ] Off-screen images use `loading="lazy"` (not `priority`)
- [ ] Blur placeholders on hero/above-fold images for perceived performance
- [ ] No images over 200KB at their served resolution
- [ ] `decoding="async"` set on non-critical images
- [ ] Image CDN or `next/image` handles format negotiation (no manual `<picture>` unless art direction needed)
- [ ] Lighthouse image audit passes with no "properly size images" or "serve modern formats" warnings
