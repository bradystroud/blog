import React from "react";
import Image from "next/image";
import { Template } from "tinacms";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
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
    body?: TinaMarkdownContent | null;
    highlights?: Array<AboutHighlight | null> | null;
    mainImage?: AboutImage | null;
    accentImages?: Array<AboutImage | null> | null;
  };
  parentField?: string;
}

const FramedImage = ({
  image,
  parentField,
  aspectClass,
  priority = false,
}: {
  image?: AboutImage | null;
  parentField: string;
  aspectClass: string;
  priority?: boolean;
}) => {
  const altText = image?.alt || image?.label || "";

  if (!image?.src) {
    return (
      <figure data-tinafield={parentField} className="flex flex-col gap-3">
        <div
          className={`relative ${aspectClass} flex items-center justify-center rounded-sm border border-dashed border-ink-mute mono text-xs uppercase tracking-[0.18em] text-ink-mute`}
        >
          Awaiting image
        </div>
      </figure>
    );
  }

  const caption = image.label || image.alt;

  return (
    <figure data-tinafield={parentField} className="flex flex-col gap-3">
      <div className={`relative ${aspectClass} overflow-hidden rounded-sm bg-paper`}>
        <Image
          src={image.src}
          alt={altText}
          fill
          sizes="(min-width: 1024px) 480px, 90vw"
          priority={priority}
          className="object-cover saturate-[0.95]"
        />
      </div>
      {caption && (
        <figcaption className="mono text-xs uppercase tracking-[0.18em] text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const AboutShowcase = ({
  data,
  parentField = "",
}: AboutBlockProps) => {
  return (
    <Section>
      <Container size="large" className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7 flex flex-col">
          {data.eyebrow && (
            <div
              data-tinafield={`${parentField}.eyebrow`}
              className="mono mb-8 text-xs uppercase tracking-[0.18em] text-ink-mute flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              {data.eyebrow}
            </div>
          )}
          {data.heading && (
            <h1
              data-tinafield={`${parentField}.heading`}
              className="title-font mb-6 text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 520' }}
            >
              {data.heading}
            </h1>
          )}
          {data.subheading && (
            <p
              data-tinafield={`${parentField}.subheading`}
              className="title-font text-xl sm:text-2xl italic text-ink-soft max-w-xl mb-10"
              style={{ fontVariationSettings: '"opsz" 96, "wght" 400' }}
            >
              {data.subheading}
            </p>
          )}
          {data.body && (
            <div
              data-tinafield={`${parentField}.body`}
              className="prose prose-lg max-w-2xl text-ink-soft mb-16"
            >
              <TinaMarkdown content={data.body} />
            </div>
          )}
          {data.highlights && data.highlights.length > 0 && (
            <div className="border-t border-rule">
              <span className="mono text-xs uppercase tracking-[0.18em] text-ink-mute block mt-10 mb-2">
                What I bring
              </span>
              <ol className="flex flex-col">
                {data.highlights.map((item, index) => {
                  if (!item) return null;
                  return (
                    <li
                      key={index}
                      data-tinafield={`${parentField}.highlights.${index}`}
                      className="grid grid-cols-[auto_1fr] items-baseline gap-6 py-6 rule-bottom"
                    >
                      <span className="mono text-xs tabular-nums w-10 text-right text-ink-mute">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        {item.title && (
                          <h2
                            className="title-font text-2xl sm:text-3xl leading-tight text-ink"
                            style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
                          >
                            {item.title}
                          </h2>
                        )}
                        {item.description && (
                          <p className="mt-3 text-base text-ink-soft leading-relaxed max-w-xl">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
        <aside className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-12 lg:self-start">
          <FramedImage
            image={data.mainImage}
            parentField={`${parentField}.mainImage`}
            aspectClass="aspect-[4/5]"
            priority
          />
          {data.accentImages && data.accentImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {data.accentImages.map((image, index) => (
                <FramedImage
                  key={index}
                  image={image}
                  parentField={`${parentField}.accentImages.${index}`}
                  aspectClass="aspect-[4/5]"
                />
              ))}
            </div>
          )}
        </aside>
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
          description: "From surf to summit, fueling creativity through adventure.",
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
