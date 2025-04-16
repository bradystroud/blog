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

  // Sort blogs by date (newest first)
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a?.node?.date || 0);
    const dateB = new Date(b?.node?.date || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <link
          rel="canonical"
          href="https://bradystroud.dev/blogs"
          key="canonical"
        />
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
