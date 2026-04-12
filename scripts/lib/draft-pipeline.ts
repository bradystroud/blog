import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { StoryCandidate } from "./commit-to-blog";

export type DraftStage = "research" | "blog-draft" | "done";

export interface DraftFrontmatter {
  title: string;
  slug: string;
  stage: DraftStage;
  description?: string;
  score?: number;
  sourceRepos?: string[];
  sourceCommits?: string[];
  tags?: string[];
  approvedForWriting?: boolean;
  feedback?: string;
  generationCount?: number;
  lastGeneratedAt?: string;
  publishedBlogSlug?: string;
  createdAt?: string;
  updatedAt?: string;
}

const draftsDir = path.resolve(process.cwd(), "content", "drafts");
const blogsDir = path.resolve(process.cwd(), "content", "blogs");

export function ensureDraftsDir(): void {
  fs.mkdirSync(draftsDir, { recursive: true });
}

export function draftPathFromSlug(slug: string): string {
  return path.join(draftsDir, `${slug}.mdx`);
}

export function blogPathFromSlug(slug: string): string {
  return path.join(blogsDir, `${slug}.mdx`);
}

export function createResearchDraft(candidate: StoryCandidate, body: string, now = new Date()): string {
  ensureDraftsDir();
  const frontmatter: DraftFrontmatter = {
    title: candidate.title,
    slug: candidate.slug,
    stage: "research",
    description: candidate.description,
    score: candidate.score,
    sourceRepos: [candidate.repoName],
    sourceCommits: candidate.commits.map((commit) => commit.hash.slice(0, 7)),
    tags: candidate.tags,
    approvedForWriting: false,
    feedback: "",
    generationCount: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const filePath = draftPathFromSlug(candidate.slug);
  fs.writeFileSync(filePath, matter.stringify(body.trimStart(), frontmatter).trim() + "\n", "utf8");
  return filePath;
}

export function readPipelineDraft(slug: string): { frontmatter: DraftFrontmatter; body: string; filePath: string } {
  const filePath = draftPathFromSlug(slug);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Draft pipeline file not found: ${filePath}`);
  }

  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  return {
    frontmatter: parsed.data as DraftFrontmatter,
    body: parsed.content,
    filePath,
  };
}

export function writePipelineDraft(slug: string, frontmatter: DraftFrontmatter, body: string): string {
  const filePath = draftPathFromSlug(slug);
  fs.writeFileSync(filePath, matter.stringify(body.trimStart(), frontmatter).trim() + "\n", "utf8");
  return filePath;
}

export function promoteDraftToBlog(slug: string, blogContent: string, publishedBlogSlug?: string): { blogPath: string; draftPath: string } {
  const draft = readPipelineDraft(slug);
  const targetSlug = publishedBlogSlug ?? slug;
  const targetBlogPath = blogPathFromSlug(targetSlug);
  fs.writeFileSync(targetBlogPath, blogContent.trim() + "\n", "utf8");

  draft.frontmatter.stage = "done";
  draft.frontmatter.publishedBlogSlug = targetSlug;
  draft.frontmatter.updatedAt = new Date().toISOString();
  writePipelineDraft(slug, draft.frontmatter, draft.body);

  return {
    blogPath: targetBlogPath,
    draftPath: draft.filePath,
  };
}
