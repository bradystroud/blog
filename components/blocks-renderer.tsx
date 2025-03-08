import React from "react";
import type { Page } from "../tina/__generated__/types";
import { Content } from "./blocks/content";
import { Features } from "./blocks/features";
import { Hero } from "./blocks/hero";
import { Projects } from "./blocks/projects";
import { InstagramPosts } from "./blocks/instagramPosts";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  const blockComponents = {
    PageBlocksContent: Content,
    PageBlocksHero: Hero,
    PageBlocksFeatures: Features,
    PageBlocksProjects: Projects,
    PageBlocksInstagramPosts: InstagramPosts,
  };

  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block, i) {
            if (!block || !block.__typename) {
              console.error("Block is undefined, skipping...");
              return null;
            }

            const BlockComponent = blockComponents[block?.__typename];
            if (!BlockComponent) return null;

            return (
              <div data-tinafield={`blocks.${i}`} key={i + block.__typename}>
                <BlockComponent data={block} parentField={`blocks.${i}`} />
              </div>
            );
          })
        : null}
    </>
  );
};
