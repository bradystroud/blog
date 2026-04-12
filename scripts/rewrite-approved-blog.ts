#!/usr/bin/env bun
import {
  ensureDraftIsApproved,
  loadRewriteContext,
  readDraftBySlug,
  rewriteApprovedDraft,
  writeRewrittenDraft,
} from "./lib/approved-blog-writer";
import { readPipelineDraft, writePipelineDraft } from "./lib/draft-pipeline";

interface Options {
  slug: string;
  model?: string;
  nextStatus?: "review" | "published";
}

function parseArgs(argv: string[]): Options {
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
    throw new Error("Usage: bun run scripts/rewrite-approved-blog.ts --slug <draft-slug> [--model gpt-5-mini] [--nextStatus review]");
  }

  const nextStatusValue = args.get("nextStatus");
  const nextStatus = nextStatusValue === "published" ? "published" : "review";

  return {
    slug,
    model: args.get("model") ?? undefined,
    nextStatus,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const draft = readDraftBySlug(options.slug);
  ensureDraftIsApproved(draft);
  const context = loadRewriteContext(`${JSON.stringify(draft.frontmatter)}\n${draft.body}`);
  const pipelineDraft = readPipelineDraft(options.slug);
  const feedback = typeof pipelineDraft.frontmatter.feedback === "string" ? pipelineDraft.frontmatter.feedback : undefined;

  const rewritten = await rewriteApprovedDraft(draft, context, {
    model: options.model,
    nextStatus: options.nextStatus,
    feedback,
  });
  const outputPath = writeRewrittenDraft(options.slug, rewritten);

  pipelineDraft.frontmatter.stage = "blog-draft";
  pipelineDraft.frontmatter.approvedForWriting = true;
  pipelineDraft.frontmatter.generationCount = (pipelineDraft.frontmatter.generationCount ?? 0) + 1;
  pipelineDraft.frontmatter.lastGeneratedAt = new Date().toISOString();
  pipelineDraft.frontmatter.updatedAt = new Date().toISOString();
  writePipelineDraft(options.slug, pipelineDraft.frontmatter, rewritten);

  console.log(`Rewrote approved draft with AI: ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
