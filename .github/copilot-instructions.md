# Copilot Instructions for Brady Stroud's Personal Website

## Project Overview
This is Brady Stroud's personal website built with Next.js, TinaCMS, and Tailwind CSS. The site serves as a blog and portfolio showcasing Brady's work as a Software Engineer at SSW, with a focus on .NET, MAUI, Blazor, and cross-platform development.

## Architecture & Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **CMS**: TinaCMS for content management
- **Styling**: Tailwind CSS with PostCSS
- **Package Manager**: pnpm
- **Deployment**: Vercel (with analytics and speed insights)
- **Content**: MDX files for blogs, structured data for pages

## Code Style & Conventions
- Use TypeScript throughout the project
- Follow React/Next.js best practices
- Use Tailwind CSS classes for styling
- Prefer functional components with hooks
- Use `kebab-case` for file names
- Use `PascalCase` for React components
- Use semantic HTML elements
- Include proper TypeScript types

## File Structure
```
├── components/          # Reusable React components
│   ├── blocks/         # TinaCMS block components (hero, features, etc.)
│   ├── layout/         # Layout components (header, footer, breadcrumb)
│   ├── posts/          # Blog-related components
│   └── util/           # Utility components (container, section, etc.)
├── content/            # TinaCMS content files
│   ├── blogs/          # Blog posts (.mdx files)
│   ├── pages/          # Static pages (.md files)
│   └── global/         # Global site configuration
├── pages/              # Next.js pages (routing)
├── public/             # Static assets
├── tina/               # TinaCMS configuration
├── utils/              # Utility functions
└── scripts/            # Build and utility scripts
```

## Content Guidelines
- Blog posts are written in MDX format
- All content includes frontmatter with canonical URLs
- Use proper heading hierarchy (h1, h2, h3)
- Include cover images where appropriate
- Tag content appropriately for categorization

## Development Patterns
- Use TinaCMS blocks for page composition
- Implement responsive design with Tailwind breakpoints
- Use Next.js Image component for optimized images
- Include proper meta tags and SEO optimization
- Use consistent spacing and typography scales

## Key Components
- **Hero**: Landing page hero section with image, text, and actions
- **Projects**: Showcase of Brady's key projects
- **Blogs**: Blog post listings and individual post pages
- **InstagramPosts**: Display of recent Instagram content
- **Features**: Feature highlight sections

## Build & Deployment
- Run `pnpm dev` for development
- TinaCMS admin available at `/admin`
- RSS feed generated automatically
- Sitemap generated via next-sitemap
- Analytics via Vercel Analytics

## Content Focus Areas
Brady's expertise and content focus:
- .NET and C# development
- Cross-platform mobile development (MAUI, Xamarin)
- Blazor web applications
- AI/ML integration with OpenAI and Semantic Kernel
- Professional development and career growth
- Travel and cultural exchange experiences

## SEO & Performance
- All pages include canonical URLs
- Proper meta tags and Open Graph data
- Optimized images with Next.js Image component
- RSS feed for blog content
- Clean URL structure

When working on this project, prioritize:
1. Maintaining consistency with existing patterns
2. Responsive design across all devices
3. Performance optimization
4. SEO best practices
5. Clean, maintainable code structure
