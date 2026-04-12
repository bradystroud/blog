import fs from "fs";
import path from "path";
import matter from "gray-matter";

export { normaliseBlogStatus, isPublishedStatus } from "../../utils/blog-status";
export type { BlogStatus } from "../../utils/blog-status";
import type { BlogStatus } from "../../utils/blog-status";

export interface GitCommit {
  hash: string;
  date: string;
  subject: string;
  body: string;
  files: string[];
  repoName: string;
  repoPath: string;
}

export interface RepoScanResult {
  repoName: string;
  repoPath: string;
  commits: GitCommit[];
  isNewRepo: boolean;
  readmeSnippet?: string;
}

export interface StoryCandidate {
  repoName: string;
  repoPath: string;
  commits: GitCommit[];
  score: number;
  reasons: string[];
  angle: string;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  status: BlogStatus;
  isNewRepo: boolean;
  readmeSnippet?: string;
}

export interface GenerateOptions {
  canonicalBaseUrl?: string;
  status?: BlogStatus;
  now?: Date;
}

const interestingKeywords = [
  { pattern: /\b(ai|llm|agent|copilot|openai|claude|mcp)\b/i, score: 6, reason: "AI/dev-tooling angle" },
  { pattern: /\b(refactor|architecture|pattern|cleanup)\b/i, score: 5, reason: "Architecture/refactor story" },
  { pattern: /\b(fix|debug|bug|incident|perf|performance)\b/i, score: 4, reason: "Bug-fix or debugging story" },
  { pattern: /\b(automation|workflow|script|cron|pipeline)\b/i, score: 5, reason: "Automation workflow" },
  { pattern: /\b(next|react|blazor|maui|dotnet|c#|typescript|bun|tina)\b/i, score: 3, reason: "Matches core tech themes" },
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

export function deriveTags(candidate: Pick<StoryCandidate, "angle" | "title" | "commits">): string[] {
  const haystack = `${candidate.title} ${candidate.angle} ${candidate.commits
    .map((commit) => `${commit.subject} ${commit.body}`)
    .join(" ")}`;

  const tags = new Set<string>();
  const maybeAdd = (condition: boolean, tag: string) => {
    if (condition) tags.add(tag);
  };

  maybeAdd(/ai|agent|copilot|openai|claude|mcp/i.test(haystack), "ai");
  maybeAdd(/automation|workflow|script|cron|pipeline/i.test(haystack), "automation");
  maybeAdd(/debug|bug|incident|fix/i.test(haystack), "debugging");
  maybeAdd(/refactor|architecture|pattern/i.test(haystack), "architecture");
  maybeAdd(/productivity|raycast|tool|developer/i.test(haystack), "productivity");
  maybeAdd(/next|react|tina/i.test(haystack), "nextjs");
  maybeAdd(/dotnet|c#|blazor|maui/i.test(haystack), ".net");

  if (tags.size === 0) tags.add("productivity");
  return Array.from(tags).slice(0, 5);
}

export function summariseAngle(scan: RepoScanResult): string {
  if (scan.isNewRepo) {
    return `New project: what ${scan.repoName} is, why it exists, and the implementation choices behind its first commits.`;
  }

  const subjects = scan.commits.map((commit) => commit.subject).join(" ");

  if (/refactor|architecture|pattern/i.test(subjects)) {
    return `Architecture/refactor story from ${scan.repoName}: what changed, why it was worth doing, and how the new shape improves the codebase.`;
  }

  if (/fix|debug|bug|incident|perf/i.test(subjects)) {
    return `Debugging story from ${scan.repoName}: what went wrong, how it was diagnosed, and the practical fix that came out of it.`;
  }

  if (/automation|workflow|script|cron|pipeline/i.test(subjects)) {
    return `Automation story from ${scan.repoName}: the repetitive problem, the workflow that replaced it, and the payoff.`;
  }

  return `Implementation story from ${scan.repoName}: the problem being solved, the interesting decisions in the commits, and what you learned while building it.`;
}

export function scoreCandidate(scan: RepoScanResult): StoryCandidate {
  let score = 0;
  const reasons: string[] = [];
  const subjects = scan.commits.map((commit) => commit.subject).join(" ");
  const bodies = scan.commits.map((commit) => commit.body).join(" ");
  const filesTouched = new Set(scan.commits.flatMap((commit) => commit.files));

  if (scan.isNewRepo) {
    score += 10;
    reasons.push("New repo detected");
  }

  if (scan.commits.length >= 3) {
    score += 4;
    reasons.push(`Multiple commits (${scan.commits.length})`);
  }

  if (filesTouched.size >= 8) {
    score += 4;
    reasons.push(`Broad change footprint (${filesTouched.size} files)`);
  }

  for (const keyword of interestingKeywords) {
    if (keyword.pattern.test(`${subjects} ${bodies}`)) {
      score += keyword.score;
      reasons.push(keyword.reason);
    }
  }

  if ([...filesTouched].some((file) => /readme|docs\//i.test(file))) {
    score += 2;
    reasons.push("Docs/readme changed");
  }

  if ([...filesTouched].some((file) => /screenshot|image|png|jpg|jpeg|webp/i.test(file))) {
    score += 2;
    reasons.push("Visual assets changed");
  }

  const angle = summariseAngle(scan);
  const title = scan.isNewRepo
    ? `Why I built ${humanizeRepoName(scan.repoName)}`
    : generateTitleFromCommits(scan.repoName, scan.commits.map((commit) => commit.subject));

  const candidate: StoryCandidate = {
    repoName: scan.repoName,
    repoPath: scan.repoPath,
    commits: scan.commits,
    score,
    reasons,
    angle,
    title,
    slug: slugify(title),
    tags: [],
    description: buildDescription(scan.repoName, angle),
    status: "draft",
    isNewRepo: scan.isNewRepo,
    readmeSnippet: scan.readmeSnippet,
  };

  candidate.tags = deriveTags(candidate);
  return candidate;
}

export function sortCandidates(candidates: StoryCandidate[]): StoryCandidate[] {
  return [...candidates].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function readExistingBlogSlugs(contentDir: string): Set<string> {
  if (!fs.existsSync(contentDir)) return new Set();
  return new Set(
    fs
      .readdirSync(contentDir)
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => file.replace(/\.mdx?$/, ""))
  );
}

export function filterNovelCandidates(candidates: StoryCandidate[], existingSlugs: Set<string>): StoryCandidate[] {
  return candidates.filter((candidate) => !existingSlugs.has(candidate.slug));
}

export function buildFrontmatter(candidate: StoryCandidate, options: GenerateOptions = {}): Record<string, unknown> {
  const canonicalBaseUrl = options.canonicalBaseUrl ?? "https://bradystroud.dev";
  const now = options.now ?? new Date();
  const status = options.status ?? candidate.status;

  return {
    canonicalUrl: `${canonicalBaseUrl}/blogs/${candidate.slug}`,
    title: candidate.title,
    description: candidate.description,
    date: now.toISOString(),
    aiCollaboration: true,
    status,
    tags: candidate.tags,
  };
}

export function generateDraftBody(candidate: StoryCandidate): string {
  const commitBullets = candidate.commits
    .slice(0, 8)
    .map((commit) => `- ${commit.subject} (${commit.hash.slice(0, 7)})`)
    .join("\n")
    .replace(/\u007f/g, "`");

  const files = Array.from(new Set(candidate.commits.flatMap((commit) => commit.files))).slice(0, 12);
  const fileBullets = files.length > 0 ? files.map((file) => `- \`${file}\``).join("\n") : "- _No file list captured_";

  const readmeContext = candidate.readmeSnippet
    ? `\n## Repo context\n\n${candidate.readmeSnippet}\n`
    : "";

  return `> Draft generated from repo activity. Review, rewrite in your own voice, and publish when ready.\n\n${candidate.angle}\n\n## Why this looked blog-worthy\n\n${candidate.reasons.map((reason) => `- ${reason}`).join("\n")}\n\n## Commits that triggered this draft\n\n${commitBullets}\n\n## Files worth mentioning\n\n${fileBullets}${readmeContext}\n## Suggested structure\n\n1. The problem or idea\n2. What changed in the repo\n3. The most interesting implementation detail\n4. What you learned / trade-offs\n5. What you would do next\n\n## First draft\n\nI spotted a story worth writing about in **${candidate.repoName}**. The commits pointed to a pattern I care about: practical engineering improvements that are worth sharing because they save time, reduce confusion, or make future work easier.\n\nThe interesting part wasn't just that code changed. It was *why* the change happened, and what the sequence of commits says about the underlying problem.\n\nFrom the commit trail, the main theme looks like this:\n\n- ${candidate.angle}\n\nWhat makes this interesting to me is that it sits right in the overlap of software engineering, automation, and useful developer experience improvements. That's usually where the best blog posts come from because there's a real lesson behind the implementation.\n\nThe next step is to replace this generated draft with the actual story: what happened, what trade-offs mattered, and what someone else can learn from it.\n`;
}

export function serializeMdx(frontmatter: Record<string, unknown>, body: string): string {
  return `${matter.stringify(body.trimStart(), frontmatter).trim()}\n`;
}

export function writeDraftFile(outputPath: string, content: string): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, "utf8");
}

export function humanizeRepoName(repoName: string): string {
  return repoName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function generateTitleFromCommits(repoName: string, subjects: string[]): string {
  const joined = subjects.join(" ");
  if (/automation|workflow|script|cron|pipeline/i.test(joined)) {
    return `How I automated part of ${humanizeRepoName(repoName)}`;
  }
  if (/refactor|architecture|pattern/i.test(joined)) {
    return `What changed in ${humanizeRepoName(repoName)} and why it matters`;
  }
  if (/fix|debug|bug|incident|perf/i.test(joined)) {
    return `A useful debugging story from ${humanizeRepoName(repoName)}`;
  }
  return `What I learned building ${humanizeRepoName(repoName)}`;
}

function buildDescription(repoName: string, angle: string): string {
  const base = `${humanizeRepoName(repoName)}: ${angle}`;
  return base.length <= 160 ? base : `${base.slice(0, 157)}...`;
}

export function readReadmeSnippet(repoPath: string): string | undefined {
  const candidates = ["README.md", "readme.md", "README.mdx"];
  for (const file of candidates) {
    const fullPath = path.join(repoPath, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      return content.split(/\r?\n\r?\n/)[0]?.trim().slice(0, 400);
    }
  }
  return undefined;
}
