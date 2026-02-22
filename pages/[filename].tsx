import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { client } from "../tina/__generated__/client";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const title = data.page.title || "Brady Stroud";
  const description = data.page.description || "Software Engineer at SSW specializing in .NET, Blazor, MAUI, and cross-platform development.";
  const canonicalUrl = data.page.canonicalUrl || "https://bradystroud.dev";
  const ogImageUrl = `https://bradystroud.dev/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  const isHomePage = canonicalUrl === "https://bradystroud.dev";
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Brady Stroud",
    "url": "https://bradystroud.dev",
    "image": "https://bradystroud.dev/uploads/brady-beach.webp",
    "jobTitle": "Senior Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "SSW",
      "url": "https://www.ssw.com.au"
    },
    "description": "Senior Software Engineer at SSW specializing in .NET, Blazor, MAUI, and cross-platform development.",
    "sameAs": [
      "https://github.com/bradystroud",
      "https://www.linkedin.com/in/bradystroud",
      "https://twitter.com/bradystroud_",
      "https://www.instagram.com/bradystroud",
      "https://www.youtube.com/@bradystroud"
    ],
    "knowsAbout": ["Business Optimzation", "LLMS", ".NET", "C#", "Blazor", "MAUI", "React", "TypeScript", "AI", "Cross-platform development"]
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Layout data={data.global as any}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Brady Stroud" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />

        {/* JSON-LD Person structured data for home page */}
        {isHomePage && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          />
        )}
      </Head>
      <Blocks {...data.page} />
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `${params.filename}.md`,
  });

  return {
    props: {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
    },
  };
};

export const getStaticPaths = async () => {
  const pagesListData = await client.queries.pageConnection();
  return {
    paths: pagesListData?.data?.pageConnection?.edges?.map((page) => ({
      params: { filename: page?.node?._sys.filename },
    })),
    fallback: false,
  };
};
