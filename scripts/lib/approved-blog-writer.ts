import fs from "fs";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";
import type { BlogStatus } from "./commit-to-blog";
import { loadStyleGuide, selectRelevantBlogExamples } from "./blog-context";

export interface ApprovedDraftInput {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface RewriteContext {
  aboutPage: string;
  styleGuide: string;
  examplePosts: { slug: string; content: string }[];
}

export interface RewriteOptions {
  model?: string;
  nextStatus?: BlogStatus;
  feedback?: string;
}

const draftsDir = path.resolve(process.cwd(), "content", "drafts");
const pagesDir = path.resolve(process.cwd(), "content", "pages");

export function readDraftBySlug(slug: string): ApprovedDraftInput {
  const draftPath = path.join(draftsDir, `${slug}.mdx`);
  if (!fs.existsSync(draftPath)) {
    throw new Error(`Draft not found: ${draftPath}`);
  }

  const file = fs.readFileSync(draftPath, "utf8");
  const parsed = matter(file);

  return {
    slug,
    frontmatter: parsed.data,
    body: parsed.content,
  };
}

export function ensureDraftIsApproved(draft: ApprovedDraftInput): void {
  const stage = draft.frontmatter.stage;
  if (stage !== "research" && stage !== "blog-draft") {
    throw new Error(`Expected a research/blog-draft pipeline item, got stage '${String(stage)}'`);
  }
}

export function loadRewriteContext(draftText = "", limit = 3): RewriteContext {
  const aboutPath = path.join(pagesDir, "about.md");
  const aboutPage = fs.existsSync(aboutPath) ? fs.readFileSync(aboutPath, "utf8") : "";
  const styleGuide = loadStyleGuide();
  const examplePosts = selectRelevantBlogExamples(draftText, limit).map((post) => ({
    slug: post.slug,
    content: post.content,
  }));

  return { aboutPage, styleGuide, examplePosts };
}

export function buildSystemPrompt(): string {
  return [
    "You are helping rewrite a software engineering blog draft into a publishable post.",
    "Write in Brady Stroud's style: practical, opinionated, useful, concise, and grounded in real engineering work.",
    "Avoid generic AI fluff, fake certainty, and corporate filler.",
    "Prefer a strong real-world hook, concrete examples, and clear takeaways.",
    "Preserve the frontmatter fields unless explicitly improving title/description/tags.",
    "Return ONLY valid MDX with YAML frontmatter.",
    "Use the input draft and supporting context to write a genuine article with a clear narrative, useful specifics, and natural headings.",
  ].join(" ");
}

export function buildUserPrompt(draft: ApprovedDraftInput, context: RewriteContext, options: RewriteOptions = {}): string {
  const nextStatus = options.nextStatus ?? "review";
  const feedbackBlock = options.feedback?.trim()
    ? `\nReviewer feedback to apply carefully:\n${options.feedback.trim()}\n`
    : "";
  return `Rewrite the following approved pipeline draft into a strong, publishable blog article while preserving the spirit of the original repo activity.

Requirements:
- Output valid MDX with YAML frontmatter for a real blog post.
- Use blog frontmatter including: canonicalUrl, title, description, date, aiCollaboration, status, tags.
- Set frontmatter status to \`${nextStatus}\`.
- Keep aiCollaboration: true.
- Choose a sensible canonicalUrl based on the final title/slug.
- Improve the title and description if needed.
- Write like a human engineer who actually did the work.
- Use practical specifics from the commit evidence.
- Remove meta sections like "Why this looked blog-worthy" and replace them with a real article.
- Do not invent external facts.${feedbackBlock}

Writing guide:
${context.styleGuide}

About page context:
${context.aboutPage}

Relevant example posts for style:
${context.examplePosts.map((post) => `--- ${post.slug} ---\n${post.content}`).join("\n\n")}

Pipeline draft to rewrite:
--- ${draft.slug} ---
${matter.stringify(draft.body, draft.frontmatter)}`;
}

export async function rewriteApprovedDraft(
  draft: ApprovedDraftInput,
  context: RewriteContext,
  options: RewriteOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to rewrite approved drafts with AI.");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: options.model ?? "gpt-5-mini",
    input: [
      { role: "system", content: [{ type: "input_text", text: buildSystemPrompt() }] },
      { role: "user", content: [{ type: "input_text", text: buildUserPrompt(draft, context, options) }] },
    ],
  });

  return response.output_text.trim();
}

export function writeRewrittenDraft(slug: string, content: string): string {
  const outputPath = path.join(draftsDir, `${slug}.mdx`);
  fs.writeFileSync(outputPath, content.trim() + "\n", "utf8");
  return outputPath;
}
