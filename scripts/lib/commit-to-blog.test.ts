import { describe, expect, it } from "bun:test";
import {
  buildFrontmatter,
  filterNovelCandidates,
  generateDraftBody,
  isPublishedStatus,
  normaliseBlogStatus,
  scoreCandidate,
  serializeMdx,
  slugify,
} from "./commit-to-blog";

const baseScan = {
  repoName: "timesheetgpt",
  repoPath: "/tmp/timesheetgpt",
  isNewRepo: false,
  readmeSnippet: "TimesheetGPT turns daily activity into timesheet drafts.",
  commits: [
    {
      hash: "abcdef123456",
      date: "2026-03-09T10:00:00.000Z",
      subject: "feat: add AI workflow automation for timesheet summaries",
      body: "Includes cron support and draft generation.",
      files: ["src/automation.ts", "README.md", "scripts/cron.ts"],
      repoName: "timesheetgpt",
      repoPath: "/tmp/timesheetgpt",
    },
    {
      hash: "fedcba654321",
      date: "2026-03-09T11:00:00.000Z",
      subject: "refactor: improve architecture for commit ingestion",
      body: "",
      files: ["src/ingest.ts", "src/scoring.ts", "src/types.ts", "docs/design.md", "public/diagram.png"],
      repoName: "timesheetgpt",
      repoPath: "/tmp/timesheetgpt",
    },
  ],
};

describe("blog status helpers", () => {
  it("defaults unknown status to published", () => {
    expect(normaliseBlogStatus(undefined)).toBe("published");
    expect(normaliseBlogStatus("weird")).toBe("published");
    expect(isPublishedStatus(undefined)).toBe(true);
    expect(isPublishedStatus("draft")).toBe(false);
  });
});

describe("slugify", () => {
  it("creates predictable slugs", () => {
    expect(slugify("How I automated part of TimesheetGPT!")).toBe("how-i-automated-part-of-timesheetgpt");
  });
});

describe("candidate scoring", () => {
  it("scores interesting repo activity and derives metadata", () => {
    const candidate = scoreCandidate(baseScan);

    expect(candidate.score).toBeGreaterThanOrEqual(20);
    expect(candidate.title.length).toBeGreaterThan(10);
    expect(candidate.tags).toContain("ai");
    expect(candidate.tags).toContain("automation");
    expect(candidate.tags).toContain("architecture");
  });
});

describe("draft generation", () => {
  it("serializes a draft post with frontmatter and useful context", () => {
    const candidate = scoreCandidate(baseScan);
    const frontmatter = buildFrontmatter(candidate, {
      canonicalBaseUrl: "https://bradystroud.dev",
      status: "draft",
      now: new Date("2026-03-10T00:00:00.000Z"),
    });
    const body = generateDraftBody(candidate);
    const mdx = serializeMdx(frontmatter, body);

    expect(mdx).toContain('status: draft');
    expect(mdx).toContain('aiCollaboration: true');
    expect(mdx).toContain('https://bradystroud.dev/blogs/');
    expect(mdx).toContain('## Commits that triggered this draft');
    expect(mdx).toContain('TimesheetGPT');
  });
});

describe("novel candidate filtering", () => {
  it("skips candidates whose slug already exists", () => {
    const candidate = scoreCandidate(baseScan);
    const fresh = filterNovelCandidates([candidate], new Set());
    const skipped = filterNovelCandidates([candidate], new Set([candidate.slug]));

    expect(fresh).toHaveLength(1);
    expect(skipped).toHaveLength(0);
  });
});
