import { describe, expect, it } from "bun:test";
import fs from "fs";
import { draftPathFromSlug } from "../scripts/lib/draft-pipeline";
import { groupDraftsByStage } from "./draft-review";
import { loadDraftReviewItems } from "./draft-review-server";

describe("draft review loader", () => {
  it("loads draft items and groups them by stage", () => {
    const filePath = draftPathFromSlug("review-loader-test");
    try {
      fs.mkdirSync(filePath.replace(/\/[^/]+$/, ""), { recursive: true });
      fs.writeFileSync(
        filePath,
        `---
title: Review Loader Test
slug: review-loader-test
stage: research
score: 10
sourceRepos:
  - blog
sourceCommits:
  - abc1234
tags:
  - ai
approvedForWriting: false
feedback: make it more opinionated
generationCount: 2
lastGeneratedAt: '2026-03-10T01:00:00.000Z'
createdAt: '2026-03-10T00:00:00.000Z'
updatedAt: '2026-03-10T00:00:00.000Z'
---
Hello draft review board.
`,
        "utf8"
      );

      const items = loadDraftReviewItems();
      const target = items.find((item) => item.slug === "review-loader-test");
      expect(target).toBeDefined();
      expect(target?.stage).toBe("research");
      expect(target?.sourceRepos).toContain("blog");
      expect(target?.feedback).toContain("opinionated");
      expect(target?.generationCount).toBe(2);

      const grouped = groupDraftsByStage(items);
      expect(grouped.research.some((item) => item.slug === "review-loader-test")).toBe(true);
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });
});
