import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogStyleExample {
  slug: string;
  title: string;
  tags: string[];
  content: string;
  score: number;
}

const blogsDir = path.resolve(process.cwd(), "content", "blogs");
const styleGuidePath = path.resolve(process.cwd(), "_docs", "blog-style-guide.md");

export function loadStyleGuide(): string {
  return fs.existsSync(styleGuidePath) ? fs.readFileSync(styleGuidePath, "utf8") : "";
}

export function selectRelevantBlogExamples(draftText: string, limit = 3): BlogStyleExample[] {
  if (!fs.existsSync(blogsDir)) return [];

  const draftHaystack = draftText.toLowerCase();
  const files = fs.readdirSync(blogsDir).filter((file) => /\.mdx?$/.test(file));

  const examples = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const content = fs.readFileSync(path.join(blogsDir, file), "utf8");
    const parsed = matter(content);
    const tags = Array.isArray(parsed.data.tags)
      ? parsed.data.tags.filter((tag: unknown): tag is string => typeof tag === "string")
      : [];
    const title = typeof parsed.data.title === "string" ? parsed.data.title : slug;

    const scoringTerms = [slug, title, ...tags];
    let score = 0;
    for (const term of scoringTerms) {
      if (draftHaystack.includes(term.toLowerCase())) score += 3;
    }
    if (/ai|agent|automation|productivity/.test(draftHaystack) && tags.some((tag) => ["ai", "automation", "productivity"].includes(tag))) {
      score += 4;
    }
    if (/debug|bug|incident|fix/.test(draftHaystack) && tags.some((tag) => ["debugging"].includes(tag))) {
      score += 4;
    }
    if (/architecture|refactor|pattern/.test(draftHaystack) && tags.some((tag) => ["architecture", "refactoring", "patterns"].includes(tag))) {
      score += 4;
    }

    return {
      slug,
      title,
      tags,
      content,
      score,
    } satisfies BlogStyleExample;
  });

  return examples
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}
