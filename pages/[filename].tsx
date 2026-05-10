import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { Seo, buildOgImageUrl, SITE } from "../components/seo";
import { client } from "../tina/__generated__/client";
import { InferGetStaticPropsType } from "next";

const DEFAULT_DESCRIPTION =
  "Software Engineer at SSW specializing in .NET, Blazor, MAUI, and cross-platform development.";

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const title = data.page.title || SITE.name;
  const description = data.page.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = data.page.canonicalUrl || SITE.url;
  const ogImageUrl = buildOgImageUrl({ title, description });

  const isHomePage = canonicalUrl === SITE.url;
  const personSchema = isHomePage
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: SITE.name,
        url: SITE.url,
        image: `${SITE.url}/uploads/brady-beach.webp`,
        jobTitle: "Senior Software Engineer",
        worksFor: {
          "@type": "Organization",
          name: "SSW",
          url: "https://www.ssw.com.au",
        },
        description: DEFAULT_DESCRIPTION,
        sameAs: [
          "https://github.com/bradystroud",
          "https://www.linkedin.com/in/bradystroud",
          "https://twitter.com/bradystroud_",
          "https://www.instagram.com/bradystroud",
          "https://www.youtube.com/@bradystroud",
        ],
        knowsAbout: [
          "Business Optimzation",
          "LLMS",
          ".NET",
          "C#",
          "Blazor",
          "MAUI",
          "React",
          "TypeScript",
          "AI",
          "Cross-platform development",
        ],
      }
    : undefined;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Layout data={data.global as any}>
      <Seo
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        ogImageUrl={ogImageUrl}
        jsonLd={personSchema}
      />
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
