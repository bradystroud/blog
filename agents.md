# AI Agent Guidelines

This document provides comprehensive guidance for AI coding agents working with Brady Stroud's personal website codebase.

## Quick Reference

**Additional Documentation:**
- `.github/copilot-instructions.md` - Project overview and Copilot-specific guidelines
- `.github/copilot-memory.md` - Project learnings and important implementation notes
- `_docs/ai-tasks/` - Task planning documents and refactoring strategies

## Project Overview

Next.js 16 website with TinaCMS, TypeScript, and Tailwind CSS serving as both a blog and portfolio for Brady Stroud, a Software Engineer specializing in .NET, MAUI, Blazor, and cross-platform development.

**Tech Stack:**
- Next.js 16.1.4 + React 19 + TypeScript 5.9
- TinaCMS 3.2.0 for content management
- Tailwind CSS 4.1 for styling
- Package manager: `bun` (required)
- Deployment: Vercel with Analytics

## Build & Development Commands

```bash
# Development
bun dev                     # Start dev server with TinaCMS at localhost:3000
bun build                   # Full production build (TinaCMS + Next + RSS + sitemap)
bun start                   # Production server (after build)

# Linting & Quality
bun lint                    # Run ESLint on .ts/.tsx files

# Content Generation
bun generate-rss            # Generate RSS feed from blog posts

# Notes:
# - No test runner configured (no jest/vitest)
# - TinaCMS admin accessible at /admin during development
# - ESLint extends @typescript-eslint + @next/next recommended rules
```

## Code Style Guidelines

### File Naming & Organization
- **Files**: `kebab-case.tsx` (e.g., `blog-post.tsx`, `hero-section.tsx`)
- **Components**: `PascalCase` (e.g., `BlogPost`, `HeroSection`)
- **Utilities**: `camelCase.ts` (e.g., `getPlatformFromUrl.ts`)

**Directory Structure:**
```
components/
  blocks/          # TinaCMS blocks (hero, features, projects, etc.)
  layout/          # Layout components (header, footer, breadcrumb)
  posts/           # Blog-related components
  util/            # Reusable utilities (container, section, actions)
content/
  blogs/           # Blog posts (.mdx files)
  pages/           # Static pages (.md files)
  global/          # Global site configuration
pages/             # Next.js pages (routing)
utils/             # Helper functions
tina/              # TinaCMS configuration
  collections/     # Content type schemas
  __generated__/   # AUTO-GENERATED - DO NOT EDIT
```

### TypeScript Conventions

**Interfaces & Types:**
```tsx
// Use interfaces for component props
interface ComponentProps {
  data: ComponentData;
  parentField?: string;  // Optional with default
}

export const Component = ({ data, parentField = "" }: ComponentProps) => {
  // Implementation
};
```

**Type Safety:**
- Use proper TypeScript types throughout (no `any` except when necessary)
- Enable `strictNullChecks` (already enabled in tsconfig)
- Use optional chaining for potentially undefined values: `data?.nav`
- Disable `strict` mode is false, but prefer strict typing practices

**ESLint Disable Comments:**
```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */  // Only when truly necessary
```

### Import Conventions

**Import Order:**
```tsx
// 1. External dependencies
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";
import Head from "next/head";

// 2. Internal components (relative imports)
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";

// 3. Types/interfaces
import type { Template } from "tinacms";
```

**Import Paths:**
- Use relative imports (no path aliases configured)
- Example: `../../components/layout` not `@/components/layout`

### Styling with Tailwind

**Rules:**
- **NEVER use inline styles or raw CSS** - use Tailwind classes only
- Customize design system via `tailwind.config.js`, not custom CSS
- Use responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Use dark mode variants: `dark:text-gray-50`

**Example:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center">
  <h1 className="text-5xl font-extrabold tracking-normal leading-tight">
    {headline}
  </h1>
