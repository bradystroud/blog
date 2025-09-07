# Copilot Memory

These are important details about the project that you maintain and refer to when working on the codebase.

- Never do raw CSS only use tailwind, customize with tailwind config
- AI blog generation feature with caching implemented for non-existent blog posts
- **STREAMING**: AI blog generation supports streaming for real-time content display with proper timeout handling
- Streaming API endpoint accepts `stream: true` parameter for real-time generation
- Client component handles streaming with real-time content updates and indicators
- Server-side caching uses file system in `.ai-blog-cache/` directory with 24-hour expiry (DEV ONLY)
- Client-side caching uses localStorage with 2-hour expiry for faster subsequent loads
- Cache management API available at `/api/cache-management` for clearing cache
- AI blog component shows cache status to users with ⚡ indicator and streaming status
- Blog pages use `fallback: true` with ISR revalidation for deployment resilience
- Graceful fallback handling when TinaCMS is unavailable in production
- **CRITICAL**: TinaCMS useTina hook causes build failures with "Cannot read properties of null (reading 'split')" error during Next.js prerendering
- Temporarily disabled useTina hook import and usage to prevent build failures - using static data instead
- Build issues occur during prerendering of `/en/blogs/[filename]` routes when TinaCMS is unavailable
- Need to investigate TinaCMS build-time compatibility or implement proper conditional loading
- **SOLUTION**: 404 page now handles AI blog generation for non-existent blog posts, eliminating complex TinaCMS build issues
- Header component requires null safety for `data?.nav` access to prevent undefined errors
- **PRODUCTION**: Vercel serverless functions cannot write to filesystem - cache disabled in production/Vercel
- **TIMEOUT**: 8-second timeout limit implemented to prevent Vercel's 10-second serverless timeout errors
- **OPTIMIZATION**: Reduced token limits to 700 max completion tokens for faster generation
- **FALLBACK**: Robust fallback content system when OpenAI API fails or times out
- **ERROR HANDLING**: Comprehensive error handling prevents production crashes
