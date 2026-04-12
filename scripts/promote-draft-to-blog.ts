#!/usr/bin/env bun
import fs from "fs";
import matter from "gray-matter";
import { promoteDraftToBlog, readPipelineDraft } from "./lib/draft-pipeline";

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    args.set(key, value);
  }

  const slug = args.get("slug");
  if (!slug) {
    throw new Error("Usage: bun run scripts/promote-draft-to-blog.ts --slug <draft-slug>");
  }

  return { slug };
}

async function main() {
  const { slug } = parseArgs(process.argv.slice(2));
  const draft = readPipelineDraft(slug);
  if (draft.frontmatter.stage !== "blog-draft") {
    throw new Error(`Draft must be in blog-draft stage before promotion. Current stage: ${draft.frontmatter.stage}`);
  }

  const parsed = matter(draft.body);
  if (!parsed.data.title) {
    throw new Error("Draft body does not contain valid blog frontmatter yet.");
  }

  const result = promoteDraftToBlog(slug, draft.body, parsed.data.slug as string | undefined);
  console.log(`Promoted draft to blog: ${result.blogPath}`);

  const refreshed = readPipelineDraft(slug);
  refreshed.frontmatter.stage = "done";
  refreshed.frontmatter.publishedBlogSlug = (parsed.data.slug as string | undefined) ?? slug;
  refreshed.frontmatter.updatedAt = new Date().toISOString();
  fs.writeFileSync(result.draftPath, matter.stringify(refreshed.body.trimStart(), refreshed.frontmatter).trim() + "\n", "utf8");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