</div>
```

### Component Patterns

**Functional Components with Props:**
```tsx
export const Hero = ({ data, parentField }) => {
  return (
    <Section>
      <Container size="large">
        {data.headline && (
          <h1 data-tinafield={`${parentField}.headline`}>
            {data.headline}
          </h1>
        )}
      </Container>
    </Section>
  );
};
```

**Page Components (Next.js):**
```tsx
export default function BlogPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout data={data.global}>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      {/* Content */}
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.blogQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return { props: { ...tinaProps } };
};
```

### Error Handling

**Null Safety:**
```tsx
// Always check for undefined/null before accessing properties
if (data?.blog?.date) {
  const date = new Date(data.blog.date);
  if (!isNaN(date.getTime())) {
    // Use date
  }
}
```

**Try-Catch with Logging:**
```tsx
try {
  const urlObj = new URL(url);
  return urlObj.hostname;
} catch (error) {
  console.error("Invalid URL", error);
  return "Error parsing URL";
}
```

## Critical Rules & Common Mistakes

**DO NOT:**
- ❌ Modify files in `tina/__generated__/` (auto-generated by TinaCMS)
- ❌ Use inline styles or custom CSS (Tailwind only)
- ❌ Forget canonical URLs in blog frontmatter
- ❌ Use `npm`, `yarn`, or `pnpm` (bun required)
- ❌ Access properties without null checks (e.g., `data.nav` → `data?.nav`)

**DO:**
- ✅ Run `bun lint` before committing
- ✅ Use Next.js `<Image>` component for all images
- ✅ Include TinaCMS schema for new block components
- ✅ Test responsive design across breakpoints
- ✅ Include proper meta tags and SEO data

## TinaCMS Integration

**Block Components:**
```tsx
export const heroBlockSchema: Template = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: { /* ... */ },
  },
  fields: [
    { type: "string", label: "Headline", name: "headline" },
    // ...
  ],
};
```

**Content Frontmatter (Blogs):**
```yaml
---
canonicalUrl: "https://bradystroud.dev/blogs/[slug]"
title: "Post Title"
description: "SEO meta description (150-160 chars recommended)"  # Optional but recommended
date: 2025-01-22T12:00:00.000Z
tags:
  - tag1
  - tag2
coverImage: /uploads/image.webp  # Optional
aiCollaboration: true             # Optional
---
```

## SEO & Open Graph

**OG Image Generation:**
- Dynamic OG images generated via `/api/og` edge function using `@vercel/og`
- Images are 1200x630px (optimal for social media)
- Uses cover images as backgrounds when available, falls back to gradients
- Automatically includes title, description, and site branding

**Meta Tags (Auto-generated):**
```tsx
// In blog pages, these are automatically generated:
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageUrl} />
<meta name="twitter:card" content="summary_large_image" />
<meta property="article:published_time" content={date} />
```

**Best Practices:**
- Always include a `description` field in blog frontmatter (150-160 characters)
- Use descriptive, compelling meta descriptions for social sharing
- Ensure `coverImage` paths are correct for best OG image quality
- Cover images can be relative paths (`/uploads/image.webp`) or TinaCMS CDN URLs (`https://assets.tina.io/...`)

## Git Workflow

**IMPORTANT: Always ask the user before committing and pushing changes.**

When making changes:
1. Make the necessary code edits
2. Explain what was changed to the user
3. **Ask permission** before running `git commit` and `git push`
4. Only proceed with commit/push after explicit user approval

Example interaction:
```
Agent: "I've made the following changes: [list changes]. 
       Would you like me to commit and push these changes?"
User: "yes" / "sure" / "go ahead"
Agent: [proceeds with git commit && git push]
```

## Deployment & Production Notes

- **Platform**: Vercel (serverless functions + edge functions for OG images)
- **Filesystem**: Cannot write to filesystem in production (cache disabled)
- **Timeouts**: 10s serverless timeout - implement 8s app timeouts as safety
- **Build**: `tinacms build` → `next build` → RSS generation → sitemap
- **ISR**: Blog pages use `fallback: false` for static generation
- **Analytics**: Vercel Analytics and Speed Insights included
- **OG Images**: Generated on-demand via edge runtime (no caching needed)

---

**Last Updated**: 2026-01-28  
**Codebase Version**: Next.js 16, TinaCMS 3, React 19, Bun 1.3.7, @vercel/og 0.8.6
