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

  // Filter out null edges and sort by date (newest first)  
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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Brady Stroud" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Brady Stroud" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <Section className="flex-1">
        <Container size="large" width="small">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl title-font mb-4">Blogs</h1>
          </div>
          <p className="text-gray-600 text-lg pb-5 italic">
            Learning from your mistakes is cool, but if you can learn from
            other peoples mistakes, that's even cooler. Thats why you should read my blogs - a collection of past learnings.
          </p>
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
