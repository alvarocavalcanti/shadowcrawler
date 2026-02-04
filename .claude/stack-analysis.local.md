# Owlbear Extensions Stack Analysis & Recommendations

## Current Stack Analysis

### Common Technologies Across All 3 Extensions

**Core Stack:**

- React 18 + React-DOM
- Bootstrap 5 + react-bootstrap
- Vite (build tool)
- TypeScript
- react-router-dom
- @owlbear-rodeo/sdk

**Additional Libraries:**

- Analytics: @analytics/google-analytics, analytics, @vercel/analytics, @vercel/speed-insights
- Icons: @fortawesome packages (multiple icon sets)
- Markdown: remarkable, react-markdown (inconsistent)
- Utils: file-saver, js-yaml, react-youtube

**Bundle Sizes (shadowcrawler example):**

- JavaScript: ~270 KB
- CSS: ~226 KB
- **Total: ~496 KB** (plus additional assets)

**Dependencies Count:**

- shadowcrawler: 32 packages
- map-location-keys: 29 packages
- sheet-from-beyond: 22 packages

### Issues with Current Stack

1. **Large Bundle Sizes**: Bootstrap CSS alone is ~200KB, Bootstrap JS components add significant weight
2. **Heavy Icon Libraries**: FontAwesome loads entire icon sets when only a few icons are used
3. **Inconsistent Markdown**: Different renderers across projects (remarkable vs react-markdown)
4. **Multiple Analytics Packages**: Redundant analytics libraries
5. **No Code Splitting**: Monolithic bundles without lazy loading
6. **Dependency Bloat**: Each project has 20-40+ dependencies
7. **Security Surface**: More dependencies = more potential vulnerabilities (like the prismjs issue)

## Recommended Modern Stack

### Option 1: Vite + React + Tailwind CSS (Recommended)

**Why This Stack:**

- **Smaller bundles**: Tailwind purges unused CSS, typically results in <10KB CSS
- **Better performance**: No runtime CSS-in-JS, faster builds with Vite
- **Simpler**: Fewer dependencies, easier maintenance
- **Modern DX**: Better TypeScript support, HMR, native ESM

**Stack:**

```json
{
  "dependencies": {
    "@owlbear-rodeo/sdk": "^2.4.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.3",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.5",
    "vite": "^6.4.1"
  }
}
```

**Benefits:**

- **~70% smaller bundles**: Estimated 50-80KB CSS, 150-200KB JS
- **12-15 total dependencies** (vs 20-40 currently)
- **Lucide icons**: Tree-shakeable, import only what you need (~2-5KB vs 200KB+)
- **Faster builds**: Vite's native ESM is faster than webpack-based tools
- **Modern utilities**: Tailwind's utility classes reduce custom CSS
- **Better maintenance**: Fewer dependencies to update

**Migration Effort:** Medium (2-3 days per project)

### Option 2: Vite + Preact + Tailwind CSS (Maximum Performance)

**For ultra-lightweight extensions:**

- Replace React with Preact (3KB vs 40KB)
- Same API with preact/compat
- **~60% smaller runtime**

**Benefits:**

- **Smallest possible bundles**: <30KB CSS, <100KB JS
- Perfect for simple extensions like sheet-from-beyond
- Same DX as React

**Migration Effort:** Low-Medium (add preact alias in vite.config)

### Option 3: Astro + React Islands (Future-Proof)

**For content-heavy extensions with marketing pages:**

- Astro for static pages (homepage)
- React islands for interactive components
- Zero JS for static content

**Benefits:**

- **Best of both worlds**: Static where possible, dynamic where needed
- **Progressive enhancement**: Works without JS
- **Excellent SEO**: Great for marketing pages

**Migration Effort:** High (requires restructuring)

## Specific Recommendations

### Replace Bootstrap with Tailwind CSS

**Current (Bootstrap):**

```tsx
<Button variant="primary" size="lg">
  Click me
</Button>
```

**Recommended (Tailwind):**

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>
```

**Benefits:**

- No runtime JS for styling
- Purged CSS = only ship what you use
- ~95% smaller CSS bundle
- More customizable without fighting framework defaults

### Replace FontAwesome with Lucide React

**Current (FontAwesome):**

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

<FontAwesomeIcon icon={faCoffee} />
```

**Recommended (Lucide):**

```tsx
import { Coffee } from 'lucide-react'

<Coffee className="w-6 h-6" />
```

**Benefits:**

- Tree-shakeable: ~1KB per icon vs entire library
- Consistent design system
- TypeScript-first
- More modern icon set

### Standardize Markdown Rendering

**Recommended: react-markdown**

- More maintained than remarkable
- Better security (no HTML by default)
- Plugin ecosystem (syntax highlighting, etc.)

### Consolidate Analytics

**Replace:**

- @analytics/google-analytics
- analytics
- @vercel/analytics
- @vercel/speed-insights

**With:**

- Single analytics solution (choose one: Vercel Analytics OR Google Analytics)
- Use native integration rather than wrapper libraries

### Remove Unnecessary Dependencies

**Audit and remove:**

- react-youtube: Use native iframe or lite-youtube-embed
- file-saver: Use native File/Blob APIs
- js-yaml: Only if absolutely needed, consider JSON instead

## Migration Strategy

### Phase 1: Low-Hanging Fruit (1-2 days per project)

1. Replace FontAwesome with Lucide React
2. Consolidate analytics packages
3. Remove unused dependencies
4. Add bundle analyzer

**Expected Improvement:** ~30% bundle size reduction

### Phase 2: Styling Migration (2-3 days per project)

1. Install Tailwind CSS
2. Migrate components one by one
3. Remove Bootstrap
4. Configure Tailwind purge

**Expected Improvement:** ~50-60% total bundle size reduction

### Phase 3: Optimization (1-2 days per project)

1. Implement code splitting
2. Lazy load routes
3. Optimize images
4. Configure Vite for production

**Expected Improvement:** ~20-30% additional improvement

## Estimated Results

**Current:**

- Bundle: ~500KB (gzipped: ~150KB)
- Dependencies: 20-40 packages
- Build time: ~2-3 seconds

**After Migration:**

- Bundle: ~150-200KB (gzipped: ~50-60KB)
- Dependencies: 12-15 packages
- Build time: ~1-2 seconds
- **~70% smaller, ~50% faster builds**

## Example Tailwind Config

```js
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Match Owlbear Rodeo theme if needed
      colors: {
        'obr-dark': '#1a1a1a',
        'obr-light': '#ffffff',
      }
    },
  },
  plugins: [],
  // Enable dark mode based on OBR theme
  darkMode: ['class', '[data-bs-theme="dark"]'],
}
```

## Conclusion

**Recommended Stack: Vite + React + Tailwind CSS + Lucide Icons**

This modernization will:

- ✅ Reduce bundle sizes by ~70%
- ✅ Cut dependencies by ~60%
- ✅ Improve build performance by ~50%
- ✅ Reduce security surface area
- ✅ Improve maintainability
- ✅ Keep familiar React DX
- ✅ Future-proof the codebase

**Next Steps:**

1. Start with one project (recommend: sheet-from-beyond - simplest)
2. Measure before/after metrics
3. Document learnings
4. Apply to other projects
5. Create shared component library for common patterns
