# Agents Documentation

This document provides guidance for AI agents and assistants working with Brady Stroud's personal website codebase.

## Agent Guidelines

### Understanding the Codebase
This is a modern Next.js website serving as both a blog and portfolio for Brady Stroud, a Software Engineer. The site demonstrates expertise in:
- Cross-platform development (.NET MAUI, Blazor)
- Full-stack web development
- AI/ML integration
- Professional development content

### Code Editing Guidelines

#### Component Structure
- All React components use TypeScript
- Components are organized by functionality in the `components/` directory
- TinaCMS blocks are located in `components/blocks/`
- Layout components are in `components/layout/`

#### Content Management
- Blog posts are MDX files in `content/blogs/`
- Static pages are Markdown files in `content/pages/`
- TinaCMS configuration is in the `tina/` directory
- All content requires proper frontmatter with canonical URLs

#### Styling
- Use Tailwind CSS classes exclusively
- Follow responsive design patterns with Tailwind breakpoints
- Maintain consistency with existing spacing and typography
- Use the established color scheme and design tokens

### Common Tasks and Patterns

#### Adding a New Blog Post
1. Create a new `.mdx` file in `content/blogs/`
2. Include required frontmatter:
   ```yaml
   ---
   canonicalUrl: "https://bradystroud.dev/blogs/[slug]"
   title: "Post Title"
   date: 2025-MM-DDTHH:mm:ss.000Z
   tags:
     - tag1
     - tag2
   coverImage: /uploads/image.webp (optional)
   ---
   ```
3. Write content in MDX format
4. The RSS feed and sitemap will update automatically

#### Creating New Components
1. Create TypeScript React components
2. Use proper TypeScript interfaces for props
3. Include TinaCMS schema if it's a block component
4. Follow existing naming conventions
5. Export from appropriate index files

#### Modifying TinaCMS Schemas
- Block schemas are defined alongside their components
- Collection schemas are in `tina/collections/`
- Use TypeScript for schema definitions
- Include proper UI configurations for the CMS

### Content Guidelines

#### Writing Style
- Technical content should be accessible but detailed
- Include code examples where relevant
- Use proper heading hierarchy
- Include relevant tags for categorization

#### Images and Media
- Store images in `public/uploads/`
- Use descriptive filenames
- Include alt text for accessibility
- Optimize images before uploading

### Development Workflow

#### Local Development
```bash
pnpm dev        # Start development server with TinaCMS
pnpm build      # Build for production
pnpm lint       # Run ESLint
```

#### Content Editing
- Access TinaCMS admin at `/admin` during development
- Edit content through the CMS interface or directly edit files
- All changes are reflected immediately in development

### SEO and Performance Best Practices

#### SEO
- Always include canonical URLs
- Use proper meta tags and Open Graph data
- Maintain clean URL structure
- Include relevant keywords in content

#### Performance
- Use Next.js Image component for all images
- Implement proper loading states
- Minimize bundle size
- Follow Core Web Vitals guidelines

### Common Patterns to Follow

#### Page Structure
```tsx
// Standard page component pattern
export default function PageName(props) {
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
      {/* Page content */}
    </Layout>
  );
}
```

#### Component Props
```tsx
// Use proper TypeScript interfaces
interface ComponentProps {
  data: ComponentData;
  parentField?: string;
}

export const Component = ({ data, parentField = "" }: ComponentProps) => {
  // Component implementation
};
```

### Error Prevention

#### Common Mistakes to Avoid
- Don't modify TinaCMS generated files in `tina/__generated__/`
- Always include canonical URLs in content frontmatter
- Don't use inline styles; use Tailwind classes
- Ensure proper TypeScript typing throughout
- Test responsive design across breakpoints

#### Validation
- Run `pnpm lint` before committing changes
- Test TinaCMS functionality in development
- Verify RSS feed generation after content changes
- Check that images load properly across devices

### Deployment Considerations

#### Build Process
- TinaCMS builds static content during build
- RSS feed is generated via script
- Sitemap is created automatically
- Vercel Analytics are included in production

#### Environment Variables
- TinaCMS requires proper environment configuration
- Ensure all required tokens and client IDs are set
- Verify GitHub integration for remote indexing

This documentation should be updated as the codebase evolves and new patterns emerge.
