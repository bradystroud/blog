import { Collection } from "tinacms";

export const BlogCollection: Collection = {
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
      type: "image",
      name: "coverImage",
      label: "Cover Image",
      required: false,
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
      // TODO: Do some work here to ensure this is a valid tag (from the tags collection). at a minimum, validate that the tag exists.
      // Ideally provide a dropdown lookup thing of valid tags.
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      ui: {
        component: "tags",
        // validate(value) {
        //   const fetchTags = async () => {
        //     const res = await fetch("/content/tags/tags.json"); //idk where this is on prod
        //     const data = await res.json();
        //     const tagOptions = data.tags.map((tag) => ({
        //       value: tag,
        //       label: tag,
        //     }));

        //     console.log(tagOptions);
        //   };

        //   fetchTags();

        //   if (value && value[0] == "test") {
        //     return "Please add at least one tag";
        //   }
        // },
      },
    },
    {
      type: "rich-text",
      label: "Body",
      name: "_body",
      isBody: true,
    },
  ],
};
