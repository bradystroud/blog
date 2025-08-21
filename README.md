# Blog

Built with Next.js, TinaCMS and Tailwind.

## Features

- **AI-Powered Blog Generation**: When a blog post doesn't exist (404), the site automatically generates relevant content using AI instead of showing a 404 page
- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive design
- **Content Management**: Powered by TinaCMS for easy content editing
- **SEO Optimized**: Includes sitemap generation and meta tags

## Dev

1. Clone
2. Run `pnpm` to install packages
3. Copy `.env.example` to `.env.local` and add your environment variables:
   - `OPENAI_API_KEY`: Required for AI blog generation feature
   - Other TinaCMS variables as needed
4. `pnpm dev` to run the project

## AI Blog Generation

The site includes an intelligent fallback for non-existent blog posts. Instead of showing a 404 page, it:

1. Detects when a blog post doesn't exist
2. Uses OpenAI's GPT-4 to generate relevant content based on the URL slug
3. Displays the generated content with clear indication that it's AI-generated
4. Maintains the same styling and layout as regular blog posts

This feature requires an `OPENAI_API_KEY` environment variable to be set.
