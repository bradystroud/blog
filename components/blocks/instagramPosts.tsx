import React from "react";
import Image from "next/image";
import { Section } from "../util/section";
import { Container } from "../util/container";
import { Template } from "tinacms";
import { HoverCard } from "../util/hoverCard";

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  postUrl: string;
  date: string;
}

export const InstagramPosts = ({ data, parentField = "" }) => {
  const { posts = [], heading = "Recent Instagram Posts" } = data;

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container size="large">
        <div className="flex items-baseline justify-between gap-6 mb-10 pb-6 rule-bottom">
          <h2
            data-tinafield={`${parentField}.heading`}
            className="title-font text-3xl sm:text-4xl leading-[1.1] tracking-[-0.03em] text-ink"
          >
            {heading}
          </h2>
          <span className="mono text-xs uppercase tracking-[0.18em] text-ink-mute">
            {posts.length} posts
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={post.id} data-tinafield={`${parentField}.posts.${i}`}>
              <HoverCard
                href={post.postUrl}
                target="_blank"
                className="rounded-sm overflow-hidden"
              >
                <div className="relative h-64 w-full bg-paper">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    sizes="(min-width: 1200px) 33vw, (min-width: 900px) 50vw, 100vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover/card:scale-[1.02]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-ink-soft line-clamp-3">{post.caption}</p>
                  <p className="mono text-xs tabular-nums text-ink-mute mt-3">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </HoverCard>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

const defaultInstagramPost = {
  id: "default-post-1",
  imageUrl: "/images/placeholder.jpg",
  caption: "This is a sample Instagram post caption",
  postUrl: "https://instagram.com/",
  date: "2025-01-01T12:00:00Z",
};

export const instagramPostsBlockSchema: Template = {
  name: "instagramPosts",
  label: "Instagram Posts",
  ui: {
    previewSrc: "/blocks/instagram.png",
    defaultItem: {
      heading: "Recent Instagram Posts",
      posts: [defaultInstagramPost, defaultInstagramPost, defaultInstagramPost],
    },
  },
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "object",
      label: "Posts",
      name: "posts",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.caption
              ? item.caption.substring(0, 20) + "..."
              : "Post",
          };
        },
        defaultItem: {
          ...defaultInstagramPost,
        },
      },
      fields: [
        {
          type: "string",
          label: "Post ID",
          name: "id",
          required: true,
        },
        {
          type: "image",
          label: "Image",
          name: "imageUrl",
          required: true,
        },
        {
          type: "string",
          label: "Caption",
          name: "caption",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          label: "Instagram Post URL",
          name: "postUrl",
          required: true,
        },
        {
          type: "datetime",
          label: "Post Date",
          name: "date",
          required: true,
        },
      ],
    },
  ],
};
