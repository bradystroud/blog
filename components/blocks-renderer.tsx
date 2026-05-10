import React from "react";
import type { Page } from "../tina/__generated__/types";
import { Content } from "./blocks/content";
import { Features } from "./blocks/features";
import { Hero } from "./blocks/hero";
import { Projects } from "./blocks/projects";
import { InstagramPosts } from "./blocks/instagramPosts";
import { AboutShowcase } from "./blocks/about";

type BlockComponent = React.FC<{
  // Each block has its own data shape from the Tina schema; we accept any here
  // and let the leaf component cast/destructure as needed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  parentField: string;
}>;

const blockComponents: Record<string, BlockComponent> = {
  PageBlocksContent: Content,
  PageBlocksHero: Hero,
  PageBlocksFeatures: Features,
  PageBlocksProjects: Projects,
  PageBlocksInstagramPosts: InstagramPosts,
  PageBlocksAboutShowcase: AboutShowcase,
};

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  if (!props.blocks) return null;

  return (
    <>
      {props.blocks.map((block, i) => {
        if (!block || !block.__typename) {
          console.warn("Skipping block with no __typename at index", i);
          return null;
        }

        const BlockComponent = blockComponents[block.__typename];
        if (!BlockComponent) {
          console.warn(
            `No renderer registered for block type "${block.__typename}". Add it to blocks-renderer.tsx.`
          );
          return null;
        }

        return (
          <div data-tinafield={`blocks.${i}`} key={i + block.__typename}>
            <BlockComponent data={block} parentField={`blocks.${i}`} />
          </div>
        );
      })}
    </>
  );
};
