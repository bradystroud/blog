# Practical Lighthouse Optimizations for React and Next.js

A focused checklist and examples to improve Lighthouse (Performance, Accessibility, Best Practices, SEO) for modern React and Next.js applications.

## Start with metrics: What to measure

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

Run Lighthouse locally and in CI (Lighthouse CI or GitHub Actions) to prevent regressions.

## Server-side rendering and static generation

- Prefer Next.js getStaticProps/getStaticPaths for public content.
- Use getServerSideProps only when dynamic per-request data is required.
- Static pages served from CDN have lower TTFB and better LCP.

## Reduce JS payload

- Use dynamic imports for heavy components:

```js
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('../components/Chart'), { ssr: false })
```

- Remove unused libraries and prefer lighter alternatives.
- Analyze bundle with next build && npx next-bundle-analyzer.

## Images

- Use next/image for automatic resizing and formats
- Serve AVIF/WebP when supported
- Use responsive sizes and lazy loading for offscreen images

## Fonts and CSS

- Preload critical fonts and use font-display: swap
- Minimize critical CSS; extract only what's needed for initial render

Example head rel preload:

```html
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>
```

## Caching and CDN

- Use immutable caching headers for static assets
- Use edge/CDN for HTML where possible (Next.js ISR, Vercel/Cloudflare)

## Measure in CI

- Integrate Lighthouse CI to fail builds when scores drop
- Capture field data with Real User Monitoring (RUM)

## Bonus: Accessibility quick wins

- Ensure meaningful alt text for images
- Proper color contrast
- Semantic HTML and landmarks

## Checklist (quick)

- [ ] Run Lighthouse and baseline scores
- [ ] Enable SSR/SSG where appropriate
- [ ] Trim JS bundles and remove polyfills where possible
- [ ] Optimize images and fonts
- [ ] Add CI checks for Lighthouse

---

Want a pre-configured Next.js repo with Lighthouse CI, image configs, and a sample GitHub Action? I can draft that next.
