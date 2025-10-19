import React from "react";
import Image from "next/image";
import { Template } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Section } from "../util/section";
import { Container } from "../util/container";

interface AboutHighlight {
  title?: string | null;
  description?: string | null;
}

interface AboutImage {
  src?: string | null;
  alt?: string | null;
  label?: string | null;
}

interface AboutBlockProps {
  data: {
    eyebrow?: string | null;
    heading?: string | null;
    subheading?: string | null;
    body?: unknown;
    highlights?: Array<AboutHighlight | null> | null;
    mainImage?: AboutImage | null;
    accentImages?: Array<AboutImage | null> | null;
  };
  parentField?: string;
}

const ImageTile = ({
  image,
  parentField,
  layoutClass,
}: {
  image?: AboutImage | null;
  parentField: string;
  layoutClass?: string;
}) => {
  if (image?.src) {
    return (
      <div
        data-tinafield={parentField}
        className={`relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-800/70 shadow-lg ${layoutClass}`}
      >
        <Image
          src={image.src}
          alt={image.alt || ""}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 540px, 90vw"
          priority={false}
        />
        {image.label && (
          <span className="absolute bottom-4 left-4 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {image.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      data-tinafield={parentField}
      className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-emerald-400/10 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400 ${layoutClass}`}
    >
      <span>Add an image in Tina</span>
    </div>
  );
};

export const AboutShowcase = ({
  data,
  parentField = "",
}: AboutBlockProps) => {
  return (
    <Section>
      <Container
        size="large"
        width="large"
        className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-24"
      >
        <div className="flex flex-col gap-6 lg:pr-6">
          {data.eyebrow && (
            <p
              data-tinafield={`${parentField}.eyebrow`}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500"
            >
              {data.eyebrow}
            </p>
          )}
          {data.heading && (
            <h2
              data-tinafield={`${parentField}.heading`}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl"
            >
              {data.heading}
            </h2>
          )}
          {data.subheading && (
            <p
              data-tinafield={`${parentField}.subheading`}
              className="text-lg font-medium text-gray-600 dark:text-gray-300"
            >
              {data.subheading}
            </p>
          )}
          {data.body && (
            <div
              data-tinafield={`${parentField}.body`}
              className="prose prose-lg max-w-none text-gray-700 dark:prose-invert"
            >
              <TinaMarkdown content={data.body} />
            </div>
          )}
          {data.highlights && data.highlights.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.highlights.map((item, index) => {
                if (!item) return null;
                return (
                  <div
                    key={index}
                    data-tinafield={`${parentField}.highlights.${index}`}
                    className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-gray-800/60 dark:bg-gray-900/40"
                  >
                    {item.title && (
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageTile
            image={data.mainImage}
            parentField={`${parentField}.mainImage`}
            layoutClass="sm:col-span-2 aspect-[4/5]"
          />
          {data.accentImages?.map((image, index) => (
            <ImageTile
              key={index}
              image={image}
              parentField={`${parentField}.accentImages.${index}`}
              layoutClass="aspect-[5/6]"
            />
          ))}
          {data.accentImages && data.accentImages.length < 2 && (
            <>
              {Array.from({ length: 2 - data.accentImages.length }).map(
                (_, index) => (
                  <ImageTile
                    // index offset ensures key uniqueness when accentImages shorter than 2
                    key={`placeholder-${index}`}
                    parentField={`${parentField}.accentImages.${data.accentImages.length + index}`}
                    layoutClass="aspect-[5/6]"
                  />
                )
              )}
            </>
          )}
          {!data.accentImages && (
            <>
              <ImageTile
                parentField={`${parentField}.accentImages.0`}
                layoutClass="aspect-[5/6]"
              />
              <ImageTile
                parentField={`${parentField}.accentImages.1`}
                layoutClass="aspect-[5/6]"
              />
            </>
          )}
        </div>
      </Container>
    </Section>
  );
};

export const aboutShowcaseBlockSchema: Template = {
  name: "aboutShowcase",
  label: "About Showcase",
  ui: {
    defaultItem: {
      eyebrow: "Meet Brady",
      heading: "Software engineer, leader, and lifelong learner.",
      subheading:
        "A blend of technical depth and human-centered collaboration.",
      body: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                text: "With experience across .NET, MAUI, Blazor, and modern web stacks, I help teams deliver reliable, user-focused software experiences.",
              },
            ],
          },
        ],
      },
      highlights: [
        {
          title: "AI Enthusiast",
          description: "Exploring practical applications of semantic AI and conversational interfaces.",
        },
        {
          title: "Outdoor Explorer",
          description: "From surf to summit—fueling creativity through adventure.",
        },
      ],
      mainImage: {
        src: "",
        alt: "Add a feature image",
        label: "Primary",
      },
      accentImages: [
        {
          src: "",
          alt: "Add an accent image",
          label: "In Action",
        },
        {
          src: "",
          alt: "Add another accent image",
          label: "Off Duty",
        },
      ],
    },
  },
  fields: [
    {
      type: "string",
      label: "Eyebrow",
      name: "eyebrow",
    },
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Subheading",
      name: "subheading",
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },
    {
      type: "object",
      label: "Highlights",
      name: "highlights",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Highlight",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
    {
      type: "object",
      label: "Main Image",
      name: "mainImage",
      fields: [
        {
          type: "image",
          label: "Source",
          name: "src",
        },
        {
          type: "string",
          label: "Alt Text",
          name: "alt",
        },
        {
          type: "string",
          label: "Label",
          name: "label",
        },
      ],
    },
    {
      type: "object",
      label: "Accent Images",
      name: "accentImages",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.label || item?.alt || "Accent Image",
        }),
      },
      fields: [
        {
          type: "image",
          label: "Source",
          name: "src",
        },
        {
          type: "string",
          label: "Alt Text",
          name: "alt",
        },
        {
          type: "string",
          label: "Label",
          name: "label",
        },
      ],
    },
  ],
};
