import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { AIBlogResponse, AIBlogErrorResponse } from '../../types/ai-blog';
import { getCachedContent, setCachedContent, clearExpiredCache } from '../../utils/ai-blog-cache';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Fallback content when AI generation fails
const getFallbackContent = (title: string): string => {
    return `## ${title}

I don't have a specific blog post about "${title}" yet, but I'd love to write about it! 

As a Software Engineer at SSW, I'm passionate about sharing knowledge on topics like:

- **.NET Development**: Building robust applications with the latest .NET features
- **MAUI**: Cross-platform mobile and desktop development
- **Blazor**: Modern web development with C#
- **Software Engineering Best Practices**: Clean code, testing, and architecture

### What I Can Help With

If you're interested in "${title}", here are some related topics I frequently work with:

- Modern development practices and patterns
- Cross-platform application development
- Web technologies and frameworks
- Performance optimization techniques
- Code quality and testing strategies

### Get In Touch

If you'd like me to write specifically about "${title}" or have questions about software development, feel free to reach out! You can find me on [LinkedIn](https://www.linkedin.com/in/bradystroud/) or check out my other blog posts for similar content.

This topic sounds interesting and I'd be happy to explore it in a future post. Keep an eye on the blog for new content!`;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AIBlogResponse | AIBlogErrorResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, context } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // Clean up expired cache entries periodically
    clearExpiredCache();

    // Check cache first
    const cachedContent = getCachedContent(title);
    if (cachedContent) {
        return res.status(200).json({
            ...cachedContent,
            cached: true, // Add indicator that this was cached
        } as AIBlogResponse & { cached: boolean });
    }

    // If no OpenAI API key, return fallback content
    if (!process.env.OPENAI_API_KEY) {
        const fallbackResponse: AIBlogResponse = {
            content: getFallbackContent(title),
            generated: false,
            fallback: true,
            timestamp: new Date().toISOString(),
        };

        // Cache the fallback content
        setCachedContent(title, fallbackResponse);

        return res.status(200).json(fallbackResponse);
    }

    try {
        const prompt = `Write a detailed technical blog post as Brady Stroud, a Software Engineer at SSW who specializes in .NET, MAUI, Blazor, and cross-platform development. 

Title: "${title}"
${context ? `Context: ${context}` : ''}

Write the blog post in markdown format with the following characteristics:
- Professional but approachable tone
- Focus on practical, actionable content
- Include code examples when relevant (use proper markdown code blocks with language specifications)
- Around 800-1200 words
- Use proper heading hierarchy (##, ###)
- Include technical insights and best practices
- Relate it to Brady's expertise in .NET, MAUI, Blazor, or software engineering
- Include practical examples and real-world applications
- End with a call-to-action or invitation for discussion

The blog should be informative, well-structured, and provide real value to developers. Don't include frontmatter or metadata - just the markdown content.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are Brady Stroud, a Software Engineer at SSW with expertise in .NET, MAUI, Blazor, and cross-platform development. Write technical blog posts that are informative, practical, and reflect your professional experience. Always include code examples when relevant and make the content actionable for developers.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2500,
            temperature: 0.7,
        });

        const generatedContent = completion.choices[0]?.message?.content;

        if (!generatedContent) {
            // Fallback to static content if AI generation fails
            const fallbackResponse: AIBlogResponse = {
                content: getFallbackContent(title),
                generated: false,
                fallback: true,
                timestamp: new Date().toISOString(),
            };

            // Cache the fallback content
            setCachedContent(title, fallbackResponse);

            return res.status(200).json(fallbackResponse);
        }

        const successResponse: AIBlogResponse = {
            content: generatedContent,
            generated: true,
            fallback: false,
            timestamp: new Date().toISOString(),
        };

        // Cache the successful response
        setCachedContent(title, successResponse);

        return res.status(200).json(successResponse);

    } catch (error) {
        console.error('Error generating blog content:', error);

        // Return fallback content instead of error
        const fallbackResponse: AIBlogResponse = {
            content: getFallbackContent(title),
            generated: false,
            fallback: true,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        };

        // Cache the fallback content
        setCachedContent(title, fallbackResponse);

        return res.status(200).json(fallbackResponse);
    }
}
