import * as React from "react";
import { Actions } from "../util/actions";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { MarkdownLink } from "../util/markdownLink";
import type { Template } from "tinacms";
import Image from "next/image";

export const Hero = ({ data, parentField }) => {
  return (
    <Section>
      <Container
        size="large"
        className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center justify-center"
      >
        <div className="row-start-2 lg:row-start-1 lg:col-span-3 text-center lg:text-left">
          {data.tagline && (
            <h2
              data-tinafield={`${parentField}.tagline`}
              className="relative inline-block px-3 py-1 mb-8 text-md font-bold tracking-wide title-font z-20"
            >
              {data.tagline}
              <span className="absolute w-full h-full left-0 top-0 rounded-full -z-1 bg-current opacity-7"></span>
            </h2>
          )}
          {data.headline && (
            <h1
              data-tinafield={`${parentField}.headline`}
              className={`w-full relative	mb-10 text-5xl font-extrabold tracking-normal leading-tight title-font`}
            >
              <span className={`bg-clip-text`}>{data.headline}</span>
            </h1>
          )}
          {data.text && (
            <div
              data-tinafield={`${parentField}.text`}
              className={`prose prose-lg mx-auto lg:mx-0 mb-10 ${
                data.color === "primary" ? `prose-primary` : `dark:prose-dark`
              }`}
            >
              <TinaMarkdown content={data.text} components={{ a: MarkdownLink }} />
            </div>
          )}
          {data.actions && (
            <Actions
              parentField={`${parentField}.actions`}
              className="justify-center lg:justify-start py-2"
              actions={data.actions}
            />
          )}
        </div>
        {data.image && (
          <div
            data-tinafield={`${parentField}.image`}
            className="relative row-start-1 lg:col-span-2 flex justify-center"
          >
            <Image
              className="relative! z-10 rounded-lg max-w-md xs:max-w-xs"
              alt={data.image.alt}
              src={data.image.src}
              quality={80}
              width={500}
              height={500}
              priority
              placeholder={data.image.blurSrc ? "blur" : "empty"}
              blurDataURL={data.image.blurSrc || undefined}
            />
          </div>
        )}
      </Container>
    </Section>
  );
};

export const heroBlockSchema: Template = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: "This Big Text is Totally Awesome",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
    },
  },
  fields: [
    {
      type: "string",
      label: "Tagline",
      name: "tagline",
    },
    {
      type: "string",
      label: "Headline",
      name: "headline",
    },
    {
      label: "Text",
      name: "text",
      type: "rich-text",
    },
    {
      label: "Actions",
      name: "actions",
      type: "object",
      list: true,
      ui: {
        defaultItem: {
          label: "Action Label",
          type: "button",
          icon: true,
          link: "/",
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string",
        },
        {
          label: "Type",
          name: "type",
          type: "string",
          options: [
            { label: "Button", value: "button" },
            { label: "Link", value: "link" },
          ],
        },
        {
          label: "Icon",
          name: "icon",
          type: "boolean",
        },
        {
          label: "Link",
          name: "link",
          type: "string",
        },
      ],
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
        },
        {
          name: "blurSrc",
          label: "Blur Image Source",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
