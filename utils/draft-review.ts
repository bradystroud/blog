export type DraftStage = "research" | "blog-draft" | "done";

export interface DraftReviewItem {
  slug: string;
  title: string;
  description: string | null;
  stage: DraftStage;
  score: number | null;
  sourceRepos: string[];
  sourceCommits: string[];
  tags: string[];
  approvedForWriting: boolean;
  feedback: string;
  generationCount: number;
  lastGeneratedAt: string | null;
  publishedBlogSlug: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  excerpt: string;
}

export function groupDraftsByStage(items: DraftReviewItem[]): Record<DraftStage, DraftReviewItem[]> {
  return {
    research: items.filter((item) => item.stage === "research"),
    "blog-draft": items.filter((item) => item.stage === "blog-draft"),
    done: items.filter((item) => item.stage === "done"),
  };
}
