# Copilot Memory

These are important details about the project that you maintain and refer to when working on the codebase.

- Never do raw CSS only use tailwind, customize with tailwind config
- AI blog generation feature with caching implemented for non-existent blog posts
- Server-side caching uses file system in `.ai-blog-cache/` directory with 24-hour expiry
- Client-side caching uses localStorage with 2-hour expiry for faster subsequent loads
- Cache management API available at `/api/cache-management` for clearing cache
- AI blog component shows cache status to users with ⚡ indicator
- Blog pages use `fallback: true` with ISR revalidation for deployment resilience
- Graceful fallback handling when TinaCMS is unavailable in production
- **CRITICAL**: TinaCMS useTina hook causes build failures with "Cannot read properties of null (reading 'split')" error during Next.js prerendering
- Temporarily disabled useTina hook import and usage to prevent build failures - using static data instead
- Build issues occur during prerendering of `/en/blogs/[filename]` routes when TinaCMS is unavailable
- Need to investigate TinaCMS build-time compatibility or implement proper conditional loading
