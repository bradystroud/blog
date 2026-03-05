#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { findProductLocation } from "./scraper.js";

const server = new McpServer({
  name: "bunnings-mcp",
  version: "1.0.0",
});

server.tool(
  "find_in_store",
  "Search for a product at a Bunnings store and return the aisle/bay location. " +
    "Searches for something similar to your query - doesn't need to be exact. " +
    "Getting close is good enough since similar items are in the same aisle.",
  {
    query: z.string().describe("What you're looking for, e.g. 'chain', 'timber screws', 'garden hose'"),
    store: z
      .string()
      .optional()
      .describe("Bunnings store name or suburb, e.g. 'Alexandria', 'Northland'. Defaults to nearest store."),
  },
  async ({ query, store }) => {
    try {
      const result = await findProductLocation(query, store);
      return {
        content: [
          {
            type: "text" as const,
            text: result,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to find product location: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
