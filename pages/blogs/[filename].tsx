/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";
import Head from "next/head";

export default function Blog(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  let formattedDate = "";
  if (data?.blog?.date) {
    const date = new Date(data.blog.date);

    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  if (data && data.blog) {
    const title = `${data.blog.title} | Brady Stroud`;
    const description = data.blog.description || `Read ${data.blog.title} by Brady Stroud`;
    
    // Handle cover image URL - check if it's already a full URL (from TinaCMS CDN) or a relative path
    let coverImageUrl = "";
    if (data.blog.coverImage) {
      coverImageUrl = data.blog.coverImage.startsWith('http') 
        ? data.blog.coverImage 
        : `https://bradystroud.dev${data.blog.coverImage}`;
    }
    
    const ogImageUrl = coverImageUrl
      ? `https://bradystroud.dev/api/og?title=${encodeURIComponent(data.blog.title)}&description=${encodeURIComponent(description)}&coverImage=${encodeURIComponent(coverImageUrl)}`
      : `https://bradystroud.dev/api/og?title=${encodeURIComponent(data.blog.title)}&description=${encodeURIComponent(description)}`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.blog.title,
      "description": description,
      "url": data.blog.canonicalUrl,
      ...(data.blog.date ? { "datePublished": data.blog.date } : {}),
      ...(coverImageUrl ? { "image": coverImageUrl } : {}),
      "author": {
        "@type": "Person",
        "name": "Brady Stroud",
        "url": "https://bradystroud.dev"
      },
      "publisher": {
        "@type": "Person",
        "name": "Brady Stroud",
        "url": "https://bradystroud.dev"
      }
    };

    return (
      <Layout data={data.global as any}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="author" content="Brady Stroud" />
          <link rel="canonical" href={data.blog.canonicalUrl} key="canonical" />
          
          {/* Open Graph */}
          <meta property="og:title" content={data.blog.title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={data.blog.canonicalUrl} />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:site_name" content="Brady Stroud" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={data.blog.title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={ogImageUrl} />
          
          {/* Article metadata */}
          {data.blog.date && (
            <meta property="article:published_time" content={data.blog.date} />
          )}
          {data.blog.tags && data.blog.tags.filter((tag): tag is string => tag !== null).map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}

          {/* JSON-LD Article structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
        </Head>
        <Section className="flex-1">
          <Container width="small" className="flex-1 pb-2" size="large">
            {data.blog.coverImage ? (
              <div className="flex justify-center">
                <Image
                  src={data.blog.coverImage}
                  width={1000}
                  height={400}
                  alt={data.blog.title}
                  className="object-cover object-center rounded-lg"
                />
              </div>
            ) : null}
            <div className="relative">
              <h1
                data-tinafield="title"
                className="relative mb-8 text-4xl font-extrabold tracking-normal text-center title-font"
              >
                {data.blog.title}
              </h1>
            </div>
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 mx-6">
                  <Image
                    className="rounded-full w-10 h-10"
                    src="/uploads/brady-beach-blur.webp"
                    alt="Brady Stroud"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="mx-6">
                  <div className="text-base text-gray-500 dark:text-gray-300">
                    {formattedDate} by Brady Stroud
                  </div>
                </div>
              </div>
            </div>
            {data.blog.aiCollaboration ? (
              <div className="mb-8 flex justify-center">
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-100">
                  <span aria-hidden className="text-lg leading-none">
                    🤝
                  </span>
                  <p>
                    AI collaboration: This post was drafted with AI support,
                    but the ideas, experiences and opinions are all my own.
                  </p>
                </div>
              </div>
            ) : null}
            <div className="prose dark:prose-dark w-full max-w-none">
              <TinaMarkdown content={data.blog._body} />
            </div>
            <div className="mt-8">
              {/* TODO: Reconfigure Giscus */}
              {/* <Giscus
                id="comments"
                repo="bradystroud/bradystroud.dev"
                repoId="R_kgDOHYKKTg"
                category="Announcements"
                categoryId="DIC_kwDOHYKKTs4CfxYs"
                mapping="pathname"
                term="Welcome to giscus!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="preferred_color_scheme"
                lang="en"
                loading="lazy"
              /> */}
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  return (
    <Layout>
      <Section className="flex-1">
        <Container className="flex-1 pb-2" size="large">
          <div className="text-center">
            <h1 className="text-3xl">Blog not found</h1>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.blogQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

export const getStaticPaths = async () => {
  const blogListData = await client.queries.blogConnection({ first: 100 });
  return {
    paths:
      blogListData.data.blogConnection.edges?.map((post) => ({
        params: { filename: post?.node?._sys.filename },
      })) || [],
    fallback: false,
  };
};
