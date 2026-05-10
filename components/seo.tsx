import Head from "next/head";

const SITE_URL = "https://bradystroud.dev";
const SITE_NAME = "Brady Stroud";
const OG_IMAGE_WIDTH = 1600;
const OG_IMAGE_HEIGHT = 836;

export const SITE = {
  url: SITE_URL,
  name: SITE_NAME,
};

type OgType = "website" | "article";

interface SeoProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: OgType;
  ogImageUrl: string;
  ogImageAlt?: string;
  publishedTime?: string;
  tags?: readonly string[];
  jsonLd?: object;
}

export function absoluteCoverImageUrl(
  coverImage?: string | null
): string | undefined {
  if (!coverImage) return undefined;
  return coverImage.startsWith("http") ? coverImage : `${SITE_URL}${coverImage}`;
}

export function buildOgImageUrl(params: {
  title: string;
  description?: string;
  coverImage?: string;
}): string {
  const search = new URLSearchParams({ title: params.title });
  if (params.description) search.set("description", params.description);
  if (params.coverImage) search.set("coverImage", params.coverImage);
  return `${SITE_URL}/api/og?${search.toString()}`;
}

export const Seo = ({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImageUrl,
  ogImageAlt,
  publishedTime,
  tags,
  jsonLd,
}: SeoProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content={SITE_NAME} />
    <link rel="canonical" href={canonicalUrl} key="canonical" />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:image:secure_url" content={ogImageUrl} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
    <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
    <meta property="og:image:alt" content={ogImageAlt ?? title} />
    <meta property="og:site_name" content={SITE_NAME} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageUrl} />

    {ogType === "article" && publishedTime && (
      <meta property="article:published_time" content={publishedTime} />
    )}
    {ogType === "article" &&
      tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

    {jsonLd && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )}
  </Head>
);
