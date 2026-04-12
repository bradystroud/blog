import { Collection } from "tinacms";

export const DraftCollection: Collection = {
  label: "Draft Pipeline",
  name: "draft",
  path: "content/drafts",
  format: "mdx",
  ui: {
    router: ({ document }) => `/drafts/${document._sys.filename}`,
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      required: true,
      isTitle: true,
    },
    {
      type: "string",
      name: "slug",
      label: "Slug",
      required: true,
    },
    {
      type: "string",
      name: "stage",
      label: "Stage",
      required: true,
      options: [
        { label: "Research", value: "research" },
        { label: "Blog draft", value: "blog-draft" },
        { label: "Done", value: "done" },
      ],
    },
    {
      type: "string",
      name: "description",
      label: "Description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "number",
      name: "score",
      label: "Score",
      required: false,
    },
    {
      type: "string",
      name: "sourceRepos",
      label: "Source Repos",
      list: true,
      required: false,
    },
    {
      type: "string",
      name: "sourceCommits",
      label: "Source Commits",
      list: true,
      required: false,
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      required: false,
      ui: {
        component: "tags",
      },
    },
    {
      type: "boolean",
      name: "approvedForWriting",
      label: "Approved for AI writing",
      required: false,
      ui: {
        component: "toggle",
      },
    },
    {
      type: "string",
      name: "publishedBlogSlug",
      label: "Published Blog Slug",
      required: false,
    },
    {
      type: "datetime",
      name: "createdAt",
      label: "Created At",
      required: false,
    },
    {
      type: "datetime",
      name: "updatedAt",
      label: "Updated At",
      required: false,
    },
    {
      type: "rich-text",
      name: "_body",
      label: "Body",
      isBody: true,
    },
  ],
};
