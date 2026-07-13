import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { Template } from "tinacms";
import { Container } from "../util/container";
import { Section } from "../util/section";

interface ProjectLink {
  label?: string | null;
  url?: string | null;
}

interface ProjectItem {
  category?: string | null;
  title?: string | null;
  description?: string | null;
  note?: string | null;
  technologies?: Array<string | null> | null;
  links?: Array<ProjectLink | null> | null;
}

interface ProjectsShowcaseProps {
  data: {
    eyebrow?: string | null;
    heading?: string | null;
    introduction?: string | null;
    items?: Array<ProjectItem | null> | null;
  };
  parentField?: string;
}

export const ProjectsShowcase = ({
  data,
  parentField = "",
}: ProjectsShowcaseProps) => {
  return (
    <Section>
      <Container size="large" className="pt-12 sm:pt-20">
        <header className="grid gap-8 pb-14 rule-bottom lg:grid-cols-12 lg:gap-12 lg:pb-20">
          <div className="lg:col-span-8">
            {data.eyebrow && (
              <div
                data-tinafield={`${parentField}.eyebrow`}
                className="mono mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-ink-mute"
              >
                <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
                {data.eyebrow}
              </div>
            )}
            {data.heading && (
              <h1
                data-tinafield={`${parentField}.heading`}
                className="title-font max-w-4xl text-5xl leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-7xl"
              >
                {data.heading}
              </h1>
            )}
          </div>
          {data.introduction && (
            <p
              data-tinafield={`${parentField}.introduction`}
              className="max-w-xl self-end text-lg leading-relaxed text-ink-soft lg:col-span-4 lg:text-xl"
            >
              {data.introduction}
            </p>
          )}
        </header>

        <ol className="divide-y">
          {data.items?.map((project, index) => {
            if (!project) return null;

            return (
              <li
                key={`${project.title}-${index}`}
                data-tinafield={`${parentField}.items.${index}`}
                className="grid gap-6 py-12 sm:py-14 lg:grid-cols-12 lg:gap-10"
              >
                <div className="flex items-baseline justify-between lg:col-span-2 lg:block">
                  <span className="mono text-xs tabular-nums text-ink-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.category && (
                    <p className="mono mt-0 text-xs uppercase tracking-[0.16em] text-ink-mute lg:mt-5">
                      {project.category}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-6">
                  {project.title && (
                    <h2 className="title-font text-3xl leading-tight tracking-[-0.025em] text-ink sm:text-4xl">
                      {project.title}
                    </h2>
                  )}
                  {project.description && (
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
                      {project.description}
                    </p>
                  )}
                  {project.note && (
                    <p className="mt-5 text-sm font-medium text-accent">
                      {project.note}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-7 lg:col-span-4 lg:pl-4">
                  {project.technologies && project.technologies.length > 0 && (
                    <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                      {project.technologies.map((technology) =>
                        technology ? (
                          <li
                            key={technology}
                            className="rounded-full border border-rule px-3 py-1.5 mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-soft"
                          >
                            {technology}
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}

                  {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {project.links.map((link, linkIndex) =>
                        link?.url && link.label ? (
                          <a
                            key={`${link.url}-${linkIndex}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-ink-mute underline-offset-4 transition-colors hover:text-accent"
                          >
                            {link.label}
                            <FaExternalLinkAlt
                              aria-hidden="true"
                              className="h-3 w-3 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/link:-translate-y-0.5 motion-safe:group-hover/link:translate-x-0.5"
                            />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="rule-top pt-8 text-sm text-ink-mute">
          More experiments and open-source work live on{" "}
          <a
            href="https://github.com/bradystroud"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-ink-mute underline-offset-4 transition-colors hover:text-accent"
          >
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </div>
      </Container>
    </Section>
  );
};

export const projectsShowcaseBlockSchema: Template = {
  name: "projectsShowcase",
  label: "Projects Showcase",
  ui: {
    defaultItem: {
      eyebrow: "Selected work",
      heading: "Useful things, built to solve real problems.",
      introduction:
        "A selection of products, open-source projects, and small tools I use every day.",
      items: [],
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
      label: "Introduction",
      name: "introduction",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      label: "Projects",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Project",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Category",
          name: "category",
        },
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
        {
          type: "string",
          label: "Note",
          name: "note",
        },
        {
          type: "string",
          label: "Technologies",
          name: "technologies",
          list: true,
        },
        {
          type: "object",
          label: "Links",
          name: "links",
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label || item?.url || "Link",
            }),
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
            },
            {
              type: "string",
              label: "URL",
              name: "url",
            },
          ],
        },
      ],
    },
  ],
};
