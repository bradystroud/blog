import { Section } from "../util/section";
import { Container } from "../util/container";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Template } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { HoverCard } from "../util/hoverCard";

export const Project = ({ data, tinaField, index }) => {
  return (
    <div
      key={index.toString()+data.url}
      data-tinafield={tinaField}
      className="flex-1"
      style={{ flexBasis: "16rem" }}
    >
      <HoverCard
        href={data.url}
        target="_blank"
        className="flex flex-col gap-5 text-left h-full p-6 rounded-sm relative"
      >
        <span className="mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute">
          {String(index + 1).padStart(2, "0")}
        </span>
        {data.title && (
          <h3
            data-tinafield={`${tinaField}.title`}
            className="title-font text-2xl font-semibold text-ink motion-safe:transition-colors group-hover/card:text-accent"
          >
            {data.title}
          </h3>
        )}
        {data.text && (
          <p
            data-tinafield={`${tinaField}.text`}
            className="text-base text-ink-soft leading-relaxed"
          >
            {data.text}
          </p>
        )}
        {data.url && (
          <div className="mt-auto inline-flex items-center gap-2 mono text-xs uppercase tracking-[0.18em] text-ink-mute group-hover/card:text-accent transition-colors">
            View project
            <FaExternalLinkAlt aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only">{data.title} (opens in new tab)</span>
          </div>
        )}
      </HoverCard>
    </div>
  );
};

export const Projects = ({ data, parentField }) => {
  return (
    <Section>
      <Container size="large">
        <div className="mb-10 pb-6 rule-bottom">
          <span className="mono text-xs uppercase tracking-[0.18em] text-ink-mute">
            Selected work
          </span>
          <h2
            className="title-font text-3xl sm:text-4xl leading-[1.1] tracking-[-0.03em] text-ink mt-2"
          >
            Projects
          </h2>
          <div className="w-full prose mt-6 max-w-2xl text-ink-soft">
            <TinaMarkdown
              content={data.body}
              data-tinafield={`${parentField}.body`}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-8 text-left">
          {data.items &&
            data.items.map(function (block, i: number) {
              return (
                <Project
                  key={i}
                  tinaField={`${parentField}.items.${i}`}
                  index={i}
                  data={block}
                />
              );
            })}
        </div>
      </Container>
    </Section>
  );
};

const defaultProject = {
  title: "Here's Another Project",
  text: "This is where you might talk about the project, if this wasn't just filler text.",
  icon: {
    color: "",
    style: "float",
    name: "",
  },
};

export const projectBlockSchema: Template = {
  name: "projects",
  label: "Projects",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      items: [defaultProject, defaultProject, defaultProject],
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true,
    },
    {
      type: "object",
      label: "Project Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultProject,
        },
      },
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Text",
          name: "text",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "string",
          label: "Url",
          name: "url",
        },
      ],
    },
  ],
};
