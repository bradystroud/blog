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
import AIBlog from "../../components/ai-blog";
import { useRouter } from "next/router";

export default function Blog(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();

  // If the page is being generated (fallback), show loading
  if (router.isFallback) {
    return (
      <Layout>
        <Section className="flex-1">
          <Container width="small" className="flex-1 pb-2" size="large">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  // If no blog data exists, render AI-generated content
  if (!props.data?.blog && props.filename) {
    return <AIBlog title={props.filename} globalData={props.data?.global} />;
  }

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
          <Container width="small" className={`flex-1 pb-2`} size="large">
            {data.blog.coverImage ? (
              <div className="flex justify-center">
                <Image
                  src={data.blog.coverImage}
                  width={500}
                  height={500}
                  alt={data.blog.title}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>
            ) : (
              <></>
            )}
            <h1
              className={`w-full relative mb-8 text-6xl tracking-normal text-center title-font`}
            >
              {data.blog.title}
            </h1>
            <div
              data-tinafield="author"
              className="flex flex-col items-center justify-center my-8"
            >
              <div className="text-lg font-medium mb-2">By Brady Stroud</div>
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
            <div>
              <Giscus
                repo="bradystroud/blog"
                repoId="R_kgDOMG3w4Q"
                category="Comments"
                categoryId="DIC_kwDOMG3w4c4ChPCN"
                mapping="url"
                strict="0"
                reactions-enabled="1"
                emit-metadata="1"
                inputPosition="top"
                theme="light"
                lang="en"
                loading="lazy"
              />
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
  try {
    const tinaProps = await client.queries.blogQuery({
      relativePath: `${params.filename}.mdx`,
    });
    return {
      props: {
        ...tinaProps,
        filename: params.filename,
        __filename,
      },
    };
  } catch (error) {
    console.error("Blog query failed:", error);
    // Blog doesn't exist or TinaCMS is unavailable, handle with AI generation
    // Try to fetch global data for layout, but don't fail if it's unavailable
    try {
      const globalResponse = await client.queries.pageQuery();
      return {
        props: {
          data: {
            global: globalResponse.data.global,
            blog: null,
          },
          filename: params.filename,
          query: "",
          variables: {},
          __filename,
        },
        // Add revalidation for ISR
        revalidate: 60, // Revalidate every minute to retry TinaCMS connection
      };
    } catch (globalError) {
      console.error("Global data fetch also failed:", globalError);
      // Complete fallback - no TinaCMS data available
      return {
        props: {
          data: {
            global: null,
            blog: null,
          },
          filename: params.filename,
          query: "",
          variables: {},
          __filename,
        },
        // Shorter revalidation when no data is available
        revalidate: 30,
      };
    }
  }
};

export const getStaticPaths = async () => {
  try {
    const blogListData = await client.queries.blogConnection();
    return {
      paths:
        blogListData?.data?.blogConnection?.edges?.map((post) => ({
          params: { filename: post?.node?._sys.filename },
        })) || [],
      fallback: true, // Changed from "blocking" to true
    };
  } catch (error) {
    console.error("Error fetching blog list:", error);
    // If we can't fetch the blog list, return empty paths and let fallback handle it
    return {
      paths: [],
      fallback: true,
    };
  }
};
