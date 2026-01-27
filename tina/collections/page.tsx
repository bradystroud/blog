import { Collection } from "tinacms";
import { contentBlockSchema } from "../../components/blocks/content";
import { featureBlockSchema } from "../../components/blocks/features";
import { heroBlockSchema } from "../../components/blocks/hero";
import { instagramPostsBlockSchema } from "../../components/blocks/instagramPosts";
import { projectBlockSchema } from "../../components/blocks/projects";
import { aboutShowcaseBlockSchema } from "../../components/blocks/about";

export const PageCollection: Collection = {
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
      name: "canonicalUrl",
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
      type: "string",
      name: "description",
      label: "Meta Description",
      description: "Short description for SEO and social media (150-160 characters recommended)",
      required: false,
      ui: {
        component: "textarea",
      },
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
        projectBlockSchema,
        featureBlockSchema,
        contentBlockSchema,
        instagramPostsBlockSchema,
        aboutShowcaseBlockSchema,
      ],
    },
  ],
};
