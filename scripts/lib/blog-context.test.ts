import { describe, expect, it } from "bun:test";
import { loadStyleGuide, selectRelevantBlogExamples } from "./blog-context";

describe("blog rewrite context", () => {
  it("loads the style guide", () => {
    const guide = loadStyleGuide();
    expect(guide).toContain("Brady blog writing guide");
    expect(guide).toContain("Practical beats performative");
  });

  it("selects relevant examples for AI/architecture drafts", () => {
    const examples = selectRelevantBlogExamples("ai automation architecture refactor productivity", 3);
    expect(examples.length).toBeGreaterThan(0);
    const slugs = examples.map((example) => example.slug);
    expect(slugs.some((slug) => ["easy-ai-refactors", "context-locality", "copilot-usage-raycast"].includes(slug))).toBe(true);
  });
});
