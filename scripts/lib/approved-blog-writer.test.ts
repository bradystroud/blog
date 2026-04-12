import { describe, expect, it } from "bun:test";
import { buildSystemPrompt, buildUserPrompt, ensureDraftIsApproved } from "./approved-blog-writer";

const draft = {
  slug: "why-i-built-blog",
  frontmatter: {
    title: "Why I built Blog",
    stage: "research",
    approvedForWriting: false,
    aiCollaboration: true,
    canonicalUrl: "https://bradystroud.dev/blogs/why-i-built-blog",
  },
  body: "## First draft\n\nThis is the rough draft body.",
};

describe("approved blog writer prompts", () => {
  it("builds a strong system prompt", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("Brady Stroud");
    expect(prompt).toContain("valid MDX");
    expect(prompt).toContain("valid MDX");
  });

  it("builds a user prompt with context and draft content", () => {
    const prompt = buildUserPrompt(
      draft,
      {
        aboutPage: "Brady is a software engineer who likes practical automation.",
        styleGuide: "Be practical. Avoid filler.",
        examplePosts: [
          { slug: "context-locality", content: "AI makes architecture more important." },
        ],
      },
      { nextStatus: "review" }
    );

    expect(prompt).toContain("status to `review`");
    expect(prompt).toContain("real blog post");
    expect(prompt).toContain("practical automation");
    expect(prompt).toContain("Be practical. Avoid filler.");
    expect(prompt).toContain("context-locality");
    expect(prompt).toContain("Why I built Blog");
    expect(
      buildUserPrompt(
        draft,
        {
          aboutPage: "Brady is a software engineer who likes practical automation.",
          styleGuide: "Be practical. Avoid filler.",
          examplePosts: [
            { slug: "context-locality", content: "AI makes architecture more important." },
          ],
        },
        { nextStatus: "review", feedback: "Make it more opinionated." }
      )
    ).toContain("Make it more opinionated.");
  });
});

describe("approved draft validation", () => {
  it("allows research/blog-draft but rejects done items", () => {
    expect(() => ensureDraftIsApproved(draft)).not.toThrow();
    expect(() => ensureDraftIsApproved({ ...draft, frontmatter: { ...draft.frontmatter, stage: "blog-draft" } })).not.toThrow();
    expect(() => ensureDraftIsApproved({ ...draft, frontmatter: { ...draft.frontmatter, stage: "done" } })).toThrow();
  });
});
