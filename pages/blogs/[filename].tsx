/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Giscus from "@giscus/react";

export default function Blog(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const date = new Date(data.blog.date);
  let formattedDate = "";

  if (!isNaN(date.getTime())) {
    formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (data && data.blog) {
    const title = `${data.blog.title} | Brady Stroud`;

    return (
      <Layout data={data.global as any}>
        <Head>
          <title>{title}</title>
          <link
            rel="canonical"
            href={data.blog.cannonicalUrl}
            key="canonical"
          />
          <meta property="og:title" content={title} />
        </Head>
        <Section className="flex-1">
          <Container width="small" className={`flex-1 pb-2`} size="large">
            <h1
              className={`w-full relative mb-8 text-6xl tracking-normal text-center title-font`}
            >
              {data.blog.title}
            </h1>
            <div
              data-tinafield="author"
              className="flex items-center justify-center my-8"
            >
              <p
                data-tinafield="date"
                className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150"
              >
                {formattedDate}
              </p>
            </div>
          </Container>
          <Container className={`flex-1 pt-4`} width="small" size="large">
            <div className="prose dark:prose-dark w-full max-w-none">
              <TinaMarkdown content={data.blog._body} />
            </div>
            <br />
          </Container>
        </Section>
      </Layout>
    );
  }
  return (
    <Layout>
      <div>No data</div>;
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.blog({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
      __filename,
    },
  };
};

export const getStaticPaths = async () => {
  const blogListData = await client.queries.blogConnection();
  return {
    paths: blogListData.data.blogConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
};
