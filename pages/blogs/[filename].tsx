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
import Giscus from "@giscus/react";

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

    return (
      <Layout data={data.global as any}>
        <Head>
          <title>{title}</title>
          <link rel="canonical" href={data.blog.canonicalUrl} key="canonical" />
          <meta property="og:title" content={title} />
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
  console.log(blogListData);
  return {
    paths:
      blogListData.data.blogConnection.edges?.map((post) => ({
        params: { filename: post?.node?._sys.filename },
      })) || [],
    fallback: false,
  };
};
