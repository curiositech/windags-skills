---
name: build-verification-expert
license: Apache-2.0
description: |
  Verifies build output integrity after code changes. Runs builds, validates artifact structure,
  checks for regressions in bundle size, asset references, and static export completeness.
  The last line of defense before a bad deploy ships.
category: Code Quality & Testing
tags:
  - build
  - verification
  - ci
  - artifacts
  - validation
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: ci-cache-optimizer
    reason: Build verification catches issues that stale CI caches silently introduce
  - skill: cloudflare-pages-cicd
    reason: Validates output structure before Cloudflare Pages deployment
  - skill: test-automation-expert
    reason: Build verification is the complement to test passes — tests pass but build broken is a real failure mode
  - skill: image-optimization-engineer
    reason: Asset size validation requires understanding image optimization tradeoffs
---

# Build Verification Expert

Systematic verification of build output after code changes. Catches the class of bugs that pass all tests but break in production: missing assets, broken static exports, inflated bundles, dead routes, and malformed sitemaps.

## When to Use

**Use for:**
- Verifying a build completes without errors or warnings after significant changes
- Checking that static site exports contain all expected routes and pages
- Validating artifact sizes haven't regressed beyond acceptable thresholds
- Confirming asset references (images, fonts, scripts) resolve to real files
- Auditing sitemap.xml and robots.txt for correctness after content changes
- Comparing build output structure against a known-good baseline
- Pre-deploy sanity checks in CI or before manual deploy
- Diagnosing "works in dev but broken in production" issues

**Do NOT use for:**
- Writing or running unit/integration tests (use `test-automation-expert`)
- Performance profiling of the running application (use `performance-profiling`)
- Setting up CI/CD pipelines (use `github-actions-pipeline-builder` or `cloudflare-pages-cicd`)
- Optimizing bundle size proactively (use `cost-optimizer` or framework-specific skills)

---

## Core Capabilities

### 1. Build Execution and Error Classification

Run the build and classify every diagnostic:

```bash
# Capture full build output with timing
time npm run build 2>&1 | tee /tmp/build-output.log

# Separate errors from warnings
grep -E "^(Error|error|ERROR)" /tmp/build-output.log > /tmp/build-errors.log
grep -iE "(warn|warning)" /tmp/build-output.log > /tmp/build-warnings.log
```

**Error classification:**

| Severity | Pattern | Action |
|----------|---------|--------|
| Fatal | `Error: Build failed`, non-zero exit code | Stop. Fix before proceeding. |
| Type error | `TS\d+:`, `Type '...' is not assignable` | Fix. These are bugs hiding as warnings. |
| Missing module | `Module not found`, `Cannot resolve` | Check imports, package.json, and tsconfig paths. |
| Deprecation | `DeprecationWarning` | Log for future cleanup, not blocking. |
| Size warning | `exceeds the recommended size limit` | Investigate if new, acceptable if known. |

**Critical rule:** A build that exits 0 but emits TypeScript errors to stderr is NOT a passing build. Many frameworks continue past type errors in dev mode. Always check `--strict` or the equivalent.

### 2. Output Structure Validation

After a successful build, verify the output directory matches expectations:

```bash
# For Next.js static export
OUTPUT_DIR="out"

# Verify critical files exist
REQUIRED_FILES=(
  "index.html"
  "404.html"
  "_next/static"
  "sitemap.xml"
  "robots.txt"
  "favicon.ico"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -e "$OUTPUT_DIR/$file" ]; then
    echo "MISSING: $file"
  fi
done

# Count HTML pages — compare against expected routes
ACTUAL_PAGES=$(find "$OUTPUT_DIR" -name "*.html" | wc -l)
echo "HTML pages found: $ACTUAL_PAGES"
```

**Framework-specific output expectations:**

| Framework | Output Dir | Key Artifacts |
|-----------|-----------|---------------|
| Next.js (static) | `out/` | `index.html`, `_next/static/`, `_next/data/` |
| Next.js (server) | `.next/` | `.next/server/`, `.next/static/` |
| Vite/React | `dist/` | `index.html`, `assets/` |
| Astro | `dist/` | Per-route HTML, `_astro/` |
| Cloudflare Pages | `out/` or `dist/` | `_worker.js` (if functions), `_headers`, `_redirects` |

### 3. Asset Reference Integrity

Broken asset references are the most common post-build failure. An image path that works in dev (via dev server magic) but fails in production (because the path is wrong relative to the output).

