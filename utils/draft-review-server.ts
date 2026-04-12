import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DraftReviewItem, DraftStage } from "./draft-review";

const draftsDir = path.resolve(process.cwd(), "content", "drafts");

export function loadDraftReviewItems(): DraftReviewItem[] {
  if (!fs.existsSync(draftsDir)) return [];

  return fs
    .readdirSync(draftsDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const parsed = matter(fs.readFileSync(path.join(draftsDir, file), "utf8"));
      const data = parsed.data as Record<string, unknown>;
      return {
        slug,
        title: String(data.title ?? slug),
        description: typeof data.description === "string" ? data.description : null,
        stage: normaliseStage(data.stage),
        score: typeof data.score === "number" ? data.score : null,
        sourceRepos: toStringArray(data.sourceRepos),
        sourceCommits: toStringArray(data.sourceCommits),
        tags: toStringArray(data.tags),
        approvedForWriting: Boolean(data.approvedForWriting),
        feedback: typeof data.feedback === "string" ? data.feedback : "",
        generationCount: typeof data.generationCount === "number" ? data.generationCount : 0,
        lastGeneratedAt: typeof data.lastGeneratedAt === "string" ? data.lastGeneratedAt : null,
        publishedBlogSlug: typeof data.publishedBlogSlug === "string" ? data.publishedBlogSlug : null,
        createdAt: typeof data.createdAt === "string" ? data.createdAt : null,
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
        excerpt: parsed.content.trim().slice(0, 280),
      } satisfies DraftReviewItem;
    })
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });
}

function normaliseStage(input: unknown): DraftStage {
  if (input === "research" || input === "blog-draft" || input === "done") {
    return input;
  }
  return "research";
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
