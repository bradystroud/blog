import { Section } from "../util/section";
import { Container } from "../util/container";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Template } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const Project = ({ data, tinaField, index }) => {
  return (
    <div
      key={index.toString()}
      data-tinafield={tinaField}
      className="flex-1 flex flex-col gap-6 text-center items-center lg:items-start lg:text-left max-w-xl mx-auto"
      style={{ flexBasis: "16rem" }}
    >
      {data.title && (
        <h3
          data-tinafield={`${tinaField}.title`}
          className="text-2xl font-semibold title-font"
        >
          {data.title}
        </h3>
      )}
      {data.text && (
        <p
          data-tinafield={`${tinaField}.text`}
          className="text-base opacity-80 leading-relaxed"
        >
          {data.text}
        </p>
      )}
      {data.url && (
        <a
          href={data.url}
          target="_blank"
          data-tinafield={`${tinaField}.text`}
          className="text-xs opacity-80 leading-relaxed inline-flex items-center hover:text-gray-900 hover:opacity-100"
        >
          <p className="mr-1">Check out {data.title}</p> <FaExternalLinkAlt />
        </a>
      )}
    </div>
  );
};

export const Projects = ({ data, parentField }) => {
  return (
    <Section>
      <Container size="large">
        <h2 className="text-4xl font-semibold text-center mb-9">Projects</h2>
        <div className="w-full prose mx-auto lg:mx-0 mb-10 text-center max-w-full">
          <TinaMarkdown
            content={data.body}
            data-tinafield={`${parentField}.body`}
          />
        </div>
        <div className={`flex flex-wrap gap-x-10 gap-y-8 text-left`}>
          {data.items &&
            data.items.map(function (block: any, i: number) {
              return (
                <Project
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
