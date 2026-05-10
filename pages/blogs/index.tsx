import React from "react";
import { Container } from "../../components/util/container";
import { Section } from "../../components/util/section";
import { client } from "../../tina/__generated__/client";
import { Layout } from "../../components/layout";
import { Blogs } from "../../components/posts/blogs";
import { Seo, SITE, buildOgImageUrl } from "../../components/seo";
import { InferGetStaticPropsType } from "next";

const PAGE_DESCRIPTION =
  "Learning from your mistakes is cool, but if you can learn from other peoples mistakes, that's even cooler. A collection of learnings on .NET, MAUI, Blazor, AI, and software engineering.";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const blogs = props.data.blogConnection.edges ?? [];
  const pageTitle = `${SITE.name} | Blog`;
  const canonicalUrl = `${SITE.url}/blogs`;
  const ogImageUrl = buildOgImageUrl({
    title: "Blog",
    description: PAGE_DESCRIPTION,
  });

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
      <Seo
        title={pageTitle}
        description={PAGE_DESCRIPTION}
        canonicalUrl={canonicalUrl}
        ogImageUrl={ogImageUrl}
        ogImageAlt="Brady Stroud's Blog"
      />
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
