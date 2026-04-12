import { describe, expect, it } from "bun:test";
import { createResearchDraft, draftPathFromSlug } from "./draft-pipeline";
import { scoreCandidate } from "./commit-to-blog";
import fs from "fs";

const baseScan = {
  repoName: "blog",
  repoPath: "/tmp/blog",
  isNewRepo: true,
  readmeSnippet: "Blog repo",
  commits: [
    {
      hash: "abcdef123456",
      date: "2026-03-09T10:00:00.000Z",
      subject: "feat: add AI workflow automation for timesheet summaries",
      body: "Includes cron support and draft generation.",
      files: ["src/automation.ts", "README.md", "scripts/cron.ts"],
      repoName: "blog",
      repoPath: "/tmp/blog",
    },
  ],
};

describe("draft pipeline", () => {
  it("creates research drafts under content/drafts", () => {
    const candidate = scoreCandidate(baseScan);
    const filePath = draftPathFromSlug(candidate.slug);
    try {
      createResearchDraft(candidate, "Research body", new Date("2026-03-10T00:00:00.000Z"));
      const content = fs.readFileSync(filePath, "utf8");
      expect(content).toContain("stage: research");
      expect(content).toContain("approvedForWriting: false");
      expect(content).toContain("Research body");
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });
});
