/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig } from "tinacms";

import { BlogCollection } from "./collections/blog";
import { GlobalCollection } from "./collections/global";
import { PageCollection } from "./collections/page";
import { TagCollection } from "./collections/tag";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      static: false,
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
      BlogCollection,
      GlobalCollection,
      TagCollection,
      PageCollection,
    ],
  },
});

export default config;
