import React from "react";
import { Container } from "../../components/util/container";
import { Section } from "../../components/util/section";
import { client } from "../../tina/__generated__/client";
import { Layout } from "../../components/layout";
import { Blogs } from "../../components/posts/blogs";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const blogs = props.data.blogConnection.edges ?? [];
  const pageTitle = "Brady Stroud | Blog";
  const description = "Learning from your mistakes is cool, but if you can learn from other peoples mistakes, that's even cooler. A collection of learnings on .NET, MAUI, Blazor, AI, and software engineering.";
  const canonicalUrl = "https://bradystroud.dev/blogs";
  const ogImageUrl = `https://bradystroud.dev/api/og?title=Blog&description=${encodeURIComponent(description)}`;

  const sortedBlogs = blogs
    .filter((edge): edge is Exclude<typeof edge, null> =>
      edge !== null && edge.node !== null && edge.node !== undefined
    )
    .map(edge => ({
      node: {
        _sys: edge.node!._sys,
        id: edge.node!.id,
        title: edge.node!.title,
        date: edge.node!.date ?? undefined,
        tags: edge.node!.tags?.filter((t): t is string => typeof t === "string") ?? undefined,
      }
    }))
    .sort((a, b) => {
      const dateA = new Date(a.node.date || 0);
      const dateB = new Date(b.node.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog | Brady Stroud" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1600" />
        <meta property="og:image:height" content="836" />
        <meta property="og:image:alt" content="Brady Stroud's Blog" />
        <meta property="og:site_name" content="Brady Stroud" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Brady Stroud" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <Section>
        <Container size="large" width="small">
          <div className="mb-12">
            <div className="mono mb-8 text-xs uppercase tracking-[0.18em] text-ink-mute flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              Writing
            </div>
            <h1
              className="title-font text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink mb-6"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 520' }}
            >
              Blogs
            </h1>
            <p
              className="title-font text-xl sm:text-2xl italic text-ink-soft max-w-xl"
              style={{ fontVariationSettings: '"opsz" 96, "wght" 400' }}
            >
              Learning from your mistakes is cool. Learning from other people&apos;s is even cooler.
            </p>
          </div>
          <Blogs data={sortedBlogs} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const tinaProps = await client.queries.blogPageQuery();
  return {
    props: {
      ...tinaProps,
    },
  };
};
