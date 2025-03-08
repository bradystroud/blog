import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "../util/section";
import { Container } from "../util/container";
import { Template } from "tinacms";

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
        <h2
          data-tinafield={`${parentField}.heading`}
          className="text-4xl font-bold mb-8 text-center"
        >
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div
              key={post.id}
              data-tinafield={`${parentField}.posts.${i}`}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Link
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-700 line-clamp-3">{post.caption}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
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
  date: new Date().toISOString(),
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
