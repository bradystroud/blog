import { Collection } from "tinacms";
import { contentBlockSchema } from "../../components/blocks/content";
import { featureBlockSchema } from "../../components/blocks/features";
import { heroBlockSchema } from "../../components/blocks/hero";
import { instagramFeedSchema } from "../../components/blocks/instagramFeed";
import { projectBlockSchema } from "../../components/blocks/projects";

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
        projectBlockSchema,
        featureBlockSchema,
        contentBlockSchema,
        instagramFeedSchema,
      ],
    },
  ],
};
