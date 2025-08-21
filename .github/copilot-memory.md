# Copilot Memory

These are important details about the project that you maintain and refer to when working on the codebase.

- Never do raw CSS only use tailwind, customize with tailwind config
- AI blog generation feature with caching implemented for non-existent blog posts
- Server-side caching uses file system in `.ai-blog-cache/` directory with 24-hour expiry
- Client-side caching uses localStorage with 2-hour expiry for faster subsequent loads
- Cache management API available at `/api/cache-management` for clearing cache
- AI blog component shows cache status to users with ⚡ indicator