```bash
# Extract all asset references from HTML files
grep -rhoP '(?:src|href)="([^"]*)"' "$OUTPUT_DIR"/*.html | \
  sed 's/.*="\(.*\)"/\1/' | \
  sort -u > /tmp/referenced-assets.txt

# Check each reference resolves
while read -r ref; do
  # Skip external URLs, data URIs, and anchors
  if [[ "$ref" =~ ^(http|https|data:|#|mailto:) ]]; then
    continue
  fi

  # Resolve relative to output dir
  target="$OUTPUT_DIR/$ref"
  if [ ! -e "$target" ]; then
    echo "BROKEN REF: $ref"
  fi
done < /tmp/referenced-assets.txt
```

**Common broken reference patterns:**
- `/images/logo.png` when the actual file is at `/img/logo.png`
- Hashed filenames (`main.abc123.js`) not matching because the hash changed
- Absolute paths that assumed a subdirectory deploy but built for root
- Case sensitivity differences between macOS (case-insensitive) and Linux (case-sensitive)

### 4. Bundle Size Tracking

Size regressions are silent killers. A single unguarded import can add 200KB.

```bash
# Capture current sizes
find "$OUTPUT_DIR" -type f -name "*.js" -exec du -k {} + | sort -rn > /tmp/js-sizes.txt
find "$OUTPUT_DIR" -type f -name "*.css" -exec du -k {} + | sort -rn > /tmp/css-sizes.txt

# Total JS payload
JS_TOTAL=$(find "$OUTPUT_DIR" -name "*.js" -exec cat {} + | wc -c)
echo "Total JS: $(echo "scale=1; $JS_TOTAL / 1024" | bc)KB"

# Compare against threshold
JS_LIMIT_KB=500
JS_ACTUAL_KB=$((JS_TOTAL / 1024))
if [ "$JS_ACTUAL_KB" -gt "$JS_LIMIT_KB" ]; then
  echo "WARNING: JS bundle ($JS_ACTUAL_KB KB) exceeds limit ($JS_LIMIT_KB KB)"
fi
```

**Size budget guidance:**

| Asset Type | Warning Threshold | Hard Limit | Why |
|-----------|-------------------|------------|-----|
| Total JS | 300KB gzipped | 500KB gzipped | LCP impact on mobile |
| Single chunk | 150KB gzipped | 250KB gzipped | Parse time |
| Total CSS | 50KB gzipped | 100KB gzipped | Render blocking |
| Individual image | 200KB | 500KB | Layout shift, bandwidth |
| Total HTML per page | 100KB | 200KB | Time to first byte |

### 5. Sitemap and SEO Artifact Validation

```bash
# Validate sitemap.xml is well-formed XML
xmllint --noout "$OUTPUT_DIR/sitemap.xml" 2>&1

# Extract URLs from sitemap and verify they correspond to real pages
grep -oP '<loc>\K[^<]+' "$OUTPUT_DIR/sitemap.xml" | while read -r url; do
  # Convert URL to local path
  path=$(echo "$url" | sed 's|https\?://[^/]*||')
  local_path="$OUTPUT_DIR${path}index.html"

  if [ ! -f "$local_path" ] && [ ! -f "$OUTPUT_DIR${path%.html}.html" ]; then
    echo "SITEMAP ORPHAN: $url has no corresponding page"
  fi
done

# Check robots.txt
if [ -f "$OUTPUT_DIR/robots.txt" ]; then
  echo "robots.txt exists"
  # Verify sitemap reference
  grep -q "Sitemap:" "$OUTPUT_DIR/robots.txt" || echo "WARNING: robots.txt missing Sitemap directive"
else
  echo "WARNING: No robots.txt found"
fi
```

### 6. Static Export Completeness

For statically exported sites, every route must produce an HTML file:

```bash
# Extract all internal links from the built site
grep -rhoP 'href="(/[^"]*)"' "$OUTPUT_DIR" | \
  sed 's/href="//;s/"//' | \
  sort -u > /tmp/internal-links.txt

# Check each link resolves to a file
while read -r link; do
  # Try both /path/index.html and /path.html
  if [ ! -f "$OUTPUT_DIR${link}index.html" ] && \
     [ ! -f "$OUTPUT_DIR${link}.html" ] && \
     [ ! -f "$OUTPUT_DIR${link}" ]; then
    echo "DEAD INTERNAL LINK: $link"
  fi
done < /tmp/internal-links.txt
```

---

## Decision Points

### When to Fail vs Warn

