import React from "react";
import { Section } from "../util/section";
import type { Template } from "tinacms";

export const InstagramFeed = ({ data, parentField = "" }) => {
  return (
    <Section>
      {/* TODO: Make this cool */}
      <script
        src="https://static.elfsight.com/platform/platform.js"
        data-use-service-core
        defer
      ></script>
      <div
        className="elfsight-app-0bfc5b74-81bb-450a-b2be-d512344de213"
        data-elfsight-app-lazy
      ></div>
    </Section>
  );
};

export const instagramFeedSchema: Template = {
  name: "instagramFeed",
  label: "InstagramFeed",
  ui: {
    defaultItem: {
      username: "bradystroud",
    },
  },
  fields: [
    {
      type: "string",
      label: "Username",
      name: "username",
    },
  ],
};
