import React from "react";
import { Container } from "../../../components/util/container";
import { Section } from "../../../components/util/section";
import { client } from "../../../tina/__generated__/client";
import { Layout } from "../../../components/layout";
import { Blogs } from "../../../components/posts/blogs";
import { Pagination } from "../../../components/util/pagination";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";

const POSTS_PER_PAGE = 5;

export default function BlogsPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const blogs = props.data.blogConnection.edges ?? [];
  const { currentPage, totalPages } = props;
  const pageTitle = `Brady Stroud | Blog - Page ${currentPage}`;

  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a?.node?.date || 0);
    const dateB = new Date(b?.node?.date || 0);
    return dateB.getTime() - dateA.getTime();
  });

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedBlogs = sortedBlogs.slice(start, start + POSTS_PER_PAGE);

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <link
          rel="canonical"
          href={`https://bradystroud.dev/blogs/page/${currentPage}`}
          key="canonical"
        />
      </Head>
      <Section className="flex-1">
        <Container size="large" width="small">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl title-font mb-4">Blogs</h1>
          </div>
          <p className="text-gray-600 text-lg pb-5 italic">
            Learning from your mistakes is cool, but if you can learn from other peoples mistakes, that's even cooler. Thats why you should read my blogs - a collection of past learnings.
          </p>
          <Blogs data={paginatedBlogs} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.blogPageQuery();
  const totalPosts = tinaProps.data.blogConnection.edges.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = parseInt(params.page as string, 10);

  if (currentPage < 1 || currentPage > totalPages) {
    return { notFound: true };
  }

  return {
    props: {
      ...tinaProps,
      currentPage,
      totalPages,
    },
  };
};

export const getStaticPaths = async () => {
  const tinaProps = await client.queries.blogPageQuery();
  const totalPosts = tinaProps.data.blogConnection.edges.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const paths = Array.from({ length: totalPages - 1 }, (_, i) => ({
    params: { page: String(i + 2) },
  }));

  return {
    paths,
    fallback: false,
  };
};
