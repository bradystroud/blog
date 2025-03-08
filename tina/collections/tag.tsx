import { Collection } from "tinacms";

export const TagCollection: Collection = {
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
};
