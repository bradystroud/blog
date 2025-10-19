import React from "react";
import { Section } from "../util/section";
import { Container } from "../util/container";
import { Template } from "tinacms";

interface TikTokPostItem {
  id: string;
  videoUrl: string;
  caption?: string;
}

interface TikTokPostsProps {
  data: {
    heading?: string;
    description?: string;
    profileUrl?: string;
    emptyMessage?: string;
    posts?: TikTokPostItem[];
  };
  parentField?: string;
}

const getEmbedUrl = (videoUrl: string) => {
  if (!videoUrl) {
    return null;
  }

  const trimmed = videoUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (!trimmed.startsWith("http")) {
    return `https://www.tiktok.com/embed/v2/${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname;

    const embedMatch = pathname.match(/\/embed\/v2\/(.+)/);
    if (embedMatch?.[1]) {
      return `https://www.tiktok.com/embed/v2/${embedMatch[1]}`;
    }

    const videoMatch = pathname.match(/\/video\/(\d+)/);
    if (videoMatch?.[1]) {
      return `https://www.tiktok.com/embed/v2/${videoMatch[1]}`;
    }
  } catch (error) {
    // Ignore parsing errors – we'll fall back to string checks below.
  }

  if (trimmed.includes("/embed/")) {
    return trimmed;
  }

  const idMatch = trimmed.match(/(\d{6,})/);
  if (idMatch?.[1]) {
    return `https://www.tiktok.com/embed/v2/${idMatch[1]}`;
  }

  return null;
};

export const TikTokPosts = ({ data, parentField = "" }: TikTokPostsProps) => {
  const {
    posts = [],
    heading = "Latest TikToks",
    description,
    profileUrl,
    emptyMessage = "TikToks coming soon. Check back later!",
  } = data || {};

  const processedPosts = posts
    .map((post) => {
      const embedUrl = getEmbedUrl(post.videoUrl);
      if (!embedUrl) {
        return null;
      }

      return {
        ...post,
        embedUrl,
      };
    })
    .filter((post): post is TikTokPostItem & { embedUrl: string } => Boolean(post));

  return (
    <Section>
      <Container size="large">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2
            className="text-4xl font-bold"
            data-tinafield={`${parentField}.heading`}
          >
            {heading}
          </h2>
          {description ? (
            <p
              className="mt-4 text-lg text-gray-600"
              data-tinafield={`${parentField}.description`}
            >
              {description}
            </p>
          ) : null}
          {profileUrl ? (
            <div className="mt-6" data-tinafield={`${parentField}.profileUrl`}>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                Follow on TikTok
              </a>
            </div>
          ) : null}
        </div>

        {processedPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2" data-tinafield={`${parentField}.posts`}>
            {processedPosts.map((post, index) => (
              <div key={post.id} data-tinafield={`${parentField}.posts.${index}`}>
                <div className="relative w-full overflow-hidden rounded-2xl shadow-lg aspect-[9/16]">
                  <iframe
                    src={post.embedUrl}
                    title={post.caption ? post.caption : `TikTok video ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                {post.caption ? (
                  <p className="mt-3 text-sm text-gray-600" data-tinafield={`${parentField}.posts.${index}.caption`}>
                    {post.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-center text-gray-500"
            data-tinafield={`${parentField}.emptyMessage`}
          >
            {emptyMessage}
          </p>
        )}
      </Container>
    </Section>
  );
};

const defaultTikTokPost = {
  id: "example-tiktok",
  videoUrl: "https://www.tiktok.com/@tiktok/video/7230850355674240302",
  caption: "Share a favourite TikTok video by pasting its URL here.",
};

export const tikTokPostsBlockSchema: Template = {
  name: "tiktokPosts",
  label: "TikTok Posts",
  ui: {
    previewSrc: "/blocks/tiktok.png",
    defaultItem: {
      heading: "Latest TikToks",
      description: "A few fun highlights outside of work.",
      emptyMessage: "TikToks coming soon. Check back later!",
      posts: [defaultTikTokPost, defaultTikTokPost],
    },
  },
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      label: "TikTok Profile URL",
      name: "profileUrl",
    },
    {
      type: "string",
      label: "Empty State Message",
      name: "emptyMessage",
    },
    {
      type: "object",
      label: "TikTok Posts",
      name: "posts",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.caption ? item.caption.substring(0, 24) + "..." : item?.id,
          };
        },
        defaultItem: {
          ...defaultTikTokPost,
        },
      },
      fields: [
        {
          type: "string",
          label: "Unique ID",
          name: "id",
          required: true,
        },
        {
          type: "string",
          label: "TikTok Video URL or ID",
          name: "videoUrl",
          required: true,
          description:
            "Paste the TikTok share URL (https://www.tiktok.com/@user/video/...) or the embed URL.",
        },
        {
          type: "string",
          label: "Caption",
          name: "caption",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
  ],
};
