import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { Section } from './util/section';
import { Container } from './util/container';
import Head from 'next/head';
import Link from 'next/link';

interface AIBlogProps {
  title: string;
  globalData: any;
}

// Simple markdown to HTML converter for basic formatting
const formatMarkdownToHTML = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)\n```/gim, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Links
    .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline">$1</a>')
    // Lists (basic support)
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$2</li>')
    // Line breaks - handle double newlines as paragraph breaks
    .split('\n\n')
    .map(paragraph => {
      paragraph = paragraph.replace(/\n/g, '<br>');
      // Don't wrap headers, code blocks, or lists in paragraphs
      if (paragraph.match(/^<h[1-6]|^<pre|^<li|^<ul|^<ol/)) {
        return paragraph;
      }
      return paragraph.trim() ? `<p class="mb-4">${paragraph}</p>` : '';
    })
    .join('')
    // Wrap consecutive list items in ul tags
    .replace(/(<li[^>]*>.*?<\/li>)+/gim, '<ul class="list-disc list-inside mb-4 space-y-1">$&</ul>')
    // Clean up empty paragraphs
    .replace(/<p[^>]*><\/p>/gim, '');
};

export default function AIBlog({ title, globalData }: AIBlogProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    generateBlogContent();
  }, [title]);

  const generateBlogContent = async () => {
    try {
      setLoading(true);
      setError('');

      // Extract potential keywords from the title for context
      const context = `This appears to be about ${title.replace(/-/g, ' ')}. Please write content that would be relevant for someone searching for this topic.`;

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.replace(/-/g, ' '),
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.statusText}`);
      }

      const data = await response.json();
      setContent(data.content);
      setIsAIGenerated(data.generated);
      setIsFallback(data.fallback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = `${title.replace(/-/g, ' ')} | Brady Stroud`;
  const formattedTitle = title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const currentDate = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <Layout data={globalData}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Section className="flex-1">
          <Container width="small" className="flex-1 pb-2" size="large">
            <h1 className="w-full relative mb-8 text-6xl tracking-normal text-center title-font">
              {formattedTitle}
            </h1>
            <div className="flex flex-col items-center justify-center my-8">
              <div className="text-lg font-medium mb-2">By Brady Stroud</div>
              <p className="text-base text-gray-400 dark:text-gray-300">
                {currentDate}
              </p>
            </div>
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Generating personalized content for you...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  This may take a few moments
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout data={globalData}>
        <Head>
          <title>{pageTitle}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Section className="flex-1">
          <Container width="small" className="flex-1 pb-2" size="large">
            <h1 className="w-full relative mb-8 text-6xl tracking-normal text-center title-font">
              {formattedTitle}
            </h1>
            <div className="flex flex-col items-center justify-center my-8">
              <div className="text-lg font-medium mb-2">By Brady Stroud</div>
              <p className="text-base text-gray-400 dark:text-gray-300">
                {currentDate}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Unable to Generate Content
              </h2>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={generateBlogContent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout data={globalData}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={`AI-generated content about ${formattedTitle.toLowerCase()}`} />
      </Head>
      <Section className="flex-1">
        <Container width="small" className="flex-1 pb-2" size="large">
          <h1 className="w-full relative mb-8 text-6xl tracking-normal text-center title-font">
            {formattedTitle}
          </h1>
          <div className="flex flex-col items-center justify-center my-8">
            <div className="text-lg font-medium mb-2">By Brady Stroud</div>
            <p className="text-base text-gray-400 dark:text-gray-300">
              {currentDate}
            </p>
          </div>
          
          {/* AI Generation Notice */}
          <div className={`border rounded-lg p-4 mb-8 ${
            isFallback 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {isFallback ? (
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                {isFallback ? (
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Blog Post Not Found:</strong> This content doesn't exist yet, but I've provided some information that might be helpful. 
                    If you'd like me to write about this topic, let me know!
                  </p>
                ) : (
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>AI-Generated Content:</strong> This blog post was automatically generated based on your search. 
                    While I don't have a specific post on this topic yet, I've created this content to help answer your questions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
        
        <Container className="flex-1 pt-4" width="small" size="large">
          <div className="prose dark:prose-dark w-full max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(content) }} />
          </div>
          
          {/* Additional actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blogs" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse All Posts
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
          <br />
        </Container>
      </Section>
    </Layout>
  );
}
