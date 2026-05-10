/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import {
  Seo,
  SITE,
  absoluteCoverImageUrl,
  buildOgImageUrl,
} from "../../components/seo";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import Giscus from "@giscus/react";
import { BsArrowLeft } from "react-icons/bs";

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
    const description =
      data.blog.description || `Read ${data.blog.title} by Brady Stroud`;
    const coverImageUrl = absoluteCoverImageUrl(data.blog.coverImage);
    const ogImageUrl = buildOgImageUrl({
      title: data.blog.title,
      description,
      coverImage: coverImageUrl,
    });

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: data.blog.title,
      description,
      url: data.blog.canonicalUrl,
      ...(data.blog.date ? { datePublished: data.blog.date } : {}),
      ...(coverImageUrl ? { image: coverImageUrl } : {}),
      author: { "@type": "Person", name: SITE.name, url: SITE.url },
      publisher: { "@type": "Person", name: SITE.name, url: SITE.url },
    };

    const tagList =
      data.blog.tags?.filter((t): t is string => typeof t === "string") ?? [];

    return (
      <Layout data={data.global as any}>
        <Seo
          title={`${data.blog.title} | ${SITE.name}`}
          description={description}
          canonicalUrl={data.blog.canonicalUrl}
          ogType="article"
          ogImageUrl={ogImageUrl}
          ogImageAlt={data.blog.title}
          publishedTime={data.blog.date ?? undefined}
          tags={tagList}
          jsonLd={articleSchema}
        />
        <Section>
          <Container width="small" size="large">
            <Link
              href="/blogs"
              className="group/back inline-flex items-center gap-2 mono text-xs uppercase tracking-[0.18em] text-ink-mute hover:text-accent transition-colors mb-10"
            >
              <BsArrowLeft
                className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/back:-translate-x-0.5"
                aria-hidden="true"
              />
              All entries
            </Link>

            <div className="mb-8 flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/uploads/brady-beach-blur.webp"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="title-font text-base text-ink leading-tight"
                  style={{ fontVariationSettings: '"opsz" 96, "wght" 520' }}
                >
                  Brady Stroud
                </span>
                <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute">
                  {formattedDate && (
                    <time dateTime={data.blog.date || undefined} className="tabular-nums">
                      {formattedDate}
                    </time>
                  )}
                  {tagList.length > 0 && (
                    <>
                      <span aria-hidden="true" className="mx-2 opacity-40">{"//"}</span>
                      {tagList.join(", ")}
                    </>
                  )}
                </span>
              </div>
            </div>

            <h1
              data-tinafield="title"
              className="title-font mb-10 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 520' }}
            >
              {data.blog.title}
            </h1>

            {data.blog.coverImage ? (
              <div className="mb-12 overflow-hidden rounded-sm bg-paper">
                <Image
                  src={data.blog.coverImage}
                  width={1200}
                  height={630}
                  alt={`Cover image for ${data.blog.title}`}
                  priority
                  className="w-full h-auto object-cover saturate-[0.95]"
                />
              </div>
            ) : null}

            {data.blog.aiCollaboration ? (
              <aside
                role="note"
                aria-label="AI collaboration disclosure"
                className="mb-12 border-y border-rule py-4 flex flex-wrap items-baseline gap-x-4 gap-y-1"
              >
                <span className="mono text-xs uppercase tracking-[0.18em] text-warm">
                  AI collaboration
                </span>
                <span className="text-sm text-ink-soft">
                  Drafted with AI support; ideas, experiences and opinions are mine.
                </span>
              </aside>
            ) : null}

            <article className="prose prose-lg dark:prose-dark max-w-none text-ink-soft">
              <TinaMarkdown content={data.blog._body} />
            </article>

            <div className="mt-16 pt-8 rule-top">
              <Giscus
                id="comments"
                repo="bradystroud/blog"
                repoId="R_kgDOMG3w4Q"
                category="Comments"
                categoryId="DIC_kwDOMG3w4c4ChPCN"
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="light"
                lang="en"
                loading="lazy"
              />
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  return (
    <Layout>
      <Section>
        <Container size="large" width="small">
          <div className="mono mb-8 text-xs uppercase tracking-[0.18em] text-ink-mute flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            404
          </div>
          <h1
            className="title-font text-5xl sm:text-6xl leading-[1.02] text-ink mb-6"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 520' }}
          >
            Blog not found
          </h1>
          <p className="text-ink-soft mb-8 max-w-xl">
            That entry doesn&apos;t exist (yet). It may have moved, or never been written.
          </p>
          <Link
            href="/blogs"
            className="group/back inline-flex items-center gap-2 mono text-xs uppercase tracking-[0.18em] text-ink-mute hover:text-accent transition-colors"
          >
            <BsArrowLeft
              className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/back:-translate-x-0.5"
              aria-hidden="true"
            />
            All entries
          </Link>
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
  return {
    paths:
      blogListData.data.blogConnection.edges?.map((post) => ({
        params: { filename: post?.node?._sys.filename },
      })) || [],
    fallback: false,
  };
};
