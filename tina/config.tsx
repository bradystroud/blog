/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from "tinacms";
import { contentBlockSchema } from "../components/blocks/content";
import { featureBlockSchema } from "../components/blocks/features";
import { heroBlockSchema } from "../components/blocks/hero";

// const fetchTags = async () => {
//   const res = await fetch("/content/tags/tags.json");
//   const data = await res.json();
//   const tagOptions = data.tags.map((tag) => ({ value: tag, label: tag }));
// };

// fetchTags();

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [
      {
        label: "Blogs",
        name: "blog",
        path: "content/blogs",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            return `/blogs/${document._sys.filename}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "cannonicalUrl",
            label: "Cannonical URL",
            required: true,
          },
          {
            type: "string",
            isTitle: true,
            label: "Title",
            name: "title",
            required: true,
          },
          {
            type: "datetime",
            label: "Posted Date",
            name: "date",
            ui: {
              dateFormat: "MMMM DD YYYY",
              timeFormat: "hh:mm A",
            },
          },
          {
            type: "object",
            list: true,
            label: "Tags",
            name: "tags",
            fields: [
              {
                type: "string",
                name: "tag",
                label: "Tag",
              },
            ],
          },
          {
            type: "rich-text",
            label: "Body",
            name: "_body",
            isBody: true,
          },
        ],
      },
      {
        label: "Tag - List",
        name: "tag",
        path: "content/tags",
        format: "json",
        fields: [
          {
            type: "object",
            name: "tags",
            list: true,
            label: "Tags",
            ui: {
              itemProps: (item) => {
                console.log(item);

                return { label: item?.name };
              },
            },
            fields: [
              {
                type: "string",
                label: "Name",
                name: "name",
              },
            ],
          },
        ],
      },
      {
        label: "Global",
        name: "global",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
        },
        fields: [
          {
            type: "object",
            label: "Header",
            name: "header",
            fields: [
              {
                type: "string",
                label: "Name",
                name: "name",
              },
              {
                type: "object",
                label: "Nav Links",
                name: "nav",
                list: true,
                ui: {
                  itemProps: (item) => {
                    return { label: item?.label };
                  },
                  defaultItem: {
                    href: "home",
                    label: "Home",
                  },
                },
                fields: [
                  {
                    type: "string",
                    label: "Link",
                    name: "href",
                  },
                  {
                    type: "string",
                    label: "Label",
                    name: "label",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            label: "Footer",
            name: "footer",
            fields: [
              {
                type: "string",
                label: "Color",
                name: "color",
                options: [
                  { label: "Default", value: "default" },
                  { label: "Primary", value: "primary" },
                ],
              },
              {
                type: "object",
                label: "Social Links",
                name: "social",
                fields: [
                  {
                    type: "string",
                    label: "Twitter",
                    name: "twitter",
                  },
                  {
                    type: "string",
                    label: "Instagram",
                    name: "instagram",
                  },
                  {
                    type: "string",
                    label: "Github",
                    name: "github",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Pages",
        name: "page",
        path: "content/pages",
        ui: {
          router: ({ document }) => {
            if (document._sys.filename === "home") {
              return `/`;
            }
            if (document._sys.filename === "about") {
              return `/about`;
            }
            return undefined;
          },
        },
        fields: [
          {
            type: "string",
            name: "cannonicalUrl",
            label: "Cannonical URL",
            required: true,
          },
          {
            type: "string",
            label: "Title",
            name: "title",
            description:
              "The title of the page. This is used to display the title in the CMS",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            list: true,
            name: "blocks",
            label: "Sections",
            ui: {
              visualSelector: true,
            },
            templates: [
              heroBlockSchema,
              // @ts-ignore
              featureBlockSchema,
              contentBlockSchema,
            ],
          },
        ],
      },
    ],
  },
});

export default config;