| Condition | Verdict | Reasoning |
|-----------|---------|-----------|
| Build exits non-zero | FAIL | Obvious. Nothing to verify. |
| TypeScript errors in output | FAIL | Type errors are bugs. Period. |
| Missing route HTML file | FAIL | 404 in production. |
| Broken asset reference | FAIL | Visible breakage to users. |
| Bundle size exceeds hard limit | FAIL | Performance degradation ships. |
| Bundle size exceeds warning threshold | WARN | Investigate, but may be intentional. |
| Deprecation warnings | WARN | Track, schedule cleanup. |
| New unrecognized file type in output | WARN | Could be intentional, could be accidental. |
| Sitemap URL with no page | WARN | SEO issue, not user-facing breakage. |

### Build Comparison Strategy

When comparing against a baseline:

1. **Always compare against the last known-good build**, not against "what I expect."
2. Store baselines as JSON manifests: `{ "files": [...], "sizes": {...}, "routes": [...] }`
3. Diff the manifests to surface additions, removals, and size changes.
4. New files are usually fine. Missing files are usually bad.

---

## Anti-Patterns

### Anti-Pattern: "Build Passed, Ship It"

**What it looks like:** CI shows green checkmark because `npm run build` exited 0.

**Why wrong:** A zero exit code means the build tool finished. It does not mean the output is correct, complete, or deployable. Frameworks routinely exit 0 while emitting warnings about missing pages, oversized bundles, or unresolved imports that fall back to runtime errors.

**Instead:** Run explicit post-build verification. The build command is step 1. Verification is step 2. They are not the same step.

### Anti-Pattern: Manual Spot-Checking

**What it looks like:** Developer opens the built site in a browser, clicks around for 30 seconds, says "looks good."

**Why wrong:** Humans cannot visually verify 50 routes, 200 asset references, and bundle sizes in 30 seconds. They check the homepage and maybe one other page.

**Instead:** Automated scripts that exhaustively check every route and asset. Human review is for visual fidelity, not structural integrity.

### Anti-Pattern: Ignoring Warnings

**What it looks like:** Build output shows 47 warnings. Developer says "those have always been there."

**Why wrong:** Warning count creep is how technical debt compounds. Each warning was once new. Nobody investigated it. Now there are 47 and nobody reads them. The 48th warning — the one that actually matters — is invisible.

**Instead:** Treat warning count as a ratchet. Today's count is the ceiling. New warnings must be resolved or explicitly acknowledged before merge. Track warning count in CI and fail if it increases.

### Anti-Pattern: Size Limits Without Context

**What it looks like:** "Our bundle limit is 500KB" applied uniformly to every page.

**Why wrong:** A landing page and an admin dashboard have different size budgets. The landing page needs to be fast for first-time visitors on mobile. The admin dashboard is used by logged-in users on desktop who will tolerate a larger initial load.

**Instead:** Per-route or per-entry-point size budgets. Use tools like `bundlesize`, `size-limit`, or `next/bundle-analyzer` to set granular limits.

---

## Quality Checklist

Before declaring a build verified:

- [ ] Build completed with exit code 0
- [ ] Zero TypeScript/compilation errors in output log
- [ ] All expected route HTML files exist in output directory
- [ ] All asset references (src, href) resolve to real files in output
- [ ] No case-sensitivity mismatches between references and filenames
- [ ] Bundle sizes within established budgets (JS, CSS, images)
- [ ] sitemap.xml is well-formed and all URLs correspond to real pages
- [ ] robots.txt exists and references the sitemap
- [ ] favicon.ico and meta assets present
- [ ] No new warnings introduced (warning count stable or decreased)
- [ ] Output directory contains no unexpected large files (>1MB)
- [ ] If static export: internal links all resolve to HTML files
- [ ] If Cloudflare/Vercel/Netlify: platform-specific files present (`_redirects`, `_headers`, `_worker.js`)

---

## Output Contract

This skill produces:
- **Build verification report** listing pass/fail/warn for each check category
- **Size diff** comparing current build against baseline (if baseline exists)
- **Broken reference list** with file:line locations of each broken asset reference
- **Route coverage report** mapping expected routes to their HTML file presence
- **Actionable fix list** prioritized by severity (FAIL items first, then WARN)

## References

- `references/build-manifest-schema.md` -- JSON schema for build baseline manifests used in comparisons
- `references/framework-output-maps.md` -- Expected output structures for Next.js, Vite, Astro, and Cloudflare Pages
