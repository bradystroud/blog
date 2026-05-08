import * as React from "react";
import { Actions } from "../util/actions";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import Image from "next/image";

export const Hero = ({ data, parentField }) => {
  return (
    <Section>
      <Container
        size="large"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      >
        <div className="row-start-2 lg:row-start-1 lg:col-span-7 text-left relative">
          {data.tagline && (
            <div
              data-tinafield={`${parentField}.tagline`}
              className="mono mb-8 text-xs uppercase tracking-[0.18em] text-ink-mute flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              {data.tagline}
            </div>
          )}
          {data.headline && (
            <h1
              data-tinafield={`${parentField}.headline`}
              className="title-font mb-8 text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 520' }}
            >
              {data.headline}
            </h1>
          )}
          {data.text && (
            <div
              data-tinafield={`${parentField}.text`}
              className={`prose prose-lg max-w-xl mb-10 text-ink-soft ${
                data.color === "primary" ? `prose-primary` : `dark:prose-dark`
              }`}
            >
              <TinaMarkdown content={data.text} />
            </div>
          )}
          {data.actions && (
            <Actions
              parentField={`${parentField}.actions`}
              className="justify-start py-2"
              actions={data.actions}
            />
          )}
        </div>
        {data.image && (
          <div
            data-tinafield={`${parentField}.image`}
            className="relative row-start-1 lg:col-span-5 flex justify-center lg:justify-end"
          >
            <Image
              className="rounded-sm max-w-sm w-full saturate-[0.95]"
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
